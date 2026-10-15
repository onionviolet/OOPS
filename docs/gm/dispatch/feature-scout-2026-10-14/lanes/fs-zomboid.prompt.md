You are lane `fs-zomboid` in the YAIRPG feature scout wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first, in order: docs/gm/dispatch/feature-scout-2026-10-14/FEATURES.md, then docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md. They govern this prompt.
Work area: `~/.codex/research/fs-zomboid/`
Weibao, 2026-10-14: "send out the free game stuff accordingly, using codex, some of the steam ones are installing, did we consider rimworld yet? more to consider?"

Output dir (the only repo path you may write): `docs/research/project-zomboid/`
Private deep details: `docs/research/project-zomboid/private/fs-zomboid/`

## Game and payload
Installing (Steam app 108600, macOS native) at `~/Library/Application Support/Steam/steamapps/common/ProjectZomboid/`. A watcher started you once files appeared; confirm the download finished (appmanifest StateFlags 4 and nonzero SizeOnDisk) before relying on file lists. Owned by Weibao.

## Route
Lua under `media/lua` and recipe and item scripts under `media/scripts` are plain text: read directly. The Java core needs a Java decompiler (Vineflower or CFR, user-local install) only for questions Lua cannot answer. Never run the game.

## Questions (answer each in the Feature answers table)
1. P03: Skill books (XP multiplier within a level band, none alone), recipe magazines, TV and VHS (capped direct XP): how each is implemented and how they combine.
2. P04: How is 'knows recipe' kept apart from 'has station, tools, skill and materials now', and what does the crafting UI show when one is missing?
3. CH: Build 42 chains: butchering, hides, tanning, drying racks, smithing, pottery: stages, timers, stations.
4. BD: Traits, moodles, injuries and body parts: which systems read which field.
5. P01: How a timed action reports why it stopped or cannot start.

## Done
Per FEATURES.md and COMMON.md. CHECKPOINT.md stays current so a restart resumes. Final message: the answers in one line each, top three proposals, gaps.
