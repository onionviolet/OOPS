# Mother of Learning: whole-source coverage census (WA49), 2026-11-03

Status: proposal and research table (AD32). Nothing here is accepted, and no code, pack or rule changed. Task: WA49
([rule](../../WORLD_ABSORPTION_RULES.md)) for the held MoL text against the built MoL files. Family names describe
mechanisms, not plot, and no source text is quoted. Locators use the merged shards' form `en b1 cN pK` (c-number is the shard's
chapter index, 1-106).

## What this is, and what it is not

- **Reuse, not a new read (AU2 budget: 0 readers, 0 tokens spent on the epub).** The held text is the Source Library record
  `e53f95695730` (Mother of Learning, nobody103, EPUB, 110 parts; `scripts/library_coverage.py --series "Mother of Learning"` confirms it, no
  compilation duplicate). The whole book was already read and merged: 106 shards, 7,282 census rows, 2,309 registry ids, 780 lead
  scenes, 1,063 unique rule ids ([merge report](../../research/READING_GAP_MAP_2026-10-28.md), private folders
  `docs/research/novels/mother-of-learning/private/{wb8-merged-2026-10-30,wb-families}`, gitignored). A Luna pass already assigned every
  rule id a family (`wb-families/out_all{a,b}.tsv`, taxonomy `gm/dispatch/sonnet-wave-2026-10-30/WB_TAXONOMY.md`). This census joins those
  labels to the built files; it re-reads nothing. Earlier MoL notes ([W4 census](../../research/novels/mother-of-learning/passes-2026-10-23/W4_MOL_census_2026-10-24.md),
  [systems deep dive](../../research/novels/mother-of-learning/SYSTEMS_DEEP_DIVE_2026-10-10.md)) were checked first and are not repeated.
- **Built side = a visitor world, not Zorian's life.** `src/world_packs/book_mol_pack.js` (13,149 lines), `src/book_world_mol_*.js`
  (11 files, 490 lines) and the [WORLD_BRIEF](WORLD_BRIEF.md) freeze one independent-visitor branch in third-year Cyoria, chapters 1-20
  patterns, with the loop, festival invasion, marker and soul work explicitly out of scope. Nine native people, seven locations, one quest.
  Every host command carries `actorId: "player"`. So "has seam" below means a general engine seam exists and the visitor uses it; it does
  not mean Zorian's seat can use it.
- **Labels.** *Has seam*: a shared seam exists and a built consumer reads it. *Content gap*: the seam exists, rows are missing.
  *Mechanism gap*: no seam or consumer for the mechanism in the MoL host. *Unmapped*: no family owner yet. Several rows carry two labels.

## Table 1: rule families, in Zorian's path order (WA49)

Counts are unique rule ids / rows. "GM" is the row in the [reading gap map](../../research/READING_GAP_MAP_2026-10-28.md). Order follows
the lead's path: opening and school life, then learning, then making and field work, then the loop-handling and late-journey families.

| # | Family (mechanism) | Ids / rows | Chapters (first, median, last) | Sample ids with locators | Built consumer (visitor seat) | Label | GM |
|---|---|---|---|---|---|---|---|
| 1 | Ordinary life: housing, attendance, school routine (LIF) | 22 / 22 | 1, 25, 97 | `mol.custom.academy-absence-letter` c27 p32; `mol.custom.academy-evacuation` c40 p183 | `book.mol.house`, `guest_room`, `meal`, household jobs | has seam, content gap | GM22 |
| 2 | Institutions, access, enrollment, mentorship (ORG) | 43 / 45 | 1, 30, 98 | `mol.institution.academy-housing` c1 p166; `mol.organization.silent-doorway-adepts` c36 p48 | `book.mol.guest_pass`, `admission`, library/workshop/court permission (`book_world_mol_access*`) | has seam (guest pass); content gap; a student's standing is a different seat | GM6, GM22 |
| 3 | Law, discipline, permits, wards as rules (LAW) | 113 / 118 | 1, 43, 104 | `mol.law.dungeon-permit` c12 p82; `mol.law.academy-expulsion` c61 p96 | permission checks in the access leaf just; no hearing, permit or discipline | content gap (seam exists in GM23), mechanism gap for hearings | GM23 |
| 4 | Customs, etiquette, daily practice (CUS) | 63 / 63 | 1, 53, 106 | `mol.custom.black-room-booking` ; `mol.custom.certification-seal-test` | `book_world_mol_lore` lines just | content gap | GM22 |
| 5 | Prices, wages, job points, contracts (ECO) | 13 / 13 | 2, 39, 81 | `mol.custom.job-points`; `mol.custom.caretaker-spending-permission` c56 p54 | `book.mol.crowns` purse, academy shop stock | has seam, content gap | GM4, GM22 |
| 6 | Spells and set casting, with a reserve (SPL) | 188 / 358 | 1, 40, 106 | `mol.spell.magic-missile` c2 p170; `mol.spell.simulacrum` c26 p199 | `study_invocation`, `study_formula`, `formula_operator`, `lamp` (one beginner chain) | has seam, content gap (5 of 188), mechanism gap: efficiency discount (ZS2), watch-once learning (ZS4), cast-by-formula pacing | GM8, GM40 |
| 7 | Methods of practice that advance a faculty (ACT) | 35 / 47 | 1, 23, 89 | `mol.ability.basic-three` c2 p181; `mol.ability.north-finding` c13 p126 | `book.mol.control_drill` (receipt, not a band) | has seam (practice), content gap | GM8, GM25 |
| 8 | Rank and advancement (ADV) | 1 / 1 | 60, 60, 60 | `mol.custom.staggered-advance` c60 p9 | none | content gap; MoL has no rank ladder, just staged mastery | GM13, GM25 |
| 9 | Making from recipes: golems, traps, alchemy, formula crafts (MAK) | 130 / 150 | 2, 39, 104 | `mol.craft.spell-formula` c2 p169; `mol.craft.golem-making` c29 p94 | `assemble_lamp`, `compile_notebook`; craft engine is general | has seam, content gap (lamp just) | GM25, GM17 |
| 10 | Powers used in the field, combat and utility (ABL) | 89 / 117 | 2, 58, 105 | `mol.ability.telekinesis` c38 p6; `mol.ability.pocket-dimension-creation` c65 p27 | `taiven_combat`, `hatch_encounter` (combat is below floor per PROJECT.md) | content gap, mechanism gap: teleport with visited-place and safe-after interval (ZS11) | GM26 |
| 11 | Travel, gates, teleport devices (TRV) | 15 / 17 | 4, 66, 92 | `mol.item.recall-rod` c37 p69; `mol.other.dimensional-gate` c46 p128 | `book.mol.arrival` just | mechanism gap | GM31 |
| 12 | Dated events and clocks (CAL, plus 411 calendar/clock registry rows) | 1 / 1 (+411 registry) | 14 | `mol.custom.restart-lightshow` c14 p1; storm on the first day of every restart (`mol.other.cyoria-restart-storm` c27 p39) | one local calendar (`native` leaf) | mechanism gap: day-indexed events and a fixed end date | GM18 |
| 13 | Divination, scrying, tracking (DIV) | 31 / 40 | 4, 29, 100 | `mol.spell.divination` c20 p53; `mol.rite.marker-tracking` | none (0 hits in the built files) | mechanism gap in MoL; seam exists in the LOTM pack, LOTM-shaped | GM27 |
| 14 | Mind and soul effects: shield, sense, probe, memory, soul perception (MND) | 140 / 254 | 4, 46, 106 | `mol.ability.mind-magic` c27 p58; `mol.spell.mind-blank` c23 p20 | none (no mind-magic command; `temporal_study` is a timing read) | mechanism gap; 5 worlds ask for it | GM29 |
| 15 | Who knows what, secrecy, rumor (KNW) | 8 / 8 | 17, 57, 97 | `mol.custom.anonymous-report` c51 p74 | `book.mol.attention`, `forecast` (partial) | has seam (people knowledge), content gap | GM3, GM35 |
| 16 | Personas, illusion, disguise (IDN) | 8 / 21 | 16, 77, 92 | `mol.spell.illusion` c16 p8; `mol.ability.going-dark` c23 p24 | none | mechanism gap (small); LOTM owns the persona seam | GM24 |
| 17 | Rites, summoning, blood and gate rituals (RIT) | 57 / 83 | 2, 61, 106 | `mol.rite.blood-magic` c15 p130; `mol.rite.enhancement-ritual` c2 p111 | none in the MoL host | mechanism gap here; LOTM ritual lane is the seam, weak outside LOTM | GM28 |
| 18 | Dangerous artifacts and their side effects (ART) | 43 / 43 | 1, 60, 103 | `mol.item.dead-mans-switch`; `mol.item.living-metal` | `book.mol.cube`, `ink`, `lamp` are benign items | content gap, mechanism gap for side effects | GM33 |
| 19 | Creatures as actors (CRE) | 9 / 10 | 1, 46, 105 | `mol.ability.taramatula-bee-magic` c66 p70 | `hatch_scavenger` | content gap; combat side is outside the seat | GM39 |
| 20 | Places with access rules (PLC) | 5 / 7 | 50, 61, 73 | `mol.other.black-room` c50 p74; `mol.other.black-room-chamber` c61 p129 | none | mechanism gap: a time-dilation room that spends from the loop budget (see row 21) | GM22 |
| 21 | **Time loops and resets** (own slug, plus loop-shaped ids filed elsewhere: PLC Black Room, OTH temporary-loopers c89 p44, ABL expulsion c55 p81) | 31 / 117 (+7 folded in) | 5, 59, 106 | `mol.reset.time-loop` c6 p3 (56 rows); `mol.reset.restart` c13 p3 (17 rows); `mol.law.power-budget` c55 p91; `mol.other.notebook-transfer` c78 p133; `mol.rite.temporary-looper-conferral` c105 p14 | `loop_table.js` row in `book_world_mol_access.js:36` (visitor seat, strings just); `harm_loops.js` has no MoL row | **mechanism gap** on the Zorian seat: see [seam note](RETENTION_RESET_SEAM_2026-11-03.md) | GM11, GM15 |
| 22 | Large-scale conflict (WAR) | 2 / 2 | 9, 28, 28 | `mol.institution.academy-warding` c9 p56 | none | outside the visitor seat; unmapped for Zorian (the month's end event, see plan) | GM38 |
| 23 | Gatherings and meetings (GTH) | 1 / 1 | 87 | `mol.custom.meeting-venue` c87 p152 | none | unmapped (LOTM-just family) | GM30 |
| 24 | Unclassified (OTH), minus the loop-shaped ids above | 15 / 15 | 22, 64, 106 | `mol.other.decoy-operation` c72 p92; `mol.other.orb-deployment` | none | unmapped; check before trusting | none |

Rows not listed (COR, FTH, LNG) are 0 ids in MoL.

Reading it: the visitor build covers rows 1, 2, 5, 6 and 9 thinly (one formula chain, one household, one pass) and the loop is a
deliberate non-goal there. The families that most change a Zorian life are 6, 7, 9 (learn, practise, make), 12 (a dated month), 14
(mind and soul work), 13 (divination) and 21 (the loop). Rows 6, 9, 3 and 2 are shared seams (GM40, GM25, GM23, GM22) that should be
built as typed rows, not MoL code. Row 21 is the just family with no MoL consumer that three worlds need (MoL 31, Perfect Run 33, COI 10 by slug).

## Table 2: non-rule rows (people, places, services, news, customs)

From the merge report (`extras` counts and registry kinds). Built counts from the [WORLD_BRIEF](WORLD_BRIEF.md).

| Row kind | Source rows | Registry ids | Built | Label | GM |
|---|---|---|---|---|---|
| People (routine, relations, knows) | 1,703 | 175 persons | 9 native people (Imaya, Ilsa, Ibery, Nora, Xvim, Taiven, Kael, Zorian-as-person, one opponent) | content gap; recurring windows and per-pair attitudes are mechanism gaps shared with HP | GM1, GM2, GM3, GM20 |
| Places | 1,206 | 212 places; 130 in the affordance matrix | 7 locations | content gap | GM19 |
| Services | 422 | n/a | academy desk, library, workshop, bread, shop stock | has seam, content gap | GM5, GM6 |
| News and dated notices | 890 | 180 calendar + 231 clock ids | one local calendar | mechanism gap (day-indexed list) | GM18 |
| Customs | 874 | n/a | lore lines | content gap | GM22 |
| Prices (typed) | n/a | 7 price ids | `crowns` purse | content gap | GM4 |
| Measures (reserve, magnitude, counts) | n/a | 597 measure ids | `personalMana` assessment, no efficiency | mechanism gap: cost per spell is not stated in numbers (W4 census) | GM8 |

## Findings

- **C1.** The built MoL is a branch for a non-looper. The census says the biggest family for Zorian (row 21) has no Zorian-seat
  consumer, and the next ones (12, 13, 14, 17) have none either. A Zorian slice is therefore not a content slice; it needs the
  seam in the [seam note](RETENTION_RESET_SEAM_2026-11-03.md).
- **C2.** The loop family looks small by count (31 ids) because a loop is one rule with many facets. The 117 rows hold the same few
  facts (month length, what survives, what the marker does) many times; rows 6 and 12 give the dated part.
- **C3.** 12 and 14 are limited by the text: the W4 pass found no calendar dates and no numeric mana costs, so those cells stay banded
  proposals (WA35), not facts.
- **C4.** Nothing in the loop family needs an unread volume. The just open source question is already named in the deep dive: how a
  solo death-restart squares with the other looper's (the loop-table row for the visitor says "canonical loop read pending").

## Checks

| Check | Result | Gap |
|---|---|---|
| `scripts/library_coverage.py --series "Mother of Learning"` | 1 held record, EPUB 1.9 MB, 110 parts, not a compilation | container facts just |
| Family counts joined from `wb-families/in_all*.tsv` and `out_all*.tsv` (script run in scratchpad; totals equal `tally.json`) | 24 family codes, 1,063 rule ids | family labels are one Luna pass, unaudited here |
| Built coverage by `grep` of `book.mol.*` ids and keywords in `src/world_packs/book_mol_pack.js` and `src/book_world_mol_*.js` | consumer names above | keyword grep shows presence, not behavior; no browser run |

Sealed scenes in the lead run (93 of 780) were not read for content; no plot outcome is stated here.
