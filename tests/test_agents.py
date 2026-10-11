"""The agent lens offline: the rules file, classification, and `who` through replay, cache and bundle."""
import json
import os
import re
import tempfile
import unittest
import warnings

from commit_city import agents, agents_rules, bundle, config, extract
from test_pipeline import DAY, T0, Repo, read, sh, validate

ROOT = os.path.join(os.path.dirname(__file__), '..')
GH = '@users.noreply.github.com>'


def load(*path):
    return json.loads(read(os.path.join(ROOT, *path)))


def patterns(rules):
    """(where, field, pattern) for every regex in the rules."""
    for a in rules['agents']:
        for k in ('author', 'coauthor', 'message', 'login', 'branch'):
            for p in a.get(k, []):
                yield f'{a["id"]}.{k}', k, p
    for k, ps in rules['bot'].items():
        for p in ps:
            yield f'bot.{k}', k, p


def portability(p, field):
    """Constructs JS (`i`) and Python (re.I | re.A) compile differently, or match differently: \\s is Unicode in
    JS only, `.` stops at CR in JS only, Python's `$` also matches before a final newline, `{,n}` is a
    quantifier in Python only, lookbehind / named / atomic / inline-flag groups and possessives are not shared."""
    out = [] if p.isascii() else ['non-ASCII']
    i, in_class = 0, False
    while i < len(p):
        ch, nxt = p[i], p[i + 1:i + 2]
        if ch == '\\':
            if nxt.isalnum() and nxt not in 'bBdDwWtnr':
                out.append('\\' + nxt)
            i += 2
            continue
        if in_class:
            in_class = ch != ']'
        elif ch == '[':
            in_class = True
            if nxt == ']' or p[i + 1:i + 3] == '^]':
                out.append('empty class')
        elif ch == '.':
            out.append('unescaped .')
        elif ch == '{':
            out.append('counted quantifier')
        elif ch == '(' and nxt == '?' and p[i + 2:i + 3] not in (':', '=', '!'):
            out.append('(?' + p[i + 2:i + 3])
        elif ch in '*+?' and nxt == '+':
            out.append('possessive')
        elif ch == '$' and field == 'message':
            out.append('$ in a message pattern')
        i += 1
    return out


class RulesTest(unittest.TestCase):
    rules = load('schema', 'agents.json')

    def test_shape(self):
        r = self.rules
        self.assertEqual(r['version'], 1)
        ids = [a['id'] for a in r['agents']]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertGreaterEqual(len(ids), 16)
        for a in r['agents']:
            self.assertRegex(a['id'], r'^[a-z0-9]{1,12}$')
            self.assertNotIn(a['id'], ('human', 'bot'))
            self.assertRegex(a['color'], r'^#[0-9a-f]{6}$')
            self.assertTrue(a['label'])
            self.assertTrue(any(a.get(k) for k in ('author', 'coauthor', 'message')), a['id'])
            self.assertLessEqual(set(a), {'id', 'label', 'color', 'author', 'coauthor', 'message', 'login', 'branch'})
        self.assertLessEqual(set(r['bot']), {'author', 'login'})

    def test_every_pattern_compiles_and_is_portable(self):
        n = 0
        for where, field, p in patterns(self.rules):
            with warnings.catch_warnings():
                warnings.simplefilter('error')                  # e.g. FutureWarning: possible nested set
                re.compile(p, agents.FLAGS)
            self.assertEqual(portability(p, field), [], f'{where}: {p}')
            n += 1
        self.assertGreater(n, 60)
        # the lint itself
        self.assertEqual(portability(r'^a\s+b.c$', 'message'), ['\\s', 'unescaped .', '$ in a message pattern'])
        self.assertEqual(portability(r'(?<=x)(?P<n>y)(?>z)a++[^]', 'author'), ['(?<', '(?P', '(?>', 'possessive', 'empty class'])
        self.assertEqual(portability(r'[.$]\.x{,2}', 'login'), ['counted quantifier'])

    def test_generated_copy_matches(self):
        self.assertEqual(agents_rules.RULES, self.rules, 'run: node schema/sync.mjs')


class ClassifyTest(unittest.TestCase):
    def test_shared_cases(self):
        cases = load('tests', 'fixtures', 'agents-cases.json')
        self.assertGreaterEqual(len(cases), 40)
        for c in cases:
            self.assertEqual(agents.classify(c['author'], c['message']) or 'human', c['expect'], c)
        ids = {a['id'] for a in agents_rules.RULES['agents']}
        self.assertEqual({c['expect'] for c in cases}, ids | {'bot', 'human'}, 'every actor has a case')

    def test_coauthors(self):
        msg = 'x\n\nCo-authored-by: A <a@x>\r\nco-AUTHORED-by:\tB <b@x> \n  Co-authored-by: C <c@x>\nCo-authored-by D'
        self.assertEqual(agents.coauthors(msg), ['A <a@x>', 'B <b@x>'])


class LensReplayTest(unittest.TestCase):
    """Commits by a human, a bot and agents, through extract (and its cache) and bundle."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = self.tmp.name
        self.cfg = config.Config()
        r = self.r = Repo(self.root, 'lens')
        r.write('src/app.py', 10)
        self.human = r.commit(T0, 'Start', 'Ann')
        r.write('package.json', 3)
        self.bot = r.commit(T0 + DAY, 'Bump x\n\nSigned-off-by: dependabot[bot] <support@github.com>\n',
                            'dependabot[bot] <49699333+dependabot[bot]' + GH)
        r.write('src/agent.py', 4)
        self.copilot = r.commit(T0 + 2 * DAY, 'Add agent\n\nCo-authored-by: Ann <ann@x.test>\n',
                                'Copilot <198982749+Copilot' + GH)
        r.write('src/app.py', 12)
        self.claude = r.commit(T0 + 3 * DAY, 'Refactor\r\n\r\nGenerated with [Claude Code](https://claude.ai/code)\r\n'
                               '\r\nCo-Authored-By: Claude <noreply@anthropic.com>\r\n', 'Ann')
        r.write('src/app.py', 13)
        self.paired = r.commit(T0 + 4 * DAY, 'Deps\n\nCo-authored-by: renovate[bot] <29139614+renovate[bot]' + GH + '\n', 'Ann')
        r.write('src/app.py', 14)
        self.claude2 = r.commit(T0 + 5 * DAY, 'More\n\nCo-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>', 'Ann')
        self.bare = os.path.join(self.root, 'lens.git')
        sh(self.root, 'git', 'clone', '-q', '--bare', r.dir, self.bare)
        self.all = [self.human, self.bot, self.copilot, self.claude, self.paired, self.claude2]

    def tearDown(self):
        self.tmp.cleanup()

    def test_replay_records_who(self):
        rec = extract.replay(self.bare, T0 - DAY, self.all, extract.make_keep(self.cfg), extract.lang_table({}))
        self.assertEqual(rec['v'], extract.RECORD_VERSION)
        who = {m[4]: m[5] for m in rec['mine']}
        self.assertEqual([who[s[:12]] for s in self.all], ['', 'bot', 'copilot', 'claude', '', 'claude'])

    def test_payload_and_cache(self):
        cache = os.path.join(self.root, 'cache')
        found = {'profile': {'login': 'ann', 'name': 'Ann', 'avatar_url': 'https://x.test/a.png'},
                 'start': T0 - DAY, 'now': T0 + 9 * DAY, 'contributions': None, 'restricted': 0,
                 'repos': {'ann/lens': {'shas': self.all, 'clone_url': self.bare, 'size_kb': 1}}}
        self.assertEqual(extract.extract_all(found, self.cfg, cache, None, lambda m: None), [])
        payload = bundle.build(found, self.cfg, cache, lambda m: None)
        validate(payload, load('schema', 'lapse.schema.json'))
        self.assertEqual(payload['who'], ['human', 'bot', 'claude', 'copilot'])
        m = payload['repos'][0]['m']
        self.assertEqual([row[3] if len(row) == 4 else 0 for row in m], [0, 1, 3, 2, 0, 2])
        # a record cached in an older shape is extracted again, never reused or drawn
        path = os.path.join(cache, 'repos', 'ann__lens.json')
        rec = json.loads(read(path))
        old = {**rec, 'v': 1, 'mine': [m[:5] for m in rec['mine']]}
        with open(path, 'w') as f:
            json.dump(old, f)
        with self.assertRaises(SystemExit):
            bundle.build(found, self.cfg, cache, lambda m: None)
        logs = []
        extract.extract_all(found, self.cfg, cache, None, logs.append)
        self.assertFalse(any('unchanged' in m for m in logs), logs)
        self.assertEqual(bundle.build(found, self.cfg, cache, lambda m: None)['who'], payload['who'])
        logs = []
        extract.extract_all(found, self.cfg, cache, None, logs.append)
        self.assertTrue(all('unchanged' in m for m in logs), logs)

    def test_ranking_ties_and_absent_bot(self):
        recs = [{'mine': [[0, 0, 0, [], 'a', 'cursor'], [0, 0, 0, [], 'b', 'copilot'], [0, 0, 0, [], 'c', ''],
                          [0, 0, 0, [], 'd', 'devin'], [0, 0, 0, [], 'e', 'devin']]}]
        self.assertEqual(bundle.actors(recs), ['human', 'devin', 'copilot', 'cursor'])
        self.assertEqual(bundle.actors([{'mine': []}]), ['human'])


if __name__ == '__main__':
    unittest.main()
