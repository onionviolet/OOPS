# R2: source and owner reconciliation

2026-10-14. Prefix K. Sections 8–12 of part 22 are proposals. This report is a source-read audit and proposed build contract, not accepted design or gameplay verification. Read `COMMON.md`, `AGENTS.md`, `PROJECT.md`, all requested owners and source modules. No game, build, tests, save access, commit or push. Branch: `codex/gameplay-foundations`; unrelated dirty state and active workers preserved. Writes are confined to this lane.

The useful first path is a validated local offer, an optional Ambition, and an honest local closure record. Reuse existing quest views, commands, event checks, clocks and publication. A run archive, world fork, continuation and prestige payout each need more than a label or chronicle page. The dependency path below retains all reasonable later options without promoting them into milestone gates.

## Evidence index

All map citations below resolve through these K codes to exact live file lines. “Shown” means directly visible in source; “stated” means documentary direction; “inferred” means the bounded implementation consequence. No runtime behavior was exercised.

| Code | Source-read fact and citation | Why it matters |
|---|---|---|
| K01 | **Shown:** `src/quests.js:14-41,49-87,102-175,185-299,304-554,591-597`: authored Quest/QuestTask, sequential tasks, any/all, repeatable flag, reward processing and generic event-name matching. Constructor resets progress; start shallowly shares the template tasks and conditions. Constructor registers availability through `this.id`, while final identity assignment uses `quest_id`. | T6 needs explicit registration and fresh task copies; emitting objects alone is insufficient. These are source concerns, not reproduced runtime defects. |
| K02 | **Shown:** `src/main.js:2196-2201,3654-3658,3694-3706,3928-3933,4882-4893`: enter, clear, kill, kill_any and reach_skill producers. | QC2 is broadly right; T9 must add actual successful-action producers and count/tag semantics, rather than a new dispatch switch. |
| K03 | **Shown:** `src/main.js:5120-5141,6762-6805`: save contains native quest activity/completion/task progress, not generated definitions. Loader dereferences the code registry. `src/native_unlock_transaction.js:9-11,23-38` requires a registered saved quest binding. | T6 must rehydrate definitions before progress/unlocks; unknown template references cannot be silently lost. |
| K04 | **Shown:** `src/expansion_quest_ui.js:8-28`; `src/frontier_campaign.js:56-77`: six authored expansion cards share the quest display and native completed filter; supply acceptance/payment is owned by commands/facts, not the view. | Avoid a parallel quest reward manager or moving existing authored cards into vanilla task progress. |
| K05 | **Shown:** `src/simulation.js:497-510,521-538` uses due checks, saved draws, misses/guaranteeAfter, eligibility, occurrence limits and NPC controllers. `src/simulation_resolution.js:4-32` freezes spawned participant/template references. | A seeded event director and dynamic participant primitives exist. “No generator” must be restricted to general generated native quests, not all generation. |
| K06 | **Shown:** `src/chronicle.js:43-59,72-89,103-126,155-219,267-282`: bounded invitations, resolved/missed states, delayed report hearing, paid promises, relationship consequences, optional mortal aging. Chronicle log is capped at 40; events at 16. | Reuse invitation/report semantics, but neither capped prose nor generic events are a durable run/deeds archive. |
| K07 | **Shown:** `src/chronicle.js:16-18,120-124`; `src/chronicle_ui.js:50-62,70-77,121-135`: life end is specifically enrolled mortal old age; native combat remains fainting. Ending dialog already exports, resets and offers heirs. | T18 cannot call every defeat a death or implement retirement by spoofing `endedAt`, whose validation requires the lifespan deadline. |
| K08 | **Shown:** `src/life_experience_host.js:11-28`; `src/heir_inheritance.js:32-65,79-93`; `src/chronicle.js:284-314`; `src/main.js:1630-1651,8295-8303`: estate leftovers, taught/paper lessons, reputation, home and obligations carry through a wired saved heir request. Fresh expansion initialization still discards wider simulation/campaign state. | Correct stale one-lesson/unwired claims; preserve the real remaining continuity gap. |
| K09 | **Shown:** `src/life_record.js:1,10-29,32-46,65-77`: explicitly lossy biography, compacted history, no reward/quest authority. `src/life_experience.js:17-35`: bounded epitaph/grave. | A summary can read these; T21 cannot reconstruct complete reward evidence from them. |
| K10 | **Shown:** `src/world_instances.js:54-78,97-131,215-268,271-302,308-344,347-404,407-428`: strict fields, fixed definition revision and fact key/type bindings, instances/visits/claims, occupied-interval union, freeze absence, filtered view. Parent graph is enclosing ownership/nesting, not fork ancestry (`:237-245`). | T14/T15/T19 need validator/revision compatibility; do not overload `parentInstanceId` as branch lineage or claim a fork exists. |
| K11 | **Shown:** `src/feature_expansion_destination_host.js:18-47,65-88`; `src/feature_expansion_nested_host.js:203-228`; `src/book_world_mol_host.js:40-43,63`; `src/book_world_mol_state.js:55-57`: concrete retained-world consumers have resident/native owners, fixed identities, visits, elapsed clocks and return paths. MoL has local elapsed offer lateness. | Shelving extends actual consumers. Instance facts alone do not contain NPC bodies, stock, jobs or knowledge. |
| K12 | **Shown:** `src/native_realm_traveler.js:15-60`; `src/expansion_engine.js:143-144`; `src/simulation.js:555-564`: same living native body, complete cargo references, one active retained visit, safe transition boundaries. | Travel is real but narrowly bound. General arbitrary-world/person switching, kidnapping and multi-body play remain later. |
| K13 | **Shown:** `src/frontier_campaign.js:62-66,95-107`; `src/structured_renewal.js:23-49`: existing field/structured renewal resets training/reserve and retains the protagonist, with guarded claims. Field reward currently says “once”. | Existing prestige-like renewal is not a run-end protagonist reset. T21 must not silently add a second reward layer or rewrite old terms. |
| K14 | **Shown:** `src/expansion_engine.js:662-684`: scenario rewind keeps actors, worlds, RNG and receipts. `src/backlog_expansion_time.js:161-180,232-240`: a separate paid bell-yard loop restores specific bodies/site state while retaining common time/knowledge/claim. | There are narrow rewind consumers; neither proves full historical rewind or a general anchor system. |
| K15 | **Shown:** ordinary ticking uses the joined clock (`src/main.js:7150-7175,7226-7246`). **Exception:** `src/backlog_expansion_time.js:80-86,243-254,318-334` reads a trusted wall timestamp and settles an explicitly reviewed, prepaid batch; `src/backlog_expansion_host.js:79-98` injects the existing scheduler. Transit explicitly rejects offline requests (`src/backlog_expansion_transit.js:244-250`). `src/realm_clock_leases.js:22-34,64-91` admits bounded played-time observation/work leases. | Part 22 X8's absolute “no wall-time reads” claim is stale. There is a narrow wall-time proof, not general offline offers, aging or whole-world simulation. |
| K16 | **Shown:** `src/titles.js:1-2,8-38,59-88`; `src/main.js:7697-7729`: title grants/bonuses derive from saved counters. `deaths` means consciousness losses; years use fixed calendar start; silent load backfills titles. | T21 must use baseline deltas and typed deed evidence, not treat a backfilled title as a new deed or a faint as true death. |
| K17 | **Shown:** `src/save_files.js:40-83,99,145-155,158-190,194-216`; `src/main.js:5187-5196,7056-7067,7109-7125`: guarded UTF-8 export/import/preflight, version/schema checks, storage budget and single-slot reset. `src/expansion_persistence.js:7-17,34-50` stages envelope patches before storage/publication. | Every added owner needs writer, loader, preflight, reset/export and failed-write behavior. “Additive” does not mean older builds preserve it. |
| K18 | **Shown:** `src/workspace_layout.js:8-16,89-114,124-159,315-325`: sticky discovery from discovered OR eligible, hidden labels, independent panels and F6 focus; layout/colors are per-browser (`:32,80-85`). | Both predicates must avoid revealing unseen boards. New UI target is 1366×768 desktop, useful board/goal/record panels; mobile optimization deferred. |
| K19 | **Shown:** `src/world_completion_life_content.js:33-52`: paid public or private local chapter closure retains people/property and leaves ordinary play open, with no prestige or forced departure. `src/causal_story_host.js:430-445,458-483`: caused closure and committed-work receipts, observer-limited offers. | T16/T18 reuse closure and receipt patterns; local closure is not a whole-world ending or life termination. |
| K39 | **Shown:** `src/simulation_contracts.js:191`; `src/simulation.js:567-608` admits travel/return/ascend/rebirth/replay transitions, declared reset domains, costs, body/relationship removal, rebirth life revival and chronicle-end policy, native replacement envelope and retained RNG/claims. | Generic transition machinery is present; it does not establish an authored native next-life rebirth profile or authorize activating one. Extend this seam rather than invent a separate reset engine. |
| K40 | **Stated concurrent integration:** `docs/worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md:585-614` now integrates R1 source-status findings, two more worlds and QBV1–QBV6. | This lane reads the updated rows as documentary findings, not independently verified publication facts. Composable ending facets and four frontier endpoints refine T15; rate examples remain proposals. |

## Authority, duplicates and corrections

These owner citations are the second half of the map. Palettes remain proposals unless the cited passage identifies Weibao's accepted direction.

| Code | Owner and status | Reconciliation and why it matters |
|---|---|---|
| K20 | **Stated accepted:** `PROJECT.md:33-41,303-309,365-367,49-62,228`; `AGENTS.md:40-42`; `docs/USER_VISION.md:5-18,96-102,133-139`. | One realm/one prestige, intact vanilla, causal natural course, desktop priority, optional heirs, broader carrier-backed future scope. Proposal rows cannot silently enable lethal/offline loss or a second prestige. |
| K21 | **Stated:** `docs/LIFE_SIM_NORTH_STAR.md:1094-1130,3817-3839,3852-3902`. Both suggested/written Ambitions is accepted at `:1110-1112`; loops/persistence details are proposals. | QL4/QG1/QG2/T8 already have an owner. Missed gossip/event quests and saved RNG fit. The older automatic research-memory wording at `:1092` must be read under later accepted carrier rules, not copied as automatic knowledge transfer. |
| K22 | **Stated:** `docs/TIMELINES_AND_DIVERGENCE.md:161-165,328-336,390-396,490-499` records accepted natural course, divergence sense choices, branch premises, automatic saving and biggest-change renamable names. `:15-29,49-109,262-272,450-463` supplies proposed identity, causality, clock and reset contracts. | RB1/RB2/RB5/RP5 duplicate existing ownership. Labels must not stand in for automatic branch retention. Earlier “seed regrows detail” (`:405-430`) is qualified by `:71-78`: summary ≠ exact playable resume. |
| K23 | **Proposal:** `docs/worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md:3,15-25,31-39,53-59`. | Fresh random usual continuation is recommended, not accepted; succession is optional. Protagonist, world persistence and carrier are separate. Earlier checkpoint replay can be a player branch choice; character time travel needs a source. |
| K24 | **Design interface:** `docs/worlds/CAMPAIGN_FRAMEWORK.md:17,37-46,58-68,91-109,125-143,161-188`. | Owns world/continuity/era/entry/failure/transfer, freezes commitments, reserves one publisher. Older “freeze-on-absence proposal” at `:185` is stale for selected consumers K10/K11; no general independent native instance composer is established. Historical roster at `:21-25` does not override canon-first K20. |
| K25 | **Proposal:** `docs/worlds/world-depth-2026-10-13/13_EARNED_OPTIONS_AND_CHEATS.md:23-39,158-176`. | EO1 scope separation, typed earning receipts, profile menus and lineage are the owner of RP3/RX4. Its code claim at `:14` about one lesson/button is superseded by K08 and the accepted rulebook's current receipt. Profile store is still a proposal. |
| K26 | **Proposal with accepted rules cited:** `docs/worlds/world-depth-2026-10-13/17_CARRYOVER_AND_RETROFIT.md:5-14,31-39,47-78,99-116,122-128`. | CL1 manifest, CL7 player codex, CL19/20 enduring world, CL31 meta carrier, RT18 biography boundary already own much of RL/RP/RX. RT1/RT4 and purse/inventory part of RT2 are stale; wider lost-world part remains. Never create competing carry rules in part 22. |
| K27 | **Proposal:** `docs/worlds/world-depth-2026-10-13/06_CROSS_WORLD.md:49-61,69-81,109-120`. | PW copy provenance/discovery/clock and ST epilogue/successor starts already cover QB/RB; reputation can travel through gossip, without automatic copied standing. |
| K28 | **Proposal:** `docs/worlds/world-depth-2026-10-13/11_ACCESS_AND_STARTS.md:48-64,73-85,137-146,169-173`. | Owns access, picker, sandbox, MR1 copy, MR8 merge, MR10 heir choice and KA5 profile. X8/KA1's unwired heir assertion is stale. MR5 says “existing save slots”, while K17 shows one slot; a slot browser is a build gap, not a derived atlas for free. |
| K29 | **Proposal refined by Weibao:** `docs/ABUSE_AND_LIMITS.md:32-40,46-55,133-141,173-176`. **Accepted:** `docs/RULES_FROM_SCRATCH.md:35-69,164-188`. | Keep integrity and one settlement per receipt; repeatable deeds may pay through new real occurrences under per-world adjectives. No universal once cap or tamper-detection gate. Carry and character knowledge need a real source. The rulebook `:56-60` explicitly updates the heir build status. |
| K30 | **Concurrent design scope:** `docs/gm/dispatch/procgen-2026-10-13/PLAN.md:22-26,30-41`; `docs/USER_VISION.md:2200-2207` (paragraph beginning “Little to no interaction with the past selfs or bodies?”). | P12 quests/arcs, P13 canon, P14 chronicle and P16 endings overlap this audit. Integrate into those owners; no second generic story engine. Weibao's current lean is ordinary past-self NPCs with little/no special interaction, not a required ghost-replay feature. |

### Conflicts to flag before integration

| Code | Part 22 rows | Conflict or unsafe interpretation | Recommended correction and why it matters |
|---|---|---|---|
| K31 | QT11, QI1–3, QS9, QX6, RL9, RS2/RS5, DL12/DL25, T13/T20 | Offline/absent consequences must not become automatic defaults or retroactive losses. Frozen instances cannot accrue elapsed stories. Accepted world rules are per world (`docs/RULES_FROM_SCRATCH.md:168-173`), with no aging while closed direction (`:142-156`). | State the clock policy on each offered slice. First summary handles supported played-time changes only; packing is the narrow K15 exception. Later offline adapter belongs to its existing owner. |
| K32 | QBC1/QBC6/QBC9 | “Climax on schedule whether or not you participate” must not force a causally invalid ending or conjure a substitute. Accepted natural course yields to sufficient disturbance (`PROJECT.md:365-367`; `docs/TIMELINES_AND_DIVERGENCE.md:49-60`). | Recheck real causes and participants; authored substitutions need independent means. Prevention is a valid terminal resolution. |
| K33 | RL2/RL3/RL5/RL6, QG7/QN9/QBC7, RX1/RX3 | Enduring-world and optional-fresh-life prose exceeds K08's actual retention. A fresh heir expansion still discards many holdings/actors. Accepted inheritance (`docs/RULES_FROM_SCRATCH.md:38-60`) and optional heir (`docs/USER_VISION.md:133-139`) cannot be satisfied by one forced successor. | Label current bounded leftovers and remaining continuity work separately; do not copy dead-character mastery/knowledge into a stranger without a carrier. |
| K34 | RL3 “player knowledge always”, QBC10, RP3, RX1/RX4 | Player recall does not automatically become the next character's Notebook or usable power. Accepted knowledge rule (`docs/RULES_FROM_SCRATCH.md:63-71,181-188`; `docs/USER_VISION.md:96-102`). | Keep meta history/player codex distinct from actor knowledge; carry exact discovered records only through supported sources. |
| K35 | RP8, QE8/QBA4, T21; K13 existing renewal | Proposal defines prestige as resetting the protagonist, while current field renewal retains them. Accepted separation from travel/ascension (`PROJECT.md:228`) does not authorize changing renewal or stacking another layer (`:303-304`). | T21 first records deeds; payout/reset remains a selected policy. Preserve existing renewals and offer one configured prestige route only after its own contract. |
| K36 | RP7/QZ6, RL8, T21 | Repeatable content must not inherit a universal once rule from title flags or legacy renewal. K13/structured claims are current finite implementations, not a future law. Accepted adjectives (`docs/ABUSE_AND_LIMITS.md:32-40`). | Dedupe the same occurrence receipt, allow later real occurrences; author repeat value per world. Do not retroactively replay saved rewards. |
| K37 | RB1/RB3/RB4/RB6, T19 | Threshold labeling is not branch creation, persistence or exact resume. Defaulting every old instance to “canon, near” falsely labels original/visitor/AU content. Automatic branch saving/naming direction is already accepted (`docs/TIMELINES_AND_DIVERGENCE.md:335-336,396,492`). | New branch ancestry field, classified/unknown provenance and auto-retained qualifying history; names from known changes only. Summary-only archives cannot promise exact replay. |
| K38 | RB7, RS6, QE5, QH1/QH2/QBM3, RP6, RX3/RX6 | Multi-world atlas, merge, simultaneous bodies and branch exchange are later scopes, not gates for a local offer or first prestige (`PROJECT.md:303-309`; `docs/worlds/CAMPAIGN_FRAMEWORK.md:188`). | Keep them reachable in the horizon. Ordinary past selves follow K30's stated lean; rich ghost replay stays optional. |

No row is rejected merely for being later or unbuilt. K31–K38 identify contradictions only when proposals are interpreted as current guarantees, universal rules or accepted default changes.

## Complete row map

The tables below map each original code separately. “Extend” identifies a real seam, “new” identifies absent general behavior, “duplicate” routes to an existing owner, and “correct” flags a stale claim or conflict. All citations use the evidence index above. Dial rows and world example rows are included; world examples are authoring suggestions, not independently verified canon assertions.

### Section 8

| Code | Part 22 row | Existing seam / owner citations | Disposition and why it matters |
|---|---|---|---|
| K100 | QC1 | K01,K03 | Extend authored sequential tasks; deep-copy conditions and register identity before using dynamic IDs. |
| K101 | QC2 | K01,K02 | Correct enumeration wording: dispatch is generic; these five verbs have producers, new verbs need commit hooks. |
| K102 | QC3 | K03 | Extend registered native unlock binding; cannot start an arbitrary unregistered emitted quest. |
| K103 | QC4 | K04,K05 | Correct to no general native Quest generator; expansion quest projections and seeded event generation exist. |
| K104 | QL1 | K18,K21 | New board offers, existing discovery seam; both eligible and discovered must protect unseen names. |
| K105 | QL2 | K04,K24 | Duplicate campaign composition; skin one projection without duplicating settlement logic. |
| K106 | QL3 | K25,K29 | Duplicate acquisition/patron carriers; stronger system quests need actual knowledge, funding or declared creation power. |
| K107 | QL4 | K21 | Duplicate accepted suggested/written Ambitions; no runtime Ambition owner found in inspected modules. |
| K108 | QL5 | K28 | New sandbox path; keep test stamps separate and sealed guards intact. |
| K109 | QS1 | K04,K24 | New shortage emitter; existing supply commands provide actual stock/cost consequences, not a general price-changing generator. |
| K110 | QS2 | K05,K24 | Extend eligibility/events; actual threat escalation and region ownership must be authored. |
| K111 | QS3 | K06,K19,K24 | Extend named relationship/case offers; use real NPC means rather than a second needs ledger. |
| K112 | QS4 | K24,K25 | Duplicate institution/rank acquisition; emit only supported institutional terms. |
| K113 | QS5 | K06,K21 | Extend delayed reports and Told evidence; a rumor is not confirmed world truth. |
| K114 | QS6 | K05,K06 | Extend timed event checks and missed reports; no wall-time expiry by default. |
| K115 | QS7 | K22,K24 | Duplicate causal natural course; authored beats suppress incompatible generated offers. |
| K116 | QS8 | K24,K29 | New world-specific rift template; source qualification and combat content are required, a quest row creates neither. |
| K117 | QS9 | K12,K15,K24 | Extend contracts/jobs; general absent hired-party execution is later and policy-bound, K31. |
| K118 | QS10 | K21,K25 | Duplicate knowledge/patron paths; dream certainty and issuer scope are authored, not omniscient. |
| K119 | QT1 | K02,K16 | Extend successful skill threshold/counter snapshot; offer acceptance stays separate from triggering. |
| K120 | QT2 | K02,K16 | Extend bestiary/action counters; new occurrence receipt prevents repeated offers on every refresh. |
| K121 | QT3 | K01,K03 | Extend item-linked authored quest/unlock; item seed must freeze and remain tied to actual custody. |
| K122 | QT4 | K02 | Extend enter producer; load-time movement already suppresses quest events, retain that distinction. |
| K123 | QT5 | K06,K19 | Extend specific help/relationship receipts; rechecking trust is not a fixed universal completion cap. |
| K124 | QT6 | K06,K19,K24 | Extend actual grievance/crime consequences; witnesses require their own knowledge, not global disclosure. |
| K125 | QT7 | K16,K25 | Extend standing/title facts; a general observer-scoped renown/suspicion issuer feed remains new. |
| K126 | QT8 | K03,K21 | Extend native unlocks and knowledge; secret clues stay route-limited, not a truth dump. |
| K127 | QT9 | K07,K16,K33 | Correct defeat versus true death; ordinary faint counters cannot trigger life-ending rewards. |
| K128 | QT10 | K06,K20 | Extend enrolled age only; pregnancy/illness are authored scope, no hunger death direction. |
| K129 | QT11 | K10,K15,K31 | New general absence effects; a frozen world has no elapsed season to repair. |
| K130 | QG1 | K21 | Duplicate accepted written goal direction; new template-bound ambition store avoids parsing text as executable requirements. |
| K131 | QG2 | K21 | Duplicate accepted suggested goals; persist accept/reword/decline rather than auto-accept. |
| K132 | QG3 | K18,K21 | New planning projection; unknown steps must remain unknown under actual character knowledge. |
| K133 | QG4 | K05,K21 | Extend eligibility weighting; player preference weights noticed work, not fabricated world shortages. |
| K134 | QG5 | K23,K26 | Duplicate identity/perspective distinction; player intention cannot overwrite an existing actor's goals unnoticed. |
| K135 | QG6 | K06,K21 | New ambition transitions with receipts; abandon/transform is not native quest finish plus free rewards. |
| K136 | QG7 | K08,K26,K33 | Duplicate unfinished-business carry; general goal succession needs an actual link and retention hook. |
| K137 | QG8 | K06,K24 | Extend named people/relationships; shared goals need actual means and opposition resolution. |
| K138 | QG9 | K25,K29 | Duplicate system/patron steering; receipt and scope distinguish real hidden knowledge from ordinary recommendations. |
| K139 | QG10 | K21 | Duplicate Moment-to-Multiverse loop table; implement one short goal before full multi-life planning. |
| K140 | QX1 | K05,K06,K24 | Extend missed events/caused aftermath; skipping can change the world without a personal debt. |
| K141 | QX2 | K06,K24 | Duplicate issuer motive/observer rules; bind an actual person/institution, not just flavor text. |
| K142 | QX3 | K19,K24 | Extend grievance/pursuit patterns; general NPC bounty boards targeting player remain new. |
| K143 | QX4 | K03,K16,K18,K25 | Extend native unlock/source/title rewards; use their current owners, no parallel reward service. |
| K144 | QX5 | K24,K22 | Extend causal choice predicates; invalidated alternative remains historical, not silently erased. |
| K145 | QX6 | K05,K15,K31 | Extend paid NPC jobs/controllers; absence work requires supported clock and funds. |
| K146 | QX7 | K19,K24 | Extend evidence/closure rules; fake proof is an in-world route with witnesses and costs. |
| K147 | QX8 | K05,K29 | Extend world-specific density; current occurrence limits are local authoring values, not universal once rules. |
| K148 | QX9 | K04,K18,K21 | Extend shared readable quest surface; skins must not gate access to existing records. |
| K149 | QX10 | K05,K24 | Extend frozen participant/template identities; save filled slots rather than regenerate names on reload. |
| K150 | QX11 | K05,K17,K29 | Duplicate saved RNG/integrity; generating and paying a receipt must publish atomically. |
| K151 | QX12 | K05,K21 | Existing misses/guaranteeAfter pacing; reuse director checks and add a local quiet period only if needed. |
| K152 | DL9 | K05,K24 | World density parameter; no fixed global cap, storage compaction is separate. |
| K153 | DL10 | K21 | Suggestion taste dial; both suggested and written remain reachable. |
| K154 | DL11 | K21,K29 | Visibility dial bounded by knowledge/seal route; full plan cannot silently reveal private truth. |
| K155 | DL12 | K10,K15,K31 | Consequence speed depends on actual clock adapter; zero elapsed means zero passive changes. |
| K156 | DL13 | K04,K18 | Presentation preference; plain accessible list remains available. |

### Section 9

| Code | Part 22 row | Existing seam / owner citations | Disposition and why it matters |
|---|---|---|---|
| K157 | QP1 | K05,K17,K24 | New posted-work contract; reuse funded NPC job and durable settlement, no output from time plus roll alone. |
| K158 | QP2 | K05,K06,K24 | Extend taker selection/relationship evidence; wages and competence must come from actual actors. |
| K159 | QP3 | K24,K26 | Duplicate institution succession; full player-founded issuer institution is later, not needed by T11. |
| K160 | QP4 | K06,K24 | Extend specific NPC aims and favors; broad companion request feed remains new. |
| K161 | QP5 | K08,K26 | Extend actual taught lessons; no arbitrary heir skill grants from assigning text tasks. |
| K162 | QP6 | K19,K24 | Extend target/evidence contracts and pursuit; new bounty requires actual target and funded reward. |
| K163 | QO1 | K05,K24 | Extend NPC controllers and shared settlement claim; no duplicate player/NPC payout for the same completion. |
| K164 | QO2 | K05,K06 | Existing named rival and controller seams; a competing adventurer party is new content. |
| K165 | QO3 | K12,K24 | Party references exist; native multi-actor quest encounters need their own supported adapter. |
| K166 | QO4 | K19,K24 | Extend claimed versus witnessed proof; observer belief may differ from actual outcome. |
| K167 | QO5 | K05,K19 | Extend caused NPC work/effects; report only what the player heard or witnessed. |
| K168 | QF1 | K19,K21 | Extend knowledge/evidence cases; new generated investigations need authored clues and wrong-answer outcomes. |
| K169 | QF2 | K05,K12,K24 | Extend timed jobs/participants; escort protection and lethal stakes need specific native consumers. |
| K170 | QF3 | K06,K19 | Extend relationship/conversation outcomes; talk-event counting alone is not persuasion resolution. |
| K171 | QF4 | K04,K19 | Existing paid craft/repair work; new templates reference completed products/specification receipts. |
| K172 | QF5 | K05,K24 | Extend frozen costs/deadlines/custody; constraints validate at actual completion, not just offer time. |
| K173 | QF6 | K19,K24 | Extend actual evidence/witness receipt patterns; a proof inventory item stays owned by its real holder. |
| K174 | QF7 | K06,K15 | Extend played-time boundaries; survival/endure cannot age or kill the character offline by implication. |
| K175 | QF8 | K02,K08 | Existing reach_skill and paid study; read/exam completion events still need genuine producers. |
| K176 | QF9 | K22,K24 | Extend causal alternatives and branch resolution; no forced reappearance of rejected conditions. |
| K177 | QF10 | K10,K24 | New bounded state-delta objective; baseline and outcome owner must be fixed before counting improvements. |
| K178 | QR1 | K01,K24 | New partial outcomes for generated quests; native boolean finished flags cannot express fractional settlement. |
| K179 | QR2 | K06,K19 | Extend consequence-driven follow-up; failure does not reset earlier costs or memories. |
| K180 | QR3 | K06,K24 | Extend promised obligations and cancellation terms; no universal penalty for untaken work. |
| K181 | QR4 | K11,K24 | Existing MoL elapsed late-offer state; generalized late pay/follow-up needs template-specific terms. |
| K182 | QR5 | K20,K24 | Correct QA4 tension: validate structural feasibility, not guaranteed victory; risky worlds can offer uncertain outcomes. |
| K183 | QI1 | K06,K10,K15,K31 | Extend deadline policies; absent/closed progression not generalized by current timekeeping. |
| K184 | QI2 | K06,K09,K31 | Extend heard-missed recap; durable outcome IDs and read cursor needed beyond bounded prose. |
| K185 | QI3 | K05,K15 | Jobs run on joined clock; multi-day supported tasks possible, general offline travel not established. |
| K186 | QI4 | K06,K21 | Extend game calendar/event boundaries; school/season schedules need world-specific source data. |
| K187 | QI5 | K05,K06 | Extend routine/controller completion offers; emit from committed visit/work receipt, not render calls. |
| K188 | QV1 | K18,K21 | New diegetic board with existing workspace discovery; plain readable projection remains base. |
| K189 | QV2 | K06,K19,K21 | Existing local conversation/report invitations; generated talk offers extend those routes. |
| K190 | QV3 | K17,K25 | Extend typed receipt presentation; immersive display preference must not alter settlement evidence. |
| K191 | QV4 | K18,K21 | Extend bounded useful panels and pacing; fold other work without hiding independent goal/history surfaces. |
| K192 | QV5 | K18,K20 | Duplicate accepted desktop-first direction; future proof target 1366×768, mobile deferred. |
| K193 | QW1 | K24,K25,K27,K28 | HP school errands/exams: calendar/conversation templates, no live school generator. |
| K194 | QW2 | K24,K25,K27,K28 | D&D contracts/patrons: institution templates; source rules profile still required. |
| K195 | QW3 | K24,K25,K27,K28 | Soldier orders: mandatory duty only through actual institution terms; no universal optional-board semantics. |
| K196 | QW4 | K24,K25,K27,K28 | TTKS native system depends on specific book/arc; never one rule for all five. |
| K197 | QW5 | K24,K25,K27,K28 | MoL loop-memory suggestion exceeds current independent visitor profile; use local ordinary work first. |
| K198 | QW6 | K24,K25,K27,K28 | LOTM/CoI duty/divination: information source and attention must be implemented separately. |
| K199 | QW7 | K24,K25,K27,K28 | Shadow Slave system-native distinction is authoring proposal; private second system needs own carrier. |
| K200 | QW8 | K24,K25,K27,K28 | JJK grade assignments: fixed threats/known estimates, no omniscient appraisal by default. |
| K201 | QW9 | K24,K25,K27,K28 | Bleach patrols: region/actor cause and native duties, no general source-world event feed today. |
| K202 | QW10 | K24,K25,K27,K28 | Fate war/referee: continuity-specific event graph, not globally forced main quest. |
| K203 | QW11 | K24,K25,K27,K28 | HxH listings: institution access/knowledge gate, not a new gate on vanilla quests. |
| K204 | QA1 | K01,K03,K24 | New frozen quest template data; validate registration/task references and definition revision. |
| K205 | QA2 | K05,K24 | Existing frozen spawn/actor references; bind target/cast once and preserve their actual owners. |
| K206 | QA3 | K22,K24 | Duplicate causal canon priority; authored precedence cannot force an ineligible canon beat. |
| K207 | QA4 | K24,K32 | New structural offer admission; reachable does not mean safe, guaranteed or already unlocked now. |
| K208 | QA5 | K05,K17 | Reuse seeded checks; verify committed offers across reload/import, not only a snapshot of expected text. |
| K209 | QA6 | K21,K29 | Duplicate knowledge/sealed rules; separate internal secret ID from discovered clue text. |
| K210 | QA7 | K01,K02 | Generic dispatch already exists; add six concrete successful-action/time producers and idempotent receipt semantics. |
| K211 | QK1 | K05,K24 | Mitigate via real cast/follow-ups and distinct costs; new prose variety alone does not create causal variety. |
| K212 | QK2 | K18,K21 | Existing panel/pacing owners; keep optional work readable without completion pressure. |
| K213 | QK3 | K22,K24 | Validate causes and continuity; tags plus authored-first order alone do not prevent contradictions. |
| K214 | QK4 | K09,K17 | Compress display prose only; retain compact outcome/settlement evidence needed for carry and summary. |
| K215 | QK5 | K21,K25 | Expose why work was noticed; secret-aware system steering remains an explicitly authored cheat. |
| K216 | DL14 | K05,K24 | Competition dial controls actual taker means/time; default gentle is a proposal. |
| K217 | DL15 | K18,K25 | Receipt visibility is a preference, durable evidence remains regardless. |
| K218 | DL16 | K01,K24 | Failure harshness needs explicit template settlement; no silent native death or permanent loss switch. |

### Section 10

| Code | Part 22 row | Existing seam / owner citations | Disposition and why it matters |
|---|---|---|---|
| K219 | QN1 | K06,K24 | Duplicate commitment rule: refusal creates no accepted debt; world consequences remain possible. |
| K220 | QN2 | K05,K06 | Extend actual expiry/NPC completion; no invented away-story under freeze, K31. |
| K221 | QN3 | K04,K21 | New derived goal sort over known offers; no extra reward state. |
| K222 | QN4 | K16,K25 | Extend known reputation/deed evidence; specialization does not disclose every hidden issuer. |
| K223 | QN5 | K12,K21 | New known-route bundling; unknown distance remains unknown, not author-side pathfinding disclosure. |
| K224 | QN6 | K05,K24 | Extend paid delegation; follower consent/stock/capacity must be checked. |
| K225 | QN7 | K06,K24 | Extend distinct social decline/pass verbs; ignoring remains distinct from making a promise. |
| K226 | QN8 | K09,K19 | New bounded recap from outcome receipts; missing historical data stays unknown, not a fail list. |
| K227 | QN9 | K08,K26,K33 | Duplicate continuity/unfinished business; current heir drops broad world state, so universal second chance unbuilt. |
| K228 | QN10 | K16,K21 | Presentation default, not gameplay storage; raw counters need not become a global completion meter. |
| K229 | QN11 | K05,K29 | World density adjective; independent from storage/history compaction limits. |
| K230 | QM1 | K02,K20 | Preserve unlocked native travel without mandatory quest; generated quests cannot gate existing opening. |
| K231 | QM2 | K18,K21 | New visible landmark projection from known evidence; no hidden-site name leak through map labels. |
| K232 | QM3 | K21 | New uncertain map pins; rumor belief is distinct from verified site identity. |
| K233 | QM4 | K24 | Duplicate fixed threats/unfairness owner; preserve warning scope and no automatic level matching. |
| K234 | QM5 | K10,K24 | Extend exact world facts, not a mirrored regional owner; T14 must migrate definition key/revision binding. |
| K235 | QM6 | K12,K15,K24 | Existing same-body/native travel seams; new journey offers must share paid clock and stop boundaries. |
| K236 | QM7 | K10,K21,K27 | Extend knowledge-filtered view; inherited maps require record carrier and local recheck. |
| K237 | QM8 | K24,K29 | Duplicate functional means/effect ownership; each promised alternate solution needs actual commands. |
| K238 | QM9 | K10,K11 | Existing retained facts/claims/residents for selected worlds; persistence across life change still incomplete. |
| K239 | QM10 | K05,K12,K15 | Extend jobs/choice boundaries; funded multi-day expedition is new selected content, not arbitrary offline simulator. |
| K240 | QM11 | K21,K29 | Duplicate Hidden discovery; unknown places need hints/route rather than mandatory markers. |
| K241 | QM12 | K18,K20 | Duplicate desktop-first requirement; map/region panels must use available laptop width. |
| K242 | QE1 | K21,K24 | Duplicate loop ladder; local-to-world issuer escalation is new content, multiverse later. |
| K243 | QE2 | K06,K24 | Extend witnessed attention/reputation; do not give patrons automatic hidden-build knowledge. |
| K244 | QE3 | K21 | New Ambition follow-up suggestion; fulfilled goal must not auto-accept a larger one. |
| K245 | QE4 | K20,K21,K24 | Duplicate several progression paths; choose one connected local slice without closing other endgame options. |
| K246 | QE5 | K24,K29,K38 | World ceiling is source-specific with outliers; outside/merge layers are later. |
| K247 | QE6 | K19,K22 | Existing local closure leaves play open; full world epilogue needs its own causal event state. |
| K248 | QE7 | K10,K24 | Extend authoritative region/faction effects; downstream small offers derive from actual changed facts. |
| K249 | QE8 | K13,K26,K35 | New run-end payout linkage; local field renewal already exists and cannot be silently replaced. |
| K250 | QE9 | K06,K08,K21 | Existing enrolled aging/teaching; retirement/ruling routes need separate end reasons. |
| K251 | QE10 | K05,K22,K24 | Extend caused crises; player nonacceptance does not stop genuinely active external actors. |
| K252 | QH1 | K12,K27,K38 | New multi-world hub offers; later milestone scope. |
| K253 | QH2 | K12,K27,K38 | New cross-world objective chain with per-instance references and cargo rules; later. |
| K254 | QH3 | K03,K25,K29 | Duplicate acquisition paths; use native source/receipt grants rather than parallel cheat inventory. |
| K255 | QH4 | K12,K26,K27 | Duplicate carrier-bound standing; rumors may travel without automatically granting the new actor reputation. |
| K256 | QH5 | K24,K27 | Duplicate coherent local boards; hub/global offers are separate projections, not duplicate owners. |
| K257 | QZ1 | K16,K20,K25 | Extend deeds/titles; rich observer-specific identity effects not implied by current counter bonuses. |
| K258 | QZ2 | K06,K24 | Extend specific relationship aims; broad companion arc generation is new. |
| K259 | QZ3 | K03,K08,K28 | Existing paid lessons/manual/unlock patterns; reuse world onboarding instead of universal quest gate. |
| K260 | QZ4 | K20,K21 | Duplicate ordinary independent progression direction; existing jobs/crafts remain viable without board enrollment. |
| K261 | QZ5 | K06,K19,K24 | Extend actual harm/standing/witness consequences; morality is not a new global meter. |
| K262 | QZ6 | K01,K29,K36 | Repeatable flag exists; one occurrence settles once, future occurrences use authored per-world limits. |
| K263 | DL17 | K24 | Fixed danger existing design default; player-scaled mode remains world-specific optional policy. |
| K264 | DL18 | K09,K19 | Recap frequency is a preference; every report must use known recorded outcomes. |
| K265 | DL19 | K05,K24 | Per-world crisis pressure reads actor means/cause; no unearned punishments from selecting a dial. |
| K266 | DL20 | K16,K21 | Counts may be read in journal; no default global quest-completion percentage. |

### Section 11

| Code | Part 22 row | Existing seam / owner citations | Disposition and why it matters |
|---|---|---|---|
| K267 | QBK1 | K06,K22,K24 | New pack ending classification; scheduled climax must be a causal node, not a calendar-only finish flag. |
| K268 | QBK2 | K10,K22,K27 | Duplicate era stacking; moving the same live instance forward needs reconciled time/state, not an era label swap. |
| K269 | QBK3 | K22,K24 | New source frontier metadata; publication status and last verified source need pack evidence. |
| K270 | QBK4 | K22,K24 | Duplicate causal branch choices; route-specific closures need real prerequisites and retained consequences. |
| K271 | QBK5 | K05,K22,K24 | Original/generated natural course already owned; campaign threat closure need not invent a canonical finale. |
| K272 | QBK6 | K10,K24,K27 | Duplicate continuity/version distinction; alternate adaptation is distinct data and state, not overwritten live content. |
| K273 | QBK7 | K24,K28 | Optional source-qualified overlay; do not silently apply disputed material to existing saves. |
| K274 | QBW1 | K24,K25,K27,K28,K40 | Updated R1 closure plus sequel/dispute facets; keep source evidence and overlay choice separate. |
| K275 | QBW2 | K24,K25,K27,K28,K40 | D&D setting/edition/adventure bind campaign scope, not a global source ending. |
| K276 | QBW3 | K24,K25,K27,K28,K40 | R1 supplied-source coverage is not final ending or proven current publication status. |
| K277 | QBW4 | K24,K25,K27,K28,K40 | R1 corrects five ongoing titles and B3 multiple challenge worlds; no manufactured per-book final climaxes. |
| K278 | QBW5 | K24,K25,K27,K28,K40 | R1 external month and subjective span require separate clocks; current visitor still has no player loop. |
| K279 | QBW6 | K24,K25,K27,K28,K40 | R1 records completed main/sequel novels; actual era progression needs chronological snapshots. |
| K280 | QBW7 | K24,K25,K27,K28,K40 | R1 keeps exact current source frontier open; proposal rate is not a verified engine clock. |
| K281 | QBW8 | K24,K25,K27,K28,K40 | R1 corrects sequel status; separate original/short-sequel era metadata rather than one closure enum. |
| K282 | QBW9 | K24,K25,K27,K28,K40 | R1 separates completed run, later one-shot and novels; no invented ongoing serialization. |
| K283 | QBW10 | K24,K25,K27,K28,K40 | R1 route-specific continuity/frontier; do not collapse the franchise into one timeline. |
| K284 | QBW11 | K24,K25,K27,K28,K40 | R1 dated publication capture is source evidence; snapshot date is not live update permission. |
| K285 | QBW12 | K24,K25,K27,K28,K40 | R1 split completed adaptations require independent continuity and film bindings. |
| K286 | QBW13 | K24,K25,K27,K28,K40 | R1 completed original and ongoing sequel need separate frontier/era fields. |
| K287 | QBC1 | K06,K22,K32 | Extend causal event scheduling; absence of player is valid, absence of causes can cancel climax. |
| K288 | QBC2 | K19,K24 | New role/evidence record; participant, witness and absent have different knowledge and credit. |
| K289 | QBC3 | K22,K29 | Duplicate disturbance/secret boundaries; changed outcome truth stays behind discovery, reports use ID. |
| K290 | QBC4 | K19,K22 | New prevented-resolution receipt; do not require a climax to occur before awarding legitimate arc evidence. |
| K291 | QBC5 | K22,K24 | Duplicate failure-as-changed-world; supported bad aftermath stays playable, no invented forced run reset. |
| K292 | QBC6 | K22,K32 | Roles/casting proposal; substitute only with actual eligible means, never force canon through dead participants. |
| K293 | QBC7 | K07,K08,K23 | Death and fresh/heir routes distinct; later ghost needs supported embodiment, not current faint counter. |
| K294 | QBC8 | K06,K25 | Extend witnessed renown/attention; how plot notices follows real observers. |
| K295 | QBC9 | K22,K24 | Duplicate causal side beats; changing one does not automatically rewrite every future event. |
| K296 | QBC10 | K21,K26,K34 | Notebook foreknowledge needs carrier/confidence; player canon familiarity alone grants no actor entry. |
| K297 | QBF1 | K06,K24 | New provenance stamp; chapter/edition and game-time frontier must be distinguished. |
| K298 | QBF2 | K10,K17,K24 | Duplicate frozen revisions/compatibility; new canon is new starts or reviewed opt-in conversion. |
| K299 | QBF3 | K24 | Duplicate attribution boundary; generated post-frontier text remains original, no claim of future author canon. |
| K300 | QBF4 | K24 | Source workflow metadata, not gameplay; record exact verified locator and capture date. |
| K301 | QBA1 | K19,K22,K27 | Duplicate epilogue era; current local closure proves only retained local play. |
| K302 | QBA2 | K10,K15,K24 | New chapter jump policy; explicit represented changes and time/age effects needed, no free future stock. |
| K303 | QBA3 | K06,K26,K27 | Duplicate world memory/standing; witnesses and transmission matter, anonymous acts stay unknown. |
| K304 | QBA4 | K13,K26,K35 | New ending-to-prestige carrier/payout; no implicit reward for reading a chronicle page. |
| K305 | QBA5 | K06,K07,K19 | Extend existing recap dialog/read surface with durable ending record; avoid a competing ending reward owner. |
| K306 | QBA6 | K23,K28 | Duplicate new protagonist/start selection; same-world replay and continuing changed instance are explicit options. |
| K307 | QBA7 | K25,K28 | Duplicate earned-era unlocks; only commit a typed unlock after actual eligible ending receipt. |
| K308 | QBM1 | K22,K27,K28 | Duplicate AU overlays; use source-qualified premise and isolated state. |
| K309 | QBM2 | K21 | Ambition template for see/change/prevent ending; known steps only and several valid resolutions. |
| K310 | QBM3 | K12,K27,K38 | Later travelers/refugee cargo consequence; ending record alone cannot create new crossings. |
| K311 | QBM4 | K06,K11,K24 | Extend actual retained actors and clocked life stages; do not reconstruct people from recap prose. |
| K312 | QBM5 | K19,K22 | Existing local arc closure pattern; several scoped endings feed same evidence model. |
| K313 | QBM6 | K14,K26 | Narrow loop proofs exist; MoL visitor is not loop protagonist, resetting source world requires selected retention policy. |
| K314 | QBM7 | K05,K15,K24 | Choice boundaries already pause; presence/offline climax policy needs explicit opt-in clock behavior. |
| K315 | DL21 | K05,K15 | Presence dial extends decision boundary rules; no guaranteed offline climax handling claimed. |
| K316 | DL22 | K21,K29 | Comparison is spoiler preference plus knowledge filter; changed secret outcomes cannot leak in unreached screen. |
| K317 | DL23 | K10,K22,K24 | Frontier freeze/generation choice belongs to world policy and compatible saved content revision. |


### Concurrent section 11 additions read before close

| Code | Part 22 row | Existing seam / owner citations | Disposition and why it matters |
|---|---|---|---|
| K365 | QBW14 | K24,K40 | R1 adds a closed two-part source; preserve edition/closure evidence without independently asserting current publication status. |
| K366 | QBW15 | K24,K40 | R1 adds ongoing source; final-saga label is not completed ending and rate remains proposed. |
| K367 | QBV1 | K10,K24,K40 | Composable ending facets refine T15; one mutually exclusive enum cannot encode sequel/adaptation/dispute together. |
| K368 | QBV2 | K17,K24,K40 | Four frontier endpoints distinguish publication, capture, reading and adaptation; save pins the actually adapted revision. |
| K369 | QBV3 | K10,K15,K40 | Existing played/instance clocks are narrow; subjective/loop/hub rates require explicit mappings and exact integer remainder policy. |
| K370 | QBV4 | K19,K23,K40 | Era-scoped run is optional, not forced death/reset/prestige; reuse closure semantics. |
| K371 | QBV5 | K10,K17,K40 | Static metadata precedes rate adapter; do not retime or mutate current instance snapshots. |
| K372 | QBV6 | K24,K40 | Open source spans/status remain unknown; source qualification is factual work, not director choice. |

### Section 12

| Code | Part 22 row | Existing seam / owner citations | Disposition and why it matters |
|---|---|---|---|
| K318 | RL1 | K06,K15,K21 | New per-world pacing scale; years currently use 360-day minute owner, dev speed is not saved policy. |
| K319 | RL2 | K07,K08,K22,K33 | World persistence is requested/design-owned; current heir does not retain every changed world, faint is not death. |
| K320 | RL3 | K08,K09,K26,K34 | Duplicate five persistence domains; exact carriers/losses needed, player memory is not actor memory. |
| K321 | RL4 | K09,K16,K26 | New typed arc/goal credit; store evidence on completion, bounded biography cannot reconstruct it. |
| K322 | RL5 | K23,K28 | Duplicate optional continuation palette; fresh same-world/earlier perspective/leave require real start and timeline contracts. |
| K323 | RL6 | K08,K26 | Immediate predecessor grave exists; broad enduring world memory and deep lineage remain new. |
| K324 | RL7 | K10,K22,K27 | Duplicate era starts; target one era without requiring full historical simulation. |
| K325 | RL8 | K14,K17,K29 | Saved draws/integrity and narrow anchors exist; exported save safety stays base, fiction rewind needs its own source. |
| K326 | RL9 | K05,K15,K21 | Existing routines/director/jobs support slow middle; general closed-browser execution not established. |
| K327 | RL10 | K07,K24 | World-specific danger direction; current native faint/open/mortal policies retained unless separately selected. |
| K328 | RB1 | K10,K22,K37 | Label existing divergence without copying; real fork requires remapped state/owners/ancestry and archive. |
| K329 | RB2 | K10,K22 | Duplicate immutable template/instance split; new starts remain clean except selected scars/persistent-world mode. |
| K330 | RB3 | K10,K11,K28 | New atlas/travel selection; names and parent alone are not resumable places. |
| K331 | RB4 | K22,K28,K37 | Correct automatic labeling versus real copying; player replay slot and character time power have distinct meanings. |
| K332 | RB5 | K10,K22,K27 | New label projection with knowledge gate; branch naming follows biggest known change, avoid sealed names. |
| K333 | RB6 | K09,K17,K22 | New archive compaction; 4 MiB guarded budget exists, summary-only records lose exact resume and must say so. |
| K334 | RB7 | K22,K28,K38 | Later merge power; reconcile actor/custody/debt conflicts, no merge by matching labels. |
| K335 | RB8 | K22,K24 | Duplicate original-world natural course; original is not canon, legacy migration must classify it honestly. |
| K336 | RB9 | K05,K22 | Later independently caused travelers' branches; NPC label is not actual history generator. |
| K337 | RS1 | K07,K19,K23 | New retirement/close-run lifecycle; existing private chapter closure does not stop a life or pay prestige. |
| K338 | RS2 | K10,K11,K12 | Extend supported departure/freeze; one-realm suspend possible, multi-world continuation later. |
| K339 | RS3 | K12,K20 | Existing selected same-person travel; ascension remains separate and broader routing unbuilt. |
| K340 | RS4 | K23,K25 | New fresh other-world continuation with eligible starts/carrier; later multi-world scope. |
| K341 | RS5 | K10,K15,K31 | Under freeze report retained changes and zero absent local elapsed; general elapsed NPC aftermath needs adapter. |
| K342 | RS6 | K12,K26,K38 | One native controlled body invariant; multi-open archive possible later, multi-body clock scope needs new contract. |
| K343 | RS7 | K06,K19 | Extend known event/closure stopping cues; suggestions do not forcibly end play. |
| K344 | RS8 | K07,K09,K19 | New durable run segment summary; shelf is suspension, not irreversible life end. |
| K345 | RP1 | K07,K13,K23 | New optional run-end prestige choice; decline must leave supported continuations available. |
| K346 | RP2 | K16,K25,K26 | New typed deeds projection across real evidence, not only level or title IDs. |
| K347 | RP3 | K25,K26,K29 | Duplicate carriers/start unlock ledger; no automatic soul traits or shared Notebook fill. |
| K348 | RP4 | K13,K26,K35 | Early-end credit may be recorded; suspension alone cannot repeatedly mint payouts. |
| K349 | RP5 | K22,K23 | Duplicate new-run clean course proposal; continuing an heir/branch is distinct from new canon selection. |
| K350 | RP6 | K10,K22,K38 | New persistent atlas outside protagonist reset; existing heir initialization drops these records. |
| K351 | RP7 | K13,K16,K29,K36 | Per-world repeat value; dedupe occurrence rather than imposing title's once flag on every run. |
| K352 | RP8 | K12,K13,K20,K35 | Accepted separation; current field renewal keeps protagonist, proposed life reset is an unsettled replacement/variant. |
| K353 | RP9 | K20,K24 | Duplicate milestone sequencing; one local prestige evidence path fits, multi-world atlas deferred. |
| K354 | RX1 | K08,K09,K26 | New durable hall of lives; current biography compacted and one previous grave is not complete archive. |
| K355 | RX2 | K06,K26,K27 | Duplicate legend carrier/observer/time rules; no reputation crossing to untouched canon templates. |
| K356 | RX3 | K08,K22,K30 | Later ordinary past-self NPC/record by premise; rich special interaction optional, current lean little/no interaction. |
| K357 | RX4 | K16,K25 | Duplicate optional achievement/earned receipts distinction; trophies do not automatically grant power. |
| K358 | RX5 | K17,K22 | Archive forever is bounded by actual storage; export and explicit resume scope needed without silent deletion. |
| K359 | RX6 | K17,K22 | Whole-save export exists; per-world extraction/import needs dependency closure and identity conflict handling. |
| K360 | RX7 | K20,K24,K28 | New saved policy per run; gentle/hardcore/short-era cannot silently alter existing vanilla save stakes. |
| K361 | DL24 | K22,K27 | World-specific branch classification parameter; does not control whether accepted history is durably saved. |
| K362 | DL25 | K10,K15,K31 | Frozen supported first; aggregate/full ticking is new explicit clock policy and later proof. |
| K363 | DL26 | K07,K13,K35 | New offer timing only after selected reset contract; reading/shelving cannot become a payout trigger. |
| K364 | DL27 | K29,K36 | Per-world repeat pricing; stored source receipt dedupes same act, next real act remains eligible. |

## T6–T21: dependency path and exact proposed persistence

These contracts are proposals. They name concrete fields to resolve the vague “additive array” rows; none is implemented here. One integrator must reserve `main.js`, quest registration, save readers and publisher before implementation. Do not reuse this lane's permission for those writes.

### Shared contract

Use one optional **top-level `run_system`** record, not several unrelated offer/goals/run/profile keys. It owns only the new generated quest lifecycle, ambitions and run/deed evidence. Existing authored quests, command jobs, world state, native stock, relationships, titles and chronicle keep their current owners. References into those owners are IDs and paths, never mirrored live state. No profile key in this first path; that is a separate K25/K28 policy.

Exact empty record on explicit enrollment:

```json
{
  "schema": 1,
  "revision": 1,
  "nextId": 1,
  "activeRunId": "run.1",
  "runs": {
    "run.1": {
      "id": "run.1", "actorId": "player", "status": "active",
      "startedAt": {"clockId": "run.1.joined", "value": 0, "calendarMinute": 0},
      "worldRefs": [], "segments": [], "counterBaseline": {}, "legacy": false
    }
  },
  "generated": {}, "offers": {}, "goals": {}, "posted": {},
  "outcomes": {}, "summaryCursor": 0, "endings": {}, "deeds": {}, "settlements": {}
}
```

Values of zero in the example are placeholders replaced with the actual enrolled clock/calendar, never a fabricated past. Fields belong to their T slice below; unfinished slices can leave their maps empty. Record absence remains absence, not automatic enrollment of an old save. Optional unknown future `run_system.schema` is rejected before storage/load mutation.

Type conventions used in the contracts:

- **ID** is a safe stable string; maps reject prototype keys and duplicate IDs. **N** is a nonnegative safe integer; **R** is positive revision. **Stamp** is exactly `{clockId: ID, value: N, calendarMinute: N}`. Local instance elapsed and joined/calendar times are distinct; explicit clock ID prevents comparing an old life's reset clock against a new one. Joined clock IDs are run-qualified (`run.<id>.joined`); instance clocks use `instance.<id>.elapsed`. `counterBaseline` contains the named K16 counter snapshot with nonnegative finite numeric values, captured at enrollment; it is not an inferred record of when old acts occurred.
- **WorldRef** is exactly `{ownerPath: string, worldId: ID, instanceId: ID, definitionId: ID, definitionRevision: R, continuityId: ID, eraId: ID}`. `ownerPath` comes from an admitted host binding, never arbitrary save traversal. `frontier.main` can be an external native reference for the first realm; do not create a second Frontier world-state owner merely to satisfy this type.
- **EvidenceRef** is exactly `{ownerPath: string, recordId: ID, revision: R}`. **Outcome** is exactly `{id: ID, sequence: N, subjectId: ID, kind: "offered"|"accepted"|"declined"|"expired"|"npc_taken"|"completed"|"partial"|"failed"|"abandoned"|"suspended"|"resumed"|"closed", at: Stamp, actorId: ID, observerIds: ID[], evidenceRefs: EvidenceRef[]}`. Durable compact outcomes survive display-log compression. Sequence is local to this record and rises monotonically across life changes.
- **TaskSnapshot** is exactly `{index: N, description: string, hidden: boolean, conditions: {any?: ConditionGroups, all?: ConditionGroups}}`. `ConditionGroups` maps event names to target IDs to `{target: N, current: N, requirements: scalar-map, restrictions: scalar-map}`. Target counts must be positive except explicitly valid threshold-zero templates. Reject unknown verbs and targets. Native Rewards snapshots use the admitted `Rewards` data grammar, with no functions or prose eval. Task and quest rewards are frozen per accepted generation, not reread from mutable templates.
- **CarryRow** is exactly `{domain: ID, recordRef: EvidenceRef|null, disposition: "kept"|"lost"|"waiting"|"unknown", carrierId: ID|null, destinationRef: WorldRef|null, reasonKey: ID}`. A summary row describes a carrier and destination; it does not execute a transfer. Null/unknown values are shown honestly.

**Compatibility decision shared by all persisted slices:** accept old saves with no block unchanged; initialize only when the player selects the new content. Add `run_system` validation to `save_files.js`, serialize/load it in `main.js`, and include it in guarded import/preflight and atomic `nativePatch` publication (K17). Proposed `fork_schema:3` when this block is present, retaining old schemas 1/2 for unchanged saves. Current older readers accept only 1/2 (`src/save_files.js:99`), so this prevents them loading and rewriting a save without the new block. Test preflight and direct/local load as well as import because version protection at import alone is insufficient. Update `create_save`'s current fixed schema write (`src/main.js:5187`). No downgrade promised; old builds must preserve the original file and decline it. This is a forward-only writer with backward read, not byte-compatible older-writer support.

The run-system revision, RNG mutation, native task progress, expense/reward, outcomes and deed/settlement records must publish in **one existing envelope transaction** (K17). Render and previews do not allocate IDs, roll, advance clocks, mark a recap read or mint rewards. A failed storage write publishes nothing. Metadata and derived views below do not require this block merely to exist.

### Dependency order

**Local quest branch:** structural admission **T10 → T6 → T7 → T8 → T12**, with **T9** after T6 and before a template using a new verb. T10's pure checker can be written first, but becomes playable through T6. T6 and the minimal offer UI/lifecycle of T7 form the first integrated taste; do not mark the emitter alone as delivered gameplay. All T7 offers must pass it; recheck at acceptance/completion. **T11** follows T7 and the existing paid NPC job/escrow binding; **T13** follows T7 outcome receipts and a supported clock policy. **T14** is independent foundational region ownership and precedes any shortage/threat template that actually changes a region. A minimal T6 may read already-owned local facts and needs no universal region map.

**Closure branch:** **T15 → T16 → T18 → T21**. T16 can use a local arc ending; full source climax execution needs causal event content in its world. **T17** follows source-frontier metadata and the event-publication seam; attach provenance before T16 if that ending crosses the frontier. T18 does not require every source world or a general atlas.

**Instance branch, later:** **T19 → T20**, after actual host isolation, native ownership and complete resumable state are bound. T18 segment records can join T20. A one-realm T20 suspend/resume is possible without travel; another-world continuation and branch atlas wait until later. T19 is metadata, not the missing fork adapter. General fork/archive is a separate later dependency, not hidden inside T19's estimate.

A workable topological delivery list covering all requested IDs is: **T10, T6, T7, T8, T9, T12, T14, T11, T13, T15, T17, T16, T18, T21, T19, T20**. Independent branches may be reordered after their named prerequisites. Finish the current playable slice before starting another; the list does not require shipping all sixteen in the first milestone.

### Per-build contracts

**M** means fits within one realm/one prestige layer. It is eligibility, not a demand to add it to the milestone. **L** means full described scope is later. **M/L** gives a bounded local variant now, general world behavior later.

| Code | Build, prerequisites and module extended | Smallest playable slice and why it matters | Exact saved addition / owner | Migration or compatibility; milestone fit |
|---|---|---|---|---|
| K400 | **T6** after T10. Extend `quests.js` registration/deep copying (K01), native quest save/load (K03), `simulation.js` checks (K05), existing quest UI (K04). | One local shortage or threat produces one known-target offer. Accept, perform one existing verb, observe one real consequence and reward. Decline leaves no promise. | `generated[id] = {id, templateId, templateRevision:R, worldRef:WorldRef, runId:ID, issuerId:ID, seed:N, slots:scalar-map, definition:{name:string,description:string,repeatable:boolean,tasks:TaskSnapshot[],taskRewards:Rewards[],questRewards:Rewards}, registeredQuestId:ID, settlementId:ID\|null}`. Existing `save.quests[registeredQuestId]` remains the **only native progress/completed owner**. `taskRewards.length === tasks.length`; frozen `current` values in definition begin at zero and are never live progress. Seed is the committed pre-draw source value; actual stream advances once with the record. | Shared forward-only block contract. Register cloned definitions before loading native progress; suppress load-time rewards/emission. Missing template revision uses admitted frozen definition or pauses with export, never rerolls. Do not fabricate old generated history. **M**. |
| K401 | **T7** after T6/T10. Extend K02 producers/counter snapshots, K05 checks, K18 discovery. | Skill threshold, repeated action or first place entry posts work with a cause line; it stays an offer until accepted. | `offers[id] = {id,questId:ID,runId:ID,worldRef:WorldRef,sourceReceiptId:ID,trigger:{kind:"skill"\|"count"\|"enter",targetId:ID,observed:N,threshold:N},status:"offered"\|"accepted"\|"declined"\|"expired"\|"npc_taken",offeredAt:Stamp,expiresAt:Stamp\|null,clockPolicyId:ID,goalTags:ID[],outcomeId:ID\|null}`. Status changes write Outcomes. Idempotence key is `(runId, sourceReceiptId, templateId, issuerId)` in existing stored offer records. | Default empty on enrollment; no retroactive threshold reward. A load snapshot can show eligibility but must not invent a triggering action. New threshold baseline is current observed state. **M**. |
| K402 | **T8** after T6/T7. Extend K21 goal direction and K18 UI. | One suggested goal and a written/reworded alternative map to one known step and one explicitly unknown step. Complete or abandon without mandatory quest use. | `goals[id] = {id,runId:ID,ownerActorId:ID,text:string,origin:"written"\|"suggested",suggestionReceiptId:ID\|null,status:"suggested"\|"active"\|"declined"\|"abandoned"\|"fulfilled",createdAt:Stamp,parentGoalId:ID\|null,steps:[{id:ID,templateId:ID\|null,questId:ID\|null,knowledge:"known"\|"guessed"\|"unknown",evidenceRefs:EvidenceRef[]}],terminalOutcomeId:ID\|null}`. Known step progress projects from quest/evidence owners; no duplicate step counters. | Shared block, empty old goals. Text is inert and length-bounded; unknown prerequisites never become automatically executable. Keep declined suggestions. Inheritance later references a supported carrier, not copied ownership by default. **M**. |
| K403 | **T9** after T6, before new-verb templates. Extend completed craft/trade/dialogue/book/gift/wait producers feeding `quests.js` (K01/K02). | One successful repair/craft task advances exactly once; canceled/failing work and loading produce no event. Add remaining verbs only with their actual consumers. | **No durable event queue.** Transient packet exactly `{quest_event_type:"craft"\|"sell"\|"talk"\|"read"\|"give"\|"wait",quest_event_target:ID,quest_event_count:N,additional_quest_tags:scalar-map,receiptId:ID}`. Native progress is saved as K03; generated outcome evidence is T6/T7's record. Event receipt participates in the atomic transaction, not a second rewarded stream. | No event migration. Define per-verb counts: successful units sold/crafted/given, completed book/accepted dialogue action, consumed played wait minutes; IDs distinguish product, buyer/recipient and location. No progress on UI open/preview/load. Dispatch already generic, so no new type switch needed. **M**. |
| K404 | **T10** precedes T6 posting and acceptance. Extend registry/native legality/predicates (K03/K24). | Known target and one reachable local objective are offered; missing target/template/unsupported reward is withheld with a truthful internal reason. Dangerous valid work remains available. | **None.** Derived admission `{allowed:boolean,reasons:ID[],bindingRevision:R}`; use frozen T6 refs and existing access/effect owners. | No migration. Revalidate on accept and settlement; runtime change can legitimately fail a formerly valid quest. Validation proves structural feasibility, not victory or current maximum power. **M**. |
| K405 | **T11** after T7 and NPC capacity/funds binding. Extend `simulation.js` commands/jobs/controllers, K17 publication, K24 contract terms. | Post one material-delivery job with prepaid reward; one named NPC accepts, spends actual means/time, succeeds or fails under saved terms. Show refund/forfeit settlement and actual output custody. | `posted[id] = {id,runId:ID,worldRef:WorldRef,templateId:ID,templateRevision:R,issuerId:ID,takerId:ID\|null,status:"open"\|"taken"\|"completed"\|"failed"\|"cancelled",offeredAt:Stamp,jobId:ID\|null,escrowRef:EvidenceRef,outcomeId:ID\|null,settlementId:ID\|null}`. Existing job owns due time/frozen roll/input reservations; existing escrow/custody owner owns coins/items. Bind an escrow ledger if existing command costs do not represent that reward custody. | Shared block; additive escrow binding needs its own validator. Old saves get no posted jobs. Never duplicate escrow amounts in this map or award unsupported materials from a roll. NPC outcome cannot be regenerated after reload. **M** for one local taker; **L** for general parties/institutions/offline delegation. |
| K406 | **T12** after T7/T8. Extend quest projection K04 and known routes K10/K12. | Active-goal match sorts first; known route distance breaks ties, stable offer ID last. Unknown distance shows unknown. | **None.** Sorting derives from `offers`, `goals`, and this actor's known routes. Pin/filter preferences can stay per-browser K18; no gameplay-save field is required by this slice. | No migration. New sorting cannot mutate emission probabilities or leak unreached map locations. **M**. |
| K407 | **T13** after T7 Outcomes and supported clock. Extend K06 reports/K09 biography projection. | Leave the local board while played time advances; return to a known list of arrivals/lapses/NPC takers with actual consequences. On browser closure with frozen policy, explicitly show no simulated changes. | Reuse `outcomes`; `summaryCursor:N` becomes the last durable outcome sequence acknowledged by the player. Acknowledge is a guarded write. Display text can compact, but retain compact terminal outcomes, including observerIds and source references. | Shared block, cursor 0; no reconstruction of discarded old logs. “No save impact beyond offer list” is insufficient if history is compressed: cursor and outcome IDs are required. General closed-browser offers require a separately selected adapter, not this T. **M** local played-time recap; **L** general offline world evolution. |
| K408 | **T14** before state-changing regional emitters. Extend `world_instances.js` definition/fact binding (K10) or existing `state.worlds[worldId].facts` when that host owns the fact (K11). | One known region has control, prosperity and threat; actual funded quest changes one fact and changes the next visible offer. | **No separate region map.** At the selected authoritative fact owner, exactly `region.<id>.control:ID`, `region.<id>.prosperity:N`, `region.<id>.threat:N`. Season is derived from the actual local calendar unless the world explicitly owns a separate season fact. Definition `initialFacts` declares these keys; generator reads through the existing binding projection. | For old instance records, explicit definition-revision conversion preserves old facts/sites/claims and adds authored initial values once. Never read current live definition defaults on every load or introduce new facts into the strict old key set without migration. Existing world-domain host may add namespaced defaults without changing its instance. One writer per fact. **M** one region; **L** global geopolitical simulator. |
| K409 | **T15** before T16; frontier metadata before T17. Extend world-pack/campaign authoring K24. | One selected original local arc has a setting/no-global-ending classification; one later book pack declares continuity and verified frontier without claiming new source reading here. | **No mutable save field.** Pack metadata exactly `ending:{closure:"closed"\|"ongoing"\|"setting"\|"unknown",continuityId:ID,sourceRevision:ID,sequel:{status:"none"\|"closed"\|"ongoing"\|"unknown",continuityId:ID\|null},routeId:ID\|null,adaptationId:ID\|null,disputeOverlayIds:ID[],frontiers:{published:Endpoint\|null,captured:Endpoint\|null,read:Endpoint\|null,adapted:Endpoint\|null}}`. `Endpoint` is exactly `{sourceId:ID,editionId:ID,locator:string,effectiveDate:string\|null,observedOn:string,worldBoundaryId:ID\|null}`; dates are ISO dates, null means unknown. Facets combine, and each endpoint stays distinct (K40), rather than inferring adapted scope from publication count. | Metadata-only if kept outside strict `WorldDefinition`. If embedded inside it, K10 validator and frozen definition snapshots must admit it through a versioned conversion. “None; data” does not authorize adding an unknown strict field. Existing saves retain pinned content revision. **M** generic metadata; source-world roster **L**. |
| K410 | **T16** after T15 and actual causal climax/arc resolver; T17 if post-frontier. Extend K06/K19 and chronicle UI K07. | One local arc resolves by intervention, abstention or prevention and shows known role, changed state and remaining ordinary work. No forced life end or free prestige. | `endings[id] = {id,runId:ID,worldRef:WorldRef,eventId:ID,eventRevision:R,scope:"arc"\|"world",resolution:"resolved"\|"prevented"\|"missed",outcomeRef:EvidenceRef,role:"participant"\|"helper"\|"witness"\|"absent"\|"opponent"\|"cause",settledAt:Stamp,knownFactRefs:EvidenceRef[],provenanceRef:EvidenceRef\|null}`. Private outcome owner retains secret truth; UI filters references through actor discovery. | Shared block, empty old endings; never infer canonical world completion from local `life.closed`. Canon comparison is optional, source-qualified and spoiler-filtered. Same event/instance resolution recorded once, separate later occurrence can exist by world law. **M** local arc; full book endings **L**. |
| K411 | **T17** after T15 frontier and generation publication; precede T16 when relevant. Extend K06 event receipt/log insertion, K05 generation. | One event generated beyond a verified frontier shows “original, past verified source” in known chronicle projection and persists that provenance. | Add to the authoritative new event/ending receipt (not all unrelated legacy log lines) exactly `provenance:{kind:"verified_source"\|"original"\|"unknown",sourceRevision:ID\|null,frontierLocator:string\|null,frontierStage:"adapted"\|"unknown",pastCanon:boolean\|null}`. Chronicle prose is a projection of that receipt. | Old entries migrate to `kind:"unknown",pastCanon:null`, **not false meaning verified canon**. Existing explicitly authored original events may be classified from their frozen admitted definitions. K06 validators/serializers must preserve added receipt fields. Never apply a newest frontier retroactively to old generation. **M** provenance infrastructure; full post-canon generation **L**. |
| K412 | **T18** after T16 for ending summaries; can use existing old-age end without a full world climax. Extend `chronicle_ui.js`, `life_experience_host.js`, K09 biography and K19 closure records. | One life/run segment ends or suspends; show actual deeds/carries/unresolved known work. Existing old-age heir route remains available. Reading summary pays nothing. | Append `runs[id].segments[]` record exactly `{id:ID,kind:"life_end"\|"retirement"\|"chapter_close"\|"suspend",reasonKey:ID,worldRef:WorldRef,endedAt:Stamp,outcomeRefs:EvidenceRef[],endingIds:ID[],goalIds:ID[],carryRows:CarryRow[],unresolvedRefs:EvidenceRef[]}`. `runs[id].status:"active"\|"suspended"\|"ended"`, actorId/start/baseline remain. New life gets new run ID; resumable suspension keeps ID. | Shared block. Legacy enrollment starts `legacy:true` with only known present baseline; old mortal end can get a marked partial summary, no invented lifetime deeds. Retirement requires an explicit lifecycle adapter; do not set chronicle `endedAt` except valid old age. Heir/fresh-run builders must preserve archive block and create next run transactionally. **M** bounded local summary; complete hall/any ending mode **L**. |
| K413 | **T19** after genuine instance/continuity classification; before T20 metadata use. Extend `world_instances.js` and each admitted consumer validator K10/K11. | One current instance shows an honest public label and unknown/known drift. A changed label does not spawn a second world or disclose an unreached outcome. | Instance **schema 2** adds exactly `provenance:{kind:"canon"\|"original"\|"au"\|"branch"\|"unknown",forkedFromInstanceId:ID\|null,forkedAt:Stamp\|null}`, `display:{publicName:string\|null,renamed:boolean,driftBand:"near"\|"bent"\|"broken"\|"unrecognizable"\|"unknown",basisReceiptIds:ID[]}`. Existing fields retained. Keep `parentInstanceId` exclusively for enclosing ownership. Visit schema need not change merely because instance schema changes; decouple their current shared constant deliberately. | Schema-1 reader preserves old data; known frozen definition maps classify original/visitor/AU precisely, otherwise `unknown`. Never blanket “canon, near”. Preserve definitionRevision and old host identity constraints. Actual fork remapping/archive needs its separate adapter. **M** local metadata only; branch atlas **L**. |
| K414 | **T20** after T19/T18 and host suspension/isolation adapter. Extend actual departure/arrival and local clock services K10–K12. | Suspend one local life at safe boundary, save/export, resume same person and exact stock/claims/jobs without elapsed gains. Multi-world variant uses a real permitted passage and one active visit. | **No redundant `shelvedInstances[]`.** New run status and a T18 suspend segment plus an ended existing visit encode suspension. Host retains actual instance/native owners. Optional run resume binding exactly `resume:{worldRef:WorldRef,endpoint:{worldId:ID,instanceId:ID,regionId:ID,layerId:ID},nativeLocationId:ID,suspendedAt:Stamp,ownerRevisions:scalar-map}` on suspended run only; remove on successful resume. | Shared block plus schema-2 instance read. Returning reconciles `observedAt` to joined time while preserving frozen `elapsed`, then creates one new visit; never copy native bags. First local prototype stops all host ticking while suspended. Inter-world version must suspend all owned deadline/controller/job domains correctly, not merely end a visit. Existing supported return route can do departure; arbitrary target worlds remain later. **M** single-realm pause/resume; full requested shelving/elsewhere **L**. |
| K415 | **T21** after T18 identity/baseline, T6/T8/T16 evidence as available, and an explicitly selected reset/carry contract before payout. Extend titles counter reader K16, typed completion receipts K19, transition machinery K39 and existing renewal K13. | Record one local promise, arc or Ambition as a deed; summary shows what counted and why. In an authorized later continuation, preview one prestige settlement, confirm once and observe the exact carry/reset. | `deeds[id] = {id,runId:ID,worldRef:WorldRef,kind:"arc"\|"ending"\|"ambition"\|"discovery"\|"help"\|"visit"\|"counter",occurrenceId:ID,evidenceRefs:EvidenceRef[],at:Stamp,quantity:N,policyId:ID,policyRevision:R}`. Unique `(runId,occurrenceId,policyId)` for the same real act. `settlements[id] = {id,runId:ID,policyId:ID,policyRevision:R,deedIds:ID[],at:Stamp,resetKind:ID,nextRunId:ID\|null,carryRows:CarryRow[]}` is written atomically with actual reset/next-save publication. Existing authoritative outcome/claim must establish every reference; titles are display, not the reward owner. | Shared block; no backfilled title payouts, baseline counters at enrollment, distinguish faint/death and calendar years/lived time. Preserve compact deed facts through log compaction. New real repeats get new occurrence IDs and world-defined pricing, not import-union double pay. No profile currency/key until its reset/import policy is settled. **M** evidence plus one selected layer; broad meta shop/second reset engine **L**. |

### Future acceptance, not checks run

For each implemented slice later: focused source checks for the named consequence, one rebuilt fresh-origin desktop exercise at 1366×768, exact pending/settled save reload and literal-file import, an untouched older save, and failed-write/no-double-settlement evidence. Scope negative cases to the change. T19/T20 additionally need isolated actor/stock/claim state and frozen local time on return; T21 needs exact reset/carry evidence. These are acceptance criteria for a future authorized build, not results of this docs-only lane. Full mobile optimization, every world and unrelated existing native gates are not dependencies of local T6/T8/T18.

## Questions only Weibao can settle

Five ranked taste/policy choices, not implementation blockers for this audit or pure read-only prototypes. Keep alternatives reachable; defaults below are recommendations, not accepted decisions.

| Code | Rank and open choice | Recommended default and why it matters |
|---|---|---|
| K450 | **1. What is the first run-end prestige reward/reset, relative to the existing field renewal?** Current code retains the person; RP8 proposes a new protagonist. | Keep existing renewal terms, collect deeds first, and propose one optional next-life reset with a named carrier and exact retained domains. Treat richer resets as later variants within the selected layer, not automatically additional layers. Avoid accidental second-prestige rewards. |
| K451 | **2. Usual next protagonist after an actual life end: fresh random life, successor, or chosen supported start?** P1 usual-fresh remains proposal; optional heirs is already accepted. | Fresh coherent eligible life suggested first, with actual heirs and same-world continuation adjacent. Existing bounded heir stays playable. Preserve all choices without compulsory dynasty preparation. |
| K452 | **3. Which elapsed-time policy should the first long-run world use, including aging, irreversible beats and absent holdings?** Per-world dials are accepted, exact selected offline behavior is not. | Frozen absent worlds and no closed-browser aging; explicit funded safe routine review for active work, pause at involved irreversible beats. Lived-time/harsh modes remain optional world policies. This avoids losing a life through an unchosen clock policy. |
| K453 | **4. What should a plain “close this chapter” or shelf earn, and what qualifies as a new rewarding occurrence?** This controls whether quick suspension counts like death or ending. | Chapter/shelf records closure and earned deeds but pays no new prestige merely for toggling suspend/resume. One settlement per real source occurrence; repeat deeds/ending value follows the world adjective. Preserve partial-run credit without a menu-based reward loop. |
| K454 | **5. Should future profile unlocks/codex survive hard reset, and what happens to discoveries across fresh characters/imports?** Run-contained evidence can ship without a profile. | Run archive travels with export; add a separate explicitly described profile later, survives ordinary new-game resets with a separate clear-profile action. Player codex grants no actor knowledge; sealed pages still require their route or explicit unsealing. Set reset wording and import deduplication before profile writes. |

Already settled or reasonably resolved without asking again: desktop first, mobile deferred; optional heir; source carrier for crossing knowledge; natural course unless disturbed; automatic retention of qualifying branches with renamable biggest-change public names; reasonable repeat variants; no forced choice that removes other supported options. Branch threshold, packing quantities, display sorting and local contract implementation can be reversible proposals. Source frontier dates, valid save references and actual ownership are factual qualification work, not personal design questions.
