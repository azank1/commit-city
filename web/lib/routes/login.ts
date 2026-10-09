// Sign in with GitHub. No scopes: the token can only read public data, and builds then use the
// visitor's own API quota instead of the site's.
import { randomBytes } from 'node:crypto';
import { handle, HttpError, SITE } from '../http.js';
import { oauthCookie, safeNext } from '../session.js';

export const GET = handle(async req => {
  const id = process.env.GITHUB_CLIENT_ID;
  if (!id) throw new HttpError(503, 'sign-in is not configured');
  const next = safeNext(new URL(req.url).searchParams.get('next'));
  const state = randomBytes(18).toString('base64url');
  const to = new URL('https://github.com/login/oauth/authorize');
  to.searchParams.set('client_id', id);
  to.searchParams.set('redirect_uri', `${SITE}/api/auth/callback`);
  to.searchParams.set('state', state);
  to.searchParams.set('allow_signup', 'true');
  return new Response(null, {
    status: 302,
    headers: { Location: to.toString(), 'Set-Cookie': oauthCookie(`${state}.${Buffer.from(next).toString('base64url')}`), 'Cache-Control': 'no-store' },
  });
});
