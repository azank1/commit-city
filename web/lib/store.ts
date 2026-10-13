// Storage: Vercel Blob in production (a public store: everything in it is public GitHub data), a local
// directory in development and tests.
import { BlobNotFoundError, BlobPreconditionFailedError, del as blobDel, get as blobGet, head as blobHead, list as blobList, put as blobPut } from '@vercel/blob';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync, gzipSync } from 'node:zlib';

export interface PutOptions { contentType: string; maxAge?: number; overwrite?: boolean; ifMatch?: string }
export interface Listed { pathname: string; uploadedAt: Date; size: number }
export interface Stat { type: string; etag: string }

/** A conditional write (ifMatch) lost: the blob changed after its etag was read. */
export class StoreConflict extends Error {}

export interface Store {
  get(pathname: string, fresh?: boolean): Promise<Buffer | null>;
  exists(pathname: string): Promise<boolean>;
  /** Content type and etag as the store itself holds them, never a CDN copy; null if there is no such blob. */
  stat(pathname: string): Promise<Stat | null>;
  put(pathname: string, data: Buffer, o: PutOptions): Promise<string>;
  url(pathname: string): string;
  list(prefix: string, limit?: number): Promise<Listed[]>;
  del(pathname: string): Promise<void>;
}

async function readStream(s: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const c of s as unknown as AsyncIterable<Uint8Array>) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks);
}

class BlobStore implements Store {
  private base: string;
  constructor(storeId: string) {
    this.base = `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com`;
  }
  async get(pathname: string, fresh = false) {
    if (fresh) {
      // the SDK's useCache: false only reaches private blobs; for a public one it was silently ignored, so the
      // read-modify-writes behind gallery/recent.json lost entries. A unique query string makes the CDN go back
      // to the store. Errors other than 404 throw: an owner's `hidden` setting must not read as "no settings".
      const r = await fetch(`${this.url(pathname)}?fresh=${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, { cache: 'no-store' });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`blob ${pathname}: HTTP ${r.status}`);
      return Buffer.from(await r.arrayBuffer());
    }
    const r = await blobGet(pathname, { access: 'public' });
    if (!r || r.statusCode !== 200) return null;
    return readStream(r.stream);
  }
  async exists(pathname: string) {
    try { await blobHead(pathname); return true; } catch (e) { if (e instanceof BlobNotFoundError) return false; throw e; }
  }
  async stat(pathname: string) {
    try { const h = await blobHead(pathname); return { type: h.contentType, etag: h.etag }; } catch (e) { if (e instanceof BlobNotFoundError) return null; throw e; }
  }
  async put(pathname: string, data: Buffer, o: PutOptions) {
    try {
      const r = await blobPut(pathname, data, {
        access: 'public', addRandomSuffix: false, allowOverwrite: o.overwrite ?? false,
        contentType: o.contentType, cacheControlMaxAge: o.maxAge ?? 31536000, ...(o.ifMatch ? { ifMatch: o.ifMatch } : {}),
      });
      return r.url;
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError) throw new StoreConflict(`${pathname} changed`);
      throw e;
    }
  }
  url(pathname: string) { return `${this.base}/${pathname}`; }
  async list(prefix: string, limit = 1000) {
    const out: Listed[] = [];
    let cursor: string | undefined;
    do {
      const r = await blobList({ prefix, cursor, limit: Math.min(1000, limit - out.length) });
      for (const b of r.blobs) out.push({ pathname: b.pathname, uploadedAt: new Date(b.uploadedAt), size: b.size });
      cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor && out.length < limit);
    return out;
  }
  async del(pathname: string) { await blobDel(this.url(pathname)); }
}

class DirStore implements Store {
  constructor(private root: string, private urlBase: string) {}
  private file(p: string) {
    const f = path.resolve(this.root, p);
    if (!f.startsWith(path.resolve(this.root) + path.sep)) throw new Error('bad pathname');
    return f;
  }
  async get(p: string) { try { return fs.readFileSync(this.file(p)); } catch { return null; } }
  async exists(p: string) { return fs.existsSync(this.file(p)); }
  async stat(p: string) { return this.statSync(p); }
  private statSync(p: string): Stat | null {
    const f = this.file(p);
    if (!fs.existsSync(f)) return null;
    let type = 'application/octet-stream';
    try { type = fs.readFileSync(f + '.type', 'utf8'); } catch { /* written before types were kept */ }
    return { type, etag: createHash('sha1').update(fs.readFileSync(f)).digest('hex') };
  }
  async put(p: string, data: Buffer, o: PutOptions) {
    const f = this.file(p);
    if (o.ifMatch !== undefined) { if (this.statSync(p)?.etag !== o.ifMatch) throw new StoreConflict(`${p} changed`); }
    else if (!o.overwrite && fs.existsSync(f)) throw new Error(`blob exists: ${p}`);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f + '.tmp', data);
    fs.renameSync(f + '.tmp', f);
    fs.writeFileSync(f + '.type', o.contentType);
    return this.url(p);
  }
  url(p: string) { return `${this.urlBase}/${p}`; }
  async list(prefix: string, limit = 1000) {
    const out: Listed[] = [];
    const walk = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const f = path.join(dir, e.name);
        if (e.isDirectory()) walk(f);
        else if (!e.name.endsWith('.tmp') && !e.name.endsWith('.type')) {
          const rel = path.relative(this.root, f).split(path.sep).join('/');
          if (rel.startsWith(prefix)) { const st = fs.statSync(f); out.push({ pathname: rel, uploadedAt: st.mtime, size: st.size }); }
        }
      }
    };
    walk(this.root);
    return out.sort((a, b) => (a.pathname < b.pathname ? -1 : 1)).slice(0, limit);
  }
  async del(p: string) { fs.rmSync(this.file(p), { force: true }); }
}

let store: Store | null = null;
export function getStore(): Store {
  if (store) return store;
  // a read-write token (vercel_blob_rw_<store id>_<secret>) or, on newer projects, OIDC plus BLOB_STORE_ID
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const id = token ? token.split('_')[3] : process.env.BLOB_STORE_ID?.replace(/^store_/, '');
  store = id ? new BlobStore(id) : new DirStore(process.env.LOCAL_STORE_DIR || path.resolve('.local-store'), '/local-store');
  return store;
}
export function setStore(s: Store) { store = s; }

export async function getJSON<T>(pathname: string, fresh = false): Promise<T | null> {
  const b = await getStore().get(pathname, fresh);
  if (!b) return null;
  return JSON.parse((pathname.endsWith('.gz') ? gunzipSync(b) : b).toString('utf8')) as T;
}

export async function putJSON(pathname: string, value: unknown, o: { maxAge?: number; overwrite?: boolean; type?: string; ifMatch?: string } = {}): Promise<string> {
  const text = Buffer.from(JSON.stringify(value));
  const gz = pathname.endsWith('.gz');
  return getStore().put(pathname, gz ? gzipSync(text, { level: 6 }) : text, {
    contentType: o.type ?? (gz ? 'application/gzip' : 'application/json'), maxAge: o.maxAge, overwrite: o.overwrite, ifMatch: o.ifMatch,
  });
}
