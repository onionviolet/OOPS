# NetHack: tooling and provenance, 2026-10-14

Work area: `/Users/weiwei/.codex/research/bf-roguelike-src/`. Acquisition used official upstream Git, shallow clones in separate empty directories. No third-party code or build scripts ran. Installs: **none**. Games installed/built/launched: **none**. User saves, Steam, CrossOver and account state: untouched. No failed network fetch occurred and no fetch was retried. The known KeeperRL checkout case collision is a source-filesystem qualification, not a failed network fetch.

## NetHack

Repository: [https://github.com/NetHack/NetHack.git](https://github.com/NetHack/NetHack). Pin: `49b203ed83334c8a0f05024212f98675e51432cb`. Tree: `257f2f35d63d9b43bdec43c854038be2d1e5b6b4`. Commit metadata: `2026-10-12T17:45:52+03:00 Make probing reveal egg type in inventory`. Tracked paths: 1383.

Commands that worked:

```sh
git clone --depth 1 https://github.com/NetHack/NetHack.git /Users/weiwei/.codex/research/bf-roguelike-src/repos/nethack
git -C /Users/weiwei/.codex/research/bf-roguelike-src/repos/nethack rev-parse HEAD
git -C /Users/weiwei/.codex/research/bf-roguelike-src/repos/nethack ls-tree -r HEAD
```

For a later rerun, default HEAD can move. Fetch the recorded commit into a new empty directory instead:

```sh
git init /new/empty/nethack
git -C /new/empty/nethack remote add origin https://github.com/NetHack/NetHack.git
git -C /new/empty/nethack fetch --depth 1 origin 49b203ed83334c8a0f05024212f98675e51432cb
git -C /new/empty/nethack checkout --detach FETCH_HEAD
```

The pin-specific fetch recipe is a reproducibility instruction, not a command claimed run during this pass. [SOURCE_INDEX.json](SOURCE_INDEX.json) records reviewed spans and full-file SHA-256. Private extracts carry full data/text for the selected routes and `extract/HASHES.txt`; the clone preserves the complete source pin.

Prior requested CHECKPOINT, COVERAGE and TOOLING are absent. REPORT, SOURCE.json and FOLLOWUP_SOURCE.md supplied prior provenance. No old private work area was modified. README identifies this pin as 5.0.1 work-in-progress, not a stable release. NetHack license is in `dat/license`; it is not relabeled GPL-2 or MIT.

## Reading and artifact tools

Used pre-existing `git`, `rg`, `sed`, `python3 -I`, SHA-256 via Python hashlib, and primary GitHub repository pages for route verification. Source path discovery corrected nonexistent guessed names: DDA uses `src/init.cpp`, `src/gamemode_tutorial.cpp` and dialogue in `src/npctalk.cpp`; DCSS saves are in `files.cc` and time processing in `main.cc`/`timed-effects.cc`; KeeperRL compression aliases are in `parse_game.h`. NetHack has no requested dat/hint* file at this pin. These were local path-discovery dead ends, not failed fetches or missing-game claims.

Private mechanical artifact writer/census: `tools/build_reports.py`. It reads only pinned sources and writes only the three assigned repo folders plus its work area. Invocation: `python3 -I /Users/weiwei/.codex/research/bf-roguelike-src/tools/build_reports.py`. Source read used bounded `sed` spans and `rg` symbol discovery; ASPECTS source references identify the semantic slice. No package dependency was installed.
