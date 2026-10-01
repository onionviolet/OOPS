# YAIRPG engine expansion

Date: 2026-10-01. First runtime increment implemented; larger architecture remains proposed. Goal: keep the existing RPG playable while making the story, world, probability and run-defining ideas in [Direction synthesis](DIRECTION_SYNTHESIS.md) and [Run-defining advantages](RUN_DEFINING_ADVANTAGES.md) feasible in stages. [PROJECT.md](../PROJECT.md) owns accepted direction.

Current foundation reset, 2026-10-01: the user selected removal of added cultivation gameplay while retaining shared engine/build work. Prototype sources and tests moved to `prototypes/jade-hollow/`; the active build no longer calls the cultivation rules. `src/rules.js` is now used by the new expedition runtime. `src/save_compatibility.js` preserves retired content outside active registries. Earlier claims below about active cultivation integration describe the prior increment, not the current runtime.

## Decision

Persistence follow-up, 2026-10-01: `src/save_files.js` validates file envelopes and UTF-8/legacy text; `src/import_probe.js` tests the actual loader in a disposable non-running frame before replacement. `src/reputation_state.js` preserves saved regional totals while permitting legacy omissions to reconstruct, and `src/clear_state.js` gates restored first-clear rewards on earned counts. Native file checks and seventeen active tests are recorded in PLAYTEST.md. This closes the generated-save file gate, not event transactions or general simulation/replay. [Next event proposal](NEXT_EVENT_PROPOSAL.md) remains provisional.

Shared rules are now exercised through the runtime below. Prior standalone/prototype status is retained in `PROTOTYPE_HISTORY.md`. The rest of this document describes boundaries and larger proposed stages; implementation is only the explicitly listed increment.

Evolve the existing engine through small adapters and extracted modules. Keep its skills, items, crafting, stances, locations and authored content. Start with a saved, conditional expedition event and explanation UI. Do not build an empty universal framework or rewrite all legacy content before delivering that behavior. This architecture preserves opportunities for the broader ideas; it does not guarantee their balance, narrative quality or equal implementation cost.

## Implemented runtime increment

The requested engine expansion now has an actual Village expedition. The first milestone still covers one world; no prestige gameplay or second world is implemented. Names and balance are provisional. Evidence belongs to [PLAYTEST.md](PLAYTEST.md), accepted direction to [PROJECT.md](../PROJECT.md).

| Contract | Source and actual behavior | Limit |
|---|---|---|
| Scoped persistence | `expansion_engine.js`: independently versioned `expansion` namespace; campaign/journey/world/actor/scenario facts, budgets and completion counts; absent legacy namespace gains defaults | Unknown schemas or unsupported live references reject before loader mutation; no silent downgrade. No global character migration or rebirth policy |
| Definitions and preview | Stable IDs, frozen definitions, checked worlds/references/effects/costs/outcomes, contextual facts, eligibility reasons, odds and duration contributors | No general spell language or automatic topology/reachability proof. Explicit tags are authored facts, not a physics model |
| Committed effects | Costs reserved at start; seeded draw and selected effects frozen with revision; delayed completion; monotonic command sequence and owner completion counts prevent duplicate grants | Fixed inputs and outcomes only. Debits belong in costs. No cancellation/refund feature, unsupported item/XP mutation or multi-resource legacy rollback |
| Durable integration | `expansion_persistence.js` writes extension state plus real money in one existing envelope, then main publishes; storage failure keeps the plan unpublished and stops new expedition commands | Money is the sole legacy resource adapter. Web Locks require localhost/HTTPS support; older builds that do not honor the lock must not run concurrently |
| Scheduler | Integer game minutes, stable same-time order, crossed deadlines, scheduled/available/claimed/expired opportunities; a blocking choice returns unspent requested catch-up | Live content uses nonblocking deadlines. Caller must retain/resume returned catch-up for blocking choices. No offline wall-time replay or ported legacy combat/action timers |
| Actor ownership | One new assignment per actor; independently owned budgets and context; tested two-actor same-time resolution | Live bridge binds only `player`. No NPC controller, actor creation UI, contested shared claim, knowledge-sharing, party or clone mode |
| Isolated rewind | Scenario snapshot, reset preview, retained campaign facts, preserved RNG/sequence/history; checkpoint actions may touch only scenario budgets or campaign facts | Unit-tested only. No live rewind/origin UI. No exporting scenario goods, opportunity rewinds, whole-character rollback or historical branch repair |
| Explainable play | `expedition_content.js` + `expedition_ui.js`: inspect, buy kit or use strength, graded guide condition, scheduled departure, actual money cost/payout, stable keyboard controls | A small ordinary expedition, not the proposed rescue plot or a finished campaign. Kit is explicitly an extension-owned supply, not a legacy inventory item |

New jobs freeze requirements, probabilities, selected result, effects and duration at commitment. Loader reconstruction does not replay payouts. New random draws occur only on accepted commands, not each timer/render. The last 100 receipts are display history; owner completion counts and monotonic command sequence remain outside that bounded history. Unknown schemas retain the original stored file by blocking writes/import rather than inventing a migration.

The bridge advances only while new jobs/opportunities exist; its clock measures supported simulation exposure rather than mirroring the entire upstream calendar. Normal ticks, sleep and travel jumps use the same scheduler. During a pending expedition, native travel/training/actions/reading/sleep/trade cannot start; after completion, native play resumes. Rendering is independent of effect application. This does not port native combat to deterministic simulation.

## Audit coverage and remaining engine work

This map covers every PF family in [Genre sweep](RESEARCH_GENRE_SWEEP.md) plus the cross-cutting rival, origin and idle-game audits. **Foundation** means the new primitives can hold and execute a bounded authored example. It never means that family's complete gameplay already exists.

| Audit family | Foundation now available | Further mechanics required |
|---|---|---|
| PF01 Martial/cultivation | Scoped resources, earned facts, conditional milestones | Techniques, breakthrough/reset policies, legacy stat/XP adapter |
| PF02 Learned magic | Knowledge predicates, prep costs, contextual odds/duration | Formula execution, spell effects and compatibility |
| PF03 Professions/classes | Demonstration receipts, access facts, owned progression | Credential services, loadouts, specializations and real skill rewards |
| PF04 Beast bonding | Actor budgets/status facts, per-actor assignments | Recruitment/bond model, partner roles and targetable allies |
| PF05 Summoned patterns | Knowledge versus prepared resources, timed commitments | Pattern registry, deployment/capacity and dismissal rules |
| PF06 Riders | Actor/world capability conditions | Coupled traversal, mount control, equipment and combat |
| PF07 Habitats/ecology | Scoped stocks, fixed-input timed batches | Capacity/care policies, population state and sustainable yields |
| PF08 Body evolution | Acquired capability facts and explained requirements | Physiology, equipment fit, movement and combat changes |
| PF09 Necromancy | Owned command budgets and per-actor jobs | Control/permission rules, unit roster, targeting and upkeep |
| PF10 Constructs | Reserved inputs, frozen output plans and scheduler | Controller policies, targets, stop rules and legacy production adapter |
| PF11 Cards/runes | Knowledge facts and explicit resource budgets | Prepared slots, stacking/compatibility and effect execution |
| PF12 Internal spaces | Scenario/world scoped facts and budgets | Configuration graph, adjacency and construction rules |
| PF13 Evolving relics | Persistent provenance facts, preparation costs | Legacy item identity, evolution/mutation and maintenance |
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

These larger capabilities remain future work. Develop one real helper/capability branch, then a contrasting obstacle/world; extract additional handlers from those requirements. A general ability engine, institutional simulator and historical rollback are materially larger additions, not content files alone.

## Inspected source and actual boundaries

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

Each engine increment must arrive with observable play. Do not treat module creation as completed gameplay. Preserve one realm and one prestige layer until later scope is deliberately selected.

| Stage | Engine work plus playable result | Required evidence |
|---|---|---|
| 1. Conditional event | Extension save schema, pure preview, committed graded event and NPC fact; one expedition rescue with two preparation routes and later aftermath | Old-shaped saves and dormant retired-prototype data preserved; fixture odds/requirements match browser preview; reload mid-action and after resolution cannot double-charge, reroll or duplicate rewards; fresh export/import |
| 2. Time and preparation | Scheduler for the new event, one timed opportunity, one conditional encounter and a supply target | Same simulated duration through normal ticks and allowed time jumps produces consistent new-system results; pause at choice, supply stop and event cooldown survive reload |
| 3. Contrasting origins | Scoped origin policy; vessel batch and one isolated ring checkpoint | Two fresh origins change plans; batch input/output preserved; rewind cannot export temporary goods, duplicate rewards or lose unrelated progress; unrelated dormant prototype state remains intact |
| 4. World identity | World registry and compatibility; second world's small chapter, one distinct rule and useful return interaction | Existing progress loads; imported technique eligibility explained; travel preserves proper state; returning changes a meaningful solution in the first world |
| 5. Advanced execution | Port additional action/combat timing, safe offline work, authored helper and eventually an additional actor | Resume supported combat/action state; active versus catch-up accounting agrees; ownership/stop rules hold; helper/actor adds a decision rather than free duplicated production |

Broader skill/equipment depth develops alongside these stages through the actual expedition. Branches, origin variants and ending combinations need content tests as well as accounting tests. First-stage rescue is a candidate implementation packet, not an accepted specific plot. Historical personal saves remain untouched; use dedicated preview origins and generated test fixtures. Rebuild and exercise changed behavior in a browser for every runtime delivery.

## Practical stopping rule for abstraction

Extract a service when two real features need the same rule, or when a single feature needs a safety boundary such as save migration or cost commitment. Keep exceptional world/origin behavior local behind an explicit interface. Reassess after the first conditional event and again after the second world. If those examples reveal a fundamental mismatch, compare a larger replacement using their actual requirements; present source cleanliness alone is not a reason to restart.

The implemented increment is listed above. Remaining stages are proposed, not completion claims. Browser correctness and unit-level contracts do not establish content quality, safe offline combat or full audit support.
