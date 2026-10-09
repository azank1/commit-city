import { finishBuild } from '../../lib/city.js';
import { body, handle, json } from '../../lib/http.js';

export const POST = handle(async req => {
  const b = await body<{ ticket: string; plan: string }>(req, 2_000_000);
  return json(await finishBuild(b.ticket, b.plan));
});
