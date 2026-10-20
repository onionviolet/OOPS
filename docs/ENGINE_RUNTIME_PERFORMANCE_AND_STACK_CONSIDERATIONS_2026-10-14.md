# Engine, runtime, performance and tech stack: considerations, 2026-10-14

> Codes renamed 2026-10-19 from CX1-CX35 to ECX1-ECX35 to avoid collision with registered CX (complexity guardrails). See [reserved prefixes](RULES_INDEX.md#reserved-prefixes-2026-10-19).

Proposal palette, not a spec. Weibao asked: "engine level stuff, runtime,
performance, and tech stack stuff, more to consider? other stuff and more?
save and extend accordingly. Send out codex as useful?"

Existing owners keep their areas. This doc extends them; it does not restate
their rows.

| Owner | Covers |
| --- | --- |
| [Engine, saves and scale review](ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) | E1-E10: save identity, recovery, transactions, history, workload, clocks, ownership, diagnostics, long sessions |
| [Engine expansion](ENGINE_EXPANSION.md) | Five engine boundaries, scheduler, content modules, delivered runtime increments |
| [Engine authoring](ENGINE_AUTHORING.md) | APIs and compatibility for content authors |
| [UI at scale](UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md) | EN rows: UI engineering guards, contribution registry |
| [Offline time audit](research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md) | F1-F9: how time actually advances today |
| [Procedural generation status](PROCEDURAL_GENERATION_STATUS_2026-10-13.md) | Generator inventory |

## Where things stand

Read from source and the working tree on 2026-10-14. Not benchmarks.

- **Stack.** Plain ES modules, no TypeScript, no UI framework. esbuild 0.25.10
  bundles `src/main.js` to one minified ESM file. Only runtime dependency is
  inkjs 2.4.0. Tests run on `node --test`. Node >= 22.13.
- **Size.** 417 files in `src/`, about 97.7k lines. `src/main.js` alone is
  8,579 lines. `dist/bundle.js` is 5.1 MB minified, its map 13 MB. 98 test
  files. `dist/nethack-fieldcraft-preview.js` (2.9 MB) is a separate preview
  page's bundle, still referenced by `nethack-preview.html:9` (ER2-F6;
  corrected 2026-10-14, round 1 wrongly called it stale).
- **Loop.** Main time advances by recursive `setTimeout`, one game minute per
  wall second at default tickrate (offline audit F2). Actions and combat run
  separate timers. 16 `setInterval` calls across 10 files poll UI, including
  a 250 ms refresh of five panels in `src/main.js:8347`.
- **Saves.** `localStorage` only, 4 MiB guard, Web Lock for one writer
  (E-review). No IndexedDB, OPFS, worker or service worker.
- **Determinism.** Expansion RNG is saved; native `main.js` still uses
  `Math.random` (E-review E7). No whole-game replay.
- **Last perf numbers** are 2026-10 synthetic results in `PLAYTEST.md`
  (64-helper tick ~129 ms, crowded command p95 115 ms). No current profile.

**Round 2 evidence (ER1, MEASURED on a contended host):** joined-time play
writes a full save transaction per consumed minute; a crowded synthetic save
reached 1.58 MB with median serialize 4.23 ms but validation 509 ms. See the
[hotspot audit](research/RUNTIME_HOTSPOT_AUDIT_2026-10-14.md) top 10.
ER2 [structure audit](research/CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md):
four import cycles (55 and 36 modules in the big two), `main.js` imports 245
src modules, `npm test` 628 tests in 172 s including a headless Chrome
journey. ER4 [idle and sim references](research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md)
profiles 19 games. ER3 [tech stack options](research/TECH_STACK_OPTIONS_2026-10-14.md) ranks
JSDoc checkJs slice, ESLint slice and one Playwright roundtrip first.

The scope pressure is the same one UI at scale names: many worlds, many
systems, many actors, long campaigns. The engine questions below follow from
that, not from a measured failure.

## Lane results so far (updated round 6)

Proposals and measurements, not accepted decisions. Each lane owns its detail.

| Lane | Headline |
| --- | --- |
| [ER5 engines](research/GAME_ENGINE_OPTIONS_2026-10-14.md) | Keep DOM/JS; PixiJS for selected visuals; trial Tauri for desktop; Godot only for a scene-centered successor; Rust only with measured end-to-end benefit. Agrees with EG0/EG1/EG5. |
| [ER6 libraries](research/LIBRARIES_TO_INCORPORATE_2026-10-14.md) | 26 packages checked. Top five: Valibot, @preact/signals-core, Playwright, mitt, miniplex (conditional). |
| [ER7 spikes](research/ENGINE_SPIKES_2026-10-14.md) | ECS gave no universal speed win (filtering mattered more). Worker transfer did not remove JSON step cost. Gzip cut synthetic saves ~93%; SQLite helps only for small updates. |
| [ER8 NPC sim](research/SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md) | Sourced survey plus phased NPC architecture proposal (stores, scheduler, LOD, knowledge, saves). |
| [ER9 micro](research/MICRO_CORRECTNESS_AUDIT_2026-10-14.md) | 14 ranked findings. High: ordinary save path skips full validation (money/counters), durable vs live disagreement on adapter failure, progress overwritten during import. Confirms no leave-save hook (MC15). 63 `Math.random` sites classified. |
| [ER10 browsers](research/BROWSER_PLATFORM_BEHAVIOR_2026-10-14.md) | Four-browser lifecycle, throttling and storage tables with dated sources, mapped to code. |
| [ER12 kernel](research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md) | Kernel APIs, two filled manifests, cycle cuts and extraction order from current code. |
| [ER14 kernel spike](research/KERNEL_SPIKE_2026-10-14.md) | 15 checks pass. Copying whole actor slices dominates adapter cost; crowded settlement 92.9 ms median even with a heap scheduler. Structural sharing (LB3) matters more than the scheduler. |

All lanes ER1-ER18 have returned. The rest are folded in section U below.

## A. Runtime architecture (RT)

**RT1. One clock, many consumers.** Today the calendar, action timer, combat
timer and expansion clock each run their own loop (F2, F6, F7). Consider one
fixed-step simulation clock that every consumer subscribes to, with render on
`requestAnimationFrame` and sim on its own cadence. Default: keep loops, add a
shared "advance N minutes" entry point first. Dial: full single clock.

**RT2. Pure step function.** `step(state, minutes, rng) -> {state, events}`
with no DOM. It enables tests, offline catch-up, workers and replays at once.
The expansion engine is already close to this; native `main.js` is not.

**RT3. Event bus over polling.** Replace the 250 ms panel refresh and other
`setInterval` pollers with change events or dirty flags per domain. Panels
render when their inputs change. Cheap to start one panel at a time.

**RT4. Read models.** Derived views (what can I do, what is running, totals)
computed once per tick and memoized on actual dependencies, not recomputed
per panel. Pairs with E6 and UI at scale IN rows.

**RT5. Command layer.** Every player action as a serializable command
`{type, args, at}` through one dispatcher. Gives undo/rewind hooks, input
logging for bug reports, macro/automation cheats and test scripts for free.

**RT6. Scheduler as priority queue.** Due-time heap of jobs, actors and world
events, so cost scales with what is due, not with total content (E5). The
expansion scheduler already visits next boundaries; extend the pattern.

**RT7. Tiered simulation (LOD).** Active world full detail; supported worlds
coarse ticks; dormant worlds frozen or summarized on return. Same idea for
NPCs: near the player, named, background statistics. Per-world dial, matching
the absence policy in F9.

**RT8. Catch-up as fast-forward.** Offline or background time replays
through RT2 in chunks with a yield between chunks and a progress bar, or
through closed-form approximations where results are provably equal. Who gets
offline time stays a per-system policy (offline audit; food direction).

**RT9. Deterministic core.** Seeded, named RNG streams per domain (combat,
loot, weather, world events), saved. Lets "same seed, same run" exist as a
dial for challenge runs, rewind cheats and bug reproduction.

**RT10. Plugin/content module contract.** Worlds and systems register through
a manifest (ids, schema version, save domain, panels, commands, hooks) instead
of being imported by hand into `main.js`. Pairs with UI at scale SC rows and
E8. Makes "add a world" mostly additive.

## B. Performance and measurement (PF)

**PF1. A standing benchmark harness.** Three synthetic saves (fresh, mid,
crowded long history) built from fixtures, never Weibao's saves. Node runs
the pure step; browser runs the full page. Track tick cost, catch-up cost,
save bytes, load time and input p95 over time.

**PF2. Budgets, not vibes.** Proposed targets from E-review: input p95 under
100 ms, no main-thread task over 50 ms in routine play. Add: a tick budget in
ms per simulated hour, save size per world, bundle size ceiling.

**PF3. Perf overlay.** Dev-only panel showing tick ms, render ms, long tasks,
listener count, save size and memory. Turned on by a URL flag. Makes perf
regressions visible during normal playtests.

**PF4. Startup cost.** 5.1 MB minified JS parses on every load. Consider
code splitting per world (dynamic `import()`), lazy ink stories. ER2: `main.js` is only 4% of bytes; a contracts JSON
(262 KB) is the largest input and retained Ink versions are deliberate save
compatibility. Measure parse/compile time first.

**PF5. Render cost.** Keyed row updates instead of rebuilding lists; virtual
lists for long logs, inventories, NPC rosters; `content-visibility: auto` for
offscreen panels. Measure before choosing.

**PF6. Allocation and GC.** Long idle sessions churn objects every tick.
Watch for whole-state clones (E6), string-built HTML and growing arrays.
Struct-of-arrays only if a profile shows actor loops dominate.

**PF7. Background tab behavior.** Browsers throttle timers in hidden tabs.
Measure, then pick: pause and catch up on return (RT8), or keep a worker
ticking. F5 says the current loop is not equivalent.

**PF8. Big numbers.** Idle growth can overflow doubles. Decide per system
whether values stay bounded (life-sim scale) or need a big-number type
(break_infinity style) for cheat or prestige layers. Default: bounded, with
an overflow test.

## C. Persistence and data (DA)

Extends E1-E4; does not replace them.

**DA1. Storage backend tiers.** localStorage for small settings; IndexedDB
or OPFS for saves past the 4 MiB guard and for per-world chunks. Migrate only
with a recovery contract (E2).

**DA2. Save chunking.** Split saves by domain or world so a write touches only
what changed. Dormant worlds stop costing write time.

**DA3. Compression.** `CompressionStream` (gzip/deflate) for exports and
large chunks. Keep a readable summary export separate from the raw save (E9).

**DA4. Schema registry.** Every save domain declares a version and a migrate
function; one test runs every migration chain on fixtures. Ties to V06
migration practice.

**DA5. Content as data.** More worlds, items, skills and events as JSON or
JS data tables with a schema and a linter, less as hand code. Enables content
hot reload and generated content diffs.

**DA6. History log compaction.** E4 retention classes plus a ring buffer for
presentation logs and an append-only ledger for gameplay evidence.

**DA7. Cloud or file sync (dial).** File System Access API "save to folder"
on desktop Chrome; optional later sync. Purely optional; local-first stays
default.

## D. Tech stack options (TS)

Palette, each with a cost. None adopted.

**TS1. Type checking without a rewrite.** `// @ts-check` plus JSDoc and
`tsc --noEmit --checkJs` file by file. Catches shape bugs in save and content
code; no build change. Full TypeScript is the dial.

**TS2. Lint and format.** ESLint flat config with a few rules that matter
(no unused vars, no implicit globals, no `Math.random` outside an allow-list).
Keeps parallel agent work consistent.

**TS3. Browser test runner.** Playwright for the fresh-origin build, save,
reload and import gates that AGENTS.md already requires. Turns the manual
verification ritual into a script.

**TS4. Workers.** Move the pure step (RT2) into a Web Worker for catch-up and
heavy simulation. Needs RT2 first; postMessage cost must be measured.

**TS5. UI layer.** Keep vanilla DOM plus a tiny reactive helper (signals, or
lit-html/Preact islands per panel) if RT3 grows. A full framework rewrite is
the expensive dial, not the default.

**TS6. Desktop wrapper.** Tauri or Electron gives a real file system, no
storage quota, no tab throttling and a Steam path. Desktop-first direction
makes this more relevant than a PWA. PWA offline install is the cheap dial.

**TS7. WASM for hot loops.** Only if a profile shows a pure numeric loop
(pathing, large actor sims, procedural generation) dominates. Unlikely soon.

**TS8. Dev server and hot reload.** esbuild `serve`/watch mode with live
reload instead of rebuild plus python server. Faster loop for every agent.

**TS9. Ink and narrative tooling.** Keep inkjs; consider precompiling all
stories at build and lazy loading per world (PF4).

## E. Codebase health (CH)

**CH1. Split main.js.** 8,579 lines. Extract by owner: time loop, save/load,
action timer, combat glue, panel wiring. One extraction per change, tests
first.

**CH2. Module dependency map.** Generate an import graph (esbuild metafile).
Find cycles, dead modules and the many `audit_remainder_*` / `absorb_*`
families that may duplicate patterns.

**CH3. Bundle composition.** Metafile analysis: which modules dominate the
5.1 MB. Data tables, ink JSON, duplicated helpers.

**CH4. Test pyramid.** Pure unit tests (fast, many), domain contract tests,
a few browser journeys (TS3). Track runtime of `npm test` as it grows.

**CH5. Agent-parallel safety.** Ownership manifest per folder, generated
indexes instead of hand lists (UI at scale SC), CI-like `npm run check` that
builds, tests and lints in one command.

**CH6. Feature flags.** A typed flag registry with default, owner and expiry,
so default-off systems (hunger, prototypes) do not rot.

**CH7. Error capture.** A global error and unhandled-rejection handler that
logs to an in-game diagnostics panel and a downloadable bug report (save
summary, command log from RT5, build fingerprint). No network.

## F. Other stuff (OS)

**OS1. Accessibility and input.** Keyboard command palette (UI at scale NV),
reduced motion, font scaling. Engine side: commands (RT5) make all of this
easier.

**OS2. Localization readiness.** String tables instead of inline text, at
least for new systems. Low priority; cheap if started early.

**OS3. Modding (dial).** Content modules (RT10) plus data tables (DA5) make
user packs possible later. Sandbox and save-compat policy needed.

**OS4. Security of local data.** Imports are untrusted input: size limits,
schema validation, no `eval`, no HTML injection from save strings (E-review
covers preflight; extend to every text sink).

**OS5. Versioned releases.** Tag playable checkpoints with the build
fingerprint so a save or bug report names exactly what ran.

**OS6. Energy use.** Idle games run for hours. Lower tick and render rates
when hidden or idle; laptop battery is a real desktop-first concern.

## G. Proper game engines (EG), round 2

Weibao asked about a "proper game engine". The honest frame: this is a
text- and panel-heavy idle life sim with 98k lines of working JS. Engines
shine at rendering, physics, scenes and asset pipelines; this game's hard
problems are simulation, state, saves and dense UI. So the options are
ranked by how much of that they actually help.

**EG0. Stay on the web stack, engine-ify it (default).** Adopt engine
patterns, not an engine: fixed-step loop (RT1), pure step (RT2), ECS or
actor store (LB1), scene/world manifests (RT10), asset and content pipeline
(DA5). Zero port cost, keeps every existing gate and save.

**EG1. Hybrid: DOM UI plus an embedded renderer.** Keep panels in DOM; add a
PixiJS or Phaser canvas only where visuals earn it (map, travel, combat
stage, VFX, a home or settlement view). Reversible per panel.

**EG2. Godot 4 (GDScript/C#).** Strong UI nodes, scene system, free, desktop
exports, Steam-friendly. Web export is heavier and C# web export is limited.
Port means rewriting all logic; saves need a converter. Dial for a
"YAIRPG 2" or a desktop shell, not a migration of the current game.

**EG3. Unity or Unreal.** Most capable, most overhead; WebGL builds are
large; licensing and editor weight. Poor fit for a text-dense idle sim.

**EG4. Rust core (Bevy ECS or plain Rust) compiled to WASM, JS UI.** Fast,
deterministic, type-safe simulation; UI stays web. High rewrite cost; worth
it only if the sim core becomes the bottleneck and RT2 exists to port.

**EG5. Desktop shell over the web game.** Tauri 2 or Electron (TS6) gives
most "real game" benefits (files, no tab throttling, Steam, no quota)
without leaving JS. Cheapest path to "feels like a proper game".

**EG6. Web game frameworks.** Excalibur, Kaplay, Phaser (scenes, input,
audio, tweening) for sub-views; Babylon/three for 3D only if a world wants
it. Pick per sub-view under EG1.

**EG7. Narrative engines.** inkjs stays. Yarn Spinner (JS port) or a
storylet system (Failbetter-style qualities) for procedural story; see the
procedural story palette.

Decision rule (proposal): stay EG0, add EG5 when a desktop build is wanted,
EG1 per visual panel. Revisit EG2/EG4 only if the measured profile or a
platform goal makes the web runtime the blocker.

## H. Libraries and tools to incorporate (LB)

Each is a candidate, adopted only behind an adapter with a save decision.

**LB1. ECS / entity store.** bitECS, miniplex or Koota for actors, NPCs,
companions, items with components. Gives fast queries ("all hungry actors in
world X") and clean save shape. Start with one domain (NPCs).

**LB2. sqlite-wasm on OPFS.** Real queries over saves, history and world
facts; transactions for E3; incremental writes. Heavy (~1 MB) but solves
DA1/DA2/DA6 together. Spike before choosing.

**LB3. Immutable/structural sharing.** Immer or hand structural sharing for
cheap snapshots, undo, rewind cheats and diffing (pairs with derived
snapshots work).

**LB4. Signals.** @preact/signals-core or similar for RT3/RT4 read models.
Tiny, framework-free.

**LB5. Schema validation.** Zod, Valibot or TypeBox for saves, imports and
content tables (DA4, DA5, OS4). Valibot is the small option.

**LB6. AI building blocks.** Utility AI scoring, GOAP or behavior trees for
NPC daily life; Yuka is a JS game-AI library. See section I.

**LB7. Pathfinding and maps.** ngraph.path or easystarjs if maps grow; LDtk
or Tiled for authored maps; rot.js for roguelike grids, FOV and dungeon gen.

**LB8. Procedural generation.** Seeded PRNG (pure-rand, seedrandom), noise
(simplex-noise), Tracery-style grammars and WaveFunctionCollapse for content.

**LB9. Audio.** Howler.js or plain Web Audio for ambient and cues, behind
the existing effects settings.

**LB10. Dev tooling.** Vitest or keep node:test; Playwright (TS3); a
content editor page (CastleDB-like table editor over DA5 data); Storybook-
style panel gallery for PANEL_KIT acceptance.

**LB11. Local telemetry.** Opt-in, local-only event log for playtests:
time per activity, panel opens, stuck points. Feeds balance without any
network.

## I. Simulation and NPC architecture (AI)

**AI1. Needs-driven agents (The Sims).** Needs decay, objects advertise
satisfaction, agents pick by utility. Matches life-sim north star and
hunger direction.

**AI2. Schedules and routines (Stardew, Rimworld jobs).** Daily schedules
with interrupts; job queue with reservations (E3).

**AI3. Storylets and drama manager (RimWorld storyteller, Fallen London).**
A director paces events by tension and player state; storylets fire on
qualities. Pairs with procedural story palette.

**AI4. Social simulation (Dwarf Fortress, CK3, Prom Week).** Relationship
graph, opinions with decaying modifiers, rumor spread. Needs LB1 queries and
RT7 LOD to scale.

**AI5. Off-screen abstraction.** Named NPCs far away resolve by statistics
and are "re-hydrated" with consistent history when met (RT7).

**AI6. Knowledge model.** Actor-qualified beliefs, already required by E9
and sealed secrets; an engine-level "who knows what" store.

**AI7. Faction and economy sim.** Markets with supply/demand, faction goals
and territory as slow background systems on the scheduler (RT6).

## J. More other stuff (OS, continued)

**OS7. Replay and time-travel debugging.** RT5 command log plus RT9 seeds
replays any bug report exactly; a dev scrubber over snapshots.

**OS8. Headless sim runs.** Run 100 years of a world in Node overnight to
find balance breaks, runaway economies and dead content. Needs RT2.

**OS9. Save inspector.** Dev page that loads a synthetic save and shows
domains, sizes, versions and dangling ids (never Weibao's saves unasked).

**OS10. CI.** GitHub Actions: build, test, lint, bundle-size check on push.
Cheap guard for many parallel agents.

**OS11. Content hot reload.** Edit a data table, the running game reloads
that table without a restart (DA5 + TS8).

**OS12. Steam/itch distribution path.** Only relevant with EG5; note
achievements, cloud saves and overlay as later dials.

## K. Subtle micro stuff (MC), round 3

Small details that break idle games quietly. Each is cheap to check and
costly to discover in a 200-hour save. Spot-checked 2026-10-14: no
`beforeunload`/`pagehide`/`visibilitychange` save hook in `src/` (only two
VFX files listen); 42 `Math.random` calls in 6 top-level `src/*.js` files (ER9 found 63
across all of `src/`; corrected); 12 files use
`localeCompare` or `toLocaleString`.

### Time and timers

**MC1. Timer clamping.** Nested `setTimeout` clamps to 4 ms; hidden tabs to
about 1 s; Chrome's intensive throttling to once a minute after 5 minutes
hidden. A loop that assumes "one callback = one minute" drifts (F2, F3).

**MC2. Monotonic vs wall clock.** `performance.now()` for durations,
`Date.now()` only for calendar labels. System clock changes, sleep and NTP
jumps must not grant or erase progress.

**MC3. Timezone and DST.** `saved_at` has no timezone (F4). Any "daily" or
"per real day" rule needs an explicit zone rule, or DST days give 23 or 25
hours.

**MC4. Split vs single advance.** Advancing 60 minutes once must equal 60
advances of 1 minute (E5). Rounding per step, integer division and
"at least 1" floors break this silently.

**MC5. Sleep and resume.** Laptop lid close: timers stop, then one huge
delta arrives. Cap per-frame delta, route the rest through catch-up (RT8).

### Numbers

**MC6. Float drift.** Adding 0.1 per tick for a year drifts. Keep XP, money
and time as integers or fixed-point (tenths, hundredths), format at display.

**MC7. NaN and Infinity poison.** One `NaN` in a stat spreads through every
sum and `JSON.stringify` turns it into `null`. Guard at write boundaries and
in validation.

**MC8. Rounding policy.** Pick one per domain (floor for costs paid? round
for display?) and document it. Display "100%" when it is 99.6% causes "why
did it fail" bugs.

**MC9. Safe integer range.** Counters past 2^53 lose precision (PF8); tick
counters over a long campaign are the likely first offender.

**MC10. Cross-engine math.** `Math.sin/exp/pow` results may differ by an ulp
between browsers. Fine for display; not for deterministic replay (RT9).
Use integer or table-based math where replay matters.

### Determinism and ordering

**MC11. RNG consumption order.** Adding one roll early shifts every later
roll in a stream. Named streams per domain (RT9) contain the blast radius.
Previews and tooltips must never consume RNG (E7).

**MC12. Iteration order.** Object keys that look like integers iterate
numerically first, then insertion order. Map/Set keep insertion. Sorting
must have a total tiebreaker (id), never rely on input order.

**MC13. Locale-dependent sort.** `localeCompare` without a fixed locale
orders differently per machine. Fine for display lists; never for anything
saved or rolled.

**MC14. Re-entrancy.** A command fired during a tick, or a render that
triggers another publish, can double-apply. One queue, one commit point.

### Persistence edges

**MC15. Save on leave.** `beforeunload` is unreliable; use `pagehide` and
`visibilitychange` to hidden for a last save. Currently absent.

**MC16. bfcache.** Back/forward restore resumes a frozen page with old
timers and a stale Web Lock view. Handle `pageshow` with `persisted`.

**MC17. Storage eviction.** Safari can clear script-writable storage after
7 days without interaction; any browser may evict without
`navigator.storage.persist()`. Export reminders matter.

**MC18. UTF-16 byte count.** localStorage quota counts UTF-16; emoji and
non-Latin names cost more. The 4 MiB guard already counts this way; new
budgets must too.

**MC19. JSON blind spots.** `undefined` keys vanish, Map/Set/Date/BigInt do
not round-trip, `-0` becomes `0`. Validation should reject, not coerce.

**MC20. Cross-tab events.** `storage` events fire in other tabs; a second
tab showing stale state can still offer actions (Web Lock covers writes, not
display).

**MC21. Validation cost.** ER1-F2: validation dominates save cost. Validate
fully on import and load, incrementally on routine writes.

### DOM and render

**MC22. Layout thrash.** Reading `scrollHeight` after writing styles forces
reflow; ER1-F5 shows the 250 ms layout pass doing both. Batch reads, then
writes.

**MC23. Focus and scroll loss.** Rebuilding a list steals keyboard focus,
resets scroll, closes open tooltips and drops text selection. Keyed updates
(PF5) fix this as a side effect.

**MC24. Hover and click races.** A row that re-renders under the cursor eats
clicks. Do not rebuild the element being hovered or pressed.

**MC25. Double commit.** Double-click or key repeat sends a paid command
twice. Commands should be idempotent by id or disabled until settled.

**MC26. Number jitter.** Proportional fonts make ticking numbers shake. Use
`font-variant-numeric: tabular-nums` on counters and timers.

**MC27. Animation cost when hidden.** rAF stops in hidden tabs, but
`setInterval` VFX loops (30 ms, ER1-F10) keep running. Pause on hidden;
respect `prefers-reduced-motion`.

**MC28. Error isolation.** One thrown error inside a tick or a panel render
can stop the whole loop. Wrap each consumer, log once, keep the clock alive
(CH7).

### Text and formatting

**MC29. Number format consistency.** One formatter for 1.2k / 1.2M / time
durations, used everywhere. Mixed "1,200" and "1.2k" reads as two numbers.

**MC30. Pluralization and grammar.** "1 days", "an hour" vs "a hour".
`Intl.PluralRules` or a tiny helper.

**MC31. Unicode names.** NFC-normalize player-entered names; count length
by grapheme, not UTF-16 unit; escape before any HTML sink (OS4).

### Process micro

**MC32. Cache busting.** Bundle fingerprint exists; check style and any
lazy chunks follow it, or players load mismatched code after an update.

**MC33. Source maps.** The 13 MB map ships next to the bundle. Fine locally;
exclude it from any public build or serve it separately.

**MC34. Seeded tests.** Tests that use `Math.random` or `Date.now` flake
under load. Inject clock and RNG.

## L. Building our own engine (OE), round 4

"Our own engine" here means extracting what already exists into a named,
reusable core with a stable API, not starting over. The repo already has
most engine parts scattered: expansion scheduler, save envelopes, RNG
streams, world instances, host/content/facts modules (ER2-F4), ink runtime.

**OE1. Kernel.** A small core with no DOM: clock (RT1), scheduler (RT6),
command bus (RT5), seeded RNG streams (RT9), event bus (RT3) and a
transaction commit (E3). Everything else plugs in.

**OE2. Store.** One state store with domain slices and stable ids (E8).
Entity/component storage (LB1) for actors and items; plain slices for
singletons like calendar and settings.

**OE3. Module system.** Worlds and systems as modules with a manifest:
`{id, version, depends, schema, migrate, commands, systems, panels,
content}` (RT10). Load order resolved from `depends`. Breaks the 55- and
36-module cycles (ER2-F3) by making registries data, not imports.

**OE4. Content compiler.** Build step turns authored tables, ink and
generators into validated, hashed content packs (DA5, TS9). Content
revision pinned in saves (E1).

**OE5. Persistence layer.** Domain-chunked saves (DA2), incremental
validation (MC21), migration registry (DA4), backend adapter
(localStorage now, IndexedDB/OPFS later), leave-save hooks (MC15).

**OE6. Presentation layer.** Read models (RT4) feed panels; panels are
dumb views with keyed updates (PF5). A renderer slot lets a canvas view
(EG1) sit beside DOM panels.

**OE7. Devtools.** Perf overlay (PF3), save inspector (OS9), command log and
replay scrubber (OS7), headless runner (OS8), content linter (DA5).

**OE8. Engine vs game boundary.** The engine never names a world, skill or
item. Test: could a different idle game run on it with only new modules?
If not, the boundary leaked.

**OE9. Versioned engine API.** Engine semver separate from content
revision. Modules declare the engine API range they need; mismatches fail
at load, not mid-campaign.

**OE10. Extraction, not rewrite.** Strangler pattern: new kernel runs
beside `main.js`; one system at a time moves onto it (expansion engine is
closest). Old and new paths share saves through adapters until the old one
is empty.

Why build it ourselves rather than adopt: no existing engine owns idle
catch-up, causal scheduling, save migration, sealed knowledge and
many-world identity. Those are this game's core, and they are already
half-built here. Why not: maintenance and second-system risk (SB1).

## M. Existing engines and frameworks, wider net (XE)

Extends EG with the long tail. One line each; ER5 and ER13 judge fit.

**Idle-specific.** The Modding Tree (Vue, prestige-tree framework),
Antimatter Dimensions codebase (Vue, open source), Incremental Game
Template, Kittens Game codebase. Closest genre peers; mine patterns, do not
port onto them.

**Narrative and text.** Twine/SugarCube, Ren'Py (Python, desktop),
Inform 7, ink (kept), Yarn Spinner, Dendry and storylet engines, Articy
(authoring). Useful for authoring pipelines, not as runtime hosts.

**RPG makers.** RPG Maker MZ (JS, Pixi based, plugin ecosystem),
Construct 3, GDevelop (JS, open source). Event-sheet tools; poor fit for a
98k-line codebase, good references for plugin APIs.

**2D/general.** Godot 4, Defold (Lua, tiny web builds), GameMaker, LÖVE
(Lua), Haxe/Heaps, MonoGame/FNA, raylib, Ebitengine (Go), Flame (Flutter),
Cocos Creator, PlayCanvas. Covered by EG2-EG6 logic: helps visuals and
packaging more than simulation.

**Sim cores and ECS.** Bevy ECS, flecs (C, has WASM), EnTT, Unity DOTS,
bitECS/miniplex/Koota (LB1). flecs via WASM is the interesting "proper ECS
in the browser" option.

**State and rules.** XState (statecharts for quests, jobs, encounters),
json-rules-engine, DataScript/Datalog (queryable world facts),
Automerge/Yjs (CRDT, only if sync or co-op appears).

**UI shells.** Tauri 2, Electron, Neutralinojs (tiny), Wails (Go), NW.js.
Tauri for size, Electron for Chromium consistency and Steam precedent.

## N. Engine-design subtleties (SB)

**SB1. Second-system effect.** An engine designed for every future world
before three worlds use it ends up fitting none. Extract after the third
use (ENGINE_EXPANSION's stopping rule already says this).

**SB2. ID stability.** Generated ids must be stable across content edits:
derive from authored keys, never array index or insertion order (MC12).

**SB3. Schema evolution direction.** Old saves load in new code always;
new saves in old code never, with a clear message. Unknown fields survive
round trips (forward-preserve) so a downgrade does not silently delete data.

**SB4. Hot reload state.** Reloading a module must keep its saved state and
drop only derived caches; otherwise devs test a state players never reach.

**SB5. Time ownership.** Exactly one module may advance time; every other
module reacts. Today there are several (F2, F6, F7).

**SB6. Read vs write APIs.** Panels and previews get read-only views
(frozen or proxied in dev) so a render cannot mutate state or roll RNG
(MC11, MC14).

**SB7. Engine errors vs content errors.** Bad content (missing id, failed
requirement) should degrade one module with a visible notice, not crash the
kernel (MC28).

**SB8. Performance contracts per module.** Each system declares rough cost
(per tick, per actor); devtools flag the one that breaks budget (PF2).

**SB9. Ordering contract.** Systems run in a declared order per tick, with
ties broken by id. Implicit import order is how heisenbugs start.

**SB10. Escape hatches.** A module can still drop to raw code for one weird
world rule. An engine that forbids escape hatches gets bypassed silently.

## O. Cheats that show the engine (ECX), round 5

Engine features can double as in-fiction powers: a seeded stream becomes
foresight, a snapshot becomes a save point, a perf overlay becomes a
status window. Existing owners already cover two families, so this section
only adds the engine-facing ones:
[simulators](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md) (forked futures,
seed locks, grades) and the
[fourth-wall ladder of reach](PRESENTATION_AND_FOURTH_WALL.md#when-can-they-reach-outside-a-ladder-of-reach)
(powers that touch the UI). Each row names the engine capability it needs.

| Code | Cheat (illustrative tier) | What the player sees | Needs |
| --- | --- | --- | --- |
| ECX1 | **Debug eye** | Hidden numbers: exact odds, cooldown ms, damage rolls | RT4 read models, E9 sealed filter |
| ECX2 | **Seed reader** | Next few rolls of one stream ("the next chest is a dud") | RT9 named streams, MC11 no-consume peek |
| ECX3 | **Seed nudge / reroll** | Spend to reroll one stream, or skip one roll | RT9, E3 transaction, abuse dial per world |
| ECX4 | **Save point** | In-fiction checkpoint, load on death | LB3 snapshots, DA2 chunk cost, E2 recovery |
| ECX5 | **Rewind tape** | Scrub back minutes or days | RT5 command log + RT9 replay (OS7), bounded history E4 |
| ECX6 | **Time dilation** | Personal speed-up or slow-down of the local clock | SB5 single clock owner, F9 world clocks, MC4 split equality |
| ECX7 | **Catch-up harvest** | Bank offline time and spend it as a burst | RT8 fast-forward, offline policy |
| ECX8 | **World LOD sight** | See dormant worlds run while away, or wake one | RT7 tiers, AI5 off-screen abstraction |
| ECX9 | **Command echo** | Macro or "repeat my last day" automation | RT5 commands, MC25 idempotence |
| ECX10 | **Event log reader** | Read the raw world ledger: who did what, when | DA6 ledger, AI6 knowledge filter |
| ECX11 | **Rule editor** (Baba Is You style) | Change one world rule value for a cost | DA5 content as data, OE3 module reload, SB4 hot reload |
| ECX12 | **Admin rights / GM account** | Spawn, edit stat, teleport, gated and expensive | Devtools exposed as cheats (OE7), CH6 flags |
| ECX13 | **Lag sense** | Feel when the world is "heavy" (many actors, catch-up) | PF3 overlay data, SB8 module costs |
| ECX14 | **Glitch walker** | Exploit authored seams: clip rules, desync a stream | MC classes kept intentional, sealed and bounded |
| ECX15 | **Save-file awareness** (Undertale, DDLC) | A character remembers your reloads | Profile-level memory outside the run (E1 profile id) |
| ECX16 | **Parallel save slots as selves** | Two slots that can trade items or knowledge | E8 carrier transaction across runs |
| ECX17 | **Headless dreams** | Run 100 years of the world overnight, read the history | OS8 headless runner, worker (TS4) |
| ECX18 | **Code sight** (top tier, fourth wall) | Read a pseudo-source of a system's rule | DA5 tables rendered as text; never sealed truth |

Rules carried from existing direction: per-world dials, no fixed "once"
limits, sealed secrets stay behind their routes even under ECX1/ECX10/ECX18,
and anti-abuse beyond save safety is low priority.

## P. Overarching principles (OV)

**OV1. One capability, three faces.** Every engine capability should serve
a dev tool, a player convenience and a possible cheat. Determinism (RT9)
gives replay bugs, "same seed" challenge runs and seed-reading cheats.
Prefer capabilities that earn all three.

**OV2. Determinism is a product feature.** Simulators, rewinds, seed
cheats and bug replay all depend on it. Treat any unseeded gameplay roll
as a bug class, not a style choice.

**OV3. Knowledge is engine-level.** Who-knows-what (AI6, E9) must live in
the kernel, because cheats like ECX1/ECX10 otherwise leak sealed truths.

**OV4. Time has one owner.** Dilation, offline time, catch-up, rewind,
world clocks and combat all need SB5. This is the most cross-cutting fix.

**OV5. Everything is data and commands.** Content as data (DA5) and actions
as commands (RT5) are what make modding, macros, rule cheats, replays and
tests possible together.

**OV6. Budgets are visible.** Perf, save size and catch-up cost are shown
in dev and optionally in fiction (ECX13), so scaling problems surface early.

**OV7. Desktop-first, local-first.** Engine choices assume a laptop
browser or desktop shell, local saves, no server. Keep it until Weibao
changes direction.

**OV8. Extraction over rewrite.** Every round of this palette resolves to
the same move: grow a kernel from code that already works (OE10).

## Q. Implementation implications (IM)

**IM1. Dependency order.** Most cheats and scaling paths sit on four
foundations: one clock owner (SB5), named seeded streams (RT9), a command
log (RT5) and snapshot/chunked saves (LB3, DA2). Build those first; ECX rows
then become content work.

**IM2. Snapshot cost sets cheat limits.** Rewind and save points cost save
bytes and write time (ER1: 1.58 MB crowded save, validation 509 ms). Per-
world dials should be expressed in engine cost, not arbitrary counts.

**IM3. Forks need workers.** Simulator forks and headless dreams run the
step function many times; on the main thread they block input. RT2 then
TS4 is the path.

**IM4. RNG migration breaks replays once.** Moving the 63 native
`Math.random` calls (ER9) onto streams changes outcomes for existing saves.
Needs a compatibility decision: new streams start at migration, old
history stays as recorded.

**IM5. Dev vs player builds.** ECX12 and devtools share code; a build flag
decides what ships ungated. Dev affordances must never be the only route to
a sealed secret.

**IM6. Tests follow capabilities.** Each foundation gets one property test:
split equals single advance, replay equals live, preview leaves state hash
unchanged, snapshot load equals live state.

**IM7. Save compatibility per step.** Each extraction (OE10) and each
foundation needs a migration or explicit compatibility decision, per
AGENTS.md. Plan it per step, not at the end.

**IM8. Parallel agents.** Kernel files get a single owner; modules plug in
through manifests so lanes stop colliding in `main.js` (ER2: 245 imports).

**IM9. Acceptance stays playable.** Engine work still ends at a slice
Weibao can play: e.g. "time dilation cheat works, saves, reloads, imports"
proves SB5 better than an internal test count.

## R. Comic worlds through the engine (CE), round 6

[Comic worlds considerations](COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md)
owns comic traditions (CW), industry habits as world laws (CL), comic
cheats (CK), and its own abstractions (CA). Canon-first order is unchanged.
This section only adds what comics demand from the engine.

**CE1. Retcons need a versioned fact store.** CL4/CK11/CA5 require facts
with valid-from, a change record and per-observer memory. Engine side:
facts are append-only events (DA6 ledger) and "current truth" is a derived
snapshot (pairs with the derived-snapshots prototype). Never overwrite.

**CE2. Multiverse means many cheap instances.** Earth numbers and variants
multiply world instances. Needs RT7 LOD (dormant Earths cost zero per
tick), DA2 chunked saves (one chunk per Earth) and shared content with
per-instance overrides, not copied content.

**CE3. Crossovers are cross-module events.** A crossover touches two world
modules at once. Needs OE3 `depends`, an E8 carrier for people and items,
and an ordering rule (SB9) for who resolves first.

**CE4. Power scale extremes.** Street level to cosmic in one roster. Pick
per world: bounded tiers with a rank (Power Grid style) by default, PF8 big
numbers only for genuinely cosmic layers. Combat math must not overflow or
flatten (MC6, MC9).

**CE5. Mantles and secret identities.** Identity (mantle, codename) is a
separate entity from the body and the person (LB1 components). Who knows
which person wears which mantle is the AI6 knowledge model.

**CE6. Status-quo pull.** A world law that drifts state back toward a
baseline over time. Engine shape: a scheduled homeostasis system per world
with a dial, run by RT6, cheap because it only touches tagged facts.

**CE7. Big events and event decks.** Crisis-scale events touch many worlds
and actors. Needs scheduled cross-world events, LOD-aware resolution (only
active worlds run in detail) and a catch-up summary for the rest.

**CE8. Panels as a render mode.** A comic presentation (panel grid, caption
boxes, speech balloons) is a presenter over the same read models (RT4, OE6,
EG1 canvas slot). Fourth-wall comic cheats then reuse the fourth-wall
ladder.

**CE9. Reboots as content revisions.** A reboot is a new content revision
of a world with an explicit save policy: keep the old run on its old
revision (E1), or migrate with a recorded retcon list.

### Engine cheats from comics (ECX, continued)

Comic cheats live in the comic doc's CK rows; these are the engine-facing
extras.

| Code | Cheat | Needs |
| --- | --- | --- |
| ECX19 | **Editor's desk**: see the content revision and pending retcons of a world | E1 revision pins, CE1 fact history |
| ECX20 | **Continuity anchor**: you remember facts across retcons others forget | CE1 per-observer memory |
| ECX21 | **Earth hopper's index**: list known instances, their tick tier and drift from yours | CE2 LOD tiers, diff of snapshots |
| ECX22 | **Gutter step**: act "between panels", i.e. inside a skipped catch-up window | RT8 chunked catch-up with yield points |
| ECX23 | **Cover date sense**: know how much time the world skipped while dormant | F9 world clocks, RT7 |

### Comic subtleties (MC, continued)

**MC35. Retcon vs save integrity.** A retcon must not delete items or
progress the player already earned; it changes facts, then reconciles
holdings through a recorded rule.

**MC36. Instance id drift.** Variant worlds generated from one template
need ids namespaced by instance, or two Earths share a "unique" artifact.

**MC37. Crossover double-apply.** One event resolved by two modules applies
twice unless it has one owner and an id (MC25 for events).

## S. Abstractions needed (AB)

Concrete engine abstractions, each with the smallest interface. Most exist
partly in code already (ER12 maps them). The comic doc's CA rows are world-
level; these are the kernel types under them.

| Code | Abstraction | Minimal interface (sketch) | Serves |
| --- | --- | --- | --- |
| AB1 | **Clock** | `advance(minutes)`, `now()`, subscribers by phase | SB5, ECX6, F9 |
| AB2 | **Scheduler** | `schedule(at, key, payload)`, `due(until)`, `cancel(key)` | RT6, CE6, CE7 |
| AB3 | **Command** | `{id, type, args, at}`; `dispatch(cmd) -> result` idempotent by id | RT5, MC25, ECX9 |
| AB4 | **RNG stream** | `stream(name).next()`, `peek(n)` without consuming, `state()` | RT9, MC11, ECX2 |
| AB5 | **Store and entity** | `get(id)`, `query(components)`, read-only view | OE2, LB1, CE5 |
| AB6 | **Fact store** | `assert(fact, at, source)`, `as_of(at, observer)`, `history(key)` | CE1, AI6, E9 |
| AB7 | **Transaction** | `begin()`, `stage()`, `commit()` with rollback; one per command | E3, MC14 |
| AB8 | **Persistence domain** | `{id, version, encode, decode, validate, migrate}` | DA2, DA4, MC21 |
| AB9 | **Module manifest** | `{id, version, engine, depends, domains, commands, systems, panels}` | OE3, RT10, CE3 |
| AB10 | **World instance** | `{id, template, revision, overrides, tier, clock}` | CE2, F9, RT7 |
| AB11 | **Carrier** | `transfer(what, from, to)` conserving identity | E8, CE3, ECX16 |
| AB12 | **World law dials** | data block read by systems (comic CA1) | CE6, per-world dials |
| AB13 | **Read model / selector** | `select(state) -> view`, memoized on deps | RT4, PF5 |
| AB14 | **Presenter** | `render(view, target)`; DOM, canvas or comic panels | OE6, CE8, EG1 |
| AB15 | **Formatter** | numbers, durations, plurals, names in one place | MC29-MC31 |

**Do not abstract yet** (SB1): combat resolution across worlds, crafting
across worlds, UI layout engine, generic quest scripting. Each needs a
third concrete user first.

**Abstraction subtleties.** AB4 `peek` must not change state; AB6 must
answer "what did X believe at time T", not just "what is true"; AB8
migrate must be pure and testable on fixtures; AB9 versions are engine API
versions, not content revisions (OE9).

## T. Merging, committing and pushing (GT)

**GT1. Commit cadence.** This palette, its dispatch folder and finished lane
outputs commit as docs-only checkpoints on `codex/gameplay-foundations`,
staging only this task's paths. Other sessions share the branch and index.

**GT2. Push.** The branch is 20+ commits ahead of `origin` with other
sessions' work. Push is a separate call for Weibao since origin is a public
fork; nothing here needs pushing to be useful.

**GT3. Merge to master.** Not proposed from this palette. Engine work
merges only with a playable slice (IM9), through the GM integration flow.

**GT4. Engine code lanes.** When a kernel lane writes code, it gets its own
worktree branch, and one integrator merges it; never multiple writers on
`main.js` (IM8).

## U. Wave fold: ER2, ER4, ER11, ER13, ER15-ER18 (2026-10-14)

Folded on Weibao's approval (O2, relayed by the gameplay-foundations
session). No new lanes; everything stays proposals. Each lane doc owns its
evidence. ER1, ER3, ER5-ER10, ER12 and ER14 are folded in "Lane
results so far" above.

### What each lane adds

| Lane | Adds | Duplicates or contradicts |
| --- | --- | --- |
| [ER2 structure](research/CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md) | Bundle composition, four import cycles, host/content/facts as a manifest candidate (ER2-F4), `npm test` 628 tests in 172 s | Corrected round 1: the NetHack preview is live, not stale (already fixed in "Where things stand") |
| [ER4 references](research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md) | 19 games on seven engine dimensions, eight new ideas; pinned source ranges | None found; ER13 specializes several of its lessons |
| [ER11 UI micro](research/UI_MICRO_FEEL_AUDIT_2026-10-14.md) | 11 ranked findings with 1366x768 probes: focus loss on progress rebuilds, a double-firing Craft handler, scientific format dropping the minus sign (`0.001` and `-0.001` print alike), "1 minutes", player and save strings reaching HTML unescaped, one panel error able to stop the native tick, partial asset fingerprints, a 13 MB source map served directly | Confirms MC22-MC33 and OS4. Adds a real defect class (sign loss) the palette did not name |
| [ER13 catalog](research/ENGINES_AND_FRAMEWORKS_CATALOG_2026-10-14.md) | Section M with sources; reads the Antimatter Dimensions, Kittens Game, Incremental Game Template and Modding Tree loops; ten "steal" patterns | Agrees with ER5 (keep JS/DOM, borrow small patterns) |
| [ER15 cheat matrix](research/CHEAT_ENGINE_CAPABILITY_MATRIX_2026-10-14.md) | 103 cheat rows against engine foundations; foundation payoff table; eight new engine cheats | **Refines IM1:** the four-foundation order fits broad time tools, but it is not a prerequisite for every cheat. Knowledge-filtered read models (RT4 + AI6/E9) cover the most cheats per effort |
| [ER16 sources](research/ENGINE_AWARE_CHEATS_SOURCES_2026-10-14.md) | 26 fiction and meta-game entries labeled SHOWN/STATED/MEMORY, 11 two-sided conflicts, four new cheats | MEMORY rows remain unchecked |
| [ER17 comic fit](research/COMIC_WORLDS_ENGINE_FIT_2026-10-14.md) | All 50 comic CL/CK/CA rows mapped to foundations; five stress verdicts; six missing contracts (ER17-N1-N6) | ER17-S5 clarifies E5/F8: the 512-boundary budget returning remaining time is correct; only claiming the whole skip settled would be a bug |
| [ER18 inventory](research/ABSTRACTION_INVENTORY_2026-10-14.md) | Site counts for AB1-AB15 across 474 files (e.g. 65 clock sites, 86 RNG sites, 459 store/registry sites), the best existing candidate per AB, five ranked extractions | **Extends the "do not abstract yet" list:** nine semantics that must stay separate (ER18-N1-N9), e.g. native calendar vs joined elapsed vs local lease time, and saved RNG cursors vs cosmetic randomness |

### Code renumbering (ECX)

ER15 and ER16 proposed new cheats while section R took ECX19-ECX23 for
comics. To keep codes unique, the root assigns:

| Root code | Lane code | Cheat |
| --- | --- | --- |
| ECX24 | ER15-X1 | Snapshot diff eye: what changed since an anchor, within what you may know |
| ECX25 | ER15-X2 | Commit seal: a ritual's cost and effect settle together or stay pending |
| ECX26 | ER15-X3 | Boundary step: stop before the next consequential event and take one step |
| ECX27 | ER15-X4 | Cursor ward: shield one domain's rolls from unrelated activity; detect a stale forecast |
| ECX28 | ER15-X5 | Rule-version anchor: keep one learned spell or dream on its pinned rules |
| ECX29 | ER15-X6 | Dream interruption thread: pause a long dream and resume without paying twice |
| ECX30 | ER15-X7 | Provenance compass: follow an item's real origin and custody within your grade |
| ECX31 | ER15-X8 | Counterpart conflict sense: notice two branch records disagree; reconcile by an authored rule |
| ECX32 | ER16-N1 | Perspective forge: apparent size or shape becomes real (Superliminal) |
| ECX33 | ER16-N2 | Interface hands: grab a UI label or fictional file as a world object |
| ECX34 | ER16-N3 | Narrative route lever: change who narrates or which scene follows |
| ECX35 | ER16-N4 | World-line compass: tell causal histories apart and move between them |

### New contracts and subtleties taken from the lanes

- **CE10 (ER17-N1) Two dates per fact:** when it became true in-world, and
  when it was recorded or learned. A retcon learned today can claim truth
  last year. Extends AB6.
- **CE11 (ER17-N2) Dependency invalidation:** frozen jobs, forecasts and
  anchors record which facts they rely on; a retcon returns the affected
  commitments with a retain/cancel/refund/recompute decision.
- **CE12 (ER17-N3) Atomic event phases:** a crossover has one event id,
  owner, phase and completion acknowledgments (sharpens CE3, MC37).
- **CE13 (ER17-N4) Promotion and demotion:** a background hero becoming
  foreground freezes its aggregate history first; demotion keeps custody
  and witnessed outcomes. No convenient re-roll.
- **CE14 (ER17-N5) Contact separate from rank:** reach, penetration and
  nullification are described apart from power magnitude, so "no contact"
  is expressible (sharpens CE4).
- **CE15 (ER17-N6) Semantic beats:** durable scene/beat references for
  gameplay, separate from disposable render lines (sharpens CE8).
- **MC38 (ER11-F7) Sign-preserving notation:** number formatters must keep
  sign and exponent sign; test both against fixtures.
- **AB16 (ER18-N1-N9) Keep-separate list:** the nine semantics ER18 names
  stay distinct types even when their code looks alike.

### Top picks across the wave (proposal, ranked by value per effort)

1. **Correctness first:** ER9's three high save findings, plus ER11-R1
   (escape player and save text at HTML sinks, fix the scientific sign,
   "1 minute"). Small, real defects.
2. **ER15-A1:** one knowledge-filtered observation read model (value or
   range, grade, source, as-of) with the status window and one appraisal
   as consumers. Widest cheat coverage, and it guards sealed truths.
3. **ER11-R2/R3:** a pending guard on paid single crafts, plus keyed rows for
   career and storylet choices so ticks stop stealing focus and clicks.
4. **ER18-P1:** one shared calendar projection and coin decomposition.
   ER18-P2's xorshift step is partly done already: commit `70291906`
   routed copies through `seeded_streams` and lowered the ratchet to 7.
5. **ER15-A4 / SB5:** pick the next time-based slice and establish the
   shared time path inside it, not as a standalone rewrite.

Engine route unchanged: EG0 plus OE10 strangler, PixiJS per visual panel
(EG1), Tauri trial when a desktop build is wanted (EG5).

**Wave status: folded 2026-10-14.** All lanes ER1-ER18 have returned and
are folded. No lane is running and none is queued.

## Suggested order (proposal)

1. **Measure** (PF1, PF3, CH2, CH3). Nothing below is justified without it.
2. **Cheap wins** that need no design decision: TS8
   dev loop, TS2 lint, CH7 error capture, RT3 for the 250 ms poller.
3. **Pure core** (RT2, RT9, RT5) behind the existing loop.
4. **Scale paths** chosen by the profile: RT6/RT7, DA1/DA2, PF4/PF5, TS4.
5. **Platform** dials (TS6/EG5, DA7, OS3) when Weibao wants them.
6. **Own kernel** (OE10 strangler) starting with the expansion engine, once
   step 3 exists. This is the default "proper engine" path.
7. **Engine port** (EG2/EG4) only if 1-4 show the web runtime is the blocker.

## Dispatch, 2026-10-14 (folded)

Codex lanes in [engine-runtime-2026-10-14](gm/dispatch/engine-runtime-2026-10-14/COMMON.md).
All read-only on gameplay source; each writes its own research file. Findings
are proposals until Weibao accepts them.

| Lane | Question | Output |
| --- | --- | --- |
| ER1 | Runtime hotspots: loops, timers, clones, render paths, listeners, with a Node microbenchmark of pure paths | `docs/research/RUNTIME_HOTSPOT_AUDIT_2026-10-14.md` |
| ER2 | Bundle and module structure: metafile, import graph, cycles, dead code, main.js split plan | `docs/research/CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md` |
| ER3 | Tech stack options with current sources: types, workers, storage, wrappers, test runners, reactivity | `docs/research/TECH_STACK_OPTIONS_2026-10-14.md` |
| ER4 | How other idle and simulation games solve ticks, offline time, big numbers, LOD, saves | `docs/research/IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md` |
| ER5 | Proper engine options: port cost on this codebase, what each engine actually fixes, hybrid paths | `docs/research/GAME_ENGINE_OPTIONS_2026-10-14.md` |
| ER6 | Libraries to incorporate: size, license, maintenance, adapter plan, first step | `docs/research/LIBRARIES_TO_INCORPORATE_2026-10-14.md` |
| ER7 | Throwaway spikes outside the repo: ECS vs current actor loops, worker step round trip, sqlite-wasm vs JSON saves | `docs/research/ENGINE_SPIKES_2026-10-14.md` |
| ER8 | NPC and world simulation architecture: needs, schedules, storytellers, social sim, off-screen LOD | `docs/research/SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md` |
| ER9 | Micro audit of source for MC1-MC34: time, numbers, ordering, persistence edges, with file:line | `docs/research/MICRO_CORRECTNESS_AUDIT_2026-10-14.md` |
| ER10 | Platform behavior facts with current sources: throttling, bfcache, eviction, pagehide, quotas, per browser | `docs/research/BROWSER_PLATFORM_BEHAVIOR_2026-10-14.md` |
| ER11 | DOM and feel micro audit: reflow, focus/scroll loss, double commits, number formats, jitter, error isolation | `docs/research/UI_MICRO_FEEL_AUDIT_2026-10-14.md` |
| ER12 | Own-engine design from current code: kernel, store, module manifest, persistence, extraction order, cycle breaking | `docs/research/OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md` |
| ER13 | Wider engine and framework catalog: idle frameworks, narrative tools, RPG makers, ECS cores, statecharts, rules, shells | `docs/research/ENGINES_AND_FRAMEWORKS_CATALOG_2026-10-14.md` |
| ER14 | Kernel spike outside the repo: tiny clock/scheduler/command/store/persist kernel driving copied pure modules | `docs/research/KERNEL_SPIKE_2026-10-14.md` |
| ER15 | Cheat-to-engine capability matrix: every existing cheat doc mapped to the engine foundations it needs | `docs/research/CHEAT_ENGINE_CAPABILITY_MATRIX_2026-10-14.md` |
| ER16 | Engine-aware cheats in sources: litRPG systems, admin/GM fiction, loop stories, meta games | `docs/research/ENGINE_AWARE_CHEATS_SOURCES_2026-10-14.md` |
| ER17 | Comic worlds engine fit: comic doc CL/CK/CA and K-lane outputs mapped to engine foundations and stress cases | `docs/research/COMIC_WORLDS_ENGINE_FIT_2026-10-14.md` |
| ER18 | Abstraction inventory: duplicate clocks, RNGs, registries, validators, formatters, persistence adapters in src | `docs/research/ABSTRACTION_INVENTORY_2026-10-14.md` |

## Current-rule reconciliation, 2026-10-18

Stack/framework/kernel options here remain a palette. AR1–AR16 and the current
modular brief govern runtime changes; no framework conversion or new foundation
bundle is selected. Before optimizing a selected catch-up or reaction chain,
measure its real workload and compare semantic outcomes, including its stop/time
receipt. A technical processing budget pauses/resumes remaining work rather than
inventing a world law or silently discarding valid effects (AD22/AD36, G27/G29).
Record today's source/content/fixture identity before reusing old performance or
passing-test claims. [Current plan coverage](reviews/PLAN_RULE_RECONCILIATION_2026-10-18.md)
separates section review from historical filename inventory.

## Desktop shell round, 2026-10-20 (DS)

Weibao asked whether the game needs a browser engine or shell, which is
optimal, what else to consider and how other games do it. Proposals, not
accepted decisions. Extends TS6, EG5 and
[ER5 desktop shells](research/GAME_ENGINE_OPTIONS_2026-10-14.md#desktop-shells-and-a-godotwebview-hybrid).

### How shipped web games do it (sourced 2026-10-20)

| Game | Shell | Note |
| --- | --- | --- |
| Melvor Idle | NW.js on Steam | Developer reply, 2021 [Steam forum](https://steamcommunity.com/app/1267910/discussions/0/3114770279394818584); may have changed since |
| Antimatter Dimensions | Web game since 2016, Steam build Dec 2022 with cloud save; the web version stays live | [Steam page](https://store.steampowered.com/app/1399720/Antimatter_Dimensions/), [player thread](https://steamcommunity.com/app/1399720/discussions/0/5562542086335544983). Third-party Nix packaging builds it as Electron ([commit](https://code.ornl.gov/mdf/nixpkgs/-/commit/f35da175e1acf205a506d26503c8182de294c5e5)); the official Steam stack is not confirmed |
| CrossCode | NW.js around a modified impact.js | [Steam thread](https://steamcommunity.com/app/368340/discussions/0/1741106440027709150) |
| Vampire Survivors | Phaser in Electron through 1.0, moved to Unity in 1.6 (Aug 2023) for performance and platforms; Steam Deck then ran far better | [GamingOnLinux](https://gamingonlinux.com/2023/07/vampire-survivors-switching-to-new-game-engine-on-august-17) |

Pattern: one web codebase, the browser version stays, a Chromium-bundling
shell (NW.js or Electron) carries the Steam build. The one well-known exit
(Vampire Survivors) was a real-time game with hundreds of moving sprites, not
a text and panel game.

### Considerations

| Code | Point | Disposition |
| --- | --- | --- |
| DS1 | **Superseded 2026-10-20 by AD39 (Electron plus web); kept as history.** **A shell is not needed yet.** Weibao is the only player and plays in Chrome. A shell fixes four things: save durability and size (localStorage, 4 MiB guard), background-tab throttling, a real save folder, and Steam. Default: no shell until one of those bites. Dial: the save nears the guard, or Weibao wants a Dock/Steam app | ACCOUNT FOR NOW |
| DS2 | **Cheap middle step: installable PWA plus better storage.** A standalone window and Dock icon with no shell, IndexedDB or OPFS for saves (DA owner) and `navigator.storage.persist()` against eviction. Covers most of "feels like an app" for little work. It does not lift throttling or give Steam | LATER: small spike, Sonnet-level, done when the installed window plays, saves, reloads and imports |
| DS3 | **Accepted 2026-10-20 as AD39 (Electron); the Tauri branch is history.** **Electron versus Tauri for this repo.** ER5 leaned Tauri for size. New angle: every test, perf gate and browser proof here runs on Chrome. Electron (or NW.js) ships that same Chromium, so existing evidence carries over. Tauri on macOS runs WebKit (Safari's engine), so CSS, fonts, perf budgets and input need requalifying, and on Linux and Steam Deck it runs WebKitGTK with known blank-window and slow-WebGL reports ([Tauri Linux graphics](https://v2.tauri.app/develop/debug/linux-graphics/)). The roughly 150 MB Electron size does not matter for one player. Revised default (proposal): Electron for a Steam or cross-OS build; Tauri for a small personal Mac app if requalifying is acceptable | ACCOUNT FOR NOW |
| DS4 | **Steam is a native-module job.** [steamworks.js](https://www.npmjs.com/package/steamworks.js) is the usual Electron binding (achievements, cloud, workshop, overlay helper); it runs in the main process and its renderer setup weakens isolation. Overlay reliability in current Electron is reported as mixed, so test it. Tauri needs a Rust Steamworks binding (not verified here) | LATER |
| DS5 | **Saves must be able to live as files.** A shell's app origin starts empty (ER5-O7), and Steam Cloud syncs files, not localStorage. Keep the save envelope byte-identical across hosts so Export/Import is the bridge and a file backend is a drop-in (AR6, DA owner) | ACCOUNT FOR NOW |
| DS6 | **Idle time is a game rule, not a shell feature.** Turning off background throttling lets a minimized window keep ticking but costs battery. Closed-app progress is still computed on launch by the offline policy (ER4, AR3 one clock) | ACCOUNT FOR NOW |
| DS7 | **One host adapter seam.** Storage, file pick/save, window and Steam calls go behind a small host interface with a browser implementation as the default and test target. Matches the 2026-10-11 "replaceable platform adapters" proposal. Add it the next time storage code is touched, not as its own refactor (AR4) | ACCOUNT FOR NOW |
| DS8 | **Distribution chores.** macOS Gatekeeper warns on unsigned apps; public distribution needs signing and notarization (paid Apple developer account). Steam handles updates; outside Steam use the shell's updater. A personal build needs none of this | LATER |
| DS9 | **Mods and saves are untrusted input in a shell.** With Node or native access, a malicious save or mod could reach the file system. Keep native calls in the main or preload process, keep context isolation on, never `eval` save text | ACCOUNT FOR NOW when a shell lands |
| DS10 | **Mobile stays deferred** (UI priority). Capacitor or Tauri mobile later reuse the same web build and the DS7 seam | LATER |
| DS11 | **The port trigger is a scene-heavy real-time world** (the Vampire Survivors case). First answer is PixiJS for that panel (EG1); a Godot or Unity port only if that still fails measured budgets | ACCOUNT FOR NOW |

Suggested order (proposal): DS2 PWA plus storage spike when save size or
eviction becomes real; DS7 seam alongside it; an Electron shell (DS3) when
Weibao wants a Steam or Dock build; DS4 and DS8 only for public release.

## Electron host, 2026-10-20 (EL)

Weibao, 2026-10-20: "We should transition to electron + web like the others,
and consider the leeway that gives us and better options for the future and
more". Accepted as AD39 ([record](USER_VISION.md#electron-plus-web-2026-10-20)).
DS1 and the Tauri side of DS3 are superseded and kept above as history.

### First slice (delivered 2026-10-20)

Implementation defaults (proposal, Claude): `src/` never imports Electron, the
browser build stays the default test target, and host-only features go through
one adapter with a browser fallback (EL2; AR3, AR4).

- `desktop/main.cjs` hosts the unchanged web build in Electron 44.9.2 (pinned
  devDependency). `npm run desktop` builds, then opens the app.
- Fixed origin `app://yairpg`, served by a custom privileged scheme
  (`desktop/app_path.cjs`, query strings dropped, paths outside the repo
  refused). localStorage is keyed by this origin, so it never changes.
- Context isolation and sandbox on, no Node in the page (DS9). A small
  sandboxed preload (added with EL29) exposes only `window.yairpgHost` and the
  `prompt()` stand-in.
  External links open in the system browser; help and changelog stay in app.
- Agent switches, off by default: `YAIRPG_HIDDEN=1` (no window or Dock icon),
  `YAIRPG_CDP_PORT` (DevTools Protocol on 127.0.0.1), `YAIRPG_USER_DATA`.
- One app instance per userData (verified: a second launch on the same save
  exits with one window kept; a separate userData runs alongside); background throttling off so the clock runs
  while minimized (`YAIRPG_THROTTLE=1` turns it back on, DS6).
- Window opens at up to 1920x1080, minimum 1366x768.
- **Save compatibility decision:** the app is a new origin and starts empty.
  The Chrome save is untouched; move it with Export in Chrome, Import in the app.
- **Evidence:** `node scripts/desktop_smoke.cjs` on a rebuilt bundle and a
  fresh userData: play, Save, reload, full quit and relaunch, Export to a file,
  literal Import, no page errors. PASS on this Mac (HEAD f5e99069e plus working
  tree, `bundle.js?version=v0.6-e36d9fdb35aa`). `tests/desktop_app_path.test.js`
  covers the path guard. Not exercised: real Export through the native save
  dialog (the smoke sets a download folder), minimized ticking rate, Windows and
  Linux, packaging. Chrome perf budgets do not transfer; Electron's Chromium
  differs from system Chrome.

### Leeway this gives us

Proposals unless marked. Disposition per row.

| Code | Leeway | Disposition |
| --- | --- | --- |
| EL1 | **Real save files.** A preload bridge can write saves to a folder with write-temp-then-rename, rolling backups, no 4 MiB localStorage ceiling and saves Weibao can see and copy. Same envelope as Export, so browser and app stay interchangeable (AR6, DS5). Steam Cloud then syncs that folder | LATER: next slice, Sonnet or Opus, done when save, quit, relaunch and corrupt-file recovery pass in `desktop_smoke` |
| EL2 | **Host adapter seam (DS7) made concrete.** One leaf `src/host.js` with a browser implementation; the desktop preload exposes a narrow `window.yairpgHost` through `contextBridge`. Features feature-detect it; nothing imports Electron | ACCOUNT FOR NOW: EL1 lands through it |
| EL3 | **Windows and monitors.** Pop a panel (map, ledger, log) into its own window on a second screen; this game is panel-heavy, so this is the biggest UI gain. Needs one state owner and projections per window (AR3, AR8) | LATER: after EL2 |
| EL4 | **Desktop presence.** Tray or Dock badge with the current job, OS notifications when long work finishes or a choice waits, app menu with real shortcuts | LATER, small each |
| EL5 | **Time while away.** Minimized play keeps ticking now. Closed-app time stays the offline rule (DS6, ER4). Power use is the dial | ACCOUNT FOR NOW: measure before relying on it |
| EL6 | **Fully offline.** Material Icons still load from Google Fonts; bundle the font locally so the app works with no network | LATER: tiny, done when icons render with networking off |
| EL7 | **Heavier simulation off the page.** Electron adds `utilityProcess` and Node worker threads beside the Web Workers the browser already has. Only after the pure core exists (RT2, TS4) and a profile asks for it | LATER |
| EL8 | **Content and mods from a folder.** Private packs, authored worlds and future mods read from a user folder, with file watching for live reload while authoring. Treat files as untrusted (DS9) | LATER |
| EL9 | **Fixed Chromium.** Every machine runs the same engine, so perf numbers and layout are reproducible. Each Electron upgrade reruns `desktop_smoke` and a perf pass; Electron ships a major about every 8 weeks, so pick upgrade points instead of chasing each one | ACCOUNT FOR NOW |
| EL10 | **Distribution when wanted.** Packaged `.app` (electron-builder or Forge) for the Dock, then signing, auto-update and Steam through steamworks.js (DS4, DS8). Same Chromium on Steam Deck avoids the Tauri WebKitGTK risk | LATER: packaged personal `.app` first |
| EL11 | **Dev tools.** DevTools in the app menu, local crash reports (`crashReporter`), a save inspector and the perf overlay (PF3) as app windows | LATER |
| EL12 | **Test hooks in the app.** `?test_hooks=1` stepping is localhost-only, so the desktop smoke runs at natural pace. An env-gated hook for the app would make desktop checks deterministic | LATER: only if desktop checks grow |
| EL13 | **Costs to keep paying.** App size in the hundreds of MB, Electron security updates, and two hosts to keep green. The browser stays the default test target, so most work needs no desktop check; host changes do | ACCOUNT FOR NOW |
| EL14 | **Mobile is not covered by Electron.** A later phone build would use Capacitor or similar over the same web build and the EL2 seam (UI priority: deferred) | LATER |

Suggested next slice (proposal): EL2 seam plus EL1 file saves, then EL6 and a
packaged `.app` (EL10) so the game opens from the Dock.

### Agent access and background work (EL15-EL26), 2026-10-20

Weibao, same day: "consider options with the electron client that makes
everything else easier? MCP and then direct view? Or even better protocols?
also will it still be able to do edits and stuff in the background without
affecting my front page? More to consider?"

**Answer on background work:** yes, with two conditions. Agent and test runs
use their own `YAIRPG_USER_DATA`, so they never touch his save, and the
single-instance lock is per userData, so they run beside his window
(verified). `YAIRPG_HIDDEN=1` keeps them off screen and out of the Dock
(verified: the full desktop smoke passes hidden). The open gap is EL18: his
app serves the live repo, so an agent's `npm run build` changes what his
window loads on its next reload.

Layers, lowest first. Each can sit on the one below.

| Code | Option | Disposition |
| --- | --- | --- |
| EL15 | **CDP attach (built in).** `YAIRPG_CDP_PORT=9333` opens Chrome DevTools Protocol on 127.0.0.1. Existing tools then drive the real app with no new code: Playwright `connectOverCDP` (verified on a hidden instance), [Playwright MCP](https://www.mdskills.ai/mcp-servers/playwright-mcp) with `--cdp-endpoint`, or [chrome-devtools-mcp](https://github.com/ctrlshiftbryan/chrome-devtools-mcp) with `--browser-url`. Reaches the page, not Electron's main process. Any local process can use an open port, so it stays off on the player's instance | DONE as a switch; ACCOUNT FOR NOW: never on his own instance |
| EL16 | **Game MCP server (better protocol for agents).** The main process serves MCP on localhost (or a stdio bridge) with game-level tools instead of clicks: read the projection (AR8), quote and run a command (AR7), save, export, step time, screenshot. Agents then talk in game terms, and the tools are the same seams the UI uses. Projections are observer-safe, so sealed truths stay sealed; a debug-truth tool would need its own explicit flag. Needs EL2 plus a small page-side bridge. Bind 127.0.0.1, check Origin, require a token, off by default. An embeddable package exists ([electron-mcp](https://glama.ai/mcp/servers/agent-labs-dev/electron-mcp)) but drives UI over CDP; the game tools would be ours | LATER: next agent-tooling slice, Opus, done when an agent plays the elder greeting through MCP tools on a hidden instance and the save round-trips |
| EL17 | **Direct view without focus.** `webContents.capturePage()` in the main process (or CDP screenshots) gives agents a picture of a hidden window; offscreen rendering is the dial for many parallel instances. The player can also watch an agent instance by launching it visible (`YAIRPG_SHOW=1`) | Hidden switch DONE; capture tool LATER with EL16 |
| EL18 | **Freeze the player's build.** Serve his instance from a snapshot (a packaged `.app` under EL10, or a copied build folder per version) instead of the live repo. Agents then build and test freely; his app offers "new build ready, save and reload" instead of changing under him. Without it, avoid reloading while agents rebuild | LATER: highest value of this round, Sonnet, done when a rebuild during play leaves his window and a reload on the old build unchanged |
| EL19 | **Live agent instance as a sandbox.** A long-running hidden instance with its own save that agents keep warm (CDP or EL16), so checks skip the launch cost and several agents can share one fixture origin | LATER |
| EL20 | **Hand a save to an agent.** "Debug my situation" copies his current save into an agent instance through Export/Import (never his userData), so an agent can reproduce a bug from his real state. It is his private save, so this happens only when he asks (AGENTS safety) | LATER |
| EL21 | **Agent changes reaching his game.** With EL18, a finished, gate-passing lane produces a new build; his app shows what changed (changelog lines) and reloads on his yes. Ties to the merge-before-dispatch practice | LATER |
| EL22 | **Better than MCP for in-process work.** Inside the app, plain IPC (`contextBridge` plus `ipcMain.handle`) is the fastest path and needs no network. MCP is for outside agents; CDP is for UI-level checks. Use each where it fits instead of choosing one | ACCOUNT FOR NOW |
| EL23 | **Determinism for agent runs.** Agent instances can seed time and RNG as the localhost test hooks do (EL12), so two agents reproduce the same run | LATER with EL12 |
| EL24 | **Ports and collisions.** Each agent instance takes its own CDP port and userData; record them in the task record like Codex PIDs, and stop instances by PID, never by name | ACCOUNT FOR NOW |
| EL25 | **Cost to his machine.** Hidden instances still use CPU and memory, and background throttling is off by default. Agent runs may set `YAIRPG_THROTTLE=1` when they only need state, not timing | ACCOUNT FOR NOW |
| EL26 | **Security floor.** CDP and MCP give full control of an instance. Localhost only, off by default, token for MCP, and never on his play instance unless he turns it on | ACCOUNT FOR NOW |

Suggested order (proposal): EL18 frozen player build first (it answers "without
affecting my front page" fully), then EL16 game MCP tools, then EL1 file saves.

### Never take the foreground (EL27-EL38), 2026-10-20

Weibao, same day: "work in the background without bringing the game to my
foreground? More to consider?" and "it can take up space in [the] dock but
just doesn't need to show up in foreground mid showing someone something".
The rule: background work may be visible in the Dock, never raise a window.

**Measured on this Mac** (frontmost app sampled every 0.3 s): the full hidden
desktop smoke, a background dialog check and a background second launch onto
the same save never made the app frontmost; only Weibao's own apps were.

| Code | Point | Disposition |
| --- | --- | --- |
| EL27 | **Three run modes.** Player (normal window), `YAIRPG_INACTIVE=1` (visible, never focused, may sit in the Dock so he can click in), `YAIRPG_HIDDEN=1` (no window, no Dock icon, macOS accessory app that cannot activate). Agent and test runs default to hidden; the smoke check does | DONE; INACTIVE Dock behavior implemented-unverified (testing it would show a window) |
| EL28 | **Accidental second launch.** A launch on the player's save used to raise his window. Background launches now pass a flag with the single-instance lock and his window stays put; only his own Dock click or relaunch raises it | DONE, verified hidden (second exits, window stays unfocused) |
| EL29 | **Dialogs are focus thieves.** Native `alert`/`confirm` would pop over his screen from an agent run. Background runs cancel them (logged as warnings). Electron also has no `prompt()`, which broke Reset, Load backup and Import other release in the app; the preload now shows a small modal for the player and returns cancel in background | DONE, verified hidden; player modal tested through hidden windows, not clicked on screen |
| EL30 | **Downloads and links.** A background Export saves to a temp folder instead of opening a save dialog; external links from background runs are dropped instead of opening the browser | DONE |
| EL31 | **Sound.** Background runs are muted so a test never plays audio during a presentation | DONE |
| EL32 | **Host never self-raises.** No `focus()`, `show()`, `flashFrame` or Dock bounce from timers, finished jobs or game events, even on the player's instance. Future notifications (EL4) go through the OS, which respects Focus modes | ACCOUNT FOR NOW |
| EL33 | **Other foreground thieves in agent work.** Visible Playwright windows, `open <url>`, Simulator, headful Chrome. Repo browser checks already run headless; desktop checks run hidden. Agents should not launch visible windows unless Weibao asks to watch | ACCOUNT FOR NOW: add to agent lane briefs that launch the app |
| EL34 | **Presenting mode for the player's window.** Optional: a menu toggle that pauses notifications and sounds from his own game while presenting. macOS Focus modes already silence OS notifications | LATER, small |
| EL35 | **App Nap and timers.** macOS may nap a covered or minimized app regardless of Chromium throttling, slowing his idle clock. Measure ticks over 10 minutes minimized before adding any power blocker; `prevent-app-suspension` also keeps the Mac awake, so it is the costly dial | LATER: measure first |
| EL36 | **Spaces and full screen.** Hidden runs create no window, so they cannot switch Spaces. INACTIVE windows open on the current Space; if he presents full screen, launch watchable runs only when asked | ACCOUNT FOR NOW |
| EL37 | **CPU during presentations.** Several hidden instances can make fans spin or stutter a screen share. `YAIRPG_THROTTLE=1` for state-only checks, and keep agent instance counts small | ACCOUNT FOR NOW |
| EL38 | **Prompt UX in the browser.** The browser still uses the native prompt; an in-page confirm for Reset and backups would match both hosts and the game's styling | LATER: UI rules apply (UR) |

#### On-screen checks, 2026-10-20

Weibao asked to try the two on-screen gaps, then stopped it: "its taking over my
screen, I want it to be worked on in the background". Standing rule from here:
agent checks never open visible windows (hidden Electron, headless browsers).

- **EL27 INACTIVE mode, verified once on screen:** window visible, not focused,
  Claude stayed frontmost, and the app had a Dock presence (not background-only).
- **EL29 Reset through the prompt modal:** cancel keeps the save; typing "reset"
  clears it and reloads. Verified hidden with `YAIRPG_DIALOGS=1` (a test-only
  switch that opens the prompt off screen), both alone and after a cancelled
  prompt. One on-screen run reloaded but kept the save; it did not reproduce
  hidden and was not retried on screen. Status for visible windows:
  implemented-unverified. Export before a Reset until he has seen it work.

