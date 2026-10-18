from pathlib import Path
import json,re,hashlib
out=Path(__file__).resolve().parent;root=out.parent;errors=[];checks={}
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
receipts=[root/'qud-systems-audit-2026-10-15/depth-3/VALIDATION.json',root/'rain-world/emergence-2026-10-15/extraction/VALIDATION.json',root/'rain-world/emergence-2026-10-15/audit/VALIDATION.json',root/'dwarf-fortress/emergence-2026-10-15/extraction/VALIDATION.json',root/'dwarf-fortress/emergence-2026-10-15/audit/VALIDATION.json']
for f in receipts:
 d=json.loads(f.read_text());passed=d.get('status')=='PASS' or (d.get('passed') is True and not d.get('errors'));checks[str(f.relative_to(root))]='PASS' if passed else 'FAIL'
 if not passed:errors.append('lane validation '+str(f))
# Normalize receipt schemas without modifying separately owned evidence.
rw=json.loads((root/'rain-world/emergence-2026-10-15/extraction/SOURCE_INDEX.json').read_text())
for r in rw['entries']:
 f=Path(r['path'])
 if not f.exists() or sha(f)!=r['sha256'] or f.stat().st_size!=r['bytes']:errors.append('Rain World raw source mismatch '+r['type'])
if sha(Path(rw['input']))!=rw['input_sha256']:errors.append('Rain World installed assembly changed')
areas=[out,root/'rain-world/emergence-2026-10-15/extraction',root/'rain-world/emergence-2026-10-15/audit',root/'dwarf-fortress/emergence-2026-10-15/extraction',root/'dwarf-fortress/emergence-2026-10-15/audit'];links=[]
for area in areas:
 for f in area.glob('*.md'):
  for url in re.findall(r'\]\(([^)]+)\)',f.read_text()):
   if '://' in url or url.startswith('#'):continue
   target=f.parent/url.split('#')[0];links.append({'from':str(f),'url':url,'exists':target.exists()})
   if not target.exists():errors.append('broken link '+str(f)+' '+url)
result={'status':'PASS' if not errors else 'FAIL','scope':'Research integration consistency only. No native gameplay, save, implementation or runtime acceptance.','lane_receipts':checks,'Rain_World_raw_classes_independently_hash_checked':len(rw['entries']),'local_links_checked':len(links),'errors':errors,'documents':{f.name:sha(f) for f in out.glob('*.md')}}
(out/'VALIDATION.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2));raise SystemExit(bool(errors))
