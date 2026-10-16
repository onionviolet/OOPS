# R16: shell default, density pass, idle and combat compositions, 2026-10-16

Candidate, technically verified; Weibao's visual/play acceptance remains OPEN (UR16).
[Scope saved before editing](R16_CHECKPOINT.md) · [Round 15 plan](next-parts/round-15-whole-plan.md)
(queue renumbered; new section "More panels and a cohesive screen", CZ1–CZ10).

## What was wrong (reproduced in Weibao's terms, UR15)

On the R15 shell at 1366×768 and 21px, a fight showed four inventory rows under three tool rows.
The place panel spent three lines on name, type tag and date, then a separate strip for small
Actions/Options tabs. The log tools took two 42px rows, and the top row was a fixed 20 text lines
whatever You or the opponents needed. Idle at 21px showed three actions. The shell was also opt-in,
so the default screen was classic and none of R1–R15 showed. The slack map
([before](evidence/r16/before/slack-map.md)) measured this region by region.

## What changed

| Slice | Change | Files |
| --- | --- | --- |
| R16a | The parity shell opens when this browser stored no presentation choice. A stored choice (classic, plain shell, parity) is kept, and the Layout menu still switches. Browser-local only | `src/workspace_layout.js` |
| R16b | Density at the actual text size; no text made smaller. Panel headers, the name row and the Attributes/Gear buttons are one line tall. Inventory tools and rows have thinner padding. The place header puts name, type tags and weather on one line, with the date and Actions/Options on the next. Bottom pane tabs and log tools are one line plus a thin pad. Around you is hairline rows (name and role on one line where they fit), one column at 21px, with the place prose in italics below | `styles/ui_tokens.css` (R16b block) |
| R16c | **Top row follows content (WX3).** A new module measures You (and the opponent cards in a fight) only at stable moments: presentation, text size, viewport, entering or leaving a fight, explicit layout actions, and the first 1.2 s after the start screen. Never on ticks (WX4, UR52). Caps: 62% of the board; the bottom keeps 11 text lines. You's secondary stats may grow it only to the R14 default (17.5 lines or 38% of the viewport), so at laptop sizes they still yield before inventory and actions (R11 order) | `src/shell_composition.js` (new), `src/proto23_shell.js` (stats declare `data-fit-want`) |
| R16c | **Companions (WX7, CZ1–CZ9).** The existing Journal and Skills panels sit beside the actions. Idle shows Journal (quests) over Skills; a fight shows Skills (Stances) only. They yield to an item detail or a center view. Which companions show is also latched at stable moments, so a skill discovered mid-fight waits instead of pushing the actions aside. Undiscovered panels stay unnamed. The Journal tab strip hides while Quests is active, because the top nav names every tab (UR42), and returns if another tab is chosen. Journal nav still opens the same node in the center; Back returns it | `src/workspace_layout.js`, `styles/ui_tokens.css` (R16c block) |
| R16c | **Saved layouts (CZ6, WX11).** An older saved parity layout gains the companions once (layout `spec` 1). A later manual hide is kept across reload | `src/workspace_state.js` |

| NX33 | **Every known panel keeps a route in the shell.** The shell hid the top nav's "More panels…" select, so after the engine lane's M3 merge Herbal experiments (and any panel without its own nav button) had no route. The select now ends the shell's top nav: same node and handler, shell look | `styles/ui_tokens.css` (R16b block) |

`src/main.js`, `src/display.js` and `src/save_files.js` are untouched. No game-save change: the
presentation choice and the layout spec are browser-local `localStorage`, so export/import is
unaffected.

## Evidence (fresh loopback origins, synthetic fixtures only)

Rebuilt with `npm run build`, served on port 19271. The frozen R15 copy runs on 19272, and a control
build (current tree with R16's three files reverted) on 19273.

| Check | Result |
| --- | --- |
| `check-r16-default.cjs` (new) | **6/6** on R16. Covers fresh origin → parity shell with nothing written; stored classic, plain-shell and parity choices kept; Layout menu → classic survives reload and switches back; 800px narrow opens without errors. On the R15 copy: 3/6 fail (the default cases) |
| `check-r16.cjs` (new) | **16/16** at 1366×768 14/21px and 1920×1080 21px. Idle: companions beside the actions in reading order (PX10), no overlap, no page overflow, 30 rendered ticks under a hovered action move no row, item, action, log or pane-tab row. Combat: Journal yields, the top row fits, ticks add no companion. Also: Journal nav round trip, manual hide survives reload, an older layout gains companions, a fresh character names no Journal. At each target: More panels is on screen without wrapping the page, opens Herbal experiments, and Esc closes it (NX33). **GU2 timing:** with the inventory cloned to 500 rows in the page (a DOM-size proxy; no 500-item save fixture exists, and the measure reads only the You and focus regions), five forced measures took at most **0.6 ms** at every target, so no per-region re-measure is needed |
| M3 journey (`scripts/modular_crafting_browser.cjs`, scratch copy on port 19271) | Reaches Herbal experiments through More panels, then gathers, crafts and uses. It then stops at a later step that clicks an inventory row's inline `[use]`, which the shell has hidden since R14 (item actions go through item detail). Harness-side; reported to the engine lane |
| Slack map (WX13), [after](evidence/r16/after/slack-map.md) | Inventory rows visible: combat 21px **4→5**, combat 14px 12→14, combat 1920 11→13; idle 21px **5→6**, idle 14px 13→14, idle 1920 13→15. Idle 21px actions visible 3→4 (with Journal/Skills alongside). Log column width unchanged (394px / 501px). Page never scrolls |
| `node --test` on new tests | `shell_composition` 7/7, `workspace_spec` 2/2, existing `workspace_*` 5/5 |
| `npm test` | 2,072 pass, 3 fail, 3 TODO of 2,078. The 3 failures are the known unrelated ones: two cheat-awakening tests and the UI-contract flag on `styles/oops_branding.css` |
| Inherited | `check-r15` 4/4 (NX19 parse: 899 written = 899 parsed), `check-r13` 26/26, `check-r12-ticks` pass, `check-r11-interactions` 4/4 |
| `check-r14` | **4/4** (1366×768 at 14/17.5/21px, 1920×1080 at 21px) on the R16 build, port 19271. It first failed after the modular-seams M3 merge: that merge's `herbal-experiments` panel reuses the shared crafting-detail view, so `[data-craft-attempts]` matched twice; the control build with R16's files reverted failed the same way. The coordinator session scoped the check's three selectors to `#crafting_window` (a test-only change, not by R16). Two mounts of one view are the first real proof of the factory/view contract (NX37) for R17 |
| `check-r12-recipe`, `check-r12-success`, `check-r12-ticks` | After the M3 merge, recipe and success failed in Playwright strict mode for the same reason as `check-r14`, and ticks read the first match silently. Test-only fix in this session: page-wide `[data-craft-*]` locators and one `document.querySelector` are scoped to `#crafting_window`. Reads through `#crafting_detail` were already scoped (one such node, in the window). Now recipe **20/20**, success exits 0 with all six attempts recorded, ticks pass. Flagged by the engine lane |

**One inherited assertion changed:** `check-r11-interactions.cjs` expected that at 1366×768 21px no
secondary stat fits, so focus falls back to Attributes. After the density pass, one row fits at the
same top-row height. The assertion now checks the invariant instead: focus stays on the stat if it is
still visible, otherwise it moves to Attributes (UR52). The original is kept in the session scratchpad.

Comparisons (before | after): [combat 21px](evidence/r16/compare-combat-1366x768-21.png),
[idle 21px](evidence/r16/compare-populated-1366x768-21.png),
[idle 14px](evidence/r16/compare-populated-1366x768-14.png),
[fresh 14px](evidence/r16/compare-fresh-1366x768-14.png),
[1920 21px](evidence/r16/compare-populated-1920x1080-21.png).

## If your browser already stored the classic layout (GU4)

From here I can't see what your browser stored. If a fresh load still shows classic, a classic
choice is saved in that browser, and R16 deliberately keeps it (UR17). To switch:

1. In the bottom bar, open **Layout ▾**.
2. In **Presentation**, choose **Proto23 layout** (the new default; "Proto23 Shell" is the older
   plain shell, "Existing layout" is classic).
3. The screen switches at once and the choice is remembered in this browser. Your game save is not
   touched, and you can switch back the same way.

## Notes for the structural round (R17)

- **GU1:** the top-row rule (`topRowHeight`) and companion choice (`companionsFor`) are pure
  functions in `src/shell_composition.js`; the measuring host is separate.
- **GU3:** the R16c block at the end of `styles/ui_tokens.css` holds the region-height and companion
  placement rules, so the spec round can lift them out whole. R16b keeps token and control sizing.
  The R14/R15 em-based row rules remain in the older blocks and lose to the R16c rule while the fit
  is active.
- **GU6:** stored shell layouts carry `spec: 1`; R17 maps that identity or resets only the shell
  layout with a notice.

## Findings

| Code | Finding | Disposition |
| --- | --- | --- |
| F1 | Discovering a pane (for example Skills) inserts a bottom pane tab and narrows its neighbours mid-play. The R15 copy does the same. It moves a pending target sideways (UR52) | Queue for R18 or the polish round: reserve or append-only pane tabs |
| F2 | In a fight, "Go back to [Village] [15m]" and the "← Village" bar both show. The travel action was hidden by R15's sizing | Two routes for one destination; review in the view-placement round |
| F3 | A fresh character's inventory is 67–73% empty frame (two items). No companion fits it yet: item detail needs a selection, and Gear inline is R24 (old R22) | WX7 candidate for R19 (item detail) |
| F4 | Journal tabs and skill sort strips are clickable divs, not buttons (CTL1). R16 restyled them only | CTL1 conversion when a strip round touches them |

## What to look at (IT5)

1. The default screen on a fresh browser: the shell, not classic.
2. Journal and Skills beside the actions while idle; Skills only in a fight.
3. Around you as rows, with the place text readable below.
4. At 21px: the one-line place header, shorter tabs and log tools, more inventory rows.
5. Whether the content-fit top row feels right when entering and leaving a fight.

## Not claimed

Visual and play acceptance (Weibao). Combat with the Skills companion visible: the fixture
discovers its first skill mid-fight, so the companion correctly waits; it is covered by unit tests
and the latch check, not shown on screen. Mobile/narrow beyond "opens without errors". Natural
progression, custom palettes, Compact density. A real fight leaving to idle (WX6 restore) beyond
attribute-driven re-measure. Nothing committed.
