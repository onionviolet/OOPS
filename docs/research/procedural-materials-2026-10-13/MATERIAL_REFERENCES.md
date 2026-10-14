# Material references and reusable mechanisms

2026-10-13. Research and original proposals only. No runtime edit, new acquisition, install, build, browser gameplay, commit or accepted product decision. Read beside the [implementation audit](../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md), which owns the current generated-product gaps.

## Evidence and selection

F1: Five useful references cover different problems: Noita for interactions and exposure routes, Dwarf Fortress for production/provenance, Elin for selected ingredients changing outputs, Cataclysm: DDA for food/material organization, and The Powder Toy for explicit physical state transitions. These are reference mechanisms, not a request to reproduce five engines.

F2: Existing Noita, DF and Elin dossiers were reused. Their named private retained-source paths are unavailable on this host; this pass did not reverify those raw files. Their exact build/revision locators remain historical source evidence, with runtime semantics explicitly unverified. The Powder Toy source and official CDDA guide were read live. Noita/DF community wikis surfaced useful discovery links, but they are secondary explanations and are not primary proof of implementation. No secret recipe truth is disclosed here.

| Reference | Evidence used | Useful locator and limit |
|---|---|---|
| Noita | Prior shipped XML/Lua audit, Steam build 17130612 | [Material digest](../noita/MATERIAL_REACTION_DIGEST.md), [substitution review](../noita/ALCHEMY_AND_SUBSTITUTION.md); archived engine ordering and seed-generator equivalence were not established |
| Dwarf Fortress | Prior shipped declarations, build 24557528 | [Findings](../dwarf-fortress/FINDINGS.json), DF-M01–M05; native interpreter was not recovered. [Official mod guide](https://bay12games.com/dwarves/modding_guide.html) confirms object-based data organization, not token semantics |
| Elin | Prior community decompilation at `6713f0656491f73f79068454dc3cd938b3a74c10` | [Craft reader](../elin/readers/CRAFT.md), [locators](../elin/readers/CRAFT.json); external material rows and runtime absent |
| Cataclysm: DDA | Live official documentation | [Comestibles guide](https://docs.cataclysmdda.org/JSON/GUIDE_COMESTIBLES.html), special foods and solid/liquid sections; categorization is documented, composition inheritance not established by this page |
| The Powder Toy | Live upstream source | [Element.h](https://github.com/The-Powder-Toy/The-Powder-Toy/blob/master/src/simulation/Element.h), properties and transitions; [WATR.cpp](https://github.com/The-Powder-Toy/The-Powder-Toy/blob/master/src/simulation/elements/WATR.cpp), constructor/update. Mutable `master`, no installed-game verification |

Two CDDA documentation URLs for detailed materials/recipes did not fetch; the alternate raw-source route also returned 404. No claim about nutrient inheritance, recipe byproducts or detailed material schema relies on those failed fetches. Its successful official guide supports the smaller taxonomy point below.

## Coverage without one flat tag list

P1: Treat these as intersecting axes. A blood sample is biological, liquid and species-derived. A wooden enchanted handle is plant-derived, solid, processed and magically modified. Neither needs to become an unrelated universal item class.

| Material area | Useful original coverage | Properties/processes to author when needed |
|---|---|---|
| Plant and wood | Roots, leaves, seeds, bark, resin, timber | Grain/strength, extractable fractions, fuel behavior, growth origin |
| Animal and biological | Hide, bone, shell, fat, blood, tissue, culture | Species mapping, condition, rendering, preservation, supported exposure routes |
| Fiber | Plant fiber, hair, silk, thread, fabric | Tensile behavior, absorbency, weave, insulation, coating retention |
| Mineral and metal | Stone, ore, salts, gems, bars, alloys | Hardness versus toughness, conductivity, phase, impurities, component role |
| Ceramic and glass | Clay, fired vessel, glaze, glass | Firing history, porosity, thermal response, surface treatment, containment |
| Liquid and gas | Solvent, oil, brew, vapor, atmosphere | Composition/amount, phase, dispersal, pressure where relevant, route response |
| Magical | Charged substrate, rune ink, fictional catalyst | Source-specific charge, affinity, consumption, activation conditions |
| Soul and conceptual | Authored world-specific substance, bond or ritual offering | Identity/custody, eligible target, local metaphysical law; no assumed mass/density |

The ordinary categories are supported as useful coverage by the existing production dossiers and live references. Magical examples have precedents in Noita's authored magic materials. Soul and conceptual entries are architectural provisions and original proposals, not verified universal categories from these five sources. Book/canon owners must establish whether a particular world actually has them. An emotion, oath or soul is not automatically a liquid reagent.

P2: Separate category (`metal`), measurable property (`conductivity` with a declared scale), ability (`stores local mana`), and reaction (`specified catalyst plus heat changes X into Y`). A reaction needs conditions and a consumer; a poetic tag does not implement one. Quality, amount, purity, potency, phase and current condition also remain separate.

## Twelve transferable mechanisms

Every adaptation below is unimplemented and untested in YAIR. Costs describe proposed player costs plus implementation burden. Probes describe later technical acceptance, not completed tests.

### M1: Exact identities beside functional families

**Evidence:** Prior Noita XML audit found exact selectors and bracket-family selectors, including related outputs preserving a matched material binding. See material digest, selector section, `materials.xml:15248` and substitution review F7.

**Adaptation:** Physical fuel slots can accept a property profile while ritual slots require a particular material. **Cost:** real substitute amounts; profile validation and exclusion handling. **Probe:** two eligible fuels work, a near match fails its explicit condition, and a same-profile material cannot bypass an exact ritual requirement.

### M2: One substance, several use routes

**Evidence:** Prior Noita digest distinguishes nested staining/contact and ingestion responses, with numeric stain thresholds separate from contents.

**Adaptation:** A brew may be useful as coating but ineffective when drunk, under authored fictional rules. **Cost:** consumed dose and separate use adapters. **Probe:** use the same saved batch by two routes; verify different native outcomes and unchanged underlying composition before use. Knowledge reveals observations for the tested route only.

### M3: Threshold transformations

**Evidence:** Powder Toy `Element.h` declares temperature/pressure thresholds with transition targets; `WATR.cpp:39–42` assigns freezing and vapor targets.

**Adaptation:** A workshop operation changes a declared constituent when it crosses an authored process threshold. **Cost:** station energy/time and transition bookkeeping. **Probe:** below-threshold and above-threshold batches differ, with explicit output quantities; save/reload during the job retains the scheduled boundary. Pixel constants are game rules, not imported chemistry.

### M4: Interaction conditions beyond ingredient presence

**Evidence:** Powder Toy `WATR.cpp` update uses neighbor identity plus temperature or motion conditions for selected transformations.

**Adaptation:** Agitation, contact surface or heat can distinguish two identical ingredient lists. **Cost:** optional process effort and indexed context predicates. **Probe:** change exactly one declared context variable and obtain a changed result; an irrelevant control has no effect. Evaluate at process events rather than running a particle world.

### M5: Source-derived products

**Evidence:** Prior DF-M04 joins `GET_MATERIAL_FROM_REAGENT` reactions with species/plant material mappings, `reaction_other.txt:5–24,265–280` and `plant_standard.txt:5–102`.

**Adaptation:** One tanning, paper or brewing operator yields source-specific output from actual input identity. **Cost:** material, apparatus and time; mapping coverage. **Probe:** two plant families use one operator but produce distinct persisted useful stock. Unsupported plants fail visibly instead of receiving invented generic output.

### M6: Reagents, catalysts, tools and containers have separate roles

**Evidence:** Prior DF-M03 declarations preserve selected tools/containers and route products into a carrier; native cancellation ordering remains unknown.

**Adaptation:** Scale spent ingredients with batch size while retaining the actual mortar or vessel. **Cost:** vessel capacity/access and reserved ingredients; transaction integration. **Probe:** doubled batch consumes doubled reagent, never duplicates the tool, and a full carrier rejects before spending. Cancellation follows our explicit reservation contract.

### M7: Intermediate production chains

**Evidence:** Prior DF-M02 smelting declarations distinguish intermediates, specific reagents and the general fuel requirement, `reaction_smelter.txt:5–55,139–158`.

**Adaptation:** Alloy, ceramic or advanced brew manufacture reuses intermediate stock across recipes. **Cost:** staged labor, inventory space and apparatus. **Probe:** an intermediate is both an owned tradable item and an actual later input; fuel cannot silently satisfy a different reagent slot. No real metallurgical process is claimed.

### M8: Improve the existing object

**Evidence:** Prior DF-M05 glazing keeps the target reagent and adds a material-specific improvement, subject to empty/unimproved eligibility.

**Adaptation:** Coat a blade, glaze a vessel or waterproof cloth without replacing its original object record. **Cost:** treatment stock, effort and compatibility checks. **Probe:** retained identity keeps workmanship/provenance while gaining one useful response; split/merge, reapply and reload cannot duplicate treatment or lose the substrate.

### M9: Material function differs from price

**Evidence:** DF-M01 declarations distinguish sale value, density, permitted uses and mechanical responses. Native combat formulas are not known from that evidence.

**Adaptation:** Insulation, heat tolerance, cutting performance and weight can favor different materials. **Cost:** acquisition tradeoffs and a small useful property vector. **Probe:** two equal-price materials have different demonstrated applications; one valuable material remains poor for an explicitly mismatched role. Avoid a single universal material score.

### M10: Selected ingredient roles drive generated equipment

**Evidence:** Elin reader traces `Recipe.Ingredient.IsValidIngredient`, `RecipeCard.Craft` and `Thing.ApplyMaterial`; rows and runtime remain absent. YAIR already has component-based equipment precedent.

**Adaptation:** Head, handle, lining and coating contribute through their own formulas, with skill/workmanship separate. **Cost:** component expenditure and existing equipment adapter extension. **Probe:** change one part while keeping quality fixed, observe its particular functional difference, then equip/use and round-trip the result. Reuse current component owners rather than replace them.

### M11: Cooking roles are broader than restorative potion effects

**Evidence:** Official CDDA comestibles guide distinguishes spices, brewing items, animal products and other food families; soup can serve a food role while remaining liquid.

**Adaptation:** A dish grammar accepts base, flavor, binding and optional benefit roles. Flavor, portion yield and useful meal effects remain distinct; no hunger-death requirement follows. **Cost:** food stock and cooking time; food-specific resolver/consumer. **Probe:** changing a seasoning changes an authored meal property without magically multiplying portions or mandatory nutrition penalties.

### M12: Families plus explicit exceptions

**Evidence:** Prior Noita digest records parent definitions, overrides and reaction-inheritance settings. That is data reuse, not evidence for arbitrary random generation.

**Adaptation:** Generate regional specimens from a coherent family, then save selected overrides once. **Cost:** scouting and comparison; generator constraints and saved revision. **Probe:** repeated encounters with one specimen reproduce its properties, related specimens share useful learned structure, and a canon material retains its fixed identity/exception. This is original generation design, not a copied Noita generator.

## Real references and source expansion

F3: [NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/) provides identified chemical species and cited thermochemical/thermophysical collections, including phase-change data and selected fluid properties. It is useful when a specific real-material fact would change a rule. It does not supply universal herb effects, biological potency, alloy strength or fictional magic. Record property, unit, conditions and underlying citation; do not treat missing data as zero. Gameplay can use simplified declared units without claiming scientific fidelity.

P3: Wiki intake should create bounded evidence cards: source/world, material ID, quoted or paraphrased claim, citation location, origin/phase, known properties, process/use conditions, exceptions and confidence. A fan wiki points toward chapter/episode/game data; uncertainty remains visible until checked. For direct book adaptation, exact identities and exceptional canon processes can coexist with invented regional families. Never generate a canon exception solely because two ingredients share tags. The source-acquisition playbook governs any later book collection; this pass collected none.

P4: The highest-value first reuse is M1/M2/M6 plus the existing audit's generated-product identity and effect restoration. Add one meaningful process choice, then prove actual potion use and repeat production. M5/M8/M10 are good second consumers, demonstrating that the same material facts support fibers, vessels, coatings and equipment. Complete that bounded slice before adding every taxonomy row. Breadth of catalogue is not proof of working systemic gameplay.

| Disposition | Candidate | Reason |
|---|---|---|
| Adapt first, proposal | M1/M2/M6 | Directly serves the requested meaningful mixtures, route effects and reusable apparatus |
| Trial in bounded slice | M3/M4/M5/M8/M10 | One process choice and one second consumer can distinguish useful reuse from decorative metadata |
| Park until a real consumer needs it | Full pressure/particle simulation, every biological exposure, arbitrary conceptual substances | High integration/content cost without an identified first-slice payoff; keep source-specific exceptions available |

Verification of this report: read the written file's word count (1,795 before this disposition table) and ran scoped `git diff --check`, with no whitespace errors reported. No source tests are claimed for these proposals; the untracked file itself still requires integrator review.
