# A1 / UIL9 inventory composition, 2026-10-18

Status: leaf implementation complete; integration, rebuilt-browser evidence and
human visual acceptance remain open with root. This report is evidence, not a
new accepted design. No commits, builds, personal saves or reserved files changed.

## Scope and authority

A1 follows UIP4–UIP6, R21 BX8/BX9, UR11/UR41–UR48/UR52–UR58,
AR3/AR8 and AD36. Target: 1920×1080 primary and 1366×768 floor,
both 14px and 21px. Mobile and new gameplay remain deferred. Surface types and
routes remain those of existing Inventory and shell-detail registered surfaces.
The shared shell owns selection, native actions, filter and navigation. There is
no new timer, observer, gameplay fact, save slice, storage key or selection owner.

## F1: narrower default with intact upper row and Reports

`styles/inventory_composition.css` makes the default bottom-left list track
`min(24 × chosen text size, 22% of board width)`. The width released from the
first grid track goes into the second track. You spans both tracks, while lower
Actions spans the second and third: useful lower-centre width grows without
intentionally shrinking You or Reports. The ratios reproduce inherited default
breakpoints, rather than introducing a new independent top-column scheme.

This rule applies when the native Inventory module occupies bottom-left and no
inline grid sizing exists. UIL7's explicit saved sizing uses inline important
rules and takes precedence. Moving Inventory out of bottom-left disables the
rule. Returning/resetting through the existing layout owner restores the
automatic default. No sizing variable or browser preference is written here.

**Known integration gap:** existing expanded service geometry puts Inventory
across tracks 1+2, the same width as You. This lane preserves that geometry.
Narrowing Inventory while an expanded service is shown needs a coordinated
layout-owner change, not another CSS mover in the inventory module.

Root measured rebuilt baseline inventory widths of 500.56px (1920) and 348.95px
(1366), saved in `evidence/gripes-a1a2/before.json`. I visually inspected
`before-1920-14.png`: wide name/value gaps and fixed second-line equipment slots
are visible. No after-width is claimed here. The browser check records same-run
CSS-disabled/ enabled measurements and asserts that lower Actions gains width,
You and Reports remain within 12px and document overflow stays absent.

## F2: native kind hierarchy and compact readable rows

`src/inventory_composition.js` decorates native row identities by disclosed native
classes, not item names. Equipment, usable, component, book and other use existing
`--p23-item-*` tokens. Thin row accents, names, category counts/active underline
and the selected-detail kind caption share the role. Equipment slot labels follow
the name on the same line when space permits; long names wrap rather than clip.
Quality keeps its native percentage and inline rarity color. Favorites and All
remain aggregate controls, with no invented rarity color. Native custom inventory
palettes retain their name colors and bypass colored row accents.

The kind caption is a real text node for non-color identification, not generated
CSS content. The module attaches it defensively when needed. A removed selected
row clears the old role; filtering out a still-held selected row retains its
truthful detail. All actual actions remain native callbacks in proto23_shell.

## Integration hooks

Root adds the stylesheet after `styles/shell_chrome.css` in index.html.
In src/proto23_shell.js:

```js
import {mountInventoryComposition} from './inventory_composition.js';
// Immediately after createInventoryTabs, where inventoryList, tabs and detail exist:
const inventoryComposition = mountInventoryComposition({list:inventoryList,tabs:tabs.node,detail});
// Once near render() start, after tabs.refresh():
inventoryComposition.render(rowForSelection());
```

The module does not replace the shared detail view. The current shell appends
its title/meta/body/controls once and later replaces body/controls only, so the
caption survives selected-item rerenders.

## Checks and remaining gates

- C1: `node --test tests/inventory_composition.test.js tests/inventory_tabs.test.js`
  passed 6/6. Covers native kind versus quality, overlapping aggregate semantics,
  repeated decoration with native count/filter/scroll/identity preserved,
  inspection of filtered held rows and clearing detached selection colors.
- C2: `node --check docs/gm/dispatch/ui-foundation-2026-10-15/check-gripes-a1.cjs`
  passed. Root runs this script through `R4_URL` against its integrated rebuilt
  candidate. It writes only `evidence/gripes-a1/`: four-target measurements,
  selected-detail screenshots, role-color parity, native quality retention,
  filter/inspection continuity and browser errors. This script has not run yet.
- C3: root retains final build, arch/rule checks, full tests, native use/tick,
  resize and current preference reload/export/import evidence, whole-screen
  review, expanded-service composition decision and human visual acceptance.

Only owned paths: src/inventory_composition.js,
styles/inventory_composition.css, tests/inventory_composition.test.js,
check-gripes-a1.cjs and this report. Reserved files remain untouched.


Root integration is technically verified; shared hooks and later visual fixes are
in [GRIPES_A1_A2_REPORT](GRIPES_A1_A2_REPORT.md). Original leaf hashes describe
worker delivery; the final integrated candidate has its own input identity.
