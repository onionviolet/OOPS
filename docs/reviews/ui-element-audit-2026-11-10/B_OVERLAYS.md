# UI element audit, lane B: overlays and disclosures

Round 43, UIC98 (UR101), 2026-11-10. Audit only: no file under `src/`, `styles/`, `tests/` or other `docs/` paths was changed. Findings and fix suggestions are proposals, not accepted decisions. Rows covered: UR100, UR101, UR103 (names in text), UR109, UR110, UR111, UR112, UR113, UR114, UR124, UR126, plus UR43, UR53 and UIV1.

## How measured

- **Probes:** scratch scripts in `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/1a897237-6eb5-4362-8c4d-98423e6bc482/scratchpad/element-audit-B/` (`sweep.mjs`, `disclosure.mjs`, `memory2.mjs`, `tooltip.mjs`, `titles.mjs`, `modal.mjs`, `modal2.mjs`, `popover*.mjs`, `misc.mjs`, `misc2.mjs`, `keyboard.mjs`, `disabled.mjs`, `last*.mjs`, `final.mjs`). Each writes a JSON file next to it. They use `scripts/playtest/lib.mjs` (`buildBundle`, `serve`, `Session`) and are not in the repo.
- **Fixture:** `tests/fixtures/perf/mid.json` prepared as in `broader-ui.mjs` (undefined recipe entries removed, default customization, crafting unlocked, 4 rat meat chunks). Each kind starts from a fresh `s.open(seed)`. Private-pack manifest blocked (empty), so the LOTM cast pack is not loaded.
- **Viewport and clock:** 1920×1080 (previews also at 1366×768); seed 87; wall clock frozen at 2026-10-26 15:00 UTC; simulation paused by the test hooks. `s.step(1)` was called before re-reading disclosure state.
- **Bundle identity:** esbuild bundle of `src/main.js` built per run from HEAD `55fbeb44b`; `bundle.js` sha256 `5388d7c38a5defc262392bf9eb0c3954529594778010f9c9f1b48df3412f4838`. `git status --porcelain src styles tests` was empty at the end. The working tree has unrelated modified docs only.
- **Screenshots:** in `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/1a897237-6eb5-4362-8c4d-98423e6bc482/scratchpad/element-audit-B/shots/`, never in the repo. Each row names its file; `n/a` means no image taken.
- **Limits:** one fixture and one world dress. The sim is paused, so time spent by a click shows only as a changed state hash or work queue (the hash excludes the clock; the clock minute was read separately for names). Disabled-reason checks combine a DOM heuristic with a manual read of each flagged control. Some verdicts are my judgment where the rule leaves a dial (marked in the row). Hover timing was not measured to the millisecond.
- **Safety:** no save, reset or crafting command was confirmed. The typed confirm was cancelled with Esc without typing the word. Each context is a throwaway browser context.

## Summary by kind

| Kind | Consumers | Checks | PASS | GAP | N/A | PASS rate (of PASS+GAP) |
| --- | --- | --- | --- | --- | --- | --- |
| Disclosures (UR109, UR23, UR26, UR42) | 10 | 21 | 12 | 8 | 1 | 60% |
| Tooltips, hover previews and titles (UR111, UR43, UIV1, DSG11) | 7 | 14 | 10 | 4 | 0 | 71% |
| Modals and confirms (UR112, UR5) | 5 | 11 | 7 | 3 | 1 | 70% |
| Popovers, menus and context menus (UR113, UR53) | 5 | 9 | 6 | 2 | 1 | 75% |
| Drag and drop (UR110) | 2 | 5 | 2 | 2 | 1 | 50% |
| Toasts and transient notices (UR114, UR29) | 2 | 5 | 3 | 1 | 1 | 75% |
| Back bars and panel headers (UR124, UR9, UR22, UR30) | 5 | 7 | 6 | 1 | 0 | 86% |
| Keyboard and focus (UR126) | 1 | 5 | 4 | 1 | 0 | 80% |
| Names in text (UR103, UR35) | 4 | 5 | 5 | 0 | 0 | 100% |
| **All** | 41 | 82 | 55 | 22 | 5 | 71% |

Consumer counts count distinct consumers per kind (a consumer can have several rows). Counts are of my own check rows, not of every instance in the product.

## Disclosures (UR109, UR23, UR26, UR42)

Consumers sampled: item More actions, crafting detail sections, Settings display groups, Vows and trials, Trade standing, Homes, Notebook, People you know, plus the workspace module Options group and one summary-less details in the LOTM panel. Also a census of every details element visible across 51 panels (60 unique summaries). Rule used for UR26: a bare heading over an explainer or reference text counts as PASS; a bare heading over live lists or work counts as GAP (my reading, not measured).

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Item More actions (`.shell-item-more`, inventory) | UR26 summary says if opening matters | GAP | Summary is the fixed label "More actions". Inside: Favorite, Auto (consumables), Hotkey…, Compare equipment ›. Closed by default. | `shots/D1-item-more-open.png` |
| Item More actions | UR23 state remembered | GAP | Opened it, selected another item: `open` false. Closed the item and reopened: false. Dial note: closed-by-default is a fair default for rare actions; the cost is one click per item. | `shots/D1-item-more-open.png` |
| Item More actions | UR42 essential control outside the group | PASS | Equip (pants) and Use (bread), Full item ›, Close item sit outside `.shell-item-more`. Only Favorite, Auto, Hotkey, Compare are inside. | `shots/D1-item-more-open.png` |
| Crafting detail (`.craft_detail_*`) | UR26 summary | GAP | "Input stock", "About this recipe", "Result details" carry no count or state. Input stock is live data (what you hold against what the recipe needs). | `shots/D3-crafting-detail.png` |
| Crafting detail | UR23 remembered | PASS | Opened all three, Esc to the village, reopened the same recipe: [true, true, true]. | `shots/D3-crafting-detail.png` |
| Crafting detail | UR42 essential control outside | PASS | `[data-craft-commit]` is visible and not inside any details (commitInside false). | `shots/D3-crafting-detail.png` |
| Settings display groups (`.display-group`) | UR26 summary | PASS | "Opening and panels 3", "Numbers and logs 4", "Inventory 2": each shows a setting count. | n/a |
| Settings display groups | UR23 remembered | PASS | Opened a group, stepped one minute, went to Condition and back (waited 900 ms after the toggle): still open. | n/a |
| Vows and trials (`pledges`) | UR26 summary | GAP | "The vow", "What moves it", "How rations help" are bare; "Not ready: 3 things missing" and "Graded ordeal (optional)" show state. 3 of 5 bare, over rules text that is partly live (rations). | n/a |
| Vows and trials | UR23 remembered | PASS | "How this works" stayed open after a round trip to Condition. | n/a |
| Trade standing (`economy_standing`) | UR26 summary | PASS | Four of six carry counts ("Why prices moved lately · 0", "Worn paths · 0", "Talk · 0"); the two bare ones ("Why each house stands here", "Terms") are explainers. | n/a |
| Trade standing | UR23 remembered | PASS | Three groups opened, round trip, all still open. | n/a |
| Homes | UR26 summary | GAP | "Build a home from the land", "Village home supplier and lodging", "Home history" are bare headings over live choices and records. | n/a |
| Homes | UR23 remembered | PASS | Three groups opened, round trip, all still open. | n/a |
| Notebook | UR26 summary | GAP | "Tools, practice & local lives", "Village crossroads", "Lantern & floodline work", "Village notes", "Routes & supplies" show no count or readiness although the notebook holds live offers. | n/a |
| Notebook | UR23 remembered | PASS | Three groups opened, round trip, all still open. | n/a |
| People you know (`relationship_web`) | UR26 summary | PASS | "Web of who knows what · 1 person", "Village elder · Met". | `shots/q3-people.png` |
| People you know | UR23 remembered | PASS | Both open after the round trip. | `shots/q3-people.png` |
| Workspace module Options (`details.workspace-module-controls`) | UR109 all | N/A | 90 in the DOM, 0 visible: `ui_tokens.css:486` hides them in the proto23 shell. Expand and Collapse sit outside the group. Layout is reached through Menu > Layout instead. | `shots/D-layout-menu.png` |
| LOTM panel (`#lotm_panel`) | UR26 summary | GAP | One `<details>` has no `<summary>` and no content (a browser-default "Details" label would show). Count: 1. | n/a |
| All 60 unique summaries in 51 panels | UR26 census | GAP | 23 show a count or state, 37 do not. By my read about half of the 37 are explainers (fine) and the rest sit over live lists or work. | n/a |

## Tooltips, hover previews and titles (UR111, UR43, UIV1, DSG11)

Consumers sampled: inventory item preview, stat button preview, temperature preview, non-focusable `title` facts, focusable `title` text, disabled controls with title-only reasons. Previews were measured at 1920×1080 and 1366×768. Log-subject previews (`.log-subject`) could not be exercised: the mid fixture's log has no subject links, so that consumer is N/A.

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Inventory item preview (`#shell_item_preview`) | Appears on hover | PASS | Open after hover on first and last row. | `shots/T-preview-1920.png` |
| Inventory item preview | Also on keyboard focus | PASS | Focusing a row opens it (both widths). Focus does not select the item. | `shots/T-preview-1920.png` |
| Inventory item preview | Stays inside viewport | PASS | First and last row at 1920×1080 and 1366×768: rect inside the viewport every time (392 px wide, up to 332 px tall). | `shots/T-preview-1366.png` |
| Inventory item preview | Pins on click | PASS | Click selects the row into the pinned `#proto23_item_detail` (UR43 separate pinned inspection); state hash unchanged. The preview itself does not switch to a dialog. | `shots/T-preview-1920.png` |
| Inventory item preview | Esc dismisses, focus stays on opener | PASS | Preview closed, `document.activeElement` is the row. | n/a |
| Inventory item preview | Role for assistive tech | GAP | `role` is null on the preview; the stat and temperature previews use `tooltip` then `dialog`. `aria-describedby` was not measured. Low. | `shots/T-preview-1920.png` |
| Stat button preview (`[data-attribute-preview]`, STR) | Hover and focus | PASS | Both open `#shell_context_preview` with role `tooltip`. | `shots/T-preview-1920.png` |
| Stat button preview | Viewport | PASS | Inside at both widths. | `shots/T-preview-1366.png` |
| Stat button preview | Pins on click, Esc returns focus | PASS | Enter switches role to `dialog` and `interactive` to true; Esc closes and focus is back on the stat button. | n/a |
| Temperature preview (`[data-context-preview=temperature]`) | Hover, focus, viewport, pin | PASS | tooltip on hover and focus, `dialog` after click, inside the viewport at both widths. The link is underlined and pointer-cursor. | `shots/T-preview-1920.png` |
| Non-focusable `title` facts (season, weather, calendar spans, Trade standing table rows) | UIV1 / DSG11 no fact only in a title | GAP | 9 of 11 unique non-focusable titled elements carry a title longer than their text, e.g. Weather span "Dry" with the title "native weather; no additional effect inferred", and two `tr` rows whose title holds the "Why:" reason for a rival's rate. No keyboard route. | n/a |
| Focusable elements with long `title` (inventory tab counts, control-box buttons, log date row) | UR111 also on keyboard focus | GAP | 60 unique focusable elements have a title longer than their text; 16 of those repeat nothing visibly or in `data-disabled-reason` (e.g. "All 6" tab title "6 stacks, 15 items. Counts ignore the search."; the log date row's "not a sourced civil date" caveat). Native `title` does not show on keyboard focus. 37 of the 60 mirror their `aria-label`, so screen readers get them. | n/a |
| Disabled controls, reason shown without hover | UIV1 | GAP | 36 unique disabled or aria-disabled controls across home and 51 panels; the check flagged 9. After reading each: 2 had the reason in view (Test this body, Carve charged strip), 3 were not blocks (Clear with nothing to clear, "Leave the tone open" as a selected state, a sample button in Settings preview), and 4 are real or weak: Reports Latest (reason only in `title` and `data-disabled-reason`), the pinned-panel Collapse ▾ on Vitals and Current work (same), Craft "Try one batch" in Herbal experiments (no reason at all), Ledger "Lease woodworking assist (2 points)" (label implies the cost, no stated shortfall). | n/a |
| Locked nav routes (`setLocked` / `sayReason`) | UIV1 | PASS | Worlds: reason "No other world is open to you yet" appears in `#ui_locked_reason` on click, in the Panel shortcuts sheet, and in the title. Not title-only. | `shots/N-sayReason.png` |

## Modals and confirms (UR112, UR5)

Consumers: typed confirm (Erase all progress), command palette, Panel shortcuts sheet, the chronicle end screen, the continuation in-panel confirm. The sim is paused by the test hooks, so "nothing behind it changes" is checked as focus and inertness only. The typed confirm was opened through `window.hardReset()` (the same handler the page's onclick calls); the word was never typed.

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Typed confirm (`dialog.typed-confirm`) | One question, consequence and cost | PASS | "Erase all progress?" / "This will erase all your progress and you will have to start from the very beginning." / button "Erase and restart". | `shots/M1-typed-confirm.png` |
| Typed confirm | Mentions what can be recovered | GAP | Text does not say whether a backup or Undo exists, although a Backup and Undo (opt in) panel does. Low. | `shots/M1-typed-confirm.png` |
| Typed confirm | Focus starts on the safe choice | PASS | Focus on the text input; the confirm button is disabled until "reset" is typed; Cancel is first in Tab order. Equivalent to a safe start. | `shots/M1-typed-confirm.png` |
| Typed confirm | Esc cancels, focus returns | PASS | Esc removes the dialog; focus returned to the control that was focused before it opened. | n/a |
| Typed confirm | Content behind is inert | PASS | Focusing a background nav button is refused. Tab cycles Cancel, input and the browser edge only. | n/a |
| Hard reset control (`div#hard_reset_button`) | Reachable | GAP | It is a `div` with onclick, no role, `tabindex` -1, and was not visible in any of the 51 panels or the Menu in this shell. I found no visible or keyboard route to the confirm in the proto23 shell; the classic presentation was not checked. | n/a |
| Command palette (`#command_palette`) | Focus, Esc, inert, return | PASS | Focus on the search box; Esc closes; background focus refused; focus returns to the opener button. The note line says going to a panel changes nothing in the game. | `shots/M2-palette.png` |
| Panel shortcuts sheet (`#workspace_shortcuts`) | Focus, Esc, return | PASS | Focus on Close; Esc closes; focus returns to the opener. The sheet lists Ctrl+K, the row menu keys and the divider keys (UR31). | `shots/M3-shortcuts.png` |
| Chronicle end (`#chronicle_life_end`) | Real modal behavior | GAP | Shown synthetically by clearing `hidden` only. It is a fixed `section` with `role=dialog` and `aria-modal=true`, 720×303 px, but nothing behind it is inert (0 inert siblings, `#main_content.inert` false) and the source uses no `showModal`. Esc and focus start were not measured. | n/a |
| Chronicle end | States consequence and cost | PASS | Buttons carry the effect: "Begin an heir · they receive what this life left behind", "Start a new game · resets all progress". | n/a |
| Continuation in-panel confirm (`confirm()` in `continuation_ui.js`) | One question, consequence, safe focus | N/A | Code read, not exercised: the fixture offered only the baseline action. Per code a review step shows the explanation and puts focus on "Keep this life unchanged" (lines 31-41). Esc behavior unknown. | n/a |

## Popovers, menus and context menus (UR113, UR53)

Consumers: four control boxes (Menu, Inventory Find / filter, Quests Filter, Reports Filter), the inventory row context menu, and its interplay with the item preview. Skills, bestiary and `[data-panel-row]` row menus could not be exercised (no skills in the fixture, rows hidden), and the Here action list is not in the row-menu selector list, so right-click there shows the browser menu. Shift+F10 and the Menu key could not be reproduced in headless Chrome on macOS; the same code path was driven with a synthetic `contextmenu` event at clientX/Y 0.

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Control boxes ×4 | Opens with focus inside, aria-expanded | PASS | All four: popover open, focus in the panel, `aria-expanded` true, rect inside the viewport. (Existing evidence: `broader-ui.mjs` asserts the same Esc contract.) | `shots/P-box-inventory.png` |
| Control boxes ×4 | Esc closes before Back, focus to trigger | PASS | All four: closed, focus on the trigger, center task unchanged. | `shots/P-box-reports.png` |
| Control boxes (Inventory, Reports, Menu) | Outside click dismisses without activating | PASS | Clicking the "Try to craft something" row while open: popover closed, center task still null, state hash unchanged. | n/a |
| Control boxes | Focus after an outside click | PASS | Focus lands on the clicked control, not the trigger, which matches a pointer click. UR53 names focus return for Esc and opener use. | n/a |
| Inventory row context menu (`#row_context_menu`) | Opens, in viewport, labeled | PASS | Items: Toggle favorite, Use, Toggle auto-use; `aria-label` is the row name; inside the viewport. | `shots/P-rowmenu-inventory.png` |
| Row context menu | Esc closes the menu first (UR53) | GAP | With the item preview open (it opens on row focus or hover), the first Esc closed the preview and left the menu open; the second closed the menu and focus returned to the row, which reopened the preview. Menu and preview were open together. | `shots/P-menu-plus-preview.png` |
| Row context menu | Outside click dismisses without activating | GAP | Right-click row, then click "Try to craft something": menu closed and the center task changed from null to crafting. `row_context_menu.js` closes on `pointerdown` and does not swallow the click; `control_box.js` does. | n/a |
| Row context menu | Every item has a visible equivalent | PASS | Use is in the item detail; Favorite and Auto are in More actions (two steps). The row's own star/use/auto controls are hover-revealed with tabindex -1, so the keyboard equivalent is the detail panel. | `shots/D1-item-more-open.png` |
| Row context menu | Keyboard open (Menu key, Shift+F10) | N/A | Synthetic keyboard-style event opened it anchored below the row (menu at 36,706 for a row ending at y 710). The real keys were not reproducible here; listed in the shortcuts sheet. | n/a |

## Drag and drop (UR110)

Only two drag consumers exist in `src/`: the workspace panel drag in `workspace_layout.js` and the four shell resize separators. There is no HTML5 `draggable` use and no inventory drag. Fewer than three consumers, so both are checked. Pointer drag with drop-target preview was not run.

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Workspace panel drag handle (`.workspace-drag-handle`) | Click or keyboard equivalent | PASS | 0 of 90 handles are visible until Menu > Layout > Edit layout; then 7 are, tabbable, and ArrowDown moved a panel (order changed). Handle title: "Drag to reorder or dock. Arrow keys move; left/right changes dock." | `shots/D-edit-layout.png` |
| Workspace panel drag handle | Esc cancels | GAP | After a keyboard ArrowDown move, Esc did not restore the order. Esc cancels a pointer gesture only (`workspace_layout.js:484`); keyboard steps commit at once. Reset layout is the undo. | `shots/D-edit-layout.png` |
| Shell resize separators (`[data-shell-resize]` ×4) | Keyboard equivalent | PASS | role `separator`, tabindex 0; two ArrowRight presses widened the left column from 336 to 356 px. | n/a |
| Shell resize separators | Esc cancels | GAP | Title says "Arrow keys adjust; Escape cancels a drag"; after Esc the width stayed 356. Wording matches a pointer drag, not the keyboard steps. | n/a |
| Both | Drop target shows what it accepts | N/A | Not measured (pointer drag not executed). The Layout menu says "Edit layout to drag headers, float panels or resize edges and dividers". | `shots/D-layout-menu.png` |

## Toasts and transient notices (UR114, UR29)

No auto-dismissing toast component exists in `src/`. Transient surfaces are the locked-reason status line, status lines such as the save state, and log lines for arrivals. Trade and mixture notices (`trade_stock_notice`, `mixture_notice`) were not triggered. The Save button was not located in the bar (its text did not match), so the save status was only read before a save: "Saving available."

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Locked-reason line (`#ui_locked_reason`) | Does not cover controls | PASS | `position:fixed` under the Worlds button, covers no interactive element. | `shots/N-sayReason.png` |
| Locked-reason line | Can be dismissed | GAP | Still visible after Esc; hides by itself within 6.3 s, or on blur of the locked control. No dismiss control. | `shots/N-sayReason.png` |
| Locked-reason line | Lands somewhere durable | PASS | Not in the Reports log, but the reason is repeated in the nav title and the Panel shortcuts sheet, and it is a state, not an event. | `shots/N-sayReason.png` |
| Panel-arrival notice ("Loadouts is now available in navigation.") | Durable place and link to source (UR29) | PASS | It is a Reports row with a "Related panel ›" button; the click opened `workspace:loadouts`, state hash unchanged. Row `tabindex` is -1, the button is the stop. | n/a |
| Panel-arrival notice | Interrupts only as UR88 will allow | N/A | UR88 is not yet answered by Weibao; no measurement. | n/a |

## Back bars and panel headers (UR124, UR9, UR22, UR30)

Consumers: Crafting, Ledger > People you know > Remembered years (a three-deep stack), Full item ›, Crafting > Ledger. Seven center panels sampled for header anatomy.

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Crafting center view | Names its destination (UR9) | PASS | `#center_mode_back` reads "← Village". | `shots/B-crafting.png` |
| Ledger > People > Memories stack | Back goes where you came from (UR22) | PASS | Bar read "← Ledger" over People you know and "← People you know" over Memories; each Back click returned to the named view. | n/a |
| Crafting > Ledger | Names the real previous place | PASS | Bar read "← Crafting" over the Ledger; Back returned to Crafting. | n/a |
| Full item › | Esc returns, bar names a place | PASS | Bar "← Village"; Esc returned to the village (task null). The item was opened from the Inventory region of the home layout, which is why it names Village, not Inventory. | `shots/B-fullitem.png` |
| Ledger view with 2262 px of content | Pinned at the bottom | PASS | Back bar y stayed 984 after scrolling the content 600 px. It sits in `.center_mode_navigation` below the scroller (static position, not sticky), 62 px above the viewport bottom. | n/a |
| Seven center panel headers | One header anatomy (UR124, UR30) | PASS | All seven use `.workspace-module-header.expanded-panel-heading`: title plus a ▾ button. | n/a |
| Seven center panel headers | One-line status, pin (UR30) | GAP | None shows a status line or pin: `ui_tokens.css:486` hides `.workspace-panel-status` and the module controls in the proto23 shell. | n/a |

## Keyboard and focus (UR126)

One pass: 160 Tab presses from the start of the page at 1920×1080, plus Tab through an open Reports popover and the typed confirm. Names in text are listed under their own kind below.

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Home shell, 160 Tab stops | No keyboard trap | PASS | 101 unique stops; the 102nd stop repeats the first (the cycle wraps through the browser edge, one stop is `body`). | `shots/K-focus-end.png` |
| Home shell | Visible focus ring from tokens | GAP | 100 of 101 stops have an outline or shadow (2 to 3 px, gold, light blue). The Menu control-box button has `outline-style: none` and no shadow when focus-visible is true. At least one stop uses the browser default blue ring (auto 1px). | `shots/K-focus-end.png` |
| Home shell | Tab order follows reading order | PASS | Bar first in DOM and on screen (y 0); then You, Around you, Inventory, Actions, Reports. 6 small backward jumps inside two-column grids and summary rows. | `shots/K-focus-end.png` |
| Reports popover | Tab out of an open box | PASS | Focus left the panel after 8 stops; the manual popover stayed open, so focus is not trapped. | n/a |
| Panel shortcuts sheet | Shortcuts listed (UR31) | PASS | Lists nav hotkeys, Esc, F6, divider keys, Ctrl+K, and the row menu keys. | `shots/M3-shortcuts.png` |

## Names in text (UR103, UR35)

Consumers: a person tile in Around you, an inventory item name, a recipe name in the crafting list, the temperature link. Log subjects (`.log-subject`) had no instances in the fixture, so that consumer is N/A. Names inside prose lines (for example a Reports hint naming a person) are plain text and were not tested.

| Consumer | Check | Verdict | Evidence | Screenshot |
| --- | --- | --- | --- | --- |
| Person tile (`button[data-inspect-nearby]`) | Click inspects, spends no time (UR35) | PASS | State hash and clock minute unchanged; detail shows "Talk with …" as a separate button. | `shots/N-person-inspect.png` |
| Inventory item name | Click inspects, spends no time | PASS | State hash unchanged; pinned detail opens. | n/a |
| Recipe name (crafting list) | Click inspects, spends no time | PASS | State hash unchanged; `#crafting_detail` visible. | n/a |
| Temperature link | Click pins, spends no time | PASS | State hash unchanged; preview becomes a dialog. | n/a |
| Person tile, inventory name, temperature link | Look distinct from buttons | PASS | Inventory names are plain rows (no underline, default cursor); the temperature link is underlined; person and service tiles share one boxed look, and the actions list uses a different look. | `shots/N-person-inspect.png` |

## Gaps ranked

Ranked by how many consumers share the cause and how often a player meets it. Defaults are proposals with a dial and a reason; none is accepted.

| Rank | Code | Gap | Consumers | Likely cause (file) | Suggestion (default, dial, reason) | Effort | Scope |
| --- | --- | --- | --- | --- | --- | --- | --- |
| G1 | UR26, UR109 | Disclosure summaries over live content show no count or state | 6 sampled (item More actions, Crafting detail, Vows, Homes, Notebook, LOTM panel); 37 of 60 unique summaries bare | `details` elements are built per panel in about 30 `src/` files; I found no shared helper that asks for a status string | Default: a shared disclosure helper takes a required `status` (count, ready, due) and warns in `check:rules` when it is missing over live lists. Dial: explainers may stay bare. Reason: the summary is the only part a player reads without opening it. | M (helper S, per-panel M) | SHARED |
| G2 | UIV1, DSG11, UR111 | Facts and reasons that live only in `title` | 3 families: 9 non-focusable titled facts (weather, season, calendar, Trade standing rows), 16 focusable title-only strings (tab counts, log date caveat), 4 disabled controls (Latest, Collapse ▾ on Vitals and Current work, Try one batch, Lease woodworking assist) | Ad hoc `title =` assignments (106 files touch `title`); `locked_control.js` solves it for routes only | Default: a `statusReason(button, text)` helper like `setLocked` that also writes a visible small line; for facts, show them in the nearby preview or the detail panel. Dial: purely decorative repeats may stay in a title. Reason: native titles never show on keyboard focus. | M | SHARED |
| G3 | UR53 | Row context menu does not swallow the outside click and loses the Esc order to the item preview | 1 (inventory), 2 defects; any future row-menu consumer inherits it | `row_context_menu.js` (`onOutside` uses `pointerdown` without the click swallow in `ui/control_box.js`); Esc capture in `proto23_shell.js` runs before it | Default: reuse the control box's swallow-once pattern, and close or suppress the item and context previews while the row menu is open so Esc hits the top layer. Dial: none. Reason: the click activated Crafting in the test. | S | LOCAL |
| G4 | UR126 | Menu control-box button has no visible focus ring | 1 of 101 stops (the Menu button in the bar) | computed `outline-style: none` (width 3px, colour set) on `.control-box-button` in the bar; the style rule itself was not located | Default: the same token ring as the other buttons. Dial: ring style per world dress. Reason: it is the button that opens Settings, Layout and links. | S | LOCAL |
| G5 | UR112 | Chronicle end is marked `aria-modal` but is not modal; Hard reset has no visible route in the shell | 2 (chronicle_ui.js, the Hard reset `div`) | `chronicle_ui.js:62` builds a `section` instead of a `<dialog>`; `index.html:844` keeps the Hard reset button as a `div` in the classic options that the shell hides | Default: a modal `<dialog>` with focus on the heir/choose step, and a visible Data > Hard reset row that opens the existing typed confirm. Dial: whether the ending is a full-screen view (UR5). Reason: the death screen is a weighty choice, and the reset confirm is unreachable by keyboard. | M | LOCAL |
| G6 | UR110, UR43 | Esc does not undo keyboard drag and resize steps although the copy says it cancels | 2 (panel drag handle, 4 resize separators) | `workspace_layout.js:484` cancels pointer gestures only; the `title` text is shared by the resize separators | Default: keep steps committed and reword the title to "Esc cancels a mouse drag; Reset layout undoes steps", or hold a keyboard session that Esc rolls back. Dial: per-player setting. Reason: wording promises more than the control does. | S | SHARED |
| G7 | UR23 | Item More actions forgets its state; the last toggle can be lost if you leave within a second | 1 for More actions; disclosure memory elsewhere kept state after a 900 ms wait (in the first run, the last of five toggles made right before navigating was lost in 5 of 5 panels) | `.shell-item-more` re-rendered per selection; disclosure memory appears to save after a short delay (cause inferred, not verified) | Default: remember More actions open state per session; flush disclosure state on navigation. Dial: closed by default stays fine. Reason: low, but cheap. | S | LOCAL |
| G8 | UR30 | Panel headers show no one-line status or pin in the shell | 7 of 7 center panels | `styles/ui_tokens.css:486` hides `.workspace-panel-status` and module controls in the proto23 shell | Default: show the status line in the header (counts and readiness), keep pin in the Layout menu. Dial: header density per player setting. Reason: UR26 summaries for panels need a home. | M | SHARED |
| G9 | UR114 | Locked-reason line cannot be dismissed with Esc | 1 | `locked_control.js` `sayReason` has a timer and blur only | Default: Esc and a pointer click elsewhere hide it. Dial: duration. Reason: it can sit over the next control for 6 s. | S | LOCAL |
| G10 | UR111 | Item preview has no `tooltip` role; typed confirm names no recovery | 2 low items | `proto23_shell.js` item preview `aside`; `typed_confirm.js` text from `main.js:8553` | Default: role `tooltip` plus `aria-describedby` on the source; add "A backup or Undo may exist" only when the opt-in save authority is enrolled. Dial: wording. Reason: parity with the stat preview. | S | LOCAL |

Cross-check: G1, G2, G6 and G8 repeat in more than one consumer and share a helper or style rule, so they are marked SHARED. G3, G4, G5, G7, G9 and G10 live in one file each.

## Passes worth keeping

- Control boxes (`ui/control_box.js`): Esc, focus return, click-swallow and viewport placement all hold across four consumers.
- Modals built on `<dialog>` (typed confirm, palette, shortcuts sheet): focus, Esc, inertness and focus return all passed.
- Hover previews for stats and temperature switch from `tooltip` to `dialog` on click and stay inside the viewport at 1366×768.
- Back bars name the real previous view in a three-deep stack and stay pinned over a long view.
- Names in text spent no time in all four sampled consumers.

## Not checked

- The LOTM/Tingen workroom and other private-pack worlds: manifest blocked; only the one summary-less `details` in `#lotm_panel` was seen.
- 150% text (UR33), reduced motion, and world dress (UR98).
- The real-time sim under a modal (the hooks pause it).
- `.log-subject` previews and names inside prose: the fixture log has no subject links.
- Skills, bestiary and `[data-panel-row]` row menus; the Here action list has no custom row menu.
- The real Menu key and Shift+F10 (headless Chrome on macOS did not produce a `contextmenu` event); the same path was driven synthetically.
- Pointer drag and drop with drop-target preview and release behavior.
- Trade and mixture notices, the Save button's status after a save, the Layout menu's own Esc and focus return, and `workspace-picker`.
- The classic presentation (where the Hard reset `div` may be visible) and the chronicle end's Esc and focus start.
- Continuation confirm: code read only, not exercised.
- Hover delay timing, and `aria-describedby` on item previews.
- Touch input and mobile widths (deferred by the standing UI priority).
