# R21c: status window home in the parity shell, 2026-10-17

[Checkpoint](R21C_CHECKPOINT.md) · finding F1 in [R21B_REPORT](R21B_REPORT.md) · queue row R21c in the
[Round 15 plan](next-parts/round-15-whole-plan.md). Branch `claude/ui-r21c-status-window-home` from
`codex/gameplay-foundations` at `2eb36e296` (R21b merged). Rules: UR13, UR16, UR17, UR18; AR3, AR16; AD36.

## What was wrong

The awakened CH1 status window never showed in the parity shell, the default presentation. The
layout spec gave `status-window` no region or box, and the composed shell parks any panel outside a
hard-coded core list unless it is a parity companion. Fresh shell layouts also hid it, since it was
not in `shellOrder`. CH1 gate H3–H6 failed on R20, R21 and R21b.

## What changed

| Change | Where |
| --- | --- |
| The status window joins the player region and the **You** box, after the stat sheet, and `shellOrder` after `shell-character`. Move to carries it with You. | `src/layout_spec.js` |
| A parity panel that belongs to a spec box has a home and is not parked (the spec decides, not the core list) | `src/workspace_layout.js` |
| Saved browser layouts: layout spec 2 unhides the window once and puts it after the stat sheet (they hid it because it had no home). It still shows only after the system awakens. The game save is untouched (UR17) | `src/workspace_layout.js` |
| The window registers `after: 'shell-character'` (classic: that panel is ineligible there, so the window still sits right under vitals) | `src/status_window.js` |
| Fit: the window yields like the secondary stats (`data-fit-want`). It may grow the top row only to the elastic default, then scrolls inside itself; the stat sheet keeps its natural height | `src/status_window.js`, `styles/status_window.css` |
| Spec test: R16 reference updated for the one deliberate move (status window from fallback to player) | `tests/layout_spec.test.js` |

The first version put the window above the stat sheet, squeezed the sheet to 1px and grew the top
row to its cap (about 245px off the bottom row at 1920×1080). The final version keeps the sheet
whole; the top row grows about 95px over the dormant layout, which is where secondary stat rows
already yield.

## Check updates (not product changes)

- `ch1_gate.cjs` H4 clicked the Authoring toggle directly; R21 moved it into the game bar's menu
  box. H4 now opens the box first, as `r11-lib` does. Hidden until now because H3–H6 never got past
  awakening.
- `check-r16` asserted the stored layout spec equals 1; it now asserts a spec is saved (≥ 1).

## Checks

Rebuilt worktree, fresh origins, served on 19496, browser checks one at a time.

| Gate | Result |
| --- | --- |
| CH1 gate H1–H6 (`REPO`, `URL`) | 6/6: opt-in default none; dormant start shows nothing; awakens at 44s with message and one reveal; contents match vitals and stats, density setting tightens rows; survives reload and import without replaying the reveal; fits, readable, F6-reachable at 3 desktop sizes |
| CH1 leak lint | Pass |
| Saved-layout migration (`r21c-capture.cjs migrate`) | Pass: a spec-1 layout with the window hidden above the sheet loads as vitals, stat sheet, status window. The stored spec updates on the next layout save, like the spec-1 companion migration |
| `npm test` | 2,086 pass, 0 fail |
| `npm run check:arch` | Pass (7 main imports, 297 cycle edges, unchanged) |
| Inherited | check-r21b 9/9, check-r21 14/14, check-r11-interactions, check-r12 ticks / recipe 20/20 / success, check-r13 26/26, check-r14, check-r15 4/4, check-r16 16/16, check-r16-default 6/6, check-r17-preview 7/7, check-r18 8/8, check-r20 12/12 |

Screenshots on an awakened save (from the CH1 dormant fixture), 14px:
[before 1920](evidence/r21c/before-1920-14.png) · [after 1920](evidence/r21c/after-1920-14.png) ·
[before MacBook](evidence/r21c/before-mbp-14.png) · [after MacBook](evidence/r21c/after-mbp-14.png).
Before: parked, not visible. After: in You, under the stat sheet, no page scroll.

## Open

- Weibao's visual check (UR16), including whether the window should start compact (its density
  setting exists; default is comfortable).
- The window repeats Strength to Intuition from the stat sheet. Folding them is a cheat-host design
  question (NX7, Part 10), not part of this fix.
- The non-default proto23 shell (non-parity) still parks the window. Not changed.
- Merge into `codex/gameplay-foundations` waits for Weibao's yes.
