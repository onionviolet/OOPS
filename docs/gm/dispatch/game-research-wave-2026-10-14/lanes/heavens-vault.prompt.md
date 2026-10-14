You are lane `heavens-vault` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/heavens-vault/`
Work area: `~/.codex/research/heavens-vault/`

## Source and payload gate
Heaven's Vault, Steam app 774201, Windows-only. Weibao owns it. Weibao installs it through Steam with his macSteam `notproton` compatibility tool (Windows depots). Payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Heaven's Vault/`. A watcher starts this lane once a Windows executable is there and the app manifest says fully installed. If it is missing or partial when you start, write CHECKPOINT `Status: BLOCKED (payload)`, do the web/wiki groundwork below, and stop.

Route: Unity. Identify Mono vs IL2CPP. Extract TextAssets (compiled ink JSON) with UnityPy in a venv or AssetRipper built from source with the local dotnet; ILSpy on Assembly-CSharp if Mono. Inkle's ink runtime is open source (inkle/ink) for reading the JSON format.

## Questions
1. Knowledge as progress: how the Ancient-language glyph system stores words, guesses, confirmation and contradiction; how translation confidence gates dialogue and routes.
2. Ink story structure: knots, variables, the timeline/history graph, and how learned facts unlock text across the game.
3. The river network map and travel time as pacing.
4. What YAIRPG's knowledge/notebook systems (grep `docs/` for "notebook" and "known") could take from it.
