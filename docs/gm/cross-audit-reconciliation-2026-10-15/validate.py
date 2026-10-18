from pathlib import Path
import json,re,hashlib,datetime,urllib.parse,subprocess
root=Path.cwd();o=root/'docs/gm/cross-audit-reconciliation-2026-10-15';p=o/'private'
def sha(f):return hashlib.sha256(f.read_bytes()).hexdigest()
def slugs(f):
 counts={};anchors=set()
 for line in f.read_text(errors='replace').splitlines():
  if not re.match(r'^#{1,6} ',line):continue
  s=re.sub(r'<[^>]*>','',line.lstrip('#').strip()).lower();s=re.sub(r'[^\w\- ]','',s);s=s.replace(' ','-')
  n=counts.get(s,0);counts[s]=n+1;anchors.add(s+(f'-{n}' if n else ''))
 return anchors
errors=[];links=0;anchors=0
if not (p/'MATERIAL_INPUTS.json').exists():(p/'MATERIAL_INPUTS.json').write_text('{}\n')
(o/'VALIDATION.json').write_text('{}\n')
for f in sorted(o.glob('*.md')):
 for dest in re.findall(r'\[[^\]]+\]\(([^)]+)\)',f.read_text()):
  dest=dest.strip().strip('<>')
  if re.match(r'\w+://|mailto:',dest):continue
  target,_,anchor=dest.partition('#');target=urllib.parse.unquote(target);t=(f.parent/target).resolve() if target else f
  links+=1
  if not t.exists():errors.append({'file':str(f.relative_to(root)),'link':dest,'error':'missing target'});continue
  if anchor and t.suffix=='.md':
   anchors+=1
   if urllib.parse.unquote(anchor) not in slugs(t):errors.append({'file':str(f.relative_to(root)),'link':dest,'error':'missing anchor'})
json_count=0
for f in p.glob('*.json'):
 json.loads(f.read_text());json_count+=1
summary=json.loads((p/'EXTRACTION_SUMMARY.json').read_text());assert summary['extracted_records']==72
assert not summary['input_drift']
# Compare material input pins captured by specialist readers, without claiming those files reread in full.
materials=[]
for name in ['PROPAGATION_RETURN.md','INTERACTION_RETURN.md']:
 for line in (o/name).read_text().splitlines():
  m=re.search(r'^\| `([^`]+)`.*?\| `([a-f0-9]{64})` \|$',line)
  if not m:continue
  rel,old=m.groups();f=root/rel
  if f.is_file():materials.append({'path':rel,'reader':name,'read_hash':old,'current_sha256':sha(f),'unchanged':sha(f)==old})
for rel in ['docs/research/qud-systems-audit-2026-10-15/CURRENT.md','docs/gm/dispatch/ui-foundation-2026-10-15/R6_CHECKPOINT.md']:
 f=root/rel;materials.append({'path':rel,'reader':'root final reread','current_sha256':sha(f),'read_scope':'all current small checkpoint/entrypoint'})
(p/'MATERIAL_INPUTS.json').write_text(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'files':materials},indent=2)+'\n')
ignore=subprocess.run(['git','check-ignore',str(p/'WORKTREES.json')],text=True,capture_output=True).returncode==0
if not ignore:errors.append({'error':'private manifest not ignored'})
result={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'PASS' if not errors else 'FAIL','local_links_checked':links,'anchors_checked':anchors,'private_json_parsed':json_count,'extraction_records':72,'full_line_reads':45,'partial_reads':27,'material_hash_observations':len(materials),'material_drift':[m for m in materials if m.get('unchanged') is False],'private_ignore':ignore,'errors':errors,'proof_scope':'Documentation paths, anchors, JSON, hashes and batch accounting only. Original quotations/shared source were not edited by this task. No runtime tests/build/browser/game/save/human acceptance.'}
(o/'VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
