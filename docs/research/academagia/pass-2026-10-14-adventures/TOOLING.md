# Tooling and mechanical rerun

No tools installed, repos cloned, network requests, game/Windows/managed assembly executions, save/cache/bottle reads or writes, main source edits, Git staging/commit/push or agents. Standard Python, rg, gzip, hashlib, XML parsing and shell text readers only. Foreground computer control was not used.

Prior work area `/Users/weiwei/.codex/research/academagia-decompile/` was read-only. New scripts, private decoded-analysis copies and notes are under `/Users/weiwei/.codex/research/academagia-2/`. Repo writes are confined to `docs/research/academagia/pass-2026-10-14-adventures/`. The main tree was already heavily dirty and shared; no unrelated cleanup was attempted.

## Inputs

Prior REPORT, CHECKPOINT, TOOLING, FINDINGS, EVENTS_AND_CALENDAR and RELATIONSHIPS_AND_GROUPS. COMMON, PROJECT top 80 lines, USER_VISION desktop/world-depth/solo-route direction. Prior passive `extract/content.json`, both patches' new.json/modified.json, intended merged.json/deleted.json, and decompiled GameLogic, Storage and ContentModel files.

Installed app identity and build are inherited evidence from the prior lane, not reverified against Steam in this pass. No finished binary extraction or managed decompile was repeated. The prior scripts were read, not run or edited. SHA-256 hashes of reused decoded inputs and own extracts are in new `extract/HASHES.txt`; original payload hashes remain in the prior work area.

## Commands that worked

```sh
python3 -I /Users/weiwei/.codex/research/academagia-2/tools/map_content.py
python3 -I /Users/weiwei/.codex/research/academagia-2/tools/club_digest.py
python3 -I /Users/weiwei/.codex/research/academagia-2/tools/verify_maps.py
```

`map_content.py` loads base once, indexes by type/GUID, then overlays modified and new bodies separately for Content and Summer. It deliberately does not apply List<Guid> deletions, matching the inspected type-test path. It does not assert a selected mod profile. XML selection node metadata gives readable path labels; pathCodes preserve the IDs and parent/child chain. It transforms record grammar to an analysis ledger, interns repeated IDs, and gzip-compresses it at level 1 with fixed timestamp. Story HTML, original choice descriptions and expression text never enter the repo ledger. Uncompressed copies remain private.

Every Adventure, linked Exit/Investigation, roll, Benefit/Effect, Continuance, prerequisite and selection path is transformed. The auxiliary analysis covers every Ability/Action, including roll-effect relations, gates and effect consumers. Graph roots match StorySystem's “not targeted by any Continuance” definition. DFS counts only exit links from those roots; it does not prove player eligibility or include every forced engine start.

`club_digest.py` uses the private nested club map, emits readable mechanical choice rows, and combines them with original short scene paraphrases. Both 24/20-stage named chains are covered. Other organizations are not implied to be included.

`verify_maps.py` reads each compressed ledger and checks node ID sets, choice lists, roll/effect list lengths, outcome continuation ID lists/destinations and actor path integrity against decoded inputs. It rejects narrative field keys and content/HTML markers, emits VERIFICATION.json and TRIGGER_REFERENCES.json, then removes only this lane's superseded uncompressed repo analysis files. Trigger references identify location discovery, selection references and Initiate effects. A selection reference alone is not an active trigger. It hashes artifacts and decoded inputs. Do not run it before map generation completes.

Source inspection routes: `rg --files` to locate real classes; `rg -n` for Merge/GetDeletedObjects/CreateGame/GetPossibleStories/ApplyBenefits/CalculateContinuanceDate; bounded sed/cat reads of the actual methods. No guessed download or editor acquisition was needed.

## Corrections during tooling

| Issue | Correction |
|---|---|
| Auxiliary Ability/Action rolls are RollEffectRelation IDs, not Roll IDs | Read the relation's roll and linked effects; direct story rolls remain separate |
| XML key references overwrote real node names when indexing every ID | Index tree/node elements only, with property fallback for unnamed list nodes |
| Nested actor wrapper and selection shared an ID, creating a self-reference in interning | Actor wrapper uses an actor field, while selection owns the ID; verification checks source actor paths |
| Repeated full inline analysis and unrelated action consumers made repo output bulky | Intern references and compress analysis; retain plain counts, indexes and club tables; private raw and uncompressed copies stay outside Git |
| Guessed Initiate strategy glob had no matches | Actual implementation is Academagia.Effects/InitiateImpl.cs |

These were local script/schema corrections, not installed-game failures. No runtime error was reproduced. No fetch failed or login was attempted. Patches were not extracted again.

## Revisit limits

Maps encode mechanics, not a manual narrative retelling. Actor modes, condition selections, expression presence and exact paths are retained, but full live dynamic resolution is unverified. The no-deletion reconstruction models replacement on valid input records; malformed stream ordering, duplicate GUID behavior and the original .NET environment remain unexecuted. Combined Content + Summer order is source-traced but not mapped as a fourth profile.
