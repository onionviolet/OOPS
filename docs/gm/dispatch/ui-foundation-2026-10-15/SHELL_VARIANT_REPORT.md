# Proto23 Shell playable variant

2026-10-15. **Implemented and technically checked; shared UI source ownership
is released to the coordinator.** No commit, push, successor or other worker.
Weibao's visual acceptance remains open. The existing default was not changed.

[Play rebuilt YAIR](http://127.0.0.1:19115/): choose **Proto23 Shell** in the
bottom Presentation selector. Choose **Existing layout** to return.
[Original / variant comparison](http://127.0.0.1:19115/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/shell/comparison.html)
uses equal 1366×768 images and fuller source views, with a 100% option.
[Saved comparison capture](evidence/shell/comparison.png).
[Preserved C1 comparison](evidence/comparison-c1/index.html).

Authority: [SV1–SV5 packet](PROTO23_SHELL_VARIANT.md),
[read acknowledgment](SHELL_VARIANT_ACK.md), [effective transfer](SHELL_VARIANT_TRANSFER.json),
[design owner](../../../UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#v1-proto23-shell-variant-2026-10-15),
[UI rules](../../../UI_RULES.md). NAV's final report hash matched the transfer;
PID 33400 was absent before edits. This lane became the sole runtime writer.

## Delivered behavior

| Code | Change | Native boundary |
| --- | --- | --- |
| SV1 | Independently written rectangular shell: continuous left player/inventory region, upper contextual details above center work/actions, dedicated right log, compact aligned headings and hairline rows | Existing registry, tokens and center controller remain the owners; no second mover or simulation |
| SV2 | Native category/sort/search inventory with aligned name, quantity and value; mouse or keyboard selects persistent nearby item detail, with native descriptions, quality, effects and comparison content | Explicit Equip, Use, Read and Auto delegate to the original native row control. Equip selects the actual worn slot; Take off delegates to its native slot control |
| SV3 | Known person Focus includes its contextual action menu. Live opponent Focus remains while inspecting an item or browsing a focused panel | Observer-filtered scene frame and current native opponent renderer remain authoritative; unknown fields stay `???`. Inspection spends no time |
| SV4 | Real STR/AGL/DEX/INT, native attack/defense and actual equipment slots beside the player summary; tools have a compact disclosure; larger native stats/equipment and held/worn comparison routes remain explicit | Existing character getters, native slot nodes and native command checks; no invented slots, formulas, progression or item ledger |
| SV5 | Same shell surrounds native crafting list/detail, skills and log. Destination Back/Esc, current work, NAV filters/history/scroll and direct routes remain | Reading survives reference inspection. Crafting retains native availability guards. No service is granted by a navigation or item selection |

## Paths

- `src/proto23_shell.js`: two registered presentation surfaces, native value reader,
  item/slot inspection and delegation to existing native controls.
- `src/workspace_layout.js`: explicit presentation choice, independent shell
  layout storage and reversible base-layout restoration. Reset applies to the
  active shell; choosing a traditional preset or editing the base layout leaves
  the variant explicitly. Existing NAV header/history logic is retained.
- `src/main.js`: mount with authoritative stats/equipment and native action
  reasons; apply existing preparation/belongings Appearance settings to the
  corresponding shell surfaces without adding profile schema fields.
- `src/village_workspace.js`: focused target's existing actions rendered as a
  shell-only menu. Outside the variant the existing scene/action surface remains.
- `src/display.js`: synchronize retained native inventory rows' count metadata
  when their displayed count changes. The new detail pane otherwise inherited a
  stale count after native use; gameplay inventory was already correct.
- `styles/ui_tokens.css`: all shell styling is scoped to this presentation;
  frames/rows, equipment, selected detail and larger-text space allocation.
  Generated bundle/map/index were rebuilt. No allowlist expansion.

No Proto23 code/assets or simulation/save owners were imported. The existing
private original/lab and its saved fuller Crafting, Skills, Actions, Store and
Journal captures were inspected. The pinned source hash remains
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
Source lab captures are DEV SEEDED reference evidence, not YAIR gameplay proof.
Comparison images show different game states and do not imply feature parity.

## Compatibility decision

No game-save or layout schema/version change. Existing saved layout raw JSON,
pins, collapse and dimensions remain in `yairpg.workspace.v1.desktop` (or its
existing narrow counterpart). Selecting the shell does not overwrite that key
or C1's composition marker. Shell layout writes use the separate
`yairpg.workspace.v1.desktop.proto23-shell` browser key; explicit selection uses
`yairpg.presentation.proto23-shell.v1`. Returning restores the previous layout
and composition. Shell layout choices persist independently across reload.
Existing defaults stay unchanged until explicitly selecting the variant.

Item/target selection is session presentation state. Native Inventory search,
category, selection and scroll/history remain on the same borrowed nodes.
There is no new mutation dispatcher. The action proxies retain native custody,
eligibility and transaction behavior; unsupported actions are not synthesized.
The browser tests verify representative normal held items, not every possible
world-specific custody/refusal combination.

Appearance font/palette choices apply through existing profile module settings.
The foundation CJK stack remains Hiragino Kaku Gothic ProN / Hiragino Sans /
PingFang SC / Noto Sans CJK SC and JP / Yu Gothic / system sans. Existing chosen
serif/mono fonts remain available. Tokens and existing semantic color roles
remain authoritative; this slice makes no new font or palette acceptance claim.

## Checks and evidence

| Check | Final result | Evidence |
| --- | --- | --- |
| Build | Pass | `runs/shell-build.log` |
| Full suite | **1,773 total: 1,768 pass, two inherited failures, three TODOs** | `runs/shell-tests.log` |
| Focused controller, mixture, composition, scene and UI contract | **12 pass**, overlapping full suite | `runs/shell-focused.log` |
| Fresh disposable browser matrix | **24 passing groups** | `check-shell.cjs`, `runs/shell-browser.log`, [results](evidence/shell/results.json) |
| Supplementary compatibility/accessibility | **4 passing groups** | `check-shell-extra.cjs`, `runs/shell-extra.log`, [results](evidence/shell/extra-results.json) |
| Final detail rendering / comparison | **4 passing groups**, after final shell CSS adjustment | `check-shell-visual.cjs`, `runs/shell-visual.log`, [results](evidence/shell/final-visual-results.json) |
| Source / served bytes | **561 project sources, 13 served JS/CSS assets match**; 44 embedded vendor sources excluded from project-disk comparison | `check-shell-parity.mjs`, [parity](evidence/shell/parity.json) |
| Contract / frozen C1 | **211 entries / 273 occurrences**, no unreviewed exceptions. C1 report and all root-recorded comparison artifact hashes unchanged | parity / focused checks |
| Diff hygiene | `git diff --check -- src styles tests` passes | final source check |

The inherited failures remain `tests/cheat_awakening.test.js`: clock-jump
first-message/storage retry (`failed.attempts > 0`) and partial-enemy-load
(undefined `card`). No new failure remains. Early diagnostic failures included
an invalid new panel role, counting worn rows as held items, using stale count
metadata, attempting Crafting during native reading, and expecting an old
feature-specific dialogue exit instead of shared Back. Those runs are not final
proof. The large-text inventory collapse and combat local-control starvation
were actual layout defects, corrected and covered by stronger final assertions.

The 24 groups cover all three desktop sizes for native equip/take-off, Use,
stats/equipment and a changed comparison selection; native Read and history
return with filter/scroll restoration; known elder Focus/action/dialogue;
crafting, skills and mixing with Back/Esc. Representative old-layout bytes,
pins/collapse survive shell selection, shell layout edits, reload and return.
Actual Save/reload, Export/download and literal-file Import retain synthetic
character, inventory and book state exactly. No personal save was accessed.

Extra checks prove explicit opt-in and shell Reset preserve the base key;
keyboard inspection and person selection preserve the exact native clock;
item command focus has a visible outline; custom red palette applies to both
new surfaces; reduced-motion preference and Standard palette are respected.
Native combat runs and updates its log through Expand/return, while opponent
Focus stays visible and native Village travel controls remain available.

## Laptop measurements and visible acceptance

| View | Document / viewport | Inventory list viewport/content | Log line viewport |
| --- | --- | --- | --- |
| Populated 1366×768 | 768 / 768; width 1366 | 121 / 567 px | 564 px |
| Populated 1440×900 | 900 / 900; width 1440 | 253 / 567 px | 696 px |
| Populated 1920×1080 | 1080 / 1080; width 1920 | 433 / 567 px | 904 px |
| Actual 125% text at 1366 | 768 / 768 | 108 / 567 px | 554 px |
| Actual 150% text at 1366 | 768 / 768 | 116 / 567 px | 544 px |

The large-text runs use Appearance Apply at **17.5 px and 21 px**, confirmed on
both new surfaces and native local actions; no viewport-zoom substitution or
injected font tokens. Player details yield room as text grows. Current work,
Back and inventory remain reachable. The final ordinary center content at 1366 has
179 / 358 px; it is a single scroll owner. Its six native routine rows are
visible without scrolling after compact row spacing; lower optional groups
remain scrollable. [Final measurements](evidence/shell/final-measurements.json)
record all three sizes. Compact inventory is deliberately
dense and scrolls substantially on this populated fixture; category/search and
Expand are the larger-list routes. At normal size player slots and current work
are visible; at larger text player details have their own bounded scroll area.
This is a remaining density/taste tradeoff, not a claim of zero scrolling.

During combat with selected item detail the duplicate fighter panel yields to
live opponent Focus. Final native local content is **92 / 119 px** and Village
travel is visible. The native time region still has its inherited small
40 / 43 px overflow. Mobile and a broader TRIAGE census are deferred.

The stable upper context area follows the source relationship above the lower
work list. Selecting an item replaces the ordinary person context until Close
item restores it; combat retains its live opponent alongside item details.

Agent screenshot review can identify selected item and native action, current
work, person menu, and the bottom destination bar. The final screenshots cover
[Village](evidence/shell/village-1366.png),
[inventory/detail](evidence/shell/inventory-detail-1366.png),
[effect detail](evidence/shell/consumable-detail-1366.png),
[person/menu](evidence/shell/person-1366.png),
[stats](evidence/shell/stats-1366.png), [crafting](evidence/shell/crafting-1366.png),
[skills](evidence/shell/skills-1366.png), [mixing](evidence/shell/mixing-1366.png),
[combat](evidence/shell/combat.png), [150% text](evidence/shell/actual-text-1.5.png),
and [old layout restored](evidence/shell/old-layout-return.png).
Rebuilt fresh opening and corresponding 1440/1920 captures are in the same folder.

## Release and open gates

**Source ownership released.** No build/browser worker from this lane remains.
The read-only preview server may remain at port 19115; recover its actual process
before reuse. C1's frozen comparison/build remains intact. Root owns review and
subsequent dispatch; no TRIAGE/APOTHECARY or successor was launched here.

**Weibao's visual-feel acceptance is OPEN.** This delivers a playable selectable
variant, not accepted visual fidelity or a changed default. Compact inventory
density, the retained native tooltip grammar inside item descriptions, and the
fluid desktop adaptation remain visible review points. Broader UR28 quick jump,
feature census/rehoming, world-start screens and apothecary conversion remain
with their existing owners. No new content or whole-Proto23 feature parity is
claimed.
