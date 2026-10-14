# Own-engine kernel from current code, 2026-10-14

## CHECKPOINT

ER12 complete as a READ audit and INFERRED design proposal. A focused current-source baseline passed 43 tests. No extraction, new API, manifest loader, save migration, build or native journey was implemented. Resume from this file and [ER12 report](../gm/dispatch/engine-runtime-2026-10-14/ER12/REPORT.md), checking live source and sibling lane reports first. Only these two documents are owned by ER12.

**ER12-D1:** Extract a small JS kernel around the existing plan/scheduler/publication seam. Keep DOM, native constructors, world rules and Ink content in adapters. The first deliverable should be one existing system using that seam with unchanged saves, not a general-purpose engine.

Authority: [COMMON](../gm/dispatch/engine-runtime-2026-10-14/COMMON.md), [root OE1-OE10 and SB1-SB10](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#l-building-our-own-engine-oe-round-4), [E1-E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md), [offline audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md), and PROJECT.md's standing priorities. This changes no accepted game direction: one playable slice, desktop/laptop first, mobile work deferred, canon-world priority retained. A later extraction's visible outcome is identical commands, costs, time stops and restored state at 1366×768. No new presentation or offline behavior is claimed here.

Builds on [ER1 hotspots](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md), [ER2 structure](CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md) and [ER3 stack](TECH_STACK_OPTIONS_2026-10-14.md). Their measurements are theirs; ER12 did not rerun their bundle census or performance probes. READ below means inspected current file:line. INFERRED includes every proposed signature, manifest and extraction step. Examples contain public system structure, no sealed truth. No `SECRETS*`, personal save or private pack was opened.

## Existing parts and smallest boundaries

Each row states current code, the missing seam, proposed signatures and the first owner to move. An API here is a proposal, not an export that already exists. Keep legacy facades until all their callers move.

| Code / palette | READ: already exists | INFERRED: missing seam, smallest API and first move |
| --- | --- | --- |
| ER12-K1 / OE1, RT1, RT6 | `src/expansion_engine.js:588-640` clones a plan, visits causal boundaries, stops for life/session/choices and returns unspent minutes after 512 boundaries. `src/simulation.js:456-465` exposes next-boundary and settlement functions. `src/main.js:1234-1255` drains budgets synchronously and advances native calendar/effects by consumed minutes. | No DOM-free scheduler independent of named worlds, nor a browser yield budget. `advance(plan, registry, minutes, hooks, {maxBoundaries}) -> AdvanceResult`; `nextBoundary(plan, hooks) -> minute`; `blocked(plan, hooks) -> StopReason|null`. First move the loop from expansion_engine, preserving its exact ordered hooks and existing simulation executors. Yielding comes later, with retained remainder and one writer. |
| ER12-K2 / OE1, RT5, E3 | `src/expansion_engine.js:536-559` and `src/simulation.js:242` plan guarded commands; they use saved sequence and frozen commitments. `src/audit_remainder_host.js:31-43` already routes commands to local executors. | No single dispatch contract across native and expansion requests. `preview(frame, command) -> Quote`; `planCommand(frame, command, expected) -> Plan`; `dispatch(command, expected) -> CommitResult`. First move router admission, not domain command implementations. Quote is advisory; execution rebuilds context and checks sequence, clock and owner revisions. |
| ER12-K3 / OE1, RT9 | `src/expansion_engine.js:73-79,517-521` retains xorshift state; `src/simulation.js:38-39,51,69` derives simulation seed and per-event streams by ID. `src/expansion_engine.js:278-284` validates frozen roll receipts. Native combat still uses `Math.random` at `src/models/combat.js:160,323,351,377`. | No shared stream API and no whole-game determinism. `drawXorShift32(savedUint32) -> {next, value}`; `deriveSeed(seed, authoredId) -> uint32`; later `drawStream(plan, streamRef) -> value`. First move pure math from expansion_engine/simulation without changing any field, seed derivation or draw order. Native combat conversion needs its own compatibility decision and native proof; do not reseed old jobs. |
| ER12-K4 / OE1, OE5, E3 | `src/expansion_persistence.js:5-50` copies the envelope, stages money/gameplay/ownership/calendar/effects/native patches, validates, writes, then returns committed bytes. Caller publishes afterward. `src/save_files.js:185-191,209-216` preflights imports and guards writes. | The generic transaction contract is mixed with game-specific envelope paths and validators. `stageEnvelope(base, plan, codecs) -> Envelope`; `commit(plan, expected, port) -> CommitResult`. First split staging from the existing publisher, keeping its public wrapper and storage authority. Initially synchronous; an async backend needs an explicit awaited durable acknowledgement before publication. |
| ER12-K5 / OE1, OE2, RT3, E8 | Expansion domains, IDs, sequence and clock exist at `src/expansion_engine.js:73-79`; simulation owns people/sites/jobs at `src/simulation.js:48-72`. Native snapshots are separate inputs, not one live store. `src/main.js:817-820` stages pacing into a native patch. | No universal authoritative state store or post-commit invalidation bus. `snapshot() -> Frame`; `read(observerId, selector) -> ReadModel`; `publish(committed, dirtyDomains) -> void`; `subscribe(domainIds, listener) -> dispose`. First wrap the current expansion publication; snapshots retain native owner adapters. Events only notify after durable success, never carry payments or replace durable receipts. Keep plain slices initially, no compulsory ECS. |
| ER12-K6 / OE2, E8, SB2 | `src/world_instances.js:271-302` constructs authored identity, era, continuity, parent and visits; `:308-344` unions occupied intervals and freezes absence. `src/feature_expansion_destination_host.js:18-25,44-49` binds a concrete instance to joined time. | Instances are not full selectable branches or autonomous worlds. `createWorldInstance(definition, seed)` and `planWorldClock(instance, request, definition)` are already the smallest useful API. First move these pure contracts unchanged, injecting primitive validation if needed. Leave lease clocks, cargo, traveler/body bindings and native calendars with their actual adapters. No automatic absence-policy widening. |
| ER12-K7 / OE3, OE8, RT10, CH2 | `src/expansion_engine.js:303-314` registers stable IDs and freezes definitions. `src/simulation_content.js:55-74` and `src/expedition_content.js:39-41` eagerly aggregate many worlds. `src/audit_remainder_host.js:16-24` contains a six-lane table. `src/absorb_d/register.js:3-10` injects native constructors/registries. | No manifest admission, dependency resolver or provider table independent of worlds. `admit(manifests, apiVersion, savedRequirements) -> Registry`; `bind(manifest, handlers, ports) -> Module`; `dispose(moduleId) -> void`. First move the existing six-lane list into a composition-owned provider table, then replace core host imports with injected hooks. Content/facts/executors remain local; module ID is not authority to spend native stock. |
| ER12-K8 / OE4, OE9, DA5, TS9 | `scripts/compile_feature_ink.mjs:100-170` compiles, checks tags and builds hashed identity. `src/ink_narrative.js:8-22` pins runtime, story revision/hash and retained artifacts. Registry admission already checks duplicate IDs (`src/expansion_engine.js:303-311`). | No compiler for all authored tables or engine API version distinct from save schema. `compileContent(moduleId, authored, validators) -> {artifact, identity}`; `checkApiRange(manifest, apiVersion) -> void`; `resolveContent(identity) -> Artifact`. First reuse the Ink build/check path and current registry validators. Add content identity without replacing frozen pending effects. Do not claim schema integers are semver. |
| ER12-K9 / OE5, DA2, DA4 | `src/save_files.js:40-83,158-182` checks game/schema/domain compatibility and supports marked UTF-8/legacy files. `src/save_compatibility.js:9-57` retains retired content separately. `src/expansion_engine.js:267-270` loads/migrates known expansion schemas. | No domain codec registry, chunk commit protocol or forward-preservation guarantee for every native field. `decodeEnvelope(bytes, readers) -> PreparedSave`; `migrateDomain(id, raw, from, to) -> Domain`; `encodeEnvelope(base, slices, codecs) -> bytes`. First extract routing of existing validators/codecs; keep legacy wire fields and one whole-envelope commit. Domain chunks are logical ownership first, physical chunk writes later only with an atomic manifest/generation protocol. |
| ER12-K10 / OE6, RT4, PF5, SB6 | `src/feature_expansion_destination_host.js:170-182` exposes view/presentation; `src/audit_remainder_host.js:45-71` combines lane presentations. `src/panel_kit.js:7-28` registers discovery/layout/settings, including hidden labels. `src/absorb_e1/panel.js:12-27` injects state/context/change handlers. | Panels still can reach runtime owners and broad refresh paths. `project(frame, observerId, projectionId) -> ReadModel`; `mountPanel(root, read, dispatch) -> {render, dispose}`. First adapt an existing pacing/status panel; keep panel_kit and keyboard/discovery behavior. Optional canvas receives the same read model and commands. Never expose the complete authoritative frame to an ordinary panel. |
| ER12-K11 / OE7, OS7-OS9, PF3 | Current kernel test helpers are headless source consumers (`tests/expansion_engine.test.js:81-118,177`); ER1/ER2 own scratch instrumentation. Ink stores cursor and receipts (`src/ink_narrative.js:266-273,298-302`). | No complete command replay, save inspector or dependency-qualified timing overlay. `runFixture(envelope, commands, ports) -> Trace`; `traceStage(commandId, stage, elapsedMs) -> void`; `inspectPublic(frame, observerId) -> Diagnostic`. First instrument the current planner/validator/encode/write stages. Replay remains partial until native random/timer inputs are captured; synthetic inspector by default, no raw hidden state in player panels. |
| ER12-K12 / OE8-OE10, CH1 | Core imports named optional worlds and validators (`src/expansion_engine.js:1-56`), simulation imports named completion/admission hooks (`src/simulation.js:1-31`), and native code calls main (`src/trade.js:9`, `src/models/combat.js:13`). | No independently reusable engine boundary. `createKernel({registry, hooks, persistence, nativeSnapshot}) -> Kernel` is the composition seam. First make a facade with the same existing saves and commands; test a second tiny synthetic game without importing expedition_content, main or any world host. That test proves isolation, not readiness to support every future world. |

### ER12-A1: Minimum transaction contract

INFERRED signatures, retaining current plan shape rather than inventing a second store:

```ts
type Guard = {sequence:number; clock?:number; revisions?:Record<string,number>};
type AdvanceResult = {plan:Plan; consumed:number; remaining:number;
  stop:'choice'|'life'|'session'|'budget'|'target'; boundaries:number};
type CommitResult = {sequence:number; committedBytes:string; dirtyDomains:string[]};
interface Kernel {
  preview(command:Command, observerId:string): Quote;
  dispatch(command:Command, expected:Guard): CommitResult;
  advance(minutes:number, expected:Guard): CommitResult & AdvanceResult;
  read(observerId:string, projectionId:string): ReadModel;
  subscribe(domains:string[], listener:(r:CommitResult)=>void): ()=>void;
}
```

`Plan` initially means today's returned `{state, external, gameplay, acquisitions, unlocks, ...native fields}`. The compatibility wrapper translates today's scheduler return into `AdvanceResult`. The facade remains synchronous while localStorage is the backend. Only the coordinator requests time; module hooks can describe the next boundary and transform the staged plan, but cannot call advance recursively or publish independently. Preview uses copies/read frames, cannot draw a live stream, and is not a security permission check.

Dispatch flow: obtain fresh native/expansion context under the current writer owner, check guards, clone/plan, validate all affected owners plus necessary cross-owner invariants, stage a copy of the base envelope, validate/encode/write, publish native and expansion owners once, then send invalidation notices. Subscriber errors are presentation errors after commit; they must not turn success into an apparent retryable failed payment. A stale guard or storage failure publishes nothing. Do not generalize rollback guarantees from this seam to unrelated native actions that do not yet use it.

## Module manifest, with two existing systems

**ER12-A2 / OE3, OE9, RT10:** Use a serializable descriptor plus an explicit handler binding at the composition root. Putting imported functions into a global manifest inside the kernel recreates the cycles. No automatic enrollment on module load. Manifests describe ownership and supported behavior; they cannot invent native actor/item bindings.

Proposed descriptor shape:

```ts
type ModuleManifest = {
  id:string; version:string; engineApi:string;
  depends:Array<{id:string; range:string}>;
  schema:Array<{path:string; version:number; codec:string; migration:string|null}>;
  commands:Array<{route:string; handler:string}>;
  systems:Array<{id:string; phase:string; order:number; after:string[];
    reads:string[]; writes:string[]; hook:string}>;
  panels:Array<{id:string; projection:string; mount:string}>;
  content:Array<{source:string; export:string|null; revision:number|null;
    hash:string|null; retained:string[]}>;
  clocks:{requestsAdvance:false; basis:string; absence:string};
  budget:{basis:string; measuredMs:number|null};
};
bindModule(descriptor:ModuleManifest, handlers:Record<string,Function>, ports:Ports): Module;
```

Versions/ranges, module IDs, route names, phase numbers and binding keys below are **proposed**. Save paths, schema 1, source exports and clock policies are READ. `hash:null` means not compiled into the proposed all-content identity format, not permission to skip admission. Compile before enabling strict identity pinning; populate actual hashes, never fake them. Dependencies refer to proposed shared adapters. Order numbers encode current phases at first; they are not a claim that current runtime has these numbered phases.

**ER12-M1: existing optional home pacing.** READ `src/absorb_e1/pacing.js:20-51,60-87`, `src/main.js:817-820,5179,5296`, `src/save_files.js:68-69`, `src/absorb_e1/panel.js:12-27`.

```json
{
  "id":"home.pacing", "version":"0.1.0", "engineApi":"^0.1.0",
  "depends":[{"id":"native.calendar","range":"^0.1.0"},
             {"id":"native.food","range":"^0.1.0"}],
  "schema":[{"path":"pacing_e1","version":1,"codec":"pacingEnvelope",
             "migration":"normalizeLegacyPacing"}],
  "commands":[{"route":"pacing.option","handler":"planPacingOption"},
              {"route":"pacing.food","handler":"stageConsumedFoodPacing"}],
  "systems":[{"id":"home.pacing.advance","phase":"calendarProjection","order":10,
    "after":[],"reads":["current time","native.homeContext","pacing_e1"],
    "writes":["pacing_e1"],"hook":"stageConsumedPacing"}],
  "panels":[{"id":"home.pacing.status","projection":"pacingStatus",
             "mount":"mountPacingPanel"}],
  "content":[{"source":"src/absorb_e1/pacing.js","export":"WEATHER_STATES",
              "revision":null,"hash":null,"retained":[]}],
  "clocks":{"requestsAdvance":false,"basis":"eligible home played minutes",
            "absence":"freeze"},
  "budget":{"basis":"bounded weather cycle; one owner","measuredMs":null}
}
```

`planPacingOption` wraps existing `setPacingOption`; `stageConsumedPacing` wraps `advancePacing` using consumed native calendar difference, not expansion clock as an absolute date. `stageConsumedFoodPacing` wraps `prepareFood` only after actual native consumption succeeds. These wrappers and `pacingEnvelope` do not yet exist. The pure core can reuse current functions. Move the module-level `runtimeState` getter/setter behind the store adapter only after callers stop owning a competing live copy. Preserve default-off hunger/weather and accepted food direction; extraction does not enable hunger or add penalties. Existing `normalizePacing` selects known fields, so retaining unknown fields requires an explicit opaque-field envelope codec, not a claim that normalization already does so.

**ER12-M2: existing Tidemark destination.** READ `src/feature_expansion_destination.js:3-24,72`, `src/feature_expansion_destination_host.js:18-25,44-65,125-167,170-182`, `src/feature_expansion_destination_native.js:15-41`.

```json
{
  "id":"world.tidemark", "version":"0.1.0", "engineApi":"^0.1.0",
  "depends":[{"id":"simulation.jobs","range":"^0.1.0"},
    {"id":"world.instances","range":"^0.1.0"},
    {"id":"native.realmTraveler","range":"^0.1.0"}],
  "schema":[
    {"path":"expansion.featureDestination","version":1,
     "codec":"tidemarkState","migration":null},
    {"path":"feature_destination_native","version":1,
     "codec":"tidemarkNativeEnvelope","migration":null}],
  "commands":[{"route":"tidemark","handler":"commitTidemarkAction"}],
  "systems":[
    {"id":"tidemark.clock","phase":"worldClock","order":10,"after":[],
     "reads":["expansion.clock","expansion.featureDestination.visits"],
     "writes":["expansion.featureDestination.instance"],"hook":"syncTidemarkClock"},
    {"id":"tidemark.context","phase":"simulationContext","order":10,
     "after":["tidemark.clock"],"reads":["expansion.featureDestination","native.traveler"],
     "writes":[],"hook":"tidemarkSimulationContexts"}],
  "panels":[{"id":"tidemark.destination","projection":"tidemarkPresentation",
             "mount":"legacyDestinationPanelAdapter"}],
  "content":[{"source":"src/feature_expansion_destination.js",
    "export":"tidemarkDefinitions","revision":1,"hash":null,"retained":[]}],
  "clocks":{"requestsAdvance":false,"basis":"unioned occupied played minutes",
            "absence":"freeze"},
  "budget":{"basis":"one instance; bounded visits/receipts","measuredMs":null}
}
```

Bindings additionally supply `nextTidemarkBoundary`, `previewTidemarkAction`, `validateTidemarkState`, `validateTidemarkEnvelope`, native save/publication hooks, world definition/actions and current actor/cargo adapters. `revision:1` summarizes current authored definitions; it is not a new pack identity. Admission must include the existing world/action rows, not only `tidemarkDefinitions`. Shared actors, world facts, simulation jobs and native stock are borrowed through transaction ports; the module does not own all of `expansion` or duplicate inventory. `beginTidemark` stays an explicit user command. Missing saved Tidemark content suspends the affected loaded run before execution, retaining bytes and offering recovery. It must not delete the destination or silently continue shared time.

A `systems` row with `writes:[]` builds staged context only. Lifecycle binding handles `nextBoundary`, validation, snapshot and disposal separately; do not pretend they are all tick callbacks. Descriptors identify cross-domain invariants too, such as destination state plus native location/calendar consistency. A declared write list supports review/invalidation, not automatic proof of safe incremental validation.

## How this removes ER2's cycles

ER2-G1/G2/G3/G4 describe SCCs of 2/2/55/36 modules in ER2's measured snapshot. Sizes are inherited evidence, not remeasured ER12 numbers. The following edges were READ in current source. Merely moving files into `engine/` changes none of them.

| Code | Existing edge / READ | Proposed cut and check |
| --- | --- | --- |
| ER12-C1 | `src/acquisition.js:1` imports `validateItemKey`; `src/gameplay_transactions.js:1` imports `stageAcquisition`. | Put pure item-key/snapshot validation in a leaf that imports neither transaction owner. Both owners import the leaf; gameplay may still call acquisition in one direction. Preserve serialized key semantics. Check the two-node SCC disappears and acquisition conservation/failure tests stay equal. |
| ER12-C2 | `src/causal_situations.js:1` imports basic helpers from simulation_contracts, which imports causal validators at `src/simulation_contracts.js:3`. | Extract `assert/record/stableId/natural/copy/jsonData` from `simulation_contracts.js:12-26` into a zero-game-import leaf; situations imports that leaf. Contracts retains domain validator calls. Check no return path to contracts through the new leaf. Do not move the entire validator module and call it primitive. |
| ER12-C3 | `src/expansion_engine.js:12-42,56` imports world clocks/hosts and simulation; those hosts call simulation (`src/feature_expansion_destination_host.js:7`). `src/simulation.js:1-25` imports local hooks; `src/simulation_effects.js:1-28` imports domain facts/effects. | Composition imports both core and game adapters, then injects ordered boundary/context/validator/admission/effect providers. Core imports only leaf contracts and generic ports. Move every named hook on a selected dependency path, including validation and effects, before claiming that path is cut. Leave game-specific hosts mutually coupled where necessary until their own interfaces move. |
| ER12-C4 | `src/simulation_content.js:1-43,55-74` eagerly imports/spreads worlds; `src/expedition_content.js:20,39-41` constructs the aggregate registry. | Aggregate definitions at the composition root; generic registry builder consumes data. A world descriptor must not import the aggregate registry. Later admission loads the exact saved content revision before hydration. Sync injected registries first; async chunk loading is a separate step. |
| ER12-C5 | `src/display.js:27`, `src/trade.js:9`, `src/models/combat.js:13`, `src/models/hero.js:9` depend on main; main explicitly orders cyclic initialization at `src/main.js:68-69`. | Inject native read/action ports into one caller family at a time. For trade, supply `commitNativeTrade`, `getLocation`, `getContext`; for combat, supply typed battle actions and current options/stance reads. Use getters for live values, not captured import-time copies. Composition constructs native owners in the existing order, binds ports, then starts timers/UI. Keep main's export facade for remaining callers. |

Target dependency direction: composition -> game modules/native adapters -> kernel ports and primitive leaves. Kernel must not import composition, game modules, DOM or aggregate content. A manifest resolver that imports each host from the kernel is still the old graph. Graph acceptance requires zero SCC containing a kernel module and no module import of main, except explicitly named legacy adapters during transition. Re-run ER2's graph audit after each cut and report the actual residual SCCs; never promise all 55/36 nodes disappear from one router change.

## Strangler order and compatibility gates

All steps are INFERRED proposals. Run old and new planners side by side on isolated synthetic copies for comparison; only one implementation can commit live. A shared save adapter does not authorize two clocks, duplicate settlement or dual authoritative writes. Each step ends at a playable checkpoint before the next.

| Code / sequence | Small scope and first modules | Per-step test and save gate |
| --- | --- | --- |
| ER12-X1 | Capture synthetic baseline envelopes/commands and exact initial sequence, random state, jobs, native stock, cursors and clocks. Keep existing main/expansion exports. | Existing ER12 baseline below plus source-specific tests for the selected system. Compare full semantic envelopes, not labels. Record rebuilt fresh-origin desktop controls and Save/reload/literal-file Import before any behavior claim. No schema or content identity change. |
| ER12-X2 | Cut primitive cycles C1/C2; move only key/JSON/ID/numeric validation and exact RNG arithmetic. | `tests/acquisition.test.js`, `tests/gameplay_foundations.test.js`, `tests/simulation.test.js`, `tests/expansion_engine.test.js`. Add meaningful vectors for draw outputs and old retained seeds, rejected unsafe keys, and unchanged frozen commitments. Same bytes/IDs/schemas; no random reseeding. Re-run import graph. |
| ER12-X3 | Split envelope staging from storage publication. Introduce codec/validator injection behind persistExpansionPlan and save_files facades. | `tests/save_files.test.js`, `tests/save_compatibility.test.js`, `tests/expansion_engine.test.js`, `tests/feature_panel_save_failure.test.js`. Fail storage before publication; verify stock/cursor/calendar/RNG stay old. Test unknown/dormant/retired fields, malformed imports, future schema and actual-loader rejection. Keep existing UTF-8 marker and legacy readers; no physical chunking. |
| ER12-X4 | Bind the existing audit-remainder lane table at composition; inject command providers and then scheduler/validator/fact providers for one selected path. | Compare all six route resolutions, cancellation/enrollment guards and identical presentations without invoking two publishers. Existing domain-specific suites selected from the touched lane imports plus `tests/simulation_optional_enrollment.test.js`. New resolver tests reject duplicate routes/missing providers/ordering cycles before mutation. Manifest/API version is build metadata initially, not a mandatory new save field. |
| ER12-X5 | Adapt pacing as the first small store/consumed-time/panel seam (M1). Move its runtime singleton behind adapter only after all reads move. | `tests/absorb_e1.test.js` plus failed-save panel tests; equal eligible minutes segmented/jumped, disabled/away freeze, restore without accrual, consumed food exactly once. Synthetic old absent field loads with defaults off; do not rewrite dormant pacing just because its panel opens. Native item use and Save/reload/Import require rebuilt desktop proof. |
| ER12-X6 | Move common boundary loop behind ordered hooks, leaving simulation executors in place; adapt Tidemark clock/context/validation (M2). | `tests/expansion_engine.test.js`, `tests/simulation.test.js`, `tests/realm_optional_context.test.js`, `tests/realm_dormant_structured.test.js`, `tests/ink_lin_parity.test.js`, and touched destination integration coverage. Add equal-time multi-boundary, tie order, choice/life/session stop and >512-boundary remainder comparisons. Preserve expansion schema and `featureDestination`/native calendar/visit identity, cargo and all frozen jobs. Missing content fails before loading/paying. |
| ER12-X7 | Separate Ink cursor/artifact adapter from world bindings; remove corresponding core imports. Keep inkjs and all retained artifacts. | `tests/ink_lin_parity.test.js`: retained v1/v2/v3/current, stale scope/clock/revision, preview purity, failed-write retry and paid receipt equality. Test exact artifact missing/corrupt cases without advancing a cursor or applying host effects. Story cursor remains opaque in its existing fields; no conversion to a homemade story VM. |
| ER12-X8 | Remove main back edges for one native family, then further families only as exercised. Add post-commit dirty-domain notifications and panel disposal. Consider yielding/worker/backend only from measured cost. | Re-run graph, affected native tests and synthetic repeated mount/dispose, subscriber-error-after-commit, stale request and failed-save checks. Rebuild to a scratch lane or `/tmp` output and exercise controls at 1366×768; check visible outcome and exact Save/reload/literal-file Import. Main facade remains for unmoved callers. Any changed storage format/async commit/remainder persistence is its own migration and failure-recovery gate. |

For X6 preserve today's phase order first: world-clock reconciliation, pending expansion jobs ordered by due/sequence, opportunity updates, chronicle, native container clocks, simulation settlement, local reconciliation and final validation (`src/expansion_engine.js:610-635`). Inside simulation retain its job-before-offer/check/controller routine policy (`src/simulation.js:463-465`). Topological order plus stable ID is a future manifest tie rule; it cannot replace existing sequence or insertion-sensitive ordering without equality tests and a separate compatibility decision. Explicit compatibility ordinals bridge old hooks until equivalent order is proved.

Old saves in new code is a supported-schema matrix, not a promise to interpret arbitrary corrupted/future domains. Missing required content suspends the entire interdependent run; only genuinely independent optional UI can degrade alone. A future engine/schema rejects execution while preserving the imported original, recovery copy and dormant payload. Unknown fields are preserved by codecs outside known validated slices, never blindly executed. Keep the last good bytes until migration validates and commits. Do not silently strip fields to allow downgrade, or make an old client write a new-schema run. This is the safe reading of SB3's forward-preservation request, not proof the current native loader already meets it everywhere.

## SB1-SB10 mapped to actual stop conditions

| Code / palette | READ basis | INFERRED proposal / test or stop |
| --- | --- | --- |
| ER12-S1 / SB1 | Root SB1 says third use; `docs/ENGINE_EXPANSION.md:626-628` actually allows extraction at two real features or one safety boundary, with reassessment after first conditional event and second world. | Follow the live owner's two-use/safety exception; use three exercised consumers as the bar for a broadly reusable abstraction. Do not add three worlds to satisfy it. Stop at a mismatch exposed by current pacing/Tidemark/another already-existing consumer, and keep a local adapter rather than broaden the engine for hypothetical worlds. |
| ER12-S2 / SB2 | `src/expansion_engine.js:303-311` rejects duplicate stable IDs; `src/world_instances.js:275-280` retains definition/instance/era identity. | Authored ID + revision, never array index for content identity. Runtime sequence IDs remain valid commit identities. Reorder definitions and prove saved references still resolve; renames need explicit remapping or retained definitions. |
| ER12-S3 / SB3 | `src/save_files.js:58-65` rejects newer game versions; retired data is retained by `src/save_compatibility.js:9-57`. | Preserve unknown/dormant bytes without treating them as understood playable state. Reject future schemas before mutation. Test old/new/missing-content/import failure, never make downgrade acceptance a silent deletion path. |
| ER12-S4 / SB4 | Saved Ink artifact/cursor pinned at `src/ink_narrative.js:18-22,266-269`; native live initialization is ordered at `src/main.js:68-69`. | No gameplay hot reload initially. If added, quiesce writer, dispose listeners/timers, preserve domain state and cursor, rebuild only caches, validate new bindings before resume. Reject changed content incompatibility; full reload remains fallback. |
| ER12-S5 / SB5 | Joined consumed-time projection at `src/main.js:1234-1255`; native timers remain separate (offline audit F2/F6). | One coordinator for migrated systems only. Other systems report boundaries/react to consumed time. Do not claim one clock across the whole game until native action/combat timers move. Test no double advance and no remaining-time loss. |
| ER12-S6 / SB6 | Pure plans copy context at `src/simulation.js:40`; observer-aware Ink variables at `src/ink_narrative.js:265,297`; existing view at destination host `:170`. | Panels receive actor-qualified read models; dev freeze copies. Repeated previews must leave envelope, RNG and cursor unchanged. No hidden raw frame in diagnostics presented to the player. |
| ER12-S7 / SB7 | Registry ID validation at `src/expansion_engine.js:303-311`; Ink errors and missing artifacts fail explicitly at `src/ink_narrative.js:18-22,61-67`. | Classify error as admission/content, stale command, invariant or storage. Disable an independent invalid module with a safe notice; suspend a run if saved state/shared transactions depend on it. Never catch invariant/storage errors and continue settling partial rewards. |
| ER12-S8 / SB8 | Boundary cap at `src/expansion_engine.js:626`; bounded weather at `src/absorb_e1/pacing.js:38-49`; ER1 identifies full-envelope costs. | Manifest declares cost basis and measured budget only after instrumentation. Track planning, validation, encode/write/render separately. Stop optimization if end-to-end benefit including adapters is absent; 512 boundaries is not a frame-time promise. |
| ER12-S9 / SB9 | Pending jobs sort by due/sequence (`src/expansion_engine.js:614`); phases explicit at `:612-635`. | Preserve old ordering in first extraction. Reject dependency-order cycles and ambiguous multiple writers. Compare equal-deadline resource contention, controller enrollment and frozen outcomes before using stable ID ties for new systems. |
| ER12-S10 / SB10 | Local native/host rules and hooks already exist at destination host `:125-167`, simulation `:1-25`. | Escape hatch is `planSpecialRule(frame, request, ports) -> Plan` inside the same guarded commit, with declared reads/writes/clock policy and domain tests. It cannot write storage, run a second timer, mutate live native inventory or bypass observer disclosure. |

**ER12-D2: Stop or narrow the extraction** if a step changes retained outcome/order/identity without an explicit compatibility decision; cannot demonstrate one publisher and failed-write conservation; adds a second gameplay store/clock; or requires new world mechanics to justify the abstraction. Hold at the last proven facade and document the exact mismatch. No engine roadmap becomes a gate for existing playable work.

**ER12-D3: Do not claim portability** until at least a small alternate synthetic rules module runs headlessly with no game imports and the selected real system still passes its native persistence route. Do not claim performance improvement from file count, a new folder or passing source tests. Measure end-to-end cost with the same fixtures. These are proposed extraction acceptance gates, not new requirements for completing this research lane.

## Where adopting is better, and ranked next work

**ER12-F1:** Building our own renderer, desktop shell, story interpreter or general entity/query framework is worse value than retaining or adopting a tested component for that task. The custom part worth owning is the game's causal transaction/time/identity/disclosure contract. It does not follow that we should implement every surrounding engine service ourselves. This is an INFERRED engineering judgment, not an engine benchmark.

[ER5 engine comparison](GAME_ENGINE_OPTIONS_2026-10-14.md) recommends keeping DOM/JS, a selected Pixi visual island, a Tauri/Electron packaging trial when needed, and Godot only for a deliberate scene-centered successor. [ER3](TECH_STACK_OPTIONS_2026-10-14.md) gives primary-source-backed worker, UI-island and storage options. Follow those reports for external capability evidence; ER12 makes no fresh external feature/version claims. [ER6 library comparison](LIBRARIES_TO_INCORPORATE_2026-10-14.md) and [its report](../gm/dispatch/engine-runtime-2026-10-14/ER6/REPORT.md) landed during this lane. ER6-P1/P2/P4 propose Valibot at one content boundary and signals-core or mitt for one published read model; ER6-P5 makes miniplex conditional on a measured query workload. Use that evidence for trials rather than writing a generic validation, reactive or entity-query framework. Those are sibling proposals, not adopted dependencies or ER12 measurements.

| Rank / code | Proposal and root codes | Cost once / adoption comparison |
| --- | --- | --- |
| 1 / ER12-R1 | Extract primitive leaves and guard the current publication facade; use two existing systems to expose the real contract. OE1, OE5, OE10, RT2, DA4, CH2. | Moderate owner/equality coverage effort. Higher value than replacing the engine because it preserves tested behavior and existing saves. |
| 2 / ER12-R2 | Composition-owned provider/manifest table with current order, validators and facts. OE3, OE8, RT10, CH2. | Moderate cross-owner wiring effort. Own the narrow game contract; do not build a generic plugin marketplace or hot-reload framework. |
| 3 / ER12-R3 | Instrument current stages and route one panel through post-commit read models. OE6, OE7, PF1, PF3, RT3/RT4. | Small to moderate local integration effort. Retain DOM/panel_kit first; evaluate ER3's library islands only for a named UI gap. Homemade reactive infrastructure is unlikely to pay for this one panel. |
| 4 / ER12-R4 | Keep inkjs, compiler checking and retained content artifacts behind a narrower narrative adapter. OE4, OE5, EG7, DA5. | Moderate compatibility binding effort. Replacing the Ink VM/compiler buys no requested behavior and creates a cursor/story compatibility burden. |
| 5 / ER12-R5 | Use ER5/ER6 adoption choices for visuals, shell or a measured entity/query bottleneck rather than extending the kernel into those areas. OE2, OE6, EG1/EG5, LB1, SB1. | Renderer/shell/ECS integration and their target-platform qualification are separate costs. A scene-centered successor may favor Godot; a selected numeric hotspot may favor an isolated external/WASM kernel. Neither automatically replaces this game's save/time/disclosure rules. |

No new palette family is needed. Engine range checks, all-content compilation, physical save chunks, hot reload, workers, generalized offline progress and ECS remain optional follow-ups to evidence, not prerequisites for extracting the existing seam.

## Checks and open evidence

MEASURED, run in this lane on 2026-10-14:

```sh
node --test tests/expansion_engine.test.js tests/save_files.test.js tests/save_compatibility.test.js tests/absorb_e1.test.js tests/ink_lin_parity.test.js
```

Exit 0; 43 tests, 43 passed, zero failed/cancelled/skipped; runner duration 2304.847625 ms. TAP captured in `/tmp/er12-kernel-baseline.tap`. This is a current source baseline for scheduler/publisher, file/retirement compatibility, pacing and Ink parity. It is not a benchmark, full suite, extracted-kernel proof or browser acceptance.

OPEN: actual extraction graph after edits; alternate-module isolation; migrated module performance budgets; comprehensive unknown-field/native-loader preservation; asynchronous backend atomicity; yield/resume and all native RNG determinism. New rebuilt desktop gameplay plus exact Save/reload/literal-file Import for each consequential extraction remain future gates. No runtime, source tests, dist, index, package, root palette or live design owner changed; no install, commit or push.
