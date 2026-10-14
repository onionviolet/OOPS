# PC3: assembly at every level

2026-10-14. DOCS DELIVERED, PROPOSALS ONLY. No implementation, accepted design change, runtime test, build or browser proof. Evidence labels: SHOWN = directly read source; STATED = an owner says this; INFERRED = PC3's proposal or worked illustration. Source locators describe the inspected working tree, not a frozen clean checkout. Observed branch `codex/gameplay-foundations`, HEAD `ce23ead8`; HV1 read only with `git show proc/hv1-carcass:src/harvest.js` at `de15c662`. Other sessions write concurrently.

## Corrections to the root palette first

| Code | Evidence and correction | Proposed fold into root |
|---|---|---|
| PC3-F1 | SHOWN: `src/items.js:397-428,941-1006` already has typed weapon components, head/handle assembly and derived attack; armor has internal/external components (`src/items.js:839-858,883-899`). STATED: W4 [IMPLEMENTATION](../../maker-arts-2026-10-14/IMPLEMENTATION.md):33-49 distinguishes template assembly from generated per-part truth. | ML3-ML4 reuse existing consumers. The missing feature is saved mutable parts, exact custody, fit and complete restoration, not the first assembly system. |
| PC3-F2 | INFERRED: ML1-ML10 repeat some relations, but “a new level costs data, not code” overstates reuse. Substance is composition, network is connectivity and contracts, body is a recipient with agency, technique is a program. STATED: [P6 patterns](../../procgen-2026-10-13/p6/PATTERNS.md):9-21 and [CR1](../../procgen-2026-10-13/cr1/BODY_AND_SPECIES.md):7-40 separate those roles. | Keep a common attachment vocabulary and adapters. Do not declare one universal tree evaluator, wear scalar or execution engine. |
| PC3-F3 | INFERRED: ML-A needs typed aggregation and explicit law scope. Charge is conserved, throughput bottlenecks, attack follows a formula, coverage is spatial, and faculties require actual support. | Replace “stats derive from parts” with “capabilities derive through domain reducers from parts, connections and actual means.” A law reaches only selected carriers, targets and interfaces. |
| PC3-F4 | INFERRED: ML-B is an accounting principle, not an automatic refund. STATED: [P6 repair](../../procgen-2026-10-13/p6/REPAIR_SALVAGE.md):9-21 distinguishes detach/refit from remelt; SHOWN: authored artifact disassembly returns exact original recipe ingredients (`src/artifact_collection.js:90-97`). | Detach can return surviving parts; shatter/remelt can return fractions, fragments or declared waste. Never apply original-ingredient refunds to a worn, consumed or upgraded assembly. |
| PC3-F5 | STATED: [materials audit P3](../../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md):76 and [weaponcraft identity fold](../../../../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md):337-355 retain canonical P2 product/knowledge authority. SHOWN: `src/mixture_state.js:67-85` separates product identity, catalogue resolution and observation. | ML-C means a shallow key referencing complete validated truth, not a shallow truth record or a second identity registry. Meaningful provenance stays addressable. |
| PC3-F6 | SHOWN: `src/invention_planner.js:30-58,95-123,160-215` is an authored AND/OR requirement planner with feasibility and cycle diagnostics. It neither spends inputs nor executes invented spells. STATED: [P6 invention](../../procgen-2026-10-13/p6/TECHNIQUE_INVENTION.md):3-15 still requires executable typed definitions. | ML10 can use the planner for known prerequisites; its graph is not an installed assembly or spell compiler. |
| PC3-F7 | STATED: [HV2 REPORT](../../harvest-modules-2026-10-14/hv2/REPORT.md):9-11 says HV1 take-one discards remainder and finished keys lack per-item lineage. SHOWN at the branch snapshot: `src/harvest.js:27-44,60-71` confirms graded keys, selected outputs and whole specimen removal. | Do not claim an intact donor tree or full provenance inspector is already available. Follow HV2 M1/M2/M9 for future remainder claims and output adapters. |

## PC3-T1: ML1-ML10 crosswalk and sharing decision

INFERRED table. “Now” means reuse a narrow existing seam in a selected future slice, not build authorization or proof of a generic implementation. STATED: [root MA](../../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md) requires “earn it twice”; [generation GR12/GR13](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md):42-43 requires an actual reader and equal NPC/player rules. Two proposal rows alone do not earn a new shared runtime.

| Level | Parts/slots interpretation | Earned common piece now | Separate rule or second-consumer gate |
|---|---|---|---|
| ML1 substance | Constituents in a composition, not detachable sockets | Reuse P2 typed units, fractions and canonical product references | Wait on universal substance abstraction. Mana charge, venom active and iron mass need separate budgets/consumers; no universal conversion |
| ML2 batch | Quantity plus optional container; members if discrete | Reuse inventory key/decoder and HV2 output adapter contract | Lot age, preservation, member identity and custody are not a socket tree. New rich batch owner follows HV2 B4, not PC3 |
| ML3 part | A definition plus selected material, interface and condition; may contain subparts | Item component roles already serve weapons and armor | New mutable child instances wait for two actual repair/swap consumers with complete decoder and holder restoration |
| ML4 item | Typed occupied slots and function projection | Weapon/armor composition earns small physical slot validation and explanation vocabulary twice | Keep combat, armor and brace reducers distinct; do not rewrite upstream formulas just to share code |
| ML5 assembly | Physical containment tree plus separate power/control edges | Exact stock/custody operations already serve artifact assembly and reserved artifact use (`src/artifact_collection.js:80-112`) | Dynamic assembly core earns extraction after generated equipment and one powered apparatus prove detach, withdrawal and roundtrip. A golem actor is not an armor set |
| ML6 structure | Physical fixtures/connections on an actual site | Can consume the future physical attachment interface | Wait for P6 rack S7-A as second physical installation consumer. Geometry, installation, utility and scheduler capacity remain site adapters |
| ML7 site | Structures, resource sources and actor assignments referenced in one place | Reuse actual site/actor/resource references and operation reservations | Membership is not physical ownership. Mine depletion, worker availability, access and room habitation stay with owners |
| ML8 network | Sites and typed transport/contract links; cycles expected | Read-only nodes/edges presentation can share once item and network displays both need it | Wait for a real route delivering conserved stock between two sites. Routing, in-transit stock, tariffs, contracts and failure recovery need network code |
| ML9 body | Installed anatomy and equipment attachment view | Reuse physical fit predicates for supported prosthetic mounts; delegate function queries to body owner | Recipient responses, healing, integration, life stage, controller, inheritance and agency stay separate. CR1 owns recipient response; harvest owns donor removal |
| ML10 technique/spell | Typed operators, steps and ports in an immutable definition | Existing planner can explain prerequisite alternatives; physical carrier can use item slots | Wait for two actual executable consumers before shared pattern evaluator. Order, timing, targets, energy and vows cannot use weapon stat summation |

PC3-D1 (INFERRED): share **references, typed interfaces, exclusive physical custody, pure explanations and version validation** where two existing consumers already exercise them. Extend P2 references through W4 adapters rather than copy its entire mixture-specific record. A common optional attachment view can describe `parentRef`, stable `slotId`, `childRef`, interface revision and edge kind. Domain owners resolve truth; the view owns neither bodies nor jobs. Physical installed-parent ownership is acyclic and exclusive. Reference links, circulation paths, transport routes and signal graphs may cycle under their own validator. Do not put workers, bonds or contracts in an inventory-owned child slot.

## PC3-T2: slot typing and fit

INFERRED contract, grounded in STATED [P6 smithing](../../procgen-2026-10-13/p6/SMITHING.md):9-21, [patterns](../../procgen-2026-10-13/p6/PATTERNS.md):9-21 and [nonhuman E2-E4](../../../../worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md):62-64.

| Fit axis | Physical example | Body or program distinction |
|---|---|---|
| Kind and role | Blade root accepts a tang, lamp carrier accepts a lens mount | Graft mount selects tissue/function interface; spell input requires a typed energy/target channel, not a material tag alone |
| Geometry and tolerance | Socket class, size band, orientation and joint clearance | Recipient dimensions and movement envelope; nonhuman limb count/placement is actual anatomy, not a human slot renamed |
| Capacity and count | One discrete head, several plate members, declared supported load | No universal limb or rune cap. World/template supplies capacity; constitution can explicitly waive a compatibility limit |
| Material/source compatibility | Binder joins these surfaces; insulated channel admits this charge source | Mechanical fit does not establish biological integration, motor control, source access or soul eligibility |
| Dependencies and exclusions | Blade needs retained binding; controller requires real supply | Loss of gripping limb invalidates only actions requiring that function. Two patterns may share one payer without each owning its full charge |
| Means, access and knowledge | Actual tool/worker/station and object custody | Unknown fit can be tested under supported experimental law; unsupported model data blocks paid admission. Social prohibition differs from physical impossibility |

PC3-D2 (INFERRED): validator returns compatible, incompatible, unresolved simulation, or missing current means with a scoped reason. Observer uncertainty is a separate projection, never a truth enum. Fit is evaluated at preview and checked again at admission against revisions/reservations. Swapping into an occupied slot requires removal or a declared replacement transaction. One child cannot be installed in two physical parents; quantities from batches must be explicitly allocated.

## PC3-T3: ML-A worked roll-up and roll-down

PC3-E1 (SHOWN formula; INFERRED numbers): `src/items.js:1000-1006` computes attack from head/handle attack values, multipliers, whole-item quality and rarity. Choose illustrative supported coefficients: head attack 8, handle attack 0, handle flat attack 2, multipliers 1 and 1.5, handle stat multiplier 1, quality 100 and common rarity 1. Attack is `(8 + 0 + 2) * 1 * 1.5 * 1 * 1 * 1 = 15`. An ORIGINAL local law targeting the metal head halves its attack contribution: `(4 + 0 + 2) * 1.5 = 9`. Apply that selected law once at the head projection, then derive the parent; do not halve the grip or halve the parent again. A different world law explicitly selecting wielded weapons could act on the final weapon instead. These are arithmetic illustrations, not balance choices or executed tests.

PC3-E2 (SHOWN): `src/alloy_equipment.js:4-8` gives Springsteel grade 1, agility 2, rigidity -1, yielding agility +2 and strength -1. Its field hook is restricted to `field.pack_drive` / `field.load_step`, reads equipped grade and modifies effort/output (`:19-27`). INFERRED: a future two-part brace must derive its response from the selected parts and actual equipped product. Adding two braces or two material layers cannot double every bonus; the reducer must declare load path and active equipment relation. P6 S3-A explicitly identifies the present template-ID shortcut (`SMITHING.md:15`).

PC3-E3 (INFERRED, ORIGINAL rack illustration): frame supports 4 hanging units, rails 6, installed receiver space 3, so usable capacity is `min(4, 6, 3) = 3`, not 13. A local wet-wood law selects the frame and lowers supported load to 2; capacity becomes 2. Removing one damaged rail changes rail support to 1, so capacity becomes 1. Existing queued stock remains owned; the scheduler pauses/reassigns the excess under the job law rather than deleting it. The worked law is fictional, not an engineering formula. STATED foundation: [P6 BUILDINGS](../../procgen-2026-10-13/p6/BUILDINGS.md):15-21 requires installed capacity and saved bindings.

PC3-E4 (INFERRED, ORIGINAL lamp illustration): one battery holds 12 charge. A light operator spends 2 per eligible work interval; a control operator spends 1. Combined demand is 3, giving four intervals if no other cost applies. Copying the formula or viewing two control modes does not create another battery. A local field blocks only the light output, leaving carrier and charge intact; the selected law declares whether blocked execution spends charge. Replacing a lens changes coverage; repairing its mount does not recharge. STATED: [P6 PATTERNS](../../procgen-2026-10-13/p6/PATTERNS.md):19-27 keeps geometry, coverage, payer and source separate.

PC3-D3 (INFERRED): “laws roll down” means traverse applicable typed relations with a scope and selector, then run the owning reducer. Record law revision, matched target, changed term and aggregation reason. Resolve priority/conflict through PC2's owner, not a competing PC3 order. Distinguish retained origin law from destination field and crossing policy; [generation SB16](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md):68 and [accepted carry dials](../../../../RULES_FROM_SCRATCH.md):15-31 need an explicit edge decision. A regional ban on sale is an institution response, not a law that turns the blade physically inert.

## PC3-T4: ML-B, wear, upgrade and swap

INFERRED table; STATED owners: [P6 REPAIR_SALVAGE](../../procgen-2026-10-13/p6/REPAIR_SALVAGE.md):9-21 and [W7 JR1-JR5](../../maker-arts-2026-10-14/ITEM_LIFETIMES.md):68-72.

| Operation | Tree transition and retained identity | Accounting and failure |
|---|---|---|
| Disassemble | Retire parent occupancy; return actual surviving blade, grip, lens etc. with current condition | Detachment law may damage joints or spend binder; no return of already consumed coating or battery fuel |
| Local break | Crack blade or detach a rail; parent loses affected function, other installed parts remain | Damage location uses an actual declared event/consumer. Do not invent hit-location combat from a diagram |
| Shatter / remelt | Replace destroyed structure with supported fragments/fractions | Example: 10 material units become 7 usable units, 2 declared slag, 1 declared loss. No intact blade plus those outputs; structure/pattern survival follows its law |
| Repair | Restore selected edge/joint/function on the same physical object where supported | Keep prior mass, lifetime erosion and biography. Repair of metal, pattern and charge are different work |
| Swap / upgrade | Move exact old child out and exact new child in; parent physical ID normally remains, revision changes | Reserve both; recompute effects and invalidate caches. Old child may return to inventory or actual escrow, never both. Upgrade must change a real consumer |
| Deploy / dismantle | Frame changes from held item to installed fixture or actor-associated body | One custody transition; no inventory frame working simultaneously as a construct. Stop/reconcile assigned jobs before detach |

PC3-E5 (INFERRED, ORIGINAL): knife has blade condition 60, grip 90 and binding 20. A supported cutting law can read blade sharpness while safe assembly requires binding above a declared threshold. Replacing the binding restores attachment without making the blade 100. Breaking the blade returns blade fragments under its recovery law; the 90-condition grip can be detached separately. Condition is a vector where consumers require it, not the mean of 60, 90 and 20.

PC3-D4 (SHOWN boundary; INFERRED extension): optional E2 durability has an instance ledger and whole-item factor (`src/absorb_e2/durability.js:7-40`); W4 records current per-hit wear and double-wear risk (`IMPLEMENTATION.md:36,49`). Keep that legacy law intact. New part wear starts only for selected new instances or an explicitly migrated instance. Choose one authority per wear event, store fractional residuals and meaningful boundary state, and preserve wear-off play. Do not apply both legacy factor and new part reduction to the same cause. Body healing is not E2 repair; programs do not rust because they have slots.

PC3-D5 (INFERRED): HV2 M1 staging extends downstream. Admission freezes relevant object/part/source/job revisions and reserves exact stock and means. Settlement publishes inventory/custody, structure revision, time/energy, waste and receipt together through the existing durable host seam. Failed publication changes none; replay cannot settle twice. Cancel before irreversible transformation returns unspent escrow; afterwards retain actual partial state/output, not the original object. Recompute/withdraw native effects when equipped or installed parts change. Definitions stay immutable; mutable instance revision keys invalidate derived caches.

## PC3-T5: ML-C identity versus provenance

STATED: W4 [identity contract](../../maker-arts-2026-10-14/IMPLEMENTATION.md) and W7 [JR separation](../../maker-arts-2026-10-14/ITEM_LIFETIMES.md):68-72 are the owners. SHOWN: legacy keys encode ID or component definitions plus quality (`src/items.js:240-255`); mixture keys point to retained product truth (`src/mixture_state.js:67-80`). INFERRED table:

| Layer | What is keyed or saved | Stack consequence |
|---|---|---|
| Immutable product definition | Resolved gameplay composition, treatment, topology and law revision in owner catalogue | Shallow reference in key; definition may contain detailed parts. No recursive history in the key |
| Batch or mutable instance | Count/unit, exact installed children, relevant condition/charge/coating and reservations | Fungible state may share a stack. Different current behavior, discrete tokens or independently mutable copies cannot merge |
| Physical identity | Stable copy reference when custody, wear, unique origin or bond needs it | Unique copy cannot be substituted merely because its stats match |
| Biography / provenance | Input/output/event links, maker, donor, place and significant history | Ordinary history may coalesce as allocated lot/cohort lineage. If a recipe, claim, price or law reads exact origin, retain membership or distinct copies |
| Knowledge / claims / aliases | Observer evidence, believed name, nickname, certificate, rumor | Naming/appraisal changes views, not physical definition. Different belief is not a new physical stack |

PC3-E6 (INFERRED): two fully interchangeable fresh blades of the same retained definition can share stock despite different descriptive maker receipts if no consumer distinguishes makers. A recipe requiring a particular donor or an heirloom claim makes origin gameplay state, requiring exact member selection. UI may group these under one row with expandable members, but grouping must not erase underlying identity. Never merge different hidden true properties just because the player sees the same name; grouping, sorting, price and fit predictions must respect the knowledge projection and avoid sealed-state leaks.

PC3-D6 (INFERRED): bound/compact ordinary receipts by the owning retention policy while retaining unresolved claims, ancestry needed by consumers, unique IDs and input/output conservation. A detached part retains its own origin plus an attachment/removal event, not every ancestor's entire embedded biography. Inspection reads links with bounded traversal; rendering consumes no draws. Save limits do not justify silently deleting protected trophies or exact tokens.

## PC3-T6: bodies and recipients remain distinct

STATED: [genetics G1/G4](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md):14-31,73-85 separates anatomy, genetics, constitution, bloodline, adaptation and identity; BM1-BM6 (`:829-834`) permits grafts and universal acceptance where declared. [CR1](../../procgen-2026-10-13/cr1/BODY_AND_SPECIES.md):38-42,71-77,99-103 owns recipient responses and exposure transitions. [Nonhuman E1-E14](../../../../worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md):61-74 proposes body truth, function queries, body-defined slots and explicit retention. INFERRED table:

| Body assembly case | Shared relation | Separate recipient rule and observable gate |
|---|---|---|
| Grafted beast eye / organ | Exact donor part, recipient mount, integration job, custody and revisions | CR1/body adapter decides uptake, tissue compatibility, ongoing burden and supported perception. Test actual sight/action change; no automatic donor memories, school mastery or heredity |
| Prosthetic hand | Fitted mount, installed part condition and power supply if used | Body/controller owns grip and learned coordination. Demonstrate tool work becomes possible, loss/power failure withdraws it, unaffected walking remains unchanged |
| Extra/nonhuman limbs | Stable named attachment positions and supported movement interfaces | Body template defines count, grasp, gait and reach. Do not map four limbs to four human weapon buffs or assume every limb can hold a sword |
| Amorphous / rooted body | Supported compartments, contact/root interfaces, carried or engulfed items | No invented skeleton. Engulfing custody is not assimilation; substrate exposure targets the actual recipient, not every structure in the site |
| Construct / possessed object | Physical frame plus body reference where deployed | Body, controller, actor and soul stay separate. Power repair cannot install agency or transfer a person's skill; familiar bond is not scrap assembly |
| Brood / shared controller | References to actual member bodies and communication edges | Members retain their own vitals, injury, knowledge and agency under channel law. No averaging bodies into one health pool or granting all members one potion dose |

PC3-D7 (INFERRED): harvest removes from the donor; recipient integration queries CR1/body owners and settles through a coordinated transition. Existing exposure follows retained compartments/carriers, not the player's selected controller. A graft can be somatic without affecting descendants; an inherited faculty need not be a detachable organ. Regeneration, replacement, motor relearning and inheritance each require their own supported law. Respect comfortable unfed ordinary play and no hunger death. Injury permanence, upkeep and offline body decline remain local options, not consequences of choosing an assembly abstraction.

## PC3-T7: techniques, spells, pills, structures and sites

INFERRED table, with STATED owners in the last column. This separates three graph kinds: prerequisite plan, executable program, and physical installed carrier.

| Domain | Slot assembly use | What stays separate | Owner / second proof |
|---|---|---|---|
| Martial form / fitting procedure | Ordered stages with required body/tool interfaces, effort and targets | Learned coordination, execution legality and mastery. Editing a stage creates a new definition, not inherited success | [P6 S9-A](../../procgen-2026-10-13/p6/TECHNIQUE_INVENTION.md):39-49; prove experiment, repeat work and qualified collaborator use |
| Spell / rune pattern | Operators with input/output port types, target selectors, activation and supported control edges | Real caster/source/payer, duration, energy, trigger and executable target response. Reject invalid topology before spend; supported feedback needs its own timing law | [P6 S6-A](../../procgen-2026-10-13/p6/PATTERNS.md):31-35 and S9-B; a mundane fitting proof does not establish magic |
| Pill formula | Stage sequence referencing actual fractions, vessel, heat/process and output dose | Formula is information; pill is material product; CR1 resolves recipient. A copied formula creates no pill, charge, faculty or advancement | [P6 invention](../../procgen-2026-10-13/p6/TECHNIQUE_INVENTION.md):26,33-49 and P2/CR1 |
| Rack / forge / ship / wall | Physical connections and installed fixtures with material and condition | Phase completion, actual site installation, capacity, coverage, utilities and partial use | [P6 S7-A](../../procgen-2026-10-13/p6/BUILDINGS.md):15-35; test usable rack, teardown and queue conflicts |
| Farm / mine / workshop row | Installed structures reference source nodes and assigned workers | Source regeneration/depletion, producer readiness, access and scheduler capacity. Workers remain actors | [HV2 M1-M7](../../harvest-modules-2026-10-14/hv2/MODEL.md), P8 resource owners and P6 buildings |
| Route / supply guild / brood network | Typed links with declared flow/channel and endpoint references | Transit conservation, communication knowledge, contracts, interruptions and cycles | Root PC4/logistics and genetics G9 (`GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md:200-231`); wait for actual two-site delivery |

PC3-D8 (SHOWN / INFERRED): planner `composeTargets` shares requirement IDs, while `checkFeasibility` uses Boolean availability, not reserved quantities (`src/invention_planner.js:28,130-132,160-215`). Two requirements referencing one available primitive do not prove enough stock for both. Use planner results as a scoped roadmap and then run actual quantity/capacity admission. `roadmapView` hides unknown graph IDs/descendants (`:225-228`); do not bypass it with a complete part diagram of a secret formula. Immutable program revisions retain prior tested definitions; teaching copies information, not the teacher's mastery or source.

## PC3-T8: old-save compatibility proposal

PC3-D9 (INFERRED): existing items become **opaque single-part assembly views** first, preserving their current wire keys and behavior. This reconciles root MT10 with W4 IM7 rather than eagerly rewriting the save. The view's one `legacy.core` part references the whole existing item including its old component payload. It can show known component names as descriptive children without minting detachable saleable copies. Legacy quality, stats, value, custody and optional durability stay exact. No fabricated maker, age, donor, geometry, charge, rune capacity or anatomy is added.

| Stage | Saved-state decision | Required future gate |
|---|---|---|
| Read-only legacy view | Derived on read; absent assembly field means legacy behavior | Old ID-only, component/quality, mixture, structured-equipment and E2-instance items reconstruct with identical behavior in every holder |
| Promote selected copy for mutation | New versioned instance references original definition; reduce exact old stack count and allocate one ID in the same transaction | Equip/store/sell/reserve/import retain identity and total stock; two identical old copies can acquire different wear without aliasing |
| New generated assembly | Save validated immutable definitions before mutable instances, then holders/jobs referencing them | All refs resolve; no duplicate parents, cycles in physical custody, dangling parts or stale effect bindings |
| Existing component item conversion | Explicit selected conversion may materialize parts only under a declared conservative law | No free disassembly profit or duplicate old equipped key; match old stats until an authorized upgrade changes them |
| Unknown revision / damaged import | Validate a staged full envelope before replacement; reject unsupported active semantics, or use an explicitly chosen dormant compatibility policy | Failed import leaves current save untouched. No fallback that invents human anatomy, missing parts, charge or a new draw |

PC3-D10 (INFERRED): repeated load/migration is idempotent, uses stable references without consuming generator draws, and never silently applies today's balance law to retained paid objects. Persist law/operator versions and actual resolved outcomes when generation requires them. Before implementation reserve the live save/inventory/equipment owners named by W4. No private user save was opened for this report.

## PC3-T9: desktop part diagram proposal

STATED: [USER_VISION](../../../../USER_VISION.md):5-24 requires desktop/laptop first and useful independent panels. INFERRED visible outcome: at **1366x768** and **1600x1000**, selecting an object shows its installed parts, selected part fit/condition, useful resulting function and routine actions together. Mobile optimization, voxel editor, full anatomy simulator and global network dashboard are deferred.

~~~text
Assembly: field knife                  Actual function: cut supported stock
Parts / attachment diagram             Selected part and known fit
  blade [worn]                         Blade: observed edge wear
    binding [loose]                     Fit: needs compatible binding
  grip [sound]                         Compare replacement: cut change / cost
                                      [Repair] [Swap] [Detach] [Queue]
Inputs / stock / reserved means         Result and receipt / bottleneck
Eligible known parts                   Function lost: binding below local limit
Selected tool, work time, site          History and law reasons in reading area
~~~

PC3-D11 (INFERRED): use a named slot tree or modest spatial diagram with keyboard-selectable rows and text status as well as color. Show connection type, not just proximity; power channels can overlay physical attachments when supported. Keep part list and compare/action panel visible at comfortable text size, with long history scrolling in its own region. At the larger viewport expand diagram/detail height and show stock/job information alongside, rather than stretching empty space. Body view shows supported anatomy and function consequences through its owner's projection; technique view switches to step/port graph and distinguishes theory from tested revision. Site view shows installed fixtures and real capacity; worker assignment is a relation, not a drawn mechanical limb.

PC3-D12 (INFERRED): unknown slots/details appear only at the disclosure fidelity allowed by their owner. No hidden child count, topology, hover label, price, sort order or exact law trace leaks a sealed truth. Developer traces remain a separate authorized inspection surface. Preview shows the known prediction and uncertainty; committed receipt shows actual observed outcome. Pure view rendering must neither register a fixture nor advance a draw/job.

## PC3-T10: ranked next steps, proposed only

STATED: root COMMON requires files, saved-state change, observable gate and executor level. INFERRED recommendations below extend existing owners, not a new universal engine. Finish each selected playable slice before the next. No executor was dispatched.

| Rank / code | Files and visible outcome | Saved-state change | Gate | Suggested executor |
|---|---|---|---|---|
| 1 / PC3-A1 | W4 PS1 / P6 S3-A: two generated braces changing actual pack-drive work. `src/mixture_state.js`, `src/items.js`, `src/alloy_equipment.js`, native inventory/equipment/save seams through owner-approved adapters | Optional validated product definition and selected-copy refs; old Springsteel and all legacy keys unchanged | Two paid variants, equip/swap changes real effort/yield; failed write, stored/equipped/reserved Save/reload/Export/literal Import exact; fresh rebuilt desktop route at both targets | Strong, high effort for cross-holder identity integration |
| 2 / PC3-A2 | W4 PS2/PS3 and P6 S5: one physical part swap/repair plus a second weapon/armor consumer. `src/items.js`, `src/absorb_e2/durability.js`, selected work/combat and transaction owners; new assembly adapter only after both consumers establish contract | Exact child custody, per-part condition, immutable definition and instance revisions; preserve legacy wear setting and law | Compatible/incompatible fit; old child returned once; partial cancellation; real function withdrawal/restoration; full persistence. Extract shared fit/custody core only after second consumer proves reuse | Strong, high effort; bounded pure validator review can be balanced, medium |
| 3 / PC3-A3 | P6 S7-A rack then S10-A sorting jig as separate checkpoints. `src/site_projects.js`, `src/home_furnishing_content.js`, `src/artifact_collection.js`, site/job owners | Installed fixture refs, actual capacity, utilities and exclusive dormant/deployed state, saved jobs | Paid rack yields useful dry stock; jig performs parallel paid work, loses function on power/controller removal; teardown reconciles stock/jobs and import does not duplicate worker frame | Strong, high effort for site/scheduler joins |
| 4 / PC3-A4 | P6 S9-A procedure and S6-A/S9-B lamp as separate checkpoints. `src/invention_planner.js` used read-only for roadmap, technique/pattern/maker/runtime owners | Immutable validated operator definitions, actual source/target bindings, observation/mastery separately; formulas restored before instance refs | Paid experiment, actual repeat work, honest manual/collaborator means; lamp real benefit, one payer, depletion/withdrawal; invalid ports before spend and unchanged next draw after roundtrip | Strong, high effort; pattern evaluation shares only after two executable consumers |
| 5 / PC3-A5 | One original prosthetic gripping interface with body/CR1 owners. `src/backlog_expansion_body.js`, `src/structured_equipment_runtime.js`, `src/capabilities.js`, native action/equipment and body transition owners | Optional supported mount/integration/coordination state with neutral legacy migration; target body/exposure refs retained | Previously unavailable supported grip job becomes possible; detach withdraws grip, preserves unrelated functions and knowledge; body-switch/exposure and Save/reload/literal Import exact. No hereditary faculty or donor-memory grant inferred | Strong, high effort; body owner must coordinate recipient and native consumers |

## Verification and remaining gates

PC3-V1 (SHOWN process): read COMMON first, inspected dirty state/branch, AGENTS, PROJECT/USER_VISION, root rounds 1/2, HV2 PLAN/MODEL/REPORT and HV1 branch source; read requested item/alloy/invention source, weaponcraft identity folds/W4/W7, P6 buildings/constructs/patterns/repair/invention, CR1, nonhuman and genetics sections, plus linked materials/crafting/generation/world-kit/rules owners. No fresh franchise claim was introduced; examples are original arithmetic proposals. Memory keyword lookup had no relevant hit and supplied no design evidence.

PC3-V2 (SHOWN process): documentation checks confirm exactly CHECKPOINT.md and REPORT.md in this lane, valid relative file links and no em dashes. Topic review covers all ML levels, ML-A/B/C, fit, wear, swap, donor/recipient separation, programs, sites, migration and desktop diagram. Writes are confined to `pc3/`; no source edit, staging, commit, merge or private-save access. Documentation checks do not prove runtime behavior.

PC3-R1 (STATED gate / INFERRED application): all proposed source/native/persistence gates remain OPEN until an authorized owner refreshes live state, implements the selected slice and exercises rebuilt fresh-origin desktop behavior with exact Save/reload/Export/literal Import. Human fiction, balance and diagram taste acceptance are separate. This docs-only assignment does not make completion depend on implementing any of those proposals.

Summary: parts and slots are a useful shared vocabulary at every level, but only narrow physical fit, custody and reference seams earn reuse now. Keep composition, recipient response, executable programs, site scheduling and networks in their own owners; earn any larger shared engine through two real consumers and conserved saved state.
