# Runtime hotspot audit, 2026-10-14

## CHECKPOINT

ER1 source audit complete; synthetic benchmark results and final lane receipt are linked below. Scope is READ plus headless MEASURED evidence. No runtime, tests, bundle, save, private pack or root palette changed. Recommendations are proposals. Follow `docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md`; resume from the lane report, not an inherited performance claim.

Owners: [runtime palette](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md), [save/scale review](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md), [offline audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md). This adds concrete call sites, amplification paths and current measurements to E5/E6/E10 and offline F2/F6/F7/F8. It changes no clock, offline, world or UI priority. Desktop/laptop remains primary; any later UI performance gate should use rebuilt 1366×768 evidence. Mobile optimization is deferred. This audit makes no browser behavior claim.

## Findings and ranked top 10

Rank is INFERRED likely total cost in active/developed play, not a measured browser flamegraph. Effort: small is one local consumer, medium crosses several owners, large changes state/publication semantics. No source fix is authorized by this report.

| Rank / code | Hotspot and evidence | Smallest useful proposal / effort | Palette |
| --- | --- | --- | --- |
| 1 / ER1-F1 | **Full durable transaction per joined tick.** READ `src/main.js:1069,7152,7162,806,920`; any enrolled simulation or chronicle selects joined time. A consumed minute plans, validates, serializes, writes and publishes the whole envelope, even before the separate autosave. `persistExpansionPlan` validates expansion, calls `create_save`, parses, writes snapshots, validates envelope, stringifies, then the life wrapper parses/stringifies again (`src/expansion_persistence.js:8,11,47`; `src/main.js:415`). | First instrument each stage and remove redundant projections/encoding while retaining atomic publication and failed-save semantics. Medium. Batching durable ticks is a separate recovery decision, not a free optimization. | RT2, PF1, PF6, DA1 |
| 2 / ER1-F2 | **Envelope migration walk during validation.** READ `src/save_files.js:72`; `prepareFoundationSave` clones the whole envelope and recursively calls `retiredKey` on ordinary object keys. Non-JSON keys use thrown parse exceptions as normal control flow (`src/save_compatibility.js:4,10,40`). Envelope validation includes this walk, unlike plain stringify. | Reject plain keys before attempting JSON parse, then benchmark equivalent retirement handling. Small. Preserve exact retired paths and unknown content. | PF6, RT4 |
| 3 / ER1-F3 | **Repeated projections and native snapshot scans.** READ native snapshots iterate every owned item and every skill for each native actor (`src/gameplay_publication.js:3`; `src/native_gameplay_adapter.js:35`). Planner preview calls `simulationFacts`; scheduler/reconciliation and many panel reads rebuild contexts. Command plans clone state and gameplay twice (`src/simulation.js:38,84`; `src/expansion_engine.js:588`). | Cache one dependency-qualified read frame per commit/render pass before changing the storage architecture. Medium. | RT4, PF6 |
| 4 / ER1-F4 | **Render fan-out after publication.** READ `src/main.js:964-1000`: every expansion publication calls inventory, item log, numerous world/quest panels and identity render; joined update calls several again (`src/main.js:7165`), and main update calls seven more (`src/main.js:7244`). Item log iterates inventory keys (`src/display.js:4300`); inventory update scans/reorders rows (`src/display.js:1622`). | Publish domain dirty flags and render each affected panel once. Medium. | RT3, RT4, PF5 |
| 5 / ER1-F5 | **250 ms workspace layout and panel polls.** READ `src/workspace_views.js:37-48,62`: unchanged current-work signature still calls `syncProse` and `updateWorkspace`. It reads scroll/client heights, computed styles and module geometry while writing styles/attributes for the full module list (`src/workspace_layout.js:132`). Main poll also refreshes customization and rewrites pretty JSON draft text (`src/main.js:8347`; `src/work_ledger_author_ui.js:17`). | Start with change events for ledger rules/settings, then make workspace updates depend on layout/eligibility changes. Small to medium. | RT3, PF5, PF6 |
| 6 / ER1-F6 | **Combat timer multiplicity.** READ `src/models/combat.js:184-241`: each fighter makes 60 timer callbacks per attack cycle; progress is written both before scheduling and inside the callback. Due combat action is only at callback 60. Nominal callback rate is `60*tickrate/actual_cooldown` per fighter, before timer correction. | Separate attack deadlines from rAF bar interpolation, preserving stamina/cooldown changes and correction rules. Medium. | RT1, RT2, PF5 |
| 7 / ER1-F7 | **Scheduler rescans and repeated due-job filtering.** READ `src/expansion_engine.js:603-625`; each boundary creates arrays from pending jobs/opportunities and probes many optional owners. `nextSimulationBoundary` scans jobs/checks/controllers/events/conditions/people; settlement filters jobs again for each due job (`src/simulation.js:452-506`). Expired opportunities remain scanned/validated/copied. | Index due jobs and retain causal tie ordering; first replace repeated removal with a single partition. Medium; full heap large. | RT6, PF6 |
| 8 / ER1-F8 | **Broad JSON render signatures and subtree replacement.** READ `src/expedition_ui.js:61`, `src/village_ui.js:65`, `src/chronicle_ui.js:68` stringify broad state/context, so unrelated changes can invalidate panels. Work ledger rebuilds body/receipts when signature changes (`src/work_ledger_ui.js:40-48`); structured view rebuilds prose/plans/actions while preserving keyed job rows (`src/structured_pack_ui.js:50-55`). | Narrow signatures to displayed dependencies, then keyed changed-row updates. Medium. Preserve focus and actor-qualified knowledge. | RT3, RT4, PF5 |
| 9 / ER1-F9 | **Future settlement preflight plus synchronous catch-up.** READ `src/main.js:904-912`: each commitment may run simulation to its due time before durable publication. `advanceChroniclePlan` drains repeated 512-boundary budgets synchronously (`src/main.js:1232-1250`). The boundary cap is not a wall-time/yield budget. | Cache safe preflight results on exact dependencies; add resumable yielding only with exact remainder/publication semantics. Medium to large. | RT8, RT2, PF2 |
| 10 / ER1-F10 | **Recurring customization and visual churn.** READ `src/main.js:2279,7176,428`: customization runs per legacy minute and durable write, validates settings, finds native tab bars and sets CSS tokens across module nodes (`src/customization_profiles.js:121`). Floating effects use independent 30 ms loops; weather adds a timeout plus rAF and a full particle scan (`src/display.js:377,5930`). Background animation defaults off (`src/main.js:1791`). | Apply settings only on settings/season/mount changes; consolidate visual animation on rAF. Small to medium. | RT3, PF5, PF6 |

Value per effort, INFERRED: first ER1-F2, then the author-editor part of ER1-F5 and customization invalidation in ER1-F10, then ER1-F4/F8. ER1-F1 has the largest architectural reach but needs stronger regression and persistence evidence. RT9 RNG migration is useful for replay correctness, not a demonstrated speed win.

## Timer inventory

READ inventory from `rg -n 'setTimeout|setInterval|requestAnimationFrame' src index.html`. All executable scheduling sites in those sources are covered below; alternative/rearm sites share rows. A static call site is not a live timer count. Periods are requested delays, not observed cadence. Main `tickrate` defaults to 1 (`src/config.js:19`), adjustable in `src/main.js:7910`. Event-driven suitability is INFERRED.

| Code | Source / requested period | Work, lifetime and event alternative |
| --- | --- | --- |
| ER1-T1 | `src/main.js:7227,7691`; recursive timeout `1000/tickrate - time_adjustment` ms, correction bounded ±`100/tickrate` | Calendar/expansion/publication, rest/activity/reading/weather/XP, seven panels, autosave counters. Re-arms even when clock consumes zero. No retained handle to cancel main loop. Needs simulation time; render can be dirty-driven. |
| ER1-T2 | `src/main.js:2532,2556`; interval `100/tickrate` ms | Timed native action progress and completion. Rearm clears old interval; stop clears. Completion needs deadline; bar can interpolate on rAF. |
| ER1-T3 | `src/models/combat.js:198,241`; recursive timeout `actual_cooldown*1000/(60*tickrate) - adjustment` | Per-fighter progress and every 60th callback attack. Clear/reset/end supported at lines 477 onward. Due attack needs scheduler; visual progress can share rAF. |
| ER1-T4 | `src/main.js:8347`; interval 250 ms | Quiet place, work ledger, customization refresh/remount, rule editor. No handle or teardown. Settings, ledger, place/weather and mount events can replace poll. |
| ER1-T5 | `src/main.js:8457`; interval 500 ms | Authored-site editor refresh. No handle or teardown. Site revision and busy/write state events suffice. |
| ER1-T6 | `src/status_window.js:41`; interval 250 ms | Read status, known callback, stat/title writes; also subscribes to settings. Destroy clears/unsubscribes. Stats, cheat, titles and settings changes suffice. |
| ER1-T7 | `src/structured_pack_ui.js:103`; interval 250 ms | Project beginning/jobs/actions, repeat plan may issue next command after settlement (lines 23-49). Destroy clears/unregisters. Replace with settlement/write-state events, retaining repetition semantics. |
| ER1-T8 | `src/content_pack_ui.js:49`; interval 250 ms | Pack projection and definition signature, keyed controls/prose. Destroy clears/unregisters. Pack/definition/job changes suffice. |
| ER1-T9 | `src/village_career_ui.js:63`; interval 250 ms | Patrol/custody/study/recruit controls. Destroy clears/unregisters. Career/inventory/clock/write-state events suffice. |
| ER1-T10 | `src/workspace_views.js:62`; interval 250 ms | Current work, prose geometry, world theme, full workspace update despite unchanged signature. Destroy clears and disconnects observers/keydown. Work/world/layout/resize events suffice. |
| ER1-T11 | `src/workspace_views.js:84`; interval 1000 ms | Equipment projection and JSON signature, rebuild selectors/table only on change. Destroy clears. Inventory/equipment events suffice. |
| ER1-T12 | `src/life_record_ui.js:16`; interval 2000 ms | Biography projection/signature and changed list. Destroy clears. Save/milestone events suffice. |
| ER1-T13 | `src/npc_lives_ui.js:18`; interval 2000 ms | Household view/signature and changed people/news lists. Destroy clears. Year, meet, recruit and save events suffice. |
| ER1-T14 | `src/titles_ui.js:31`; interval 2000 ms | Title progress view/signature; filters rows by family and rebuilds changed lists. Destroy clears. Relevant counters/title events suffice. |
| ER1-T15 | `src/display.js:377,384`; interval 30 ms, one of two branches | Each floating click effect updates top/left/opacity. Multiple effects mean multiple intervals. CSS animation/rAF preferable; motion needs frames, not domain polling. |
| ER1-T16 | `src/display.js:392`; timeout 4000 ms | Clears the preceding floating interval/removes effect. Bounded one-shot, use animationend with fallback if desired. |
| ER1-T17 | `src/display.js:1166,1196`; interval 600 ms | Activity dots and remaining reading text via HTML replacement. `end_activity_animation` clears; missing node self-stops. CSS dots plus clock-driven text possible. |
| ER1-T18 | `src/display.js:5930-5931`; timeout `1000/60` ms then rAF | Full weather/star canvas clear/draw, particle count `ceil(width*height/5000)` (line 5915). Both handles cleared by stop. rAF alone avoids double scheduling; frames still needed. |
| ER1-T19 | `src/settled_text_effects.js:16,115`; initial rAF and recursive rAF while pulse exists | Tracks pulse geometry per frame. Cancel clears frame (line 34). Frame tracking only while visible effect is appropriate; ResizeObserver/animation may reduce geometry work. |
| ER1-T20 | `src/settled_text_effects.js:182`; timeout 1400 reduced / 1700 ms | Removes money-change float; connection check prevents obsolete node work. No handle retained; bounded one-shot. animationend alternative. |
| ER1-T21 | `src/workspace_views.js:32`; one rAF | Scroll trade dock to top after task changes. One-shot already change-driven. |
| ER1-T22 | `src/workspace_layout.js:122`; timeout 60 reduced / 1000 ms | Clears new-module reveal marker. Prior reveal timer cleared at line 120. One-shot already change-driven. |
| ER1-T23 | `src/native_discovery_feedback.js:51`; timeout configured duration, default 1800 ms | Hides cancel cue; token guards stale effects, cleared on cancel/replacement. Already change-driven. |
| ER1-T24 | `src/import_probe.js:30`; timeout 60000 ms | Import iframe watchdog; finish clears timer, message listener and iframe. Keep bounded timeout even with event completion. |
| ER1-T25 | `src/main.js:8302`; timeout 1000 ms | Ended-life export object URL revoke. Already one-shot event-driven. |
| ER1-T26 | `src/main.js:8456`; timeout 0 ms | Authored-site download URL revoke. Already one-shot event-driven. |
| ER1-T27 | `src/work_ledger_author_ui.js:15`; timeout 0 ms | Rule export URL revoke. Already one-shot event-driven. |
| ER1-T28 | `index.html:1119`; timeout 1000 ms | Native save-file URL revoke. Already one-shot event-driven. |

ER1-T29, READ: `index.html:15` loads `resources/js/HackTimer/HackTimer.min.js`. The readable equivalent (`resources/js/HackTimer/HackTimer.js:67,89`) replaces window intervals/timeouts with worker messages; worker timer sites at lines 16/26 of the inline worker and `HackTimerWorker.js:12,23` use the requested caller delay. Clear calls remove fake handles and worker timers; timeout callbacks delete entries. Minified/silent variants and worker copies are vendored equivalents, not additional independent game pollers. rAF is not replaced. This moves waiting to a worker, **not simulation or DOM execution**: callbacks run in the window message handler. Worker success/fallback and hidden-tab behavior were not exercised. `nethack-preview.html:1098` has the same 1000 ms export revoke on the separate preview page; not another current `index.html` timer. RT1/RT3/PF7 should account for this shim before changing background policy.

READ: 16 `setInterval` source call sites, including the mutually exclusive floating branches and the action rearm. Autosave and backup are counters inside ER1-T1, nominally 60 and 3600 wall seconds at steady default cadence (`src/main.js:1745,1749,7630-7655`). Title checks are also inside it every `5*tickrate` callbacks (`src/main.js:7689`). Neither is a separate timer; early clock returns skip those counters.

## Allocation, scans, rendering and listeners

| Code | READ source | Cost / qualification |
| --- | --- | --- |
| ER1-C1 | `src/expansion_engine.js:592,639` | Whole expansion clone, external/gameplay clones, final second gameplay copy even for a one-minute advance. Output validation walks optional owners and all domains/jobs/opportunities/history. |
| ER1-C2 | `src/simulation.js:38,138,204,471` | Planner clones whole state and multiple context domains; some preview effect tests clone candidate plans; world-completion jobs can clone state before settlement. These preserve transaction isolation; eliminating copies needs purity/failure proof. |
| ER1-C3 | `src/expansion_persistence.js:11,41`; `src/main.js:1239,5181-5187` | Envelope parse or replacement clone, native patch value clones, catch-up context clone, several optional save-domain clones. `recordRouteReading` clones only on first learned route, not every save (`src/everyday_life.js:67`). |
| ER1-C4 | `src/gameplay_transactions.js:9,27,82`; `src/gameplay_publication.js:16,50` | Every gameplay snapshot inventory key is JSON-parsed for validation. Publication validates then reconstructs every item map; publish deletes/reassigns all inventory keys even if only clock changed. Large inventory multiplies cost across stages. |
| ER1-C5 | `src/simulation.js:452-549` | Full arrays for boundary selection; sorted events/checks/controllers each boundary; per-due-job removal scans; programs and conditions visited. Controllers preview sorted candidate actions and sort may stringify ties (line 521). No O(1) due queue. |
| ER1-C6 | `src/main.js:7206,7519,7625,7689`; `src/display.js:1622,4300` | Effect-duration scan, native activity availability DOM loop, regen display, periodic title projection; durable publication calls broad inventory/item-log refresh. These do not all rebuild all DOM on every ordinary legacy tick. |
| ER1-C7 | `src/work_ledger_ui.js:40`; `src/work_ledger_author_ui.js:17`; `src/customization_ui.js:127` | 4 Hz signatures/settings validation; pretty JSON editor rewrite when not dirty/focused. Collapsed details/hidden panels generally still project and sign unless their own early guard stops work. |
| ER1-C8 | `src/structured_pack_ui.js:50`; `src/content_pack_ui.js:21`; `src/titles_ui.js:12`; `src/npc_lives_ui.js:15` | Signature suppresses unchanged subtree rebuilds but not projection/stringification. Structured jobs and pack controls are keyed; avoid describing them as total rebuilds. Status window writes scalar text every poll without an equality signature. |
| ER1-C9 | `src/workspace_layout.js:104,271-283`; `src/import_probe.js:38`; `src/main.js:1819,8163,8181` | Global gesture handlers, once-guarded start-screen observer/keydown, iframe-lifetime message handler, page controls have no general remover. No proven accumulating listener leak: most install once or belong to destroyed iframe/page. Remount lifecycle deserves a separate test. |
| ER1-C10 | `src/display.js:2880`; `src/customization_profiles.js:103-118`; `src/main.js:7295-7345` | Craft filter has `crafting_filter_bound`; native tab handlers use WeakSet; weather removes other stable resize callbacks, and same-target/type/function adds deduplicate. These are **not** unbounded adds per render. Rebuilt child button listeners on detached rows are normally collectible. |
| ER1-C11 | `src/workspace_layout.js:310`; `src/workspace_views.js:62`; `src/settled_text_effects.js:131,195`; `src/native_discovery_feedback.js:62` | Explicit cleanup exists for workspace owner listeners, current-work observers/keydown, visibility/motion listeners and money/discovery effects. Main polling timers ER1-T4/T5 lack owner teardown despite panel destroy methods. Long-session retained heap/listener counts remain unmeasured. |

## Save cost and synthetic scope

ER1-S1, READ: `create_save` (`src/main.js:4935-5197`) serializes calendar/version/stats/flags, character biography/equipment/money/XP/vital offsets/reputation, weather, favorites and skill ordering; all registered level owners and skill progress; location action progress; current activity; all availability domains; NPC equipment/dialogue progress/trader refresh; all inventory owners/counts; read books; quest task progress; reading/sleep/effects; kill/item/market records; options/stances/message filters/skill expansion state; durability/pacing/fort/local life/cheats/packs/career/ledger/customization/life record/NPC lives; full expansion and retained native world snapshots plus retired content. It reads some DOM settings. It does not save executable registry definitions, timer handles or the displayed message DOM as a whole.

ER1-S2, READ: ordinary autosave is `create_save -> JSON.stringify -> lifeSaveStorage(JSON.parse -> life observation/NPC advance -> JSON.stringify -> writeGuardedSave) -> JSON.parse(saved_at)` (`src/main.js:415,5252`). The wrapper also publishes settings/career and renders panels. It does **not** call full `validateSaveEnvelope` on this ordinary path. Expansion durable writes do call it, in addition to expansion validation. Export calls create/encode twice around reward granting (`src/main.js:5233`). Backup can coincide with autosave and builds another full envelope.

ER1-S3, READ: `measureSaveSize` allocates UTF-8 bytes but local capacity is checked by UTF-16 string size plus all other origin keys (`src/save_files.js:196-211`), against 4 MiB. A primary and full backup approximately double envelope occupancy; other origin keys count too. Actual localStorage I/O, quota and native envelope construction are not measured by the Node harness.

ER1-S4, synthetic fixture contract: benchmark adapts the public `tests/simulation.test.js` sandbox and `tests/save_files.test.js` minimal envelope into v0.6 component fields. Fresh/mid/crowded contain 1/32/128 actors with matching 60-minute jobs, 20/1000/10000 distinct native item keys, 0/200/2000 retained expired opportunities and 0/30/100 facts per actor. Item quality values distinguish keys for stress; they are not a balance prediction or real playable inventory. Registry commands and people are synthetic, with actual enrollment and command planners producing jobs. State and envelopes pass actual validators. One-minute advance leaves jobs future; 60-minute advance settles all and asserts one output per actor. Input purity is asserted. This is an axis stress model, not a representative full world save or real-loader compatibility proof.

ER1-S5, READ: expansion history is capped at 100, simulation log at 100 and transitions at 32 (`src/expansion_engine.js:218,531`; `src/simulation_contracts.js:321`); life record recent/year bounds are 64/200 (`src/life_record.js:16`). Fixtures do not inflate these beyond legal limits. Expired opportunities and domain facts demonstrate retained state growth independently of bounded display histories. Rich book-native snapshots, relationships, histories, private packs and sealed data are absent, so no maximum-save-size claim is made.

## Native randomness and mutable state

Every `Math.random` call in current `src/main.js`, READ from `rg -n 'Math.random' src/main.js`:

| Code | Lines | Use / replay consequence |
| --- | --- | --- |
| ER1-R1 | 2511 | Pick floating click effect, presentation RNG. |
| ER1-R2 | 2586,2589,2610 | Pick failure/result prose. Cosmetic output can still differ across replay. |
| ER1-R3 | 2593 | Native game-action success draw. Consequential. |
| ER1-R4 | 2933 | Reward chance gate. Consequential. |
| ER1-R5 | 3292 | Include item/resource in a mix. Consequential. |
| ER1-R6 | 3502,3504 | 1% alternate name/word choice. Presentation. |
| ER1-R7 | 4224,4236,4273 | Fractional craft success count, per-attempt craft success and fractional result rounding. Consequential. |
| ER1-R8 | 4694 | Probabilistic reward unlock. Consequential. |
| ER1-R9 | 7503 | Gathering resource chance. Consequential. |
| ER1-R10 | 7574,7575,7578,7581 | Ambient location/activity frequency and line choice. Presentation. |

ER1-R11, READ: that is 18 calls on 18 lines; two calls share neither state nor a saved domain stream. Expansion seed comes from crypto at `src/main.js:440` and expansion RNG/outcome receipts persist. Native combat RNG also lives outside main, e.g. `src/models/combat.js:160`; main's list alone does not establish whole-game determinism. INFERRED RT9 proposal: migrate consequential domains first, isolate cosmetic RNG, preserve frozen pending outcomes and explicitly version compatibility. RNG draw cost itself is not a top measured hotspot.

ER1-M1, READ: main is an ES module, so these are module-scoped shared mutable values, not necessarily properties of `window`. Runtime command/timer handlers close over them. State owners at lines 296-440 include mutable pack Maps, pack state, cheats, retired content, writer/import/error flags, gameplay binding map, customization, ledger, career, life/NPC records and expansion state. At lines 602-607: local life, fort, pacing and durability hosts. Lines 1674-1809 own language/loading error, game stats, export reward, temperature/rain/cold, combat/location/activity/action, loot maps, travel/path/beds, rest/sleep/read, save counters, tickrate/smoothing, dialogue/effects, stances/favorites/options/message filters. `game_speed` is mutable at line 7896. Const Maps/objects/arrays remain mutable despite const bindings.

ER1-M2, READ: imported singleton owners include character, time, levels, inventories, locations, skills, availabilities, NPC registry, quest manager and item log, accessed/mutated throughout main. Panel/effect host references occupy lines 394-479. `lifeSaveStorage.setItem` changes live state and triggers rendering after storage; `persistExpansion` mixes validation, native material reconstruction, durable I/O, live publication and DOM updates. INFERRED RT2: pure expansion stepping is already available, but pure native stepping needs explicit injected snapshots/RNG and a separate publication layer. A worker alone cannot run these closures headless.

## Headless measurements

ER1-B1, MEASURED command:

```sh
node docs/gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark.mjs
```

Node v22.23.3, darwin/arm64, Apple M5 Pro. Successful run 2026-10-14T04:54:27.219Z to 2026-10-14T04:59:20.606Z. Four warmups, 31 independent operations on the same input; median and nearest-rank p95 in milliseconds. Setup/enrollment/job reservation excluded. No forced GC. Raw [results](../gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark-results.json) and [harness](../gm/dispatch/engine-runtime-2026-10-14/ER1/benchmark.mjs).

ER1-B2, MEASURED host caveat: `uptime` during the run reported load averages 695.05 / 541.13 / 325.39. `ps -Ao pid,pcpu,comm` showed many concurrent Node/Chrome processes. No other worker was stopped. These are elapsed wall timings under severe contention; p95 includes scheduling and GC effects. Fresh/mid/crowded rows ran in sequence under changing load, so ratios and even monotonic scaling cannot be inferred reliably. They establish harness output and stage sensitivity, not isolated CPU cost, main-thread long tasks or player input latency. An idle-host repeat and rebuilt desktop trace remain OPEN.

| Code / fixture | Actors / future jobs | Item keys / expired opportunities / facts per actor | Save UTF-8 bytes | Guard UTF-16 bytes | Expansion UTF-8 bytes |
| --- | --- | --- | --- | --- | --- |
| ER1-B3 / fresh | 1 / 1 | 20 / 0 / 0 | 3,079 | 6,158 | 1,408 |
| ER1-B4 / mid | 32 / 32 | 1000 / 200 / 30 | 155,369 | 310,738 | 96,936 |
| ER1-B5 / crowded | 128 / 128 | 10000 / 2000 / 100 | 1,579,124 | 3,158,248 | 989,690 |

ER1-B6, MEASURED timings: each cell is median / p95 ms.

| Operation | Fresh | Mid | Crowded |
| --- | --- | --- | --- |
| clone_expansion | 0.0146 / 0.0489 | 0.4152 / 41.6408 | 15.1387 / 144.7205 |
| validate_expansion | 0.1389 / 67.6519 | 1.1860 / 87.1350 | 8.5846 / 190.9625 |
| advance_1_future_jobs | 0.5741 / 3.6210 | 2.4865 / 48.4582 | 132.4878 / 282.2824 |
| advance_60_settle_all | 5.8882 / 263.1450 | 785.8466 / 1382.8628 | 719.4789 / 2045.5210 |
| preview_command | 9.1255 / 373.3611 | 45.6646 / 184.0785 | 318.9731 / 820.8291 |
| commit_command | 66.0290 / 389.4365 | 124.0581 / 198.5338 | 364.2578 / 464.4931 |
| serialize_envelope | 0.0047 / 0.0066 | 0.2410 / 15.8558 | 4.2341 / 5.1019 |
| parse_envelope | 0.0101 / 7.1908 | 0.5533 / 28.4547 | 6.5325 / 8.2081 |
| validate_envelope | 2.9677 / 104.8930 | 254.1539 / 452.2600 | 509.3587 / 609.0762 |
| autosave_pure_stages | 0.0431 / 0.2267 | 1.7363 / 15.5652 | 15.5030 / 17.8380 |
| persist_plan_mock_storage | 3.9654 / 134.1214 | 168.3651 / 252.4973 | 502.1710 / 1239.6083 |

ER1-B7, boundaries: `serialize_envelope` is JSON.stringify of an already-built synthetic envelope; it excludes native create_save registry/DOM construction. `validate_envelope` includes the real retirement/migration clone/walk and validators. `autosave_pure_stages` measures stringify, parse, actual life observation, second stringify and final parse only. It excludes native create_save construction, NPC-year advance, guard/storage, settings/publication and render. `persist_plan_mock_storage` exercises the real expansion persistence function with fixture binding and envelope validation, but its storage sink only retains string length and is not the main life wrapper or localStorage. The simulation fixtures include the large gameplay inventory, so key validation and gameplay copies are included in advance/planner measurements. No export-base64, native material reconstruction or real-loader import is timed.

ER1-B8, INFERRED from MEASURED bytes: crowded primary occupies 3,158,248 bytes before its key; two such envelopes occupy 6,316,496 bytes before keys, exceeding the current 4,194,304-byte guard. Mid primary plus equal backup is 621,476 bytes before keys. This predicts synthetic capacity arithmetic only, not a tested browser quota failure. Inventory alone is 588,925 UTF-8 bytes in crowded; expansion is 989,690 bytes.

ER1-B9, interpretation: serialization stayed much cheaper than envelope validation in these fixtures. The READ exception-heavy retirement walk is a strong candidate for an inexpensive change, but attribution still needs isolated measurement or a profiler. A whole-game engine rewrite, worker or new storage backend is not justified by these wall timings alone.

## Remaining gates

| Code | OPEN question / observable next gate |
| --- | --- |
| ER1-Q1 | Uncontended repeat with process CPU/allocation sampling and per-stage retirement-walk isolation; verify same fixtures and results. |
| ER1-Q2 | Fresh-origin rebuilt 1366×768 desktop trace of actual joined ticks, legacy ticks, combat, collapsed panels and crowded native inventory. Capture render/layout/GC/storage separately and input p95. |
| ER1-Q3 | Repeat mounts/travel/open-close cycles and retained heap/listener/timer counts. Static absence of teardown is not proof of leakage. |
| ER1-Q4 | Any future save batching, queue or RNG repair needs its owning compatibility contract and failed-write/save/reload/import proof; no such change was made here. |

Source hash snapshot stayed unchanged across the final audit check for its listed key inputs; see [snapshot](../gm/dispatch/engine-runtime-2026-10-14/ER1/source-snapshot.json). Live shared files can change later. No tests, build, browser play, install, commit or push was run for this read-only lane.
