# P2 pack loader and Cyoria conversion: task record (2026-10-19)

Slice P2 of the [scale plan](../../../IDEABOARD_SCALE_PLAN_2026-10-19.md#5-sequenced-build-order-proposal).
Status: **implemented-unverified until the evidence table below is filled.** Not human-accepted.

## Rule codes applied

WAC8, WAC9, WAC10, WAC28, WA1, WA9, WA10, WA17, WA21 ([world absorption](../../../WORLD_ABSORPTION_RULES.md));
AR1, AR2, AR3, AR5, AR6, AR9, AR10, AR14, AR15, AR16 ([architecture](../../../ARCHITECTURE_RULES.md));
AD36 (verification), AD1 (no committed raw prose: summaries stay paraphrase). UI: no UI change; target viewport
1920×1080 for the journey, mobile deferred (standing UI priority).

## Seam (AR14)

`src/world_pack_runtime.js` is a leaf module: it lints a pack with `lintWorldPack`, refuses a failing pack, freezes
it, keeps it in an install registry, and registers one **`world_packs` domain** with `registerDomain` (projection only:
installed id, revision, fingerprint). It adds **no line** to `main.js`, `save_files.js` or `display.js`.
`src/book_world_mol_content.js` calls `installWorldPack(molPack)` and reads people, items, techniques (sources) and
powers from the pack's record `data` instead of building them in code. The pack is one authority for those definitions
(AR3): they are deleted from `book_world_mol_content.js` and `book_world_mol_actions.js`.

Out of scope, stays code (named so it is not mistaken for done): commands, controllers, conditions, situations,
encounters (logic over facts), `MOL_FOOTPRINTS`, native people/stock, worlds table, `molFacts`.

## Owned files (one writer, AR15)

New: `src/world_pack_runtime.js`, `src/packs/mol_cyoria.pack.js`, `tests/world_pack_runtime.test.js`, this record.
Edited: `src/world_pack.js` (record field `data`), `src/world_pack_mol.js` (builder now returns the pack),
`src/book_world_mol_content.js`, `src/book_world_mol_actions.js` (remove sources/powers), `tests/world_pack.test.js`,
`docs/WORLD_ABSORPTION_RULES.md` (status), `PROJECT.md` summary line only if a summary row exists.
Not touched: `dist/`, `index.html` (rebuilt locally, not committed), other sessions' files.

## Persistence (AR6)

No save slice added, no key renamed. Pack identity (`id@revision#fingerprint`, WA10) is exposed by the
`world_packs` projection but **not yet written to saves**: recording it in saves needs a slice and migration and is
left as a named follow-up (needs Weibao's compatibility call under the 2026-10-17 decision). The save/reload/Export/
Import journey must be byte-identical for the Cyoria slice before and after.

## Failure scenarios (AD36)

1. Installed definitions differ from the hand-coded ones (key order, a dropped field, mutation). Check: SHA-256 of
   canonical JSON of people, items, sources, powers recorded before conversion equals the same hash after.
2. A broken pack boots silently. Check: `installWorldPack` throws with WA codes; a test installs a broken copy.
3. A broken registered pack ships. Check (WAC28): a test lints every pack in the install registry inside `npm test`.
4. Cyoria definitions frozen or shared so consumers that mutated them now throw. Check: loader returns fresh clones;
   sources/powers re-frozen exactly as before; full suite.
5. Import cycle or `main.js` growth. Check: `npm run check:arch` zero growth.
6. K2/K8 records claim behavior the engine does not have. Check: lint with `engineFacts` from the real `molFacts`
   output; every K8 record names a real command id.
7. Journey drift. Check: same scripted Cyoria journey on the before and after rebuilt bundles, fresh origin,
   1920×1080, then save, reload, Export, literal Import, compare.

## Checks

`npm run build`, `npm test`, `npm run check:arch`, `npm run check:rules`; focused: `node --test
tests/world_pack.test.js tests/world_pack_runtime.test.js tests/book_world_native_binding.test.js`.

## Evidence (fill as run)

| Check | Input identity | Result |
|---|---|---|
| _pending_ | | |
