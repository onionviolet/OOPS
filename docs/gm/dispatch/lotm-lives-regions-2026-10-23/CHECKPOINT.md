# LOTM lives, regions and pathways: checkpoint (worktree lotm-pathways-2e8786), 2026-10-23

Queue: [QUEUE.md](QUEUE.md). Direction: Weibao, "implement each life and each required part of lives and more". Uncommitted,
no push. Opt-in only (`?lotm_probe=1`), disposable saves, no default-world change, `state.lotm` stays schema 1.
Target viewport desktop 1920x1080, laptop 1366x768 also run; mobile deferred. All authored values are proposals.

## Step 0: seed (done)

Copied from the primary checkout (copy only, nothing there touched): `src/book_world_lotm_{actions,content,envelope,host,ids,path,state,ui}.js`,
`docs/worlds/world-core-kit-2026-10-14/cards/lord-of-mysteries.md`, `docs/worlds/LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md`,
`docs/worlds/IMPLEMENTATION_MAP_...2026-10-23.md`, `tests/lotm_corpse_collector.test.js`, `docs/gm/dispatch/lotm-lives-regions-2026-10-23/`, `docs/gm/dispatch/lotm-q1-2026-10-23/`.
Collisions: none. Each copied src file was byte-identical to the primary's `HEAD` version, so the branch had no LOTM edits to re-apply.
`docs/WORLD_PASS_RULES.md` was copied then removed again (it has no register row in this branch's RULES_INDEX, so `check:rules` failed); read WPR rules from the primary.
Seed check: `node --test tests/lotm_*.test.js tests/ascension_paths.test.js`: 22 pass.

## Order followed

B2 and Q2 first (one writer, so the queue's "after Q2" reason did not apply), then Q3, Q4, Q5, B3 (cause rows, needs Q5's broker doses to be reachable), Q6, further pathways.

## What was built (all uncommitted, all proposals)

Rules applied: WPR30-WPR32 (read from the primary checkout), WA1, WA5, WA6, WA13, AD5, AD38, AR1-AR16 (seam AR14, `src/book_world_lotm_*.js`), SR1-SR24 (districts), PIR (roles), LTS1-LTS14,
sealed secrets (none touched), AD36 (focused tests while editing, one full run at the end).

| Slice | What | Where |
|---|---|---|
| B2 | Per-pathway factory: a pathway is a row; commands, flags, facts, state asserts, dose accounting, descriptor and view come from it. Seer stays hand-authored. Merged assessor: one data-driven pre-screen, plus an optional exam row | `book_world_lotm_kit.js`, `_rows.js`, `_pathways.js` |
| Q2 | Three districts (Nighthawks, Mandated Punishers, Machinery team) as a region layer; walking records an arrival note; visiting needs an endorsement; each district has its own officer, errand pay and responders (affiliation first, territory second, escalation when mixed) | `book_world_lotm_districts.js` |
| Q3 | Life profiles: Nighthawk probationer, new-identity civil clerk (papers and clothes paid before the story, 5 pounds, contract 3 pounds a week, no potion), Machinery probationer, Storm probationer | `book_world_lotm_lives.js` |
| Q4 | World-neutral clearance leaf and Tingen roles; grade 3 sealed item needs formal-member clearance and a group of three; grade 2 needs a captain or bishop and is not held at Tingen | `src/clearance.js`, `book_world_lotm_clearance.js` |
| Q5 | Broker holds money and item until the buyer verifies; settle, or reject a forgery; equal-value barter; escrow is a resource on the broker | `book_world_lotm_broker.js` |
| B3 | The five stated causes of loss of control as rows (skip, wrong pathway, switching, rushed modelled; temptation recorded, not modelled). Pressure resource, pre-signs that guided attention eases, a loss line that ends the branch. Replaces the "both pathways" validator wall with a recorded cause | `book_world_lotm_causes.js` |
| Q6 | Savant (Paragon, Machinery team) as the third pathway with the source's promotion rule: a senior deacon examines after a wait | `savantRow` |
| Further | Sailor (Tyrant, Mandated Punishers) with the same engine, its own senior deacon and its own wait | `sailorRow` |
| Abilities | Sequence 9 and 8 abilities for Corpse Collector, Savant, Sailor and the Clown, through `compileStructuredAbilities`: acquired, costed, with a drawback; concealed looks with a `seenBy` observer rule; hostile Beyonders bound to the same rows | `book_world_lotm_abilities.js` |

## Decisions

- **D1 Pathway for Q6.** Savant. Criteria in the Q1 order. (a) no new verb: study and apply are acts. (b) stated Seq 9 and 8 abilities and the acting hint "live as the Savant, study and apply". (c) a Tingen holder: the Church of Steam and Machinery owns the complete line and the university president is a Seq 7 Appraiser. Sailor has holder and abilities but no stated acting (acts authored, flagged in the row), so it came fourth as the "further pathway". Sleepless still needs a time-of-day gate and is not built. Spectator stays unwired: no Tingen holder is sourced.
- **D2 The exam reads merit; the wait is an ordinary-member dial.** Source: three years on the previous potion plus an assessment is the default for ordinary members, who lack the acting method; Klein digested in about a month and a senior deacon examined him on site on merit, with no elapsed-time check [0169 p85, 0170 p3-p4, 0168 p31]. So a player who digested by acting has no wait (`exam.waitMinutes: 0`). `ordinaryWaitMinutes` (Machinery 3 days, Storm 2 days, `sourceWait` 'three years') is kept as the dial for NPCs or a start with no acting knowledge, prototype-scaled; no player path uses it yet. The Warden Hale pre-screen of Q1 stays as authored.
- **D3 One church per life.** A life is a church (profile `home`); each church offers only its own pathways. The Nighthawk life is offered Seer (authored stand-in for the Evernight line, which the source says holds Seer Seq 9) and Corpse Collector.
- **D4 Switching is a cause, not a wall.** Without the recorded `cause.switching` flag the validator still refuses a save holding two pathways; with it the save is valid and carries pressure. Reaching the loss line (6) ends the branch (host refuses further actions).
- **D5 Money is the native `money` resource read as pence** (12 a soli, 240 a pound). The new-identity life replaces the frontier purse with its own 5 pounds (F25: cash does not travel) on a disposable branch only.
- **D6 Looks.** `look:{concealed:true, seenBy:[kinds]}` on sources and conditions. The player's own bio shows none; `lotmReveal(observerId, registry, state)` returns the ids a given observer (Hale, an officer, a hostile Beyonder, the dead) could see and feeds `characterBioView({reveal})`. Nothing in the app passes a reveal yet.

## Shared and generated files touched

`src/simulation_content.js` (one line: registers the LOTM conditions), `dist/bundle.js`, `dist/bundle.js.map` and `index.html` (rebuild output). Everything else is under `src/book_world_lotm_*.js`, `src/clearance.js`, `tests/lotm_*`, and these docs. No `main.js` line was added; the one registration still goes through the domain registry.

## D4 resolves the implementation map's OQ4 and PC1 by proposal

Q1 recorded the two-pathway validator wall as deliberate; the map left the change to a later lane. This lane made it: without the recorded `cause.switching` the wall holds, with it the save is valid and pays pressure. Weibao should see that this changed.

## Save compatibility decision

Additive only. `state.lotm` stays schema 1. New optional player facts (`book.lotm.<row>.*`, `endorsed.*`, `lot.*`, `cause.*`, `contract.signed`, `sealed.held`), new resources (`weeks_paid`, `pressure`, row `acting`, broker `escrow`), new items and new people. `entryProfile` accepts four profile ids (older builds refuse a new-profile save through the existing envelope refusal, which is the localhost-only disposable-save reading of the earlier lanes). People added by these slices exist only in saves enrolled after them; every reader tolerates their absence (tested: a save with no officers, member, broker or vault item loads, views and walks; commands whose target person is absent are not listed). Saves from before B2 (Seer taught and promoted; Corpse Collector allocated, acting, promoted) load unchanged (`tests/lotm_lives_compat.test.js`). Every command a saved job can name is byte-identical; only the offers gated by the one-pathway, Beyonder-track or church facts changed.

## Verification (one line per check; command, result, gap)

- `node --test tests/lotm_*.test.js tests/ascension_paths.test.js`: 70 pass, 0 fail (engine level; ten test files, fixtures dumped from the Q1 code before any edit).
- Browser, headless fresh origin, 1920x1080 and 1366x768 (`lotm_browser.cjs`, scenarios q2 q3 q4 q5 b3 q6 sa ab): enroll, play the slice by real button clicks and dev-stepped time, save, reload, export and import.
  Gap: the Tingen panel sits in a parked workspace module in this composition, so buttons are driven by DOM click and read by DOM text; no visual screenshot of the panel layout was judged (the `evidence/*.png` files show the page, not the panel).
- `npm run check:arch`: pass (main.js growth -2, save_files.js growth 0). `npm run check:rules`: pass.
- `npm test` (full, once at the end per AD36): 2671 pass, 0 fail on two runs. One earlier run of the same tree showed 2 failures while a browser sweep was still running; the failing test names were not captured and two reruns were clean, so treat it as load flake, unproven.
- Browser sweep after the last UI/host fix (rebuilt bundle): scenarios q2 q3 q4 q5 b3 q6 sa ab at 1920x1080 and at 1366x768, 16 runs, 0 page errors, every assertion held (including the home-district status, responder line and officer attention checks added after review).
- Not exercised (implemented-unverified): human play feel of every authored number; a hostile Beyonder meeting the player in play (the records run through the engine in tests only, no encounter yet); a bio panel that passes an observer reveal; Sleepless; the `temptation` cause; grade-2 item custody (the table answers it, no item is held); other cities; Sequence 7 and above; mobile.

## Next

Proposed, unselected: an encounter that puts a hostile Beyonder with these records in front of the player; wiring `lotmReveal` into an observer view; Sleepless once a night gate exists; pathway-conserving world ledger (QUEUE account-for-now) before more than three low-sequence lives share the city; neighbour-pathway swaps.

## Source locator check received (from the high-tier research session, information only)

Checked against the rows: examiner is "a senior deacon" with no Seq 5 claim in any row (consistent); wait source default is three years plus assessment [18 p56], [106 p55], with [168 p8-p13] carrying the examiner only (rows cite them that way); the Q1 "about a year" is Dai's fast pace (0150 p52), not a church wait (the ids comment now cites F18/X4); strict-acting pace dials (8 to 7 three months to two years, and so on, [150 p49]) and Seq 7 notes are recorded for a later row, none used here.

## Reconciliation with the primary checkout's parallel Q2/B2 lane (2026-10-24)

The primary checkout holds a second, uncommitted Q2 (districts, timed walks, vouched district acts) and B2 (pathway and assessor rows, cause rows) written by the lane that QUEUE.md called "Q2 in flight"
(`docs/gm/dispatch/lotm-q2-2026-10-23/`, primary only). Integrator direction: this candidate stays the base; the primary's mechanisms are folded in as data or equivalent mechanisms; its saves and this lane's
earlier candidate saves must load. Nothing in the primary was touched. Method: the primary's own code was run in a scratch overlay (this branch's `src` with the primary's `src/book_world_lotm_*.js` laid over it)
by [dump_primary_q2_fixtures.mjs](dump_primary_q2_fixtures.mjs), which wrote real saves with a walk in flight and vouched acts in flight plus its full command table; an old-candidate save was dumped by
[dump_old_candidate_fixture.mjs](dump_old_candidate_fixture.mjs) with the old university id swapped in. All fixtures are in [fixtures/](fixtures/).

| Primary mechanism | Where it landed | Compat or migration | Dropped, and why |
|---|---|---|---|
| District rows (label, church, team, claim, here, why, doseHere, shift, vouch rows, travel minutes) | `book_world_lotm_districts.js`: kept verbatim as data under `alias` north/docks/university, merged into this lane's church/officer/endorsement/errand rows (`q2team`, `qlabel`) | texts feed saved-job effects, so they are byte-equal (tested) | nothing |
| Walks as timed jobs (12 generated `walk_<from>_<to>`), arrival record `arrived` | the same 12 commands, same ids, durations, costs and effects; the host starts the job and places the body at the destination exactly as the primary did; this lane's instant `arrive_*` commands retired | a save mid-walk loads and the job finishes with the arrival record (fixture `primary_walk_midjob_docks`); a save reloaded mid-walk in the browser keeps its job | `arrive_*` commands: they only existed in this lane's unreleased candidate and wrote knowledge keys that are inert |
| Same text for every life | added a life-neutral walk set per non-Nighthawk life (`_storm`, `_machinery`) because "not Warden Hale" and "another church's doses" are false for them | additive | none |
| Vouched district acts `act_laying_out_docks`, `act_reading_docks`, `act_reading_university` (Hale's attention pays the vouch) | `book_world_lotm_actions.js`, built from the base acts; Nighthawk lives only (`lotm.home.evernight`) | job fields byte-equal; fixtures `primary_docks_laying_midjob`, `primary_university_reading_midjob` finish on this build with the same attention and act count | the vouch for the Machinery and Storm lives: their own officer supervises them in person, so there is nobody to vouch |
| Machinery day shift (first 16 of 24 hours) | `onShift` in the districts file; `lotm.officerHere` is false off shift, so every officer-gated command in that district waits (errands, endorsement, the Savant pathway) | derived, nothing saved | none |
| Facts `lotm.district.<alias>.here/.supervised`, `lotm.district.doseOk` | `districtFacts`, emitted next to this lane's `lotm.district.<id>` and `lotm.home.<id>` | derived | `doseOk` is emitted but is no longer a gate on Hale's accept commands: those already need an Evernight-home life and Hale present, and the Machinery and Storm districts issue their own church's doses to their own lives, which the primary's single-life model could not say |
| Facts `lotm.block.<id>.switching/.wrongPotion`, `lotm.other.<id>.*` | emitted in `lotmFacts` for seer, corpse, savant, sailor with the primary's formulas; `wrongPotion` now also gates every legitimate ingest and promotion | derived | the primary's `defaultBlock` dial: here the dial is open on one route (a broker's unmarked dose) where the step costs pressure instead of being refused, so the block facts guard only the legitimate commands |
| `LOTM_LOSS_CAUSES`, `loc.<cause>` record flags | `book_world_lotm_causes.js`: `LOTM_LOSS_CAUSES`, `LOTM_CAUSE_ALIASES`, `LOTM_LOC_FLAGS`, `causeHeld`; validators accept either flag family as the same cause | a save flagged the primary's way validates (test) | none |
| Pathway rows, assessor rows (`LOTM_PATHWAYS`, `LOTM_ASSESSORS`, `lotmPathwayCommands`) and `tests/lotm_pathway_rows.test.js` | this lane's rows/factory (`book_world_lotm_rows.js`, `_pathways.js`) already cover Seer-adjacent, Corpse Collector, Savant, Sailor and the assessor/exam rows | the primary's pre-Q2 and post-factory saves load (fixtures `primary_pre_q2_*`) | their row object shape and the three tests that pin it (stub row, cause-table shape, flagged record): same intent is covered by the Savant/Sailor tests, the cause tests and the compat tests; keeping two row shapes would be a second factory |
| Places list in the panel; district status line with shift | `book_world_lotm_host.js` / `_ui.js` (view `places`, status shift note, claim line) | display only | none |
| Location id `Tingen university area` | now this lane's id too; this lane's earlier `Tingen university quarter` is migrated | `migrateLotmPlaces` in `book_world_lotm_envelope.js`, run in the lotm domain's validate hook before any validation reads the save: exact old id only, in `current location`, native `locations` / `availabilities.location` keys, the lives' initial snapshots, `absorb_local_life.lastLocation` and each person's place; refuses a save holding both ids; never touches non-LOTM saves or prose; idempotent | none |

Old-candidate evidence: engine saves `candidate_old_quarter_machinery_{reported,midjob}` fail validation unmigrated (no relaxed validation), pass after the rename, differ from the old file only by the place id, and the in-flight
study job finishes with its act counted. Browser (`alias` scenario): a live native save had every occurrence of the id (9, including keys and snapshots) rewritten to the old id, reloaded, kept its location, its in-flight job
and its native location map under the new id, and the job finished.

Hashed inputs for the integrator are in [RECONCILIATION_MANIFEST.sha256](RECONCILIATION_MANIFEST.sha256).
