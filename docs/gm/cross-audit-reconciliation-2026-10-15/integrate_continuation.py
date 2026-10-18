"""Merge incremental documentation-audit returns without promoting evidence layers."""
from pathlib import Path
import json,hashlib,datetime,re,collections
root=Path.cwd();area=root/'docs/gm/cross-audit-reconciliation-2026-10-15';private=area/'private'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def merge_ranges(ranges):
 out=[]
 for a,b in sorted(ranges):
  if out and a<=out[-1][1]+1:out[-1][1]=max(out[-1][1],b)
  else:out.append([a,b])
 return out
def complements(ranges,n):
 out=[];start=1
 for a,b in merge_ranges(ranges):
  if a>start:out.append([start,a-1])
  start=max(start,b+1)
 if start<=n:out.append([start,n])
 return out
queue=json.loads((private/'RECORD_QUEUE.json').read_text());by={r['path']:r for r in queue['records']};finding_rows=[];batches=[];errors=[];drift=[]
# Semantic coverage belongs to a source revision. Never union windows from
# changed files into one current-byte completion claim.
semantic_ledger={};source_snapshots={}
def snapshot(rel):
 if rel not in source_snapshots:
  src=root/rel
  if src.is_file():
   raw=src.read_bytes();source_snapshots[rel]={'sha256':hashlib.sha256(raw).hexdigest(),'line_count':len(raw.decode(errors='replace').splitlines())}
  else:source_snapshots[rel]={'sha256':None,'line_count':0}
 return source_snapshots[rel]
def add_semantic(record,ranges,return_name,scope):
 if not ranges:return
 rel=record['path'];pin=record.get('sha256');cur=snapshot(rel);n=record.get('line_count',cur['line_count'])
 if any(not isinstance(z,list) or len(z)!=2 or not 1<=z[0]<=z[1]<=n for z in ranges):
  errors.append({'return':return_name,'path':rel,'error':'invalid semantic revision ranges'});return
 entry=semantic_ledger.setdefault(rel,{'path':rel,'current':cur,'revisions':{}})
 rev=entry['revisions'].setdefault(pin,{'sha256':pin,'line_count':n,'ranges':[],'receipts':[]})
 rev['ranges']=merge_ranges(rev['ranges']+ranges)
 rev['receipts'].append({'return':return_name,'scope':scope,'ranges':ranges})
# Keep original T1 extraction coverage, then overlay same-revision actual reads.
for r in queue['records']:
 r.pop('continuation_reviews',None)
 r['semantic_ranges']=[];r['semantic_review_scopes']=[]
for f in sorted(private.glob('T0[2-9]_*_RETURN.json')):
 try:d=json.loads(f.read_text())
 except json.JSONDecodeError:
  batches.append({'return':f.name,'status':'write-in-progress'});continue
 if d.get('schema')!='reconciliation-batch-v2':errors.append({'return':f.name,'error':'unexpected schema'});continue
 processed=0;count=0
 for record in d.get('records',[]):
  rel=record.get('path');ranges=record.get('capture_ranges',record.get('capture_parse_ranges',record.get('read_ranges',[])))
  if not ranges:continue
  if rel not in by:errors.append({'return':f.name,'path':rel,'error':'not frozen intake; needs explicit delta intake'});continue
  n=record.get('line_count');src=root/rel
  if not isinstance(n,int) or any(not isinstance(r,list) or len(r)!=2 or not 1<=r[0]<=r[1]<=n for r in ranges):
   errors.append({'return':f.name,'path':rel,'error':'invalid read ranges'});continue
  h=digest(src) if src.is_file() else None
  if h!=record.get('sha256'):drift.append({'return':f.name,'path':rel,'read_hash':record.get('sha256'),'current_hash':h})
  processed+=1;row=by[rel];prior=row.get('read_ranges',[]) if row.get('read_sha256',row.get('sha256'))==record.get('sha256') else []
  # Previous same-revision reads explicitly supplied by a worker are retained separately in its receipt.
  reads=merge_ranges(prior+ranges)
  row.update(read_ranges=reads,unread_ranges=complements(reads,n),read_sha256=record.get('sha256'),semantic_review='finding-rows-routed; individual evidence and adoption remain scoped',input_drift=h!=record.get('sha256'))
  row['capture_ranges']=reads
  semkind=record.get('semantic_scope','not_declared')
  semranges=record.get('semantic_ranges',record.get('semantic_reviewed_ranges',[]))
  if not semranges and semkind=='semantic_reviewed_assigned_report':semranges=record.get('read_ranges',[])
  if semkind=='captured_indexed_only':semranges=[]
  semranges=[z for z in semranges if isinstance(z,list) and len(z)==2 and 1<=z[0]<=z[1]<=n]
  add_semantic(record,semranges,f.name,semkind)
  row['semantic_ranges']=merge_ranges(row['semantic_ranges']+semranges) if h==record.get('sha256') else row['semantic_ranges']
  row['semantic_review_scopes'].append({'return':'private/'+f.name,'scope':semkind,'ranges':semranges,'reviewed_ids':record.get('semantic_reviewed_ids',[]),'current_consumer_status':'not implied by source semantic review'})
  row['semantic_unread_ranges']=complements(row['semantic_ranges'],n)
  row['semantic_review']='scoped semantic review recorded; current-consumer joins qualified' if row['semantic_ranges'] else 'captured/indexed; semantic review not declared'
  row.setdefault('continuation_reviews',[]).append({'return':'private/'+f.name,'read_ranges':ranges,'role':record.get('role'),'scope_complete_reported':record.get('coverage_complete_in_read_ranges',False),'unresolved_ids':record.get('unresolved_ids',[]),'findings':len(record.get('findings',[]))})
  for j,item in enumerate(record.get('findings',[])):
   required=['original_id','claim','owner','authority','evidence','consumer','disposition','rationale','next_action']
   missing=[k for k in required if k not in item]
   if missing:errors.append({'return':f.name,'path':rel,'item':j,'error':'missing fields','fields':missing})
   identity={'path':rel,'original_id':item.get('original_id'),'lines':item.get('lines'),'return':f.name,'ordinal':j}
   key=hashlib.sha256(json.dumps(identity,sort_keys=True).encode()).hexdigest()[:20]
   # A routed proposal does not establish whether current runtime has adopted it.
   finding_rows.append({'crosswalk_key':key,'source_path':rel,'read_sha256':record.get('sha256'),'return':'private/'+f.name,'record_role':record.get('role'),'semantic_scope':semkind,'semantic_reviewed_ids':record.get('semantic_reviewed_ids',[]),'semantic_ranges':semranges,'claim_scope':'qualified by source/research return; no automatic current runtime/human acceptance','current_adoption':item.get('current_adoption',item.get('current_applicability','not_checked_unless_explicit_evidence')),'finding':item})
   count+=1
 batches.append({'return':f.name,'status':'incremental read records validated','record_slots':len(d.get('records',[])),'processed_records':processed,'finding_rows':count})
# Small semantic returns retain their own schemas and explicit scope; they are not
# flattened into parser-derived v2 row totals.
semantic_returns=[];reviewed_finding_rows=[]
for f in sorted(private.glob('SEMANTIC_*.json')):
 if f.name=='SEMANTIC_SOURCE_LEDGER.json':continue
 d=json.loads(f.read_text());sources=d.get('sources',[])+d.get('supporting_sources',[])
 applied=0
 for record in sources:
  rel=record.get('path');ranges=record.get('semantic_ranges',record.get('semantic_read_ranges',[]))
  if not ranges:continue
  add_semantic(record,ranges,f.name,'explicit_small_semantic_review')
  if rel not in by:continue
  src=root/rel;n=len(src.read_text().splitlines());h=digest(src)
  if h!=record.get('sha256'):
   drift.append({'return':f.name,'path':rel,'read_hash':record.get('sha256'),'current_hash':h});continue
  if any(not isinstance(z,list) or len(z)!=2 or not 1<=z[0]<=z[1]<=n for z in ranges):
   errors.append({'return':f.name,'path':rel,'error':'invalid semantic ranges'});continue
  row=by[rel]
  prior=row.get('read_ranges',[]) if row.get('read_sha256',row.get('sha256'))==h else []
  capture=merge_ranges(prior+ranges+record.get('capture_ranges',[]))
  row.update(read_ranges=capture,capture_ranges=capture,unread_ranges=complements(capture,n),read_sha256=h,input_drift=False)
  row['semantic_ranges']=merge_ranges(row['semantic_ranges']+ranges)
  row['semantic_unread_ranges']=complements(row['semantic_ranges'],n)
  row['semantic_review']='explicit semantic scope; owner/adoption limited by separate return'
  row['semantic_review_scopes'].append({'return':'private/'+f.name,'scope':'explicit_small_semantic_review','ranges':ranges,'current_consumer_status':'see per-finding evidence; no automatic current adoption'})
  applied+=1
 for ordinal,item in enumerate(d.get('findings',d.get('records',[]))):
  original=item.get('original_ids',[item.get('original_finding_id')] if item.get('original_finding_id') else [])
  identity=item.get('id',item.get('key',item.get('original_finding_id',str(ordinal))))
  reviewed_finding_rows.append({'key':f.name+':'+str(identity),'return':'private/'+f.name,'schema':d.get('schema'),'original_ids':original,'source':item.get('source',item.get('source_locator',{}).get('path')),'lines':item.get('lines',item.get('source_locator',{}).get('lines')),'owner':item.get('owner'),'disposition':item.get('disposition',item.get('disp')),'current_adoption':item.get('current_adoption',item.get('semantic_status','not_checked')),'unresolved_join':item.get('unresolved_join','See raw return scope; no current-consumer completion inferred.'),'next_action':item.get('next_action',item.get('action')),'unit_warning':'An individual source claim, proposal family, or checkpoint recap as defined in raw return; grouped IDs and recaps are not unique completed findings.','raw':item})
 semantic_returns.append({'return':f.name,'source_ranges_applied':applied,'findings':len(d.get('findings',d.get('records',[]))),'schema':d.get('schema'),'scope':'separate semantic return; grouped IDs are not individually completed findings'})
for rel,entry in semantic_ledger.items():
 cur=entry['current'];rev=entry['revisions'].get(cur['sha256'],{});entry['current_semantic_ranges']=rev.get('ranges',[])
 entry['current_semantic_remainder']=complements(entry['current_semantic_ranges'],cur['line_count'])
 if rel in by:
  row=by[rel];row['semantic_ranges']=entry['current_semantic_ranges'];row['semantic_unread_ranges']=entry['current_semantic_remainder']
  row['semantic_current_sha256']=cur['sha256'];row['semantic_current_line_count']=cur['line_count'];row['semantic_revision_receipts']=entry['revisions']
(private/'REVIEWED_FINDING_REGISTER.json').write_text(json.dumps({'schema':'scoped-semantic-finding-register-v1','scope':'Only separate small semantic returns; unlike row units, no unique completed-finding count. Exact original fields retained. Runtime/owner gaps remain explicit. Broad v2 parser rows stay in FINDING_REGISTER instead.','rows':reviewed_finding_rows},indent=2)+'\n')
(private/'SEMANTIC_SOURCE_LEDGER.json').write_text(json.dumps({'schema':'semantic-source-revisions-v1','scope':'Only explicit declared semantic windows. Capture and parser segments excluded. Current windows match exact source bytes; prior revisions retained separately. Source reading does not imply adopted runtime or human acceptance.','sources':list(semantic_ledger.values())},indent=2)+'\n')
(private/'RECORD_QUEUE.json').write_text(json.dumps(queue,indent=2)+'\n')
(private/'FINDING_REGISTER.json').write_text(json.dumps({'schema':'cross-audit-finding-crosswalk-v2','compiled_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Original IDs/locators and per-row owner/disposition. Rows, grouped ranges, method instructions and repeated recaps are unlike units; counts are not unique completed findings.','rows':finding_rows},indent=2)+'\n')
reviewed=[r for r in queue['records'] if r.get('read_ranges')];semantic=[r for r in queue['records'] if r.get('semantic_ranges')];semantic_full=[r for r in semantic if not complements(r['semantic_ranges'],r.get('semantic_current_line_count',r.get('lines',0)))];complete=[r for r in reviewed if not r.get('unread_ranges')];partials=[r for r in reviewed if r.get('unread_ranges')];unread=[r for r in queue['records'] if r.get('candidate_record') and not r.get('read_ranges')]
summary={'compiled_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'frozen_candidate_records':2146,'records_with_capture_or_extraction_coverage':len(reviewed),'full_capture_records':len(complete),'partial_capture_records':len(partials),'candidate_records_without_capture':len(unread),'candidate_records_with_capture':sum(bool(r.get('candidate_record')) for r in reviewed),'candidate_records_with_semantic_ranges':sum(bool(r.get('candidate_record')) for r in semantic),'records_with_explicit_semantic_ranges':len(semantic),'full_semantic_source_range_records':len(semantic_full),'semantic_range_accounting':'Explicit semantic ranges matching current bytes only; historical revision ranges retained separately in SEMANTIC_SOURCE_LEDGER. Originating-record semantic reading does not prove current adoption; T1 reported read scopes remain separate receipts.','v2_finding_rows':len(finding_rows),'dispositions':dict(collections.Counter(r['finding'].get('disposition') for r in finding_rows)),'batches':batches,'separate_semantic_returns':semantic_returns,'errors':errors,'input_drift':drift,'qualification':'Capture/parse ranges do not establish semantic review; semantic review does not establish current-consumer verification. Source-frame-only proposal status remains distinct from current adoption. Grouped IDs and recaps not counted as unique completed findings.'}
(private/'CONTINUATION_COVERAGE.json').write_text(json.dumps(summary,indent=2)+'\n')
(private/'CONTINUATION_REMAINDER.json').write_text(json.dumps({'supporting_document_semantic_remainder':[{'path':r['path'],'revision_basis':r.get('semantic_current_sha256',r.get('sha256')),'ranges':r.get('semantic_unread_ranges',[]),'scope':'Named supporting owner or report, not a lexical intake candidate; partial semantic scope remains open, no automatic requirement to audit the entire design owner.'} for r in queue['records'] if not r.get('candidate_record') and r.get('semantic_ranges') and r.get('semantic_unread_ranges')], 'range_basis':'Current observed semantic revision where available; otherwise frozen-intake revision. Unobserved live files are not claimed unchanged.','semantic_review_remainder':[{'path':r['path'],'revision_basis':r.get('semantic_current_sha256',r.get('sha256')),'ranges':complements(r.get('semantic_ranges',[]),r.get('semantic_current_line_count',r.get('lines',0))),'scope':'semantic reading incomplete or not declared; source/consumer finding joins remain separately qualified'} for r in queue['records'] if r.get('candidate_record') and complements(r.get('semantic_ranges',[]),r.get('semantic_current_line_count',r.get('lines',0)))],'partial_capture_records':[{'path':r['path'],'ranges':r['unread_ranges']} for r in partials],'candidate_records_without_structured_read':[{'path':r['path'],'lines':r.get('lines')} for r in unread],'reviewed_finding_remainder':'REVIEWED_FINDING_REGISTER.json retains each small semantic row, owner, current adoption, unresolved join and next action. Grouped proposals/recaps stay grouped.','per_finding_remainder':'Read each unresolved_ids and source-only/current-adoption fields in FINDING_REGISTER; source-owner routing does not prove current runtime adoption.','all_worktree_variants':'WORKTREES.json branch_document_deltas and DOCUMENT_CATALOG.tsv remain a separate indexed/unreconciled horizon, except named SCATTERED_RETURN cases.'},indent=2)+'\n')
# Public status derives from receipts, never an optimistic worker slot count.
lines=['## Incremental coverage','','Updated '+summary['compiled_at']+'. Documentation evidence only.','',f"{len(reviewed)} main records now have capture/extraction coverage: {len(complete)} full-range captures and {len(partials)} partial. Of these, {sum(bool(r.get('candidate_record')) for r in reviewed)} belong to the frozen candidate set; {len(unread)} candidates still lack capture coverage. Only {len(semantic)} records ({sum(bool(r.get('candidate_record')) for r in semantic)} frozen candidates) have explicitly declared semantic ranges in this continuation; {len(semantic_full)} cover the complete source range. Only windows pinned to matching current bytes enter these semantic totals; historical windows remain in the [revision ledger](private/SEMANTIC_SOURCE_LEDGER.json). Source semantic review still does not imply current-consumer or human acceptance. {len(finding_rows)} v2 rows include programmatic segments, proposals, instructions, grouped IDs and recaps; they are not completed findings.",'','| Return | Capture/extraction records / slots | Structured rows |','|---|---|---|']
for b in batches:lines.append(f"| `{b['return']}` | {b.get('processed_records',0)} / {b.get('record_slots','?')} | {b.get('finding_rows',0)} |")
lines+=['','Additional bounded semantic returns: '+', '.join('`'+b['return']+'` ('+str(b['source_ranges_applied'])+' source scopes)' for b in semantic_returns)+'. These retain their independent per-finding evidence and are excluded from v2 parser-row totals.','','[Detailed coverage](private/CONTINUATION_COVERAGE.json), [reviewed finding/owner register](private/REVIEWED_FINDING_REGISTER.json), [parser/extraction register](private/FINDING_REGISTER.json) and [exact remainder](private/CONTINUATION_REMAINDER.json) update after each integrated batch. Semantic-range, current-adoption and unresolved-ID fields prevent parsing or extraction from masquerading as review or verification. The initial T1 extraction ranges remain historical reported scopes, not semantic closure.']
(area/'COVERAGE_CURRENT.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({k:v for k,v in summary.items() if k not in ['batches','dispositions']},indent=2))
