# PAC lane report: pacing and feel (2026-11-06)

CHECKPOINT: partial. Recorder, check, baseline, rules, backlog and test are written and pass. The trace policy is a weak
player (see P1), so book and Tingen "never" readings are mostly policy gaps, not design verdicts. A final no-flag rerun of
`check_pacing.mjs` was still recording when this report was written (other sessions keep editing `src/`, which changes the
trace cache key); the same-tree run that wrote the baseline reported 0 regressions.

## Sweep (SHOWN: ran it; seed 1, 100 actions, up to 960 game minutes, 10 min per press)

| Start | First payoff | Longest gap | Longest dead | Payoffs |
|---|---|---|---|---|
| village | 31 | 240 | 150 | 12 |
| book.hp.trade | 11 | 873 | 20 | 1 |
| book.ri.keeper | 11 | 716 | 11 | 7 |
| book.ri.academy | 31 | 916 | 11 | 1 |
| soldier.p01 | 171 | 240 | 140 | 12 |
| book.hp.school, hp.lead, ss.apprentice, ss.trial, ss.company, lotm.* (5) | never | whole trace | 0 to 30 | 0 |

40 target misses are recorded in the baseline; 0 regressions. Full table: [PACING_BACKLOG](../../../pacing/PACING_BACKLOG.md).
Village: first payoff at 31 minutes (an unlock from the elder's greeting), but a 150-minute dead stretch and money never
rose (the policy did not reach paid work).

## Findings

- F1: the Village opening pays inside 31 minutes, then goes quiet for up to 150 minutes (dead stretch) while the policy browses.
- F2: A Soldier's Life pays at 171 minutes and has a 140-minute dead stretch; the visit's first hour is quiet.
- F3: 6 of 9 book and Tingen starts show no payoff in 16 played hours. Book lives keep stock and jobs in their own records,
  so money, item and unlock signals understate them. Treat as "unmeasured", not "slow".
- F4: a passive skill (Breathing, Patience) levels around minute 600 in every life. It was masking the real first payoff, so
  it is excluded (PASSIVE_SKILLS in `check_pacing.mjs`).
- F5: BALANCE.md has no pacing target in any row; PAC3 supplies the first written ones.

## Files written

`scripts/headless/trace.mjs` (shared recorder, schema in its header), `scripts/check_pacing.mjs`, `scripts/pacing_baseline.json`,
`docs/PACING_RULES.md` (PAC1-PAC8), `docs/pacing/PACING_BACKLOG.md` (generated), `tests/pacing_check.test.js`,
`docs/gm/dispatch/quality-deep-dives-2026-11-06/TRACE_READY.md`, this report.

## Checks

- `node --test tests/pacing_check.test.js`: 9 pass, 0 fail, 1 skipped (the boot smoke, `YAIRPG_PACING_BOOT=1`). SHOWN.
- `node scripts/check_pacing.mjs --update-baseline --backlog --jobs 3`: 15 starts, 0 regressions, wrote the baseline. SHOWN.
- Not run: `npm test`, `check:rules` (out of lane). Not exercised: the "Begin with a system" start, Mother of Learning, the
  developer Klein route (not in the start list).

## Proposed owner hunks (coordinator applies)

1. `package.json` scripts: `"check:pacing": "node scripts/check_pacing.mjs"` (not part of `check:rules`; it plays the game, about
   10 to 30 minutes cold, near a minute warm).
2. `docs/BALANCE.md`, add under the Stance paragraph:
   > **Pacing targets.** Felt-pacing targets (first payoff, longest dead stretch, unlock gaps) are proposed per start in
   > [PACING_RULES](PACING_RULES.md) (PAC1-PAC8), measured by `npm run check:pacing`. Rows below that say "No target" for pacing
   > still have none until those lines are accepted.
3. `docs/RULES_INDEX.md`: a register row for PACING_RULES (PAC1-PAC8, proposed) and a router row "pacing, first hour, dead stretch".
4. `scripts/headless/README.md`: one line under Scripts: `trace.mjs --list-starts | --start <id>`: JSONL playthrough trace.

## Top five backlog items

1. P1: make the trace policy work-aware (a per-start scripted route from `lead_runs` or a verb list), so Village money and book
   payoffs are measured rather than missed. Without it F3 stays unmeasured.
2. P2: give book and Tingen lives a payoff signal the trace can read (a `changed` bucket whitelist per world, or a published
   "progress" fact), then re-baseline.
3. P3: Village dead stretch (150 min): name what is happening and what ends it in the scene line (PAC7).
4. P4: Soldier's Life first hour: something should land inside 60 minutes (PAC4); today 171.
5. P5: add the missing starts (system start, Mother of Learning) and an away-pacing trace (PAC6).

## Open questions as defaults

- Default: keep targets as proposals until Weibao reviews them; tighten the Village row first.
- Default: cold full runs belong in a nightly or pre-release slot, not the commit gate.
