from pathlib import Path
import tempfile,json,hashlib,re,subprocess
r=Path.cwd();base=Path('/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/L5');d=Path(tempfile.mkdtemp(prefix='s3-source-',dir=base));paths=set()
for folder in ['src','scripts','styles','resources','assets','locales','stories','docs/gm/feature-wave/ink']:
 paths.update(p for p in (r/folder).rglob('*') if p.is_file() and '__pycache__' not in str(p))
for p in list((r/'src').rglob('*.js')):
 for target in re.findall(r'''(?:from\s+|import\s*)['"]([^'"]+)['"]''',p.read_text()):
  if target.startswith('.'):
   q=(p.parent/target).resolve()
   if q.is_file() and q.is_relative_to(r):paths.add(q)
paths.update(r/p for p in ['build.js','package.json','package-lock.json','index.html','style.css','LICENSE','tests/cultivation_formulation.test.js'])
contents={str(p.relative_to(r)):p.read_bytes() for p in paths};m={p:hashlib.sha256(b).hexdigest() for p,b in contents.items()}
for p,b in contents.items():
 q=d/p;q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(b)
changed=[p for p,h in m.items() if hashlib.sha256((r/p).read_bytes()).hexdigest()!=h]
if changed:raise RuntimeError('Primary changed during capture: '+str(changed))
(d/'node_modules').symlink_to(r/'node_modules',target_is_directory=True)
(d/'inputs.json').write_text(json.dumps(m,indent=2))
config={'source':str(d),'output':str(d)+'-build','manifestSha256':hashlib.sha256((d/'inputs.json').read_bytes()).hexdigest(),'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'count':len(m)}
Path('docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/evidence/L5/S3/capture.json').write_text(json.dumps(config,indent=2))
print(json.dumps(config))
