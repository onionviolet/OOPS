# R14: scan native recipe readiness, 2026-10-15

Candidate proposal, technically verified; Weibao's visual/play acceptance remains OPEN.

**Review:** [64 matched before/after pairs, fit or100%](http://127.0.0.1:19256/r14/comparison.html).
**Play:** [synthetic Cooking fixture](http://127.0.0.1:19256/r14-demo.html), then Play and Crafting → Cooking.
[Ranked plan](UI_NEXT_2026-10-15.md) · [scope saved before source edits](R14_CHECKPOINT.md).

## What was wrong and what changed

P1/B5: item recipe rows showed only names/output counts and dimmed unavailable choices. A player had to select every recipe to learn readiness. R14 adds `N ready`, `Missing`, `No station` or `Unavailable` to each unlocked item-recipe row, using the same `itemRecipeStatus` projection as the detail and guarded native Craft. The accessible row label and status tooltip explicitly say **attempts**, with uncertain results distinguished from output quantity. Unknown material names never enter the summary.

One helper in `src/display.js` is consumed by row creation, selected-page refresh, normal recipe refresh and inventory visibility refresh. `styles/crafting_detail.css` aligns/wraps names and status with shared tokens and existing chosen text size. No new store, navigation manager, eligibility rule or gameplay command. Selection still inspects; only explicit Craft spends. The status changes after spending the available inputs. Longer rows can wrap; this modest row-height cost buys a readable status rather than smaller text. At laptop21px the existing stacked list still shows the ready and blocked example together; Craft and destination Back stay visible.

R13/dedupe and unrelated dirty state are preserved. Baseline versus final source hashes show **only display.js and crafting_detail.css changed during R14** among all snapshotted source/style files. No main/save/clock/simulation/combat edits. HEAD remains58b34e6a04afaddafc9070b2d2bec2327ad374fa. No commit, push or publication.

## Evidence and checks

All browser checks use synthetic saves on new loopback origins. Working-tree baseline was built and frozen before editing; final evidence uses immutable before19257 / after19256 asset directories. Earlier R11/R12/R13 candidates remain intact. No personal browser storage/save was inspected.

| Check | Result |
| --- | --- |
| State matrix | **18 scenes per build**, at1366×76814/21px and1920×1080 21px: ready/blocked Cooking, three actual opponents, Reports after30native rendered ticks, person inspection and native dialogue. **Zero page overflow, zero page errors**. `evidence/r14/{before,after}/matrix.json`, `matrix-results.json` |
| Every top-bar destination | **13 enabled routes +1 disabled Worlds route per size per build**, three sizes. Each Journal sibling clicked by its own label/tab. **Zero navigation errors, page errors or state changes**. Disabled Worlds retained, not bypassed. `evidence/r14/{before,after}/nav-*/sweep.json` |
| R14 readiness | **4/4 viewport journeys**,1366×76814/17.5/21px and1920×1080 21px. Native ready count/ARIA, blocked detail agreement, no unknown-name leak, inspection state unchanged, row horizontal fit, visible Craft/no page scroll, native Craft updates row1ready→Missing. `evidence/r14/readiness-checks.json` |
| R13 acceptance/dedupe | **26/26 pass**, including local return, yielded regions/restoration, Inventory focus, three opponents and native progress. `runs/r14-r13-regress.log` |
| R11 copied regressions | Fit **6/6**, modes/restoration pass; interactions **4/4** (resize/ticks/focus/order, worn shield, combat1366/2560). No hover wait failed. `runs/r14-{fit,modes,interactions}.log` |
| R12 native recipe journey | **20/20 pass**: details, unknown ingredient DOM/ARIA, guarded blocked craft, related→Back, explicit Craft/native receipt deltas. Running-clock inspection/exit pass separately. `runs/r14-{recipe-regress,ticks}.log` |
| Focused node/UI contract | **16/16 pass**. `runs/r14-focused.log` |
| Full suite, clean export | HEAD + the7UI paths (existing R13 five, R14 two): **1,773 pass, zero fail,3TODOs**,1,776 total. Unrelated dirty continuation/story/clock changes excluded. `evidence/r14/clean-export.json`, `runs/r14-clean-suite.log`. This does not claim the dirty-tree suite is repaired |
| Build/freeze/served parity | Build passed. Served index, bundle, crafting CSS and shared tokens match final frozen manifest **4/4**. `evidence/r14/{frozen-runtime,served-parity,source-preservation}.json` |

The inherited sweep selected by shared panel ID and repeated Journal for sibling tabs; R14 fixed it and reran all routes. Disabled Worlds is recorded as disabled rather than waiting on a click. An early matrix run hit its180-second harness bound. Final completed matrices use an uncapped harness and30native ticks; aborted logs are diagnostics, not pass evidence. The final64-pair comparison is generated from completed scene/route manifests, with original pixels available alongside fit display.

## Remaining gate and next ranked item

**P2 / A5+B8: inventory category tabs with native counts** is next, preserving discovery, search, count, new-item dots and21px fit. It is saved, not implemented by R14. Other ranked dispositions remain in the plan. Global nav grouping/labels, Settings reflow, trip tally, context stat sets and dialogue hierarchy remain deferred. R14 does not change the rest-state panel-control choice (BO6).

No claim of natural progression, balance, other-world/station acquisition, persistence verification, all palettes, mobile, installed deployment or human acceptance. Persistence behavior did not change, so Save/reload/export/import was not rerun. **The remaining authoritative acceptance gate for this candidate is Weibao's visual/play review.**

Frozen candidate: `/Users/weiwei/.codex/candidates/yair-ui-r14-readiness-2026-10-15`.
Restart: `python3 -m http.server 19256 --bind 127.0.0.1 --directory /Users/weiwei/.codex/candidates/yair-ui-r14-readiness-2026-10-15`.
Source reservation released after this report; no successor worker launched.
