# Background Tauri comparison host

Disposable macOS-only experiment authorized Nov 6, 2026. AD39 remains the
production choice; TS11/TS13 and AR3/AR4 guide this bounded comparison.
The hidden 1920×1080 WKWebView loads the same scratch web build used by the
current Electron host. It uses an ephemeral store and explicitly disables
background throttling, matching Electron's default timer policy on this Mac.
No player profile, visible window or production installation is used.

From the repository root:

```sh
node scripts/perf/compare-shells.mjs --prepare
clang -O2 scripts/perf/shell-launch.c -o work/shell-comparison-20261106/shell-launch
cargo build --release --offline --jobs 4 --manifest-path scripts/perf/tauri-prototype/Cargo.toml
node scripts/perf/compare-shells.mjs --runs 3 --seconds 20 --fixtures fresh,crowded
```

Output: `work/shell-comparison-20261106/`. The preparation copies current source
with the existing perf helper, adds its missing stylesheet helper and local fonts/packs, builds once,
and retains the game bundle hash. Both hosts receive identical benchmark code
and fixture bytes before the game bundle. Trials alternate host order.

The Rust binary requires `OOPS_BENCH_URL=http://127.0.0.1:<port>/`. It contains
only a stub asset; actual game assets are served by the Node benchmark server.
Electron retains its current app protocol and desktop services. This transport
and feature difference is deliberate prototype scope, not production parity.
Native menus, mirrors/recovery, notifications, pop-outs, frozen-build updates,
installers/signing and cross-platform qualification are deferred. No migration
or gameplay change is made. Runtime floor checks for a new gameplay slice do
not apply to this separate measurement tool.

`../shell-processes.py` uses macOS process responsibility to include WebKit XPC
processes even when launchd parents them. The small C launcher disclaims inherited responsibility so the Rust executable
gets its own identity. Without it, WebKit inherits the Codex process identity
and cannot be safely charged to this prototype. CPU counters are converted
through `mach_timebase_info` (125/3 on the test machine), calibrated against
`time.process_time()`. Per-process CPU and physical footprint
come from `proc_pid_rusage` v0. Summed process footprints are not unique physical
RAM and do not include all system services. The benchmark normalizes document.hidden/visibilityState to visible in both
hosts so game-side render deferral does not create a false gain. The windows
still remain hidden, and this does not force equivalent actual painting.
`--native-visibility` disables this normalization for separate diagnostics.
Hidden trials establish neither
visible rendering speed nor battery life. Save/reload checks use synthetic data.
