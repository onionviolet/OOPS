# V2 resume 6: volume-aware selection for the replay ladder

The driver's `--chapters a-b` selects by chapter number alone, so on the volume-1 ladder mappings (`x4-whole-book-mapping-2026-10-29/ladder/v1-ch1-100.json`, `v1-ch101-200.json`, and the other volume ranges)
RV5 found that the audit "selects chapters across volumes" (chapter numbers repeat per volume) and fails "every source step exactly once". Add `--volume <n>` (default: volume 1 when the locator has no volume prefix, as the mapper's locators do:
`zh 第N章` for volume 1 and `zh bN 第N章` for volume N) and a `--locator-range 'zh 第25章..zh 第60章'` style bound that matches the mapper's `--from-locator/--to-locator`, so the ladder mappings can be replayed in arc-sized ranges and
bounded batches (`--max-steps`, `--offset`). The existing `--chapters` must keep its meaning for volume 1. Add tests with a synthetic two-volume fixture (same chapter numbers in volumes 1 and 2) proving the right steps are selected, and
verify with `--audit-only` against the real ladder mappings and `/tmp/m4-lotm/merged/scenes.jsonl` (gaps file: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4b-probe-2026-10-28/gaps.jsonl`) for volume 1 chapters 25-60 and volume 2 chapters 1-40.
Grants: `scripts/headless/lead_runs/lotm_ui_replay.mjs`, `tests/lead_replay_score.test.js`, `V2_CHECKPOINT.md` ("Resume 6", one line per check). You cannot run Chrome. Do not commit.
