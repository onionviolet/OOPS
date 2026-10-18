from pathlib import Path
import json,re,hashlib
out=Path(__file__).resolve().parent;research=out.parent.parent;errors=[];receipts={}
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
paths=['qud-systems-audit-2026-10-15/depth-5/VALIDATION.json','qud-systems-audit-2026-10-15/depth-5/independent-audit/VALIDATION.json','rain-world/emergence-2026-10-15/round-3/extraction/VALIDATION.json','rain-world/emergence-2026-10-15/round-3/audit/VALIDATION.json','dwarf-fortress/emergence-2026-10-15/round-3/extraction/VALIDATION.json','dwarf-fortress/emergence-2026-10-15/round-3/audit/VALIDATION.json']
for rel in paths:
 f=research/rel
 if not f.exists():errors.append('missing lane validation '+rel);continue
 d=json.loads(f.read_text());ok=d.get('status')=='PASS' or d.get('passed') is True or d.get('pass') is True
 if not ok or d.get('errors'):errors.append('failed lane validation '+rel)
 receipts[rel]={'status':'PASS' if ok else 'FAIL','receipt_sha256':sha(f)}
(out/'VALIDATION.json').write_text('{}');links=[]
areas=[out,out.parent]+[research/Path(rel).parent for rel in paths]
for area in areas:
 for f in area.glob('*.md'):
  for url in re.findall(r'\]\(([^)]+)\)',f.read_text()):
   if '://' in url or url.startswith('#'):continue
   q=f.parent/url.split('#')[0];links.append({'source':str(f),'target':url,'exists':q.exists()})
   if not q.exists():errors.append('broken link '+str(f)+' '+url)
q=json.loads((research/'qud-systems-audit-2026-10-15/private/depth-5/UNREAD.json').read_text());rw=json.loads((research/'rain-world/emergence-2026-10-15/round-3/audit/VALIDATION.json').read_text())
result={'status':'PASS' if not errors else 'FAIL','scope':'Research archive integrity only; no native/game/save execution or implementation acceptance.','lane_validation_receipts':receipts,'local_links_checked':len(links),'coverage':{'Qud_root_unique_captured':q['captured_unique_types'],'Qud_root_capture_only':len(q['capture_only_types']),'Qud_independent_scope':'Separate read ledger, not summed as unique types','Rain_World_audit_game_classes':rw['cumulative_game_classes'],'Rain_World_audit_status':rw['class_status_counts'],'DF':'See native byte regions and exact unread complements in both lane receipts'},'errors':errors,'documents':{f.name:sha(f) for f in out.glob('*.md')}}
(out/'VALIDATION.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2));raise SystemExit(bool(errors))
