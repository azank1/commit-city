// .gitattributes, only as far as it decides whether git diffs a file as binary (`binary`, `-diff`, `diff`).
// git (2.43+) reads a bare repo's attributes from HEAD, for every commit; the Python pipeline gets that
// for free, so the hosted engine applies HEAD's attribute files the same way.

interface Rule { re: RegExp; base: boolean; diff: boolean | null }
interface AttrFile { dir: string; rules: Rule[] }

function esc(c: string) { return c.replace(/[.+^${}()|\\\]\[*?]/g, '\\$&'); }

export function attrGlob(pat: string): RegExp {
  let re = '';
  for (let i = 0; i < pat.length;) {
    if (pat.startsWith('**/', i)) { re += '(?:.*/)?'; i += 3; continue; }
    if (pat.startsWith('/**', i) && i + 3 === pat.length) { re += '/.*'; i += 3; continue; }
    if (pat.startsWith('**', i)) { re += '.*'; i += 2; continue; }
    const c = pat[i];
    if (c === '*') { re += '[^/]*'; i++; continue; }
    if (c === '?') { re += '[^/]'; i++; continue; }
    if (c === '\\' && i + 1 < pat.length) { re += esc(pat[i + 1]); i += 2; continue; }
    if (c === '[') {
      const j = pat.indexOf(']', i + 2);
      if (j > 0) {
        let body = pat.slice(i + 1, j).replace(/\\/g, '\\\\');
        if (body[0] === '!') body = '^' + body.slice(1);
        re += `[${body}]`;
        i = j + 1;
        continue;
      }
    }
    re += esc(c);
    i++;
  }
  return new RegExp(`^${re}$`, 's');
}

export function parseAttributes(text: string): Rule[] {
  const rules: Rule[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#') || line.startsWith('[attr]')) continue;
    const [pat, ...attrs] = line.split(/\s+/);
    if (!pat || pat.endsWith('/') || pat.startsWith('!')) continue;   // directory patterns never match files
    let diff: boolean | null | undefined;
    for (const a of attrs) {
      if (a === 'binary' || a === '-diff') diff = false;
      else if (a === 'diff') diff = true;
      else if (a === '!diff' || a.startsWith('diff=')) diff = null;
    }
    if (diff === undefined) continue;
    const anchored = pat.replace(/^\//, '');
    const base = !pat.includes('/');
    rules.push({ re: attrGlob(base ? pat : anchored), base, diff });
  }
  return rules;
}

/** Combines every .gitattributes in a tree. `binary(path)`: true = binary, false = text, null = sniff. */
export class Attributes {
  private files: AttrFile[] = [];
  add(dir: string, text: string) {
    const rules = parseAttributes(text);
    if (rules.length) this.files.push({ dir, rules });
    this.files.sort((a, b) => a.dir.split('/').length - b.dir.split('/').length || (a.dir < b.dir ? -1 : 1));
  }
  get empty() { return this.files.length === 0; }
  binary(path: string): boolean | null {
    let state: boolean | null = null;
    const leaf = path.slice(path.lastIndexOf('/') + 1);
    for (const f of this.files) {
      if (f.dir && !path.startsWith(f.dir + '/')) continue;
      const rel = f.dir ? path.slice(f.dir.length + 1) : path;
      for (const r of f.rules) if (r.re.test(r.base ? leaf : rel)) state = r.diff === null ? null : !r.diff;
    }
    return state;
  }
}
