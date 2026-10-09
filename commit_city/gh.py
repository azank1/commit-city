"""Minimal GitHub REST + GraphQL client (stdlib only) with pagination and rate-limit waits."""
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request

API = os.environ.get('GITHUB_API_URL', 'https://api.github.com')
MAX_RATE_WAIT = 3600          # a scheduled Action has hours to spare; a laptop run can be interrupted


def find_token():
    for var in ('COMMIT_CITY_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN'):
        if os.environ.get(var):
            return os.environ[var]
    if shutil.which('gh'):
        r = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True)
        if r.returncode == 0 and r.stdout.strip():
            return r.stdout.strip()
    return None


class GitHub:
    def __init__(self, token=None, log=None):
        self.token = token
        self.log = log or (lambda msg: print(msg, file=sys.stderr))
        self.calls = 0

    def _request(self, url, body=None, accept='application/vnd.github+json'):
        headers = {'Accept': accept, 'User-Agent': 'commit-city', 'X-GitHub-Api-Version': '2022-11-28'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        data = json.dumps(body).encode() if body is not None else None
        for attempt in range(6):
            req = urllib.request.Request(url, data=data, headers=headers, method='POST' if data else 'GET')
            try:
                with urllib.request.urlopen(req, timeout=60) as resp:
                    self.calls += 1
                    return json.loads(resp.read() or b'null'), resp.headers
            except urllib.error.HTTPError as e:
                self.calls += 1
                remaining = e.headers.get('X-RateLimit-Remaining')
                if e.code in (403, 429) and (remaining == '0' or e.headers.get('Retry-After')):
                    reset = int(e.headers.get('X-RateLimit-Reset', time.time() + 60))
                    wait = int(e.headers.get('Retry-After') or max(5, reset - time.time() + 2))
                    if wait > MAX_RATE_WAIT:
                        raise
                    self.log(f'  rate limited; waiting {wait}s')
                    time.sleep(wait)
                    continue
                if e.code in (500, 502, 503, 504) and attempt < 5:
                    time.sleep(2 ** attempt)
                    continue
                raise
            except urllib.error.URLError:
                if attempt < 5:
                    time.sleep(2 ** attempt)
                    continue
                raise
        raise RuntimeError(f'giving up on {url}')

    def get(self, path, **params):
        url = path if path.startswith('http') else API + path
        if params:
            url += ('&' if '?' in url else '?') + '&'.join(f'{k}={v}' for k, v in params.items())
        return self._request(url)[0]

    def paginate(self, path, **params):
        params.setdefault('per_page', 100)
        url = API + path + '?' + '&'.join(f'{k}={v}' for k, v in params.items())
        while url:
            data, headers = self._request(url)
            if isinstance(data, dict) and 'items' in data:
                data = data['items']
            yield from data or []
            m = re.search(r'<([^>]+)>;\s*rel="next"', headers.get('Link', ''))
            url = m.group(1) if m else None

    def graphql(self, query, **variables):
        data, _ = self._request(API + '/graphql', body={'query': query, 'variables': variables})
        if data.get('errors'):
            raise RuntimeError('; '.join(e.get('message', '?') for e in data['errors']))
        return data['data']

    def download(self, url):
        req = urllib.request.Request(url, headers={'User-Agent': 'commit-city'})
        with urllib.request.urlopen(req, timeout=60) as resp:
            return resp.read(), resp.headers.get('Content-Type', 'image/png')
