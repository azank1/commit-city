// Status of a city: ready (with its payload URL), missing, or hidden.
import { readMeta, readSettings } from '../city.js';
import { handle, json } from '../http.js';
import { cityKey, parseTarget, wantsWhole } from '../target.js';

export const GET = handle(async req => {
  const u = new URL(req.url);
  const target = parseTarget(u.searchParams.get('t'));
  const key = cityKey(target, wantsWhole(u.searchParams.get('all')));
  const fresh = u.searchParams.has('fresh');
  const owner = target.kind === 'owner' ? target.login : target.owner;
  const [meta, settings] = await Promise.all([readMeta(key, fresh), readSettings(owner)]);
  if (settings.hidden) return json({ status: 'hidden' }, 200, fresh ? {} : { 'Cache-Control': 'public, s-maxage=60' });
  const m = meta ?? (fresh ? null : await readMeta(key, true));
  if (!m) return json({ status: 'missing' });
  return json({ status: 'ready', meta: m }, 200, fresh ? {} : { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' });
});
