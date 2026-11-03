# lotm_slice: per-episode tooling for Klein slice builds (run from repo root; stdout or `--out`; no browser, no build)
1. T1 `node scripts/lotm_slice/prescan.mjs <slice>/reviewed-episode.json` (or `build-episode.py`): lists EVERY string over
   200 characters (field path, length, cut needed); exit 1 if any. The cap is validateLotmCast's walk() in
   src/book_world_lotm_cast.js (`length > 200`, UTF-16). A reviewed JSON scans acts/sequences/visits only (`--all` for the rest,
   `--limit N`). Builder asserts fire before the JSON exists, so scan the .py first (`--limit 150` shows near misses).
2. T4 `node scripts/lotm_slice/gen-runner.mjs <slice>/reviewed-episode.json --origin <prior>/completed-checkpoint.json --out <slice>/play-episode.mjs`
   Optional: `--carry-fact key`, `--leak actor=regex`, `--absent actor=substring`, `--seed`, `--wall YYYY-MM-DD`, `--slice-dir`, `--bundle`.
   Asserts each fact/knowledge effect and last player location per act, money/inventories unchanged (only when acts have no
   costs or other effect types), export/import round trip, first-intent counterfactual; writes browser-result.json.
3. Run it: copy the KJ3E proof bundle (default root, sha 919b17d3...) at
   `docs/research/novels/lord-of-mysteries/private/proof-bundles/kj3e-bundle-919b17d3/` to `/tmp/lotm-<id>`, overlay the new
   `private_packs/lotm-cast/cast.json`, then `node <slice>/play-episode.mjs /tmp/lotm-<id>`. A stale pack fails fast.
4. T6 `node scripts/lotm_slice/receipt-fields.mjs <slice>/browser-result.json [--bundle-sha <sha>]`: verification row, shas,
   boot/import counts, timings, page errors, step list to paste.
Test: `node --test tests/lotm_slice_tools.test.js`.
