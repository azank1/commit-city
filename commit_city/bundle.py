"""Turn extracted repo timelines into the viewer payload (schema v1, see schema/lapse.schema.json).

Rules applied here, in order:
  1. keep repos with at least one of your commits, ranked by your commit count, capped at max_repos
  2. anonymise private repos (always) and any listed in `anonymize`: names and paths are replaced
  3. aggregate big repos: deep directories collapse into one building each, until the repo fits its
     file budget (max_files_per_repo, then shrunk evenly so the whole city fits max_files_total)
  4. times become minutes since `epoch`, local midnight (detected or configured timezone) of the day
     before your first commit in the window
"""
import fnmatch
import json
import os
from collections import Counter, defaultdict
from datetime import datetime, timezone

from . import SCHEMA_VERSION, __version__
from .extract import LANG_CLASSES


def detect_offset(records):
    offs = Counter(m[1] for r in records for m in r['mine'])
    return offs.most_common(1)[0][0] if offs else 0


def tz_info(cfg, records, now):
    if cfg.timezone:
        from zoneinfo import ZoneInfo
        z = ZoneInfo(cfg.timezone)
        d = datetime.fromtimestamp(now, z)
        return {'iana': cfg.timezone, 'offset': int(d.utcoffset().total_seconds() // 60), 'label': d.tzname()}
    off = detect_offset(records)
    sign = '+' if off >= 0 else '-'
    return {'iana': '', 'offset': off, 'label': f'UTC{sign}{abs(off) // 60:02d}:{abs(off) % 60:02d}'}


def merge_events(evs):
    """Sum several [t, size, ...] streams into one."""
    times = sorted({ev[i] for ev in evs for i in range(0, len(ev), 2)})
    cur, ptr, out = [0] * len(evs), [0] * len(evs), []
    for t in times:
        for k, ev in enumerate(evs):
            while ptr[k] < len(ev) and ev[ptr[k]] <= t:
                cur[k] = ev[ptr[k] + 1]
                ptr[k] += 2
        s = sum(cur)
        if not out or out[-1] != s:
            out += [t, s]
    return out


def group_key(path, depth):
    parts = path.split('/')
    return path if len(parts) - 1 <= depth else '/'.join(parts[:depth + 1]) + '/…'


def aggregate(files, cap):
    """files: [[path, lang, ev]] -> (files', old index -> new index). Collapses deepest dirs first."""
    n = len(files)
    if n <= cap:
        return files, list(range(n))
    maxd = max(p.count('/') for p, _, _ in files)
    key = None
    for d in range(maxd - 1, -1, -1):
        if len({group_key(p, d) for p, _, _ in files}) <= cap:
            key = lambda p, d=d: group_key(p, d)
            break
    if key is None:                                     # too many top-level entries: bucket root files by extension
        def key(p):
            k = group_key(p, 0)
            return k if k != p else ('*.' + p.rsplit('.', 1)[-1] if '.' in p else '*')
    groups = defaultdict(list)
    for i, (p, _, _) in enumerate(files):
        groups[key(p)].append(i)
    if len(groups) > cap:                               # last resort: keep the biggest groups, fold the rest
        size = {k: sum(max(files[i][2][1::2]) for i in idx) for k, idx in groups.items()}
        ranked = sorted(groups, key=lambda k: -size[k])
        rest = [i for k in ranked[cap - 1:] for i in groups[k]]
        groups = {k: groups[k] for k in ranked[:cap - 1]}
        groups['other…'] = rest
    out, remap = [], [0] * n
    for k in sorted(groups):
        idx = groups[k]
        for i in idx:
            remap[i] = len(out)
        if len(idx) == 1:
            out.append(files[idx[0]])
            continue
        weight = Counter()
        for i in idx:
            weight[files[i][1]] += max(files[i][2][1::2])
        out.append([k, weight.most_common(1)[0][0], merge_events([files[i][2] for i in idx])])
    return out, remap


def anonymise_paths(files):
    names = {}

    def seg(s, kind):
        if (kind, s) not in names:
            names[(kind, s)] = f'{kind}{sum(1 for kk in names if kk[0] == kind) + 1}'
        return names[(kind, s)]
    out = []
    for p, lang, ev in files:
        parts = p.split('/')
        dirs = [seg('/'.join(parts[:i + 1]), 'dir') for i in range(len(parts) - 1)]
        leaf = parts[-1]
        ext = leaf.rsplit('.', 1)[-1] if '.' in leaf[1:] else ''
        if leaf in ('…', 'other…') or leaf.startswith('*'):
            new = leaf
        else:
            new = seg(p, 'file') + (f'.{ext}' if ext.isalnum() and len(ext) <= 8 else '')
        out.append(['/'.join(dirs + [new]), lang, ev])
    return out


def budget_caps(counts, per_repo, total):
    caps = [min(c, per_repo) for c in counts]
    if sum(caps) <= total:
        return caps
    lo, hi = 1, per_repo
    while lo < hi:                                        # largest uniform cap that fits the total
        mid = (lo + hi + 1) // 2
        if sum(min(c, mid) for c in counts) <= total:
            lo = mid
        else:
            hi = mid - 1
    return [min(c, lo) for c in counts]


def build(found, cfg, cache, log):
    records = []
    for name in found['repos']:
        path = os.path.join(cache, 'repos', name.replace('/', '__') + '.json')
        if os.path.exists(path):
            with open(path) as f:
                r = json.load(f)
            wanted = {s[:12] for s in found['repos'][name]['shas']}
            r['mine'] = [m for m in r['mine'] if m[4] in wanted]      # cached records may predate the window
            if r['mine'] and r['files']:
                records.append(r)
    if not records:
        raise SystemExit('no repos with your commits were extracted; nothing to draw')
    records.sort(key=lambda r: (-len(r['mine']), r['repo'].lower()))
    omitted = records[cfg.max_repos:]
    records = records[:cfg.max_repos]
    now = found['now']
    tz = tz_info(cfg, records, now)
    off = tz['offset']
    first = min(m[0] for r in records for m in r['mine'])            # unix minutes
    local_day = (first + off) // 1440
    epoch_min = (local_day - 1) * 1440 - off                        # local midnight, the day before
    last = max(max(m[0] for r in records for m in r['mine']),
               max(f[2][-2] for r in records for f in r['files']))
    t_end = max(last + 30, now // 60) - epoch_min
    caps = budget_caps([len(r['files']) for r in records], cfg.max_files_per_repo, cfg.max_files_total)
    repos, k_anon = [], 0
    for r, cap in zip(records, caps):
        files, remap = aggregate(r['files'], cap)
        anon = r['private'] or any(fnmatch.fnmatch(r['repo'].lower(), p.lower()) for p in cfg.anonymize)
        if anon:
            k_anon += 1
            files = anonymise_paths(files)
            name = f'private/repo-{k_anon}'
        else:
            name = r['repo']
        mine = []
        for t, _, _, idx, _ in r['mine']:
            new = sorted({remap[i] for i in idx})
            mine.append([t - epoch_min, len(new), new])
        repos.append({
            'n': name, 'fork': r['fork'] and not anon, 'anon': anon, 'fp': r['fp_commits'],
            'agg': len(r['files']) - len(files),
            'p': [f[0] for f in files], 'l': [f[1] for f in files],
            'e': [[(ev[i] - epoch_min) if i % 2 == 0 else ev[i] for i in range(len(ev))] for _, _, ev in files],
            'm': mine,
        })
        if len(files) < len(r['files']):
            log(f'  {name}: {len(r["files"])} paths aggregated into {len(files)} buildings')
    prof = found['profile']
    commits = sum(len(r['m']) for r in repos)
    return {
        'schema': SCHEMA_VERSION,
        'generator': f'commit-city {__version__}',
        'generated': datetime.fromtimestamp(now, timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'user': {'login': prof['login'], 'name': prof['name'], 'avatar': prof['avatar_url'],
                 'url': f'https://github.com/{prof["login"]}'},
        'title': cfg.title or f'{prof["login"]} · commit city',
        'tz': tz,
        'epoch': epoch_min * 60,
        't_end': t_end,
        'langs': LANG_CLASSES,
        'totals': {
            'commits': commits,
            'contributions': found.get('contributions'),
            'restricted': found.get('restricted', 0),
            'window_start': datetime.fromtimestamp(found['start'], timezone.utc).strftime('%Y-%m-%d'),
            'omitted_repos': len(omitted),
            'omitted_commits': sum(len(r['mine']) for r in omitted),
        },
        'repos': repos,
    }
