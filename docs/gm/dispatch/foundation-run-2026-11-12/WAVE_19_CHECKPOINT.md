# Wave 19: foundations with a consumer (2026-11-14)

First wave of the resumed run under the [orientation](RUN.md#orientation-for-the-resumed-run-2026-11-14) (OR1–OR10). Coordinator: the foundation-run session on Opus, started from "Opus chats and UI refinement". Usage at orientation: 5-hour window 54% (resets 22:50 UTC), weekly all-models 62% (stop at 80%).

```receipt
build: clean_bundle.sh from 126de3278 plus lane 1's paths
route: DEV fixture ri-fang-yuan-wild-gu, then the real "Refine the wild Gu" command
state: lane 1 committed (815616b18, b7c8a2836); Harry Phase B parked (not landed)
viewport: 1920x1080 headless Chrome
persistence: save, reload and a second fresh origin: refined Gu kept
tests: focused 31 of 31; lane test:changed 4,992 of 4,994 (2 skipped); full npm test on b7c8a2836 (archive tree) 7,622 of 7,635, 11 skipped; the 2 failures (rule_routes, ui_contract) need git and pass 6 of 6 in the checkout. Chrome re-walk on the committed bundle: Done line shown, refined Gu kept through reload and a second origin, no page errors
review: agent-verified, not human-reviewed
```

## Input identity

Orientation on master `601cf3f8b`. Lane 1 is committed from `126de3278` (wolf tide first, at `815616b18`, on `66f9b67e2`), with fight_terms.js and the kill rule already in HEAD (RWT15). Dirty and not this wave's: the daily-loops lane's Klein wage loop (`src/book_world_lotm_domain.js`, `_host.js`, `_ui.js`, `src/perspective_controls.js`, untracked `src/book_world_lotm_wage.js`, `tests/lotm_wage.test.js`), a wolf-size edit in `src/tempo_lead_fights.js` (owner asked), docs edits by other chats, untracked batch-reading plans. None are touched by this wave.

## Candidates and how each is covered

| Candidate | Covered by | Why this shape |
| --- | --- | --- |
| Fang Yuan's Gu day and fight: the patrol's wild Gu has no reader; refinement uses the wolf eye | Lane 1 | The patrol already drops the item (69a9ddda6). Refining it through `gu_refinement.js` / `refinementLine` makes his life the shared engine's second consumer (FND5) instead of another hand-written item pack. Wolf eye "kept for refinement" is Weibao's 2026-11-14 wolf-parts direction. |
| Creatures behind the wolf tide | Lane 1, engine-only, consumer pending | `creature_populations.js` has one live use (`frontier_bow.js`). A wall table gives the patrol weights and the hunt foe one source. The hook lines are in daily-loops' and combat's files (OR6), so it is not counted as playable until they land. |
| Harry's spell practice and the duel's spells | Lane 2 (pending file answers) | Practice exists for the levitation charm only; the duel's Locomotor Mortis and Petrificus Totalus have fixed `hit` dials and no practice of their own. Per-spell practice keyed by the `spell_pack_hogwarts.js` rows (B1 locators) is the shape; a levitation-to-jinx carry is an invented rule and stays out. |
| Klein's potion digestion by acting | Lane 2 (pending) | Digestion, `acted()` and the ladder display exist. The wage loop is not acting as the Seer, so it gets no credit. The slice is a second in-role act through `acted()`, such as a divination done for someone else, if the route is reachable from his day. |

OR5 (Gu runner debt): not touched this wave. The five remaining direct `resolveGuActivation(` packs (`gu_beam_condensation`, `gu_giant_hand_working`, `gu_obscured_secret`, `gu_vital_advancement`, `gu_ward_break`) do not touch refinement of rank-one kinds or wolves.

## Lanes

| Lane | Slice | Owned files | Consumer (OR1) | UI contract (OR2) |
| --- | --- | --- | --- | --- |
| 1 (Opus) | Wild Gu refined through the shared engine; wolf-tide creature table | new `src/ri_wild_gu.js`, `src/world_packs/book_gu_lead_wild_refinement.js`, `src/ri_wolf_tide.js`, their tests; one registration line; one DEV fixture `ri-fang-yuan-wild-gu` in `scripts/headless/world_fixtures.mjs` | Fang Yuan's day (patrol drop) | One life-panel row "Refine the wild Gu" with its clock and inputs, the blocked reason kept; a result line naming the kind; the refined Gu as an owned item |
| 2 (Opus) | Harry's duel spells practiced; Klein's second Seer act | to be set after the daily-loops answer on `src/hp_lead_spells.js` and `src/book_world_lotm_actions.js` | Harry's duel (combat lane's opener), Klein's ladder | Practice rows on the Charms bench; the duel kit row's hover shows the practiced chance; the acting rung fills from the new act |

Hand-offs (OR6), asked 2026-11-14 before dispatch: daily-loops for the refined Gu's `RI_DAY_DIETS` row (its hunger needs a reader, FLR4) and the optional patrol-weight hook; combat for the duel-mastery line and the wolf foe and `recordKill` line in `tempo_lead_fights.js`.

## More to consider (dispositions)

- ACT NOW: refine through the shared engine, not item deltas (FND5). A Chrome proof starts from a DEV fixture that seeds one wild Gu, because the patrol drop is weight 4 of 8 rows (AD36 item 11).
- ACCOUNT FOR NOW: no new save slice for the wolf population; derive it from seed, clock and a kill-count fact. A refined Gu with no diet row is another FLR4 gap, so the hand-off is part of the slice's floor.
- LATER: wolf parts beyond the eye (pelt, meat, spoilage, weight) belong to daily-loops and combat under the same direction entry. A tide phase that moves encounter weights over the season waits for the table to have a consumer.

## Lane receipts

- **Lane 1, first return.** It stopped as briefed. Fang Yuan's declarative pack had no way to call `gu_refinement.js`: no rank-one kind carries a catalogue `recipe` row, `refinementLine` takes two inputs of one kind plus a parent, and his world had no effect gate. Delivered then: `src/ri_wild_gu.js` (kind draw, recipe rows in the catalogue's shape, blocked reasons by mechanism, begin and finish on the shared engine) and `src/ri_wolf_tide.js` (`riWolfFoe`, `riRecordWolfKill`, `riEncounterWeights` over `creature_populations.js`).
  - Checks: 9 of 9 new tests, 30 of 30 with the engine tests, `test:changed` 4,759 of 4,761 with 2 skipped and 0 failed, `check:arch` and `check:rules` exit 0.
  - Coordinator decision: one generic registered `guRefine` effect (`src/gu_refiner_registry.js`), with one dispatch line in each of the three shared files, rather than a second Keeper-style one-off like `guWild`. Resumed.
- **Lane 2, Phase A.** `src/hp_duel_mastery.js`: per-spell power ids keyed by `spell_pack_hogwarts.js` rows (levitation keeps its saved id) and `duelHit`, which leaves the base exactly at zero practice and adds 5% a step for up to 10 steps under the kit cap. A hover chance uses the fight's own strike math.
  - Checks: 5 of 5 tests, `check:arch` and `check:rules` exit 0.
  - The combat lane's line wraps the duel's fighters in `practiseDuelKit(state, [...], {leg_lock: 'leg-lock', body_bind: 'body-bind'})`.
  - Phase B needs two practice powers in `book_hp_lead_life_data.js` (extensions can only practise powers the base pack has), a library "read the jinx up" command, and bench rows in `hp_lead_spells.js`.
- **Klein finding (lane 2).** The workroom's `act_reading` belongs to the probationer branch, and `book_world_lotm_state.js:92` rejects an acting count without `methodLearned`. Klein's own life holds the Seer through `BE_SEER_SOURCE`, so `acted()` is not reachable from his ordinary day. In-role readings for other people exist: `astrological-chart`, `tarot-divination` and `numerology` in `lotm_divination_rows.js`, run by `book_world_lotm_cast_host.js:205`, each counted at its completed interpret step. The slice needs its own acting counter for his life or a change to that check, so it moves to the backlog.

- **Lane 1, second return.** The world-agnostic `guRefine` effect is in place, registered through `src/gu_refiner_registry.js`. The shared files gained one line each, all routed to the registry:
  - `simulation_contracts.js`: operation and assert;
  - `structured_pack_definitions.js`: pack predicate;
  - `simulation_effects.js`: consequences applied through the ordinary effect path, the `guHostedWolf` pattern.
- **Pack and fixture.** The pack `src/world_packs/book_gu_lead_wild_refinement.js` is a command extension on his own life, so no pinned hash moves. It has two rows, one per route: refine (1 h, 20 parts) and cow with a wolf eye (10 min, 1 eye, 8 parts; a proposal under AD56, ch162 pp65-66). One registration line was added in `book_world_beginning_registration.js`, and a DEV fixture `ri-fang-yuan-wild-gu` (composed) was added.
- **Checks:**
  - `tests/ri_wild_gu.test.js`: 7 of 7.
  - `test:changed`: 4,992 of 4,994, 2 skipped, 0 failed.
  - `check:arch` and `check:rules`: exit 0.
  - The fixture builds through the real load path.
- **Coordinator additions.**
  - `riWolfParts` and `RI_WOLF_PARTS` in `src/ri_wolf_tide.js` (PS2: this table owns the wolf and its parts; the eye is the board's proof, ch132): tests 5 of 5.
  - A slow-tier entry for `tests/ri_wild_gu.test.js` in `tests/duration_budget.json` (30 s against the 20 s default; it boots the game twice).
- **Open from lane 1:** MR44. The refined Gu is a new individual, not the wild one carried forward. The cow route is proven only in the pure tests.

## Played check (OR3, OR4)

Run in headless Chrome at 1920x1080, from a fresh origin, on a clean bundle built from `2c95b5a01` plus this wave's nine paths. Setup came from the DEV fixture `ri-fang-yuan-wild-gu`. The script is in the coordinator's scratchpad.

- **What the player can now do.** A wild Gu found on patrol becomes his own Gu. He clicks "Refine the wild Gu" on his own life panel and lets the hour pass. The Inventory then shows "Moonlight Gu · refined from the wild" (new). The kind is drawn from the save's seed.
  - Both routes show their clock and inputs beside the button.
  - With nothing in hand, both rows stay visible with "You have no wild Gu in hand to refine."
  - The refined Gu survived save and reload. It also survived loading that save into a second fresh origin (the localStorage path the fixture loader uses, not the Import button). There were no page errors.
- **Clicks:** one click and an hour of game time; two clicks with the eye route.
- **What was confusing:**
  - After the hour the notice still read "Started: Refine the wild Gu. 1 h to go." No Done line named the kind, and Reports was silent. The kind shows only in Inventory and in the status note under Details.
  - A "Repeat ... 3 times" button appears while only one wild Gu is in hand.
  - Both are in `structured_pack_ui.js` and were sent to feature-ui (OR6). That is the adjustment this cycle found. It is not applied this wave because the file is theirs.
- **Held-out scores:** none moved. Gu refinement and the wolf tide have no held-out split yet, so this wave adds code and play without moving a score.

## Not yet consumed (engine-only, consumer pending)

- **Wolf tide.** The combat lane takes `riWolfFoe`, `riRecordWolfKill` and `riWolfParts` into the hunt opener (agreed). The patrol weights need daily-loops to give the report a dynamic-weight path.
- **Harry's duel mastery.** `practiseDuelKit` is a no-op until Harry can practise the two jinxes. Phase B needs two powers in `book_hp_lead_life_data.js`, a library "read the jinx up" command and bench rows in `hp_lead_spells.js`. It waits on daily-loops releasing those files.
- **The refined Gu's hunger.** It needs its `RI_DAY_DIETS` row from daily-loops: `{slot:'wild_moonlight', gu:'book.ri.lead.wild_refinement.moonlight_gu', food: petals, perMeal:2, interval: half a day, basis ch23}`. The food for Little Light and Stealth Rock is unstated and would be authored.

## Close (2026-11-14)

- **Lane 2, Phase B (parked, not landed).** Harry reads Locomotor Mortis and Petrificus Totalus in the library, then practises each on Ron. Each one is a practice power keyed by its spell row, and the practice feeds `duelHit`.
  - Tests: `hp_jinx_practice` 3 of 3; 21 HP files 113 of 116.
  - Three failures pin the full command-id list: `hp_arrival`, `hp_lead_window1` and `hp_lead_window2`.
  - The cast hash moves to `101f6037…`. The alias row in `book_world_hp_lead_pack.js:17` must follow, or the earned `hp-w11-farewell` save refuses to load. Daily-loops saw that break in `lead_saves_load`, so the patch was taken out of the shared tree. It is parked in the coordinator group's side-session notes, `wave19_harry_phase_b/`.
  - Browser: the rows did not show in `hp-exam-week`. That fixture hides Lessons until the first-week arc is done, and the library is shut in exams. A term-time fixture is needed.
- **RWT17.** The unreachable "slipped your hold" line was dropped from `ri_wild_gu.js`. It returns with RWT19's will contest.
- **RWT14.** `ri_wolf_tide.js` owns the mechanism (population, foe, parts per wolf by size). Daily-loops owns nightly yields and prices and reads from it. Committed alone at `815616b18` so combat and daily-loops could build on it.
- **Feature-ui `615d26319`.** The timed act now ends with a Done line naming the kind. Repeat offers at most as many runs as the held inputs cover, so it is hidden with one wild Gu. Seen in Chrome by that lane. Reports still writes no line for a finished timed life act (not feature-ui's file).
- **Hand-over.** The wild-Gu files go to the RWT22 and RWT19 session after this commit: `ri_wild_gu.js`, `gu_refiner_registry.js`, the wild refinement pack and `tests/ri_wild_gu.test.js`.
