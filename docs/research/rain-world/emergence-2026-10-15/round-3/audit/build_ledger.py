from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parent
prev=json.loads((root/'../../round-2/audit/READ_LEDGER.json').read_text())
raw=Path('/Users/weiwei/.codex/research/rain-world-emergence-2026-10-15/round-3')
idx=json.loads((raw/'SOURCE_INDEX.json').read_text())
backend='Kittehface.Framework20.UserData'
ranges={'UpdatableAndDeletable':'full','AbstractWorldEntity':'full','AbstractCreature':[[426,455],[575,635],[715,748],[1072,1135]],'AbstractRoom':[[350,415],[424,525]],'Room':[[2594,2640],[4334,4449],[4575,4655]],'Creature':[[1142,1217],[1312,1365]],'RegionState':[[737,782],[1024,1072],[1100,1138],[1188,1222],[1418,1432],[1480,1530]],'SaveState':[[392,445],[632,670],[1923,2020]],'PlayerProgression':[[2363,2405],[2491,2538],[2690,2710]],'RainWorldGame':[[2182,2248]],'FriendTracker':[[1,35]],'LizardAI':[[530,540],[600,622]]}
support_ranges=[[332,350],[1040,1105],[1350,1395],[1500,1555]]
entries={e['type']:dict(e) for e in prev['classes']}
for e in idx['entries']:
 if e['type']==backend:continue
 if e['type'] in entries:assert e['sha256']==entries[e['type']]['sha256'],e['type']
 else:entries[e['type']]={'type':e['type'],'path':e['path'],'sha256':e['sha256'],'lines':e['lines'],'reviewed_line_windows':[]}
def merge(rr):
 m=[]
 for a,b in sorted(rr):
  if m and a<=m[-1][1]+1:m[-1][1]=max(m[-1][1],b)
  else:m.append([a,b])
 return m
def complement(rr,n):
 out=[];pos=1
 for a,b in rr:
  if pos<a:out.append([pos,a-1])
  pos=b+1
 if pos<=n:out.append([pos,n])
 return out
for name,e in entries.items():
 rr=ranges.get(name,[]);rr=[[1,e['lines']]] if rr=='full' else rr
 e['round_3_reviewed_line_windows']=merge(rr)
 e['reviewed_line_windows']=merge(e['reviewed_line_windows']+rr)
 e['unread_line_windows']=complement(e['reviewed_line_windows'],e['lines'])
 e['status']='full-class-read' if not e['unread_line_windows'] else ('selected-windows-read' if e['reviewed_line_windows'] else 'captured-unread')
 e['note']='Cumulative auditor reading at exact matching source hash. Not semantic closure of callers, overrides or native behavior.'
support=prev['support_sources']
b=dict(next(e for e in idx['entries'] if e['type']==backend));b['reviewed_line_windows']=support_ranges;b['unread_line_windows']=complement(support_ranges,b['lines']);support.append(b)
ledger={'input_sha256':idx['input_sha256'],'prior_ledger':'../../round-2/audit/READ_LEDGER.json','classes':list(entries.values()),'support_sources':support,'aliases':prev['aliases']}
(root/'READ_LEDGER.json').write_text(json.dumps(ledger,indent=2)+'\n')
by={e['type']:e for e in list(entries.values())+support}
def loc(t,m,a,b):
 e=by[t];return {'type':t,'method':m,'path':e['path'],'sha256':e['sha256'],'start_line':a,'end_line':b}
facts=[('RW3-F1','Duplicate grip records can be cleaned by later same-target rebuild calls',[
loc('PhysicalObject','Update reconstruction gate',512,516),loc('Creature','RecreateSticksFromAbstract',305,315),loc('Creature','UpdateGraspIndexes and Grab',1142,1217),loc('Creature','Grasp.Release',80,90),loc('AbstractCreature','DropCarriedObject',1008,1021),loc('RegionState','snapshot owner-A sticks',1204,1215),loc('RegionState','SaveToString STICKS',1420,1428)],'One-old-record addition and second-identical-record cleanup are symbolic source traces under explicit preconditions, not executed tests.'),
('RW3-F2','Staged destruction, registries, room unload and connected readiness',[
loc('AbstractWorldEntity','Destroy',45,48),loc('UpdatableAndDeletable','RemoveFromRoom and Destroy',18,27),loc('AbstractPhysicalObject','Destroy and graph collection',708,751),loc('AbstractRoom','Abstractize',358,408),loc('AbstractRoom','AddEntity/RemoveEntity',437,473),loc('Room','Unloaded',2594,2601),loc('Room','RemoveObject and CleanOutObjectNotInThisRoom',4346,4449),loc('Room','Update cleanup loop',4624,4655),loc('RainWorldGame','Update unloading queue',2188,2243),loc('AbstractCreature','Realize guards',426,455),loc('AbstractCreature','Realize linked endpoints and lizard AI initiation',575,635),loc('AbstractCreature','RealizeInRoom',715,747),loc('AbstractCreature','connected AI-map and camera requirements',1081,1113)],'Normal control flow shown; unusual null-body, corrupt graph, retained-AI and virtual override routes remain open.'),
('RW3-F3','Partial region restoration can omit or reject links despite correct population ordering',[
loc('RegionState','population before saved sticks',1025,1068),loc('RegionState','CreatureToStringInDenPos',1487,1526),loc('SaveState','AbstractCreatureFromString and StoryWorld encoding',1923,2007),loc('AbstractPhysicalObject','AbstractObjectStick.FromString',117,168),loc('Creature','RecreateSticksFromAbstract',305,315),loc('Creature','Grab admission index guard',1173,1186)],'Malformed/partial cases are source admission gaps, not observed corrupt personal saves.'),
('RW3-F4','Persistent social state, new realized AI and nonuniform cycle catch-up',[
loc('FriendTracker','fields and default friend pointers',1,35),loc('FriendTracker','constructor and acquisition',47,159),loc('LizardAI','mask counter field',530,540),loc('LizardAI','new tracker construction',600,622),loc('AbstractCreature','new lizard AI',596,605),loc('SocialMemory','persistent channels and load',26,132),loc('CreatureState','save and load social data',46,56),loc('CreatureState','LoadFromString social branch',101,114),loc('CreatureState','CycleTick',171,177),loc('RegionState','RainCycleTick state calls',737,782),loc('RegionState','elapsed cycles invocation',1109,1109),loc('SaveState','SessionEnded snapshot before friend boost',392,445)],'Normal new AI starts fresh; exceptional AI retention and same-cycle boost snapshot order remain unresolved.'),
('RW3-F5','Save request, backend operation completion and durability are distinct',[
loc('PlayerProgression','SaveToDisk tail',2690,2706),loc('PlayerProgression','GetProgLinesFromMemory',2371,2395),loc('PlayerProgression','SaveWorldStateAndProgression',2491,2518),loc(backend,'DataAccessible',336,347),loc(backend,'ExecuteWrite completion/failure tail',1040,1090),loc(backend,'ExecuteWrite_Platform',1093,1101),loc(backend,'Write_Default',1508,1548)],'Some write exceptions can be swallowed before successful operation completion if logging/finally return normally. No OS failure induced, file written, native load or durability test.')]
for _,_,ls,_ in facts:
 for l in ls:l['end_line']=min(l['end_line'],by[l['type']].get('lines',10**9))
f={'input':idx['input'],'input_sha256':idx['input_sha256'],'findings':[{'id':i,'title':t,'status':'shown-managed-source-with-labelled-inference','locators':ls,'limits':g,'native_observed':False} for i,t,ls,g in facts]}
(root/'FINDINGS.json').write_text(json.dumps(f,indent=2)+'\n')
gaps=[{'id':'RW3-U1','prior':'RW2-U4','scope':'Native repeated rebuild, mixed graphs, malformed endpoints/indexes, virtual Grab overrides and enclosing recovery','progress':'Paired link cleanup, same-target collapse and selective snapshot loop traced; no monotonic leak claimed.'},{'id':'RW3-U2','prior':'RW2-U4/RW2-U1','scope':'RoomRealizer/shortcut callers, unusual missing-body/AI paths and full engine disposal','progress':'Room abstraction/update queue and registry cleanup traced; all recursive graph paths not proven safe.'},{'id':'RW3-U3','prior':'RW2-U5','scope':'Same-cycle friend boost snapshot order, full save-envelope/parser rollback, backend callbacks/cloud/durability','progress':'Independent storage return and swallowed failure checks; durable social state versus new runtime pointers distinguished.'},{'id':'RW3-U4','prior':'RW2-U1/RW2-U2/RW2-U3/RW2-U6','scope':'Other species/faction, sensory graph, physical locomotion, flood/bullets and captured-unread source','progress':'Not extended by this bounded cleanup/save audit; exact complements retained.'}]
(root/'UNREAD.json').write_text(json.dumps({'status':'PARTIAL','gap_families':gaps,'exact_unread_complements':[{'type':e['type'],'status':e['status'],'ranges':e['unread_line_windows']} for e in entries.values() if e['unread_line_windows']],'backend_support_unread':{'type':backend,'ranges':b['unread_line_windows']}},indent=2)+'\n')
print('mainclasses',len(entries),'supportsources',len(support),'findings',len(facts))
