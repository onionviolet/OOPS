#!/usr/bin/env python3 -I
"""Free regex scan of the private Re:Zero captures for named powers (PWC3, denominator from data).

Reads the Witch Cult web-novel capture (504 chapters, arcs 1-10) and the web-novel IF epubs, finds
"Divine Protection of X" names and tier-plus-root spell names, and writes private/rezero_wn_scan.json:
{name: {cls, count, locators}} with locators like "WN A5 c52" or "IF gluttony". No book prose is written,
only the matched name and where it sits. Usage: python3 -I scripts/rezero_power_wn_scan.py"""
import json, re, zipfile, os, collections, html

SRC = os.environ.get('REZERO_SRC', '/Users/weiwei/code/yet-another-idle-rpg').rstrip('/') + '/'
OUT = os.environ.get('REZERO_PRIVATE', SRC + 'docs/research/power-catalogues-2026-11-16/private').rstrip('/') + '/rezero_wn_scan.json'
DP = re.compile(r"Divine Protections? of (?:the )?([A-Z][A-Za-z'’-]+(?: (?:of )?[A-Z][A-Za-z'’-]+){0,2})")
SPELL = re.compile(r"\b(El|Ul|Al) ([A-Z][a-z]{3,9})\b")
SPELL_STOP = {'Donaaa', 'Capone', 'Dona'}  # Dona alone is a root; typos and names are dropped by hand
found = collections.defaultdict(lambda: {'cls': '', 'count': 0, 'locators': []})

def add(name, cls, loc):
    e = found[(cls, name)]
    e['cls'] = cls; e['count'] += 1
    if loc not in e['locators'] and len(e['locators']) < 6: e['locators'].append(loc)

def scan(text, loc):
    for m in DP.finditer(text):
        add(m.group(1).strip(), 'divine_protection', loc)
    for m in SPELL.finditer(text):
        if m.group(2) not in SPELL_STOP:
            add(f'{m.group(1)} {m.group(2)}', 'spell', loc)

wn = json.load(open(SRC + 'docs/research/novels/rezero/witchcult/rezero_wct.json'))
for v in wn.values():
    m = re.match(r'Arc (\d+), Chapter (\d+)', v[0])
    if m: scan(v[1], f'WN A{m.group(1)} c{m.group(2)}')
epubs = SRC + 'docs/research/novels/rezero-if-2026-11-03/epub/'
for f in sorted(os.listdir(epubs)):
    if f.endswith('.epub'):
        z = zipfile.ZipFile(epubs + f)
        text = ' '.join(html.unescape(re.sub(r'<[^>]+>', ' ', z.read(n).decode('utf8', 'ignore'))) for n in z.namelist() if n.endswith(('.xhtml', '.html')))
        scan(text, f'IF {f[:-5]}')
rows = {f'{c}|{n}': e for (c, n), e in found.items()}
json.dump(dict(sorted(rows.items())), open(OUT, 'w'), indent=0)
print(len(rows), 'names;', sum(e['count'] for e in rows.values()), 'hits')
