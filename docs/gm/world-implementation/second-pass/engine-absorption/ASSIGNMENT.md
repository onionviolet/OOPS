# Selective engine absorption GM

2026-10-04. Direct human request in assessment chat `01a109e5-344f-7941-8d55-156d37a15716`: “adjust accordingly into the plan accordingly? Make seperate game master to look on this further accordingly?” This is a separate sustained planning/research role. The human-directed amendment is in [canonical plan revision 5](../../IMPLEMENTATION_PLAN.md#selective-engine-absorption-and-scope-control). Runtime Engine/Ability/Original implementation remains held for review.

## Goal and ownership

Determine which external engine/tool capabilities and architecture patterns materially help the existing YAIRPG vision, then deliver a source-backed adoption/defer recommendation with exact local seams and concrete player examples. Compare reuse against extending the current engine and independently implementing useful patterns. Do not assume a candidate must be adopted to finish the task.

The assessment coordinator owns this initial assignment, input snapshot and dispatch receipt. Exclusive GM writes: this directory's REPORT.md, FINDINGS.json, DEPENDENCIES.md, CHECKPOINT.md and necessary disjoint analytical appendices. The assigning master `01a10933-feaf-7503-878e-49a6d5ad113f` retains canonical plan/RUN reconciliation; the existing shared Engine remains sole shared runtime integrator. All runtime, world packs, shared project documents, other reports, private saves and book/library files are read-only. No installs or vendored code/assets, runtime edits, schema changes, builds/gameplay/browser/save suites, publishing/commits/automation, existing-chat messages or additional visible-chat creation. Read-only upstream research through browsing or temporary external checkouts is permitted; do not mutate source libraries or install dependencies into the project.

## Inputs and first action

Read applicable AGENTS, PROJECT's current resume, the shared [GM prompt/refresh protocol](../../../../GAME_MASTER_PROMPT.md#context-pressure-and-refresh), this assignment, current canonical plan/RUN and [audit index](../README.md). Inspect the input snapshot and live dirty state. Read only relevant current modules and delivered peer reports; identify draft or changed inputs rather than silently treating them as completed. Do not reread whole books or repeat the foundations, authoring, regions, society, combat, world-bank or integration audits. Review their findings only to settle a named overlap or missing seam.

Begin by mapping each candidate's proposed benefit to actual source/API/UI support in src/simulation.js, src/simulation_contracts.js, src/simulation_effects.js, src/scene_definitions.js, src/causal_situations.js, src/people_knowledge.js, src/world_instances.js and src/pocket_realm_scenes.js, plus ENGINE_AUTHORING and the relevant authoring/integration/society/world-bank reports. An existing field or planner is not proof of native gameplay. Initial comparison sources:

- [Cataclysm EOC](https://docs.cataclysmdda.org/JSON/EFFECT_ON_CONDITION.html), [NPC dialogue](https://docs.cataclysmdda.org/JSON/NPCs.html) and [magic](https://docs.cataclysmdda.org/JSON/MAGIC.html).
- [Inform actions](https://ganelson.github.io/inform/WorldModelKit/actns.html) and [physical world model](https://ganelson.github.io/inform/standard_rules/pwm.html).
- [Ink](https://github.com/inkle/ink), [inkjs](https://github.com/y-lohse/inkjs) and their primary integration/runtime documentation.
- [rot.js](https://github.com/ondras/rot.js) and [interactive manual](https://ondras.github.io/rot.js/manual/).

Verify primary docs and relevant upstream code at actual revision/version, including save/serialization and licenses where code reuse is proposed. Separate upstream facts, local source observations, design interpretations and original prototype rules. Additional candidates need a specific missing player behavior; a catalogue of unrelated engines is not the deliverable.

## Deliverables

1. **Decision report:** rank adopt, borrow-pattern, extend-current and defer routes by actual player benefit, fidelity, authoring burden, changed shared seams, browser/local fit, persistence/determinism and maintenance. Include why a simpler existing route wins where it does. No invented cost, speed or token-savings measurements.
2. **Evidence matrix:** FINDINGS.json entries have stable ID, candidate/subsystem, source URL and revision/access date, local file/API/consumer evidence, missing player behavior, recommendation/status, owner, required versus optional dependency, uncertainty and acceptance case. Preserve version/format/source limits.
3. **Integration boundaries:** DEPENDENCIES.md maps selected capabilities to exact proposed files/APIs, canonical owners, narrative cursor versus game state, RNG/clock/publication and failure behavior, save compatibility/migration and code provenance/license/attribution where relevant. Explain the fallback/removal route for a proposed dependency. Do not propose a duplicate scheduler, inventory, rewards or people ledger.
4. **Two worked content cases:** one connected everyday/power/trade/NPC consequence example, using the proposed Frontier/Glasshouse herb case or a better existing fit; one materially different action/long-scene/spatial case that exposes whether the same tool actually helps. Include two meaningful approaches, abstention, private knowledge, real stock/costs and remembered return consequences where applicable. State prerequisites and proposed versus supported behavior. These are designs, not playtest claims, and do not replace the held initial qualification pair without an explicit amendment rationale.
5. **Ready return:** exact canonical-plan amendments and scoped later implementation packet(s), current performed document/source checks, deferred behavioral/human acceptance gates and a compact saved checkpoint. Recommend a first candidate only when the evidence supports it; a checked decision to adopt no dependency is a valid outcome.

## Completion and continuity

Keep configured top-level model/settings. Useful bounded internal research/review helpers are authorized under the project capacity/succession policy when their scopes are disjoint and recorded; no extra visible-chat tier. Use fresh contexts only for a concrete reason with checkpoint and exclusive writer transfer. Continue this concrete comparison through checked delivery, not indefinitely expanding the shortlist. Validate own JSON, local links, exact file scopes, source references and readback; close or record live internal processes/writers before final delivery. Keep the summary compact, with deeper evidence only where necessary to assess an actual choice.

Return changed paths, prioritized recommendation, concrete amendment/packet, evidence and limits. The human has requested investigation and plan adjustment, not accepted a particular library or implementation. Current gameplay tests are deferred and the runtime review hold remains. Do not claim source review, hypothetical walkthroughs or an imported package demonstrate playable behavior.
