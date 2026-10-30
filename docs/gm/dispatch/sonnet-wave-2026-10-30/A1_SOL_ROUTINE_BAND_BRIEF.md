# A1 (Sol medium): routines for a chapter band in whole-book builds

Owner: L-A. Rules: AR3, AR7, AR10, AD36, AD38, AD43, CLR2, CLR9. Ledger items 1, 2, 4 (GM1, GM5): Klein and the Nighthawk/household routines past chapter 30, plus opening hours.
Book text never enters tracked files; read only the private merged rows named below. No commits, no web, no `.git`, no edits outside owned files.

## Owned files
- `scripts/lead_run/build_cast_pack.mjs` and `tests/build_cast_pack.test.js` only.

## Problem
`buildCastPack` skips the whole routine loop in whole-book mode (`for (const row of (wholeBook ? [] : peopleRows))`, about line 185), so a whole-book candidate carries only the ch 1-24 routines (82 in the live pack) while the merge holds 1,852 routine slots (1,406 in ch 31-213; the ledger lists Klein 276, dunn-smith 126, leonard-mitchell 66, benson 54, melissa 47, old-neil 46, audrey-hall 45, luo-shan 40, frye 31 missing).

## Task
1. Let `--whole-book` with `--from N --to M` build routines and their order edges and `worldHours` for slots whose locator falls in the slice, using the same row shape, ids, `usable` rule, `roleHours` and `routineBand` as the slice path. Without `--from/--to` narrower than the book, behaviour is unchanged.
2. Default: the existing ch 1-24 output must be byte-identical when the slice is ch 1-24 (add a test that pins this on synthetic input).
3. Report in the run's report: routine total, usable, and unresolved-place gaps for the band.
4. Test on synthetic rows only: a band keeps in-band slots and drops out-of-band ones; a slot with an unknown place is a gap, not a row; unchanged ch 1-24 output.
5. Do not run the builder against the live private pack and do not write into `private_packs/`. A candidate output may be written under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/a1-candidate/` (gitignored).

## Done check
`node --test tests/build_cast_pack.test.js` passes. Final message: the diff summary, test result, and one line on any assumption you made.
