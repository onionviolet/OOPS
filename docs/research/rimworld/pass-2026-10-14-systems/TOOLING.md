# Reproduce ds-rimworld

No installs, downloads, clones, network requests, subagents, native app control, game launch, game content loader, Windows executable, save/profile/config access or recovered-code compilation. Existing Python standard library, ILSpy 11.1 and local .NET 10 SDK sufficed. Tools run on macOS for static extraction only. No repository commit applies to a fetched source.

## Pins and read-only inputs

Current install: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/RimWorld/`. Gameplay assembly: `RimWorld.app/Contents/MacOS/Assembly-CSharp.dll`. Version.txt: `1.7.4979 rev109`. Independently verified SHA-256: `a97a01c4319414414c0ca39f3565215e83300dc608dc94b69a27720095b4e751`. Steam build 25947168 is inherited from bf-rimworld's manifest finding, not independently re-read here. The pinned DLL matches both earlier 1.7 work areas.

Reused read-only: `~/.codex/research/bf-rimworld/` and `~/.codex/research/lib-rimworld-deep/`. Earlier 1.6 reports and all three existing system inventories retain their own version limits. Every pre-existing RimWorld dossier file was captured in private `notes/PRIOR_INPUTS.json` before new source work: 53 text/JSON files, preserving exact old wording. Current PROJECT top 80, relevant USER_VISION, world-kit/current successor, all P01-P25 packet owner rows and relevant body/technology/companions/chain topic owners supplied routing. A memory-registry search had no relevant hit.

## Private work layout

Root: `/Users/weiwei/.codex/research/ds-rimworld/`.

| Path | Contents |
|---|---|
| extract/Assembly-CSharp.dll, Version.txt | Independently pinned local assembly/version copy |
| extract/source/ | 68 successful nonempty targeted type exports; one failed empty guessed type is excluded from evidence |
| extract/Data/ | 243 full XML source files for selected families, copied read-only from the pinned earlier extract |
| extract/HASHES.txt | SHA-256 for each retained extract file other than this manifest |
| notes/FULL_DEF_RECORDS.json | All 14,084 complete raw Def records, IDs, paths, attributes, conditions/text/XML, copied from lib-rimworld-deep |
| notes/FULL_ENGLISH_TEXT.json | The earlier lane's complete 8,218-row direct-child English index; underlying prior XML remains there. This is not a fresh text census or effective line count |
| notes/SELECTED_DEF_RECORDS.json | 1,178 complete raw records for twenty selected authoring families |
| notes/TYPES.txt, SOURCE_ANCHORS.json | Prior full type index plus new source method signatures/line numbers |
| notes/EXPORT.json, SUPPLEMENT.json, TRAINING_EXPORT.json | Full commands, exit codes, stderr, byte sizes |
| notes/SYSTEM_RECORDS.json, DECODED_FLOWS.md | New detailed system analysis and decoded state/rule/save flows |
| notes/PRIOR_UNREAD_ROWS.json | All 42 prior unread/open table rows, original wording/provenance plus disposition |
| notes/REFERENCE_HASHES.json | Provenance hashes for raw indexes and retained prior dossier snapshot |
| tools/ | Extraction, reference preparation, report/map generation and validation scripts |

Full prior bf-rimworld English index has 8,223 rows; lib-rimworld-deep has 8,218 under its narrower extraction. That previously documented parser difference is not reclassified as lost dialogue. No additional dialogue acquisition was needed for these new routes. Raw code, tables and prose remain private; repo artifacts contain paraphrases, short identifiers and selected numeric rules only.

## Commands that worked

```sh
DOTNET_ROOT="$HOME/.dotnet" "$HOME/.dotnet/tools/ilspycmd" --disable-updatecheck -r "$HOME/Library/Application Support/Steam/steamapps/common/RimWorld/RimWorld.app/Contents/MacOS" -t Verse.ImmunityRecord "$HOME/.codex/research/ds-rimworld/extract/Assembly-CSharp.dll"
python3 -I "$HOME/.codex/research/ds-rimworld/tools/export.py"
python3 -I "$HOME/.codex/research/ds-rimworld/tools/supplement.py"
python3 -I "$HOME/.codex/research/ds-rimworld/tools/training.py"
python3 -I "$HOME/.codex/research/ds-rimworld/tools/prepare_reference.py"
python3 -I "$HOME/.codex/research/ds-rimworld/tools/write_systems.py"
python3 -I "$HOME/.codex/research/ds-rimworld/tools/map_inventory.py"
python3 -I "$HOME/.codex/research/ds-rimworld/tools/write_reports.py"
python3 -I "$HOME/.codex/research/ds-rimworld/tools/validate.py"
```

Export scripts use at most four independent CLI subprocesses, no agents. They write only this private work root. Report scripts write only the authorized `docs/research/rimworld/pass-2026-10-14-systems/` directory. Script replay can overwrite this lane's own generated outputs; preserve manual additions before rerunning. Validation hashes retained extracts and checks artifacts; it does not execute donor code or prove gameplay.

## Dead ends and corrections

One guessed `RimWorld.InteractionWorker_Train` returned exit 65, empty output and a type-not-found diagnostic. The type index locates JobDriver_Train/WorkGiver_Train instead. No speculative second type guess was run; The exact indexed WorkGiver_Train, JobDriver_Train and Toils_Interpersonal were then exported successfully. S06 includes their admission/chance/attempt timing; base animal-interaction costs and bond helper modifiers remain unread. All other 68 exports returned exit 0 with empty stderr. No missing file is cited as positive evidence.

An initial inventory parser counted only names ending in Def and omitted seventeen derived PsychicRitual Def tags. The parser was corrected to retain Def subclasses, then checked against all 254 raw census tags. A table header was also removed and namespace routing separated from broad string matching. These were intermediate report-generation errors, not source findings. Final validation checks exact family coverage.

Private/raw preservation is in the explicitly authorized work root, because the prompt allows writes to only the named report directory inside the repo. No `docs/research/rimworld/private/` write, main-source edit, staging, commit or push occurred. Current CHECKPOINT gives measured disk use and all unread gates.
