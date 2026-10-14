# Reproduce this source-only pass

Lane work area: `/Users/weiwei/.codex/research/tale-of-immortal-2/`.
Raw workbooks remain in their existing backup. Raw exports, scripts and full receipts stay private. No repos cloned, new tools installed, Windows executable run or proprietary code copied into the repo.

## Source identity and route changes

Prior INTAKE: Steam1468810/build21758240/depot1468811/manifest5275750898890021375, Windows x64 IL2CPP. Fresh checks found no named app under Applications, no home-library appmanifest1468810, no named Steam payload and no prior `~/.codex/research/tale-of-immortal/`. `libraryfolders.vdf` lists one library. Spotlight located the October9 backup. This is a backup table pass; current build comparison is UNKNOWN, not unchanged.

Read only `/Users/weiwei/Documents/Backups/tale-of-immortal-2026-10-09/Mod/modFQA/配置修改教程/配置（只读）/` and companion `配置（只读）Json格式/`. Other backup folders, user saves, active Mods/UserData and compatibility bottles were not read. A shallow filename listing located the backup before opening official tables. Downloads1468810 zip files were located but not unpacked/run. No current native binary or fresh symbol map was available; old MelonLoader stubs were not promoted into body evidence.

Prior TOOLING.md was not present in the prior lane. CHECKPOINT and EXTRACTION_RECEIPT name old tooling and private files, but those scripts are absent. Existing backup workbook exports therefore needed bounded reconstruction. Eleven selected workbooks were parsed, not all914 again. Bulk parse does not mean bulk semantic review.

## Commands that worked

`tools/read_xlsx.py` uses only Python stdlib zipfile and ElementTree. It records source SHA256, exact worksheet row/cell coordinates, private JSON export paths and hashes in `extract/MANIFEST.json`; `extract/HASHES.txt` hashes exports and companion source JSONs. It decodes shared and inline strings and preserves sparse coordinates. Numeric values stay strings.

```sh
python3 -I ~/.codex/research/tale-of-immortal-2/tools/read_xlsx.py '/Users/weiwei/Documents/Backups/tale-of-immortal-2026-10-09/Mod/modFQA/配置修改教程/配置（只读）' ~/.codex/research/tale-of-immortal-2/extract
python3 -I ~/.codex/research/tale-of-immortal-2/tools/validate_tables.py
python3 -I ~/.codex/research/tale-of-immortal-2/tools/query.py 'RoleMarry|RoleDying|SchoolPostParam'
```

`query.py` is a private inspection aid, not a schema validator. Skip rows whose ID is not numeric. One ad hoc RoleGrade printer initially treated trailing commentary as records and raised KeyError: phase after printing the numeric records. It was corrected for final inventory and validation. Row48 onward commentary is not another realm. No failed fetches or network requests occurred.

Validation independently compares exported named cells with22 supplied official companion JSON tables, skipping worksheet commentary. Result:8385 numeric-ID rows,115837 compared values,0 differences. This is export fidelity, not agreement with current runtime-loaded data. Check counts and source JSON hashes are in private `extract/VALIDATION.json` and public `VALIDATION.json`.

Selected workbooks: NPC封装行为配置表,角色交互行为配置表,角色配置表,宗门AI配置表,宗门配置表,宗门战配置表,奇遇配置,大地图元素配置表,创角配置表,副本配置表,角色行为日志配置表. Companion JSON and header filenames were inventoried for goal/AI/student/marriage terms; no complete autonomous selector table was recovered. RoleLogBase IDs alone did not reveal behavior execution, so that sheet supplies no new autonomy claim.

## Other lane inputs

Read local cultivation-idlers REPORT, newer Path REPORT, and newer Immortality Idle REPORT. No web refresh or source execution of those games. Immortal Life directory was absent; its Steam manifest reported StateFlags6, SizeOnDisk0, no installed depots and zero downloaded bytes when read. This is an availability observation, not a permanent claim or interpretation of its mechanics.

All writes confined to this pass directory and the named private work area. Main checkout already had many concurrent edits. No git staging, commit, push, YAIR source edit, game launch, build or save test occurred. Final validator checks required outputs, JSON parsing, internal report links, hashes and punctuation. Those checks validate the research delivery only.
