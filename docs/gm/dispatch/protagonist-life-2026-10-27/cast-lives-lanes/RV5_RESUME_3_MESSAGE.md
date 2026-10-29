# RV5 resume 3: ingest the divination, making and inference rows and regenerate

New reviewed shards in `reviewed-rows-2026-10-29/`: RV10 (volume 1 ch61-100, 8 rows), RW5 (making, 9 rows), RW6 (inference, 56 rows), RW4 (divination; rows if any). RW1-RW3 are all gaps and are superseded by RW4-RW6 (same steps). AD2 (`4dffe0923`)
relaxed the three adapters; `merge_reviewed_rows.mjs` now accepts kinds `divination`, `making`, `inference` (pack fields `divinations.queries`, `making`, `inferences.chains`).
1. Merge all shards RV2, RV4, RV6, RV7, RV8, RV9, RV10, RW4, RW5, RW6 (later shard wins over an earlier verdict for the same step; a row beats a gap) onto the live pack `private_packs/lotm-cast/cast.json` (read only; it is the reviewed2 candidate) into
   `pack-backups/cast-whole-book-reviewed3-candidate-2026-10-29.json`; validate through all six real adapters (topic talk, journeys, place acts, divination, making, inference), the native registry JSON/requirement check, and the pack validator. Report rows added per kind and shard and rejected rows with reasons.
2. Regenerate `--reviewed` mappings for chapters 1-3, chapters 1-24 and the volume-1 ladder (use the new `--volume`/`--locator-range` support in the replay driver for the audit; `/tmp/m4-lotm/merged/scenes.jsonl`), and report controls before/after per range.
   The mapper must map steps of the three new kinds to the controls the adapters generate (check how it resolves control ids for the older kinds and do the same; add tests).
Grants as RV5 resume 2. Append "Resume 3" to RV5_CHECKPOINT.md. Do not commit.
