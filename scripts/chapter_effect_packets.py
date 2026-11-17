#!/usr/bin/env python3 -I
"""Effect-unknown packets from chapters (PWC27, 2026-11-17): a deterministic search of each book's private chapter text for every
`blocked:effect-unknown` ledger row, by name and aliases. No model call. Writes, into the gitignored private folder,
ch_effect_<ledger>_packets.json ({id, name, evidence: ['[locator] text']}, at most eight paragraphs) and
ch_effect_<ledger>_search.json (terms, hit counts, whether anything was sent: rows with zero hits are results too).

  python3 -I scripts/chapter_effect_packets.py [ledger ...]      (no argument: every ledger below)

Corpus adapters reuse scripts/chapter_tier_packets.py (Reverend Insanity, Lord of the Mysteries, Harry Potter) and add a generic
EPUB reader (locator <tag>:m<spine member>:p<paragraph>) and the Re:Zero translation posts (rz:<post id>:p<paragraph>).
Env: CHAPTER_SOURCE_ROOT (checkout holding docs/research/novels), BOOKS_DIR (default ~/Downloads/Books_Reading).
Raw text never leaves the private folder.
"""
import importlib.util, json, os, re, sys, zipfile, html, glob, hashlib

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
spec = importlib.util.spec_from_file_location('ctp', os.path.join(ROOT, 'scripts/chapter_tier_packets.py'))
ctp = importlib.util.module_from_spec(spec); spec.loader.exec_module(ctp)
NOV, PRIV, norm, strip = ctp.NOV, ctp.PRIV, ctp.norm, ctp.strip
BOOKS = os.environ.get('BOOKS_DIR', os.path.expanduser('~/Downloads/Books_Reading'))
HOME = os.path.expanduser('~')


def epub(path, tag):
    """[(locator, text)] over every spine member: <tag>:m<ordinal>:p<k>."""
    z = zipfile.ZipFile(path)
    opf = next(n for n in z.namelist() if n.endswith('.opf'))
    base = os.path.dirname(opf)
    data = z.read(opf).decode('utf-8', 'ignore')
    items = {m.group(1): m.group(2) for m in re.finditer(r'<item\b[^>]*?\bid="([^"]+)"[^>]*?\bhref="([^"]+)"', data)}
    items.update({m.group(2): m.group(1) for m in re.finditer(r'<item\b[^>]*?\bhref="([^"]+)"[^>]*?\bid="([^"]+)"', data)})
    out = []
    for i, ref in enumerate(re.findall(r'<itemref\b[^>]*?\bidref="([^"]+)"', data)):
        href = items.get(ref)
        if not href:
            continue
        name = os.path.normpath(os.path.join(base, html.unescape(href).split('#')[0])).replace('\\', '/')
        try:
            body = z.read(name).decode('utf-8', 'ignore')
        except KeyError:
            continue
        k = 0
        for p in re.findall(r'<p\b[^>]*>(.*?)</p>', body, re.S):
            t = strip(p)
            if t:
                k += 1
                out.append((f'{tag}:m{i}:p{k}', norm(t)))
    return out


def load_rezero():
    d = json.load(open(f'{NOV}/rezero/witchcult/witchcult_text.json'))
    out = []
    for post in d:
        k = 0
        for line in post['text'].split('\n'):
            t = line.strip()
            if len(t) > 3 and not t.startswith('※'):
                k += 1
                out.append((f"rz:{post['id']}:p{k}", norm(t)))
    return out


def tagged(pairs):
    return pairs


def find_book(pattern):
    hits = [p for root in (BOOKS, f'{HOME}/Sync/CalibreLibrary', f'{HOME}/Calibre Library') for p in glob.glob(f'{root}/**/*.epub', recursive=True) if re.search(pattern, os.path.basename(p), re.I)]
    return sorted(hits)


def ri_pairs():
    return [(f'ri:ch{ch}:p{k}', norm(t)) for ch, k, t in ctp.load_ri()]


def lotm_pairs():
    return [(f'lotm:ch{ch}:p{k}', norm(t)) for ch, k, t in ctp.load_lotm()]


def hp_pairs():
    """Windows of five lines, so a hit carries its neighbours (the prepared text has no paragraph breaks)."""
    out = []
    for b, lines in ctp.load_hp().items():
        for j in range(0, len(lines), 3):
            win = lines[j:j + 5]
            out.append((f'hp:b{b}:pdf{win[0][0]}:l{win[0][1]}', norm(' '.join(x[2] for x in win))))
    return out


def multi(tagged_paths):
    out = []
    for tag, path in tagged_paths:
        out += epub(path, tag)
    return out


def one(pattern, tag, exclude=None):
    c = [p for p in find_book(pattern) if not (exclude and re.search(exclude, p, re.I))]
    if not c:
        raise SystemExit(f'no epub for {tag}: {pattern}')
    return epub(c[0], tag)


# ledger -> (corpus loader, locator tag prefix is inside the loader)
CORPORA = {
    'gu_kinds': ri_pairs, 'ri_treasures': ri_pairs, 'lotm_artifacts': lotm_pairs, 'hp_objects': hp_pairs,
    'worm_powers': lambda: epub(f'{NOV}/worm/private/source/worm.epub', 'worm'),
    'circle_of_inevitability_powers': lambda: epub(f'{NOV}/circle-of-inevitability/private/source/en/coi_en_webnovel_official.epub', 'coi'),
    'legendary_mechanic_powers': lambda: one(r'Legendary Mechanic', 'lm'),
    'mother_of_learning_powers': lambda: one(r'Mother of Learning', 'mol'),
    'fated_villain_powers': lambda: one(r'Fated Villain', 'fv'),
    'a_novel_concept_powers': lambda: one(r'Novel Concept', 'anc'),
    'speedrunning_multiverse_powers': lambda: multi([(f'smm{n}', p) for n, p in enumerate(sorted(find_book(r'Speedrunning the Multiverse')), 1)]),
    'rezero_powers': load_rezero,
}

# ---------- names ----------
SKIP_ALIAS = re.compile(r'^(the|a|an)$', re.I)


def sheet_names(ledger):
    """id -> (name, aliases) from the ledger's own sheet file."""
    out = {}
    base = f'{ROOT}/docs/coverage/'
    for f in os.listdir(base):
        if not f.endswith('.json') or not (f.startswith(ledger.replace('_powers', '')) or f.startswith(ledger)):
            continue
        d = json.load(open(base + f))
        for coll in ([d] if isinstance(d, list) else [v for v in d.values() if isinstance(v, (dict, list))]):
            items = coll if isinstance(coll, list) else [{'id': k, **v} for k, v in coll.items() if isinstance(v, dict)]
            for it in items:
                if isinstance(it, dict) and it.get('id') and it.get('name'):
                    out[it['id']] = (it['name'], it.get('aliases') or [])
    return out


def clean_terms(name, aliases):
    terms = []
    for n in [name] + list(aliases):
        n = norm(n or '').strip()
        n = re.sub(r'\s*\([^)]*\)', '', n).strip()
        for part in re.split(r'\s+/\s+', n):
            part = part.strip(' .')
            if len(part) >= 4 and not SKIP_ALIAS.match(part) and part.lower() not in {t.lower() for t in terms}:
                terms.append(part)
    return terms


def rows_of(ledger):
    rows = [json.loads(l) for l in open(f'{ROOT}/docs/coverage/{ledger}.jsonl') if l.strip()]
    return [r for r in rows if r['state'] == 'blocked:effect-unknown']


def known_effect(ledger, i, cache={}):
    """The effect sentence an earlier tier already holds for a row (wiki, claim or model tier), as (verb, object), or None."""
    if ledger not in cache:
        base = f'{ROOT}/docs/coverage/'
        d = {}
        for f, key in {'hp_objects': 'hp_objects_labels', 'lotm_artifacts': 'lotm_artifacts_labels', 'ri_treasures': 'ri_treasures_labels',
                       'circle_of_inevitability_powers': 'circle_of_inevitability_power_labels', 'fated_villain_powers': 'fated_villain_power_labels',
                       'legendary_mechanic_powers': 'legendary_mechanic_power_labels', 'mother_of_learning_powers': 'mother_of_learning_power_labels',
                       'worm_powers': 'worm_power_labels', 'rezero_powers': 'rezero_power_labels',
                       'a_novel_concept_powers': 'a_novel_concept_powers_sheet', 'speedrunning_multiverse_powers': 'speedrunning_multiverse_powers_sheet'}.items():
            if f == ledger:
                d = json.load(open(base + key + '.json'))
        cache[ledger] = d
    d = cache[ledger]
    if isinstance(d, list):
        e = next((x for x in d if x.get('id') == i), None)
        g = (e or {}).get('grammar') or {}
        return (g.get('verb'), g.get('object')) if g.get('verb') else None
    for coll in ('sheets', 'rows', 'labels'):
        e = (d.get(coll) or {}).get(i)
        if not e:
            continue
        if 'sheet' in e or coll == 'sheets':
            g = (e.get('sheet') or e).get('effect') or {}
            return (g.get('verb'), g.get('object')) if g.get('verb') not in (None, '', 'none') else None
        if 'labels' in e:
            g = e['labels']
            v = (g.get('verb') or {}).get('value')
            return (v, (g.get('object') or {}).get('value')) if v and v not in ('none-stated', 'none') else None
        g = e.get('grammar') or {}
        if isinstance(g, str):
            return None
        return (g.get('verb'), g.get('object')) if g.get('verb') and g.get('verb') != 'none' else None
    return None


def cohort_of(ledger, per=30):
    """Rows that already hold an effect sentence (the scoring cohort): the first `per` by hash, half held out (GKM429)."""
    if ledger == 'gu_kinds':
        return {}
    rows = [json.loads(l) for l in open(f'{ROOT}/docs/coverage/{ledger}.jsonl') if l.strip()]
    ok = [r['id'] for r in rows if not r['state'].startswith(('blocked:effect-unknown', 'not-a-thing')) and known_effect(ledger, r['id'])]
    ho = ctp.split(ledger, ok)
    pick = sorted([i for i in ok if ho[i]], key=lambda i: hashlib.sha1(i.encode()).hexdigest())[:per // 2] + \
        sorted([i for i in ok if not ho[i]], key=lambda i: hashlib.sha1(i.encode()).hexdigest())[:per - per // 2]
    return {i: known_effect(ledger, i) for i in pick}


def universe(ledger):
    rows = rows_of(ledger)
    out = {}
    if ledger == 'gu_kinds':
        idx = json.load(open(f'{NOV}/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json'))['records']
        rec = {r['id']: r for r in idx}
        for r in rows:
            x = rec.get(r['id'], {})
            name = (x.get('saga') or {}).get('name') or (x.get('fandom') or {}).get('name') or r['id']
            out[r['id']] = {'name': name, 'terms': ctp.gu_terms(name), 'role': 'blocked', 'known': None}
        return out
    names = sheet_names(ledger)
    coh = cohort_of(ledger)
    allrows = rows + [{'id': i, 'note': '', 'cohort': True} for i in coh]
    for r in allrows:
        if r['id'] in names:
            nm, al = names[r['id']]
        else:
            nm = re.split(r'\. ', r.get('note', ''))[0] if ledger not in ('rezero_powers',) else r['id'].split('.')[-1].replace('-', ' ').title()
            al = []
            m = re.search(r'\(also ([^)]+)\)', nm)
            if m:
                al = [m.group(1)]
        nm = nm or r['id'].split('.')[-1].replace('_', ' ').replace('-', ' ').title()
        out[r['id']] = {'name': nm, 'terms': clean_terms(nm, al), 'role': 'cohort' if r.get('cohort') else 'blocked', 'known': list(coh[r['id']]) if r.get('cohort') else None}
    return out


EFFECTW = re.compile(r'\b(can|could|allow\w*|enable\w*|cause\w*|let\w*|make\w*|turn\w*|grant\w*|power|ability|effect|activate\w*|use[sd]?|cast\w*|spell|skill|technique|strik\w*|protect\w*|heal\w*|detect\w*|control\w*|create\w*|summon\w*|absorb\w*|resist\w*)\b', re.I)


def search(ledger, paras):
    uni = universe(ledger)
    low = [(loc, t, t.lower()) for loc, t in paras]
    out, res = [], {}
    heldout = ctp.split(ledger, list(uni))
    for i, u in uni.items():
        ts = u['terms']
        pats = []
        for t in ts:
            # one-word names must match capitalised; multi-word names match any case
            pats.append(re.compile(r'\b' + re.escape(t) + r"(?:'s|s|es)?\b", 0 if ' ' not in t else re.I))
        low_t = [t.lower() for t in ts]
        hits = []
        if pats:
            for loc, t, lw in low:
                if any(x in lw for x in low_t) and any(p.search(t) for p in pats):
                    hits.append((loc, t))
        def score(h):
            loc, t = h
            return -(len(EFFECTW.findall(t)) * 2 + (1 if 80 < len(t) < 700 else 0))
        top = sorted(sorted(hits, key=lambda h: (score(h), h[0]))[:8])
        ev = [f'[{loc}] {t[:900]}' for loc, t in top]
        res[i] = {'role': u['role'], 'known': u['known'], 'name': u['name'], 'terms': ts, 'paragraphHits': len(hits), 'sent': bool(ev), 'heldOut': heldout[i]}
        if ev:
            out.append({'id': i, 'name': u['name'], 'evidence': ctp.cap(ev, 7000)})
    return out, res


if __name__ == '__main__':
    todo = sys.argv[1:] or list(CORPORA)
    cache = {}
    for ledger in todo:
        fn = CORPORA[ledger]
        if fn not in cache:
            cache[fn] = fn()
        packets, res = search(ledger, cache[fn])
        json.dump(packets, open(PRIV + f'ch_effect_{ledger}_packets.json', 'w'))
        json.dump(res, open(PRIV + f'ch_effect_{ledger}_search.json', 'w'))
        print(json.dumps({'ledger': ledger, 'paragraphs': len(cache[fn]), 'rows': len(res), 'sent': len(packets), 'zeroHits': len(res) - len(packets),
                          'chars': sum(len(e) for p in packets for e in p['evidence'])}), flush=True)
