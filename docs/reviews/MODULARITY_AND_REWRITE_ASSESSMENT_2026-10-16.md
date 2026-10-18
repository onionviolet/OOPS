# Modularity and rewrite assessment, 2026-10-16

Requested by Weibao: consider a meta and unbiased approach to implementing ideas,
including whether to refactor everything from scratch into a modular system.
This is an architecture recommendation, not authorization for a rewrite or a
change to accepted priorities. No gameplay, mockup, save or runtime code changed.

## Recommendation

**P1. Restructure around replaceable domain boundaries, one connected slice at a
time.** Keep one application with explicit internal interfaces. Existing useful
modules stay; selected tangled implementations can be replaced behind compatible
adapters. A whole-game rewrite is not justified by the bounded evidence here.
Continuing to add one-off joins indefinitely also has a demonstrated cost.

This independently rechecks the integration/projection concerns in the older
[whole-project review](WHOLE_PROJECT_GAME_ARCHITECTURE_REVIEW_2026-10-12.md#a1-architecture-map).
Its old priority/owner/runtime statuses were not adopted as current facts.
Accepted user direction, [UI rules](../UI_RULES.md), [making rules](../MAKING_RULES.md)
and the existing feature owners remain authoritative.

## Evidence and limits

Source inspected in the dirty shared checkout on 2026-10-16. Unrelated edits
were preserved. These measurements are a point-in-time source snapshot. Line
counts and import counts identify inspection targets, not quality scores or
performance measurements. Counts below use a lightweight static relative-import
scan, deduplicated by resolved existing target. Dynamic imports, runtime calls
and actual dependency importance are not measured.

| Code | Verified observation | Implication, interpreted rather than proved |
| --- | --- | --- |
| F1 | 582 JavaScript files under `src`; `main.js` has 10,337 lines and 318 distinct existing static relative-import targets; `display.js` has 6,691 lines and 41 targets. `main` and `display` import each other. | More files alone have not produced independent feature integration. Main/UI coupling is a concrete place to investigate. These counts do not imply that every import or large file is wrong. |
| F2 | `save_files.js` has 48 relative-import targets and explicitly coordinates many optional-domain validators. `simulation.js` and `expansion_engine.js` directly integrate multiple local rule/clock/context providers. | Some growing integration surface is expected, but several core files know many feature specifics. Domain lifecycle/persistence boundaries are a better target than cosmetic file splitting. Validation order and cross-owner invariants must survive extraction. |
| F3 | `craft_resolver.js` supplies pure batch resolution; `craft_state.js` owns material/product/knowledge state and observer projections; `craft_product_registry.js` already routes product families. `crafting_detail.js` consumes a public model plus handlers. `panel_kit.js` registers through the existing workspace owner. `continuation_host.js` accepts capture/preflight/publication/ownership callbacks. | Useful modular pieces already exist. Replacing all of them would discard working boundary designs. Reuse should be qualified per consumer, not assumed from a module name. |
| F4 | The [crafting engine owner](../CRAFTING_ENGINE.md#open-gates-not-done) records missing native inventory/use/save/UI integration despite isolated engine modules. | Pure modules and tests are insufficient. A real consumer crossing state, command, presentation and persistence boundaries must be part of any architecture pilot. The owner status was read, not reverified through gameplay. |
| F5 | The workbench build copies a retained compiled recipe experiment and appends an adapter that accesses module-local `state`, `render`, `reset`, `recipes` and replaces `log`. The bridge exposes a shared iframe protocol, but packaging remains recipe-specific. | It is useful transitional reuse of pinned inputs, not proof of a durable feature API. Future rebundling can invalidate private-name assumptions. The earlier browser checks prove that retained artifact's behavior only. |

Relevant source: [main](../../src/main.js), [display](../../src/display.js),
[save coordination](../../src/save_files.js), [simulation](../../src/simulation.js),
[expansion coordination](../../src/expansion_engine.js),
[craft resolver](../../src/craft_resolver.js), [craft state](../../src/craft_state.js),
[product families](../../src/craft_product_registry.js),
[detail view](../../src/crafting_detail.js), [panels](../../src/panel_kit.js),
[continuation host](../../src/continuation_host.js),
[workbench builder](../../prototypes/workbench/build.mjs) and
[recipe adapter](../../prototypes/workbench/adapters/recipes.js).

## Compare the viable strategies

| Code | Strategy | Benefit | Cost and falsification condition |
| --- | --- | --- | --- |
| O1 | Continue local feature patches | Fastest for bounded content or a genuinely independent feature. | Shared joins keep growing when every feature needs new code in the same owners. Still appropriate when no repeated integration problem exists. |
| O2 | Incremental domain extraction and selective subsystem replacement, recommended | Preserves playable behavior and reveals useful interfaces through real consumers. Can replace genuinely bad internals rather than preserve them indefinitely. | Requires temporary adapters and careful compatibility. Reject a proposed extraction if it adds more indirection without reducing a real feature's change surface or defect risk. |
| O3 | Whole-game replacement | Freedom to change a fundamentally unsuitable state/simulation model and discard unwanted behavior deliberately. | Must recover wanted behavior, content, timing, disclosure, saves and UI journeys while development continues. Consider only after a bounded side-by-side prototype demonstrates a capability the existing design cannot economically support and the retained/dropped scope is explicit. No such blocker was established here. |

The comparison follows the incremental-replacement mechanism described by
[Martin Fowler](https://martinfowler.com/bliki/StranglerFigApplication.html):
identify boundaries, replace working portions and learn from each delivery.
This is methodological support, not evidence that incremental work always wins
for YAIR. [Juntao Qiu's worked UI refactor](https://martinfowler.com/articles/modularizing-react-apps.html)
illustrates separating presentation from domain behavior. It does not establish
a reason to migrate YAIR to React.

## What modular should mean here

**P2. One application, domain-owned state and explicit commands/projections.**
The target is a modular application with a small shared foundation. The proposal
does not require microservices, a plugin runtime, an ECS conversion, TypeScript,
a UI framework migration or a universal game-rule language. Any such change
needs its own demonstrated gap and cost comparison.

| Boundary | Domain responsibility | Shared responsibility to retain or extend |
| --- | --- | --- |
| Content | Stable definitions, world-specific laws, references and authored conditions. Common variants should be data; genuinely different mechanisms may use code. | Existing registries, reference validation, canon/original labels and content revision policy. |
| State | One authoritative owner per fact; explicit saved, derived and transient fields. | Existing save envelope and guarded publication authority. Namespaced ownership can remain within the same file format. |
| Behavior | Named commands with eligibility/quote and actual revalidation before mutation; cancellation/interruption where applicable. | Existing native transaction paths and scheduler semantics, including cross-domain costs and once-only outcomes. |
| Read model | Observer-safe facts for UI, AI and inspection without granting authority or revealing unknown truth. | Existing knowledge and projection owners, not a second truth store. |
| Presentation | Render public models, own its node, emit commands and use its proper navigation scope. | Existing tokens/components, panel registration, shared center controller and destination Back/Esc. |

Do not mandate all five mechanisms for a static content table. Avoid an omnibus
`GameContext` with unrestricted access to everything. Inject the few operations
the consumer needs. Explicit dependency lists, startup/disposal and absent-content
behavior matter when a module actually has those lifecycles. No second timers,
independent save writers, competing transaction owners or vague event bus should
be added to make an interface look decoupled. Events are useful for observation;
state-changing operations still need explicit ownership and order.

World variety must survive modularity. Shared item identity, custody, transactions
and knowledge do not imply identical potion, rune, weapon or cultivation rules.
The making rules already distinguish a common envelope from product-specific
logic. Build on that rather than invent another universal crafting system.

## A less biased idea-to-implementation process

**P3. Evaluate the wanted player result before selecting an implementation.**

1. Name the visible outcome and the current cost or missing capability. Record
   what would make the idea unnecessary; distinguish new content from a new rule
   or a different presentation of an existing rule.
2. Trace an existing path through input, state owner, command, consequences,
   knowledge, UI and save/return. Compare reuse, a narrow adapter, local replacement
   and a wider replacement against the same task and compatibility requirements.
3. Choose the smallest experiment that can change the decision. Use a mockup for
   layout uncertainty, a pure model for rule uncertainty and a native vertical
   slice for integration uncertainty. A mockup cannot settle save or engine fit.
4. Implement one useful slice and prove both its behavior and its extension cost.
   Keep behavior changes separate from structural migration where possible.
   Observe failure/recovery, changed-state return and affected save compatibility.
5. Reuse the boundary with a meaningfully different second case. Keep or extend
   it if it reduces real work; revise or remove it if it merely hides coupling.
   Record human selection separately from agent recommendation and test results.

The meta concern includes the production process: if agents repeatedly add
isolated modules and bespoke joins, a fresh codebase can accumulate the same
shape. Judge work on connected usefulness and verified integration, not module
count, test count, document count or a tidy diagram.

## Bounded pilots, proposed only

**P4. Workbench cleanup is the low-risk pilot within this tooling area.** Replace
the appended compiled-internal adapter with a fixture source module that explicitly
exports its snapshot/restore/variant/command interface. Keep the pinned old
experiment as historical comparison. Add a second materially different small
study through that same public interface. Success means the shared host needs
no study-specific branch and the recipe's state/journey behavior is preserved.
This is narrower than rewriting the full recipe/game architecture. It does not
require migrating all archived mockups.

**P5. The game pilot should be attached to an already authorized playable slice.**
If crafting is selected by the current owner, it is a strong candidate because
it already has isolated modules and explicit missing consumers: one real harvest
→ stored material → craft → useful output → save/reload/import journey. Keep
world/source rules local and route costs/publication through existing authority.
Then add a second resource/recipe or distinct product case through the same
boundary. This report does not select crafting over the current ruin/world or
other accepted priorities; the same method applies to whichever slice is next.

Measure before/after: unrelated core-owner edits, duplicated eligibility/state,
number of task-specific adapters, preserved observable behavior, required
migration work and elapsed implementation/debug effort. No numeric improvement
or break-even estimate is claimed before that experiment. Fewer files is not
automatically better; a justified composition-root registration can remain.

For a behavior-preserving refactor, compare a disposable pre-change scenario
against the rebuilt candidate, including native command results and relevant
save/reload/import. New behavior requires separate acceptance assertions.
Recover current writers before runtime edits; no reservations were acquired here.

## Decision and open evidence

The recommended direction is O2/P1. It is deliberately provisional: a pilot that
cannot support the selected new behavior, or costs more than a small subsystem
replacement, should change the choice. A wholesale rewrite remains a possible
future decision with explicit evidence and scope, not a default response to
growth. Neither preserving existing code nor discarding it earns preference
without considering the work it saves and the behavior it must retain.

Checks performed: bounded owner/source inspection, static line/import counts,
and consultation of the two primary architecture articles linked above. No
runtime tests, performance profiling, migration rehearsal, dependency-cycle
audit or whole-project correctness audit was run. Implementation cost and
long-term maintenance benefit remain hypotheses to measure with a selected pilot.


## Follow-up: modular possibilities beyond feature wiring, 2026-10-16

Weibao requested expanded small design interactions across abilities, exploration
and everyday actions, then asked: "what to consider based on [this assessment],
your thoughts? Latest expansion on that and more?"
This extends the recommendation with new design tests, not a new accepted
architecture decision. Existing O2 and AR direction remain authoritative.

**MA1. Keep O2, but measure two kinds of modularity.** Integration modularity
reduces core-owner edits for registration, saves, commands and UI. Behavioral
reuse lets an actual supported effect or fact matter to a different pursuit.
A neatly registered power that only works in its bespoke menu may solve the
first problem while leaving the second untouched. Shared keywords do not prove
shared behavior. The [interaction palette, PF24–PF57](../PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md#round-3-abilities-exploration-and-everyday-possibilities-2026-10-16)
and [source-grounded engine map, EI1–EI12](../ENGINE_EXPANSION.md#possibility-support-across-domains-2026-10-16)
own the new detail. Core engine [round 2](CORE_ENGINE_AND_RUNTIME_CONSIDERATIONS_2026-10-16.md#round-2-modular-engine-redesign-and-delivery-2026-10-16)
already qualifies loading, command ownership, bulk advance and lifecycle gaps.

| Code | Latest consideration | How it changes a pilot or decision |
| --- | --- | --- |
| MA2 | **The player journey selects the abstraction.** Light helping reading and exploration, or moving an object changing access, are plausible small cross-domain cases. | Once current playable gates allow a new behavior slice, choose one actual cause and different readers. The assessment's P5 second recipe/resource is useful integration evidence, but may be too similar to test behavioral reuse. Do not expand a behavior-preserving refactor's completion criteria retroactively. |
| MA3 | **Target boundaries can be a bigger blocker than missing modules.** Inspected structured abilities bind declared participants; the effect loop obtains a person/actor, while arbitrary object/environment application is not established. | Prototype a narrow non-person target adapter before proposing an ECS, global component migration or whole-game rewrite. Name the exact input/output and failure it resolves. An unsupported object target is an engineering gap, not a world prohibition. |
| MA4 | **A common envelope must preserve different causal models.** Physical processes, observer evidence, social permission and conceptual authority can interact without sharing one numeric strength formula. | Preserve local handlers and world law, exact identity and body/source requirements. A universal tag interpreter or all-purpose interaction score would narrow the very possibilities modularity is meant to support. A truly universal faculty may exist through its own authored means. |
| MA5 | **Migration and new interaction are separate experiments.** A candidate needs retained old behavior plus explicit assertions for the proposed new behavior. | Use a before/after scenario for extraction; then test the new application as a separate acceptance case. Preserve provenance and dormant state, and measure authoring/debug time, bespoke joins and failure recovery. A second folder or source-only test does not establish extension cost. |
| MA6 | **Iteration tooling should share commands and identities, not all mechanics.** A scenario can be reused by workbench, headless checks and native gameplay while each still has a distinct proof boundary. | Improve setup/readiness diagnostics around the selected journey. Discoverability can use a synthetic mockup; persistence needs the real native writer. A universal scenario editor or hot-swappable runtime is optional future work. |
| MA7 | **Revisit wider replacement using a demonstrated mismatch.** Compare the narrow adapter, local subsystem replacement and wider model on the same retained behaviors and wanted capability. | Prototype side by side on disposable state, one live publisher. Account for compatibility, temporary adapters, debugging and unfinished playable gates. Neither a fixed number of awkward migrations nor growing file count is sufficient evidence for O3. |

### ACT NOW / ACCOUNT FOR NOW / LATER

ACT NOW completed: recorded the distinction MA1, connected the expanded design
owner and current engine seam evidence, and narrowed the meaning of a second
case. ACCOUNT FOR NOW: MA2–MA7 constrain proposals relevant to the chosen
consumer; they do not mandate all services or change current priorities.
LATER: PF55–PF57 and the EI follow-ups give bounded executor level, effort and
done checks. No subagents, runtime edits, merges or resumed run were dispatched.

### Verification of this extension

Source reads support the narrow seam observations; see engine input receipts.
Checked new relative links and anchors, proposal status and preservation of the
pre-existing assessment. No external claims, updated architecture benchmark,
whole-graph scan, runtime test, browser result or human acceptance is asserted.


## Plan updated for future interactions, 2026-10-16

Weibao requested updating the modular plan before continuing the run. The
[executable brief](../gm/dispatch/modular-seams-2026-10-16/BRIEF.md) now integrates
MA1–MA7, PF24–PF57 and EI1–EI22: bounded readiness recovery, conditional seam
hardening, the retained M3 gate and a cross-domain M4 proof with measured extension
cost. [Future-fit considerations](../ENGINE_EXPANSION.md#future-fit-engine-plan-useful-depth-and-iteration-2026-10-16)
add explanation, local-law handlers, durable causal commitments, reaction
continuations, retained definitions, derived-read invalidation, author validation,
semantic reference comparisons and discoverability. These are scoped engineering
proposals with triggers, not ten mandatory services or an industry superiority
claim. The original plan/checkpoint are preserved as history; no runtime run
was resumed and no past acceptance evidence was upgraded by this plan edit.
