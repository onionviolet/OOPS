# Lane brief: M4, crosswalk and worksheets across all eight LOTM volumes (ON1, X5, X12)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`; scripts only, no `src/`.
Do not commit; the coordinator commits. Never stash, reset, force or push.
Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); [M3 checkpoint](M3_CHECKPOINT.md) (read first); batch-reading
[READINESS_AND_SCOPE](../../batch-reading-2026-10-27/READINESS_AND_SCOPE.md) section 10 (X5 personas, X11 lead, X12
one registry). Rules: AD36, AD44, AD45, CLR2, CLR3, CLR4, CLR12; LSD151, LSD156-LSD159.

## Why

M3 merged all 712 shards (volumes 1-8), but `build_crosswalk` requires both range endpoints in one volume, so the
whole-book run stopped there; the crosswalk and worksheets still cover volume 1 only. The lead's playthrough needs
the whole book's lead scenes, cast and routines.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Lead scenes per volume in `/tmp/m3-lotm` (M3 table) | 539, 627, 621, 487, 365, 224, 140, 98 | | yes (stop if `/tmp/m3-lotm` is missing) |
| Scenes whose `pov` is an actor id other than `lead` | count | | no (report) |
| Where `build_crosswalk` and the worksheet stage compare locators by chapter only | list | | yes |

## Scope and seam

- **Outcome.** `world_lead_pipeline.mjs lotm --from 'zh 第1章 p1' --to 'zh b8 第99999章 p99999'` (M3's `--match`)
  runs all seven stages into `/tmp/m4-lotm`. Range checks use the volume-aware comparison M3 added (reuse it;
  export it from `merge_shards.mjs` if needed; no second copy).
- **Lead personas (X5).** Where a scene's `pov` is a known cover identity of the lead, it counts as a lead scene.
  Take the persona list from evidence in the merged rows (people rows that the reviewed overlay or `reveals`
  rows link to the lead), never from guesses; write unresolved candidates to a private review file in the output.
  Counts only in the checkpoint.
- **Report** per volume: lead scenes, crosswalk-selected people, routines with usable timing, worksheets written,
  wall time, peak memory, output size.
- **Files owned.** `scripts/lead_run/build_crosswalk.mjs`, `scripts/lead_run/cast_worksheet.mjs`,
  `scripts/lead_run/world_lead_pipeline.mjs`, `scripts/lead_run/merge_shards.mjs` (export only), their tests
  (`tests/lead_run_crosswalk.test.js`, `tests/world_lead_pipeline.test.js`, new cases only), checkpoint
  `cast-lives-lanes/M4_CHECKPOINT.md`. Outputs stay in `/tmp/m4-lotm`.

## Done check

- Focused tests pass, with a synthetic two-volume crosswalk range and a persona scene counted as lead.
- The whole-book run completes; volume 1's numbers match `/tmp/m2-lotm` or the checkpoint explains each difference.
- `node scripts/lane_review.mjs` with grants and paths. Checkpoint: one line per check, counts only, no canon names
  or source text. Stop on: probe gate failure, a needed `src/` change (prepared patch instead), any paid call.
