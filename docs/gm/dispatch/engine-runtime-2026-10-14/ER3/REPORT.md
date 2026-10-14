# ER3 report, 2026-10-14

## CHECKPOINT

COMPLETE: requested tech-stack research and lane report are written. Proposals
only. No implementation, tool installation, build, gameplay test, save migration,
commit or push. Resume for a named evidence gap or changed direction; do not turn
the shortlist into an implementation assignment.

## Files written

| Code | Owned path | Result |
| --- | --- | --- |
| ER3-R1 | `docs/research/TECH_STACK_OPTIONS_2026-10-14.md` | TS1–TS9 expanded with current dated sources, repo fit, adoption path, qualitative cost, reversibility and smallest gate. Added storage, compression, number ranges, Steam seam and parallel-build isolation. Ends with five ranked first steps. |
| ER3-R2 | `docs/gm/dispatch/engine-runtime-2026-10-14/ER3/REPORT.md` | This report, scope/evidence limits and handback. |

The [full comparison](../../../../research/TECH_STACK_OPTIONS_2026-10-14.md)
owns the detailed rows and URL/access-date citations. Root palette and runtime
owners were read only. Existing dirty/staged work was preserved.

## Findings for root reconciliation

| Code | Palette informed | Finding and evidence class |
| --- | --- | --- |
| ER3-R3 | TS1, TS2, TS3, CH5 | INFERRED: boundary checking, targeted lint and one frozen-build browser roundtrip have the clearest early value. READ package/build files show these can sit beside ESM/esbuild/`node:test`. No whole-codebase TS or UI migration is needed. |
| ER3-R4 | TS6, PF7, OS6 | STATED: Electron throttles by default; Tauri's override is platform-limited; a PWA worker is not a permanent loop. Qualify root TS6's blanket no-throttling/no-quota claim. Native files escape origin quotas, not disk failures; web storage inside a wrapper remains browser storage. Checked 2026-10-14: [Electron](https://www.electronjs.org/docs/latest/api/browser-window), [Tauri](https://v2.tauri.app/reference/config/#backgroundthrottling), [Service Worker lifetime](https://w3c.github.io/ServiceWorker/#service-worker-lifetime). |
| ER3-R5 | DA1, DA2, DA7, TS4, PF8 | READ/INFERRED: async saves cannot imitate today's synchronous `setItem` publisher. IDB is the first conditional backend candidate; OPFS is not eviction-free. Worker/SAB and big-number adoption require measured workload or declared numeric range. Detailed new ER3-N rows own paths and smallest gates. |

## Commands and source review

READ actions run in this session, with `sed`/`nl`/`rg` slices where appropriate:

```sh
cat docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md
cat docs/gm/dispatch/engine-runtime-2026-10-14/ER3.md
cat AGENTS.md
cat ~/.claude/user-preferences.md
cat PROJECT.md
cat docs/ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md
cat docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md
cat docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md
git status --short
git branch --show-current
cat package.json
nl -ba build.js
nl -ba src/save_files.js
nl -ba src/expansion_persistence.js
nl -ba scripts/compile_feature_ink.mjs
```

Also read the standing UI section of `docs/USER_VISION.md`; searched targeted
save-lock/import/timer lines in `src/main.js` and Story/compiler loading in
`src/ink_narrative.js`; inventoried dispatch files with `rg --files`; inspected
running Codex/dispatch command metadata read-only. Branch observed:
`codex/gameplay-foundations`. Many unrelated files were already dirty or staged.
No shared writer ownership was taken. An initial search named nonexistent
`src/save_storage.js`; inspection continued through actual `save_files.js` and
`expansion_persistence.js`. No missing file was created.

A quick memory registry search returned older Foundation entries, which were not
used as current authority. Current repo owners supplied the analysis.

Web reads used `web.run` open/find on official tool docs, author repositories and
platform standards: TypeScript, ESLint, Playwright, esbuild, inkjs, Preact, Lit,
Tauri, Electron, Steamworks, WHATWG/W3C/TC39, Chrome and WebKit. Supplemental MDN
reference reads helped route to standards; final recommendations cite primary
sources. A failed MDN SharedArrayBuffer fetch was replaced with Chrome isolation
guidance and the ECMAScript standard. Every option row gives URL and checked date.
No repository dependency was installed to conduct this research.

Document checks run with a Python `pathlib`/regex script: both requested files
exist and have CHECKPOINT sections; relative Markdown links resolve; no em dash
or spaced double hyphen occurs; TS1–TS9 appear; ER3-A1–A5 exist with no sixth
shortlist item. Exit 0, all checks PASS. This checks documentation only.
Source inspection is READ;
external statements are STATED; fit/cost/ranking is INFERRED. No runtime performance
number is offered as MEASURED and no source test slice is offered as native proof.

## Open questions and handback

| Code | Still open | Appropriate next evidence |
| --- | --- | --- |
| ER3-Q1 | Which pure boundary gives the most useful checker/linter signal? | A bounded diagnostic pilot with inspected transitive imports. |
| ER3-Q2 | Is storage/write/CPU/rendering actually a bottleneck on the target laptop? | ER1/ER2 representative synthetic profiling; do not infer speed from file size. |
| ER3-Q3 | Is an installed Steam release a current product need, and which OS is first? | Director direction before platform adoption. No wrapper, enrollment, upload or install authorized here. |

Browser gates, storage migration, hidden/closed equivalence, installed-host proof,
Steam integration and human acceptance remain OPEN. Research delivery does not
close the Foundation chain or change offline-time/mobile priorities. Root may link
this report and qualify TS6; root owns palette edits. The comparison's ER3-A1–A5
shortlist ranks checking, lint, browser roundtrip, isolated dev builds and save
capacity/compression probes.
