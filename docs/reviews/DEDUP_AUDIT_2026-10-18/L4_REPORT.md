# L4: test-side dedup follow-up (2026-10-19)

Scope: X1 test side (T-F5, T-F6, part of T-F13, T-F14). Branch `worktree-agent-af3469cb234ad3a9b`. The audit files (T.md, SYNTHESIS.md) are untracked in the main checkout, so they were read from there.

## Results

Full `npm test` (node --test tests/*.test.js), same worktree:

| | tests | pass | fail | todo |
|---|---|---|---|---|
| before | 2226 | 2222 | 1 | 3 |
| after | 2223 | 2223 | 0 | 0 |

Status changes: `crafting_native_reload` "gathered lots and crafted products survive native Save and reload with writable saving" went from fail to pass; the three `test.todo` entries in `determinism_replay.test.js` were removed (todo 3 to 0, total 2226 to 2223). No other test changed status; each migrated file was also run alone before and after with identical counts.

## 1. checkVisibility failure (stub fix)

`Element.prototype.checkVisibility` is supported in Chrome 105+, Firefox 106+ and Safari 17.4+, so the runtime calls (`shell_resize.js`, `game_bar.js`, `proto23_shell.js` and others) are acceptable for desktop targets. `src/panel_reveal.js` already guards with `typeof ... === 'function'`; the other callers do not. The headless DOM is the stub that lacked it, so it was added to `scripts/headless/dom.mjs`: false when detached, or when the node or an ancestor has `hidden` (not `until-found`) or inline `display:none|contents`. Layout and stylesheet display stay out of scope (the runner's `whyHidden` owns stylesheets).

Ownership note: this is the one edit outside `tests/` (an 11-line addition in `scripts/headless/dom.mjs`), because the stub lives there. No `src/` change.

Sharing: only `crafting_home_refresh`, `crafting_native_reload` and `tests/headless/runner.test.js` use the headless DOM. Before the stub, 4 of 5 runner tests failed with the same error; after, 1 still fails (`scripted village route ...`: "Element is not visible (display:none on div.end_dialogue_button)"). That test is outside `npm test`; the failure is a separate visibility issue in the village route and was not investigated.

## 2. Shared harness

- `tests/helpers/native_loader.mjs`: `loadNative(entries, {stubs, presentation, logLevel, prefix})`. Default stubs `game_options` and `capitalize_first_letter`; exported `STANCE_LOCATION_STUBS` for the second variant. Migrated (10): `absorb_c1`, `absorb_e2`, `absorb_e3`, `alloy_equipment`, `micro_p1_xp`, `mixture_adapters`, `p23-living-gear`, `p23-long-life`, `seeded_streams` (own stubs `game_stats`, `current_stance`, plus `ui/combat_display.js` in the filter), `tools_domain`. Variant drift (c1, long-life, micro_p1_xp stub `current_stance` and `current_location`; seeded_streams differs) is now explicit options.
- `tests/helpers/mini_dom.mjs`: `withPanelDom(run)`. Migrated: `content_pack_ui`, `structured_pack_ui` (identical scaffold; each keeps its own `find`). The shared `clearInterval` now asserts id 1 in both.
- Not migrated (surfaces differ, left alone): `absorb_c2` (minimal, no attributes), `feature_panel_save_failure` (uppercase tags, `walk()`), `mixture_ui` (style, ids, always connected), `storylet_ui` (listeners, `made` list), `simulation_ui_hidden` (4-line stub), `workspace_focus` (focus counter, `querySelector`). `p23-market-life` uses esbuild with custom doubles, not the stub loader. `p23-combat-options` has no esbuild loader (the audit overstated it).

## 3. Other T.md findings

Fixed: T-F13 (three stale todos deleted; a comment points to the seeded_streams Math.random-forbidden test; `grep Math.random` finds none in the cited combat, local-life, location, enemies or trader files). T-F14 first bullet (`harvest.test.js` loops use `h.HARVEST_CAP`).

Left, with reason:
- F7 (native body, ctx, reload scaffold in about 17 tests) and F8 (R15-G4 fixture prelude, move to `tests/fixtures`): larger, needs a fixture move; own lane.
- F12 (stale ratchet ceilings): the baseline file says human review, never regenerate in tests.
- F14 other bullets: constants not exported from `src/` (another lane); content-count literals need data decisions.
- F15 (canonicalJSON), F9 to F11, F18 to F22: scripts or src ownership.
- F16 (forbid-ambient helper), F17 (small repeated helpers), F23 (p23 host-join assertion shape): low value, safe later; not done to keep the diff reviewable.
