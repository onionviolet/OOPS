# D2 second native trial: Immortal Life breakthrough

2026-10-14. **Result: useful structured interface, no demonstrated decompiler or speed advantage.** Both routes recover the same selected breakthrough entry, wave-clear and advancement operations. This is a static result, not a played trial.

## Inputs and controls

Named question: which table selects a breakthrough, what is paid, and how does success advance the actor? The prior lane's data-only pass could not answer it.

| Input | Exact value |
|---|---|
| Payload | Steam1201230, prior build receipt17861603; current DLL and metadata hashes match prior originals |
| DLL | GameAssembly.dll, 43,336,704 bytes, x86-64 PE, base0x180000000 |
| DLL SHA256 | 82294aa03035a9d2179ee87a2d5cc96f3b9fb0ff2930a64efd7986161b457f4a |
| Metadata SHA256 | 14796dd88489966bd958bad12d22115470feb84941b7e62aaeae5283bfbc9e44 |
| Name/address source | Prior source-built Perfare/Il2CppDumper4741d46ba9cd6159c5d853eb9d6fc48b4bfa2b1a, metadata24.2/binary24.3 |
| Decompiler | Ghidra12.1.4, existing Homebrew OpenJDK21.0.12.1, explicit JAVA_HOME |
| REA | 6.4.0, morluto/rea bb540826d65316c164d2de8ba4ef10f81a8ad073, existing pinned archive build |
| Local REA patch | Prior lane's launcher adds -noanalysis -max-cpu2; reused read-only |
| Selection | Same24 exact entry addresses in private notes/seeds.tsv; no automatic whole-image analysis |

The 24-entry chain includes panel admission/entry, battle initialization and wave progression, result handling, LevelAdd and PlayerData promotion/reset. The one-address IL2CPP thunks lead to larger native state-machine bodies. Both decompilers follow these flows; reported function body size is not full control-flow coverage.

## Measured result

macOS `/usr/bin/time -l`, single observations. RAM is maximum resident set size in bytes. Runs overlapped in part and other research lanes were active. Do not interpret a small timing difference as a repeatable speed result.

| Route | Work | Wall time | Maximum RSS | Effort and retained disk |
|---|---|---:|---:|---|
| Direct Ghidra | Cold PE import, no auto-analysis; SelectedChain.java disassembles and decompiles24 entries | 17.59s | 1,256,095,744 | One adapted Java script and one successful headless invocation; project about145MiB |
| REA over Ghidra | open_binary then three batch_decompile requests of8 entries in one MCP session | 18.91s whole client;17.65s request interval | 1,238,614,016 | Adapted Python stdio client,24 seed rows, structured results; temporary project cleaned at close |

Both recovered the stamina subtraction through Level.BreakPPSpend, Level.SceneID selection, configured wave progression, SuccessSet calling LevelAdd and PlayerData level increment/stat changes/selection clearing. Direct output has24 function records, zero NO_FUNCTION and zero FAIL. REA returns24 ok items and zero failed. This is not byte-for-byte pseudocode equality or whole-call-graph equivalence.

REA also applies its provider preparation and no-return repair script. The observed first trial's control-flow operations agree with the direct script, but internal database setup is not identical. Its profile calls the analyzer preset ghidra-default even though the local launcher disables automatic analysis. Preserve the patch receipt with any later comparison.

## Value and limits

**D2a:** REA binds each response to the DLL digest and records item status and provider settings. It saves custom response-envelope work for an agent doing repeated native queries.

**D2b:** it uses the same Ghidra decompiler. Dumper metadata still supplies IL2CPP field offsets, method identities and generic context. A shared generic native address can name many managed methods; this pass resolves the relevant method token instead of choosing the first name. No new decompilation capability was demonstrated.

**D2c:** supplementary NPC/defeat reads are outside this comparison. One later query took109.03s of request time under changing machine load. An earlier supplementary seed list contained duplicate addresses and returned target_unavailable for all items; a narrowed distinct-entry list succeeded. The root cause was not isolated. A final optional trigger-dispatch import returned no decompile result by its startup window and spawned a replacement import; stopped without claiming either requested method. These are workflow limits, not additional benchmark samples. The source build/install cost is inherited from the prior Hogwarts pass and excluded here; no new install occurred.

Private reproducibility root: `~/.codex/research/immortal-life-2/`.

- `tools/rea_trial_original.py`: copied prior client, unchanged; `tools/rea_run.py`: adapted for this game.
- `tools/ghidra/SelectedChain.java`, `notes/seeds.tsv`, `notes/selected.json`: direct and REA selection.
- `notes/direct-trial.log`, `notes/direct-chain.txt`, `notes/rea-trial.log`, `notes/rea-timing.json`, `notes/rea-batch-{0,8,16}.json`: measured results.
- `extract/INPUT_HASHES.json`, `extract/HASHES.txt`: build matching and extract integrity.
- Prior patch: `~/.codex/research/hogwarts-legacy/notes/rea-local-patch.diff`.

Proposed shared-owner update: retain metadata/data first for Unity IL2CPP; use REA as an optional structured native-query interface after a concrete gap appears. This second chain supports convenience, not replacing direct Ghidra or specialized IL2CPP maps. The shared tool-fit document was not edited.
