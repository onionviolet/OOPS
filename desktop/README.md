# Desktop host

Electron shell for the web build (AD39). `src/` never imports this folder; the
browser build stays the default test target. The page reaches the host only
through `window.yairpgHost` (see `src/host.js`), and every call has a browser
fallback.

The desktop window and macOS Dock use `resources/img/oops-icon.png`, the
emerald portal logo selected on 2026-10-26. The host assigns it at startup,
including launches through the development Electron binary. The previous
rings logo is preserved in `resources/img/branding/` as the beta identity.

## Modules

| File | Owns |
| --- | --- |
| `main.cjs` | Composition root: process setup, `app://` protocol, game window. Keep it under 160 lines. |
| `host_context.cjs` | Run mode, origin test, shared `webPreferences`, capability list |
| `guard_host.cjs` | Link policy, `window.prompt` stand-in, hang and crash guard (EL46) |
| `build_host.cjs` + `snapshot.cjs` | What `app://` serves, frozen builds (EL18) |
| `mirror_host.cjs` + `save_mirror.cjs` | Save backups, restore, final snapshot on close (A1) |
| `presence_host.cjs` | Dock badge, notifications (A4) |
| `popout_host.cjs` + `popout_page.cjs` | Pop-out panels (A3) |
| `window_host.cjs` + `window_state.cjs` | Window size and position (A7) |
| `app_menu.cjs` | Native menu |
| `preload.cjs` | The only code in the page's process. Sandboxed, so it cannot require local files; channel names are plain strings, paired by `tests/desktop_ipc_channels.test.js` |

## Add a host feature

1. New `<name>_host.cjs`: register IPC at load, `capabilities.push('<name>')`.
2. Expose it in `preload.cjs` behind `capabilities`, with a catch for an older main process.
3. Add the page call to `src/host.js` as a no-op without a host.
4. Require the module from `main.cjs`; add a hidden-Electron check under `scripts/desktop_*.cjs` and list it in `scripts/check_desktop.mjs`.

## Switches (environment)

`YAIRPG_HIDDEN=1` no window or Dock icon; `YAIRPG_INACTIVE=1` visible but never focused;
`YAIRPG_USER_DATA=dir` fresh save origin (always use it for agent runs);
`YAIRPG_CDP_PORT=n` DevTools Protocol on 127.0.0.1; `YAIRPG_FROZEN=1` serve the frozen snapshot in a hidden run;
`YAIRPG_ROOT=dir` serve a folder live; `YAIRPG_MIRROR=0|1` backups off, or on for a background run
(`YAIRPG_MIRROR_MS` poll gap); `YAIRPG_HANG_MS` hang limit; `YAIRPG_THROTTLE=1` allow background throttling;
`YAIRPG_DOWNLOAD_DIR`, `YAIRPG_SERVE_LOG=1`, `YAIRPG_DIALOGS=1`, `YAIRPG_BUILD_POLL_MS` for tests.

## Checks

`npm run build && npm run check:desktop` runs all six hidden-Electron checks (smoke, crash guard, frozen build,
save mirror, presence and pop-out, offline). `node scripts/desktop_soak.cjs --seconds 28800` is the overnight soak.
Never run these against the player's userData.

## Agent tools

`npm run mcp:game` serves the headless game over MCP (`scripts/mcp/`). Register it in a client yourself, for example
`claude mcp add yairpg-game -- node /Users/weiwei/code/yet-another-idle-rpg/scripts/mcp/game_mcp.mjs`.
