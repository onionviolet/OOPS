# R21 checkpoint: shell layout editing, one bar, control box, 2026-10-17

Saved before editing. Session: Claude (new main UI chat after the
[2026-10-17 handoff](HANDOFF_2026-10-17.md)), worktree `.claude/worktrees/ui-r21-layout-edit`,
branch `claude/ui-r21-layout-edit` cut from `codex/gameplay-foundations` at `d10599f54` (contains
R15–R20 and the engine merges; not master). Approved by Weibao: "Start, save accordingly, context is
filling up, start in new main chat".

Round number: R21 is the next free number. The queued rounds move up by one (old R21 combat log is
R22, old R22 Reports tabs is R23, old R23 polish is R24, and so on to old R31+ as R32+); the plan's
queue table records it.

## Task record (UR18, AGENTS.md consistency gates)

- **Surface type:** shell chrome and routine panels (the parity shell's navigation, footer,
  Inventory and Reports; layout editing over the five spec regions).
- **Target viewports:** the UI_RULES target set: 1920×1080 primary, Weibao's MacBook at about
  1800×1040 CSS px and DPR 2, floors 1536×864 and 1366×768; 14px and 21px text at each. Mobile and
  half-screen (MB8) deferred.
- **Visible outcome:**
  1. One bar at the top: panel navigation on the left; save state, Save, Export and Import on the
     right; settings, version, help, Authoring, Layout, density, attribution links and the hit
     counter in a Menu. The bottom bar is gone in the shell, giving its row to the panels.
  2. Inventory spends one control row instead of two to four: category tabs stay inline when they
     fit, and a control box states the view ("Name ↑ · 21/21") and opens search, sort and
     direction in a popover. When the tabs do not fit, the category joins the box.
  3. Reports' two bottom control rows become one control box in its header ("All reports ·
     Follow: smart"), opening filters, follow, stop combat log and clear. The log keeps its column.
  4. Edit layout stays in the shell. Each box can be moved to a named slot (You, Around you and
     Inventory swap places; Journal and Skills go beside the actions or under another box), the
     companions can be swapped, and "Reset this layout" restores the current context's default.
- **Deferred:** a last-saved time in the save state (needs a save-time projection), crowd units
  (HZ3–HZ5), 1920 compositions beyond what the control box frees (VP2, MB6), the duplicate route
  (MB3) and second place tab strip (MB4), Reports keep-open beside the log, control boxes for
  Skills, Quests and Crafting, drag-and-drop between slots (keyboard and menu first), mobile.

## Authority read

AGENTS.md; RULES_INDEX (router: UR1–UR58, AD34, AR1–AR16); UI_RULES with the 2026-10-17 viewport
targets; ARCHITECTURE_RULES; Round 15 plan sections GU1–GU8, WX1–WX14, CTL1–CTL24, CB1–CB5,
VP1–VP4, HZ1–HZ8, MB1–MB9, merge wave record; R16–R20 reports; the handoff.

Rules applied: UR11 (log column intact, current work visible), UR13 (nothing disappears silently),
UR17/UR58 (layout is browser-local with an owner and reset), UR21/UR51 (direct paths; the recorded
extra-click tradeoff for rare controls), UR50 (hit counter off the play bar), UR52 (no reflow under
a pending target), UR53 (popover Esc, focus, outside click), UR54 (control placement by task), UR55
(save state visible, Save/Export/Import distinct), WX4 (stable moments), WX11 (manual beats
automatic), GU6 (spec version stored), CTL4/CB5 (each control keeps its storage owner), MB9 (Tab
order follows the visible order), GU5 (classic frozen: these changes apply to the shell only),
AR1/AR5 (new modules, no `main.js` growth, no new cycles), AR9 (default composition unchanged).

## Live state (shown, 2026-10-17)

`Edit layout` calls `selectShell(false)` first (`src/workspace_layout.js:121`). The parity shell
has a 28px top navigation row and a 42px bottom bar. At 1366×768 21px on the populated fixture,
Inventory spends 137px above its first row (tabs wrap to two rows, plus header and search row) and
shows 5 rows; at 1920×1080 21px it spends 109px and shows 14. Reports has two control rows at the
bottom. Frozen before build: `evidence/r21/before/` (populated and combat, full target set).

## Plan

1. **MB7 helper** (done before this checkpoint was finalized, tooling only):
   `target-set.cjs` exports the target set and `forTargets()`; `r21-capture.cjs` records chrome rows,
   control rows, visible rows and screenshots per target.
2. **Control box component** `src/ui/control_box.js` (new, leaf): a button that states the current
   view and opens a manual popover. Esc closes it and returns focus to the button before any Back
   handler; an outside pointer press closes it and its click does not reach what is underneath;
   ticks do not re-render the open popover's structure. Placement `below` (over its own panel) or
   `beside` (left of the log column, never over the log).
3. **Inventory box** in `src/proto23_shell.js`: tabs plus box in one row; search, sort, direction
   and Clear in the popover; the label names every non-default choice (CB4). The fold of the
   category into the box is decided on width changes only (ResizeObserver), never on count ticks.
4. **Reports box**: proxy toggles for the six native filters (pressed state from the native
   buttons), follow, stop combat log, clear. The box sits in the Reports header.
5. **One bar** `src/game_bar.js` (new), mounted from `workspace_navigation.js` (no `main.js` line):
   moves the existing nodes (navigation, Save/Export/Import, settings, version, help, the workspace
   toolbar, links, hit counter) into the bar and Menu with placeholders, and back in classic. Save
   state mirrors the existing current-work ownership line (one authority). Navigation that does not
   fit folds its last buttons into the "More…" list, decided on width changes only.
6. **Layout editing (MB1)**: spec gains `boxes` (panel groups with a fit mode) and `slots`;
   `regionFor` takes a placement; the fit engine reads fit modes so a swapped list never drives the
   top row. Placement stored in `<shell layout key>.placement` with the spec version, per context
   (idle, combat). Edit layout in the shell shows a "Move to" control on each box header, a swap
   for the companions and "Reset this layout"; the log slot is not a target (UR11).
7. Tests for the pure parts (`layout_spec` placement, fit modes, control box label), `check-r21.cjs`
   for the journeys, the slack map at the target set, before/after screenshots.

## Gates

Rebuild here; `node --test`; `npm run check:arch`; inherited check-r11 through check-r20 one at a
time; check-r21; save export byte-identical across control box use (CB5); layout reload and reset;
slack map; before/after at 1920×1080 and the MacBook size sent to Weibao. Commit on this branch, no
merge or push without Weibao's yes.

## Writer reservation

This round edits `src/workspace_layout.js`, `src/layout_spec.js`, `src/shell_composition.js`,
`src/proto23_shell.js`, `src/workspace_navigation.js`, new `src/ui/control_box.js`, new
`src/game_bar.js`, new `styles/layout_edit.css`, `styles/game_bar.css`, `styles/control_box.css`,
`index.html` (stylesheet links), tests and this dispatch folder. No `main.js`, `display.js` or
`save_files.js` edits.
