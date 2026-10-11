# Disco Elysium intake

Section E of the [Steam-library assignment](../../gm/dispatch/steam-library-wave-2026-10-10/ASSIGNMENT.md). Completed targeted pass. Only this game's research folders are owned by this session.

I1 **Seen in data or code:** Steam app 632470, macOS build 23980936. At 02:20:22 EDT on 2026-10-10, the manifest reports StateFlags 4 and complete download/staging counters. Steam logs record successful commit at 02:10:27. Mounted base depot 632473/3514503533443935223 and soundtrack/artbooklet depot 1173140/5482040944560501642.

I2 **Seen in data or code/text:** the install began incomplete; checks at approximately 02:00 and 02:10 respected the ten-minute cadence. Logs showed priority suspension/resumption, not a disk-space failure. Free space was initially 6.6 GiB and 5.5 GiB at qualification. Preallocation had already occupied approximately 11 GiB, so free space alone did not establish failure.

I3 **Seen in data or code:** install root is `~/Library/Application Support/Steam/steamapps/common/Disco Elysium/`. The app contains IL2CPP `GameAssembly.dylib` with x86_64 and arm64 slices, metadata v27/27.1 and Unity assets version 2020.3.12f1. `build_info.txt`: develop revision 6f8a0e67, dialogue database timestamp 2022-05-20 12:05, internal build 1725995648, StandaloneOSX. These internal identifiers are not substitutes for the Steam build ID.

## Scope and lens

Questions: speaking/checking faculties, researched thoughts, authored failure and the amnesiac start. Read AGENTS.md, PROJECT.md, the accepted rulebook, origins/memory-loss, player-identity and hidden-things-in-text north-star sections, GM refresh instructions and named extraction assignments. Existing project code was inspected before mapping options.

Claims use seen in data or code, seen in text, or inferred. Findings include mismatches with the north star, contradictory inputs and source-visible costs. Historical developer posts establish a described design, not current-build behavior. Packets are inferred original proposals; each world may select different rules. No game ranking or new global restriction is proposed.

## Handling and sources

Read files in place; retained six core useful inputs plus the script-mapping asset, with source/copy SHA-256 verification. Useful private containers and derived text are under `~/.codex/research/disco-elysium/`. No recovered prose/code/art/audio corpus is in repository docs. Free space was checked before the extraction/decompilation phase that could exceed 200 MB; it stayed above the 3 GB stop threshold at those checks. No disk waiting exception was triggered.

Primary web sources: [passive checks](https://discoelysium.com/devblog/2016/09/19/on-skill-checks), [active checks](https://discoelysium.com/devblog/2016/10/06/active-skill-checks), [combat](https://discoelysium.com/devblog/2018/05/03/combat-in-disco-elysium), [Thought Cabinet](https://discoelysium.com/devblog/2019/09/30/introducing-the-thought-cabinet), four official skill-family Steam announcements and the current [Final Cut store page](https://store.steampowered.com/app/632470/Disco_Elysium__The_Final_Cut/). Private developer-news-2019.json and WEB_RECEIPTS.json retain exact snapshots/hashes. Reference-scout skill applied.

No launches, saves/settings, install changes, uninstall, source edits, builds or commits. Existing unrelated changes preserved. [Extraction receipt](EXTRACTION_RECEIPT.md) explains recovery and its limits; [checkpoint](CHECKPOINT.md) records completion.
