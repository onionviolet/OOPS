# Tooling and rerun

2026-10-14. New private root `/Users/weiwei/.codex/research/immortal-life-2/`. Only this deep-pass output directory was written in the repo. No stage, commit, push, source/build change, install mutation, game launch, injection, bottle or personal save access.

## Reused inputs

Read prior REPORT, CHECKPOINT, TOOLING, FINDINGS and existing extract paths before native work. Prior source-built Il2CppDumper revision4741d46ba9cd6159c5d853eb9d6fc48b4bfa2b1a supplies `dump.cs` and `script.json` under `~/.codex/research/immortal-life/extract/types/`. Existing TextAssets under its `extract/text/` supply tables. No extraction was repeated and no prior work-area file was changed.

Rehashed installed GameAssembly.dll and global-metadata.dat and matched both prior hashes. Input receipt: private `extract/INPUT_HASHES.json`. REA independently returned the matching DLL digest. The earlier build17861603 receipt is inherited; no new claim that a manifest proves native behavior.

REA6.4.0 is the existing source archive build at `~/.codex/research/hogwarts-legacy/repos/rea-pinned/`, commit bb540826d65316c164d2de8ba4ef10f81a8ad073. Read its prior REA_TRIAL and TOOLING and local patch. Copied prior client into own tools/rea_trial_original.py; adapted clients stay in own work area. No new clone, dependency install or shared tool patch.

## Successful route

1. Parse named application type declarations into private method selections. Map each call against `script.json`, including ScriptMetadataMethod generic context and string globals. Source methods can share addresses. The corrected parser anchors RVA comments at the start of the line to avoid swallowing actual methods after attribute-RVA comments. Corrected map: notes/methods-corrected.json. Initial false attribute rows were never accepted as mechanism evidence.
2. Write exact address/function/name seed TSVs for the named question only. REA preserves unmodified installed DLL bytes and uses temporary imports under own notes/rea-runtime via a dot-free /tmp symlink. No full auto-analysis.
3. Send initialize, initialized notification, open_binary(path, provider_id=ghidra), then batch_decompile(addresses). Save entire JSON envelopes. First24 entries answer breakthrough; later selected entries answer NPC methods, schedule/work/favor/roommate consumers, authored advancement triggers and defeat/recovery.
4. Annotate results from the matching Dumper map. `tools/annotate.py` replaces only uniquely named native addresses; shared aliases remain explicit and generic method tokens resolve the intended type. Raw/annotated pseudocode remains private.
5. For the D2 comparison, import the same DLL with no auto-analysis and run own SelectedChain.java against the same24 seed entries. Inspect selected cost/wave/promotion operations across both outputs.

Commands, run from any directory with explicit paths:

```sh
python3 -I "$HOME/.codex/research/immortal-life-2/tools/setup.py"
/usr/bin/time -l python3 -I "$HOME/.codex/research/immortal-life-2/tools/rea_run.py"
python3 -I "$HOME/.codex/research/immortal-life-2/tools/annotate.py"
```

The setup script retains the first selection and original rough map. Use `notes/methods-corrected.json` for future selection, and retain the existing seeds as the measured first trial. Client variants rea_run2.py through rea_run7.py use corresponding numbered selected JSON and TSVs. Do not rerun a finished chain merely to regenerate an output already matched to this build.

Client environment: GHIDRA_INSTALL_DIR=/opt/homebrew/opt/ghidra/libexec; JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home; REA_ANALYSIS_PROVIDER=ghidra; REA_GHIDRA_STARTUP_TIMEOUT_MS=120000; REA_GHIDRA_SEED_FILE points to the current own seed file; TMPDIR=/tmp/immortal-life-2-rea-20261014. The client launches `node <pinned>/scripts/rea.mjs --mcp` without compiling or installing it.

Direct command used `/opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless /tmp/immortal-life-2-ghidra-20261014/notes/ghidra-project ImmortalLife -import <installed GameAssembly.dll> -noanalysis -max-cpu 2 -scriptPath /tmp/immortal-life-2-ghidra-20261014/tools/ghidra -postScript SelectedChain.java <own notes/seeds.tsv> <own notes/direct-chain.txt>`. JAVA_HOME was explicit and /usr/bin/time -l wrapped the command. The dot-free project symlink resolves into this private work area because Ghidra rejects dot-prefixed project-path components.

## Search and recovery limits

`tools/callers.py` scans executable PE sections for E8/E9 relative-transfer byte candidates. Its nearest ScriptMethod label is a lead, not an established containing function. PE .pdata places call0x18052f1e7 inside0x18052f120..0x18052f301. REA decompilation plus a generic await token identifies RealmUpCmd there. Nearby RoomManager.UpdateRoomState is not the caller. Indirect/reflected/inlined callers remain outside the census.

The lifespan search covers the application-facing declaration suffix and full PlayerData/Info.NPC schemas; the two aging substring matches are InStaging. No full-program absence claim follows.

Dead ends retained privately: initial Python client had an unmatched parenthesis and was corrected before target work; a supplementary broad seed list with duplicate addresses yielded target_unavailable per-item responses. Narrowing to six distinct needed entries succeeded. Failed envelopes are in notes/failed4/. No root-cause claim about REA is made. Obsolete failed supplementary top-level batch8/16 files, if retained, are not successful coverage. The final optional rea_run7 import returned no decompile result by its startup window and a second temporary Java import was observed; stopped only its own client/server/Java processes. Logs are retained in notes/trigger-import-stop/. TriggerManager.Update/SetTriggerInfos are not claimed read. No HTTP fetch failed or game was run.

Validation reads JSON/status, counts actual successful unique entries, checks Markdown links, checks required output files and hashes retained extracts. Full gameplay, all native consumers, save/reload/import and human acceptance remain unrun. Future resume uses CHECKPOINT's exact unread table.
