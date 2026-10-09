// "Sign in with GitHub": an OAuth app with no scopes. The session cookie carries the visitor's token,
// encrypted, so new cities are discovered on their own API quota; it is never stored server-side.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

export interface Session { login: string; id: number; avatar: string; token: string; exp: number }

const COOKIE = 'cc_session';

function key(): Buffer {
  const base = process.env.COMMIT_CITY_SECRET || process.env.GITHUB_CLIENT_SECRET || process.env.BLOB_READ_WRITE_TOKEN || 'dev-only-key';
  return createHash('sha256').update('commit.city/session/v1:' + base).digest();
}

export function sealSession(s: Omit<Session, 'exp'>, days = 30): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([c.update(JSON.stringify({ ...s, exp: Math.floor(Date.now() / 1000) + days * 86400 })), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), data]).toString('base64url');
}

export function openSession(raw: string | undefined): Session | null {
  if (!raw) return null;
  try {
    const b = Buffer.from(raw, 'base64url');
    const d = createDecipheriv('aes-256-gcm', key(), b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    const s = JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()]).toString('utf8')) as Session;
    return s.exp > Date.now() / 1000 ? s : null;
  } catch {
    return null;
  }
}

export function cookies(req: Request): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of (req.headers.get('cookie') ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export const sessionOf = (req: Request) => openSession(cookies(req)[COOKIE]);

export function sessionCookie(value: string | null, maxAgeDays = 30): string {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return value === null ? `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
    : `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeDays * 86400}${secure}`;
}

/** A readable hint for the page chrome (who is signed in); the sealed session stays authoritative. */
export function userCookie(login: string | null, maxAgeDays = 30): string {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return login === null ? `cc_user=; Path=/; SameSite=Lax; Max-Age=0${secure}`
    : `cc_user=${encodeURIComponent(login)}; Path=/; SameSite=Lax; Max-Age=${maxAgeDays * 86400}${secure}`;
}

/** OAuth state and where to return to, for the ten minutes a sign-in may take. */
export function oauthCookie(value: string | null): string {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return value === null ? `cc_oauth=; Path=/api/auth; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
    : `cc_oauth=${value}; Path=/api/auth; HttpOnly; SameSite=Lax; Max-Age=600${secure}`;
}

/** Only same-site paths: never an open redirect. */
export function safeNext(next: string | null | undefined): string {
  return next && /^\/(?!\/)[A-Za-z0-9._~\/?=&%-]*$/.test(next) && !next.includes('\\') ? next : '/';
}
