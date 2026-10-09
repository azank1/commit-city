"""commit-city command line.

  python -m commit_city build  [--login L] [--config commit-city.toml] [--out index.html]
  python -m commit_city render --data payload.json [--out index.html]
"""
import argparse
import json
import os
import sys
import time

from . import __version__, bundle, config, discover, extract, render
from .gh import GitHub, find_token


def log(msg):
    print(msg, file=sys.stderr, flush=True)


def cmd_build(a):
    cfg = config.load(a.config if a.config and os.path.exists(a.config) else None,
                      login=a.login, since=a.since, include_private=a.include_private, timezone=a.timezone,
                      title=a.title, max_repos=a.max_repos)
    token = find_token()
    gh = GitHub(token, log)
    if not cfg.login:
        cfg.login = os.environ.get('GITHUB_REPOSITORY_OWNER') or (gh.get('/user')['login'] if token else '')
    if not cfg.login:
        raise SystemExit('no login: pass --login or set one in commit-city.toml')
    if not token:
        log('no token found (GITHUB_TOKEN / GH_TOKEN / gh auth): public data only, 60 API calls an hour')
    os.makedirs(a.cache, exist_ok=True)
    t0 = time.time()
    log(f'== discover ({cfg.login})')
    found = discover.discover(gh, cfg, time.time(), log)
    json.dump(found, open(os.path.join(a.cache, 'found.json'), 'w'))
    log(f'== replay {len(found["repos"])} repos')
    failed = extract.extract_all(found, cfg, a.cache, token, log, workers=a.workers)
    log('== bundle')
    payload = bundle.build(found, cfg, a.cache, log)
    json.dump(payload, open(os.path.join(a.cache, 'payload.json'), 'w'), separators=(',', ':'))
    if a.data_out:
        json.dump(payload, open(a.data_out, 'w'), separators=(',', ':'))
    log('== render')
    avatar = render.avatar_data_uri(gh, payload['user']['avatar'], log)
    size = render.render(payload, avatar, a.out)
    files = sum(len(r['p']) for r in payload['repos'])
    log(f'wrote {a.out} ({size / 1e6:.2f} MB): {len(payload["repos"])} repos, {files} buildings, '
        f'{payload["totals"]["commits"]} commits, {gh.calls} API calls, {time.time() - t0:.0f}s'
        + (f'; {len(failed)} repos failed: {", ".join(failed)}' if failed else ''))
    return 1 if failed and len(failed) == len(found['repos']) else 0


def cmd_render(a):
    payload = json.load(open(a.data))
    avatar = ''
    if a.avatar:
        import base64
        raw = open(a.avatar, 'rb').read()
        kind = 'png' if raw[:4] == b'\x89PNG' else 'jpeg'
        avatar = f'data:image/{kind};base64,' + base64.b64encode(raw).decode()
    size = render.render(payload, avatar, a.out)
    log(f'wrote {a.out} ({size / 1e6:.2f} MB)')
    return 0


def main(argv=None):
    p = argparse.ArgumentParser(prog='commit-city', description='Your GitHub year as a 3D city time-lapse.')
    p.add_argument('--version', action='version', version=f'commit-city {__version__}')
    sub = p.add_subparsers(dest='cmd', required=True)
    b = sub.add_parser('build', help='fetch, replay and render a user\'s lapse')
    b.add_argument('--login', help='GitHub user (default: config, $GITHUB_REPOSITORY_OWNER, or the token owner)')
    b.add_argument('--config', default='commit-city.toml')
    b.add_argument('--out', default='commit-city.html')
    b.add_argument('--cache', default='.commit-city-cache', help='keeps extracted repos so re-runs only re-clone what moved')
    b.add_argument('--data-out', help='also write the JSON payload here')
    b.add_argument('--since', help="'365d' (default), 'YYYY-MM-DD' or 'account'")
    b.add_argument('--include-private', action='store_true', default=None, help='private repos, anonymised (needs a token that can read them)')
    b.add_argument('--timezone', help="IANA zone, e.g. 'Europe/Berlin' (default: detected from your commits)")
    b.add_argument('--title')
    b.add_argument('--max-repos', type=int)
    b.add_argument('--workers', type=int, default=3)
    b.set_defaults(fn=cmd_build)
    r = sub.add_parser('render', help='re-render HTML from a saved payload, offline')
    r.add_argument('--data', required=True)
    r.add_argument('--avatar')
    r.add_argument('--out', default='commit-city.html')
    r.set_defaults(fn=cmd_render)
    a = p.parse_args(argv)
    return a.fn(a)
