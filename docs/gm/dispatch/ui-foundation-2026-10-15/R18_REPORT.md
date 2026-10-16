# R18: inventory category tabs, 2026-10-16

Candidate on branch `codex/ui-r18-inventory-tabs` (worktree `~/.codex/worktrees/ui-r18`), off
`ea9dbd8d2`. Technically verified; Weibao's visual/play acceptance stays OPEN (UR16). Not merged.
[Checkpoint](R18_CHECKPOINT.md) · [Round 15 plan](next-parts/round-15-whole-plan.md), R18 row.
No R16 feedback from Weibao had arrived, so there are no tune items.

## What was wrong

- In the shell, the inventory category dropdown **did nothing visible**. The native filter switches
  row display through CSS variables, and the shell's row layout overrides them, so every category
  showed all rows. The R14 dropdown had this bug from the start.
- There were no counts, and an empty category looked the same as an unknown one (CTL14).
- Value sort leaked hidden values (CTL13). Rows that show no value (unsellable) still sorted by their
  hidden base value: descending put such a row first. Equal shown prices were ordered by the
  unrounded base value.

## What changed

| Change | Detail | Files |
| --- | --- | --- |
| Category tabs | **All · Gear · Use · Other · ★**: the five native categories with native membership. A starred item is in its own category and in Favorites, as natively. Real buttons with a pressed state. Full names (Equipment, Usable, Favorites) are in the hover text, for screen readers, and shown when the strip is wide. Selecting a tab clicks the native control | `src/inventory_tabs.js` (new), `src/proto23_shell.js` |
| The filter works in the shell | Rows outside the chosen category are hidden, using the native membership, keyed on the selected tab | `styles/inventory.css` (new) |
| Counts | Each tab counts the stacks the filter shows; the hover gives stacks and items and says counts ignore the search | `src/inventory_tabs.js` |
| Stable known tabs | Equal grid cells: one row when the column is wide enough (14px, 1920 at 21px), two fixed rows of three when narrow (1366×768 at 21px). A tab's position depends only on the column width, never on counts or the selection. The Clear "×" keeps its cell when inactive | `styles/inventory.css` |
| Empty states (UX13) | Separate lines for nothing held, an empty category (for example "No starred items yet. Star an item to keep it here.") and a search with no matches. The shared list tools gained an optional per-list hint hook; other lists are unchanged | `src/inventory_tabs.js`, `src/ui_components.js` (one line) |
| Clear filter | "×" returns to All and clears the search; disabled when there is nothing to clear | `src/inventory_tabs.js` |
| Preference (NX2) | `panel.belongings.category`, a browser-local panel setting listed under display settings. It is not part of the game save (export uses the global display keys only) | `src/proto23_shell.js` |
| Sort | Name/Value/Type and an ↑/↓ direction button moved into the search row (same Inventory panel), so the tabs keep their own row. **Value sort orders by the shown value;** a row with no shown value goes last in its group in both directions; ties go to quality, then name | `src/display.js` (inventory sort), `src/proto23_shell.js`, `styles/inventory.css` |

Also: `index.html` (one stylesheet link), `build.js` (one version line), `.gitignore` (the R17
preview-bundle lines, missing from `ea9dbd8d2`). Not touched: `village_workspace.js`,
`layout_spec.js`, `styles/opponents.css` (R20), `main.js`, `save_files.js`. No save change.

## Evidence (worktree build, fresh loopback origins, synthetic fixtures)

| Check | Result |
| --- | --- |
| `node --test tests/inventory_tabs.test.js` (new) | 4/4: native categories and controls, membership (books usable; loot, material, component other), overlapping counts with units, the four empty-state lines |
| [`check-r18.cjs`](check-r18.cjs) (new) | **8/8** on R18 (port 19470). At 1366×768 14/21px, 1920×1080 21px and in a fight at 21px: for each tab, its count equals the rows the filter shows, the native control is active, the tab is pressed, no tab moved, an empty category explains itself, no page overflow, no errors. Also checked: Clear returns to All and clears the search (tabs unmoved); the choice survives reload and stays out of the saved game; 30 rendered ticks under a hovered tab move nothing; value sort keeps no-value rows last in both directions. On the frozen R17 build (port 19471) **8/8 fail** |
| Leak proof (same synthetic no-value row, native sort only) | R17: ascending position 11 of 12, **descending 0 of 12** (sorted by its hidden value). R18: 11 of 12 both ways |
| Slack map (WX13), [before](evidence/r18/slack-before/slack-map.md) and [after](evidence/r18/slack-after/slack-map.md) | Visible inventory rows unchanged at 1366×768 14px (14 idle, 14 fight) and in combat at 1920 21px (13). **One row fewer** at 1366×768 21px (idle 6 → 5, fight 5 → 4) and idle at 1920 21px (15 → 14): the labelled tabs need two rows in the narrow column, or a second line at 1920. Page never scrolls |
| `npm test` (worktree, clean branch) | 2,065 pass, **0 fail**, 3 TODO of 2,068 |
| `npm run check:arch` | Pass (8 grandfathered main imports, 298 cycle edges; unchanged) |
| Inherited | `check-r17-preview` 7/7, `check-r16` 16/16, `check-r16-default` 6/6, `check-r15` 4/4, `check-r14` 4/4, `check-r13` 26/26, `check-r12-ticks`, `check-r12-recipe` 20/20, `check-r12-success`, `check-r11-interactions` 4/4. The r13/r14 evidence folders are untracked in git; they were created in the worktree before those checks could run |

Comparisons: [fight at 21px](evidence/r18/compare-combat-1366x768-21.png),
[idle at 14px](evidence/r18/compare-populated-1366x768-14.png); tab screenshots in `evidence/r18/`.

## Findings and options

| Code | Finding | Disposition |
| --- | --- | --- |
| F1 | The shell's category dropdown never filtered (R14 regression found here) | Fixed by R18 |
| F2 | The "21 / 21" search count now repeats the All tab's count | O1 (proposal): drop it from the search row at narrow widths, which gives the search field room. It does not recover the lost row |
| F3 | Trade view shows regional prices but value sort uses the shown base price | Outside the character list's normal view; left for the trade/merchant round |
| F4 | The populated fixture (`calm-vivid-2026-10-14/evidence/populated-ui-fixture.json`) is untracked, so inherited checks fail in fresh worktrees until it is copied | O2: track it as a shared synthetic fixture (owner's call) |

**Row tradeoff at 21px (decision for Weibao):** the default keeps labelled tabs at the cost of one
inventory row in the narrow column. O3 alternative: icon-only tabs with counts at narrow widths
(fits one row, but meaning moves into hover text).

## What to look at (IT5)

1. Click each tab in the shell: the list now filters, and the counts match.
2. ★ with nothing starred: the empty line says how to fill it.
3. "×" Clear after choosing a tab or typing a search.
4. Value sort and the ↑/↓ button.
5. At 21px in a fight: the two-row tabs and the one row they cost.

## Not claimed

Visual acceptance. Re-sorting only at stable moments and selection by item key (R19). Trader and
storage tabs. Mobile. Not merged; commit on this branch only.
