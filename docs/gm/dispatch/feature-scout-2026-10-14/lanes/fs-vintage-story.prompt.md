You are lane `fs-vintage-story` in the YAIRPG feature scout wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first, in order: docs/gm/dispatch/feature-scout-2026-10-14/FEATURES.md, then docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md. They govern this prompt.
Work area: `~/.codex/research/fs-vintage-story/`
Weibao, 2026-10-14: "send out the free game stuff accordingly, using codex, some of the steam ones are installing, did we consider rimworld yet? more to consider?"

Output dir (the only repo path you may write): `docs/research/vintage-story/`
Private deep details: `docs/research/vintage-story/private/fs-vintage-story/`

## Game and payload
Not installed and not owned as far as we know (not on Steam). Anego Studios publishes the survival and essentials mods and the API on GitHub as source-available code: reading and learning are allowed by its README; do not redistribute. Game JSON assets ship only with the paid game, so take numeric values from the official wiki (wiki.vintagestory.at, MediaWiki API, one request per second or slower) and label them stated.

## Route
Clone `anegostudios/vssurvivalmod`, `anegostudios/vsessentialsmod` and `anegostudios/vsapi` into `repos/` and pin commits in TOOLING.md. Read C# directly. Prior scout context: docs/research/GAME_ABSORPTION_SCOUT_2026-10-14-report.md (F2, smithing workpiece).

## Questions (answer each in the Feature answers table)
1. CH: barrels. How does a sealed barrel recipe (soaking hides, lime water, brine) hold inputs, timers and output, and what happens when it is opened early or the liquid amount is wrong?
2. CH: drying and transitions. How do perishable and transitionable properties (drying, curing, rot) work per item stack, and how is ambient condition applied?
3. CH: workpieces. How does the anvil or clay forming keep a half-made voxel workpiece, reheating, and recovery when removed?
4. P02/P01: How does the handbook show where an item is used and why a station cannot work right now?
5. Kit-making: how are multi-part items (tool heads plus handles, armor parts) assembled and what does each part carry?

## Done
Per FEATURES.md and COMMON.md. CHECKPOINT.md stays current so a restart resumes. Final message: the answers in one line each, top three proposals, gaps.
