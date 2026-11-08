# Cross-world systems: task record

```receipt
build: bdefe75ca6ff3d916eac3d83fb37f6307b0630ee32f3556b4b0709e8a4f789a7
route: natural
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: person_ties 6/6; HP lead, lessons, arrival, people, colleagues, recurring people, structured runtime, LOTM abilities focused files pass; check:arch pass; native walks scripts/playtest/cross-world-ties.mjs lotm and hp pass
review: none
```

Receipt notes: X1 (LT8) only. Route "natural" is a fresh origin by earned steps in both lives (scripted native panel clicks, headless). The build is the tree after fix X1-B1, where Klein was walked last (six checks, 0 page errors); the commit-`2933f87e3` tree was walked as bundle `2b1ae547…`. Harry was walked on the previous bundle `5025ccafed13d072…`. The change between the two touched only Klein's display: a taken offer shows what was said, and the cast People rows gained attributed observations. The functions Harry's route uses (`tieEffects`, `tieFacts`, `tieOfferCommands`) did not change.

Started 2026-11-07 from the [long-term atlas](../../../audits/PROGRESS_ATLAS_2026-11-07_LONG_TERM.md) (LT1-LT11), in a session started by the progress-atlas session. Owner doc for the method: [cross-world systems transfer pattern](../../../CROSS_WORLD_SYSTEMS_TRANSFER.md) (proposal, AD32).

## Direction this task carries

- Weibao, 2026-11-07, relayed by the coordinating session: "rather than simply transfer to each world, imoplement fully into each world?" and "like we need the systems to be usable in the worls proper? But also create the foundational aspects so they work for each world?"
- Read as two layers, both required for "done" in a world: **F**, the foundation (the world plugs in through the shared engine's port by data, and the new hand code per world is counted), and **U**, use in the world proper (reached from the ordinary route of that world's life, walked natively, at the AD43 floor).
- Order: Klein (LOTM) first, Harry alongside, then MoL, Reverend Insanity (Gu), Shadow Slave, D&D Phandalin, Reincarnation Paradise, Primordial Saint Sect. Frontier and Mistglass get no new depth. The Village is the reference.
- Not yet recorded in USER_VISION or the direction log by this session. Those are shared owner docs; the coordinating session is asked to record them (hand-over note in the shared notes folder).

## World × system coverage (2026-11-07)

Cell format: **F / U**. F: `port` (world data through the shared port, no per-world engine code), `own` (hand-built world version beside the engine), `thin` (a token use), `-` (none). U: `floor` (walked natively at AD43 floor), `below` (implemented, below floor), `-` (not usable in play yet). `n/a` means the system does not fit that world as it stands, with the reason in the notes. Evidence for the six other book worlds is a static read of `src/` at `a152827dd` (imports and keyword greps), not route proof.

| System | Village (reference) | Klein (LOTM) | Harry (HP) | MoL | Gu | Shadow Slave | D&D Phandalin | Paradise | Primordial |
|---|---|---|---|---|---|---|---|---|---|
| Procedural crafting | port / floor | thin / - | own / below | own / - | own / - | own / - | own / - | port (process) / - | - / - |
| Mixtures and discovery | port / floor | - / - | thin / - | - / - | - / - | - / - | - / - | - / - | - / - |
| Materials and lineage | port / floor | - / - | own / - | - / - | - / - | thin / - | - / - | port / - | - / - |
| Gear and runes | port / floor | - / - | - / - | - / - | n/a (Gu are living tools) | own / - | thin / - | thin / - | - / - |
| Economy and trade | port / floor | own / floor | own / below | own / - | own / - | own / - | - / - | own / - | own / - |
| Relationships and standing | thin / - | **port / floor** (LT8) | **port / floor** (LT8) | port (people source) / - | - / - | thin / - | - / - | thin / - | - / - |
| Companions | port / floor | - / - | - / - | - / - | own (living Gu) / - | own (hound shadow) / - | - / - | - / - | - / - |
| Homes and households | port / floor | thin (rent duty) / - | - / - | thin / - | - / - | - / - | - / - | thin / - | - / - |
| Heirs and genetics | own / floor | n/a for volume 1 (no heirs in reach) | n/a for book 1 | - / - | - / - | - / - | - / - | - / - | - / - |
| Gathering and seasons | port / floor | thin (calendar) / - | thin (moon) / - | port (calendar) / - | - / - | - / - | - / - | port / - | thin / - |
| Research and study | thin / - | thin (records) / - | port (inquiry) / below | own / - | - / - | own / - | - / - | - / - | - / - |

Notes:
- "own" cells are the bridging targets (LT7): the world keeps its laws as data and the hand-built runtime retires.
- Heirs in Klein's and Harry's first books: "does not apply yet, because neither lead has children or an estate in the read range". Reopen trigger: a window with an inheritance or a child.
- Primordial is reachable only with a localhost probe flag, so every U cell there waits on a player route.
- D&D Phandalin is a named fixture start, not a registered world pack.

## Slices

| ID | Slice | F: new hand code per world | U: route | State |
|---|---|---|---|---|
| X1 | LT8 one person record: `person_ties.js` engine (regard as facts, observed notes, tie-gated offers); Klein: Dunn's trust from weekly expense filings opens a talk; Harry: Ron's affection from the Sorting and first Charms opens a talk | Engine: `src/person_ties.js` (new, world-neutral). Klein data: one declaration plus one writer in `book_world_lotm_colleagues.js`, a host verb and a panel row. Harry data: a declaration, two writer calls and a person row in the lead data, plus a Friends section in the lead panel. Per-world hand code is host rendering only: about 10 lines each | Klein: native, fresh origin, Work & merit buttons, a week of native time between filings. Harry: native, fresh origin, 56 household acts, 32 days, train, Sorting, first Charms | **At floor in both lives** (checks below) |

## Checks

| Check | Input | Result | Gap |
|---|---|---|---|
| `node --test tests/person_ties.test.js` and the HP lead, lessons, arrival, people, colleagues, recurring people, structured runtime and LOTM abilities tests | working tree | pass (three command-list pins updated for the new talk command) | |
| `npm run check:arch` | working tree | main.js growth 0; no new main imports | |
| `node --test tests/seam_register.test.js` after adding the `person_ties` row | working tree | pass | |
| Native walk, Klein: `node scripts/playtest/cross-world-ties.mjs lotm` | bundle `5025ccafed13d072` (working tree), headless Chromium 1920×1080, seed 7 | **pass**: offer shown shut with its reason; week 1 by the duty button gives trust 1 and the observation; seven native days, week 2 gives trust 2; the talk is taken, one note attributed to Dunn, the button gone; Save, reload, Export and Import keep trust 2 and the note; 0 page errors | Superseded by the final run below |
| Native walk, Harry: `node scripts/playtest/cross-world-ties.mjs hp` | same bundle, seed 11 | **pass**: 56 household acts, 32 native days a day per call, the train and the Sorting by their buttons give Ron affection 1, the talk is shown shut with its reason; 56 native hours to the first Monday Charms, which gives affection 2; the talk is taken, one note attributed to Ron; the People view shows Ron's lines; Save, reload, Export and Import keep affection 2 and the note; 0 page errors | A first run with a 25-minute limit timed out in the wait (no fault) |
| Native walk, Klein, final: same command | bundle `2b1ae547…` (final tree) | **pass**, six checks: the five above plus Dunn's words shown in Work & merit after the talk, and again after Import; 0 page errors | Dunn is absent from the People view until Klein meets him in canon (the expense duty is open from day 1, a design that predates this slice) |
| Full `npm test` | final tree | 5679 tests: 5677 pass, 0 fail, 2 skipped | |
| `npm run check:rules` | final tree | pass (receipts, direction sync, player text 0 new, names, continuity) | |
| `node scripts/seam_register.mjs --check`, `node scripts/cross_world_coverage.mjs --check` | final tree | current | |

FLR lines for X1 (both lives; Harry's FLR3 is the Friends row and the People view): FLR1 bundle `5025ccafed13d072` · FLR2 fresh origin by earned steps (the duty button, native days) · FLR3 the offer's shut reason is shown beside the button, the result is a Notebook note · FLR4 the tie gates a talk (a verb) whose note joins the player's knowledge · FLR5 save, reload, Export and Import exercised · FLR6 agent-verified, not human-reviewed; route kind: scripted native panel clicks (`scripts/playtest`), not the game MCP, because a week of stepping per click is the slow path.

Save decision: no new slice. The tie axis and the notes live in the expansion state; a missing axis reads as 0, so older saves load. The HP lead definition gains Ron (a person row) and one command; a save that holds the HP lead life from before this change carries the older definition, accepted under "old saves may break" (Weibao, 2026-11-07).

## Resume

- Files this task owns: `src/person_ties.js`, `tests/person_ties.test.js`, `scripts/playtest/cross-world-ties.mjs`, `docs/CROSS_WORLD_SYSTEMS_TRANSFER.md`, this folder; hunks in `src/book_world_lotm_colleagues.js`, `src/book_world_lotm_host.js`, `src/book_world_lotm_domain.js`, `src/book_world_lotm_ui.js`, `src/world_packs/book_hp_lead_life_data.js`, `src/book_world_hp_lead_pack.js`, `src/book_world_hp_lead_ui.js`, `src/simulation_effects.js` (one fact line), `src/structured_pack_runtime.js` (people details), `scripts/seam_register.mjs` (one row), three HP test pins.
- Stopped 2026-11-07 on usage: the weekly all-models limit read 91% (resets 2026-11-09 17:59 UTC); the 5-hour window read 13%. A four-lane wave with long native walks would likely exhaust the weekly allowance, so wave 1 is planned and not dispatched (stop condition per the foundation-run pacing).
- Input identity: master after the X1 commits; no dirty files from this task.
- Next useful action: after the weekly reset, start W1c (the Klein fixture) first as one long background job, then dispatch W1a, W1b and W1d as sonnet lanes writing only their own new files, with the rules below.
- Resume prompt: "Continue docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md. Read its direction, coverage table, wave plan and open items. Check usage first. Start W1c, then lanes W1a, W1b and W1d. You own the shared HP lead and LOTM host files and wire each lane's export. Fold, build once, walk once (scripts/playtest/cross-world-ties.mjs is the pattern), regenerate the matrix with scripts/cross_world_coverage.mjs, and commit own paths with docs/audits/tools/commit_own_paragraphs.py, no trailer, no push."
- Open: LT2 (powers) and LT7 (making) were in the first brief and are not started; see the wave plan.
- Open, canon gap X1-G1: Klein's expense duty is open from day 1 (it predates this slice), so Dunn's trust and the talk can come before Klein has met Dunn in canon. The People view correctly omits Dunn until he is known. Fix: gate the writer and the offer on Dunn being known, using the check `castSettledPeople` uses. It becomes walkable on the W1c fixture. Until then the "natural route" label means earned steps, not canon-clean timing.
- Fixed forward after commit `2933f87e3`, X1-B1: the trust step was keyed to weeks since the life began, while the duty numbers its cycles from the absolute clock. Two filings in consecutive duty weeks could then share one tie step. It now uses the duty seam's cycle (`expenseTieCycle`), with a regression test in `tests/person_ties.test.js`.
- Wave execution rules (advisor, 2026-11-07): lanes run focused tests only and never build or walk in the shared checkout; the coordinator folds, builds once and walks once. The W1c fixture save stays gitignored, because a chain save carries cast-pack text; only its replay script and scenario recipe are committed, and the scenario degrades without the private pack. Gitignored iteration saves (Harry after the Sorting, Klein after week 2) cut walk cost inside a wave, and each wave still ends with one fresh natural walk per world. LT2 counts as done only when a LOTM caller and an HP caller run through the same lowering.

## Wave plan (proposal, foundation-run shape)

Each wave lands one playable world-slice per lane at the AD43 floor or records it below. Lanes write only new files of their own. The coordinator owns the shared hot files (`book_world_hp_lead_life_data.js`, `book_world_hp_lead_pack.js`, the LOTM host, UI and domain) and wires each lane's export with one import and one push. That keeps one writer per file.

| Wave | Lane | Slice | Layers it moves | Owned files (new) | Route |
|---|---|---|---|---|---|
| 1 | W1a | LT7 Harry: Potions class on the shared craft engine. An HP catalogue (nettles, snake fangs, horned slugs, porcupine quills) and an HP law whose direction rule makes "quills before the cauldron comes off the fire" a different product. Two engine-resolved rows (by the steps, quills early), ingredients issued at the class, and the flask handed in as the consumer | Crafting F+U, Mixtures F+U for Harry | `src/hp_lead_making.js`, `tests/hp_lead_making.test.js` | Same native route as X1 to the first Monday Potions class |
| 1 | W1b | LT2 Harry: the levitation charm cast through `spell_seam`. A lowering from spell rows to a native command with an engine-drawn, seeded failure outcome and a wand-in-hand formula fact | Powers F+U for Harry; the shared lowering is the LT2 foundation | `src/spell_cast_lowering.js`, `src/hp_lead_spells.js`, tests | After first Charms |
| 1 | W1c | Klein fixture: a named scenario from the native KJ chain replay at the KJ3T, KJ3O and KJ3AE endpoints, so Klein's later systems can be walked (FLR2 named fixture) | Unblocks every Klein U cell past day 1 | `scripts/headless/scenarios.mjs` recipe rows, a replay script | Native chain replay, recorded once |
| 1 | W1d | LT10 Klein: the Moretti flat on the household model, read side first: residents (Benson, Melissa), rent owed from the rent duty, stored goods | Homes F+U for Klein | `src/lotm_home_household.js`, tests | Day 1 of Klein's life, Here tab |
| 2 | W2a | LT7 Klein: an LOTM catalogue and law for a making act in his read range (the protection amulet blanks, R8 in KJ3AE) | Crafting, Materials F+U for Klein | new LOTM making data file | W1c fixture |
| 2 | W2b | LT2 Klein: a Seer ability (Spirit Vision or a divination) on the W1b lowering, spirituality as its cost source | Powers for Klein | LOTM spell rows file | W1c fixture |
| 2 | W2c | LT10 Harry: the dormitory and the cupboard on the household model | Homes for Harry | `src/hp_lead_household.js` | X1 route |
| 2 | W2d | LT9: ingredient lineage in both lives (HP Polyjuice lots and LOTM ingredients through `material_lineage`) | Materials for both | per-world lineage rows | |
| 3 | | Companions (Klein's teammates, Harry's friends as companions bound to LT8 ties), gathering and seasons, research bridges, economy bridges onto the shared economy engine | | | |
| 4+ | | The other book worlds in order: MoL, Gu, Shadow Slave, D&D Phandalin, Paradise, Primordial. Each first gets its systems sheet rows (LT1), then the bring-up measure (LT5), then the "own" cells bridged one by one | | | |

Rejected for wave 1: LT7 Klein first (no reachable making act before the W1c fixture exists); heirs anywhere (does not apply in either first book); Primordial (no player route without a probe flag).

More to consider (dispositions): ACT NOW: lanes write only new files, and the coordinator wires them (a shared-file collision is otherwise certain). ACCOUNT FOR NOW: Klein's native walks cost tens of minutes per week of play, so W1c is the multiplier for every later Klein slice. Stepping a native week in one call crashed the headless page, so walks step a day per call. LATER: the systems sheet (LT1) as a runtime file and its coverage printout, once two waves have shown which fields the ports really need. Its done check is a printout that lists every world × system cell with its state.
