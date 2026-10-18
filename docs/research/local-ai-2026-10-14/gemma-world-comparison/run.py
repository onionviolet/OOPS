import json,urllib.request,time,pathlib,datetime
P=pathlib.Path(__file__).resolve().parent
records=[]
initial={'at': 'set_at_run', 'options': {'num_ctx': 4096, 'num_predict': 400, 'temperature': 0.7, 'top_p': 0.9}, 'thinking': False, 'models': ['gemma4:31b-mlx', 'qwen3.8:27b', 'huihui_ai/Qwen3.8-abliterated:27b-q8_0'], 'scope': '4 exact core cases + 4 exact darker cases + 1 source-to-slice task per model = 27 requests; local inference only', 'world_options': {'num_ctx': 8192, 'num_predict': 1100}, 'authority': 'User requested testing Gemma against both Qwens and book-world playability usefulness'}
def metadata(k):return json.load(urllib.request.urlopen('http://localhost:11434/api/'+k,timeout=15))

def run(model,seed,case,messages,fmt=None,tools=None):
 body={'model':model,'messages':messages,'stream':True,'think':False,'keep_alive':'2m','options':dict(initial['options'],seed=seed)}
 if fmt:body['format']=fmt
 if tools:body['tools']=tools
 rec={'model':model,'seed':seed,'case':case,'request':body,'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat()};start=time.monotonic();parts=[];thinking=[];calls=[];first=None;final={}
 try:
  req=urllib.request.Request('http://localhost:11434/api/chat',data=json.dumps(body).encode(),headers={'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=180) as r:
   for line in r:
    event=json.loads(line)
    if event.get('error'):raise RuntimeError(event['error'])
    m=event.get('message',{});c=m.get('content','')
    if c and first is None:first=time.monotonic()-start
    parts.append(c);thinking.append(m.get('thinking',''));calls.extend(m.get('tool_calls',[]))
    if event.get('done'):final=event
  rec.update(answer=''.join(parts),thinking=''.join(thinking),tool_calls=calls,first_final_s=first,elapsed_s=time.monotonic()-start,metrics={k:v for k,v in final.items() if k not in ['message','model','created_at']},words=len(''.join(parts).split()))
 except Exception as e:rec.update(error=str(e),elapsed_s=time.monotonic()-start)
 records.append(rec);(P/'results.json').write_text(json.dumps(records,indent=2));print(json.dumps({k:rec.get(k) for k in ['model','case','seed','elapsed_s','first_final_s','words','error']}),flush=True)
 return rec.get('answer','')
initial.update(at=datetime.datetime.now(datetime.timezone.utc).isoformat(),version=metadata('version'),tags=metadata('tags'),ps=metadata('ps'))
(P/'initial.json').write_text(json.dumps(initial,indent=2))
v=json.loads((P/'inputs.json').read_text())
for model in initial['models']:
 run(model,17,'site',[{'role':'user','content':v['core']['site']}],v['site_schema'])
 history=[{'role':'user','content':v['core']['scene']}];answer=run(model,17,'scene',history)
 run(model,17,'correction',history+[{'role':'assistant','content':answer},{'role':'user','content':v['core']['correction']}])
 run(model,17,'companion',[{'role':'user','content':v['core']['companion']}])
 for case,prompt in v['dark']:run(model,113,case,[{'role':'user','content':prompt}])
 old_options=initial['options'].copy();initial['options'].update(initial['world_options'])
 run(model,113,'source_to_slice',[{'role':'user','content':v['world']}],v['world_schema'])
 initial['options']=old_options
 req=urllib.request.Request('http://localhost:11434/api/generate',data=json.dumps({'model':model,'keep_alive':0,'stream':False}).encode(),headers={'Content-Type':'application/json'});json.load(urllib.request.urlopen(req,timeout=30))
(P/'final.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tags':metadata('tags'),'ps':metadata('ps'),'requests':len(records)},indent=2));print('COMPLETE',len(records),flush=True)
