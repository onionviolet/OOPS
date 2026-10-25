# Sim profile: does any loop justify Rust/WASM? (2026-10-24)

Measurement plus proposals. Not an accepted decision. Extends
[engine considerations](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md)
EG4/TS7 (Rust/WASM only with measured end-to-end benefit) and
[ER7 spikes](ENGINE_SPIKES_2026-10-14.md).

## Method

- `node scripts/headless/bench.mjs` over the committed perf fixtures, plus
  scaled fixtures built from committed `mid.json` by a scratch copy of
  `crowdedFrom` (`scripts/perf/gen_fixtures.mjs`) with the helper count as a
  parameter: 0, 64, 256 and 512 hired route helpers, 512 settled claims each.
  Scaled fixtures were not committed.
- CPU profiles: `node --cpu-prof --cpu-prof-interval 500`. Shares below count
  only samples whose stack is inside the named fixture's boot, with GC samples
  attributed to the neighbouring sample.
- The headless runner bundles the working tree, which had about 60 uncommitted
  `src/` edits from other sessions, and changed between the two profiles (bundle
  line numbers shifted). Function names are stable across both.
- Machine load 4 to 6. A crowded rerun without the profiler gave the same rate,
  so profiler overhead is small.
- **Offline catch-up for players does not exist yet** (`src/main.js` near the
  `catch_up_ticks` hook: "No player offline policy exists yet"). What is measured
  is the stepper a catch-up would use: `fastForward` and `advanceTicks` both run
  `runEngineTicks` one game minute at a time. Times below are what a catch-up
  would cost on today's stepper, not a current player-facing delay.

## Results

| Fixture | Sim people | Expansion state | CPU ms per game minute | One game day | One game week |
|---|---|---|---|---|---|
| fresh (committed) | 1 | small | 12 to 16 | ~20 s | ~2.3 min |
| mid (committed) | few | 60 KB save | 33 | ~48 s | ~5.6 min |
| scaled 0 | 4 | 70 KB | 45 | ~65 s | ~7.6 min |
| scaled 64 (= crowded) | 68 | 219 KB | 137 | ~3.3 min | ~23 min |
| scaled 256 | 260 | 635 KB | 493 | ~12 min | ~83 min |
| scaled 512 | 516 | 1.1 MB | ~1,150 (profiled run) | ~28 min | ~3.2 h |

About 1.8 ms per person per game minute up to 256 people, rising to about 2.2 at
512. The curve is mostly linear, with a quadratic term that starts to show at
512 (below).

### Where the time goes

Crowded (68 people), crowded-only samples, 204 CPU s:

| Share | What | Kind of work |
|---|---|---|
| 22% | `structuredClone`, almost all from `src/planning_read_frame.js:9`: each mutable read of the cached `simulationNativeContexts` clones it, three reads per tick (campaign context, chronicle plan, persist) | copying the object graph |
| 14% | garbage collector | short-lived spreads and clones |
| ~33% | `worldCompletionFacts`, `worldCompletionBridgeFacts`, `worldCompletionContext`, `worldCompletionNativeContext`, `buildSimulationFacts`, `auditRemainderCombinedFacts` | rebuilding fact maps per actor per minute with object spreads |
| ~3% | `writeExpansionPlan`, `create_save`, `sameJson` | per-tick persist and compare |
| ~3% | headless DOM shim | headless only |

512 people, 83 CPU s:

| Share | What |
|---|---|
| 27% | `worldCompletionNativeContext` (`src/world_completion_facts.js`) |
| 19% | `structuredClone` |
| 12% / 8% / 4% | `worldCompletionFacts` / `worldCompletionBridgeFacts` / `worldCompletionContext` |
| 10% | garbage collector |

The quadratic term: `worldCompletionSimulationContexts`
(`src/world_completion_runtime.js`) calls `worldCompletionContext` for every
actor. Each call runs `worldCompletionNativeContext` twice (directly and again
inside `worldCompletionFacts`), and each run rebuilds a vitals map over every
person. So the work is people × people per game minute.

## Answer

No pure numeric loop exists in the hot path, at 68 or at 512 people. No function
in the top 30 of either profile does arithmetic over arrays. The time goes to
copying and rebuilding JS object graphs every game minute. The one superlinear
cost is an all-people map rebuilt per actor, which is an algorithm problem.

Rust/WASM would not fix this and would likely make it worse (inferred, not
measured here). These object graphs would cross the JS-WASM boundary every tick.
ER7-S2D measured that encoding and rebuilding a graph across a worker boundary
costs about as much as cloning it locally. Avoiding the boundary means porting
the whole sim, every domain module each feature wave touches. A quadratic loop
ported to Rust is still quadratic.

## Cheaper wins in JS (proposals, ranked by expected gain)

| Code | Change | Expected gain | Risk |
|---|---|---|---|
| P1 | Build the people vitals map once per tick and pass it into `worldCompletionNativeContext`, instead of rebuilding it twice per actor | removes the quadratic term; ~27% at 512 people, growing with N | low; pure hoist |
| P2 | Hand out the cached `simulationNativeContexts` as a frozen view on read. Copy only the fields a caller actually mutates, instead of a `structuredClone` of the whole value on every mutable read | ~20% CPU plus part of GC | callers that mutate silently; needs a dev-mode freeze check |
| P3 | Memoize per-actor fact maps (`worldCompletion*`, `auditRemainder*`) on a state version or dirty flag, so unchanged actors reuse the last tick's facts | the largest linear bucket; scales with idle actors | stale facts if a writer skips the version bump; one authority per fact (AR) helps |
| P4 | Catch-up at coarse steps: actors with no due job jump to their next due time instead of advancing minute by minute (RT6/RT7 due-time membership) | 10x or more on long absences | a design decision on which systems may jump, already open in the offline clock audit |
| P5 | Run catch-up in a worker with retained state (ER7-S2D's untested protocol) | frees the UI, not total CPU | message-size contract and stale-result handling |

Gains are estimates from profile shares, not measured patches. P1 and P2 are
mechanical. P4 changes the curve. Today a week of catch-up on a 500-person world
would be 10,080 full ticks and about three hours of CPU.

## Long term

What Rust could bring later, and the cheap step that keeps each option open:

| Benefit | When it becomes real | Prepare now |
|---|---|---|
| Raw speed on dense numeric systems (big markets with thousands of traders, ecology or irrigation grids, pathing, mass combat) | a world whose sim is mostly numbers over thousands of entities | write such systems as pure functions over plain or typed arrays, with snapshot input and summary output, so one can be ported alone |
| Bit-exact determinism across machines (replays, shared seeds, bot playtests EL40) | when replays or cross-device saves matter | seeded RNG, integer or fixed-point sim math, no `Date` or object-order dependence |
| One core shared with a Godot or mobile successor (EG2, DS10) | if a scene-centered successor actually starts | keep `src/` host-free (already the AD39 default) |
| Multithreaded sim via WASM threads | only after P1 to P4; threading a copy-bound loop multiplies the copies | the retained-state worker protocol (P5) first |

Costs that last as long as the project does: two languages, a boundary schema
that every save change must update, slower design churn under strict types, and
fewer agents that write good Rust quickly. AD5 and AD38 call for constant
reshaping, which is where JS is strongest.

Revisit trigger (proposal): after P1 to P4, profile the 512-person fixture again.
If one function whose body is mostly arithmetic over arrays takes more than 30% of
CPU, spike just that function in Rust/WASM behind an adapter and compare end to
end.

## Gaps

- Node headless only; no rebuilt desktop Electron trace (ER7-Q1 still open).
- Scaled fixtures add only one kind of person (route helpers). Other actor kinds,
  worlds or long histories may scale differently.
- The 512 row comes from the profiled run only.

## Round 2: an active (non-passive) game, and wins for both modes (2026-10-24)

Weibao asked what changes if the game is played actively rather than idled, and
what improves both. Active versus idle balance is still open in
[USER_VISION §7](../USER_VISION.md#7-balance-between-active-play-and-idling-open);
nothing here decides it. Under AD5 the default proposal is both: one sim, with
the time policy set per world and per system.

### New measurement: the live tick

Round 1 measured batched stepping (`advanceTicks(n)`), where panels render once
per batch. Live play renders after every tick. Probe: 180 single
`advanceTicks(1)` calls after 10 warmups, headless.

| Fixture | Live tick p50 | p95 | Ticks over 50 ms |
|---|---|---|---|
| fresh | 47 to 56 ms | 55 to 75 ms | 19% to 100% |
| crowded (68 people) | 790 to 990 ms | 810 to 1,090 ms | 100% |
| scaled 256 | 1,610 ms | 1,950 ms | 100% |

At one tick per second, a crowded save keeps the main thread busy about 80% of
the time, and input can wait up to a second. This matches the browser gate from
2026-10-14 (crowded: 50% to 63% busy, long tasks of 0.8 to 1.2 s;
[perf README](../../scripts/perf/README.md)). The headless DOM shim adds some
cost, so read these as the shape, not exact Chrome numbers.

Profile of 40 live crowded ticks: **72% is the end-of-batch panel render**, and
only about 12% is the sim tick itself. Inside the render,
`previewSimulationCommand` takes 56%, of which field works panel previews are
37%. The cause is `src/simulation_effects.js:122`. Each preview passes
predicates to `simulationFacts`, and a predicate-limited read deliberately skips
the frame's cached facts. So every visible command button rebuilds the full fact
set (`buildSimulationFacts`, `auditRemainderCombinedFacts`, `worldCompletion*`)
from scratch.

So round 1's "render ~3%" holds only for batched catch-up. For active play, the
UI's availability checks dominate.

### Findings

**ACT NOW (done in this doc)**

- **AC1.** The round 1 answer stands for active play too: no numeric hot loop.
  The active-play gap is 15x to 50x (790 ms against a 16 to 50 ms budget), and it
  comes from rebuilding facts per button. Rust cannot close that gap. Sharing
  work can.

**ACCOUNT FOR NOW** (constraints on any future perf or active-play work)

| Code | Point | Helps |
|---|---|---|
| AC2 | **P0, ranked above P1:** command previews share one full fact build per state version instead of each rebuilding a predicate-limited one. Full facts are a superset, so the open question is only whether any builder relies on the partial path; check with a byte-equal preview comparison over a scripted run | active (the largest share), idle with the tab open |
| AC3 | **Separate the three clocks.** Input feedback should be immediate (under 100 ms). Render runs at frame or panel cadence, and only for visible, changed panels. The sim tick stays at one game minute per tick. Today one tick does all three in one task | active mostly, idle UI smoothness |
| AC4 | **Event-driven scheduling** (actors wake at their next due time, RT6/RT7, P4) makes active ticks cheaper (fewer actors touched per minute) and idle catch-up a jump instead of a crawl. It is the single change that helps both modes most | both |
| AC5 | **The perf gate measures the wrong tick for active play.** `nodeTickMs` in `scripts/perf/budgets.json` times `advanceSimulation` alone (about 10 ms crowded), which hides the ~800 ms live tick. Add a live tick p95 with render, plus single-tick and batched metrics, so both modes have a budget | both |
| AC6 | **Save writes.** The gate saw about 25 MB per minute of localStorage writes on crowded. Active play saves more often. Dirty-slice or debounced saves, and the Electron file or IndexedDB route, cut main-thread time and disk wear | both |
| AC7 | **Sim off the main thread.** Electron (AD39) makes a worker or utility process cheap. With retained sim state (P5), the UI stays responsive even when a tick is slow, so a slow tick costs only speed, not jank | both |
| AC8 | **Real-time encounters are the one place where a numeric kernel would fit.** Combat, chases or a Vampire Survivors style panel (DS11) are small dense loops at a fixed 30 to 60 Hz timestep. Make each one an isolated encounter kernel: its own state, typed-array JS first, a summary result committed back to the world sim as one command, PixiJS for drawing (EG1). WASM only if one kernel passes a few thousand entities and still misses its frame budget | active |
| AC9 | **Command log plus seeded RNG.** Active play makes bug repro, undo and replay valuable. One log of commands also lets bot playtests (EL40) compare idle catch-up against live play for the same inputs, which checks AC4's jumps | both |
| AC10 | **Active versus idle is a time policy, not a second game.** The same commands and sim, with the clock set per system: live at 1x with inputs, batched, or jumping. The §7 question then becomes per-system dials (how much runs alone, how much an active choice pays), set per world | both |

**LATER / DELEGATE** (proposals; none authorized by this pass)

| Item | Level, effort | Done check |
|---|---|---|
| L1. Implement AC2 (shared preview facts) | sonnet, medium | crowded live tick p50 under 150 ms in the probe; previews byte-equal before and after over a scripted run; focused tests pass |
| L2. Add live-tick metrics to the perf gate (AC5) | sonnet, small | gate reports single-tick p50/p95 with render for all three fixtures |
| L3. P1 vitals hoist and P2 clone-on-read | sonnet, small to medium | 512-person batched rate improves; no save diff over a scripted run |
| L4. Encounter kernel spike for one real-time panel (AC8) | opus to design, sonnet to build | 60 Hz with 1,000 entities in Electron, with the result committed as one command |
| L5. Propose per-system time-policy defaults for §7 (AC10) for Weibao to play-test | sonnet, small | a short proposal in the §7 owner, not a decision |

## Round 3: Rust for foundations, threads, sound and the browser (2026-10-24)

Weibao asked what Rust would make easier for future foundation work, and about
multithreading, more sound effects and browser support. Proposals and
background knowledge, not measurements. Browser support claims are general
platform knowledge as of mid-2026, not tested in this repo.

Current state checked: the only audio is an opt-in Web Audio cue in
`src/settled_text_effects.js` (sound off by default). No COOP/COEP headers are set
in `desktop/` or the served page, so `SharedArrayBuffer` is unavailable today.

### What Rust would make easier

| Code | Benefit | Real for this repo? | JS route to the same benefit |
|---|---|---|---|
| RS1 | **Safe shared-memory threads.** The compiler rejects data races; rayon-style parallel loops | Only after the sim is split into independent partitions (per world, region or encounter). Today's tick is one object graph with ordered reads and writes, so no language can thread it without that split | Workers per partition with message passing; `SharedArrayBuffer` plus `Atomics` for typed-array kernels |
| RS2 | **Exhaustive state machines and schemas.** Enums plus `match` force every case to be handled; serde gives typed save decoding | Real. Save integrity and migrations are a standing risk (AGENTS safety) | TypeScript strict with discriminated unions plus a runtime schema library for saves; property tests |
| RS3 | **Compact memory layout** for very large populations (struct-of-arrays, no per-object headers) | Only at tens of thousands of simulated people | Typed arrays for hot numeric fields alongside the object state |
| RS4 | **Determinism.** No hidden `Date` or iteration-order reliance in safe code | Helps replays (AC9) | Seeded RNG, integer math and an `npm run check` lint against `Date`/`Math.random` in `src/` sim code |
| RS5 | **One core for native, mobile and a Godot successor** (godot-rust/gdext) | Only if a scene-centered successor starts (EG2) | Host-free `src/` (AD39) already keeps the web build portable |
| RS6 | **WASM as a mod sandbox.** Mods compiled to WASM run with no file or network access unless the host grants it | Real for DS9 (untrusted mods), and independent of the core's language: a JS core can host WASM mods too | Data-only mods first; a WASM plugin host later |

What Rust makes harder, for good: hot reload and live content tweaking, the
design churn AD5/AD38 call for, scripting and mods (an embedded language such as
Lua or Rhai would be needed), roughly 700 content-heavy modules to port, and
fewer agents that write it fluently.

### Multithreading

- **MT1.** Threads help only work that can run apart. Good candidates here: the
  catch-up for a world the player is not in, worldgen and history generation,
  pathing, real-time encounter kernels (AC8), save compression and hashing. A
  single world's tick is not one of them until its systems stop reading each
  other's live state mid-tick.
- **MT2.** WASM threads in a browser need cross-origin isolation (COOP and COEP
  headers) to unlock `SharedArrayBuffer`. That blocks some third-party embeds. In
  Electron, the main process can set the headers on the app's own pages, so it is
  cheap there.
- **MT3.** The first threading step is the same in any language: move the sim off
  the main thread with retained state (AC7/P5). That alone removes the jank, and
  it needs no Rust.

### Sound effects

- **SX1.** More sound is mainly content and mixing, not language. Web Audio
  handles many simultaneous sounds in JS. A small library (Howler.js for
  samples, ZzFX or jsfxr style generators for procedural blips, Tone.js for music)
  covers an RPG's needs.
- **SX2.** The one place Rust or WASM earns its keep in audio is custom DSP
  inside an `AudioWorklet`: procedural ambience, synthesized spells, physical
  modelling. That runs on the audio thread, needs no `SharedArrayBuffer` for basic
  use, and is a self-contained kernel with a tiny boundary. A good first Rust
  experiment if one is wanted.
- **SX3.** Sound needs the same time split as AC3. Cues fire from sim events
  with timestamps. They must not fire per tick during catch-up (a week of batched
  ticks would play thousands of sounds), so batched and jump modes summarize
  instead of playing.
- **SX4.** Keep text sufficient (the existing settled-text rule): every sound
  pairs with visible text, and sound stays opt-in.

### Browser

- **BR1.** Rust compiled to WASM runs in every current major browser and in
  Electron. Limits: WASM cannot touch the DOM directly (JS glue does that), each
  JS-WASM call has a cost, so call it per batch and not per object, the module adds
  download size (hundreds of KB to a few MB), and threads need MT2.
- **BR2.** Debugging is weaker than JS. Source maps and DWARF support exist, but
  stepping through Rust in browser devtools is rougher than through JS.
- **BR3.** The browser stays the test target (AD39 defaults). Any WASM kernel
  needs a pure-JS fallback or a shared conformance test, so headless Node tests
  and the game MCP keep working.

### Where Rust could pay off first (ranked proposals)

1. **Audio DSP in an AudioWorklet (SX2):** isolated, no save impact, small boundary, easy to drop.
2. **Worldgen or history generation in a worker (MT1):** batch, numeric-heavy, runs once per world, with output as data.
3. **A real-time encounter kernel (AC8):** only if typed-array JS misses its frame budget.

None should come before AC2, AC4 and AC7, which fix the measured costs in JS.

### LATER / DELEGATE

| Item | Level, effort | Done check |
|---|---|---|
| L6. Lint for `Date.now`, `Math.random` and object-order reliance in sim modules (RS4) | sonnet, small | `npm run check:arch` flags new uses; current uses listed |
| L7. Typed save schema with discriminated unions for the expansion slice (RS2) | sonnet, medium | invalid fixtures rejected with a named field; committed fixtures pass |
| L8. Sound cue bus fed by sim events, with a catch-up summary mode (SX3) | sonnet, medium | a week of batched catch-up plays at most one summary cue |
| L9. AudioWorklet Rust/WASM spike (SX2) | sonnet, small | one procedural cue plays in Electron and Chrome; a JS fallback exists |

## Architecture view (2026-10-24)

A target shape that ties rounds 1 to 3 together. Proposal only, not an accepted
decision. It restates the measured fixes as layers; AR1–AR16 still govern how
any of it lands.

Most measured costs trace to two missing layers (derived data and a projection
boundary), not to the language.

| Layer | Role | Today | Measured fixes it covers |
|---|---|---|---|
| A1. Sim core | Single authority on state; commands in, events out; no UI code; due-time scheduler at its heart; runs off the main thread (worker or Electron utility process) | Runs on the main thread inside the same task as render and persist; every actor is touched every game minute | AC7, P5, AC4 |
| A2. Time drivers | Live (1x plus input), batched and jump are drivers over the same core, not separate code paths; per-system time policy set per world | Live and batched share `runEngineTicks`; no jump driver; no player offline policy | AC4, AC10, P4 |
| A3. Derived data (missing) | Facts and command availability computed once per state version, memoized and dependency-tracked, one owner per derived fact | Each view and preview rebuilds facts its own way; predicate-limited reads bypass the frame cache; per-actor maps rebuilt every minute, one of them quadratic | AC2, P1, P3 |
| A4. Projection boundary (missing) | The core publishes immutable, version-stamped snapshots or patches; the UI reads only those | Callers read live state and clone it defensively on mutable reads (`planning_read_frame.js:9`) | P2, AC3 |
| A5. Presentation | Visible, changed panels only, at frame cadence; input maps straight to a command with an immediate preview; sound subscribes to sim events and receives summaries in batched or jump time | All panels re-render and re-preview after every tick | AC3, SX3, SX4 |
| A6. Kernels | Dense numeric subsystems (encounters, worldgen, pathing, audio DSP) behind plain-data interfaces: arrays in, summary out; language chosen per kernel by measurement | None yet | AC8, SX2, MT1 |
| A7. Persistence and extension | Command log plus periodic snapshots; dirty-slice saves with per-slice migrations; data mods first, a WASM mod sandbox later | Full save written about every tick (~25 MB/min on crowded); no command log | AC6, AC9, RS6 |

Consequences:

- **The A4 boundary is the same one a worker or WASM module needs.** Once it
  exists, Rust becomes a per-kernel choice (A6) made on measurement. Without it,
  adopting Rust means rewriting the whole sim.
- **The first structural gap is the missing version stamp.** A state version
  that bumps on each committed change gives A3 its memo key and A4 its snapshot
  identity. The other layers depend on both.
- **The fit with existing rules:** one authority per fact (AR), `main.js` as a
  composition root, and host-free `src/` (AD39). A3's derived owners are the
  same "one authority" rule applied to computed facts.
- **Order of build** follows dependency: version stamp, then A3 and A4, then A5
  and A1's thread move, then A2's jump driver (after the offline policy decision),
  then A6 and A7 as needs arise.
