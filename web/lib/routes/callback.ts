// GitHub sends the visitor back here with a code: trade it for a token, seal it into the session cookie.
import { handle, SITE } from '../http.js';
import { cookies, oauthCookie, safeNext, sealSession, sessionCookie, userCookie } from '../session.js';

const back = (to: string, cookieList: string[]) => {
  const h = new Headers({ Location: to, 'Cache-Control': 'no-store' });
  for (const c of cookieList) h.append('Set-Cookie', c);
  return new Response(null, { status: 302, headers: h });
};

export const GET = handle(async req => {
  const u = new URL(req.url);
  const code = u.searchParams.get('code'), state = u.searchParams.get('state');
  const [want, nextB64] = (cookies(req).cc_oauth ?? '').split('.');
  const next = safeNext(nextB64 ? Buffer.from(nextB64, 'base64url').toString('utf8') : '/');
  const failed = (why: string) => back(`${next}${next.includes('?') ? '&' : '?'}signin=${why}`, [oauthCookie(null)]);
  if (!code || !state || !want || state !== want) return failed('expired');
  const tok = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'commit.city' },
    body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${SITE}/api/auth/callback` }),
    signal: AbortSignal.timeout(10_000),
  }).then(r => r.json() as Promise<{ access_token?: string }>).catch(() => ({} as { access_token?: string }));
  if (!tok.access_token) return failed('denied');
  const user = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tok.access_token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'commit.city' },
    signal: AbortSignal.timeout(10_000),
  }).then(r => (r.ok ? r.json() as Promise<{ login: string; id: number; avatar_url: string }> : null)).catch(() => null);
  if (!user?.login) return failed('denied');
  const sealed = sealSession({ login: user.login, id: user.id, avatar: user.avatar_url, token: tok.access_token });
  return back(next, [sessionCookie(sealed), userCookie(user.login), oauthCookie(null)]);
});
