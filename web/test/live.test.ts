// Live golden test (network): the TS engine over HTTPS vs the Python replay on a full clone.
// Runs only with LIVE=1, e.g. `LIVE=1 npm test -- live`.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { replayRepo } from '../lib/engine/repo';
import { pythonReplay, sh, tmpdir } from './helpers';

const REPOS = (process.env.LIVE_REPOS || 'vercel/ms,sindresorhus/ky,chalk/chalk,tj/commander.js,psf/requests').split(',');
const START = Math.floor(Date.now() / 1000 / 86400 - 365) * 86400;

for (const repo of REPOS) {
  test(`live: ${repo}`, { skip: !process.env.LIVE }, async () => {
    const head = sh('/', ['git', 'ls-remote', `https://github.com/${repo}`, 'HEAD']).split('\t')[0];
    const { record, stats } = await replayRepo({ repo, head, start: START });
    const root = tmpdir('cc-live-');
    const bare = path.join(root, 'r.git');
    const t0 = Date.now();
    sh(root, ['git', 'clone', '-q', '--bare', '--single-branch', '--no-tags', `https://github.com/${repo}`, bare]);
    const cloneMs = Date.now() - t0;
    const du = sh(root, ['du', '-sk', bare]).split('\t')[0];
    const py = pythonReplay(bare, START, record.commits.map(c => c[0]));
    fs.rmSync(root, { recursive: true, force: true });
    console.log(`${repo}: ts ${stats.ms} ms, ${(stats.packBytes / 1e6).toFixed(1)} MB in ${stats.fetches} fetches, ${stats.objects} objects | ` +
      `full clone ${cloneMs} ms, ${(Number(du) / 1e3).toFixed(1)} MB | files ${record.files.length} commits ${record.commits.length} fp ${record.fp_commits}`);
    assert.equal(record.head, py.head);
    assert.equal(record.base_t, py.base_t);
    assert.equal(record.fp_commits, py.fp_commits);
    assert.deepEqual(record.files, py.files);
    const mine = new Map(py.mine.map(m => [m[4], m]));
    let unknown = 0;
    for (const c of record.commits) {
      const m = mine.get(c[0]);
      assert.ok(m, `commit ${c[0]} missing from python`);
      assert.equal(c[6], m[5], `who wrote ${c[0]}`);
      if (c[4] === 0 && m[2] !== 0) { unknown++; continue; }      // parent beyond the shallow edge
      assert.deepEqual([c[1], c[2], c[4], c[5]], [m[0], m[1], m[2], m[3]], `commit ${c[0]}`);
    }
    if (unknown) console.log(`  ${unknown} commits with parents beyond the shallow edge (files unknown)`);
  });
}
