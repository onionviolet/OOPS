# L6b brief: Mother of Learning cast records, first loop (AR11 second case)

Model: `gpt-6.1-sol`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`, never in
the cloud. Runs alongside L4a: no shared files. Do not commit: the Codex sandbox cannot write `.git`; the
coordinating session commits. Never stash, reset, force or push.

Model this lane on L3: read the [L3 brief](L3_CAST_RECORDS_BRIEF.md) and [L3 checkpoint](L3_CHECKPOINT.md)
and produce the same shape for MoL, so the seams prove themselves on a second world. Plan:
[CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md) sections 3.2, 12-16.

## Data probe first (five minutes)

Count in the MoL worksheets ([L6a checkpoint](L6A_CHECKPOINT.md)): persons and places, lead scenes with a
day mark of the form `L?-D<n>` or `L1-D<n>`, and routine slots with a time. Expected: about 25 lead
scenes and 93 worksheets. Stop and report if under half.

## Differences from L3

- **Days come from the text where it gives them.** MoL scenes in this slice often carry an in-loop day
  mark (`D1`, `D2`); use it as the day (label from the scene's date block), and source order only between
  marks. This is the first loop only (chapter 1 to `en b1 c5 p9`); nothing from later restarts.
- **Forward anchors:** only same-loop anchors bind (L6a put the rest under `anchorsOtherLoops`). Do not
  turn other-loop appearances into anchors or into facts.
- **Existing runtime people:** L1 matched five MoL people to existing pack ids (`book.mol.*`, see the
  crosswalk). Use those ids, and do not change their pack definitions; the cast record adds schedules,
  relations and beats beside them. The pack's branch scope (`MOL_BASELINE` in `src/book_world_mol_ids.js`)
  stays as is; festival night is outside this slice anyway (plan D4).
- **Loop and reset rows:** if a schema 1.4 `reset` rule row appears in the slice, record it in a
  `resets` list with its locator; do not build a restart.

## Owned files

`src/book_world_mol_cast.js` (pure data plus validator, same exports pattern as L3:
`MOL_CAST`, `validateMolCast()`, `molAnchorProbes()`), `tests/book_world_mol_cast.test.js`,
`cast-lives-lanes/L6B_CHECKPOINT.md`. No other file.

## AR11 report (required in the checkpoint)

List every place where MoL needed something `src/cast_schedule.js`, `src/beat_records.js` or the L3 shape
did not provide. Do not edit those files; name the gap. "None" is a valid answer only after the lookup.

## Done check

Same as L3: focused test passes (labels and locators or fill basis on every row, schedule rows validate,
`lintAnchors` empty, beats reference existing actors and places, no string over 200 characters, no source
text); checkpoint with counts per tier, rows per label, beats per principal, PL-A46 rejections, the AR11
report and one line per check; `npm run check:arch` no new cycle.
