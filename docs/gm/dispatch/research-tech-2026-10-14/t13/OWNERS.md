# T13 implementation owners

2026-10-14. **All R architecture choices are proposals.** This is a build brief,
not a selected implementation or reservation. Authority remains [COMMON](../COMMON.md),
[PROJECT](../../../../../PROJECT.md), and [rounds 3-9](../../../../TECHNOLOGY_AND_PROGRESSION.md:513).
Target: 1366x768 laptop/desktop; mobile deferred. First milestone remains one
realm and one prestige layer. Strong means may satisfy a gate directly.

## R1. Read-only code audit

SOURCE below means inspected code, not current browser or test proof. Paths refer
to main unless explicitly prefixed with a worktree. Locators were refreshed
against this checkout, rather than copied from T1's older line offsets.

| Area | Source and concrete finding | Architectural consequence |
|---|---|---|
| Save envelope | `src/save_files.js:45`, `:79`, `:109`, `:168`, `:196`, `:206`, `:219`; `src/main.js:5227`, `:5329`, `:5361` | Optional owners have individual validators. Import decodes, validates, preflights then writes. Fork schemas 1/2 and expansion schema are distinct. Propose additive `save.research`, with its own schema; no fork/expansion version bump solely for that top-level field |
| Migration | `src/save_migration.js:3`, `:14`; `src/save_compatibility.js:11`; `src/main.js:5350` | Existing v0.6 biography/kit migration and retired data keep their meanings. New owner does not infer experiments from old XP, recipes, kills or books |
| Host transaction | `src/expansion_persistence.js:7`, `:15`, `:36`, `:48`; `src/main.js:4161`, `:4167`, `:4190`; `src/native_craft_transaction.js:21`, `:30` | Expansion stages a whole envelope then writes before live publication. Native item/component crafts mutate live owners inside a rollback scope. Add research to each producer's actual transaction, including its save snapshot and rollback binding. Other craft paths require a separate audit |
| Notebook and panels | `src/adventure_notebook.js:52`, `:93`; `src/panel_kit.js:7`; `src/workspace_layout.js:8`, `:33`, `:89` | Notebook is a router and may stay hidden without existing familiarity. A research question must explicitly enable its route. Panel kit owns discovery/ARIA/settings; workspace owns dock/layout persistence. Rendering is read-only |
| Cards and status | `src/cheat_cards.js:2`, `:32`, `:46`, `:65`, `:85`; `src/status_window.js:23`, `:36` | Valid card data runs no hooks. Panel enum is fixed. Status renders core stats from the first qualifying status card; merely adding an RC card does not implement its reveal or acquisition. Explicit research capability selector required |
| Native identity | `src/items.js:231`, `:238`; `src/components/inventory_component.js:21`, `:48`; `src/gameplay_transactions.js:27` | ID/components/quality identify a stack kind. Equal keys merge counts, including identical equipment. Generic item-key validation does not establish unique specimens or provenance. No blanket claim that non-stacking equipment is already safe |
| Existing special identities | `src/world_completion_strip.js:5`; `src/items.js:1217`; `src/mixture_state.js:61` | Stamped measured strip and mixture product keys have special readers. These are bounded precedents, not a general item-instance API. Mixture composition identity is not an individual vial history |
| World facts and knowledge | `src/expansion_engine.js:70`, `:82`; `src/simulation_effects.js:281`; `src/simulation_contracts.js:249` | World facts admit scalar values, not arbitrary nested blocks. Existing knowledge keeps latest equal/higher seen/interpreted/understood account. Neither is the general multi-trial store. New truth records belong in research; existing predicates read a small explicit scalar adapter |
| Feed | `src/event_feed.js:37`, `:87`, `:102`; `src/event_feed_ui.js:16` | Feed projects discovered events/settled receipts and keeps eight news rows. It cannot settle research, be evidence storage, or infer private NPC actions. Add a knowledge-safe reader and fold cosmetic whispers only |
| Seeded draws | `src/seeded_streams.js:23`, `:47`, `:56`, `:64`, `:70`, `:105`; `src/main.js:5362` | Saved stream root is immutable in the inspected API; cursor cells advance and logs trim. `unitDecision` is pure; `keyedUnit` writes log, so is not a preview API. Generated truth must be retained beyond the bounded draw log. Legacy no-seed fallback is 1 |
| Life record | `src/life_record.js:1`, `:4`, `:41`, `:52`, `:75` | Lossy biography, bounded recent/year records, no research kind today. Use existing `memory`/`legacy` for selected moments; no research reward, prerequisite or dedup authority here |
| Packs | `src/content_packs.js:55`, `:88`; `src/structured_pack_state.js:23`, `:29` | Optional content packs are not T6 invention packs. Structured content already requires exact revision/hash. Extend admission through an adapter, not by passing planner data to the current unrelated schema |
| Unmerged typed outcomes | `.claude/worktrees/proc-p34-spine/src/lore_history_state.js:18`, `:34`; its `p34/CHECKPOINT.md` | P34 has optional loreHistory, fixed Village action types, capacity 96 and reference-aware eviction. Reuse settlement refs after integration/explicit extension. Do not duplicate its economic outcome ledger or assume it accepts research today |

## R2. IM1-IM8 refined

All new module paths below are proposed. Pure code accepts plain detached data,
explicit IDs/revisions/time and returns values or structured rejection. No pure
module reads DOM, global game owners, localStorage, network, wall clock or live RNG.
Host adapters bind existing owners; UI consumes only authorized projections.

| IM / proposed owner | Pure versus host | Inputs -> outputs | Existing module extended or adapted |
|---|---|---|---|
| IM1 `src/data/research_functions.js`, `src/research_catalog.js` | Authored data plus pure validation/compiler | Namespaced verbs, magnitude/form descriptors, local unit/law refs, methods/primitives -> canonical T6 pack and function lookup | New owner; adapts T6 `src/data/invention_pack_home.js`, native recipe/skill IDs. Registry verbs are not extra XP skills. Preserve T6's exact descriptor matching; unsupported tuple is not impossible physics |
| IM2 `src/research_state.js`, `src/research_view.js`; `src/research_host.js` | Pure store/reducer/projection; host transaction binding | Envelope + admitted observation/lesson/trial event + actor/endpoint/means -> detached updated research, known questions/claims and explicit consumer request | Extends save/read/publish seams in main/save_files/expansion_persistence and native craft rollback. Notebook/feed/life are readers. Existing simulation K remains its own local consumer; no automatic TK-to-three-stage conversion |
| IM3 T6 `src/invention_planner.js`; proposed `src/research_roadmap.js` | Existing pure planner plus pure facade; panel host elsewhere | Pinned compiled pack, admitted world rules/current capabilities, known target, actor claims -> truth graph/witness internally, known roadmap publicly, optional pin candidate | Reuse T6's five APIs unchanged initially. Add T9 admission/limits/receipts before exposing imported graphs. No scheduler, cost optimizer, arbitrary free text or critical-time estimator is present |
| IM4 `src/research_pack.js`, `src/data/research_pack_home.js`; T9 `src/invention_danger_lint.js` | Pure pack/lint admission; loader is host | Definitions + source/era pins + consumer allowlist + revisions -> validated immutable manifest/bundle, conditional/unbound/unsupported results | Adapter to `content_packs.js`/structured-pack retention, not replacement. Demonstration T6 pack remains unbound data. Offline authoring emits this same contract; runtime LLM remains unselected |
| IM5 `src/research_world.js`; `src/research_world_host.js` | Pure generator/reducer on supplied draws; host handles enrollment/schedule | Frozen endpoint/law/policy, saved seed/result, actual transmission/recipient/stock refs -> regional capability and history records; known signs through projection | Extends scalar world-fact readers, world_instances/time/simulation boundaries and seeded_streams. Stores nested truth in research, not nested `world.facts`. No second purse/stock/calendar. T8 B26-B30 refine this deferred owner |
| IM6 `src/research_provenance.js`; exact specimen consumer adapter | Pure provenance/reference validation; host binds item keys/custody | Actual output cause + validated specimen identity + maker/place/date -> retained provenance; observer means -> known provenance line | Extends special stamped-key/native identity patterns and items loader, never all native keys implicitly. First display can use a legitimately known existing stamp. General lots/copies require new merge/split/transfer/consume policy |
| IM7 `src/research_texture.js`, proposed `src/data/research_text_home.js` | Pure presentation selector; existing display/settings are host | Existing observed properties, current authorized skill/knowledge/body channels, texture preference -> safe cue/ambient line or no line | Extend crafting_detail/display/location projection and display_settings. Skill adds vocabulary, not invented cracks, injuries or knowledge. Texture off changes no mechanics, prices, draws, rewards or obligations |
| IM8 `src/research_reveal.js`; `src/research_panel.js` | Pure capability/visibility projection; DOM panel host | Held acquired/awake matching card, scoped reveal stage, research/roadmap/provenance refs -> permitted compare view and reader navigation | Extend cheat_cards/status_window and definePanel/workspace registration. Suggested RC2 uses existing `status-window` card UI plus a scoped link into the same research panel; no card enum change needed. Real acquisition and policy still must be built |

T16 now owns isolated implementation of the T9 QA packet; those modules are not integrated main-checkout APIs at this read. Auxiliary T9 modules `invention_qa.js` and `invention_receipts.js` remain pure.
The receipt module implements graph/manifest capture **inside the single research
envelope**, not a second `inventionReceipts` top-level save owner. This reconciles
T9 Z5's proposed naming with R3. Existing typed economic receipts stay with P34 or
their current transaction owner; research retains required epistemic basis and refs.

## R3. OM boundary and host contract

Truth -> admitted evidence -> actor claims -> screen. Each arrow requires actual
means, event and scope. UI receives the last projection, never raw world truth,
full pruning reasons, catalogue totals or hidden availability. RC2 is an explicit
truth-view means scoped to one target, not permission to read unrelated secrets.
Revealed facts become learned claims only through a separately recorded supported
observation; opening a panel cannot grant mastery or correction.

Proposed pure APIs: `emptyResearch()`, `validateResearch(owner,refs,limits)`,
`reduceResearch(owner,event,bindings)`, `compactResearch(owner,pins,limits)`,
`knownResearchView(owner,actor,endpoint,means)`,
`captureRoadmap(owner,input)`, `knownRoadmap(owner,projectId,actor,means)`.
Result shapes are `{status:'ok',research,publicEvents,consumerRequests}` or
`{status:'rejected',code,ref}`. No consumer request applies an effect by itself.
Names and shapes are proposed; T6's current five functions retain their signatures.

Host flow: read/quote -> verify actual producer revision and clock -> build detached
candidate or capture native rollback binding -> reserve/pay native resources and
stage research/draw/result -> validate full envelope and refs -> guarded write ->
publish all owners -> render/feed/optional biography. Failure before durable write
restores every bound owner, including research, stock and RNG. Failure after write
refreshes display without replaying settlement. Native scope currently covers only
items/components at `src/main.js:4162`; do not claim universal atomic craft coverage.

T6 `roadmapView` uses wrong-belief labels but only nodes retained in the lawful
graph (`.claude/worktrees/rt-t6-planner/src/invention_planner.js:206`). False or
now-pruned hypotheses therefore live in IM2 claim records, rendered beside the
roadmap. A compiler supplies TK 0-5 to T6 from admitted claim fidelity; its `wrong`
flag is treated as a projection hint for an attributed belief, never an engine
correctness oracle or a player-visible truth verdict. Natural epistemic status is
suspected/supported/contradicted, not a hidden omniscient correctness flag.

## R4. Coverage without implicit scope

| Rounds / lane joins | Where represented | What remains separately selected |
|---|---|---|
| RV/RQ/RU/RF, T1 C1/C2 and T3 Q41-Q43 | IM2 questions/receipts/claims, producer-specific consumer adapters | Paid comparison content, rider rates, stock and played-time contract |
| RB/RP/SC/SS, T4 H6/S1 and T12 | Claim evidence and recipient-specific lesson/copy refs | No automatic forgetting, teaching penalty, injury or intelligence tax |
| PI/PM/PS/PC/PP, T5 and T7 | IM1/3/4 descriptors, retained lawful methods and known targets | Runtime grammar, quantities, schedules, power faculty and actual ability consumers |
| PW/TW/KL/UE/IN/TE/EC, T8 | IM5 regional/recipient/history refs | NPC actor bridge, natural-course schedule and broad economy |
| MS/MU/SW/SE/SN/SH, T10/T11 | IM7 known-only text; exact numeric readings require evidence | Market movement causes, persistent accidents and adoption need real state |
| RC/OM/IM, T14 and T9 | IM8 capability selector; R3/R5 save contract | One legitimate acquisition route and selected reveal scope; validator pass alone is data proof |

World content freezes source/era/body/continuity before admission. T2's W01-W32
are qualification leads, not accepted world implementations. Preserve canon-first
priority and paused game-world queues. Home fixture proof does not impose Frontier
as the player's required opening. Dangerous nodes retain PI9 abstraction; no sealed
truth is written in this public architecture.
