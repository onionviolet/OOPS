# Reproduction and tooling

Execution: 2026-10-15. Lane work area `~/.codex/research/bf-caves-of-qud/`. All source-game reads were static. No game, installer script, injector, Windows executable, save reader or platform client API was run. No tools were installed, no repo cloned, no network fetch performed. Tool repo commits: not applicable; packaged ILSpy version is pinned below. Existing unrelated dirty files were not edited or staged.

## Intake route

Python globbed `~/Library/Application Support/Steam/steamapps/appmanifest_*.acf` and selected the case-insensitive name Caves of Qud, rather than guessing a directory. App 333640 has installdir Caves of Qud, StateFlags 4, build 25520692, downloaded bytes 946541120 of 946541120 and staged bytes 1372793063 of 1372793063. These are manifest reports, not a launch/health test. Private `notes/intake.json` retains task-relevant fields without the manifest's account owner ID.

Managed input:

`~/Library/Application Support/Steam/steamapps/common/Caves of Qud/CoQ.app/Contents/Resources/Data/Managed/Assembly-CSharp.dll`

Base data is sibling `../StreamingAssets/Base/` under Data. A copy of the main DLL and selected textual data resides in `extract/`, original bytes unchanged. SHA-256 is `2cc28fba5a86221e27bfdcaa5f5a91a2e249fd474814dce7cff25a9a649b8589`. Matching prior INTAKE.json makes the prior version 2.0.211.56 applicable to the exact same bytes. Prior intake has no Steam build ID: report build-ID change as unknown, never as unchanged based on assembly hash alone.

DLC text is separately under installation sibling `CoQ_Data/StreamingAssets/DLC/PetsPack1/`. Its 43-file inventory is in `notes/dlc-inventory.json`; only XML/JSON copied. Twelve conversation directories were found; manifest states 13 pets. No entitlement/load-path assumption was made.

## Commands and retained scripts

Existing .NET SDK **10.0.402**, ilspycmd and ICSharpCode.Decompiler **11.1.0.9782**. Set `DOTNET_ROOT="$HOME/.dotnet"`; prepend `$HOME/.dotnet` to PATH so the tool host resolves its runtime. The tool is `$HOME/.dotnet/tools/ilspycmd`. The old dossier used 9.1; the re-pass already used 11.1. Generated line numbers from different exports are not interchangeable.

Commands that worked, with shell variables used only as paths:

```sh
export DOTNET_ROOT="$HOME/.dotnet"
export PATH="$HOME/.dotnet:$HOME/.dotnet/tools:$PATH"
qud_dll="$HOME/Library/Application Support/Steam/steamapps/common/Caves of Qud/CoQ.app/Contents/Resources/Data/Managed/Assembly-CSharp.dll"
qud_work="$HOME/.codex/research/bf-caves-of-qud"
ilspycmd --disable-updatecheck -l c "$qud_dll" > "$qud_work/extract/types.txt"
ilspycmd --disable-updatecheck -t XRL.XRLGame "$qud_dll" > "$qud_work/extract/XRL.XRLGame.cs"
python3 -I "$qud_work/tools/extract.py"
python3 -I "$qud_work/tools/extract-more.py"
python3 -I "$qud_work/tools/catalog.py"
```

The retained extraction scripts declare the precise type lists and use three concurrent CLI processes, not delegated agents. 37 initial types plus nine successful additional types and one corrected Sifrah type give **47 nonempty valid type exports**. Full classes are retained for reading context, but `notes/READING_LEDGER.json` distinguishes actually inspected windows from navigation-only captures. No recovered class was compiled or executed.

`extract/Base/` retains full textual files; `extract/trees/` retains complete XML structure, attributes, text and ordering as derived JSON. `notes/table-counts.json` records all 44 XML files and tag/attribute counts; no parse failures remained. Numeric control references illegal in XML 1.0 were removed only from in-memory derived parse input: Books 13, Manual 6, Creatures 6, Furniture 1, Items 10. Original bytes are retained and hashed. This normalization is not Qud's runtime XML parser and cannot prove that it bakes successfully. All 5,205 object declarations were counted, not instantiated. The class index has 5,203 non-nested classes in 144 namespaces, not the historical 5,437 exported-file count.

## Dead ends and qualifications

- Requested root CHECKPOINT.md, COVERAGE.md and TOOLING.md do not exist. The first read surfaced that absence. Existing equivalents are root INTAKE.json/VALIDATION.json and re-pass CHECKPOINT.md/COVERAGE.json/REPORT.md. No missing-file contents invented.
- `XRL.World.SifrahGame` was a wrong guessed type name and exited 65. The diagnostic identified `XRL.SifrahGame`; corrected export succeeded. The empty failed file is retained only as a failure receipt, never semantic evidence. `notes/export-results-2.json` preserves the failure.
- The initial private XML catalog helper contained a Python conditional-expression syntax error. It was fixed before successful catalog execution; it never wrote a partial tree. Original game data was untouched.
- Source review corrected a guessed trade method locator to the actual `TradeScreen.UpdateTotals` before publication.
- Decompiled LoadGame has a suspicious collapsed gzip conditional. Main save writes gzip, but legacy uncompressed loading is not accepted evidence without an IL comparison.
- Steam installation state, compiled method presence, declared XML rows, visible UI and native behavior are distinct evidence layers. The Sifrah Installed flag and DLC file presence do not establish activation.

## Private receipts and rerun order

`notes/intake.json`, `notes/export-results.json`, `notes/export-results-2.json`, `notes/READING_LEDGER.json`, `notes/table-counts.json`, `notes/namespaces.json`, `notes/parse-errors.json`, `notes/dlc-inventory.json` and `notes/VALIDATION.json` record provenance and scope. `extract/HASHES.txt` fingerprints every other file in extract, with relative paths. Verify hashes first. Re-run targeted extraction only if installed input or tool changed; re-run catalog only if data changed. Reports link prior/newer semantic audits with their limits, without copying their raw source.

The authoritative done state and unread backlog are in CHECKPOINT.md. No commit, push, source edit, UI build or native test was performed.
