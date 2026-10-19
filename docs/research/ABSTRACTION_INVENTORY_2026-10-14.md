# Abstraction inventory, 2026-10-14

## CHECKPOINT

ER18 complete as a source inventory and consolidation proposal. AB1–AB15 each have a candidate, differences to preserve, effort/risk and READ anchors. The appendix inventories declaration/site candidates across the full source snapshot, including near duplicates and adapters. Resume with [ER18 report](../gm/dispatch/engine-runtime-2026-10-14/ER18/REPORT.md) and its source hashes before relying on line numbers. No runtime extraction, migration, build, browser journey, commit or accepted design change.

**ER18-F1:** Share mechanisms through the existing planner/publication boundary. Keep clocks, observer knowledge, native object owners and world laws explicit. An identical function name or a second Map does not make a second authoritative store.

Authority: [COMMON](../gm/dispatch/engine-runtime-2026-10-14/COMMON.md), [root AB1–AB15](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#s-abstractions-needed-ab), [E1–E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md), [clock audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md), PROJECT.md and USER_VISION.md. This extends the owners rather than restating their requirements. First milestone, canon-first order and desktop/laptop priority remain in force. No UI or mobile work is proposed as an audit acceptance gate. Comic-specific laws remain in the [comic considerations owner](../COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md).

Builds on [ER12 kernel design](OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md) and [ER2 structure/import graph](CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md). ER2's graph is a prior snapshot, not a new ER18 graph measurement. Its cycles reinforce injection at the composition root; moving functions into a helper that imports main.js would preserve the coupling. ER18 uses current source for the inventory. In particular, the current native combat path uses saved keyed streams at `src/models/combat.js:294` and `src/seeded_streams.js:100`; ER12's older Math.random combat anchors should not be treated as current.

READ means current declaration/body/site inspected at the supplied source anchor. MEASURED means the local census script ran. INFERRED means the recommendation, semantic grouping, absence conclusion or effort estimate. No STATED external claims are needed for this local audit. No SECRETS-prefixed file, private pack or personal save was read.

## Counts and scope

MEASURED structural snapshot: 474 files under `src/`, excluding SECRETS-prefixed names.

| Code | Palette | Sites | Files |
| --- | --- | ---: | ---: |
| ER18-C1 | AB1: Clock | 65 | 46 |
| ER18-C2 | AB2: Scheduler | 68 | 43 |
| ER18-C3 | AB3: Command | 259 | 151 |
| ER18-C4 | AB4: RNG stream | 86 | 27 |
| ER18-C5 | AB5: Store/entity/registry | 459 | 204 |
| ER18-C6 | AB6: Fact/knowledge | 203 | 127 |
| ER18-C7 | AB7: Transaction | 72 | 44 |
| ER18-C8 | AB8: Persistence | 286 | 136 |
| ER18-C9 | AB9: Manifest/registration | 150 | 113 |
| ER18-C10 | AB10: World instance | 26 | 13 |
| ER18-C11 | AB11: Carrier/transfer | 82 | 37 |
| ER18-C12 | AB12: World law/config | 35 | 27 |
| ER18-C13 | AB13: Selector/read model | 397 | 234 |
| ER18-C14 | AB14: Presenter | 264 | 65 |
| ER18-C15 | AB15: Formatter | 47 | 23 |

The census unit is a **source site**, not a distinct implementation or a proven duplicate: one named declaration, anonymous arithmetic/write/timer site or explicit data block. Sites can appear in several AB categories. Category file counts are distinct source paths, not independent services. Validation sets, row caches, content-effect builders and thin wrappers deliberately remain visible in the appendix but are not candidates for a global mutable store. A declaration and an arithmetic site within it can both count; ten xorshift sites below count arithmetic only.

The reproducible scanner includes named functions/classes, arrow declarations, concrete timers, raw random calls, xorshift arithmetic, writes, registries/data blocks, render signatures and inline numeric formatting, plus reviewed supplements for names/methods outside those patterns. Its full filters are saved, not implied by a vague search. This is a whole-tree structural census with a semantic owner review, not an AST or proof that an arbitrary unnamed callback cannot hide another equivalent implementation. Appendix counts are an broad review worklist for review, not an estimate of how many functions can be deleted. The owner groups below give the meaningful implementation counts.

Effort is INFERRED engineering time for a bounded extraction, including source tests and adapter verification, not a measured schedule or a commitment. S: roughly 0.5–2 days; M: 3–7 days; L: 2–4 weeks; XL: multiple slices beyond four weeks. Whole-game replacements are larger than a first extraction. Risk concerns outcome/save/identity changes, not coding difficulty.

## ER18-AB1: Clock and time advancers

**READ inventory:** Three primary time coordinates already exist: native absolute calendar (`src/game_time.js:8`, `src/world_rhythm.js:5`); joined elapsed played time (`src/expansion_engine.js:588`, `src/main.js:7189`); local occupied/observed time (`src/world_instances.js:310`, `src/realm_clock_leases.js:179`). Wall time is a fourth coordinate. The pure away ledger at `src/away_ledger.js:6` now computes capped wall conversion, fractional carry, barriers, overflow/bank and optional XP without advancing or publishing a live game. Wall-time packing remains a narrower adapter at `src/backlog_expansion_time.js:197`; it does not define general offline progression.

Six local instance adapters are READ: Pocket realm `src/realm_state.js:92`, Tidemark `src/feature_expansion_destination_host.js:46`, nested campaign `src/feature_expansion_nested_host.js:92`, Paradise `src/book_world_paradise_state.js:51`, Mol `src/book_world_mol_state.js:55`, Proto23 `src/proto23_world_state.js:123`. Five native projection copies convert elapsed minutes to the same 360-day calendar beginning at 06:00: `src/feature_expansion_destination_native.js:9`, `src/feature_expansion_nested_native.js:11`, `src/book_world_paradise_native.js:19`, `src/book_world_mol_native.js:19`, `src/proto23_world_native.js:19`. Their safe-integer admission checks differ even though the conversion math matches.

Other advance functions in the appendix consume one of those coordinates: chronicle/life aging, generated people/NPC years, packing, container contents, work plans, storylets, care/routines, E1 pacing, local life, mentor/instruction and native effect countdowns. They are systems, not independent clocks. The native update callback (`src/main.js:7287`) and action/combat timers remain separate execution drivers.

**INFERRED shared candidate:** `advanceSimulation` for a common coordinator, `planWorldClock` for local presence policy, and `Game_Time`/`calendarMinutes` for calendar math. First extract the five conversion copies using the guarded Mol/Paradise/Proto23 form, keeping wrappers and validation. Effort S for math; L for coordinator adapters. Risk low for unchanged math, high for consolidating drivers. Do not collapse absolute calendar, elapsed played time, wall milliseconds and local occupied time into one scalar or convert system advancers into subscribers without preserving phase order. Informs AB1, RT1, RT6, RT7, SB5, ECX6.

## ER18-AB2: Schedulers and due scans

**READ inventory:** Two central scheduling implementations are nested: expansion pending/opportunity scans and stable job order at `src/expansion_engine.js:588`, simulation jobs/checks/controllers/conditions/events/lifespans at `src/simulation.js:459` and `src/simulation.js:468`. Nineteen named boundary providers are grouped in the appendix: simulation, containers, chronicle, storylets, foundation interactions, pursuit, lore practice, completion runtime/lens, causal story, realm activity, Tidemark, nested campaign, Paradise, Mol, Proto23, work plan, reference gameplay and pocket observation. This list includes providers nested under others and facade/delegated boundaries; count actual named providers from the appendix rather than treating them as independent scheduler engines.

A third scheduler style now exists in `src/anchor_snapshots.js:74`: it sorts an authored timeline with canon/change/insertion tie order and can rebuild/reset a finite branch snapshot. It is a pure derived-history evaluator, not the common mutable job queue. Away ledger barriers are relative elapsed limits, not registered jobs. Simple packs use remaining-time settlement (`src/content_packs.js:118`); mixtures have one retained due job serviced by a UI interval (`src/mixture_ui.js:37`); recurring work uses last-claimed calendar windows (`src/world_rhythm.js:20`). Browser timer registrations in the appendix cover action attempts, recursive combat, autosave via update, panel polling, animation, feedback expiry, import timeout and URL cleanup. These are separate mechanisms despite similar timer calls.

**INFERRED shared candidate:** expansion's ordered coordinator plus simulation's next-boundary/settlement pair. Inject providers with phase/order/support predicates first. A due index could replace repeated scans after behavior-equivalence proof; none is currently a generic `schedule/cancel` service. Effort M for injected providers, L for due index and migrated durable jobs. Risk high: equal-minute order, frozen commitments, actor support, cancellation and stopping choices. Keep civil recurring windows, remaining-time pack jobs, causal event scheduling and presentation timers as different adapters. Informs AB2, RT6, PF1, CE6/CE7.

## ER18-AB3: Command and action dispatch

**READ inventory:** Core guarded planners are `commitAction` (`src/expansion_engine.js:536`) and `commitSimulationCommand` (`src/simulation.js:243`). Commands also enter through chronicle, optional pack `actPack`, structured selection/start, Ink choices, work ledger, mixtures, native trade/storage/craft, battle hosts and every feature/world host listed in the appendix. main.js's `act*`, `startExpedition`, `answerPractice`, `commandOptionalPack`, native `start_game_action`/`finish_game_action`/`get_game_action_result`, movement/activity/rewards and `performMixtureAction` are actual separate admission/publication paths, not aliases for one dispatcher.

There is already one six-lane optional router (`src/audit_remainder_host.js:17`, `src/audit_remainder_host.js:31`), plus broad main feature dispatch (`src/main.js:1397`), simulation dispatch (`src/main.js:1282`) and qualified book wrappers (`src/feature_expansion_book_host.js:164`). Some IDs identify a **definition**, not a unique request. Expected sequence/revision protects stale quotes; domain causes/receipts protect selected outcomes. No universal idempotent command-ID protocol was found.

**INFERRED shared candidate:** the six-lane router shape around existing guarded planners, with `persistExpansion` as the sole host publisher. Keep domain handlers. Separate definition ID, request ID and durable result receipt before claiming AB3 idempotency. Effort M for one router/admission facade; XL for all native paths and command receipts. Risk high: retrying a committed payment, context getting stale, or swallowing a domain-specific guard. Do not unify continuous native activity, timed job acceptance, voluntary preview, turn response and UI navigation into one executable action without explicit command types. Informs AB3, RT5, MC25, ECX9, OE1.

## ER18-AB4: RNG algorithms and streams

**READ inventory:** Ten xorshift32 arithmetic sites were found by whole-tree search: `src/expansion_engine.js:519`, `src/simulation.js:40`, `src/native_battle.js:47`, `src/party_battle.js:87`, `src/feature_expansion_battle.js:279`, `src/causal_story_host.js:222`, `src/storylet_deck.js:44`, `src/chronicle.js:224`, `src/generated_people.js:15`, `src/mixture_state.js:13`. Eight mutate saved cursors, but chronicle shares expansion rng and causal story uses simulation seed; the other two resolve generated truth from a local temporary seed or keyed seed. Zero fallback and integer conversion differ.

Two additional deterministic algorithms now exist: `src/start_records.js:3` hashes a seed into a Mulberry32-style start generator used for weighted layers without replacement; `src/anchor_snapshots.js:39` hashes seed/event ID into an integer or fractional event window. Neither uses the saved gameplay stream cursor. A further shared algorithm family already exists in `seeded_streams.js`: seed hash + mix32, named stream cells, ordinals/salts, keyed decisions, receipts and bounded log (`src/seeded_streams.js:47`, `src/seeded_streams.js:70`, `src/seeded_streams.js:75`). `unitDecision` is pure; `drawUnit` advances; `keyedUnit` records a receipt without an ordinal draw; `streamSeed` can initialize missing stream state through `ensureStreams`. Native combat/location/enemy/trader paths already consume this layer. `gameRandomRange` and `rollInt(...legacyRound)` preserve endpoint-biased rounding; `rollInt(...uniform)` differs. `rules.js` chooses from supplied rolls and `combat_math.js` accepts an injected random function, with Math.random as its default. Hashes for names/identity are not interchangeable with RNG streams. Raw random sites remain in main narration/feedback, display animations, particles and misc.

**INFERRED shared candidate:** `seeded_streams.js` for new named decisions; expansion `draw` arithmetic as the compatibility basis for a pure xorshift step used by existing saved owners. Effort S for pure arithmetic wrappers, M per native/system adapter, L for full replay. Risk high if cursors, seed strings, zero repair, draw order, weighted tables or integer distributions change. Do not merge saved cursors or reseed jobs. Do not draw while previewing. Keep cosmetic entropy outside gameplay streams. A pure copied-state `peek` can wrap `unitDecision`, but AB4's generic peek API does not exist yet. Informs AB4, RT9, MC11, ECX2; updates ER12-K3's source status.

## ER18-AB5: Stores, entities, registries and routers

**READ inventory:** The appendix includes scratch Sets/Maps separately from owners. Main owner families are expansion JSON domains (`src/expansion_engine.js:73`), simulation records (`src/simulation.js:49`), immutable content Maps (`createContentRegistry`, `createSimulationRegistry`), live native components and registries, optional/structured packs, local module singleton state and presentation registries/caches. Native inventories/equipment/availability/levels/talkables/bios are in `src/components/inventory_component.js:6`, `src/components/equipment_component.js:3`, `src/data/component_references.js:3`; NPC registration has side effects across these owners (`src/data/npcs.js:20`). Locations, skills, quests and their secondary indexes have separate identity/lifecycle rules. Panels use row caches and workspace/display-setting registries, not authoritative game entities.

E1 `runtimeState`, mixture `owner`, generated/NPC life UI owners, display settings and workspace layouts are further retained/runtime stores. `simulation_effects.person/inventory/writeInventory` resolves native versus simulation ownership (`src/simulation_effects.js:60`); flattening it into one object would erase that distinction. Routers from AB3 are behavior registries, not entity stores.

**INFERRED shared candidate:** expansion state and existing native read/stage/publish adapters (`src/native_gameplay_adapter.js:9`) as a frame facade; content Maps remain registries. There is no existing universal read-only entity store to promote unchanged. Effort M for a read facade, XL for converting all native classes. Risk high for private fields, identity/prototypes, duplicated stock and saved ownership. Do not unify transient caches, validation sets, content definitions and mutable actor stores. No ECS conversion is justified by this census alone. Informs AB5, OE2, LB1, CE5, CH2.

## ER18-AB6: Facts, knowledge and history

**READ inventory:** Two generic scalar fact-domain constructors exist (`src/expansion_engine.js:70`, `src/simulation.js:36`); they differ in sources/techniques. Expansion's fact overlay (`src/expansion_engine.js:401`) and simulation's much larger contextual overlay (`src/simulation_effects.js:85`) merge native/world/actor/scenario/domain adapters differently. World instances retain instance facts separately. Knowledge is observer-indexed at `simulation.knowledge`, written with stage/value/time/cause/basis (`src/simulation_effects.js:281`); higher-ranked knowledge replaces a current record. Domain `*Facts` functions in the appendix derive conditions, stock, access and eligibility; they are not separate fact databases.

Other retained knowledge/history owners include chronicle boolean knowledge/relationship memories, life_record, life_experience, cheat held/known/messages, mixture observations/methods, generated/NPC familiarity, event/observation receipts, routes and journals projected from those records. `worldIdentityView`, `knownPeopleView`, `projectSimulationAftermath`, `featureRecordedKnowledge` and `eventFeed` are disclosure adapters. The newer authored anchor evaluator (`src/anchor_snapshots.js:147`, `src/anchor_snapshots.js:160`) reconstructs facts and received knowledge at an authored time with writer provenance and branch substitutions; it is a useful historical read model. It does not capture arbitrary runtime player/NPC assertions. None of the inspected generic current-record stores offers a complete historical `as_of(at, observer)` API.

**INFERRED shared candidate:** simulation knowledge records and `validateKnowledgeBasis` (`src/causal_situations.js:52`) for observer-qualified evidence, with `projectSimulationAftermath` as a public read surface. Reuse the anchor evaluator for authored history and keep runtime assertion history as its own adapter. Effort M for one append-only assertion/history adapter; L for semantic migrations of all knowledge owners. Risk high: conflating truth, received reports, understanding, executable methods and mere completion flags; changing retention could invalidate decisions. Keep truth, knowledge and derived eligibility separate. A bounded presentation log cannot become historical authority. Informs AB6, CE1, AI6, E9.

## ER18-AB7: Transactions and publication

**READ inventory:** Two principal durable staging pipelines are expansion whole-envelope publication (`src/expansion_persistence.js:7`, `src/main.js:822`) and mixture whole-envelope publication (`src/mixture_native.js:38`). Native crafting is a third genuinely different implementation: it snapshots live object descriptors/bindings, mutates synchronous owners, then marks durable or rolls back (`src/native_craft_transaction.js:4`). Main also publishes local life, work ledger, trade/storage and durability through their own adapters. Direct save/settings/layout writes in the appendix are durable writes but do not by themselves offer a game transaction.

Shared staged pieces already exist for item conservation, gameplay/XP, native equipment/unlocks/vitals, domain enrollment, carriers and each native world adapter. `prepareGameplayPublication`, `prepareOwnershipPublication`, `prepareNativeEquipment`, `prepareNativeUnlocks` supply write/publish stages. They differ in where live mutation occurs and which owners are rebound. Expansion setItem returns committed bytes before caller publication; native craft must never roll back after `markDurable`.

**INFERRED shared candidate:** `persistExpansionPlan` as the durable boundary, with a stage/validate/write/publish facade; keep native craft's object-preserving rollback adapter. Effort M for shared sequencing on one existing command, XL for whole-game transaction coverage. Risk high: double publication, rollback after durable success, observer exceptions being misreported as retryable failure, private-field loss. Do not substitute JSON cloning for descriptor rollback or advertise generic rollback from a guarded storage writer. Informs AB7, E3, MC14, OE5.

## ER18-AB8: Persistence encode, validation and migration

**READ inventory:** Generic entry points are native `create_save`/`load`/file/localStorage paths in main, `validateSaveEnvelope`/encode/decode/import/size guard in save_files, legacy conversion in save_migration, content retirement in save_compatibility and expansion schema migration/load/validation. Simple pack save preparation and structured pack content identity validation are separate readers. Seven native world envelope adapters are present: Tidemark, nested, Paradise, Mol, Proto23, causal story and world completion. Factorio retort and other module validators add smaller domains.

The appendix lists schema/state/envelope validation and migration owners for all source families, including pacing/local life/fort/durability; career/life records/generated people; cheats/customization/work ledger; stories/Ink; simulation/body/conditions; reference/repository/audit remainder; care/workshop/kit/mixture; management; world/carrier/clock/observation and structured equipment/container/renewal. Most validators are nested invariants rather than standalone codecs. Four native adapters duplicate item-count `encode`/`savedCounts` logic; the Tidemark variant differs in shape. Native serialization preserves model semantics, not raw arbitrary objects.

**INFERRED shared candidate:** save_files envelope dispatch plus existing domain validators/migrators; expansion_persistence preserves the common commit. Start a codec registry around existing functions, not a new wire format. Effort M for one domain registry/wrapper; L for whole-envelope routing; XL for physical chunks or async durability. Risk high: rejecting old saves, losing unknown/retired content, rebinding wrong native owners or changing content identity. Keep save schema, content revision, engine API version and opaque Ink cursor version separate. Logical domain codecs do not authorize partial storage commits. Informs AB8, DA2/DA4, MC21, OE5.

## ER18-AB9: Manifests and registration lists

**READ inventory:** No unified engine module manifest with all AB9 fields was found. Two generic registry constructors admit authored content; structured pack compilation/merge and optional-pack loader offer external-content admission; Ink runtime pins specific retained story identities. Eager aggregation roots are `src/expedition_content.js:39` and `src/simulation_content.js:58`. The appendix contains every detected Definitions/Content block and explicit register/compile/merge entry point. Native world registration uses injected constructors; absorption register functions install items/recipes/locations, sometimes as top-level side effects. `panel_kit` and workspace registration own UI lifecycle. AB3's lane lists own routing only.

**INFERRED shared candidate:** `createContentRegistry` and `createSimulationRegistry` for admission, `compileStructuredPack` for content validation, `definePanel` for panel binding. Build a serializable descriptor and composition-root handler table around them as ER12-M1/M2 propose. Effort M for one manifest facade, L for eager-list migration. Risk medium/high: duplicate IDs, module absence, import order and saved version dependencies. Keep declared content, installed native owners, command handlers and panel mounts distinct phases. A registry schema integer is not engine semver. Informs AB9, OE3, RT10, CE3, CH2.

## ER18-AB10: World instances

**READ inventory:** One generic retained instance/binding/visit implementation is in world_instances. Six domain adapters use it: realmPrototype, featureDestination, nestedCampaign, bookWorldCampaign, motherOfLearning and proto23Village (all in the appendix). Tidemark retains one `.instance`; several others use arrays; Pocket realm indexes instances by ID. `world_visit_history` compacts unreferenced ended visits across selected adapters. Structured packs use a separate run/instance/start/revision selection and lifetime provenance; simple packs use active rows/job countdowns. The newer anchor snapshots retain world ID/revision/branch/source and derived local offset, while layered start recipes retain world/layer/seed provenance (`src/anchor_snapshots.js:147`, `src/start_records.js:51`); neither is a registered mutable world instance. Expansion `.worlds` is a world fact domain, not an instance identity. Realm connections are endpoint bindings, not independent world saves.

**INFERRED shared candidate:** `createWorldInstance`, `validateWorldInstance`, `createWorldVisit` and bindings from world_instances, preserving adapter container paths. Effort S for a common lookup facade; M for consolidating six wrappers; XL for selectable autonomous branches. Risk high if instance IDs, continuity/era/parent bindings or visit identity change. Current instances do not implement AB10 tier/overrides/template as the proposed generic shape. Do not equate source world, mutable instance, represented region, structured run and active branch. Informs AB10, CE2, RT7, F9, OE2.

## ER18-AB11: Carriers and transfer paths

**READ inventory:** Six distinct transfer mechanisms are visible: count-based acquisition/conservation (`src/acquisition.js:39`); gameplay/simulation item transfer and custody (`src/simulation_effects.js:265`); native chest/trade staging; physical realm passage/cargo; traveler/body projection; carrier transit/clock conservation. A seventh lifecycle family is heir inheritance (`src/heir_inheritance.js:81`, `src/life_experience_host.js:11`); it selects retained leftovers rather than transporting an unchanged actor.

Typed carrier orchestration already exists at `src/backlog_expansion_transit.js:384` and `src/backlog_expansion_transit.js:412`. Two near-duplicate world adapters, nested and Paradise, assemble owner/world/clock/policy snapshots, preview passage, stage movement/time and retain bounded receipts. Physical cargo validates custody/consent and native bindings; realm connections validate permission and passage; traveler profiles validate body/source/method support. Information-only observation channels also transfer observations, but never cargo or bodily permission. Content `transfer` builders merely emit effects and should not become another ownership service.

**INFERRED shared candidate:** `stageAcquisition` for counted item movement and `stageCarrierTransit` for cross-owner/world movement. Extract a snapshot-assembly helper from the two world carrier adapters without unifying their mission/owner policies. Effort M for that helper, L for adding an existing world path, XL for universal carriers. Risk high for identity, custody, debt/duty/source retention and native stock conservation. Keep information flow, sale, loan, physical passage, projection and inheritance semantically distinct. Informs AB11, E8, CE3, ECX16.

## ER18-AB12: Per-world laws and config blocks

**READ inventory:** Configuration is distributed among config.js/global tick speed, layered-start merge rules/frontier axes, local-life balance.json, E1 options/weather states, world definition/footprint baselines, realm boundary/connection/traveler/carrier policies, storylet deck cadence, domain policies (agreed duty, kit reserve, care, completion lens, foundation interactions, book effects/campaigns) and work-ledger rules. The appendix separates their named policy blocks from evaluator functions. More world-specific decisions live directly inside content commands, host guards and validators, rather than in one extensible dial block. Generic world definitions currently allow an exact field list (`src/world_instances.js:54`); inserting `laws` arbitrarily would fail it.

**INFERRED shared candidate:** realm_boundary_rules' validated data plus evaluator pattern for permission laws, world definition identity/revision for binding, and existing typed per-domain policy records. No existing universal world-law object should become the sole shared one unchanged. Effort M for one versioned law adapter, L for migrating several world modules. Risk high if defaults change or a domain rule becomes a universal penalty. Preserve world-specific body/identity/fuel/absence/failure/cheat semantics; global runtime config and per-browser appearance are not world laws. This audit does not enable hunger, offline movement or fixed cheat limits. Informs AB12, CE6, ECX19–ECX23; comic CA rows remain authoring input.

## ER18-AB13: Selectors, read models and render signatures

**READ inventory:** Reusable projection candidates already include `projectFeatureCommands`, `featureRecordedKnowledge`, work/encounter controls, `projectSimulationAftermath`, `projectAcceptedWorkLegibility`, world identity/people, capability queries and action disclosure. Domain *Presentation/*View/preview/facts/snapshot functions appear throughout the appendix. Their contracts differ: private legality evaluation, quote, public disclosure, world/native owner snapshot and aggregate panel view. A preview is not automatically a safe public selector.

UI signatures use whole JSON views (packs/chronicle/people/life), section-level detail/record arrays (promise/exchange/observation/skill), session ID/turn (pursuit), sequence/inventory (mixture), content labels plus registry size (optional packs) or imperative native DOM refresh. These are output equality gates, not dependency-qualified memoized selectors. The anchor evaluator also has source-qualified incremental reuse and rebuild-on-backward/reset logic (`src/anchor_snapshots.js:163`); this is more specific than a UI signature and should remain a separate authored-history cache. Local signature counts are source sites, not independent cache libraries.

**INFERRED shared candidate:** `projectFeatureCommands` for command cards; `projectSimulationAftermath` for knowledge records; existing domain presenters compose them. A shared dependency/version invalidation helper needs a new facade, since none was found. Effort M for one projection family and invalidation path, L for broad UI migration. Risk medium/high: stale price/access, hidden truth leakage, missing native inventory/calendar/registry changes. Do not memoize solely on expansion sequence or unify private facts with public views. Informs AB13, RT4, PF5, E9.

## ER18-AB14: Presenters and renderers

**READ inventory:** Three presentation styles coexist: domain read-model functions, injected panel factories (`createFeatureExpansionPanel`, E1 panel, other *_ui families) and imperative native display.js/ui/combat_display. All detected panel/mount/render/refresh/DOM-helper sites are in the appendix. Workspace views/layout and panel_kit wrap discovery/docking/settings; they do not render the game read model themselves. Native particles and settled effects are additional canvas/DOM presentation mechanisms. The layered-start probe (`src/start_probe_ui.js:3`) is another local presenter with withheld unknown axes, not a production general panel contract.

**INFERRED shared candidate:** `createFeatureExpansionPanel({read, command, present})` for a model-consuming interactive panel and `definePanel` for its workspace/discovery shell. Keep existing native display adapters. Effort M for one panel kit widget plus mount/dispose contract, L for broad display.js adaptation. Risk medium: focus loss, duplicate listeners/timers, unread/history behavior, hidden labels and post-commit error handling. Keep canvas particles, combat display, narrative text and independent desktop panels distinct renderers over appropriately filtered views. No canvas/comic renderer is implemented by a shared mount contract. Informs AB14, OE6, CE8, EG1, PF5.

## ER18-AB15: Number, time, plural and name formatting

**READ inventory:** Seven general families exist: `expo` numeric notation; `format_time` compound duration; reading-time summary; working-time duration; Game_Time date/season string; coin HTML formatter; coin feedback plain-text formatter. Additional named helpers format skill/book rewards, costs/item names, decimal minutes, household/NPC titles and local E1 duration text. Inline `toFixed` and `toLocaleString` sites remain in the appendix. Translation/name grammar generate or select language/names; they are not interchangeable number formatters. Content `coin/coins` helpers emit resource effects and were excluded from formatter counts.

`src/misc.js:83` imports main.js options ({src/misc.js|import { game_options }); it also uses absolute magnitude in its exponential branch. `src/game_time.js:137` mutates its supplied time object, rounds minutes upward and uses >30/>12 rather than the calendar's one-based boundary normalization. `format_reading_time` deliberately drops sub-hour remainder at larger values; `format_working_time` retains it. `src/display.js:4217` emits HTML, signs and “nothing”; `src/settled_text_effects.js:149` emits plain text and no equivalent zero/sign contract.

**INFERRED shared candidate:** lift existing misc/game_time functions behind a pure formatting facade with explicit modes/options, and share coin decomposition from `format_money` with a DOM-independent token output. No single current helper correctly replaces all others. Effort S for wrappers/coin decomposition, M for callsite conversion and exact boundary/negative/zero behavior decisions. Risk low/medium, with the prospect of changing displayed costs or temporal expectations. Keep price rounding as gameplay math, calendars as dates, durations as durations, names as identity/disclosure and text/HTML output modes separate. Informs AB15, MC29–MC31, CH2.

## Ranked extraction proposals

| Rank/code | First bounded move | Why it comes first / cost | Palette |
| --- | --- | --- | --- |
| 1 / ER18-P1 | Share the five local calendar projections behind current wrappers, then pure coin decomposition. | Very clear repeated math; S and low risk with exact output/invalid-input checks. | AB1/AB15, MC29–MC31 |
| 2 / ER18-P2 | Share a pure xorshift32 step while retaining each existing saved cursor and draw contract. | Ten arithmetic copies, with no need to change gameplay RNG ownership; S, high consequence if arithmetic/order changes. | AB4, RT9, MC11 |
| 3 / ER18-P3 | Extract one typed provider table around the existing ordered coordinator and six-lane router. | Removes hard imports while retaining handlers; M. Use ER2 cycles and ER12-K1/K2/K7, not an all-engine rewrite. | AB2/AB3/AB9, RT6, RT10, CH2 |
| 4 / ER18-P4 | Wrap one existing durable command in a common stage/validate/write/publish facade and logical codec descriptor. | Supplies the ownership seam needed by further consolidation; M per first command, native rollback remains an adapter. | AB7/AB8, E3, DA2/DA4 |
| 5 / ER18-P5 | Move one panel to injected public read models and dependency-qualified invalidation. | Tests the store/selector/presenter boundary with a visible result; M. Desktop 1366×768, mobile deferred for that later implementation. | AB5/AB6/AB13/AB14, PF5, OE6 |

These are proposals, not selected implementation. AB10–AB12 already have reusable foundations; use them as dependencies of a chosen slice instead of inventing a universal branch/carrier/law rewrite first.

## Abstractions that must keep different semantics

| Code | Keep separate | Consequence of flattening |
| --- | --- | --- |
| ER18-N1 | Native calendar, joined elapsed time, local occupied/lease time, wall packing and browser timer cadence. | Double time, backpay or advancing absent worlds. |
| ER18-N2 | Saved RNG cursors, keyed decisions, generator truth and cosmetic randomness. | Old pending outcomes change or previews spend draws. |
| ER18-N3 | Authoritative world truth, observer evidence, derived legality, public disclosure and presentation history. | Omniscience, lost historical belief or rewards inferred from display logs. |
| ER18-N4 | Content registries, live model owners, JSON state, temporary validation sets and UI row caches. | Broken object identity and competing writable stores. |
| ER18-N5 | Stage-first commits, live-object rollback and errors after durable publication. | Paid actions roll back in memory after a saved success, inviting retries. |
| ER18-N6 | Inventory sale/transfer, custody loan, bodily passage, information flow, projection and inheritance. | Cargo creates permission or a copied source/body becomes freely executable. |
| ER18-N7 | World template/definition, mutable instance, represented region, structured run and selectable branch. | A world label is mistaken for isolated state or an independent clock. |
| ER18-N8 | Per-world laws, runtime tuning, browser presentation settings and domain-specific service policies. | Local world rules become global restrictions. |
| ER18-N9 | Duration rounding, civil calendar arithmetic, numeric notation, price rounding, disclosed names and HTML/text rendering. | A cosmetic consolidation changes cost, meaning or output safety. |

## Verification and limits

MEASURED: the source census was run with `python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER18/census.py`; category/site/file counts are above. Source hashes, exact filters and reviewed supplements are retained in the lane. Document generation checks all explicit anchors exist. A final check validates every census pointer and compares live source hashes with the captured snapshot. See REPORT for results and command detail.

READ: current source mechanisms, ER2's saved graph/report, ER12, accepted direction and dispatch owners. INFERRED: duplicate families, recommended boundaries, effort, risk and negative API findings. No runtime benchmarks, tests, rebuild or browser play were run. No implementation or gameplay acceptance is claimed. A later extraction must prove unchanged causal/draw order, stale-command handling, failed-write behavior and save/reload/import before declaring it playable; UI claims also need rebuilt desktop evidence.

## Complete source-site worklist

The following grouped inventory names every site captured by the stated census and reviewed supplements. READ pointers give declarations/structural sites only, not independent behavioral proof. A raw registry/cache site can be a local validation set. A validator can belong to content admission, not a save codec. A preview can be a private planner, not a public read model. Thin wrappers and cross-category overlap are intentional. Use the semantic sections above to choose what can be shared.

### ER18-I1: AB1 Clock

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_c2/local_life.js` | `advanceLocalLife` (`src/absorb_c2/local_life.js:42`, declaration) |
| `src/absorb_e1/pacing.js` | `advancePacing` (`src/absorb_e1/pacing.js:30`, declaration); `advancePacingRuntime` (`src/absorb_e1/pacing.js:86`, declaration) |
| `src/anchor_snapshots.js` | `eventTime` (`src/anchor_snapshots.js:39`, reviewed supplement); `advance` (`src/anchor_snapshots.js:74`, declaration); `deriveIncremental` (`src/anchor_snapshots.js:163`, reviewed supplement) |
| `src/audit_remainder_combat_objectives_state.js` | `advanceRemainderCombatObjectives` (`src/audit_remainder_combat_objectives_state.js:94`, declaration) |
| `src/audit_remainder_offers_state.js` | `advanceRemainderOffers` (`src/audit_remainder_offers_state.js:160`, declaration) |
| `src/audit_remainder_runtime.js` | `advanceAuditRemainder` (`src/audit_remainder_runtime.js:21`, declaration) |
| `src/away_ledger.js` | `computeAway` (`src/away_ledger.js:6`, reviewed supplement) |
| `src/backlog_expansion_time.js` | `settleTimeAdvance` (`src/backlog_expansion_time.js:282`, declaration) |
| `src/backlog_expansion_transit.js` | `stageCarrierClock` (`src/backlog_expansion_transit.js:412`, reviewed supplement) |
| `src/book_world_mol_native.js` | `molCalendarAt` (`src/book_world_mol_native.js:19`, reviewed supplement) |
| `src/book_world_mol_state.js` | `syncMolClock` (`src/book_world_mol_state.js:55`, declaration) |
| `src/book_world_paradise_carriers.js` | `stageParadiseCarrierClock` (`src/book_world_paradise_carriers.js:58`, reviewed supplement) |
| `src/book_world_paradise_native.js` | `paradiseCalendarAt` (`src/book_world_paradise_native.js:19`, reviewed supplement) |
| `src/book_world_paradise_state.js` | `syncParadiseClock` (`src/book_world_paradise_state.js:51`, declaration) |
| `src/causal_story_host.js` | `advanceCausalStoryBoundary` (`src/causal_story_host.js:451`, declaration) |
| `src/chronicle.js` | `advanceChronicle` (`src/chronicle.js:109`, declaration) |
| `src/content_packs.js` | `advancePack` (`src/content_packs.js:115`, declaration); `advancePackSettlement` (`src/content_packs.js:118`, declaration) |
| `src/expansion_engine.js` | `advanceSimulation` (`src/expansion_engine.js:588`, declaration) |
| `src/feature_expansion_destination_host.js` | `syncTidemarkClock` (`src/feature_expansion_destination_host.js:46`, declaration) |
| `src/feature_expansion_destination_native.js` | `calendarAt` (`src/feature_expansion_destination_native.js:9`, reviewed supplement) |
| `src/feature_expansion_nested_carriers.js` | `stageNestedCarrierClock` (`src/feature_expansion_nested_carriers.js:59`, reviewed supplement) |
| `src/feature_expansion_nested_chains.js` | `advance` (`src/feature_expansion_nested_chains.js:24`, declaration) |
| `src/feature_expansion_nested_host.js` | `syncNestedCampaignClock` (`src/feature_expansion_nested_host.js:92`, declaration) |
| `src/feature_expansion_nested_native.js` | `nestedCalendarAt` (`src/feature_expansion_nested_native.js:11`, reviewed supplement) |
| `src/feature_expansion_work_plan.js` | `advanceOne` (`src/feature_expansion_work_plan.js:179`, declaration); `advanceWorkPlansBoundary` (`src/feature_expansion_work_plan.js:264`, declaration) |
| `src/foundation_interaction_policy.js` | `advanceFoundationInteractions` (`src/foundation_interaction_policy.js:185`, declaration) |
| `src/game_time.js` | `Game_Time` (`src/game_time.js:8`, declaration); `Game_Time.goUp` (`src/game_time.js:18`, Game_Time.goUp); `Game_Time.loadTime` (`src/game_time.js:48`, Game_Time.loadTime) |
| `src/generated_people.js` | `advanceGeneratedPeople` (`src/generated_people.js:45`, declaration) |
| `src/life_record.js` | `lifeCalendarMinute` (`src/life_record.js:60`, declaration) |
| `src/main.js` | `cheatCalendarTime` (`src/main.js:312`, reviewed supplement); `advanceSavedLocalLife` (`src/main.js:729`, declaration); `advanceExpeditions` (`src/main.js:1205`, declaration); `calendarSnapshot` (`src/main.js:1230`, declaration); `advanceChroniclePlan` (`src/main.js:1250`, declaration); `advanceFrontierJourney` (`src/main.js:1528`, declaration); `game_action_period` (`src/main.js:2560`, declaration); `update_timer` (`src/main.js:7189`, reviewed supplement); `progress_time` (`src/main.js:7254`, reviewed supplement); `update_effect_durations` (`src/main.js:7264`, reviewed supplement); `update()` (`src/main.js:7287`, reviewed supplement) |
| `src/npc_lives.js` | `advanceVillageLives` (`src/npc_lives.js:33`, declaration) |
| `src/proto23_world_native.js` | `proto23CalendarAt` (`src/proto23_world_native.js:19`, reviewed supplement) |
| `src/proto23_world_state.js` | `syncProto23Clock` (`src/proto23_world_state.js:123`, declaration) |
| `src/pursuit.js` | `advancePursuits` (`src/pursuit.js:138`, declaration) |
| `src/realm_clock_leases.js` | `planRealmActivityClock` (`src/realm_clock_leases.js:179`, reviewed supplement) |
| `src/realm_state.js` | `syncRealmClock` (`src/realm_state.js:92`, declaration) |
| `src/reference_gameplay_feats.js` | `advanceReferenceFeats` (`src/reference_gameplay_feats.js:211`, declaration) |
| `src/reference_gameplay_state.js` | `advanceReferenceGameplay` (`src/reference_gameplay_state.js:110`, declaration) |
| `src/simulation.js` | `advancePowerProgression` (`src/simulation.js:346`, declaration); `advanceSimulationBoundary` (`src/simulation.js:468`, declaration) |
| `src/simulation_effects.js` | `advanceNativeContainerClocks` (`src/simulation_effects.js:394`, declaration) |
| `src/storylet_deck.js` | `advanceStoryletDecks` (`src/storylet_deck.js:48`, declaration) |
| `src/structured_container_runtime.js` | `advanceContainerClocks` (`src/structured_container_runtime.js:135`, declaration) |
| `src/village_career.js` | `advanceVillageMentor` (`src/village_career.js:161`, declaration); `advanceTessaInstruction` (`src/village_career.js:189`, declaration) |
| `src/world_completion_lens_runtime.js` | `advanceWorldCompletionLensBoundary` (`src/world_completion_lens_runtime.js:106`, declaration) |
| `src/world_instances.js` | `planWorldClock` (`src/world_instances.js:310`, reviewed supplement) |
| `src/world_rhythm.js` | `calendarMinutes` (`src/world_rhythm.js:5`, declaration) |

### ER18-I2: AB2 Scheduler

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/anchor_snapshots.js` | `eventTime` (`src/anchor_snapshots.js:39`, reviewed supplement); `advance` (`src/anchor_snapshots.js:74`, reviewed supplement) |
| `src/audit_remainder_consequences_content.js` | `schedule` (`src/audit_remainder_consequences_content.js:35`, declaration) |
| `src/away_ledger.js` | `computeAway` (`src/away_ledger.js:6`, reviewed supplement) |
| `src/backlog_expansion_time.js` | `settleTimeAdvance` (`src/backlog_expansion_time.js:282`, declaration) |
| `src/book_world_mol_state.js` | `nextMolBoundary` (`src/book_world_mol_state.js:57`, declaration) |
| `src/book_world_paradise_state.js` | `nextParadiseBoundary` (`src/book_world_paradise_state.js:54`, declaration) |
| `src/causal_story_host.js` | `nextCausalStoryBoundary` (`src/causal_story_host.js:448`, declaration); `advanceCausalStoryBoundary` (`src/causal_story_host.js:451`, declaration) |
| `src/chronicle.js` | `lifespanDeadline` (`src/chronicle.js:102`, declaration); `nextChronicleBoundary` (`src/chronicle.js:103`, declaration) |
| `src/content_pack_ui.js` | `setInterval` (`src/content_pack_ui.js:49`, browser timer registration) |
| `src/content_packs.js` | `advancePackSettlement` (`src/content_packs.js:118`, declaration) |
| `src/display.js` | `setInterval` (`src/display.js:377`, browser timer registration); `setInterval` (`src/display.js:384`, browser timer registration); `setTimeout` (`src/display.js:392`, browser timer registration); `setInterval` (`src/display.js:1166`, browser timer registration); `setTimeout` (`src/display.js:5930`, browser timer registration); `requestAnimationFrame` (`src/display.js:5931`, browser timer registration) |
| `src/feature_expansion_destination_host.js` | `nextTidemarkBoundary` (`src/feature_expansion_destination_host.js:48`, declaration) |
| `src/feature_expansion_nested_host.js` | `nextNestedCampaignBoundary` (`src/feature_expansion_nested_host.js:102`, declaration) |
| `src/feature_expansion_work_plan.js` | `workPlanNextBoundary` (`src/feature_expansion_work_plan.js:138`, declaration); `advanceWorkPlansBoundary` (`src/feature_expansion_work_plan.js:264`, declaration) |
| `src/foundation_interaction_policy.js` | `nextFoundationInteractionBoundary` (`src/foundation_interaction_policy.js:198`, declaration) |
| `src/generated_people_ui.js` | `setInterval` (`src/generated_people_ui.js:51`, browser timer registration) |
| `src/import_probe.js` | `setTimeout` (`src/import_probe.js:30`, browser timer registration) |
| `src/life_record_ui.js` | `setInterval` (`src/life_record_ui.js:16`, browser timer registration) |
| `src/lore_practice_runtime.js` | `nextLorePracticeBoundary` (`src/lore_practice_runtime.js:61`, declaration) |
| `src/main.js` | `setInterval` (`src/main.js:2552`, browser timer registration); `setInterval` (`src/main.js:2576`, browser timer registration); `setTimeout` (`src/main.js:7288`, browser timer registration); `setTimeout` (`src/main.js:8378`, browser timer registration); `setInterval` (`src/main.js:8428`, browser timer registration); `setTimeout` (`src/main.js:8545`, browser timer registration); `setInterval` (`src/main.js:8546`, browser timer registration) |
| `src/mixture_ui.js` | `setInterval` (`src/mixture_ui.js:37`, browser timer registration) |
| `src/models/combat.js` | `setTimeout` (`src/models/combat.js:229`, browser timer registration) |
| `src/native_discovery_feedback.js` | `setTimeout` (`src/native_discovery_feedback.js:51`, browser timer registration) |
| `src/npc_lives_ui.js` | `setInterval` (`src/npc_lives_ui.js:18`, browser timer registration) |
| `src/pocket_observation.js` | `nextPocketObservationBoundary` (`src/pocket_observation.js:91`, declaration); `expirePocketObservation` (`src/pocket_observation.js:120`, declaration) |
| `src/proto23_world_state.js` | `nextProto23Boundary` (`src/proto23_world_state.js:126`, declaration) |
| `src/pursuit.js` | `nextPursuitBoundary` (`src/pursuit.js:93`, declaration); `scheduleSearch` (`src/pursuit.js:103`, declaration); `advancePursuits` (`src/pursuit.js:138`, declaration) |
| `src/realm_state.js` | `nextRealmActivityBoundary` (`src/realm_state.js:126`, declaration); `expireRealmObservation` (`src/realm_state.js:133`, declaration) |
| `src/reference_gameplay_host.js` | `referenceGameplayNextBoundary` (`src/reference_gameplay_host.js:80`, declaration) |
| `src/settled_text_effects.js` | `setTimeout` (`src/settled_text_effects.js:182`, browser timer registration) |
| `src/simulation.js` | `completeJob` (`src/simulation.js:252`, declaration); `nextSimulationBoundary` (`src/simulation.js:459`, declaration); `advanceSimulationBoundary` (`src/simulation.js:468`, declaration) |
| `src/status_window.js` | `setInterval` (`src/status_window.js:41`, browser timer registration) |
| `src/storylet_deck.js` | `nextStoryletBoundary` (`src/storylet_deck.js:19`, declaration); `advanceStoryletDecks` (`src/storylet_deck.js:48`, declaration) |
| `src/structured_container_runtime.js` | `nextContainerBoundary` (`src/structured_container_runtime.js:171`, declaration) |
| `src/structured_pack_ui.js` | `setInterval` (`src/structured_pack_ui.js:103`, browser timer registration) |
| `src/titles_ui.js` | `setInterval` (`src/titles_ui.js:31`, browser timer registration) |
| `src/village_career_ui.js` | `setInterval` (`src/village_career_ui.js:63`, browser timer registration) |
| `src/work_ledger_author_ui.js` | `setTimeout` (`src/work_ledger_author_ui.js:15`, browser timer registration) |
| `src/workspace_layout.js` | `setTimeout` (`src/workspace_layout.js:122`, browser timer registration) |
| `src/workspace_views.js` | `requestAnimationFrame` (`src/workspace_views.js:32`, browser timer registration); `setInterval` (`src/workspace_views.js:62`, browser timer registration); `setInterval` (`src/workspace_views.js:84`, browser timer registration) |
| `src/world_completion_lens_runtime.js` | `nextWorldCompletionLensBoundary` (`src/world_completion_lens_runtime.js:102`, declaration); `advanceWorldCompletionLensBoundary` (`src/world_completion_lens_runtime.js:106`, declaration) |
| `src/world_completion_runtime.js` | `nextWorldCompletionBoundary` (`src/world_completion_runtime.js:47`, declaration) |
| `src/world_rhythm.js` | `recurringWindow` (`src/world_rhythm.js:20`, declaration) |

### ER18-I3: AB3 Command

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/action_legibility.js` | `cancellation` (`src/action_legibility.js:19`, declaration) |
| `src/agreed_duty_content.js` | `command` (`src/agreed_duty_content.js:80`, declaration) |
| `src/agreed_duty_host.js` | `commandIds` (`src/agreed_duty_host.js:15`, declaration); `commandIds` (`src/agreed_duty_host.js:24`, declaration); `commitAgreedDutyAction` (`src/agreed_duty_host.js:84`, declaration) |
| `src/artifact_workshop_content.js` | `command` (`src/artifact_workshop_content.js:24`, declaration) |
| `src/artifact_workshop_host.js` | `commitArtifactWorkshopCommand` (`src/artifact_workshop_host.js:9`, declaration) |
| `src/audit_remainder_combat_fit_content.js` | `command` (`src/audit_remainder_combat_fit_content.js:43`, declaration) |
| `src/audit_remainder_combat_fit_host.js` | `commitRemainderCombatFitCommand` (`src/audit_remainder_combat_fit_host.js:16`, declaration) |
| `src/audit_remainder_combat_objectives_content.js` | `command` (`src/audit_remainder_combat_objectives_content.js:78`, declaration) |
| `src/audit_remainder_combat_objectives_host.js` | `commitRemainderCombatObjectivesCommand` (`src/audit_remainder_combat_objectives_host.js:12`, declaration) |
| `src/audit_remainder_consequences_content.js` | `command` (`src/audit_remainder_consequences_content.js:55`, declaration) |
| `src/audit_remainder_consequences_facts.js` | `commandCount` (`src/audit_remainder_consequences_facts.js:178`, declaration) |
| `src/audit_remainder_consequences_host.js` | `commitRemainderConsequencesCommand` (`src/audit_remainder_consequences_host.js:54`, declaration) |
| `src/audit_remainder_home_content.js` | `command` (`src/audit_remainder_home_content.js:48`, declaration) |
| `src/audit_remainder_home_host.js` | `commitRemainderHomeCommand` (`src/audit_remainder_home_host.js:14`, declaration) |
| `src/audit_remainder_host.js` | `commitAuditRemainderCommand` (`src/audit_remainder_host.js:31`, declaration) |
| `src/audit_remainder_livelihood_content.js` | `command` (`src/audit_remainder_livelihood_content.js:36`, declaration) |
| `src/audit_remainder_livelihood_host.js` | `commitRemainderLivelihoodCommand` (`src/audit_remainder_livelihood_host.js:12`, declaration) |
| `src/audit_remainder_offers_content.js` | `command` (`src/audit_remainder_offers_content.js:18`, declaration) |
| `src/audit_remainder_offers_host.js` | `commitRemainderOffersCommand` (`src/audit_remainder_offers_host.js:11`, declaration) |
| `src/audited_workshop_fixture.js` | `command` (`src/audited_workshop_fixture.js:40`, declaration) |
| `src/audited_workshop_host.js` | `commitAuditedWorkshopCommand` (`src/audited_workshop_host.js:16`, declaration) |
| `src/audited_workshop_lesson.js` | `command` (`src/audited_workshop_lesson.js:33`, declaration) |
| `src/backlog_expansion_host.js` | `commitBacklogAction` (`src/backlog_expansion_host.js:80`, declaration) |
| `src/body_progression.js` | `command` (`src/body_progression.js:12`, declaration); `beginBodyRecord` (`src/body_progression.js:71`, declaration) |
| `src/book_care_host.js` | `commitBookCareCommand` (`src/book_care_host.js:13`, declaration); `cancels` (`src/book_care_host.js:45`, declaration) |
| `src/book_care_runtime.js` | `enrolled` (`src/book_care_runtime.js:6`, declaration) |
| `src/book_world_mol_host.js` | `commitMolCommand` (`src/book_world_mol_host.js:55`, declaration); `enrolled` (`src/book_world_mol_host.js:60`, declaration) |
| `src/book_world_mol_native.js` | `command` (`src/book_world_mol_native.js:134`, declaration) |
| `src/book_world_paradise_campaign_content.js` | `command` (`src/book_world_paradise_campaign_content.js:39`, declaration) |
| `src/book_world_paradise_campaign_host.js` | `commitParadiseCampaignDepthCommand` (`src/book_world_paradise_campaign_host.js:11`, declaration) |
| `src/book_world_paradise_host.js` | `commitParadiseCommand` (`src/book_world_paradise_host.js:63`, declaration); `enrolled` (`src/book_world_paradise_host.js:66`, declaration) |
| `src/book_world_paradise_native.js` | `command` (`src/book_world_paradise_native.js:134`, declaration) |
| `src/causal_story_content.js` | `command` (`src/causal_story_content.js:27`, declaration); `commands` (`src/causal_story_content.js:68`, declaration) |
| `src/causal_story_core.js` | `beginCausalStoryProof` (`src/causal_story_core.js:301`, declaration) |
| `src/causal_story_host.js` | `cancelReasons` (`src/causal_story_host.js:127`, declaration); `begin` (`src/causal_story_host.js:213`, declaration); `commitCausalStoryCommand` (`src/causal_story_host.js:293`, declaration) |
| `src/causal_story_ui.js` | `cancellationText` (`src/causal_story_ui.js:10`, declaration); `commandPresent` (`src/causal_story_ui.js:30`, declaration) |
| `src/chronicle.js` | `commandChronicle` (`src/chronicle.js:155`, declaration) |
| `src/content_packs.js` | `actPack` (`src/content_packs.js:109`, declaration); `cancelPack` (`src/content_packs.js:128`, declaration) |
| `src/contextual_balm_host.js` | `commitContextualBalmCommand` (`src/contextual_balm_host.js:12`, declaration); `cancels` (`src/contextual_balm_host.js:65`, declaration) |
| `src/cooling_refinement_host.js` | `commandIds` (`src/cooling_refinement_host.js:12`, declaration); `commitCoolingRefinementCommand` (`src/cooling_refinement_host.js:56`, declaration) |
| `src/crush_social_content.js` | `command` (`src/crush_social_content.js:30`, declaration) |
| `src/crush_social_host.js` | `commitCrushSocialAction` (`src/crush_social_host.js:21`, declaration) |
| `src/crush_social_views.js` | `cancel` (`src/crush_social_views.js:203`, declaration) |
| `src/display.js` | `start_activity_animation` (`src/display.js:1164`, declaration); `commit_selected_item_recipe` (`src/display.js:3125`, declaration); `start_activity_display` (`src/display.js:4486`, declaration); `start_game_action_display` (`src/display.js:4607`, declaration); `start_sleeping_display` (`src/display.js:4703`, declaration); `start_reading_display` (`src/display.js:4727`, declaration) |
| `src/display_settings.js` | `commit` (`src/display_settings.js:70`, declaration) |
| `src/encounter_content.js` | `command` (`src/encounter_content.js:7`, declaration) |
| `src/exchange.js` | `beginExchange` (`src/exchange.js:12`, declaration); `commitExchangeCommand` (`src/exchange.js:18`, declaration) |
| `src/exchange_content.js` | `command` (`src/exchange_content.js:11`, declaration) |
| `src/exchange_ui.js` | `cancel` (`src/exchange_ui.js:12`, declaration) |
| `src/expansion_engine.js` | `commitAction` (`src/expansion_engine.js:536`, declaration); `cancelAction` (`src/expansion_engine.js:643`, declaration) |
| `src/expedition_ui.js` | `cancellable` (`src/expedition_ui.js:79`, declaration) |
| `src/factorio_retort_content.js` | `command` (`src/factorio_retort_content.js:49`, declaration) |
| `src/factorio_retort_host.js` | `commitFactorioRetortCommand` (`src/factorio_retort_host.js:139`, declaration); `cancelFactorioRetortJob` (`src/factorio_retort_host.js:153`, declaration) |
| `src/feature_expansion_battle.js` | `command` (`src/feature_expansion_battle.js:30`, declaration); `commitFeatureBattleAction` (`src/feature_expansion_battle.js:274`, declaration) |
| `src/feature_expansion_book_host.js` | `commit` (`src/feature_expansion_book_host.js:164`, declaration) |
| `src/feature_expansion_book_recognition.js` | `answer` (`src/feature_expansion_book_recognition.js:2905`, declaration) |
| `src/feature_expansion_destination_host.js` | `command` (`src/feature_expansion_destination_host.js:95`, declaration); `beginTidemark` (`src/feature_expansion_destination_host.js:125`, declaration); `commitTidemarkAction` (`src/feature_expansion_destination_host.js:132`, declaration) |
| `src/feature_expansion_nested_chains_host.js` | `commitNestedChainCommand` (`src/feature_expansion_nested_chains_host.js:32`, declaration) |
| `src/feature_expansion_nested_host.js` | `commitNestedCommand` (`src/feature_expansion_nested_host.js:215`, declaration) |
| `src/feature_expansion_nested_life.js` | `command` (`src/feature_expansion_nested_life.js:47`, declaration); `commands` (`src/feature_expansion_nested_life.js:52`, declaration); `commitNestedLifeCommand` (`src/feature_expansion_nested_life.js:119`, declaration) |
| `src/feature_expansion_nested_native.js` | `command` (`src/feature_expansion_nested_native.js:100`, declaration) |
| `src/feature_expansion_objects.js` | `command` (`src/feature_expansion_objects.js:49`, declaration) |
| `src/feature_expansion_objects_host.js` | `beginFeatureObjects` (`src/feature_expansion_objects_host.js:58`, declaration); `commitFeatureObjectCommand` (`src/feature_expansion_objects_host.js:69`, declaration) |
| `src/feature_expansion_powers.js` | `command` (`src/feature_expansion_powers.js:39`, declaration) |
| `src/feature_expansion_reference_desk.js` | `command` (`src/feature_expansion_reference_desk.js:18`, declaration); `commit` (`src/feature_expansion_reference_desk.js:114`, declaration) |
| `src/feature_expansion_society.js` | `command` (`src/feature_expansion_society.js:34`, declaration) |
| `src/feature_expansion_society_host.js` | `beginSociety` (`src/feature_expansion_society_host.js:14`, declaration); `commitSocietyAction` (`src/feature_expansion_society_host.js:25`, declaration); `begin` (`src/feature_expansion_society_host.js:113`, declaration) |
| `src/feature_expansion_subtlety_host.js` | `commit` (`src/feature_expansion_subtlety_host.js:85`, declaration) |
| `src/feature_expansion_subtlety_scene.js` | `command` (`src/feature_expansion_subtlety_scene.js:30`, declaration) |
| `src/field_care_facts.js` | `commands` (`src/field_care_facts.js:39`, declaration) |
| `src/field_care_host.js` | `commitFieldCareCommand` (`src/field_care_host.js:8`, declaration); `cancel` (`src/field_care_host.js:40`, declaration) |
| `src/field_workshop.js` | `command` (`src/field_workshop.js:13`, declaration); `beginFieldWorkshop` (`src/field_workshop.js:107`, declaration) |
| `src/foundation_interaction_content.js` | `command` (`src/foundation_interaction_content.js:9`, declaration) |
| `src/foundation_start_content.js` | `command` (`src/foundation_start_content.js:27`, declaration) |
| `src/frontier_campaign.js` | `command` (`src/frontier_campaign.js:11`, declaration); `commitFieldRenewal` (`src/frontier_campaign.js:100`, declaration) |
| `src/game_absorption_assay_content.js` | `command` (`src/game_absorption_assay_content.js:42`, declaration) |
| `src/game_absorption_assay_host.js` | `commitGameAbsorptionAssayCommand` (`src/game_absorption_assay_host.js:12`, declaration); `cancelGameAbsorptionAssayJob` (`src/game_absorption_assay_host.js:31`, declaration) |
| `src/helper_content.js` | `command` (`src/helper_content.js:4`, declaration) |
| `src/home_furnishing_host.js` | `commitHomeFurnishingCommand` (`src/home_furnishing_host.js:12`, declaration) |
| `src/ink_narrative.js` | `commitInkNarrativeAction` (`src/ink_narrative.js:255`, declaration) |
| `src/known_routes_ui.js` | `commitmentRows` (`src/known_routes_ui.js:62`, declaration) |
| `src/local_livelihood_content.js` | `command` (`src/local_livelihood_content.js:22`, declaration) |
| `src/lore_practice_content.js` | `command` (`src/lore_practice_content.js:28`, declaration) |
| `src/lore_practice_host.js` | `commitLorePracticeCommand` (`src/lore_practice_host.js:30`, declaration) |
| `src/main.js` | `commitDurability` (`src/main.js:643`, declaration); `actFort` (`src/main.js:696`, declaration); `dispatchLocalLifePlan` (`src/main.js:732`, declaration); `commitNativeTrade` (`src/main.js:1020`, declaration); `commitNativeStorage` (`src/main.js:1044`, declaration); `startExpedition` (`src/main.js:1059`, reviewed supplement); `cancelExpedition` (`src/main.js:1066`, declaration); `answerPractice` (`src/main.js:1076`, declaration); `commandStructuredCampaign` (`src/main.js:1108`, declaration); `commandAuthoredSite` (`src/main.js:1148`, declaration); `commandOptionalPack` (`src/main.js:1161`, declaration); `actSimulation` (`src/main.js:1282`, declaration); `actSkillExpansion` (`src/main.js:1322`, declaration); `actOriginalFrontier` (`src/main.js:1329`, declaration); `actFoundationInteraction` (`src/main.js:1359`, declaration); `actManagement` (`src/main.js:1391`, declaration); `actFeatureExpansion` (`src/main.js:1397`, declaration); `actCausalStory` (`src/main.js:1467`, declaration); `actBacklog` (`src/main.js:1490`, declaration); `actRepository` (`src/main.js:1494`, declaration); `actInk` (`src/main.js:1502`, declaration); `beginFrontierJourney` (`src/main.js:1538`, declaration); `actFrontierCampaign` (`src/main.js:1551`, declaration); `actPocketRealm` (`src/main.js:1569`, declaration); `actObservation` (`src/main.js:1577`, declaration); `actExchange` (`src/main.js:1585`, declaration); `actCrushSocial` (`src/main.js:1594`, declaration); `actParty` (`src/main.js:1602`, declaration); `actChronicle` (`src/main.js:1631`, declaration); `beginHeir` (`src/main.js:1650`, declaration); `change_location` (`src/main.js:2172`, declaration); `actWorkLedger` (`src/main.js:2341`, declaration); `start_activity` (`src/main.js:2400`, declaration); `start_game_action` (`src/main.js:2502`, declaration); `game_action_tick = ()` (`src/main.js:2540`, reviewed supplement); `end_game_action` (`src/main.js:2670`, declaration); `start_sleeping` (`src/main.js:2857`, declaration); `start_reading` (`src/main.js:2873`, declaration); `process_rewards` (`src/main.js:2951`, reviewed supplement); `performMixtureAction` (`src/main.js:4696`, reviewed supplement); `cancelCraftEffect` (`src/main.js:8413`, declaration) |
| `src/management/host.js` | `commitManagement` (`src/management/host.js:9`, declaration) |
| `src/management/shared.js` | `command` (`src/management/shared.js:23`, declaration) |
| `src/mixture_native.js` | `commitMixturePlan` (`src/mixture_native.js:38`, declaration) |
| `src/mixture_ui.js` | `cancel` (`src/mixture_ui.js:28`, declaration) |
| `src/models/dialogue_action.js` | `class DialogueAction` (`src/models/dialogue_action.js:5`, reviewed supplement) |
| `src/models/game_action.js` | `class GameAction` (`src/models/game_action.js:8`, reviewed supplement) |
| `src/native_battle.js` | `commitNativeBattleStrike` (`src/native_battle.js:38`, declaration) |
| `src/native_craft_transaction.js` | `beginNativeCraftTransaction` (`src/native_craft_transaction.js:4`, declaration) |
| `src/native_discovery_feedback.js` | `cancel` (`src/native_discovery_feedback.js:16`, declaration) |
| `src/nethack_fieldcraft_content.js` | `command` (`src/nethack_fieldcraft_content.js:38`, declaration) |
| `src/nethack_fieldcraft_host.js` | `commitNethackFieldcraftCommand` (`src/nethack_fieldcraft_host.js:11`, declaration) |
| `src/observation_content.js` | `command` (`src/observation_content.js:11`, declaration); `beginObservation` (`src/observation_content.js:45`, declaration); `commitObservationCommand` (`src/observation_content.js:55`, declaration) |
| `src/original_frontier_campaign_content.js` | `command` (`src/original_frontier_campaign_content.js:30`, declaration) |
| `src/original_frontier_campaign_host.js` | `beginOriginalFrontier` (`src/original_frontier_campaign_host.js:18`, declaration); `commitOriginalFrontier` (`src/original_frontier_campaign_host.js:30`, declaration) |
| `src/original_frontier_campaign_ui.js` | `cancellationText` (`src/original_frontier_campaign_ui.js:12`, declaration); `cancel` (`src/original_frontier_campaign_ui.js:63`, declaration) |
| `src/original_frontier_field_content.js` | `command` (`src/original_frontier_field_content.js:27`, declaration) |
| `src/party_battle.js` | `commitPartyBattleAction` (`src/party_battle.js:61`, declaration) |
| `src/party_content.js` | `command` (`src/party_content.js:5`, declaration) |
| `src/pocket_observation.js` | `commitPocketObservationAction` (`src/pocket_observation.js:190`, declaration) |
| `src/pocket_realm_content.js` | `commandId` (`src/pocket_realm_content.js:75`, declaration); `command` (`src/pocket_realm_content.js:96`, declaration) |
| `src/pocket_realm_host.js` | `command` (`src/pocket_realm_host.js:27`, declaration); `commitPocketRealmAction` (`src/pocket_realm_host.js:90`, declaration) |
| `src/pocket_realm_scenes.js` | `command` (`src/pocket_realm_scenes.js:60`, declaration) |
| `src/promise_content.js` | `command` (`src/promise_content.js:11`, declaration); `beginPromiseVisitor` (`src/promise_content.js:70`, declaration) |
| `src/proto23_world_host.js` | `commitProto23Command` (`src/proto23_world_host.js:102`, declaration) |
| `src/proto23_world_native.js` | `command` (`src/proto23_world_native.js:160`, declaration) |
| `src/proto23_world_state.js` | `commandIds` (`src/proto23_world_state.js:80`, declaration) |
| `src/pursuit_content.js` | `command` (`src/pursuit_content.js:4`, declaration) |
| `src/reference_gameplay_content.js` | `command` (`src/reference_gameplay_content.js:35`, declaration) |
| `src/reference_gameplay_host.js` | `commitReferenceGameplayCommand` (`src/reference_gameplay_host.js:39`, declaration) |
| `src/reference_gameplay_state.js` | `enrollReferenceGameplay` (`src/reference_gameplay_state.js:64`, declaration); `commitReferenceControl` (`src/reference_gameplay_state.js:80`, declaration) |
| `src/repository_absorption_content.js` | `command` (`src/repository_absorption_content.js:47`, declaration) |
| `src/repository_absorption_host.js` | `beginRepositoryAbsorption` (`src/repository_absorption_host.js:20`, declaration); `commitRepositoryAbsorption` (`src/repository_absorption_host.js:33`, declaration); `cancelRepositoryAbsorption` (`src/repository_absorption_host.js:41`, declaration); `commitRepositoryProjection` (`src/repository_absorption_host.js:47`, declaration) |
| `src/repository_absorption_ui.js` | `cancellationText` (`src/repository_absorption_ui.js:12`, declaration); `cancel` (`src/repository_absorption_ui.js:93`, declaration) |
| `src/repository_absorption_workplan.js` | `commandsOf` (`src/repository_absorption_workplan.js:16`, declaration); `commandBinding` (`src/repository_absorption_workplan.js:29`, declaration); `committedOutput` (`src/repository_absorption_workplan.js:234`, declaration) |
| `src/settled_text_effects.js` | `cancel` (`src/settled_text_effects.js:31`, declaration) |
| `src/simulation.js` | `enrollSimulation` (`src/simulation.js:49`, declaration); `commandParticipants` (`src/simulation.js:82`, declaration); `startCommand` (`src/simulation.js:151`, declaration); `commitSimulationCommand` (`src/simulation.js:243`, declaration); `cancelSimulationJob` (`src/simulation.js:304`, declaration); `setSimulationProgram` (`src/simulation.js:326`, declaration); `pauseSimulationProgram` (`src/simulation.js:337`, declaration); `resumeSimulationProgram` (`src/simulation.js:341`, declaration); `answerSimulationEncounter` (`src/simulation.js:360`, declaration); `answerEncounterInto` (`src/simulation.js:367`, declaration); `respondSimulationEvent` (`src/simulation.js:425`, declaration); `respondEventInto` (`src/simulation.js:430`, declaration); `commitCampaignTransition` (`src/simulation.js:576`, declaration) |
| `src/simulation_content.js` | `command` (`src/simulation_content.js:51`, declaration) |
| `src/skill_expansion_content.js` | `command` (`src/skill_expansion_content.js:35`, declaration) |
| `src/start_records.js` | `resolveStart` (`src/start_records.js:51`, reviewed supplement) |
| `src/status_care_content.js` | `command` (`src/status_care_content.js:60`, declaration) |
| `src/status_care_host.js` | `commitStatusCareCommand` (`src/status_care_host.js:11`, declaration); `cancels` (`src/status_care_host.js:63`, declaration) |
| `src/steam_absorption_host.js` | `commitSteamAbsorptionCommand` (`src/steam_absorption_host.js:17`, declaration) |
| `src/steam_boh_content.js` | `command` (`src/steam_boh_content.js:37`, declaration) |
| `src/steam_boh_host.js` | `commitSteamBOHCommand` (`src/steam_boh_host.js:12`, declaration) |
| `src/steam_df_content.js` | `command` (`src/steam_df_content.js:24`, declaration) |
| `src/steam_df_host.js` | `commitSteamDFCommand` (`src/steam_df_host.js:20`, declaration) |
| `src/steam_lamb_content.js` | `command` (`src/steam_lamb_content.js:25`, declaration) |
| `src/steam_lamb_host.js` | `commitSteamLambCommand` (`src/steam_lamb_host.js:11`, declaration) |
| `src/steam_oni_content.js` | `command` (`src/steam_oni_content.js:20`, declaration) |
| `src/steam_oni_host.js` | `commitSteamONICommand` (`src/steam_oni_host.js:12`, declaration) |
| `src/structured_pack_runtime.js` | `beginStructuredCampaign` (`src/structured_pack_runtime.js:52`, declaration) |
| `src/structured_renewal.js` | `commitStructuredRenewal` (`src/structured_renewal.js:41`, declaration) |
| `src/techniques.js` | `answerTechniquePractice` (`src/techniques.js:128`, declaration); `cancelTechniquePractice` (`src/techniques.js:154`, declaration) |
| `src/trade.js` | `cancel_trade` (`src/trade.js:63`, declaration) |
| `src/village_career.js` | `beginVillageShift` (`src/village_career.js:72`, declaration); `beginVillageTeaching` (`src/village_career.js:145`, declaration); `beginRecruitSolo` (`src/village_career.js:154`, declaration); `beginTessaInstruction` (`src/village_career.js:184`, declaration) |
| `src/work_ledger_system.js` | `begin` (`src/work_ledger_system.js:87`, declaration) |
| `src/work_ledger_ui.js` | `cancelEffects` (`src/work_ledger_ui.js:16`, declaration) |
| `src/world_completion_host.js` | `commitWorldCompletionCommand` (`src/world_completion_host.js:14`, declaration) |
| `src/world_completion_learning_content.js` | `command` (`src/world_completion_learning_content.js:30`, declaration) |
| `src/world_completion_learning_host.js` | `commitWorldCompletionLearningCommand` (`src/world_completion_learning_host.js:14`, declaration); `cancels` (`src/world_completion_learning_host.js:31`, declaration) |
| `src/world_completion_lens_content.js` | `command` (`src/world_completion_lens_content.js:37`, declaration) |
| `src/world_completion_lens_host.js` | `commitWorldCompletionLensCommand` (`src/world_completion_lens_host.js:15`, declaration); `cancels` (`src/world_completion_lens_host.js:55`, declaration) |
| `src/world_completion_life_content.js` | `command` (`src/world_completion_life_content.js:16`, declaration) |
| `src/world_completion_life_host.js` | `commitWorldCompletionLifeCommand` (`src/world_completion_life_host.js:9`, declaration); `cancels` (`src/world_completion_life_host.js:33`, declaration) |
| `src/world_completion_materials_content.js` | `command` (`src/world_completion_materials_content.js:49`, declaration) |
| `src/world_completion_materials_host.js` | `commitWorldCompletionMaterialsCommand` (`src/world_completion_materials_host.js:26`, declaration) |

### ER18-I4: AB4 RNG stream

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/anchor_snapshots.js` | `eventTime` (`src/anchor_snapshots.js:39`, reviewed supplement) |
| `src/causal_story_core.js` | `draw` (`src/causal_story_core.js:330`, declaration) |
| `src/causal_story_host.js` | `n=2166136261` (`src/causal_story_host.js:87`, reviewed supplement); `draw` (`src/causal_story_host.js:221`, declaration); `xorshift32 arithmetic` (`src/causal_story_host.js:222`, xorshift32 arithmetic) |
| `src/chronicle.js` | `xorshift32 arithmetic` (`src/chronicle.js:224`, xorshift32 arithmetic) |
| `src/combat_math.js` | `rollBaseCombatDamage` (`src/combat_math.js:34`, declaration); `unseeded random site` (`src/combat_math.js:34`, unseeded random site); `unseeded random site` (`src/combat_math.js:44`, unseeded random site) |
| `src/components/trader_component.js` | `random` (`src/components/trader_component.js:114`, declaration) |
| `src/display.js` | `unseeded random site` (`src/display.js:361`, unseeded random site); `unseeded random site` (`src/display.js:376`, unseeded random site) |
| `src/enemies.js` | `random` (`src/enemies.js:167`, declaration) |
| `src/expansion_engine.js` | `draw` (`src/expansion_engine.js:517`, declaration); `xorshift32 arithmetic` (`src/expansion_engine.js:519`, xorshift32 arithmetic) |
| `src/feature_expansion_battle.js` | `random` (`src/feature_expansion_battle.js:279`, declaration); `xorshift32 arithmetic` (`src/feature_expansion_battle.js:279`, xorshift32 arithmetic) |
| `src/generated_people.js` | `draw` (`src/generated_people.js:15`, declaration); `xorshift32 arithmetic` (`src/generated_people.js:15`, xorshift32 arithmetic) |
| `src/main.js` | `mixtureSeed` (`src/main.js:2`, declaration); `generatedPeopleSeed` (`src/main.js:3`, declaration); `unseeded random site` (`src/main.js:2531`, unseeded random site); `unseeded random site` (`src/main.js:2606`, unseeded random site); `unseeded random site` (`src/main.js:2609`, unseeded random site); `unseeded random site` (`src/main.js:2630`, unseeded random site); `unseeded random site` (`src/main.js:3522`, unseeded random site); `unseeded random site` (`src/main.js:3524`, unseeded random site); `unseeded random site` (`src/main.js:7635`, unseeded random site); `unseeded random site` (`src/main.js:7636`, unseeded random site); `unseeded random site` (`src/main.js:7639`, unseeded random site); `unseeded random site` (`src/main.js:7642`, unseeded random site) |
| `src/misc.js` | `random_range` (`src/misc.js:68`, declaration); `unseeded random site` (`src/misc.js:69`, unseeded random site) |
| `src/mixture_state.js` | `localMixtureSeed` (`src/mixture_state.js:11`, declaration); `xorshift32 arithmetic` (`src/mixture_state.js:13`, xorshift32 arithmetic) |
| `src/models/combat.js` | `random` (`src/models/combat.js:294`, declaration) |
| `src/models/location.js` | `random` (`src/models/location.js:341`, declaration) |
| `src/native_battle.js` | `random` (`src/native_battle.js:47`, declaration); `xorshift32 arithmetic` (`src/native_battle.js:47`, xorshift32 arithmetic) |
| `src/npc_lives.js` | `hash` (`src/npc_lives.js:4`, declaration) |
| `src/particles.js` | `unseeded random site` (`src/particles.js:5`, unseeded random site); `unseeded random site` (`src/particles.js:7`, unseeded random site); `unseeded random site` (`src/particles.js:8`, unseeded random site); `unseeded random site` (`src/particles.js:9`, unseeded random site); `unseeded random site` (`src/particles.js:10`, unseeded random site); `unseeded random site` (`src/particles.js:16`, unseeded random site); `unseeded random site` (`src/particles.js:43`, unseeded random site); `unseeded random site` (`src/particles.js:49`, unseeded random site); `unseeded random site` (`src/particles.js:72`, unseeded random site); `unseeded random site` (`src/particles.js:85`, unseeded random site); `unseeded random site` (`src/particles.js:86`, unseeded random site); `unseeded random site` (`src/particles.js:102`, unseeded random site) |
| `src/party_battle.js` | `random` (`src/party_battle.js:87`, declaration); `xorshift32 arithmetic` (`src/party_battle.js:87`, xorshift32 arithmetic) |
| `src/pocket_realm_content.js` | `createFoldedGlasshouseSeed` (`src/pocket_realm_content.js:50`, declaration) |
| `src/rules.js` | `chooseOutcome` (`src/rules.js:33`, declaration); `resolveOnce` (`src/rules.js:58`, declaration) |
| `src/seeded_streams.js` | `requireStream` (`src/seeded_streams.js:10`, declaration); `hashStreamSeed` (`src/seeded_streams.js:14`, declaration); `mix32` (`src/seeded_streams.js:18`, declaration); `createStreams` (`src/seeded_streams.js:23`, declaration); `validateStreams` (`src/seeded_streams.js:27`, declaration); `ensureStreams` (`src/seeded_streams.js:38`, declaration); `scopedStream` (`src/seeded_streams.js:42`, declaration); `unitDecision` (`src/seeded_streams.js:47`, declaration); `streamSeed` (`src/seeded_streams.js:56`, declaration); `nextOrdinal` (`src/seeded_streams.js:64`, declaration); `drawUnit` (`src/seeded_streams.js:70`, declaration); `keyedUnit` (`src/seeded_streams.js:75`, declaration); `rollChance` (`src/seeded_streams.js:79`, declaration); `rollInt` (`src/seeded_streams.js:83`, declaration); `rollTable` (`src/seeded_streams.js:88`, declaration); `bindGameStreams` (`src/seeded_streams.js:95`, declaration); `gameStream` (`src/seeded_streams.js:97`, declaration); `gameRandom` (`src/seeded_streams.js:98`, declaration); `gameOrdinal` (`src/seeded_streams.js:99`, reviewed supplement); `gameKeyedRandom` (`src/seeded_streams.js:100`, declaration); `gameRandomRange` (`src/seeded_streams.js:101`, declaration); `seededRecipe` (`src/seeded_streams.js:105`, declaration) |
| `src/simulation.js` | `hash` (`src/simulation.js:39`, declaration); `draw` (`src/simulation.js:40`, declaration); `xorshift32 arithmetic` (`src/simulation.js:40`, xorshift32 arithmetic) |
| `src/simulation_resolution.js` | `deriveSimulationSeed` (`src/simulation_resolution.js:4`, declaration) |
| `src/start_records.js` | `seededStartRng` (`src/start_records.js:3`, reviewed supplement) |
| `src/storylet_deck.js` | `roll(` (`src/storylet_deck.js:43`, reviewed supplement); `xorshift32 arithmetic` (`src/storylet_deck.js:44`, xorshift32 arithmetic) |

### ER18-I5: AB5 Store/entity/registry

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_b/furniture.js` | `ownedBooks` (`src/absorb_b/furniture.js:39`, map/set/object registry or cache) |
| `src/absorb_c1/accessories.js` | `byId` (`src/absorb_c1/accessories.js:34`, map/set/object registry or cache) |
| `src/absorb_c2/local_life.js` | `searches` (`src/absorb_c2/local_life.js:18`, map/set/object registry or cache) |
| `src/absorb_d/register.js` | `prior` (`src/absorb_d/register.js:37`, map/set/object registry or cache) |
| `src/absorb_e1/pacing.js` | `getPacingState` (`src/absorb_e1/pacing.js:84`, declaration); `setPacingState` (`src/absorb_e1/pacing.js:85`, declaration) |
| `src/absorb_e2/durability.js` | `slots` (`src/absorb_e2/durability.js:158`, map/set/object registry or cache) |
| `src/absorb_e3/elemental_affinities.js` | `SLOTS` (`src/absorb_e3/elemental_affinities.js:7`, map/set/object registry or cache); `EARTH_ATTACKS` (`src/absorb_e3/elemental_affinities.js:14`, map/set/object registry or cache); `AIR_ATTACKS` (`src/absorb_e3/elemental_affinities.js:15`, map/set/object registry or cache); `AIR_GEAR` (`src/absorb_e3/elemental_affinities.js:16`, map/set/object registry or cache); `WATER_GEAR` (`src/absorb_e3/elemental_affinities.js:17`, map/set/object registry or cache); `EARTH_GEAR` (`src/absorb_e3/elemental_affinities.js:18`, map/set/object registry or cache); `EARTH_COMPONENTS` (`src/absorb_e3/elemental_affinities.js:19`, map/set/object registry or cache); `WATER_COMPONENTS` (`src/absorb_e3/elemental_affinities.js:20`, map/set/object registry or cache); `counted` (`src/absorb_e3/elemental_affinities.js:51`, map/set/object registry or cache); `seen` (`src/absorb_e3/elemental_affinities.js:79`, map/set/object registry or cache) |
| `src/acquisition.js` | `readInventoryOwner` (`src/acquisition.js:5`, declaration) |
| `src/action_legibility.js` | `safeReasons` (`src/action_legibility.js:118`, map/set/object registry or cache); `ids` (`src/action_legibility.js:295`, map/set/object registry or cache); `amendments` (`src/action_legibility.js:362`, map/set/object registry or cache); `changes` (`src/action_legibility.js:431`, map/set/object registry or cache) |
| `src/action_legibility_ui.js` | `live` (`src/action_legibility_ui.js:16`, map/set/object registry or cache); `cache` (`src/action_legibility_ui.js:54`, map/set/object registry or cache); `alternativeCache` (`src/action_legibility_ui.js:91`, map/set/object registry or cache); `actionCache` (`src/action_legibility_ui.js:159`, map/set/object registry or cache) |
| `src/active_effects.js` | `effect_templates` (`src/active_effects.js:3`, map/set/object registry or cache) |
| `src/activities.js` | `activities` (`src/activities.js:6`, map/set/object registry or cache) |
| `src/adventure_notebook.js` | `buttons` (`src/adventure_notebook.js:57`, map/set/object registry or cache); `cards` (`src/adventure_notebook.js:86`, map/set/object registry or cache) |
| `src/agreed_duty_host.js` | `commandIds` (`src/agreed_duty_host.js:15`, map/set/object registry or cache); `legacyDuplicateIds` (`src/agreed_duty_host.js:16`, map/set/object registry or cache); `commandIds` (`src/agreed_duty_host.js:24`, map/set/object registry or cache) |
| `src/anchor_snapshots.js` | `retained` (`src/anchor_snapshots.js:93`, map/set/object registry or cache); `known` (`src/anchor_snapshots.js:177`, map/set/object registry or cache); `knowledge` (`src/anchor_snapshots.js:178`, map/set/object registry or cache); `seen` (`src/anchor_snapshots.js:186`, map/set/object registry or cache) |
| `src/artifact_collection.js` | `reasons` (`src/artifact_collection.js:20`, map/set/object registry or cache); `entries` (`src/artifact_collection.js:55`, map/set/object registry or cache); `recipes` (`src/artifact_collection.js:61`, map/set/object registry or cache); `partIds` (`src/artifact_collection.js:68`, map/set/object registry or cache) |
| `src/audit_remainder_combat_fit_hooks.js` | `harnesses` (`src/audit_remainder_combat_fit_hooks.js:61`, map/set/object registry or cache); `seen` (`src/audit_remainder_combat_fit_hooks.js:223`, map/set/object registry or cache) |
| `src/audit_remainder_combat_objectives_battle.js` | `live` (`src/audit_remainder_combat_objectives_battle.js:13`, declaration) |
| `src/audit_remainder_consequences_facts.js` | `terminalPlots` (`src/audit_remainder_consequences_facts.js:10`, map/set/object registry or cache); `terminalCollections` (`src/audit_remainder_consequences_facts.js:11`, map/set/object registry or cache); `declaredKnowledge` (`src/audit_remainder_consequences_facts.js:225`, map/set/object registry or cache); `reconciled` (`src/audit_remainder_consequences_facts.js:231`, map/set/object registry or cache); `allowedClaims` (`src/audit_remainder_consequences_facts.js:237`, map/set/object registry or cache) |
| `src/audit_remainder_home_facts.js` | `allowedKnowledge` (`src/audit_remainder_home_facts.js:185`, map/set/object registry or cache); `receiptCommand` (`src/audit_remainder_home_facts.js:200`, map/set/object registry or cache) |
| `src/audit_remainder_offers_content.js` | `person` (`src/audit_remainder_offers_content.js:21`, declaration) |
| `src/audit_remainder_offers_state.js` | `frozenRemainderOffersRegistry` (`src/audit_remainder_offers_state.js:181`, declaration); `commands` (`src/audit_remainder_offers_state.js:183`, map/set/object registry or cache) |
| `src/audited_workshop_lesson.js` | `definitions` (`src/audited_workshop_lesson.js:78`, map/set/object registry or cache) |
| `src/authored_site_ui.js` | `inputs` (`src/authored_site_ui.js:13`, map/set/object registry or cache) |
| `src/backlog_expansion_body.js` | `inventory` (`src/backlog_expansion_body.js:95`, declaration) |
| `src/backlog_expansion_replacement.js` | `person` (`src/backlog_expansion_replacement.js:23`, declaration) |
| `src/backlog_expansion_time.js` | `loopAllowed` (`src/backlog_expansion_time.js:27`, map/set/object registry or cache); `packingAllowed` (`src/backlog_expansion_time.js:28`, map/set/object registry or cache) |
| `src/backlog_expansion_transit.js` | `intervals` (`src/backlog_expansion_transit.js:89`, map/set/object registry or cache); `officeAuthorities` (`src/backlog_expansion_transit.js:309`, map/set/object registry or cache) |
| `src/backlog_expansion_ui.js` | `groups` (`src/backlog_expansion_ui.js:12`, map/set/object registry or cache) |
| `src/body_ui.js` | `cards` (`src/body_ui.js:8`, map/set/object registry or cache) |
| `src/book_care_facts.js` | `out` (`src/book_care_facts.js:69`, map/set/object registry or cache); `allowedKnowledge` (`src/book_care_facts.js:105`, map/set/object registry or cache) |
| `src/book_world_effects.js` | `effects` (`src/book_world_effects.js:16`, map/set/object registry or cache) |
| `src/book_world_mol_host.js` | `requirements` (`src/book_world_mol_host.js:51`, map/set/object registry or cache) |
| `src/book_world_mol_native.js` | `stock` (`src/book_world_mol_native.js:76`, map/set/object registry or cache) |
| `src/book_world_paradise_actions.js` | `inventory` (`src/book_world_paradise_actions.js:188`, declaration) |
| `src/book_world_paradise_carriers.js` | `bindings` (`src/book_world_paradise_carriers.js:40`, declaration) |
| `src/book_world_paradise_native.js` | `stock` (`src/book_world_paradise_native.js:76`, map/set/object registry or cache) |
| `src/book_world_player_agency_contracts.js` | `contractByKey` (`src/book_world_player_agency_contracts.js:12`, map/set/object registry or cache); `sourceClasses` (`src/book_world_player_agency_contracts.js:28`, map/set/object registry or cache); `ids` (`src/book_world_player_agency_contracts.js:112`, map/set/object registry or cache); `aliases` (`src/book_world_player_agency_contracts.js:113`, map/set/object registry or cache) |
| `src/capabilities.js` | `ids` (`src/capabilities.js:13`, map/set/object registry or cache); `seen` (`src/capabilities.js:26`, map/set/object registry or cache); `result` (`src/capabilities.js:43`, map/set/object registry or cache) |
| `src/causal_situations.js` | `seen` (`src/causal_situations.js:44`, map/set/object registry or cache) |
| `src/causal_story_content.js` | `person` (`src/causal_story_content.js:15`, declaration) |
| `src/causal_story_core.js` | `sourceIds` (`src/causal_story_core.js:18`, map/set/object registry or cache); `siteIds` (`src/causal_story_core.js:19`, map/set/object registry or cache); `flagNames` (`src/causal_story_core.js:21`, map/set/object registry or cache); `person` (`src/causal_story_core.js:25`, declaration); `createCausalStoryState` (`src/causal_story_core.js:162`, declaration); `keys` (`src/causal_story_core.js:222`, map/set/object registry or cache) |
| `src/causal_story_host.js` | `person` (`src/causal_story_host.js:28`, declaration) |
| `src/causal_story_native.js` | `counts` (`src/causal_story_native.js:70`, map/set/object registry or cache); `person` (`src/causal_story_native.js:94`, declaration); `nativePeople` (`src/causal_story_native.js:209`, map/set/object registry or cache); `inventory` (`src/causal_story_native.js:226`, map/set/object registry or cache); `projections` (`src/causal_story_native.js:401`, map/set/object registry or cache) |
| `src/causal_story_scenes.js` | `studyActions` (`src/causal_story_scenes.js:31`, map/set/object registry or cache); `interventionActions` (`src/causal_story_scenes.js:33`, map/set/object registry or cache); `afterwardActions` (`src/causal_story_scenes.js:34`, map/set/object registry or cache); `conversationRecords` (`src/causal_story_scenes.js:35`, map/set/object registry or cache) |
| `src/causal_story_ui.js` | `sectionRows` (`src/causal_story_ui.js:96`, map/set/object registry or cache); `shown` (`src/causal_story_ui.js:122`, map/set/object registry or cache) |
| `src/character_bio_ui.js` | `sections` (`src/character_bio_ui.js:8`, map/set/object registry or cache); `current` (`src/character_bio_ui.js:23`, map/set/object registry or cache) |
| `src/cheat_cards.js` | `PANELS` (`src/cheat_cards.js:3`, map/set/object registry or cache); `TERMS` (`src/cheat_cards.js:6`, map/set/object registry or cache) |
| `src/chronicle_ui.js` | `buttons` (`src/chronicle_ui.js:16`, map/set/object registry or cache) |
| `src/combat_stances.js` | `stances` (`src/combat_stances.js:7`, map/set/object registry or cache); `multipliers` (`src/combat_stances.js:64`, map/set/object registry or cache) |
| `src/components/dialogue_component.js` | `dialogue_owners` (`src/components/dialogue_component.js:7`, map/set/object registry or cache) |
| `src/components/equipment_component.js` | `equipments` (`src/components/equipment_component.js:3`, map/set/object registry or cache) |
| `src/components/inventory_component.js` | `inventories` (`src/components/inventory_component.js:6`, map/set/object registry or cache) |
| `src/components/trader_component.js` | `conservedCampaignKeys` (`src/components/trader_component.js:16`, map/set/object registry or cache); `retained` (`src/components/trader_component.js:73`, map/set/object registry or cache) |
| `src/content_pack_ui.js` | `visible` (`src/content_pack_ui.js:28`, map/set/object registry or cache) |
| `src/content_packs.js` | `ids` (`src/content_packs.js:60`, map/set/object registry or cache); `loaded` (`src/content_packs.js:89`, map/set/object registry or cache) |
| `src/cooling_refinement_facts.js` | `REFINE_SET` (`src/cooling_refinement_facts.js:17`, map/set/object registry or cache); `COMPLETION_KEYS` (`src/cooling_refinement_facts.js:18`, map/set/object registry or cache); `FACT_KEYS` (`src/cooling_refinement_facts.js:19`, map/set/object registry or cache); `KNOWLEDGE_KEYS` (`src/cooling_refinement_facts.js:20`, map/set/object registry or cache) |
| `src/cooling_refinement_host.js` | `commandIds` (`src/cooling_refinement_host.js:12`, map/set/object registry or cache); `refineIds` (`src/cooling_refinement_host.js:13`, map/set/object registry or cache) |
| `src/crafting_component_filling.js` | `armor_names` (`src/crafting_component_filling.js:507`, map/set/object registry or cache) |
| `src/crafting_visibility.js` | `required` (`src/crafting_visibility.js:9`, map/set/object registry or cache) |
| `src/crush_social_host.js` | `allowedFacts` (`src/crush_social_host.js:59`, map/set/object registry or cache) |
| `src/crush_social_views.js` | `rows` (`src/crush_social_views.js:197`, map/set/object registry or cache) |
| `src/customization_profiles.js` | `profiles` (`src/customization_profiles.js:64`, map/set/object registry or cache); `modules` (`src/customization_profiles.js:69`, map/set/object registry or cache) |
| `src/data/component_references.js` | `levels` (`src/data/component_references.js:3`, map/set/object registry or cache); `availabilities` (`src/data/component_references.js:4`, map/set/object registry or cache); `talkables` (`src/data/component_references.js:6`, map/set/object registry or cache); `bios` (`src/data/component_references.js:7`, map/set/object registry or cache) |
| `src/data/dialogues.js` | `dialogues` (`src/data/dialogues.js:7`, map/set/object registry or cache) |
| `src/data/inventory_templates.js` | `inventory_templates` (`src/data/inventory_templates.js:29`, map/set/object registry or cache) |
| `src/data/locations.js` | `locations` (`src/data/locations.js:12`, map/set/object registry or cache); `location_types` (`src/data/locations.js:13`, map/set/object registry or cache); `favourite_locations` (`src/data/locations.js:15`, map/set/object registry or cache) |
| `src/data/npcs.js` | `NPCRegistryC` (`src/data/npcs.js:20`, declaration); `NPCRegistry =` (`src/data/npcs.js:61`, reviewed supplement) |
| `src/data/skills.js` | `skills` (`src/data/skills.js:10`, map/set/object registry or cache); `skill_categories` (`src/data/skills.js:11`, map/set/object registry or cache); `xp_multipliers` (`src/data/skills.js:3006`, map/set/object registry or cache); `bonus_levels` (`src/data/skills.js:3007`, map/set/object registry or cache) |
| `src/data/storage.js` | `bind_storage_transfer` (`src/data/storage.js:10`, declaration) |
| `src/data/traders.js` | `traders` (`src/data/traders.js:5`, map/set/object registry or cache) |
| `src/display.js` | `location_choice_divs` (`src/display.js:52`, map/set/object registry or cache); `item_divs` (`src/display.js:71`, map/set/object registry or cache); `trader_item_divs` (`src/display.js:74`, map/set/object registry or cache); `storage_item_divs` (`src/display.js:75`, map/set/object registry or cache); `item_buying_divs` (`src/display.js:76`, map/set/object registry or cache); `item_selling_divs` (`src/display.js:77`, map/set/object registry or cache); `skill_bar_divs` (`src/display.js:151`, map/set/object registry or cache); `stance_bar_divs` (`src/display.js:155`, map/set/object registry or cache); `booklist_entry_divs` (`src/display.js:158`, map/set/object registry or cache); `bestiary_entry_divs` (`src/display.js:161`, map/set/object registry or cache); `quest_entry_divs` (`src/display.js:167`, map/set/object registry or cache); `effect_divs` (`src/display.js:216`, map/set/object registry or cache); `inventory_known_keys` (`src/display.js:257`, map/set/object registry or cache); `inventory_new_keys` (`src/display.js:258`, map/set/object registry or cache); `crafting_pages` (`src/display.js:291`, map/set/object registry or cache); `options` (`src/display.js:1885`, map/set/object registry or cache); `inputs` (`src/display.js:3133`, map/set/object registry or cache) |
| `src/display_settings.js` | `panelSettings` (`src/display_settings.js:33`, map/set/object registry or cache); `panelRegistrations` (`src/display_settings.js:34`, map/set/object registry or cache); `stored` (`src/display_settings.js:41`, map/set/object registry or cache); `listeners` (`src/display_settings.js:57`, map/set/object registry or cache); `controls` (`src/display_settings.js:90`, map/set/object registry or cache) |
| `src/enemies.js` | `enemy_templates` (`src/enemies.js:11`, map/set/object registry or cache); `enemy_killcount` (`src/enemies.js:12`, map/set/object registry or cache); `tags_for_droprate_modifier_skills` (`src/enemies.js:32`, map/set/object registry or cache); `droplist` (`src/enemies.js:38`, map/set/object registry or cache) |
| `src/event_feed_ui.js` | `rows` (`src/event_feed_ui.js:14`, map/set/object registry or cache) |
| `src/exchange_ui.js` | `controls` (`src/exchange_ui.js:7`, map/set/object registry or cache) |
| `src/expansion_engine.js` | `domain` (`src/expansion_engine.js:70`, declaration); `createExpansionState` (`src/expansion_engine.js:73`, declaration); `instances` (`src/expansion_engine.js:212`, map/set/object registry or cache); `busyActors` (`src/expansion_engine.js:213`, map/set/object registry or cache); `ids` (`src/expansion_engine.js:280`, map/set/object registry or cache); `createContentRegistry` (`src/expansion_engine.js:303`, declaration); `map` (`src/expansion_engine.js:305`, map/set/object registry or cache); `rollIds` (`src/expansion_engine.js:339`, map/set/object registry or cache); `getDomain` (`src/expansion_engine.js:393`, declaration); `totals` (`src/expansion_engine.js:456`, map/set/object registry or cache) |
| `src/expedition_ui.js` | `cards` (`src/expedition_ui.js:24`, map/set/object registry or cache) |
| `src/factorio_retort_host.js` | `definitions` (`src/factorio_retort_host.js:12`, map/set/object registry or cache); `itemIDs` (`src/factorio_retort_host.js:13`, map/set/object registry or cache); `receiptFor` (`src/factorio_retort_host.js:14`, map/set/object registry or cache); `allowedKnowledge` (`src/factorio_retort_host.js:94`, map/set/object registry or cache) |
| `src/factorio_retort_native.js` | `byKey` (`src/factorio_retort_native.js:11`, map/set/object registry or cache); `byId` (`src/factorio_retort_native.js:12`, map/set/object registry or cache); `commandIds` (`src/factorio_retort_native.js:13`, map/set/object registry or cache); `ids` (`src/factorio_retort_native.js:106`, map/set/object registry or cache) |
| `src/feature_expansion_battle.js` | `bindingReasons` (`src/feature_expansion_battle.js:156`, declaration) |
| `src/feature_expansion_battle_host.js` | `fighters` (`src/feature_expansion_battle_host.js:10`, map/set/object registry or cache) |
| `src/feature_expansion_book_catalogue.js` | `profiles` (`src/feature_expansion_book_catalogue.js:15`, map/set/object registry or cache); `bindBookSubtletyWorld` (`src/feature_expansion_book_catalogue.js:25`, declaration) |
| `src/feature_expansion_book_situated.js` | `allowedRules` (`src/feature_expansion_book_situated.js:448`, map/set/object registry or cache) |
| `src/feature_expansion_destination.js` | `excluded` (`src/feature_expansion_destination.js:71`, map/set/object registry or cache) |
| `src/feature_expansion_destination_host.js` | `domain` (`src/feature_expansion_destination_host.js:12`, declaration); `custom` (`src/feature_expansion_destination_host.js:90`, map/set/object registry or cache); `publicActions` (`src/feature_expansion_destination_host.js:91`, map/set/object registry or cache) |
| `src/feature_expansion_destination_native.js` | `inventory` (`src/feature_expansion_destination_native.js:11`, declaration); `counts` (`src/feature_expansion_destination_native.js:12`, map/set/object registry or cache) |
| `src/feature_expansion_legibility.js` | `items` (`src/feature_expansion_legibility.js:8`, map/set/object registry or cache) |
| `src/feature_expansion_nested_carriers.js` | `bindings` (`src/feature_expansion_nested_carriers.js:41`, declaration) |
| `src/feature_expansion_nested_chains_host.js` | `chainIds` (`src/feature_expansion_nested_chains_host.js:6`, map/set/object registry or cache); `publicIds` (`src/feature_expansion_nested_chains_host.js:7`, map/set/object registry or cache) |
| `src/feature_expansion_nested_host.js` | `byWorld` (`src/feature_expansion_nested_host.js:19`, map/set/object registry or cache); `domain` (`src/feature_expansion_nested_host.js:30`, declaration); `publicIds` (`src/feature_expansion_nested_host.js:153`, map/set/object registry or cache) |
| `src/feature_expansion_nested_ink_ui.js` | `panels` (`src/feature_expansion_nested_ink_ui.js:11`, map/set/object registry or cache); `shown` (`src/feature_expansion_nested_ink_ui.js:21`, map/set/object registry or cache) |
| `src/feature_expansion_nested_life.js` | `publicIds` (`src/feature_expansion_nested_life.js:108`, map/set/object registry or cache) |
| `src/feature_expansion_nested_native.js` | `stock` (`src/feature_expansion_nested_native.js:47`, map/set/object registry or cache) |
| `src/feature_expansion_reference_desk.js` | `referenceRegistryComparison` (`src/feature_expansion_reference_desk.js:64`, declaration) |
| `src/feature_expansion_society_host.js` | `createSocietyWorkPlanRegistry` (`src/feature_expansion_society_host.js:9`, declaration); `planRegistry` (`src/feature_expansion_society_host.js:12`, declaration); `actionRows` (`src/feature_expansion_society_host.js:106`, map/set/object registry or cache) |
| `src/feature_expansion_subtlety_host.js` | `metadata` (`src/feature_expansion_subtlety_host.js:135`, map/set/object registry or cache) |
| `src/feature_expansion_ui.js` | `shown` (`src/feature_expansion_ui.js:41`, map/set/object registry or cache); `actionsShown` (`src/feature_expansion_ui.js:62`, map/set/object registry or cache); `recordsShown` (`src/feature_expansion_ui.js:78`, map/set/object registry or cache) |
| `src/feature_expansion_work_plan.js` | `createWorkPlanRegistry` (`src/feature_expansion_work_plan.js:68`, declaration); `plans` (`src/feature_expansion_work_plan.js:69`, map/set/object registry or cache) |
| `src/field_care_facts.js` | `commands` (`src/field_care_facts.js:39`, map/set/object registry or cache); `keys` (`src/field_care_facts.js:51`, map/set/object registry or cache) |
| `src/field_ui.js` | `groups` (`src/field_ui.js:10`, map/set/object registry or cache) |
| `src/foundation_interaction_policy.js` | `bind` (`src/foundation_interaction_policy.js:9`, declaration); `live` (`src/foundation_interaction_policy.js:66`, declaration); `keys` (`src/foundation_interaction_policy.js:217`, map/set/object registry or cache) |
| `src/foundation_interaction_ui.js` | `buttons` (`src/foundation_interaction_ui.js:13`, map/set/object registry or cache) |
| `src/frontier_campaign_ui.js` | `controls` (`src/frontier_campaign_ui.js:11`, map/set/object registry or cache) |
| `src/game_absorption_assay_facts.js` | `definitions` (`src/game_absorption_assay_facts.js:9`, map/set/object registry or cache); `expectedKnowledge` (`src/game_absorption_assay_facts.js:164`, map/set/object registry or cache) |
| `src/gameplay_transactions.js` | `seen` (`src/gameplay_transactions.js:57`, map/set/object registry or cache) |
| `src/generated_people.js` | `ids` (`src/generated_people.js:31`, map/set/object registry or cache) |
| `src/generated_people_ui.js` | `expanded` (`src/generated_people_ui.js:10`, map/set/object registry or cache) |
| `src/heir_inheritance.js` | `worn` (`src/heir_inheritance.js:39`, map/set/object registry or cache); `belongings` (`src/heir_inheritance.js:41`, map/set/object registry or cache); `reputation` (`src/heir_inheritance.js:51`, map/set/object registry or cache) |
| `src/home_furnishing_facts.js` | `allowedClaims` (`src/home_furnishing_facts.js:232`, map/set/object registry or cache) |
| `src/ink_narrative.js` | `contentByHash` (`src/ink_narrative.js:15`, map/set/object registry or cache); `validationStories` (`src/ink_narrative.js:72`, map/set/object registry or cache); `ids` (`src/ink_narrative.js:74`, map/set/object registry or cache); `seen` (`src/ink_narrative.js:166`, map/set/object registry or cache); `scopeIds` (`src/ink_narrative.js:188`, map/set/object registry or cache) |
| `src/ink_narrative_ui.js` | `ids` (`src/ink_narrative_ui.js:25`, map/set/object registry or cache) |
| `src/items.js` | `item_templates` (`src/items.js:69`, map/set/object registry or cache); `key` (`src/items.js:240`, map/set/object registry or cache); `stats` (`src/items.js:553`, map/set/object registry or cache); `skill_bonus` (`src/items.js:692`, map/set/object registry or cache); `book_stats` (`src/items.js:1116`, map/set/object registry or cache) |
| `src/known_routes.js` | `counts` (`src/known_routes.js:18`, map/set/object registry or cache) |
| `src/known_routes_ui.js` | `routeRows` (`src/known_routes_ui.js:29`, map/set/object registry or cache); `commitmentIds` (`src/known_routes_ui.js:63`, map/set/object registry or cache); `currentRouteIds` (`src/known_routes_ui.js:98`, map/set/object registry or cache) |
| `src/main.js` | `optionalPacks` (`src/main.js:304`, map/set/object registry or cache); `structuredPacks` (`src/main.js:306`, map/set/object registry or cache); `expansionState` (`src/main.js:450`, reviewed supplement); `allowed` (`src/main.js:1484`, map/set/object registry or cache); `travel_times` (`src/main.js:1746`, map/set/object registry or cache); `unlocked_beds` (`src/main.js:1750`, map/set/object registry or cache); `active_effects` (`src/main.js:1783`, map/set/object registry or cache); `faved_stances` (`src/main.js:1788`, map/set/object registry or cache); `favourite_consumables` (`src/main.js:1790`, map/set/object registry or cache); `favourite_items` (`src/main.js:1793`, map/set/object registry or cache); `total_rewards` (`src/main.js:3309`, map/set/object registry or cache); `crafted_items` (`src/main.js:4386`, map/set/object registry or cache); `all_crafted` (`src/main.js:4388`, map/set/object registry or cache); `component_keys` (`src/main.js:4479`, map/set/object registry or cache); `crafted_items` (`src/main.js:4501`, map/set/object registry or cache); `all_crafted` (`src/main.js:4503`, map/set/object registry or cache); `save_data` (`src/main.js:4986`, map/set/object registry or cache); `loot_count` (`src/main.js:6739`, map/set/object registry or cache); `loot_count` (`src/main.js:6760`, map/set/object registry or cache); `localLocations` (`src/main.js:8149`, map/set/object registry or cache); `stats` (`src/main.js:8510`, map/set/object registry or cache); `bodySkills` (`src/main.js:8551`, map/set/object registry or cache) |
| `src/management/ui.js` | `rows` (`src/management/ui.js:9`, map/set/object registry or cache); `seen` (`src/management/ui.js:15`, map/set/object registry or cache) |
| `src/management/validation.js` | `defs` (`src/management/validation.js:19`, map/set/object registry or cache); `knownFacts` (`src/management/validation.js:20`, map/set/object registry or cache) |
| `src/market_saturation.js` | `loot_sold_count` (`src/market_saturation.js:4`, map/set/object registry or cache); `market_regions` (`src/market_saturation.js:9`, map/set/object registry or cache); `new_sold_count` (`src/market_saturation.js:97`, map/set/object registry or cache) |
| `src/mixture_state.js` | `createMixtureState` (`src/mixture_state.js:15`, declaration); `profiles` (`src/mixture_state.js:17`, map/set/object registry or cache); `ordered` (`src/mixture_state.js:50`, map/set/object registry or cache); `owner` (`src/mixture_state.js:99`, reviewed supplement); `getMixtureOwner` (`src/mixture_state.js:100`, declaration); `setMixtureOwner` (`src/mixture_state.js:101`, declaration) |
| `src/mixture_ui.js` | `amounts` (`src/mixture_ui.js:8`, map/set/object registry or cache) |
| `src/models/hero.js` | `effects` (`src/models/hero.js:163`, map/set/object registry or cache) |
| `src/models/npc.js` | `available_lines` (`src/models/npc.js:107`, map/set/object registry or cache); `available_actions` (`src/models/npc.js:124`, map/set/object registry or cache) |
| `src/models/person.js` | `skills_needing_update` (`src/models/person.js:560`, map/set/object registry or cache) |
| `src/models/skill.js` | `which_skills_affect_skill` (`src/models/skill.js:10`, map/set/object registry or cache) |
| `src/name_grammar.js` | `blocked` (`src/name_grammar.js:14`, map/set/object registry or cache) |
| `src/native_battle_host.js` | `fighters` (`src/native_battle_host.js:12`, map/set/object registry or cache) |
| `src/native_craft_transaction.js` | `snapshots` (`src/native_craft_transaction.js:6`, map/set/object registry or cache) |
| `src/native_discovery_policy.js` | `seen` (`src/native_discovery_policy.js:4`, map/set/object registry or cache) |
| `src/native_equipment_transaction.js` | `next` (`src/native_equipment_transaction.js:16`, map/set/object registry or cache) |
| `src/native_realm_traveler.js` | `seen` (`src/native_realm_traveler.js:38`, map/set/object registry or cache) |
| `src/nethack_fieldcraft_facts.js` | `definitions` (`src/nethack_fieldcraft_facts.js:8`, map/set/object registry or cache) |
| `src/nethack_fieldcraft_feats.js` | `earned` (`src/nethack_fieldcraft_feats.js:54`, map/set/object registry or cache) |
| `src/npc_lives.js` | `person` (`src/npc_lives.js:8`, declaration); `ids` (`src/npc_lives.js:27`, map/set/object registry or cache); `events` (`src/npc_lives.js:29`, map/set/object registry or cache) |
| `src/npc_lives_ui.js` | `otherFirstNames` (`src/npc_lives_ui.js:7`, map/set/object registry or cache) |
| `src/observation_channels.js` | `createObservationChannelState` (`src/observation_channels.js:43`, declaration); `sequences` (`src/observation_channels.js:67`, map/set/object registry or cache) |
| `src/observation_content.js` | `live` (`src/observation_content.js:8`, declaration) |
| `src/observation_ui.js` | `controls` (`src/observation_ui.js:7`, map/set/object registry or cache) |
| `src/original_frontier_campaign_ui.js` | `actionRows` (`src/original_frontier_campaign_ui.js:40`, map/set/object registry or cache); `shown` (`src/original_frontier_campaign_ui.js:158`, map/set/object registry or cache); `shownResponses` (`src/original_frontier_campaign_ui.js:185`, map/set/object registry or cache) |
| `src/original_frontier_career_content.js` | `person` (`src/original_frontier_career_content.js:38`, declaration) |
| `src/party_ui.js` | `controls` (`src/party_ui.js:11`, map/set/object registry or cache) |
| `src/pathfinding.js` | `speed_modifiers_from_skills` (`src/pathfinding.js:7`, map/set/object registry or cache); `distance` (`src/pathfinding.js:126`, map/set/object registry or cache) |
| `src/people_ui.js` | `cards` (`src/people_ui.js:8`, map/set/object registry or cache) |
| `src/pocket_realm_host.js` | `selectedSceneNames` (`src/pocket_realm_host.js:23`, map/set/object registry or cache); `hiddenInternal` (`src/pocket_realm_host.js:50`, map/set/object registry or cache) |
| `src/pocket_realm_ui.js` | `controls` (`src/pocket_realm_ui.js:7`, map/set/object registry or cache) |
| `src/promise_ui.js` | `controls` (`src/promise_ui.js:17`, map/set/object registry or cache) |
| `src/proto23_world_native.js` | `stock` (`src/proto23_world_native.js:102`, map/set/object registry or cache) |
| `src/proto23_world_state.js` | `residentIds` (`src/proto23_world_state.js:21`, map/set/object registry or cache); `claims` (`src/proto23_world_state.js:74`, map/set/object registry or cache); `knownPlayerRecords` (`src/proto23_world_state.js:76`, map/set/object registry or cache); `commandIds` (`src/proto23_world_state.js:80`, map/set/object registry or cache); `factKeys` (`src/proto23_world_state.js:81`, map/set/object registry or cache); `hostIds` (`src/proto23_world_state.js:119`, map/set/object registry or cache) |
| `src/pursuit.js` | `active` (`src/pursuit.js:7`, map/set/object registry or cache); `terminal` (`src/pursuit.js:8`, map/set/object registry or cache); `seen` (`src/pursuit.js:22`, map/set/object registry or cache) |
| `src/pursuit_ui.js` | `rows` (`src/pursuit_ui.js:8`, map/set/object registry or cache) |
| `src/quests.js` | `quests` (`src/quests.js:11`, map/set/object registry or cache); `active_quests` (`src/quests.js:12`, map/set/object registry or cache); `questManager =` (`src/quests.js:102`, reviewed supplement) |
| `src/realm_boundary_rules.js` | `seen` (`src/realm_boundary_rules.js:56`, map/set/object registry or cache); `sources` (`src/realm_boundary_rules.js:74`, map/set/object registry or cache); `resources` (`src/realm_boundary_rules.js:82`, map/set/object registry or cache); `anchors` (`src/realm_boundary_rules.js:88`, map/set/object registry or cache); `totals` (`src/realm_boundary_rules.js:128`, map/set/object registry or cache) |
| `src/realm_cargo.js` | `sources` (`src/realm_cargo.js:63`, map/set/object registry or cache); `ids` (`src/realm_cargo.js:70`, map/set/object registry or cache); `classes` (`src/realm_cargo.js:102`, map/set/object registry or cache); `loans` (`src/realm_cargo.js:111`, map/set/object registry or cache); `usedAllocations` (`src/realm_cargo.js:112`, map/set/object registry or cache) |
| `src/realm_clock_leases.js` | `ids` (`src/realm_clock_leases.js:43`, map/set/object registry or cache); `result` (`src/realm_clock_leases.js:96`, map/set/object registry or cache); `live` (`src/realm_clock_leases.js:114`, declaration); `seen` (`src/realm_clock_leases.js:154`, map/set/object registry or cache) |
| `src/realm_connections.js` | `bindings` (`src/realm_connections.js:64`, declaration); `seen` (`src/realm_connections.js:65`, map/set/object registry or cache) |
| `src/realm_state.js` | `bindingManifest` (`src/realm_state.js:13`, declaration) |
| `src/realm_traveler_profiles.js` | `conditions` (`src/realm_traveler_profiles.js:71`, map/set/object registry or cache); `poolOwners` (`src/realm_traveler_profiles.js:80`, map/set/object registry or cache); `stockRecords` (`src/realm_traveler_profiles.js:124`, map/set/object registry or cache); `owners` (`src/realm_traveler_profiles.js:203`, map/set/object registry or cache); `binding` (`src/realm_traveler_profiles.js:232`, declaration); `binding` (`src/realm_traveler_profiles.js:261`, declaration); `totals` (`src/realm_traveler_profiles.js:336`, map/set/object registry or cache) |
| `src/reference_gameplay_feats.js` | `allFeats` (`src/reference_gameplay_feats.js:29`, map/set/object registry or cache); `APPROACH_TYPES` (`src/reference_gameplay_feats.js:32`, map/set/object registry or cache); `earnedIds` (`src/reference_gameplay_feats.js:50`, map/set/object registry or cache); `methods` (`src/reference_gameplay_feats.js:125`, map/set/object registry or cache); `methods` (`src/reference_gameplay_feats.js:150`, map/set/object registry or cache); `priorIds` (`src/reference_gameplay_feats.js:176`, map/set/object registry or cache); `earnedBefore` (`src/reference_gameplay_feats.js:224`, map/set/object registry or cache); `oldIds` (`src/reference_gameplay_feats.js:287`, map/set/object registry or cache); `learnedPowerIds` (`src/reference_gameplay_feats.js:298`, map/set/object registry or cache); `earned` (`src/reference_gameplay_feats.js:325`, map/set/object registry or cache) |
| `src/repository_absorption_ui.js` | `actionRows` (`src/repository_absorption_ui.js:55`, map/set/object registry or cache); `shown` (`src/repository_absorption_ui.js:125`, map/set/object registry or cache); `shownActions` (`src/repository_absorption_ui.js:164`, map/set/object registry or cache); `shownRecords` (`src/repository_absorption_ui.js:184`, map/set/object registry or cache) |
| `src/rules.js` | `ids` (`src/rules.js:35`, map/set/object registry or cache) |
| `src/save_compatibility.js` | `RETIRED_IDS` (`src/save_compatibility.js:2`, map/set/object registry or cache) |
| `src/scene_definitions.js` | `ids` (`src/scene_definitions.js:6`, map/set/object registry or cache) |
| `src/seeded_streams.js` | `families` (`src/seeded_streams.js:5`, map/set/object registry or cache); `bindGameStreams` (`src/seeded_streams.js:95`, declaration); `live` (`src/seeded_streams.js:96`, declaration) |
| `src/settled_text_effects.js` | `seen` (`src/settled_text_effects.js:12`, map/set/object registry or cache) |
| `src/simulation.js` | `domain` (`src/simulation.js:36`, declaration); `returns` (`src/simulation.js:192`, map/set/object registry or cache) |
| `src/simulation_contracts.js` | `createSimulationRegistry` (`src/simulation_contracts.js:101`, declaration); `registry` (`src/simulation_contracts.js:102`, map/set/object registry or cache); `next` (`src/simulation_contracts.js:211`, map/set/object registry or cache); `createSimulationState` (`src/simulation_contracts.js:217`, declaration); `person` (`src/simulation_contracts.js:232`, declaration); `busy` (`src/simulation_contracts.js:256`, map/set/object registry or cache) |
| `src/simulation_effects.js` | `person` (`src/simulation_effects.js:59`, declaration); `inventory` (`src/simulation_effects.js:60`, declaration); `writeInventory` (`src/simulation_effects.js:65`, declaration) |
| `src/simulation_resolution.js` | `aliases` (`src/simulation_resolution.js:12`, map/set/object registry or cache) |
| `src/simulation_ui.js` | `controls` (`src/simulation_ui.js:18`, map/set/object registry or cache); `participantRows` (`src/simulation_ui.js:27`, map/set/object registry or cache) |
| `src/site_projects.js` | `ids` (`src/site_projects.js:6`, map/set/object registry or cache) |
| `src/skill_expansion_content.js` | `facts` (`src/skill_expansion_content.js:197`, map/set/object registry or cache) |
| `src/skill_expansion_ui.js` | `rows` (`src/skill_expansion_ui.js:8`, map/set/object registry or cache); `current` (`src/skill_expansion_ui.js:20`, map/set/object registry or cache); `actionIds` (`src/skill_expansion_ui.js:24`, map/set/object registry or cache) |
| `src/start_probe_ui.js` | `rows` (`src/start_probe_ui.js:9`, map/set/object registry or cache) |
| `src/status_care_facts.js` | `definitions` (`src/status_care_facts.js:83`, map/set/object registry or cache); `keys` (`src/status_care_facts.js:90`, map/set/object registry or cache) |
| `src/status_window.js` | `values` (`src/status_window.js:12`, map/set/object registry or cache); `fields` (`src/status_window.js:18`, map/set/object registry or cache) |
| `src/steam_absorption_content.js` | `steamAbsorptionDefinitions` (`src/steam_absorption_content.js:9`, map/set/object registry or cache) |
| `src/steam_boh_facts.js` | `definitions` (`src/steam_boh_facts.js:9`, map/set/object registry or cache); `fixedKnowledge` (`src/steam_boh_facts.js:10`, map/set/object registry or cache) |
| `src/steam_df_facts.js` | `definitions` (`src/steam_df_facts.js:7`, map/set/object registry or cache); `fixedKnowledge` (`src/steam_df_facts.js:11`, map/set/object registry or cache) |
| `src/steam_lamb_facts.js` | `definitions` (`src/steam_lamb_facts.js:8`, map/set/object registry or cache); `fixedKnowledge` (`src/steam_lamb_facts.js:9`, map/set/object registry or cache) |
| `src/steam_oni_facts.js` | `definitions` (`src/steam_oni_facts.js:7`, map/set/object registry or cache); `fixedKnowledge` (`src/steam_oni_facts.js:8`, map/set/object registry or cache) |
| `src/storylet_deck.js` | `families` (`src/storylet_deck.js:68`, map/set/object registry or cache) |
| `src/structured_container_runtime.js` | `energyRegistry` (`src/structured_container_runtime.js:13`, declaration); `units` (`src/structured_container_runtime.js:27`, map/set/object registry or cache); `expected` (`src/structured_container_runtime.js:46`, map/set/object registry or cache); `facts` (`src/structured_container_runtime.js:122`, map/set/object registry or cache) |
| `src/structured_equipment_runtime.js` | `regions` (`src/structured_equipment_runtime.js:5`, map/set/object registry or cache); `items` (`src/structured_equipment_runtime.js:44`, map/set/object registry or cache); `stats` (`src/structured_equipment_runtime.js:85`, map/set/object registry or cache) |
| `src/structured_pack_definitions.js` | `supportedCapabilities` (`src/structured_pack_definitions.js:9`, map/set/object registry or cache); `seen` (`src/structured_pack_definitions.js:45`, map/set/object registry or cache); `people` (`src/structured_pack_definitions.js:78`, map/set/object registry or cache) |
| `src/structured_pack_state.js` | `permitted` (`src/structured_pack_state.js:63`, map/set/object registry or cache) |
| `src/structured_pack_ui.js` | `actionRows` (`src/structured_pack_ui.js:10`, map/set/object registry or cache) |
| `src/techniques.js` | `facts` (`src/techniques.js:86`, map/set/object registry or cache) |
| `src/titles.js` | `titles` (`src/titles.js:60`, map/set/object registry or cache) |
| `src/town_ui.js` | `cards` (`src/town_ui.js:10`, map/set/object registry or cache) |
| `src/translation.js` | `translations` (`src/translation.js:7`, map/set/object registry or cache) |
| `src/ui/combat_display.js` | `attacker_animations` (`src/ui/combat_display.js:40`, map/set/object registry or cache); `defender_animations` (`src/ui/combat_display.js:41`, map/set/object registry or cache) |
| `src/verifier.js` | `unique_keys` (`src/verifier.js:436`, map/set/object registry or cache) |
| `src/village_ui.js` | `cards` (`src/village_ui.js:40`, map/set/object registry or cache) |
| `src/workspace_layout.js` | `registry` (`src/workspace_layout.js:3`, map/set/object registry or cache); `registerWorkspaceModule` (`src/workspace_layout.js:8`, declaration); `previous` (`src/workspace_layout.js:37`, map/set/object registry or cache); `context` (`src/workspace_layout.js:44`, map/set/object registry or cache); `counts` (`src/workspace_layout.js:135`, map/set/object registry or cache); `unregisterWorkspaceModule` (`src/workspace_layout.js:351`, declaration) |
| `src/workspace_state.js` | `known` (`src/workspace_state.js:15`, map/set/object registry or cache) |
| `src/world_completion_crop_clock.js` | `ids` (`src/world_completion_crop_clock.js:2`, map/set/object registry or cache) |
| `src/world_completion_learning_runtime.js` | `frozenWorldCompletionLearningRegistry` (`src/world_completion_learning_runtime.js:73`, declaration); `commands` (`src/world_completion_learning_runtime.js:76`, map/set/object registry or cache) |
| `src/world_completion_lens_runtime.js` | `frozenWorldCompletionLensRegistry` (`src/world_completion_lens_runtime.js:11`, declaration); `commands` (`src/world_completion_lens_runtime.js:13`, map/set/object registry or cache) |
| `src/world_completion_life_facts.js` | `definitions` (`src/world_completion_life_facts.js:66`, map/set/object registry or cache); `admitted` (`src/world_completion_life_facts.js:77`, map/set/object registry or cache) |
| `src/world_completion_life_runtime.js` | `worldCompletionLifeRuntimeRegistry` (`src/world_completion_life_runtime.js:6`, declaration); `commands` (`src/world_completion_life_runtime.js:9`, map/set/object registry or cache) |
| `src/world_completion_materials_host.js` | `worldCompletionMaterialsRuntimeRegistry` (`src/world_completion_materials_host.js:15`, declaration); `commands` (`src/world_completion_materials_host.js:20`, map/set/object registry or cache) |
| `src/world_completion_native.js` | `totals` (`src/world_completion_native.js:41`, map/set/object registry or cache) |
| `src/world_instances.js` | `graph` (`src/world_instances.js:237`, map/set/object registry or cache); `seen` (`src/world_instances.js:239`, map/set/object registry or cache); `actorsVisiting` (`src/world_instances.js:247`, map/set/object registry or cache) |
| `src/world_visit_history.js` | `ids` (`src/world_visit_history.js:7`, map/set/object registry or cache) |

### ER18-I6: AB6 Fact/knowledge

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_d/fort.js` | `observeFortSource` (`src/absorb_d/fort.js:27`, declaration) |
| `src/acquisition.js` | `recordAcquisitions` (`src/acquisition.js:19`, declaration) |
| `src/action_legibility.js` | `projectSubtletyKnowledgeLegibility` (`src/action_legibility.js:419`, declaration) |
| `src/agreed_duty_content.js` | `knowledge` (`src/agreed_duty_content.js:8`, declaration) |
| `src/agreed_duty_continuation.js` | `knowledge` (`src/agreed_duty_continuation.js:12`, declaration) |
| `src/agreed_duty_facts.js` | `agreedDutyFacts` (`src/agreed_duty_facts.js:87`, declaration) |
| `src/agreed_duty_host.js` | `withAgreedDutyFacts` (`src/agreed_duty_host.js:18`, declaration) |
| `src/alloy_equipment.js` | `alloyEquipmentFacts` (`src/alloy_equipment.js:10`, declaration) |
| `src/anchor_snapshots.js` | `applyEffects` (`src/anchor_snapshots.js:53`, reviewed supplement); `knowledge write` (`src/anchor_snapshots.js:67`, knowledge write); `deriveSnapshot` (`src/anchor_snapshots.js:147`, reviewed supplement); `explainFact` (`src/anchor_snapshots.js:160`, reviewed supplement); `knowledge` (`src/anchor_snapshots.js:178`, declaration) |
| `src/audit_remainder_combat_fit_facts.js` | `remainderCombatFitFacts` (`src/audit_remainder_combat_fit_facts.js:105`, declaration); `knowledgeReceipt` (`src/audit_remainder_combat_fit_facts.js:128`, declaration); `knowledge` (`src/audit_remainder_combat_fit_facts.js:139`, declaration); `otherKnowledge` (`src/audit_remainder_combat_fit_facts.js:142`, declaration); `otherFacts` (`src/audit_remainder_combat_fit_facts.js:143`, declaration) |
| `src/audit_remainder_combat_objectives_content.js` | `remainderCombatObjectivesFacts` (`src/audit_remainder_combat_objectives_content.js:49`, declaration) |
| `src/audit_remainder_consequences_content.js` | `memory` (`src/audit_remainder_consequences_content.js:43`, declaration) |
| `src/audit_remainder_consequences_facts.js` | `memory` (`src/audit_remainder_consequences_facts.js:37`, declaration); `remainderConsequencesFacts` (`src/audit_remainder_consequences_facts.js:44`, declaration) |
| `src/audit_remainder_facts.js` | `auditRemainderCombinedFacts` (`src/audit_remainder_facts.js:12`, declaration) |
| `src/audit_remainder_home_facts.js` | `remainderHomeFacts` (`src/audit_remainder_home_facts.js:63`, declaration); `knowledgeRows` (`src/audit_remainder_home_facts.js:156`, declaration) |
| `src/audit_remainder_livelihood_facts.js` | `remainderLivelihoodFacts` (`src/audit_remainder_livelihood_facts.js:69`, declaration); `knowledge` (`src/audit_remainder_livelihood_facts.js:151`, declaration) |
| `src/audit_remainder_offers_state.js` | `remainderOffersFacts` (`src/audit_remainder_offers_state.js:17`, declaration) |
| `src/audit_remainder_state.js` | `auditRemainderFacts` (`src/audit_remainder_state.js:23`, declaration) |
| `src/audited_kit_reserve_facts.js` | `auditedKitReserveFacts` (`src/audited_kit_reserve_facts.js:19`, declaration) |
| `src/audited_workshop_facts.js` | `auditedWorkshopFacts` (`src/audited_workshop_facts.js:7`, declaration) |
| `src/audited_workshop_fixture.js` | `auditedFixtureFacts` (`src/audited_workshop_fixture.js:73`, declaration); `relatedKnowledge` (`src/audited_workshop_fixture.js:119`, declaration) |
| `src/audited_workshop_lesson.js` | `auditedLessonFacts` (`src/audited_workshop_lesson.js:121`, declaration) |
| `src/backlog_expansion_body.js` | `observe` (`src/backlog_expansion_body.js:132`, declaration); `knowledge write` (`src/backlog_expansion_body.js:134`, knowledge write) |
| `src/backlog_expansion_opportunities.js` | `knowledge write` (`src/backlog_expansion_opportunities.js:107`, knowledge write) |
| `src/backlog_expansion_replacement.js` | `knowledge write` (`src/backlog_expansion_replacement.js:65`, knowledge write); `observed` (`src/backlog_expansion_replacement.js:66`, declaration) |
| `src/backlog_expansion_time.js` | `observedWallMinutes` (`src/backlog_expansion_time.js:85`, declaration); `observe` (`src/backlog_expansion_time.js:131`, declaration); `knowledge write` (`src/backlog_expansion_time.js:132`, knowledge write) |
| `src/body_progression.js` | `bodyFacts` (`src/body_progression.js:65`, declaration) |
| `src/book_care_content.js` | `knowledge` (`src/book_care_content.js:20`, declaration) |
| `src/book_care_facts.js` | `bookCareFacts` (`src/book_care_facts.js:44`, declaration); `facts` (`src/book_care_facts.js:93`, declaration); `allowedKnowledge` (`src/book_care_facts.js:105`, declaration) |
| `src/book_world_mol_actions.js` | `molFacts` (`src/book_world_mol_actions.js:110`, declaration) |
| `src/book_world_paradise_actions.js` | `paradiseFacts` (`src/book_world_paradise_actions.js:170`, declaration) |
| `src/book_world_paradise_campaign_facts.js` | `paradiseCampaignFacts` (`src/book_world_paradise_campaign_facts.js:24`, declaration) |
| `src/book_world_paradise_carriers.js` | `observed` (`src/book_world_paradise_carriers.js:39`, declaration); `paradiseCarrierKnowledge` (`src/book_world_paradise_carriers.js:66`, declaration) |
| `src/causal_situations.js` | `validateKnowledgeBasis` (`src/causal_situations.js:52`, declaration) |
| `src/causal_story_actors.js` | `ownedKnowledge` (`src/causal_story_actors.js:76`, declaration); `causalStoryActorFacts` (`src/causal_story_actors.js:84`, declaration) |
| `src/causal_story_content.js` | `causalStoryFacts` (`src/causal_story_content.js:251`, declaration) |
| `src/causal_story_core.js` | `knowledge` (`src/causal_story_core.js:28`, declaration); `validateKnowledge` (`src/causal_story_core.js:79`, declaration); `deliveryFacts` (`src/causal_story_core.js:127`, declaration); `ownsFacts` (`src/causal_story_core.js:173`, declaration) |
| `src/causal_story_host.js` | `knowledge` (`src/causal_story_host.js:37`, declaration); `observers` (`src/causal_story_host.js:234`, declaration) |
| `src/cheat_cards.js` | `recordCheatMessage` (`src/cheat_cards.js:71`, declaration) |
| `src/chronicle.js` | `chronicleFacts` (`src/chronicle.js:129`, declaration); `recordArchiveDuty` (`src/chronicle.js:135`, declaration); `knowledge write` (`src/chronicle.js:186`, knowledge write); `knowledge write` (`src/chronicle.js:194`, knowledge write); `knowledge write` (`src/chronicle.js:293`, knowledge write) |
| `src/contextual_balm_facts.js` | `contextualBalmFacts` (`src/contextual_balm_facts.js:23`, declaration); `foreignFacts` (`src/contextual_balm_facts.js:59`, declaration); `foreignKnowledge` (`src/contextual_balm_facts.js:61`, declaration) |
| `src/cooling_refinement_facts.js` | `ownFacts` (`src/cooling_refinement_facts.js:13`, declaration); `coolingRefinementFacts` (`src/cooling_refinement_facts.js:44`, declaration); `foreignFacts` (`src/cooling_refinement_facts.js:113`, declaration); `foreignKnowledge` (`src/cooling_refinement_facts.js:116`, declaration); `coolingKnowledge` (`src/cooling_refinement_facts.js:124`, declaration) |
| `src/crush_social_content.js` | `memory` (`src/crush_social_content.js:15`, declaration) |
| `src/crush_social_facts.js` | `crushSocialFacts` (`src/crush_social_facts.js:14`, declaration) |
| `src/crush_social_views.js` | `memories` (`src/crush_social_views.js:94`, declaration) |
| `src/display.js` | `fieldcraftKnowledgeReader` (`src/display.js:507`, declaration); `setFieldcraftKnowledgeReader` (`src/display.js:508`, declaration) |
| `src/event_feed.js` | `eventFeed` (`src/event_feed.js:5`, reviewed supplement) |
| `src/everyday_life.js` | `everydayFacts` (`src/everyday_life.js:49`, declaration) |
| `src/expansion_engine.js` | `effect.type === "fact"` (`src/expansion_engine.js:105`, reviewed supplement); `factsFor` (`src/expansion_engine.js:401`, declaration) |
| `src/factorio_retort_facts.js` | `factorioRetortFacts` (`src/factorio_retort_facts.js:15`, declaration) |
| `src/factorio_retort_host.js` | `ownFacts` (`src/factorio_retort_host.js:65`, declaration); `knowledge` (`src/factorio_retort_host.js:66`, declaration); `allowedKnowledge` (`src/factorio_retort_host.js:94`, declaration) |
| `src/feature_expansion_battle.js` | `featureBattleFacts` (`src/feature_expansion_battle.js:63`, declaration) |
| `src/feature_expansion_book_host.js` | `knowledgeRetained` (`src/feature_expansion_book_host.js:71`, declaration) |
| `src/feature_expansion_destination_host.js` | `knowledge write` (`src/feature_expansion_destination_host.js:172`, knowledge write) |
| `src/feature_expansion_host.js` | `featureRecordedKnowledge` (`src/feature_expansion_host.js:46`, declaration) |
| `src/feature_expansion_legibility.js` | `observed` (`src/feature_expansion_legibility.js:24`, declaration) |
| `src/feature_expansion_nested_carriers.js` | `observed` (`src/feature_expansion_nested_carriers.js:40`, declaration); `nestedCarrierKnowledge` (`src/feature_expansion_nested_carriers.js:67`, declaration) |
| `src/feature_expansion_nested_chains.js` | `memory` (`src/feature_expansion_nested_chains.js:21`, declaration); `knowledge` (`src/feature_expansion_nested_chains.js:22`, declaration); `nestedChainFacts` (`src/feature_expansion_nested_chains.js:272`, declaration) |
| `src/feature_expansion_nested_content.js` | `knowledge` (`src/feature_expansion_nested_content.js:50`, declaration) |
| `src/feature_expansion_nested_host.js` | `knowledge` (`src/feature_expansion_nested_host.js:29`, declaration); `nestedFacts` (`src/feature_expansion_nested_host.js:115`, declaration) |
| `src/feature_expansion_nested_life.js` | `nestedLifeFacts` (`src/feature_expansion_nested_life.js:86`, declaration) |
| `src/feature_expansion_objects_host.js` | `featureObjectFacts` (`src/feature_expansion_objects_host.js:21`, declaration) |
| `src/feature_expansion_powers.js` | `featurePowerFacts` (`src/feature_expansion_powers.js:76`, declaration) |
| `src/feature_expansion_powers_host.js` | `publicFacts` (`src/feature_expansion_powers_host.js:8`, declaration) |
| `src/feature_expansion_recognition_host.js` | `knowledge write` (`src/feature_expansion_recognition_host.js:10`, knowledge write); `knowledge write` (`src/feature_expansion_recognition_host.js:11`, knowledge write); `knowledge write` (`src/feature_expansion_recognition_host.js:12`, knowledge write) |
| `src/feature_expansion_reference_desk.js` | `referenceDeskFacts` (`src/feature_expansion_reference_desk.js:80`, declaration) |
| `src/feature_expansion_society.js` | `knowledge` (`src/feature_expansion_society.js:24`, declaration); `memory` (`src/feature_expansion_society.js:26`, declaration); `societyFacts` (`src/feature_expansion_society.js:44`, declaration) |
| `src/feature_expansion_subtlety_host.js` | `relayFacts` (`src/feature_expansion_subtlety_host.js:18`, declaration); `relayKnowledgePresentation` (`src/feature_expansion_subtlety_host.js:134`, declaration) |
| `src/feature_expansion_subtlety_scene.js` | `memory` (`src/feature_expansion_subtlety_scene.js:22`, declaration) |
| `src/field_care_facts.js` | `fieldCareFacts` (`src/field_care_facts.js:10`, declaration); `facts` (`src/field_care_facts.js:29`, declaration) |
| `src/field_workshop.js` | `observe` (`src/field_workshop.js:10`, declaration); `initializeFieldFacts` (`src/field_workshop.js:103`, declaration) |
| `src/foundation_interaction_content.js` | `foundationInteractionProbeFacts` (`src/foundation_interaction_content.js:44`, declaration) |
| `src/frontier_campaign.js` | `initializeCampaignFacts` (`src/frontier_campaign.js:69`, declaration) |
| `src/game_absorption_assay_facts.js` | `observedNegative` (`src/game_absorption_assay_facts.js:79`, declaration); `gameAbsorptionAssayFacts` (`src/game_absorption_assay_facts.js:106`, declaration); `knowledgeEffect` (`src/game_absorption_assay_facts.js:131`, declaration); `knowledge` (`src/game_absorption_assay_facts.js:148`, declaration) |
| `src/home_furnishing_facts.js` | `homeFurnishingFacts` (`src/home_furnishing_facts.js:104`, declaration); `facts` (`src/home_furnishing_facts.js:147`, declaration) |
| `src/ink_scene_content.js` | `knowledge` (`src/ink_scene_content.js:12`, declaration); `relayKnowledge` (`src/ink_scene_content.js:142`, declaration); `observe` (`src/ink_scene_content.js:334`, declaration) |
| `src/life_record.js` | `observeLifeSave` (`src/life_record.js:65`, declaration) |
| `src/lore_practice_content.js` | `lorePracticeKnowledge` (`src/lore_practice_content.js:25`, declaration) |
| `src/lore_practice_facts.js` | `lorePracticeFacts` (`src/lore_practice_facts.js:76`, declaration) |
| `src/main.js` | `observeFortAcquisition` (`src/main.js:703`, declaration) |
| `src/management/facts.js` | `unsetActorFacts` (`src/management/facts.js:6`, declaration); `managementFacts` (`src/management/facts.js:9`, declaration) |
| `src/mixture_native.js` | `knowledge write` (`src/mixture_native.js:18`, knowledge write) |
| `src/mixture_state.js` | `knowledge[id]` (`src/mixture_state.js:40`, reviewed supplement) |
| `src/nethack_fieldcraft_facts.js` | `nethackFieldcraftFacts` (`src/nethack_fieldcraft_facts.js:45`, declaration) |
| `src/observation_channels.js` | `planObservationSample` (`src/observation_channels.js:215`, reviewed supplement) |
| `src/original_frontier_campaign_content.js` | `memory` (`src/original_frontier_campaign_content.js:29`, declaration) |
| `src/original_frontier_career_content.js` | `memory` (`src/original_frontier_career_content.js:22`, declaration); `observe` (`src/original_frontier_career_content.js:23`, declaration) |
| `src/original_frontier_facts.js` | `originalFrontierFacts` (`src/original_frontier_facts.js:7`, declaration) |
| `src/people_knowledge.js` | `knownPeopleView` (`src/people_knowledge.js:12`, declaration) |
| `src/pocket_realm_content.js` | `knowledge` (`src/pocket_realm_content.js:82`, declaration) |
| `src/pocket_realm_scenes.js` | `memory` (`src/pocket_realm_scenes.js:56`, declaration); `pocketRealmSceneFacts` (`src/pocket_realm_scenes.js:296`, declaration) |
| `src/promise_content.js` | `memory` (`src/promise_content.js:10`, declaration) |
| `src/proto23_world_actions.js` | `proto23Facts` (`src/proto23_world_actions.js:5`, declaration) |
| `src/realm_state.js` | `realmFacts` (`src/realm_state.js:52`, declaration) |
| `src/reference_gameplay_feats.js` | `observeBattleActions` (`src/reference_gameplay_feats.js:136`, declaration) |
| `src/reference_gameplay_host.js` | `referenceGameplayFacts` (`src/reference_gameplay_host.js:12`, declaration) |
| `src/reference_gameplay_state.js` | `facts` (`src/reference_gameplay_state.js:12`, declaration) |
| `src/repository_absorption_chains.js` | `knowledge` (`src/repository_absorption_chains.js:16`, declaration) |
| `src/repository_absorption_content.js` | `memory` (`src/repository_absorption_content.js:40`, declaration) |
| `src/repository_absorption_facts.js` | `repositoryAbsorptionFacts` (`src/repository_absorption_facts.js:8`, declaration) |
| `src/settled_text_effects.js` | `observer` (`src/settled_text_effects.js:184`, declaration) |
| `src/simulation_effects.js` | `simulationFacts` (`src/simulation_effects.js:85`, declaration); `knowledge write` (`src/simulation_effects.js:158`, knowledge write); `e.type === "fact"` (`src/simulation_effects.js:243`, reviewed supplement); `e.type === "knowledge"` (`src/simulation_effects.js:281`, reviewed supplement); `knowledge write` (`src/simulation_effects.js:284`, knowledge write) |
| `src/site_projects.js` | `knowledge write` (`src/site_projects.js:30`, knowledge write) |
| `src/skill_expansion_content.js` | `knowledge` (`src/skill_expansion_content.js:21`, declaration); `skillExpansionFacts` (`src/skill_expansion_content.js:195`, declaration) |
| `src/skill_expansion_host.js` | `publicFacts` (`src/skill_expansion_host.js:10`, declaration); `facts` (`src/skill_expansion_host.js:15`, declaration) |
| `src/start_records.js` | `compose` (`src/start_records.js:8`, reviewed supplement) |
| `src/status_care_facts.js` | `statusCareFacts` (`src/status_care_facts.js:33`, declaration); `ownFacts` (`src/status_care_facts.js:73`, declaration) |
| `src/steam_absorption_facts.js` | `steamAbsorptionFacts` (`src/steam_absorption_facts.js:6`, declaration) |
| `src/steam_boh_facts.js` | `fixedKnowledge` (`src/steam_boh_facts.js:10`, declaration); `steamBOHFacts` (`src/steam_boh_facts.js:12`, declaration) |
| `src/steam_df_content.js` | `knowledge` (`src/steam_df_content.js:22`, declaration) |
| `src/steam_df_facts.js` | `fixedKnowledge` (`src/steam_df_facts.js:11`, declaration); `steamDFFacts` (`src/steam_df_facts.js:13`, declaration) |
| `src/steam_lamb_facts.js` | `fixedKnowledge` (`src/steam_lamb_facts.js:9`, declaration); `steamLambFacts` (`src/steam_lamb_facts.js:10`, declaration) |
| `src/steam_lamb_runtime.js` | `exactPriorKnowledge` (`src/steam_lamb_runtime.js:16`, declaration) |
| `src/steam_oni_facts.js` | `fixedKnowledge` (`src/steam_oni_facts.js:8`, declaration); `steamONIFacts` (`src/steam_oni_facts.js:10`, declaration) |
| `src/storylet_deck.js` | `storyletFacts` (`src/storylet_deck.js:24`, declaration) |
| `src/structured_container_runtime.js` | `containerFacts` (`src/structured_container_runtime.js:121`, declaration) |
| `src/techniques.js` | `techniqueFacts` (`src/techniques.js:85`, declaration); `observeNativeTechnique` (`src/techniques.js:168`, declaration) |
| `src/village_career.js` | `villageColleagueMemory` (`src/village_career.js:103`, declaration); `recruitMemory` (`src/village_career.js:194`, declaration) |
| `src/work_ledger_system.js` | `observeWorkLedgerCraft` (`src/work_ledger_system.js:119`, declaration) |
| `src/world_completion_bridge.js` | `worldCompletionBridgeFacts` (`src/world_completion_bridge.js:10`, declaration) |
| `src/world_completion_facts.js` | `worldCompletionFacts` (`src/world_completion_facts.js:15`, declaration) |
| `src/world_completion_learning_facts.js` | `worldCompletionLearningFacts` (`src/world_completion_learning_facts.js:92`, declaration); `facts` (`src/world_completion_learning_facts.js:158`, declaration) |
| `src/world_completion_lens_facts.js` | `worldCompletionLensFacts` (`src/world_completion_lens_facts.js:85`, declaration) |
| `src/world_completion_life_facts.js` | `worldCompletionLifeFacts` (`src/world_completion_life_facts.js:26`, declaration); `facts` (`src/world_completion_life_facts.js:59`, declaration) |
| `src/world_completion_life_runtime.js` | `recordWorldCompletionLifeCompletion` (`src/world_completion_life_runtime.js:29`, declaration) |
| `src/world_completion_materials_facts.js` | `worldCompletionMaterialsFacts` (`src/world_completion_materials_facts.js:40`, declaration); `knowledgeRows` (`src/world_completion_materials_facts.js:143`, declaration); `actorFacts` (`src/world_completion_materials_facts.js:146`, declaration) |
| `src/world_instances.js` | `worldInstanceFacts` (`src/world_instances.js:187`, declaration); `knowledge write` (`src/world_instances.js:411`, knowledge write) |

### ER18-I7: AB7 Transaction

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_d/fort.js` | `stageFortAction` (`src/absorb_d/fort.js:49`, declaration) |
| `src/acquisition.js` | `stageAcquisition` (`src/acquisition.js:39`, declaration); `prepareOwnershipPublication` (`src/acquisition.js:68`, declaration); `staged` (`src/acquisition.js:70`, declaration); `writeOwnershipToEnvelope` (`src/acquisition.js:88`, declaration) |
| `src/audit_remainder_combat_objectives_battle.js` | `stagedContext` (`src/audit_remainder_combat_objectives_battle.js:11`, declaration) |
| `src/audit_remainder_state.js` | `stageAuditRemainderEnrollment` (`src/audit_remainder_state.js:43`, declaration) |
| `src/backlog_expansion_body.js` | `stageBodyCommand` (`src/backlog_expansion_body.js:215`, declaration) |
| `src/backlog_expansion_opportunities.js` | `stageOpportunityCommand` (`src/backlog_expansion_opportunities.js:140`, declaration) |
| `src/backlog_expansion_replacement.js` | `stageReplacementCommand` (`src/backlog_expansion_replacement.js:85`, declaration) |
| `src/backlog_expansion_time.js` | `stageLoopPractice` (`src/backlog_expansion_time.js:184`, declaration); `stagePackingRequest` (`src/backlog_expansion_time.js:197`, declaration); `stageTimeCommand` (`src/backlog_expansion_time.js:219`, declaration) |
| `src/backlog_expansion_transit.js` | `stageCarrierTransit` (`src/backlog_expansion_transit.js:384`, declaration); `stageCarrierClock` (`src/backlog_expansion_transit.js:412`, declaration) |
| `src/book_world_mol_native.js` | `stage` (`src/book_world_mol_native.js:127`, declaration) |
| `src/book_world_mol_state.js` | `stageMolVisitRoom` (`src/book_world_mol_state.js:60`, declaration) |
| `src/book_world_paradise_carriers.js` | `stageParadiseCarrierMove` (`src/book_world_paradise_carriers.js:53`, declaration); `stageParadiseCarrierClock` (`src/book_world_paradise_carriers.js:58`, declaration) |
| `src/book_world_paradise_native.js` | `stage` (`src/book_world_paradise_native.js:127`, declaration) |
| `src/book_world_paradise_state.js` | `stageParadiseVisitRoom` (`src/book_world_paradise_state.js:58`, declaration) |
| `src/causal_story_core.js` | `stageCausalClosure` (`src/causal_story_core.js:414`, declaration) |
| `src/causal_story_native.js` | `stage` (`src/causal_story_native.js:386`, declaration) |
| `src/contextual_balm_host.js` | `stageContextualBalmEffectRequest` (`src/contextual_balm_host.js:30`, declaration) |
| `src/display_settings.js` | `durable write site` (`src/display_settings.js:72`, durable write site) |
| `src/expansion_persistence.js` | `persistExpansionPlan` (`src/expansion_persistence.js:7`, declaration); `durable write site` (`src/expansion_persistence.js:49`, durable write site) |
| `src/feature_expansion_destination_native.js` | `stage` (`src/feature_expansion_destination_native.js:101`, declaration) |
| `src/feature_expansion_nested_carriers.js` | `stageNestedCarrierMove` (`src/feature_expansion_nested_carriers.js:54`, declaration); `stageNestedCarrierClock` (`src/feature_expansion_nested_carriers.js:59`, declaration) |
| `src/feature_expansion_nested_host.js` | `stageVisitRoom` (`src/feature_expansion_nested_host.js:26`, declaration) |
| `src/feature_expansion_nested_native.js` | `stage` (`src/feature_expansion_nested_native.js:94`, declaration) |
| `src/feature_expansion_refinements_host.js` | `stages` (`src/feature_expansion_refinements_host.js:57`, declaration) |
| `src/feature_expansion_work_plan.js` | `stage` (`src/feature_expansion_work_plan.js:14`, declaration) |
| `src/gameplay_publication.js` | `readGameplayActor` (`src/gameplay_publication.js:3`, declaration); `prepareGameplayPublication` (`src/gameplay_publication.js:15`, declaration) |
| `src/gameplay_transactions.js` | `applyGameplayEffect` (`src/gameplay_transactions.js:48`, declaration); `writeGameplayToEnvelope` (`src/gameplay_transactions.js:82`, declaration) |
| `src/ink_narrative.js` | `stagedContext` (`src/ink_narrative.js:94`, declaration) |
| `src/main.js` | `commitDurability` (`src/main.js:643`, reviewed supplement); `stageLocalLifeResult` (`src/main.js:716`, declaration); `dispatchLocalLifePlan` (`src/main.js:732`, reviewed supplement); `persistExpansion` (`src/main.js:822`, declaration); `stagedVitals` (`src/main.js:923`, declaration); `commitNativeTrade` (`src/main.js:1020`, reviewed supplement); `commitNativeStorage` (`src/main.js:1044`, reviewed supplement); `durable write site` (`src/main.js:1655`, durable write site); `durable write site` (`src/main.js:1669`, durable write site); `publishWorkLedger` (`src/main.js:2327`, declaration); `durable write site` (`src/main.js:7177`, durable write site) |
| `src/mixture_native.js` | `stageMixtureAction` (`src/mixture_native.js:5`, declaration); `commitMixturePlan` (`src/mixture_native.js:38`, declaration) |
| `src/native_craft_transaction.js` | `beginNativeCraftTransaction` (`src/native_craft_transaction.js:4`, reviewed supplement) |
| `src/native_discovery_feedback.js` | `publish` (`src/native_discovery_feedback.js:54`, declaration) |
| `src/native_equipment_transaction.js` | `prepareNativeEquipment` (`src/native_equipment_transaction.js:12`, reviewed supplement) |
| `src/native_gameplay_adapter.js` | `stageBindings` (`src/native_gameplay_adapter.js:10`, declaration); `publishNativeVitals` (`src/native_gameplay_adapter.js:52`, declaration) |
| `src/native_storage_transaction.js` | `stageNativeStorageTransfer` (`src/native_storage_transaction.js:7`, declaration) |
| `src/native_trade_transaction.js` | `stageNativeTrade` (`src/native_trade_transaction.js:9`, declaration) |
| `src/native_unlock_transaction.js` | `prepareNativeUnlocks` (`src/native_unlock_transaction.js:3`, reviewed supplement) |
| `src/proto23_world_native.js` | `stage` (`src/proto23_world_native.js:153`, declaration) |
| `src/proto23_world_state.js` | `stageProto23VisitRoom` (`src/proto23_world_state.js:129`, declaration) |
| `src/reference_gameplay_state.js` | `stage` (`src/reference_gameplay_state.js:15`, declaration) |
| `src/save_files.js` | `writeGuardedSave` (`src/save_files.js:219`, declaration); `durable write site` (`src/save_files.js:221`, durable write site) |
| `src/simulation_effects.js` | `applySimulationEffects` (`src/simulation_effects.js:174`, declaration); `refundCosts` (`src/simulation_effects.js:389`, declaration) |
| `src/structured_pack_definitions.js` | `stageStructuredNativeObjects` (`src/structured_pack_definitions.js:159`, declaration) |
| `src/workspace_layout.js` | `durable write site` (`src/workspace_layout.js:33`, durable write site); `durable write site` (`src/workspace_layout.js:54`, durable write site); `durable write site` (`src/workspace_layout.js:55`, durable write site); `durable write site` (`src/workspace_layout.js:60`, durable write site) |

### ER18-I8: AB8 Persistence

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_c2/local_life.js` | `normalizeLocalLife` (`src/absorb_c2/local_life.js:15`, declaration) |
| `src/absorb_d/fort.js` | `migrateFortSupply` (`src/absorb_d/fort.js:12`, declaration) |
| `src/absorb_e1/pacing.js` | `normalizePacing` (`src/absorb_e1/pacing.js:20`, declaration) |
| `src/absorb_e3/elemental_affinities.js` | `normalizeElementalOption` (`src/absorb_e3/elemental_affinities.js:22`, declaration) |
| `src/acquisition.js` | `validateOwnership` (`src/acquisition.js:8`, declaration) |
| `src/active_effects.js` | `restoreActiveEffect` (`src/active_effects.js:515`, declaration) |
| `src/agreed_duty_continuation.js` | `validateAgreedDutyContinuationState` (`src/agreed_duty_continuation.js:103`, declaration) |
| `src/agreed_duty_facts.js` | `validateAgreedDutyState` (`src/agreed_duty_facts.js:158`, declaration) |
| `src/audit_remainder_combat_fit_facts.js` | `validateRemainderCombatFit` (`src/audit_remainder_combat_fit_facts.js:135`, declaration); `validateRemainderGripModule` (`src/audit_remainder_combat_fit_facts.js:180`, declaration) |
| `src/audit_remainder_combat_fit_hooks.js` | `validateRemainderCombatFitBattle` (`src/audit_remainder_combat_fit_hooks.js:206`, declaration) |
| `src/audit_remainder_combat_objectives_battle.js` | `validateRemainderCombatObjectivesBattle` (`src/audit_remainder_combat_objectives_battle.js:41`, declaration) |
| `src/audit_remainder_combat_objectives_state.js` | `validateAttemptRoot` (`src/audit_remainder_combat_objectives_state.js:25`, declaration); `validateRemainderCombatObjectives` (`src/audit_remainder_combat_objectives_state.js:55`, declaration); `validateRemainderCombatObjectivesNative` (`src/audit_remainder_combat_objectives_state.js:126`, declaration) |
| `src/audit_remainder_consequences_facts.js` | `validateJobs` (`src/audit_remainder_consequences_facts.js:185`, declaration); `validateRemainderConsequences` (`src/audit_remainder_consequences_facts.js:205`, declaration) |
| `src/audit_remainder_facts.js` | `validateAuditRemainderProjects` (`src/audit_remainder_facts.js:21`, declaration); `validateAuditRemainderNative` (`src/audit_remainder_facts.js:26`, declaration) |
| `src/audit_remainder_home_facts.js` | `validateRemainderHome` (`src/audit_remainder_home_facts.js:153`, declaration) |
| `src/audit_remainder_livelihood_facts.js` | `validateJob` (`src/audit_remainder_livelihood_facts.js:134`, declaration); `validateRemainderLivelihood` (`src/audit_remainder_livelihood_facts.js:146`, declaration) |
| `src/audit_remainder_offers_state.js` | `validateRemainderOffers` (`src/audit_remainder_offers_state.js:63`, declaration) |
| `src/audit_remainder_state.js` | `validateAuditRemainder` (`src/audit_remainder_state.js:53`, declaration) |
| `src/audited_workshop_facts.js` | `validateAuditedWorkshop` (`src/audited_workshop_facts.js:13`, declaration) |
| `src/audited_workshop_fixture.js` | `validateAuditedFixture` (`src/audited_workshop_fixture.js:114`, declaration) |
| `src/audited_workshop_lesson.js` | `validateAuditedLesson` (`src/audited_workshop_lesson.js:174`, declaration) |
| `src/authored_site.js` | `validateDraft` (`src/authored_site.js:60`, declaration) |
| `src/backlog_expansion_body.js` | `validateBodyNativeInventory` (`src/backlog_expansion_body.js:496`, declaration); `validateBodyRecord` (`src/backlog_expansion_body.js:519`, declaration) |
| `src/backlog_expansion_host.js` | `validateBacklogState` (`src/backlog_expansion_host.js:27`, declaration); `validateBacklogEnvelope` (`src/backlog_expansion_host.js:126`, declaration) |
| `src/backlog_expansion_opportunities.js` | `validateKeeper` (`src/backlog_expansion_opportunities.js:267`, declaration); `validateOpportunityRecord` (`src/backlog_expansion_opportunities.js:279`, declaration) |
| `src/backlog_expansion_replacement.js` | `validateReplacementRecord` (`src/backlog_expansion_replacement.js:190`, declaration) |
| `src/backlog_expansion_time.js` | `restorePerson` (`src/backlog_expansion_time.js:112`, declaration); `restoreLoop` (`src/backlog_expansion_time.js:125`, declaration); `validateTimeRecord` (`src/backlog_expansion_time.js:355`, declaration) |
| `src/backlog_expansion_transit.js` | `validateBinding` (`src/backlog_expansion_transit.js:64`, declaration); `validateCarrierTransitRecord` (`src/backlog_expansion_transit.js:447`, declaration) |
| `src/book_care_facts.js` | `validateBookCareState` (`src/book_care_facts.js:81`, declaration) |
| `src/book_care_runtime.js` | `validateBookCareControllerState` (`src/book_care_runtime.js:13`, declaration) |
| `src/book_world_mol_host.js` | `snapshot` (`src/book_world_mol_host.js:22`, declaration) |
| `src/book_world_mol_native.js` | `validateDefinitions` (`src/book_world_mol_native.js:11`, declaration); `encode` (`src/book_world_mol_native.js:23`, declaration); `validateMolNativeMetadata` (`src/book_world_mol_native.js:31`, declaration); `validateMolEnvelope` (`src/book_world_mol_native.js:41`, declaration); `snapshot` (`src/book_world_mol_native.js:148`, declaration); `restore` (`src/book_world_mol_native.js:150`, declaration) |
| `src/book_world_mol_state.js` | `validateMolCampaignState` (`src/book_world_mol_state.js:15`, declaration) |
| `src/book_world_paradise_actions.js` | `validateParadiseHankRouteEvidence` (`src/book_world_paradise_actions.js:255`, declaration) |
| `src/book_world_paradise_campaign_facts.js` | `validateParadiseCampaignDepthState` (`src/book_world_paradise_campaign_facts.js:126`, declaration) |
| `src/book_world_paradise_campaign_runtime.js` | `validateParadiseCampaignDepthControllers` (`src/book_world_paradise_campaign_runtime.js:13`, declaration) |
| `src/book_world_paradise_native.js` | `validateDefinitions` (`src/book_world_paradise_native.js:11`, declaration); `encode` (`src/book_world_paradise_native.js:23`, declaration); `validateParadiseNativeMetadata` (`src/book_world_paradise_native.js:31`, declaration); `validateParadiseEnvelope` (`src/book_world_paradise_native.js:41`, declaration); `snapshot` (`src/book_world_paradise_native.js:148`, declaration); `restore` (`src/book_world_paradise_native.js:150`, declaration) |
| `src/book_world_paradise_state.js` | `validateParadiseCampaignState` (`src/book_world_paradise_state.js:28`, declaration) |
| `src/book_world_player_agency_contracts.js` | `validateSourceIdentity` (`src/book_world_player_agency_contracts.js:37`, declaration); `validateBookWorldAgencyContracts` (`src/book_world_player_agency_contracts.js:111`, declaration) |
| `src/capabilities.js` | `validateCapabilityDefinitions` (`src/capabilities.js:9`, declaration) |
| `src/causal_situations.js` | `validateSituationDefinition` (`src/causal_situations.js:4`, declaration); `validateSituationEffect` (`src/causal_situations.js:11`, declaration); `validateSituations` (`src/causal_situations.js:34`, declaration); `validateKnowledgeBasis` (`src/causal_situations.js:52`, declaration) |
| `src/causal_story_core.js` | `validateSource` (`src/causal_story_core.js:65`, declaration); `validateKnowledge` (`src/causal_story_core.js:79`, declaration); `validateReceipt` (`src/causal_story_core.js:118`, declaration); `validateAccount` (`src/causal_story_core.js:131`, declaration); `validateRestraint` (`src/causal_story_core.js:148`, declaration); `validateCausalStories` (`src/causal_story_core.js:170`, declaration) |
| `src/causal_story_native.js` | `validateControlledPlayerBody` (`src/causal_story_native.js:34`, declaration); `validateCausalStoryNativeMetadata` (`src/causal_story_native.js:133`, declaration); `validateCausalStoryEnvelope` (`src/causal_story_native.js:159`, declaration); `restoreLive` (`src/causal_story_native.js:304`, declaration); `snapshot` (`src/causal_story_native.js:450`, declaration); `restore` (`src/causal_story_native.js:460`, declaration) |
| `src/cheat_cards.js` | `validateCheatCard` (`src/cheat_cards.js:32`, declaration); `validateCheatState` (`src/cheat_cards.js:47`, declaration) |
| `src/chronicle.js` | `validateChronicle` (`src/chronicle.js:12`, declaration); `validateChronicleCalendar` (`src/chronicle.js:93`, declaration) |
| `src/content_packs.js` | `validatePackState` (`src/content_packs.js:10`, declaration); `validatePack` (`src/content_packs.js:55`, declaration); `packSaveState` (`src/content_packs.js:137`, declaration); `preparePackSave` (`src/content_packs.js:152`, declaration) |
| `src/contextual_balm_facts.js` | `validateContextualBalmState` (`src/contextual_balm_facts.js:51`, declaration) |
| `src/cooling_refinement_facts.js` | `validateReceipt` (`src/cooling_refinement_facts.js:80`, declaration); `validateCoolingRefinement` (`src/cooling_refinement_facts.js:110`, declaration); `migrateCoolingRefinementSituation` (`src/cooling_refinement_facts.js:213`, declaration) |
| `src/cooling_refinement_host.js` | `snapshot` (`src/cooling_refinement_host.js:22`, declaration); `validateCoolingRefinementState` (`src/cooling_refinement_host.js:132`, declaration) |
| `src/crush_social_host.js` | `validateCrushSocial` (`src/crush_social_host.js:47`, declaration) |
| `src/customization_profiles.js` | `validatePresentationSettings` (`src/customization_profiles.js:19`, declaration); `validateCustomizationState` (`src/customization_profiles.js:57`, declaration) |
| `src/display_settings.js` | `normalizeDisplaySettings` (`src/display_settings.js:48`, declaration) |
| `src/energy_resources.js` | `validateEnergyPolicy` (`src/energy_resources.js:5`, declaration); `validateEnergyEffect` (`src/energy_resources.js:10`, declaration); `validateEnergyState` (`src/energy_resources.js:46`, declaration) |
| `src/expansion_engine.js` | `validateDomain` (`src/expansion_engine.js:82`, declaration); `validateResource` (`src/expansion_engine.js:95`, declaration); `validateEffects` (`src/expansion_engine.js:101`, declaration); `validateContext` (`src/expansion_engine.js:125`, declaration); `validateBudget` (`src/expansion_engine.js:130`, declaration); `validateExpansionState` (`src/expansion_engine.js:136`, declaration); `migrateExpansionState` (`src/expansion_engine.js:258`, declaration); `loadExpansionState` (`src/expansion_engine.js:267`, declaration); `validateCost` (`src/expansion_engine.js:273`, declaration); `validateRollReceipts` (`src/expansion_engine.js:278`, declaration); `validateRule` (`src/expansion_engine.js:288`, declaration); `validateTransfers` (`src/expansion_engine.js:364`, declaration) |
| `src/factorio_retort_host.js` | `validateFactorioRetortDefinitions` (`src/factorio_retort_host.js:24`, declaration); `validateFactorioRetortAcceptedJob` (`src/factorio_retort_host.js:44`, declaration); `validateFactorioRetortState` (`src/factorio_retort_host.js:62`, declaration); `validateFactorioRetortHeldNative` (`src/factorio_retort_host.js:123`, declaration) |
| `src/factorio_retort_native.js` | `validateFactorioRetortNativeEnvelope` (`src/factorio_retort_native.js:139`, declaration) |
| `src/feature_expansion_destination_host.js` | `validateTidemarkState` (`src/feature_expansion_destination_host.js:18`, declaration) |
| `src/feature_expansion_destination_native.js` | `validateTidemarkNativeMetadata` (`src/feature_expansion_destination_native.js:15`, declaration); `validateTidemarkEnvelope` (`src/feature_expansion_destination_native.js:22`, declaration); `snapshot` (`src/feature_expansion_destination_native.js:121`, declaration); `restore` (`src/feature_expansion_destination_native.js:127`, declaration) |
| `src/feature_expansion_nested_chains_host.js` | `validateNestedChains` (`src/feature_expansion_nested_chains_host.js:87`, declaration) |
| `src/feature_expansion_nested_host.js` | `validateMission` (`src/feature_expansion_nested_host.js:42`, declaration); `validateNestedCampaignState` (`src/feature_expansion_nested_host.js:57`, declaration) |
| `src/feature_expansion_nested_life.js` | `validateNestedLife` (`src/feature_expansion_nested_life.js:151`, declaration) |
| `src/feature_expansion_nested_native.js` | `encode` (`src/feature_expansion_nested_native.js:15`, declaration); `validateNestedNativeMetadata` (`src/feature_expansion_nested_native.js:21`, declaration); `validateNestedEnvelope` (`src/feature_expansion_nested_native.js:30`, declaration); `snapshot` (`src/feature_expansion_nested_native.js:114`, declaration); `restore` (`src/feature_expansion_nested_native.js:116`, declaration) |
| `src/feature_expansion_objects_host.js` | `validateFeatureObjectState` (`src/feature_expansion_objects_host.js:88`, declaration) |
| `src/feature_expansion_reference_desk.js` | `validateReferenceDeskState` (`src/feature_expansion_reference_desk.js:92`, declaration) |
| `src/feature_expansion_subtlety_host.js` | `validateRelayState` (`src/feature_expansion_subtlety_host.js:39`, declaration); `validate` (`src/feature_expansion_subtlety_host.js:78`, declaration) |
| `src/feature_expansion_work_plan.js` | `validateStockPolicy` (`src/feature_expansion_work_plan.js:23`, declaration); `validateStockDefinition` (`src/feature_expansion_work_plan.js:30`, declaration); `validateStep` (`src/feature_expansion_work_plan.js:49`, declaration); `validateWorkPlans` (`src/feature_expansion_work_plan.js:86`, declaration) |
| `src/field_care_facts.js` | `validateFieldCareState` (`src/field_care_facts.js:27`, declaration) |
| `src/foundation_interaction_policy.js` | `validateFoundationDelivery` (`src/foundation_interaction_policy.js:15`, declaration); `validateFoundationInteractionEffect` (`src/foundation_interaction_policy.js:25`, declaration); `validateFoundationInteractionState` (`src/foundation_interaction_policy.js:208`, declaration) |
| `src/game_absorption_assay_facts.js` | `decodeControl` (`src/game_absorption_assay_facts.js:20`, declaration); `validateGameAbsorptionAssay` (`src/game_absorption_assay_facts.js:141`, declaration) |
| `src/gameplay_transactions.js` | `validateGameplaySnapshot` (`src/gameplay_transactions.js:9`, declaration); `validateItemKey` (`src/gameplay_transactions.js:27`, declaration); `validateGameplayEffect` (`src/gameplay_transactions.js:35`, declaration) |
| `src/generated_people.js` | `validateGeneratedPeople` (`src/generated_people.js:29`, declaration) |
| `src/generated_people_ui.js` | `restoreGeneratedPeople` (`src/generated_people_ui.js:4`, declaration) |
| `src/heir_inheritance.js` | `validateHeirLeftovers` (`src/heir_inheritance.js:68`, declaration) |
| `src/home_furnishing_facts.js` | `validateHomeFurnishings` (`src/home_furnishing_facts.js:129`, declaration) |
| `src/ink_narrative.js` | `validateRecord` (`src/ink_narrative.js:141`, declaration); `validateInkNarrative` (`src/ink_narrative.js:179`, declaration) |
| `src/ink_scene_content.js` | `validateNestedInkScope` (`src/ink_scene_content.js:277`, declaration) |
| `src/life_record.js` | `validateLifeRecord` (`src/life_record.js:13`, declaration); `migrateLifeRecord` (`src/life_record.js:75`, declaration) |
| `src/lore_practice_facts.js` | `validateLorePractice` (`src/lore_practice_facts.js:172`, declaration) |
| `src/main.js` | `validateNativeGameplayReferences` (`src/main.js:761`, declaration); `snapshot` (`src/main.js:1507`, declaration); `create_save` (`src/main.js:4982`, declaration); `save_to_localStorage` (`src/main.js:5306`, reviewed supplement); `load(` (`src/main.js:5329`, reviewed supplement); `async load_from_file` (`src/main.js:7117`, reviewed supplement); `load_from_localstorage` (`src/main.js:7136`, reviewed supplement); `restoreStoredSave` (`src/main.js:7159`, declaration); `serialized` (`src/main.js:8378`, declaration) |
| `src/management/validation.js` | `validateManagementState` (`src/management/validation.js:13`, declaration) |
| `src/mixture_state.js` | `validateMixtureState` (`src/mixture_state.js:31`, declaration); `validateProduct` (`src/mixture_state.js:64`, declaration); `validateMixtureEnvelope` (`src/mixture_state.js:84`, declaration); `validateExposure` (`src/mixture_state.js:96`, declaration) |
| `src/native_battle_contracts.js` | `validateNativeBattle` (`src/native_battle_contracts.js:5`, declaration) |
| `src/nethack_fieldcraft_facts.js` | `validateFieldcraftJob` (`src/nethack_fieldcraft_facts.js:13`, declaration); `validateNethackFieldcraft` (`src/nethack_fieldcraft_facts.js:88`, declaration) |
| `src/npc_lives.js` | `validateVillageLives` (`src/npc_lives.js:24`, declaration) |
| `src/observation_channels.js` | `validateObservationChannel` (`src/observation_channels.js:19`, declaration); `validateObservationChannelBinding` (`src/observation_channels.js:38`, declaration); `validateObservationChannelState` (`src/observation_channels.js:45`, declaration); `validateHost` (`src/observation_channels.js:96`, declaration) |
| `src/original_frontier_campaign_ui.js` | `validate` (`src/original_frontier_campaign_ui.js:97`, declaration) |
| `src/pocket_observation.js` | `validatePocketObservation` (`src/pocket_observation.js:92`, declaration) |
| `src/proto23_world_native.js` | `validateDefinitions` (`src/proto23_world_native.js:11`, declaration); `encode` (`src/proto23_world_native.js:23`, declaration); `validatePhysicalOwners` (`src/proto23_world_native.js:34`, declaration); `validateProto23NativeMetadata` (`src/proto23_world_native.js:55`, declaration); `validateProto23Envelope` (`src/proto23_world_native.js:65`, declaration); `snapshot` (`src/proto23_world_native.js:174`, declaration); `restore` (`src/proto23_world_native.js:176`, declaration) |
| `src/proto23_world_state.js` | `validateProto23State` (`src/proto23_world_state.js:19`, declaration) |
| `src/pursuit.js` | `validatePursuitDefinition` (`src/pursuit.js:11`, declaration); `validatePursuitEffect` (`src/pursuit.js:29`, declaration); `validatePursuits` (`src/pursuit.js:33`, declaration) |
| `src/realm_boundary_rules.js` | `validateRealmJson` (`src/realm_boundary_rules.js:9`, declaration); `validateRealmEndpoint` (`src/realm_boundary_rules.js:25`, declaration); `validateRealmCosts` (`src/realm_boundary_rules.js:39`, declaration); `validateRealmBoundaryRule` (`src/realm_boundary_rules.js:46`, declaration); `validateRealmContext` (`src/realm_boundary_rules.js:67`, declaration) |
| `src/realm_cargo.js` | `encode` (`src/realm_cargo.js:42`, declaration); `snapshotMaterial` (`src/realm_cargo.js:58`, declaration); `validateRealmCargoSnapshot` (`src/realm_cargo.js:59`, declaration); `validateRealmCargoConsent` (`src/realm_cargo.js:155`, declaration); `validateRealmCargoPermission` (`src/realm_cargo.js:159`, declaration) |
| `src/realm_clock_leases.js` | `validateLease` (`src/realm_clock_leases.js:22`, declaration); `validateRealmClockLedger` (`src/realm_clock_leases.js:37`, declaration) |
| `src/realm_connections.js` | `validateRealmConnection` (`src/realm_connections.js:12`, declaration); `validateRealmConnectionBinding` (`src/realm_connections.js:57`, declaration) |
| `src/realm_state.js` | `validateRealmState` (`src/realm_state.js:18`, declaration); `validateRealmEnvelope` (`src/realm_state.js:38`, declaration) |
| `src/realm_traveler_profiles.js` | `validateRealmTraveler` (`src/realm_traveler_profiles.js:64`, declaration); `validateRealmTravelerSupport` (`src/realm_traveler_profiles.js:167`, declaration); `validateInputs` (`src/realm_traveler_profiles.js:187`, declaration) |
| `src/reference_gameplay_feats.js` | `validateReferenceFeats` (`src/reference_gameplay_feats.js:45`, declaration) |
| `src/reference_gameplay_host.js` | `validateReferenceGameplayWorkshop` (`src/reference_gameplay_host.js:59`, declaration) |
| `src/reference_gameplay_state.js` | `validateAttempts` (`src/reference_gameplay_state.js:18`, declaration); `validateReferenceGameplay` (`src/reference_gameplay_state.js:43`, declaration) |
| `src/repository_absorption_workplan.js` | `validateItinerary` (`src/repository_absorption_workplan.js:75`, declaration); `validateStockBand` (`src/repository_absorption_workplan.js:86`, declaration) |
| `src/reputation_state.js` | `restoreSavedReputation` (`src/reputation_state.js:6`, declaration) |
| `src/save_compatibility.js` | `prepareFoundationSave` (`src/save_compatibility.js:9`, declaration) |
| `src/save_files.js` | `validateSaveEnvelope` (`src/save_files.js:45`, declaration); `decodeSaveFile` (`src/save_files.js:168`, declaration); `encodeSaveFile` (`src/save_files.js:186`, declaration); `importSaveFile` (`src/save_files.js:196`, declaration); `measureSaveSize` (`src/save_files.js:207`, declaration); `checkSaveSize` (`src/save_files.js:211`, declaration); `writeGuardedSave` (`src/save_files.js:219`, declaration) |
| `src/save_migration.js` | `prepareV06Save` (`src/save_migration.js:3`, declaration) |
| `src/seeded_streams.js` | `validateStreams` (`src/seeded_streams.js:27`, declaration); `validateNativeEncounter` (`src/seeded_streams.js:113`, declaration) |
| `src/simulation_contracts.js` | `validatePredicate` (`src/simulation_contracts.js:28`, declaration); `validateSimulationEffect` (`src/simulation_contracts.js:47`, declaration); `validatePersonDefinition` (`src/simulation_contracts.js:96`, declaration); `validateSimulationState` (`src/simulation_contracts.js:221`, declaration) |
| `src/start_records.js` | `validateStart` (`src/start_records.js:26`, declaration) |
| `src/status_care_facts.js` | `validateStatusCareState` (`src/status_care_facts.js:70`, declaration) |
| `src/steam_absorption_facts.js` | `validateSteamAbsorptionState` (`src/steam_absorption_facts.js:10`, declaration) |
| `src/steam_boh_facts.js` | `validateSteamBOHState` (`src/steam_boh_facts.js:24`, declaration) |
| `src/steam_df_facts.js` | `validateSample` (`src/steam_df_facts.js:22`, declaration); `validateReceipt` (`src/steam_df_facts.js:29`, declaration); `validateSteamDFState` (`src/steam_df_facts.js:46`, declaration) |
| `src/steam_df_runtime.js` | `decodeSteamDFJSON` (`src/steam_df_runtime.js:14`, declaration) |
| `src/steam_lamb_facts.js` | `validateSteamLambState` (`src/steam_lamb_facts.js:20`, declaration) |
| `src/steam_oni_facts.js` | `validateSteamONIState` (`src/steam_oni_facts.js:17`, declaration) |
| `src/storylet_deck.js` | `validateStoryletState` (`src/storylet_deck.js:77`, declaration) |
| `src/structured_container_runtime.js` | `validateContainerDefinition` (`src/structured_container_runtime.js:15`, declaration); `validateContainerEffect` (`src/structured_container_runtime.js:37`, declaration); `validateContainerState` (`src/structured_container_runtime.js:42`, declaration) |
| `src/structured_equipment_runtime.js` | `validateStructuredEquipmentDefinition` (`src/structured_equipment_runtime.js:13`, declaration) |
| `src/structured_pack_definitions.js` | `validateRows` (`src/structured_pack_definitions.js:43`, declaration) |
| `src/structured_pack_runtime.js` | `validateStructuredBootstrap` (`src/structured_pack_runtime.js:6`, declaration) |
| `src/structured_pack_state.js` | `validateStructuredRecord` (`src/structured_pack_state.js:4`, declaration); `validateStructuredSelection` (`src/structured_pack_state.js:15`, declaration); `validateStructuredLifetime` (`src/structured_pack_state.js:19`, declaration); `validateStructuredEnvelope` (`src/structured_pack_state.js:36`, declaration) |
| `src/structured_renewal.js` | `validateStructuredRenewalDefinition` (`src/structured_renewal.js:9`, declaration) |
| `src/techniques.js` | `validateTechniqueDefinitions` (`src/techniques.js:10`, declaration); `validateCues` (`src/techniques.js:23`, declaration); `validateTechniqueEffect` (`src/techniques.js:29`, declaration); `validateTechniqueRecords` (`src/techniques.js:42`, declaration) |
| `src/titles.js` | `normalizeTitles` (`src/titles.js:59`, declaration) |
| `src/village_career.js` | `validateVillageCareer` (`src/village_career.js:14`, declaration); `migrateVillageCareer` (`src/village_career.js:59`, declaration) |
| `src/work_ledger_system.js` | `validateWorkLedgerRulesDraft` (`src/work_ledger_system.js:25`, declaration); `validateWorkLedger` (`src/work_ledger_system.js:53`, declaration); `migrateWorkLedger` (`src/work_ledger_system.js:77`, declaration) |
| `src/workspace_state.js` | `normalizeColumns` (`src/workspace_state.js:6`, declaration); `normalizeLayout` (`src/workspace_state.js:13`, declaration) |
| `src/world_completion_battle_validation.js` | `validateFeatureBattle` (`src/world_completion_battle_validation.js:9`, declaration); `validateReferenceBattleFields` (`src/world_completion_battle_validation.js:43`, declaration) |
| `src/world_completion_causal_job_validation.js` | `validateCausalStoryJob` (`src/world_completion_causal_job_validation.js:9`, declaration) |
| `src/world_completion_facts.js` | `validateWorldCompletionState` (`src/world_completion_facts.js:26`, declaration) |
| `src/world_completion_learning_facts.js` | `decodeWorldCompletionLearningRecord` (`src/world_completion_learning_facts.js:17`, declaration); `validateWorldCompletionLearningState` (`src/world_completion_learning_facts.js:156`, declaration) |
| `src/world_completion_lens_facts.js` | `validateWorldCompletionLensState` (`src/world_completion_lens_facts.js:127`, declaration) |
| `src/world_completion_life_facts.js` | `validateWorldCompletionLifeState` (`src/world_completion_life_facts.js:57`, declaration) |
| `src/world_completion_materials_facts.js` | `validateWorldCompletionMaterialsState` (`src/world_completion_materials_facts.js:139`, declaration) |
| `src/world_completion_native.js` | `validateWorldCompletionNativeEnvelope` (`src/world_completion_native.js:19`, declaration); `validate` (`src/world_completion_native.js:42`, declaration) |
| `src/world_instances.js` | `validateWorldDefinition` (`src/world_instances.js:54`, declaration); `validateWorldEndpoint` (`src/world_instances.js:81`, declaration); `validateWorldInstance` (`src/world_instances.js:97`, declaration); `validateWorldBindings` (`src/world_instances.js:161`, declaration); `validateWorldVisit` (`src/world_instances.js:204`, declaration); `validateWorldRecords` (`src/world_instances.js:215`, declaration) |
| `src/world_rhythm.js` | `validateSchedule` (`src/world_rhythm.js:15`, declaration) |

### ER18-I9: AB9 Manifest/registration

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_c1/accessories.js` | `registerAccessoryItems` (`src/absorb_c1/accessories.js:36`, declaration); `registerAccessoryRecipes` (`src/absorb_c1/accessories.js:46`, declaration) |
| `src/absorb_d/register.js` | `registerFortContent` (`src/absorb_d/register.js:5`, declaration) |
| `src/agreed_duty_content.js` | `agreedDutyDefinitions` (`src/agreed_duty_content.js:97`, content registration/data block); `agreedDutyFollowupDefinitions` (`src/agreed_duty_content.js:121`, content registration/data block) |
| `src/agreed_duty_continuation.js` | `agreedDutyContinuationDefinitions` (`src/agreed_duty_continuation.js:85`, content registration/data block) |
| `src/artifact_workshop_content.js` | `artifactWorkshopDefinitions` (`src/artifact_workshop_content.js:87`, content registration/data block); `registerArtifactWorkshopItems` (`src/artifact_workshop_content.js:118`, declaration) |
| `src/audit_remainder_combat_fit_content.js` | `remainderCombatFitDefinitions` (`src/audit_remainder_combat_fit_content.js:51`, content registration/data block) |
| `src/audit_remainder_combat_objectives_content.js` | `remainderCombatObjectivesFeatDefinitions` (`src/audit_remainder_combat_objectives_content.js:21`, content registration/data block); `remainderCombatObjectivesDefinitions` (`src/audit_remainder_combat_objectives_content.js:82`, content registration/data block) |
| `src/audit_remainder_consequences_content.js` | `remainderConsequencesDefinitions` (`src/audit_remainder_consequences_content.js:195`, content registration/data block) |
| `src/audit_remainder_content.js` | `auditRemainderDefinitions` (`src/audit_remainder_content.js:11`, content registration/data block); `registerAuditRemainderItems` (`src/audit_remainder_content.js:16`, declaration) |
| `src/audit_remainder_home_content.js` | `remainderHomeDefinitions` (`src/audit_remainder_home_content.js:79`, content registration/data block) |
| `src/audit_remainder_host.js` | `lanes` (`src/audit_remainder_host.js:17`, content registration/data block) |
| `src/audit_remainder_livelihood_content.js` | `remainderLivelihoodDefinitions` (`src/audit_remainder_livelihood_content.js:168`, content registration/data block) |
| `src/audit_remainder_offers_content.js` | `remainderOffersDefinitions` (`src/audit_remainder_offers_content.js:38`, content registration/data block) |
| `src/audit_remainder_state.js` | `auditRemainderDefinitions` (`src/audit_remainder_state.js:12`, content registration/data block) |
| `src/audited_kit_reserve_content.js` | `planDefinitions` (`src/audited_kit_reserve_content.js:15`, content registration/data block); `auditedKitReservePlanDefinitions` (`src/audited_kit_reserve_content.js:23`, content registration/data block) |
| `src/audited_workshop_fixture.js` | `auditedFixtureDefinitions` (`src/audited_workshop_fixture.js:45`, content registration/data block) |
| `src/audited_workshop_lesson.js` | `auditedLessonDefinitions` (`src/audited_workshop_lesson.js:40`, content registration/data block) |
| `src/backlog_expansion_body.js` | `bodyItemDefinitions` (`src/backlog_expansion_body.js:25`, content registration/data block); `bodyDefinitions` (`src/backlog_expansion_body.js:41`, content registration/data block) |
| `src/backlog_expansion_content.js` | `backlogSimulationDefinitions` (`src/backlog_expansion_content.js:8`, content registration/data block); `backlogItemDefinitions` (`src/backlog_expansion_content.js:15`, content registration/data block) |
| `src/backlog_expansion_host.js` | `lanes` (`src/backlog_expansion_host.js:12`, content registration/data block) |
| `src/backlog_expansion_opportunities.js` | `opportunityDefinitions` (`src/backlog_expansion_opportunities.js:31`, content registration/data block) |
| `src/backlog_expansion_replacement.js` | `replacementDefinitions` (`src/backlog_expansion_replacement.js:25`, content registration/data block) |
| `src/book_care_content.js` | `bookCareDefinitions` (`src/book_care_content.js:141`, content registration/data block) |
| `src/book_world_mol_content.js` | `molDefinitions` (`src/book_world_mol_content.js:40`, content registration/data block); `registerMolItems` (`src/book_world_mol_content.js:56`, declaration) |
| `src/book_world_mol_native.js` | `register` (`src/book_world_mol_native.js:80`, declaration) |
| `src/book_world_paradise_campaign_content.js` | `paradiseCampaignDefinitions` (`src/book_world_paradise_campaign_content.js:232`, content registration/data block) |
| `src/book_world_paradise_content.js` | `paradiseDefinitions` (`src/book_world_paradise_content.js:32`, content registration/data block); `registerParadiseItems` (`src/book_world_paradise_content.js:42`, declaration) |
| `src/book_world_paradise_native.js` | `register` (`src/book_world_paradise_native.js:80`, declaration) |
| `src/causal_story_actors.js` | `freezeCausalStoryContent` (`src/causal_story_actors.js:6`, content registration/data block) |
| `src/causal_story_content.js` | `causalStoryDefinitions` (`src/causal_story_content.js:231`, content registration/data block) |
| `src/causal_story_ids.js` | `CAUSAL_STORY_DEFINITION_REVISION` (`src/causal_story_ids.js:4`, content registration/data block) |
| `src/causal_story_native.js` | `register` (`src/causal_story_native.js:245`, declaration) |
| `src/content_packs.js` | `registerPack` (`src/content_packs.js:76`, declaration); `loadContentPacks` (`src/content_packs.js:88`, declaration) |
| `src/contextual_balm_content.js` | `CONTEXTUAL_BALM_DEFINITIONS` (`src/contextual_balm_content.js:23`, content registration/data block) |
| `src/cooling_refinement_content.js` | `coolingRefinementDefinitions` (`src/cooling_refinement_content.js:84`, content registration/data block); `COOLING_REFINEMENT_DEFINITION_MAP` (`src/cooling_refinement_content.js:104`, content registration/data block) |
| `src/crafting_recipes.js` | `registerMixtureGathering` (`src/crafting_recipes.js:2121`, declaration) |
| `src/crush_social_content.js` | `crushSocialDefinitions` (`src/crush_social_content.js:33`, content registration/data block) |
| `src/data/pocket_location.js` | `registerPocketLocation` (`src/data/pocket_location.js:6`, declaration) |
| `src/data/start_layers_frontier.js` | `frontierStartWorld` (`src/data/start_layers_frontier.js:2`, reviewed supplement) |
| `src/display_settings.js` | `panelDefinitions` (`src/display_settings.js:35`, content registration/data block); `registerPanelSettings` (`src/display_settings.js:38`, declaration) |
| `src/encounter_content.js` | `encounterDefinitions` (`src/encounter_content.js:26`, content registration/data block) |
| `src/exchange_content.js` | `exchangeDefinitions` (`src/exchange_content.js:16`, content registration/data block) |
| `src/expansion_engine.js` | `createContentRegistry` (`src/expansion_engine.js:303`, declaration); `register` (`src/expansion_engine.js:304`, declaration) |
| `src/expedition_content.js` | `export expeditionRegistry` (`src/expedition_content.js:39`, reviewed supplement) |
| `src/factorio_retort_content.js` | `factorioRetortDefinitions` (`src/factorio_retort_content.js:55`, content registration/data block); `factorioRetortPlanDefinitions` (`src/factorio_retort_content.js:100`, content registration/data block); `registerFactorioRetortItems` (`src/factorio_retort_content.js:104`, declaration) |
| `src/feature_expansion_battle.js` | `featureBattleDefinitions` (`src/feature_expansion_battle.js:35`, content registration/data block) |
| `src/feature_expansion_book_catalogue.js` | `registerBookSubtletyCatalogue` (`src/feature_expansion_book_catalogue.js:12`, declaration) |
| `src/feature_expansion_book_host.js` | `commit(` (`src/feature_expansion_book_host.js:164`, reviewed supplement) |
| `src/feature_expansion_content.js` | `artifactDefinitions` (`src/feature_expansion_content.js:20`, content registration/data block); `featureExpansionDefinitions` (`src/feature_expansion_content.js:26`, content registration/data block) |
| `src/feature_expansion_destination.js` | `TIDEMARK_DEFINITION` (`src/feature_expansion_destination.js:12`, content registration/data block); `tidemarkDefinitions` (`src/feature_expansion_destination.js:24`, content registration/data block) |
| `src/feature_expansion_destination_native.js` | `register` (`src/feature_expansion_destination_native.js:49`, declaration) |
| `src/feature_expansion_nested_chains.js` | `nestedChainItemDefinitions` (`src/feature_expansion_nested_chains.js:247`, content registration/data block); `nestedChainDefinitions` (`src/feature_expansion_nested_chains.js:248`, content registration/data block) |
| `src/feature_expansion_nested_content.js` | `nestedDefinitions` (`src/feature_expansion_nested_content.js:71`, content registration/data block) |
| `src/feature_expansion_nested_life.js` | `nestedLifeDefinitions` (`src/feature_expansion_nested_life.js:82`, content registration/data block) |
| `src/feature_expansion_nested_native.js` | `register` (`src/feature_expansion_nested_native.js:51`, declaration) |
| `src/feature_expansion_objects.js` | `featureObjectDefinitions` (`src/feature_expansion_objects.js:102`, content registration/data block); `registerFeatureObjectItems` (`src/feature_expansion_objects.js:187`, declaration) |
| `src/feature_expansion_powers.js` | `featurePowerDefinitions` (`src/feature_expansion_powers.js:55`, content registration/data block) |
| `src/feature_expansion_reference_desk.js` | `referenceDeskDefinitions` (`src/feature_expansion_reference_desk.js:22`, content registration/data block) |
| `src/feature_expansion_society.js` | `societyDefinitions` (`src/feature_expansion_society.js:65`, content registration/data block) |
| `src/feature_expansion_subtlety_scene.js` | `relayDefinitions` (`src/feature_expansion_subtlety_scene.js:33`, content registration/data block); `registerRelayItems` (`src/feature_expansion_subtlety_scene.js:91`, declaration) |
| `src/field_care_content.js` | `fieldCareDefinitions` (`src/field_care_content.js:13`, content registration/data block) |
| `src/field_workshop.js` | `fieldDefinitions` (`src/field_workshop.js:42`, content registration/data block) |
| `src/foundation_interaction_content.js` | `foundationInteractionDefinitions` (`src/foundation_interaction_content.js:37`, content registration/data block) |
| `src/frontier_campaign.js` | `campaignDefinitions` (`src/frontier_campaign.js:17`, content registration/data block) |
| `src/game_absorption_assay_content.js` | `gameAbsorptionAssayDefinitions` (`src/game_absorption_assay_content.js:52`, content registration/data block); `registerGameAbsorptionAssayItems` (`src/game_absorption_assay_content.js:107`, declaration) |
| `src/generated_people_ui.js` | `registerGeneratedPeople` (`src/generated_people_ui.js:8`, declaration) |
| `src/helper_content.js` | `helperDefinitions` (`src/helper_content.js:9`, content registration/data block) |
| `src/home_furnishing_content.js` | `homeFurnishingDefinitions` (`src/home_furnishing_content.js:67`, content registration/data block) |
| `src/ink_narrative.js` | `INK_CONTENT` (`src/ink_narrative.js:13`, content registration/data block); `INK_CONTENTS` (`src/ink_narrative.js:14`, content registration/data block) |
| `src/ink_scene_content.js` | `inkSceneDefinitions` (`src/ink_scene_content.js:15`, content registration/data block); `inkRelayDefinitions` (`src/ink_scene_content.js:143`, content registration/data block); `inkNestedDefinitions` (`src/ink_scene_content.js:264`, content registration/data block) |
| `src/lore_practice_content.js` | `lorePracticeDefinitions` (`src/lore_practice_content.js:225`, content registration/data block) |
| `src/main.js` | `packDefinitionsForSave` (`src/main.js:308`, content registration/data block); `retiredContent` (`src/main.js:370`, content registration/data block); `registerStructuredNative` (`src/main.js:8142`, declaration) |
| `src/management/content.js` | `managementDefinitions` (`src/management/content.js:8`, content registration/data block) |
| `src/management/foundation.js` | `registerManagementItems` (`src/management/foundation.js:12`, declaration) |
| `src/nethack_fieldcraft_content.js` | `nethackFieldcraftDefinitions` (`src/nethack_fieldcraft_content.js:45`, content registration/data block); `registerNethackFieldcraftItems` (`src/nethack_fieldcraft_content.js:115`, declaration) |
| `src/nethack_fieldcraft_feats.js` | `fieldcraftFeatDefinitions` (`src/nethack_fieldcraft_feats.js:5`, content registration/data block) |
| `src/observation_content.js` | `observationDefinitions` (`src/observation_content.js:13`, content registration/data block) |
| `src/original_frontier_campaign_content.js` | `episodeDefinitions` (`src/original_frontier_campaign_content.js:51`, content registration/data block); `originalFrontierDefinitions` (`src/original_frontier_campaign_content.js:179`, content registration/data block) |
| `src/original_frontier_career_content.js` | `originalFrontierCareerDefinitions` (`src/original_frontier_career_content.js:351`, content registration/data block) |
| `src/original_frontier_field_content.js` | `originalFrontierFieldDefinitions` (`src/original_frontier_field_content.js:321`, content registration/data block) |
| `src/panel_kit.js` | `definePanel` (`src/panel_kit.js:7`, declaration) |
| `src/party_content.js` | `partyDefinitions` (`src/party_content.js:7`, content registration/data block) |
| `src/pocket_observation.js` | `pocketObservationDefinitions` (`src/pocket_observation.js:25`, content registration/data block) |
| `src/pocket_realm_content.js` | `FOLDED_GLASSHOUSE_DEFINITION` (`src/pocket_realm_content.js:34`, content registration/data block) |
| `src/pocket_realm_host.js` | `pocketSimulationDefinitions` (`src/pocket_realm_host.js:49`, content registration/data block) |
| `src/promise_content.js` | `promiseDefinitions` (`src/promise_content.js:17`, content registration/data block) |
| `src/proto23_world_content.js` | `proto23Definitions` (`src/proto23_world_content.js:139`, content registration/data block); `registerProto23Items` (`src/proto23_world_content.js:152`, declaration) |
| `src/proto23_world_native.js` | `register` (`src/proto23_world_native.js:106`, declaration) |
| `src/pursuit_content.js` | `pursuitDefinitions` (`src/pursuit_content.js:6`, content registration/data block) |
| `src/realm_state.js` | `GLASSHOUSE_DEFINITION` (`src/realm_state.js:11`, content registration/data block); `GLASSHOUSE_CONTENT` (`src/realm_state.js:16`, content registration/data block) |
| `src/reference_gameplay_content.js` | `referenceGameplayDefinitions` (`src/reference_gameplay_content.js:42`, content registration/data block); `registerReferenceGameplayItems` (`src/reference_gameplay_content.js:99`, declaration) |
| `src/repository_absorption_content.js` | `repositoryAbsorptionDefinitions` (`src/repository_absorption_content.js:62`, content registration/data block) |
| `src/simulation_content.js` | `simulationDefinitions` (`src/simulation_content.js:58`, content registration/data block) |
| `src/simulation_contracts.js` | `createSimulationRegistry` (`src/simulation_contracts.js:101`, declaration) |
| `src/skill_expansion_content.js` | `skillFamilyDefinitions` (`src/skill_expansion_content.js:71`, content registration/data block); `skillDefinitions` (`src/skill_expansion_content.js:142`, content registration/data block) |
| `src/status_care_content.js` | `statusCareDefinitions` (`src/status_care_content.js:164`, content registration/data block) |
| `src/steam_absorption_content.js` | `steamAbsorptionDefinitions` (`src/steam_absorption_content.js:9`, content registration/data block) |
| `src/steam_boh_content.js` | `steamBOHDefinitions` (`src/steam_boh_content.js:53`, content registration/data block) |
| `src/steam_df_content.js` | `steamDFDefinitions` (`src/steam_df_content.js:36`, content registration/data block) |
| `src/steam_lamb_content.js` | `steamLambDefinitions` (`src/steam_lamb_content.js:41`, content registration/data block) |
| `src/steam_oni_content.js` | `steamONIDefinitions` (`src/steam_oni_content.js:26`, content registration/data block) |
| `src/storylet_content.js` | `storyletDefinitions` (`src/storylet_content.js:75`, content registration/data block) |
| `src/structured_pack_definitions.js` | `compileStructuredPack` (`src/structured_pack_definitions.js:32`, declaration); `mergeStructuredPack` (`src/structured_pack_definitions.js:149`, declaration) |
| `src/structured_pack_state.js` | `requireStructuredSelection` (`src/structured_pack_state.js:23`, declaration); `requireStructuredContent` (`src/structured_pack_state.js:29`, declaration) |
| `src/technique_content.js` | `techniqueDefinitions` (`src/technique_content.js:7`, content registration/data block) |
| `src/workspace_layout.js` | `registerWorkspaceModule` (`src/workspace_layout.js:8`, declaration); `registerExisting` (`src/workspace_layout.js:349`, declaration) |
| `src/world_completion_content.js` | `worldCompletionDefinitions` (`src/world_completion_content.js:9`, content registration/data block) |
| `src/world_completion_host.js` | `lanes` (`src/world_completion_host.js:9`, content registration/data block) |
| `src/world_completion_learning_content.js` | `worldCompletionLearningDefinitions` (`src/world_completion_learning_content.js:54`, content registration/data block) |
| `src/world_completion_lens_content.js` | `worldCompletionLensDefinitions` (`src/world_completion_lens_content.js:60`, content registration/data block) |
| `src/world_completion_life_content.js` | `worldCompletionLifeDefinitions` (`src/world_completion_life_content.js:23`, content registration/data block) |
| `src/world_completion_materials_content.js` | `baseDefinitions` (`src/world_completion_materials_content.js:65`, content registration/data block); `worldCompletionMaterialsDefinitions` (`src/world_completion_materials_content.js:82`, content registration/data block) |
| `src/world_completion_materials_facts.js` | `registered` (`src/world_completion_materials_facts.js:90`, declaration) |

### ER18-I10: AB10 World instance

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/anchor_snapshots.js` | `deriveSnapshot` (`src/anchor_snapshots.js:147`, reviewed supplement) |
| `src/book_world_mol_state.js` | `validateMolCampaignState` (`src/book_world_mol_state.js:15`, reviewed supplement) |
| `src/book_world_paradise_state.js` | `validateParadiseCampaignState` (`src/book_world_paradise_state.js:28`, reviewed supplement) |
| `src/feature_expansion_destination_host.js` | `validateTidemarkState` (`src/feature_expansion_destination_host.js:18`, reviewed supplement) |
| `src/feature_expansion_nested_host.js` | `validateNestedCampaignState` (`src/feature_expansion_nested_host.js:57`, reviewed supplement) |
| `src/proto23_world_state.js` | `validateProto23State` (`src/proto23_world_state.js:19`, reviewed supplement) |
| `src/realm_connections.js` | `createRealmConnection` (`src/realm_connections.js:43`, declaration) |
| `src/realm_state.js` | `validateRealmState` (`src/realm_state.js:18`, reviewed supplement) |
| `src/start_records.js` | `resolveStart` (`src/start_records.js:51`, reviewed supplement) |
| `src/structured_pack_runtime.js` | `planStructuredSelection` (`src/structured_pack_runtime.js:36`, declaration) |
| `src/structured_pack_state.js` | `validateStructuredRecord` (`src/structured_pack_state.js:4`, declaration); `validateStructuredSelection` (`src/structured_pack_state.js:15`, declaration); `validateStructuredLifetime` (`src/structured_pack_state.js:19`, declaration); `requireStructuredSelection` (`src/structured_pack_state.js:23`, declaration) |
| `src/world_instances.js` | `validateWorldDefinition` (`src/world_instances.js:54`, declaration); `validateWorldEndpoint` (`src/world_instances.js:81`, declaration); `validateWorldInstance` (`src/world_instances.js:97`, declaration); `createWorldBindings` (`src/world_instances.js:136`, declaration); `validateWorldBindings` (`src/world_instances.js:161`, declaration); `validateWorldVisit` (`src/world_instances.js:204`, declaration); `validateWorldRecords` (`src/world_instances.js:215`, declaration); `createWorldInstance` (`src/world_instances.js:271`, declaration); `createWorldVisit` (`src/world_instances.js:286`, declaration); `planWorldInstanceUpdate` (`src/world_instances.js:365`, declaration) |
| `src/world_visit_history.js` | `compactEndedWorldVisits` (`src/world_visit_history.js:21`, declaration); `previewWorldVisitRoom` (`src/world_visit_history.js:63`, declaration) |

### ER18-I11: AB11 Carrier/transfer

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/acquisition.js` | `validateOwnership` (`src/acquisition.js:8`, declaration); `recordAcquisitions` (`src/acquisition.js:19`, declaration); `stageAcquisition` (`src/acquisition.js:39`, declaration); `prepareOwnershipPublication` (`src/acquisition.js:68`, declaration); `writeOwnershipToEnvelope` (`src/acquisition.js:88`, declaration) |
| `src/artifact_workshop_content.js` | `transfer` (`src/artifact_workshop_content.js:21`, declaration) |
| `src/audit_remainder_home_content.js` | `transfer` (`src/audit_remainder_home_content.js:36`, declaration) |
| `src/audit_remainder_livelihood_content.js` | `transfer` (`src/audit_remainder_livelihood_content.js:27`, declaration) |
| `src/backlog_expansion_core.js` | `backlogTransfer` (`src/backlog_expansion_core.js:59`, declaration) |
| `src/backlog_expansion_replacement.js` | `replacementCarrierView` (`src/backlog_expansion_replacement.js:181`, declaration) |
| `src/backlog_expansion_transit.js` | `carrierTransitContext` (`src/backlog_expansion_transit.js:145`, reviewed supplement); `buildCarrierTransitSnapshot` (`src/backlog_expansion_transit.js:179`, declaration); `previewCarrierClock` (`src/backlog_expansion_transit.js:245`, declaration); `previewCarrierTransit` (`src/backlog_expansion_transit.js:285`, declaration); `stageCarrierTransit` (`src/backlog_expansion_transit.js:384`, declaration); `stageCarrierClock` (`src/backlog_expansion_transit.js:412`, declaration); `validateCarrierTransitRecord` (`src/backlog_expansion_transit.js:447`, declaration); `summarizeCarrierTransitIntent` (`src/backlog_expansion_transit.js:473`, declaration) |
| `src/book_world_mol_actions.js` | `transfer` (`src/book_world_mol_actions.js:15`, declaration) |
| `src/book_world_paradise_actions.js` | `transfer` (`src/book_world_paradise_actions.js:15`, declaration) |
| `src/book_world_paradise_campaign_content.js` | `transfer` (`src/book_world_paradise_campaign_content.js:22`, declaration) |
| `src/book_world_paradise_carriers.js` | `paradiseCarrierContext` (`src/book_world_paradise_carriers.js:11`, declaration); `previewParadiseCarriers` (`src/book_world_paradise_carriers.js:52`, declaration); `stageParadiseCarrierMove` (`src/book_world_paradise_carriers.js:53`, declaration); `stageParadiseCarrierClock` (`src/book_world_paradise_carriers.js:58`, declaration); `paradiseCarrierKnowledge` (`src/book_world_paradise_carriers.js:66`, declaration); `retainParadiseCarrierReceipt` (`src/book_world_paradise_carriers.js:71`, declaration) |
| `src/chronicle.js` | `createHeirChronicle` (`src/chronicle.js:288`, declaration) |
| `src/data/storage.js` | `bind_storage_transfer` (`src/data/storage.js:10`, declaration); `move_item_to_storage` (`src/data/storage.js:47`, reviewed supplement); `remove_item_from_storage` (`src/data/storage.js:55`, reviewed supplement) |
| `src/exchange_content.js` | `transfer` (`src/exchange_content.js:10`, declaration) |
| `src/expansion_engine.js` | `validateTransfers` (`src/expansion_engine.js:364`, declaration) |
| `src/feature_expansion_battle.js` | `featureFighterOwnership` (`src/feature_expansion_battle.js:149`, declaration) |
| `src/feature_expansion_nested_carriers.js` | `nestedCarrierContext` (`src/feature_expansion_nested_carriers.js:11`, declaration); `previewNestedCarriers` (`src/feature_expansion_nested_carriers.js:53`, declaration); `stageNestedCarrierMove` (`src/feature_expansion_nested_carriers.js:54`, declaration); `stageNestedCarrierClock` (`src/feature_expansion_nested_carriers.js:59`, declaration); `nestedCarrierKnowledge` (`src/feature_expansion_nested_carriers.js:67`, declaration); `retainNestedCarrierReceipt` (`src/feature_expansion_nested_carriers.js:72`, declaration) |
| `src/feature_expansion_nested_life.js` | `transfer` (`src/feature_expansion_nested_life.js:16`, declaration) |
| `src/feature_expansion_society.js` | `transfer` (`src/feature_expansion_society.js:21`, declaration) |
| `src/feature_expansion_subtlety_scene.js` | `transfer` (`src/feature_expansion_subtlety_scene.js:20`, declaration) |
| `src/heir_inheritance.js` | `deriveHeirLeftovers` (`src/heir_inheritance.js:32`, declaration); `validateHeirLeftovers` (`src/heir_inheritance.js:68`, declaration); `applyHeirLeftovers` (`src/heir_inheritance.js:81`, declaration); `heirLeftoverLines` (`src/heir_inheritance.js:98`, declaration) |
| `src/life_experience_host.js` | `buildLifeHeirSave` (`src/life_experience_host.js:11`, declaration) |
| `src/lore_practice_content.js` | `transfer` (`src/lore_practice_content.js:24`, declaration) |
| `src/main.js` | `heirRequest` (`src/main.js:386`, declaration); `acquireSaveOwnership` (`src/main.js:604`, declaration); `observeFortAcquisition` (`src/main.js:703`, declaration); `previewHeir` (`src/main.js:1644`, declaration); `beginHeir` (`src/main.js:1650`, declaration); `completeHeirRequest` (`src/main.js:1658`, declaration); `saveOwnership` (`src/main.js:7940`, declaration) |
| `src/management/shared.js` | `transfer` (`src/management/shared.js:15`, declaration) |
| `src/native_realm_traveler.js` | `nativeCargoSnapshot` (`src/native_realm_traveler.js:3`, declaration); `buildNativePocketCargo` (`src/native_realm_traveler.js:15`, declaration); `previewNativeRealmTraveler` (`src/native_realm_traveler.js:29`, declaration) |
| `src/native_storage_transaction.js` | `stageNativeStorageTransfer` (`src/native_storage_transaction.js:7`, declaration) |
| `src/native_trade_transaction.js` | `stageNativeTrade` (`src/native_trade_transaction.js:9`, reviewed supplement) |
| `src/original_frontier_career_content.js` | `transfer` (`src/original_frontier_career_content.js:20`, declaration) |
| `src/pocket_realm_content.js` | `transfer` (`src/pocket_realm_content.js:14`, declaration) |
| `src/pursuit.js` | `recordPursuitDeparture` (`src/pursuit.js:176`, declaration) |
| `src/realm_cargo.js` | `nativeCargoStockId` (`src/realm_cargo.js:43`, declaration); `realmCargoCustodyBinding` (`src/realm_cargo.js:55`, declaration); `validateRealmCargoSnapshot` (`src/realm_cargo.js:59`, declaration); `buildNativeRealmCargoSnapshot` (`src/realm_cargo.js:97`, declaration); `validateRealmCargoConsent` (`src/realm_cargo.js:155`, declaration); `validateRealmCargoPermission` (`src/realm_cargo.js:159`, declaration); `previewRealmCargoPermission` (`src/realm_cargo.js:171`, declaration); `previewRealmCargoPassage` (`src/realm_cargo.js:187`, declaration) |
| `src/realm_connections.js` | `resolveCargo` (`src/realm_connections.js:91`, declaration); `previewRealmPassage` (`src/realm_connections.js:119`, declaration) |
| `src/realm_traveler_profiles.js` | `validateRealmTraveler` (`src/realm_traveler_profiles.js:64`, declaration); `validateRealmTravelerSupport` (`src/realm_traveler_profiles.js:167`, declaration); `previewRealmTraveler` (`src/realm_traveler_profiles.js:245`, declaration); `planRealmProjection` (`src/realm_traveler_profiles.js:444`, declaration) |
| `src/simulation_effects.js` | `e.type === "transfer"` (`src/simulation_effects.js:265`, reviewed supplement) |
| `src/world_completion_learning_content.js` | `transfer` (`src/world_completion_learning_content.js:27`, declaration) |
| `src/world_instances.js` | `planWorldDeparture` (`src/world_instances.js:347`, declaration) |

### ER18-I12: AB12 World law/config

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_c2/balance.json` | `global config / local balance` (`src/absorb_c2/balance.json:1`, config owner) |
| `src/absorb_e1/pacing.js` | `normalizePacing` (`src/absorb_e1/pacing.js:20`, declaration); `setPacingOption` (`src/absorb_e1/pacing.js:26`, declaration) |
| `src/agreed_duty_content.js` | `AGREED_DUTY_POLICY` (`src/agreed_duty_content.js:31`, rule/config data block) |
| `src/audited_kit_reserve_content.js` | `AUDITED_KIT_RESERVE_POLICY` (`src/audited_kit_reserve_content.js:9`, rule/config data block) |
| `src/backlog_expansion_transit.js` | `kinds` (`src/backlog_expansion_transit.js:20`, reviewed supplement); `laneKinds` (`src/backlog_expansion_transit.js:21`, reviewed supplement) |
| `src/book_care_facts.js` | `BOOK_CARE_POLICY` (`src/book_care_facts.js:13`, rule/config data block) |
| `src/book_world_effects.js` | `MOL_POLICIES` (`src/book_world_effects.js:3`, rule/config data block) |
| `src/book_world_mol_ids.js` | `MOL_FOOTPRINTS` (`src/book_world_mol_ids.js:12`, world/system policy block); `MOL_BASELINE` (`src/book_world_mol_ids.js:13`, world/system policy block) |
| `src/book_world_paradise_campaign_facts.js` | `PARADISE_CAMPAIGN_EFFECT_POLICY` (`src/book_world_paradise_campaign_facts.js:95`, rule/config data block) |
| `src/book_world_paradise_ids.js` | `PARADISE_FOOTPRINTS` (`src/book_world_paradise_ids.js:12`, world/system policy block); `PARADISE_BASELINE` (`src/book_world_paradise_ids.js:16`, world/system policy block) |
| `src/config.js` | `global config / local balance` (`src/config.js:1`, config owner); `config` (`src/config.js:3`, rule/config data block) |
| `src/data/start_layers_frontier.js` | `frontierStartWorld` (`src/data/start_layers_frontier.js:2`, reviewed supplement) |
| `src/feature_expansion_book_situated.js` | `SITUATED_BOOK_RULES` (`src/feature_expansion_book_situated.js:265`, rule/config data block) |
| `src/feature_expansion_nested_content.js` | `NESTED_FOOTPRINTS` (`src/feature_expansion_nested_content.js:28`, world/system policy block) |
| `src/foundation_interaction_policy.js` | `FOUNDATION_INTERACTION_POLICIES` (`src/foundation_interaction_policy.js:10`, rule/config data block) |
| `src/pocket_realm_rules.js` | `createPocketDoorConnection` (`src/pocket_realm_rules.js:4`, reviewed supplement) |
| `src/proto23_world_ids.js` | `PROTO23_FOOTPRINTS` (`src/proto23_world_ids.js:20`, world/system policy block) |
| `src/realm_boundary_rules.js` | `validateRealmBoundaryRule` (`src/realm_boundary_rules.js:46`, declaration); `evaluateRealmBoundary` (`src/realm_boundary_rules.js:103`, declaration) |
| `src/realm_state.js` | `OBSERVATION_CLOCK_POLICY` (`src/realm_state.js:74`, rule/config data block) |
| `src/realm_traveler_profiles.js` | `validateRealmTravelerSupport` (`src/realm_traveler_profiles.js:167`, declaration); `realmTravelerCases` (`src/realm_traveler_profiles.js:464`, reviewed supplement) |
| `src/start_records.js` | `START_MERGE_RULES` (`src/start_records.js:2`, rule/config data block) |
| `src/status_care_facts.js` | `STATUS_CARE_POLICY` (`src/status_care_facts.js:8`, rule/config data block) |
| `src/storylet_deck.js` | `STORYLET_DECKS` (`src/storylet_deck.js:4`, world/system policy block) |
| `src/work_ledger_system.js` | `DEFAULT_RULES` (`src/work_ledger_system.js:9`, rule/config data block) |
| `src/world_completion_lens_content.js` | `WORLD_COMPLETION_LENS_POLICY` (`src/world_completion_lens_content.js:14`, rule/config data block) |
| `src/world_instances.js` | `validateWorldDefinition` (`src/world_instances.js:54`, declaration); `validateWorldInstance` (`src/world_instances.js:97`, reviewed supplement) |
| `src/world_rhythm.js` | `validateSchedule` (`src/world_rhythm.js:15`, declaration) |

### ER18-I13: AB13 Selector/read model

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_b/furniture.js` | `furniturePresentation` (`src/absorb_b/furniture.js:100`, declaration) |
| `src/absorb_c2/local_life.js` | `localLifeView` (`src/absorb_c2/local_life.js:123`, declaration) |
| `src/absorb_c2/panel.js` | `render signature assignment` (`src/absorb_c2/panel.js:12`, render signature assignment) |
| `src/action_legibility.js` | `projectKnownActionRequirements` (`src/action_legibility.js:29`, declaration); `projectActionCosts` (`src/action_legibility.js:111`, declaration); `projectActionLegibility` (`src/action_legibility.js:179`, declaration); `projectSimulationActionLegibility` (`src/action_legibility.js:208`, declaration); `projectAcceptedWorkLegibility` (`src/action_legibility.js:250`, declaration); `projectActionAftermath` (`src/action_legibility.js:265`, declaration); `projectSimulationAftermath` (`src/action_legibility.js:278`, declaration); `projectEssentialRecovery` (`src/action_legibility.js:333`, declaration); `projectRecognitionLegibility` (`src/action_legibility.js:360`, declaration); `projectReplacementLegibility` (`src/action_legibility.js:397`, declaration); `projectSubtletyKnowledgeLegibility` (`src/action_legibility.js:419`, declaration); `projectMissionLegibility` (`src/action_legibility.js:454`, declaration); `projectTropeChainLegibility` (`src/action_legibility.js:489`, declaration); `projectHubCampaignLegibility` (`src/action_legibility.js:506`, declaration) |
| `src/agreed_duty_facts.js` | `agreedDutyFacts` (`src/agreed_duty_facts.js:87`, declaration) |
| `src/agreed_duty_host.js` | `withAgreedDutyFacts` (`src/agreed_duty_host.js:18`, declaration); `agreedDutyPresentation` (`src/agreed_duty_host.js:51`, declaration); `selected` (`src/agreed_duty_host.js:65`, declaration); `agreedDutyPeopleView` (`src/agreed_duty_host.js:140`, declaration) |
| `src/alloy_equipment.js` | `alloyEquipmentFacts` (`src/alloy_equipment.js:10`, declaration) |
| `src/anchor_snapshots.js` | `deriveSnapshot` (`src/anchor_snapshots.js:147`, declaration); `explainFact` (`src/anchor_snapshots.js:160`, reviewed supplement); `deriveIncremental` (`src/anchor_snapshots.js:163`, reviewed supplement); `diffSnapshots` (`src/anchor_snapshots.js:171`, reviewed supplement) |
| `src/artifact_collection.js` | `artifactCollectionView` (`src/artifact_collection.js:145`, declaration) |
| `src/artifact_workshop_host.js` | `artifactWorkshopPresentation` (`src/artifact_workshop_host.js:42`, declaration) |
| `src/audit_remainder_combat_fit_facts.js` | `remainderCombatFitFacts` (`src/audit_remainder_combat_fit_facts.js:105`, declaration); `otherFacts` (`src/audit_remainder_combat_fit_facts.js:143`, declaration) |
| `src/audit_remainder_combat_fit_hooks.js` | `previewRemainderCombatFitAdmission` (`src/audit_remainder_combat_fit_hooks.js:43`, declaration) |
| `src/audit_remainder_combat_fit_host.js` | `remainderCombatFitPresentation` (`src/audit_remainder_combat_fit_host.js:49`, declaration) |
| `src/audit_remainder_combat_objectives_content.js` | `remainderCombatObjectivesFacts` (`src/audit_remainder_combat_objectives_content.js:49`, declaration) |
| `src/audit_remainder_combat_objectives_host.js` | `remainderCombatObjectivesPresentation` (`src/audit_remainder_combat_objectives_host.js:43`, declaration) |
| `src/audit_remainder_consequences_facts.js` | `frontierPresent` (`src/audit_remainder_consequences_facts.js:21`, declaration); `saltPresent` (`src/audit_remainder_consequences_facts.js:22`, declaration); `remainderConsequencesFacts` (`src/audit_remainder_consequences_facts.js:44`, declaration) |
| `src/audit_remainder_consequences_host.js` | `remainderConsequencesPresentation` (`src/audit_remainder_consequences_host.js:66`, declaration); `remainderConsequencesPeopleView` (`src/audit_remainder_consequences_host.js:87`, declaration) |
| `src/audit_remainder_facts.js` | `auditRemainderCombinedFacts` (`src/audit_remainder_facts.js:12`, declaration) |
| `src/audit_remainder_home_facts.js` | `remainderHomeFacts` (`src/audit_remainder_home_facts.js:63`, declaration) |
| `src/audit_remainder_home_host.js` | `remainderHomePresentation` (`src/audit_remainder_home_host.js:26`, declaration) |
| `src/audit_remainder_host.js` | `auditRemainderPresentation` (`src/audit_remainder_host.js:45`, declaration) |
| `src/audit_remainder_livelihood_facts.js` | `remainderLivelihoodFacts` (`src/audit_remainder_livelihood_facts.js:69`, declaration); `selected` (`src/audit_remainder_livelihood_facts.js:225`, declaration); `selected` (`src/audit_remainder_livelihood_facts.js:253`, declaration) |
| `src/audit_remainder_livelihood_host.js` | `remainderLivelihoodPresentation` (`src/audit_remainder_livelihood_host.js:46`, declaration) |
| `src/audit_remainder_offers_host.js` | `remainderOffersPresentation` (`src/audit_remainder_offers_host.js:26`, declaration) |
| `src/audit_remainder_offers_state.js` | `remainderOffersFacts` (`src/audit_remainder_offers_state.js:17`, declaration) |
| `src/audit_remainder_state.js` | `auditRemainderFacts` (`src/audit_remainder_state.js:23`, declaration) |
| `src/audited_kit_reserve_facts.js` | `auditedKitReserveFacts` (`src/audited_kit_reserve_facts.js:19`, declaration) |
| `src/audited_kit_reserve_host.js` | `auditedKitReservePresentation` (`src/audited_kit_reserve_host.js:27`, declaration) |
| `src/audited_workshop_facts.js` | `auditedWorkshopFacts` (`src/audited_workshop_facts.js:7`, declaration) |
| `src/audited_workshop_fixture.js` | `auditedFixtureFacts` (`src/audited_workshop_fixture.js:73`, declaration) |
| `src/audited_workshop_host.js` | `auditedWorkshopPresentation` (`src/audited_workshop_host.js:28`, declaration) |
| `src/audited_workshop_lesson.js` | `auditedLessonFacts` (`src/audited_workshop_lesson.js:121`, declaration) |
| `src/backlog_expansion_body.js` | `bodyView` (`src/backlog_expansion_body.js:599`, declaration) |
| `src/backlog_expansion_host.js` | `previewBacklogAction` (`src/backlog_expansion_host.js:68`, declaration); `backlogView` (`src/backlog_expansion_host.js:101`, declaration) |
| `src/backlog_expansion_opportunities.js` | `opportunityView` (`src/backlog_expansion_opportunities.js:244`, declaration) |
| `src/backlog_expansion_replacement.js` | `replacementView` (`src/backlog_expansion_replacement.js:169`, declaration); `replacementCarrierView` (`src/backlog_expansion_replacement.js:181`, declaration) |
| `src/backlog_expansion_time.js` | `personSnapshot` (`src/backlog_expansion_time.js:105`, declaration); `timeView` (`src/backlog_expansion_time.js:341`, declaration) |
| `src/backlog_expansion_transit.js` | `buildCarrierTransitSnapshot` (`src/backlog_expansion_transit.js:179`, declaration); `previewCarrierClock` (`src/backlog_expansion_transit.js:245`, declaration); `previewCarrierTransit` (`src/backlog_expansion_transit.js:285`, declaration); `selectedException` (`src/backlog_expansion_transit.js:313`, declaration); `carrierTransitView` (`src/backlog_expansion_transit.js:484`, declaration) |
| `src/backlog_expansion_ui.js` | `render signature assignment` (`src/backlog_expansion_ui.js:40`, render signature assignment) |
| `src/body_progression.js` | `bodyFacts` (`src/body_progression.js:65`, declaration) |
| `src/book_care_facts.js` | `bookCareFacts` (`src/book_care_facts.js:44`, declaration); `projectBookCareEffects` (`src/book_care_facts.js:67`, declaration) |
| `src/book_care_host.js` | `bookCarePresentation` (`src/book_care_host.js:35`, declaration) |
| `src/book_world_effects.js` | `projectBookWorldEffects` (`src/book_world_effects.js:7`, declaration) |
| `src/book_world_mol_actions.js` | `molFacts` (`src/book_world_mol_actions.js:110`, declaration) |
| `src/book_world_mol_host.js` | `previewMolCommand` (`src/book_world_mol_host.js:29`, declaration); `previewMolResponse` (`src/book_world_mol_host.js:45`, declaration); `molPresentation` (`src/book_world_mol_host.js:74`, declaration) |
| `src/book_world_mol_state.js` | `previewMolVisitRoom` (`src/book_world_mol_state.js:59`, declaration) |
| `src/book_world_paradise_actions.js` | `paradiseFacts` (`src/book_world_paradise_actions.js:170`, declaration) |
| `src/book_world_paradise_campaign_facts.js` | `paradiseCampaignFacts` (`src/book_world_paradise_campaign_facts.js:24`, declaration); `projectParadiseCampaignEffects` (`src/book_world_paradise_campaign_facts.js:100`, declaration) |
| `src/book_world_paradise_campaign_host.js` | `paradiseCampaignDepthPresentation` (`src/book_world_paradise_campaign_host.js:46`, declaration) |
| `src/book_world_paradise_carriers.js` | `previewParadiseCarriers` (`src/book_world_paradise_carriers.js:52`, declaration) |
| `src/book_world_paradise_host.js` | `previewParadiseCommand` (`src/book_world_paradise_host.js:33`, declaration); `paradisePresentation` (`src/book_world_paradise_host.js:88`, declaration) |
| `src/book_world_paradise_state.js` | `previewParadiseVisitRoom` (`src/book_world_paradise_state.js:57`, declaration) |
| `src/book_world_player_agency_contracts.js` | `inspectHashes` (`src/book_world_player_agency_contracts.js:98`, declaration) |
| `src/capabilities.js` | `queryCapabilities` (`src/capabilities.js:41`, declaration) |
| `src/causal_story_actors.js` | `causalStoryActorFacts` (`src/causal_story_actors.js:84`, declaration) |
| `src/causal_story_content.js` | `causalStoryFacts` (`src/causal_story_content.js:251`, declaration) |
| `src/causal_story_core.js` | `deliveryFacts` (`src/causal_story_core.js:127`, declaration); `ownsFacts` (`src/causal_story_core.js:173`, declaration) |
| `src/causal_story_host.js` | `previewCausalStoryCommand` (`src/causal_story_host.js:114`, declaration); `causalStoryPresentation` (`src/causal_story_host.js:459`, declaration) |
| `src/causal_story_native.js` | `projections` (`src/causal_story_native.js:454`, declaration); `projections` (`src/causal_story_native.js:463`, declaration) |
| `src/causal_story_scenes.js` | `projectVillageScene` (`src/causal_story_scenes.js:63`, declaration) |
| `src/causal_story_ui.js` | `commandPresent` (`src/causal_story_ui.js:30`, declaration); `project` (`src/causal_story_ui.js:144`, declaration) |
| `src/character_bio.js` | `characterBioView` (`src/character_bio.js:12`, declaration) |
| `src/chronicle.js` | `chronicleFacts` (`src/chronicle.js:129`, declaration) |
| `src/chronicle_ui.js` | `render signature assignment` (`src/chronicle_ui.js:69`, render signature assignment) |
| `src/content_pack_ui.js` | `render signature assignment` (`src/content_pack_ui.js:21`, render signature assignment) |
| `src/contextual_balm_facts.js` | `contextualBalmFacts` (`src/contextual_balm_facts.js:23`, declaration); `foreignFacts` (`src/contextual_balm_facts.js:59`, declaration) |
| `src/contextual_balm_host.js` | `contextualBalmPresentation` (`src/contextual_balm_host.js:58`, declaration) |
| `src/cooling_refinement_facts.js` | `ownFacts` (`src/cooling_refinement_facts.js:13`, declaration); `coolingRefinementFacts` (`src/cooling_refinement_facts.js:44`, declaration); `foreignFacts` (`src/cooling_refinement_facts.js:113`, declaration) |
| `src/cooling_refinement_host.js` | `previewCoolingRefinementCommand` (`src/cooling_refinement_host.js:50`, declaration); `coolingRefinementPresentation` (`src/cooling_refinement_host.js:81`, declaration) |
| `src/crush_social_facts.js` | `crushSocialFacts` (`src/crush_social_facts.js:14`, declaration) |
| `src/crush_social_views.js` | `projectActions` (`src/crush_social_views.js:52`, declaration); `crushSocialPresentation` (`src/crush_social_views.js:160`, declaration); `render signature assignment` (`src/crush_social_views.js:221`, render signature assignment); `render signature assignment` (`src/crush_social_views.js:222`, render signature assignment) |
| `src/customization_ui.js` | `select` (`src/customization_ui.js:25`, declaration); `render signature assignment` (`src/customization_ui.js:46`, render signature assignment); `preview` (`src/customization_ui.js:120`, declaration); `render signature assignment` (`src/customization_ui.js:127`, render signature assignment); `render signature assignment` (`src/customization_ui.js:129`, render signature assignment) |
| `src/display.js` | `nativeItemView` (`src/display.js:509`, declaration); `select_item_recipe` (`src/display.js:3036`, declaration) |
| `src/energy_resources.js` | `energyView` (`src/energy_resources.js:57`, declaration) |
| `src/event_feed_ui.js` | `render signature assignment` (`src/event_feed_ui.js:41`, render signature assignment); `render signature assignment` (`src/event_feed_ui.js:42`, render signature assignment) |
| `src/everyday_life.js` | `everydayFacts` (`src/everyday_life.js:49`, declaration) |
| `src/exchange.js` | `exchangeView` (`src/exchange.js:19`, declaration); `exchangeQuestView` (`src/exchange.js:20`, declaration) |
| `src/exchange_ui.js` | `render signature assignment` (`src/exchange_ui.js:18`, render signature assignment) |
| `src/expansion_engine.js` | `inspectCapabilities` (`src/expansion_engine.js:410`, declaration); `previewScenarioRewind` (`src/expansion_engine.js:671`, declaration) |
| `src/expedition_ui.js` | `render signature assignment` (`src/expedition_ui.js:61`, render signature assignment); `render signature assignment` (`src/expedition_ui.js:63`, render signature assignment) |
| `src/factorio_retort_facts.js` | `factorioRetortFacts` (`src/factorio_retort_facts.js:15`, declaration) |
| `src/factorio_retort_host.js` | `ownFacts` (`src/factorio_retort_host.js:65`, declaration); `factorioRetortPresentation` (`src/factorio_retort_host.js:174`, declaration) |
| `src/feature_expansion_battle.js` | `featureBattleFacts` (`src/feature_expansion_battle.js:63`, declaration); `previewFeatureBattleAdmission` (`src/feature_expansion_battle.js:80`, declaration); `previewFeatureBattleAction` (`src/feature_expansion_battle.js:195`, declaration); `featureBattleView` (`src/feature_expansion_battle.js:413`, declaration) |
| `src/feature_expansion_book_cultivation.js` | `isPresent` (`src/feature_expansion_book_cultivation.js:787`, declaration); `selected` (`src/feature_expansion_book_cultivation.js:812`, declaration) |
| `src/feature_expansion_book_host.js` | `qualifiedOfficeSnapshot` (`src/feature_expansion_book_host.js:97`, declaration); `preview` (`src/feature_expansion_book_host.js:168`, declaration) |
| `src/feature_expansion_book_recognition.js` | `bookRecognitionSceneView` (`src/feature_expansion_book_recognition.js:3017`, declaration) |
| `src/feature_expansion_destination_host.js` | `previewTidemarkAction` (`src/feature_expansion_destination_host.js:92`, declaration); `tidemarkView` (`src/feature_expansion_destination_host.js:170`, declaration); `tidemarkPresentation` (`src/feature_expansion_destination_host.js:182`, declaration) |
| `src/feature_expansion_destination_native.js` | `questSnapshot` (`src/feature_expansion_destination_native.js:74`, declaration) |
| `src/feature_expansion_host.js` | `projectFeatureCommands` (`src/feature_expansion_host.js:23`, declaration) |
| `src/feature_expansion_nested_carriers.js` | `previewNestedCarriers` (`src/feature_expansion_nested_carriers.js:53`, declaration) |
| `src/feature_expansion_nested_chains.js` | `nestedChainFacts` (`src/feature_expansion_nested_chains.js:272`, declaration) |
| `src/feature_expansion_nested_chains_host.js` | `previewNestedChainCommand` (`src/feature_expansion_nested_chains_host.js:21`, declaration); `nestedChainPeopleView` (`src/feature_expansion_nested_chains_host.js:48`, declaration); `nestedChainPresentation` (`src/feature_expansion_nested_chains_host.js:60`, declaration) |
| `src/feature_expansion_nested_host.js` | `nestedFacts` (`src/feature_expansion_nested_host.js:115`, declaration); `previewNestedCommand` (`src/feature_expansion_nested_host.js:157`, declaration); `nestedPresentation` (`src/feature_expansion_nested_host.js:291`, declaration) |
| `src/feature_expansion_nested_life.js` | `nestedLifeFacts` (`src/feature_expansion_nested_life.js:86`, declaration); `previewNestedLifeCommand` (`src/feature_expansion_nested_life.js:112`, declaration); `nestedLifePresentation` (`src/feature_expansion_nested_life.js:133`, declaration) |
| `src/feature_expansion_objects_host.js` | `featureObjectFacts` (`src/feature_expansion_objects_host.js:21`, declaration); `previewFeatureObjectCommand` (`src/feature_expansion_objects_host.js:79`, declaration); `featureObjectPresentation` (`src/feature_expansion_objects_host.js:109`, declaration) |
| `src/feature_expansion_powers.js` | `featurePowerFacts` (`src/feature_expansion_powers.js:76`, declaration) |
| `src/feature_expansion_powers_host.js` | `publicFacts` (`src/feature_expansion_powers_host.js:8`, declaration); `featurePowerPresentation` (`src/feature_expansion_powers_host.js:18`, declaration) |
| `src/feature_expansion_recognition_host.js` | `replacementRecognitionPresentation` (`src/feature_expansion_recognition_host.js:30`, declaration) |
| `src/feature_expansion_reference_desk.js` | `referenceDeskFacts` (`src/feature_expansion_reference_desk.js:80`, declaration); `preview` (`src/feature_expansion_reference_desk.js:110`, declaration) |
| `src/feature_expansion_refinements_host.js` | `refinementPresentation` (`src/feature_expansion_refinements_host.js:32`, declaration) |
| `src/feature_expansion_society.js` | `societyFacts` (`src/feature_expansion_society.js:44`, declaration) |
| `src/feature_expansion_society_host.js` | `societyPeopleView` (`src/feature_expansion_society_host.js:45`, declaration); `societyPresentation` (`src/feature_expansion_society_host.js:57`, declaration); `render signature assignment` (`src/feature_expansion_society_host.js:132`, render signature assignment); `render signature assignment` (`src/feature_expansion_society_host.js:133`, render signature assignment) |
| `src/feature_expansion_subtlety_host.js` | `relayFacts` (`src/feature_expansion_subtlety_host.js:18`, declaration); `preview` (`src/feature_expansion_subtlety_host.js:106`, declaration); `relayKnowledgePresentation` (`src/feature_expansion_subtlety_host.js:134`, declaration); `relayPeopleView` (`src/feature_expansion_subtlety_host.js:145`, declaration) |
| `src/feature_expansion_wave_host.js` | `featureWavePresentation` (`src/feature_expansion_wave_host.js:35`, declaration) |
| `src/feature_expansion_work_plan.js` | `workPlanView` (`src/feature_expansion_work_plan.js:331`, declaration) |
| `src/field_care_facts.js` | `fieldCareFacts` (`src/field_care_facts.js:10`, declaration); `projectFieldCareEffects` (`src/field_care_facts.js:21`, declaration) |
| `src/field_care_host.js` | `fieldCarePresentation` (`src/field_care_host.js:32`, declaration) |
| `src/field_ui.js` | `render signature assignment` (`src/field_ui.js:53`, render signature assignment); `render signature assignment` (`src/field_ui.js:54`, render signature assignment) |
| `src/field_workshop.js` | `initializeFieldFacts` (`src/field_workshop.js:103`, declaration); `fieldWorkshopView` (`src/field_workshop.js:112`, declaration); `fieldQuestView` (`src/field_workshop.js:117`, declaration) |
| `src/foundation_interaction_content.js` | `foundationInteractionProbeFacts` (`src/foundation_interaction_content.js:44`, declaration) |
| `src/foundation_interaction_policy.js` | `selector` (`src/foundation_interaction_policy.js:8`, declaration); `supportPresent` (`src/foundation_interaction_policy.js:48`, declaration); `targetPresent` (`src/foundation_interaction_policy.js:62`, declaration); `foundationInteractionView` (`src/foundation_interaction_policy.js:201`, declaration) |
| `src/frontier_campaign.js` | `initializeCampaignFacts` (`src/frontier_campaign.js:69`, declaration); `fieldSupplyQuestView` (`src/frontier_campaign.js:73`, declaration); `previewRivalRematch` (`src/frontier_campaign.js:86`, declaration); `previewFieldRenewal` (`src/frontier_campaign.js:95`, declaration) |
| `src/game_absorption_assay_facts.js` | `gameAbsorptionAssayFacts` (`src/game_absorption_assay_facts.js:106`, declaration) |
| `src/game_absorption_assay_host.js` | `gameAbsorptionAssayPresentation` (`src/game_absorption_assay_host.js:39`, declaration) |
| `src/game_absorption_assay_item_view.js` | `projectGameAbsorptionAssayItemView` (`src/game_absorption_assay_item_view.js:10`, declaration) |
| `src/gameplay_transactions.js` | `validateGameplaySnapshot` (`src/gameplay_transactions.js:9`, declaration) |
| `src/generated_people.js` | `generatedPeopleView` (`src/generated_people.js:62`, declaration) |
| `src/generated_people_ui.js` | `generatedPeopleSnapshot` (`src/generated_people_ui.js:5`, declaration); `render signature assignment` (`src/generated_people_ui.js:36`, render signature assignment) |
| `src/home_furnishing_facts.js` | `homeFurnishingFacts` (`src/home_furnishing_facts.js:104`, declaration); `actorPresent` (`src/home_furnishing_facts.js:131`, declaration); `simPresent` (`src/home_furnishing_facts.js:132`, declaration); `directPresent` (`src/home_furnishing_facts.js:134`, declaration); `worldPresent` (`src/home_furnishing_facts.js:135`, declaration); `foreignPresent` (`src/home_furnishing_facts.js:139`, declaration) |
| `src/home_furnishing_host.js` | `homeFurnishingPresentation` (`src/home_furnishing_host.js:23`, declaration) |
| `src/ink_narrative.js` | `selectedRecord` (`src/ink_narrative.js:199`, declaration); `previewInkNarrativeAction` (`src/ink_narrative.js:312`, declaration); `inkNarrativeView` (`src/ink_narrative.js:338`, declaration) |
| `src/ink_narrative_ui.js` | `projected` (`src/ink_narrative_ui.js:84`, declaration) |
| `src/known_routes.js` | `projectKnownRoutes` (`src/known_routes.js:11`, declaration) |
| `src/known_routes_host.js` | `knownRoutesPresentation` (`src/known_routes_host.js:191`, declaration) |
| `src/life_experience.js` | `lifeExperienceView` (`src/life_experience.js:25`, declaration) |
| `src/life_record.js` | `lifeRecordView` (`src/life_record.js:79`, declaration) |
| `src/life_record_ui.js` | `render signature assignment` (`src/life_record_ui.js:12`, render signature assignment) |
| `src/lore_practice_facts.js` | `lorePracticeFacts` (`src/lore_practice_facts.js:76`, declaration) |
| `src/lore_practice_host.js` | `lorePracticePresentation` (`src/lore_practice_host.js:78`, declaration) |
| `src/main.js` | `render signature assignment` (`src/main.js:532`, render signature assignment); `render signature assignment` (`src/main.js:535`, render signature assignment); `structuredEquipmentView` (`src/main.js:538`, declaration); `gameplaySnapshot` (`src/main.js:613`, declaration); `render signature assignment` (`src/main.js:637`, render signature assignment); `render signature assignment` (`src/main.js:660`, render signature assignment); `render signature assignment` (`src/main.js:755`, render signature assignment); `projectNativePeopleBodies` (`src/main.js:793`, declaration); `calendarSnapshot` (`src/main.js:1230`, declaration); `replacementRecoverySnapshot` (`src/main.js:1482`, declaration); `previewHeir` (`src/main.js:1644`, declaration); `selected_recipe` (`src/main.js:4215`, declaration) |
| `src/management/facts.js` | `unsetActorFacts` (`src/management/facts.js:6`, declaration); `managementFacts` (`src/management/facts.js:9`, declaration) |
| `src/management/host.js` | `managementPresentation` (`src/management/host.js:51`, declaration) |
| `src/misc.js` | `select_outline_class` (`src/misc.js:223`, declaration) |
| `src/mixture_state.js` | `mixturePresentation` (`src/mixture_state.js:75`, declaration) |
| `src/mixture_ui.js` | `selection` (`src/mixture_ui.js:20`, declaration); `preview` (`src/mixture_ui.js:21`, declaration); `render signature assignment` (`src/mixture_ui.js:24`, render signature assignment); `render signature assignment` (`src/mixture_ui.js:26`, render signature assignment) |
| `src/native_equipment_transaction.js` | `nativeEquipmentSnapshot` (`src/native_equipment_transaction.js:5`, declaration) |
| `src/native_realm_traveler.js` | `nativeCargoSnapshot` (`src/native_realm_traveler.js:3`, declaration); `previewNativeRealmTraveler` (`src/native_realm_traveler.js:29`, declaration) |
| `src/nethack_fieldcraft_facts.js` | `nethackFieldcraftFacts` (`src/nethack_fieldcraft_facts.js:45`, declaration) |
| `src/nethack_fieldcraft_host.js` | `nethackFieldcraftPresentation` (`src/nethack_fieldcraft_host.js:24`, declaration) |
| `src/nethack_fieldcraft_item_view.js` | `projectFieldcraftItemView` (`src/nethack_fieldcraft_item_view.js:44`, declaration) |
| `src/npc_lives.js` | `villageLivesView` (`src/npc_lives.js:39`, declaration) |
| `src/npc_lives_ui.js` | `render signature assignment` (`src/npc_lives_ui.js:16`, render signature assignment) |
| `src/observation_channels.js` | `observationReplayView` (`src/observation_channels.js:313`, declaration) |
| `src/observation_content.js` | `observationView` (`src/observation_content.js:61`, declaration) |
| `src/observation_ui.js` | `render signature assignment` (`src/observation_ui.js:16`, render signature assignment) |
| `src/original_frontier_campaign_content.js` | `originalFrontierEpisodeView` (`src/original_frontier_campaign_content.js:184`, declaration); `originalFrontierQuestView` (`src/original_frontier_campaign_content.js:191`, declaration) |
| `src/original_frontier_campaign_host.js` | `originalFrontierCareerQuestView` (`src/original_frontier_campaign_host.js:56`, declaration); `originalFrontierPresentation` (`src/original_frontier_campaign_host.js:80`, declaration) |
| `src/original_frontier_career_content.js` | `originalFrontierCareerView` (`src/original_frontier_career_content.js:369`, declaration) |
| `src/original_frontier_facts.js` | `originalFrontierFacts` (`src/original_frontier_facts.js:7`, declaration) |
| `src/party_battle.js` | `partyBattleView` (`src/party_battle.js:103`, declaration) |
| `src/people_knowledge.js` | `knownPeopleView` (`src/people_knowledge.js:12`, declaration) |
| `src/people_ui.js` | `render signature assignment` (`src/people_ui.js:22`, render signature assignment); `render signature assignment` (`src/people_ui.js:24`, render signature assignment) |
| `src/pocket_observation.js` | `projectedNativeLocation` (`src/pocket_observation.js:134`, declaration); `previewPocketObservationAction` (`src/pocket_observation.js:164`, declaration); `pocketObservationView` (`src/pocket_observation.js:222`, declaration) |
| `src/pocket_realm_host.js` | `previewPocketRealmAction` (`src/pocket_realm_host.js:68`, declaration); `pocketRealmView` (`src/pocket_realm_host.js:125`, declaration) |
| `src/pocket_realm_scenes.js` | `pocketRealmSceneFacts` (`src/pocket_realm_scenes.js:296`, declaration); `pocketRealmSceneView` (`src/pocket_realm_scenes.js:359`, declaration) |
| `src/pocket_realm_ui.js` | `render signature assignment` (`src/pocket_realm_ui.js:15`, render signature assignment) |
| `src/power_models.js` | `previewPowerModel` (`src/power_models.js:5`, declaration) |
| `src/promise_content.js` | `promiseView` (`src/promise_content.js:77`, declaration) |
| `src/promise_ui.js` | `render signature assignment` (`src/promise_ui.js:46`, render signature assignment) |
| `src/proto23_world_actions.js` | `proto23Facts` (`src/proto23_world_actions.js:5`, declaration) |
| `src/proto23_world_host.js` | `previewProto23Command` (`src/proto23_world_host.js:49`, declaration); `proto23Presentation` (`src/proto23_world_host.js:143`, declaration) |
| `src/proto23_world_state.js` | `previewProto23VisitRoom` (`src/proto23_world_state.js:128`, declaration) |
| `src/pursuit.js` | `pursuitView` (`src/pursuit.js:189`, declaration) |
| `src/pursuit_ui.js` | `render signature assignment` (`src/pursuit_ui.js:39`, render signature assignment); `render signature assignment` (`src/pursuit_ui.js:41`, render signature assignment) |
| `src/realm_boundary_rules.js` | `realmBoundaryView` (`src/realm_boundary_rules.js:144`, declaration) |
| `src/realm_cargo.js` | `validateRealmCargoSnapshot` (`src/realm_cargo.js:59`, declaration); `buildNativeRealmCargoSnapshot` (`src/realm_cargo.js:97`, declaration); `previewRealmCargoPermission` (`src/realm_cargo.js:171`, declaration); `previewRealmCargoPassage` (`src/realm_cargo.js:187`, declaration); `selected` (`src/realm_cargo.js:202`, declaration) |
| `src/realm_connections.js` | `selected` (`src/realm_connections.js:95`, declaration); `previewRealmPassage` (`src/realm_connections.js:119`, declaration); `realmConnectionView` (`src/realm_connections.js:238`, declaration) |
| `src/realm_state.js` | `realmFacts` (`src/realm_state.js:52`, declaration) |
| `src/realm_traveler_profiles.js` | `previewRealmTraveler` (`src/realm_traveler_profiles.js:245`, declaration); `realmTravelerView` (`src/realm_traveler_profiles.js:450`, declaration) |
| `src/reference_gameplay_feats.js` | `referenceFeatsPresentation` (`src/reference_gameplay_feats.js:322`, declaration) |
| `src/reference_gameplay_host.js` | `referenceGameplayFacts` (`src/reference_gameplay_host.js:12`, declaration); `previewReferenceGameplayCommand` (`src/reference_gameplay_host.js:52`, declaration); `referenceGameplayPresentation` (`src/reference_gameplay_host.js:84`, declaration) |
| `src/reference_gameplay_state.js` | `referenceControlPresentation` (`src/reference_gameplay_state.js:138`, declaration) |
| `src/repository_absorption_chains.js` | `repositoryMethodChainView` (`src/repository_absorption_chains.js:44`, declaration) |
| `src/repository_absorption_facts.js` | `repositoryAbsorptionFacts` (`src/repository_absorption_facts.js:8`, declaration) |
| `src/repository_absorption_host.js` | `projectionPreviews` (`src/repository_absorption_host.js:77`, declaration); `workViews` (`src/repository_absorption_host.js:87`, declaration); `repositoryAbsorptionPresentation` (`src/repository_absorption_host.js:106`, declaration) |
| `src/repository_absorption_workplan.js` | `previewRepositoryWorkItinerary` (`src/repository_absorption_workplan.js:122`, declaration); `previewRepositoryStockBand` (`src/repository_absorption_workplan.js:202`, declaration) |
| `src/simulation.js` | `previewSimulationCommand` (`src/simulation.js:87`, declaration); `inspectSimulationEvents` (`src/simulation.js:416`, declaration); `previewSimulationResponse` (`src/simulation.js:448`, declaration); `previewCampaignTransition` (`src/simulation.js:564`, declaration); `inspectActorChoices` (`src/simulation.js:628`, declaration) |
| `src/simulation_contracts.js` | `selector` (`src/simulation_contracts.js:39`, declaration); `inspect` (`src/simulation_contracts.js:197`, declaration) |
| `src/simulation_effects.js` | `simulationFacts` (`src/simulation_effects.js:85`, declaration) |
| `src/simulation_ui.js` | `render signature assignment` (`src/simulation_ui.js:80`, render signature assignment); `render signature assignment` (`src/simulation_ui.js:81`, render signature assignment); `render signature assignment` (`src/simulation_ui.js:86`, render signature assignment); `render signature assignment` (`src/simulation_ui.js:88`, render signature assignment) |
| `src/site_projects.js` | `projectView` (`src/site_projects.js:27`, declaration) |
| `src/skill_discovery.js` | `projected` (`src/skill_discovery.js:36`, declaration); `projectDiscoveryFeature` (`src/skill_discovery.js:54`, declaration); `projectNativeSkillDiscovery` (`src/skill_discovery.js:80`, declaration); `projectTechniqueDiscovery` (`src/skill_discovery.js:94`, declaration); `projectAcceptedWork` (`src/skill_discovery.js:107`, declaration); `projectDiscoveryCatalog` (`src/skill_discovery.js:123`, declaration); `projectDiscoveryPanel` (`src/skill_discovery.js:138`, declaration) |
| `src/skill_expansion_content.js` | `skillExpansionFacts` (`src/skill_expansion_content.js:195`, declaration) |
| `src/skill_expansion_host.js` | `publicFacts` (`src/skill_expansion_host.js:10`, declaration); `skillExpansionPresentation` (`src/skill_expansion_host.js:13`, declaration) |
| `src/skill_expansion_ui.js` | `render signature assignment` (`src/skill_expansion_ui.js:33`, render signature assignment) |
| `src/status_care_facts.js` | `statusCareFacts` (`src/status_care_facts.js:33`, declaration); `projectStatusCareEffects` (`src/status_care_facts.js:50`, declaration); `ownFacts` (`src/status_care_facts.js:73`, declaration) |
| `src/status_care_host.js` | `statusCarePresentation` (`src/status_care_host.js:48`, declaration) |
| `src/steam_absorption_facts.js` | `steamAbsorptionFacts` (`src/steam_absorption_facts.js:6`, declaration) |
| `src/steam_absorption_host.js` | `steamAbsorptionPresentation` (`src/steam_absorption_host.js:23`, declaration) |
| `src/steam_boh_facts.js` | `steamBOHFacts` (`src/steam_boh_facts.js:12`, declaration) |
| `src/steam_boh_host.js` | `steamBOHPresentation` (`src/steam_boh_host.js:30`, declaration) |
| `src/steam_df_facts.js` | `steamDFFacts` (`src/steam_df_facts.js:13`, declaration) |
| `src/steam_df_host.js` | `steamDFPresentation` (`src/steam_df_host.js:37`, declaration) |
| `src/steam_lamb_content.js` | `inspect` (`src/steam_lamb_content.js:30`, declaration) |
| `src/steam_lamb_facts.js` | `steamLambFacts` (`src/steam_lamb_facts.js:10`, declaration) |
| `src/steam_lamb_host.js` | `steamLambPresentation` (`src/steam_lamb_host.js:29`, declaration) |
| `src/steam_oni_facts.js` | `steamONIFacts` (`src/steam_oni_facts.js:10`, declaration) |
| `src/steam_oni_host.js` | `steamONIPresentation` (`src/steam_oni_host.js:34`, declaration) |
| `src/steam_oni_runtime.js` | `steamONITrayPresent` (`src/steam_oni_runtime.js:13`, declaration) |
| `src/storylet_deck.js` | `storyletFacts` (`src/storylet_deck.js:24`, declaration) |
| `src/storylet_ui.js` | `render signature assignment` (`src/storylet_ui.js:21`, render signature assignment); `render signature assignment` (`src/storylet_ui.js:22`, render signature assignment) |
| `src/structured_container_runtime.js` | `containerFacts` (`src/structured_container_runtime.js:121`, declaration) |
| `src/structured_equipment_runtime.js` | `projectStructuredEquipment` (`src/structured_equipment_runtime.js:43`, declaration) |
| `src/structured_pack_definitions.js` | `inspect` (`src/structured_pack_definitions.js:119`, declaration) |
| `src/structured_pack_runtime.js` | `selected` (`src/structured_pack_runtime.js:23`, declaration); `structuredCampaignView` (`src/structured_pack_runtime.js:86`, declaration) |
| `src/structured_pack_ui.js` | `projected` (`src/structured_pack_ui.js:12`, declaration); `render signature assignment` (`src/structured_pack_ui.js:50`, render signature assignment) |
| `src/structured_renewal.js` | `previewStructuredRenewal` (`src/structured_renewal.js:23`, declaration) |
| `src/technique_ui.js` | `render signature assignment` (`src/technique_ui.js:68`, render signature assignment); `render signature assignment` (`src/technique_ui.js:70`, render signature assignment) |
| `src/techniques.js` | `techniqueFacts` (`src/techniques.js:85`, declaration) |
| `src/titles.js` | `titleView` (`src/titles.js:106`, declaration) |
| `src/titles_ui.js` | `render signature assignment` (`src/titles_ui.js:14`, render signature assignment) |
| `src/town_content.js` | `townQuestView` (`src/town_content.js:66`, declaration) |
| `src/town_ui.js` | `render signature assignment` (`src/town_ui.js:38`, render signature assignment) |
| `src/village_career.js` | `watchcraftPresentation` (`src/village_career.js:124`, declaration) |
| `src/village_career_ui.js` | `render signature assignment` (`src/village_career_ui.js:14`, render signature assignment) |
| `src/village_ui.js` | `render signature assignment` (`src/village_ui.js:66`, render signature assignment) |
| `src/work_ledger_system.js` | `workLedgerPresentation` (`src/work_ledger_system.js:155`, declaration) |
| `src/work_ledger_ui.js` | `render signature assignment` (`src/work_ledger_ui.js:42`, render signature assignment); `select` (`src/work_ledger_ui.js:75`, declaration) |
| `src/workspace_views.js` | `createWorkspaceViews` (`src/workspace_views.js:6`, declaration); `render signature assignment` (`src/workspace_views.js:42`, render signature assignment); `selects` (`src/workspace_views.js:69`, declaration); `render signature assignment` (`src/workspace_views.js:74`, render signature assignment) |
| `src/world_completion_bridge.js` | `worldCompletionBridgeFacts` (`src/world_completion_bridge.js:10`, declaration) |
| `src/world_completion_facts.js` | `worldCompletionFacts` (`src/world_completion_facts.js:15`, declaration) |
| `src/world_completion_host.js` | `worldCompletionPresentation` (`src/world_completion_host.js:37`, declaration) |
| `src/world_completion_learning_facts.js` | `worldCompletionLearningFacts` (`src/world_completion_learning_facts.js:92`, declaration) |
| `src/world_completion_learning_host.js` | `worldCompletionLearningPresentation` (`src/world_completion_learning_host.js:26`, declaration) |
| `src/world_completion_lens_facts.js` | `worldCompletionLensFacts` (`src/world_completion_lens_facts.js:85`, declaration) |
| `src/world_completion_lens_host.js` | `worldCompletionLensPresentation` (`src/world_completion_lens_host.js:39`, declaration) |
| `src/world_completion_life_facts.js` | `worldCompletionLifeFacts` (`src/world_completion_life_facts.js:26`, declaration) |
| `src/world_completion_life_host.js` | `worldCompletionLifePresentation` (`src/world_completion_life_host.js:27`, declaration) |
| `src/world_completion_materials_facts.js` | `worldCompletionMaterialsFacts` (`src/world_completion_materials_facts.js:40`, declaration); `actorFacts` (`src/world_completion_materials_facts.js:146`, declaration) |
| `src/world_completion_materials_host.js` | `worldCompletionMaterialsPresentation` (`src/world_completion_materials_host.js:50`, declaration) |
| `src/world_completion_people.js` | `worldCompletionPeopleView` (`src/world_completion_people.js:6`, declaration) |
| `src/world_instances.js` | `worldInstanceFacts` (`src/world_instances.js:187`, declaration); `worldInstanceView` (`src/world_instances.js:407`, declaration) |
| `src/world_knowledge.js` | `worldIdentityView` (`src/world_knowledge.js:3`, declaration) |
| `src/world_visit_history.js` | `previewWorldVisitRoom` (`src/world_visit_history.js:63`, declaration) |

### ER18-I14: AB14 Presenter

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_c2/panel.js` | `DOM helper` (`src/absorb_c2/panel.js:2`, declaration); `createLocalLifePanel` (`src/absorb_c2/panel.js:4`, declaration); `render` (`src/absorb_c2/panel.js:9`, declaration) |
| `src/absorb_d/ui.js` | `render` (`src/absorb_d/ui.js:14`, declaration) |
| `src/absorb_e1/panel.js` | `mountPacingPanel` (`src/absorb_e1/panel.js:13`, declaration); `render` (`src/absorb_e1/panel.js:26`, declaration) |
| `src/action_legibility_ui.js` | `DOM helper` (`src/action_legibility_ui.js:2`, declaration); `DOM helper` (`src/action_legibility_ui.js:42`, declaration); `DOM helper` (`src/action_legibility_ui.js:74`, declaration); `DOM helper` (`src/action_legibility_ui.js:102`, declaration); `DOM helper` (`src/action_legibility_ui.js:122`, declaration); `DOM helper` (`src/action_legibility_ui.js:142`, declaration); `renderControls` (`src/action_legibility_ui.js:225`, declaration); `render` (`src/action_legibility_ui.js:259`, declaration); `DOM helper` (`src/action_legibility_ui.js:306`, declaration); `createActionLegibilityPanel` (`src/action_legibility_ui.js:364`, declaration); `render` (`src/action_legibility_ui.js:373`, declaration) |
| `src/adventure_notebook.js` | `render` (`src/adventure_notebook.js:77`, declaration) |
| `src/authored_site_ui.js` | `createAuthoredSiteUI` (`src/authored_site_ui.js:5`, declaration); `DOM helper` (`src/authored_site_ui.js:6`, declaration); `DOM helper` (`src/authored_site_ui.js:45`, declaration); `refresh` (`src/authored_site_ui.js:74`, declaration) |
| `src/backlog_expansion_ui.js` | `DOM helper` (`src/backlog_expansion_ui.js:3`, declaration); `createBacklogExpansionPanel` (`src/backlog_expansion_ui.js:7`, declaration); `render` (`src/backlog_expansion_ui.js:33`, declaration) |
| `src/body_ui.js` | `createBodyPanel` (`src/body_ui.js:4`, declaration); `DOM helper` (`src/body_ui.js:5`, declaration); `render` (`src/body_ui.js:17`, declaration) |
| `src/causal_story_ui.js` | `createCausalStoryUI` (`src/causal_story_ui.js:61`, declaration); `DOM helper` (`src/causal_story_ui.js:68`, declaration); `DOM helper` (`src/causal_story_ui.js:78`, declaration); `DOM helper` (`src/causal_story_ui.js:241`, declaration); `renderAction` (`src/causal_story_ui.js:248`, declaration); `renderProjected` (`src/causal_story_ui.js:263`, declaration); `render` (`src/causal_story_ui.js:316`, declaration) |
| `src/character_bio_ui.js` | `DOM helper` (`src/character_bio_ui.js:4`, declaration); `render` (`src/character_bio_ui.js:14`, declaration) |
| `src/chronicle_ui.js` | `createChroniclePanel` (`src/chronicle_ui.js:6`, declaration); `DOM helper` (`src/chronicle_ui.js:7`, declaration); `render` (`src/chronicle_ui.js:65`, declaration) |
| `src/content_pack_ui.js` | `createContentPackPanel` (`src/content_pack_ui.js:3`, declaration); `DOM helper` (`src/content_pack_ui.js:8`, declaration); `DOM helper` (`src/content_pack_ui.js:10`, declaration); `render` (`src/content_pack_ui.js:18`, declaration) |
| `src/crafting_detail.js` | `renderCraftingDetail` (`src/crafting_detail.js:29`, declaration) |
| `src/crush_social_views.js` | `createCrushSocialPanel` (`src/crush_social_views.js:188`, declaration); `render` (`src/crush_social_views.js:206`, declaration) |
| `src/customization_ui.js` | `createCustomizationUI` (`src/customization_ui.js:6`, declaration); `DOM helper` (`src/customization_ui.js:24`, declaration); `DOM helper` (`src/customization_ui.js:25`, declaration); `DOM helper` (`src/customization_ui.js:26`, declaration); `DOM helper` (`src/customization_ui.js:39`, declaration); `renderPreview` (`src/customization_ui.js:45`, declaration); `render` (`src/customization_ui.js:56`, declaration); `DOM helper` (`src/customization_ui.js:57`, declaration); `DOM helper` (`src/customization_ui.js:116`, declaration); `DOM helper` (`src/customization_ui.js:123`, declaration); `refresh` (`src/customization_ui.js:125`, declaration) |
| `src/display.js` | `log_message` (`src/display.js:863`, reviewed supplement); `update_displayed_trader` (`src/display.js:1198`, declaration); `update_displayed_storage` (`src/display.js:1205`, declaration); `update_displayed_money` (`src/display.js:1211`, declaration); `update_displayed_total_price` (`src/display.js:1215`, declaration); `update_displayed_trader_inventory` (`src/display.js:1474`, declaration); `update_displayed_character_inventory` (`src/display.js:1622`, declaration); `update_displayed_storage_inventory` (`src/display.js:1804`, declaration); `update_displayed_equipment` (`src/display.js:2092`, declaration); `update_fav_display` (`src/display.js:2118`, declaration); `update_displayed_book` (`src/display.js:2128`, declaration); `update_displayed_normal_location` (`src/display.js:2150`, declaration); `update_displayed_combat_location` (`src/display.js:2774`, declaration); `update_displayed_location_types` (`src/display.js:2871`, declaration); `refresh_crafting_detail` (`src/display.js:3099`, declaration); `update_displayed_crafting_recipes` (`src/display.js:3366`, declaration); `update_displayed_crafting_recipe` (`src/display.js:3386`, declaration); `update_displayed_component_choice` (`src/display.js:3597`, declaration); `update_displayed_material_choice` (`src/display.js:3664`, declaration); `update_displayed_health` (`src/display.js:3826`, declaration); `update_displayed_stamina` (`src/display.js:3836`, declaration); `update_displayed_stats` (`src/display.js:3850`, declaration); `update_displayed_effects` (`src/display.js:4113`, declaration); `update_displayed_effect_durations` (`src/display.js:4125`, declaration); `update_displayed_time` (`src/display.js:4137`, declaration); `update_displayed_temperature` (`src/display.js:4145`, declaration); `update_displayed_character_xp` (`src/display.js:4243`, declaration); `update_displayed_xp_bonuses` (`src/display.js:4262`, declaration); `update_displayed_stamina_efficiency` (`src/display.js:4266`, declaration); `update_displayed_reputation` (`src/display.js:4273`, declaration); `update_displayed_item_log` (`src/display.js:4300`, declaration); `update_displayed_dialogue` (`src/display.js:4345`, declaration); `update_displayed_textline_answer` (`src/display.js:4469`, declaration); `update_displayed_ongoing_activity` (`src/display.js:4548`, declaration); `update_displayed_skill_bar` (`src/display.js:4891`, declaration); `update_displayed_skill_level` (`src/display.js:4958`, declaration); `update_displayed_skill_description` (`src/display.js:4975`, declaration); `update_displayed_skill_xp_gain` (`src/display.js:4983`, declaration); `update_all_displayed_skills_xp_gain` (`src/display.js:4997`, declaration); `update_displayed_stance_list` (`src/display.js:5087`, declaration); `update_displayed_stance` (`src/display.js:5203`, declaration); `update_displayed_faved_stances` (`src/display.js:5225`, declaration); `update_displayed_quest` (`src/display.js:5565`, declaration); `update_displayed_quest_task` (`src/display.js:5750`, declaration); `update_displayed_quest_tasks` (`src/display.js:5763`, declaration); `do_background_animation` (`src/display.js:5929`, declaration) |
| `src/display_settings.js` | `mountDisplaySettings` (`src/display_settings.js:83`, declaration); `mountPanels` (`src/display_settings.js:113`, declaration); `render` (`src/display_settings.js:137`, declaration) |
| `src/event_feed_ui.js` | `DOM helper` (`src/event_feed_ui.js:3`, declaration); `render` (`src/event_feed_ui.js:15`, declaration) |
| `src/exchange_ui.js` | `DOM helper` (`src/exchange_ui.js:4`, declaration); `createExchangePanel` (`src/exchange_ui.js:5`, declaration); `render` (`src/exchange_ui.js:13`, declaration) |
| `src/expansion_quest_ui.js` | `render` (`src/expansion_quest_ui.js:20`, declaration) |
| `src/expedition_ui.js` | `createExpeditionPanel` (`src/expedition_ui.js:4`, declaration); `DOM helper` (`src/expedition_ui.js:14`, declaration); `DOM helper` (`src/expedition_ui.js:15`, declaration); `DOM helper` (`src/expedition_ui.js:42`, declaration); `render` (`src/expedition_ui.js:58`, declaration) |
| `src/feature_expansion_nested_ink_ui.js` | `createNestedInkPanels` (`src/feature_expansion_nested_ink_ui.js:8`, declaration); `DOM helper` (`src/feature_expansion_nested_ink_ui.js:9`, declaration); `render` (`src/feature_expansion_nested_ink_ui.js:12`, declaration) |
| `src/feature_expansion_recognition_host.js` | `createReplacementRecognitionPanel` (`src/feature_expansion_recognition_host.js:37`, declaration); `render` (`src/feature_expansion_recognition_host.js:42`, declaration) |
| `src/feature_expansion_society_host.js` | `createSocietyPanel` (`src/feature_expansion_society_host.js:95`, declaration); `render` (`src/feature_expansion_society_host.js:121`, declaration) |
| `src/feature_expansion_ui.js` | `DOM helper` (`src/feature_expansion_ui.js:5`, declaration); `createFeatureExpansionPanel` (`src/feature_expansion_ui.js:11`, declaration); `DOM helper` (`src/feature_expansion_ui.js:12`, declaration); `render` (`src/feature_expansion_ui.js:35`, declaration) |
| `src/field_ui.js` | `DOM helper` (`src/field_ui.js:5`, declaration); `createFieldPanel` (`src/field_ui.js:6`, declaration); `DOM helper` (`src/field_ui.js:12`, declaration); `render` (`src/field_ui.js:24`, declaration) |
| `src/foundation_interaction_ui.js` | `DOM helper` (`src/foundation_interaction_ui.js:4`, declaration); `createFoundationInteractionPanel` (`src/foundation_interaction_ui.js:7`, declaration); `DOM helper` (`src/foundation_interaction_ui.js:16`, declaration); `render` (`src/foundation_interaction_ui.js:17`, declaration) |
| `src/frontier_campaign_ui.js` | `DOM helper` (`src/frontier_campaign_ui.js:4`, declaration); `createFrontierCampaignPanel` (`src/frontier_campaign_ui.js:5`, declaration); `DOM helper` (`src/frontier_campaign_ui.js:13`, declaration); `render` (`src/frontier_campaign_ui.js:26`, declaration) |
| `src/generated_people_ui.js` | `DOM helper` (`src/generated_people_ui.js:6`, declaration); `DOM helper` (`src/generated_people_ui.js:32`, declaration); `render` (`src/generated_people_ui.js:33`, declaration) |
| `src/ink_narrative_ui.js` | `DOM helper` (`src/ink_narrative_ui.js:4`, declaration); `DOM helper` (`src/ink_narrative_ui.js:5`, declaration); `createInkNarrativeUI` (`src/ink_narrative_ui.js:38`, declaration); `DOM helper` (`src/ink_narrative_ui.js:42`, declaration); `render` (`src/ink_narrative_ui.js:99`, declaration) |
| `src/known_routes_ui.js` | `DOM helper` (`src/known_routes_ui.js:3`, declaration); `DOM helper` (`src/known_routes_ui.js:4`, declaration); `createKnownRoutesPanel` (`src/known_routes_ui.js:12`, declaration); `render` (`src/known_routes_ui.js:55`, declaration) |
| `src/life_record_ui.js` | `DOM helper` (`src/life_record_ui.js:2`, declaration); `createLifeRecordPanel` (`src/life_record_ui.js:4`, declaration); `render` (`src/life_record_ui.js:10`, declaration) |
| `src/main.js` | `refreshStatusCareStats` (`src/main.js:531`, declaration); `refreshCausalQuests` (`src/main.js:556`, declaration); `refreshMolQuests` (`src/main.js:563`, declaration); `refreshParadiseQuests` (`src/main.js:570`, declaration); `refreshNestedQuests` (`src/main.js:577`, declaration); `refreshTidemarkQuest` (`src/main.js:584`, declaration); `renderWorldIdentity` (`src/main.js:593`, declaration); `createElementalPanel` (`src/main.js:627`, declaration); `render` (`src/main.js:634`, declaration); `createDurabilityPanel` (`src/main.js:652`, declaration); `render` (`src/main.js:659`, declaration); `createPacingStatusPanel` (`src/main.js:679`, declaration); `render` (`src/main.js:682`, declaration); `createFurniturePanel` (`src/main.js:748`, declaration); `render` (`src/main.js:754`, declaration); `refreshCustomization` (`src/main.js:2299`, declaration); `refresh_titles` (`src/main.js:7785`, declaration) |
| `src/management/ui.js` | `createManagementPanel` (`src/management/ui.js:3`, declaration); `render` (`src/management/ui.js:10`, declaration) |
| `src/mixture_ui.js` | `createMixturePanel` (`src/mixture_ui.js:2`, declaration); `render` (`src/mixture_ui.js:23`, declaration) |
| `src/native_discovery_feedback.js` | `createNativeDiscoveryFeedback` (`src/native_discovery_feedback.js:6`, declaration) |
| `src/npc_lives_ui.js` | `DOM helper` (`src/npc_lives_ui.js:10`, declaration); `createVillageLivesPanel` (`src/npc_lives_ui.js:11`, declaration); `DOM helper` (`src/npc_lives_ui.js:13`, declaration); `render` (`src/npc_lives_ui.js:15`, declaration) |
| `src/observation_ui.js` | `DOM helper` (`src/observation_ui.js:4`, declaration); `createObservationPanel` (`src/observation_ui.js:5`, declaration); `render` (`src/observation_ui.js:13`, declaration) |
| `src/original_frontier_campaign_ui.js` | `DOM helper` (`src/original_frontier_campaign_ui.js:4`, declaration); `DOM helper` (`src/original_frontier_campaign_ui.js:5`, declaration); `createOriginalFrontierPanel` (`src/original_frontier_campaign_ui.js:20`, declaration); `DOM helper` (`src/original_frontier_campaign_ui.js:21`, declaration); `DOM helper` (`src/original_frontier_campaign_ui.js:55`, declaration); `render` (`src/original_frontier_campaign_ui.js:109`, declaration) |
| `src/panel_kit.js` | `definePanel` (`src/panel_kit.js:7`, declaration) |
| `src/particles.js` | `class BackgroundParticle` (`src/particles.js:3`, reviewed supplement) |
| `src/party_ui.js` | `DOM helper` (`src/party_ui.js:6`, declaration); `createPartyPanel` (`src/party_ui.js:7`, declaration); `DOM helper` (`src/party_ui.js:13`, declaration); `render` (`src/party_ui.js:21`, declaration) |
| `src/people_ui.js` | `DOM helper` (`src/people_ui.js:3`, declaration); `render` (`src/people_ui.js:9`, declaration) |
| `src/pocket_realm_ui.js` | `DOM helper` (`src/pocket_realm_ui.js:2`, declaration); `createPocketRealmPanel` (`src/pocket_realm_ui.js:3`, declaration); `render` (`src/pocket_realm_ui.js:10`, declaration) |
| `src/promise_ui.js` | `DOM helper` (`src/promise_ui.js:5`, declaration); `createPromisePanel` (`src/promise_ui.js:7`, declaration); `render` (`src/promise_ui.js:32`, declaration) |
| `src/pursuit_ui.js` | `DOM helper` (`src/pursuit_ui.js:3`, declaration); `createPursuitPanel` (`src/pursuit_ui.js:4`, declaration); `render` (`src/pursuit_ui.js:20`, declaration) |
| `src/quiet_place_detail.js` | `render` (`src/quiet_place_detail.js:13`, declaration) |
| `src/repository_absorption_ui.js` | `DOM helper` (`src/repository_absorption_ui.js:3`, declaration); `DOM helper` (`src/repository_absorption_ui.js:4`, declaration); `createRepositoryAbsorptionPanel` (`src/repository_absorption_ui.js:31`, declaration); `DOM helper` (`src/repository_absorption_ui.js:32`, declaration); `DOM helper` (`src/repository_absorption_ui.js:85`, declaration); `renderNotes` (`src/repository_absorption_ui.js:117`, declaration); `render` (`src/repository_absorption_ui.js:141`, declaration) |
| `src/settled_text_effects.js` | `createSettledTextEffects` (`src/settled_text_effects.js:6`, declaration) |
| `src/simulation_ui.js` | `DOM helper` (`src/simulation_ui.js:5`, declaration); `createSimulationPanel` (`src/simulation_ui.js:6`, declaration); `DOM helper` (`src/simulation_ui.js:16`, declaration); `render` (`src/simulation_ui.js:28`, declaration) |
| `src/skill_expansion_ui.js` | `DOM helper` (`src/skill_expansion_ui.js:2`, declaration); `createSkillExpansionPanel` (`src/skill_expansion_ui.js:3`, declaration); `DOM helper` (`src/skill_expansion_ui.js:10`, declaration); `render` (`src/skill_expansion_ui.js:15`, declaration) |
| `src/start_probe_ui.js` | `createStartProbe` (`src/start_probe_ui.js:3`, reviewed supplement) |
| `src/status_window.js` | `render` (`src/status_window.js:23`, declaration) |
| `src/storylet_ui.js` | `DOM helper` (`src/storylet_ui.js:2`, declaration); `createStoryletPanel` (`src/storylet_ui.js:3`, declaration); `render` (`src/storylet_ui.js:11`, declaration) |
| `src/structured_pack_ui.js` | `createStructuredPackPanel` (`src/structured_pack_ui.js:4`, declaration); `DOM helper` (`src/structured_pack_ui.js:8`, declaration); `DOM helper` (`src/structured_pack_ui.js:19`, declaration); `render` (`src/structured_pack_ui.js:32`, declaration) |
| `src/technique_ui.js` | `createTechniquePanel` (`src/technique_ui.js:6`, declaration); `DOM helper` (`src/technique_ui.js:8`, declaration); `DOM helper` (`src/technique_ui.js:39`, declaration); `render` (`src/technique_ui.js:65`, declaration) |
| `src/titles_ui.js` | `DOM helper` (`src/titles_ui.js:2`, declaration); `createTitlesPanel` (`src/titles_ui.js:7`, declaration); `render` (`src/titles_ui.js:11`, declaration) |
| `src/town_ui.js` | `createTownPanel` (`src/town_ui.js:4`, declaration); `DOM helper` (`src/town_ui.js:5`, declaration); `render` (`src/town_ui.js:31`, declaration) |
| `src/ui/combat_display.js` | `` (`src/ui/combat_display.js:44`, reviewed supplement); `update_displayed_fighters_stats` (`src/ui/combat_display.js:203`, declaration); `update_displayed_health_of_defenders` (`src/ui/combat_display.js:360`, declaration); `update_displayed_health_of_fighter` (`src/ui/combat_display.js:379`, declaration) |
| `src/village_career_ui.js` | `DOM helper` (`src/village_career_ui.js:3`, declaration); `render` (`src/village_career_ui.js:10`, declaration) |
| `src/village_ui.js` | `createVillagePanel` (`src/village_ui.js:5`, declaration); `DOM helper` (`src/village_ui.js:6`, declaration); `render` (`src/village_ui.js:57`, declaration) |
| `src/work_ledger_author_ui.js` | `createWorkLedgerAuthorUI` (`src/work_ledger_author_ui.js:2`, declaration); `DOM helper` (`src/work_ledger_author_ui.js:11`, declaration); `refresh` (`src/work_ledger_author_ui.js:17`, declaration) |
| `src/work_ledger_ui.js` | `createWorkLedgerUI` (`src/work_ledger_ui.js:5`, declaration); `DOM helper` (`src/work_ledger_ui.js:17`, declaration); `render` (`src/work_ledger_ui.js:34`, declaration); `DOM helper` (`src/work_ledger_ui.js:67`, declaration) |
| `src/workspace_layout.js` | `mountWorkspace` (`src/workspace_layout.js:285`, declaration) |
| `src/workspace_views.js` | `createWorkspaceViews` (`src/workspace_views.js:6`, declaration); `render` (`src/workspace_views.js:39`, declaration); `render` (`src/workspace_views.js:73`, declaration) |

### ER18-I15: AB15 Formatter

| READ file | Symbols / sites (line) |
| --- | --- |
| `src/absorb_d/ui.js` | `npcName` (`src/absorb_d/ui.js:5`, declaration) |
| `src/absorb_e1/pacing.js` | `duration` (`src/absorb_e1/pacing.js:57`, declaration) |
| `src/absorb_e1/panel.js` | `inline numeric formatting` (`src/absorb_e1/panel.js:4`, inline numeric formatting); `inline numeric formatting` (`src/absorb_e1/panel.js:6`, inline numeric formatting); `inline numeric formatting` (`src/absorb_e1/panel.js:10`, inline numeric formatting) |
| `src/causal_story_host.js` | `costText` (`src/causal_story_host.js:105`, declaration) |
| `src/causal_story_scenes.js` | `inline numeric formatting` (`src/causal_story_scenes.js:88`, inline numeric formatting) |
| `src/causal_story_ui.js` | `inline numeric formatting` (`src/causal_story_ui.js:9`, inline numeric formatting); `minutes` (`src/causal_story_ui.js:9`, declaration) |
| `src/character_bio.js` | `inline numeric formatting` (`src/character_bio.js:50`, inline numeric formatting) |
| `src/chronicle.js` | `label` (`src/chronicle.js:302`, declaration) |
| `src/chronicle_ui.js` | `inline numeric formatting` (`src/chronicle_ui.js:76`, inline numeric formatting); `inline numeric formatting` (`src/chronicle_ui.js:77`, inline numeric formatting); `inline numeric formatting` (`src/chronicle_ui.js:80`, inline numeric formatting); `inline numeric formatting` (`src/chronicle_ui.js:99`, inline numeric formatting) |
| `src/cooling_refinement_content.js` | `inline numeric formatting` (`src/cooling_refinement_content.js:23`, inline numeric formatting) |
| `src/cooling_refinement_host.js` | `inline numeric formatting` (`src/cooling_refinement_host.js:114`, inline numeric formatting); `inline numeric formatting` (`src/cooling_refinement_host.js:118`, inline numeric formatting) |
| `src/display.js` | `inline numeric formatting` (`src/display.js:426`, inline numeric formatting); `format_book_bonuses` (`src/display.js:1060`, declaration); `inline numeric formatting` (`src/display.js:3855`, inline numeric formatting); `inline numeric formatting` (`src/display.js:3858`, inline numeric formatting); `inline numeric formatting` (`src/display.js:3861`, inline numeric formatting); `inline numeric formatting` (`src/display.js:3864`, inline numeric formatting); `inline numeric formatting` (`src/display.js:3875`, inline numeric formatting); `format_money` (`src/display.js:4217`, declaration) |
| `src/feature_expansion_host.js` | `itemName` (`src/feature_expansion_host.js:7`, declaration); `featureCostText` (`src/feature_expansion_host.js:9`, reviewed supplement) |
| `src/game_time.js` | `Game_Time.prototype.toString` (`src/game_time.js:120`, reviewed supplement); `format_time` (`src/game_time.js:137`, declaration) |
| `src/ink_scene_content.js` | `costText` (`src/ink_scene_content.js:57`, declaration) |
| `src/main.js` | `inline numeric formatting` (`src/main.js:662`, inline numeric formatting) |
| `src/misc.js` | `expo` (`src/misc.js:83`, declaration); `inline numeric formatting` (`src/misc.js:93`, inline numeric formatting); `inline numeric formatting` (`src/misc.js:95`, inline numeric formatting); `inline numeric formatting` (`src/misc.js:97`, inline numeric formatting); `format_reading_time` (`src/misc.js:113`, declaration); `format_working_time` (`src/misc.js:123`, declaration); `rtp` (`src/misc.js:241`, declaration); `get_component_name` (`src/misc.js:350`, declaration) |
| `src/models/skill.js` | `format_skill_rewards` (`src/models/skill.js:417`, declaration) |
| `src/npc_lives_ui.js` | `householdName` (`src/npc_lives_ui.js:8`, declaration) |
| `src/people_ui.js` | `title` (`src/people_ui.js:13`, declaration) |
| `src/settled_text_effects.js` | `formatCoins` (`src/settled_text_effects.js:149`, declaration) |
| `src/status_window.js` | `inline numeric formatting` (`src/status_window.js:30`, inline numeric formatting) |
| `src/titles_ui.js` | `fmt` (`src/titles_ui.js:4`, declaration); `inline numeric formatting` (`src/titles_ui.js:4`, inline numeric formatting) |
