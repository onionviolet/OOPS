# Tooling and reproducibility

No installs, downloads, REA server launch or game execution in this aspect pass. Existing Ghidra 12.1.4, Java 21, objdump and standard-library Python were used. Prior `warsim` and `warsim-rea` workspaces and the REA build were read-only inputs. No save, score, settings, portrait or mutable roster was inspected as gameplay state.

Binary: Steam 659540 build 25097075, `Warsim.exe`, 20,947,051 bytes. Current bytes match the prior SHA-256:
`93d159754192876538b175b1a50a515e256806dce9f03e2d7f50a32880686e5f`.

New work area: `/Users/weiwei/.codex/research/warsim-aspects-2026-10-14/`.
Its dot-free project alias is `/tmp/warsim-aspects-ghidra-20261014`.

## Commands used

The capture script reuses prior COFF symbols, table metadata and string offsets. It hashes the current executable, scans RIP-relative literal references, captures selected Data files and disassembles five named targets. A follow-up excludes generated Relations data and adds Advice tag conditions. No executable entry point is run.

```sh
python3 -I /Users/weiwei/.codex/research/warsim-aspects-2026-10-14/tools/capture.py
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
/usr/bin/time -l /opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless \
/tmp/warsim-aspects-ghidra-20261014 Aspects \
-import '/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/Warsim.exe' \
-noanalysis -max-cpu 2 \
-scriptPath /Users/weiwei/.codex/research/warsim-aspects-2026-10-14/tools/ghidra \
-postScript WarsimChain.java \
/Users/weiwei/.codex/research/warsim-aspects-2026-10-14/extract/new-chains.txt \
/Users/weiwei/.codex/research/warsim-rea/notes/labels.tsv \
/Users/weiwei/.codex/research/warsim-aspects-2026-10-14/notes/addresses.txt
python3 -I /Users/weiwei/.codex/research/warsim-aspects-2026-10-14/tools/resolve.py
python3 -I /Users/weiwei/.codex/research/warsim-aspects-2026-10-14/tools/finalize_extracts.py
```

The Java script copies the earlier direct baseline into this work area, seeds labels, disassembles/creates only selected roots and allows 30 seconds per decompile. It does not request full automatic analysis. The five roots are GenerateRelations, QuestGenerator, Advice, MonsterMaker and MonsterLeveller. All five produced output without a FAIL record. Import and selected analysis together took 26.76 seconds wall time, 37.47 user seconds and 3.37 system seconds. `/usr/bin/time -l` reports peak resident size 1,551,056,896 bytes. This is process RAM, not the project's disk size or the installed game's runtime cost.

RelationRand was read directly with `objdump -d --disassemble-symbols=_Z12RelationRandv` against the same binary. The retained opening main window uses `--start-address=0x1400016d0 --stop-address=0x140001d50`. The MonsterViewer window contains the validated call at 0x140b0f724 with its XP>99 comparison. Exploratory windows can begin inside an instruction; only aligned recovered instructions around the actual calls support claims. Byte-level E8 scans retain candidate routes and are not an exhaustive reliable call graph.

## Effort and limits

The named small helpers completed within one focused cold import. Prior work's large save/battle/phase decompiles timed out; no equivalent monolithic retry was attempted. Hand effort went into resolving data literals, parsing the relation writer schema, joining monster fields to the existing save census, and distinguishing generated scratch text from objective execution. Human analysis effort was not stopwatch-measured in this pass.

Reuse the prior [REA/direct comparison](../pass-2026-10-14-rea/REA_TRIAL.md) for the Warsim D2 tool-fit data point. This aspect pass is a direct-script continuation, not a new equal-input REA benchmark. No new REA measurement is claimed.

Artifact checks are run by `tools/validate.py` in the new work area. New extracts/scripts/receipts are hashed in `extract/HASHES.txt`. The retained tables and full text stay private; public files contain analysis, counts, identifiers and paraphrase only. A first capture treated Relations as a generic table; after its writer was traced, only that new scratch copy was removed and the exclusion recorded. The installed file and all prior work remained untouched.
