#!/usr/bin/env python3 -I
"""Reverend Insanity alias table (PWC48, proposals, 2026-11-17). Data first, no paid calls.

  python3 -I scripts/ri_aliases.py build <wiki.xml>      write docs/coverage/ri_aliases.json (the data sources below)
  python3 -I scripts/ri_aliases.py candidates <wiki.xml>  print the near-key pairs the model pass should judge (no write)

<wiki.xml> is the Reverend Insanity fandom dump extracted from
~/.codex/research/wikis/reverend-insanity.fandom.com/dump/*.7z (extract it into its own new folder; it is untrusted text).
Sources, in order of strength: (1) the same Chinese name on two index records, (2) a wiki redirect or an infobox `alias`
that joins two records, (3) the same name key after the pinyin and translation word maps. Judged pairs
(docs/coverage/ri_alias_pairs.json, written by scripts/ri_alias_pairs.mjs) are folded in last. Raw wiki prose never enters the output:
only names, redirect titles and Chinese titles do.
"""
import json, os, re, sys, html, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
PRIV = 'docs/research/novels/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json'
INDEX = next(p for p in (os.path.join(ROOT, PRIV), '/Users/weiwei/code/yet-another-idle-rpg/' + PRIV) if os.path.exists(p))
OUT = os.path.join(ROOT, 'docs/coverage/ri_aliases.json')
PAIRS = os.path.join(ROOT, 'docs/coverage/ri_alias_pairs.json')

# Pinyin words that appear in canon Gu names, with the Chinese character the wiki's own titles carry and the English the
# translations use. Used to read a pinyin name against an English one (Jun Gu is the pinyin of 钧力 Jun Strength); a map
# entry only bridges names, it never merges two rows on its own.
PINYIN = [
    ('jun', '钧', ['jun', 'strength'], 'Jun Strength Gu is 钧力蛊; Jun alone abbreviates it'),
    ('li', '力', ['strength'], 'the suffix of every Strength Gu (熊力 bear strength)'),
    ('qi', '气', ['qi', 'aura', 'air'], 'qi, aura or air by translation (Qi Flow = 化气)'),
    ('yin', '阴', ['yin'], ''), ('yang', '阳', ['yang'], ''),
    ('jin', '金', ['gold', 'golden'], ''), ('zhan', '斩', ['slash', 'cut'], 'zhan as slash: 斩'),
    ('bai', '白', ['white'], ''), ('hei', '黑', ['black'], ''), ('hong', '红', ['red'], ''), ('qing', '青', ['green', 'azure'], 'Green and Azure share 青'),
    ('lan', '蓝', ['blue'], ''), ('huang', '黄', ['yellow'], ''), ('xue', '血', ['blood'], ''), ('hun', '魂', ['soul'], ''),
    ('long', '龙', ['dragon'], ''), ('hu', '虎', ['tiger'], ''), ('lang', '狼', ['wolf'], ''), ('niu', '牛', ['ox', 'bull', 'cow'], ''),
    ('gui', '龟', ['turtle', 'tortoise'], ''), ('xiong', '熊', ['bear'], ''), ('e', '鳄', ['crocodile'], ''),
    ('jiu', '酒', ['wine', 'liquor'], 'Wine Worm and Liquor Worm are both 酒虫'), ('chong', '虫', ['worm'], ''),
    ('yue', '月', ['moon'], ''), ('guang', '光', ['light'], ''), ('ying', '影', ['shadow'], ''), ('lei', '雷', ['thunder', 'lightning'], ''),
    ('dian', '电', ['lightning', 'electric'], ''), ('feng', '风', ['wind'], ''), ('shui', '水', ['water'], ''), ('huo', '火', ['fire'], ''),
    ('tu', '土', ['earth'], ''), ('mu', '木', ['wood'], ''), ('bing', '冰', ['ice'], ''), ('shan', '山', ['mountain'], ''),
    ('xin', '心', ['heart'], ''), ('dao', '刀', ['blade', 'knife', 'saber'], ''), ('jian', '剑', ['sword'], ''),
    ('tian', '天', ['heaven', 'sky'], ''), ('di', '地', ['earth'], ''), ('xian', '仙', ['immortal'], ''), ('gu', '蛊', ['gu'], ''),
    ('wei', '味', ['flavor', 'taste'], 'Four Flavors Liquor Worm is 四味酒虫'),
]
# Translation word pairs: from the wiki's own redirects between Gu titles that differ by one word, then a short hand list
# of well-known fan-translation splits. Each is a hint toward a candidate pair; the model pass confirms the pair.
SYNONYMS = [('thunder', 'lightning'), ('meat', 'flesh'), ('stone', 'rock'), ('preserving', 'retaining'), ('pouch', 'bag'),
            ('manner', 'attitude'), ('flavours', 'flavors'), ('flavour', 'flavors'), ('flavor', 'flavors'), ('traveling', 'travel'),
            ('searching', 'search'), ('fake', 'false'), ('gold', 'golden'), ('fire', 'fiery'), ('longevity', 'lifespan'),
            ('consuming', 'eating'), ('jumping', 'hopping'), ('wine', 'liquor'), ('scar', 'moonscar'), ('mount', 'mountain'),
            ('giant', 'large'), ('big', 'large'), ('essence', 'primeval'), ('bloodline', 'blood'), ('aura', 'qi')]
NOISE = {'gu', 'worm', 'the'}
CANON = {}
for a, b in SYNONYMS:
    CANON[a] = CANON.get(b, b)
CANON['moonscar'] = 'moonscar'


def tokens(name):
    out = []
    for w in re.findall(r'[a-z]+', name.lower().replace("'s", '')):
        if w in NOISE:
            continue
        w = CANON.get(w, w)
        if len(w) > 3 and w.endswith('s') and not w.endswith('ss'):
            w = w[:-1]
        out.append(CANON.get(w, w))
    return out


def key(name):
    """Name key: words after the translation map, joined with no spaces (Moon Scar = Moonscar, Ice Blade = Iceblade)."""
    return ''.join(tokens(name))


def zh_of(text):
    return sorted(set(re.findall(r'[一-鿿]{2,}', text)))


def load_wiki(path):
    t = open(path, encoding='utf8').read()
    pages = {}
    redirects = {}
    for p in re.findall(r'<page>(.*?)</page>', t, re.S):
        title = html.unescape(re.search(r'<title>(.*?)</title>', p).group(1))
        m = re.search(r'<redirect title="(.*?)"', p)
        if m:
            redirects[title] = html.unescape(m.group(1))
            continue
        body = html.unescape(p)
        z = re.search(r'title1\s*=\s*([^|}]*)', body)
        a = re.search(r'\|\s*alias\s*=\s*([^|\n}]*)', body)
        pages[title] = {'zh': zh_of(z.group(1)) if z else [],
                        'alias': [x.strip(' *') for x in re.split(r'<br\s*/?>|,|;|\n', a.group(1)) if x.strip(' *')] if a else []}
    return pages, redirects


def clean_name(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', s)).strip(' *')


def build(wiki):
    pages, redirects = load_wiki(wiki)
    recs = json.load(open(INDEX, encoding='utf8'))['records']
    by_title = {}
    for title in list(pages) + list(redirects):
        by_title.setdefault(re.sub(r'[^a-z0-9]+', ' ', title.lower()).strip(), title)
    claim = json.load(open(os.path.join(ROOT, 'docs/coverage/ri_move_claim_checks.json')))['kinds']
    rows = {}
    for r in recs:
        if r['status'] == 'reference-page':
            continue
        names = [n for n in ((r.get('saga') or {}).get('name'), (r.get('fandom') or {}).get('name')) if n]
        # a record the chapter claim check mapped to a catalogue Gu is a chapter-checked row under its catalogue id
        rows[r['id']] = {'id': r['id'], 'status': 'novel-checked' if claim.get(r['id'], {}).get('catalogue') else r['status'], 'catalogue': claim.get(r['id'], {}).get('catalogue'), 'names': list(dict.fromkeys(names)), 'zh': [], 'via': {}}
    # wiki: follow each record's title (and redirects pointing at it) to a page; collect Chinese titles, aliases, redirects
    back = collections.defaultdict(list)
    for src, dst in redirects.items():
        back[re.sub(r'[^a-z0-9]+', ' ', dst.lower()).strip()].append(src)
    for rid, row in rows.items():
        page_titles = set()
        for n in row['names']:
            k = re.sub(r'[^a-z0-9]+', ' ', n.lower()).strip()
            t = by_title.get(k)
            if t in redirects:  # a record named by a redirect title: its page is the target
                row['via'].setdefault('redirectTo', []).append(redirects[t])
                t = redirects[t]
            if t in pages:
                page_titles.add(t)
        for t in page_titles:
            pg = pages[t]
            row['zh'] += pg['zh']
            row['names'] += [clean_name(x) for x in pg['alias'] if re.search(r'[A-Za-z]', x) and 'Gu' in x or re.search(r'[A-Za-z]{3}', x)]
            for src in back.get(re.sub(r'[^a-z0-9]+', ' ', t.lower()).strip(), []):
                if re.search(r'\bGu\b|\bWorm\b', src) or key(src) == key(t):
                    row['via'].setdefault('redirectFrom', []).append(src)
        row['zh'] = sorted(set(row['zh']))
        row['redirects'] = sorted(set(row['via'].get('redirectFrom', [])))
    # name-> record id (every known name and redirect title points at its record)
    owner = collections.defaultdict(set)
    for rid, row in rows.items():
        for n in row['names'] + row['redirects'] + row['via'].get('redirectTo', []):
            owner[re.sub(r'[^a-z0-9]+', ' ', n.lower()).strip()].add(rid)
    edges = collections.defaultdict(set)  # id -> {(other, basis)}
    zh_owner = collections.defaultdict(set)
    for rid, row in rows.items():
        for z in row['zh']:
            zh_owner[z].add(rid)
    for z, ids in zh_owner.items():
        for a in ids:
            for b in ids:
                if a != b:
                    edges[a].add((b, 'same Chinese name ' + z))
    for n, ids in owner.items():
        for a in ids:
            for b in ids:
                if a != b:
                    edges[a].add((b, 'shared wiki name or redirect "%s"' % n))
    return rows, edges, redirects


def keep_rank(row):
    st = {'novel-checked': 0, 'candidate-exact': 1, 'candidate-suffix': 1, 'fandom-only': 2, 'saga-only': 3}
    return (st.get(row['status'], 4), len(row['id']), row['id'])


def toks_plain(name):
    return {w for w in tokens(name) if w not in ('immortal', 'mortal')}


def overlap(rows, a, b):
    best = 0.0
    for x in rows[a]['names']:
        for y in rows[b]['names']:
            ta, tb = toks_plain(x), toks_plain(y)
            if ta and tb:
                best = max(best, len(ta & tb) / len(ta | tb))
    return best


def is_auto(rows, a, b, why):
    """Strong enough to merge without a model: the pair shares a Chinese name or a wiki name, the English names overlap by half or
    more, and the Chinese 仙 (Immortal) marker agrees where both have one. Anything weaker is a candidate for the model pass."""
    za, zb = rows[a]['zh'], rows[b]['zh']
    if za and zb and (any('仙' in z for z in za) != any('仙' in z for z in zb)):
        return False
    return overlap(rows, a, b) >= 0.5


def groups_from(rows, edges, extra=()):
    """Union-find over strong edges. Never merge two novel-checked rows (their chapters differ); report them instead."""
    parent = {r: r for r in rows}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    basis = collections.defaultdict(list)
    held = []
    pairs = [(a, b, why) for a, es in edges.items() for b, why in es if is_auto(rows, a, b, why)] + list(extra)
    for a, b, why in sorted(pairs):
        if a not in rows or b not in rows:
            continue
        ra, rb = find(a), find(b)
        if ra == rb:
            basis[ra].append(why)
            continue
        if rows[a]['status'] == 'novel-checked' and rows[b]['status'] == 'novel-checked':
            held.append({'a': a, 'b': b, 'why': why, 'reason': 'both are chapter-checked rows'})
            continue
        parent[rb] = ra
        basis[ra].append(why)
    comp = collections.defaultdict(list)
    for r in rows:
        comp[find(r)].append(r)
    out = []
    for members in comp.values():
        if len(members) < 2:
            continue
        members.sort(key=lambda i: keep_rank(rows[i]))
        why = sorted({w for m in members for w in basis.get(find(m), [])} | {w for a, b, w in pairs if a in members and b in members})
        out.append({'keep': members[0], 'keepRow': rows[members[0]].get('catalogue') or members[0], 'drop': members[1:], 'names': sorted({n for m in members for n in rows[m]['names']}), 'basis': why[:6]})
    return sorted(out, key=lambda g: g['keep']), held


def key_candidates(rows, known, edges):
    """Pairs the model pass judges: weak edges (a shared Chinese name or wiki name with little English overlap) and records whose
    name keys are equal after the word maps, none of them already merged."""
    byk = collections.defaultdict(list)
    for rid, row in rows.items():
        for n in row['names']:
            k = key(n)
            if k and rid not in byk[k]:
                byk[k].append(rid)
    out = {}
    for k, ids in byk.items():
        for i, a in enumerate(ids):
            for b in ids[i + 1:]:
                out.setdefault(tuple(sorted((a, b))), 'same name key "%s"' % k)
    for a, es in edges.items():
        for b, why in es:
            if not is_auto(rows, a, b, why):
                out.setdefault(tuple(sorted((a, b))), why)
    return [(a, b, why) for (a, b), why in sorted(out.items()) if (a, b) not in known and (b, a) not in known]


def main():
    cmd, wiki = sys.argv[1], sys.argv[2]
    rows, edges, redirects = build(wiki)
    strong, held = groups_from(rows, edges)
    comp = {m: g['keep'] for g in strong for m in [g['keep']] + g['drop']}
    cands = [c for c in key_candidates(rows, set(), edges) if comp.get(c[0]) is None or comp.get(c[0]) != comp.get(c[1])]
    if cmd == 'candidates':
        packet = {rid: {'names': r['names'][:4], 'zh': r['zh'][:2], 'status': r['status']} for rid, r in rows.items()}
        json.dump({'auto': len(strong), 'pairs': [{'a': a, 'b': b, 'why': w} for a, b, w in cands], 'records': packet},
                  open(sys.argv[3], 'w', encoding='utf8'), ensure_ascii=False)
        print(json.dumps({'auto': len(strong), 'candidates': len(cands)}, ensure_ascii=False))
        return
    judged = json.load(open(PAIRS)) if os.path.exists(PAIRS) else {'pairs': []}
    extra = [(p['a'], p['b'], 'judged same (%s)' % p['basis']) for p in judged['pairs'] if p['verdict'] == 'same' and p['a'] != p['b']]
    groups, held2 = groups_from(rows, edges, extra)
    table = {rid: {'names': list(dict.fromkeys(r['names'])), 'zh': r['zh'], 'redirects': r['redirects']}
             for rid, r in sorted(rows.items()) if len(r['names']) > 1 or r['zh'] or r['redirects']}
    data = {'meta': {'proposal': 'PWC48', 'date': '2026-11-17',
                     'sources': 'Reverend Insanity wiki redirects, infobox alias and Chinese titles (dump 2026-08, names only); index record names (saga and fandom); judged pairs in ri_alias_pairs.json',
                     'rule': 'a group merges when records share a Chinese name, a wiki redirect or alias name, or a judged same pair; two chapter-checked rows never merge (held)',
                     'counts': {'records': len(rows), 'withZh': sum(1 for r in rows.values() if r['zh']), 'withRedirects': sum(1 for r in rows.values() if r['redirects']),
                                'groups': len(groups), 'merged': sum(len(g['drop']) for g in groups), 'heldGroups': len(held2), 'keyCandidates': len(cands)}},
            'pinyin': [{'pinyin': p, 'zh': z, 'english': e, 'note': n} for p, z, e, n in PINYIN],
            'synonyms': [list(s) for s in SYNONYMS],
            'groups': groups, 'held': held2, 'names': table}
    json.dump(data, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=None, separators=(',', ':'))
    open(OUT, 'a').write('\n')
    print(json.dumps(data['meta']['counts']))


if __name__ == '__main__':
    main()
