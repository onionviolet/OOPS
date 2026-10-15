# Tools, pins and repeatable route

Lane `ds-siralim-ultimate`, 2026-10-14 wave, resumption/final checks 2026-10-15. Static reads only. No network fetch, login, install, game launch, Windows execution, user-save read, build, browser or source edit. No git stage/commit/push. Only this output folder was written in the repo.

## Inputs and private outputs

| Item | Pin / location |
|---|---|
| Prior raw tables, symbols and native bodies | `~/.codex/research/mw-siralim/extract/`, used read-only |
| Prior input identity receipts | `mw-siralim/notes/source-hashes.json`, `macho-code-identity.json` and `extract/HASHES.txt` |
| Original installed executable | SHA256 `2046367bc20a32f4ddabffaf8067050669680b15cc3dc815dc383a1289228106` |
| Original archive | SHA256 `442d90e49d918f661c4bc3d842fa4bc4a7ad090f6da053f45fe7593c587511a4` |
| Prior arm64 analysis copy, never executed | `mw-siralim/extract/SiralimUltimate.analysis.arm64`, SHA256 `498d9031d463e9181208ae42308d615b3a2edd2d039074fe09855bacc4c555c6` |
| This lane's area | `~/.codex/research/ds-siralim-ultimate/` |
| Full table/topic evidence | `extract/table-index.json`, nine tag-filtered topic JSON files, embedded-string extracts and `save-window.json` |
| Native return evidence | `notes/targets.json`, `seeds.tsv`, `function-ranges.tsv`, `rea-followup-{open,native,timing}.json`, native summary and stderr |
| New decoded bodies | `extract/native/*.c`, 18 bodies; `native-field-index.json` indexes observed field/call order |
| Extract manifest | `extract/HASHES.txt`; recompute with `tools/index_private.py` |

The build 20548371 pin comes from the prior lane's installed census. The final source-hash receipt verifies the supplied pinned files against disk, rather than assuming an old pin is current. See `notes/final-verification.json` for actual results.

## Toolchain

Reused REA 6.4.0 source-built package pinned by the prior lane to revision `bb540826d65316c164d2de8ba4ef10f81a8ad073`, Ghidra 12.1.4 and Homebrew OpenJDK 21. Python `-I`, Node, `rg`, native file reads and SHA256 were sufficient. No package was downloaded or installed.

The successful route copies the prior patched REA package into **this lane's** `tools/rea-bounded/`, excluding Git metadata and dependencies. Its `node_modules` symlink reuses the prior dependency tree read-only. Java seed helper's hardcoded range-file path is changed only in the new copy. The seed decoder restricts flow to each original symbol's start through next text symbol minus one, and the prior bridge retains its 30-second decompile timeout. This is bounded Ghidra analysis, not executing the Mach-O.

The initial two requests loaded the prior package read-only. The successful request uses the new package copy and lane-specific ranges. Tool artifact hashes are retained in `notes/tool-hashes.json`; prior package/source receipts remain the authority for its original patch history.

## Commands that worked

Run from any shell, with the prior area still present:

```sh
python3 -I /Users/weiwei/.codex/research/ds-siralim-ultimate/tools/native_batch.py
python3 -I /Users/weiwei/.codex/research/ds-siralim-ultimate/tools/normalize.py /Users/weiwei/.codex/research/ds-siralim-ultimate/notes/rea-followup-native.json
python3 -I /Users/weiwei/.codex/research/ds-siralim-ultimate/tools/index_private.py
python3 -I /Users/weiwei/.codex/research/ds-siralim-ultimate/tools/verify.py
```

`native_batch.py` sets Ghidra/Java paths, provider, seed-file and startup timeout, opens the known analysis binary through REA MCP and requests the eighteen addresses in `notes/targets.json`. Native analysis can take time; inspect every result item, not just JSON-RPC success. Normalization maps original native addresses and variable/function descriptors to symbol names, retaining raw envelopes as well. Don't treat inferred C types or unwind tails as authored GML.

`index_private.py` reads all 24 prior CSVs using BOM-aware `csv.DictReader`; it preserves full multilingual cells and logical record locators. Topic filters match tags, not full prose; their hit counts are not feature counts. Embedded cooking/gambling strings therefore have a separate search route. It also indexes normal-path field/call occurrences from new C bodies and hashes each retained extract. The earlier inline scan and this saved script use the same parsing policy.

`build_family_map.py` is the initial census generator. The final JSON adds evidence updates after native review; do not overwrite it blindly with the initial generator. All original inventory rows retain their source line and columns. Semantic splits and prior U1-U8 rows remain separate, so they must not be summed as unique gameplay systems.

## Failures and corrections

| Receipt prefix | What failed | Concrete correction / result |
|---|---|---|
| `failed-seed-*` | Seed rows omitted the required `function` kind; open returned configuration error, and all later target calls were unavailable | Correct format is address, kind, name separated by tabs. Zero bodies earned from this run. |
| `failed-ranges-*` | The prior package's bounded Java helper still read the old lane's range list; none of the new entries could decode | Copied the package into this lane and pointed its helper at the new range file. Zero bodies earned from this run. |
| `failed-prefix-*` | New range file used `0x` prefixes, but the Java parser expects bare hex with radix 16; bridge did not report committed seeds | Removed prefixes in the range file. Corrected request returned all 18 bodies. |
| Prior lane save Step timeout | Huge whole-save function exceeded the existing bound | Not retried. Selected six domain helpers instead; whole-file publication remains unread. |

No failure envelope is counted as a recovered function. The recovered batch includes six serialization helpers and twelve numeric/predicate helpers. It establishes bounded static normal paths only. Exact caller reachability, definition constants, defaults, migration and runtime save behavior retain explicit gaps.
