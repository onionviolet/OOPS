# Game engine options for YAIRPG, 2026-10-14

## CHECKPOINT

ER5 complete: EG0-EG7 assessed, source areas counted, current primary sources
checked, port estimates and switch gates recorded. Research proposals only.
Owned outputs: this file and [ER5 report](../gm/dispatch/engine-runtime-2026-10-14/ER5/REPORT.md).
No engine installed or built, no runtime/save changes, no browser acceptance.
Resume for a named evidence gap or changed product requirement.

## Recommendation

**ER5-D1: Keep EG0, the DOM/JS game, as the main engine.** Extract RT2 contracts
in JS before changing language. Dense simultaneous panels, text, existing rules,
Ink and portable saves fit this host. The measured source volume makes preserving
those systems more valuable than acquiring an editor. This is an INFERRED fit
judgment, not a measured engine race.

**ER5-D2: Use PixiJS under EG1 for a selected visual panel; trial Tauri 2 under
EG5 when a desktop launch/file-save build is wanted.** These solve different
problems and can coexist. Electron is the fallback if system-WebView differences
block the Tauri gate. Do not add any of them just to rename the stack.

**ER5-D3: Godot with typed GDScript is the best full-engine alternative.** Choose
it for a deliberate scene-centered successor, after one real panel-heavy slice
and save converter pass. Do not port this game to Unity, Defold or full Bevy now.
For a demonstrated CPU bottleneck, prefer a small plain-Rust WASM kernel behind
RT2 to a new engine. Language does not guarantee deterministic rules.

These extend [root palette EG0-EG7](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md)
and [ER3 stack options](TECH_STACK_OPTIONS_2026-10-14.md), especially ER3-T11-T14.
Save/clock semantics remain owned by [E1-E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md)
and [offline/branch-clock audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md).
This report adds engine-specific conversion and switch evidence rather than
repeating their requirement rows. Accepted direction in
[USER_VISION](../USER_VISION.md#standing-ui-priority-2026-10-13) and PROJECT remains
desktop/laptop first, one playable slice at a time; mobile optimization is deferred.
Proposed presentation proof targets 1366×768 and 1600×1100, useful independent
panels and visible routine controls. No presentation outcome is claimed here.

## Evidence and port surface

MEASURED means a command ran here. READ means source inspection. STATED means an
external source's documented claim, checked **2026-10-14**, not independently
tested. INFERRED means fit, estimate or proposed acceptance. The report contains
no head-to-head runtime benchmark. Commands and counting rules are in ER5/REPORT.

| Code | Evidence | What it means for this choice |
| --- | --- | --- |
| ER5-F1 | MEASURED Python census: 459 files, 97,803 physical lines under `src`; 458 JS files, 97,799 JS lines. Blank/comments count. | Root palette's roughly 98k lines is sound; its 417-file count is a different snapshot. Lines are not complexity or port progress. |
| ER5-F2 | READ `package.json:3-22`, `build.js:10-16,23-33`: ESM, Node >=22.13, node:test, esbuild 0.25.10, inkjs 2.4.0, authored Ink check and notices. | A renderer/shell can reuse this pipeline. A native engine needs a second build and proof route. |
| ER5-F3 | READ `src/save_files.js:158-217`, `src/main.js:588-597`: marked UTF-8/legacy decoding, actual-loader import preflight, guarded 4 MiB shared-origin budget and Web Lock writer. | File/engine storage needs an adapter and writer equivalent. Existing browser storage does not move with a packaged app's new origin. |
| ER5-F4 | READ `src/expansion_persistence.js:5-50`, `src/expansion_engine.js:588-640`: copy/validate/write before publication, consumed minutes, remaining time, choice stops and boundary budget. | An async bridge must acknowledge durable commit before publication. A physics frame or ECS schedule is not this causal scheduler. |
| ER5-F5 | READ `src/ink_narrative.js:1-22,61-72`: retained compiled artifacts by content hash, runtime 2.4.0, cursor restore, host-owned rewards/randomness/time. | Preserve artifact identity, cursor and paid host effects. Another narrative runtime is a compatibility change. |
| ER5-F6 | MEASURED Python on existing dirty `dist/bundle.js`: 5,100,591 bytes raw; 1,413,390 bytes gzip level 9, mtime 0. No rebuild. | This is a compression baseline for one working-tree file, not served bytes or total assets. Compare compressed downloads with compressed downloads, not raw JS with Brotli WASM. |

The census uses exclusive filename/path buckets, not a semantic dependency audit.
`_content`, `_facts` and `_ids` files may contain executable logic; the remaining
bucket includes models, adapters and some unrecognized UI. Main contains both
simulation and save/UI glue. HTML, CSS, tests, `stories/` and retained artifacts
outside `src` are excluded. Thus these are budgeting anchors, not a promise that
21k lines transfer unchanged.

| Code / area | MEASURED files / lines | Port consequence, INFERRED |
| --- | --- | --- |
| ER5-C1 Main integration | 1 / 8,579 | Split native time/action/combat glue, save/load and panel wiring regardless of engine. Full ports must re-express it. |
| ER5-C2 UI/presentation | 49 / 10,515 | DOM-to-Control/UXML/GUI recreation for native engines, plus HTML/CSS outside this count. Renderer islands preserve it. `display.js` alone is 6,167 lines. |
| ER5-C3 Data/authored content | 110 / 21,740 | Stable IDs/prose can survive; JS factories, imports, predicates and loader behavior need conversion. Runtime tests still needed. |
| ER5-C4 Remaining domain runtime/adapters | 292 / 56,170 | Largest full-port burden: rules, host bridges, transactions and world consumers. Not just arithmetic or entity movement. |
| ER5-C5 Named save/import seam | 6 / 444 | Small named seam understates conversion: much save/load code lives in C1; domain codecs live in C4. |
| ER5-C6 Ink bridge | 1 / 355 | Keep JS owner in hybrids. `ink_narrative_ui.js` is 141 lines counted in C2. Compiled story assets lie outside census. |

### Rough cost model

All costs below are **INFERRED person-weeks**, not measured productivity, elapsed
calendar time or quotes. Assume an experienced implementer, equivalent selected
behavior, synthetic compatibility fixtures and first target-platform proof.
Full ports assume the roughly **76,063 non-data-bucket lines** need semantic
re-expression, plus conversion/review of C3 and external UI/assets. Their broad
40-160 week ranges correspond to roughly 0.5-2k legacy source lines assessed and
qualified per person-week, with overlapping integration work. This is a planning
heuristic with large uncertainty, not a code-generation throughput target.
Agent count does not divide the estimate: shared schema/build joins and native
acceptance remain serial. A one-world successor dropping most systems is a new
scope and cannot be priced as a completed port. Full release operations, ongoing
content additions and director taste iteration are not included.

| Code / palette | Qualified scope anchored to census | Rough cost, INFERRED |
| --- | --- | --- |
| ER5-P0 / EG0, RT2, CH1 | One pure seam, about 300-1,500 lines extracted from C1/C4; old callers/UI unchanged | 1-4 weeks for one consequential slice, not completion of RT2 across the game |
| ER5-P1 / EG1, EG6 | One read-only visual island touching about 100-500 existing lines in C2/C1, plus new renderer code | 1-3 weeks; authored spatial gameplay needs a separate rules scope |
| ER5-P2 / EG2 | Full Godot port of C1/C2/C4/C5/C6, plus C3 conversion | 40-120 weeks; 3-8 weeks for a narrow vertical comparison only |
| ER5-P3 / EG3 | Equivalent Unity 6 C# port, UI Toolkit recreation and content/save bridge | 50-140 weeks; 4-10 weeks for a narrow comparison |
| ER5-P4 / EG4 | Plain Rust numeric kernel from about 300-2,000 C4 lines; JS UI/save/Ink retained | 3-8 weeks after RT2 extraction; whole C4/main simulation migration about 30-100 weeks |
| ER5-P5 / EG4 | Full Bevy game, including replacement of C2 and C1, rather than just `bevy_ecs` | 60-160 weeks; broad engine/editor/tooling qualification added to semantic port |
| ER5-P6 / EG-New1 | Full Defold Lua port with C2 GUI recreation and C3 conversion | 40-120 weeks; 3-8 weeks for a narrow comparison |
| ER5-P7 / EG5, TS6 | Tauri/Electron host; roughly 200-800 existing integration/save lines touched across C1/C5 plus new host files, C2/C3/C4/C6 reused | Tauri 2-6 weeks, Electron 1-4 weeks for first qualified desktop target and file bridge; multi-OS release adds work |
| ER5-P8 / EG7 | Keep current Ink, no migration | Zero engine-port work; another narrative owner is a separate content/cursor migration, not part of P1/P7 |

## Options against this game

| Code / root | What it actually solves here, INFERRED | What it does not solve | Save/gate continuity and team fit, INFERRED |
| --- | --- | --- | --- |
| ER5-O0 / EG0 | Best dense-panel host; preserves JS rules, Ink, browser reach, keyboard/forms and source-oriented agent edits. RT2/RT3 improve separation without erasing content. | Current cloning/scans/polling, save capacity, clock policy and module coupling still need their own fixes. | Best continuity: same envelope/loader/native gates. One owner per domain; per-lane frozen builds and contract tests. P0 cost. |
| ER5-O1 / EG1 | PixiJS view for Hanzi scene, map, travel or bounded effects; retains useful panels and text beside it. | No causal simulation, save recovery, branch selection or full authoring editor. GPU rendering does not accelerate JSON clones. | Canvas consumes a knowledge-filtered read model; sends commands to existing owner. No renderer state in saves unless an actual new fact needs it. JS tests stay; add lifecycle/input/zoom proof. P1 cost. |
| ER5-O2 / EG2 | Godot scenes, animation/audio, visual editing, themed native UI, desktop exports. Strongest choice for a scene-centered successor. | Does not run 98k JS as GDScript, import DOM/CSS, preserve old saves automatically, or define idle/offline policy. Web remains browser constrained. | Converter and new native presentation harness required. GDScript/scene files can be owned separately; shared scene/theme/project files become joins. Pin editor/export versions; test headless rules and real exported UI separately. P2 cost. |
| ER5-O3 / EG3 | Unity 6 offers scene tooling, profiling and mature native production paths; UI Toolkit can express complex menus. | More editor/runtime than this text sim needs. UI Toolkit is not the existing DOM; IL2CPP/Web build is not a JS rules adapter. It does not solve causal/save design. | C# models/UXML/USS require rewrite, fixture converter and runtime acceptance. Split assemblies/UI documents, preserve `.meta` identity and scene ownership; agents need licensed build/editor infrastructure. P3 cost. Reject now. |
| ER5-O4 / EG4 | Plain Rust-WASM can speed a dense numeric kernel; `bevy_ecs` adds component queries when actor structure warrants them. JS UI/Ink remain. | Rust is not automatic determinism; Bevy schedules do not implement choice stops, exact payments or absent-world policy. Serialization/copy overhead may exceed kernel gain. | Keep durable JSON IDs; ECS entity handles are ephemeral lookup details. One boundary/version owner, independent Rust modules, cargo tests plus differential JS tests. P4 cost. Prefer plain Rust until ECS benefit is demonstrated. |
| ER5-O5 / EG4 full Bevy | Custom all-Rust engine, ECS and renderer if a new spatial simulation demands them. | Neither a dense DOM substitute nor a cheap upgrade of current world adapters. | Full presentation/content conversion, new acceptance route and recurring API migration work. Textual Rust fits agents, but compile/toolchain and shared component changes constrain parallelism. P5 cost. Reject now. |
| ER5-O6 / EG-New1 Defold | Compact cross-platform scene engine, Lua, sprites/tilemaps, GUI editor and fast iteration for a separate 2D game. | Small engine download does not shrink YAIRPG's rules/content or turn GUI nodes into browser panels. JS/Ink integration still needs a host bridge or replacement. | Lua/table codec must preserve stable IDs, empty arrays vs objects, missing fields and saved outcomes. Text assets fit ownership; GUI/collection joins need an owner and Defold build tests. P6 cost. Better greenfield fit than fork migration. |
| ER5-O7 / EG5 Tauri | Native launch/menu/window and capability-scoped file backend; retains all main web game behavior. Preferred first desktop host candidate. | No automatic quota removal while using localStorage, no universal throttle exemption, no closed/sleep accrual, no Steamworks by default. | New app origin starts empty. Import/export is the deliberate bridge; awaited file commit and cross-process single writer required. JS content lanes stay independent; a host owner handles Rust/config/platform QA. P7 cost. |
| ER5-O8 / EG5 Electron | Same Chromium runtime across desktop OSes, JS/Node host ecosystem and narrow native-file bridge. Good fallback when exact browser behavior is decisive. | Bundled browser footprint and update upkeep; default background throttling still applies; physics/offline/save semantics unchanged. | Same envelope, separate origin, isolated preload and acknowledged commit. JS agents need less language change, but packaging/preload are owned joins. P7 cost. |
| ER5-O9 / EG7 | Keep inkjs and retained compiled assets for authored branching prose; storylet eligibility can live in existing rules beside Ink. | Narrative tools do not supply world scheduling, ownership, saves or panels. No verified JS Yarn replacement is proposed here. | Existing hash/revision/cursor contract survives EG0/EG1/EG5 and Rust hybrid. Any replacement needs a paid-choice/cursor converter. P8 cost. |

### Godot 4: UI and language choice

**ER5-G1, STATED:** Current [web export manual](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)
requires WASM/WebGL 2, uses Compatibility rendering, still excludes Godot 4 C#
web exports, and supports default single-thread exports. Thread/extension support
requires cross-origin isolation and web-specific extension builds. The manual
also describes tab-background pause and `user://` web persistence through
IndexedDB. Consequently a Godot web port is not an offline-time or storage-recovery fix.

**ER5-G2, STATED:** [Containers](https://docs.godotengine.org/en/stable/tutorials/ui/gui_containers.html)
provide layout; [ItemList](https://docs.godotengine.org/en/stable/classes/class_itemlist.html)
provides selectable text/icon rows with keyboard search; [RichTextLabel](https://docs.godotengine.org/en/stable/classes/class_richtextlabel.html)
supports formatted text. INFERRED: use HBox/VBox/Grid containers inside panels,
ScrollContainer for long reading regions, Tree for structured rows and
RichTextLabel for prose. This can produce dense UI. It still needs custom row
binding, focus/keyboard paths, resizing, text scale, tooltips and long-list
profiling. Do not substitute a node per log entry for the current polling problem.
Browser selection/copy/search and assistive technology behavior need direct proof.

**ER5-G3, INFERRED:** Prefer typed GDScript for a browser-plus-desktop Godot fork.
C# offers stronger static contracts and ecosystem reuse for a desktop-only target,
but its web limit changes delivery scope; neither language reuses these JS modules.
[Godot C# basics](https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/c_sharp_basics.html)
documents the .NET editor/toolchain requirement. Godot is MIT licensed
([license](https://godotengine.org/license/)); retain engine and upstream notices.

**ER5-G4, INFERRED conversion:** Decode marked and legacy exports through the
existing JS preflight first, preserve an untouched recovery copy, and map validated
JSON into versioned native domain DTOs. Keep string IDs, RNG words, numeric ranges,
job sequence/due state, dormant/retired fields, history and clock units. Check null
vs missing and number coercion; do not serialize Node paths/resources as durable
game identities. Keep an interchange export readable by a pinned legacy build
until an explicit one-way compatibility decision. This is conversion engineering,
not `JSON.parse` followed by `store_var`.

### Unity 6: dense UI, Web size and license

**ER5-U1, STATED:** [UI Toolkit](https://docs.unity3d.com/6000.0/Documentation/Manual/UIElements.html)
uses UXML or C# structure, USS styles, events and binding. INFERRED: a credible
menu-heavy choice, but matching web-like layout syntax does not convert this CSS,
DOM event wiring or panel kit. Use runtime UI documents and bounded/recycled lists;
compare text entry, focus, long prose and multiple simultaneous panes on export.

**ER5-U2, STATED:** Unity's [Web distribution guide](https://docs.unity3d.com/6000.0/Documentation/Manual/webgl-distributionsize-codestripping.html)
documents release compression, stripping engine/managed code and reflection
preservation. INFERRED: large default payload is an additional load cost, not
an immutable size law; qualify a pinned build with the same content. Disabling
exceptions merely for size would need its own error/recovery decision here.

**ER5-U3, STATED:** [Unity pricing updates](https://unity.com/products/pricing-updates)
say the Runtime Fee was canceled for all versions; Pro is required above $200k
annual revenue/funding. [Plans](https://unity.com/products) describe eligibility,
including special client rules for service work. No per-install fee is budgeted.
Seat terms, current paid price and organization eligibility must be rechecked
before adoption; AI workers are not automatically licensed seats or automatically
exempt users. INFERRED: license administration adds friction to a many-agent
workflow, but licensing alone is not the reason to reject Unity. Scope fit is.

### Export footprint evidence

**ER5-Z1, STATED:** The live [Defold product comparison](https://defold.com/product/)
lists empty release/default projects at **0.83 MB Defold, 6.68 MB Godot, 11.73 MB
Unity** for its **HTML5 WASM, Brotli** chart, using Defold 1.13.0, Godot 4.7.1
and Unity 6.5 (6000.5.7f1). Its explanatory text elsewhere says HTML5 is gzip.
This compression-label conflict and vendor authorship mean the figures are
indicative STATED claims, not controlled head-to-head measurements by ER5 or
certification of those releases as our targets. The version labels are what the
page displayed at access, not pinned dependencies. No scene/game data parity.

**ER5-Z2, STATED historical context:** Godot's [May 2024 web report](https://godotengine.org/article/progress-report-web-export-in-4-3/)
gave about 40 MB raw WASM / 5 MB Brotli for 4.3 at that time. This is explicitly
historical, not today's size estimate. Current web docs recommend custom templates
with unused features removed. INFERRED: expect a several-MB compressed engine
baseline before this game's content for Godot/Unity, then measure rather than
promise a fixed total. A JS renderer island has no native engine template baseline.
Do not compare the empty-engine chart to the 5.1 MB raw bundle as if they were
equivalent; ER5-F6's gzip figure also excludes resources and uses another codec.

### Bevy, Rust and Defold specifics

**ER5-B1, STATED:** [Bevy's introduction](https://bevy.org/learn/quick-start/introduction/)
still warns of missing features, sparse docs and breaking API changes around
quarterly releases. [Web examples](https://bevy.org/learn/) establish a browser
target exists, not suitability for this game. [bevy_ecs](https://docs.rs/bevy_ecs/latest/bevy_ecs/)
is separately usable; there is no need to pull in Bevy rendering for a DOM UI.
INFERRED: pin versions, keep ECS private behind domain commands and use serialized
stable IDs. Adopt it only if component queries/scheduling beat a simpler store on
the selected workload. Plain Rust has fewer migration surfaces for one kernel.

**ER5-B2, STATED:** [wasm-bindgen's Serde bridge](https://rustwasm.github.io/docs/wasm-bindgen/reference/arbitrary-data-with-serde.html)
supports structured Rust/JS interchange. INFERRED: choose an explicit DTO schema;
matching field names is insufficient for absent/null, map order, safe integer
ranges and f64 arithmetic. Keep seeded RNG algorithm and call order explicit.
Parallel ECS execution or changed reductions can change outcomes despite a seed.
Profile conversion, WASM initialization and worker copies together with the step.

**ER5-DF1, STATED:** Defold documents [HTML5 export](https://defold.com/manuals/html5/)
and [GUI nodes/scripts](https://defold.com/manuals/gui/). Its
[license](https://defold.com/license/) is a modified Apache-derived source-available
license, not stock Apache/MIT; it permits game development/distribution but
restricts commercializing the engine/editor itself. INFERRED: Lua plus compact
exports suit sprite games, not an inexpensive conversion of this JS life sim.
Keeping DOM outside Defold canvas is possible as a web-only hybrid, but adds a
cross-language bridge where PixiJS needs none. Reject that bridge for this slice.

## Which JS visual library

All four keep the browser host and Ink. Fit/gate/cost judgments are INFERRED;
documented roles are STATED with sources below. Each uses P1 for one island, not
for porting native combat or adding spatial rules.

| Code / EG1, EG6 | Documented role | Choose here when | Boundary and agent workflow |
| --- | --- | --- | --- |
| ER5-J1 PixiJS | [2D renderer](https://pixijs.com/8.x/guides/getting-started/intro), not a full game engine | Default choice for knowledge-filtered map/glyph scene, animation or effects around existing play | One island owner, retained DOM controls; renderer only projects facts, events issue host commands; destroy GPU resources/listeners on unmount |
| ER5-J2 Phaser | [JS/TS web game framework](https://docs.phaser.io/phaser/getting-started/what-is-phaser), scenes, input, audio and 2D game facilities | A subview needs independent scene assets, camera/input/animation and actual spatial play | Keep its loop local to presentation/spatial subview; do not let scene timers settle idle jobs; additive scene modules with one boot/config owner |
| ER5-J3 Excalibur | [HTML/CSS UI integration](https://excaliburjs.com/docs/ui/) and [engine events](https://excaliburjs.com/docs/engine/), actors/scenes | A small typed 2D game slice benefits from actor/collision/action abstractions | DOM panels remain outside canvas. Bind commands, never create a second money/inventory owner; engine typing does not type legacy domains |
| ER5-J4 KAPLAY | [Scenes, objects, components, events](https://kaplayjs.com/docs/guides/starting/) with simple scene changes | A disposable playable visual experiment needs quick composition | Good small prototypes; enforce adapter IDs and teardown before production. Avoid global scene transitions that reset the host life; shared scene registry gets one owner |

There is no reason to install all four. PixiJS supplies the missing renderer with
the least overlap in responsibility. Phaser is the next choice if authored spatial
gameplay, rather than a visual projection, becomes the selected slice.

## Desktop shells and a Godot/WebView hybrid

**ER5-H1, STATED:** [Tauri architecture](https://v2.tauri.app/concept/architecture/)
and [WebView versions](https://v2.tauri.app/reference/webview-versions/) describe a
Rust host and system WebViews: WebKit on macOS, WebView2 on Windows, WebKitGTK on
Linux. [File plugin](https://v2.tauri.app/plugin/file-system/) is capability scoped.
INFERRED: best first candidate for compact local desktop delivery, with real
WebView QA for CSS, Ink, import iframe/preflight, Web Locks and actual origin.

**ER5-H2, STATED:** [Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model)
describes Chromium/Node and preload/renderer separation. [BrowserWindow](https://www.electronjs.org/docs/latest/api/browser-window)
defaults backgroundThrottling to true; disabling it changes hidden rendering and
power use. [Tauri config](https://v2.tauri.app/reference/config/#backgroundthrottling)
documents platform limits for its throttle option. INFERRED: neither host supplies
closed-app/sleep progression. Use the clock owner, not a keep-awake promise.
The shell only escapes origin quota after saves use native files; browser saves
and the application's 4 MiB guard still need an explicit adapter decision.
Steam launch/overlay/cloud remain ER3-N4 release work, not a free engine feature.

**ER5-H3, INFERRED Godot-over-WebView route:** Let a Godot desktop shell own only
window/visual scenes while the web game owns commands, Ink and saves. Exchange
versioned knowledge-filtered messages; only one side advances each gameplay domain.
This could preserve C1-C6 instead of porting them, but it buys two host lifecycles,
input/focus layers and dependency builds. There is no inspected first-party
drop-in desktop WebView proved on this Mac. The community
[gdCEF repository](https://github.com/Lecrapouille/gdcef) describes Godot 4.2+
Windows/Linux support and asks for macOS contributors. It is not evidence of
working Mac support. Godot's custom HTML web-export shell is the opposite
direction, DOM surrounding a canvas; it is not a native desktop WebView.
Prefer Tauri/Electron for wrapping this game. Revisit Godot-over-WebView only when
an actual Godot scene requirement justifies the second engine and a pinned Mac
plugin passes local packaging, input and file gates. Estimate 4-12 person-weeks
for a qualified supported-host hybrid, INFERRED; unsupported Mac port work is
unbounded here and excluded from that range.

## Hybrid migration path and switch evidence

The path below is a proposal for a selected hotspot, not adoption authorization.
It extends RT2/RT5/RT9/TS4/TS7 and retains existing E/clock contracts.

| Code | Bounded next stage, INFERRED | Evidence required to advance |
| --- | --- | --- |
| ER5-M1 | Define JS reference `step(input, minutes, rng) -> plan` for one domain. Input includes schema/content revision, actor/world IDs and expected sequence. Output includes state, events, consumed/unspent minutes, RNG and stop reason; no DOM/storage/timers. | A consequential existing slice gives equal split/jump results, stops before a blocking choice and preserves failed-write rollback. Native engine's 512-boundary budget is not discarded. Keep browser play authoritative. |
| ER5-M2 | First compare corrected JS data structures and a module worker. Keep state resident where useful; send commands/projections rather than an entire growing envelope per frame. | Profile fresh/developed/crowded synthetic workloads on named desktop hardware. Attribute time to kernel, cloning, rendering and persistence. Use ER1/ER7 outputs when present rather than treating their synthetic numbers as a whole-game profile. |
| ER5-M3 | Implement one plain Rust-WASM alternate with wasm-bindgen. Return the same plan; JS publisher retains persistence/Ink/native ownership. Keep JS reference and feature switch. | Differential command traces and RNG/state/event equality including cancellation, rejected commands, partial catch-up and reload. Serialize only agreed schema; no ECS handles in saves. Measure initialization, encode/decode/copy plus computation. |
| ER5-M4 | Move the alternate to a worker if responsiveness warrants it, then route selected commands to it. One writer validates sequence/revision and rejects stale responses; durable write precedes live publication. | A proposed switch bar: kernel accounts for >50% of an offending workload, WASM reduces total elapsed cost by >=2× or returns input p95 below 100 ms with no routine >50 ms task, and semantic equality holds. These thresholds are INFERRED decision bars, not achieved results. Faster arithmetic alone fails. |
| ER5-M5 | Expand only when the first playable/save-compatible slice passes; retain fallback build and unchanged interchange save until an explicit schema decision. | Rebuilt fresh-origin desktop action plus Save/reload/Export/literal-file Import; corruption/failure/interruption and single-writer checks. Newly packaged host also needs its own OS launch/minimize/resume/reopen proof. Human fiction/balance/layout acceptance remains distinct. |

| Code / switch | Evidence that would justify it, INFERRED | Evidence that would not |
| --- | --- | --- |
| ER5-S1 / EG1 PixiJS | Selected scene is clearer or more playable beside independent panels at target desktop sizes; unchanged native command/save outcomes; mount cycles release resources and effects obey settings | Animation demo, FPS counter or replacing text with canvas alone |
| ER5-S2 / EG5 Tauri, Electron fallback | User wants desktop delivery; pinned host preserves panel/input/import behavior and file recovery on target OS. Switch to Electron if a reproducible system-WebView defect blocks those gates while Chromium passes | “No quota/no throttling” slogan, page-load screenshot or installer creation alone |
| ER5-S3 / EG4 Rust | M1-M4 show end-to-end speed/responsiveness benefit on a dominant pure workload, with differential equality and stable saves | Rust benchmarks unrelated to YAIRPG, source-line count or promise that WASM is faster |
| ER5-S4 / EG2 Godot | User selects scene-centered play/native authoring need; Godot vertical slice measurably improves authoring/play without losing simultaneous text panels; old/current fixture conversion and actual exports pass | Desire for a “proper engine,” editor screenshot, empty export or a narrow prototype presented as full-port completion |
| ER5-S5 / EG3 Unity, EG-New1 Defold, full Bevy | New scope requires a specific engine-native capability unavailable through the chosen hybrid; same slice wins against Godot/web on delivery and workflow, with conversion cost accepted | Brand familiarity, tiny empty build, huge sprite count or clean ECS example |

## Ranked value per effort

1. **ER5-A1 / EG0, RT2, RT3, CH1, CH5:** Preserve JS/DOM and qualify one pure
   consequential boundary. P0 owns cost; ER3 contract/build-isolation work supports
   it. This enables workers or Rust later without forcing either today.
2. **ER5-A2 / EG1, EG6, PF5:** Pick PixiJS only for a named visual slice. P1 owns
   cost; retain text panels and host rules. Phaser is a spatial-game alternative.
3. **ER5-A3 / EG5, TS6, DA7, OS12:** When desktop delivery is requested, start
   Tauri with unchanged envelope and acknowledged file publication. P7 owns cost;
   choose Electron only on a concrete WebView/Chromium compatibility result.
4. **ER5-A4 / EG4, RT2, RT9, TS7, PF1:** Hold Rust adoption to M1-M4. P4 owns
   cost; no full Bevy dependency for a single numeric kernel.
5. **ER5-A5 / EG2, EG3, EG-New1:** Keep Godot as the full-engine successor
   candidate; decline a current whole-game port. P2/P3/P5/P6 own cost. A selected
   future engine changes deployment/presentation, not standing world/food/clock
   direction or acceptance status.

ER5-New1 extends the palette with **Defold as a compact scene-engine alternative**.
ER5-New2 adds **engine interchange and differential qualification**: portable
domain DTOs, stable identities, retained opaque narrative cursors, original
recovery copies and one publisher. These inform DA4, RT2/RT9 and CH5, and are
not evidence that any migration has occurred.

OPEN: actual engine/shell export bytes/startup/memory on target hardware; full
semantic dependency inventory; selected pure hotspot and serialization cost;
native save converters; OS file-commit failure recovery; Mac Godot-WebView plugin
qualification; rebuilt desktop gameplay and human acceptance. Existing Foundation
native gates remain open with their owners. Documentation completion closes none
of those gates.
