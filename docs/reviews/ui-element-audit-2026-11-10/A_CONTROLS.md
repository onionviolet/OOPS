# Element audit lane A: controls (UIC98)

Round 43 of [the UI design core audit](../../audits/UI_DESIGN_CORE_AUDIT.md). Rules checked: UR100, UR101, UR102 (buttons and action rows), UR104 (selects), UR105 (toggles and checkboxes), UR106 (sliders and number entry), UR107 (text fields and search), UR108 (tabs), UR126 (keyboard and focus), UR127 (text inside elements), plus UR10, UR33, UR66 and UIV1 where they apply to those rows. Audit only: no source, style or test file was changed. Findings are proposals, not accepted decisions.

## How measured

- Probe scripts (scratch, not in the repo): `/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/1a897237-6eb5-4362-8c4d-98423e6bc482/scratchpad/element-audit-A/` (`probe.mjs` panel sweep, `probe3.mjs` Village, inventory, crafting and mixing views, `probe4.mjs` Tab walk, Esc and tabs, `probe5.mjs` game bar, `probe6.mjs` safe clicks and number entry, `probe7.mjs` and `probe8.mjs` 150% checks). They reuse `scripts/playtest/lib.mjs` (`Session`) and `scripts/perf/lib.mjs` (`prepareTree`, `build`, `serve`).
- Build: a temp copy of the worktree built with `build.js` and served on a private 127.0.0.1 port with `?test_hooks=1`. HEAD `55fbeb44b`; dirty files at start were docs only (no `src/` or `styles/` change), so the bundle matches HEAD source. Bundle `dist/bundle.js` sha256 `5388d7c38a5defc262392bf9eb0c3954529594778010f9c9f1b48df3412f4838`.
- Fixture: `tests/fixtures/perf/mid.json` with the `broader-ui.mjs` edits (crafting unlocked, four Rat meat chunks, default customization, empty private-pack manifest). Viewport 1920x1080, frozen clock, seed 87, headless Chrome. Text size 14 (100%) and 21 (150%, the `broader-ui.mjs` setting).
- What was measured per control: accessible name (aria-label, labels, text; the Village list also through the Playwright aria snapshot), rendered height against `--ui-control-sm/md/lg` (resolved 20, 28 and 42 px at both text sizes), computed outline and box-shadow before and after `focus({focusVisible:true})`, then a real 90-press Tab walk and a Tab walk through the game bar, disabled reason (visible text, `aria-describedby`, or `title` only), label form, truncation (`scrollWidth` greater than `clientWidth`, plus a canvas text measure for selects), active state by more than colour (computed style diff with colour properties removed), Esc behaviour, and one safe click per kind.
- Counting rule: a consumer is a module plus a visible label group. Controls that repeat in the shell (equipment slots, panel header toggles, resize handles) are not counted per panel. Pass rate is PASS over PASS plus GAP; n/a and n/e (not exercised) are left out.
- Screenshots (scratch, may show sealed text, not committed): `.../element-audit-A/shots/` (for example `14-v-village.png`, `14-v-crafting-recipe.png`, `14-known-things.png`, `14-effects-checkbox.png`, `14-settings.png`, `14-inspect-elder.png`, `14-craft-settled.png`).
- Limits: programmatic focus forces `:focus-visible`, so the ring result was cross-checked with real Tab presses (Tab walk of 90 stops; game bar by Tab). All clicks in the fixture were instant actions, so a long-running pending state was never seen. Three console 404s (resource loads) appear at every open and were not investigated; the playtest `errors` list has no page errors.

## Census (UR101)

Controls found at runtime in `#main_content` across 24 panels plus the Village, inventory, crafting and mixing views (a control can show in several panels; the counts are for one open view each): about 86 buttons in the Village view alone, 56 selects in the swept panels (35 in Settings > Effects), 9 checkboxes, 16 role=tab buttons (5 sets) plus 2 aria-pressed segmented sets, 4 search fields, 11 number inputs, 9 colour inputs, 5 textareas, and no `type=range` input anywhere (grep of `src/` and the runtime census agree).

## Buttons and action rows (UR102, UR66, UR10, UIV1, UR126)

Checks: N name, H height on a control-size token (within 1 px of 20, 28 or 42), F visible focus ring, D disabled reason visible, L label gives outcome with cost or time, T no truncation at 100% and 150%, K pending then settled feedback, S text scales at 150%.

| Consumer (module, visible label) | N | H | F | D | L | T | K | S | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Village action list (`simulation_ui.js`, "Move somewhere else", "Try to craft something", "Train", "Find work", "Mix at the Village counter") | PASS | GAP | PASS | n/a | GAP | PASS | PASS | PASS | heights 25.2 to 36.2 px in one list; labels are category verbs with no cost or time; a click opens the view in the same frame with no game time. Icon ligature text is not in the accessible name (aria snapshot reads `button "Move somewhere else"`). `14-v-village.png` |
| Around you cards (inspect elder, trader, services; `current_focus`) | PASS | n/a | PASS | n/a | PASS | PASS | PASS | PASS | multi-line cards 43.8 and 59.4 px; click flips `aria-pressed` false to true and shows the card at once, no time passes (UR35). `14-inspect-elder.png` |
| Item detail (`proto23_shell.js`, "Equip", "Full item ›", "Close item") | PASS | GAP | PASS | n/a | GAP | PASS | n/e | PASS | all three 24.2 px, between sm and md; verbs only, no slot or time; four unnamed-looking buttons sit inside the closed "More actions" disclosure (see Not checked) |
| Crafting detail (`crafting_detail.js`, "Craft 1", "5", "10", "All") | PASS | PASS | PASS | PASS | GAP | PASS | PASS | PASS | 28.2 px; blocked state keeps `aria-disabled` and shows a visible reason line; "Craft 1" names no outcome, cost or time (the panel says "Instant: no game time passes" and "Cost" elsewhere). Click: button unchanged, "Ready: 2 attempts" becomes "1 attempt", Reports gains "Craft settled: Roasted rat meat x1"; no pending state because it is instant. `14-craft-settled.png` |
| Mixing (`mixture_ui.js`, "Mix one vial", "Set up this try") | PASS | PASS | PASS | PASS | GAP | PASS | n/e | PASS | 28.2 px; disabled "Mix one vial: steep" shows "Not enough River bellleaf free after holds." as text beside it; label has no cost or time |
| Game bar (`game_bar.js`, "Panel shortcuts", "Menu", "Find") | PASS | GAP | GAP | n/a | PASS | PASS | n/e | GAP | heights 21 and 22 px; Tab onto "Panel shortcuts" and "Menu": outline none, no shadow, border and background unchanged; "Find" gets the browser default 1 px auto ring on an unstyled light button. At 150% text: font stays 13.3 px and 14 px |
| Top panel buttons (`workspace_navigation.js`, "Stats" to "Beginning") | PASS | PASS | PASS | GAP | PASS | PASS | n/e | GAP | 27 px (within 1 px of md); disabled "Worlds" has its reason only in the `title` ("No other world is open to you yet"); the Alt key shows only in `title`; font stays 14 px at 150% |
| Reports dock (`proto23_shell.js`, "Latest", "Show me") | PASS | GAP | PASS | GAP | PASS | PASS | n/e | PASS | "Latest" 19.5 px (below sm); disabled with `title` "Jump to the latest message", which says what it does and not why it is off |

Pass rate: 33 of 46 scored checks, 72%. Focus ring on every other measured button (236 of 236 controls that took focus) PASS.

## Selects (UR104, UR127, UR126)

Checks: N name, H md height, F ring, V current value shown in the closed control, D unavailable or disabled state explains itself, T value not clipped at 100% and 150%.

| Consumer (module, visible label) | N | H | F | V | D | T | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Stats "Attribute group" (`proto23_shell.js`) | PASS | PASS | PASS | PASS | n/a | PASS | 28 px, shows "All attributes", 9 options |
| Gear workshop, five selects (Maker, Carried gear, Gear process, Process material, Material role; `gear_workshop_panel.js`) | PASS | PASS | PASS | PASS | n/a | PASS | 28 px; the closed value is an instruction ("Choose carried equipment") when nothing is picked; 16 options in Gear process |
| Homes "Furnishing to buy" (`home_panel.js`) | PASS | PASS | PASS | PASS | n/a | PASS | options carry price ("Condensate cradle · 30 coins"); the measured text is within 3 px of the box at 150%, borderline |
| Spills and smoke, "Stock to spill" and "Room level" (`field_layer_panel.js`) | PASS | PASS | PASS | PASS | PASS | PASS | the disabled stock select shows "Carry a vial or ingredient..." as its value, which says what is missing |
| Settings, 41 selects (`customization_ui.js`, "Profile", "Font", "Seasonal theme", "Manual season", Display) | PASS | PASS | PASS | PASS | GAP | PASS | "Manual season" is disabled while Seasonal theme is "off" with no text, `title` or description. At 150% the Display selects are within 3 to 5 px of clipping (shrink to fit); not counted as a gap |
| Mixing (`mixture_ui.js`, "Mixing method", process steep/boil) | GAP | PASS | PASS | PASS | n/a | PASS | `select#mixture_process` has no `aria-label` and no label: empty accessible name |
| Past lives "Inheritance law" (`lives_carry_domain.js`) | PASS | PASS | PASS | PASS | n/a | PASS | 28 px, shows "single-successor (de..." |

Pass rate: 35 of 37, 95%. No select in the sample had an unavailable option, so "unavailable option stays listed with its reason" was not testable (n/a). Type-ahead is native browser behaviour and was not exercised.

## Toggles and checkboxes (UR105)

Checks: N name, H hit area (the clickable label, not the 13 px box), F ring, L label says what "on" does, W says when it applies.

| Consumer (module, visible label) | N | H | F | L | W | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Stats "With modifiers" (`proto23_shell.js`) | PASS | PASS | PASS | GAP | PASS | label hit area 146x36 px; label is two words; click applies at once (panel text changed by 970 characters) but no owner or reset scope is stated |
| Story "Let unpracticed skills go rusty here..." (`story_insight_domain.js`) | PASS | PASS | PASS | PASS | n/e | full sentence says what on does; label 1065x36 |
| Village experiments, "Layered brazier", "Body-conditioning tablet", "Hold on the brazier" (`crafting_home.js`) | PASS | PASS | PASS | GAP | n/e | names the thing, not its effect |
| Settings Effects, "Sound after gesture", "Static VFX", "Plain text VFX" (`customization_ui.js`) | PASS | GAP | PASS | PASS | PASS | "Static VFX" and "Plain text VFX" inputs measure 876x28 px: the box is stretched to the full field width and drawn as a large white square 440 px from its label (`14-effects-checkbox.png`). Banner "Changes here remain a draft" states when it applies |
| Village neighbors, "A harder village..." (`village_neighbors` view) | PASS | PASS | PASS | PASS | n/e | sentence label; not toggled (it changes the world) |

Pass rate: 19 of 22, 86%.

## Sliders and number entry (UR106)

Sliders: n/a. No `input[type=range]` exists in `src/` or at runtime. Number entry has consumers; checks: N name, U unit visible, R allowed range visible, E typed entry works, P effect previewed before commit, F ring.

| Consumer (module, visible label) | N | U | R | E | P | F | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Settings "Font size", "Spacing" (`customization_ui.js`) | PASS | GAP | GAP | PASS | PASS | PASS | no unit in the label; min 10, max 28 exist only as attributes. Typing 99 is accepted into the field (`validity.valid` false, browser message only) while the app font stays 14 px; changes stay a draft with a preview panel |
| Settings "Receipt duration (ms)" (`customization_ui.js`) | PASS | PASS | GAP | PASS | PASS | PASS | unit in label; range (200 to 10000) not shown |
| Own places, eight number fields ("Work time (played minutes)", "Coin paid on completion (wood coins)"; Settings > Your own places) | PASS | PASS | GAP | PASS | n/e | PASS | units in labels; ranges 0 to 999 not shown |
| Mixing amount, "River bellleaf" etc. (`mixture_ui.js`) | GAP | PASS | n/e | PASS | n/e | PASS | the label wraps the Buy button, so the accessible name reads "River bellleaf (0 owned) Buy 1 (8 coins)Also gath..." |

Pass rate: 16 of 21 scored checks, 76%.

## Text fields and search (UR107, UR126)

Checks: N accessible name, L visible label (not placeholder only), E Esc clears, then closes, C result count shown, F ring, H height on md.

| Consumer (module, visible label) | N | L | E | C | F | H | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Known things search (`known_things.js`, "Search known things") | PASS | GAP | GAP | n/a | PASS | PASS | `labels.length` 0: aria-label plus placeholder "Search what you have met" only. Typed "wolf", Esc: value stayed; second Esc closed the whole panel with the query kept. List was empty in the fixture so no count could show. `14-known-things.png` |
| People filter (`ui/figure_interact.js`, `.fig-filter`) | PASS | GAP | GAP | n/e | PASS | PASS | placeholder "Filter" plus aria-label; Esc left "zzz" in place (a separate Clear button exists) |
| Inventory find (`ui_components.js`, opened by "Find / filter") | PASS | GAP | GAP | PASS | PASS | PASS | field has placeholder only (the opener button carries the words); Esc closes the box and returns focus to the opener but keeps the query "pants"; count "1 / 6 stacks · 1 items" shows |
| Journal textarea (`personal_journal_domain.js`, "Your journal") | PASS | n/e | n/a | n/a | PASS | n/a | multi-line, 188 px |
| Rune recipe textarea (`pledges_ui.js`) | PASS | n/e | n/a | n/a | PASS | n/a | 191x42 px |
| Settings text fields ("New profile name", own-places "Site name", "Activity name"; `customization_ui.js`) | PASS | PASS | n/a | n/a | PASS | PASS | visible labels beside the field (`14-settings.png`) |

Pass rate: 18 of 24, 75%.

## Tabs and segmented controls (UR108, UR23, UR126)

Checks: N name, H 28 px token, F ring, M active state marked by more than colour, R roving arrow keys and the choice returns with the view.

| Consumer (module, visible tabs) | N | H | F | M | R | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Known things (`known_things.js`: Creatures, Books, Items, Places) | PASS | PASS | PASS | PASS | n/e | `role=tab`, `aria-selected`; active tab differs by a 2 px inset bar and glow, not only colour |
| Notebook (`adventure_notebook.js`: Here, Practice, People) | PASS | PASS | PASS | PASS | n/e | 363 px wide, same bar |
| Ledger (`work_ledger_ui.js`: Work, Owed) | PASS | PASS | PASS | PASS | n/e | same |
| Region (`region_view.js`: Roads, Today, Notes) | PASS | PASS | PASS | PASS | n/e | same |
| Tingen workroom (`book_world_lotm_tabs.js`: Here, Path, Work & merit, Notebook) | PASS | PASS | PASS | PASS | PASS | ArrowRight moved selection Path to Work & merit; unselected tabs have tabindex -1; after leaving and reopening, "Work & merit" was still selected |
| Village Actions and Options (`aria-pressed`; "Options · 5 (3 ready)") and bottom Here, Crafting, Mixing (`aria-current`) | PASS | PASS | PASS | PASS | n/e | active bar by `box-shadow` inset and a 2 px top border; the label carries a count and ready state (UR26) |

Pass rate: 31 of 31 scored, 100%. The inventory category row (All, Gear, Use, Other, favourites, with counts) was seen in the screenshot with an underline bar but its computed style diff failed (selector), so it is n/e in numbers.

## Keyboard and focus (UR126) and text (UR127)

- Focus ring: every control that took focus in the sweeps (438 of 438 by `focus({focusVisible:true})`, all `solid 2px`, offset 2 px, plus a glow) showed the same ring. It comes from one rule, `#main_content.workspace-active :focus-visible` (`styles/ui_tokens.css:301`, `!important`), and `#workspace_navigation button:focus-visible` (line 364). Exceptions found by real Tab: game bar "Panel shortcuts" and "Menu" (no rule reaches them), "Find" and "Other known panels" (browser default 1 px auto ring). Trade window buttons carry `outline:none` (`ui_tokens.css:1793`, `1795`), but the line-301 rule is `!important` and wins by cascade; the trade window itself was not opened in the browser.
- Tab walk, 90 presses from the Village: no keyboard trap (focus advanced every press and left the page once at stop 82 before wrapping to the nav). Reading order is not the visual order: the top panel nav (Stats to Beginning) is reached at Tab stop 83 and the game bar after it; the character bars go xp, stamina, then health while health is drawn first; 10 backward jumps in y were counted; four 6 px resize handles are Tab stops before the nav.
- Hotkeys (UR31): the Alt+key hints for panel buttons are in `title` only, so they appear on hover and not on keyboard focus.
- Text (UR127): inventory "Find / filter: Name..." and Reports "Filter: All r..." show ellipsis with the full text in `title` or `aria-label`; no clipped button text at 100% or 150% in the Village, inventory, crafting and mixing views (`scrollWidth` check, 0 hits at 21). One input (`#authored_site_activityName`) reported overflow, which is normal for a text field.
- 150% text: panel controls grow with the text (28 px to 42 px selects and tabs, 28 to 33 px bottom tabs); the control-size tokens stay at 20, 28 and 42, so "height on a token" holds only at 100%. The top nav and game bar do not scale.

## Gaps ranked

Ranked by rule weight, number of consumers and fix cost. Each suggestion is a default with a dial and a reason, adjustable.

1. **G1 Game bar focus indicator missing (UR126).** 3 controls ("Panel shortcuts", "Menu", "Find"; plus "Other known panels" on the default ring). SHARED: the token ring is scoped to `#main_content.workspace-active` (`styles/ui_tokens.css:301`) and the nav (line 364); `#game_bar` has no rule. Suggestion: default to a ring rule on `:where(button,select,input,summary,[role=button]):focus-visible` at root scope with the token colour, with the existing scoped rules kept for world dress. Dial: ring colour per dress. Reason: a keyboard player cannot see where they are in the one bar they use for Save. Effort S.
2. **G2 Text inside the top bar and nav does not follow the text-size setting (UR33).** 2 consumers (game bar, top panel nav). SHARED shell chrome (`game_bar.js`, `workspace_navigation.js` styles): "Find" stays 13.3 px and the nav 14 px at size 21. Suggestion: default their font size to the same variable as the panels, with the heights allowed to grow. Dial: a cap per region on narrow widths. Reason: UR33 promises 150% everywhere. Effort S to M.
3. **G3 Search fields have no visible label and Esc does not clear (UR107).** 3 of 3 search consumers (`known_things.js`, `ui/figure_interact.js`, `ui_components.js`). SHARED by absence: each builds its own input, so there is no common search component to carry the rule. Suggestion: one `searchField({label, count})` helper that renders a visible label, a result count and "Esc clears, then closes", and migrate the three. Dial: label can be visually shortened inside tight lists. Reason: search is the main way through a growing record (KNW26). Effort M.
4. **G4 Checkbox stretched by a broad selector, and labels that name the thing instead of the effect (UR105).** "Static VFX" and "Plain text VFX" draw an 876 px wide checkbox. SHARED CSS: `styles/ui_tokens.css:1769` (`.ui-control-field > :is(select,input){width:100%}`) also hits checkboxes. Suggestion: exclude `[type=checkbox],[type=radio]` from that rule and give toggles the label-after layout. Effort S. Same row, labels that name the thing and not the effect ("With modifiers", "Layered brazier"): LOCAL, 2 consumers, suggest "Show stats with modifiers" style sentences and a one-line scope (UR58); effort S.
5. **G5 Tab order is not reading order (UR126).** The top nav and game bar come after about 83 stops; the vitals bars are out of order; resize handles precede the nav. SHARED shell layout (DOM order in `workspace_navigation.js` and `main.js` shell build). Suggestion: place the nav and game bar first in the DOM, or give the Village a skip link; keep the resize handles last. Dial: skip link instead of reordering. Reason: a keyboard player reaches Stats after 83 presses. Effort M.
6. **G6 Action labels lack outcome, cost and time (UR102, UR10).** 4 consumers (Village action list, "Craft 1", "Mix one vial", "Equip"). SHARED through `action_label.js` for the narrow-width rule, but the content is per label. Suggestion: default to "Roast 1 Roasted rat meat · instant" and "Mix one vial · 3 min" style labels, with the cost line kept in the panel. Dial: shorten by disclosure on narrow regions. Effort M (per-label content).
7. **G7 Heights off the three control sizes (UR66).** 6 consumers: Village action list (25 to 36 px), item detail (24.2), game bar (21, 22), "Latest" (19.5), panel header toggles (18.2, 22.2), ledger "Cancel active effect" (33). SHARED by the lack of a base rule: heights come from per-region rules (`ui_tokens.css:1770` to `1795` set `min-height` only for some groups). Suggestion: a default `min-height: var(--ui-control-md)` on `button` and `[role=button]` outside text rows, with sm for dense lists. Effort M (visual regression risk).
8. **G8 Disabled reason only in `title` or missing (UIV1).** 3 consumers: "Worlds" nav (`panel_directory.js`), "Latest" (`proto23_shell.js`), "Manual season" select (`customization_ui.js`). LOCAL each. Suggestion: show a short line or `aria-describedby` text; for "Worlds" reuse the Options-style sentence. Effort S each.
9. **G9 Names polluted or empty (UR104, UR127).** `select#mixture_process` has no name; mixing amount inputs take their name from a label that wraps the Buy button. LOCAL (`mixture_ui.js`). Suggestion: `aria-label` on the select; move the Buy button out of the label. Effort S.
10. **G10 Number entry shows no unit or range (UR106).** "Font size" and "Spacing" (no unit), plus range hidden on all four number consumers. LOCAL to `customization_ui.js` and the mixing amount builder. Suggestion: show "px, 10 to 28" as helper text and clamp or flag on blur. Effort S.

## Not checked

- Hover, pressed and failed states (UR100), reduced motion and each world dress (UR98): only the idle, focus, disabled and settled states were measured.
- The four buttons inside the closed "More actions" disclosure of the item detail (they report empty text only because the section is collapsed); the Equip and Take off flows are covered by `broader-ui.mjs`, not re-run.
- Trade window and the trade `outline:none` rules in a browser (cascade reading only).
- Skills panel (Alt+K) and the Settings buttons through the Menu: the survey landed on the crafting view and the Menu route errored, so only the All panels route to Settings was measured.
- Long-running pending states: every action clicked was instant.
- Colour inputs (9 measured for focus and height only), radio inputs, the command palette search (`command_palette.js`), and the Journal textarea's visible label and Esc.
- Arrow-key tab behaviour on the five `role=tab` sets other than the Tingen workroom; the inventory category row's style diff.
- Other worlds' panels beyond the Tingen workroom tabs; sealed text in screenshots was not read for this report.
- Mobile width (deferred by the standing UI priority); touch target sizes.
- The three console 404s at every open; type-ahead in selects; screen reader output beyond the Playwright aria snapshot of the Village list.
