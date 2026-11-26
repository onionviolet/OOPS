# Windows UI contract portability receipt, 2026-11-25

| Preflight | Scope |
| --- | --- |
| Reading and authority | Inspect the prior full-suite log and fix its Windows path-ledger and UI portability failures; do not rerun the full suite. Desktop 1920×1080 for a focused rendered comparison. |
| Player outcome | Existing fight and office surfaces keep their controls and layout. UI checks identify actual receiving panels and token violations consistently across Windows and POSIX. No player copy changes. |
| Ordinary route and seam | Reuse the UI-contract scanner, exact allowlist, Here-kind guard, perspective control inventory and observer_view. A normal UI token passes; an arbitrary shape/token and a new panel mount remain flagged. |
| Failure scenario | Windows separators break ledger keys and include the excluded token owner. A legitimate combat mount is falsely called a Here insertion because the same file mentions Here elsewhere. A media breakpoint is falsely treated as a pixel declaration. |
| Ring and rules | Verification tooling plus small runtime observer/perspective corrections; AR3, AR7, UR43/UR65–UR68, AD6/AD36/AD43. No save fields or migration. |
| Files and boundaries | UI helper/tests, exact allowlist, combat_situation_ui observer reads, perspective_controls office-family rows and token substitutions in combat_page/combat_versus/daily_powers/potion_bench CSS. Existing dirty source retained. No commits or full-suite rerun. |

## Findings and corrections

F1: `uiViolations` emitted native Windows separators in ledger keys and failed to exclude `styles/ui_tokens.css`. It now emits repository paths with `/` and excludes the token owner by the same normalized relative path. A disposable-tree regression verifies both behaviors.

F2: The Here guard counted every foreign append in a file that mentioned Here, including the fight panel mounted in the native combat owner. The scanner now records a known receiving-panel ID. The Here guard uses that ID, retaining its conservative fallback for unresolved targets. The broad foreign-host ledger guard still flags all unreviewed mounts, including dynamic targets.

F3: The workroom token test rejected its 1050px media breakpoint. It now checks declarations with the shared scanner and retains the raw-pixel prohibition inside rule bodies. Media/container conditions do not weaken the check on declarations.

F4: New office day/practice/customer/recap data families were missing from the perspective inventory. Five explicit in-world rows now tag them. Combat's two direct actor reads now use the existing observer seam for world identity and facts.

F5: The repaired scanner exposed real unledgered style and mount debt. Existing tokens now supply combat stacking, motion, spacing, small text, square frame radius and potion control height. The exact shared radius token passes the scanner; arbitrary shape tokens and literal radii remain reviewable. Removed eleven obsolete shared-radius exceptions. Seven specific reviewed native mounts and potion illustration/leading exceptions have reasons alongside their exact counts, a net reduction of four ledger entries. The mount review found intentional canonical destinations and reuse/release guards, so no host relocation or lifetime rewrite was made.

## Prior suite inventory

The provided four-shard log reports 8,078 tests, 7,903 passed and 141 failed across 91 files. This is a historical input, not the current outcome after other lanes' repairs. [Failure locations and test names](../../../representations/evidence/ui-portability-2026-11-25/prior-suite-failures.json) preserve a source hash and the full failure inventory without the large error payloads. Broader clusters include disposable-tree symlinks, Windows file URL/import handling, native fixture initialization, private source availability and timeout/slot assertions. Other lanes own those repairs.

## Verification

| Check | Result and gaps |
| --- | --- |
| Before reproduction | Focused UI checks reproduced five failures, 18/23 passed. Original log and fresh reproduction agree on the five UI failures addressed here. |
| Focused tests | `node --test tests/ui_contract.test.js tests/here_kinds.test.js tests/perspective_controls.test.js tests/workroom_tabs.test.js tests/observer_view.test.js tests/combat_situation.test.js tests/combat_surface_types.test.js`: 53/53 passed. `node --test tests/ui_style_ratchet.test.js`: 2/2 passed. |
| FLR1 build | `BUILD_OUT=.lane-builds/ui-portability npm run build` passed. Bundle SHA-256 `5c6a0b8e7da3454534b0e5e43371f5e5937ce80c35e15e7a826d63aabbfe0da5`. |
| FLR2 route | Fresh headless Chromium contexts, the existing `packFightSave` fixture with eight mixed opponents, no gameplay commands after setup. This is a fixture route. |
| FLR3–FLR4 shown/used | Rebuilt 1920×1080 before/after captures show identical roster and move bounds and no horizontal overflow. [Before](../../../representations/evidence/ui-portability-2026-11-25/before-fight.png), [after](../../../representations/evidence/ui-portability-2026-11-25/after-fight.png), [measurements](../../../representations/evidence/ui-portability-2026-11-25/comparison.json). Hidden CSS-cascade probes in the rebuilt page, with full motion explicitly enabled for that probe, confirm equal layers, 800/900ms motion, 2px spacing, 30px potion control height, 17.4px potion leading and meter radius. These probes verify CSS values, not native potion play. Opening text standardizes 11.9px to the 12px small-type role; it was not visible in this fight fixture. |
| FLR5 kept | n/a, persistence unchanged. |
| FLR6 review | Agent-verified, not human-reviewed. The browser comparison exited successfully, with two missing-asset console responses and no page errors. |
| Architecture | `npm run check:arch` passed. One observer import edge, no new cycle, no main registration line. |
| Rules | `npm run check:rules` stopped on nine existing Mac-only external links in TOOL_REGISTRY and SOURCE_ACQUISITION_TOOLS. |
| Remaining gate | The complete repaired suite remains the coordinator's gate. This lane did not rerun it. Potion feature play, motion playback and mobile visual acceptance were not exercised; computed CSS and the bounded combat render are the evidence here. |

Cleanup: retained the receipt, prior failure index and before/after browser evidence. Removed the lane’s isolated bundle, baseline CSS copies and temporary comparison script after the browser closed normally. No background lane process remains.
