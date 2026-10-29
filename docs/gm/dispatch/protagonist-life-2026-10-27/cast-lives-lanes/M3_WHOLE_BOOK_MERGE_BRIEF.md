# Lane brief: M3, merge the whole of LOTM (volumes 1-8) into the lead pipeline (ON1, LSD151)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`; scripts only, no `src/`.
Beside F1 and P5 (they own `src/`). Do not commit; the coordinator commits. Never stash, reset, force or push.
Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); [M1](M1_CHECKPOINT.md), [M2](M2_CHECKPOINT.md),
[P1](P1_CHECKPOINT.md) checkpoints; batch-reading [READINESS_AND_SCOPE](../../batch-reading-2026-10-27/READINESS_AND_SCOPE.md)
section 10 (X2, X5, X11, X12) and W3. Rules: AD36, AD44, AD45, CLR2, CLR3, CLR4, CLR12.

## Why

Weibao 2026-10-29: the lead's playthrough should finish his journey, and LOTM's reading should be covered entirely.
The whole book is read: volumes 2-8 ran on 2026-10-28 (`overnight_2026-10-28x-lotm`, all five passes, schema 1.3,
592 shards with `lotm<V>c<NNN>` prefixes and part-aware locators `zh b<V> 第N章 pM`). But every gameplay merge so
far (M1, M2, `/tmp/m2-lotm`) took only volume 1's 72 shards: `loadShards` skips `route: batch` headers unless asked.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| `lotm[2-8]c*m_header.json` files in the private lead-run dir | about 592 | | yes (stop under 400) |
| Census `partial` and people `json-parse` shards in the run log (`batch/overnight_2026-10-28x-lotm.jsonl`) | 47 and 7 | | no (list them) |
| Locators that `parseLocator` reads with a volume (`zh b<V> ...`) on a 20-row sample | all | | yes |
| Volume 1 shards in `/tmp/m2-lotm/merged/merge_report.json` | 72 | | no |

## Scope and seam

- **Outcome.** One command builds records for the whole book: volume 1 (as merged today, 1.4 over 1.3) plus
  volumes 2-8 (1.3), in book order by locator, into `/tmp/m3-lotm`. Use `world_lead_pipeline.mjs` with `--match`
  and `--from 'zh 第1章 p1' --to 'zh b8 第99999章 p99999'` (or the form `parseLocator` accepts) before changing code.
- **Fix only what the run shows:** locator ordering across volumes, id collisions between volumes (one world registry,
  X12: the same person or currency across volumes stays one id), lead personas (X5: the lead under a cover identity is
  still `pov: lead`), and scale (keep T1's lean output; report wall time, peak memory and output size).
- **Report.** Per volume: shards, scenes, lead scenes, people, routines with usable timing (LSD156-LSD159),
  rules, places; registry size; collisions for review; the partial and parse-failure shard list (the paid retry
  list for November, which is Weibao's and the batch-reading session's call, not this lane's).
- **Files owned.** `scripts/lead_run/world_lead_pipeline.mjs`, `scripts/lead_run/merge_shards.mjs`,
  `scripts/lead_run/schema_union.mjs`, `tests/world_lead_pipeline.test.js`, `tests/merge_shards.test.js` (new cases
  only), checkpoint `cast-lives-lanes/M3_CHECKPOINT.md`. Outputs stay in `/tmp/m3-lotm`, never in tracked files.

## Done check

- Focused tests pass, with a synthetic case for cross-volume locator order and one for a person seen in two volumes
  keeping one id.
- The real run completes; volume 1's counts match `/tmp/m2-lotm` (or the checkpoint explains each difference).
- `node scripts/lane_review.mjs` with grants and paths. Checkpoint with one line per check (command, result, gaps),
  counts only, no canon names or source text. Stop conditions: the probe gate fails; the run needs `src/` changes
  (write a prepared patch instead); a paid call of any kind.
