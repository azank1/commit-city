// Local stand-in for Vercel: static files from public/, functions from api/ (bundled on demand with
// esbuild), the rewrites and headers from vercel.json, and the local blob store under /local-store.
// usage: GITHUB_TOKEN=... node scripts/dev.mjs [port]
import { build } from 'esbuild';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { pathToRegexp } from 'path-to-regexp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = +(process.argv[2] || process.env.PORT || 3000);
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
process.env.LOCAL_STORE_DIR ||= path.join(root, '.local-store');
process.env.SITE_URL ||= `http://localhost:${port}`;
const outDir = path.join(root, '.dev-out');
fs.mkdirSync(outDir, { recursive: true });

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.gz': 'application/gzip', '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };

const rewrites = config.rewrites.map(r => { const keys = []; return { re: pathToRegexp(r.source, keys), keys, dest: r.destination }; });
const headerRules = (config.headers || []).map(h => ({ re: pathToRegexp(h.source), headers: h.headers }));

const loaded = new Map();
function newest(dir) {
  let m = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    m = Math.max(m, e.isDirectory() ? newest(f) : fs.statSync(f).mtimeMs);
  }
  return m;
}
async function handler(file) {
  const stamp = Math.max(fs.statSync(file).mtimeMs, newest(path.join(root, 'lib')));
  const hit = loaded.get(file);
  if (hit && hit.stamp === stamp) return hit.mod;
  const out = path.join(outDir, path.relative(root, file).replace(/[\/\\]/g, '__').replace(/\.ts$/, `.${Date.now()}.mjs`));
  await build({ entryPoints: [file], bundle: true, platform: 'node', format: 'esm', target: 'node20', outfile: out, packages: 'external', logLevel: 'error' });
  const mod = await import(pathToFileURL(out).href);
  loaded.set(file, { stamp, mod });
  return mod;
}

function staticFile(p) {
  const f = path.resolve(root, 'public', '.' + (p.endsWith('/') ? p + 'index.html' : p));
  if (!f.startsWith(path.join(root, 'public'))) return null;
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  if (fs.existsSync(f + '.html')) return f + '.html';
  return null;
}

async function serve(req, res) {
  const url = new URL(req.url, `http://localhost:${port}`);
  let p = decodeURIComponent(url.pathname);
  const extra = {};
  for (const h of headerRules) if (h.re.exec(p)) for (const { key, value } of h.headers) extra[key] = value;
  if (p.length > 1 && p.endsWith('/')) { res.writeHead(308, { Location: p.slice(0, -1) + url.search }); return res.end(); }
  if (p.startsWith('/local-store/')) {
    const f = path.resolve(process.env.LOCAL_STORE_DIR, '.' + p.slice('/local-store'.length));
    if (!f.startsWith(process.env.LOCAL_STORE_DIR) || !fs.existsSync(f)) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
    return fs.createReadStream(f).pipe(res);
  }
  // filesystem first, as on Vercel
  const sf = staticFile(p);
  if (sf) {
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(sf)] || 'application/octet-stream', ...extra });
    return fs.createReadStream(sf).pipe(res);
  }
  let fn = p.startsWith('/api/') ? path.join(root, p + '.ts') : null;
  if (!fn || !fs.existsSync(fn)) {
    fn = null;
    for (const r of rewrites) {
      const m = r.re.exec(p);
      if (!m) continue;
      let dest = r.dest;
      r.keys.forEach((k, i) => { dest = dest.replaceAll(`:${k.name}`, m[i + 1]); });
      const du = new URL(dest, url);
      for (const [k, v] of url.searchParams) if (!du.searchParams.has(k)) du.searchParams.set(k, v);
      url.pathname = du.pathname; url.search = du.search;
      fn = path.join(root, du.pathname + '.ts');
      break;
    }
  }
  if (!fn || !fs.existsSync(fn)) {
    const nf = staticFile('/404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return nf ? fs.createReadStream(nf).pipe(res) : res.end('not found');
  }
  const mod = await handler(fn);
  const method = req.method === 'HEAD' ? 'GET' : req.method;
  if (!mod[method]) { res.writeHead(405); return res.end(); }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  const request = new Request(url, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
  const t0 = Date.now();
  const response = await mod[method](request);
  const out = { ...extra };
  response.headers.forEach((v, k) => { if (k !== 'set-cookie') out[k] = v; });
  const cookies = response.headers.getSetCookie?.() ?? [];
  if (cookies.length) out['set-cookie'] = cookies;
  res.writeHead(response.status, out);
  if (response.body && req.method !== 'HEAD') for await (const c of response.body) res.write(c);
  res.end();
  console.log(`${req.method} ${p}${url.search} -> ${response.status} ${Date.now() - t0}ms`);
}

http.createServer((req, res) => serve(req, res).catch(e => {
  console.error(e);
  if (!res.headersSent) res.writeHead(500);
  res.end('dev server error');
})).listen(port, () => console.log(`commit.city dev on http://localhost:${port}`));
