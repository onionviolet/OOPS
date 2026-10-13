"""Document-only checks for the frozen connection planning return."""
import hashlib,json,re
from pathlib import Path

HERE=Path(__file__).resolve().parent
REPO=HERE.parents[3]
errors=[]
manifest=json.loads((HERE/'MANIFEST.json').read_text())
files=['COVERAGE.md','DETAIL_CARDS.md','CAUSAL_JOINS.md','RESEARCH_AND_CAPABILITY_MAP.md','IMPLEMENTATION_PACKETS.md','REPORT.md','CHECKPOINT.md','REVIEW.md']
for f in files:
 if not (HERE/f).is_file():errors.append('Missing '+f)
text=(HERE/'DETAIL_CARDS.md').read_text()
blocks=re.split(r'^### (X\d\d-[AB])\b[^\n]*\n',text,flags=re.M)
ids=blocks[1::2];expected=[f'X{i:02}-{s}' for i in range(1,19) for s in 'AB']
if ids!=expected:errors.append('Frozen leaf order/uniqueness mismatch')
leaf_checks=[]
for id,block in zip(ids,blocks[2::2]):
 checks={
 'provenance':bool(re.search(r'Owner|owner',block)),
 'means':bool(re.search(r'means',block,re.I)),
 'discovery_verb':bool(re.search(r'discovery',block,re.I) and re.search(r'verb',block,re.I)),
 'order':bool(re.search(r'order',block,re.I)),
 'consumer_response':bool(re.search(r'consumer|effect',block,re.I) and re.search(r'channel|response',block,re.I)),
 'continuation':bool(re.search(r'continuation',block,re.I)),
 'refusal_interruption':bool(re.search(r'interruption',block,re.I) and re.search(r'refusal|decline|refuse',block,re.I)),
 'save_gate':bool(re.search(r'save|state',block,re.I) and re.search(r'gate',block,re.I)),
 'substantial':len(block.split())>=180}
 leaf_checks.append({'id':id,'words':len(block.split()),'checks':checks})
 for key,passed in checks.items():
  if not passed:errors.append(id+' missing '+key)
coverage=(HERE/'COVERAGE.md').read_text()
for id in [f'C{i:02}' for i in range(1,8)]+[f'E{i:02}' for i in range(1,11)]+[f'X{i:02}' for i in range(1,19)]:
 if not re.search(r'\| '+id+r' \|',coverage):errors.append('Coverage row missing '+id)
joins=(HERE/'CAUSAL_JOINS.md').read_text()
join_ids=re.findall(r'^## (J\d\d)\b',joins,re.M)
if join_ids!=[f'J{i:02}' for i in range(1,7)]:errors.append('Join ID/order mismatch')
for id,block in zip(re.split(r'^## (J\d\d)\b[^\n]*\n',joins,flags=re.M)[1::2],re.split(r'^## (J\d\d)\b[^\n]*\n',joins,flags=re.M)[2::2]):
 if not all(x.lower() in block.lower() for x in ['forward','back','recipient','channel','save']):errors.append(id+' causal fields missing')
packets=(HERE/'IMPLEMENTATION_PACKETS.md').read_text()
packet_ids=re.findall(r'^### (CD-P\d)\b',packets,re.M)
if packet_ids!=[f'CD-P{i}' for i in range(1,6)]:errors.append('Packet ID/order mismatch')
# G and ST IDs in final outputs are verified against authoritative parsed ledgers.
g=json.loads((REPO/'docs/gm/dispatch/idea-expansion-2026-10-11/DETAIL_LEDGER.json').read_text())
st=json.loads((REPO/'docs/gm/dispatch/starts-talents-continuity-2026-10-11/DETAIL_LEDGER.json').read_text())
known_g={r['id'] for r in g['requirements']};known_st={r['id'] for r in st['additiveRequirements']}
link_count=0
for file in files:
 p=HERE/file
 if not p.exists():continue
 t=p.read_text()
 for id in set(re.findall(r'\bG[1-8]-\d{2,3}\b',t)):
  if id not in known_g:errors.append(file+' unknown prior G ID '+id)
 for id in set(re.findall(r'\bST[PC]-[A-Z]?\d{2,3}\b',t)):
  if id not in known_st:errors.append(file+' unknown prior ST ID '+id)
 for dest in re.findall(r'\[[^\]]*\]\(([^)]+)\)',t):
  if re.match(r'\w+://',dest):continue
  dest=dest.split('#')[0]
  if dest and not (p.parent/dest).resolve().exists():errors.append(file+' missing link '+dest)
  link_count+=1
 if '\u2014' in t:errors.append(file+' contains em dash')
 if any(line.rstrip()!=line for line in t.splitlines()):errors.append(file+' trailing whitespace')
inputs=json.loads((HERE/'INPUTS.json').read_text())
drift=[r['path'] for r in inputs['inputs'] if hashlib.sha256((REPO/r['path']).read_bytes()).hexdigest()!=r['sha256']]
result={'scope':'document structure, public provenance IDs, links and inspection-end input drift only','families':35,'leaves':len(ids),'joins':len(join_ids),'packets':len(packet_ids),'localLinksChecked':link_count,'leafChecks':leaf_checks,'inputDrift':drift,'errors':sorted(set(errors)),'runtimeTests':'not run','status':'pass' if not errors else 'fail'}
(HERE/'VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='leafChecks'},indent=2))
raise SystemExit(bool(errors))
