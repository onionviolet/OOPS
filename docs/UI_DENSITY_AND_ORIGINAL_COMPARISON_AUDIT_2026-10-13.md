# UI density, scrolling and original-UI comparison audit (2026-10-13)

Read-only audit of the fork UI against the original YAIRPG v0.5.5.30, the
fork's own v0.6 dev base, and Proto23 (the lineage ancestor). Findings and
proposals here are not accepted decisions and authorize no implementation.

Evidence: [docs/reviews/ui-density-2026-10-13/](reviews/ui-density-2026-10-13/)
(43 paired screenshots, `measurements.json` with 321 measurement rows, the
driver scripts).

## 1. Executive conclusion

**The fork is denser than the original in both a harmful and a useful way.**
It fixed the original's worst geometry problem: the original is a fixed
1656 px frame that scrolls sideways at 1366 and 1440 px and hides its message
log off-screen. The fork fits every tested desktop size with no page scroll,
reflows at 400 px, and makes native actions keyboard reachable for the first
time. But it spends that gain on chrome and stacked status panels, so the
routine action list, the thing the original put at the visual centre, now
gets **143 px** at 1366×768.

**Dominant friction: the center column's height budget.** In the default
Workspace preset, Time & weather, Current location (with prose in its own
nested scroller) and Current work & saving stack above Local actions in a
fixed-height dock. Local actions then holds 554 to 830 px of content in a
143 px window (hidden ratio 3.9 to 5.8). Every routine loop runs through that
window: the hub list, the busy job card, the trader stock and the crafting
window. A CSS ordering rule then pushes "Try to craft something" below the
supply clerk and four optional disclosures, so it needs a scroll even at
1920×1080.

**Original strengths to recover:**
- one tall, action-first center list directly under the place name;
- trade and crafting using the full center column, with your own inventory
  beside the trader;
- a dedicated, tall message log;
- no layout machinery in the play surface.

v0.6 kept all four. The losses are fork-introduced.

**Fork improvements to preserve:**
- no horizontal page scroll at 1366/1440;
- real reflow at 400 px;
- keyboard-reachable native actions (the original has none);
- authoring isolated in its own context;
- clearer stop and pay consequences on jobs, and inline cost and duration on
  fork jobs ("2 hours, 50 coins");
- reduced-motion rules;
- player-chosen layout presets.

**Highest-leverage next slice: A1, an action-first center column at laptop
size.** Rebudget the Workspace preset's center dock and fix the action ordering
rule, so all seven village actions, the full job card and a usable
crafting/trade list are visible at 1366×768 without scrolling.

## 2. Source-state fingerprint

| Item | Value |
|---|---|
| Measured | 2026-10-13 00:57 to 01:34 EDT |
| Current | `codex/gameplay-foundations` @ `dd3efe33`, 180 dirty paths at start, 181 at end |
| Current build | `dist/bundle.js` sha256 `451be34e450e0b6e…`, stamp `v0.6-451be34e450e`. Newer than every `src/` and `styles/` file, so it matches source. Shared build served read-only; nothing rebuilt. |
| Concurrent work | Another session wrote `docs/research/*`, `PROJECT.md` and `tests/structured_pack_ui.test.js` during the audit. No `src/`, `styles/` or bundle change, so the measured build is stable. The newest dispatch (`dependable-local-livelihood-2026-10-12/CHECKPOINT.md`) reports technical closure with no running workers. Several Codex app-server processes were alive but tied to no visible writer. |
| Original | `upstream/master` = `e3356432` v0.5.5.30 (equals the supplied hash, re-verified after fetch). Scratch worktree on its own port and origin. |
| v0.6 base | `25afe1a8` (miktaew dev, the fork's pinned base per `docs/V06_MIGRATION.md`). Scratch worktree, loose ES modules. Used only to attribute differences. |
| Proto23 | https://23html.github.io/; repo `23html/23html.github.io`, last push 2022-10-22. The live page is byte-identical to the repo's `index.html`. |
| Browser | Headless Google Chrome via Playwright for measurement; desktop browser pane (Chrome 152.0.7977.130) for orientation |
| Viewports | 1366×768, 1440×900, 1920×1080 at DPR 1; 400×800; 150% zoom emulated as a 911×512 CSS viewport at DPR 1.5 |
| Saves | Fresh disposable origins only. No personal save was opened. |

**Matched states.** Each build was driven through the same UI route: fresh
hero, then all elder dialogue exhausted by clicking. I then injected one
disposable save, built the same way for all three builds, with:
- 29 inventory stacks;
- money set to 5000;
- `is_crafting_unlocked` and `is_gathering_unlocked`;
- XP in 14 skills.

Meditation was excluded because its level reward crashes the original loader
at injected XP. T2 to T5 then start from that hub (T6) by clicking. States and
methods are in `measurements.json` under `states`. Starting PLAY at 150% zoom
needed a scripted click (see F5); that step is artificial and labeled.

## 3. Original versus current summary

| State | Original v0.5.5.30 (v0.6 matches unless noted) | Current fork, Workspace default |
|---|---|---|
| T1 opening 1366 | 1656×811 page: horizontal and vertical scroll; log column off-screen | Fits 1366×768. 53 chrome controls and 26% of the viewport is toolbar/headers. Local actions 554/143 px. |
| T6 hub 1366 | 7 actions plus 16 inventory rows on screen. All routine targets on screen. | Find work, Try to craft, Gather and food `[use]` need scrolling. 0 inventory rows above the fold. |
| T2 busy 1366 | Full job card: title, XP rate, next pay, bar, Finish plus consequence | Card starts mid-way; job title needs scrolling. Current work panel says "fieldwork" with no time. |
| T3 combat 1366 | Enemy and retreat in center; log column only 131 px visible | Enemy band breaks out below the workspace; retreat needs scrolling; 0 log rows visible |
| T4 merchant 1366 | Trader list and your sellable list side by side, 16 rows each, plus price modifier and total | 3 trader rows; "5 10 all" wraps; your items and the total need scrolling |
| T5 crafting 1366 | 3 tab rows and 8 recipes | Tabs and recipes need scrolling; a recipe tooltip covers the toolbar |
| 400 px | No reflow; actions reachable only by sideways scroll | Single column; 4 actions after a short vertical scroll |
| 150% zoom | PLAY unreachable; in game, 3 actions visible with sideways scroll | PLAY unreachable; in game, 1 play control on the first screen |
| Keyboard | No game action is focusable; Tab cycles 10 stops | Every action reachable, first at Tab stop 68 (Workspace) or 20 (Classic) |

**Theme and world identity.** The fork's brown panel headers with a grip
glyph are a desktop-app grammar the original never had. They are consistent,
and themes stay legible, but at 1366 that header band is a share of the 26%
chrome cost (F4). Native rows (bordered, large) and expansion controls
(smaller buttons, dashed disabled states, disclosure cards) still read as two
design languages inside Local actions (F2). Nothing here argues for flattening
world identity. The cost is placement, not decoration. World palettes were not
compared across worlds.

## 4. Key measurements

Selected rows (all from `measurements.json`).

| Metric | Build, state, viewport | Value |
|---|---|---|
| M2 page overflow | original T1/T6, 1366 and 1440 | 1656 px scroll width (h-overflow); 811 px tall at 1366 |
| M2 page overflow | current, all core states, 3 desktop sizes | none |
| M2 scroll owners | current T6 1366 | 12 visible scrollers, 9 nested (dock, then module body, then location prose) |
| M2 scroll owners | original T6 1366 | 1 |
| M3 Local actions | current T6, 1366 / 1440 / 1920 | 830/143, 830/252, 811/432 px |
| M3 Local actions | current T2 busy 1366 | 707/143 px |
| M3 location prose | current T1 1366 | 144/88 px nested inside a 163/150 module body |
| M3 Time & weather | current T1 1366 | 55/40 px (a one-line clock that scrolls) |
| M4 chrome area | current Workspace, 1366 / 1920 | 26.4% / 23.9% of the viewport above the bottom bar |
| M4 chrome area | current Classic, 1366 / 1920 | 6.8% / 4.7% |
| M4 chrome controls | current T6 Workspace 1366 | 53 on screen (toolbar, a grip per panel, 3 resize handles per panel) |
| M6 hub reach | original, v0.6: T6 1366 | Talk, Find work, Merchant, Craft, Gather, food `[use]` all on screen |
| M6 hub reach | current T6 1366 | Find work, Craft, Gather and `[use]` need a scroll |
| M6 hub reach | current T6 1440 / 1920 | Craft and Gather need a scroll / Craft still needs a scroll |
| M6 trade | Accept at 1366 | needs a scroll in original, v0.6 and current. Total price is on screen only in the original and v0.6. |
| M6 trade | Accept at 1440 | original on screen, current needs a scroll |
| M6 crafting | category tabs, 1366 and 1440 | original on screen, current needs a scroll; both fine at 1920 |
| M7 stability | busy and combat, 6 s at 250 ms, sampled anchors | 0 px movement in both builds |
| M7 transition (S1) | current T6 1366, open Find work | panel scrolls 132 px; Talk goes from 42 px visible to 0 |
| M10 focus | original T6 1366 | 10-stop loop, no game action |
| M10 focus | current Workspace T6 1366 | first action (Move) at stop 68, 70 chrome stops, 4 stops inside hidden or collapsed UI |
| M10 focus | current Classic T6 1366 | first action at stop 20, 21 chrome stops |
| M11 zoom | both builds, 911×512 CSS | PLAY covered by the fixed bottom bar; it doesn't scroll and isn't focusable |
| M12 log | original 1366 / 1920 | 421×766 column at x=1235: a 131 px sliver at 1366, full at 1920 |
| M12 log | current T3 at 15 s, 1366 / 1920 | 0 log rows visible / only the "[Entering Infested field]" banner |
| M5 prose | current T6 | ~76 words of place prose plus a weather line before the actions; a ~36-word clerk status paragraph sits between native dropdowns and Craft |
| S5 DOM | current T1 1366 | 690 `<button>` elements, 95 visible. Only 4 focus stops landed in hidden UI, so the hidden DOM is not a demonstrated UX cost. |

## 5. Findings

### F1. Center-column height budget starves Local actions at laptop size
- **Severity / confidence:** P1, High.
- **States / viewports:** T2, T4, T5, T6 at 1366×768 and 1440×900; T6 craft and gather at 1920.
- **Measured:**
  - Local actions holds 830 px of content in 143 px (1366), 252 px (1440) and 432 px (1920).
  - The Workspace preset gives `time` 40, `location` 150, `current-work` 100 and `local-actions` 400 (`src/workspace_state.js:31`). Fixed docks then squeeze the last panel.
  - Hub reach: original and v0.6 show every routine target at 1366; current needs a scroll for 4 of 6.
  - Busy: the job title is scrolled off.
  - Crafting: tabs and recipes need a scroll at 1366 and 1440.
  - Trade: 3 trader rows are visible, versus 16 in the original.
  - Opening Find work scrolls Talk out (S1 confirmed for the progressed hub, not for the fresh opening).
- **Comparison:** the original puts actions directly under a 300 px place box, with roughly 380 px of action list at 1366. Trade and crafting take the whole center column.
- **Evidence:**
  - `T6_hub_1366x768_{original,current,v06}.png`
  - `T2_busy_1366x768_*.png`
  - `T4_merchant_1366x768_*.png`
  - `T5_craft_1366x768_*.png`
  - `S1_findwork_open_T6_1366x768_current.png`
- **Why it matters:** every core loop (start work, trade, craft, travel) runs through this window. Each visit costs a scroll and a re-orientation inside a nested scroller.
- **Classification:** wrong place, scrolling burden, too much (status above actions).
- **What would need to change:**
  - Center allocation should favour Local actions.
  - Place prose should collapse to its first line or a disclosure.
  - The clock should become a strip, not a scrolling panel.
  - The idle Current work line should not hold 100 px.
- **Earlier audits:** THM V1, V3; UXA-F4; S1.

### F2. Action ordering demotes native choices below expansion content
- **Severity / confidence:** P1, High.
- **States / viewports:** T1, T6 at all sizes.
- **Observed and source:**
  - `styles/workspace.css:477-479` gives `order:-1` only to `.location_choice_dropdown` and `.location_action_div`.
  - The native crafting button is `div.location_choices.choice_craft` (`src/display.js:2089`), so it keeps order 0.
  - Order 0 places it after the village career/clerk panel, the "Learned item sources" journal, and the Local life, Optional pacing, Equipment condition and repair, and Elemental preparation disclosures.
  - It renders at y=931 at 1920×1080. v0.6 lists it second.
  - Sleep and personal chest are classless `div`s (`src/display.js:2101-2111`), so the same rule would demote them at bed locations. That is source-inferred and was not exercised.
  - The four disclosures each take about 55 to 80 px for a one-line summary.
- **Comparison:** original and v0.6 show seven native actions as one contiguous list, with nothing between them.
- **Evidence:**
  - `T1_opening_1920x1080_current.png`
  - `T6_hub_1920x1080_{original,current}.png`
  - the ordering in `measurements.json` (M6 hub reach)
- **Why it matters:** crafting is a core loop, and the vendor block (S3) competes directly with Talk and Work.
- **Classification:** wrong place, chrome competition (optional systems).
- **What would need to change:** every native choice sorts before expansion content. Optional disclosures group under one compact row after the native list.
- **Earlier audits:** UCA-F2 and UXA-F2 (changed form: patrol prose was fixed, but the clerk and disclosures took its place).

### F3. Combat escapes the workspace and hides the log and retreat
- **Severity / confidence:** P1, Medium (log row counting is partial; visual evidence is clear).
- **States / viewports:** T3 at 1366 and 1920.
- **Observed:**
  - In combat, the stance and enemy band renders full width below the docks, outside any workspace module.
  - At 1366 it compresses the docks so Local actions shows only its header. "Go back to [Village]" needs a scroll, and the Reports log shows 0 rows.
  - At 1920 the band is about 380 px tall, mostly empty around one enemy row, and the log shows only the entry banner.
- **Comparison:**
  - The original keeps enemies and retreat in the center column.
  - Its log is a dedicated tall column, but it sits off-screen at 1366 (an original weakness, 131 px visible).
  - So the fork loses retreat visibility at laptop size and loses the log at large size.
- **Evidence:**
  - `T3_combat_1366x768_{original,current}.png`
  - `T3_combat_15s_1920x1080_{original,current}.png`
- **Why it matters:** combat feedback (what hit, what dropped) lives in the log. Retreat is the safety control.
- **Classification:** feedback failure, wrong place, log pressure; the band is also a second layout grammar.
- **What would need to change:** combat renders inside a workspace region, retreat stays adjacent to the enemy, and the log keeps a minimum visible height while combat runs.
- **Earlier audits:** none (new).

### F4. Workspace-management chrome is part of the play hierarchy
- **Severity / confidence:** P2, High.
- **States / viewports:** all states, all desktop sizes.
- **Measured:**
  - The toolbar (Authoring, Edit layout, Layout, Reset layout, Density, Panels, Layout configuration, gesture hint) plus a grip header per panel take 24 to 26% of the viewport.
  - 53 to 65 chrome controls are on screen.
  - The keyboard reaches the first action at stop 68, after 70 chrome stops. Each panel contributes a move handle and three resize handles that are tab stops outside edit mode.
  - Classic cuts this to 6.8% and stop 20.
  - First run applies Workspace, not Classic (`src/workspace_layout.js` `read()` falls back to `makePreset('Workspace')`). That contradicts UCA-D1's "keep the original UI as the default preset". `normalizeLayout` itself defaults to `classic`.
  - S2 refined: the Skills sort and filter rows exist in the original too, docked at the panel bottom. The fork moves them above a short list body, so they take most of a 150 px panel. Empty-list cost is shared with the original. The placement is the fork's.
- **Evidence:** `T1_opening_*_current.png`, `T6_hub-Classic_1366x768_current.png`, M10 rows.
- **Why it matters:** layout tools are used rarely and play every minute. Keyboard users pay about 50 extra presses per traversal.
- **Classification:** chrome competition, too much.
- **What would need to change:**
  - Collapse the layout tools to one control in play.
  - Grips and resize handles appear and enter the tab order only in Edit layout.
  - Decide and record the first-run preset.
- **Alternatives:**
  1. One "Workspace" menu button in play. Recommended: it keeps one-click reach and costs the least.
  2. Show tools only in Edit layout mode.
  3. A "builder" density that shows everything.
- **Earlier audits:** UXA-F4 (partly fixed), THM V2 (open).

### F5. At 150% zoom on a 1366×768 laptop, the game cannot be started
- **Severity / confidence:** P1, High. Inherited from the original and still present.
- **Observed:**
  - PLAY sits at CSS y 470-541 in a 911×512 viewport.
  - `elementFromPoint` returns `#bottom_panel_div`.
  - `#loading_screen` is `position:fixed`, so wheel scroll does not move it.
  - PLAY has `tabIndex -1`. Tab lands on the name field (original) or Authoring (current).
  - In the fork, the workspace toolbar also draws over the loading screen and wraps to three rows.
- **Evidence:** `Z_loading_1366x768@150pct_{original,current}.png`.
- **Why it matters:** a common accessibility setting blocks play entirely. The workaround is lowering zoom.
- **Classification:** accessibility, zoom resilience.
- **What would need to change:** PLAY is reachable and focusable at any zoom, and the toolbar is hidden before play.
- **Earlier audits:** UCA-A3 200% zoom gate (never run); UXA-F5 tested CSS zoom only.

### F6. Narrow and zoomed layout leads with chrome and prose
- **Severity / confidence:** P2, High.
- **States / viewports:** T6 and T2 at 400×800 and at 150% zoom (below the 1000 px narrow breakpoint).
- **Measured:**
  - Narrow order is `time, location, current-work, local-actions, …` (`src/workspace_layout.js`).
  - At 150% the first screen is the toolbar, the clock, about 76 words of prose and Current work, with 1 play control.
  - At 400 px the toolbar takes 4 rows and 36% of the viewport.
  - The bottom-bar "dummy hit counter" overlaps Export at 400 px. That widget is also present in v0.6, so the counter is inherited; the overlap was seen only in the fork.
- **Comparison:** the original doesn't reflow at all. The fork's reflow is an improvement, but its order wastes it.
- **Evidence:** `T6_hub_400x800_*.png`, `T6_hub_1366x768@150pct_*.png`.
- **Classification:** wrong place, progressive-disclosure failure.
- **What would need to change:** narrow order puts Local actions right after a compact status strip, and the toolbar collapses.
- **Earlier audits:** UCA-A3 (390 px gate, now partly met).

### F7. Status text exposes internal identifiers and omits timing
- **Severity / confidence:** P2, High.
- **Observed and source:**
  - After the elder conversation, Local actions shows a "Learned item sources" heading with the row "Cheap iron dagger: villageElder (observed, contact)". `src/absorb_d/ui.js:28` prints `edge.label`, the raw NPC id.
  - Current work during fieldwork reads "fieldwork". `src/main.js:8273` passes `current_activity.name`, with no remaining time for native jobs. Only expansion jobs get "N min remaining".
  - The action panel meanwhile says "Working on the fields" and "Full-round pay in 1 hour 58 minutes".
- **Evidence:** `T2_busy_1366x768_current.png`, `T6_hub_1920x1080_current.png`.
- **Why it matters:** the Current work panel exists to answer "what am I doing and when does it pay". It repeats an internal id instead.
- **Classification:** too little, feedback.
- **What would need to change:** use display names, and give native jobs the same remaining-time line.
- **Earlier audits:** UXA-F6 (partly fixed).

### F8. Long lists and trade lose height and adjacency
- **Severity / confidence:** P2, Medium.
- **Observed:**
  - At 1366 the left dock shows Character & preparation (240 px of stats) before Belongings. The first inventory row is below the fold; the original shows 16.
  - Food `[use]` needs a scroll.
  - Skills get 150 px.
  - In trade, your sellable list stays in Belongings, away from the trader stock. Quantity buttons wrap to two lines. Total price needs a scroll even at 1440, where the original shows it.
- **Evidence:** `T6_hub_1366x768_*.png`, `T4_merchant_1366x768_*.png`.
- **Classification:** wrong place, scrolling burden.
- **What would need to change:** the trade view pairs both lists and the total, and inventory gets usable height in the default preset.
- **Earlier audits:** THM V4, V5.

### F9. Classic preset is not a faithful original
- **Severity / confidence:** P3, High.
- **Observed at 1366:**
  - The "Active effects" bar overlaps the AP/EP row (S4's clipping, in a new form).
  - The location panel has about 110 px of empty space.
  - Actions start at y=578 versus 347 in the original.
  - The page scrolls vertically.
  - Find work, Craft and Gather need a scroll.
- **Evidence:** `T6_hub-Classic_1366x768_current.png`.
- **Why it matters:** Classic is the escape hatch for original-minded play.
- **Classification:** layout regression.
- **Earlier audits:** UXA-F5 (changed form).

### F10. Polish group
- **Severity / confidence:** P3, High.
- **Items:**
  - Checkboxes are associated with their labels, but sit about 9 px above the text centre (original: 1 px). S4's "detached" claim is not supported.
  - Time & weather scrolls by 15 px.
  - A crafting tooltip rendered at the top-left over the toolbar.
  - A "Cancel visual effect" button overlapped a recipe row.
  - The message log has no `aria-live`, while 19 other polite live regions exist. Screen-reader noise is unverified.
- **Evidence:** `T5_craft_1366x768_current.png`, `measurements.json` `a11y_probe`.

**Rejected or downgraded leads:**
- **S5:** the hidden DOM has no measured consequence beyond 4 focus stops. The keyboard cost comes from visible chrome (F4).
- **M7:** sampled anchors did not move during timers or combat.

## 6. Earlier-audit reconciliation

| Prior ID | Prior audit | Current status | Evidence | Current finding |
|---|---|---|---|---|
| UCA-F1 | 1656 px fixed width | fixed (Workspace and Classic both fit 1366 width) | M2 rows | – |
| UCA-F2 | patrol prose before Talk/Work | changed form | clerk and disclosures now precede Craft | F2 |
| UCA-F3 | mixed button styles | partly fixed | clerk buttons and disclosures still look different from native rows | F2, backlog |
| UCA-F4 | native sort/Stats not keyboard reachable | fixed | focus walk reaches Sort, Stats, all actions | F4 (cost) |
| UCA-F6 | competing layout owners | fixed | workspace owns modules; except combat band | F3 |
| UCA-D1 | original UI as default preset | regressed | first run = Workspace | F4 |
| UCA-A3 | 390/zoom gates | partly fixed | 400 px reflows; 150% blocks PLAY | F5, F6 |
| UXA-F1 | laptop overflow, clipped reports | fixed | no overflow at 3 sizes | – |
| UXA-F2 | patrol prose before Talk/Work | changed form | see UCA-F2 | F2 |
| UXA-F3 | profile Apply at y=1607 | fixed | Authoring context isolates tools | – |
| UXA-F4 | repeated headers, empty bodies | partly fixed | idle work now one line; grips and resize stops remain | F4 |
| UXA-F5 | tabs wrap/clip under themes | changed form | Workspace fine; Classic overlaps Active effects with AP | F9 |
| UXA-F6 | job/time/pay/stop separated | partly fixed | stop consequence inline; title scrolled off; Current work says "fieldwork" | F1, F7 |
| UXA-F7 | structured action legibility | unable to verify | structured pack not exercised | – |
| UXA-F8 | themes only colours | unable to verify | taste gate | – |
| UXA-F9 | isolated candidates | fixed | integrated build measured | – |
| THM V1 | routine play fits viewport | still open | M3 5.8 at 1366 | F1 |
| THM V2 | sort/filter and header chrome | still open | 26% chrome | F4 |
| THM V3 | prose and status take center height | still open | M3, M5 | F1 |
| THM V4 | empty bodies, inventory/combat switch panel | still open | 80 px panel for two tabs | F8, backlog |
| THM V5 | test busy/craft/inventory at laptop size | done here | this audit | F1, F8 |
| THM scroll policy | one scroll owner per region | still open | 9 nested scrollers | F1 |
| PFW log aria-live | missing | still open | no `aria-live` on `#message_log_div` | F10 |
| PFW TX12 | never move click targets | partly fixed | timers stable; Find work scroll moves Talk away | F1 |
| PFW P7 | reduced motion | partly fixed | rules present; not exercised | – |

## 7. External reference patterns

Status labels:
- **Observed:** captured live this audit.
- **Source:** read in source code or official docs.
- **Docs-snippet:** official wiki text seen only in search snippets.
- **Community:** not verified.

I played none of these.

| Source | Pattern | Evidence | Status | YAIRPG fit | Lesson | Limitation |
|---|---|---|---|---|---|---|
| Proto23 (ancestor) | Fixed 1273×770 absolute frame. Place prose is the first row of the action list. Full-height log (36 lines default, 1-100 setting). Every list has its own scroller. | live capture `T1_opening_*_proto23.png`; `index.html` lines 61-92, 186, 9709, 11127 | Observed and Source | conditional | YAIRPG inherited a tall action list that owns the center and a dedicated log column. Those two are worth recovering. | Hover-only tooltips, no focusable controls, `overflow` clips at 150% zoom with no scroll. Do not recover the fixed frame. |
| Universal Paperclips | Project cards carry title, cost text, effect and an affordability test together; the card disappears once done. A 5-line console. | `projects.js`, `main.js` at decisionproblem.com | Source | strong | Put cost, duration and pay on the action itself. A small log works when cards carry state. | Linear game with one resource set. |
| A Dark Room | Messages are queued per panel and replayed on arrival. Recipes appear at 50% affordability and never hide again. | `script/notifications.js`, `script/room.js` (GitHub) | Source | conditional | Reveal a system when it is nearly usable, then keep it. Tie messages to their context. | About 5 panels. Replaying queues does not scale to many worlds. |
| Kittens Game | Log cap of 40. Each of 21 filters unlocks when its category first appears. Options hide sell/downgrade and non-applicable buttons. | `core.js`, `js/settings.js` (GitHub) | Source | strong for filters | Show a filter chip only once its category exists. Hide rare destructive controls behind an option. | Dropping filtered messages at source loses RPG history. |
| Evolve | Each message is stored in every tag log (max 60 each, 3 saved). The player resizes message and queue panel heights. | `src/functions.js`, `src/vars.js` (GitHub) | Source | strong | Per-category log history plus a resizable log height fixes F3 without a fixed column. | Copies per tag; store references at scale. |
| Progress Knight | Unlocked rows plus exactly one "next locked" row showing its remaining requirement. | `js/main.js` (GitHub) | Source | strong for skills and jobs | Replace empty-list chrome with one informative next-row. | Single active job model. |
| Antimatter Dimensions | Player-hidden tabs and subtabs, per-confirmation toggles, remembers last tab, pinned sidebar resource. | `src/core/player.js` (GitHub) | Source | conditional | Hiding is per-id and persistent, which suits optional world panels. | Fixed tab set; key by id, not bit flags. |
| Dungeon Crawl Stone Soup | `msg_condense_repeats`, min/max message window height, per-channel colours and mutes, regex "interrupt on" rules. | `crawl-ref/docs/options_guide.txt` | Source | strong for log | Condense repeats per tick. Let important channels interrupt or pin. | Turn-based; idle play must not block on "--more--". |
| Melvor Idle | Mini sidebar mode; skilling minibar; skills dimmed where the current realm has no content. | wiki Settings and Changelog (403 on fetch) | Docs-snippet | conditional | Dim, don't hide, systems irrelevant to the current world. | Page-per-skill shell. |
| Fallen London | Requirements shown with met/unmet text and exact numbers on hover; some requirements stay hidden. | fallenlondon.wiki pages | Community/partial | conditional | Visible locked choices with requirement icons fit sealed-secret rules. | No real-time timers. |

## 8. Ranked implementation slices

These are recommendations, not approved work.

| ID | Rank | Findings | Slice | Acceptance state | Observable acceptance |
|---|---:|---|---|---|---|
| A1 | 1 | F1, F2 | Action-first center column | T6, T2, T4, T5 at 1366×768, Workspace default | All 7 village actions on screen with no scroll. Opening Find work keeps Talk visible. The busy card shows title, next pay and Stop together. Crafting tabs plus at least 5 recipes, and trader rows plus Total, are visible. |
| A2 | 2 | F4 | Play-mode chrome reduction | T1 and T6 at 1366×768 | Layout tools reachable in one click but not persistent. Chrome area at or below Classic's measured 6.8%. First action within about 25 Tab stops. No resize handles in tab order outside Edit layout. First-run preset decision recorded. |
| A3 | 3 | F3 | Combat inside the workspace with a live log | T3 at 1366×768 and 1920×1080 | No full-width band outside the docks. Retreat, enemy HP and at least 5 recent log lines visible together at both sizes. |
| A4 | 4 | F5, F6 | Zoom and narrow start-and-play | Loading and T6 at 150% zoom on 1366×768, and at 400×800 | PLAY clickable and Enter-activatable. Toolbar hidden on the loading screen. At least 3 routine actions on the first in-game screen. |
| A5 | 5 | F7, F8 | Player-facing status and trade adjacency | T2 and T4 at 1366×768 and 1440×900 | No camelCase ids in Local actions text. Current work names the job and shows remaining time or next pay. Trade shows your sellable rows, trader rows and Total without a scroll at 1440. |

**A1 detail.**
- **Scope:** Workspace preset heights in `src/workspace_state.js`; place-prose disclosure in the Current location module; the order rule in `styles/workspace.css:477-479`; where expansion panels mount in `#location_actions_div`.
- **Preserve:**
  - prose readable in one action;
  - the fork's stop/pay wording;
  - clerk and optional disclosures reachable;
  - player-saved layouts (no forced reset; migrate only the untouched default);
  - original keyboard decoration.
- **Alternatives:**
  1. Shrink status panels. Recommended.
  2. Let Local actions grow and push other panels to the side docks.
  3. A density-dependent preset.

Option 1 alone may not fit the crafting window. Measure after.

**A2 detail.** The one-button workspace menu is the recommended alternative. A "builder" density would add a mode to test without player value beyond the menu.

**A3 detail.** This one needs source inspection of how `#combat_div` mounts relative to `#main_content`. I observed the band but did not trace its mount.

## 9. Lower-priority backlog

- **B1:** Classic fidelity (F9): stat overlap, empty location area, action start height.
- **B2:** Polish (F10): checkbox alignment, Time & weather 15 px scroll, tooltip placement over the toolbar, the "Cancel visual effect" overlay, the bottom-bar counter overlap at 400 px.
- **B3:** Log semantics:
  - `aria-live` (or an equivalent announcement policy) for important log lines;
  - condense repeats (Crawl);
  - category history (Evolve);
  - filter chips that unlock on first use (Kittens).
- **B4:** Lists: a Progress Knight style "next locked" row in empty skill and job lists; sort/filter rows to the panel bottom, as the original had them.
- **B5:** Optional-world and expansion panels: dim rather than hide in irrelevant worlds (Melvor); per-id persistent hiding (Antimatter Dimensions).

## 10. Limits and unverified areas

- **Not reached:**
  - a natural crafting unlock (the craftsman route was not open; crafting was flag-injected);
  - bed locations (sleep ordering is source-inferred);
  - structured packs and livelihood flows (UXA-F7);
  - multi-world states;
  - themes other than the default.
- **Zoom:** emulated through CSS viewport and DPR, not the browser menu. 200% was not tested. A real-zoom check may differ slightly in the bottom-bar height.
- **Keyboard and assistive tech:** M10 counts Tab stops only. No screen reader was run. Focus-ring visibility was taken from computed outline or shadow, not inspected visually per stop.
- **Measurement gaps:**
  - M7 sampled a few anchors only.
  - M12 found only 6 log rows after 15 s, likely because combat lines are filtered or grouped by default; the visual evidence carries F3.
  - M1 counts all visible controls, not curated "decisions"; compare within a build and state, not as absolute decision counts.
  - Interaction latency and rendering cost were not measured.
- **Proto23:** compared at its opening screen and in source only. Its content differs, so no T2-T6 match exists.
- **Taste:** theme and world identity were judged only for legibility and hierarchy. The world palette switch (`data-world-theme` warm/cool) was not exercised across worlds.
