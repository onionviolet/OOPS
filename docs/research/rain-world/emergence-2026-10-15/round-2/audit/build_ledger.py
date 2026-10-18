from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent
old=json.loads((root/'../../audit/READ_LEDGER.json').read_text())
raw=Path('/Users/weiwei/.codex/research/rain-world-emergence-2026-10-15/round-2')
idx=json.loads((raw/'SOURCE_INDEX.json').read_text())
newranges={'Tracker':[[250,976]],'ThreatTracker':[[183,416]],'LizardPather':'full','PathFinder':[[1435,1485],[1731,1790],[1821,1870]],'LizardAI':[[1490,1575]],'ArtificialIntelligence':[[319,340]],'RoomRain':[[60,110],[311,349],[465,556]],'GlobalRain':[[53,222],[269,326],[457,474]],'RainCycle':[[500,558]],'Creature':[[292,322],[535,552],[575,605],[1228,1255]],'AbstractPhysicalObject':[[80,200],[582,640],[644,692],[708,756]],'PhysicalObject':[[490,520],[655,676]],'BodyChunk':[[516,534]],'PathCost':'full','PathfinderResourceDivider':'full','QuickConnectivity':[[97,268]]}
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
entries={e['type']:dict(e) for e in old['classes']}
for e in idx['entries']:
 if e['type'] in ['DeathRain','UnityEngine.Mathf']:continue
 if e['type'] in entries:assert e['sha256']==entries[e['type']]['sha256'],e['type']
 else:entries[e['type']]={'type':e['type'],'path':e['path'],'sha256':e['sha256'],'lines':e['lines'],'reviewed_line_windows':[]}
def merge(rr):
 result=[]
 for a,b in sorted(rr):
  if result and a<=result[-1][1]+1:result[-1][1]=max(result[-1][1],b)
  else:result.append([a,b])
 return result
for name,e in entries.items():
 rr=newranges.get(name,[]); rr=[[1,e['lines']]] if rr=='full' else rr
 e['round_2_reviewed_line_windows']=merge(rr)
 e['reviewed_line_windows']=merge(e['reviewed_line_windows']+rr)
 c=[];pos=1
 for a,b in e['reviewed_line_windows']:
  if pos<a:c.append([pos,a-1])
  pos=b+1
 if pos<=e['lines']:c.append([pos,e['lines']])
 e['unread_line_windows']=c
 e['status']='full-class-read' if not c else ('selected-windows-read' if e['reviewed_line_windows'] else 'captured-unread')
 e['note']='Cumulative auditor reading only, exact hashes joined. Full class read is not closure of dependencies/native behavior.'
# Extra support module/IL have separate provenance; do not inflate main game class totals.
math=json.loads((raw/'extract/UnityEngine.Mathf.receipt.json').read_text());math['reviewed_line_windows']=[[298,310],[330,350],[444,452]]
il=raw/'extract/RoomRain.il'
support=[{'type':'UnityEngine.Mathf','path':math['path'],'sha256':math['sha256'],'lines':math['lines'],'input':math['input'],'input_sha256':math['input_sha256'],'reviewed_line_windows':math['reviewed_line_windows']}, {'type':'RoomRain IL method','path':str(il),'sha256':sha(il),'reviewed_line_windows':[[299014,299124]],'note':'Whole-assembly IL output; only the named method window was read.'}]
ledger={'input_sha256':idx['input_sha256'],'prior_ledger':'../../audit/READ_LEDGER.json','classes':list(entries.values()),'support_sources':support,'aliases':[{'requested_type':'DeathRain','canonical_export':'GlobalRain','why':'Exact duplicate source output containing nested GlobalRain.DeathRain; not another outer class.'}]}
(root/'READ_LEDGER.json').write_text(json.dumps(ledger,indent=2)+'\n')
def loc(t,m,a,b):
 e=entries.get(t) or next(s for s in support if s['type']==t)
 return {'type':t,'method':m,'path':e['path'],'sha256':e['sha256'],'start_line':a,'end_line':b}
facts=[('RW2-F1','Hypothesis propagation, privileged room knowledge and negative-evidence cleanup',[
loc('Tracker','ElaborateCreatureRepresentation and Ghost lifecycle',250,681),loc('Tracker','constructor/Update sampled dismissal',682,763),loc('Tracker','SeeCreature and ForgetCreature tail',958,976)],['Full Tracker body cumulatively read; AI.VisualContact/AI map dependencies remain unread.','No native search latency, fairness or timing claim.']),
('RW2-F2','Flee risk scoring, bounded work and body-aware path selection',[
loc('ThreatTracker','FleeTo/EvaluateFlightDestThreat/ThreatOfPath',183,416),loc('LizardPather','FollowPath and heuristics',1,156),loc('PathCost','Legality and operators',1,130),loc('PathfinderResourceDivider','request allocation',1,53),loc('PathFinder','OutOfElement/CoordinateViable',1437,1476),loc('PathFinder','CheckConnectionCost',1731,1768),loc('PathFinder','CoordinateCost',1821,1832),loc('QuickConnectivity','QuickPath',97,267),loc('ArtificialIntelligence','TravelPreference',319,334),loc('LizardAI','TravelPreference',1490,1550)],['AI graph generation, resource divider scheduling, YellowAI, physical locomotion and arrival unresolved.','QuickPath quota branch local flag remains false in shown body; not effective global quota evidence.']),
('RW2-F3','Global weather, chunk-level exposure, recovery and contradicted slam increment',[
loc('RainCycle','threshold/RainHit',506,558),loc('GlobalRain','DeathRainUpdate/NextDeathRainMode',53,219),loc('GlobalRain','push properties and update entry',269,326),loc('GlobalRain','InitDeathRain',466,469),loc('RoomRain','push properties',69,103),loc('RoomRain','Update',311,349),loc('RoomRain','ThrowAroundObjects/CreatureSmashedInGround',465,553),loc('Creature','rainDeath decay',548,548),loc('BodyChunk','normal floor impact',522,530),loc('Creature','TerrainImpact forwarding',1228,1238),loc('UnityEngine.Mathf','Clamp01',298,310),loc('UnityEngine.Mathf','InverseLerp',444,451),loc('RoomRain IL method','CreatureSmashedInGround RVA0x87164',299014,299124)],['Managed normal finite-speed helper term evaluates zero; separate rain exposure path remains valid.','No native engine physics, unusual values, flood/bullets, species overrides or timing reproduction.']),
('RW2-F4','Two-sided abstract grips, reconstruction and destructive cleanup',[
loc('AbstractPhysicalObject','AbstractObjectStick/CreatureGripStick',90,187),loc('AbstractPhysicalObject','Realize tail/RealizeInRoom',588,637),loc('AbstractPhysicalObject','Abstractize/IsEnteringDen',644,690),loc('AbstractPhysicalObject','Destroy/connected traversal/LoseAllStuckObjects',708,751),loc('PhysicalObject','Update stale grips and one-time reconstruction',490,517),loc('Creature','RecreateSticksFromAbstract',305,315),loc('Creature','Grab creates new abstract grip',1173,1217),loc('Creature','Grasp.Release',80,90),loc('AbstractCreature','DropCarriedObject',1008,1021)],['Save envelope and all reconstruction callers remain unread; no save roundtrip.','Success may leave old/new abstract grip records in shown path; no unbounded leak or dedup invariant claimed.'])]
for _,_,ls,_ in facts:
 for l in ls:
  e=entries.get(l['type']) or next(s for s in support if s['type']==l['type'])
  l['end_line']=min(l['end_line'],len(Path(e['path']).read_text().splitlines()))
f={'input':idx['input'],'input_sha256':idx['input_sha256'],'findings':[{'id':i,'title':t,'status':'shown-managed-source','native_observation':'unobserved','locators':ls,'limits':g} for i,t,ls,g in facts]}
(root/'FINDINGS.json').write_text(json.dumps(f,indent=2)+'\n')
gaps=[{'id':'RW2-U1','scope':'AI.VisualContact and AI map production, tracker species setup and callers','status':'partial','prior':'RW-U1','progress':'Tracker outer class fully read cumulatively; graph/sensory/caller dependencies remain.'}, {'id':'RW2-U2','scope':'Graph generation, YellowAI, resource divider timing and physical movement','status':'partial','prior':'RW-U4','progress':'Flee, QuickPath, PathCost, LizardPather and preference consumers traced. Arrival remains unobserved.'}, {'id':'RW2-U3','scope':'Full RainCycle scheduling, flood and bullet rain, species injury overrides','status':'partial','prior':'RW-U5/RW-U6','progress':'DeathRain phase and push death/recovery traced; slam path corrected statically.'}, {'id':'RW2-U4','scope':'Save envelope, grip rebuild success duplicate lifecycle, arbitrary recursive abstraction/null edges','status':'partial','prior':'RW-U7','progress':'Stick deactivation, serialization, lookup, realization and failure read. Native/save tests absent.'}, {'id':'RW2-U5','scope':'Faction propagation, all social save callers, mask reset and realized friend death lifecycle','status':'open','prior':'RW-U2/RW-U3','progress':'No additional reading in this round.'}, {'id':'RW2-U6','scope':'ScavengerAI, other captured-unread sources and remaining game types','status':'open','prior':'RW-U8/RW-U9','progress':'Inventory only is not semantic coverage.'}]
(root/'UNREAD.json').write_text(json.dumps({'status':'PARTIAL','gap_families':gaps,'exact_unread_complements':[{'type':e['type'],'status':e['status'],'ranges':e['unread_line_windows']} for e in entries.values() if e['unread_line_windows']]},indent=2)+'\n')
print('cumulative',len(entries),'support',len(support),'findings',len(facts))
