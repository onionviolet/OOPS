# Ultima Ratio Regum

2026-10-14. Static Python-bytecode inspection of official **0.10.4d**, without launching it. The download contains Python 3.7 and tcod components, not loose game `.py` source. Its PyInstaller script was extracted, ZIP CRC checked and disassembled with xdis. This is recovered bytecode, not a recovered original source file. [Official download](https://www.markrjohnsongames.com/wp-content/uploads/2026/01/URR0104d.zip), [tooling](../TOOLING.md).

**UR-F1, SHOWN:** `Civilization.__init__` assigns culture traits and draws bottle color/shape from shared pools, removing chosen values and replenishing exhausted pools. This spreads distinctive material styles across nations. `Religion.__init__` stores theme and coordinated relic, altar and furnishing choices. `Heresy.__init__` looks up its parent religion and rejects incompatible doctrinal changes. These are connected generated records, not independent flavor rolls. [Static locators](DIGEST.md).

**UR-F2, SHOWN:** `History.__init__` stores dates and event category, reads existing civilization/religion details and builds descriptions. Its religion-origin date uses the civilization start date plus a bounded draw. This proves fact-dependent historical text in the inspected branch, not a fully simulated centuries-long society. `make_civilizations` is a tiny stub in this build, so its name alone proves nothing. [Digest](DIGEST.md).

**UR-F3, SHOWN/STATED:** `draw_painting` uses geometric grids and quality/frame choices, including a loading-screen route. That sample does not prove world-linked paintings are playable. The developer's older talk explains mixed authored/algorithmic altars and buildings; July 2026 posts describe 0.11 picture clues derived from map data and explicitly distinguish planned additions from integration. Shipped 0.10.4d and later development claims stay separate. [Developer slides, pp. 28-32](https://media.gdcvault.com/gdceurope2015/Johnson_Mark_HandmadeDetailIn.pdf), [0.11 picture clues](https://www.markrjohnsongames.com/2026/07/05/ultima-ratio-regum-0-11-update-63-picture-clues-generation-1-and-soundtrack-news/).

## Ranked PROPOSALS

| Code | Proposal / owner | Cost and disposition |
| --- | --- | --- |
| UR-P1 | Use one culture profile for vessels, doors, clothing and a recognition action. Owner: generation foundation, world core kit. | Adapt two traits and two consumers first. |
| UR-P2 | Generate historical records from event IDs, dates and involved people. Owner: timelines, procedural story. | Adapt one event and one later inquiry; history remains causal. |
| UR-P3 | Generate sect differences as constrained changes from a parent doctrine. Owner: society/law, world power rules. | Trial one rule with one useful/refused action. |
| UR-P4 | Mix authored structures with procedural variation where constraints are dense. Owner: places/generation. | Small trial; solvability check mandatory. |
| UR-P5 | Draw clues from committed places/items rather than inventing new clue scenery. Owner: discovery, knowledge. | Medium; validate reachable target and sufficient public evidence. |
| UR-P6 | Use deterministic variety pools for culture signatures. Owner: seeded generation. | Adapt concept; avoid shared mutable RNG coupling and preserve frozen observations. |

## Prior finding reconciliation

| Prior record | Result |
| --- | --- |
| Queue row 13: engine unverified | Corrected: Python 3.7/tcod package and script bytecode SHOWN for this release. No benchmark or native execution. |
| Procedural history/culture/religion/art | Extend with concrete traits, pools, doctrine checks and fact-based history. Art/world-clue integration remains partial. |
| Generation foundation contract | Compatible inspiration only. URR's global pools and Python/libtcod draws are not YAIRPG's addressed deterministic contract. |

Coverage is a selected static mechanism pass. Whole generator call graph, all history categories, all art consumers and gameplay remain unread or untested. Shared [checkpoint](../CHECKPOINT.md) owns these gaps.
