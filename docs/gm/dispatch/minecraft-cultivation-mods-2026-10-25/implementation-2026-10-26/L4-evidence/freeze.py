from pathlib import Path
import shutil,hashlib,json,sys
root=Path.cwd();tag=sys.argv[1];dest=Path('/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26')/('L4-'+tag)
items=['locales','docs/gm/book-world-player-agency/contracts','stories','src','scripts','tests','resources','assets','private_packs','styles','style.css','index.html','build.js','package.json','package-lock.json','LICENSE','docs/gm/feature-wave/ink']
files=sorted(p for item in items for p in ([root/item] if (root/item).is_file() else (root/item).rglob('*')) if p.is_file())
manifest={str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
assert not dest.exists(),'Snapshot already exists, retained'
for p in files:
 out=dest/p.relative_to(root);out.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,out)
post={str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
assert manifest==post,'Inputs moved during capture; this snapshot is unverified'
assert all(hashlib.sha256((dest/p).read_bytes()).hexdigest()==h for p,h in manifest.items())
(dest/'node_modules').symlink_to(root/'node_modules',target_is_directory=True)
record={'root':str(dest),'inputs':manifest,'digest':hashlib.sha256(json.dumps(manifest,sort_keys=True).encode()).hexdigest()}
(dest/'input-manifest.json').write_text(json.dumps(record,indent=2)+'\n');Path(__file__).with_name(tag+'-manifest.json').write_text(json.dumps(record,indent=2)+'\n');print(dest,record['digest'],len(manifest))
