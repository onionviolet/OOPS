"""Losslessly compact native exports after browser checks; never packs profiles."""
from pathlib import Path
import hashlib,json,tarfile,gzip
owner=Path(__file__).resolve().parent
evidence=owner/'evidence'
files=sorted(evidence.glob('*.txt'))
if files:
    manifest=[{'file':f.name,'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in files]
    with tarfile.open(evidence/'NATIVE-EXPORTS.tar.xz','w:xz') as archive:
        for f in files:archive.add(f,arcname=f.name)
    with tarfile.open(evidence/'NATIVE-EXPORTS.tar.xz','r:xz') as archive:
        for row in manifest:assert hashlib.sha256(archive.extractfile(row['file']).read()).hexdigest()==row['sha256']
    (evidence/'NATIVE-EXPORTS-MANIFEST.json').write_text(json.dumps(manifest,indent=1)+'\n')
    for f in files:f.unlink()
binding=evidence/'FINAL-BINDINGS.json'
if binding.exists():
    original=binding.read_bytes();data=json.loads(original)
    if 'loaded' in data:
        (evidence/'FINAL-BINDINGS.trace.json.gz').write_bytes(gzip.compress(original,mtime=0))
        bad=[dict(v,index=i) for i,v in enumerate(data['loaded']) if v['loaded']!=v['disk']]
        summary={k:v for k,v in data.items() if k!='loaded'}
        summary.update({'loads':len(data['loaded']),'matchingLoads':len(data['loaded'])-len(bad),'mismatches':bad,'final':data['loaded'][-1],'traceSha256':hashlib.sha256(original).hexdigest()})
        binding.write_text(json.dumps(summary,indent=1)+'\n')
print('Native export archive verified; no file over 2 MB:',all(f.stat().st_size<2_000_000 for f in owner.rglob('*') if f.is_file()))
