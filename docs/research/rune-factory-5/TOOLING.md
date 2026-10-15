# Static tooling and rerun

## Locations and versions

- Work root: `~/.codex/research/fs-rune-factory-5/`, with `repos/`, `tools/`, `extract/`, `notes/`.
- Owned install: `~/Library/Application Support/Steam/steamapps/common/Rune Factory 5/`. Only static reads. Never executed the EXE, launcher or DLL; no save directories accessed.
- Source: `https://github.com/Perfare/Il2CppDumper`, commit `4741d46ba9cd6159c5d853eb9d6fc48b4bfa2b1a`. Inspected project file, Program, PE parsing, PELoader route references and output writer before execution. Built source rather than downloading a Windows tool.
- Local .NET SDK: `~/.dotnet/dotnet`, 10.0.402. Build target override `net10.0`, since the source project declares net6.0/net8.0. Build finished with zero errors, three CA2022 warnings in unused NSO parsing. The .NET program ran on macOS; no Windows PE was loaded for execution.
- User-local install: Python venv `tools/venv`; UnityPy 1.25.4 and its dependencies installed with pip into that venv. Exact package freeze saved in private `pip-freeze.txt`. No sudo, global package changes or AssetRipper/Cpp2IL build.

## Commands that ran

From the main checkout, all writes were restricted to the lane output directory and work root. The following are the successful command forms; paths use the user's home directory.

```sh
git clone https://github.com/Perfare/Il2CppDumper.git "$HOME/.codex/research/fs-rune-factory-5/repos/Il2CppDumper"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build "$HOME/.codex/research/fs-rune-factory-5/repos/Il2CppDumper/Il2CppDumper/Il2CppDumper.csproj" -p:TargetFrameworks=net10.0 -c Release -o "$HOME/.codex/research/fs-rune-factory-5/tools/dumper"
python3 -m venv "$HOME/.codex/research/fs-rune-factory-5/tools/venv"
"$HOME/.codex/research/fs-rune-factory-5/tools/venv/bin/python" -I -m pip install UnityPy
```

Changed only the work-area output `tools/dumper/config.json` to `RequireAnyKey=false` before running. The supplied third argument output directory already existed.

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" "$HOME/.codex/research/fs-rune-factory-5/tools/dumper/Il2CppDumper.dll" "$HOME/Library/Application Support/Steam/steamapps/common/Rune Factory 5/GameAssembly.dll" "$HOME/Library/Application Support/Steam/steamapps/common/Rune Factory 5/Rune Factory 5_Data/il2cpp_data/Metadata/global-metadata.dat" "$HOME/.codex/research/fs-rune-factory-5/extract"
```

Dumper log: `notes/dumper.log`. Metadata and IL2CPP version: 24.4. Code registration `0x182a37690`, metadata registration `0x182a382e0`. `dump.cs` contains declarations and addresses, with empty method stubs. Generated dummy DLLs are metadata scaffolding and were not mistaken for recovered logic.

## Reader scripts

All scripts are in work-area `tools/`, with copies under the private reference store for recovery. Python scripts ran with `-I`.

| Script | Result |
|---|---|
| `catalog.py` | Decodes catalog key/bucket/entry arrays and internal path prefixes into 94,614 entries. Stores bundle dependency joins in `extract/catalog-decoded.json`. Bundle matches were checked by reading the expected named objects. |
| `split_metadata.py` | Inventories 12,898 types and splits 4,892 definitions in the selected game TypeDef range into `extract/classes/`. The range is a working convenience, not a precise assembly boundary. |
| `read_assets.py` | UnityPy reads `382aa2501e16ef256258fc102a8fcea5.bundle`: 462 objects, 280 MonoBehaviour tables, 181 MonoScripts, one bundle object. Zero type-tree errors. |
| `inspect_tables.py` | Adds named copies of full master tables and a short work-area summary. |
| `read_resources.py` | Inventories `resources.assets`; only two TextAssets were font line-break metadata. Dialogue was instead found through the addressable catalog. |
| `read_selected.py` | Reads English pack/master and two schedule sample bundles, with full master text and index extraction. Raw pack bytes were re-encoded using surrogateescape to preserve binary bytes. |
| `make_evidence.py` | Saves all named tables privately; creates 39 skill joins, 411 named action joins and 1,174 material-destination joins. Category placeholders remain unexpanded in material joins. |

Read bundle hashes and extract hashes in private `HASHES.txt`; canonical work-area copy `extract/HASHES.txt`. The full binary English event pack remains in the work area, indexed by the private README. Native code and dummy assemblies remain outside the repository.

## Limits and dead ends

Dumper and UnityPy succeeded. No fetch failure occurred, no fallback build was needed and no game was launched. The `resources.assets` text route was insufficient for dialogue; the catalog led directly to the English event pack. The pack is binary, not plain text. `ScriptWork`/`AdvMain` readers and exact save format are not reconstructed. Searching a literal wildcard path once returned no file; later reads used exact class paths. No claims rest on that failed search.

No web mechanic guide was needed: all substantive donor claims use the local installed build and recovered schema/tables. Tool repository URL identifies provenance, not evidence that any game mechanic executes.

Artifact validation passed: see `VALIDATION.json`. All required files, 12 aspect keys, five feature answers, six proposals, 26 touches, JSON parsing, private ignore rule, local links and private corpus hashes checked. The 22,952,998-byte saved English pack exactly matches its raw TextAsset payload. This is artifact/static evidence only.
