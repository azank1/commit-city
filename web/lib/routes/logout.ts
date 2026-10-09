import { handle } from '../http.js';
import { sessionCookie, userCookie } from '../session.js';

export const POST = handle(async () => {
  const h = new Headers({ 'Cache-Control': 'no-store' });
  h.append('Set-Cookie', sessionCookie(null));
  h.append('Set-Cookie', userCookie(null));
  return new Response(null, { status: 204, headers: h });
});
