# UIL2 report: the UIX2 change signal and three readers, 2026-10-18

Step from the [surface manifest proposal](surface-manifest-and-ui-flow-2026-10-18.md) (UIX1,
UIX2, UIX4, UIX5, UIW1, UIW3). Rules applied: UR13, UR26, UR37, UR52; AR1, AR2, AR3, AR5, AR8,
AR10, AR16; AD36. Target viewports 1920×1080 primary and 1366×768 floor, 14px and 21px text;
mobile deferred. Proof is technical. Weibao's visual acceptance stays open (UR16). Nothing is
committed.

## The stale count, in player terms

On the populated fixture in the Village, Options reads "Options · 4 (2 ready)". Pressing "Look
around" opens three more option groups. On the build without this change, the Options tab kept
showing "4 (2 ready)" while the list already held 7 groups with 5 ready, for 1 to 6 animation frames
(1920/14px: 6 frames; 1920/21px: 1; 1366/14px: 1; 1366/21px: 4). The group summaries ("2 ready / 2
actions") lagged on a separate 500 ms poll. Cause: the tab text was recomputed on the scene's
250 ms poll, not when the list changed (UIX1). It self-corrects within one poll, so the stale
window is short, but two surfaces showing one fact disagreed on screen.

With this change, the same check records **0 mismatched frames on all four targets**, both after
"Look around" (94 to 100 frames) and during 5 s of running time (243 to 287 frames).

## What changed

| File | Change |
| --- | --- |
| `src/ui_change_signal.js` (new) | Topics `inventory, place, time, body, knowledge, combat, world, work`. `publish(topic, source)`, `subscribe({id, surface, pending, refresh})`. A reader's topics come from its LAYOUT_SPEC surface `reads`; `pending` lists topics the spec does not declare yet. Each dirty reader refreshes once per batch, one microtask after the publishes; publishes made inside a refresh go to the next batch, and after 8 chained batches the next waits for a later task. `bridgeLegacyNode(node, topic)` publishes when a legacy-owned node really changes (no-op attribute writes and the `summary` status text are ignored). UIX5 inspector: `window.yairpgChangeSignal.inspect()`, a read-only copy of reader → topics (declared, pending) → refreshes, fallback polls and last change, plus publishes per topic |
| `src/ui_change_probes.js` (new) | Place, time and combat have no publisher of their own. A display-only domain (`registerDomain`, `refresh` hook only) compares the live owners (`runtime_state.current_location`, `game_time.current_game_time`, the `combat-opponents` projection) at each native publication the registry already makes, and publishes the topics that moved. No timer, state or save slice |
| `src/components/inventory_component.js` | The inventory owner publishes `inventory` after add, remove and empty (3 lines) |
| `src/workspace_views.js` | The current-work owner publishes `work` when its view changes and sets `data-work-count` (2 lines) |
| `src/village_workspace.js` | Reader `village-options-ready` (surface `village-scene`, reads `place`). The tab text is written by the reader, not the 250 ms poll. A legacy bridge on `#location_actions_div` publishes `place` until those panels publish for themselves |
| `src/workspace_navigation.js` | Reader `workspace-navigation` (surface `pane-navigation`, pending `place, work, combat, knowledge, inventory`). Panel arrival now publishes `knowledge`. The 500 ms poll stays as a fallback for inputs with no publisher (discovery of panels and Journal tabs, the center mode after Esc, list decoration) and skips when a change already refreshed it since the last poll. UIX4: a route appearing or leaving waits while the pointer is on the bar or keyboard focus (`:focus-visible`) is in it; counts, dots, titles and disabled state update at once. Registers the probes |
| `src/game_bar.js` | Reader `game-bar-current-work` (surface `current-work`, reads `work`): the UIW1 chip. It shows the current-work panel's own work line (AR3, no second source) when work runs and the panel is off screen (IntersectionObserver). Fixed width, so ticking text moves nothing. Show and hide wait while the pointer or keyboard focus is on the bar, then refold. Selecting it returns to Here and scrolls the panel into view. **Fold fix:** `fold()` left out the navigation's padding and gaps (about 28px), so a tight bar clipped its last items; it now folds one more route until the navigation fits. Without the chip, the fold result is unchanged (UIL1 harness, below) |
| `styles/shell_chrome.css` | Chip styles with existing tokens (UR37) |
| `tests/ui_change_signal.test.js` (new) | Regression and invariants, below |
| `tests/native_craft_transaction.test.js` | That test evaluates `inventory_component.js` with its imports supplied by hand; it now supplies `publishChange` |
| `docs/gm/dispatch/ui-foundation-2026-10-15/check-uil2.cjs` (new) | Browser check, below |

`main.js` is unchanged (AR1). No new import of `main.js` and no new cycle (`check:arch`).

## Spec `reads` to add (for the LAYOUT_SPEC owner, not edited here)

- `pane-navigation`: `reads` is unset. The navigation reads `place, work, combat, knowledge,
  inventory`; they subscribe as `pending` and the inspector lists them.
- `village-scene` declares `place`, which covers the Options count through the bridge. No change
  needed for this slice.
- `current-work` declares `work`. No change needed.

## Checks

| Check | Command | Result |
| --- | --- | --- |
| Focused | `node --test tests/ui_change_signal.test.js tests/village_workspace.test.js tests/ui_contract.test.js tests/layout_spec.test.js` | 21/21 pass |
| Full suite | `npm test` (after the last source edit) | 2142 tests: 2139 pass, 0 fail, 3 todo |
| Architecture | `npm run check:arch` | Pass, exit 0 |
| Rule behavior | `npm run check:rule-behavior` | 36/36 pass, exit 0 |
| Rules index | `npm run check:rules` | **Fails, unrelated:** "AD codes not contiguous", from another session's uncommitted `docs/RULES_INDEX.md` edit. Not touched here |
| Rebuild | `node build.js` in the checkout; a scratch copy with this change reverted for the before run | Built |
| Browser | `R4_URL=… node check-uil2.cjs after` and `… before` (headless Chrome, fresh origin per target, populated UI fixture, parity shell) | Below. Data: [`evidence/uil2/after.json`](../evidence/uil2/after.json), [`before.json`](../evidence/uil2/before.json) |
| UIL1 parity | UIL1's `check-uil1.cjs` (scratch copy) against its recorded `after.json` | Below |

Unit tests (`tests/ui_change_signal.test.js`): a burst of 6 publishes refreshes each subscribed
reader once, nothing refreshes inside the publishing task, and the refresh lands before the next
task (the regression for the stale window); topics come from the surface `reads`, extras are
pending, unknown topics throw; a reader that keeps publishing yields to a later task after 8
batches (this test caught a real infinite loop in my first version); the inspector is a copy;
probes publish only when a value moves, never on the first read.

### Browser results (all four targets)

- **Options and group summaries:** 0 mismatched frames after "Look around" and while time runs
  (before: 1 to 6 frames). Options reads "7 (5 ready)" after.
- **Refresh cost over 5 s of running time:** 5 batches. Options refreshed 5 times (was a fixed
  4/s poll, 20 per 5 s; 0 while idle and paused). Navigation 5 signal refreshes plus 5 or 6
  fallback polls, 10 to 11 per 5 s, the old 2/s rate. Each reader refreshes at most once per batch.
  Publishes in that window: `place` 5 (bridge), `time` 4 (probe). The first build had the bridge
  firing about 6/s on an idle, paused game: two legacy owners (`village_patrol_custody_link`,
  `harvest_panel`) re-set `hidden` to the same value on every pass. The bridge now ignores no-op
  writes.
- **Inventory publish:** "Look around" published `inventory` once and the readers on it refreshed
  once.
- **Chip:** hidden with no work; hidden while running with the panel on screen; shown with the work
  line once the panel is off screen; hidden again when it returns; hidden when work stops.
  Screenshots at every target:
  [1920/14px](../evidence/uil2/after-chip-1920-14-bar.png),
  [1920/21px](../evidence/uil2/after-chip-1920-21-bar.png),
  [1366/14px](../evidence/uil2/after-chip-1366-14-bar.png),
  [1366/21px](../evidence/uil2/after-chip-1366-21-bar.png) (full page next to each).
- **UIX4 hold:** with the pointer on the first bar route, work ending and work starting changed no
  bar geometry and no focus. The chip waited (its own text updated in place) and showed or hid
  after the pointer left.
- **Save, reload, export and import (1920):** Options text, navigation state and the three readers
  are identical before, after reload and after import; no page errors.
- **UIL1 parity:** the UIL1 harness on this build matches UIL1's recorded results except Alt+M at
  1920/21px staying on Local actions. That miss is pre-existing: on the build without this change
  it happened in 3 of 3 runs, on this build in 1 of 2. UIL1 saw it once too.

## Gaps and labels

- **Finding, not fixed:** in the R21 parity layout the current-work panel is on screen in every
  state I reached at both targets: idle, running, every center view (Journal, Skills, Stats,
  Settings, Crafting, People, Ledger), combat, and with Options open. The spec pins it to the actions
  region and its module header is hidden in play. So the chip's show path is **forced in the
  browser check** (the test hides the panel's module box). No player journey reaches it today. It
  becomes real if a context, layout or smaller viewport moves the panel off screen. UIW1's value in
  this layout is open for Weibao.
- **Implemented-unverified:** the `combat` and `place` probes firing on a real fight or a real
  location change (unit-tested, not browser-exercised); the chip during combat; the chip's click
  path (Here, then scroll); keyboard-focus hold (pointer hold was exercised).
- Navigation keeps a 500 ms fallback poll until discovery, Journal tab knowledge and center mode
  publish. That is the UIX2 dial ("legacy keeps polling until migrated"), not a full migration.
- The Options bridge publishes `place` for any real change in the native action list, whatever
  caused it. It goes away as those panels publish for themselves (UIL6 batches are a natural
  place).
- The chip shows the owner's text as is. "Just running around" names no time left because the
  owner does not; timed jobs show "N min remaining".
- UIL4 added `registerLayoutSignal` for layout contexts in `workspace_layout.js`. It is a
  different seam (context inputs, not change topics). Whether they should share one name or
  module is a later call.
- Observed, not mine, identical before: the bar starts at "Stats"; "Here" is not shown in the bar
  at 1920/14px or 1366/21px (UIL1 noted it at 1366/21px).
- Visual acceptance by Weibao stays open.
