#!/usr/bin/env python3
"""LAYX88 anchor ledger over more sources. Run: python3 -I build_ledger_sources.py
Flags: --sample N [seed]   print hand-check samples per kind (writes nothing)
       --probe             print Reverend Insanity recall probe and group-fit stats (writes nothing)
Reuses build_ledger.py WITHOUT importing it (its last line runs main() and would rewrite the committed
outputs): the source is read, the trailing main() call is asserted and removed, and the rest is exec'd.
Writes ledger_sources.json, ../ANCHOR_LEDGER_MORE_SOURCES_2026-11-09.md and private per-row files
(rows_classified_<tag>.jsonl) under docs/research/novels/<source>/private/anchor-ledger-2026-11-09/.
Optional precision_sources.json (hand-judged samples) is folded in."""
import glob, json, os, re, sys, random, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
NOV = os.path.join(ROOT, 'docs', 'research', 'novels')

# ---------- reuse the v1 classifier without running its main() ----------
src = open(os.path.join(HERE, 'build_ledger.py'), encoding='utf-8').read().rstrip('\n')
assert src.endswith('\nmain()'), 'build_ledger.py no longer ends with main(); review before reusing'
V1 = {'__file__': os.path.join(HERE, 'build_ledger.py'), '__name__': 'v1_classifier'}
exec(compile(src[:-len('main()')], 'build_ledger.py', 'exec'), V1)
RX, kinds_v1, v1_load, tier = V1['RX'], V1['kinds'], V1['load'], V1['tier']
KINDS, ANCH, SHAPE, RANKNUM = V1['KINDS'], V1['ANCH'], V1['SHAPE'], V1['RANKNUM']
assign, row_text_v1, flat = V1['assign'], V1['row_text'], V1['flat']

# strip_id in v1 only removes hp. and lotm. prefixes; widen it for ri. (copy only; v1 unchanged)
def strip_id(s):
    return re.sub(r'\b(hp|lotm|ri)\.[a-z]+\.', '', s).replace('-', ' ').replace('_', ' ')
V1['strip_id'] = strip_id

# ---------- Reverend Insanity groups (first match wins; head = id + name + worldKind, matched first) ----------
RI_GROUPS = [
 ('R-REFINE', r'\b(refin\w*|fusion|fuse[sd]?|fusing|recipe\w*|gu recipe|formula\w*|alchem\w*|craft\w*|forg\w*|incorporat\w*|brew\w*|concoct\w*|enslav\w*|subdu\w*|tam(?:e|ing|ed)|domesticat\w*|devour\w* the gu)\b'),
 ('R-FEED', r'\b(feed\w*|fed|food|upkeep|starv\w*|hunger\w*|nourish\w*|sustain\w*|fodder|fatten\w*|consum\w* (?:to|as|for)|meals?|diet|ration\w*|maintain\w* (?:the )?gu|gu (?:worms? )?(?:die|dies|died|death)|dying gu)\b'),
 ('R-KILLER', r'\b(killer moves?|immortal killer|killer-move|deduc\w* a killer|composit\w* (?:of )?(?:a )?killer)\b'),
 ('R-APERT', r'\b(aperture\w*|primeval essence|true essence|essence|sea of|green copper|bronze|iron|silver|gold(?:en)? essence|awaken\w*|talent|grade (?:a|b|c|d)\b|qualification|spirit spring|spring water|capacity|reserve|exhaust\w*|replenish\w*|regenerat\w*|recover\w* essence|ascend\w* (?:the )?aperture|first[- ]rank|first stage)\b'),
 ('R-RANK', r'\b(rank (?:one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9)|breakthrough\w*|rank[- ]?up|advanc\w*|cultivation (?:level|realm|stage|rank|base)|realm|peak stage|initial stage|middle stage|upper stage|bottleneck|promot\w*|ascen\w*|stage of|level up|tribulation|tribulations|upgrad\w*|mortal ?(?:ascen|rank)|cultivation rank|rank is|rank of|ranks)\b'),
 ('R-TRADE', r'\b(caravan\w*|merchant\w*|shops?|stores?|stalls?|marketplace|trad(?:e|es|ed|ing)|barter\w*|escort\w*|transport\w*|haul\w*|goods|wares|cargo|route\w*|journey\w*|travel\w*|pavilion|auction\w*|broker\w*|peddl\w*|buy\w*|bought|sell\w*|sold|sale|vendor\w*)\b'),
 ('R-ECON', r'\b(primeval stones?|stones?|price\w*|priced|cost\w*|fees?|wages?|salary|income|profit\w*|debts?|loans?|payment\w*|pays?|paid|pay|reward\w*|allowance|stipend|tax\w*|resources?|funds?|quota\w*|share\w* of|contribution\w*|exchange|afford\w*|cheap\w*|expensive|worth|valu(?:e|ed|able)|wealth\w*|rich|poor|currency|cash)\b'),
 ('R-INHER', r'\b(inherit\w*|legacy|legacies|ancestors?|ancestral|grounds?|ruins?|caves?|cavern\w*|treasur\w*|reli(?:c|cs)|secret (?:room|cave|hall)|buri(?:al|ed)|tomb\w*|fortuit\w*|opportunit\w*|grotto|blessed land|trial|trials|test of|passage|collapse\w*|sealed)\b'),
 ('R-BLOOD', r'\b(blood\w*|kinship|lineage|descend\w*|parents?|mothers?|fathers?|siblings?|brothers?|sisters?|cousins?|uncle|aunt|grand\w+|marriage|marri\w*|wife|husband|heirs?|offspring|relatives?|family|families|branch|bloodline|illegitimate|concubine|maternal|paternal|filial|kin)\b'),
 ('R-CLAN', r'\b(clans?|elders?|patriarch\w*|councils?|academy|schools?|halls?|institutions?|duty|duties|missions?|tasks?|rules?|laws?|punish\w*|exams?|examination|assessment\w*|hierarch\w*|authority|factions?|votes?|voting|hearing\w*|decision\w*|polic(?:y|ies)|students?|teachers?|instructor\w*|dorm\w*|tournament\w*|ranking\w*|ceremon\w*|rite\w*|selection|selected|appoint\w*|position\w*|sect\w*|alliance\w*|organi[sz]ation\w*|village|villages|stockade|compound|guard\w*|patrol\w*|order|orders|command\w*|duel\w*|jurisdiction|permission|forbid\w*|prohibit\w*|allowed)\b'),
 ('R-COMBAT', r'\b(attack\w*|combat|fight\w*|battle\w*|fought|kill\w*|slay\w*|defen[cs]\w*|strike\w*|damage\w*|wound\w*|injur\w*|armou?r|shield\w*|blade\w*|moonblade|weapons?|poison\w*|ambush\w*|assassin\w*|trap\w*|escape\w*|flee\w*|retreat\w*|pursu\w*|chase\w*|war\b|wars\b|siege|raid\w*|army|armies|troops?|soldier\w*|beasts?|wolf|wolves|monster\w*|hunt\w*|predator\w*|prey|swarm\w*|bite\w*|sting\w*|destroy\w*|crush\w*|explo\w*|burn\w*|freez\w*|frost|ice|fire|flame\w*|thunder\w*|lightning|storm\w*|wind|water|flood\w*|earthquake\w*)\b'),
 ('R-IMMORT', r'\b(immortal\w*|dao marks?|dao\b|heaven\w*|earth will|heavenly|will of|divine|fate|destiny|luck|fortune|immortal aperture|gu immortal|mortal\w*|demon\w*|devil\w*|righteous|sect master|supreme|ancient|sacred|holy|legend\w*|myth\w*|spirit\w*|soul\w*|reincarnat\w*|rebirth|reborn|previous life|memory|memories|regret\w*|scheme\w*|deceiv\w*|decepti\w*|lie|lies|lied|secret\w*|conceal\w*|hidden|disguis\w*|trick\w*|plot\w*|manipulat\w*|trust\w*|betray\w*|ally|allies|enem\w*)\b'),
 ('R-GUUSE', r'\b(gu worms?|gu insects?|gu masters?|gu\b|gus\b|activat\w*|use[sd]?|using|usage|employ\w*|trigger\w*|launch\w*|swallow\w*|stor\w*|carry|carries|carried|equip\w*|bind\w*|bond\w*|release\w*|deploy\w*|summon\w*|control\w*|command\w*|collect\w*|catch\w*|captur\w*|obtain\w*|acquir\w*|steal\w*|stole\w*|rob\w*|loot\w*|swap\w*|replace\w*|transfer\w*|identif\w*|observ\w*|detect\w*|sens(?:e|es|ed|ing)|recogni[sz]\w*|learn\w*|studi\w*|study|train\w*|practi[cs]\w*|skill\w*|knowledge|know\w*)\b'),
 ('R-TIME', r'\b(season\w*|spring|summer|autumn|winter|years?|months?|days?|hours?|time|night|dawn|dusk|noon|morning|evening|calendar|period|cycle\w*|date|age|aged|old|young|decade\w*|century|centuries|moon|sun|daily|weekly|monthly|yearly|annual\w*|duration|schedule|deadline|before|after|then|until|while)\b'),
]
RI_ORDER = [g for g, _ in RI_GROUPS] + ['R-MISC']
RI_EXTRA_RX = {  # applied on top of the v1 classifier for RI only; counted separately as added rows
 'point': re.compile(r'\d+(?:\.\d+)?\s?%|\b' + V1['NUMW'] + r'\s+(?:primeval stones?|stones?|jin|li|zhang|chi|cun|qi|rank|ranks|grades?|aperture|apertures|gu|gus|worms?|insects?|swarms?|clan members?|elders?|years?|months?|days?|hours?|breaths?|moons?|seasons?|branches|families|clans)\b', re.I),
}

# ---------- row builders ----------
def make_row(r, handle, extra_head=''):
    structured = 'steps' in r
    struct = {}
    if structured:
        struct['nsteps'] = len(r.get('steps') or [])
        struct['qty'] = any(isinstance(x.get('qty'), (int, float)) and x.get('qty') not in (0, 1)
                            for x in (r.get('inputs') or []) + (r.get('products') or []) if isinstance(x, dict))
        struct['costs'] = bool(r.get('costs'))
        struct['fail'] = any(str(x.get('when', '')).lower().startswith('fail') for x in (r.get('results') or []) if isinstance(x, dict))
    head = strip_id(r.get('id', '') + ' ; ' + r.get('name', '')) if structured else ''
    if structured and extra_head:
        head += ' ; ' + extra_head
    return {'handle': handle, 'text': row_text_v1(r), 'head': head, 'struct': struct}

def load_plain(files, with_world=False):
    rows = []
    for f in files:
        stem = os.path.basename(f).replace('.jsonl', '')
        for i, l in enumerate(open(f, encoding='utf-8'), 1):
            l = l.strip()
            if l:
                r = json.loads(l)
                rows.append(make_row(r, '%s:%d' % (stem, i), r.get('worldKind', '') if with_world else ''))
    return rows

RIDIR = os.path.join(NOV, 'reverend-insanity', 'private', 'lead-run-2026-10-29')
def ri_qualified():
    """Rules and rules_other rows of volumes 5-7 that passed the source review (supported or corrected)."""
    rev = os.path.join(RIDIR, 'ri-5-7-review')
    rows, held, per_vol = [], set(), collections.Counter()
    acc_keys, hold_keys = set(), set()
    for d in ('audit-5-rules', 'audit-6-extras', 'audit-7-extras'):
        for fn, tgt in (('accepted', acc_keys), ('held', hold_keys)):
            for l in open(os.path.join(rev, d, fn + '.jsonl'), encoding='utf-8'):
                if not l.strip():
                    continue
                r = json.loads(l)
                b = os.path.basename(r['file'])
                if not re.match(r'ri[567]c\d+_rules(_other)?\.jsonl$', b):
                    continue
                key = (b, r['line'])
                assert key not in tgt, 'duplicate review entry %s' % (key,)
                tgt.add(key)
                if fn == 'accepted':
                    rows.append((key, r))
    assert not (acc_keys & hold_keys), 'accepted and held overlap'
    return rows, acc_keys, hold_keys

def ri_files(vols, base_dirs):
    out = []
    for d in base_dirs:
        for v in vols:
            out += glob.glob(os.path.join(d, 'ri%dc[0-9]*_rules.jsonl' % v)) + glob.glob(os.path.join(d, 'ri%dc[0-9]*_rules_other.jsonl' % v))
    return sorted(set(f for f in out if re.match(r'ri\dc\d+_rules(_other)?\.jsonl$', os.path.basename(f))))

def build_sources():
    S = {}
    LD = os.path.join(NOV, 'lord-of-mysteries', 'private', 'lead-run-2026-10-27')
    HD = os.path.join(NOV, 'harry-potter', 'private', 'lead-run-2026-10-28')
    XD = os.path.join(NOV, 'lord-of-mysteries', 'private', 'lead-run-extras-2026-10-30')
    pat = lambda d, a: sorted(f for f in glob.glob(os.path.join(d, a)) if re.match(r'.*/[a-z]+\d*c\d+L?_rules(_other)?\.jsonl$', f))
    lf = [f for v in range(2, 9) for f in pat(LD, 'lotm%dc[0-9]*_rules*.jsonl' % v)]
    S['L'] = dict(title='Lord of the Mysteries, volumes 2 to 8', world='lord-of-mysteries', tag='lotm-v2-8', files=lf,
                  rows=v1_load(lf), groups=V1['A_GROUPS'], order=V1['A_ORDER'], misc='L-MISC', skip_groups=['L-SIG', 'L-RARE'],
                  review='unreviewed (reader rows, not source-reviewed; the 10-29 overlays are id aliases and spot checks, not qualification)',
                  extra_rx=None, note='Same L- groups as the volume 1 ledger (fitted to volume 1).')
    xf = pat(XD, 'lotmxc*L_rules*.jsonl')
    S['X'] = dict(title='Lord of the Mysteries, extras (book 9 mapped files)', world='lord-of-mysteries', tag='lotm-extras', files=xf,
                  rows=v1_load(xf), groups=V1['A_GROUPS'], order=V1['A_ORDER'], misc='L-MISC', skip_groups=['L-SIG', 'L-RARE'],
                  review='unreviewed', extra_rx=None, note='Small row set; classes are noisy.')
    hf = [f for v in range(2, 8) for f in pat(HD, 'hp%dc[0-9]*_rules*.jsonl' % v)]
    S['H'] = dict(title='Harry Potter, books 2 to 7', world='harry-potter', tag='hp-b2-7', files=hf,
                  rows=v1_load(hf), groups=V1['B_GROUPS'], order=V1['B_ORDER'], misc='H-MISC', skip_groups=[],
                  review='unreviewed', extra_rx=None, note='Same H- groups as the book one ledger (fitted to book one).')
    qrows, acc, held = ri_qualified()
    rrows = [make_row(r['row'], '%s:%d' % (key[0].replace('.jsonl', ''), key[1]), r['row'].get('worldKind', '') if 'steps' in r['row'] else '') for key, r in qrows]
    # reconcile with files on disk
    disk = {}
    for v in (5, 6, 7):
        fs = ri_files([v], [RIDIR, os.path.join(RIDIR, 'claude-6-7')])
        disk[v] = sum(1 for f in fs for l in open(f, encoding='utf-8') if l.strip())
    byv = {v: (sum(1 for k in acc if k[0].startswith('ri%dc' % v)), sum(1 for k in held if k[0].startswith('ri%dc' % v))) for v in (5, 6, 7)}
    for v in (5, 6, 7):
        assert byv[v][0] + byv[v][1] == disk[v], 'review does not reconcile with files for volume %d: %s vs %d' % (v, byv[v], disk[v])
    S['R'] = dict(title='Reverend Insanity, volumes 5 to 7 (source-review qualified rows only)', world='reverend-insanity', tag='ri-v5-7-qualified',
                  files=ri_files([5, 6, 7], [RIDIR, os.path.join(RIDIR, 'claude-6-7')]), rows=rrows, groups=RI_GROUPS, order=RI_ORDER, misc='R-MISC', skip_groups=[],
                  review='qualified by source review (accepted = supported or corrected; corrected rows use the corrected text)',
                  extra_rx=RI_EXTRA_RX, held={v: byv[v][1] for v in byv}, accepted={v: byv[v][0] for v in byv}, disk=disk,
                  note='New R- groups written for this world; point regex extended (see report).')
    f14 = ri_files([1, 2, 3, 4], [RIDIR])
    S['R14'] = dict(title='Reverend Insanity, volumes 1 to 4 (unreviewed rules rows)', world='reverend-insanity', tag='ri-v1-4-unreviewed', files=f14,
                    rows=load_plain(f14, True), groups=RI_GROUPS, order=RI_ORDER, misc='R-MISC', skip_groups=[],
                    review='unreviewed (no rules rows from the volume 1 to 3 gap closeouts exist; those gaps were census, scenes, people and texture)',
                    extra_rx=RI_EXTRA_RX, note='Same R- groups.')
    return S

def kinds_for(row, extra):
    ks = set(kinds_v1(row))
    added = set()
    if extra:
        t = RANKNUM.sub('RANK', row['text'])
        for k, rx in extra.items():
            if k not in ks and rx.search(t):
                ks.add(k); added.add(k)
    return ks, added

def classify(S):
    for key, s in S.items():
        stats = {g: collections.Counter() for g in s['order']}
        members = collections.defaultdict(list)
        s['added'] = collections.Counter()
        for r in s['rows']:
            g = assign(r['text'], s['groups'], s['misc'], r['head'])
            ks, added = kinds_for(r, s['extra_rx'])
            for k in added:
                s['added'][k] += 1
            r['group'], r['kinds'], r['added'] = g, sorted(ks), sorted(added)
            st = stats[g]
            st['total'] += 1
            if not ks:
                st['qualitative'] += 1
            for k in ks:
                st[k] += 1
            members[g].append(r)
        s['stats'], s['members'] = stats, members

def rate_value(prec, key, k):
    p = (prec.get('rates') or {}).get(key, {})
    return p.get(k, 1.0)

def system_view(S, prec):
    rng = random.Random(88)
    for key, s in S.items():
        sysd = {}
        for g in s['order']:
            st = s['stats'][g]
            skip = g in s['skip_groups']
            pool = [r for r in s['members'][g] if set(r['kinds']) & set(ANCH)] or s['members'][g]
            pick = rng.sample(pool, min(5, len(pool))) if pool else []
            adj = {k: st[k] * rate_value(prec, key, k) for k in KINDS}
            anchors = st['point'] + st['band'] + st['count_or_duration']
            sysd[g] = {
                'counts': {k: st[k] for k in KINDS + ['qualitative', 'total']},
                'anchors': anchors,
                'anchors_per_100_rows': round(100.0 * anchors / st['total'], 1) if st['total'] else None,
                'tier': ('not re-derived' if skip else (tier(st) if st['total'] else 'not found')),
                'adjusted_tier': '' if skip or not st['total'] else tier(adj),
                'examples': [p['handle'] for p in pick],
            }
        s['sysd'] = sysd

def fit_stats(s):
    n = len(s['rows'])
    misc = s['stats'][s['misc']]['total']
    real = [(g, s['stats'][g]['total']) for g in s['order'] if g != s['misc']]
    big = max(real, key=lambda x: x[1])
    return {'misc_share': round(misc / n, 3) if n else None, 'largest_group': big[0], 'largest_share': round(big[1] / n, 3) if n else None}

# ---------- sample / probe ----------
def ctx(row, k):
    t = RANKNUM.sub('RANK', row['text'])
    m = RX[k].search(t)
    if not m:
        for kk, rx in RI_EXTRA_RX.items():
            if kk == k and rx.search(t):
                m = rx.search(t)
    s = row['struct']
    return (t[max(0, m.start() - 70):m.end() + 50] if m else '(structural: %s)' % s).replace('\n', ' ')

def do_sample(S, n, seed):
    rng = random.Random(seed)
    for key, s in S.items():
        for k in ['point', 'order', 'tolerance', 'negative']:
            pool = [r for r in s['rows'] if k in r['kinds']]
            print('=== %s %s (%d rows)' % (key, k, len(pool)))
            for i, r in enumerate(rng.sample(pool, min(n, len(pool))), 1):
                print('%d. [%s] ...%s...' % (i, r['group'], ctx(r, k)))

def do_probe(S):
    rx = re.compile(r'\d+\s?%|primeval stones?|\bjin\b|\bli\b|\bzhang\b', re.I)
    for key in ('R', 'R14'):
        s = S[key]
        miss = [r for r in s['rows'] if rx.search(r['text']) and not (set(r['kinds']) & {'point', 'band'})]
        print(key, 'rows', len(s['rows']), 'probe-pattern rows without point/band after extension:', len(miss), 'added by extension:', dict(s['added']))
        for r in miss[:8]:
            m = rx.search(r['text']); print('   ', r['handle'], '...' + r['text'][max(0, m.start() - 50):m.end() + 40] + '...')
        fs = fit_stats(s); print('   fit', fs)
        print('   groups', {g: s['stats'][g]['total'] for g in s['order']})
    for key in ('L', 'X', 'H'):
        print(key, len(S[key]['rows']), fit_stats(S[key]))

# ---------- outputs ----------
def main():
    S = build_sources()
    classify(S)
    if '--probe' in sys.argv:
        do_probe(S); return
    if '--sample' in sys.argv:
        i = sys.argv.index('--sample'); n = int(sys.argv[i + 1]); seed = int(sys.argv[i + 2]) if len(sys.argv) > i + 2 and sys.argv[i + 2].isdigit() else 7
        do_sample(S, n, seed); return
    pp = os.path.join(HERE, 'precision_sources.json')
    prec = json.load(open(pp)) if os.path.exists(pp) else {}
    system_view(S, prec)
    ledger = {'code': 'LAYX88', 'date': '2026-11-09', 'sources': {},
              'tier_rule': 'tunable: point+band+count_or_duration >= 3; shape only: else order+sequence+tolerance+negative >= 3; assumed: otherwise (same as the volume 1 ledger)',
              'precision': prec.get('precision', {}), 'rates': prec.get('rates', {})}
    for key, s in S.items():
        ent = {'title': s['title'], 'review': s['review'], 'files': len(s['files']), 'rows': len(s['rows']), 'fit': fit_stats(s),
               'point_regex_extension_rows_added': dict(s['added']), 'systems': s['sysd']}
        if key == 'R':
            ent['review_counts'] = {'accepted': s['accepted'], 'held': s['held'], 'rows_on_disk': s['disk']}
        if key == 'L':
            ent['rows_by_volume'] = {v: sum(1 for r in s['rows'] if r['handle'].startswith('lotm%dc' % v)) for v in range(2, 9)}
        if key == 'H':
            ent['rows_by_book'] = {v: sum(1 for r in s['rows'] if r['handle'].startswith('hp%dc' % v)) for v in range(2, 8)}
        if key == 'R14':
            ent['rows_by_volume'] = {v: sum(1 for r in s['rows'] if r['handle'].startswith('ri%dc' % v)) for v in range(1, 5)}
        if key == 'R':
            ent['rows_by_volume'] = {v: sum(1 for r in s['rows'] if r['handle'].startswith('ri%dc' % v)) for v in range(5, 8)}
        ledger['sources'][key] = ent
        pdir = os.path.join(NOV, s['world'], 'private', 'anchor-ledger-2026-11-09')
        os.makedirs(pdir, exist_ok=True)
        with open(os.path.join(pdir, 'rows_classified_%s.jsonl' % s['tag']), 'w', encoding='utf-8') as f:
            for r in s['rows']:
                f.write(json.dumps({'handle': r['handle'], 'group': r['group'], 'kinds': r['kinds'], 'text': r['text']}, ensure_ascii=False) + '\n')
    json.dump(ledger, open(os.path.join(HERE, 'ledger_sources.json'), 'w'), indent=1)
    write_md(S, ledger, prec)
    for key, e in ledger['sources'].items():
        t = collections.Counter(v['tier'] for v in e['systems'].values())
        print(key, e['rows'], 'rows', e['files'], 'files', dict(t), e['fit'])

def table(sysd):
    lines = ['| System | point | band | order | count/duration | sequence | tolerance | negative | qualitative | total | anchors | anchors per 100 rows | Class |', '|' + '---|' * 13]
    for g, v in sysd.items():
        c = v['counts']
        if v['tier'] == 'not re-derived':
            lines.append('| %s | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | not re-derived |' % g)
            continue
        lines.append('| %s | %d | %d | %d | %d | %d | %d | %d | %d | %d | %d | %s | %s |' % (
            g, c['point'], c['band'], c['order'], c['count_or_duration'], c['sequence'], c['tolerance'], c['negative'], c['qualitative'], c['total'],
            v['anchors'], v['anchors_per_100_rows'] if v['anchors_per_100_rows'] is not None else '', v['tier']))
    return '\n'.join(lines)

def write_md(S, L, prec):
    out = []
    out.append('# Anchor ledger over more sources, 2026-11-09 (LAYX88)\n')
    out.append('Extends the [volume 1 and book one ledger](ANCHOR_LEDGER_VOL1_BOOK1_2026-11-09.md) to sources already read but not in it. Labels: counted = script output; sampled = my hand check of rows; inferred = reasoning from those.\n')
    out.append('## 1. What was run\n')
    out.append('Script: `anchor-ledger-2026-11-09/build_ledger_sources.py` (rerun: `python3 -I docs/audits/anchor-ledger-2026-11-09/build_ledger_sources.py`). It reuses the volume 1 kind classifier and class rule unchanged by reading `build_ledger.py` without running its main. Rows are the rules and rule-note passes only (counted). Per-row text is in the private gitignored folders; this file holds counts, groups, kinds and handles (`file:line`).\n')
    out.append('| Source | Files | Rows | Review state |')
    out.append('|---|---|---|---|')
    for key, e in L['sources'].items():
        out.append('| %s | %d | %d | %s |' % (e['title'], e['files'], e['rows'], S[key]['review']))
    out.append('')
    R = L['sources']['R']
    out.append('Reverend Insanity volumes 5 to 7 (counted): the review overlays `audit-5-rules`, `audit-6-extras` and `audit-7-extras` accept %d rows and hold %d across volumes 5, 6, 7 (accepted %s, held %s). Accepted plus held equals the rules and rule-note rows on disk per volume (%s), asserted in the script. Only accepted rows are used. A corrected row is used in its corrected form. Held rows are dropped.\n' % (
        sum(R['review_counts']['accepted'].values()), sum(R['review_counts']['held'].values()), R['review_counts']['accepted'], R['review_counts']['held'], R['review_counts']['rows_on_disk']))
    out.append('Rows by volume (counted): LOTM %s; HP %s; RI 5 to 7 qualified %s; RI 1 to 4 unreviewed %s.\n' % (L['sources']['L']['rows_by_volume'], L['sources']['H']['rows_by_book'], R['rows_by_volume'], L['sources']['R14']['rows_by_volume']))
    for key in ('L', 'X', 'H', 'R', 'R14'):
        e = L['sources'][key]
        title = e['title']
        out.append('## 2. %s\n' % title)
        out.append('Review state: %s. %s\n' % (S[key]['review'], S[key]['note']))
        out.append(table(e['systems']) + '\n')
        t = collections.Counter(v['tier'] for v in e['systems'].values())
        out.append('Headline (counted): %d tunable, %d shape only, %d assumed, %d not found or not re-derived. Residue group %s holds %.0f%% of rows; the largest real group is %s at %.0f%% (counted fit check).\n' % (
            t['tunable'], t['shape only'], t['assumed'], t['not found'] + t['not re-derived'], S[key]['misc'], 100 * e['fit']['misc_share'], e['fit']['largest_group'], 100 * e['fit']['largest_share']))
        if e['point_regex_extension_rows_added']:
            out.append('Point-regex extension for this source (counted): added %s rows beyond the volume 1 classifier.\n' % e['point_regex_extension_rows_added'])
        flips = [g + ' (' + v['tier'] + ' to ' + v['adjusted_tier'] + ')' for g, v in e['systems'].items() if v['adjusted_tier'] and v['adjusted_tier'] != v['tier']]
        out.append('Class after weighting point, order, tolerance and negative by this source\'s sampled hit rates (other kinds at 1.0): ' + ('changes for ' + ', '.join(flips) if flips else 'no change') + '.\n')
        out.append('Example handles (counted; drawn from rows with a point, band or count where any exist):\n')
        for g, v in e['systems'].items():
            if v['examples']:
                out.append('- %s: %s' % (g, ', '.join(v['examples'])))
        out.append('')
    out.append('## 3. Where the anchors are, per source (counted)\n')
    for key in ('L', 'X', 'H', 'R', 'R14'):
        e = L['sources'][key]
        real = [(g, v) for g, v in e['systems'].items() if v['tier'] != 'not re-derived' and not g.endswith('-MISC') and v['counts']['total']]
        top = sorted(real, key=lambda x: -x[1]['anchors'])[:4]
        none_ = [g for g, v in real if v['anchors'] == 0]
        dens = sorted([(g, v) for g, v in real if v['counts']['total'] >= 20], key=lambda x: -x[1]['anchors_per_100_rows'])[:3]
        out.append('- %s: most point, band and count anchors: %s. Densest (20 or more rows): %s. No anchors: %s.' % (
            e['title'], '; '.join('%s %d of %d rows' % (g, v['anchors'], v['counts']['total']) for g, v in top),
            '; '.join('%s %.0f per 100' % (g, v['anchors_per_100_rows']) for g, v in dens), ', '.join(none_) if none_ else 'none'))
    out.append('')
    out.append('## 4. Sampled precision (sampled)\n')
    pr = prec.get('precision')
    if pr:
        out.append('Hits over sample, read by hand. Seed and sample size are in `precision_sources.json`. Kinds not listed were not sampled.\n')
        out.append('| Kind | LOTM v2-8 | LOTM extras | HP 2-7 | RI 5-7 qualified | RI 1-4 unreviewed |')
        out.append('|---|---|---|---|---|---|')
        for k in ['point', 'order', 'tolerance', 'negative']:
            p = pr.get(k, {})
            out.append('| %s | %s | %s | %s | %s | %s |' % (k, p.get('L', ''), p.get('X', ''), p.get('H', ''), p.get('R', ''), p.get('R14', '')))
        out.append('')
        for k, v in (prec.get('notes') or {}).items():
            out.append('- %s: %s' % (k, v))
        out.append('')
    else:
        out.append('Not yet sampled.\n')
    out.append('## 5. Missing or not found\n')
    for line in prec.get('missing', []):
        out.append('- ' + line)
    out.append('')
    out.append('## 6. Findings\n')
    for line in prec.get('findings', []):
        out.append('- ' + line)
    out.append('')
    out.append('## 7. Limits\n')
    for line in prec.get('limits', []):
        out.append('- ' + line)
    out.append('')
    open(os.path.join(HERE, '..', 'ANCHOR_LEDGER_MORE_SOURCES_2026-11-09.md'), 'w').write('\n'.join(out) + '\n')

main()
