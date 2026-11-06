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
node scripts/tauri/harness.mjs --variants base --fixtures fresh --seconds 5
```

## Switches (environment)

| Switch | Effect |
| --- | --- |
| `YAIRPG_HIDDEN=1` | No window or Dock icon; alert/confirm/prompt never show. Refuses to start without one of the next two |
| `YAIRPG_USER_DATA=dir` | Separate persistent WebKit store, keyed by the path string (the folder itself is not written) |
| `YAIRPG_EPHEMERAL=1` | In-memory store, gone at exit |
| `YAIRPG_ROOT=dir` | Serve another checkout or snapshot |
| `YAIRPG_URL=url` | Load a different URL (the harness's loopback variant) |
| `YAIRPG_HARNESS_SCRIPT=file`, `YAIRPG_REPORT=file` | Inject a test page script; `/__harness/report` and `/__harness/exit` exist only with a report file |
| `YAIRPG_APPNAP=1` | Let macOS App Nap the process (diagnosis only; the host normally holds a latency-critical activity) |
| `YAIRPG_WK_THROTTLE=1` | Keep WebKit's hidden-page timer throttling and process suppression (diagnosis only) |

## Parity with the Electron host

| Electron feature | Tauri state |
| --- | --- |
| `app://` protocol, live serving | Done (`yairpg://`, async, misses reported to the harness) |
| Background run guards (alert/confirm/prompt) | Done |
| Separate test profiles | Done (`YAIRPG_USER_DATA`, `YAIRPG_EPHEMERAL`) |
| `window.prompt` | Returns null. Electron answers synchronously over IPC; Tauri IPC is async, so callers need an in-page dialog |
| Save mirrors, restore, final snapshot on close (A1) | Not ported. `mirrorList` returns no backups |
| Hang and crash guard (EL46) | Not ported |
| Dock badge, notifications (A4) | Not ported (`attention` is a no-op) |
| Pop-out panels (A3) | Not ported (no `projection`, so the page skips building projections) |
| Window size and position (A7), native menu | Not ported |
| Frozen builds, adoption, installer, signing | Not ported |

## Saves

WebKit keeps localStorage apart from Electron's profile, so a player's
Electron save does not appear here on its own. Move one with the game's own
Export and Import. Any automatic migration needs a recorded compatibility
decision first.
