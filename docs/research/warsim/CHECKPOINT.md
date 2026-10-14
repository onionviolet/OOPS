# Warsim research checkpoint

Status: PARTIAL
Date: 2026-10-14
Lane: warsim. Only repo write area: docs/research/warsim/.

Done: all four research questions addressed at static evidence depth; native
runtime identified; content inventory and six named native functions inspected;
ranked YAIRPG proposals, five implementation packets, 24 small touches,
Province War strategy fit and complete unread text inventory delivered.
Manifest gate passes: build 25097075, StateFlags 4, zero staging, complete
byte counters. Warsim.exe SHA-256 matches TOOLING.md. No launch or save reads.

Next pending item: coordinator may register this PARTIAL dossier and supersede
its earlier gated snapshot. No owner docs changed by this lane. A follow-up
native pass can select one named formula question from this table. No watcher,
install or approval is needed to use these research findings.

## Unread / unverified table

| Gap | Named table/function/path | Why and bounded next route |
|---|---|---|
| Exact battle resolution | BattleSim, BattleDamage, BattleEvents, BattleTroopReturn | Broad native branches not reconstructed; static trace one troop casualty and return |
| Exact economy arithmetic | TurnReport, RefreshPhase, CombatPhase and economy branches in Preparation | Menus establish intended values, not order; trace one harvest/wage resolution |
| Modifier stacking and all behavior consumers | RaceGenerator, SetRaceEffects, RaceSuffix.txt, RaceType.txt | Survey and selected writes only; trace one multiply/set combination through a real consumer |
| Event tables and eligibility | RandomTurnEvent, RandomExploreEvent, ProcGenExplo, throne-room branches | Embedded choices found, dispatch weights unread; trace one named petition |
| Name aliases and every grammar branch | Name, NameMaker, NameWriter, FactionNameGenerator, Data/Names/*.txt | Static call reuse and file prefixes shown, full resolver unread |
| Story retention and true history joins | HeroBackground, MercGenerator, SaveGame, LoadGame | Selection shown, downstream lifecycle not reconstructed |
| Full content semantics | Data/ and Extras/ text paths in TABLE_COVERAGE.md | Every file counted/hashed; many only inventoried, others sampled |
| Old executable and asset interpretation | Extras/Warsim Classic Edition (2015)/Warsim classic.exe; audio, images and art pools | Historical/visual assets outside selected mechanics questions |
| RNG seed and save lifecycle | rand/srand callers, SaveGame, LoadGame | Mutable draws shown; no claim of addressed draws or save determinism |
| Gameplay and persistence | Current installed game, fresh saves/reload/import | Game launch prohibited by COMMON; never exercised |
| Personal state | Saves/, Scores/ | Private and deliberately excluded, not a research follow-up |

Raw work area disk used: approximately 10 MiB at final measurement; exact bytes
recorded in FINDINGS.json. Raw extracts are outside git, with SHA-256 list at
`~/.codex/research/warsim/extract/HASHES.txt`.

Outputs: REPORT.md, FINDINGS.json, IMPLEMENTATION_PACKETS.md, SMALL_TOUCHES.md,
TOOLING.md, PROVINCE_WAR_FIT.md, three system digests, SOURCES.md,
TABLE_COVERAGE.md and this checkpoint. Artifact validation passed. Static
research completion for this pass does not mean native or YAIRPG gameplay done.
