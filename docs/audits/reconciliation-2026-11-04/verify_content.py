"""Task-local receipt integrity. This does not establish semantic reading or behavior."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import argparse

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--public-export", action="store_true", help="Report missing gitignored private fold suppliers without pretending to verify their contents.")
args = parser.parse_args()

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
paths, issues, links = set(), [], []
events = {'fresh': 0, 'reused': 0}
fold_count = 0
omitted_private_folds = []
omitted_private_links = []
ledgers = sorted(HERE.glob('content-b[0-9]*.json'))
for ledger in ledgers:
    data = json.loads(ledger.read_text())
    if data.get('status') != 'recorded':
        issues.append([ledger.name, 'not recorded'])
    for review in data.get('reviews', []):
        paths.add(review['path'])
        mode = 'reused' if review.get('read_mode') == 'reuse_prior_full_content_review' else 'fresh'
        events[mode] += 1
        if not review.get('ranges') or not review.get('input_sha256') or not review.get('ids'):
            issues.append([ledger.name, review['path'], 'missing identity/ranges/IDs'])
    for fold in data.get('folds', []):
        fold_count += 1
        paths.add(fold['path'])
        supplier = ROOT / fold['path']
        if not supplier.exists() and args.public_export and subprocess.run(['git', 'check-ignore', '--quiet', '--', fold['path']], cwd=ROOT).returncode == 0:
            omitted_private_folds.append({'ledger': ledger.name, 'path': fold['path'], 'scope': 'Private supplier omitted from public export; fold content not checked.'})
            continue
        current = supplier.read_text()
        body = fold['body'].strip()
        for amendment in data.get('post_record_amendments', []):
            if amendment['path'] == fold['path']:
                body = body.replace(amendment['from'], amendment['to'])
        if fold['heading'] not in current or body not in current:
            issues.append([ledger.name, fold['path'], 'missing recorded fold'])
        for target in re.findall(r'\]\(([^)\s]+)\)', body):
            if ':' in target.split('/')[0] or target.startswith('#'):
                continue
            path = target.split('#')[0]
            if path and not (ROOT / fold['path']).parent.joinpath(path).exists():
                local_target = (ROOT / fold['path']).parent.joinpath(path).resolve()
                try:
                    relative_target = str(local_target.relative_to(ROOT))
                except ValueError:
                    relative_target = ''
                if args.public_export and relative_target and subprocess.run(['git', 'check-ignore', '--quiet', '--', relative_target], cwd=ROOT).returncode == 0:
                    omitted_private_links.append({'owner': fold['path'], 'target': target, 'scope': 'Held local supplier excluded from publication; not a public-link verification.'})
                else:
                    links.append([fold['path'], target])

inventory = json.loads((HERE / 'inventory.json').read_text())
drift = []
omitted_private_inputs = []
for row in inventory['candidates']:
    if row.get('closeout_sha256'):
        path = ROOT / row['path']
        sha = hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else None
        if sha is None and args.public_export and subprocess.run(['git', 'check-ignore', '--quiet', '--', row['path']], cwd=ROOT).returncode == 0:
            omitted_private_inputs.append({'path': row['path'], 'recorded_closeout': row['closeout_sha256'], 'scope': 'Private input absent; historical identity retained, no new reading or byte check.'})
            continue
        if sha != row['closeout_sha256']:
            drift.append({'path': row['path'], 'full_review': row.get('content_review', {}).get('full', False),
                          'recorded_closeout': row['closeout_sha256'], 'current': sha})
result = subprocess.run(['git', 'diff', '--check', '--', *sorted(paths)], cwd=ROOT,
                        text=True, capture_output=True)
out = {'last_batch': inventory['continuous_run']['last_batch'], 'batch_ledgers': len(ledgers),
       'review_events': events, 'owner_folds': fold_count, 'unique_review_and_owner_paths': len(paths),
       'ledger_issues': issues, 'new_fold_missing_links': links, 'omitted_private_folds': omitted_private_folds, 'omitted_private_links': omitted_private_links,
       'task_diff_check_exit': result.returncode,
       'task_diff_check_output': result.stdout + result.stderr,
       'coverage': inventory['continuous_run'], 'current_input_drift': drift, 'omitted_private_inputs': omitted_private_inputs,
       'scope': 'Document/range/fold presence only. Explicit post-record amendments applied to comparison, '
                'never rewritten into original inputs. Concurrent partial-owner drift retained; no runtime proof.'}
(HERE / 'continuous-checks.json').write_text(json.dumps(out, indent=2) + '\n')
print(json.dumps({key: value for key, value in out.items() if key not in ['current_input_drift', 'coverage']}))
print(json.dumps({'drift_paths': len(drift), 'drift_on_full_reviewed_paths':
                  [row['path'] for row in drift if row['full_review']]}))
raise SystemExit(bool(issues or links or result.returncode))
