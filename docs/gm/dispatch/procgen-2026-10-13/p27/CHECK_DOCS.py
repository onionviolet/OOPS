"""Static docs checks only; writes CHECKS.json inside P27."""
from pathlib import Path
import hashlib, json, re, subprocess
from datetime import datetime, timezone
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
required = ['CHECKPOINT.md','JOURNEYS.md','EXPEDITIONS.md','LEADING_GROUPS.md','DISCIPLES.md','DEATH_AND_AFTER.md','MORE.md','REPORT.md']
files = sorted(HERE.glob('*.md'))
errors, links, locators, fragments = [], [], [], []
for name in required:
    if not (HERE/name).is_file(): errors.append('Missing '+name)
for p in files:
    text=p.read_text()
    if 'proposal' not in text.lower(): errors.append('Proposal marker '+p.name)
    if '\u2014' in text or ' -- ' in text: errors.append('Punctuation '+p.name)
    for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)',text):
        if target.startswith(('https://','http://')): continue
        path=(p.parent/target.split('#',1)[0]).resolve()
        links.append({'file':p.name,'target':target,'exists':path.exists()})
        if not path.exists(): errors.append('Link '+p.name+' -> '+target)
        if path.exists() and path.suffix=='.md' and '#' in target:
            fragment=target.split('#',1)[1]
            headings=re.findall(r'^#{1,6}\s+(.+)$',path.read_text(),re.M)
            slugs=[re.sub(r'[^\w\s-]','',h.lower()).replace(' ','-') for h in headings]
            valid=fragment in slugs
            fragments.append({'file':p.name,'target':target,'heading_exists':valid})
            if not valid: errors.append('Fragment '+p.name+' -> '+target)
    for m in re.finditer(r'(src/[A-Za-z0-9_./-]+\.js):([0-9,-]+)',text):
        source=ROOT/m[1]
        for span in m[2].strip(',').split(','):
            ends=span.split('-');lo=int(ends[0]);hi=int(ends[-1])
            valid=source.is_file() and 1<=lo<=hi<=len(source.read_text().splitlines())
            locators.append({'file':p.name,'source':m[1],'start':lo,'end':hi,'in_bounds':valid})
            if not valid: errors.append('Locator '+p.name+' -> '+m[1]+':'+span)
text='\n'.join(p.read_text() for p in files)
coverage={
'root_codes':all(s in text for s in ['AA1','AA2','AB1','AB2','AC1','AC2','AC3']),
'ports':all(str(s) in text for s in [21600,21610,21620,21630,21640]),
'reference_games':all(s in text for s in ['Oregon Trail','FTL','Banner Saga','Crusader Kings','Mount & Blade','Kenshi','Dwarf Fortress']),
'P15_extensions':all(s in text for s in ['RUNTIME_TEXT','DIALOGUE','AUTHORING_PIPELINE','Ink']),
'scope_guards':all(s in text.lower() for s in ['no hunger death','absence','no procedural geometry','proposal'])}
errors.extend('Coverage '+k for k,v in coverage.items() if not v)
sources=set(ROOT.glob('src/causal_story_*.js'))|set(ROOT.glob('src/simulation*.js'))|set(ROOT.glob('src/event_feed*.js'))
sources|={ROOT/s for s in ['src/main.js','src/world_visit_history.js','src/life_record.js','src/people_knowledge.js','src/pathfinding.js','src/models/location.js','src/data/locations.js','src/market_saturation.js','src/known_routes.js','src/known_routes_host.js','src/native_realm_traveler.js','src/realm_traveler_profiles.js','src/expedition_content.js','src/expedition_ui.js','src/npc_lives.js','src/chronicle.js','src/chronicle_ui.js','src/life_experience.js']}
record={'status':'PASS' if not errors else 'FAIL','evidenceLabel':'STATIC_DOCS_ONLY','proposalOnly':True,
'checkedAt':datetime.now(timezone.utc).isoformat(),'headAtCheck':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),
'counts':{'requiredFiles':len(required),'markdownFiles':len(files),'localLinks':len(links),'headingFragments':len(fragments),'sourceLocators':len(locators),'coverageGroups':len(coverage),'sourceFingerprints':len(sources)},
'coverage':coverage,'errors':errors,'localLinks':links,'headingFragments':fragments,'sourceLocators':locators,
'sourceFingerprints':{str(p.relative_to(ROOT)):{'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'lines':len(p.read_text().splitlines())} for p in sorted(sources)},
'limits':['Inventory, markers, local target existence, simple heading slugs and source line bounds only.',
'Hashes pin bytes at check time in a concurrent checkout, not a build or guaranteed unchanged read window.',
'No runtime tests, build, browser, save operations, commit or primary canon authentication.',
'Manual disclosure review is bounded; no sealed/private novel inputs opened.']}
(HERE/'CHECKS.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'status':record['status'],'counts':record['counts'],'errors':errors},indent=2))
raise SystemExit(bool(errors))
