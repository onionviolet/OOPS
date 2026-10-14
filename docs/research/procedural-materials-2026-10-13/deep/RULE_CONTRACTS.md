# Executable procedural rule contract, proposed

2026-10-13. Second-round design artifact, owned only by the implementation-audit worker. This proposes a typed declarative language and resolver, not a runtime implementation or accepted world physics. Read `deep/README.md`, the preceding implementation audit and current authority. No runtime files, saves, builds or tests changed. Existing SOURCE findings are reused rather than rerunning equivalent suites.

The contract is a proposed interface: a compiler can turn its validated records into indexed rules and existing staged commands. It must never invent a consumer for an unsupported effect. The first implementation remains one playable Village slice; research breadth does not require every world or material family to ship together. Unknown material properties stay physically real, and exact canon rules can coexist with invented local rules.

## Typed records and selectors

**P1: Six records, with separate responsibilities.** `MaterialDef` holds identity, sourced/original classification, revision, supported phases, declared property domains and responses. `Batch` holds owned constituents and quantities, phase, condition, structural state and retained generated truth. `Procedure` holds ordered operations and input policies. `RuleDef` holds match, transformation and effect laws. `ProductSnapshot` freezes the resolved result. `Observation` holds actor-specific evidence, not another physical state.

Every quantitative value is `{value: decimalString, unit: unitId}`. Every qualitative value is `{domain: domainId, value: enumId}`. A property declaration specifies its type, dimension, applicability and default if any. `hardness`, `restorativeAmount`, `fireAffinity` and `sacredOrigin` are distinct types, not interchangeable numeric strengths. Arbitrary unregistered property names do not become mechanics merely by entering a wiki or generated description.

Exact identity, origin and structural relations remain categorical records. They are not mass fractions and are not diluted by adding water unless a particular ritual law explicitly changes their applicability. Legacy 1–9 tag strengths need authored mappings before any dimensional comparison; they do not become grams, joules or affinity units automatically.

Selectors use `all`, `any`, `not` over typed leaves:

| Leaf | Executable meaning |
|---|---|
| `identity` | Exact material ID and accepted revisions; preserves ritual identity. |
| `family` | Membership in an explicitly defined family, with declared subtype inclusion. |
| `property` | Declared scalar interval or enum membership, with dimension checked. |
| `fraction` | Constituent amount or fraction of a named denominator, never an ambiguous percentage. |
| `phase` | Solid/liquid/gas or a world-specific registered state. |
| `provenance` | Match a physical origin/production receipt, not whether the player believes it. |
| `structure` | Match authored pattern topology, grain/orientation, layering or component roles. |
| `affinity` | Match a world-qualified affinity or coupling relation, with its declared scale. |
| `state` | Relevant condition, temperature or contamination of this actual batch. |

**P2: Truth uses four states.** A leaf evaluates `match`, `mismatch`, `notApplicable` or `unresolved`. Declared absence in an applicable domain gives `mismatch`; unsupported applicability gives `notApplicable`; missing required physical data gives `unresolved`. An author may explicitly admit `notApplicable`. A rule requiring unresolved physical data cannot consume inputs until its own defined fallback exists. Negation converts only match/mismatch; it does not convert missing data into proof of absence.

Observer projections separately carry `known`, `suspected` and `unobserved`. Unobserved properties still resolve from complete internal truth. Predictions can say “outcome uncertain” even while execution is deterministic. Missing source knowledge is not an extra random danger roll. A false notebook inference never overwrites the batch's physical record.

Combination is explicit and independent of observer knowledge:

| Operator | Ordered truth admission rules |
|---|---|
| `all(children)` | Any mismatch gives mismatch; otherwise any unresolved gives unresolved; otherwise any notApplicable gives notApplicable; otherwise match. Empty all is match. |
| `any(children)` | Any match gives match; otherwise any unresolved gives unresolved; otherwise any notApplicable gives notApplicable; otherwise mismatch. Empty any is mismatch. |
| `not(child)` | match becomes mismatch; mismatch becomes match; unresolved and notApplicable remain unchanged. |

Thus a definite failed conjunct blocks a rule even beside missing data, and a definite successful disjunct admits it even beside missing data. This resolves the predicate, not the quantity: binding and allocation still need complete data for whichever satisfying branch supplies consumed material. An explicit leaf wrapper `acceptNotApplicable` maps only notApplicable to match; it cannot turn unresolved into match. A rule fires only on final match. Final mismatch/notApplicable skips it; unresolved produces the declared fallback or a typed unresolved failure before spending.

Mixture selectors must declare their quantifier and denominator. `someConstituent(select, minimumAmount)` binds only eligible constituent amounts, not the entire vial. `allConstituents(select, domain)` evaluates every constituent in the stated domain with `all`; an unknown constituent makes it unresolved unless a decisive mismatch already fails it. The domain cannot omit trace amounts implicitly. `batchProperty` evaluates a separately defined derived property law, never existential membership disguised as a whole-batch property. A vial with 1 mg restorative herb and 99 mg inert filler may bind 1 mg under `someConstituent`; it does not satisfy “100 mg restorative material.” Categorical identity requires the selected object's declared identity or an explicit constituent binding, not its dominant fraction.

## Concrete schema shape

**P3: Compiler version 1, independent of the live save schema.** This illustrative fictional extraction rule is sufficient to implement without an arbitrary expression interpreter:

```json
{
  "id": "village.extract.restorative", "revision": 1,
  "languageVersion": 1, "scope": "original.village",
  "trigger": {"route": "process", "operation": "extract"},
  "bindings": [
    {"as": "herb", "role": "reagent",
     "select": {"family": "original.restorative_herb"},
     "consume": {"value": "2", "unit": "g"}},
    {"as": "water", "role": "carrier",
     "select": {"identity": "original.water"},
     "require": {"value": "20", "unit": "mL"}},
    {"as": "vessel", "role": "tool",
     "select": {"property": {"id": "temperatureTolerance",
       "gte": {"value": "80", "unit": "degC"}}}}
  ],
  "conditions": {"temperature": {"min": "60", "max": "80", "unit": "degC"}},
  "extent": {"mode": "limitedByDeclaredInputs", "quantum": "1"},
  "transform": {"operator": "partition", "constituent": "original.restorative",
    "fractionTo": {"extract": "0.8", "residue": "0.2"}},
  "conflict": {"group": "village.extract.herb", "priority": 10},
  "time": {"kind": "instantAtProcessCompletion"},
  "accounting": "original.materialBalance.v1"
}
```

The material definition supplies the herb's actual constituent amounts. Binding two grams does not assert two grams of restorative compound. Water remains present unless an explicit evaporation/separation rule moves it. `partition` moves the named constituent and produces declared extract/residue holders; other constituents follow explicit operator defaults. A compiler rejects a transform that omits their destination.

Compile validation checks IDs, references, dimensions, applicable selectors, role aliases, nonnegative quantities, operator signatures and complete destinations. Reject unknown fields instead of silently ignoring them. Rules compile against a retained definition bundle; compile success does not prove gameplay balance or browser behavior.

A required catalogue property omitted during authoring is a content-validation error when discoverable at compile time. Explicit `unresolved` is reserved for a deliberately represented incomplete physical model or runtime dependency with a defined recovery route, not an excuse to publish malformed material definitions.

## Quantities, roles and equations

**P4: Dimensional amounts precede scores.** Count, mass, volume, energy, time and world-specific charges are separate ledgers. Conversion requires a declared relation: density converts volume to mass under its relevant state; a known batch assay converts mass to active amount. “One herb” requires a measured specimen or declared unit specimen, not a universal gram assumption.

Use exact decimal/rational fixed-point operations in initial batch accounting. Save remainder fractions; UI rounding cannot remove them. For very large lore magnitudes, the chosen numeric representation needs a supported larger domain or symbolic payload with an executable consumer. A JavaScript safe-integer limit must never silently weaken an authored effect.

Typed formula operators can initially be finite: sum, difference, multiplication with checked dimensions, ratio, clamp within authored family response, piecewise table, saturating response, and limited reaction extent. Dose-response saturation is an authored effect law, not a universal metaphysical ceiling. Rate constants and nonlinear thresholds need units. Temperature differences must not be confused with absolute temperature. A later unsupported formula remains a proposal until its evaluator and tests exist.

Roles mean different ownership changes. A reagent is consumed according to reaction extent. A catalyst remains or changes by its explicit wear/poisoning law. A tool offers capability and may receive wear; its composition is not automatically poured into the mixture. A carrier holds/transports constituents and may participate in a separately declared reaction. Energy is spent from a real source or ledger. A ritual witness, pattern anchor or living participant is a supported binding role with world-specific prerequisites, never a fake chemical quantity.

Partial consumption of a stack creates a retained remainder or replacement key. Inventory item count stays integer; internal vial volume/fractions may be fractional. Splitting cannot share one mutable remainder object between two resulting items. Containers, contents and owned equipment retain distinct identities where behavior requires them.

## Resolution and publication stages

**P5: Ordered pure resolution.** `resolve({snapshot, allocations, procedure, rulesBundle, worldContext, retainedDraws})` returns `{delta, productRecords, scheduledWork, observations, trace}` or a typed failure. It has no DOM, inventory, storage or random-number side effects.

Stages are: validate input snapshot and referents; bind exact supplied quantities and capabilities; execute procedure steps in order; collect applicable reaction candidates; allocate extents against current available quantities; apply declared transformations; create scheduled kinetic records where needed; derive route-specific exposure payloads; validate ledgers and references; canonicalize outputs and observation candidates. Each step reads the preceding physical result. Grinding then extracting can differ from extracting then grinding only where a rule/operator supplies that causal distinction.

`delta` contains exact debits, retained/replaced batches, catalyst/tool changes, energy spending, new holders and new exposures. The host revalidates sequence, stock and access, then stages its owners. One durable envelope write precedes live publication, knowledge, XP and UI updates. Persistence failure changes no owner. A render failure after a successful write cannot refund committed ingredients. Existing seams are `persistExpansionPlan` (`src/expansion_persistence.js:7`) and native publication write/publish (`src/contextual_balm_native.js:11`).

**P6: Competing reactions need explicit semantics.** Candidate order cannot depend on JSON insertion order. Within an exclusivity group, a higher declared priority may select a rule only if its match and full minimum extent succeed. An exact-identity override must name the overridden rule IDs/group and scope; exact identity is not globally more powerful by default. Independent reactions may coexist when allocations do not overlap. When overlapping reactions compete and no priority/partition policy resolves them, return an ambiguity before spending.

For simultaneous competition, a declared allocator can partition reactants by fixed proportions or a world-specific kinetic law. Apply extents from one shared pre-step snapshot, then debit the totals once. Deterministic ties use authored policy, not a hidden reroll. A computational cycle detector rejects unresolved loops before commit; a source-supported self-sustaining process instead requires an explicit rate/source model and scheduler boundary.

**P7: Contact is a participant graph.** A rule can bind more than two entities: blade/coating/target/barrier, solution/catalyst/vessel/heat-source, or rune-grid/anchor/operator. The event describes actual contact edges and exposure route. Merely sharing a room does not prove every pair touched. Pattern matching checks declared edges, orientation and topology; family membership alone cannot substitute for an intact structure. Match unique entity bindings unless the rule explicitly permits one participant filling several roles. Index by trigger and positive selectors rather than enumerating all world objects.

## Time, explanations and exceptional accounting

**P8: Kinetics persist through the common clock.** Instant transformations settle at the triggering process boundary. Kinetic records retain rule revision, current fractions, elapsed extent, environmental dependencies and the next meaningful boundary. Rates can change when heat/contact/access changes. Advance computes integrated extent over supported intervals, bounded by actual resources. Splitting advances the parent to the split time, then apportions current state; it does not restart reaction progress or duplicate elapsed output. Unsupported offscreen conditions remain unsupported under the owning world rules, not guessed.

**P9: Trace precedes explanation.** Internal trace entries identify cause event, applied rule/revision, bound roles, quantities changed and retained state. An observer filter uses actual sensory access, prior knowledge and granted discovery routes. A visible color change can justify “turned blue”; it does not necessarily reveal the hidden affinity or secret rule name. Save useful observations atomically, and deduplicate discovery/XP by the actual evidence cause. Preview produces projections, never discovery records.

**P10: Conservation is rule-qualified.** Ordinary balance checks account for constituents across product, residue, vapor, leakage and retained apparatus. Energy follows its own law. Source-specific exceptions declare a named ledger: created matter, converted soul charge, external patron supply, symbolic oath change or a supported other-world transfer. Each exception records its cause and actual debit/grant terms. It does not have to obey ordinary mass balance, but cannot obtain unlimited inputs merely because the UI forgot a ledger. Powerful canon exceptions keep their sourced scale and constraints.

## Versioning and restore

**P11:** Material revision defines input truth; rule revision defines transformation semantics; product schema defines record interpretation; effect-family revision defines application semantics. Persist resolved products and active exposure payloads, not a recipe string that recomputes them under today's catalogue. The next batch may use a new rule revision while existing products retain theirs. Migration is explicit.

Product references must resolve across player bags, chest, traders, simulation owners, accepted-job reservations, container contents and active exposures. A whole-envelope loader validates the reference closure before reconstructing items. Save pending jobs with frozen allocated batch records/IDs and accepted rules. Garbage collection traces every holder, including effects whose source vial was consumed. No session cache may be the sole owner.

Current decoder ignores arbitrary extra fields (`src/items.js:1217`), and basic key validation admits them (`src/gameplay_transactions.js:27`). New keys therefore need a dedicated validator and decoder. Current `use_item` selects template effects (`src/main.js:4645`); effect restoration selects template plus duration (`:6707`). Both need instance-aware readers. Current WorkPlans validates registered commands (`src/feature_expansion_work_plan.js:49,86`), so generated procedures require an explicit supported adapter.

## Adversarial acceptance vectors

These fictional fixtures are proposed tests, not passed results.

| Code | Input/event and concrete expected result |
|---|---|
| T1 | Herb has internally known 4 mg sedating fraction, unobserved by player. Drink full extract: declared sedation applies; preview omits its named cause; ignorance adds no roll. |
| T2 | Fire affinity absent by declaration versus missing required affinity record. First fails positive affinity match; second returns unresolved without spending. `not affinity` does not accept the second. |
| T3 | 10 mg restorative in 10 mL, add 10 mL inert water. Product has 10 mg in 20 mL; a 5 mL dose delivers 2.5 mg, not the original 5 mg. |
| T4 | Split 20 mL containing 10 mg restorative and 0.004 mg irritant equally. Both halves contain 5 mg and 0.002 mg; display rounding changes neither. |
| T5 | 2 g herb contains 10 mg active; extraction fixture recovers 80%. Extract owns 8 mg, residue 2 mg. Re-extracting cannot grant a second original 8 mg. |
| T6 | Grind-before-extract has authored 80% recovery, intact-extract 40%. Same 10 mg yields 8 mg versus 4 mg; grinding afterward does not retrospectively grant the difference. |
| T7 | Two eligible rules each need 3 mg from a 4 mg shared constituent, same exclusivity group, equal priority, no override and no allocator. Resolve ambiguity; grant no products and consume zero. |
| T8 | Exact ritual rule overrides declared generic group only in world A. Identity succeeds in A; substitute uses generic rule; in world B the override does not fire. |
| T9 | Catalyst 1 g retained, tool wear 1 unit, input 4 g transforms to 3 g product plus 1 g residue. Catalyst count unchanged, wear applied once, all 4 g accounted. |
| T10 | Heat budget 20 J, two extents require 15 J each. Admit only one whole extent under quantum 1; preserve 5 J, not negative energy or two outputs. |
| T11 | Reactive solution shares room with target behind sealed glass. No declared contact edge: no target exposure. Opening and pouring supplies the route and can trigger it. |
| T12 | Kinetic fixture converts 1 mg/min for 3 minutes, then splits equally. Each child retains half current reactants/products; next minute converts total 1 mg under divided capacities, not 2 mg from duplicated rate. |
| T13 | Failed storage write after proposed output, notebook and exposure staging. Old input counts, product registry, knowledge, active effects, job and RNG remain exact; no orphan reference exists. |
| T14 | Vial consumed while its active exposure remains; garbage collect then export/import. Exposure still restores its 2 mg dose and expiry using retained family revision; missing payload rejects recoverably. |
| T15 | Ordinary rule outputs 6 g from 4 g with no source. Reject balance. A sourced exception declares and debits 2 g-equivalent world charge: admit 6 g and record the charge debit once. |

## Decisions before first implementation

**D1:** Choose the first ledger units, canonical product-reference representation and supported exposure families. **D2:** Choose one explicit competing-reaction policy for the first slice; ambiguity rejection is adequate until useful kinetic competition is authored. **D3:** Choose pending-job/product retention and unsupported-revision recovery semantics. **D4:** Choose the minimum observations and procedure controls visible at laptop size. These are concrete implementation choices; the broader world's lore laws and rare effect scales remain source-specific.
