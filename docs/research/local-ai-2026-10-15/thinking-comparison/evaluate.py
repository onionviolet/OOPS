import json,pathlib,collections
P=pathlib.Path(__file__).resolve().parent
OPS=['visitor_lumos','learner_reparo','learner_lumos','save_reload','observe_mark','learner_nox','leave']
def evaluate(record):
 out={'model':record['model'],'task':record['task'],'mode':record['mode'],'done_reason':record.get('metrics',{}).get('done_reason'),'request_error':record.get('error'),'empty_final':not record.get('answer','').strip()}
 try:data=json.loads(record['answer']);out['json_valid']=True
 except Exception as e:out.update(json_valid=False,json_error=str(e));return out
 if record['task']!='hp_plan':
  out['compatibility']=data.get('compatibility',{}).get('status');out['manual_semantic_review_required']=True;return out
 state={'learnerLocation':'storage','light':'off','observedMark':False,'savedWhileLit':False,'rejectedCasts':0,'xp':0,'coins':0};trace=[];errors=[];seq=data.get('sequence',[])
 if collections.Counter(seq)!=collections.Counter(OPS):errors.append('Sequence must contain each specified operation exactly once.')
 for i,op in enumerate(seq):
  try:
   if op in ['visitor_lumos','learner_reparo']:state['rejectedCasts']+=1
   elif op=='learner_lumos':
    assert state['learnerLocation']=='storage','learner_lumos needs storage location'
    state['light']='on'
   elif op=='save_reload':
    assert state['light']=='on','save_reload must occur while lit'
    state=json.loads(json.dumps(state));state['savedWhileLit']=True
   elif op=='observe_mark':
    assert state['learnerLocation']=='storage' and state['light']=='on','observe_mark needs storage location and light on'
    state['observedMark']=True
   elif op=='learner_nox':state['light']='off'
   elif op=='leave':state['learnerLocation']='outside'
   else:raise AssertionError('unknown operation')
  except Exception as e:errors.append(f'Step {i+1}: {e}');break
  trace.append({'step':op,'state':dict(state)})
 expected={'learnerLocation':'outside','light':'off','observedMark':True,'savedWhileLit':True,'rejectedCasts':2,'xp':0,'coins':0}
 out.update(execution_errors=errors,actual=state,claimed=data.get('finalState'),claim_matches_execution=data.get('finalState')==state,goal_reached=state==expected,trace=trace)
 out['planning_pass']=not errors and state==expected and data.get('finalState')==state and out['done_reason']=='stop'
 return out
if __name__=='__main__':
 records=json.loads((P/'results.json').read_text());scores=[evaluate(x) for x in records];(P/'evaluation.json').write_text(json.dumps(scores,indent=2));print(json.dumps([{k:v for k,v in s.items() if k not in ['trace','actual','claimed']} for s in scores],indent=2))
