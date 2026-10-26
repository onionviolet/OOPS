from pathlib import Path
import tempfile, shutil, hashlib, json, subprocess, re
repo=Path.cwd()
out=repo/'docs/gm/dispatch/pc-groups-2026-10-26/connected-making/evidence'
snap=Path(tempfile.mkdtemp(prefix='yairpg-g1-making-'))
shutil.copytree(repo/'src',snap/'src')
(snap/'tests').mkdir()
for p in (repo/'tests').glob('*.js'): shutil.copy2(p,snap/'tests'/p.name)
shutil.copy2(repo/'package.json',snap/'package.json')
# Existing runtime dependency and static JSON imports needed by the engine fixtures.
shutil.copytree(repo/'node_modules/inkjs',snap/'node_modules/inkjs')
for source in (repo/'src').rglob('*.js'):
    for rel in re.findall(r"from\s+['\"](\.\./[^'\"]+\.json)['\"]", source.read_text()):
        origin=(source.parent/rel).resolve()
        if origin.exists():
            target=snap/origin.relative_to(repo)
            target.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(origin,target)
files={str(p.relative_to(snap)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(snap.rglob('*')) if p.is_file()}
identity={'snapshot':str(snap),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'note':'Dirty source and JS test input snapshot. No build, private saves or browser evidence. Snapshot files hashed after copy; drift checked after tests.','files':files}
(out/'input-identity.json').write_text(json.dumps(identity,indent=2)+'\n')
print(snap)
