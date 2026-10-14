# Extracted data census

SHOWN: UnityPy 1.25.4 scanned the top-level serialized `.assets` and `levelN` files in the installed Data directory. Ten TextAssets were extracted, with zero caught parse errors. This is not an audit of every asset object, StreamingAssets payload or all scene configuration. Raw files, extraction index, source hashes and `extract/HASHES.txt` stay in the lane work area. [Aggregate metadata](DATA_CENSUS.json) contains no game prose.

| Data | Records / structure | Evidence |
|---|---|---|
| GameData | 867 word records, 43 atoms, 58 inscription database entries | `resources.assets`, path ID 2075 |
| Ages | 8 | `sharedassets0.assets`, path ID 47 |
| Clues | 101 | same, path ID 48 |
| Story locations | 17 | same, path ID 49 |
| Timeline events | 302 | same, path ID 50 |
| Core ink | format 19, 655 list definitions, 3165 entries in root named-content dictionary | same, path ID 51 |

The root count includes generated functions and helpers. It is not 3165 scenes, choices or authored source knots. The 58 inscription rows are not every inscription the game can generate. Word records are not a count of every inflected display form.

## Static call census

`core.root` contains 15 `KNOW_WORD` calls, 5034 `reached` calls, 98 `recently` calls and 227 `implication` calls. These are serialized call-site counts, not invocation counts or independent gameplay cases. Generic helper `showing_uncertain_translation` calls both wrong-word and correct-but-unconfirmed-word queries; `ArtefactTranslationSolved` calls the solved query; `note_learned_word` branches on `KNOW_WORD`. The API distinctions are therefore used in the shipped compiled story. Source-language indentation, comments and all original knot/stitch boundaries cannot be recovered simply from these counts.

## Timeline coverage

Of 302 rows, 269 populate unlock state, 136 remove state, 44 confirm state and 22 notify state. There are 187 upgrade IDs and 110 rows with links. Thirty rows use a title function, forty a description function. Counts are fields present with nonempty values, not mutually exclusive groups. This supports authored revision and cross-reference; it does not prove all linked entries are causal prerequisites. Individual event prose and all condition combinations remain unread.
