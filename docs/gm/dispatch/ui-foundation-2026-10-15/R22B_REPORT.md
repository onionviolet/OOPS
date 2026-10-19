# R22b: screen use at 1920, 2026-10-17

Candidate, technically verified; Weibao's visual/play acceptance stays OPEN (UR16).
[Checkpoint](R22B_CHECKPOINT.md) · plan row R22b and SU1–SU12 in the
[Round 15 plan](next-parts/round-15-whole-plan.md#screen-use-at-1920-weibaos-r22-check-2026-10-17).
Branch `claude/ui-r22b-screen-use` from `codex/gameplay-foundations` at `b855f9ac2`. Not merged,
not pushed. Rules: UR11, UR13, UR17, UR37, UR46, UR52; AR1, AR3, AR16; AD36.

Target: 1920×1080 primary and 1800×1040 DPR 2 (Weibao's MacBook); floors 1536×864 and 1366×768;
14px and 21px. Mobile deferred.

## What was wrong (before, shown)

Weibao on the R22 fight at his MacBook size: the center place region was mostly empty, the
opponents sat in three short columns, their names all one color, and You was wider than it needed.
Measured at 1920: the board was 716×147 in the top row while the place region (873×730) held one
action and a back button; You was 629px wide over a 501px Inventory. On a light custom Reports
palette the native place, unlock and skill lines (bright yellow, lilac) nearly vanished.
[Before shots](evidence/r22b/before/).

## What changed

| Code | Change | Files |
| --- | --- | --- |
| SU1 | A fight splits the place region about in half: actions left, a new **Opponents** panel right (Skills, Stances, under it when available). It is a fight companion in the layout spec, so Move to and Hide reach it like Journal and Skills. Spec version 3 | `src/layout_spec.js`, `src/village_workspace.js` (one `definePanel`), `styles/shell_layout.css` |
| SU2 | The board takes its slot's height: while every row fits it is one column, grouped by kind ("Starving wolf rat · 3", then A, D, G), else R20's bands. If the panel is hidden or yields (an item detail), the list returns to Around you as in R20. The nodes move, never rebuild | `src/layout_spec.js` (`boardLayout` `heightEm`), `src/village_workspace.js`, `styles/opponents.css` |
| SU3 | Around you in a fight is titled **Inspecting**: the inspected opponent's letter, name, health bar and cycle, then its facts with your own values, level with You's bars | `src/village_workspace.js`, `styles/opponents.css` |
| SU4, SU5 | One hue per opponent kind (first appearance in slot order; six hues, kind 0 keeps R22's lilac). Same hue on the board's names and group labels and on that kind's names in Reports; letters in Reports show as a small boxed chip. Names stay text (UR37). The inspected row keeps white text and shows its hue as a thicker left rule, since a light hue on the inspected fill fell under 4.5:1 | `src/opponent_board.js` (`kindHue`, one authority), `src/combat_log.js`, `styles/ui_tokens.css`, `styles/combat_log.css`, `styles/opponents.css` |
| SU6 | From 1700px wide You takes Inventory's column, so the top row reads You · Around you · Reports at matching widths; the floors keep R21's wider You | `styles/ui_tokens.css` |
| SU7 | Under a custom palette every non-combat report line takes the palette's text color; the kind still shows in its left rule | `styles/combat_log.css` |
| SU8 | Saved browser layouts: spec 3 shows the new list once in a spec-2 layout; a later manual hide is kept. Game save untouched (UR17) | `src/workspace_layout.js` |
| SU11 | The status window starts compact (Weibao, 2026-10-17); Comfortable stays in Appearance | `src/status_window.js` |
| — | Companion headers read their title from the spec's box (they were hard-coded Journal/Skills) | `src/workspace_layout.js` |

No `main.js`, save or engine change. `npm run check:arch`: 7 main imports, 297 cycle edges, unchanged.

## Checks

Rebuilt worktree served on 19496, fresh origins, browser checks one at a time. Before build: the
branch tip `3d43257ba` on 19495 (its only later source difference is an unlinked
`styles/oops_branding.css` from another session).

| Gate | Result |
| --- | --- |
| [`check-r22b.cjs`](check-r22b.cjs) B1–B8 | Pass. B1 8-mixed at all 8 targets: list beside the actions, Inspecting names the opponent, actions visible, no page overflow; one column with every row visible at 1920 and MacBook 14/21px except MacBook 21px (two columns, rows fit); You equals Inventory width (±2px) at 1920 and MacBook, wider at 1366. B2 three kinds, three distinct hues, log hue equals board hue per kind, every non-inspected hued name ≥4.5:1 on its fill. B3 inspecting D changes the target line, the action button does not move. B4 one and three opponents render, one has no letters. B6 light palette: 0 log texts under 4.5:1. B7 a spec-2 layout without the panel shows the list after migration. B8 status window starts compact. [JSON](evidence/r22b/check-r22b.json) |
| `npm test` | 2,112 pass, 0 fail (2,115 tests, 3 todo); new tests: `boardLayout` height stacking, `kindHue` order and wrap; spec reference updated for the one deliberate addition (opponents companion) |
| `npm run check:arch` | Pass |
| CH1 gate H1–H6 (`REPO`, `URL` with trailing slash) | 6/6. H4 updated for the decided default: it now asserts compact is the default and that Comfortable loosens rows |
| Inherited, one at a time | check-r22 C1–C5, check-r21b 9/9, check-r21 14/14, check-r20 12/12, check-r18 8/8, check-r17-preview 7/7, check-r16 16/16, check-r16-default 6/6, check-r15 4/4, check-r14, check-r13 26/26, check-r12 ticks / recipe 20/20 / success, check-r11-interactions |
| Check update (not a product change) | `check-r20` looked for the board only inside Around you; it now finds it in Around you or the Opponents panel, and checks the inspected facts against Around you. Its tick-steadiness assertion (UR52) passes in the new home |
| CH1 leak lint | **Fails on the dormant export, the same way on the base build** (`3d43257ba`): the decoded Export of a dormant save contains `system-quests`, `Quest system` and `status-window`. R21c reported it clean, so a later change brought it in. Not caused by R22b; raised as a separate finding |

Screenshots, 14px: [after 1920](evidence/r22b/after-n8-mixed-1920-14.png) ·
[after MacBook](evidence/r22b/after-n8-mixed-mbp-14.png) ·
[after light palette 1920](evidence/r22b/after-palette-1920-14.png) ·
[status window default](evidence/r22b/after-status-default-1920-14.png) ·
[before 1920](evidence/r22b/before/r22-fight8-1920-14.png) · [before MacBook](evidence/r22b/before/r22-fight8-mbp-14.png).

## Open

- Weibao's visual check (UR16) at 1920 and the MacBook size.
- In a fight the top row's height still follows You, so Inspecting has spare height under the facts.
  Candidates: the inspected opponent's full facts or a short "what it does" line once knowledge
  exists (R30), or the BX6 action-interval bars. Proposal, not done.
- Idle second-slot content (SU12: quest step, item detail, routes) is the next composition step.
- Misses still take one line per opponent per round (R22 open item, UX18 vs IL26).
- CH1 leak lint dormant-export failure (pre-existing, above): needs its own trace.
- Merge into `codex/gameplay-foundations` waits for Weibao's yes.
