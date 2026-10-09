import { buildRepo } from '../../lib/city.js';
import { body, handle, json } from '../../lib/http.js';

export const POST = handle(async req => {
  const b = await body<{ ticket: string; repo: string }>(req);
  return json(await buildRepo(b.ticket, b.repo));
});
