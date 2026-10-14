# Tooling and rerun record

No tools installed in this lane. No repos cloned, no game executable run, no runtime cache created, no game/save/config changed, no Git staging/commit/push. Existing main-checkout changes were inspected and preserved. Output writes are restricted to this directory. No agents were spawned.

## Inputs and tools

- Payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Academagia The Making of Mages/`.
- Manifest: adjacent `steamapps/appmanifest_533480.acf`. Gate observed StateFlags 4, build 2453605, staging size zero, downloaded/staged byte totals complete, depot manifest 6671209053462036643. Owner account field was not copied into reports.
- Work root: `/Users/weiwei/.codex/research/academagia-decompile/`.
- Existing .NET SDK 10.0.402 and ILSpy 11.1.0.9782 / decompiler 11.1.0.9782.
- Existing python3, `file`, `rg`, `git`, `du`; Python standard library only.
- Prior web files read: REPORT, FINDINGS, IMPLEMENTATION_PACKETS, CHECKPOINT. Their status claims were not promoted to live truth.

## Decompile commands

Set `DOTNET_ROOT="$HOME/.dotnet"` and prepend `$HOME/.dotnet` and `$HOME/.dotnet/tools` to PATH. For each of GameLogic.dll, Common.dll, ContentModel.dll, Storage.dll, Academagia.Core.dll and Academagia.exe:

```sh
ilspycmd -p -o "$HOME/.codex/research/academagia-decompile/extract/GameLogic.dll" "/Users/weiwei/Library/Application Support/Steam/steamapps/common/Academagia The Making of Mages/GameLogic.dll"
```

Replace both assembly components for the other five. Logs are `notes/<assembly>.log`; all six processes exited zero. The UI assembly was only type-listed with `ilspycmd -l c`, output `notes/UI-types.txt`. It was not fully decompiled. Third-party dependency implementations were not audited.

## Passive binary route

Authored local scripts under `tools/`, not game code:

1. The header census reads `CustomSerializer.ObjectTypes` in order, then a byte presence flag, Int32 count and GUID array per type. Base census is `extract/header.json`; counts are `notes/counts.json`. Header length consumed 7,189,608 bytes exactly.
2. `read_content.py` follows the decompiled LoadFromStream primitive schema and inheritance. It handles optional visualization references and skips external resource bytes. String cache is off for shipped records; version 3.0 includes SelectionItem expression fields. It never invokes .NET deserialization or imports the game's assemblies. Output can contain raw writing and stays local.
3. ZIP extraction rejected paths escaping the destination. Patches are unpacked separately in `extract/mods/Content/` and `extract/mods/The Blush of Summer/`; four headers were decoded with the same 112-type registry.
4. `merge_profiles.py` passively decodes the exact shipped NRBF List<Guid> deletion structure, validates its capacity tail and final byte, and writes both per-patch reconstruction JSONs. This intended deletion-list interpretation differs from `GetDeletedObjects`' string-array cast; REPORT preserves that discrepancy.
5. `make_digests.py` writes only CLASS_TABLES.md and passive aggregate notes. It checks 17 courses, 1,192 gains, 360 dates, all gains linked to their course, variance 3 and legal weights.

Commands that worked:

```sh
python3 -I "$HOME/.codex/research/academagia-decompile/tools/read_content.py" "/Users/weiwei/Library/Application Support/Steam/steamapps/common/Academagia The Making of Mages/OfficialContent/data.bin"
python3 -I "$HOME/.codex/research/academagia-decompile/tools/read_content.py" "$HOME/.codex/research/academagia-decompile/extract/mods/Content/new_data.bin" "$HOME/.codex/research/academagia-decompile/extract/mods/Content/new_header.json" "$HOME/.codex/research/academagia-decompile/extract/mods/Content/new.json"
python3 -I "$HOME/.codex/research/academagia-decompile/tools/merge_profiles.py"
python3 -I "$HOME/.codex/research/academagia-decompile/tools/make_digests.py"
```

Repeat the second command for modified and for The Blush of Summer, preserving quotation around spaces. Logs: `parse.log`, `mod-new.log`, `mod-modified.log`, `summer-new.log`, `summer-modified.log`. Exact data endpoints: base 68,154,787; Content new 37,652,388, modified 21,736,426; Summer new 38,099,207, modified 23,099,249 bytes. Each reader asserted EOF.

`extract/HASHES.txt` hashes all original payload files. `extract/EXTRACT_HASHES.txt` hashes local decoded/decompiled artifacts and scripts, excluding the two hash ledgers themselves. No hash means gameplay proof. Local raw hashes are not committed.

## Dead ends and corrections

- `file` identifies data.bin/header.bin as generic data, and .mdm as ZIP; format identification needed the reader code.
- The first Python schema omitted inherited methods on classes without their own override. Parsing failed in the first Ability. Fixed inheritance traversal, then all streams reached exact EOF.
- A string-GUID scan incorrectly returned zero deletions. Inspection showed a binary List<Guid>. Replaced the scan with the validated passive decoder; provisional counts were not retained as authoritative totals.
- One ad hoc summary repeatedly parsed JSON inside a generator and was interrupted. Corrected by loading each file once. No installed game process was touched.
- Searches for guessed EducationSystem/MeritSystem and a guessed MemoryDB path failed; actual class reader is ClazzSystem, actual MemoryDB is Storage.DB. Use `rg --files` on restart.
- The official mod tools were searched once. A primary BCS forum profile surfaced 3.0.22 content patch instructions; no editor package was fetched or installed. No failed web fetch or login was retried. Source: https://academagia.invisionzone.com/profile/4-command/content/ .

## Reuse map

Read `GameLogic.dll/Academagia.GameSystems/{RollSystem,ExamSystem,ClazzSystem,StorySystem,RelationshipSystem,CliqueSystem,StressSystem}.cs`; normal roll rule is `Academagia.Roll/BaseRollRule.cs`, not Power alone. Runtime clock/scheduler are Academagia.DateAndTime and Academagia.Scheduler. Authoring/runtime schema is `ContentModel.dll/ContentModel/`; publisher is `Storage.dll/Storage.Publish/`; runtime merge route is `Storage.dll/Storage.DB/MemoryDB.cs`. Resume from CHECKPOINT before extending content claims.
