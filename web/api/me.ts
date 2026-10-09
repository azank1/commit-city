// Who is signed in, if anyone.
import { handle, json } from '../lib/http.js';
import { sessionOf } from '../lib/session.js';

export const GET = handle(async req => {
  const s = sessionOf(req);
  return json(s ? { login: s.login, avatar: s.avatar } : { login: null });
});
