import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { type Key, pathToRegexp } from 'path-to-regexp';
import { REPO_ROOT } from './helpers';

// vercel.json's redirects, then its rewrites, applied the way Vercel and scripts/dev.mjs apply them
const config = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'web', 'vercel.json'), 'utf8')) as {
  redirects: { source: string; destination: string }[]; rewrites: { source: string; destination: string }[];
};
const compile = (rules: { source: string; destination: string }[]) => rules.map(r => { const keys: Key[] = []; return { re: pathToRegexp(r.source, keys), keys, dest: r.destination }; });
const redirects = compile(config.redirects), rewrites = compile(config.rewrites);
function route(p: string): string | null {
  for (const [kind, rules] of [['redirect', redirects], ['rewrite', rewrites]] as const) {
    for (const r of rules) {
      const m = r.re.exec(p);
      if (!m) continue;
      let dest = r.dest;
      r.keys.forEach((k, i) => { dest = dest.replaceAll(`:${k.name}`, m[i + 1] ?? ''); });
      return `${kind} ${dest}`;
    }
  }
  return null;
}

test('a GitHub URL with commit.city swapped in lands on the city', () => {
  const cases: [string, string | null][] = [
    ['/torvalds', 'rewrite /api/page?t=torvalds'],
    ['/vercel/next.js', 'rewrite /api/page?t=vercel/next.js'],
    ['/vercel/ai/pulls', 'redirect /vercel/ai'],
    ['/vercel/ai/tree/main/packages/ai', 'redirect /vercel/ai'],
    ['/vercel/next.js/commits/canary', 'redirect /vercel/next.js'],
    ['/vercel/ai.git', 'redirect /vercel/ai'],
    ['/orgs/vercel', 'redirect /vercel'],
    ['/orgs/vercel/repositories', 'redirect /vercel'],
    // the site's own paths are left alone
    ['/api/build/repo', null],
    ['/s/f/inter.woff2', null],
    ['/v/app.a63cdb5695.js', null],
    ['/explore', null],
    ['/about', null],
  ];
  for (const [p, want] of cases) assert.equal(route(p), want, p);
});
