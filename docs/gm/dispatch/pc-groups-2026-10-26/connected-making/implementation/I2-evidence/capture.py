from pathlib import Path
import hashlib,json,shutil,tempfile
source=Path('/Users/weiwei/code/yet-another-idle-rpg')
out=source/'docs/gm/dispatch/pc-groups-2026-10-26/connected-making/implementation/I2-evidence'
target=Path(tempfile.mkdtemp(prefix='yairpg-g1-i2-source-'))
for name in ['src','styles','resources','assets','stories','locales','tests','scripts']:
 shutil.copytree(source/name,target/name)
for name in ['build.js','package.json','package-lock.json','index.html','style.css','LICENSE','docs/gm/feature-wave/ink/COMPILER.md','docs/gm/book-world-player-agency/contracts/CONTRACTS.json']:
 dest=target/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source/name,dest)
(target/'node_modules').symlink_to(source/'node_modules',target_is_directory=True)
manifest={str(p.relative_to(target)):hashlib.sha256(p.read_bytes()).hexdigest() for p in target.rglob('*') if p.is_file() and 'node_modules' not in p.parts}
(out/'candidate.json').write_text(json.dumps({'status':'source capture; refresh edited inputs and manifest before verification','root':str(target),'inputs':manifest},indent=2)+'\n')
print(target)
