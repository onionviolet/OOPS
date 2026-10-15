# Tooling and reproduction

Pins and sources: [SOURCE_LEDGER.md](SOURCE_LEDGER.md). Work root: `~/.codex/research/mw-kingdom-hearts/`. All tool code and raw data stay there. No YAIRPG production source was written; no game was run. Restore packages and build artifacts occupy user-local research/cache paths. No new SDK, runtime or global CLI tool was installed.

## Acquisition and inspection

SHOWN: shallow-cloned `https://github.com/OpenKH/OpenKh.git` into `repos/OpenKh`, HEAD `7a3b945c538d32c6a285128c98aefba093f52ceb`. Read the CLI/project/format/encryption/parser sources before execution. Initialized only XeEngine.Tools.Public at recorded gitlink `f55d4bd1fe4a9389ae9b01184e37f4ad30abca2e`. Full source/dictionaries/docs are retained for future reads. Public website and GitHub routes also opened successfully; no failed web fetch was retried.

The source requests SDK 8.0.416 with latestFeature; installed SDK is 10.0.402. Changed **private clone only** `global.json` to `{ "sdk": { "version": "8.0.416", "rollForward": "latestMajor" } }`. Did not change any game/YAIRPG files for tooling.

## Working build commands

Run from the private clone. `DOTNET_ROOT` points to the existing installation. The final builds ran sequentially.

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build OpenKh.Command.IdxImg/OpenKh.Command.IdxImg.csproj -c Release -p:NuGetAudit=false -m:1 -o "$HOME/.codex/research/mw-kingdom-hearts/tools/idximg"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build OpenKh.Command.SpawnScript/OpenKh.Command.SpawnScript.csproj -c Release -p:NuGetAudit=false -m:1 -o "$HOME/.codex/research/mw-kingdom-hearts/tools/spawn"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" build OpenKh.Command.MsgTool/OpenKh.Command.MsgTool.csproj -c Release -p:NuGetAudit=false -m:1 -o "$HOME/.codex/research/mw-kingdom-hearts/tools/msg"
```

All three completed with zero errors. IdxImg final build reported 36 warnings; SpawnScript and MsgTool reported 23 each, including upstream Windows-only drawing APIs and rethrow warnings. Those image paths were not invoked. IdxImg's dependency build also produced Bdxio and its runtimeconfig; no separate Bdxio install needed. `NuGetAudit=false` avoids advisory-network work for this isolated build, not a claim that third-party dependencies were security audited.

## Read-only payload route

The saved scripts under `tools/` make this reproducible with the same installed build:

| Code | Command / operation | Result and boundary |
|---|---|---|
| T1 | `python3 -I tools/index_hed.py` using absolute work-area script path | 49,835 KH1/KH2 HED records indexed; 41,683 filename matches in this bounded lookup dictionary. Unknown-name hashes remain records, not nonexistent files. End-of-pass HED hashes saved. |
| T2 | `python3 -I tools/extract_selected.py` | 917 original payloads, 306,026,752 bytes. It reads PKGs with `rb`, applies the pinned documented header/decryption/decompression algorithm and checks each original length. It does not emit HD remaster assets. |
| T3 | `python3 -I tools/inspect_tables.py` | BAR inventory; native main-table splits; full members/levels/worldpoints/talk references. Pointer candidates are explicitly speculative where header extent is unknown. |
| T4 | From `tools/reader/`: `DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" run -- "$HOME/.codex/research/mw-kingdom-hearts"` | C# driver built against upstream DLLs. 749 room scripts, 951 event records/171,811 event commands, 22 message lists/16,258 entries; one non-MSG fontinfo rejection. Upstream Memt/Lvup count checks and three EgsHdAsset byte equality checks passed. Native game never invoked. |
| T5 | `python3 -I tools/deeper.py` | 303 mission headers, 239 KH1 resource lists, private local text locator records, selected exact progress flags. Original mission entries have BAR type 2 in this build; doc prose calling them binary was not used as a type assertion. |
| T6 | `python3 -I tools/decode_bdx.py` | 339 BDX entries decoded successfully by built Bdxio, with per-entry provenance/log/status. Reads LM musical and tutorial methods; other bodies retained for later audit. |
| T7 | Direct Bdxio invocation used by T6 | `DOTNET_ROLL_FORWARD=Major DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/dotnet" <work>/tools/idximg/OpenKh.Command.Bdxio.dll decode <private-bdx> <private-bdscript>` |
| T8 | Existing-root ignore check | `git check-ignore docs/research/kingdom-hearts/private/reference.txt` confirms existing private rule. No root ignore file changed. |

The helper project targets installed net10.0 and references built net8.0 libraries. `DOTNET_ROLL_FORWARD=Major` is set for the original net8 CLI executables, not a game configuration change. The C# driver generates only private text/tables and opens installed package files with File.OpenRead.

## Dead ends and corrections

| Code | Attempt | Outcome / resolution |
|---|---|---|
| E1 | First HdAssets build with unmodified SDK pin | SDK-not-found, exit 155. Allowed SDK major roll-forward in private clone. |
| E2 | Build override `-p:TargetFrameworks=net8.0` | NETSDK1005 for Xe's netstandard2.0 target. Removed override. Two initial builds overlapped and produced one PDB copy retry; final builds were sequential. No source/runtime conclusion came from a failed build. |
| E3 | `IdxImg hed list <kh2_first.hed>` | Exit 0 but no output. Inspected `EgsTools.cs:632-644`: Console.WriteLine is commented out upstream. Used explicit HED index script instead. Empty output did not mean empty archive. |
| E4 | All message BARs passed to Msg reader | `msg/us/fontinfo.bar` is not a message list and was rejected. Kept one explicit error record; no dropped dialogue silently reported as decoded. |
| E5 | Expected libretto header 3 from docs | Native header is 2; parser/prose terminator grammar differs. Saved raw and explicit pointer decode, marked semantics partial. |
| E6 | Count every worldpoint slot as a destination | 512 slots contain only 54 populated records. Count padding separately. |
| E7 | Prompt's nested-world owner path | Actual file under `docs/gm/dispatch/`; read that owner and documented resolution. |
| E8 | First mission-header scan expected BAR type 1 | Zero matches was a scan assumption error. Native archive inventory shows type 2; corrected the parser and obtained 303 headers. |

Original extraction and command dumps are private, not committed. Read [checkpoint](CHECKPOINT.md) for exact remaining questions, and `private/REFERENCE_INDEX.md` for every capture family. No binary RE/native decompiler was needed for the resolved questions; OpenKH documented formats supplied them.
