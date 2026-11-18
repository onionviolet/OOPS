#!/usr/bin/env python3
"""JoJo power ledger, wiki tier (jojo-readers lane, 2026-11-18). Deterministic: no model call, no network.

  python3 -I scripts/jojo_power_ledger.py [--wiki FILE] [--novels FILE]

Reads the private extract of the 2020-02-22 Fandom JoJo wiki dump (docs/research/novels/jojo-collection-2026-11-18/readers/
wiki_all_ns0.jsonl, made by the collector's dump with 7zz, never committed) and writes
  docs/coverage/jojo_powers.jsonl         one row per Stand (infobox page), Ripple/Hamon technique and Spin technique
  docs/coverage/jojo_power_labels.json    the stat letters, type, user, part and the shape tags per row id (a data shape for the Stand letters)
No wiki prose is copied: a row's note is built from the infobox fields and the shape tags. The tags come from keyword rules over the
page's ability section (the rules are in SHAPE_RULES below, set before reading any result) and are model-free but unchecked, so a
blocked slug here is a keyword reading, not a verified one. If --novels names the private novel-tier file (Luna replies folded by
scripts/jojo_novel_rows.mjs) its rows are appended after the wiki rows.
"""
import json, pathlib, re, sys, hashlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PRIV = pathlib.Path('/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/jojo-collection-2026-11-18/readers/')
SNAP = 'Fandom JoJo wiki dump 2020-02-22 (archive.org wiki-jojofandomcom, sha256 5c8f5505e88e)'

# shape tag -> (keyword regex over the ability section, canonical blocked slug or None). The first tag with a slug sets the state.
SHAPE_RULES = [
    ('time', r'\b(stops? time|time stop|erase[sd]? time|skips? time|rewinds?|time travel|resets? time|time flow|time loop|acceler\w+ time)\b', 'time-manipulation'),
    ('power-interaction', r"\b(other stands?'? abilit|nullif\w+ (?:the )?(?:abilit|stand)|copies? (?:the )?abilit|stand abilit\w+ (?:of|from)|abilit\w+ of (?:other|another) stand|overwrite[sd]?)", 'power-interaction'),
    ('power-transfer', r'\b(steals?|stolen|absorbs? (?:the )?(?:stand|abilit|soul|power)|transfers? (?:a |the )?(?:stand|abilit|power)|implants?|gives? (?:a |the )?stand|takes? (?:away )?(?:the )?stand)', 'power-transfer'),
    ('concept', r'\b(fate|destiny|concept|reality|the truth|the universe|gravity|infinite|infinity|paradox|law of|laws of|rules? of|contradiction|nothingness)\b', 'concept-law'),
    ('memory-or-mind', r'\b(memor(?:y|ies)|forget|amnesia|rewrites? (?:the )?(?:mind|brain)|hypnos|brainwash|mind control|controls? (?:the )?(?:mind|will|body of))', 'mind-state'),
    ('soul', r'\b(souls?|spirit of|disc(?:s)? of)\b', 'soul-state'),
    ('space-or-world', r'\b(dimension|parallel world|alternate (?:world|universe)|other world|portal|teleport|warp|pocket|inside (?:a|the) (?:book|picture|painting|mirror)|travel(?:s)? to (?:a|the) )', 'portal-space'),
    ('body-form', r'\b(transforms?|turns? (?:him|her|into|the)|shape-?shift|merges? with|fuses? with|become[s]? (?:a |an )?(?:gas|liquid|ghost|invisible)|invisib)', 'body-form'),
    ('disease', r'\b(virus|poison|disease|infect|bacteria|parasit)', 'venom-or-disease'),
    ('sense', r'\b(tracks?|detects?|senses?|invisible|camouflag|hid(?:e|es|den) from|locate[sd]?)\b', 'conceal-or-sense'),
    ('precognition', r'\b(predicts?|foresee|future|premonition|prophe)\w*', 'precognition'),
    ('creature', r'\b(controls? (?:animals?|insects?|plants?|living|dead|corpse|zombie)|summons? (?:animals?|creatures?|zombies?))', 'creature-control'),
]
# Shapes that are not blocked slugs, kept as tags only (the shape grammar the synthesis uses).
FLAG_RULES = [
    ('rule-imposing', r'\b(must|cannot|can not|forced? to|obey|rule|condition|contract|if (?:the|a|an|he|she|they|someone|anyone)\b[^.]{0,60}\b(?:will|is|are|then))\b'),
    ('conditional-trigger', r'\b(whenever|when(?:ever)? (?:the|a|an|someone|anyone|he|she)|once (?:the|a|an|someone|he|she)|if (?:someone|anyone|the target|the victim|an enemy))\b'),
    ('persistent-after-effect', r'\b(permanent|remains? (?:even|after)|continues? (?:even )?(?:after|to)|until (?:the )?(?:user|stand) (?:is )?(?:dies|dispel|dead)|lingers?)\b'),
    ('self-protecting', r'\b(automatic(?:ally)?|acts? on its own|independent(?:ly)?|without (?:the )?user)\b'),
    ('stand-vs-stand-rule', r'\b(only (?:a )?stand|stand users? can|can only be (?:seen|affected|harmed) by)\b'),
]
STATS = ['destpower', 'speed', 'range', 'persistence', 'precision', 'potential']
TYPE_MAP = [('close', 'close-range'), ('long', 'long-distance'), ('bound', 'bound'), ('automatic', 'automatic'), ('colony', 'colony'), ('shared', 'shared'),
            ('evolved', 'evolved'), ('requiem', 'requiem'), ('integrated', 'range-irrelevant'), ('irrelevant', 'range-irrelevant'), ('sentient', 'sentient')]


def clean(s):
    s = re.sub(r'<ref.*?(</ref>|/>)', '', s, flags=re.S)
    s = re.sub(r'\{\{[^{}]*\}\}', '', s)
    return re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', s)


def field(t, k):
    m = re.search(r'^\|[ \t]*' + k + r'[ \t]*=[ \t]*(.*)$', t, re.M)
    return m.group(1).strip() if m else ''


def section(t, names):
    out = []
    for m in re.finditer(r'^(={2,3})\s*(' + '|'.join(names) + r')\s*\1\s*$', t, re.M | re.I):
        s = t[m.end():]
        e = re.search(r'^==[^=]', s, re.M)
        out.append(s[:e.start()] if e else s)
    return clean('\n'.join(out))


def slugify(s):
    s = re.sub(r"[^a-z0-9]+", '_', s.lower()).strip('_')
    return s or hashlib.sha1(s.encode()).hexdigest()[:6]


def part_of(cats):
    for c in cats:
        m = re.match(r'Part (\d|[IVX]+) Stands', c)
        if m: return m.group(1)
    return ''


def shapes(text):
    low = clean(text).lower()
    tags, slug = [], None
    for tag, rx, sl in SHAPE_RULES:
        if re.search(rx, low):
            tags.append(tag)
            slug = slug or sl
    for tag, rx in FLAG_RULES:
        if re.search(rx, low): tags.append(tag)
    return tags, slug


ITEMS = []


def build(wiki_path):
    pages = {}
    for line in open(wiki_path):
        r = json.loads(line); pages[r['t']] = r
    rows, labels = [], {}
    for title, r in sorted(pages.items()):
        t = r['text']
        if not re.search(r'\{\{\s*Stand Info', t[:2500], re.I): continue
        base = re.sub(r'\s*\(.*\)$', '', title)
        user = clean(field(t, 'user')).strip() or 'unknown'
        raw_type = clean(field(t, 'type')).split('|')[-1].lower()
        stype = next((v for k, v in TYPE_MAP if k in raw_type), 'unstated')
        stats = {k: field(t, k).split('{')[0].strip() or '' for k in STATS}
        def letter(v):
            v = re.sub(r'\}\}.*', '', v).strip()
            if v.startswith('∅') or v.lower().startswith('null') or v.lower().startswith('none'): return 'Null'
            if v in ('A', 'B', 'C', 'D', 'E', 'Infinite', '?', ''): return v
            if '∞' in v or v.lower().startswith('infinit'): return 'Infinite'
            return 'varies' if re.search(r'[A-E]\s*(→|->|to)', v) or re.match(r'[A-E]\b', v) else '?'
        stats = {k: letter(v) for k, v in stats.items()}
        abil = section(t, ['Abilit(?:y|ies)', 'Powers?', 'Abilities and Powers']) or clean(t[t.find('==Appearance'):])[:3000]
        tags, slug = shapes(abil)
        if stype in ('automatic', 'colony') and 'self-protecting' not in tags: tags.append('auto-acting')
        rid = f'jojo.stand.{slugify(base)}'
        if rid in labels: rid += '_' + slugify(user)[:12]
        state = f'blocked:{slug}' if slug else 'catalogued'
        part = part_of(r['cats'])
        letters = '/'.join(stats[k] or '-' for k in STATS)
        ITEMS.append({'id': rid, 'kind': 'stand', 'title': base, 'user': user, 'text': abil[:5000]})
        rows.append({'id': rid, 'source': f'{SNAP}; page "{title}"; chapter locators in the page are the wiki\'s, not checked', 'state': state, 'mechanisms': ['P'], 'test': None,
                     'note': f'{base} (Stand of {user}). {("Part " + part + ". ") if part else ""}{stype} Stand; stats P/S/R/D/Pr/Pot {letters}. Shape tags: {", ".join(tags) or "none"} (keyword reading of the page, unchecked).'
                             + (f' Missing: {slug}.' if slug else '')})
        labels[rid] = {'kind': 'stand', 'stand': base, 'user': user, 'part': part, 'type': stype, 'stats': stats, 'shape_tags': tags, 'tag_basis': 'keyword rules over the ability section; unchecked'}
    # Hamon (Ripple) and Spin techniques: the bullet names in each page's technique sections.
    def techniques(page, secs, kind, system):
        t = pages.get(page, {}).get('text', '')
        for m in re.finditer(r'^(={2,3})\s*(' + '|'.join(secs) + r')\s*\1\s*$', t, re.M):
            s = t[m.end():]; e = re.search(r'^==[^=]', s, re.M); s = s[:e.start()] if e else s
            for ln in s.split('\n'):
                if not ln.startswith('*'): continue
                nm = re.search(r"'''([^']+)'''", ln)
                if not nm: continue
                name = nm.group(1).strip()
                tags, slug = shapes(ln)
                rid = f'jojo.{kind}.{slugify(name)}'
                if rid in labels: continue
                state = f'blocked:{slug}' if slug else 'catalogued'
                ITEMS.append({'id': rid, 'kind': kind, 'title': name, 'user': '', 'text': clean(ln)[:1500]})
                rows.append({'id': rid, 'source': f'{SNAP}; page "{page}", technique list; user attribution not checked', 'state': state, 'mechanisms': ['P'], 'test': None,
                             'note': f'{name} ({system} technique). Shape tags: {", ".join(tags) or "none"} (keyword reading, unchecked).' + (f' Missing: {slug}.' if slug else '')})
                labels[rid] = {'kind': kind, 'technique': name, 'shape_tags': tags, 'tag_basis': 'keyword rules over the technique line; unchecked'}
    techniques('Ripple', ['Techniques'], 'hamon', 'Ripple (Hamon)')
    techniques('Spin', ['Golden Spin', 'Zeppeli Steel Balls', "Johnny's Tusk", "Neapolitan Royal Guard's Wrecking Ball", 'Effects and Uses'], 'spin', 'Spin')
    # The two systems themselves, as rows other worlds can cite.
    for rid, name, note, tags, slug in [
        ('jojo.hamon.ripple_breathing', 'Ripple breathing', 'Hamon base ability: controlled breathing makes sun-like energy that rides the blood and conducts through liquids; it needs steady breath and blood flow, and it harms vampires and zombies. Shape: a breath-gated resource, no rule imposed on others.', ['conditional-trigger'], None),
        ('jojo.spin.golden_rotation', 'Golden rotation', 'Spin base ability: a rotation held near the golden spiral makes more energy than it takes and passes it to what it touches as vibration; energy dies out with distance. Shape: a persistent self-feeding resource carried by an object.', ['persistent-after-effect'], None)]:
        if rid in labels: continue
        rows.append({'id': rid, 'source': f'{SNAP}; pages "Ripple" and "Spin"', 'state': 'catalogued', 'mechanisms': ['P'], 'test': None, 'note': f'{name}. {note}'})
        labels[rid] = {'kind': rid.split('.')[1], 'technique': name, 'shape_tags': tags, 'tag_basis': 'hand-written from the page summary'}
    return rows, labels


def novel_sheets(rows, labels):
    """The Purple Smoke Distortion novel (Kadono) prints a Stand sheet after each chapter: name, user, six letters, an ability gloss. Parse the letters
    and keep them beside the wiki letters; a Stand with no wiki row gets a row. Only the letters, the user and the name are kept (no prose)."""
    f = PRIV / 'text' / 'jojo_purple_smoke_distortion.json'
    if not f.exists(): return 0
    n = 0
    for h, body in json.load(open(f)).values():
        if not body.startswith('Stand Name:'): continue
        g = lambda k: (re.search(r'^' + k + r':\s*(.*)$', body, re.M) or [None, ''])[1].strip()
        name, user = g('Stand Name'), re.sub(r'\s*\(age.*', '', g('User'))
        letters = {}
        for k, lab in (('destpower', 'Destructive Power'), ('speed', 'Speed'), ('range', 'Range'), ('persistence', 'Staying Power'), ('precision', 'Precision'), ('potential', 'Potential')):
            letters[k] = g(lab)
        rid = {'all_along_the_watchtower': 'jojo.stand.all_along_watchtower'}.get(slugify(name)) or f'jojo.stand.{slugify(name)}'
        sheet = {'name': name, 'user': user, 'letters': letters, 'source': 'Purple Smoke Distortion (Kadono), chapter-end Stand sheet'}
        if rid in labels: labels[rid]['novel_sheet'] = sheet
        else:
            letters_s = '/'.join(letters[k] or '-' for k in STATS)
            rows.append({'id': rid, 'source': 'Purple Smoke Distortion (Kadono, official English), chapter-end Stand sheet', 'state': 'catalogued', 'mechanisms': ['P'], 'test': None,
                         'note': f'{name} (Stand of {user}). Light-novel Stand; sheet letters P/S/R/D/Pr/Pot {letters_s}.'})
            labels[rid] = {'kind': 'stand', 'stand': name, 'user': user, 'novel_sheet': sheet, 'shape_tags': [], 'tag_basis': 'none'}
        n += 1
    return n


SHAPES = ['rule-imposing', 'conditional-trigger', 'auto-acting', 'time', 'conceptual', 'direct-force', 'sense-or-utility', 'transformation', 'summon-or-control', 'resource-gated']


def apply_replies(rows, labels, replies):
    """Fold the model's reading over the keyword tags. The model's blocked capability must be a canonical slug, else the row stays catalogued."""
    canon = set(json.load(open(ROOT / 'docs/coverage/blocked_slugs.json'))['canonical'])
    n = 0
    for r in rows:
        rep = (replies.get(r['id']) or {}).get('reply')
        if not rep: continue
        lab = labels[r['id']]
        slug = rep['blocked'] if rep['blocked'] in canon else None
        r['state'] = f'blocked:{slug}' if slug else 'catalogued'
        head = r['note'].split(' Shape tags:')[0]
        extras = [f'shape {rep["shape"]}']
        for k, name in (('trigger', 'trigger'), ('limit', 'limit'), ('beaten_by', 'beaten by')):
            if rep.get(k): extras.append(f'{name}: {rep[k]}')
        r['note'] = f'{head} {rep["summary"]} ' + '; '.join(extras) + ' (model tier, unchecked).' + (f' Missing: {slug}.' if slug else '')
        lab.update({'shape': rep['shape'], 'trigger': rep.get('trigger', ''), 'limit': rep.get('limit', ''), 'beaten_by': rep.get('beaten_by', ''), 'summary': rep['summary'],
                    'blocked': slug, 'model': 'gpt-6-luna', 'tag_basis': 'Luna over the wiki ability text; unchecked'})
        n += 1
    return n


if __name__ == '__main__':
    a = sys.argv[1:]
    wiki = a[a.index('--wiki') + 1] if '--wiki' in a else PRIV / 'wiki_all_ns0.jsonl'
    rows, labels = build(wiki)
    (PRIV / 'private').mkdir(exist_ok=True)
    (PRIV / 'private' / 'wiki_items.json').write_text(json.dumps(ITEMS, ensure_ascii=False))
    print('novel sheets', novel_sheets(rows, labels))
    rp = PRIV / 'private' / 'jojo_wiki_luna.json'
    if rp.exists(): print('folded', apply_replies(rows, labels, json.load(open(rp))), 'model readings')
    if '--novels' in a:
        for line in open(a[a.index('--novels') + 1]):
            r = json.loads(line)
            if r['id'] in labels: continue
            rows.append({k: r[k] for k in ('id', 'source', 'state', 'mechanisms', 'test', 'note')}); labels[r['id']] = r.get('label', {})
    (ROOT / 'docs/coverage/jojo_powers.jsonl').write_text(''.join(json.dumps(r, ensure_ascii=False) + '\n' for r in rows))
    (ROOT / 'docs/coverage/jojo_power_labels.json').write_text(json.dumps({'about': 'JoJo power sidecar (jojo-readers lane, 2026-11-18): Stand stat letters (Power, Speed, Range, Durability, Precision, Potential; A-E plus Infinite and Null) and shape tags per ledger row. Keyword tags and model readings are unchecked.', 'rows': labels}, ensure_ascii=False, indent=1) + '\n')
    print(len(rows), 'rows')
