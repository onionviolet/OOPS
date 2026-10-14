# Procedural rules and randomness: independent audit

2026-10-13. Lane PG. Requested audit and extension of the cheat proposals. This is a bounded source-informed design report, not an implementation assignment or accepted probability/difficulty policy. Only this report is written by this lane.

Authority: [User vision](../../../USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13), [accepted rules](../../../RULES_FROM_SCRATCH.md), [project priorities](../../../../PROJECT.md), and [cheat library](../../../CHEAT_LIBRARY.md). Worlds determine their own rules; free grants, local absolutes, outliers, ordinary starts and unrestricted profiles remain possible. The one-realm/one-prestige milestone remains applicable. This audit adds implementation choices to [06](../06_AUTHORING_RNG_AND_IDLE_PROJECTS.md), [07](../07_POSSIBILITY_GRAMMAR_AND_AUTHORING.md), [09](../09_COVERAGE_VALIDATION_AND_IMPLEMENTATION_ORDER.md), and [10](../10_RULE_DRIVEN_PROCEDURAL_GENERATION.md), without replacing their owners.

## F1. Existing proposals are sound, but generation needs a contract for each decision

Lane 10 PG3 already distinguishes mechanism construction, opportunity placement, validation and commitment. Lane 06 D4 correctly separates hidden truth from experimental noise. Lane 07 G4 preserves versions and resolves AU conflicts. These should remain the foundation.

The unresolved part is how a particular request becomes one reproducible candidate: which facts constrain it, which decisions are sampled, what a failed search means, and which facts may change before commitment. A seed and a list of compatible components do not answer those questions.

Proposed request fields, conceptual rather than a current save format:

| Field | Meaning |
|---|---|
| Intent | Generate an object, opportunity, recipe, project, challenge or world-profile variant |
| Premise | Selected source/world/profile revisions, original/AU status and allowed outliers |
| Context | Relevant actor, body, location, time, ownership, stock, institutions and already settled clues |
| Choice authority | Player-selected, solver-derived or randomly selected decisions |
| Distribution | Meaning of family weights, parameter weights and conditional sampling |
| Reachability policy | Direct gift, dependable route, uncertain discovery, intentionally inaccessible object or another selected contract |
| Settlement policy | When candidate identity and properties become durable; what remains live |
| Support requirements | Needed operations, target consumers and native adapters |

A helper can suggest these fields, but cannot silently select a different premise to make a difficult candidate compile.

## F2. Dependency solving must consider resources, time and change

Lane 10 PG4 identifies bootstrap cycles. Extend that check beyond ordinary graph traversal:

| Failure | Example | Required distinction |
|---|---|---|
| Quantity conflict | Two branches both require the same unique component | Sharing knowledge does not share a consumed object |
| Destructive prerequisite | Testing consumes the only sample needed to fabricate | A reachable node graph can still have no executable sequence |
| Clock conflict | A workshop closes before travel and preparation finish | Structural possibility differs from scheduled availability |
| Capacity conflict | Two simultaneous steps each reserve the sole apparatus | Parallel edges do not imply parallel execution |
| Knowledge conflict | A route needs a fact obtainable only after choosing it | Engine omniscience does not grant player knowledge |
| Agency conflict | A plan assumes an owner will cooperate | A possible offer differs from an accepted agreement |
| Dynamic conflict | An NPC buys the object during your journey | The original opportunity can become unavailable without changing the artifact |

For a small selected project, use finite prerequisites and explicit action effects to produce a witness plan with quantities and clock bounds. A general temporal planner is unnecessary for the first slice. Keep the witness as diagnostic evidence, not a guarantee that an autonomous NPC or stochastic event will cooperate.

Reachability has several scopes: valid in this world's laws; a path exists from this snapshot; a path is currently known; a path fits the selected time/resource policy; a natural player journey was exercised. Report which was established. A missed opportunity is legitimate. A purported guaranteed starter with no feasible route is a generator defect. An intentionally inaccessible relic can be legitimate world content, but must not satisfy the guaranteed-starter contract.

## F3. Rejection and repair change the distribution

Lane 10 GP2 calls for meaningful distributions, but PG3's reject-or-repair step needs a statistical policy.

Suppose families A and B each receive 50% of initial draws. If 90% of A candidates and 10% of B candidates pass constraints, repeatedly rejecting invalid candidates yields accepted results about 90% A and 10% B. This arithmetic describes the proposed sampling example, not a measured game distribution.

Decide what weights mean. They could mean attempted families, final eligible families, or final concrete instances. These differ. Prefer selecting a compatible family under the desired final distribution, then sampling its valid conditional parameters, for small enumerable spaces. More complicated grammars can use bounded backtracking, prevalidated bundles or weighted solution enumeration, with the remaining approximation documented.

Repair also introduces bias: replacing every unusable rare module with a common module creates more common results. A repair should identify the violated constraint, allowed changed decisions and final provenance. If requested semantics would change, return a failed request or an explicit alternative instead of silently shrinking the power.

Test exhaustion as its own result. Distinguish incompatible premise, no supported operation, no available placement, no feasible route and technical search budget exhausted. Budget exhaustion is neither proof of impossibility nor a fictional limit on cheat strength.

## F4. Lazy generation must honor promises already made

Lane 10 GP13 and lane 07 G4 correctly require prior clues and AU dependencies. Add a distinction between settled facts, constraints and unknowns.

A rumor that is allowed to be mistaken does not promise a real object. A reliable observation of a unique relic commits some reality. A perfect detector identifying that relic elsewhere commits more. Those observations create different constraints on later generation.

For lazy content, retain a small commitment record: stable unresolved identity if needed, scope, uniqueness, observed properties, allowed uncertainty and references from prior evidence. Later generation may fill unspecified details but cannot contradict them. An unresolved identity must eventually bind to one object or a supported declared failure; it must not mint a second unique relic in another district.

Exploration-order policy is explicit. A world seeded by stable district/object identities can produce the same facts regardless of visit order. A discovery-driven mode can intentionally decide facts at exploration. Either is legitimate; accidental dependence on unrelated clicks or cosmetic draws is not a coherent policy.

Do not claim a fully ticking multiverse. Offscreen generation and simulation need declared fidelity. Settled objects, pending jobs, unique identities, carriers and player knowledge survive any summarization. Aggregate population summaries can be adequate for unrepresented background activity, but cannot resolve an individually known character's fate without a supported rule.

## F5. Current source supports narrower pieces than a general generator

Source inspection only, no execution:

| Location | Observed contract | Limit |
|---|---|---|
| [expansion_engine.js:101](../../../../src/expansion_engine.js#L101) | Finite effect vocabulary; unknown effects throw | A fact does not implement a novel causal operation |
| [expansion_engine.js:303](../../../../src/expansion_engine.js#L303) | Cloned/frozen definitions, unique IDs, validated roll tables and references | No demonstrated general constraint grammar |
| [expansion_engine.js:536](../../../../src/expansion_engine.js#L536) | Sequence check, reserved costs, sampled outcomes and frozen pending effects in a returned plan | Does not by itself publish or durably persist generated content |
| [simulation_resolution.js:4](../../../../src/simulation_resolution.js#L4) | Derived seed helper | Naming a stream does not implement a complete independent-stream generator |
| [simulation_resolution.js:12](../../../../src/simulation_resolution.js#L12) | Spawn aliases and copied templates freeze selected participants; aliases require prior creation | Concrete bounded generated actor binding, not arbitrary character invention |
| [simulation_resolution.js:37](../../../../src/simulation_resolution.js#L37) | Context-derived nonnegative outcome weights need a finite positive total | No guarantee of desired final distribution after rejection |
| [simulation_contracts.js:128](../../../../src/simulation_contracts.js#L128) | Selected completion requirements and refund/forfeit policies exist | Not all jobs reevaluate every condition at settlement |
| [structured_pack_definitions.js:30](../../../../src/structured_pack_definitions.js#L30) | Compiler explicitly separates definitions from stock, actors, timers, saves and random selection | Compiling a candidate is not placing it or creating its native consumer |
| [structured_pack_runtime.js:37](../../../../src/structured_pack_runtime.js#L37) | Typed start selection plans a receipt with pack revision/hash, selected authored start, seed, choice and life/body instance identity; initialization validates the selection | Bounded selection from existing authored starts, not synthesis of arbitrary new definitions; the caller must durably commit before publication |

Consequently, refine any blanket description that jobs are always frozen or always dynamic. Expansion action outcomes shown above freeze at commitment. Selected simulation commands separately declare completion support. A generator must bind each project step to its actual host contract.

Likewise, a blanket claim that durable start selection is absent would be wrong. The inspected typed-start route already separates a selected receipt from initialization. Its calculation indexes authored starts from the current RNG value; this inspection does not establish independent generation streams, arbitrary generated content, or rebuilt browser acceptance.

## P1. Practical architecture: candidate, witness, committed instance

Use one small bounded generator around an existing useful mechanism before building a universal language.

**Request and context snapshot → constrained candidate → support check → placement/use witness → prepared transaction → durable instance → observer projection.**

The candidate contains typed references, resolved decisions and proposed effects. The support check returns exactly supported, needs a named adapter, or unsupported. The witness checks the requested route's relevant resources and time. Preparation checks live context again and makes an actual provisioning plan. The durable instance retains meaning and lineage. Observation reveals only what this character can perceive.

Separate preview from commitment. Merely hovering, searching a library or reopening an offer must not consume the authoritative random stream or mint stock. A proposal may retain an opaque internal generation ticket. Commitment resolves or accepts its saved candidate once, using the current relevant state and settlement policy. Repeated submission must resolve to the same committed instance or an explicit stale result, without duplicated rewards. Revalidation can reject an obsolete placement while leaving already settled artifact truth intact.

If stale context requires another proposal, determine whether it is the same candidate needing a new route or a genuinely new draw. Opening and closing a dialog must not become an undeclared reroll ability. Explicit lottery/reroll cheats can intentionally change that policy.

Proposed retained data: instance ID, definition/profile/generator revisions, resolved values, source/derivation, original random decisions, relevant bindings, settled promises, actual custody, knowledge projections and pending commitments. Store only needed evidence; a complete search trace can be optional development diagnostics. No raw generated executable code belongs in a save.

## P2. Worked derivation and failed candidate

Original workshop scenario, no franchise/source rule asserted. Goal: generate one repair implement and a useful way to obtain it. The selected ordinary profile requests a dependable first acquisition; its method consumes one registered blank and grants one existing supported source/technique used by a specific repair command. Exact registered IDs and host bindings remain to be selected.

| Decision | Derivation |
|---|---|
| Useful consumer | Select the supported repair command first, including its actual target and outcome |
| Mechanism | Use one prevalidated assistance variant compatible with that command |
| Backing | Choose a held implement only if custody/equipment can affect this command; otherwise require a named adapter |
| Route | Borrow a tool, buy a finished implement, or manufacture with the supported method |
| Random property | Select a supported duration variant, generated once; no imaginary capacity stat without a consumer |
| Placement | Bind real owner, inventory and location; reserve any unique object in the proposed transaction |
| Knowledge | A public lead reveals the route, not every hidden property |
| Proof target | Natural acquisition, changed useful repair, exact pending/completed restoration |

Failed candidate: the only manufacturing method requires this same unavailable implement; the supplier has none; the borrow route is absent. The graph cycles with no entry point. This fails the dependable-first-acquisition contract. Do not roll increasingly favorable success chances on an impossible action.

Allowed fixes under the original request might include an authored basic fabrication route or actual finished stock, if the generator is authorized to provision that stock and has an executable operation. It cannot invent a soul-delivered gift to repair the cycle. Under a different lost-relic profile, the inaccessible design might remain as unfinished work. Changing the profile is a deliberate design decision, not validation repair.

Even the passing candidate above is conceptual. Current registry and source effects are useful seams, but this audit has not proved that a newly generated held item controls the native repair command. The implementation must choose actual IDs and show that consumer before advertising this route as working.

## P3. Depth beyond more random attributes

| Code | Extension | Supported model needed |
|---|---|---|
| E1 | Correlated families | Common manufacture or provenance predicts some shared traits; do not independently roll every field |
| E2 | Research steers novelty | Player goals and evidence constrain candidate space; noisy experiments and actual unknown laws remain distinct |
| E3 | Behavioral diversity | Measure changed decisions, useful targets, acquisition structures and loops, not unique names |
| E4 | Context-sensitive variation | A displaced institution changes routes and stock while retaining settled objects and records |
| E5 | Recursive generation | A forge's output requests another valid construction; retain parentage, permissions and actual provisioning |
| E6 | Cross-life inventions | A later life can inherit an unresolved design only through a real carrier; previous observations constrain completion |
| E7 | Worlds with different rules | Explicit supported profile deltas invalidate relevant future proposals, rather than rewriting all existing powers |
| E8 | Intentionally extreme starts | No balancing reroll or compulsory drawback; validate the declared absolute operation instead |

For recursive generation, forbid neither vast power nor growth. Bound one technical transaction's work, retain a queue if the premise supports continued generation, and require supported effects at each settlement. A self-improving description is not permission to modify the interpreter. Cyclic ancestry can be legitimate in a supported time-loop world, but ordinary generation should not create it accidentally.

## P4. Selected verification, not an endless catalogue gate

For a first slice, select one proven consumer, a small finite variant pool and two genuinely different acquisition structures. Necessary checks are: valid and invalid candidates; no bootstrap cycle; explicit exhaustion; preview without draws/provisioning; duplicate commitment; stale ownership/stock; stable restoration; and a targeted distribution sample if final weights are claimed. A sample can expose bias but cannot prove all possible seeds or story quality.

Then rebuild and exercise natural acquisition/use at the task's laptop viewport, with Save/reload/Export/literal Import for generated state and a failed-persistence case where inputs/rewards change. These gates remain future work. Mobile checks, arbitrary multiversal travel and every proposed family are not prerequisites for this local slice.

Evidence of this audit: the named proposal docs and live authority were read; bounded source sections were inspected; only this Markdown report was added. No runtime edits, build, browser play, tests, world-secret inspection, personal-save access, commits or publication occurred.
