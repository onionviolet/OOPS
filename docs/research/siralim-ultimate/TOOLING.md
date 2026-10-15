# Tool route and mechanical rerun

2026-10-14. Lane `mw-siralim`. No game launch, injector, save read, Steam interaction, system-wide install, stage, commit or push. Repo writes are confined to this dossier. Python runs used `-I`. No shipped Python helper was executed.

## Paths and pins

- Installed app: `~/Library/Application Support/Steam/steamapps/common/Siralim Ultimate/SiralimUltimate.app`. Steam app 1289810, installed manifest build 20548371.
- Work root: `~/.codex/research/mw-siralim/`. Raw material is in `extract/`; scripts in `tools/`; receipts and failed attempts in `notes/`.
- Source hashes: `notes/source-hashes.json`. Archive directory: `extract/archive-index.json`. Private extract hashes: `extract/HASHES.txt`. Native analysis copy identity: `notes/macho-code-identity.json`.
- REA 6.4.0: reused read-only source-built package at `~/.codex/research/hogwarts-legacy/repos/rea-pinned`, source revision `bb540826d65316c164d2de8ba4ef10f81a8ad073`, as documented by that lane's [trial](../hogwarts-legacy/REA_TRIAL.md). Existing compiled launcher patch uses `-noanalysis -max-cpu 2`. No new dependency install.
- Private `repos/rea-bounded` copies the pinned package except dependencies and Git metadata; `node_modules` is a read-only-use symlink to the existing package. Its seed helper restricts disassembly to supplied symbol ranges. For the follow-up, its bridge also sets a 30-second per-function decompile limit instead of the upstream unlimited timeout. The patch/launcher hashes and source diff are in private notes. REA remains Ghidra's interface, not a separate decompiler algorithm.
- Existing Ghidra 12.1.4, Homebrew OpenJDK 21.0.12.1, native `nm`, `lipo`, `strip`, Python and Node were used. No dotnet build was necessary because this is YYC.

## Initial inspection and archive extraction

`file Contents/MacOS/SiralimUltimate` identifies arm64 + x86_64 Mach-O slices. `nm -arch arm64` produces `extract/nm-arm64.txt`. GML names plus no archive CODE chunk establish YYC. GEN8's format byte is 17 but does not establish VM bytecode presence.

Run `python3 -I ~/.codex/research/mw-siralim/tools/archive_index.py` to rebuild STRG, SCPT, OBJT and ROOM indexes and retained raw metadata chunks. It parses the archive header/chunk lengths and absolute string pointers; it does not export textures/audio or execute scripts. First census was made with the same parser inline; the rerunnable version adds boundary assertions.

Run `python3 -I ~/.codex/research/mw-siralim/tools/localization.py` to copy the 24 full CSVs privately and build `localization-index.json` and `localization-census.json`. `csv.DictReader` preserves quoted multiline records and strips the BOM from the header. Counts are logical records, not physical file lines. It explicitly counts empty English cells and unique tags. Full multilingual source files remain available beside the English index.

## Native route

1. `lipo` extracted arm64 to `extract/SiralimUltimate.arm64`. This is a private copy only.
2. `notes/native-targets.json` selects ten named GML functions by actual arm64 symbol addresses; `notes/seeds.tsv` supplies these names to REA. No speculative address from another build is used.
3. `tools/rea_trial.py` opens the thin copy using local MCP, then requests `batch_decompile`. The default 120-second startup limit expired during Mach-O import. The returned envelope records `provider_timeout` for all ten items despite tool-level success. `notes/rea-native.json` is failure evidence, not ten recovered functions.
4. A private `strip -x -S` copy, `SiralimUltimate.analysis.arm64`, reduced symbol-import cost. `tools/macho_verify.py` verifies all twelve `__TEXT` sections retain identical addresses, sizes, offsets and bytes. Signature invalidation is confined to the analysis copy, which is never run.
5. `tools/rea_stripped.py` extended startup to 600 seconds. Import completed, but the upstream seed helper's unbounded disassembly expanded beyond the chosen functions. A thread snapshot identified `ReaGhidraApplySeeds.decoded` as the active work. The lane-owned runner was stopped; this is not a completed decompilation.
6. `tools/rea_bounded.py` uses the private bounded helper and same named targets. `notes/function-ranges.tsv` gives each target's original symbol start and the next text symbol minus one. The helper uses a restricted AddressSet with flow following inside it. The first bounded patch left an unreachable Java return and failed compilation; that attempt is retained under `notes/rea-bounded-compile-failure-*`. The corrected helper removes it. Results and limits are recorded in NATIVE_TRACE. A six-function follow-up targets semantic fusion, depth, biome identity and save-object events. Its first attempt exposed an unlimited native-decompile timeout on a large method and was stopped; the private bridge was corrected to a 30-second limit per function before the final request. Do not infer success from MCP `status: ok`; inspect every item and decompiler completion.

The dot-free `/tmp/mw-siralim-rea-20261014` symlink points into the work root's `tools/rea-temp`. Ghidra creates its own transient project there. No user foreground UI is touched. Reusing the modified copy changes the evidence hash, so `notes/macho-code-identity.json` is required alongside the original executable hash. A changed build must regenerate symbols/ranges rather than reuse offsets.

## Fetch route and dead ends

UndertaleModTool source clone from `https://github.com/UnderminersTeam/UndertaleModTool.git` failed once: curl 18, early EOF, invalid index-pack. No clone retry. The route changed to the already-installed native analysis stack, which the source format requires anyway. Its [official README](https://github.com/UnderminersTeam/UndertaleModTool) documents the VM CLI; no VM code exists here to dump, so no CLI build or install was claimed.

Public corroboration used the [Steam page](https://store.steampowered.com/app/1289810/Siralim_Ultimate/) and [official 2.0 patch notes](https://www.thylacinestudios.com/blog/siralim-ultimate-2-0-patch-notes). The latter is dated 2025-04-22 and originally described a Windows test rollout, so it is not a declaration of the installed Mac revision. Local CSVs and executable pins own build-specific statements. Community search results only supplied a threshold discrepancy, not a verified technical formula. No wiki was crawled or retried.

## Verification and limits

Dossier checks parse JSON, enforce A01-A12 keys/statuses, count small-touch IDs, resolve relative Markdown files, check proposal/SHOWN/STATED boundaries, inspect own-file text for em dashes and regenerate private hashes. No YAIRPG build/test/browser gate is claimed. No source-game native play gate is possible under the no-launch rule. CHECKPOINT owns the final unread table.
