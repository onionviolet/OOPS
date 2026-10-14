# Codebase structure and bundle audit, 2026-10-14

## CHECKPOINT

ER2 source/bundle/import measurements complete; per-file test timing complete; 98 file summaries captured. Audit only. No gameplay, save, dependency, distribution or accepted design change. Resume from `docs/gm/dispatch/engine-runtime-2026-10-14/ER2/analysis.json`, `metafile.json`, `source-snapshot.json` and `npm-test-timing.json`. Scratch bundles and raw test logs are under `/tmp/er2-runtime-audit/`. Final lane return: [ER2 report](../gm/dispatch/engine-runtime-2026-10-14/ER2/REPORT.md).

Proposals extend [runtime palette](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md) CH1-CH4, PF4 and RT10. [E1-E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) still own transaction, compatibility and ownership requirements; the [offline audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md) still owns clock semantics. Splitting files must preserve those semantics. PROJECT.md:100-125,295-329,389-409 retains desktop-first scope, opt-in expansion, old saves and separate playable gates. No mobile work or new gameplay gates are dispatched here. No `SECRETS*` files or personal saves were opened.

## Findings

| Code | Evidence | Finding / palette |
| --- | --- | --- |
| ER2-F1 | MEASURED | Current minified ESM is 5,100,788 bytes; main.js contributes 207,805 bytes (4.07%). A file split alone will mostly improve ownership, not initial bytes. CH1, CH3, PF4. |
| ER2-F2 | MEASURED + READ | A contracts JSON contributes 261,778 bytes, the largest single input. Four compiled Ink versions total 130,546 bytes; inkjs itself is 128,843 bytes. Retained versions are deliberate save compatibility, not removable copies. CH3, PF4. |
| ER2-F3 | MEASURED | Four src import SCCs contain 2, 2, 55 and 36 modules. main.js has 245 distinct src dependencies and 15 src importers. Async world loading requires breaking eager registry/runtime links, not only swapping one import. CH2, RT10. |
| ER2-F4 | READ + INFERRED | Host/content/facts is a repeated architectural shape, with existing routers and shared projection helpers. A manifest can own wiring; executors and ownership-specific facts should remain local. CH2, RT10. |
| ER2-F5 | MEASURED + READ | npm test passed 628/628 in 171.54 seconds. It includes in-memory bundling and a headless Chrome journey, so the suite is not all pure unit tests. CH4. |
| ER2-F6 | READ + MEASURED | nethack-preview.html:9 actively references the 2,927,363-byte preview. It is separate from index.html's main bundle. Removing it would break the preview page and would save zero bytes from the main bundle. PF4. |

## Commands and method

MEASURED, run from repository root on macOS arm64, Node v22.23.3, 18 logical CPUs. Other agents/builds/tests were running on this shared machine. Single samples describe this session, not an uncontended benchmark or startup latency.

```sh
node /tmp/er2-audit.mjs
npm test -- --test-reporter=tap
node --test --test-reporter=/tmp/er2-runtime-audit/file-reporter.mjs tests/*.test.js
```

The saved, corrected reproduction command is:

```sh
node docs/gm/dispatch/engine-runtime-2026-10-14/ER2/audit.mjs
```

`audit.mjs` calls local esbuild 0.25.10 with `entryPoints:['src/main.js']`, `bundle:true`, `sourcemap:true`, `minify:true`, `platform:'browser'`, `target:'es2022'`, `format:'esm'`, `metafile:true`, `outfile:'/tmp/er2-runtime-audit/bundle.js'`. This matches build.js:33-45's bundle settings without its distribution notices, Ink precheck or index version mutations. It is a composition build, not a release build. Source map is 13,120,300 bytes; Node gzip produces 1,418,887 bytes for the bundle. Gzip is a transfer-size experiment, not proof that hosting serves gzip.

Graph extraction uses a second esbuild invocation with every src JS entry, `bundle:false`, `write:false`, `metafile:true`. Its output import records preserve resolved relative static/dynamic literal import paths, including files absent from main's closure. A directed src-only graph deduplicates edges; Tarjan finds strongly connected components. Reachability starts at main.js. This excludes runtime `fetch`, nonliteral imports, HTML entrypoints, test filesystem reads and injected references. Main's closure agrees with the src input set in the bundled metafile. Nodes are 458 JS files and one JSON; edges are 1,833. Full adjacency/SCC/member/importer lists are saved in `analysis.json`.

The source-map content hashes are saved without source text. No live project source drift was found when checked against the scratch map. inkjs's upstream map expands into TypeScript paths absent from its npm package; these are recorded hashes, not live-file drift. Working-tree changes observed before this lane were left with their owners. Line ranges below refer to this 8,579-line main.js snapshot.

## Bundle composition

MEASURED by `node /tmp/er2-audit.mjs`; values are esbuild `bytesInOutput` for the minified JS output, excluding the map. These are attribution estimates: esbuild's input contributions sum to 5,101,138 bytes, 350 bytes above the physical output. Percentages use physical output as denominator; attribution is not a perfectly additive byte partition.

### Largest inputs

| Rank | Input | Emitted bytes | Share |
| --- | --- | ---: | ---: |
| 1 | `docs/gm/book-world-player-agency/contracts/CONTRACTS.json` | 261,778 | 5.13% |
| 2 | `src/main.js` | 207,805 | 4.07% |
| 3 | `node_modules/inkjs/dist/ink.mjs` | 128,843 | 2.52% |
| 4 | `src/display.js` | 120,089 | 2.35% |
| 5 | `src/data/locations.js` | 114,608 | 2.25% |
| 6 | `src/feature_expansion_book_roster.js` | 101,066 | 1.98% |
| 7 | `src/feature_expansion_book_recognition.js` | 86,283 | 1.69% |
| 8 | `locales/english.js` | 83,082 | 1.63% |
| 9 | `src/items.js` | 73,234 | 1.44% |
| 10 | `src/feature_expansion_book_cultivation.js` | 72,106 | 1.41% |
| 11 | `docs/gm/feature-wave/ink/voice-cues/VOICE_CUES.json` | 63,813 | 1.25% |
| 12 | `src/feature_expansion_book_situated.js` | 54,439 | 1.07% |
| 13 | `src/crafting_recipes.js` | 53,187 | 1.04% |
| 14 | `stories/feature_wave.json` | 52,809 | 1.03% |
| 15 | `docs/gm/feature-wave/ink/content/feature_wave_v3.json` | 49,960 | 0.98% |
| 16 | `src/original_frontier_career_content.js` | 49,727 | 0.97% |
| 17 | `src/data/dialogues.js` | 48,441 | 0.95% |
| 18 | `src/feature_expansion_nested_chains.js` | 47,683 | 0.93% |
| 19 | `src/original_frontier_field_content.js` | 46,805 | 0.92% |
| 20 | `src/book_world_mol_actions.js` | 46,454 | 0.91% |

### Folders

Immediate parent folders, mutually disjoint by file path; `src` means files directly in that folder, not all descendants.

| Folder | Emitted bytes | Share |
| --- | ---: | ---: |
| `src` | 4,015,551 | 78.69% |
| `docs/gm/book-world-player-agency/contracts` | 261,778 | 5.13% |
| `src/data` | 234,829 | 4.60% |
| `node_modules/inkjs/dist` | 128,843 | 2.52% |
| `locales` | 83,082 | 1.63% |
| `docs/gm/feature-wave/ink/content` | 77,737 | 1.52% |
| `src/management` | 69,665 | 1.37% |
| `docs/gm/feature-wave/ink/voice-cues` | 63,813 | 1.25% |
| `src/models` | 53,806 | 1.05% |
| `stories` | 52,809 | 1.03% |
| `src/components` | 13,603 | 0.27% |
| `src/absorb_d` | 10,584 | 0.21% |
| `src/absorb_c2` | 9,026 | 0.18% |
| `src/ui` | 6,492 | 0.13% |
| `src/absorb_e2` | 4,932 | 0.10% |
| `src/absorb_b` | 4,763 | 0.09% |
| `src/absorb_e1` | 4,637 | 0.09% |
| `src/absorb_c1` | 2,636 | 0.05% |
| `src/absorb_e3` | 2,552 | 0.05% |

### Content and Ink shares, with explicit selectors

| Code | Selector | Emitted bytes | Share |
| --- | --- | ---: | ---: |
| ER2-B1 | All `.json` inputs | 456,137 | 8.94% |
| ER2-B2 | `_content.js`, `management/content.js` plus all `.json` inputs | 1,199,633 | 23.52% |
| ER2-B3 | B2 union `src/data/` and `locales/` | 1,517,572 | 29.74% |
| ER2-B4 | Paths containing `ink`, union `stories/` | 375,294 | 7.36% |
| ER2-B5 | inkjs runtime only | 128,843 | 2.53% |
| ER2-B6 | Four compiled story artifacts | 130,546 | 2.56% |

B2/B3 are naming-based proxies, not an AST proof that every byte is declarative data. Content modules also contain functions; catalogue data lives outside those naming selectors. Rows overlap and must not be added. B4 includes voice cues and narrative/scene/UI adapters; it does not include unrelated contracts JSON.

MEASURED exact SHA-256 checks found no identical src JS/JSON files and no identical whole bundle input files. The bundled metafile contains one inkjs runtime input, despite multiple consumers. Many imports of simulation.js do not create multiple emitted copies. This check cannot rule out copied function bodies or semantically repeated data.

READ: ink_narrative.js:2-21 retains v1/v2/v3/current artifacts and selects by saved content hash. Their emitted contributions are 8,354 / 19,423 / 49,960 / 52,809 bytes. Similar story content across revisions is a compatibility cost. Removing older artifacts would reject retained cursors; lazy retrieval must pin content hash/revision and fail safely before paid effects. Small local assert/key/record helpers repeat across hosts, but no measured byte win justifies replacing distinct domain contracts wholesale.

## Import graph

### Cycles

SCCs are maximal mutually reachable groups, not counts of individual simple cycles. All four are reachable from main.js.

| Code | Members | Interpretation / source evidence |
| --- | ---: | --- |
| ER2-G1 | 2 | acquisition.js ↔ gameplay_transactions.js (imports at each file's start). Separate shared plan/acquisition primitives before adding more callers. |
| ER2-G2 | 2 | causal_situations.js ↔ simulation_contracts.js (imports at each file's start). Contract primitives should not require the feature that imports them. |
| ER2-G3 | 55 | Expansion/simulation SCC: expansion_engine, simulation, simulation_effects, optional hosts, native adapters, backlog and Ink. Full members in analysis.json. Lazy loading one world while core imports its host leaves it eager. |
| ER2-G4 | 36 | Native SCC: main, display, character/item/location/combat/trade/quest modules and absorb_d/ui. main.js:68-69 explicitly orders initialization of the cyclic core. Preserve initialization and live bindings during extraction. |

INFERRED: cycles are coupling and initialization risks, not proof of a current runtime failure. Source tests pass despite them. Move pure shared primitives toward leaves, and replace callbacks imported from main with injected narrow interfaces. Avoid a new shared helper that imports simulation.js, since that would repeat the high-level back edge.

### Unreachable from main

| Code | File | Disposition |
| --- | --- | --- |
| ER2-G5 | src/absorb_c2/balance.json | READ tests/absorb_c2.test.js:16-18 reads this as a source-balance baseline. Keep as a test fixture/authoring reference; not shipped in main. |
| ER2-G6 | src/mods/glassmaking.js | Not in main import closure. Optional mod candidate, not proven dead by an entrypoint graph. Review its external/mod loading route before any archive/removal. |

Both contribute zero bytes to the main build. Removing them would not reduce startup JS. No source deletion proposed here.

### Hubs

Distinct src-to-src module edges, not named symbol counts; outside-src JSON/locale/package imports are excluded from these degrees.

| Fan-in module | Src importers |
| --- | ---: |
| `src/simulation.js` | 88 |
| `src/simulation_contracts.js` | 83 |
| `src/techniques.js` | 30 |
| `src/feature_expansion_host.js` | 29 |
| `src/gameplay_transactions.js` | 22 |
| `src/expansion_engine.js` | 21 |
| `src/simulation_effects.js` | 20 |
| `src/status_care_facts.js` | 19 |
| `src/data/component_references.js` | 19 |
| `src/feature_expansion_objects.js` | 18 |
| `src/data/character.js` | 16 |
| `src/main.js` | 15 |

| Fan-out module | Src dependencies |
| --- | ---: |
| `src/main.js` | 245 |
| `src/expansion_engine.js` | 56 |
| `src/simulation_effects.js` | 55 |
| `src/simulation_content.js` | 42 |
| `src/display.js` | 33 |
| `src/feature_expansion_wave_host.js` | 32 |
| `src/simulation.js` | 30 |
| `src/save_files.js` | 27 |
| `src/expedition_content.js` | 23 |
| `src/data/expedition_items.js` | 18 |
| `src/items.js` | 15 |
| `src/feature_expansion_content.js` | 14 |

READ: main's 15 importers include display, crafting_recipes, trade, quests, weather, models/combat and models/hero. Its current export facade at main.js:8541-8579 is an integration boundary to preserve while implementations move. Separately, simulation_content.js:55-74 eagerly spreads definitions from multiple worlds; expedition_content.js:1-23,39 creates the aggregate registry. Both need admission changes for world chunks to become lazy.

## Repeated families: shared manifest or helper?

| Code | Family / measured size | READ pattern | INFERRED proposed boundary / cost |
| --- | --- | --- | --- |
| ER2-M1 | audit_remainder_*: 25 files, 263,744 emitted bytes | audit_remainder_host.js:15-24 already lists six lanes; :31-46 routes commands; :48-80 adapts sections. livelihood_host.js:10-48 validates identity/sequence, routes cancellation and commits an actual plan. | Make the existing lane list the manifest owner for group, command/presentation handler, enrollment/validation hook and revision. Keep explicit order. Moderate adapter and cross-lane equivalence effort; no second publisher. RT10/CH2. |
| ER2-M2 | absorb_*: 12 src files, 11 emitted inputs, 39,130 bytes | absorb_d/register.js:3-10 injects constructors/registries. absorb_e1/pacing.js:1,21-35 is pure optional state; main.js:608-744 binds other native options and panels. | Manifest can own registration order, save field/schema and mount/dispose hooks. These are different mechanics, not one generic executor. Moderate setup/roundtrip coverage. RT10/CH2. |
| ER2-M3 | *_host.js: 59 files, 370,473 bytes | Typical context → preview/commit → presentation, with actor/stock/clock rules in each host. feature_expansion_host.js:9-38 already provides cost formatting and command projection. | Reuse current projection helpers for matching rows; extract only proven identical pure formatting. Leave cancellations, participants and transaction validation local. Small effort for one matched family, no broad host rewrite. CH2. |
| ER2-M4 | *_facts.js: 32 files, 281,844 bytes | Pure observations/validation recur, but livelihood_facts.js:1-10 binds a calendar, while other families bind stock, custody or world-local evidence. | Manifest declares read-only fact providers and their supported context inputs. Do not flatten differing clock/knowledge contracts into one generic truth source. Moderate contract review. RT10/CH2. |

Proposed manifest fields: stable ID/revision, dependencies, save domain/schema, pure definition provider, context/fact hook, explicit command handler, panel factory, mount/dispose and validator. Registration must reject collisions; facts/presentation must not spend resources or reveal sealed truth. Existing aggregate registry remains the authority; one application publisher remains the durable authority. Start with one six-lane router rather than inventing a universal plugin system. Families overlap, so their byte rows are not additive.

## main.js owner map and extraction order (CH1)

READ ranges from the snapshot. Ranges intentionally overlap where a behavior crosses serialization, startup and publication. This is an extraction plan, not an implemented split. Proposed files are new owners, not approved source paths. Preserve the old export facade and window callbacks during each step; inject state accessors so closures read current owners rather than captured stale values.

| Code / order | Proposed owner / current main.js ranges | Risk and extraction scope | Existing regression guard; added acceptance still needed |
| --- | --- | --- | --- |
| ER2-X1 / 1 | settings_host: 1776-2104 options and option callbacks | Low/moderate. Extract options as one state owner with getters/callbacks; retain save field names and defaults. Do not include translation yet. | absorb_e1/e2/e3.test.js, cheat_status_window.test.js guard selected options/state, not every DOM callback. Fresh 1366×768 settings/save/reload check for extracted options. |
| ER2-X2 / 2 | panel_bootstrap: 8230-8514; related handles 394-479 | Moderate. Extract one panel family first, then mount/dispose registry. Inject read/command callbacks; preserve discovery, focus, hydration and 250 ms refresh at :8347. | workspace_focus.test.js, feature_panel_save_failure.test.js, cheat_cards.test.js, simulation_ui_hidden.test.js. Fresh 1366×768 known/hidden panel, keyboard focus, repeated open/dispose and read-only origin checks. |
| ER2-X3 / 3 | action_host: 2380-2745 activities/actions; 2798-2930 rest/sleep/reading | High. Isolate action interval start/stop/rearm first (:2482-2663), then lifecycle. Retain rewards and cancellation in current authoritative handlers. | absorb_c2.test.js, village_life/choices/study.test.js, native_craft_transaction.test.js guard adjacent semantics. Add injected-timer tests for rearm/end/speed and a native start/finish/cancel journey; no comprehensive current action-loop test claimed. |
| ER2-X4 / 4 | combat_host: 3557-3775,3970-4125 | High. First inject combat callbacks into models/combat instead of importing main; then move orchestration. Keep native defeat/recovery and RNG meaning. | party_battle.test.js, combat_fit_practice.test.js, clear_state.test.js, native_equipment_ownership.test.js. Add native combat win/defeat, stance, interrupted travel and reward-once checks. |
| ER2-X5 / 5 | time_host: 1069,1183-1256,1508-1530,7127-7697,7743-7876,7895-7925 | High. Move scheduling wrapper (:7743-7876) with injected advance/render/save callbacks first. Move tick body (:7226-7697) only after consumer equivalence. Keep joined-clock boundaries and offline policy unchanged. | expansion_engine.test.js, content_packs.test.js, structured_pack_runtime.test.js, absorb_e1.test.js, village_life.test.js. Add native timer advance/background/resume equivalence checks under current policy; these do not authorize offline accrual. |
| ER2-X6 / 6 | save_host: 362-439,588-599,806-1003,1619-1673,4899-7126 | Very high. First codec/download wrapper (:5205-5276,7056-7126); next serializer (:4935-5204); load (:5278-7055) last, by domain behind one coordinator. Keep writer lock/import probe and plan/write/publish boundary intact. | save_files/compatibility/v06_migration.test.js, native_*_transaction.test.js, heir_inheritance.test.js, cheat_cards.test.js, world_completion_native_restore.test.js. Full native old/current save, failed write, reload/export/literal import and read-only tab checks still required after each moved domain. |
| ER2-X7 / 7 | expansion_dispatch: 304-361,480-587,608-805,1004-1618,2275-2379; startup 8078-8192 | High. Group existing host adapters after state access/publication APIs are stable. Use the manifest for router wiring, not gameplay rules. Keep registry/native bindings before save hydration. | simulation.test.js, ink_lin_parity.test.js, authored_site.test.js, realm_optional_context.test.js, resident_allocation_funding.test.js and family slices. Add combined admission, initialization-order and paid command persistence checks. |
| ER2-X8 / keep facade | main host retains imports 1-300, native state 1674-1775, translation/location 2105-2274, rewards/XP 2746-2797,2931-3556,3776-3969, craft/inventory 4126-4898, title/dev helpers 7698-7742,7926-8077,8193-8229, final wiring/exports 8515-8579 | Retain these until the above seams are qualified. Some handlers later belong with craft, rewards or travel owners, but moving all remaining code is not needed for this plan. | Whole npm test plus one rebuilt native combined desktop journey; source slices cannot alone prove initialized exports, DOM, timers or full-envelope compatibility. |

Do one bounded extraction per change. Existing source suites guard domain semantics, not the entire moved main orchestration. Passing the same 628 tests alone is not extraction acceptance. The main split has near-zero predictable startup byte saving while static imports remain.

## Code splitting candidates (PF4)

MEASURED family byte totals from the current metafile; INFERRED savings are upper ceilings for bytes deferred from initial main JS, not compressed transfer or total-install savings. Lazy chunks add wrappers and retain shared code. No async split was built or benchmarked, so actual savings can be zero until eager edges are removed. Rows are scoped by selectors and cannot be summed blindly.

| Code / priority | Candidate selector | Current attributable bytes / initial ceiling | Required seam / risk |
| --- | --- | ---: | --- |
| ER2-C1 | Book subtlety catalogue: feature_expansion_book_{catalogue,cultivation,recognition,situated,roster}.js | 314,747 / 6.17% | Load selected profiles before binding or evaluation; keep ID/revision summary eager. catalogue.js:12-22 currently requires the full roster. Moderate/high async admission effort; do not drop retained world support. |
| ER2-C2 | Agency contracts JSON only | 261,778 / 5.13% | main.js:89,389 eagerly exposes contracts; contract adapter :11-15 freezes/indexes all rows. Generate validated minimal runtime records or fetch versioned detail before use. Moderate/high field-consumer review. Trimming is an alternative to splitting, not a proven byte reduction. |
| ER2-C3 | Ink runtime + compiled artifacts + voice cues + scene/UI adapters (paths containing ink, union stories/) | 375,294 / 7.36% | Keep cursor identity/compatibility checks eager and load exact artifact before conversation or save restoration. Narrative is within the 55-module SCC. High effort; failures must preserve paid history. |
| ER2-C4 | book_world_paradise_* | 163,004 / 3.20% | Includes hub/campaign/native/facts. Remove synchronous core/registry/serializer edges; load required world definitions before hydration or suspend deliberately. High effort; retained state is not disposable. |
| ER2-C5 | book_world_mol_* | 98,913 / 1.94% | Same world-admission seam, preserving saved native calendar and local state. High effort. |
| ER2-C6 | src/management/* | 69,306 / 1.36% | Commands/facts validation can keep this eager even if UI is lazy. Start with UI factory if its independent share justifies it. Moderate/high integration effort. |
| ER2-C7 | proto23_world_* | 64,511 / 1.26% | Native state/start/binding dependencies cross initialization. High effort relative to this byte slice; validate full world save and absent-module policy. |
| ER2-C8 | audit_remainder_* | 263,744 / 5.17% | Optional enrollment is a possible load boundary but scheduler/validators/routers import it today. Manifest first. High cross-family integration effort. |
| ER2-C9 | nethack_fieldcraft_* in main | 26,769 / 0.52% | Small feature; defer only after knowledge/item-view callbacks and shared host edges are qualified. Low byte value for moderate coupling effort. Separate preview artifact is not part of this saving. |

Highest-value first experiment: selected catalogue/contract admission on a scratch split build, then measure entry/chunk bytes and target desktop startup. Ink follows only with retained-version loading and failure/roundtrip gates. Keep native world definitions eager where current saves require them until missing-content recovery is explicit. Do not select a new world priority, storage backend or framework from bundle size alone.

## Preview reference check

READ: `rg -n 'nethack-fieldcraft-preview' --glob '!SECRETS*' --glob '!*.map' --glob '!bundle.js' --glob '!nethack-fieldcraft-preview.js' --glob '!package-lock.json' .` found an active script tag in nethack-preview.html:9; scripts/build_nethack_preview.mjs:49,54-73 builds, fingerprints and checks it. Other hits were palette/dispatch wording and historical input snapshots. index.html has no reference to it, and the main metafile has no input/output for it. MEASURED `Path('dist/nethack-fieldcraft-preview.js').stat().st_size` gives 2,927,363 bytes. No deletion performed. Shipping/retention policy remains with the preview owner; age alone is not evidence it is safe to drop.

## Test timing (CH4)

MEASURED `npm test -- --test-reporter=tap`: exit 0; 628 tests, 628 pass, zero fail/cancel/skip; Python monotonic wall 171.536741 seconds, Node runner duration 167.651855 seconds. npm's script is `node --test tests/*.test.js` (package.json:8). The appended reporter flag remains after positional paths, so per-file diagnostics use a separate direct Node command with its option first. One additional npm reporter attempt also stayed TAP and did not produce file summaries; it is not used to infer file timing.

MEASURED direct diagnostic command: exit 0; 634 tests passed across 98 file summaries; wall 35.504053 seconds; runner 35.427675 seconds. Slowest files by Node `test:summary.data.duration_ms`:

| Rank | Test file | File seconds | Passed tests |
| --- | --- | ---: | ---: |
| 1 | `cooling_refinement.test.js` | 33.897 | 18 |
| 2 | `agreed_duty_continuation.test.js` | 27.307 | 13 |
| 3 | `cheat_cards.test.js` | 22.919 | 4 |
| 4 | `fa09_routines.test.js` | 19.601 | 17 |
| 5 | `fa11_retort.test.js` | 15.927 | 15 |
| 6 | `fa10_manual.test.js` | 15.689 | 10 |
| 7 | `simulation.test.js` | 14.726 | 28 |
| 8 | `management.test.js` | 14.488 | 19 |
| 9 | `ink_lin_parity.test.js` | 13.995 | 12 |
| 10 | `alloy_equipment.test.js` | 13.275 | 5 |
| 11 | `field_workshop.test.js` | 11.315 | 13 |
| 12 | `observation.test.js` | 10.961 | 7 |

File durations overlap under default parallel execution; they cannot be added for suite wall time. The three full-run samples were 171.54 seconds (initial npm), 87.05 seconds (npm reporter attempt, still TAP) and 35.50 seconds (direct diagnostic). The direct run reported 634 cases, six more than the initial 628, while concurrent workers were active; test bytes were not frozen. Workload/contention varied and there is no controlled comparison, so this is not a speedup claim. Saved `test-file-timings.json` contains all 98 file summaries and exact run figures. Raw TAP names/output stay in scratch space; published evidence uses filenames and numeric counts only.

READ tests/helpers/cheat_game.mjs:8-34 bundles current source in memory, starts an ephemeral HTTP server and headless Chrome at 1366×768; cheat_cards.test.js:38 calls it. Existing browser tests exercise their own instrumented journey, not all native acceptance gates. The helper uses absolute Chrome/Playwright paths, so results depend on this machine's setup. Pure domain tests commonly import the aggregate registry; large shared definition initialization can be charged to each file process. Per-file timing includes setup/import and test execution, not only test callbacks.

## Recommendations ranked by value per effort

| Rank / code | Proposal | Cost once / palette |
| --- | --- | --- |
| 1 / ER2-A1 | Preserve this reproducible composition and file-timing baseline; record entry/chunk bytes alongside future touched builds. | Small script/report maintenance; CH2/CH3/CH4/PF4. |
| 2 / ER2-A2 | Extract one matched panel/settings family with injected callbacks and preserve the main facade. | Moderate regression and desktop journey effort; CH1/RT10. |
| 3 / ER2-A3 | Turn the existing six-lane audit router list into its single manifest owner, reusing current projection helpers. | Moderate cross-lane equivalence checks; RT10/CH2. |
| 4 / ER2-A4 | Prototype catalogue/contract admission and measure real split output/startup before async migration. | Moderate/high async/validation work; CH3/PF4. |
| 5 / ER2-A5 | Separate pure domain checks from explicitly named browser journeys in scripts while retaining a full combined gate. | Small routing/config effort, plus ensuring both run in CI; CH4/TS3. |

No new palette family is needed. Browser parse/compile timing, memory, actual lazy chunks, world-loading failures and all proposed extraction journeys remain OPEN. This audit establishes source structure, current bundle attribution and test timing; it does not claim new playable behavior, release verification or director acceptance.
