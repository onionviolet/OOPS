import json,urllib.request,time,pathlib,datetime
P=pathlib.Path(__file__).resolve().parent
records=[]
initial={'options':{'num_ctx':8192,'num_predict':1100,'temperature':0.7,'top_p':0.9}}
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
 records.append(rec);(P/'revision-results.json').write_text(json.dumps(records,indent=2));print(json.dumps({k:rec.get(k) for k in ['model','case','seed','elapsed_s','first_final_s','words','error']}),flush=True)
 return rec.get('answer','')
v=json.loads((P/'inputs.json').read_text())
for model in ['huihui_ai/Qwen3.8-abliterated:27b-q8_0','qwen3.8:27b','gemma4:31b-mlx']:
 run(model,113,'source_to_slice_revised',[{'role':'user','content':v['world_revised']}],v['world_schema'])
 req=urllib.request.Request('http://localhost:11434/api/generate',data=json.dumps({'model':model,'keep_alive':0,'stream':False}).encode(),headers={'Content-Type':'application/json'});json.load(urllib.request.urlopen(req,timeout=30))
print('REVISED COMPLETE',len(records),flush=True)
