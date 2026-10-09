"""Replay each repo's default-branch history into per-file line-count timelines.

Per repo: bare single-branch clone, take the file state at the window start in one pass
(numstat against the empty tree), replay first-parent commits from there to HEAD, record
which files each of your commits touched, then delete the clone. Times are absolute unix
minutes; bundle.py makes them relative.
"""
import base64
import concurrent.futures as cf
import fnmatch
import json
import os
import shutil
import subprocess
import time
from collections import defaultdict

EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904'
BINARY_SIZE = 12          # a binary file stands in as a 12-line file
MIN_FREE_GB = 1.0

# language classes, in palette-slot order; 'Other files' is the fallback
LANG_CLASSES = ['TS / JS', 'Python', 'Docs', 'SQL / data model', 'Markup / styles', 'Config / data',
                'Shell / infra', 'Other code', 'Other files']
LANG_EXT = {
    0: 'ts tsx js jsx mjs cjs vue svelte astro',
    1: 'py ipynb pyi pyx',
    2: 'md mdx txt rst adoc org tex',
    3: 'sql prisma graphql gql proto',
    4: 'html htm css scss sass less svg',
    5: 'json jsonc yaml yml toml ini cfg env xml csv lock',
    6: 'sh bash zsh fish ps1 bat cmd tf hcl dockerfile makefile nix service mk cmake gradle',
    7: 'rs go sol java kt kts c h cc cpp hpp cs fs rb php swift m mm dart circom zok move lua r jl scala ex exs '
       'erl hs ml clj elm zig nim cr v sv vhd asm',
}


def lang_table(overrides):
    table = {e: i for i, exts in LANG_EXT.items() for e in exts.split()}
    for ext, cls in (overrides or {}).items():
        table[ext.lower().lstrip('.')] = LANG_CLASSES.index(cls)
    return table


def lang_of(path, table):
    base = path.rsplit('/', 1)[-1].lower()
    if base in ('dockerfile', 'makefile', 'procfile', 'justfile', 'vagrantfile') or base.startswith('dockerfile'):
        return 6
    ext = base.rsplit('.', 1)[-1] if '.' in base else ''
    return table.get(ext, 8)


def make_keep(cfg):
    dirs, files = set(cfg.exclude_dirs), list(cfg.exclude_files)

    def keep(p):
        parts = p.split('/')
        if any(d in dirs for d in parts[:-1]):
            return False
        return not any(fnmatch.fnmatchcase(parts[-1], pat) for pat in files)
    return keep


def unquote(p):
    if len(p) >= 2 and p[0] == '"' and p[-1] == '"':
        try:
            return p[1:-1].encode('latin1').decode('unicode_escape').encode('latin1').decode('utf8')
        except Exception:
            return p[1:-1]
    return p


def git(repo_dir, *args, stdin=None, env=None):
    r = subprocess.run(['git', '-C', repo_dir, '-c', 'core.quotePath=false', *args], input=stdin,
                       capture_output=True, text=True, errors='replace', env=env)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip()[:400])
    return r.stdout


def git_env(url, token):
    """Env for an authenticated clone: the header goes through GIT_CONFIG_* so the token never shows in `ps`."""
    env = {**os.environ, 'GIT_TERMINAL_PROMPT': '0'}
    if token and url.startswith('https://github.com/'):
        cred = base64.b64encode(f'x-access-token:{token}'.encode()).decode()
        env.update(GIT_CONFIG_COUNT='1', GIT_CONFIG_KEY_0='http.https://github.com/.extraheader',
                   GIT_CONFIG_VALUE_0=f'AUTHORIZATION: basic {cred}')
    return env


def remote_head(url, token):
    try:
        r = subprocess.run(['git', 'ls-remote', url, 'HEAD'], capture_output=True, text=True,
                           env=git_env(url, token), timeout=120)
    except subprocess.TimeoutExpired:
        return None
    return r.stdout.split('\t', 1)[0] if r.returncode == 0 and r.stdout else None


LOG_FMT = '--format=@%H %ct %at %ad'


def parse_log(text):
    """Yield (sha, ct, at, tz_minutes, [(status, path)], {path: (add, del) | None})."""
    cur = None
    for line in text.split('\n'):
        if line.startswith('@'):
            if cur:
                yield cur
            sha, ct, at, tz = line[1:].split(' ')[:4]
            off = (int(tz[1:3]) * 60 + int(tz[3:5])) * (-1 if tz[0] == '-' else 1)
            cur = (sha, int(ct), int(at), off, [], {})
        elif line.startswith(':') and cur:
            meta, path = line.split('\t', 1)
            cur[4].append((meta.split(' ')[-1][0], unquote(path)))
        elif line and cur and '\t' in line:
            a, d, path = line.split('\t', 2)
            cur[5][unquote(path)] = None if a == '-' else (int(a), int(d))
    if cur:
        yield cur


def replay(dest, start, my_shas, keep, table):
    """Walk the clone at `dest`; return the per-repo record (without identity fields)."""
    when = time.strftime('%Y-%m-%d %H:%M:%S +0000', time.gmtime(start))
    base = git(dest, 'rev-list', '--first-parent', '-1', f'--before={when}', 'HEAD').strip()
    events = defaultdict(list)          # path -> [t, size, t, size, ...]
    exists, lines, binary = {}, defaultdict(int), {}

    def emit(path, t):
        size = 0 if not exists.get(path) else (BINARY_SIZE if binary.get(path) else max(1, lines[path]))
        ev = events[path]
        if len(ev) >= 2 and ev[-2] == t:
            ev[-1] = size
        elif not ev or ev[-1] != size:
            ev += [t, size]

    base_t = None
    if base:
        base_t = int(git(dest, 'show', '-s', '--format=%ct', base).strip()) // 60
        for line in git(dest, 'diff-tree', '-r', '--numstat', '--no-renames', EMPTY_TREE, base).split('\n'):
            if '\t' not in line:
                continue
            a, _, path = line.split('\t', 2)
            path = unquote(path)
            if not keep(path):
                continue
            exists[path] = True
            binary[path] = a == '-'
            lines[path] = 0 if a == '-' else int(a)
            emit(path, base_t)
    rng = f'{base}..HEAD' if base else 'HEAD'
    log = git(dest, 'log', '--first-parent', '--reverse', '--no-renames', '--diff-merges=first-parent', '--raw',
              '--numstat', LOG_FMT, '--date=format:%z', rng)
    last_t, n_fp = base_t if base_t is not None else -10 ** 12, 0
    for sha, ct, at, _, raw, num in parse_log(log):
        n_fp += 1
        t = max(ct // 60, last_t)       # monotonic landing clock on the default branch
        last_t = t
        touched = set()
        for status, path in raw:
            if keep(path):
                touched.add(path)
                exists[path] = status != 'D'
                if status == 'D':
                    lines[path] = 0
        for path, ad in num.items():
            if keep(path):
                touched.add(path)
                binary[path] = ad is None
                if ad is not None:
                    lines[path] = max(0, lines[path] + ad[0] - ad[1])
        for path in touched:
            emit(path, t)
    paths = sorted(p for p, ev in events.items() if any(ev[i] > 0 for i in range(1, len(ev), 2)))
    index = {p: i for i, p in enumerate(paths)}
    mine = []
    if my_shas:                         # force-pushes can drop commits the API still lists: keep the ones present
        check = git(dest, 'cat-file', '--batch-check=%(objectname) %(objecttype)', stdin='\n'.join(my_shas) + '\n')
        my_shas = [ln.split(' ')[0] for ln in check.split('\n') if ln.endswith(' commit')]
    if my_shas:
        mlog = git(dest, 'log', '--no-walk=unsorted', '--stdin', '--no-renames',
                   '--diff-merges=first-parent', '--raw', LOG_FMT, '--date=format:%z', stdin='\n'.join(my_shas) + '\n')
        for sha, ct, at, off, raw, num in parse_log(mlog):
            files = sorted({index[p] for _, p in raw if p in index})
            mine.append([at // 60, off, len(files), files[:300], sha[:12]])
        mine.sort()
    head = git(dest, 'rev-parse', 'HEAD').strip()
    return {'head': head, 'fp_commits': n_fp, 'base_t': base_t,
            'files': [[p, lang_of(p, table), events[p]] for p in paths], 'mine': mine}


def free_gb(path):
    st = os.statvfs(path)
    return st.f_bavail * st.f_frsize / 1e9


def process(name, meta, start, cfg, cache, token, log):
    out_path = os.path.join(cache, 'repos', name.replace('/', '__') + '.json')
    url = meta['clone_url']
    wanted = {s[:12] for s in meta['shas']}
    if os.path.exists(out_path):
        # reusable while HEAD has not moved, the window did not grow backwards, and no new commits of yours
        # appeared; commits that slid out of the window are dropped later, in bundle
        with open(out_path) as f:
            old = json.load(f)
        if (old.get('head') and old.get('start', 1 << 62) <= start and wanted <= set(old.get('requested', []))
                and old['head'] == remote_head(url, token if meta.get('private') else None)):
            return f'{name:45s} unchanged'
    if meta.get('size_kb', 0) / 1024 > cfg.max_clone_mb:
        return f'{name:45s} SKIPPED: {meta["size_kb"] / 1024:.0f} MB > max_clone_mb {cfg.max_clone_mb}'
    clones = os.path.join(cache, 'clones')
    os.makedirs(clones, exist_ok=True)
    if free_gb(clones) < MIN_FREE_GB:
        raise RuntimeError(f'only {free_gb(clones):.2f} GB free, refusing to clone')
    dest = os.path.join(clones, name.replace('/', '__') + '.git')
    shutil.rmtree(dest, ignore_errors=True)
    t0 = time.time()
    auth = token if meta.get('private') else None          # public repos clone anonymously
    try:
        r = subprocess.run(['git', 'clone', '--bare', '--single-branch', '--no-tags', '-q', url, dest],
                           capture_output=True, text=True, env=git_env(url, auth), timeout=cfg.clone_timeout)
    except subprocess.TimeoutExpired:
        shutil.rmtree(dest, ignore_errors=True)
        raise RuntimeError(f'clone took longer than clone_timeout={cfg.clone_timeout}s')
    if r.returncode != 0:
        shutil.rmtree(dest, ignore_errors=True)
        raise RuntimeError(r.stderr.strip()[:300])
    try:
        rec = replay(dest, start, meta['shas'], make_keep(cfg), lang_table(cfg.languages))
    finally:
        shutil.rmtree(dest, ignore_errors=True)
    rec.update(repo=name, start=start, requested=sorted(wanted), fork=bool(meta.get('fork')),
               private=bool(meta.get('private')))
    tmp = out_path + '.tmp'
    with open(tmp, 'w') as f:
        json.dump(rec, f, separators=(',', ':'))
    os.replace(tmp, out_path)
    alive = sum(1 for _, _, ev in rec['files'] if ev[-1] > 0)
    return (f'{name:45s} files={len(rec["files"]):6d} alive={alive:6d} mine={len(rec["mine"]):4d}/{len(meta["shas"]):4d} '
            f'{time.time() - t0:5.1f}s')


def extract_all(found, cfg, cache, token, log, workers=3):
    os.makedirs(os.path.join(cache, 'repos'), exist_ok=True)
    keep_files = {n.replace('/', '__') + '.json' for n in found['repos']}
    for fn in os.listdir(os.path.join(cache, 'repos')):          # drop repos no longer in scope
        if fn.endswith('.json') and fn not in keep_files:
            os.remove(os.path.join(cache, 'repos', fn))
    failed = []
    with cf.ThreadPoolExecutor(workers) as ex:
        futs = {ex.submit(process, n, m, found['start'], cfg, cache, token, log): n for n, m in found['repos'].items()}
        for fu in cf.as_completed(futs):
            try:
                log('  ' + fu.result())
            except Exception as e:
                failed.append(futs[fu])
                log(f'  FAILED {futs[fu]}: {e}')
    shutil.rmtree(os.path.join(cache, 'clones'), ignore_errors=True)
    return failed
