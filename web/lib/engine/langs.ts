// Language classes and path rules. Mirrors commit_city/extract.py and commit_city/config.py so the
// hosted builder and the CLI/Action draw the same city from the same history.

export const LANG_CLASSES = ['TS / JS', 'Python', 'Docs', 'SQL / data model', 'Markup / styles', 'Config / data',
  'Shell / infra', 'Other code', 'Other files'];

const LANG_EXT: Record<number, string> = {
  0: 'ts tsx js jsx mjs cjs vue svelte astro',
  1: 'py ipynb pyi pyx',
  2: 'md mdx txt rst adoc org tex',
  3: 'sql prisma graphql gql proto',
  4: 'html htm css scss sass less svg',
  5: 'json jsonc yaml yml toml ini cfg env xml csv lock',
  6: 'sh bash zsh fish ps1 bat cmd tf hcl dockerfile makefile nix service mk cmake gradle',
  7: 'rs go sol java kt kts c h cc cpp hpp cs fs rb php swift m mm dart circom zok move lua r jl scala ex exs ' +
     'erl hs ml clj elm zig nim cr v sv vhd asm',
};

const TABLE = new Map<string, number>();
for (const [k, exts] of Object.entries(LANG_EXT)) for (const e of exts.split(' ')) TABLE.set(e, Number(k));

const INFRA_NAMES = new Set(['dockerfile', 'makefile', 'procfile', 'justfile', 'vagrantfile']);

export function langOf(path: string): number {
  const base = path.slice(path.lastIndexOf('/') + 1).toLowerCase();
  if (INFRA_NAMES.has(base) || base.startsWith('dockerfile')) return 6;
  const dot = base.lastIndexOf('.');
  const ext = dot >= 0 ? base.slice(dot + 1) : '';
  return TABLE.get(ext) ?? 8;
}

export const DEFAULT_EXCLUDE_DIRS = ['node_modules', '.venv', 'venv', '__pycache__', '.next', '.nuxt', '.turbo', '.cache',
  '.pytest_cache', '.mypy_cache', 'coverage', 'dist', 'vendor', '.git', '.idea', '.vscode'];
export const DEFAULT_EXCLUDE_FILES = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'poetry.lock', 'Cargo.lock',
  'bun.lockb', 'uv.lock', 'Pipfile.lock', 'composer.lock', 'Gemfile.lock', 'go.sum', '.DS_Store',
  '*.min.js', '*.min.css', '*.map'];

/** fnmatch.fnmatchcase as a RegExp: * ? [seq] [!seq]. */
export function globToRegExp(pat: string): RegExp {
  let re = '';
  for (let i = 0; i < pat.length; i++) {
    const c = pat[i];
    if (c === '*') re += '.*';
    else if (c === '?') re += '.';
    else if (c === '[') {
      const j = pat.indexOf(']', i + 2);
      if (j < 0) { re += '\\['; continue; }
      let body = pat.slice(i + 1, j).replace(/\\/g, '\\\\');
      if (body[0] === '!') body = '^' + body.slice(1);
      re += `[${body}]`;
      i = j;
    } else re += c.replace(/[.+^${}()|\\\]]/g, '\\$&');
  }
  return new RegExp(`^${re}$`, 's');
}

export type Keep = (path: string) => boolean;

export function makeKeep(excludeDirs = DEFAULT_EXCLUDE_DIRS, excludeFiles = DEFAULT_EXCLUDE_FILES): Keep {
  const dirs = new Set(excludeDirs);
  const pats = excludeFiles.map(globToRegExp);
  return (p: string) => {
    const parts = p.split('/');
    for (let i = 0; i < parts.length - 1; i++) if (dirs.has(parts[i])) return false;
    const leaf = parts[parts.length - 1];
    return !pats.some(r => r.test(leaf));
  };
}

// Formats whose bytes are compressed or structured binary: a NUL lands in the first 8000 bytes for all
// practical purposes, so git (and the Python replay) would call them binary without reading them. Big
// blobs with these extensions are skipped by the partial fetch and stand in as binary.
const BINARY_EXT = new Set(('png jpg jpeg gif webp avif ico icns bmp tif tiff psd heic heif cr2 nef ' +
  'mp3 mp4 m4a m4v mov avi mkv webm ogg oga ogv opus flac wav aac wma wmv flv ' +
  'woff woff2 ttf otf eot ttc zip gz tgz bz2 xz 7z rar zst lz4 jar war ear apk aab ipa dmg iso ' +
  'exe dll so dylib lib obj class wasm pyc pyd node bin ' +
  'sqlite sqlite3 db3 parquet npy npz pt pth onnx h5 hdf5 pkl pickle safetensors tflite ckpt ' +
  'glb fbx blend unitypackage xcf sketch fig').split(' '));

export function binaryByName(path: string): boolean {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const dot = name.lastIndexOf('.');
  return dot > 0 && BINARY_EXT.has(name.slice(dot + 1).toLowerCase());
}
