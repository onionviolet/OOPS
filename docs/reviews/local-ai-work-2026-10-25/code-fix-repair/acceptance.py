"""Independent fixed behavioral checks for probe-output decoding; no real tool probes."""
import argparse,importlib.util,io,json,os,sys
from pathlib import Path
from unittest.mock import patch

def main():
    argparse.ArgumentParser(description=__doc__).parse_args()
    spec=importlib.util.spec_from_file_location('toolsets_acceptance',Path('scripts/toolsets.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
    cases=[]
    for exit_code in [0,7]:
        program='import os,sys; os.write(1,bytes.fromhex("76657273696f6e3a20e29c9320ff0a")); os.write(2,bytes.fromhex("7761726e696e673a20fe0a")); sys.exit('+str(exit_code)+')'
        row={'id':'fixture','kind':'launch','root':'{repo}','argv':[sys.executable,'-c'],'required':[],'env':{},'probe':[program]}
        result=m.diagnose(row,dict(os.environ),True)
        assert result['state']==('probe-passed' if exit_code==0 else 'probe-failed'),result
        assert result['exit_code']==exit_code
        assert isinstance(result['stdout'],str) and isinstance(result['stderr'],str)
        assert result['stdout'].startswith('version: ✓ ') and result['stdout'].endswith('\n'),result['stdout']
        assert result['stderr'].startswith('warning: ') and result['stderr'].endswith('\n'),result['stderr']
        json.dumps(result,ensure_ascii=False).encode('utf-8')
        out=io.StringIO()
        with patch.object(m,'load_registry',return_value={'fixture':row}),patch('sys.stdout',out):rc=m.main(['doctor','--probe','fixture'])
        report=json.loads(out.getvalue());assert rc==(0 if exit_code==0 else 1) and report[0]['exit_code']==exit_code
        cases.append({'exit_code':exit_code,'state':result['state'],'cli_exit_code':rc})
    program='import os; os.write(1,b"A"*17000+b"\\xff"); os.write(2,b"B"*5000+b"\\xfe")'
    row={'id':'long','kind':'launch','root':'{repo}','argv':[sys.executable,'-c'],'required':[],'env':{},'probe':[program]}
    result=m.diagnose(row,dict(os.environ),True)
    assert result['state']=='probe-passed' and len(result['stdout'])<=16000 and len(result['stderr'])<=4000
    record={'pass':True,'mixed_encoding_exit_cases':cases,'retained_output_limits':{'stdout':len(result['stdout']),'stderr':len(result['stderr'])}}
    Path('acceptance-results.json').write_text(json.dumps(record,indent=2)+'\n')
    print('ACCEPTANCE PASS: invalid output bytes, valid Unicode, both exit statuses, CLI JSON and retained output limits')
if __name__=='__main__':main()
