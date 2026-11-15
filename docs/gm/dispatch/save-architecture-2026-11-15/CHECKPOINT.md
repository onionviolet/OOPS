# Save architecture checkpoint (2026-11-15)

Owner chat: the architecture and save review session. Design and measurements live in
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
