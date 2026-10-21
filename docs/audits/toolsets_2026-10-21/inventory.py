"""Read-only local inventory; writes only this audit's evidence file."""
import hashlib
import json
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path

HOME = Path('/Users/weiwei')
ROOT = Path(__file__).resolve().parents[3]
CHECKS = [
    ROOT / 'package.json',
    ROOT / 'scripts/headless/README.md',
    ROOT / 'scripts/playtest/README.md',
    ROOT / 'scripts/simfuzz/README.md',
    ROOT / 'scripts/replay/README.md',
    HOME / 'code/discord-reference-workbench/README.md',
    HOME / 'code/discord-reference-workbench/docs/LOCAL_COLLECTOR.md',
    HOME / 'code/discord-reference-workbench/data/catalog/corc-2026-10-20/catalog.json',
    HOME / '.codex/research/hogwarts-legacy/repos/rea-pinned/package.json',
    HOME / '.codex/research/hogwarts-legacy/repos/rea-pinned/src/ghidra/GhidraLauncher.ts',
    HOME / 'code/rea/package.json',
    HOME / 'code/lncrawl-polite/README_POLITE.md',
    HOME / 'code/zlibrary-research/docs/YAIRPG.md',
]
PROBES = [
    ('discord-help', HOME / 'code/discord-reference-workbench', ['python3', '-m', 'discord_reference', '--help']),
    ('rea-version', HOME / '.codex/research/hogwarts-legacy/repos/rea-pinned', ['node', 'scripts/rea.mjs', '--version']),
    ('dotnet-version', ROOT, [str(HOME / '.dotnet/dotnet'), '--version']),
    ('unitypy-version', ROOT, [str(HOME / '.codex/research/immortal-life/tools/venv/bin/python'), '-c', 'import UnityPy; print(UnityPy.__version__)']),
]

def main():
    result = {'captured_at_utc': datetime.now(timezone.utc).isoformat(),
              'game_head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
              'source_sha256': {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in CHECKS if p.is_file()},
              'path_lookup': {n: shutil.which(n) for n in ['rea', 'dotnet', 'ilspycmd', 'ghidra', 'strings', 'otool', 'objdump', 'jadx', 'apktool', 'r2', 'rizin', 'frida', 'ffmpeg', 'pdftotext', 'tesseract', 'gh', 'wine']},
              'probes': []}
    for label, cwd, args in PROBES:
        run = subprocess.run(args, cwd=cwd, capture_output=True, text=True, timeout=20)
        result['probes'].append({'id': label, 'cwd': str(cwd), 'argv': args, 'exit_code': run.returncode, 'stdout': run.stdout, 'stderr': run.stderr})
    p = Path(__file__).with_name('LOCAL_INVENTORY.json')
    p.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({'output': str(p), 'source_files_hashed': len(result['source_sha256']), 'probes': [(v['id'], v['exit_code']) for v in result['probes']]}))

if __name__ == '__main__':
    main()
