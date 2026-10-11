// What a URL path names: a GitHub user or org (`/torvalds`), or a repository (`/facebook/react`).
import type { Target } from './engine/discover.js';
import { HttpError } from './http.js';

const LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$/;
const REPO = /^[A-Za-z0-9._-]{1,100}$/;
export const RESERVED = new Set(['api', 'v', 's', 'u', 'explore', 'events', 'readme', 'about']);   // site paths; GitHub reserves the page names too

export function parseTarget(raw: string | null): Target {
  const t = (raw ?? '').trim().replace(/^\/+|\/+$/g, '').replace(/\.git$/, '');
  const parts = t.split('/');
  if (parts.length === 1 && LOGIN.test(parts[0])) return { kind: 'owner', login: parts[0] };
  if (parts.length === 2 && LOGIN.test(parts[0]) && REPO.test(parts[1]) && parts[1] !== '.' && parts[1] !== '..') {
    return { kind: 'repo', owner: parts[0], name: parts[1] };
  }
  throw new HttpError(400, `not a GitHub user, org or repository: ${t.slice(0, 80)}`);
}

export const targetKey = (t: Target) => (t.kind === 'owner' ? t.login : `${t.owner}/${t.name}`).toLowerCase();

/** Where a city lives: a repo's whole-history city is kept apart from its last-year city. */
export const cityKey = (t: Target, whole = false) => targetKey(t) + (whole && t.kind === 'repo' ? '@all' : '');
export const wantsWhole = (v: string | null) => v === '1' || v === 'true';
