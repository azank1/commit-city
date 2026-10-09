import { startBuild } from '../../lib/city.js';
import { body, handle, HttpError, json } from '../../lib/http.js';
import { sessionOf } from '../../lib/session.js';
import { parseTarget } from '../../lib/target.js';

export const POST = handle(async req => {
  const b = await body<{ t?: string; all?: boolean }>(req);
  const target = parseTarget(b.t ?? null);
  const session = sessionOf(req);
  const token = session?.token || process.env.GITHUB_TOKEN;
  if (!token) throw new HttpError(503, 'the builder has no GitHub token configured');
  return json(await startBuild(target, token, { whole: !!b.all && target.kind === 'repo' }));
});
