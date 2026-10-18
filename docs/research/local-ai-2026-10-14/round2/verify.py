"""Research-artifact checks only. Never performs inference or changes gameplay."""
import ast, datetime, hashlib, json, pathlib, re, subprocess, urllib.parse, urllib.request
ROOT=pathlib.Path(__file__).resolve().parent
REPO=ROOT.parents[3]
SOURCE_PATHS=['AGENTS.md','PROJECT.md','docs/USER_VISION.md','src/authored_site.js',
 'src/authored_site_ui.js','src/main.js','src/structured_pack_definitions.js',
 'src/simulation.js','src/people_knowledge.js','src/event_feed.js',
 'src/causal_story_scenes.js','src/ink_narrative.js',
 'docs/gm/dispatch/procgen-2026-10-13/p15/AUTHORING_PIPELINE.md',
 'docs/gm/dispatch/procgen-2026-10-13/p15/RUNTIME_TEXT.md',
 'docs/gm/dispatch/procgen-2026-10-13/p15/LLM_OPTIONS.md',
 'docs/gm/dispatch/research-tech-2026-10-14/t5/LLM_ROUTES.md']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def git(*args):return subprocess.check_output(['git',*args],cwd=REPO,text=True).strip()
def api(route):
 with urllib.request.urlopen('http://127.0.0.1:11434/api/'+route,timeout=5) as r:return json.load(r)
out={'captured_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),
 'status':'RESEARCH_ONLY','branch':git('branch','--show-current'),'head':git('rev-parse','HEAD'),
 'write_scope':str(ROOT.relative_to(REPO)),'inference_calls':0,'weight_downloads':0,
 'source_hashes':{name:sha(REPO/name) for name in SOURCE_PATHS},'checks':{}}
prior=json.loads((ROOT.parent/'CHECKS.json').read_text())
out['source_drift_since_round1']=[n for n,h in out['source_hashes'].items()
 if n in prior['source_hashes'] and h!=prior['source_hashes'][n]]
for path in ROOT.glob('*.py'):ast.parse(path.read_text())
out['checks']['python_ast']='PASS'
protocol=json.loads(subprocess.check_output(['python3',str(ROOT.parent/'trial.py'),'--seeds','17','43'],text=True))
out['checks']['parent_no_inference_dry_run']={'status':protocol['status'],'calls':protocol['calls'],
 'cases':len(protocol['cases']),'options':protocol['options']}
bad=[]
for path in [ROOT/'REPORT.md',ROOT/'NEXT_TRIAL.md']:
 for target in re.findall(r'\]\(([^\n]+?)\)',path.read_text()):
  target=target.strip('<>')
  if re.match(r'^https?://',target):continue
  target=urllib.parse.unquote(target.split('#')[0])
  if target and not (path.parent/target).exists():bad.append({'file':path.name,'target':target})
out['checks']['local_links']={'status':'PASS' if not bad else 'FAIL','missing':bad}
for path in ROOT.glob('*.json'):json.loads(path.read_text())
out['checks']['json_parse']='PASS'
response=ROOT/'website-response.md'
if response.exists():
 text=response.read_text()
 out['website_roundtrip']={'status':'COMPLETED_CAPTURED_AND_RECONCILED',
  'conversation_url':'https://chatgpt.com/c/6acfe2b2-dffc-83ea-958b-033b09e2850f',
  'observed_mode':'ordinary Chat, default High 3 of 5; underlying model unverified',
  'transmitted_characters':len((ROOT/'website-transmitted.md').read_text()),
  'capture_has_start':'YAIR local-model research and trial decision' in text,
  'capture_has_end':'no tasks were created' in text,
  'hyperlinks':len(json.loads((ROOT/'website-response-links.json').read_text()))}
out['local_readonly']={route:api(route) for route in ['version','tags','ps']}
out['artifact_hashes']={str(p.relative_to(ROOT)):sha(p) for p in ROOT.rglob('*')
 if p.is_file() and p.name!='CHECKS.json'}
(ROOT/'CHECKS.json').write_text(json.dumps(out,indent=2))
print(json.dumps({k:out[k] for k in ['status','head','source_drift_since_round1','checks']},indent=2))
