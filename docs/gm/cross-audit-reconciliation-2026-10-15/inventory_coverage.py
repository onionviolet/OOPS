"""Derive inventory progress from explicit semantic receipts, never name discovery."""
from pathlib import Path
import json, hashlib, collections, datetime
root=Path.cwd(); area=root/'docs/gm/cross-audit-reconciliation-2026-10-15'; private=area/'private'
intake=json.loads((private/'ALL_INVENTORIES_INTAKE_T09.json').read_text())
ledger={s['path']:s for s in json.loads((private/'SEMANTIC_SOURCE_LEDGER.json').read_text())['sources']}
schema_scopes={}; index_scopes={}
for packet in private.glob('SEMANTIC_*.json'):
 if packet.name=='SEMANTIC_SOURCE_LEDGER.json':continue
 data=json.loads(packet.read_text())
 for source in data.get('sources',[])+data.get('supporting_sources',[]):
  if source.get('index_only_json_paths'):
   index_scopes.setdefault((source['path'],source['sha256']),[]).append({'return':packet.name,'paths':source['index_only_json_paths'],'boundary':source.get('index_only_schema_qualification','Index schema only; zero semantic finding/body credit.')})
  if source.get('semantic_json_paths'):
   key=(source['path'],source['sha256'])
   scope=schema_scopes.setdefault(key,{'paths':[],'receipts':[],'boundary':'Explicit JSON field/row or schema scopes only. A parent selector is qualified by its receipt; it does not silently include unreviewed descendants. No full physical-line credit.'})
   scope['receipts'].append({'return':packet.name,'paths':source['semantic_json_paths'],'read_mode':source.get('read_mode',source.get('scope','See original receipt for exact semantic/index-only boundary.'))})
   for selector in source['semantic_json_paths']:
    if selector not in scope['paths']:scope['paths'].append(selector)
def remainder(ranges,n):
 out=[];start=1
 for a,b in ranges:
  if a>start:out.append([start,a-1])
  start=max(start,b+1)
 if start<=n:out.append([start,n])
 return out
rows=[]
for r in intake['records']:
 path=r['path']; src=root/path; item=dict(r)
 if not src.is_file():item.update(state='unavailable',semantic_ranges=[],unresolved_join='Exact file currently unavailable; metadata discovery is not recovery.');rows.append(item);continue
 raw=src.read_bytes();h=hashlib.sha256(raw).hexdigest();n=len(raw.decode(errors='replace').splitlines()); entry=ledger.get(path,{})
 # A receipt can match these bytes even if the original registration has drifted.
 rev=entry.get('revisions',{}).get(h,{})
 ranges=rev.get('ranges',[]); unread=remainder(ranges,n)
 schema_scope=schema_scopes.get((path,h))
 index_scope=index_scopes.get((path,h))
 state='source_range_complete' if ranges and not unread else 'partial_source_scope' if ranges else 'json_field_or_schema_scope' if schema_scope else 'index_only_artifact_classified' if index_scope else 'registered_no_semantic_scope'
 item.update(current_observed_sha256=h,current_observed_line_count=n,registration_drift=h!=r.get('sha256'),semantic_ranges=ranges,semantic_remainder=unread,semantic_json_scope=schema_scope,semantic_receipts=rev.get('receipts',[]),state=state,routing_owner='Existing source/report family at '+str(src.parent),owner_status='Path routing only unless a semantic receipt names the authoritative owner.',unresolved_join='Per-item source/consumer/proof joins stay in semantic packet; complete inventory reading never reads its linked payloads or establishes current implementation/native/human acceptance.')
 item['index_only_classification_receipts']=index_scope
 rows.append(item)
embedded=json.loads((private/'EMBEDDED_INVENTORY_LOCATORS_T09.json').read_text()); embedded_counts=collections.Counter()
for doc in embedded['records']:
 src=root/doc['path'];current_hash=hashlib.sha256(src.read_bytes()).hexdigest() if src.is_file() else None
 doc['current_observed_sha256']=current_hash;doc['registration_drift']=current_hash!=doc['sha256']
 entry=ledger.get(doc['path'],{});rev=entry.get('revisions',{}).get(doc['sha256'],{});ranges=rev.get('ranges',[])
 for section in doc['sections']:
  a,b=section['candidate_section_range'];covered=sum(max(0,min(b,y)-max(a,x)+1) for x,y in ranges)
  section['registered_revision_semantic_state']='complete_section_scope' if covered==b-a+1 else 'partial_section_scope' if covered else 'no_semantic_scope'
  section['semantic_state']='source_drift_requires_relocation' if doc['registration_drift'] else section['registered_revision_semantic_state']
  section['meaning']='Candidate heading only until reviewed; a full scoped read is not linked-source or current-consumer proof.'
  embedded_counts[section['semantic_state']]+=1
counts=collections.Counter(r['state'] for r in rows);assert sum(counts.values())==len(intake['records'])
families={}
for r in rows:
 family=r.get('kind','unavailable'); families.setdefault(family,collections.Counter())[r['state']]+=1
out={'schema':'inventory-semantic-progress-v1','at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':intake['scope'],'total_registered':len(rows),'states':dict(counts),'families':{k:dict(v) for k,v in families.items()},'records':rows,'embedded_heading_candidates':{'documents':len(embedded['records']),'section_states':dict(embedded_counts),'records':embedded['records']},'boundary':'Inventory scope overlaps frozen lexical candidates and supporting documents. Do not add counts. These are source-range states, not completed unique findings. Pattern discovery is not exhaustive embedded-table discovery; branch/ignored private recovery remains separate.'}
(private/'ALL_INVENTORIES_PROGRESS.json').write_text(json.dumps(out,indent=2)+'\n')
lines=['# All-inventory scope and progress','','Updated '+out['at']+'. [Next-step taxonomy](NEXT_STEPS.md) owns routing;','[exact semantic receipts](private/ALL_INVENTORIES_PROGRESS.json) own per-file source','ranges and unread complements. This is the separately tracked all-inventory','horizon requested after T08, overlapping the original candidate scope.','','Name discovery registered '+str(len(rows))+' files: 307 from the frozen main-path','catalog plus 18 later visible name matches. Embedded inventories such as B4','REPORT and its 63 source cards are tracked separately in the [B4 receipt](SEMANTIC_B4_INVENTORY.md).','A separate heading scan found '+str(len(embedded['records']))+' further documents with candidate inventory sections.','Changed embedded-section source bytes require relocation before current section credit.','These include method text as well as tables; this is discovery, not semantic','validation of every heading as an inventory. [Exact section locators](private/EMBEDDED_INVENTORY_LOCATORS_T09.json)','and scoped review states remain private. No arbitrary-prose-table, ignored/private','or branch recovery is claimed complete.','','| Source-reading state | Files |','|---|---:|']
for state in ['source_range_complete','partial_source_scope','json_field_or_schema_scope','index_only_artifact_classified','registered_no_semantic_scope','unavailable']:lines.append('| '+state.replace('_',' ')+' | '+str(counts[state])+' |')
lines+=['','JSON field/row and schema selectors are preserved across all matching receipts.','They add no full-line credit; exact unread human rows and index-only descendants','remain qualified in their originating packets. Older checkpoints called this','state schema-only; the current name also represents actual field/row review.','Index-only artifact classification adds zero semantic body/finding credit.','','| Navigation family | Full source range | Partial | JSON field/schema scope | Index-only classified | No semantic scope | Unavailable |','|---|---:|---:|---:|---:|---:|---:|---:|']
for name,c in sorted(families.items()):lines.append('| '+name+' | '+str(c['source_range_complete'])+' | '+str(c['partial_source_scope'])+' | '+str(c['json_field_or_schema_scope'])+' | '+str(c['index_only_artifact_classified'])+' | '+str(c['registered_no_semantic_scope'])+' | '+str(c['unavailable'])+' |')
lines+=['','## Interpretation and next work','','A filename, hash, JSON parse or list of item IDs adds no semantic reading credit.','Each completed unit must retain actual row meaning, original ID and locator,','qualified owner, consumer, evidence layer and unresolved join. A full inventory','read does not review its linked dossiers, source classes, images or private proof.','','Many JSON files are evidence manifests, not another human audit. Their source,','candidate, build, served bytes, result, failure and acceptance claims need scoped','review; embedded opaque hashes are not new behavioral findings. Do not multiply','one issue by every repeated manifest occurrence. Full-source credit comes only','from explicit matching-byte semantic receipts, with historical revisions retained.','','The registry pins metadata only for current registration; later changed files','keep registration drift separate from matching semantic revisions. Reuse existing','owners and exact-byte aliases, preserve stopped/negative evidence and useful','variants, and do not turn every inventory row into required implementation.','','The [resume](RESUME.md), [next unit](private/NEXT_SEMANTIC_UNIT.json) and private','per-file complements keep the remaining inventory work explicit. Original lexical','candidate, supporting-document, branch and loose-artifact scopes remain open.']
(area/'INVENTORY_PROGRESS.md').write_text('\n'.join(lines)+'\n')
print(json.dumps({'registered_inventories':len(rows),'semantic_states':dict(counts),'additional_heading_documents':len(embedded['records']),'heading_section_states':dict(embedded_counts)},indent=2))
