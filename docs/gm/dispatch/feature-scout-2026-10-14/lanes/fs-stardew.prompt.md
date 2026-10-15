You are lane `fs-stardew` in the YAIRPG feature scout wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first, in order: docs/gm/dispatch/feature-scout-2026-10-14/FEATURES.md, then docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md. They govern this prompt.
Work area: `~/.codex/research/fs-stardew/`
Weibao, 2026-10-14: "send out the free game stuff accordingly, using codex, some of the steam ones are installing, did we consider rimworld yet? more to consider?"

Output dir (the only repo path you may write): `docs/research/stardew-valley/`
Private deep details: `docs/research/stardew-valley/private/fs-stardew/`

## Game and payload
Installed (Steam app 413150, macOS native): `~/Library/Application Support/Steam/steamapps/common/Stardew Valley/Contents/`. Owned by Weibao. Find the main game assembly and the Content folder inside the app bundle. Compare the build id in the appmanifest.

## Route
ilspycmd on the game DLL (export only the namespaces you need). Content data is in .xnb files: use a pure reader (for example xnbcli or a Python XNB parser in a venv); do not run the game or any tool that boots the game's own runtime. 1.6 data is mostly JSON-shaped models; record which files you parsed.

## Questions (answer each in the Feature answers table)
1. P02: One crop, fish or forage good can be sold, gifted, cooked, put in a bundle, or processed. Where does each destination read the item, and how does the UI quote the choice?
2. CH: Machines (keg, preserves jar, dehydrator, cask, furnace): how is input held, timed and collected; what does removing, pausing or a full output do?
3. P19: Heart events and dialogue: how are conditions, gift effects and event preconditions written, and does any choice cost or fail?
4. P03: Where do skills, recipes and crafting recipes come from (level up, TV, mail, friendship, purchase) and how is learned vs craftable now shown?
5. A04 save: what the save stores for machines in progress and relationships.

## Done
Per FEATURES.md and COMMON.md. CHECKPOINT.md stays current so a restart resumes. Final message: the answers in one line each, top three proposals, gaps.
