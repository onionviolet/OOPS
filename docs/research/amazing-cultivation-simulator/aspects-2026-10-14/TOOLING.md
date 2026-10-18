# Recovery and rerun tooling

Lane: bf-amazing-cultivation-simulator. All raw data/code stays under `~/.codex/research/bf-amazing-cultivation-simulator/`. Repository writes are confined to this aspect folder. No installs, clones, downloads, game launch, Windows executable, Steam UI interaction, personal save/profile reads, git staging/commit/push or shared owner edits occurred.

## Input identity

Read `~/Library/Application Support/Steam/steamapps/appmanifest_955900.acf`, matching its name against Amazing Cultivation. App 955900, StateFlags 4, build/target 17074448, zero staging size, downloaded/staged counters complete. Depots 955901, 1446730 and 1701600 are present. Manifest metadata is not runtime evidence or an independent full depot hash check.

Install root: `~/Library/Application Support/Steam/steamapps/common/AmazingCultivationSimulator/`.

| Input | Bytes | SHA-256 |
| --- | ---: | --- |
| Amazing Cultivation Simulator_Data/Managed/Assembly-CSharp.dll | 7948800 | d225481851ee2c0111971eab98dadd00488aea4a2b0982226b38534cc3bb7902 |
| Amazing Cultivation Simulator_Data/Managed/Assembly-CSharp-firstpass.dll | 2471424 | c9763f9dc8779990ce52f87b355910e4a96a8c3cc6b65ca9367338e300b7f2ad |

Both match prior INTAKE.json exactly. Build has not changed. No further installation is needed for this static route; installing again would not solve encrypted-table reading.

## Tool and commands that worked

Reused `~/.dotnet/tools/ilspycmd` **11.1.0.9782** with `DOTNET_ROOT=$HOME/.dotnet`; decompiler reported the same version. Verified .NET SDK 10.0.402 and OpenSSL 4.0.3. No tool installation. Main export and targeted firstpass exit 0 with empty stderr. Main export has 3,179 C# files. Three selected firstpass classes were recovered: SevenZipHelper, GFileUtil and AES. The old 9.1 export of both complete assemblies is not reproduced or required here.

Run these only with a fresh empty output directory, using quoted paths:

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --version
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --disable-updatecheck -p -o "$HOME/.codex/research/bf-amazing-cultivation-simulator/extract/managed" -r "$HOME/Library/Application Support/Steam/steamapps/common/AmazingCultivationSimulator/Amazing Cultivation Simulator_Data/Managed" "$HOME/Library/Application Support/Steam/steamapps/common/AmazingCultivationSimulator/Amazing Cultivation Simulator_Data/Managed/Assembly-CSharp.dll"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --disable-updatecheck -t SevenZip.SevenZipHelper "$HOME/Library/Application Support/Steam/steamapps/common/AmazingCultivationSimulator/Amazing Cultivation Simulator_Data/Managed/Assembly-CSharp-firstpass.dll"
```

Actual logs: `notes/decompile.stdout`, `notes/decompile.stderr`, `notes/firstpass.stderr`. Targeted class output: `extract/SevenZipHelper.cs`. The game assemblies were data inputs to a native .NET inspection tool, never executed. Decompiled code was not compiled or run.

The private Python inventory used `python3 -I`, pathlib, hashlib and ElementTree only. `tools/inventory.py` copies no data; it scans copied inputs, writes directory/parse counts, inventory and hashes. The initial copy selected Settings/Scripts .xml/.lua/.txt plus Mods/Readme_EN.txt, excluding TeachFile saves. `tools/write_reports.py` and `tools/finish_reports.py` generate initial authored reports; `tools/finalize.py` applies the final decode findings and corrections. See `notes/installed-inventory.json`, `notes/content-inventory.json`, `extract/HASHES.txt`, SOURCE_READING.json and RECOVERY.json. No raw prose appears in repository reports.

## Dead ends and limits

The prompt's prior COVERAGE.md, INTAKE.md and TOOLING.md do not exist. Read COVERAGE.json and INTAKE.json instead; old TOOLING is embedded in the latter. Historical private extract links were not available and not reused.

A direct XML parse of the first RPG dialogue failed immediately. Switched to wrapper classification and recovered consumer inspection. The first attempt treated the MainManager helper reference to Scripts/luaio.o as the likely decoder route, but that loose file is absent and the helper's active use was not established. Further firstpass inspection found the actual fallback in GFileUtil.ReadTXT and Assets.USecurity.AES. Recovered those two types with `ilspycmd --disable-updatecheck -t GFileUtil` and `-t Assets.USecurity.AES` against the firstpass DLL, storing stdout as extract/GFileUtil.cs and extract/AES.cs. Listing firstpass classes with `-l c` identified the types. All three targeted type commands exited 0.

`tools/decode.py` reads constants from the recovered source privately, derives the AES key with Python hashlib PBKDF2-HMAC-SHA1 (1,000 iterations, 16 bytes), base64-decodes the wrapper body and passes bytes to installed OpenSSL `enc -d -aes-128-cbc -K ... -iv ... -nopad`. It removes trailing zero padding/BOM and writes only private copies under extract/decoded. No game assembly or Lua bytecode was executed. No key constants or source code were copied into repo reports. All 64 wrapped files decoded; decoded XML parsed without errors. Keep originals and decoded hashes. `notes/decoded-inventory.json` records every result. `notes/dialogue-structure.json` retains full IDs/conditions/links privately; decoded files retain the full writing privately. DIALOGUE_STRUCTURE.md contains only counts and paraphrase.

The first generic CSV count included the descriptive second header in each talk file. JianghuMgr's actual loader starts at row 3. The corrected structural count is 289 nonempty tagged physical data rows, not 297. Sparse DLC rows and runtime language/mod overrides are not normalized into an invented active count.

One other XML parse failure is the empty Settings/Behaviour/Human.xml. No game defect is inferred. Source filenames guessed as NpcJobMgr/BehaviourWork/DefsLoader at particular paths were absent; JobMgr/BehaviourBase and ModsMgr supplied the real inspected paths. This was corrected before reporting.

No web route was needed. No repos/commits or native REA/Ghidra route apply: this installed gameplay is managed Mono/.NET with readable Lua/data. Unity native/render internals and all vendor DLLs are outside the selected audit. Native play and actual screen composition remain unverified by instruction.
