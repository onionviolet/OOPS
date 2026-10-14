# ER6 report, 2026-10-14

## CHECKPOINT

COMPLETE: requested library comparison and this report written. Current npm/GitHub checks cover 26 package identities, with 24 runtime package size probes and seven selected-import probes. All recommendations are proposals. Resume only for a named missing source/fact or changed task. No repo installs, runtime/test/build/save/private-pack changes, commit or push.

## Files written

| Code | Owned file | Result |
| --- | --- | --- |
| ER6-R1 | [Libraries comparison](../../../../research/LIBRARIES_TO_INCORPORATE_2026-10-14.md) | LB1-LB11, all named candidates, three new helper options, Zod Mini and current TypeBox identity; dated version/release/license/size/ESM/maintenance evidence, source mapping, adapter/save/first-step/skip rows and top five. |
| ER6-R2 | `ER6/REPORT.md` | This receipt and evidence limits. |
| ER6-R3 | `ER6/collect.py`, `package-data.json` | npm latest-version timestamps, manifests, tarball/gitHead and GitHub pushed/archive/license metadata with source URLs and exact UTC access times. Miniplex repository was resolved from its official homepage because latest npm manifest omits repository. |
| ER6-R4 | `ER6/measure.mjs`, `bundle-data.json`, `scratch-package-lock.json` | Pinned scratch install, full export-namespace browser bundles, gzip byte counts, separate SQLite WASM bytes, dependency inputs and lock integrity. |
| ER6-R5 | `ER6/measure-selected.mjs`, `selected-data.json`, `write-report.py` | Seven explicit size fixtures and report generator. No production adapter was implemented. |

Scratch install location is recorded in bundle-data.json. It is an OS temp directory outside the repo; 42 packages installed there with scripts disabled. Nothing was installed into this checkout. No browser binaries were installed. The initial pure-rand root-import failure remains recorded; v8 export-map subpaths compiled in the corrected probe. Several guessed source paths did not exist; discovery found the actual modules before mapping report rows. No missing file was created in src.

## Findings for root reconciliation

| Code | Palette informed | Finding and evidence class |
| --- | --- | --- |
| ER6-F1 | LB8, LB5 | STATED/READ package identity: npm `tracery` is an unrelated predicate builder; `tracery-grammar` is the grammar package. Scoped TypeBox 0.x and unscoped typebox 1.x are distinct lines. pure-rand 8 uses subpath exports. |
| ER6-F2 | LB5, LB4, RT3, PF4 | MEASURED: selected Valibot schema 3,100 minified / 1,212 gzip bytes; signals-core full namespace 5,468 / 2,008. Size does not prove runtime benefit or equivalent production validation. |
| ER6-F3 | LB1, LB2, EG1 | STATED/INFERRED: bitECS 0.4 is MPL-2.0; SQLite npm wrapper Apache-2.0 while core is public domain. Preserve corresponding dependency licenses, source route and notices. PixiJS remains a selected-panel renderer proposal, consistent with ER5. |
| ER6-F4 | LB2, DA1, DA2 | MEASURED/READ: SQLite JS 215,500 / 66,257 bytes plus WASM 868,907 / 403,404. Existing plan publisher calls synchronous setItem before returning; SQL/idb need an awaited commit contract, not a Promise-returning imitation. |
| ER6-F5 | LB1-LB11, RT3, RT7 | INFERRED ranking: Valibot, signals-core, Playwright, mitt, conditional miniplex query index. Signals and mitt are alternatives for the first panel. Own bounded telemetry needs no analytics SDK. Existing RNG/pathfinding/Web Audio remain incumbents. |

Every candidate's npm/API/author URLs and access date appear in the comparison and package-data.json. License fit conclusions are proposals based on linked primary terms, not a completed audit of all transitive distribution files.

## Commands run and checks

Read COMMON, repo AGENTS, PROJECT summary/current direction, user preferences, USER_VISION standing UI owner, root palette, E1-E10 review, offline audit, reference-scout skill, ER1/ER2/ER3 lane returns and ER5 summary. Read relevant runtime source with cat, nl, sed and rg. A lightweight memory lookup supplied preservation/authority routing; current checkout supplied source facts. No SECRETS-named file, private pack or personal save was opened.

```sh
git status --short --untracked-files=no
git branch --show-current
python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER6/collect.py
node docs/gm/dispatch/engine-runtime-2026-10-14/ER6/measure.mjs
node docs/gm/dispatch/engine-runtime-2026-10-14/ER6/measure-selected.mjs
python3 docs/gm/dispatch/engine-runtime-2026-10-14/ER6/write-report.py
```

collect.py uses concurrent direct npm registry/GitHub API reads. Author repository/docs/license pages were also browsed. The npm scratch invocation inside measure.mjs was `npm install --ignore-scripts --no-audit --no-fund --package-lock=true`; recipe was esbuild 0.25.10, minified ESM browser/ES2022, namespace retained, gzip level 9. All 24 runtime candidates compiled through a supported entry after pure-rand correction. Two dev-tool packages have no shipped browser-runtime size; their registry/ESM/license/maintenance facts are checked, but installed disk/browser size remains unmeasured.

Additional Python checks verified 26 identities, all observed repos unarchived, Koota core inputs exclude React, each ER6-L row appears in inventory and adapter tables, all local report links resolve and referenced source line numbers exist. Direct whitespace checks of both reports passed; git diff --check also returned clean for the scoped path (the new files are untracked). No runtime tests, shipping build, engine throughput benchmark or native browser acceptance ran. ER1/ER2 measurements remain attributed to their own owners.

## Open questions and acceptance

| Code | Gate |
| --- | --- |
| ER6-Q1 | Which selected workload or visible feature merits each conditional library? No adoption is accepted; the five-ranked trial proposals do not authorize implementation. |
| ER6-Q2 | Real adapter equivalence, published-state lifecycle and incremental production bundle footprint. Package-import compilation/gzip measures only byte cost for the stated entry. |
| ER6-Q3 | Full pinned/transitive notice/source audit before distribution, especially MPL bitECS and Apache wrapper assets. |
| ER6-Q4 | For any persistence/RNG/generated-state change: old/current save fixtures, failure/rollback, exact save/reload/literal-file import and rebuilt desktop native gate. Existing gameplay backlog is unchanged. |

No blocking fetch or missing required candidate facts remain. ER7 ECS/worker/SQL behavior spikes, if delivered, should be linked as separate evidence rather than inferred from these byte probes. Root palette, PROJECT and implementation owners were read only.
