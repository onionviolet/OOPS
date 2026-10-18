from pathlib import Path
import json,hashlib,collections,datetime
root=Path.cwd();o=root/'docs/gm/cross-audit-reconciliation-2026-10-15';p=o/'private'
queue=json.loads((p/'RECORD_QUEUE.json').read_text());by={r['path']:r for r in queue['records']};extractions=[];drift=[];counts=collections.Counter()
for batch in ['DESIGN','FOUNDATION','RESEARCH']:
 data=json.loads((p/(batch+'_EXTRACTION.json')).read_text());rs=data.get('records',data.get('documents',[]));manifest=(p/('BATCH_'+batch.lower()+'.txt')).read_text().splitlines()
 assert [r.get('source',r.get('path')) for r in rs]==manifest
 for r in rs:
  rel=r.get('source',r.get('path'));ranges=r.get('read_ranges',r.get('source_scope',{}).get('ranges_read',[]));n=r.get('line_count',r.get('lines')); covered=set()
  for a,b in ranges:
   assert 1<=a<=b<=n,(rel,a,b,n)
   covered.update(range(a,b+1))
  rest=[];start=None
  for i in range(1,n+2):
   if i<=n and i not in covered:
    if start is None:start=i
   elif start is not None:rest.append([start,i-1]);start=None
  current=hashlib.sha256((root/rel).read_bytes()).hexdigest()
  if current!=r['sha256']:drift.append({'path':rel,'read_hash':r['sha256'],'current_hash':current})
  scope='partial' if rest else 'full-line-read'
  by[rel].update(semantic_review='extracted-not-fully-reconciled',read_ranges=ranges,unread_ranges=rest,read_sha256=r['sha256'],extraction_artifact='private/'+batch+'_EXTRACTION.json',input_drift=current!=r['sha256'])
  counts[batch+'_'+scope]+=1
  if batch=='DESIGN':items=r['finding_rows']
  elif batch=='FOUNDATION':items=r.get('explicit_id_index',[])
  else:items=r.get('original_ids_findings_locators',[])
  extractions.append({'path':rel,'batch':batch,'classification':r.get('classification','execution-report'),'read_scope':scope,'ranges':ranges,'unread':rest,'items':items,'disposition':'retained at original owner; extraction is not current-consumer reconciliation','source_record':r})
(p/'EXTRACTED_CROSSWALK.json').write_text(json.dumps(extractions,indent=2)+'\n');(p/'RECORD_QUEUE.json').write_text(json.dumps(queue,indent=2)+'\n')
summary=dict(counts);summary.update(extracted_records=len(extractions),input_drift=drift,candidate_records_without_batch_extraction=sum(r.get('candidate_record',False) and r.get('semantic_review')!='extracted-not-fully-reconciled' for r in queue['records']))
(p/'EXTRACTION_SUMMARY.json').write_text(json.dumps(summary,indent=2)+'\n')
# Stable continuation order: finish explicit partial ranges before opening new documents.
partial=[{'path':r['path'],'ranges':r['unread_ranges'],'reason':'finish sampled record before claiming complete finding extraction'} for r in queue['records'] if r.get('unread_ranges')]
unopened=[{'path':r['path'],'ranges':[[1,r['lines']]],'reason':'candidate record indexed only; first classify prompt/index/audit and aliases'} for r in queue['records'] if r.get('candidate_record') and r.get('semantic_review')=='unread']
(p/'NEXT_TRANCHE.json').write_text(json.dumps({'partial_records_first':partial,'then_indexed_only_candidates':unopened,'finding_remainder':'Explicit unextracted_ids plus original lexical findings in RECORD_QUEUE; printed lines do not imply every ID reconciled.'},indent=2)+'\n')
print(json.dumps(summary,indent=2));print('first remaining',partial[:3])
