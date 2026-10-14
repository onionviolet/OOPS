# ER2 report, 2026-10-14

## CHECKPOINT

COMPLETE: read-only structure/bundle audit, temporary esbuild/metafile, src import graph, main split proposal, world/feature byte ceilings, preview reference check, measured npm wall time and 98 per-file timing summaries. No runtime edits, repo dependency installs, distribution writes, commits or pushes. Recommendations remain proposals.

## Written files

| Code | File | Purpose |
| --- | --- | --- |
| ER2-R1 | [Research audit](../../../../research/CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md) | Findings ER2-F1-F6; bundle/folder shares, four SCCs, hubs, repeated families, ordered split risks/tests, lazy candidates and test results. |
| ER2-R2 | `ER2/REPORT.md` | This lane return. |
| ER2-R3 | `audit.mjs`, `file-reporter.mjs` | Reproduction scripts; output bundle stays under /tmp; reporter emits file summaries and safe failure metadata. |
| ER2-R4 | `metafile.json`, `analysis.json`, `source-snapshot.json`, `duplicate-check.json` | Emitted bytes/import graph/member lists and source hashes, no source text or save contents. |
| ER2-R5 | `npm-test-timing.json`, `test-file-timings.json` | Exact monotonic timings, runner counts and all 98 file summaries. |

Raw scratch bundle/map and TAP logs: `/tmp/er2-runtime-audit/`. One script scratch file is `/tmp/er2-audit.mjs`; final corrected copy is the lane's `audit.mjs`. No owning source/palette/PROJECT changes. Unrelated dirty work remains with other owners. No SECRETS-named files or personal saves were read.

## Commands and results

MEASURED, repository root, Node v22.23.3/macOS arm64, 18 logical CPUs; concurrent workers/test suites were observed. No installs needed.

```sh
node /tmp/er2-audit.mjs
npm test -- --test-reporter=tap
npm test -- --test-reporter=/tmp/er2-runtime-audit/file-reporter.mjs
node --test --test-reporter=/tmp/er2-runtime-audit/file-reporter.mjs tests/*.test.js
```

Initial scratch script needed a correction because esbuild's metafile output key was relative, not the absolute outfile string. The all-source graph uses output import metadata, since nonbundled input metadata does not contain the required edges. Saved scripts include these corrections. The npm reporter attempt left reporter options after positional test paths and stayed TAP, so file timing comes only from the direct command with the reporter option first. A cleanup probe found that redundant run already exited; no worker was killed.

| Code | MEASURED result |
| --- | --- |
| ER2-R6 | Scratch esbuild output: 5,100,788-byte minified JS, 13,120,300-byte map; gzip experiment 1,418,887 bytes. 465 bundled inputs. Largest input is contracts JSON, 261,778 bytes; main.js is 207,805. Attribution is approximate, 350-byte sum discrepancy recorded. |
| ER2-R7 | src graph: 458 JS plus one JSON, 1,833 distinct directed edges; SCC sizes 2/2/55/36. Two files outside main closure: balance.json (test-read baseline), glassmaking.js (optional mod). No identical whole bundled input files. |
| ER2-R8 | Initial npm test: exit 0, 628/628 pass, zero fail/skip/cancel; wall 171.536741 s, runner 167.651855 s. |
| ER2-R9 | Npm reporter attempt: exit 0, wall 87.048268 s; reporter remained TAP. Not used for file rankings. |
| ER2-R10 | Direct file-summary run: exit 0, 634/634 pass; wall 35.504053 s; 98 file summaries. Slowest: cooling_refinement 33.897 s, agreed_duty_continuation 27.307 s, cheat_cards 22.919 s. Per-file durations overlap. The direct run has six more cases than the initial run while workers were active; no test snapshot was frozen. Different times/counts are not demonstrated optimization or exact same-suite comparisons. |
| ER2-R11 | Preview file stat: 2,927,363 bytes. Active script reference at nethack-preview.html:9 and build/check references in scripts/build_nethack_preview.mjs. It contributes zero bytes to the main bundle. |

Additional READ/MEASURED commands: `git status --short`; `cat`/bounded `sed` reads of COMMON, AGENTS, PROJECT, preferences, palette, E-review, offline audit and relevant src/tests; `rg --files src tests`; `rg` for main function outlines, import/JSON bindings, preview references and browser test helpers; `uname -m`, `node -v`, `sysctl -n hw.logicalcpu`; Python monotonic wrapper around subprocess; Python source-map SHA-256 comparison, duplicate-input hash grouping and summary aggregation. A memory registry keyword search found no relevant ER2 entry and did not supply audit facts. No external web research was needed.

Reproduce bundle/graph from the root:

```sh
node docs/gm/dispatch/engine-runtime-2026-10-14/ER2/audit.mjs
node --test --test-reporter=./docs/gm/dispatch/engine-runtime-2026-10-14/ER2/file-reporter.mjs tests/*.test.js
```

Do not run `npm run build` for this lane: build.js writes dist and index. The composition build intentionally bypasses those mutations and the release prechecks. Test browser helper bundles in memory on its own ephemeral HTTP origin; its narrow journey is not a full-world acceptance gate.

## Open questions and remaining evidence

| Code | Open item / proposed next owner action |
| --- | --- |
| ER2-Q1 | Preview owner decides retention/shipping. The palette's age-based deletion suggestion needs the active page reference considered first. No deletion is requested by this audit. |
| ER2-Q2 | Runtime/registry owners select one module-admission seam before async world loading. Existing saves need exact definitions and retained Ink artifacts before hydration; actual chunk savings and failure handling are untested. |
| ER2-Q3 | Main/panel owners select one bounded extraction with injected callbacks. Existing source suites do not close DOM, timer, load-order and full-envelope native acceptance. Proposed desktop checks target 1366×768; mobile remains deferred. |
| ER2-Q4 | Startup parse/compile, browser memory and actual lazy-world load latency remain unmeasured. No frame-rate/startup speed claim or gameplay completion is made. |

Scope reconciled against live owners: desktop-first, optional expansion, save compatibility, knowledge qualification and existing clock/publisher authority are preserved as constraints. Audit completion is not acceptance of any refactor or plugin manifest.
