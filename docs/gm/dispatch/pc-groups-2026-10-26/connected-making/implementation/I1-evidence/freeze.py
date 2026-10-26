from pathlib import Path
import shutil,hashlib,json,subprocess
repo=Path.cwd(); snap=Path('/Users/weiwei/.codex/research/g1-i1-making-2026-10-26/input'); out=snap.parent/'build'
assert not snap.exists(), 'Do not overwrite frozen input'
snap.mkdir(parents=True)
for name in ['src','scripts','tests','styles','stories','locales','resources','assets']:
 if (repo/name).exists():shutil.copytree(repo/name,snap/name)
for name in ['index.html','style.css','build.js','package.json','package-lock.json','LICENSE']:
 if (repo/name).exists():shutil.copy2(repo/name,snap/name)
for name in ['docs/gm/feature-wave/ink','docs/architecture','docs/rules']:
 if (repo/name).exists():shutil.copytree(repo/name,snap/name,dirs_exist_ok=True)
# Build/rules scripts may read their document register; snapshot docs without binary evidence/private material.
for p in (repo/'docs').rglob('*'):
 if p.is_file() and p.suffix in ['.md','.json'] and '/private/' not in str(p):
  dest=snap/p.relative_to(repo);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest)
(snap/'node_modules').symlink_to(repo/'node_modules')
files={str(p.relative_to(snap)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(snap.rglob('*')) if p.is_file()}
record={'snapshot':str(snap),'build':str(out),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'files':files,'scope':'Dirty current inputs copied; dependency directory shared at pinned package-lock. No private player storage or private packs.'}
(repo/'docs/gm/dispatch/pc-groups-2026-10-26/connected-making/implementation/I1-evidence/input-identity.json').write_text(json.dumps(record,indent=2)+'\n')
print(snap)
