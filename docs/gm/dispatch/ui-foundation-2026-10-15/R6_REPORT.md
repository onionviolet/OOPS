# R6: actual log subjects, tucked center views and deeper inspection

2026-10-15. UI writer `01a13ffc-dd13-7c81-b87a-cc235dbb8c82`. Human visual/default-flow acceptance **OPEN**.

[Rebuilt R5/R6 comparison](http://127.0.0.1:19159/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r6/comparison.html) · [Village demo](http://127.0.0.1:19159/r6-demo.html) · [Three-opponent demo](http://127.0.0.1:19160/r6-combat-demo.html) · [Source/knowledge/future considerations](R6_CONSIDERATIONS.md).

## Problem and result

R5's generic log popup repeated the message. Its exact opponent numbers were always primary; the player summary had six values; many substantial views remained in the top button row. Minor folded controls did not reproduce the source's broader center-view switching. The user also identified continued log color/readability gaps and supplied clearer source bottom-menu/log examples. R4 screenshots still open in the ambient browser showed the older repeated category cards and sparse startup notices, not the later R5/R6 state.

| Code | Changed behavior | Boundary |
|---|---|---|
| R6A | Underlined native skill names show a recorded description, level/XP, actual skill effect and earned milestones. A milestone link shows earned rewards. Typed gathered/combat/summary loot subjects show the original item description. | Native discovery gate and formatters; original item IDs/keys. No independent perk system, hidden future milestone, current-inventory name guessing or replayed discovery. Generic untyped crafting/reward text remains plain with its existing related-panel route. |
| R6B | Routine hit/evasion wording is shorter in parity, with the original native wording retained. Earned-milestone announcements become compact subject links. Prose is quieter; actors, skill/item/milestone subjects, incoming loss, outgoing damage and gains have consistent roles. Repeated combat Open links and repeated category cards are absent. | Original message types, full text and native categories remain. The existing/default presentation shows the original branch. Damage types stay native; no invented body-part combat or damage math. |
| R6C | Reports has Filters, Smart/Always follow and Latest in a compact row. Original six category controls appear on demand. | Native category handlers and browser display-setting owner; native unread/latest action where present. Smart means hold when scrolled up, not freeze simulation or all log traffic. |
| R6D | Three-opponent overview gives each native opponent a number, name and health, with explicit inspection selection. Attack cycle stays visible; exact attack/speed/chance/defense values move into Combat readout. | Inspection does not retarget attacks. Uses existing public renderer values, not the hidden enemy model. Current compatibility readout does not establish accepted universal appraisal. |
| R6E | All stats switches the You pane to all twelve current native stat rows, including critical values, attack speed, AP/EP and their descriptions/breakdowns. Full native Stats remains a deliberate route. | Data-driven public-row catalog, not a new six-field cap or fabricated future stats. On larger desktops the deliberate local stats view can use more height; laptop detail remains bounded/scrollable. |
| R6F | Native status previews label buff/debuff/condition and retain actual durations, modifiers and available explanations. Longer status lists occupy a bounded area below You, clearing the opponent pane. | Native effect descriptors and tags; no fabricated stacks, provenance, enemy effects or durations. One shared contextual preview, hover/focus and Esc. |
| R6G | A center-pane footer switches Here, discovered Skills, available Crafting and Journal; More holds other known views. Top button clutter is tucked away in parity. Local Actions/People/Things/Options separates place controls; pacing/combat options/equipment condition live under Options. | Same navigation/controller/registry, knownness, eligibility, native commands, named Back/Esc and restoration. Full-height Reports remains. Original presentation keeps its existing navigation. No new game mechanics. |

Source areas: `src/display.js`, `src/proto23_shell.js`, `src/village_workspace.js`, `src/workspace_layout.js`, `src/workspace_navigation.js`, `styles/ui_tokens.css`; rebuilt `index.html`, `dist/bundle.js(.map)`. The navigation and log tools declare homes in the shared registry. `before.json` records this round's baseline, including the R5 source-map copy of navigation. Git diff also contains substantial inherited unrelated work and is not this slice's attribution.

## Direction and source evidence

Desktop/laptop first, primary1366×768 at14/17.5/21px; affected1920×1080 and2560×1440 at21px. Mobile deferred. Surface roles remain routine status/place/log, contextual preview and deliberate reference. Existing UI_RULES UR35–48 govern free inspection, known facts, progressive disclosure and pane scope. Broader systems, universal rank, new combat/appraisal/perk engines and VFX expansion remain deferred.

Pinned Proto23 original unchanged; source controls near9232–9275 switch substantial central windows and use discovery flags. Supplied source crops make that pattern clearer than the sparse initial reference. Detailed locators and the distinction between source perks, YAIR milestones, native legacy readouts and future observer knowledge are in [R6 considerations](R6_CONSIDERATIONS.md). Source snapshots and native seeded fight proof from R5 remain separate from natural progression.

## Exercised checks

All game contexts use isolated synthetic saves. Log subject fixtures deliberately place skill XP near milestones and weaken one existing guaranteed-drop QA enemy. Engine ticks produce actual native skill/reward/loot messages; this is event-handler evidence, not a representative spawn, balance or natural progression claim. Normal three-enemy captures use the separately labelled populated fixture.

| Check | Evidence |
|---|---|
| Viewport/flow |5 cases:1366 at14/17.5/21px,1920/2560 at21px. Three native opponents, local12-stat view/breakdowns, Options, page bounds and exact full game-save fields aside from wall-clock metadata; Village People/Things also checked. `runs/r6-flow-frozen-final.log`, `flow-results.json`. |
| Actual subject hovers |Native skill/milestone/item snapshots, semantic roles, focus plus pointer hover, Esc, bounded previews, captured-description stability and exact game state at14/21px. `runs/r6-subjects-frozen-serial.log`, `subject-results.json`. |
| Status |Three native player effects, buff/debuff labels, native durations/description and exact free inspection at14/21px. `runs/r6-status-frozen.log`, `status-results.json`. |
| Navigation |Native engine/browser progression, footer Skills/Journal/Notebook, Here/Back/Esc, retained opponent context and help dialog. `runs/r6-navigation-frozen-serial.log`, `navigation-results.json`. |
| Log controls/contrast |Native categories off/on, native follow preference, Latest on explicitly labelled DOM-only overflow stress and sampled contrast≥4.5. Exact gameplay state retained. `runs/r6-log-controls-frozen-serial.log`, `log-controls-results.json`. This is not a full accessibility certification or thirty real engine events. |
| Persistence |Native Save/reload/Export/literal file Import preserve character/inventory/books. Selected21px combat inspection retains six inventory rows and the six deliberately opened native combat facts. `runs/r6-integrated-frozen-serial.log`, `final-integrated.json`. |
| Original presentation/layout |Old layout raw storage bytes, pins/collapse, original navigation/log controls, hidden parity-only enhancements and unchanged game state. `runs/r6-default-original-final.log`, `default-results.json`. Switching back from original to R6 timed out in automation even though the selector was visible. Re-entry interaction remains unverified; the normal R6 startup and other navigation checks passed. |
| Build/contract/prior guards |565 project sources match source map,44 vendor sources classified,13 served JS/CSS match.211 contract entries/273 occurrences, zero new exceptions.10 focused tests pass. `parity.json`, `runs/r6-focused-final.log`. C1/R2/R3 guards plus all19 R4 and19 R5 runtime files pass. Excluded main/save/clock/simulation source hashes unchanged. |

Parallel full-game browser runs produced timing failures and a native-CDP popup-box timeout; affected checks were rerun serially. Final popup bounds use the rendered DOM client rectangle, with pointer/focus interaction and screenshots retained. This round does not establish multi-session throughput. Earlier intermediate failures remain in runs. The inherited broad R3 suite's two failures/three TODOs remain open; it was not rerun or relabelled as this round's result.

The six-state comparison passes all image loads, mode switches and its 100% toggle with zero page errors (`runs/r6-comparison-final.log`). The comparison has normal/larger laptop and two wide desktop states, expanded readout and local stats alternatives, plus populated actual event/status/center-menu captures. Fit previews are scaled;100% is available. The supplied source screenshots are labelled user references, not verified natural-play states. The default hover/pin/full-reference choice remains undecided.

## Save protection and delivery

Candidate `/Users/weiwei/.codex/candidates/yair-ui-parity-r6-2026-10-15-01a13ffc`, loopback19159; separate combat origin19160. Both launchers seed only if their own origin has no save. Existing R4/R5 runtimes and earlier inspection prototypes are preserved. No personal browser save was read or changed. No persistence schema, main/save/clock/simulation/continuation implementation, commits, pushes or publication.

Remaining gate: Weibao's visual/play acceptance of menu placement, density, readout default and hover behavior. Additional item producers need stable references before their text can gain equivalent precise item hovers. Future-world enemy knowledge remains with its existing design/implementation owners.
