"""Read-only artifact/evidence validation. This does not run game tests."""
from pathlib import Path
import datetime
import hashlib
import json
import re
import subprocess

OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[2]
SOURCE = Path('/Users/weiwei/.codex/research/elin/Elin-Decompiled')
PIN = '6713f0656491f73f79068454dc3cd938b3a74c10'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate():
    errors = []
    coverage = json.loads((OUT / 'COVERAGE.json').read_text())
    findings = json.loads((OUT / 'FINDINGS.json').read_text())
    intake = json.loads((OUT / 'INTAKE.json').read_text())
    counts = {'json_files': 0, 'fingerprints': 0, 'spans': 0, 'anchors': 0,
              'local_links': 0, 'pinned_source_links': 0}
    for path in OUT.rglob('*.json'):
        if path.name != 'VALIDATION.json':
            json.loads(path.read_text())
            counts['json_files'] += 1
    for base, key in [(SOURCE, 'source_files'), (ROOT, 'yair_inputs')]:
        for entry in coverage[key]:
            path = base / entry['path']
            if digest(path) != entry['sha256']:
                errors.append(f'Fingerprint drift: {path}')
            counts['fingerprints'] += 1
            n = len(path.read_text().splitlines())
            for start, end in entry['read_ranges']:
                if not 1 <= start <= end <= n:
                    errors.append(f'Invalid semantic span: {path}:{start}-{end}/{n}')
                counts['spans'] += 1
    ranges = {e['path']: e['read_ranges'] for e in coverage['source_files']}
    for finding in findings['mechanics']:
        if not finding['observed_rules'] or not finding['failure_path']:
            errors.append(f'Incomplete mechanic: {finding["id"]}')
        for anchor in finding['evidence']:
            path = SOURCE / anchor['path']
            start, end = anchor['lines']
            if digest(path) != anchor['sha256']:
                errors.append(f'Anchor hash mismatch: {path}')
            if not any(a <= start <= end <= b for a, b in ranges.get(anchor['path'], [])):
                errors.append(f'Anchor not covered by semantic read: {path}:{start}-{end}')
            expected = f'https://github.com/Elin-Modding-Resources/Elin-Decompiled/blob/{PIN}/{anchor["path"]}#L{start}-L{end}'
            if anchor['permalink'] != expected:
                errors.append(f'Unpinned or wrong link: {path}')
            counts['anchors'] += 1
            counts['pinned_source_links'] += 1
    for path in OUT.rglob('*.md'):
        if path.name == 'ASSIGNMENT.md':
            continue
        for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', path.read_text()):
            if target.startswith(('https:', 'http:', '#')):
                continue
            local = Path(target.split('#')[0])
            local = local if local.is_absolute() else path.parent / local
            if not local.exists():
                errors.append(f'Missing local link: {path} -> {target}')
            counts['local_links'] += 1
    if len(findings['mechanics']) != 5 or len(findings['packets']) > 5:
        errors.append('Wrong mechanic/packet count')
    if digest(OUT / 'ASSIGNMENT.md') != intake['yair']['inputs']['docs/research/elin/ASSIGNMENT.md']['sha256']:
        errors.append('Dispatcher assignment changed')
    actual_pin = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=SOURCE, text=True).strip()
    source_status = subprocess.check_output(['git', 'status', '--porcelain'], cwd=SOURCE, text=True).strip()
    if actual_pin != PIN or source_status:
        errors.append('Source revision/worktree changed')
    artifacts = {str(p.relative_to(OUT)): {'sha256': digest(p), 'bytes': p.stat().st_size}
                 for p in sorted(OUT.rglob('*')) if p.is_file() and p.name != 'VALIDATION.json'}
    return {'checked_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'status': 'passed' if not errors else 'failed', 'errors': errors,
            'checks': counts, 'source_commit': actual_pin, 'source_worktree': source_status or 'clean',
            'semantic_coverage': coverage['counts'], 'artifacts': artifacts,
            'scope': 'JSON, input/source fingerprints, semantic spans, covered pinned anchors, local Markdown links, unchanged dispatcher assignment and clean pinned source checkout',
            'not_run': ['game/build/browser/test suites', 'save/reload/failure play',
                        'installed-game/DLL/version match', 'external sheet/assets validation',
                        'director acceptance'],
            'delivery_state': 'source research complete; original gameplay packets proposed only'}


if __name__ == '__main__':
    result = validate()
    (OUT / 'VALIDATION.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({k: result[k] for k in ['status', 'errors', 'checks', 'semantic_coverage']}))
    raise SystemExit(0 if result['status'] == 'passed' else 1)
