# U4 report: accessibility and input

2026-10-14. Design/research delivery complete; proposals unaccepted.

## Written

| Code | Owned file | Result |
| --- | --- | --- |
| O1 | [ACCESSIBILITY_AND_INPUT.md](ACCESSIBILITY_AND_INPUT.md) | Standards subset; nine scoped game/client precedents; AX1-AX12 with default and dial; exact NV6, PC6, MC5, IN3, SC5, CS8, HU17 and panel-kit F6 mapping; five sealed/VFX conflicts; five possible later checks. |
| O2 | [U4_REPORT.md](U4_REPORT.md) | Delivery, source routing, limits and unresolved decisions. |

## Main findings

| Code | Finding |
| --- | --- |
| F1 | F6 needs a stable landing/return policy and a visible alternate route when browser or laptop keys intercept it. Many named regions alone do not establish efficient navigation. |
| F2 | Speech detail and archive detail should be independent. DCSS's console reader guidance disables short-message condensation, while the root idle digest groups repeats. Keep both summary and raw review. |
| F3 | MC5's interactive nested help exceeds a simple tooltip pattern. Focusable Details, a persistent inspector and explicit Back/Close preserve its value. |
| F4 | Accessibility output must use the same knowledge filter as visible UI, before accessible labels or speech queues receive text. VFX plain mode retains permitted clues without exposing hidden names. |
| F5 | Keyboard play, remapping, narration, readable text and whole-game access are distinct. Historical developer statements and patches are scoped evidence, not present-version accessibility certification. |

## Sources and evidence

All links are in the main note beside their claims. Sources loaded through web
retrieval on 2026-10-14; no browser automation or game sessions were launched.

| Code | Sources | Evidence scope |
| --- | --- | --- |
| S1 | [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/full-list/); [Xbox guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines), with 106, 107, 113 and 117 detail pages | STATED standards/design guidance. Microsoft retrieval included an authorization banner but returned substantive article text; claims use that returned text, not inaccessible content. |
| S2 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/); W3C Understanding pages for reflow, spacing, character shortcuts, focus obscuration and status messages; WAI tooltip/modal patterns | Normative criterion references distinguished from informative implementation guidance. AAA motion/focus guidance is not mislabelled AA. |
| S3 | [AbleGamers APX](https://accessible.games/accessible-player-experiences/); [CIPT Chicory review](https://caniplaythat.com/2021/06/10/chicory-a-colorful-tale-can-i-play-that-accessibility-review/) | Pattern framework plus a review's concrete strengths and small-text limitation; no console-to-PC inference. |
| S4 | Cogmind developer posts, Qud official 1.0 notes, Bay 12 historical dev log, NetHack 3.6.3 guidebook, DCSS official manual/options guide | STATED, version/date scoped. DCSS master documentation is a moving source; §7 and named settings identify the inspected material. |
| S5 | Alter Aeon official blind-player entry/landing page; Mudlet UI manual and 2022 macOS post; Fallen London official patch notes; A Dark Room issue #70 | STATED client/setup and patch evidence. SHOWN open issue status only; no live-game claim. Mudlet present caveats qualify its older success report. |

## Checks and limits

C1: Read COMMON first; checked live authority and existing palette code definitions in
the palette, Panel kit and W3 draft. Panel-kit lines 24-26 directly establish
discovery naming and the F6 rule. Existing tree has extensive unrelated edits;
only the two assigned, previously absent paths were created.

C2: PASS: a lightweight Python documentation check verified relative link targets,
all eight requested mappings, all twelve AX default/dial table rows, no em dashes
or spaced double hyphens, and no conflict markers. Git status confirms the two
owned paths are newly created and untracked. No source, bundle, test, save, pack or root-owner
edits; no commit or push. No SECRETS-named file opened.

C3: No builds, running browsers, test suites, native control or assistive-technology
tests. Proposed AT1-AT5 are future observable checks, not passing results or
newly mandatory acceptance gates. Laptop/desktop direction remains primary;
mobile/controller/localization remain deferred. U1-U3 topics were not redone.

## Open choices for the root owner

| Code | Open choice | Proposed default and retained dial |
| --- | --- | --- |
| Q1 | F6 landing and circuit order | Current saved workspace order, heading-first; optional remembered control and pinned circuit with all-panel access. |
| Q2 | Notification cadence and severity | Quiet, polite meaningful transitions; tune speech categories separately from archival detail. No exact batching interval is prescribed without reader testing. |
| Q3 | Which AX consideration to select first | AX1-AX5 navigation and announcements fit the scaling problem most directly. Other AX rows remain reachable proposals; this report authorizes no implementation. |
| Q4 | Current-version accessibility of reference games | Only scoped features were sourced. No unsupported claim of universal reader support, remapping, macros or verbosity settings. Shadows of Doubt omitted rather than used without a directly relevant source. |

No question needs Weibao to repeat established direction. The root owner can
fold useful considerations into its own palette; U4 has not edited that owner.
