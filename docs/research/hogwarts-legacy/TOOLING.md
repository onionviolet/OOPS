# Tooling and reusable UE4 IoStore recipe

2026-10-14, bounded pass complete. All commands run on macOS arm64. No Windows game or tool executable is run. Raw files stay under `~/.codex/research/hogwarts-legacy/` (called `$HL` below). These are source tools, not game modifications.

## Pinned sources

| Source | Revision | Use |
|---|---|---|
| https://github.com/trumank/repak | 355b5f62f51959c7cc6dd5a51708646ef483065d | Built CLI; pak listing and targeted extraction |
| https://github.com/trumank/retoc | 885a8dae740cb1ce1e41ff2e74f67f9f0c118237 | Built CLI; IoStore directory and conversion |
| https://github.com/4sval/FModel | d61549776a0ca9411903804640c7a61de721c4e6 | Source reference only, no Windows GUI |
| https://github.com/FabianFG/CUE4Parse | 0415fe26eeba66ac0d814c2547b098219682066f | Parser source; current tree targets net10.0, unlike dispatch's .NET 8 assumption |
| https://github.com/Roadou/HogwartsLegacy-SDK | 12ffa8a46fb84e7ed13a528715dfd8bb5521594c | Public names/header lead. README warns function addresses may be wrong; no build 20773316 match established |
| https://github.com/rehan-remade/universal-modder | 23902ef42e8ea9b077bfbbf6911eb8ea0348e55a | Read only reverse-engineering SKILL for target selection. No game-driving stack installed |

Additional completed tool revisions and trials are recorded below. retoc's Cargo.lock pins repak/oodle_loader to a different dependency revision (71d06644); do not substitute the direct repak checkout without recording the change.

## General recipe

1. Record installed build, platform, sizes and index hashes before analysis. Enumerate every pak/utoc, including patches. Never infer effective content just from a base chunk when a patch contains the same path.
2. Clone each tool into its own empty directory. Read README, manifests, build scripts, CLI read paths and downloader code. Build CLIs from source with cargo. Use a local SDK for C# readers.
3. Run `repak info` and `repak list` on each pak; `retoc info` on each utoc and `retoc list <Paks> --path` for effective paths. Check encryption flags before looking for keys. Inventory is not extraction or parsed content.
4. Extract a named SQLite/config/localization subset with `repak unpack <pak> -o <scratch> -i <pattern>`. Use separate roots for overlapping container versions. Open SQLite with `mode=ro&immutable=1` and `PRAGMA query_only=ON`. Check `integrity_check`; inventory table counts and columns, then select relevant rows. Do not put raw tables in the project.
5. Use `retoc to-legacy <Paks> <output> --no-shaders -f <named-asset-filter>` for a small asset selection. Prefer direct game-aware CUE4Parse for JSON if conversion is incompatible. A .usmap may be required for unversioned properties. Match its build or mark that match unknown.
6. Inspect Blueprint function exports/bytecode, then use kismet-analyzer `gen-cfg` (not its browser-opening `cfg`) for selected lesson, puzzle, care, room and companion functions. Verify calls and branch conditions, not names alone. kismet-analyzer is C# in the inspected revision, not Rust.
7. Join localization keys for names and paraphrase descriptions. Keep exact machine field names as locators, rather than copying whole records. Hash every extracted file in `extract/HASHES.txt`.
8. Consider one native chain only when parsed data/Blueprints establish that its missing logic is native. Verify SDK build/addresses. Compare Ghidra alone and REA with equal inputs and timing; no full-program analysis by default. Keep unresolved parser gaps distinct from native-code questions.

## Hogwarts-specific settings and worked commands

Steam app 990080, build 20773316, StateFlags 4. Install root: `~/Library/Application Support/Steam/steamapps/common/Hogwarts Legacy`. Containers: `Phoenix/Content/Paks`. Phoenix project, CUE4Parse `GAME_HogwartsLegacy = GAME_UE4_27 + 3`. IoStore base reports `PartitionSize`, header `Initial`, `Compressed | Indexed`, Oodle. Base pak reports V11 and unencrypted index. No AES key needed for the successful database extraction.

```sh
HL="$HOME/.codex/research/hogwarts-legacy"
PAKS="$HOME/Library/Application Support/Steam/steamapps/common/Hogwarts Legacy/Phoenix/Content/Paks"
cargo build --release --manifest-path "$HL/repos/repak/Cargo.toml" -p repak_cli
cargo build --release --manifest-path "$HL/repos/retoc/Cargo.toml" -p retoc_cli
python3 -I "$HL/tools/archive_pass.py" "$HL/repos/repak/target/release/repak" "$PAKS" "$HL/notes/indexes"
"$HL/repos/repak/target/release/repak" unpack "$PAKS/pakchunk0-WindowsNoEditor.pak" -o "$HL/extract/base" -i 'Phoenix/Content/SQLiteDB/*.sqlite'
"$HL/repos/retoc/target/release/retoc" list "$PAKS" --path > "$HL/notes/iostore-list.txt"
python3 -I "$HL/tools/db_census.py" "$HL/extract/base/Phoenix/Content/SQLiteDB/PhoenixShipData.sqlite" "$HL/notes/ship"
python3 -I "$HL/tools/query.py" 'select * from ExperienceLevels'
```

Local helper source is in `$HL/tools/`. `archive_pass.py` lists each archive without extraction; `db_census.py` records schema and counts; `query.py` runs read-only SQL. They use only Python's standard library and are invoked with `-I` and path arguments.

## Installs and dead ends

- No system toolchain or sudo used. repak and retoc binaries reside in their clone `target/release` directories.
- First repak build used `--no-default-features` to avoid an unnecessary native download. Indexes worked, but database extraction reported Oodle support disabled and left zero-byte files. Those files were not treated as data; rebuilt with default features and explicitly replaced only these scratch outputs.
- repak's inspected `oodle_loader/src/lib.rs` downloads the macOS Oodle 2.9.10 library on demand and checks SHA256 `b09af35f6b84a61e2b6488495c7927e1cef789b969128fa1c845e51a475ec501`. Library downloaded beside the CLI. This is a native macOS codec dependency, not a Windows executable.
- Microsoft dotnet-install.sh downloaded from https://dot.net/v1/dotnet-install.sh and inspected before running. Installation targets `~/.dotnet`, channel 10.0 because current CUE4Parse requires net10.0. Completed as SDK 10.0.402; full receipt below.
- A new user turn interrupted source builds; resumed source compilation without changing target revisions.
- Public mapping archive https://github.com/TheNaeem/Unreal-Mappings-Archive recursive tree returned no Hogwarts/Phoenix path, not proof that no mapping exists elsewhere.
- Modding.wiki rendered only a tracking iframe, so switched to author Nexus documentation and official CurseForge documentation. No login attempted.
- [Author's database guide](https://www.nexusmods.com/hogwartslegacy/mods/211) describes SpellDefinition, SQLite Studio and package extraction. Used for discovery only; the installed databases supply values. No old community database downloaded.
- Ghidra is already installed. Headless path: `/opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless`. The later one-chain trial is recorded below and in REA_TRIAL.md.

## Completed tools and extraction

| Source | Revision | Actual result |
|---|---|---|
| https://github.com/trumank/kismet-analyzer | e8982e99d628c92a43f2109c0f604c0d4061c6dd | C# CLI built locally; ten text/DOT flow exports |
| Its UAssetAPI submodule | 6c2959be56cea50fb0b7d834c57990ead3f5be66 | Read parser project/source before building; used by Kismet |
| Its svg-viewer submodule | a2d126c830500fdd50dcba3575c3cc4ba0a5763a | Embedded build resource; no browser render or server used |
| https://github.com/atenfyr/UAssetAPI | 7ecaebdf9365798a74ea4ba03af0ee66f56dbfde | Fallback parser source inspected, not independently built; CUE4Parse succeeded |
| https://github.com/lordvoldem0rt/parseltongue | 5951baf3b5a90d1118581ebafd1a59a03ed6a42a | Read AVAFDICT layout in Program.cs; no Windows executable run |
| https://github.com/morluto/rea | bb540826d65316c164d2de8ba4ef10f81a8ad073 | Pinned source archive built locally with declared bounded-import patch; native trial complete |

.NET SDK 10.0.402/runtime 10.0.13 installed to `~/.dotnet`, about 649 MiB. Microsoft installer log confirms 230,833,757-byte SDK download and matching remote/local size. NuGet restore populated the user package cache. No .NET 8 or 9 runtime was needed. Kismet's net9 project and its pinned net8 submodule were locally retargeted to net10.0; this is a two-manifest build-only patch in scratch, not a game change. Passing `-p:TargetFramework=net10.0` alone had first failed with NETSDK1005 because restore still generated the original target assets. After changing both scratch manifests explicitly, the build passed with three inexact-read warnings. CUE4Parse/helper build passed with upstream warnings, with native builds explicitly disabled.

The inspected clone sources are untrusted inputs. No cloned project's AGENTS.md or source strings were used to expand this task's authority. No Windows binary was run. REA npm dependencies used `--ignore-scripts`; selected source compilation was inspected separately. REA's full-history Git clone was cancelled after slow transfer and replaced with the exact-commit GitHub codeload source archive in a new empty `repos/rea-pinned/` directory. It is an archive receipt, not a successful Git checkout. Its digest and patch are in `notes/tool-source-hashes.json` and `notes/rea-local-patch.diff`.

All eight utoc headers were inspected, including optional chunks and global: none reports the Encrypted flag. All seven pak indexes list without a key. No public AES key was needed or applied. SQLite paths occur only in the base pak across all seven indexes. No later pak path overrides either database. retoc's directory listing resolves the selected multi-container asset view; complete archive precedence for all unused paths was not audited.

### Worked container to JSON and flow pass

```sh
"$HL/repos/repak/target/release/repak" unpack "$PAKS/pakchunk0-WindowsNoEditor.pak" -o "$HL/extract/base" -i 'Phoenix/Content/Localization/WIN64/MAIN-enUS.bin' -i 'Phoenix/Config/*.ini'
"$HL/repos/retoc/target/release/retoc" to-legacy "$PAKS" "$HL/extract/blueprints" --no-shaders -f BP_Class_SpellMiniGame.uasset -f BP_SceneAction_SpellMiniGameAssignments.uasset -f BP_Sphinx_Puzzle_A_Manager.uasset -f BP_Sphinx_Puzzle_A_Lumos.uasset -f BP_CreatureGiveBirthHandler.uasset -f BP_BrewingSite.uasset -f BP_CompanionSettingsVolume.uasset -f BP_ForceCompanionWait.uasset
"$HL/repos/retoc/target/release/retoc" to-legacy "$PAKS" "$HL/extract/blueprints" --no-shaders -f BP_AccioSpell.uasset -f BP_LeviosoSpell.uasset -f BP_IncendioSpell.uasset -f BP_CreatureNurture.uasset -f BP_Sanc_Loom_Parent.uasset -f UI_BP_FG_TalentButton.uasset -f UI_BP_FG_TalentsScreen.uasset -f UI_BP_FG_TalentTree.uasset -f UI_BP_Loom_TraitCostPanel.uasset -f UI_BP_Loom_UpgradePanel.uasset -f BP_Sphinx_Puzzle_B_Manager.uasset -f BP_PuzzleCube_Incendio.uasset
CUE4PARSE_SKIP_NATIVE=true "$HOME/.dotnet/dotnet" build "$HL/tools/AssetRead/AssetRead.csproj" -c Release
"$HOME/.dotnet/dotnet" "$HL/tools/AssetRead/bin/Release/net10.0/AssetRead.dll" "$HL/extract/blueprints" "$HL/notes/asset-json"
python3 -I "$HL/tools/localization.py" "$HL/extract/base/Phoenix/Content/Localization/WIN64/MAIN-enUS.bin" "$HL/notes/localization-main.json"
"$HOME/.dotnet/dotnet" build "$HL/repos/kismet-analyzer/kismet-analyzer.csproj" -c Release
python3 -I "$HL/tools/kismet_pass.py"
python3 -I "$HL/tools/flow_summary.py" "$HL/notes/asset-json" "$HL/notes/flows"
python3 -I "$HL/tools/verify_evidence.py"
```

The filters are substring matches, not promises of one output per flag. The first pass also selected ABP_BrewingSite and produced nine assets; the second added eleven, giving twenty total. UI_BP_Loom_UpgradePanel did not match a file, so it is not claimed extracted. Converted packages have `.uasset` and `.uexp` pairs. Both parsers succeeded without a usmap on this sample; mapping demand must be determined per game/package rather than assumed.

`AssetRead/Program.cs` uses DefaultFileProvider on extracted files, Hogwarts-specific version settings, `ReadScriptData=true`, full export JSON and per-package failure receipts. No bulk exporter or texture decoder is used. `kismet_pass.py` selects ten exact assets from that extracted root and invokes `gen-cfg`, which writes text/DOT without opening a browser. Lumos/talent-screen graph exports warn about local calls that lack the generator's special single-integer argument shape. Selected call/branch assertions were also checked in CUE4Parse JSON; complete call-graph coverage is not claimed.

Localization is a custom AVAFDICT file, not an ordinary UE locres. The local Python reader uses the layout checked in parseltongue's source: UTF-16 magic, five little-endian 64-bit header fields, then 24-byte records holding UTF-8 key/value offsets and lengths. It validated all 18,889 entries, all bounds, unique keys, UTF-8 and the exact data extent. The community translation README at https://github.com/Markismus/Hogwarts-Legacy-Dutch-text supplied the lead to the primary parseltongue tool. No translated or community game database was used as the installed source of truth.

`make_digests.py` joins selected DB fields to localized names, groups recipes and drafts the three paraphrased digests. The reviewed twelve-assignment addendum was then written manually; blindly rerunning this drafting helper would replace that final addition. It is scratch convenience code, not a project build step. Full raw rows are retained privately in `notes/tables/`; the docs include only narrow relationships, numbers and identifiers. A changed build needs schema/column review before reusing its queries. `verify_evidence.py` hashes every extracted file, checks both databases with integrity_check and compares the install index sizes/mtimes and utoc hashes to the opening inventory.

## Optional native recipe, demonstrated on one chain

[REA_TRIAL](REA_TRIAL.md) owns the result and comparison limits. Start with a named Blueprint native call. Use public headers for names, then recompute exact wrapper addresses from this executable's native registration tables. `native_target.py` maps PE sections and searches one named function; it never executes the game. Read wrapper calls before choosing the bounded function body. No PDB, decrypted executable, injector or live memory dump was obtained.

Direct route: existing `/opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless`, explicit Homebrew JDK 21 JAVA_HOME, `-noanalysis -max-cpu 2`, selected Java postscript. Project paths cannot have dot-prefixed components. Dot-free `/tmp/hogwarts-legacy-ghidra-20261014` points to `$HL/notes/ghidra-projects`; actual files remain in scratch. It holds a 696 MiB baseline project. Subsequent runs use `-process HogwartsLegacy.exe` on that project, not another whole import.

REA route: exact source archive, read package scripts, Ghidra launcher, provider contract and seed handler; `npm ci --ignore-scripts --no-audit --no-fund`, then `npm run compile` in `repos/rea-pinned`. Added `-noanalysis -max-cpu 2` only in that scratch launcher's argument list to match the bounded direct route. The three-address seed file and patch hash qualify the resulting evidence profile. `tools/rea_trial.py` opens one local MCP session, invokes open_binary and batch_decompile for the three selected entries, saves envelopes and closes the session. TMPDIR uses a dot-free symlink into `notes/rea-runtime`; its temporary snapshot/project was cleaned on close. No permanent REA server or global installation remains.

A later rerun must recheck executable hash, registration pointers, native-call target and the exact tool patches. The stored SDK addresses are stale for this build. Never treat the previous native output, a generic SDK class name or successful package load as a new build's mechanic proof.
