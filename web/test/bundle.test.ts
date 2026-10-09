// The TS bundle must produce the same payload as commit_city/bundle.py from the same records.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { aggregate, budgetCaps, bundle, mergeEvents, mineOf } from '../lib/engine/bundle';
import { replayRepo } from '../lib/engine/repo';
import type { RepoRecord } from '../lib/engine/replay';
import { localTransport, Repo, REPO_ROOT, sh, tmpdir } from './helpers';

const DAY = 86400;
const T0 = 1_750_000_000;

function pythonBundle(found: object, records: object[], cfg: Record<string, unknown>) {
  const dir = tmpdir('cc-bundle-');
  fs.mkdirSync(path.join(dir, 'repos'));
  for (const r of records as { repo: string }[]) fs.writeFileSync(path.join(dir, 'repos', r.repo.replace('/', '__') + '.json'), JSON.stringify(r));
  fs.writeFileSync(path.join(dir, 'found.json'), JSON.stringify(found));
  const code = `
import json, sys
from commit_city import bundle
from commit_city.config import Config
cfg = Config(**json.loads(sys.argv[2]))
found = json.load(open(sys.argv[1] + '/found.json'))
print(json.dumps(bundle.build(found, cfg, sys.argv[1], lambda m: None)))`;
  return JSON.parse(sh(REPO_ROOT, ['python3', '-c', code, dir, JSON.stringify(cfg)], { PYTHONPATH: REPO_ROOT }));
}

function makeRepo(dir: string, seed: number) {
  const r = new Repo(dir);
  for (let i = 0; i < 12; i++) r.write(`src/m${i % 3}/deep${i % 2}/f${i}.ts`, 5 + i * seed);
  r.write('README.md', 4).write('a.py', 3).write('b.py', 3).write('c.sh', 2);
  r.commit(T0, 'Ann', '+0530');
  for (let k = 1; k <= 8; k++) {
    r.write(`src/m${k % 3}/deep${k % 2}/f${k}.ts`, 20 + k * seed).write(`new/x${k}.md`, k);
    if (k === 4) r.rm('b.py');
    r.commit(T0 + k * DAY + seed * 600, k % 3 ? 'Ann' : 'Bob', k % 2 ? '+0530' : '-0400');
  }
  return r;
}

test('bundle matches python (aggregation, budgets, epoch, timezone)', async () => {
  const root = tmpdir();
  const records: RepoRecord[] = [];
  const shas: Record<string, string[]> = {};
  for (const [name, seed] of [['me/alpha', 1], ['me/beta', 3], ['other/gamma', 2]] as const) {
    const r = makeRepo(path.join(root, name.replace('/', '_')), seed);
    const bare = r.bare();
    const { record } = await replayRepo({ repo: name, head: r.head(), start: T0 + 2 * DAY, transport: localTransport(bare) });
    records.push(record);
    const ann = sh(r.dir, ['git', 'log', '--author=Ann', '--format=%H']).split('\n').filter(Boolean);
    shas[name] = ann.map(s => s.slice(0, 12));
  }
  const now = T0 + 30 * DAY;
  const start = T0 + 2 * DAY;
  const cfg = { max_files_per_repo: 9, max_files_total: 22, max_repos: 2 };
  const py = pythonBundle(
    { profile: { login: 'ann', name: 'Ann', avatar_url: 'https://x/a.png' }, start, now, contributions: 77, restricted: 5,
      repos: Object.fromEntries(Object.entries(shas).map(([n, s]) => [n, { shas: s }])) },
    records.map(r => ({ repo: r.repo, head: r.head, fp_commits: r.fp_commits, base_t: r.base_t, files: r.files, private: false, fork: false,
      mine: mineOf(r, { shas: new Set(shas[r.repo]) }) })),
    cfg,
  );
  const ts = bundle({
    login: 'ann', name: 'Ann', avatar: 'https://x/a.png', url: 'https://github.com/ann', now, start, contributions: 77, restricted: 5,
    repos: records.map(r => ({ name: r.repo, fork: false, record: r, mine: mineOf(r, { shas: new Set(shas[r.repo]) }) })),
    maxFilesPerRepo: 9, maxFilesTotal: 22, maxRepos: 2,
  });
  for (const k of ['generator', 'generated'] as const) { delete (py as Record<string, unknown>)[k]; delete (ts as Partial<typeof ts>)[k]; }
  assert.deepEqual(ts, py);
  assert.ok(ts.repos.some(r => r.agg > 0), 'aggregation exercised');
});

test('aggregate helpers match the python rules', () => {
  assert.deepEqual(mergeEvents([[1, 5, 3, 0], [2, 7]]), [1, 5, 2, 12, 3, 7]);
  assert.deepEqual(budgetCaps([10, 50, 3], 40, 30), [10, 17, 3]);
  const files: [string, number, number[]][] = Array.from({ length: 30 }, (_, i) => [`f${i}.${i % 2 ? 'ts' : 'md'}`, i % 2 ? 0 : 2, [0, i + 1]]);
  const [out, remap] = aggregate(files, 2);
  assert.deepEqual(out.map(f => f[0]), ['*.md', '*.ts']);
  assert.equal(remap.length, 30);
});
