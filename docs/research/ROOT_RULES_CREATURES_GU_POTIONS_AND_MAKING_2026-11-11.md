# Root rules for creatures, Gu, potions, chemistry, and engineering

Research and engine proposals under AD38, AD49 and AD51. This pass cross-checks selected book cases, wiki leads and real-world sources against existing engine boundaries. The source and test examples establish mechanisms and counterexamples at their stated scope. All proposed game equations, capacities, prices and clocks need their own calibration and play evidence.

## What changes the outcome

| Area | Source case and exception | Root rule and likely owner |
| --- | --- | --- |
| **Creatures** | *Fantastic Beasts*, Ashwinder, gives a magical fire as the origin condition and an egg that needs prompt freezing. *Reverend Insanity* ch. 826 shows a cheaper constructed python habitat and altered land affecting viable populations. Its grass → rabbit → fox sequence is a planned supply chain. In living reptiles, experiments found both genetic and incubation-temperature routes to female development in a single species. Those routes are a biological comparison for conditional development, with no implication that other species or Ashwinders share them. | **Model a creature across time.** State depends on lineage, stage, habitat, actual food and exposure history when the species rules read them. Keep inheritance, condition, training and possession distinct. Cohorts suffice for counts when individuals have interchangeable relevant state. A named carrier, breeding parent or trained pet retains identity. A harvested egg or secretion becomes a separately held output with its source form and clock. [Ashwinder egg evidence](hogwarts-potion-evidence-2026-11-11/observations.jsonl) · [Held Gu habitat cases](OTHER_YAIR_PROCEDURAL_SYSTEMS_PROPOSAL_2026-11-11.md#round-3-immortal-aperture-engine-rules) · [Reptile developmental study](https://pmc.ncbi.nlm.nih.gov/articles/PMC8049264/) |
| **Gu** | *Reverend Insanity* ch. 70 shows Little Light supporting a moonblade during activation. Ch. 106 supplies a saturation case for attack power with additional support. Ch. 121 shows two Liquor Worms and four wines yielding a Four Flavours Liquor Worm, whose effect is to refine the relevant essence grade. The wiki tracks the ranked family and alternate advance. Ch. 1396 gives a move that injures the practitioner and loses mortal Gu during failure after startup. | **Separate possession, upkeep, activation and refinement.** Bind actual Gu instances, controller, admissible essence, support and target. Track resource expenditure independently from magnitude, range and duration. Fusion changes the precursor custody and the output identity. Temporary cooperation spends activation resources and can saturate or fail by the local mechanism. Food, essence and refinement inputs are three distinct roles. Preserve physical harm and soul or mind harm as different consequences. [Chapter evidence and runtime catalogue](GU_AND_HOGWARTS_RULE_DERIVATION_2026-11-11.md#gu-rules) · [Four Flavors Liquor Worm wiki](https://reverend-insanity.fandom.com/wiki/Four_Flavors_Liquor_Worm) |
| **Potions** | *Half-Blood Prince* ch. 9 shows improved preparation of a taught potion. *Fantastic Beasts* records frozen eggs in Love Potions, mucus as a thickener and Glumbumble treacle against Alihotsy hysteria. *Mother of Learning* ch. 7 ¶160 and ch. 84 ¶78 establish ingredient-and-equipment alchemy without caster shaping. Ch. 9 ¶80 shows topical salve. Polyjuice's target identity enters at use through a sample, separate from brew quality. | **Separate making from delivery.** The recipe supplies forms, operations and stages. A finished bottle can carry multiple properties. Actual delivery binds dose, route, target, current condition and timing, and produces an observed response. Knowledge of an alternate method can save effort when it achieves the relevant state. The potion's recipient and source identity, where relevant, need their own records. [Potion evidence and tested cross-world workings](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md) · [Lexicon on egg and rose evidence](https://www.hp-lexicon.org/magic/love-potion/) · [Held Cyoria reader](novels/mother-of-learning/readers-2026-10-10/MAGIC_SYSTEM.md#38-alchemy-and-potions) |
| **Chemistry** | Rate depends on reactant identity, contact or particle size, temperature, concentration and catalytic pathway. A catalyst changes the pathway and rate. Reversible reactions can have active forward and reverse processes at equilibrium. Separation processes distinguish streams by properties and can involve stages. | **Separate reaction, transport and partition.** A method can change how fast material becomes available, change what it becomes, or distribute it into different streams. A physical ledger keeps input, retained catalyst, product, residue and losses in consistent units. A short wait and a fully settled mixture can yield different observations. A physical catalyst occupies a different role from a magical ingredient described as a catalyst that is actually consumed. [OpenStax kinetics](https://openstax.org/books/chemistry-2e/pages/12-2-factors-affecting-reaction-rates) · [Catalysis](https://openstax.org/books/chemistry-2e/pages/12-7-catalysis) · [Equilibrium](https://openstax.org/books/chemistry-2e/pages/13-1-chemical-equilibria) · [MIT separation processes](https://ocw.mit.edu/courses/10-32-separation-processes-spring-2005/pages/syllabus/) |
| **Engineering** | Mechanics relates load, geometry, material behavior and assembly. Changing the load path or cross-section changes the response even at equal material. The game's reed construct already has a measured carry capability, and a cloth sling changes whether the same parcel fits. | **Evaluate the assembly in use.** Track parts and their connections, support, geometry, load direction and duration, then test against the weakest relevant part or joint. Better material, a better shape, moving the load, or adding support can solve the same job through different changes. A powered stirrer changes how work is supplied. Tool wear and waste heat belong to the actual drive and mechanism. [MIT Mechanics & Materials I](https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/) · [Construct delivery proof](../gm/dispatch/creature-engine-2026-11-11/CHECKPOINT.md#construct-delivery-and-combined-verification) |

The same action word can name distinct processes. Feeding a sheep spends food on a living animal. Feeding primeval essence into a Gu activation supplies power under a specific world law. Feeding liquid into a filter moves inventory through a device. The shared editor can display the action and bind its roles. Each resolver must say where the input went and what changed.

## Shared rules that survived the comparison

1. **Record identity where a later operation reads it.** A sample donor, an individual Gu, a trained animal and a serialised machine part all carry history. A pool of equivalent water portions can use counts. A tag can make a candidate discoverable or describe a measured property, while an operation still needs the actual quantity, current form or identity it reads.
2. **Bind the working to actual means.** Keep input roles, tool condition, station, attention, time and energy in the quote. Let the host reserve and commit them. Permit substitution by demonstrated function in the local law. A skilled maker can diagnose a missing intermediate, choose a better operation or finish with less waste. Additional power helps when a mechanism can accept that power and turn it into the needed work.
3. **Settle stages and keep what they leave behind.** A deadline can describe a stable batch, an injury check, a developing egg or a Gu start that has already spent support. The host keeps the clock, custody and paid stage. The local resolver decides what can be interrupted, reversed, salvaged or has already changed irreversibly. Track physical mass, currency, usable energy and identity independently.
4. **Send outputs to a real consumer.** A thicker liquid changes agitation only when the tool reads viscosity. A cloth sling changes carrying only when the assembly measures support and geometry. An available feed stock supports a population only when the habitat and species actually read it. A delivered compound changes the target through its dose law and current condition.
5. **Record observation separately from the result.** Keep control conditions, route, witness and what changed. A hidden constituent or a zero net symptom can have several explanations. Preserve source claims, player knowledge, inferred mechanisms and tuned values separately so each can change with new evidence.

Existing owners already express parts of this. [Craft working](../../src/craft_working.js) binds operations and held stock, [craft resolver](../../src/craft_resolver.js) tracks composition, [craft state](../../src/craft_state.js) retains witnesses, and [creature methods](../../src/creature_methods.js) binds roles and capability measurements. [Creature lifecycle](../../src/creature_lifecycle.js), [Gu refinement](../../src/gu_refinement.js), [Gu fuel](../../src/gu_fuel.js), [agitation](../../src/craft_agitation.js) and [gear work](../../src/gear_work.js) resolve different domains. Share a small operation and settlement contract where these owners have the same needs. Keep their units and state transitions with the appropriate owner.

## Experiments to distinguish the proposed rules

| ID | Controlled change | Predicted observation and decision |
| --- | --- | --- |
| RR1 | Same species, starting count and enclosure. Remove the prey cohort or change access to food. | The predator outcome changes when the local law reads actual food. Surplus capacity alone cannot account for the difference. The Village copse already gives an adjacent played comparison where taking one rabbit changes the next fox count. The ch. 826 ecology chain remains its own unbuilt book-world candidate. |
| RR2 | Same target and Moonlight instance. Compare no support, one Little Light, two Little Lights, and refined Moonglow. | The chapter-derived attack-power comparison is 1, 2, 2, 3 relative to the base. Record costs and range separately. In the saturation row, an extra support can still cost essence. Permanent refinement changes the available Gu, whereas support can be detached from a later cast. |
| RR3 | Move steeping ahead of extraction in Hogwarts and Cyoria, then try one corrective steep after extraction. | The existing batch probe recovered the Hogwarts output after the second steep. Cyoria still failed because the original leaf had already become waste. An explanation should name the intermediate or loss the player can inspect. [Existing comparison](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md#pc10-one-batch-several-uses-and-local-laws-for-the-same-operation) |
| RR4 | Hold leaf and press force fixed, change only mesh. Compare liquid, wet cake, dried cake and a surface with a measured wet residue. | Different fractions reach the salve and the pad. A shared surface reader can try an ordinary cloth and the dried cake by their capacity. Retain the contamination in the used pad. This is the next cross-domain test because both the intermediate and the second use can be observed and conserved. [Mesh comparison proposal](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md#pc9-discovery-from-a-byproduct-with-a-mesh-comparison) |
| RR5 | Keep the same cloth and parcel. Move its attachment or spread the same weight across another support. | The actual assembly changes how the load reaches each attachment. Compare sag, wear or refusal at the changed point. The existing sling proof establishes a capacity reader. Geometry-sensitive joints and wear remain proposals. |

### Where the shared shape strains

A Gu living in a host could be an individual with food and custody, a controlled instrument in a cooperative move, and a material lost during a failed fusion. The same instance can cross those roles. Keep its identity and reservation in one owner so it cannot be fed, moved or consumed twice. Let each domain own its applicable transition. A staged failure can spend material and injure a person before the intended effect arrives. A single final recipe debit would miss those changes.

A sealed still can retain vapour and condensate across repeated cycles while a magical donor identity follows one fraction. Use a local staged stream resolver with its own paid vessel, capacity, retention, losses and trace. The host can still ask what it reserved, what changed, what is collectible and what the player witnessed. A net composition alone loses information needed to repeat or diagnose the working.

## Disposition and evidence

- **ACT NOW:** compared held *Reverend Insanity* EPUB ch. 70, 121 and 826 with the existing book-derived records and checked the wiki and real-world anchors above. For Hogwarts and Cyoria this pass used the held-source evidence records and reader. No complete new book sweep is claimed. The existing source owners remain the place to add identities, aliases and chapter observations.
- **ACCOUNT FOR NOW:** keep a versioned record of the operation, bound roles, actual local law, costs, retained outputs and witnessed effect. Test a one-variable change, a failed or interrupted attempt and a legitimate alternate method. Preserve the existing world and save owners.
- **LATER:** RR4, medium making and surface runtime, is the first proposed test. Done when changing the mesh changes the actual salve output and surface residue, and the remaining stock and contamination survive save/import. RR5 is a separate medium engineering test with the same parcel and a changed connection. The mixed-dose comparison is a separate medium body-resolution test, with healthy and pre-exposed recipients and a saved application trace.

Verification this pass: `node --test tests/creature_lifecycle.test.js tests/creature_methods.test.js tests/gu_refinement.test.js tests/potion_workings.test.js tests/craft_engine.test.js tests/craft_agitation.test.js tests/gear_workshop.test.js` passed 80 tests. This is focused evidence for existing behavior. The proposed cross-domain experiments have no new runtime or browser proof.

## Round 2. Counterexamples, interacting rules, scaling, and sharing

The [potion board's PC12](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md#pc12-distinguishing-a-rule-from-a-useful-instruction) owns the proposed Cure for Boils scene. This round adds actual resolver probes and describes how the same tests apply outside that scene. All numbers below are original game dial values, and all probes ran in Node.

| ID | Evidence and comparison | Design consequence |
| --- | --- | --- |
| **RR6. Test an explanation that can lose.** | Harry crushes the bean and changes the stirring sequence in *Half-Blood Prince* ch. 9. The scene and official bean guide support the preparation clue. In the current YAIR resolver, normal sequence gives 8 settled units with a crushed bean and 6 with a sliced one. Move the clockwise stir one position earlier and both yield 0. That separates extraction yield from a sequence-sensitive change in the model. It supplies no independent canon test of silver, and color and teacher assessment are different from administered potency. *Philosopher's Stone* ch. 8 offers another test with a reported failure: quills in an actively heated vessel, an equally hot vessel just removed from heat, and a cooler vessel. Match the base, quill lot and timing. If both equally hot vessels cause trouble, a temperature explanation survives. If only the fired vessel does, test heat flux and a flame-specific effect separately. A sugar rule is similarly scoped: Lupin reports it spoils Wolfsbane (HPPE035), and Xenophilius sweetens a Gurdyroot infusion (HPPE148). The ordinary sweetened serving establishes use, with no assay of the infusion's alleged efficacy. | Keep alternative explanations until a case distinguishes them. Give the player a fair control and an observable consequence. Physical contact and kinetics provide candidate mechanisms, and the book determines which relationships have source support. [Official bean guide](https://www.harrypotter.com/features/harry-potter-101-wizarding-plants) · [Cure for Boils scenes](https://www.hp-lexicon.org/magic/boil-cure-potion/) · [Gurdyroot Lexicon entry](https://www.hp-lexicon.org/thing/infusion-of-gurdyroot/) · [OpenStax reaction factors](https://openstax.org/books/chemistry-2e/pages/12-2-factors-affecting-reaction-rates) |
| **RR7. Improvement can have a downstream cost.** | In the staged thermal resolver, two equal loads start cooling at 90 on the authored scale. Halving the vessel heat-transfer coefficient leaves a reading of 62.5 after six seconds, compared with 45.8 for the reference. It also doubles warm-up time in this probe. The state belongs to the current thermal process. Passing heat from the vessel to the next batch is a proposed station hookup. Surface work has the same ownership issue. The current cauldron cleaner reads a combined condition. A coated coupon would need separate residue and coating state. The Canadian Conservation Institute documents how abrasion and chemical cleaning can damage thin finishes. | Before the next job, let the player read the station, wait, use another vessel, or choose a different operation. For the coupon, compare gentle removal, an aggressive wash and an untreated control on identical residue and coating. Record both residue lifted and coating removed. Test the subsequent stick or corrosion consequence through a real reader. Do not infer a damaged coating from a generic cleaning grade. [Thermal resolver](../../src/craft_process_thermal.js) · [Canadian Conservation Institute](https://www.canada.ca/en/conservation-institute/services/preventive-conservation/guidelines-collections/metal-objects.html) |
| **RR8. Repeat the aim under current means.** | Twelve gentle paddle strokes at viscosity 2 gave 100% homogeneity at mass 1 and 31.25% at mass 4 with reach fixed. Halving reach at mass 4 then gave 15.625%. Forty-eight strokes at mass 4 and full reach gave 100% for 57.6 stamina in the same model. These are whole-batch metrics. The current agitation model cannot tell what two distinct depths contain. Real tracer experiments motivate testing vessel geometry and mixing conditions with explicit probe positions. | Keep the witnessed reference setup and useful endpoint in the saved method. Rebind the actual load, reach, usable energy and vessel. If the current setup cannot plausibly reach the endpoint, pause at the affected step and offer a longer stir, suitable tool, or smaller batches. Keep committed fuel, prior wear and spent material. Offer two depth samples once there is a spatial reader, or use a whole-batch assay with the current model. [Agitation resolver](../../src/craft_agitation.js) · [Experimental tracer study](https://www.mdpi.com/2227-9717/13/4/1083) |
| **RR9. Share a claim and its conditions.** | The current notebook comparator marks an absent starting temperature as unknown when the next trial records it. It can show changed colors while reporting that the cause is unresolved. A brewer can observe froth, a breeder can record which offspring survived, and a mechanic can see wear on a joint. Each may infer a cause. A second operator needs the working, the recorded conditions, and the observation procedure to reproduce the result. | Preserve four distinct entries where applicable: original observation, attributed diagnosis, reproducible instruction, and independent repeat. A student can copy a method before testing it and keep the teacher's uncertainty attached. A breeder's seasonal trial needs the cohort, survival endpoint, diet and relevant habitat. A mechanic's trial needs the part, load direction, cycle count and inspection. If an entry lacks a condition that later matters, keep it unknown and give the next player a way to measure it. [Notebook comparator](../../src/craft_experiment_log.js) · [NIST experimental design](https://www.itl.nist.gov/div898/handbook/pri/section3/pri3.htm) |

**ACT NOW.** The Draught of Living Death preparation-by-order comparison, thermal cooldown, four paddle comparisons and notebook missing-condition behavior were run through existing functions. The four focused suites for Hogwarts workshop, HP brewing, thermal and agitation passed 59 tests. The proposed coupon, next-vessel heat carryover and shared notebook have no new runtime or browser proof in this pass.

**ACCOUNT FOR NOW.** Treat the result of one job as the starting condition for another when the receiving owner actually reads it. Give the player a chance to intervene before an irreversible step when there is evidence of a meaningful deviation. A committed stage can still resolve when the player chooses to proceed. Conditions inferred by a character stay attached to the evidence available to that character.

**LATER.** Pair RR6 and RR7 in one medium station-and-making slice. Done when matched hot and cooled trials distinguish retained temperature from active heating, the same method can pause at quill addition on a warm start, and save/import preserves the station and a single observation per attempt. RR8 can follow using the existing whole-batch agitation meter first. RR9 needs the notebook and knowledge owners to show one shared instruction and two attributed observations after reload.

## Round 3. Foundation before the next playable slices

The [potion and material-process contribution](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md#pc17-potion-and-material-process-foundation-map) maps the current owners, missing distinctions and three read-only pressure tests for the world-rules synthesis.

**ACT NOW.** The cauldron is the existing evidence for transfer and recovery. Its implementation preceded the direction to focus on foundations. It traces one substance through a source batch, lining, subsequent batch and wash. The [material-history receipt](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md#pc14-a-cauldron-with-material-history) gives the original dials and checks. This round is a design foundation. New playable consumers are future work.

### The common language

A **working** is a proposed change to something in the world. Its definition names roles, operations, requirements, and an intended observation. A **run** binds those roles to actual material lots, living individuals, equipment, energy sources, recipients, time and local law revisions. A **stage** changes the state it owns and records paid inputs, retained inputs, outputs, losses and risks. A **trial** records what was observable under the conditions of that run. A **method** carries the working, evidence and proven setup into another run. It can be taught, copied, revised or used as an automation template.

| Rule family | Reusable representation | Distinction that changes behavior |
| --- | --- | --- |
| Identity and custody | Stable reference, holder, location, portion, reservation, transfer and destination | Fungible water can pool. A donor sample, named animal or unique Gu keeps an identity. Portions can inherit lineage without duplicating the parent. |
| Material state and history | Measured amount, unit, phase or form, origin, preparation and retained history | Heat can change one precursor irreversibly. An old coating can change contact chemistry. A clean workpiece can have a damaged surface. |
| Living state | Individual or cohort, development stage, condition, prior exposure and ongoing needs | A cohort answers a population question. A named breeding parent or trained carrier needs individual state. Feeding, acclimation, training and control each affect different behaviors. |
| Stations and assemblies | Parts, interfaces, geometry, condition, contents, available support and applicable loads | A paddle’s reach and a bracket’s attachment differ from the material’s strength. A charged tool may change how energy enters the operation. A lining can retain history across otherwise identical jobs. |
| Matter movement | Input and destination quantities, retained streams, losses, splits, merges and residue | Absorption, filtration, washing, transport and delivery move matter. A used surface or waste jar can retain the removed material. The receiving system decides whether it can use what arrived. |
| Transformation | Local inputs and state transitions, phases, conditions, rates, reversible or irreversible outcomes | Extraction makes a fraction available, a reaction changes its form, and a catalyst can change the path. Local Gu refinement can also change identity and custody. A missing intermediate can remain available for recovery or become waste. |
| Energy, work and knowledge | Source, form, accessible rate, capacity, skills, control and cost | Mana, fuel, muscle, equipment and assistants can supply actual means when a local operation accepts them. Proficiency can improve diagnosis, reduce error or replace several steps with a supported alternative. Energy accounting and knowledge remain distinct. |
| Time and interaction | Stage clock, dwell time, overlap, order, delayed effects, interruption and aftermath | An active flame can differ from a hot vessel. Two effects in one dose can interact before symptoms appear. A machine can feed back into the environment of its living component. The local resolver declares which events are simultaneous. |
| Use and interpretation | Route, target baseline, delivered amount, measured outcome and relevant downstream state | A thickener affects a paddle when the agitation law reads viscosity. A salve reads skin and exposure. A modification of the user's body can open or close later actions through its actual affected capabilities. |
| Observation and repeat | Instrument, witness, sample, known conditions, uncertain diagnosis, method revision, independent repeat | Apparent sameness can hide an unmeasured condition. A copied note supplies instruction. A repeated trial supplies new evidence. Keep the past run under its original law and quote current conditions for the next. |

### What builders should be able to author

- **A new ingredient or equipment part** can reuse known material properties, with units, provenance and known tests. Adding a name or alias helps discovery. Adding a physical capability requires a receiving operation to read it.
- **A new operation** declares the input roles, which state it reads, how it accounts for output and what a person could observe. Put it in a data row when it fits an existing resolver. Add a domain resolver when the mechanics need new state such as recirculating vapour, developmental timing, load distribution or living control.
- **A new world** supplies its own materials, cost sources, admissible methods, reactions, exceptions and evidence. Give borrowed operations local definitions. A shared verb can have different consequences in different vessels or worlds.
- **A new use** binds a real target and an existing effect reader where one fits. It can use an unexpected byproduct if the property and route satisfy that reader. Teach the tested conditions through the notebook. Keep the search space open by recording why a candidate works or fails.
- **A refinement or repeat** compares multiple objectives such as yield, cost, time, reliability, stability and byproduct usefulness. A shorter method can preserve the needed result while sacrificing another measure. Repeat an observed endpoint using current inputs. Requote after material, equipment, maker or law changes.

Use existing owners for world truth, clocks, stock, bodies, living state and durable writes. A preview can calculate a consequence; admission reserves the actual means; settlement commits each paid stage once. A partially complete run can leave a changed vessel, creature, target or intermediate. Preserve that state through interruption and import. A new effect or property earns general support when there is a real reader and a case that could prove the proposed relationship wrong.

### How to evaluate additions before a build

An authoring entry should name the concrete entities, known book or real-world observation, a competing explanation, the proposed local rule, and a measured comparison. Include a failure, ordinary use, one changed variable and a test of which system owns the result. Check whether the same working can bind to a different tool, scale or operator and whether an interrupted run still accounts for stock. A mechanic can start with a short table and executable resolver probes. Native and save proof become relevant when it is selected for play.

**ACCOUNT FOR NOW.** Prefer sharing role binding, quantities, stage settlement, and observation records. Use a small number of concrete law families with named boundaries. A broad outcome-per-recipe table speeds an initial catalogue but multiplies authorship when systems interact. A single general-purpose simulator can express more relations at the cost of making units, ownership and explanations harder to audit. One unusual alternative is an evidence-first authoring route: add observation pairs and let tooling suggest candidate links for review. A suggested link needs a source and a counterexample before it can act as a law.

**LATER.** Keep the next three candidate checks in the foundation plan until playable work is selected. A second material-history example can test a different lining and an actual consumer of the recovered wash. A living regulator can test reciprocal effects while preserving one creature identity and its needs. A Gu-assisted brace can test the same real load after removing one active support, using an ordinary backup without duplicating Gu custody. These are distinct pressure tests for the common language, with world-specific results.

## Round 4. Targeted reference absorption

**ACT NOW.** Reconciled the reference scouts against the owners below. Weibao requested targeted absorption, extensions beyond the reference mechanics, and more Paradise aspects. The build selections below are proposals. The [Paradise source cases](../worlds/paradise-hub/WORLD_BRIEF.md#crafting-through-paradise-laws) retain the chapter locators and their boundaries. The [reaction probe](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md#pc19-ordered-stages-and-reaction-cascades) reproduced a concrete difference on the primary tree. The earlier read-only passes ran 36 focused brew/dose/assembly/workshop tests and 30 focused assembly/identity/stored-working tests, with overlap in assembly. The coordinator's Red Fire and save/clock evidence remains at its own headless fixture scope. This round changes documentation.

**ACCOUNT FOR NOW.** The most useful reuse is at the level of algorithms, data shapes and tests. Keep the [shared working contract](../KERNEL_WORKING_CONTRACT.md), current clock, inventory, identity and effect settlement. MR29 already gives composition, fabrication, patterns and conserved identity distinct resolvers. Add a local operation when the same materials can act differently because of a technique, carrier, authority, recipient or world condition. Keep the actual mechanism separate from what a character believes about it.

| Proposal | Reference and what to reuse | OOPS owner, remaining gap and smallest check |
| --- | --- | --- |
| **TA1 · Potion reactions and delivery** | [SS14 chemistry](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/Content.Shared/Chemistry/Reaction/ChemicalReactionSystem.cs) offers candidate rechecks and bounded continuation. [OpenMW alchemy](https://github.com/OpenMW/openmw/blob/fd3477688f147f539dd176535d692d5fc928b673/apps/openmw/mwmechanics/alchemy.cpp) distinguishes effects that are present from effects the brewer can identify, and apparatus changes different effects. | Extend [brew settlement](../../src/brew_law.js) under PC19 where a source warrants a cascade. Use the [trial log](../../src/craft_experiment_log.js) to show the actual setup, cues and recipient response. Medium. Prove the same batch yields different observations for observers with different evidence. Use the existing [dose proof](../../tests/brew_body_delivery.test.js) for preparation, administration and recovery boundaries. |
| **TA2 · Fabrication, unfinished work and flow** | [Cataclysm DDA](https://github.com/CleverRaven/Cataclysm-DDA/blob/feb2e6336fb5233b71622f51a45b81efbf1a7f74/doc/JSON/ITEM_CRAFT_AND_DISASSEMBLY.md#L297) preserves paid charges on interrupted crafts. [Vintage Story](https://github.com/anegostudios/vssurvivalmod/blob/849fa8cad9e392368566efc7474e73db6404a145/BlockEntity/BEAnvil.cs) preserves the shape and temperature of a workpiece. [Factorio](https://lua-api.factorio.com/latest/prototypes/RecipePrototype.html#results) exposes multiple outputs and separate productivity accounting. | Use the [fabrication law](../../src/craft_assembly.js), [separation](../../src/craft_process_separation.js) and the world clock. Existing cases cover retained matter, rerouting residue and separate fit/load failures. Medium. Remove the tool after one paid step and restore, then compare rework, cancellation and salvage. A second consumer draws from the material the first leaves behind. |
| **TA3 · Care, inheritance and Gu combat** | [Pokémon picnic care](https://press.pokemon.com/en-NZ/NEW-POKEMON-PICNICS-AND-MORE-REVEALED-FOR-THE-POKMON-SCARLET-AND-POKE), [Sword/Shield inheritance](https://www.pokemon.com/us/strategy/train-raid-and-hatch-pokemon-to-breed-victories-in-pokemon-sword-and-pokemon-shield) and [Essentials Day Care](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/012_Overworld/007_Overworld_DayCare.rb) give distinct models of care, selection and reproduction. [Showdown Pledge](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/data/moves.ts#L7581) turns a coordinated action into a condition that affects later decisions. | Use [lifecycle](../../src/creature_lifecycle.js), [cooperation](../../src/gu_cooperation.js), [refinement](../../src/gu_refinement.js) and [move search and archive](../../src/gu_move_generation.js). Small. Compare the same Insight Moth fed or hungry with the same visitor and agreement. Next, prove selected offspring through a fleece harvest and a refined Gu trait through a cast. Medium. In the existing Red Fire case, compare one and two impacts against a finite guard and record which later action changes. Search integration and live combat remain open. |
| **TA4 · Spell targeting and construction** | [Ars Nouveau](https://github.com/baileyholl/Ars-Nouveau/blob/fa9fd3ea2bd30572294a6fe9c8fa2dd051865dbf/src/main/java/com/hollingsworth/arsnouveau/api/spell/SpellResolver.java#L181) resolves ordered effects against an impact result with local augments. [Noita's public simulator](https://github.com/salinecitrine/noita-wand-simulator/blob/043f568ff2af6069a46032764735805a4f326a12/src/app/calc/gun.ts#L408) models separate world-contact, timer and projectile-death triggers. [Showdown](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/sim/battle.ts#L2453) distinguishes tracking an individual from resolving a position. [D&D 2024](https://www.dndbeyond.com/sources/dnd/br-2024/spells#Targets) separates target category and clear path. | Use [spell workings](../../src/spell_working.js), [stored workings](../../src/stored_working.js) and [working interaction](../../src/kernel_meet.js). Medium. In the existing Disarm case, close a link between quote and release, then compare a position ward with an open link. For construction, restore an armed ward with one payload. The trigger should resolve against the actual contact, once. |
| **TA5 · Repetition, research and scarce stations** | [Potion Craft](https://store.steampowered.com/news/app/1210320/view/4490747434954130577) saves successful routes, [EVE](https://support.eveonline.com/hc/en-us/articles/203269951-Blueprints) separates time and material efficiency, [Potionomics source notes](potionomics/MECHANICS.md) separate fit, potency, side traits and value, and [SimPy](https://simpy.readthedocs.io/en/4.1.2/topical_guides/resources.html) supplies explicit queues and interruption. | Use the [experiment log](../../src/craft_experiment_log.js) and [engine records](../../src/engine_records.js). Small to medium. Two jobs want the same furnace as it frees. Minute steps, a jump and restore agree on who gets it and on payments. Then compare two saved procedures that reach the same usable dose with different time and waste. Requote current inputs and tools when repeating. |
| **TA6 · Conceptual making and provenance** | [Paradise RP-M1–M6](../worlds/paradise-hub/WORLD_BRIEF.md#crafting-through-paradise-laws) cover sacrificed capabilities, made substitutes, powered assemblies and certification. [Zelda Fuse](https://www.nintendo.com/jp/zelda/totk/guide/en/index.html) demonstrates a magical join with a downstream use. [Botania](https://botaniamod.net/lexicon.html) demonstrates a station catalyst that changes which infusion can occur. | Use [identity](../../src/kernel_identity.js), fabrication, [oaths](../../src/kernel_oath.js) and stored workings. Medium. First prove RP-M1. As a distinct original experiment, bind repair to the actual broken fragment's lineage. An equivalent replacement can fit by ordinary work. The historical repair follows the original fragment through a route the local law can reach. Test identity, reach, alternate replacement and what happens if the relationship is broken. |

**Code reuse decision.** Keep OOPS's runtime owners. SS14's candidate recheck is the strongest potential direct excerpt. Showdown's target resolution is a good test reference, with a small excerpt only if it fits the OOPS target contract. Both are MIT and require their notices for copies or substantial portions. SimPy 4.1.2 is MIT and useful as a scheduling comparison. For the rest, reproduce the desired behavior in the OOPS owners. OpenMW is GPLv3, Cataclysm DDA's main license is CC BY-SA 3.0, the inspected Essentials revision is CC BY-NC-SA 4.0, and Ars Nouveau declares LGPLv3 for code and reserves its models and textures. Vintage Story has proprietary mod-specific terms, Botania has custom terms, and the inspected Noita simulator had no located reuse license and generates code from game Lua. Commercial-game documentation and the Paradise text supply behavior references. [SS14](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/LICENSE.TXT) · [Showdown](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/LICENSE) · [SimPy](https://simpy.readthedocs.io/en/4.1.2/about/license.html) · [OpenMW](https://github.com/OpenMW/openmw/blob/fd3477688f147f539dd176535d692d5fc928b673/LICENSE) · [DDA](https://github.com/CleverRaven/Cataclysm-DDA/blob/feb2e6336fb5233b71622f51a45b81efbf1a7f74/LICENSE.txt) · [Essentials](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/LICENSE) · [Ars Nouveau](https://github.com/baileyholl/Ars-Nouveau/blob/fa9fd3ea2bd30572294a6fe9c8fa2dd051865dbf/README.md) · [Vintage Story](https://github.com/anegostudios/vssurvivalmod/blob/849fa8cad9e392368566efc7474e73db6404a145/license.txt) · [Botania](https://github.com/VazkiiMods/Botania/blob/1.20.x/LICENSE.txt)

**LATER / DELEGATE.** First pair TA1 with RP-M1 in the existing canon-first foundation order. The brew proves what can emerge from an interaction, and the weapon proves what can transfer between individuals. Each is a medium-effort systems fixture with an independent expected outcome and a real downstream reader. TA5's furnace comparison is a small independent check of the shared scheduler. Expand to goal-based search only after the chosen cases settle against real stock, effects and timing. Source details, live integration and further play remain scoped in the respective owners. This round neither changes the current build order nor asserts wider source coverage.

## Round 5. Pinned engine intake and Arcryox cascade

**ACT NOW.** PC19's current ordering counterexample comes from using one pass for two different meanings. Hogwarts' Draught has a documented stirring operation after addition (B6 ch. 9). The blended-antidote lesson (B6 ch. 18) establishes combined action and an added ingredient, with no established automatic continuation. Keep both staged. Space Station 14 supplies an independent, source-defined automatic reaction: one part Inaprovaline and one part Dylovene produce two parts Tricordrazine. Each part can bind one part each of Lithium and Cryoxadone at 370 K or above to make three parts Arcryox. The fixture starts with those four measured lots. There is no catalyst in these two reactions. Heat is the missing-context comparison. This establishes an external-source case at headless scope, with no Hogwarts or LOTM ledger credit. [Pinned recipe rows, Tricordrazine](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/Resources/Prototypes/Recipes/Reactions/medicine.yml#L233-L241) · [Arcryox](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/Resources/Prototypes/Recipes/Reactions/medicine.yml#L620-L631)

| Rank | Pinned behavior and reuse | OOPS owner and decision |
| --- | --- | --- |
| **TA7 · Potions and chemistry** | SS14, `29547cc8705034c145ff7e4d4f6fb85f0f3d0e75`, MIT, Space Wizards Federation. `UpdateChemicals` invokes reactions when the caller requests processing and the solution can react. Successful addition and changed temperature use that path. Each pass fires the first eligible sorted candidate, then adds candidates keyed by its products. Eligibility rechecks temperature, mixer categories, cancellation event, stock and stoichiometry. A catalyst is held and counts toward presence (and a minimum quantity for quantized reactions). Priority breaks first, then fewer product species, then ordinal ID. SS14 logs after twenty firings and keeps its solution. [Trigger](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/Content.Shared/Chemistry/EntitySystems/SharedSolutionContainerSystem.cs#L395-L407) · [Reaction engine](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/Content.Shared/Chemistry/Reaction/ChemicalReactionSystem.cs#L98-L291) · [Ordering](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/Content.Shared/Chemistry/Reaction/ReactionPrototype.cs#L106-L121) | **Adapted.** [Brew law](../../src/brew_law.js) adds an explicit `cascade` operation on the existing K clock, binding and matter ledger. It rescans the small declared set after each firing and reads the current vessel thermal state or advances the batch's retained thermal state. Give competing rows distinct priorities when their outcome matters. Equal priorities sort by ordinal ID for reproducibility. The local firing budget interrupts atomically when work remains, retaining the last settled step. These are OOPS choices. The existing `react` operation retains its pass, rates and catalyst tags. Additional SS14 triggers, catalyst quantities, reaction heat and effects belong to future cases that need them. |
| **TA8 · Creatures and genetics** | OpenMendel MendelGeneDropping, `552cce6a46dd26ac1e50a4682bfaceae184008b1`, MIT (OpenMendel). Select one parental chromosome copy and carry it through ordered loci. A crossover switches copy at a declared interval. The gene-drop output can retain founder origin. Julia's pedigree and stochastic machinery are too broad for a direct port. [Transmission](https://github.com/OpenMendel/MendelGeneDropping.jl/blob/552cce6a46dd26ac1e50a4682bfaceae184008b1/src/MendelGeneDropping.jl#L250-L346) · [License](https://github.com/OpenMendel/MendelGeneDropping.jl/blob/552cce6a46dd26ac1e50a4682bfaceae184008b1/LICENSE) | **Trial after the identity and draw-key fold.** [Heredity](../../src/heredity.js) already has two alleles, dominance, incomplete expression, mutation, hidden carriers and polygenic breeding values with environmental variation. Its locus draws are independent, and cohort counts lose phase. A genome with an authored linkage map would add behavior. Test coupled and repulsion-phase parents at zero crossover and an addressed nonzero crossover rate. Verify phase through the lifecycle and save, and let [meadow fleece](../../src/meadow_fleece.js) read the expressed trait. Decide how a cohort retains linked haplotype counts when it matters, and keep unknown phase explicit on earlier records. Linkage, pleiotropy, and inbreeding are distinct mechanisms. This is a later scoped trial, with no new genome or save field in this pass. |
| **TA9 · Fabrication and restart** | Cataclysm DDA, `feb2e6336fb5233b71622f51a45b81efbf1a7f74`, main work CC BY-SA 3.0 Unported with separate asset notices. An in-progress craft owns actual components. Replacement requirements compare required against surviving components. Step tools can debit in progress buckets. On interruption, recheck current-step providers, preserve paid charges and pause the passive deadline until requirements return. [Data contract](https://github.com/CleverRaven/Cataclysm-DDA/blob/feb2e6336fb5233b71622f51a45b81efbf1a7f74/doc/JSON/ITEM_CRAFT_AND_DISASSEMBLY.md#L275-L339) · [Craft implementation](https://github.com/CleverRaven/Cataclysm-DDA/blob/feb2e6336fb5233b71622f51a45b81efbf1a7f74/src/crafting.cpp#L2581-L2765) · [License](https://github.com/CleverRaven/Cataclysm-DDA/blob/feb2e6336fb5233b71622f51a45b81efbf1a7f74/LICENSE.txt) | **Adapt behavior.** [Process law](../../src/process_law.js) already has paid exposure and partial workpiece state. The [interrupted quench](../../tests/process_law.test.js) rescues a retained piece with a fresh operation. An unattended, partially paid *same* stage with provider loss is the next comparison. Use K's host, the existing cost owner and [fabrication](../../src/craft_assembly.js) for salvage. Prove distinct provider identity, exact charge delta and the same next result after restore. DDA's map/inventory and activity classes add little to that contract. |
| **TA10 · Contact and combat stats** | Pokémon Showdown, `965a535ef892d13cd68cf75c076db26f9f32842a`, MIT (Guangcong Luo and contributors). Target resolution can follow an active original individual or look up the current occupant of a slot under local retarget rules. DamagingHit is dispatched after damage and hit effects with generation-specific order relative to AfterHit. Rough Skin reads a separate contact check that Protective Pads can suppress. Stats independently combine species base, IV, EV, level and nature. [Targeting](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/sim/battle.ts#L2453-L2501) · [Contact](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/sim/battle.ts#L1303-L1312) · [Phases](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/sim/battle-actions.ts#L1128-L1188) · [Stat calculation](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/sim/battle.ts#L2361-L2386) · [License](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/LICENSE) | **Trial using existing owners.** [Spell working](../../src/spell_working.js), [stored working](../../src/stored_working.js) and [contest](../../src/contest.js) can compare the same actor after movement or replacement, then gate a reaction on actual contact. An item moving from a hand in Disarm earns a downstream proof when the next cast checks that same hand. For a documented IV-like stat in a specific world, keep the innate value, trained contribution and injury separate through the living-body reader and prove their effects in one contest or harvest. |
| **TA11 · Breeding inputs and local care** | Pokémon Essentials, `8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b`, CC BY-NC-SA 4.0. Its Day Care checks eligibility every 256 steps; species, egg group, gender and ownership affect compatibility. Egg generation starts from a fresh individual. Typically three distinct stat IVs are copied from parents, or five with Destiny Knot in the Gen 6+ mode. Power items fill slots before the sample. Ability, nature and moves have their own inheritance rules. Animalia, `5895f403fd43a9464e06b3675af3495f50565a3f`, MIT (ElCeejo), offers permissive source for a food-triggered readiness window, mate approach, proximity and cooldown. [Essentials IVs](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/012_Overworld/007_Overworld_DayCare.rb#L174-L214) · [Essentials license](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/LICENSE) · [Animalia care](https://github.com/ElCeejo/animalia/blob/5895f403fd43a9464e06b3675af3495f50565a3f/api/api.lua#L610-L674) · [Animalia breeding](https://github.com/ElCeejo/animalia/blob/5895f403fd43a9464e06b3675af3495f50565a3f/api/mob_ai.lua#L973-L1013) · [Animalia license](https://github.com/ElCeejo/animalia/blob/5895f403fd43a9464e06b3675af3495f50565a3f/LICENSE) | **Adapt behavior when needed.** An IV is a scalar inherited for selected stats under a world-specific rule. OOPS's diploid alleles and quantitative breeding values already handle other kinds of innate variation. Keep scoped inheritance aids in the local reproduction method, and use [lifecycle](../../src/creature_lifecycle.js), [needs and body](../../src/living_body.js) and [living workings](../../src/living_workings.js) for readiness and paid care. Animalia's nearest-mate and approach behavior adds a possible autonomous choice upstream of existing paired gestation. Its Luanti object timing and five-feed tuning have little fit. Test actual ration spend and accessible mate approach before a brood, and distinguish learned moves from innate inheritance. |

**Receipt, PC19 / PC95 / AD36 / AD38 / AD51 / AR3 / AR6 / AR11 / MR29–MR33.** Primary base `4d4505223bae7c097a3a1c833f195ea53f8d0e26`. The selected runtime and focused test file were clean before the edit. The dirty PC19 and Round 4 text supplied the design inputs. The coordinator checkout supplied read-only ownership and ordering context. The primary had inherited dirty dist/index, shared docs, and concurrent home and Fang Yuan changes. The build used the live primary inputs and wrote to a separate temporary output root. Change surface is one brew-law file, its existing test file, and this owner round with notice. Zero new runtime import edges, registrations or save keys. Adding `cascade` extends the saved method's operation vocabulary under the existing law reference. Previously authored `react` steps and saved meanings keep their prior semantics.

- **Kernel proof.** The hot trial admits 6,000, produces and bottles 6,000 Arcryox, and settles in two firings. Both declaration orders include a lower-priority competitor for the intermediate. With a colder or missing thermal read, 2,000 Tricordrazine and the 4,000 other inputs reach the flask with zero Arcryox. Too small a budget or a cycle interrupts after admission and keeps 6,000 in the vessel. Split advancement, one-jump settlement, JSON restore before and after settlement, and repeat settlement agree, including the debit effects.
- **Reader proof.** The Arcryox fixture reads the bottled constituent and the patient's actual temperature. A fixture adapter sends the existing effect host a vitality addition at 0°C (10 to 16) and sends no healing above it or without Arcryox. The SS14 source supplies the cold-body healing condition. Its bloodstream route, metabolic warming and separate brute/burn damage accounts are outside this fixture. The effect amount is authored. This fixture models effect landing after the brew's division and does not exercise stock-backed administration. Existing Hogwarts coverage separately shows the Draught reader consuming the proportion of `settled` in the transferred liquid and recovering responsiveness on the body clock. The blended-antidote reader consumes `floor(joint / 3)` in the phial cancellation rule. [SS14 reagent effect](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/Resources/Prototypes/Reagents/medicine.yml#L1393-L1412) · [Draught reader](../../src/world_packs/hp_potion_case_scenes.js) · [Antidote reader](../../src/hp_potion_reactions.js)
- **Checks.** `node --test tests/{brew_law,brew_body_delivery,hp_potion_case_scenes,hogwarts_potion_workshop,brew_grammar_layers,brew_regulated_humidity,gu_brew_regulator,process_law,craft_assembly,breeding_program}.test.js` returned 64 pass and 3 existing breeding skips. The 240-case pre-law Draught golden comparison passed inside that run. `npm run check:arch`, `npm run check:coverage`, and `npm run check:rules` exited 0. Rules reported warnings in the existing Hogwarts exam time code and a private-pack path glob. `npm run check:docs` reported a single hit in the separate dirty W18 seam note at line 29. All 14 local links in this round resolve, and the license notice matches the pinned text. `BUILD_OUT=<temporary directory> npm run build` passed with one duplicate-key warning in `src/travel_legs.js` and bundle SHA-256 `9e917a913b852b5937bfc26248214460c0faf205048ff5d2c9621a6c1b1d56ed`. Full suite is the committer gate. PC95 defers browser, game save and game integration. Agent-verified at fixture scope. Human review is open.
- **LATER.** Use the next verified canon demand before declaring another local cascade. An in-game dose needs a real lot debit and a one-time recipient transaction with the shared host. For genetics, start at E11/E12 identity and seed parity, then pick the source case that changes an actual harvest, task or contest. TA8's linked transmission and TA11's selected IV copying answer different cases.

### Space Station 14 notice for the two transcribed fixture recipe rows

[Pinned license](https://github.com/space-wizards/space-station-14/blob/29547cc8705034c145ff7e4d4f6fb85f0f3d0e75/LICENSE.TXT). The OOPS cascade code is independently expressed. The two test recipe rows transcribe the reagent relationships and threshold.

```text
MIT License

Copyright (c) 2017-2026 Space Wizards Federation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

## Round 6. Optional creature genetics and harvest proof

**ACT NOW.** Weibao requested linked inheritance first, Pokémon-style IVs where they fit, and a headless proof with a real harvest or ability. Under PC95, GN1–GN9, AD38, AD51 and AR3/AR6, the Village trial runs the existing creature lifecycle, meadow shear resolver and engine stock settlement. The genome opts into a chromosome map and a separate IV rule. The ordinary Village genome and existing meadow action callers retain their prior behavior.

| Checklist | State and activation |
| --- | --- |
| Diploid loci, dominance, incomplete expression, mutation and hidden carriers | **Existing.** The genome declares loci, expression conditions and mutagen response. Keepers learn through the existing knowledge operations. |
| Polygenic breeding values, environmental variation and selection | **Headless verified.** Named individuals can be ranked by quantitative traits. Round 20 adds a saved visible-trait selection policy for phased cohorts, with twenty birth windows and an actual shearing outcome. The IV trial uses IVs for clip yield and leaves its polygenic yield model absent to avoid counting the same effect twice. |
| Linked loci and crossover | **Headless verified.** A genome declares ordered groups and interval rates. Each phased parent starts on one chromosome copy and can switch at an interval. This pass uses the ordinary diploid interval range of 0–500 per mille. Unknown-phase parents retain independent draws. The child's allele pairs are ordered by parent and become phased for later transmission under the declared map. Existing mutation and fickleness run after the copy choice. |
| Pokémon-style IVs | **Headless verified.** The genome chooses the stat list, range and number of distinct copied stats. Remaining stats are fresh addressed draws. The local reproduction method can change the copy count and name a guaranteed stat and parent within that count. The Village trial uses six 0–31 stats and copies three by default. Five and a guaranteed wool stat demonstrate the host option. Only wool yield has a consumer in this trial. |
| Hybrid, population and deeper genetics | **Headless verified.** Rounds 7–9 verify phased aggregation, epistasis and pedigree effects. Round 10 verifies pleiotropy, Round 18 verifies paid testing and the IV clasp, and Rounds 32–38 verify mixed genome maps, hybrid fertility, and tracked wild pedigrees. |

**Enable by data.** Genome rows opt into applicable mechanisms by declaring their parameters. A world can use several together when they explain different effects. A local method supplies actual breeding conditions and any paid inheritance aid. State stores the inherited result once and saves keep pending broods and born individuals. Existing unphased saves keep absent phase. A cross or an authored operation that needs an unbuilt behavior is a checklist gap until it has a source case and a consumer.

**Evidence.** With the same parents' allele counts and addressed draws, coupling-phase inheritance yields 5 Fine wool bundles. Independent transmission, reversed phase, unknown phase and the crossover control yield 5 Wool in their matched comparisons. The IV comparison keeps the child's genes identical. An authored conversion of one extra bundle per 10 wool IV points makes 28 yield 7 Fine wool and 31 yield 8. The engine stock balances round-trip, and the birth proof restores both parent and pending brood state before settlement. Shearing a child before maturity is refused. The headless fixture calls the existing shear resolver and applies its effects to engine stock. Production action custody, paid breeding aids and near/far lineage parity await integration.

**Provenance.** OpenMendel's pinned MIT implementation informed the copy-and-switch behavior. Pokémon Essentials' pinned CC BY-NC-SA implementation informed sampling distinct stat IDs, fresh remaining values and the guaranteed copy. OOPS expresses both algorithms independently. The selected loci, crossover rates, inheritance aids and yield curve are authored Village trial data. No external code or assets were copied. [OpenMendel transmission](https://github.com/OpenMendel/MendelGeneDropping.jl/blob/552cce6a46dd26ac1e50a4682bfaceae184008b1/src/MendelGeneDropping.jl#L315-L341) · [Essentials IVs](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/012_Overworld/007_Overworld_DayCare.rb#L174-L214)

**Verification on `4d4505223`.** `node --test tests/{heredity,breeding_program,habitat_care,creature_lifecycle,living_foundation,coverage_creatures}.test.js` passed 50 tests with 3 existing skips. `check:arch`, `check:rules`, `check:coverage` and the scoped diff check passed. The isolated build passed with the existing duplicate-key warning in `travel_legs.js` and bundle SHA-256 `49cfe5a38d1229355c30f50fef1d2cfd15df2041ef00e8c3cf46febddfdd5ce2`. It used the live shared checkout, including the earlier dirty brew changes and concurrent project edits. `check:docs` reports the existing W18 seam-note hit at line 29. Agent-verified headless fixture. Full suite remains the committer gate, and PC95 puts browser and game tie-in in the later phase.

## Round 7. Phased herds and gene interactions

Weibao requested a headless continuation through phase-aware cohorts, a checklist update and a comparison with Pokémon and other sources. GN1–GN9, E11/E12, PC95, AD38, AD51 and AR3/AR6 apply. This pass adds two optional behaviors in the existing heredity and lifecycle owners. The previous round's pending phase and epistasis entries advance as follows.

| Checklist | State and evidence |
| --- | --- |
| Phased herd counts | **Headless verified.** Count complete diploid profiles by genome ID. Simultaneously reversing both chromosome copies at every locus gives the same count bucket. Reversing just the fleece pair in a heterozygote changes the bucket. Drawing removes one complete profile and restores it on an individual. Returning interchangeable stock recredits that profile. Both transitions conserve headcount through save/restore. |
| Harvest after cohort promotion | **Headless verified.** Coupling and repulsion herds with equal marginal allele counts yield 5 Fine wool and 5 Wool respectively after acquisition, breeding, saved brood restore and shearing. The existing stock holder records the clip. |
| Epistasis | **Headless verified for suppression.** An optional genome row lets the carried strength of one locus suppress the expression of another. The trial's authored coat modifier keeps the fleece alleles at F/F and changes 7 Fine wool to 7 Wool. Evaluation uses underlying locus strengths, so rules have a defined result regardless of declaration order. |
| Individual identity and wild simulation | **Headless verified.** Return targets unheld interchangeable stock in its original herd. Creatures with pedigree, tests, care or other individual facts stay individual. A later draw gets a new identity. Round 53 binds promotion and demotion to E12 world holders. Round 54 publishes wild-clock births and losses on the bound holder. Round 55 settles tracked births and deaths on individual bodies with saved lineage. |
| Other genetics items | **Headless verified.** Round 9 exercises pedigree effects, Round 10 exercises pleiotropy across harvest and light, and Round 18 exercises a paid assay and a physical IV inheritance aid. |

**Representation and source comparison.** Legacy cohorts preserve per-locus totals. A pool of unpaired haplotypes would preserve linkage within each chromosome but could invent a new diploid pairing when an existing animal is drawn. Count the pair together instead. Cost scales with distinct profiles, and herds with many distinct profiles may need a different representation once there is a measured workload. tskit groups genome nodes under individuals and preserves exact ancestry with node and edge tables. Its MIT implementation is a useful reference for pairing and a possible future pedigree backend. OpenMendel's chromosome transmission fits the existing brood law. Pokémon Essentials' individual stat inheritance remains useful for IVs and does not provide a phased herd model. SLiM's GPLv3 fitness and mutation callbacks are a comparison for richer interactions. This first epistasis rule needs only a small data row and the existing expression resolver. No external code was copied. [tskit data model](https://github.com/tskit-dev/tskit/blob/ab1134eb5c4bf1b7a473174fe0717a5ebb697030/docs/data-model.md#L49-L63) · [tskit MIT license](https://github.com/tskit-dev/tskit/blob/ab1134eb5c4bf1b7a473174fe0717a5ebb697030/LICENSE) · [OpenMendel transmission](https://github.com/OpenMendel/MendelGeneDropping.jl/blob/552cce6a46dd26ac1e50a4682bfaceae184008b1/src/MendelGeneDropping.jl#L315-L341) · [Essentials IVs](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/012_Overworld/007_Overworld_DayCare.rb#L174-L214) · [SLiM callbacks](https://github.com/MesserLab/SLiM/blob/b7d413da3b8c880645c2bf5b367cf686a4366d8d/core/slim_eidos_block.cpp#L393-L458) · [SLiM license](https://github.com/MesserLab/SLiM/blob/b7d413da3b8c880645c2bf5b367cf686a4366d8d/LICENSE)

**Compatibility.** Old herd saves still restore with their original count or marginal-allele representation. Populating a phased ledger requires actual ordered profiles. Promotion uses the existing addressed draw and the lifecycle stock owner. Cohort profile validation rejects missing headcount, duplicates and mixed locus sets. Each cohort uses its declared genome ID. If its genetic schema changes, the world must give the schema a different genome ID. The headless route changes the lifecycle and heredity seams, with no new registry or game route.

**Verification on `4d4505223`.** A temporary tracked-source archive overlaid with both genetics rounds passed `node --test tests/{heredity,breeding_program,habitat_care,creature_lifecycle,living_foundation,coverage_creatures,holder_lifecycle}.test.js` with 61 passes and 3 existing skips. `npm run check:coverage` passed there. In the live checkout the same command had 60 passes, 3 skips and 1 creature coverage failure. The live coverage command reported 17 reachable-case classifications changed by concurrent game wiring. The live `check:arch` and `check:rules` passed. The live isolated-output build passed with its existing duplicate-key warning and bundle SHA-256 `98a6ca021e73dde43e722382bcbbc3e3e32203e6575bd0fb0fd9338d8aef3aa9`. The docs lint still points to the separate W18 seam note, line 29. Scoped diff check passed. Agent-verified headless fixtures. Full suite and game integration remain open.

## Round 8. Automatic phased herd turnover

**Checklist update, headless verified.** GN8, E11/E12, KW5, PC95 and AR3/AR6. The [wild habitat clock](../../src/creature_lifecycle.js) now settles losses by drawing whole profiles without replacement. The remaining cohort supplies the parent pool for that window. For each birth, two distinct members are sampled from that pool and the [existing inheritance law](../../src/heredity.js) settles linkage, crossover and mutation. New profiles join the pool for the next window. The local policy supplies the linked genome, draw root and optional mutation exposure. The draw address includes habitat, cohort, absolute window, event kind and event index. The world can later provide a different mating or mortality law when its cases need one. This proof uses neutral sampling and two-parent reproduction, with no named animal or individual IVs generated by the far clock.

**Proof.** The [fixture](../../tests/heredity.test.js) starts four animals in each of two herds with identical marginal allele totals and different phase. Two capacity-driven losses and four births leave six each. One jump and two stepped windows agree for both phases, with JSON restore between windows and before acquisition. All twelve draws retain their herd's coat/fleece linkage. The shear resolver yields three fine clips in the coupling herd and zero in the repulsion herd. A sole survivor does not breed and an extinct herd stays empty. Legacy marginal cohorts continue through their original path. Remaining items include mixed genome maps, E12 world-holder integration, pedigree-aware wild mating, phased bulk-event performance, pleiotropy, paid tests and physical breeding aids. Round 9 advances inbreeding for individually tracked pedigrees.

**Verification.** Tracked-source archive of `4d4505223` overlaid with the three genetics rounds. The seven-file focused command from Round 7 passed 62 tests with 3 existing skips. `check:arch`, `check:coverage` and an isolated-output build passed. Bundle SHA-256 `ebcbc8a295391c475b3f3ed9fc6c02d2fd125ec92b0492862197e50cc19962c1`, with the existing duplicate-key build warning. The live rules check exited 0 with warnings in the shared checkout. Scoped diff check passed. Full suite and game tie-in remain open.

## Round 9. Pedigree effects at breeding

**ACT NOW.** AD38, AD51, AD56, GN8 and PC95. The named-creature brood path can opt into an authored maturity effect with `genome.inbreeding.growthMinutesAtFull`. It derives the offspring's coefficient from the parents' saved pedigree using the existing kinship calculation. The brood saves the adjusted growth interval and birth commits the resulting maturity time. The headless test follows actual births, reloads the pending brood and child, then calls the existing shear resolver. Full siblings score 0.25 and their offspring takes 10 extra minutes to reach its first possible clip. An unrelated cross and the same sibling cross with the rule absent can shear at the base time. The same fine-fleece genotype yields the same five bundles once mature. The effect is an authored example. The coefficient follows the pedigree relationship; the growth response is a world choice. [Wright's coefficients](https://www.journals.uchicago.edu/doi/10.1086/279872)

| Checklist | State and boundary |
| --- | --- |
| Named pedigree affects breeding | **Headless verified.** Both crosses can settle. Growth delay is configured per genome and frozen at brood start. |
| Existing and ordinary content | **Opt-in.** No active genome receives a new rule in this pass. Saved pedigrees with unknown ancestors supply no known kinship for those branches. The reused calculation has a six-step depth budget. |
| Wild mating by pedigree | **Headless verified for tracked wild individuals.** Rounds 35–37 use saved parentage to choose mates within and across compatible herds and preserve ancestry through losses. Anonymous phased profiles still carry chromosome pairs and fertility. |
| Other genetics readers | **Headless verified in the meadow.** Round 10 verifies pleiotropy across harvest and an ability. Round 18 verifies a paid test and breeding aid. Additional readers can attach where a world has an authored effect. |

**ACCOUNT FOR NOW.** The additional rule earns its cost when pairing gives the player a choice they can act on, such as selecting a mate or planning the next clip. Routine husbandry can use the existing care and harvest clocks with the new rule absent. Full pedigree simulation for anonymous herds would trade compact counts for ancestry and bookkeeping before a consumer needs it. A lower-cost option for a world with a named breeding program is to retain the breeding individuals and their ancestors while the rest of the herd stays in profiles.

**Evidence and follow-through.** The [pedigree knowledge test](../../tests/knowledge_pedigree.test.js) proves that a witnessed birth and an authenticated birth record can establish a parent edge for the keeper who has that evidence. Hearsay and unobserved parentage stay out of the keeper's ancestry view. Round 143 uses those edges to estimate the juvenile growth delay and checks the estimate against a saved brood's first eligible clip. Round 144 uses the same evidence to qualify an ancestral Lantern cue.

**Verification.** The Round 8 tracked-source archive of `4d4505223`, refreshed with the current genetics changes, passed the same seven-file command with 63 passes and 3 existing skips. Architecture and coverage passed. The isolated-output build passed with the inherited duplicate-key warning and bundle SHA-256 `0cd453d4628636690ebb3b8dbdbe4b1ee81f17f2977453d5d4b32e282486237e`. Scoped diff check passed. Headless fixture verified. Game integration and full suite remain open.

## Round 10. One magical coat, two uses

**ACT NOW.** Pleiotropy is headless verified under GN1–GN2, PC95, AD38 and AD51. The original [Lantern Fleece line](../../src/world_packs/meadow_lantern_fleece.js) gives the existing incomplete-dominance coat locus two optional contributions per expressed level. The [shearing method](../../src/meadow_fleece.js) credits two extra fleece bundles. The creature's flash working spends one stored charge and adds four units of keyed light to its place for two engine minutes. Both readers use the same expressed locus. The fixture breeds lambs with matching other loci, reloads the brood, and compares D/d with d/d. It produces seven versus five Fine wool bundles and four versus zero light. The unexpressed and empty-charge cases leave their reserves untouched. Pending flash and active glow both restore. The fade uses a second step on the same clock and removes that flash's contribution. This line is exercised by the headless fixture. Ordinary Village stock and action callers retain their existing rows.

| Checklist | State and next proof |
| --- | --- |
| Pleiotropy, multiple readers | **Headless verified.** One inherited and expressed locus affects actual harvested stock and a paid creature working. The local genome opts in by declaring named contributions. |
| Magical physiology | **Headless verified.** The original coat flash spends a world quantity and fades on the engine clock. Round 11 verifies daylight charging, clipping and regrowth. Rounds 14 and 28–31 cover light-driven forage, a charge-consuming ward, and interruption cleanup. Round 134 follows the same harvest cycle after Gu repair. |
| Other genetics | Round 18 verifies paid tests and physical breeding aids. Rounds 32–34 verify mixed genome maps and viable sterile offspring in named broods and phased herds. Pedigree-aware wild mating still requires ancestry at the wild representation. |

**ACCOUNT FOR NOW.** A magical trait earns its complexity when the same thing does useful work in different contexts. The coat could act as a portable lamp on a route, or be clipped and used as a material. Harvesting a trait-bearing part can remove it from the creature and give the material its own identity. The next use should distinguish a creature's expressed trait, charge stored in its body, and the portion retained by the clip. A ward or counterspell can act on the effect or its carrier while the gene remains inherited.

**LATER.**

- **Charge, clip and regrow.** Implemented and verified in Round 11.
- **Magical expression and heritable change.** Round 93 verifies a spell revealing a carried trait for flash and harvest, with matched wet and dry broods after reload. Round 19 verifies an authored germline change that reaches later offspring and changes their harvest.
- **Lineage unlocks an ability, training changes its use.** Round 141 crosses matched inherited coats with keeper practice and proves a paid signal through reload. Rounds 68–69 verify injury, care and keeper changes on queued signals.

**Verification.** The Round 8 tracked-source archive of `4d4505223`, refreshed with the current genetics files and Lantern Fleece pack, passed the same seven-file focused command with 64 passes and 2 existing skips. Architecture and coverage passed. The isolated build passed with the inherited duplicate-key warning and bundle SHA-256 `14a691b03d6f773c8f5bfa7568388836464a42e7a48c3467e2f2cabac9739e82`. Scoped diff check passed. Game integration and full suite remain open.

## Round 11. Daylight, clipping and regrowth

**ACT NOW.** The opt-in [Lantern Fleece pack](../../src/world_packs/meadow_lantern_fleece.js) reads actual place daylight from the sky pack. A mature D/d coat holds up to four units and gains one per daylight minute. Shearing uses the existing yield resolver, moves all remaining coat charge into the bound wool holder, and starts a four-minute regrowth period. The saved body keeps the same ID. At maturity of the new coat, charging resumes if daylight is present. These are original trial settings.

| Checklist | Evidence |
| --- | --- |
| Daylight charge | **Headless verified.** The reserve stays at zero before dawn. A jump and a dawn-boundary reload both fill the coat to four. |
| Charged harvest | **Headless verified.** The body flashes once, then shearing settles seven Fine wool and moves four units from body to wool. Save/restore before shearing retains the pending operation and the first pulse expires on schedule. |
| Regrow and flash again | **Headless verified.** Shearing and flashing during regrowth leave stock and charge intact. The reloaded body stays empty through the regrowth boundary, gains charge in daylight and spends one unit on a second pulse at dusk. Wool retains its four units. Reload during the second pulse preserves its expiry. |
| Next readers | **Headless verified.** Round 28 uses the actual clip to light a lamp and attract a forager. Round 29 proves interruption of a lamp and an active flash. Round 30 spends clip charge in a worn ward. Round 31 proves shade on a world path interrupts the animal's pulse and stops its recharge. |

**ACCOUNT FOR NOW.** Pokémon offers useful distinctions between ordinary growth, an event-triggered permanent form, and a change with a secondary output. Its official guide uses level, friendship, trade, time and held items in different combinations. Essentials implements separate callbacks for level-up, item use, trade and post-evolution effects. Its Shedinja branch checks party capacity and spends a Poké Ball. For OOPS, preserve the creature's identity, pedigree, custody and experience when the form changes. Resolve physical inputs and output capacity through existing owners. Keep temporary expression, learned moves, maturation and actual heritable change independently testable. No external code was copied. [Official Pokémon evolution guide](https://diamondpearl.pokemon.com/en-ca/trainersguide/fundamentals/raising/) · [Pinned Essentials trigger code](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/010_Data/001_Hardcoded%20data/007_Evolution.rb#L1-L59) · [Secondary output example](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/010_Data/001_Hardcoded%20data/007_Evolution.rb#L257-L275)

**Follow-through.**

- **Branch by means the player can arrange.** Rounds 12, 42–44 and 85 verify the paid, custody, bond and stature routes through saved outcomes on the same creature.
- **A molt can leave a useful thing behind.** Rounds 15–16, 62 and 138–140 verify a shed husk, finite awakening capacity, a transferable parcel and a distinct wisp that spends the inherited charge.
- **Temporary forms and inherited forms.** Rounds 13, 19, 25–26 and 84 verify reversion, germline change, learned-move retention and a temporary form's effect on gestation.

**Verification.** The Round 8 tracked-source archive of `4d4505223` with the current genetics overlays passed the seven-file focused run with 65 passes and 2 skips. Architecture, coverage, isolated build and scoped diff check passed. The build emitted the inherited duplicate-key warning. Bundle SHA-256 `14a691b03d6f773c8f5bfa7568388836464a42e7a48c3467e2f2cabac9739e82` matches Round 10 because the opt-in pack is outside the game entry. Full suite and game tie-in remain open.

## Round 12. Pokémon-style permanent evolution

**ACT NOW.** PC95, GN1–GN2, AR3/AR6, AD38 and AD51. The [evolution compiler](../../src/creature_evolution.js) expresses a world's routes as data on existing kernel workings. Growth, item, trade, battle and world-event trigger groups expose routes for their event owners to offer. Conditions can combine current bound properties, quantities, the world minute, threshold and relative comparisons, and membership such as a known move. The route applies a permanent form change to the existing body, spends declared stock and credits optional byproducts. It rechecks conditions and stock at settlement and groups stock by resolved holder. Alternate routes are authored separately and a route's source form prevents a stale repeat.

| Checklist | State and evidence |
| --- | --- |
| Same-creature permanent evolution | **Headless verified.** A bred Lantern Fleece animal molts in daylight with a charged coat, consuming one Sun Prism and producing one Lantern Husk. The same holder, references and other body fields persist. The existing flash now emits eight light units instead of four and still spends one charge. Darkness after the molt leaves the new form in place. |
| Timing, custody and outputs | **Headless verified.** JSON restore before and after the molt agrees with direct settlement. A missing prism at settlement, no daylight, a full husk account, and a repeat against the evolved form leave the inputs and form intact. The evolved flash settles and fades after reload. |
| Trigger and condition families | **Headless verified.** Sun Molt, Moon Veil, Guard Fleece, Market Fleece and Companion Fleece exercise item, world event, battle entry, trade, and growth with friendship and known training through their respective callers. |
| Other evolution mechanisms | **Headless verified for original forms.** Round 13 verifies temporary forms and reversion, Round 15 verifies a second creature from the molt, Round 26 verifies a move retention choice, Round 84 verifies form-specific gestation, and Round 85 verifies individual trait branches. Exact franchise species tables remain open for a world that uses them. |

**Provenance.** Pokémon Essentials at `8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b` groups evolution callbacks by event. Its conditions include place, weather, friendship, known moves, held items, stat comparisons and battle or scripted evidence. Its post-evolution callbacks can consume an item or produce a secondary creature. The pinned repository license is CC BY-NC-SA 4.0 and OOPS is MIT. The OOPS route compiler independently expresses the behavior in its own data and settlement contract. No upstream code, species tables or assets were copied. [Pinned evolution code](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/010_Data/001_Hardcoded%20data/007_Evolution.rb) · [Essentials license](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/LICENSE)

**Verification.** The tracked-source archive of `4d4505223` overlaid with the current genetics and evolution files passed the seven-file focused run with 67 passes and 2 existing skips. Architecture, coverage and isolated build passed. The build emitted its inherited duplicate-key warning and the bundle hash remained `14a691b03d6f773c8f5bfa7568388836464a42e7a48c3467e2f2cabac9739e82`. The opt-in pack runs through the headless fixture. Full suite and game integration remain open.

## Round 13. Temporary creature forms and reversion

**ACT NOW.** PC95, AR3/AR6, GN1–GN2, AD38 and AD51. The [evolution compiler and opt-in form pack](../../src/creature_evolution.js) use the same body, permanent form, world clock and saved properties. A temporary route adds an effective form over the base form. The form can expire at a declared minute or persist until an owning action releases it. Consumers read the effective form at settlement. The time boundary runs before a working due that minute. Routes can opt into precedence as proved in Round 21.

| Capability checklist | Current state |
| --- | --- |
| Permanent and branching routes | **Headless verified.** Same holder, stock settlement and material byproduct through the sun molt. Growth, item, trade, battle and event conditions have focused route tests. |
| Timed temporary form | **Headless verified.** The same Lantern Fleece sheep spends one charge on a six-minute Moon Veil, then uses its form-specific Moonbeam for 12 light. Moonbeam refuses in base form without spending charge. The regular flash settles for 4 when due exactly at reversion. The body, creature reference and base form survive. Charge spent while changed stays spent. |
| Event-bound form and release | **Headless verified.** A form with no timer survives reload and a long advance. Explicit release clears it while preserving learned-move data. Either a held stone or a known move can satisfy the route, and a repeated temporary transformation does not spend a second charge. |
| Form-aware capabilities and stock | **Headless verified.** Flash, Moonbeam, Stormflash, Lantern ram and Prismflash read the effective form. The spell arrival and sky own environment-driven release. Rounds 22–24 prove charge upkeep, battle-end release and loss of a required implement. |
| Further evolution behavior | **Headless verified for the Lantern cases.** Round 15 proves a distinct creature produced from the molt, Round 19 proves a permanent form with an inherited consequence, Round 21 proves simultaneous forms with precedence, Rounds 25–26 prove a same-body species change with offspring and learned-move consequences, Round 27 proves an effective-form stat used by the contest resolver, and Round 52 proves a permanent change under a temporary form. |

**Provenance.** The pinned Pokémon Essentials implementation checks an item or known move for a Mega form, changes the same Pokémon's form, and supplies separate Mega and Primal return paths. OOPS independently expresses timed and event-bound return through its headless world and kernel working owners. The moon window, cost, light strength and duration are original fixture values. [Pinned Mega and Primal form source](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/014_Pokemon/002_Pokemon_MegaEvolution.rb#L1-L82)

**Verification.** The tracked-source archive of `4d4505223` overlaid with the current genetics and evolution files passed the eight-file focused run with 73 passes and 2 existing skips. Architecture, coverage and the isolated build passed on the headless change. The isolated bundle hash was `14a691b03d6f773c8f5bfa7568388836464a42e7a48c3467e2f2cabac9739e82`, with the inherited duplicate-key warning. The form pack and fixture stay outside the game entry. Full suite and gameplay tie-in remain open.

## Round 14. Moon Veil from world events

**Headless verified.** The opt-in Lantern moon cycle listens to the actual sky and arrival events. A full-moon dusk settles the existing Moon Veil operation and spends one charge. Daylight releases that same form, either when the sky changes or when the changed creature arrives in a lit place. The reactor reuses the operation settlement and emits its effects through the world's event transaction. The event settles at the current minute and leaves world event provenance. The manually invoked working keeps its own one-minute deadline. Neither route introduces a separate clock or creature identity.

The [headless test](../../tests/heredity.test.js) restores before dusk, activates through the sky, restores again and settles Moonbeam for 12 light. Bringing the sheep into a daylight barn releases the form without refunding either spent charge. The existing forage-attraction law reads the remaining light and moves a feeder over an open path. The feeder stays put in the no-beam control. The previous pulse still fades at its original place after restore.

**Checklist continuation.** Round 13 now has a live world event producer, an environmental release and a downstream form-dependent consumer. The next independent proof is a second creature from a molt through the existing identity and stock owners. An inherited form needs a later comparison with an actual brood and a world-authored genome. Care, training and dose contact still need distinct producer/consumer evidence where they affect these routes. No new gameplay registration or upstream code copy.

**Verification.** A tracked-source archive of `4d4505223` with the creature overlays passed `node --test tests/{heredity,breeding_program,habitat_care,creature_lifecycle,living_foundation,coverage_creatures,holder_lifecycle,body_alteration,gu_light_attraction}.test.js` with 80 passes and 2 existing skips. Architecture and coverage checks passed on those inputs. Scoped diff check passed.

## Round 15. Learned signals and the creature left by a molt

| Capability | Evidence and remaining scope |
| --- | --- |
| Training changes a paid ability | **Headless verified.** The existing lifecycle practice action records a keeper-specific skill. The reloaded living body projects it and a signal working uses the inherited coat, debits one unit and lights the place for one minute. The same sheep before practice cannot use the signal and retains its charge. Live training availability and payment remain with the caller. |
| A molt can produce a separate creature | **Headless verified for an awakened byproduct.** The completed Sun Molt receipt ties the parent and husk account together. The optional local awakening requires the parent nearby, one husk and one stored charge. E12 creates a new body and transfers both quantities from the husk holder. Parent, secondary holder and lineage survive reload. An uncharged husk, occupied ID or a spent husk cannot produce a second result. Later rounds verify the wisp's glow and Round 62 verifies its local awakening capacity. |
| Creature-side interaction evidence | **Headless verified.** The attraction fixture exercises creature-side light over a real path. Rounds 16, 39–41 and 46–49 cover spell contact, Gu upkeep or release and warded contact. Rounds 129–136 verify brew, spell and Gu treatment, including the repaired creature's entry into and release from Moon Veil. |

The secondary creature uses the existing E12 lifecycle action. The Pokémon Essentials precedent is the separately settled post-evolution result in Round 11. The original trial uses a charged husk and leaves the evolved parent intact. It keeps a durable working receipt as source evidence. A portable husk with its own identity is a later option if the material needs independent custody or trade.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 14 command plus `tests/brew_body_delivery.test.js`, with 85 passes and 2 existing skips. Architecture and coverage passed. The native goal remains active for the rest of the feasible capability checklist.

## Round 16. The wisp uses its charge and a spell releases Moon Veil

**Wisp behavior, headless verified.** The awakened husk now has its own paid glow working. It spends the charge transferred by E12, lights its place for six grades and fades after two minutes on the existing working clock. Its shell, holder and parent lineage survive. The parent cannot use the wisp working, and an empty wisp needs charge before a second glow. Reload before emission and while lit preserves the debit and fade. Round 62 covers awakening capacity. Round 63 covers daylight recharge and a light-foraging consumer. Other diets can be authored when a world supplies another energy source.

**Creature-side spell contact, headless verified.** Round 14 now uses the existing spell working to move the changed sheep into the lit barn. The resulting arrival releases Moon Veil on the original holder and keeps the already-landed light at its prior place until fade. The nearby feeder still follows that light. Restore crosses the pending spell and the active glow. This is an authored relocation spell case. It adds no change to the spell, effect or engine host owner.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 15 command plus `tests/engine_host.test.js`, with 91 passes and 2 existing skips. Architecture, coverage and scoped diff checks passed. Further work includes care or brewed state changing a creature action, the Gu body's real active-use path, heritable effects of a permanent form, and the remaining earlier checklist gaps.

## Round 17. Care and brewed state change a learned action

**Headless verified.** The opt-in Lantern signal now reads the live body responsiveness account at settlement when that account is supplied. The existing Draught coverage case supplies the actual brewed volume, settled soporific and transfer rule. Dosing the trained sheep while its signal is pending drops responsiveness to 2 and leaves 8 liquid and 1 active unit in the flask. The reloaded pending signal refuses and keeps its one charge. The body clock reaches 51 responsiveness at minute 12, over the authored action threshold of 50. A new signal then spends the charge and lands four light. The undosed control succeeds at its first deadline. The animal response and action threshold are original fixture calibration. This case adds no brew or spell owner changes.

**Care proof.** The existing lifecycle injury, care and living-body read feed the opt-in signal. The original fixture projects care at command start. Round 45 adds a live binding read and verifies a wound and care started during the pending command. The brewed branch separately exercises a live body-account change.

**Gu evidence checked in the shared checkout.** The Fang Yuan case uses the acquired Moonlight Gu's control, custody, food and fuel in combat after reload. The Gu regulator changes a brew outcome with paid essence. Round 46 proves that feeding during paid Moonblade preparation changes release on the world clock. The short contest case still reads Gu bodies at entry.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 16 command with 92 passes and 2 existing skips. Architecture and coverage passed on those isolated inputs. The live `node --test tests/fang_yuan_capability.test.js tests/gu_brew_regulator.test.js` passed 4 tests. Remaining work includes heritable permanent forms, paid tests and breeding aids, and earlier world-specific cases. The native goal stays active.

## Round 18. A paid fleece assay and physical breeding aid

**Headless verified.** The opt-in [meadow breeding bench](../../src/world_packs/meadow_breeding_bench.js) requires a real bench in the animals' habitat, keeper custody and the relevant world stock. A fleece assay spends one reagent and uses the lifecycle's existing test-knowledge record. The living-body reader changes its fleece view from `[f, ?]` to `[F, f]` after reload. The genes stay the same. A known locus, a foreign bench and a depleted supply leave the inputs intact. The assay is original fixture data.

The same bench starts an aided brood by spending one physical clasp. The chosen parent supplies the guaranteed wool-yield IV through the existing inheritance rule. The saved brood yields a child with wool IV 31 and eight Fine wool bundles versus seven in the matched ordinary brood. An occupied pair and a bench outside the keeper's custody preserve the clasp. The paired settlement returns the updated lifecycle and engine to the caller. The headless test saves both owners together. Integration with a player action or a multi-minute assay requires a caller that settles its own transaction across those owners.

**Provenance.** The independent clasp rule applies the guaranteed-stat precedent previously recorded in Round 5, TA11. It consumes an authored unit of stock. [Pinned Essentials IV method](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/012_Overworld/007_Overworld_DayCare.rb#L174-L214)

**Checklist.** Paid testing and physical breeding aids now have outcome evidence. The remaining breeding-program skip concerns a standing program and distant selection. Heritable permanent form changes remain a separate gap. The native goal stays active.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 16 eleven-file command with 93 passes and 1 remaining skip. Architecture, coverage and scoped diff checks passed.

## Round 19. A permanent molt can change inheritance

**Headless verified.** The opt-in Lantern law can use a successful Sun Molt receipt to convert both fleece alleles to fine fleece on the existing sheep. The Sun Prism is paid by the original working. The lifecycle keeps chromosome order, pedigree and knowledge of other loci, and invalidates the previous fleece assay. The same body, working receipt and creature genes survive reload. Reapplying the current receipt is a no-op once both alleles are fine. A pending molt, a matching form label by itself, a foreign keeper and a settled Moon Veil leave the genes alone.

An existing brood keeps the alleles it received at conception. A later brood from the same parents with the same draw root produces Fine wool stock at shearing. The ordinary Sun Molt control produces ordinary Wool in the same quantity. This is an authored germline effect for the Lantern line. The paired headless caller supplies the optional germline settlement. A live caller would settle both owners together when advancing the molt.

**Checklist.** Heritable effects of a permanent form now have an actual offspring and harvest proof. The separate species-change case still needs an offspring-kind consumer. The breeding-program skip still tracks standing selection across generations.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 16 eleven-file command with 94 passes and 1 standing skip. Isolated architecture, coverage and build passed with the existing build warning. The shared checkout rules check passed with warnings outside the creature paths. Scoped diff checks passed.

## Round 20. Standing selection for phased herds

**Headless verified.** The habitat clock stores an optional breeding goal for each phased cohort. The goal names a visible locus. At each birth window the policy ranks surviving profiles by the existing expression rules and uses the highest ranks that contain at least two animals. Ties use the original addressed draw and two different parents. One favored animal can breed with a lower-ranked mate, and the existing inheritance law preserves its linked chromosome. The habitat's space and prey limits still cap births. The caller settles elapsed windows before changing the goal and supplies the environment for those windows.

Twenty windows from the same four founders give 22 fine-wool clips under fleece selection, 12 when the goal switches to dark coat halfway, and 2 under dark-coat selection from the start. The test draws every animal back from the herd and runs the meadow shearing method. A winter-coat goal produces the neutral result in warmth and favors the expressed winter coat in cold. Removing a goal restores neutral draws. Saving halfway and resuming produces the same herd as a single advance. The existing catch-up budget can resume after reload without exceeding habitat capacity.

**Checklist.** The standing-selection skip is replaced by the outcome test. This policy represents mature candidates in a count-based herd. An age-structured program, weighted goals, or selection based on pedigrees or measured quantitative traits would need the corresponding facts in the saved herd or a named roster. Round 7 records the pinned genetics and simulation references. This policy is original and uses the existing phased transmission and expression functions.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 16 eleven-file command with 95 passes and zero skips. Isolated architecture, coverage and build passed, with the existing build warning.

## Round 21. Temporary forms with independent precedence and release

**Headless verified.** An authored route may give a temporary form a positive priority. The effective form uses the highest active priority, breaking ties by form ID. Existing single forms keep their saved properties and act as priority zero under a higher-priority form. Layers keep their own expiry on the same body. The explicit revert working releases the effective temporary form. An event producer can release the form it owns while another form is effective.

In the Lantern case, one Storm Salt adds a three-minute Storm Mantle over Moon Veil. Stormflash spends coat charge for 16 light. Moonbeam refuses while masked and spends nothing, then lands 12 light when the Mantle expires at its settlement minute. Moon Veil later expires and the same sheep returns to its base form with spent charge still debited. Empty salt and an active duplicate leave the existing forms intact. Saving crosses the pending Mantle, both active forms and their expiries. The existing relocation spell into daylight also releases Moon Veil while it is masked. That branch returns directly to the base when the Mantle expires.

**Checklist.** Priority, duration and salt are original local rules. Round 13 records the pinned temporary-form precedent. Independent layers now have a cost, ability and release proof. Round 22 verifies upkeep, Round 27 verifies a contest stat consumer, and Round 52 verifies permanent change beneath an active layer.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 16 eleven-file command with 95 passes and zero skips. Isolated architecture, coverage and build passed. The build emitted its existing duplicate-key warning. Scoped whitespace checks passed.

## Round 22. Temporary form upkeep shares its ability's charge

**Headless verified.** The optional Lantern upkeep pack draws one coat charge per minute while Storm Mantle is active. The form releases at the next clock decision with no charge, and daylight recharge uses the same coat account. A charge-free start leaves Storm Salt intact. With two charges in darkness, upkeep spends one and Stormflash spends the other for 16 light. The sheep reverts at the next clock decision, and its already-landed light fades on the original schedule. With a single charge, the form reverts before the pending Stormflash settles and the place stays dark. Reload crosses the pending flash, spent coat and expiry. The daylight run gives the same saved state when advanced all at once or in two advances across a reload.

**Checklist.** Ongoing upkeep now has a real resource, failure and expiry proof. The upkeep rate is an original Lantern rule. The underlying pack has no new dependency on a franchise runtime. Reopen for battle-owned reversion, a sustained form fueled by a different body's account, or a stat that another subsystem consumes.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 16 eleven-file command with 96 passes and zero skips. Isolated architecture, coverage and build passed. The shared checkout rules check passed with existing warnings.

## Round 23. A contest owns its temporary form

**Headless verified.** The opt-in Lantern contest caller offers Guard Fleece on entry using the existing battle route. A mature Lantern coat spends one charge. Its saved owner is the bout and entrant. The contest chooser reads that owner and the effective form, and the normal strike resolver lands the ram. In the matched proof it drops the rival to zero vitality. The ordinary bump leaves eight. A coat without charge uses the ordinary move. A second bout cannot use or release the first bout's form.

The caller saves the engine and contest record together, including an in-flight move. Direct and reloaded settlement agree in near and far detail. At settlement the owning bout releases its form, keeps the same body and leaves the spent charge debited. The contest clock stays in ticks and the world clock stays in minutes. The ram strength and entry cost are original Lantern rules. Round 13 records the pinned battle-form precedent.

**Checklist.** Battle entry, ability, and battle-end release have a headless proof. Round 61 verifies abort through the same release policy. Rounds 24–26 cover equipment-dependent release and offspring species changes.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 16 command plus `contest.test.js` and `contest_consumers.test.js` with 118 passes and zero skips. Isolated architecture, coverage and build passed.

## Round 24. A bound implement sustains a temporary form

**Headless verified.** The optional Lantern prism pack uses the actual collar holder ID. Fastening the collar spends one coat charge and adds Prism Fleece while the collar is present. The higher-priority form enables Prismflash for 20 light. A departure event from moving the collar releases the form immediately. If the collar holder is destroyed, the next world decision releases it before pending workings settle. A spare collar can move without interrupting the working. Returning the original collar requires fastening it again.

Saving during Prismflash preserves the working and collar binding. Removing the collar before settlement prevents the flash and preserves its unspent charge. The sheep keeps its identity and an underlying Moon Veil can resume until its own expiry. Round 13 records the pinned held-item transformation precedent. The collar, charge cost and light output are original Lantern rules. Co-location represents worn equipment in this headless case. A world with separate gear and custody slots would use its own equip and transfer events to release the binding.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 23 command with 119 passes and zero skips. Isolated architecture, coverage and build passed.

## Round 25. Permanent species change carries into later broods

**Headless verified.** A world can opt into Beacon sheep as a breeding kind after a successful Sun Molt. The local rule checks the same creature holder, keeper and molt receipt. The lifecycle preserves the adult's ID, founding cohort, chromosome pairs and habitat occupancy. Its new kind supplies the birth origin for future broods. Older offspring keep their species, including an offspring born from a brood already pending when both parents change. Legacy saves with no species history or saved brood origin keep their existing interpretation.

After reload the same pair produces a Beacon sheep with the same allele draw as the ordinary control. The existing shearing method credits three extra fine-wool bundles per expressed coat level for the Beacon kind and two for the control. The unchanged species compatibility rule declines a new mixed pair. A habitat lacking the new kind declines the species settlement or birth. A replay after successful conversion leaves the lifecycle intact.

**Checklist.** The species and yield rules are original and use the existing kind registry, genome and harvest readers. The proof uses a compatible genome across both kinds. Worlds with different genome layouts need a mapping for the traits they carry forward. The opt-in headless caller applies the species settlement from the paid molt receipt. If the lifecycle declines it, the separately settled Sun Molt remains paid and can still yield its ordinary form. A caller that treats molt and species change as one transaction needs to validate both owners before publishing either result.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 23 command with 120 passes and zero skips. Isolated architecture, coverage and build passed.

## Round 26. The keeper can retain a learned signal through a species change

**Headless verified.** The opt-in Beacon sheep settlement can take an explicit choice between two signals the current keeper has trained. Ordinary Signal holds eight light for one minute. Steady Signal holds eight for three. The chosen signal keeps its original training count, and the other is removed from that keeper's training. Bond, practice time and unrelated skills survive. With the choice omitted, the adult retains both signals. A choice of an untrained signal declines the species settlement without changing the lifecycle.

Both choices were tested on the same sheep and paid molt receipt. After saving and reloading the lifecycle, the existing body read supplies the saved training to the working. The retained signal spends one charge and produces the expected light and duration. The discarded signal refuses without spending charge. The choice, skill names and durations are original Lantern rules. The headless caller projects the restored body into the engine when issuing the command. A host allowing training changes during a pending action needs to refresh that binding at settlement.

**Verification.** The tracked-source archive of `4d4505223` with the creature overlays passed the Round 23 command with 120 passes and zero skips. Isolated architecture, coverage and build passed.

## Round 27. An active form changes incoming contest damage

**Headless verified.** Guard Fleece adds three armor to its entrant's existing profile at strike settlement. The ordinary strike resolver reads that profile and the same sheep loses three fewer vitality to the same incoming strike. Reload while the strike is pending preserves the result in near and far detail. Releasing the form before settlement restores the original damage and keeps the entry charge spent. The saved entrant profile retains its base armor. The existing bout ownership check also gates the stat.

**Checklist.** The armor value is an original Lantern rule. The contest accepts an optional settlement profile reader and keeps its existing profile when no reader is supplied. The proof covers hit resolution. A world that wants a changing stat to affect move selection, readiness or odds needs to use it at those respective reads.

**Verification.** The tracked-source archive of `4d4505223` with the current creature and contest overlays passed the Round 23 command with 120 passes and zero skips. The shared checkout passed all 52 tests in `heredity.test.js`, `contest.test.js` and `contest_consumers.test.js`. Isolated architecture, coverage and build passed, and the shared rules check passed.

## Round 28. A lamp uses charge from the actual wool clip

**Headless verified.** The Lantern working binds wool, a lamp and their current site. Two charges from the daylight-grown clip produce eight light for three minutes. The clip keeps its seven Fine wool bundles. The existing forage law moves a moth down the open meadow path during the pulse. Closing the path leaves it at the bank. The pulse and movement agree across a direct advance and save/reload before ignition and during the light.

Moving the clip before ignition, supplying uncharged wool, or filling the site's light account prevents the working from spending charge. Two uses exhaust the clip and a third cannot light the lamp. The lamp and its numbers are original Lantern rules. This proof uses the existing timed fade. A case for actively extinguishing the light needs ownership of the specific pulse so cleanup happens exactly once.

**Verification.** The tracked-source archive of `4d4505223` with current creature and contest overlays passed the Round 23 command with 120 passes and zero skips. Isolated architecture, coverage and build passed.

## Round 29. Interrupting a glow removes its contribution once

**Headless verified.** The Lantern owner uses the saved working ID and bound source to identify a live pulse. Extinguishing it debits its light from the original site and interrupts the pending fade through the kernel. A lamp can be extinguished while a second use is lit. The second pulse remains at eight light across the first deadline and expires at its own deadline. The same path can interrupt a creature's flash while a wool lamp remains lit. Spent charge remains spent in both cases.

The checks reload while pulses overlap, after an interruption and at the old fade deadline. Wrong-source, repeated and pre-ignition requests leave the engine intact. This proof uses explicit Lantern actions and the existing additive site account. Shade, combat and spell owners can call the interruption when their own conditions settle. A world that directly replaces or clamps that light account during active pulses would need separate contribution accounting.

**Verification.** The tracked-source archive of `4d4505223` with current creature and contest overlays passed the Round 23 command with 120 passes and zero skips. Isolated architecture, coverage and build passed. The shared rules check and scoped diff check passed.

## Round 30. Charged wool fuels a worn ward

**Headless verified.** The opt-in Lantern adapter moves four charges from the actual shearing clip into the existing stored gear ward. The wool remains in stock. Binding checks custody and co-location of both items. A missing, moved or depleted clip and a duplicate binding leave the engine intact. The worn ward intercepts two fire impacts at two units each, leaving the sheep unharmed. Reload preserves the remaining charge, and the third impact reaches the same sheep. An unworn carrier and slashing contact bypass protection without spending ward charge.

The original headless caller passes a settled spell effect and local damage type to the ward adapter. Round 48 also verifies a pending spell landing through the engine. The fuel cost and capacity are original Lantern rules, using the existing gear ward and Gu defense layers.

**Verification.** The shared checkout passed 138 focused tests including the gear ward cases in `fire_resistant_lining.test.js`. The tracked-source archive of `4d4505223` with creature, contest and gear ward overlays passed the Round 23 command with 120 passes. Isolated architecture, coverage and build passed.

## Round 31. Shade on a world path scatters coat light

**Headless verified.** The opt-in Lantern crossing follows an open world path, advances its travel time and checks that the same exit is still available. A shaded destination interrupts the arriving creature's active flash at its original site. Its identity and paid charge debit survive. An overlapping wool lamp remains lit through the old flash deadline and fades on its own. A closed path preserves the original engine state. The headless test reloads before crossing and after interruption.

Shade also suppresses coat recharge despite a daylight reading of one. The creature can spend existing reserve on a new flash while sheltered, then starts charging again when the cover is removed. The cover and dispersal rules are original Lantern mechanics. The crossing is the event producer for this case. Other movement owners can use the same interruption when their own arrival settles.

**Verification.** The tracked-source archive of `4d4505223` with creature, contest and gear ward overlays passed the Round 23 command with 120 passes and zero skips. Isolated architecture, coverage and build passed.

## Round 32. Mixed genome maps settle a real brood

**Headless verified.** An opt-in cross supplies the two parents' genome rows and a local offspring cohort. The existing genome-distance law gates viability and decides whether offspring can breed. The parents transmit from their own chromosome maps. A matched draw keeps one parent's linked copies together and recombines the other parent's copies. The child carries the resulting pair through a saved brood and birth. A mixed pair without a cross rule and a cross outside the compatible family are declined.

The test shears the restored hybrid and credits nine wool bundles versus five with the same cross and a plain crimp allele. The wider cross cannot mate again after reload, and the closer cross starts a new brood. The birth records retain both parent kinds and the offspring cohort. Existing same-kind saves retain their earlier shape.

**Checklist.** Round 7 records the pinned chromosome transmission sources. The cross uses the existing distance rule with original local genomes. A locus absent from one parent, or declared with incompatible allele symbols, contributes a plain copy under this model. The receiving world authors the hybrid map and cohort. Mixed-map crosses in anonymous herds, explicit allele translation across incompatible symbols, and pedigree-aware mating away from named individuals remain distinct cases.

**Verification.** The shared checkout passed 140 focused tests. The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed the Round 23 command with 121 passes. Isolated architecture, coverage and build passed.

## Round 33. Two wild herds can establish a fertile hybrid cohort

**Headless verified.** A wild birth policy can bind two distinct local phased herds and a destination genome. Each window uses surviving source stock after losses. The source profiles transmit through their own chromosome maps and the child enters the destination's phased ledger. One member from each source is enough. Habitat capacity still limits the birth, and a source lost before the birth phase contributes no offspring. The destination can start empty.

A two-window advance matches a split advance across reload. The restored hybrid stock can breed within its cohort or supply individuals. A drawn animal preserves one intact and one recombined chromosome and yields nine wool bundles versus five in the matched plain-crimp control. The rule shares the genome-distance and transmission owners from Round 32. Anonymous cross stock requires a fertile cross because its current profile rows carry genes and counts. Named broods retain the separate sterile outcome. A mixed-fertility cohort would need a saved fertility distinction before that case can use the wild rule. The caller supplies its local population policies at each advance.

**Verification.** The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed the Round 23 command with 122 passes. Isolated architecture, coverage and build passed. The shared focused run passed 143 tests before the final chromosome assertion, which also passed in both checkouts.

## Round 34. Phased herd fertility survives wild births, losses and drawing

**Headless verified.** A viable wider cross can establish sterile offspring on the wild clock. The profile keeps a fertility marker alongside the existing diploid genes. Identical chromosome pairs can coexist as fertile and sterile stock. Wild births draw only fertile parents, both within a cohort and across source herds. Losses still draw from the whole stock. Old profile rows without the marker retain their fertile interpretation and order.

A split advance across reload matches a direct advance. An individual drawn from sterile stock keeps the marker and yields nine wool bundles through ordinary shearing. Folding interchangeable stock back preserves the same profile and count. A mixed herd with one fertile animal has no local birth. With two fertile animals it has one. A restored sterile individual also refuses mating in the named brood route.

**Checklist.** This uses the Round 32 genome-distance law and the pinned chromosome references in Round 7. The fertility marker represents the outcome of the cross. Pedigree-based selection of unnamed parents still needs ancestry records.

**Verification.** The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed the Round 23 command with 122 passes. Isolated architecture, coverage and build passed. The shared focused run passed 144 tests before the final sterile-source assertion, which passed in the isolated run. The shared rules check passed.

## Round 35. The wild clock can mate animals with known pedigrees

**Headless verified.** An opt-in wild population can use the existing individual records for its unheld breeding stock. Each habitat window picks the least-related available adults within the world's kinship threshold. It uses the ordinary brood, gestation, birth and growth rules. A full habitat postpones delivery. A phased herd with no individual ancestry can continue using its existing counted-profile rule.

In the matched case, the wild clock picks an unrelated mate when available. Its offspring reaches shearing at minute 9. The sibling pair's offspring reaches the same five-bundle harvest at minute 19. A stricter kinship threshold leaves the sibling pair without a brood. Save and reload during gestation agree with a direct advance.

**Checklist.** This uses the existing Round 9 pedigree calculation. The caller supplies the mating policy and the tracked adults. This case keeps ancestry in the named lifecycle records and uses same-kind mating. Tracked wildlife losses and pedigree-aware mixed-species pairing would need their own settlement cases.

**Verification.** The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed the Round 23 command with 123 passes and zero skips. Isolated architecture, coverage and build passed before the final herd-genome validation. The focused suite passed after that validation. The shared rules check and scoped diff check passed.

## Round 36. Tracked wild losses preserve ancestry

**Headless verified.** When capacity or prey falls short, a tracked wild population can apply its loss allowance to eligible unheld individuals. The existing habitat clock addresses the draw by window and loss index. A loss frees habitat space, preserves the deceased animal's identity and parentage, and ends any brood it was carrying. A living carrier can still deliver offspring conceived with a parent that later died.

The test reloads on both sides of a loss. The deceased animal has zero vitality and cannot be transferred or sheared. The surviving carrier delivers after capacity returns, and the reloaded newborn still names its deceased parent. The loss counter stays unchanged when there is no new deficit. The tracked policy applies to individual wild records. Counted turnover retains its separate stock accounting.

**Verification.** The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed 123 focused tests and the isolated architecture, coverage and build checks. The shared checkout passed 147 focused tests and the rules check.

## Round 37. Tracked wild pedigrees guide mating across herds

**Headless verified.** A tracked wild birth policy can name two local source herds, their genome maps and an offspring cohort. It uses the existing pedigree ranking across source herds and the existing hybrid brood for gestation, transmission and fertility. The source order determines the carrier. A parent and its prior offspring exceed the tested kinship threshold, so that pair produces no brood. An unrelated adult from the other herd is eligible.

A reload during gestation agrees with a direct advance. The child preserves both individual parents and their species, carries the ridge crimp allele, and yields nine fine-wool bundles. Duplicate source herds are refused. This case uses the genome-distance and transmission rules from Rounds 32–34 and the named ancestry from Rounds 35–36.

**Verification.** The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed 124 focused tests and the isolated architecture, coverage and build checks. The shared rules check and scoped diff check passed.

## Round 38. Compatible crosses can translate allele symbols

**Headless verified.** A world can give each parent a mapping from an offspring locus to its parental locus and the resulting symbols. Transmission draws from the parent's own chromosome map before applying the translation. Without a mapping, a mismatched locus still supplies the plain copy. Compatibility and fertility still use genome distance. An invalid source locus or offspring symbol is rejected.

The tracked wild cross translates the ridge fleece allele and yields nine Fine wool bundles after reload. Omitting the map gives nine ordinary Wool bundles from the matched brood. The phased herd test separately translates a crimp allele and verifies the restored stock matches the equivalent same-symbol herd, including the harvest. The pending named brood saves the resulting genes. Future wild windows still receive the policy from the caller. The mapping rule is original and reuses the Round 7 chromosome transmission model.

**Verification.** The shared checkout passed 149 focused tests and the rules check. The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed 124 focused tests and isolated architecture, coverage and build checks.

## Round 39. A paid molt and a species change can settle together

**Headless verified.** The opt-in Lantern caller stages the ordinary Sun Molt and the lifecycle conversion on pure candidate states. It publishes the returned pair after habitat, retained training and the actual world working agree. An unsupported habitat or untrained signal refuses the species plan. A missing prism or a full husk account refuses the world working. In each case the input clock, stock, form and species remain as supplied.

Success spends one prism, credits one husk and changes the same creature's form and species. The retained training and prior brood survive. Reloading before or after the call gives the same result, and replay leaves the paid result intact. The paired call advances through the molt deadline in one operation. A host that wants a separately saved, interruptible species-molt command would need a shared pending action record. The earlier ordinary Sun Molt and receipt-based conversion are still available independently.

**Verification.** The shared checkout passed 150 focused tests and the rules check. The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed 124 focused tests and isolated architecture, coverage and build checks.

## Round 40. A combined Sun Molt can save while pending

**Headless verified.** The paired caller saves a detached kernel working beside the world and lifecycle. Preparing it spends no stock. Advancing the ordinary world to the deadline leaves the prism and form intact until the paired settlement runs. It rechecks the current keeper, habitat and the original bound body. The existing working then checks daylight, stock and room for its byproduct.

The test reloads the pending command, advances the world independently to the deadline and completes it. Its world and lifecycle match the one-call result. The same sheep keeps its prior brood and selected training. A changed keeper, unsupported habitat, lost daylight, or a missed deadline leaves the prism unspent. The command uses the original one-minute window and can finish at its deadline. A caller that needs automatic settlement must dispatch this paired command as part of its own clock.

**Verification.** The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed 124 focused tests and isolated architecture, coverage and build checks. The shared focused species-change case, rules check and scoped diff check passed.

## Round 41. The Lantern clock settles saved molts at their deadlines

**Headless verified.** The Lantern caller advances the ordinary world to each queued molt deadline, then settles the paired world and lifecycle command. It uses the current habitat and keeper and returns remaining commands with the two states. Commands due together run in working-ID order. A refusal consumes the queued attempt and leaves its prism and creature intact while the clock continues.

The test saves two pending commands and advances straight past their deadline. Both conversions match a split advance across reload. With both commands competing for one prism, only the first succeeds. A changed habitat refuses both while the clock reaches the requested minute. This is the opt-in Lantern clock. Other hosts must retain the pending records and call this clock for automatic settlement.

**Verification.** The shared checkout passed 152 focused tests and the rules check. The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed 124 focused tests and isolated architecture, coverage and build checks.

## Round 42. A paid custody transfer can trigger a permanent form

**Headless verified.** In the opt-in Lantern barter case, the current keeper and buyer meet at a market. One barter token moves from buyer to seller, the lifecycle transfers the sheep, and Market Fleece changes the same body. Both owners are returned together. After reload the same sheep's paid flash emits eight light instead of four, with its pedigree and genes intact.

A short purse, the wrong seller, a buyer outside the market, or an unmarked venue leaves custody and payment as supplied. Replaying a paid sale does not spend again. The market form and token are original local rules. Round 12 records the pinned trade-evolution precedent. This caller handles a single co-located barter. A market that owns offers or remote exchanges can provide its settled trade to its own route.

**Verification.** The shared checkout passed 154 focused tests and the rules check. The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed 125 focused tests and isolated architecture, coverage and build checks.

## Round 43. Growth and friendship can unlock Companion Fleece

**Headless verified.** The opt-in Lantern caller reads maturity from the lifecycle clock and bond and learned skills from the keeper's saved training. Either a practice session or a growth check can offer the route. Two sessions build the bond. A juvenile, a low bond, or a mature sheep trained only to follow cannot change form. A mature sheep with the required bond and signal training spends one coat charge to change form. The same body flashes for eight light after reload, compared with four in its original form. Training, ownership and identity persist.

**Checklist.** Round 12 records the pinned growth and friendship precedents. The bond, time and charge values are original Lantern rules. The caller offers the route at a development check or after practice. A world that needs passive settlement across many creatures can schedule those checks at its development boundaries.

**Verification.** The shared checkout passed 156 focused tests and the rules check. The tracked-source archive of `4d4505223` with the current creature, contest and gear ward overlays passed 126 focused tests and isolated architecture, coverage and build checks.

## Round 44. The Lantern clock offers evolution at maturity

**Headless verified.** The Lantern caller can opt into automatic growth offers. It derives due times from the saved maturity and training records. A long advance stops at those times and uses the existing Companion Fleece working. If an item molt and a growth offer share a deadline, the saved item command runs first. The growth offer checks the remaining coat and form at its own settlement.

A trained sheep changes at minute eight and spends one charge. Reloading at the maturity boundary and advancing again yields the same engine as one long advance. A depleted coat records a refusal, and the caller can still offer the route explicitly after charge returns. An ordinary clock run with automatic growth disabled leaves the offer to the caller. The rule follows the pinned growth precedent in Round 12 and the local training gates in Round 43.

**Verification.** The shared checkout passed 157 focused tests and the rules check. The tracked-source archive of `4d4505223` with current creature, contest and gear ward overlays passed 126 focused tests and isolated architecture, coverage and build checks.

## Round 45. Pending actions read current wounds and care

**Headless verified.** The optional engine binding port projects the current lifecycle through the existing living-body reader at the working's deadline. The Lantern test starts a two-minute signal at minute five, then injures the sheep at minute six. After save and reload, an untreated wound blocks the signal and leaves its charge intact. Care started at minute six heals the wound by minute seven, allowing the same pending signal to spend one charge and emit four light. An unwounded control also succeeds.

The host supplies the current lifecycle when it configures or restores the reader. Existing holders still supply physical quantities and properties. A host that changes both owners while advancing the world must reattach the reader with the updated lifecycle before settlement.

**Verification.** The shared checkout passed all 80 tests in `heredity`, `engine_host`, `creature_lifecycle`, `living_foundation`, `brew_body_delivery` and `habitat_care`. Architecture, rules and scoped diff checks passed.

## Round 46. Feeding during preparation changes a Gu release

**Headless verified.** The existing Moonblade contact working already reads the actual Gu at release. The regression takes a saved working after paying for Little Light support and before activating Moonlight. Without a meal, satiety reaches zero on the release minute, so the blade stops and the first unit of essence stays spent. Using the existing Moonlight meal route during the wait spends the matching food, keeps the same Gu under the same controller, and lets the restored working pay four more essence and land two vitality damage over the sightline. Direct and restored results agree.

This uses the existing chapter-grounded Moonlight body and Little Light support owners listed above. The short starting satiety is authored to cross the hunger boundary during preparation. Round 47 covers the contest host that advances world minutes from contest ticks.

**Verification.** The shared checkout passed 70 tests across Moonblade contact, Fang Yuan capability, the Gu brew regulator, Gu light attraction, heredity, engine host, brew body delivery and the living foundation.

## Round 47. Feeding between contest steps changes the pending killer move

**Headless verified.** The existing Moonblade contest host advances the world to the next contest boundary and reads live Gu bodies at settlement. In the matched runs, Jade Skin protects the preparatory step and the same Moonlight Gu has one satiety left. With no meal, it reaches zero before release. Little Light still spends one essence and the rival stays at 40 vitality. Feeding the pending Gu spends the matching petals. The reloaded contest spends five essence on the combined activation and the rival falls to 12 vitality. Controller and Gu identity persist. The direct and restored fed runs match.

This uses the existing live-profile contest caller and the chapter-backed meal from Round 46. Starting satiety and tick conversion are fixture values. The older short contest caller still reads its entry snapshot. The live case requires the host that advances the world between contest steps.

**Verification.** The shared checkout passed all 75 focused tests across the Round 46 files and the Moonblade contest suite.

## Round 48. A spell in flight can meet a wool-fueled ward

**Headless verified.** An opt-in engine port handles the Lantern fire spell after the normal effect host has checked its current path and protections. The ward spends stored charge and lands any remaining damage. The engine saves that debit in the same step as the spell's landing receipt. A ward firing inside that step leaves the outer clock in charge of settling other due work.

After reload in flight, a closed path prevents contact and leaves all four ward charges intact. With the path open, the same sheep takes no damage from two two-point impacts. The third drops its vitality from 20 to 18. The reloaded first impact matches direct settlement. This port maps one authored direct spell to a local damage type. Area and mixed-type effects need a caller with their own packet rules.

**Verification.** The shared checkout passed 101 focused tests across heredity, engine host, spell contact, fire-resistant lining, Moonblade contact and contest, and brew body delivery.

## Round 49. A wool ward filters typed damage from an area spell

**Headless verified.** The Lantern caller declares the burst as two fire damage and three slashing damage. The ordinary effect host determines which holders the spell can hit. The ward then intercepts the fire packet on its wearer and the normal effect host lands the remainder. The same sheep loses three vitality, an exposed bystander loses five, and a shielded bystander loses zero. Cover on the wearer preserves all four ward charges even while the burst damages another target.

Saving the pending spell and reloading matches direct settlement. Packet amounts must account for the full damage. These are authored Lantern values on the existing spell and gear-ward laws. The adapter covers direct contact and explicit holder or place-area targeting. Other damage types and targeting patterns can supply their own packet and target rules. The area proof uses independent damage landings and does not exercise reactions that change another target's defenses during the burst.

**Verification.** The shared checkout passed 113 focused tests across the Round 48 files and effect grammar. Architecture, rules and scoped diff checks passed.

## Round 50. An area reaction can protect the next creature

**Headless verified.** The opted-in Lantern burst fixes its target list at impact and resolves it in holder ID order. Each target reads current defenses after earlier targets' reactions. The wool ward catches the fire packet on the sheep. A companion reacts to the three slashing damage that lands and gains cover before its own impact. It keeps 20 vitality, and the ward spends two charge. An exposed bystander still takes five. Save and reload before impact give the same outcome as direct settlement.

This is an ordered burst rule for the Lantern adapter. Target selection remains fixed for the burst. Other area spells continue to use their configured landing rules.

**Verification.** All 113 focused tests across the Round 49 files passed in the shared checkout. Architecture, rules and scoped diff checks passed.

## Round 51. A ward previews contact without triggering damage reactions

**Headless verified.** The optional impact port checks whether instant vitality loss would reach a target before applying any world operation. The Lantern ward absorbs two fire damage. The sheep's damage reactor receives one event for the three slashing damage that lands and grants the next target cover. The world chain records one vitality loss for the sheep. Direct and reloaded settlement agree. The preview uses the ordinary contact and defense checks. Other effect families continue through their existing settlement paths.

**Verification.** The shared checkout passed 125 focused tests across heredity, engine host, spell contact, fire-resistant lining, Moonblade contact and contest, brew body delivery, effect grammar and world substrate. Architecture, rules and scoped diff checks passed with existing rule warnings. The isolated-output build passed with the existing duplicate-key warning. The proof uses the opt-in headless fixture.

## Round 52. A permanent evolution can settle under a temporary form

**Headless verified.** A permanent route can opt into preserving active temporary forms. Sun Molt spends one prism and produces one husk while the same sheep wears Storm Mantle. Its permanent form becomes Beacon Fleece and the Mantle still supplies a 16-light Stormflash. Reloading across the original expiry reveals Beacon Fleece in time for an 8-light flash. Explicit release after reload also reveals Beacon Fleece. Removing the prism before settlement leaves the original base, Mantle and charge intact, with no husk. The saved and uninterrupted molt settlements agree. Existing routes default to waiting for reversion. The preserve policy is local to the authored route and uses the existing form properties, so it needs no save migration.

**Verification.** Shared checkout at `f0430dde2` plus local changes passed 103 focused tests across heredity, creature lifecycle, breeding, habitat care, living foundation, holder lifecycle, engine host and spell contact. Architecture, coverage, rules and isolated-output build passed with existing warnings. The proof exercises the opt-in headless fixture.

## Round 53. Phased herd members become world bodies and return to counts

**Headless verified.** The opt-in [herd adapter](../../src/creature_herd_world.js) couples lifecycle draws and returns to E12 promotion and demotion. The creature lifecycle owns the phased profile and identity serial. E12 owns the world body, its share of herd quantities, and its lineage records. The two counts must agree before and after settlement. The draw uses the saved world root. A creature with an individual world change such as vitality damage stays individual. Each command returns the two resulting slices together, using their existing save formats.

The matched breeding trials promote a sheep with 20 vitality, save, return its 20 vitality and exact phased profile to the herd, save again, and draw the profile into a new identity. The old identity keeps promotion and demotion history. The redrawn sheep breeds with a second promoted sheep. Changing the first parent's linked phase changes its offspring's actual clip from five fine wool to five ordinary wool. An injured body or mismatched count refuses the corresponding command. Wild-clock stock updates for a bound herd need a world-side birth and loss policy for the accompanying quantities.

**Verification.** The shared checkout passed 103 focused tests across heredity, lifecycle, breeding, habitat care, living foundation, holder lifecycle, engine host and spell contact. Architecture, coverage, rules and the isolated-output build passed with existing warnings. The proof uses the opt-in headless fixture.

## Round 54. Wild turnover settles on the bound herd

**Headless verified.** The opt-in herd adapter settles the world to each wild boundary, then applies the lifecycle's actual losses and births in order. The E12 cohort keeps its identity and publishes a count change. A loss routes a proportional share of its quantities to a named row, with the remaining amounts routed on the last loss. A birth draws authored quantities per newborn from its named source row. An out-of-bounds quantity refuses the settlement. Existing save shapes carry the headcount, phased profiles, clock and quantity rows.

Two wild losses leave two sheep and move 40 vitality to the loss row. Four births draw 32 vitality from the birth row and leave six sheep with 72 vitality. Direct, partitioned and reloaded advances agree. A catch-up stopped by the window budget resumes after reload. All six sheep can be drawn as world bodies, with three fine-wool clips from one founding phase and none from the other. The adapter covers aggregate phased populations. Tracked pedigreed wild births and deaths need corresponding body creation and retirement policies.

**Verification.** 115 focused heredity, lifecycle, breeding, habitat, foundation, E12, substrate, engine and spell tests passed. Architecture, coverage and isolated-output build passed. Shared-checkout rules failed on a player-text finding in `src/world_packs/workshop_seam.js:77`, outside this slice.

## Round 55. Tracked wild births and losses settle individual bodies

**Headless verified.** The opt-in wild-world adapter uses the same pedigree and gestation rules as the lifecycle. At a loss it retires the corresponding E12 body and routes its quantities to the configured loss row. At birth it creates the body with the lifecycle's identity and parent IDs, funding its starting quantities from the configured source row. Birth can reference a parent already retired by E12, so a brood conceived before a parent's death keeps its pedigree. The opt-in uses existing save shapes.

The test loses a sire at minute six and routes its 20 vitality to the loss row. After save and reload, the pending brood creates a 12-vitality lamb at minute eight. Its world lineage includes the retired sire, and at maturity its clip yields five fine wool. Direct settlement matches reload. A missing body refuses retirement, and an occupied newborn ID refuses birth. This trial routes quantities to a row on death. A world that needs a physical carcass can supply a remains policy when it has a consumer.

**Verification.** 115 focused heredity, lifecycle, breeding, habitat, foundation, E12, substrate, engine and spell tests passed. Architecture, coverage, rules and isolated-output build passed, with existing warnings.

## Round 56. Physical remains supply a harvest after reload

**Headless verified.** A tracked wild population can supply a remains policy. The E12 end act transfers only the configured quantities from the body into the remains and routes the others to the loss row. The opt-in workshop policy draws a harvest specimen at death from the saved world root and stores it on the remains. The existing harvest working reads that specimen and spends its carcass stock. Older workshop carcasses still read their existing species and time fields.

The wolf-rat trial transfers one carcass stock, routes 20 vitality to the loss row, and records the dead animal as the remains' parent. Reloading the carcass and the pending cut produces one Rat pelt with the original creature ID in its material lineage. An occupied remains ID refuses settlement, and the spent carcass cannot produce a second pelt. The specimen and harvest use the existing workshop law. Additional species can supply a remains policy and a consumer appropriate to their material.

**Verification.** 120 focused tests across enchanted harvest, heredity, lifecycle, breeding, habitat, foundation, E12, substrate, engine and spell passed. Architecture, coverage, rules and isolated-output build passed with existing warnings.

## Round 57. A wild carcass feeds White Boar Gu

**Headless verified.** The opt-in White Boar route transfers one meat stock from the dead boar to its E12 remains. A same-place keeper can feed it to the living White Boar Gu while the meat is fresh. The meal credits the existing living-body satiety account. The separate practice working uses the ordinary Gu custody and control check and spends one part of middle-stage essence to add strength to the keeper. The gain survives loss of the Gu.

The saved fixture refuses practice while hungry, refuses stale meat without spending it, and refuses a repeat meal from an empty carcass. The fresh meal spends the stock and adds eight satiety. After reload, practice spends one essence for one saved strength point. The test's minutes, satiety and strength increments are local calibrations. Downstream strength consumers and the source's pain-limited practice window remain open. The meal and practice follow the chapter 65–70 scene already recorded in the [early duel owner](../../src/world_packs/book_gu_lead_early_duel.js) and the persistent-strength evidence in the [Gu source scout](SAGA_OF_GU_SCOUT_2026-10-24.md).

**Verification.** 134 focused tests across Gu, harvest, heredity, lifecycle, foundation, E12, substrate, engine and spells passed. Architecture, rules and isolated-output build passed. Shared coverage failed on the separate `hp_spells.jsonl` vow case because the runner reported `role-unavailable`.

## Round 58. Saved White Boar strength moves a physical load

**Headless verified.** The opt-in push action reads current body strength, the actual load and an open local path. A capacity-five cultivator cannot push the load-six crate. After the paid practice in Round 57, the same cultivator can push it into camp after the Gu dies and the save reloads. The crate's new location survives another save and reload. Strength remains available, and the ordinary movement effect still respects a tether ward. The crate, load and base capacity are original local values. Round 57 records the chapter precedent for the lasting strength. Round 59 verifies pain-limited practice.

**Verification.** 92 focused Gu, harvest, heredity, E12, substrate, movement and engine tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 59. Pain limits White Boar practice until the body recovers

**Headless verified.** The optional practice pack gives the cultivator a saved exertion account and an authored pain threshold. A paid pulse adds lasting strength and temporary exertion. A pulse that would exceed the threshold refuses at settlement and spends no essence. The world clock clears exertion at one point per minute. This allows bodies with different tolerances and retains the existing practice behavior for bodies without the optional threshold.

The trial earns one strength, refuses both a second pulse due at the same minute and a pulse attempted the next minute, then accepts a paid pulse at recovery. The cultivator finishes with two strength and both essence parts spent. Reloading during recovery and again with the next pulse pending matches direct settlement. The exertion rate and threshold are original calibrations for the pain-limited session in the [early duel owner](../../src/world_packs/book_gu_lead_early_duel.js) and [Gu source scout](SAGA_OF_GU_SCOUT_2026-10-24.md).

**Verification.** 134 focused Gu, harvest, heredity, lifecycle, habitat, foundation, E12, substrate, engine and spell tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 60. The coverage runner exercises Moon Veil and reversion

The [sheep ledger row](../coverage/creatures.jsonl) now points to an executable headless timeline using the existing Lantern Fleece and creature-form laws. The runner checks that Moonbeam refuses in base form with four charge intact. It saves and reloads the pending Moon Veil, verifies a 12-light Moonbeam on the same sheep, then saves and reloads the flash due at expiry. The flash settles for four light with the temporary property gone, the base form intact, and one charge left. Round 13 retains the source precedent and broader fixture proof. The ledger computes `expressed-authored` for this opt-in library case.

**Verification.** 89 focused coverage-runner, creature ledger, Gu body, heredity, lifecycle and engine tests passed. The generated ledger freshness check, shared coverage, architecture and rules passed with existing warnings.

## Round 61. Aborting a contest releases its temporary form

**Headless verified.** A host can abort a contest at its saved tick. Completed exchanges stand, pending far-detail changes settle, and running moves are interrupted. The Lantern caller releases only the Guard Fleece owned by that bout. A different bout cannot clear it. The original body, its base form and its paid charge persist. This uses the existing contest result and working receipt shapes.

In the saved trial, aborting lands the rival's already settled four damage on the sheep and stops the queued Lantern Ram before it can hit the rival. The sheep returns to base form with one charge remaining. A second abort or step leaves the settled state intact. Direct and reloaded outcomes agree. A host replacing a contest can call this abort action before starting its replacement.

**Verification.** 71 focused heredity, contest, Gu contest, engine and creature coverage tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 62. A full habitat can delay husk awakening

**Headless verified.** A place can declare a local wisp capacity for awakening. A wisp body already in that place counts toward the limit, including an older saved wisp without the new identity tag. At capacity, awakening keeps the charged husk intact. After the resident moves away and the save reloads, the same husk awakens a new wisp, which spends its transferred charge to emit six light. Direct and reloaded awakening agree. Places without a capacity property keep their existing behavior. This policy governs awakening. A future movement consumer can consult capacity when routing arrivals.

**Verification.** 82 focused heredity, creature lifecycle, holder lifecycle, world substrate, engine host, coverage, Gu meal and harvest tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 63. A husk wisp recharges and draws a forager

**Headless verified.** A place can opt into wisp basking. In unshaded daylight the world clock restores one charge to an empty wisp. Shaded daylight preserves the empty reserve. A long advance and a partitioned advance with reload stop at the same reserve. The same wisp spends that charge after dusk to emit six light. An existing light forager follows the glow through a real path after reload, before the glow fades. In the matched run without the glow the forager stays put. The wisp's parent lineage survives. Basking and its charge are original local rules.

**Verification.** 71 focused heredity, coverage, substrate, holder lifecycle, engine, Gu meal and harvest tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 64. Lantern path travel checks the wisp habitat at arrival

**Headless verified.** Awakening and Lantern path travel share the same local wisp count, including legacy bodies identified by base form. A full destination refuses before travel starts. A path that starts with space rechecks after its travel time elapses. In the saved trial, a relocation spell fills the last spot during the crossing. The spell settles and the traveler remains at its original place. With space available through arrival, the same traveler crosses and its location survives reload. This policy applies to the Lantern path action and awakening. A spell that should itself check capacity needs that policy at spell landing.

**Verification.** 77 focused heredity, creature coverage, substrate, holder lifecycle, engine host and spell contact tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 65. Relocation effects respect wisp habitat capacity

**Headless verified.** The Lantern pack supplies a position-effect admission check using the same count as awakening and path travel. A relocation spell consults the destination at landing. After reload, a wisp that returned while the spell was pending takes the last spot, and the spell leaves its target in the grove with a capacity refusal in the landing receipt. With a vacancy the spell lands. Group relocation allocates a single remaining spot in the ordinary target order, counting earlier moves in the same effect. This is an original Lantern habitat rule. Direct world moves remain available to callers that own their travel policy.

**Verification.** 101 focused heredity, coverage, substrate, effect, holder lifecycle, engine and spell tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 66. A portable husk keeps its molt provenance

**Headless verified.** A keeper can pack the charged Sun Molt husk into a distinct world holder. The E12 creation moves one husk and one charge out of the altar and records the molt and parent in lineage. The parcel can move independently. It awakens only when reunited with the parent in a habitat with room. In the saved trial, the reunited parcel produces a wisp at the grove. The wisp's lineage names both the parent and the parcel, and its transferred charge produces six light. Direct and reloaded awakening agree.

An occupied parcel ID leaves the altar stock intact. Refilling the altar after packing or refilling the spent parcel cannot reuse the original molt. An unpacked husk still has its direct altar route. The portable holder is an original Lantern extension of the separate byproduct in Rounds 11 and 15. The verified route uses world movement for the parcel. Trade and custody checks can be added where a host uses them.

**Verification.** 77 focused heredity, creature coverage, substrate, holder lifecycle, engine and spell tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 67. Trading a husk transfers custody and preserves provenance

**Headless verified.** An altar can name a custodian. The custodian must be present to pack it, and packing assigns custody to that keeper. An agreed local trade settles both barter balances and custody together. A saved parcel with a custodian requires that keeper to be present at awakening. The parent and habitat rules still apply. Existing unassigned husks remain usable through their original route.

In the trial, an underfunded trade leaves custody and both balances intact. A funded buyer pays two barter stock for the same parcel after reload. The seller cannot awaken it. The buyer reunites it with the parent in the grove, awakens the wisp after reload and gets six light. The parcel's molt lineage survives the exchange. Price and custody are original local rules. Negotiation and market listing can supply offers through a host when one uses this action.

**Verification.** 82 focused heredity, creature coverage, substrate, holder lifecycle, engine, spell and harvest tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 68. A queued signal reads the keeper's saved move choice

**Headless verified.** The Lantern body reader can take a live lifecycle provider. The existing working host reads that provider at settlement and can reattach it on reload. Both signals queue while the same sheep knows them. A keeper settles the Beacon species change and retains Steady Signal before either command comes due. After reload, the discarded signal refuses and Steady Signal spends one charge for eight light that lasts three minutes. In the matched run before the keeper's choice both signals settle and spend two charge. The live and restored settlements agree. This follows the local retention rule in Round 26. Callers that supply a fixed lifecycle snapshot can still use that form of the reader.

**Verification.** 75 focused heredity, creature lifecycle, living foundation, creature coverage, engine host and spell contact tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 69. A queued cue keeps the identity of its issuing keeper

**Headless verified.** The opt-in Lantern cue saves its issuing keeper as a working fact. At settlement, the live body reader supplies current custody and keeper-specific training. Two keepers have separately practiced the same sheep's signal. With the original keeper still responsible, the queued signal works. After custody transfers and the pending cue reloads, the old keeper's cue refuses without spending charge. The new keeper's own cue produces four light and spends one charge. Direct and restored settlement agree. The cue uses the same training rules as Round 26 and the live reader from Round 68. Existing generic signal workings retain their current-keeper behavior.

**Verification.** 77 focused heredity, lifecycle, living foundation, creature coverage, engine host and spell contact tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 70. Inherited vigor and an IV change the first harvest minute

**Headless verified.** An opt-in genome can shorten a brood's juvenile period using an expressed locus and an inherited IV. Expression uses juvenile rules and the environment and conditions supplied at conception. The existing brood saves the resolved duration, so reload preserves the first shearing minute. In matched lambs with identical genes, expressed vigor advances the first clip from minute five to three. A guaranteed recovery IV of 31 advances it from five to four even when starvation suppresses vigor. Together they allow the first clip at minute two. The refused early clips and actual credited wool use the existing meadow harvest. The conversion rates and conception-time rule are original Village settings. Round 6 records the pinned IV transmission precedent. Updating growth continuously during juvenile care remains a separate capability.

**Verification.** 86 focused heredity, lifecycle, breeding, habitat, living foundation, creature coverage and engine host tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 71. Juvenile wounds delay growth until care heals them

**Headless verified.** A genome can opt into pausing juvenile growth while a wound is open. The brood and the born creature save that policy. The existing care clock determines when healing ends the pause. Health settlements accrue the elapsed delay, and harvest, development and breeding read the projected maturity. Lantern's live body reader also supplies it to flash and clip. Adult wounds leave the recorded maturity date alone. Existing creatures without the policy keep their prior growth rule.

In the trial, the healthy lamb first clips at minute five. Uninterrupted care lets the wounded lamb first clip at seven. Interrupting care, saving and resuming moves healing to minute seven and the first clip to nine. Shearing at eight refuses. Projecting maturity directly from the restored wound and settling care first yield the same wool. This pause is an original local development rule. Nutrition-driven growth during active juvenile time remains open for a host with timed feeding records.

**Verification.** 87 focused heredity, lifecycle, breeding, habitat, living foundation, coverage and engine tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 72. A paid ration resumes juvenile growth

**Headless verified.** A living world body can opt into a saved juvenile growth account, seeded from its brood's growth duration. Each fed minute lowers the remaining growth by one. The appetite clock cuts the advance at zero satiety, so hungry minutes do not count. The Lantern feeding working spends one Meadow hay from the current keeper and adds a local four-minute ration. A missing ration refuses at settlement. Lantern clip, flash and the companion growth offer read the saved juvenile account alongside their existing requirements.

The continuously fed lamb produces seven Fine wool at minute five. The same lamb runs out of food, saves, reloads and waits until minute six for its paid ration. Its minute-seven clip refuses and its minute-eight clip produces the same seven Fine wool. Reload with feeding or shearing pending agrees with direct settlement. The ration and progress rate are local defaults. The nutrition account and lifecycle wound delay currently gate Lantern abilities independently. A host that needs both to pause one shared juvenile clock, or a nutrition-aware breeding check, still needs that integration.

**Verification.** 86 focused heredity, living foundation, lifecycle, habitat, coverage, brew delivery, engine and Gu meal tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 73. Nutrition and wound recovery can share a juvenile growth clock

The paired Lantern host projects the lifecycle's existing wound and care schedule onto the world body's juvenile growth clock before advancing. For a body with the optional growth account and wound-pause policy, only fed minutes after healing reduce the growth requirement. The substrate splits advances at healing and at food depletion. Callers settle changes to care at the current world minute before the next paired advance.

In the saved trial, the lamb's initial food runs out during treatment. Neither that overlap nor the healed but hungry interval advances growth. After a paid ration, shearing at minute eight refuses and shearing at minute nine produces seven Fine wool. Direct and partitioned advances agree across reload at and before healing. Rounds 74 and 75 verify that the bench and tracked wild mating read nutrition-aware maturity.

**Verification.** 86 focused heredity, living foundation, lifecycle, habitat, coverage, brew delivery, engine and Gu meal tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 74. The breeding bench reads fed growth before spending a clasp

**Headless verified.** The opt-in breeding bench checks that a materialized parent's world body matches its lifecycle identity and habitat. It refuses a parent with juvenile growth remaining before creating the brood or spending a clasp. The lifecycle still checks maturity, custody and fertility. The bench also supports parents represented solely in the lifecycle.

The saved trial reaches the parent's age-based maturity while hunger leaves one fed minute outstanding. The bench refuses and preserves its clasp. After a ration, one fed minute and reload, the same pair starts a brood and spends one clasp. The reloaded brood yields a lamb whose inherited wool IV produces eight Fine wool. This composes the existing clasp and fed-growth rules. Round 75 extends the same maturity check to tracked wild mating.

**Verification.** 88 focused heredity, living foundation, lifecycle, habitat, breeding, creature coverage and engine tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 75. Fed growth changes tracked wild pairing

**Headless verified.** The bound herd reads current world bodies after advancing to each wild boundary. A tracked parent must be present with its matching identity and have no juvenile growth outstanding. The lifecycle still applies age, fertility and relatedness. Its standalone wild clock retains the lifecycle-only behavior.

After reload, a hungry unrelated candidate still needs one fed minute. Under the permissive policy the two eligible siblings pair. Under the stricter kinship policy no pair forms until the candidate receives a ration and matures at the next window. In the matched earlier-fed branch, the unrelated candidate pairs in the first window, and the reloaded offspring carries both parents in its world lineage and yields five Fine wool. This uses the existing pedigree and nutrition policies. The fixture provisions satiety directly. Autonomous food acquisition requires a feeding producer for the habitat.

**Verification.** 96 focused heredity, foundation, lifecycle, habitat, breeding, creature coverage, engine and holder lifecycle tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 76. Wild grazers eat from finite habitat stock

**Headless verified.** The optional meadow grazing pack lets a marked living body take one unit of local meadow forage when its satiety reaches zero. The habitat pays the stock debit and the existing appetite account receives four ration-minutes. At the same minute competing bodies settle in ordinary holder order. The second grazer sees the spent stock.

In the tracked flock, grazing replaces the manual satiety credit from Round 75. The unrelated juvenile eats at minute five, matures at six and pairs under the strict kinship policy. Another hungry grazer can take the last unit and delay that pairing. The earlier grazing branch produces a lamb that yields five Fine wool. Reload between the meal and mating matches uninterrupted advancement. The stock and ration are original local rules. Seasonal replenishment and travel to forage are separate habitat behaviors.

**Verification.** 108 focused heredity, foundation, lifecycle, habitat, breeding, coverage, engine, holder lifecycle and substrate tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 78. A wild grazer can visit a neighboring patch

**Headless verified.** A grazer with an authored home can follow an open grazing path to a stocked neighbor with a way back. Departing, eating and returning settle on successive world boundaries. The patch pays for the meal. The lifecycle still owns the animal's home and pedigree, while its world body records the current place. A visiting animal cannot join a home mating window. A due brood waits if its carrier is away.

The saved trial consumes the neighbor's last forage unit, misses the mating window while away, then returns and pairs. The reloaded brood produces five Fine wool at its first clip. Closing the path preserves the stock and prevents the pairing. A separate saved brood waits for its carrier to return before birth. The dedicated paths and one-boundary actions are local defaults. Longer trips and changing the animal's permanent home remain separate.

**Verification.** 108 focused heredity, foundation, lifecycle, habitat, breeding, coverage, engine, holder lifecycle and substrate tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 77. Seasonal regrowth supplies a wild mating window

**Headless verified.** A meadow can opt into forage regrowth by declaring its capacity. The growth law reads the existing sky season, adding up to two units per minute in spring and one in summer. Autumn and winter preserve the remaining stock. The world cuts advancement at the first available forage and at calendar boundaries, so grazers can use new stock in time for the next mating window.

In the tracked trial, summer regrowth feeds the hungry unrelated juvenile just before autumn. It matures and pairs under the strict kinship rule as autumn begins. After another reload the lamb is born and later yields five Fine wool. Starting the same empty meadow in autumn leaves the juvenile hungry and no pair forms. The regrowth rates and capacity are original meadow settings. Grazing still reads the local place. Searching neighboring places for food remains open.

**Verification.** 108 focused heredity, foundation, lifecycle, habitat, breeding, coverage, engine, holder lifecycle and substrate tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 79. Wild grazers can reach forage across multiple paths

**Headless verified.** A grazer can opt into a longer search range in links. It uses the existing world route reader to choose a stocked patch within range of home that has an open route back. It moves one link per grazing decision, rereads the route and stock at each boundary, and returns home when fed. The default range is one link.

In the tracked trial, a two-link search finds a patch beyond an empty ridge. Closing the second link while the juvenile is on the ridge sends it home hungry and preserves the forage. With the path open, the grazer eats, misses a mating window while returning, and pairs after getting home. Saving on the ridge in both directions matches a single advance, and the reloaded brood yields five Fine wool. The world link cost ranks routes. Travel duration still follows the local one-link-per-decision rule. Permanent relocation remains open.

**Verification.** 108 focused heredity, foundation, lifecycle, habitat, breeding, coverage, engine, holder lifecycle and substrate tests passed. Architecture, rules, coverage and isolated-output build passed with existing warnings.

## Round 80. A tracked wild creature can join another herd

**Headless verified.** The relocation operation checks the world body, both bound herds, an open grazing path and space at the destination. It moves the existing body and updates its grazing home and wild herd membership. Its natal cohort, identity and genes stay with it. Existing saves use the natal cohort when they have no explicit wild herd. Wild mating and tracked loss use the current herd.

A reloaded immigrant pairs with the resident in the new habitat. Reloading the pending brood produces the same lamb as uninterrupted advancement. Its pedigree names both parents, its natal cohort is the receiving herd and its first clip yields five Fine wool. Closed paths and full habitats refuse the move. Round 81 verifies relocation with a pending brood.

**Verification.** 107 focused headless tests passed across heredity, lifecycle, habitat, breeding, coverage and world settlement. Architecture, rules, coverage and isolated-output build passed with warnings in the shared checkout.

## Round 81. A wild brood follows its carrying parent

**Headless verified.** Once both habitat clocks have settled through the move, an open grazing path can carry a pending brood to a compatible destination cohort. The operation changes the settlement herd and eventual natal cohort together. It preserves the scheduled due time, inheritance and both parent IDs. Moving the other parent leaves the birth with the carrier. Older saves that inferred the birth cohort still load and settle after that parent moves.

The saved trial moves the carrying sheep west at minute two. The east herd records no birth. The west herd delivers the same linked lamb at minute four with the same pedigree, and its first clip yields five Fine wool. Advancing the two clocks in either order at the birth boundary yields identical saved state. An unsettled destination clock and an incompatible receiving cohort each refuse the move. Round 82 verifies a separate receiving cohort for hybrid offspring.

**Verification.** 107 focused headless tests passed. Architecture, rules, coverage and isolated-output build passed with existing shared-checkout warnings. The move is exposed through the headless herd operation.

## Round 82. A hybrid brood can join a distinct receiving cohort

**Headless verified.** A sheep carrying offspring from a ridge-sheep cross moves to a sheep herd while the pending brood moves to a separate hybrid cohort in the same refuge. After reload, the refuge delivers the same hybrid at the original due time. Both parent species and IDs survive, the ridge crimp allele remains in phase, and the newborn receives 12 vitality from the refuge birth policy. Its first clip yields nine Fine wool. The source herd records zero births. Reloaded and uninterrupted settlement produce the same state.

New wild broods retain their genome ID. A same-species phased cohort with a different genome refuses the move. Birth validates the saved brood against the receiving policy's genome and allele definitions. Older saves may omit the genome ID and use the phased source cohort when available. Reopen for an authored rule that translates a pending brood between distinct genomes.

**Verification.** 107 focused headless tests passed. Architecture, rules, coverage and isolated-output build passed with existing shared-checkout warnings.

## Round 83. Herds with different intervals share one world clock

**Headless verified.** The shared habitat advance settles the earliest due window before moving the world farther. It uses habitat ID order for simultaneous windows and refuses an advance that would skip a due habitat without a supplied policy. A call settles up to 64 windows. The world and habitat ledgers in the normal save resume from that point, with the host supplying the policies again.

The hybrid moves between two- and three-minute habitat clocks. Its saved due time stays at minute five. The receiving herd first gets a settlement window at minute six, when it delivers the lamb. The resulting lamb keeps both parents and yields nine Fine wool at maturity. Saving before the receiving window and reversing the order of the supplied policies produce the same state. A second save at the 64-window budget also resumes to the same state as a split advance.

**Verification.** 107 focused headless tests passed. Architecture, rules, coverage and isolated-output build passed with existing shared-checkout warnings.

## Round 84. Moon Veil can change a brood's gestation

**Headless verified.** A world may supply a breeding-bench rule that checks one parent's effective form at conception and supplies a local gestation duration. The ordinary bench still uses its supplied duration. The test uses the existing Moon Veil route, which spends one coat charge, and the existing clasp, which spends one unit of bench stock. Trying the special route in base form or at the exact minute of reversion preserves the clasp and creates no brood.

The trial authors seven minutes of gestation under Moon Veil and ten under the ordinary route. Conception occurs at minute eleven in both branches. The carrier reverts before birth, and after reload the saved brood remains due at eighteen. The lamb's first clip settles at twenty-one, three minutes ahead of the matched control, with the same genes, IVs and wool output. This is an original local form rule. Worlds can choose the applicable form and duration. Continuous form requirements during gestation remain a separate rule.

**Verification.** 108 focused headless tests passed. Architecture, coverage and isolated-output build passed. The shared rules check failed on two new player-text findings in the separate Hogwarts spell pack.

## Round 85. An individual measurement selects a permanent branch

**Headless verified.** The opt-in Lantern growth offer reads a sheep's individual height from its identity and the saved world draw root. The paid molt rechecks maturity and height when it settles. The original trial rule uses Beacon Fleece for heights of 70 cm and above and Hearth Fleece below 70 cm. Both spend one charge. The wrong branch refuses and preserves charge. The existing coat flash reads the permanent form and settles eight or twelve light respectively.

Matched sheep with identical genes draw different heights and keep their IDs through the molt. Reloading the pending workings and offering them in reverse order yield the same settlement. The trait comes from the existing living-body measurement and needs no new save field. The host opts in by attaching the stature reader and offering the growth working. The cutoff and form effects are local Village rules. The pinned Pokémon Essentials Silcoon and Cascoon callbacks establish the precedent for an identity-stable split at growth. [Pinned evolution source](https://github.com/Maruno17/pokemon-essentials/blob/8c5911e4a4b07b07e832e4bb0d5d8859e88b4a9b/Data/Scripts/010_Data/001_Hardcoded%20data/007_Evolution.rb#L225-L238)

**Verification.** 122 focused headless tests passed. Architecture, coverage and isolated-output build passed. The shared rules check still fails on two player-text findings in the separate Hogwarts spell pack.

## Round 86. The keeper can teach a new signal during the molt

**Headless verified.** A Lantern species-molt command can carry a chosen lesson through save and reload. The keeper can choose a new Quick or Steady Signal, with an optional separate choice of a previously practiced signal to retain. The lifecycle adds the selected lesson to the current keeper's training when the same body changes species. The lesson uses the existing prism payment and is settled with the same pending working. Commands without a lesson keep their earlier behavior.

The reloaded trial teaches Steady Signal to an untrained sheep. The learned cue spends one coat charge and lights the pen for eight. The other cue refuses and preserves charge. Choosing the quick signal in a matched saved run reverses which cue works. An unavailable lesson preserves the prism. A competing molt that loses access to the prism earns no lesson. Continuous instruction outside the molt still belongs to the ordinary practice rules.

**Verification.** 124 focused headless tests passed. Architecture, rules, coverage and the isolated-output build passed with existing shared-checkout warnings.

## Round 87. The coverage runner follows Moon Veil from dusk to daylight

**Headless verified.** The sheep coverage row now exercises both the timed route from Round 60 and the world-driven route from Round 14 in one timeline. The sky law starts Moon Veil at dusk and spends one charge. Moonbeam then spends another charge for twelve light. A saved relocation spell brings the same sheep into daylight before timed expiry, and the arrival event releases its form. The next Moonbeam refuses, leaves the barn unlit, and spends none of the charge replenished by daylight.

The runner loads the existing opt-in moon cycle pack and uses its ordinary spell-working route. The sheep remains computed as `expressed-authored`. Other breeding, training and harvest proofs still use their focused tests with the lifecycle save as well as the engine save.

**Verification.** The regenerated creature ledger passed its freshness check. 81 focused headless tests passed. Shared coverage, architecture and rules passed with existing warnings.

## Round 88. The coverage runner follows the Sun Molt into a second creature

**Headless verified.** After the pasture sheep reverts in daylight, the saved Sun Molt spends a prism, makes the same sheep Beacon Fleece and leaves a husk on the altar. An uncharged husk refuses awakening. The timeline moves one charge from the sheep to the altar and saves again. An occupied offspring identity refuses, then the same stock awakens a distinct wisp through the existing lifecycle operation. The altar loses both its husk and its charge. After another reload, the wisp spends its transferred charge and lights the barn for six.

The sheep ledger still computes as `expressed-authored`. This timeline uses the direct altar route. Round 15 retains the source precedent, and Rounds 66–67 cover the portable husk, its lineage and trade.

**Verification.** 89 focused headless tests, ledger freshness, shared coverage, architecture and rules passed with existing warnings.

## Round 89. Creature coverage checks the wisp's saved parentage

**Headless verified.** The coverage runner can now read the creation parents from the world's identity history. The Sun Molt timeline checks that the pasture sheep is the wisp's parent at awakening and again after reloading the pending glow. An intentionally wrong parent assertion fails even though the glow still produces six light. The check uses the existing saved lineage and needs no new save fields. The earlier genetics checklist now points to the completed pleiotropy, pedigree, paid assay and IV aid proofs.

**Verification.** 147 focused headless tests passed across creature coverage, heredity, lineage, engine and potion timelines. Creature ledger freshness, shared coverage, architecture and rules passed with existing warnings.

## Round 90. A spent wisp can feed on habitat nectar

**Headless verified.** A place can provision one or more units of wisp nectar. A spent wisp consumes one unit on a world boundary and gains one glow charge. The coverage timeline reloads the spent wisp in a shaded barn, then verifies that the same creature feeds and lights the barn again. When the nectar is gone, a further glow refuses. A second trial puts two empty wisps at one stocked patch. The first takes the only unit in ordinary holder order, the other stays empty, and reloaded settlement agrees with direct settlement.

Nectar and the one-unit conversion are original local rules. The existing sunlight route still works at basking sites. Nectar is provisioned stock in this case. An authored flower-growth producer can replenish it when a world needs that cycle.

**Verification.** 99 focused headless tests passed. Creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 91. Daylight regrows nectar for spent wisps

**Headless verified.** A flower patch with a nectar account and an authored capacity grows one unit per minute in unshaded daylight. Shade and darkness stop growth. The clock stops at the first unit in an empty patch so a waiting wisp can feed during a long advance. The existing feeding law spends the unit and restores one charge.

The trial empties a patch in darkness. After save and reload, daylight supplies one unit and the first wisp feeds. It spends that charge for six light and keeps its parentage. The second wisp feeds at the next growth boundary. Once both reserves are full, the patch accumulates up to its capacity of two. Long and minute-by-minute advances agree on charge and nectar balances. The rate and capacity are local defaults. Growth follows the habitat's daylight, and wisps currently feed at their current place.

**Verification.** 99 focused headless tests passed. Creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 92. A spent wisp can fly to nearby nectar

**Headless verified.** An authored wisp path lets a spent wisp seek nectar when its current place has none. The wisp chooses a stocked neighboring patch with room through an open path. It moves on one decision boundary and can feed at the next. Link cost ranks the available exits. Local nectar takes priority.

The saved trial holds the wisp back while a resident fills the patch. After a vacancy, a closed path still prevents travel. With the path open, the same wisp flies to the patch. Saving after arrival and reloading before feeding match uninterrupted settlement. The wisp consumes the last unit, glows for six, and keeps its lineage. This original habitat rule uses one direct hop. Multi-hop travel with transit time remains available for a future habitat with that need.

**Verification.** 99 focused headless tests passed. Creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 93. A spell reveals a carried coat trait without changing inheritance

**Headless verified.** The opt-in Mist Lantern line uses the same coat alleles and the existing environment-dependent expression rule. Its coat contribution appears at 60 percent humidity. The live creature reader supplies the local humidity at settlement to the flash and the clip. The body's stored charge limit still follows its inherited coat. A suppressed flash spends no charge.

In the saved trial, the existing water effect raises the pen from 40 to 70 percent humidity. The same sheep spends one charge for four light, and the clip credits seven Fine wool where the dry control credits five. Returning to dry air removes the extra yield. Matched broods conceived in wet and dry air produce identical offspring after reload. Round 19 verifies the distinct case where a permanent molt changes the inherited alleles. The humidity threshold and yield are original local values.

**Verification.** 117 focused headless tests passed, along with architecture, coverage, rules and the isolated-output build. The game entry remains outside this headless route.

### Headless creature evidence index

| Requested domain | Direct outcome evidence | Condition for additional work |
| --- | --- | --- |
| Genetics and expression | Rounds 6–10, 18, 32–38, 93–99 and 125–126. Linked phase changes wool grade, an IV clasp changes bundle count, pedigree changes maturity, a mapped hybrid keeps fertility, and both incubation and live humidity change flash and yield. | Add a mapped cross or a new stat reader when its world has an authored outcome. |
| Development, care and training | Rounds 17, 45, 68–75, 86, 121–133 and 141. Paid food and care change the first clip and breeding readiness. A movable egg survives its parents, can be rescued from exposure, and can acquire independent conditions that change fleece and flash. A wash temporarily restores one coat contribution. A graft, topical brew, repair spell or harvested Vitality Leaf starts lasting repair. Brewed sedation interrupts a trained cue. A paid molt can teach a selected cue, and keeper practice and inherited expression both gate the paid signal. | Reopen other treatment mechanisms when they change an authored creature outcome. |
| Breeding and herds | Rounds 20, 35–37, 53–57, 74–84 and 114–120. Saved phased counts, standing selection, wild births and losses, simultaneous habitat clocks, carried hybrid broods, and births after custody changes in both directions all have consuming outcomes. | Reopen genome translation during relocation when a world supplies a mechanism that changes the pending offspring's genome. |
| Harvest and byproducts | Rounds 11, 15–16, 28–31, 56–57, 66–67, 88–92, 134, 138–140 and 146. Charged wool powers a lamp and a ward. A carcass feeds a Gu. A paid molt produces a distinct wisp with durable parentage and usable charge, including through a saved charge working and a packed husk. A wisp can save a timed flight with an intermediate stop, eat at the destination and spend the resulting charge on a glow. | Add another material or travel rule when a habitat or recipe supplies a different outcome. |
| Evolution and magical interactions | Rounds 12–16, 19, 21–27, 39–52, 61, 65, 84–89, 93 and 135–138. Stable identity survives permanent and reversible forms. Live moon, arrival, contest, equipment and care conditions change settlement. Real Gu feeding changes release, spell contact changes form or expression, and a repaired coat supports Moon Veil and Sun Molt with a distinct husk wisp. | Exact franchise tables require a world that uses those species. Headless evidence here exercises original creatures. |

The accepted route for this work is an opt-in headless fixture. Player-facing descriptions, a fresh-life route and browser import remain separate evidence for any later playable integration under AD43.

The [heredity suite](../../tests/heredity.test.js) checks the genotype and phenotype comparisons, paid workings, and save boundaries. The [breeding suite](../../tests/breeding_program.test.js) follows the live herd through paired saves, egg development, treatment, shearing and evolution. The [creature coverage suite](../../tests/coverage_creatures.test.js) checks the published executable examples and ledger freshness. The [creature ledger](../coverage/creatures.jsonl) includes wider source intake, so its source rows also cover creatures without an authored runtime case.

The latest shared-checkout `npm test` completed with 7,252 passes, two skips and three failures. Round 142 records the failing checks and the targeted rerun. The creature suites covered by this index passed.

## Round 94. Pepperup steam can reveal a nearby creature's coat

**Headless verified.** The creature test composes the existing Pepperup oral serving and body-steam law with the Mist Lantern reader. The serving transfers six units of extract from the flask to a nearby recipient. The steam raises the pen humidity by one point per minute. After reload, a flash due at 59 percent humidity refuses without spending charge. A second flash due at 60 spends one charge and produces four light. A two-unit serving leaves four in the flask and never raises the humidity.

Airing out the pen drops it below the threshold even while steam continues. In a separate branch, moving the sheep into a dry hall suppresses its next flash while the already-landed light stays in the pen until fade. The sheep keeps its genes. The existing Pepperup source case (HPPE059) supports steam from the recipient. The humidity conversion and the sheep's response are original mechanics. This proof uses the shared dose owner and introduces no brew runtime change. An automatic ventilation cycle would need an authored rate in the habitat.

**Verification.** 143 focused headless tests passed across heredity, dose delivery, potion timelines, spell contact, Gu meal, creature coverage and engine settlement. Architecture, coverage and rules passed with existing warnings.

## Round 95. Ventilation suppresses the mist coat on the world clock

**Headless verified.** An opted-in Lantern habitat can set a ventilation rate in humidity points per minute. It combines with steam through the existing world rate ledger. The same sheep that flashes at 60 percent humidity refuses a saved flash due one minute after a two-point vent opens. Pepperup still supplies one point per minute, so the air reaches 59 and the refusal preserves coat charge. Already-landed light stays until its normal fade.

A one-point vent balances the active steam through the saved dose's expiry. After expiry it lowers the humidity to 59 and the next flash refuses. The two rates and original mist threshold are authored habitat settings. The rate is saved as a place property, and places without it need no migration.

**Verification.** 80 focused headless tests, creature ledger freshness, architecture, rules and the isolated-output build passed. The broader potion test and shared coverage check both fail on the separate Gurdyroot infusion case, whose third step leaves a required divide role unbound.

## Round 96. Mist wool keeps its harvest and charge after the air dries

**Headless verified.** The Pepperup trial now follows the coat into a physical output. A clip due at 59 percent humidity yields five Fine wool. The matched clip due one minute later at 60 percent yields seven and transfers both remaining coat charges into the wool. After ventilation lowers humidity and a pending lamp reloads, the wool still has seven bundles and powers eight light at the cost of its two charges. The lamp fades at its original deadline. In the separate flash branch, drying suppresses a second flash, and the first flash stays lit until its own fade.

The existing breed, steam, clip and lamp laws provide this evidence. The headless trial uses the local Mist Lantern threshold and the existing wool stock account.

**Verification.** 80 focused headless tests, creature ledger freshness and shared coverage passed. The earlier Gurdyroot coverage failure did not recur on this run.

## Round 97. The Mist Lantern coat charges when the trait is expressed

**Headless verified.** Mist Lanterns now need both daylight and the coat's humidity threshold to collect charge. The existing world rate watches cut advancement when humidity crosses the threshold in either direction. Dry air pauses charging and preserves stored charge. The inherited storage limit remains in effect when the air is humid again.

In the Pepperup trial, an empty coat stays empty until humidity reaches 60. It gains its first charge during the next minute and fills to four. Long and split advances with reload give the same body. A vent lowers humidity and stops further charging. A dry flash preserves the three stored units, while a humid flash after dusk spends one unit and gives four light. The rule applies to the opt-in Mist Lantern coat.

**Verification.** 92 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 98. Sun Molt reads live mist-coat expression before spending the prism

**Headless verified.** Sun Molt checks the Mist Lantern humidity threshold at its deadline. The same sheep has four banked charges in both trials. A vent drops the pen to 59 percent before the saved molt settles. The route refuses, preserves the prism and charge, and produces no husk. With humid air at settlement, the original body becomes Beacon Fleece and spends one prism to leave one husk. After reload the sheep flashes for eight light. One charge moved from that sheep to its husk then awakens a distinct wisp whose saved parentage names the sheep.

This is an original extension of the item-triggered route in Round 12 and the mist threshold in Round 93. The ordinary Lantern uses the existing Sun Molt requirements. The humidity requirement here belongs to this specific permanent route.

**Verification.** 92 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 99. A wild Mist Lantern lamb inherits a working coat

**Headless verified.** A world can register Mist Lantern sheep as a distinct kind with its own genome. When the wild birth policy builds the newborn's body using the Lantern coat initializer, its saved species supplies the mist coat rule. The host can still mark an individual coat explicitly for earlier fixtures.

Two tracked parents breed through the wild clock. Reloading the pending brood produces the same lamb with linked genes and both parents in its world lineage. The same reloaded lamb charges and flashes for eight light at 60 percent humidity, and its first clip yields nine Fine wool and two charge. At 59 percent the flash refuses, and the clip yields five. The kind and its humidity response are original opt-in Village rules. Mixed-kind reproduction can use the existing cross rules when a world authors the offspring kind and genome.

**Verification.** 107 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and the isolated-output build passed with existing warnings.

## Round 100. A wild-born Mist Lantern can become a Beacon breeding kind

**Headless verified.** The optional paired Sun Molt can convert a Mist Lantern sheep to the Beacon species. Successful settlement clears the body's mist requirement and preserves the animal's phased genes and wild parentage. The live coat reader uses the Beacon genome for flash and harvest. If the saved molt settles below the mist threshold, it leaves the source species and prism intact.

The wild-born trial reloads the pending molt, pays one prism in humid daylight, then dries the habitat. The same adult flashes for sixteen light in dry air and yields eleven Fine wool in the matched clip. A later brood with a Beacon mate reloads and delivers a Beacon lamb whose first clip also yields eleven Fine wool. This species change is a separate opt-in settlement alongside the form-only Sun Molt in Round 98. The compatible locus map and dry-air coat are original Village settings.

**Verification.** 107 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 101. A permanent molt preserves the brood already conceived

**Headless verified.** A saved Mist Lantern brood retains its due time, phased genes and parent IDs when its carrier becomes Beacon. The reloaded brood delivers a Mist Lantern lamb whose first clip yields five Fine wool in dry air and nine in humid air. A later brood with a Beacon mate delivers a Beacon lamb that yields eleven in dry air. A refused molt leaves the pending brood and prism intact.

An evolved animal now uses its breeding cohort for wild mating and loss when it has no explicit relocated herd. Its natal cohort stays in its saved identity. After release and reload, the same evolved sheep mates in the Beacon herd, and its wild-born offspring yields eleven Fine wool. This extends the cohort and species laws already used in Rounds 80 and 100.

**Verification.** 107 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 102. The wild Beacon herd creates a lamb that can flash and be clipped

**Headless verified.** The wild Beacon birth now runs through the paired lifecycle and world clock. The Lantern coat initializer gives a Beacon newborn its permanent form from its saved species. The world materializes the lamb with both parents in its lineage, including the evolved adult whose own natal cohort is Mist Lantern.

After saving the wild brood and reloading, the lamb matures and charges in dry daylight. Its first clip credits eleven Fine wool and two charge to a wool holder. In the matched flash branch it spends one charge and emits sixteen light. The trial binds the Beacon cohort to its world holder and uses the existing tracked birth rule.

**Verification.** 107 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 103. A wild Beacon lamb regrows its coat while its wool powers a lamp

**Headless verified.** After its first clip the wild-born lamb has no charge and a saved four-minute regrowth interval. A reloaded flash refuses during that interval. The coat is still empty at regrowth, then gains one charge in the next minute of daylight. Continuous and split advances match across both the world and herd ledgers. After dusk the same lamb spends that charge and gives sixteen light, with both parents still in its lineage.

The first clip retains its eleven Fine wool and two charges through regrowth. A reloaded lamp spends the wool charge for eight more light. The lamb's flash and lamp reach twenty-four light together, then fade separately to eight and zero. This extends the wild-birth proof through the existing harvest, regrowth and lamp owners.

**Verification.** 107 focused headless tests passed. Creature ledger freshness, shared coverage and scoped diff checks passed.

## Round 104. A Mist Lantern lamb is born with its base form

**Headless verified.** The tracked birth initializer now sets Lantern Fleece on the newborn Mist Lantern body from its species. The saved wild-born lamb uses that base form to enter Moon Veil for one charge. After reload, Moonbeam spends one more and produces twenty-four light. The same lamb explicitly reverts, and a saved Moonbeam queued afterward refuses without spending charge. The matched daylight branch can settle the permanent Sun Molt using the base form set at birth.

The opt-in birth policy supplies the initializer. Earlier headless saves without a base form still require their host to assign it when bringing those bodies into a form route. The ordinary Lantern and Beacon form laws supply the same settlement rules as Rounds 12–13.

**Verification.** 107 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 105. Older Mist Lantern saves recover their missing base form

**Headless verified.** The opt-in paired restore uses the saved lifecycle species, matching world body and mist coat flag to fill in a missing Lantern Fleece base form. It leaves existing forms and older unmarked bodies alone. Reapplying the repair produces no further world changes.

The older-shape save reloads with the same charge and pedigree and can enter Moon Veil. A second save missing its base while Moon Veil is active retains the active form, settles a twenty-four-light Moonbeam and returns to Lantern Fleece on release. The paired host invokes the repair after deserializing both slices. The shared save formats remain compatible.

**Verification.** 107 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 106. Dusk and manual Moon Veil share the mist threshold

**Headless verified.** The automatic dusk reactor and the manually queued Moon Veil use the same settlement rule. At 59 percent humidity, the Mist Lantern sheep stays in its base form and keeps all four charges. Its manually queued attempt also refuses after reload. At 60 percent, the sky's dusk event spends one charge and starts Moon Veil. Reloading just before dusk matches uninterrupted settlement. The ordinary Lantern sheep still enters Moon Veil at dusk in the same dry pen and returns to base form on arrival in daylight.

The humidity check governs entry to Moon Veil. Once active, the form follows its existing expiry and release rules, and Moonbeam reads current humidity independently.

**Verification.** 107 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 107. Dry air can release an active Mist Lantern Moon Veil

**Headless verified.** A Mist Lantern body can opt into needing humid air to sustain Moon Veil. The moon-cycle pack watches the existing humidity threshold and releases the Moon Veil layer when the air dries at a world boundary. The form release settles before a working due at the same minute.

In the saved trial, ventilation drops the pen from 60 to 59 percent humidity. The same lamb reverts before its queued Moonbeam, which refuses and preserves the four remaining charges. An earlier beam still contributes twenty-four light until its normal fade. Direct and reloaded settlement match. Without the sustaining flag the form continues on its existing timer, and Moonbeam still reads the current coat expression.

**Verification.** 107 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 108. An inherited coat modifier can mask fleece only in dry air

**Headless verified.** A genome can now give an epistasis rule an environmental exception. The suppressor still reads the carried allele strength. Its mask lifts when the world supplies the authored threshold. Existing epistasis rules retain unconditional suppression.

In the saved hybrid brood, one parent supplies a linked coat allele that masks the lamb's F/F fleece at 59 percent humidity. That lamb yields seven ordinary Wool. At 60 percent it yields seven Fine wool with the same alleles. A matched lamb that receives no suppressing coat allele yields five Fine wool in dry air. The rule belongs to the authored hybrid genome and uses the existing expression and harvest owners. This uses the phased transmission precedent recorded in Round 7 and original humidity values.

**Verification.** 108 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 109. Phased herd selection reads humidity at each birth window

**Headless verified.** A bound phased herd can opt into reading named quantities from its habitat after the world advances to each birth window. Those readings supply the existing expression and selection rules. In the saved trial the pen starts at 60 percent humidity. Ventilation lowers it before the first birth window, so the selection policy favors sheep whose fine fleece still shows in dry air. The comparison pen stays humid, where both founder profiles show fine fleece and both remain eligible. After six births and reload, drawing all ten animals yields eight fine clips from the ventilated herd and two from the humid herd when both are clipped in dry air.

The engine and lifecycle saves agree between uninterrupted and split advances. This extends the standing selection policy from Round 20 and the conditional expression rule from Round 108. The live habitat readings currently apply to count-based selection. A named-roster policy can reuse them when tracked mating also ranks candidates by expression.

**Verification.** 109 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 110. Visible fleece breaks kinship ties in tracked wild mating

**Headless verified.** A tracked herd with a saved selection locus can use the same live habitat readings as the count-based herd. The existing kinship limit and preference for lower kinship apply first. When candidate pairs tie on kinship, the selection locus ranks eligible adults by visible expression, then by serial for equal scores. Cross-herd policies still use their existing order until a world supplies a comparable ranking across parent genomes.

In the saved trial, four unrelated adults carry F/F fleece. In dry air the two whose fine fleece shows are paired. In humid air the four tie, and the earlier pair is selected. Both broods create world bodies after reload. Clipping both offspring in dry air credits five Fine wool from the first pairing and five ordinary Wool from the second. The previous strict-kinship trial remains part of the focused suite.

**Verification.** 110 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 111. Cross-herd mating can compare expression in each source genome

**Headless verified.** A tracked cross can name a selection locus for either source herd. The mating window reads the candidate's own genome and the supplied environment. Kinship remains the first criterion. Among equally related eligible pairs, the sum of the chosen expression levels decides the pair, with the existing order resolving equal scores. The world's cross policy supplies the loci again after reload.

The saved trial uses different fleece symbols in the two parents' genomes. In dry air, the two unrelated ridge candidates tie and the earlier one breeds. In humid air the other candidate expresses fine fleece and breeds instead. The existing allele map translates the ridge alleles in the offspring. The reloaded broods settle nine ordinary Wool and nine Fine wool respectively. The validator refuses a locus absent from its source genome.

**Verification.** 110 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 112. Count-based crosses can select traits in their source herds

**Headless verified.** A count-based cross can now name a selection locus in each source genome, like the tracked cross in Round 111. Each source ranks fertile surviving profiles by current expression and draws one parent from the highest expressed rank. Equal expression keeps the ordinary addressed draw. The policy supplies the source loci and environment after reload.

In the two-window trial, a ridge crimp allele only shows at 60 percent humidity. In humid air both drawn hybrids inherit the mapped crimp allele and yield nine bundles each. In dry air the ridge profiles tie and the same draw root yields clips of five and nine bundles. Splitting the wild advance at a save boundary yields the same phased herds. An unknown source locus refuses the policy before turnover.

**Verification.** 110 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 113. A drying habitat changes the next phased cross

**Headless verified.** The bound cross reads live habitat humidity from the world clock. Ventilation takes the pen from 70 to 60 percent before the first birth window, so the first hybrid inherits the selected ridge crimp. At the second window the pen is at 50 percent, so both ridge profiles qualify. In the saved trial the two promoted hybrids yield five and nine wool bundles. A control that stays at or above 60 percent through both windows yields nine and nine. Both promotions keep their share of the herd's coat stock, and the harvest credits survive reload. A saved split between birth windows produces the same world and lifecycle as a single advance.

**Verification.** 110 focused headless tests passed. Creature ledger freshness, shared coverage and scoped diff checks passed.

## Round 114. A wild lamb's development reads the habitat at conception

**Headless verified.** Tracked wild mating now passes its existing habitat readings into the genome's opt-in development rule. The test's inherited vigor expresses at 60 percent humidity and shortens juvenile growth by two minutes. Both broods save their resolved growth duration. Venting before birth leaves that duration intact.

The humid-conceived lamb can be clipped at minute three. The dry-conceived lamb waits until minute five. Both refuse an early clip, materialize their bodies after reload and credit their respective wool at maturity. The rule reuses the conception-time development owner from Round 70. Timed nutrition and wounds can still affect growth through the existing post-birth policies.

**Verification.** 110 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 115. Wild newborns can use their inherited duration as fed growth

**Headless verified.** A tracked birth policy can opt into fed growth with starting satiety and a food rate. It creates a living world body and initializes its fed-minute account from the lifecycle's resolved juvenile duration. The policy refuses simultaneous fixed and derived growth quantities. The existing fixed-quantity birth route remains available.

The saved tracked broods produce lambs with one and three fed minutes remaining. Both accounts reach zero on their expected first-clip minute when fed, and both preserve their full remaining growth when born hungry. After a ration and reload they resume. This uses the same maturation, appetite and stock owners as Rounds 72–75 and 114. A host can author the starting ration and food rate per birth policy.

**Verification.** 110 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 116. A paid ration unlocks the first clip of a wild-born lamb

**Headless verified.** The tracked birth trial now exercises the existing feed and clip workings against the newborn's saved fed-growth account. After the lifecycle's earliest maturity minute, a hungry lamb still refuses its queued clip and credits no wool. The keeper spends one Meadow hay, the same lamb resumes growth for its inherited remaining duration, and the reloaded clip credits five or nine Fine wool according to the inherited Lantern coat.

This proof uses the Lantern harvest genome for the paid clip and separately retains the conditional fleece-selection harvest from Round 114. No new feeding or clipping law is needed.

**Verification.** 110 focused headless tests, creature ledger freshness, shared coverage and scoped diff checks passed.

## Round 117. Wild-born lambs can finish their inherited growth on pasture

**Headless verified.** A tracked birth policy can apply world tags to its newborn body. The trial marks it as a meadow grazer alongside the living body tag supplied by fed growth. The existing pasture law then feeds the hungry lamb from local stock while it is still wild. After reload it spends its inherited one or three fed minutes and can be clipped for five or nine Fine wool. The pasture loses one forage unit, and the keeper's hay remains available.

An empty pasture leaves growth paused. The paid ration comparison from Round 116 still uses the same newborn and maturity rules. The birth policy supplies tags again for later births. The existing body save retains each lamb's tags.

**Verification.** 110 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed with existing warnings.

## Round 118. A keeper can receive a wild grazer where they meet

**Headless verified.** The paired world and lifecycle command takes custody at the actual encounter. The keeper and living creature need to share the receiving habitat, which must have room for the animal. A grazer that was away from its herd adopts the receiving pasture as its new grazing home. The same body retains its identity, pedigree and linked inheritance. The operation uses the existing custody and grazing fields and needs no save migration.

The trial reloads the hungry wild-born lamb during its excursion and refuses a keeper who stayed at the old pen. A keeper who meets it at the pasture can take custody. A full pasture and a repeated claim both refuse. After another reload the lamb eats the pasture's forage, completes its inherited growth and yields five or nine Fine wool there. AR3, AR6, AD38 and AD43 apply. This command is available to opt-in headless callers.

**Verification.** At `db81f1f11` with shared-checkout changes, 110 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 119. A wild-conceived brood can deliver in a keeper’s care

**Headless verified.** The host can settle a due kept birth using the same lifecycle and newborn body initializer as tracked wild births. Taking custody of the carrier keeps the conception record intact. The kept birth uses the carrier's current habitat and keeper. It can use the same authored starting quantities, tags and fed-growth policy as a wild birth. It needs no new saved fields.

The saved brood delivers on its original due minute with the same phased genes, parents, world lineage and inherited growth duration as the matched wild birth. The lamb is held by the carrier's keeper, and its first clip yields five or nine Fine wool. Early settlement, a full destination and a repeated delivery refuse. Reloaded and uninterrupted delivery agree. The kept-birth command is explicit and the wild birth counter stays at zero. AR3, AR6, AD38 and AD43 apply.

**Verification.** At `db81f1f11` with shared-checkout changes, 110 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 120. The herd clock can deliver a brood conceived in captivity

**Headless verified.** A keeper can release a tracked creature into a compatible herd at the actual encounter. The destination clock must be current. The existing wild relocation owner enrolls the same body and routes the pending birth to the selected offspring cohort. Releasing the carrier keeps the other parent's custody and the brood's due time and inheritance. New kept conceptions with genes save their genome ID. Older conceptions can recover it from the phased origin or a compatible genome supplied by the host.

The reloaded wild clock delivers the same linked offspring as the matched wild conception. The herd records one birth, the newborn has both parents in world lineage, and the first clip yields five or nine Fine wool. Release after the due boundary settles at the next eligible window. A nearby stranger and a mismatched genome each refuse. Reloaded and uninterrupted birth agree in both saved slices. The comparison uses the Village sheep and the existing habitat and fleece rules. AR3, AR6, AD38 and AD43 apply.

**Verification.** At `db81f1f11` with shared-checkout changes, 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 121. Wild-born grazers share the fed-growth and wound clock

**Headless verified.** The phased herd clock now uses the same care projection as the Lantern host. A body that carries the juvenile growth account and whose lifecycle opts into wound pauses accrues growth during fed, healed minutes. The projection follows the tracked body during a grazing excursion and uses the existing saved recovery deadline. Hosts settle any change to wounds or care at the current world minute before advancing.

A wild-born lamb eats pasture forage while wounded. Its satiety rises and its full inherited growth requirement remains. After a keeper takes custody and tends it, saving midway through care gives the same healing boundary as a direct advance. A clip due at healing refuses. One paid ration and the remaining fed minutes let the same lamb yield five or nine Fine wool after reload. The matched unwounded lamb from Round 118 can mature on pasture forage alone. AR3, AR6, AD38 and AD43 apply.

**Verification.** At `db81f1f11` with shared-checkout changes, 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 122. A habitat condition can pause a tracked brood

**Headless verified.** A herd can opt into an elapsed gestation requirement keyed to a minimum place quantity. At conception the world stores the brood ID, condition and remaining minutes on the carrier. The substrate advances development at the carrier's current place and splits at a threshold crossing. The lifecycle keeps conception-time inheritance and the earliest due minute. The herd delivers at the first eligible window after development completes. The same saved requirement applies to the explicit kept-birth route after a custody change.

The Village trial uses an original minimum of 60 percent humidity. Ventilation crosses it after one of two required minutes, delaying birth from minute three to minute five. Saving the paused brood and restoring humidity yields the same linked offspring as the continuously humid control, with its development shifted by the delayed birth. After reload it shears for nine Fine wool. Taking custody cannot deliver the unfinished brood. Once the habitat supplies the remaining minute, kept delivery produces the matched offspring and clears the carrier's active gestation. AR3, AR6, AD38 and AD43 apply.

**Verification.** At `db81f1f11` with shared-checkout changes, 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 123. A movable egg incubates separately from its parents

**Headless verified.** A host can lay a pending brood into an individually tracked egg and transfer any remaining development time from its carrier. The egg reads its own current habitat through the existing gestation law. Its hatch is explicit, validates the destination and any keeper, creates the offspring and retires the egg in the same returned settlement. World lineage records the egg and both genetic parents. Older brood saves continue to load without an egg field.

The test moves a paused egg from a dry pen to a humid nursery, saves, then advances through the loss of both parents. The saved egg still hatches. Premature hatching, a remote keeper, a full nursery and a second hatch refuse. The offspring matches the linked inheritance of the carried brood and produces nine Fine wool after reload. The oviparous Lantern fixture and humidity threshold are original test settings. A separately handled egg has an existing source precedent in [HPPE171–172](hogwarts-potion-evidence-2026-11-11/observations.jsonl#L171-L172). AR3, AR6, AD38 and AD43 apply.

**Verification.** At `db81f1f11` with shared-checkout changes, 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 124. Egg exposure can end incubation and release the parents

**Headless verified.** An egg can opt into a cumulative exposure tolerance. Unsuitable minutes spend tolerance while suitable minutes advance incubation. Exhaustion retires the egg through the world identity ledger and records any remaining incubation on the exposure loss row. The paired clock closes a brood after verifying the matching egg's retirement and pedigree, including retirement by another world operation. A missing egg with no matching identity evidence leaves the brood pending.

After the first dry minute the test saves the egg with one minute of tolerance. Restoring humidity lets that egg hatch after reload. Another dry minute retires the matched egg, refuses a hatch and lets the same parents conceive again. The fixture also retires an egg into an ingredient ledger row and verifies that the paired clock closes its brood after reload. The tolerance and humidity threshold are original Lantern settings. The existing Ashwinder record supplies a precedent for time-sensitive handling and a separate ingredient use. [HPPE171–173](hogwarts-potion-evidence-2026-11-11/observations.jsonl#L171-L173). AR3, AR6, AD38 and AD43 apply.

**Verification.** At `db81f1f11` with shared-checkout changes, 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 125. Incubation conditions can change a harvest and an ability

**Headless verified.** An egg can opt into an exposure threshold that counts minutes while it develops. Meeting it saves a condition on the hatchling. Gene expression reads that condition alongside the current environment, and reproduction still draws from the same inherited alleles. The condition also reaches the living-body reader and tracked mating's expression ranking. Older creature saves can omit it.

The matched eggs hatch at the same humidity and produce adults with identical genes, pedigree and maturation. One egg spends its final developing minute at 70 percent humidity and the other at 60. The high-humidity condition suppresses the Mist Lantern coat contribution. At identical adult humidity after reload, the control clips for nine Fine wool and spends one charge to flash for eight light. The marked animal clips for five and refuses the flash with its charge intact. Raising humidity after development finishes gives the control no condition. The local thresholds and coat effect are original. The biological comparison in the root table motivates environmental effects during development. AR3, AR6, AD38 and AD43 apply.

**Verification.** At `db81f1f11` with shared-checkout changes, 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 126. Independent incubation conditions can combine

**Headless verified.** An egg can track several exposure conditions at once. Each condition has its own threshold and saved minutes. A hatchling carries the completed conditions into expression. Older single-condition eggs still accrue exposure and hatch, and older hatchlings still use their saved condition.

Four matched Mist Lantern hatchlings compare neither condition, humidity alone, warmth alone and both. After reload, humidity changes the bundle count from nine to five and suppresses the eight-light flash. Warmth changes Fine wool to ordinary wool. Both conditions yield five ordinary wool and the flash refuses with its charge intact. Genes, pedigree and maturation agree across all four. Duplicate condition IDs refuse at laying. The two thresholds and coat effects are original headless settings. AR3, AR6, AD38 and AD43 apply.

**Verification.** 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 127. An adult wash temporarily restores a suppressed coat

**Headless verified.** An opt-in Lantern working spends one dose of coat wash from the current keeper. For four minutes, flash and clipping use the coat contribution that the incubation humidity condition normally suppresses. The wash acts on those coat outcomes. The animal retains its incubation history and its separate warmth condition.

After reload, the same double-marked adult flashes for eight light and, in the matched harvest branch, clips for nine ordinary wool instead of five. The warmth condition still determines wool grade. A missing dose or an overlapping wash refuses at settlement. A flash due exactly at expiry refuses and keeps its charge. Reloaded and uninterrupted wash settlement agree. The wash, cost and duration are original headless settings. AR3, AR6, AD38 and AD43 apply.

**Verification.** 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 128. A graft can repair the adult coat after humid recovery

**Headless verified.** The current keeper can spend one graft to start a saved coat repair. The tissue needs three minutes in a habitat with at least 60 percent humidity. Dry intervals pause recovery. Once repaired, the coat uses its recovered contribution under the usual local humidity rule. The hatchling's original conditions, genes and pedigree stay on the lifecycle record.

The double-marked adult keeps all three repair minutes after four dry minutes and refuses a flash after the first humid minute. Reload midway through recovery agrees with a direct advance. After the wash would have expired, the repaired adult spends one charge to flash for eight light or clips for nine ordinary wool in the matched harvest branch. The warmth condition still determines wool grade. Missing graft stock and a repeated graft refuse. The graft, recovery time and threshold are original headless settings. AR3, AR6, AD38 and AD43 apply.

**Verification.** 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 129. A topical brew dose starts the same coat repair

**Headless verified.** A measured topical serving moves the repair extract from the flask to the creature through the existing brew dose and liquid contact paths. An eligible Mist Lantern coat reads the active share at contact and opens the same three-minute repair account as a graft. The headless serving starts with a prepared flask. The dose threshold and coat effect are original settings. [Topical repair precedent in the existing unction case](../../src/world_packs/brew_coverage_cases.js#L2232).

The saved working transfers two extract units, leaves two in the flask and clears its transient liquid account. An oral serving and a one-unit topical serving both leave repair inactive. Reload during humid recovery preserves progress. After repair the same adult spends one charge to flash for eight light. AR3, AR6, AD38 and AD43 apply.

**Verification.** 124 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 130. A steeped batch produces the coat repair dose

**Headless verified.** An original Village recipe admits two measures each of moss and binder. The existing brew working reacts them after a two-minute steep, then divides and pours four extract units into the actual flask. Both ingredient lots retain their unspent measure. The batch ledger balances, and reload partway through steeping matches uninterrupted brewing.

A two-unit topical serving from that bottle starts the saved recovery from Round 129 and leaves two units available. The adult spends one charge to flash for eight light after reload during recovery. The one-minute steep bottles no repair extract and its serving starts no repair. The separate wrong-route and short-dose controls still pass. AR3, AR6, AD38 and AD43 apply.

**Verification.** 146 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 131. A landed repair spell starts the same coat recovery

**Headless verified.** An eligible Mist Lantern coat responds to an actual vitality transformation that lands for at least two points. The native spell working checks the held wand and contact, and the coat reads the landed amount. It opens the same three-minute humid recovery used by the graft and topical brew. The spell cost, threshold and tissue response are original Village settings. [Existing vitality-repair precedent](../../src/spell_pack_hogwarts.js#L127).

The test saves the pending cast, spends two stamina and restores two vitality. A one-point cast restores vitality without starting coat recovery. A ward on the vitality transformation blocks both effects. Reloading midway through the successful recovery lets the same adult spend one charge to flash for eight light. Its lifecycle identity and incubation history agree with the pre-cast record. AR3, AR6, AD38 and AD43 apply.

**Verification.** 146 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 132. Vitality Leaf treatment starts the same coat recovery

**Headless verified.** The existing Gu treatment working spends a detached leaf and credits the patient's actual vitality increase. The opt-in Mist Lantern coat recognizes a two-point increase from that working through the same recovery account used by spell contact. The Gu producer and its treatment rules are unchanged. [Vitality Leaf working](../../src/world_packs/gu_vitality_working.js).

Reloading the pending treatment consumes one leaf and raises vitality from ten to twelve. One point of room allows the leaf to restore that point without starting coat repair. Missing stock refuses. Reloading partway through humid recovery lets the same adult spend one coat charge to flash for eight light, with its lifecycle and incubation history intact. This trial starts from a detached leaf. AR3, AR6, AD38 and AD43 apply.

**Verification.** 149 focused headless tests, creature ledger freshness, coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 133. A grown and harvested Vitality Leaf can restore the flash

**Headless verified.** The opt-in creature fixture now starts with living Vitality Grass and an empty stem. The untended plant refuses growth and preserves the supplies. Tending and growing spend two water and two rank-two primeval essence in total. After a reload during growth, the same plant produces one leaf. Plucking moves that leaf from the stem into the keeper's stock, and the keeper brings it to the patient. [Existing Vitality Grass workings](../../src/world_packs/gu_vitality_working.js).

Reloading the pending treatment consumes the harvested leaf and starts humid recovery. The same adult flashes for eight light after another reload during recovery. A matched treatment with room for one vitality point leaves coat repair inactive, and missing leaf stock refuses. This extends the headless evidence for the development and care checklist through Gu production and treatment using the existing runtime.

**Verification.** 149 focused headless tests, including creature ledger freshness, passed. Shared coverage and scoped diff checks passed.

## Round 134. Gu-repaired fleece regrows and can power a lamp

**Headless verified.** The adult treated with the harvested Vitality Leaf charges in daylight after its coat heals. A clip queued before reload yields nine ordinary wool and transfers all three stored charge units. Two of those units light the wool lamp for eight light. The warmth condition still determines the wool grade.

The same animal refuses a flash during regrowth. After reload, the lamp fades and the coat finishes growing. The next daylight minute supplies a charge that the creature spends to flash for eight light. Its completed repair, identity and incubation record persist. This extends the existing charge, harvest and regrowth checklist with a consuming proof after Gu treatment. It uses the existing Lantern and Vitality Grass runtime.

**Verification.** 149 focused headless tests, including creature ledger freshness, and scoped diff checks passed.

## Round 135. A restored coat can enter Moon Veil and fire Moonbeam

**Headless verified.** The coat-dependent Moon Veil and Sun Molt routes check whether the incubation-suppressed Mist Lantern coat is currently usable. A completed repair or an active wash qualifies at the usual humidity threshold. The sky event producer supplies the same saved repair account to the shared route.

The untreated adult refuses Moon Veil and keeps its charge. The temporary wash lets the matched animal enter the form. After lasting Gu repair and daylight charging, the saved working spends one charge on Moon Veil and one more on a 24-light Moonbeam. The saved form expires on schedule, revealing the original base form and preserving the completed repair and both incubation conditions. The reloaded working agrees with uninterrupted settlement. The treatment comparison uses the original Village coat rules. AR3, AR6, AD38 and AD43 apply.

**Verification.** 149 focused headless tests, creature ledger freshness, shared coverage, architecture, rules and isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

## Round 136. Dusk activates the repaired coat and daylight releases it

**Headless verified.** The opt-in sky clock reaches full-moon dusk after reload and the existing Moon Veil reactor spends one charge on the Gu-repaired adult. A matched unfinished repair leaves the base form and keeps its charge. Restored and uninterrupted dusk settlement agree.

The transformed adult spends another charge on a 24-light Moonbeam. Reloading a pending position spell sends it into daylight and releases Moon Veil before its timer. The original pulse fades at the pasture on schedule. Back in the pen, the same creature flashes for eight light in its base form, with its repair, pedigree and incubation conditions preserved. This extends the sky and arrival proof from Round 14 to a treated, wild-conceived hatchling using the existing runtime.

**Verification.** 149 focused headless tests, including creature ledger freshness, and scoped diff checks passed.

## Round 137. A wash-sustained Moon Veil ends when the wash expires

**Headless verified.** The optional Mist Lantern sustain policy now reads the saved wash deadline and repair progress as well as humidity. A wash can support Moon Veil while active. At its deadline the form releases unless a completed repair supports the coat. The clock can jump over the boundary and produces the same saved result as stopping and reloading there.

A reloaded Moonbeam before expiry produces 24 light. A second beam due on the expiry minute refuses because the animal has already reverted, leaving its remaining charge intact. In the matched branch, a paid graft completes on the wash deadline and Moon Veil stays active. This extends the existing local sustain policy. AR3, AR6, AD38 and AD43 apply.

**Verification.** 149 focused headless tests, including creature ledger freshness, passed. Coverage, architecture, rules, isolated-output build and scoped diff checks passed. Rules and build emitted existing shared-checkout warnings.

## Round 138. The repaired coat supports Sun Molt and a distinct husk wisp

**Headless verified.** A Sun Molt due as the temporary wash expires refuses with its prism, charge and empty husk account intact. In the lasting Gu repair branch, daylight fills the coat and the saved Sun Molt spends the prism to leave a husk. The same creature flashes for 16 light in its permanent Beacon Fleece form after dark, with its repair, genes, pedigree and incubation conditions preserved.

The fixture transfers one existing coat charge into the shed husk. The native awakening consumes the husk and its charge to create one separately identified wisp with the Beacon creature in its world lineage. A duplicate awakening refuses. After reload the wisp spends its charge on a six-light glow. This extends the permanent-form and secondary-creature checks from Rounds 12 and 15 using the existing runtime.

**Verification.** 149 focused headless tests, including creature ledger freshness, passed. Shared coverage and scoped diff checks passed.

## Round 139. The keeper can charge the shed husk through a saved working

**Headless verified.** The Lantern working rechecks the current keeper, shared place, the husk's provenance and both charge accounts at settlement. It transfers one coat charge into an empty husk account. The existing molt receipt or packed-husk lineage supplies provenance. The working uses the same origin checks as awakening.

The repaired Beacon test now saves the pending charge working, transfers one unit, awakens the same wisp and reloads its six-light glow. Reload and uninterrupted charging agree. A keeper who leaves before settlement and a shell with no matching molt both refuse without a transfer. AR3, AR6, AD38 and AD43 apply.

**Verification.** 149 focused headless tests, including creature ledger freshness, passed. Coverage, architecture, rules, isolated-output build and scoped diff checks passed. Rules and build emitted existing shared-checkout warnings.

## Round 140. A packed husk can be charged after packing

**Headless verified.** The existing packing command accepts the shed material with zero charge and gives the parcel an empty charge account. A charged husk still transfers its charge when packed. The saved charge working checks the parcel's lineage and current custody before moving one unit from the parent.

In the repaired Beacon trial the same parcel moves from empty to charged after reload. A sale while charging is pending makes the original keeper's working refuse and preserves both reserves. The charged parcel produces one wisp whose world lineage names both the parent and the parcel. AR3, AR6, AD38 and AD43 apply.

**Verification.** 149 focused headless tests, including creature ledger freshness, passed. Coverage, architecture, rules, isolated-output build and scoped diff checks passed. Rules and build emitted existing shared-checkout warnings.

## Round 141. A trained signal needs inherited coat expression and practice

**Headless verified.** Matched broods produce animals with the same non-coat alleles and different inherited coats. The current keeper runs the same queued signal in all four branches, with and without practice for each coat. The test provisions the same one-charge reserve in every branch to isolate the signal's two prerequisites.

After reload, the practiced carrier spends one charge and emits four light. The practiced animal with two plain coat alleles refuses for lack of expression, and the two unpracticed animals refuse for lack of practice. All three refusals preserve charge. Direct settlement agrees with save and reload. This closes the paired genetics and training proof in Round 10 using the existing lifecycle and Lantern working.

**Verification.** 150 focused headless tests, including creature ledger freshness, passed. Shared coverage and scoped diff checks passed.

## Round 142. Recheck the original creature checklist against current headless evidence

The Rounds 6–13 checks have direct consumers for linked inheritance, IVs, phased population turnover, pedigree, pleiotropy, charged harvest, permanent forms and reversion. The current evidence index points to the combined fixtures and records when further work would change an authored outcome. The early physiology, form and byproduct notes now point to their later proofs. The pedigree evidence distinguishes an authenticated observation from a forecast based on that observation. The latter still needs a breeding route that consumes it.

**Verification.** At `db81f1f11` with shared-checkout changes, 93 focused tests passed across heredity, breeding, pedigree knowledge, lifecycle, creature coverage, Vitality Grass, spell contact and dose delivery. Shared coverage and scoped diff checks passed.

The full `npm test` exited 1 with 7,252 passes, two skips and three failures. The [Gu spirit-watch assertion](../../tests/gu_rehearsal_working.test.js#L338) failed in the suite and passed when rerun alone. The [compression baseline](../../tests/procedural_reports.test.js#L23) and the [plot preview spacing contract](../../tests/ui_contract.test.js#L6) also failed. The suite ran on the shared checkout and provides integration evidence at that scope.

## Round 143. Authenticated ancestry can forecast a breeding delay

**Headless verified.** The forecast reads the keeper's observed descent graph and the opt-in genome rule. It shares the same kinship calculation and growth-delay conversion as brood settlement. Missing connections leave the relationship undetermined. Authenticated connections yield a provisional estimate based on the recorded pedigree. Actual conception still reads the lifecycle pedigree.

Hearsay gives no estimate of relatedness. Recording one shared parent produces a five-minute estimate after reload. Authenticating the second shared parent changes it to ten minutes, matching the saved brood's first eligible clip. The fixture checks that the earlier forecast minute still refuses shearing. Genomes without a delay rule return a disabled forecast. AR3, AD38 and AD43 apply.

**Verification.** 102 focused headless tests, including pedigree knowledge and creature ledger freshness, passed. Coverage, architecture, rules and an isolated-output build passed with existing shared-checkout warnings.

## Round 144. A keeper's authenticated ancestry can unlock a longer cue

**Headless verified.** The optional ancestral Lantern cue binds the keeper and the named ancestor. At settlement the living-body reader consults the current keeper's observed descent graph. The animal also needs ordinary keeper practice, expressed coat and available charge. The cue spends one charge and holds the same light for three minutes instead of one. The duration is an original Village setting.

After reload, a witnessed ancestor supports eight light for the longer interval. Hearsay, an unobserved true parent and a missing observed edge each refuse the ancestral cue. The missing-edge trial keeps its charge, and the ordinary cue still settles without pedigree evidence. Direct and restored settlement agree. The host supplies the authenticated graph on restore. AR3, AD6–AD8, AD38 and AD43 apply.

**Verification.** 102 focused headless tests, including pedigree knowledge and creature ledger freshness, passed. Coverage, architecture, rules and an isolated-output build passed with existing shared-checkout warnings.

## Round 145. The longer ancestral cue draws a forager into the field

**Headless verified.** The ordinary and ancestral cues each spend one charge for eight light. The fixture schedules the moth's next forage decision after the ordinary cue fades and before the ancestral cue fades. After reload, the moth follows the ancestral cue along the open path and records its arrival at minute eleven. The ordinary cue and a closed path both leave the moth at the hedge.

The ancestral pulse fades on schedule, and uninterrupted settlement agrees with saving and reloading across the cue and the moth's arrival. This composes the authenticated pedigree route from Round 144 with the existing forage law. The decision interval is a fixture setting.

**Verification.** 108 focused headless tests, shared coverage and scoped diff checks passed.

## Round 146. A husk wisp saves a timed flight with a stop

**Headless verified.** The local coat pack lets a habitat author give a wisp a greater forage range and separately let it use link costs as flight minutes. Wisps without either property keep their one-link forage and ordinary movement. Timed flights persist the current leg and its due minute. Each stop reevaluates paths, space and nectar. A closure during flight cancels the leg when checked. Reopening the path lets the wisp set off again.

The same molt-born wisp takes three minutes to reach a resting stone and two more on its next flight to a bloom. Reloading on both legs and at the stone produces the same saved state as uninterrupted travel. Closing the bloom link during the second leg leaves the wisp at the stone and the nectar untouched. The successful wisp consumes one nectar, reloads, then spends the charge on six light at the bloom with its parentage intact. AR3, AR6, AD38 and AD43 apply.

**Verification.** 85 focused headless tests passed across heredity, breeding, pedigree knowledge, creature lifecycle, creature coverage, grazing and substrate. Shared coverage, architecture, rules and the isolated-output build passed. Rules and build emitted existing shared-checkout warnings.

The [headless creature evidence index](#headless-creature-evidence-index) now has an executable outcome for each requested Rounds 6–13 capability family. Rounds 143–146 add the outstanding examples from the recheck: an observed pedigree that forecasts an actual breeding delay, an ancestral cue that changes a forager's arrival, and saved travel with an intermediate stop. Further rows need a world-authored trigger, creature, material or outcome. Round 142 remains the shared full-suite result.
