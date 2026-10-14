# G48-B7.C: fixed bodies, inheritance and observer knowledge

Proposal, 2026-10-14. [B2 SPEC](../b2/SPEC.md) owns physical/person/card paths;
[B2 MIGRATION](../b2/MIGRATION.md) owns the native-player split. This lane adds
NPC demand and lineage contracts without editing B2 or choosing a universal
genetics model. [TRIGGERS](TRIGGERS.md) owns future commit semantics.

## G48-B7.C1 One qualified person, one authority for each body

Use P19's proposed `PersonRef = {ownerRef, personId, instanceRef,
incarnationRef?}` (`p19/CONTRACT.md:7`). A physical `bodyId` has its own owner
and lifecycle. An explicit mapping can expose P4 travelers, household members
or simulation actors to a shared body reader without merging their inventories,
relationships or knowledge. Matching names or local IDs is insufficient.
For example, the household's `neri` and the People row's route apprentice
must not be joined from their display name.

Logical NPC attachment, field names proposed for later integration:

```text
NpcBodyEntry
  personRef, bodyRef, schema, revision
  bodyRecord: sparse B2 physical/person paths
  generation:
    seedAnchor, generatorRevision, modelRef, templateAnchorRef,
    constraintRef, resolvedBundles[path -> {definitionRevision, causeRef,
      epochRef, inputRefs, outcome: value | none | notApplicable}]
  lineageAnchorRef?
  observationOwnerRef

CreationCapsule
  id, childPersonRefs, childBodyRefs, creationKind, causeRef, eventClockRef,
  conceptionOrCreationAt?, birthAt?, contributorRefsWithRoles,
  parentTransmissionSnapshotRefs, kinshipBasisRef, modelRefWithRevision,
  sharedTemplateOrLitterRef?, mutationOrEngineeringReceiptRefs,
  developmentalInputRefs, childTemplateAnchorRefs, coverage
```

Default storage proposal: an optional single NPC-body table in the owning save
envelope, indexed by qualified body reference, with compact person/lineage
references to existing owners. Root chooses its exact envelope placement and
schema during integration. Each NPC adapter reads that table or its preexisting
physical owner, never both as competing truth. Existing simulation `body` fields
and custody remain authoritative for their functions; overlapping dimensions
need a declared adapter and alias validation before B7 can write them. The
native player's B2 record stays at `character.body_record`, not copied here.

NPC schema and model revisions are explicit future extensions. B2's current
schema1 rejects unknown keys and reserves GN as unassigned. Do not append
`bloodlines` or parent loci to that schema and claim compatibility. A bloodline
card references the existing source/faculty authority for activation; a
hereditary eligibility attachment is distinct from its current expressed power.
Person identity/address follows the person on body replacement; physical data
and immutable template choices follow the body. Resolved-bundle receipts are
compact commitments, not a minute-by-minute body history.

## G48-B7.C2 Conception-time constraints precede later detail

Default: resolve only the model-required transmission subset of each contributor
when a supported child/clone/offspring event commits. Freeze their event-time
transmission inputs and immutable child/template anchors. Later child observation
materializes phenotype from those inputs. A parent's later surgery, practice,
awakening, curse or burn cannot retroactively change an existing conception.

Dial: a setting may transmit acquired states, use a patron's designation, a
single parent, multiple contributors, an engineered template or no heredity.
Specify its mechanism, timing and scope. World-specific births can include
later gestation effects; save those dated inputs through birth. Reason/cost:
offspring consistency requires a small latent capsule, not a full genome or
full physical detail for every ancestor. Conception and childhood still use
actual supported time, care and resources from their domain owners.

If a child is first authored as already born, admit parent references and the
child's constraint/template capsule together before showing any child's fixed
trait. If no parent traits are concrete yet, shared latent parental anchors
can constrain both parent and child future fields without publishing the
parent's phenotype. If the relevant parental transmission field is already
fixed, use it exactly. Different phenotypes can share a compatible genotype
under GN1/GN2; a trait absent in appearance does not mean no carrier.

For an existing child with unresolved prehistory, migrate as incomplete
coverage. Prospective completion may solve missing parent/child inputs jointly
around all fixed facts under a qualified model. Mark synthetic background
coverage and event-time uncertainty; do not fabricate GN4 exposure history.
If constraints are unsatisfiable, stop that genetic operation and retain the
records. An authored exception, mutation or nonbiological link requires its
own basis; it is not a convenient reroll of the parents.

## G48-B7.C3 GN dependency map

Parent-dependent field families are species/template ancestry; inherited frame
and growth potential (PH1), physiology/senses/voice/appearance (PH2-PH11),
species-qualified SG1/SG2 development, latent physique/constitution factors,
heritable quirk predispositions and genetic/lineage carriers, **only where the
selected model declares transmission**. Actual height at an age can also depend
on the child's saved development; acquired expression depends on their own
history. Temperature-set sex or birth-environment faculties need those event
inputs rather than a parent's gender. Similarity is neither a paternity verdict
nor proof that every field is inherited.

| Existing code | Parent/event input needed | Child state fixed or later resolved |
|---|---|---|
| GN1 | Model-relevant latent factors, species/lineage templates and variation rule at conception | Stable factors plus bounded model variation drive frame, metabolism or capacity; do not average parents' current training stats |
| GN2 | Carried factors separate from expression and penetrance/development rules | Carrier status fixed; later expression uses fixed factors and real triggers. Ordinary parents may have exceptional offspring where the model supports it |
| GN3 | Contributor roles and declared one-parent/sex-linked transmission rule, qualified biological factors | Transmission follows that rule. Gender identity, name, marriage or an assumed mother/father label is not the genetic input |
| GN4 | Supported contributor state at conception and saved gestation inputs with timing/coverage | Freeze relevant exposure/blessing/condition contributions. Missing past famine or breakthroughs remain unknown rather than reconstructed from current physique |
| GN5 | Parent transmissible changes at that epoch; separate child mutation seed/exposure receipt | Mutation origin fixed and distinguished from inherited trait. Later somatic changes do not transmit without the world's rule |
| GN6 | Shared conception/litter ID, identical-template or fraternal rule, contributor snapshots | Identical twins share the template anchor; later scars, training, personality and acquired conditions remain individual |
| GN7 | Qualified biological graph or retained kinship capsule covering the model's required depth | Preserve common ancestors and model scope. Adoptive/ritual/teaching edges do not silently count as genetic relatedness; incomplete ancestry yields unknown, not unrelated |
| GN8 | Actual descent/carrier inputs and retained sample/test identifiers | Parentage truth remains distinct from resemblance and recognition claims. Tests reference immutable samples/event epochs |
| GN9 | Same truth inputs plus test means, calibration, scope and error model | Save the reported result, diagnostic limits and observer basis. A test may miss a present function |
| GN10 | Species-qualified contributor/template inputs for animal, plant or other organisms | Reuse the dependency contract where a model fits, not an assumed human two-parent genome |
| GN11 | Donor/template snapshot, engineering operation, edition and transmissibility policy | Clone/edited body pins what was copied/changed. Copying a body does not copy a self, learned skills or a relationship |
| GN12 | Model-relevant inherited longevity factors and species development curve | Fix potential/curve inputs. Existing authored death dates remain unchanged; current illness, supported extension and actual death keep their own authorities |

## G48-B7.C4 BD dependency map

| Existing code | Dependency and timing | Retention/consistency rule |
|---|---|---|
| BD1 Throwback | Retained ancestral carrier/template or authored original exception | Do not roll a hidden ancestor's contradictory concrete body. A compact ancestry capsule can preserve dormant capacity without creating ten generations of NPCs |
| BD2 Ancestor recall | Existing latent eligibility, ancestor/site/ritual and actual trigger | Awakening changes expression. It does not rewrite past conceptions or grant all ancestral learned skill by naming the line |
| BD3 Pact | Patron/participant/descendant clauses and effective dates | Descendants inherit only qualified terms; political clan membership alone is not a pact |
| BD4 Place of birth | Actual saved birth site, local environment/era and event cause | Bind at birth. Later address or world crossing cannot reroll the birthplace mark |
| BD5 Ritual kinship | Supported ritual, adopted participants and key/line recognition scope | May grant supernatural eligibility where authored; does not rewrite biological parentage or every genetic factor |
| BD6 Possession | Actual host/occupant binding, duration and faculty carrier | Keep temporary faculty separate from germline. Transmission only if the world explicitly supports a retained heritable change |
| BD7 Burning blood | Concentration/carrier before burn, event time and declared germline effect | Old child capsules use preburn inputs; later conceptions may use postburn inputs under the selected rule |
| BD8 Stripping/sealing | Distinguish destroyed carrier, suppressed expression and altered transmissibility | A sealed expression is not absence of a carrier. Event-time inheritance reflects the precise effect rather than a generic zero |
| BD9 Dilution/recovery | Contributor concentration/factors at conception, model revision and purification receipts | Save mixture result or latent anchor. Later parent purification affects later offspring only unless an explicit retroactive power has its own event |

No universal purity hierarchy, dominant/recessive scheme or inherited penalty
is selected. [G1/G11](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g1-distinct-layers-connected-effects)
also permit non-DNA mechanisms and strong advantages without mandatory flaws.
Inherited display/effect fields depend on these frozen inputs; acquired quirks,
scars, tattoos, training, social roles, identity and attraction do not copy from
parents merely because they exist in the same body record.

## G48-B7.C5 Observer claims remain outside generation truth

Keep four states explicit: unresolved engine truth, resolved but unobserved
truth, received/perceived claim, and observer-supported diagnosis. Unknown to
an observer is not a roll request. A boast, a rumor or a forged registry can
exist without resolving the proposition's underlying genome. A diagnosis
requests only the truth subset its method actually tests.

B2 observations `{path, stage, value, at, evidenceRef}` are a base vocabulary.
The NPC adapter also needs body/epoch, observer, scope, method and origin
references, stored with the existing claim/basis owner or a supported extension.
Use existing stage semantics as learning stages, not probability or certainty.
`src/simulation_effects.js:281-284` overwrites eligible same-key knowledge by
stage; contradictory reports need distinct claim IDs/editions and a separate
belief reader, not repeated writes that erase a prior account. P19
GOSSIP.md:13-23 distinguishes truth, claim, transit and belief, and preserves
shared origin/correction. Received statements keep shown/stated/inferred basis.

The body's owner also has limited self-knowledge. NPC internal task resolution
may use true capacities while their planner uses beliefs and observed means;
failed expectations can teach them through a real cause. The player receives
no extra claim unless present or reached by a real channel. A distant friend,
spouse or brood member does not learn a test automatically. Supported true-reading
powers can change disclosure scope without changing underlying body truth.

Public projections exclude private parent links, latent IDs, hidden-trait counts,
generation coverage, solver constraints and secret-bearing reasons. Check visible
text, DOM IDs, tooltips, accessibility labels, search, sort, filters, disabled
actions and timing differences. A generic unmet prerequisite can avoid revealing
which private field failed. Sealed evidence is reported by ID, route and status
only. Nothing in this packet prints an actual sealed truth.

## G48-B7.C6 Migration of existing NPCs

Compatibility default: old lives retain their exact outcomes, names, clocks,
RNG, requests, knowledge, sources, body capabilities and commitments. Missing
NPC-body domain means no enrollment and no random generation on load. An
unmaterialized body identity can be derived from a qualified existing identity
without drawing RNG; persist its anchor only at a successful migration save or
supported first demand. Invalid present data is not treated as absence.

| Code / input owner | Additive preparation and preserved behavior |
|---|---|
| M1 `npc_lives` schema1 | Retain birthYear, joinedYear, deathYear, parents, spouseId, events/news and seed. Use actual year chronology only when compatible with the requested biological-age basis. Parents are legacy family links, not verified genetic roles; spouseId is not romance or parentage proof. Future joined members remain unintroduced. No extra births or changed death dates |
| M2 P4 `generated_people` schema1, if integrated | Preserve seed/rng, all three IDs, names/culture/grammar, traits/knownTraits, arrivedAt, need, goal, possessions, routines, met/resident/relationship and fulfilled requests. arrivedAt is not birth time. Add an independent body seed/version, never replay the generator or advance its RNG. P4 is read-only branch evidence in this task |
| M3 Simulation persistent people | Retain actor/person identity, body/form/custody, bornAt meaning, life/vitals, sources/faculties, conditions and all directed ties. Do not invent species or biological age from enrollment time. Existing body fields supply constraints through a declared adapter; do not write a second overlapping authority |
| M4 Existing authored description/known observation | Typed authored facts and earned observations constrain future values with provenance. Prose/kinship/title cannot be parsed into an unverified genetic fact. Preserve a prior false claim as a claim; it need not constrain truth unless a real observation supports it |
| M5 Legacy player/native record | Delegate to B2 migration. Old `bio.gender` maps identity/address, not SG1/SG2. Do not apply its full native record defaults to every NPC or copy the player's world profile |

Preparation clones and validates the complete envelope, migrates old versions
in the existing order, checks unique qualified identities, safe IDs, allowlisted
paths, supported revisions, lineage acyclicity and role/timing compatibility,
then uses real-loader preflight before guarded storage writes. Preserve declared
magic/time exceptions through their rule references instead of imposing human
age assumptions. Migration is idempotent and consumes no clock or RNG. No
test/observation/news is published as a side effect of loading.

Present unsupported active schema/model revisions reject before mutation or
write, preserving the input for a compatible build. Unknown prehistory remains
unassigned; missing optional source packs cannot justify replacement traits.
Retained external references need an immutable supported definition or capsule;
never silently rebuild them from newer pack content. Successful saves gain the
new domain explicitly on all routes; downgrade compatibility is not promised
for executables that ignore it. Test only generated fixtures, not user saves.

Root must qualify placement in `create_save` and all load/preflight paths.
`src/components/bio_component.js:11-17` saves only four native bio fields;
`src/main.js:5189,5307` owns household save/load; P4 worktree
`src/main.js:5191-5193` has its separate generated snapshot. JSON serialization
alone is not evidence that any new attachment survives those real routes.

## G48-B7.C7 Later consistency gates, all OPEN

| Code | Required proof |
|---|---|
| AC1 Fixed inputs | Parent-first and child-first demand orders yield the same compatible joint assignment; unrelated body demand leaves personality/name RNG unchanged |
| AC2 Time and relations | Child before/after parent burn, seal, purification, graft and training uses the appropriate event snapshot; twins share only intended template; adoption/ritual kinship does not invent biological descent |
| AC3 Truth/knowledge | Two observers receive conflicting reports without truth changing; hidden function can work unnamed; no-contact observer stays unchanged; blood/genome test scope does not leak other loci or parent secrets |
| AC4 Migration/failure | Actual full-envelope legacy household, P4 and simulation fixtures retain exact old state through reload/import; idempotent preparation, unsupported revisions, cyclic references and write failure leave prior bytes safe |
| AC5 Retention/scale | Backgrounding, source update, branch fork, body swap and compaction retain pinned values and conception/ancestry references; measure both save encodings and actual consumer performance at all three population sizes |
