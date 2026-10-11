// The agent lens: the shared rules file, the shared test vectors, and the GitHub-event classifier.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { AGENTS, classify, classifyActor, coauthors, identOf, type Rules } from '../lib/engine/agents';
import { RULES } from '../lib/engine/agents-rules';
import { parseCommit } from '../lib/engine/pack';
import { REPO_ROOT, sh, tmpdir } from './helpers';

const read = (...p: string[]) => JSON.parse(fs.readFileSync(path.join(REPO_ROOT, ...p), 'utf8'));

test('the engine copy of the rules matches schema/agents.json', () => {
  assert.deepEqual(RULES, read('schema', 'agents.json'), 'run: node schema/sync.mjs');
});

test('every rule pattern compiles in JS', () => {
  const rules = read('schema', 'agents.json') as Rules;
  const all = [...rules.agents.flatMap(a => [a.author, a.coauthor, a.message, a.login, a.branch]), rules.bot.author, rules.bot.login]
    .flatMap(ps => ps ?? []);
  assert.ok(all.length > 60);
  for (const p of all) assert.doesNotThrow(() => new RegExp(p, 'i'), p);
});

test('shared cases classify as expected (the Python suite runs the same file)', () => {
  const cases = read('tests', 'fixtures', 'agents-cases.json') as { author: string; message: string; expect: string }[];
  assert.ok(cases.length >= 40);
  for (const c of cases) assert.equal(classify(c.author, c.message) || 'human', c.expect, JSON.stringify(c));
  assert.deepEqual(coauthors('x\n\nCo-authored-by: A <a@x>\r\nco-AUTHORED-by:\tB <b@x> \n  Co-authored-by: C <c@x>\nCo-authored-by D'),
    ['A <a@x>', 'B <b@x>']);
});

test('agent list for labels and colours', () => {
  assert.deepEqual(AGENTS.map(a => a.id), RULES.agents.map(a => a.id));
  assert.deepEqual(AGENTS[0], { id: 'claude', label: 'Claude', color: '#d97757' });
  assert.ok(Object.isFrozen(AGENTS) && Object.isFrozen(AGENTS[0]));
  assert.equal(new Set(AGENTS.map(a => a.color)).size, AGENTS.length, 'distinct colours');
});

test('GitHub event actors: login, then branch, then bot', () => {
  const cases: [string, string | null | undefined, string][] = [
    ['copilot-swe-agent[bot]', undefined, 'copilot'],
    ['Copilot', 'refs/heads/main', 'copilot'],
    ['claude[bot]', null, 'claude'],
    ['devin-ai-integration[bot]', 'refs/heads/devin/1712345678-fix', 'devin'],
    ['google-labs-jules[bot]', null, 'jules'],
    ['chatgpt-codex-connector[bot]', null, 'codex'],
    ['cursor[bot]', null, 'cursor'],
    ['octocat', 'refs/heads/claude/fix-x', 'claude'],
    ['octocat', 'copilot/fix-123', 'copilot'],
    ['octocat', 'refs/heads/codex/add-tests', 'codex'],
    ['octocat', 'refs/heads/cursor/settings-1a2b', 'cursor'],
    ['github-actions[bot]', 'refs/heads/codex/bump', 'codex'],            // an agent's branch beats a bot login
    ['dependabot[bot]', 'refs/heads/dependabot/npm_and_yarn/x-1.2', 'bot'],
    ['renovate-bot', null, 'bot'],
    ['github-actions', null, 'bot'],
    ['octocat', 'refs/heads/feature/claude/x', ''],                      // anchored at the branch start
    ['octocat', 'refs/heads/claudette/x', ''],
    ['claude', 'main', ''],
    ['copilotfan', null, ''],
    ['octocat', '', ''],
  ];
  for (const [login, ref, want] of cases) assert.equal(classifyActor(login, ref), want, `${login} ${ref}`);
});

test("author identities split as git's %an <%ae> does, odd ones included", () => {
  const dir = tmpdir('cc-ident-');
  sh(dir, ['git', 'init', '-q', '--bare']);
  const tree = sh(dir, ['git', 'hash-object', '-w', '-t', 'tree', '--stdin']).trim();
  const raws = ['Ann Lee <ann@x.test>', '  Spacey \t <s@x>', 'No Email', 'A <b> <c>', 'Open <ended', '<only@mail>', 'dependabot[bot] <1+dependabot[bot]@users.noreply.github.com>'];
  for (const raw of raws) {
    const body = `tree ${tree}\nauthor ${raw} 1700000000 +0000\ncommitter C <c@x> 1700000000 +0000\n\nmsg\n`;
    const file = path.join(dir, 'obj');
    fs.writeFileSync(file, body);
    const sha = sh(dir, ['git', 'hash-object', '-w', '-t', 'commit', '--literally', file]).trim();
    const git = sh(dir, ['git', 'log', '--no-walk', '--format=%an <%ae>', sha]).replace(/\n$/, '');
    assert.equal(identOf(raw), git, JSON.stringify(raw));
    assert.equal(parseCommit(sha, Buffer.from(body)).who, raw.startsWith('dependabot') ? 'bot' : '');
  }
});
