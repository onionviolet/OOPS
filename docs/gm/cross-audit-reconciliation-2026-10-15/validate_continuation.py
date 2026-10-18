from pathlib import Path
import json,re,hashlib,datetime,urllib.parse,ast,subprocess
root=Path.cwd();area=root/'docs/gm/cross-audit-reconciliation-2026-10-15';private=area/'private';errors=[];links=0;anchors=0;jsons=0
out=area/'CONTINUATION_VALIDATION.json'
if not out.exists():out.write_text('{}\n')
def slugset(f):
 result=set();seen={}
 for line in f.read_text(errors='replace').splitlines():
  if not re.match(r'^#{1,6} ',line):continue
  t=re.sub(r'<[^>]*>','',line.lstrip('#').strip()).lower();t=re.sub(r'[^\w\- ]','',t).replace(' ','-');n=seen.get(t,0);seen[t]=n+1;result.add(t+(f'-{n}' if n else ''))
 return result
def ints(v):
 if isinstance(v,int):return [v]
 if isinstance(v,list):return [n for i in v for n in ints(i)]
 return []
for f in area.glob('*.md'):
 for i,line in enumerate(f.read_text().splitlines(),1):
  if line.rstrip()!=line:errors.append({'file':f.name,'line':i,'error':'trailing whitespace'})
 for dest in re.findall(r'\[[^\]]+\]\(([^)]+)\)',f.read_text()):
  dest=dest.strip().strip('<>')
  if re.match(r'\w+://|mailto:',dest):continue
  target,_,anchor=dest.partition('#');t=(f.parent/urllib.parse.unquote(target)).resolve() if target else f;links+=1
  if not t.exists():errors.append({'file':f.name,'link':dest,'error':'missing target'});continue
  if anchor and t.suffix=='.md':
   anchors+=1
   if urllib.parse.unquote(anchor) not in slugset(t):errors.append({'file':f.name,'link':dest,'error':'missing anchor'})
for f in area.glob('*.py'):ast.parse(f.read_text())
for f in private.glob('*.json'):
 try:json.loads(f.read_text());jsons+=1
 except json.JSONDecodeError:errors.append({'file':f.name,'error':'JSON write in progress or invalid'})
revisions_path=private/'CLOSURE_LIVE_REPORT_REVISIONS.json'
revisions={r['path']:r for r in json.loads(revisions_path.read_text()).get('records',[])} if revisions_path.exists() else {}
historical_revision_checks=[]
def reviewed_source(record):
 src=root/record['path'];rev=revisions.get(record['path'],{})
 if rev and record.get('sha256')==rev.get('frozen_sha256') and hashlib.sha256(src.read_bytes()).hexdigest()==rev.get('current_sha256'):
  hist=root/rev['historical_copy']
  if hist.is_file() and hashlib.sha256(hist.read_bytes()).hexdigest()==record['sha256']:
   historical_revision_checks.append({'path':record['path'],'historical_copy':rev['historical_copy'],'scope':'Exact frozen bytes validated at preserved revision; current additive pointer separately pinned'})
   return hist
 return src
records=0;findings=0;source_pins=set()
for f in private.glob('T0[2-9]_*_RETURN.json'):
 try:data=json.loads(f.read_text())
 except json.JSONDecodeError:continue
 for r in data.get('records',[]):
  if not r.get('read_ranges'):continue
  records+=1;src=reviewed_source(r);h=r.get('sha256','')
  if not re.fullmatch('[a-f0-9]{64}',h):errors.append({'file':f.name,'path':r['path'],'error':'invalid SHA256'})
  elif hashlib.sha256(src.read_bytes()).hexdigest()!=h:errors.append({'file':f.name,'path':r['path'],'error':'source drift'})
  else:source_pins.add((r['path'],h))
  n=len(src.read_text().splitlines())
  if n!=r['line_count']:errors.append({'file':f.name,'path':r['path'],'error':'line count drift'})
  for item in r.get('findings',[]):
   findings+=1;bad=[x for x in ints(item.get('lines')) if x<1 or x>n]
   if bad and not item.get('evidence_locator'):errors.append({'file':f.name,'path':r['path'],'id':item.get('original_id'),'error':'finding locator outside source','lines':item.get('lines'),'source_lines':n})
semantic_sources=0;semantic_drifts=[]
for f in private.glob('SEMANTIC_*.json'):
 if f.name=='SEMANTIC_SOURCE_LEDGER.json':continue
 d=json.loads(f.read_text())
 for rec in d.get('sources',[])+d.get('supporting_sources',[]):
  src=root/rec['path'];n=len(src.read_text().splitlines());h=hashlib.sha256(src.read_bytes()).hexdigest()
  semantic_sources+=1
  if not re.fullmatch('[a-f0-9]{64}',rec.get('sha256','')):
   errors.append({'file':f.name,'path':rec['path'],'error':'malformed semantic source SHA256'})
  elif h!=rec['sha256']:
   semantic_drifts.append({'file':f.name,'path':rec['path'],'reviewed_sha256':rec['sha256'],'current_sha256':h,'scope':'dated source review retained; current input drift unresolved'})
  if rec.get('line_count',n)!=n and h==rec.get('sha256'):
   errors.append({'file':f.name,'path':rec['path'],'error':'semantic source line count mismatch'})
  for z in rec.get('semantic_ranges',rec.get('semantic_read_ranges',[])):
   if not isinstance(z,list) or len(z)!=2 or not 1<=z[0]<=z[1]<=rec.get('line_count',n):
    errors.append({'file':f.name,'path':rec['path'],'error':'invalid semantic review range','range':z})
 for finding in d.get('findings',[]):
  rel=finding.get('source');loc=finding.get('lines',[])
  if not rel or not loc:continue
  src=root/rel
  if not src.is_file():
   errors.append({'file':f.name,'id':finding.get('id',finding.get('key')),'error':'semantic finding source absent','path':rel});continue
  matching=[r for r in d.get('sources',[])+d.get('supporting_sources',[]) if r['path']==rel]
  n=matching[0].get('line_count',len(src.read_text().splitlines())) if matching else len(src.read_text().splitlines())
  if any(v<1 or v>n for v in ints(loc)):
   errors.append({'file':f.name,'id':finding.get('id',finding.get('key')),'error':'semantic finding locator out of bounds','lines':loc})
 for rec in d.get('records',[]):
  for key in ['source_locator','accepted_qualification_locator','row_reframe_locator']:
   loc=rec.get(key,{})
   if not loc:continue
   n=len((root/loc['path']).read_text().splitlines())
   if any(v<1 or v>n for v in ints(loc.get('lines'))):errors.append({'file':f.name,'id':rec.get('original_finding_id'),'error':'semantic finding locator out of bounds','locator':loc})
ignore=subprocess.run(['git','check-ignore',str(private/'FINDING_REGISTER.json')],capture_output=True,text=True).returncode==0
if not ignore:errors.append({'error':'private finding register not ignored'})
ledger_path=private/'SEMANTIC_SOURCE_LEDGER.json'
ledger={r['path']:r for r in json.loads(ledger_path.read_text()).get('sources',[])} if ledger_path.exists() else {}
for drift in semantic_drifts:
 entry=ledger.get(drift['path'],{})
 current_ranges=entry.get('current_semantic_ranges',[])
 old_record=next((r for r in json.loads((private/drift['file']).read_text()).get('sources',[])+json.loads((private/drift['file']).read_text()).get('supporting_sources',[]) if r['path']==drift['path']),{})
 old_ranges=old_record.get('semantic_ranges',old_record.get('semantic_read_ranges',[]))
 if entry.get('current',{}).get('sha256')==drift['current_sha256'] and old_ranges and all(any(a<=x and y<=b for a,b in current_ranges) for x,y in old_ranges):
  drift['scope']='Historical source pin retained; cited windows have current-byte semantic followup. No whole-file unchanged claim.'
  drift['followup']='private/SEMANTIC_SOURCE_LEDGER.json'
coverage=json.loads((private/'CONTINUATION_COVERAGE.json').read_text())
result={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'PASS' if not errors else 'NEEDS_REPAIR_OR_INFLIGHT','local_links_checked':links,'anchors_checked':anchors,'private_json_parsed':jsons,'return_record_observations':records,'unique_matching_source_pins':len(source_pins),'finding_row_observations':findings,'coverage':{k:v for k,v in coverage.items() if k not in ['batches','dispositions']},'semantic_source_observations':semantic_sources,'semantic_input_drifts':semantic_drifts,'qualified_historical_revision_checks':historical_revision_checks,'private_ignore':ignore,'errors':errors,'proof_scope':'Documentation links/anchors, source hashes/ranges, schemas, whitespace and compiler AST only. No gameplay/current source behavior/persistence/human acceptance inferred. Pending batches and source-only proposal adoption remain open.'}
out.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k not in ['coverage']},indent=2))
