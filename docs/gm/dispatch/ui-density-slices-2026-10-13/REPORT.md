# UI density slices report (2026-10-13)

Governing prompt: [reconciled prompt](../../../UI_DENSITY_NEXT_PARTS_PROMPT_RECONCILED_2026-10-13.md).
Evidence: `evidence/<slice>/`. Drivers: `drivers/` (Playwright, fresh contexts on
`http://127.0.0.1:18231/`, the shared checkout served by launch config `titles-o1`).
T6 fixture: built through the UI (elder dialogue exhausted twice), then the audit's
disposable additions: 29 stacks (31 total), 5000 money, crafting and gathering flags,
XP in 13 of the 14 audit skills. Meditation not involved. Fixture lives in the session
scratchpad only.

## Persistence preflight (live source findings)

- `read()` in `src/workspace_layout.js`: no stored key gives `makePreset('Workspace')`;
  a stored v1 layout is used through `normalizeLayout` and never consults a preset.
  Presets therefore reach only fresh users (P0), Reset, preset selection, and the
  authoring default when no `.authoring` key exists.
- Saving happens only on explicit layout actions (preset, density, reset, import,
  dock/hide/pin/resize, gesture end, module unregister). Loading never writes.
- Keys: `yairpg.workspace.v1.desktop`, `.narrow`, and `+ '.authoring'` suffix for
  each. Game-save import does not touch workspace keys (no reference in save code).
- Stored `height` acts as a max-height for docked modules at desktop width, so CSS
  content sizing changes how an old layout renders without rewriting it.

Fixtures P1–P4 were produced by the **pre-edit build** (baseline bundle, CSS and
index served by request interception on the same origin), then reopened with the
new build. P5 is P2's export from the Layout configuration panel.

## A1 — Action-first center column

**Status: accepted by automated/browser criteria.**

### Files changed
- `src/display.js`: native location choices get `data-native-choice="location"` at
  their single append point in `update_displayed_normal_location`.
- `styles/workspace.css`: `[data-native-choice]` joins the order:-1 rule; place prose
  clamps to two lines (old 4.5rem nested scroller removed); time, location and Current
  work drop their headers outside Edit layout (docked, dock mode only) and size to
  content; compact time strip; center gap 6px at desktop; while crafting/trade/storage
  is open the place block shows only the name; `#cancel_craft_visual_effect` placed in
  flow in workspace mode.
- `src/workspace_views.js`: "More about this place" / "Less" toggle (shown only when
  prose overflows, resets on place change); observer on crafting/trade/storage
  visibility sets `#main_content[data-local-task]`.
- `src/workspace_layout.js`: Workspace preset docks the Work Ledger right instead of
  center (fresh users and Reset only).

### Live implementation findings
- Confirmed F1/F2 at baseline (rebuilt bundle byte-identical to audited `451be34e`).
- F2 root cause: craft (`.location_choices`), sleep and chest (`#start_sleeping_div`,
  `#open_storage_div`) lacked the classes the order rule listed; the fort clerk is
  `prepend`ed. Tagging at the append point covers every native choice, including
  "Take an action", challenges and fast travel.
- Not in the audit: the Work Ledger module also sat in the center dock under Local
  actions, and the fork's "Cancel visual effect" button was absolutely positioned
  over the fifth recipe row (narrow fix, reported here; it stays reachable).
- T6 native set (live, recorded before editing): Move somewhere else, Try to craft
  something, Talk to someone, Visit a merchant, Find work, Train, Gather resources.
  No sleep/chest in the Village without housing; food use lives in Belongings, not
  Local actions.

### Before → after (1366×768 unless noted)
| State | Before | After |
|---|---|---|
| T6 | 2 of 7 native actions fully visible; clerk first in flow | 7 of 7 visible; clerk and four fork disclosures after Gather |
| A1.2 Find work open | Talk hidden (audit S1) | Talk fully visible |
| T2 | (audit: card cramped) | title, "Full-round pay in…", Stop all visible |
| T5 | tabs off-screen, recipe 5 covered | tabs + 6 complete recipes visible (category has 123 entries in DOM) |
| T6 / T5 at 1440×900, 1920×1080 | – | 7/7 actions; tabs + ≥5 recipes |
| T4 (boundary) | Total/Accept clipped | Total, Accept visible; player stock still in Belongings (A5) |
| Horizontal scroll | none | none at 1366, 1440, 1920, 400 |

400×800 also improved (6 actions on first screen); Export overlap remains for A4.
Classic preset T6 renders without page-width overflow (F9 untouched).

### Persistence
P1 (old default saved), P2 (messages docked left, skills hidden, left column wider,
compact), P3 (narrow, journal hidden, inspection), P4 (authoring compact): stored
values byte-identical after load and reload; dock membership identical to the
pre-edit build. P4's play view uses the fresh default because that fixture never
saved a play layout. P5 import into a fresh origin: "Layout imported.", docks match
P2. P0 fresh: ledger right, center = time, location, current work, local actions.
No migration; compatibility rule: stored layouts keep their own docks and heights,
and the new CSS reads stored heights as before (max-height).

### Verification
- `npm run build`: pass. Browser: T6, Find work, T2, T5, T4 at 1366; T6, T5 at 1440
  and 1920; T6 at 400; Classic T6; Edit layout restores all four center headers.
- `npm test`: 480/481. The failure (`alloy_equipment.test.js` "equipped native
  brace…") is pre-existing: `src/main.js:290` reads `location` at module load, and
  `main.js` is byte-identical to the pre-edit copy. Not in this task's ownership.

### Residual
- "Try to craft something" keeps its native smaller style next to larger dropdown
  rows (native look, unchanged).
- Narrow (P3) shows customization modules in play; pre-existing, outside A1.

## A2 — Play-mode chrome reduction and first-run preset

**Status: accepted by automated/browser criteria.**

### Files changed
- `src/workspace_layout.js`: toolbar is now Authoring plus one `Layout` menu
  (`<details>`) that holds Edit layout, preset, Reset, density, Panels, Layout
  configuration and status. `setEditing()` labels the toggle "Done editing" and the
  menu "Layout (editing)". Pointer gestures and handle/grip/divider keyboard actions
  run only while editing. `openWorkspaceModule` focuses the module's first real
  control in play (the handle only while editing). Outside clicks and Escape close
  the menu.
- `styles/workspace.css`: drag handles, resize grips and column dividers are
  `display:none` outside Edit layout (not rendered, not focusable, not in the
  accessibility tree). At ≥1001 px the two-control cluster sits in the native
  bottom bar's empty middle, so the board gains the old toolbar row; in Classic it
  stays in flow (Classic's `#main_content` captures fixed children). Menu opens
  upward at desktop.
- `src/absorb_d/ui.js`: fort clerk panel `append`s instead of `prepend`s, so tab
  order matches the visual native-first order (found by the Tab walk).
- `PROJECT.md`: first-run decision recorded as an agent proposal.

### Before → after, T1 1366×768
| Check | Before (audit) | After |
|---|---|---|
| Visible layout entries | 9 toolbar controls + per-panel grips | Authoring, Layout (Authoring is the separate context) |
| Visible grips / resize handles | 16+ | 0 (16 appear after Edit layout) |
| Focusable grips/handles/dividers | yes | 0 of all; 0 in the Tab walk |
| Tab presses to first native action | (audit: chrome stops first) | 20 (`Talk to someone`) |
| One activation of Layout | – | Edit layout, preset, Reset, Density, Panels, Layout configuration, status all visible |
| Layout control / first action (CSS px) | – | summary 732–760 (in bottom bar); Talk 288–330 |

Keyboard: menu opens with Enter, Edit layout via Enter, a focused handle with
ArrowDown reorders records below skills and saves; Done editing removes handles.
Authoring → Return to play round trip works.

### First-run decision (live evidence)
T6 1366×768: Workspace 7/7 native actions, no page scroll. Classic 4/7, page
scrolls, Visit a merchant under the bottom bar. T1 Classic shows Talk and Find
work plus Local life, page scrolls. **Outcome 1: Workspace remains the first-run
default.** Agent proposal, not owner-approved.

### Regression reruns (1366×768)
A1.1 7/7 visible; A1.2 Talk visible; A1.3 title, next pay, Stop visible; A1.4 tabs
and 6 recipes visible. No horizontal scroll.

### Persistence
P1–P4 storage byte-identical, docks identical, reload stable; P4 authoring density
compact intact; P5 import "Layout imported." and matches P2; P0 gets the new
default. No migration; nothing in the layout schema changed.

### Verification
`npm run build` pass; `npm test` 480/481 (same pre-existing failure as A1).

### Residual
- Classic keeps the bottom bar over its lower actions (F9 backlog, pre-existing).
- At ≤1000 px the cluster is an in-flow top row; A4 owns narrow fit.

## A3 — Combat inside the workspace

**Status: accepted by automated/browser criteria.**

### Trace (live source findings)
- `#combat_div` (enemies, clear/group counts) and `#character_combat_management`
  (stance + hero combat stats, `config.ui_element_for_hero_combat_display`) were
  never registered modules, so in dock mode they fell out of `#global_content`
  (`display:contents`) below the board as two full-width bands. The audit named
  only the enemy band.
- `display.js` shows/hides combat via `combat_div.style.display`; stance follows the
  `--character_combat_div_display` variable from `switchToCombat()`. Combat code
  finds both by ID (`models/combat.js`); no parent/sibling dependence, so moving
  the nodes into module bodies is safe.
- Reports: `display.js` appends lines to `#message_box_div` and sets its
  `scrollTop`, but workspace CSS made that box `overflow:visible`, so the module
  body scrolled instead and new lines landed below the fold.

### Files changed
- `src/workspace_views.js`: registers `combat` (center, after current-work) and
  `stance` (left, after combat-controls), each eligible only while shown.
- `src/workspace_layout.js`: `registerWorkspaceModule` accepts `after`; `read()`
  now applies `withDefaults`, which gives modules missing from a saved layout their
  default dock and anchor position (read-time only; storage untouched). Workspace
  preset order lists include both modules.
- `src/workspace_state.js`: Workspace preset heights for combat (420 max) and stance
  (220 max).
- `src/display.js`: combat retreat choices tagged `data-native-choice="combat"`.
- `styles/workspace.css`: combat and stance content-sized in flow; Reports body is
  a flex column whose native `#message_box_div` scrolls, so native autoscroll works.

### Before → after (T3, Infested field, 5 s)
| Viewport | Before (audit) | After |
|---|---|---|
| 1366×768 | stance + enemy bands under the docks, Local actions and Reports pushed out | enemy name, 24/30 hp, "Go back to [Village]" directly below, last 5 log lines fully in Reports; combat module inside board (x 383, w 561) |
| 1920×1080 | band of mostly empty height | same set visible; newest line within 1 px rounding of the log box with scroll at bottom |

No horizontal scroll at either size. Log lines are ordinary combat events
(10 present at measurement); nothing injected. After "Go back", A1.1 at 1366:
8/8 natives visible (Fast travel now present).

### Persistence
P1/P2 (pre-edit saved layouts) in combat: center = time, location, current work,
combat, local actions; stance under combat-controls; stored JSON gains no
`combat` entry. P1–P5 storage byte-identical, docks identical, reload stable, P5
import matches. Compatibility rule: modules absent from a saved layout use their
declared default dock and anchor at read time.

### Verification
`npm run build` pass; `npm test` 480/481 (same pre-existing failure).

### Residual
- Enemy name/HP text sits over native sibling bars (native design); the strict
  5-point cover test flags it, the center-point and screenshot show it readable.
- At 1920 Reports keeps its 220 px preset max; more room is available below.

## A5 — Player-facing status and trade adjacency

**Status: accepted by automated/browser criteria.**

### Files changed
- `src/main.js` (Current work wiring only): `nativeWorkLabel` names the activity
  with its native `action_text` ("Working on the fields"), falling back to
  `starting_text`; jobs add the native next-pay timing via `enough_time_for_earnings`
  and `format_working_time` (now imported from `misc.js`), or "no time for another
  full paid round".
- `src/absorb_d/ui.js`: learned item-source rows resolve a saved NPC id label through
  the NPC registry's own `name` ("village elder"). Saved data unchanged.
- `src/workspace_views.js`: entering trade scrolls the Belongings dock to its top.
- `styles/workspace.css`: during trade, Belongings moves to the top of its dock
  (beside the trader in the default layout) with its full list; native quantity
  groups (`5 10 all`) no longer wrap (fixed 55 px width overridden).

### Live findings
- `fieldwork` came from `current_activity.activity_name`; the native Job's own
  `name` is also `fieldwork`, so the player-facing text is the location activity's
  `action_text`/`starting_text`.
- `villageElder` came from `src/main.js:2896`, which records `source_name` (an NPC
  id for dialogue rewards) as the persisted label. Display-time mapping covers saves
  that already hold it; the recorder is left as is.
- The player's sellable stock already had native sell controls; it was simply in
  Belongings below the fold (y 580–857 at 1366).
- The native "Stop fieldwork" button and "Full-round pay in … Stop early: no pay for
  the unfinished round." wording are unchanged.

### Before → after
| State | Before | After |
|---|---|---|
| A5.1 T2 Current work | `fieldwork` | "Working on the fields · next full-round pay in 1 hour 58 minutes" |
| A5.1 source row | `Cheap iron dagger: villageElder (observed, contact)` | `…: village elder (observed, contact)` |
| A5.2 T2 | – | name + next pay + Stop visible; native consequence wording intact |
| A5.3 T4 1440×900 | own stock not on screen; qty wrapped | your rows left, trader rows center, adjacent; 31 own / 15 trader complete rows; qty one line; Total and Accept visible |
| A5.4 T4 1366×768 | Total/Accept clipped (audit) | 25 own / 15 trader complete rows; Total, Accept, Cancel, Exit visible; no fixed overlay; no horizontal scroll |

No raw camelCase identifiers in the center dock text at T2. Leaving trade restores
the left dock (vitals first).

### Persistence
No storage change; P1–P3 byte-identical, docks identical, reload stable.

### Verification
`npm run build` pass. `npm test` 492/493: same pre-existing failure. The count rose
because another writer added `tests/agreed_duty_continuation.test.js` and changed
`src/simulation.js` and `src/feature_expansion_host.js` in the shared checkout around
02:31–02:34. Those are not this task's paths; builds from here on include them.

### Residual
- Long equipment names in Belongings still wrap the quantity group to a second
  line inside its row (group intact, not overlapping).
- While trading, vitals sit below Belongings in the left dock.

## A4 — Zoom and narrow start-and-play (cumulative gate)

**Status: accepted by automated/browser criteria for emulated 150% and 400×800;
real browser zoom is `implemented-unverified`.**

### Files changed
- `src/workspace_layout.js`: `watchStartScreen()` (run from `mountWorkspace`):
  PLAY gets `role="button"`, `tabIndex=0`, Enter/Space activation, and focus when it
  appears; `<html data-start-screen>` tracks the loading screen; `#main_content` is
  `inert` while the start screen is open, so Tab cannot wander into the hidden game.
- `styles/workspace.css`: toolbar hidden on the start screen; at max-height 760 px
  or max-width 1000 px the loading screen becomes one scrollable column with PLAY
  directly under the title and 64 px bottom clearance (rules use `body #…` because
  `style.css` loads after `workspace.css`); 700–1000 px puts the Authoring/Layout
  cluster in the bottom bar too; under 600 px tall the place prose clamps to one
  line; at ≤600 px wide the decorative visitor counter hides and Save/Export/Import
  tighten; Reports log keeps a 2 px bottom pad so the newest line is whole.

### Before → after
| Check | Before | After |
|---|---|---|
| A4.1 911×512 @DPR1.5 (emulated 150%) | PLAY y 470–541, under the bar, off-screen; toolbar over loading; 30 Tabs never reach PLAY | PLAY y 138–187 fully visible, uncovered; no toolbar; PLAY has focus on arrival, `Enter` starts; after blurring focus, 8 Tabs reach PLAY and `Space` starts |
| Pointer PLAY | – | click works (all drivers) |
| A4.2 T6 911×512 | Move, Craft only | **Move somewhere else, Try to craft something, Talk to someone, Visit a merchant** complete, uncovered |
| A4.3 T6 400×800 | 6 actions; hit counter over Export…help, help over repo link | all 7 natives visible (first three: **Move somewhere else, Try to craft something, Talk to someone**); bottom bar 0 overlaps; Export center hit-tests to Export; no horizontal scroll |
| Layout menu at 911×512 | – | opens upward, y 276–467, within viewport |

Keyboard sequences used: fresh load → `Enter` (PLAY autofocused); and blur →
`Tab ×8` → `Space`. No scripted `.click()` counted.

### A4.4 cumulative regression (1366×768)
T1: Authoring + Layout only, first action visible. T6: 7/7 natives. T2: title, next
pay, Stop. T3: enemy, hp, retreat, 5/5 log lines whole (also 1920). T4: own and
trader rows, qty, Total, Accept. T5: tabs + 6 recipes. 1440 and 1920: T6 7/7,
T5 tabs + 7 recipes. No horizontal scroll anywhere tested. Tab to first native: 20.

### Persistence
P1–P3 byte-identical/docks identical/reload stable (P3 is 900 px narrow, now with
the cluster in the bar); P4 authoring intact; P5 import matches; P0 new default.

### Real zoom: implemented-unverified
Headless Playwright and the app's browser pane cannot drive Chrome page zoom, so
only the emulated CSS viewport (911×512 at DPR 1.5) was exercised. Manual check
for Weibao: in Chrome at a 1366×768 window, open the game in a fresh profile or
private window, press Cmd+= to 150%, reload, confirm PLAY is fully visible above
the bottom bar and Enter starts the game; then load the T6-style save and confirm
at least three Local actions show without scrolling. Record
`innerWidth×innerHeight` from the console.

### Verification
`npm run build` pass. `npm test` 492/493, same pre-existing failure (`main.js:290`
reads `location` at load; not this task's code).

### Residual
- `styles/workspace.css` has no cache-busting version in `index.html` (build.js
  only fingerprints `style.css` and `action_legibility.css`). A browser that cached
  the old file needs a hard reload to see these slices. build.js is outside this
  task; adding the fingerprint is a one-line follow-up.
- Classic keeps the bottom bar over its lowest actions (F9 backlog).

## Pass summary

All five slices pass their objective browser gates; A4's real-zoom checks remain
`implemented-unverified` (manual check above). No commit, push or publish.

**Human acceptance gate:** Weibao judges whether the layout feels action-first,
compact, legible and true to the game's character. Color and Proto23 notes for
that review: [CONSIDERATIONS_COLOR_AND_PROTO23.md](CONSIDERATIONS_COLOR_AND_PROTO23.md).

## Vivid color scheme (follow-up, authorized 2026-10-13)

**Status: accepted by automated/browser criteria. Colors and tints are proposals
for Weibao's taste review.**

### Files changed
- `src/workspace_layout.js`: Layout menu gains **Colors: Standard / Vivid**. Stored
  per browser in `yairpg.colors.v1` (display preference; no layout or game-save
  schema change); applied as `<html data-color-scheme>`. Standard is the default.
- `src/customization_profiles.js`: `applyCustomizationProfile` marks nodes
  `data-custom-palette="true"` when the resolved palette differs from the default
  (player palette or seasonal theme), so Vivid never overrides a chosen Appearance.
- `styles/workspace.css`: Vivid block. Navy page, gold accent and focus; one tint
  per panel role, on workspace shells and native nodes (so Classic gets it):
  actions blue, character teal, records purple, Reports plum, optional content
  green. Brighter semantic messages (items gold, victory green, enemy hits blue,
  hero hits red, travel/unlocks gold/lilac). Reports filters show "on" as gold
  text + underline. Bottom bar follows the scheme. Health/resource bars, item
  rarity colors and coins are untouched.

### Checks
- Select Vivid in the Layout menu → applied at once, stored, survives reload.
- Standard computed colors unchanged (all Vivid rules require the root attribute).
- Real Appearance flow: Authoring → Background `#5a1010` → Apply and save → play:
  that module shows the player's color under Vivid (`data-custom-palette=true`).
- WCAG on every Vivid surface: text ≥ 6.7:1, muted ≥ 4.7:1, accent ≥ 4.7:1,
  message colors ≥ 6.8:1 on the Reports tint, selected text 11.8:1, panel edges
  ≥ 3.8:1.
- Gates rerun with Vivid on: T6 7/7, T2 card, T5 tabs + 6 recipes, 400×800 all
  natives, 911×512 four natives; no horizontal scroll. P1–P5 unchanged.
- `npm test` 551/552, same pre-existing `main.js:290` failure (count grew from the
  other writer's new tests).
