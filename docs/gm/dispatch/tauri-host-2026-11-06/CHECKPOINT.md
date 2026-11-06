# Tauri host, slice 1 (2026-11-06)

```receipt
build: n/a
route: fixture(hidden Tauri harness, fresh and crowded perf fixtures, clean quit and hard kill relaunch)
state: built
viewport: 1920x1080
persistence: checked
tests: expansion_engine, structured_pack_definitions, structured_expedition_runtime, determinism_replay 37/37; npm test 5204/0; check:desktop 6/6
review: none
surface: hidden runs only; bundle SHA-256 not recorded, so the state stays built, not browser-verified
```

Direction: [Tauri as the main desktop target](../../../USER_VISION.md#tauri-as-the-main-desktop-target-2026-11-06), AD39 amended. Applies AR3/AR4 (host stays out of `src/`), AD36, AD43, AD41, the background-only rule.
Owner: this chat (Claude, primary checkout). The Codex turn that started this was interrupted at 09:56 with no writes; ownership moved here.
Owned paths: `desktop-tauri/`, `scripts/tauri/`, this record. Shared edits: `src/expansion_engine.js`, `src/simulation_contracts.js`, `tests/expansion_engine.test.js`.
Target: hidden desktop runs at a 1920x1080 viewport. Deferred: visible-window measurement (needs Weibao's yes under the background rule), packaging, the parity rows below.

## What changed

- `desktop-tauri/`: real host. Serves the repo over `yairpg://localhost/` (async handler), defines `window.yairpgHost` with browser-fallback stubs, isolates agent stores (`YAIRPG_USER_DATA` → WebKit data store id, or `YAIRPG_EPHEMERAL`), refuses hidden runs that would touch the default store, holds a latency-critical activity against App Nap, and switches off WebKit's private hidden-page timer throttling and process suppression. Switches and parity table: [README](../../../../desktop-tauri/README.md).
- `scripts/tauri/harness.mjs` + `harness_page.js`: hidden harness. One variable per variant (base, wk-throttle, appnap, ephemeral, loopback, native-visibility), fresh and crowded fixtures, startup, game minutes per wall second, 100 ms timer lateness, Save handler time, missing files, page errors, a loading trace (status, main-thread blocks, CPU probe, storage/JSON/structuredClone call cost, `--sample` stack sampling), and durability: save survives a clean quit and a hard kill.
- Game fix found by the harness: each structured pack registration rebuilt a combined registry and re-cloned and re-validated every earlier definition (packs × definitions). `createContentRegistry` and `createSimulationRegistry` now reuse definitions they already copied and froze. Load-time `structuredClone` calls 158,018 → 14,612. Applies in every host and the browser.

## Results (hidden, one run each, 20 s idle, run 2026-11-06T15-15-43Z)

| Variant | Fresh launch→ready s | Fresh game min/s | Crowded launch→ready s | Crowded game min/s | Crowded lag p95 ms | Clean quit kept |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| base | 15.1 | 0.99 | 22.3 | 0.45 | 823 | yes / yes |
| wk-throttle | 15.4 | 1.00 | 24.1 | 0.40 | 830 | yes / yes |
| appnap | 14.0 | 0.99 | 24.4 | 0.40 | 872 | yes / yes |
| ephemeral | 15.3 | 1.00 | 25.1 | 0.37 | 812 | n/a |
| loopback | 15.4 | 0.94 | 25.7 | 0.40 | 896 | n/a |
| native-visibility | 14.4 | 0.99 | 23.7 | 0.94 | 342 | **no** / yes |

Hard kill 1 s after Save: kept. No missing files or page errors in any run. Before the fix the base fresh startup was 46-51 s (three runs); the Nov 6 prototype report had 38 s fresh / 52 s crowded and 0/3 crowded saves.

## Findings

- T1: The slow startup was the quadratic pack registration above, made visible by WebKit's slower `structuredClone`. Fixed. Remaining fresh gap to Electron (15 s vs 8 s in the Nov 6 report; not remeasured side by side) is unexplained: about 10 main-thread blocks over 250 ms remain.
- T2: App Nap, WebKit hidden-page throttling, the loopback transport and the ephemeral store do not explain the stalls; each variant is within run noise of base.
- T3: Crowded throughput is UI work. With the page told it is visible, crowded runs reach 0.4-0.45 game min/s; letting the page see it is hidden (it defers rendering) gives 0.94. Electron managed 1.05 visible-normalized. Next slice: profile crowded tick/publication in WebKit.
- T4: The hidden page drops to background CPU priority after load (probe 1.5 s → 2.2-3.1 s; jsc under `taskpolicy -b` 2.35 s). Real but about 1.5x, not the main cost.
- T5 (open gate): a clean quit 100 ms after the last Save lost that write once (relaunch at clock 1946, expected 1947). WebKit localStorage writes appear asynchronous. Needs a quit path that waits for storage or a host-side save mirror (A1 port) before Tauri carries real play.

## Checks

- `cargo build --release --offline --manifest-path desktop-tauri/Cargo.toml`: PASS.
- `node --test tests/expansion_engine.test.js tests/structured_pack_definitions.test.js tests/structured_expedition_runtime.test.js tests/determinism_replay.test.js`: 37 pass, 0 fail (new reuse regression included).
- `npm run build`: PASS. Harness matrix above on that bundle.
- `npm test`: 5204 pass, 0 fail. The tree also held another session's uncommitted LOTM fight edits.
- `npm run check:arch`: PASS. `npm run check:rules`: PASS after this receipt block.
- `npm run check:desktop` (Electron fallback): 6/6 PASS.
- `cargo fmt --check`: PASS.

Status: implemented, below floor (AD43). Hidden fixture runs only; no natural journey, no visible window, no human review. Electron stays the playable fallback.

## Slice 2: full-move groundwork (2026-11-06, later)

Weibao: "Lets fully move to tauri, what is needed and more?" then "Go ahead, Q2 is fine, Q3 is fine, but then we should clear and save local storage accordingly". Q2 = one visible Tauri window for measurement is allowed; Q3 = downloading Tauri plugin crates is allowed. "Clear and save local storage" read as freeing disk space (the disk was 97% full) and keeping new downloads lean. Plan N1-N10 and M1-M3 as answered in chat; proposals except where he said go.

Shared edits added: `src/home_domain.js`, `src/world_completion_materials_content.js`, `src/world_completion_materials_facts.js`, `src/domain_registry.js`, `src/typed_confirm.js` (new), `src/main.js` (hard reset only), `styles/ui_extras.css`, tests `domain_registry`, `typed_confirm`.

- T5 fixed: every exit (window close, Cmd+Q, harness) saves in the page, mirrors, then waits before exit. 10/10 clean quits kept the save (run 2026-11-06T15-50-54Z), plus the hard kill.
- T3 fixed further: home context builds item names and spend checks only on read and reuses them while clock, sequence and keys are unchanged; crop-cover validation definitions are built once per frozen pair; `ownsItemKey` answers are cached per key and reset when a domain registers. Quiet-machine matrix (2026-11-06T16-16-27Z): crowded 1.00 game min/s visible-normalized (was 0.45; Electron 1.05 on Nov 6), crowded launch→ready 16.3 s, fresh 12.7 s; lag p95 427 ms crowded, 103 ms fresh; all clean quits and the hard kill kept.
- N3 done: the game's only `window.prompt` (hard reset) is now an in-page typed dialog in every host. Real WebKit run: wrong word blocks, "reset" enables, confirm restarts fresh (clock 1932 → 1920).
- N1 done: `desktop-tauri/src/mirror.rs` ports `save_mirror.cjs` (latest.json atomic with fsync, gzip history, same retention, same hash: the unit test pins the Electron value). Host routes `/__host/mirror`, `mirror-list`, `mirror-read`; restore only from the recovery page on a click, after a pre-restore snapshot.
- N2 done: heartbeat over `/__host/pong`; silence past `YAIRPG_HANG_MS` ends the content process by pid so WebKit reports it, and the terminate hook shows `/__host/recover.html`. WebKit's client-requested kill skips the delegate, so that fallback navigates itself.
- Recovery runs (fresh fixture): crash and hang both reach the recovery page with the right reason, list 2 backups, restore the newest and boot the game with the save kept.
- Disk: removed 37 harness WebKit stores (181 MB), the prototype's rebuildable `target/` (803 MB) and the scratch app copy in `work/shell-comparison-20261106/web` (75 MB). The harness now deletes each WebKit store it creates (`--keep-stores` to keep).

Checks (slice 2): `cargo test` 3/3 (mirror); `cargo build`/`fmt --check` PASS; focused node tests: home_* 92 + household 131 set, world-completion/audit/home set 200/200, domain_registry 4/4, typed_confirm 2/2, ui_contract 3/3 after token fix; `check:desktop` 6/6 on rerun (one `desktop_crash_guard` failure happened while the harness loaded the CPU); full gates for the commit are recorded in its message. Still implemented, below floor: hidden runs only, no visible window yet, not human-reviewed.

Next: N4 frozen builds and adoption, N5 `.app` bundle and the ported desktop checks, then the visible-window measurement Weibao allowed (Q2), N6-N8 parity, N10 retire Electron.
