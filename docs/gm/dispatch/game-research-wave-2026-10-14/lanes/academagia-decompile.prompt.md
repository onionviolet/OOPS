You are lane `academagia-decompile` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/academagia/decompile-2026-10-14/`
Work area: `~/.codex/research/academagia-decompile/`

## Source and payload gate
Academagia: The Making of Mages, Steam app 533480, Windows-only. Weibao owns it. Weibao installs it through Steam with his macSteam `notproton` compatibility tool (Windows depots). Payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Academagia The Making of Mages/`. A watcher starts this lane once a Windows executable is there and the app manifest says fully installed. If it is missing or partial when you start, write CHECKPOINT `Status: BLOCKED (payload)`, do the web/wiki groundwork below, and stop.

Route: ILSpy (`ilspycmd`) on the .NET 4.0 managed assemblies; read the shipped data files (database, XML or binary: identify). The 2010 BCS mod tools, if public, may describe the data.

## Questions
1. Exact roll formula, skill/exam scoring and grading weights; class step tables.
2. Event and adventure data: how the 258 adventures are stored, triggered and weighted; calendar and day-slot structure of the school year.
3. Relationships, clubs, factions and their numeric hooks.
4. Confirm or correct every formula the prior web lane took from the community wiki.
Prior web lane: `docs/research/academagia/` (REPORT, FINDINGS, PACKETS P1-P5, CHECKPOINT). Don't edit those; confirm or correct them in your REPORT.
