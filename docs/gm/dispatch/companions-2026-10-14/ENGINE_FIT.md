# C2: companion engine fit, 2026-10-14

## CHECKPOINT

Complete: source inventory, nonhuman/relationship comparison, Have / Missing /
Proposed tables and five ranked next steps. This lane writes only this file and
[C2_REPORT.md](C2_REPORT.md). Design/source read only. No source edits, build,
tests, browser run, save access, commit or push. All browser gates below are OPEN
future gates at **1366x768**, not claims of playable completion. Mobile tuning,
new worlds, broad party combat and universal offline simulation are deferred.

Evidence: **SHOWN** means current public source or document text with a locator;
**STATED** means the named design owner's position; **INFERRED** means a proposed
fit. Missing means absent from the inspected public seams, not a claim about
private packs. File:line locators describe this source-read checkout.

**F1 [SHOWN/INFERRED].** The engine already has a real dog actor, care, learning,
directed memory and paid timed retrieval. It also has independent workers,
party membership, old-age endings and guarded save import. The smallest new fit
is a stray built on those owners, with a small following adapter. It does not
need a second pet simulation. Rill is an example to reuse, not a stray to rename:
his saved contract requires Village residence and excludes party membership
(`src/nethack_fieldcraft_facts.js:71-83`).

Authority: [COMMON](COMMON.md), [PROJECT](../../../../PROJECT.md:31),
[User Vision](../../../USER_VISION.md:3), and the
[root palette](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md).
The palette's B2 and Suggestions propose feeding a stray twice, following,
foraging one item while the player works and aging. This is a candidate, not an
accepted implementation decision. Food stays comfortable without hunger death
(`docs/USER_VISION.md:2079-2090`); elapsed eligible idle activity remains a valid
progression route. This document adds no milestone prerequisite.

## 1. Reusable source seams

Every Have cell is SHOWN; the fit/limit column distinguishes inference from
existing behavior. These are shared owners, not a list of new systems to build.

| Code | Seam and file:line evidence | Fit and current limit |
|---|---|---|
| S1 | Person registry and spawn: `src/simulation_contracts.js:95-99,217-241`; `src/simulation.js:46-61`; `src/simulation_effects.js:200-209`. Spawn creates actor domain, person/body/vitals/life policy, simulation inventory and matching work controllers. | INFERRED: a dog is an ordinary persistent actor. `createdBy` records the spawning actor, not legal ownership. `bornAt` currently starts at enrollment/spawn, so it is not automatically an adult animal's true birth date. |
| S2 | Existing dog: `src/nethack_fieldcraft_content.js:46-57,79-103,108-112`; live support and strict saved counters: `src/nethack_fieldcraft_facts.js:25-30,71-83`. | SHOWN: four legs, jaws, HP/stamina, satiety, lessons, willingness, feeding, refunding jobs and real pin output. No feed-earned affection, following, combat, travel, timer hunger or aging policy is authored for Rill. |
| S3 | Party membership effects: `src/simulation_effects.js:379-382`; list persistence: `src/simulation_contracts.js:218,231`. | SHOWN: join checks same world and alive, leave removes membership. INFERRED: reuse membership where relevant, but it alone does not make an actor follow native location changes, obey commands or become property. |
| S4 | Bounded party combat: `src/party_content.js:8-20`; `src/party_battle.js:9-38,48-59,67-92`; controls/status: `src/party_ui.js:7-25`. | SHOWN: Lio uses his own kit, faculty, willingness, time, stamina and wounds; guard redirects a blow. INFERRED: useful consent/resource pattern. This hard-coded porter contest is not a generic beast fighter, formation or mount engine. |
| S5 | Directed axes/memory: `src/simulation_contracts.js:250`; fact projection: `src/simulation_effects.js:131-158`; writer/receipts: `:285-292`. Rill's dog-to-player learning axes: `src/nethack_fieldcraft_content.js:89,102`. | SHOWN: arbitrary stable numeric axes, actor-to-target direction, 32 recent memories and cause/actor/target/axis replay receipts. INFERRED: C1-C4/C7 fit here. Private reverse-edge truth requires a scoped reader and evidence-safe presentation. |
| S6 | Separate chronicle relations: `src/chronicle.js:34-39,62-69`; observed People view: `src/people_knowledge.js:6-8,16-28,49-63`. | SHOWN: chronicle axes clamp to ±100 and ties have flat typed values; simulation axes are finite without that clamp. INFERRED: retain an explicit adapter rather than merge stores for a dog. UI must identify whose memory is being shown. |
| S7 | Commands/jobs: `src/simulation.js:87-105,208-235,265-271,298-304`; job participant validation: `src/simulation_contracts.js:257-263`. | SHOWN: admission, participant occupancy, actual reserved inputs, frozen outcome, due time, completion support and cancellation. INFERRED: idle errands should be dog-issued jobs. Reserving the player as participant would block the promised concurrent player work. |
| S8 | Autonomous worker exemplar: `src/helper_content.js:10-29,31-44`; controller validation: `src/simulation_contracts.js:157-163`; scheduler: `src/simulation.js:518-539`. | SHOWN: a spawned pathfinder independently surveys, handles encounter/event choices, returns with stock and hands it over. INFERRED: reuse for a dog errand with its own positive means. Controllers here schedule work, not embodiment or mind control. |
| S9 | Bounded routines: `src/simulation.js:320-338,541-548`; common boundaries: `:452-457,470-480`. | SHOWN: automatable timed commands repeat with remaining count, pause/resume and unsupported-input pause. INFERRED: optional queued care or work is possible; supported played idle time is not general browser-closed catch-up. |
| S10 | Actor conditions: `src/simulation_contracts.js:172-177,252`; `src/simulation_effects.js:122-123,302-314`; expiry/tick: `src/simulation.js:476-480`. | SHOWN: intensities, immunity, tick effects, expiry and absence-as-zero declaration. INFERRED: use for scent, rest, sickness or fatigue, with named clocks and body-function effects. `src/conditions.js:82-115` is the older action requirement evaluator, not a saved care-needs owner. |
| S11 | Care and intake: `src/nethack_fieldcraft_content.js:79-83`; `src/nethack_fieldcraft_host.js:32-33`; player-only home pacing: `src/absorb_e1/pacing.js:20-35,60-74`. | SHOWN: actual food restores bounded dog satiety/stamina; player hunger is optional, home-scoped and only changes XP efficiency. INFERRED: reuse actor resources/vitals for first care; do not clone player fullness into every animal or attach starvation death. |
| S12 | Life ending: `src/simulation_contracts.js:98,238-241`; `src/simulation.js:457,483-492`; explicit death/resurrection policy: `src/simulation_effects.js:316-320`. Household calendar news: `src/npc_lives.js:5-22,33-42`. | SHOWN: common-clock lifespan endings with refund/forfeit/finish work policy; a separate fixed household has calendar birth/death/news. INFERRED: animal stages, age at adoption and away-world exposure need a clock contract. Do not create the dog in both people stores or infer autonomous relationships from annual news. |
| S13 | Native routes: `src/models/location.js:200-202`; `src/pathfinding.js:7-10,66-100`; `src/main.js:2152-2164,2230-2234`. Expedition duration modifiers: `src/expedition_content.js:91-92,137-145`. | SHOWN: route times and skill speed modifiers already exist; native move advances travel time. INFERRED: follow/ride must join the actual movement publication and revalidate animal availability. No mounted travel-speed reader was found here. |
| S14 | Simulation travel and campaign carry: `src/simulation_effects.js:210-220`; `src/simulation.js:555-591`. | SHOWN: simulation relocation and campaign party carry; safe-boundary checks; carry updates live companions' world/location; other transitions drop party membership. INFERRED: carry is not species admission, consent, all native travel, or per-world biological clock support. |
| S15 | Realm boundaries/connections: `src/realm_boundary_rules.js:46-62,103-122`; `src/realm_connections.js:14-31`. | SHOWN: form/operation permissions, source exceptions, duration, costs, directed endpoints and cargo policies. INFERRED: validate each companion's same shared body independently; a player admission result is not a permit for its dog. |
| S16 | Item stock/custody: `src/simulation_contracts.js:243-248`; `src/simulation_effects.js:254-279`; native realm cargo: `src/realm_cargo.js:59-90,97-145,147-181,187-223`. | SHOWN: exact item keys/counts, owner/holder loans, complete stock manifests and lender consent bound to route/purpose/time. INFERRED: fit for bags/tack/letters carried by an animal. This native bag/equipment adapter does not encode a living actor as cargo or publish stock itself. |
| S17 | Independent companion passage prototype: `src/realm_traveler_profiles.js:140-145,393-410,464-525`; native binding: `src/native_realm_traveler.js:49-60`; carrier binding: `src/backlog_expansion_transit.js:66-71,179-191,285-330`. | SHOWN: detached plans bind companion person/body/condition and exact-passage consent; reject companion projection/sharing. Native profile/request currently supplies empty companion lists; carrier transit is player-bound. INFERRED: reusable plan contract, not already-connected cross-world pet gameplay. |
| S18 | Growth/energy/equipment: `src/capabilities.js:40-69`; `src/body_progression.js:20-29`; `src/energy_resources.js:21-43,46-58`; `src/structured_equipment_runtime.js:43-76`. | SHOWN: source/condition-derived capabilities, body-training effects and actor energy reserve/strain; equipment fit checks owner/controller/form and projects a riding flag. INFERRED: training and magical fuel reuse owners. A riding gear flag is not an actual mount actor, terrain speed or stamina settlement. |
| S19 | Succession: `src/heir_inheritance.js:32-65,68-93`; `src/life_experience_host.js:11-24`. | SHOWN: estate goods, money, papers, duty/recognition; heir builder recreates expansion and preserves household news. INFERRED: simulation companions are not carried by this estate manifest. Preserve surviving actor identity/body/age before any reset; inherited care/title does not inherit affection or bodily control. |
| S20 | Save/migration: `src/main.js:4935,5189-5196,5299-5308`; `src/expansion_engine.js:136-147,256-270`; `src/save_migration.js:3-25`; `src/save_compatibility.js:9-53`; `src/save_files.js:40-83,99,158-191`. | SHOWN: expansion serialization, structural validation, old expansion/native migrations, retired-content retention and real-loader preflight before guarded import write; fork reader admits 1/2. INFERRED: content-only actors can use existing owners, but new nested body/bond/life schemas need migration and all-entry-point admission, not JSON tolerance alone. |
| S21 | Structured content: `src/structured_pack_definitions.js:8,73-85,118-125`; `src/structured_pack_runtime.js:18-31,65-81,89-103`; `src/structured_pack_state.js:23-34,47-50`. | SHOWN: people/commands/controllers/conditions compile through existing families; introduction-key presentation; exact revision/hash retention. INFERRED: author pets through these families, add validated metadata as needed. Runtime bootstrap currently copies NPC body/vitals but not person lifePolicy, unlike ordinary spawn, so pack aging needs an explicit adapter. Native selected-body admission/form-versus-race restrictions are distinct from NPC authoring. |

## 2. Required vocabulary search

**F2 [SHOWN].** Searched every public `src/**/*.js`, excluding files named
`SECRETS*`, case-insensitively for singular/plural whole words:
`pet, familiar, companion, mount, summon, beast, animal, horse, dog`.
Also followed structural names `party`, `relationships`, `custody`, `controllers`,
`lifePolicy`, `bornAt`, `travel_time` and `hungerEnabled`. Counts are matching
lines, not behaviors or verification results.

| Code / word | Matching lines / files | Relevant interpretation |
|---|---|---|
| G1 pet | 0 / 0 | No explicit pet keyword; absence of this word does not mean no dog support. |
| G2 familiar | 20 / 9 | Mostly ordinary familiarity prose and research data. No generic familiar bond executor found. |
| G3 companion | 49 / 8 | Party transition, detached realm-traveler and native empty-list binding; `src/cheat_cards.js:1-4` admits a future companion-voice panel, explicitly without granting behavior. |
| G4 mount | 4 / 4 | All refer to mounting UI, e.g. `src/known_routes_ui.js:11`. Riding metadata is a separate structural seam S18. |
| G5 summon | 10 / 5 | Encounter summons (`src/encounter_content.js:16-17`, `src/pursuit.js:88`) and book research rules, not a generic summoned animal runtime. |
| G6 beast | 33 / 4 | Enemy tags/drops and skill/location prose (`src/enemies.js:22,240-255`; `src/data/skills.js:2230`). Enemy bodies/stats are candidate template input, not persistent companion actors already. |
| G7 animal | 57 / 8 | Animal handling/care, recipes, enemy drops and prose. `src/activities.js:193-197`, `src/data/skills.js:1995-1998`, `src/data/locations.js:2245-2246,2535-2536` expose native care work, not ownership of a particular animal. |
| G8 horse | 12 / 1 | `src/data/locations.js:2559,2644-2664` has the cart-horse action with Animal handling gate/reward; other hits include background noise. No persistent rideable horse actor is established by that scene. |
| G9 dog | 62 / 9 | Fieldcraft content/facts/host/feats dominate. `src/nethack_fieldcraft_feats.js:38-46` checks real retrieval evidence; `src/races.js:98-100` only names a dog race scaffold; enemy size/prose, research and vial disclaimers are separate hits. |

Book research matches were inspected as declarative context, not treated as
delivered pet mechanics. No novel, private pack, sealed file or player save was
opened. These counts are a dated search snapshot in a concurrently edited tree.

## 3. Share the nonhuman body, not a parallel pet body

**F3 [STATED].** The [requirements](../../../worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md:57)
E1-E14 and N27 already propose one physical model for player, companion and foe.
The [engine proposal](../../../worlds/NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md:72)
separates pinned body template from mutable instance, proposes pure
`resolveBody(state, actorId, context)` / `can` / `explainCan` queries, and later
embodiment control separately from work controllers (`:205-289`). It is source
assessed and proposed, not implemented. Its proposed fork 3/simulation 7 migration
(`:291-353,362-376`) is not the current reader contract.

| Code | INFERRED shared fit | Bounded default + world dial |
|---|---|---|
| B1 | First pet lives at `simulation.people[dogId].body`, with actor resources, vitals, equipment, inventory, knowledge and jobs in their existing owners. Use the same template/query path proposed for player animals. | Default one dog/one body. Dial more actors, constructs or carried object presence when selected; do not add `pets[].body` or a second saved effective anatomy. |
| B2 | Separate companion participation/bond, legal title/care custody and bodily control. Independent dog control stays with the dog; the player asks for an errand. | Default unowned stray plus willing care/following. Dial legal owner, shared care, magically scoped control/lease. Being fed or created by the player proves neither title nor control. |
| B3 | Dog and player-dog both resolve walking, smelling, biting, food intake, rest, stages and collar/harness fit from the same physical template. Existing legs/jaws fields remain compatibility inputs until the common schema is delivered. | Default positive dog verbs and small scalar compatibility data. Dial acquired means and altered forms. New shared resolver/validator work belongs to the nonhuman owner, not a pet-only bypass or full-engine prerequisite invented here. |
| B4 | First commands reserve the actual dog, check functions/needs/permission at admission and completion, and write directed bond receipts to the actual actor/target. | Default dog→player trust for dog willingness; player→dog observations kept separate. Dial species/body/communication rules; absence of an axis is a defined baseline, not hidden invented affection. |
| B5 | Biological age and presence clock are physical/life data; custody and bond survive or end under separate transitions. Later multi-body registry uses references with a deliberate migration. | Default first slice uses supported joined played-clock aging, explicitly including its chosen local travel/rest. Dial world exposure/freeze and lifespan. No automatic wall-clock aging, no reset to a pup on reload or transfer. |

**F4 [SHOWN/STATED].** The [relationship audit](../relationship-prereqs-2026-10-14/AUDIT.md:38)
F5/F9/F10/F14/F15/F17 establishes the important constraints: direction matters,
the two relation stores differ, 32-memory retention is not a durable contract,
cause receipts prevent replay rather than all later progression, and permission
readers/save compatibility still need explicit work. Confirming reads here:
`src/simulation_effects.js:156,285-292`, `src/chronicle.js:34-39,62-69`,
`src/party_battle.js:9-25`, `src/save_files.js:185-191`.

**F5 [INFERRED].** C1-C4/C7 may be numeric axes, but C5 terms and C6 channels
should have scoped typed contracts, not pretend to be loyalty scores. The dog's
private memory can inform its decisions without appearing raw in the player's
notebook. Show witnessed acts, reports and estimates; a telepathic truth channel
needs its own granted means. Do not merge chronicle and simulation to unlock
the first stray.

## 4. Have / Missing / Proposed

Have is SHOWN; Missing is bounded source assessment; Proposed is INFERRED.
These rows cover the requested domains, not implementation authorization.

| Code / domain | Have | Missing | Proposed default + dial + reasonably |
|---|---|---|---|
| H1 Companion actor | S1/S2, stable spawned dog with body/vitals/resources. | Generic companion role/presentation and following binding. | Ordinary simulation actor using shared B1 body. Dial species/role. Reasonably one new stray, preserving Rill's local contract. |
| H2 Bond C1-C7 | S5/S6, directed arbitrary axes, witnessed knowledge and receipts; Rill has learning-specific axes. | General C-track writers/readers; typed terms/channels. | See track table below. Dial selected tracks by world, no automatic loyalty reward from current Rill feeding. |
| H3 Custody/ownership | S16 handles item loans; S17 binds independent passage consent. | Animal title, caregiver responsibility, custody handoff and cancellation semantics. | Separate actor refs for legal title and present carer; owner may be empty. Dial owned/contracted/shared care. Reasonably title never grants affection/control. |
| H4 Commands/idle errands | S7-S9, independent controller and timed jobs. | Generic companion assignment UI and safe follow-versus-work priority. | One dog-owned forage job with finite inputs/output and stop/return. Dial repeats/priorities. Reasonably the player may keep working; no compulsory click loop. |
| H5 Care needs | S10/S11, dog satiety/stamina and conditions. | Body-defined diet, housing, recovery, care delegation. | Existing resource/vital owners with declared intake/rest. Dial food/mana/fuel/no intake. Reasonably low-care play stays viable and hunger never kills. |
| H6 Aging/death | S12, bornAt/lifePolicy/common-clock ending; explicit life effects. | Adopted age, stages, biological clock exposure and pet mourning/retirement. | Authored initial age plus elapsed eligible time; separate life-ending/work policy. Dial species lifespan, immortal or retirement. Reasonably adoption is not birth and away time has a stated policy. |
| H7 Mounts/travel time | S13/S18, route timing/modifiers, gear riding projection. | Actual mount actor selection, terrain gait, rider/load fit, stamina and travel settlement. | Future route quote reads mount's shared functions and reserves its time/effort. Dial road/cliff/fly. Reasonably no blanket speed multiplier from a riding flag. |
| H8 Carrying | S16 exact inventory/custody/item transfer. | Animal pack capacity/size/fit and simulation-stock realm adapter. | One item in dog's actual simulation inventory; transfer or loan has exact custody. Dial mouth/harness/pack. Reasonably carried stock cannot also remain in player's bag. |
| H9 Crossing worlds | S14 party carry; S15 boundaries; S17 companion passage plan. | Connected native multi-actor passage, destination admission, animal cargo and absence clocks. | Bind each actor/body/endpoints/permission, then publish coordinated passage. Dial leave/transformed/blocked. Reasonably cargo consent is not permission to transport its carrier. |
| H10 Heirs inheriting | S19 goods/duties/recognition and retained household calendar. | Surviving companion manifest, reference rebinding and new heir edge. | Preserve actual dog/body/age/history; transfer care/title under terms and author new dog→heir edge. Dial seeks heir/other carer/refuses. Reasonably predecessor affection is not copied. |
| H11 Save/migration | S20/S21 existing state/save/import and pinned content. | New companion refs/typed terms/body versions and old-save/missing-pack disposition. | Reuse existing owners for scalar slice; version/validate genuine schema additions. Dial explicit revision adapter or suspend with export. Reasonably no invented historical pet, food, bond, age reset or reroll. |

### C1-C7 bond track fit

These C codes retain the root palette's meaning. No new bond ontology is adopted.

| Code / track | Have [SHOWN] | Missing / proposed [INFERRED] |
|---|---|---|
| C1 Trust | S5 numeric directed axes; helper agreement trust at `src/helper_content.js:19,28`. | Dog→player reliable-care/shared-work receipts and a willingness reader. Default small attainable threshold for first follow; dial task risk/saturation. |
| C2 Affection | S5 can represent the axis; no general companion affection writer found. | Voluntary proximity/seeking behavior and separation reactions. Default observable acts; dial temperament. Feeding count is not an automatic synonym for love. |
| C3 Obedience | S2 willingness flag and S8 work controller. | Train/ask/refuse semantics distinct from trust. Default task-specific learned response; dial magical compulsion or independent refusal under authored terms. |
| C4 Understanding | S2 lessons/knowledge; S5 observer knowledge. | Mutual communication method and skill applicability. Default learned cues; dial speech/telepathy. Dog learning facts do not grant player omniscient access. |
| C5 Contract terms | S16 item custody and scoped passage permission; S6 chronicle ties. | Typed participant/obligation/end/breach contract for a companion. Default none for stray; dial specified working or magic terms. Store outside numeric axes. |
| C6 Shared channel | S18 actor energy/faculties and S15 permission scaffolds. | Directed sense/pain/health/mana channel, range, costs, termination and authority. Default none; dial authored grant. Never duplicate body reserves or infer a channel from affection. |
| C7 Respect | S5 axis; `src/party_battle.js:54` writes player→rival respect. | Species/world-specific accomplishments and correct-direction command reader. Default no extra first-dog requirement; dial proud animal or sentient spirit. |

## 5. Five cheapest real next steps

All **INFERRED proposals**, with future gates OPEN. Rank 1 honors the requested
root suggestion as a complete playable seed; ranks 2-5 compare cheap marginal
extensions after it. A view-only change is cheaper in isolation than that seed,
but does not satisfy the starting suggestion. No mount, realm or inheritance
system is a dependency for these five.

Each gate requires an implementation-owned rebuild and fresh disposable origin
at **1366x768**, ordinary UI interaction and verified served bytes. For saved
changes, include Save/reload/Export/literal-file Import through the real loader;
no existing user origin or save. Source tests alone cannot close these gates.

| Rank / code | Real step and engine fit | Save impact / compatibility | Observable browser gate at 1366x768 |
|---|---|---|---|
| 1 / N1 | **Stray fed twice, follows, forages one item while you work, ages.** New original local dog via S1/S2. Two actual feed commands establish dog→player care history; second accepted feed permits following. One safe local noncombat route adapter moves it with you when idle. Optional dog-owned timed forage while player gathers, one real bounded find, and readout of authored age plus eligible elapsed time. | Add actor/person/body scalar compatibility data, own food/effort, directed axes/causes, optional party membership and dog job/controller in existing owners. Initial-age/remaining-lifespan semantics require validation. Old saves absent means no dog until encountered; retry/reload keeps same id/history/stock/outcome. If shared nested body schema is selected, use its migration rather than a pet fork. | Feed one: no follow. Feed two: follows on the supported local route; stay/busy rule leaves it where stated. During native player work, dog completes its own job and hands over exactly one useful item. Age/elapsed exposure increases through normal eligible played time; pause does not advance it. Pending and completed roundtrips preserve identity, age, care, stock and receipts with no duplicate forage. Visible routine controls/status beside player work, no page-wide scroll for them. |
| 2 / N2 | **Readable companion history and status.** Extend existing witnessed People/work views with holder→subject memory direction, current agreed task, last seen location and care/age report, keeping routine controls visible. S6/S11. | Derived view only: no new domain, settings or raw-private-state persistence. Existing witnessed knowledge comes from N1; the view grants no new truths. | Dog card distinguishes its reported memory from your witnessed acts; unknown private axes/remote location stay unknown. Care/task/stop and player work remain legible at desktop size. Reload/import renders the same known facts, without requiring new evidence. |
| 3 / N3 | **Optional short care/rest routine.** Use S9 automatable jobs for stocked care and supported shelter rest; let the player choose finite repeats, pause and resume. No mandatory daily chore. | Existing programs/jobs, actual reserved food and dog vitals; any new permission/mode fact is additive with missing=off. Define custody-safe food use and conservation on cancellation. No offline wall timestamp. | Queue care, continue player work, pause before next meal. Missing food/shelter pauses with a clear reason and no spend. Cancel returns reserved inputs; resume does not replay prior feeding or trust. Pending routine roundtrip preserves remaining count, food and stamina. |
| 4 / N4 | **One learned scent/fetch payoff.** Adapt the fieldcraft condition/job pattern to the stray's own supported route, without changing Rill's pins or two-lesson contract. One real misplaced object, visible clue, current scent and willing trained dog. S2/S7/S10. | Add namespaced condition/knowledge/training axis and one finite object claim/stock reservation in existing owners. Pin definitions/revisions; old saves lack clue/lesson, not missing regenerated loot. | Natural cue→lesson→retrieval works with dog effort and time. Expired scent, missing function or withdrawal at completion gives explained refund/no reward. Exact object changes holder once; repeat/import cannot spawn another. Condition expiry and paid pending job survive roundtrip. |
| 5 / N5 | **Carry one owned or lent object locally.** Reuse S16 stock transfer/custody and S8 return/handover jobs. One mouth-sized parcel or fitting collar pouch, explicit local destination; no general weight/pack engine yet. | Dog inventory plus existing exact loan owner/holder/key/count/cause, delivery job/receipt; new item fit/function metadata needs a compatibility decision. Old saves acquire no parcel. No conversion of the dog itself into an item. | UI shows owner and current holder, dog leaves with one actual parcel and delivers/returns that same object. Player bag cannot simultaneously retain it; unsupported carry refuses before spend, and repeat collection fails safely. Save/import while dog holds lender stock preserves custody and return duty exactly. |

## 6. Tensions and decisions before a build

| Code | Both sides retained | INFERRED disposition, no answer required for this audit |
|---|---|---|
| T1 | Root B2/N1 suggests feed-twice adoption; Rill's current feeding expressly awards no loyalty and his validator excludes travel/party. | New stray actor and selected care writer; preserve Rill's authored behavior. Two feeds are a first local authored trigger, not a universal pet acquisition limit. |
| T2 | Root L2 suggests offline errand returns; existing routines use shared played-clock scheduling. Relationship audit F13 identifies only narrow reviewed funded wall-time packing. | Default first stray uses played idle time; broader browser-closed/absent-world catch-up has separate clock, funding, replay and care policy. |
| T3 | Root G6 suggests body/cargo carry rules; campaign carry checks alive, while detached companion plans require exact consent and native binds no companions. | Use shared route vocabulary, but transport living actors separately from stock. Native multi-actor passage remains missing. |
| T4 | Nonhuman proposal defines nested functions/stages/control and future versions; current body effects are scalar and enrolled simulation requires numeric enrolledAt (`src/simulation_contracts.js:60,223`). | Select shared compatibility schema with its owner before implementation. Do not fake nested data through scalar effects or silently enroll old saves for pets. |
| T5 | Root D7/I3 wants pet aging and succession; common-clock bornAt starts at introduction and heir builder recreates expansion. | Choose initial age, biological clock exposure and retained actor manifest explicitly. No copying household name ids onto simulation actors or resetting surviving animals to newborns. |

**Q1 [INFERRED].** First implementation packet needs the local follow endpoint
pair, useful forage output, initial age and life clock, missing-save default,
and shared body-schema owner. Default proposal is an original Village stray,
safe local travel, no hunger death and explicit supported played-clock age.
Per-world dials remain available. Future embodiment, mounts, world travel and
heir retention remain separate selected slices, not first-dog acceptance gates.

**F6 [SHOWN].** This audit provides source/design evidence only. No claim here
establishes tests passing, rebuilt behavior, installation or human acceptance.
The complete first-dog browser and persistence journey is still OPEN.
