# L2b brief: cast worksheets (CL94)

Model: `gpt-6-luna`, low effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`, never in the
cloud (the index data is gitignored). Starts after L1's checkpoint reports done. Plan:
[CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md) sections 2 (stage S2), 2.2, 12.3.

## Goal

One private worksheet per slice entity, so the L3 implementer opens one file per person or place and sees
every row and locator about them in order. This is stage S2, which the L2 brief left out.

## Inputs

- The LOTM merged dir and the crosswalk path named in [L1_CHECKPOINT.md](L1_CHECKPOINT.md) (read it first;
  use its paths, not guesses). Slice: chapters 1-24 (`zh 第1章` to `zh 第24章`).
- `src/cast_schedule.js` row shape (`day`, `from`, `to`, `recurrence`, `until`, `source`, `label`,
  `locator`), so routine slots are pre-shaped as candidate schedule rows.

## Output

`scripts/lead_run/cast_worksheet.mjs <mergedDir> --crosswalk <file> --slice 1-24 --out <privateDir>/cast-worksheets/`
writes one JSON per crosswalk person, place and organization (not items), each with:

- `id`, `runtimeId` (from the crosswalk), `kind`, `label`, tier hint: `present` and `partial` counts in
  lead scenes (CL2), first and last locator in the slice.
- `scenes`: every scene in the slice where the entity is present or partial, in locator order: beat id,
  place, date block, `outcomes` touching it, `choices` and `motives` when it is the pov.
- `whereabouts` (dated, with status), `routine` slots, `relations`, `knows`, `reacts`, `wants`, each row
  with label and locator, unchanged.
- `candidateRows`: routine slots and whereabouts reshaped as `cast_schedule` rows with `source:
  'routine'` or `'canon'` and the original label; slots without a usable time get `from`/`to` null and a
  `gap` note instead of a guess.
- `anchors`: the entity's canon presences after chapter 24 (first three by locator), as forward anchors
  `{actor, place, locator}`.
- Unknown fields from schema 1.4 rows pass through untouched.

Also print a one-line summary per entity and totals (entities, rows, rows with a usable time) to stdout.

## Owned files

`scripts/lead_run/cast_worksheet.mjs`, `tests/cast_worksheet.test.js` (fixture rows only). Private
outputs only under the book's `private/` folder. Do not edit `build_crosswalk.mjs`, `merge_shards.mjs`
or `src/`.

## Done check

- `node --test tests/cast_worksheet.test.js` passes.
- Every crosswalk person, place and organization in the slice has a worksheet; the totals line is
  copied into a new `cast-lives-lanes/L2B_CHECKPOINT.md` with one line per check (command, result, gaps).
- No source text in any committed file. Commit only the two owned files and the checkpoint from a fresh
  HEAD; no stash, reset, force or push; no `Co-Authored-By` trailer.

## Stop and report if

The crosswalk path or format in L1's checkpoint is missing or differs from this brief.
