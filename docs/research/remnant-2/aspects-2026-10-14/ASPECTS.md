# Aspect pass, 2026-10-14 dispatch

Inspected 2026-10-15. All twelve aspects are PARTIAL; none was played. Source codes resolve in ../SOURCE_LEDGER.md. Counts describe emitted exports and naming patterns, including partial records, not full accepted gameplay.

## A01: Dialogue and conversation

Status: PARTIAL. Sources: B8, B9, B10.

EventTree graph types include choices, line records, speakers, item conditions, variable conditions and effect nodes. The 127 EventTree filename attempts retain available text/keys/IDs privately; many objects fail schema reads. A separate 45-export bark state machine has health, range, LOS, combat and speaking/cinematic conditions.

Implementation: EventTreeNode_Dialog, DialogLine, Branch_DialogOption, HasItemCondition; Char_Pan_Wolf_Dialogue_StateMachine. Full native ordering and all item predicates unread.

PROPOSALS: K6/K11/K23: adapt one useful conditional conversation through P19. K19/K32: keep ambient arbitration under P21 separate from transaction state.

## A02: Narrative delivery

Status: PARTIAL. Sources: B3, B8.

Campaign and story bytecode activate/complete objectives, trigger dialogue and invoke rewards. Lore items and objective text have localization keys. Outcomes and closure are not fully reconstructed.

Implementation: QuestObjective exports, EventTree triggers and lore definitions, Quest_Campaign_Main ExecuteUbergraph. Full prose and conditions retained privately where readable.

PROPOSALS: K12/K16/K29: pair changed objectives with local aftermath via P12. K11/K23: report a sourced discovery rather than omniscient roll knowledge via P11.

## A03: Implementation architecture

Status: PARTIAL. Sources: B1, B3, B5, B7.

UE5 IoStore payload includes cooked Blueprint generated classes, Kismet bytecode, component-based quests, data tables and native module references. Selected scripts call Engine, Remnant, GunfireRuntime and GunfireSaveSystem. Full C++ behavior is unread.

Implementation: Read UE5.2 using CUE4Parse; retoc indexes and one legacy conversion succeeded. Quest wrappers, tile sets, conditions, actions and state machines form separate authored layers.

PROPOSALS: K2/K13/K34: inspect actual command effects before creating abstractions. K33: use typed content definitions and real consumers, extending P16.

## A04: Save and persistence

Status: PARTIAL. Sources: B3, B4, T1.

Campaign bytecode references SaveGame-marked fields and CommitSave; wrappers own persistence components. Third-party reader distinguishes profile/world saves and decompresses zlib chunks. This does not establish native atomicity, migrations or recovery.

Implementation: GunfireSaveSystem calls; RemnantSave.cs FileHeader/ChunkHeader/DecompressSave, RemnantCharacter.cs. No actual save opened.

PROPOSALS: K18/K33: retain carrier ownership and native effects together, P05/P24. Profile wrapper P23 stays separate and unaccepted.

## A05: AI and NPC behavior

Status: PARTIAL. Sources: B9, B2.

Bark state machine directly reads actor context. The index contains 371 state-machine suffix matches and AIData/EQS asset families. Planner scoring, general schedules, faction law and player/NPC parity remain unread.

Implementation: ActorState, StateTransition, tag/health/range conditions in the chosen dialogue machine; EQS and character-controller paths are inventory only.

PROPOSALS: K6/K10: reuse lawful action consumers before P25 planning. K19/K23: one bounded bark selector is sufficient for a first P21 leaf.

## A06: UI and information design

Status: PARTIAL. Sources: B10.

Dialogue option widgets, trait widgets and shared inspect-data structures were exported. Focus/tooltip bindings and widget hierarchies are inspectable, with partial records. No screen was rendered, so desktop density, keyboard behavior and accessibility are unverified.

Implementation: UI/UI_Dialogue and UI/UI_Traits widget families; UI2 asset families. Numeric defaults from failed exports are not accepted layout facts.

PROPOSALS: K14: translate useful choice clarity onto the accepted Proto23 frame. Use UI_RULES at 1366×768; no proposed adoption of Remnant screen composition.

## A07: Content authoring and modding

Status: PARTIAL. Sources: B2, B4, B5, B8.

Cooked assets separate story wrappers, subquest filters, tiles, spawn tables, actions, event trees and speakers. Modding API, source editor workflow, effective patch resolution and validation rules remain unread.

Implementation: RemnantQuestSubQuest QuestTags; TileSet; EventTree; DataTable. Editor/developer folders in the payload are not an SDK or supported mod API.

PROPOSALS: K33/K34: add offline validation only for a selected real content consumer, P16/P22. R2-P06 pins a visit recipe; do not copy source schemas wholesale.

## A08: Balance and numbers

Status: PARTIAL. Sources: B6, B2.

Independent archetype training is stated and data-backed. XP parameters appear in BP_Archetype, but no full formula or applied curve was traced. Unlock DataTables and trinket defaults show schema errors. Weighted generation, pity and exact scaling remain unread.

Implementation: BP_Archetype RequiredExperience family; StatModTableEntry failures; spawn-table path census. No failed-default numeric values promoted to facts.

PROPOSALS: K3/K10: distinguish earned knowledge and usable power via P03/P17. K34: require valid rows and a traced consumer before borrowing formulas.

## A09: Time and scheduling

Status: PARTIAL. Sources: B7, B9, B3.

Selected hazard bytecode reads GetTimeSeconds, elapsed differences, threshold checks and timers; bark conditions use state elapsed time. Quest scripts include Delay/timer calls. Offline time, civil calendar and broad away simulation are unread.

Implementation: BP_Nerud_DeathFog ExecuteUbergraph and End Overlap; StateElapsedCondition; campaign Delay calls. Do not convert render/engine time to calendar policy.

PROPOSALS: K22/K32: pause local timed consequences at the chosen owner boundary. P13 remains separately scoped; no browser-closed aging or new catch-up rule.

## A10: Onboarding and reveal

Status: PARTIAL. Sources: B6, P1, B8.

Developer states starting archetype does not foreclose later earned archetypes; data separates engrams, archetype definitions and unlock tables. Item/quest conditions show staged eligibility. Exact tutorial ordering is unread.

Implementation: World_City introductory quest indexed/exported partially; archetype selector UI names indexed. Runtime unlock conditions remain incomplete.

PROPOSALS: K3/K4/K11: distinguish initial means from future reachable options. Use existing P04 disclosure and P03 learning, no forced universal unlock gate.

## A11: Little touches

Status: PARTIAL. Sources: B5, B7, B9.

Local tile music, context-sensitive speech and hazard cleanup are concrete authored details. Feedback timing and sound quality were not heard or played. SMALL_TOUCHES has 24 original adaptation proposals with evidence labels.

Implementation: TileSet MapMusic, event decorators, speaking/cinematic exclusions, StopActionByType on exit.

PROPOSALS: K19/K23/K32: select one fitting small touch, P21. K2/K22: leaving a local condition should clean up its temporary effect.

## A12: Other systems

Status: PARTIAL. Sources: B2, B3, T1.

Payload also contains account award, crafting/item, economy, relic, prism/event and survival-mode families. Only selected reward calls and reader ownership were read. DLC4/SurvivalMode folders prove payload presence, not enabled modes, entitlements or live features.

Implementation: SpawnTableAccountAward, reward bytecode; Events/Paragon, SurvivalMode and world item roots are inventory leads. Economy/crafting formulas and meta-state lifecycle unread.

PROPOSALS: K8/K9/K18: separate account unlocks, carried goods and local receipts. P02/P18 are possible future consumers; no broad economy expansion selected.
