from pathlib import Path
import json,re,html
base=Path('docs/gm/dispatch/ui-foundation-2026-10-15/next-parts')
out='''# CN: Part 0 control and symbol census, 2026-10-15

Source census for the plan only; no product decision or implementation is made here.
CN inventories static controls, generated control families and their shared entry routes, including conditional and compatibility surfaces.
Evidence is **stated** by current source unless explicitly **inferred**; no new pixel or browser evidence is claimed.
Target: 1366×768 at 14/21px and 1920×1080 at 21px; mobile deferred.
Part mappings below mean placement/presentation ownership, never permission to change gameplay handlers.

## Scope, evidence and reading key

Read COMMON, AGENTS, PROJECT summary, all NEXT_PARTS including Round 7/corrected rows, PARITY K1–K9, R14 F16–F20 and constraints, UI_RULES UR41–UR58, and the question-triage refinement. Authority: `NEXT_PARTS_2026-10-15.md:13`, `:35`, `:214`, `:252`; `docs/UI_RULES.md:85`, `:102`, `:120`; `docs/OVERARCHING_DESIGN_METHOD_PROMPT_2026-10-15.md:30`. Current direct paths and knowledge gating remain defaults; stronger grouping remains a comparison candidate.

- **State y** includes transient selection, disclosure, scroll, drafts, browser preferences and gameplay. Suffixes **U** (UI/session), **D** (display/browser layout), **G** (game/save), **X** (external navigation/download). **n** means no internal mutation established. This prevents confusing “no save change” with “no state change.”
- **Keyboard K**: native button/input/select/summary semantics, generally Tab then Enter/Space or edit/arrows; not a browser-tested guarantee. **L**: legacy div/click target, no intrinsic keyboard activation; only mark an adapter where source establishes it. **H**: hover/focus inspection with no explicit command. Every frequency is an **assumption**: high, medium, low, or episodic; none is telemetry.
- **P** player-facing; **A** authoring/presentation editor; **DEV** explicit developer/probe gate; **HIST** preserved capture only. An authoring feature can be reachable by players; A does not imply dev-only. `src/workspace_layout.js:394` is unconditional.
- **Parts**: 1 Inventory strip; 2 combat/Reports; 3 You; 4 knowledge/preview; 5 navigation/empty states/footer. **5 retain** means placement may change while the feature stays with its existing owner. No Part 1–5 gameplay redesign is implied. Part 6 effects/content stay deferred.
- Generated families denote **every instance emitted by that renderer**, not one sample item/person/recipe. Counts cannot be fixed without a particular discovered save. The static HTML annex lists individual controls; the renderer annex preserves individual construction/handler sites, including data-driven controls. Source-only presence does not establish visibility in a particular layout, save or viewport.

## Findings table

| Code | Evidence | Finding / consequence |
| --- | --- | --- |
| CN1 | **stated**, `src/workspace_navigation.js:7`, `:36`, `:43`, `:64`; `src/workspace_layout.js:470` | Global buttons, peer buttons, More panels, notices and panel Expand can reach the same owned view. These are duplicate entry routes, not duplicate panel owners. Part 5 compares placement; reuse one dispatch/eligibility source. |
| CN2 | **stated**, `src/village_workspace.js:104`, `:159`; `src/center_modes.js:35`; `src/display.js:2768`; `src/content_pack_ui.js:25` | Back to overview, center Back, native travel and pack Return to Village have different state effects. Never merge merely because labels mention Village or Back. |
| CN3 | **stated**, `src/proto23_shell.js:198`, `:207`; `index.html:214`; **inferred** frequency | Compact category/sort selectors and Reverse delegate to native inventory controls. Keep one native owner. Source includes Favorites: Part 1 must not invent new favorites semantics, but must account for the existing category. |
| CN4 | **stated**, `src/proto23_shell.js:220`, `src/display.js:175`, `:986`; `index.html:674` | Reports has disclosure, category filters, follow policy, jump-to-latest, stop/resume recording and Clear. Stop combat log does not stop combat; Clear deletes visible report history. Their jobs must survive condensation. |
| CN5 | **stated**, `src/workspace_layout.js:394`, `:503`; `src/main.js:10006`; `src/work_ledger_author_ui.js:12` | Authoring is reachable in ordinary mounted play, not guarded by isOnDev. It switches context; rules editing can save gameplay rules. Moving chrome does not authorize removing this access or treating all editor actions as cosmetic. |
| CN6 | **stated historical**, `R14_FOLLOWUP_CONSIDERATIONS.md:233`; **stated current absence bounded to scanned files**, scratch manifest | R14 reports a dummy hit counter. Current `index.html`, `src/` and style search found no counter DOM/handler, only the old visitor-counter comment in `styles/workspace.css:638`. Do not invent a current counter route. Round 7/Part 5 already settle no permanent counter space. |
| CN7 | **stated**, `src/panel_kit.js:4`, `:30`; `src/village_workspace.js:121`; `index.html:22` | Role ornaments, repeated Material square, steam and season fallback require different treatment. Symbols are inventoried below; replacement art remains later. Font failure has not been reproduced. |
| CN8 | **stated**, `src/main.js:9880`, `:10081`; `src/panel_kit.js:11`; `src/workspace_navigation.js:61` | Eligibility comes from owner callbacks and current world/occupation/save authority, not the navigation label or count. Census includes conditional gameplay panels; never reveal unknown names to make a complete directory. |
| CN9 | **inferred** from static census; `NEXT_PARTS_2026-10-15.md:33`, `:188` | Frequency, actual focus order and clipping cannot be established statically. Part 0 journey comparison must check them at all three desktop targets, including full discovered routes and live ticks. No build, test, or save access occurred in this lane. |

## Census: shared chrome and owned controls

All rows in this and the following census tables are **stated** at the owner references. Frequency and proposed Part mapping are **inferred**. Canonical route names are module/controller IDs or native handler names, not proposed new UI labels.

| ID | Surface | Control | Owner file:line | Effect | State | Canonical route | Discovery / eligibility source | Keyboard path | Frequency assumption | Audience; Part; overlap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
'''
rows=[]
def row(surface,control,owner,effect,state,route,gate,key,freq,part):rows.append([surface,control,owner,effect,state,route,gate,key,freq,part])
nav=[('Here','h','local-actions'),('Stats','e','preparation'),('Inventory','i','belongings'),('Crafting','c','crafting'),('Mixing','m','mixing'),('Journal','j','records / quests'),('Bestiary','b','records / bestiary'),('Books','a','records / books'),('Data','d','records / data'),('Notebook','n','records / notebook'),('Skills','k','skills'),('People','p','known-people'),('Travelers','t','village-travelers'),('Projects','r','projects'),('Ledger','l','ledger'),('Worlds','w','optional-worlds'),('Beginning','g','beginning'),('Settings','s','customization')]
for label,key,route in nav:
 row('Global nav',label,'src/workspace_navigation.js:7','Open owned destination'+('; focus existing visible list in parity, otherwise expand' if label=='Inventory' else ''),'y U',route,'src/workspace_navigation.js:61; registry known/eligible; journal tab discovery; Crafting station and Mixing launcher checks','Alt+'+key.upper()+'; K','high' if label in ['Here','Inventory','Crafting'] else 'medium','P; 5; duplicate entry if peer/More/context link exists')
for args in [
('Global nav','More panels selector','src/workspace_navigation.js:34','Expand selected known eligible module','y U','expandWorkspaceModule(id)','knownWorkspaceModules; excludes peer/log tools','K','low','P; 5; duplicate owned destination'),
('Global / peer nav','? / shortcuts Close','src/workspace_navigation.js:36','Open/close modal shortcut sheet','y U','workspace_shortcuts','visible route list only','?; K; dialog Esc','low','P; 5; same sheet from two triggers'),
('Center peer bar','Here / Skills / Crafting / Mixing','src/workspace_navigation.js:43','Same go(route) as global buttons','y U','local-actions / skills / crafting / mixing','copied global hidden/disabled checks','K; corresponding Alt shortcut','high','P; 5; genuine duplicate entries'),
('Center task footer','Named Back','src/center_modes.js:35','Restore previous center view through shared owner','y U','centerModes().back()','controller view stack / center mode','K; Esc subject to transient/input guards','high','P; 5; differs from travel'),
('Current work strip','Open local controls','src/workspace_views.js:20','Open local actions, or notebook while waiting; focus a local control','y U','local-actions / notebook','read().waiting','K','medium','P; 5; contextual route, not start work'),
('Location prose','Read more / less','src/workspace_views.js:32','Expand/collapse long description','y U','location_description_div','prose measurement / syncProse','K','low','P; 5 retain'),
('Local scene','Actions / Options / People / Things tabs','src/village_workspace.js:26','Choose local section','y U','placeTab','parity; counts; shell hides People/Things duplicates','K','medium','P; 5; tab is not action execution'),
('Place / Focus','Known person/thing chips and nearby cards','src/village_workspace.js:108; src/village_workspace.js:152','Select subject, do not converse/use','y U','choose(id)','observer-filtered frame.people/things','K','medium','P; 4 preview / 5 placement; duplicate subject inspection entries'),
('Focus','← current place','src/village_workspace.js:159','Deselect subject, return overview','y U','choose(null)','shell selected non-enemy; not dialogue','K; Esc src/village_workspace.js:104','high','P; 5; differs from center Back and travel'),
('Scene / Focus','Per-subject action buttons','src/village_workspace.js:137; src/village_workspace.js:165','Execute existing act(action.id)','y G','act(id)','view.groups action disabled/reason','K','medium','P; 5 retain; same commands in different presentation homes'),
('Opponent Focus','Compact / Panels','src/village_workspace.js:38','Choose roster presentation','y U','enemyPanels','active enemy frame; automatic fit until manual choice','K','low','P; 2'),
('Opponent Focus','Roster names / individual card names','src/village_workspace.js:54; src/village_workspace.js:65','Inspect opponent, never retarget','y U','selectedEnemy','actual roster IDs','K','medium','P; 2/4; duplicate inspector entries in alternate modes'),
('Opponent Focus','Combat readout disclosure / fact rows','src/village_workspace.js:34; src/village_workspace.js:73','Show known facts / focus description','y U / n H','combatDetails / native facts','knownFacts; automatic fit until chosen','K / focus; title tooltip','medium','P; 2/4; not enemy effects'),
('You','Gear disclosure','src/proto23_shell.js:110','Reveal native equipment slots','y U','shell gear / character_equipment_div','active shell; manual open state','K','medium','P; 3; count is occupied gear, not slots'),
('You','Core/secondary stat buttons, bars, effects summary','src/proto23_shell.js:159; src/proto23_shell.js:246; src/proto23_shell.js:277','Inspect native stat/effect explanation','y U','context preview / attribute projection','actual fitted stats; actual effects','K or focus/hover; Esc preview','high','P; 3/4; inspection only'),
('Full Attributes','Attribute group / With modifiers / attribute rows','src/proto23_shell.js:53; src/proto23_shell.js:79','Filter and select native attribute record','y U','attribute inspector','nativeAttributeRows; retained selected/focused row','K; row Arrow/Home/End src/proto23_shell.js:80','medium','P; 3/4; full reference retained'),
('Inventory','Compact category All / Equipment / Usable / Other / Favorites','src/proto23_shell.js:204','Delegate category selection to existing native control','y U','inventory_show_*','native category semantics','K','high','P; 1; duplicate native selector'),
('Inventory','Compact sort Name / Value / Type; Reverse','src/proto23_shell.js:206','Delegate native sort; repeat chosen sort to reverse','y U','inventory_sort_by_*','native inventory','K','medium','P; 1; duplicate native sorting'),
('Inventory / Skills / Bestiary / Books','Find search field, each list','src/ui_components.js:35; src/workspace_navigation.js:51','Filter visible rows by name; reset list scroll','y U','decorateInventoryList(id)','existing rendered/discovered rows only','K; type; clear input','high','P; 1 Inventory, 5 retain others'),
('Inventory / Equipment','Item / occupied gear selection and hover','src/proto23_shell.js:224','Select stable key/slot; inspect without use/equip','y U','shell-detail','rendered held/known row and native tooltip','focus/hover; pointer; source handlers in renderer annex','high','P; 1/3/4'),
('Item popup','Full item ›','src/proto23_shell.js:172','Select source item and expand details','y U','shell-detail','hovered source still connected','K; Esc closes preview','medium','P; 4; alternate detail route'),
('Reports','Filters · current scope','src/proto23_shell.js:217','Toggle category controls visibility','y U','message_controls','parity r3','K','medium','P; 2'),
('Reports','Follow smart / always','src/proto23_shell.js:218','Set display follow policy','y D','logFollow','display_settings owner','K','low','P; 2'),
('Reports','Latest / unread-anchor button','src/proto23_shell.js:219; src/display.js:179','Jump latest / resume follow','y U','native unread anchor / log scroll','unread count and log state','K','medium','P; 2; duplicate same job'),
('Reports','Stop / Resume combat log','src/proto23_shell.js:219','Stop/resume recording new combat reports, combat continues; resets reload','y U','setCombatReportsStopped','presentation state','K','medium','P; 2; different from combat stop'),
('Reports','Clear','src/proto23_shell.js:220','Clear visible history and context preview','y U','clear_message_log','current log','K','low','P; 2; destructive to session history'),
('Reports','Recorded subject buttons; notice Open','src/display.js:986; src/display.js:1198','Inspect event data; Open goes to current owned panel','y U','logDescription / expandWorkspaceModule','durable subject snapshot; known panel notice','K; hover/focus; Esc','medium','P; 2/4 preview, 5 Open; historical and current routes differ'),
('Footer','Authoring / Return to play','src/workspace_layout.js:394; src/workspace_layout.js:503','Switch context; preserve separate layouts','y U/D','setWorkspaceContext','mountWorkspace, no dev-only guard','K','low','A reachable in play; 5'),
('Footer','Layout disclosure','src/workspace_layout.js:393','Open tools menu','y U','workspace-layout-menu','mounted workspace, start screen chrome hidden','K','low','P; 5'),
('Footer / Layout','Comfortable toggle; Density select','src/workspace_layout.js:399; src/workspace_layout.js:401','Toggle compact/comfortable or choose inspection density','y D','toggle-density / density','layout owner','K','low','P/A; 5; duplicate density job, unequal option set'),
('Layout tools','Presentation select','src/workspace_layout.js:395','Choose Existing / Proto23 Shell / Proto23 layout','y D','selectShell','mounted workspace','K','low','P/A compatibility; 5; retain choices, remove internal labels if any'),
('Layout tools','Edit layout / preset / Reset layout','src/workspace_layout.js:399; src/workspace_layout.js:400','Enter editing / apply named preset / reset layout','y D','edit-layout / preset / reset','layout owner; edit/preset may leave shell','K','low','A; 5'),
('Layout tools','Colors / Crafting detail selectors','src/workspace_layout.js:402; src/workspace_layout.js:403','Choose scheme and beside/below recipe detail','y D','colors / craft-detail','browser storage, session fallback','K','low','P/A; 5, preserve crafting owner'),
('Layout tools','Panels disclosure; restore buttons','src/workspace_layout.js:404; src/workspace_layout.js:137','Browse known modules / restore owned panel','y U/D','openWorkspaceModule(id)','registry discovered / eligible','K','low','A; 5; duplicate panel entry'),
('Layout tools','Layout configuration disclosure / textarea / Export layout / Import layout','src/workspace_layout.js:405','Edit/copy or apply layout + colors/display JSON, not game save','y U/D','workspace-transfer; action export/import','version/schema validation; current layout preserved on error','K','low','A; 5; look-alike save import/export'),
('Every workspace panel','Title / Collapse / Expand / Pin','src/workspace_layout.js:65; src/workspace_layout.js:70','Collapse home / expand through center / pin layout position','y U/D','module ID; apply / expandWorkspaceModule','critical panels cannot hide/collapse; pinned constraints','K; title explicit Enter/Space','medium','P/A; 1–3 local consumer, 5 shell; pin is not pursuit pin'),
('Every workspace panel','Options / Dock / Earlier / Later / Hide','src/workspace_layout.js:71','Adjust placement/order/visibility','y D','module ID / workspace action','layout editing and pin/critical constraints','K','low','A; 5'),
('Every workspace panel','↕ handle; width/height; four float arrows; e/s/se grips; column dividers','src/workspace_layout.js:64; src/workspace_layout.js:75; src/workspace_layout.js:410','Reorder/dock/resize/position panel or columns','y D','workspace layout owner','editing / dock / pin / narrow constraints','arrows on handles/grips; sliders; Esc cancel gesture; pointer drag','low','A; 5; alternative same layout jobs'),
('Settings display','Setting selects / custom color pickers / Use scheme / reset browser display','src/display_settings.js:103; src/display_settings.js:136','Set or reset browser display preferences','y D','setDisplaySettings / resetDisplaySettings','registered known panel settings','K','low','P/A; 5; not hard reset'),
('Loading / recovery','PLAY; Export preserved character','src/main.js:9780; src/main.js:9794; src/workspace_layout.js:374','Start/hide loading screen; download blocked preserved save','y U / X','run / save_to_file','loading readiness; structured content recovery block','PLAY Enter/Space adapter; export K','episodic','P; 5 retain'),
('Opening','Continue introduction','src/main.js:10111','Advance display-only staged opening','y D','openingStep','stagedOpening on; existing progress skips','K','episodic','P; 5 retain'),
('Reading reference','Open Journal & Bestiary','src/main.js:10125','Open records','y U','records','reading reference visibility','K','low','P; 5; contextual duplicate entry'),
('Crafting','Cancel visual effect','src/main.js:9997','Cancel presentation effect, not craft/job','y U','workLedgerCraftEffects.cancel','crafting effect host','K','low','P; 5 retain; differs from Cancel work'),
]:row(*args)
for i,r in enumerate(rows,10):out+='| CN'+str(i)+' | '+' | '.join(r)+' |\n'
(base/'census.md').write_text(out)
print(len(rows),'primary rows written')
# Append hand-traced native generated families.
p=base/'census.md'
with p.open('a') as f:
 f.write('''
### Native generated controls

These families include each held stack, vendor/storage row, known recipe, skill, stance, quest and local choice emitted by the cited loops. Static complements are listed individually in the HTML annex.

| ID | Surface | Control | Owner file:line | Effect | State | Canonical route | Discovery / eligibility source | Keyboard path | Frequency assumption | Audience; Part; overlap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CN80 | Inventory row | Favorite star | src/display.js:2182; src/main.js:9442 | Toggle native item favorite | y G | change_item_favourite_status | actual inventory item; native disposition | L; delegation in index.html:1261 | medium | P; 1 retain; Favorites category is existing |
| CN81 | Inventory row | Use / auto-use favorite / Read / Equip / Unequip | src/display.js:2213; src/display.js:2228; src/display.js:2237; index.html:1261 | Consume, manage consumable automation, start reading or change equipment | y G | use_item / change_consumable_favourite_status / start_reading / equip_item / unequip_item | native tags, occupation, ownership and equipment rules | L; inspection focus does not authorize action | high | P; 1/3 retain; auto-use differs from ordinary favorite |
| CN82 | Trade / storage row | Row transfer; ×5 / ×10 / max | src/display.js:1403; index.html:1641; index.html:1710 | Add/remove staged trade quantities; storage transfers actual stock | y U trade staging / G storage | add/remove buying/selling list; move_item_to_storage / remove_item_from_storage | trade/storage mode and available counts | L, delegated click | high | P; 5 retain; same-looking quantities differ by owner |
| CN83 | Equipment / Tools | Occupied slot / Unequip | src/display.js:2289; index.html:1289; src/proto23_shell.js:224 | Native inspection or explicit unequip | y U or G | shell-detail / unequip_item | actual body equipment slots and held item | legacy click, shell selection adapter; no new shortcut claimed | medium | P; 3/4; empty slot is not a locked slot |
| CN84 | Local actions | Craft station / Sleep / Open chest | src/display.js:2394; src/display.js:2407; src/display.js:2413 | Open craft/storage; start sleep | y U / G sleep | openCraftingWindow / start_sleeping / openStorage | location crafting/housing; travel hearth; native availability | Enter/Space adapter under nativeHost: src/workspace_views.js:62 | high | P; 5 placement; Crafting duplicate entry |
| CN85 | Local actions | Dialogue / trade / jobs / training / gathering | src/display.js:2596; src/display.js:2617; src/display.js:2634; src/display.js:2682; src/display.js:2713 | Start native conversation/trade/activity | y G or U trade | start_dialogue / startTrade / start_activity | NPC display and dialogue rules; available activities, schedule, unlocks | nativeHost Enter/Space adapter | high | P; 5 retain; same square does not mean same action |
| CN86 | Local actions | Connected travel / challenge / remembered return / fast travel | src/display.js:2743; src/display.js:2790; src/display.js:2815; src/display.js:2837; src/display.js:2919 | Change actual location, possibly enter combat | y G | change_location | native connected/available challenge/travel arrays and travel time | nativeHost Enter/Space adapter when inside host | high | P; 5 retain; differs from presentation Back |
| CN87 | Location header / travel list | Bed/star location icon; remove remembered destination × | src/display.js:2533; src/display.js:2934; index.html:1298; src/main.js:9392 | Set/remove native favorite/bed travel destination | y G | handleLocationIconClick / remove_location_from_favourites | current location and native travel rules | L header/removal; do not assume nativeHost covers header | low | P; 5 retain; not pursuit pin |
| CN88 | Local action / dialogue | Action choice; text response; trade; end conversation; return dialogue root | src/display.js:2851; src/display.js:4890; src/display.js:4901; src/display.js:4913; src/display.js:4921; src/display.js:4955; src/display.js:4964 | Execute action/textline, trade, or leave/backstep dialogue | y G / U trade | start_game_action / start_textline / startTrade / end_dialogue / start_dialogue | native action/textline display/conditions | nativeHost Enter/Space adapter | high | P; 5 retain; backstep does not travel |
| CN89 | Current activity/action | End activity / cancel action / wake / stop reading | src/display.js:5004; src/display.js:5134; src/display.js:5217; src/display.js:5252 | End current native occupation with its own costs/rewards policy | y G | end_activity / end_game_action / end_sleeping / end_reading | current native occupation | nativeHost Enter/Space when rendered there | high | P; 5 retain; cancellation semantics differ |
| CN90 | Crafting | Recipe disclosure/selection; material/component selector; Craft | src/display.js:3520; src/display.js:3575; src/display.js:3603; src/display.js:3926; src/display.js:3988 | Inspect/select inputs; explicit Craft executes recipe | y U selection / G craft | updateDisplayedComponentChoice / updateDisplayedMaterialChoice / useRecipe | known recipe, station tier, materials, skill, native item disposition | legacy click; tab/tooltip code index.html:1438; runtime key check pending | high | P; 1 only strip precedent, 5 retain native crafting; 4 known previews |
| CN91 | Skills | Category disclosure; category up/down controls | src/display.js:5277; src/display.js:5286; src/display.js:5298; src/display.js:5315 | Open/reorder skill category display | y U | native skill category | native discovered skills/categories | L; no intrinsic button guarantee | medium | P; 5 retain |
| CN92 | Stances / quick stance | Favorite checkbox; selected stance radio; quick radio | src/display.js:5617; src/display.js:5618; src/display.js:5741 | Save favorite or change active combat stance | y G | fav_stance / select_stance / change_stance | native unlocked stances; quick list from favorites | K native checkbox/radio | medium | P; 2 placement; favorite is not stance selection |
| CN93 | Quests | Quest row expand/collapse | src/display.js:6168 | Inspect quest details | y U | quest entry | native received quests | L click; future keyboard evidence needed | medium | P; 5 retain, 4 preview |
| CN94 | Legacy combat renderer | Combatant stat/equipment/health displays; stance host | src/ui/combat_display.js:55; src/ui/combat_display.js:87 | Render combat facts; active stance controls emitted elsewhere (CN92) | n display | native combat frame | actual attackers/defenders and selected stance | H where tooltip exists | high | P; 2/4; no independent attack-target control found here |
| CN95 | Settings | Elemental preparation checkbox; durability checkbox; Repair per copy | src/main.js:1232; src/main.js:1258; src/main.js:1270 | Change opt-in gameplay mechanics or pay native repair | y G | changeElementalPreparation / commitDurability | writable owner; repairs require cost/affordability and no combat/occupation | K | low | P; 5 retain; not presentation-only settings |
| CN96 | Local reference | Furniture and home comforts; pacing status disclosure | src/main.js:1635; src/main.js:1388 | Show projected facts, not create furniture | y U disclosure | furniture_panel / pacing status | view.visible and native context | K summary | low | P; 5 retain; no action added |
| CN97 | Comparison | First equipment / second equipment selects | src/workspace_views.js:80 | Compare held/worn equippable facts without equipping | y U | equipment-comparison | src/main.js:10139 held+worn known equipment projection | K | medium | P; 3/4; differs from equip |
| CN98 | Reference tabs | Undiscovered ??????? tab | src/workspace_disclosure.js:14; src/workspace_disclosure.js:35 | Locked compatibility tab; reveal known label only after discovery | n while locked / y U when known | journal Bestiary/Books or Magic | createReferenceDiscovery(read facts); click guard prevents unknown activation | legacy L; aria-disabled, not intrinsic disabled | episodic | P; 5/4; current source contains placeholder tabs despite absent-until-known default proposal |
''')
# Enumerate each static HTML control using actual attributes, including legacy divs.
from html.parser import HTMLParser
class Controls(HTMLParser):
 def __init__(self):super().__init__();self.stack=[];self.items=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs); parents=[x[1].get('id','') for x in self.stack]; line=self.getpos()[0]
  control=(tag in ['button','input','select','textarea','a','summary'] or any(k.startswith('on') and k not in ['onload','oninput'] for k in a) or any(k in a for k in ['data-age','data-gender','data-height']) or a.get('id')=='hero_creation_panel_confirmation')
  if line<790 and control:self.items.append((line,tag,a,parents))
  if tag not in ['input','img','link','meta','br','hr']: self.stack.append((tag,a))
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];break
parser=Controls();parser.feed(Path('index.html').read_text())
def cell(s):return str(s).replace('|','&#124;').replace('\n',' ').replace('`','')
with p.open('a') as f:
 f.write('''
### Individual static HTML controls (including compatibility layout)

**Stated**: every row below is an actual tag/attribute before the inline script, not a claim that all are simultaneously visible. The effect column names the actual handler expression when one exists. Discovery uses the owning native panel, plus `src/main.js:10094` registry/discovery and `src/workspace_disclosure.js:14` reference guards. **Inferred**: frequency/Part. L means keyboard reachability is unverified, even when surrounding native buttons are adapted elsewhere.

| ID | Surface | Control | Owner file:line | Effect | State | Canonical route | Discovery / eligibility source | Keyboard path | Frequency assumption | Audience; Part |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
''')
 for i,(line,tag,a,parents) in enumerate(parser.items,1000):
  ident=a.get('id') or a.get('href') or a.get('data-translation') or ' / '.join(f'{k}={v}' for k,v in a.items() if k.startswith('data-')) or tag
  near=next((x for x in reversed(parents) if x),'document'); handler=a.get('onclick') or a.get('onchange') or a.get('href') or ('edit/select '+ident)
  part='5 retain';state='y U';gate='owning native panel / handler guard';key='K' if tag in ['button','input','select','textarea','a','summary'] else 'L'
  if 'inventory' in ident:part='1'
  if any(x in ident for x in ['character_show','character_name','equipment','hero_','cheat_start']):part='3' if not ident.startswith('hero_') and ident!='cheat_start' else '5 retain creation'
  if 'message_' in ident:part='2'
  if any(x in ident for x in ['options_','save','reset','backup','import','character_name','cheat_start']):state='y G' if not any(x in ident for x in ['options_button','close_options']) else 'y U'
  if tag=='a':state='n internal; X';gate='fixed link, no discovery gate'
  if 'hero_' in ident or ident=='cheat_start' or any(x in near for x in ['age_selection','gender_selection','height_selection']):gate='character creation; choice committed on Confirm'
  if 'journal_show_' in ident or ident=='show_magic':gate='native reference discovery; src/workspace_disclosure.js:14; Notebook own hidden flag'
  if ident=='crafting_makeable_filter':handler='filter to known recipes makeable now';state='y U'
  if ident=='saved_file_input':handler='loadProgress(event), native replace-save flow';state='y G'
  if 'hero_creation_name_field'==ident:state='y U draft'
  f.write('| CN'+str(i)+' | '+' | '.join(map(cell,[near,ident,f'index.html:{line}',handler,state,ident,gate,key,'episodic' if part.startswith('5') else 'medium','P; '+part]))+' |\n')
print('static rows',len(parser.items))
# The conditional renderers expose public view rows. Do not copy content pack data or sealed truth.
modules=[
('expedition_ui','Expeditions','Per-action start; Cancel current expedition','command(action.id, sequence); cancel(job.id, sequence)'),
('technique_ui','Movement observations','Observation/practice action; response choices; cancel practice; cancel timed practice','command / answer / cancel'),
('village_ui','Village notes','Read route booklet; Inspect crossing; all available village action rows; cancel reserved work','readBook / command / cancel'),
('town_ui','Survey office','Every available town action; Cancel unfinished town work; Last exchange disclosure','command / cancel'),
('simulation_ui','Craftsman & workshop','Enroll; each simulation action; conversation/rest rows; Pack 3 kits; Pause / Resume packing; Cancel current work; response choices; Withdraw','command with action token'),
('systems_workshop_ui','Iona work ledger','Every next action; Learning/assistance/irrigation disclosure and optional action; cancellations defined by frame','act(id)'),
('storylet_ui','Village encounters','Begin encounters; every response per visible encounter; disclosure','command response token'),
('pursuit_ui','Encounters & pursuit','Track disclosures; every track action and response; Withdraw encounter','command token; this is gameplay pursuit, not proposed reminder box'),
('frontier_campaign_ui','Road rivalry & field legacy','Per-campaign actions; Start/resume duel; Withdraw; Review renewal; Confirm renewal; Keep training; renewal disclosure','command; previewFieldRenewal is preview only'),
('party_ui','Guarded contest / bench partner','Cancel prep/re-rig; ask assistance; decline; accept; settle with kit; release; each party/partner action','command token'),
('exchange_ui','Parcel exchange','Every exchange action; Cancel reserved work','command token'),
('observation_ui','Paired glass','Open anonymous view; each observed action','command token'),
('skill_expansion_ui','Methods & practice','Enroll; each known method/action/response; Cancel accepted work; Withdraw agreed press','command token'),
('feature_expansion_ui','Tools, practice & local lives','Every section/entry action; nested preparation disclosures','command(entry.action.command)'),
('management/ui','Market courtyard','Each section disclosure and action; courtyard records','command(row.action, sequence)'),
('crush_social_views','Finite preparation & Village return','Each projected action; Pause future prep; Resume legal step; Cancel future prep; Remove ended phase','command / plan_control'),
('causal_story_ui','Village crossroads','Refresh actions; each projected command; Cancel accepted work; known accounts and group disclosures','command / refresh presentation'),
('backlog_expansion_ui','Optional lives & local experiments','Family disclosure; every previewed action; separate creation and local mounted instances','command(action); preview supplies visible/eligible/reason'),
('repository_absorption_ui','Lantern & floodline work','Begin wet-lantern work; per-route commands; Cancel accepted work; recorded findings','command token'),
('ink_narrative_ui','Conversation','Every displayed choice/action; conversation disclosure','act / choose'),
('feature_expansion_nested_ink_ui','Nested conversations','Per-host narrative choices and native/life preview/commit commands','previewNative / commitNative / previewLife / commitLife / command'),
('original_frontier_campaign_ui','Local work & findings','Begin parcel work; commands; Cancel; Pause after work; Resume target; Withdraw; routine count 1–20; Start finite routine','command token; count changes draft only'),
('pocket_realm_ui','Folded doorway','Each pocket action, including actual entry/exit; disclosure','command token'),
('body_ui','Body & recovery','Every body work action; Cancel body work','command token'),
('field_ui','Field association & workshop','Group disclosures; begin workshop; all field actions; Cancel field work; queue 3 kits / 3 lever jobs; Pause / Resume; encounter responses','command token'),
('promise_ui','Wary traveler','Speak; every projected action; Cancel accepted work; remembered checks disclosure','command token'),
('chronicle_ui','Elder & chronicle','Open/mortal enrollment; inspect; spar/assault; Guard / sidestep / Rat-step / strike / withdraw; manual/auto policy; reports/briefing/pledge/duty/cancel/inherit/debrief/lesson/settle; reflect/teach/study each lesson; export life/archive; reset game; begin heir/independent; archive disclosure','command / duty / cancelDuty / exportSave / reset / beginHeir / beginIndependent'),
('known_routes_ui','Known routes','Each known-route action and section; focus fallback when removed','command(token) to existing owner'),
('adventure_notebook','Notebook','Notebook views/tabs and section disclosures; entries use existing owner routes','notebook owner'),
('character_bio_ui','Character biography','Each biography section disclosure; Open practice notes','practice() route, no practice execution'),
('titles_ui','Titles','Disclosure; worn-title toggle; Worn title selector','selectWorn, saved native title effects'),
('life_record_ui','Remembered years','Remember this day; Years remembered disclosure','remember(), native save write'),
('npc_lives_ui','Village neighbors','Get to know neighbors; disclosure','meet(), native population/save mutation'),
('generated_people_ui','Village travelers','Welcome travelers; each person disclosure; Meet / Talk / supply / offer settlement; every request response/action','generated/request command with person/request IDs'),
('village_career_ui','Patrol & custody','Assign Iona; mentor compensation choices; solo patrol; favor shift; accept/decline tuition; tutor/notes/read/practice; return kit / keep debt / pay debt; promotion; Open Patrol & custody','mentor / resolve / promote / tutor / notes / readNotes / practice; custody link navigates'),
('event_feed_ui','World events','World events / Recent news / Life / Heard disclosures; Open lead button','open(event) routes/focus existing control; no automatic accept'),
('structured_pack_ui','Beginning / structured pack','Begin; each projected action; repeated action ×3; Stop repeat; Cancel job; Accept renewal; group disclosures','command type begin/action/stop-repeat/cancel/renewal'),
('content_pack_ui','Optional worlds','Visit; Return to Village; each pack action; Cancel work; pack disclosures','command(pack id, enter/return/cancel/action)'),
('continuation_ui','Connection center view','Open connection; peer tabs; recognize/enroll; Continue paused boundary; investigation/pause; Mark/Replace checkpoint; Return initial / later; Begin fresh life confirmation paths; cancel confirmation; resume life; repeat-loop destinations / stop loop; memories disclosures','centerModes.open plus command; confirmations and tabs change UI only'),
('mixture_ui','Village mixing counter','Launcher; ingredient quantities and Buy 1; method/process selects; Mix one vial; Cancel and return inputs; Drink/Experiment dose; Save observed method; repeat count; Queue learned method','run buy/mix/cancel/use/learn/repeat; selectors update quote only'),
('harvest_ui','Harvest / handling','Process whole / Take only each part per held species; Cancel processing; Auto-process whole carcasses checkbox; developer chain inspector is separate','act(action); automatic setting saved'),
('habitat_care_ui','Meadow pen','Each care action; Care and away policy disclosure','act(action)'),
('work_ledger_ui','Work Ledger','Each command row; select controls from declared ledger settings; Cancel active effect','submit(row.action); display selectors; cancelEffects'),
('customization_ui','Appearance / Effects & sound','Profile / Native module / Seasonal theme / Manual season / Component theme / Font / Effects / Receipt placement / VFX motif selects; profile name / font size / spacing / receipt duration / background / text / accent / VFX colors / sound-after-gesture / Static VFX / Plain text VFX / JSON fields; Create draft; Apply and save; Reset/Discard; Import to draft; Export draft JSON; effects preview/test/stop controls','save draft; local preview actions do not save automatically'),
('work_ledger_author_ui','Original rules','Rules JSON editor; Apply rules; Discard draft; Reset original rules; Export rules','apply / reset persist gameplay rule draft; export downloads'),
('authored_site_ui','Original site','Draft text/integer/settings fields; Apply site; Go to site; Discard edits; Reset defaults; Export draft','apply/persist / openSite / download; authoring, not dev-gated'),
('foundation_interaction_ui','Experimental arena','Experimental admission drill; every probe scenario action','command token, gated foundationProbeEnabled in src/main.js:9930'),
('start_probe_ui','Layered start probe','Layer axis locks/roll controls; seed; Roll start; Begin with this start checkbox','local start preview; selected choice feeds creation; localhost + start_probe=1'),
('absorb_c2/panel','Local life','Every known local-life action including investigation; disclosures','act(id)'),
('absorb_d/ui','Fort supply','Ask/buy repair notes; Repair hatch; all supply-board / repair actions supplied by view','act(id), native costs and readiness'),
('absorb_e1/panel','Pacing options','Hunger and seasonal-weather checkboxes','onChange saved gameplay pacing'),
('absorb_p23/exposure/panel','Exposure options','Hazardous storm/gust profile checkbox, off by default','onChange, saved hazardous exposure option'),
('absorb_p23/host_joins/tranche_one_ui','Lived home','Every household action from frame','act(id)'),
('absorb_p23/host_joins/tranche_two_ui','Living equipment','Spend 3 cinders for up to 5 stamina per eligible collector','spend(row.key)'),
('absorb_p23/host_joins/tranche_three_ui','Books, earned rest & leatherwork','Every study/rest/identify/salvage action from frame','act(row.id,row)'),
('absorb_p23/host_joins/tranche_four_ui','Village practice & familiar ground','Every projected local action','act(row.id)'),
('absorb_p23/host_joins/combat_options_ui','Combat options','Every current tactics action','act(action.id)'),
('absorb_p23/host_joins/encounter_profiles_ui','Reed-circle rung','Every known training action','act(action.id)'),
('absorb_p23/host_joins/growth_profile_ui','Study conditioning','Each enrollment/conditioning action','act(row.id, sequence)'),
('absorb_p23/host_joins/world_adaptation_ui','Mistglass conservatory','Every observed available adaptation action','act(action.id)'),
]
manifest=json.loads((base/'scratch/census/source-manifest.json').read_text());paths={r['path'] for r in manifest}
# Discover non-_ui support owners used by main.
paths.update(['src/reveal_chain.js','src/status_window.js','src/workspace_disclosure.js','src/adventure_notebook.js','src/main.js','src/chain_inspector_ui.js','src/absorb_p23/known_detail/presentation.js'])
with p.open('a') as f:
 f.write('''
### Conditional panel census and native command boundaries

Each row covers all emitted instances of the named command/disclosure family, including label changes and disabled states. **Stated** controls and routes; **inferred** frequency/Part and combined state classification. Read `src/main.js:9880`–`:10207` for mounted dependencies and callbacks. Most panels derive individual visibility and eligibility from a public `read()` / presentation preview and retain their own native command validation. This is deliberately not a dump of undiscovered world actions.

Keyboard **K** applies to actual generated buttons/selects/inputs/summaries; it does not prove live focus restoration or keyboard access through every parent. Navigation/disclosure/preview/count edits are **y U**; executing persistent commands is **y G**; export is **X**. **5 retain** covers placement only; gameplay loops, economy, story, timers and persistence remain out of Parts 1–5. Named discoveries never authorize exposing their undiscovered definitions.

| ID | Surface | Controls (all instances) | Owner file:line | Effect / canonical route | Changes state | Discovery / eligibility source | Keyboard path | Frequency assumption | Audience; Part |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
''')
 for i,(stem,surface,controls,route) in enumerate(modules,2000):
  path='src/'+stem+'.js'
  if not Path(path).exists():
   # Notebook is mounted as an owner even if its implementation has a different name.
   print('missing conditional owner',path);continue
  paths.add(path);lines=Path(path).read_text().splitlines()
  hits=[j for j,l in enumerate(lines,1) if re.search(r'button|summary|input|select|textarea',l)]
  cite='; '.join(f'{path}:{j}' for j in hits[:1])
  # Include the command handler line separately, so readers can trace semantics rather than just headings.
  handlers=[j for j,l in enumerate(lines,1) if re.search(r'onclick|addEventListener|command\(',l)]
  if handlers:cite+='; '+f'{path}:{handlers[0]}'
  audience='DEV' if stem in ['foundation_interaction_ui','start_probe_ui'] else 'A' if stem in ['customization_ui','work_ledger_author_ui','authored_site_ui'] else 'P'
  part='5 retain'
  if stem=='titles_ui':part='3/4'
  if stem=='absorb_p23/host_joins/combat_options_ui':part='2 placement; gameplay retained'
  gate=f'{path}:1 public frame/read + render hidden/disabled checks; main wiring'
  if audience=='DEV':gate+='; explicit local/probe gate'
  f.write('| CN'+str(i)+' | '+' | '.join(map(cell,[surface,controls,cite,route,'y U/G; X only for listed exports',gate,'K native controls; dynamic focus unverified','medium' if audience=='P' else 'low',audience+'; '+part]))+' |\n')
# Save exact current source manifest, plus supplemental command construction evidence.
manifest=[];sites=[]
pattern=re.compile(r'''(?:\b(?:button|btn|action|add|requestButton)\(\s*(?:['"`]))|(?:\b(?:node|element|el)\(\s*['"](?:button|summary|select|input|textarea)['"])|(?:createElement\(\s*['"](?:button|summary|select|input|textarea)['"])|(?:\.on(?:click|change|input)\s*=)|(?:addEventListener\(\s*['"](?:click|change|input|keydown)['"])|(?:setAttribute\(\s*['"]onclick['"])''')
for path in sorted(paths):
 pp=Path(path)
 if not pp.exists():continue
 s=pp.read_text();import hashlib
 manifest.append({'path':path,'sha256':hashlib.sha256(s.encode()).hexdigest(),'lines':len(s.splitlines())})
 for n,l in enumerate(s.splitlines(),1):
  if pattern.search(l):sites.append({'owner':f'{path}:{n}','source':l.strip()})
(base/'scratch/census/source-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(base/'scratch/census/control-sites.json').write_text(json.dumps(sites,indent=2,ensure_ascii=False)+'\n')
print('conditional rows',len(modules),'source files',len(manifest),'construction/handler receipts',len(sites))
with p.open('a') as f:
 f.write('''
### Supplemental controls and limits of enumeration

| ID | Surface | Control | Owner file:line | Effect | Changes state | Canonical route | Discovery / eligibility source | Keyboard path | Frequency assumption | Audience; Part |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CN100 | Practice | Run toggle / Investigate toggle / Review learned preparation | src/reveal_chain.js:48; src/reveal_chain.js:55; src/main.js:10132 | Change saved movement/search policy; recipe review opens Crafting/Alchemy | y G toggles / U recipe route | toggleRun / investigate / craft | knownPracticeHints, reveal knowledge, station, writable/occupation reasons | K | medium | P; 5 retain; review is not craft |
| CN101 | Developer harvesting | Chain inspector disclosure and emitted trace controls | src/chain_inspector_ui.js:1; src/main.js:9881 | Inspect internal chain receipts; no player knowledge claim | y U inspection | createChainInspector | developer = is_on_dev() OR harvest-inspector=1 | native controls where emitted; inspect source site receipts | low | DEV; 5 retain off player directory |
| CN102 | Developer combat utility | Exit temporary combat window | src/main.js:9658 | Re-enter current native location and remove utility window | y G/U | combat_window exit handler | utility combat path, not a normal player attack control | L div click | low | DEV utility; 2 retains exclusion from player controls |
| CN103 | You biography | Played minutes exact-value disclosure | src/main.js:9921; src/absorb_p23/known_detail/presentation.js:67 | Reveal exact native played number | y U | mountKnownNumber | existing played clock / numberFormat | K summary | low | P; 3/4 |
| CN104 | Status window | Focusable known status region, no command controls | src/status_window.js:8 | Read revealed native card | n | status-window | awakenedStatusCard; appearance module added only onKnown | Tab region; no activation implied | medium | P conditional; 3/4 |
| CN105 | Display settings | Staged opening; Large numbers; Panel reveal; Coin float; Automatic-charge float; New-item dot; Log follow; Vitals value text; Vitals level | src/display_settings.js:8 | Each select changes its corresponding browser preference | y D | DISPLAY_SETTINGS keys | settings browser owner; panel additions only after registration | K select | low | P/A; 5; Log follow duplicate of Reports select |
| CN106 | Display settings | Gain / Loss / Money / Blocked color; each Use scheme | src/display_settings.js:28; src/display_settings.js:109 | Override or clear semantic palette color | y D | DISPLAY_COLORS keys | browser display owner | K color chooser and button | low | P/A; 5; distinct from save-level appearance profiles |

The complete current renderer/handler-site receipt is [scratch/census/control-sites.json](scratch/census/control-sites.json), paired with SHA-256/line-count [source-manifest.json](scratch/census/source-manifest.json). It includes constructors, data-driven button factories, inline HTML fragments and event handlers, rather than pretending a regex hit is a distinct visible button. Main wiring, owner names and the semantic family rows above disambiguate those hits. The receipt is supporting evidence, not an executed accessibility or visibility census. The current conditional labels/counts in an actual discovered save, font loading and all key journeys remain unverified. Source may move after this snapshot because other sessions own runtime edits.

## Visible symbols / glyphs (F16)

**Stated** source construction below; actual visibility is conditional on layout and state. No new **shown** claim is made. Frequency assumptions follow the containing surface. Symbol replacement is **later**, not newly assigned implementation scope.

| ID | Glyph / dependency | Meaning and owner file:line | Interpretation / Part mapping |
| --- | --- | --- | --- |
| CN300 | Material Icons Google Fonts stylesheet | index.html:22 external icon font; ligature strings inside i/span tags | **inferred** dependency risk if unavailable; no reproduced failure. Keep text/action names independent. Part 0 inventory; later symbol correction, Part 5 placement only |
| CN301 | check_box_outline_blank | src/display.js:2598 dialogue; :2619 trade; :2669 jobs; :2700 training; :2728 gathering; :2751 travel; :2856 action; :2914 fast travel | Generic action bullet, not a checkbox. Same shape, different semantics. Part 5 local placement; replacement later |
| CN302 | check_box / check_box_outline_blank | src/display.js:6213; :6215 | Completed/incomplete quest marker. Look-alike with CN301 has a real completion meaning here. Part 5 retains native meaning |
| CN303 | ♨ | src/village_workspace.js:121 temperature badge | Emitted for every temperature, not just heat. **inferred** risk: suggests hot conditions at ordinary/cold values. Actual cold suffix derives native cold class. Later symbol fix; Part 5 conditions placement |
| CN304 | ◈ | src/village_workspace.js:121 season fallback | Unmapped season indicator, not a world/rarity/quest marker. Text still provides season. Later symbol fix |
| CN305 | ❀ / ☀ / ❧ / ❄ | src/village_workspace.js:121 | Spring / Summer / Autumn or Fall / Winter. ❄ also snow, so nearby text owns meaning; no new seasonal effects implied |
| CN306 | ☂ / ❄; ☾ / ☼ | src/village_workspace.js:121; :123 | Rain / Snow; native night/day. Unknown weather gets no weather symbol, not a fabricated default. Part 5 |
| CN307 | ⚔ / ◆ / ▤ / ≡ / ✧ | src/panel_kit.js:4; :30 | actions / character / records / log / optional role ornaments; aria-hidden. Hidden in parity r3 by styles/ui_tokens.css:742. Do not call them visible placeholder icons in that layout |
| CN308 | star / star_border; item favorite icon | src/display.js:2185; :2535; :2537 | Item favorite and remembered location controls are distinct owners. Part 1 Inventory / Part 5 travel; never treat as rarity without native source |
| CN309 | bed / inventory_2 / construction / storefront | src/display.js:2397; :2409; :2415; :2533; :2912; :4910 | Craft station / sleep or bed-return destination / storage / trade. Bed on a travel route is not “sleep now.” Part 5 retains commands |
| CN310 | warning_amber | src/display.js:2758; :2829; :2923; index.html:779 | Combat/challenge/danger travel or hard reset warning. Same warning icon does not imply identical consequence. Part 5 |
| CN311 | arrow_back / ← / › / close / X | src/display.js:4919; :4962; :2934; src/village_workspace.js:159; src/proto23_shell.js:172; index.html:776 | Dialogue back/root, subject overview, full item, destination removal or dismiss options. Read command label/owner; do not collapse into one Back handler. Parts 4/5 |
| CN312 | keyboard_double_arrow_down / check; category up/down Material ligatures | src/display.js:3520; :3575; :3918; :3981; :5277; :5283; :5295 | Recipe/category/input disclosure, chosen component/material, category ordering. Selection check is not a quest-complete signal. Part 1 precedent only, native crafting retained |
| CN313 | cloud / ac_unit | src/display.js:4657; :4660 | Native weather-temperature presentation; distinct from shell condition badges. Part 5; alternative layout, not duplicate weather mechanics |
| CN314 | settings / help_outline; GitHub and Ko-fi image marks | index.html:707; :709; :711; :712 | Game options / Help / upstream repository / upstream support recipient. Part 5 proposed About/Credits, preserve destinations and identify recipient |
| CN315 | ↕ / arrows / resize grips | src/workspace_layout.js:64; :76; :77 | Layout movement/docking/resize chrome, not in-world movement. Authoring controls, Part 5 |
| CN316 | ? versus ??????? | src/workspace_navigation.js:36; src/workspace_disclosure.js:35 | ? opens shortcuts; ??????? is an undiscovered locked reference tab. Neither is an unexplained decorative replacement. Current placeholder source conflicts with a blanket “all unknown routes absent” census claim; Part 5/4 must respect the actual owner and future chosen discovery behavior |
| CN317 | New-item dot / arrival • / ×N / quality % | src/display_settings.js:18; src/workspace_navigation.js:72; src/display.js:1406; src/display.js:3918 | New possession/route attention, quantity or repetition, native quality. Do not reinterpret as rarity or quest obligation. Parts 1/2/5; log ×N collapse is proposed, not established by inventory quantity buttons |
| CN318 | 🐱 / :) / ??? | index.html:61; :76; src/village_workspace.js:15; :164 | Upstream author ornament / loading status emoticon / unavailable or unknown fact placeholder. Decorative or informational, not an action. Credits may move; unknown facts retain their projection policy |

## Duplicate routes versus look-alikes

**Stated** at cited owners; proposed treatment **inferred**, not an accepted new layout.

| ID | Pair / family | Classification | Plan consequence |
| --- | --- | --- | --- |
| CN320 | Global + center peer Here/Skills/Crafting/Mixing + More panels + panel Expand (`src/workspace_navigation.js:18`, `:43`, `src/workspace_layout.js:137`) | Same owned destination, multiple entry routes; some use different presentation (focus existing Inventory vs expansion) | Part 5 compare removal/placement against repeated journeys; never copy handlers or blindly erase useful shortcuts |
| CN321 | Compact Inventory category/sort + native category/sort (`src/proto23_shell.js:198`, `index.html:214`) | Same job through delegation, mostly alternative visible layout | Part 1 preserve category/search/selection/native ordering; do not count two systems |
| CN322 | Latest + unread anchor (`src/proto23_shell.js:219`, `src/display.js:179`) | Same jump/follow job with unread-state feedback | Part 2 may share trigger/feedback; preserve meaningful unread state |
| CN323 | Comfortable shortcut + Density select (`src/workspace_layout.js:399`, `:401`) | Same preference owner, different choice set | Part 5 compare one complete accessible choice; no removal required by census |
| CN324 | Gear disclosure + Character Equipment tab + full equipment comparison (`src/proto23_shell.js:110`, `index.html:670`, `src/workspace_views.js:80`) | Related subject; disclosure/tab browse owned gear, comparison selects two items without equipping | Part 3 may share equipment home; comparison is a different tool |
| CN325 | Global Settings + footer options gear (`src/workspace_navigation.js:12`, `index.html:707`) | Look-alike label, different destination: appearance authoring versus native game options | Part 5 needs clear names/entry grouping, not silent substitution |
| CN326 | Village subject Back + center Back + native location travel + optional-pack Return (`src/village_workspace.js:159`, `src/center_modes.js:35`, `src/display.js:2768`, `src/content_pack_ui.js:25`) | UI deselection / view history / actual native travel / actual pack exit | Preserve separate effects, availability and history |
| CN327 | Layout Pin + future pursuit pin + favorite star (`src/workspace_layout.js:70`, `NEXT_PARTS_2026-10-15.md:83`, `src/display.js:2182`) | Position lock / reminder / favorite item or route | No common “pin state” inferred; Part 5 reminder owner remains unresolved design implementation |
| CN328 | Save Export/Import + layout Export/Import + authoring draft Export/Import (`index.html:703`, `src/workspace_layout.js:405`, `src/customization_ui.js:113`) | Game backup/replacement versus display configuration versus uncommitted authoring draft | Part 5 keep object nouns and native guards; none is interchangeable |
| CN329 | Stop combat log / Withdraw / end activity / Cancel visual effect (`src/proto23_shell.js:219`, `src/frontier_campaign_ui.js:20`, `src/display.js:5004`, `src/main.js:9997`) | Recording suppression / gameplay departure / occupation ending / presentation cancellation | Preserve command identity and known costs; never unify by “Stop” label |
| CN330 | Existing gameplay Encounters & pursuit vs proposed Pursuits reminder box (`src/pursuit_ui.js:6`, `NEXT_PARTS_2026-10-15.md:83`) | Different systems: encounter action owner vs summary links to existing owners | Part 5 should name/remap reminders deliberately, not repurpose gameplay pursuit callbacks |

## Proposed plan edits

Exact sections refer to `NEXT_PARTS_2026-10-15.md`; this lane does not edit that owner. All replacements below are **inferred proposals** constrained by stated source and accepted direction.

| ID | Exact row / section to change | Replacement text |
| --- | --- | --- |
| CN340 | Part 0, Outcome bullet: census clause | “Use next-parts/census.md for the source census and its hashed source-site receipt. Include static, conditional and compatibility controls; distinguish UI, browser display and saved gameplay changes. Each data-driven family covers all emitted instances. Keep use frequency labelled assumption until a named journey provides evidence; source presence alone is not pixel visibility.” Keep the existing mockup outcome after this clause. |
| CN341 | Part 0, Use bullet after UX7 comparison sentence | “Count global/local/More/Expand entry routes separately from owned destinations. Test same-job duplicates and different-job look-alikes from CN320–CN330. In particular, distinguish overview Back, center Back and actual travel; native game Settings versus appearance authoring; and gameplay pursuit versus reminder pins.” |
| CN342 | Part 1, Outcome category sentence | “Use native category semantics, including any existing Favorites category; do not invent new favorite behavior. Compact selectors currently delegate to native controls. Preserve the native owner, search, new markers, selection identity, category counts and order semantics when comparing tab-strip placement.” |
| CN343 | Part 2, Log paragraph after category-tabs sentence | “Carry forward category filters, smart/always follow, unread/latest jump, recording Stop/Resume and Clear with explicit scope. Stop combat log changes recording while combat continues; Clear changes visible history. Do not turn either into a combat command or imply complete recording while stopped.” |
| CN344 | Part 5, Placement / Done | “Authoring is currently reachable from ordinary play and is not dev-gated. Preserve deliberate editor access and native rule-apply guards while comparing its placement. Current source scan did not find dummy-counter DOM/handlers; F17’s counter is historical captured evidence. Keep the agreed no-permanent-counter direction without inventing a removal task. Distinguish game save replacement, layout import and authoring draft import.” |
| CN345 | Round 7 W5 / I1 step 1 | “Symbol census CN300–CN318 distinguishes generic action-square versus quest status, conditional role ornaments hidden under parity r3, universal-temperature steam and unmapped-season fallback, actual image marks, unknown placeholders and external Material Icons. Replacement remains later. Reproduce font failure before reporting it as a defect.” |
| CN346 | Part 0, Done clause for census | “Source census complete at the family/construction-site level; actual per-state control visibility, discovery, keyboard journeys and use-frequency evidence remain a separate UX12 comparison gate at all three desktop targets. No source census or static screenshot settles final grouping or human acceptance.” |

## Settled without asking

Classification counts cover the following **16 unresolved planning points**, not the number of census controls. Classes 1–4 can be resolved or routed without a user preference question; class 4 entries explicitly retain unrun evidence checks.

| ID | Class | Point | Resolution / evidence |
| --- | --- | --- | --- |
| CN350 | 1 already answered | Production edits/builds in this lane | No; COMMON.md:7 limits writes to lane/scratch and forbids build/dispatch/commit. |
| CN351 | 1 already answered | Desktop or mobile | All three desktop targets; mobile deferred, NEXT_PARTS:9. |
| CN352 | 1 already answered | Are grouped menus now the default? | No; eligible comparison, direct baseline retained, NEXT_PARTS:139 and :161. |
| CN353 | 1 already answered | Must counter/credits remain in gameplay footer? | No; Round 7 and Part 5 carry current direction; NEXT_PARTS:19 and :83. Preserve attribution elsewhere. |
| CN354 | 1 already answered | Does this authorize knowledge truth/art replacements? | No; corrected estimates use observer-visible inputs; symbol replacement later, NEXT_PARTS:252 and R14:231. |
| CN355 | 2 straightforward derivation | State yes/no interpretation | Include UI/session/display/gameplay scope so filtering is not misreported as no change; owner effects are in the census. |
| CN356 | 2 straightforward derivation | Authoring audience | A reachable to player, not DEV; mountWorkspace unconditionally adds it, src/workspace_layout.js:394. |
| CN357 | 2 straightforward derivation | Same Village labels | Separate navigation, selection and actual travel effects; CN326. |
| CN358 | 2 straightforward derivation | Existing favorites / pursuits | Preserve native Favorites; do not confuse gameplay pursuits with proposed reminder summary, CN321/CN330. |
| CN359 | 3 reversible future implementation choice | How to present family census | Static controls individual; data-driven families tied to renderer IDs and owner eligibility. No secret/data-definition dump. |
| CN360 | 3 reversible future implementation choice | Shared menu handling | Propose delegate to existing route/action owners; no second handlers or universal framework. UR51/UX9, src/workspace_navigation.js:18. |
| CN361 | 3 reversible future implementation choice | Symbol fallback plan | Propose labelled controls with existing local assets/inline SVG only if a later symbol slice is selected; do not generate art now. R14 F16, CN300. |
| CN362 | 4 focused evidence | Current counter presence versus capture | Bounded current source search found no live counter implementation; older capture claim retained. Exact deployed/cached bundle or DOM must be inspected in a future allowed fresh-origin route before declaring runtime removal. |
| CN363 | 4 focused evidence | Visible controls/discovery at each size | Source census done; future comparison must use populated/fresh and conditional owner states at the three targets, without exposing unknown routes. No browser run authorized here. |
| CN364 | 4 focused evidence | Keyboard and font behavior | Intrinsic semantics/explicit adapters documented; browser focus restoration, legacy click targets and Material font failure remain unrun checks. |
| CN365 | 4 focused evidence | Actual frequency and final duplicate removal | All frequencies assumptions. UX12 click/key/return journeys and human comparison settle tradeoff; no telemetry collection or default change now. |

## Questions for Weibao

None. Counts: class 1 = **5**, class 2 = **4**, class 3 = **3**, class 4 = **4**, class 5 = **0**. The final navigation/visual preference gate already belongs to Part 0/Part 5’s concrete comparison; this source census does not introduce another interview gate.
''')
