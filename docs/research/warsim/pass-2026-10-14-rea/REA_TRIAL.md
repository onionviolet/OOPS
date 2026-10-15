# D2 second data point: Warsim names

2026-10-14. Recommendation: REA is a useful optional query interface. This
trial shows no new decompilation capability and no reliable speed advantage.
Both routes recover the same three selected name functions with Ghidra 12.1.4.

## Inputs and bounded scope

Steam 659540, build 25097075. Installed Warsim.exe is 20,947,051 bytes,
PE32+ x86-64 console C++, image base `0x140000000`, SHA-256
`93d159754192876538b175b1a50a515e256806dce9f03e2d7f50a32880686e5f`.
The current hash was recomputed and matches the prior pass.

REA 6.4.0 reuses the already built pinned `morluto/rea`
`bb540826d65316c164d2de8ba4ef10f81a8ad073` under the Hogwarts private workspace.
Its existing launcher patch adds `-noanalysis -max-cpu 2`; the patch was read
and reused, without modifying or rebuilding the shared tool. Existing Homebrew
Java 21 is selected through explicit JAVA_HOME. No install was needed.

Named question: how do `Name`, `NameMaker` and `NameWriter` select or assemble
a name? COFF addresses and labels from the prior read-only symbol extract seed
both routes. Only these three functions are disassembled/decompiled for the
comparison. Labeling a symbol does not analyze its function. Both imports
start cold, with full automatic analysis disabled. The follow-up system reads
are outside this timing comparison.

| Route | Single observed elapsed time | Maximum resident set size | Work / effort |
|---|---:|---:|---|
| Direct Ghidra | 11.01 s | 1,174,077,440 bytes | One new small Java script and one successful cold import/query; retained project supports later selected reads |
| REA MCP | 9.67 s whole client; 8.40 s open/query interval | 1,117,421,568 bytes | Copied prior Python client, changed target/seeds/paths, one initialize/open/batch session; 3 successes, 0 failures; ephemeral project cleaned on close |

`/usr/bin/time -l` supplies elapsed time and maximum RSS. They are individual
process-tree accounting observations, not aggregate host RAM or a controlled
benchmark. Other wave workers were live. Build/setup time from the first REA
trial is excluded because that build was reused. Peak transient disk was not
sampled. Private workspace and retained-project sizes are recorded in
[checkpoint](CHECKPOINT.md).

Two pseudocode bodies compare exactly after trimming whitespace. NameMaker
has import-reference spelling and wrapping differences around cout/endl, with
the same selected arithmetic, file operations and loop conditions. That is
operation-level agreement, not independently verified runtime behavior.

## Follow-up reveals the common recovery limit

A three-event REA batch also returned three `ok` statuses (36.34 s,
1,391,837,184-byte maximum RSS). Its ProcGenExplo output omitted most of the
large switch because Ghidra failed to recover a jump table. RandomTurnEvent
also carried a jump-table warning. The unresolved MinGW stack probe produced
symbolic stack offsets and distorted branch reconstruction. An `ok` response
therefore does not mean a complete or correct resolver.

A diagnostic REA seed retry added the compiler helper as a named function.
It took 191.76 s, maximum RSS 1,282,621,440 bytes and still left the stack
probe and switch unresolved. Naming the helper does not apply a call fixup.
There was no useful recovery gain, so that route was not repeated.

The direct follow-up explicitly applies Ghidra's existing `alloca_probe` fixup
to `___chkstk_ms` in the private project. Large LoadGame and SaveGame each
still timed out at the 90-second per-function budget. The first uncorrected
LoadGame query also timed out, and its remaining batch was stopped before
retrying with the compiler model. Assembly, period delimiters, global field
loads/stores and literal-address mapping supplied the save-format evidence.
No timeout was described as a successful semantic read.

These are declared analysis annotations, not changes to Warsim.exe. The
three-function name comparison predates them and uses equal inputs. Later
repaired direct output and unrepaired REA output must not be conflated.

## Rerun and proposed owner note

Private `tools/rea_trial.py`, `tools/ghidra/WarsimChain.java`,
`notes/trial-seeds.tsv`, `notes/trial-addresses.txt`, `notes/provenance.json`,
`notes/comparison.json` and time logs preserve the experiment. The copied
client runs `node <pinned>/scripts/rea.mjs --mcp`, initializes JSON-RPC, calls
`open_binary(provider_id=ghidra)` and `batch_decompile(addresses=...)`, then
closes stdin and waits for shutdown. Dot-free `/tmp/warsim-rea-*` symlinks
point into this lane's private work area, avoiding Ghidra's dot-path rejection.

PROPOSED shared D2 note: two native trials now show REA's batch/session and
hash-bound evidence convenience, with no demonstrated decompiler advantage.
Keep direct Ghidra for custom ABI/compiler fixes and precise failure recovery.
Require warnings and selected branch coverage to qualify an `ok` MCP result.
The shared tool-fit owner was not edited.
