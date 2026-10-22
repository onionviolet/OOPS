from pathlib import Path
import shutil, tempfile, hashlib, json
root=Path.cwd(); dest=Path(tempfile.mkdtemp(prefix='yair-w-proof-'))
for name in ['src','scripts','styles','stories','locales']:
 shutil.copytree(root/name,dest/name,symlinks=True)
for name in ['index.html','style.css','build.js','package.json']:
 shutil.copy2(root/name,dest/name)
for name in ['node_modules','assets','fonts','images','data']:
 if (root/name).exists():(dest/name).symlink_to(root/name,target_is_directory=True)
for name in ['docs/gm/book-world-player-agency/contracts','docs/gm/feature-wave/ink','docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-host-joins/fixtures']:
 shutil.copytree(root/name,dest/name,symlinks=True)
(dest/'dist').mkdir()
inputs={str(p.relative_to(dest)):hashlib.sha256(p.read_bytes()).hexdigest() for p in (dest/'src').rglob('*.js')}
(dest/'inputs.json').write_text(json.dumps(inputs,indent=2))
print(dest)
