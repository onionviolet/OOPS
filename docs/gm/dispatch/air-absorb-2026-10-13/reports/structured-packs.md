# Structured packs Air absorption report, 2026-10-13

## Task and outcome

The three snapshots are successive states of one structured-pack effort. `starts-talents-continuity` contains the origins, container, structured beginning and pack UI foundation. `wider-gameplay` temporarily adds ability, expedition and local-life runtime adapters. `world1-completion` is the later state: it removes those three runtime files and their test/wiring additions while retaining the core pack work. I treated that later snapshot as the final intent for this lineage.

No source hunk was missing from current HEAD. The foundation is already integrated and subsequently advanced in `379007d79c0fddb12f4fc8491d2a77ff6dfd0716`, with further current changes in HEAD `219270e4d20ab0b3fbf92166f43bb5335629d19e`. The current implementation keeps later native equipment, custody, location, save-envelope and UI behavior that the older Air snapshots either lack or remove. I made no source changes and no commit.

## Hunk classification

| Snapshot paths / hunks | Classification | Evidence and disposition |
|---|---|---|
| `src/structured_container_runtime.js`, `src/structured_pack_definitions.js`, `src/structured_pack_runtime.js`, `src/structured_pack_state.js`, `src/structured_pack_ui.js`; `src/content_pack_ui.js`, `src/content_packs.js`; `src/expansion_engine.js`, `src/main.js`, `src/save_files.js`, `src/simulation.js`, `src/simulation_contracts.js`, `src/simulation_effects.js` | Already landed, then advanced | The current source contains the pack/container/origin integration from `379007d7` and later changes. The final snapshot removes or weakens several current checks and behaviors: equipment and shelter validation, identified item custody/title handling, target-body facts, correct current-location filtering, held identified equipment accounting, and detailed action receipts/focus-preserving UI. Kept current source; did not paste snapshot files over it. |
| `tests/structured_origins.test.js`, `tests/structured_container_runtime.test.js`, `tests/structured_pack_runtime.test.js`, `tests/structured_pack_ui.test.js`, `tests/content_pack_ui.test.js` | Already covered or superseded by current tests | Current suite contains the structured origin/container/pack/UI contracts and additional current behavior. Snapshot-only cases for deferred title transfer, timed relocation, borrowed identified-item custody, and old UI wording match superseded/reverted snapshot behavior. Full current suite passed. |
| `index.html`, `dist/bundle.js`, `dist/bundle.js.map` | Generated/current integration artifacts | Rebuilt from current source for verification, then restored. Snapshot bundle and cache-version output were not copied. |
| `src/structured_ability_runtime.js`, `tests/structured_ability_runtime.test.js`; `src/structured_expedition_runtime.js`, `tests/structured_expedition_runtime.test.js`; `src/structured_life_runtime.js`, `tests/structured_life_runtime.test.js` (present only in `wider-gameplay`) | Later-stage addition withdrawn by `world1-completion` | The later snapshot deletes these files. `wider-gameplay` also wires them through pack definitions/runtime and `main.js`; `world1-completion` removes that wiring, including the structured-death/new-life archive behavior. Not ported. |
| Other `world1-completion` changes in shared `main.js`, pack definitions/runtime/state/UI and tests | Superseded by current HEAD | The final snapshot drops current post-base features and validation. Examples include removing equipment validation, count/custody checks for identified units, body/condition interactions, timed relocation completion rules, native destination filtering, target transfer costs, and accessible action receipt/focus handling. Current HEAD remains the later source of truth. |

The comparison used base `53dc1df158`, all three read-only snapshots, and current branch source. Inventory `UNIQUE` means unique relative to that old base; it does not mean absent from current HEAD.

## Ported changes

None. The current pack implementation is ahead of the final snapshot. The wider-only runtime experiments were explicitly removed in the later snapshot, so restoring them would contradict the final state and reintroduce local death/archive persistence behavior without a current owner or compatibility decision.

## Checks

- Initial worktree: clean, branch `absorb/air-structured-packs`, HEAD `219270e4d20ab0b3fbf92166f43bb5335629d19e`.
- `npm run build`: passed using the main checkout's `node_modules` through a temporary symlink. The generated `dist/bundle.js`, source map and `index.html` changes were restored after the check.
- `npm test`: passed, 609 tests, 0 failures.
- Browser: not rerun. This absorption makes no source or gameplay change; the current rebuilt bundle was not modified after verification, and no new behavior claim is made.
- Persistence: no save format changed; no migration was needed.
- Final worktree: clean. No merge or push was performed.

## Open items and private files

No implementation or playable acceptance gate remains open for this absorption. This report does not claim human acceptance of the current structured pack design.

No private pack paths are missing from the main checkout by path. The Air `private_packs/manifest.json` differs from the main checkout's file; snapshot `p06/pack.json` also differs in `starts-talents-continuity` and `wider-gameplay`. `world1-completion` `p06/pack.json`, its `p07/pack.json`, and the other listed pack files match by SHA-256. I did not copy or overwrite private data.

Air-only ignored research paths missing from the main checkout's ignored tree, left untouched:

- `docs/research/novels/starts-talents-continuity/**` (41 files).
- `docs/research/novels/wider-gameplay-2026-10-11/proof/**` (21 files).
- `docs/research/novels/world-depth-2026-10-11/continuation/**` (198 files).
- `docs/research/novels/world-depth-2026-10-11/full-completion/kit/**` and `language/**` (13 files total).
- `docs/research/novels/world-depth-2026-10-11/further-food/**` (36 files).
- `docs/research/novels/world-depth-2026-10-11/further-ui/**` (6 files).

These are path groups for the exact missing files under those directories; no research files were restored or copied.

## Merge risks

| Absorb branch | Risk |
|---|---|
| `a5-native-audit` | None from this branch's source; no source delta. Keep generated bundle/map reconciliation at final integration. |
| `micro-p1-xp` | None from this branch's source; no source delta. Shared `main.js` and generated artifacts should be reconciled from integrated source. |
| `minigame-management` | None from this branch's source; no source delta. Shared runtime files should be reconciled from integrated source. |
| `systems-cheats-completion` | None from this branch's source; no source delta. Do not restore the wider-only life/expedition wiring as part of this branch. |
| `structured-packs` | This branch; report is its only deliverable. |

No merge or push was performed.
