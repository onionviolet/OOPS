"""Same Harness task through an unchanged-body loopback observation relay."""
import hashlib,http.client,http.server,json,os,selectors,signal,subprocess,tempfile,threading,time,urllib.request
from pathlib import Path
base=Path(__file__).resolve().parent
prior=base.parent/'real-task'
scratch=Path(tempfile.mkdtemp(prefix='yair-fresh-lanes-fix-'))
repo=base.parents[3]
inputs=['scripts/lanes/lanes.py','scripts/lanes/tests/test_lanes.py']
manifest={}
for relative in inputs:
    data=(repo/relative).read_bytes();target=scratch/relative;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
    frozen=base/'before'/relative;frozen.parent.mkdir(parents=True,exist_ok=True);frozen.write_bytes(data)
    manifest[relative]=hashlib.sha256(data).hexdigest()
(base/'input-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
raw=(scratch/'scripts/lanes/lanes.py').read_bytes()
(scratch/'AGENTS.md').write_text('Work only in this isolated workspace. Only edit scripts/lanes/lanes.py and scripts/lanes/tests/test_lanes.py. Preserve all existing tests. acceptance.py and task-checks.json are read-only. Never launch real agents or signal real processes; mock process operations in tests. No network, installs, delegation or Git actions outside temporary test fixtures.\n')
(scratch/'acceptance.py').write_bytes((base/'acceptance.py').read_bytes())
checks={'sources':['scripts/lanes/lanes.py','scripts/lanes/tests/test_lanes.py'],'checks':[{'name':'focused lane suite','argv':['python3','-m','unittest','discover','-s','scripts/lanes/tests','-p','test_*.py','-v'],'timeout_seconds':90},{'name':'independent acceptance','argv':['python3','acceptance.py'],'timeout_seconds':60}]}
(scratch/'task-checks.json').write_text(json.dumps(checks,indent=2)+'\n')
prompt="""Use the local-scripts skill to fix a NEW small real defect in scripts/lanes/lanes.py. _alive accepts invalid receipt PIDs such as 0, negative integers and booleans, calls os.kill on them and may mark them running. This can make status misleading or block a new launch from an invalid receipt. Require a positive integer PID, excluding booleans, before any OS signal/liveness call. Preserve valid PID behavior, including ProcessLookupError and PermissionError handling. Keep the change small and add meaningful regression tests to scripts/lanes/tests/test_lanes.py without changing existing tests. Only those two files may be edited. Fixed acceptance.py and task-checks.json must remain unchanged. All process/signal operations for new cases must be mocked; never launch real agents or signal real processes.
First load local-scripts, then batch-read the applicable AGENTS.md, owning source, tests and fixed check configuration. The baseline existing six tests pass; the independent acceptance checker reproduces the invalid-PID defect. Use that checker if you need a reproduction rather than inventing extra fixtures. Implement, add the regression, then run python3 /Users/weiwei/.dsh/skills/local-scripts/scripts/verify_task.py task-checks.json --receipt verification-receipt.json. It runs the focused suite and independent acceptance and reports their exact statuses. After its next_action final_answer packet, immediately give a normal final answer under 120 words with paths and check results. No post-pass cleanup or rereads. Fix test failures yourself within this single task; no external repair prompts will be sent. Use at most 10 model responses and 8 minutes including verification and final. No delegation, alternate model or additional tasks."""
(base/'prompt.txt').write_text(prompt+'\n')
lock=threading.Lock();records=[]
class Relay(http.server.BaseHTTPRequestHandler):
    protocol_version='HTTP/1.1'
    def log_message(self,*args):pass
    def do_POST(self):
        body=self.rfile.read(int(self.headers['Content-Length']));req=json.loads(body);started=time.monotonic()
        row={'index':len(records)+1,'path':self.path,'body_sha256':hashlib.sha256(body).hexdigest(),'forwarded_without_body_changes':True,'model':req.get('model'),'reasoning_effort':req.get('reasoning_effort'),'enable_thinking':req.get('enable_thinking'),'max_tokens':req.get('max_tokens'),'stream':req.get('stream'),'message_count':len(req.get('messages',[])),'tool_count':len(req.get('tools',[])),'request_bytes':len(body),'finish_policy_in_system':any(m.get('role')=='system' and 'your next response is a concise final answer' in str(m.get('content')) for m in req.get('messages',[])),'reasoning_chars':0,'content_chars':0,'think_tags':False,'finish_reasons':[]}
        with lock:records.append(row)
        conn=http.client.HTTPConnection('127.0.0.1',11434,timeout=300)
        try:
            conn.request('POST',self.path,body,{'Content-Type':'application/json'})
            response=conn.getresponse();row['status']=response.status
            self.send_response(response.status);self.send_header('Content-Type',response.getheader('Content-Type','application/json'));self.send_header('Connection','close');self.end_headers();self.close_connection=True
            def inspect(d):
                if d.get('usage'):row['usage']=d['usage']
                for choice in d.get('choices',[]):
                    v=choice.get('delta',choice.get('message',{}))
                    row['reasoning_chars']+=sum(len(v.get(k) or '') for k in ['reasoning_content','reasoning','thinking'] if isinstance(v.get(k),str))
                    c=v.get('content') or '';row['content_chars']+=len(c) if isinstance(c,str) else 0
                    if isinstance(c,str) and ('<think>' in c or '</think>' in c):row['think_tags']=True
                    if choice.get('finish_reason'):row['finish_reasons'].append(choice['finish_reason'])
            if req.get('stream'):
                while True:
                    line=response.readline()
                    if not line:break
                    if line.startswith(b'data: ') and line.strip()!=b'data: [DONE]':
                        try:inspect(json.loads(line[6:]))
                        except ValueError:row['parse_error']=True
                    self.wfile.write(line);self.wfile.flush()
            else:
                data=response.read()
                try:inspect(json.loads(data))
                except ValueError:row['parse_error']=True
                self.wfile.write(data);self.wfile.flush()
        except Exception as e:
            row['error']=str(e)
        finally:
            conn.close();row['elapsed_seconds']=round(time.monotonic()-started,3)
            with lock:(base/'wire.json').write_text(json.dumps(records,indent=2)+'\n')
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Relay);server.daemon_threads=True
threading.Thread(target=server.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{server.server_port}/v1'
try:
    effective=json.loads((base.parent/'harness-fixed/final-effective-settings.json').read_text());route=next(x['provider'] for x in effective if x['id']=='llm-pi-ai');route['baseURL']=url;route['headers']={'Authorization':'Bearer ollama-local-placeholder'}
    overlay=[{'id':'llm-pi-ai','config':{'providers':{'ollama-local':route}}}]
    overlay_path=scratch/'observe-overlay.json';overlay_path.write_text(json.dumps(overlay))
    cmd=['/Users/weiwei/.local/bin/dsh-work','--patch',str(overlay_path),'--json','--permission-mode','workspace-write','--approval-policy','never','-']
    started=time.monotonic();proc=subprocess.Popen(cmd,cwd=scratch,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,start_new_session=True)
    proc.stdin.write(prompt.encode());proc.stdin.close()
    meta={'scratch':str(scratch),'pid':proc.pid,'process_group':proc.pid,'input_sha256':hashlib.sha256(raw).hexdigest(),'prompt_sha256':hashlib.sha256(prompt.encode()).hexdigest(),'command':cmd,'wall_limit_seconds':480,'max_model_steps':10,'diagnostic_control_requests':0,'relay_url':url}
    (base/'run.json').write_text(json.dumps(meta,indent=2)+'\n')
    sel=selectors.DefaultSelector();sel.register(proc.stdout,selectors.EVENT_READ,'stdout');sel.register(proc.stderr,selectors.EVENT_READ,'stderr');pending=b'';steps=0;stopped=None;stop_at=None
    with (base/'events.jsonl').open('wb') as out,(base/'stderr.log').open('wb') as err:
        while sel.get_map():
            if time.monotonic()-started>480 and stopped is None:stopped='wall_limit';stop_at=time.monotonic();os.killpg(proc.pid,signal.SIGTERM)
            if stop_at and time.monotonic()-stop_at>10 and proc.poll() is None:os.killpg(proc.pid,signal.SIGKILL)
            for key,_ in sel.select(timeout=1):
                chunk=os.read(key.fileobj.fileno(),65536)
                if not chunk:sel.unregister(key.fileobj);continue
                dest=out if key.data=='stdout' else err;dest.write(chunk);dest.flush()
                if key.data=='stdout':
                    pending+=chunk
                    while b'\n' in pending:
                        line,pending=pending.split(b'\n',1)
                        try:event=json.loads(line)
                        except ValueError:continue
                        if event.get('type')=='status' and event.get('phase')=='step_start':
                            steps+=1;print(json.dumps({'step':steps,'elapsed':round(time.monotonic()-started,1)}),flush=True)
                            if steps>10 and stopped is None:stopped='step_limit';stop_at=time.monotonic();os.killpg(proc.pid,signal.SIGTERM)
    proc.wait();time.sleep(0.2)
    for name in ['scripts/lanes/lanes.py','scripts/lanes/tests/test_lanes.py','acceptance-results.json','verification-receipt.json','task-checks.json']:
        p=scratch/name
        if p.exists():
            target=base/'after'/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(p.read_bytes())
    meta.update(exit_code=proc.returncode,elapsed_seconds=round(time.monotonic()-started,3),steps_started=steps,stopped=stopped,acceptance_checker_unchanged=(scratch/'acceptance.py').read_bytes()==(base/'acceptance.py').read_bytes(),check_config_unchanged=json.loads((scratch/'task-checks.json').read_text())==checks)
    task_records=records;meta['wire_task_requests']=len(task_records);meta['verified_off']=bool(task_records) and all(r.get('reasoning_effort')=='none' and r['reasoning_chars']==0 and not r['think_tags'] and not r.get('parse_error') and not r.get('error') and r.get('status')==200 for r in task_records)
    (base/'run.json').write_text(json.dumps(meta,indent=2)+'\n');print(json.dumps(meta),flush=True)
finally:server.shutdown();server.server_close()
