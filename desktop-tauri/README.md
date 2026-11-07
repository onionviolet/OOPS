# Tauri desktop host

The desktop host since 2026-11-06 (AD39, amended); the Electron host was
removed the same day (its code is in git history before that commit).
`src/` never imports this folder; the page reaches either host
only through `window.yairpgHost` (`src/host.js`), and every call has a browser
fallback.

The installed app (`~/Applications/Yet Another Idle RPG.app`, 17 MB, ad hoc
signed, id `local.yairpg.tauri`) serves frozen builds from
`~/Library/Application Support/local.yairpg.tauri/builds`, so it keeps working
while this checkout changes. Its save mirror lives beside them in `save-mirror/`.

## Commands

| Command | Does |
| --- | --- |
| `npm run desktop` (= `npm run tauri`) | Build, snapshot the working tree into the app's builds, open the app (an open game offers "Save and reload") |
| `npm run tauri:install` | Build, bundle and install the `.app` with the macOS tools (no Tauri CLI), plus a first snapshot |
| `npm run check:tauri` | Hidden checks: smoke, quit save, save mirror, hang and crash guard, reset dialog, presence and pop-out, save import, frozen build |
| `node scripts/tauri/adopt.mjs prepare --commit <sha>` · `verify` · `swap --yes` | Put a clean commit into the app: scratch build, hidden verify on a copy of the newest save, then install as latest |
| `node scripts/tauri/import_save.mjs [--yes]` | Copy the Electron app's newest save in as a backup; the next launch opens recovery to restore it |
| `node scripts/tauri/harness.mjs [...]` | The measurement and scenario harness (variants and options in its header) |

Developer builds: `cargo build --release --offline --manifest-path desktop-tauri/Cargo.toml`.
Agent runs are always hidden and use their own store (`YAIRPG_USER_DATA`); the harness deletes each WebKit store it creates.

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
| `YAIRPG_STORE=0` | Host save store off (on whenever the run has a data folder); `YAIRPG_STORE_MS` disk-write gap, default 5 s |
| `YAIRPG_HANG_MS=n` | Hang limit before the page is stopped and recovery shown (default 30000; 0 turns the guard off) |
| `YAIRPG_QUIT_MS=n` | Wait after the quit save before exit (default 1500) |
| `YAIRPG_FROZEN=1` | A hidden run serves frozen builds from its data folder instead of the working tree; `YAIRPG_BUILD_POLL_MS` (default 3000) |
| `YAIRPG_INACTIVE=1` | Visible window that does not take focus |
| `YAIRPG_APPNAP=1` | Let macOS App Nap the process (diagnosis only; the host normally holds a latency-critical activity) |
| `YAIRPG_WK_THROTTLE=1` | Keep WebKit's hidden-page timer throttling and process suppression (diagnosis only) |

## Parity with the retired Electron host

| Electron feature | Tauri state |
| --- | --- |
| `app://` protocol, live serving | Done (`yairpg://`, async, misses reported to the harness) |
| Background run guards (alert/confirm/prompt) | Done |
| Separate test profiles | Done (`YAIRPG_USER_DATA`, `YAIRPG_EPHEMERAL`) |
| `window.prompt` | Not needed: the game's one caller (hard reset) uses the in-page `src/typed_confirm.js` dialog in every host; `prompt` returns null |
| Save mirrors, restore, final snapshot on close (A1) | Done (`src/mirror.rs`, same files and hash as `scripts/tauri/save_mirror.cjs`; under `~/Library/Application Support/local.yairpg.tauri/save-mirror`, or `<YAIRPG_USER_DATA>/save-mirror`) |
| Host-owned save store (O2, 2026-11-06) | Done (`src/store.rs`): every localStorage change goes to `<data>/storage/local.json` in revision order; if WebKit loses or re-keys its storage, page start copies the host copy back before the game reads it. Disk writes are batched (5 s, and on quit). Checked by `tauri_store_wipe` |
| Hang and crash guard (EL46) | Done: heartbeat over `/__host/pong`; a stopped or crashed page shows `/__host/recover.html` with the backups |
| Quit | Saves, mirrors and waits before exit (window close, Cmd+Q) |
| Dock badge, notifications (A4) | Done (`src/desktop.rs`): badge follows the count; a notification when it rises, the window is unfocused, at most once a minute (bundled app only) |
| Pop-out panels (A3) | Done: View > Pop out world events (Cmd+Shift+E), read-only projections, trimmed like the Electron host |
| Window size and position (A7), native menu | Done: tauri-plugin-window-state; File (Save now, Restore a backup, Show backups folder), Edit, View (pop-out, reload, zoom, full screen), Window |
| Frozen builds and adoption (EL18, MDL16) | Done (`src/builds.rs`, `scripts/tauri/adopt.mjs`). The app makes snapshots itself in Rust, so it no longer needs Node; `scripts/tauri/snapshot.cjs` (agent tools) uses the same rules and gives the same id, pinned by a Rust test |
| Installer, signing | `.app` bundle with ad hoc signing; no notarized installer (not needed for local play) |
| DevTools menu item | Not included (needs Tauri's devtools feature) |
| Windows and Linux | Not built or tested (WebView2 / WebKitGTK; later, for Steam) |

## Saves

WebKit keeps localStorage apart from Electron's profile, so an Electron save
does not appear here on its own. Compatibility decision (2026-11-06, Weibao's
"work on these to completion" after the save-move proposal): copy, never move.
`import_save.mjs` copies the Electron mirror's newest snapshot into this app's
backups unchanged (same snapshot format and hash; the format lives in `scripts/tauri/save_mirror.cjs`) and the next launch opens the
recovery page; the save changes host only when the player clicks Restore. The
Electron profile is never written. Export and Import still work for any save.
