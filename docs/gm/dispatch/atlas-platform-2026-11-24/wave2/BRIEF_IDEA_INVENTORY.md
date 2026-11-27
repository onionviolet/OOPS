# Lane: inventory every past idea source the atlas cannot see yet (Codex luna)

Read first: [OWNERSHIP.md](OWNERSHIP.md). You own only `docs/audits/IDEA_SOURCES_INVENTORY_2026-11-24.md`. Read-only everywhere else.

Weibao: "port all of our previous ideaboarding and ideas into world atlas and then for future we can use that as reference".

The atlas idea registry (prototypes/world-atlas/ideas.mjs; method and counts in docs/audits/IDEA_REGISTRY_SWEEP_2026-11-24.md) already reads every `docs/**/*.md` in this repo except private/ and docs/research/novels/. Its reference tier is the 228 boards linked from docs/IDEA_INDEX.md and docs/gm/WRITEUP_REGISTER.md. Your job is to find what it misses, so the coordinator can port it.

Inventory, with path, size, date range, a one-line description, an estimate of coded idea items, and whether it is about OOPS:
1. In-repo idea boards the indexes do not link: run `node -e` against ideas.mjs exports (or read its snapshot logic) to list boards with 10+ idea rows that are not registered. Rank by idea count. Flag ones that are run outputs or audits rather than idea lists.
2. Codex outputs: `~/Documents/Codex/*/*/` folders that concern OOPS (yet-another-idle-rpg, oops, atlas, gu, cheats, worlds, UI). List each with its main file.
3. Discord: docs/research/DISCORD_ATLAS_DESIGN_IDEAS_2026-11-24.md covers DY1-DY40 from two channels. List other research or digest files of Discord or chat ideas already in the repo, and say which channels or date ranges no doc covers yet (do not call Discord; just report the gaps).
4. The planning vault `~/Documents/Claude/Projects/Weibao's Workspace/plans`: list only file paths and headings that are OOPS ideaboards or idea lists (filenames, headings, counts). Do not copy content; it is personal and needs Weibao's scope answer before any port.
5. Other repos named in OOPS docs as idea sources (proto23, yair, arkivia under ~/code or ~/Documents/Dev): paths only.

Then propose a port plan: per source, port as a dated board under docs/ideas/ (summarized, coded, with a source line), register in IDEA_INDEX, or leave external with a link. Note privacy limits (no book text, no verbatim messages from other people, vault needs Weibao's yes).

Report: the doc path, counts per source, and the top 10 sources to port first.
