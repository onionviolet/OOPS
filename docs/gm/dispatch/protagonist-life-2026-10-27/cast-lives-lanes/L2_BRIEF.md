# L2 brief: the cast schedule module (paste into Codex)

Model: `gpt-6-luna`, low effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Independent
of L1 (no private data needed): it can run at the same time. Plan:
[CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md) sections 2.1, 4, 8.3, 9.5 and 10.2.

## Goal

A pure leaf module that answers "where is this person now, and if away, when are they back", from
schedule rows, using the game's existing calendar readers. No save field, no RNG, no clock of its own.

## Read first

`.claude/rules/runtime-code.md`, `docs/ARCHITECTURE_RULES.md` (AR1-AR16), `src/world_rhythm.js`
(`recurringWindow`, `calendarMinutes`), `src/world_day_index.js` (`dayIndex`), `src/beat_records.js`
(style and `check` helpers from `src/basics.js`).

## Row shape (all fields except `actor`, `place`, `from`, `to` optional)

`{actor, place, from, to, recurrence, until, band, what, label, locator, source, weight}`

- `from`/`to`: minutes inside the day, or a time-of-day band (night, dawn, morning, noon, afternoon,
  evening) mapped to fixed minute ranges in one exported table.
- `recurrence`: `once` (default when absent), `daily`, `weekdays`, `weekly`, `monthly`, `term`,
  `seasonal`, `yearly`, `irregular`. `irregular` gives a window with no fixed phase: report "irregular",
  never a guessed time.
- `until`: last day index the row applies; absent means no end.
- `label`: S, T, I, U or `fill`. `source`: `canon`, `routine`, `fill` or `intention` (CL63; accepted,
  unused in wave 1). `weight`: optional number (CL21), stored, not used yet.
- Absent means silent, not "no" (schema 1.4 rule).

## Exports

- `whereabouts(rows, actor, at)`: `{place, row}` when a row covers `at`, else
  `{place: null, nextAt, nextPlace}` with the next covering window, or `{place: null, irregular: true}`.
  Precedence when rows overlap: `canon` over `intention` over `routine` over `fill`; ties by later
  `locator`.
- `lintAnchors(rows, anchors)`: anchors are `{actor, place, at}` canon facts; return every `fill` or
  `routine` row that places the actor elsewhere at an anchor's time (WA24). Canon rows never fail.
- `awayReason(result, labels)`: the player sentence shape "Away; usually back by [band] at [place]",
  using the place label map passed in. No sealed text.

## Owned files

`src/cast_schedule.js`, `tests/cast_schedule.test.js`. No other file. No `main.js`, `save_files.js` or
`display.js` line (AR1).

## Done check

- `node --test tests/cast_schedule.test.js` covers: a weekday row on a weekend day returns next Monday's
  window; `once` outside its window returns null with no next; `irregular`; precedence; `until`; an
  anchor contradicted by a fill fails the lint and the same anchor contradicted by a canon row passes.
- `npm run check:arch` shows no new cycle.
- Report "engine ready, not integrated" (AR10). The consumer arrives in L4.

## Rules

AR3 (no second clock or location store), AR5, AR10, AR14 (seam: pure leaf module read by the LOTM host
sync in L4), AD36. Shared checkout: own paths only, fresh HEAD, no stash, reset, force or push, no
`Co-Authored-By` trailer.
