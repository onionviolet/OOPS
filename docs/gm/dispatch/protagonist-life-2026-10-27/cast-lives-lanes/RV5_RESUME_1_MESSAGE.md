# RV5 resume 1: the reviewed mappings fail the replay driver's source-step check

RV5 is committed (`c12130d40`). The browser load of `pack-backups/cast-whole-book-reviewed-candidate-2026-10-29.json` is fine (play button in 6.2 s). But the replay driver
rejects both reviewed mappings before opening the page: `AssertionError: every source step exactly once` (`lotm_ui_replay.mjs` validateMapping), with the diff showing that
the selected source steps (from `/tmp/m4-lotm/merged/scenes.jsonl`, `--chapters 1-3` on `x1-be-mapping-2026-10-29/chapters-1-24-reviewed.json`, and `--chapters 1-3` on
`chapters-1-3-reviewed.json`) include steps `lr.lotm.main.200101#1 ... 200106#...` (the `2001xx` scene family) that are **missing from the reviewed mapping** (the mapping has the
`001..111` family). The previous un-reviewed ch1-24 mapping, same driver and scenes, passes. So the `--reviewed` path (or the regenerated range) drops or renames the `2001xx` scenes, or
reorders scenes so the driver's expected order differs. Compare the row id sets of the old `chapters-1-24.json` and the reviewed one, find the cause (a locator-range clipping, a scene
filter, or the reviewed rows replacing instead of overlaying), fix `build_replay_mapping.mjs`, add a regression test (a mapping with and without `--reviewed` must contain the same set of
row ids; reviewed rows only change status, control and route), regenerate both reviewed mappings. Check by running the driver's own validation in Node: 
`node scripts/headless/lead_runs/lotm_ui_replay.mjs --seat be --mapping <reviewed mapping> --scenes /tmp/m4-lotm/merged/scenes.jsonl --l4b-gaps <gaps.jsonl> --chapters 1-3 --audit-only --out <tmp>`
(`--audit-only` needs no browser; the gaps file is `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4b-probe-2026-10-28/gaps.jsonl`). Grants as RV5. Append "Resume 1" to RV5_CHECKPOINT.md. Do not commit.
