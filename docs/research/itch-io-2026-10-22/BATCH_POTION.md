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

## Screened (about 36 titles; tag pages alchemy and potion, plus search hits)

Decoded games are marked **D**. HTML5 unless noted.

- **D** Hidden Grimoire: Idle Alchemy (claucas): deep idle alchemy, pair recipes, residue, reincarnation.
- **D** CHROMA: The Apprentice's Workshop (seshu): color-mixing potions, written orders, field journal.
- **D** Potion Brew Shop (sebadorn, js13k 2025, MIT): four-ingredient order puzzle.
- **D** Alchemica (onlyjxv): AI-written idle game, potions as buffs and quest gear.
- **D** Corpus et Spiritus (arpentor): alchemy deckbuilder; metals transmuted into attributes.
- **D** Alchemyst Apprentice (mgaudi): unknown ingredients tested on customers (page-stated only, no readable build).
- **D** Herbarium (yanko, PROCJAM 2017): procedural flowers, rat experiments (page-stated only, Unity build not read).
- **D** Pestis Apotheca (yanko): procedural diseases and ingredients (page-stated only, 150 MB Unity build not read).
- Potion Seller (noteworthy): GMTK 2021 Unity puzzle, effects cancel in a cauldron, combine in a mortar. Unity, rules not described.
- Potioneer (hundi): order-based potion game, "interact to see ingredient effects", order does not matter. Unity, not read.
- Alchemical Circles (kyong): 10-minute jam incremental, draw circles with materials; fixed recipes, Godot. Thin.
- Lost Alchemist (lost-alchemist): fusion roguelite on an external host, hundreds of fusion recipes, garden fed by objects. Landing page only.
- Alchemy Shop (jjambong): 22 ingredients, pair mixing; adult content, skipped.
- Recursive Alchemist, Mix It Till You Make It, Brew It!, Kitchen Alchemy, Witchy Sketchy Alchemy: color or puzzle prototypes from search results, not opened.
- Swamp Alchemy (shallow-lagoon): swamp thaumaturge, Unity, no mechanism text.
- Alchemind: zebra-style logic puzzle with brews and bottle shapes. No crafting system.
- Reverse Alchemy (knexator): uncombine complex items back to basics; puzzle.
- Alchemistry (elanis): merge elements to discover new ones; Little Alchemy shape, covered.
- Alchemy Combine, Conflatorium: merge-style, covered by Little Alchemy research.
- Off-topic or no mechanism text on the tag page: The Shattered Knight of Elaria, The Alterhistorian's Conquest, Blood X Thirsty, A Soul of Clay, RunicForce, Homunculus Secret Fight Club, Grainity, Witching Rush Hour, Aurelia, Photo Synthesis, Knives of Solomon, Potion Panik, Kitty Alchemy, Final Fharmacy, Prima Materia, Comigo and the Vacation of Fusion, Does Light Matter, The cave of Alchemy, The Technomagical Method, The Alchemist (exocarrot), Battle Alchemy, Descend The Depths: not opened; titles and blurbs show no ingredient-rule system.
- Not HTML5 (not opened): Idle Alchemist (Windows, 33 potions, customers with ailments), Alchemist's Garden (Windows/Mac, forage and discover), Do No Harm (reference book, toxic mixes), Alchemy Inc (Windows, MIT).
- Alchemystery (jam, Backbone/jQuery, README invites forks): found only through a README summary; repo not read.

Depth note: the itch alchemy tag is dominated by merge-pair puzzles and
jam prototypes. None of the screened games implements toxicity, tolerance,
spoilage or station quirks in a way I could read. Those topics stay owned by
the audit and by Potionomics/Potion Craft research.

---

## Hidden Grimoire: Idle Alchemy

- **Build**: itch `claucas`, iframe `html/19643190`. Flutter web build; `main.dart.js` 4,320,171 B, sha256 `8037c8aa...adfc`. A mobile version exists; the page links it.
- **Readability**: minified Dart-to-JS. All player-facing strings are plain, so UI and messages are readable. The reagent and recipe tables are compiled constants I did not extract, so *which* pair makes *what* is unread.
- **License**: none stated (ideas only).

**Systems**
- Recipes are discovered by placing two reagents and pressing Combine. `source` (bench messages near offset 1419665-1422000).
- A pair that needs two of one reagent reports "you have none/one" before it spends anything; the bench says exactly why a combination cannot run. `source`.
- A failed pair gives Residue (2 with the "memory salvage" upgrade). Residue is itself an ingredient that brews, and the page says Residue hides its own recipe. `source` for the yield and the upgrade flag; hidden-residue-recipe `stated-not-found` in strings.
- A pair already tried is shown as "tried before, it fails, but it still leaves Residue", so retrying a known failure is visible and cheap. `source`.
- Failed-experiment memory survives reincarnation; so do discovered pages, Knowledge and Insights. Mana, reagents (except a capped number of "packrat" base reagents and rare ones), spells, familiars and favor are lost. `source` (reincarnation text near 1410142). A tooltip separates "a past life remembers this page".
- Recipe pages arrive by routes besides experimenting: companions teach pages, sworn vows open vow-only pages for one life ("pages of the Grimoire can only be found under this vow"), and hunting trophies are reagents no expedition can carry. `source` (strings near 3065921, 1411964); the page text says hints are "cryptic-but-fair".
- "The Stolen Night": a special brew whose pair changes ("tonight it asks X + Y") and costs mana, except the first night of a life is free. `source` for the UI strings; how the pair is chosen is not traced.
- Reagent cards display an "Affinity", and the tutorial line says the bench is not a guessing game because every reagent names its affinity. `source` for the label; the affinity-to-recipe rule is `stated-not-found` (tables not extracted).
- Brewed elixir powers last one life and go "dormant until brewed again", while the page that records the recipe lasts forever. `source` (two strings).
- Cost shaping: a school favor "stops paying for what you already understand" (cheaper reagents), a late bonus stops merchant purchases (Vow of the Empty Hand, "every reagent must be gathered, salvaged, or carried home"). `source`.
- Five schools (Ember, Tide, Stone, Gale, Thought) with permanent favor from rituals; page says "no RNG in gameplay: every discovery is deterministic." `source`/`stated`.

**Representations**
- Failure toast shows the consolation prize in the same frame ("+1 Residue, it hisses"), so a failed brew reads as a small win.
- A single hint line under the bench changes with what you selected: not enough stock, tried before, known recipe, already brewed, remembered from a past life.
- Offline return panel and appointment notifications are limited to two kinds, which keeps a long idle game quiet.

**Improvements** (dev explanations): none found in code comments (compiled build). The page promises that failure always pays back.

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

- **Build**: itch page lists HTML5 and Windows; the served iframe id `13967876` returns 404, and the only downloadable file named is a Windows zip. Unreachable for static reading; mechanisms below are `stated` from the page.
- **License**: none stated.

**Systems (stated, unread)**
- All ingredients start unknown. You brew a potion, hand it to a customer, and the customer *leaves to try it*; results return later by mail, so you narrow down what each ingredient does by elimination. `stated`.
- More ingredients in the cauldron raise the chance that it yields a potion at all. `stated`.
- Reputation is a budget: too much experimentation keeps customers away. `stated`.

**YAIR mapping**
- AD9 and P8, P13: this is the cleanest small example of an experiment with a *delayed, third-party observed* result and a *reputation cost*. Fits household and town reputation (AD27 local economies). Proposal: tests on volunteers or patients return observations after a delay through the existing event feed, with standing as the cost. Not found in `src`.
- Compare with Potionomics and Skyrim research already held: those test on the player; this tests on NPCs and delays the answer.

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

## Herbarium and Pestis Apotheca (yanko)

- **Build**: Herbarium `html/658050` is a 2017 Unity WebGL loader (`UnityLoader.js`); Pestis Apotheca `html/3126802` is a ~150 MB Unity WebGL build. I did not unpack either (UnityPy/Il2CppDumper pass would be a separate task). The dev blog and project pages linked from the itch page returned 404, so everything is `stated` from the itch text.
- **Herbarium, stated**: flowers are procedurally generated (PROCJAM 2017) and the game is about learning which potions each flower makes. Substances have states and boiling points, some boiling before and some after 100 C; distillation separates water and substance by fraction; water is white so white smoke is steam, not your substance. Experiments are on rats: sickness or death in a rat does not prove poison, and recovery does not prove a normalizer. The developer's advice is to repeat each experiment at several concentrations and in several rat states. "Discovering the mechanics is a mechanic in itself." `stated`.
- **Pestis Apotheca, stated**: medieval medicine simulator with *procedural diseases and procedural ingredients*; players post good compounds to fellow doctors. `stated`.
- **YAIR mapping**: P4-P8 already cover concentration, extraction and inference. The new, transferable point is the *warning about confounded tests*: the same observation has more than one cause. Proposal: a trial result stores subject state and dose, and the journal refuses to claim an inference those inputs cannot support (AD9). Owner: crafting knowledge records (`craft_state.js`). Not found in `src`.

---

## Top findings

1. **F1 Failure with a product and a "tried" mark (Hidden Grimoire).** A failed pair leaves a usable residue, is remembered as tried, and its memory survives death; the bench tells you which of five reasons a combination cannot run. Smallest working form of AD9 for crafting. Not in `src` outside cooling refinement.
2. **F2 Name = composition (CHROMA).** Prefix grammar turns a product's name into a readable procedure, and the journal's Plan-versus-batch inspection compares your interpretation against what you made. No grammar like this in YAIR's making docs.
3. **F3 Delayed observed experiments with a reputation cost (Alchemyst Apprentice, stated).** Test on a third party, get results later, pay in standing. Fits AD27 and P13; page-stated only because the build is not served.
4. **F4 Knowledge outlives the product (Hidden Grimoire).** The recipe page is permanent across lives, the brewed power is per-life and "dormant until brewed again". Matches AD10-AD12 and material lineage; propose marking crafting knowledge versus perishable output explicitly.
5. **F5 Confounded trials (Herbarium, stated).** Record subject state and dose with every trial, and let the journal decline inferences those inputs cannot support.

## Verification

- **Read**: Hidden Grimoire itch page and `main.dart.js` (string constants in bench, reincarnation, vow, insight and school regions; no reagent or recipe table, no logic trace); CHROMA full pack extraction (92 files, MD5 checked) and compiled string constants for journal, potion and shift scripts; Potion Brew Shop `Potions.js` and `Ingredients.js` head (Cauldron.js saved, not read); Alchemica `index.html` recipe, craft and mission code; Corpus et Spiritus card JSON by grep; itch pages for Herbarium, Pestis Apotheca, Alchemyst Apprentice, Lost Alchemist, Alchemical Circles, Potioneer, Swamp Alchemy, Alchemind, Alchemica, Corpus (page text only); Lost Alchemist landing page.
- **Not read**: Unity builds (Herbarium, Pestis Apotheca, Potioneer, Potion Seller, Swamp Alchemy); Alchemical Circles pack; Alchemyst Apprentice build (served id 404); Alchemystery repo; Hidden Grimoire recipe and affinity tables; CHROMA scoring logic (token format v100 not supported by the shared decoder); the herbarium blog posts (404).
- **Tool calls**: about 75, itch pages at 4-6 s spacing, one 429 handled with a 90 s wait. No game code executed, no native downloads, nothing committed.
