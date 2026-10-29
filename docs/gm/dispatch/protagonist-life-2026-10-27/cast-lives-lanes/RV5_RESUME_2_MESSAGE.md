# RV5 resume 2: ingest all reviewed shards and regenerate the pack and mappings

Reviewed rows now exist for: RV2 (ch9-16, 54 gaps), RV4 (ch1-3, 12 rows), RV6 (ch4-8, 14 rows), RV7 (ch9-16, 25 rows), RV8 (ch17-24, 8 rows), RV9 (volume 1 ch25-60, 35 rows),
all in `reviewed-rows-2026-10-29/*.jsonl` (private). RV2 and RV7 overlap on the same steps: the later file (RV7) wins over RV2, and a `row` verdict beats a `gap` verdict for the same step; report the conflict count.
H2 (`16d74c8b7`) added place-act operations; rows may use `read`, `prepare`, `wake`, `check time`, `sit`/`settle`, `secure`, `wait here`, so `merge_reviewed_rows.mjs` must accept them (its own validation goes through
the real `definePlaceActs`; fix the script if it still has the 8-operation list). Do:

1. Merge all shards onto the live pack `private_packs/lotm-cast/cast.json` (read only) into `pack-backups/cast-whole-book-reviewed2-candidate-2026-10-29.json`, validating through the three adapters, the native registry check (JSON-safe, no empty `requires`, `null` fares)
   and the pack validator; report rows added per kind and per shard, rejected rows with reasons (id collision with different content stops and reports).
2. Regenerate the mappings with `--reviewed` for all shards: chapters 1-24 (`chapters-1-24-reviewed.json`), chapters 1-3, and the volume-1 ladder ranges `ladder/v1-ch1-100.json` (the M4 scenes the driver uses: `/tmp/m4-lotm/merged/scenes.jsonl`;
   RV5 resume 1 found a smaller scene merge was the cause of a failure last time). Validate each with the driver's `--audit-only`.
3. Report, per range, controls before and after, and excluded (actor not the lead, not an action) counts.
Grants as RV5 plus `scripts/lead_run/merge_reviewed_rows.mjs` and its tests. Append "Resume 2" to RV5_CHECKPOINT.md with one line per check. Do not commit.
