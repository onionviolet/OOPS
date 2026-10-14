Read docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md and follow it.

Lane ER5: proper game engine options. Output
docs/research/GAME_ENGINE_OPTIONS_2026-10-14.md and
docs/gm/dispatch/engine-runtime-2026-10-14/ER5/REPORT.md.

Evaluate root palette EG0-EG7 against THIS codebase (text/panel-heavy idle
life sim, ~98k lines plain JS, localStorage saves, inkjs, desktop-first,
many parallel agents). With current cited sources: Godot 4 (web export size,
C# web limits, UI nodes for dense panels, GDScript vs C#, save conversion),
Unity 6 (WebGL size, UI Toolkit, licensing), Bevy/Rust-WASM core with JS UI,
Defold, PixiJS/Phaser/Excalibur/Kaplay hybrids, Tauri 2/Electron shells.
For each: what problem here it actually solves, what it does not, rough port
cost (estimate from src line counts per area, labeled INFERRED), save and
gate continuity, team/agent workflow fit. Include a hybrid migration path
(e.g. Rust core behind RT2 interface, or Godot shell over web view) and the
evidence that would justify switching. Recommend; do not hedge everything.
