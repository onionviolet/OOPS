# Tooling and repeat route

Lane fs-zomboid, 2026-10-14. No game launch, injector, save access, Steam dialog or repo code change. No staging/commit/push. No repository clones; no upstream commit exists for the proprietary installed payload. Identity is Steam build plus byte hashes.

## Identity

App 108600, build 25485521, StateFlags 4, SizeOnDisk 10529753899, staging size 0; downloaded and staged byte totals equal their targets. Installed bytecode `zombie.core.Core` initializes GameVersion 42.21. Root: `~/Library/Application Support/Steam/steamapps/common/ProjectZomboid/Project Zomboid.app/Contents/Java/`.

The source text snapshot has 3685 files, including 1395 Lua files and 1004 files under scripts; compressed archive 41156007 bytes. The full craft-block extraction found 969 blocks, including entity build recipe components. Counts include declared/test content and do not prove menu reachability.

## Tools and installs

CFR **0.152**, downloaded into `~/.codex/research/fs-zomboid/tools/cfr-0.152.jar` from the author's `https://www.benf.org/other/cfr/cfr-0.152.jar`. This is a user-local jar, not a system installation. SHA256 is recorded in `extract/HASHES.txt`.

Existing Homebrew `/opt/homebrew/opt/openjdk@21/bin/java` ran CFR. `/usr/bin/java` failed because no registered Java Runtime was found; the Homebrew path worked. No JDK installed or registration changed. Python standard library only, invoked with `-I`. No pip, brew, cargo or other packages installed.

CFR reconstructed 17 selected class inputs, with nested classes also emitted as applicable. It reports unresolved external types because extraction is deliberately narrow; method/field facts are labelled decompiled evidence. Decompiled text, class files and logs stay outside git in the lane work area. No game code executed: the only Java execution was the decompiler tool.

## Commands that worked

Read manifest with `cat` at `~/Library/Application Support/Steam/steamapps/appmanifest_108600.acf`. Inspect source with `rg`, `sed`, Python `Path.read_text`; inspect jar with `/usr/bin/unzip -l` and Python `zipfile`.

Repeat scripts retained locally:

```sh
python3 -I ~/.codex/research/fs-zomboid/tools/extract.py
python3 -I ~/.codex/research/fs-zomboid/tools/capture.py
```

`extract.py` records selected class inputs under `extract/classes`, then invokes the explicit Java 21 path with CFR and `--outputdir extract/java --silent true`. The three additional inputs were `CraftRecipe`, `LuaManager$GlobalObject` and `EntitySimulation`, extracted via Python zipfile and decompiled by the same invocation. `capture.py` archives `media/lua`, `media/scripts`, `media/radio`, hashes every captured source file and extracts complete balanced craftRecipe blocks with source path/line into the ignored private folder. The full archive is `extract/plain-source.zip`; its hashes and class/decompiled extract hashes are in `extract/HASHES.txt` and `extract/EXTRACT_HASHES.txt`.

These repeat scripts write only the lane work area and the private subsection of this dossier. Do not rerun report generation over a coordinator's later edits without recovering ownership. `write_report.py` and `write_support.py` record this pass's report construction, not authoritative product choices.

## Deep reference map

`extract/plain-source.zip`: all captured Lua, translations, item/recipe/entity data and radio lines. Full recorded-media IDs, ordered text refs and effect codes live at `media/lua/shared/RecordedMedia/recorded_media.lua`; registration and effect predicates are adjacent source files in the same archive. Full broadcast dialogue is `media/radio/RadioData.xml`. Raw prose stays private.

`docs/research/project-zomboid/private/fs-zomboid/craft-recipes-full.json`: all extracted craftRecipe blocks, IDs, source paths and lines. `inventory-counts.json`: every discovered source directory with a file count. `SOURCE_INDEX.json`: class method/source locators. Per-system digests describe flows and preserved contradictions without copying raw content.

## Dead ends and bounded exclusions

One initial inventory command had an unmatched Python parenthesis; corrected immediately, no writes before parse. `SkillBookDefinitions.lua` was not present; `rg` located `server/XpSystem/XPSystem_SkillBook.lua`. An assumed `ISAnimalSkin.lua` name was absent; actual hook action is `ISRemoveLeatherFromAnimal.lua`. No failed remote download occurred and no alternate fetch retries were used.

No web mechanic claims were needed because installed code was available. This pass does not use a wiki version to fill local gaps. Full jar decompilation, native libraries, multiplayer XP transport, global save recovery and all AI systems were deliberately left unread. Runtime UI, time measurement and persistence are untested under the no-launch rule.
