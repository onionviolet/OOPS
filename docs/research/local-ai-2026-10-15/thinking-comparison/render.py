import pathlib,json,datetime
P=pathlib.Path(__file__).resolve().parent
O=pathlib.Path('/Users/weiwei/Documents/Codex/2026-10-14/weibao-explicitly-requested-a-new-chat/outputs')
records=json.loads((P/'results.json').read_text());s=['# Thinking comparison: exact inputs and final outputs','Updated '+datetime.datetime.now(datetime.timezone.utc).isoformat()+f'. {len(records)} of 12 requests completed.','Reasoning content was not retained; timing, character counts and endpoint generation metrics were recorded. These local model outputs are inert test material, not installed game data.']
tasks=json.loads((P/'inputs.json').read_text())
for task,v in tasks.items():s+=['\n## Exact input: '+task,v['prompt'],'\nNative JSON constraint:\n```json\n'+json.dumps(v['schema'],indent=2)+'\n```']
for x in records:
 s+=['\n## '+x['model']+' / '+x['task']+' / thinking '+x['mode'],'\nOutput:\n'+(x.get('answer','') or '[No final answer]'),'\nMetrics:\n```json\n'+json.dumps({k:x.get(k) for k in ['native_think_value','elapsed_s','first_thinking_s','first_final_s','thinking_characters','final_characters','metrics','error']},indent=2)+'\n```']
(O/'Thinking_Comparison_Inputs_Results.md').write_text('\n\n'.join(s));print('Rendered',len(records))
