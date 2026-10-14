"""Read-only structural checks for B4 documentation. Does not fetch sources."""
from pathlib import Path
from collections import Counter
from urllib.parse import unquote
import json
import re

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[4]
failures = []
checks = []
coverage = json.loads((OUT / 'COVERAGE.json').read_text())
digests = sorted((ROOT / 'docs/research/power-systems/wiki-digests').glob('DIGEST_*.md'))
expected = {p.stem.removeprefix('DIGEST_') for p in digests}
records = coverage['digests']
assert len(records) == len({r['slug'] for r in records})
assert {r['slug'] for r in records} == expected
cards = sorted(OUT.glob('SRC_*.md'))
output_names = {r['output'] for r in records if r['output']}
output_names |= {'SRC_' + s + '.md' for s in coverage['supplemental']}
assert {p.name for p in cards} == output_names
checks.append(f'PASS coverage: {len(digests)} current digests, {len(cards)} source cards, '
              f'{sum(not r["output"] for r in records)} skips, '
              f'{len(coverage["supplemental"])} supplemental source')

code_limits = dict(BD=9, CL=10, BP=9, MX=6, CN=8, SG=13, AG=6, BM=6, GN=12)
local_links = 0
claims = 0
note_locators = 0
for p in sorted(OUT.glob('*.md')):
    text = p.read_text()
    for n, line in enumerate(text.splitlines(), 1):
        if line.rstrip() != line:
            failures.append(f'{p.name}:{n}: trailing whitespace')
    if '\u2014' in text:
        failures.append(f'{p.name}: em dash')
    for target in re.findall(r'\]\(([^)]+)\)', text):
        if target.startswith(('https://', 'http://')):
            continue
        path = unquote(target.split('#')[0])
        if path and not (p.parent / path).exists():
            failures.append(f'{p.name}: missing local link {target}')
        if path:
            assert (p.parent / path).resolve().is_relative_to(ROOT), (p, target)
            assert Path(path).suffix.lower() not in {'.gz', '.epub', '.7z', '.xml'}, (p, target)
            assert not re.search(r'(^|/)(sealed|secrets)(/|\.)', path, re.I), (p, target)
        local_links += 1
    if p.name.startswith('SRC_'):
        assert 'Coverage and contradictions:' in text, p.name
        assert 'not established by this review' in text, p.name
        ids = []
        for line in text.splitlines():
            if not re.match(r'\| C\d\d \|', line):
                continue
            parts = line.split('|')
            ids.append(parts[1].strip())
            label = parts[2].strip()
            assert label in {'shown', 'stated', 'inferred', 'inferred / unverified lead'}, (p, label)
            for fam, code in re.findall(r'\b(BD|CL|BP|MX|CN|SG|AG|BM|GN)(\d+)\b', parts[3]):
                assert 1 <= int(code) <= code_limits[fam], (p, fam, code)
            # Verify the actual retained note identity when a row names a JSONL line.
            match = re.search(r'\]\(([^)]+NOTES\.jsonl)\): JSONL line (\d+), (.*)', line)
            if match:
                note_path = (p.parent / match[1]).resolve()
                note = json.loads(note_path.read_text().splitlines()[int(match[2]) - 1])
                locator = match[3]
                assert locator.startswith(note['title']), (p, locator, note['title'])
                revision = re.search(r'\br(\d+)\b', locator)
                if revision:
                    assert str(note.get('revision_id')) == revision[1], (p, revision[1], note.get('revision_id'))
                note_locators += 1
            claims += 1
        assert ids == [f'C{n:02}' for n in range(1, len(ids) + 1)] and ids, p.name

assert not failures, '\n'.join(failures)
checks.append(f'PASS Markdown: {local_links} local links resolve; no trailing whitespace or em dashes')
checks.append(f'PASS source cards: {claims} uniquely sequenced, labeled claims; numbered mappings within G1–G42 code ranges')
checks.append(f'PASS selected dump locators: {note_locators} JSONL line/title/revision identities match local notes')
assert all('/' not in name and name.startswith('SRC_') for name in output_names)
checks.append('PASS artifact scope: generated names stay in b4; local links stay in repo; no raw-source payload or sealed-path links')
print('\n'.join(checks))
