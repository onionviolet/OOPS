"""Validate this static research artifact, never run game/source code."""
import hashlib,json,re
from pathlib import Path
out=Path(__file__).resolve().parent
c=json.loads((out/'READ_COVERAGE.json').read_text());u=json.loads((out/'UNREAD.json').read_text());f=json.loads((out/'FINDINGS.json').read_text())
errors=[];sources={s['id']:s for s in c['sources']}
manifest=json.loads(Path('/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/FILE_MANIFEST.json').read_text());manifest={x['path']:x for x in manifest}
for s in sources.values():
 p=Path(s['path']); b=p.read_bytes(); n=len(b.decode().splitlines())
 if hashlib.sha256(b).hexdigest()!=s['sha256']: errors.append('source hash '+s['id'])
 if manifest[s['file']]['sha256']!=s['sha256'] or manifest[s['file']]['current_installed_sha256']!=s['sha256']:errors.append('installed receipt mismatch '+s['id'])
 for a,z in s['read_spans']:
  if not 1<=a<=z<=n:errors.append('source range '+s['id'])
for finding in f['findings']:
 for r in finding['sources']:
  s=sources[r['source_id']];a,b=r['lines']
  if not any(x<=a<=b<=y for x,y in s['read_spans']):errors.append('finding outside read window '+finding['id'])
if len(u['files'])!=len(manifest) or {x['file'] for x in u['files']}!=set(manifest):errors.append('unread file coverage')
for entry in u['files']:
 n=manifest[entry['file']]['lines'];s=next((s for s in sources.values() if s['file']==entry['file']),None); read=set(i for a,b in s['read_spans'] for i in range(a,b+1)) if s else set();unread=[i for a,b in entry['unread_lines'] for i in range(a,b+1)]
 if len(unread)!=len(set(unread)) or set(unread)&read or set(unread)|read!=set(range(1,n+1)):errors.append('span accounting '+entry['file'])
links=0
for p in out.glob('*.md'):
 for link in re.findall(r'\]\(([^)]+)\)',p.read_text()):
  if '://' in link or link.startswith('#'):continue
  links+=1
  if not (p.parent/link.split('#')[0]).exists():errors.append('broken link '+p.name+' '+link)
result={'status':'PASS' if not errors else 'FAIL','source_files_checked':len(sources),'readable_files_accounted':len(manifest),'findings':len(f['findings']),'local_links_checked':links,'source_hashes':'match frozen extraction and sibling current-installed receipt','scope':'Static artifact integrity only; no runtime/gameplay/cleanup execution proof','errors':errors}
(out/'VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
