"""Find the repos a user committed to in the window, and which commits are theirs."""
import concurrent.futures as cf
import fnmatch
import urllib.error
from datetime import datetime, timedelta, timezone

CONTRIB_Q = '''query($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){
  restrictedContributionsCount
  contributionCalendar{totalContributions}
  commitContributionsByRepository(maxRepositories:100){repository{nameWithOwner isPrivate isFork}}}}}'''


def iso(ts):
    return datetime.fromtimestamp(ts, timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


def profile(gh, login):
    u = gh.get(f'/users/{login}')
    return {'login': u['login'], 'name': u.get('name') or '', 'created_at': u['created_at'],
            'avatar_url': u['avatar_url'], 'id': u['id']}


def window_start(cfg, prof, now):
    created = datetime.fromisoformat(prof['created_at'].replace('Z', '+00:00')).timestamp()
    s = cfg.since.strip().lower()
    if s == 'account':
        start = created
    elif s.endswith('d') and s[:-1].isdigit():
        start = now - int(s[:-1]) * 86400
    else:
        start = datetime.fromisoformat(cfg.since).replace(tzinfo=timezone.utc).timestamp()
    return int(max(start, created - 86400))


def contributions(gh, login, start, end, log):
    """Calendar total + repos with commit contributions, in <=1-year GraphQL windows."""
    total, restricted, repos, ok = 0, 0, {}, True
    a = start
    while a < end:
        b = min(end, a + 365 * 86400 - 1)
        try:
            cc = gh.graphql(CONTRIB_Q, login=login, **{'from': iso(a), 'to': iso(b)})['user']['contributionsCollection']
        except (RuntimeError, urllib.error.HTTPError) as e:
            log(f'  contributions query failed ({e}); falling back to commit search')
            ok = False
            break
        total += cc['contributionCalendar']['totalContributions']
        restricted += cc['restrictedContributionsCount']
        for row in cc['commitContributionsByRepository']:
            r = row['repository']
            repos[r['nameWithOwner']] = {'private': r['isPrivate'], 'fork': r['isFork']}
        a = b + 1
    return (total if ok else None), restricted, repos, ok


def search_repos(gh, login, start):
    """Fallback discovery: the commit search index (public, default branches)."""
    out = {}
    day = datetime.fromtimestamp(start, timezone.utc).strftime('%Y-%m-%d')
    for item in gh.paginate('/search/commits', q=f'author:{login}+committer-date:>={day}', sort='committer-date'):
        r = item['repository']
        out[r['full_name']] = {'private': r['private'], 'fork': r['fork']}
        if len(out) >= 300:
            break
    return out


def owned_repos(gh, login, start, with_private):
    path, params = (('/user/repos', {'affiliation': 'owner,collaborator,organization_member'}) if with_private
                    else (f'/users/{login}/repos', {'type': 'owner'}))
    out = {}
    for r in gh.paginate(path, sort='pushed', **params):
        pushed = datetime.fromisoformat(r['pushed_at'].replace('Z', '+00:00')).timestamp() if r.get('pushed_at') else 0
        if pushed < start:
            break                       # sorted by push time: the rest are older than the window
        out[r['full_name']] = {'private': r['private'], 'fork': r['fork']}
    return out


def matches(name, patterns):
    return any(fnmatch.fnmatch(name.lower(), p.lower()) for p in patterns)


def my_commits(gh, repo, login, start):
    try:
        return [c['sha'] for c in gh.paginate(f'/repos/{repo}/commits', author=login, since=iso(start))]
    except urllib.error.HTTPError as e:
        if e.code in (403, 404, 409, 451):     # no access / gone / empty repo / blocked
            return []
        raise


def repo_meta(gh, repo):
    r = gh.get(f'/repos/{repo}')
    return {'private': r['private'], 'fork': r['fork'], 'size_kb': r.get('size', 0),
            'default_branch': r.get('default_branch'), 'clone_url': r['clone_url']}


def discover(gh, cfg, now, log):
    prof = profile(gh, cfg.login)
    start = window_start(cfg, prof, now)
    log(f'{prof["login"]}: window from {iso(start)[:10]}')
    total, restricted, cands, ok = contributions(gh, cfg.login, start, int(now), log)
    if not ok:
        cands = search_repos(gh, cfg.login, start)
    viewer = None
    if cfg.include_private:
        try:
            viewer = gh.get('/user')['login']
        except urllib.error.HTTPError:
            viewer = None
    cands.update(owned_repos(gh, cfg.login, start, with_private=cfg.include_private and viewer == cfg.login))
    for r in cfg.repos_include:
        cands.setdefault(r, {'private': None, 'fork': None})
    names = sorted(n for n, m in cands.items()
                   if not matches(n, cfg.repos_exclude)
                   and (cfg.include_private or m['private'] is not True)
                   and (cfg.include_forks or m['fork'] is not True))
    log(f'{len(names)} candidate repos; listing your commits in each')
    with cf.ThreadPoolExecutor(6) as ex:
        shas = dict(zip(names, ex.map(lambda n: my_commits(gh, n, cfg.login, start), names)))
    seen, repos = set(), {}
    for n in sorted(names, key=lambda n: -len(shas[n])):        # a commit shared by a fork counts once
        mine = [s for s in shas[n] if s not in seen]
        seen.update(mine)
        if mine:
            repos[n] = {'shas': mine}
    with cf.ThreadPoolExecutor(6) as ex:
        for n, meta in zip(repos, ex.map(lambda n: repo_meta(gh, n), list(repos))):
            repos[n].update(meta)
    repos = {n: r for n, r in repos.items()
             if (cfg.include_private or not r['private']) and (cfg.include_forks or not r['fork'])}
    log(f'{len(repos)} repos with your commits ({len(seen)} commits)')
    return {'profile': prof, 'start': start, 'now': int(now), 'contributions': total,
            'restricted': restricted, 'repos': repos}
