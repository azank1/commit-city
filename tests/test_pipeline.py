"""Offline tests: synthetic git repos stand in for GitHub (no network, no token)."""
import json
import os
import subprocess
import tempfile
import unittest


def write(path, text):
    with open(path, 'w') as f:
        f.write(text)


def read(path):
    with open(path) as f:
        return f.read()

from commit_city import bundle, config, extract, render

DAY = 86400
T0 = 1_750_000_000                      # 2025-06-15, an arbitrary fixed origin


def sh(cwd, *args, env=None):
    return subprocess.run(args, cwd=cwd, check=True, capture_output=True, text=True,
                          env={**os.environ, **(env or {})}).stdout


class Repo:
    """A scratch repo where each commit gets an explicit time, author and timezone."""

    def __init__(self, root, name):
        self.dir = os.path.join(root, name)
        os.makedirs(self.dir)
        sh(self.dir, 'git', 'init', '-q', '-b', 'main')

    def write(self, path, lines=None, data=None):
        full = os.path.join(self.dir, path)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        if data is not None:
            with open(full, 'wb') as f:
                f.write(data)
        else:
            with open(full, 'w') as f:
                f.write(''.join(f'line {i}\n' for i in range(lines)))

    def rm(self, path):
        sh(self.dir, 'git', 'rm', '-q', path)

    def commit(self, ts, msg='c', author='Ann', tz='+0000'):
        sh(self.dir, 'git', 'add', '-A')
        stamp = f'{ts} {tz}'
        env = {'GIT_AUTHOR_DATE': stamp, 'GIT_COMMITTER_DATE': stamp, 'GIT_AUTHOR_NAME': author,
               'GIT_AUTHOR_EMAIL': f'{author.lower()}@x.test', 'GIT_COMMITTER_NAME': author,
               'GIT_COMMITTER_EMAIL': f'{author.lower()}@x.test'}
        sh(self.dir, 'git', 'commit', '-q', '--allow-empty', '-m', msg, env=env)
        return sh(self.dir, 'git', 'rev-parse', 'HEAD').strip()

    def head_state(self, keep):
        """{path: lines} at HEAD, the ground truth replay must reproduce."""
        out = {}
        for p in sh(self.dir, 'git', 'ls-files').split('\n'):
            if p and keep(p):
                with open(os.path.join(self.dir, p), 'rb') as f:
                    raw = f.read()
                out[p] = extract.BINARY_SIZE if b'\0' in raw else max(1, raw.count(b'\n'))
        return out


def validate(inst, schema, path='$'):
    """Small JSON Schema subset (the keywords schema/lapse.schema.json uses) so tests keep it honest."""
    t = schema.get('type')
    types = {'object': dict, 'array': list, 'string': str, 'integer': int, 'boolean': bool, 'null': type(None)}
    if t:
        allowed = t if isinstance(t, list) else [t]
        ok = any(isinstance(inst, types[k]) and not (k == 'integer' and isinstance(inst, bool)) for k in allowed)
        assert ok, f'{path}: expected {t}, got {type(inst).__name__}'
    if 'const' in schema:
        assert inst == schema['const'], f'{path}: expected {schema["const"]}'
    if 'minimum' in schema:
        assert inst >= schema['minimum'], f'{path}: below minimum'
    if 'maximum' in schema:
        assert inst <= schema['maximum'], f'{path}: above maximum'
    if 'pattern' in schema:
        import re
        assert re.search(schema['pattern'], inst), f'{path}: does not match {schema["pattern"]}'
    if isinstance(inst, dict):
        for k in schema.get('required', []):
            assert k in inst, f'{path}: missing {k}'
        for k, sub in schema.get('properties', {}).items():
            if k in inst:
                validate(inst[k], sub, f'{path}.{k}')
    if isinstance(inst, list):
        assert len(inst) <= schema.get('maxItems', len(inst)), f'{path}: too many items'
        pre = schema.get('prefixItems', [])
        for i, item in enumerate(inst):
            if i < len(pre):
                validate(item, pre[i], f'{path}[{i}]')
            elif schema.get('items') is False:
                raise AssertionError(f'{path}: unexpected item {i}')
            elif isinstance(schema.get('items'), dict):
                validate(item, schema['items'], f'{path}[{i}]')


def final_state(rec):
    return {p: ev[-1] for p, _, ev in rec['files'] if ev[-1] > 0}


class ReplayTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = self.tmp.name
        self.cfg = config.Config()
        self.keep = extract.make_keep(self.cfg)
        r = self.r = Repo(self.root, 'demo')
        r.write('README.md', 5); r.write('src/app.py', 40); r.write('node_modules/x/index.js', 900)
        r.write('package-lock.json', 3000)
        self.c1 = r.commit(T0, author='Bob')
        r.write('src/app.py', 55); r.write('src/util/helpers.ts', 20); r.write('logo.png', data=b'\x89PNG\0\0bin')
        self.c2 = r.commit(T0 + 10 * DAY, author='Ann', tz='+0200')
        r.rm('README.md'); sh(r.dir, 'git', 'mv', 'src/util/helpers.ts', 'src/util/h.ts')
        self.c3 = r.commit(T0 + 20 * DAY, author='Ann', tz='+0200')
        r.write('docs/guide.md', 12)
        self.c4 = r.commit(T0 + 30 * DAY, author='Bob')
        self.bare = os.path.join(self.root, 'demo.git')
        sh(self.root, 'git', 'clone', '-q', '--bare', r.dir, self.bare)

    def tearDown(self):
        self.tmp.cleanup()

    def replay(self, start, mine=()):
        return extract.replay(self.bare, start, list(mine), self.keep, extract.lang_table({}))

    def test_full_replay_matches_head(self):
        rec = self.replay(T0 - DAY)
        self.assertEqual(final_state(rec), self.r.head_state(self.keep))
        self.assertEqual(rec['fp_commits'], 4)
        self.assertNotIn('node_modules/x/index.js', [f[0] for f in rec['files']])
        self.assertNotIn('package-lock.json', [f[0] for f in rec['files']])

    def test_window_base_state_matches_full_replay(self):
        full, windowed = self.replay(T0 - DAY), self.replay(T0 + 15 * DAY)
        self.assertEqual(final_state(windowed), final_state(full))
        self.assertEqual(windowed['fp_commits'], 2)             # only c3, c4 replayed after the base
        self.assertEqual(windowed['base_t'], (T0 + 10 * DAY) // 60)

    def test_deleted_and_renamed_files_end_at_zero(self):
        rec = {p: ev for p, _, ev in self.replay(T0 - DAY)['files']}
        self.assertEqual(rec['README.md'][-1], 0)
        self.assertEqual(rec['src/util/helpers.ts'][-1], 0)
        self.assertEqual(rec['src/util/h.ts'][-1], 20)
        self.assertEqual(rec['logo.png'][-1], extract.BINARY_SIZE)

    def test_mine_records_author_time_offset_and_files(self):
        rec = self.replay(T0 - DAY, mine=[self.c2, self.c3, 'f' * 40])     # unknown sha is ignored
        self.assertEqual([m[0] for m in rec['mine']], [(T0 + 10 * DAY) // 60, (T0 + 20 * DAY) // 60])
        self.assertTrue(all(m[1] == 120 for m in rec['mine']))
        paths = [f[0] for f in rec['files']]
        self.assertEqual({paths[i] for i in rec['mine'][0][3]}, {'src/app.py', 'src/util/helpers.ts', 'logo.png'})

    def test_languages(self):
        langs = {p: l for p, l, _ in self.replay(T0 - DAY)['files']}
        names = extract.LANG_CLASSES
        self.assertEqual(names[langs['src/app.py']], 'Python')
        self.assertEqual(names[langs['src/util/h.ts']], 'TS / JS')
        self.assertEqual(names[langs['docs/guide.md']], 'Docs')
        self.assertEqual(names[langs['logo.png']], 'Other files')

    def test_end_to_end_offline(self):
        """extract_all -> bundle -> render, with a local path as the clone URL."""
        cache = os.path.join(self.root, 'cache')
        now = T0 + 40 * DAY
        found = {'profile': {'login': 'ann', 'name': 'Ann', 'avatar_url': 'https://x.test/a.png', 'created_at': ''},
                 'start': T0 - DAY, 'now': now, 'contributions': 7, 'restricted': 0,
                 'repos': {'ann/demo': {'shas': [self.c2, self.c3], 'clone_url': self.bare, 'size_kb': 1,
                                        'private': False, 'fork': False}}}
        self.assertEqual(extract.extract_all(found, self.cfg, cache, None, lambda m: None), [])
        payload = bundle.build(found, self.cfg, cache, lambda m: None)
        self.assertEqual(payload['schema'], 1)
        validate(payload, json.loads(read(os.path.join(os.path.dirname(__file__), '..', 'schema', 'lapse.schema.json'))))
        self.assertEqual(payload['tz']['offset'], 120)
        self.assertEqual(payload['tz']['label'], 'UTC+02:00')
        self.assertEqual((payload['epoch'] // 60 + 120) % 1440, 0, 'epoch is local midnight')
        r = payload['repos'][0]
        self.assertEqual(r['n'], 'ann/demo')
        self.assertTrue(all(0 < m[0] <= payload['t_end'] for m in r['m']))
        self.assertGreaterEqual(payload['t_end'], now // 60 - payload['epoch'] // 60)
        out = os.path.join(self.root, 'site', 'index.html')
        render.render(payload, '', out)
        page = read(out)
        self.assertNotIn('__DATA__', page)
        self.assertIn('"login":"ann"', page)
        # second run: nothing moved, so nothing is re-cloned
        logs = []
        extract.extract_all(found, self.cfg, cache, None, logs.append)
        self.assertTrue(all('unchanged' in m for m in logs), logs)
        # a week later the window has moved forward and c2 slid out of it: still no clone, c2 dropped
        later = {**found, 'start': T0 + 15 * DAY, 'repos': {'ann/demo': {**found['repos']['ann/demo'], 'shas': [self.c3]}}}
        logs = []
        extract.extract_all(later, self.cfg, cache, None, logs.append)
        self.assertTrue(all('unchanged' in m for m in logs), logs)
        self.assertEqual(len(bundle.build(later, self.cfg, cache, lambda m: None)['repos'][0]['m']), 1)
        # a new commit of yours means HEAD moved: re-extracted
        self.r.write('src/new.py', 3)
        c5 = self.r.commit(T0 + 35 * DAY, author='Ann', tz='+0200')
        sh(self.root, 'git', '--git-dir', self.bare, 'fetch', '-q', self.r.dir, '+main:main')
        newer = {**later, 'repos': {'ann/demo': {**later['repos']['ann/demo'], 'shas': [self.c3, c5]}}}
        logs = []
        extract.extract_all(newer, self.cfg, cache, None, logs.append)
        self.assertFalse(any('unchanged' in m for m in logs), logs)
        self.assertEqual(len(bundle.build(newer, self.cfg, cache, lambda m: None)['repos'][0]['m']), 2)


class BundleRulesTest(unittest.TestCase):
    def files(self, n, depth=3):
        out = []
        for i in range(n):
            path = '/'.join(f'd{(i >> (2 * k)) % 4}' for k in range(depth)) + f'/f{i}.py'
            out.append([path, 1, [100, 0, 200, i + 1]])
        return out

    def test_aggregate_respects_cap_and_preserves_lines(self):
        files = self.files(200)
        agg, remap = bundle.aggregate(files, 30)
        self.assertLessEqual(len(agg), 30)
        self.assertEqual(sum(f[2][-1] for f in agg), sum(f[2][-1] for f in files))
        self.assertEqual(len(remap), 200)
        self.assertTrue(all(0 <= k < len(agg) for k in remap))
        self.assertTrue(any(p.endswith('/…') for p, _, _ in agg))

    def test_aggregate_flat_directory_falls_back(self):
        files = [[f'f{i}.{"py" if i % 2 else "md"}', 1, [0, 3]] for i in range(500)]
        agg, _ = bundle.aggregate(files, 10)
        self.assertLessEqual(len(agg), 10)
        self.assertEqual(sum(f[2][-1] for f in agg), 1500)

    def test_merge_events_sums_streams(self):
        self.assertEqual(bundle.merge_events([[0, 5, 10, 7], [5, 1, 10, 0]]), [0, 5, 5, 6, 10, 7])

    def test_budget_caps(self):
        self.assertEqual(bundle.budget_caps([100, 50, 10], 80, 1000), [80, 50, 10])
        caps = bundle.budget_caps([1000, 1000, 10], 2500, 1000)
        self.assertLessEqual(sum(caps), 1000)
        self.assertEqual(caps[2], 10)

    def test_anonymise_hides_names_keeps_extensions(self):
        files = [['clients/acme/secret-plan.ts', 0, [0, 1]], ['clients/acme/notes.md', 2, [0, 1]],
                 ['vendor/…', 8, [0, 1]]]
        out = bundle.anonymise_paths(files)
        blob = json.dumps(out)
        for word in ('clients', 'acme', 'secret', 'notes', 'vendor'):
            self.assertNotIn(word, blob)
        self.assertTrue(out[0][0].endswith('.ts') and out[1][0].endswith('.md'))
        self.assertEqual(out[0][0].rsplit('/', 1)[0], out[1][0].rsplit('/', 1)[0], 'same dir stays one dir')


class RenderAndConfigTest(unittest.TestCase):
    def test_payload_cannot_break_out_of_script(self):
        with tempfile.TemporaryDirectory() as d:
            out = os.path.join(d, 'x.html')
            render.render({'repos': [{'p': ['</script><script>alert(1)</script>']}]}, '', out)
            page = read(out)
            self.assertNotIn('</script><script>alert', page)
            self.assertEqual(page.count('</script>'), read(out).count('</script>'))

    def test_toml_sections_and_unknown_keys(self):
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, 'c.toml')
            write(p, 'login = "ann"\ninclude_private = true\n[repos]\nexclude = ["ann/old-*"]\n'
                               '[limits]\nmax_repos = 12\n[languages]\nsol = "Other code"\n')
            cfg = config.load(p, since='2025-01-01')
            self.assertEqual((cfg.login, cfg.include_private, cfg.max_repos, cfg.since), ('ann', True, 12, '2025-01-01'))
            self.assertEqual(cfg.repos_exclude, ['ann/old-*'])
            write(p, 'logn = "typo"\n')
            with self.assertRaises(SystemExit):
                config.load(p)


if __name__ == '__main__':
    unittest.main()
