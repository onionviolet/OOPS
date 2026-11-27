# Save architecture checkpoint (2026-11-15)

```receipt
build: 43898bea62e4f46e8e2d1a1c68956e34bcde0a58e8221ee67503cc1240d786eb
route: fixture(perf crowded and fresh; frontier-hunt-ready; combat surface tempo journey)
state: browser-verified
viewport: 1920x1080
persistence: unchanged
tests: full suite 7,685 pass, 0 fail, 30 skipped on HEAD plus this chat's changes in a clean worktree; focused tempo and known-routes 221/221; display gate 4/4; known routes UI 2/2; combat surface journey PASS (reload, import, 0 errors)
review: diff-scoped
surface: save parts module, save probes, display gate on the known-routes and tempo panels
```

Owner chat: the architecture and save review session. Covers S0/S1 (committed e44e565f6) and the first O21 slice. Design and measurements live in
[the review](../../../audits/ARCHITECTURE_AND_SAVE_REVIEW_2026-11-15.md) (rounds 2 to 4). Rules: AR1, AR3, AR6, AR9, AR10, AR15, AD36, AD43.

## Writer reservation (AR15)

- `src/save_parts.js`, `tests/save_parts.test.js`, `scripts/perf/save_cost.mjs`, `scripts/perf/save_probe.mjs`: this chat.
- `src/main.js` save paths (`create_save`, `load`, `lifeSaveStorage`) and `src/save_files.js`: reserved for the S0 rename round when it starts; not edited beyond the 19-line dead-code deletion below.

## State

| Item | State |
| --- | --- |
| Dead `to_base64`/`from_base64` removed from `src/main.js` | Source edit; changed tests pass |
| `src/save_parts.js` split, join, change detection, owner table | Implemented, below floor (no runtime caller yet) |
| `tests/save_parts.test.js` | 4 pass |
| Save probe with churn, size and profile | Runs on HEAD builds in a temp dir |
| S0 step 2 renames with load alias | Not started |
| S2 to S6 | Not started |

## Checks

- `node --test tests/save_parts.test.js`: 4 pass, 0 fail.
- `npm run check:arch`: main.js growth -19, cycles 205 unchanged.
- `npm run check:rules`: pass (pre-existing stale glob warning).
- `npm run test:changed` on the shared checkout: one failure, `cheat old-save load and real create_save encode import round trip` (`tests/cheat_cards.test.js`, `option_uniform_textsize` reads a null element). Isolated in a clean worktree: HEAD passes twice, HEAD plus this chat's 19-line deletion alone passes twice, and HEAD plus the whole shared `src/main.js` (another lane's uncommitted edits, such as the `clear_bonus.js` import) fails twice. The failure belongs to that lane's in-flight edit.
- `src/main.js` now holds two writers' uncommitted hunks. Commit this chat's hunk alone (`git apply --cached` of the base64 deletion), not the whole file, because the other lane's hunks are theirs to commit.
- `node scripts/perf/save_probe.mjs --rev HEAD` and `--profile`: reports quoted in the review, round 4.
- `npm test` (full) in a clean worktree of HEAD plus this chat's changes alone: 7,694 tests, 7,664 pass, 0 fail, 30 skipped. Worktree removed after.
- Not run: in-checkout `npm run build` (another lane has `index.html` modified); browser save, reload, Export and Import (no save format or persistence behavior changed).

## O21 first slice: display gate (2026-11-15)

Target: desktop 1920x1080, no visible change; the same panels show the same content, with less idle work while they are off screen. Deferred: the other pollers (32 files), topic-driven refresh migration, F13 per-world facts.

- `src/display_gate.js`: `createDisplayGate(element)` decides whether a per-tick redraw runs. On screen, or unknown, it always runs. Off screen it runs on a command-sequence change, a `workspace-presentation-change`, a return to screen, or the 3 s fallback dial. `setText` skips unchanged text writes.
- `src/known_routes_ui.js`: render gated (key from `main.js`: `expansionState.sequence`, one line edited, no growth); unchanged text no longer rewritten.
- `src/tempo_fight_domain.js`: refresh and its 1 s timer gated before the slot search and view build.
- Tests: `tests/display_gate.test.js` (4); `tests/known_routes_ui.test.js` gains the discovery case: off screen, a route learned by a command reveals the panel at once, and a quiet tick reads nothing.

Measured (`node scripts/perf/save_probe.mjs --profile`, HEAD and working tree back to back, crowded fixture, 15 s idle):

| | HEAD | With gate |
| --- | --- | --- |
| Refinement presentation (known routes) | 4.5% | 1.2% |
| Tempo view and slot search | 6.0% | 1.5% |
| `checkVisibility` | 4.7% | 0.3% |
| Script busy | 29.1% | 26.3% |
| Task busy | 51.8% | 47.0% |
| Long tasks per 15 s (fresh fixture) | 15 | 2 |

Browser: panel states identical on HEAD and the gated build for the mid and crowded fixtures (load, +5 s, Notebook shown); `frontier-hunt-ready` shows `#tempo_fight_panel` with "Hunt the boar" in its Notebook tab; the combat surface journey (start a tempo contest, play moves, reload, import) passes. The known-routes panel shows no routes in any available fixture, so its visible path is covered by the unit case, not a browser walk.

Found in passing: `node scripts/fixture_browser.cjs frontier-hunt-ready` fails on pure HEAD in a fresh worktree ("No clickable element with text /village elder\s*Village neighbor$/") while the main checkout passes from its fixture cache, so the fixture recipe has drifted from HEAD. Not caused by this slice.
