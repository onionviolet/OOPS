# Tooling and reuse

## Identity

| Item | Result |
| --- | --- |
| Supplied DMG | `~/Downloads/rimworld_enUS_1_6_4871_rev588_.dmg` |
| DMG SHA-256 | `c261ffc4d3c963c1d47157943deab6a9f4378aacbe24b4caac6aace38affd529` |
| DLL SHA-256 | `3e6dff19784a4c6e8e8d03e28e415ab6f39a583546c54c3584858854d681d050` |
| Payload Version.txt | `1.6.4871 rev573`; filename says rev588 |
| Export tool | Existing `~/.dotnet/tools/ilspycmd` 11.1.0.9782, matching decompiler version |
| Export | Exit 0, stdout/stderr empty, 9,213 C# files |
| Extract | 1,990 copied files before HASHES.txt; Managed dependencies plus full supplied Data folders |
| Modules | Core, Royalty, Biotech, Ideology, Anomaly, Odyssey |
| Raw XML index | 13,809 Def nodes across 252 tags; 8,210 English rows; zero XML parse failures |

No repositories cloned, installs performed, game launched, installer scripts executed or user saves accessed. No git add/commit/push. The assembly matches the prior dossier, but the supplied DLC Data expands prior Core-only scope. Raw node counts include abstract/duplicate/patch-sensitive records and do not resolve inheritance or runtime activation.

## Commands that worked

```sh
mkdir -p ~/.codex/research/fs-rimworld-features/mnt
hdiutil attach -readonly -nobrowse -mountpoint ~/.codex/research/fs-rimworld-features/mnt ~/Downloads/rimworld_enUS_1_6_4871_rev588_.dmg
pkgutil --expand-full <mounted-package.pkg> <new-work-area-package-directory>
hdiutil detach ~/.codex/research/fs-rimworld-features/mnt
DOTNET_ROOT="$HOME/.dotnet" PATH="$HOME/.dotnet:$HOME/.dotnet/tools:$PATH" ilspycmd -p -o ~/.codex/research/fs-rimworld-features/decompiled ~/.codex/research/fs-rimworld-features/extract/Managed/Assembly-CSharp.dll
```

Expand all six packages into separate new directories under the work area. Payloads are under `package.pkg/Scripts/payload/`; despite the folder name, pkgutil only unpacked these. Copy each `payload/Data` into `extract/Data`, and copy the base `Contents/Resources/Data/Managed` into `extract/Managed`. Copy Version.txt too. No script was invoked. The private writer/extraction records in `notes/` show executed Python indexing and report assembly. `extract/HASHES.txt` hashes each copied file relative to extract; it excludes itself.

## Reusable handoff to bf-rimworld

Keep `~/.codex/research/fs-rimworld-features/extract/` intact, with `HASHES.txt`. The private export is `decompiled/`; dependencies remain in Managed. `notes/FULL_DEF_RECORDS.json` preserves every raw Def node with module, path, row, ID and XML. `notes/FULL_ENGLISH_TEXT.json` preserves complete supplied English keyed/injected text with IDs and paths. `notes/DEF_COUNTS.json`, `notes/XML_PARSE_ERRORS.json` and `notes/READ_EVIDENCE.json` support indexing and bounded reread. Decoded flow notes are `notes/DECODED_FEATURE_FLOWS.md`. These are raw records, not a resolved mod database.

The prompt's only writable repo directory is this output dir. Accordingly private raw details stay in the allowed work area, rather than writing the separately suggested `docs/research/rimworld/private/fs-rimworld-features/`. The other lane’s top-level `aspects-2026-10-14/` remains untouched. No claim about the current Steam install is made here.

## Dead ends and limits

The prior ILSpy export was gone, as supplied in intake; this route reconstructs it. hdiutil printed deprecation warnings but succeeded and the volume was detached. Early searches for `Gene_BodyType`, `Gene_HeadType`, `JobDriver_Teach` and `CompUseEffect_ApplyTechPrint` found no matching classes; body/head updates live in Pawn_GeneTracker, teaching in Lessongiving and techprint application in its job driver. Initial namespace guesses for Gene/melee were corrected to Verse.Gene and RimWorld.Verb_MeleeAttackDamage. No web fetch was needed: the owned local payload supplied primary evidence. No recovered-project compile, effective XML load or runtime test performed.
