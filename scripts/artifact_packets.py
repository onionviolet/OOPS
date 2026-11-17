#!/usr/bin/env python3
"""Build private evidence packets for the artifact ledgers (PWC16, power-catalogues-2026-11-16).

Denominators come from wiki categories (PWC3): LOTM Sealed Artifacts and item categories, Harry Potter magical-object
categories, Reverend Insanity non-Gu treasure categories. Each packet carries the cleaned page with the world's own
classification hidden (the held-out label, PWC2): LOTM grade 0-3, the HP object category, the RI kind. Wiki text stays private.
  python3 -I scripts/artifact_packets.py [lotm hp ri]      (HP_DUMP_XML / RI_DUMP_XML point at unpacked dumps)
"""
import gzip, hashlib, importlib.util, json, os, re, sys
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('LABEL_PRIVATE') or os.path.join(ROOT, 'docs/research/power-catalogues-2026-11-16/private')
WIKIS = os.path.expanduser('~/.codex/research/wikis')
spec = importlib.util.spec_from_file_location('lpp', os.path.join(ROOT, 'scripts/label_pass_packets.py'))
lpp = importlib.util.module_from_spec(spec); spec.loader.exec_module(lpp)

LOTM_DUMP = os.path.join(WIKIS, 'lordofthemysteries.fandom.com/dump/lotm-wiki-current-pages-2026-11-03.jsonl.gz')
LOTM_CATS = {'Sealed Artifacts', 'Mystical Items', 'Mystical_Items', 'Beyonder Weapon', 'Equipment', 'Items', 'Destroyed Items', 'Items by possession'}
HP_CATS = ['Horcruxes', 'Deathly Hallows', 'Cursed objects', 'Dark Magic artefacts', 'Amulets', 'Broomsticks', 'Individual broomsticks',
           'Magical objects', 'Objects', 'Magical games']
HP_LABEL = [('Horcruxes', 'horcrux'), ('Deathly Hallows', 'hallow'), ('Cursed objects', 'cursed'), ('Dark Magic artefacts', 'dark-artefact'),
            ('Amulets', 'amulet'), ('Individual broomsticks', 'broomstick'), ('Broomsticks', 'broomstick'), ('Magical games', 'game'),
            ('Magical objects', 'magical-object'), ('Objects', 'object')]
RI_CATS = {'Materials and Resources': 'material', 'Items': 'item', 'Immortal Materials': 'immortal-material', 'Gu Formation': 'formation',
           'Gu Formations': 'formation', 'Immortal Gu Formation': 'formation', 'Immortal Gu Formations': 'formation',
           'Ancient Battle Formations': 'formation', 'Natural Formations': 'formation', 'Resource Points': 'resource-point',
           'World Objects and Phenomena': 'phenomenon'}
RI_GU = {'Gu', 'Gu Immortal', 'Immortal Gu', 'Unranked Gu'}
CATRE = re.compile(r'\[\[Category:([^\]|]+)')


def cats_of(text):
    return {c.strip().replace('_', ' ') for c in CATRE.findall(text)}


def evidence(title, text, strip=None):
    text = re.sub(r'(?ms)^\s*(=+)\s*(?:Appearances|See also|Notes and references|External links|Gallery|Trivia|Behind the scenes)\s*\1.*', '', text)
    if strip:
        text = strip(text)
    return lpp.sections(title, text)


def lotm_strip(text):
    text = re.sub(r'(?im)^\|\s*(grade|code)\s*=.*$', '', text)
    text = re.sub(r'\[\[Category:Grade[^\]]*\]\]', '', text)
    text = re.sub(r'(?i)\bgrade[ -]?[0-3]\b', 'Grade [hidden]', text)
    return re.sub(r'\b[0-3]-\d{3}\b', '[code]', text)


def lotm():
    out = []
    for line in gzip.open(LOTM_DUMP, 'rt'):
        d = json.loads(line)
        cs = cats_of(d['text'])
        if not (cs & LOTM_CATS or any(c.endswith(' Items') for c in cs)):
            continue
        g = re.search(r'(?im)^\|\s*grade\s*=\s*([0-3])\b', d['text'])
        sealed = 'Sealed Artifacts' in cs
        label = g.group(1) if g else None
        out.append({'id': 'lotm.item.' + slug(d['title']), 'name': d['title'], 'cats': sorted(cs), 'sealed': sealed, 'label': label,
                    'locator': f"lotm-wiki-current-pages-2026-11-03 rev {d['revision_id']}", 'evidence': evidence(d['title'], d['text'], lotm_strip)})
    return out


def slug(t):
    return re.sub(r'[^a-z0-9]+', '_', t.lower()).strip('_')


def walk(path):
    for _, el in ET.iterparse(path, events=('end',)):
        if el.tag.endswith('}page'):
            if el.findtext('{*}ns') == '0':
                x = el.findtext('{*}revision/{*}text') or ''
                if not re.match(r'(?i)\s*#redirect', x):
                    yield el.findtext('{*}title') or '', el.findtext('{*}revision/{*}id') or '', x
            el.clear()


def hp():
    xml = os.environ.get('HP_DUMP_XML') or os.path.join(WIKIS, 'harrypotter.fandom.com/dump/harrypotter_pages_current.xml')
    out = []
    for title, rev, x in walk(xml):
        cs = cats_of(x)
        label = next((l for c, l in HP_LABEL if c in cs), None)
        if label is None:
            continue
        out.append({'id': 'hp.object.' + slug(title), 'name': title, 'cats': sorted(cs & set(HP_CATS)), 'label': label,
                    'locator': f'harrypotter pages_current oldid {rev}', 'evidence': evidence(title, x)})
    return out


def ri():
    xml = os.environ.get('RI_DUMP_XML') or os.path.join(WIKIS, 'reverend-insanity.fandom.com/dump/reverendinsanity_pages_current.xml')
    out = []
    for title, rev, x in walk(xml):
        cs = cats_of(x)
        hit = [RI_CATS[c] for c in RI_CATS if c in cs]
        if not hit or cs & RI_GU:
            continue
        out.append({'id': 'ri.treasure.' + slug(title), 'name': title, 'cats': sorted(cs & set(RI_CATS)), 'label': hit[0],
                    'locator': f'reverendinsanity pages_current oldid {rev}', 'evidence': evidence(title, x)})
    return out


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name in sys.argv[1:] or ['lotm', 'hp', 'ri']:
        packets = globals()[name]()
        packets.sort(key=lambda p: p['id'])
        json.dump(packets, open(os.path.join(OUT, f'artifacts_{name}_packets.json'), 'w'))
        labels = {}
        for p in packets:
            labels[p['label']] = labels.get(p['label'], 0) + 1
        print(json.dumps({'corpus': name, 'packets': len(packets), 'labels': labels, 'evidenceChars': sum(len(' '.join(p['evidence'])) for p in packets)}))
