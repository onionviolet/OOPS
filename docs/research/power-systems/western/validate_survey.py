"""Check the lane's coverage and evidence links without contacting sources."""
import collections
import hashlib
import json
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[3]
data = json.loads((OUT / 'SERIES.json').read_text())
expected = set('worm cradle mistborn stormlight kingkiller dresden wheel guide inn carl hwfwm mol marvel dc dnd mtg souls elden hades poe spire geis faust fae monastic knightly curses genies'.split())
path_keys = set('currency steps gate risk shape branching grader ceiling'.split())
axis_keys = set('object mechanism trigger certainty scope price limit visibility persistence growth'.split())
slot_keys = set('swearer restriction object scope duration benefit consequence witness condition ramp stake counterparty release visibility inheritance interpretation coercion_clause'.split())
sources = {s['id']: s for s in data['sources']}
claims = {c['id']: c for r in data['series'] for c in r['claims']}
mechanics = {m['id']: m for r in data['series'] for m in r['mechanics']}
errors = []

def check(condition, description):
    if not condition:
        errors.append(description)

check({r['id'] for r in data['series']} == expected, 'required subject IDs')
check(len(data['series']) == 28, 'exactly 28 subjects')
check(len(sources) == len(data['sources']), 'unique source IDs')
check(len(claims) == sum(len(r['claims']) for r in data['series']), 'unique claim IDs')
check(len(mechanics) == sum(len(r['mechanics']) for r in data['series']), 'unique mechanic IDs')
for row in data['series']:
    id = row['id']
    check(set(row['path']) == path_keys and all(row['path'].values()), id + ' path')
    check(set(row['axes']) == axis_keys and all(row['axes'].values()), id + ' axes')
    check(row['model_mapping_status'] == 'inference_from_cited_claims', id + ' map status')
    check(row['families'] and row['power_sources'] and row['delivery_modes'], id + ' catalog mapping')
    check(row['gag_or_rule_abuse'] and row['limits'], id + ' abuse and limits')
    check(set(row['basis_claim_ids']) <= set(claims), id + ' mapping basis')
    for claim in row['claims']:
        check(set(claim['source_ids']) <= set(sources), claim['id'] + ' source references')
        check(claim['status'] == 'remembered_unverified' or bool(claim['source_ids']), claim['id'] + ' evidence')
    for vow in row['vows']:
        check(set(vow['slots']) == slot_keys, id + ' vow slots')
        check(vow['mapping_status'] == 'inference', id + ' vow mapping status')
    for mechanic in row['mechanics']:
        check(mechanic['status'] == 'proposal', mechanic['id'] + ' proposal status')
        check(set(mechanic['basis_claim_ids']) <= set(claims), mechanic['id'] + ' evidence')
    for abuse in row['gag_or_rule_abuse']:
        check(set(abuse['basis_claim_ids']) <= set(claims), id + ' abuse evidence')
check(len(data['top_15']) == 15, '15 ranked additions')
check([r['rank'] for r in data['top_15']] == list(range(1, 16)), 'rank sequence')
for item in data['top_15']:
    check(item['mechanic_id'] in mechanics and item['status'] == 'proposal', item['id'] + ' ranked mechanic')
    check(set(item['basis_claim_ids']) <= set(claims), item['id'] + ' claim IDs')
    check(all(claims[c]['status'] != 'remembered_unverified' for c in item['basis_claim_ids']), item['id'] + ' excludes memory evidence')
    check(set(item['source_ids']) <= set(sources), item['id'] + ' source IDs')
for id, source in sources.items():
    check(source['access'] in {'page_read', 'search_excerpt', 'local_read'}, id + ' access label')
    if source['access'] == 'local_read':
        check((ROOT / source['url']).exists(), id + ' local source')
for name in ['SERIES.json', 'REPORT.md', 'SOURCES.md', 'CHECKPOINT.md', 'assemble_survey.py']:
    text = (OUT / name).read_text()
    check('\u2014' not in text and ' -- ' not in text, name + ' plain-language dash check')
    check(not re.search(r'turn\d+(?:search|view)\d+', text), name + ' no internal web IDs')
for name in ['REPORT.md', 'SOURCES.md']:
    for link in re.findall(r'\]\(([^)]+)\)', (OUT / name).read_text()):
        if not link.startswith('https:'):
            check((OUT / link).exists(), name + ' local link: ' + link)
input_hashes = json.loads((OUT / 'INPUT_HASHES.json').read_text())
drift = [p for p, h in input_hashes.items() if hashlib.sha256((ROOT / p).read_bytes()).hexdigest() != h]
check(not drift, 'input drift: ' + str(drift))
result = {
    'result': 'pass' if not errors else 'fail',
    'subjects': len(data['series']), 'claims': len(claims),
    'mechanics': len(mechanics), 'sources': len(sources),
    'ranked_additions': len(data['top_15']),
    'groups': dict(collections.Counter(r['group'] for r in data['series'])),
    'remembered_claims': [id for id, c in claims.items() if c['status'] == 'remembered_unverified'],
    'source_access': dict(collections.Counter(s['access'] for s in sources.values())),
    'input_drift': drift, 'errors': errors,
    'checks': ['28 assigned subjects', 'eight path parts', 'ten axes',
               'family/source/delivery mappings', '17 E8D slots',
               'unique claim/source/mechanic IDs', 'evidence references',
               'top 15 exclude remembered evidence', 'access labels',
               'local source links', 'plain-language dash check', 'input hashes'],
    'not_run': ['build', 'game tests', 'browser gameplay', 'full book reread',
                'exact blocked-page scene verification'],
    'scope': 'Lane C research files only; no gameplay acceptance implied',
    'artifacts': {name: hashlib.sha256((OUT / name).read_bytes()).hexdigest()
                  for name in ['SERIES.json', 'REPORT.md', 'SOURCES.md', 'INPUT_HASHES.json']},
}
(OUT / 'VALIDATION.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({k: v for k, v in result.items() if k != 'artifacts'}, indent=2))
raise SystemExit(bool(errors))
