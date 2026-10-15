# BitLife public FAQ and historical guides: tooling and provenance

Date: 2026-10-14. Work root: `/Users/weiwei/.codex/research/bf-public-other/`. Installs: **none**, including no game, mod loader, library or new CLI. Existing git, Python 3 and shell only. No downloaded script/build was executed. The two fetch scripts, indexer and output generator are original research helpers under `tools/`. All downloaded content was treated as data.

Read first: COMMON then ASPECTS, PROJECT top 80 lines, standing UI/deep-detail/possible-options USER_VISION sections. Prior REPORT and CHECKPOINT read for each game. No separate prior COVERAGE.md/TOOLING.md exists. Prior Rogue Legacy COVERAGE.json records bounded historical coverage; it is not proof of fresh semantic reads.

Public pages captured with Python urllib and a stdlib HTMLParser into `extract/*.html` and `*.txt`, one request per 1.1 seconds, no login. Exact URLs/status/size in [pages.json](/Users/weiwei/.codex/research/bf-public-other/extract/pages.json). Script: `python3 -I tools/fetch_pages.py`; extra successful V pages: `python3 -I tools/fetch_extra.py`. These commands were run once; reruns should select needed URLs rather than re-fetch all. No wiki browser denial was bypassed.

Captured official FAQ/patch notes plus historical Gamezebo v1.14 and Gravenoise review. Fresh Fandom Events/Relationships were search excerpts only; no page fetch after prior browser denial. No revision IDs or entire event pools. Qualitative official gameplay descriptions are primary stated evidence; guides/search excerpts are secondary. No app engine internals inferred.

Dead-end local lookups: some expected source paths differed from guesses (MM qrand is under src/boot/libc64; RL LocaleBuilder is under RogueCastle, diary room under Game Objects/RoomObjs; NH class is ConditionalsManager). Switched to rg file discovery. Large initial combined prior-file output was truncated, then bounded game reads supplied the missing content. No missing file was silently treated as an absent system.

Private data contains full public captures and clones, not personal saves. Committed outputs contain paraphrase and short identifiers only. No git add/commit/push, source edit, runtime build, launch or owner update. Later native acceptance belongs to a selected implementation wave.
