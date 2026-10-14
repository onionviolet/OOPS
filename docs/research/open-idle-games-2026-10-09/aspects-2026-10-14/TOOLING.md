# open-idle-games-2026-10-09: tooling and fresh source pins

Lane: bf-idle-src. Work area: `/Users/weiwei/.codex/research/bf-idle-src`. Static acquisition/reading only; no game launch, dependency build, private save/account, install of a game, staging, commit or push.

Read prior REPORT and CHECKPOINT first. Standalone TOOLING.md/COVERAGE.md absent in these prior dossiers. COVERAGE.json was read where present (Bitburner, Theory of Magic, Melvor); open games SOURCES/VALIDATION and other checkpoint unread tables supplied bounds. This does not reuse missing private extracts.

## Sources

| Source | Route | Pin |
|---|---|---|
| pk-original | https://github.com/ihtasham42/progress-knight.git | `f6dd0c3c444d838f80325bbdca918160b99e89e5` |
| pk2 | https://github.com/Symb1/progress_knight_2.git | `5b6b059b1f5ad645837e504bde1d455995d05514` |
| pk-quest | https://github.com/indomit/progress_knight_2.git | `d03f8b65adddab4a089a2f95e3a4749770aa03cb` |
| loops-original | https://github.com/StopSign/stopsign.github.io.git | `3e004b993e8d82d718945a2a4b5a17de8c0fabff` |
| loops-omsi | https://github.com/omsi6/omsi6.github.io.git | `fa21477d424f3aa1f1bf6deb9f6f83c2569770ab` |
| loops-dmchurch | https://github.com/dmchurch/omsi-loops.git | `fe4a349efb799a56ab548018caca1a1a1aea0c8f` |
| evolve | https://github.com/pmotschmann/Evolve.git | `3436358dcd03d9f9e071d51ea071e0a78c0322e4` |

## Mechanical rerun

1. Clone each listed Git URL with `git clone --depth 1 URL DEST`; Bitburner uses `--branch stable`. Read before running. Verify `git -C DEST rev-parse HEAD` against the pins. Changed heads need a new evidence pin.
2. Fetch itch creator page as HTML, decode its embedded html-classic iframe URL, fetch the index and referenced JS/CSS, then follow relative ES-module imports. Do not run the page. One request per second. `extract/web-acquisition.json` records exact URLs and successes.
3. Read selected paths listed in ASPECTS and the three traces. Raw sources stay in repos; SHA-256/bytes/lines are in `extract/FILE_INDEX.json`, and every retained source plus formatted bundle is hashed in `extract/HASHES.txt`. Use those locators, not line numbers from the old missing Mac extracts.
4. Regenerate/check derived artifacts using this lane-owned `tools/write_pass.py`; this is our own document script, not upstream game code. Review generated prose and inventory-only labels.

## Installs and dead ends

Installed only `jsbeautifier 2.0.3` and `editorconfig 0.17.1` into `tools/venv` to format Dao/Xanxia as static text. Commands: `python3 -m venv WORK/tools/venv`; `WORK/tools/venv/bin/pip install jsbeautifier`. No brew/system/game install. Full formatted files are `extract/dao-pretty.js` (18,272 lines) and `extract/xanxia-pretty.js` (67,317 lines). Original byte hashes, not pretty-print line numbers, identify a build.

All 12 source-game git clones plus official Melvor typing clone succeeded. Melvor steam page route gave web internal error; alternate melvoridle.com page and wiki API gave HTTP 403. Switched to the official typing repo. No page retry variants/login. Earlier one-off path searches guessed absent source files (Literature.ts, goAI under boardState, persist/index.js, Evolve global.js); resolved by `rg --files` to the actual acquired files. No source was executed.

## Install decision and remaining depth

All seven acquired repository families are represented, but complete story XML/late traits/challenges/ending combinations, predictor correctness and legacy migration joins remain unread. Other unrelated games in StopSign monorepo are outside the prior grouped roster. No install needed.

A game install would only be useful for a separately authorized runtime/UI/pacing question that cannot be answered statically. This pass gives no install request and changes no ownership/entitlement.
