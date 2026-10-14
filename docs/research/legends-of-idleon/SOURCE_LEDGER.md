# Source ledger

Captured 2026-10-14. Raw files are under `/Users/weiwei/.codex/research/idleon/`. Hash manifest: `extract/HASHES.txt`. Full hashes are also in FINDINGS.json. No downloaded game code is in the repository.

## Official code anchors

`https://www.legendsofidleon.com/ytGl5oc/N.js`: 26,184,213 bytes; SHA-256 `6de681a96813c15e95dccb4173d9a0a6cbe2564bb631955038a692bfdf14acd9`. Static read only; no bundle execution.

| Symbol | Line / character offset | Coverage |
|---|---|---|
| `ja.NewCharLvReq` | 23758 / 13673390 | Selected branch/context, not complete call graph |
| `q._customBlock_AFKgains` | 7117 / 4953112 | Selected branch/context, not complete call graph |
| `k._customBlock_HourlyKillRate` | 4898 / 3786537 | Selected branch/context, not complete call graph |
| `k._customBlock_AFKgainrates` | 4636 / 3650175 | Selected branch/context, not complete call graph |
| `m._customBlock_Divinity` | 4618 / 3640700 | Selected branch/context, not complete call graph |
| `m._customBlock_Spelunk` | 4633 / 3648785 | Selected branch/context, not complete call graph |
| `_event_cardQuickRef` | 11595 / 7304137 | Selected branch/context, not complete call graph |
| `PlayerAwayTime` | 4891 / 3782633 | Selected branch/context, not complete call graph |
| `AFKicons` | 4820 / 3746219 | Selected branch/context, not complete call graph |

Offsets are decoded character offsets, not byte addresses. Line numbers refer to the unformatted downloaded file.

## Wiki pages and generated tables

URL form: `https://idleon.wiki/wiki/<title>`; acquired through `Special:Export/<title>` except Worlds, acquired through the API. Article introductions and selected relevant sections read. Generated table schemas and selected rows read; row census does not claim every row was semantically reviewed.

| Title | Revision | Local source |
|---|---|---|
| Alchemy | 102906 | `extract/wiki-Alchemy-export.xml` |
| Breeding | 104412 | `extract/wiki-Breeding-export.xml` |
| Character Creation | 103511 | `extract/wiki-Character_Creation-export.xml` |
| Construction | 103521 | `extract/wiki-Construction-export.xml` |
| Cooking | 104205 | `extract/wiki-Cooking-export.xml` |
| Coral Reef | 103894 | `extract/wiki-Coral_Reef-export.xml` |
| Divinity | 103526 | `extract/wiki-Divinity-export.xml` |
| Farming | 100292 | `extract/wiki-Farming-export.xml` |
| Game Mechanics | 91421 | `extract/wiki-Game_Mechanics-export.xml` |
| Game Mechanics AFK | 83343 | `extract/wiki-Game_Mechanics_AFK-export.xml` |
| Gaming | 104254 | `extract/wiki-Gaming-export.xml` |
| Laboratory | 103548 | `extract/wiki-Laboratory-export.xml` |
| Module:Alchemy | 104133 | `extract/wiki-Module:Alchemy-export.xml` |
| Module:Alchemy/data.json | 104120 | `extract/wiki-Module:Alchemy_data.json-export.xml` |
| Module:Construction | 103460 | `extract/wiki-Module:Construction-export.xml` |
| Module:Construction/data.json | 103462 | `extract/wiki-Module:Construction_data.json-export.xml` |
| Module:CoralReef/data.json | 104125 | `extract/wiki-Module:CoralReef_data.json-export.xml` |
| Module:Divinity | 103448 | `extract/wiki-Module:Divinity-export.xml` |
| Module:Divinity/data.json | 103450 | `extract/wiki-Module:Divinity_data.json-export.xml` |
| Module:Laboratory | 104335 | `extract/wiki-Module:Laboratory-export.xml` |
| Module:Laboratory/data.json | 104329 | `extract/wiki-Module:Laboratory_data.json-export.xml` |
| Module:Mechanics/data.json | 103429 | `extract/wiki-Module:Mechanics_data.json-export.xml` |
| Module:Research | 103990 | `extract/wiki-Module:Research-export.xml` |
| Module:Research/data.json | 103988 | `extract/wiki-Module:Research_data.json-export.xml` |
| Module:Spelunking | 103677 | `extract/wiki-Module:Spelunking-export.xml` |
| Module:Spelunking/data.json | 103748 | `extract/wiki-Module:Spelunking_data.json-export.xml` |
| Research | 103567 | `extract/wiki-Research-export.xml` |
| Sailing | 103570 | `extract/wiki-Sailing-export.xml` |
| Shimmerfin Deep | 98778 | `extract/wiki-Shimmerfin_Deep-export.xml` |
| Skills | 84803 | `extract/wiki-Skills-export.xml` |
| Sneaking | 102929 | `extract/wiki-Sneaking-export.xml` |
| Spelunking | 104206 | `extract/wiki-Spelunking-export.xml` |
| Summoning | 98530 | `extract/wiki-Summoning-export.xml` |

## Generated table census

| Dataset | Table row counts |
|---|---|
| Mechanics | drops: 30, giants: 31, library: 7, slots: 2 |
| Laboratory | nodes: 18, jewels: 24, chips: 22, board: 0 |
| Divinity | styles: 8, offerings: 51, links: 10, blessings: 10 |
| Construction | flags: 8, tinyFlags: 12, tinyCogs: 10, jewelCogs: 6, basicCogs: 11, boostCogs: 9, boostBonuses: 5, refineryRanks: 24, salts: 8 |
| Research | observations: 43, postyNotes: 14, shapes: 10, grid: 60, lenses: 3 |
| Spelunking | rocks: 115, tunnels: 10, upgrades: 68, elixirs: 12, hauls: 12, amber: 5, chapters: 20, values: 0 |
| Alchemy | shop: 18, vials: 86, vialLevels: 13, sigils: 24, values: 0 |
| CoralReef | fish: 4, kid: 6, dancing: 9, corals: 4 |

Generated tables identify source version 1.22. The live bundle has a hash but no release number was established. Do not assume both snapshots have identical semantics. Empty page exports and outdated pages are recorded in TOOLING.md.

## Authority and prior context

Read COMMON.md, PROJECT.md top 80, USER_VISION standing UI/Default + Dial and parallel-world direction, Engine/SKILLS/UI owners, future queue and audit candidate rows. Prior memory supplied authority/evidence routing only; current live owners were checked. No owners outside this dossier were changed.
