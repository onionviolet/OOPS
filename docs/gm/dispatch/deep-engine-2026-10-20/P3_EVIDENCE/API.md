# P3 reusable scenario API

Scope: developer authoring/testing over real runtime owners. `src/scenario_facade.js` has no game imports or module state. The adapters in `scripts/headless/scenario.mjs` support the named synthetic lamp fixture; these are not a general player debugger, universal transaction layer or full replay system.

```js
import {boot, ROOT} from './scripts/headless/runner.mjs';
import {createHeadlessScenario, scenarioInputIdentity, ordinaryLampJourney}
  from './scripts/headless/scenario.mjs';
import {LAMP_FIXTURE, ordinaryLampFixture}
  from './tests/fixtures/deep_engine/ordinary_lamp.mjs';
const game = await boot(null, {seed:LAMP_FIXTURE.seed,
  wallStart:LAMP_FIXTURE.wallStart, heroName:null});
try {
  const fixture = ordinaryLampFixture(await game.save());
  await game.load(fixture); // developer fixture installation, not acquired play
  const scenario = createHeadlessScenario(game,
    await scenarioInputIdentity(ROOT, LAMP_FIXTURE, fixture));
  const quote = await scenario.quote({type:'lamp.toggle'});
  const result = await scenario.execute(quote);
  const elapsed = await scenario.advance(2);
  const known = await scenario.inspect();
  // Or run the same finite success/stale failure/persistence contract:
  // const receipt = await ordinaryLampJourney(scenario);
} finally { game.close(); }
```

API: `identity()`, async `inspect()`, async `quote(command)` returning a frozen `{command,value}` ticket, async `execute(ticket)`, async `advance(minutes)`. Execution/advance return `{kind,status,result|error,before,after,delta}`. A rejected operation is observable, not an assertion that every domain rolled back; the selected lamp owner revalidates the actual ticket and owns its transaction. `semanticDelta` compares only known projections. Delta paths are current observable consequences of the requested operation, not an internal cause graph, hidden-premise trace or dependency cache.

`persistence.save/load/reload/exportFile/importFile` are explicitly developer operations, returning raw envelopes or literal encoded files only to the caller. Keep that data private. `load` is fixture installation; reload and literal Import use the actual native load paths. `ordinaryLampJourney` returns raw saved/export data for its verifier; published receipts strip it and retain hashes. Ordinary inspection does not call save/write/advance and filters out lamplight notice counters, future reveal IDs and extra fields. No second save slice or save schema is introduced.

`createBrowserScenario(session, identity)` uses the existing playtest Session, native test hooks, and native save/menu routes on a disposable localhost origin. Its lamp quote/execute ports come from `BROWSER_SCENARIO_BRIDGE`, appended within the same main bundle by the verifier's esbuild plugin. `runner.mjs` appends the same bridge and exports `game.module.scenarioLampOperations`; no private binding is hand-edited to run this scenario. Production bundle/main is unchanged. The verifier records official and instrumented bundle hashes separately. Native visible inventory actions are also exercised independently after the shared scenario.

## P2 handoff

No required main/display/save composition patch. Keep registry command names `lamplight.quote`/`lamplight.execute` and projection name `lamplight`, or adapt only the narrow bridge if the registry API deliberately changes. Preserve exported singleton compatibility for old callers. The facade stays usable through registry commands after P2's instance extraction. P2 can use the unchanged `ordinaryLampJourney(createHeadlessScenario(...))` before/after the structural move. The current bridge does not own or configure any domain.

If an uninstrumented test-hooks browser surface is useful later, expose the same two registry operations from the existing localhost-only test hook owner through a separately reviewed, net-zero composition hunk. That is optional future work, not a P3 gate or permission to edit a busy owner. The saved native receipt explicitly qualifies the test instrumentation instead of presenting it as production integration.

For P1's synthetic effect case, import `createScenarioFacade` directly and inject only its fixture's supported `quote`, `execute`, `inspect`, `advance` and the five persistence operations. The effect inspector must return the P1 observer-safe actor/effect projection; never return full combat frames or sealed truths. The facade has no lamp dependency and needs no composition change for that case. P1 owns those runtime operations and fixture, so P3 does not invent them or claim an unrun second integration.

## Replay limits

Identity includes fixture descriptor, exact prepared save SHA256 and content hashes of dirty runtime sources, locale/story inputs, runtime-imported docs, host styles/index, harness and fixture source. It does not claim every optional asset/network response is pinned. Covered input controls: per-boot seeded Math.random/crypto, fixed wall time, paused native game clock and explicit command order. Uncovered: whole-game draw ledger, optional/private pack responses, browser/Node timer scheduling, cross-reload RNG continuation and concurrent games in one Node realm. Source hash is an input receipt, not proof of global deterministic behavior. The existing runner still supports one active game per Node process; the factory facade does not make the whole game reentrant.

No presentation changes. Browser target: 1920×1080. Laptop/text-size layout acceptance belongs to UI-changing lanes; mobile remains deferred. Weibao's human play judgment remains open.
