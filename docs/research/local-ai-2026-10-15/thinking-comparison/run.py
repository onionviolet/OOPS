import pathlib,json,urllib.request,time,datetime,signal,hashlib,subprocess
P=pathlib.Path(__file__).resolve().parent
OLD=P.parents[1]/'local-ai-2026-10-14/gemma-world-comparison'
models=['gemma4:31b-mlx','qwen3.8:27b','huihui_ai/Qwen3.8-abliterated:27b-q8_0']
def meta(route,body=None):
 req=urllib.request.Request('http://127.0.0.1:11434/api/'+route,data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json'})
 return json.load(urllib.request.urlopen(req,timeout=30))
hp=json.loads((OLD/'hp-input.json').read_text())
ops=['visitor_lumos','learner_reparo','learner_lumos','save_reload','observe_mark','learner_nox','leave']
plan_prompt='''Plan a future Harry Potter test slice under this COMPLETE, ORIGINAL TEST CONTRACT. This is an inert evaluation plan, not existing gameplay or extra canon. Canon dossier: Lumos lights the caster's wand tip, Nox extinguishes it; Reparo can mend some physical objects but does not restore damaged wand magic. This adult learner owns an intact wand, is magically eligible, knows ONLY Lumos/Nox, and starts in the storage room with light OFF and no observed mark. The nonmagical visitor owns a wand but cannot cast. The learner has NOT learned Reparo. Ordinary observers need not be magically eligible to see emitted light. No costs, XP, items, rewards or arbitrary cooldowns exist in this fixture.
Allowed operations and precise effects:
visitor_lumos: rejected, changes nothing; record one rejected cast.
learner_reparo: rejected because not learned, changes nothing; record one rejected cast.
learner_lumos: learner must be in storage; sets scoped wand light ON.
save_reload: serialize/restore the same actor/wand/world identity and all test state; never grants knowledge; must occur while light is ON.
observe_mark: requires learner in storage AND light ON; records observedMark=true, retained after darkness/leaving.
learner_nox: sets the learner's scoped wand light OFF; does not erase observations.
leave: changes learnerLocation to outside; requires no quest, payment or permission; does not erase observations or magically extinguish a lit wand.
Goal: return a shortest legal sequence that performs EACH of the seven named operations EXACTLY ONCE, observes the mark, saves/reloads while lit, ends outside with light OFF and the observation retained, and reports the two rejections. Both rejected attempts can occur anywhere because they are inert. No unlisted operations or extra source facts. Return only JSON matching the explicit schema. Do not confuse a rejected spell with successful casting. Do not claim the evaluator proves actual native gameplay.
'''
schema={'type':'object','properties':{'sequence':{'type':'array','maxItems':10,'items':{'type':'string','enum':ops}},'finalState':{'type':'object','properties':{'learnerLocation':{'type':'string','enum':['storage','outside']},'light':{'type':'string','enum':['on','off']},'observedMark':{'type':'boolean'},'savedWhileLit':{'type':'boolean'},'rejectedCasts':{'type':'integer'},'xp':{'type':'integer'},'coins':{'type':'integer'}},'required':['learnerLocation','light','observedMark','savedWhileLit','rejectedCasts','xp','coins'],'additionalProperties':False},'explanation':{'type':'string','maxLength':400}},'required':['sequence','finalState','explanation'],'additionalProperties':False}
plan_prompt+='\nEXPLICIT OUTPUT SCHEMA:\n'+json.dumps(schema,indent=2)
tasks={'hp_proposal':{'prompt':hp['prompt'],'schema':hp['schema'],'off_cap':1100,'on_cap':3072},'hp_plan':{'prompt':plan_prompt,'schema':schema,'off_cap':800,'on_cap':2048}}
(P/'inputs.json').write_text(json.dumps(tasks,indent=2))
initial={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'version':meta('version'),'tags':meta('tags'),'ps':meta('ps'),'config':json.loads(pathlib.Path('/Users/weiwei/.local/share/local-ai/config.json').read_text()),'show':{m:meta('show',{'model':m}) for m in models},'task_ownership':'new absent-before-task thinking-comparison directory only','authority':'User explicitly requested thinking-on comparison for all three, planning accuracy, speed and editing burden','common_options':{'num_ctx':8192,'temperature':0.7,'top_p':0.9,'seed':113},'hard_wall_seconds':240,'note':'No empty warmup. Thinking-on has an additional bounded reasoning/output allowance; not equal compute. Proposal identical to prior HP task.'}
(P/'initial.json').write_text(json.dumps(initial,indent=2))
records=[]
def alarm_handler(signum,frame):raise TimeoutError('240-second request wall limit reached')
signal.signal(signal.SIGALRM,alarm_handler)
def run(model,task,mode):
 t=tasks[task];thinking=False if mode=='off' else (True if model.startswith('gemma') else 'medium')
 body={'model':model,'messages':[{'role':'user','content':t['prompt']}],'format':t['schema'],'think':thinking,'stream':True,'keep_alive':'2m','options':dict(initial['common_options'],num_predict=t[mode+'_cap'])}
 rec={'model':model,'task':task,'mode':mode,'native_think_value':thinking,'request':body,'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 start=time.monotonic();parts=[];thinking_chars=0;first_thinking=None;first_final=None;final={};chunks=0;reasoning_chunks=0
 try:
  signal.alarm(240)
  req=urllib.request.Request('http://127.0.0.1:11434/api/chat',data=json.dumps(body).encode(),headers={'Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=260) as resp:
   for line in resp:
    event=json.loads(line)
    if event.get('error'):raise RuntimeError(event['error'])
    m=event.get('message',{});c=m.get('content','');th=m.get('thinking','')
    if th:
     thinking_chars+=len(th);reasoning_chunks+=1
     if first_thinking is None:first_thinking=time.monotonic()-start
    if c:
     if first_final is None:first_final=time.monotonic()-start
     parts.append(c);chunks+=1
    if event.get('done'):final=event
  rec['metrics']={k:v for k,v in final.items() if k not in ['message','model','created_at']}
 except Exception as e:rec['error']=str(e)
 finally:signal.alarm(0)
 rec.update(answer=''.join(parts),elapsed_s=time.monotonic()-start,first_thinking_s=first_thinking,first_final_s=first_final,thinking_characters=thinking_chars,thinking_chunks=reasoning_chunks,final_characters=sum(map(len,parts)),final_chunks=chunks)
 try:rec['resident_after']=meta('ps')
 except Exception as e:rec['residency_error']=str(e)
 records.append(rec);(P/'results.json').write_text(json.dumps(records,indent=2));print(json.dumps({k:rec.get(k) for k in ['model','task','mode','elapsed_s','first_thinking_s','first_final_s','thinking_characters','final_characters','error']}),flush=True)
for index,model in enumerate(models):
 proposal_order=['off','on'] if index%2==0 else ['on','off']
 for mode in proposal_order:run(model,'hp_proposal',mode)
 for mode in proposal_order[::-1]:run(model,'hp_plan',mode)
 meta('generate',{'model':model,'keep_alive':0,'stream':False})
(P/'final.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'tags':meta('tags'),'ps':meta('ps'),'config':json.loads(pathlib.Path('/Users/weiwei/.local/share/local-ai/config.json').read_text()),'requests':len(records)},indent=2));print('COMPLETE',len(records),flush=True)
