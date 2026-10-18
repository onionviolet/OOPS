from pathlib import Path
import json
root=Path(__file__).resolve().parent
prev=json.loads((root/'../../round-4/audit/READ_LEDGER.json').read_text())
raw=Path('/Users/weiwei/.codex/research/rain-world-emergence-2026-10-15/round-5')
own=json.loads((raw/'audit/SOURCE_INDEX.json').read_text());sib=json.loads((raw/'extraction/SOURCE_INDEX.json').read_text())
ranges={'Modding.Passages.CustomPassage':'full','Modding.Passages.CustomPassages':'full','Expedition.AchievementChallenge':'full','Expedition.ExpeditionCoreFile':[[44,290]],'Expedition.ExpeditionData':[[100,202]],'Expedition.Challenge':[[1,130]],'Menu.SlugcatSelectMenu':[[1556,1644]],'WarpPoint':[[3207,3265]],'WinState':[[978,1028]],'PlayerProgression':[[2102,2118],[2765,2875]],'StoryGameSession':[[134,147]],'ProcessManager':[[974,1012]],'MainLoopProcess':'full'}
entries={e['type']:dict(e) for e in prev['classes']}
for e in own['entries']+sib['entries']:
 if e['type'] in entries:assert e['sha256']==entries[e['type']]['sha256'],e['type']
 else:entries[e['type']]={'type':e['type'],'path':e['path'],'sha256':e['sha256'],'lines':e['lines'],'reviewed_line_windows':[]}
def merge(rr):
 m=[]
 for a,b in sorted(rr):
  if m and a<=m[-1][1]+1:m[-1][1]=max(m[-1][1],b)
  else:m.append([a,b])
 return m
for n,e in entries.items():
 rr=ranges.get(n,[]);rr=[[1,e['lines']]] if rr=='full' else rr;e['round_5_reviewed_line_windows']=merge(rr);e['reviewed_line_windows']=merge(e['reviewed_line_windows']+rr);comp=[];pos=1
 for a,b in e['reviewed_line_windows']:
  if pos<a:comp.append([pos,a-1])
  pos=b+1
 if pos<=e['lines']:comp.append([pos,e['lines']])
 e['unread_line_windows']=comp;e['status']='full-class-read' if not comp else ('selected-windows-read' if e['reviewed_line_windows'] else 'captured-unread')
ledger={'input_sha256':own['input_sha256'],'prior_ledger':'../../round-4/audit/READ_LEDGER.json','classes':list(entries.values()),'support_sources':prev['support_sources'],'aliases':prev['aliases']}
(root/'READ_LEDGER.json').write_text(json.dumps(ledger,indent=2)+'\n');(root/'SOURCE_INDEX.json').write_text(json.dumps(own,indent=2)+'\n')
def loc(t,m,a,b):
 e=entries[t];return {'type':t,'method':m,'path':e['path'],'sha256':e['sha256'],'start_line':a,'end_line':b}
facts=[('RW5-F1','Shipped passage API defaults and registration semantics',[
loc('Modding.Passages.CustomPassage','complete base API',1,58),loc('Modding.Passages.CustomPassages','registry, lookup and Register',1,28)],'Private pinned-main-IL scan found0directRegister callsites and0subclasses, not runtime registry emptiness or absence of external mods.'),
('RW5-F2','Win/death callbacks have ordered side effects and local exception limits',[
loc('WinState','custom tracker factory and lookup',978,1028),loc('WinState','DeathModifyTracker',1030,1060),loc('WinState','post-progression OnWin then Expedition',1310,1382),loc('WinState','death serializer selected restoration',808,875),loc('WinState','PlayerDied',1384,1394),loc('SaveState','SessionEnded after callback',436,474)],'Base callbacks are inert; external virtual overrides, registered list mutation and broader exception boundaries unobserved. Selected value restoration is not arbitrary callback rollback.'),
('RW5-F3','Expedition core request precedes campaign wipe and owner clear',[
loc('Expedition.AchievementChallenge','CheckAchievementProgress',157,167),loc('Expedition.Challenge','CompleteChallenge',82,123),loc('Expedition.ExpeditionData','AddExpeditionRequirements',123,154),loc('Expedition.ExpeditionCoreFile','Save and core encoding',66,254),loc('WinState','Expedition completion order',1342,1382),loc('Menu.SlugcatSelectMenu','MineForSaveData current state branch',1556,1590),loc('PlayerProgression','WipeSaveState and Revert',2765,2861),loc('PlayerProgression','current-state encoder guard existing',2598,2610),loc('PlayerProgression','current-state encoder guard fresh',2665,2669),loc('PlayerProgression','PlayingAsSlugcat fallback',2102,2112)],'No core/campaign transaction or durability acknowledgement; void core Save can skip. Other challenges and final win-screen behavior remain unread.'),
('RW5-F4','Death scrub preserves direct FRIENDS scope; fresh process differs from resume',[
loc('WarpPoint','ScrubNonDeathPersistentData',3207,3253),loc('PlayerProgression','death-persistent scrub and tagged merge',3040,3082),loc('ProcessManager','PostSwitchMainProcess resume or Revert/newGame',975,1005),loc('StoryGameSession','construct and obtain SaveState',134,147),loc('PlayerProgression','GetOrInitiateSaveState/LoadGameState',2945,3010),loc('MainLoopProcess','RawUpdate invocation timing',29,48)],'No direct friend queue mutation or save request in scrub. Parsed nested warp methods, native exception dispatch and successful fresh-load replay not proved.')]
f={'input':own['input'],'input_sha256':own['input_sha256'],'findings':[{'id':i,'title':t,'status':'shown-managed-source-with-labelled-static-inference','locators':ls,'limits':lim,'native_observed':False} for i,t,ls,lim in facts],'private_reference_scan':str(raw/'audit/CUSTOM_PASSAGE_REFERENCE_SCAN.json')}
(root/'FINDINGS.json').write_text(json.dumps(f,indent=2)+'\n')
gaps=[{'id':'RW5-U1','prior':'RW4-U1','scope':'Actual external callback registrations/plugins/reflection, virtual callback outcomes','progress':'Base callbacks fully read and inert; no subclasses/direct Register calls in pinned main-IL scan. Not a runtime registry inspection.'},{'id':'RW5-U2','prior':'RW4-U1','scope':'Other Expedition challenge subclasses, win-screen completion and all special endings','progress':'AchievementChallenge→base Complete→core request→wipe/current pointer clear traced; not exhaustive modules.'},{'id':'RW5-U3','prior':'RW4-U2','scope':'Native engine exception dispatch, actual replay/start modes, storage/cloud durability','progress':'Scrub and process resume/new distinction independently checked, sibling outerchain reviewed. No save/runtime tests.'},{'id':'RW5-U4','prior':'RW4-U3','scope':'Prior graph/malformed/AI/movement/weather/faction gaps and captured-unread classes','progress':'Retained without silent closure.'}]
(root/'UNREAD.json').write_text(json.dumps({'status':'PARTIAL','gap_families':gaps,'exact_unread_complements':[{'type':e['type'],'status':e['status'],'ranges':e['unread_line_windows']} for e in entries.values() if e['unread_line_windows']]},indent=2)+'\n')
print('mainclasses',len(entries),'findings',len(facts))
