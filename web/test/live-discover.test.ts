// Live discovery smoke test (network, GitHub GraphQL via your gh token): timing, cost and what gets picked.
// Runs only with DISCOVER set, e.g. `DISCOVER=sindresorhus,vercel,facebook/react npm test -- discover`.
import { test } from 'node:test';
import { discover, type Target } from '../lib/engine/discover';
import { sh } from './helpers';

test('live: discover', { skip: !process.env.DISCOVER }, async () => {
  const token = sh('/', ['gh', 'auth', 'token']).trim();
  for (const t of process.env.DISCOVER!.split(',')) {
    const target: Target = t.includes('/') ? { kind: 'repo', owner: t.split('/')[0], name: t.split('/')[1] } : { kind: 'owner', login: t };
    const t0 = Date.now();
    const d = await discover(target, { token });
    console.log(`${t}: ${d.kind}/${d.mode} ${Date.now() - t0} ms cost ${d.cost} start ${new Date(d.start * 1000).toISOString().slice(0, 10)} contributions ${d.contributions} repos ${d.repos.length} skipped ${d.skipped.length} omitted ${d.omittedRepos}/${d.omittedCommits}`);
    for (const r of d.repos.slice(0, 6)) console.log(`   ${r.name} commits ${r.commits} disk ${Math.round(r.diskKB / 1024)}MB head ${r.head.slice(0, 8)} ${new Date(r.headTime * 1000).toISOString().slice(0, 10)}`);
  }
});
