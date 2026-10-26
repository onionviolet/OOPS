"""One same-model recovery: generate code from schema, execute separately after review."""
import hashlib,json,time,urllib.request
from pathlib import Path
b=Path(__file__).resolve().parent
prompt='''Write only Python source code, no markdown fences, for summarize_registry.py. Standard library only. CLI: python3 summarize_registry.py INPUT --json JSON_PATH --markdown MD_PATH. Input JSON has tools, a list of records with id (string), kind (launch or reference), optional probe (null or list), optional owner (null or string), optional required (list of raw path strings). Do not execute any registry entry or resolve paths. Read input without modifying it. Calculate from data; no hardcoded totals. Produce JSON with exactly these keys: total_tools integer; counts_by_kind object counts; ids_by_kind object sorted ID lists; launch_probe_ids sorted IDs for launch records with nonempty probe; launch_without_probe_ids sorted IDs for launch records with absent/null/empty probe; missing_owner_ids sorted IDs of all records with absent/null/empty owner; duplicate_ids sorted unique repeated IDs; required_path_references total number of required-list entries across launch records; unique_required_paths count distinct raw required strings across launch records. Empty tools must yield empty mappings/lists and zero counts. Markdown should summarize every metric concisely and state probe configuration is not installation or successful execution evidence. Prefer a compact implementation under 90 lines. This script will process the real YAIRPG tool registry. No imports outside the standard library.'''
(b/'recovery-prompt.txt').write_text(prompt+'\n')
payload={'model':'qwen3.8:27b','messages':[{'role':'user','content':prompt}],'stream':False,'think':False,'keep_alive':0,'options':{'temperature':0,'seed':42,'num_ctx':4096,'num_predict':2048}}
started=time.monotonic()
row={'model':payload['model'],'prompt_sha256':hashlib.sha256(prompt.encode()).hexdigest(),'options':payload['options'],'think':False,'request_limit':1,'timeout_seconds':240}
try:
 req=urllib.request.Request('http://127.0.0.1:11434/api/chat',json.dumps(payload).encode(),{'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=240) as r:data=json.load(r)
 code=data.get('message',{}).get('content','')
 (b/'recovery-raw-output.txt').write_text(code)
 # A mechanical wrapper removal is recorded, not treated as a code correction.
 stripped=code.strip()
 if stripped.startswith('```') and stripped.endswith('```'):
  stripped='\n'.join(stripped.splitlines()[1:-1]);row['removed_markdown_fence']=True
 else:row['removed_markdown_fence']=False
 (b/'summarize_registry.py').write_text(stripped+'\n')
 row.update(done=data.get('done'),done_reason=data.get('done_reason'),metrics={k:data.get(k) for k in ['total_duration','load_duration','prompt_eval_count','prompt_eval_duration','eval_count','eval_duration']},thinking_chars=len(data.get('message',{}).get('thinking','')))
except Exception as e:row['error']=str(e)
row['elapsed_seconds']=round(time.monotonic()-started,3)
(b/'recovery.json').write_text(json.dumps(row,indent=2)+'\n')
print(json.dumps(row),flush=True)
