```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: n/a
review: none
tests: npm test 5523 pass, 0 fail, 22 skip (wave 3 fold)
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

## Resume block (unattended run, 2026-11-07)

Weibao, 2026-11-07 00:13: "make as much progress as possible ... use as much usage to make as much progress, and continue after the 5 hour limit and more".
- Objective: waves of disjoint foundation slices to floor, committed from an isolated worktree, until the stop condition.
- Input identity: master `778396479`; dirty but not ours: the whole primary working tree at dispatch (prose, perf, rules, dist).
- State of the steps: wave 1 dispatched 00:25; A and C returned and recorded; B (walk) out. Wave 2 (D, E) dispatched 00:55.
- Last evidence: folded wave 1-2 tree (C, D, E) built `bb58918b5b35d7b1e1a048284e737ffbd6805c63acba0d71ee5c502f13e17eb8`; check:arch pass; check:rules pass (0 new player-text strings); npm test running 01:20.
- Failed approaches: none yet.
- Next useful action: fold B (walk), F, G returns; build in the isolated worktree; gates; commit own paths.
- Usage pacing: read 00:14 EST, 5-hour 25% (resets 03:50), weekly 77% (resets Mon 13:00). Weibao's later words override the 75% weekly stop; this run's ceiling is weekly 92% (stop, leave this block current, about 8% left for his weekend). 5-hour at 85%: start no lane, wake after reset. Five other sessions share the pool.
- Stop condition (default 92%, Weibao's dial; reason: about 8% stays his until Monday): weekly 92%, or every remaining foundation slice sits inside the collision map, or a blocker that needs Weibao. Reached? Not yet.

Resume prompt for a fresh session: "Continue the unattended run from the Resume block in docs/gm/dispatch/overnight-run-2026-11-07/CHECKPOINT.md. Check `git status` and `git log -3` against its input identity first; finish the next useful action; keep the block current; commit own paths from the isolated worktree, no push."

## Checks

| Command | Result | Gap |
|---|---|---|
