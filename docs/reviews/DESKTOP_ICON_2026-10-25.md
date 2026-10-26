# OOPS desktop icon, 2026-10-25

Request: give the Electron app its own logo so it can be distinguished from
other Electron apps. Rules: AD32/36/39, AR3/4/6. Seam: `desktop/main.cjs`,
the existing desktop host composition root. No game or persistence changes.

The existing `resources/img/oops-icon.svg` is the logo owner. Its 1024×1024
PNG rendering now supplies the native window icon and macOS Dock icon at
startup. The running player's process also received the icon through its
existing main-process inspector, without restart or page reload.

Target surface: macOS Dock at native OS scale, with a recognizable green
interlocking OOPS mark. Desktop content layout, mobile optimization, packaging,
Finder bundle identity and signing remain outside this request. This is a
runtime icon for the existing Electron launch route.

## Verification

Input: HEAD `b56691dab6d712364a866493c2959684c3dac6af` plus these host edits.
`desktop/main.cjs` SHA-256:
`bb1d08d3b2a1155f9cd2078e2fa65f72721b558010cbddb7e48ed2942a064bd5`.

- PNG visual inspection: PASS, existing logo rendered at 1024×1024.
- `node --check desktop/main.cjs`: PASS.
- Isolated hidden Electron launch through a temporary instrumented entry point:
  PASS. The real startup called Dock `setIcon` with a nonempty 1024×1024 native
  image. Window and Dock remained hidden on the disposable profile.
- Running player app icon application: PASS, native `setIcon` returned normally,
  image nonempty at 1024×1024, existing Dock remained visible. OS appearance
  still awaits human visual acceptance.
- `npm run build`: PASS. Existing game bundle rebuilt; no game-source changes.
- `npm run check:arch`: PASS.
- `npm run check:rules`: FAIL on an unrelated existing/shared rule registration
  mismatch: index UR1–UR69 versus rulebook UR74. No rule files changed here.
- `npm test`: PASS, 3,214 tests, zero failures.

The first rendering attempt found no bundled Playwright Chromium; installed
Chrome rendered the SVG successfully. The first isolated harness incorrectly
required Electron by absolute package path and stalled before host startup;
its exact test PID was stopped and the corrected harness passed. The first
live inspector expression used an unavailable global `require`; using the
existing main module's require applied the icon successfully.

Source edits and the current running Dock icon are applied locally. No commit
or push. No player saves were read or changed by this task.
