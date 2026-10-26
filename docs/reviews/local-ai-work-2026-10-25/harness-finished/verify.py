"""Independent acceptance checks; does not modify the local model's artifacts."""
import collections,hashlib,json,subprocess,sys,tempfile,time
from pathlib import Path
base=Path(__file__).resolve().parent
repo=base.parents[3]

def oracle(data):
    rows=data['tools']; groups=collections.defaultdict(list)
    for r in rows:groups[r['kind']].append(r['id'])
    launch=[r for r in rows if r['kind']=='launch']
    paths=[s for r in launch for s in r.get('required',[])]
    return {'total_tools':len(rows),'counts_by_kind':dict(collections.Counter(r['kind'] for r in rows)),
            'ids_by_kind':{k:sorted(v) for k,v in groups.items()},
            'launch_probe_ids':sorted(r['id'] for r in launch if r.get('probe')),
            'launch_without_probe_ids':sorted(r['id'] for r in launch if not r.get('probe')),
            'missing_owner_ids':sorted(r['id'] for r in rows if not r.get('owner')),
            'duplicate_ids':sorted(k for k,v in collections.Counter(r['id'] for r in rows).items() if v>1),
            'required_path_references':len(paths),'unique_required_paths':len(set(paths))}
started=time.monotonic()
run=json.loads((base/'run.json').read_text())
original=repo/'scripts/toolsets/registry.json'
frozen=json.loads((base/'registry-snapshot.json').read_text())
expected=oracle(frozen)
(base/'expected.json').write_text(json.dumps(expected,indent=2)+'\n')
results=[]
def record(name,passed,detail):results.append({'check':name,'pass':bool(passed),'detail':detail})
record('frozen_input_unchanged',hashlib.sha256((base/'registry-snapshot.json').read_bytes()).hexdigest()==run['input_sha256'],'SHA256 matches pre-dispatch capture')
record('owning_registry_unchanged',hashlib.sha256(original.read_bytes()).hexdigest()==run['input_sha256'],'Current owning source matches captured bytes')
actual=json.loads((base/'inventory.json').read_text())
for k,v in expected.items():record('real.'+k,actual.get(k)==v,{'expected':v,'actual':actual.get(k)})
record('exact_schema',set(actual)==set(expected),'No missing/extra top-level keys')
markdown=(base/'inventory.md').read_text()
record('markdown_evidence_boundary',any(s in markdown.lower() for s in ['not installation','not installed','does not indicate','not evidence','not proof','does not imply','does not guarantee']), 'Manual review still needed for exact wording')
variants={'empty':{'schema_version':1,'tools':[]},
 'optional_and_duplicate':{'schema_version':1,'tools':[{'id':'z','kind':'launch','required':['{x}/a','{x}/a']},{'id':'a','kind':'reference','owner':''},{'id':'z','kind':'launch','required':['{x}/a','{x}/b'],'probe':None,'owner':None},{'id':'b','kind':'launch','probe':[]},{'id':'c','kind':'launch','probe':['--version'],'owner':'docs/X.md'}]}}
with tempfile.TemporaryDirectory(prefix='yair-inventory-verification-') as td:
    folder=Path(td)
    for name,data in variants.items():
        ip=folder/(name+'.json');jp=folder/(name+'-out.json');mp=folder/(name+'.md')
        ip.write_text(json.dumps(data));before=ip.read_bytes()
        p=subprocess.run([sys.executable,str(base/'summarize_registry.py'),str(ip),'--json',str(jp),'--markdown',str(mp)],capture_output=True,text=True,timeout=10)
        got=json.loads(jp.read_text()) if jp.exists() else None
        record(name,p.returncode==0 and got==oracle(data) and ip.read_bytes()==before,{'exit_code':p.returncode,'stderr':p.stderr,'output':got})
result={'elapsed_seconds':round(time.monotonic()-started,3),'checks':results,'passed':sum(r['pass'] for r in results),'total':len(results)}
(base/'verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'passed':result['passed'],'total':result['total'],'elapsed_seconds':result['elapsed_seconds']}))
for r in results:
    if not r['pass']:print(json.dumps(r))
