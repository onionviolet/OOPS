```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: n/a
review: none
tests: npm test 5596 pass, 0 fail, 5 skip (scenarios R)
```

# Overnight foundation run, 2026-11-07

Weibao, 2026-11-07 00:13 EST: "make as much progress as possible, /foundation-run consider how to use as much usage to make as much progress, and continue after the 5 hour limit and more". Method: [foundation run playbook](../../FOUNDATION_RUN_PLAYBOOK.md). Coordinator: Claude session "Parallel work" (this chat).

## Collision map (other writers, at dispatch)

| Writer | Files it owns, which this run does not touch |
|---|---|
| Prose writing techniques session + quality-deep-dives coordinator (primary checkout) | `src/causal_story_content.js`, `src/original_frontier_*_content.js`, `docs/PROSE_RULES.md`, new rulebooks (CONTINUITY, FEEDBACK, NAMING, OPENING, PACING), `scripts/check_*`, `package.json`, `docs/RULES_INDEX.md`, `AGENTS.md`, `DESIGN.md`, `BALANCE.md`, `docs/UI_RULES.md`, `docs/IDEA_INDEX.md` |
| perf-8gb (primary checkout) | `src/main.js`, `src/proto23_shell.js`, `src/simulation_effects.js`, `src/facts_frame.js`, `src/world_completion_*`, `src/panel_reveal*`, `src/simulation_render.js` |
| perf-proto23-shell-timer (worktree rep-character-sheet-860fe6) | same perf area, told to take a lead disjoint from perf-8gb |
| hp-connect-homebound-end (worktree rep-knowledge-b16f3d) | HP files (`src/book_world_hp_*`, HP tests) |
| triage-22-stale-oct-30-b | stale branches; told to leave the two live rep worktrees |

The primary checkout has another session's staged deletions and a dirty `dist/`. This run builds, gates, walks and commits from an isolated worktree of HEAD (`work/overnight-20261107/checkout`), never with a plain `git add` in the primary.

## Wave 1

| Lane | Slice | Model | Owned files | Why foundational |
|---|---|---|---|---|
| A | Atlas reconcile lookup: AT/FD rows against cross-world and residue checkpoints | haiku | none (returns text) | The atlas predates waves 3-10 (AT10 already closed); selection needs current rows (F2 of the Nov 6 idea audit) |
| B | Native walks of committed, unwalked consumers: LOTM hired-guard contract, Market courtyard founding and collector, courtyard tender hire (`4a6375369`) | sonnet | a walk; it edits nothing in the repo | Moves committed seams' first consumers to floor (FLR) at low cost |
| C | Care access provider path: `src/care_access.js` has one caller (`storylet_content.js`); give it a second, mechanism-only consumer outside the collision map | sonnet | `src/care_access.js`, one new consumer file it names, `tests/care_access.test.js` | Second consumer validates the seam (FND5); residue "healer cure/provider paths" |

Rejected for wave 1, with reasons:
- Harry 1 September walk: hp-connect-homebound-end is changing that route; walk after it returns.
- KJ3AE native glance replay / kjw22: private-pack chapter content, new player prose while PRS is mid-rewrite; playbook keeps private-pack content out by default.
- LOTM ability channel lines, Frontier bow item and opener: new player text and frontier content files owned by the prose session; Frontier gets no new depth (PROJECT focus 3).
- AT17 recurring people: persistence change, design-heavy; candidate for wave 2 after A confirms it is still open.
- Wet/filth ownership: the Nov 6 cold/wet facet was reverted for an existing owner; needs a lookup first (wave 2 candidate).
- Perf leads: two sessions already on them.

## More to consider (wave 1)

- ACT NOW: walks run on a frozen HEAD bundle from the isolated worktree; walk receipts say they prove HEAD.
- ACCOUNT FOR NOW: lane C adds player text by default from existing strings (reason: the prose session is rewriting player text tonight); a new saved key goes back to the coordinator for a SAVES.md row; lanes run their focused tests and the coordinator runs the full suite (AD36).
- ACCOUNT FOR NOW: game MCP step limit 1440 minutes per call (FR-L4); imports take export text (FR-L5).
- LATER: atlas refresh section written by the coordinator from lane A's return, reusing AT IDs.

## Lane receipts

**C, care access second consumer (returned 00:45, checked).** Village aging treatment (`src/aging_contact.js` `treat()`) now builds a care record (healer, price gate, season duration, restores relief and season, does not restore age) and calls `applyCare`; cost, refusal text and effects unchanged. `src/care_access.js`: a price gate refuses when the caller supplies a short `money`; callers that omit it behave as before (fever card unaffected). Two tests added to `tests/care_access.test.js`. Coordinator check: diff read at locators, `node --test tests/care_access.test.js tests/aging_contact.test.js` 13/13 in the isolated worktree. FND2: one new edge `aging_contact.js` → `care_access.js` (leaf), no core owner, no registration, no saved key. Not covered: the second consumer is in the same world as the first (Village), so it proves a second caller, not a second world (FND5 cross-world still open; HP hospital wing in `hp_brewing_state.js` is the next candidate, HP files are another session's tonight); rank/favor gates unused here; `notRestored` not shown. State: implemented, below floor (no native walk; reaching a progressed chronic condition needs years of play or a fixture).

**A, atlas reconcile (returned 00:50, haiku, read-only).** Closed since the atlas: AT10 (`1eeb94f22`), AT13, AT21 (fixture), AT22, AT24 (fixture), AT25, AT26; U04 already closed (remaining `Math.random` calls cosmetic, LARGER row ~369). Open without player text or HP files, ranked: away-time rule (U05), position exits (U13), society sheet runtime reader (FD14), second consumers for FD3 ready stock and FD9 fog; AT17 open (wake queue exists, `book_world_lotm_cast_host.js:138`); AT18-AT20 wait for a consumer. Atlas refresh section still owed (coordinator, at closeout).

**E, position exits (returned 01:05, checked).** `src/positions.js`: `SETTLED_EXIT_KINDS` term_end and died; `settlePositions(rows, at, {died})` ends a fixed term at its `endsAt` (away time and one long step agree), idempotent; `endPositionsOnDeath`; `exitPosition` refuses the settled kinds as a chosen exit; `migratePositions` accepts them. New `tests/positions_settle.test.js`. Lane: positions tests 27/27, LOTM 361 pass 0 fail 15 skip, check:arch pass; coordinator rerun of the positions tests below. Saved shape unchanged (`positions@1`); SAVES note owed: an older build drops records holding the new kinds. **Finding (FR-L1): no caller.** Rows are derived per world through `positionsOf(state)` and `positions_domain` has no state port or tick, so nothing play reaches calls settle; the death hook belongs where `chronicle.life.endedAt` first becomes set (simulation_effects/main, perf-owned tonight); heir saves start without a `positions` key (unchecked). State: implemented, below floor, unwired. Wave 3 candidate: a `tick` in `positions_domain` with a registered state port like duties' sets, LOTM first.

**D, authority consult and fading knownness (returned 01:15, checked).** `src/authority.js`: per-authority half-life (`setKnownnessHalfLife`, `halfLifeOf`), rows carrying `at` fade by `ctx.now` or `state.clock`; `identityOf`/`PLAYER_IDENTITY`, readers take `ctx.identity` (F8). `src/authority_sources.js`: village reader reads identity; village half-life 30 days (dial, reason stated). New `src/authority_sources_lotm.js`: two Tingen readers, 60-day half-life (dial, reason), wages through `positionsOf` weighted by post publicity (clerk 2, night watchman 1, probationer 0, dial with reasons), paid divinations dated by the session note. New `tests/authority_knownness_fade.test.js` (7). F1 consult already existed in `duties_domain.js` (covered by `obligations_more.test.js`); Tingen rent names no authority, so its settlement is unchanged; making rent consult the landlady's claim needs `book_world_lotm_duties.js` (out of this lane). Lane: 107/107 focused, LOTM 361 pass 0 fail 15 skip, check:arch pass. Coordinator: code read at locators; focused rerun 26/26 across the wave's new tests. Not covered: real LOTM positions in the test (stub source); village market rows undated, so nothing fades there yet; reader `text` lines are new strings shown wherever knownness is listed (player-text lint passed, no new engine vocabulary). State: implemented, below floor.

## Wave 2 (dispatched 00:55; usage 5-hour 28%, weekly 77%)

| Lane | Slice | Model | Owned files |
|---|---|---|---|
| D | Authority consult and fading knownness: LARGER F1 (duties ask `authorityOver`; Tingen readers for wages via positions and divination fees), F4 (per-authority half-life, derived), F8 (`ctx.identity`) | sonnet | `src/authority.js`, `src/authority_sources.js`, `src/duties_domain.js`, one new source file, tests |
| E | Position exits: died, and away-time term end at its true time (FD15, U13, U05) | sonnet | `src/positions.js`, one caller for the death hook, tests |

Rejected for wave 2: U04 randomness (already closed); FD14 society reader (needs a consumer choice, wave 3 candidate); AT17 (wave 3, after D/E fold so the cast host is not mid-edit with positions).

**Commit `b254013c4` (01:35).** Waves 1-2 (C, D, E) plus the SAVES.md compatibility row, from the isolated worktree with a guarded `update-ref` of master from `778396479`; primary index and working files synced for those 11 paths only. Gate on the folded tree: build `bb58918b...17eb8`, `npm test` 5515 pass / 0 fail / 22 skip, check:arch pass, check:rules pass, doc slips clean. No push.

## Wave 3 (dispatched 01:40; usage 5-hour 33%, weekly 78%)

| Lane | Slice | Model | Owned files |
|---|---|---|---|
| F | Wire position settle to the clock: `positions_domain` tick over world-registered state ports, LOTM port, death hook if reachable, heir carry check | sonnet | `src/positions_domain.js`, `src/book_world_lotm_positions.js`, a few lines of `src/book_world_lotm_host.js`, tests |
| G | FD14 first runtime reader: authority half-lives and post publicity read from each world's society sheet row, code numbers as defaults | sonnet | `src/world_society_sheet.js`, `src/authority_sources*.js`, `src/authority.js` if needed, tests |

Rejected for wave 3: AT17 recurring people (the cast host carries an eager-enrollment byte contract and wake queue; scope needs a design pass, not a mid-tier lane; candidate for a scoped proposal once the five-hour window resets).

**G, society sheet feeds authority dials (returned 01:50, checked).** `src/world_society_sheet.js` gains an optional sheet-level `authority` field (`halfLifeDays`, `postPublicity`, each `{value, reason}`), validator `authorityDialProblem` and reader `authorityDials`; each dial falls back alone when malformed. The Tingen row states 60 days, clerk 2, night watchman 1, probationer 0 with reasons. `src/authority_sources_lotm.js` overlays sheet dials on code defaults at import (`applyAuthorityDials`); `src/authority_sources.js` reads the village half-life from the sheet (no village row yet, so unchanged). New `tests/authority_sheet_dials.test.js` (4). Lane: 57/57 focused, sheet report script exit 0, check:arch pass; coordinator rerun 11/11 of the two authority test files and diff read. FD14 now has its first runtime reader. Not covered: other sheet fields stay declaration-only; the report script does not validate `authority`; no Village or HP row. State: implemented, below floor.

**F, position settle on the clock (returned 02:00, checked).** `src/positions_domain.js`: `registerPositionsPort(id, live)`, a domain `tick` that settles term ends for each live port on its own clock (a throwing or null port is skipped), and a `died({state, at})` command. `src/book_world_lotm_host.js`: registers the LOTM port and calls `died` once a loss of control is judged final, before `ports.die`. New `tests/positions_tick.test.js` (4). Lane: 26/26 positions, LOTM 361 pass 0 fail 15 skip, check:arch pass; coordinator: diff read, positions tests 24/24, build `c7feeedd...96f`, check:arch and check:rules pass. This closes lane E's FR-L1 finding for LOTM. Not covered: deaths outside LOTM loss of control (chronicle `life.endedAt` path sits in `src/continuation_state.js:160` and `main.js`, perf-owned tonight); heir saves start without `positions` (`buildLifeHeirSave` copies a fixed key list), recorded, unchanged; the tick runs on each domain tick and derives rows (cheap derivation, not profiled). State: implemented, below floor (no native walk of a 5-year term).

**Commit (wave 3, 02:15).** F and G from the isolated worktree, guarded update of master from `b254013c4`. Gate: build `c7feeedd...96f`, `npm test` 5523 pass / 0 fail / 22 skip, check:arch and check:rules pass. No push.

## Wave 4 (dispatched 02:20; usage 5-hour 36%, weekly 78%)

| Lane | Slice | Model | Owned files |
|---|---|---|---|
| H | Care on credit (LARGER F5): `credit` gate writes an owed row to the provider; Village healer consumer; owed view lists it | sonnet | `src/care_access.js`, one Village healer file, `src/owed_ledger_sources.js`, one obligations owner, tests |
| I | Claims as known acts (F7): staking ground records one known act toward the covering authority; settler dues read the OB1 policy set if derived | sonnet | `src/organizations_domain.js`, one helper, tests |
| J | Witness reader (F2): observers belonging to an authority turn their known-target facts into knownness rows | sonnet | `src/authority_sources*.js`, one new file, tests |

**H, care on credit (returned 02:30, checked).** `src/care_access.js`: `credit` gate kind (`min` limit for a stranger, optional larger `known` limit for a neighbour, reason in the record); `applyCare` takes no coins, returns the restore effects plus a coin obligation row (debtor player, creditor provider, `source: care_access`), refuses over the limit with nothing written; imports `obligations_ledger.js` (check:arch pass). One test added. Coordinator: care tests rerun below. **Finding: unreachable.** No Village healer writes the row: the saved owner that fits is `economy_standing`'s `obligations@1` ledger (feeds the owed view; `syncLedger` leaves `care:` rows alone), wired through a cross-domain command plus a `PARTY_LABELS` entry in `owed_ledger_view.js`, and the aging Treat button (`aging_contact_domain.js`, `aging_contact_ui.js`) offering credit when short. Same-minute visits share a row id. State: implemented, below floor, unwired. Wave 5 candidate (one lane, those four files).

**J, witness reader (returned 02:40, checked).** New `src/authority_witness.js`: `registerWitnessBelonging(authorityId, fn)` registers one knownness reader per authority that turns each belonging observer's known-target facts about `ctx.identity` into a row (weight and reason from the belonging dial, latest observation day as `at`, faded by that authority's half-life); reads the observer's beliefs, never truth (ACR9). New `tests/authority_witness.test.js`. Lane: 52/52 authority, LOTM 361 pass 0 fail, check:arch and check:rules pass (0 new player-text strings). **Finding: no consumer.** No belonging is registered: world-pack people carry `institution`/`house`/`cohort` but nothing maps them to village or tingen, and no writer records a constable's or clerk's sight of a fight or sale. State: implemented, below floor, unwired. Lesson for the run (FR-L1 again): seam-first lanes keep returning without a caller; later waves brief consumer wiring first.

**H2, healer credit wired (returned 02:55, checked).** Village "Years & company" Treat card offers "Treat on credit · N coins" when the purse is short and the healer's limit has room (dial: stranger 16 coins, friendly or honoured Village standing 40; reason: stall-holders talk about who pays). The domain writes a `care:healer:<minute>` row (suffix on same-minute visits) through new `owe`/`unowe` commands into `economy_standing`'s saved `obligations@1` ledger (no new key; undo on failed save); Ledger → Owed lists "You owe the healer N coins". Files: `src/aging_contact.js`, `src/aging_contact_domain.js`, `src/aging_contact_ui.js`, `src/economy_standing.js`, `src/economy_standing_domain.js` (outside the brief's list, small, not forbidden), `src/owed_ledger_view.js`, new `tests/care_on_credit.test.js` (5). Lane: 39/39 focused, check:arch pass, check:rules 0 new player-text strings; coordinator rerun 32/32 and UI diff read. Player text: the credit button, a tooltip/note clause, a refusal line, the "the healer" party label. **Direction note:** Village sits in the Frontier test bed, which gets no new depth by default (PROJECT focus 3); this is the shared care seam's test consumer, small and reversible, and the first consumer that a book world could replace (a Tingen physician or the HP hospital wing). Not covered: repayment (only loans have `repay`, so the healer debt clears only through other coin paths), domain test with ports, browser walk. State: implemented, below floor.

**I, claims as known acts (returned 03:05, checked).** `src/organizations_domain.js`: staking a claim reads `authorityOver` before the claim is stored and, after the commit, records one known act through `heat.recordAct` (`CLAIM_ACTS`: tingen → `tingen_police`, village mapped but heat has no village row yet, weight 1 with reason), founders as witnesses, id per claim so heat dedupes; settler dues return a derived OB1 `policy` (pay_on_time at `strongAt` 3 people or known, pay_late below; dial with reason). Behavior change: `claimQuote` now refuses only ground another group holds (the old rule refused any ground an authority covered, which made the covered case unreachable); nothing shipped sits inside bounds, so players see no change. New `tests/group_claim_acts.test.js` (4). Lane: 51/51 focused, check:arch pass; coordinator: diff read, 4/4 rerun. Not covered: the only claimable ground (the wilds stead) lies outside every authority's bounds, so the act never fires in shipped play; settler knownness reads zero (no group reader). State: implemented, below floor, no play route.

**Wave 4 fold gate (03:10).** Build `55c17347cb9aaa0a2e3c252436fb7320fd8bc526115af6c9f7c211aa0b12b180`; check:arch pass; check:rules pass (0 new player-text strings); npm test 5538 pass / 0 fail / 22 skip. Committed with H, H2, I, J (next commit after `137319cba`).

**B, native walks on HEAD `778396479` (returned 03:15).** Bundle `ffe78f5c...250232`; frozen identity bundle `bccdcfd1...93bf`, manifest `509ca540...c58d`. Proves HEAD before this run's commits.

| Item | What the player saw | Result | Persistence |
|---|---|---|---|
| LOTM hired guard (civil staff life, report in, Path) | "Sign on as a night watchman"; "A quiet night"; purse 1200 → 1500 pence after the week ("Collect the watch pay · 1 pound 5 soli") | pass, with defect A | save, reload, export, import kept day 8 08:00, 1500 pence, the hire on Path |
| Market courtyard founding and collector | founding form needs a typed group name | not walked here: today's `game_click` sets `value` on native selects, and a typed name needs a text field (one `game_report_limit` filed); collector needs Klein's own life and three missed rent weeks at about 292 s per game day | n/a |
| Courtyard tender (Sela) | "Sela is hired", then "Grow tended grain · 6 played min" after buying seed | pass, with defect B | save, reload, export, import kept day 3 08:01, 8C 9W, the hire |

Defects found by the walk:
- **A (save-breaking):** signing the guard contract before reporting in writes a knowledge note whose situation does not exist yet; the save then fails ("Knowledge needs its actual situation context."), progress pauses and every later save is refused. `guardSignQuote` (`src/book_world_lotm_guard.js:78`) offers the hire before the situation exists; note built by `know()` (`src/book_world_lotm_kit.js:18`), validated at `src/causal_situations.js:57`.
- **B (log flood):** a hand with no seed repeats "I have no seed packets to sow, so the bed sits empty." once per settled minute (about 1440 a day); `report` in `src/hired_hands_plot.js:105` fires on every tick pass.
- Minor: the guard term reads "Five weeks left" one day in (rounds down).

**Commit `db55445d8` (03:25).** Wave 4 (H, H2, I, J), gate as above. No push.

**Defect fixes from the walk (coordinator, 03:30, uncommitted until gated).**
- A: `guardSignQuote` (`src/book_world_lotm_guard.js`) refuses until the day's situation exists ("Report in at the workroom first; the warehouse hires in the evening, after your day has begun."), checked after the held-post refusal so the probationer reason is unchanged. Test harness reports in before signing; new regression in `tests/lotm_guard_contract.test.js` (offer closed before report, open after). 11/11.
- B: `src/hired_hands.js` tally gains `first` (the pass right after hiring); `src/hired_hands_plot.js` says the no-seed line on the first pass and at each paid week. New regression in `tests/hired_hands.test.js` drives 120 one-minute ticks: one line, then one more after a paid week; it fails without the fix (checked by reverting the condition). 9/9.
- Gate: build `cec10dc1a8ab7a9e756ab2047cf817e8ad7af6f1ba33994ecf536a85d22751c7`, check:arch pass, check:rules 0 new player-text strings; `npm test` 5557 pass / 0 fail / 5 skip (fewer skips than earlier runs: private fixtures present at run time); re-walk of A and B running. Committed after the suite.

**Commit `bc76799bb` (03:50).** Defect fixes A and B; suite 5557/0/5. No push.

## Wave 5 (dispatched 03:52; usage 5-hour 40%, weekly 79%), consumer wiring first

| Lane | Slice | Model | Owned files |
|---|---|---|---|
| K | Repay the healer: care rows get a repay path and a Repay control in Ledger → Owed; repaying frees credit room | sonnet | `src/economy_standing*.js`, `src/owed_ledger*.js`, tests |
| L | First live witness consumer: Tingen police or watch observers of a recorded fight add a Tingen knownness row | sonnet | `src/authority_sources_lotm.js`, one new file, tests |

**K, repay the healer (returned 04:00, checked).** `src/economy_standing.js` `repayCareDebt` (shape of `repayLoan`: whole coins, at most what is owed, row removed at zero); `src/economy_standing_domain.js` `repayCare` command (purse route `ports.addCoins(-paid)`, as loan repay); `src/owed_ledger_view.js` quotes each open `care:` row so the existing Settle path shows "Repay N". One test added to `tests/care_on_credit.test.js` (partial pay reload, full pay frees credit room, refusals). Lane: 33/33 + 7/7, check:arch pass, check:rules 0 new strings; coordinator rerun below. Not covered: the click path through `settleOwed`, browser walk. State: implemented, below floor. Care on credit is now a closed loop (borrow, owe, repay) at rule level.

**L, Tingen witnesses (returned 04:05, checked).** `src/authority_sources_lotm.js` registers a Tingen witness belonging: observers whose id starts with `book.lotm.constable.` count, weight 1 (reason: a constable writes what he saw into the station book, and the police read it); label from the person's name. New `tests/authority_witness_tingen.test.js` (2: drives a real `beginTempoFight` record, shows zero rows until the observation exists; a village observer and a bystander add none; checks the real constable fighter ids carry the prefix). Lane: 54/54 authority, LOTM 375 pass 0 fail, check:arch pass, check:rules 0 new strings; coordinator 2/2 rerun. **Missing writer:** no fight writes what its non-player fighters saw (`tempo_fight`/`tempo_fight_domain` write nothing for them). `src/tempo_fight_domain.js` carries another session's uncommitted edit in the primary checkout, so the writer belongs in the LOTM constables result path (`src/book_world_lotm_constables.js` `apply`, ~115), which is clean. Wave 6 candidate. State: implemented, below floor.

**Wave 5 fold gate (04:10).** Build `3423be9e753e06a0773a6b5d8bc60a135a3c84218d160fdc879c9ea353a4b3d1`; check:arch pass; check:rules 0 new strings; npm test 5560 pass / 0 fail / 5 skip. Committed (K, L).

**Re-walk of fixes A and B (returned 04:15).** Played live from the worktree through `game_new` with `checkout=` (`game_freeze` froze the primary checkout instead; one `game_report_limit` filed). The coordinator rebuilt `dist/` during the walk (my error), so the bundle was `cec10dc1...51c7` at start and `3423be9e...b3d1` at the end; both builds contain fixes A and B, and the wave 5 changes in between touch no guard or hired-hand code, so the result holds for either.

| Item | What the player saw | Result | Persistence |
|---|---|---|---|
| A: Path before reporting in | no sign offer on Path | pass | n/a |
| A: report in, then sign | "You signed on at the warehouse." | pass | save, reload, export, import into a new game and a further day's step all saved; no "Progress paused" |
| B: Sela hired with no seed, one day stepped | the no-seed line once (digest and log show the same event) | pass | save and reload kept one copy |
| B: again at a paid week | not stepped | not walked (covered by the regression test) | n/a |

Lesson (FR-L8 for the playbook): do not rebuild the shared worktree's `dist/` while a walker reads it; use `BUILD_OUT=.lane-builds/<name>` for the walker's build, since `game_freeze` reads the primary checkout.

**Commit `f8595bf44` (04:20).** Wave 5 (K, L); suite 5560/0/5. No push.

## Wave 6 (04:22; usage 5-hour 43%, weekly 79%)

Weibao, 04:15: "the UI slice might be done, figure out what you are free to do now". Check: perf-8gb (the JS/UI performance session) is committing its slice in the primary checkout; the prose session is idle with its rules and content edits uncommitted (staged deletions included), so those paths stay out. Once perf-8gb's commit lands and its files read clean, these open: `src/tempo_fight_domain.js` (a world-neutral fighter-observation writer), `src/continuation_state.js` and `src/main.js` (positions `died` on every life end, not only LOTM loss of control).

| Lane | Slice | Model | Owned files |
|---|---|---|---|
| M | Constables record what they saw: the resolved "Constables at the door" fight writes each constable's knowledge of the player, so Tingen witness rows come from play | sonnet | `src/book_world_lotm_constables.js`, constables and witness tests |

Waiting on perf-8gb's commit: W6-A world-neutral fight observation writer (`tempo_fight_domain.js`), W6-B positions `died` from the chronicle life end.

**M, constables record what they saw (returned 04:50, checked).** A knowledge entry under a constable's id fails the save ("Unknown persistent actor", `src/simulation_contracts.js:261`): constables are fight fighters, not persistent people. So `src/book_world_lotm_constables.js` keeps the last resolved door fight (result, time) as an optional `door` entry in `constables@1` and registers its own Tingen knownness reader: one `witness:book.lotm.constable.N` row per constable ("The first constable saw you and noted: fought two constables at the door and drove them off.", worded by result). `CONSTABLE_IDS` shared with the fight spec. New `tests/constable_door_sight.test.js` (5); `tests/authority_strikes.test.js` literal gains `door: null`. Lane: 51/51 + LOTM 375/0, check:arch, check:rules 0 new strings. Coordinator: updated the stale comment in `src/authority_sources_lotm.js`, added the SAVES.md row (forward only; older-build behavior not checked), focused 42/42, build `2a7db6d2...2888`, check:arch and check:rules pass, npm test running. Not covered: the reader parallels the knowledge-based witness reader rather than reusing it (proper fix: persistent constable people); no browser walk. State: implemented, below floor; the Tingen witness row now comes from play.

**perf-8gb committed `e45b11c70` (05:00).** Its files are clean in the primary checkout; only the prose session's three content files remain dirty in `src/`. Lane M was moved onto `e45b11c70` in the first worktree (no overlap), rebuilt `44048797...f71f`, check:arch and check:rules pass, npm test 0 fail (counts in the commit message). Weibao, 05:05: "Go ahead" (W6-A and W6-B).

| Lane | Slice | Model | Worktree and owned files |
|---|---|---|---|
| W6-B | Every life end (old age, continuation `die:`) closes the life's posts as died, once, at the true time | sonnet | `work/overnight-20261107/lanes2`; the impure call sites it names, `src/positions_domain.js`, tests |
| W6-A | Tempo fights write what persistent opponents saw of the player (world-neutral), skipping non-persistent fighters | sonnet | `work/overnight-20261107/lanes2`; `src/tempo_fight_domain.js`, `src/tempo_fight.js` if needed, tests |

A second worktree (`lanes2`, detached at `e45b11c70`) keeps the lanes off the tree whose suite is running.

**Commit `6a185be67` (05:20).** Lane M over `e45b11c70`; npm test 5578/0/5. No push.

**W6-A, fights record persistent observers (returned 05:20, in `lanes2`).** `src/tempo_fight_domain.js`: `recordFightSight(plan, registry, before)` writes `person.player.fight_seen` (stage seen, observer's voice, e.g. "fought you and lost") for each opposing fighter that is a persistent actor, cause `tempo-sight:<session>` so a second apply writes nothing; `move()` calls it before commit. New `tests/tempo_fight_sight.test.js` (3). Lane: 131/131 across tempo, rival and authority tests; check:arch pass; check:rules 0 new strings. Reachable fight with a persistent opponent: Mara's road contest (code path read, not driven through `move()`); boar, collector, street robber and constables use non-persistent ids. Not covered: no reader yet (Mara has no belonging; the Village witness map is a later dial); headless `driveTempoFight` and fights ending on their opening commit do not write. State: implemented, below floor.

**W6-B, every life end closes posts (returned 05:30, in `lanes2`).** `src/positions_domain.js`: `registerPositionsLifePort` and a death check in `tick` (when `chronicle.life.endedAt` is set, close posts at `endedAt`), plus a `diedInSave` command working on the saved slice. `src/book_world_lotm_host.js` registers the life port; `src/continuation_host.js` calls `diedInSave` on a `die:` before preflight. `chronicle.js`, `continuation_state.js` and `main.js` untouched. New `tests/positions_life_end.test.js` (5). Lane: 68/68 positions and continuation, 16/16 harm, check:arch growth 0. Not covered: a death committed without a domain tick closes its posts on the next tick (still at `endedAt`); the life port is registered by the LOTM host module; HP and organization sources share the path without their own death test.

**W6 fold (05:35).** W6-A and W6-B copied from `lanes2` into the first worktree on `6a185be67` (no overlap with lane M's files). Focused 147/147 (positions, tempo, continuation, harm, guard, constables); build `ad5c673a...f14f`; check:arch pass; check:rules 0 new strings; npm test 5586 pass / 0 fail / 5 skip; committed with the AT17 proposal doc. Process note: the coordinator stopped a mistakenly started duplicate suite with `pkill -f` matching its own log name, against the repo's stop-by-PID rule; nothing else matched.

**AT17 proposal (05:45).** [RECURRING_PEOPLE_AT17_PROPOSAL_2026-11-07](../../../audits/RECURRING_PEOPLE_AT17_PROPOSAL_2026-11-07.md), proposal under AD32: promote a recurring role to an ordinary `simulation.people` entry at its first durable reference through a thin idempotent `promoteRole` over the existing `spawn` effect; definitions registered without provisioning so an untouched life stays byte-identical; stable ids; ended people are kept. First slice: the Tingen constables.

**Commit `434aa706d` (05:55).** W6-A, W6-B and the AT17 proposal; npm test 5586/0/5. No push.

## Wave 7 (05:57; usage 5-hour 50%, weekly 80%)

| Lane | Slice | Model | Owned files |
|---|---|---|---|
| N | AT17 first slice, prototype of the proposal: `promoteRole` (world-neutral) and persistent Tingen constables promoted when the door fight opens, so their knowledge feeds the witness rows | sonnet | `src/recurring_people.js` (new), `src/book_world_lotm_constables.js`, minimal `src/tempo_fight_domain.js`, tests |

**N, AT17 first slice (returned 06:10, checked; prototype under AD32).** New `src/recurring_people.js` (`defineRole` registers a promotable role without provisioning, `installRoleDefinitions`, `roleRegistered`, idempotent `promoteRole` over the `spawn` effect). `src/book_world_lotm_constables.js` defines the two constables and promotes them when the door fight opens (opener `promote`); its Tingen reader skips a constable who already has knowledge of the player (F5) and `recordDoorSight` stops writing once they are persistent. `src/tempo_fight_domain.js`: one line in `begin()` calls `opener.promote` before the commit, so W6-A's writer records their sight. New `tests/recurring_people.test.js` (5: untouched bytes, people and knowledge after a fight, encode/import/reload, no double spawn or re-promotion on rewind, one witness row per constable). Lane: 98/98 + LOTM 375/0, check:arch, check:rules 0 new. **Coordinator wiring:** the lane could not install definitions without an import cycle, so a promoted save would have failed to load (F1); the coordinator added `installRoleDefinitions(registry)` at `createLotmHost` (`src/book_world_lotm_host.js`), which the LOTM domain builds at startup; focused 422/422 (recurring, constables, authority, LOTM); updated the comment in `src/authority_sources_lotm.js`; SAVES.md row (forward only). Build `5fe3ff94...02d2`, check:rules pass, doc slips clean, npm test 5591 pass / 0 fail / 5 skip; committed with the atlas refresh section. Not covered: native walk of a door fight and a reload of the promoted save; witness wording now follows the observer's knowledge ("fought you and lost") instead of the door wording; a second fight replaces the first sight. State: implemented, below floor.

**Commit `388d25a6f` (06:25).** Wave 7 (lane N with coordinator wiring) and the atlas refresh (AT27-AT31); npm test 5591/0/5. No push.

## Wave 8 (06:27; usage 5-hour 58%, weekly 81%)

Lookup (haiku) for second-consumer slices outside HP files and the Frontier test bed: FD11 lessons (Old Neil), FD3 ready stock, FD9 fog. Selection follows its return.

Lookup returned (06:35): FD11 has a custom LOTM control lesson (`src/book_world_lotm_actions.js:62`) and an uncalled `beDivMethodLearnEffects`; FD3 fits Gu prepared moonlight petals (`src/book_world_gu_domain.js:37-40`); "FD9 fog" in the atlas is weather and light (`src/world_light.js`), while knowledge uncertainty lives in `src/knowledge_view.js` `CERTAINTY`, which Mother of Learning foreknowledge (`src/mol_zorian_loop.js:44-45`) can feed.

| Lane | Slice | Model | Owned files |
|---|---|---|---|
| O | FD11 second world: LOTM control lesson builds through `lesson.js`, behavior-preserving | sonnet | `src/book_world_lotm_actions.js`, `src/lesson.js` (small), tests |
| P | FD3 second world: Gu prepared petals through `ready_stock` | sonnet | `src/book_world_gu_*` (two), `src/ready_stock.js` (small), tests |
| Q | Knowledge certainty: MoL foreknowledge reads guessed until confirmed this loop | sonnet | `src/mol_*` (two), `src/knowledge_view.js` (small), tests |

**P, Gu petals on ready stock (returned 06:45, checked).** Read side only: `src/book_world_gu_domain.js` `guPetalFacts` builds the care-status line from `stockFacts` over a Gu spec (unchanged wording and counts) and the envelope validator runs `stockAssertions`. New `tests/gu_petal_stock.test.js`. Lane: 28/28 Gu and ready-stock, LOTM firearm 24/24, check:arch pass. Finding: the prepare and meal acts (`src/world_packs/book_gu_life.js`) move items, while `ready_stock` effects write resources; routing them through the seam needs an item-to-resource migration and a SAVES row. FD3's second world is therefore partial (display). State: implemented, below floor.

**O, LOTM control lesson on the lesson seam (returned 06:50, checked).** `src/book_world_lotm_actions.js` builds the control lesson's knowledge effect through `lessonEffects` (same key, stage, basis and text); `lesson.js` unchanged. New `tests/lotm_control_lesson_seam.test.js` (deep-equal against the pre-move literal); `tests/lotm_commands_golden.test.js` still hashes every LOTM command byte-identical. Lane: 390 pass 0 fail over lesson and LOTM tests, HP lessons 8/8, check:arch pass; coordinator rerun below. FD11 now has two worlds on `lessonEffects` (HP, LOTM); `lessonAvailability` stays HP-only (the control lesson has no teacher window). `beDivMethodLearnEffects` stays uncalled (needs a new act and text). State: implemented, below floor (structural move, behavior identical by golden hash).

**Q, MoL foreknowledge certainty (returned 06:55, checked).** `src/mol_zorian_loop.js` writes predictions at stage `interpreted` (the shared view shows guessed); new `reconcileForeknowledge(state)`, run after each Zorian command and restart from `src/book_world_mol_host.js`, sets `understood` once the calendar date is reached in this run and back otherwise; past the row's reliable days with this run diverged (`motherOfLearning.divergence`), an unconfirmed prediction keeps guessed and carries the existing stale note. `src/knowledge_view.js` unchanged. New `tests/mol_foreknowledge_certainty.test.js`; `tests/mol_zorian_restart.test.js` extended. Lane: 75/75 MoL and knowledge tests, check:arch, check:rules 0 new; coordinator 11/11 rerun. Not covered: an old save reads known until the next MoL command or restart; idle time alone does not confirm; "confirmed" means the date was reached, not that the event was observed. State: implemented, below floor.

**Wave 8 fold gate (07:00).** Build `b19c616644483f4f4af2238ac24e2cf0b7f2c79aecc8897e7643367f72651a6a`; check:arch pass; check:rules 0 new strings; npm test 5596 pass / 0 fail / 5 skip. Committed (O, P, Q).

**Commit `86eac8bcb` (07:05).** Wave 8 (O, P, Q); npm test 5596/0/5. No push.

**Final walk (dispatched 07:07; usage 5-hour 61%, weekly 81%).** One sonnet walker on build `b19c6166...1a6a` (no rebuild during the walk): care on credit and repay with persistence, the LOTM control lesson, and the constables door fight with reload if a probe reaches it.

**Final walk (returned 07:15).** Live from the worktree through `game_new` `checkout=`; bundle `b19c6166...1a6a` at start and end.

| Item | What the player saw | Result | Persistence |
|---|---|---|---|
| Care on credit and repay | no route to an aged Village life (the first chronic condition starts at age 45; no probe or fixture sets age) | not reached | n/a |
| LOTM control lesson (Nighthawk probationer, after the Seer dose) | "Take the control lesson: learn bounded material perception · 1 spirituality, 5 min"; after 6 minutes the lesson left and the next act appeared | partial pass (action state, not the result text: compact view shows no reports log) | save and reload kept 08:06 in the Tingen workroom; export taken, import not run |
| Constables at the door (Klein's own life) | opened at day 1, 00:00; the fight needs a wanted latch and no fixture sets it | not reached | n/a |

One `game_report_limit` filed (aged-life fixture, wanted-level fixture, reports log in compact view). The persistence changes of this run (promoted constables, care rows, positions exits) are proven by focused round-trip tests and the full suite, not by a native walk; that walk waits on those fixtures (AT31).

**Worktrees.** `work/overnight-20261107/lanes2` removed after checking each of its edits matches `434aa706d`. `work/overnight-20261107/checkout` kept at `86eac8bcb` for the next session (holds only build output beyond HEAD).

**R, game MCP scenarios (returned 07:50, checked by its own MCP check).** `scripts/headless/scenarios.mjs`: `village-aged-chronic` (DEV SEEDED: elder met, chronicle begun through the notebook, `initialAge` 46, stage 1 stiff joints diagnosed, purse 3 coins; healer debt not seeded) and `lotm-klein-wanted` (DEV SEEDED: Klein's own life, one known act of weight 6 against `tingen_police` plus the constables latch; skips without the private cast pack). `scripts/mcp/game_mcp_check.mjs` gains `seededScenarios` asserting each hook ("Treat on credit · 16 coins"; "Constables at the door"). `node scripts/mcp/game_mcp_check.mjs`: PASS (15 tools). Not covered: the `game_new` tool description in `scripts/mcp/game_mcp.mjs` lists the older scenario names; heat decays, so the wanted state lasts about 21 game days. Closes the fixture half of AT31. npm test 5596 pass / 0 fail / 5 skip; committed with the walk receipt (another session's uncommitted two-line edit to `scenarios.mjs` in the primary was preserved by patching).

**Native walk on the new scenarios (returned 08:00).** Bundle `b19c6166...1a6a` at start and end; page errors 0 on every call; no "Progress paused".

| Step | What the player saw | Result | Persistence |
|---|---|---|---|
| Aged Village card | "Treat on credit · 16 coins" on the stiff joints card | pass | n/a |
| Treat on credit | stage eased to "in care"; the 3 coins stayed | pass | n/a |
| Ledger → Owed | "You owe the healer 16 coins, no set date." | pass | save, reload, export and import into a new session kept the debt |
| Repay with 3 coins | "Paid 3 coins." owed fell to 13 | pass (partial repay) | kept after save and reload |
| Constables at the door (wanted Klein) | the fight opened; Klein yielded; "You spent the night in the cells." and a 90 pence fine | pass | save (365,827 bytes), reload, export and import clean; fine and cells record kept |
| Tingen knows | "The Tingen police have your name." (report line; the knownness screen not opened) | partial | n/a |

Care on credit with repay and the promoted-constables save path now reach the floor on DEV SEEDED fixture routes (`village-aged-chronic`, `lotm-klein-wanted`): agent-verified, not human-reviewed. Not walked: a full repay, the witness rows on a knownness screen.

**Commit `6fad94394` (08:10).** Scenarios R and the walk receipts. The primary checkout held another session's uncommitted names fix in `scripts/headless/scenarios.mjs` (village elder and old craftsman click text as a regex, NMR1); after the commit the coordinator rewrote the primary working copy as the new HEAD plus that edit, applied to the new `village-aged-chronic` recipe's identical line too, and left it unstaged for its owner.

**Closeout (08:15).** Usage 5-hour 69%, weekly 82%. Remaining candidates sit behind other writers (player text while the prose rules are uncommitted, HP files in the Harry worktree) or need design first (AT17 second consumer: LOTM cast bodies already enroll, so the gap is the large-pack wake path; Gu prepare and meal acts move items, and the seam writes resources, which needs a migration). Small leftover: the `game_new` tool description in `scripts/mcp/game_mcp.mjs` still lists the older scenario names. Worktree `work/overnight-20261107/checkout` removed (all its work is committed).

## Resume block (unattended run, 2026-11-07)

Weibao, 2026-11-07 00:13: "make as much progress as possible ... use as much usage to make as much progress, and continue after the 5 hour limit and more".
- Objective: waves of disjoint foundation slices to floor, committed from an isolated worktree, until the stop condition.
- Input identity: master `778396479` at start; run commits `b254013c4`, `137319cba`, `db55445d8`, `bc76799bb`, `f8595bf44`, `6a185be67`, `434aa706d`, `388d25a6f`, `86eac8bcb`, `ab06411c9`, `6fad94394`; perf-8gb committed `e45b11c70` in between; dirty but not ours: the whole primary working tree at dispatch (prose, perf, rules, dist).
- State of the steps: waves 1-8 returned, recorded and committed (`b254013c4` through `86eac8bcb`); defect fixes A and B committed `bc76799bb` and re-walked; final walk recorded.
- Last evidence: master `86eac8bcb`, `ab06411c9`, `6fad94394`; build `b19c616644483f4f4af2238ac24e2cf0b7f2c79aecc8897e7643367f72651a6a`; npm test 5596 pass / 0 fail / 5 skip; check:arch and check:rules pass; final walk: control lesson partial pass, care credit and door fight not reached (no fixtures).
- Failed approaches: seam-first lanes without a named caller (AT27); writing knowledge for non-persistent fighters (save refuses, use promotion); rebuilding `dist/` while a walker reads it (FR-L8); `game_freeze` for a worktree build (reads the primary).
- Next useful action: when the prose session commits, LOTM ability-channel lines and a Tingen physician on the care seam (AT30); when the Harry branch lands, FD6/FD7 HP consumers; AT17 large-pack wake path for LOTM colleagues after a design read; Gu prepare/meal on resources with a migration; update the `game_new` scenario list in `scripts/mcp/game_mcp.mjs`.
- Usage pacing: read 00:14 EST, 5-hour 25% (resets 03:50), weekly 77% (resets Mon 13:00). Weibao's later words override the 75% weekly stop; this run's ceiling is weekly 92% (stop, leave this block current, about 8% left for his weekend). 5-hour at 85%: start no lane, wake after reset. Five other sessions share the pool.
- Stop condition (default 92%, Weibao's dial; reason: about 8% stays his until Monday): weekly 92%, or every remaining foundation slice sits inside the collision map, or a blocker that needs Weibao. Reached? Yes at 08:15 for this session: every collision-free foundation slice found is committed and walked or recorded below floor; weekly 82% stays under the 92% ceiling. A later session resumes from the next useful action.

Resume prompt for a fresh session: "Continue the unattended run from the Resume block in docs/gm/dispatch/overnight-run-2026-11-07/CHECKPOINT.md. Check `git status` and `git log -3` against its input identity first; finish the next useful action; keep the block current; commit own paths from the isolated worktree, no push."

## Checks

| Command | Result | Gap |
|---|---|---|
