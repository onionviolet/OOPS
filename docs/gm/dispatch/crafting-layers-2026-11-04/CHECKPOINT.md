# Crafting layers implementation, 2026-11-04

```receipt
build: 3cd57f2247f7b06e0e26d4df5e021ae8bd70a22fb14fc46ba433f229a2c4e785
route: fixture(crafting-layers-native-stock)
state: browser-verified
viewport: 1920x1080 and 1536x864; saved 14/17/21 px Appearance presets
persistence: unchanged
tests: focused regressions, UI contract, isolated build, architecture/rules and selected native journeys pass; see check log
review: none
```

Owner: current Codex chat, primary checkout. Authorized: update layered UI rules and improve existing crafting types using Proto23/YAIR; apply more-to-consider to lasting rules shared with other tasks. No commit/push or new making engine. Preserve other sessions' dirty documentation and assets. Runtime targets were clean at intake; shared display owner receives bounded adapter changes, no extraction or engine edits.

Target: desktop 1920×1080 with real 14/21 px text. Visible outcome: fixed recipes expose meaning/effects before commitment; components/assembly retain their own selectors with stable result inspection; experiments show uncertainty and actual work/consumption terms rather than a generic guaranteed recipe. Existing book/gear views retain domain-specific layers. Mobile and new rune/production editors deferred.

Rules: AD5/6–8/32/36/40/42/45/46, UR12/35/37/41–43/46/49/52/53/57/61/63/70–74, MR4/11/16–20/29/31, [AR1–16](../../../ARCHITECTURE_RULES.md). Seam: existing native display result suppliers and commands, crafting detail/pickers, domain panel projections. No persistence/schema or balance change. Inspection/navigation never executes a craft. No new cycle or composition-root registration.

Checks chosen before editing: existing crafting_detail, crafting_home_refresh, crafting_experiment_preview, crafting runtime/visibility, material selection and mixture/gear/HP focused tests where touched; build, architecture and rules completion checks. Browser: fresh seeded origin on isolated output, fixed food/medicine, component and assembly selection, experimental uncertainty and one existing staged-work case. Failure scenarios: missing/blocked exact stock, a consumed selected copy, stale quote, unknown outcome, and inspection confused with commitment. AD36 reserves the full suite for the committer. An unnecessary queued `npm test` was canceled by its own limiter PID before it started; no full-suite result is claimed.

Evidence and input identity are recorded below. Source reference provenance remains in [comparison round 2](../../../reviews/crafting-reference-2026-11-04/REPORT.md#round-2-source-adoption-ui-layers-and-other-making-2026-11-04). Source and isolated preview build only; no installed-app, commit or push claim.


## Changes and check log

Source changes: `src/display.js`, `src/crafting_detail.js`, `src/crafting_selection_detail.js`, `src/ui/craft_glance.js`, `src/crafting_home.js`, `src/mixture_ui.js`, `src/hp_brewing_panel.js`, `src/gear_workshop_panel.js`, `styles/crafting_detail.css`; regressions in `tests/crafting_detail.test.js`, `tests/interaction_system.test.js`, `tests/mixture_ui.test.js`. Direction/rules updated in USER_VISION, VISION_DIGEST, DESIGN, UI_RULES, RULES_INDEX and the crafting owner. No schema, transaction, time, chance, stock policy or balance change.

- Fixed results reuse the existing observer description and bonus-aware native effect renderer. Relevant effect magnitudes/duration are visible before commitment. Inapplicable quality and duplicate ingredient totals are omitted; allocation and recipe references retain disclosures and scroll on same-subject refresh.
- Material and part recipes reuse native tooltip result/quality suppliers in a stable pane, keeping exact-key pickers and explicit native craft controls. Assembly gets keyboard equivalents. Regression protects the initial selection-before-class-update order; no second quote formula or spending owner.
- Experiments use a single “Try one batch” or “Start brazier hold” command, observer-limited output, actual preparation time and visible spend/abandon terms. Mixture work/cancel sits above configuration and uses the actual held-input projection. Loading an absent mixture owner clears its old cancel control; source regression added.
- HP keeps its acquisition/preparation/brewing/use layers, adding an explicit current-cauldron-work review. Gear retains the exact carried object, planning and authoritative quote as separate roles. Broader rune/formation/production editors were not invented.

| Command/check | Result and limit |
| --- | --- |
| `BUILD_OUT=/tmp/oops-crafting-layers-20261104 npm run build` | PASS; isolated output, SHA-256 above. Existing duplicate `dial` key warning in `src/travel_legs.js` remains unrelated. Tracked dist/index untouched by this task. |
| `node --test tests/crafting_detail.test.js tests/crafting_home_refresh.test.js tests/crafting_experiment_preview.test.js tests/interaction_system.test.js tests/mixture_ui.test.js tests/mixture_feedback.test.js tests/gear_workshop.test.js tests/hp_brewing.test.js tests/hp_brewing_domain.test.js` | 87/87 pass in focused window. After the final mixture-owner clearing correction, its affected subset below passed; unchanged other evidence reused under AD36. |
| `node --test tests/mixture_ui.test.js tests/mixture_feedback.test.js` | 14/14 PASS after the owner-reset correction; no stale Cancel on absent loaded owner. |
| `node --test tests/crafting_runtime.test.js tests/crafting_visibility.test.js tests/native_craft_transaction.test.js` | 15/15 PASS; native eligibility/transaction boundary unchanged. |
| `node --test tests/ui_contract.test.js` | 3/3 PASS, including new-style scan. Local existing line-height token follows actual text size. |
| `npm run check:arch` | PASS; display 6766/6767 baseline lines, no new main import/cycle; 205 existing cyclic edges retained. |
| `npm run check:rules` | PASS; register/router, receipt and direction-sync checks. Initial missing receipt block corrected before pass. |
| `node docs/gm/dispatch/crafting-layers-2026-11-04/checks/make_fixture.mjs` | Generated local disposable stock/known-method fixture; no personal save. Initial broad catalogue seeding included an invalid reference item; replaced by explicit native materials/parts. That failed fixture is not gameplay evidence. |
| `node docs/gm/dispatch/crafting-layers-2026-11-04/checks/browser.cjs` | Selected fixed/material/assembly decision, blocked, native craft and keyboard routes at 1920×1080, 14/21 px; [checks](../../../../work/crafting-layers-20261104/browser.json). Actual chosen task text was enlarged, not browser screenshot scaling. |
| `node docs/gm/dispatch/crafting-layers-2026-11-04/checks/workflows.cjs` | PASS; experimental uncertainty/single trial, held brazier, close/reopen without cancellation, real abandon, and HP obtain/configure/start/current work. [Checks](../../../../work/crafting-layers-20261104/workflows.json). |
| `node docs/gm/dispatch/crafting-layers-2026-11-04/checks/mixture_gear.cjs` | PASS; exact-object salvage quote/commit; mixture buy→mix→observe→record→queue→cancel with real held-input return. [Checks](../../../../work/crafting-layers-20261104/mixture-gear.json). |
| Task-path `git diff --check` and local report links | PASS; unrelated dirty inputs preserved. No commit/push. |

Screenshots: [fixed result](../../../../work/crafting-layers-20261104/fixed-balm-14.png), [material result at 21px](../../../../work/crafting-layers-20261104/component-21.png), [assembly](../../../../work/crafting-layers-20261104/assembly-14.png), [experiment](../../../../work/crafting-layers-20261104/experiment-14.png), [held brazier](../../../../work/crafting-layers-20261104/held-brazier-14.png), [HP work](../../../../work/crafting-layers-20261104/hp-work-14.png), [gear quote](../../../../work/crafting-layers-20261104/gear-quote-14.png), [mixture work](../../../../work/crafting-layers-20261104/mixture-work-14.png).

## More-to-consider disposition and remaining limits

ACT NOW completed: fixed first-selection inspection order; preserved same-subject disclosures/scroll and native keyboard commands; cleared moved mixture cancellation controls on absent-owner load. These protect actual task identity without changing persistence or refund policy.

ACCOUNT FOR NOW: no UI depth grants knowledge, no generic completion percentage or cancellation guarantee, no per-slot double charging. Shared UI rules now also apply to trade/services/research/travel/projects, but those screens were not redesigned in this task. New DOM views reuse authoritative result suppliers and current lifecycle owners.

Resolved on November 5 in the closure below. Historical diagnosis: the full first-weapon command chain exposed an existing shell sizing defect. The document can measure 1920×1114 because two absolutely positioned `shell-resize-handle` nodes extend below the viewport. Back and the changed crafting task remain within 1080. A matched substitution of pre-task UI files/CSS reproduces exactly the same 1114 height; a shorter assembly-only route measures 1080 in both. [Comparison](../../../../work/crafting-layers-20261104/overflow-baseline.log). The original harness allowed that inherited condition. The November 5 fix removes the allowance and checks viewport containment strictly; no shell rewrite was needed.

Agent-verified on declared fixtures, not human-reviewed, packaged or installed. Persistence shape is unchanged; no new save/reload/import claim. The full suite remains the committer's gate under AD36. Mobile, every world/craft combination, and new making mechanics remain outside this slice.


## Shell-sizing closure, 2026-11-05

Weibao requested: “Fix the inherited shell-sizing issue too, and make sure the crafting UI still works with the larger text settings.” This continues the same slice. Target: 1920×1080 and 1536×864, actual saved Appearance presets 14/17/21 px. Mobile and new gameplay remain deferred. Seam: the existing `shell_resize.js` geometry owner and `shell_composition.js` stable composition order, under UR25/33/46/52/57/69 and AR3/7/10/16. These source files and the owning `layout_spec.test.js` were clean at intake; earlier task changes and unrelated dirty work remain preserved.

The board and its regions reflowed after guidance/text chrome changed, but absolute gutter hit targets could retain the old dimensions. This produced 1920×1114 page bounds even while the actual task stayed inside the viewport. The exact chain plus an explicit existing-guidance-row reveal reproduced it on the pre-fix build. [Before](../../../../work/shell-sizing-20261105/before.log). The fix observes actual board/region size changes, coalesces gutter geometry work into one animation frame, and disconnects/cancels it on teardown. It adds no simulation polling, saved splits or gameplay state. Composition activates its final fit style before measuring the gutters.

`tests/layout_spec.test.js` adds the reproduced invariant: a resized board updates gutter height without saving a split, repeated geometry notifications coalesce, and teardown releases the observer and pending frame. It failed before the fix at the missing board observation, then passed with the existing layout/composition checks (31/31). The original native route now measures 1920×1080 without overflowing absolute elements. [After](../../../../work/shell-sizing-20261105/after.log).

The dedicated [browser check](checks/shell_sizing.cjs) uses real Appearance buttons and confirms the saved preset reaches the actual crafting pane. It exercises fixed-result effects/commit/receipt, retained disclosures, material inspection/craft, keyboard part selection/Create, guidance show/hide, and separator arrow-key resize/Home reset, checking document and handle bounds plus Craft/Back reachability. Fixture-only guidance visibility is named separately from native play; no personal saves are read.

Build: `BUILD_OUT=/tmp/oops-shell-sizing-20261105 npm run build` PASS, bundle SHA-256 `3cd57f2247f7b06e0e26d4df5e021ae8bd70a22fb14fc46ba433f229a2c4e785`; existing unrelated travel duplicate-key warning remains. `npm run check:arch` and `npm run check:rules` PASS. Persistence is unchanged. Full suite remains the committer's gate; no commit, push, package or installation.


Larger-text follow-through also removes the native assembly row's fixed 300px caption and 76px batch strip in `styles/crafting_detail.css`. The existing Create and batch commands now share a wrapping flex row and inherit the chosen text size; their native listeners, part selection and spender are unchanged. The browser checks scroll to/focus Create and verify its full bounds against clipping scroll ancestors after divider reset, in addition to viewport bounds. The placement of the result/quality supplier is unchanged. `node --test tests/ui_contract.test.js` passes 3/3 on that CSS. Craft stylesheet SHA-256: `0b6e22322933c76f96b426531b5f3c2c9a4725d50e83b076720e17186f97ef34`.


Final larger-text matrix: [all six cases](../../../../work/shell-sizing-20261105/browser.json) PASS on the final source/CSS: 1920×1080 and 1536×864, each at saved 14/17/21 px. Every final page measures exactly its viewport; handles remain inside the board, no page errors, and Craft/Create/Back are reachable. This supersedes the early intermediate snapshots, including one immediate pre-settle focus measurement. Screenshots: [desktop 21px](../../../../work/shell-sizing-20261105/assembly-1920-21.png), [laptop 21px](../../../../work/shell-sizing-20261105/assembly-1536-21.png). No enlarged-text override was injected in this matrix: each case uses the real saved Appearance preset and asserts computed task text matches it. Layout/composition regressions 31/31, UI contract 3/3, build/architecture/rules checks pass. No further equivalent test reruns are required before handoff; the full suite remains the committer's gate.


## Installed-app follow-through, 2026-11-05

The later explicit installation request is complete: [normal-app adoption](APP_ADOPTION_2026-11-05.md). The earlier “not installed” lines describe their original source-only stages; the new receipt owns current installed state, copied-profile verification, unchanged real-save evidence and rollback.
