# ER11 report, 2026-10-14

## CHECKPOINT

Complete: MC22-MC33 audit and numeric/asset inventories are in [UI micro feel audit](../../../../research/UI_MICRO_FEEL_AUDIT_2026-10-14.md). Findings ER11-F1-F11 and fixes ER11-R1-R5 are proposals. No implementation, commit, push or install. Shared source, tests, dist, index and saves were read-only. No SECRETS file or personal save was opened. No agents were spawned.

Desktop target 1366×768; mobile optimization deferred. COMMON, AGENTS, PROJECT, user preferences, User vision, root palette, E1-E10, offline F1-F9, ER1 and ER3 were read. Existing dirty state was preserved. The lane's explicit output authorization was used; shared-runtime ownership was not assumed.

## Files written

| Code | File / role |
| --- | --- |
| ER11-O1 | `docs/research/UI_MICRO_FEEL_AUDIT_2026-10-14.md`: ranked findings, severity, source lines, minimal reproductions, smallest fix proposals, formatter/asset inventories, partial protections and remaining gates. |
| ER11-O2 | This REPORT, `probe.cjs`, `browser-results.json`, `opening.png`, `build-evidence.json`, `map-response.json`: commands, reproducible probe and desktop/build evidence. |
| ER11-O3 | `number-inventory.txt`, `display-number-sites.txt`, `inline-number-sites.txt`: source search receipts. Some search hits are arithmetic locals, not formatters. |
| ER11-O4 | Scratch `/tmp/yairpg-er11-mg8hxm66`: copied public source, asset/style/story/locale inputs and necessary compiler/contract documents, symlink to existing dependencies, own dist and HTML fingerprints, `build.log`, `input-hashes.json`, synthetic `micro-probe.html`. `/tmp/er11-build-root.txt` and `/tmp/er11-number-hits.txt`, `/tmp/er11-html-hits.txt`, `/tmp/er11-assets.txt`, `/tmp/er11-raw-numbers.txt` routing/search scratch also remain. No source library or private packs copied. |

## Commands run and result

Commands below summarize the actual invocations; selective source reads and searches were repeated as findings were narrowed.

| Code | Command / purpose | Result |
| --- | --- | --- |
| ER11-C1 | `cat` / `sed -n` required owners and relevant source; `git status --short`; `rg --files src styles`; `rg -n` memory registry for Foundation/transfer/runtime lane | Source authority and dirty state recovered. Memory only routed authority/evidence separation; live owners governed scope. No prior runtime fact treated as current proof. |
| ER11-C2 | `rg -n 'getBoundingClientRect\|offsetHeight\|offsetWidth\|clientHeight\|clientWidth\|scrollHeight\|getComputedStyle\|requestAnimationFrame\|setInterval\|visibilityState\|document.hidden\|prefers-reduced-motion\|tabular-nums' src style.css styles -g '!SECRETS*'` | Layout, poll, motion and numeral sites read. Shell regex used normal alternation in actual calls. |
| ER11-C3 | `rg -n 'innerHTML\|outerHTML\|insertAdjacentHTML' src -g '!SECRETS*'`; searches for character names, set_HTML/insert_HTML, busy/pending/commit handlers, replacement operations and plural units | Traced real player/save name sink; distinguished static markup, safe textContent, keyed rows and existing commit guards. |
| ER11-C4 | `rg -n 'toFixed\|toPrecision\|toExponential\|toLocaleString\|Intl.NumberFormat\|function format_\|const formatCoins\|const fmt=\|const minutes =' src -g '!SECRETS*'`; native and cross-source `Math.round/floor/ceil` display searches | Saved numeric inventories. Named helpers plus inline output families documented. |
| ER11-C5 | Asset searches for src/href, CSS URL/imports, runtime fetch/Worker/Audio/image constructors and sourceMappingURL | Documented every discovered runtime asset family and local fingerprint gaps. No public deployment claim. |
| ER11-C6 | Python `shutil.copytree/copy2`, ignoring SECRETS/private/save patterns; symlink existing node_modules; `node build.js` in `/tmp/yairpg-er11-mg8hxm66` | Final build exit 0, pinned Ink check passes. Initial selective copies lacked imported contracts/locales/retained Ink JSON/voice cues; builds failed until these public dependencies were copied. One attempted VOICE_CUES.js copy failed because the actual file is JSON. No source workaround or shared dist write. |
| ER11-C7 | `python3 -m http.server 0 --bind 127.0.0.1` in scratch; `node docs/gm/dispatch/engine-runtime-2026-10-14/ER11/probe.cjs` | Fresh localhost port 49873; headless Chrome, normal PLAY and synthetic public hero. Final probe exit 0, zero page errors. 312 layouts/736 style recalculations in 5 s; four counters numeric normal; career focus detaches; selected title text disappears; craft component double-click calls handler twice; exact expo source outputs wrong small/signed values. |
| ER11-C8 | Python SHA-256/source-map comparison and `urllib.request.urlopen(.../dist/bundle.js.map)` | Candidate 464 physical inputs match; 37 upstream entries match embedded content in inkjs/dist/ink.mjs.map, for 501 reconciled entries. Served bundle matches candidate SHA-256 `012297afd9c7a4d0884beb775bceb5c82004876f23100270461ea72d2246554f`. Map HTTP 200, 13,106,520 bytes. |
| ER11-C9 | `diff -u /tmp/yairpg-er11-mg8hxm66/src/main.js src/main.js`, save-files diff, mapped-source comparison; read new generated-people/mixture/storylet UI | Shared source drift observed after measurement; 16 changed mapped files saved in build-evidence, three late panel observations added as READ only. Candidate was not rebuilt against those later writes. |
| ER11-C10 | Closed each headless browser in probe `finally`; Ctrl-C scratch server; docs style/path verification | No lane browser/server remains. No gameplay suite run. |

First scratch directory landed in macOS's default temp root; it was moved to `/tmp` before any successful build. A workdir construction error prevented the first build invocation from starting. These were harness issues, not gameplay failures.

Initial browser run established opening metrics only; an attempted `window.log_message` probe found that function unexposed and proved no HTML injection. It was removed from the final driver. The first component run rejected a career fixture lacking offered-method prerequisites; corrected with an issued method. Earlier title selection was empty because the fixture host was hidden and selection disabled; final fixture makes the reading region visible/selectable, starts with `Audit title`, then observes empty selection. Earlier timing samples were 315/311/314 layouts with the same built bytes; final retained sample is 312. They are not independent regression validations or a latency distribution.

## Open questions and acceptance

| Code | Remaining evidence |
| --- | --- |
| ER11-Q1 | Confirm native Craft 1 spend/result/receipt for double-click and repeated Enter, then choose whether repeat activations are intentional. Component calls twice; native double-charge was not played. |
| ER11-Q2 | Exercise pointer down/tick/up, actual panel scroll, typed mixture repeat count and font width boundaries on a fresh rebuilt latest-source desktop origin. |
| ER11-Q3 | Inject one presentation error, test hidden/reduced motion, and check actual release cache headers/map policy. No consequential clock fault should be silently swallowed. |
| ER11-Q4 | Reconcile late source changes with their owners before a new build or any fixes. The report is an audit proposal, not permission to edit runtime, alter save semantics or close another lane's gates. |

All requested source topics are covered. Optional browser work confirms bounded mechanisms at 1366×768; full native gameplay, persistence and taste gates remain with their existing owners.

Final verification: report links resolve; no em dash or spaced double dash in either report; `node --check` passes for probe.cjs. The map check was broadened after finding 37 upstream paths absent on disk; all 37 match the pinned Ink dependency map. No browser rerun was needed for this evidence qualification.
