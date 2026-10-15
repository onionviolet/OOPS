# ngu-idle: tooling and source ledger

Lane work: `/Users/weiwei/.codex/research/asp-idle`. Main checkout read-only except the four assigned `aspects-2026-10-14/` directories. No clones, commits, installs, network fetches, executable/game launches, account or save access. Prior research exports were reused read-only, and source text was inspected rather than executed.

## Reuse and identity

Primary reused source: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/`. Prior [REPORT](../REPORT.md), [CHECKPOINT](../CHECKPOINT.md) and available TOOLING were read first. Your Chronicle has no top-level TOOLING; its second pass supplies it and explains the missing older native recovery. Only Your Chronicle has a prior `pass-2026-10-14/` folder among these four. Its report/checkpoint/tooling, digests and artifact indexes were read.

Current installed input checks: NGU managed assembly, Idle Reincarnator executable and all four Your Chronicle intake program/data files match their prior SHA256 pins. Exact values: `/Users/weiwei/.codex/research/asp-idle/notes/INPUT_CHECKS.json`. This does not establish current remote news, game execution or save state. Idleon uses the previously acquired frozen official web bundle, not a fresh fetch; its full SHA256 is in `REUSED_SOURCES.json`. No claim that this is the latest served bundle.

## Raw preservation and reproduction

[Private lane extracts](/Users/weiwei/.codex/research/asp-idle/extract/) hold new NGU full TextAsset text/IDs, Idleon selected source contexts and script-class census, copies of all three Idle Reincarnator story tables, table inventories and Your Chronicle staged conversation selection/graph counts. Full reused raw source remains at the paths in `extract/REUSED_SOURCES.json` (all SHA256 pinned), including all Your Chronicle decoded tables and the complete Idleon bundle. No raw prose/code bodies were copied into the repo.

Commands executed successfully:

```sh
/Users/weiwei/.codex/research/heavens-vault/tools/venv/bin/python -I /Users/weiwei/.codex/research/asp-idle/tools/extract_textassets.py "/Users/weiwei/Library/Application Support/Steam/steamapps/common/NGU IDLE/NGUIdle_Data" /Users/weiwei/.codex/research/asp-idle/extract/ngu-text
python3 -I /Users/weiwei/.codex/research/asp-idle/tools/write_aspects.py
python3 -I /Users/weiwei/.codex/research/asp-idle/tools/validate.py
```

The TextAsset extractor was read before reuse, then copied into this lane. Existing UnityPy environment only; output INDEX has328 entries, ERRORS is empty. It loads installed assets as data and exports TextAssets only. On rerun use a new private output directory to retain the snapshot. `write_aspects.py` writes only the four assigned repo output dirs and this lane work area. Read it before rerun because it replaces those analysis files.

Private structural inspections used standard Python csv/json/XML parsers and bounded string slices, plus rg. A broad JavaScript function-name regex was too slow; subsequent searches used literal find loops/bounded identifier classes. The stranded inspection process was identified by its asp-idle parent and terminated before closeout. The first report generator also counted each helper through a repeated full-bundle scan and was interrupted at that line. It was corrected to count all identifiers in one pass before rerunning. One exploratory path used the dossier name instead of actual idleon work directory, corrected from prior TOOLING. A guessed local script path was corrected from the file inventory. No fetch retries, native-tool downloads or new dependency installs. The two early long tool calls omitted the returned session ID in the display; completed extraction was checked through INDEX/ERRORS and final hashes rather than treating the empty display as success.

## Checks and evidence limits

`extract/HASHES.txt` hashes every new extract except itself. `REUSED_SOURCES.json` hashes the full reused script/table corpus without changing it; input checks confirm the named installed pins. `VALIDATION.json` records the artifact/source assertions: all 774 reused source hashes also match their original lane manifests, all 352 new extract hashes verify, and all six named installed input pins match. Static checks are not tests of runtime, import/reload, performance, cloud durability or user acceptance. Exact unread rows are in CHECKPOINT. No YAIRPG build, browser or gameplay tests were run for this research-only task.
