# R5: cleaner panels and native contextual previews

2026-10-15. UI writer `01a13ffc-dd13-7c81-b87a-cc235dbb8c82`. Technical checks pass within the slices below. Human visual acceptance and the default item inspection choice remain **OPEN**.

[Rebuilt comparison: Proto23 / frozen R4 / R5](http://127.0.0.1:19158/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r5/comparison.html) · [Play R5](http://127.0.0.1:19158/r5-demo.html) · [Deeper source findings and proposals](R5_SOURCE_CONSIDERATIONS.md).

## Problem and resulting behavior

R4 repeated log category headings on individual events, left stronger borders and inconsistent grouping in You/Focus, and displayed the generic Focus label above the actual inspected subject. Weather/season were not grouped clearly with place. Status details remained on the full native Stats route. Item hover existed, but the same explanation pattern did not cover player effects, opponent facts or recorded log messages.

| Code | Implemented result | Native boundary |
|---|---|---|
| R5A | Quieter four-attribute/two-combat-stat grouping in You; less boxed Stats/Gear and opponent controls. Subject name replaces the generic Focus heading and duplicate body name. | Native stats, selected opponent and known person data; no inferred rank, intent or unknown traits. Opponent-name VFX anchor moves to the visible existing header. |
| R5B | Compact continuous Reports rows, native category colors, tighter filter grid and labels. Repeated category cards/stripes removed; event text and Open remain. | Original filter IDs and handlers, message text, category and follow/scroll owner retained. |
| R5C | Location, season, weather and temperature share a compact header; calendar/phase use its second line. Available outside Village during native combat in parity mode. | Presentation parses the existing public clock string, with no new season/weather simulation. Native/default presentation retains its original clock text. |
| R5D | You shows the first active effect by name plus additional count, alongside Stats/Gear. Hover/focus/click reveals the existing native effect list, durations and modifiers. | Cloned `effects_tooltip`, including existing public simulation effects. No added status, consumption, time or discovery on inspection. No empty effect ornament. |
| R5E | Opponent heading and directional chance facts have hover/keyboard explanations. Native player bars reuse their descriptions. Reports Open links preview the recorded message and identify Open as a current-panel action. | One bounded context preview; Esc/outside click/leave dismiss. No hidden enemy model, enemy statuses or retrospective entity lookup. This is a first recorded-text preview, not the deeper subject-specific perk/item system seen in source. |

Context previews and item previews clear one another. Effect descriptions refresh from their native public DOM while open. Item preview/full route remains as in R4. The hover/pin/stable-inspector alternatives remain separate disposable prototypes; no default interaction was accepted or switched by this round. Routine Gear/person views already update their own panels. This is not a global rewrite of every panel's routing.

Runtime delta from the R5 baseline is confined to `src/proto23_shell.js`, `src/village_workspace.js`, `src/workspace_layout.js` (visible R5 selector label), and `styles/ui_tokens.css`, plus rebuilt index/bundle/map. Prior R4 source remains part of the inherited candidate. Source hashes in `evidence/parity-r5/before.json` distinguish this slice from the extensively dirty shared checkout.

## Reference fidelity and saved direction

Pinned original source hash and engine-byte check: [source accuracy](evidence/parity-r5/source-accuracy.json). Proto23 lab has one injected harness script; removing that injection yields exact original engine bytes. R5 used the native difficulty menu, clicked Easiest, observed the native enemy and damage tick, and exercised pause-next/Resume: [native fight receipts](evidence/parity-r5/source-fight.json). Setup is DEV SEEDED, natural progression unverified. Earlier idle/default opponent screenshots did not establish a fight. R5 did not add a copied combat system to YAIR.

The deeper source review distinguishes enemy rating, player rank estimate and item rarity. YAIR already has component-based equipment and native comparison descriptions. Source locators, nine supplied screenshot receipts, deeper hover/VFX opportunities and ACT NOW / ACCOUNT FOR NOW / LATER dispositions are saved in [source considerations](R5_SOURCE_CONSIDERATIONS.md). No global rank formula, source durability engine or new assembly system was imported.

The human explicitly requested long-standing rules. Canonical [UI_RULES UR41–48](../../../UI_RULES.md#contextual-navigation-quiet-hierarchy-and-faithful-references-2026-10-15), [USER_VISION](../../../USER_VISION.md#contextual-ui-navigation-and-standing-conventions-2026-10-15), PROJECT summary and the host project section of AGENTS now preserve appropriate pane scope, progressive disclosure, quiet hierarchy, preview/action/reference distinction, faithful varied reference evidence and historical-event semantics. Generated portable instructions were not edited. The conventions review used [Apple Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers/) and [Nielsen Norman Group progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/); these inform general conventions, not a claim that one platform's layout must be copied.

## Exercised evidence

Primary desktop1366×768, actual native14/17.5/21px; affected1440×900 and1920×1080 captured. Mobile remains deferred. All test saves are synthetic in isolated headless browser contexts. No personal browser storage was read or modified.

| Check | Result and evidence |
|---|---|
| Native You/person/Gear, opponent facts and Reports |14/21px: stat/value and attack-cycle bounds, selected opponent heading/anchor, weather/season, native filters and exact free-inspection state pass. Native combat resumes for populated outgoing/incoming log lines. `runs/r5-clean-frozen.log`, `clean-results.json`. |
| New effect/enemy/log previews |14/21px: native food use creates a real effect, native description/duration/modifier matches preview, heading/fact keyboard focus, hover, Esc, bounded preview and exact inspection state pass. `runs/r5-context-frozen.log`, `context-results.json`. New header/preview additions are exercised against the served final frozen build. |
| Item hover and full reference |Village/combat ×14/17.5/21px, plus live log updates pass. Native fonts, focus clearance, bounded scroll, Full/Back and free inspection. `runs/r5-hover-frozen.log`, `hover-results.json`. |
| Existing parity states |8 groups: Village at1366/1440/1920, actual17.5/21px, two-opponent combat14/21 and native item use. `runs/r5-parity-final.log`, `parity-results.json`. |
| Inventory fields |21 native rows ×3 actual text sizes: names/counts/quality/slots/value bounds and full-reference Back pass. `runs/r5-fields-final.log`, `fields-results.json`. |
| Synthetic persistence |Native Save, reload, Export and literal file Import preserve character/inventory/books. Selected21px two-opponent free inspection retains six visible list rows and six combat facts. `runs/r5-integrated-frozen.log`, `final-integrated.json`. No persistence schema change. |
| Source, served assets and contract |565 project sources match source map,44 vendor sources classified separately,13 served JS/CSS match;211 contract entries/273 occurrences, zero new exceptions; C1/R2/R3 prior guards pass. `runs/r5-proof-frozen.log`, `parity.json`. R4 frozen output checked separately. |
| Comparison |Four comparison states, all image loads, native-pixel switch and zero page errors pass. `runs/r5-comparison.log`. |
| Focused tests |10 tests pass for combat projection, UI contract, composition and disclosure. `runs/r5-focused-final.log`. |

Source/native-fight, large-text status/enemy/log captures and matched synthetic R4/R5 combat captures were visually inspected. Large-font status stays in the existing Stats/Gear row; previews retain known data and one scroll owner. Native14px and21px page bounds remain1366×768. Fit comparison images are scaled thumbnails; 100% mode retains original pixels.

The earlier inherited broad R3 suite's two failures and three TODOs remain open. No new claim is made for the full suite, natural source progression, every enemy/status type, every custom palette permutation, or human acceptance. Context preview custom colors follow the originating public module; the previous R4 palette matrix was not repeated as a full R5 palette matrix. Source effects not supplied by YAIR remain absent. Structured subject-specific log tooltips, global pane-routing expansion and richer VFX remain proposals.

## Delivery and remaining gate

Separate local candidate `/Users/weiwei/.codex/candidates/yair-ui-parity-r5-2026-10-15-01a13ffc`, loopback port19158. The demo seeds its synthetic fixture only when that origin has no save. R4 remains unchanged on19155, with interaction prototypes on19156–19157. No main/save/clock/simulation/continuation source edits, commits, pushes, publication or personal-save operations.

Remaining authoritative gate: Weibao's visual/play acceptance of the cleaner layout and hover behavior, including the desired default item inspection pattern. Technical measurements do not decide that preference.
