# C0 held system fixture

Built with `node build.js`, then `node docs/gm/dispatch/cheat-status-window-2026-10-13/fixtures/build_fixture.mjs`.

The test helper bundles the real main.js with test-only access to load/create_save and the cheat state. Headless Chrome starts a new game at 1366×768, confirms hero creation and names the hero TEST FIXTURE C0. Pure grantCheat adds system-quests with route test-fixture and the real game calendar; recordCheatMessage adds one message. The real create_save serializes held_system.save.txt. No personal save or hand-written game envelope is used. The frozen C0 gate separately verifies the uninstrumented rebuilt bundle.

Uninstrumented dist/bundle.js SHA-256: `0da7ec16332fe8918b2d5f2909a9fb84c88257045e95c29132c6d6c95559c792`.

Classification: seeded-native. This does not prove natural acquisition or a visible status panel.

## CH1 dormant day-3 fixture

Rebuild with `node build.js`, then run this builder with `--ch1` to preserve the existing C0 fixture.

CH1 build SHA-256: 42d270977a391a9a78f033c5e8028519f23b4552b1d1f012b02d16464cbf3d3b.

Hero: TEST FIXTURE CH1. The helper selects system-quests in the real hero creation control before confirmation. Its route is optional-start, awakened is false and messages are empty. The real update_timer advances the clock to day 2, 23:15, leaving 45 game minutes until day 3 (about 45 real seconds at the normal tick rate). The real create_save writes dormant_day3.save.txt. No hand-written game calendar or envelope is used. CH1's frozen browser gate loads this prerequisite and observes the actual day boundary, log message, reveal, save/reload and literal import on the uninstrumented build.

Classification: seeded-native prerequisite; the browser gate supplies changed-behavior evidence.
