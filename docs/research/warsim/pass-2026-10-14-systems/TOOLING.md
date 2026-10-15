# Tooling and private evidence

No installs, downloads, source clones, game launches, injectors, Steam actions or Windows-executable execution. Previous workspaces and installed payload were read-only. The only repo writes were inside this output folder. No stage, commit, push or runtime edit.

## Pinned inputs

Steam app 659540, retained build 25097075. Current executable bytes were hashed again and match all prior passes: 20,947,051 bytes, SHA-256 `93d159754192876538b175b1a50a515e256806dce9f03e2d7f50a32880686e5f`.

Executable: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/Warsim.exe`.
New private area: `/Users/weiwei/.codex/research/ds-warsim/`.
Prior inputs: `warsim/`, `warsim-rea/`, `warsim-aspects-2026-10-14/` under `~/.codex/research/`, reused read-only. A 31-file prior-dossier digest manifest is in `notes/prior-inputs.json`. No mutable roster, Relations file, save, score or settings content was recaptured. The 38 static Extras text files were newly read and retained, 1,623 physical lines; `tools/extras.py` and `extract/extras-index.json` record that cheap unread closure.

REA 6.4.0 uses the prior pinned `morluto/rea` revision `bb540826d65316c164d2de8ba4ef10f81a8ad073` in `/Users/weiwei/.codex/research/hogwarts-legacy/repos/rea-pinned/`. The inspected prior MCP client was adapted locally. Shared REA source and its launcher patch were not edited or rebuilt. Existing Ghidra 12.1.4, OpenJDK 21, objdump and Python standard library were reused.

## Actual operations and receipts

| Operation | Receipt | Result / limits |
|---|---|---|
| Payload hash and target selection | `tools/setup.py`, `notes/provenance.json`, `notes/targets.json` | 21 new helper targets; prior function/table captures reused; 38 previously metadata-only Extras text files newly retained |
| Native disassembly | `extract/<mangled-name>.asm` | Full objdump output for 21 targets, never execution |
| REA open/batch | `tools/rea_batch.py`, `tools/rea_run.py`, `notes/rea-probe-open.json`, `notes/rea-probe-chain.json`, `notes/rea.log` | 12/12 `ok`, 0 failed envelopes; 12.858 seconds measured open/query interval, not a controlled benchmark or all-path success |
| Focused direct follow-up | `tools/ghidra/WarsimChain.java`, `notes/direct-addresses.txt`, `notes/direct.log`, `extract/direct-chains.txt` | Nine function outputs, no FAIL row, 20-second per-function limit, no full auto-analysis; selected semantic reading only |
| Literal and constant resolution | `tools/resolve.py`, `extract/constants.json`, `extract/*.resolved.txt` | Seven trainer constants read as little-endian doubles; full native strings kept private |
| Field and text retention | `notes/*.save-refs.json`, `extract/native-text-index.json`, `notes/native-chain-notes.json` | Main-save field-reference joins for 21 helpers; 3,315 address-qualified text IDs with function/file/line references; conditions remain partial |
| Full map and prior gaps | `tools/map_inventory.py`, `tools/retain.py` | 32 system rows, 143 helpers, 255 tables, 28 inherited unread rows; inferred owner routing is explicit |
| Artifact verification | `tools/validate.py`, `notes/artifact-validation.json` | JSON, inventory equality, section/touch counts, local links, owner paths, prose/privacy scan and hashes |

Direct follow-up was used for the larger newly selected bodies. The former large LoadGame/SaveGame/BattleSim/TurnReport timeouts were not repeated. No new REA/direct performance comparison is claimed. REA remains the preferred convenient query route; assembly and a focused direct script answer specific recovery/constant questions.

## Mechanical rerun

These are private scripts, not shared project tooling. Their setup/probe commands write only the new work area. Authoring/map scripts can overwrite this lane's research outputs, so inspect the target paths before rerunning.

```sh
python3 -I /Users/weiwei/.codex/research/ds-warsim/tools/setup.py
python3 -I /Users/weiwei/.codex/research/ds-warsim/tools/rea_batch.py
```

The MCP client initializes JSON-RPC, sends notifications/initialized, opens the binary with provider_id=ghidra, batches the twelve addresses, retains the envelope and closes stdin. Its TMPDIR is `notes/runtime` in this lane. The source immutable Ghidra provider never launches the target.

The direct command used a dot-free project alias `/tmp/dswarsim-ghidra-20261014` pointing into `notes/projects`:

```sh
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home \
/opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless \
/tmp/dswarsim-ghidra-20261014 Systems \
-import '/Users/weiwei/Library/Application Support/Steam/steamapps/common/Warsim The Realm of Aslona/Warsim.exe' \
-noanalysis -max-cpu 2 \
-scriptPath /Users/weiwei/.codex/research/ds-warsim/tools/ghidra \
-postScript WarsimChain.java \
/Users/weiwei/.codex/research/ds-warsim/extract/direct-chains.txt \
/Users/weiwei/.codex/research/warsim-rea/notes/labels.tsv \
/Users/weiwei/.codex/research/ds-warsim/notes/direct-addresses.txt
```

For another cold import choose a fresh project name instead of overwriting this retained project. The copied Java script creates labels, disassembles only selected entries and applies no new compiler fixup. It is not an independent decompiler or a full recovery of main.

```sh
python3 -I /Users/weiwei/.codex/research/ds-warsim/tools/resolve.py
python3 -I /Users/weiwei/.codex/research/ds-warsim/tools/validate.py
```

## Errors, caveats and route decisions

- Broad combined dossier output truncated in initial reads. Follow-up file/section reads and complete structured catalogs supplied the counts; truncated displays were not semantic proof.
- One read mistyped AdventurerGenerator's mangled length as 13 rather than 19; corrected using the retained symbol and selected file. No extraction was lost.
- REA's twelve outputs have the common overlapping-global warning. The direct AdventurerGenerator body additionally reports six missing jump tables and indirect-jump-as-call warnings, so group-size/type switches remain unread. The other eight direct bodies have no missing-switch warning in their retained text. That still does not certify every path.
- Raw pseudocode names imports as `func_...`; their actual meanings were checked with COFF assembly and prior labels. Constants, arithmetic boundaries and selected stock writes were checked in assembly rather than inferred from dialogue.
- The first routing draft treated minigames/audio as possible missing-owner areas. Searching the live life-sim and thematic UI owners found explicit coverage, so the final map records rule-depth gaps only. No ownerless family is claimed.
- No network route was required. The prior external source statements remain prior dated evidence; no fresh web formula or current external claim was introduced.

## Retention boundary

`extract/HASHES.txt` hashes this lane's extracts, scripts, notes and public outputs plus the installed executable. The old manifests remain untouched. Prior data/dialogue tables stay at the aspect workspace's captured paths; their IDs and hashes are already retained there. New native text IDs are `ws.25097075:va:0x...`; per-reference function/file/line locators are recorded, with untraced conditions explicitly unread. An address ID is snapshot-qualified, not stable across builds.

The raw native code, full dialogue, ASCII art and full tables are outside the public repo output. Public artifacts contain paraphrase, tiny identifiers, arithmetic and locators only. Disk totals and actual validation result are finalized in [CHECKPOINT.md](CHECKPOINT.md).
