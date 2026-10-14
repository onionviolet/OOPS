# Living, harvested and ecological materials

2026-10-13. **All game contracts and examples below are proposals.** Read-only source/research pass; no runtime, save, build, test or browser change. Sole lane file. [Assignment](README.md), [joined first-round report](../REPORT.md) and [cross-system audit](../CROSS_SYSTEMS.md) frame the work.

## Evidence and abstraction boundary

F1: Biological source, living producer, harvested batch and prepared product are different carriers. A cutting, dead leaf, seed and potion made from that leaf must not inherit each other's capabilities by sharing a species tag. Growth converts actual supported inputs into outputs; a passive stock stack does not reproduce itself.

F2: Existing [items](../../../../src/items.js) declare herbs, sap, flax, wool, cocoons, creature materials and foods; [recipes](../../../../src/crafting_recipes.js) declare fat rendering, sinew/flax strings, processed bone and cooked meals. These establish authored chains, not generic metabolism, fermentation, patches or selective butchery. [Gathering owner](../../../GATHERING_AND_RESOURCE_USES.md) preserves the broader possibilities and gaps.

Primary evidence checked 2026-10-13, with precise bounded locators:

| ID | Source and inspected section | Supported fact, not a game formula |
|---|---|---|
| E1 | Maryland Extension, [Harvesting and Preserving Herbs](https://extension.umd.edu/resource/harvesting-and-preserving-herbs), “Harvesting herbs,” “Methods to dry herbs,” “Herb storage” | Harvest timing, crushing and preservation influence useful herb condition; leaf collection must retain growth. No medicinal effect is established. |
| E2 | Maryland Extension, [Graft Failure](https://extension.umd.edu/resource/graft-failure), opening description | Grafting joins scion and rootstock; they remain distinguishable roles at a union. No universal compatibility or growth rate is established. |
| E3 | Cornell Small Farms, [Seven Stages of Cultivation](https://smallfarms.cornell.edu/resources/methods-of-commercial-mushroom-cultivation-in-the-northeastern-united-states/2-seven-stages-of-cultivation/), “Strain Selection,” “Substrate Preparation,” “Incubation” | Mushroom strain, substrate preparation, inoculation and growth stage are separate production variables. Different strains/substrates can suit different production methods. |
| E4 | National Center for Home Food Preservation, [General Information on Fermenting](https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/general-information-on-fermenting/), “Ingredients,” “Pickles with reduced salt content” | Ingredient proportions and salt affect the selected fermentation process. This supports process specificity, not interchangeable preservation recipes. |
| E5 | USDA NRCS, [Soil Health Assessment](https://www.nrcs.usda.gov/conservation-basics/soil/soil-health/soil-health-assessment), “Indicator Examples” | Physical, chemical and biological indicators distinguish functions; one yield measurement does not establish every soil property. |
| E6 | Maryland Extension, [How to Make Compost at Home](https://extension.umd.edu/resource/how-make-compost-home), compost management/temperature sections | Feedstock mix, water, air and process conditions matter to decomposition. No exact real process thresholds are imported here. |
| E7 | USDA Forest Service, [Drying and control of moisture content and dimensional changes](https://research.fs.usda.gov/treesearch/7143), abstract, Wood Handbook 1999 chapter 12 | Moisture state, drying and storage affect wood dimensions. Protective coating is not a guarantee of unchanged dimensions. |

E1–E7 pages were opened successfully. UMN grafting and Penn State mushroom opens returned 403; this report switched to E2/E3 instead of relying on those failed bodies. Search snippets were leads, not additional evidence. No real treatment claims, exact biological yield formulas or canonical fantasy material claims are supplied by these sources.

## Proposed carrier and clock rules

**P1: Source identity.** Record family/revision, species or fictional lineage, plant part/tissue, relevant producer identity, cultivation provenance and harvest state. Keep genotype/strain, environment and processing contributions separate where a consumer reads them. Source identity is not automatic source power: blood from a powerful creature need not grant its abilities. Anonymous bulk stock can omit individual producer IDs when they have no gameplay consequence.

**P2: Heterogeneity.** Homogeneous liquid may use proportional fractions after an actual mixing step. A bundle of intact seeds or hides retains members or stable sublots when their traits matter; averaging two viable seeds cannot create a third genotype. Sampling uses the actual selected fraction/member and records scope. Splitting preserves constituent totals and relevant lineage; neither inspection nor restacking rerolls truth. UI grouping must retain exact selection.

**P3: Living state and processing.** Use explicit viable/dormant/growing/harvested/prepared states for selected families, rather than one alive Boolean. A living culture has population identity and substrate access; a dried reagent has composition and condition. Grafting forms an assembly of source roles, not genetic blending. A killing, drying or extraction step can end reproduction while retaining other material properties. Reviving requires a supported rule.

**P4: Growth and turnover.** Each enrolled producer names its clock, next meaningful boundary, accepted inputs, output capacity, site/custody and pause/shortage behavior. Resolve harvest-ready, feedstock exhaustion and receiver-full boundaries rather than ticking every cell. Ordinary stacks remain stable unless their family declares relevant condition changes. No closed-browser growth is assumed. Saving must retain old delay semantics and not retroactively harvest elapsed wall time.

**P5: Inheritance and byproducts.** A saved recipe inherits its operation grammar and accepted family/profile conditions, not the exact properties of the first specimen. Every subsequent batch resolves actual selected inputs. Persistent lineage reproduction uses an authored inheritance law; it is separate from recipe inheritance. Extraction, rendering and fermentation conserve accounted feedstock or declare transformations, including side fractions, water, residue and retained inoculum. Recycling cannot create free producer mass.

## Eighteen proposed family cards

Every card names evidence, state/process, true versus observed facts, useful consumer, supply/clock and unresolved semantics. Local locators refer to named declarations, not proof of ordinary browser reachability. Only variables with a selected consumer become implementation fields.

### L01: Leaves and flowering herbs

**Evidence:** E1; local `Belmart leaf`, `Golmoon leaf`. Distinguish intact/bruised/dried material and harvest stage; grinding or extraction changes retained fractions. True fictional potency and undesirable fractions operate before identified; scent/appearance reveal only authored observations. Consumer: culinary role or fictional alchemy. An enrolled patch can recover leaf supply at a declared boundary; retained plants and harvesting rights belong to an actual owner. **Open:** selective harvest yield, flowering tradeoff and relevant storage change. No real herb healing claim is imported.

### L02: Seeds, fruit and roots

**Evidence:** local `Oneberry`, `Wild potato`, `Wild onion`; gathering owner plant family. Proposed fruit, planting stock and consumable root are separate roles. Sorting can retain viable propagules while processing spends food stock. Truth contains suitability/viability only where implemented; visual ripeness does not prove all hidden traits. Consumer: meal, reagent or planting. Annual harvest and destructive root collection need different renewal policies. **Open:** whether a selected seed is a sublot or instance, and whether that crop's harvest destroys its producer.

### L03: Cuttings and grafted producers

**Evidence:** E2 and gathering owner's original viable-cutting example. A cutting must establish a producer; a scion/rootstock assembly retains separate identities and a union condition. Observation can establish a taken union without full future yield knowledge. Consumer: one dependable local supply or source-preserving cultivar. Reserve actual propagule/site inputs; growth pays only at declared supported boundaries. **Open:** allowed compatibility, donor recovery, effects of rootstock and what a later cutting inherits. Avoid random trait averaging disguised as grafting.

### L04: Bark, sap and prepared resins

**Evidence:** local `Tree sap`; [retort](../../../../src/factorio_retort_content.js). Separate harvested sap, tree custody and derived resin/residue. Extraction can retain or transform specific fractions. A sticky observation need not reveal affinity or full bond behavior. Consumer: adhesive, coating or selected fuel. Renewable tapping and destructive bark removal need authored supply laws, not automatic universal tree damage. Retort clocks/receivers remain their current narrow contract. **Open:** source recovery and composition extensions without violating exact native tray keys.

### L05: Plant fibers, stalks and wood

**Evidence:** local `Flax` and flax-string recipes; E7 for wood condition. Proposed separation keeps useful fiber, woody fraction and other residue; spinning/weaving establishes structure. Grain and moisture matter only to relevant part/fit consumers. Observation can show dryness or flexibility while exact condition remains measured knowledge. Consumer: cordage, cloth, handles or selected construction. Growth belongs to a producer; seasoning belongs to dead stock. **Open:** fiber-length representation, yields and whether a chosen wood application warrants a condition clock.

### L06: Fungal inoculum and colonized substrate

**Evidence:** E3. Keep strain/culture identity separate from food substrate and harvested mushrooms. Inoculation creates an owned growth batch, not an immediate edible stack. Visible colonization is evidence of stage, not omniscient purity. Consumer: renewable fictional food/reagent production. Feedstock, suitable site and actual capacity bound growth; spent substrate remains accounted stock. **Open:** competition rules, culture splitting and whether production retains a usable inoculum. Purchased prepared blocks should remain an alternate supply route.

### L07: Fruiting bodies and spores

**Evidence:** E3's separate fruiting/harvest stages; proposed extension for propagule roles. Mushroom harvest and transferable inoculum are distinct. Preserve strain and harvest stage where useful; drying produces a different prepared batch. Observation may identify a known specimen, not an entire unknown ecosystem. Consumer: meal or fictional extract. Harvest-ready boundaries pay a finite flush and receiver capacity matters. **Open:** supported repeat flushes, spore inheritance and whether a selected species permits either. No assumption that any picked mushroom successfully reseeds any substrate.

### L08: Fermentation cultures and food batches

**Evidence:** E4 for specific process proportions; original culture contract. Separate starter, feedstock, vessel and transformation stage. A saved method asks for compatible roles and resolves actual inputs; it does not copy the first brew's truth. Taste/bubbling are scoped observations, not full identification. Consumer: useful fictional meal variant or reagent precursor. Advance enrolled batches to declared boundaries with accounted products/residue and retained culture if permitted. **Open:** culture persistence, competitive contamination and process-specific endpoints. No real preservation recipe is offered.

### L09: Compost and spent growth media

**Evidence:** E6; E3 for substrate. Proposed composting consumes actual enrolled residues and outputs a specified amendment, with declared losses/byproducts. Spent mushroom substrate is not automatically fresh spawn or universally suitable fertilizer. Observed warmth/texture provides evidence, not every nutrient value. Consumer: one plot or substrate preparation. Site, feedstock and supported time govern transformation; storage alone does not duplicate it. **Open:** compatible waste families, output accounting and receiver/land capacity. Existing retort residue gains no benefit without a new rule.

### L10: Soil and tailored growth media

**Evidence:** E5. Model a few relevant physical/chemical/biological functions rather than a universal fertility grade. Amendment changes selected state, not instant harvest. Measurements reveal their scope; good yield does not identify every property. Consumer: one crop/culture family with actual growth response. Plot tenure and material quantity govern custody; renewal/depletion are explicit selected transitions. **Open:** nutrient versus support-medium roles, whether state is site-bound or portable, and retained boundaries after access loss. Generic harvesting is not already managed soil.

### L11: Muscle, edible tissue and mixed cuts

**Evidence:** local `Rat meat chunks`, `Boar meat`, fish butchery/cooking declarations. A carcass/whole fish can yield authored cuts and side fractions; cooking transforms a batch. Preparation suitability and fictional adverse traits remain true whether identified. Consumer: optional useful meals or selected reagent process. Each acquisition spends a real source once; decay is family-specific and optional to model. **Open:** heterogeneous cuts, byproduct accounting and whether freshness creates a meaningful transport choice. Do not infer hunger death or compulsory feeding.

### L12: Blood and gland fractions

**Evidence:** gathering owner creature-products proposal; no general blood/gland pipeline found. Original fictional reagents retain source/tissue identity, collection state and separable fractions. A red color does not disclose lineage, affinity or effect; sample assays reveal only supported facts. Consumer: authored fictional alchemy or identity-bound ritual. Collection/custody and replenishment need an actual creature/source rule, not free extraction from an inventory tag. **Open:** living collection means, retained donor consequences, death-state dependence and route compatibility. No real medicinal effect or canon power is asserted.

### L13: Bone, shell and rigid creature parts

**Evidence:** local processed-monster-bone recipes and `Turtle shellplate`. Preserve intact geometry for assembly; grinding destroys that structure while retaining permitted feedstock. Hardness/fit observations do not grant every monster trait. Consumer: handle, plate or fictional powder. Count acquisition once; shells/shed parts and killed-source bones require distinct renewal rules if selected. **Open:** exact recovery fractions, interface geometry and what the local fictional processing actually changes. A shellplate's existing metal role is an authored exception, not general chemical equivalence.

### L14: Hide, wool, feathers and silk

**Evidence:** local pelts, wool, `Coccoon`, processed-pelt and cloth declarations; gathering owner nonlethal collection proposals. Cleaning, tanning or weaving establishes a relevant product state/structure. Observed texture is partial knowledge; true insulation/affinity needs a consumer. Consumer: clothing, cordage or a selected filter. Owned creature, collected output and textile stock remain separate. **Open:** shearing/molt schedules, donor access and whether a particular cocoon collection preserves a producer. No universal renewable yield is inferred from the item name.

### L15: Fats, oils, waxes and biological fuel

**Evidence:** local `Animal fat` rendering and healing-balm ingredient declarations. Proposed feedstock separation retains useful carrier/fuel fractions and accounted residue. A greasy texture does not certify burn rate or extraction compatibility. Consumer: salve carrier, cooking process or selected lamp fuel, each with separate route laws. Producers replenish only through their own supported means; rendered stock is passive. **Open:** unit conversions, reusable containers, condition changes and whether processing preserves an active fraction. Do not transfer every tissue trait into the fat.

### L16: Spices, dyes and fictional medicinal extracts

**Evidence:** local `Cooking herbs` and authored healing ingredients; E1 supports preservation distinctions only. Original dye/extract families define pigment/binder compatibility or fictional active fractions, with explicit side fractions. Color/aroma observations need not reveal effects. Consumer: meal, ink/textile coloring or actual generated-treatment adapter. Cultivation/trade supplies feedstock; extraction pays costs once; preservation matters selectively. **Open:** whether an ingredient's multiple uses compete, fastness versus hue, and route-specific effect laws. Existing descriptive garlic/healing claims are game text, not real therapeutic evidence.

### L17: Symbiotic fantastical producers

**Evidence:** original extension of gathering owner's living specimens; no canon claim. Define host and partner as separate owned entities with an explicit supported exchange. A fictional tree/culture partnership could supply one unusual resin only while joined and supplied. Observation reveals supported changes, not partner truth or sealed origin. Consumer: a local reagent chain. Growth uses actual resource access; separation changes production under a declared rule. **Open:** custody of each partner, portability, viable separation and paid inputs. A symbiosis tag cannot invent free energy or mutual compatibility.

### L18: Creature-origin magical harvests

**Evidence:** gathering owner environmental/creature families; all examples original, with canon intake deferred to the canon lanes. Distinguish naturally shed scale, renewable secretion, charged tissue and singular identity-bound core. Processing retains only powers the world's explicit law allows; appearance is not full identification. Consumer: material role, pattern anchor or exact ritual. Regeneration, recharge and replacement are different clocks and cannot replay a unique drop. **Open:** living/dead efficacy, indivisibility, source consent/access and foreign-world operation. Canon requires a source locator before substituting a familiar franchise name.

## Selective acceptance and remaining decisions

D1, proposal: prove one herb part/harvest-state distinction and one preservation/process choice inside procedural alchemy before building producers. Then one paid managed plot or culture can prove renewable supply. This atlas does not require biosimulation, livestock upkeep, universal spoilage or extra worlds.

Accepted [food direction](../../../USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13) remains useful meal benefits, comfortable unfed ordinary play and no hunger death. Required passive Famine progression belongs to its future eligible game-time contract; rates/effects and offline policy remain unresolved. Biological depth must not silently impose recurring chores to sustain ordinary play.

Specified future tests, not run: member/sublot split conservation; sample scope without hidden-trait disclosure; dead/dried stock cannot reproduce; graft roles survive reload; culture growth spends actual substrate; harvest settles once; preservation respects explicit timing; inherited methods resolve new input truth; residue cannot become free seed/inoculum; source loss/custody pause follows the declared policy. Then rebuild and demonstrate a useful owned product and repeat supply on a fresh laptop-sized origin with Save/reload and literal export/import. Human fiction/balance acceptance stays separate.
