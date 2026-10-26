"""Build this consideration's locator inventory. Not a semantic/runtime checker."""
from pathlib import Path
import hashlib, json, re
ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
specs = [
 ('FLR','docs/GROUND_RULES.md',6,'G1'),('PRF','docs/GROUND_RULES.md',8,'G1'),('FND','docs/GROUND_RULES.md',5,'G1'),
 ('AD','docs/RULES_INDEX.md',43,'G3'),('UR','docs/UI_RULES.md',75,'G4'),('AR','docs/ARCHITECTURE_RULES.md',16,'G5'),
 ('MW','docs/MOCKUP_SYSTEM.md',7,'G6'),('MR','docs/MAKING_RULES.md',36,'G7'),('SR','docs/SITE_AND_EXPLORATION_RULES.md',24,'G8'),
 ('AU','docs/AGENT_USAGE_RULES.md',15,'G11'),('GR','docs/GENERATION_FOUNDATION_RULES_2026-10-14.md',17,'G14'),
 ('CX','docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/part-9-complexity-and-openness.md',8,'G15'),
 ('WA','docs/WORLD_ABSORPTION_RULES.md',21,'G16'),('BHR','docs/DOMAIN_RULES.md',30,'G17'),('CBR','docs/DOMAIN_RULES.md',30,'G18'),
 ('ECR','docs/DOMAIN_RULES.md',33,'G19'),('SLR','docs/DOMAIN_RULES.md',43,'G20'),('PIR','docs/DOMAIN_RULES.md',25,'G21'),
 ('WPR','docs/WORLD_PASS_RULES.md',32,'G22'),('GTR','docs/PROGRESSION_GATE_RULES.md',35,'G23'),('ABR','docs/ABILITY_RULES.md',22,'G24')]
cache={}
def source(path):
 if path not in cache:
  raw=(ROOT/path).read_bytes(); cache[path]={'sha256':hashlib.sha256(raw).hexdigest(),'lines':raw.decode().splitlines()}
 return cache[path]
entries=[]
def add(code,path,group,kind='numbered_rule',index=None):
 lines=source(path)['lines']
 if kind=='evidence_level':
  hits=[(i,l) for i,l in enumerate(lines) if re.match(r'\| '+re.escape(code)+r' \w',l)]
 elif kind=='foundational':
  start=next(i for i,l in enumerate(lines) if l.startswith('## The rulebook'))
  hits=[(i,l) for i,l in enumerate(lines) if i>start and re.match(rf'^{index}\. \*\*',l)]
 else:
  hits=[(i,l) for i,l in enumerate(lines) if re.search(r'\|\s*'+re.escape(code)+r'\s*\||\*\*'+re.escape(code)+r'\.',l)]
 assert hits,code
 i,line=hits[0]
 title=re.findall(r'\*\*(.+?)\*\*',line)
 if title: title=' '.join(title)
 else:
  parts=line.split('|');title=parts[2].strip() if len(parts)>2 else line.strip()
 route='coordinator'
 if group in ['G7','G8','G16']:route='making_sites_absorption worker; coordinator reviewed return and selected source qualifications'
 if group in ['G17','G18']:route='domain_gates_abilities worker; coordinator reviewed return and cross-rule implications'
 if group=='G21':route='coordinator repaired PIR1-13; worker PIR14-25; coordinator reviewed complete body'
 if group=='G23':route='worker rule body; coordinator complete rule body and later record'
 entries.append({'code':code,'kind':kind,'owner':path,'line':i+1,'title':title,'consideration':group,
  'disposition':'ACCOUNT FOR NOW; retain existing authority, see group and material findings',
  'evidence':'S: rule source considered; not consumer-tested','inspection_route':route})
for prefix,path,n,group in specs:
 for i in range(1,n+1):add(prefix+str(i),path,group)
for i in range(1,13):add('Rulebook '+str(i),'docs/RULES_FROM_SCRATCH.md','G2','foundational',i)
primary_count=len(entries)
for prefix,n,start in [('MN',14,1),('AP',10,0),('LS',18,1),('IMP',10,1),('ML',5,1),('AA',15,1)]:
 for i in range(start,start+n):add(prefix+str(i),'docs/MEANS_AND_APPRAISAL.md','G10','palette_proposal')
for i in range(15):add('S'+str(i).zfill(2),'docs/WORLD_COMPLETION_STANDARD.md','G25','authoring_category')
for i in range(6):add('C'+str(i),'docs/WORLD_COMPLETION_STANDARD.md','G25','evidence_level')
# Read these workflow sources at their relevant standing/proposed sections; this
# is explicitly not full semantic coverage of every historical research appendix.
extra=['AGENTS.md','PROJECT.md','docs/USER_VISION.md','docs/GAME_MASTER_PROMPT.md',
 'docs/gm/SHARED_WORKTREE_PRACTICE.md','docs/TOOL_REGISTRY.md',
 'docs/research/SOURCE_ACQUISITION_TOOLS.md','docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md',
 'docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md','docs/audits/UI_DESIGN_CORE_AUDIT.md',
 'docs/audits/IMPLEMENTATION_PRACTICE_CORE_AUDIT.md',
 'docs/gm/dispatch/carry-out-queue-2026-10-26/PRIMARY_ADOPTION.md',
 'src/proto23_shell.js','src/workspace_layout.js','src/center_modes.js','src/structured_ability_runtime.js',
 'docs/worlds/templates/WORLD_COMPLETION_TEMPLATE.md']
for p in extra:source(p)
index=source('docs/RULES_INDEX.md')['lines']
a=next(i for i,l in enumerate(index) if l=='## Register of rule sets')
b=next(i for i,l in enumerate(index[a+1:],a+1) if l.startswith('## '))
rows=[l for l in index[a:b] if l.startswith('| ')][1:]
assert len(rows)==25,len(rows)
result={'scope':'Finite consideration of registered rule bodies; not an implementation audit',
 'registry_sha256':source('docs/RULES_INDEX.md')['sha256'],
 'registered_sets':[{'set':r.split('|')[1].strip(),'registered_codes':r.split('|')[2].strip(),'status':r.split('|')[3].strip()} for r in rows],
 'primary_numbered_entries_including_MW_and_Rulebook':primary_count,
 'supplemental_palette_and_completion_entries':len(entries)-primary_count,
 'behavior_evidence':'No new runtime tests or rebuilt browser proof; only named consumer samples in synthesis',
 'noncoded_dispositions':{'Ground authority/process':'G1','Sealed secrets':'G9','Means principle and axes':'G10',
 'Agent workflow':'G12','Source research':'G13','World completion prose/templates':'G25'},
 'source_inputs':{p:v['sha256'] for p,v in cache.items()},'entries':entries}
(OUT/'coverage-map.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(f'{len(rows)} register rows; {primary_count} primary numbered entries; {len(entries)-primary_count} supplemental entries; {len(cache)} input files')
