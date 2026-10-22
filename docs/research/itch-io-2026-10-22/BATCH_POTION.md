# Batch: potion, alchemy and brewing games (itch.io decode wave, 2026-10-22)

Brief: [DECODE_BRIEF](DECODE_BRIEF.md). Topic: games YAIR could draw on for
ingredient rules, discovery, failure, notation and selling. Everything below is
a proposal (AD32), not an accepted decision. Private notes with URLs, sizes,
hashes and locators: `private/<slug>/NOTES.md`.

**Dedupe.** Skipped, because YAIR already holds deep research: Potionomics,
Potion Craft, Atelier, Little Alchemy, Noita, Qud and CDDA, Skyrim-style
learn-by-tasting (FE3), the exposure ledger (CO4, AB2) and the composition
contract P1-P15 in the
[procedural materials audit](../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md).
Alchemy Sovereign belongs to another batch. YAIR `src` has no toxicity or
tolerance code (grep found none) and no failure-residue or tried-pair memory
for crafting, but the audit already proposes both in prose (P8, CO4), so most
findings below are *UI and loop shapes* for rules YAIR has designed, not new
rule ideas.

## Screened (about 40 titles; tag pages alchemy and potion, plus search hits)

Decoded games are marked **D**. HTML5 unless noted.

- **D** Hidden Grimoire: Idle Alchemy (claucas): deep idle alchemy, pair recipes, residue, reincarnation.
- **D** CHROMA: The Apprentice's Workshop (seshu): color-mixing potions, written orders, field journal.
- **D** Potion Brew Shop (sebadorn, js13k 2025, MIT): four-ingredient order puzzle.
- **D** Alchemica (onlyjxv): AI-written idle game, potions as buffs and quest gear.
- **D** Corpus et Spiritus (arpentor): alchemy deckbuilder; metals transmuted into attributes.
- **D** Alchemyst Apprentice (mgaudi): unknown ingredients tested on customers (Godot build read: data tables and strings).
- **D** Potion Seller (noteworthy, GMTK 2021): effects cancel in a cauldron, combine in a mortar (Unity build unpacked, type and enum level).
- **D** Herbarium (yanko, PROCJAM 2017): procedural flowers, rat experiments, deduction panel (Unity build unpacked: asset data plus IL2CPP metadata).
- **D** Pestis Apotheca (yanko): procedural diseases and ingredients (Unity WebGL unpacked, Il2CppDumper type and field names recovered).
- **D** Alchemystery (LunaPg, GAMERella jam, MIT-style fork notice): fixed multi-element recipes, failure makes dust (repo read).
- Potioneer (hundi): reclassified from screened to partly decoded below (Unity build unpacked, class names only).
- Alchemical Circles (kyong): 10-minute jam incremental, draw circles with materials; fixed recipes, Godot. Thin.
- Lost Alchemist (lost-alchemist): fusion roguelite on an external host, hundreds of fusion recipes, garden fed by objects. Landing page only.
- Alchemy Shop (jjambong): 22 ingredients, pair mixing; adult content, skipped.
- Recursive Alchemist, Mix It Till You Make It, Brew It!, Kitchen Alchemy: color or puzzle prototypes from search results, not opened.
- Witchy Sketchy Alchemy (Ludum Dare entry, Unity): brew healing potions against a 10-second curse timer that transforms you; some recipes carry side effects. Page only; a time-pressure toy, side effects not described further.
- Garden Story (BCIT student project): collect medical herbs to treat townspeople and learn what plants do; page only, not opened.
- Search for tolerance, overdose, addiction or spoilage in HTML5 brewing games returned no match.
- Swamp Alchemy (shallow-lagoon): swamp thaumaturge, Unity, no mechanism text.
- Alchemind: zebra-style logic puzzle with brews and bottle shapes. No crafting system.
- Reverse Alchemy (knexator): uncombine complex items back to basics; puzzle.
- Alchemistry (elanis): merge elements to discover new ones; Little Alchemy shape, covered.
- Alchemy Combine, Conflatorium: merge-style, covered by Little Alchemy research.
- Off-topic or no mechanism text on the tag page: The Shattered Knight of Elaria, The Alterhistorian's Conquest, Blood X Thirsty, A Soul of Clay, RunicForce, Homunculus Secret Fight Club, Grainity, Witching Rush Hour, Aurelia, Photo Synthesis, Knives of Solomon, Potion Panik, Kitty Alchemy, Final Fharmacy, Prima Materia, Comigo and the Vacation of Fusion, Does Light Matter, The cave of Alchemy, The Technomagical Method, The Alchemist (exocarrot), Battle Alchemy, Descend The Depths: not opened; titles and blurbs show no ingredient-rule system.
- Not HTML5 (not opened): Idle Alchemist (Windows, 33 potions, customers with ailments), Alchemist's Garden (Windows/Mac, forage and discover), Do No Harm (reference book, toxic mixes), Alchemy Inc (Windows, MIT).

Depth note: the itch alchemy tag is dominated by merge-pair puzzles and
jam prototypes. None of the screened games implements tolerance, spoilage or
station quirks (searched specifically; no match). Toxicity appears only as
side-effect chance (Pestis Apotheca) and as poison/antidote effect pairs
(Potion Seller, Herbarium). Those topics stay owned by the audit and by
Potionomics/Potion Craft research.

---

## Hidden Grimoire: Idle Alchemy

- **Build**: itch `claucas`, iframe `html/19643190`. Flutter web build; `main.dart.js` 4,320,171 B, sha256 `8037c8aa...adfc`. A mobile version exists; the page links it.
- **Readability**: minified Dart-to-JS. Strings and the reagent and recipe constant tables are plain; method logic is minified (not traced).
- **License**: none stated (ideas only).

**Systems**
- Recipes are discovered by placing two reagents and pressing Combine. A pair that needs two of one reagent reports "you have none/one" before it spends anything. `source` (bench messages near offset 1419665-1422000).
- **The full recipe tree is readable** (compiled constants near offsets 3074000-3126000, byte offsets in `main.dart.js`). Five shop-priced base reagents (ashroot, dewdrop, salt, quicksilver, emberdust; prices 5e4 to 1e7 mana) pair into seven intermediates (verdant paste, ashen glass, mirror of rain, cinder bloom, brine crystal, lunar amalgam, philosopher's soot). Intermediates pair into fifteen elixirs that each give one permanent-for-the-life bonus. Rare reagents from expeditions and hunts (moonpetal, deep glass, storm seed, hollow ember, wyrm fang, gloaming essence, cindered heart, sovereign's crown) pair into more elixirs and hunt consumables. `source`.
- **Failure is an ingredient.** A failed pair leaves Residue (2 with the "memory salvage" upgrade). Residue + Residue makes Philosopher's Soot, which feeds insight and umbral elixirs and the first stage of the Great Work (named Nigredo). The Residue card says it outright: "failure, powdered, never a waste." `source`.
- A pair already tried is shown as "tried before, it fails, but it still leaves Residue", so retrying a known failure is visible and cheap. `source`.
- **The reagent card is the hint.** Every reagent has a one-line poetic description that states what it pairs with (for example, one reagent "pairs with the sea or the flame", another "loves what grows, stills what shines"). Players derive pairs from the text instead of a recipe list. `source` (card strings at 3105800-3107300). The page calls the hints "cryptic-but-fair" and the tutorial says every reagent names its affinity.
- **Companion-gated recipes.** Two recipes (`f_` ids) carry a familiar id and a hint written as "beside the Undine, the caged tide courts the moon-metal": they can only be found when that familiar is present. `source` (recipe records carry a familiar field and hint).
- **Hunt-gated reagents.** Eleven trophy-and-rare-reagent pairs each produce a named "night" (for example, The Lantern in the Gale); the Stolen Night recipe (8 hours, uses the storm seed + gloaming essence reagents) asks a different one of those pairs each night, with the first of a life free of mana. `source` for the table and cost strings; how the nightly pair is picked is not traced.
- Recipe pages arrive by routes besides experimenting: companions teach pages, sworn vows open vow-only pages for one life, and hunting trophies are reagents no expedition can carry. `source`.
- Failed-experiment memory survives reincarnation; so do discovered pages, Knowledge and Insights. Mana, reagents (except capped "packrat" base reagents and rare ones), spells, familiars and favor are lost. `source` (text near 1410142).
- Brewed elixir powers last one life and go "dormant until brewed again", while the page that records the recipe lasts forever. `source`.
- Cost shaping: a school favor "stops paying for what you already understand" (cheaper reagents); the Vow of the Empty Hand removes merchants ("every reagent must be gathered, salvaged, or carried home"). `source`.
- Five schools (Ember, Tide, Stone, Gale, Thought) with permanent favor from rituals; page says "no RNG in gameplay: every discovery is deterministic." `source`/`stated`.
- The Great Work: four stages named after the alchemical colors (Nigredo, Albedo, Citrinitas, Rubedo), each a pair of reagents with a poetic hint, carried across lives in one egg in the furnace. `source`.

**Representations**
- Failure toast shows the consolation prize in the same frame ("+1 Residue, it hisses"), so a failed brew reads as a small win.
- A single hint line under the bench changes with what you selected: not enough stock, tried before, known recipe, already brewed, remembered from a past life.
- Reagent cards double as the recipe book: flavor text only, no numbers, no recipe list.
- Offline return panel and notifications are limited to two kinds, which keeps a long idle game quiet.

**Improvements** (dev explanations): none in code comments (compiled build). The page promises that failure always pays back, which the tree backs (Residue is a recipe input).

**YAIR mapping**
- AD9 (failed experiments can teach) and P8 (research as inference): YAIR has the rule in prose; this game shows the cheapest working UI, a per-pair "tried" mark plus a salvage product. `src` has `cooling_refinement_*` failed-attempt records but no general crafting "tried combination" ledger (grep: only cooling refinement hits).
- AD10-AD12 (journey across lives): a recipe page that survives death while its product does not matches material lineage and `chronicle.js`. YAIR could mark crafting knowledge as the lasting record and the item as the perishable.
- AD1 (per-world rules): vow-only recipe pages are a "rule change opens new knowledge" shape; fits book-world crafting restrictions.
- No collision found with accepted decisions.

---

## CHROMA: The Apprentice's Workshop

- **Build**: itch `seshu`, `html/19847474`. Godot 4.3 web export. `index.pck` 1,338,128 B, sha256 `4fd9b477...`; 92 files, all MD5 verified with a small pack-v2 parser (the shared `extract_pck.py` handles only exe-embedded v3 packs). The shared `decode_gdc.py` rejects this pack (token format v100, not v101), so I read only compiled string constants. Logic is not traced.
- **Readability**: engine-compiled. Jam entry (AI game jam), mobile-first.
- **License**: none stated.

**Systems**
- Potion orders are written in a notation: prefixes encode flux drops per color (none, 1, 2, 3 drops) and a cycle speed (3, 2 or 1 second loop; none means still layers); numbers give relative amounts (2-ember-1-ion at 30 mL means 20 mL and 10 mL); bi/tri names mean two or three colors, read bottom to top. `source` (journal strings).
- Orders are scored against the written order, and reviews come in five tiers from "exactly the color I had in mind" to "not the shade I ordered". `source` (potion strings); scoring formula unread.
- A field journal has a Plan tab (30 mL budget), a Colors tab (200 colors, 24 main), and an Inspection view that overlays your plan next to the real batch. For some orders the master supplies a prepared reference. `source` (strings).
- A delivery shift (six bottles before a courier arrives) and named clients with a "guild delivery" order. `source` (strings only).
- Tutorials are staged by "week"; practice orders are marked unscored. `source`.

**Representations**
- The recipe is a *sentence you can read and write*: name = composition. The journal lets you write your reading of the order, then compares it with what you made.
- "Prefixes describe each color's flux state" doubles as a legend inside the journal.

**YAIR mapping**
- Recipe notation and journals: YAIR's making rules (MR1-MR36) and P9 (discovered methods saved as exact procedure) lack a *readable name grammar*. Candidate: derive a product's display name from its resolved composition and process flags, so the name is the procedure summary. Owner: crafting UI (`mixture_ui.js`, `craft_state.js`); check UR rules before adding.
- AD9: the plan-versus-batch comparison is an inspection tool that shows only what was measured; YAIR could gate which columns appear by what the player's instruments can read.
- Color mixing itself is not wanted (no rule maps to YAIR materials).

---

## Alchemyst Apprentice (mgaudi, Mini Jam 186)

- **Build**: itch `html/13967876`, served at `/web/index.html` (my first check at the root path 404'd; an earlier version of this file wrongly called it unreachable). Godot 4.4 web export, `index.pck` 4,396,992 B, 174 files, MD5 verified with my pack-v2 parser. Scripts are token format v100, which the shared `decode_gdc.py` rejects, so I read the imported CSV resources (complete) and compiled string constants (logic not traced).
- **License**: none stated (ideas only).

**Systems**
- **Data**: 16 ingredients (water plus 15 grim ones: bat wings, ectoplasm, cursed bones, viper skin, werewolf tongue, cadaver worm, magic mushroom, blood berries, nightshade lily, grave moss, monkey paw, zombie brain, vampire ash, spider eggs, stranglevine) and 8 effects (none, healing, strength, fire, ice, poison, vanish, love). Every effect row has a description line, a short outcome sentence written about the customer, and a reputation impact value. `source` (ingredients.csv and effects.csv resources).
- **Seeded world**: the game logs "using seed" and the save has a `knowledge` field and a `tutorial` flag, so the ingredient-to-effect assignment is generated per seed, not fixed. `source` (strings); the generator itself is not read.
- **Brewing shows its odds**: the cauldron overlay shows "Brewing success chance: X%" (100% when only water); the page says more ingredients raise the chance a potion forms. `source` (string), `stated`.
- **Delayed result letters**: after a customer takes a potion, a letter arrives from the customer, composed from the potion's name, a "how I used it" line (gave it to my companion in battle, put it in my cousin's drink, threw it at a goblin) and the effect description, with a closing reaction ("Curses upon you!", "I applaud your ingenuity!", "That was rather unexpected", "But nothing happened"). `source` (letter overlay strings).
- **Notes overlay**: a notes list with rows keyed by name, so the player records their own inferences. `source`.
- Reputation changes by effect and is the cost of experimenting (page, `stated`).

**Representations**
- The experiment's evidence arrives as a story, not a number; the player has to read an NPC's account to learn the effect.
- Water is a baseline ingredient (tutorial "nothing happens").

**YAIR mapping**
- AD9, P8, P13 as before. New detail: the evidence is a fiction-flavored letter from the NPC about *how they used it*, which also tells the player about use routes. Compare to YAIR's event feed and chronicle; no equivalent delayed-letter route found in `src`.
- Seeded per-world ingredient truth (P1 "seeded material generation" in the audit); confirms the shape, not new.

---

## Potion Seller (noteworthy, GMTK Jam 2021)

- **Build**: itch `html/3996323`, served at `/Build03/index.html`. Unity WebGL IL2CPP; `Build03.data` 5,948,940 B, `Build03.wasm` 11,456,977 B. Il2CppDumper recovered Assembly-CSharp types, fields and enums (`dump/dump.cs` in private notes). No method bodies read.
- **License**: none stated.

**Systems (type and enum level)**
- 8 ingredient kinds (leaf, cherry, root, jewel, mushroom, grass, flower, spice), each with a list of effects drawn from 24 effect values: nothing, negate, speed/slow, heal/poison, strengthen/weaken, grow/shrink, resistance/sensitivity, bright/dark, heavy/light, aura-heal/aura-poison, aging/youth, exhaust/refresh, night vision, cool shades. `source` (enums).
- Three rule tables: **opposite pairs** (A and its opposite cancel), **effect interactions** (a base effect, an interactor effect and a result effect) and **combinations** (effects joined in the mortar produce a compound effect such as night vision or cool shades). A cauldron and a mortar both hold effect sets, and you can tip one into the other. `source` (types `OppositeEffects`, `EffectInteraction`, `PotionMixing`: `AddEffectsToCauldron`, `AddEffectsToMortar`, `TipMortarIntoCauldron`, `TipCauldronIntoMortar`). The table contents are serialized data I did not parse.
- Scoring: `PotionChecker` has efficiency (steps) and quality scores against the requested potion, with round-based difficulty. A `Botanica` book holds the effect dictionary. `source`.
- Potion names come from effect descriptions (`PotionName`/`EffectDescription`). `source`.

**YAIR mapping**
- This is the closest small implementation of "ingredient properties that combine by rules, not recipe lookups" (the audit's P1/P2): effects as a set, cancellation by opposites, a three-field reaction rule, and a derived product name. Two separate vessels (cauldron, mortar) make order of operation matter (P6). YAIR has the design (P2 resolver, P6 order) but no code (`src` has no effect-cancel table).
- The name derived from effects matches the F2 idea from CHROMA: a product named from its resolved composition.

---

## Potion Brew Shop (sebadorn, JS13K 2025)

- **Build**: GitHub `sebadorn/js13k-2025-black-cat`, MIT (LICENSE 1071 B). `dev/js/Potions.js` sha256 `b710e7a1...`. Plain readable JS.
- **Systems**: four ingredients (heat, cold, life, emotion); thirteen order templates, each a *set* of ingredients; each template has an optional `alternatives` list of other potions a customer will also accept. `source` (Potions.js). Win at 30 correct orders, loss at 10 mistakes (listing page, `stated`).
- **Representations**: customers phrase the same order in different words ("warm and healing, but for the head"), so order text, not a recipe name, tells the player what to read.
- **YAIR mapping**: P13 (trade and reputation). The `alternatives` getter is a cheap model of "near-miss accepted"; YAIR commissions could accept substitute products with a reduced pay instead of a binary pass. Owner: `work_ledger_*`, commissions. Low value otherwise.

---

## Alchemica (onlyjxv) and Corpus et Spiritus (arpentor)

Both thin for this topic; one line of use each.
- **Alchemica**: single `index.html` 186,606 B sha256 `f02b266c...`, plain JS, page says AI-written. Five fixed potions; craft cost multiplies by 1.30 per craft of that potion; a chance (an upgrade) keeps ingredients ("Perfect Transmutation"); drinking gives a timed buff; sending a hero on a long offline mission *requires a specific potion*, giving each potion an expedition purpose. `source` (lines 749-776, 1312-1376). Idea only: expedition parties consume a prepared potion as a readiness gate (already near YAIR's expedition kit rules; no new owner).
- **Corpus et Spiritus**: Vite bundle `index-H48eEc54.js` 1,552,269 B sha256 `c3ecc5aa...`, inline French card JSON. Operations named transmuteMetalIntoAttribute, transmuteMetalsIntoKnowledge, a turn-scoped switch so metals are not consumed (catalyst), and talisman "sublimate" tier-ups triggered by counters. `source`. Idea only: a catalyst reserved for the duration of one session rather than per use.

---

## Alchemystery (LunaPg, GAMERella jam)

- **Build**: GitHub `LunaPg/gamejam1311`, Backbone/RequireJS/jQuery. Files read: `resources/recipes.js`, `resources/elements.js`, `models/Recipe.js`, `views/CraftTable.js`. README invites forks; no license file fetched (ideas only).
- **Systems**: four starting elements with counts (5 each); a recipe is a set of 2-6 ingredient names, matched against the table slots by length and membership (so a repeat ingredient like three magnets is not counted individually, `source`). Craft slots grow by one at achievement ranks 1 and 3. The element `dust` starts locked and is unlocked by the `fail` achievement; dust is then an ingredient of the planet and life recipes. `source`.
- **YAIR mapping**: same shape as Hidden Grimoire F1 (a failure product that is a required later input). No new rule; confirms the pattern across two unrelated jam games.

---

## Herbarium (yanko, PROCJAM 2017)

- **Build**: itch `html/658050`, Unity WebGL (UnityLoader, IL2CPP). `herbarium.data.unityweb` 7,447,214 B sha256 `666652b0...`; unpacked the UnityWebData container, read `data.unity3d` with UnityPy and the IL2CPP `global-metadata.dat`. No logic bodies (asm.js code not decompiled), so claims are class, field and data-table level.
- **Readability**: engine-compiled; classes and serialized tables readable.
- **License**: none stated.

**Systems**
- **Substance model** (identifiers): substance types Water, Acid, Base, Metal, Alcohol; pH level Acid/Neutral/Base; reaction effects Exothermic, Endothermic, Electricity; processes Mix and Dilute; concentration levels Dilluted, Average, Concentrated, Pure; per-substance `boilingPoint`, `freezingPoint`, `heatTransferSpeed`, `purity`, `idealConcentrationForEffect`, `power`/`powerBracket`; products keep `ParentA`, `ParentB` in a reaction history step. A world settings table holds per-type boil and freeze variation and concentration bands (0, 10, 50, 85, 100 percent look like the band edges). `source` (metadata + WorldSettings floats; mapping of numbers to names is inference).
- **Potion effect table**: six rat states (NoEffect, Dead, Sick, Smart, Strong, Zombie) by five effect types (Strength, Intelligence, Poison, Health, Normalize). Each cell is the next state or "no change". The shipped table gives, for example, a Dead rat no change under every effect, a healthy rat made Smart or Strong by the matching effect and Dead by poison, and Strong rats made Sick by poison. `source` (PotionEffectTable raw ints; enum order inferred from identifier order, so state names per row are probable, not verified). The same substance therefore reads differently depending on the subject's starting state, which is why the page warns that sickness or recovery does not prove poison or cure.
- **Tools unlock and discover**: Thermometer (observation threshold), Distiller/Alembic with efficiency and minimum volume, Extractor, pH strip (player guesses Acid/Base/Neutral), Syringe with a dose slider and injection duration. Tools have `isKnown` and unlock animations. `source` (identifiers).
- **Knowledge model**: per-substance knowledge chunk, flags `KnowsTemperature`, `KnowsDistill`, `KnowsEffects`, saved experiments with original subject state, a known-substance hash list, and a knowledge percent. A Deduction panel lets the player commit guesses (strength, intelligence, poison, health, restoring); each guess is checked and gives feedback, and correct ones "ping" the data page for boiling point, distillation and effect. `source` (identifiers). Wrong guesses do not appear to lock anything out; unverified.
- Procedural content: flowers from seeded petal shape curves; names from a Markov letter-chain generator fed sample names; substance identity from an xxHash of the flower seed. `source`.
- Achievements keyed to temperature, substance type, distill, rat death, rat experiment count, and "all knowledge". `source`.

**Representations**
- A physical book with Flowers, Rats, Experiments and Achievements pages; the experiments page is locked until first needed (lock overlay).
- Experiment log lists each trial with subject state, so a later deduction can cite it.

**Improvements** (itch tips, also dev explanations): white smoke is steam; repeat experiments across concentrations and subject states; "discovering the mechanics is a mechanic in itself."

**YAIR mapping**
- AD9, P8: the experiment log with original subject state and a deduction panel that confirms or rejects each stated inference is the most complete small implementation of "failed experiments teach, forecasts reflect knowledge" I found. Not in `src`.
- P4/P12: effect depends on the subject's starting body state; YAIR has body progression (`body_progression.js`) as the consumer. State-by-effect transition tables are a cheap form of context-sensitive dose response.
- Product lineage `ParentA/ParentB`: matches YAIR material lineage (`material_lineage.js`).

---

## Pestis Apotheca (yanko, PROCJAM 2020)

- **Build**: itch `html/3126802`, Unity WebGL, IL2CPP v24.4. `build.wasm` 18,824,894 B, `build.data` 179,820,920 B (container with `data.unity3d` 170 MB). Il2CppDumper (project tool) ran on the wasm plus metadata and recovered the Assembly-CSharp types and fields (`dump/game.cs` in private notes). No method bodies read.
- **Readability**: engine-compiled; type and field names plus 3,788 string literals readable.
- **License**: none stated (uses CC or purchased art packs credited on the page).

**Systems (identifier and string level)**
- **Ingredients** are generated with a seed: `Ph` drawn from a `PhCurve`, `GoodFor` (symptom types it treats), `SideEffects`, `ChanceOfAdverseEffect`, plus a config for number of positive effects, number of negative effects, chance of an extra effect, and a perfect-mix threshold. Names come from a Markov generator and the flower portrait is rendered from the seed. `GivenToNpcIds` records which patients got it. `source`.
- **Mixing**: the craft window takes a left and right ingredient and a mix-percent slider (labelled "x% A + y% B"); `GetFinalIngredient` builds the result from the two, with a timed reaction progress before the medicine is ready. `source` (names); the formula is not read.
- **Knowledge gates on the ingredient card**: `GetKnownData` returns only what the player has learned; the side-effect list shows "{0} ({1}% chance)" for known effects, "NO side effects!" when none known and cleared, and "Here will be possible side effects." as the empty state. `source` (strings).
- **Diseases are procedural**: a disease has N symptoms (type, current level, known flag, `IsSideEffect`); symptoms degrade or improve with treatment (`DegradeCondition`, `ImproveCondition`); a grammar-based symptom text table; symptom names change as the disease progresses ("Symptoms might have different names as the disease progresses"). `source`.
- **Patients** have age, weight, profession, daily history (`IsDead`, `IsCured`, symptoms, medication given), a chance to emit a symptom, and a chance to discuss more; the doctor uncovers symptoms through observation and conversation, one at a time (`UncoverNextSymptom`). A treatment attempt stores a `Certainty` value. `source`.
- **Diseases window with treatment cross-reference**: each disease lists which ingredients treated it and an effectiveness band over mix-percent ranges (`MinPercent`, `MaxPercent`). Whether the list comes from the player's own past treatments or from fixed data is inferred, not read. `source` (field names).
- **Economy**: money and reputation in the HUD, day clock, discard/keep decision on new ingredients, and an exchange action that trades discarded ingredients for new ones. `source`.

**Improvements** (in-game hints): "Make sure to check your patient's day to day progress to adjust medication."

**YAIR mapping**
- AD9 and P13: the treatment cross-reference (ingredient x disease x mix-percent effectiveness, filled from past attempts) is the knowledge UI P8 describes in prose. Certainty on a treatment attempt is a stored confidence rather than a displayed truth.
- Side effects shown as "chance" only once learned, with distinct empty states for unknown and known-none: a direct answer to "how the UI shows unknown versus known properties". YAIR has no such per-property known-state display for crafting.
- `IsSideEffect` symptoms mean a medicine's harm appears in the patient the same way disease does, so side effects need no separate display system. Fits CO4/AB2 exposure ledger.
- Keep or discard new ingredients (exchange for new): a trade-in loop for surplus unknowns; YAIR equivalent would be selling or swapping unidentified material.

---

## Potioneer (hundi, My First GameJam 2022)

- **Build**: itch `html/6190858`, Unity WebGL IL2CPP. `WebGLBuild.data` 9,220,243 B, `WebGLBuild.wasm` 14,818,590 B; Il2CppDumper recovered `ingredient` (name, sprite, `mainEffect`, `secondaryEffect`), `CauldronBehavior` (`content`, `addWater`, `addContent`, `createPotion`), `counterBehavior` (`requestedContent`, `compareIngredientList`, `generateNewRequest`). Order does not matter (page). `source` (names).
- **Use**: two effect slots per ingredient and a set comparison against the customer's request. Thin; no new mechanism over Potion Brew Shop.

---

## Top findings

1. **F1 Failure is an ingredient (Hidden Grimoire, Alchemystery).** In Hidden Grimoire a failed pair leaves Residue, Residue plus Residue makes Philosopher's Soot, and Soot feeds elixirs and the first stage of the Great Work; the tried pair is marked and the memory survives death. Alchemystery makes the `fail` achievement unlock dust, which later recipes require. Two unrelated jam games use the same shape. Smallest working form of AD9 for crafting; `src` has failed-attempt records only in cooling refinement.
2. **F2 Flavor text as the hint, with a known/unknown display per property (Hidden Grimoire, Pestis Apotheca).** Hidden Grimoire's reagent cards carry one line saying what each pairs with, no recipe list. Pestis Apotheca shows side effects as "{effect} ({n}% chance)" only after learned, with separate empty states for "not yet known" and "no side effects", and a treatment cross-reference over mix percent. Direct answers to "how the UI shows unknown versus known properties".
3. **F3 Experiment records that cite subject state, and a deduction step that checks your inference (Herbarium).** Rat states by effect types give a transition table, so one substance reads differently by starting state; every trial stores the original state; a deduction panel confirms or rejects stated conclusions. Fits AD9, P8 and body-state-dependent dose response (P12).
4. **F4 Delayed third-party evidence with a reputation cost (Alchemyst Apprentice, Pestis Apotheca).** Alchemyst's customers send letters about how they used the potion, the effect has a reputation impact, and the game shows "brewing success chance" before the brew. Pestis Apotheca patients carry per-day histories and symptom discovery is one-at-a-time. Fits AD27 and P13.
5. **F5 Effects as sets with cancellation, interaction rules and a derived name (Potion Seller, CHROMA).** Potion Seller keeps opposite-pair, interaction (base, interactor, result) and mortar-combination tables over 24 effects; CHROMA names a product by its composition with a prefix grammar and compares your written plan with the real batch. Closest small implementations of the audit's P1/P2/P6; no effect-cancel table or name grammar exists in `src`.

Also worth recording: the recipe tree in Hidden Grimoire (5 base reagents, 7 intermediates, 15 elixirs, companion-gated and hunt-gated recipes) is a ready-made reference for a staged discovery ladder, and its reagent hints are the strongest "discoverable by reasoning" example found.

## Verification

- **Read from source or data**: Hidden Grimoire (`main.dart.js` strings and the full reagent and recipe constant tables; method logic not traced); CHROMA (92-file pack, string constants; logic not traced); Alchemyst Apprentice (174-file pack, ingredient and effect resources, string constants); Potion Brew Shop (GitHub); Alchemystery (GitHub recipes, elements, Recipe model, craft table); Alchemica (inline JS); Corpus et Spiritus (card JSON, grep only); Herbarium (UnityWebData container, `data.unity3d` via UnityPy, IL2CPP metadata identifiers, `PotionEffectTable` and `WorldSettings` raw values); Pestis Apotheca (Il2CppDumper types and fields, 3,788 string literals); Potion Seller and Potioneer (Il2CppDumper types, fields, enums).
- **Not read**: method bodies of every Unity and Godot build (no decompilation of wasm or Godot bytecode; shared `decode_gdc.py` rejects token format v100 used by the CHROMA and Alchemyst Apprentice packs); Potion Seller's serialized rule tables (which effects cancel which); Herbarium's per-substance values; Pestis Apotheca's ingredient and disease data assets (170 MB `data.unity3d` not parsed); Alchemical Circles, Lost Alchemist (external host, landing page only), Swamp Alchemy, Alchemind and the tag-page titles.
- **Tools**: itch pages at 4-6 s spacing with four 429 responses handled by waiting (90-120 s); Il2CppDumper (project tool), UnityPy (project venv), shared `decode_gdc.py` attempted, own small Godot pack-v2 and UnityWebData unpackers; GitHub API and raw files for the two open-source repos. About 140 tool calls in all (the brief said about 80; the extra were requested by Weibao to go deeper). No game code executed, no native downloads, nothing committed.
- **Correction to my first pass**: I reported Alchemyst Apprentice's build as unreachable; it is served at `/web/index.html`, and Potion Seller at `/Build03/index.html`. The first pass also had the reagent tables as unread; they are now read.
