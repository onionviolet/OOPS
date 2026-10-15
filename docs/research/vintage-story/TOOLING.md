# Tooling and reproducibility

Research date: 2026-10-14. Work area: `~/.codex/research/fs-vintage-story/`. No new tools installed. No game acquired, launched or built. Python 3 standard library, git, rg and local shell only.

## Source pins

- [vssurvivalmod](https://github.com/anegostudios/vssurvivalmod/tree/849fa8cad9e392368566efc7474e73db6404a145): `849fa8cad9e392368566efc7474e73db6404a145`.
- [vsessentialsmod](https://github.com/anegostudios/vsessentialsmod/tree/06673b67318e002332b6aa8b3d0308f11d2aba99): `06673b67318e002332b6aa8b3d0308f11d2aba99`.
- [vsapi](https://github.com/anegostudios/vsapi/tree/63d33f70018c606fb0f70ead900fe90625fbd7b2): `63d33f70018c606fb0f70ead900fe90625fbd7b2`.

All three README files identify proprietary Anego Studios software, allow reading and learning, and forbid unmodified redistribution and selling. These are source-available, not open-source grants. Clones stay outside the checkout. Output contains original analysis, identifiers and pinned links only. No source is licensed into YAIRPG.

Commands that worked:

```sh
mkdir -p ~/.codex/research/fs-vintage-story/repos
# Each clone went into its own empty directory.
git clone --depth 1 https://github.com/anegostudios/vssurvivalmod.git ~/.codex/research/fs-vintage-story/repos/vssurvivalmod
git clone --depth 1 https://github.com/anegostudios/vsessentialsmod.git ~/.codex/research/fs-vintage-story/repos/vsessentialsmod
git clone --depth 1 https://github.com/anegostudios/vsapi.git ~/.codex/research/fs-vintage-story/repos/vsapi
# For each clone: git -C <path> rev-parse HEAD
rg --files ~/.codex/research/fs-vintage-story/repos
python3 -I ~/.codex/research/fs-vintage-story/tools_fetch.py
```

`tools_fetch.py` uses urllib to request MediaWiki `action=parse`, `prop=wikitext|revid`, JSON format. It waits 1.1 seconds after each completed request, sends a descriptive User-Agent, and stops at the first failed request. Eight page requests succeeded. Official leather page also opened through the web tool before the sequential API capture. Raw API bodies and decoded .txt extracts stay in the work area; API bodies are also archived in the ignored private folder. Extract hashes are `~/.codex/research/fs-vintage-story/extract/HASHES.txt`.

## Official wiki capture revisions

| Page | Revision | Evidence type |
|---|---|---|
| [Armor](https://wiki.vintagestory.at/index.php?oldid=336208) | 336208 | Stated documentation, not runtime |
| [Barrel](https://wiki.vintagestory.at/index.php?oldid=346951) | 346951 | Stated documentation, not runtime |
| [Brine](https://wiki.vintagestory.at/index.php?oldid=416030) | 416030 | Stated documentation, not runtime |
| [Clay forming](https://wiki.vintagestory.at/index.php?oldid=320452) | 320452 | Stated documentation, not runtime |
| [Crafting](https://wiki.vintagestory.at/index.php?oldid=334527) | 334527 | Stated documentation, not runtime |
| [Leather working](https://wiki.vintagestory.at/index.php?oldid=425966) | 425966 | Stated documentation, not runtime |
| [Limewater](https://wiki.vintagestory.at/index.php?oldid=416040) | 416040 | Stated documentation, not runtime |
| [Smithing](https://wiki.vintagestory.at/index.php?oldid=425003) | 425003 | Stated documentation, not runtime |

## Dead ends and limits

No network fetch failed. `vsapi/README*` missed the mixed-case `Readme.md`; corrected local lookup and read it. Two guessed local paths were wrong: InWorldContainer is in essentials `Inventory/`, and current wearable logic is `CollectibleBehavior/BehaviorWearable.cs`, with legacy ItemWearable retained separately. No network retry was used for these local path corrections. Brine and Limewater are redirects, not missing fetches; barrel/leather pages supply the quoted values. A broad combined local read truncated output; subsequent bounded reads recovered the relevant owners and mechanisms.

Default branch heads are pinned snapshots, not a proven common released game version. Paid JSON, engine binaries, complete dialogue corpus and actual saves are absent. Exact gameplay balance values come only from the cited wiki, labelled stated. Source constants describe control flow and formulas; API example JSON was not treated as installed recipe data.
