# RV5 resume 4: ingest the body, ability and exchange rows

New shards in `reviewed-rows-2026-10-29/`: RW7 (body), RW8 (ability), RW9 (exchange, all gaps); AD3 (`3aab5bc18`) taught the merge and the mapper the kinds `exchange`, `body`, `ability`. Repeat resume 3 with all shards (RV2, RV4, RV6-RV10, RW4-RW9; later shard wins, a row beats a gap) onto the live pack
(`private_packs/lotm-cast/cast.json`, the reviewed3 candidate, read only) into `pack-backups/cast-whole-book-reviewed4-candidate-2026-10-29.json`; validate through all nine real adapters, the native registry check and the pack validator; regenerate the `--reviewed` mappings (chapters 1-3, chapters 1-24, the volume-1 ladder) and run the driver's `--audit-only` on each.
Report rows per kind and shard, rejected rows with reasons, and controls before/after per range. Grants as resume 3. Append "Resume 4" to RV5_CHECKPOINT.md, one line per check. Do not commit.
