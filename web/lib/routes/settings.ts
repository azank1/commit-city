// An owner's choices about their own cities: repos to leave out, or hide everything.
import { readSettings, writeSettings } from '../city.js';
import { body, handle, HttpError, json } from '../http.js';
import { sessionOf } from '../session.js';

const REPO = /^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9._-]{1,100}$/;

export const GET = handle(async req => {
  const s = sessionOf(req);
  if (!s) throw new HttpError(401, 'sign in with GitHub first');
  return json({ login: s.login, ...(await readSettings(s.login, true)) });
});

export const POST = handle(async req => {
  const s = sessionOf(req);
  if (!s) throw new HttpError(401, 'sign in with GitHub first');
  const b = await body<{ exclude?: unknown; hidden?: unknown }>(req, 64_000);
  const exclude = Array.isArray(b.exclude) ? b.exclude.filter((x): x is string => typeof x === 'string' && REPO.test(x)).slice(0, 500) : [];
  await writeSettings(s.login, { exclude, hidden: b.hidden === true });
  return json({ ok: true });
});
