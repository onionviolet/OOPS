# Reader B: cheat ideas across the docs, and their status (2026-10-10)

Scope: docs only, read 2026-10-10. Labels: SHOWN means I read it at the cited file:line; INFERRED means my reading or a count. Line numbers are as of this read. Several files (CHEAT_LIBRARY.md, SIMULATORS_AND_CHEAT_IMPLEMENTATION.md, USER_VISION.md, LIFE_SIM_NORTH_STAR.md) were being edited by other agents while I read, so lines may drift. No sealed secret file was opened or quoted. No docs/ file was edited except this one.

Paths are relative to `docs/` unless they start with `src/`.

Status key:
- **W** = Weibao's quoted direction (his words are in the doc).
- **A** = accepted in PROJECT.md or RULES_FROM_SCRATCH.md (rulebook accepted 2026-10-10).
- **P** = proposal by an agent, not accepted (rule 10).
- **R** = research only (notes about a source, no design).
- **Impl** = implemented in `src/`. I found none for any cheat card (see the code note below).

## 0. Code reality check (SHOWN by grep in src/)

- No cheat-card schema, family or hook exists. `grep -i cheat src/` returns only the dev-mode comment at `src/config.js:5` (`enable_dev_mode`, used at `src/main.js:7762`).
- Substrate the docs say a cheat could ride, all confirmed to exist: `createContentRegistry` with `sources`, `capabilities`, `rollTables` (`src/expansion_engine.js:297`), per-actor `sources: {}` (`:74`), `advanceSimulation` (`:582`), `previewScenarioRewind` and `rewindScenario` (`:661`, `:668`), `commitSimulationCommand` (`src/simulation.js:231`), `advanceSimulationBoundary` (`:449`), `src/capabilities.js`, `buildLifeHeirSave` (`src/life_experience_host.js:8`).
- Cheat-adjacent shipped content (INFERRED to be world content, not a cheat): Mother of Learning "independent visitor" branch (`src/book_world_mol_*.js`, labels are about Cyoria visitor terms, not a loop cheat), Paradise `book.paradise.contract.offer` (`src/book_world_paradise_host.js:79`), carrier transit previews (`src/backlog_expansion_transit.js:285`).
- The heir button still reads "Begin an heir · fresh body, one lesson" (`src/chronicle_ui.js:56`). The accepted "heir inherits what was left" rule (RULES_FROM_SCRATCH.md:12-45) is not built, and CHEAT_LIBRARY's death-menu card (C2) depends on it.
- `portableCarrierPolicy` strings in `src/feature_expansion_book_roster.js:385` are descriptive metadata only (RULES_FROM_SCRATCH.md:19-24).

## 1. Consolidated catalog

Owner = the doc I recommend as the single home (details in section 3). "Where defined" lists every doc with real content, not pointers.

| # | Family | Cheats and named items | Mechanic in one line | Status | Where defined | Rules touched |
|---|---|---|---|---|---|---|
| 1 | Death-menu regression, rewind, checkpoint | Primordial Saint Sect's Book (B15), Spring Autumn Cicada, Regressor's Tale regression, Returner's Clockwork, Echo Anchor card, You Have Died Again checkpoints, The Perfect Run save-point | Die or trigger, choose what carries, restart from an anchor | W (inspiration: USER_VISION.md:1072, 430), P | CHEAT_LIBRARY.md:24, 376-395 (Echo Anchor); CHEAT_COSMOLOGY.md:94-95, 480-486; TIMELINES_AND_DIVERGENCE.md:212-228 (B4); ABUSE_AND_LIMITS.md:84; LIFE_SIM_NORTH_STAR.md:1435-1452; BOOKSHELF_INSPIRATION.md:41; RUN_DEFINING_ADVANTAGES.md (temporal row) | 1, 5, 7, 9, 11 |
| 2 | Time loop, local reset | Mother of Learning loop, Circle of Inevitability daily reset, Déjà vu system | Repeat a bounded span, learn each pass | P (world content for MoL visitor branch exists, loop cheat does not) | CHEAT_LIBRARY.md:25; CHEAT_COSMOLOGY.md:93, 480-506; SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:288 | 2, 5, 7 |
| 3 | Time dilation, fast-time spaces | Renegade Immortal bead, pocket farm with fast time, Upload Labs away-time reserve | Spend more time than the world does | P | CHEAT_LIBRARY.md:32; CHEAT_COSMOLOGY.md:149 (pocket farm), 118; CHEATS_BY_WORLD.md:252 | 5, 7 |
| 4 | Foreknowledge, divination, prophecy | Knowledge of the future stock that goes stale, Dinah odds, Seed Cartographer, Noita seed tools, grades Guess/Forecast/Projection/True sight/Prophecy/Vision/Counterfactual | Act on what you know will happen; decays with divergence | W ("tell the future", USER_VISION.md:1501), P | SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:124-232; CHEAT_LIBRARY.md:451-467 (Seed Cartographer); TIMELINES_AND_DIVERGENCE.md:200-230; fanfic REPORT.md:310 (M17) | 5, 6, 10, 12, sealed |
| 5 | Simulators | Life simulator, dream run, headless run, spread, probe, forecast, rehearsal, shadow (modes); S1 story model, S2 forked engine, S3 estimates; B05, B16 | Run a compressed or forked life, return a reading, keep one thing | W (USER_VISION.md:1497), P | SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:61-122, 233-331; CHEAT_COSMOLOGY.md:146 (simple cheat); fanfic REPORT.md:312 (M22); BOOKSHELF_INSPIRATION.md:31 | 5, 6, 7, sealed |
| 6 | Selves and echoes | Perfect fight, G1-G9 generated selves, Hall of Selves card, shadow/worst self, ghost of past self (B3) | A generated or real other version of you demonstrates, spars or opposes | W (SELVES_AND_ECHOES.md:134), P | SELVES_AND_ECHOES.md:60-280; CHEAT_LIBRARY.md:543-558; TIMELINES_AND_DIVERGENCE.md:429-440; ABUSE_AND_LIMITS.md:86-92 | 5, 6, 11 |
| 7 | Clones, many selves | Blood Clone, five soul clones, B12 many selves, Han Sooyoung avatars | Several bodies at once with coordination costs | P | CHEAT_LIBRARY.md:38; CHEATS_BY_WORLD.md:45, 48, 83, 167; RUN_DEFINING_ADVANTAGES.md (multiple selves row) | 4, 11 |
| 8 | System with quests, shop, hub store | Solo Leveling system, Fated Villain system, quest system with stakes, system shops, hub store with tolls and tiers | Quests earn points, points buy things | W (north star 1277), P | CHEAT_LIBRARY.md:26; LIFE_SIM_NORTH_STAR.md:1318-1334; SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:292-294; fanfic REPORT.md:316 (M21); CHEAT_COSMOLOGY.md:101 | 2, 3, 6 |
| 9 | Accumulators, lotteries, graded traits | Celestial Forge, gacha/lottery, doubling draws (M14), graded trait entries (M13), talent lottery, achievement and title systems | Power on a schedule or by draw, banked reach, grades that evolve | P, R (fanfic) | fanfic REPORT.md:101-104, 167-188; CHEAT_LIBRARY.md:143-146; CHEAT_COSMOLOGY.md:145; SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:282-286 | 2, 6, 11 |
| 10 | Sign-in, daily intel, choice | Sign-in/check-in, daily intelligence, choice system, points from emotion, fate-change reward (M8) | Small reward per visit/day/decision/averted fate | P | CHEAT_COSMOLOGY.md:141-153; CHEAT_LIBRARY.md:27; fanfic REPORT.md:174; SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:287 | 7, 11 |
| 11 | Harvest, absorb, copy | Soul Eater, PowerOrigin, Skill Eater, Sharingan, download panel (B01), Bookmark, template shelf (M7), Authority of Gluttony | Defeat or observe, store a copy of what they had | P | CHEAT_LIBRARY.md:29-30; CHEAT_COSMOLOGY.md:97, 102, 108; RIVALS_IDENTITIES_AND_FATE.md:171-191 (theft catalogue); fanfic REPORT.md:174 (M7); CHEATS_BY_WORLD.md:91, 165 | 5, 11 |
| 12 | Multiplier return and teaching economies | 10,000x return, rebate multiplier (M23), disciple return, instant teaching, follower power | What you give or teach comes back multiplied | P (worked example in cosmology) | CHEAT_COSMOLOGY.md:139, 143, 197-236; CHEAT_LIBRARY.md:28, 38; SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:289 | 11 |
| 13 | Auto-growth and idle cheats | Auto-cultivation, effort always pays, perfect comprehension, reading growth, Earned Habit, Patient Furnace, Melvor/Increlution-style automation | Progress with no or little input | P | CHEAT_COSMOLOGY.md:142-144; CHEAT_LIBRARY.md:396-416, 499-513 | 7, 11 |
| 14 | Body-based | Body growth/evolution, daily revival (A Novel Concept), reserve bodies, body swap/possession, shapeshift, Instinct Inheritance | The body is the cheat; revive, adapt, swap | P | CHEAT_LIBRARY.md:42-43, 133-135, 485-498; CHEAT_COSMOLOGY.md:96, 104 | 4, 5 |
| 15 | Edits, debts, bargains, dice | Wishes, debt to the future, karma bank, contract and bargain, Loaded Dice, Fate Steward | Spend a quota, borrow, bargain, or override a roll | P | CHEAT_LIBRARY.md:31, 131-132, 514-542; CHEAT_COSMOLOGY.md:103 | 2, 6, 11 |
| 16 | Fortune and fate | Fortune Plundering, Curse Spear, Ye's protected fortune, luck-theft villain, anchored fate vs reserve luck | Steal, spend or protect luck and fate | P; D2a fate is "not settled" (north star 6020) | CHEAT_LIBRARY.md:30; RIVALS_IDENTITIES_AND_FATE.md:193-205; RULES_FROM_SCRATCH.md:62-80 (fate by book); CHEAT_COSMOLOGY.md:91 | 2, 3, 6 |
| 17 | Perception, meta, knacks | Appraisal eye, A.I. Chip analysis, Fourth Wall, absolute knacks, pure cheats, language, notice-me-not, charisma | Read first, or one absolute word that holds | W for pure/absolute (north star 1337); P | LIFE_SIM_NORTH_STAR.md:1335-1398; CHEAT_LIBRARY.md:125-152; CHEAT_COSMOLOGY.md:98, 166-171 | 6, 11, 12 |
| 18 | Storage, space, pocket worlds, crafting | Inventory space, dimensional imprint, pocket world, territory/dungeon core, duplication (copper mirror), perfect crafting, Traveler's Pattern Book | Store, grow or copy things outside the world | P | CHEAT_LIBRARY.md:33, 44, 128-130, 434-450; CHEAT_COSMOLOGY.md:147-153; CHEATS_BY_WORLD.md:43, 205 | 5 |
| 19 | Companions, summons, inheritance spirits | Ring spirit (Yan Ji), technique personas (B02), Shadow Extraction, heroic spirit summoning, inheritance tests | A resident or summoned helper with its own wants | P | CHEAT_LIBRARY.md:35-37, 137-148; CHEAT_COSMOLOGY.md:99, 112; CHEATS_BY_WORLD.md:110, 77 | 3, 5 |
| 20 | Patron gift terms | Gift, Digested, Matured, Lease, Loan, Lien, Leash, Burdened loan, Bound item | What can be taken back and by whom | W (cosmology 309), P | CHEAT_COSMOLOGY.md:307-336 | 5, 11 |
| 21 | Harmful and held-back cheats | Blessing, parasite, con, trap, debt, rival cheat, cursed gift; system held back by a powerful holder (fragment, leash, throttle) | The cheat wants something, or someone else controls it | W for harm (north star 1246) and held-back (4528), P | LIFE_SIM_NORTH_STAR.md:1244-1273, 4526-4620 | 6, 12 |
| 22 | Tiers, fusion, devour | Knack/Gift/Golden finger/Fate-class/Origin-class; devour, merge, upgrade by collection, reject | Cheats grow, eat or fuse | W (north star 1277), P | LIFE_SIM_NORTH_STAR.md:1275-1316; CHEAT_COSMOLOGY.md:15-21 (tier words are vocabulary, not rank) | 11 |
| 23 | Backing and portability | Soul, body, item, system, world law, patron, knowledge, concept; compat modes Works/Reread/Rechannel/Weakened/Blocked | What holds the cheat decides whether it travels | W ("fit them into our cosmology", cosmology 3-6), P | CHEAT_COSMOLOGY.md:39-82; LIFE_SIM_NORTH_STAR.md:1502-1527 | 2, 5 |
| 24 | Meetings and equalization | Meeting outcomes ignore..cascade; both winner rules; time-cheat kinds; verse equalization modes (None..Absolute) | What happens when two cheats or systems touch | W (cosmology 272, 465), P | CHEAT_COSMOLOGY.md:270-306, 379-536; LIFE_SIM_NORTH_STAR.md:2870-2890 | 2, 5 |
| 25 | Placed catalog (instances) | 25 placed protagonist cheats; about 71 more by world; 56 game rows across 32 games; 4 bookshelf entries | Per-cheat cards: feats, anti-feats, outside behavior | W ("consider each book world", CHEATS_BY_WORLD.md:3), P/R | CHEAT_COSMOLOGY.md:89-122; CHEATS_BY_WORLD.md:41-257 | 3 |
| 26 | Player-layer mechanics as in-world cards | Echo Anchor, Patient Furnace, Heirloom Compact, Pattern Book, Seed Cartographer, Rebirth Ledger, Instinct Inheritance, Earned Habit, Fate Steward, Loaded Dice, Hall of Selves, World Deeds | Save, offline, prestige, legacy, seeds as things a character holds | W ("turn them into idea cards", CHEAT_LIBRARY.md:360), P | CHEAT_LIBRARY.md:358-585; CHEATS_BY_WORLD.md:178-260 | 5, 7, 9 |
| 27 | Franchise busted techniques | JJK Limitless, Six Eyes, Ten Shadows, Mahoraga, body hopping, copy with spirit, cursed speech, Comedian, Projection, domains | Canon techniques as mechanics with cost, counter, info weak point | W/A (JJK PROJECT.md:72), P | worlds/jujutsu/WORLD_BRIEF.md:74-134; emergent/E8E_ADAPTATION.md; emergent/E8B_POWER_CATALOG.md:78-91 | 3, 11, 12 |
| 28 | Run-start premises and chain structure | Self-insert, SI-OC, mind sent back, JumpChain (budget, drawbacks, gauntlets, warehouse), ROB/benefactor, late-waking cheat, slot starts | How a cheat arrives and what a run starts as | R (shown by fan sources), P | research/fanfic/REPORT.md:24-60, 138-236, 297-320; LIFE_SIM_NORTH_STAR.md:1400-1432; RUN_DEFINING_ADVANTAGES.md; BOOKSHELF_INSPIRATION.md:65-71 | 1, 2, 5 |
| 29 | Enemies and hunters with cheats | NPC policy per family, rival regressor, who hunts cheaters, enemy reincarnators | Same cards from the other side | W ("how enemies would have cheats", CHEAT_LIBRARY.md:264), P | CHEAT_LIBRARY.md:262-357; LIFE_SIM_NORTH_STAR.md:1225-1242, 1720-1743, 5694-5721; ENEMY_PROTAGONISTS.md; RIVALS_IDENTITIES_AND_FATE.md | 3, 11, 12 |
| 30 | Abuse and limits | In-fiction abuse tools T1-T12, out-of-fiction exploit fixes F1-F10, "limits are adjectives" | Cheats get consequences, not removal | W (ABUSE_AND_LIMITS.md:32), P | ABUSE_AND_LIMITS.md:20-160 | 9, 11 |
| 31 | Trial-won cheats | Priam's revival, first-to-clear rewards, pick-of-three menus, difficulty never raised | A cheat earned in a challenge | P (audit of A Novel Concept) | LIFE_SIM_NORTH_STAR.md:5628-5692 | 3 |
| 32 | Cheat lifecycle | Dormant, awakening, learning, early use, growth, evolution, mastery, exposure, resolution | A cheat's arc inside a life | P | CHEAT_LIBRARY.md:213-260 | 7 |
| 33 | Implementation plan | Card schema fields; hooks onDayBoundary/onAction/onKill/onDeath/onRestart/onTravel/onObserve/onGift/onLevel; phases C0-C6; simulator slice; fanfic slice (late-waking cheat) | How to build it | P, not started | CHEAT_LIBRARY.md:90-103, 158-212; SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:256-312; fanfic REPORT.md:229-236 | 8, 9 |
| 34 | Superpower/comics meta-powers | Power Bestowal, Mimicry, Negation, Self-Resurrection as rare traits | Powers that touch other powers | R/P | research/comics/REPORT.md:67-70, 135-137 | 11 |

Counts, INFERRED from tables: CHEAT_LIBRARY.md has 21 families in the first table (lines 22-44) and 24 more (lines 127-152), matching its "45" at line 155. CHEAT_COSMOLOGY.md has 25 placed cheats plus 19 simple cheats. CHEAT_LIBRARY.md:16 says CHEATS_BY_WORLD holds "95 cheats", but its own tables hold roughly 71 plus the 56 game rows, so the headline numbers are loose.

## 2. Weibao's own words on cheats (each under 15 words)

| # | Quote | Locator | What it set |
|---|---|---|---|
| Q1 | "depends on the cheat, each is possible" | USER_VISION.md:16 | Cheats get any mix of options (A, PROJECT.md:51) |
| Q2 | "the 'golden fingers' or 'cheats' assosiated with them" | USER_VISION.md:522 | Start from treasures/opportunities inspired by book cheats |
| Q3 | "we can be inspired by regression books accordingly and more?" | USER_VISION.md:1072 | Regression as inspiration |
| Q4 | "World that moves around me, like those time travel or regression books" | USER_VISION.md:430 | Moving-world feel |
| Q5 | "Concepts like adaptation and othr busted stuff?" | USER_VISION.md:1359 | JJK busted techniques |
| Q6 | "Simple cheats like 100x systems." | CHEAT_COSMOLOGY.md:5 | Simple cheats are a family |
| Q7 | "The ranking is a cool idea and can be kept for funsies." | CHEAT_COSMOLOGY.md:13, 339 | Fun ranking kept, not a rule |
| Q8 | "maybe a concept of verse equalization?" | CHEAT_COSMOLOGY.md:272 | Verse equalization modes |
| Q9 | "the patron can give stuff that can't be taken back" | CHEAT_COSMOLOGY.md:309 | Patron gift terms spectrum |
| Q10 | "keep both for F4, F1, I guess it depends on how they work." | CHEAT_COSMOLOGY.md:465 | Both winner rules stay; no blanket time-cheat cancel |
| Q11 | "That's a type of gameplay unlocked by that type of cheat." | CHEAT_LIBRARY.md:3 | Cheat library |
| Q12 | "we can expand the cheat types and more." | CHEAT_LIBRARY.md:125 | 24 more families |
| Q13 | "consider how enemies would have cheats." | CHEAT_LIBRARY.md:264 | Enemies with cheats |
| Q14 | "yes turn them into idea cards." | CHEAT_LIBRARY.md:360 | 12 player-layer cards |
| Q15 | "more cheats and more? consider each book world accordingly." | CHEATS_BY_WORLD.md:3 | World-by-world catalog |
| Q16 | "Perfect fights and ideas like that can be a cheat" | SELVES_AND_ECHOES.md:134 | Any source can deliver a function |
| Q17 | "Nothing has to only work 'once', the power of adjectives is vast" | ABUSE_AND_LIMITS.md:32 | No fixed "once"; anti-abuse is low priority |
| Q18 | "a mini playhtough with some key decisions" (his typo) | USER_VISION.md:1497 | Simulator form |
| Q19 | "Shoudnt simulations(depending on the type) be able to tell the future?" | USER_VISION.md:1501 | Foresight grades |
| Q20 | "a system that was held back by a powerful character" | LIFE_SIM_NORTH_STAR.md:4528 | Held-back systems |
| Q21 | "I wont know whats so special about them myself" | PROJECT.md:84 | Hidden world specialness (A) |
| Q22 | "make sealing the standard rule for agents" | PROJECT.md:89 | Sealed secrets (A) |
| Q23 | "knowledge doesn't have to always cross unless something is done" | RULES_FROM_SCRATCH.md:61-68 | Knowledge needs a carrier (A, rule 5) |

Paraphrased directions (no quote marks in the doc, so not Weibao's words): cheats can be detrimental (LIFE_SIM_NORTH_STAR.md:1246); tiers, clean cheats, absorbing cheats and shops (:1277); pure cheats with no drawback and absolute knacks (:1337); rewind farming should be possible in some circumstances (:1435).

Accepted rules that bear on cheats: rule 1 anything is possible reasonably (RULES_FROM_SCRATCH.md:162), rule 2 each world makes its own rules (:166), rule 5 carriers (:179), rule 6 readings can be wrong (:184), rule 11 everything can be OP (:200), rule 12 outliers (:204). PROJECT.md lines 51-92 hold the accepted decisions. Nothing in PROJECT.md accepts any specific cheat, card, family or phase. Everything in section 1 is therefore W-direction plus P.

## 3. Duplicates and owner recommendation

| Topic | Appears in | Recommended owner | Others become |
|---|---|---|---|
| Regression, loop, checkpoint, rewind | CHEAT_LIBRARY (family 1, Echo Anchor), CHEAT_COSMOLOGY (placed rows, time kinds), TIMELINES B4, ABUSE per-system, north star rewinds, fanfic M18, SIMULATORS loop row, RUN_DEFINING, BOOKSHELF B15 | CHEAT_LIBRARY (card) plus CHEAT_COSMOLOGY "Time cheats by how they work" (collision) | One-line pointers. TIMELINES keeps only branch/ghost starts (B1-B3). |
| Simple cheats (sign-in, multiplier, copy, duplication, gacha, life simulator, inventory) | CHEAT_COSMOLOGY 135-171, CHEAT_LIBRARY families and 24 more, SIMULATORS 280-300, fanfic M4/M7/M14/M21/M23 | CHEAT_LIBRARY (loop, verbs, hooks); cosmology keeps only the "multiply one input, move the bottleneck" rule | Fanfic M-list keeps source evidence only. |
| Celestial Forge / accumulator / gacha | fanfic F4, F13, M4, M12, M14; SIMULATORS table; CHEAT_LIBRARY talent lottery; cosmology gacha | CHEAT_LIBRARY | Fanfic shows evidence. |
| Hub store / system shops | north star 1318-1334, fanfic M21, SIMULATORS "Hub store", cosmology Paradise rows | north star "System shops" until moved into CHEAT_LIBRARY | Pointer. |
| Pure cheats, absolute knacks | north star 1335-1432, CHEAT_LIBRARY "Absolute knack" and phase C1, cosmology 170 | CHEAT_LIBRARY (it holds the loop and build phase); north star text moves or links | Cosmology keeps the absolute-word rule only. |
| Harmful cheats, held-back systems | north star 1244, 4526; CHEAT_LIBRARY (holder/influence field proposed at north star ~4612) | CHEAT_LIBRARY card fields (`holder`, `influence`, `wants`) | North star sections link. |
| Fate and luck | CHEAT_LIBRARY family 11/Fate Steward/Loaded Dice, RIVALS 193-205, RULES fate table, north star D2a | RIVALS (mechanics of reserve/anchored fate) plus RULES (per-world fate) | Library cards cite. |
| Selves | SELVES_AND_ECHOES, Hall of Selves card, TIMELINES B3/G8-G9, ABUSE | SELVES_AND_ECHOES | Library card is a pointer. |
| Simulators and foresight | SIMULATORS (grades), cosmology simple cheat "life simulator", fanfic M22, TIMELINES foreknowledge | SIMULATORS_AND_CHEAT_IMPLEMENTATION | Others link. |
| Heir / legacy | RULES heir section (A), CHEAT_LIBRARY Heirloom Compact, north star heirs section, Rogue Legacy rows | RULES (accepted rule) plus north star heirs section | Library card cites it. |
| Player-layer game cheats | CHEATS_BY_WORLD game cheats (rows), CHEAT_LIBRARY 12 cards, cosmology pointer, Codex GAMES_REPORT | CHEAT_LIBRARY for cards, CHEATS_BY_WORLD for rows | Cosmology keeps pointer. |
| Abuse and limits | ABUSE_AND_LIMITS, SELVES "Abuse and cost", TIMELINES guardrails, north star rewinds, fanfic M15 | ABUSE_AND_LIMITS | Others link. |
| Meetings and equalization | CHEAT_COSMOLOGY, north star 2870 table, north star 1411 | CHEAT_COSMOLOGY | North star table is a pointer. |
| Catalog counts | LIBRARY:16 "95", CHEATS_BY_WORLD header "70", cosmology "25 + 70", codex note "71 rows" | CHEATS_BY_WORLD (state its own count) | Others drop numbers. |
| Run-defining advantages | RUN_DEFINING_ADVANTAGES (2026-10-01), BOOKSHELF families, DIRECTION_SYNTHESIS | Fold into CHEAT_LIBRARY "Who can hold it / how it arrives", keep as dated research | Mark pre-rulebook. |

INFERRED: the north star is 6,600+ lines and holds at least five cheat sections (tiers, pure cheats, harmful, rewinds, held-back) that the library now supersedes in scope. Moving them is a documentation task, not a design change.

## 4. Contradictions with the rulebook or accepted decisions

C1. **Fixed "once" limits vs the no-"once" direction (Q17).** SHOWN:
- LIFE_SIM_NORTH_STAR.md:5635 says "First to clear" rewards are one-time per world; :5640 lists "one-time rewards, no swapping after a reset" as guards; :1447 says the "first clear" pays once. All pre-date Q17 and read as fixed rules. Recast as a frequency adjective (once, per run, per world, never).
- RIVALS_IDENTITIES_AND_FATE.md:199, 203, 286: a charge "consumed once at commitment", a finite reserve "cannot be stolen twice", an inheritance cannot respawn on reload. The reload part is save integrity (rule 9) and fine. "Cannot be stolen twice" is a world adjective, not a law.
- worlds/jujutsu/WORLD_BRIEF.md:77 "once-per-fight overcharge", :74 "One per body" for innate techniques. INFERRED: acceptable as canon dials, but PROJECT.md:72 says innate techniques "can come by any route", so "one per body" should be a default for the canon era only.
- CHEAT_LIBRARY.md Echo Anchor "One anchor at a time, or a charge per return" and Fate Steward/Loaded Dice limits are already worded as alternatives; fine.
- Source-sourced limits (Kairos "one use", Skill Eater "three extractions a day", Shadow Extraction "three attempts") in CHEATS_BY_WORLD and cosmology are book facts (rule 3), not conflicts.
- SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:247-255 and ABUSE_AND_LIMITS.md "Limits are adjectives" already follow Q17: the model for the fix.

C2. **Global defaults vs rule 2 (each world makes its own rules).** SHOWN:
- CHEAT_COSMOLOGY.md:89 column "Outside it (default)" and :281 "The default for most worlds" (equalization None). RULES_FROM_SCRATCH.md:166 says read "default" as placeholder until the world defines it. The compatibility modes are inferences (I) for most rows.
- CHEAT_COSMOLOGY.md:170 and LIFE_SIM_NORTH_STAR.md:1403 "Proposed default: one sentence plus an exclusion list" for pure cheats, and "by default a perfect cheat doesn't make friends" (north star ~1347). Keep, but the exclusion list is a per-cheat choice.
- TIMELINES_AND_DIVERGENCE.md:216-220: regression "is a power, priced like one", memory only by default. worlds/LORE_AND_CONTINUITY.md:202 "Death is final by default"; :78 "No live rollback is the default"; worlds/CAMPAIGN_FRAMEWORK.md:157 "by default unique rewards are not minted again". These are cross-world defaults; fine as placeholders, but cheats are the stated exceptions "at a cost", which conflicts with pure cheats (C4).
- LIFE_SIM_NORTH_STAR.md:2879 "Override: the higher tier or deeper origin wins" and :1411 "higher tier wins": Weibao kept both winner rules and said neither is the default (CHEAT_COSMOLOGY.md:465-480). The north star text still states tier wins as the first answer.

C3. **Rule 5 vs "Knowledge always travels".** CHEAT_COSMOLOGY.md:52 backing table says Knowledge "Always travels"; the same file at :131 says "Knowledge travels only when something carries it", and RULES_FROM_SCRATCH.md:61-68 and rule 5 say it needs a carrier. Internal contradiction; the table row should read "travels with the person who holds it, if the soul or a record carries it".

C4. **Mandatory price vs pure cheats and rules 11-12.** SHOWN: north star :1337 pure cheats "no price at all, not even a hidden one" (Weibao direction). Against it: JJK brief :122 each busted technique needs "a cost the engine charges"; north star :5702 "Every enemy power has a tell, a counter and a cost"; TIMELINES :216 regression must cost something; ABUSE_AND_LIMITS Part 2 tools; CHEAT_LIBRARY fairness says each enemy cheat has at least one tell. INFERRED: the costs are meant as defaults. The docs never say pure cheats are exempt from the tell/counter/cost checks.

C5. **Jumpchain "unfit powers" vs rule 11.** fanfic REPORT.md:197 (M15) lists endless revival, consequence-free time travel, taking powers from other worlds, travel at will as chain-breaking and says they must be outliers, end rewards or "sealed behind a heavy cost". Rule 11 says everything can be OP and PROJECT.md:51 says keep every reasonable option reachable. M15 is labelled a review checklist, but "must be" is stronger than the rulebook allows.

C6. **Rule 6 (readings can be wrong) vs truthful readers.** SHOWN: SIMULATORS_AND_CHEAT_IMPLEMENTATION.md:154-156 grades "Projection" ("the actual future of your path") and "True sight" ("the actual future, including things you have not discovered"). The doc adds fog and discovery stages (:186-191), so it is mostly reconciled, but the grade names promise exactness. Also CHEAT_LIBRARY "Analysis", "Appraisal eye" ("Read everything first") and "Meta" families list no accuracy/lie dial, and the library's `ui` field makes a status window the main screen with no "can be wrong" field. Add an accuracy adjective to the card schema.

C7. **Sealed secrets (AGENTS.md "Sealed secrets").** SHOWN protections: SIMULATORS :106-122, :186-191 (reports must not print a sealed truth), WORLD_SECRETS stages. Gaps (INFERRED):
- The cheat card has `observers` and `state` but no knowledge-filter field; a card's lore field, a cheat's real backing and `holder` (north star ~4612) are exactly the truths a cheat-discovery arc hides. CHEAT_LIBRARY progression stage 1 ("dormant or hidden") needs the card to carry a sealed truth and a surface.
- Phase C6 "library browser for known cheats" (CHEAT_LIBRARY) lists "met, held or rumored"; it needs the discovery-stage filter.
- Seed Cartographer (:451) and Dream "keep an item/clone/companion" (SIMULATORS :243-244, "natural sealed-secret material") can leak a sealed truth if the model reads the true seed.
- The fanfic slice (:229) says the late-waking cheat is "sealed until it fires", the right pattern, but no doc says who may see the cheat's truth in chat. AGENTS.md covers agents; refer to cheat truths by ID in any report.

C8. **Anti-cheat vs "very low priority".** ABUSE_AND_LIMITS.md:32-34 says part 1 is low priority, then lists F4-F7 (run ids, checksum labels, clock-tamper checks). Memory note solo-player-no-once-limits says do not propose tamper protection beyond save integrity. Not a rule break, but the list reads as a plan.

C9. **Library vs accepted heir rule.** CHEAT_LIBRARY C2 "death menu on the heir pipeline" assumes the accepted "inherit what was left" heir, which the build does not do (`src/chronicle_ui.js:56`). The library flags it needs Weibao's go. No conflict, but a dependency.

C10. **Count and anchor drift.** CHEAT_LIBRARY.md:16 "95 cheats"; the tables hold about 71 plus game rows. USER_VISION.md:1503 links `SIMULATORS_AND_CHEAT_IMPLEMENTATION.md#telling-the-future-2026-10-10`; the heading exists now (:124), so the link works. The north star says 21 families (:4510), the library says 45 (:155): both true at different times.

## 5. Gaps: mentioned but never designed

G1. **Cheat card as data.** Fields are listed in prose (CHEAT_LIBRARY.md:158-212) but no schema, validator, save field or migration exists; cosmology Open list says "a data format ... when building starts" (:238-245).
G2. **Original (public-build) siblings.** CHEAT_LIBRARY says every book-derived card gets an original sibling; none is written except the 12 player-layer cards.
G3. **Cheats the notes don't cover.** CHEAT_COSMOLOGY.md:238-245 names Worm's vials and rewind, The Perfect Run, Cradle, The Wandering Inn, later Solo Leveling. Worm rows exist in CHEATS_BY_WORLD.md:96-103; others partial.
G4. **Card per cheat.** Cosmology holds condensed rows; "Full cards for each cheat" is open.
G5. **Quiet cheats and screen budgets.** "Stacking cheats stacks loops" is noted, no UI budget or panel rule beyond "shared panels".
G6. **Awakening triggers.** Library lifecycle names triggers (first death, age, ritual); only the fanfic slice (M5) has a concrete one.
G7. **Cheat acquisition economics.** Shops, trials, theft and gifts each exist separately; no table says what a life's chance of holding a cheat is, or who gets one at birth. North star :1242 says the player's cheat is "one origin among many, not a default" with no distribution.
G8. **Loss and removal.** "Losing a cheat removes its loop" (library) and "removing, taming, starving, selling" (north star :1268) have no verbs or states.
G9. **Cheats across lives.** Backing says who carries; no doc defines what a cheat does to the heir (the Heirloom card is generic).
G10. **Cross-cheat UI for NPC-held cheats** ("NPC use teaches the player") has no observation mechanic beyond the observation contest elsewhere.
G11. **Simulator costs and grades** are palettes; no chosen first grade beyond the home-world slice.
G12. **Status window / appraisal accuracy** (see C6) has no dial.
G13. **Fate (D2a)** is explicitly unsettled (north star ~6020), yet five library families (fortune, Fate Steward, Loaded Dice, Wish, Divination) depend on it.
G14. **Comics/superpower meta-powers** (comics REPORT.md:135-137, M4) are not mapped to cheat families or cards.
G15. **Gamer-system fics in comic worlds** not found (fanfic REPORT.md Gaps); **Chinese system prices and caps** mostly unread (same Gaps list).

## 6. Open questions

1. Q1 (for Weibao). Should the existing "first clear is one-time" rules in the north star (C1) become adjectives, or stay as the Priam-book facts they were taken from? I propose adjectives with book facts kept inside the A Novel Concept world.
2. Q2. Do the "cost, counter, tell" checks (JJK brief, enemy powers) apply to pure cheats and outliers? Today the docs say both.
3. Q3. Fix the cosmology knowledge row (C3) to match rule 5?
4. Q4. Which three cards come first? Library proposes death-menu regression, quest system, companion spirit; SIMULATORS proposes a home-world "dream of the coming year"; fanfic proposes a late-waking cheat with a three-entry pool. These are three competing first slices, none authorized.
5. Q5. Does projection/true sight accuracy follow rule 6 (an accuracy adjective per grade), or is "true sight" exact by definition (C6)?
6. Q6. Should the north star's cheat sections be moved to CHEAT_LIBRARY (section 3)?
7. Q7. Do the 12 player-layer cards (Echo Anchor and others) count as accepted "types of cheat", or only as idea cards? Weibao said "turn them into idea cards" (Q14), so P.
8. Q8. Which of the three Mother-of-Learning facts should the MoL world implement first: the actual loop (cheat) or the visitor-only branch already shipped?
9. Q9. Sealed-secret handling for cheat truths: who authors the surface text, and should card `lore`, `holder` and `backing` be marked sealed fields by default?
10. Q10. Should RUN_DEFINING_ADVANTAGES (pre-rulebook, 2026-10-01) be marked superseded by CHEAT_LIBRARY for the acquisition axis?
