# Harry library, current installed pack

AD36 / AD43 acceptance replay, 2026-11-25. This is composed school access using the supported `hp-term-jinx` fixture, not an earned opening-to-school claim. No runtime changes or old save-pin rewrites were used. The historical failed replay and two earlier playtests remain separate.

The fresh fixture registers the actual installed Harry pack (base content hash `f9cfc3e531af70cd0cab095801b536ac60d52f4bdb0369dddcdce623d4760d5d`), composes the existing school setup, plays the real Charms lesson and class-wand commands, then applies the documented Wednesday 22:59 clock-only setup. The generated fixture is retained privately at `.lane-builds/hp-library-current-20261125/astronomy-fixture.json`; its hash is in `proof.json`.

The 1920×1080 browser replay used current default `dist/bundle.js`, SHA256 `9a960b6694049fb0da8063c09e6245254469cebeaa20c96c8793a7f54f8e9fc1`. Actual Astronomy class set the assignment. Ladder retrieval and chart copying took 15 minutes; notes-based homework took 30 minutes. Learned Levitation retrieved the book after two ordinary attempts. Save/reload preserved the lowered book; copying again and Export/file Import preserved two notes, one marked homework and no pending assignment. Zero page errors. `imported.jpg` was visually inspected.

Checks:

- `node tests/hp_library_current_fixture.mjs`: exit 0; fresh current-pack fixture, generated pins retained unchanged after real preparation commands.
- `node tests/hp_library_work_browser.cjs . .lane-builds/hp-library-current-20261125/astronomy-fixture.json docs/representations/evidence/harry-library-current-pack-2026-11-25`: exit 0, including browser/server teardown. Result in `result.json`.
- `node --check tests/hp_library_current_fixture.mjs` and `node --check tests/hp_library_work_browser.cjs`: passed. The browser harness serves its fixture-origin response through context interception and does not write into the supplied build root.
- Normal Workbench attachment and reopened build comparison: exit 0. New immutable sidecar `d89266495fa727ee6d07630ed7c2d69a12ca589e371e8808318c14b68cf530ca` attached to Harry N2 proposal `5f0c07c35f376c6433a9967abc683ba9044ea752881f5a93cf23592ae7813f9c`, report `5a7c2d8333dd67df6f1ef9dac6d2d605397b454b80bf5bbb0e04b0a1be31bb25`. It reports `exact-match`; proof bytes unchanged. See `attachment.json` and `workbench-current-build-1366.png`.

Public proof SHA256: `fb8a984b6f41a4ca1940f03fa981f05e217f711675c52eeaa2a5897142ba35c7`. Frozen original library receipt remains SHA256 `3b821d732abffad3155867dc73004ca5c8d0951b8defa66d598523a2e57647b1`. The current sidecar supplements the two historical playtests and does not replace their tested-build identities. No default rebuild, full suite or human review was performed. Agent-verified, not human-reviewed.

The private fixture is retained because this record cites it. Exported save and attachment scratch script were removed; owned browser/server processes exited.
