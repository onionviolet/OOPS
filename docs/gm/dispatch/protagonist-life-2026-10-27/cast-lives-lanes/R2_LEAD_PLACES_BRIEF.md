# Lane brief: R2, give the pack every place the lead goes in chapters 1-24 (ON6 data gaps first; LSD151)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`; scripts and private outputs
only, no `src/`, and **do not edit `private_packs/`** (H1 is writing pack rows; the coordinator swaps packs).
Do not commit. Never stash, reset, force or push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md);
[R1](R1_CHECKPOINT.md), [X2](X2_CHECKPOINT.md) checkpoints. Rules: AD36, AD44, CLR1-CLR4, CLR12; SR1-SR24 for places.

## Why

X2 resolves only 309-340 of 1,491 place references in the lead's chapters 1-24 steps, so only 6-7 replay steps
become walks. The pack has 45 places (R1's candidate barely more). The lead visits many places the pack lacks.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Unresolved place references in X2's `candidate-report.json` and `live-report.json` | about 1,150 | | yes |
| Merged place rows for those references in M4's output (`m4-whole-book-2026-10-29/merged/`) with containment or district evidence | count | | yes |
| Pack place shape (fields R1 preserves: district, travel, kind, aliases) | list | | yes |

## Scope

- Extend `scripts/lead_run/build_cast_pack.mjs` (R1's generator) with a places stage: for each place the lead's
  steps reference in the range, emit a pack place row from merged rows, with `parent` or district from containment
  evidence, kind, aliases, locator, and provenance (`canon` or `fill`, LSD108). Sub-places (a room, a desk corner)
  attach to their containing place instead of becoming walk targets; streets and buildings the lead walks between
  become places with travel minutes from evidence or a district default marked `fill`.
- Base pack rows win conflicts (R1 rule). No fuzzy merges.
- Output to `/tmp/r2-pack/cast.json`; rerun X2's mapping against it and report place resolution and walk counts.
- **Files owned.** `scripts/lead_run/build_cast_pack.mjs`, `tests/build_cast_pack.test.js` (new cases), private
  outputs under `.../r2-places-2026-10-29/`, checkpoint `cast-lives-lanes/R2_CHECKPOINT.md`.

## Done check

Focused tests pass (a sub-place attaches to its parent; a new street gets a district and a `fill` travel time; a
base row wins); the candidate pack validates with `node scripts/check_private_cast.mjs` in a scratch copy; X2's
generator rerun reports walk counts. Counts only in the checkpoint. Stop on: probe gate failure, a needed `src/`
change, any paid call.
