# bf-hogwarts tooling and rerun

2026-10-14. No new installs, downloads, game launches or native decompiler sessions. All tools and retained evidence reused read-only. Work area is `/Users/weiwei/.codex/research/bf-hogwarts/`. The installed manifest reports app 990080, build 20773316, StateFlags 4. Existing install is sufficient. This pass does not certify uninstall readiness.

## Source tools reused

Pins recorded by the owning [prior TOOLING](../TOOLING.md): repak `355b5f62f51959c7cc6dd5a51708646ef483065d`, retoc `885a8dae740cb1ce1e41ff2e74f67f9f0c118237`, CUE4Parse `0415fe26eeba66ac0d814c2547b098219682066f`. The compiled AssetRead helper uses GAME_HogwartsLegacy with ReadScriptData enabled. Existing .NET SDK is 10.0.402. No tool rebuild or source mutation was needed. SDK header lead `12ffa8a46fb84e7ed13a528715dfd8bb5521594c` explicitly warns addresses may be wrong; none of its addresses was used as native evidence. REA/Ghidra were unnecessary for the completed static selections; the unresolved native questions remain open.

## Mechanical extraction

Commands already run, with environment variables shown only as rerun conveniences:

```sh
BF="$HOME/.codex/research/bf-hogwarts"
HL="$HOME/.codex/research/hogwarts-legacy"
PAKS="$HOME/Library/Application Support/Steam/steamapps/common/Hogwarts Legacy/Phoenix/Content/Paks"
"$HL/repos/repak/target/release/repak" unpack "$PAKS/pakchunk0-WindowsNoEditor.pak" -o "$BF/extract/fresh" -i 'Phoenix/Content/SQLiteDB/*.sqlite' -i 'Phoenix/Content/Localization/WIN64/*-enUS.bin' -i 'Phoenix/Config/DefaultGame.ini' -i 'Phoenix/Config/DefaultInput.ini' -i 'Phoenix/Config/DefaultEngine.ini'
"$HL/repos/retoc/target/release/retoc" to-legacy "$PAKS" "$BF/extract/save-assets" --no-shaders -f /BP_AutosaveTrigger.uasset -f /BP_AutosaveComponent.uasset -f /BPI_SaveRestore.uasset -f /UI_BP_Settings_SaveLoad.uasset -f /UI_BP_ModTutorialSaveGame.uasset
"$HL/repos/retoc/target/release/retoc" to-legacy "$PAKS" "$BF/extract/dialogue-assets" --no-shaders -f /CONV_ZSI_01_02_CloseConv_SG.uasset -f /CIN_Mission_ZSR_01_OpeningConvo_SG.uasset -f /DA_ConversationPresets.uasset -f /BP_ConversationMenuAction.uasset
"$HOME/.dotnet/dotnet" "$HL/tools/AssetRead/bin/Release/net10.0/AssetRead.dll" "$BF/extract/save-assets" "$BF/notes/save-json"
"$HOME/.dotnet/dotnet" "$HL/tools/AssetRead/bin/Release/net10.0/AssetRead.dll" "$BF/extract/dialogue-assets" "$BF/notes/dialogue-json"
python3 -I "$HL/tools/localization.py" "$BF/extract/fresh/Phoenix/Content/Localization/WIN64/MAIN-enUS.bin" "$BF/notes/MAIN-enUS.json"
python3 -I "$HL/tools/localization.py" "$BF/extract/fresh/Phoenix/Content/Localization/WIN64/SUB-enUS.bin" "$BF/notes/SUB-enUS.json"
python3 -I "$BF/tools/inspect.py"
python3 -I "$BF/tools/evidence.py"
python3 -I "$BF/tools/write_report.py"
python3 -I "$BF/tools/inventory.py"
python3 -I "$BF/tools/write_supplements.py"
```

`inspect.py` opens both databases with mode=ro&immutable=1 and query_only, runs integrity_check, exports complete rows/schema privately, and records table counts. `evidence.py` retains complete call parameters and exact dialogue-node properties/text joins, compares fresh files against retained copies, and snapshots the old asset index. The writing helpers reproduce this lane's report, not any other owner's docs. Use `python3 -I "$BF/tools/finalize.py"` for hashes and document checks. Inspect helpers before rerunning; another build needs schema/asset review.

## Receipts and limits

- Seven targeted pak files extracted; both full DBs, MAIN/SUB and three configs. All seven hash-match retained copies. That checks these files only, not the entire installed game.
- Five save packages and four dialogue packages converted with zero retoc failures and parsed with zero AssetRead failures. Raw output is .uasset/.uexp; export duplication is preserved.
- Complete 530 Ship/633 Game table schemas and rows are under notes/tables; decoded text/graph/call evidence stays in notes. New extracted files have SHA256 in extract/HASHES.txt. Notes and tool hashes are recorded separately by finalize.py.
- The original IoStore index is reused as a snapshot. It was not regenerated against every container. DB equality is not complete index-precedence proof.
- No new public web claims were needed; installed files are primary evidence. No browser/network fetches were attempted.
- Dead ends: the prompt's COVERAGE.md does not exist, so COVERAGE.json was read instead. One diagnostic path omitted AssetRead's `save-assets/` prefix; corrected by enumerating the actual JSON path. One exploratory SDK filename was absent; the declarations live in Phoenix_struct.h. No extraction/parser route failed, no login retry and no repeated install.

## Private archive map

| Private path under work area | Contents |
|---|---|
| extract/fresh | Both databases, complete English MAIN/SUB and selected configs |
| extract/save-assets, extract/dialogue-assets | Nine converted package pairs |
| notes/tables/ship, notes/tables/game | Complete rows plus schemas for every database table |
| notes/MAIN-enUS.json, notes/SUB-enUS.json | Complete decoded text, private only |
| notes/save-json, notes/dialogue-json | Complete parsed exports, including bytecode and embedded text |
| notes/dialogue-lines.json, dialogue-branch-providers.json | Exact selected IDs/speakers/known text and condition lookup references; unknown effects not invented |
| notes/save-call-index.json | Function calls/parameters, not a replacement for control-flow review |
| notes/reused | Read-only copies of retained index evidence |
| notes/fresh-comparison.json, census.json, inventory-receipt.json | Hash comparison, integrity/counts and inventory provenance |

Broader native/dialogue/AI archives remain in the original work area and existing gitignored dossier private directory. This lane did not alter or claim full validation of them. Do not move full text/data into tracked docs.
