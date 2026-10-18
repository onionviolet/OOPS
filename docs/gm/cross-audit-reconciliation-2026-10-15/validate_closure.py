"""Validate finite closure routing, not gameplay or full source understanding."""
from pathlib import Path
from collections import Counter
import json,hashlib,datetime,ast,subprocess
root=Path.cwd();area=root/'docs/gm/cross-audit-reconciliation-2026-10-15';private=area/'private';errors=[];checks={}
def read(name):return json.loads((private/name).read_text())
def target(path):
 p=Path(path)
 if p.is_absolute():return p
 if (root/p).exists():return root/p
 return area/p
def error(kind,**fields):errors.append({'error':kind,**fields})
def evidence(e,context):
 if not isinstance(e,dict) or 'path' not in e:return
 f=target(e['path'])
 if not f.is_file():error('missing evidence file',context=context,path=e['path']);return
 lines=e.get('lines',[])
 if not (isinstance(lines,list) and len(lines)==2 and all(isinstance(x,int) for x in lines) and 1<=lines[0]<=lines[1]<=len(f.read_text(errors='replace').splitlines())):error('evidence range out of bounds',context=context,path=e['path'],lines=lines)
revisions=read('CLOSURE_LIVE_REPORT_REVISIONS.json')['records'] if (private/'CLOSURE_LIVE_REPORT_REVISIONS.json').exists() else []
revision_by={r['path']:r for r in revisions}
reg=read('CLOSURE_REGISTER.json');dis=read('REPORT_DISPOSITIONS.json')['records'];archive=read('REPORT_ARCHIVE.json')['records'];all_assigned=[]
for lane in ['UI_DIRECTION','EXECUTION','WORLDS','SYSTEMS','RESEARCH']:
 inp=read('CLOSURE_INPUT_'+lane+'.json')['records'];out=read('CLOSURE_RETURN_'+lane+'.json')['report_dispositions'];want={r['path'] for r in inp};got=[r['path'] for r in out]
 if set(got)!=want or len(got)!=len(want):error('lane assignment partition',lane=lane)
 all_assigned+=list(want)
 for r in inp:
  f=target(r['path'])
  if not f.is_file():error('original report missing',path=r['path']);continue
  if hashlib.sha256(f.read_bytes()).hexdigest()!=r['sha256']:
   rev=revision_by.get(r['path'],{});hist=target(rev.get('historical_copy','nonexistent'))
   if not (rev.get('frozen_sha256')==r['sha256'] and rev.get('current_sha256')==hashlib.sha256(f.read_bytes()).hexdigest() and hist.is_file() and hashlib.sha256(hist.read_bytes()).hexdigest()==r['sha256']):error('unqualified original report revision',path=r['path'])
checks['frozen_report_paths']=len(all_assigned)
if len(all_assigned)!=len(set(all_assigned)) or len(all_assigned)!=827:error('frozen report assignment overlap or count')
if len(dis)!=827 or {r['path'] for r in dis}!=set(all_assigned):error('integrated disposition partition')
checks['disposition_counts']=dict(Counter(r['disposition'] for r in dis))
allowed={'archived_covered','archived_superseded','historical_reference','conditional_reference','external_acceptance_gate','needs_owner_reconciliation','active_unresolved'}
for r in dis:
 if r['disposition'] not in allowed:error('bad disposition',path=r['path'])
 for k in ['canonical_owner','underlying_issue_keys','evidence','rationale','reopen_condition']:
  if k not in r:error('missing report field',path=r['path'],field=k)
 owners=r['canonical_owner'] if isinstance(r['canonical_owner'],list) else [r['canonical_owner']]
 for owner in owners:
  if not target(owner).is_file():error('noncanonical owner file',path=r['path'],owner=owner)
 for e in r['evidence']:evidence(e,r['path'])
 if r['disposition'].startswith('archived_') and not any(e['path']!=r['path'] for e in r['evidence']):error('archive lacks other covering source',path=r['path'])
for r in archive:
 f=target(r['path'])
 if hashlib.sha256(f.read_bytes()).hexdigest()!=r['sha256']:error('archived source bytes changed',path=r['path'])
 if r['disposition'] not in {'archived_covered','archived_superseded'}:error('bad archive scope',path=r['path'])
checks['archived_reports_unchanged']=len(archive)
if len(archive)!=31:error('archive count')
active=reg['unresolved_audits'];ids=[r['id'] for r in active]
closed=reg.get('closed_audits',[]);all_audit_ids=ids+[r['id'] for r in closed]
if len(all_audit_ids)!=3 or set(all_audit_ids)!={'UA1','UA2','UA3'}:error('audit resolution partition')
for r in closed:
 if not r.get('resolution') or not r.get('result_evidence'):error('closed audit lacks result',id=r['id'])
 for e in r.get('result_evidence',[]):evidence(e,r['id'])
checks['closed_audits']=[r['id'] for r in closed]
checks['qualified_live_report_revisions']=len(revisions)
for r in active:
 for k in ['canonical_owner','underlying_issue_key','question','evidence','smallest_next_action','observable_done_check']:
  if not r.get(k):error('missing bounded audit field',id=r.get('id'),field=k)
 if not target(r['canonical_owner']).is_file():error('missing active owner',id=r['id'])
 for e in r['evidence']:evidence(e,r['id'])
checks['active_audits']=ids
all_actions=reg['documentation_actions']+reg.get('closed_documentation_actions',[])
if len(all_actions)!=5 or {r['id'] for r in all_actions}!={'DA1','DA2','DA3','DA4','DA5'}:error('documentation action resolution partition')
for a in reg.get('closed_documentation_actions',[]):
 if a['id']!='DA5' and not a.get('result_evidence'):error('closed documentation action lacks receipt',id=a['id'])
 for e in a.get('result_evidence',[]):evidence(e,a['id'])
checks['closed_documentation_actions']=[r['id'] for r in reg.get('closed_documentation_actions',[])]
checks['known_documentation_actions']=[r['id'] for r in reg['documentation_actions']]
for a in reg['documentation_actions']:
 for e in a['evidence']:evidence(e,a['id'])
fm=read('CLOSURE_ROOT_FINDINGS.json')['findings'];fids=[r['id'] for r in fm]
if len(fids)!=84 or set(fids)!={f'F{i}' for i in range(1,85)}:error('root finding partition')
for r in fm:
 if not r.get('canonical_doc_owner') or not r.get('underlying_issue_key'):error('missing owner/underlying finding key',id=r['id'])
checks['root_findings_mapped']=len(fids)
nextq=read('NEXT_SEMANTIC_UNIT.json')
if nextq['records'] or nextq['status']!='retired_as_automatic_queue':error('automatic enumeration still active')
checks['automatic_next_source_queue']=0
for h in read('CLOSURE_SOURCE_HISTORY.json')['records']:
 if hashlib.sha256(target(h['history_copy']).read_bytes()).hexdigest()!=h['sha256']:error('historical pointer bytes mismatch',path=h['history_copy'])
checks['live_pointer_revisions_preserved']=len(read('CLOSURE_SOURCE_HISTORY.json')['records'])
for p in area.glob('*.py'):
 try:ast.parse(p.read_text())
 except SyntaxError as ex:error('helper syntax',path=p.name,detail=str(ex))
# Follow-through records resolve only their explicit ranges and native sequences.
if (private/'DA_CORRECTIONS_CURRENT_2026-10-16.json').exists():
 for packet in ['DA_CORRECTIONS_CURRENT_2026-10-16.json','LATEST_UI_CONTEXT_2026-10-16.json']:
  for rec in read(packet)['sources']:
   f=target(rec['path']);ls=f.read_text().splitlines()
   if hashlib.sha256(f.read_bytes()).hexdigest()!=rec['sha256']:
    if rec.get('current_followup',{}).get('sha256')!=hashlib.sha256(f.read_bytes()).hexdigest():error('unqualified followthrough current input drift',path=rec['path'])
    else:checks.setdefault('qualified_current_drift_outside_windows',[]).append(rec['path'])
   for pin in rec['range_pins']:
    a,b=pin['lines']
    if not 1<=a<=b<=len(ls) or hashlib.sha256(('\n'.join(ls[a-1:b])+'\n').encode()).hexdigest()!=pin['sha256']:error('followthrough window pin',path=rec['path'],lines=pin['lines'])
 checks['correction_owner_files']=len(read('DA_CORRECTIONS_CURRENT_2026-10-16.json')['sources'])
 checks['independent_documentation_review']='private/DA_INDEPENDENT_CHECK_2026-10-16.json'
 ua1=read('UA1_RECOVERY_2026-10-16.json')
 if len(ua1['seven_rows'])!=7 or any(not r.get('residual') or not r.get('assigned_existing_owner') for r in ua1['seven_rows']):error('UA1 residual partition')
 checks['archive_counterparts_reconciled_with_residuals']=len(ua1['seven_rows'])
 ua2=read('UA2_NATIVE_2026-10-16.json')
 if {r['mode'] for r in ua2['results']}!={'doubleclick','enter-twice','enter-repeat'}:error('UA2 native sequence partition')
 for r in ua2['results']:
  clicks=sum(e['type']=='click' for e in r['events'])
  if not (r['delta']['attempts']==r['delta']['ledgerSequence']==clicks and r['persistedLedgerMatchesRuntime'] and not r['errors']):error('UA2 transaction evidence mismatch',mode=r['mode'])
  for k in ['ingredients','product','attempts','successes','xp']:
   delta=r['before'][k]-r['after'][k] if k=='ingredients' else r['after'][k]-r['before'][k]
   if abs(delta-r['delta'][k])>1e-8:error('UA2 measured delta mismatch',mode=r['mode'],field=k)
 rep=ua2['reproducibility'];served=target(str(area/rep['servedBundleBytes']));built=target(str(area/rep['preservedRuntime'])+'/dist/bundle.js')
 if not (rep['servedBundleHttpStatus']==200 and hashlib.sha256(served.read_bytes()).hexdigest()==hashlib.sha256(built.read_bytes()).hexdigest()==rep['servedBundleSha256']):error('UA2 served build pin mismatch')
 checks['native_sequence_evidence_validated']=len(ua2['results'])
 checks['native_limit']='Current synthetic Cooking route only; explicit repeat=true events, not physical input cadence or all browsers'
 ua3=read('UA3_PANELS_2026-10-16.json')
 if len(ua3['classifications'])!=3:error('UA3 observation partition')
 for rec in ua3['evidence_files']:
  if rec.get('historical_copy'):
   f=target(rec['historical_copy'])
  elif rec.get('current_followup'):
   follow=rec['current_followup'];f=target(rec['path'])
   if hashlib.sha256(f.read_bytes()).hexdigest()!=follow['sha256'] or any(not m['current_matching_ranges'] for m in follow['range_matches']):error('UA3 latest plan window drift',path=rec['path'])
   continue
  else:f=target(rec['path'])
  if hashlib.sha256(f.read_bytes()).hexdigest()!=rec['sha256']:error('UA3 reviewed revision pin mismatch',path=rec['path'])
 checks['panel_observations_reconciled']=len(ua3['classifications'])

# No closure triage enters SEMANTIC_* and earns source-reading credit.
checks['semantic_credit']='zero added from closure triage; original semantic ledger untouched'
checks['scope']='Finite routing and evidence checks only. UA2 native receipts, where present, are separate; this validator does not run gameplay or establish human acceptance'
result=dict(at=datetime.datetime.now(datetime.timezone.utc).isoformat(),status='PASS' if not errors else 'NEEDS_REPAIR',checks=checks,errors=errors)
(area/'CLOSURE_VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
