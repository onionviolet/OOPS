"""Structural planning validation only, no runtime/gameplay checks."""
import hashlib
import json
import re
from pathlib import Path

folder = Path(__file__).resolve().parent
repo = folder.parents[3]
ledger = json.loads((folder / 'DETAIL_LEDGER.json').read_text())
manifest = json.loads((folder / 'MANIFEST.json').read_text())
original = json.loads((repo / ledger['inheritedLedger']).read_text())
checks = {}
checks['inherited_ids_exact_unique'] = (len(ledger['requirements']) == 179 and
    len({r['id'] for r in ledger['requirements']}) == 179 and
    {r['id'] for r in ledger['requirements']} == {r['id'] for r in original['requirements']})
checks['idea_families_exact_unique'] = (len(ledger['ideaFamilies']) == 40 and
    {r['id'] for r in ledger['ideaFamilies']} == {f'I{i:02}' for i in range(1, 41)})
checks['sections_exact_unique'] = (len(ledger['sections']) == 15 and
    {r['id'] for r in ledger['sections']} == {f'S{i:02}' for i in range(15)})
checks['required_routing_fields'] = all(all(key in row for key in
    ['id', 'existingDepth', 'disposition', 'neededExpansion', 'nextRoute'])
    for row in ledger['requirements'] + ledger['ideaFamilies'])
checks['ten_leaf_manifest'] = (len(manifest['leaves']) == 10 and
    {r['id'] for r in manifest['leaves']} == {f'MM{i:02}' for i in range(1, 11)})
known_ids = {r['id'] for r in original['requirements']}
checks['antecedent_ids_resolve'] = all(set(r['originalIds']) <= known_ids for r in manifest['leaves'])
checks['leaf_cards_present'] = all(re.search(r'^## '+r['id']+r':',
    (folder / r['owner']).read_text(), re.M) for r in manifest['leaves'])
packet = (folder / 'IMPLEMENTATION_PACKETS.md').read_text()
checks['four_packets_and_twelve_dependencies'] = (len(re.findall(r'^## MM-P[1-4]\.', packet, re.M)) == 4 and
    set(re.findall(r'^\| (MD\d+) \|', packet, re.M)) == {f'MD{i}' for i in range(1, 13)})
missing_links = []
links_checked = 0
for path in folder.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)', path.read_text()):
        if '://' in target or target.startswith('#'):
            continue
        target = target.split('#')[0]
        links_checked += 1
        if not (path.parent / target).resolve().exists():
            missing_links.append({'file':path.name, 'target':target})
checks['local_link_targets_exist'] = not missing_links
source_paths = sorted(set(re.findall(r'`(src/[^`: ]+\.js)', packet)))
checks['explicit_source_paths_exist'] = all((repo / p).exists() for p in source_paths)
whitespace = []
for path in folder.iterdir():
    if path.suffix in {'.md', '.json', '.py'}:
        for line, value in enumerate(path.read_text().splitlines(), 1):
            if value.rstrip() != value:
                whitespace.append(f'{path.name}:{line}')
checks['no_trailing_whitespace'] = not whitespace
inputs = json.loads((folder / 'INPUTS.json').read_text())
drift = [r['path'] for r in inputs['files'] if hashlib.sha256((repo / r['path']).read_bytes()).hexdigest() != r['sha256']]
result = {'scope':'document structure only; runtime/source canon/director proof not run',
    'checks':checks, 'passed':all(checks.values()), 'linksChecked':links_checked,
    'explicitSourcePaths':source_paths, 'missingLinks':missing_links, 'whitespace':whitespace,
    'inputDrift':drift, 'outputHashes':{p.name:hashlib.sha256(p.read_bytes()).hexdigest()
        for p in folder.iterdir() if p.is_file() and p.name not in {'VALIDATION.json', 'CHECKPOINT.md'}}}
(folder / 'VALIDATION.json').write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k != 'outputHashes'}, indent=2))
raise SystemExit(0 if result['passed'] else 1)
