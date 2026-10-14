You are lane `immortal-life` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/immortal-life/`
Work area: `~/.codex/research/immortal-life/`

## Source and payload gate
Immortal Life, Steam app 1201230, Windows-only. Weibao owns it. Weibao installs it through Steam with his macSteam `notproton` compatibility tool (Windows depots). Payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/ImmortalLife/`. A watcher starts this lane once a Windows executable is there and the app manifest says fully installed. If it is missing or partial when you start, write CHECKPOINT `Status: BLOCKED (payload)`, do the web/wiki groundwork below, and stop.

Route: Unity likely; identify Mono vs IL2CPP. Mono: ilspycmd on Assembly-CSharp plus config tables (JSON/CSV/ScriptableObjects via UnityPy). IL2CPP: Cpp2IL or Il2CppDumper built from source for type names, then data tables only.

## Questions
1. Cultivation life sim loop: lifespan, realms and breakthroughs, cultivation methods, sect life and jobs.
2. NPC simulation: relationships, marriage, disciples, rivals, autonomous NPC cultivation.
3. Events, encounters and fortune; inheritance or next-life carry-over.
4. Compare with `docs/research/tale-of-immortal/`, `docs/research/amazing-cultivation-simulator/` and the cultivation idlers.
