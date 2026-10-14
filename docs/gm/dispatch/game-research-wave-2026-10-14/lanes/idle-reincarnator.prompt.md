You are lane `idle-reincarnator` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/idle-reincarnator/`
Work area: `~/.codex/research/idle-reincarnator/`

## Source
Idle Reincarnator, Steam app 3779340, Windows build present (macOS Steam shipped the Windows depot): `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Idle Reincarnator/`. Godot 4 game (godotsteam and godotgif DLLs). The resource pack is likely embedded in `Idle Reincarnator.exe` or a `.pck`. Route: GDRE Tools / gdsdecomp (bruvzg/gdsdecomp) built from source if practical, or a PCK lister/extractor (Rust or Python) plus a GDScript bytecode/token decompiler. Never run the .exe.

## Questions
1. It was the only idler found with several realms inside one reincarnation loop. How do realms coexist in one life? What carries over across reincarnations, and how is that shown to the player?
2. Unlock order and legibility of parallel systems; per-realm currencies; offline progress and catch-up.
3. Life-sim elements: age, lifespan, death causes, talents or traits rolled per life.
4. Data shape: content tables (resources, realm defs) and the save format.
Compare against `docs/research/immortality-idle/`, `docs/research/groundhog-life/` and YAIRPG's death/reset research (`docs/research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md`).
