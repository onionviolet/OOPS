# PP5 engine part: combat import cut and opponent projection, 2026-10-16

Branch `codex/engine-combat-projection` (worktree `~/.codex/worktrees/engine-combat/yet-another-idle-rpg`),
cut from `codex/gameplay-foundations` at `ea9dbd8d2`. Not merged, not pushed; the merge is Weibao's call.
Rules: AR1, AR2–AR4, AR5, AR8, AR9; NX22, KL24/KL25, AD8; GU8; PP5. Interface: [COMBAT_OPPONENT_PROJECTION.md](COMBAT_OPPONENT_PROJECTION.md).

## Round 1, structural (AR9): `8f86038c6`

`src/ui/combat_display.js` imported only `current_combat` from `main.js`. It now reads the same live
binding through the `native_view.js` reader port (`get_current_combat`), bound at main init before any
combat can start. `check:arch`: 8 → 7 main imports, 298 → 297 cyclic edges (baseline entries removed).

## Round 2, projection

- `src/combat_readout.js` (new, imports nothing): the per-fighter numbers the native view shows, moved
  verbatim out of `update_fighter_stats`. The renderer formats its unchanged strings from it.
- `src/combat_opponents_domain.js` (new): registers `combat-opponents` with `projection` only. It
  emits name, health, defeated, count/alive and the shown facts, labelled `disclosure: 'native-legacy'`.
  It emits no ids, tags, levels, loot or XP. Registration runs from `combat_display.js` with its
  dependencies injected, so it adds no new import cycle and no `main.js` registration line.
- `main.js`: two existing lines edited, 0 added (AR1). The `bindNativeView` call gains
  `get_current_combat`, and the read-only `?test_hooks=1` hooks gain `project(id)` and a
  display-only `refreshCombatView()`.

## Gates (commands and results)

| Check | Result |
| --- | --- |
| `npm run build` | pass (final bundle `5f5d24588dcc`) |
| `npm test` | 2068 tests, 2065 pass, 0 fail, 3 TODO (round 1: 2064 / 2061) |
| `npm run check:arch` | pass; 7 main imports, 297 cyclic edges |
| `node --test tests/combat_opponents_projection.test.js` | 4 pass: solo/party/shield/defeated/inactive variants, key allowlist, planted secret id/tags/loot/XP/level absent |
| Base `ea9dbd8d2` (`modular_baseline_build.mjs`, bundle hash equals its committed version) vs round 1 and vs round 2: `scripts/combat_projection_browser.cjs` (round-1 version) | native opponent DOM at six tick counts, saved/restored/imported envelopes all equal |
| M1 save scenario `modular_seams_browser.cjs` + `compare_modular_saves.cjs`, base vs round 1 and round 2 | PASS, envelopes equal |
| `scripts/combat_projection_browser.cjs` final, fresh origin, 1366×768, seeds 41 and 3 (plus 1–6 before the last harness trim) | PASS; projection equals a fresh native render for every opponent frame (14 per run): name, hp text, every stats string, you-hit, defeated dimming, count; Save/reload/Export/literal Import; zero errors |

## Findings and gaps

- F1: the native stats text goes stale between redraw events (1–3 of 15 frames per run). The projection
  is current. Parity is asserted against a forced native redraw; staleness is counted, not hidden.
- F2: the native shield-block text carries a stray `2345` (`| 🛡️: ${block}2345`). Inherited and
  untouched here (AR9); the projection carries the number only.
- Gap: the browser journey covers native single-opponent fights only. Infested field spawns single
  enemies early, and moving to a group zone through `change_location` was refused in this state, so
  party, multi-opponent, shield and defeated variants are covered by the unit tests on the shared
  readout, not in the browser.
- Not done: R20 consuming the projection (UI-owned); AD8 learning (R27); a refresh hook for an R20 panel
  beyond the existing `domainRegistry.refresh()` publication path.

## Merge reconciliation

Touches `main.js` (two existing lines), `src/ui/combat_display.js`, `native_view.js`,
`scripts/architecture_baseline.json`, plus new files. R20 owns `village_workspace.js` and
`styles/opponents.css`; no overlap. PP8 merge order puts this branch first.
