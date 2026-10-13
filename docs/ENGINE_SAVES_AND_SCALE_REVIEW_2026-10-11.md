# Engine, saves and scale review

2026-10-11. Proposed engineering requirements in response to Weibao's request
to consider engine concerns, save management, performance and related issues.
This is a bounded source review, not an implementation order or gameplay proof.
No private saves were opened. Existing dirty work remains with its owners.

## Current evidence

- `src/save_files.js` validates envelopes and supported versions, preflights
  imports before writing, supports marked UTF-8 exports and guards a 4 MiB
  shared-origin storage budget. This budget includes other keys and backups;
  it is a conservative application guard, not a promise of browser capacity.
- `src/main.js` uses a Web Lock for one save writer per live/dev key. Its shared
  storage adapter stages life/NPC observations before guarded publication.
  Autosave is configured for 60 seconds and backup for 3600 seconds through
  tick counters. These are source settings, not newly timed browser evidence.
- `src/save_compatibility.js` retains retired data. Optional pack compatibility
  and random-start recovery still need their selected content-specific policy;
  see the existing engine planning report linked below.
- `src/expansion_engine.js` stops after 512 causal boundaries and returns
  unspent time. Expansion/simulation random state is saved, while native
  `main.js` still has `Math.random` consumers. Whole-game deterministic replay
  is therefore not established.
- Historical measurements in `PLAYTEST.md` report a 64-helper tick around
  129 ms and crowded command-start p95 of 115.4 ms after bounded optimizations.
  These are prior synthetic results, not current benchmarks or sustained
  frame-rate proof. Source size, actor count and passing tests alone cannot
  establish long-campaign performance.

## Proposed requirements and acceptance

| ID | Concern | Proposed behavior | Observable gate |
|---|---|---|---|
| E1 | Save identity and versions | Separate profile/run/world-instance IDs; pin content revision and per-domain schema. Store progress and consequential generated truths, with the content revision needed to interpret them. Do not reinterpret an old run through changed definitions. | Old, current, future-version, missing-pack and changed-pack fixtures; no invented rewards or rerolled start. |
| E2 | Recovery and save slots | Offer named runs, last successful save time, explicit file export/import and a small recovery history. Include all slots in the capacity budget. Preserve the last good save when writes fail; preserve a pre-migration recovery copy through an explicit strategy. | Full storage, failed write, interrupted migration, corrupt primary, invalid import and two-tab cases; surviving records load exactly. |
| E3 | One consequential transaction | Resource spending, job reservations, completion receipts, discoveries and RNG changes publish together. Define rollback versus unsaved live progress for each native path; a guarded storage write alone does not prove every action rolls back. | Fail writes at command start, cancellation and settlement; no paid-without-result or duplicate reward after reload. |
| E4 | Bounded history | Classify current state, durable gameplay evidence and disposable presentation logs. Preserve exact history used by inheritance, obligations, discovery or history-aware powers. Compact only under a declared semantic retention contract. | Long synthetic campaign remains within measured limits; every history-dependent command gives the same result before/after compaction and roundtrip. |
| E5 | Simulation workload | Schedule due work and affected actors instead of repeatedly scanning all content. Use explicit active/supported/dormant-world rules. Chunk catch-up with retained remaining time and causal order. Aggregate only where outcomes are equivalent. | Split and single advances agree; cancellation/reload mid-catch-up neither loses elapsed time nor repeats payment. Profile busy actors, many instances and interacting jobs. |
| E6 | Rendering and storage cost | Measure planning, cloning, validation, serialization, writing and rendering separately. Cache pure projections using actual dependencies; update changed rows. Add workers or a different storage backend only for a measured bottleneck. | Current fresh/medium/long-run workloads record input p95, long tasks, tick/catch-up cost, load/import time, save bytes and retained memory. |
| E7 | Clocks and randomness | State each system's played/presence/offline policy. Persist relevant random streams and already-resolved outcomes for random entry, rewind and reproducible consequences. No global offline rule is selected here. | Clock jumps, absence, repeated previews, reload and rewind exercise their declared policy; viewing does not advance RNG or reveal hidden state. |
| E8 | State ownership and integration | Stable IDs and one authoritative owner for money, item copies/custody, bodies, jobs, claims and world facts. Cross-world movement uses an explicit carrier/transaction. Declare schema/content dependencies before parallel integration. | Combined build rejects incompatible definitions; transfer, interruption and migration preserve identity and conservation across owners. |
| E9 | Hidden information and diagnostics | Render actor-qualified observations. Keep diagnostic fixtures synthetic and spoiler-safe; a raw save may contain hidden truth and is not a player-facing journal. Local sealed files are not claimed to be cryptographically secret. | Menus, errors, exports offered as readable summaries and public reports do not disclose sealed truths; knowledge routes remain usable. |
| E10 | Long-session reliability | Check repeated panel opens, world travel and task cycles for listener/timer/cache growth. Expose actionable save failures and distinguish simulated progress from persisted progress. | Extended fresh-origin run, background/resume, reload/import and keyboard/narrow-layout checks; measure growth rather than asserting leak freedom. |

## Suggested sequence

1. **A1: Persistence contract.** Map write paths and inventory domain/content
   versions, recovery policy, history consumers and missing-pack behavior.
   Start with synthetic fixtures; never use Weibao's personal saves as stress data.
2. **A2: Representative baseline.** Profile a fresh character, a developed
   campaign and a deliberately crowded long-history run on the current rebuilt
   bundle. Proposed initial UX targets: ordinary input p95 below 100 ms and no
   routine work blocking the main thread for over 50 ms. These are review targets,
   not achieved results; select the target device and workload before acceptance.
3. **A3: Fix the measured bottleneck.** Prioritize duplicate planning, whole-state
   cloning/scans and repeated rendering if the profile confirms them. A worker or
   IndexedDB migration needs evidence and its own failure/recovery contract.
4. **A4: Integrated acceptance.** Exercise the selected connected gameplay slice
   after rebuilding on a fresh test origin, including old-save fixtures,
   save/reload/import, failure injection and interrupted catch-up. Keep director
   fiction/balance acceptance separate.

No gameplay, storage backend, schema, build, commit or deployment changed in this
review. All new gates above are specified, not run.

## Related owners

- [Project decisions](../PROJECT.md)
- [Engine architecture and delivery history](ENGINE_EXPANSION.md)
- [Existing engine join review](gm/dispatch/idea-expansion-2026-10-11/engine/REPORT.md)
- [Historical performance and browser evidence](PLAYTEST.md)

## Technology and architecture follow-up

Weibao asked about engine-level choices such as language. Current source uses
JavaScript ES modules, direct browser DOM UI, esbuild targeting ES2022, Node's
test runner and an existing Ink/inkjs pipeline. `main.js` has 8,041 lines and
`display.js` 5,903 at this inspection; size is a navigation/coupling warning,
not proof that these files are slow. The inspected build does not configure a
TypeScript check. New technology choices below remain proposals.

**T1 recommendation: retain the browser delivery path and introduce stronger
contracts incrementally.** Start with typed command, state, effect and save
boundaries using JSDoc/type checking, or TypeScript in selected new/extracted
modules. TypeScript checks code before execution; it is not a runtime speed
upgrade and cannot replace runtime validation of imported saves. `checkJs`
can check existing JavaScript without converting every file. See the
[TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
and [checkJs reference](https://www.typescriptlang.org/tsconfig/checkJs.html).
No language rewrite or tool installation is selected by this recommendation.

| ID | Engine-level choice | Recommendation for this project | Trigger / acceptance |
|---|---|---|---|
| T2 | Engine boundaries | Separate simulation rules, command execution, persistence, authored definitions and actor-qualified UI projections. Extend the existing plan/save/publish seam rather than adding another state owner. Extract a touched behavior with equivalence evidence. | Same synthetic command sequence and roundtrip produce the same state; core scenario can run without the DOM. |
| T3 | Data representation | Use stable instance IDs and explicit domain records. Consider component-style records for genuinely shared actor capabilities; keep world-specific rules local. Do not mandate a full ECS rewrite. | Two materially different bodies/NPCs exercise the proposed shared representation; independent instances cannot alias mutable state. |
| T4 | Authoring language | Keep ordinary world content declarative with validated references, requirements and supported effects; use the existing Ink path for fitting branching scenes. New mechanics get an engine handler plus an actual consumer. Avoid arbitrary scripts for every content row. | Definition lint catches invalid IDs, impossible dependencies and schema mismatches; one playable route proves each new operation. |
| T5 | Concurrency | If profiles justify it, run DOM-independent heavy simulation in a Web Worker. Specify command sequence IDs, cancellation, stale-response rejection, snapshot/patch versioning and one authority. Measure message/copy cost too. | Slow simulation leaves controls responsive; interrupted/stale results cannot overwrite newer state; outcomes match single-thread execution. |
| T6 | Native/Wasm core | Keep Rust/C++/Wasm as a possible measured-hotspot option. A new language adds integration, serialization, tooling and dual-implementation costs; first isolate the expensive algorithm and baseline it. | End-to-end improvement on the chosen workload, including bridge costs, with identical gameplay/save semantics. |
| T7 | Rendering engine | Direct DOM remains a reasonable proposed default for the current text/menu RPG. Select Canvas/WebGL or a scene engine only for an actual spatial/animation requirement. Replacing the whole app with Godot/Unity would be a product/platform decision with porting costs. | A selected interaction needs capabilities the current UI cannot reasonably provide; prototype preserves usability and save portability. |
| T8 | Numerical rules | State units, supported ranges and rounding for currency, XP, time and probabilities. Use integer subunits where exact accounting matters; select a large-number representation only if progression actually exceeds current numeric limits. | Conservation, boundary/overflow and migration fixtures; calculations remain consistent across reload and catch-up. |
| T9 | Content lifecycle and build | Record engine/pack compatibility, dependencies and revisions; validate packs before activation. Assess lazy loading if initial bundle/pack cost is measured as a problem. Add static checks to the build separately from bundling. | Public build excludes private content; missing/incompatible packs recover deliberately; clean build and selected type/content checks pass. |
| T10 | Engineering evidence | Keep headless scenario tests, invariant/property checks where useful, save fixtures and rebuilt browser journeys. Add spoiler-safe command/cause traces and phase timings to diagnose one failed run. Test actual invariants rather than duplicating implementation. | Reproduce failed synthetic scenario from recorded inputs; conservation, ordering, identity, knowledge and persistence gates agree. |

Web Workers execute separately and communicate by messages; they cannot directly
manipulate the page DOM. This motivates T5's separation and messaging contract,
not a claim that worker migration will improve this game's current workload.
See [MDN's worker guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

The highest-value proposed next engineering slice is a typed, DOM-independent
command/state boundary for one existing consequential operation, with unchanged
save meaning and a representative profile. Architecture work should support a
playable slice rather than become an indefinite rewrite. This follow-up changed
documentation only; no compiler, engine, dependency or runtime check was run.

## Godot, Rust and platform decision

Follow-up source check, 2026-10-11. Godot is an engine; Rust is a language.
Presentation engine, simulation implementation and deployment target are separate
choices. Rust may accompany either a browser interface or Godot.

| ID | Candidate | Project-specific fit assessment | Cost to qualify |
|---|---|---|---|
| O1 | Existing browser UI + gradually typed JS/TS | Leading proposal while dense menus, text, portable saves and inherited content remain the primary interaction. | Type/content checking and extraction of touched simulation boundaries; no whole-game port. |
| O2 | Browser UI + Rust/Wasm simulation | Candidate for an isolated, demonstrably CPU-heavy scheduler or simulation kernel. `wasm-bindgen` connects Rust/Wasm and JavaScript, including generated TypeScript bindings. | Port the chosen kernel, verify semantic equivalence and benchmark end-to-end including serialization/message overhead. |
| O3 | Godot + typed GDScript | Candidate if visual scenes, animated maps and native game presentation become central. Godot has themed Control-node UI; menu-heavy play is possible. | Rebuild existing DOM UI/adapters; prove text/layout/input behavior, pack workflow, platform exports and old-save conversion. |
| O4 | Godot + Rust core | Candidate when both scene/editor benefits and a measured heavy simulation justify two technologies. Community godot-rust bindings integrate via GDExtension. | All O3 gates plus binding/build/version compatibility on each target; do not presume desktop extension success proves web support. |
| O5 | Rust + Bevy | Candidate for a deliberate custom Rust/ECS game-engine direction. Lower priority for this existing browser fork. | Significant UI/content/runtime port plus ecosystem migration cost. Bevy's own current guide warns of missing features and breaking API releases. |

The fit rankings are engineering judgments, not measured head-to-head results.
Godot would not automatically implement our world clocks, custody, discovery,
save migrations or offline policies. A Rust port would not automatically fix
repeated whole-state scans or rendering work. Preserve those contracts whichever
technology is selected.

Five decision axes:

1. **C1 Player experience and delivery:** dense browser panels versus a scene-led
   native game; keyboard/text scaling, narrow screens and distribution targets.
2. **C2 Actual workload:** active actors, simulated event boundaries, history,
   concurrent worlds and acceptable catch-up time. Entity count alone is not a
   useful benchmark. Keep dormant simulation data independent of visual nodes.
3. **C3 Content workflow:** time to author, validate, revise and privately load a
   world without engine edits; preserve world-local rules and sealed projection.
4. **C4 Compatibility and portability:** old-save recovery, content revisions,
   deterministic ordering/randomness, numeric semantics and per-target storage.
5. **C5 Total maintenance:** port effort, iteration/build time, debugging across
   language boundaries, dependency upgrades and ongoing upstream absorption.

Godot web-export constraints matter if browser delivery remains required:
current stable docs require Wasm/WebGL2, say Godot 4 C# projects cannot export
to web, and document cross-origin isolation requirements for threaded/extension
exports. Web filesystem persistence uses IndexedDB and requires explicit checks;
background tab behavior still needs catch-up design. These are browser-platform
gates, not arguments against native Godot delivery.

Before a migration decision, qualify one disposable comparison slice: inventory
and dense journal UI, one timed consequential job, a save roundtrip and a busy
synthetic workload. Measure input latency, catch-up, startup/export size, storage
failure recovery and implementation effort. Use the same scenario and invariants
for candidates. No comparison prototype, installation or migration is dispatched
by this review.

Primary sources checked:

- [Godot web export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html)
- [Typed GDScript](https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/static_typing.html)
- [Godot UI themes](https://docs.godotengine.org/en/stable/tutorials/ui/gui_skinning.html)
- [godot-rust introduction](https://godot-rust.github.io/book/)
- [wasm-bindgen guide](https://wasm-bindgen.github.io/wasm-bindgen/)
- [Bevy introduction and stability warning](https://bevy.org/learn/quick-start/introduction/)

The older Rust/Wasm book was also inspected and labels itself unmaintained;
it is not used as current tooling guidance here.

## Transferable desktop/mobile app direction

Weibao wants the option to transfer to an app-based game easily. Treat this as
an architectural requirement proposal covering both desktop and mobile, not
authorization to install frameworks, port gameplay or distribute an app.

**P1 recommended shape:** one portable game core and content model, the existing
web UI, and replaceable platform adapters. The core accepts commands and elapsed
simulation time and returns state/effects and actor-qualified views. It does not
open files, call DOM APIs, own timers or display native dialogs. Persistence
commit/publication belongs to one application coordinator. Existing extracted
expansion/simulation modules and injected persistence storage are useful seams;
the native `main.js` integration still needs qualification. No full separation
is claimed by this review.

Proposed package boundaries, not currently created folders:

```text
game-core       rules, state, commands, clocks, randomness, migrations
game-content    validated definitions, revisions, assets, private pack contract
game-ui         existing panels, touch/keyboard actions, qualified projections
platform        save repository, files/share, lifecycle, audio, app capabilities
app-host        browser, desktop shell, mobile shell
```

**P2 packaging candidates:** Tauri can reuse HTML/JS/CSS on desktop/mobile and
offers native integrations, including Rust. Capacitor can add iOS/Android hosts
to an existing web app. Electron is a desktop alternative using Chromium/Node.
Tauri uses system webviews, so rendering/runtime equivalence across hosts must
be tested. My project-specific recommendation is to qualify Tauri for a desktop
spike and compare Capacitor/Tauri for mobile once plugin and lifecycle needs are
known. No need to rewrite the simulation in Rust merely because Tauri uses Rust.
A web frontend calling native Rust and a browser frontend calling Rust/Wasm
require different platform bridges even if they share a core Rust crate.

Godot remains an alternative when a visual scene/editor becomes a primary
requirement. Reusing this browser app inside a native web host is a different,
likely smaller task than porting the existing UI and adapters into Godot. This
is an effort assessment, not a measured port-time estimate.

### Small details that determine portability

| ID | Detail | Proposed contract / check |
|---|---|---|
| L1 | Complete packaged assets | Build a self-contained web asset root with `index.html`, CSS, images, compiled story and bundle. Existing root HTML plus separate `dist` bundle is not yet a complete qualified app asset layout. No localhost server dependency in an installed app. |
| L2 | Paths and identifiers | Relative packaged asset URLs, case-sensitive path checks, stable app/profile IDs, explicit private-pack installation paths; no hard-coded personal machine path. |
| L3 | Save backend | Async-capable repository interface with commit success/failure, serialized operations and revision checks. Browser IndexedDB/native file or database implementations must preserve the same transaction meaning. Current synchronous storage injection is groundwork, not a drop-in async migration. |
| L4 | Browser-to-app transfer | Explicit validated import/export of the same versioned envelope. The app does not automatically inherit a browser origin's localStorage. Unicode names and file-picker cancellation remain safe. |
| L5 | Process death | Save consequential transitions and periodic progress; checkpoint on lifecycle events when possible, but do not depend on an exit callback. Force-kill/relaunch synthetic tests establish the actual recovery point. |
| L6 | Suspend/resume | No assumed continuous timer execution. Reconcile elapsed time once under each world's policy; timezone/DST changes, clock rollback and repeated resume cannot duplicate progress. Define separate session-monotonic and cross-session time handling. |
| L7 | Touch affordances | Tooltips have a tap/focus route, targets are usable, long-press/drag/hover have alternatives, and scrolling does not trigger spending. Test touch on actual target devices. |
| L8 | Layout | Narrow portrait, landscape, desktop resize, safe-area insets, on-screen keyboard, larger text, long translated strings and retained scroll/focus after refresh. |
| L9 | Navigation | Android/system Back first closes an overlay or moves within the UI. Escape, keyboard focus and controller input map to explicit actions; closing a window differs from ending a run. |
| L10 | File/share dialogs | Canceled import/export does not reset progress. Display confirmation only after a durable write/export result. Browser download, native save dialog and mobile share sheet use separate adapters. |
| L11 | Power/thermal cost | Stop unnecessary rendering/polling in the background, avoid perpetual frame loops for idle menus and batch bounded catch-up. Measure on a phone, not just a desktop synthetic test. |
| L12 | Audio/haptics | Independent controls, interruption/resume behavior and capability fallback. Game rules never depend on audio or vibration availability. |
| L13 | Offline installation | First launch, cold launch without network and missing optional packs work under declared recovery rules. Updates preserve app data and validate engine/pack compatibility before activation. |
| L14 | Multi-window/save ownership | Define one writer per profile across app windows/processes. Web Locks availability is a capability to qualify, not a universal assumption. Never silently allow two competing save writers. |
| L15 | App identity and release | Stable application identifier, icons, version/build labels, license notices, platform signing and reproducible asset manifest. Data schema version is separate from display/release version. |
| L16 | Native bridge | Expose bounded operations such as save/load/import rather than arbitrary filesystem/shell access. Validate messages and pack content; hidden authored truth stays outside UI projections. |
| L17 | Optional sync | Local saves work independently. If sync is later selected, use revision/ancestry-aware conflict handling and preserve both divergent runs; do not blindly choose the newest timestamp. No account/cloud dependency is selected now. |

**P3 acceptance:** a disposable app host loads one rebuilt connected slice,
performs consequential work, saves, is force-closed/reopened, and imports a
browser-generated synthetic save with identical state. Then qualify offline
launch, interrupted writes, touch/layout, suspend/resume and target-platform
storage/runtime capabilities. Packaging success alone is not portable gameplay.

Sources checked:

- [Tauri overview](https://v2.tauri.app/start/)
- [Tauri webview versions](https://v2.tauri.app/reference/webview-versions/)
- [Capacitor existing-app setup](https://capacitorjs.com/docs/getting-started)
- [Capacitor lifecycle API](https://capacitorjs.com/docs/apis/app)
- [Electron process model](https://www.electronjs.org/docs/latest/tutorial/process-model)

Documentation only. No host created, dependency installed, native build run,
save migrated or app published. These details remain proposed acceptance work.
