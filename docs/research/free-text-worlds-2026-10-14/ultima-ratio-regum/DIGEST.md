# URR static mechanism locators

SHOWN: official ZIP `URR0104d.exe`, PyInstaller script entry `URR0104d`, CPython 3.7 bytecode magic 3394. Original filename/line numbers survive in code objects. Line numbers below are original-code metadata plus inspected instruction ranges, not a claim that the original `.py` was supplied.

Extract base: `/Users/weiwei/.codex/research/free-text-worlds/extract/`. `urr-code-index.json` inventories code objects. Each selected `.dis.txt` records instructions and original lines. Hashes live in `HASHES.txt`. Full disassembly exists for resumption but was not fully read.

| Code | Original locator | Inspected extract | Mechanism / limit |
| --- | --- | --- | --- |
| UR-S1 | `URR0104d.py`, Civilization.__init__, 29935; bottle branch 29976-29987 | `urr-Civilization-__init__.dis.txt`, lines 2514-2596 | If a shared trait pool is empty, repopulate; pick a trait and remove it. Culture choices spread across a finite pool before repeats. |
| UR-S2 | Religion.__init__, 266048; choices 266076-266319 | `urr-Religion-__init__.dis.txt`, instructions through theme assignment | Stored relic/altar/furniture variation; multiple shared option pools replenished when exhausted. |
| UR-S3 | Heresy.__init__, 265174; parent/constraint branch 265176-265212 | `urr-Heresy-__init__.dis.txt`, lines 1365-1430 | Find parent religion, resolve home civilization, pick a candidate difference; incompatible parent/candidate loops back. No retry bound established in this sample. |
| UR-S4 | History.__init__, 154483; religion branch 154505-154523 | `urr-History-__init__.dis.txt`, lines 6211-6285 | Event category selects a prose branch; religion origin chooses from a pool and dates from civilization start plus 10-100. Other categories only sampled. |
| UR-S5 | draw_painting, 114223; initial selection 114224-114250 | `urr-draw_painting.dis.txt`, lines 740-897 | Quality and geometry/frame variation. Sample includes a loading-screen path; it does not read a civilization object in the inspected initial branch. |
| UR-S6 | make_civilizations, 271226 | `urr-make_civilizations.dis.txt` | Empty-list local then return. Actual civilization creation must be traced elsewhere, not inferred from this name. |

INFERRED adoption: keep shared parent facts, varied presentation and deliberate constraints. Use YAIRPG's existing generator contract, observation freeze and transactional consumers. Do not copy glyph grids, prose, source or assets.
