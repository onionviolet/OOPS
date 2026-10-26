"""Fixed independent behavioral checks for valid PID liveness classification."""
import argparse
from contextlib import redirect_stdout
from io import StringIO
import importlib.util
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
from unittest.mock import patch

def main():
    argparse.ArgumentParser(description=__doc__).parse_args()
    spec=importlib.util.spec_from_file_location('lanes_acceptance',Path('scripts/lanes/lanes.py'))
    lanes=importlib.util.module_from_spec(spec);spec.loader.exec_module(lanes)
    invalid=[None,0,-1,-127,True,False,'123',1.5,[],{}]
    for value in invalid:
        with patch.object(lanes.os,'kill',return_value=None) as kill:
            assert lanes._alive(value) is False,('invalid PID marked alive',value)
            kill.assert_not_called()
    for outcome,expected in [(None,True),(ProcessLookupError(),False),(PermissionError(),True)]:
        with patch.object(lanes.os,'kill',side_effect=outcome) as kill:
            assert lanes._alive(32145) is expected
            kill.assert_called_once_with(32145,0)
    with tempfile.TemporaryDirectory(dir='.',prefix='pid-receipts-') as td:
        folder=Path(td)
        for pid in [0,-1,True]:
            (folder/'job.pid.json').write_text(json.dumps({'name':'job','pid':pid,'last_message':str(folder/'job.last.md'),'log':str(folder/'job.log')}))
            output=StringIO()
            with patch.object(lanes.os,'kill',return_value=None) as kill,redirect_stdout(output):
                assert lanes.status(SimpleNamespace(runs=str(folder),name='job'))==0
            assert json.loads(output.getvalue())[0]['status']=='exited'
            kill.assert_not_called()
        prompt=folder/'prompt.md';prompt.write_text('synthetic fixture only')
        work=folder/'workspace';work.mkdir()
        args=SimpleNamespace(runs=str(folder),prompt=str(prompt),workdir=str(work),binary='/synthetic/codex',name='job',resume=None,model='fixture',effort='low',approve_for_me=False,add_dir=[])
        output=StringIO()
        # The last invalid receipt above must not block launching a new fixture process.
        with patch.object(lanes.os,'kill',return_value=None) as kill,patch.object(lanes.subprocess,'Popen',return_value=SimpleNamespace(pid=32145)) as popen,redirect_stdout(output):
            assert lanes.launch(args)==0
            assert popen.call_count==1
            kill.assert_not_called()
        assert json.loads((folder/'job.pid.json').read_text())['pid']==32145
    Path('acceptance-results.json').write_text(json.dumps({'pass':True,'invalid_pid_cases':len(invalid),'valid_liveness_cases':3,'status_invalid_receipt_cases':3,'launch_invalid_receipt_case':True,'all_os_signals_and_launches_mocked':True},indent=2)+'\n')
    print('ACCEPTANCE PASS: invalid PIDs never reach OS calls; valid outcomes, status and replacement launch preserved')
if __name__=='__main__':main()
