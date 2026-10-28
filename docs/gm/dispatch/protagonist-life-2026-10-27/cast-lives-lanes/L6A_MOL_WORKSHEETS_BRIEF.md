# L6a brief: Mother of Learning worksheets (second world, AR11)

Model: `gpt-6-luna`, low effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Independent of
L3 and L4a (no shared files). Plan: [CAST_LIVES_PLAN_2026-10-28](../CAST_LIVES_PLAN_2026-10-28.md)
sections 3.2, 12.3, 15. Do not commit: the Codex sandbox cannot write `.git`; the coordinating session
commits. Never stash, reset, force or push.

## Goal

Run the same worksheet stage for the MoL slice (chapter 1 to the first restart, `en b1 c5 p9`, named in
[L1_CHECKPOINT](L1_CHECKPOINT.md)) so the second world reaches L3-ready data. The AR11 test starts here:
the change should be a world option, not a second script.

## Steps

1. **Data probe first (5 minutes):** count, in MoL's `merged-cast-2026-10-28/`, the slice lead scenes,
   crosswalk persons and places, and routine slots. Expected roughly 25 lead scenes and 109 crosswalk rows
   (L1). Stop and report if either is under half of that.
2. Generalize `scripts/lead_run/cast_worksheet.mjs` (today it rejects any world but LOTM and any slice
   past chapter 24): take `--world lotm|mol` and a locator range (`--from`, `--to`, as
   `build_crosswalk.mjs` does) instead of a chapter number. LOTM output must stay byte-identical for the
   same inputs: rerun the LOTM command from [L2B_CHECKPOINT](L2B_CHECKPOINT.md) into a scratch folder and
   compare against the existing worksheets.
3. Write MoL worksheets to `docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/cast-worksheets/`.
   MoL forward anchors are canon presences after `c5 p9` **in the same loop only**; later restarts are
   not anchors for this loop (plan F5). Where a row's loop is unknown, put it under `anchorsOtherLoops`.

## Owned files

`scripts/lead_run/cast_worksheet.mjs`, `tests/cast_worksheet.test.js`, `cast-lives-lanes/L6A_CHECKPOINT.md`.

## Done check

- `node --test tests/cast_worksheet.test.js` passes with a new MoL fixture case and the LOTM cases unchanged.
- LOTM byte-identity check passes (state the command and result).
- One worksheet per MoL slice crosswalk person, place and organization; totals line in the checkpoint;
  one line per check.
