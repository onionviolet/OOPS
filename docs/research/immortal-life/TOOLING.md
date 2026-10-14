# Tooling and mechanical rerun

2026-10-14. Private root: `/Users/weiwei/.codex/research/immortal-life/`. Read-only game payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/ImmortalLife/`. Windows game files were parsed as data; no Windows executable or game DLL was executed.

## Tools and installs

- Cloned https://github.com/Perfare/Il2CppDumper into `repos/Il2CppDumper`, revision `4741d46ba9cd6159c5d853eb9d6fc48b4bfa2b1a` (MIT). Reviewed project file, Program.cs argument/file handling and README before building/running. Official source describes restored declarations without original code: https://github.com/Perfare/Il2CppDumper#outputs.
- Built managed CLI from source with existing `~/.dotnet/dotnet`, target override `net10.0`, output `tools/dumper`. NuGet restored Mono.Cecil 0.11.4. Build succeeded, zero errors and three CA2022 warnings in NSO.cs. No global dotnet install.
- Created user-local `tools/venv` with Python 3.15 and installed UnityPy 1.25.4 plus its dependencies there. Dependency receipt: `notes/pip.log`; pinned freeze: `notes/pip-freeze.txt`. No change to shared research venv. UnityPy reads serialized assets; it was not used to write them.
- Existing shared research venv lacked UnityPy. That read-only probe failed once; switched to the lane-local venv.
- Disabled RequireAnyKey only in generated CLI output config. Source checkout otherwise unchanged. Source build overrides existing net6/net8 targets to use the installed net10 runtime.

## Commands that worked

Run with explicit private paths, process-local DOTNET_ROOT. Use a fresh extract destination for a new build. The source-built .NET CLI is the program being run, not ImmortalLife.exe or GameAssembly.dll.

```sh
git clone --depth 1 https://github.com/Perfare/Il2CppDumper.git "$HOME/.codex/research/immortal-life/repos/Il2CppDumper"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build "$HOME/.codex/research/immortal-life/repos/Il2CppDumper/Il2CppDumper/Il2CppDumper.csproj" -c Release -p:TargetFrameworks=net10.0 -o "$HOME/.codex/research/immortal-life/tools/dumper"
python3 -m venv "$HOME/.codex/research/immortal-life/tools/venv"
"$HOME/.codex/research/immortal-life/tools/venv/bin/pip" install UnityPy==1.25.4
```

Set `tools/dumper/config.json` RequireAnyKey to false. Create `extract/types` before passing it; the CLI recognizes existing output directories.

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" "$HOME/.codex/research/immortal-life/tools/dumper/Il2CppDumper.dll" "/Users/weiwei/Library/Application Support/Steam/steamapps/common/ImmortalLife/GameAssembly.dll" "/Users/weiwei/Library/Application Support/Steam/steamapps/common/ImmortalLife/ImmortalLife_Data/il2cpp_data/Metadata/global-metadata.dat" "$HOME/.codex/research/immortal-life/extract/types"
"$HOME/.codex/research/immortal-life/tools/venv/bin/python" -I "$HOME/.codex/research/immortal-life/tools/extract.py" "/Users/weiwei/Library/Application Support/Steam/steamapps/common/ImmortalLife/ImmortalLife_Data" "$HOME/.codex/research/immortal-life/extract/text"
python3 -I "$HOME/.codex/research/immortal-life/tools/read_tables.py"
python3 -I "$HOME/.codex/research/immortal-life/tools/selected.py"
```

Dumper logged metadata 24.2, automatically adjusted binary parser to 24.3, found registration tables and completed dump/struct/dummy-DLL output. Private outputs include dump.cs, script.json, stringliteral.json, il2cpp.h and DummyDll. Their method declarations contain empty bodies. No ILSpy body claims or Ghidra/native disassembly attempted, consistent with the IL2CPP type-names-then-data-only lane route.

UnityPy iterated top-level `.assets`, counting object types and exporting only TextAsset content. Four asset files read; 296 TextAssets from resources.assets. Existing game resource streams, textures, audio and save paths were not exported. File hashes: `extract/INPUT_MANIFEST.json` for selected originals; `extract/HASHES.txt` for all private extract outputs. COVERAGE.json pins selected table hashes/path IDs in the repo.

## Dead ends and limits

- Direct web open of wiki.gg Breakthrough returned 403. Switched to local payload and primary Steam page. Search-index excerpts were subsequently available, clearly retained as wiki-stated comparison evidence, not a successful direct page fetch. No retries against wiki.gg endpoints or login attempts. No wiki crawl performed.
- Initial all-JSON dictionary comprehension stopped on Decorate's extra data. Replaced with per-asset exception recording. 291 parsed; five remain non-JSON or parse gaps: SensitiveWords, crane action text, two line-breaking tables, Decorate. No “repair” of proprietary data.
- `pip show UnityPy | head` printed package/version then a harmless broken stdout pipe. Install/extraction had already succeeded. Final version verification uses import without a pipe.
- No missing Mono assembly was guessed or fabricated. IL2CPP declarations and data cannot prove runtime code order, RNG, exact rates, active tables or save atomicity.

## Scope receipt

Only `docs/research/immortal-life/` was written in the repo. Private tooling/notes/extracts reside under the lane root. Dirty unrelated paths were present before work and preserved. No source, build, shared owner, index, Steam setting, manifest, bottle or save edited. No game launch, injection, purchase, commit, stage or push.
