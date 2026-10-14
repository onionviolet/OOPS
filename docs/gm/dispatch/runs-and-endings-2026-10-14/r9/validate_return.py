"""Static documentation checks and final read-only input capture; writes r9 only."""
import collections
import datetime
import hashlib
import json
import re
from pathlib import Path

L = Path(__file__).parent
source = Path('docs/worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md')
text = source.read_text()
lines = text.splitlines()
section = 0
scoped = []
all_definitions = collections.defaultdict(list)
for number, line in enumerate(lines, 1):
    match = re.match(r'## (\d+)\.', line)
    if match:
        section = int(match[1])
    match = re.match(r'\| ([A-Z][A-Z0-9-]*\d+) \|', line)
    if match:
        code = match[1]
        all_definitions[code].append(number)
        if 8 <= section <= 20:
            scoped.append({'code': code, 'line': number, 'section': section, 'text': line})
reviewed = json.loads((L / 'ROW_DISPOSITIONS.json').read_text())
assert [{k:r[k] for k in ('code','line','section','text')} for r in reviewed] == scoped, 'Scoped input drift after review'
counts = collections.Counter(r['relation'] for r in reviewed)
assert len(reviewed) == 551
assert len({r['code'] for r in reviewed}) == 551
assert len({r['audit_code'] for r in reviewed}) == 551
dials = [r['code'] for r in scoped if re.fullmatch(r'DL\d+', r['code'])]
builds = [r['code'] for r in scoped if re.fullmatch(r'T\d+', r['code'])]
assert dials == [f'DL{i}' for i in range(9,48)]
assert builds == [f'T{i}' for i in range(6,38)]
required = ['CHECKPOINT.md','REPORT.md','INTEGRATION.md','DEDUPE_TABLE.md','COMPACT_REPLACEMENT_OUTLINE.md']
assert all((L / name).exists() for name in required)
table = (L / 'DEDUPE_TABLE.md').read_text()
table_ids = re.findall(r'^\| (D\d+) \|', table, re.M)
assert table_ids == [r['audit_code'] for r in reviewed]
integration = (L / 'INTEGRATION.md').read_text()
retained_ids = re.findall(r'^\| (D\d+) \| [A-Z]+\d+ \|', integration, re.M)
assert retained_ids == [r['audit_code'] for r in reviewed if r['relation'] != 'duplicate']
locators = []
for path, number in sorted(set((r['owner'], r['owner_line']) for r in reviewed if r['owner'])):
    p = Path(path)
    owner_lines = p.read_text().splitlines()
    assert 1 <= number <= len(owner_lines), (path, number)
    assert owner_lines[number-1].strip(), ('blank locator', path, number)
    locators.append({'path':path,'line':number,'line_sha256':hashlib.sha256(owner_lines[number-1].encode()).hexdigest()})
(L / 'CITED_LOCATORS.json').write_text(json.dumps(locators,indent=2)+'\n')
baseline = {r['code']:r for r in json.loads((L / 'ROW_INVENTORY.json').read_text())}
changed = [r['code'] for r in scoped if r != baseline[r['code']]]
manifest = json.loads((L / 'CORPUS_MANIFEST.json').read_text())
drift = []
for entry in manifest:
    p = Path(entry['path'])
    raw = p.read_bytes()
    if hashlib.sha256(raw).hexdigest() != entry['sha256']:
        drift.append({'path':str(p),'baseline_lines':entry['lines'],'current_lines':len(raw.splitlines())})
initial_paths = {entry['path'] for entry in manifest}
current_paths = set(initial_paths)
current_paths |= {str(p) for p in Path('docs/worlds').glob('*.md')}
current_paths |= {str(p) for p in Path('docs/emergent').glob('E*.md')}
current_paths |= {str(p) for p in source.parent.glob('*.md') if re.match(r'(0[1-9]|1\d|2\d)_',p.name) and p != source}
final_manifest=[]
for name in sorted(current_paths):
    raw=Path(name).read_bytes()
    final_manifest.append({'path':name,'sha256':hashlib.sha256(raw).hexdigest(),'lines':len(raw.splitlines())})
(L / 'FINAL_CORPUS_MANIFEST.json').write_text(json.dumps(final_manifest,indent=2)+'\n')
style=[]
for name in required:
    prose=(L/name).read_text()
    if '\u2014' in prose or ' -- ' in prose:
        style.append(name)
assert not style, ('style tokens',style)
out={'checked_at':datetime.datetime.now().astimezone().isoformat(),
     'source':str(source),'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
     'scope':'sections 8-20 only','scoped_rows':len(scoped),'relation_counts':dict(counts),
     'table_coverage':'551/551','retained_or_flagged_routes':len(retained_ids),
     'scoped_duplicates':[],
     'whole_current_document_duplicate_codes':{k:v for k,v in all_definitions.items() if len(v)>1},
     'dial_ids':{'first':'DL9','last':'DL47','count':len(dials),'contiguous':True},
     'build_ids':{'first':'T6','last':'T37','count':len(builds),'contiguous':True},
     'owner_locators_checked':len(locators),
     'peer_updated_scoped_rows':changed,'input_changes_reconciled':True,
     'outside_scope_sections':[int(s) for s in re.findall(r'^## (\d+)\.',text,re.M) if int(s)>20],
     'baseline_corpus':{'files':len(manifest),'lines':sum(x['lines'] for x in manifest)},
     'final_corpus':{'files':len(final_manifest),'lines':sum(x['lines'] for x in final_manifest)},
     'new_corpus_files':sorted(current_paths-initial_paths),'changed_corpus_files':drift,
     'missing_depth_parts':[i for i in range(1,30) if i!=22 and not any(re.match(f'{i:02d}_',p.name) for p in source.parent.glob('*.md'))],
     'checks':['row identity/content stable at final review','one disposition per row','one retained integration route per nonduplicate','owner paths/line bounds/nonblank lines','dial/build ranges','required deliverables','plain style'],
     'runtime_tests_build_browser_save':'not run; docs-only audit'}
(L/'VALIDATION.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({k:out[k] for k in ('scoped_rows','relation_counts','retained_or_flagged_routes','owner_locators_checked','peer_updated_scoped_rows','final_corpus','new_corpus_files','whole_current_document_duplicate_codes')},indent=2))
