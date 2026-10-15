# Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: tooling and provenance, 2026-10-14

Work area: `/Users/weiwei/.codex/research/bf-roguelike-src/`. Acquisition used official upstream Git, shallow clones in separate empty directories. No third-party code or build scripts ran. Installs: **none**. Games installed/built/launched: **none**. User saves, Steam, CrossOver and account state: untouched. No failed network fetch occurred and no fetch was retried. The known KeeperRL checkout case collision is a source-filesystem qualification, not a failed network fetch.

## Dungeon Crawl Stone Soup

Repository: [https://github.com/crawl/crawl.git](https://github.com/crawl/crawl). Pin: `c4298273a49c6601be4e1c9b79d4aba43f9aa603`. Tree: `dcc678a6d7f0378ef96ea4ee6f6549c738a7c5f8`. Commit metadata: `2026-10-14T18:57:31-02:30 Add a function to check a player's primary form since a given XL`. Tracked paths: 11505.

Commands that worked:

```sh
git clone --depth 1 https://github.com/crawl/crawl.git /Users/weiwei/.codex/research/bf-roguelike-src/repos/crawl
git -C /Users/weiwei/.codex/research/bf-roguelike-src/repos/crawl rev-parse HEAD
git -C /Users/weiwei/.codex/research/bf-roguelike-src/repos/crawl ls-tree -r HEAD
```

For a later rerun, default HEAD can move. Fetch the recorded commit into a new empty directory instead:

```sh
git init /new/empty/crawl
git -C /new/empty/crawl remote add origin https://github.com/crawl/crawl.git
git -C /new/empty/crawl fetch --depth 1 origin c4298273a49c6601be4e1c9b79d4aba43f9aa603
git -C /new/empty/crawl checkout --detach FETCH_HEAD
```

The pin-specific fetch recipe is a reproducibility instruction, not a command claimed run during this pass. [SOURCE_INDEX.json](SOURCE_INDEX.json) records reviewed spans and full-file SHA-256. Private extracts carry full data/text for the selected routes and `extract/HASHES.txt`; the clone preserves the complete source pin.

Prior COVERAGE and TOOLING files are absent; REPORT, CHECKPOINT and structured FINDINGS supply selected coverage and repo pins. No installed binary or release version was matched. `LICENSE` preserves upstream licensing and exceptions.

## Cataclysm: Dark Days Ahead

Repository: [https://github.com/CleverRaven/Cataclysm-DDA.git](https://github.com/CleverRaven/Cataclysm-DDA). Pin: `ef31b1fc84c640f97a5547a5b76a6ba5e9e97847`. Tree: `0498596292d79e59d0b0a23e2ce86e148abdc1dd`. Commit metadata: `2026-10-14T19:31:16+02:00 Balthazar bunker bunker update EOC fixes (#89070)`. Tracked paths: 10429.

Commands that worked:

```sh
git clone --depth 1 https://github.com/CleverRaven/Cataclysm-DDA.git /Users/weiwei/.codex/research/bf-roguelike-src/repos/cdda
git -C /Users/weiwei/.codex/research/bf-roguelike-src/repos/cdda rev-parse HEAD
git -C /Users/weiwei/.codex/research/bf-roguelike-src/repos/cdda ls-tree -r HEAD
```

For a later rerun, default HEAD can move. Fetch the recorded commit into a new empty directory instead:

```sh
git init /new/empty/cdda
git -C /new/empty/cdda remote add origin https://github.com/CleverRaven/Cataclysm-DDA.git
git -C /new/empty/cdda fetch --depth 1 origin ef31b1fc84c640f97a5547a5b76a6ba5e9e97847
git -C /new/empty/cdda checkout --detach FETCH_HEAD
```

The pin-specific fetch recipe is a reproducibility instruction, not a command claimed run during this pass. [SOURCE_INDEX.json](SOURCE_INDEX.json) records reviewed spans and full-file SHA-256. Private extracts carry full data/text for the selected routes and `extract/HASHES.txt`; the clone preserves the complete source pin.

DCSS and DDA share this output folder, but every source reference, count and proposal is marked per game. No standalone DDA tooling file existed in the prior grouped dossier. `LICENSE.txt` and component notices stay in the clone. Base JSON census excludes optional mods, whose directories remain inventoried.

## Reading and artifact tools

Used pre-existing `git`, `rg`, `sed`, `python3 -I`, SHA-256 via Python hashlib, and primary GitHub repository pages for route verification. Source path discovery corrected nonexistent guessed names: DDA uses `src/init.cpp`, `src/gamemode_tutorial.cpp` and dialogue in `src/npctalk.cpp`; DCSS saves are in `files.cc` and time processing in `main.cc`/`timed-effects.cc`; KeeperRL compression aliases are in `parse_game.h`. NetHack has no requested dat/hint* file at this pin. These were local path-discovery dead ends, not failed fetches or missing-game claims.

Private mechanical artifact writer/census: `tools/build_reports.py`. It reads only pinned sources and writes only the three assigned repo folders plus its work area. Invocation: `python3 -I /Users/weiwei/.codex/research/bf-roguelike-src/tools/build_reports.py`. Source read used bounded `sed` spans and `rg` symbol discovery; ASPECTS source references identify the semantic slice. No package dependency was installed.
