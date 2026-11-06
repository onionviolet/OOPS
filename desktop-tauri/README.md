# Tauri desktop host

Main desktop development target from 2026-11-06 (AD39, amended). The Electron
host in `desktop/` stays runnable (`npm run desktop`) until this host covers
saves, recovery and normal play. `src/` never imports this folder; the page
reaches either host only through `window.yairpgHost` (`src/host.js`), and every
call has a browser fallback.

The host serves the repository live over `yairpg://localhost/` (run
`npm run build` first). Packaging, frozen builds and signing come later.

## Build and run

```sh
npm run build
cargo build --release --offline --manifest-path desktop-tauri/Cargo.toml
desktop-tauri/target/release/yairpg-tauri            # visible window, default WebKit store
```

Agent runs are always hidden and use their own store:

```sh
node scripts/tauri/harness.mjs                        # every variant, fresh and crowded fixtures
node scripts/tauri/harness.mjs --variants hang,crash,reset --fixtures fresh   # recovery and reset paths
node scripts/tauri/harness.mjs --variants base --fixtures fresh --seconds 5
```

## Switches (environment)

| Switch | Effect |
| --- | --- |
| `YAIRPG_HIDDEN=1` | No window or Dock icon; alert/confirm/prompt never show. Refuses to start without one of the next two |
| `YAIRPG_USER_DATA=dir` | Separate persistent WebKit store, keyed by the path string; the folder holds only `save-mirror/` when the mirror is on |
| `YAIRPG_EPHEMERAL=1` | In-memory store, gone at exit |
| `YAIRPG_ROOT=dir` | Serve another checkout or snapshot |
| `YAIRPG_URL=url` | Load a different URL (the harness's loopback variant) |
| `YAIRPG_HARNESS_SCRIPT=file`, `YAIRPG_REPORT=file` | Inject a test page script; `/__harness/report`, `/exit` and `/kill` exist only with a report file |
| `YAIRPG_MIRROR=0\|1` | Save mirror off, or on for a hidden run (normal play has it on); `YAIRPG_MIRROR_MS` poll gap, default 30 s |
| `YAIRPG_HANG_MS=n` | Hang limit before the page is stopped and recovery shown (default 30000; 0 turns the guard off) |
| `YAIRPG_QUIT_MS=n` | Wait after the quit save before exit (default 1500) |
| `YAIRPG_APPNAP=1` | Let macOS App Nap the process (diagnosis only; the host normally holds a latency-critical activity) |
| `YAIRPG_WK_THROTTLE=1` | Keep WebKit's hidden-page timer throttling and process suppression (diagnosis only) |

## Parity with the Electron host

| Electron feature | Tauri state |
| --- | --- |
| `app://` protocol, live serving | Done (`yairpg://`, async, misses reported to the harness) |
| Background run guards (alert/confirm/prompt) | Done |
| Separate test profiles | Done (`YAIRPG_USER_DATA`, `YAIRPG_EPHEMERAL`) |
| `window.prompt` | Not needed: the game's one caller (hard reset) uses the in-page `src/typed_confirm.js` dialog in every host; `prompt` returns null |
| Save mirrors, restore, final snapshot on close (A1) | Done (`src/mirror.rs`, same files and hash as `desktop/save_mirror.cjs`; under `~/Library/Application Support/local.yairpg.tauri/save-mirror`, or `<YAIRPG_USER_DATA>/save-mirror`) |
| Hang and crash guard (EL46) | Done: heartbeat over `/__host/pong`; a stopped or crashed page shows `/__host/recover.html` with the backups |
| Quit | Saves, mirrors and waits before exit (window close, Cmd+Q) |
| Dock badge, notifications (A4) | Not ported (`attention` is a no-op) |
| Pop-out panels (A3) | Not ported (no `projection`, so the page skips building projections) |
| Window size and position (A7), native menu | Not ported |
| Frozen builds, adoption, installer, signing | Not ported |

## Saves

WebKit keeps localStorage apart from Electron's profile, so a player's
Electron save does not appear here on its own. Move one with the game's own
Export and Import. Any automatic migration needs a recorded compatibility
decision first.
