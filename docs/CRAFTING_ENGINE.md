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

   The gate after that is a rebuilt fresh-origin browser check at 1920×1080 with Save, reload, Export and literal Import.
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

See also (2026-10-19): [World dials and interpreter considerations](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) on registering WR1 to WR10 as dials and the resolver in `src/rule_modules.js`. Proposal only.

## Round 6 (2026-10-19): tags, subtle properties, new material families, places and display

Request (Weibao, 2026-10-19): "More tags and subtle stuff that is needed and more? New
crafting materials? Places to go to harvest them? How to show in UI and other aspects?
Send out considerations accordingly." **Status: proposal.** Nothing here is accepted or
built. Codes **TQ1 to TQ15** (tags and subtle properties), **NX1 to NX14** (material
families), **PG1 to PG14** (places and supply forms), **UV1 to UV14** (display); prefixes
checked unused by `git grep` 2026-10-19. Every row says which earlier code it extends or
that it is new, because this round is for new angles only.

Read before writing (headers and exports, not full files): `src/tag_store.js`,
`src/craft_materials.js`, `src/craft_sources.js`, `src/craft_content_frontier.js`,
`src/harvest.js`, `src/mixture_rules.js`, `src/world_completion_materials_*.js`,
[E4 tags](emergent/E4_TAGS_AND_RULES.md), [E4B materials](emergent/E4B_MATERIALS_AND_NOITA.md),
[gathering uses](GATHERING_AND_RESOURCE_USES.md), [site rules](SITE_AND_EXPLORATION_RULES.md) SR1 to SR24,
[UI rules](UI_RULES.md) UR1 to UR49.

### What the code already does (SHOWN)

- **Tags are presence-only** with `id`, `kind`, `parents`, `revision`, `visible` (`open` or
  `hidden`). Kinds in the frontier pack: origin, phase, use, property, derived, station, tool,
  season, place. One hidden derived tag, `moonlit`. Amounts live in **axes** (fraction or scalar,
  with a `hidden` flag), not tags.
- **Sources** have kind (gather, mine), place tags (`at`), capacity, `regenPerDay`, variants,
  quality range, tool/skill/hour/season gates, pity, an odds forecast and bounded idle gathering
  (`MAX_IDLE_HARVESTS` 500). The engine names no ingredient; content packs supply data.
- **Animal harvest** is a separate pure slice: a specimen draw (size, condition, variant), graded
  parts (pelt, tail, fang), 24-lot cap.
- **A material crop bed, plot and steward** already exist for the frontier world in
  `world_completion_materials_*` (ids for plot, bed, steward). Reuse them (AR3) instead of a new bed owner.

### TQ. Tags and subtle properties

| Code | Consideration | Default | Dial and reason | Extends |
|---|---|---|---|---|
| TQ1 | A property with a degree is an axis; a property that is present or absent is a tag; a derived tag is computed from axis thresholds | Keep that split; write the threshold as data with a reason | Threshold per world, so "toxic" can mean different amounts under different laws; the receipt shows which threshold fired | AD38, GR7; new threshold dial |
| TQ2 | More tag kinds, as data, only when a reader exists | Candidates: `habitat` (where it grows), `condition` (fresh, wilted), `handling` (needs care), `hazard`, `provenance` (home world), `appearance` (observed look), `form` (ground, dried, steeped) | One kind per reader; a kind with no reader waits (GR12) | New; the `place` kind today serves both habitat and location |
| TQ3 | Conditions that change over time derive from an age axis and a clock, not a stored tag | `condition` is computed on read from age and cause | Clock choice (world, body or personal) is explicit; a frozen world does not age ordinary stock | SC6, GR17, SP9; new rule |
| TQ4 | Processing changes axes and tags through a law and writes history | Process state (`form`) records the step that caused it | Per-world process vocabulary (WR2) | PR section; new tag kind |
| TQ5 | Provenance tag keeps a material's home-world rules | Material carries origin world; imports judged by home law unless a crossing says otherwise | Per crossing | SB16, WR10 |
| TQ6 | Hidden is not the same as unknown, and neither is identified | Three states: not perceivable, perceivable but not noticed, noticed with a stage (seen, tested, understood) | Stage routes per world | SC2, `visible:'hidden'`; new stages |
| TQ7 | A parent tag makes children match, which gives functional substitution for free, and also makes a broad parent over-match | A substitute profile combines axes and tags, never a parent alone | Profile breadth per world; learner must understand the profile first | E4B substitution answers; new risk row |
| TQ8 | Tag hygiene | One meaning per tag, no synonyms, a revision on any change of meaning, a reader per tag | Coverage list generated from content (WDI33, L1 C1) | WDI33; new for tags |
| TQ9 | Tool and station tags are capabilities, not labels | A tool tag names what the tool does; wear changes the fact, not the tag | Per world apparatus (WR6) | WR6; new |
| TQ10 | Absence: "no toxin" (measured zero) differs from "toxin not measured" | Axis value exists only when measured; unmeasured is unknown | Instruments per world | Knowledge channel; new |
| TQ11 | Residue and contamination ride on containers | Container carries a residue record that a next use reads | Cleaning cost per world | SX1; new transfer rule |
| TQ12 | Appearance tags are separate from property tags so look-alikes can exist | A poisonous look-alike shares appearance tags and not property facts | Per world, per season | SC2, G57; new |
| TQ13 | Environmental modifiers change an axis only where a world law reads them | Weather, moon or site field changes the batch record, not the family's truth | Per world | SP8, SR16; new |
| TQ14 | Rarity belongs to a source, not to a material tag | A "rare" tag on a material would leak to display | Scheduled rarity per source (SB9) | SB9, SC; new |
| TQ15 | Tag ids and kinds never reach the player | Labels come from the observer projection | None | SC1, MR31 |

### NX. New material families (mechanism, not ingredient lists)

The engine header says it never names an ingredient, so this section proposes **axes, use
tags and family shapes**. Any named example is ORIGINAL and belongs to a stated world (RS2).
Canon worlds gain no invented ingredient that contradicts source scarcity (RS4).

| Code | Consideration | Default | Dial and reason | Extends |
|---|---|---|---|---|
| NX1 | More axes by mechanism | Candidates: stability (decay rate), solubility, volatility, density, flexibility, fibre strength, conductivity, nutrition, and a world-energy affinity axis | A world adopts a subset in its catalogue; an axis nobody reads waits (GR12) | Existing axes (restore, vigor, toxin, ash, hardness, glow); new axes |
| NX2 | Role tags (`use` kind) | Binder, solvent, catalyst, reagent, fibre, pigment, fuel, flux, preservative, abrasive, container | Per world, as tags with a reader | `solvent` exists; new roles |
| NX3 | Animal-derived families generalize the specimen draw | Parts keep size, condition and variant of their specimen; family shapes share the catalogue | Which parts a species yields per world | `harvest.js`; RS3 living donor |
| NX4 | Processed intermediates are materials | Ground, dried, steeped, rendered, smelted, each with composition history | Process set per world | PR, XD; new |
| NX5 | Residues and salvage have real readers | Ash, slag, spent grounds feed another recipe or a sink | Per world | SR12, SR15 |
| NX6 | Gathering context sits on the lot | A lot records where, when and under what field it was taken | Which fields a world records | SR16; new lot fields |
| NX7 | Perishable and unstable materials | Decay is an axis on a clock; preservation is a process | Clock per world | SP9, TQ3 |
| NX8 | Hazard by mechanism | Hazard axes and handling requirements, not a "poison" label | Per world | AD38; SC4 (never round a hazard away) |
| NX9 | Imports | Inert or home-rule by crossing | Per edge | WR10 |
| NX10 | Source-world materials | Only from a read source with a tier label; no invented canon | Held; needs the deep-dive route and the AU budget | RS1, RS4, P9 |
| NX11 | Identity layers | Family, variant, lot, batch; each answers a different question | Variant depth per world | `localVariants`; new naming for the layers |
| NX12 | Stack fragmentation by quality | Group comparable lots in display, keep exact selection | Grouping rule per surface | SC11 |
| NX13 | Non-herbal worlds use the same catalogue shape | Spirit, mana or ley affinity as an axis; mineral, fibre, food as families | Whether the energy axis exists is a world dial (WDI) | XD |
| NX14 | Food is a material family | Nutrition axis, spoilage clock, preparation as process | Per world | XD, SX5 |

### PG. Places and supply forms

RS3 already lists eight supply forms (wild site, cultivated bed, shop, institutional store,
living donor, trade route, reward, salvage). This section covers how the engine and world
serve each one.

| Code | Consideration | Default | Dial and reason | Extends |
|---|---|---|---|---|
| PG1 | One node ledger for finite natural sources; another owner for shops | Gather, mine, fish, fell, tap, dig, scavenge use `craft_sources` nodes; shop stock uses the economy ledger | One authority per fact (AR3) | RS3; new mapping |
| PG2 | Source kinds as data | Add kinds as data rows (fish, fell, tap, dig, scavenge, tend, hunt) before any code | Per world | `kind:'gather'|'mine'` today |
| PG3 | Habitat tags at region level; spots as node instances | Canon anchors stay authored; generated fill is nodes on existing places | Fill density per world | RS1, SR1 |
| PG4 | Discovery routes | Map, rumor, teacher, tracks, survey; inspecting consumes no stock or draws | Route per world | RS11, SR13 |
| PG5 | Renewal needs a cause and a clock | Regrowth, season, rain, fire-clear; return and reload are not causes | Cause set per world | SR20, SC5; extends `regenPerDay` |
| PG6 | Wrong-method damage | Harvest method changes regrowth (SX7) | Per source | SX7; new field |
| PG7 | Access and ownership | Commons, custom, private, institution, permit; social cost with the take | Per world and place | RS8, SR19 |
| PG8 | Danger and distance | Declared before commitment; travel through activity time | Per place | SR14 |
| PG9 | Every yield has a reader, and every needed profile has a known source route | Coverage lint both ways | Draft content may have gaps marked `draft` | SR12, GR12 |
| PG10 | Cultivated beds reuse the existing bed, plot and steward owner | No second bed owner | Per world | AR3, `world_completion_materials` |
| PG11 | Per-world shapes | Village commons, school stores, markets, dungeon salvage, spirit fields; fan worlds need a source tier | Per world | RS4, P9 |
| PG12 | Idle gathering waits for the next open window and says why | Skip-ahead with a stated reason | Cap per world | SC5; `MAX_IDLE_HARVESTS` |
| PG13 | NPC gatherers | Default: node truth changes only through accepted actions, no invented society | Opt-in per world | SR21 |
| PG14 | Outing as a connected loop | Gather, carry, process, use, as one trip | Per world | Gathering uses, connected outing |

### UV. Display

**Target viewport:** 1920×1080 primary, MacBook about 1800×1040, floors 1536×864 and
1366×768. **Visible outcome:** a player sees what a material is as far as they know it, where
it can be found, and what a place offers, without raw ids. **Deferred scope:** mobile layout,
the director dial editor and a full map redesign. These rows are doc-only proposals and make
no behavior claim; native evidence needs a rebuilt browser check at the target viewport.

| Code | Consideration | Default | Dial and reason | Extends |
|---|---|---|---|---|
| UV1 | Surface and home | One "Gather" entry in the place's Local actions that opens a task region listing sources there; unaccepted layouts go to the Projects drawer | Entry count stays near seven (UR3) | UR1 to UR4 |
| UV2 | Material card | Observed descriptor, known axes with their stage, known tags as labels, source place, lot, condition, handling; unknown shows as unknown, never blank | Detail depth by task frequency (UR42) | SC1, SC2 |
| UV3 | Tags | Chips grouped by kind; hover for a short meaning, pin for detail; hidden tags absent | Per surface | UR43, UR47 |
| UV4 | Odds forecast | The same resolver snapshot the commit uses, with top reasons; a preview consumes nothing | Detail by knowledge | SR13, SB1, GR9 |
| UV5 | Place source list | Name, stock band (exact only when known), next open window, declared tool gate, danger, access cost; undiscovered sources absent | Band width per world | RS11 |
| UV6 | Sort, group, search | By family, use, place, quality; group comparable stacks; exact selection kept | Defaults per surface | SC11 |
| UV7 | Log rows | Compact rows; the outcome names what was learned and what is still unknown | Verbosity per player | UR44, SP2 |
| UV8 | Compare two materials | Side by side on known axes; substitution match shown only for profiles the player understands | Per world | E4B "only substitute what you understand" |
| UV9 | Map layer | Discovered sources with a last-seen stock note that can go stale | Staleness per world | SR20; knowledge staleness |
| UV10 | "Where to find" from a recipe slot | Lists sources the player already knows could fit; a lens cheat can widen it | Per world | WDI15 cheats as layer entries |
| UV11 | Text equivalent for every colour or sound cue | Always | None | SP11 |
| UV12 | Late-game density | Search, filter, virtual lists; repeated names disambiguated by place | Per surface | SC9 |
| UV13 | Depleted or closed state | Node stays listed with its cause and clock | Per world | UR13, SR20 |
| UV14 | Evidence | `ui-preview.html` fixtures at both viewports, then a rebuilt native check | None | UR45, AGENTS UI gate |

### Disposition

**ACT NOW (done in this section):** owner map; prefix check; corrections: the "tags are presence-only"
fact and the existing axis channel settle where "burns a little" belongs (axis or fact, not a tag).

**ACCOUNT FOR NOW (constraints, no feature work):** no tag without a reader (TQ8); no raw ids in
display (TQ15, SC1); no ingredient named in engine code (NX header); one node ledger and one bed
owner (PG1, PG10); every UI row declares a surface type (UV1).

**LATER / DELEGATE:**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Tag and kind inventory against live definitions, with proposed additions and readers (TQ2, TQ8) | Balanced | Doc, one session | Lists every live kind and tag with its reader or "none found"; each addition names a reader |
| Display and surface placement for materials, sources and tags (UV1 to UV14) | Balanced | Doc, one session | Names a surface type and home per view; viewports and deferred scope stated; no behavior claim |
| Per-world material and place shapes from source (NX10, PG11) | Strong | Held | Needs the deep-dive route, AU budget and Weibao's go |
| Source-kind data rows and a coverage lint (PG2, PG9) | Balanced | Small code slice | Held; needs a go and a registered seam |

Lanes, route and run log: [world dials core audit](audits/WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md#round-2-materials-tags-places-and-display).

### Fold: MQ-A and MQ-B returns, 2026-10-19

Lane outputs (doc only, reading only, nothing run): [MQ-A tag inventory](audits/materials_tags_2026-10-19/MQ_A_TAG_INVENTORY.md),
[MQ-B display placement](audits/materials_tags_2026-10-19/MQ_B_DISPLAY_PLACEMENT.md). The root spot-checked the
`fictional-mass` unit, the `['steep','boil']` check, the `tagLaws` law field and the UR58 count.

**Corrections first (the root was wrong or overstated)**

- **TQ16. Derived tags are stored at resolve time, not computed on read.** TQ1 and TQ3 read as if derived
  tags recompute. Live code builds them from `tagLaws` rows `{tag, axis, min}` when a batch resolves,
  stores them on the product outside its identity, and `projectProduct` only filters them by knowledge
  (`craft_resolver.js:168-177`, `craft_state.js:74`). So per-world thresholds already work through law
  revisions and match freeze-on-reveal (GR3). TQ3's computed-on-read applies to **condition** (age-driven),
  which is a different mechanism from derived tags. Missing today: a `reason` on the row and a fired-threshold
  line in the trace.
- **TQ17. `origin` already means two things.** The tag kind `origin` means botanical or mineral category,
  and every material has an `origin` object for generation provenance (`craft_materials.js:136-139`).
  TQ2's `provenance` kind collides with this. Rename or document first.
- **TQ18. Two parallel property systems run.** Village mixture keeps its own fractions and tags
  (`mixture_state.js`, `mixture_rules.js`), while the frontier catalogue has its own axes and tags. That is
  two owners for "what an ingredient is" (AR3 pressure). This is a decision for Weibao's first-slice order, not
  an agent default; both stay until one slice picks.
- **TQ19. Readers are thin.** Tags with no reader found: `wet`, `village`, `village.fluid`, `village.salt`.
  The axis `hardness` has no reader. Most proposed kinds and axes (NX1) wait under GR12; only `form` has a
  plausible first reader (a recipe slot selecting a processed intermediate).
- **TQ20. Stale header.** `craft_content_frontier.js` says "Not wired into live gameplay yet", but
  `crafting_frontier_runtime.js` imports it. Update the comment in a later code slice.
- **UV15. UI rule count.** Round 6 cited UR1 to UR49; the rulebook runs to UR58. UR52 (known-empty versus
  unknown), UR56 (grouping), UR57 (click and key cost) and UR58 (display preference owner) apply to UV rows.
- **UV16. Existing harvest panel is the carcass panel.** `harvest_ui.js` is the animal slice with inline
  styling and a 500 ms poll, so plant and mineral gathering gets a new `definePanel` module with an ST2 row, not an
  extension of it. The raw forecast carries yield ids and exact stock, so a projection sits between it and any view.

**Settled by the lanes**

- **L1 Q1 answered.** `input.mass` unit is `fictional-mass`, one ingredient pack is 1000, and the dose
  normalizes against a 2000-unit reference vial (`mixture_state.js:25,70`).
- **L1 Q2 corrected.** The `procedure.process` list is owned today by the Village mixture, `['steep','boil']`
  (`mixture_state.js:56`), not the making domain as L1 proposed; the frontier law has its own `steep, boil, grind`.
  The next L1 revision should register it with that owner and flag the second enumeration.
- **Display defaults (MQ-B).** One "Gather here" entry opening a place-service region through `centerModes()`;
  material card as a pinned inspection; tag chips inside the card; log rows in the existing Reports column;
  UV9 reduced to a "last seen" text line (the map layer waits for the deferred map redesign); UV10 as a link in the
  recipe requirement row. Twelve preview fixtures proposed; nine conflicts listed (X1 to X9).
- **Hover-then-pin is still an agent recommendation** awaiting Weibao's pick (UI_RULES UR43 note); UV3 and UV8 carry
  that status.

**Open and unverified**

- Neither lane ran code, tests or a browser; no screenshot exists at any viewport.
- MQ-A did not trace item boolean tag maps (a third tag-like system), `src/data/*`, or how the trace is built.
- MQ-B did not read `product_appearance_state.js`, real Local-actions counts on a populated save, or `display.js`.
- MQ-A and MQ-B open questions: canonical long-term op list; which kind to rename to free `origin`; who builds the
  observer projection for sources and materials; one-source place as entry or direct start (default: entry for two
  or more sources, direct start for one).

**Next steps (proposal, ranked, none selected)**

| Rank | Step | Level | Effort | Done check |
|---|---|---|---|---|
| 1 | Reader coverage report over both live tag registries and the axis table | Balanced | Small script and snapshot | Lists exactly the unread tags and `hardness`; `check:rules` unchanged |
| 2 | `reason` on `tagLaws` rows plus a fired-threshold trace line | Balanced | Small, `craft_resolver.js` and tests | Product ids unchanged; seed sweep and save/reload/import pass |
| 3 | Record the single owner of the `procedure.process` list and the second enumeration | Strong | Doc decision | One enum referenced by the L1 registry |
| 4 | Source list plus "Gather here" entry for the one frontier source (UV1, UV5, UV13) | Balanced | Small code slice, needs Weibao's go | Rebuilt game at 1920x1080 and 1366x768; no ids in rendered text; Local-actions count recorded |
| 5 | Material card with knowledge stages (UV2, UV3, UV11) | Balanced | Small, after 4 | Same lot shown unknown, partial and known at both viewports |

Everything stays a proposal until Weibao says go. The TQ18 decision (which property system carries forward) comes
before steps 4 and 5 if they touch Village mixing.

## Round 7 (2026-10-19): alchemy and procedural interactions from tier, difference and tags

Request (Weibao, 2026-10-19): "What about alchemy, other stuff and more? Procedural stuff so that there
are basically unlimited interactions based on tier, differences, tags, other stuff, and more?"
**Status: proposal.** Codes **IX1 to IX24** (prefix checked unused by `git grep` 2026-10-19). Each row says
what it extends or that it is new. Owners read, not restated: [PD, XD, XI](CRAFTING_ENGINE.md) above,
[procedural materials and alchemy audit](PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) (P1 to P15, R1 to R9),
[E4B reactions and profile substitution](emergent/E4B_MATERIALS_AND_NOITA.md), [E4 tags and rules](emergent/E4_TAGS_AND_RULES.md),
`src/craft_resolver.js`, `src/craft_content_frontier.js`.

### What the live engine already gives (SHOWN)

- **Composition space is already unbounded in practice.** A batch is inputs (up to 999 each) plus up to 12 process
  steps; product identity embeds the full composition, so distinct products outnumber any authored list
  (`craft_resolver.js:12-13,94-99`; SC1, SC7).
- **Interactions are authored law shapes, not per-pair entries.** A law is data: ops (station, levels, axis
  conversions, availability), reactions (reactants and products as axis amounts, `limit` permille, optional
  catalyst tag query, station, `after` op, `priority`), output laws (dose, total, scalar) and tag laws. Mass is
  conserved or the batch fails (`craft_resolver.js:23-26,129-168`).
- **Reaction order is deterministic and meaningful.** Reactions sort by `priority` then id, and each consumes shared
  reactants in turn (`:64,128-135`), so two reactions on one axis give an order-dependent result by design.
- **P1 sets the honest bound.** Generated combinations remove the need for one coded item per combination; they
  cannot invent implemented mechanics from arbitrary words (audit P1). "Unlimited" therefore means an
  unbounded space of instances over a finite set of authored law families.
- **No tier concept exists in the resolver.** Quality bands exist on sources and GT5 names grade and impurity
  for pills; nothing orders kinds of things by rank.

### IX-A. Making the space combinatorial without authoring pairs

| Code | Consideration | Default | Dial and reason | Extends |
|---|---|---|---|---|
| IX1 | Honest bound: unlimited instances, finite mechanics | Say so in the design: law families are authored, instances are generated | Which families a world ships | Audit P1 |
| IX2 | Interaction law families as parameterised data shapes | Beyond convert and react: neutralize (opposed axes cancel), synergize (matched axes amplify), saturate (cap), inhibit, separate (recover a fraction), dissolve, volatilize, age (clock), precipitate; each takes axes and numbers, never ingredient names | Family set per world; a family nobody reads waits (GR12) | Ops and reactions today; P5 |
| IX3 | A relation graph between axes, once per world | Axes declare relations (opposes, feeds, amplifies, dampens, cycles with) as data; a family reads the graph, so adding one axis adds a few rows and yields many interactions | Graph shape per world: five-element cycle, school opposites, polarity pairs, none | New; the unlimited engine is relation rows times law families |
| IX4 | Differences as first-class facts | A law may read a difference between two lots or axes: tier gap, purity gap, phase mismatch, polarity, mass ratio, distance to a formula | Which differences a world reads | OV2 attractor distance; new |
| IX5 | Tier as an ordinal | A world declares whether tiers exist and how many; tier is a rank of a kind of thing, set by data or derived by threshold from an axis; stored on the lot like derived tags | Tier count per world (none, three, nine, and so on); canon tiers pinned | TQ16 stored-derived pattern; new |
| IX6 | Tier-gap laws | Adjacent tiers combine; a larger gap lets the higher tier dominate, dilutes, or leaves the lower inert; output tier is capped by the lowest or highest input per law; uplift needs a catalyst of tier t | Rule per world and family | New; reads IX4 |
| IX7 | Vocabulary: tier, grade, purity, quality | Four words, four meanings: **tier** ranks the kind, **grade** ranks quality within a tier, **purity** is an impurity fraction axis, **quality** is a source yield band | Names per world, meanings fixed in data | GT5, `quality` on sources; new hygiene row |
| IX8 | Tag-pair rules with patterns | A rule matches tag patterns on both sides with parents and specificity, so one rule covers a family of pairs | Rule layer per world | E4B reactions table; E4 rule schema is a draft |
| IX9 | Two rule systems already exist | The craft law (axes and reactions) and the rule-module resolver (tags, predicates, parameters). Decide which carries tag-pair interactions before building either | Weibao's slice order, not an agent default | TQ18 sibling; WDI2 |
| IX10 | Outcomes land in readers | Outcome classes: shift axis amounts (conserved), add or remove a tag, change phase, start a stability clock, leave a residue or byproduct, emit a hazard event, shift tier | Class set per world | PD7, PD8, SR12; R4 conservation |
| IX11 | Effects stay in registered families | Unlimited mixes map onto finite effect families with magnitude, duration, route and side-effect profile; new behavior needs a new authored family | Families per world | R5, PD2, ER17 |

### IX-B. Alchemy specifics

| Code | Consideration | Default | Dial and reason | Extends |
|---|---|---|---|---|
| IX12 | Order, rest and vessel | Order of addition, settling, residue and sealed versus open heat matter only when a law reads them | Per world | P6, SX1, PD6 |
| IX13 | Catalysts can foul | A catalyst is not consumed but may lose effect or contaminate | Per world | Catalyst role in `craft_resolver.js` |
| IX14 | Reversibility under conservation | Separation and distillation recover fractions without making mass | Per world | P5 |
| IX15 | Batch scaling is nonlinear where heat or stirring matters | Safe batch size from apparatus and mastery | Per world | PD11 |
| IX16 | Body ledger first | Potions that stack need dose history and effect families before wiring; otherwise unlimited potions become stackable buffs | None; a prerequisite | PD1, PD2, ER17 |
| IX17 | Mode per world | Original worlds run free mixing (GT1); canon formulas keep GT2 with a stated failure; pills use GT5 grade and impurity; D&D uses GT4 abstract | Per world | GT1 to GT8, OV1 |
| IX18 | Canon stays canon | Free mixing cannot contradict canon scarcity or canon effects; a canon identity is reached only through its formula | Per world | RS4, P9 |

### IX-C. Scale, balance, learning, display

| Code | Consideration | Default | Dial and reason | Extends |
|---|---|---|---|---|
| IX19 | Reaction count growth | A relation graph can imply many reactions; index by axis, build lazily, declare a budget per law | Budget per world | GR11; `craft_resolver.js` loop is steps times reactions |
| IX20 | Generated reactions need generated priorities | Where reactions share reactants, an explicit priority rule is part of the family | Per family | `priority` field today |
| IX21 | Balance by shape, not caps | Value comes from useful dose, effort, delivery, stability and side effect; mostly mediocre outcomes with rare strong ones; test for one dominant brew | Distribution band per world | Audit balance note, SB8; Weibao is the only player, so flatness is the risk, not abuse |
| IX22 | Learn rules, not pairs | Learning one relation ("these oppose") teaches a family of interactions; experiments reveal only what the test distinguishes | Teaching routes per world | P8, SP2, E4B understand-before-substitute |
| IX23 | Save and identity growth | Unlimited products grow identity strings and inventory keys; use lots, canonical identity, stable short handles and grouped display | Handle scheme per slice | SC7, SC11, R2 |
| IX24 | Display by family | Show interactions as known relations on the material card and an experiment notebook, not a pair list | Per surface | UV2, UV8; MQ-B UV rows |

### Disposition

**ACT NOW (done here):** owner map and corrections above, including that reaction order is deterministic by
`priority` then id and that no tier concept exists.

**ACCOUNT FOR NOW (constraints, no feature work):** one craft resolver and one product registry (ER15, ER16); body
ledger before stacking potions (IX16); no ingredient named in engine code; mass conservation stays a hard check;
choose the tag-pair carrier before building (IX9); tier, grade, purity and quality keep separate meanings (IX7).

**LATER / DELEGATE:**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Interaction-model feasibility: can relation graph, law families and tier express as data on `defineCraftLaw`, with a worked toy | Strong | Doc, one session (sent) | File names the smallest engine edits, a six-axis three-tier toy with traces, property-test list, scale numbers |
| Random-mix dominance search (find one best brew, mass leaks, order traps) | Balanced | Script plus doc | Seed sweep result with distribution and any degenerate recipe; no engine change |
| Tier vocabulary per world from existing docs (cultivation grades, HP, D&D) | Balanced | Doc | Held; reading budget and Weibao's go |
| Relation-graph and law-family data rows plus tests | Strong | Small code slice | Held; needs a go, IX9 decision and a registered seam |

### Fold: IX-A return, 2026-10-19

Lane output (doc only; the lane ran a scratch copy of the real `resolveBatch` outside the repo, one machine, one run):
[IX-A interaction model](audits/materials_tags_2026-10-19/IX_A_INTERACTION_MODEL.md).

**Corrections first (the root was wrong or overstated)**

- **IX25. Tier as a stored derived tag or a scalar axis does not work for rules.** IX5 suggested tier stored like derived tags. Scalars are mass-weighted means over the whole batch and no reaction can read a scalar, so a tier-3 lot plus a tier-1 lot reads as tier 2. A stored product tag is product-level and cannot gate a reaction inside the batch. What works is **strata**: one fraction axis per tier, which is data and needs no engine edit.
- **IX26. Tag pairs between consumed lots cannot ride the craft law today.** Only catalyst-lot and station tags are read. IX8 and IX9 need a tag-to-axis mapping (a family tag contributes to a stratum) or a small new `present` query.
- **IX27. The rule-module resolver is the wrong carrier for amount-moving interactions.** It deliberately admits no reaction executor and one parameter target. Default: amount-moving interactions ride the craft law; the rule resolver keeps gates, records and witnessed consequences. This settles IX9's default, still subject to Weibao's slice order.
- **IX28. Reaction cascades exist within one pass.** A later reaction sees earlier products, so feed rows behave as a priority-ordered cascade (hand trace B6 was wrong until a scratch run caught it). Property tests must cover chains.
- **IX29. Unlimited does not cover everything.** Order of addition, concentration and dilution effects, and per-lot facts are not expressible today (reactions use absolute amounts; lots are summed before any law runs).

**Settled by the lane**

- **A relation graph plus law families compiles to ordinary reaction rows.** A pure `compileRelations` step runs before `defineCraftLaw` and needs no engine edit. Generated rows need generated priorities (family sets the high digits).
- **Tier-gap rule as data:** coefficient of the lower side by gap `[1, 2, none]`, so gap 0 cancels 1:1, gap 1 lets the higher tier cancel two lower units, gap 2 emits no reaction. Integer ratios conserve mass by construction.
- **Scale:** measured 0.5 ms per 12-step resolve at 400 reactions and 2.5 ms at 3900 (scratch, never-firing reactions). Proposed per-law budget 512 reactions and 160 axes, enforced by the compile step.
- **Identity:** `law.ref` is `id@revision` only, so a changed relation row without a revision bump fails old-product validation instead of drifting; a content hash in the ref is the smallest hardening.
- **Dominance search design (held lane):** 2000 seeded batches over three world seeds, scored by the law's output rows; pass band is a world dial; failure signals are feed cascades that multiply a high-value axis, inhibit rows that zero an axis for free, and one op order that always wins.

**Open and unverified:** whether `craft_state`, the product registry and display read composition keys by fixed name (strata could break them); recipe matching with strata axes; AR1 baselines and `check:arch` were not run; the bench is one machine, one run.

**Next steps (proposal, ranked, none selected):** (1) E0, a pure `compileRelations` module plus a toy pack and the property tests, no engine edit; (2) E1, content hash in the law ref; (3) E2, `tier` on material with engine stratification, only if strata axes prove clumsy; (4) E3, reaction bucketing and a budget; (5) E5, a consumed-lot `present` query or `minConcentration`. Held until Weibao's go.

See also (2026-10-19): [World rule grammars and derived detail](WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md) on deriving grammar rows that seed the relation graph and tier tables (DG28). Proposal only.


## Corc reference round, 2026-10-20: commitments and material history

**Proposal additions**, following [CRL2–CRL5 and CRL13](research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md).
The source evidence, tradeoffs and candidate journeys live there. Applies MR1,
MR4–MR5, MR10, MR16–MR23, MR27–MR32, AD6–AD8, AD15–AD17 and AD38.
No new rulebook, runtime work or build order is selected.

| Reference | Useful addition to the existing making palette | Default, dial and reason/cost |
|---|---|---|
| CRL2 | Evaluate a method by what it preserves, not just whether it breaks the target | A clean cut can preserve a part where force makes useful scraps. Material/world law, skill and actual means tune the outcome; scraps need an actual reader such as fuel or another existing process. Reuse harvest completeness and the gear-depth owner before adding another material model. |
| CRL3 | A transfer changes custody, not the material's age | Preserve the relevant birth/exposure facts in a selected perishable route. A process can change deterioration through its actual mechanism. Cohorts need separate identity only if the chosen consumer reads their difference; no general spoilage engine or finite global bag is required. |
| CRL4 | A repeat request retains which costs the player intended to incur | Start from existing selected batches, material-change stops and tool-break handling. Quantity, input substitutions, tool choice and reserve policies can be explicit when useful. A changed scope stops or requotes; a completed stage stays settled. No duplicate scheduler. |
| CRL5 | Mastery can remove handling from a demonstrated routine | Practice can improve control or support bounded repeat work, with world-specific apparatus and stop conditions. New circumstances may still matter. This extends MR21–MR23 rather than making every craft a mandatory staged ritual. |

**ACT NOW (done):** bound these proposals to today's source/corpus inspection;
retain the current native selected-batch, tool and harvest seams. **ACCOUNT FOR
NOW:** a tool's hardness/precision fields need real consumers before they count
as useful mechanics; age, reservations and stopped work follow owning clocks.
**LATER / DELEGATE:** CRJ1 first when tools/gathering is next touched, CRJ2 when
freshness/custody is selected. Sol low/medium, small-to-medium for CRJ1 and medium
for CRJ2; done checks and rebuilt 1920×1080/persistence gates are in the linked
journey table. No lane dispatched; current old-save deferral stays in force.


## Reference detail fold, 2026-10-20: a commitment from quote to useful output

Proposal extension of CRL2–CRL5, MR1/MR4/MR5/MR8/MR10/MR21–MR23/MR28–MR31,
AR3/AR6–AR8 and AD38. The [fold map](research/proto23/ENGINE_AND_UI_DETAIL_CONNECTIONS_2026-10-20.md#plan-fold-and-further-interactions-2026-10-20)
routes PFA019–PFA023, PFA028–PFA037, service/condition comparisons and
PFE02–PFE04/PFE14 here. Existing SC/IX and native transaction owners retain detail.

Carry these connected questions into the next selected making route:

- Quote the actual tool, lots, station, goal and currently spendable stock; show
  native have/need, chance, teaching/XP and a useful known result nearby. Related
  recipes already cover up to six known same-page links. Wider producer search
  is a proposal, with PK11/AA12 access and return semantics.
- Distinguish attempts, usable outputs and stages. If one committed attempt
  produces more than an output target, retain its actual outputs; describe the
  stopping policy rather than deleting extras or changing RNG to make a tidy bar
  (PFE24). Immediate batches and staged fragile processes can settle differently.
- When a routine changes means or two policies want the same fuel/material,
  revalidate/reserve through real owners. Refueling must not consume wood another
  job has actually reserved; a displayed outline alone creates no reservation
  (PFE22). A later reservation feature needs a real consumer and ownership.
- Preserve lot/copy age, damage history and relevant repair facts through
  transfer. Cosmetic patina can derive from those facts without making a new
  inventory identity on every frame; a real material/process change still follows
  the making law and chosen split/merge behavior (PFE28).
- Compare repair alternatives by actual condition restored, time, material,
  uncertainty and ceiling; service ranks and reference reinforcement percentages
  are examples, not universal caps. Mastery may remove handling with actual means.

The lamp already has manual douse/relight and retained oil. Installed hearth
benefits and selected drying fuel costs do not establish a continuous fireplace
burn. The [granular owner](GRANULAR_SYSTEMS_AND_INTERACTIONS.md#reference-detail-fold-2026-10-20-physical-routines-and-ordinary-life)
holds that proposed behavior and its clock/observation interactions.

**ACT NOW (done):** folded the work, history, service and discovery comparisons
into this owner. **ACCOUNT FOR NOW:** the current craft resolver aggregates input
lots before reactions (IX29); do not promise per-lot consumed-property laws from
the proposed history display alone. Hardness/precision need real readers; no new
scheduler, broad spoilage model or reinforcement mechanism is implied.
**LATER / DELEGATE:** retained PFB1/PFB2 and CRJ1/CRJ2, none dispatched. Sol
low/medium for settlement/custody, Luna low for a settled view; small/medium for
one selected work/producer path. Done: the exact means, real output, costs,
interruption and return agree in a rebuilt desktop journey, with current-state
save/reload/import for changed persistent facts. Human usefulness remains open.


## Recovered Corc round 5, 2026-10-21: stock identity, estimates and commitment

**Proposed additions** to CRL3/CRL4 and the existing native making owners, from [CRL36–CRL38](research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md#round-5-2026-10-21-subtle-interactions-folded-into-the-plans). Applies MR1/MR4/MR5/MR30/MR31, AD6–AD8/AD38 and UR61/UR63. General spoilage remains deferred until a selected process needs it; none is implemented by this fold.

| Reference | Proposed application | Observable check when selected |
| --- | --- | --- |
| CRL36/CRL37 | A displayed stack can contain material histories that matter differently to a chosen process. Default: keep distinctions only when the consumer reads them. Combining old and fresh stock does not by itself establish one average expiry or make the whole stack fresh; use the material mechanism's actual merge/split policy. Approximate quantities and age ranges are public claims, not additional inventory truth. | Split and transfer a real lot, merge it under the selected policy, then process part of it. Conserved quantity/history and output claims agree; no duplication, free rejuvenation or false whole-stack estimate. |
| CRL37 | Ordinary repeat policies select from supported knowledge and the requested stock policy. Sorting by a remembered freshness estimate must not silently switch to hidden true expiry or consume a different reserved/prized variant when the preferred one runs out. A cooking/preservation process can change future deterioration with a reason and cost, without erasing unrelated exposure history. | Unavailable preferred input yields its existing stop/substitution behavior; attempts, successful crafts and actual outputs retain their distinct counters. Safety stops keep their accepted exception. |
| CRL38 | Bind preview, selection and commitment to the same actual recipe/material subject. If stock changes between pointer-down, keyboard selection and commit, revalidate through the native spender. Preserve the player's intended subject and explain a stale/unavailable choice; choose a replacement only under an explicit existing substitution policy. | Change stock or subject while a control is held. The original action either settles on its intended subject or returns an accurate reason, without crafting a newly hovered variant. Save/load follows existing goal lifecycle; `craft_batch_goal.js` currently clears its session display intent on load and is not an automatic reservation. |

`material_choice_view.js` already distinguishes selection/inspection from explicit Craft buttons, and native crafting remains the spender. **ACT NOW (done):** folded these dependencies into this owner. **ACCOUNT FOR NOW:** preserve the existing seams. **LATER / DELEGATE:** extend CRJ8, or test the stale-choice case when the related making route changes; Sol medium for material/history judgment, Luna low for settled UI wiring, small/medium effort. Done means actual transaction/projection and persistence evidence where state changes, not a duplicate preview inventory.


## Recovered Corc round 6, 2026-10-21: materials can suggest a next experiment

**Proposal application of CRL45**, from [the recovered-code round](research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md#round-6-2026-10-21-title-benefits-and-small-opportunities), under MR21–MR23, AD6–AD8/AD38 and UR59/UR63. Recovered quill and ink acquisition handlers each check the complementary item's `have` flag before granting a recipe. The paired handlers support either arrival order at the predicate level; this inspection does not establish the full lifecycle semantics of that flag or load-time discovery.

For a selected OOPS process, encountering compatible materials can suggest “these might work together” through the existing discovery/recipe owner. Keep heard-of, previously handled, currently owned, carried, equipped and consumable quantities distinct where needed. A combination idea need not consume the ingredients or certify success. Learning the recipe can persist after the sample is sold; eligibility to make it still depends on the real stock, tool and method. A meaningful newly understood interaction can receive a small one-time note, while already-known combinations remain quiet.

Use `recipe_connections.js` for known dependencies and the existing recipe/discovery authority for a grant; a read-only search index must not award recipes, roll quality or expose hidden names. The default is a supported observation/hypothesis, with actual experimentation or teaching when the world requires it. A title-granted insight can improve that observation through the same means owner rather than inventing a second recipe catalog.

**ACT NOW (done):** folded the opportunity into this plan. **ACCOUNT FOR NOW:** preserve knowledge versus stock and actual discovery ownership. **LATER / DELEGATE:** extend an existing selected craft/discovery journey with two arrival orders, a missing ingredient, sale/reacquisition and reload. Sol medium to settle the inference/learning rule, Luna low for settled presentation; small/medium. Done: one explained discovery, persistent knowledge where intended, no duplicate grant or free consumption, and known-only producer/use links. No discovery mechanic is implemented here.


### Native material insight delivery, 2026-10-21

Later useful-recovered-26 implementation adds one frontier inference through
existing native acquisition and recipe availability. Knowing Weak healing
powder, meeting the native Healing powder recipe's starting Alchemy familiarity
and encountering both of its herbs lets a relevant acquisition connect the
preparation. Remembered encounters survive selling a sample; learning consumes
no stock and guarantees no craft. Actual craft still reads full stock, native
station, disposition, skill, chance and costs. The native recipe availability is
the learned entitlement, with no second knowledge cache. Final item-recipe IDs
now bind their own native AvailabilityComponents; missing bindings had rejected
the real trade before publication. Repeated component labels across categories
were not given a new global-ID migration.

Both real buy/sell/buy arrival orders, insufficient/full materials, exact
consumption/output, quiet repeats and Save/reload/Export/literal Import were
rebuilt-verified. [Continuation report](gm/dispatch/title-rules-implementation-2026-10-21/CONTINUATION_REPORT.md)
keeps current input identity, fixture/compatibility limits and the broader
perishable/history remainder. This is a reversible native proposal, not a
universal rule that touching ingredients reveals any recipe.

## Round 8 (2026-10-24): potion requirements, brewing versus drinking, and orphaned materials

Weibao asked: "what about potion crafting requirements and more? more to consider?"
This round is a palette of proposals. It builds on PD1–PD14, IX12–IX24, WR1–WR10
and the LOTM gates [LMG1–LMG6](worlds/progression-gates-2026-10-23/LORD_OF_THE_MYSTERIES.md#11-potion-access-formula-ingredients-conservation)
and avoids restating them. Rules applied: MR1–MR36, AR14–AR16, AD38, LC6 scope trap.
Sealed content: none read or shown.

### What the code does today (SHOWN, master `8ac514f01`)

- **No LOTM brewing verb.** Every Tingen dose (Seer, Corpse Collector, Savant, Sailor and their Sequence 8 doses) is issued already prepared from an institution's stores, or bought unmarked through the broker (`book_world_lotm_content.js:25-44`, `book_world_lotm_pathways.js:14`). LMG1 (formula) and LMG2 (ingredients) are designed but have no runtime. *Correction (round 9, same day): only the Seer dose sits in a store (`LOTM_NATIVE_STOCK`). The Corpse Collector, Savant and Sailor doses are created by the accept and assess commands' effects (`book_world_lotm_pathways.js:22,29`), so no stock is drawn down.*
- **Orphaned formula materials.** The broker sells a dried black-spotted frog, a bundle of rare hairs and a jar of grave-dust ink (`book_world_lotm_broker.js:19-22`). Each is labeled "a formula material". Only facts, the save envelope and the held-items line read them (`actions.js:133`, `envelope.js:34`, `ui.js:37`). A player can buy a frog that does nothing.
- **Two potion engines.** The HP Polyjuice slice (`hp_brewing_state.js`, 305 lines) runs its own model with ingredient lots, moon provenance, stewing, loans, theft notice and assay. It does not import `craft_resolver.js` or the product registry, contrary to ER15/ER16. Tingen has no brewing model at all.
- **A typed requirement engine already exists.** `progression_gates.js` defines gate kinds (capacity, knowledge, credential, resource, maturation and others), close rules, overflow policies and a vague hint.

### PZ. Potion requirements and more

| Code | Consideration | Default | Dial and reason | Extends |
|---|---|---|---|---|
| PZ1 | **Brewing and drinking are separate gates.** Brewing reads formula, materials, bench and brewer. Drinking reads the drinker's body, pathway, digestion and order. | A dose you cannot safely drink can still be brewed, held, sold, given or kept for an heir | Per world; LOTM states both sets (LMG1–2 brew, LMG5–7 drink) | LMG1–7, PD1 |
| PZ2 | **Requirements are gate rows.** Formula known is `knowledge`; materials held is `resource`; supervision or licence is `credential`; bench and skill are `capacity`; moon or rest time is `maturation`. | Every brew requirement is a `defineGate` row with a player-facing hint, never a bespoke check | Hint precision per world (vague hint when the formula is unknown) | `progression_gates.js`, WR5–WR7, WR9 |
| PZ3 | **Partial knowledge is a state.** A formula can be known in full, known in part (main known, auxiliaries missing) or claimed by a seller | A partial formula still brews, with a hidden flaw that surfaces as drinking risk, not as a refusal | How much a partial brew is worth per world; reason: LMG1 says formulas are hard to verify | PD9, LMG1, LMG11 |
| PZ4 | **Every requirement needs another way to meet it.** You can buy the formula, earn it by merit, copy it, or commission a brewer. You can buy, borrow, steal or loot materials. | A commission meets the brew requirement with someone else's capacity, at a price and a trust risk | Which routes exist per world; HP's loans and theft already prove the pattern | C10 helper commissions, AD38 |
| PZ5 | **Brewing obeys conservation.** A brew whose main ingredient is a characteristic debits the same ledger the LOTM envelope asserts. An institution's issued doses come from finite stores. | No dose appears from nowhere; an issue draws down a stock record, and the wait list follows from that stock | Stock size per institution; reason LMG3 | LMG3, LMG9 |
| PZ6 | **What can be batched is a world law.** One characteristic makes one dose. HP cauldrons make several doses per batch. | `batchable` is declared per formula family | Per world; HP batches already exist | PD11, IX15, WR8 |
| PZ7 | **A brew in progress is saved state.** Ingredients are committed at the start, and the brew holds its stage, its due time and the brewer. | Save, reload and import keep the exact stage. Brewing is reversible until the end (salvage per WR4); only drinking is irreversible. | Salvage share per world | PD8, MR persistence rules |
| PZ8 | **A requirement checklist on the bench.** Show each requirement as met, unmet, unknown or suspected, read from the gate rows. | One list built from gate quotes, with no separate UI logic | Detail per world; desktop first (AD34) | UV rows, UR rules |
| PZ9 | **Every buyable material has a use.** A sold formula material needs at least one consumer (a brew, a barter, an appraisal), or its text must say plainly that it is a trade good | Lint: every market row's item key appears in some recipe, gate or trade | Applies everywhere; prevents frog-style dead ends | WA lint, IX22 |
| PZ10 | **Cross-world vocabulary lives in WR rows.** HP: moon provenance and stewing (WR9, WR2). Mistglass: paid Cloudseed dose for refinement. LOTM: main ingredient or characteristic plus auxiliaries. | Per-world differences are WR fields, not per-world lists | Pills and furnace grades belong to the active cultivation lane ([CG checkpoint](gm/dispatch/cultivation-absorption-2026-10-24/CHECKPOINT.md), slice 3) | WR1–WR10, XD3 |
| PZ11 | **Debug view of truth versus known.** An inspector shows a dose's true formula, its flaws and its ledger debit next to what the brewer believes | Read-only; changes nothing | Debug-only | PD14, GA9 |
| PZ12 | **Who may brew is a source question.** Whether a non-Beyonder can brew a Beyonder potion, and what the procedure and time are, is not established in the reviewed LOTM notes this round checked | Treat as an open source check, not a fact | Resolve from existing notes before building PZ-L1 | LC3, DWF57 |

### Disposition

**ACT NOW (done here):** findings above; this round saved; cross-link added under LMG1–LMG2.

**ACCOUNT FOR NOW (constraints, no feature work):**
- The next potion domain lands on the shared making envelope and product registry (ER15, ER16). HP converts later, not now.
- Brew requirements use `progression_gates.js` (PZ2).
- Conservation and the save envelope's dose counts include any brewed dose (PZ5).
- Brewing stays reversible until the last step; only the existing ingest is irreversible (PZ7).
- LC6 still holds: one formula, supervised, before any general potion crafting.

**LATER / DELEGATE (not dispatched):**

| Code | Slice | Level, effort | Done check |
|---|---|---|---|
| PZ-L1 | Tingen brew-your-own, first slice: one Corpse Collector formula (bought or earned), the broker frog as a real input, a supervised workroom brew, and a dose that is the same item as the issued one | Sonnet build after an Opus look at the gate and ledger design; one session | On a fresh origin a frog is consumed, a dose is made, the existing ingest accepts it, the stock ledger balances, and save, reload and import keep a brew in progress |
| PZ-L2 | Source check for PZ12 from existing LOTM and COI notes only (no new reading) | Haiku extraction, Sonnet review | Who brews, what steps, how long and what fails, each with a note locator; or a stated "not shown" |
| PZ-L3 | Material-consumer lint (PZ9) over pack and market rows | Sonnet, small | Lint lists frog, hairs and ink until PZ-L1 lands; zero after |
| PZ-L4 | Move HP Polyjuice onto the shared envelope (ER15) | Sonnet with Opus review; medium | Existing HP tests pass unchanged; products use the registry |

## Round 9 (2026-10-24): all pathways, higher Sequences and how to implement

Weibao: "send stuff accordingly, consider higher sequence ones too, consider stuff
for all the pathways, and on how to implement accordingly". Three Sonnet lanes worked
from existing notes and code only ([dispatch record](gm/dispatch/potion-pathways-2026-10-24/CHECKPOINT.md)).
Lane files own the detail; this round keeps the conclusions. All proposals.
MYSTERIES files were not opened.

- [Pathway potion table](gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md): all 22 pathways, Sequences 9 to 0, evidence-tagged, conflicts C1–C12 listed.
- [Brewing and higher Sequences](gm/dispatch/potion-pathways-2026-10-24/BREWING_AND_HIGHER_SEQUENCES.md): PZ12 answered, rung-by-rung requirements, 22 workarounds, gate-kind mapping, conflicts K1–K12.
- [Implementation design](gm/dispatch/potion-pathways-2026-10-24/IMPLEMENTATION_DESIGN.md): data shape, brew verb, ledger, rungs, save compatibility, slices S0–S9.

### What the lanes found (spot-checked against the cited files)

- **PZ12 answered.** In the notes an ordinary person can brew. Audrey mixes her Spectator potion in a home laboratory (R005-C15, checked). At Seq 9 to 7 brewing is ordered measures and stirring, with no ritual or spirituality, and the main ingredients must not be overdosed (Old Neil, `0031`).
- **Requirements climb by rung.** Seq 9–7 are mostly skill and money. Seq 7–6 are mostly price and scarcity. Seq 5 adds an authored ritual. Seq 4 adds mythical form, a neighbour swap, and the church issuing a finished potion plus its ritual rather than a recipe. Seq 3–0 need world-scale acts, and Seq 0 needs the Uniqueness. No ritual appears below Seq 5.
- **Evidence is thin and uneven.** Only 43 of 220 Sequence slots have a known main ingredient, and only 23 have main plus auxiliaries. Eight pathways have no named ingredients. Known ingredients stop at Seq 4 except on the Fool line. The Tingen-native lines, Darkness (Nighthawks) and Paragon (Machinery), are among the thinnest. Sun and Visionary are the best evidenced.
- **Not found in the notes:** a brewing failure on the page, brew duration, Beyonder potion shelf life, Seq 3–1 digestion numbers, and any Moon-line brewing.
- **Code constraints.** Non-Seer doses are minted, not stocked (round 8 correction). `state.lotm` must have exactly its envelope fields (`book_world_lotm_state.js:28`). Saved jobs must equal their command definitions. The body is asserted human. The shared making envelope (L10) has not landed.

### PZ (continued). Higher Sequences and all pathways

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| PZ13 | **Every rung has the same shape.** Each Sequence's potion, formula (main or "or" alternates, auxiliaries), acting principles, digestion and optional ritual live in one row from Seq 9 to Seq 0 | A new pathway or rung is data. A new verb exists only for a genuinely new mechanism. | Rows carry an `offered` flag, so data can exist before play reaches it (LC6) |
| PZ14 | **Missing evidence shows as missing.** Unknown ingredients are labeled authored or generated, never passed off as canon | Gaps are filled by the world's grammar (DG18), labeled, and frozen on reveal (GR3) | How much is authored per pathway; the thin lines need the most |
| PZ15 | **Characteristics are the main ingredient's twin.** A same-Sequence characteristic replaces the main ingredient, but auxiliaries are still needed and by default it does not skip a rung (dial: an in-world skip such as a ritual, a gift or a cheat, with purity or imprint risk as the cost) | A ledger keeps characteristics conserved per pathway and Sequence; deaths, sealing and brewing move units, and nothing is created | Purity and imprint risk per world (LMG3) |
| PZ16 | **Institutions supply differently by rung.** At low and mid rungs the church hands out recipe and materials. At Seq 4 and above it hands out a finished potion plus its ritual. | Supply route is a per-rung field on the holder | Derived stock and wait lists follow from the ledger (PZ5) |
| PZ17 | **Rituals are maturation gates with a staged condition.** A mermaid's song at sea, ice in darkness, a staged play, a 10,000-person gathering | One rite module reads the gate rows; each ritual is data with its place, time and participants | COI's scaled-down shortcuts are a dial with a cost |
| PZ18 | **Waiting and digestion conflict between sources.** Church wait is 3 years. Digestion takes 3 months to 2 years at Seq 8–7 and 3 to 20 years at Seq 5–4. | Use the acting-digestion ranges and keep the conflicts listed | Pace per world and life; the idle clock makes long waits playable |
| PZ19 | **Ways around requirements are mechanisms, not exceptions.** Substitutes, artifacts, borrowed power, boons, transfers and hybrid outcomes (22 listed by L2) | Each carries its stated cost (AD38) | Which ones a given life can reach |
| PZ20 | **Higher rungs change what the body is.** Mythical form at Seq 4 and up needs a form overlay; the human-body assertion must not block it | A form overlay on the existing body owner, not a second body | Visible form rules per world |
| PZ21 | **Seq 3 and above are deferred.** The notes have almost no requirement data there and the scale is world-sized | Catalog rows only (inspectable, not playable) until play reaches Seq 4 | Reopen when a life reaches Seq 4 |
| PZ22 | **Next pathways follow evidence and place.** Visionary second, Sun third by evidence. Tyrant is the Tingen-native option with thin data. | Choose by evidence depth plus a Tingen holder | Weibao's taste outranks the ranking |

### Disposition

**ACT NOW (done):** round 8 correction above; lane files saved; this round saved.

**ACCOUNT FOR NOW:**
- Build the brew leaf against the shared envelope's interface (ER15), so it does not become a third potion engine.
- Brew state uses facts, notes and counters inside the existing `state.lotm` fields, guarded by a golden snapshot of the shipped commands. No new save owner.
- Requirements are `defineGate` rows. L2's mapping needs no new gate kind.
- Every value filled in for a thin pathway is labeled authored.

**LATER / DELEGATE (implementation order from L3, not dispatched):**

| Slice | What you can play | Level, effort | Done check |
|---|---|---|---|
| S0 | Nothing new: adapter for the new row shape, golden snapshot of shipped commands, material-consumer lint (PZ-L3) | Haiku then Sonnet, small | Golden test passes unchanged; lint lists frog, hairs, ink |
| O1 | Design review of D1–D3 (dose identity, flaw carrier, derived stock) | Opus, one pass | Decisions written in the design file |
| S1 | PZ-L1: brew one Corpse Collector Seq 9 dose from a formula plus the broker frog; same item as the issued dose | Sonnet, one session | Fresh origin: frog consumed, dose made, existing ingest accepts it, save/reload/import mid-brew |
| S2 | Partial or forged formula, hidden flaw, appraiser reveal, drinking a flawed dose | Sonnet, one session | Flaw invisible until appraised; drink risk applies |
| S3 | Characteristic ledger and derived institutional stock | Sonnet with Opus review | Envelope asserts conservation; issuing draws stock |
| S4 | Savant and Sailor brew as pure data | Sonnet, small | No new command code; adapter retired |
| S5 | Seq 7 for one pathway | Sonnet, one session | Rung offered from data, played to the next assessment |
| S6 | Remaining pathways at Seq 9–8 as data, batched, after you play S1–S5 | Sonnet, batched | Each pathway enrolls, brews or receives, drinks and digests; authored values labeled |
| S7 | One Seq 5 ritual | Opus design, Sonnet build | The rite gates the drink by place, time and participants |
| S8 | Seq 4: neighbour swap, form overlay, divinity pressure | Opus design, Sonnet build | Swap table read from data; form survives save |
| S9 | Move row data into a `book.lotm` pack | Sonnet | Same journeys before and after |

New modules proposed: `book_world_lotm_brew.js`, `book_world_lotm_ledger.js`, `book_world_lotm_rites.js`; everything else is row data.

## Round 10 (2026-10-24): filling the gaps from the Chinese text and online sources

Weibao: "For F4 F5 F6 can we look online or search for data books? More to consider?"
F4 was thin formula coverage, F5 the thin Tingen lines, F6 missing brewing facts
([round 9](#round-9-2026-10-24-all-pathways-higher-sequences-and-how-to-implement)).
Route, budget and file locations: [dispatch checkpoint, round 10](gm/dispatch/potion-pathways-2026-10-24/CHECKPOINT.md#round-10-gap-fill-from-the-chinese-text-and-online-sources-2026-10-24).
Raw rows stay private and gitignored; this round paraphrases.

### What was found

| Source | What it gives | Weight |
|---|---|---|
| **Official data book** | None found in Chinese or English searches. The print editions are novel volumes only. | n/a |
| **Fan wiki `Module:Sequence/standard`** (revid 127043, 2026-09-12; read through its API in the in-app browser) | One structured table for 219 standard Sequences: main and auxiliary ingredients for **184**, advancement rituals for **131**, acting methods for **59**, plus potion and characteristic appearance and Chinese names. Every pathway has 8 or 9 of its 10 formulas, including 3 or 4 at Seq 4 and above. The 35 gaps are all Seq 1 and Seq 0. Most rows cite the author's WeChat posts that released complete formulas per pathway, plus book chapters. | Author-stated, one step below the novel (the 2026-10-10 crosscheck's rule) |
| **Chinese novel text** (local EPUB, keyword scan plus four Haiku extraction shards, 81 rows) | 41 potions with formula rows, 24 with main plus auxiliaries; 14 rituals; 6 brewing-procedure passages; 4 substitution rules; Seq 4 to 0 formulas and rituals for several lines | Canon text; wins on conflict |
| Game-guide and Minecraft-mod pages | Partial or invented formulas | Not canon; not used |

Spot check: the wiki's Seer and Bard rows match the Chinese text (Seer 10 ml squid blood and 50 g star crystal, `0700`; Bard alternatives and auxiliaries, `0142`). The wiki also lists an 80 ml red wine auxiliary for Bard that this scan did not find in the book; it is cited to the author post.

**F4 is mostly closed** at Seq 9 to Seq 2, through the author's own posts. **F5 is closed:** Darkness (Nighthawks) and Paragon (Machinery) each have 8 formulas in the wiki table. **F6 is partly closed:** the book shows brewing procedure, such as distilled water, a clean black iron pot and auxiliaries in order (`0170`); a strict addition order for one Seq 6 brew (`0461`); and a high-Sequence cauldron method (`1306`). Shelf life and brew duration are still not found anywhere, and a brew failing on the page is still not shown.

### More to consider (PZ, continued)

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| PZ23 | **Source tier on every row.** Novel text, author post, wiki inference and our own authored values carry different weight | Each formula, ritual and price row stores its tier and locator, and the novel wins on conflict | Tier shown in a debug view only; the player sees in-world certainty, not citations |
| PZ24 | **The wiki table becomes the catalog layer.** 184 formulas can exist as inspectable records long before they are playable | Import as catalog rows (S5 three-layer canon); a rung becomes playable only when `offered` | Ring width per life (CX1, LC6) |
| PZ25 | **Quantities are real.** Formulas state millilitres, grams and drops, and the book says under-dosing is safer while over-dosing risks madness or death | Store quantities. Deviation is a tolerance band: below lowers potency or digestion speed, above adds loss-of-control risk | Band width per rung |
| PZ26 | **Procedure is data where the book shows it.** Order of addition, vessel and water preparation appear for a few brews | Shown procedures become step rows; elsewhere a generic ordered-add default, labeled authored | Detail on demand (DP rows) |
| PZ27 | **Ingredient identity needs a crosswalk.** Translations disagree (Lavos squid, Lavar octopus). The wiki gives Chinese names. | Stable ingredient ids keyed on the Chinese name, with English aliases | Applies to every translated world |
| PZ28 | **Each main ingredient implies a creature or a place.** About 180 formulas name a few hundred materials, almost all from monsters, mythical creatures or special sites | Ingredient rows link to a source creature or site (SR rules). Unknown sources are generated, labeled and frozen on reveal. | Encounter density per region |
| PZ29 | **Seq 1 and Seq 0 stay world events.** All 35 wiki gaps are there, and the book's Seq 0 rituals are abstract acts against history or fate | Keep them catalog-only (PZ21) | Reopen only if a life reaches Seq 2 |
| PZ30 | **Licence and privacy.** Wiki text is CC BY-SA and the novel is copyrighted | Raw rows stay in the private gitignored path. Committed docs paraphrase. A shipped pack would need wiki attribution, and stays in the private pack path (AD1). | Per distribution |
| PZ31 | **Pin the snapshot.** Wikis change | Store the module revid and a content hash with the import; a later re-import diffs, not overwrites | Re-pull cadence |

### Disposition

**ACT NOW (done):** online search; wiki structure and coverage measured; Chinese text scanned and extracted to `book_rows.jsonl` (private); spot check; this round saved.

**ACCOUNT FOR NOW:** source tier field (PZ23) and ingredient ids keyed on Chinese names (PZ27) belong in L3's row shape before S0 starts.

**LATER / DELEGATE:**

| Code | Slice | Level, effort | Done check |
|---|---|---|---|
| PZ-L5 | Save the wiki module snapshot (about 135 KB parsed JSON) to the private research path. **Needs Weibao's yes: it is a file download.** | Coordinator, minutes | File saved with revid and hash; not committed |
| PZ-L6 | Crosswalk: join wiki rows to book rows on Chinese name; mark agree, book-only, wiki-only and conflict | Sonnet, small script plus review | Every book formula row matched or listed; conflicts named |
| PZ-L7 | Ingredient-to-source table (PZ28) for the pathways chosen for S1 to S5 | Sonnet | Each main ingredient has a creature or site, or a labeled generated one |

## Round 11 (2026-10-25): the Seq 1 and Seq 0 gaps, the whole wiki, symbolism and substitution

Weibao asked where to find what fills the 35 gaps and whether the wiki can be
downloaded. He also asked to consider the MMO, author posts, QQ channels, Reddit,
replacing ingredients with ones of similar traits, and symbolism.
Evidence and files: [dispatch checkpoint](gm/dispatch/potion-pathways-2026-10-24/CHECKPOINT.md);
[crosswalk](gm/dispatch/potion-pathways-2026-10-24/CROSSWALK.md). All proposals.

### What was found

- **Whole wiki saved (private).** Fandom's official S3 dump link returned 403. The wiki API in the in-app browser pulled all 2,021 non-redirect pages in main, Archive and Module namespaces (11.7 M characters, 50 pages per request, one second apart). Saved to the gitignored `docs/research/novels/lord-of-mysteries/wiki-api-2026-10-25/` (sha256 `ae1e9877…`). Category pages were skipped.
- **Author posts are in it.** The Archive namespace holds the author's WeChat posts with formulas for about 21 pathways and complete rituals for some, such as Corpse Collector and Fate.
- **The 35 gaps are rules, not missing lists.** All are Seq 1 and Seq 0. Seq 1 takes a Seq 1 characteristic as its main ingredient (fan compilations of the author posts add nine spirit-world specialties as auxiliaries; not yet checked). Seq 0 takes the pathway's Uniqueness plus the other Seq 1 characteristics (LMG17). The book's Seq 0 rituals are abstract acts, such as deceiving time, history or fate once. Visionary is the stated exception: its Seq 0 can swap two Seq 1 characteristics for imagined ones.
- **Crosswalk (PZ-L6).** 69 book rows against the wiki: 25 agree, 21 book partial, 8 wiki partial, 12 not comparable, 2 conflicts, 1 bad join. Both conflicts were rechecked against the Chinese text, and **the book wins**. Priest of Light rock water is 10 ml, not 7 drops. Unshadowed sun divine bird blood is 60 ml, not 100 ml (`1064`). One Clown row carried a wrong Sequence label from extraction.
- **Substitution is canon.** The wiki's Potion System page says ingredients and rituals can be substituted and alternatives exist. The book gives the mechanism. Main ingredients are the "corresponding part" of a creature, plant or crystal (`0018`). The potion's name is its core symbol, a concrete image, and the key to digestion (`0021`); names drifted through translation but only had to keep representing that symbol (`0006`). A scan of the text found 236 symbolism or correspondence passages that also mention potions, materials or rituals.
- **MMO.** A licensed LOTM MMORPG by Spark Nexa (China; beta dates conflict between reports) uses pathways, potions, sanity-gated advancement that can fail, and acting measured on three meters. It is a licensed adaptation, not canon. Its data would need the game client.
- **Blocked or login-only.** Reddit is blocked by safety policy in both the in-app browser and Chrome, and was not worked around. QQ channels, WeChat originals and Qidian chapter comments need Weibao's signed-in accounts. Zhihu, Baidu Baike and Bilibili compilations are reachable but are fan work.

### Source ladder for filling gaps (PZ38)

Novel text, then author posts (wiki Archive), then author Q&A on login-only channels, then wiki inference, then licensed adaptations (MMO, animation), then fan compilations, then our own authored values. Each row keeps its tier (PZ23). The book overrides the wiki on conflict (X1, X2).

### PZ (continued). Symbolism and substitution

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| PZ32 | **Seq 1 and Seq 0 are rule formulas.** | Seq 1 needs a same-name Seq 1 characteristic plus auxiliaries; Seq 0 needs the Uniqueness plus the remaining Seq 1 characteristics; the ritual is an abstract world act | Visionary's imagined-characteristic exception is data. These stay catalog-only (PZ29). |
| PZ33 | **Ingredients carry symbol tags.** Each ingredient gets tags for its symbols (sun, song, fire, night, death, secrets) and its "corresponding part" class (organ, blood, crystal, plant liquid) | Tags come from the creature, the pathway and the potion's core symbol. Agents draft them; the source tier is kept. | The same tag model as IX tag rules and WR3 substitution policy |
| PZ34 | **Substitution by symbol match.** An auxiliary can be replaced by an item sharing its symbols and class. A main can be replaced only by a same-Sequence characteristic, a listed "or" alternative, or a strong symbol match. | Closer match means full potency. A partial match lowers potency or slows digestion. A mismatch adds hidden residue and loss-of-control risk, shown only by appraisal or by drinking (PZ3). | Tolerance per rung, tighter higher up; the book's wrong-pathway rule is the extreme case |
| PZ35 | **One symbol vocabulary for everything mystical.** Potions, ritual magic (candles, oils, herbs matching an aspect), acting (the name as key), rituals and divination read the same tags | Symbol tags live on items, places, acts and times; checks compare tag sets | This is AD38 in LOTM form: a method works if its symbols fit, whatever its label |
| PZ36 | **Rituals as symbol thresholds.** A Seq 5 ritual is a set of required symbols (sea, song, a mythical creature), not one fixed script; COI's scaled-down rituals show the threshold can be met more cheaply at a cost | The canon ritual is the reference solution. A player's own staging passes if it meets the threshold. | Threshold strictness per rung |
| PZ37 | **Acting checks read symbols too.** An act digests when it fits the potion's core symbol. The MMO's three meters are a design reference only. | Acting rows list the core symbol and example acts; free acts are scored by tag fit | How generous the fit is per life |
| PZ39 | **Book override layer.** Importing the wiki table needs a layer where book-verified values replace wiki values | Catalog import applies overrides first and logs every one | Grows as more rows are checked |

### Disposition

**ACT NOW (done):** whole wiki saved privately; crosswalk folded; X1 and X2 resolved toward the book; symbolism scan saved privately; this round saved.

**ACCOUNT FOR NOW:** symbol tags (PZ33) and the override layer (PZ39) join source tier and Chinese-keyed ingredient ids in L3's row shape before S0.

**LATER / DELEGATE:**

| Code | Slice | Level, effort | Done check |
|---|---|---|---|
| PZ-L8 | Symbol vocabulary: tags from the 236 book passages plus wiki ingredient lists, for the S1 to S5 pathways first | Haiku extraction, Sonnet merge | Every S1 to S5 ingredient tagged with tier and locator |
| PZ-L9 | Catalog import script: wiki rows plus book overrides into catalog JSON (private) | Sonnet, small | 219 rows, overrides logged, PZ-L3 lint passes |
| PZ-L10 | MMO data: only with the game client Weibao owns or installs (installing needs his yes) | Later | Mechanics notes labeled licensed adaptation |
| PZ-L11 | Login-only channels (QQ, WeChat originals, Qidian comments) and Reddit: Weibao's own signed-in route, or an export he provides | Weibao | Any new author statement added at its tier |

## Round 12 (2026-10-25): swapping ingredients by trait, across every world

Weibao: "for 'swapping ingredients' I meant in implementation, especially with the
procedural materials and more for other world stuff ... materials will have traits
assigned to them and stuff, and could be interchangeable if other stuff can be obtained
... maybe 7 drops is 10ml ... Download symbol vocab and pictures and everything".
This round is about the engine, not LOTM alone. Proposals.

### 7 drops versus 10 ml (X1)

They are different ingredients, not one amount in two units. The Seq 5 formula in the
book lists fingered citron juice 7 drops **and** rock water 10 ml (`0706p71`). The wiki
repeated "7 drops" on the rock water line. A drop is about 0.05 ml, so 7 drops is
roughly 0.35 ml. The book wins. The question still points at a real need: TSW9 below.

### What the engine already does (SHOWN)

- **Traits exist.** A catalogue material has tags (with parent hierarchy through `TagRegistry.expand`) and numeric property axes: fractions that must sum with an inert matrix (conservation) plus bounded scalars (`craft_materials.js:53-130`). Families generate coherent seeded materials (`generateMaterial`, `:164`).
- **Slots already accept substitutes.** A recipe slot selects by exact material, by tag query (`all`/`any`/`not`) or by property threshold (`craft_recipes.js:2-3, 23-27, 66`). `materialPool` and `pickMaterial` find every material matching a query (`:199-223`).
- **Provenance exists for native items.** `material_lineage.js` keeps facts per processed cohort: born, origin world, quality, completeness, evidence, treatment.
- **Not yet joined.** Native game items (rat pelts, logs, herbs), the HP Polyjuice slice and LOTM doses are not catalogue materials, so none of them can be swapped by trait today.
- **LOTM source data now on disk (private).** The wiki's `Module:Ingredient/data` holds 291 ingredient entries with descriptions, 12 with storage or decay facts (for example, light-sensitive blood kept in opaque containers). Pages `Symbolism` and `Laws of Mysticism` record the author's statement that the system rests on the Law of Similarity and the Law of Contagion.

### TSW. Trait-based substitution for all worlds

| Code | Consideration | Default | Dial and reason |
|---|---|---|---|
| TSW1 | **Every ingredient is a trait bundle.** Physical axes (fractions, scalars) plus tags in three layers: physical (organ, blood, resin, metal), functional (binder, solvent, catalyst, preservative) and symbolic (sun, night, song, death) | A material may carry any layer; a world declares which layers its laws read | Mundane worlds read physical and functional only; mystical worlds add symbolic |
| TSW2 | **A formula names roles, not items.** Each slot states the traits it needs (a tag query or property threshold) and names one canonical item as the reference answer | Canon formulas keep their named item as the reference; any material that satisfies the slot's query fits | Slot strictness per world and per rung (exact, profile, or none: WR3) |
| TSW3 | **Similarity scores the swap.** Fit is how much of the slot's required traits the substitute shares, weighted by layer | Full fit gives the reference result. Partial fit changes potency, quality, time or risk, through the outcome the world's law reads. Below a floor, the slot rejects the item with a reason. | Weights per world; LOTM weights symbolic heavily, Village tonics weight functional |
| TSW4 | **Contagion is provenance.** Where an item has been, what touched it, and whose it was can matter: a characteristic carries its former owner's imprint; a relic carries its saint | Lineage facts (`material_lineage.js`) and a contact list feed the same fit check | Read only where a world's law says contact matters |
| TSW5 | **Cross-world swaps follow a directional law.** A material brought from another world keeps its traits but is read by the host world's law | WR10: inert, weakened, unstable or native, set per world pair, never silently native | A swap can work across worlds, and its cost is the host law's reading |
| TSW6 | **Knowing a swap works is knowledge.** A player learns that two items share a role by test, teacher, text or appraisal | Learned relations widen what the bench offers; unknown swaps can still be tried, with an uncertain preview | IX22 learn-rules-not-pairs; mastery widens the set |
| TSW7 | **Generated materials join the same pool.** Procedural materials from families carry the same three layers | A generated herb with the right traits fits a canon slot, labeled generated and frozen on reveal (GR3) | Generator budget per world (GR11) |
| TSW8 | **Scarcity drives swapping.** The interesting case is when the canonical item can't be obtained | The bench shows the reference item, owned substitutes ranked by fit, and what each costs in outcome | No auto-substitution: the player chooses |
| TSW9 | **Units are part of the trait.** Drops, millilitres, grams and pieces are kept as stated; conversions exist only where the world defines them | Quantity slots compare in the stated unit; a swap in another unit converts through a declared density or count | Prevents the "7 drops is 10 ml" class of error in data and in play |
| TSW10 | **Storage and decay are traits too.** Light sensitivity, freshness and rot appear in source data | A decay trait reads the clock and the container (PD5, PD6) | Only where the world states it |
| TSW11 | **One importer per world.** A world's ingredient source (wiki table, book rows, our own palette) becomes catalogue materials through one script with tier, locator and overrides | LOTM first: 291 wiki ingredients plus book overrides; HP next from its census | AR11: the second world must need less new code than the first |

### Disposition

**ACT NOW (done):** X1 rechecked; whole wiki, category pages, ingredient data and symbolism pages saved privately; images downloading (see checkpoint); this round saved.

**ACCOUNT FOR NOW:**
- The LOTM brew leaf (S1) should read slots as role plus trait query, with the frog as the reference item, so substitution needs no rewrite later.
- Native items need a bridge to catalogue materials before any cross-world swap. That bridge is a mapping table (item id to material), not a rewrite of the inventory.

**LATER / DELEGATE:**

| Code | Slice | Level, effort | Done check |
|---|---|---|---|
| TSW-L1 | Native-item bridge: map 20 to 40 existing items (pelts, logs, herbs, oils) to catalogue materials with three trait layers | Sonnet, one session | Existing recipes unchanged; a trait query finds native items |
| TSW-L2 | LOTM ingredient importer (TSW11) with symbol tags drafted from descriptions (PZ-L8) | Haiku drafts tags, Sonnet merges | 291 materials, tiers and overrides logged, lint passes |
| TSW-L3 | First trait swap in play: one slot (a binder or a Seq 9 auxiliary) accepts a substitute with a fit preview | Sonnet, one session, after S1 | Fresh origin: reference and substitute both work, with different outcomes, through save, reload and import |
| TSW-L4 | Cross-world swap: one item from another world in a host-world recipe under the WR10 law | Opus design, Sonnet build | The host law's reading shows in the outcome and in the log |

## Round 13 (2026-10-25): fitting native material contribution

Weibao selected fitting missing mechanics across all saved references and clarified the source set as “everything”. [Scope and evidence](gm/dispatch/reference-mechanics-2026-10-25/CHECKPOINT.md) own implementation status; broader source coverage is still in progress.

| Code | Implemented mechanism | Boundary |
|---|---|---|
| TSW12 | A native material may meet a process's physical/functional query while contributing less of its relevant property. `craft_material_fit.js` grades weighted authored targets without a draw; unknown relevant axes return uncertainty. | Tags constrain this particular process; this adds no universal permission list or symbolic law. |
| TSW13 | The known Animal fat method offers deliberate known meat-source recipes. Existing Boar meat remains three units; proposed native oil contributions produce four Goat meat or ten Crab/Frog meat per attempt. Whole units round upward; excess contribution leaves with discarded cooking remains. | Native cooking owns success, actual stock, XP, transactions and output. No automatic fallback to another source. Values are original game proposals, not biological measurements. |
| TSW14 | New source choices share the actual learned method and require encountered source knowledge. Their ordinary Animal fat output feeds existing recipes. | No extra learning engine, stock cache or new item/save schema. Whole-formula matching, symbolic substitutions, separate potency/risk grades, foreign-world laws and arbitrary supplied catalogue materials remain distinct work. |

## Round 14 (2026-10-26): current inventory, mechanism depth and connected making

Weibao requested “inventory our procedural crafting and brewing and more, and audit?”
with sharpen and more-to-consider. The [inventory and audit](audits/PROCEDURAL_MAKING_AUDIT_2026-10-26.md)
owns I1–I14, findings F1–F7, considerations PC1–PC6 and ranked proposals A1–A4.
It checks the current source rather than promoting earlier palette rows to implementation.
MR1–MR36, GR1–GR17, AD32/33/36/38/42/43 and WPR19/21–25/27 apply.

**ACT NOW (done):** reconciled the systems map and register's stale missing-reference,
matcher and LOTM brew claims; saved a frozen input identity, focused test evidence
and minimal reproductions. F1/F2 are runtime defects recorded for repair, not repaired
by this inventory/audit request.

**ACCOUNT FOR NOW:** PC1 tracks each product transition and reader; PC2 records
reproducible method conditions; PC3 preserves cohort/container distinctions; PC4
separates useful invention from an “original” grade; PC5 makes controlled comparisons
legible; PC6 retains committed stage facts and revisions. The report keeps existing
world priorities, per-world mechanisms and historical compatibility overrides.

**LATER / DELEGATE (not dispatched):** A1 quote parity repair (Sol, small), A2 one
connected book-world making/use/persistence route (Sol, medium), A3 a material-to-use
loop over existing consumers (Sol, medium), A4 bounded cohort/container probes
(Luna inspection, Sol for selected implementation). Done checks are in the report.
No new gameplay, architecture mandate, commit, push or app adoption is claimed.

## Round 15 (2026-10-26): interchangeable ingredients, causal process and world differences

Weibao: “Also expansions, world specific differences and more? Interchangable
ingredients, also other stuff like stirring and more?” More-to-consider extension
of round 14, not a new implementation dispatch. MR1–MR36, especially MR6–8,
MR11–21 and MR29–32; AD5/6–8/32/33/36/38; WPR21–25/27 apply. Earlier ST/PR/DP,
PD/XD and TSW rows remain the foundation. PC numbering continues rather than
restarting. New mechanics below are **PROPOSED**, not accepted or implemented.

### Source boundaries that change the expansion

Checked current source on 2026-10-26, without running another runtime suite:

- `craft_recipes.js/selectorMatches` supports identity, tags, numeric bounds and
  compound queries. `matchRecipe` assigns one input lot to each slot and prevents
  reusing a lot. A combined contribution from two different ingredients to one
  role is not established by that matcher.
- `craft_material_fit.js/gradeMaterialFit` computes a weighted average of capped
  contribution ratios. It is useful for the existing single-axis oil-rendering
  pilot, but a higher average does not prove every essential requirement is met.
- `craft_resolver.js/resolveBatch` pools the consumed inputs before its operations;
  the layered law applies adjacent ingredient-order conversions, then operations.
  Steps contain `op` and `level`. There is no general staged-addition timeline,
  stirring speed/direction/duration state, or vessel-fluid model in that schema.
- `craft_content_frontier.js` defines steep/boil/grind and layered heat laws.
  `hp_brewing_panel.js` selects prepared lots and starts a timed simmer. These are
  meaningful existing mechanisms, not proof of interactive stirring. HP and LOTM
  process descriptors retain the separate product logic described in round 14.

### ACCOUNT FOR NOW: substitutions are equivalence for a purpose

| Code | Expansion | Default, dial and reason |
|---|---|---|
| PC7 | **Keep identity, function and result equivalence separate.** | A substitute can perform a solvent role without making the exact named product. A world may recognize the alternative as the same formula, a local variant or a different original, according to its actual law. Formula recognition follows resolved requirements, not the selected button. |
| PC8 | **Roles need essential conditions before contribution scores.** | Check necessary physical conditions, supported identity/provenance and incompatibilities separately; grade potency, stability, yield and handling afterward. A high oil contribution does not compensate for an absent required catalyst. A catalyst alternative can work by another supported mechanism, with its own process and cost. |
| PC9 | **Quantity compensates for contribution where the mechanism permits it.** | Fictional example: four units at 60% extractable active contribution equal six at 40%, before process losses. More input also brings more bulk and side constituents. The solvent, vessel capacity, waste and usable dose may change. Symbolic identity, unique provenance and structural geometry need their own equivalence mechanisms rather than this arithmetic. |
| PC10 | **Several ingredients may jointly fill a role; one may fill several.** | A blended solvent or two complementary reagents can supply one function. An oily herb might supply both active material and carrier. Allocate physical amounts and account for shared functions explicitly so a slot solver does not duplicate consumed matter. The present one-lot-per-slot matcher is a limited shortcut, not a world prohibition. |
| PC11 | **Preparation can make an unsuitable input useful.** | Drying, crushing, washing, fermentation, distillation, purification or attunement changes the properties available to this process. Include labor, fuel, losses, contamination and intermediates. A fresh herb, its extract and its ash are related inputs with different behavior. |
| PC12 | **Substitution changes the procedure as well as the shopping list.** | A tougher plant may need longer extraction; a more volatile solvent may need lower heat or a sealed apparatus. A replacement can be workable with a revised method even when it fails the old method's conditions. Preserve the demonstrated revision rather than silently editing a learned recipe. |
| PC13 | **Physical interchangeability, recommendation and procurement are separate.** | The world resolves true properties. The maker recommends known fits, marks uncertain trials and obtains actual accessible stock. Do not auto-consume a valuable specimen as a substitute. An unknown fit is uncertainty, not proof of physical impossibility. |
| PC14 | **Provenance and foreign-world fit are contextual.** | Read origin, contact, consecration, prior owner or local power compatibility when relevant to the mechanism. Being foreign does not itself prove success or failure. Directional world laws and actual activation/conversion conditions decide; familiarity changes knowledge, not truth. |

### ACCOUNT FOR NOW: stirring and the rest of the process must change something

The following are fictional game mechanisms to choose per activity. They are not
new factual claims about a franchise or instructions for real chemistry.

| Code | Action or process question | State read/written and meaningful choice |
|---|---|---|
| PC15 | **Stir, whisk, knead, circulate or agitate** | A simple model can read viscosity, vessel geometry, settled material and an agitation budget, then change homogeneity, suspension or interface contact. Gentle stirring may preserve fragile constituents; vigorous work may disperse them faster but introduce air, foam, heat or damage where the law models those effects. Time, tool wear, stamina or power pays for the work. |
| PC16 | **Direction, count and rhythm** | Clockwise/counterclockwise or an exact rhythm matters for a source-qualified rite, oriented flow or another declared directional mechanism. In an ordinary symmetric vessel it can be equivalent. Represent a pattern or accumulated work by default; individual clicks add depth when intermediate decisions matter. More stirring can plateau or become harmful, rather than grant a repeated free multiplier. |
| PC17 | **Temperature is a trajectory, not just a heat total** | Compare a gentle hold with a short hot pulse; vessel inertia, time above a threshold and cooling can produce different extraction or degradation. Start with the few states a selected reaction reads. The existing summed heat/control law remains a bounded model, not a full temperature simulation. |
| PC18 | **When and where an ingredient enters** | Stage additions into the current batch, or prepare separately before combining. Resting between additions can allow binding, extraction or sedimentation first. A later ingredient cannot retroactively change a completed stage. Record spent inputs and recoverable intermediate stock at interruption boundaries. |
| PC19 | **Strain, decant, skim, distill and divide** | Split conserved constituents into product, residue, vapor/capture or waste. Filtering particles need not remove dissolved poison. Doses drawn from an uneven vessel can differ; mixing or controlled decanting makes that a decision rather than an arbitrary reroll. |
| PC20 | **Vessel, closure, cleanliness and shared equipment** | Material compatibility, retained residue, evaporation, condensation, air contact, headspace and cleaning can matter where read by a reaction. Carryover can seed fermentation, spoil a brew or supply a trace reagent. Apparatus upgrades improve an actual capability rather than universally increasing potion strength. |
| PC21 | **Read cues and rescue a drifting batch** | Smell, color, bubbling, texture, pressure or power-flow readings reveal supported observations. A cue may have several causes. Cooling, dilution, settling, neutralizing or splitting can salvage a batch into a different useful product, with accounted losses and incomplete certainty. The maker's diagnosis and the actual intervention remain distinct. |
| PC22 | **Scale changes control** | A tenfold batch does not automatically use the same vessel, heating time or agitation. Model the limiting geometry, heat transfer, workload or magical containment only to the degree it affects the selected process. Quick/guided/deep and helpers execute the same stage rules using their actual tools, competence and stock. |

Illustrative contrast: two makers use the same fictional ingredients. One heats
everything together, then stirs. The other extracts the tough ingredient first,
cools it, adds the volatile fraction and mixes gently. Distinct outcomes follow
from the declared stage mechanisms. If no rule reads that difference, the outcomes
should be equivalent; extra controls should not pretend otherwise.

### World differences: select mechanisms, not themed copies

This table proposes emphases, not universal laws or fresh canon findings. Local
source-qualified rules win over genre associations. The [maker-arts world map](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md)
retains source/era/entrant limits; world packs and their briefs own exact behavior.

| World or activity | Useful distinct process emphasis | Ingredient freedom and exception mechanism | Runtime boundary |
|---|---|---|---|
| Mundane Village, kitchen and field medicine | Extraction, concentration, texture, preservation, handling and actual body response | Functional substitutes and adjusted quantities/preparation; traditional dishes or trusted medicines are learned targets, not a ban on trials | Composition, cooking and rendering pilots exist; general multi-stage food/medicine chemistry does not follow from those pilots |
| Harry Potter brewing | Prepared state, addition sequence, apparatus, timed work and source-qualified motions; teaching and annotated methods can offer different successful procedures | Exact formula requirements recognize the named potion; supported alternatives may produce variants or useful originals. New stirring mechanics need a source locator or an ORIGINAL label | Current HP slice grades prepared lots and simmers; the ORIGINAL abrasive-suspension law now has paid preparation, retained settling, observed comparison and actual cauldron/potion readers. [Verified connected scope and remaining G1 joins](gm/dispatch/pc-groups-2026-10-26/connected-making/implementation/COVERAGE.md); general stirring/novel-effect grammar remains proposed |
| LOTM potion, ritual and item making | Keep brewing a dose, ingesting it, acting/digestion, making a charm and containing a characteristic as distinct processes with their own readers | Symbolic resemblance or contact can matter where sourced, but does not establish that a symbolic substitute replaces a main ingredient or characteristic. Separate physical carrier, spiritual function and identity-bearing input | Narrow exact-input brew exists; general symbolic substitution and all-pathway manufacturing are unproven |
| Cultivation pill/furnace activities | Extraction order, fire control, condensation, retained medicinal residue and bodily compatibility; energy is a paid input | A replacement herb can contribute a needed function while changing impurity, potency or required refinement. Attainment or a distinct faculty can enable exceptions with its actual source and cost | Frontier layered/tablet/body pilots exist; they are original examples, not proof of every novel's furnace law |
| Rune, talisman, ward and formation activities | Stroke/connection order, medium, anchors, geometry, power supply and activation | Conductive ink may be replaceable by function; a symbol or identity-bearing component needs semantic equivalence under that world's law. Spatial layout is not a weighted potion mixture | Ordered rune pairs and talisman readers exist; general spatial formations remain proposed |
| Smithing, tailoring, devices and constructs | Interfaces, tolerances, treatment history, fit, heat cycles, maintenance and power/control | Substitution preserves the required mechanical/electrical/magical function, possibly after redesign. A different alloy or fiber can fit the joint yet change weight, flexibility or durability | Gear, authored assembly, paid jobs and temporary construct infrastructure exist; arbitrary engineering synthesis is not established |
| Living cultivation, fermentation and biological making | A living producer's growth, feed, environment, lineage and care, with outputs over time | A living replacement has its own metabolism and traits. A new strain may serve a role, but recipe knowledge alone does not create the organism or its source faculty | Reuse actual living-stock/body/genetics owners; this row is a proposed making connection, not a claim of a general bioprocess engine |

### Adjacent opportunities that change the loop

| Code | Expansion | Observable use and boundary |
|---|---|---|
| PC23 | **Process outputs feed other crafts.** | Herbal extract becomes a topical preparation, coating or ink when its retained properties support that route; fiber residue becomes packing; separated oil feeds a quench. Each needs its own consumer and dose/charge/quantity semantics. A potion's oral effect is not copied automatically onto a blade. |
| PC24 | **Methods travel as teachable, fallible knowledge.** | Books, apprentice demonstrations, copied annotations and ingredient aliases can preserve alternatives, conditions and confidence. A taught method remains useful without the teacher; a borrowed apparatus/power does not become permanent competence. Compare methods by demonstrated results, not recipe rarity alone. |
| PC25 | **Demand is for function and delivery condition.** | A commission can request a stable warming preparation, a flexible joint or a quiet ward rather than one exact catalog ID. Quote known evidence, custody, expiry and verification cost. Certification and price express someone's knowledge; they do not alter the product's hidden truth. |
| PC26 | **Failure creates a branch when the mechanism supports it.** | Over-extracted dye, weak tonic, cracked carrier or off-spec alloy can have a cheaper use, repair path or salvage value. Hazard containment, cleanup and recovery consume real means. Avoid making every failed batch equally recoverable or adding a universal punishment table. |

### Disposition and possible bounded follow-ups

**ACT NOW (done):** saved the expansion and clarified current matcher/process
boundaries. Correct the overly broad reading of TSW2/TSW3: functional-role proposals
do not erase exact identity rules, and a failed formula fit does not prohibit free
experimentation. No historical rule was silently promoted or rewritten.

**ACCOUNT FOR NOW:** PC7–PC26 above, when the selected world/activity needs them.
These are design options under standing making rules, not a checklist every world
must implement. Quick repeats a demonstrated stage program; guided/deep exposes
its consequential choices. Depth is a comfort choice, without a mode penalty.
Proposed UI proof target is 1920×1080 desktop: known alternatives, a readable
process plan, real costs, uncertain cues and a useful result. Mobile remains deferred.

**LATER / DELEGATE (not dispatched):** follows round 14's A1 correctness repair;
the existing book-world/menu priorities and active lane reservations still govern.

| Code | Small connected expansion | Level / effort | Done check |
|---|---|---|---|
| A5 | One role with a blended substitute and one necessary non-compensable condition | Sol / medium | Reference, alternative and blended inputs conserve amounts; an essential missing condition is not hidden by an average; unknown fits remain trials; actual product feeds a reader |
| A6 | One world-specific process with staged addition and causal stirring | Sol / medium | A controlled comparison changes one stage choice and produces an explained difference; a cosmetic-equivalent motion leaves results equal; preview spends nothing; interruption/reload preserves committed facts |
| A7 | One process output reused across two crafts | Sol / medium | Both consumers read retained properties with appropriate route semantics; separation and partial transfer conserve contents; no oral-effect copying or duplicated stock |
| A8 | A bounded source pass for the selected world's process exceptions | Luna / bounded extraction, Sol for synthesis | Exact edition/chapter/game locators for the few implemented rules; unsupported detail labelled ORIGINAL; world brief records the actual exception, source and cost |

Completion for a selected runtime slice uses AD36/AD43 and relevant MR34–MR36,
not a new universal simulator requirement. This round is documentation-only;
targeted Markdown links and whitespace were checked. Round 14's automated results
remain dated evidence for its frozen inputs, not tests of these new proposals.

## Round 16 (2026-10-26): material foundations, tagging and laws that consume them

Weibao: “what about foundational level stuff like tagging materials and more to
help build those systems? more to consider?” This extends rounds 14–15 beneath
the feature level. MR1–8/11–14/16–17/21/25–34, AR3/7/10–11, GR1–17,
AD5/6–8/32/36/38 and WPR21–25/27 apply. Proposals below do not authorize a
runtime rewrite or a bulk tagging campaign. Reuse `tag_store.js`, material
catalogues, lineage, product registry and the actual inventory owners.

Implementation checkpoint, 2026-10-26: later user selection authorizes the
applicable round-16 details. The [G5 coverage ledger](gm/dispatch/pc-groups-2026-10-26/material-foundations/implementation-2026-10-26/COVERAGE.md)
owns current source and verification dispositions. Native `base.native@2` separates
current char identity from derived-from wood and validates query units/omissions.
Exact native and HP lots retain causal inputs; HP assessment reads observer
projection, and paid preparation feeds brewing, treatment and later potion grade.
The G2 native-Bonemeal-to-HP abrasion reader is a directional ORIGINAL host law;
reverse structural repair remains unsupported and preserves cargo. Shared names
do not confer LOTM characteristic identity or supernatural power. Native rendering
registers a complete 32-fit scan; diagnostic budgets report incomplete coverage.
No additional cache or receipt representation migration is justified by the
measured current consumers. Shared imported-quantity, rollback, downstream potion use and native file-import proof now pass on that same bundle; see the [integration receipt](gm/dispatch/pc-groups-2026-10-26/material-foundations/implementation-2026-10-26/RECEIPT.md).

### What exists, and what that does not establish

Source-inspected on 2026-10-26:

| Foundation | Existing implementation | Boundary |
|---|---|---|
| Tag vocabulary and implication | `tag_store.js/TagRegistry` has IDs, kind, parents, revision, open/hidden visibility; checks duplicate definitions, missing parents and cycles. `expand` includes a tag's ancestors | A parent means implication, not a generic association. `kind` does not itself execute physical, functional or symbolic behavior |
| Truth and queries | `craft_materials.js` validates tags and fraction/scalar axes; selectors support tags and numeric bounds. `TagStore` has observer-aware queries; catalogue `matchesQuery` evaluates a true tag set | Passing a raw truth query is not a player-safe explanation. Numeric and relational semantics need the consumer's law |
| Native mapping | `native_material_catalogue.js` maps native item IDs into physical/functional/symbolic-proposal tags and six authored numeric axes | Coverage is selected, static data; symbolic associations are explicitly proposals. A tag appearing in that table does not prove any world reads it |
| Current lot/history | `material_lineage.js` carries selected born/origin/quality/completeness/evidence/treatment facts; `material_treatment.js` supplies particular transformations | Not a general component/container/contact-history model; inventory stack count remains the quantity authority |
| Normalization | `normalizeMaterial` fills omitted numeric axes with their minimum and derives the remaining matrix | Convenient for complete game profiles, but missing author data is not thereby verified zero. Distinguish that from the character not knowing a value that truth already contains |

**ACT NOW (done): clarify earlier shorthand.** TQ7's “a parent tag makes children
match” describes query matching in reverse: an instance carrying a child also
matches its ancestors; an instance tagged with the parent does not acquire every
child. TQ7's “learner must understand” constrains safe recommendations, not free
trials, under MR1/MR6 and TSW6. TQ10's measured/unmeasured distinction belongs to
knowledge; physical truth may exist before measurement. Neither wording creates
a ban on experiments. Earlier dated palette text remains historical.

### ACCOUNT FOR NOW: keep the kinds of fact distinct

| Code | Foundation | Default, dial and reason |
|---|---|---|
| PC27 | **Identity and classification** | Stable definition ID/revision says which material this is; categorical tags support reusable queries such as plant, metal or fiber. Display names, regional aliases and appearance do not establish identity. Preserve multiple legitimate classifications without inventing a universal rarity/power ladder. |
| PC28 | **Implication versus relationship** | Use tag parents for reliable implications within the vocabulary's scope. `Made from`, `contains`, `grew at`, `owned by`, `touched` and `used in` are typed relationships with their own facts. Charcoal's wood origin can survive without every fresh-wood behavior surviving the transformation. Do not propagate traits through arbitrary relationship chains. |
| PC29 | **Properties need dimensions and combination laws** | Keep quantities, composition fractions, intensive properties and response parameters distinct. Oil fraction, mass, viscosity and a reaction threshold are not interchangeable scores. Declare units/basis, range, resolution and how each relevant property combines. Weighted averaging is a chosen approximation, not a generic answer for hardness, phase transitions or magic. |
| PC30 | **Functional roles are contextual** | A binder, fuel, solvent or conductor label can help find candidates. Actual usefulness depends on substrate, temperature, route, apparatus and local law. A lamp fuel need not be an edible fat, and a conductor for one power source need not conduct another. Read the mechanism behind the tag rather than making the label a universal permission list. |
| PC31 | **World semantics and symbolic meaning** | Reuse shared vocabulary where meanings agree; qualify local meanings and translations where they differ. Symbolic association, actual affinity and active supernatural power are distinct facts. A proposed “deathly” association in the native catalogue does not make a bone a valid LOTM main ingredient or grant an effect. A host law reads preserved traits and relevant origin/contact, with directional compatibility where needed. |
| PC32 | **Definition, lot, instance and container** | Definition holds stable material behavior; a lot holds this cohort's composition, preparation, contamination and age; an instance holds unique object history; a container holds carried contents, capacity, residue and closure. Derive what can be derived. Link existing owners rather than copying inventory counts or adding a second stock store. |
| PC33 | **Prepared form and process state** | Fresh, dried, crushed, dissolved, tempered or attuned describes a state caused by an actual process, not arbitrary extra tags on the unchanged definition. Specify which properties are retained, exposed, converted or lost. Geometry and particle size can matter independently of composition when an operation reads them. |
| PC34 | **Unknown-to-author differs from unknown-to-maker** | Content may be authored, generated/frozen, intentionally unspecified or unsupported by a model. Maker knowledge may separately be observed, inferred, believed or absent. Validate the fields a selected consumer needs; show uncertainty or use an explicit local fallback rather than silently treating unavailable input data as measured absence. No requirement to simulate every unmodeled property. |
| PC35 | **Appearance, observation and belief** | Descriptive cues and claims are evidence with observer, source and time. A red liquid is not automatically restorative. Store observations and what they support, keeping false labels or mistaken identification possible. Names, substitutions, prices, sorting and refusal text use observer projections rather than hidden tags. |
| PC36 | **Amounts and shared-role accounting** | Count/pieces, mass, volume, dose and available charge need explicit conversion where a process compares them. Retain actual inventory count as owner; derive material contribution from the selected lot and declared conversion. Density, droplet size or extract strength can depend on state. Shared/blended role allocation must not spend or produce the same conserved amount twice. |
| PC37 | **Process and apparatus contracts** | An operation declares inputs and relevant state, tool/station capabilities, cost, clock and state changes. “Stir” can consume a mixing-work budget and change homogeneity; it need not introduce a complete fluid simulator. A tag like `hearth` is a discovery cue; actual temperature/control/size capability decides whether the chosen process works. |
| PC38 | **Interactions belong to laws** | Materials supply properties and relevant histories; reaction/process/use laws decide what happens together. Avoid a hand-maintained tag for each possible recipe or a permanent “healing” flag copied into every derivative. Resolve by composition, parts, pattern or conserved identity as appropriate under MR29. Derived capability summaries stay traceable to the law and inputs. |
| PC39 | **Versioned transformations and causal receipts** | Preserve the input references, relevant state, rule revision, committed steps and declared losses needed to reproduce a product. Save enough truth to retain its meaning; derive display summaries. Content changes must have an explicit compatibility disposition, under the current override, rather than quietly changing products by reinterpreting old tags. |
| PC40 | **Tag/axis vocabulary governance** | Give each used term one meaning, scope, owner and reader. Aliases translate source or display language into IDs rather than duplicate synonyms. Review implications and cross-catalogue mappings at their consumers. Deprecated or renamed terms get an explicit disposition when referenced by current content or retained state. Do not tag the entire library in advance of a consumer. |
| PC41 | **Authoring support and evidence** | A material row can carry an authoring-side source status/locator and a list of deliberate unknowns; generated traits name their family/law revision. Provide focused validation for consumed fields, dimensions, conservation, vocabulary references and working examples. Keep bulk reference data separate from player observations and distinguish proposed symbolism from sourced rules. |
| PC42 | **Inspectors explain the whole chain** | A developer view can show direct tags versus inherited tags, raw versus transformed properties, selected lot, failed role conditions, operation trace and actual consumer. Player views expose what that observer can know. Test inspectors with synthetic fixtures; using an inspector does not automatically grant in-game knowledge or alter stock. |
| PC43 | **Bound costs at the actual query** | Index candidates by relevant positive tags/families and evaluate the selected profile rather than every material pair on each tick. Cache derived results by relevant revision/state and invalidate when inputs change. Measure actual catalogue/lot scale before adding caches, and prevent an incomplete bounded search from being reported as physical impossibility. |

### A minimal example through the layers

This is a proposed fictional example, not a new record schema or a claim of
implemented chemistry:

| Layer | Example | What it enables |
|---|---|---|
| Material definition | Reedherb with plant/herb classification and an authored active fraction | Another herb can supply a similar function without being the same species |
| Owned lot | A dried cohort with actual mass, extraction behavior and recorded contamination | The same definition can yield different available contributions after preparation |
| Apparatus/process | A mortar changes particle size; a warm extraction reads that size and time; stirring changes suspension | Each action changes the state a later operation consumes |
| World law | This local tonic reads extractable contribution and irritant residue; a separately sourced ritual may read identity or provenance | Shared material facts support distinct making systems without universal chemistry or magic |
| Product and use | Retained contents plus a preparation revision; oral/body law reads the actual delivered dose | A computed result has an effect, rather than just a generated name or tag list |
| Knowledge | The maker observed improved extraction but has not identified the contaminant | The unknown contaminant still acts; the preview and explanation remain uncertain |

The useful foundation is that connected chain. A large tag list without property
semantics, transformations and a consumer would leave most of the requested
systems unbuilt. Conversely, a world-specific identity-bearing ingredient does
not need its special behavior flattened into generic material fractions.

### LATER / DELEGATE: practical foundation build order, not dispatched

Continue after the existing A1 correctness repair and respect active ownership.
The order is a proposal within current book-world/menu priorities, not a new gate
requiring all foundation work before another selected feature can proceed.

| Code | Bounded step | Level / effort | Done check |
|---|---|---|---|
| A9 | Specify the vocabulary and property semantics for one existing process and its actual alternatives | Sol / small | Each consumed tag/axis has a scope, meaning, reader and example; implication versus relationship and missing-versus-zero are explicit; reuse current catalogue structures where they fit |
| A10 | Join those definitions to real owned lots and one preparation transformation | Sol / medium | Selected inventory keys resolve the correct state without duplicate stock; one changed preparation changes the actual product/use; quantity and waste accounted; relevant save boundaries exercised |
| A11 | Give a second world a deliberately different reading of one shared material concept | Sol / medium | The second consumer needs less new mechanism code, preserves source-qualified identity/symbolic exceptions and demonstrates a real use; shared names do not silently equate unlike meanings |
| A12 | Add a small authoring validator and synthetic material/process inspector around demonstrated needs | Luna / bounded inventory and validation drafting, Sol for runtime/UI judgment | Detect a misspelled tag, bad implication, missing consumed property and invalid unit mapping; show the cause of one successful and one failed process without leaking truth into player projections |

No new gameplay is implemented in this round. Source inspection supports the
current-boundary table; proposed model changes need their own focused regressions
and the existing AD36/AD43 delivery evidence when selected. Documentation links,
round codes and whitespace were checked. Earlier test counts remain tied to their
recorded source snapshot, not this design expansion.

## Round 17 (2026-10-26): weather, environment, lore and where to find ideas

Weibao: “also consider weather and other stuff as well? more lore stuff? where can
we pull more ideas? more to consider?” He also requested another chat for audits
of other systems needing comparable depth. This round owns making/environment
connections and idea-source scouting. MR1–5/11–14/16–17/25–34, SR1/15/19/22,
AD6–8/15–17/32–34/36/38 and WPR19/21–25/27 apply. World/environment and book/menu
priorities remain; generated layouts and broad NPC-heavy work are not new gates.
New mechanics below are **PROPOSED**. No runtime changes or bulk acquisition.

Dated implementation follow-through, 2026-10-26: Weibao later selected applicable PC44–PC53 details. The [combined coverage ledger](gm/dispatch/pc-groups-2026-10-26/weather-environment/implementation/evidence/W6/COMBINED_COVERAGE.md) and [source contract](gm/dispatch/pc-groups-2026-10-26/weather-environment/implementation/evidence/W6/SOURCE_CONTRACT.md) record the bounded implemented/native-proven source→water→drying/ORIGINAL field→grounding→kit/paid-order chain and exact wider gaps. The proposal statement above describes this original audit round; it does not describe the later runtime state or turn the remaining palette into accepted product law.

### Existing foundation, source-inspected 2026-10-26

`weather.js` supplies native deterministic temperature behavior; `weather_calendar.js`
owns the shared native rain cycle and interval-readable calendar helpers.
`world_climate.js` can derive temperature, rain, light and indoor/sealed context from
calendar environments. Its additional profiles and `world_weather_display.js`'s
visitor curves are explicitly proposals/display context, not sourced climates or
proof that every production process consumes them. `absorb_p23/exposure` contains
conditional exposure mechanisms. `feature_expansion_objects.js` has real wet/sound
stave transformations and sheltered/braced/sealed drying jobs; the reward tracker
reads actual completion receipts. `lore_practice_*` contains a bounded witnessed
rain/drain-warning route, and `lore_history_state.js` retains typed outcomes.
These are incumbents to reuse, not evidence of one joined environmental simulator.

### ACCOUNT FOR NOW: environmental foundations and useful consequences

| Code | Expansion | Default, dial and reason |
|---|---|---|
| PC44 | **Separate climate, weather, microclimate and exposure.** | Climate describes distributions; weather is the current local event; a cave, workshop or canopy modifies conditions; the material/body receives exposure through shelter, clothing or container. Rain outdoors need not wet a sealed vial. “Indoors” need not imply dry, ventilated or temperature-controlled. |
| PC45 | **Use the actual exposure history.** | Wetness, drying, weathering, curing, germination and corrosion can depend on duration and thresholds, not just weather when work finishes. A newly moved item retains its prior state. Use meaningful clock boundaries or interval accumulation so one long advance and equivalent short advances agree. |
| PC46 | **Weather changes opportunities as well as costs.** | Rain can supply water, soften a working material or reveal a spring; dry wind can help a supported drying process; fog can conceal travel while obscuring a landmark. Benefits and hazards follow mechanisms, not a universal bad-weather penalty. Which effects exist is a per-world/activity dial. |
| PC47 | **Humidity, airflow, light and pressure have different readers.** | Moisture/airflow can affect drying and exposed surfaces; sunlight can affect growth or a photosensitive input; pressure may matter for a selected high-altitude/closed-vessel process. Model the variables a real consumer needs. A weather word does not substitute for a value, and a detailed atmosphere is not a prerequisite for a sheltered rack. |
| PC48 | **Water and soil are material inputs.** | Fresh/salt water, sediment, mineral content, soil condition and local contamination can affect preparation, crops, dyes or corrosion. Location is a source of those conditions, not a universal quality bonus. Preserve relevant source facts when the lot leaves the place. |
| PC49 | **Ecology connects supply to the calendar.** | Flowering, ripening, molt, migration, regrowth and resource depletion can change what is obtainable and its prepared properties. Seed correlated regional families inside existing places; do not generate canon landmarks or assume every world has Earth seasons. Cultivation, stores and trade offer alternative supply where available. |
| PC50 | **Shelter and apparatus are player interventions.** | A roof, drainage repair, windbreak, cellar, ventilated hood or ward changes a specific path of exposure. Show what it protects and what it does not. Repair, fuel and maintenance give a concrete use to making, homes and local installations. Reuse existing place and custody owners. |
| PC51 | **Forecasts are knowledge, weather is truth.** | Local observation, a skilled forecast, an instrument or a supernatural sense has a horizon and uncertainty. A warning can become stale after a location/window change. Predictions do not set the event, and inspecting them consumes no draw. An unseen future event can already have causal commitments. |
| PC52 | **Absence follows the world's existing clock policy.** | Environmental work advances when its owning world/activity advances; a paused/frozen realm does not age stock merely because wall time passed. Travelling between clocks needs an explicit retained-state and exposure decision. No new offline destruction policy is inferred here. |
| PC53 | **Supernatural environments need mechanisms too.** | A spiritually charged rain, ash storm, lunar alignment, planar tide or anomalous season can carry a material, field, effect or timing condition. State source, scope, means of detection, affected carriers and countermeasures. A realm may have a costly exception without making every rain magical or every moon phase a brew requirement. |

### ACCOUNT FOR NOW: lore that creates play

| Code | Expansion | Concrete consequence |
|---|---|---|
| PC54 | **Local names and conflicting classifications** | A trader's “winter salt” and a school's technical name can refer to the same material; two look-alikes can share a common name. Translation/identification is learned evidence. Shared labels do not prove equivalent truth. |
| PC55 | **Tradition, explanation and effective practice are separate.** | A custom may preserve a useful drying sequence while explaining it through a mistaken story. A ritual can also work through an actual local supernatural law. Tests distinguish supported explanations without automatically treating tradition as either false or physically universal. |
| PC56 | **Regional methods and schools emerge from constraints.** | Local fuel, water, vessels, climate, supply and teaching can produce several effective methods for the same function. A traveling maker adapts preparation rather than merely buying a higher-tier herb. Methods can have recognisable history without granting automatic competence. |
| PC57 | **Lore has provenance, revisions and omissions.** | Annotated books, damaged records, copied diagrams, recipes with lost preparation steps and conflicting witnesses are discoverable knowledge objects. Record who claims what, when and on what evidence. A newer edition may change an interpretation without rewriting already committed world truth. |
| PC58 | **Place history leaves usable traces.** | An abandoned kiln, repaired sluice, mineral deposit, unusual stain or weathered inscription can reveal a method, material source or environmental change. Follow archaeology through acquisition, experiment and actual use; prose alone is not a completed exploration/making loop. |
| PC59 | **Customs and institutions read the same object differently.** | A local taboo, guild certification, festival demand or restricted harvest can change access, trust, prices and legal consequences through actual people/institutions. It does not change chemistry by itself. Add social detail only where it supports the selected loop and respects broader NPC deferrals. |
| PC60 | **Exceptions are specific and discoverable.** | Preserve canon's ordinary case plus source-qualified exceptional means, cost and availability. Separate source fact, local belief and our ORIGINAL fill. Secret-dependent explanations remain sealed outside their discovery route, including audit/source summaries. |

Illustrative ORIGINAL journey: a maker harvests a local fiber before seasonal
rain, learns from an annotated method that damp preparation helps one stage,
then moves it to a ventilated shelter for drying. A failed roof repair changes
actual wetness; a misleading proverb does not. A later traveler can reproduce
the method with another fiber if its properties support it, adjusting for local
conditions. This is a proposed connected loop, not new gameplay or a real recipe.

### Source scout: concrete gaps and places to pull ideas

Bounded web spot-check on 2026-10-26. Existing local research is the incumbent;
source availability is not full reading, gameplay proof or adaptation authority.

| Route / disposition | Where and what was checked | Gap it can answer / cost |
|---|---|---|
| **Reuse first: saved world and game research** | [Maker arts by world](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md), [procedural crafting research](research/procedural-crafting-ui-2026-10-15/REFERENCE_INDEX.md), [harvest/reuse owner](research/SOURCE_HARVEST_2026-10-25.md), existing Minecraft/MF reports | Recover already sourced apparatus, material uses, styles and exceptions before another broad search. Small targeted locator check; historical evidence stays dated |
| **Read selectively: original fiction and official supplements** | Exact editions/chapters and current pack source ledgers, using [existing acquisition routes](research/SOURCE_ACQUISITION_TOOLS.md) when a needed source is missing | Answers what a particular world's stirring, identity, calendar, power and exception actually require. No whole-library read or download selected; wiki comparisons guide locators rather than silently override the source |
| **Adapt candidate: survival/crafting simulation** | [Vintage Story preservation](https://wiki.vintagestory.at/Food_preservation) documents climate/storage/process effects, freshness carried into cooking and a particular stack-aging rule. [CDDA weather interface](https://github.com/CleverRaven/Cataclysm-DDA/blob/master/src/weather.h) exposes local humidity/wind cover, condition sums and interval rain collection | Useful mechanisms for environment → shelter/container → product, and interval semantics. Vintage Story's averaging/sea-level-climate simplifications are choices to compare, not realism or YAIR requirements. CDDA header inspection establishes interfaces, not correctness of their implementations. Medium fit/prototype effort; no dependency or code copying selected |
| **Scout: material culture and historical practice** | [Science History Institute Digital Collections](https://digital.sciencehistory.org/) provides artifacts, letters, rare books and oral histories, with food/color/medicine topics | Candidate sources for apparatus, trade language, notebook conventions, craft teaching and rival explanations. This pass checked the collection entry point, not a manuscript's truth. OPenn's related collection page timed out; switched to the owning institution's accessible route instead of retrying |
| **Scout: ecology and field observation** | [Biodiversity Heritage Library](https://about.biodiversitylibrary.org/) provides biodiversity literature/archives and links field-book projects | Candidate source for habitat, seasonal observation, naming and field-journal detail. Select one relevant taxon/place/text and distinguish historical belief from current evidence. Historical illustrations/text are references, not automatic game biology |

**Proposed extraction unit:** one source locator → actual mechanism and limits →
material/environment/process facts → what a maker can observe → existing engine
seam → one useful result and acceptance check. Include a contradictory example
when the source has one. Keep source-world law separate from inspiration and
original fill; avoid collecting another large ingredient list without readers.

### Disposition and bounded next opportunities

**ACT NOW (done):** saved weather/lore considerations, existing-source boundaries,
scouted source routes and a separate audit-chat dispatch. No new gameplay claim.

**ACCOUNT FOR NOW:** PC44–PC60 for selected consumers, plus the source extraction
unit above. These do not require every world to model all environmental variables.

**LATER / DELEGATE (not dispatched as implementation):**

| Code | Candidate | Level / effort | Done check |
|---|---|---|---|
| A13 | Extend one existing exposed/sheltered material process | Sol / medium | Same inputs under one changed exposure produce a lawful difference; shelter changes the relevant path; long/short clock advances agree; actual product/use and required save/UI proof |
| A14 | One source-qualified regional or world method exception | Luna / bounded source extraction, Sol / synthesis | Exact locator, ordinary method and exception with means/cost; ORIGINAL gaps labelled; proposal linked to its real world owner |
| A15 | One learned forecast/document clue feeding an existing making choice | Sol / medium | Observer-safe evidence, uncertain/stale prediction, real decision and outcome; reading does not change truth or consume stock; scope fits the existing knowledge UI |

### Requested independent chat

Created local project chat `01a17937-1f5a-7e82-bf79-b7e47a1f4ae4` on 2026-10-26
to inventory other systems and deeply audit its three strongest candidates.
It owns `docs/audits/OTHER_SYSTEMS_DEPTH_CORE_AUDIT.md` and its separate evidence
directory, checks prior owners first, and does not edit this crafting palette or
the procedural-making audit. Body/ecology, exploration, abilities/progression,
knowledge, economy/logistics, time and people/institutions are candidates, not
an instruction to rebuild them all. First status check confirmed active work.
No gameplay edits, extra agents, commits or pushes were requested from that chat.

This round is source-inspected/scouted, documentation-only. Local links, codes
and whitespace were checked. Runtime/browser evidence remains with its dated
owner; the other chat's findings are pending its own saved result.

### PC group audit chats requested, 2026-10-26

**Later direction:** Weibao subsequently instructed each group to dispatch
implementation chats for every detail and asked this parent to carry subtle and
necessary considerations into them. [Current direction](USER_VISION.md#pc-implementation-subtlety-follow-through-2026-10-26)
and [shared implementation guidance](gm/dispatch/pc-groups-2026-10-26/IMPLEMENTATION_FOLLOW_THROUGH.md)
supersede the audit-only scope of the original dispatch described below. Group
owners continue their existing implementation children and own their evidence.

Weibao: “Send a chat for Each groups of PCs accordingly”. Seven separate local
project chats were created for PC1–6, PC7–14, PC15–22, PC23–26, PC27–43,
PC44–53 and PC54–60. The [dispatch and ownership](gm/dispatch/pc-groups-2026-10-26/README.md)
links their separate reports; [thread ledger](gm/dispatch/pc-groups-2026-10-26/THREADS.json)
retains IDs and exact prompts. Each continues source-backed audit and expansion
with its own document area. This request authorizes those chats, not the proposed
runtime slices, shared source writes, commits or publication. Initial status
checks are dispatch evidence; each report owns its later findings and checks.


### G2 implementation selection, 2026-10-26

Later user direction selects the applicable PC7–PC14 and G2 audit details for implementation; the earlier audit-only disposition is historical. [Direction](USER_VISION.md#g2-ingredient-substitution-details-selected-for-implementation-2026-10-26), [five-chat dispatch](gm/dispatch/pc-groups-2026-10-26/ingredient-substitution/implementation/README.md), and [integration receipt](gm/dispatch/pc-groups-2026-10-26/ingredient-substitution/implementation/INTEGRATION.md) own current state. G2 owns allocation/fit; G3 process semantics and G5 material/lot facts remain their owners. The [final connected delivery](gm/dispatch/pc-groups-2026-10-26/ingredient-substitution/implementation/INTEGRATION.md#final-connected-delivery-2026-10-26) records ORIGINAL HP reference/alternative/blend treatment, quantity-dependent actual reader, native joint rollback and persistence on bundle `28bbfe910094`. Its world-specific law does not establish arbitrary chemistry or canon formula substitution.


### G7 connected lore implementation evidence, 2026-10-26

Weibao selected PC54–PC60 and their applicable details after the source audit. [Direction](USER_VISION.md#lore-and-idea-source-details-selected-for-implementation-2026-10-26), [shared brief](gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/COMMON.md) and [joined receipt](gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L3/REPORT.md) own that selected implementation and its exact evidence. L1's copied/contradictory accounts feed actual strip trials; L2's ink-and-paper guides feed the existing lamp; L3's historical stop trace and actual repair restore one method, while scoped academy review changes a finite paper allocation without altering the device or granting competence. Historical audit conclusions remain history, not a competing implementation receipt. This bounded ORIGINAL Cyoria branch preserves book/menu priority and does not define a universal certification or preparation rule.

## Round 18 (2026-10-30): craft risk and tiers from the similar-games surveys, proposal only

Source: [similar games beyond protolikes](research/SIMILAR_GAMES_BEYOND_PROTOLIKE_2026-10-30.md) F8, F11, F15;
ranked in the [absorption plan](research/ABSORPTION_PLAN_SIMILAR_GAMES_2026-10-30.md). Proposals (AD32). SWGEmu is
AGPL-3.0: design reading only, no code and no constants copied (its failure formula was read through a summary).
Already covered, not repeated: substitution by property (`src/craft_recipes.js`, TQ7, G2 selection, Round 12 and 15) and
failure that keeps what was learned (domain table "Failure gives", DP4).

ACCOUNT FOR NOW

| Code | Item | Default, dial and reason |
|---|---|---|
| PC61 | **Correction: ingredient quality already lives in the tag and axis system; this is a connection, not a new stat.** Harvest quality (0-100) rides on graded stacks (CE4, SC11, NX12; `src/harvest.js`, `consumedHarvestQuality`) and reaches butchering/craft output quality (`treatedRecipeQuality` in `src/main.js`). Freshness is PD5 and TQ3 (condition derived from age and clock), look-alike appearance is TQ12, residue is TQ11, hazards are PD7. What is missing is the reader: CE4 says quality "does not change material truth or batch chemistry yet". SWGEmu's lesson is only that the same axis can also set baseline risk and tool tier. | Default: declare risk as a TQ1 derived tag ("unstable" fires when quality or freshness crosses a threshold) read by PD7 hazards, with tool quality (TQ9 capability) shifting the tier. Dial: threshold and weight per world; the receipt names which threshold fired. Reason: CX2 says connect before adding; no new axis, tag kind or ledger. |
| PC62 | **Reaction rows with a thermal gate and energy cost** (Space Station 14). | Fits the GEAR_DEPTH chemistry round. Default: rows over existing heat sources; no new simulation. Needs a named heat source and a consumer. |

LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| PC63 | Playable slice "ingredient quality has a consequence": wire one existing graded input (CE4 quality, or PD5 freshness) into one existing hazard (PD7 or TQ11 residue) in HP brewing, shown in the brew preview. Reuse the graded stack and derived-tag path; add no field. | Sonnet, medium | FLR1-FLR6: the preview names the risk source and the threshold; the tier or hazard has an existing consumer; save/reload/export/import. First read `src/hp_brewing_domain.js` and `src/harvest.js` to confirm what reaches the brew (the quality search of the brew file returned nothing, so the wire may be the whole slice). Reopen when Weibao selects it. |
