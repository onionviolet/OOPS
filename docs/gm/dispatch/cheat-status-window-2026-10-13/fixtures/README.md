# C0 held system fixture

Built with `node build.js`, then `node docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures/build_fixture.mjs`.

The test helper bundles the real main.js with test-only access to load/create_save and the cheat state. Headless Chrome starts a new game at 1366×768, confirms hero creation and names the hero TEST FIXTURE C0. Pure grantCheat adds system-quests with route test-fixture and the real game calendar; recordCheatMessage adds one message. The real create_save serializes held_system.save.txt. No personal save or hand-written game envelope is used. The frozen C0 gate separately verifies the uninstrumented rebuilt bundle.

Uninstrumented dist/bundle.js SHA-256: `0da7ec16332fe8918b2d5f2909a9fb84c88257045e95c29132c6d6c95559c792`.

Classification: seeded-native. This does not prove natural acquisition or a visible status panel.
