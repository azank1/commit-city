"""Who wrote a commit: a human (''), automation ('bot') or an AI coding agent (its id).

The rules are schema/agents.json, shared with the hosted engine (web/lib/engine/agents.ts); agents_rules.py is
its generated copy, so an installed package needs nothing outside commit_city/. Patterns are ASCII and portable
(see the tests): compiled re.I | re.A they match exactly as JavaScript's `i` flag does.
"""
import re

from .agents_rules import RULES

FLAGS = re.I | re.A
CO_KEY = re.compile('co-authored-by:', FLAGS)


def _union(patterns):
    return re.compile('|'.join(f'(?:{p})' for p in patterns), FLAGS) if patterns else None


_AGENTS = [(a['id'], _union(a.get('author')), _union(a.get('coauthor')), _union(a.get('message')))
           for a in RULES['agents']]
_BOT = _union(RULES['bot'].get('author'))


def coauthors(message):
    """Co-authored-by: trailer values (key at the start of a line, any case), trimmed of spaces, tabs and CRs."""
    return [line[15:].strip(' \t\r') for line in message.split('\n') if CO_KEY.match(line)]


def classify(author, message):
    """author is `Name <email>` (git's %an <%ae>), message the raw %B. First agent whose author pattern matches;
    else the first whose co-author or message pattern does; else 'bot' or '' (human)."""
    for aid, au, _, _ in _AGENTS:
        if au and au.search(author):
            return aid
    co = coauthors(message)
    for aid, _, ca, msg in _AGENTS:
        if (ca and any(ca.search(c) for c in co)) or (msg and msg.search(message)):
            return aid
    return 'bot' if _BOT and _BOT.search(author) else ''
