"""Check selected retained definition locators without executing source helpers."""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
SNAPSHOT = Path('/Users/weiwei/.codex/research/book-of-hours/22091683')
CORE = SNAPSHOT / 'raw/OSX.app/Contents/Resources/Data/StreamingAssets/bhcontent/core'


def normalize(text):
    # Only remove comments and trailing commas outside JSON strings.
    out, i, quoted, escaped = [], 0, False, False
    while i < len(text):
        c = text[i]
        if quoted:
            out.append(c)
            if escaped:
                escaped = False
            elif c == '\\':
                escaped = True
            elif c == '"':
                quoted = False
        elif c == '"':
            quoted = True
            out.append(c)
        elif text[i:i + 2] == '//':
            while i < len(text) and text[i] != '\n':
                i += 1
            out.append('\n')
        elif text[i:i + 2] == '/*':
            end = text.find('*/', i + 2)
            assert end >= 0, 'Unterminated JSON comment'
            i = end + 1
        elif c == ',':
            following = i + 1
            while following < len(text) and text[following].isspace():
                following += 1
            if following == len(text) or text[following] not in '}]':
                out.append(c)
        else:
            out.append(c)
        i += 1
    return ''.join(out)


selection = json.loads((HERE / 'SOURCE_SELECTION.json').read_text())
dossier_path = REPO / 'docs/research/book-of-hours/FINDINGS.json'
dossier = json.loads(dossier_path.read_text())
published_claims = {row['id']: row for row in dossier['findings']}
for claim in selection['claims']:
    assert claim == published_claims[claim['id']], f"Published claim changed: {claim['id']}"

files, locators = {}, {}
for row in selection['selected_paths'] + selection['claims']:
    for evidence in row['evidence']:
        file = evidence['file']
        if file not in files:
            raw = (CORE / file).read_bytes()
            encoding = 'utf-16' if raw.startswith((b'\xff\xfe', b'\xfe\xff')) else 'utf-8-sig'
            files[file] = {'sha256': hashlib.sha256(raw).hexdigest(), 'bytes': len(raw),
                           'data': json.loads(normalize(raw.decode(encoding)), strict=False)}
        actual = files[file]
        assert actual['sha256'] == evidence['sha256'], f'Hash changed: {file}'
        record = actual['data'][evidence['group']][evidence['ordinal_zero_based']]
        identifiers = [value for key, value in record.items() if key.lower() == 'id']
        assert identifiers == [evidence['id']], f"Locator changed: {evidence['id']}"
        locators[(file, evidence['group'], evidence['ordinal_zero_based'])] = evidence

receipt = {
    'schema': 1, 'checked_at_utc': datetime.now(timezone.utc).isoformat(),
    'snapshot': str(SNAPSHOT), 'source_library_mutated': False,
    'recovered_helpers_executed': False, 'source_corpus_copied': False,
    'selected_path_ids': [row['id'] for row in selection['selected_paths']],
    'published_claim_ids': [row['id'] for row in selection['claims']],
    'published_dossier': str(dossier_path.relative_to(REPO)),
    'published_dossier_sha256': hashlib.sha256(dossier_path.read_bytes()).hexdigest(),
    'selection_sha256': hashlib.sha256((HERE / 'SOURCE_SELECTION.json').read_bytes()).hexdigest(),
    'actual_retained_file_hashes': [{'file': file, 'sha256': row['sha256'], 'bytes': row['bytes']}
                                  for file, row in sorted(files.items())],
    'exact_definition_locators': list(locators.values()),
    'result': 'pass', 'file_count': len(files), 'locator_count': len(locators),
    'boundary': 'Selected definitions and published claim binding only; no whole-source or source-runtime claim.'
}
(HERE / 'SOURCE_HASHES.json').write_text(json.dumps(receipt, indent=2) + '\n')
print(f"Source hashes and {len(locators)} exact locators pass across {len(files)} retained files.")
