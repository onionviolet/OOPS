#!/usr/bin/env python3
"""Run a bounded JSON task-check list; retain exit statuses and tested file hashes."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import time

def fingerprints(paths):
    return {str(p): hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in paths}

def verify(config_path, receipt_path):
    config = json.loads(Path(config_path).read_text())
    checks, sources = config['checks'], config['sources']
    if not checks or not sources or not all(isinstance(x, str) for x in sources):
        raise ValueError('Supply nonempty checks and explicit source paths')
    for check in checks:
        argv = check['argv']
        if not isinstance(argv, list) or not argv or not all(isinstance(x, str) for x in argv):
            raise ValueError('Each check argv must be a nonempty string array')
        timeout = check.get('timeout_seconds', 120)
        if isinstance(timeout, bool) or not isinstance(timeout, (int, float)) or not 0 < timeout <= 600:
            raise ValueError('Each check timeout must be greater than zero and at most 600 seconds')
    receipt = {'pass': False, 'sources_before': fingerprints(sources), 'checks': []}
    def save():
        Path(receipt_path).write_text(json.dumps(receipt, indent=2) + '\n')
    save()
    for check in checks:
        started = time.monotonic()
        row = {'name': check.get('name', check['argv'][0]), 'argv': check['argv']}
        try:
            result = subprocess.run(check['argv'], capture_output=True, text=True,
                                    encoding='utf-8', errors='replace',
                                    timeout=check.get('timeout_seconds', 120))
            row.update(exit_code=result.returncode, stdout=result.stdout[-8000:],
                       stderr=result.stderr[-8000:], pass_check=result.returncode == 0)
        except subprocess.TimeoutExpired:
            row.update(pass_check=False, error='timeout')
        except OSError as error:
            row.update(pass_check=False, error=str(error))
        row['elapsed_seconds'] = round(time.monotonic() - started, 3)
        receipt['checks'].append(row)
        receipt['sources_after'] = fingerprints(sources)
        receipt['sources_unchanged'] = receipt['sources_after'] == receipt['sources_before']
        save()
        if not row['pass_check'] or not receipt['sources_unchanged']:
            print('VERIFICATION_FAIL: ' + row['name'] + '; see ' + str(receipt_path))
            for stream in ['stdout', 'stderr']:
                if row.get(stream):
                    print('[' + row['name'] + ' ' + stream + ']', file=sys.stderr)
                    print(row[stream], file=sys.stderr, end='' if row[stream].endswith('\n') else '\n')
            if row.get('error'):
                print(row['error'], file=sys.stderr)
            if not receipt['sources_unchanged']:
                print('Source files changed during verification', file=sys.stderr)
            return 1
    receipt['pass'] = True
    save()
    print('VERIFICATION_PASS: ' + str(len(checks)) + ' checks; source hashes recorded in ' + str(receipt_path))
    return 0

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('config', help='JSON with sources and checks [{name, argv, timeout_seconds}]')
    parser.add_argument('--receipt', required=True)
    args = parser.parse_args()
    try:
        return verify(args.config, args.receipt)
    except (OSError, ValueError, KeyError, TypeError) as error:
        print('verify-task: ' + str(error), file=sys.stderr)
        return 2

if __name__ == '__main__':
    raise SystemExit(main())
