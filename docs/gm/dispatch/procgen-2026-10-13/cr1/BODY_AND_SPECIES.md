# CR1 body and species response

Status: PROPOSAL ONLY, 2026-10-14. Original mechanics/data shapes are INFERRED, not accepted direction or implemented bodies. Extends root CO4-CO7/CO10 and XD2-XD4. [Genetics G1/G4/G6/G11-G12 and SB1-SB6](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md), [nonhuman mechanics NM1-NM3/NM11-NM12 and E1-E15](../../../../worlds/NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md), [hunger direction](../../../../HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md) and [companion A/N/V/AH/AK](../../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) remain the owning proposals/authority references. CR1 does not enroll their entire engines.

## XD3.c The receiving body is a causal interface

CO4.i: Separate the person/controller, receiving body, constitution, installed faculties, lineage and learned coordination. A potion administered to a companion reaches its body, not the player simply because a bond exists. A soul-targeting item can reach a person/source only through a supported carrier or interface. A constitution need not be genetic; a genetic sample need not install a faculty; installed anatomy need not be inherited.

SHOWN (source): P2 applies its one stat payload to the main character without a body-response argument. src/mixture_native.js:5-19 stages inventory/money/clock and a product dose; src/mixture_state.js:92-95 builds direct health/stamina/agility effects; src/main.js:4675-4679 publishes to native main-character active_effects. These locators use the [read-only P2 snapshot](REPORT.md#p2-source-audit). Per-body response is new work.

Proposed semantic shape, not a live interface:

~~~text
BodyResponseProfile {
  bodyRef, bodyRevision, worldLawRef, templateRef, lifeStageRef,
  functions: [intake, digestion, respiration, contactSurface,
              sensoryChannel, circulation, energyInterface, dreamInterface],
  compartments: [{id, admittedActives, distributionLaw, clearanceLaw}],
  responseRules: [{
    activeSelector, routeSelector, requiredFunctions, targetLayer,
    applicability: supported | inapplicable | unresolved,
    availabilityLaw, benefitCurveOverride?, adverseCurveOverride?,
    toleranceFamilyRef?, burdenFamilyRef?, exceptionRefs?
  }],
  constitutionRefs, installedFacultyRefs, localIndividualOverrides,
  dietOrFuelRefs, gainTargetRefs, transitionRetentionLawRefs,
  observationPolicyRef, revision
}
ResolvedResponse {
  bodyRef, bodyRevision, lawRefs, matchedRuleRefs,
  receivingCompartmentRefs, transferredActive, effectiveDose,
  benefitConsumerPayload, adverseConsumerPayload,
  toleranceDelta, burdenDelta, integrationJobRef?,
  rejectionOrWasteRefs, observationScope
}
~~~

CO4.j: Query relevant facts from the body/constitution/actor owners. Do not build a CR1 duplicate body registry. Original first slices can bind a minimal supported human body reference; nonhuman slices require their selected actual body interface. If the body owner has not implemented a trait, a species name does not grant it.

Matching order is declared by each world: exact exceptional faculty/source rule, applicable personal/constitution rule, template/life-stage route rule and selected original default are one possible precedence chain. Declare additive versus overriding terms and reject contradictory equal-priority rules before spending. Do not silently privilege species over a sourced individual exception. Inapplicable receiving tissue differs from unknown-to-player response and unresolved required simulation data.

Mass/volume scaling applies only when the law reads it. A small body need not get proportionally stronger magic or automatically poison itself. Young, mature and old stages can have different delivery, clearance or faculty eligibility; no age penalty is invented merely for balance. All new curves are fictional and source-qualified.

## CO1.f through CO10.c: response fixtures

These are ORIGINAL candidate body profiles, not claims about every member of a real species or franchise. They supply narrow consumers above the [kind profiles](CONSUMABLE_KINDS.md). Budgets and time use [dose law](DOSE_AND_TOLERANCE.md). Strong exemptions can be strong, without obligatory offsetting flaws.

| Fixture / applicable codes | Supported route and actual response | Budget / family behavior | Useful first observation/control |
|---|---|---|---|
| B1 ordinary human fixture, CO1/3/4/6/10, XD2 | Oral tonic reaches a declared recovery compartment after onset; topical salve reaches only supported skin treatment; inhaled active needs respiration. Food and perfume read separate interfaces | Optional shared stimulant tolerance, separate irritant load and gain-family history. This does not turn on existing hunger | Recovery changes after paid tonic; a diluted serving delivers its accounted active; unfed ordinary work remains comfortable |
| B2 original beast companion, CO7/XD4 | Compatible feed supports an existing recovery/task; individual scent preference controls lure approach. Human tea may be inert or adverse under an explicitly authored rule | Body-local nutrient benefit and tonic load; behavior habituation separate from nutrition. No mandatory absence starvation | Beast voluntarily takes eligible feed and works differently; refusing an unsuitable feed spends no nonexistent ingestion dose |
| B3 amorphous absorber, CO1/4/5/7/10 | Engulf/contact intake differs from swallowing; a supported isolation reservoir can retain active outside susceptible body until release. No lungs exempts inhalation uptake, not all contact effects | Absorbed load starts only upon actual release/coupling; isolation has its own custody and capacity law. Nourishment-free law has no hunger budget | Engulfed stock is saved in one place; delayed release works; no human drinking animation or invented sleep need |
| B4 planted/rooted body, CO1/5/7 | Root bath/leaf contact/source absorption admitted by actual interface; beneficial amendment reads compatible active, not universal oral-potion healing | Site/substrate reservoir and body exposure separate. Photosynthetic/no-food profile keeps its exemption | Amount leaves bottle and enters substrate; only contacted root body benefits; another rooted actor has no automatic dose |
| B5 mechanical constructed body, CO1/2/7/8 | Fuel charge or maintenance fluid reaches installed interfaces; biological sedative can be inapplicable, corrosive surface active can still work if authored | Charge and material integrity budgets distinct; no biological tolerance by default | Compatible fuel powers an actual task; no ordinary food refill or biological venom effect inferred from item category |
| B6 spirit/undead-source fixture, CO3/6/7/8/10 | Ritual offering, anchor infusion or source-local charge can work; oral ingestion requires real receiving interface. Soul-targeted charm requires matching source/channel | Anchor/source burden optional, not a renamed liver. Physical body and source exposure remain separate | One paid offering changes a supported source function; a spent carrier cannot remain full in inventory |
| B7 mosaic/transformed body, CO5/XD3 | Different tissues can have different uptake; transformation updates affected functions, leaving other installed traits intact when law permits | Original-body reservoirs and new-body response follow explicit retention; no automatic cleanse or tolerance reset | A new gripping/absorption function changes an actual job; retained old knowledge does not count as new motor mastery |
| B8 many bodies/shared host, CO4/6/10 | Poison attaches to contacted body; dream/mind substance targets only linked mind if the channel carries it. Shared energy may pool, biological load may not | Per-body burden with explicitly shared source/mind ledgers; bond/clone label does not merge all budgets | Dose one body, inspect actual affected consumer and independent body control; import retains target identity and no duplicated reservoirs |

Fixture names carry no sealed truth. An actual selected secret is referenced by ID/route/status only. These eight are a coverage palette, not a mandatory eight-body implementation or character-creation menu.

## XD2.d Medicinal meals without compulsory feeding

Reuse P6's cooking law for edible preparation/servings, then CR1's active-delivery response for medicine. A tonic soup has both an edible serving and medicinal actives. A pill baked into a bun keeps an exact pill/identity record unless cooking's declared law transforms it; division cannot clone a unique pill core. Homogeneous soup can split proportionally; discrete embedded pills require member allocation, not averaged composition.

Food benefit can be recovery, work preparation, hospitality or taste, with separate recipients. No hunger death, no eating requirement for ordinary progression, and no assumed constant feeding in enemy/economy balance. Preserve default-off optional fullness and its saved setting. Choose explicit nourishment or explicitly exclude new medicinal food from that subsystem before implementation, following [P6 COOKING](../p6/COOKING.md); never derive nutrition from longer drug duration.

Auto-feed/eat is an explicit stock/routine policy under [CR3](../CR3.md). It respects reserved rare ingredients, unknown trials and intentional underfed Famine progression. Nourishment-free bodies retain their exemption; optional compatible meals can still provide pleasure/preparation without inventing a hunger meter. Spoilage/adulteration remain separately enabled laws, not an implied penalty for abstaining.

## XD3.d Permanent elixirs, mutation and inheritance

Proposed target enum: somatic tissue, constitution process, current expression, lineage interface, germline/offspring rule, analyzed template archive, soul/source, temporary appearance. Every change specifies its actual recipient and supported consumer. A bloodline awakening elixir may express an already dormant faculty or install one via a paid sourced process. It need not rewrite ancestry, give a title, grant arbitrary descendants the change or award a realm.

Mutation receipt records prior/current body revisions, actual faculty delta, donor/sample/source provenance, gain family, local compatibility and reversibility. Persistent improvement retains marginal-gain history across temporary suppression and cosmetic transformation when its carrier survives. A new body/source is a real separate target only when the transition law says so, not a name-change route to repeated first-dose gains.

The transition owner coordinates gear fit, body-bound jobs, motor learning, control and observer recognition. Interrupted jobs pause/rebind/cancel by declared eligibility; no cloned equipment or refunded integrated medicine. Knowledge can survive losing a limb while that limb's technique becomes unavailable. An exceptional universal-acceptance constitution can waive rejection, without imposing an unrelated compensating flaw.

For breeding aids, separate parental condition, actual mating/conception/propagation event, offspring generation and trait expression. A fertility/recovery tonic does not create another child on reload or rewrite an already saved offspring. Germline change affects later inheritance only under its explicit law. Somatic versus hereditary versus archived-template transmission follows genetics G4/G29-G30; no generic dominant/recessive model is mandatory.

## XD4.c Feed, familiar tonics and agency

A companion is its existing actor/body with a bond, not a consumable-output slot. Received care may create a relationship receipt when the companion owner supports it. A scent lure affects detection and preference/approach, not guaranteed obedience or instant love. Repeated care can build history; repeated receipt replay cannot award history again.

Represent offering, detection, approach/refusal, actual ingestion, medicinal response and bond consequence as distinct transitions when relevant. A full person, beast, spirit, object companion or swarm follows its actual agency/control law. World-authored compulsion can exist with resistance, duration, memory and recognition consequences; no universal policy ban or automatic successful domination is invented.

Pet tonics target actual injuries/functions or a queued growth method. Evolved diet can unlock a compatible new intake route while preserving previous useful methods if supported. Supply can come from purchases, forage, cultivation, household care, ritual gifts, legitimate energy source or source-specific exceptions. All reasonable routes remain reachable; a feed-only evolution path is one local option, not a fixed choice across worlds.

Companion absence policy remains its owner's decision. Proposed early slices use played time and paused needs while the browser is closed. They do not import unexpected offline deaths, lost bonds or mandatory player check-ins. Comfort and loss dials from companion V3/AK stay separate from medicinal response.

## CO6.c and CO10.d body, mind and social truth

Perfume physically reaches an observer's sensory channel; detection is not attraction, attraction is not trust and trust is not a past deed. Tea may calm its drinker and modify a supported dialogue/practice consumer. A love/charm/truth/luck law needs a named target, actuator/source, contest if supported, duration and aftermath. Relationships, beliefs, conduct, memories and choices remain separately owned.

A truth-serum subject can sincerely report a false belief. A memory aid can increase retrieval without inventing memories. Dream access can reveal a world-authored scene through its allowed route without revealing sealed truth in a tooltip, report or export summary. Liquid luck can alter an eligible committed draw or action condition only when the local luck law says so; a temporary buff does not retroactively rewrite history.

Nonhuman mind/soul architecture matters: lack of olfaction can defeat perfume, a distributed mind may have per-node or shared effects, a spirit can respond through an anchor. These are explicit interfaces, not blanket mind immunity. Exemptions, strong effects and alternative counters remain world-local. [CR2](../CR2.md) owns canon/cheat exceptions; [CR4](../CR4.md) owns makers/social/economy consequences using actual received receipts.

## CO4.k Body changes during an active exposure

D1: Snapshot response at each actual delivery boundary. Preserve dose receipt and already resolved harm/gain. The selected law declares whether ongoing delivered benefit stays frozen, or later release re-queries current relevant body functions. Persist that policy. A transformation cannot reroll the old batch or erase its already received load.

D2: At a supported body transition, partition reservoirs by retained compartments/carriers. Transferred load has an explicit destination; shed tissue carries removed material; destroyed compartments have declared exits; a soul-bound exposure follows its source if the law says so. If no transition support exists, reject admission of that unsupported combination before spending, rather than silently drop the dose. Unknown-to-player but authored response still operates normally.

D3: Controller switching does not move physical poison automatically. Body swapping, avatars, host exit, shared familiar pain and shared mana have different carrier rules. A shared budget must have one owner/payer, not a duplicate ledger per view. Old body's recovery can continue only on an explicitly eligible clock.

## Evidence lens and limits

| Evidence code | Summary with inherited locator | Consequence / qualification |
|---|---|---|
| A1 | SHOWN via nonhuman TM1: Tensura WN T1 members2-4/7-9, early slime dissolution and body functions; STATED by Great Sage: sustaining source; SHOWN/STATED bonus-stage limits T4 member282 | Supports separate intake/senses/form/source. CR1 read the public owner summary, not the novel. No universal slime immunity or permanent no-sleep claim certified |
| A2 | STATED via TM2 / TC C01 member2: Predator stages; SHOWN consent case T1 member5; TM2/TG1 records earlier no-knowledge statement versus later fragments, TC C10 members41/49 | Isolation, assimilation, faculty and memory are distinct. Contradictions are era-specific; no guaranteed full-memory download |
| A3 | STATED (dated wiki) via nonhuman OS12, Tokyo Ghoul Ghoul493830/Rc493754/Kagune493958/One-eyed493951 | Food compatibility may differ. Exact primary dose/evolution law OPEN; the owner's hunger/sanity-meter proposal is expressly not adopted |
| A4 | SHOWN via nonhuman OS11 / Shadow Slave PS09 and PS13, ch105-110 and1582-1584 | Companion growth and shared-self source pools differ. No assumption that every familiar shares poison or one mind |
| A5 | P6 K12 qualified cultivation mirror members0158/0209; genetics SB1-SB6 are design proposals | Stage/source and substance interactions are useful leads. Generic pill toxicity is a trope proposal, not a certified every-world biological law |

No private source prose was copied or quoted. No full novel was read anew, no source library modified and no real species medical parameters asserted. [REPORT](REPORT.md) records all source/native/persistence gates as open.
