# Crafting engine: procedural materials, recipes and harvesting

Date: 2026-10-15. **Current evidence summary, reconciled 2026-10-18:** M3 later
reported a passing harvest → craft → useful native consumable journey, including
Save/reload/Export/Import, in the [modular checkpoint](gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md#m3-resume-2026-10-16-claude-session-lane-worktree).
`src/main.js` now imports `configureCraftingDomain`. This is recovered lane
evidence, not a fresh verification of today's shared dirty build or human acceptance. Weibao's request is recorded in
[USER_VISION](USER_VISION.md#procedural-crafting-engine-and-harvesting-2026-10-15).

This layer implements the build order proposed by the
[materials audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) (P2 records, P7
regional generation, R1-R9 hazards), the [crafting palette](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md)
(II1, II2, II6, AB1, AB3), [CR6 REGISTRY](gm/dispatch/procgen-2026-10-13/cr6/REGISTRY.md)
and the [generation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md) GR1-GR17. It
reuses `gen_kit.js` draws and `tag_store.js` tags. It adds no second RNG or tag system.

## Modules

| File | Role |
|---|---|
| `src/craft_materials.js` | Catalogue of axes, tags, families and authored materials. Fraction axes plus an inert `matrix` always sum to the basis. Scalar axes are bounded. Seeded `generateMaterial` turns family ranges and correlations into coherent regional materials. `materialPool` and `pickMaterial` select by tag query with ban/reweight/add overlays (GR7, GR8). |
| `src/craft_resolver.js` | `defineCraftLaw` declares process ops (station-gated, levels, conversions, availability), mass-conserving reactions (catalyst, limit, after-op), output laws (dose, total or scalar per route) and derived tags. `resolveBatch` is pure and draw-free. Integer math conserves mass and keeps traces. Catalysts are retained. Products carry a canonical identity. `validateBatchProduct` re-resolves under the product's own law revision. |
| `src/craft_recipes.js` | Recipes are role slots selecting by exact material, tag query or property threshold, plus an optional process. `matchRecipe` returns an assignment or names the missing, extra or unknown slot. `knows` lets unknown properties count as a trial instead of a refusal. `generateRecipe` builds a seeded discovery recipe from a grammar. The grammar's witness batch must make a real output; otherwise it falls back to a named authored recipe. |
| `src/craft_sources.js` | Obtaining materials. Location sources join by place tags. Each location has its own generated variants. Harvest rolls are keyed by world, location, source, game minute and the node's harvest ordinal. Yields can be gated by tool, skill, hour window or season. Nodes have capacity and regrowth, with leftover minutes carried. Rare finds can use pity and luck. `forecastHarvest` shows the odds and why a yield is blocked without drawing. `gatherIdle` is bounded at 500 harvests. |
| `src/craft_state.js` | An optional save owner with frozen generated materials and recipes (GR3), products, per-observer knowledge (GR5, AB3) and harvest nodes. `projectProduct` and `projectMaterial` never show unknown or hidden truth. `validateCraftState` rejects unsupported revisions instead of dropping them. |
| `src/craft_product_registry.js` | Product-family registry (AB1). The existing Village mixture key is entry one and stays byte-identical. Engine batches use `{id: carrier, productFamily: 'craft.batch@1', productRef}`. Ordinary item keys return `null`. |
| `src/craft_content_frontier.js` | An original example pack: herbs, roots, salts and ore; steep, boil and grind; a toxin binder; four location sources; a tonic grammar. It proves that a new pack is only data. |

Tests are in `tests/craft_engine.test.js`: 18 tests covering golden snapshots for three roots,
a 300-seed sweep, save/reload round trips, conservation, revision rejection, recipe
explanations, harvest gates, regrowth, pity and idle bounds.

## Choices made here (reversible proposals)

| Code | Choice |
|---|---|
| CE1 | Integer permille math throughout. Basis 1000 per pack unit. No floats are stored. |
| CE2 | Ops and reactions are data, not functions, so saved truth and NPC makers need no code. Each reaction fires at most once per trigger, which bounds the work. |
| CE3 | Product identity is the full canonical address of the inputs, process, stations and composition (no hash), as P2 already does. Keys run to a few hundred characters. |
| CE4 | Harvest quality (0-100) is carried on the harvested stack. It does not change material truth or batch chemistry yet. |
| CE5 | Hidden axes, such as `glow` in the example, still act on outputs. They are never projected. |
| CE6 | No live wiring this pass. `main.js` and `save_files.js` have concurrent writers, so the engine landed in new files only. |

## Original engine-only gates, 2026-10-15 (historical)

1. **Playable consumer (GR12).** Each item needs live wiring:
   - a `crafting` slice in `create_save`, `load` and `validateSaveEnvelope`;
   - a `nativeGetItemFromKey` branch through `resolveProductKey`;
   - a carrier item template;
   - effect application on use, saved and restored (audit R1, R5);
   - a harvest action at one Village location, keyed by the game clock;
   - one UI home under [UI rules](UI_RULES.md).

   The gate after that is a rebuilt fresh-origin browser check at 1366×768 with Save, reload, Export and literal Import.
2. **Old-save compatibility.** Saves with no owner stay untouched. This needs proof once the owner is wired in.
3. **Not yet modeled:** exposure ledger and stacking (AB2), spoilage (P14), separation and purification (P5), skill-driven extraction, salvage, and NPC makers on live stock (AB4).

## Round 2 (2026-10-15): world rule types, open-slot recipes and canon resource spots

Request: types of generation rules per world, standard recipes with room to slot
things in (Harry Potter brewing versus other worlds), resource generation by
world and canon-based spot rules ([USER_VISION](USER_VISION.md#crafting-engine-round-2-world-rules-and-canon-resource-spots-2026-10-15)).
This section is a palette, not a spec: each entry applies only where it fits the
world. The owners it builds on, which it does not restate, are:

- [procedural materials report](research/procedural-materials-2026-10-13/REPORT.md) (P1-P4 product logics, B1-B5 source rules);
- [P8 resource contract RC1](gm/dispatch/procgen-2026-10-13/p8/REPORT.md) and [world resource laws](gm/dispatch/procgen-2026-10-13/p8/WORLD_VARIATIONS.md);
- [P9 HP generation profile](gm/dispatch/procgen-2026-10-13/p9/HARRY_POTTER.md);
- the [multi-use ingredient synthesis](research/procedural-crafting-ui-2026-10-15/DEEPER_SYNTHESIS.md);
- the GA5 pin store in [generation rules](GENERATION_FOUNDATION_RULES_2026-10-14.md).

### GT. Generation rule types (resolution modes)

A world's rulebook picks the modes each craft domain uses. One product can combine
several modes, for example an alloy blade with an inscription and a bound core.

| Code | Mode | Core rule | Fits | Engine state |
|---|---|---|---|---|
| GT1 | Derived composition | Ingredients, ratios and process decide the product | Original worlds, salves, dyes, fuels, Noita-like sandboxes | Built (`craft_resolver.js`) |
| GT2 | Exact formula | A named recipe needs exact ingredient identities, prepared states, ordered additions and conditions. It yields an authored product; deviations give a stated failure, a degraded result or a different known product | Harry Potter and most book worlds | Missing |
| GT3 | Formula with open slots | A fixed core plus declared slots that take a tag or property class. A slot changes strength, duration, side effects or flavor within the core's effect family, never the product's identity | Original worlds, Taiwu-like cooking, D&D house variants, labelled original HP variants | Missing; reuses GT1 for the slots |
| GT4 | Abstract budget | Kit, material budget and work time produce a listed item | D&D 2024 brewing (B2) | Missing; trivial |
| GT5 | Grade and refinement | Input age and grade, furnace or fire control and impurity give a graded output; toxicity can build up | Xianxia pills (CO3) | Missing |
| GT6 | Conserved identity | An exact substance moves between owners and cannot be synthesized from similar properties | LOTM characteristics (B4), canon cores | Missing |
| GT7 | Pattern and structure | Carrier, channels, anchors and charge | Runes and formations | [Weaponcraft palette](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) owns it |
| GT8 | Seeded hidden recipe | A per-world secret formula is resolved once and frozen | Discovery play in any world | Built (`generateRecipe`); sealed-secret rules apply |
| GT9 | Parts and assembly | Part roles, interfaces and condition | Tools, gear, devices | Maker-arts owner |

*Corrected 2026-10-15 by round 3 OV1: HP also allows free ingredient mixing for original potions; the text below is preserved as written.*

**Harry Potter versus other worlds.** HP brewing is GT2 at its core: generic ratio
chemistry must not manufacture a known canon potion (P9 materials row). There are
three canon-respecting routes to "room to slot in":

- An experimental original variant with its own ID and an "original" label.
- A demonstrated method revision, where a better preparation is learned and recorded. HBP ch9 shows one changed preparation, which is a precedent, not a general license.
- GT3 slots on original recipes only.

Other worlds pick differently. An original Village can run GT1 with GT3 house recipes, D&D GT4, and xianxia GT5 with GT2 named pills.

### WR. What a world's crafting rulebook declares

| Code | Field | Example contrast |
|---|---|---|
| WR1 | Modes per domain (GT) | HP potions GT2; Village tonics GT1+GT3 |
| WR2 | Operation vocabulary | HP: add at step, stir and heat stages (exact verbs need sourced scenes). Xianxia: fire control. D&D: none. |
| WR3 | Substitution policy | Exact identity versus functional profile versus none (audit C1) |
| WR4 | Failure semantics | A shown failed brew in PS ch8 versus an inert waste mixture versus a graded drop |
| WR5 | Knowledge routes | Textbook, annotated copy, teacher demonstration, trial and assay |
| WR6 | Apparatus and station requirements | Only where the source states them |
| WR7 | Legality and restriction | Controlled ingredients, supervision, permits |
| WR8 | Quality model | Exact or fail, graded, or continuous dose |
| WR9 | Calendar | Day length, seasons, terms and lunar phases, but only where the source states them |
| WR10 | Cross-world compatibility | A directional law for imported materials (P8 D5); otherwise they are inert or unsupported, never silently native |

### RS. Resource generation by world, with canon-based spot rules

| Code | Rule | Why |
|---|---|---|
| RS1 | **Three layers.** Canon anchors: authored, cited places and what the text says is there. Canon-consistent fill: generated lots, stock, condition and occupancy on existing nodes. Original regions: fully generated within the world's law. | Generation never invents a canon landmark (P9: no procedural castle). It only fills gaps. |
| RS2 | Every site, material and recipe carries an evidence label: SHOWN, STATED, INFERRED, ORIGINAL or GENERATED, plus a source locator. | Canon fidelity stays checkable, and UI or reports can tell canon from invention. |
| RS3 | Supply forms are separate kinds: wild site, cultivated bed, shop or supplier, institutional store, living donor creature, trade route, reward, salvage. | Most canon ingredients come from shops, greenhouses or stores, not free foraging. |
| RS4 | Canon exclusions and scarcity are hard constraints. If the text says something is rare, controlled or absent, overlays cannot contradict it. | Prevents a Mandrake patch in every meadow. |
| RS5 | Density and rarity weights cite a frequency statement where one exists; otherwise they use a labelled original default. | Integer weights with reasons (GR9) |
| RS6 | Habitat and region profiles admit families by tag. World and region overlays layer on the core table (GR7, GR8). | One table system for every world |
| RS7 | Time and condition windows come only from sourced statements. Original adjectives are labelled. | P8 forbids an invented lunar-yield formula. |
| RS8 | Ownership, access and social cost come with each site, for example school stores versus a bought lot versus a private garden. | Taking has consequences beyond the item. |
| RS9 | Era binding: stock, shops and prices follow the timeline year and canon events. | Canon chronology |
| RS10 | Player impact: depletion, cultivation or overharvest of a canon site writes a divergence record rather than a silent change. | [Timelines owner](TIMELINES_AND_DIVERGENCE.md) |
| RS11 | Discovery routes: maps, rumors, teachers and survey reveal sites; secret sites follow sealed-secret rules. | Knowledge separate from truth (GR5) |
| RS12 | Canon pins live in the GA5 pin store, not hard-coded in pack logic, so cheats and canon share one authority. | One owner per datum |

### ACCOUNT FOR NOW: constraints on the engine just built

| Code | Constraint |
|---|---|
| ER1 | `resolveBatch` is GT1 only. Add other modes as law-level dispatch on one resolver and registry, not a second engine. Corrected in round 3 (OV1): free mixing is allowed in every world and makes original potions. A canon identity is reached only by actually meeting that formula's requirements, including by experiment. |
| ER2 | Process steps currently act on the whole batch after every input is added. GT2 needs staged additions (add slot X at step N) and prepared ingredient states (sliced or crushed) carried in provenance. |
| ER3 | A source's `at` tag query clones the source at every matching location. Real worlds need RC1-style site placement: authored anchors plus generated sites frozen per region with a density budget. |
| ER4 | Sources have no owner, access or legality field yet (RS8). |
| ER5 | The season gate reads `actor.season`, and the hour gate assumes a 1,440-minute day. Both should read a world calendar context (WR9). |
| ER6 | A catalogue's axes are per world. Never share axes across worlds by default; cross-world use goes through WR10. |
| ER7 | Origin and evidence labels (RS2) belong on catalogue, material, recipe and site records before any canon pack is authored. |
| ER8 | The existing P2 Village mixture keeps its own law. Either port it as a GT1 law pack or leave it frozen; do not grow a second live apothecary path. |

### LATER / DELEGATE (not dispatched)

| Code | Slice | Done check |
|---|---|---|
| L1 | Mode dispatch with GT2 and GT3, plus staged additions, using an original fixture: one exact formula with stated failures, and one house recipe with two open slots | Unit tests: exact path gives the authored product; a wrong order gives the stated failure; slot fills change magnitude but not identity; GT1 cannot reach the formula product. Medium agent. |
| L2 | A site-placement layer (anchors, generated fill, access, world calendar) replacing tag cloning | Frozen sites survive save/reload; no canon-excluded family is placed; density budget holds over a seed sweep. Medium agent. |
| L3 | HP pack from the [source ledger](worlds/harry-potter/SOURCE_LEDGER.md) and private dossiers. Every canon row cites a scene; gaps are labelled ORIGINAL. | Needs sourced scene reads per the [deep dive playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md). Strong agent. |
| L4 | A dev-only world resource atlas: canon anchors versus generated sites with evidence labels; sealed sites hidden outside dev | Lets Weibao check canon fidelity at a glance |
| L5 | A per-world pack validator that checks citations, exclusions and calendar fields | CLI and test |

Further angles: NPC gatherers competing for the same sites (GR13); shop restock treated as a regrowing source with scarcity pricing; cheat hooks such as the odds lens (already `forecastHarvest`), resource sense and recipe insight via GA9; per-world canon-fidelity tests.

## Round 3 (2026-10-15): world styles, free mixing, process semantics and mastery

Request ([USER_VISION](USER_VISION.md#crafting-engine-round-3-styles-free-mixing-and-mastery-2026-10-15)):
different styles per world; ingredient mixing that still makes random potions with
better or worse effects; recreating a world's brewing rules in depth (what stirring
does); and mastery that cuts steps, improves results and opens other possibilities.
This is a palette, not a spec.

### OV. Correction and the combined model

| Code | Point |
|---|---|
| OV1 | **Correction to round 2.** Free mixing works in every world, Harry Potter included, and makes original potions whose effects can be better or worse. The P9 rule still holds in a narrower form: a mix does not become a named canon potion by being similar. It becomes that potion only by actually meeting the formula (identities, preparation, order, conditions), including when an experimenter finds it by accident. |
| OV2 | **Formulas act as attractors in the same space.** A brew close to a known formula can be a degraded or unstable version of it, labelled as such. Anything farther away resolves as an original product through GT1. Nothing is ever a dead "invalid recipe"; it is an outcome. |
| OV3 | **"Random" has three sources.** Each one is kept separate so reload never rerolls (GR3, audit R7): (a) per-world hidden material truth, seeded and frozen (built); (b) per-attempt execution variance, a committed draw that mastery narrows (missing); (c) rare authored reactions and lore exceptions (P15). Chemistry stays deterministic given the inputs and the execution result. |

### ST. Styles per world

A world's crafting style is more than its rule mode (GT). Each world declares:

| Code | Style field | Contrast examples |
|---|---|---|
| ST1 | Apparatus and scene | Cauldron at a school bench; alchemy array; pill furnace; field kit; lab bench; kitchen hearth |
| ST2 | Verb set | Add, stir, simmer, wave (HP-like); refine, temper the fire, condense (xianxia); roll the kit (D&D); grind, steep, boil (Village) |
| ST3 | Feedback cues | Color, smoke, smell, sound, furnace glow, pill cracks. B1: color alone is not a universal identifier |
| ST4 | Failure flavor | Shown failed brew; inert sludge; cracked pill; wasted budget. Severity follows world law, not one global table |
| ST5 | Naming grammar for original products | Per-world name parts drawn from fact IDs (GR15), so a renamed discovery updates everywhere |
| ST6 | Pacing | Single action, timed stages, multi-day refinement, idle queue |
| ST7 | Social frame | Class grading, guild certification, sect contribution, market reputation |

Style is presentation plus law. The UI home and verbs come from the world pack, not new engine code per world.

### PR. Recreating a world's process rules in depth (what stirring does)

| Code | Consideration |
|---|---|
| PR1 | **Every verb gets a declared effect on batch state**, never decoration (audit P6: no empty controls). Proposed stirring semantics as an original model: count drives mixing completeness (incomplete mixing leaves pockets that dose unevenly); direction selects which declared reaction a stage favors; speed trades time against overheating. |
| PR2 | **Canon status per rule.** HP shows that stirring and order matter (PS ch8 failure; HBP ch9 changed preparation) but never states a mechanism. So the specific stir mechanics are ORIGINAL or INFERRED rules that sit within canon results, labelled RS2-style. A future sourced scene that states a rule overrides the original one. |
| PR3 | **Stage timeline.** A brew is a sequence of stages: add, prepare, heat, stir, rest, finish. Each stage has a window (too early, on time, too late) and state such as temperature, mixing and settling. Missing a window shifts the outcome toward OV2's degraded or original results. |
| PR4 | **Prepared ingredient states** (sliced, crushed, juiced, dried) change extraction and availability before brewing (ER2). Crush versus slice is the HBP-shown kind of difference. |
| PR5 | **Environment hooks**, only where the world states them: time of day, lunar phase, location, magic ambient. Otherwise these are labelled original adjectives (RS7). |
| PR6 | **Magic input as an ingredient role.** A wand motion, spell or qi infusion is a step with its own requirements (skill, energy cost) and a declared effect, not a free buff. |
| PR7 | **Hidden mechanics stay discoverable.** Players learn stir rules by trial, notes or teaching; knowledge never changes the truth (GR5). Recording the attempt history makes a deep player able to deduce the rule. |

### DP. Depth on demand ("if anyone wants to get really in depth")

| Code | Consideration |
|---|---|
| DP1 | **Three involvement levels over one truth.** Quick: choose a known recipe and its result resolves. Guided: key decisions at each stage. Deep: full manual control of every stage, verb and window. All levels run the same resolver; only who makes each choice changes. |
| DP2 | **The quick level uses the maker's demonstrated method.** It repeats the steps the player (or a teacher or text) actually established, so it is never better than the knowledge behind it. |
| DP3 | **Involvement is a comfort setting per activity or life** (OD16 MD1; synthesis P7 "preserve chosen involvement"). Changing it is free and never a penalty by itself. |
| DP4 | **Deep play earns its keep honestly.** It can beat the quick result when the player's choices are better than their recorded method, through experimentation, discovery and tighter windows. It is never a mandatory grind for basic results. |

### MA. Mastery: fewer steps, better results, other possibilities

Skill improves control, precision and options, not material truth (audit P10, synthesis P7).

| Code | Mastery effect | Mechanism |
|---|---|---|
| MA1 | Fewer steps | Learned macros merge stages (one "prepare and add" action). Masters skip checks a novice must make. Time and labor cost per stage falls. |
| MA2 | Better results | Execution variance narrows (OV3b). Window tolerance widens. Extraction and yield improve; waste falls. |
| MA3 | Reading the brew | Cues reveal state (temperature, mixing, nearness to a formula) to a skilled eye. This is projection, not truth change. |
| MA4 | Recovery | Rescue a drifting batch, salvage a failed one into a useful intermediate, or neutralize a hazard. |
| MA5 | Improvisation | Substitute by functional profile where the world allows (WR3); work with worse apparatus; brew in the field. |
| MA6 | Invention | Propose an original variant or a method revision and record what was demonstrated (synthesis P8). GT3 slots are the main home for this. |
| MA7 | Scale and delegation | Bigger batches, parallel cauldrons, supervising apprentices or a workshop (Magical production P5), and teaching others. |
| MA8 | Signature and reputation | A recognizable house style, certified quality, commissions |
| MA9 | Grade ceiling | Some worlds gate the top grades or named formulas by mastery tier (xianxia pill grades; Taiwu F5 eligibility combines grade, skill and tool). This is a per-world adjective, not a fixed universal cap. |

Mastery sources are per world: practice XP, teaching, texts, demonstrations, cheats. Gains come from meaningful new attempts, not from repeating identical observations (audit P8).

### ACCOUNT FOR NOW: engine constraints (continuing ER)

| Code | Constraint |
|---|---|
| ER9 | Process steps carry only `level`. Stage params need a declared domain per verb (count, direction, timing, temperature) so PR1-PR3 can be data. |
| ER10 | Add a committed execution draw that is separate from chemistry. Preview shows ranges and never consumes it (audit R7). |
| ER11 | Resolver context needs a maker snapshot (skill, tools, knowledge) frozen at admission, so NPC makers use the same rules (AB4, GR13). |
| ER12 | Ops need time and labor cost per stage so MA1 has something to reduce. |
| ER13 | Outcomes need a classification (canon formula, degraded formula, original, failed) and nearest-formula distance for OV2 and MA3. Product identity stays truth-based; the label is derived. |
| ER14 | Involvement level (DP1) belongs to the request and settings, never to product identity or truth. |

### LATER / DELEGATE (not dispatched)

| Code | Slice | Done check |
|---|---|---|
| L6 | Stage-timeline resolver: verbs with declared param domains, windows, execution draw and maker skill, on an original fixture | Same inputs and draw give the same output; a skill sweep narrows variance monotonically; preview consumes nothing |
| L7 | Formula attractors: classify outcomes and degrade near misses | An exact formula gives the canon-style product; one missed window gives degraded; far mixes give originals; tests cover all three |
| L8 | Mastery effects MA1-MA4 as data on the law | Measured fewer stages and lower cost at higher skill, with identical truth |
| L9 | Quick, guided and deep involvement over one resolver | The quick level reproduces the recorded method exactly; deep can beat it only with better choices |

L6-L8 extend the open L1-L2 card. Canon verbs still wait for sourced scenes (L3).

## Round 4 (2026-10-15): deeper potions and the same model for every kind of making

Rules from rounds 1-3 are saved as standing [making rules](MAKING_RULES.md)
MR1-MR36. This round is a palette, not a spec. Each entry applies only where it
fits the world. Rune and weapon depth stays owned by the
[canonical palette](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md)
(RN1-RN*, WC, OV); this round maps the crafting model onto it rather than
restating it.

### PD. Deeper potion considerations

| Code | Angle | Consequence |
|---|---|---|
| PD1 | **Body ledger (AB2).** Each body keeps dose history, tolerance, buildup, withdrawal and overdose per effect family. | The same vial means different things to a novice, an addict or a troll. Potions become a body story, not a buff button. |
| PD2 | **Interactions between potions.** Effect families declare stacking (replace, add, saturate, cancel, synergize, react). | Cocktails, dangerous combos and deliberate antagonist brews |
| PD3 | **Routes.** Drink, splash, inhale, coat, apply to skin, feed a creature or plant, or pour on ground; each route has its own law. | A healing potion poured on a wound differs from one drunk; bombs come from the same chemistry. |
| PD4 | **Species and body type.** Nonhuman starts, creatures and plants respond through their own constitution. | Poisons for one species heal another; ties to [genetics](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) |
| PD5 | **Freshness and aging.** Harvest quality, preparation age and potion shelf life act only where a law reads them; some brews mature instead of spoiling. | Fresh stock matters, aged reserves gain value, and idle storage is a choice |
| PD6 | **Containers and apparatus.** Vessel material, sealing and contamination; apparatus wear and upgrades | Equipment progression without a fake stat |
| PD7 | **Workshop hazards.** Fumes, boil-over, volatile mixes and contamination, with severity per world law | Risk is a real cost of experimenting, scaled by mastery (MA4 recovery) |
| PD8 | **Byproducts as inputs.** Failed or waste brews leave useful intermediates, dyes, fertilizers or reagents. | Failure feeds other crafts instead of deleting stock. |
| PD9 | **Reverse engineering.** Assay a bought potion and infer its formula with uncertainty; counterfeits and label fraud can be detected. | Knowledge play beyond self-brewing (KN codes) |
| PD10 | **Grading and certification.** A class grade, guild seal or sect appraisal is a social record, separate from the truth (CR5-C2). | A school brewing class and a market both read the same product differently. |
| PD11 | **Batch scaling.** Scaling up can be nonlinear (heat, stirring, evenness); mastery and apparatus decide the safe batch size. | MA7 scale has a real skill component. |
| PD12 | **Signature potions and legacy recipes.** Family recipes, heirloom notes and annotated texts are knowledge routes with provenance. | The HBP-style annotated book as a reachable kind of item, not only one canon copy |
| PD13 | **Legality and economy.** Restricted ingredients, licensed brewing, black markets and price from scarcity and certified quality | Brewing ties into reputation and law. |
| PD14 | **Cheat lenses.** Odds lens, potion sense, reading the formula distance, or seeing hidden properties through draw and knowledge hooks (GA9) | Engine-aware cheats read the same snapshot the commit uses. |

### XD. The same model for every kind of making

Every domain shares the envelope in MR29. The table shows what changes per domain.
Owner links stay primary for the domains they already cover.

| Code | Domain | Substrate and atoms | Key verbs (examples) | Free experiment gives | Formula attractor | Failure gives | Mastery shows as | Owner |
|---|---|---|---|---|---|---|---|---|
| XD1 | Potions and alchemy | Ingredients in a vessel | Prepare, add, stir, heat, rest | Original brews | Canon or house formulas | Waste, degraded, hazard | Windows, variance, rescue | This doc |
| XD2 | Cooking | Ingredients in a dish | Cut, season, fry, simmer, plate | New dishes with taste and buffs | Regional classics | Burnt or bland, still edible | Taste reading, fewer steps, feasts | [Native cooking](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) |
| XD3 | Pills and elixirs | Herbs in a furnace | Refine, temper fire, condense | Unnamed pills with grade and impurity | Named pills | Cracked pill, toxicity | Grade ceiling, impurity removal | GT5 |
| XD4 | Smithing and weaponcraft | Parts on a frame; alloy composition | Smelt, alloy, forge, quench, temper, grind | Original blades with stat trade-offs | Named patterns and canon weapons | Brittle or warped, salvageable | Heat reading, less waste, signature work | [Weaponcraft WC](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) |
| XD5 | Armor and tailoring | Layers and fittings on a body shape | Cut, stitch, rivet, fit, dye | Original protection profiles | Canon armors, house styles | Poor fit, weak seams | Fit precision, layered designs | Maker-arts AR |
| XD6 | Runes and inscription | Atoms on a medium | Stroke, carve, ink, link, seal | Original rune strings with readable effects | Canon runes and known words | Fizzle, backlash, cracked medium | Capacity use, stroke accuracy, compression | Canonical RN1-RN* |
| XD7 | Enchanting | Runes on an item, with charge | Bind, channel, attune, anchor | Original enchantments | Canon enchantments | Unstable or cursed items | Stability, slot efficiency | RN family |
| XD8 | Formations and arrays | Runes on a place | Lay out, anchor, power, activate | Original fields | Canon arrays | Leaks, collapse, misfire | Bigger stable layouts, fewer anchors | RN family |
| XD9 | Talismans, seals and tattoos | Runes on paper or a body | Draw, consecrate, imprint | Original charms | Canon seals and tattoos | Burnt paper, body backlash | Speed drawing, body capacity | RN family |
| XD10 | Constructs and golems | Parts plus a pattern core plus power | Assemble, inscribe core, animate | Original constructs with quirks | Canon constructs | Inert or rogue construct | Instruction depth, autonomy | Maker-arts OM |
| XD11 | Devices and engineering | Parts with interfaces and power | Machine, wire, calibrate | Original gadgets | Canon designs | Jams, overheating | Tolerance, efficiency, miniaturization | Maker-arts W2 typed ports |
| XD12 | Cultivation and breeding of inputs | Living stock in a bed or pen | Plant, tend, cross, select | New strains with traits | Canon species | Blight, weak strains | Yield, trait control | [Genetics](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md), P8 |
| XD13 | Building | Structures on a site | Survey, lay, raise, finish | Original layouts with function | Canon buildings | Collapse, poor function | Speed, scale, durability | P6 buildings |
| XD14 | Rituals, contracts and summoning | Terms or offerings on a soul or circle | Prepare, invoke, bind, seal | Original pacts or rites | Canon rituals | Backlash, bad terms | Precision, safer bindings | RN family, conserved identity GT6 |
| XD15 | Creative works | Content on a medium | Compose, draft, perform, revise | Original works with reception | Canon masterpieces stay unique | Poor reception | Style, reputation | P6 creative works |

### XI. Cross-domain links worth keeping

| Code | Link | Why |
|---|---|---|
| XI1 | Potion as a coating, ink or quench liquid | One chemistry feeds blades, runes and smithing. |
| XI2 | Alloy and medium decide rune capacity | Smithing quality matters to enchanters. |
| XI3 | Herbs serve medicine, cooking, dye and ink (Taiwu DQ1 F1/F4) | One harvest supports several makers; multi-use ingredients carry the economy. |
| XI4 | Byproducts flow between crafts | Slag becomes glaze; failed brew becomes fertilizer (PD8). |
| XI5 | Mastery transfers partially between related crafts by world law | A brewer learns cooking faster; transfer is a per-world adjective. |
| XI6 | Shared apparatus and stations | A forge serves smithing and alchemy heat, with booking conflicts. |
| XI7 | Composite items stack the logics | Alloy blade plus inscription plus bound core, each resolved by its own logic (MR29). |

### ACCOUNT FOR NOW: engine constraints (continuing ER)

| Code | Constraint |
|---|---|
| ER15 | Before a second domain lands, split the shared envelope out of `craft_resolver.js`: identity, outcome label, maker snapshot, execution draw and stage timeline. Composition stays one logic module (MR29). |
| ER16 | The product registry (`craft_product_registry.js`) is the single identity path for every made thing, gear included. This matches the canonical palette's first pick (W4 PS1 braces on the registry). |
| ER17 | Body ledger (PD1) and effect families (PD2) are prerequisites before any potion wiring that stacks effects (audit R5). |

### LATER / DELEGATE (not dispatched)

| Code | Slice | Done check |
|---|---|---|
| L10 | Shared making envelope split, with composition as the first logic module | All existing craft tests pass unchanged; a stub second logic module shares registry, outcome labels and the draw |
| L11 | Body ledger and effect families (PD1/PD2) on an original fixture | Tolerance and stacking tests; save/reload keeps exact exposure |
| L12 | First non-potion domain on the envelope: a smithing alloy and quench pair (XD4), aligned with W4 PS1/PS3 | A free alloy gives an original; a known pattern gives its product; mastery narrows variance |
| L13 | First pattern-logic domain: one useful rune on a medium (XD6), aligned with W4 PS5's work lamp | Capacity, backlash and a real consumer; truth separate from knowledge |

## Round 5 (2026-10-15): little and subtle details

Request: "other little and subtle stuff" ([USER_VISION](USER_VISION.md#crafting-long-term-notes-and-subtle-details-2026-10-15)).
Long-term retrieval notes are saved in Codex memory
(`~/.codex/memories/extensions/ad_hoc/notes/2026-10-16T03-51-55Z-yair-making-rules-and-crafting-engine.md`)
and in Claude memory (`making-rules`).

### ACT NOW: fixed in the engine this pass

| Code | Defect | Fix and proof |
|---|---|---|
| SF1 | Regrowth drifted when 1,440 is not divisible by `regenPerDay`. With 7 per day, checking every few minutes gained stock that one long check would not. | Nodes keep an exact `carry` remainder; `nextAt` uses it. A test now sweeps rates 1, 6, 7, 13 and 1000. |
| SF2 | A rare roll that hit while every rare yield was gated (season or tool) still reset the pity counter, so the guarantee was spent on nothing. | A blocked rare counts as a miss, and the guarantee stays owed. Regression test added. |

Engine tests: 18 pass.

### SC. Subtle engine details (ACCOUNT FOR NOW)

| Code | Detail | Consequence |
|---|---|---|
| SC1 | **IDs carry truth.** Generated material IDs embed the family (`gen:reedherb:...`). Product IDs embed full composition. | UI, logs, sorting, tooltips and exported names must never show or sort by raw IDs (MR31). Use the observer projection and a neutral appearance. |
| SC2 | **Unidentified vials look identical.** Every unknown brew projects as "Unidentified herbal vial". | Reuse the existing per-save appearance layer (`product_appearance_*`) for neutral observed descriptors (color, smell), so players can tell vials apart without learning truth. |
| SC3 | **Yield count is undefined.** A batch has mass but no rule for how many carriers it fills. | Before wiring, each law needs a carrier size and a remainder rule (leftover kept as residue, not deleted). |
| SC4 | **Floors bias low.** Tiny or diluted batches can resolve to 0 effect while trace actives remain. | Decide a "trace" display and whether sub-threshold doses still count toward body ledgers (PD1). Never round a hazard away. |
| SC5 | **Hour windows stop idle gathering.** `gatherIdle` stops at the first gated hour instead of waiting for the window. | Idle routes should skip to the next open window, with a stated reason. |
| SC6 | **Time going backwards throws.** Rewind, loop and regression worlds restore node snapshots; they must never feed an earlier minute. | Timeline owners checkpoint source nodes with the rest of the world state. |
| SC7 | **Save size.** Product IDs run to about 500 characters, and inventory keys repeat them. | Before many products exist, consider a stable short handle per product inside the owner, keeping the canonical record. |
| SC8 | **Frozen recipe witnesses sit in the save.** A secret recipe's solution is readable in an Export file. | Acceptable for save integrity. Never surface it in UI, logs or reports (sealed-secret rule); cheats reveal it only through their own route. |
| SC9 | **Generated names repeat** ("Low reed" in two places). | Display disambiguates by place or origin once a player holds both. Names also need a per-locale grammar (`locales/`). |
| SC10 | **Variants regenerate on every harvest.** | Cache local variants by root, world, location and source when wiring; truth is unchanged. |
| SC11 | **Harvest quality fragments stacks.** Each grade is its own stack. | Group comparable stacks in UI and keep exact selection (audit R8). |
| SC12 | **Order-dependent overlays.** Ban-then-reweight differs from reweight-then-ban. | World packs state overlay order explicitly (core, world, region, person), and receipts keep the reasons. |

### SP. Subtle play details (palette)

| Code | Detail |
|---|---|
| SP1 | Feedback timing: show what the senses would catch (fizz, color drift, smell) at the stage it happens, not a full report at the end. |
| SP2 | Failure teaches only what that failure distinguishes; the log says what is now known and what is still unknown. |
| SP3 | Undo honesty: cancelling before commit is free; after commit, the attempt happened (MR4). |
| SP4 | Muscle memory: a repeated method gets faster to set up (MA1) without changing truth. |
| SP5 | Attribution: invented recipes keep a maker credit; teaching, selling or stealing a method moves knowledge, not credit. |
| SP6 | Apprentice drift: a method copied by an NPC can mutate slightly under their skill. That makes knowledge lineages. |
| SP7 | Tool attachment: a favorite cauldron, hammer or brush gains familiarity (a narrow precision bonus) and a history. |
| SP8 | Weather and mood nudges only where a world law reads them; never a hidden random penalty (audit P15). |
| SP9 | Brews in progress during a world switch follow the time direction: frozen with the world, never resolved remotely by default. |
| SP10 | Death and rebirth: know-how can live in the soul, the body or a notebook, per world law. Materials stay where they were left. |
| SP11 | Accessibility: every color or sound cue has a text equivalent (UI rules). |
| SP12 | Selling unknowns: shop prices and NPC reactions use the buyer's knowledge, so an expert merchant's offer is itself a clue. |

### SX. Subtle details by domain

| Code | Domain | Details |
|---|---|---|
| SX1 | Potions | Settling over time separates layers (shake before use); a vessel residue contaminates the next brew; the last drop is weaker or stronger by law |
| SX2 | Smithing | Heat memory and quench medium (a potion as quench, XI1); grain direction; hammer marks as a maker signature; re-tempering changes history |
| SX3 | Runes | Stroke order; partial erasure leaving residue; reading direction; overlapping or mirrored runes; ink fading with use; a medium's flaws limiting placement |
| SX4 | Enchanting and formations | Interference between nearby enchantments or arrays; land ownership for formations; anchors drifting with seasons or ley changes where a world states it |
| SX5 | Cooking | Each NPC has taste preferences; leftovers age; a shared meal carries social weight |
| SX6 | Constructs and devices | Ambiguous instructions read literally; wear makes them quirky; maintenance as an idle chore |
| SX7 | Harvesting | Harvest by the wrong method damages the plant's regrowth; picking the best leaves first changes later quality; footpaths form at sites you visit often |

## Current plan reconciliation, 2026-10-18

The original consumer/old-save gates above describe the engine-only release.
M3's later B4 and post-merge follow-up record the narrow consumer proof;
[checkpoint](gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md) owns its input
and UI integration limits. Reuse only matching evidence (AD36). Broader formula
modes, other product families and human feel remain distinct, unaccepted work.
Old-save migration is currently deferred by the 2026-10-17 decision; new-state
persistence still matters. No new M3 attempt is launched here.

For the next selected staged craft, apply MR1/MR5/MR29, AR7/AR8 and
[G26–G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18):
interrupt before and after one completed stage, retain genuine intermediate
stock, and verify useful use after resumption. Personal/world clock choice must
be explicit; a frozen world does not run an ordinary external supplier or teacher.
This scenario is selected only when a stage/idle seam changes, not a prerequisite
for all remaining crafting modes.
