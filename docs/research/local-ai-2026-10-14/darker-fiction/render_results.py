import json,pathlib,datetime
P=pathlib.Path(__file__).resolve().parent;O=pathlib.Path('/Users/weiwei/Documents/Codex/2026-10-14/weibao-explicitly-requested-a-new-chat/outputs')
records=json.loads((P/'results.json').read_text());s=['# Exact inputs and full results','Updated '+datetime.datetime.now(datetime.timezone.utc).isoformat()+'. '+str(len(records))+' of 8 requests complete. This is a small sampled screen, not a universal capability rating.']
for x in records:
 s+=['\n## '+x['model']+' / '+x['case']+' / seed '+str(x['seed'])]
 for m in x['request']['messages']:
  s+=['\n### Input: '+m['role'],m['content']]
  if m.get('images'):s+=['Synthetic image attached: [test card](vision-fixture.png).']
 for k in ['format','tools']:
  if k in x['request']:s+=['\n### '+k,'```json\n'+json.dumps(x['request'][k],indent=2)+'\n```']
 s+=['\n### Output',x.get('answer','') or '[No final text]']
 if x.get('tool_calls'):s+=['```json\n'+json.dumps(x['tool_calls'],indent=2)+'\n```']
 if x.get('thinking'):s+=['\n### Unexpected thinking',x['thinking']]
 s+=['\n### Metrics','```json\n'+json.dumps({k:x.get(k) for k in ['first_final_s','elapsed_s','words','metrics','error']},indent=2)+'\n```']
(O/'Darker_Fiction_Results.md').write_text('\n\n'.join(s))
print('Rendered',len(records))
