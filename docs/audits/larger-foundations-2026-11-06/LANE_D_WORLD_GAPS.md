# Lane D: per-world gaps, reconciled and deepened (2026-11-06)

Proposal under AD32. Nothing here is accepted or dispatched. Read-only pass over `src/` and owner docs on the dirty `master` tree after `d001a2f9a`; no runtime run, no code change. Root doc: [LARGER_FOUNDATIONS](../LARGER_FOUNDATIONS_2026-11-06.md) (FD3, FD14-FD18).

Weibao, 2026-11-06: "Also on details for each world? specific gaps, such as LOTM missing other potions, how to digitalize combat and variety of abstract abilities and more?"

Labels: **shown** = I read it in the file at the cited place; **stated** = a doc says it, not rechecked in code; **inferred** = my reading. Sealed secrets: none touched; pathway and Sequence names are public franchise canon. Higher-rung effects are kept out of this file (`lotm_advancement.js` header keeps them out of tracked files).

## 1. Reconcile first: what the root doc gets wrong or misses

Classes: duplicate, compatible variant, incomplete integration, stale, genuine disagreement.

| Code | Root doc claim | What the owners show | Class |
|---|---|---|---|
| RC1 | "four pathways (Seer, Corpse Collector, Savant, Sailor), each Sequence 9 to 8 only" | Five. `book_world_lotm_generated.js:54-55` adds Visionary (Spectator 9, Telepathist 8) through a second factory, wired into state at `book_world_lotm_state.js:15,89-98` (shown). It is brewed, self-directed, has no church and no examiner (header, shown). Two factories now exist: church-allocated rows (`book_world_lotm_rows.js:85`, 3 rows plus the hand-authored Seer) and table-generated rows | compatible variant, root doc stale by one |
| RC2 | "about 35 ability ids in `book_world_lotm_abilities.js`" | 12 ability rows in `ROWS` (cc 4, sv 3, sa 4, seer 1; `abilities.js:31-48`, shown) plus 4 hostile bindings (`:50-`, shown). `docs/ABILITY_RULES.md:205` says about 13 (stated). The 35 counted every `id:` line | stale |
| RC3 | "higher rungs need new verbs (ABR18), so they need FD18" | Rungs above Seq 8 for the Seer already have a seam: `lotm_advancement.js` turns a private pack into a path and typed ability records; `book_world_lotm_path.js:23` keeps the public stub "Not offered in this slice" and `:33-` loads the pack if present (shown). BOOK_WORLD_GAPS cited the stub at `path.js:21`; it is `:23` now | incomplete integration, not a blank |
| RC4 | "B2 factory makes every pathway except the Seer pure data" | True only when both Seq 9 and Seq 8 formula rows are `brewable` with no rite: `generatePathwayRow` throws otherwise (`generated.js` lines after `SPECTATOR_SPEC`, shown). The church factory needs a church officer, an examiner id and ids-file dose keys. Few pathways pass. See section 2.2 | refinement |
| RC5 | "LOTM combat: B8 below floor, no native fight (AT15)" | Correct as to play. But an owner already designs the whole digitization: [LOTM_COMBAT_DEEP_DIVE](../../gm/dispatch/refinement-audits-2026-10-31/LOTM_COMBAT_DEEP_DIVE_2026-11-03.md) LCD1-LCD7, ranked build LCB1-LCB10 (section 10), and `book_world_lotm_bands.js` already holds notch bands (header, shown). FD17 should be framed as the shared frame around LCB6-LCB8, not a new design | duplicate if re-ideated; compatible if FD17 consumes LCB6 |
| RC6 | "HP: 6 `book_world_hp_*` files against 47; two spells as rows; no school calendar" | Six `book_world_hp_*` files, but HP also has 5 `world_packs/book_hp_*.js`, `hp_brewing_*` (4), `hp_preparation`, `hp_ingredient_substitution`, `hp_life_holdings`, `hp_animal_features`, `spell_adapter_hp`, `spell_seam`, `read_models/hp_charm_bridge.js` (shown, `ls src`). Two spell rows are right (`world_packs/book_hp_life_data.js:57`, levitation and glass repair, shown). A school timetable exists for the original first-year life (70 calendar days, `book_hp_life_data.js:23`, shown). What lacks the canon calendar is Harry's lead life (G5, W5 proposed) | stale in part; the file-count comparison misleads |
| RC7 | "spells as data (the 100-row census, DWF165)" | The census has 100 spell records but they are names with first locators; "Not verified" lists teaching scene, counters and finite relations as unrecorded (`HP_CENSUS_REPORT.md`, shown). `spell_seam.js` plus `spell_adapter_hp.js` define the row shape, and `spellFromLearnRow` exists, but no HP row set beyond two consumes them (grep: `hp.sp` appears in tests and the adapter only, shown) | incomplete integration |
| RC8 | Price and market for potions not mentioned | `lotm_price_map.js` has no `src/` importer (BOOK_WORLD_GAPS X19, stated; I saw no importer in this pass). Prices exist as scaled proposals in `lotm_formula_rows.js` (canon beside scaled pence, shown) | incomplete integration |
| RC9 | Formula coverage not mentioned | `lotm_formula_rows.js` carries 43 canon rows over 12 of 22 pathways (counted from `RAW`, shown): Fool 10, Visionary 6, Sun 6, Door 5, Tyrant 3, Justiciar 3, Black Emperor 3, Moon 2, Demoness 2, Red Priest 1, Hermit 1, Death 1. Ten pathways have no row: Error, White Tower, Hanged Man, Darkness, Twilight Giant, Paragon, Mother, Abyss, Chained, Wheel of Fortune. 23 rows name every material (brewable), the rest are inspect-only (header, shown) | new fact for the root doc |
| RC10 | "MoL, paradise, primordial, Gu: depth not inspected" | Light pass done in section 5 | closed here |

RC11: the plan for "other pathways as rows" already exists: [IMPLEMENTATION_DESIGN](../../gm/dispatch/potion-pathways-2026-10-24/IMPLEMENTATION_DESIGN.md) 1.3 (one-literal row, only rungs 9 and 8 `offered:true`), 2.3 (partial and claimed-unverified formula), 3.2 (institutional finite stock). Class: compatible; the root doc cites none of it, and section 6 is relabelled against it. RC12: `book_world_lotm_bands.js` already has `PATHWAY_LEANS` and dated cast subjects for Old Neil (Hermit) and Dunn (Darkness 7) (shown), so cast-sheet pathway data has an owner (LCB3).

No genuine disagreement found. Each difference above is a stale count or a missing existing owner.

## 2. LOTM, deepened backwards

### 2.1 What the next windows actually need (the "needed versus nice to have" split)

Klein's endpoint is KJ3AE, Wednesday 8 p.m., Daffodil Street, ch67-69 (PROJECT.md line 19, shown). The campaign plan keeps KJ4 Backlund, KJ5 sea, KJ6 and later as unauthored consumers (`LOTM_KLEIN_FULL_JOURNEY_PLAN.md:12-14`, shown). The next windows pull from `MECHANISM_BACKLOG.md` (shown, rows below):

| Need | Source | Pathway or potion content needed? | Foundation |
|---|---|---|---|
| R3/U1 Spirit Vision switch, exhaustion, aura reading | ch62 P008, ch72 P047 (backlog :31) | No new pathway. Seer ability, already represented as facts per the KJ3Z note | FD18 channel "perceive the hidden" |
| R7 sealed-artifact exposure budget (ten meters, half an hour a day) | ch71 P033, ch108 P069 (:35, :59) | No | content plus FD3 style exposure counter |
| G1 skip or swap a fixed weekly slot | ch88 P038 (:48) | No | FD8 `recurring_duties`, content |
| G2 Seq 8 advancement: wait, exam, special application, recipe earned by contribution | ch96 P022, ch127 P016 (:49) | Yes, but Klein's own Fool line: Clown formula row exists with auxiliaries marked missing (`lotm_formula_rows.js` Fool 8, shown) | FD15 positions (contribution, exam), content |
| R1 acting and digestion: role laws with adherence check | ch93 P034, ch101 P029 (:56) | The unbuilt half of every pathway, not a new one | FD18 plus existing `lotm_act_engine.js` |
| G5 ritual kit and ingredient shopping for Klein's seat | ch101-102, ch128 (:52) | Seer-adjacent materials only | FD3 stock, price map wiring (RC8) |
| G6 investigation case state | ch89 P042, ch98 P074 (:53) | No | FD16 events plus a case record (no owner) |
| G9/G15 Clown abilities after advance, mediumship session | ch169 P009, ch183 P035 (:76, :107) | Clown 8 abilities, Amanda-style aids exist as rows (`lotm_potion_rule_rows.js:25-96`) | FD18 channels |
| G12 deferred and priced terms at the gathering | ch144 P040, ch158 P058 (:79) | Other pathways appear as trade goods and as other members' sheets | FD3 stock, FD14 price bands |

Inferred conclusion, D-LOTM-1: **no near window needs a second pathway for Klein.** Other pathways are needed as other people's sheets (who holds what, what a hostile does) and as trade goods at the gathering. That puts "missing potions" under FD14 and FD15 (who supplies, who is enrolled) and FD17 (opponents), not on the lead's ladder. It is nice to have for breadth of the Tingen branch, needed from the gathering trade windows and Tingen climax onward.

### 2.2 Inventory: built versus canon

Pathway and Sequence names are in the [deep dive grid](../../research/novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md) (section 2) and the [potion table](../../gm/dispatch/potion-pathways-2026-10-24/PATHWAY_POTION_TABLE.md) (sections 1-22); not repeated. Conflicts C1-C5 (swap rank, Spirit Guide rank, Hanged Man 3, Abyss 6/4) stay open per the table, and a world follows its book.

| Pathway | Built in play (shown) | Formula rows | Holder in Tingen or Backlund |
|---|---|---|---|
| Fool (Seer 9, Clown 8) | Seer hand-authored, Clown by church exam; Seq 7 stub | 10 rows, Seer through Fool; 7 have a rite or missing aux (Clown, then Marionettist upward); Magician 7 and Faceless 6 are brewable, no rite | Seq 9 from the Nighthawks, Seq 8 after merit (table :50, stated); Mystery Order above |
| Death (Corpse Collector 9, Gravedigger 8) | church row `ccRow`, plus a brew route for the frog (`book_world_lotm_brew.js`) | 1 row (Seq 9, inspect-only) | Evernight team in Tingen (rows.js, shown) |
| Paragon (Savant 9, Archaeologist 8) | church row `savantRow`, exam authored | none | Machinery team at the university (rows.js:33-34, institutions F1, stated) |
| Tyrant (Sailor 9, Folk of Rage 8) | church row `sailorRow`, acts authored (no source acting statement) | 3 rows (Sailor inspect-only, Wind-blessed, Ocean Songster) | Storm Mandated Punishers at the docks (rows.js:61-62) |
| Visionary (Spectator 9, Telepathist 8) | generated row, self-directed | 6 rows, 9 and 8 brewable | no Tingen church; Psychology Alchemists are the canon holder (generated.js gaps, shown) |
| Sun, Door, Black Emperor, Demoness, Justiciar, Moon, Red Priest, Hermit | none | 1 to 6 rows each | Sun is church-held abroad; the rest are Tarot Club and black-market goods (table, stated) |
| Error, White Tower, Hanged Man, Darkness, Twilight Giant, Mother, Abyss, Chained, Wheel of Fortune | none | none | Darkness and Twilight Giant are the Nighthawk and War God lines (table :185, :214, stated) |

**Data-only versus new verb, by mechanical test (shown: I ran `LOTM_BREWABLE_ROWS` through node; brewable rows are Fool 9, 7, 6, 5r, 4r to 0r; Door 8; Visionary 9, 8, 4r; Sun 9, 8, 7, 6, 5r, 4r; Demoness 7, 6; Black Emperor 8, 7; r = rite).** Data-only on the generated factory needs: Seq 9 and Seq 8 rows both `brewable`, no ritual, a dose key per row, and an authored overlay like `SPECTATOR_SPEC` (acts, texts, causes). Result: only **Sun** (Bard 9, Light Supplicant 8, no rite) passes beyond the Visionary line already built. Sun 7 and 6 are also brewable but the generator offers rungs 9 and 8 only (the rule in IMPLEMENTATION_DESIGN 1.3). Fool 7 (Magician) and 6 (Faceless) are brewable too, which matters for Klein after G2 (LG9). LG1 is data, but not one file: the overlay needs new source ids, two dose keys in the ids file and item specs (`rows.js` header; IMPLEMENTATION_DESIGN 1.3 proposes a generator to make it one literal). Black Emperor (Barbarian 8, Briber 7) and Demoness (Witch 7, Pleasure 6) have a brewable adjacent pair but no Seq 9, so they enter as a mid-start or trade chain, not a fresh ladder (inferred). Everything else is blocked by missing formula data in the notes, a source gap rather than a code gap.

| Gap kind | Pathways | What it needs |
|---|---|---|
| G-data (content only) | Sun 9-8 | one overlay row; check the Sun line's acting text and the church that holds it |
| G-source (read the book or fan wiki first) | Death 8+, Darkness all, Twilight Giant all, Paragon all, Door 9, Red Priest 8+, Tyrant 8 | formula materials for the pair. Darkness has zero formula data (table section 9, shown), which is the sharpest case: the Nighthawks' own line |
| G-state (needs a new state or gate) | Darkness (Sleepless: sleep and spirit-calming gate, table :185), Hunter (set traps), Moon (blood essence), Chained (form change) | a per-pathway rule the factory does not model; each is a small FD18 channel or an act gate (inferred) |
| G-ritual | every rung from Seq 5 up | ritual-as-gate (`lotm_rite_rows.js`, 768 lines of rows, no engine hookup per its header) |
| G-characteristic | Seq 4+ and Seq 3 swaps | characteristic ledger (IMPLEMENTATION_DESIGN section 3, stated; not built per BOOK_WORLD_GAPS) |

### 2.3 Which church or organization supplies a formula, and where it is sold

Stated by the table and institutions doc, not rechecked in play:
- Nighthawks (Evernight): Seq 9 Darkness and Death staff knowledge, merit gate; promotion exam by a senior deacon (one of nine), three-year wait (institutions F9, F18 :99, :123).
- Storm and Machinery teams: same pattern as an authored extension (rows.js comments, shown).
- Brokers: money and item held until verified (`book_world_lotm_broker.js:4-24`, shown). Lots in play are a frog, rare hairs and grave-dust ink only; no formula lot.
- Gatherings: formulas as currency (Door 8 for 450, Black Emperor 7 for 900; table :0.2, shown there).
- Psychology Alchemists: item barter, formula 3,000 for a Seq 6, council of seven (institutions F6, F13, stated).
- Church of Earth Mother and Life School: Mother and Moon lines (table :291, :307, stated).

Ingredient and price sources: `lotm_formula_rows.js` scales canon pounds by 5/230 so a clerk can reach the bottom rungs (`LOTM_PRICE_SCALE`, shown). The canon ladder is the table's 0.2. Seq 9 formula prices are unknown outside Corpse Collector (table :0.2; BOOK_WORLD_GAPS records no window found), so the generated factory's Seq 9 price is a proposal.

### 2.4 Acting, digestion depth and loss of control

- Acting method: the factory already counts acts per pathway (`book.lotm.<key>.acting`, digest 4 for Savant, Sailor; `LOTM_CC_ACTS` for Corpse Collector) (shown). Canon rates: month at fastest, half a year with acting, about three years without (backlog :56, stated). The player route has `waitMinutes:0` and ordinary NPCs use `ordinaryWaitMinutes` (rows.js:39-42, shown).
- Gap: digestion is one counter. Source says digestion needs the role's own laws and a list with adherence check, differing per drinker (table 0.1, "Cecima says every drinker's rules differ", stated). Backlog R1 owns this. Proposal D-LOTM-2: make the act rows tag a principle (already in `SPECTATOR_SPEC.principle`) and let R1 add an adherence fact, so any pathway row gets it with no per-pathway code (inferred).
- Loss of control: five stated causes (skip, wrong pathway, switching, residue, temptation) exist for every factory row through `LOTM_CAUSES` (shown). Residue and temptation are not wired (inferred). Pre-signs reversible about a week, full loss terminal (table 0.1, stated).
- Characteristics: none in play. Every dead Beyonder leaving one (deep dive L2) is the missing half of "where do potions come from at Seq 6+".

### 2.5 Combat and abilities, reconciled

Combat digitization has an owner (RC5). Open item for this lane: LCB1-LCB10 status is unchecked here. `book_world_lotm_bands.js` is on the notch scale and its header says LCB1-LCB3 (shown), so those look landed; run the gap check before dispatching. FD17 should be written as: "encounter frame = LCB6 window record plus situation (range, cover, light, objective) plus resolver choice", with LCB8 the tempo adapter as the first resolver. Abstract abilities: the existing 12 rows are all `body-faculty`, `fn` physical or perception (shown). What does not exist for LOTM: any row that targets what is known, what is likely or who acts first. Those are FD18 rows; first LOTM consumers are Spirit Vision (R3) and Clown prediction (G9, "brief, not every use", backlog :76).

### 2.6 LOTM gap list with unlocking foundation

| Code | Gap | Kind | Foundation | Window need |
|---|---|---|---|---|
| LG1 | Sun 9-8 on the generated factory | content only | content only | nice to have |
| LG2 | Formula data for Darkness, Twilight Giant, Paragon, Death 8+ | source reading | content only (read first) | needed before any Nighthawk or Machinery peer sheet |
| LG3 | Who holds what: per-person pathway and Sequence for the Tingen cast beyond the cast subjects already in `bands.js` | cast data | FD14 society sheet (institutions) plus FD15 positions (who is enrolled where) | needed from climax |
| LG4 | Acting adherence and role laws (R1) | new state | FD18 plus `lotm_act_engine.js` | needed now (G2 depends) |
| LG5 | Opponent sheets: bands exist (LCB3); ability notches and fight window do not (LCB5, LCB6) | resolver and window | FD17 plus LCB5/LCB6 | needed at climax |
| LG6 | Formula as a trade good (lots, gathering prices) | content plus price-map wiring | FD3 stock plus FD14 price bands | needed at G12 |
| LG7 | Characteristics and heredity | new ledger | FD3+ stock properties (characteristic as item), no new foundation | later (Seq 6+) |
| LG8 | Rituals as gates for Seq 5+ | engine hookup of `lotm_rite_rows.js` | FD16 events (a ritual is a scheduled, conditioned event) | later |
| LG9 | Sequence 7 for Klein (Magician; formula row brewable, no rite) | private pack, `setAdvancement` | `lotm_advancement.js` seam | needed after G2, not a new verb |

## 3. Harry Potter, deepened backwards

### 3.1 What exists (shown)
- Two lives: original school-term test life (70-day term, weekday charms and plant study, 2 spells, `book_hp_life_data.js:6-87`) and Harry's lead life (child, guardians, no wand, `book_hp_lead_life_data.js:14,24,46`). W1-W4 done and agent-verified (HP_WHOLE_WORLD_PLAN table, shown): cupboard day, letters, hut, Diagon Alley with per-holder purses.
- Seams: spell seam and HP adapter (fizzle line 40% minus 10 per mastery, a labelled dial; no command draws it, `hp_charm_bridge.js:4`, shown), Polyjuice brewing as a process row, holdings.
- Census: 100 spells, 14 potions, 14 subjects, 15 school roles, 32 textbooks (counts shown; first locators only).

### 3.2 Backwards from the next windows

| Window | What it needs | Exists? | Foundation |
|---|---|---|---|
| W5 platform and train | school-year calendar by order and events (G5) | lead life has fixed-months calendar profile (`:46`) with weekday flag; no school-year profile | FD8 `recurring_duties` plus G5, FD15 for enrolment |
| W6 Sorting, first days, potions master | locked-option Sorting (G9), a timetable, a Head of House, house membership | timetable only in the original life | FD15 (pupil position) and FD14 (school as institution) |
| W7 flying lesson, duel, Halloween, troll | house points (Merit shape), a danger frame without a power flag | none | FD17 (troll on a different resolver, as the root doc says), FD14 currency line |
| W8-W10 Quidditch, library, stone, climax | clue ledger, multi-actor climax | none | FD16 events plus FD17 |
| Classes in general | lesson to spell learn, practice to mastery | works for two rows via `lesson.js` and the seam | content: rows from the census; FD11 exists |

### 3.3 Spell census shape (proposal D-HP-1)
Do not author 100 rows at once. One spell row needs: name, origin kind (teacher, text, observed), wand and words formula, effect channel, failure dial, first locator, class or year (inferred from the Year-1 booklist). The census gives name, kind and first locator only; teaching scene, counter and finite relations are explicitly unrecorded. So the shape is a three-step ladder: (1) lessons Harry actually attends in book 1 become rows when W6-W7 reach them (Charms, Transfiguration, Defence, flying) as content; (2) spells shown in a scene (Wingardium, Alohomora, Lumos) become rows with `observed` origin; (3) the other census names stay as inspect-only records. This follows LSD216 (planning must not outrun playable change).

### 3.4 Variety of abstract abilities in HP
Charms and hexes are mostly "Shift odds" or "Change object state", which are ordinary effect rows. Hard ones: Legilimency (read people), Parseltongue (a language, not a power; G12 says use the language owner), Apparition (a gate at 17 with a 12 Galleon course, institutions doc :97, stated), Patronus, Unforgivables (a lecture gate at B4, stated), and prophecy (fate event). These are the FD18 rows HP shares with LOTM (Reveal a fact, Read people, Change an event). A second world on the same channels is the AD51 validation the root doc wants.

### 3.5 HP gap list

| Code | Gap | Foundation | Need |
|---|---|---|---|
| HG1 | School calendar for Harry's life (G5) | FD8 plus G5 | W5 |
| HG2 | House, Head of House, house points, Sorting | FD15 position (pupil, house) plus FD14 | W6-W7 |
| HG3 | Spell rows as content, first from lessons | content only plus spell seam | W6 onward |
| HG4 | Troll and duel on the encounter frame | FD17 | W7 |
| HG5 | Hogwarts as institution (rules, corridors, curfew, caretaker) | FD14 society sheet | W6 |
| HG6 | Owl post as delivery owner | existing news owner (LATER lane LSD446) | any |
| HG7 | Brewing class and potions master | existing `hp_brewing_*` plus FD15 | W6 |

## 4. Reconcile ledger for the root doc's FD table

| Root claim | Check | Result |
|---|---|---|
| FD18 unlocks LOTM "missing potions" | Mostly false: potions at Seq 9-8 are content and source reading; FD18 matters for abilities, not the potion rows | adjust |
| FD15 supplies "churches and orgs that hand out formulas" | The church rows already hold officer, examiner and wait; FD15 adds a uniform record and lets other pathways reuse it | compatible; the extraction is the benefit |
| FD14 for LOTM institutions | `institution_store` already in LOTM (root doc table); what FD14 adds is price bands and who-is-where for the cast, not the church mechanics | compatible |
| FD17 for LOTM combat | LCB1-LCB10 exist | compatible; consume LCB6, do not restart |

## 5. Light pass: MoL, paradise, primordial, Gu

### 5.1 Mother of Learning
- **What exists (shown):** 12 `book_world_mol_*` files (`ls`, shown) plus a 14,356-line `world_packs/book_mol_pack.js`, two starts (Zorian student, a Cyoria guest life; `book_world_mol_starts.js`, `book_world_mol_host.js:77`), an academy-access view with guest permit and a 30-day proposal term (`book_world_mol_access.js:1-3`), the restart via `mol_zorian_loop.js` and `loop_table.js`, attributed lore records (`book_world_mol_lore.js`), Taiven response as a combat-adjacent fact (`book_world_mol_actions.js:34`).
- **Biggest gap:** the academy as a society: badge, housing key, mentor quota, electives, job board and points (institutions doc W1, "not found: tuition, wage, meal price, points quota, term dates", stated). Second gap: retention across loops versus the visitor life (BF34, stated).
- **Foundation:** FD15 positions (student, with enrolment and a quota) and FD14 for the daily economy. The loop is a "bend time or save" FD18 channel, which MoL itself already implements.
- Need: content for the badge and quota first; no new engine.

### 5.2 Reincarnation Paradise
- **What exists (shown):** 15 `book_world_paradise_*` modules (count stated by BOOK_WORLD_GAPS 3.9; `ls` shows the files below): ecology (maintained coppice nursery), drying and field apparatus, environment inputs, carriers, campaign host and runtime, calendar and quest projection. Headers say "ORIGINAL" and "prototype": a paid craft and trade branch, not the soldier hub (`paradise_drying.js:1`, `paradise_actions.js:2-3`). Source is a machine translation with 8 chapter gaps (BOOK_WORLD_GAPS 3.9, stated).
- **Biggest gap:** the mission to return-settlement cycle (BF36: a paid service changes one mission approach; settled return keeps cargo, costs, receipts) and cause-tagged arbitrage (H8, price map unimported).
- **Foundation:** FD15 (contracted position: contract with a fixed end and payment on completion, the mercenary shape the root doc names) and FD17 (the mission as encounter) with FD3 stock for carried cargo. Paradise is the natural second consumer of FD15 beside Klein, because it already tracks visits, carriers and settlement.

### 5.3 Primordial Saint Sect
- **What exists (shown):** 4 modules, one slice: priced credit and the restart (loan, credit cap, carry rows), opt-in behind localhost and `?primordial_probe=1` (`book_world_primordial_domain.js:1-4`). No batch-read of the book; chapter range not recorded in the library index (BOOK_WORLD_GAPS 3.12, stated).
- **Biggest gap:** everything the sect is: ranks, resources, teachers, the daily loop. Plus the source-range record (docs-only).
- **Foundation:** FD14 (sect template from the root doc's list) and FD15 (member, disciple, rank via `faction_rank`). Needs source reading before content.

### 5.4 Gu (Reverend Insanity)
- **What exists (shown):** two lives, an academy novice (four Moon Orchid petals a day, five-day freshness, supervised work, starvation; `world_packs/book_gu_life.js:1-6`) and a keeper life with upkeep predictions from `living_upkeep.js`; both domains are read-validate only, with no saved slice or tick (`book_world_gu_domain.js:1`, `book_world_gu_keeper_domain.js:1-4`).
- **Biggest gap:** an acquired Gu with a production or utility consumer and a qualified unsupported-use case that transfer cannot duplicate (BF44 slice, stated); refinement as batches (H6).
- **Foundation:** FD18 for Gu as abilities with an owner, upkeep and a drawback (a row naming channel, cost, drawback); FD3+ for Gu as stock with properties (freshness, condition). Rewind is separately scoped (BF44), so do not assume MoL retention.

### 5.5 Cards, summarized

| World | Exists | Biggest gap | Foundation |
|---|---|---|---|
| MoL | two starts, restart, academy access view | badge, quota, housing, job board as an institution | FD15, FD14 |
| Paradise | craft, drying, carriers, visit campaign | mission to return settlement cycle | FD15, FD17, FD3 |
| Primordial | credit slice, opt-in | the sect itself, source range | FD14, FD15, source reading |
| Gu | academy and keeper lives, petals | acquired Gu with consumer and transfer rule | FD18, FD3+ |

## 6. More to consider: new angles (this round)

Disposition legend: ACT NOW = done inside this file; ACCOUNT FOR NOW = a design constraint to keep, no build; LATER = a build with level, effort and a done check.

| Code | Angle | Disposition |
|---|---|---|
| M1 | Root doc corrections RC1-RC9 (pathway count, ability count, factory test, HP files and calendar) should replace the root doc's per-world table | ACT NOW (recorded in section 1; the root doc itself is not edited by this lane) |
| M2 | (compatible variant of IMPLEMENTATION_DESIGN 2.3 and institutions EF4; the delta is a broker lot kind and a formula id a lot points at) A **formula as an item** is the real "other potions" unit: a formula sheet that can be bought, copied, mis-priced, forged, or learned by mediumship (backlog G2 "formula seen through mediumship", ch105 P025). It reuses the broker's hold-until-verified loop (broker header) with one new lot kind, and it unlocks the gathering trade (G12) without writing any new pathway | ACCOUNT FOR NOW: keep the formula row id stable so a lot can point at it. LATER: one broker lot kind "formula", sonnet medium, M. Done: a native run buys a verified formula and the brew bench lists it |
| M3 | **Pathway as a published ladder, supplier as the record.** Do not build 18 church rows. Build one supplier table (who holds which Seq 9-7 formula, wait, exam, price band) in pack data and let the church factory read it. Existing rows move onto it with saves unchanged. This is FD14 and FD15 specialized to LOTM. Mostly duplicates IMPLEMENTATION_DESIGN 1.3; the delta is reading holder, wait and exam from pack data | LATER: sonnet high, M-L. Done: sailor and savant rows regenerate from the table with byte-identical command ids (the existing golden test) |
| M4 | DUPLICATE of LCB3 and `bands.js` cast subjects. **Pathway sheet per cast person.** A cast person's pathway and Sequence is the input to bands, ability rows, observer reveal and characteristic drops. One data field on cast rows (already hinted by `LOTM_CAST_OBSERVERS` and LCB3) covers four consumers | ACCOUNT FOR NOW: the cast pack schema keeps a `pathway,seq` slot (spoiler tier applies, `valid from` per LCD8 refusal 4) |
| M5 | **A hostile reuses the player's ability row** (already true for cc, sv; `abilities.js:50`). So each new pathway's Seq 9-8 abilities pay for both the player and the opponent. That is the cheapest reason to add Sun and the Nighthawk lines before the climax | ACCOUNT FOR NOW |
| M6 | **Wrong-seat risk for HP spells.** A 100-row census of names would be worse than the LOTM button crowd (ABM4). Lessons gate which rows show, so the HP panel groups by what a lesson taught | ACCOUNT FOR NOW (ABM4 already states it; this makes HP the first test) |
| M7 | **Two-world check of FD18.** LOTM Spirit Vision and HP Legilimency share "perceive the hidden" and "read people". Writing both as channel rows in one doc, before code, would test whether seven channels are enough | LATER: haiku to extract, sonnet to merge, S. Done: a one-page table of 6-8 abilities per world mapped to channels, with any that fit none listed as FD18 misses |
| M8 | **Price anchors are the cheapest world-scale fix.** `lotm_price_map` is built and unimported; one reachable caller (a shop or broker price display) turns the G15 lesson into a pass, and FD14's price bands copy the shape for HP (Knut, Sickle, Galleon, already per-holder) | LATER: sonnet, S. Done: a shop line shows a price drawn from the map in a native run |
| M9 | **Mid-start chains.** Black Emperor 8-7 and Demoness 7-6 are brewable pairs without a Seq 9. A start "already a Seq 8 Barbarian" is cheaper than a ladder and fits the S6 "unregistered Beyonder" premise of the pathways deep dive | LATER: a start row, sonnet medium, S. Done: one start with its source grant and a stated cause if the player later changes pathway |
| M10 | **Sequence 9 formula price has no source window** (BOOK_WORLD_GAPS 218). A single source window would upgrade ten generated-row proposals from `I` to `T` | LATER: haiku reader, S. Done: one locator for a Seq 9 price outside the frog |
| M11 | **HP corridor rule as a first FD14 check.** "No magic in corridors between classes" (institutions F8) is a place rule with a caretaker enforcer; it tests whether FD14 can carry law of the small without a combat frame | ACCOUNT FOR NOW |
| M12 | **Paradise as the second FD15 consumer** (contract with a fixed end, paid on completion). Klein, Harry, and Paradise are three shapes (cleric job, enrolment, contract), which is the diversity AD51 asks for | ACCOUNT FOR NOW |

## 7. Suggested order for these gaps (proposal, no dispatch)

1. Correct the root doc's table with RC1-RC9 (docs only, whoever owns it).
2. LG2 and M10 source reads for Darkness and Paragon lines, plus Seq 9 price: haiku, bounded, content only.
3. LG1 Sun 9-8 on the generated factory after the source read confirms the acting principle and a holder.
4. M2 formula-as-lot and M8 price map wiring before the gathering trade windows (G12).
5. M3 supplier table when the second church row beyond Savant or Sailor is needed (not before).
6. HG1 and HG2 with W5-W6 as FD15 and FD8 arrive.
7. MoL badge and quota content (docs-sized) in parallel; Paradise settlement as FD15's second consumer.

## 8. Checks and gaps

- Counts from `RAW` (43 rows, 12 pathways) are from grep of the first column; the brewable count of 23 is the file header's statement.
- Brewable pairs come from running `LOTM_BREWABLE_ROWS` in node (shown). `bands.js` LCB3 status: `PATHWAY_LEANS` and cast subjects for Old Neil and Dunn exist (shown, `bands.js:31,101-102`); tests not run.
- Not checked: LCB1-LCB10 status, whether `lotm_advancement.js` pack is present locally, `home_school` role (appears to be the original village school, not HP), tests for any claim above.
- Not read in depth: MoL pack (14k lines), paradise campaign files, primordial panel, Gu keeper content.
- Hostile Beyonder source rows and sealed-secret IDs: none opened.
