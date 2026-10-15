# Tooling and reproducible route

## T1: Installed build and selected route

Owned Steam app 1874490, build 21042632. Read-only install root: `~/Library/Application Support/Steam/steamapps/common/Potionomics/`. Before relying on inventory, `appmanifest_1874490.acf` reported StateFlags 4, StagingSize 0, downloaded 3,567,751,216 of 3,567,751,216 bytes and staged 3,736,931,948 of 3,736,931,948 bytes. Receipt deliberately omits owner/account metadata. No game launched and no save opened.

This is Unreal, not Unity Mono/IL2CPP: a Windows Shipping executable, Engine layout, `.pak` plus `.sig`; no managed Assembly-CSharp.dll or GameAssembly.dll route. `repak info` with the working archive key reports V11/Fnv64BugFix, encrypted index, Zlib and 71,441 entries. The shipping executable contains native `/Script/Potionomics` classes and build path strings. Cooked package engine versions are stripped to 0.0.0. UE4.27 is the successful parser setting, not an assertion of exact engine release.

## T2: Reused tools, revisions and installs

| Tool/source | Revision | Use |
|---|---|---|
| `~/.codex/research/hogwarts-legacy/repos/repak/target/release/repak` / https://github.com/trumank/repak | 355b5f62f51959c7cc6dd5a51708646ef483065d | Existing native macOS CLI, read-only info/list/unpack |
| Existing CUE4Parse assembly / https://github.com/FabianFG/CUE4Parse | 0415fe26eeba66ac0d814c2547b098219682066f | Referenced existing locally built DLL, no shared repo writes |
| `~/.dotnet/dotnet` | Existing SDK 10.0.402 | Build a lane-local reader; no Windows binary run |
| Python standard library, `strings` | Existing local tools | Selection, compact flow notes, census, hashes and documentation |
| `tools/AssetRead` | Lane-local source in work area | UE4.27 DefaultFileProvider with ReadScriptData; Newtonsoft JSON; locres reader |

No software installed. No new repository cloned. No game binary was run, injected or uploaded. No artbook reading required. The only network discovery was public web search; no wiki crawl, login or failed-page retry. A mod author's [extraction guide](https://gall.dcinside.com/mgallery/board/view/?id=potionomics&no=118) provided an AES-key lead, and local archive validation established it works. Key and raw material remain in work-area scripts/private evidence, not gameplay.

## T3: Commands and helpers

Work root `W=~/.codex/research/fs-potionomics`; all scripts below live there. Paths in commands must be expanded by the shell; use quoted install paths with spaces.

1. `repak info <pak>` initially reported encryption. With `repak -a <key> info <pak>`, then `list`, the index opened. `notes/pak-list.txt` preserves all entry names. `notes/install-receipt.json` records SHA256 and size for the archive and shipping executable.
2. `python3 -I "$W/tools/extract.py"` selects Data, Blueprints, CCGToolkit card tables/Blueprints, Potionomics Blueprint/localization assets, all WBP widget packages, configs and English locres. `notes/selection.json` is an initial selection, not the final inventory. An additional `repak ... unpack <pak> -o "$W/extract/raw" -i Potionomics/Content/Potionomics/System/ -i Potionomics/Content/Potionomics/Gameplay/` adds system/save/gameplay helpers. Glob/directory includes avoid thousands of expensive exact include comparisons.
3. Build `DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build "$W/tools/AssetRead" -c Release --nologo`. The project references existing DLLs by absolute HintPath; dependencies were copied to its local output, and the existing reader's deps manifest reused. Source uses `EGame.GAME_UE4_27`. Shared source/build directories remain read-only.
4. Run `DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" "$W/tools/AssetRead/bin/Release/net10.0/AssetRead.dll" "$W/extract/raw" "$W/extract/json" > "$W/notes/parse.log" 2>&1`. Output keys include a `raw/` prefix because of provider root handling. `extract/json/receipts.json` records each package result. Final pass: 2,081 parsed, zero failures and zero logged parser warnings. Some interface functions contain only stub bytecode; export count is not logic coverage.
5. The same reader accepts an input `.locres` file and output JSON path: English input at `extract/raw/Potionomics/Content/Localization/Game/en/Game.locres`, output `extract/locres-en.json`. It produced 18,328 entries in 281 namespaces. `python3 -I "$W/tools/digest.py"` writes complete DataTables and joined dialogue records to the gitignored private folder, a table census, enum map, call-name index and `extract/HASHES.txt`. `flow.py` writes compact selected bytecode notes. `write_report.py` writes this lane's public analysis only. Review these local scripts before reuse.

## T4: Dead ends and corrections

- Unkeyed pak info/list failed on encryption. Did not treat its empty list file as inventory. Switched to a public mod-author lead and verified the key locally.
- First extraction supplied thousands of exact include patterns. It spent time matching without producing useful files. Stopped only that lane's own process and replaced it with a small set of directory/glob patterns; completed targeted extraction immediately.
- A parse was started before the first extraction finished and had no content. Discarded that empty result.
- Historical engine guidance suggested UE4.24. Its parser mode produced unknown-expression tokens and class-size warnings. Switched to UE4.27 on two sample packages first; the sample was clean, then regenerated all final JSON. No UE4.24 bytecode is treated as evidence. The build's engine version remains unresolved because serialized engine fields are stripped.
- `BP_SaveGame` was not a gameplay-save owner. Its defaults and settings functions led to the separate `Potionomics/System/SaveLoad` assets; these are the documented gameplay route.

## T5: Preserved evidence and limits

`extract/HASHES.txt` hashes raw assets, final JSON, localization and native ASCII-name extract. Archive/executable hashes live in `notes/install-receipt.json`; copies are in the private folder. Raw data stays out of tracked docs. Private holdings include full 720 table exports, 21,741 dialogue rows (examples/alternatives included), full English localization and decoded flow notes. Text joins use table ID/name plus key; unmatched records remain explicit rather than invented.

No runtime save format or engine behavior claim comes from export success. Native brewing fit/RNG/time reducers, full future customer state, file wire format and corruption handling remain unread. Never launch or inspect a user save to fill these gaps under this lane's authorization.
