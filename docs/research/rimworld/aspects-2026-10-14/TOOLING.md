# Reproduce bf-rimworld

## Input identity and route

Steam manifest: `~/Library/Application Support/Steam/steamapps/appmanifest_294100.acf`, discovered by matching its name field to RimWorld. Selected nonprivate fields: appid 294100, StateFlags 4, installdir RimWorld, buildid/TargetBuildID 25947168, branch unstable. Do not copy account-owner fields into reports. Payload: `~/Library/Application Support/Steam/steamapps/common/RimWorld/`. Version.txt: 1.7.4979 rev109. Main managed file: `RimWorld.app/Contents/MacOS/Assembly-CSharp.dll`, SHA-256 `a97a01c4319414414c0ca39f3565215e83300dc608dc94b69a27720095b4e751`.

Prior root INTAKE.json gives 1.6.4871 rev573 and assembly hash `3e6dff19784a4c6e8e8d03e28e415ab6f39a583546c54c3584858854d681d050`; no prior Steam build ID exists. Current version and assembly changed. Filename rev588 belongs to the earlier DMG. No DMG was mounted in this lane. The same-day feature lane's tooling was read as the prior reusable method; its extract was not modified or treated as current 1.7 evidence.

No installs, repositories, clones, network requests, game launch or Windows executable runs. Existing `~/.dotnet/tools/ilspycmd` 11.1.0.9782 with .NET SDK 10.0.402 was sufficient. No IL2CPP/native disassembly route was needed for the selected managed classes. No commit hashes apply because no source repository was fetched. No mod loader or game code was executed.

## Work layout

`~/.codex/research/bf-rimworld/extract/`: selected DLLs/runtimeconfig, Version.txt, copied installed Data, selected `source/<fully-qualified-type>.cs`, HASHES.txt. `notes/`: full class indexes, definition/text records, decompiler results, read evidence, census and decoded flows. `tools/`: exact extraction and report-generation scripts. Raw files never entered the repo.

`extract.py` copies main input, enumerates classes, decompiles 51 selected types using four concurrent CLI subprocesses, copies all six installed Data modules and parses XML. `supplement.py` copies host/support metadata and exports save/quest helpers. `FINAL_EXTRACTION.json` records six further dialogue/calendar helpers. `HOST_EXPORT.json` records final host exports with correct reference path. No extra agents were spawned.

Mechanical command shape (set TYPE to a required fully qualified type, not all types):

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --disable-updatecheck -l c "$HOME/.codex/research/bf-rimworld/extract/Assembly-CSharp.dll"
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --disable-updatecheck -r "$HOME/Library/Application Support/Steam/steamapps/common/RimWorld/RimWorld.app/Contents/MacOS" -t "$TYPE" "$HOME/.codex/research/bf-rimworld/extract/Assembly-CSharp.dll"
python3 -I "$HOME/.codex/research/bf-rimworld/tools/extract.py"
python3 -I "$HOME/.codex/research/bf-rimworld/tools/supplement.py"
python3 -I "$HOME/.codex/research/bf-rimworld/tools/write_reports.py"
python3 -I "$HOME/.codex/research/bf-rimworld/tools/validate.py"
```

For host types use extract/RimWorld.dll with RimWorldWaylith.Program or Bootstrap and the same installed reference directory. Final commands are saved as HOST_EXPORT.json; the initial host export lacked -r. Reruns should compare the installed DLL hash first; a changed unstable build needs its own snapshot. Running these scripts overwrites lane-private outputs and regenerates this lane's reports only. They do not launch RimWorld.

## Full private detail retained

FULL_DEF_RECORDS.json: all 14,084 raw Def children with complete XML, source path, row, defName and attributes. This includes embedded dialogue/quest prose, worker types and conditions. FULL_ENGLISH_TEXT.json: 8,223 supplied English direct-child rows with IDs, full text and source paths. Data retains complete source XML, including patches and non-Def documents. No XML parse failure among 1,676 files. Counts are raw and unresolved; they do not certify activation, inheritance resolution or gameplay correctness. READ_EVIDENCE.json and DECODED_FLOWS.md preserve the studied routes. HASHES.txt fingerprints every extract file except itself; validation recomputes each hash.

## Dead ends and qualifications

Root COVERAGE.md/INTAKE.md/TOOLING.md do not exist. Read COVERAGE.json/INTAKE.json and the feature-pass TOOLING.md instead. Initial class census listed only classes, so GrammarRequest (a struct) was missing; direct type export succeeds. Initial namespace guesses Verse.SignalManager and RimWorld.RulePackDef were corrected to RimWorld.SignalManager and Verse.RulePackDef. Supplemental RimWorld.LetterStack and Verse.Dialog_NodeTreeWithFactionInfo failed with exit 65, then corrected to Verse.LetterStack and RimWorld.Dialog_NodeTreeWithFactionInfo. Failed empty outputs are private and unused.

The first host exports had missing-reference IL diagnostics because -r was omitted. Both were re-exported with installed dependencies, exit 0 and empty stderr; final diagnostic scan is in VALIDATION.json. Successful export does not prove compilation or runtime equivalence. Most gameplay classes, rendering internals, converter bodies and DLC consumers were deliberately not decompiled. No actual save file was opened, created through game code, imported or fault-injected.

Final readback: the first validator found its own VALIDATION.json link before creating that file. File creation resolved the link; a focused output-link/JSON readback passed. The 2,676 successful hash checks were retained without repeating unchanged extraction checks.
