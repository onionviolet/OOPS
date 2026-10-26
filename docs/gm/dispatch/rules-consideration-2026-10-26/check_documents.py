"""Check this report's inventory, locators and local file links only."""
from pathlib import Path
import hashlib, json, re
ROOT=Path(__file__).resolve().parents[4]
HERE=Path(__file__).resolve().parent
report=ROOT/'docs/audits/RULES_CONSIDERATION_2026-10-26.md'
data=json.loads((HERE/'coverage-map.json').read_text())
errors=[]; drift=[]
entries=data['entries']; codes=[e['code'] for e in entries]
if len(codes)!=len(set(codes)):errors.append('duplicate code entries')
if len(data['registered_sets'])!=25:errors.append('register count')
if data['primary_numbered_entries_including_MW_and_Rulebook']!=543:errors.append('primary code coverage count')
if len(entries)!=636:errors.append('total coverage count')
text=report.read_text()
for e in entries:
 lines=(ROOT/e['owner']).read_text().splitlines()
 if e['code'].startswith('Rulebook '):found=re.match(r'^'+e['code'].split()[1]+r'\. ',lines[e['line']-1])
 else:found=e['code'] in lines[e['line']-1]
 if not found:errors.append(f"bad locator {e['code']}")
 if f"**{e['consideration']} " not in text:errors.append(f"no consideration {e['code']}")
for p,h in data['source_inputs'].items():
 if hashlib.sha256((ROOT/p).read_bytes()).hexdigest()!=h:drift.append(p)
link_count=0
for p in [report,*HERE.glob('*.md')]:
 s=p.read_text()
 if '\u2014' in s:errors.append(f'em dash: {p.name}')
 for label,target in re.findall(r'\[([^\]]+)\]\(([^)]+)\)',s):
  if '://' in target or target.startswith('#'):continue
  path=target.split('#')[0]
  if path and not (p.parent/path).exists():errors.append(f'broken link {p.name}: {target}')
  link_count+=1
 for i,l in enumerate(s.splitlines(),1):
  if l.rstrip()!=l:errors.append(f'trailing whitespace {p.name}:{i}')
print(f'{len(data["registered_sets"])} register rows; {len(entries)} unique locators; {link_count} local file links')
print('Input drift since inventory:', ', '.join(drift) if drift else 'none')
for error in errors:print('FAIL',error)
if errors:raise SystemExit(1)
print('PASS: document coverage/locators/links/whitespace; no semantic or runtime certification')
