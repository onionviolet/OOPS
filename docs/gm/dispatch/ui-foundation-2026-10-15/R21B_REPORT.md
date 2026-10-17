# R21b: retire the character selector, 2026-10-17

[Checkpoint](R21B_CHECKPOINT.md) · plan [BX15, HR1–HR10](next-parts/r21-feedback-2026-10-17.md) ·
queue row R21b in the [Round 15 plan](next-parts/round-15-whole-plan.md).

Weibao: "Yes, the new-game hero creation panel (name, gender, height, age, race). Retire it in
R21b." Branch `claude/ui-r21b-retire-selector` from `codex/gameplay-foundations` at `8bf1ed55d`.

## What changed

| Code | Change | Where |
| --- | --- | --- |
| HR1, HR3 | A new game goes from PLAY straight into play. `complete_default_hero()` (ported unchanged from the shared checkout's uncommitted work, HR1) fills only missing identity: name Hero, human, adult, ambiguous, average height, and marks the hero created. Old saves keep theirs; a save made mid-creation keeps what it had and fills the rest. No save-format change | `src/character_creation.js`, `src/main.js` (creation block replaced) |
| HR4 | The name is typed in the You header (R21); the panel's name field is gone with the panel | — |
| HR5, HR6 | What the panel also carried moves to a **Beginning** card on the start screen, for a new game only: the "Optional beginning" choice (same node and id), the local start probe (`?start_probe=1`) and the backlog opening panel. PLAY applies them exactly as the panel's confirm did (start snapshot, CH1 dormant system grant, life milestone), then the game runs | `src/new_game_beginning.js` (new), `src/main.js`, `src/start_probe_ui.js` (mounts in any host) |
| HR8 | Classic presentation starts the same way | — |
| HR9 | First start logs: "Your name is set in the You panel header. Click it to rename." The card also says so (UR13) | `src/main.js`, `src/new_game_beginning.js` |
| — | Card styling under PLAY, inside the 1366×768 floor | `styles/shell_chrome.css` |

The panel markup and its translations stay in `index.html` and are removed at start, so classic,
the start probe's styles and older dispatch scripts keep working (HR10 deferred: delete the markup
in a cleanup round). `src/config.js` is untouched; the shared checkout's uncommitted
`do_hero_creation: false` no longer matters, because the start path no longer reads that flag.

## Checks

Rebuilt worktree, fresh origins, one check at a time.

| Gate | Result |
| --- | --- |
| `check-r21b` (new) | 9/9: fresh game has no panel and a Beginning card that clears PLAY at 1920×1080 and 1366×768; PLAY reaches play with the default hero; the UR13 line logs; the system beginning and the ordinary beginning record their milestones as before; the start probe mounts in Beginning; an old custom-identity save loads unchanged with no Beginning; a mid-creation save keeps its name and choices and fills only gaps; save, reload, export (download) and import (file input) keep a renamed hero; classic starts without the panel |
| `node --test tests/*.test.js` | 2,086 pass, 0 fail, twice. `tests/helpers/cheat_game.mjs` now chooses the beginning on the start screen (it chose inside the panel, so two cheat-awakening tests started with no system) |
| `npm run check:arch`, UI contract test | Pass (7 main imports, 297 cycle edges, unchanged); no new UI contract hits |
| CH1 gate (`ch1_gate.cjs`, updated to choose before PLAY) and leak lint | H1 opt-in default none and H2 dormant start pass; H3–H6 fail as before the round (F1) |
| Inherited | check-r21 14/14, check-r11-interactions, check-r12 ticks/recipe 20/20/success, check-r13 26/26, check-r14, check-r15 4/4, check-r16 16/16, check-r16-default 6/6, check-r17-preview 7/7, check-r18 8/8, check-r20 12/12 |

## Findings outside this round

| Code | Finding | Evidence |
| --- | --- | --- |
| F1 | **The awakened status window never shows in the parity shell.** `ch1_gate` H3–H6: "status window did not appear within 120s" | Fails identically on R20 (`d10599f54`), R21 and R21b. Cause (traced from source, not run): `status-window` (`src/status_window.js:48`) has no region, box or companion in `src/layout_spec.js`, so the parity composition parks it (`src/workspace_layout.js` `parked`). Likely since the parity shell became the default (`ea9dbd8d2`); R1's H3 passed on 2026-10-14. Fix proposed as R21c: give it a home in the spec (a companion shown once awake), then rerun the CH1 gate |
| F2 | The top navigation shows over the start screen in the parity shell (a parity rule beats the start-screen hide) | Seen on R21 and R21b; one CSS line, left for the next UI round |

## For Weibao

- **Confirmed reading:** the retired "character selector" is the new-game hero creation panel.
- **Open:** your visual check of the Beginning card; whether age, gender and height should show
  anywhere (today they live in the save only, race shows in the You header).
