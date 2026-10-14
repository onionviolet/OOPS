# D2: one talent-purchase chain

2026-10-14. **Verdict: useful optional interface, no demonstrated decompiler advantage.** Direct Ghidra and REA over the same Ghidra version recover the first-purchase path's one-point deduction. This is a static result, not a played purchase. REA's batch response is easier to query and binds evidence to the target hash. Its source install and boundary setup cost more effort than a small direct script for this one chain.

## Target and question

Named question: **what does a first talent purchase spend?** PerkDefinition has level/lock/ability fields but no cost. The decoded `UI_BP_FG_TalentsScreen` function `Purchase Talent` calls native `PerksTree.PurchasePerk` at bytecode offset 96 and tests its Boolean result at 169. That was the native boundary that justified this trial. No damage, stealth, care-timer or Ancient Magic native chain was added.

| Field | Exact input |
|---|---|
| Game | Hogwarts Legacy, Steam 990080, build 20773316 |
| Executable | Installed `Phoenix/Binaries/Win64/HogwartsLegacy.exe`, 450,656,768 bytes |
| SHA256 | `b713e88e0034cb23562b7ffeba6febe5d6a679578215cb595e1644cfc56245a1` |
| PE | x86-64, image base `0x140000000` |
| Ghidra | Homebrew 12.1.4 PUBLIC |
| Java | Existing Homebrew OpenJDK 21.0.12.1, explicit JAVA_HOME |
| REA | 6.4.0, source archive for `bb540826d65316c164d2de8ba4ef10f81a8ad073` |
| Node / npm | 22.23.3 / 10.9.9 |
| Host memory | 68,719,476,736 bytes installed; measured with sysctl |
| SDK reference | Roadou/HogwartsLegacy-SDK `12ffa8a46fb84e7ed13a528715dfd8bb5521594c`, names/signatures only |

The public SDK is **not build-matched**. Its PurchasePerk address is different and its README warns that function addresses may be wrong. No SDK offset was applied blindly. Fresh static scanning of this executable found the PurchasePerk string and two adjacent name/function tables. One is a reflection-registration helper; the second points to the executable wrapper at `0x14374a6e0`. Its decoded call leads to `0x1430ff110`, which calls `0x143110180` with signed minus one on its first-purchase success path. The latter reads the current count, adds its argument, rejects a negative result and writes the `PerkPoints` value for `Player0`. Those two tiny strings were independently read from this executable's mapped data.

## Same selected chain, two routes

| Route | Work performed | Observed time and RAM | Disk and effort |
|---|---|---|---|
| Direct Ghidra | Import PE with no auto-analysis; custom PerkChain.java disassembles/decompiles only the chosen entry points. Initial wrapper discovery, then two incremental chain additions. | Cold import plus first query: 30.50 s, maximum RSS 2,885,091,328 bytes. Incremental reads: 3.63 s / 516,751,360 bytes and 3.70 s / 616,857,600 bytes. | Retained project about 696 MiB. One Java script, three successful native invocations after setup fixes. |
| REA over Ghidra | One local MCP session: open_binary, then batch_decompile for the same three addresses. Three succeeded, zero failed. Seeds name the wrapper, purchase body and point updater. | Whole client process: 26.43 s, maximum RSS 2,900,983,808 bytes. Request interval: 25.14 s. | Temporary snapshot/project cleaned on session close; retained runtime directory 0 bytes. Peak transient disk was not sampled. REA source build, 400 npm packages, a small launcher patch and a Python MCP client were required. |

Times are single observations, **not a benchmark win**. The direct route included discovery and warm incremental reads, while REA started after the target chain was known. Source installation/build time is outside these query timings. macOS `/usr/bin/time -l` supplied maximum resident set sizes; no swap was reported for either measured route. The retained REA dependency directory is about 383 MiB. Exact total workspace size is in CHECKPOINT.

The source archive was read before local installation. `npm ci --ignore-scripts --no-audit --no-fund` installed only inside the pinned source directory. `npm run compile` compiled TypeScript and bundled the local runtime. No global npm installation, plugin registration, GUI opening, game launch or injector occurred.

**Controlled local patch:** the REA Ghidra launcher adds `-noanalysis -max-cpu 2`, matching the direct route's bounded analysis policy. Its default automatic whole-image analysis was not measured. The source diff and hashes are retained in private notes. This comparison evaluates a locally bounded REA route, not unmodified default REA performance. Its generated profile does not encode this local patch, so the patch receipt is required provenance.

Both routes use Ghidra's decompiler, and both retain uncertain types and unresolved helper names. Direct FunctionManager bodies initially report one address while the decompiler follows control flow beyond it. Therefore call-list completeness or full function-boundary recovery is **not established**. We compared the selected pseudocode and its spend/update operations, not complete callers, all instructions or all program behavior. REA's “shipped-artifact” authority label does not change that limit.

## Result and repeat path

SHOWN (static native): a first successful purchase inserts/updates the perk's level-one state and calls the point updater with minus one. The updater refuses a negative total. INFERRED: the normal first-purchase branch costs one talent point. Already-owned upgrade handling follows a separate early branch and was not expanded. Reset/return costs, level-up point awards and transaction durability remain unverified.

Private evidence lives under `~/.codex/research/hogwarts-legacy/`:

- `notes/native-target.json` binds PE sections, executable hash, string address and registration references.
- `notes/perk-chain-ghidra.txt`, `notes/ghidra-baseline.log`, `notes/ghidra-chain.log` and `notes/ghidra-point-update.log` retain direct output and measurements.
- `notes/rea-open.json`, `notes/rea-perk-chain.json`, `notes/rea-evidence.json`, `notes/rea-timing.json` and `notes/rea-trial.log` retain the MCP envelope, three results and measurements.
- `notes/perk-seeds.tsv`, `tools/native_target.py`, `tools/ghidra/PerkChain.java` and `tools/rea_trial.py` make target selection and the queries repeatable. Recompute addresses for a changed build.
- `notes/rea-local-patch.diff` and `notes/tool-source-hashes.json` record the local source change and source archive digest.

Ghidra initially found no Java through the system stub; the existing Homebrew JDK fixed it. Ghidra also rejects dot-prefixed project-path components, including `.codex`. A dot-free `/tmp/hogwarts-legacy-ghidra-20261014` symlink points into the authorized workspace. The analogous REA temp symlink keeps actual files in the workspace. No game data was copied outside it.

Proposed disposition: keep the existing data/Blueprint-first route. Use REA when a multi-query native investigation benefits from one session's batch results and source-bound evidence. Do not replace working direct scripts or treat REA as a second decompilation algorithm. The proposed line for the shared tool-fit owner is in REPORT; that owner was not edited.
