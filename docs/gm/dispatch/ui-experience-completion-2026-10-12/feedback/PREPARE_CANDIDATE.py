"""Reproduce filtered foundation inputs in a NEW disposable destination.
Then apply FEEDBACK.patch with patch -p1 and run node build.js.
Does not copy personal evidence saves, private packs or source-library prose.
"""
from pathlib import Path
import argparse,hashlib,json,shutil
parser=argparse.ArgumentParser();parser.add_argument('destination');args=parser.parse_args()
base=Path('/Users/weiwei/.codex/candidates/yairpg-customization-2026-10-12');target=Path(args.destination)
manifest_path=Path('/Users/weiwei/code/yet-another-idle-rpg/docs/gm/dispatch/cheats-sfx-implementation-2026-10-12/FOUNDATION_MANIFEST.json')
manifest=json.loads(manifest_path.read_text())
for path,digest in manifest['files'].items():
 assert hashlib.sha256((base/path).read_bytes()).hexdigest()==digest,path
assert not target.exists(),'Destination must not exist; preserve existing work.'
target.mkdir(parents=True)
for name in ['src','styles','assets','resources','locales','workers','stories','scripts','docs']:
 shutil.copytree(base/name,target/name,ignore=shutil.ignore_patterns('private_packs','novels','*.epub','*.pdf','*.txt'))
for name in ['AGENTS.md','LICENSE','build.js','package.json','package-lock.json','index.html','style.css','help.html','changelog.html','favicon.ico']:
 shutil.copy2(base/name,target/name)
(target/'dist').mkdir();(target/'node_modules').symlink_to(base/'node_modules',target_is_directory=True)
(target/'FOUNDATION_MANIFEST.json').write_text(json.dumps(manifest,indent=2))
print('Filtered foundation inputs verified and copied:',target)
