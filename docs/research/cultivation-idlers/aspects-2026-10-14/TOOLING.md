# cultivation-idlers: tooling and fresh source pins

Lane: bf-idle-src. Work area: `/Users/weiwei/.codex/research/bf-idle-src`. Static acquisition/reading only; no game launch, dependency build, private save/account, install of a game, staging, commit or push.

Read prior REPORT and CHECKPOINT first. Standalone TOOLING.md/COVERAGE.md absent in these prior dossiers. COVERAGE.json was read where present (Bitburner, Theory of Magic, Melvor); open games SOURCES/VALIDATION and other checkpoint unread tables supplied bounds. This does not reuse missing private extracts.

## Sources

| Source | Route | Pin |
|---|---|---|
| cycle | https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/index.html?v=1791859983 | `102-module import closure hashed per file` |
| dao | https://html-classic.itch.zone/html/16442969/index.html | `f2f9a5d71809fbe7d5d7f59fa2e7122333fe9ef65095907a6c5a59e67c386b02` |
| xanxia | https://html-classic.itch.zone/html/17169794/index.html | `8367b5fa39d301511b7536ed45a038807b581422fcefc9180fedfd40aa5d5fbd` |

## Mechanical rerun

1. Clone each listed Git URL with `git clone --depth 1 URL DEST`; Bitburner uses `--branch stable`. Read before running. Verify `git -C DEST rev-parse HEAD` against the pins. Changed heads need a new evidence pin.
2. Fetch itch creator page as HTML, decode its embedded html-classic iframe URL, fetch the index and referenced JS/CSS, then follow relative ES-module imports. Do not run the page. One request per second. `extract/web-acquisition.json` records exact URLs and successes.
3. Read selected paths listed in ASPECTS and the three traces. Raw sources stay in repos; SHA-256/bytes/lines are in `extract/FILE_INDEX.json`, and every retained source plus formatted bundle is hashed in `extract/HASHES.txt`. Use those locators, not line numbers from the old missing Mac extracts.
4. Regenerate/check derived artifacts using this lane-owned `tools/write_pass.py`; this is our own document script, not upstream game code. Review generated prose and inventory-only labels.

## Installs and dead ends

Installed only `jsbeautifier 2.0.3` and `editorconfig 0.17.1` into `tools/venv` to format Dao/Xanxia as static text. Commands: `python3 -m venv WORK/tools/venv`; `WORK/tools/venv/bin/pip install jsbeautifier`. No brew/system/game install. Full formatted files are `extract/dao-pretty.js` (18,272 lines) and `extract/xanxia-pretty.js` (67,317 lines). Original byte hashes, not pretty-print line numbers, identify a build.

All 12 source-game git clones plus official Melvor typing clone succeeded. Melvor steam page route gave web internal error; alternate melvoridle.com page and wiki API gave HTTP 403. Switched to the official typing repo. No page retry variants/login. Earlier one-off path searches guessed absent source files (Literature.ts, goAI under boardState, persist/index.js, Evolve global.js); resolved by `rg --files` to the actual acquired files. No source was executed.

## Install decision and remaining depth

Cycle full Acts II/III, all board combinations and Worker/offline consumer joins; Dao all late-world formulas; Xanxia every sect/plane/AI/offline record; exact relationship-gated dialogue counts remain unread. All three public builds acquired statically. No game install needed.

A game install would only be useful for a separately authorized runtime/UI/pacing question that cannot be answered statically. This pass gives no install request and changes no ownership/entitlement.
