# Private evidence and retention index

No raw dialogue, story, data or native code is stored in this repo folder. These local paths are private research artifacts, not game saves. Prior work areas were reused read-only.

| Evidence | Private locator | Retention / limit |
|---|---|---|
| Full authored tables | `~/.codex/research/warsim-aspects-2026-10-14/extract/data/Data/` | 190 selected Data files; 27 mutable/settings files excluded; schema interpretation partial |
| Dialogue/flavor text and IDs | `extract/dialogue-index.json` in new work area | 38 pools, full row text, build/path/line IDs, native literal-reference addresses; Advice per-row tag and exact eligibility rule; other predicates explicitly unread |
| Per-table count/hash/capture status | `extract/data-capture.json` | Counts and SHA-256 of retained bytes; exclusions explicit |
| Native table references | `extract/native-data-references.json` | RIP-relative literal address scan; contexts are routing evidence, not all-path reachability |
| New resolver bodies and assembly | `extract/new-chains.txt`, six named `.asm` and five `.c.txt` files | Advice, MonsterMaker/Leveller, GenerateRelations, QuestGenerator decompiled; RelationRand assembly read |
| New phase/caller windows | `extract/main-phase-opening.asm`, MonsterLeveller caller files | Initial time seed, selected annual order, one XP gate; unaligned leading bytes in exploratory caller windows are not evidence |
| Relation cell schema | `extract/relation-writer-schema.json` | All 14x15 writer cells and input/negative flags; no live Relations data retained |
| Native helper inventory | `extract/game-functions.json` | 143 named helpers; next-symbol span is metadata only |
| Whole native string pool | `~/.codex/research/warsim/extract/strings.json` | Full strings with executable offsets; not a decoded dialogue graph |
| Earlier content inventory and six native reads | `~/.codex/research/warsim/extract/` | Tables/strings/symbols/call edges retained; no redo of completed reads |
| Prior event/name/economy/save traces | `~/.codex/research/warsim-rea/extract/` | Full selected assembly, petition windows, REA output and annotations |
| Full positional save field sequence | `~/.codex/research/warsim-rea/notes/save-schema.json` | 1,903 writer and 1,454 integer reader locators; string joins and legacy branches partial |
| Prior REA/direct comparison | `~/.codex/research/warsim-rea/notes/` and prior REA_TRIAL.md | Measurement reused; no REA service launched this pass |

New extract/tool/receipt digests are in `~/.codex/research/warsim-aspects-2026-10-14/extract/HASHES.txt`. IDs are snapshot addresses. Full text changes across builds require new IDs or an explicit mapping; row-number stability is not assumed.
