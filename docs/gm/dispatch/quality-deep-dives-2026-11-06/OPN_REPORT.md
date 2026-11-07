# OPN lane report (openings: the first ten minutes of each start), 2026-11-06

CHECKPOINT: done. Check, baseline, rules, backlog and test are written; the sweep covered 14 starts. Not covered: lotm.beside
(private pack; its recorder was stuck, run with `--skip lotm.beside`). No start is left "trace pending" in this baseline.

## What was measured (SHOWN: ran it, seed 1, headless)

Two sources. (1) The first screen, read by this check after entry (full text, controls, disabled reasons, the "Next step" pointer);
the PAC trace stores only counts and six short samples, so it cannot show a screen. (2) The first 60 presses of the PAC trace
(m960, a100, d10), reused from its OS-temp cache (newest clean file for the start, any bundle key); none was replayed by this lane
except where the cache had none. Traces whose end reason was "error" are never used; such a start reads as pending, not zero.
Evidence limit: scenes and traces come from slightly different source states because other sessions edit `src/` during the run.

## Sweep per start (flag = count, words or presses)

| Start | Flags |
| --- | --- |
| village | trace-refusal-no-reason 6, no-effect-choice 3 (policy-limited). First screen is lean: 23 words, 10 enabled actions, pointer names the elder |
| lotm.probationer | unexplained-term 1, foreign-place 1, trace-refusal 4, first-payoff-late 60 |
| lotm.machinery | unexplained-term 1, same-label 2, foreign-place 1, trace-refusal 4, first-payoff-late 60 |
| lotm.storm | prose-wall 733, engine-reason 31, same-label 3, unexplained-term 1, foreign-place 1, trace-refusal 4, first-payoff-late 60 |
| lotm.civil | unexplained-term 1, foreign-place 1, trace-refusal 4, first-payoff-late 60 |
| book.hp.school | prose-wall 754, stale-pointer, engine-reason 4, foreign-place, trace-refusal 8, no-effect-choice 20, no payoff in 60 |
| book.hp.trade | stale-pointer, unexplained-term 1, foreign-place, no-effect-choice 7 |
| book.hp.lead | prose-wall 340, stale-pointer, engine-reason 3, unexplained-term 1, foreign-place, trace-refusal 5, no-effect-choice 7 |
| book.ss.apprentice | prose-wall 550, engine-reason 5, foreign-place, no-effect-choice 20, no payoff in 60 |
| book.ss.trial | stale-pointer, engine-reason 2, foreign-place, trace-refusal 2, no-effect-choice 6 |
| book.ss.company | prose-wall 766, stale-pointer, engine-reason 6, unexplained-term 2, foreign-place, trace-refusal 3 |
| book.ri.academy | prose-wall 688, engine-reason 5, foreign-place, trace-refusal 2, no-effect-choice 20 |
| book.ri.keeper | prose-wall 1801, long-block 66, stale-pointer, unexplained-term 1, foreign-place, trace-refusal 9, no-effect-choice 13 |
| soldier.p01 | unexplained-term 5, first-action-late 9, dead-stretch 19, no-effect-choice 3, trace-refusal 2 |

Worst examples (engine-speak quoted; scene prose is counted, never quoted):
- Six book starts (hp.school, hp.trade, hp.lead, ss.trial, ss.company, ri.keeper) show the Village's "Next step"
  pointer ("Talk to the village elder") on an entry screen that has no such person. SHOWN on hp.school: `#reports_dock`.
- Engine fallback "The required knowledge, means or circumstances are missing." appears on screen: lotm.storm 31 times,
  book.ss.company 6, ss.apprentice 5, ri.academy 5 (UR73/UR82 say hide it).
- Twelve starts (every lotm.* and book.* start) have a disabled nav tab (Mixing) whose tooltip says "return to Village and finish your conversation".
- lotm.* first screens show three controls all labelled "Walk · 2 min" / "Walk · 20 min" with no destination (storm: same-label 3).
- Word walls before the first press: ri.keeper 1801 words (longest block 66), ss.company 766, hp.school 754, lotm.storm 733, ri.academy 688.

## Honest limits

- Trace flags (first-payoff-late, no-effect-choice, dead-stretch, first-action-late, trace-refusal-no-reason) are policy-limited: the
  curious bot presses what it has not pressed, in its own order, and cannot read `aria-describedby`. They are in the ratchet but never rank.
- "No payoff in 60 presses" repeats the PAC work-loop gap; it is not new evidence about the start.
- unexplained-term is high precision, low recall (capitalised mid-label terms only). It misses lowercase jargon.
- Disabled reasons and blockers are read from visible DOM text in the headless shim; layout could still hide some of them.
- A walk summary says what the bot did, not what a person would do. lotm.beside is unread.

## Files written

`scripts/check_openings.mjs`, `scripts/openings_baseline.json`, `docs/OPENING_RULES.md` (OPN1-OPN9),
`docs/openings/OPENINGS_BACKLOG.md` (generated, ranked, with a per-start first-ten-minutes walk), `tests/openings_check.test.js`, this report.

## Check and test

- `node scripts/check_openings.mjs` : 14 starts read, 77 recorded flags, 0 regressions (against the baseline written by this run).
  Flags: `--start`, `--refresh`, `--resume`, `--skip a,b`, `--update-baseline`, `--backlog`. Each start runs in a child process
  (one process booting many games ran out of memory). About 5 to 8 minutes per start when traces must be recorded, seconds when cached.
- `node --test tests/openings_check.test.js` : 10 pass, 0 fail. Fixture scenes and traces; no boots. The "tree passes against the
  baseline" case is a no-boot consistency check (the baseline parses and compares clean against its own values).

## Proposed owner hunks (coordinator applies)

- package.json scripts: `"check:openings": "node scripts/check_openings.mjs"` (not in check:rules: it boots the game).
- RULES_INDEX register row: `OPENING_RULES.md | OPN1-OPN9 | proposed 2026-11-06 | first-screen and first-press quality; check:openings`.
- AGENTS.md rules paragraph: "First screens of starts: follow [opening rules](docs/OPENING_RULES.md) OPN1-OPN9."
- PROSE_RULES PRS3 could link OPN2 (the long start-screen blocks are the case a "Details" disclosure serves).

## Top five backlog items

1. Clear the Village pointer on entry to every non-Village start (OPN8; stale-pointer on 6 starts, one shared fix).
2. Hide the engine fallback reason on starts (OPN4; lotm.storm 31, others 2 to 6; one decorator route per UR82).
3. Fold ri.keeper's 1801-word opening and the 700-word book/storm openings into a "Details" disclosure (OPN2, PRS3).
4. Replace the Village wording in disabled nav tooltips on other worlds (OPN8; one string, 12 starts).
5. Give the three "Walk · N min" controls a destination in lotm.* (OPN3).

## Process note

I stopped one of my own stuck check processes with `pkill -f` once by mistake (it matched only my check run); no other process was touched.

## Open questions as defaults

- Default: keep trace flags in the ratchet but unranked until PAC ships a work-aware route; rerun `--refresh --update-baseline` then.
- Default: add lotm.beside to the sweep only once its recorder is reliable.
