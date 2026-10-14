# Authoring a broad possibility space

2026-10-13. Follow-up proposal: how to script the preceding directions without hand-writing every combination. Documentation only. Continues [implementation, RNG and idle projects](06_AUTHORING_RNG_AND_IDLE_PROJECTS.md); [library](../../CHEAT_LIBRARY.md), [cosmology](../../CHEAT_COSMOLOGY.md), [PROJECT.md](../../../PROJECT.md) and [User vision](../../USER_VISION.md) remain authority. No universal cost, patron, cap, weakness or punitive balancing rule is selected.

## G1. Express many possibilities with a finite executable vocabulary

Use a layered grammar: supported effects plus composition, world rules, card definitions and persisted instances. A finite vocabulary can generate a large variety, just as a few game actions support many stories. It cannot honestly express every imaginable fictional power. Unsupported meanings require a new engine operation or an explicitly bounded authored substitute.

Conceptual grammar, not a current executable format:

```text
WorldInstance := WorldProfile + DeclaredAUOverrides + InitialState
CheatCard := Identity + Backing + Functions + Activation + Growth + Evidence
Function := Trigger + TargetSelector + Condition + EffectPlan
EffectPlan := Primitive | Sequence | Branch | ParallelPlan | Repeat | Adapter
GeneratedInstance := CardVersion + ResolvedParameters + Derivation + SavedState
```

Names are presentation. Effects operate on actual state. Calling a row “perfect replication” does not give it replication semantics. Similarly, a card being compiled does not place it in the world, grant ownership or earn knowledge.

## G2. A primitive catalogue with explicit support

| Operation family | Executable meaning | Source-read status in this pass |
|---|---|---|
| Facts and resources | Set declared facts; add/subtract supported numeric resources | Expansion engine effects exist, with validated scopes and finite ranges |
| Native outputs | Item, XP or reputation changes through supported host transactions | Named effect types exist; each item's legitimacy and host path still matter |
| Capabilities and techniques | Grant/remove a registered source or supported technique | Existing validated effect families |
| Opportunities | Schedule a registered choice with delay/lifetime | Existing effect family |
| Knowledge, custody, jobs and recipients | Observe or move actual supported state; schedule actual supported work | Structured packs advertise specific supported capability categories; categories are not arbitrary operations |
| Copy or transform | Specify what is copied, which fields survive, and where the result goes | A general cheat-copy primitive was not established by this read |
| Cross-life delivery | Preserve and deliver a defined object, knowledge or grant through a selected transition | General reincarnation delivery not established |
| Timeline fork/rewind | Define snapshot boundary, retained state and affected actors | General rewind operator not established |
| Rule rewrite or absolute effects | Change supported semantic authority under explicit scope | Not established as a universal runtime operation |

The future catalogue should name argument types, legal targets, read/write scope, timing, persistence, failure behavior and verification for every primitive. Keep prose descriptions separate from executable support. A controller's ability to write a fact is not permission to mint a body, erase history or invent rewards.

Costs may be absent. A perfect result may be deterministic. Infinity can be a semantic property of a specific function rather than an overflowing numeric resource. Supporting that property still requires an actual representation and operation.

## G3. Composition carries precise rules

| Operator | Useful meaning | Required choice |
|---|---|---|
| Sequence | Identify → claim → activate | Are partial results retained when a later step fails? |
| Branch | If attuned, use; otherwise reveal a study route | Does the branch use current conditions or a frozen commitment snapshot? |
| Parallel plan | Two workers contribute to one invention | Which writes conflict, and when is combined settlement atomic? |
| Repeat | Queue practice, production or experiments | Stop conditions and interruption behavior, without imposing fictional charges |
| Select | Choose one function, target or evolution | Who has authority to choose? |
| Sample | Resolve a declared uncertain parameter | Sampling moment, probability meaning and persisted result |
| Adapter | Translate a supported function into another world's channel | Which properties translate, weaken or remain unsupported? |
| Override | An AU changes a particular premise | Parent version, affected dependencies and conflict resolution |

These are proposed authoring operators, not claims that the engine already accepts these syntax forms. The current requirement validator supports `all`, `any`, `not` and `eq/gte/lte` fact predicates. That is a useful starting point for conditions. Existing frozen jobs cannot be assumed to reevaluate everything at settlement.

Generation and execution differ. A template may draw a fuel type once when an artifact is created; using the artifact then obeys that saved fuel rule. A stochastic effect can still draw on each activation when that is its declared mechanism.

## G4. World profiles and AU overlays

A world profile declares available power channels, causal/time rules, permitted transitions, source-backed procedures, discovery institutions and relevant environmental support. These are selected world-instance facts, not statements that every world needs the same ontology.

An AU overlay changes an explicit field or definition: soul-memory is retained, one institution exists earlier, a ritual has a different outcome, or a family owns a new artifact. Resolve conflicts at authoring time. Two overlays that assign different death-continuity rules need an explicit combined rule; silently choosing whichever file loads last produces an accidental universe.

Use a dependency map so a changed premise revisits the functions that rely on it. If a new AU preserves learned magic through reincarnation, review body-specific techniques, access to tools, stored memories and delivery eligibility. Do not automatically grant every consequence of “knowledge survives.”

The card definition, world profile, AU overlay and generated result each have a version. Save the resolved instance. A later source correction is a migration decision, not permission to reroll an existing artifact or rewrite its history.

## G5. Two worked pseudo-data cards

These examples are intentionally pseudo-data. Neither passes a current game compiler. Proposed operations and missing behavior are named so the desired semantics are reviewable.

```yaml
id: original.threadkeeper
revision: 1
family: knowledge-recording
backing: carried-artifact
functions:
  record:
    trigger: explicit-command
    requires: [holder-has-custody, procedure-actually-demonstrated]
    plan:
      - append-procedure-demonstration: selected-procedure
      - reveal-to-holder: recording-observed
  teach:
    trigger: explicit-command
    target: consenting-supported-recipient
    requires: [recording-exists, recipient-can-practice]
    plan:
      - queue-practice: recorded-procedure
      - on-supported-completion: grant-trained-technique
growth:
  authored-branches: [add-pattern-comparison, add-another-recipient]
costs: []
compatibility:
  travel: artifact-must-be-carried
  death: follows-object-custody
support:
  existing-seams: [technique-effects, source-provenance]
  missing-contracts: [procedure-recording, teaching-from-recording]
```

The useful first result is another actor performing a supported learned task. A description saying “they learned everything” is insufficient. The artifact need not have fuel or a patron. A variant can record instantly while practice remains ordinary; a different perfect-teaching variant can grant the supported technique immediately.

```yaml
id: original.continuity-capsule
revision: 1
family: next-life-preparation
backing: declared-soul-binding
world-profile: original.rebirth-laboratory.v1
au-overrides:
  rebirth-memory-channel: retains-one-selected-procedure
creation:
  choose: procedure-actually-known
  plan: bind-selected-record-to-supported-continuity-identity
delivery:
  trigger: resolved-rebirth-transition
  branch:
    identity-match:
      plan: [restore-procedure-memory, reveal-held-memory]
    no-identity-match:
      plan: retain-capsule-without-delivery
activation:
  requires: [new-body-supports-required-technique]
  plan: grant-supported-learned-technique
randomness: none
costs: []
support:
  existing-seams: [registered-sources, technique-effects]
  missing-contracts: [rebirth-identity, soul-binding, cross-life-delivery]
```

This capsule is not implemented by setting an inherited flag. The selected identity must survive a real supported transition; the recipient must receive actual useful knowledge or technique; incompatible activation must preserve the stored record rather than invent compatibility. Other variants could target an heir, a public library or an artifact retriever through different delivery operators.

## G6. Authoring pipeline

1. **Resolve the premise.** Write the intended observable behavior, source evidence or original/AU status, and what is optional. Choose the world instance and reachable early use.
2. **Map semantics.** Assign each sentence to supported primitives and composition. Record unmapped meanings, dependencies and any scripted adapter needed.
3. **Build definitions and instances.** Validate stable IDs, references, targets, custody, branch timing and version compatibility. Generate only parameters that the selected mechanism supports; save the resolved result.
4. **Prove actual behavior.** Test useful positive output, relevant refusal/failure, repeated settlement and save failures. Rebuild and play the chosen acquisition/use route on a fresh desktop/laptop origin, then verify save/reload/export/literal import for changed state.
5. **Publish the coverage record.** Distinguish source-defined, compiler-validated, runtime-tested and human-accepted. Add only genuinely verified primitives to the supported catalogue.

Natural language can help propose definitions and detect missing semantics. It should not execute arbitrary prose or generated JavaScript inside a save. A future interpreter can offer “implemented equivalent,” “authored event only,” or “needs new engine support.” Let the user pursue an unsupported invention as a recorded proposal without pretending the engine already grants it.

## G7. Scripted exceptions and coverage

Some powers deserve bespoke mechanics. Register a named handler with typed arguments, declared state access and a version; use the same persistence and validation boundary as other actions. A unique timeline operation or elaborate dream simulation need not be contorted into dozens of meaningless facts. Its adapter should not become an unrestricted escape hatch that lets arbitrary cards mutate all state.

Coverage should be a matrix of *mechanism × target × carrier × world rule × timing × continuity*. Testing one appraisal card does not prove appraisal of souls, future timelines or every book world. Test compositions at important joins, such as transferring a source while a job is active, or death during a pending delivery. Use generated valid cases and invalid definitions to exercise compiler boundaries; use authored browser cases for actual useful behavior.

Important outcomes of compilation: fully supported; supported with named adapter; valid design but missing runtime operation; conflicting premise; or unresolved source claim. Reject unknown executable behavior explicitly instead of silently dropping it. Preserve design prose separately so rejected compilation does not erase the idea.

## G8. Existing boundaries, inspected only

[`src/expansion_engine.js`](../../../src/expansion_engine.js) has a finite effect validator and rejects unknown effect types. Its named effects include resources, facts, opportunities, a specific chronicle operation, native item/XP/reputation effects, techniques and sources. This is evidence of bounded semantic validation, not an arbitrary cheat compiler.

[`src/authored_site.js`](../../../src/authored_site.js) validates a finite draft field set and compiles it into a schema-1 optional pack. That existing route authors local activities and scalar changes; its text fields do not create new mechanics.

[`src/structured_pack_definitions.js`](../../../src/structured_pack_definitions.js) compiles schema-2 structured definitions, checks owned IDs/collisions, declares supported capability categories and rejects executable `eval` and scalar-activity fields. Its own comment states that compilation neither provisions actors/stock nor creates a save, native object, timer or random selection. Runtime initialization is separate.

This pass read these seams but ran no compiler, tests, build or browser play. A general composition language, world-profile overlays, dynamic cheat generation, procedure recorder and rebirth capsule remain proposals. The practical next implementation is one selected card with its useful first action and a named support gap, while the broader grammar stays open for new primitives and scripted systems.
