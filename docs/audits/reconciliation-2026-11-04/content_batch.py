"""Task-local recorder. Decisions and actual reading are supplied by the reviewer.
No discovery rule, hash, or call to this helper establishes content review by itself.
Run via runpy and call record_batch with explicitly reviewed inputs and owner folds.
"""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
INVENTORY = HERE / 'inventory.json'
REPORT = ROOT / 'docs/audits/LOOSE_DOCUMENT_RECONCILIATION_2026-11-04.md'

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def record_batch(batch, title, reviews, folds=(), next_paths=()):
    """Full content reads only. Partial reads use ranges and full=False explicitly."""
    ledger = HERE / f'content-{batch.lower()}.json'
    if ledger.exists():
        raise ValueError(f'{batch} already recorded; inspect it before replaying')
    now = datetime.now(timezone.utc).isoformat()
    captured = []
    for review in reviews:
        item = dict(review)
        for field in ['path', 'ids', 'classification', 'owners', 'disposition', 'evidence', 'reopen']:
            if not item.get(field):
                raise ValueError(f'Missing {field} in {item.get("path")}')
        path = ROOT / item['path']
        line_count = len(path.read_text().splitlines())
        item.update(input_sha256=digest(path), input_lines=line_count)
        item.setdefault('full', True)
        if not item['full'] and not item.get('ranges'):
            raise ValueError('Partial read needs explicit ranges')
        item.setdefault('ranges', [[1, line_count]])
        captured.append(item)
    state = {'schema': 1, 'batch': batch, 'title': title, 'at': now,
             'head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
             'status': 'recording', 'reviews': captured, 'folds': list(folds),
             'scope': 'Reviewer supplied content dispositions. Explicit read_mode distinguishes fresh reading from inspected prior full-content review reused on unchanged inputs. No hash-inferred semantics or renewed historical behavior proof.'}
    ledger.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')
    for fold in folds:
        path = ROOT / fold['path']
        original = path.read_text()
        section = '\n\n' + fold['heading'] + '\n\n' + fold['body'].strip() + '\n'
        fold['before_sha256'] = digest(path)
        if fold['heading'] in original:
            raise ValueError(f'Existing fold heading in {path}; recover from {ledger}')
        with path.open('a') as output:
            output.write(section)
        if not path.read_text().startswith(original):
            raise ValueError(f'Unexpected loss while appending {path}')
        fold['after_sha256'] = digest(path)
    # Re-read task-owned inventory, retaining prior batches and original intake identities.
    inventory = json.loads(INVENTORY.read_text())
    rows = {item['path']: item for item in inventory['candidates']}
    for item in captured:
        row = rows.setdefault(item['path'], {'path': item['path'], 'sha256': item['input_sha256'], 'lines': item['input_lines']})
        row.update(review_state=('prior full-content review reused; semantic receipt reviewed and unchanged input checked' if item.get('read_mode') == 'reuse_prior_full_content_review' else 'full content reviewed; factual proof scoped to disposition') if item['full'] else 'selected content ranges reviewed; remainder open',
                   reviewed_range=f'{batch}: ' + str(item['ranges']),
                   content_review={**item, 'ledger': str(ledger.relative_to(ROOT))},
                   disposition=item['disposition'], next_action=item['reopen'])
    for fold in folds:
        row = rows.get(fold['path'])
        if row and not row.get('reviewed_range'):
            row.update(review_state='selected owner section maintained; full content review remains',
                       reviewed_range=f'{batch}: received section {fold["heading"]}',
                       disposition='Scoped owner fold, not a full-document or implementation review.')
    for path_name in {x['path'] for x in captured} | {x['path'] for x in folds}:
        if path_name in rows:
            path = ROOT / path_name
            rows[path_name].update(closeout_sha256=digest(path), closeout_lines=len(path.read_text().splitlines()))
    inventory['candidates'] = sorted(rows.values(), key=lambda x: x['path'])
    remaining = sum(not x.get('reviewed_range') for x in rows.values())
    partial = sum(bool(x.get('reviewed_range')) and not x.get('content_review', {}).get('full', False) for x in rows.values())
    inventory['continuous_run'] = {'status': 'active', 'last_batch': batch, 'at': now,
        'remaining_without_content_review': remaining, 'candidate_count': len(rows),
        'partial_or_legacy_ranges_needing_full_coverage_check': partial,
        'remaining_without_explicit_full_review': remaining + partial,
        'next_suggested_paths': list(next_paths),
        'note': 'Continue actual content review. Owner-section maintenance is not full-file review; all ledger ranges retain their scope.'}
    INVENTORY.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n')
    marker = f'### {batch}: {title}'
    with REPORT.open('a') as output:
        fresh = sum(x.get('read_mode') != 'reuse_prior_full_content_review' for x in captured)
        output.write(f'\n\n{marker}\n\n{len(captured)} reviewed inputs ({fresh} fresh reads, {len(captured)-fresh} inspected prior full-content reviews reused); {len(folds)} owner folds. [Original IDs, input ranges, dispositions and proof limits]({ledger.relative_to(REPORT.parent)}). Remaining without content review: {remaining:,}; another {partial:,} partial/legacy-range entries need full-coverage accounting. No gameplay implementation, deletion, relocation, commit or push.\n')
    state.update(status='recorded', folds=list(folds), remaining_without_content_review=remaining)
    ledger.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'batch': batch, 'reviewed_inputs': len(captured), 'owner_folds': len(folds), 'remaining': remaining}))
