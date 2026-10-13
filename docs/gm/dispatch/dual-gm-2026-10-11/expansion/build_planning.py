"""Owned planning artifact assembler; reads public parents, writes this directory only."""
import json, hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[5]
OUT=Path(__file__).resolve().parent
PRIV=ROOT/'docs/research/novels/world-depth-2026-10-11'
def save(name,data): (OUT/name).write_text(json.dumps(data,indent=2)+'\n')
parent=ROOT/'docs/gm/dispatch/idea-expansion-2026-10-11/DETAIL_LEDGER.json'
d=json.loads(parent.read_text())
sections=json.loads((ROOT/'docs/worlds/templates/COMPLETION_LEDGER.template.json').read_text())['sections']
rows=[
('E01',['S02','S14'],['G1-001','G1-002','G1-029','G5-02'],'Committed coherent entry','src/simulation.js:597; src/expansion_engine.js:69; src/main.js:961',
'chooseSimulationOrigin settles origin.selected and authored effects; createExpansionState initializes base.frontier; commandOptionalPack enters from Village. None alone initializes a source-qualified random native beginning.',
'Proposed initializer input: poolRevision, pendingSeed, candidateId, contentRevision, actor/body/native snapshot, prior cause state, known means and location. Output: validated replacement envelope plus publication bindings; use persistExpansionPlan replacementEnvelope/nativePublication after compatible native creation is settled. Freeze result before live publication; never reroll on render/reload.',
['Selected ordinary snapshot has real first work and recovery controls without Village enrollment.','Stale/invalid candidate and failed write publish no body, claims or grant; retry retains the candidate.','Loaded prior life preserves location and completed origin; unavailable mandatory pack pauses with export/recovery rather than automatic fresh random entry.']),
('E02',['S01','S11','S12','S14'],['G4-02','G4-04','G5-03'],'Causal history and instance binding','src/world_instances.js:136; src/world_instances.js:271; src/simulation.js:542',
'World bindings namespace sites/facts/unique claims; simulation people, many native owners and quests remain separately keyed. An era label does not supply past causes.',
'Proposed compiler takes private era snapshot plus instanceId and maps people, stock, custody, relationships, quests, event causes, body records and native access. Return validated bindings and staged initial state, with no fabricated player deeds. Historical-content snapshots need not wait for a rewind engine.',
['Two instances never share unique custody, reward claims or NPC memories.','After-event start contains the surviving stock/people and actual access changes, without replaying past wages.','Return targets saved instance; removed pack retains opaque domain.']),
('E03',['S05','S06','S14'],['G3-011','G3-012','G5-08'],'Actual custody and local currency','src/content_packs.js:19; src/acquisition.js:39; src/gameplay_transactions.js',
'Current pack patches scalar compartments. stageAcquisition and simulation transfers model real owner inventories; pack-local silver is not native money.',
'Proposed pack adapter binds each material unit to an owner/custody identity, not both a counter and duplicate inventory item. Stage native item grants/consumes and local payment with the same envelope. Declarations identify owned, loaned and institutional stock; no Village auto-debit.',
['One transfer conserves units across personal, issued and stored custody.','Double click, interrupted work or failed save cannot claim wage twice.','Native equipped issued kit follows loan return and permission; unpaid attachment/free teaching variant introduces no invented fee.']),
('E04',['S04','S09','S10','S13'],['G4-14','G5-07','G7-02'],'Observed people and means','src/content_pack_ui.js:18; src/people_knowledge.js:14; src/simulation_contracts.js',
'Pack panel displays every listed person description/memoryField; knownPeopleView uses witnessed flags and attributed records for bounded public-world hosts. A general private pack projection is missing.',
'Proposed private-definition projection input: observerId, introduced people, observed memories with cause/channel/time, actually held appraisal means. Output: known rows only. Definition load does not introduce a person or grant their hidden score; NPC commands use the same supported means.',
['Unmet person and unwitnessed event remain absent on every panel/export-friendly plain display.','Receiving a local report changes the recipient only; an actual communication chain can spread it.','Used qualified reveal means discloses its real scope, including genuinely promised future information, without exposing unrelated author data.']),
('E05',['S02','S07','S08','S14'],['G1-009','G2-001','G2-026','G5-05'],'Body source and execution','src/body_progression.js:65; src/techniques.js:85; src/native_realm_traveler.js:22',
'Existing body and technique records have finite consumers; conventional native traveler projects a physical single-body passage. Pack scalar mode is not a faculty or alternate body.',
'Proposed functional provider record separates source, body support, trained control, fuel, target scope and authority. Each selected action resolves actual provider and native effect; carrying remembered instruction alone is insufficient unless the declared mechanism grants execution. Retain full inherited faculty variants.',
['Remembered method without its necessary support stays known but cannot execute.','Full-source counterpart receives the actual promised execution, not only a bonus.','Lost device/body support stops only dependent functions and restores them when support returns.']),
('E06',['S07','S08','S09','S14'],['G2-002','G2-016','G5-06'],'Ordered local special function','src/content_packs.js:75; src/simulation_effects.js; src/expansion_persistence.js:7',
'Pack actions apply scalar start/complete patches; they do not perform live-target containment, resistance, partial geometry or exceptional authority.',
'Proposed selected-function planner takes actor/target IDs, supported source/control, target owner state and observed channel; outputs one ordered envelope plan plus result/observer receipt. Private rules decide successful, resisted and exceptional cases. No universal cap/cost or automatic fairness counter.',
['Function changes actual target state and custody, including the source-supported stronger variant.','Failure or interruption leaves the exact declared aftermath and spends only declared consumed means.','A later exception uses its own source authority; early character belief remains an attributed belief.']),
('E07',['S04','S05','S10','S11'],['G3-001','G3-013','G3-019','G3-020'],'Work to institutional consequence','src/content_packs.js:81; src/simulation.js:449; src/world_instances.js:310',
'Current pack runs one active timed job, paused outside its visit. It does not schedule an independent institution or workforce.',
'Proposed local institutional plan binds actual staff, orders, stock and completed work to one downstream route/service/project. Reuse simulation jobs and boundary host after pack-to-simulation binding exists; declared absence policy applies to this local campaign only.',
['Successful ordinary work changes available supply and a real later opportunity.','Exceptional production changes throughput and institutional demand rather than being secretly throttled.','Unavailable staff/stock prevents only dependent work; completed contribution survives retirement and return.']),
('E08',['S01','S10','S11','S14'],['G4-03','G4-05','G4-06','G5-04'],'Natural course and changed causes','src/world_instances.js:310; src/simulation.js:440; src/expansion_engine.js:582; src/main.js:6737',
'Generic world clock consumes occupied intervals; optional clock branch advances calendar and local job only. Existing other hosts have distinct activity policies. There is no selected world-wide causal event program in this pack.',
'Proposed selected event definition records predecessor causes, participants/means, resource requirements, earliest boundary, occurrence, observation routes and changed availability. Disturbing a cause changes its dependent outcomes; no lore-forced replacement. Local policy specifies offscreen/stopped/rate behavior separately.',
['Abstaining lets valid causes proceed; absent failed causes cannot produce their original outcome.','Intervening changes downstream actors/access/resources, not only narration.','Exact event boundary and failed-save retry settle once; hidden occurrence does not reveal itself to everyone.']),
('E09',['S11','S12','S14'],['G2-004','G2-008','G4-08','G4-10'],'Parallel replay rollback and carriers','src/expansion_engine.js:652; src/expansion_engine.js:668; src/native_realm_traveler.js:8',
'Scenario rewind has finite scope; world records and cargo owners exist. None prove arbitrary parallel native history, exact future sight or full-world rollback.',
'Proposed selected temporal contract lists included snapshot domains, retained domains, exported transfers/receipts, branch identity and content revision. Exact prediction needs isolated actual dynamics and affected RNG; modeled forecast states its boundary. Rollback resolves external transfers explicitly rather than cloning them.',
['Replay does not clone a previously exported unique item or erase an external recipient.','Parallel histories preserve independent people/claims and known-history provenance.','Exact resume uses archived real state; lossy biography cannot reconstruct it.']),
('E10',['S06','S07','S13','S14'],['G6-001','G5-09','G7-03'],'Material device fixture and presentation','src/content_packs.js:23; src/main.js; src/techniques.js:85',
'Private pack schema has no generic recipe/device renderer or equipment/fixture integration. Native mechanisms exist but each selected consumer must be bound.',
'Proposed material/device record states actual inputs, assembly, ownership, function, maintenance if sourced and later consumer; fixtures contribute only to an inspected relevant activity. VFX receives actual resolved outcome plus observer projection, never determines the outcome.',
['Device output is usable by the later craft/work/function consumer.','Moving/removing a fixture changes only its actual local effect and reload cannot multiply it.','Quiet/craft/show-power full/static/plain/off forms keep equivalent supported knowledge and controls.']),
('E11',['S02','S13','S14'],['G1-006','G1-016','G1-021','G5-05','G7-01'],'Nonconventional agency','src/content_pack_ui.js:2; src/body_progression.js:32; src/main.js:978',
'Pack panel assumes the existing adult actor can issue actions. A family label, infant label, object label or host relation supplies no viable perception/control.',
'Proposed per-selected-form controller declares legal perception/signaling/command actions, actual holder/caregiver/host roles and identity transition. For dependent bodies, support is held by actual people with their own means. Free/perpetual/powerful support remains possible where premise grants it.',
['Chosen form has a real first action and an observable continuing effect.','Caregiver/host refusal or lost support follows the actual mechanism; no invented guaranteed care.','Stage transition preserves actual means/relationships, grants no unexplained adulthood mastery and keeps recovery/export reachable.']),
('E12',['S00','S14'],['G7-06','G7-07','G5-11','G5-12'],'Private admission migration and proof','src/content_packs.js:23; src/content_packs.js:67; src/content_packs.js:90; src/save_files.js:38',
'Installed schema1 uses stable identity/location lists, additive initial scalars and dormant absent-pack preservation; changed identity needs explicit migration. No full schema2 world model is present.',
'Proposed admission keeps source-specific definitions outside git/bundle, pins content and source revisions, validates adapter capabilities before registration, stages additive migrations and preserves unsupported originals. Each packet freezes actual paths only after writer reservation, then binds input hashes/build/browser/save evidence.',
['No source identity/truth appears in public source, bundle, synthetic fixtures or reports.','Absent/restored unchanged pack preserves pending work and paid receipts; changed identity has explicit migration or safe rejection.','Generated old/new saves, failed-write rollback, rebuilt fresh browser and import qualify only the selected packet; director acceptance stays separate.'])
]
known={r['id'] for r in d['requirements']}
cards=[]
for rid,secs,parents,title,consumer,fact,interface,cases in rows:
 cards.append(dict(id='W1-'+rid,sections=secs,title=title,authority='2026-10-11 expansion assignment; implementation remains unassigned',classification='new consumer or shared extension; source inspected, runtime unverified',parentIds=[p for p in parents if p in known],unresolvedParentAliases=[p for p in parents if p not in known],owner='future reserved integrator; no runtime reservation',sourceRefs=consumer.split('; '),inspectedFact=fact,proposedInterface=interface,criterion=cases[0],dependencies=[] if rid in ['E03','E04','E12'] else ['W1-E12'],persistence='One existing save envelope, durable before live; retain unrelated/dormant fields; generated fixtures only.',cases=[dict(id=f'W1-{rid}-C{i+1:02}',criterion=c,status='specified-not-run') for i,c in enumerate(cases)],remaining='Reserve exact runtime paths; select private leaf bindings; implement and prove named cases.'))
deps={'E01':['E02','E04','E05','E12'],'E02':['E04','E12'],'E03':['E12'],'E04':['E12'],'E05':['E12'],'E06':['E03','E04','E05','E12'],'E07':['E03','E04','E12'],'E08':['E02','E04','E12'],'E09':['E02','E03','E04','E05','E08','E12'],'E10':['E03','E04','E05','E12'],'E11':['E04','E05','E12'],'E12':[]}
for c in cards:
 c['dependencies']=['W1-'+v for v in deps[c['id'].removeprefix('W1-')]]
 c['conditionalDependencies']={'W1-E01':['W1-E11 when chosen body needs a nonconventional controller'],'W1-E07':['W1-E08 when selected independent institution advances offscreen'],'W1-E06':['W1-E09 only for selected temporal function']}.get(c['id'],[])
save('ENGINE_CONTRACTS.json',dict(schema='w1-expansion-engine-planning-1',revision=1,runtimeClaim=False,cards=cards))
# Every prior parent gets an explicit forward disposition. This is intake accounting, not complete local qualification.
intake=[]
for r in d['requirements']:
 secs=r.get('sections',[])
 if not secs: secs=['S00']
 joined=[c['id'] for c in cards if r['id'] in c['parentIds']]
 routes=[]
 if any(s in secs for s in ['S01','S02','S09','S10','S11','S12','S13']): routes.append('private starts/continuity/variant qualification')
 if any(s in secs for s in ['S03','S04','S05','S06','S07','S08']): routes.append('private source/functional leaf qualification')
 if any(s in secs for s in ['S00','S14']): routes.append('public integration and source boundary review')
 intake.append(dict(id=r['id'],origin=r.get('originLedger'),sections=secs,disposition='retain as conditional palette; local grounding required',localEngineCards=joined,qualificationRoutes=routes or ['integration review'],localStatus='finite selected leaves deepen related family; unselected variants remain manifest tasks',canonClaim=False,runtimeClaim=False))
save('INPUT_DISPOSITIONS.json',dict(schema='w1-parent-dispositions-1',revision=1,parentRevision=d['revision'],parentHash=hashlib.sha256(parent.read_bytes()).hexdigest(),count=len(intake),casesInherited=len(d['acceptanceCases']),extractionBoundary='All parent card IDs/sections and selected current lane reports; not a reread of every predecessor artifact or source.',parents=intake))
coverage=[]
for sec in sections:
 sid=sec['id']; coverage.append(dict(id=sid,name=sec['name'],applicability='applicable at whole-world horizon; exact source facts private',status='C0 full horizon accounted; C1 applies only to individually joined reviewed tranche leaves; full section delivery open',engineCards=[c['id'] for c in cards if sid in c['sections']],parentIds=[r['id'] for r in intake if sid in r['sections']],privateDetailOwner='source/' if sid in ['S03','S04','S05','S06','S07','S08'] else 'starts/',remaining='All unselected individual source entries, interactions and runtime proofs remain explicitly outside first tranche.'))
save('COVERAGE_MAP.json',dict(schema='w1-full-horizon-1',revision=1,sourceIdentity='opaque-world-1',sourceCoverage='Five supplied edition owners recovered; current direct spot reads private. Later editions unavailable/unassigned.',sections=coverage,completionClaim='C1 selected planning details only; no C2/C3/C4 world claim'))
inputs=['AGENTS.md','PROJECT.md','docs/gm/dispatch/dual-gm-2026-10-11/ASSIGNMENT.md','docs/gm/WORLD_ACTIONABILITY_GM_PROMPT.md','docs/WORLD_COMPLETION_STANDARD.md','docs/gm/dispatch/idea-expansion-2026-10-11/DETAIL_LEDGER.json','src/content_packs.js','src/content_pack_ui.js','src/main.js','src/save_files.js','src/simulation.js','src/world_instances.js','src/expansion_engine.js','src/people_knowledge.js','src/expansion_persistence.js','src/body_progression.js','src/techniques.js','src/native_realm_traveler.js']
save('INPUT_HASHES.json',dict(revision=1,coverage='Full loader/panel/persistence reads; targeted main/simulation/world/body/technique reads; source/library hashes recorded privately.',inputs=[dict(path=p,sha256=hashlib.sha256((ROOT/p).read_bytes()).hexdigest()) for p in inputs]))
print('Generated',len(cards),'engine cards,',len(intake),'parent dispositions,',len(coverage),'sections')
