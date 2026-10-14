# C15: crafting and research around companions

## CHECKPOINT

2026-10-14. COMPLETE, documentation-only considerations. Sole owned files:
`CRAFTING_AND_RESEARCH.md` and `C15_REPORT.md`. All six requested domains are
covered below. Resume through the evidence table and report's open choices.
No runtime, bundle, test, save, private pack, commit or push changes. No build
or browser proof claimed. Source locators are this concurrently edited tree's
snapshot, not proof of packaged or accepted gameplay.

Authority: [COMMON](COMMON.md), [PROJECT](../../../../PROJECT.md),
[USER_VISION](../../../USER_VISION.md), the
[root palette](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md),
[crafting palette](../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md)
and [five-record audit](../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md).
This extends B9, D4, W2, BB1-BB7, AI1-AI3, R108, R110 and CF1-CF3;
it selects no implementation queue. First milestone remains one realm and one
prestige layer. Canon-first order stays intact. Original examples below are
illustrations, not a new world priority or verified franchise rules.

Evidence labels: **SHOWN** = inspected local text/source with locator;
**STATED** = attributed external claim with URL or inherited report;
**INFERRED** = this lane's proposal; **MEMORY** = unchecked recall. No MEMORY
claims are needed. No file named `SECRETS*`, novel or player save was opened.
Playing AS a made or biological companion stays with the
[nonhuman engine owner](../../../worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md)
and [body authoring](../../../worlds/NONHUMAN_BODY_AUTHORING_2026-10-14.md).
Individual/species generation stays with [PROCGEN](PROCGEN.md); runtime fit
stays with [ENGINE_FIT](ENGINE_FIT.md). This file adds crafting/research joins.

## F. What the source supports, and what it does not prove

| Code | Evidence, file:line | Implication |
|---|---|---|
| F1 | SHOWN: `src/crafting_recipes.js:45-77,109-145,163-188` accepts result hooks and makes component results; `:314-338` selects exact IDs or material types and sorts variants by price | Parts/recipes are reuse points. Exact source-sensitive batches need deliberate selection; cheapest variant is not necessarily the intended donor provenance. |
| F2 | SHOWN: `src/crafting_recipes.js:1634-1662,1892-1958` declares cooked food, powders, potion and balm with authored materials/results | Food and medicine chains exist. These declarations do not establish arbitrary species nutrition or veterinary response. |
| F3 | SHOWN: `src/mixture_state.js:15-44,65-98` retains fixed ingredient profiles, products, observations, learned methods, canonical references and exposures; `src/items.js:1221-1225` reconstructs mixture items; `src/main.js:4695-4718,5195,5341` stages use and saves/restores the owner | Village mixing source is present now. Its fixed `oral-village@1` consumer is a narrow working-tree seam, not generic companion dosing. No native proof was rerun. |
| F4 | SHOWN: `src/mixture_native.js:5-10,37-43` clones/stages state and writes a validated full envelope before publication; `src/main.js:4160-4174` explicitly lists native craft rollback owners; `src/native_craft_transaction.js:4-35` captures supplied owners only | New actor/body/consent/research owners need enlistment or coordinated staging. Neither publisher automatically captures every new subsystem. |
| F5 | SHOWN: `src/management/workshop_aid.js:14-28` declares shared-bench capacity, different log/time costs, real output and finite paid delivery; `src/field_workshop.js:36-48` declares sites and membership routes | Housing/station work can reuse sites, jobs and custody. A label saying stable or forge is not a habitat or thermal consumer. |
| F6 | SHOWN: `src/nethack_fieldcraft_content.js:40-55,79-112` defines Rill's persistent body, suitable ration, lessons, live-scent retrieval and willingness handoff | Existing bounded animal labor spends actual care/effort and checks support at completion. Feeding explicitly earns no loyalty; Rill remains Eda's local dog. Do not silently turn him into an adoptable traveling pet. |
| F7 | SHOWN: `src/simulation_effects.js:200-209` spawns actor/person/stock/controller records; `src/simulation_contracts.js:232-249` checks actor joins, supported definitions, life, stock, equipment, custody and knowledge | A made companion can use an actor spine. Generated definitions still need retained admission and validation; a new item key does not spawn a valid autonomous actor. `createdBy` records maker provenance, not consent or ownership law. |
| F8 | SHOWN: `src/simulation_contracts.js:60,66,249` permits scalar body effects and knowledge with `seen/interpreted/understood`, string value, time and cause; `src/simulation_effects.js:281-284` retains equal/higher-stage replacement | Research has observer-owned records, but no general confidence, specimen population or revision history here. Same-key replacement cannot retain both competing reports; lower-stage corrections cannot replace higher-stage claims. |
| F9 | SHOWN: `src/main.js:3714-3720` adds bestiary entries through qualifying kills; `src/display.js:5274-5281,5312-5339` builds them from enemy templates, including description/tags/stats | Current bestiary is a combat catalogue, not nonlethal field science. Avoid routing a glimpse through a full-template tooltip that exposes unobserved facts. |
| F10 | SHOWN: `src/world_completion_learning_runtime.js:12-22,36-69,80-94` binds paid sample/measurement/teacher causes, then stamps output and actor knowledge through common completion | Useful precedent for learned procedure and independent learner production. This specific datum chain does not prove general bestiary, breeding or research simulation. |
| F11 | SHOWN: `src/book_world_mol_actions.js:67-71,80` declares consumed-sample analysis, attributed limited findings, physical notebook and optional paper-backed research; `src/world_knowledge.js:1-13` filters undiscovered world identity | Source supports bounded research and unknown identity views. Reuse attribution and limited conclusions; no universal technology unlock follows from one study action. |
| F12 | STATED: the 10-13 audit and 10-14 crafting palette describe earlier generated-product gaps and P2 as unmerged; SHOWN: F3 now finds mixture source and native integration in this checkout | Preserve both as dated evidence. C15 establishes source presence only, not merge history, current tests, served bytes or broad closure of those earlier gaps. |

Required vocabulary was searched in public `src`: craft, recipe, workshop,
research, knowledge and bestiary. Focused reads followed the owners above.
The [materials synthesis](../../../research/procedural-materials-2026-10-13/REPORT.md)
and [deep synthesis](../../../research/procedural-materials-2026-10-13/deep/REPORT.md)
distinguish composition, assembly, pattern and exact identity. Their test counts
are STATED historical slices and are not C15 results.

## K. Five records, with a companion join

All rows from here through the acceptance menu are **INFERRED considerations**
unless explicitly labeled otherwise. Reuse the contract, without making an
animal a material stack or every object a chemical mixture.

| Code / record | Companion-specific meaning |
|---|---|
| K1 Material definition | Versioned physical or local magical truth: fiber, leather, wood, food fraction, metal, exact core or pattern carrier. Source species alone does not transfer its powers into every product. |
| K2 Owned batch | Actual quantity/unit, condition, contaminants and source/harvest provenance. A living participant is an actor reference, not a count deducted as reagent unless the world explicitly models that harmful transformation. |
| K3 Process | Ordered preparation and fitting, site/tool/energy access, maker skill, actor participants, time and reservations. Work, harvest and activation each declare when consequences happen. |
| K4 Product | Complete resolved composition/assembly/pattern/identity, function, revisions and provenance. Output may be portable stock, installed habitat, body attachment or a creation receipt linked to an actor. |
| K5 Knowledge | Observer's scoped observation, source, method and confidence; teaching/discovery change beliefs and prediction. They do not reroll the product, animal or hidden evolution law. |

For a living output, K4 links the saved actor created by the paid process.
The product records how it was made; the actor/body records what it now is and
does. Repairs and experience update those live owners. Updating the maker's
recipe does not rebuild an existing mind. A dormant shell may be stock; an
active being has one durable identity and a declared lifecycle.

## FC. Crafting FOR companions

Each row spells out material → batch → process → product → knowledge and the
extra consumer/save work. Body fit, care and permission are distinct from item
grade. Tiny hats may be decorative without granting an invented stat.

| Code | Five-record fit | Default + Dial + Reasonably | Implementation and save impact |
|---|---|---|---|
| FC1 Gear | Material: protective or magical parts. Batch: exact leather/fiber/plate/core. Process: cut, join, fit, enchant where supported. Product: body-compatible gear with part roles. Knowledge: measured fit and observed protection. | Default: useful local collar, harness or barding. Dial: costume through artifact. Reasonably: stronger material can still fit badly; decorative gear stays valid. | Extend actual equipment fit/function readers, not player stat bonuses. Save gear identity/parts/condition and actor/body attachment; one equipped item cannot also be freely spent in stock. |
| FC2 Housing | Material: structure, bedding, vessel, ward substrate. Batch: actual construction stock. Process: build/install at a real site. Product: coop, stable, aviary, aquarium or shrine with supported functions. Knowledge: observed suitability and learned plans. | Default: a fitting shelter with selected rest/access benefit. Dial: open yard, portable habitat, pocket home or large sanctuary. Reasonably: door size, water/air and occupancy matter only to selected species/functions, with alternate boarding routes. | Join site capacity, tenure and body admission. Save installation/site/occupant refs, maintenance only if selected, and supported clock boundaries. Habitat inventory and the being inside are separate owners. |
| FC3 Toys and enrichment | Material: textures, edible carrier or harmless pattern. Batch: real cord/wood/treat. Process: shape and assemble. Product: chew toy, puzzle feeder, perch or play object. Knowledge: observed preferences and behavior. | Default: optional play/texture. Dial: comfort, training practice or self-directed puzzle work. Reasonably: preference is individual; an ignored toy is not failed care. | New play/training action reads actual object and companion response. Save relevant preference observations and use history; no mandatory daily chore or automatic affection from toy count. |
| FC4 Medicine | Material: fictional active fractions and carrier. Batch: exact dose, contaminants and condition. Process: extraction/preparation. Product: route-specific treatment and byproducts. Knowledge: observed response plus attribution and uncertainty. | Default: selected mild condition and veterinary help. Dial: salve, oral tonic, construct repair fluid or advanced regeneration by world law. Reasonably: species/body/route compatibility, benefit and side effect can coexist; unfamiliar does not equal inert. | Add actual target-body exposure consumer and veterinary condition readers. Save full product, administered quantity, response-law revision, onset/expiry and treatment result. Do not reuse native player effects as pet effects by changing a label. |
| FC5 Food | Material: dietary roles or declared magical fuel. Batch: actual portions and preparation state. Process: cook, dry or prepare. Product: suitable ration/treat with benefits. Knowledge: tested liking and separately learned suitability. | Default: optional useful care/work support, no hunger death. Dial: diet specialization, seasonal forage, mana/fuel or no intake. Reasonably: liking is not proof of nutritional or toxicological suitability. | Reuse Rill's bounded food/effort shape only where it fits. Save finite portion use, body resource change and any exposure. No retroactive starvation or invented wall-time consumption on old saves. |
| FC6 Tack | Material: straps, pad, rigid tree, buckles. Batch: exact fitted parts. Process: measure, cut, mount and refit. Product: saddle/bridle/pack harness with interfaces and load role. Knowledge: fitting notes and observed handling. | Default: a supported riding/carrying task. Dial: pack, riding, draft, species-specific or magical tack. Reasonably: rider skill, animal willingness and load remain separate; comfort and repairability may beat prestige. | Add mount/load/task reader; existing riding metadata alone proves no speed or carry capacity. Save paired body/gear/rider or cargo refs and condition. Growth can require a refit while retaining object provenance. |
| FC7 Prosthetics | Material: support part, attachment interface, optional channel/core. Batch: actual replacement stock. Process: custom fit/install/train use. Product: a leg, wing brace or sensory aid restoring a named function. Knowledge: observed fit/use and learned refitting. | Default: useful accommodation with retained identity. Dial: mundane support through magical augmentation. Reasonably: attachment is not a cure for every injury; a companion can prefer another accommodation or refuse invasive work. | Shared body/function owner handles installation and restored capability. Save removed/installed parts, body revision, consent basis, adaptation and repair history. Do not spawn a new animal to represent repaired function. |

Housing, tack and prosthetics use assembly/interface truth; foods and medicine
often use composition plus body response; an artifact may also need exact
identity and a pattern. No single weighted material score can replace them.

## MC. Crafting companions, and CF making minds

These names are design families, not assertions that a named franchise permits
the proposed process. Select source/world/edition before direct adaptation.

| Code | Five-record path and actor distinction | Default + Dial + Reasonably | Implementation/save consequence |
|---|---|---|---|
| MC1 Golem | Material/owned batch: clay, stone, metal or exact core. Process: form body, inscribe control, activate. Product: assembly/pattern plus activation receipt and actor ref. Knowledge: maker's method and actual demonstrated functions. | Default: local task construct with declared mind. Dial: automaton through full person under O1. Reasonably: stone does not imply mindlessness and crafted origin does not imply loyalty. | Save shell/core/body/actor joins, fuel, controller, maker and activation cause. Repaired shell retains the person if local identity law says so. |
| MC2 Homunculus | Material/batch: biological or fictional alchemical substrate and required identity. Process: incubate/grow/awaken. Product: viable body and admitted individual, with waste and retained parent/source refs. Knowledge: observed development and care method. | Default: world-compatible created being. Dial: animal-like assistant through independent person. Reasonably: growth, awakening and social learning can be different boundaries. | Persistent incubation job and recipient habitat, then atomic actor admission. Save stage, inherited facts, birth/age policy and observed knowledge, not only an embryo item ID. |
| MC3 Shikigami | Material/batch: paper/carrier, ink, charge or exact binding token. Process: pattern/rite/contract. Product: carrier plus manifestation/actor link. Knowledge: learned rite, known terms and observed powers. | Default: finite task manifestation with stated mind/return rule. Dial: summoned existing being, created spirit, disposable projection or enduring partner by world. Reasonably: paper damage, dismissal and death are different where the law says so. | Save summoner/source/actor identity, duration/anchor and control terms. Re-summoning reuses identity if it is the same being; a new being receives a new identity. |
| MC4 Clockwork | Material/batch: gears, chassis, actuators, power cell and program carrier. Process: assembly/calibration/load control. Product: device body plus actor where autonomous behavior is selected. Knowledge: design/program and tested capability. | Default: constrained task machine. Dial: adaptive intelligence, awakened mind or remote drone. Reasonably: intelligence, autonomy, speech and moral personhood are separate axes. | Save installed parts, program/controller revision, power, memory and authority. Software update cannot silently wipe learned history; remote controller and embodied actor stay distinct. |
| MC5 Chimera | Material/batch: preserved parts or viable donor material with exact donor refs. Process: join/grow/transform under explicit law. Product: body architecture plus a declared identity outcome. Knowledge: actual observations, not an assumed inheritance of every donor power. | Default: coherent original body with explicit identity law. Dial: graft on existing actor, new offspring-like being, merged minds or hostile experiment by world/tone. Reasonably: supported functional compatibility and donor/subject consequences matter. | Save donor lineage, original actors' disposition, transferred parts, body topology and consent/coercion events. A transformation need not mint a second copy of the same person. |
| MC6 Simulacrum | Material/batch: local carrier and source-bound sample/pattern if required. Process: copy representation then instantiate under selected law. Product: new actor or projection with source link and explicit memory boundary. Knowledge: copying method and observed limitations. | Default: distinguish source from copy. Dial: scripted likeness, partial mind, full independent person or shared-self projection. Reasonably: same appearance does not grant source inventory, unseen memories, contracts or current permissions. | Save unique copy/body IDs, source snapshot, memory scope, shared versus independent resources and ending policy. Do not alias mutable inventories or reroll the copy after reload. |

### MA. What K4 must carry or reference to deliver an actor

Illustrative conceptual envelope, not selected schema or current API:

```text
MadeCompanionProduct
  productId, productRevision, worldLawRef, resolvedBodyOrAssemblyRef
  materialBatchRefs, processReceiptRef, makerRef, createdAt
  retainedPatternRefs, exactIdentityRefs, byproductRefs
  actorAdmission {actorRef, bodyRef, identityOutcome, activationCauseRef}
  mindPolicyRef, sourcePersonRefs, memoryBoundaryRef
  authorityAndConsentRef, custodyAndCareRef, lifecyclePolicyRef
  generationReceiptRef, retainedDefinitionRefs
```

The referenced actor owns current goals, controller, resources, knowledge and
history; its body owns current functions and condition. Equivalent clay bodies
can share a template, but two living golems do not stack into one identity.

| Code | O1 / CF consideration | Default + Dial + Reasonably |
|---|---|---|
| MA1 Mind and discovery | Default: species/world-defined O1 class, separate from obedience/intelligence. Dial: animal, clever animal, near-person or full person; local evolution may change it. Reasonably: private mind truth is observer-filtered; a maker's assertion is not proof. |
| MA2 Before and after creation | Default: maker chooses a design, then the created being has the agency its law gives it. Dial: binding commands, emergent preferences, negotiated work or independent life. Reasonably: a being unable to consent before it exists is not recorded as having consented to its creation. |
| MA3 Designed loyalty | Default: distinguish designed disposition from current willing agreement. Dial: socially normal, contested, illegal or tragic as CF2 suggests. Reasonably: law, social reaction, coercion and welfare are distinct facts; no universal ban or universal loyalty reward. |
| MA4 Modification/work consent | Default: task/purpose/duration, current acceptance and withdrawal where communication allows. Dial: behavior-based assent and caregiver duty for animals; explicit agreement for persons; authored compulsion where selected. Reasonably: title, maker status and contract do not automatically grant bodily control. Recheck support at actual irreversible boundaries. |
| MA5 A companion becomes a maker | Default: CF3 is a possible ambition. Dial: taught apprentice, co-maker, parent or institution founder. Reasonably: it uses its own acquired method, supplies and authority. Its product has its own identity and obligations, rather than becoming an automatic player-owned copy. |

Activation proposal: validate retained definition/body/identity and actor refs →
bind real materials/participants/site → reserve work → commit transformation,
byproducts, actor admission and creation cause together. At completion, publish
one actor and mark the shell's disposition. Failed storage cannot consume a core
while leaving no being, or spawn a being while retaining a reusable activation
token. Cancellation before activation follows reserved-input policy; after an
actual irreversible step it retains that changed state, not an impossible refund.
Recovery of parts, resurrection, reactivation and replacement are local laws.

## IC. Companions IN crafting and gathering

[Living materials](../../../research/procedural-materials-2026-10-13/deep/LIVING_AND_ECOLOGICAL.md)
L12-L18 separates producer, harvest and prepared stock. W2 and BB2/BB3 reuse
that distinction. BB1 gathering can supply batches, BB4 evidence can supply
research leads, BB5 performance can fund commissions, and BB7 guarding can
support access where an authored reader exists. Those roles are optional joins,
not automatic crafting yield multipliers.

| Code | Role in five-record contract | Nonharmful / harmful possibilities and dial | Implementation/save consequence |
|---|---|---|---|
| IC1 Silk | Species/material definition; harvested thread batch; collect/spin/weave process; textile product; observed strength/handling knowledge | Default: declared recoverable surplus from a living producer. Dial: collected web, managed secretion, traded silk or cocoon extraction. Reasonably: taking a cocoon or destroying shelter is not assumed harmless; label actual selected method. | Save producer/source, method/time/quantity, retained shelter consequences and output batch. Renewable output needs supplied actor/site/time; passive silk stock does not reproduce. |
| IC2 Venom | Definition contains fictional route responses; batch is measured secretion; process collects/preserves/prepares; product is reagent/coating/antidote precursor; knowledge records assay scope | Default: trained voluntary collection if the species/law supports it, or trade. Dial: coercive extraction, injured donor or killed gland. Reasonably: nonlethal collection can still cause distress or depletion; one assay cannot certify all routes. | Actor reserve/recovery and body consequences join batch publication. Save donor condition, finite output and collection receipt. No real extraction instructions or treatment formula are proposed. |
| IC3 Shed scales/feathers | Definition and original donor; naturally shed batch; clean/sort/process; armor/pattern carrier; observed fit/affinity | Default: already shed material. Dial: plucked, cut, molt-assisted or postmortem harvest. Reasonably: already detached may differ from living tissue in a local magical law; scars and distress are method consequences, not a universal penalty. | Save detached versus removed state, provenance, quantity and any injury. Two collections cannot claim the same shed object; actual renewal is separate from its processing. |
| IC4 Fire breath forge | Companion is participant/energy source; metal is input batch; process receives declared heat/time/control; forged product retains process provenance; knowledge records tested temperature range | Default: agreed controlled work with finite effort and a fitting station. Dial: precision flame, burst heat or authored coerced labor. Reasonably: breath is not a consumed pet item or infinite free furnace; flame color alone proves no temperature. | Reserve actor attention/energy and station capacity, recheck willingness/functions. Save supplied energy, process boundary, material state and interrupted outcome. Existing site jobs need a new thermal reader to produce a genuine forging difference. |
| IC5 Pollination | Plant/site and pollinator are separate producers; pollen may be stock only if modeled; process is visitation under compatibility law; product is later seed/fruit batch; knowledge is observed visits and outcomes | Default: compatible managed habitat with observed work. Dial: wild visitation, hired keeper, companion swarm or spirit aid. Reasonably: a visit is not proof of fertilization or a guaranteed harvest; no global crop bonus from owning a bee. | Join plot growth/lineage/clock owner, finite pollen or service availability as selected, and harvest receipt. Save crossed parent refs/outcome at the relevant boundary; reload cannot resample offspring. |

### PR. Provenance and ethics as consequences

| Code | Proposed fact | What it changes |
|---|---|---|
| PR1 | Producer/specimen or anonymous source lot; species/lineage/local law; method, game-time/place and harvester | Recipe source compatibility, traceability and attribution. Bulk wool need not name every sheep; a singular core or important companion does. |
| PR2 | Detached, nonlethal, stressful, injuring or lethal collection with actual dose/quantity and body effects | Distinguishes harm from survival. Harm can affect health, avoidance, future cooperation or care where consumers exist. No unrelated danger roll because the player lacked knowledge. |
| PR3 | Subject agreement/behavioral assent, caregiver terms, custody and withdrawal, separately from legal status | Determines selected work admission and consequences. Sapient agreement cannot be inferred from ownership; ordinary animals need species-appropriate signals and duties rather than a fake signed contract. |
| PR4 | Witnessed act, report, belief and local law/cultural norm | Guild certification, buyer preferences, dispute or community reaction only when known through a route. Hidden harm does not grant omniscient NPC condemnation. A world's legal approval does not prove absence of harm. |
| PR5 | Product processing history retains categorical provenance where relevant | Purifying a fraction does not erase a donor's injury or make an origin certificate true. Mixing can retain sublot origins; trading stock transfers custody, not historical authorship. |

Default tone favors care and useful choices. Dial may include grim exploitation
and its real reactions, or low-stakes collection without routine upkeep.
Reasonably: humane alternatives can cost time, apparatus or lower immediate
yield when the law supports that tradeoff; harm is not mandatory to obtain every
advanced material and harmless collection is not a guarantee of optimal yield.
Present actions through known observations, with a separate truth resolver.

## IR. Research in play

Research is an actor's paid, scoped activity. Discovery, ability to apply,
individual trust and permission are separate owners, as R108 requires.
The [technology owner](../../../TECHNOLOGY_AND_PROGRESSION.md) TL/TG/TK,
RV/RQ/RU/RB/RP/RE supplies the wider menu; the
[gathering owner](../../../GATHERING_AND_RESOURCE_USES.md) supplies sample and
method acquisition. No universal research bar is selected here.

| Code | Question, discovery and teaching | Default + Dial + Reasonably | Implementation/save consequence |
|---|---|---|---|
| IR1 Bestiary study | Observe tracks, diet, signals, habitat, voluntary behavior or a specimen; compare reports. Teach a named observation/method, not every species statistic. | Default: nonlethal observation is a complete route. Dial: field guide, dissection, magical appraisal or negotiated interviews with persons. Reasonably: combat may reveal injury/defense evidence, but a kill count does not establish domestication suitability. | Add knowledge-scoped bestiary projection and specimen/event causes; retain existing kill counts. Save observer entries, source/time/place and sample custody. Do not show unobserved template stats or sealed evolution truth. |
| IR2 Domestication/handling | Study housing, diet, social signals and training across individuals or generations. R108: guild method is transferable; this individual's trust is earned separately. | Default: one teachable handling method and one individual response. Dial: taming, husbandry, population-level domestication or magically accelerated adaptation. Reasonably: a tame wild individual is not a domesticated species; institutional doctrine can be mistaken. | Method/skill reader joins task admission while bond remains directed actor history. Save population/lineage scope only if generation-scale work is selected; no universal obedience flag or inherited trust on offspring. |
| IR3 Breeding research | Record parentage, observed traits, environment, attempts and offspring. Learn a scoped inheritance hypothesis; teach it with limits. | Default: species-compatible reproduction and observation. Dial: selective breeding, strain management, magical fusion or world-specific asexual construction. Reasonably: lineage, training and rearing are distinct; phenotype does not reveal complete genotype. | Join PROCGEN/world genetics, retained offspring draw and actual parent/body/site/time. Save pending stage, parent refs, resolved traits and observer notes. No averaging living animals as ingredient stacks or rerolling offspring on inspection. |
| IR4 Veterinary knowledge | Note symptoms, context, examination, treatment and recovery; compare alternative causes. Teacher can demonstrate a usable care protocol while uncertainty remains. | Default: one supported mild condition, expert help and observed outcome. Dial: clinical training, construct repair, cross-species medicine or a world's healing power. Reasonably: improvement after treatment is evidence, not proof of universal cure; real medical thresholds need separate research. | Add diagnosis belief versus true condition, target-body response and observation consumers. Save case/exposure/recovery boundaries and attribution. Do not attach human potion effects to every species. |
| IR5 Evolution field notes | R110: observed signs, source report and trial suggest a path before rare materials are spent. Study may reveal a requirement, incompatibility or uncertain branch. | Default: a known lead with an evidence route. Dial: hidden natural evolution, taught rite, controlled transformation or appraisal roadmap. Reasonably: seeing a possible path does not promise success, compel transformation or reveal all sealed branches. | Save world-law/path revision, observed prerequisites and trial causes separately from hidden resolved path. Commit material/body/identity changes atomically; no preview RNG advance. Future UI filters branch names and compare metadata too. |
| IR6 Teaching and research communities | Keeper demonstrates method; apprentice practices; companion teaches another actor; notes or manual carry findings. Schools can publish, license or hoard. | Default: willing bounded instruction with real attention and supplies. Dial: hands-on apprenticeship, copied guide, rumor, cross-world lecture or telepathy where granted. Reasonably: receipt of a text, understanding and competent application remain distinct. | Reuse F10/F11 attribution/completion patterns. Save learner-owned method/evidence and actual teacher/medium; teacher retains knowledge. Transfer does not copy private bonds or unlock tools, site rights or all source memories. |

### KR. A richer knowledge record without a second truth store

Candidate references: `observerRef, subjectRef, populationScopeRef?, claimKey,
estimateOrRange, stage, evidenceRefs, protocolRef, contextRef, sourceRef,
observedAt, confidenceLabel, supersedesRef?, contradictionRefs?`.
This is a proposal beyond F8's current string-value record, not an admitted schema.
Truth lives in material/body/species/world-law owners. A field note describes
what someone observed or inferred about those owners.

Default: observation → interpretation → reproducible method, with readable
scope and confidence. Dial: rumor, instrument measurement, repeated comparison,
mentor instruction or granted direct appraisal. Reasonably: retain competing
assertions under separate IDs with evidence links. A new negative finding can
correct a high-stage old claim without silently deleting its history; the current
same-key monotonic writer needs an explicit revision/correction adapter.

An idle research job reserves actual samples, attention, apparatus and observer
time. Repeat work stops at shortage, access loss, unsuitable subject, withdrawn
support or a decision that cannot be automated. Repeating an identical test
does not generate unlimited novel knowledge. A learned procedure can run on new
samples, resolving their actual truth rather than copying the first sample's
result. Closed-browser advancement depends on the selected branch clock and
funding policy; C15 does not add an offline scheduler or treat wall time as proof.
Prestige knowledge needs a carrier and retained scope; surviving companions keep
their own minds unless the world's chosen reset policy says otherwise.

## RW. Real-world research, checked 2026-10-14

Each source claim is **STATED**, from the bounded page/sections indicated.
Game uses are **INFERRED**. These are mechanism references, not numerical care
guides, historical universals or automatically true laws in a magical world.

| Code | Source and bounded finding | Useful game translation / limit |
|---|---|---|
| RW1 | Melinda A. Zeder, 2015, [Core questions in domestication research](https://pmc.ncbi.nlm.nih.gov/articles/PMC4371924/), abstract, definition and markers sections. Distinguishes domestication from management and argues for multiple biological/contextual markers; definitions remain debated. | Differentiate individual handling, managed population and inherited change. Research combines observations rather than toggling species domestication after one successful feed. This is an attributed framework, not the sole scientific definition. |
| RW2 | FAO-hosted [Building on Gender, Agrobiodiversity and Local Knowledge](https://www.fao.org/4/y5956e/Y5956E08.htm), Nitya Ghotge and Sagari Ramdas contribution, “Livestock Livelihood Systems,” “Pastoral Systems” and “Crop-based Livestock Rearing Systems.” Describes context-specific herding and crop residues feeding animals, with animal work and manure feeding crop production. | Regional husbandry schools, seasonal routes, multifunctional animals and actual byproduct chains. Use the historical system shape, not dated statistics or blanket species claims elsewhere on the page. Each loop still needs a consumer and finite inputs. |
| RW3 | UNESCO, [Falconry, a living human heritage](https://ich.unesco.org/en/RL/falconry-a-living-human-heritage-01708?RL=01708), nomination 01708 description. Describes training/flying birds of prey, transmission through families, mentors and clubs, and a wider network of care, conservation and equipment makers. | Falconer apprentice, crafted glove/perch/hood roles, learned cues, veterinary contacts and habitat stewardship. Cultural teaching is separate from one bird's bond. No species-specific training regimen or numerical welfare rule is supplied here. |
| RW4 | Bayarsaikhan et al., published online 2023, [The origins of saddles and riding technology in East Asia](https://www.cambridge.org/core/journals/antiquity/article/origins-of-saddles-and-riding-technology-in-east-asia-discoveries-from-the-mongolian-altai/95BA971FD64B2A7544D4BEF6694A8E14), abstract, discussion and conclusions. Reports early frame-saddle evidence from Mongolia and ties rigid frames to support for rider-weight stirrups. | Tack develops through interfaces and new supported activities, rather than a universal tier number. Date findings as regional archaeological evidence; do not declare a single certain inventor or all later warfare caused by stirrups. |
| RW5 | Metropolitan Museum, [Pair of Stirrups](https://www.metmuseum.org/art/collection/search/33613), object 14.25.1751a,b, ca. 1660-70, description and object details. A swivel eye kept leather flat but was more fragile than nonrotating systems. | A concrete fit/convenience versus durability choice for tack components. A rare or newer design can suit one task yet be worse for another; this object's claim does not generalize to every swivel mechanism. |

RW1 is scholarly synthesis, RW2 an institutional training contribution, RW3 an
official cultural description, RW4 primary archaeological research and RW5 a
museum object record. Research status and source type are explicit. No source
was treated as a source for fantasy evolution, sapient construct consent or a
real veterinary treatment. Those need their selected world law and additional
bounded evidence if implementation demands it.

## SI. Implementation menu and compatibility

These are proposals, not six required build gates. FC/MC/IC/IR tables give
per-case impact; the rows below summarize shared integration costs.

| Code | Selected family | Reuse / needed adapter | Save compatibility decision |
|---|---|---|---|
| SI1 For-companion goods | Recipe/parts/site/job owners; new body-fit, habitat, play, dietary or treatment consumer as selected | Old saves acquire no new goods, injury or obligation. Retain resolved gear/product and installed/body refs. Save exposure payloads and meaningful boundaries; unsupported versions need recoverable admission, not plain-item fallback. |
| SI2 Made actors | Shared actor/person/body/controller spine; activation and identity-law adapter; explicit CF authority/consent | One durable actor admission cause. Retain definition/law/body/mind/source snapshots and shell disposition; no new newborn after reload. Legacy constructed items remain items unless an explicit selected migration promotes them with an identity decision. |
| SI3 Companion production | Participant reservations, finite resources, sites and output stock; thermal, secretion, molt or pollination consumer | Save producer effort/condition, actual yield/source and pending boundary together. Do not pay output and retain the same reserved input. Existing saves gain no retroactive molt harvest or idle labor. |
| SI4 Research/teaching | Observer knowledge and paid completion causes; claim scope/correction/confidence adapter, bestiary projection | Preserve legacy combat catalogue separately. Missing notes mean unknown; no automatic discovery from owning a companion. Preserve contradictory claims, teacher provenance and sample custody across import. |
| SI5 Procedural variation | PROCGEN's shared identity, species, lineage and retained draws; constrained material families | Persist actual generated resolutions/revisions. Seed alone cannot restore changed algorithms. Canon/exact cores remain locked; copy/offspring/harvest refs need explicit world/identity scope. |
| SI6 Publication and imports | Durable envelope and incumbent scheduler; exact holder/reference validation plus coordinated domains | Choose actual next schema at implementation time. Validate inventory, installed habitats, body attachments, active exposures, actor refs, sample lots and in-flight jobs before publication. Missing pack/unsupported law needs retain/export/suspend or a reviewed migration. No silent deletion or reroll. |

In particular, F3's mixture publisher stages mixture/player inventory/money/effect;
it does not stage arbitrary NPC body changes. F4's native rollback list does not
include an imagined companion registry. New consumers must use a publisher that
includes every changed owner. Shared material batches should refer to actor
provenance without duplicating actor stock or consent in a parallel pet save.

## A. Observable acceptance examples, if a slice is selected

No checks below were run. Target **1366×768 laptop**, plus a wider desktop
check. Visible outcome: inputs/known predictions, companion's willing task or
care state, useful product/result and attributed notebook entry beside ordinary
work. Mobile optimization is deferred. Use rebuilt bytes and a fresh disposable
origin; saved changes require Save/reload and literal-file export/import.

| Code | Candidate small journey | Evidence that would distinguish a real result |
|---|---|---|
| A1 | Craft one fitted harness or toy, offer it, observe supported use, then refit/repair if selected | Actual stock pays; unsuitable fit refuses without spending; companion-specific function or observed preference changes. Exact installed/held object and knowledge survive roundtrip. Cosmetic output can instead be declared cosmetic. |
| A2 | Make one task golem, ask it for one useful job, allow handoff/refusal under its selected mind law | Activation consumes exact stock and yields one stable actor with its own effort/output/history. Same body persists after reload; retry/storage failure duplicates neither core nor actor. A designer preview alone does not show autonomous play. |
| A3 | Collect declared shed fiber/scale, prepare a useful product, compare optional harmful collection only where selected | Real source object/quantity and method recorded; body consequences agree with method. Same batch survives trade/import. Repeated action cannot re-collect the same shed object; named biological resource is not proof of a renewable producer. |
| A4 | Observe a companion, learn one care/handling method from a keeper, apply it, teach a second actor | Specific evidence and limited confidence enter each observer's notebook. Method enables one useful action, while individual trust remains separate. No free species-wide facts or hidden evolution roadmap from the first observation. |
| A5 | Use field notes to choose a supported evolution or fitted treatment, then confirm the actual result | Pure preview spends/draws/teaches nothing and filters truth. At the paid boundary, exact materials, consent/body changes and knowledge publish together; active/pending/completed states restore exactly and retain revisions. |

Recommendation, INFERRED: choose one complete FC + IR care/gear journey first
if the coordinator wants a low-cost crafting join, preserving Rill's current
contract. A new made actor is a separate slice with a larger admission and
identity cost. Neither is a prerequisite for finishing the other. Universal
ecology, full veterinary simulation, all construct minds, mounted travel,
cross-world transport and broader prestige remain menus, not hidden C15 gates.
