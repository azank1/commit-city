"""Configuration: defaults, overridden by commit-city.toml, overridden by CLI flags."""
import tomllib
from dataclasses import dataclass, field, fields

DEFAULT_EXCLUDE_DIRS = ['node_modules', '.venv', 'venv', '__pycache__', '.next', '.nuxt', '.turbo', '.cache',
                        '.pytest_cache', '.mypy_cache', 'coverage', 'dist', 'vendor', '.git', '.idea', '.vscode']
DEFAULT_EXCLUDE_FILES = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'poetry.lock', 'Cargo.lock', 'bun.lockb',
                         'uv.lock', 'Pipfile.lock', 'composer.lock', 'Gemfile.lock', 'go.sum', '.DS_Store',
                         '*.min.js', '*.min.css', '*.map']


@dataclass
class Config:
    login: str = ''
    since: str = '365d'                 # '365d' | 'YYYY-MM-DD' | 'account'
    include_private: bool = False       # private repos are opt-in and always anonymised
    include_forks: bool = True          # forks you committed to
    repos_include: list = field(default_factory=list)   # extra 'owner/name' to consider
    repos_exclude: list = field(default_factory=list)   # 'owner/name' or 'owner/*'
    anonymize: list = field(default_factory=list)       # public repos to anonymise anyway
    max_repos: int = 60
    max_files_per_repo: int = 2500
    max_files_total: int = 60000
    max_clone_mb: int = 1500
    clone_timeout: int = 1800           # seconds per clone before giving up on that repo
    timezone: str = ''                  # IANA name, e.g. 'Europe/Berlin'; empty = detect from your commits
    title: str = ''
    exclude_dirs: list = field(default_factory=lambda: list(DEFAULT_EXCLUDE_DIRS))
    exclude_files: list = field(default_factory=lambda: list(DEFAULT_EXCLUDE_FILES))
    languages: dict = field(default_factory=dict)       # {'ext': 'Class name'} overrides, see extract.LANG_CLASSES


def load(path=None, **overrides):
    cfg = Config()
    if path:
        with open(path, 'rb') as f:
            raw = tomllib.load(f)
        flat = {}
        for k, v in raw.items():
            if isinstance(v, dict) and k == 'repos':
                for kk, vv in v.items():
                    flat[f'repos_{kk}'] = vv
            elif isinstance(v, dict) and k == 'limits':
                flat.update(v)
            elif isinstance(v, dict) and k == 'paths':
                for kk, vv in v.items():
                    flat[f'exclude_{kk}' if not kk.startswith('exclude') else kk] = vv
            else:
                flat[k] = v
        names = {f.name for f in fields(Config)}
        unknown = set(flat) - names
        if unknown:
            raise SystemExit(f'commit-city.toml: unknown keys {sorted(unknown)}')
        for k, v in flat.items():
            setattr(cfg, k, v)
    for k, v in overrides.items():
        if v is not None:
            setattr(cfg, k, v)
    return cfg
