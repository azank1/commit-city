// The hosted engine must draw the same city as the Python pipeline: replay synthetic repos through a
// real `git upload-pack` (protocol v2, shallow) and compare against commit_city.extract.replay.
import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';
import { GitError } from '../lib/engine/git';
import { replayRepo } from '../lib/engine/repo';
import type { RepoRecord } from '../lib/engine/replay';
import { localTransport, pythonReplay, Repo, tmpdir } from './helpers';

const DAY = 86400;
const T0 = 1_750_000_000;
const GH = '@users.noreply.github.com>';

function scenario(dir: string) {
  const r = new Repo(dir);
  r.write('src/a.ts', 10).write('src/b.py', 5).write('README.md', 3).write('empty.txt', 0, '')
    .write('bin.png', 0, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0, 1, 2, 3, 10, 10]))
    .write('node_modules/x/index.js', 40).write('package-lock.json', 100).write('deep/a/b/c/d.rs', 7);
  r.commit(T0);
  r.write('src/a.ts', 20).rm('src/b.py').write('docs/guide.md', 12).write('src/c', 4);
  r.commit(T0 + 5 * DAY, 'Ann', '+0530');
  r.write('old-only.txt', 2);
  r.commit(T0 + 7 * DAY, 'Cid', '-0300');
  r.checkout('-b', 'feature');
  r.write('feat/x.go', 50).write('README.md', 9);
  r.commit(T0 + 12 * DAY, 'Bob', '-0700');
  r.write('feat/x.go', 30).write('feat/y.go', 3, 'no trailing newline\nsecond\nthird');
  r.commit(T0 + 12 * DAY + 3600, 'Bob', '-0700');
  r.checkout('main');
  r.write('src/a.ts', 15).mv('docs/guide.md', 'docs/manual.md');
  r.commit(T0 + 13 * DAY, 'Ann', '+0530');
  r.merge('feature', T0 + 14 * DAY);
  r.rm('src/c').write('src/c/inner.ts', 6).write('bin.png', 0, Buffer.from([0, 0, 0, 1, 2]));
  r.symlink('README.md', 'link.md');
  r.commit(T0 + 15 * DAY, 'Ann', '+0100');
  r.commit(T0 + 16 * DAY);                                           // empty commit
  r.rm('docs').write('src/a.ts', 0, '');
  r.commit(T0 + 17 * DAY, 'Bob', '-0700');
  r.write('src/a.ts', 3).write('deep/a/b/c/d.rs', 70);
  r.commit(T0 + 18 * DAY, 'Ann', '+0530', T0 + 17 * DAY - 60);      // committer clock earlier than parent
  // attributes: HEAD's .gitattributes decide binary-ness for every commit, as git does in a bare repo
  r.write('.gitattributes', 0, '*.ai binary\n*.dat diff\n/top.txt -diff\nlogs/**/*.log -diff\ntextual.png diff\n')
    .write('assets/photo.png', 0, Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 13, 10, 26, 10, 0, 0, 0, 13]), Buffer.alloc(200, 7)]))
    .write('textual.png', 50)
    .write('art/logo.ai', 30).write('blob.dat', 0, Buffer.from('a\0b\nc\n')).write('top.txt', 4).write('x/top.txt', 4)
    .write('logs/2025/app.log', 9).write('sub/.gitattributes', 0, '*.md -diff\n').write('sub/notes.md', 5).write('sub/k/deep.md', 6);
  r.commit(T0 + 19 * DAY, 'Ann', '+0530');
  // who wrote it: a bot, an agent identity, a Claude Code footer and trailer (CRLF), a bot co-author on a human
  // commit, a trailer after a lone CR (not a line start, so human), and an agent's side branch merged by a human
  r.write('package.json', 2);
  r.commit(T0 + 20 * DAY, `dependabot[bot] <49699333+dependabot[bot]${GH}`, '+0000', undefined, 'Bump x from 1 to 2\n\nSigned-off-by: dependabot[bot] <support@github.com>\n');
  r.write('src/agent.ts', 4);
  r.commit(T0 + 20 * DAY + 600, `Copilot <198982749+Copilot${GH}`, '+0000', undefined, 'Add agent\n\nCo-authored-by: Ann <ann@x.test>\n');
  r.write('src/a.ts', 5);
  r.commit(T0 + 21 * DAY, 'Ann', '+0530', undefined,
    'Refactor a\r\n\r\n\u{1f916} Generated with [Claude Code](https://claude.com/claude-code)\r\n\r\nCo-Authored-By: Claude <noreply@anthropic.com>\r\n');
  r.write('src/a.ts', 6);
  r.commit(T0 + 21 * DAY + 60, 'Ann', '+0530', undefined, `Deps\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]${GH}\n`);
  r.write('src/a.ts', 7);
  r.commit(T0 + 21 * DAY + 120, 'Ann', '+0530', undefined, 'Fix\rCo-authored-by: Claude <noreply@anthropic.com>\n');
  r.checkout('-b', 'cursor/settings-1a2b');
  r.write('src/settings.ts', 9);
  r.commit(T0 + 22 * DAY, 'Cursor Agent <cursoragent@cursor.com>', '+0000', undefined, 'Add settings\n');
  r.checkout('main');
  r.merge('cursor/settings-1a2b', T0 + 22 * DAY + 3600);
  return r;
}

function compare(ts: RepoRecord, py: ReturnType<typeof pythonReplay>) {
  assert.equal(ts.head, py.head);
  assert.equal(ts.base_t, py.base_t);
  assert.equal(ts.fp_commits, py.fp_commits);
  assert.deepEqual(ts.files.map(f => f[0]), py.files.map(f => f[0]));
  assert.deepEqual(ts.files, py.files);
  const mine = new Map(py.mine.map(m => [m[4], m]));
  for (const c of ts.commits) {
    const m = mine.get(c[0]);
    assert.ok(m, `commit ${c[0]} missing from python mine`);
    assert.deepEqual([c[1], c[2], c[4], c[5], c[6]], [m[0], m[1], m[2], m[3], m[5]], `commit ${c[0]}`);
  }
  assert.equal(ts.commits.length, py.mine.length);
}

for (const [label, startOffset] of [['mid-window', 10 * DAY], ['window before history', -DAY], ['after first commit', 2 * DAY]] as const) {
  test(`replay matches python (${label})`, async () => {
    const root = tmpdir();
    const r = scenario(path.join(root, 'repo'));
    const bare = r.bare();
    const start = T0 + startOffset;
    const log: string[] = [];
    const { record, stats } = await replayRepo({ repo: 'test/repo', head: r.head(), start, transport: localTransport(bare, log) });
    const windowShas = record.commits.map(c => c[0]);
    compare(record, pythonReplay(bare, start, windowShas));
    const last = (p: string) => { const f = record.files.find(x => x[0] === p)!; return f[2][f[2].length - 1]; };
    assert.equal(last('art/logo.ai'), 12);           // *.ai binary
    assert.equal(last('blob.dat'), 2);               // diff forces text despite the NUL
    assert.equal(last('top.txt'), 12);               // anchored -diff
    assert.equal(last('x/top.txt'), 4);
    assert.equal(last('logs/2025/app.log'), 12);
    assert.equal(last('sub/k/deep.md'), 12);         // nested attributes file
    const who = record.commits.filter(c => c[1] >= Math.floor((T0 + 20 * DAY) / 60)).map(c => c[6]);
    assert.deepEqual(who, ['bot', 'copilot', 'claude', '', '', 'cursor', '']);
    assert.equal(record.v, 2);
    assert.ok(stats.fetches >= 1 && stats.fetches <= 2, `fetches ${stats.fetches}`);
  });
}

test('a partial fetch (big blobs held back) replays the same city', async () => {
  const root = tmpdir();
  const r = scenario(path.join(root, 'repo'));
  const bare = r.bare();
  const start = T0 + 10 * DAY;
  const log: string[] = [];
  const { record, stats } = await replayRepo({ repo: 'test/repo', head: r.head(), start, transport: localTransport(bare, log), blobLimit: 24 });
  compare(record, pythonReplay(bare, start, record.commits.map(c => c[0])));
  const last = (p: string) => { const f = record.files.find(x => x[0] === p)!; return f[2][f[2].length - 1]; };
  assert.equal(last('assets/photo.png'), 12);      // held back, binary by name
  assert.equal(last('textual.png'), 50);           // held back, but attributes say text: fetched
  assert.ok(log.some(b => b.includes('filter blob:limit=24')), 'the window fetch is filtered');
  const followUp = log.find(b => !b.includes('filter ') && !b.includes('deepen'));
  assert.ok(followUp && /want [0-9a-f]{40}/.test(followUp), 'big text blobs come in a follow-up fetch');
  assert.ok(stats.fetches <= 4, `fetches ${stats.fetches}`);           // window, attributes, base, big blobs
});

test('whole history (start = 0) needs one plain fetch', async () => {
  const root = tmpdir();
  const r = scenario(path.join(root, 'repo'));
  const bare = r.bare();
  const { record, stats } = await replayRepo({ repo: 'test/repo', head: r.head(), start: 0, transport: localTransport(bare) });
  compare(record, pythonReplay(bare, 0, record.commits.map(c => c[0])));
  assert.equal(stats.fetches, 1);
  assert.equal(record.base_t, null);
});

test('a quiet repo (head older than the window) is one snapshot', async () => {
  const root = tmpdir();
  const r = scenario(path.join(root, 'repo'));
  const bare = r.bare();
  const start = T0 + 40 * DAY;
  const { record, stats } = await replayRepo({ repo: 'test/repo', head: r.head(), start, transport: localTransport(bare) });
  compare(record, pythonReplay(bare, start, []));
  assert.equal(stats.fetches, 2);                 // deepen-since selects nothing, then one snapshot
  assert.equal(record.fp_commits, 0);
  assert.equal(record.commits.length, 0);
  // with the head time from discovery, the empty probe is skipped
  const hinted = await replayRepo({ repo: 'test/repo', head: r.head(), headTime: T0 + 17 * DAY - 60, start, transport: localTransport(bare) });
  assert.deepEqual(hinted.record.files, record.files);
  assert.equal(hinted.stats.fetches, 1);
});

test('the base fetch only transfers what the window pack lacks', async () => {
  const root = tmpdir();
  const r = new Repo(path.join(root, 'big'));
  for (let i = 0; i < 300; i++) r.write(`lib/f${i}.ts`, 200 + i);
  r.commit(T0);
  r.write('lib/f1.ts', 5);
  r.commit(T0 + 10 * DAY);
  const bare = r.bare();
  const log: string[] = [];
  const { record, stats } = await replayRepo({ repo: 'test/big', head: r.head(), start: T0 + 5 * DAY, transport: localTransport(bare, log) });
  compare(record, pythonReplay(bare, T0 + 5 * DAY, record.commits.map(c => c[0])));
  assert.equal(stats.fetches, 2);
  assert.ok(log[1].includes('have '), 'second fetch should negotiate');
});

test('a merge of a branch older than the window does not cut the chain short', async () => {
  const root = tmpdir();
  const r = new Repo(path.join(root, 'stale'));
  r.write('main.py', 10).write('lib/a.py', 4);
  r.commit(T0);
  r.checkout('-b', 'stale');
  r.write('stale.txt', 3);
  r.commit(T0 + 1 * DAY, 'Old', '+0200');
  r.checkout('main');
  r.write('main.py', 12);
  const m1 = r.commit(T0 + 2 * DAY);
  r.checkout('-b', 'feat');
  r.write('feat.ts', 8);
  r.commit(T0 + 13 * DAY, 'Bob', '-0700');                       // forked before the window
  r.write('feat.ts', 9).write('lib/a.py', 5);
  r.commit(T0 + 13 * DAY + 7200, 'Bob', '-0700');
  r.checkout('main');
  r.write('main.py', 14);
  r.commit(T0 + 12 * DAY);
  r.merge('stale', T0 + 14 * DAY);                                 // second parent is pre-window
  r.write('lib/b.py', 2);
  r.commit(T0 + 15 * DAY);
  r.merge('feat', T0 + 16 * DAY);
  r.write('main.py', 1);
  r.commit(T0 + 17 * DAY);
  const bare = r.bare();
  const start = T0 + 10 * DAY;
  const log: string[] = [];
  const { record, stats } = await replayRepo({ repo: 'test/stale', head: r.head(), start, transport: localTransport(bare, log) });
  const py = pythonReplay(bare, start, record.commits.map(c => c[0]));
  compare(record, py);
  assert.equal(record.base_t, Math.floor((T0 + 2 * DAY) / 60));   // m1 is where the window starts
  assert.ok(m1);
  assert.ok(!record.partial, record.partial);
  const feat1 = record.commits.find(c => c[1] === Math.floor((T0 + 13 * DAY) / 60))!;
  assert.ok(feat1[4] > 0, 'the first commit of a branch forked before the window still knows its files');
  assert.ok(stats.fetches <= 6, `fetches ${stats.fetches}`);
});

test('a branch merged into a main that was quiet before the window keeps all its commits', async () => {
  // torvalds/uemacs: main untouched since 2021, a year of work on a branch, then one merge. deepen-since makes
  // the merge shallow (its first parent is old) and sends neither parent, so the branch used to vanish.
  const root = tmpdir();
  const r = new Repo(path.join(root, 'quiet'));
  r.write('main.c', 10).write('README', 2);
  r.commit(T0);
  r.write('main.c', 11);
  r.commit(T0 + 1 * DAY);
  r.checkout('-b', 'work');
  const work: string[] = [];
  for (let i = 0; i < 4; i++) {
    r.write('main.c', 12 + i).write(`lib/m${i}.c`, 3 + i);
    work.push(r.commit(T0 + (12 + i) * DAY, 'Linus', '-0700'));
  }
  r.checkout('-b', 'side', work[1]);                                  // a branch merged into the branch
  r.write('side.c', 5);
  const side = r.commit(T0 + 13 * DAY + 3600, 'Ann');
  r.checkout('work');
  const inner = r.merge('side', T0 + 16 * DAY, 'Linus', '-0700');
  r.checkout('main');
  const head = r.merge('work', T0 + 17 * DAY, 'Linus', '-0700');      // first parent: main at T0 + 1 day
  const bare = r.bare();
  const start = T0 + 10 * DAY;
  const { record, stats } = await replayRepo({ repo: 'test/quiet', head, start, transport: localTransport(bare) });
  const got = new Set(record.commits.map(c => c[0]));
  for (const sha of [...work, side, inner, head]) assert.ok(got.has(sha.slice(0, 12)), `missing ${sha.slice(0, 7)}`);
  assert.equal(record.commits.length, 7);
  compare(record, pythonReplay(bare, start, record.commits.map(c => c[0])));
  assert.ok(stats.fetches <= 8, `fetches ${stats.fetches}`);
});

test('a replay that outgrows its memory stops with too_big instead of taking the instance down', async () => {
  const root = tmpdir();
  const r = scenario(path.join(root, 'repo'));
  // any real process is over 1 byte: the guard inside the replay loop must fire after the fetch succeeded
  await assert.rejects(replayRepo({ repo: 'test/repo', head: r.head(), start: 0, transport: localTransport(r.bare()), maxRssBytes: 1 }),
    (e: unknown) => e instanceof GitError && e.code === 'too_big' && /memory/.test(e.message));
});
