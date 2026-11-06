# Electron and Tauri: measured prototype comparison

2026-11-06. Requested by Weibao: “Can you measure our current Electron
performance and try a small Tauri prototype so we can compare them?”
This authorizes the experiment, not production migration. AD39 remains the
production direction. Applies TS13, AR3/AR4, AD36 and AD41.

## Scope and input

Owner: this chat, `scripts/perf/compare-shells.mjs`, `shell-page.js`,
`shell-processes.py`, `shell-launch.c`, `summarize-shells.mjs`, and
`tauri-prototype/`. No shared game, desktop host or player profile edits.
Target: hidden desktop windows, 1920×1080 CSS viewport, current web game loading
and working through the existing PLAY button. Visible painting, mobile,
production host parity and migration are deferred.

Prepared an isolated source copy and rebuilt once with the existing build
script. Its `dist/bundle.js` SHA-256 is
`66a36950928061894048c39d3051f22650ad39f73024b5d47a424910fc456b4b`.
Source HEAD: `958740e928e60450d0f98114a5941253c9b36349`; input is the working
checkout, not a clean-release or installed-app benchmark. Existing dirty
outputs and catalogue edits remain preserved. Local ignored fonts and optional
packs were copied into the scratch asset tree; their identities and fixture
hashes are in `input.json`.

Machine: arm64 Mac17,9, 18 logical CPUs, 64 GiB RAM, macOS 27.2. Electron 44.9.2;
Tauri 2.11.5 release build, Rust 1.98.1; OS WebKit. Each host is run alone,
with alternating host order and separate synthetic save origins. OS caches
are not cleared. Startup means driver launch to the synthetic saved character's
workspace ready callback, with PLAY clicked automatically. It is not a cold
boot or human click-speed measure.

## Measurement method

- Fresh and crowded committed perf fixtures, with the same fixture bytes and
  same rebuilt game bundle in each host. The older fixture schema is exercised
  through the current loader, not assumed current. No real saves are read.
- Four seconds of settling, then a requested 20-second idle wait and closing Save call, followed by five
  real Save button clicks and reload. Reported idle elapsed time includes the closing Save and telemetry delivery;
  this matters when the event loop stalls. The CPU window likewise includes
  this closing work. Clock advancement per wall second is reported so less
  completed simulation is not mistaken for better efficiency. Save timing is synchronous button-handler
  wall time, not an fsync/durability guarantee. Tauri uses an ephemeral store;
  it proves reload retention, not persistence across application exit.
- CPU is accumulated process user+system time divided by sampled wall time;
  100% means one fully occupied core. Memory is the median sum of process
  physical footprints, not unique system RAM. Full per-process samples are
  retained. WebKit helpers are included by macOS responsibility identity,
  including XPC helpers parented by launchd. The prototype launcher disclaims
  the inherited Codex identity so these helpers can be attributed correctly.
- Apple Silicon CPU counters are Mach ticks. Calibration against Python's
  process CPU clock, using the measured 125/3 timebase, agreed within 0.01%.
- Hidden Electron reports its document visible; hidden WebKit reports hidden.
  Both document getters are normalized to visible in the measurement script
  so our game's visibility-based UI deferral does not make Tauri falsely cheap.
  The actual windows remain hidden. This does not equalize actual painting,
  compositor work or all engine throttling behavior. This measures the two
  specific background hosts; it does not isolate pure engine overhead or
  predict visible-window performance. A one-second native stack sample was
  collected during the first Tauri startup only, so that startup has additional
  diagnostic instrumentation. The other startup trials are unprofiled.

## Prototype boundary

Tauri loads the scratch game through the benchmark's loopback HTTP server.
Electron retains its current app protocol and native host modules, with
background throttling disabled as in normal source defaults. Tauri also
explicitly disables its background throttling. The loopback server and
measurement driver are excluded from both app process totals; they are an
additional prototype requirement, not a proposed shipping architecture.

The prototype lacks desktop save mirrors/recovery, native menus, notifications,
pop-outs, frozen updates, installer/signing, and cross-platform testing. It has
no native privileged game commands. Electron resource misses were logged by its protocol handler. The measured
Tauri trials captured page errors but did not log HTTP 404s; their complete
asset coverage is therefore unverified. The retained harness now logs those
misses for future runs. No claim of production parity, visual
acceptance, energy savings or full-game coverage follows from this experiment.

Preliminary pilots omitted ignored fonts/packs and had incomplete Tauri process
attribution; those results are excluded. A restart also left an earlier
Playwright runner alive after SIGTERM interception. Both drivers and their
exact host process groups were stopped, and overlapping data was discarded.
Final evidence uses one verified comparison runner. Preliminary artifacts remain
under `work/shell-comparison-20261106/pilot-*` and `discarded-overlap.json` for
traceability, not as supporting comparisons.

## Results

Three trials per host and fixture. Values below are medians of per-trial
measurements, not confidence intervals. CPU 100% is one core. The crowded
Tauri rows are partial trials whose idle phases finished before a later timeout.

### Fresh synthetic fixture

| Metric | Electron | Tauri prototype |
| --- | ---: | ---: |
| Launch to saved workspace, seconds | 8.1 | 38.0 |
| Summed process footprint, MiB | 1739 | 1075 |
| Summed resident memory, MiB | 2421 | 2257 |
| Background workload CPU, % of one core | 40.8 | 43.8 |
| Game minutes per wall second | 1.00 | 0.94 |
| 100 ms timer lateness, p95 ms | 15 | 312 |
| Save button handler, median ms | 9.5 | 16.0 |
| Save/reload sequence completed | 3/3 | 3/3 |

Electron startup range: 8.1–8.4 s. Tauri startup range: 36.5–48.1 s. 

### Crowded synthetic fixture

| Metric | Electron | Tauri prototype |
| --- | ---: | ---: |
| Launch to saved workspace, seconds | 11.8 | 52.1 |
| Summed process footprint, MiB | 1809 | 1005 |
| Summed resident memory, MiB | 2770 | 2475 |
| Background workload CPU, % of one core | 94.9 | 85.3 |
| Game minutes per wall second | 1.05 | 0.11 |
| 100 ms timer lateness, p95 ms | 494 | 498 |
| Save button handler, median ms | 30.6 | No completion receipt |
| Save/reload sequence completed | 3/3 | 0/3 |

Electron startup range: 11.6–12.0 s. Tauri startup range: 49.6–52.3 s. 

### What the numbers support

F4: The minimal Tauri executable is 14.0 MiB; the local Electron runtime
folder is 307.0 MiB. These are host artifacts, excluding shared game assets;
Tauri relies on OS WebKit and has fewer host features. They are not equivalent
packaged applications or installer measurements.

F5: Tauri has a lower summed physical footprint in this test, while summed
resident memory is much closer. Do not interpret the footprint difference as
an equal reduction in unique system RAM. It does not establish battery savings.

F6: This prototype has substantially slower startup and larger fresh-state
100 ms timer delays. In crowded trials it completes less simulation per wall
second and every sequence hits the 130-second harness deadline. The deadline
is an experiment limit, not evidence of a crash. CPU percentages alone would
hide the throughput loss. The idle timing includes the closing Save and
telemetry scheduling, so it is a background workload result rather than a pure
simulation-kernel benchmark.

Recommendation, proposed: retain Electron. Profile the current browser game's
startup, tick/publication and save costs before selecting fixes. The crowded
Electron fixture itself uses almost a core, so retaining Electron does not
settle game optimization. This experiment does not isolate whether the Tauri
slowdown comes from engine differences, hidden-view scheduling, prototype setup
or specific game code. A revised comparison should first explain that gap and
qualify equivalent native host behavior and resource loading. A Rust simulation
port is a separate decision, not a consequence of changing the shell.

## Checks and remaining gates

- `node scripts/perf/compare-shells.mjs --prepare`: PASS, isolated rebuilt bundle
  with SHA-256 above; tracked dist/index files were not build destinations.
- `cargo build --release --offline --jobs 4 --manifest-path scripts/perf/tauri-prototype/Cargo.toml`:
  PASS. Later Rust edits are rustfmt-only. Measured executable SHA-256 is in
  [input.json](input.json).
- `clang -O2 scripts/perf/shell-launch.c -o work/shell-comparison-20261106/shell-launch`:
  PASS. `clang -Wall -Wextra -fsyntax-only scripts/perf/shell-launch.c`: PASS.
- `node scripts/perf/compare-shells.mjs --runs 3 --seconds 20 --fixtures fresh,crowded`:
  12 attempts captured, 9 complete, 3 crowded Tauri timeouts. All 12 have no
  reported page errors, stable process attribution, a renderer process included
  and 1920×1080 viewport. All 6 Electron trials have zero logged resource misses.
  Tauri HTTP-miss coverage is unverified in this capture, as noted above.
- CPU calibration: PASS, converted rusage delta within 0.01% of process CPU
  clock. JS syntax checks for the driver, page script and summarizer: PASS.
  `cargo fmt --manifest-path scripts/perf/tauri-prototype/Cargo.toml -- --check`: PASS.
- Evidence assertions: PASS, expected completed/timeout counts, viewport,
  renderer attribution, page errors, bundle and executable identities. New
  relative document links resolve. No full gameplay suite or production release
  verification is claimed for this experiment.

Highest state: agent-verified bounded background experiment, not human-reviewed.
Fresh Tauri localStorage save/reload works on the synthetic fixture; crowded
save/reload remains unverified due to the deadline. Visible UI, input/painting,
long-run energy use, quit/relaunch durability, full host feature parity and
cross-platform behavior remain open. No installed app or personal save changes,
commit or push.

[Raw trials](results.json), [derived metrics](results-summary.json),
[run log](final-comparison.log), [CPU calibration](cpu-calibration.json), and
[prototype/reproduction instructions](../../../scripts/perf/tauri-prototype/README.md)
are retained. Scratch builds, synthetic profiles, screenshots and excluded
pilots remain under `work/shell-comparison-20261106/`.

