# KeeperRL: tooling and provenance, 2026-10-14

Work area: `/Users/weiwei/.codex/research/bf-roguelike-src/`. Acquisition used official upstream Git, shallow clones in separate empty directories. No third-party code or build scripts ran. Installs: **none**. Games installed/built/launched: **none**. User saves, Steam, CrossOver and account state: untouched. No failed network fetch occurred and no fetch was retried. The known KeeperRL checkout case collision is a source-filesystem qualification, not a failed network fetch.

## KeeperRL

Repository: [https://github.com/miki151/keeperrl.git](https://github.com/miki151/keeperrl). Pin: `95d2be4e97db2243210a71918e36a533ad94dcd1`. Tree: `7a7578b9c7ecd7bce7e292cc7d4a23b38d8cb538`. Commit metadata: `2025-10-27T20:49:58+01:00 Add witch adventurer`. Tracked paths: 939.

Commands that worked:

```sh
git clone --depth 1 https://github.com/miki151/keeperrl.git /Users/weiwei/.codex/research/bf-roguelike-src/repos/keeperrl
git -C /Users/weiwei/.codex/research/bf-roguelike-src/repos/keeperrl rev-parse HEAD
git -C /Users/weiwei/.codex/research/bf-roguelike-src/repos/keeperrl ls-tree -r HEAD
```

For a later rerun, default HEAD can move. Fetch the recorded commit into a new empty directory instead:

```sh
git init /new/empty/keeperrl
git -C /new/empty/keeperrl remote add origin https://github.com/miki151/keeperrl.git
git -C /new/empty/keeperrl fetch --depth 1 origin 95d2be4e97db2243210a71918e36a533ad94dcd1
git -C /new/empty/keeperrl checkout --detach FETCH_HEAD
```

The pin-specific fetch recipe is a reproducibility instruction, not a command claimed run during this pass. [SOURCE_INDEX.json](SOURCE_INDEX.json) records reviewed spans and full-file SHA-256. Private extracts carry full data/text for the selected routes and `extract/HASHES.txt`; the clone preserves the complete source pin.

Prior TOOLING.md is absent; INTAKE.json and COVERAGE.json were read. Clone warns that `cmake/FindOGG.cmake` and `cmake/FindOgg.cmake` collide on this filesystem. Those are the same blob in this pin; the private Git-tree manifest preserves both names. No build correctness is claimed. The inspected gameplay paths do not collide. GPL source/free-media/commercial-media distinctions remain as documented in the prior INTAKE; excluded commercial graphics/music were not acquired.

## Reading and artifact tools

Used pre-existing `git`, `rg`, `sed`, `python3 -I`, SHA-256 via Python hashlib, and primary GitHub repository pages for route verification. Source path discovery corrected nonexistent guessed names: DDA uses `src/init.cpp`, `src/gamemode_tutorial.cpp` and dialogue in `src/npctalk.cpp`; DCSS saves are in `files.cc` and time processing in `main.cc`/`timed-effects.cc`; KeeperRL compression aliases are in `parse_game.h`. NetHack has no requested dat/hint* file at this pin. These were local path-discovery dead ends, not failed fetches or missing-game claims.

Private mechanical artifact writer/census: `tools/build_reports.py`. It reads only pinned sources and writes only the three assigned repo folders plus its work area. Invocation: `python3 -I /Users/weiwei/.codex/research/bf-roguelike-src/tools/build_reports.py`. Source read used bounded `sed` spans and `rg` symbol discovery; ASPECTS source references identify the semantic slice. No package dependency was installed.
