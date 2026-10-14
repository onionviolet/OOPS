# Rule-driven procedural generation

2026-10-13. Weibao asks about procedural generation based on rules for systems that support it, and further considerations. This is a design/implementation proposal, not a runtime change or selected feature assignment. Extends [possibility grammar](07_POSSIBILITY_GRAMMAR_AND_AUTHORING.md), [RNG and projects](06_AUTHORING_RNG_AND_IDLE_PROJECTS.md) and [coverage](09_COVERAGE_VALIDATION_AND_IMPLEMENTATION_ORDER.md). Existing [user direction](../../USER_VISION.md), [library](../../CHEAT_LIBRARY.md) and [accepted rules](../../RULES_FROM_SCRATCH.md) remain authority.

## PG1. Generate executable instances from a declared model

Procedural generation can go beyond selecting a card or adjusting numbers. A system with defined semantics can construct a new combination, project, opportunity or local scenario. The generated result must refer to operations the runtime actually understands. Rule-supported novelty is distinct from an evocative name and description.

For a modular system, author a generative model: legal components, relationships, compatibility constraints, construction operations, variation parameters and supported consumers. A generated research artifact could combine recording, comparison and teaching in a new configuration. It must define how those functions operate, who controls them and what task they enable. Costless, unlimited, absolute and intentionally awkward forms remain possible under selected rules; validity is not mandatory balance.

## PG2. Different generation levels require different support

| Level | What varies | Example | Additional requirement |
|---|---|---|---|
| Parameter | Values within one mechanism | Capacity, duration, range | Valid domains and saved resolved values |
| Modular | Combinations of supported functions | Recorder plus comparator | Composition and conflicting-state rules |
| Process | Steps to acquire, research or construct | Sample, investigate, fabricate, test | Real preconditions, effects, inputs and output consumers |
| Situation | People, places and opportunities | A damaged instrument and an available workshop | Coherent initial state, actual custody and actions |
| Ecosystem | Interdependent sources and institutions | A method supports production, trade and teaching | Supply, adoption and clock behavior |
| Rules profile | Selected laws and their dependencies | AU retention law or magic-channel variant | Supported law implementations and explicit conflict resolution |

A parameter generator is not a rules-profile generator. Profiles can select existing law implementations or compose supported settings; fundamentally novel causal operations still need engineering. A canon-grounded system can generate compatible peripheral content while retaining source-fixed unique facts. A declared AU can generate divergent facts, with their dependencies handled explicitly.

## PG3. Construct by dependencies rather than roll everything independently

Proposed pipeline:

1. **Choose context and intent.** Bind world/rules version, generation profile, actual actors and intended experience: surprise, ordinary life, artifact investigation, crafting, powerful start or another selected mode.
2. **Construct a compatible mechanism.** Select supported components and solve their dependencies: targets, source, timing, recipients and useful effects. Some decisions use seeded draws; others follow constraints or player choices.
3. **Construct the opportunity around it.** Place actual means and determine which actors know, own or can provide them. A route may be direct, incomplete, missable or deliberately difficult according to the profile.
4. **Validate the generated graph.** Check typed references, causal consistency, conflicts, persistence, supported operations and the intended reachable use. Reject or repair invalid candidates through declared rules.
5. **Commit and reveal.** Save the resolved instance, origin/version and actual world changes together. Generate presentation from the character's supported observations rather than from the complete hidden definition.

Use bounded search/backtracking, constraint solving or authored compatible bundles as appropriate. Exhausted generation returns a specific gap or an explicit profile fallback. It must not silently downgrade a requested rule or run an endless reroll loop. A technical generation budget controls execution, not a fictional ceiling on power.

Audit clarification: rejection and repair alter distributions. Declare whether weights describe attempted draws, final eligible families or final instances; final rarity cannot be inferred from initial weights after filtering. Quantity, consumed prerequisites, schedules, available apparatus and known information also constrain a feasible route, beyond graph reachability. See [procedural audit F2–F3](audit/02_PROCEDURAL_RULES_AND_RANDOMNESS.md#f2-dependency-solving-must-consider-resources-time-and-change).

## PG4. A generated project can be backward-planned from its output

Start with a supported useful goal, then derive ways to establish its prerequisites. For a teaching device, the goal might be a recipient performing a supported repair. That needs an executable method, a record, a capable recipient and usable tools. Methods to obtain each prerequisite become a project graph.

An ordinary training route can require time; an artifact can convey the procedure; a perfect teacher can grant the supported method immediately. The selected model determines which route applies. Shared prerequisites should be shared nodes, not duplicate charges. Dependencies must have entry points: a tool whose crafting recipe requires that same unavailable tool creates an accidental deadlock unless a bootstrap route exists.

Backward planning is not proof of gameplay. It establishes a candidate plan under declared preconditions. Dynamic actors can refuse, stock can change and information can be unknown. Distinguish a structurally reachable route, an available route now and a naturally exercised browser route.

Audit clarification: backward planning may construct a tutorial or a selected useful project, but independent-world profiles should also generate local facts and actor goals that do not depend on the player's powers. Opportunity matching then identifies possible uses within that state. Do not make every region need the same specialized intervention, or force new resistance when a dominant power solves a real problem easily. See [gameplay audit F2](audit/01_GAMEPLAY_AND_PROGRESSION.md#f2-backward-planned-opportunities-can-make-the-whole-world-orbit-the-player).

## PG5. Worked original generated instance

Selected context: an original AU workshop has a recording law and a local repair trade. The generator constructs a comparison instrument whose first purpose is finding a compatible replacement part. It resolves a material, capacity and acquisition route from compatible choices, then places an actual owned instrument and a source of information about it.

Possible derivations:

| Derivation | Resulting play |
|---|---|
| Working instrument at a supplier | Buy or borrow; inspect a real part; compare and complete a repair |
| Broken instrument in a cache | Recover; learn the repair method; restore; use it on the same useful task |
| Incomplete design in an archive | Interpret; obtain components; build; test |
| Active innate comparator | Observe and compare immediately; pursue fabrication as ordinary learning |

These outcomes reuse supported comparison and repair semantics. They differ in custody, acquisition and development. An eventual teaching module needs its own supported teaching-from-record contract. Calling it an evolving system does not supply that operation.

The generator can also create a goal that uses an existing known function rather than always create a new cheat. A generated commission, investigation or construction challenge makes current powers useful. Distinct goals, targets, sequences and world reactions can produce more meaningful variety than random rarity alone.

## PG6. Deeper considerations

| Code | Consideration | Proposed treatment |
|---|---|---|
| GP1 | Rules have different jobs | Separate fictional laws, engine support, context constraints, probability weights, presentation and optional difficulty policy. |
| GP2 | Diversity is not uniformly random | Define distributions and meaningful differences. Avoid generating hundreds of renamed duplicates; do not require equal strength. |
| GP3 | Creation affects the world | Provision actual objects, supplies and relationships once. Generate a cache with provenance, not only a quest promising nonexistent stock. |
| GP4 | Knowledge differs from truth | Generate hidden mechanisms first, then clues and observable experiments. Keep discovery routes and sealed truths out of previews, counts and author reports. |
| GP5 | Context changes | Pin generated truths and relevant commitments; derive current eligibility from actual changed state. Do not regenerate an artifact because its owner moved. |
| GP6 | Reproducibility differs | Separate one-off anomaly, repeated stochastic phenomenon, manufacturable recipe and teachable method. A found instance does not prove unlimited supply. |
| GP7 | People retain agency | Generate people with relevant means and motives; authored negotiation can handle decisions. A generated helper is not automatically obedient or omniscient. |
| GP8 | Cross-world validity is specific | A valid home mechanism can be blocked, adapted or unchanged elsewhere. Generate outside behavior from supported profile interactions, not an assumed universal conversion. |
| GP9 | Evolution can be generated | Add or transform supported functions when milestones apply. Preserve instance identity/derivation and affected pending work; do not mutate all older cards. |
| GP10 | Players can steer generation | Selected research goals, components, contacts and preparation constrain relevant results. Explicit surprise/draft/chosen modes can coexist. |
| GP11 | Generated laws need consequences | A retention rule changes some delivery behavior; it does not automatically implement a whole afterlife or rewrite every institution. Record dependent consumers and omissions. |
| GP12 | Stable seeds alone are insufficient | Keep generator/table revisions, resolved data and causally relevant placement. Different code can map the same seed to different outcomes. |
| GP13 | Lazy generation needs coherence | Unvisited details can be generated later, but prior clues, unique objects and neighboring state constrain them. Exploration order should affect facts only when intentionally designed to. |
| GP14 | Infinite families still have finite instances | Generate on demand and retain meaningful state. Summaries need declared fidelity; do not claim a detailed ticking multiverse behind a few entries. |
| GP15 | Automated invention can over-optimize | A solver must use declared information and permitted decisions. Technical validation should not secretly choose every best outcome for an NPC or player. |

## PG7. Validation and acceptance

Generator checks can cover many seeds and verify reference validity, termination, appropriate reachability, selected unique-object constraints, profile compatibility and persistence stability. Include targeted adversarial cases such as missing suppliers, incompatible bodies, cyclic dependencies, exhausted pools, contradictory AU overlays and generated version changes.

Useful diversity needs inspection of actual behavioral differences, not just distinct names. A sample sweep does not prove every seed or natural pacing. Representative rebuilt browser journeys must exercise acquisition, useful output and restoration. A future generator should retain a derivation trace for diagnosis; player-facing reasons disclose only supported information.

First proposed slice: generate several instances of one supported local mechanism and two genuine acquisition structures, with persisted identity and a useful native consumer. Extend next to project graphs, then selected world-profile variations when their operations exist. This sequence is an implementation recommendation, not a new assigned milestone.

## Current source boundary

Source-read this turn: `src/expansion_engine.js` validates registry references, actions and roll tables; its existing capability definitions and effects provide bounded semantics. `src/simulation_contracts.js`, `src/simulation_resolution.js` and `src/simulation.js` show saved simulation/check seeds and derived event RNG. These are useful foundations for reproducible choices. They do not establish general constraint generation, generated-definition loading, automatic project planning or arbitrary world-law synthesis.

Independent audit refinement: `src/structured_pack_runtime.js` already has `planStructuredSelection` and `beginStructuredCampaign`, with a durable typed selection from authored starts and initialization checks. That bounded route is a useful first implementation seam. It does not create arbitrary new definitions. Dynamic definitions would need validated admission and restore before referencing state is validated, plus native staging and compatibility. Source inspection only; no browser proof was performed. See [engine audit F1–F4](audit/05_ENGINE_SUPPORT_AND_DELIVERY.md#f1-there-is-already-a-bounded-random-start-seam).

No runtime edit, test/build/browser run, canon acquisition or personal-save access occurred. This document and its index link are the delivered artifacts; probabilities, generator design and selected content remain proposals.
