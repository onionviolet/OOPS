# Reproduce this lane

No installs, clones, network requests, native game launch, loaders or downloaded executables. No repository commit applies to a fetched source. Existing `~/.dotnet/tools/ilspycmd` 11.1 and `~/.dotnet/dotnet` SDK 10.0.402, Python standard library and shell tools were sufficient. ILSpy decompilation is not compiling or running donor game code.

## Pin and layout

Install: `~/Library/Application Support/Steam/steamapps/common/RimWorld/`. Main DLL: `RimWorld.app/Contents/MacOS/Assembly-CSharp.dll`. Version: `Version.txt` 1.7.4979 rev109. Expected SHA-256 `a97a01c4319414414c0ca39f3565215e83300dc608dc94b69a27720095b4e751`. Steam build 25947168 supplied by dispatch and matched prior pinned aspect intake; manifest account-owner fields were not copied. This unstable build can drift; verify hash before reuse.

Private work root `~/.codex/research/lib-rimworld-deep/`:

- `extract/Assembly-CSharp.dll`, `Version.txt`, `source/<type>.cs`, `Data/<module>/...xml`, `HASHES.txt`.
- `notes/FULL_DEF_RECORDS.json`: all 14,084 raw Def children with complete XML, row index, path, ID and attributes, including text/conditions.
- `notes/FULL_ENGLISH_TEXT.json`: 8,218 direct LanguageData child records from copied XML only. This narrow parser differs from the prior lane's 8,223 text-row census; it is not a measured loss of dialogue. All input XML is retained; no assertion about effective localized line totals.
- Per-family JSON extracts for nine requested families; `CENSUS.json`, `TYPES.txt`, `SOURCE_ANCHORS.json`, `EXTRACTION_SUMMARY.json`, `DECODED_FLOWS.md` and command/result logs.
- `tools/extract.py`, `supplement.py`, `followup.py`, `final_export.py`, `dark_study.py`, `write_reports.py`, `capture_xml.py`, `validate.py`.

Prior work `~/.codex/research/bf-rimworld/` is read-only. Four matching pinned source exports (TickManager, Game, StatWorker, IncidentQueue) were copied into this lane for reference; the whole type index was copied for lookup. Prior reports remain evidence of their bounded routes, not a fresh whole-game read.

## Commands that worked

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --disable-updatecheck -r "$HOME/Library/Application Support/Steam/steamapps/common/RimWorld/RimWorld.app/Contents/MacOS" -t RimWorld.PregnancyUtility "$HOME/.codex/research/lib-rimworld-deep/extract/Assembly-CSharp.dll"
python3 -I "$HOME/.codex/research/lib-rimworld-deep/tools/extract.py"
python3 -I "$HOME/.codex/research/lib-rimworld-deep/tools/supplement.py"
python3 -I "$HOME/.codex/research/lib-rimworld-deep/tools/followup.py"
python3 -I "$HOME/.codex/research/lib-rimworld-deep/tools/final_export.py"
python3 -I "$HOME/.codex/research/lib-rimworld-deep/tools/dark_study.py"
python3 -I "$HOME/.codex/research/lib-rimworld-deep/tools/capture_xml.py"
python3 -I "$HOME/.codex/research/lib-rimworld-deep/tools/write_reports.py"
python3 -I "$HOME/.codex/research/lib-rimworld-deep/tools/validate.py"
```

Scripts use at most four concurrent CLI subprocesses, no subagents. Re-running extraction overwrites only lane-private files; report generation only writes this authorized repo output tree. Hash verification belongs before use of a new unstable build. Use fully qualified type names from `notes/TYPES.txt` rather than guessing namespaces.

## Dead ends and corrections

9 failed type guesses returned exit 65 and empty output: RimWorld.GeneDef, RimWorld.ResearchProjectDef, RimWorld.RecipeWorker, RimWorld.RecipeWorker_Butcher, RimWorld.RecipeWorkerCounter, RimWorld.StatPart_Ideo, RimWorld.Planet.OrbitLayer, RimWorld.VacuumUtility, RimWorld.Toils_Recipe. GeneDef, ResearchProjectDef, RecipeWorker and RecipeWorkerCounter were corrected to Verse; Toils_Recipe to Verse.AI; VacuumUtility to Verse; OrbitLayer to RimWorld. Butchery is a GenRecipe special-product path rather than the guessed RecipeWorker_Butcher; ideology stat reading is in StatWorker rather than the guessed StatPart_Ideo. Failed empty files are unused as evidence. Requested nested-world doc path resolved under docs/gm/dispatch. Initial filename glob CLASSES* was absent; prior index is TYPES.txt. No fetch failures or acquisition retries.

## Measured source scope

72 successful targeted exports plus four copied prior source exports. 1763 extracted files hashed. All six modules' XML retained; zero XML parse failures. Do not equate successful export, raw table count or field declaration with native execution, complete consumer coverage or effective DLC activation. Read anchors name important methods; exports also contain unread neighboring bodies. No personal save/config or effective DLC activation was inspected.
