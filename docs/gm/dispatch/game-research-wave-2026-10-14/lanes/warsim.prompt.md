You are lane `warsim` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/warsim/`
Work area: `~/.codex/research/warsim/`

## Source and payload gate
Warsim: The Realm of Aslona, Steam app 659540, Windows-only. Weibao owns it. Weibao installs it through Steam with his macSteam `notproton` compatibility tool (Windows depots). Payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/`. A watcher starts this lane once a Windows executable is there and the app manifest says fully installed. If it is missing or partial when you start, write CHECKPOINT `Status: BLOCKED (payload)`, do the web/wiki groundwork below, and stop.

Route: Identify the runtime first (.NET console or other). If .NET, ilspycmd. Otherwise strings plus data files; Ghidra only for a named question.

## Questions
1. How one developer keeps a huge text kingdom sim varied: event tables, procedural races/factions/heroes, name and lore generators.
2. Kingdom economy, army, diplomacy and arena loops; what is a number vs flavor text.
3. Scope management: content per system, reuse of generators across systems.
4. Fit for YAIRPG's procedural generation (`docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`) and for Province War (note any useful strategy rules in a short `PROVINCE_WAR_FIT.md`).
