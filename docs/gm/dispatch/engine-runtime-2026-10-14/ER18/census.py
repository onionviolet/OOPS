from pathlib import Path
import re,json,hashlib
root=Path('src'); out=Path('docs/gm/dispatch/engine-runtime-2026-10-14/ER18')
files=sorted(p for p in root.rglob('*') if p.is_file() and not p.name.startswith('SECRETS'))
data={f'AB{i}':[] for i in range(1,16)}
def put(ab,p,line,label,kind='declaration'):
    r={'file':str(p),'line':line,'symbol':label,'kind':kind}
    if r not in data[ab]:data[ab].append(r)
for p in files:
 if p.suffix not in ('.js','.json'):continue
 lines=p.read_text().splitlines()
 for i,l in enumerate(lines,1):
  if l.lstrip().startswith(('//','*','/*')):continue
  m=re.search(r'\bfunction\s+([\w$]+)\s*\(|\bclass\s+([\w$]+)|\b(?:const|let|var)\s+([\w$]+)\s*=.*=>',l)
  name=next((x for x in m.groups() if x),None) if m else None
  if name:
   tests={
    'AB1':r'advance|sync.*Clock|Clock.*(?:Minute|Time)|calendarMinutes|lifeCalendarMinute|Game_Time|tick|timeTick|game_action_period|currentTime|calendarSnapshot|localCalendar|calendarFor',
    'AB2':r'next.*Boundary|NextBoundary|^schedule(?:Search)?$|^recurringWindow$|^lifespanDeadline$|^settleTimeAdvance$|^advancePackSettlement$|^expire(?:Realm|Pocket)Observation$|^completeJob$|^advance.*Boundary$|^advanceStoryletDecks$|^advancePursuits$',
    'AB3':r'^(commit|command|dispatch|act[A-Z_]|startCommand|answer|respond|cancel|begin|enroll|setSimulationProgram|pauseSimulationProgram|resumeSimulationProgram|change_location|start_activity|start_reading|start_sleeping|start_game_action|end_game_action)',
    'AB4':r'^(?:.*Random.*|random.*|draw|drawUnit|hash|hashStreamSeed|mix32|.*Stream.*|unitDecision|keyedUnit|nextOrdinal|.*Seed|rollChance|rollInt|rollTable|rollBaseCombatDamage|resolveCombat.*|seededRecipe|chooseOutcome|resolveOnce)$',
    'AB5':r'Registry|^getDomain$|^domain$|^person$|^inventory$|^readInventoryOwner$|^writeInventory$|^create.*State$|^get.*State$|^set.*State$|^getMixtureOwner$|^setMixtureOwner$|registerWorkspaceModule|unregisterWorkspaceModule|^bind|^live$',
    'AB6':r'[Ff]acts|[Kk]nowledge|[Mm]emory|[Mm]emories|knownPeople|known.*View|observe|record.*(?:Message|Archive|Life|Event|Discovery|Acquisition)|read.*Known',
    'AB7':r'^(stage|prepare.*Publication|persist|publish|write.*Envelope|writeGuardedSave|commitMixturePlan|readGameplayActor|applyGameplayEffect|applySimulationEffects|refundCosts|finishNative|planNative)',
    'AB8':r'^(validate|migrate|normalize|encode|decode|load.*State|prepare.*Save|create_save|load_game|load_save|importSaveFile|measureSaveSize|checkSaveSize|writeGuardedSave|packSaveState|snapshot|restore|serialize|deserialize)',
    'AB9':r'^(register|compileStructuredPack|mergeStructuredPack|loadContentPacks|createContentRegistry|createSimulationRegistry|definePanel|requireStructuredContent|requireStructuredSelection)',
    'AB10':r'(WorldInstance|WorldDefinition|WorldBindings|WorldVisit|WorldRecords|WorldEndpoint|StructuredRecord|StructuredSelection|StructuredLifetime|createRealmConnection)',
    'AB11':r'(Carrier|Cargo|Transfer|transfer|Acquisition|Ownership|RealmPassage|RealmTraveler|RealmProjection|Heir|heir|Inheritance|Passage|Departure|stage.*Move)',
    'AB12':r'(RealmBoundaryRule|RealmBoundary\b|PocketRealmRules|WorldDefinition|validateSchedule|PacingOption|normalizePacing|RealmTravelerSupport)',
    'AB13':r'(View$|Views$|Presentation$|Present$|Snapshot$|Facts$|^project|^inspect|^query|^preview|^select|^knownPeopleView$|^worldIdentityView$)',
    'AB14':r'^(create.*Panel|create.*UI|mount|render|refresh|update_display|update.*Display|update.*display|display_|draw_|do_background_animation|createSettledTextEffects|createNativeDiscoveryFeedback|definePanel|createWorkspace)',
    'AB15':r'([Ff]ormat|^fmt$|^expo$|^rtp$|^minutes$|^itemName$|^costText$|^costsText$|^title$|^label$|^householdName$|^npcName$|^itemName$|^householdName$|^calendarText$|^duration$|^plural|^get_component_name$)'}
   for ab,pat in tests.items():
    if re.search(pat,name,re.I if ab in ['AB1','AB2'] else 0):put(ab,p,i,name)
  # Concrete anonymous/instance mechanisms and inline near duplicates.
  for ab,pat,label in [
   ('AB1',r'\bthis\.goUp\s*=','Game_Time.goUp'),('AB1',r'\bthis\.loadTime\s*=','Game_Time.loadTime'),
   ('AB2',r'\b(setInterval|setTimeout|requestAnimationFrame)\s*\(','browser timer registration'),
   ('AB4',r'\bMath\.random\b','unseeded random site'),
   ('AB4',r'<<\s*13','xorshift32 arithmetic'),
   ('AB7',r'\bstorage\.setItem\(|\blocalStorage\.setItem\(','durable write site'),
   ('AB12',r'^\s*(?:export\s+)?(?:const|let)\s+([\w$]*(?:FOOTPRINTS|BASELINE|WORLD_DEFINITION|DECKS|balance)[\w$]*)\s*=','world/system policy block'),
   ('AB5',r'\b(?:const|let|var)\s+([\w$]+)\s*=\s*(?:new Map|new Set|\{\})','map/set/object registry or cache'),
   ('AB6',r'\b(?:known|knowledge)\s*\[.*\]\s*=','knowledge write'),
   ('AB9',r'\b(?:export\s+)?(?:const|let)\s+([\w$]*(?:Definitions|Content|CONTENT|DEFINITION|MANIFEST|lanes|registrations)[\w$]*)\s*=','content registration/data block'),
   ('AB12',r'\b(?:export\s+)?const\s+([\w$]*(?:Rules|RULES|POLIC|Policy|CONFIG|DIAL|config|balance)[\w$]*)\s*=','rule/config data block'),
   ('AB13',r'\b(?:[\w$]*[Ss]ignature)\s*=\s*(?:JSON\.stringify|next|sig|session)','render signature assignment'),
   ('AB15',r'\.(?:toFixed|toLocaleString)\s*\(|\bIntl\.','inline numeric formatting'),
  ]:
   z=re.search(pat,l)
   if z:put(ab,p,i,(z.group(1) if z.lastindex else label),label)
  if p.name.endswith('_ui.js') or str(p).endswith('/panel.js'):
   if re.search(r'function\s+(?:node|button|el|element)\s*\(|const\s+(?:node|button|el|element)\s*=',l):put('AB14',p,i,'DOM helper')
 # native registry classes have methods inside bodies
 if p.name in ['person.js','npc.js','hero.js','skill.js','location.js','game_action.js','dialogue_action.js','trade_item.js'] and '/models/' in str(p):
  for i,l in enumerate(lines,1):
   if re.search(r'(static\s+|^\s*)(get|register|add|find|all|getAll|values)\s*\(',l):put('AB5',p,i,l.strip().split('{')[0].strip(),'registry/model method')
 if p.name in ['config.js','balance.json']:put('AB12',p,1,'global config / local balance','config owner')
# Reviewed supplements cover methods, aliases and names outside the broad patterns.
supplements={
 'AB1':{'src/away_ledger.js':['function computeAway'], 'src/anchor_snapshots.js':['function eventTime','function deriveIncremental'], 'src/main.js':['function update_timer','function progress_time','function update_effect_durations','function update()','function cheatCalendarTime'],
 'src/world_instances.js':['function planWorldClock'], 'src/realm_clock_leases.js':['function planRealmActivityClock'],
 'src/feature_expansion_destination_native.js':['function calendarAt'], 'src/feature_expansion_nested_native.js':['function nestedCalendarAt'],
 'src/book_world_paradise_native.js':['function paradiseCalendarAt'],'src/book_world_mol_native.js':['function molCalendarAt'],
 'src/proto23_world_native.js':['function proto23CalendarAt'],'src/book_world_paradise_carriers.js':['function stageParadiseCarrierClock'],
 'src/feature_expansion_nested_carriers.js':['function stageNestedCarrierClock'],'src/backlog_expansion_transit.js':['function stageCarrierClock']},
 'AB4':{'src/start_records.js':['function seededStartRng'], 'src/anchor_snapshots.js':['function eventTime'], 'src/seeded_streams.js':['function streamSeed','function gameOrdinal'],'src/mixture_state.js':['function localMixtureSeed'],
 'src/simulation_resolution.js':['function deriveSimulationSeed'],'src/causal_story_host.js':['let n=2166136261'], 'src/storylet_deck.js':['function roll('], 'src/chronicle.js':['next.rng ^= next.rng << 13']},
 'AB5':{'src/data/npcs.js':['class NPCRegistryC','const NPCRegistry ='],'src/quests.js':['const questManager ='],
 'src/main.js':['let expansionState','let expansionState','const optionalPacks','const structuredPacks'],
 'src/mixture_state.js':['let owner','const getMixtureOwner','function setMixtureOwner']},
 'AB6':{'src/anchor_snapshots.js':['function deriveSnapshot','function explainFact','function applyEffects'], 'src/start_records.js':['function compose'], 'src/simulation_effects.js':['e.type === "fact"','e.type === "knowledge"'],
 'src/expansion_engine.js':['effect.type === "fact"'], 'src/mixture_state.js':['knowledge[id]'],
 'src/observation_channels.js':['function planObservationSample'], 'src/event_feed.js':['function eventFeed']},
 'AB2':{'src/anchor_snapshots.js':['function advance','function eventTime'], 'src/away_ledger.js':['function computeAway']},
 'AB3':{'src/start_records.js':['function resolveStart'], 'src/main.js':['function performMixtureAction','function process_rewards','game_action_tick = ()','function startExpedition','function answerPractice','function commandOptionalPack'], 'src/models/game_action.js':['class GameAction'],'src/models/dialogue_action.js':['class DialogueAction']},
 'AB7':{'src/native_craft_transaction.js':['function beginNativeCraftTransaction'], 'src/native_equipment_transaction.js':['function prepareNativeEquipment'],
 'src/native_unlock_transaction.js':['function prepareNativeUnlocks'], 'src/main.js':['function commitNativeTrade','function commitNativeStorage','function commitDurability','function dispatchLocalLifePlan']},
 'AB8':{'src/main.js':['function load(','function save_to_localStorage','function create_save','async function load_from_file','function load_from_localstorage'],
 'src/book_world_paradise_native.js':['const encode='],'src/book_world_mol_native.js':['const encode='],
 'src/proto23_world_native.js':['const encode='],'src/feature_expansion_nested_native.js':['const encode=']},
 'AB9':{'src/data/start_layers_frontier.js':['const frontierStartWorld'], 'src/absorb_d/register.js':['function registerFortContent'], 'src/expedition_content.js':['export const expeditionRegistry'],'src/simulation_content.js':['export const simulationDefinitions'],
 'src/audit_remainder_host.js':['const lanes'],'src/feature_expansion_book_host.js':['function commit(']},
 'AB10':{'src/anchor_snapshots.js':['function deriveSnapshot'], 'src/start_records.js':['function resolveStart'], 'src/realm_state.js':['function validateRealmState'], 'src/feature_expansion_destination_host.js':['function validateTidemarkState'],
 'src/feature_expansion_nested_host.js':['function validateNestedCampaignState'], 'src/book_world_paradise_state.js':['function validateParadiseCampaignState'],
 'src/book_world_mol_state.js':['function validateMolCampaignState'],'src/proto23_world_state.js':['function validateProto23State']},
 'AB11':{'src/simulation_effects.js':['e.type === "transfer"','e.type === "custody"'],
 'src/data/storage.js':['function move_item_to_storage','function remove_item_from_storage'],
 'src/native_trade_transaction.js':['function stageNativeTrade'],'src/backlog_expansion_transit.js':['function carrierTransitContext']},
 'AB12':{'src/data/start_layers_frontier.js':['const frontierStartWorld'], 'src/start_records.js':['const START_MERGE_RULES'], 'src/world_instances.js':['function validateWorldInstance'], 'src/pocket_realm_rules.js':['function createPocketDoorConnection'],
 'src/realm_traveler_profiles.js':['function realmTravelerCases'], 'src/backlog_expansion_transit.js':['const kinds','const laneKinds'],
 'src/feature_expansion_nested_content.js':['export const NESTED_FOOTPRINTS'], 'src/book_world_paradise_ids.js':['PARADISE_FOOTPRINTS='],
 'src/book_world_mol_ids.js':['MOL_FOOTPRINTS='],'src/proto23_world_ids.js':['PROTO23_FOOTPRINTS =']},
 'AB13':{'src/anchor_snapshots.js':['function deriveSnapshot','function deriveIncremental','function diffSnapshots','function explainFact'], 'src/action_legibility.js':['function projectSimulationAftermath'], 'src/world_instances.js':['function worldInstanceView']},
 'AB14':{'src/start_probe_ui.js':['function createStartProbe'], 'src/display.js':['function log_message','function update_displayed_time'], 'src/ui/combat_display.js':['function '],
 'src/particles.js':['class BackgroundParticle']},
 'AB15':{'src/game_time.js':['Game_Time.prototype.toString'], 'src/feature_expansion_host.js':['function featureCostText'],
 'src/display.js':['function format_money'],'src/settled_text_effects.js':['const formatCoins']}
}
missing=[]
for ab, fs in supplements.items():
 for f,needles in fs.items():
  for needle in needles:
   hits=[(i,l) for i,l in enumerate(Path(f).read_text().splitlines(),1) if needle in l and not l.lstrip().startswith('//')]
   if not hits:missing.append([ab,f,needle]);continue
   for i,l in hits[:1]:
    if not any(r['file']==f and r['line']==i for r in data[ab]):put(ab,Path(f),i,needle.replace('function ','').replace('const ','').replace('let ',''),'reviewed supplement')
# Exclude named content hash checks, formatting false positives and non-world local balances.
for ab,rows in data.items():
 data[ab]=[r for r in rows if not (ab=='AB4' and (r['symbol'] in ['contentHash','inspectHashes'] or r['file'] in ['src/book_world_player_agency_contracts.js','src/structured_pack_state.js']))
  and not (ab=='AB15' and r['symbol'] in ['clear_loot_information','generatePersonName','byName'])
  and not (ab=='AB12' and r['symbol'] in ['previousRules','allowedRules','balances','balance','health_recovery_balance'] or ab=='AB12' and r['file'] in ['src/workspace_state.js','src/workspace_layout.js'])]
 data[ab].sort(key=lambda r:(r['file'],r['line'],r['symbol']))
(out/'supplement-misses.json').write_text(json.dumps(missing,indent=2)+'\n')
snapshot=[{'file':str(p),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files]
(out/'census.json').write_text(json.dumps({'method':'declaration and concrete-site census; overlapping roles; see census.py','files':snapshot,'categories':data},indent=2)+'\n')
for ab,rows in data.items(): print(ab,len(rows),'sites',len(set(r['file'] for r in rows)),'files')
print('source files',len(files))
