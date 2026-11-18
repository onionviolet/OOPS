#!/usr/bin/env python3
"""Fold the extreme-ability reader replies into coverage ledgers (jojo-readers lane, 2026-11-18). Deterministic: no model call.

  python3 -I scripts/extreme_reader_fold.py

Reads the private Luna (structured) and Haiku (recall) replies written by scripts/extreme_reader_pass.mjs and writes
  docs/coverage/toaru_powers.jsonl    A Certain Magical Index (22 volumes, New Testament 1-5, 7, 8, 10, 11) and Railgun (novel, SS1-SS3)
  docs/coverage/wus_powers.jsonl      Wish Upon the Stars 1-8
  docs/coverage/ward_powers.jsonl     Ward
  docs/coverage/mol_mechanisms.json   Mother of Learning: mechanism fields keyed by the existing mother_of_learning_powers row they match by name (that ledger is
                                      generated elsewhere and is left untouched)
  <private>/jojo_novel_rows.jsonl     JoJo light-novel abilities, appended to jojo_powers.jsonl by scripts/jojo_power_ledger.py --novels
Rows merge by (work, normalised name): the reading with the longest mechanism text wins and every chunk locator that named it is kept. A Haiku-only
name that two or more chunks gave becomes a name-only catalogued row. Every row is model tier, unchecked.
"""
import json, pathlib, re, collections, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PRIV = pathlib.Path('/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/jojo-collection-2026-11-18/readers/private/')
CANON = set(json.load(open(ROOT / 'docs/coverage/blocked_slugs.json'))['canonical'])
KIND_SLUG = {'stand': None, 'hamon': None, 'spin': None, 'power-interaction': 'power-interaction', 'power-transfer': 'power-transfer', 'time-loop': 'time-loop',
             'wish': 'wish-grant', 'vow': 'vow-cost', 'conceptual': 'concept-law', 'rule-imposing': 'concept-law', 'absorb-or-copy': 'power-transfer',
             'cheat-or-override': 'power-interaction', 'other': None}
REASON = {'wish-grant': 'no canonical slug names a wish a system or being grants; see docs/research/EXTREME_ABILITIES_JOJO_AND_READERS_2026-11-18.md',
          'power-interaction': None}
WORKS = {'toaru': ('toaru_powers', 'A Certain Magical Index and Railgun', 'toaru'), 'railgun': ('toaru_powers', 'A Certain Magical Index and Railgun', 'toaru'),
         'wus': ('wus_powers', 'Wish Upon the Stars', 'wus'), 'ward': ('ward_powers', 'Ward', 'ward'), 'mol': (None, 'Mother of Learning', 'mol'), 'jojo': (None, 'JoJo light novels', 'jojo')}


def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', re.sub(r"[’']s\b", '', s.lower())).strip()


def slug(s):
    return re.sub(r'[^a-z0-9]+', '_', norm(s)).strip('_')[:60]


def load(group, model):
    f = PRIV / f'ext_{group}_{model}.json'
    return json.load(open(f)) if f.exists() else {}


def main():
    out = collections.defaultdict(list)
    stats = {}
    for group, (ledger, label, prefix) in WORKS.items():
        luna, haiku = load(group, 'luna'), load(group, 'haiku')
        best = {}
        seen_luna = set()
        for cid, v in luna.items():
            for a in (v.get('reply') or {}).get('abilities', []):
                k = norm(a['name'])
                if not k or not a['mechanism'].strip(): continue
                seen_luna.add(k)
                e = best.setdefault(k, {'a': a, 'locs': [], 'chunks': set()})
                e['chunks'].add(cid)
                if a['locator'] not in e['locs']: e['locs'].append(a['locator'])
                if len(a['mechanism']) > len(e['a']['mechanism']): e['a'] = a
        hn = collections.defaultdict(lambda: {'chunks': set(), 'kind': 'other', 'name': '', 'loc': ''})
        for cid, v in haiku.items():
            for n in (v.get('reply') or {}).get('names', []):
                k = norm(n['name'])
                if not k: continue
                h = hn[k]; h['chunks'].add(cid); h['kind'] = n['kind']; h['name'] = h['name'] or n['name']; h['loc'] = h['loc'] or n['locator']
        only = {k: h for k, h in hn.items() if k not in seen_luna and len(h['chunks']) >= 2}
        stats[group] = {'chunks_luna': len(luna), 'chunks_haiku': len(haiku), 'luna_names': len(best), 'haiku_names': len(hn), 'haiku_only_2plus': len(only),
                        'haiku_in_luna': sum(1 for k in hn if k in seen_luna), 'abilities_by_kind': dict(collections.Counter(e['a']['kind'] for e in best.values()))}
        rows = []
        for k, e in sorted(best.items()):
            a = e['a']; sl = KIND_SLUG.get(a['kind']); rid = f'{prefix}.power.{slug(a["name"])}'
            if any(r['id'] == rid for r in rows): rid += f'_{slug(a["holder"])[:12]}'
            parts = [f'{a["name"]} ({a["holder"] or "holder unstated"}). Kind {a["kind"]}; {a["mechanism"].strip()}']
            for key, lab in (('trigger_or_condition', 'trigger'), ('cost_or_limit', 'limit'), ('interaction_with_other_powers', 'interacts')):
                if a[key].strip(): parts.append(f'{lab}: {a[key].strip()}')
            parts.append(f'shown by {a["reveal"]} [{a["speaker"]} {e["locs"][0]}], named in {len(e["chunks"])} chunk(s) (Luna, unchecked).')
            row = {'id': rid, 'source': f'{label} batch read 2026-11-18; chunk locators {", ".join(e["locs"][:3])}', 'state': f'blocked:{sl}' if sl else 'catalogued', 'mechanisms': ['P'], 'test': None,
                   'note': ' '.join(parts) + (f' Missing: {sl}.' if sl else '')}
            if sl and sl not in CANON: row['reason'] = REASON.get(sl) or f'{sl} is a reader-named capability outside the canonical map'
            rows.append(row)
        for k, h in sorted(only.items()):
            rid = f'{prefix}.power.{slug(h["name"])}'
            if any(r['id'] == rid for r in rows): continue
            rows.append({'id': rid, 'source': f'{label} batch read 2026-11-18 (Haiku recall, named in {len(h["chunks"])} chunks); locator {h["loc"]}', 'state': 'catalogued', 'mechanisms': ['P'], 'test': None,
                         'note': f'{h["name"]}. Kind {h["kind"]}; name only, no mechanism read (Haiku recall, unchecked).'})
        out[group] = rows
    # Group into files.
    for fname, groups in (('toaru_powers', ['toaru', 'railgun']), ('wus_powers', ['wus']), ('ward_powers', ['ward'])):
        rows = [r for g in groups for r in out[g]]
        ids = set(); uniq = []
        for r in rows:
            if r['id'] in ids: continue
            ids.add(r['id']); uniq.append(r)
        (ROOT / f'docs/coverage/{fname}.jsonl').write_text(''.join(json.dumps(r, ensure_ascii=False) + '\n' for r in uniq))
        print(fname, len(uniq))
    (PRIV / 'jojo_novel_rows.jsonl').write_text(''.join(json.dumps(r, ensure_ascii=False) + '\n' for r in out['jojo']))
    # Mother of Learning: overlay on the existing ledger's rows by name.
    mol_rows = [json.loads(l) for l in open(ROOT / 'docs/coverage/mother_of_learning_powers.jsonl')]
    names = {}
    for r in mol_rows:
        m = re.match(r'([^.]+)\.', r['note'])
        if m: names[norm(m.group(1))] = r
    overlay, unmatched = {}, []
    for r in out['mol']:
        nm = norm(re.match(r'([^(]+)', r['note']).group(1))
        hit = names.get(nm)
        if hit: overlay[hit['id']] = {'state_was': hit['state'], 'kind_slug': r['state'], 'reading': r['note']}
        else: unmatched.append(r)
    (ROOT / 'docs/coverage/mol_mechanisms.json').write_text(json.dumps({'about': 'Mother of Learning mechanism readings from the 2026-11-18 batch (Luna over about 12,000-word chunks, unchecked), keyed by the existing mother_of_learning_powers row they match by name. Unmatched readings follow. The ledger itself is generated elsewhere and not edited here.',
                                                                         'matched': overlay, 'unmatched': unmatched}, ensure_ascii=False, indent=1) + '\n')
    print('mol matched', len(overlay), 'unmatched', len(unmatched))
    (PRIV / 'fold_stats.json').write_text(json.dumps(stats, indent=1))
    print(json.dumps(stats, indent=1))


main()
