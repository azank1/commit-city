// Who wrote a commit: a human (''), automation ('bot') or an AI coding agent (its id). The rules are
// schema/agents.json, shared with commit_city/agents.py; agents-rules.ts is its generated copy. Patterns are
// ASCII and portable (see the tests), so JS's `i` flag and Python's re.I | re.A match them identically.
import { RULES } from './agents-rules.js';

export interface AgentRule {
  id: string; label: string; color: string;
  author?: string[];      // the commit author, as `Name <email>`
  coauthor?: string[];    // each Co-authored-by: trailer value
  message?: string[];     // the whole commit message
  login?: string[];       // a GitHub login (events: who pushed or opened the PR)
  branch?: string[];      // a branch name, refs/heads/ stripped
}
export interface Rules { version: number; agents: AgentRule[]; bot: { author?: string[]; login?: string[] } }

/** One regex that matches where any of `ps` does (search semantics), or null for none. */
const union = (ps?: string[]) => (ps?.length ? new RegExp(ps.map(p => `(?:${p})`).join('|'), 'i') : null);

const RULE = RULES.agents.map(a => ({
  id: a.id, author: union(a.author), coauthor: union(a.coauthor), message: union(a.message), login: union(a.login), branch: union(a.branch),
}));
// cheap first passes: almost every commit is human and matches none of these
const ANY_AUTHOR = union(RULES.agents.flatMap(a => a.author ?? []));
const ANY_COAUTHOR = union(RULES.agents.flatMap(a => a.coauthor ?? []));
const ANY_MESSAGE = union(RULES.agents.flatMap(a => a.message ?? []));
const BOT_AUTHOR = union(RULES.bot.author), BOT_LOGIN = union(RULES.bot.login);
const CO_KEY = /^co-authored-by:/i;
const HAS_CO = /(^|\n)co-authored-by:/i;

/** Agents in rules order, for labels and colours. */
export const AGENTS: readonly Readonly<{ id: string; label: string; color: string }>[] =
  Object.freeze(RULES.agents.map(a => Object.freeze({ id: a.id, label: a.label, color: a.color })));

/** Co-authored-by: trailer values (key at the start of a line, any case), trimmed of spaces, tabs and CRs. */
export function coauthors(message: string): string[] {
  const out: string[] = [];
  for (const line of message.split('\n')) if (CO_KEY.test(line)) out.push(line.slice(15).replace(/^[ \t\r]+|[ \t\r]+$/g, ''));
  return out;
}

/** First agent whose author pattern matches; else first whose co-author or message does; else bot or human. */
export function classify(author: string, message: string): string {
  if (ANY_AUTHOR?.test(author)) for (const a of RULE) if (a.author?.test(author)) return a.id;
  const co = HAS_CO.test(message) ? coauthors(message).filter(c => ANY_COAUTHOR?.test(c)) : [];
  if (co.length || ANY_MESSAGE?.test(message)) {
    for (const a of RULE) {
      const ca = a.coauthor;
      if ((ca && co.some(c => ca.test(c))) || a.message?.test(message)) return a.id;
    }
  }
  return BOT_AUTHOR?.test(author) ? 'bot' : '';
}

/** A GitHub event's actor: agent by login, then agent by branch (refs/heads/ optional), then bot, else ''. */
export function classifyActor(login: string, ref?: string | null): string {
  for (const a of RULE) if (a.login?.test(login)) return a.id;
  const branch = ref ? ref.replace(/^refs\/heads\//, '') : '';
  if (branch) for (const a of RULE) if (a.branch?.test(branch)) return a.id;
  return BOT_LOGIN?.test(login) ? 'bot' : '';
}

/** `Name <email>` from a raw `author` header value, split the way git's %an <%ae> does. */
export function identOf(raw: string): string {
  const lt = raw.indexOf('<');
  const gt = lt < 0 ? -1 : raw.indexOf('>', lt + 1);
  if (gt < 0) return ' <>';                                // git prints a bogus ident as blank fields
  let end = lt;
  while (end > 0 && ' \t\n\r'.includes(raw[end - 1])) end--;    // git's isspace()
  return `${raw.slice(0, end)} <${raw.slice(lt + 1, gt)}>`;
}
