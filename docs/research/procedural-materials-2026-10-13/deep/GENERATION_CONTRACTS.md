# Generation contracts and material ontology

2026-10-13. **Original design proposal; no runtime implementation or executed generator tests.** This lane owns only this file. Scope follows [deep-round assignment](README.md) and builds on the [joined report](../REPORT.md), [rule design](../PROCEDURAL_RULES.md), [cross-system contracts](../CROSS_SYSTEMS.md) and [source audit](../IMPLEMENTATION.md). [User vision](../../../USER_VISION.md) and [PROJECT](../../../../PROJECT.md) remain authoritative. Unknown properties remain physically real; exact canon and original procedural systems coexist. Research breadth does not expand the first playable milestone beyond one realm/one prestige layer.

## P1: Shared ownership, several representations of truth

Do not make every substance a bag of tags or every artifact a mixture. A reusable product envelope can contain composition, assembly, pattern and exact-identity references independently. Consumers select the representations they need. An abstract canon crafting budget is also valid, with no invented molecular breakdown.

| Record | Proposed fields and semantics |
|---|---|
| `ItemTemplate` | `id`, `revision`, `presentationFamily`, `inventoryAdapter`, `allowedProductKinds`, `defaultConsumerRefs`. Native base carrier, not the complete generated behavior. |
| `MaterialDefinition` | `id`, `revision`, `worldLawRef`, `familyRef`, `identityKind`, `propertyValues`, `fractionRecipe`, `processResponseRefs`, `consumerRefs`, `provenancePolicy`. Definition of material truth. |
| `CompoundDefinition` | `id`, `revision`, `dimension`, `routeResponseRefs`, `transformationRefs`, `visibilityPolicy`. Stable fraction identity; not necessarily a real-world molecule. |
| `OwnedBatch` | `id`, `definitionRef`, `fractions`, `amountBasis`, `phase`, `condition`, `originRef`, `custodyRef`, `generatedOverrideRef`, `createdAt`. Actual stock and its current condition. |
| `Assembly` | `id`, `revision`, `partsByRole`, `interfaces`, `geometryClass`, `condition`, `patternRefs`. Parts retain identity and quantities; connections have typed requirements. |
| `Pattern` | `id`, `revision`, `grammarRef`, `nodes`, `edges`, `anchorRefs`, `carrierRequirements`, `energyBudgetRef`, `capabilityRefs`. Valid structure, not a free list of buffs. |
| `ExactIdentity` | `id`, `lawRef`, `kind`, `indivisible`, `custodyRef`, `containedIdentityRefs`, `allowedTransformRefs`. Singular/conserved identity where lore requires it. |
| `GeneratedDefinition` | `id`, `familyRevision`, `scopeKey`, `generatorRevision`, `resolvedValues`, `drawReceipt`, `validationReceipt`. Freeze what generation actually chose. |

`fractions` entries are `{compoundRef, amount, unitRef, phase?, boundTo?}`. `boundTo` distinguishes a free active fraction from a bound complex or component. Keep every meaningful trace. Fields with no applicable law are absent, not zero: an oath has no assumed density. Completeness is consumer-relative: every property queried by a selected consumer needs a supported value, an explicit lawful default or declared unresolved behavior. An unknown value can block a computation or require a local adapter; it cannot silently become zero. Optional properties need not become mandatory all-fields paperwork. Exact identity is not inferred from matching physical properties. A fraction can reference a conserved identity, but custody must then prevent simultaneous ownership through two references.

## P2: Dimensions and conversions are local contracts

A property descriptor is `{id, dimension, unitRef, domain, appliesTo, measurementProtocolRef}`. Amount descriptors distinguish mass, volume, count, local energy and indivisible tokens. Values use exact integer base units where practical, with explicit rational conversion and rounding/remainder policy. A fictional affinity scale can be dimensionless yet still world-scoped.

`Conversion` requires `fromUnit`, `toUnit`, `lawRef`, `conditions`, `factor` or `functionRef`, `remainderPolicy` and `conserves`. Mass-to-volume needs density under relevant conditions; count-to-mass needs a measured or declared specimen mapping. Conversion between different worlds' energies requires an actual compatibility law, not spelling similarity. An unknown conversion is unsupported, never a guessed constant.

Purity is a query such as `targetFractionMass / eligibleSampleMass`, with a named target and assay context. A brew can be pure with respect to one constituent yet contain another active constituent. Grade is a named local classification with its own criteria. Neither becomes a universal “better” scalar. Magnitude, workmanship, condition, concentration and amount remain separate. Typed descriptors are proposed additions/adapters beside the shared vocabulary's historical 1–9 tag strengths, not an accepted rename or reinterpretation. A boolean/category adapter cannot invent a quantitative effect merely from a family name.

## P3: Generate variation at the right boundary

| Boundary | Truth selected there | What does not reroll |
|---|---|---|
| Species/family variant | Stable fraction recipe and response traits | Each gathered leaf's species identity |
| Region | Habitat suitability, available family branches, local-law modifiers | Region traits every visit |
| Deposit | Ore composition, structure and extraction response | Mineral truth every mined piece |
| Batch | Moisture, contamination, harvest condition, declared specimen spread | Batch when moved, split or previewed |
| Processing | Actual retained fractions, phase and structure after operations | Original definition or unrelated world seed |

Use scope keys including world instance and relevant region/deposit/lineage identity. Two AUs can share explicitly inherited definitions or generate independently; that is a world configuration choice. A life-secret recipe uses a life key; a world-secret recipe does not silently reset at death. Stable identities survive transfer and import.

Conditional inheritance matters: regional salt exposure can select a compatible salt-tolerant branch; batch rain changes moisture; drying changes that moisture later. None should independently randomize a restorative fraction merely because all are “variation.”

## P4: Family grammar and generation pipeline

Illustrative fields, not current engine registry syntax:

```js
{
  id: 'family:original.bellleaf', revision: 1,
  scopeKind: 'species', worldLawRef: 'law:original.botany@1',
  identityPolicy: 'generated-family-member',
  parents: [], mutuallyExclusiveBranches: ['marsh', 'upland'],
  latentAxes: {extractive: {integerRange: [0, 4]}},
  correlatedBindings: ['binding:bellleaf.fractions@1'],
  hardConstraints: ['constraint:fractions.accounted@1'],
  habitatRules: ['habitat:bellleaf@1'],
  availabilityRules: ['supply:bellleaf.harvest@1'],
  rarityPolicyRef: 'rarity:bellleaf.affinity@1',
  countertraitBindings: ['binding:bellleaf.restoration-sedation@1'],
  consumers: ['consumer:oral.restoration@1', 'process:extract@1'],
  minimumUsefulRoutes: 1, generationBudget: 32,
  presentationGrammarRef: 'names:bellleaf.observed@1'
}
```

Pipeline: resolve scope/law and parent revisions; choose an eligible branch; draw shared latent axes; derive correlated properties and fractions; derive habitat/acquisition; instantiate process/consumer compatibility; validate identity, quantities, dimensions, reachability and constraints; publish definition plus receipt atomically. Inventory acquisition subsequently creates owned batches.

Generate from constrained parameters, not independent random tags. Hard constraints specify legal content; soft weights specify variety within legal content. Rarity changes branch frequency and supply, not automatic magnitude. Countertraits are causal where appropriate, not a universal demand that every powerful object have a downside. An exceptional lore material can be unambiguously excellent if that is its law.

A finite rejection budget protects computation. Exhaustion produces a content-validation error and no saved partially generated definition. An authored fallback is permissible only if declared, lawful and separately recorded. Do not clip an invalid property to a boundary and pretend the intended distribution survived. Conflicting parent bindings require an explicit override/combination rule; unknown law IDs fail validation rather than behaving as inert defaults.

## P5: Three worked original families

These numerical values and laws are fictional demonstrations, not botanical, metallurgical or canon claims.

**H1: Ordinary bellleaf.** A species draw chooses integer axis `x` from 0–4. In a standard 10 g dry sample, restorative fraction R is `(10 + x)` percent, sedating fraction S is `(4 + x)` percent, and matrix is the remainder. The correlated rise in R/S means a more restorative specimen also requires attention to preparation. Marsh and upland branches share this grammar but have declared habitat and extraction differences. Fresh-batch water is separate from the dry fractions.

For `x=2`, 10 g dry stock contains 1.2 g R, 0.6 g S and 8.2 g matrix. An authored extraction transfers selected amounts into solvent; a selective binding process removes S with accounted residue. R supports an oral restoration consumer, S a sedation consumer; an authored topical carrier may expose only one response. Many usable brews emerge from ratios and preparation without pre-authoring every potion. A weak R draw is still reachable and useful through increased input or an ordinary alternative recipe; no advanced assay is required merely to attempt extraction.

**H2: Original ore and composite.** A deposit chooses integer metallic fraction `m` from 50–70 percent and impurity branch `clean` or `brittle-grain`. Remaining mass is gangue plus explicitly accounted impurity. One deposit-level grain parameter influences both fracture response and smelting recovery through named local functions. It does not generate hardness, ductility and conductivity independently.

At `m=60`, 100 g ore holds 60 g metal-bearing fraction and 40 g gangue/declared impurities. A fictional smelter recovering 80 percent yields 48 g metal and 52 g residue, with energy/apparatus separate. A lamination operator combines 48 g metal with an owned flexible fiber backing; the assembly stores layer amounts, orientation class and adhesive interface. Its cutting edge and flex response use different constituent/structural consumers. Melting destroys the layer structure and returns only declared fractions, so “metal tag retained” cannot preserve a laminate bonus after remelting. No universal purity score decides whether the composite is preferable to a solid part.

**H3: Original arcane inscription substrate.** A world-local crystal-pigment family chooses branch `steady` or `pulse`, channel affinity and lattice parameter together. Capacity is measured in `energy:original.lumen`; conductivity and pattern-node compatibility derive from that lattice. Pigment carrier composition is ordinary mass, stored energy is a separate ledger, and a singular bound seal is an exact identity if that branch requires one.

A steady specimen supports sustained lamp patterns but excludes an authored pulse node. A pulse specimen supports bursts and uses its declared leakage schedule. Grinding into ink transfers only the declared lattice-bearing fraction and may reduce continuous channel length; applying ink also requires a connected pattern and eligible surface. A pattern grammar combines valid anchor/channel/output nodes to yield lamps, signals or sensors without separately coding every full artifact, but each output capability still needs an executable consumer. Copying a drawing supplies no energy or conserved seal. Rare branches can support extreme patterns under their actual law; there is no universal magic-strength cap. These are original mechanics, not claims about any book's mana or runes.

## P6: Hidden recipe generation needs a feasibility certificate

A `DiscoveryRecipe` has `id`, `revision`, `scopeKey`, `worldLawRef`, `generatorRevision`, `roles`, `operations`, `conditions`, `resultLawRef`, `substitutionPolicy`, `drawReceipt`, `sealedVisibility` and `feasibilityReceipt`. Roles declare exact identity, functional profile or abstract budget, plus amount/unit, spent/retained policy and multiplicity. A secret recipe can add a world-specific exceptional transformation, but its physical result must be specified rather than randomly selected after each trial.

For outputs promised playable, feasibility validates that each role has eligible obtainable candidates, the required station/tool/energy exists, steps can reach required states, quantities can coexist and the output has a useful consumer. Reachability also examines progression: ingredient acquisition cannot require the very product being discovered unless there is an independent initial route. An assay unlocked only by that brew must not become mandatory to select unknown ingredients. A rare recipe may require difficult exploration; it must not require an absent region or an impossible combination of mutually exclusive life choices.

The certificate records witness acquisition/process paths and their assumptions, not player-facing spoilers. Dynamic political access or extinct supply can later interrupt production; that is a changed world state, not an originally valid certificate promising eternal availability. Optional rare/dormant worlds and historical-only content can remain intentionally unreachable until separately selected for play. There can be deliberately lost/impossible recipes as authored lore, but mark them `reconstructable`, `historical-only` or `currently-blocked`, rather than presenting them as generated playable discoveries. Never repair feasibility by quietly replacing an exact canon ingredient.

## P7: Knowledge, condition and naming

An observer profile is `{subjectRef, propertyRef, estimateOrRange, source, confidence, observedAt, protocolRef}`. Truth is the definition/batch; knowledge is a separate assertion. Unknown never means zero. An assay may identify a family without detecting an unfamiliar fraction. “No detected member of family X” cannot become “harmless.” Recipe preview reports known satisfaction, known conflict and unresolved checks separately; trials resolve actual truth.

Condition records relevant moisture, integrity, contamination, charge or expiry boundaries. A material changes only through an applicable law. On drying, update water quantity and accounted losses; do not reroll species. A transformation can create a new definition/phase or fraction record while preserving required identity references. Save each resulting revision and meaningful time boundary.

Names are observer-filtered presentation. Initially use observable appearance/origin or a neutral assigned label, then permit learned identification and personal names. Generator branches named internally `poisonous` or `rare-affinity` must not leak through item names, sort categories, prices, tooltips or discovery logs. Trade value may itself require a knowledge-aware local valuation rule. Player naming is metadata and does not change stack behavior or bypass exact identity. Canon names may be openly known where that source permits it.

## P8: Version freezing and deterministic fixtures

Persist resolved generated values, family/law revisions, scope key, generator revision, draw receipt and validation receipt. Retain unresolved imported records for an explicit compatibility response; never erase fractions or convert unknown properties to safe defaults. Old records keep semantics through retained interpreters or explicit migrations. A new catalogue must not recompute old material truth from seed alone. Processing products save their resolved composition/structure and resolver revision too.

Proposed golden fixture for H1: supplied generation receipt has integer draw `250000` in `[0,1000000)`. Mapping `x=floor(draw*5/1000000)` gives `x=1`: R=11%, S=5%, matrix=84%. Boundary draw `999999` gives `x=4`: 14%, 8%, 78%. These specify mapping tests independently of the eventual stream implementation; they do not claim current seed behavior. Additional seed-to-receipt vectors must freeze the selected hash/PRNG, scope-key serialization and algorithm revision before release.

Metamorphic requirements: identical scope/revision/receipt yields identical truth; unrelated catalogue ordering does not alter draws; split/recombine retains fractions and batch variation; species inheritance survives harvest repetition; unknown/known observers see the same effects but different descriptions; added solvent changes concentration without generating active mass; process order changes only declared dependencies; offline and active execution cross equivalent relevant boundaries; generated recipe witnesses remain valid after full save/import; and a rejected generation publishes neither definition, stock nor advanced draw state. Tests should distinguish legitimate nonlinear thresholds from accidental scaling bugs.

## P9: Practical authoring lints

| Lint | Reject or flag |
|---|---|
| Referential/dimensional | Missing revision/law/consumer, incompatible units, unexplained conversions, undeclared property domains; missing supported/default/unresolved behavior for a queried field |
| Composition/identity | Fraction totals outside basis, negative amount, duplicated conserved identity, lost meaningful traces, invalid assembly interfaces |
| Distribution/constraints | Empty feasible region, conflicting inheritance, inaccessible weighted branch, independent draws contradicting required correlation |
| Usefulness/coverage | Generated property with no reader; positive-probability branch with no useful consumer unless explicitly decorative/lore-only |
| Reachability/gating | Dead recipe roles, absent apparatus, circular product gates without initial path, simultaneous exclusive requirements |
| Pattern/exception | Disconnected channels, missing energy payer, forbidden node pairing, exact canon identity replaced through generic fit |
| Presentation/version | Sealed truth in names/logs, unknown treated as absent, unpinned algorithm, silent migration, unsupported persisted reference |

These lints constrain authoring errors, not player ingenuity. Weird but lawful combinations should remain possible. The three families and schemas are implementable proposals; no generator, atlas completeness, native behavior or balance acceptance is claimed here.
