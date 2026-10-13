# Revised playable workspace

2026-10-12. Fresh UI GM `01a12e3a-298d-7612-972b-031015c2f368` owns this isolated delivery. Human feedback reopened the prior UI: movement felt indirect and1920×1080 felt poorly used. Exact visual/default choices are reversible proposals. This report does not claim shared integration or human design acceptance.

Play: http://127.0.0.1:18571/ . Fresh layout storage opens Workspace. A previously saved Classic layout is deliberately preserved: choose **Workspace** or **Reset layout** to see the revision. Classic, Focus and Compare remain available. All panels stay inside one browser page. App browser launch was queued, not confirmed visible on Weibao's screen.

## What was wrong and what changed

The isolated prior candidate defaulted to Classic, which exposed no direct movement. Compare capped panels at460px inside wider columns, wasting available width. Current work sat below the first screen, while empty native boxes and repeated control rows used substantial height. Only the tiny arrow was draggable; range inputs were the resize route. [Baseline opening](evidence/before-opening.png), [baseline Compare](evidence/before-compare.png) and [identity comparison](evidence/BEFORE.json) preserve observed inputs. The shared preview18555 had no workspace and a different bundle; the exact screen previously seen by Weibao remains unidentified.

| Gate | Implemented result |
|---|---|
| U1 | Designed full-width columns in a27/43/30 ratio Workspace default: preparation/belongings left, compact time/location/current work plus actions center, records/skills/reports right. Native fixed empty heights removed in dock mode. Secondary panels collapse without removing their eligible content. Independent dock scrolling prevents the old long equal-column stack. |
| U2 | Entire non-control header supports real pointer/touch drag with visible targets and insertion preview. Float target or Shift-drag creates a floating panel. Floating panels move horizontally, vertically and diagonally across underlying docks, docking only through explicit visible targets. 8 px snap, viewport/footer clamps, Escape/pointer cancellation and keyboard alternatives. |
| U3 | Normal toolbar explains header dragging, Shift-drag and resize. Compact headers have title, collapse and Options. Options open below the header; selecting a dock closes the menu and focuses the handle. Clicking outside closes layout overlays. Panels restores hidden modules, and Reset layout never resets gameplay. |
| U4 | Actual e/s/se pointer grips resize width/height; column dividers resize neighbouring regions and every dock panel fills the freed width. Bodies scroll/reflow native rows and prose at actual size, without shrinking fonts. Desktop and narrow v1 device layouts remain separate, with optional saved column proportions. Narrow defaults put time/location/work/actions before the character stack. Legacy valid Classic is preserved; corrupt/future data recovers Workspace. |
| U5 | One existing native node per module, original command/save owners and actor-qualified projections remain. Critical current work/actions stay open. Required witnessed response recovery, read-only status, focus/disclosure/text selection, native consequences and generated save roundtrips exercised. No gameplay save schema, timer, reward dispatcher or authority change. |

## Measured1920 opening and useful comparison

Fresh measured shell widths: left504px, center804px, right560px. Core controls sit together in the first screen:

| Panel | x/y | width/height |
|---|---|---|
| Character vitals |10/60 |504/182 |
| Preparation |10/330 |504/277 |
| Belongings |10/612 |504/277 |
| Time/weather |530/60 |804/77 |
| Location |530/143 |804/187 |
| Current work |530/335 |804/137 |
| Local actions |530/477 |804/437 |
| Records |1350/60 |560/177 |
| Skills |1350/243 |560/187 |
| Reports |1350/435 |560/257 |

Document measured1920×1084, a 4 px vertical excess rather than the prior long modular board. Fresh390 pointer Talk opens with page scroll0; Talk/Work y599/639 at390 and529/569 at768. These bounds describe generated fixtures, not every possible open disclosure. [Opening](evidence/after-opening.png), [busy native work](evidence/after-busy.png), [actual held-item comparison during work](evidence/after-comparison.png), [movement preview](evidence/drag-preview.png) and [responsive390](evidence/responsive-390.png). Comparison uses two generated actually held native quality variants through the existing reader; it is not an invented stats view.

## Checks and evidence limits

[MANIFEST](MANIFEST.json) records current exact source/build hashes and frozen baseline. The prior whole candidate is retained at `/Users/weiwei/.codex/candidates/yairpg-ui-baseline-1920-2026-10-11`; current candidate is `/Users/weiwei/.codex/candidates/yairpg-ui-modularity-2026-10-11`. Every proof names its actual bundle; later narrower proof does not promote earlier whole-world evidence.

- 36 focused source tests passed: 8 layout/state and9 optional UI tests, plus19 known-people/career/supply tests. They cover their named invariants only.
- [Movement](evidence/MOVEMENT.json) and [complete layout gate](evidence/RESULT.json): actual mouse header docking/preview, Float/reposition including cross-column diagonal movement, corner/edge/divider resizing, Escape, keyboard resize/dock, saved layout reload,390/768/1440/1920 Workspace+Classic, malformed/reset recovery and200% scaling. CSSzoom and960CSSpx viewport equivalence are explicitly distinguished from browser-menu zoom automation.
- [Native journey](evidence/native-journeys.json): real work/earned XP/cancel, local action, actual craft, comparison/focus, hide/picker, combat/return travel, generated native save/reload/import, witnessed elder discovery, preserved disclosure/text/focus and second-tab read-only status.
- [Optional journey](evidence/optional-world-journeys.json): unavailable manifest removes its panel/picker; restoring preserves hidden preference; actual immediate command once, known blocker, one timed job through dock/cancel, structured origin reload. This uses retained candidate optional assets, not the shared owner's newer edition or all routes.
- [Decision](evidence/decisions.json), [comparison](evidence/comparison.json) and [touch](evidence/touch.json): real enrollment with actual elder greeting; generated witnessed mandatory event recovers hidden notes and resolves through real keyboard handler, save/reload/import retains settlement, undiscovered event adds no waiting projection; native held comparison; Chrome native CDP touch input docks/resizes/cancels. Mandatory fixture changes a public event's mode explicitly, so it proves response recovery, not natural trigger design or all decision families.

[Independent review](REVIEW.md) caught5meaningful defects: divider position, Escape focus boundary, float front order, narrow breakpoint mismatch and scaled float bounds. Each was repaired and checked on its recorded revision. Final narrow ordering and combat/navigation also received an actual independent390/768 browser slice. Human visual judgement remains Weibao's.

Several final-headless attempts exceeded short startup timeouts under concurrent local browser load. The preview returned HTTP200 and a separate fresh startup showed PLAY with no loading error; final qualification uses a 30-second startup allowance. Failed attempts do not count as passes. Detailed result files retain the actual successful revision/slice.

## Integration and latest steering

Shared runtime/build/PROJECT remain World1 successor `01a12e25-4154-7090-bcc2-d434478da4cc` reserved. A coordination message was sent; no narrow release granted. Original [UI delta](../candidate/UI.patch) must be reconciled against moving shared main/pack hosts/index, followed by [REDESIGN.patch](REDESIGN.patch). Never copy dated candidate main/build. Then rebuild and qualify the combined shared origin with current World1 assets. The isolated technical result is playable now; this explicit combined gate remains open, alongside human taste acceptance.

Weibao additionally requested cheats/SFX ideaboard work and chose sequence3→1→2: expand proposals, implement documented features, then prototype remaining controls. Dedicated active GM `01a12e4f-e060-70b2-9f2a-3937a896b532` owns [that assignment](../../cheats-sfx-implementation-2026-10-12/ASSIGNMENT.md) using daisy-chain-work/evidence-gated-handoff. It owns neither this candidate nor shared integration. Those features are newly dispatched work, not part of this UI delivery or a claimed implementation.

No commits, pushes, publication, personal-save access, source acquisition/library changes or unrelated gameplay mechanics in this UI task.

Final successful rebuilt bundle: `598f67420c6eb2122f2abc7a7e65d051d1625064ecbfe2c397154d7c020ee155`. [Verification index](VERIFICATION.json) binds exact proof files and their scopes. The dedicated comparison proof waits for opening initialization before interaction; its final actual pointer route passes.
