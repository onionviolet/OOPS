# YAIRPG engine expansion

Date: 2026-10-01. First runtime increment implemented; larger architecture remains proposed. Goal: keep the existing RPG playable while making the story, world, probability and run-defining ideas in [Direction synthesis](DIRECTION_SYNTHESIS.md) and [Run-defining advantages](RUN_DEFINING_ADVANTAGES.md) feasible in stages. [PROJECT.md](../PROJECT.md) owns accepted direction.

Current foundation reset, 2026-10-01: the user selected removal of added cultivation gameplay while retaining shared engine/build work. Prototype sources and tests moved to `prototypes/jade-hollow/`; the active build no longer calls the cultivation rules. `src/rules.js` is now used by the new expedition runtime. `src/save_compatibility.js` preserves retired content outside active registries. Earlier claims below about active cultivation integration describe the prior increment, not the current runtime.

## v0.6 migration, 2026-10-01

The runtime now uses the v0.6 development foundation. `main.js` reads `character.getFullStats()` / `getTotalSkillLevel()` and checks `current_combat` for expedition occupancy. `save_files.js` validates old and component save layouts; `save_migration.js` maps existing biographies without recreating the hero; the serializer keeps fork schema1, expansion state and retired content. Player storage is registered as `inventories.storage.player`. Saved parent XP is restored explicitly, and live inheritance reads the owner's progress rather than an absent template field. The [migration record](V06_MIGRATION.md) and [PLAYTEST.md](PLAYTEST.md) own exact evidence and limits. The older source table below is a historical v0.5 audit, not the current file layout.

## Decision

### Native transactions, capabilities and RNG increment, 2026-10-01

Implemented following the user's selection of foundations 1 and 2. New effects can grant items by their complete inventory key, award fixed skill XP, change signed regional reputation, and grant/remove an actor capability source. Item costs are consumed at commitment. Pure gameplay snapshots validate totals and propagate child XP using the existing parent rule. Native item construction and skill calculations are staged before the durable write; skill staging disables dependency registration until publication. Inventory, XP totals, money, reputation, extension state and result receipts share one envelope. Rendering follows publication and never awards effects. Native content references are checked before live/imported pending jobs can proceed.

The player is the live native binding. Multiple actor snapshots have a defined ownership boundary, but native NPC assignment is still future work. XP is an explicitly authored fixed award, without implicit XP bonuses. Native stat/XP milestones are staged and published; milestones that unlock skills, recipes or quests reject before costs because the complete unlock needs its own transaction handler. No equipment replacement, injury or arbitrary legacy reward callback is claimed.

Capabilities combine native providers with earned sources. Definitions declare `max` or `sum` stacking. Providers/grants have explicit requirements; source instances record acquisition time, receipt, and optional expiry, world and definition revision. Duplicate active acquisition does not stack or refresh duration. Expired sources remain saved as provenance but stop contributing. Removal is explicit. Skill, equipment, knowledge, trait, bloodline, technique, condition, world and support are supported source kinds; actual lineage trees, inheritance, awakening, general spell execution and combat passives are not implemented.

Actions can reference independently revisioned weighted roll tables. Preview normalizes weights and applies declared condition/capability chance transfers without drawing. Commitment records each draw, selected result and its effects alongside the main outcome. Completion/reload use that frozen plan, even after table edits; preview/render never consumes RNG. The existing seeded stream now serves both action outcomes and discoveries. There is no global luck multiplier, pity policy or randomized loot-affix generator unless explicitly authored later.

The playable proof replaces the extension kit with a real inventory item, adds a carried reusable rope or Climbing 5 route, gives inspection 12 Perception XP and survey routes 60/50/20 Climbing XP, and permits a 20% Field eye trait discovery that improves later survey odds. Departure grants one Village reputation with its money reward. Kit cancellation forfeits supplies; generic refund/forfeit policies are tested, and cancellation preserves RNG. These are original review proposals. The capability history/provenance UI and weighted odds explain the result.

Expansion schema2 adds actor sources and optional roll/cost/cancellation metadata. Schema1 migrates without replaying payouts; existing kit stock moves once into native inventory in `save_migration.js`. Old pending effects remain frozen and do not retroactively gain XP or discoveries. Unknown schemas/native references block loading/import. New saves require the updated fork. Evidence, including the native availability numeric-to-boolean correction, is in [PLAYTEST.md](PLAYTEST.md).

Persistence follow-up, 2026-10-01: `src/save_files.js` validates file envelopes and UTF-8/legacy text; `src/import_probe.js` tests the actual loader in a disposable non-running frame before replacement. `src/reputation_state.js` preserves saved regional totals while permitting legacy omissions to reconstruct, and `src/clear_state.js` gates restored first-clear rewards on earned counts. Native file checks and seventeen active tests are recorded in PLAYTEST.md. This closes the generated-save file gate, not event transactions or general simulation/replay. [Next event proposal](NEXT_EVENT_PROPOSAL.md) remains provisional.

Shared rules are now exercised through the runtime below. Prior standalone/prototype status is retained in `PROTOTYPE_HISTORY.md`. The rest of this document describes boundaries and larger proposed stages; implementation is only the explicitly listed increment.

Evolve the existing engine through small adapters and extracted modules. Keep its skills, items, crafting, stances, locations and authored content. Start with a saved, conditional expedition event and explanation UI. Do not build an empty universal framework or rewrite all legacy content before delivering that behavior. This architecture preserves opportunities for the broader ideas; it does not guarantee their balance, narrative quality or equal implementation cost.

## Implemented runtime increment

The requested engine expansion now has an actual Village expedition. The first milestone still covers one world; no prestige gameplay or second world is implemented. Names and balance are provisional. Evidence belongs to [PLAYTEST.md](PLAYTEST.md), accepted direction to [PROJECT.md](../PROJECT.md).

| Contract | Source and actual behavior | Limit |
|---|---|---|
| Scoped persistence | `expansion_engine.js`: independently versioned `expansion` namespace; campaign/journey/world/actor/scenario facts, budgets and completion counts; absent legacy namespace gains defaults | Unknown schemas or unsupported live references reject before loader mutation; no silent downgrade. No global character migration or rebirth policy |
| Definitions and preview | Stable IDs, frozen definitions, checked worlds/references/effects/costs/outcomes, contextual facts, eligibility reasons, odds and duration contributors | No general spell language or automatic topology/reachability proof. Explicit tags are authored facts, not a physics model |
| Committed effects | Costs reserved at start; main and weighted-table draws/effects frozen; delayed completion; monotonic sequence and completion counts prevent duplicate grants; declared refund/forfeit cancellation | Fixed inputs. Native content unlocks, equipment/health mutations and arbitrary callbacks need handlers. Cancellation does not rewind RNG or reopen claimed opportunities |
| Durable integration | One envelope contains extension state, real money, owned inventories, XP and signed reputation; native publication/render follow a successful write | Player is the live binding. Web Locks require localhost/HTTPS; older builds ignoring the lock must not run concurrently |
| Scheduler | Integer game minutes, stable same-time order, crossed deadlines, scheduled/available/claimed/expired opportunities; a blocking choice returns unspent requested catch-up | Live content uses nonblocking deadlines. Caller must retain/resume returned catch-up for blocking choices. No offline wall-time replay or ported legacy combat/action timers |
| Actor ownership | One new assignment per actor; independently owned budgets and context; tested two-actor same-time resolution | Live bridge binds only `player`. No NPC controller, actor creation UI, contested shared claim, knowledge-sharing, party or clone mode |
| Isolated rewind | Scenario snapshot, reset preview, retained campaign facts, preserved RNG/sequence/history; checkpoint actions may touch only scenario budgets or campaign facts | Unit-tested only. No live rewind/origin UI. No exporting scenario goods, opportunity rewinds, whole-character rollback or historical branch repair |
| Explainable play | Real kit and reusable rope, learned anchors/strength, fixed skill rewards, earned trait discovery, provenance/stacking, guide condition and money/reputation departure; stable keyboard controls | A small original expedition with provisional balance, not a finished campaign or an implemented bloodline progression path |

New jobs freeze requirements, probabilities, selected result, effects and duration at commitment. Loader reconstruction does not replay payouts. New random draws occur only on accepted commands, not each timer/render. The last 100 receipts are display history; owner completion counts and monotonic command sequence remain outside that bounded history. Unknown schemas retain the original stored file by blocking writes/import rather than inventing a migration.

The bridge advances only while new jobs/opportunities exist; its clock measures supported simulation exposure rather than mirroring the entire upstream calendar. Normal ticks, sleep and travel jumps use the same scheduler. During a pending expedition, native travel/training/actions/reading/sleep/trade cannot start; after completion, native play resumes. Rendering is independent of effect application. This does not port native combat to deterministic simulation.

## Package A playable increment, 2026-10-01

`acquisition.js` stages owned transfers/consumption/grants with complete keys and validates all initial debits before any grants. Traders and storage can bind inventories without a fake levelable actor. `native_trade_transaction.js` stages the complete native quote, both owners, money, market saturation, boosted uncapped Haggling XP, the item log and a saved receipt. Native accept persists once before publication; stale quotes reject for review and write failures preserve live ownership. Existing native quote pricing remains authoritative. Expedition items also use the shared service and report completed acquisitions separately from reserved costs/refunds.

The Village supplier's provisional packing service uses inspection knowledge, six coins and four minutes to provide one survey kit and four Climbing XP. It exercises reservation, reload and exactly-once acquisition. This service requires no native recipe unlock; the existing guard on unsupported native milestone rewards remains. Neither all native crafting nor storage transfers have been converted to transactions. The earlier package table describes the broader remaining contracts, not a claim of their completion.

## Audit coverage and remaining engine work

This map covers every PF family in [Genre sweep](RESEARCH_GENRE_SWEEP.md) plus the cross-cutting rival, origin and idle-game audits. **Foundation** means the new primitives can hold and execute a bounded authored example. It never means that family's complete gameplay already exists.

| Audit family | Foundation now available | Further mechanics required |
|---|---|---|
| PF01 Martial/cultivation | Scoped resources, earned facts, conditional milestones, native fixed XP/stat milestones | Techniques, breakthrough/reset policies, new stat/resource handlers |
| PF02 Learned magic | Knowledge predicates, prep costs, contextual odds/duration | Formula execution, spell effects and compatibility |
| PF03 Professions/classes | Demonstration receipts, access facts, owned progression, real skill rewards | Credential services, loadouts, specializations and native content-unlock handlers |
| PF04 Beast bonding | Actor budgets/status facts, per-actor assignments | Recruitment/bond model, partner roles and targetable allies |
| PF05 Summoned patterns | Knowledge versus prepared resources, timed commitments | Pattern registry, deployment/capacity and dismissal rules |
| PF06 Riders | Actor/world capability conditions | Coupled traversal, mount control, equipment and combat |
| PF07 Habitats/ecology | Scoped stocks, fixed-input timed batches | Capacity/care policies, population state and sustainable yields |
| PF08 Body evolution | Acquired capability facts and explained requirements | Physiology, equipment fit, movement and combat changes |
| PF09 Necromancy | Owned command budgets and per-actor jobs | Control/permission rules, unit roster, targeting and upkeep |
| PF10 Constructs | Reserved inputs, frozen output plans and scheduler | Controller policies, targets, stop rules and legacy production adapter |
| PF11 Cards/runes | Knowledge facts and explicit resource budgets | Prepared slots, stacking/compatibility and effect execution |
| PF12 Internal spaces | Scenario/world scoped facts and budgets | Configuration graph, adjacency and construction rules |
| PF13 Evolving relics | Persistent provenance, preparation costs and complete native item keys | Item evolution/mutation, equipment publication and maintenance |
| PF14 Pacts/oaths | Scoped permissions, obligations as facts, deadlines | Contract lifecycle, authored failure/exit effects and observer information |
| PF15 Support/healing | Graded outcomes and saved guide condition affecting later play | Health/injury transactions, objective protection and party combat |
| PF16 Investigation/stealth | Known/unknown facts, gated information and later consequences | Evidence ownership, NPC beliefs, concealment and detection |
| PF17 Academies/mentors | Receipts, scheduled opportunities and actor budgets | Curriculum, teacher access and facility capacity |
| PF18 Sects/guilds | World/actor state, separate learner-owned jobs | Delegation, institutional services, faction obligations and controllers |
| PF19 Merchant/logistics | Actual money adapter, reserved supplies and timed rewards | Inventory transfers, contracts, regional economy and anti-arbitrage policies |
| PF20 Farm/home | World stocks, project costs and delayed outputs | Facilities, actual farming/crafting integration and civic services |
| PF21 Dungeon core | Site/scenario facts, owned resources and scheduled work | Room topology, residents, visitor policy and simulation |
| PF22 Apocalypse/frontier | Authored timed phases and preserved campaign state | World transition policy, hazards, shelter and NPC reaction |
| PF23 Survival/magitech | Knowledge/tool versus strength routes and real costs | Fuel, durability, equipment capability and repair adapters |
| PF24 Loops/legacy | Isolated checkpoint preview/rewind and retained knowledge | Live origin UI, explicit rebirth retention and dependent-history repair |
| PF25 Domains/world laws | World-local facts, conditions and modifiers | Environmental rules, conflicting sources, stacking and actual weather effects |
| PF26 Ocean/sky/world travel | World registry/context, requirements and owned budgets | Travel transition API, vehicles/crew, import conversion and second-world gameplay |
| Rivals/young-master chains | Persistent scoped consequences, authored later actions | Stable NPC roster, motivated escalation, evidence, adaptation and closure |
| Chosen identities/theft/fate | Separate facts/budgets and committed odds | Atomic donor/recipient transfer, unique claims, belief versus capability, inherited duties |
| Enemy protagonists/clones | Tested actor isolation and ordered assignments | Shared opportunity arbitration, independent policies, goals, knowledge sharing and performance measurement |
| Origins/system/vessel/archive | Knowledge access, input/output plans, scenario boundary | Origin policy interface, UI, slot/capacity, allocation and retention rules |
| Idle automation/offline | Deterministic new-system advance API and explicit safe-choice boundary | Stock targets, exhaustion/stop summaries, clock-change handling, retained catch-up and legacy timer ports |

The native item/XP/reputation, capability and weighted-discovery requirements are partly covered by the later increment described above; broader mechanics remain future work. Develop one real helper, then a contrasting obstacle/world; extract handlers from those requirements. A general ability engine, institutional simulator and historical rollback are materially larger additions, not content files alone.

## Next shared work packages, requested 2026-10-01

The user requested broader groundwork scoped from the prior audits, explicitly including items in shops. This section owns the proposed engineering scope; PROJECT.md records the steering and current next gate. The priority order is a proposal. It does not select every audited power, book setting, actor roster or simulation mode. The first expansion milestone remains one realm and one prestige layer.

Current source was rechecked after the transaction/capability increment. The five packages below group the audits by the shared behavior they require, rather than creating a separate engine for each genre family.

| Package / proposed order | Audit coverage it opens | Concrete groundwork still needed | First observable proof |
|---|---|---|---|
| **A. Item acquisition and ownership** | PF03 professions, PF11 prepared objects, PF13 relics, PF19 trade/logistics, PF23 repair/survival; the idle audit's supply-chain loop | Separate inventory owners from levelable actors; preview a quote, reserve exact item keys, transfer stock and money, record acquisition and commit all relevant domains together. Shared entry points for shops, recipes, drops, caches and storage. New offer definitions validate native references, conditions and quantities | Buy or craft the same useful preparation; vendor stock/player money/owned items/discovery records agree after failure and reload. A purchase opens an actual expedition route |
| **B. Knowledge, unlocks and executable effects** | PF01 martial/cultivation, PF02 magic, PF03 classes, PF08 body changes, PF11 cards, PF15 support, PF17 mentors, PF25 world influences; learned/acquired/inherited distinctions | Found/understood/practiced progress; transactional skill/recipe/quest access; declared slots, fuel, charges, cooldowns and compatible targets. Add health/equipment/stat/combat effect handlers only for selected applications. Bloodline/trait development uses explicit acquisition, activation, growth and retention rules | A purchased/recovered lesson or earned trait changes one usable action. Its necessary goal also has a trained/tool alternative. Crossing a native unlock milestone succeeds once and reload does not re-award it |
| **C. Persistent actors, relationships and claims** | PF04 bonding, PF05 summons, PF06 mounts, PF09 controlled units, PF14 pacts, PF16 evidence, PF18 institutions; rivals, enemy protagonists, identities and clones | Bind one real NPC to saved state and capabilities; separate story life/injury from combat cleanup. Directed relationships/evidence, authored goals, assignments and exclusive claims; later transfers remove donor rights and grant recipient rights atomically | One helper has a meaningful skill/condition and one assignment; one person can remember an outcome and react later. Two claimants cannot both receive a unique reward |
| **D. Jobs, facilities and bounded automation** | PF07 habitats, PF10 constructs, PF12 internal spaces, PF18 institutions, PF20 homes, PF21 managed dungeons; idle planning and off-screen preparation | Port one native job to the existing scheduler; finite inputs/capacity, stop/reclaim policies, stock targets and completion summaries. Choose a common clock adapter before cross-system deadlines. Wall-time catch-up is a later explicit policy with safe boundaries | One workshop/site job consumes declared inputs, stops at its target or fuel shortage, releases committed capacity correctly and resumes after reload; direct execution and catch-up match for supported work |
| **E. Worlds, campaign transitions and origins** | PF22 frontier phases, PF24 loops/legacy, PF26 travel; world campaigns and the five run-defining advantage families | Separate travel, ascension and rebirth plans. Declare retained knowledge/sources/ownership, reset state, local fuel/permissions and incompatible imported capabilities. Use isolated checkpoints before dependent-history rollback. Inheritance or a new body requires an explicit ownership/retention policy | One prestige layer previews losses/retention and applies once. Later, a second world changes one decision while an old-world discovery remains useful; no duplicated cargo, claims or sources |

These packages compose. A bought bloodline reagent uses A's item/offer ownership, B's source acquisition and execution rules, C if another actor transfers it, and E for retention. An evolving weapon starts with A's item identity and B's effects; a summoned workshop helper combines C's actor/assignment and D's capacity. None of those combinations is already complete because its labels fit the source vocabulary.

### Shop and crafting source fit

| Existing source | Verified current behavior | Scope implication |
|---|---|---|
| `src/data/inventory_templates.js`, `src/models/trade_item.js` | TradeItemGroup/TradeItem express conditions, availability chance, count and quality ranges; Village uses Basic stock | Ordinary supplies are authorable now. Validate zero chance/ranges/references for future offers; `data.chance || 1` currently treats authored zero as one. This source finding is scoped follow-up, not a repaired RNG contract |
| `src/components/trader_component.js`, `src/trade.js` | Native refresh generates stock using Math.random; prices depend on margin, Haggling and reputation; acceptance sequentially changes money, inventory, market saturation and XP | Keep the native shop UI, but its whole transaction still needs a staged adapter. Quotes must revalidate at acceptance and account for saturation/rounding; a stale basket must not buy missing stock |
| `src/main.js` save/load | Component inventories include trader stock; NPC records include last_refresh | Preserve existing stocks until the scheduled refresh. Future refresh draws/quantities/quality must be saved before offers are exposed; reopening must not act as a new lottery |
| `src/crafting_recipes.js`, `src/main.js/use_recipe` | Existing stations, skills, material lists, success/quality and XP; native crafting applies callbacks and fresh draws directly | Reuse recipes and skills. First stage one fixed-input recipe with saved result and native unlock handling; whole crafting/equipment conversion is a later port |
| `src/gameplay_transactions.js`, `src/gameplay_publication.js`, `src/models/hero.js` | New snapshots stage the player; publication bypasses native acquisition-log callbacks. Hero's native inventory entry point logs acquisition | A shared acquisition service must stage the discovery log and applicable quest events, not call reward side effects after saving. Traders/chests need inventory bindings without fictitious skills or reputation |

Package A should begin with **a Village supply chain**, using the existing expedition. In this scoping pass the real shop now stocks three Prepared survey kits and one Survey rope per Basic refresh. Base values are 2/4, making initial Village purchase prices 8/16 at its starting margin of four, consistent with the journal service. Native Haggling/reputation pricing remains useful; the journal stays a fixed-price preparation service for the early adventure. Resale follows native lower base value rather than returning the full preparation-service price. These values are provisional tuning.

The existing Coil of rope has base value400 and retains its ID, value and stock. The new Survey rope is explicitly a lightweight crossing line. Do not silently alias them or erase old items; expand each item's supported capability when its actual use is authored. Existing saved merchant stock receives the new offers at its next normal refresh, without refilling purchased stock on load. The content proof adds no new persistence schema and does not convert native trade to the new transaction path.

The next bounded A increment should join one vendor and the player in one committed quote/transfer, then add one preparation recipe using verified ordinary materials or a paid craft service. It should also record acquisition once, reject unavailable quantities and stale quotes, preserve quality-specific keys, and survive a failed save with both inventories and money unchanged. Package B's unlock handler is a dependency if that chosen recipe or XP milestone opens native content. No extra material roster, rare shop catalogue or factory is selected by this scope.

Mutable relics/rolled affixes will require a stable instance or variant record carrying rolled properties, charges/binding and provenance across inventory, equipment, storage and sale. Current id/component/quality keys preserve existing items, but the native decoder does not implement arbitrary affix fields. Keep ordinary stackable goods simple; add instance ownership only when an authored mutable object needs it.

### RNG and authoring requirements across packages

The saved weighted-event machinery can express discoveries now. Future shop stock needs an explicit merchant/refresh epoch or independent stream so opening a shop cannot perturb future expedition rolls; quantities and quality belong to the recorded refresh result. Loot/affix rolls need persisted item identity, and bloodline awakening needs a declared cost/result/retention policy. Luck modifies declared tables or actions; its possession does not automatically change every native Math.random call. A pity counter is optional per design and would need its own renewal/reset policy.

Each authored definition should identify its world/owner, stable ID/revision, acquisition route, requirements, exact costs, result/effects, repeat/stock policy, explanation and source provenance. Validate item/skill/recipe/source references and supported effect handlers before play. Provide deterministic access to required campaign capabilities; rare outcomes can add optional advantages or alternate paths. Keep the strength of deliberately exceptional advantages visible instead of assuming every power is a small stat modifier.

Acceptance for every package includes read-only preview, input/result agreement, reload during work, no duplicated first-time rewards, missing-reference rejection and a visible explanation of what enabled or blocked the action. Deferred packages remain proposed until a rebuilt playable slice exercises them. Human acceptance of shop pricing, route usefulness, knowledge rewards and progression pace remains separate from source or save checks.

Scope sources: [Idle-game supply/discovery proposals](RESEARCH_IDLE_GAMES.md#five-ranked-proposals-for-this-fork), [genre families and contracts](RESEARCH_GENRE_SWEEP.md#genre-map-and-new-design-coverage), [knowledge and power operation](RESEARCH_PROGRESSION_MAGIC.md#small-rule-set-several-interactions), [inherited/acquired/learned distinctions](RESEARCH_PROGRESSION_MAGIC.md#inherited-acquired-and-learned-magic), [rivals/identity ownership](RIVALS_IDENTITIES_AND_FATE.md#engine-contracts-and-difficult-edge-cases), [enemy actor arcs](ENEMY_PROTAGONISTS.md#implementing-independent-arcs-without-an-entire-simulated-society), [run-defining advantages](RUN_DEFINING_ADVANTAGES.md#five-contrasting-families), [world/campaign direction](DIRECTION_SYNTHESIS.md#story-structure-a-spine-with-branches-returns-and-changed-outcomes). Older dossier statements about active Jade Hollow or absent runtime primitives are historical; current implementation and evidence belong here, PROJECT.md and PLAYTEST.md.

## Historical source boundaries

Upstream comparison, 2026-10-01: the boundaries below describe our v0.5.5.30-based fork. Miktaew's newer development `master` has v0.6 component models, shared NPC state, broader availability rules and generalized combat; the hosted dev release still uses v0.5.5.30. [Upstream direction and future adaptation](UPSTREAM_DIRECTION.md) records pinned evidence, overlap and remaining limits. Compare that implementation before duplicating actor/combat work, while retaining our event persistence and save protections. No v0.6 migration or runtime verification is claimed by this research update.

| Source | Present capability | Boundary for the proposed game |
|---|---|---|
| `src/actions.js`, `src/conditions.js`, `src/main.js/start_game_action` and `finish_game_action` | Required conditions, fuzzy condition evaluation, duration, success ranges and an actual `Math.random()` success check | Probability already exists. This is not a persisted graded event result, a granular diagnosis model or a reset-safe commitment contract |
| `src/quests.js`, `src/dialogues.js` | Sequential quest tasks, unlocks, flags, dialogue branches/locks and load-aware reward paths | Not a general reversible campaign graph. Definitions also contain mutable progress. Dialogue textline reputation is explicitly unsupported |
| `src/main.js/create_save`, `load`, `process_rewards` | Central serialization, reconstruction, derived-stat recalculation and reward dispatch | Inventory, quests, effects, UI and progression are intertwined. Loads replay some unlock paths; new payouts need explicit duplicate prevention. Current enemies are not saved |
| `src/game_time.js`, `src/main.js/update`, `progress_time` | Simulated calendar, sleep/travel advancement, recursive tick timer | Action intervals and combat timeouts are additional timing paths. A single deterministic/offline simulation API is not established |
| `src/inventory.js`, `src/storage.js`, `src/character.js` | Shared item model and inventory owners, storage transfer, character stats | Item mutation connects to UI through main-module wrappers. Source-level sequential removals are not an atomic multi-resource event transaction |
| `src/person.js`, `src/active_effects.js` | A Person inventory base and tagged stat effects | Does not establish NPC survival/relationships, generalized ability effects, party scheduling or multiple active player actors |
| `prototypes/jade-hollow/cultivation.js` (archived) | Historical example of pure transitions and a versioned namespace | Reference pattern only. `src/save_compatibility.js` preserves its retired state dormant; no cultivation gameplay is active |

The original architecture inspection was source-only. Current expedition browser evidence is in PLAYTEST.md. No upstream merge or full legacy-content audit is implied. `src/rewards.js` is a reference document in code form, not the active reward engine.

## Five engine boundaries

### 1. Saved state and scoped transitions

Keep definitions separate from progress in new modules. Give worlds, actors, chapters, events, techniques and origins stable internal IDs with display labels kept separate. Do not rename all existing IDs in the first patch. Namespace new definitions and reject duplicate registrations.

Distinguish account/campaign memory, current journey, world-local state and temporary scenario state. These are ownership and retention boundaries, not four copies of inventory. Store knowledge evidence, NPC status/relationship facts, event instances, pending commitments, origin state and world progress explicitly. Derived stats/availability are calculated, not repeatedly granted on load.

Add an independently versioned extension namespace to the existing save envelope first. Migrations default absent fields, validate references and preserve unsupported data before autosave can overwrite it. Definitions have their own revision so balance updates do not erase progress. Keep a bounded receipt/history ledger and checkpoint set rather than storing an unlimited log of every tick.

Travel, breakthrough, scenario rewind and rebirth have separate transition plans listing reset domains, retained fields and incompatible downstream outcomes. A checkpoint initially includes only its isolated scenario. Remembered knowledge stays outside it. No whole-character JSON rewind while equipment, quests and NPCs remain live elsewhere. A later historical rollback must restore dependent state or branch a timeline, not revive an NPC flag without repairing later events.

### 2. Rule evaluation and committed effects

Introduce a pure `evaluateAction(definition, context)` that returns visibility, eligibility, missing requirements, known costs, outcome distribution and explanatory reasons. Adapt existing condition results when appropriate without assuming every legacy field has identical semantics. New predicates explicitly handle missing values and all/any/not combinations. Knowledge and contextual opportunity are distinct from numeric skill level.

Separate inspection from execution. A player command revalidates current state, reserves costs if the action takes time, resolves or schedules the action, then commits input consumption, outcome, reward receipt and state changes together. New effects use a small validated vocabulary: consume/grant item, gain skill XP, record knowledge, update an NPC fact, open a chapter or complete a batch. Exceptional mechanics can use narrow tested handlers rather than forcing every book rule into a giant expression language.

At first the legacy adapter validates all effects against a staged plan before applying existing mutation functions, with rollback of owned state on failure. Prevent reentrant legacy callbacks during the commit; publish notifications and render only after success. Persist the committed result before it is exposed as complete. Prefer a single extension save write for an event, not several independent browser writes. Define recovery for a failed storage write and stop further irreversible actions; do not promise cross-tab atomicity without an ownership mechanism.

New events use a persisted seeded random stream or recorded draw, distinct from cosmetic randomness and initially separate from upstream combat RNG. Save event IDs, rule revision, draw/stream state and result. Odds shown by the UI come from the same evaluator used at commitment. Graded outcomes must sum to one. A pending action freezes or explicitly recomputes its applicable conditions according to its declared rule. Rewind policy belongs to its origin/scenario; ordinary reload never rerolls a resolved outcome.

### 3. Simulation time, scheduler and actor context

Introduce `advanceSimulation(duration, context)` behind the existing timer for new systems. Browser timers request work; they do not individually decide new event outcomes. Use integer simulation units and explicit due times, event ordering and action progress. Travel/sleep time jumps process crossed deadlines, not merely equality with the destination time. Scripted triggers, scheduled opportunities and eligible random encounters share event instances with statuses such as pending, committed, resolved or canceled.

Random occurrence rates must be tied to simulated exposure or scheduled sampling, not render frequency or number of browser callbacks. Persist cooldowns and queued opportunities. At a player-required choice stop simulation at its boundary and retain remaining catch-up work, if supported; do not advance time past the decision and invent its missing result.

Begin with a single player actor and explicit actor/world/scenario IDs in new commands. This creates an extension point for projections without prematurely making all upstream stats and actions multi-actor. Later move supported combat/action progress into the same scheduler before advertising deterministic combat catch-up or saving mid-combat. A helper with authored utility is a smaller first step than a fully targetable party.

The requested [concurrent-character/rogue-clone feasibility comparison](ENEMY_PROTAGONISTS.md#concurrent-characters-rogue-clones-and-alternate-modes) distinguishes isolated journeys, recorded traces and shared-world actors. A future shared scenario needs separately owned actor skills/resources/knowledge, controller policies and one authoritative opportunity ledger/scheduler. This is a proposed extension, not implemented actor isolation or a selection to simulate the whole game for a population. Its small clone/peer experiment is one later candidate after real event commitments and persistent actors work.

Offline progress reuses supported simulation transitions with input exhaustion, stock targets, time caps, safe stops and summaries. Do not simulate unported combat through a different guessed formula. Define clock-change handling and single-tab ownership before enabling elapsed-wall-time replay. Performance can batch equivalent safe work up to the next event boundary; it cannot skip a choice or sample a different probability model.

### 4. Content modules, worlds and origin policies

World modules register locations, energy/environment rules, techniques, chapters, event definitions and compatibility handlers. Shared mechanics do not imply universal fuels or progression ladders. A world can support original or selected direct-book content through the same structure; provenance/canon policy is content metadata, not a new runtime engine for each novel.

Origins supply declared capabilities and narrow policies for retention, resource transformation, information access or allocation. Do not let a treasure overwrite arbitrary globals in main.js. A vessel schedules a supported input/output transformation; a system exposes scoped information/contracts; a ring requests a validated transition; an archive supplies specific knowledge. Distributed selves eventually require independently owned actions, inventory and local knowledge plus sharing rules, not free copies of the current character object.

Capabilities and obstacles use a small set of authored tags and explicit behavior handlers. Continue using existing stances where they suffice; add real interruption, ward, resistance or objective-protection effects only when a playable encounter requires them. Effects need source IDs, stacking rules and an explanation. This can later support contextual techniques, physiology and cross-world adapters without prebuilding an unlimited spell compiler.

Authoring validation checks references, impossible eligibility, invalid costs/probabilities, unreachable required chapters, unsupported effects, reset ownership and missing recovery/automation policies. Provide a developer scenario runner with fixture characters to inspect route availability and outcomes. It does not replace browser testing or prove narrative quality.

### 5. Read models and explanatory UI

New runtime modules return state changes and semantic notifications without touching the DOM. Read models provide journal leads, known requirements, costs, probability contributors, NPC aftermath, event history, origin behavior and reset previews. Existing UI can render these through a bridge while display.js stays in place. Gradually extract only surfaces being changed.

Keep mechanical explanations honest about uncertainty. Show unknown knowledge separately from impossible actions; use accessible text and keyboard/touch controls. Do not reveal secret outcomes merely because the underlying definition contains them. Every blocked plan explains its stop reason. Load reconstructs the view without replaying narrative payouts.

## Feature fit and remaining larger changes

| Idea | Shared machinery | Further special work |
|---|---|---|
| Conditional peer rescue, injury and later consequences | Knowledge/NPC facts, pure conditions, outcome commit, explanation UI | Authored interventions and aftermath; relationship depth is content work |
| Random/scheduled events and long grinding | Scheduler, event eligibility, repeat policies, bounded plans | Rate/pacing tuning and offline accounting |
| Optional paths, techniques, book worlds | Namespaced content, capability rules, world state | Verified lore and actual distinct mechanics/content |
| Journey endings and bounded time travel | Scoped transitions, checkpoints, memories, receipts | Downstream history replacement and larger rollback boundaries |
| Production treasures, constructs, several selves | Origin policies, batches, committed capacity, actor contexts | Economy balance, helper behavior, eventually multi-actor combat and resource ownership |

## Five delivery stages

The initial stage proposal is superseded by the current [shared work packages](#next-shared-work-packages-requested-2026-10-01). Its original table and gates are preserved in [Prototype history](PROTOTYPE_HISTORY.md#initial-engine-delivery-order-superseded-2026-10-01). The current milestone remains one realm and one prestige layer.

## Practical stopping rule for abstraction

Extract a service when two real features need the same rule, or when a single feature needs a safety boundary such as save migration or cost commitment. Keep exceptional world/origin behavior local behind an explicit interface. Reassess after the first conditional event and again after the second world. If those examples reveal a fundamental mismatch, compare a larger replacement using their actual requirements; present source cleanliness alone is not a reason to restart.

The implemented increments are listed above. Remaining work packages are proposals, not completion claims. Browser correctness and unit-level contracts do not establish content quality, safe offline combat or full audit support.
