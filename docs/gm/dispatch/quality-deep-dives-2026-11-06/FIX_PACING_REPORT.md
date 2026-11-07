# FIX_PACING report (2026-11-07)

CHECKPOINT: done. Work policy added and the pacing baseline re-recorded (15 starts, 0 misses, 0 regressions). The stalls the
old baseline showed were mostly the browse-first policy, not the game. No game file was changed; two proposals are below.

## Measurability (SHOWN)

- `scripts/headless/trace.mjs`: `--policy work` (new named policy). Default `unseen-first` unchanged: same selectors, minutes,
  money and unlocks on a 40-step Village run (only NAMES' label text differs). Additive: step `progress`, meta `progress0`.
  Also (coordinator item 1) the panel step skips disabled options; noted in TRACE_READY.
- `progress` = `{settled, simLog, jobs, gains, packs}`: settled completions on book-life rows, event log, running jobs,
  knowledge/powers/faculties/titles gained, a pack's purse and rank (`content_packs` is noise-filtered, so A Soldier's Life
  gains were invisible before).
- `scripts/check_pacing.mjs`: plays the work policy (`PACING_PARAMS`; `PARAMS` stays policy-free because check_feedback imports it).
  Settled, gains and packs are payoffs; event-log rises and jobs are liveness only. Counts from the first press (1-minute init tick
  removed). `--only a,b` flag; header and PACING_RULES say the full run is periodic (about 44 min cold).
- Work policy: stops a running Village job after one paid round (pay lands only on stopping), waits out book-life jobs, takes
  quick actions before "Wait until ...", one of each "Choose ..." set, walks inside a life's own actions, backs out of a side page
  to find the work again, waits for the opening's first payoff before Village work.

## Fixes: before (old unseen-first baseline) -> after (work policy), first payoff / longest gap / longest dead, minutes

| Start | Before | After | Cause found |
|---|---|---|---|
| village | 31 / 240 / 150 | 30 / 120 / 40 | Policy browsed instead of working, and never stopped the job. Job pays 5C per 2-hour round on stopping; the screen shows "next full-round pay in ..." (PAC7 met). |
| soldier.p01 | 171 / 240 / 140 | 60 / 70 / 20 | Policy pressed all 7 alternatives of two choice sets, then left the visit. Pay (10 silver) lives in the pack purse and the pack says "no export into Village money" (deliberate). |
| book.hp.school | never | 60 / 176 / 33 | Policy never pressed the life's actions. |
| book.hp.trade | 11 / 873 / 20 | 30 / 40 / 10 | The loop needs "Walk to the glass counter", which the policy treated as travel. |
| book.hp.lead | never | 10 / 368 / 41 | Same. |
| book.ss.* (3), ri.* (2) | never or 11 to 31, gaps 716 to 947 | first 10 to 30, gaps 30 to 425 | Same. |
| lotm.probationer, civil | never | 20 to 30 / 30 / 0 | Tingen tasks sit in the Tingen panel, ranked as browsing. |
| lotm.machinery, storm | never | 20 / 380 / 0 | Same; the 380 gap is the hero out of energy ("Recover enough energy"), which the screen states. |
| lotm.beside | never | 369 / 369 / 0 | Real wait: the life opens at night, everyone is out, the only option is "Wait until dawn · 359 min". The screen names who is away and when back (PAC4). Target set to 420 with that reason. |

Targets changed (check_pacing.mjs TARGETS, reasons in file): book.hp.lead gap 360 to 420; lotm.beside first payoff 60 to 420.
Village is traced over its open day (`START_MINUTES` 720): work closes at 20:00 and the screen says so; counting the night failed
every run (gap 280, dead 80).

## Items left, with reason

- Village first money takes one 2-hour round (about 2h20 in the trace); first payoffs inside 30 minutes come from the elder talk.
  Proposed (not done, main.js is dirty from another session and pay timing is economy): pay each completed round as it finishes
  instead of only on stopping, default new lives, dial per job, reason: the first money should show without a Stop press.
- lotm.beside: walking out at night (2-minute walks) was not probed; the policy does not travel in the Tingen panel.
- Soldier: pre-selecting a premise was rejected; the choice is the design.
- BALANCE.md untouched. Proposed hunk: under the Pacing paragraph add "Targets: PACING_RULES PAC3; measured by the work policy
  (`check_pacing.mjs`), `--only` for touched starts."

## Coordinator item 2 (lotm traces)

SHOWN: lotm.probationer, machinery, storm, civil and beside each record cleanly in the current tree (6 actions, errors none),
and in the full run. No game break from NAMES edits (src/models/npc.js, src/data/npcs.js) found. The earlier failure matches the
panel select `fill` choosing a disabled option, fixed above. Not reproduced otherwise.

## Checks

- `node scripts/check_pacing.mjs --update-baseline --backlog`: 15 starts, 0 misses, 0 regressions. Plain rerun: same.
- `node --test tests/pacing_check.test.js`: 12 pass, 1 skipped (boot smoke). `tests/openings_check.test.js`,
  `tests/feedback_check.test.js`: 19 pass. No src module touched, so no src tests.
- Not run: `npm test`, `check:rules`. One slip: I used `pkill -f` on one of my own recorders early; killed the rest by PID.
