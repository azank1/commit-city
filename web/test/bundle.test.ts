// The TS bundle must produce the same payload as commit_city/bundle.py from the same records.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { finishBuild, GALLERY, type GalleryEntry, repoPath } from '../lib/city';
import { aggregate, budgetCaps, bundle, mergeEvents, mineOf, type Payload } from '../lib/engine/bundle';
import { replayRepo } from '../lib/engine/repo';
import type { RepoRecord } from '../lib/engine/replay';
import { sign } from '../lib/secret';
import { getJSON, putJSON, setStore, type Store } from '../lib/store';
import { localTransport, Repo, REPO_ROOT, sh, tmpdir } from './helpers';

const DAY = 86400;
const T0 = 1_750_000_000;
const GH = '@users.noreply.github.com>';

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

// who writes commit k: Ann alone or with an agent (trailer or footer), an agent or a bot as author, or Bob
const AUTHORS: [string, string?][] = [
  ['Ann'], ['Ann', 'x\n\nCo-Authored-By: Claude <noreply@anthropic.com>\n'], [`Copilot <198982749+Copilot${GH}`],
  ['Ann', 'x\n\nGenerated with [Claude Code](https://claude.ai/code)\n'], ['Ann', 'x\n\nCo-authored-by: Cursor Agent <cursoragent@cursor.com>\n'],
  [`dependabot[bot] <49699333+dependabot[bot]${GH}`], ['Ann', `x\n\nCo-authored-by: Copilot <175728472+Copilot${GH}\n`], ['Bob'],
];

function makeRepo(dir: string, seed: number) {
  const r = new Repo(dir);
  for (let i = 0; i < 12; i++) r.write(`src/m${i % 3}/deep${i % 2}/f${i}.ts`, 5 + i * seed);
  r.write('README.md', 4).write('a.py', 3).write('b.py', 3).write('c.sh', 2);
  r.commit(T0, 'Ann', '+0530');
  for (let k = 1; k <= 8; k++) {
    r.write(`src/m${k % 3}/deep${k % 2}/f${k}.ts`, 20 + k * seed).write(`new/x${k}.md`, k);
    if (k === 4) r.rm('b.py');
    const [author, msg] = AUTHORS[k - 1];
    r.commit(T0 + k * DAY + seed * 600, author, k % 2 ? '+0530' : '-0400', undefined, msg);
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
    const notBob = sh(r.dir, ['git', 'log', '--format=%H %an']).split('\n').filter(l => l && !l.endsWith(' Bob'));
    shas[name] = notBob.map(s => s.slice(0, 12));
  }
  const now = T0 + 30 * DAY;
  const start = T0 + 2 * DAY;
  const cfg = { max_files_per_repo: 9, max_files_total: 22, max_repos: 2 };
  const py = pythonBundle(
    { profile: { login: 'ann', name: 'Ann', avatar_url: 'https://x/a.png' }, start, now, contributions: 77, restricted: 5,
      repos: Object.fromEntries(Object.entries(shas).map(([n, s]) => [n, { shas: s }])) },
    records.map(r => ({ v: r.v, repo: r.repo, head: r.head, fp_commits: r.fp_commits, base_t: r.base_t, files: r.files, private: false, fork: false,
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
  assert.deepEqual(ts.who, ['human', 'bot', 'claude', 'copilot', 'cursor']);     // claude and copilot tie: by id
  const w = ts.repos[0].m.map(m => ts.who[m[3] ?? 0]);
  assert.deepEqual(w, ['claude', 'copilot', 'claude', 'cursor', 'bot', 'copilot']);
  assert.ok(ts.repos.every(r => r.m.every(m => m.length === 3 || (m.length === 4 && m[3] > 0))), 'human rows stay 3 long');
});

test('aggregate helpers match the python rules', () => {
  assert.deepEqual(mergeEvents([[1, 5, 3, 0], [2, 7]]), [1, 5, 2, 12, 3, 7]);
  assert.deepEqual(budgetCaps([10, 50, 3], 40, 30), [10, 17, 3]);
  const files: [string, number, number[]][] = Array.from({ length: 30 }, (_, i) => [`f${i}.${i % 2 ? 'ts' : 'md'}`, i % 2 ? 0 : 2, [0, i + 1]]);
  const [out, remap] = aggregate(files, 2);
  assert.deepEqual(out.map(f => f[0]), ['*.md', '*.ts']);
  assert.equal(remap.length, 30);
});

class MemStore implements Store {
  blobs = new Map<string, Buffer>();
  async get(p: string) { return this.blobs.get(p) ?? null; }
  async exists(p: string) { return this.blobs.has(p); }
  async put(p: string, data: Buffer, o: { overwrite?: boolean }) {
    if (!o.overwrite && this.blobs.has(p)) throw new Error(`blob exists: ${p}`);
    this.blobs.set(p, data);
    return this.url(p);
  }
  url(p: string) { return `mem:/${p}`; }
  async list(prefix: string) { return [...this.blobs.keys()].filter(k => k.startsWith(prefix)).map(pathname => ({ pathname, uploadedAt: new Date(0), size: 0 })); }
  async del(p: string) { this.blobs.delete(p); }
}

test('finish step: records of another version are never drawn; meta and gallery count who wrote what', async () => {
  const store = new MemStore();
  setStore(store);
  const r = makeRepo(path.join(tmpdir(), 'alpha'), 1);
  const start = T0 + 2 * DAY;
  const { record } = await replayRepo({ repo: 'me/alpha', head: r.head(), start, transport: localTransport(r.bare()) });
  await putJSON(repoPath('me/alpha', r.head(), false), record);
  // me/beta: a v1 record (6-element touches) where the v2 key is, and one at the old key; neither may be used
  const old = { ...record, repo: 'me/beta', v: 1, commits: record.commits.map(c => c.slice(0, 6)) };
  await putJSON(repoPath('me/beta', 'b'.repeat(40), false), old);
  await putJSON(`repos/me/beta/${'b'.repeat(40)}.json.gz`, old);
  assert.ok(repoPath('me/beta', 'b'.repeat(40), false).endsWith('.v2.json.gz'), 'the key carries the record version');
  const ticket = sign({ k: 'me', t: 'me', s: start, w: false, r: [['me/alpha', r.head(), 0], ['me/beta', 'b'.repeat(40), 0]] }, 600);
  const plan = sign({
    k: 'me', kind: 'org', mode: 'all', s: start, n: T0 + 30 * DAY, p: { login: 'me', name: 'Me', avatar: '', url: '', createdAt: '' },
    c: null, x: 0, o: [1, 900], b: [['me/huge', 900]],
    r: [{ n: 'me/alpha', f: false, c: 7, h: r.head() }, { n: 'me/beta', f: false, c: 5, h: 'b'.repeat(40) }],
  }, 600);
  const meta = await finishBuild(ticket, plan);
  assert.equal(meta.repos, 1);
  assert.equal(meta.commits, 7);                                    // k = 2..8, everyone's
  assert.deepEqual(meta.who, { human: 1, bot: 1, agent: 5, agents: [['claude', 2], ['copilot', 2], ['cursor', 1]] });
  const gallery = (await getJSON<GalleryEntry[]>(GALLERY))!;
  assert.deepEqual([gallery[0].agent, gallery[0].bot], [0.714, 0.143]);
  const payload = (await getJSON<Payload>(`cities/me/${meta.v}.json.gz`))!;
  assert.deepEqual(payload.who, ['human', 'bot', 'claude', 'copilot', 'cursor']);
  // me/beta's record is unusable, so it joins the too-big repo discovery skipped; only the latter is named
  assert.deepEqual([payload.totals.omitted_repos, payload.totals.omitted_commits], [2, 905]);
  assert.deepEqual(payload.totals.too_big, [{ repo: 'me/huge', commits: 900 }]);
});
