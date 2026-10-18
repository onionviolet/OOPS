# Dialogue structure recovered without game execution

All 64 encrypted inputs decoded privately through the recovered firstpass file reader and AES parameters. Original and decoded bytes remain outside Git. The scan below reads graph structure and conditions; it does not claim full writing, alternate-story or runtime coverage.

## G1: RPG graph structure

19 graph definitions, 187 nodes: 19 Begin, 103 Speech, 42 Option, 23 Function. All local link targets resolve and node names are unique within each file. There are 26 nonempty visibility scripts, 22 execute scripts and 23 function NodeClass fields. No nonempty EnableScript occurs in these graphs, although the consumer supports it. The system and test graphs are included, so these are shipped definitions, not 19 player story arcs.

| File | Nodes | Visibility scripts | Execute scripts |
| --- | ---: | ---: | ---: |
| `JuQing_dialogue_0.xml` | 97 | 19 | 14 |
| `JuQing_dialogue_1.xml` | 3 | 0 | 0 |
| `JuQing_dialogue_2.xml` | 4 | 0 | 0 |
| `JuQing_dialogue_3.xml` | 4 | 0 | 0 |
| `Rpg_Arena_0.xml` | 6 | 1 | 2 |
| `Rpg_Arena_Mdie.xml` | 3 | 0 | 0 |
| `Rpg_Arena_Onlinedie.xml` | 3 | 0 | 0 |
| `Rpg_Arena_Ping.xml` | 3 | 0 | 0 |
| `Rpg_Arena_Tdie.xml` | 3 | 0 | 0 |
| `Rpg_Arena_YingTian.xml` | 5 | 0 | 2 |
| `Rpg_Tower_0_Talk1.xml` | 14 | 1 | 1 |
| `Rpg_Tower_0_Talk2.xml` | 2 | 0 | 0 |
| `Rpg_Tower_0_Talk3.xml` | 8 | 2 | 2 |
| `Rpg_Tower_0_Talk4.xml` | 7 | 1 | 1 |
| `Rpg_Tower_1_Talk1.xml` | 2 | 0 | 0 |
| `system.xml` | 1 | 0 | 0 |
| `system_dialogue.xml` | 2 | 0 | 0 |
| `test.xml` | 13 | 0 | 0 |
| `tower_dialogue.xml` | 7 | 2 | 0 |

Selected paraphrased trace: JuQing_dialogue_0 has options gated by a world-flag progression and discovered-information checks. Some speech nodes change that flag; another condition joins late progression and readiness. Rpg_Arena_0 has a gated entry and executable setup that creates encounter actors, switches control and starts a countdown. Tower graphs combine visibility rules with function nodes. These show actual authored use of state changes and domain calls, not only unused schema fields. Full called-script and resolution chains remain unread. No source writing is reproduced.

## G2: Jianghu table structure

Eight tables contain 289 nonempty tagged data rows and 144 distinct tag strings after their two header lines. The source loader starts at row 3. This is a physical base-table count, not loaded runtime count after language/mod replacement. Sparse DLC rows have fewer columns; missing-cell handling was not audited. One Missing fallback record is present.

| File | Tagged data rows |
| --- | ---: |
| `AboutClue.txt` | 7 |
| `AboutThing.txt` | 28 |
| `Linghun.txt` | 24 |
| `Quanhua.txt` | 9 |
| `chat.txt` | 89 |
| `chat_DLC.txt` | 116 |
| `chat_DLC_WuDang.txt` | 15 |
| `system.txt` | 1 |

Columns define tag, target type, question, default/success/failure responses, parameters and optional NPC exclusion/unlock. Full dialogue and literal conditions remain private at extract/decoded and notes/dialogue-structure.json.

Sources: private `extract/decoded/Settings/RPG/Dialogues/`, `extract/decoded/Settings/Jianghu/Talk/`, `extract/GFileUtil.cs:13-36`, `extract/AES.cs`, `extract/managed/XiaWorld/JianghuMgr.cs:468-505`. Hashes: extract/HASHES.txt.
