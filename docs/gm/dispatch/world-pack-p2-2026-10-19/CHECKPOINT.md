# World pack loader P2: task record, 2026-10-19

Slice P2 of the [scale plan](../../../IDEABOARD_SCALE_PLAN_2026-10-19.md): WAC8, WAC9,
WAC10, WA17, WAC28. Branch `claude/p2-pack-loader-50a210`. Rules applied: AR1, AR2, AR3,
AR9, AR10, AR11 ([architecture rules](../../../ARCHITECTURE_RULES.md)), WA1, WA17, WA19, WA21,
AD36. Target viewport: 1920x1080 desktop; mobile deferred. No gameplay change.

**Seam:** domain registry (AR2). `src/world_pack_registry.js` registers a `world_packs`
domain (projection only, no save, no tick) from a module the runtime already imports, so
`main.js` gains no line (AR1). The registry installs the pack; `book_world_mol_content.js`
and `book_world_mol_actions.js` read it and keep their export names, so about ten consumers
are untouched.

## What changed

- `src/world_packs/book_mol_pack.js`: plain-data `yairpg.world-pack` with id `book.mol`
  (released prefix, WA9), nine people records, and Cyoria's definitions in `native`.
- `src/world_pack_registry.js`: bundled list, `loadWorldPacks`, loud failure when a pack is
  dormant or has errors (an empty Cyoria never installs silently), `world_packs` domain.
- Adapters: about 120 lines of command and definition builders left `book_world_mol_actions.js`;
  `book_world_mol_content.js` is now 20 lines.
- `src/world_pack_mol.js` (lint-format coverage pack): six laws on existing `mol.*` facts
  (WAC9), job, food and price records citing command IDs (WAC10). K2 and K8 now T2, core floor met.
- Tests: `tests/world_pack_registry.test.js` (WAC28, golden hash, dormant failure, domain);
  `tests/world_pack.test.js` coverage assertions updated.
- `scripts/mol_pack_roundtrip_browser.cjs`: fresh-origin save, reload, Export, Import digest.

## Evidence

| Check | Input | Result |
| --- | --- | --- |
| Export equality | sha256 of all non-function exports of the content module, before vs after | identical; pinned in the registry test |
| Engine journey | `simfuzz` 6 seeds x 300 steps, baseline (HEAD archive) vs this branch | all final hashes identical |
| Browser, 1920x1080, fresh origin | both bundles: boot, talk to elder, save, reload, Export, Import | normalized digests identical at all three points; same four 404s in both; no page errors |
| `npm test` | this branch | see report |
| `check:arch` | this branch | growth 0 for main.js, display.js, save_files.js; edges unchanged |
| `check:rules` | this branch | PASS |

Digest noise removed (per-run only): `saved_at`, `last_rewarded_export`, RNG seeds, UUIDs.

## Gaps (implemented-unverified)

- **No browser journey into Cyoria itself.** No script reaches Cyoria today and the entry
  path (retained-body chart, native binding) was not reachable from a fresh game in a few
  clicks. Cyoria behavior is covered at engine level by simfuzz and
  `book_world_native_binding.test.js`, not by a played browser loop. Needs a Cyoria journey
  script; this is the acceptance backlog item for WA19.
- Save pin of pack revision (WA10, WAC5) not added; deliberately keeps saves identical.
- `dist/` and `index.html` were rebuilt locally for the browser check and not committed.
  Rebuild after merge.
- `MOL_IDS`, locations, footprints and baseline text still live in `book_world_mol_ids.js`
  (names the pack cites, not definitions); moving them is a follow-up.
- Pack-in-JS: the pack is a `.js` data module because the architecture scan only resolves
  `.js` imports under `src/`; it stays JSON-round-trippable (tested).
