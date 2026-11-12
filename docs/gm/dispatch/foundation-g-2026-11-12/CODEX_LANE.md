# Codex lane brief: Keeper compression batch 1 (chat G)

Owner: chat G (Gu) of the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md). Milestone MS3: at least 10 bespoke Keeper modules deleted. G has deleted 1 (`gu_keeper_red_steel.js`). This lane deletes the next batch. Launched by the coordinator in its own worktree off `claude/fdn-g-gu-312887`. G reviews the diff before anything is committed to G's branch.

## Goal

Re-express five Keeper scenes as data rows run by generic hosts on the Gu working law, then delete their bespoke `src` modules. The tests must still pass, and each scene's headless browser route must still pass with save, reload, Export and literal Import equal.

| Order | Scene | Module to delete | Route flag for `scripts/playtest/gu-keeper.mjs` |
| --- | --- | --- | --- |
| 1 | Seven Fragrances | `src/gu_keeper_seven.js` | `--seven-fragrances-only` |
| 2 | Nine Eyes | `src/gu_keeper_nine.js` | `--nine-eyes-only` |
| 3 | Vitality garden | `src/gu_keeper_vitality.js` | `--vitality-garden-only` |
| 4 | Rainbow Light | `src/gu_keeper_rainbow.js` | `--rainbow-light-only` |
| 5 | Stealth fusion and Scale Armor | `src/gu_keeper_stealth.js` | `--stealth-fusion-only`, `--scale-armor-only` |

Seven depends on red-steel and Four Flavors, and Nine depends on Seven, so do them in this order. Seven and Nine are dispatched through `src/gu_keeper_wild.js`.

## Read first

- `src/gu_working_law.js`: the `gu.working@1` law (activate, convert, refine, grow, treat), plus `guMethods`, `guMoveMethod`, `asBoundGu` and `guRef`.
- `src/gu_essence_line.js` with `src/world_packs/book_gu_keeper_lines.js`: the pattern to copy. The red-steel scene became a row; its feed, convert and cast run on the host; its facts keys are unchanged.
- `docs/gm/dispatch/foundation-g-2026-11-12/KEEPER_COMPRESSION_INVENTORY.md`: the five-part shape every scene hand-writes, and each scene's timing constants and stock arithmetic.
- `docs/KERNEL_WORKING_CONTRACT.md` KW1-KW14. AGENTS.md rules: one writer per file, no em dashes, sealed secrets by ID.

## Files it may touch

- Delete: the five modules above.
- Edit: `src/gu_essence_line.js`, `src/world_packs/book_gu_keeper_lines.js`, `src/gu_keeper_wild.js`, and the scene packs `src/world_packs/book_gu_keeper_{seven,nine,vitality,rainbow,stealth}.js`. Also edit every file that imports a deleted module: `src/book_world_gu_keeper_domain.js`, `src/gu_keeper_propagation.js`, `src/gu_hosted_wolf.js`, `src/gu_keeper_defense.js`, `src/gu_wolf_scouting.js`, `src/world_packs/book_gu_keeper_hosted_wolf.js`, `src/world_packs/book_gu_keeper_move_trial.js`. Imports and call sites only in those.
- Create: new generic hosts under `src/gu_*.js` (for example a refinement-scene host or a growth host) and data rows under `src/world_packs/book_gu_keeper_*.js`.
- Also editable: `tests/gu_upkeep.test.js` (imports only, plus new regressions), `scripts/playtest/gu-keeper.mjs` (only if a selector or facts key really changed), and the Gu entry of `docs/AREA_GUIDE.md`.
- Ask G before touching: `src/simulation.js`, `src/simulation_contracts.js`, `src/simulation_effects.js` and `src/structured_pack_definitions.js` (Rainbow imports appear there).
- Never touch: `src/kernel_working.js`, `src/world_substrate*.js`, `src/procedural_grammar*.js`, `src/main.js`, other chats' files, `docs/coverage/*`, `docs/PROCEDURAL_FOUNDATION_PLAN.md`.

## Rules

- **Keep saved facts keys and completion counter names**, so old saves load (MC4). If a key must change, add a migration or write one compatibility line with the reason.
- Numbers come from catalogue rows (`src/gu_catalogue.js`) or the scene row. A value the chapters leave open is labelled authored in the row.
- A host is generic only if a second scene could use it as a row. A scene-specific helper renamed is not compression; report it as "not compressed" instead.
- If a scene cannot be expressed without bespoke code, keep its module. Report the missing rule as a row (what the host would need).
- Headless browsers only. No visible windows. No push. No merge to master.

## Focused checks

1. `node --test tests/gu_*.test.js tests/kernel_working.test.js` after each scene. The full suite stays with the integrator.
2. `npm run build`, then `node scripts/playtest/gu-keeper.mjs <worktree> <out> <flag>` for each scene's flag. The build directory is the worktree root.
3. `npm run check:arch` and `npm run check:rules`: no new cycles, main.js does not grow.

## Return

- The diff on the lane's branch, one commit per scene, with no Co-Authored-By trailer.
- `docs/gm/dispatch/foundation-g-2026-11-12/receipts/<scene>-codex.json`: each route's `result.json`, plus the bundle SHA-256.
- A short report: modules deleted, generic hosts added (and which rows use each), lines removed versus added, any compatibility line, and the rules the hosts could not express.

## Done check

At least 5 of the 5 modules are deleted. Seven and Nine are the hard floor, since they unblock the `gu_keeper_wild` cluster. Every listed route returns `success: true` with its save, reload, Export and Import checks equal. Focused tests, `check:arch` and `check:rules` pass. Afterwards `rg -l "gu_keeper_(seven|nine|vitality|rainbow|stealth)\\.js" src tests scripts` returns nothing.
