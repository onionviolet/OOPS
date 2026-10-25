# D2 engine and modularity, 2026-10-25

Safe-win implementation and measurements finished; remaining cycle debt is explicit below. Assigned writer: D2, branch `codex/engine-modularity-2026-10-25`, isolated worktree, port 5102. Baseline master/HEAD `3dfc49cf3422c0262d86810df47459f53f3a4a67`.

Authority: primary-checkout COMMON.md, COMMON_W4.md and WAVE4_RULES.md M1–M9; architecture AR3–AR6, AR9–AR16, AD36. Structural extractions preserve behavior, current save bytes/schema and validation order. No stack migration. No dist commits, master edits/merge, or push. Latest master will be merged into this branch before final gates.

## Reservations and overlap

Reserve narrow structural edits in inventory/Person registration, acquisition key validation, simulation validation primitives, market rounding import, architecture checker/baseline and domain registry. Primary overlap check before editing found only `src/models/person.js` modified among known-cycle paths: armor penetration and aptitude/rust additions. D2 will touch imports/registry initialization only; preserve that concurrent gameplay change at integration. World-pack mutable Map hardening is a proposal pending consumer inventory, not an accepted rule. Two read-only Luna scans completed; coordinator verifies claims.

## Baseline

`before.json` records three committed synthetic fixtures, 3 warmups + 20 samples, Node v22.23.3; timings in ms, tick = one expansion minute, hydrate = expansion loader. No personal saves. Host load 32.3/62.4/43.5 on 18 cores, so timings are descriptive and noisy.

| Metric | Fresh | Mid | Crowded |
| --- | ---: | ---: | ---: |
| Fixture bytes | 47,654 | 60,817 | 279,175 |
| Serialize median ms | 0.110 | 0.131 | 0.559 |
| JSON parse median ms | 0.193 | 0.240 | 1.077 |
| Expansion hydrate median ms | 0.188 | 0.633 | 4.426 |
| Expansion tick median ms | 0.140 | 3.709 | 6.593 |

Built bundle: 6,777,454 bytes, gzip 1,968,255 bytes. Existing esbuild graph scanner: 830 modules, 226 cyclic edges, six SCCs and six imports of main. No new dependency required. Before/after startup and native inventory/save journey receipts are recorded below.

One full npm test is reserved for the final gate per M3. Baseline master full-suite wall time will use a same-input existing receipt if available, otherwise remains an explicitly unmeasured baseline rather than violating the single-run constraint.

## Checks

- `npm run build` on baseline: PASS, log `/tmp/d2-baseline-build.log`; browser/startup not yet exercised.
- Existing `importGraph` + `architectureEdges`: PASS scan, 226 cyclic edges; this inventories debt, not a passing architecture gate.
- `node /tmp/d2-measure.mjs .../before.json`: PASS; pure expansion and JSON measurements only.

## Implemented seams (AR3–AR5, AR9, AR11–AR13)

- F1: Inventory no longer imports the item catalog. `items.js` binds exactly key resolution and template-key construction after registration, following the existing enemy item-factory binding pattern. Person, trader, chest and injected book-world owners consume the same InventoryComponent. Shared `inventories` lives with the other component references; the old component export remains the identical object. No second inventory store or changed save key.
- F2: `inventory_key.js` owns the unchanged validator used by acquisition and gameplay transactions. `simulation_ids.js` owns unchanged stable-ID validation; causal history takes primitives from their leaf owners. Old public exports remain. Market saturation imports rounding from its actual `misc.js` owner. Paradise native bindings import state functions directly instead of their host re-export. These remove 21 cyclic edges and three complete cycle clusters (acquisition, causal contracts, Paradise).
- F3: The domain registry snapshots dependency/panel/command metadata, then caches topological order until another registration. Closure-owned state remains live; `list()` returns a separate array. Late registration and failed dependency resolution remain supported. Focused mutation/order/command regression passes. Synthetic 100-domain/10,000-tick microbenchmark median 316.331 → 16.018 ms (94.9% lower); minimum 200.371 → 14.168 ms. This is registry dispatch overhead, not whole-game throughput.

## Verified scans and disposition

Two read-only Luna scans supplied candidates, checked against source by D2. The world-pack loader explicitly documents Maps as read-only by convention, so Map wrappers would change its public contract and are deferred. Existing world-pack tests cover activation/ordering; no duplicate topological-sort abstraction was added because dormant-pack and throwing-domain policies differ. Existing engine-bindings and UI-modular checkpoints cover their own delivered seams; D2 did not repeat them.

Remaining debt: 205 cyclic edges and six main imports remain on a shrinking baseline, concentrated in legacy native UI/bootstrap, simulation/feature effects, and expansion/backlog validation. This lane does not claim the whole graph is cycle-free. Breaking the remaining bootstrap/command/effect joins requires separately verified ownership extractions, not mechanical moves into new files. Save schema/envelope/validation order are unchanged; no migration is needed. The two catalog operations preserve the original truthy-quality branch and key construction.

## Additional evidence

- `node --test tests/architecture.test.js tests/acquisition.test.js tests/simulation.test.js`: PASS 10 tests; structural validators and existing acquisition/simulation scenarios, `/tmp/d2-cycle-focused.log`.
- `node --test tests/domain_registry.test.js tests/inventory_component.test.js`: PASS 4 tests; independent inventory import and keyed/template add/remove, immutable registration/order/late registration, `/tmp/d2-inventory-focused.log`.
- `node --test tests/world_pack_loader.test.js tests/world_pack_registry.test.js tests/domain_registry.test.js tests/inventory_component.test.js`: PASS 20 tests; `/tmp/d2-focused-final.log`.
- `node scripts/check_architecture.mjs --shrink`: PASS, 226 → 205 cyclic edges; only resolved cycle exemptions removed; historic line-count limits preserved.
- `git diff 9b997ea60 3dfc49cf3 -- src tests scripts package.json package-lock.json`: empty. Reuse C4's isolated committed-baseline full-suite receipt: 2,877 pass, zero fail, 419.58 s wall (`/private/tmp/lean-tests-baseline-unsandboxed.log`; C4 launch log identifies base 9b997ea60). No second baseline full suite run by D2. Timing under a different shared workload is not a causal performance comparison.
- `git merge --no-edit master`: already up to date at 3dfc49cf3; assigned branch only. Initial sandbox denied ORIG_HEAD write; authorized escalation succeeded.
- `npm run check:arch`: PASS, six grandfathered main imports, 205 cyclic edges; `/tmp/d2-final-arch.log`.
- `npm run check:rules`: PASS, 22 rows, 41 AD codes, 125 links, zero warnings; `/tmp/d2-final-rules.log`.
- Baseline Chrome at 1920×1080 on port 5102: all three fixtures retain identical inventories through native Save, reload, Export and literal Import; no page errors (`browser-before.json`). Cold PLAY-ready fresh/mid/crowded: 3,468 / 6,307 / 24,408 ms. Includes browser automation click wait, not pure startup CPU.

The after measurements show much higher wall times while host load rises from 32 to 82; JSON parsing (unchanged source) also slows sharply. No simulation/startup speed gain or regression is inferred from this unmatched load. Bundle increases are reported exactly in the JSON receipts. Final browser and the single full-suite outcomes are recorded in the final receipt below.

## Before/after deltas

All CPU rows are ms, median of 20 measured samples after three warmups. The after host was substantially busier, so the raw differences cannot establish a source-caused regression. No personal or production saves were read.

| Metric | Before | After | Delta |
| --- | ---: | ---: | ---: |
| fresh serialize | 0.110 | 0.154 | +0.045 |
| fresh deserialize | 0.193 | 0.333 | +0.140 |
| fresh hydrate | 0.188 | 1.617 | +1.429 |
| fresh tick | 0.140 | 1.233 | +1.093 |
| mid serialize | 0.131 | 0.211 | +0.080 |
| mid deserialize | 0.240 | 27.342 | +27.102 |
| mid hydrate | 0.633 | 3.385 | +2.752 |
| mid tick | 3.709 | 193.796 | +190.087 |
| crowded serialize | 0.559 | 3.282 | +2.723 |
| crowded deserialize | 1.077 | 37.065 | +35.988 |
| crowded hydrate | 4.426 | 115.707 | +111.281 |
| crowded tick | 6.593 | 447.125 | +440.532 |
| Bundle bytes | 6,777,454 | 6,778,279 | +825 |
| Bundle gzip | 1,968,255 | 1,968,716 | +461 |
| fresh cold PLAY-ready ms | 3468 | 3706 | +238 |
| mid cold PLAY-ready ms | 6307 | 7480 | +1173 |
| crowded cold PLAY-ready ms | 24408 | 22521 | -1887 |

Fixture bytes are unchanged at 47,654 / 60,817 / 279,175. Full native inventory save/reload/Export/literal Import passed before and after for all three fixtures, with 62 person inventory owners retained in each and zero page errors. The startup route includes automation/click waiting and save hydration. It is not an engine-only CPU timer.

- `npm run build`: PASS final source; `/tmp/d2-final-build.log`.
- `node .../browser.mjs .../browser-after.json`: PASS, rebuilt desktop 1920×1080 on assigned port 5102, three fresh origins; no human visual/pacing acceptance claimed.
- Baseline inventory-only esbuild ESM entry: reproduced `Cannot set properties of undefined (setting 'person')`; same entry after fix initializes successfully. An initial IIFE diagnostic could not compile top-level await; switching to the production ESM format reproduced the actual defect.

Inventory entry dependency closure was also measured using esbuild's parsed metafile: 812 modules / 10,600,634 unminified entry-bundle bytes before, 19 modules / 57,397 bytes after (`inventory-import.json`). This measures the independent inventory entry, not the whole application bundle, and explains why tooling can now import it without bootstrapping the game.

Final-suite repair: the one full run exposed a source-stripping VM test harness in `tests/native_craft_transaction.test.js` that could not parse a function export. That test now imports the actual independent inventory module and supplies its catalog operations; it retains all rollback/private-identity/no-reward-replay assertions. Primary path was clean before this edit. `node --test tests/native_craft_transaction.test.js`: PASS 7/7, `/tmp/d2-transaction-focused.log`. Runtime source/browser inputs did not change. Full-run outcome will retain the initial harness failure explicitly; no second full suite is being run.

Primary overlaps on the final path inventory: `src/models/person.js` and the runtime-performance owner doc only (`primary-overlap.txt`). Person changes are import-only; the owner-doc change is an appended D2 section. Integrator preserves concurrent primary hunks. Generated `dist/*` and the index bundle fingerprint are verification artifacts and are excluded from branch commits.


## Final receipt

- Structural commit: `3cdf39d5` (cycle cuts, catalog binding, unchanged validator re-exports, shrinking architecture baseline, independent inventory and native transaction regression).
- Registry commit: `6cb544b7` (registration metadata snapshot, dependency-order cache and regression).
- `/usr/bin/time -p npm test`: one run only, 2,879 tests, 2,878 pass / one harness failure, 167.64 s wall (`/tmp/d2-final-test.log`). The failed source-stripping harness was corrected and its unchanged rollback scenario passes in the focused 7/7 transaction rerun. The full suite was not rerun after that test-only change; do not label this a green full-suite receipt. Other full-run inputs remain unchanged except a trailing blank line removed from the new validator leaf.
- Full-suite wall comparison: baseline 419.58 s → lane 167.64 s (−251.94 s, −60.0%). This is an observed duration difference under unequal host workload, not an attributed engine speedup. Baseline had 2,877 tests; lane adds two. Final raw test summary: `final-tests.txt`.
- `git diff --check` on task sources/docs: PASS after removing the new leaf's trailing blank line. No gameplay change from that whitespace fix.
- Current master merge check: already up to date, master stayed `3dfc49cf3`. No merge to master, push, installed-app adoption or human acceptance.

No persistence migration: saved names/keys, serialized records, schema numbers and validation order remain unchanged. Actual fixture inventory roundtrips are verified before and after. Remaining native/bootstrap and simulation/effect cycles are proposals for further ownership extractions; no claim of a cycle-free codebase. C2 can update its historic GAME_MCP_LIMITS inventory-cycle note when this branch is integrated; D2 did not overwrite C2's untracked tool docs in primary.

Remaining integration gate: the coordinator runs the combined-candidate full suite after reconciling primary overlaps and the corrected harness. This lane supplies focused green coverage for its test-only repair, not a second full-run receipt.
