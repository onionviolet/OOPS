#!/usr/bin/env python3
"""Discover and launch existing YAIR research tools without installing them."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

REPO = Path(__file__).resolve().parents[1]
REGISTRY = REPO / 'scripts/toolsets/registry.json'


def load_registry():
    data = json.loads(REGISTRY.read_text())
    if data['schema_version'] != 1:
        raise ValueError('Unsupported tool registry schema')
    rows = data['tools']
    ids = [row['id'] for row in rows]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate tool registry ID')
    return {row['id']: row for row in rows}


def roots(env):
    home = env.get('YAIR_TOOLS_HOME', str(Path.home()))
    research = env.get('YAIR_TOOLS_RESEARCH', home + '/.codex/research')
    return {
        'home': home, 'repo': str(REPO),
        'code': env.get('YAIR_TOOLS_CODE', home + '/code'),
        'research': research,
        'rea': env.get('YAIR_REA_ROOT', env.get('YAIR_TOOLS_CODE', home + '/code') + '/rea'),
        'rea_pinned': env.get('YAIR_REA_PINNED_ROOT', research + '/hogwarts-legacy/repos/rea-pinned'),
        'ghidra': env.get('GHIDRA_INSTALL_DIR', '/opt/homebrew/opt/ghidra/libexec'),
        'java': env.get('JAVA_HOME', '/opt/homebrew/opt/openjdk@21'),
        'dotnet': env.get('DOTNET_ROOT', home + '/.dotnet'),
        'unity': env.get('YAIR_UNITY_VENV', research + '/immortal-life/tools/venv'),
        'cpp2il': env.get('YAIR_CPP2IL_ROOT', home + '/.local/share/yair-tools/cpp2il/2022.1.0-pre-release.21'),
        'calibre': env.get('YAIR_CALIBRE_APP', '/Applications/calibre.app'),
        'python': sys.executable,
    }


def plan(row, env):
    if row['kind'] != 'launch':
        raise ValueError(f"{row['id']} is a reference route. Read {row['owner']}")
    values = roots(env)
    expand = lambda value: value.format_map(values)
    child_env = dict(env)
    effective = {}
    for key, template in row.get('env', {}).items():
        value = expand(template)
        if key in row.get('prepend_env', []):
            value += os.pathsep + env[key] if env.get(key) else ''
            child_env[key] = value
        else:
            child_env.setdefault(key, value)
        effective[key] = child_env[key]
    argv = [expand(arg) for arg in row['argv']]
    required = [expand(arg) for arg in row['required']]
    missing = [p for p in required if not Path(p).exists()]
    executable = shutil.which(argv[0], path=child_env.get('PATH', os.defpath))
    if executable is None:
        missing.append('executable: ' + argv[0])
    return {'id': row['id'], 'argv': argv, 'tool_root': expand(row['root']),
            'cwd': os.getcwd(), 'env_overrides': effective,
            'missing': missing, 'ready': not missing}, child_env


def diagnose(row, env, probe=False):
    if row['kind'] != 'launch':
        return {'id': row['id'], 'state': 'reference', 'owner': row['owner']}
    resolved, child_env = plan(row, env)
    state = 'present' if resolved['ready'] else 'missing'
    result = {**resolved, 'state': state}
    if probe and resolved['ready'] and row.get('probe'):
        command = resolved['argv'] + row['probe']
        # Registry probes are finite, offline help/version/import/health checks.
        try:
            run = subprocess.run(command, env=child_env, capture_output=True,
                                 text=True, encoding='utf-8', errors='replace', timeout=20)
            result.update(state='probe-passed' if run.returncode == 0 else 'probe-failed',
                          exit_code=run.returncode,
                          stdout=run.stdout[-16000:], stderr=run.stderr[-4000:])
        except subprocess.TimeoutExpired:
            result.update(state='probe-timeout')
        except OSError as error:
            result.update(state='probe-failed', error=str(error))
    elif probe and resolved['ready']:
        result['note'] = 'Presence only; no offline probe defined. No target was launched.'
    return result


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    subs = parser.add_subparsers(dest='action', required=True)
    listing = subs.add_parser('list', help='List launch and reference routes')
    listing.add_argument('--json', action='store_true')
    show = subs.add_parser('show', help='Inspect one route without launching it')
    show.add_argument('id')
    doctor = subs.add_parser('doctor', help='Check paths; --probe runs offline probes only')
    doctor.add_argument('ids', nargs='*')
    doctor.add_argument('--probe', action='store_true')
    run = subs.add_parser('run', help='Launch exactly one tool, preserving caller cwd and arguments')
    run.add_argument('id')
    run.add_argument('args', nargs=argparse.REMAINDER)
    args = parser.parse_args(argv)
    try:
        registry = load_registry()
        if args.action == 'list':
            if args.json:
                print(json.dumps(list(registry.values()), indent=2))
            else:
                for row in registry.values():
                    print(f"{row['id']:20} {row['kind']:9} {row['title']}")
            return 0
        if args.action == 'doctor':
            selected = args.ids or list(registry)
            unknown = [key for key in selected if key not in registry]
            if unknown:
                raise ValueError('Unknown tool ID: ' + ', '.join(unknown))
            results = [diagnose(registry[key], os.environ, args.probe) for key in selected]
            print(json.dumps(results, indent=2))
            return int(any(r['state'] in ('missing', 'probe-failed', 'probe-timeout') for r in results))
        if args.id not in registry:
            raise ValueError(f'Unknown tool ID: {args.id}. Use list.')
        row = registry[args.id]
        if args.action == 'show':
            detail = dict(row)
            if row['kind'] == 'launch':
                detail['resolved'] = plan(row, os.environ)[0]
            print(json.dumps(detail, indent=2))
            return 0
        resolved, env = plan(row, os.environ)
        if not resolved['ready']:
            raise ValueError('Tool unavailable; nothing installed or substituted. Missing: ' + ', '.join(resolved['missing']))
        forwarded = args.args[1:] if args.args[:1] == ['--'] else args.args
        # No shell, argv logging, registry writes, or temporary wrapper process.
        os.execvpe(resolved['argv'][0], resolved['argv'] + forwarded, env)
    except (ValueError, KeyError, OSError) as error:
        print(f'toolsets: {error}', file=sys.stderr)
        return 2


if __name__ == '__main__':
    sys.exit(main())
