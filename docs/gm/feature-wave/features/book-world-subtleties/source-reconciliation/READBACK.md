# Nineteen-row source reconciliation readback

All 19 canonical table rows match exactly one current profile: cultivation3, recognition4, situated4 and roster8. Four final delivery receipts are present, explicitly released and hash-matched against their modules, coverage and integration owners. No provisional rows, missing rows, duplicate profile matches, unclaimed profiles, structural field gaps or missing local source-reference files remain.

[ASSEMBLED_ROWS.json](ASSEMBLED_ROWS.json) preserves exact edition hashes/reviewed extent, source unknowns and citations, aliases/getter arguments, source-era/local-original branches, rule exports, topology/chain dispositions and native binding gaps. [assemble.mjs](assemble.mjs) can rebuild this static reconciliation without invoking any source-rule/gameplay helper.

The canonical table prints labels, not machine IDs. The JSON keeps each exact label/ordinal/line and explicitly maps stable existing profile IDs into `canonicalRowId`; it does not falsely claim these IDs were printed in IMPLEMENTATION_PLAN. `book.labyrinth_mad_god` maps to one `labyrinth-mad-god` row with two supplied volume boundaries; `fallout4` retains its actual roster getter spelling. LOTM and COI remain distinct eras/rows. One original recognition desk is intentionally shared by four comparison profiles.

Parent-owned original relay/native carrier and Paradise-derived hub/two original destination work remain separate. This assembly attests no new native consumer, source-world arrival/return/mission/clock or playable direct adaptation. Original Frontier's existing native consumers are retained as existing mechanisms; its new profile consumer remains inert. Complete supplied-book reading and bounded game/manga/publisher references remain different source classes. Actual unknowns are not structural missing rows.

## Exact row/alias readback

| Ordinal | Canonical table label | Reconciled row ID | Actual getter argument | Worker | Chain phases |
|---:|---|---|---|---|---:|
| 1 | Original Frontier | `original-frontier` | `original-frontier` | roster | 5 |
| 2 | Reincarnation Paradise | `reincarnation-paradise` | `reincarnation-paradise` | roster | 5 |
| 3 | Fated Villain | `fated-villain` | `fated-villain` | cultivation | 6 |
| 4 | Reverend Insanity | `reverend-insanity` | `reverend-insanity` | cultivation | 6 |
| 5 | Shadow Slave | `shadow-slave` | `shadow-slave` | recognition | 5 |
| 6 | Regressor's Tale | `regressors-tale` | `regressors-tale` | cultivation | 6 |
| 7 | Omniscient Reader | `omniscient-reader` | `book.omniscient_reader` | situated | 6 |
| 8 | Labyrinth of the Mad God | `labyrinth-mad-god` | `book.labyrinth_mad_god` | situated | 5 |
| 9 | Mother of Learning | `mother-of-learning` | `mother-of-learning` | recognition | 5 |
| 10 | Lord of the Mysteries | `lord-of-mysteries` | `lord-of-mysteries` | recognition | 5 |
| 11 | Circle of Inevitability | `circle-of-inevitability` | `circle-of-inevitability` | recognition | 5 |
| 12 | Worm | `worm` | `book.worm` | situated | 5 |
| 13 | Legendary Mechanic | `legendary-mechanic` | `book.legendary_mechanic` | situated | 5 |
| 14 | Skyrim | `skyrim` | `skyrim` | roster | 5 |
| 15 | Fallout 4 | `fallout4` | `fallout4` | roster | 5 |
| 16 | Elden Ring | `elden-ring` | `elden-ring` | roster | 5 |
| 17 | Naruto | `naruto` | `naruto` | roster | 5 |
| 18 | Bleach | `bleach` | `bleach` | roster | 5 |
| 19 | Harry Potter | `harry-potter` | `harry-potter` | roster | 5 |

## Input module hashes

| Worker | Module | SHA256 | Final receipt status |
|---|---|---|---|
| cultivation | `src/feature_expansion_book_cultivation.js` | `540e99414192ec73cfbe26feb11e5dc6783a3286dd7765649830bd4fed79286c` | released-hash-matched-snapshot |
| recognition | `src/feature_expansion_book_recognition.js` | `ed4b6534175dd1ff83cf842825cf5414de3b6489aa8c4d8f64473ff3d861afcd` | released-hash-matched-snapshot |
| situated | `src/feature_expansion_book_situated.js` | `53445ec8421f2b0d219ea62835dcec67b45884ea9dbbfc504141e617b67e996f` | released-hash-matched-snapshot |
| roster | `src/feature_expansion_book_roster.js` | `880bd66b18d3d8dfc451370ecb9cc8fb8b1028619e3dfbf1f6a33dfbc43d254c` | released-hash-matched-snapshot |

Checks performed: static ESM import/export readback, JSON parse, final receipt/core-file hashes,19-row canonical table reconciliation, profile alias/phase/rule-field review and local source-reference file existence/hashes. No book reread, reader restart, source-rule/helper execution, build, gameplay, browser/save/reload/failure/keyboard/regression/director checks. Source/profile/research owners and private saves remained untouched.

Assembly SHA256: `d0441921690298e0b9958798a6a2e40dd010e575885c082cd93fcec52ca481a7`.
