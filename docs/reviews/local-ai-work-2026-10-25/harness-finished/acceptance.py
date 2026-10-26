"""Fixed acceptance checker for a registry inventory CLI; do not modify during trial."""
import argparse,collections,hashlib,json,subprocess,sys,tempfile
from pathlib import Path

def expected(rows):
    groups={}
    for row in rows:groups.setdefault(row['kind'],[]).append(row['id'])
    launches=[row for row in rows if row['kind']=='launch']
    refs=[x for row in launches for x in row.get('required',[])]
    return {'total_tools':len(rows),'counts_by_kind':dict(collections.Counter(row['kind'] for row in rows)),
            'ids_by_kind':{k:sorted(v) for k,v in groups.items()},
            'launch_probe_ids':sorted(row['id'] for row in launches if row.get('probe')),
            'launch_without_probe_ids':sorted(row['id'] for row in launches if not row.get('probe')),
            'missing_owner_ids':sorted(row['id'] for row in rows if not row.get('owner')),
            'duplicate_ids':sorted(k for k,v in collections.Counter(row['id'] for row in rows).items() if v>1),
            'required_path_references':len(refs),'unique_required_paths':len(set(refs))}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.parse_args()
    before=Path('registry.json').read_bytes();rows=json.loads(before)['tools']
    observed=json.loads(Path('inventory.json').read_text())
    assert observed==expected(rows),'Real registry output differs from independent calculation'
    markdown=Path('inventory.md').read_text().lower()
    assert str(len(rows)) in markdown and 'probe' in markdown and 'not' in markdown and 'install' in markdown and 'execut' in markdown,'Missing markdown summary/evidence caveat'
    cases={'empty':[],'duplicates_and_optional':[{'id':'z','kind':'launch','required':['{x}/a','{x}/a']},{'id':'a','kind':'reference','owner':''},{'id':'z','kind':'launch','required':['{x}/a','{x}/b'],'probe':None,'owner':None},{'id':'b','kind':'launch','probe':[]},{'id':'c','kind':'launch','probe':['--version'],'owner':'docs/X.md'}]}
    results={'real':True,'markdown':True}
    with tempfile.TemporaryDirectory(dir='.',prefix='acceptance-') as td:
        folder=Path(td)
        for name,data in cases.items():
            ip=folder/(name+'.json');jp=folder/(name+'-out.json');mp=folder/(name+'.md')
            ip.write_text(json.dumps({'schema_version':1,'tools':data}));raw=ip.read_bytes()
            r=subprocess.run([sys.executable,'summarize_registry.py',str(ip),'--json',str(jp),'--markdown',str(mp)],capture_output=True,text=True,timeout=10)
            assert r.returncode==0,(name,r.stderr)
            assert json.loads(jp.read_text())==expected(data),(name,'wrong output')
            assert ip.read_bytes()==raw,(name,'input changed')
            results[name]=True
    assert Path('registry.json').read_bytes()==before,'Registry changed during verification'
    results['input_unchanged']=True;results['pass']=True
    Path('acceptance-results.json').write_text(json.dumps(results,indent=2)+'\n')
    print('ACCEPTANCE PASS: real output, markdown caveat, empty input, duplicate/optional-field input, inputs unchanged')

if __name__=='__main__':main()
