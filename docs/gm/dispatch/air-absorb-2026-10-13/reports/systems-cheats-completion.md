# systems-cheats-completion absorption report

## Result

Partial source absorption on `absorb/air-systems-cheats-completion`. The proposal-labelled irrigation model and workshop source modules are present and registered with the current simulation registry. The current branch builds. The complete suite reports 619/625 passing, with six workshop failures, so gameplay, browser and native-save acceptance are not established. This is not a playable checkpoint.

## Task and authorization

The Air slice adds an optional Village systems workshop with finite local work, contract-backed rewards, permanent learning versus leased assistance, tools and custody, a represented-only irrigation model, and played-clock deterioration/preservation. Weibao explicitly authorized adapting the proposal in this worktree, with optional absent-by-default state, old-save compatibility, new-save import/export, and desktop-first UI. The proposal remains opt-in and is not accepted canon.

## UNIQUE file classification

| Snapshot paths | Classification | Disposition |
|---|---|---|
| `src/systems_irrigation_model.js`, `src/systems_workshop_content.js`, `src/systems_workshop_runtime.js`, `src/systems_workshop_ui.js`, `src/systems_workshop_validation.js` | Missing from current HEAD | Adapted into current sources; workshop definitions registered with current simulation registry; optional validation runs only when workshop state is present. |
| `tests/systems_irrigation_model.test.js`, `tests/systems_workshop.test.js` | Missing from current HEAD | Added as focused checks; six workshop cases currently fail against the current simulation API/validation lifecycle. |
| `scripts/systems_workshop_boundaries.cjs`, `scripts/systems_workshop_browser.cjs` | Missing from current HEAD | Added, but not run successfully because Playwright is not installed in this repository. |
| `src/main.js`, `src/expansion_engine.js`, `src/save_files.js` | Mixed integration hunks | Adapted narrow registry, render/command, runtime reconciliation and optional envelope-validation hooks. Snapshot whole files were not copied. |
| `src/simulation_content.js`, `src/simulation_effects.js`, `src/items.js`, `index.html` | Mixed integration hunks | Snapshot versions not copied. Build-generated `index.html` and dist changes were reverted after build. |
| `PROJECT.md`, `docs/GAME_IMPLEMENTER_TEMPLATE.md`, `docs/GAME_MASTER_PROMPT.md`, `docs/LIFE_SIM_NORTH_STAR.md` | Superseded/mixed | Not copied; current project owners remain authoritative. |
| `dist/bundle.js`, `dist/bundle.js.map` | Generated snapshot artifacts | Not copied. Current build was run; generated outputs were reverted to avoid bundling an unaccepted feature. |
| `docs/IDEA_INDEX.md` | Same as HEAD | Already present; no change. |

There were no ignored entries in the inventory section, so no private files are listed for restoration.

## Changes made

The irrigation model and workshop modules were copied from the snapshot and integrated into the current registry, expansion validation, save-envelope validation, and `main.js` command/panel seams. New workshop fields remain under existing expansion state and are absent from old saves. Compatibility tests in the focused suite cover absent old-edition state and malformed workshop state, but native legacy-save import/export was not exercised.

## Checks

- `npm run build`: passed.
- Irrigation focused checks: 4/4 passed.
- Workshop focused checks: 6 failed. Failures include current simulation eligibility requirements and workshop expiry receipt validation during clock advancement; see `tests/systems_workshop.test.js` cases for learning/lease, lens/model, Ren, preservation/expiry, and irrigation-carrier paths.
- `npm test`: 619/625 passed; the six failures are the workshop failures above.
- Browser scripts: not run; execution stopped because `playwright` is unavailable.
- Fresh-origin desktop workshop loop: not exercised.
- Save/reload/export/import with old and new saves: not exercised.

## Remaining gates and merge risks

The source is implemented but unverified as gameplay. Fix the six focused failures against current simulation context and completion semantics, rerun build and full tests, then exercise the rebuilt feature on a fresh desktop browser origin and test old-save no-op plus new-save save/reload/export/import. `main.js`, `expansion_engine.js`, `expedition_content.js`, and `save_files.js` are shared high-conflict integration areas for the other absorption branches. This branch has not been merged or pushed.
