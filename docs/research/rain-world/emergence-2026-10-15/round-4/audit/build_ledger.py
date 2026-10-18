from pathlib import Path
import json
root=Path(__file__).resolve().parent
prev=json.loads((root/'../../round-3/audit/READ_LEDGER.json').read_text())
raw=Path('/Users/weiwei/.codex/research/rain-world-emergence-2026-10-15/round-4')
own=json.loads((raw/'audit/SOURCE_INDEX.json').read_text());sibling=json.loads((raw/'extraction/SOURCE_INDEX.json').read_text())
ranges={'SaveState':[[285,555],[665,759],[760,877],[903,950],[1524,1548],[2284,2318]],'PlayerProgression':[[2274,2363],[2474,2518],[2538,2615],[2650,2670],[2945,3086]],'RegionState':[[405,425],[1139,1174],[1216,1325],[1360,1382],[1404,1419]],'World':[[308,321],[400,446]],'RainWorldGame':[[1595,1664],[1695,1787],[1800,1870],[2479,2517],[2814,2830]],'WinState':[[150,212],[808,877],[1018,1394]],'StoryGameSession':[[156,170],[378,407]],'DeathPersistentSaveData':[[563,591],[620,640],[666,680],[715,728]],'Player':[[5634,5650],[7070,7144]]}
entries={e['type']:dict(e) for e in prev['classes']}
for e in own['entries']+sibling['entries']:
 if e['type'] in entries:assert e['sha256']==entries[e['type']]['sha256'],e['type']
 else:entries[e['type']]={'type':e['type'],'path':e['path'],'sha256':e['sha256'],'lines':e['lines'],'reviewed_line_windows':[]}
def merge(rr):
 out=[]
 for a,b in sorted(rr):
  if out and a<=out[-1][1]+1:out[-1][1]=max(out[-1][1],b)
  else:out.append([a,b])
 return out
for name,e in entries.items():
 e['round_4_reviewed_line_windows']=merge(ranges.get(name,[]));e['reviewed_line_windows']=merge(e['reviewed_line_windows']+ranges.get(name,[]));comp=[];pos=1
 for a,b in e['reviewed_line_windows']:
  if pos<a:comp.append([pos,a-1])
  pos=b+1
 if pos<=e['lines']:comp.append([pos,e['lines']])
 e['unread_line_windows']=comp;e['status']='full-class-read' if not comp else ('selected-windows-read' if e['reviewed_line_windows'] else 'captured-unread')
ledger={'input_sha256':own['input_sha256'],'prior_ledger':'../../round-3/audit/READ_LEDGER.json','classes':list(entries.values()),'support_sources':prev['support_sources'],'aliases':prev['aliases']}
(root/'READ_LEDGER.json').write_text(json.dumps(ledger,indent=2)+'\n')
(root/'SOURCE_INDEX.json').write_text(json.dumps(own,indent=2)+'\n')
def loc(t,m,a,b):
 e=entries[t];return {'type':t,'method':m,'path':e['path'],'sha256':e['sha256'],'start_line':a,'end_line':b}
facts=[('RW4-F1','Direct session-end save encodes pre-boost NPC strings',[
loc('SaveState','SessionEnded snapshot then boost then save',294,474),loc('SaveState','BringUpToDate region snapshot',665,739),loc('World','regionState property',308,318),loc('RegionState','string snapshot fields',405,425),loc('RegionState','pending friend strings before boost',1144,1174),loc('RegionState','saved population strings',1216,1242),loc('RegionState','SaveToString cached population',1407,1419),loc('SaveState','SaveToString region and pending friends',783,877),loc('SaveState','SaveToString pending friends',909,950),loc('PlayerProgression','SaveToDisk existing campaign encoding',2592,2610),loc('PlayerProgression','SaveToDisk fresh campaign encoding',2665,2669)],'Resolved for the direct built-in chain absent custom callbacks/Expedition intervention or another explicit snapshot. No native durability claim.'),
('RW4-F2','Live boosted like can feed separately saved progression',[
loc('SaveState','AppendKills',1524,1544),loc('StoryGameSession','AppendTimeOnCycleEnd',378,407),loc('PlayerProgression','CreateCopyOfSaves copies existing files',2274,2363),loc('WinState','CycleCompleted including Friend and extension hooks',1082,1382),loc('WinState','FloatTracker.SetProgress/ToString',150,212),loc('WinState','SaveToString normal and death branches',808,875),loc('DeathPersistentSaveData','WinState encoding',620,640),loc('SaveState','fresh death-persistent encoding',859,869)],'Illustrative0.6→0.8 relationship and0.272 tracker contribution are source-derived arithmetic, not executed game/save tests. CustomPassage and Expedition callbacks remain outside the ordinary-route conclusion.'),
('RW4-F3','Survive, malnourished, death and quit encode distinct state layers',[
loc('SaveState','SessionEnded failure and special end routes',469,555),loc('PlayerProgression','progression-only/death/world routing',2476,2518),loc('PlayerProgression','death-persistent-only replacement',3011,3082),loc('PlayerProgression','starved state reuse and load flags',2945,3010),loc('SaveState','BackupRegionStatePreservation',741,758),loc('RainWorldGame','ExitToMenu',1652,1664),loc('RainWorldGame','ExitGame clock flag gates',1710,1735),loc('RainWorldGame','death and starve entry',1810,1866),loc('DeathPersistentSaveData','death and quit encoder differences',563,591),loc('DeathPersistentSaveData','quit count',666,680)],'Ordinary direct branches established. Special end modes, module callbacks, backend completion/durability and actual menu/reload outcomes remain unobserved.'),
('RW4-F4','Pending-friend one-shot consumer clears queue before creation',[
loc('Player','Update calls UpdateMSC',5634,5650),loc('Player','UpdateMSC fifth update latch and transfer',7077,7139),loc('SaveState','GrabSavedCreatures queue clearing',2284,2315),loc('RainWorldGame','SpawnCritters',2814,2827)],'Independent source crosscheck agrees sibling. Null/exception per-item recovery or outer rescue not established; no native failure reproduced.')]
f={'input':own['input'],'input_sha256':own['input_sha256'],'findings':[{'id':i,'title':t,'status':'shown-managed-source-with-labelled-conditional-inference','locators':l,'limits':lim,'native_observed':False} for i,t,l,lim in facts]}
(root/'FINDINGS.json').write_text(json.dumps(f,indent=2)+'\n')
gaps=[{'id':'RW4-U1','prior':'RW3-U3','scope':'CustomPassage.OnWin/OnDeath, Expedition completion and other special save routes','progress':'Direct built-in no-recapture chain resolved; extension intervention explicitly excluded.'},{'id':'RW4-U2','prior':'RW3-U3','scope':'Pending-friend enclosing exception handling/retry, storage backend callbacks/cloud/durability and native reunion','progress':'Actual fifth-update transfer and factory accepted; queue markers do not prove creation.'},{'id':'RW4-U3','prior':'RW3-U1/RW3-U2/RW3-U4','scope':'Other graph/malformed/AI/movement/weather/faction gaps and all captured unread classes','progress':'Carried forward without implicit closure.'}]
(root/'UNREAD.json').write_text(json.dumps({'status':'PARTIAL','bounded_question':'Ordinary direct same-cycle friendlike snapshot resolved conditionally; gameplay and all extension behavior not verified.','gap_families':gaps,'exact_unread_complements':[{'type':e['type'],'status':e['status'],'ranges':e['unread_line_windows']} for e in entries.values() if e['unread_line_windows']]},indent=2)+'\n')
print('mainclasses',len(entries),'findings',len(facts))
