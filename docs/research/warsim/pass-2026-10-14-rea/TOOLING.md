# Tooling and rerun

No installs, clones, game launches, injectors, account actions or writes to
Steam payload/private saves. Prior work and shared REA source/build read-only.
No git add, commit or push. Only this output directory was written in the repo.

## Inputs

Payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/Warsim.exe`.
Steam 659540; prior manifest build 25097075. Current executable SHA-256:
`93d159754192876538b175b1a50a515e256806dce9f03e2d7f50a32880686e5f`.
20,947,051 bytes; preferred image base `0x140000000`.

Read-only prior work: `~/.codex/research/warsim/`, especially
`extract/symbols.json`, `runtime.json`, `strings.json/txt` and the prior dossier.
No repeated original inventory, RaceGenerator/KingdomGenerator/MercGenerator,
HeroBackground or SetRaceEffects reconstruction was done. FactionNameGenerator
was extended because its full resolver was explicitly unread.

Private new workspace: `~/.codex/research/warsim-rea/`.
Raw assembly/pseudocode/field orders and mapped strings stay in `extract/` and
`notes/`. `extract/HASHES.txt` hashes extracts, receipts, scripts and referenced
name-table inputs; it includes the executable digest. No original game code,
raw prose, whole data tables or private saves were added to git.

## Reused tools

| Tool | Revision / configuration | Use |
|---|---|---|
| Ghidra headless | Homebrew 12.1.4, `/opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless` | Selected direct function queries, no auto-analysis |
| Java | Existing OpenJDK 21 via `/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home` | Explicit JAVA_HOME, no system Java stub |
| REA | 6.4.0, pinned `morluto/rea` `bb540826d65316c164d2de8ba4ef10f81a8ad073` | Reused built dist and launcher read-only from Hogwarts workspace |
| REA local patch | Prior `notes/rea-local-patch.diff` | Adds `-noanalysis -max-cpu 2`; inspected and reused |
| Python / objdump | Existing python3 with `-I`, `/usr/bin/objdump` | Static PE mapping, signed jump tables, selected disassembly and validation |
| time | macOS `/usr/bin/time -l` | Per-command time and maximum resident set size |

No npm install/build or global plugin registration occurred in this pass.
Shared upstream provenance remains in Hogwarts [tooling](../../hogwarts-legacy/TOOLING.md)
and [trial](../../hogwarts-legacy/REA_TRIAL.md).

## Mechanical recipe

The private script names below are receipts, not repo tools.

1. `tools/setup.py` maps current PE sections, checks executable hash and joins
   retained COFF symbols to native addresses. It writes labels.tsv and seeds.
2. `tools/rea_trial.py` is the copied/adapted Hogwarts Python MCP client. It
   initializes, opens Warsim with provider ghidra, batches the three name
   addresses and saves JSON envelopes/timing before closing the process.
   Other clients select only event, mechanics or recruitment questions.
3. `tools/ghidra/WarsimChain.java` labels symbols and decompiles only addresses
   passed in a text file, with a 90-second per-function timeout. Its later
   compiler-probe repair is declared. `tools/ghidra/baseline/WarsimChain.java`
   reconstructs the uncorrected name-comparison script for a like-input rerun;
   the live script was subsequently edited for the follow-up.
4. `tools/asm_pass.py` selects the 15 named system functions from targets.json
   using objdump. `asm_strings.py`/`resolve*.py` map constants through PE
   sections; only private output receives raw strings.
5. `jump_tables.py`, `petition_xrefs.py`, `save_schema.py` and
   `name_aliases.py` recover selected dispatch slots, petition literal xrefs,
   field write/read sequences and the alias graph. Their JSON is retained.

Example direct cold comparison, using the baseline script directory:

```sh
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
 /usr/bin/time -l /opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless \
 /tmp/warsim-rea-ghidra-20261014 WarsimComparison \
 -import '/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/Warsim.exe' \
 -noanalysis -max-cpu 2 \
 -scriptPath /Users/weiwei/.codex/research/warsim-rea/tools/ghidra/baseline \
 -postScript WarsimChain.java \
 /Users/weiwei/.codex/research/warsim-rea/extract/direct-name-rerun.txt \
 /Users/weiwei/.codex/research/warsim-rea/notes/labels.tsv \
 /Users/weiwei/.codex/research/warsim-rea/notes/trial-addresses.txt
/usr/bin/time -l python3 -I /Users/weiwei/.codex/research/warsim-rea/tools/rea_trial.py
```

The original cold command used project name Warsim and the then-uncorrected
script under tools/ghidra. A rerun needs a new project name or an explicitly
selected process route, not a blind overwrite. Dot-free /tmp symlinks point
into notes/ghidra-projects and notes/rea-runtime; actual artifacts stay private.
REA uses `node <hogwarts-work>/repos/rea-pinned/scripts/rea.mjs --mcp` with
GHIDRA_INSTALL_DIR, JAVA_HOME, REA_ANALYSIS_PROVIDER=ghidra,
REA_GHIDRA_SEED_FILE, REA_GHIDRA_STARTUP_TIMEOUT_MS=120000 and lane TMPDIR.

## Dead ends and coverage cautions

- The prior FINDINGS file is JSON, not FINDINGS.md; corrected the read path.
- Initial combined dossier output truncated. Switched to focused file sections
  and structured/private summaries; no count is based on truncated output.
- Native stack probes need a real call model. Merely adding a function-name
  seed did not fix REA's symbolic stack or missing jump tables.
- Direct LoadGame, SaveGame, Preparation, BattleSim and BattleDamage timed out
  at the per-function budget. Selected Arena and BattleTroopReturn succeeded.
  The large batch was stopped during later processing after repeated failures;
  it was not reported as fifteen successful decompiles.
- The first uncorrected LoadGame also timed out; its batch was stopped before
  applying Ghidra's existing alloca_probe fixup in the private direct script.
  That repair did not make the monolithic functions complete.
- REA `ok` batches still included incomplete switches and branch distortion.
  Tables and selected boundaries were independently checked in assembly.
- Assembly windows can begin mid-instruction. Analysis used known branch entry
  addresses and labeled full-function disassembly for decisive instructions;
  partial leading bytes were not treated as meaningful instructions.
- AutoRecruit MCP query was stopped without a batch result after 333.13 s
  whole-client elapsed. Captured provider logs and opening envelope remain.
  The client exit was 143, its private runtime cleaned up and its processes
  exited. Native assembly then established three selected recruitment routes.
  No cancellation timing/RSS is used as a successful REA benchmark.
- No external web formula was used. Installed native bytes are this pass's
  source; prior developer statements remain dated, qualified evidence.

[REA_TRIAL](REA_TRIAL.md) holds equal-input timing and D2 recommendation limits.
[CHECKPOINT](CHECKPOINT.md) records actual query coverage and unread routes.
