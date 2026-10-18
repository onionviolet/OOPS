from pathlib import Path
import json,hashlib,re,datetime
p=Path('docs/gm/cross-audit-reconciliation-2026-10-15');q=p/'private'
intake=json.loads((q/'ALL_INVENTORIES_PROGRESS.json').read_text())['records']; packets=[]
for f in q.glob('SEMANTIC_*.json'):
 if f.name=='SEMANTIC_SOURCE_LEDGER.json':continue
 d=json.loads(f.read_text())
 for s in d.get('sources',[])+d.get('supporting_sources',[]):
  if s.get('path','').endswith('.json') and (s.get('semantic_json_paths') or s.get('index_only_json_paths')):packets.append((f.name,s))
def resolve(d,sel):
 if not isinstance(sel,str):return {'status':'non_string_scope_note'}
 if sel.startswith('/'):
  tokens=sel.split('/')[1:];tokens=[t.replace('~1','/').replace('~0','~') for t in tokens]
 elif sel.startswith('$'):
  raw=sel[1:];tokens=[];pos=0
  while pos<len(raw):
   m=re.match(r'\.([A-Za-z0-9_\-]+)|\[(\d+|\*)\]',raw[pos:])
   if not m:return {'status':'prose_or_extended_scope_note_not_resolved','at':pos+1}
   tokens.append(m.group(1) if m.group(1) is not None else m.group(2));pos+=len(m.group(0))
 else:return {'status':'prose_scope_note_not_resolved'}
 nodes=[d]
 try:
  for t in tokens:
   nextnodes=[]
   for n in nodes:
    if t=='*':
     if isinstance(n,dict):nextnodes.extend(n.values())
     elif isinstance(n,list):nextnodes.extend(n)
     else:raise KeyError('wildcard target not collection')
    elif isinstance(n,list):nextnodes.append(n[int(t)])
    else:nextnodes.append(n[t])
   nodes=nextnodes
 except (KeyError,ValueError,IndexError,TypeError):return {'status':'unresolved_selector','tokens':tokens}
 return {'status':'resolved_selector','target_nodes':len(nodes),'target_types':sorted({type(n).__name__ for n in nodes}),'root_key':tokens[0] if tokens else None,'boundary':'Resolution is structural metadata only, not certification that target descendants were all semantically reviewed. Original receipt qualifies selection.'}
rows=[]
for r in intake:
 path=r['path']
 if not path.endswith('.json') or not Path(path).is_file():continue
 b=Path(path).read_bytes(); sha=hashlib.sha256(b).hexdigest(); d=json.loads(b); receipt=[]
 for f,s in packets:
  if s['path']==path and s['sha256']==sha:
   selections=[{'selector':sel,'scope_kind':'declared_semantic_field_or_schema_scope',**resolve(d,sel)} for sel in s.get('semantic_json_paths',[])]
   selections += [{'selector':sel,'scope_kind':'index_schema_only_zero_semantic_credit',**resolve(d,sel)} for sel in s.get('index_only_json_paths',[])]
   receipt.append({'return':f,'selectors':selections})
 roots=set(d) if isinstance(d,dict) else {'array root'}
 mentioned={item['root_key'] for rec in receipt for item in rec['selectors'] if item.get('status')=='resolved_selector' and item.get('root_key')}
 rows.append(dict(path=path,sha256=sha,line_count=len(b.decode().splitlines()),source_range_state=r['state'],top_level_keys=sorted(roots),declared_matching_receipts=receipt,top_level_keys_without_resolvable_selector=sorted(roots-mentioned),physical_semantic_remainder=r['semantic_remainder'],boundary='Pointer resolution and top-level complement discovery only. Full source ranges, partial ranges and field/schema scope remain separate. A top-level key mentioned by a selector is not automatically complete. Per-row unresolved joins/index-only arrays stay in original semantic receipts.'))
counts={}
for r in rows:
 for rec in r['declared_matching_receipts']:
  for sel in rec['selectors']:counts[sel['status']]=counts.get(sel['status'],0)+1
(q/'JSON_SCOPE_COVERAGE_T11.json').write_text(json.dumps(dict(schema='json-semantic-scope-structural-crosswalk-v1',at=datetime.datetime.now(datetime.timezone.utc).isoformat(),scope='Machine-resolved locator validation only. Adds zero semantic reading or finding completion credit; original receipts and current-byte physical ranges own actual review.',json_sources=len(rows),selector_observations=counts,records=rows),indent=2)+'\n'); print(len(rows),counts)
