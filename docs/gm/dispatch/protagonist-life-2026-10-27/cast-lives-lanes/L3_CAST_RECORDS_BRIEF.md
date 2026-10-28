# L3 brief: LOTM cast records for the first lived week

Model: `gpt-6.1-sol`, medium effort (reading paragraphs and judgment). Runs locally in
`/Users/weiwei/code/yet-another-idle-rpg`, never in the cloud. Starts when
[L2B_CHECKPOINT.md](L2B_CHECKPOINT.md) reports done. Plan:
[CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md) sections 2, 3.1, 8, 9 and 12-14.

## Goal

Pack data, in our own words with locators, for the people and places of LOTM chapters 1-24 who get a
life in wave 1: schedules, relations, dated knowledge and arc beats. **Data only**: no host wiring, no
start profile, no save change. L4 wires it.

## Inputs

- Worksheets from L2b (path in its checkpoint), one per entity.
- The crosswalk and fitness report from [L1](L1_CHECKPOINT.md). LOTM has 297 proposals and 0 runtime matches;
  that is expected (the existing Tingen pack uses original roles).
- Cited paragraphs: `node scripts/lead_run/cite_paragraphs.mjs <privateDir> --id <id> --context 2`. Read
  locally; never paste source text into a committed file (no run of more than five source characters
  outside names).
- `src/cast_schedule.js` row shape: `{actor, place, day, from, to, recurrence, until, label, locator,
  source, weight}`. `once` rows need `day`.

## Scope by tier (WA43, plan D5)

1. **Principals (full record, at most 8):** rank by present plus partial counts in the worksheets, with
   household roles kept in (CL2). Expected: the lead, his two siblings, Dunn Smith, and up to four more by
   count. Record: schedule rows, relations with basis, dated `knows`, wants, and **arc beats** in
   `beat_records` shape (`{id, dayIndex, until?, actor, needs?, effects, notes?}`) for every slice scene
   where they are present.
2. **Recurring (schedule plus relations):** the next 12 by count.
3. **Role people** (landlady, vendors, clerks): one role record per place and role, schedule only.
4. **Places:** every place a principal's schedule or beat uses, with a label and, where the text gives
   them, opening hours.
Notes from the L2b review (2026-10-28): the remote gathering members (Audrey Hall, Alger Wilson) rank
high by count but stay at M1 with dated whereabouts only (plan 3.1); take the next people by count
instead. Some worksheet ids are raw place text ("unspecified", a dream, "school (unnamed)"): use the
worksheet's `runtimeId` from the crosswalk, fold vague variants into the named place they describe when
the paragraph shows it, and skip non-places (a dream, "unspecified") with a reason in the checkpoint.

5. Everyone else stays at their M1 rung (no record); list them by id and count in the checkpoint.

## Timing (the main gap)

L1 measured that only 11 of 131 slice routine slots have a place and a time. So:

- A row from the text keeps its label (S, T, I) and locator.
- Where the text gives days but no hour, fill from the role's ordinary mechanism (a clerk's office hours,
  school hours, household meals): `source: 'fill'`, `label: 'fill'`, with a `basis` naming the role and
  any LOTM row that states such hours (search `cite_paragraphs --topic` for hours, bells and clocks first).
- Day numbering: day 1 is the lead's first slice scene. Dates the text states pin days; unsettled dates
  keep `U` and a window, not a guess (plan R2).
- Run `lintAnchors` on every actor with the worksheet's forward anchors; a failing fill is changed, never
  a canon row.

## Rules

WA5 (world owns nouns), WA22-WA24, WA35, WA43, PL-A46 (drop a row whose claim is not in its paragraph;
never repair from memory or outside knowledge of the book), CL86 (items are types unless rows show one
object), CL24 (record the time model as `U`), CL25 (no later-volume facts), AR1-AR16 (data module, no
registration lines). Sealed truths: none expected for LOTM; if a row needs one, use an opaque id. The
lead's cheat-space scenes become beats with `mechanism` set, which the resolver reports as blocked
(LP9).

## Owned files

`src/book_world_lotm_cast.js` (pure exported data plus a small validator), `tests/book_world_lotm_cast.test.js`,
`cast-lives-lanes/L3_CHECKPOINT.md`. Do not edit any other `src/` file.

## Done check

- `node --test tests/book_world_lotm_cast.test.js` passes. It checks: every row has a label and a
  locator or a fill basis; every schedule row passes `cast_schedule` validation; `lintAnchors` returns
  nothing; every beat's actor and place exist in the data; no string over 200 characters.
- Checkpoint: counts per tier, rows by label (S, T, I, U, fill), beats per principal, rows dropped under
  PL-A46 with their ids, one line per check.
- `npm run check:arch` no new cycle. Do not commit: the Codex sandbox cannot write `.git`, so the
  coordinating session runs the full `npm test` once and commits your owned paths. Never stash, reset,
  force or push.

## Stop and report if

The worksheets are missing for more than two of the expected principals, a principal's rows conflict in
a way the paragraphs do not settle, or any step would need a paid call.
