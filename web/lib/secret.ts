// Signed tokens (build tickets, sessions). The key is derived from secrets the deployment already holds,
// so there is no extra secret to manage.
import { createHmac, timingSafeEqual } from 'node:crypto';

function key(): string {
  const base = process.env.COMMIT_CITY_SECRET || process.env.BLOB_READ_WRITE_TOKEN || process.env.GITHUB_CLIENT_SECRET;
  if (!base) {
    if (process.env.VERCEL_ENV === 'production') throw new Error('no signing secret configured');
    return 'dev-only-key';
  }
  return createHmac('sha256', 'commit.city/signing/v1').update(base).digest('hex');
}

const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url');

export function sign(obj: unknown, ttlSeconds: number): string {
  const payload = b64(JSON.stringify({ ...(obj as object), exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  return `${payload}.${b64(createHmac('sha256', key()).update(payload).digest())}`;
}

export function verify<T>(token: string | null | undefined): (T & { exp: number }) | null {
  if (!token || typeof token !== 'string') return null;
  const [payload, mac] = token.split('.');
  if (!payload || !mac) return null;
  const want = createHmac('sha256', key()).update(payload).digest();
  const got = Buffer.from(mac, 'base64url');
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  const obj = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as T & { exp: number };
  return obj.exp > Date.now() / 1000 ? obj : null;
}
