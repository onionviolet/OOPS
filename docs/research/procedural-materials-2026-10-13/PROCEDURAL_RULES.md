# Procedural materials: rules, generation and composition

2026-10-13. **Proposal and source audit, not accepted implementation.** This lane owns only this document. No runtime edits, gameplay verification or new source acquisition. All examples are fictional. Sealed discoveries are intentionally absent.

Authority: [user vision](../../USER_VISION.md), [current audit](../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md), [E4 draft](../../emergent/E4_TAGS_AND_RULES.md), [E4B direction](../../emergent/E4B_MATERIALS_AND_NOITA.md), [shared vocabulary](../../emergent/SHARED_VOCABULARY.md) and [Noita substitution research](../noita/ALCHEMY_AND_SUBSTITUTION.md). True properties operate before discovery. Trials with unknown materials are allowed unless local rules forbid them. Exact canon recipes and functional substitutions coexist. First implementation stays one realm and one prestige layer.

## F1: Current code provides adapters, not procedural chemistry

Inspected `src/rules.js` exposes pure fact comparisons, outcome selection and resolution receipts. Its evaluator cannot debit reactants, identify fractions or solve reactions. Recipe selection in `src/crafting_recipes.js/find_recipe_material` matches exact IDs or `material_type`; the `Recipe.getResult` hook permits computed results, but the ordinary native result path in `src/main.js/execute_native_recipe` still publishes an `item_templates[result_id]` key. `src/items.js/Item.createInventoryKey` identifies ordinary items by ID/components/quality. The [current audit](../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md#verified-implementation-findings) documents additional template-bound use/restoration gaps.

Therefore, extending `evaluateRule` with more words is insufficient. Build a composition owner and pure resolver, then native item/effect/publication adapters. Preserve existing boolean tags and exact recipes; do not reinterpret every current category as a chemical quantity.

## P1: Separate three kinds of procedural content

| Mechanism | Generated state | Stable boundary |
|---|---|---|
| Derived chemistry | Product of inputs, preparation and environment | Same complete facts produce the same outcome |
| Seed-generated materials | Regional species, deposits and batch variation | Resolve once at the declared world/region/batch boundary |
| Seeded discovery recipes | Hidden ingredient roles and conditions | Resolve once per declared world/life, persist the recipe |

A hidden recipe can select an exact substance, a family or a property role. It cannot override ordinary chemistry accidentally: represent its exceptional law explicitly. Draws belong to purpose-specific saved streams/receipts, using shared vocabulary where adopted. Looking at a preview never draws or rerolls. Skill-dependent execution variation is a separate committed draw affecting actual heat/control/yield, not a random punishment for ignorance.

## P2: Properties describe different questions

Use families rather than one additive power score. Material family describes wood, mineral, solvent or tissue. Physical properties describe phase, density, hardness and conductivity with declared units. Affinities describe response to particular world energies. Constituents carry amount and route-specific activity. Condition describes moisture, contamination or spoilage. Quality describes workmanship or intactness. Grade remains a local lore scale.

Some properties belong to the bulk material; others belong to fractions. A herb is not simply `healing:4`: it contains an identifiable active fraction with extraction behavior. A ritual identity can be indivisible even if its mundane composition is understood. A sword assembled from parts retains component structure; melting it produces a different composition state. Do not average away the poison on its handle.

Generated properties must come from coherent families. A coastal herb family may vary salt tolerance, water content and extraction yield within correlated bounds; a rare affinity requires an explicit compatible branch. Constraints cover feasible phase/density, fraction totals, prohibited combinations, habitat, acquisition and useful applications. Validate the generator's feasible region before generation; report an impossible content definition instead of silently producing unrelated fallback powers.

## P3: Preserve material, fraction and batch identity

Definitions need stable IDs/revisions. Generated definitions additionally retain family, generation version and resolved properties. Owned batches contain material/compound IDs, integer amount in a declared unit, condition and relevant provenance. A mixture stores every fraction, including solvent, inert matter and traces. Use mass as an initial ledger where appropriate, explicit volume/density conversion for fluids and count for indivisible objects. Never compare one leaf to one barrel by count.

Fraction identity enables extraction, binding and conversion without inventing a potion template. Canonical product identity includes gameplay-relevant composition, condition and resolution version. Equivalent normalized products may share an inventory stack; different labels or knowledge do not change physical identity. Do not quantize away active traces for deduplication. Provenance matters when a rule checks it, otherwise keep a separate receipt rather than fragmenting every identical vial.

## P4: Procedures are ordered programs

A small typed grammar can support `grind`, `combine`, `heat`, `hold`, `cool`, `filter`, `extract`, `distill`, `coat`, `shape` and `seal`. Each operator declares required apparatus, input/output phases, units, time and relevant control parameters. Add only operators with implemented consequences. Empty knobs create work without depth.

Execution transforms a batch after each step. Grinding may alter extraction speed; filtration separates suspended solids but not every dissolved compound; heating before mixing can destroy a reactant that would otherwise bind. Distillation selects fractions through authored separation rules, not a generic purity bonus. An open vessel can lose specified vapor to atmosphere; a closed vessel must retain or vent it according to its apparatus rule.

Track retained product, other receivers, residues and losses explicitly. A catalyst is a reserved participant with a declared retention policy. It can be unchanged, poisoned, worn or partly consumed according to its law. Repeated extraction cannot duplicate active matter; recycled catalysts do not multiply output merely by being present in several roles.

## P5: Reactions need named roles and explicit competition

Match indexed candidate rules against exact IDs, family selectors and typed property ranges. Support three or more inputs, catalysts, inhibitors, concentration/temperature thresholds, pressure, age and vessel conditions. Roles have required amounts and multiplicities; the same owned quantity cannot satisfy two spent roles simultaneously. Thresholds must say whether they concern total amount, concentration, local contact or dose.

Rules declare reactant debits, products, retained participants and timing. Inhibition may stop a reaction, change rate or redirect it; it does not delete the inhibitor. Route and scope are selectors: drinking, loose contact, skin coating and an enchanted forge are distinct contexts.

Competition policy is authored. Use explicit override edges for canon exceptions and a stable priority policy for exclusive reactant competition. Equal-priority incompatible rules should fail content validation unless the law declares a partition or reaction-rate model. Alphabetical ID order is reproducible but is not an explanation of which chemistry wins. Independent reactions commute; competing reactions may consume resources differently and require their own defined semantics.

## P6: Bound computation without capping fictional possibility

Index by trigger, world scope, phase and positive reactant selectors. Maintain a changed-constituent queue; reconsider only rules affected by a change. A multi-input rule joins its indexed role candidates, rather than comparing every inventory object with every other object each minute.

Instant reactions must terminate through a decreasing consumed budget or an acyclic declared transformation graph. Reversible reactions use explicit equilibrium or scheduled kinetics; they must not oscillate in an instantaneous fixed-point loop. Cyclic magic can use its own fuel, time and event boundary. If an unresolved cycle or work-budget overflow occurs, stop before durable publication with a diagnosable error. Never commit a silently truncated brew. A computational work budget does not impose a universal ceiling on healing, permanent changes, explosions or rare lore effects.

## P7: Delivery and body response are separate resolution stages

Derive dose from administered amounts and concentration. Route adapters define absorption, onset, duration, accumulation and applicable body/world responses. Oral restoration need not be topical restoration; inhaled vapor need not equal its liquid. Save actual active-exposure payload, start/end times and effect-family policy, so reload does not reconstruct a stronger or weaker template default.

Effects may accumulate, replace, inhibit or synergize according to family rules. Several small doses and one large dose share the same exposure accounting, but need not have identical timing or threshold effects. In-body interactions consume or bind relevant exposure fractions under body-specific laws. Ordinary materials usually do ordinary things; exceptional materials can transform, grant permanent capabilities or produce extreme outcomes when supported by their rules. Knowledge changes prediction and explanation, never truth.

## P8: Scope, compatibility and idle production

World/region/place laws overlay base rules with explicit precedence and compatibility. Imported materials retain their own identity. Local physics can alter their response or leave an imported affinity inert, but origin alone is not blanket incompatibility. Exact canon preparations remain exact unless sources or accepted design authorize substitutions. Original systems can use the same mechanism with authored local laws.

Freeze generated definitions and discovered recipes with algorithm revision, resolved records and draw receipts. Save resolved products/effects too. A catalogue update must explicitly migrate or retain old semantics; a saved seed alone is insufficient. A portable procedure referencing an unfamiliar world's material remains a hypothesis until local compatibility is established.

A learned production method stores selectors, operation sequence, apparatus, expected yield ranges and shortage/variation stop conditions. Each queued batch reserves actual supplies and publishes inputs, products, knowledge and execution draws together. Resume at relevant process boundaries, including cooling/spoilage. Offline advancement must reach the same meaningful boundaries as active play; do not evaluate every second when no relevant state changes.

## P9: Worked fictional batch

Six grams of bellleaf contain 1.2 g restorative fraction R, 0.6 g sedating fraction S and 4.2 g inert matrix. Add 24 g water. A controlled extraction transfers 1.0 g R and 0.3 g S into the water, leaving 4.7 g residue. Filtration yields 25.3 g liquid and 4.7 g residue, conserving the original 30 g.

Adding 0.3 g of a fictional binder converts that 0.3 g S plus the binder into 0.6 g insoluble complex. Filtering again leaves 25.0 g liquid containing 1.0 g R and 24 g water; retained waste totals 5.3 g. Binder is spent reagent here, not catalyst. An authored oral response turns the R dose into restoration. A 5 g portion contains 0.2 g R. Doubling water halves concentration without increasing total R. Overheating instead converts a specified amount of R into byproduct D, with its own route effects. No separate diluted, purified or overheated potion templates are required.

## P10: Proposed schema and checks

Illustrative schema, not current registry syntax:

```js
{
  batch: {id, revision, phase, fractions: [{compoundId, amountMg}], condition},
  procedure: [{op: 'heat', temperatureC: 70, durationMinutes: 5}],
  rule: {id, revision, scope, trigger, roles, conditions,
    inhibitors, overrides, competitionPolicy, debits, products, retention},
  resolved: {products, residues, losses, catalysts, causeTrace,
    resolverVersion, materialRevisions, ruleRevisions, committedDraws},
  exposure: {route, administeredFractions, onsetAt, expiresAt,
    payload, effectFamily, responseVersion}
}
```

Property/metamorphic checks should verify conservation or explicit magical sources/sinks; split/recombine equivalence; dilution preserving total active amount; inert additions changing only declared dependent outcomes; scale equivalence where laws are linear; intentional threshold nonlinearity; independent reaction-order equivalence; intentional procedure-order differences; exact/profile matching; catalyst retention; trace persistence; knowledge-independent truth; preview purity; fixed-seed stability; queued/active boundary equivalence; and complete save/import/effect restoration. These are proposed checks, not test results. Native proof must finally acquire, prepare, discover, use and repeat one meaningful brew on a fresh rebuilt laptop origin, with reload and literal-file import.
