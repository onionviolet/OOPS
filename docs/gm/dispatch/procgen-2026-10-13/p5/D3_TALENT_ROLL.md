# D3: earned talent roll

Status: PROPOSAL, source-audited 2026-10-13. No implementation or gameplay proof. Input hashes: [AUDIT_SOURCES.json](AUDIT_SOURCES.json). Rank: W2-3.

| Slice | Outcome Weibao can play | Owner docs | Dependencies | Proposed branch / port |
|---|---|---|---|---|
| D3-A Earned local knack | Finish a short work or observation chapter, settle an action-shaped talent, then use it in a real repeatable paid task | [Simulators](../../../../SIMULATORS_AND_CHEAT_IMPLEMENTATION.md#talent-generation-considerations-2026-10-10), [Cheat library](../../../../CHEAT_LIBRARY.md#implementation-proposal-from-reading-the-code-on-2026-10-10) | P1 saved streams; P2 knowledge projection for any undiscovered fields. P3/P4 optional, not blockers | `proc/w2-d3-talents` / 19430 |

## Live audit and direction

| Code | Source evidence | Finding / disposition |
|---|---|---|
| F1 | `src/expansion_engine.js:73-79,195-207,303-325,500-507`; `src/capabilities.js:4,22-35,41-66` | A rolled talent should be a registered `kind: trait` source under `expansion.actors.player.sources[sourceId]`. That record stores acquisition, revision and receipt, not arbitrary charges/grades. A separate validated talent ledger owns roll metadata; static definitions own grants. |
| F2 | `src/expedition_content.js:64-78` | Field eye already demonstrates an authored random trait. It is not action-ledger talent generation. The first consumer can reuse capability-driven local work rather than build a simulator. |
| F3 | `src/expansion_engine.js:479-485,517-521,569-579`; `src/expedition_content.js:89-96`; `src/village_content.js:88-91` | Tables support contextual odds and saved outcomes. Packing already consumes a capability to change duration. A new repeatable practice task can consume a talent without editing the established one-time crossing progression. |
| F4 | `src/life_record.js:1,14-15`; `src/expansion_engine.js:529-531` | Biography and rolling history are lossy. Neither can be reward authority. Record successful completed work once by completion receipt in a dedicated chapter ledger. |
| F5 | `src/cheat_cards.js:1-2,31-68`; `src/main.js:350,1620-1649,5182,5291`; `src/save_files.js:42` | The Oct 10 [audit](../../../../audits/cheat-implementation-2026-10-10/REPORT.md) is stale about missing cheat save ownership and unreachable heirs. Cards now exist and heirs have callers. Cards describe future hooks; they do not implement earned talents. Do not add another cheat card owner or rewrite succession for this slice. |

Weibao's talent direction (`docs/USER_VISION.md:1778-1792`) requires action to set theme and tilt grade, with seeded selection, useful weak outcomes and innate/acquired possibilities preserved. `PROJECT.md:303-310` protects one realm/one prestige and existing saves. This local chapter is an original prototype, not a claim to reproduce a supplied novel or simulate a whole life.

## Conflicts and gaps

| Code | Conflict / gap | Proposed resolution |
|---|---|---|
| R1 | Simulator pipeline permits reload reroll; COMMON requires no reload reroll | Persist the settled outcome and stream state. A future paid/world-supported reroll gets a new explicit receipt; preview, reload and Import never invoke it. |
| R2 | Cheat library suggests arbitrary cheat state under `actor.sources`; source validator constrains that record | Keep grade/theme/settlement in `expansion.talentRolls`, with closed keys and a cross-reference to the standard source instance. |
| R3 | Positive-only grants cannot express curses; generic native stats do not automatically consume sources | D3-A uses positive registered grants with explicit task consumers. Curses, general stat modifiers, slots, theft, innate reconstitution and cross-life transfer remain later authored routes. |
| R4 | Existing source grant silently ignores already-owned unexpired sources | Eligible archetypes exclude owned sources before picking. If the pool is empty, choose a documented useful mastery outcome for an owned archetype, with its own task consumer. No empty roll. |
| R5 | No lossless chapter/action ledger or dream-settlement caller | Add the small opt-in practice chapter below. A full simulator and actual-death reward integration are separate slices, not prerequisites. |

## Implementation contract

Prototype content: two selectable practice tracks, work and observation. Offer three short exercises per track through existing local action patterns, with real time and stamina costs, an obtainable ordinary input and a useful result. Allow a bounded queue of three paid exercises that stops on shortage, respecting the existing occupied-actor/scheduler contract; active clicks are not required for every completion. Starting another chapter is repeatable through those terms, not a universal lifetime quota. Each chapter ends after three completed exercises or an explicit early settlement; cancelled/failed exercises earn no successful-work credit but can record a distinct attempted tag. Never count a scheduled action twice at Save or reload.

Create `expansion.talentRolls = {schema:1, revision:1, nextChapter:1, active:null, settlements:{}}` only at opt-in. Active record: chapter ID, world/actor IDs, starting clock, revision, completion receipt IDs and counters `{work, observation, difficult, attempted}`. Settlement: chapter ID, frozen counters, theme, grade, archetype/source ID, acquisition receipt, table revision and draw receipt IDs. Validate references, integer bounds and agreement with the acquired source. Compact closed chapters to source-linked summary records, preserving active receipts and each owned talent's authoritative settlement.

Algorithm: (1) completed exercise tags determine theme by greater count; equal counts use declared track, so slots come from deeds rather than a random noun. (2) Base grade weights are 60/30/10 for grades 1/2/3. Each completed harder exercise transfers 5 weight from grade 1 to grade 3, capped at three transfers. These are prototype numbers; preview explains only known contributors. (3) One `talent.grade` draw picks grade, one `talent.pick` draw picks equally among two authored eligible archetypes at that theme/grade. Register twelve source definitions. (4) Grant source and commit settlement atomically with the P1 cursor update. Duplicate settlement returns the saved receipt without draws or grants. Preview returns odds without consuming either stream. Stable pool ordering is by ID, and frozen revision/results survive content edits.

First consumer: a new repeatable Village preparation task, obtainable without Frontier enrollment, costing 6 coins, 4 played minutes and 1 stamina for one actual `SURVEY_KIT_KEY` from `src/expedition_content.js`. Its stock is ordinary paid stock, with no campaign-credit effects or changes to legacy survey predicates. A second repeatable local inspection task costs 1 coin/3 minutes/1 stamina and grants 6 Perception XP from actual completed work. Register the following archetype families at each grade; this yields twelve fixed source definitions, not dynamically executable grants:

| Archetype family | Theme | Grade 1/2/3 consumer |
|---|---|---|
| Ordered hands | Work | Kit task duration minus 1/2/3 minutes, floor 1 |
| Frugal layout | Work | Kit task fee minus 1/2/3 coins, only while the task's local workbench is dry |
| Patient eye | Observation | Inspection duration minus 1/2/3 minutes, floor 1 |
| Mark reader | Observation | Inspection grants an additional 2/4/6 Perception XP after actual completion |

Each uses a registered capability queried by this task's preview and committed cost/duration/effect resolver. Base tasks remain useful without a talent. If both archetypes at a rolled theme/grade are already held, the nonempty mastery fallback grants one paid-chapter bonus `SURVEY_KIT_KEY` with an item acquisition receipt instead of modifying a source or silently discarding the reward. No native global XP/stat change. Costs, duration and outcome are frozen at commitment; inspection cannot retroactively accelerate itself when its chapter settles. These original names/numbers remain proposals.

Each exercise offers ordinary versus extended practice. Extended work completes two sequential base preparation units; extended observation completes two sequential inspections. Pay both units' actual costs/time and receive their ordinary outputs, but emit one chapter exercise receipt tagged `difficult` only after both finish. An interrupted pair records attempted work, not a harder completion; no retroactive credits. The three-exercise queue stores unit-level progress/cost receipts. This supplies an attainable action-based grade tilt rather than trusting a caller-provided difficulty flag.

Persistence: absence stays absent on old saves and does not award historical deeds. Root selects the next compatible optional engine schema after P1–P4 integration, rather than reserve a numeric version here. Validate before save publication and Import, reject unsupported future versions without replacing the existing slot. Retain a small revision resolver for acquired sources; never silently recompute a talent from a seed after catalogue changes. Across-life carry is explicitly not granted by D3-A and remains a separate carrier contract.

File ownership: builder owns new `src/talent_roll_{state,content,host}.js` and focused tests. Root serializes registration/validation/publication edits in `src/expansion_engine.js`, `src/expedition_content.js`, `src/main.js`, `src/save_files.js`; P1 adapter is used rather than changed. No `life_record.js`, `life_experience_host.js`, P2 item identity or P4 people rewrite. Reverify the exported native kit key and cost-effect path at integration; do not change legacy crossing eligibility to demonstrate a talent.

## Acceptance checklist (future, all NOT RUN)

- [ ] A1 SOURCE: two different completed action ledgers pick their proper theme, grade odds differ with harder deeds, every grade has a useful consumer, empty pools use mastery; duplicates/cancellation/previews do not gain credits or consume draws; unrelated streams remain unchanged. Appropriate tests and builder build pass.
- [ ] A2 NATIVE: fresh origin, choose Village practice, pay/complete exercises, settle, read the deed-based reason, use the acquired talent in its next task; show before/after actual time or access. Do not substitute a fixture award for the player path. Seeded-native cases may cover all twelve candidates separately.
- [ ] A3 PERSISTENCE: Save/reload during a chapter and after settlement, then Export to a file and literal-file Import on a second fresh origin. Compare counters, source, revision, outcome, next draws and task duration; legacy absent save remains behaviorally unchanged.
- [ ] A4 FAILURE: failed durable write leaves inputs, chapter, source and streams unpublished; stale/duplicate settlement and unsupported imported metadata fail without changing the active save. No forced death or prestige to reach the consumer.
- [ ] A5 UI: rebuilt 1366x768 and 1600x1000; known theme/odds, settlement and repeat task readable in existing panels, ordinary actions remain reachable. Mobile, whole-life simulator, innate reroll and cross-world retention deferred. Director acceptance of names/numbers remains separate.
