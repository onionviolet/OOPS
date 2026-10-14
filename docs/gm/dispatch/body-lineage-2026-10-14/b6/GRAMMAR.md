# B6 grammar: generated bodies with actual means

Status: PROPOSAL, 2026-10-14. Docs only. Extends G47 without changing G1-G51. Nothing here registers a world, body, source, handler or accepted rule.

Authority: [COMMON](../COMMON.md), [wave plan](../PLAN.md), [genetics G47](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md#g47-generated-physiques-and-bloodlines), [ability authoring](../../../../worlds/ABILITY_AUTHORING.md), [skills and talents](../../../../SKILLS_AND_TALENTS.md). Existing authored special bodies retain their identities. A name, surname, ancestry claim or rarity adjective grants no power.

## B6-G1: compositional record

`Card = mechanism + expression trigger + function bundle + cost (including none) + discovery + transmission + world-qualified name`.

The kind is `physique`, `constitution` or `bloodline`, an authoring distinction mapped to an existing source kind only at implementation. G11 owns source versus enabled procedure. G6/G12 own bodily/cultivation function; BP1-BP9 are optional lineage functions, not a mandatory extra power. CN1 includes continuous operation as a local trigger option, not an obligation to be conditional. G26's BD1-BD9 describe entry, alteration and loss routes, not a complete inheritance algorithm: transmission must also name the carrier, recipient eligibility, development, and retained domains from G15/G30.

| Required part | Definition fields and invariant |
|---|---|
| Mechanism | `id/revision`, substrate/location, input, conversion/storage/output, required world-law IDs, acquisition cause, supported body/species. Flesh, field coupling, soul, pact and equipment remain distinct. |
| Trigger | Awakening predicate separately from operating predicate; event or sustained interval; actual clock/calendar/medium; interruption and resume policy. No independent wall clock. |
| Function | Registered handler ID/revision, action/target binding, inputs, ordered outputs, body/fuel/control prerequisites, units and bounds, compositional policy, positive and unavailable cases. |
| Cost | `none` or exact startup/sustained/settlement costs, real owner, refund/interruption terms. Acquisition cost and operating cost differ. No obligatory compensating curse. |
| Discovery | Visible cue, actual diagnostic/test action, observer, evidence produced and limits. Naming, knowing, awakening and operation are separate transitions. |
| Transmission | Biological template, body graft, clone/template, soul mark, pact designation, or none; source-qualified BD route if any; founder/donor consequences; what is taught instead of inherited. |
| Name | Culture/era/language/grammar revision, compatible tokens and saved resolved spelling. Private true label differs from an observer's diagnosis. |
| Context | World-instance/continuity/era/law revisions, authored place and body references, source qualification or original proposal label, cause ID and receipts. Reuse P11 context, not another inventory or clock. |

Development, combinations, observer reactions, loss/retention, a way past a local limit and one everyday tell are definition fields required by the life-sim gimmick checklist. They need not become seven meters. A faculty allows an attempt; learning controls execution; an aptitude changes learning only. A stronger variant may simply outperform another where its means support that.

## B6-G2: part tables by family

Rows are **original inferred proposals**, not facts about every member of a genre. Each selected world binds a subset and actual handlers. These are join tables, not independent dice: a mechanism lists eligible trigger/function/cost/discovery/transmission IDs. Unsupported required parts remove the entire tuple before a draw.

| Family / mechanism IDs | Eligible trigger parts | Function parts tied to actions | Cost parts | Discovery parts | Transmission parts |
|---|---|---|---|---|---|
| Cultivation C-M1 reservoir channels; C-M2 tempered tissue; C-M3 local-field sense; C-M4 ancestral organ; C-M5 covenant mark | C-T1 learned circulation; C-T2 load plus completed recovery; C-T3 contact with matching aura; C-T4 deliberate activation; C-T5 ancestral-site contact | C-F1 store/refine fuel for one refining job (G12); C-F2 grip/brace a real lift (G6); C-F3 inspect an array's current flow (G12); C-F4 use one blood-key seal (BP4); C-F5 a qualified transformation changes reach/tool fit (BP6) | C-K0 none; C-K1 stored qi; C-K2 ordinary exertion; C-K3 actual reagent. No global pill toxicity | C-D1 measured circulation test; C-D2 work/recovery comparison; C-D3 array test; C-D4 consenting seal trial | C-X1 birth template, expression separate (BD1 eligible); C-X2 acquired only, no germline promise; C-X3 pact-designated recipient (BD3/BD5 if world allows); C-X4 donor organ transfer with custody |
| Wizardry W-M1 embodied resonance; W-M2 inherited ritual interface; W-M3 body-bound inscription; W-M4 patron/familiar channel | W-T1 touch a compatible carrier; W-T2 deliberate trained focus; W-T3 authored local lunar window; W-T4 willing partner present | W-F1 hear an existing enchantment's vibration (G6); W-F2 support one learned ward operation (G13); W-F3 open an actual line-bound lock (BP4); W-F4 coordinate a real familiar task (BP5); W-F5 identify an ingredient cue, not its entire recipe | W-K0 none; W-K1 personal mana; W-K2 focus/time; W-K3 reagent paid by ritual owner | W-D1 controlled instrument comparison; W-D2 witnessed assay; W-D3 keeper-supervised lock test; W-D4 partner demonstration | W-X1 eligible family template; W-X2 nonhereditary inscription; W-X3 designated pact successor, no automatic descendant obligations; W-X4 none |
| Tech T-M1 sensory implant; T-M2 manufactured core; T-M3 somatic tissue edit; T-M4 qualified heritable engineered template | T-T1 powered/calibrated; T-T2 voluntary interface command; T-T3 sensor contact; T-T4 development under recorded programme | T-F1 vibration diagnostic on a repair; T-F2 fuel a real powered lift; T-F3 tolerate specified solvent during a workshop action; T-F4 authenticate an actual biometric lock (BP4 analogue, not mystical authority) | T-K0 none for passive structure; T-K1 charge; T-K2 coolant/cartridge; T-K3 repair/service | T-D1 calibrated scan; T-D2 functional load test; T-D3 lab assay | T-X1 device transfer leaves donor without it; T-X2 somatic only; T-X3 copied template requires actual fabrication; T-X4 qualified germline inheritance. No implant-to-child default |
| Superpower S-M1 altered organ; S-M2 field-coupled nervous system; S-M3 setting-specific external source; S-M4 lineage faculty only if sourced | S-T1 voluntary output; S-T2 actual threat/exposure; S-T3 contact; S-T4 sustained local-field presence | S-F1 shield a supported target at impact; S-F2 sense current heat for a search; S-F3 change surface adhesion for a climb; S-F4 transmit a defined nearby kin signal (BP1), not all memories | S-K0 none; S-K1 reserve; S-K2 strain with actual recovery; S-K3 source-specific price | S-D1 safe instrumented demonstration; S-D2 repeated evidence; S-D3 qualified specialist, no omniscient registry | S-X1 none; S-X2 body template only if world allows; S-X3 source-specific transfer; S-X4 latent descendant potential distinct from expressed faculty |
| Home frontier H-M1 ordinary balance/reach; H-M2 practiced hands; H-M3 ordinary senses; H-M4 family-associated anatomy | H-T1 standing/passive; H-T2 relevant terrain/work; H-T3 controlled sensory contact; H-T4 rested/usable tissue | H-F1 packing control; H-F2 lifting/carry support; H-F3 rope-knot inspection; H-F4 colour or sound comparison; H-F5 improved tool fit through tailoring. G6/PH functions, no qi or ancestor will | H-K0 none beyond base action; H-K1 base stamina/time only; H-K2 optional fitting/service | H-D1 actual work comparison; H-D2 craftsman's observed test; H-D3 measured ordinary sensory task | H-X1 no inheritance for learned calluses; H-X2 family template with varied expression; H-X3 teach procedure without transmitting body; H-X4 none. No supernatural BP hook in this overlay |

For BP1/2/3/5/7/8/9, admit separately authored compatible handlers, targets and causes: reachable signal; eligible pressure recipients; a finite stored ancestor record; willing bond; located condition; an actual trial issuer/reward; or a specific inhabiting will. Their BP label cannot generate missing ancestry, memories, rewards, authority or consent. They remain excluded from a selected slice whose handlers are absent.

## B6-G3: world-local rarity

Rarity is an adjective on a sampling frame, not a common power ladder. Store `{profileId, cohortId, regionId, eraId, adjective, tableRevision, weightBasis}`. A public rarity diagnosis also needs observer evidence. Strength, acquisition accessibility and prevalence are independent.

| Family | Default example | Dial / in-world reason and cost |
|---|---|---|
| Cultivation | `unusual among valley apprentices` | `widespread in a specialist school` or `singular lineage`; supplied qi/material access changes acquisition, not a universal curse. |
| Wizardry | `occasional among archive workers` | `familiar to a local family` or `unrecorded locally`; instruments, teaching and ritual access shape visibility. |
| Tech | `standard workshop fitting` | `prototype` or `mass-produced`; actual fabrication, parts and service set access. |
| Superpower | `uncommon in this district's awakened cohort` | source-qualified `common` or `unique`; an awakening sample is not the whole population. |
| Home | `unusual among local workers` | `ordinary in a trained crew`; learned prevalence changes with practice, not hereditary rank. |

Weights are explicit proposed playtest integers attached to an eligible cohort. Unknown canon prevalence stays unknown. Zero weight means excluded from that selection, unless a qualified world law establishes impossibility. Do not infer global odds from protagonists. No inherited social purity score, fixed lifetime roll quota or automatic hostility follows rarity.

## B6-G4: naming grammar

Reuse [P7 guidelines](../../procgen-2026-10-13/p7/GUIDELINES.md) for culture/era, NFC spelling, collision normalization and canon reservations, and [P11 identity](../../procgen-2026-10-13/p11/IDENTITY_AND_CULTURE.md) for labels versus titles. This is a card-label extension, not a replacement NPC-name generator. Each tuple supplies semantically allowed tokens. The following English translations are original styles, not claimed Chinese/Japanese linguistic rules.

| Family | Production | Compatible examples and rule |
|---|---|---|
| Cultivation | `[local epithet] [substrate] [Body/Veins/Line]` | `Hearth Furnace Body`, `River Listening Veins`; Furnace needs conversion/storage, Listening needs a sense. A clan name attaches only to a real line reference. |
| Wizardry | `[medium] [sense/interface] [Constitution/Line]` | `Copper Chime Constitution`, `Silver Threshold Line`; a threshold line needs a real keyed interface, not nobility. |
| Tech | `[maker/design code] [function] [assembly/template]` | `WK-4 Vibration Array`, `C12 Pressure Core`; maker/code resolve actual design provenance. Labels never invent manufacturers. |
| Superpower | `[perceived phenomenon] [working form]` | `Heat Trace`, `Grip Field`; registration aliases and personal names stay separate. No borrowed exclusive canon name. |
| Home | `[observable work/material] [bodily description]` | `Ropewise Fingers`, `Even Footing`; no heavenly/royal/ancestral-magic name for ordinary hands. |

Reserve exact authored bodies, exclusive source names, distinctive aliases and canon lineages in the qualified private pack. A deterministic bounded alternative name search cannot change mechanism or power. Exhaustion rejects new admission without partial draw publication. Identical descriptive labels may share a definition but never collapse distinct bodies. Save generated spelling; a later player nickname is an alias, not a reroll. Before diagnosis, display only actually observed features, with no true-name, hidden rarity, count, price or CSS leak.

## B6-G5: seeded assembly

Default: keyed acquisition draws in a root-registered P1 namespace, proposed `body.gen@<worldInstance>`, with subkeys for `tuple`, `parameter`, `label` and `transmission`. The exact integrated API remains unbound. E1 and P1 own RNG; B6 creates no parallel campaign RNG. Existing moving `state.rng` is not an immutable root.

1. Bind real cause/actor/body and P11 context, source/law revisions, available handler set and authored reservations. A body-detail slot is allocated once in the authoritative body owner. Reopening a panel cannot allocate a new ordinal.
2. Enumerate valid complete tuples from the join tables in stable ID order. Filter world laws and body/acquisition means before weighting. Optionally select family first using the sum of valid tuple weights, preserving declared overall odds. Do not repeatedly reroll incompatible independent parts.
3. Draw from that valid set. Draw each genuinely variable parameter from its own stable subkey and revalidate within prequalified bounds. Name from compatible token tables in a separate subkey. Freeze chosen IDs, values, spelling, context and receipts.
4. Atomically commit resolved card, cause, source/faculty bindings and any real inputs with stream receipt/state. Existing same-cause card returns unchanged. Empty valid pool gives the world's declared ordinary/no-special-card outcome without consuming an acquisition draw; never silently switches world or generates a generic magic substitute.
5. Discovery updates knowledge; training updates declared development; world crossing rechecks support. None regenerates intrinsic truth. A local ritual, engineering procedure or paid reroll may explicitly transform a body with its own new cause and retention contract. Reload, Import, preview and repeated diagnosis cannot do that.

Repeated jobs and multiple cards are possible where a world supports them. Preventing duplicate settlement of one cause is idempotence, not a lifetime anti-abuse limit. Multi-card composition uses the action's declared `max`, `sum`, independent or fusion rule; same-source acquisition must not be silently discarded by the existing source-ID guard.

## B6-G6: reproducible documentation fixture

[SAMPLES](SAMPLES.md) contains 20 **reference-generated fixture cards**, not runtime outcomes. Three synthetic world manifests expose only their listed valid tuples (7 cultivation, 7 wizardry, 6 home). A QA coverage deck samples without replacement to show every tuple once; ordinary bodies do not inherit that deck's distribution or uniqueness rule.

Fixture algorithm `b6-doc-fnv1-v1`: root `20261014`. For world `C`, `W` or `H`, slot `0..N-1`, compute FNV-1a over UTF-8 `20261014|b6.sample|<world>|<slot>|tuple|1`, offset `2166136261`, per byte `h=((h XOR byte)*16777619) mod 2^32`. Set `u=h/4294967296`. Choose `floor(u*Nremaining)` in ascending tuple-ID order and remove it from the QA deck. This is equal weighting over remaining tuples. `...|label|1` selects `floor(u*2)` of that tuple's two semantically valid labels. Save the integer hashes, selected tuple and spelling. ASCII keys avoid encoding ambiguity in these fixtures. This algorithm demonstrates reproducible spec examples only; it does not override P1's mixer or register a runtime namespace.

The full fixture tuple definitions and permitted labels are the rows of SAMPLES, indexed by their tuple ID. An implementer can reconstruct the coverage deck by sorting those rows by tuple ID. Changing fixture algorithm/table revision creates a new fixture run, never a different existing saved body.

## B6-G7: transmission selection is its own cause

Default: an inherited card draws from an explicitly bound local transmission table, not the unrelated random-adult pool. Freeze real parent/donor card revisions, actual transmissible carrier state and destination birth/installation law. Each rule row names eligible contributors, inherited part IDs, expression/development conditions, weight and what stays with the contributor. Stable rule-ID ordering and a keyed `transmission` decision choose an eligible template; a separate keyed `expression` decision is used only if the local model genuinely has uncertain expression. Save both resolved potential and the rule's expressed/dormant state. Names describe that selected mechanism, never change its inheritance probability.

An original two-parent model may offer template A, template B, an ordinary/no-special-template result and a specifically authored compatible hybrid, with explicit proposed local weights. Do not normalize only the desired special outcomes and lose the ordinary possibility. Recessive carry, multiple contributors, place-marked birth (BD4), throwback (BD1), purification/dilution (BD9) and concentration changes (BD7/BD8) need distinct world-authored rows, not one generic percentage called purity. Unknown parentage can be real hidden state; the UI cannot infer it from generation weights. Acquisition by a ritual or organ transfer uses its actual BD3/BD5/BD6 rule and donor/issuer transaction, rather than pretending it was birth inheritance.

Dial: deterministic copying, broader polygenic variation, shared ancestral templates, soul-carried or designated succession where a world supports them. In-world reason/cost: a donor organ moves rather than duplicates; a lab template needs actual fabrication; a pact requires the real issuer/terms; biological descent carries supported potential but does not charge a mandatory fee. No transferable carrier means transmission `none` while teaching, archives, wealth and adopted succession can still continue through their own owners. A body-sex/reproductive-role prerequisite uses the actual species/body reproduction contract, not a gender-identity or presentation filter.

All inheritance/transfer rows retain potential separately from expressed faculty, stored fuel, practiced control, learned procedures, evidence, office and property. B3 selects cross-life retention; B6 does not turn a name, acquired somatic change or source `origin: inherited` into a claim of actual kinship. A new offspring/donor cause may draw a new supported outcome. Reloading the same saved child, ritual or transplant cannot.
