# R18 checkpoint: inventory category tabs, 2026-10-16

Owner: the core-ui Claude session, at the coordinator's request (Weibao approved parallel R18, R20
and engine sessions). Worktree `~/.codex/worktrees/ui-r18/yet-another-idle-rpg`, branch
`codex/ui-r18-inventory-tabs` off `codex/gameplay-foundations` at `ea9dbd8d2` (R15–R17 committed).
Ports 19470–19479. Commit on this branch at round end; no merge (Weibao decides), no push.

## One gap (Round 15 plan, R18 row)

Inventory category tabs in the shell: native categories with native counts, Favorites kept, stable
known tabs, an explicit clear-filter path, and the chosen tab remembered per browser.

| Item | Default and reason | Rules |
| --- | --- | --- |
| Tabs | All · Equipment · Usable · Other · Favorites replace the category dropdown. These are the native categories and the native filter; overlap is native (a starred item is in its own category and in Favorites). Real buttons with a pressed state; short labels when the strip is narrow, full names for hover and screen readers | Part 1, L4, CTL1, CTL14, UR53 |
| Counts | Each tab counts the stacks the native filter would show, from row classes. Search does not change them (stated in the hover text, with units). Tabular digits with reserved width, so a count change never moves a neighbouring tab | UX13, UR52 |
| Stable known tabs | All five stay in place once Inventory is known. A known-empty category keeps its tab with 0 and, when chosen, says "No usable items yet" | UX13, CTL14, UR32 |
| Empty states | Distinct lines for: nothing held, empty category, search with no matches | UX13, UR32 |
| Clear filter | Shown when a category other than All or a search is active: one action returns to All and clears the search | UX13 |
| Preference | Panel setting `panel.belongings.category` (browser-local, listed under display settings, never exported into the game save) | NX2, UR58 |
| Sorting leak | Value sort uses the value the row shows. Rows that show no value (unsellable) sort last in both directions instead of by their hidden base value | CTL13 |
| Sort direction | The Reverse control shows the current direction (↑/↓) | CTL13 |

- **Target:** 1366×768 at 14/21px and 1920×1080 at 21px, plus a fight in progress at 21px (WR11).
- **Files:** `src/inventory_tabs.js` (new: categories, counts, tab strip), `src/proto23_shell.js`
  (inventory tools), `src/display.js` (inventory section: sort key), `src/ui_components.js` (optional
  empty-hint hook in the shared list tools, backward compatible), `styles/inventory.css` (new),
  `index.html` (one stylesheet link), `build.js` (one version line), tests and checks.
- **Not touched:** `village_workspace.js` combat cards, `layout_spec.js` top-row data and
  `styles/opponents.css` (R20 owns them); `main.js`, `save_files.js`.
- **Deferred:** re-sorting only at stable moments and selection by item key (R19, UX14), WB1 strip
  placement study, trader/storage tabs, unknown-item knowledge (R28+).
- **Save:** none. The tab preference is a panel setting (browser-local).

## Checks chosen before editing (AD36)

- Failure scenarios: a tab count differs from what the native filter shows; a count change shifts
  a tab under the pointer; an unsellable item sorts by hidden value; the stored category leaks into
  the save export; tabs wrap off-frame at 21px in a fight.
- Unit: `tests/inventory_tabs.test.js` (counts per native category, overlap, units, empty states).
- Browser `check-r18.cjs` on fresh origins at the three targets plus combat at 21px: counts equal
  native visible rows per category; tab choice survives reload; known-empty tab stays and explains;
  clear filter resets category and search; 30 ticks move no tab; value sort puts unsellable last;
  save export unchanged by the preference; no page overflow or errors.
- Inherited r11–r17 checks, `npm test`, `npm run check:arch`, rebuilt on fresh origins.
- Before build frozen from this worktree at `ea9dbd8d2`.

## Technical close

[R18 report](R18_REPORT.md). Files as reserved, plus `.gitignore` (R17 preview-bundle lines missing
from `ea9dbd8d2`). Found and fixed in scope: the shell's category filter never applied (shell row
layout overrode the native display variables). Reservation released; committed on
`codex/ui-r18-inventory-tabs` only.
