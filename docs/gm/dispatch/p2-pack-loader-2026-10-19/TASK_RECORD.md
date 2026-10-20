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

## Evidence (2026-10-19)

Inputs: base `d394a229a` (`codex/gameplay-foundations`), code commit `1dc975f89`; before bundle sha `9fc4faeac53c`
(built from the base tree), after bundle sha `7e0ae905b64c`. Chrome headless, fresh origins (127.0.0.1:18801 before,
:18802 after), 1920×1080, `?test_hooks=1`. `dist/` and `index.html` were rebuilt locally and left uncommitted
(recent src commits do carry `dist/bundle.js`; this slice leaves the rebuild to the integrating commit so it does
not mix other lanes' src into it).

| Check | Result |
|---|---|
| Content identity (failure 1) | SHA-256 of people, items, sources, powers equal before and after (`tests/world_pack_runtime.test.js`). Verified |
| `node --test` focused (world_pack, world_pack_runtime, book_world_native_binding, mol_held_job_facts) | 17/17 pass |
| `npm test` (via test queue, after code change) | 2263 pass, 0 fail. Verified for this slice |
| `npm run check:arch` | main.js 10310, display.js 6767, save_files.js 310: growth 0 each; baseline unchanged. Verified |
| `npm run check:rules` | PASS, 0 warnings (run before the doc edits; rerun below) |
| WAC28 | `every installed pack lints clean` test iterates the install registry; a broken copy fails to install. Verified. Covers packs whose module a test imports |
| Browser: bundle boot, after build | No page errors; `simulationTestHooks.project('world_packs')` returns the installed Cyoria pack with fingerprint `book.mol.pack.cyoria_visitor@2#d0a7e7d073bb9680`; before bundle returns null. Verified |
| Browser: opening-state save, before vs after | Same 64 top-level keys, no `world_packs` key, no Mol keys; the 21 differing values are random seeds, journey ids, timestamps and a one-minute tick race, not pack-related. Reload round trip changes only the same kinds of values |
| **Browser: Cyoria loop (chart, enroll, enter, jobs, shop, save/reload/Export/Import)** | **Not exercised: implemented-unverified.** The Cyoria section never appeared after meeting the elder and following local people; reaching it needs a longer unlock chain than this session explored (the Worlds route stays disabled and the knowledge chain behind Iona's ledger was not completed). No journey script for Cyoria exists in `scripts/`; one is needed. Add to the acceptance backlog |

## Follow-ups (not done, named)

1. Cyoria browser journey script (chart to aftermath, with save, reload, Export, literal Import), run on before
   and after bundles. Until it passes, P2 is not accepted and WA19/AR10 are open.
2. Record `id@revision#fingerprint` in saves (WA10): needs a save slice, migration or a compatibility decision.
3. Move commands, controllers, conditions, situations and encounters into the pack (they are logic over facts
   and need a loader that can carry predicates as data; they already are plain JSON).
4. K8 test reads command ids out of record summaries; give records a `command` reference field if the format keeps K8.
