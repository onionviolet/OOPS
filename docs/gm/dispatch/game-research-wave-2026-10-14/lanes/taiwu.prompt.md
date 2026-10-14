You are lane `taiwu` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/scroll-of-taiwu/`
Work area: `~/.codex/research/taiwu/`

## Source and payload gate
The Scroll of Taiwu, Steam app 838350, Windows-only. Weibao owns it. Weibao installs it through Steam with his macSteam `notproton` compatibility tool (Windows depots). Payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/The Scroll Of Taiwu/`. A watcher starts this lane once a Windows executable is there and the app manifest says fully installed. If it is missing or partial when you start, write CHECKPOINT `Status: BLOCKED (payload)`, do the web/wiki groundwork below, and stop.

Route: Unity with a separate C# game-data backend in recent versions; ilspycmd on the managed assemblies; config tables via UnityPy or the shipped data files. The installed macOS folder only holds the soundtrack DLC (depot 946970); ignore it.

## Questions
1. Inheritance: how the Taiwu heir line passes skills, items, relationships and legacy points across generations.
2. Sects and martial arts: technique data, reading/comprehension mechanics, internal force, sect relations and favour.
3. World simulation: NPC lifecycles, villages, the Taiwu village building economy, time and aging.
4. Data shape of the large config tables; Chinese is fine, paraphrase in English.
