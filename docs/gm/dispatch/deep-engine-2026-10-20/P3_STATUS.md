# P3 scenario facade status

release=true. P3 source is released for downstream use. The bounded facade/lamp journey is implemented and verified; release does not claim all-check or human acceptance. No commit/push was made. P2 may start after P1 separately releases and its other prerequisites hold.

## Outcome and API

A1: `src/scenario_facade.js` exports `createScenarioFacade`, `semanticDelta`, `knownLampProjection`. Injected operations retain the real quote/execute, projection, clock and persistence owners. `scripts/headless/scenario.mjs` exports `createHeadlessScenario`, `createBrowserScenario`, `ordinaryLampJourney`, `scenarioInputIdentity`, and the two test-only bridge strings. [API, runnable example and replay limits](P3_EVIDENCE/API.md).

A2: named `deep-engine.ordinary-lamp` v1 fixture (`tests/fixtures/deep_engine/ordinary_lamp.mjs`) puts an owned lamp plus one oil flask in the Village at 22:00. This is explicit developer setup, not natural acquisition. Both adapters run the same success/stale-failure/persistence contract. The real owner consumes one flask, produces 240 fuel, burns two fuel over two native minutes, and rejects the stale original quote with no semantic change. Visible native inventory out/relight retains 238 fuel. Inspection excludes notice counters, future reveal IDs and extra internal fields, draws no RNG and changes no state/save bytes.

A3: no required main/display/save composition patch. The source-owned test bridge uses the same existing registry commands in the real bundle, separately recording official versus instrumented browser bundle hashes. Production composition remains untouched. P2 should preserve registry routes `lamplight.quote`, `lamplight.execute`, `lamplight` projection and exported singleton compatibility, then reuse the unchanged lamp journey before/after its structural extraction. P1's synthetic equipment/effect fixture already lives in `tests/combat_effect_semantics.test.js`; it uses actual native actor stats and the B1–B4 readers. A future second facade adapter should inject those actual owners and their safe projection rather than synthesize a second combat resolver. P3 does not claim that unrun adapter as integrated.

## Ownership and inputs

Released source/test paths:

| Path | SHA-256 |
|---|---|
| `src/scenario_facade.js` | `6599fbd207faf43d5789256706cac3f8e7720fd564c8a205c06e85433287768a` |
| `scripts/headless/scenario.mjs` | `0f5179a0512279eaf4557083d25156624cd89743301f5fd88c7d8b7e2df629f6` |
| `scripts/headless/runner.mjs` | `1eea41ffcfcf556e5d27eb48857d35928dd91d598f3d30d4ab07d19a1920f94d` |
| `tests/scenario_facade.test.js` | `248b4200ce900788671f85a6a39db2ff1ce1abd1332e06191096798e3ef6d41a` |
| `tests/fixtures/deep_engine/ordinary_lamp.mjs` | `9ebf12e73fe71b46041641b9fa290c93b22406630ffb2ed8de1adebe342cc610` |

Own receipt/evidence: `P3.md`, this file and `P3_EVIDENCE/`. Functional owner received an append-only execution receipt at `docs/ENGINE_EXPANSION.md#p3-scenario-facade-execution-receipt-2026-10-20`; original bytes are preserved, proven in `P3_EVIDENCE/owner-preservation.json`. No combat, tools/lamplight, core composition, personal-save or shared generated-output edits.

HEAD at copy: `b0af7db5bd21770ca603fdf1e7b865b376f46857`; dirty source/test identity: [inputs.json](P3_EVIDENCE/inputs.json), 1174 paths. All five P3 runtime/test inputs match the tested isolated candidate: [changed-inputs.json](P3_EVIDENCE/changed-inputs.json). The candidate is `/tmp/oops-p3-scenario-20261020`; prepareTree copied the runtime and imported docs, then complete tests/scripts/textual docs/desktop fixtures were copied. `tools/` was added after the initial missing-import failure. Never substitute HEAD alone for these dirty hashes. Other lanes may have newer inputs now; P2 owns combined integration verification.

Selected scenario source hash: `f78cd2431525dc80200ff4bccf2841777fe408bf738b70e3e77c48577aa19996`. Exact fixture save identity and official/instrumented browser bundle identities are in [browser-receipt.json](P3_EVIDENCE/browser-receipt.json). The source digest describes declared inputs, not a whole-game replay ledger or every optional network/asset response. The runner's pre-existing source cache is not a new guarantee that arbitrary runtime-doc-only changes invalidate old cached bundles; force a fresh bundle when testing such a change.

## Checks and remaining gates

Rules: AR1–AR16 (seam: narrow injected operations plus existing domain registry), AD3/6–8/15–18/22/32–38, AU1–AU15. Relevant regressions and stale failure were selected before implementation. No gameplay rule or persistence schema changed, so rule-behavior was not added. Included use was 26% at start and 27% at last check, below shared 31% ceiling. No external research, agents or paid fallback.

| Command/check | State | Evidence / exact limits |
|---|---|---|
| `node --test tests/scenario_facade.test.js` | PASS, 2/2 | Native real owners; no observation mutation/RNG; immutable identity/quotes; unknown field filtering; real spend/time; stale rejection; exact current-format canonical persistence |
| `npm run build` | PASS | Isolated candidate, `/tmp/oops-p3-build.log`; production bundle built before separate browser instrumentation |
| `npm test` | FAIL, 2270/2272 | `/tmp/oops-p3-test.log`; one candidate preparation omission corrected separately (below), plus F1 existing crafting failure. No blanket full-suite pass claimed |
| `node --test tests/effect_dsl.test.js` | PASS, 93/93 | `/tmp/oops-p3-effect.log`; initial candidate omitted `tools/import_srd521.mjs`, then complete `tools/` copied and this affected file rerun. No runtime defect inferred from the omission |
| `npm run check:arch` | PASS | `/tmp/oops-p3-arch.log`; main 10303/10310, display 6690/6767, save 310/310; no new cycles/main imports. Candidate baseline SHA `72c5265d62beb13ecf616e2b04b3e5b127f130220eb7b174ae21e6eb1bb4ff2f` also equals shared HEAD baseline, independently checked because candidate has no git metadata |
| `npm run check:rules` | PASS, 96 warnings | `/tmp/oops-p3-rules.log`; warnings are linked files appearing untracked in the isolated non-git copy |
| `node --test tests/headless/runner.test.js` | 4/5 pass | Existing boot/step/developed fixture and exact persistence pass; F2 existing village route fails. `/tmp/oops-p3-runner.log` |
| Control with only P3's four runner additions removed | Same F1 and F2 failures | `node --test tests/interaction_native.test.js tests/headless/runner.test.js`, `/tmp/oops-p3-control.log`: 4/6 pass. Candidate runner then restored and SHA compared exactly. No control edits in shared checkout |
| `node docs/gm/dispatch/deep-engine-2026-10-20/P3_EVIDENCE/verify-browser.mjs /tmp/oops-p3-browser-evidence` | PASS | [Safe receipt](P3_EVIDENCE/browser-receipt.json), [runner source](P3_EVIDENCE/verify-browser.mjs), [screenshot](P3_EVIDENCE/native-lamp.png). Chrome 1920×1080 fresh disposable origin, same facade contract/deltas, no inspection RNG/storage/state changes, canonical Save/reload/Export/literal Import exact, native inventory select/use twice. No page errors. Only expected optional `/private_packs/manifest.json` 404 |
| `git diff --check` on owned edits | PASS | Source/test and append-only owner receipt; no shared generated outputs rebuilt |

F1: current isolated `tests/interaction_native.test.js` fails in the Sinew multi-stack All crafting sequence: a Boar meat stack remains where the test expects no entry. Same failure with P3 bridge additions removed. This is in an older native interaction/crafting owner, not the selected lamp journey; P2's combined integration receipt must retain/recheck it against the actual source-release inputs rather than copy it as passing.

F2: legacy `tests/headless/runner.test.js` scripted village route stops at minute 2025 with `ReferenceError: game_stats is not defined`. Same failure with P3 bridge additions removed. The other four legacy runner cases pass. Preserve the failure for the current native/UI composition owner; no hot-file fix was attempted by P3.

Human play/visual judgment remains open. No presentation change was made; laptop and 14/21px UI layout checks are not claimed. Mobile stays deferred. Full all-check acceptance remains open for F1/F2 and fresh combined inputs; P3's finite lamp authoring outcome, browser and persistence checks pass. Inspection deltas are observable consequences, not a complete hidden-premise cause graph. Reentrancy, full draw/order replay, natural acquisition and optional private packs remain unclaimed.
