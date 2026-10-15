# Aspect tooling

2026-10-14. No new install, clone or shared tool modification. New work root: `~/.codex/research/immortal-life-aspects-2026-10-14/`. Prior immortal-life and immortal-life-2 work areas reused read-only. Only this aspects folder written in the repo. No staging, commit, push, game launch, injector, bottle change or personal save access.

## Inputs and tools

Reuse prior source-built Perfare/Il2CppDumper4741d46ba9cd6159c5d853eb9d6fc48b4bfa2b1a maps, UnityPy1.25.4 in the existing lane venv, and Ghidra12.1.4 with explicit Java21. REA had already been compared in the deep pass; this follow-up copied the completed direct Ghidra project into its own work area and used incremental selected-method reads. It did not repeat the earlier native import or benchmark. Source/metadata hashes and the extracted assets bundle hash bind the inputs.

`tools/census.py` reads the prior296-file index and raw TextAssets, records root type/count/fields/hash and produces the class/service discovery map. Original files are untouched. `tools/graphs.py` loads only the installed231MiB assets bundle via UnityPy and exports MonoBehaviour trees with beginGuid/words/options/conditions/scripts. It writes1,261 complete graphs, with no type-tree errors in this selected bundle scan. That count matches the catalogue's dialogue asset path count. No textures/audio/scene bundle were exported.

`tools/dialogue_digest.py` builds full line/condition/script indexes and a GUID-link audit. It does not erase unreachable-looking content, repair edges or flatten branching conditions into a false single condition per line. The private corpus retains authored text in full; committed summaries paraphrase it.

`tools/native_setup.py` writes40 named seed entries and copies the prior saved project to its own notes/ghidra-project. `SelectedChain.java` disassembles and decompiles only those entries with a45-second per-function bound. No full automatic analysis. Native reads include save aggregation/serialization/load, dialogue state/condition/commands, alchemy control/result, cooking transforms/completion and smelting begin/update/cancel/collect/save. The selection includes six small smelter event accessors and one shared no-op load helper; these add no mechanism proof.

Command shape used, with all writable paths under the new work root:

```sh
python3 -I <new-root>/tools/census.py
<prior-venv>/bin/python -I <new-root>/tools/graphs.py <installed-ImmortalLife_Data> <new-root>/extract/dialogue
python3 -I <new-root>/tools/dialogue_digest.py
python3 -I <new-root>/tools/native_setup.py
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home /usr/bin/time -l /opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless /tmp/immortal-life-aspects-20261014/notes/ghidra-project ImmortalLife -process GameAssembly.dll -noanalysis -max-cpu 2 -scriptPath /tmp/immortal-life-aspects-20261014/tools/ghidra -postScript SelectedChain.java <new-root>/notes/seeds.tsv <new-root>/notes/native.txt
python3 -I <new-root>/tools/annotate_native.py
```

The /tmp path is a dot-free symlink into the new private root, needed for Ghidra project-path handling. The40-entry incremental command completed in148.22s, maximum RSS444,874,752 bytes, with40 output records and no FAIL/NO_FUNCTION. This is not a comparable replacement for the earlier cold-import timing. Shared float argument recovery and generic function identities remain qualified. Annotations resolve only unique native names and retain method-token maps; shared no-op seed names are normalized to avoid false caller claims.

## Explicit gaps and dead ends

The expected MessageSO receiveMessages tree shape was not found in the assets bundle or a targeted resources scan. Resource loading traversed825,681 objects and46,197 MonoBehaviour type-tree errors. Its INDEX records each failure; no attempt to invent schema repairs or claim full letter text. The catalogue/PaperBird references and MessageSO declarations provide the next exact route. The large scenes bundle remains unread.

A small class-count probe had a NameError and was corrected by the later inventory generator; no target data changed. The final docs/JSON/links/count/hash checks are in VALIDATION.json. All tests here are research artifact checks. No gameplay, save/reload/import, cloud or corruption test was run.
