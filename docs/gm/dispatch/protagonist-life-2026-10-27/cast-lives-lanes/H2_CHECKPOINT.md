# H2 checkpoint: place-act operation registry

Status: implemented, below floor; engine and native-save fixtures verified, not human-reviewed.
Public, name-free code and synthetic fixtures. No private pack changes, commit,
staging or push. Owned paths are released to the coordinator. No writer remains active in this lane.
Applies: AR1–AR16, AD36, AD38, AD43, AD45, CLR1–CLR12; MD1–MD3 are
modularity guidance, not newly accepted decisions. Authority remains PROJECT's
lead-life direction and the [lane brief](H2_ACT_OPERATIONS_BRIEF.md).

## Probe and seam

The live private pack had 492 objects, 503 acts, all eight incumbent operations,
and one resource seed. Expected gate: the incumbent eight remain supported;
observed eight. No threshold failed. Reviewed mechanism classes come from
[RV2](RV2_CHECKPOINT.md), [RV4](RV4_CHECKPOINT.md), and the existing
[H1](H1_CHECKPOINT.md)/[A3](A3_CHECKPOINT.md) seams. No source acquisition or
canon-row generation was performed in this lane.

`definePlaceActs` now calls a leaf registry in `src/place_act_operations.js`.
Definitions still pass through existing simulation quotes, reservation/refund,
completion support, effects, knowledge and jobs. Existing cast-host registration
and the reviewed-row merger already call this adapter, so neither needed an
edit. Zero core-owner edits, zero registration lines, zero added cycle edges.
All 503 incumbent definitions serialize byte-identically to the HEAD adapter
with the same binding and pack data.

## Data contract and existing consumers

| Operation | Pack data and mechanism | Consumer / known limit |
|---|---|---|
| `read` | Existing minutes, report, knowledgeKey, costs/effects and `requires`; simulation writes the actor's observation-basis knowledge | Knowledge and Reports; lamp/ink access stays in authored predicates, no invented text contents |
| `prepare` | Negative non-native resource costs must reference `objects[].resources` seeds; result is a fact or positive seeded resource output (zero initial stock is valid) | Existing resource consumer / fact gates; reserve once, refund on cancellation, seed markers do not refill spent stock |
| `wake` | `awakeFact` (default `place.act.awake`) must already be false on the actor; settlement sets true | Actor predicates; unknown sleep state blocks. This is pack-owned waking state, not elapsed wall time or native sleep cancellation |
| `check time` | `clock: {fact, value}` requires that exact current world display fact at admission and completion; writes knowledgeKey plus `knowledgeKey + '.display'` with the observed value and basis | Simulation knowledge; this samples an authored clock display, does not create or advance a second clock |
| `sit`, `settle` | Numeric minutes; writes actor `restFact` (default `place.act.rested`) | Fact predicates; ordinary fatigue recovery has no bound need owner here, so no invented vital restoration |
| `secure` | `objectId` must reference a seeded object whose actorFacts include this actor's `secure.ownedFact`; runtime requires true. `secure.custodyFact` receives `secure.container`; `secure.concealedFact` becomes true | Subsequent predicates can require concealment; remains ordinary-object fact custody, not a new native inventory or custody ledger |
| `wait here` | Numeric minutes, ordinary completion support and refund cancellation | Existing job/clock owner; loses support without a completion receipt. G1 quotes absolute time-band/event targets, so a fixed local short wait uses a place job |

The compiler maps the reviewed families to these operations. Explicit mechanism
fields can arrive in `step.placeAct`; preparation, securing and checking time
without those fields stay `missingMechanism` gaps. A wait requires explicit
numeric source minutes rather than the generic one-minute fill. Other durations
retain A3's explicitly labelled fill. Existing pack rows remain first and
unchanged; no stock or output resource is generated from prose. The merger's
existing adapter/registry validation accepts the same rows and rejects missing
seeded stock; its source is unchanged and its tests were extended.

No new save shape, envelope, slice, migration, timer or save writer. New values
use existing facts, resources, knowledge and admitted jobs. The real owning
validator already recognizes cast object commands and compares saved costs and
effects to the admitted definition. Existing saves retain their values and
seed markers; additional operations have no effect until pack rows select them.

Known future seam: a real ordinary sleep/need adapter could replace the wake/rest
fact fallback. Native `is_sleeping`, sleep cancellation and recovery still belong
to the existing host/body owners; these operations claim no native sleep-control
integration. The pack's clock-display producer remains responsible for updating
its display fact. Fact custody could later bind an ordinary-object owner without
changing simulation's transaction or save ownership.

Target UI: existing Things at hand disclosure, perspective tags, **1920×1080**
desktop. Expected visible outcome: the selected operation's description, numeric
minutes, authored stock label and blocked reason. No UI file changed; mobile is
deferred. New operations were not added to the live private pack or demonstrated
in a desktop browser, so this is not a new playable-content coverage claim.

## Checks

| Command / input | Result | Gap |
|---|---|---|
| `node --test tests/place_acts.test.js tests/place_act_operations.test.js tests/build_place_acts.test.js tests/merge_reviewed_rows.test.js` | PASS, 20/20, 61.2 seconds | Synthetic/native-headless fixtures, not desktop browser. First run: 19 pass, native fixture exhausted Node's heap after redundant whole-app reloads; reduced reload repetition, final native fixture passes in 60.0 seconds |
| `BUILD_OUT=/tmp/yairpg-h2-build npm run build` | PASS | Build only, not desktop/browser proof; shared `dist` and index untouched |
| `npm run check:arch` | PASS; main -51, display -37, save writer 0 vs baseline; 205 grandfathered cycle edges | Shared-checkout input, no new growth |
| Node comparison: HEAD adapter vs new adapter with the same live private pack and synthetic binding | PASS, 503/503 definitions JSON-byte-identical | Definition equivalence; incumbent behavior also covered by original focused assertions |
| `node scripts/lane_review.mjs` with explicit grants and seven changed code/test paths | Scope and top-level-await checks pass; publication scanner flags six files | All hits manually inspected: generic `world` and existing synthetic `Study` collide with private pack names. No canon content; scanner itself not changed |
| Scoped `git diff --check` | PASS | Tracked-path whitespace; new leaves inspected directly |
| Full `npm test`, `npm run check:rules`, rebuilt desktop browser | Not run by lane | Coordinator combined gates; no rule codes changed |

## Floor and handoff

- **FLR1:** build passes. `/tmp/yairpg-h2-build/dist/bundle.js` SHA-256
  `8c27b0f0af020ebe65517d2afb50e0749357544cf8cd0699f5c2ce9f9cba44bf`.
  This hash is built, not browser-proven. HEAD at build: `42a21ce623c912120d20dcab21cdfb761f4692ea` plus this lane and concurrent dirty work.
- **FLR2:** synthetic simulation and native-save fixtures; no natural journey or rebuilt browser route claimed.
- **FLR3:** existing quote projection exercised for minutes/eligibility; desktop visibility and perspective tag remain unverified for new rows.
- **FLR4:** stock outputs, knowledge, actor/world fact gates and concealment-dependent quote exercised in synthetic fixtures; no live content rows adopted.
- **FLR5:** PASS through real native Save, reload, Export and literal Import. All seven new operation families have pending saves checked by the real validator, including tamper rejection; preparation crosses pending Import/reload, and all seven settled results cross Export/Import/reload. Incumbent pending/settled and old-save additive-seed checks still pass. No new save shape. `settle` is an alias of the tested `sit` compiler and has simulation-level coverage.
- **FLR6:** engine and native-save fixture verified, not human-reviewed; **implemented, below floor** until coordinator's rebuilt desktop sampled journey.

Coordinator owns adopting paragraph-reviewed rows, combined full-suite/rule gates,
and the rebuilt desktop route. This lane changes no standing direction and
claims no new whole-book replay score.

Changed files: `src/place_acts.js`, new `src/place_act_operations.js`,
`scripts/lead_run/build_place_acts.mjs`, `tests/place_acts.test.js`, new
`tests/place_act_operations.test.js`, `tests/build_place_acts.test.js`,
`tests/merge_reviewed_rows.test.js`, and this checkpoint.
