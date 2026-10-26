"""Review and test the frozen Harness candidate without changing its code."""
import ast
import difflib
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile

base=Path(__file__).resolve().parent
repo=base.parents[3]
sources=['scripts/lanes/lanes.py','scripts/lanes/tests/test_lanes.py']
def methods(path):
    return {n.name:ast.dump(n,include_attributes=False) for n in ast.walk(ast.parse(path.read_text())) if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef))}
old=methods(base/'before'/sources[1]);new=methods(base/'after'/sources[1])
assert all(new.get(k)==v for k,v in old.items())
added=sorted(set(new)-set(old));assert len(added)==4
receipt=json.loads((base/'after/verification-receipt.json').read_text())
assert receipt['pass'] and len(receipt['checks'])==2 and all(c['exit_code']==0 for c in receipt['checks'])
for p in sources:assert receipt['sources_after'][p]==hashlib.sha256((base/'after'/p).read_bytes()).hexdigest()
cases=[]
for phase in ['before','after']:
    with tempfile.TemporaryDirectory(prefix='lanes-independent-') as td:
        root=Path(td)
        for p in sources:
            # Test the NEW regressions against OLD implementation, not old tests.
            selected='before' if phase=='before' and p==sources[0] else 'after'
            src=base/selected/p
            target=root/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(src.read_bytes())
        (root/'acceptance.py').write_bytes((base/'acceptance.py').read_bytes())
        tests=subprocess.run([sys.executable,'-m','unittest','discover','-s','scripts/lanes/tests','-p','test_*.py','-v'],cwd=root,capture_output=True,text=True,timeout=30)
        if phase=='before':assert tests.returncode!=0 and 'FAIL' in tests.stderr
        else:assert tests.returncode==0 and 'Ran 10 tests' in tests.stderr,tests.stderr
        row={'phase':phase,'test_exit_code':tests.returncode,'stderr':tests.stderr}
        if phase=='after':
            check=subprocess.run([sys.executable,'acceptance.py'],cwd=root,capture_output=True,text=True,timeout=15)
            assert check.returncode==0,check.stderr
            row.update(acceptance_exit_code=check.returncode,acceptance=json.loads((root/'acceptance-results.json').read_text()))
        cases.append(row)
(base/'independent-checks.json').write_text(json.dumps({'original_tests_unchanged':True,'new_regressions':added,'verification_source_hashes_match':True,'cases':cases},indent=2)+'\n')
patch=''.join(''.join(difflib.unified_diff((base/'before'/p).read_text().splitlines(True),(base/'after'/p).read_text().splitlines(True),fromfile='a/'+p,tofile='b/'+p)) for p in sources)
(base/'accepted.patch').write_text(patch)
manifest=json.loads((base/'input-manifest.json').read_text())
for p in sources:assert hashlib.sha256((repo/p).read_bytes()).hexdigest()==manifest[p],f'Concurrent edit: {p}'
for p in sources:(repo/p).write_bytes((base/'after'/p).read_bytes())
integration={'exact_worker_patch_applied':sources,'original_tests_unchanged':True,'new_regressions':added,'primary_code_corrections':0,'project_commit':False}
tests=subprocess.run([sys.executable,'-m','unittest','discover','-s','scripts/lanes/tests','-p','test_*.py','-v'],cwd=repo,capture_output=True,text=True,timeout=30)
assert tests.returncode==0 and 'Ran 10 tests' in tests.stderr,tests.stderr
integration['integrated_tests']={'exit_code':tests.returncode,'stderr':tests.stderr}
(base/'integration.json').write_text(json.dumps(integration,indent=2)+'\n')
events=[json.loads(x) for x in (base/'events.jsonl').read_text().splitlines()]
final=next(x for x in events if x.get('type')=='final')
assert final['reason']['kind']=='completed'
(base/'final-answer.txt').write_text(final['text']+'\n')
print('Independent and integrated checks: 10/10 pass; new tests reject old source; fixed acceptance passes; original tests unchanged; exact Harness patch applied.')
