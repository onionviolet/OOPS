"""P36 documentation checks only. Writes CHECKS.json beside this script."""
from pathlib import Path
import datetime
import hashlib
import json
import re

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[4]
REQUIRED = ['CHECKPOINT.md', 'ADDRESS.md', 'REMEMBERED.md', 'TRACES.md',
            'VILLAGE_REACTIONS.md', 'INFORMATION_TEXTURE.md', 'TIMING.md',
            'UI_TOUCHES.md', 'MORE.md', 'REPORT.md']
failures, codes, counts = [], [], {}
links = anchors = ranges = 0
snapshot = json.loads((OUT / 'SOURCE_SNAPSHOT.json').read_text())
source_rows = [f for c in snapshot['checkouts'] for f in c['files']]


def slug(text):
    text = re.sub(r'[`*_]', '', text).lower()
    return ''.join(c for c in text if c.isalnum() or c in ' _-').replace(' ', '-')


for name in REQUIRED:
    path = OUT / name
    if not path.exists():
        failures.append('Missing ' + name)
        continue
    content = path.read_text()
    if not re.search(r'proposal', content, re.I):
        failures.append('Missing proposal label: ' + name)
    if '\u2014' in content:
        failures.append('Em dash: ' + name)
    if any(line.rstrip() != line for line in content.splitlines()):
        failures.append('Trailing whitespace: ' + name)
    details = []
    previous_table_width = None
    for line in content.splitlines():
        if not line.startswith('|'):
            previous_table_width = None
            continue
        cells = [c.strip() for c in line.strip().split('|')[1:-1]]
        if all(re.fullmatch(r':?-+:?', c) for c in cells):
            if previous_table_width != len(cells):
                failures.append('Table header/separator mismatch: ' + name)
        elif re.match(r'\| (?:B[A-G]\d|(?:MK1|FE5|KN4|RS3)\.P36)', line):
            if len(cells) != 8 or any(not c for c in cells):
                failures.append('Detail dimensions: ' + name + ': ' + cells[0])
            code = cells[0].split()[0]
            codes.append(code)
            details.append(code)
        previous_table_width = len(cells)
    counts[name] = len(details)
    for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', content):
        if target.startswith(('https://', 'http://')):
            continue
        parts = target.split('#', 1)
        destination = (path.parent / parts[0]).resolve() if parts[0] else path
        links += 1
        if not destination.exists():
            failures.append('Missing link: ' + name + ': ' + target)
        elif len(parts) > 1:
            anchors += 1
            heads = [slug(m.group(1)) for m in re.finditer(
                r'^#+\s+(.+)$', destination.read_text(), re.M)]
            if parts[1] not in heads:
                failures.append('Missing anchor: ' + name + ': ' + target)
    for source, first, last in re.findall(
            r'(src/[A-Za-z0-9_./]+\.js):(\d+)(?:[-–](\d+))?', content):
        ranges += 1
        matches = [f for f in source_rows if f['file'] == source]
        if not any(1 <= int(first) <= int(last or first) <= f['lines'] for f in matches):
            failures.append('Invalid captured line range: ' + source + ':' + first)

root_codes = re.findall(r'^\| (B[A-G]\d+) \|',
                        (ROOT / 'docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md').read_text(), re.M)
for code in root_codes:
    if not any(c == code or (code == 'BG1' and c in ['BG1a', 'BG1b']) for c in codes):
        failures.append('Uncovered root code: ' + code)
if len(codes) != len(set(codes)):
    failures.append('Duplicate detail codes')
recommendations = len(re.findall(r'^\| [1-5] / A[1-5] ', (OUT / 'REPORT.md').read_text(), re.M))
if recommendations != 5:
    failures.append('Immediate recommendation count')
source_drift = []
for checkout in snapshot['checkouts']:
    for row in checkout['files']:
        path = Path(checkout['path']) / row['file']
        if not path.exists() or hashlib.sha256(path.read_bytes()).hexdigest() != row['sha256']:
            source_drift.append({'checkout': checkout['label'], 'file': row['file']})

checks = {
    'label': 'DOCS only; no runtime tests/build/browser/persistence run',
    'checked_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'required_artifacts': len(REQUIRED), 'detail_rows': len(codes),
    'detail_rows_by_file': counts, 'root_codes_covered': len(root_codes),
    'unique_detail_codes': len(set(codes)), 'recommended_slices': recommendations,
    'local_links_checked': links, 'local_anchors_checked': anchors,
    'explicit_source_ranges_checked': ranges,
    'source_range_limit': 'range existence against captured files; semantics manually reviewed, abbreviated subsequent ranges not counted',
    'source_files_fingerprinted': len(source_rows),
    'source_drift_since_snapshot': source_drift,
    'style_checks': ['proposal labels', 'table header widths', 'no em dash', 'no trailing whitespace'],
    'write_scope_review': 'P36 mutations target only this folder; shared checkout concurrently changes under root',
    'failures': failures, 'pass': not failures,
}
(OUT / 'CHECKS.json').write_text(json.dumps(checks, indent=2) + '\n')
print(json.dumps(checks, indent=2))
raise SystemExit(bool(failures))
