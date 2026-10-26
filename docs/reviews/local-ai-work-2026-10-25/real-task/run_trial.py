"""Run one bounded local Harness job against a frozen real registry copy."""
import hashlib,json,os,selectors,signal,subprocess,tempfile,time
from pathlib import Path
repo=Path(__file__).resolve().parents[4]
evidence=Path(__file__).resolve().parent
scratch=Path(tempfile.mkdtemp(prefix='yair-local-registry-'))
source=repo/'scripts/toolsets/registry.json'
raw=source.read_bytes()
(scratch/'registry.json').write_bytes(raw)
(scratch/'AGENTS.md').write_text('Work only in this scratch workspace. Do not read parent project files, use network, launch registry tools, install packages, or change registry.json. Use Python standard library. No delegation.\n')
prompt='''Create a reusable Python standard-library CLI summarize_registry.py and run it on registry.json to write inventory.json and inventory.md. This is the real YAIRPG tool registry, copied without modification. Inspect its actual schema, but do not execute or probe any listed tool, resolve placeholders, or claim anything is installed. Leave registry.json unchanged. Only write within this working directory.
CLI: python3 summarize_registry.py INPUT --json JSON_PATH --markdown MD_PATH
The JSON must have exactly these fields: total_tools (integer), counts_by_kind (object of counts), ids_by_kind (object of sorted ID lists), launch_probe_ids (sorted IDs of launch rows with a nonempty probe list), launch_without_probe_ids (sorted IDs of launch rows with absent/null/empty probe), missing_owner_ids (sorted IDs of all rows with absent/null/empty owner), duplicate_ids (sorted unique repeated IDs), required_path_references (total length of required lists across launch rows), unique_required_paths (count of distinct raw required strings across launch rows). Markdown should give a concise human-readable summary and explicitly say probe configuration is not installation or successful execution evidence. Handle an empty tools list and absent optional fields. Use actual input data rather than hard-coded results. Verify outputs with your own checks. Return a short result and any limitations. Budget: at most 8 model responses including your final, no delegation, no retries to alternate models. Finish within 8 minutes. Prefer a small number of tool calls. Do not inspect files outside this scratch directory.'''
(evidence/'prompt.txt').write_text(prompt+'\n')
started=time.monotonic()
cmd=['/Users/weiwei/.local/bin/dsh-work','--json','--permission-mode','workspace-write','--approval-policy','never','-']
proc=subprocess.Popen(cmd,cwd=scratch,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.PIPE,start_new_session=True)
proc.stdin.write(prompt.encode());proc.stdin.close()
meta={'scratch':str(scratch),'pid':proc.pid,'process_group':proc.pid,'input_sha256':hashlib.sha256(raw).hexdigest(),'command':cmd,'wall_limit_seconds':480,'max_model_steps':8}
(evidence/'run.json').write_text(json.dumps(meta,indent=2)+'\n')
selector=selectors.DefaultSelector()
selector.register(proc.stdout,selectors.EVENT_READ,'stdout');selector.register(proc.stderr,selectors.EVENT_READ,'stderr')
buffers={'stdout':b'','stderr':b''};steps=0;stopped=None
with (evidence/'events.jsonl').open('wb') as out,(evidence/'stderr.log').open('wb') as err:
    while selector.get_map():
        if time.monotonic()-started>480 and stopped is None:
            stopped='wall_limit';os.killpg(proc.pid,signal.SIGTERM)
        for key,_ in selector.select(timeout=1):
            chunk=os.read(key.fileobj.fileno(),65536)
            if not chunk:
                selector.unregister(key.fileobj);continue
            (out if key.data=='stdout' else err).write(chunk)
            buffers[key.data]+=chunk
            if key.data=='stdout':
                while b'\n' in buffers['stdout']:
                    line,buffers['stdout']=buffers['stdout'].split(b'\n',1)
                    try:event=json.loads(line)
                    except ValueError:continue
                    if event.get('type')=='status' and event.get('phase')=='step_start':
                        steps+=1
                        print(json.dumps({'step':steps,'elapsed':round(time.monotonic()-started,1)}),flush=True)
                        if steps>8 and stopped is None:
                            stopped='step_limit';os.killpg(proc.pid,signal.SIGTERM)
            if stopped and time.monotonic()-started>490 and proc.poll() is None:
                os.killpg(proc.pid,signal.SIGKILL)
proc.wait()
meta.update(exit_code=proc.returncode,elapsed_seconds=round(time.monotonic()-started,3),steps_started=steps,stopped=stopped,input_unchanged=(scratch/'registry.json').read_bytes()==raw)
for name in ['summarize_registry.py','inventory.json','inventory.md']:
    p=scratch/name
    if p.exists():(evidence/name).write_bytes(p.read_bytes())
(evidence/'run.json').write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps(meta),flush=True)
