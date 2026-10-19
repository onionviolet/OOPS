# Engine support and bounded delivery audit

2026-10-13. Independent audit lane requested by Weibao through the coordinator.
Status: source-read findings and implementation proposals. No runtime edits,
test execution, build, browser play or personal-save access. This lane owns only
this document. The checkout already contains unrelated source/document edits.

Authority: [USER_VISION](../../../USER_VISION.md), [PROJECT](../../../../PROJECT.md),
and the [proposal index](../README.md). Existing one-realm/one-prestige scope and
desktop/laptop priority apply. The requested idea audit does not assign the
whole multiverse, every cheat family or a new implementation wave.

## F1. There is already a bounded random-start seam

The compiler does not select a start, but the runtime does.
[`planStructuredSelection`](../../../../src/structured_pack_runtime.js) selects
one declared start from the current RNG value, binds pack/content/snapshot
identity, records choice and instance/life/body IDs, and returns a plan. Its
comment requires durable commitment before origin publication.
[`beginStructuredCampaign`](../../../../src/structured_pack_runtime.js) requires
that selection, checks it against the declared definition, creates actual actors
and applies the selected beginning's effects.
[`validateStructuredEnvelope`](../../../../src/structured_pack_state.js)
cross-checks saved native and simulation state rather than accepting a seed alone.

**Implication:** random selection among precompiled compatible starts can be a
first delivery route. This is narrower than synthesizing a new cheat definition.
The statement in [10, Current source boundary](../10_RULE_DRIVEN_PROCEDURAL_GENERATION.md#current-source-boundary)
that a general generator is absent remains sound, but implementation planning
should name this existing selection seam instead of building another one.
Evidence limit: source inspection, no current natural start/restore exercise.

## F2. A valid source is not a complete mechanic

[`capabilities.js:9`](../../../../src/capabilities.js) validates numeric
max/sum capability definitions and grants. Its pure query at line 41 resolves
actual acquired sources and faculty activation/suppression, retaining provenance.
[`simulation_effects.js:321`](../../../../src/simulation_effects.js) grants
known sources and faculty states, while power copying at line 335 requires an
existing executable power and an actual donor.

The observed pattern in [`field_workshop.js:68`](../../../../src/field_workshop.js)
acquires a bounded imprint, copies one demonstrated method, and later refines it.
It does not copy any arbitrary future power. Source entries, mastery and labels
alone cannot create appraisal, soul recognition, a recorder or autonomous reward
events. Each needs a consuming command/effect/adapter that changes useful state.

**Implication:** every proposed generated family should name the actual consumer
and target types it supports. [07's operation vocabulary](../07_POSSIBILITY_GRAMMAR_AND_AUTHORING.md)
is a design language, not an executable operation catalogue. In particular,
"recording artifact" in [09 S1](../09_COVERAGE_VALIDATION_AND_IMPLEMENTATION_ORDER.md#s1-s3-three-staged-useful-slices)
needs its record/write/read/use contract selected before it is called the smallest
engineering slice. Evidence limit: bounded source semantics only.

## F3. Definition admission and world initialization are separate deliveries

[`structured_pack_definitions.js:30`](../../../../src/structured_pack_definitions.js)
explicitly separates compilation from actor/stock/native-object/timer creation.
The compiler checks pack-owned IDs, collisions, JSON data, declared capabilities,
observer knowledge and registry references. It rejects executable evaluation and
unknown simulation families. `source-function` specifically requires a container
consumer at line 100; that name is not a generic scripting escape hatch.

`mergeStructuredPack` at line 149 mutates registry maps after preflight;
`stageStructuredNativeObjects` at line 159 constructs locations/items/inventories
with availability rollback on construction failure. The admission path in
[`main.js:8058`](../../../../src/main.js) compiles and stages before merging
and registering the definition. Runtime initialization remains a later step.

**Implication:** a generated quest promising a supplier is incomplete until the
supplier, inventory, ownership, discoverable facts and usable commands exist.
Compiler success cannot prove a route is reachable. A solver's successful plan
also cannot prove its actors agree or its stock remains available.
Evidence limit: inspected admission/initialization code, not compiler execution.

## F4. Dynamic generated definitions need a load contract

[`expansion_engine.js:58`](../../../../src/expansion_engine.js) distinguishes
immutable definitions from persisted JSON state. Saved sources are checked
against registry entries and revisions; the effects validator at line 104 has a
finite operation set and rejects unknown types. Typed origins additionally pin
content and snapshot hashes in `structured_pack_state.js`.

**Extension proposal:** distinguish three generation products:

| Product | Required support |
|---|---|
| Choose an existing definition/start | Existing registry plus durable selected instance |
| Vary state consumed by an existing handler | Typed persisted parameters, bounds and an actual reader |
| Create a new executable definition | Definition persistence/admission, restore ordering, collision handling, native staging and revision policy |

Saving a generated source ID or seed supplies none of the last row by itself.
A future dynamic loader must restore validated definitions before validating
their referencing instances and pending jobs. Derivation/version/lineage are
useful diagnostics; the persisted resolved data is authoritative for the chosen
compatibility policy. Old saves need an explicit pin, migration, dormant recovery
or supported refusal, without silently rerolling their acquired power.
Evidence limit: this is a missing proposed delivery contract, not a claim that
all existing optional-pack loading is broken.

## F5. Atomic commitment includes the native result and failed publication

[`commitAction`](../../../../src/expansion_engine.js) checks the expected
sequence, quotes eligibility, clones budgets, reserves costs, samples and freezes
outcomes, validates possible results, then returns a plan. It does not publish.
[`persistExpansionPlan`](../../../../src/expansion_persistence.js) writes staged
expansion/gameplay/ownership/native changes into one envelope, validates it, and
calls storage once at line 49. [`main.js:789`](../../../../src/main.js)
integrates native publication and pauses progression on persistence failure.

**Extension proposal:** generation, payment, selected truth and actual placement
must settle together through this boundary. Do not charge for an attempt then
publish an unsaved generated artifact from a separate callback. Give generated
settlement a stable receipt/instance identity; repeated recovery must neither
produce another object nor pay twice. Check publication failure after a durable
write as well as storage rejection before it: the saved envelope must remain the
recovery authority even if a UI refresh fails.
Evidence limit: intended transactional structure visible in source. No injected
storage failure or browser restoration was exercised here.

## F6. Timed work needs a named clock and support boundary

[`advanceSimulation`](../../../../src/expansion_engine.js) advances integral
simulation minutes through due jobs/opportunities in stable order, stops for
choices and has a finite boundary budget. Native hosting is conditional:
[`advanceExpeditions`](../../../../src/main.js) only advances relevant active
state and refuses progression during save/import/loading failures.
[`realm_clock_leases.js:1`](../../../../src/realm_clock_leases.js) explicitly
models supported work/observation on the joined played clock and checks source,
anchor, contact and authorization support.

**Extension proposal:** every project specifies played-time, calendar, observed
realm-time or supported offline behavior; operator/source availability; and what
happens on death, suspension, choice or disappearance. A generic duration field
does not establish offline progress or a workshop that survives its inventor.
If an actor owns a time-consuming job, the UI and occupation checks must agree.
Evidence limit: source contracts; no timing/pacing acceptance.

## D1. Smallest complete procedural route

Proposed first target: **one local exceptional method with a selected compatible
starting presentation, one real acquisition, and one useful output consumer**.
An imprint of an existing demonstrated method is a plausible candidate because
the field workshop already has acquisition/copy/refinement semantics. This audit
does not assign that content or assert the current native route is verified.

Use a finite precompiled variant set first. This lets randomness select meaningful
differences without introducing arbitrary definition loading at the same time.
An authored single route is also valid if the first uncertainty is consumer
support. Do not label a shuffled description as procedural mechanics.

| Dependency | Concrete obligation |
|---|---|
| Selected premise | Original local content or source-qualified canon/AU; exact function and useful result |
| Semantic support | Consumer reads the acquired method and changes a real command/output, not only a status label |
| Instance identity | Chosen variant, origin, recipient and truth persist without rerolling |
| Real acquisition | Held means, current location/teacher/stock and costs if the premise calls for them |
| Host integration | Registry/admission, native initialization, known-information UI and occupation/clock binding |
| Transaction/compatibility | One-envelope settlement; pending/completed restore and declared old-save policy |

Only after that route is playable should a second acquisition structure or
generated parameter be added. Future-life delivery, world-law synthesis, a
general planner, dynamic definitions and multiversal autonomy remain horizon
items unless this selected route requires one. Costless and absolute variants
are permitted premises; numeric validator limitations are engineering boundaries,
not fictional balance policy.

## D2. Scoped evidence contract

Target proposal: 1366×768 laptop, acquisition and useful result available through
existing independent panels; mobile optimization deferred. The implementation
owner should record that target and selected route before substantive UI work.

For the selected route, source checks cover compatible/invalid variants, pure
quotes, stale command refusal, failed durable write, fixed outcome restoration,
interruption and the real consumer. Existing relevant test files include
`structured_pack_definitions.test.js`, `structured_origins.test.js`,
`expansion_engine.test.js`, and the selected mechanic's focused tests. They are
test leads, not passing results from this audit.

Then rebuild and exercise a fresh-origin natural acquisition, useful use and
changed-state save/reload/export/literal import. Preserve pending/completed
instance and receipt exactly. Observe one actual semantic difference if variants
are advertised. Missing/browser-blocked leaves remain implemented-unverified.
Do not rerun an unrelated whole-world suite to inflate the evidence. Human
fiction/taste acceptance remains separate from technical proof.

## Evidence inventory and limits

Read live PROJECT/USER_VISION; reports README/06/07/09/10; structured definitions,
state/runtime, expansion effects/commit/persistence, host admission/clock excerpts,
capabilities, field-workshop definitions, and relevant test names. The memory
registry was used only to locate prior verification/authority conventions;
current findings above were checked against live source. No sealed truth is
included. Local document links were checked after writing. Findings are a bounded
one-pass audit and do not prove source completeness or runtime acceptance.
