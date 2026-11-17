#!/usr/bin/env python3 -I
"""Chapter-tier packets (R5 / PWC15, 2026-11-16): a deterministic search of the private chapter text for each ledger row,
building small packets of the cited paragraphs only. Nothing is paid for here. Output goes to the gitignored private
folder as ch_<corpus>_packets.json, the shape scripts/label_pass.mjs reads ({id, name, evidence: ['[locator] text']}),
plus ch_<corpus>_search.json (hit counts and terms, including rows with no chapter mention, which are results too).

  python3 -I scripts/chapter_tier_packets.py gu_kinds lotm_potions hp_ingredients

Env: CHAPTER_SOURCE_ROOT is a checkout holding docs/research/novels (gitignored private text); defaults to the primary checkout.
Locators: ri:ch<N>:p<k> (Reverend Insanity English, paragraph k of chapter N), lotm:ch<N>:p<k> (Lord of the Mysteries official
English), hp:b<B>:pdf<P>:l<L> (Harry Potter, PDF page and line of the prepared text), claim:<id> (the paid reader's claim row).
Raw text never leaves the private folder.
"""
import json, os, re, sys, zipfile, html, glob
from collections import defaultdict

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
SRC = os.environ.get('CHAPTER_SOURCE_ROOT', '/Users/weiwei/code/yet-another-idle-rpg').rstrip('/')
NOV = f'{SRC}/docs/research/novels'
PRIV = os.environ.get('CHAPTER_OUT_DIR', f'{SRC}/docs/research/advancement-aspects-2026-11-16/private').rstrip('/') + '/'
SPLIT = os.path.join(ROOT, 'docs/coverage/wiki_tier_labels.json')


def strip(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').strip()


def load_ri():
    """[(chapter, k, text)] over ri1..ri24 (English, `<h1>Chapter N: title</h1>` then <p>)."""
    out = []
    for f in sorted(glob.glob(f'{NOV}/reverend-insanity/private/source/ri*.html'), key=lambda p: int(re.search(r'ri(\d+)\.html', p).group(1))):
        ch, k = None, 0
        for m in re.finditer(r'<h1>(.*?)</h1>|<p>(.*?)</p>', open(f, encoding='utf-8').read(), re.S):
            if m.group(1) is not None:
                n = re.match(r'Chapter (\d+)', strip(m.group(1)))
                ch, k = (int(n.group(1)) if n else None), 0
            elif ch is not None:
                k += 1
                t = strip(m.group(2))
                if t:
                    out.append((ch, k, t))
    return out


def load_lotm():
    out = []
    z = zipfile.ZipFile(f'{NOV}/lord-of-mysteries/private/source/en/lotm_en_webnovel_official.epub')
    names = sorted(n for n in z.namelist() if re.search(r'EPUB/text/.*\.xhtml$|EPUB/ch\d+\.xhtml$|ch\d+\.xhtml$', n))
    for n in names:
        data = z.read(n).decode('utf-8', 'ignore')
        h = re.search(r'<h2[^>]*>(.*?)</h2>', data, re.S)
        c = re.match(r'Chapter (\d+)', strip(h.group(1))) if h else None
        if not c:
            continue
        ch, k = int(c.group(1)), 0
        for p in re.findall(r'<p[^>]*>(.*?)</p>', data, re.S):
            t = strip(p)
            if t:
                k += 1
                out.append((ch, k, t))
    return out


def load_hp():
    """Lines of each prepared book with the PDF page marker; windows are cut later."""
    books = {}
    for b in range(1, 8):
        page, lines = 0, []
        for i, line in enumerate(open(f'{NOV}/harry-potter/source-preparation-2026-10-11/book-0{b}.txt', encoding='utf-8')):
            m = re.match(r'\[B\d:PDF-p(\d+)\]', line)
            if m:
                page = int(m.group(1))
                continue
            lines.append((page, i, line.rstrip('\n')))
        books[b] = lines
    return books


def norm(s):
    return s.replace('’', "'").replace('‘', "'")


def claims_index():
    """The paid reader's claims by chapter, for the free pre-pass (reader notes, not the text)."""
    rows = []
    for f in glob.glob(f'{NOV}/full-book/reverend-insanity/readers/R*-CLAIMS.json'):
        for c in json.load(open(f)).get('claims', []):
            rows.append(c)
    return rows


def split(corpus, ids):
    """The ledger's held-out rule (GKM429): sha1(id)[0] < 0x33."""
    import hashlib
    return {i: hashlib.sha1(i.encode()).digest()[0] < 0x33 for i in ids}


def cap(lines, chars):
    out, n = [], 0
    for l in lines:
        if n + len(l) > chars and out:
            break
        out.append(l)
        n += len(l)
    return out


# ---------- Gu kinds ----------

def gu_terms(name):
    n = norm(name).strip()
    base = re.sub(r'\s+Gu$', '', n, flags=re.I)
    terms = {n}
    if re.search(r'\bImmortal Gu$', n, re.I):
        terms.add(re.sub(r'\s+Immortal\s+Gu$', ' Gu', n, flags=re.I))
        terms.add(re.sub(r'\s+Immortal\s+Gu$', '', n, flags=re.I) + ' Immortal')
    return [t for t in terms if len(t) > 5 and ' ' in t.strip() or t.lower().endswith(' gu')]


RANKW = r'(?:rank|grade)(?:[- ](?:one|two|three|four|five|six|seven|eight|nine|\d))?'


def alias_names():
    """PWC48: every English name a ledger row is also known by (wiki redirects, infobox aliases, the other source's spelling, the
    names of a merged duplicate), from docs/coverage/ri_aliases.json. Chinese names are not searched: the chapters are English."""
    p = os.path.join(ROOT, 'docs/coverage/ri_aliases.json')
    if not os.path.exists(p) or os.environ.get('NO_ALIASES'):
        return {}
    t = json.load(open(p, encoding='utf-8'))
    out = {}
    for i, v in t['names'].items():
        out.setdefault(i, set()).update(v['names'] + v['redirects'])
    for g in t['groups']:
        members = [g['keep']] + g['drop']
        names = set(g['names']) | {n for m in members for n in out.get(m, ())}
        for m in members:
            out[m] = names
    return out


def gu_universe():
    """Rank-blocked ledger rows (the work) plus kinds whose wiki category states a rank (the scoring cohort, GKM429 split by hash)."""
    idx = json.load(open(f'{NOV}/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json'))['records']
    rec = {r['id']: r for r in idx}
    ledger = [json.loads(l) for l in open(os.path.join(ROOT, 'docs/coverage/gu_kinds.jsonl')) if l.strip()]
    out = {}
    for row in ledger:
        r = rec.get(row['id'])
        r = r or {}
        name = (r.get('saga') or {}).get('name') or (r.get('fandom') or {}).get('name') or row['id']
        ranks = (r.get('metadata') or {}).get('fandom_category_ranks') or []
        if row['state'] == 'blocked:rank-unknown':
            out[row['id']] = {'name': name, 'role': 'blocked', 'wikiRank': None}
        elif ranks and not row['state'].startswith('not-a-thing'):
            out[row['id']] = {'name': name, 'role': 'cohort', 'wikiRank': min(ranks)}
    return out


def build_gu():
    universe = gu_universe()
    ri = load_ri()
    claims = [(c, norm(json.dumps(c, ensure_ascii=False)).lower()) for c in claims_index()]
    aka = alias_names()
    wanted = {i: sorted({t for n in [u['name'], *aka.get(i, ())] for t in gu_terms(n)}) for i, u in universe.items()}
    low = [(ch, k, norm(t), norm(t).lower()) for ch, k, t in ri]
    out, search = [], {}
    heldout = split('gu', list(universe))
    for i, u in universe.items():
        ts = wanted[i]
        tl = [t.lower() for t in ts]
        pats = [re.compile(r'\b' + re.escape(t) + r's?\b', re.I) for t in ts]
        h = [(ch, k, nt) for ch, k, nt, lw in low if any(t in lw for t in tl) and any(p.search(nt) for p in pats)] if ts else []
        cl = [c for c, js in claims if any(t in js for t in tl)] if ts else []
        def score(x):
            ch, k, t = x
            s = 0
            if re.search(RANKW, t, re.I):
                s += 3
            if re.search(r'\bGu\b[^.]{0,40}' + RANKW + r'|' + RANKW + r'[^.]{0,40}\bGu\b', t, re.I):
                s += 2
            return -s
        top = sorted(sorted(h, key=lambda x: (score(x), x[0], x[1]))[:8])
        ev = [f'[ri:ch{ch}:p{k}] {t}' for ch, k, t in top]
        for c in cl[:4]:
            ev.append(f"[claim:{c['id']} ch{c['chapter']}] {c['claim']}")
        search[i] = {'terms': ts, 'role': u['role'], 'wikiRank': u['wikiRank'], 'paragraphHits': len(h), 'claimHits': len(cl),
                     'chapters': sorted({x[0] for x in h})[:12], 'sent': bool(ev), 'heldOut': heldout[i]}
        if ev:
            out.append({'id': i, 'name': u['name'], 'role': u['role'], 'evidence': cap(ev, 9000)})
    return out, search


# ---------- Lord of the Mysteries potions ----------

def build_lotm():
    packets = json.load(open(PRIV + 'lotm_potions_packets.json'))
    paras = load_lotm()
    out, search = [], {}
    heldout = split('lotm', [p['id'] for p in packets])
    # chapter -> paragraphs for neighbour context
    byc = defaultdict(dict)
    for ch, k, t in paras:
        byc[ch][k] = t
    FORM = re.compile(r'(main ingredient|supplementary|ingredient|formula|potion)', re.I)
    for p in packets:
        i = p['id']
        name = (p.get('wikiName') or p.get('name') or '').replace('(', ' ').split(' ')[0:3]
        name = re.sub(r'\s*\(.*$', '', p.get('wikiName') or p.get('name') or '').strip()
        ingr = sorted({m for e in p['evidence'] for m in re.findall(r'\[ingr:([^\]]+)\]', e)})
        seq = p['seq']
        name_re = re.compile(r'\b' + re.escape(norm(name)) + r'\b', re.I) if name and len(name) > 2 else None
        ingr_re = [re.compile(r'\b' + re.escape(norm(x)) + r'\b', re.I) for x in ingr]
        hits = []
        for ch, k, t in paras:
            nt = norm(t)
            ni = sum(1 for r in ingr_re if r.search(nt))
            nm = bool(name_re and name_re.search(nt))
            seqm = re.search(r'sequence\s+' + str(seq) + r'\b', nt, re.I) or re.search(r'\bsequence\s+(?:nine|eight|seven|six|five|four|three|two|one|zero)\b', nt, re.I)
            f = bool(FORM.search(nt))
            s = 0
            if ni and f:
                s = 3 + ni
            elif nm and f and re.search(r'main ingredient|supplementary|formula|ingredients?', nt, re.I):
                s = 3
            elif nm and re.search(r'\b' + re.escape(norm(name)) + r'\s+potion\b', nt, re.I):
                s = 2
            if s:
                hits.append((s, ch, k))
        hits.sort(key=lambda x: (-x[0], x[1], x[2]))
        top = sorted(hits[:8], key=lambda x: (x[1], x[2]))
        ev = []
        seen = set()
        for s, ch, k in top:
            for kk in (k - 1, k, k + 1):
                if kk in byc[ch] and (ch, kk) not in seen and (kk == k or re.search(r'ingredient|formula', byc[ch][kk], re.I)):
                    seen.add((ch, kk))
                    ev.append(f'[lotm:ch{ch}:p{kk}] {norm(byc[ch][kk])}')
        search[i] = {'name': name, 'ingr': ingr, 'paragraphHits': len(hits), 'sent': bool(ev), 'heldOut': heldout[i]}
        if ev:
            out.append({'id': i, 'name': name, 'pathway': p['pathway'], 'seq': seq, 'wikiName': name, 'state': p['state'], 'evidence': cap(ev, 9000)})
    return out, search


# ---------- Harry Potter ingredients ----------

HPWORDS = re.compile(r'\b(potion|brew|ingredient|cauldron|add|stir|juice|powder|essence|poison|antidote|slic|chop|crush|dried|pickled|boil|shrivel|properties|effect|used)\w*', re.I)


def build_hp():
    packets = json.load(open(PRIV + 'hp_ingredients_packets.json'))
    books = load_hp()
    out, search = [], {}
    heldout = split('hp', [p['id'] for p in packets])
    for p in packets:
        i = p['id']
        name = norm(p['name']).strip()
        base = re.sub(r"'s$", '', name)
        pat = re.compile(r'\b' + re.escape(base).replace(r'\ ', r'\s+') + r"(?:'s|s|es)?\b", re.I)
        # one-word generic names (Alcohol, Fire, Water) are matched only in a potion context
        generic = len(base.split()) == 1 and len(base) <= 6
        hits = []
        for b, lines in books.items():
            for j, (page, ln, text) in enumerate(lines):
                joined = text
                if pat.search(joined):
                    win = lines[max(0, j - 2): j + 4]
                    wt = ' '.join(x[2] for x in win)
                    ctx = len(HPWORDS.findall(wt))
                    if generic and not ctx:
                        continue
                    hits.append((ctx, b, page, ln, wt))
        hits.sort(key=lambda x: (-x[0], x[1], x[3]))
        top = hits[:8]
        top.sort(key=lambda x: (x[1], x[3]))
        ev = [f'[hp:b{b}:pdf{page}:l{ln}] {wt}' for ctx, b, page, ln, wt in top]
        search[i] = {'term': base, 'windowHits': len(hits), 'sent': bool(ev), 'heldOut': heldout[i], 'books': sorted({h[1] for h in hits})}
        if ev:
            out.append({'id': i, 'name': name, 'state': p['state'], 'evidence': cap(ev, 7000)})
    return out, search


BUILD = {'gu_kinds': build_gu, 'lotm_potions': build_lotm, 'hp_ingredients': build_hp}

if __name__ == '__main__':
    for name in sys.argv[1:]:
        packets, search = BUILD[name]()
        json.dump(packets, open(PRIV + f'ch_{name}_packets.json', 'w'))
        json.dump(search, open(PRIV + f'ch_{name}_search.json', 'w'))
        sent = len(packets)
        print(json.dumps({'corpus': name, 'rows': len(search), 'withChapterText': sent, 'noMention': len(search) - sent,
                          'evidenceChars': sum(len(e) for p in packets for e in p['evidence'])}))
