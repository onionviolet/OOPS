You are lane `bf-kill-the-lich-idle` in the YAIRPG aspect backfill of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dirs).
Read first, in order: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md (the aspect standard). They govern this prompt.
Work area: `~/.codex/research/bf-kill-the-lich-idle/`
Weibao, 2026-10-14: "send the same aspect pass for past stuff, consider if need install and more?"

Output dir (the only repo path you may write): `docs/research/kill-the-lich-idle/aspects-2026-10-14/`

## Game and payload
Prior dossier: `docs/research/kill-the-lich-idle/` (read REPORT, CHECKPOINT, COVERAGE, INTAKE and TOOLING first). Weibao owns it on Steam; the original private extracts stayed on the old Mac and are gone. A watcher started this lane because Steam now reports it fully installed under `~/Library/Application Support/Steam/steamapps/common/` (find it via the appmanifest whose name matches ['kill the lich']). Compare the installed build id with the prior INTAKE and say if it changed.

## Route
Rebuild only the extraction each aspect needs, following the prior TOOLING (ilspycmd for Mono/.NET, Il2CppDumper or Cpp2IL for IL2CPP, REA over Ghidra for native code as described in `docs/research/hogwarts-legacy/REA_TRIAL.md`, direct reads for Godot, Electron, Java, Paradox script or data files). Never run the game or any Windows executable.

## Task
Full aspect pass (A01-A12, SYSTEM_INVENTORY, DEEPER_SYSTEMS); priority rows A01 dialogue, A03 implementation, A04 save. Put corrections to the prior dossier first in ASPECTS.md. CHECKPOINT.md in the aspects folder. Done: per ASPECTS.md.
