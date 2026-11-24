#!/usr/bin/env python3 -I
"""Free full-text rank pass for Gu kinds (2026-11-24, audit GU_UNKNOWN_BLOCKERS_SAMPLE A1). Deterministic, no paid reader.

Scans every Reverend Insanity paragraph that names a Gu (same terms as scripts/chapter_tier_packets.py: the identity name plus
ri_aliases.json) for a rank bound to that name, e.g. "Rank two Ice Blade Gu", "Plunder Gu is only a Rank two",
"wolf swallow Gu, a rank four storage Gu". It is scored first on the cohort of rows whose wiki category states a rank, then
proposes ranks for blocked:rank-unknown and blocked:effect-unknown rows. Proposals are candidates for a second reader, never
a ledger write.

  python3 -I scripts/gu_fulltext_rank_pass.py            # writes the private proposals file, prints the scores
  python3 -I scripts/gu_fulltext_rank_pass.py --self-test

Output (gitignored private folder, raw text stays private): <PRIV>/fulltext_gu_ranks.json.
"""
import importlib.util, json, os, re, sys
from collections import Counter

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
_spec = importlib.util.spec_from_file_location('ctp', os.path.join(ROOT, 'scripts/chapter_tier_packets.py'))
ctp = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ctp)

WORDS = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9}
NUM = r'(one|two|three|four|five|six|seven|eight|nine|[1-9])'
# "rank N" followed by these is a person's or aperture's rank, a target rank or a comparison, not this Gu's rank.
NOT_GU = re.compile(r'^\s*(?:Gu Masters?|Gu Immortals?|cultivation|cultivator|aperture|peak|initial|middle|upper|lower|realm|expert|beasts?)\b', re.I)
TARGET = re.compile(r'(?:to|into|until|reach(?:ed|es)?|advance[sd]?|upgrade[sd]?|refine[sd]? (?:it )?(?:in)?to|than)\s+(?:a\s+)?$', re.I)


# "a rank four storage Gu": up to two lowercase words before "Gu" name its type, an effect-family hint for effect-unknown rows.
TYPE = r'(?:\s+((?:[a-z][a-z-]+\s+){1,2})(?=Gu\b))?'
NOT_TYPE = {'immortal', 'mortal', 'rare', 'common', 'ordinary', 'precious', 'expendable', 'consumable', 'vital', 'the', 'a', 'one', 'only'}


def type_of(words):
    w = [x for x in (words or '').split() if x.lower() not in NOT_TYPE]
    return ' '.join(w) or None


def rank_of(word):
    return WORDS.get(word.lower()) or int(word)


LEFT_OK = {'the', 'a', 'an', 'this', 'that', 'these', 'those', 'his', 'her', 'its', 'their', 'my', 'your', 'our', 'of', 'with',
           'and', 'or', 'but', 'used', 'using', 'use', 'one', 'only', 'if', 'as', 'was', 'is', 'whereas', 'while'}


def clean_left(text, start):
    """True when the name starts a name: nothing before it, punctuation, a possessive or a function word. "Remnant life Gu"
    and "great thief Gu" are other Gu, not "Life Gu" or "Thief Gu"."""
    before = text[:start].rstrip()
    if not before or before[-1] in '.,;:!?"\'()[]-–—':
        return True
    word = re.search(r"([\w'’]+)$", before).group(1)
    return word.lower() in LEFT_OK or word.endswith(("'s", "’s"))


def ranks_in(text, term):
    """Ranks bound to `term` in one paragraph, as [(rank, pattern)]. Only "mortal" or "Immortal" may sit between "rank N" and
    the name, and the name must start cleanly (clean_left), so a shorter name never borrows a longer Gu's rank."""
    t = re.escape(term)
    out = []
    pats = [
        ('before', re.compile(rf'\brank[- ]{NUM}\s+(?:(?:im)?mortal\s+)?({t})s?\b', re.I)),
        ('copula', re.compile(rf'\b({t})s?\b(?:[^.!?;]{{0,15}}?)\b(?:is|was|are|were|being)\s+(?:only\s+|just\s+|merely\s+|also\s+)?(?:a\s+|an\s+)?(?:mere\s+)?rank[- ]{NUM}\b{TYPE}', re.I)),
        ('apposition', re.compile(rf'\b({t})s?\b,\s+(?:a|an|the)\s+rank[- ]{NUM}\b{TYPE}', re.I)),
    ]
    for kind, p in pats:
        for m in p.finditer(text):
            if kind == 'before':
                rank_word, name_start = m.group(1), m.start(2)
                if TARGET.search(text[max(0, m.start() - 25):m.start()]):
                    continue
            else:
                name_start, rank_word = m.start(1), m.group(2)
                if not clean_left(text, name_start):
                    continue
                if re.search(r'\bGu\b', text[m.end(1):m.start(2)].replace(term, ''), re.I) and kind == 'copula':
                    continue
                if NOT_GU.match(text[m.end():]):
                    continue
            out.append((rank_of(rank_word), kind) if kind == 'before' else (rank_of(rank_word), kind, type_of(m.group(3))))
    return out


LIST = re.compile(rf'^\s*rank[- ]{NUM}\s+(?:(?:im)?mortal\s+)?Gu(?:\s+worms?)?\s*:\s*(.+)$', re.I)


def list_ranks(text, term):
    """Inventory lists such as "Rank six Immortal Gu: Unravel Mystery, Blood Asset, ..." (ri:ch1291:p83): the bare name
    (without "Gu" or "Immortal Gu") must be a whole list item."""
    m = LIST.match(text)
    if not m:
        return []
    base = re.sub(r'\s+(?:immortal\s+)?gu$', '', term.strip(), flags=re.I).lower()
    items = [re.sub(r'\s*\(.*?\)\s*', ' ', x).strip(' .').lower() for x in re.split(r',|\band\b', m.group(2))]
    items = [re.sub(r'\s+(?:immortal\s+)?gu$', '', x) for x in items]
    return [(rank_of(m.group(1)), 'list')] if base in items else []


def decide(found):
    """One rank when at least two thirds of the bound mentions agree, else a conflict."""
    if not found:
        return None, 'none'
    c = Counter(r for r, _ in found)
    rank, n = c.most_common(1)[0]
    if n * 3 >= 2 * sum(c.values()):
        return rank, 'agree' if len(c) == 1 else 'majority'
    return None, 'conflict'


def universe():
    """Blocked rows (rank-unknown, effect-unknown) and the wiki-ranked cohort, with their search terms."""
    ledger = [json.loads(l) for l in open(os.path.join(ROOT, 'docs/coverage/gu_kinds.jsonl')) if l.strip()]
    idx = json.load(open(f'{ctp.NOV}/reverend-insanity/private/rule-derivation-2026-11-11/gu-identities.json'))['records']
    rec = {r['id']: r for r in idx}
    aka = ctp.alias_names()
    out = {}
    for row in ledger:
        r = rec.get(row['id']) or {}
        name = (r.get('saga') or {}).get('name') or (r.get('fandom') or {}).get('name') or row['id']
        wiki = (r.get('metadata') or {}).get('fandom_category_ranks') or []
        if row['state'] in ('blocked:rank-unknown', 'blocked:effect-unknown'):
            role = row['state'].split(':')[1]
        elif wiki and not row['state'].startswith('not-a-thing'):
            role = 'cohort'
        else:
            continue
        terms = sorted({t for n in [name, *aka.get(row['id'], ())] for t in ctp.gu_terms(n)}, key=len, reverse=True)
        out[row['id']] = {'name': name, 'role': role, 'wikiRank': min(wiki) if wiki else None, 'terms': terms}
    return out


def run():
    u = universe()
    ri = ctp.load_ri()
    low = [(ch, k, ctp.norm(t), ctp.norm(t).lower()) for ch, k, t in ri]
    rows = {}
    for i, v in u.items():
        tl = [t.lower() for t in v['terms']]
        found, at, types = [], [], Counter()
        for ch, k, t, lw in low:
            bases = [re.sub(r'\s+(?:immortal\s+)?gu$', '', tlow) for tlow in tl]
            hit = [term for term, tlow in zip(v['terms'], tl) if tlow in lw]
            if not hit and LIST.match(t):
                hit = [term for term, b in zip(v['terms'], bases) if len(b) > 3 and b in lw]
            if not hit:
                continue
            # Longest term only, so "Ice Blade Gu" is not also counted as "Blade Gu".
            for x in ranks_in(t, hit[0]) + list_ranks(t, hit[0]):
                r, kind, typ = x[0], x[1], (x[2] if len(x) > 2 else None)
                found.append((r, kind))
                if typ:
                    types[typ] += 1
                at.append({'locator': f'ri:ch{ch}:p{k}', 'rank': r, 'pattern': kind, 'type': typ, 'text': t[:400]})
        rank, basis = decide(found)
        rows[i] = {**{k: v[k] for k in ('name', 'role', 'wikiRank')}, 'rank': rank, 'basis': basis,
                   'mentions': len(found), 'types': dict(types.most_common(3)), 'at': at[:6]}
    cohort = [r for r in rows.values() if r['role'] == 'cohort']
    proposed = [r for r in cohort if r['rank'] is not None]
    score = {'cohortRows': len(cohort), 'cohortProposed': len(proposed),
             'exact': sum(r['rank'] == r['wikiRank'] for r in proposed),
             'within1': sum(abs(r['rank'] - r['wikiRank']) <= 1 for r in proposed),
             'conflicts': sum(r['basis'] == 'conflict' for r in cohort)}
    blocked = {}
    for role in ('rank-unknown', 'effect-unknown'):
        rs = [r for r in rows.values() if r['role'] == role]
        blocked[role] = {'rows': len(rs), 'proposed': sum(r['rank'] is not None for r in rs),
                         'conflicts': sum(r['basis'] == 'conflict' for r in rs), 'withTypeWord': sum(bool(r['types']) for r in rs)}
    meta = {'pass': 'docs/audits/GU_UNKNOWN_BLOCKERS_SAMPLE_2026-11-24.md#what-follows', 'tier': 'chapter full text, deterministic, unchecked',
            'cohortScore': score, 'blocked': blocked}
    os.makedirs(ctp.PRIV, exist_ok=True)
    path = ctp.PRIV + 'fulltext_gu_ranks.json'
    json.dump({'meta': meta, 'rows': rows}, open(path, 'w'), indent=1, ensure_ascii=False)
    print(json.dumps(meta, indent=1))
    print('wrote', path)


def self_test():
    cases = [
        ('"How can this be? A Rank two Ice Blade Gu, managing to block my Rank three Moonhand blade!"', 'Ice Blade Gu', [2]),
        ('Plunder Gu is only a Rank two, but it is rare.', 'Plunder Gu', [2]),
        ('This was wolf swallow Gu, a rank four storage Gu.', 'wolf swallow Gu', [4]),
        ('Wolf swallow Gu, a rank four storage Gu.', 'wolf swallow Gu', [4]),
        ('He bought rank one dog enslavement Gu, rank two paper crane Gu, and rank one exploding egg Gu.', 'paper crane Gu', [2]),
        ('He wanted to refine self strength Gu to rank six.', 'self strength Gu', []),
        ('A rank three Gu Master used the moonlight Gu.', 'moonlight Gu', []),
        ('Rank two Ice Blade Gu', 'Blade Gu', []),
        ('Remnant life Gu was a rank five expendable Gu.', 'life Gu', []),
        ('Instant success Gu was a rank four rare Gu.', 'success Gu', []),
        ('"Rank seven great thief Gu?" he asked.', 'thief Gu', []),
        ('He possessed rank five earth overlord Gu.', 'overlord Gu', []),
        ("Tie Ba Xiu's tyrant strength Gu was rank four.", 'tyrant strength Gu', [4]),
    ]
    bad = 0
    for text, term, want in cases:
        got = [x[0] for x in ranks_in(text, term)]
        if got != want:
            bad += 1
            print('FAIL', term, want, got, '|', text)
    assert [x[2] for x in ranks_in('Wolf swallow Gu, a rank four storage Gu.', 'wolf swallow Gu')] == ['storage']
    assert [x[2] for x in ranks_in('Instant success Gu, a rank four rare Gu.', 'Instant success Gu')] == [None]
    inv = 'Rank six Immortal Gu: Unravel Mystery, Blood Asset, Self Strength, Spring Autumn Cicada (contains heaven\'s will), Bone Spike.'
    assert list_ranks(inv, 'Blood Asset Immortal Gu') == [(6, 'list')]
    assert list_ranks(inv, 'Spring Autumn Cicada Gu') == [(6, 'list')]
    assert list_ranks(inv, 'Strength Gu') == []
    assert decide([(2, 'x'), (2, 'x'), (3, 'x')]) == (2, 'majority')
    assert decide([(2, 'x'), (3, 'x')]) == (None, 'conflict')
    print('self-test', 'ok' if not bad else f'{bad} failed')
    return bad


if __name__ == '__main__':
    sys.exit(self_test() if '--self-test' in sys.argv else run())
