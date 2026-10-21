# P5: executable authoring and revision proof

release=true. P5 source/test/fixture paths are released. No commit/push, extra agents, personal-save access, real book-pack changes or shared generated-output build. Human play/visual acceptance remains open. No P2 composition hunk is required.

## Outcome and supported scope

F1: Existing unsupported-effect validation and native-resource preview refusal already protect activation/spend. `compileStructuredPack` alone accepts a native resource with an unsupported key, but the actual preview marks the command unavailable. P5 preserves that correct runtime behavior and exposes it through an executable author command with source, definition ID, row/effect context and nonzero exit. It adds no duplicate operation/capability list and changes no existing runtime validator.

A1: `node scripts/check_content_authoring.mjs [pack.json]` checks a schema-2 structured definition or world-pack envelope; omission selects the original workshop. `--validate-only` stops at existing compiler/validator coverage. Default executable mode reuses current compiler/effect validator, loader dormant diagnostics and P3 `createScenarioFacade`, with the actual quote/commit/advance readers. Reports distinguish supported, dormant and executable, always leaving `nativeConnected:false` for these synthetic probes. [Usage and scope](../../../../tests/fixtures/deep_engine_authoring/README.md).

A2: Original workshop family has two real native consumers: paid work spends one coin and pays three after two played minutes; measured rest spends two coins and restores four stamina under its native cap. Rebuilt existing optional admission and visible Beginning panel consume those rows without a main/display/save hunk. Native proof is separately recorded in [native-receipt.json](P5_EVIDENCE/native-receipt.json), naming the two proven IDs. Coins and stamina retain separate readers, units, cap and time policy. There is no universal power score or saved code evaluation.

F2: Existing beginning selections pin revision/contentHash/snapshotHash; paid jobs freeze costs/effects/revision. Synthetic revision two changes future paid reward from three to seven. Pure regression proves a retained paid snapshot settles three even when the low-level command registry is newer. Native campaign admission correctly refuses that replacement until exact v1 beginning content is restored. Changed and missing content both preserve durable save bytes, and a future native v2 instance earns seven. This does not implement automatic campaign rebase or broader old-save compatibility.

## Released paths and handoff

| Path | Use |
|---|---|
| `scripts/check_content_authoring.mjs` | CLI, `checkContentAuthoring`, `authorInstance`, `probeCommand` |
| `tests/content_authoring.test.js` | Contextual unsupported row, supported-but-dormant native adapter, real valid deltas, paid/instance revision, dormant pack regression |
| `tests/fixtures/deep_engine_authoring/workshop.mjs` | `workshop(revision=1,reward=3)` original raw schema-2 family |
| `tests/fixtures/deep_engine_authoring/README.md` | Commands, coverage and existing snapshot policy |
| `docs/gm/dispatch/deep-engine-2026-10-20/P5_EVIDENCE/verify-native.mjs` | Real existing UI/admission/persistence journey; run in isolated built candidate with absolute evidence directory argument |

P5 packet/status/evidence are also owned outputs. Functional owner received an append-only receipt at `docs/ENGINE_EXPANSION.md#p5-executable-authoring-execution-receipt-2026-10-20`; exact preceding bytes preserved, [owner-preservation.json](P5_EVIDENCE/owner-preservation.json). No shared rules changed, so no new rulebook or AD line. P2/P4 can run the author command and regressions directly; this lane adds no hot-file integration requirement. Source hashes and copied-input agreement: [release.json](P5_EVIDENCE/release.json).

## Inputs, ownership and rules

Started at rules router, PROJECT summary and USER_VISION's later five-pilot selection; applied EI29/EI31/EI32, OE4, AR1–AR16 and AD1/5–7/15–18/22/32–38. Seam: existing loader/compiler plus command/effect/clock/native-persistence owners, linked [architecture rules](../../../ARCHITECTURE_RULES.md). One bounded preparation pass preceded dependency waits. P1/P3 release=true receipts were read before implementation. P3 facade is directly reused; P1 supplies the prerequisite shared combat source but this content family needs no combat patch. P2 remains a separate disjoint composition owner.

HEAD remains `b0af7db5bd21770ca603fdf1e7b865b376f46857`. [inputs.json](P5_EVIDENCE/inputs.json) records dirty source/test/docs/script hashes copied to `/tmp/oops-p5-authoring-20261020`; HEAD alone is not the tested input identity. Independent generated build outputs stayed there. Complete tests/scripts/tools/desktop/docs were copied, with AGENTS/PROJECT added after the first rules run identified their missing links. Final added-root-doc and official bundle/index hashes are in release.json. Final executable author/test/fixture/native-verifier source hashes match the candidate. Fixture README and functional-owner receipt were added after runtime checks and do not alter runtime inputs. No personal saves or real optional packs were copied. Shared allowance checked at 26%, before broad checks at 29%, and before receipt at 29%, below the 31% stop boundary.

## Verification states

| Check | State and evidence |
|---|---|
| `node --test tests/content_authoring.test.js tests/structured_pack_runtime.test.js tests/structured_origins.test.js tests/world_pack_loader.test.js` | PASS 43/43; [focused.log](P5_EVIDENCE/focused.log) |
| Isolated `npm run build` | PASS; [build.log](P5_EVIDENCE/build.log); uninstrumented production build used in browser |
| Isolated `npm test` | PASS 2373/2373; [full-test.log](P5_EVIDENCE/full-test.log). Unlike earlier P1/P3 snapshots, this copied input set passes the crafting regression; no P5 crafting edit was made. |
| Isolated `npm run check:arch` | PASS; [arch.log](P5_EVIDENCE/arch.log), no new cycle/main import, no owned runtime edit |
| Isolated `npm run check:rules` | PASS with 96 non-git-copy tracking warnings; [rules.log](P5_EVIDENCE/rules.log). Initial candidate omitted AGENTS/PROJECT, corrected before this passing run. Rule-behavior unnecessary: no rule change. |
| Real Chrome 1920x1080 | PASS; [native receipt](P5_EVIDENCE/native-receipt.json), [visible Beginning screenshot](P5_EVIDENCE/native-workshop.png). Standard built bundle, synthetic optional JSON route, actual visible buttons, both native consumers, no page errors. |
| Current-format persistence | PASS: pending paid job Save/reload exact; Export/literal Import full canonical post-export envelope exact, including normal export reward. Changed/missing content suspend with identical durable bytes; exact v1 restores/completes; fresh v2 selects new defaults. |
| CLI valid/broken | Valid default exit 0: [author-report.json](P5_EVIDENCE/author-report.json). Deliberately unsupported native key exit 1: [broken input](P5_EVIDENCE/broken-native.json), [precise report](P5_EVIDENCE/broken-report.json). |
| Owned whitespace/doc preservation | PASS; `git diff --check` and owner prefix-preservation receipt |

The native verifier first exposed a test expectation error: Export grants its normal reward, so comparison against the pre-export envelope was wrong. It now captures the post-export save, verifies literal Import against that complete canonical envelope, and separately checks the pending job unchanged. Its first execution also clicked existing DOM controls on another tab; final passing verification navigates Beginning and clicks visible controls. Earlier attempts are not claimed as passing.

Remaining gates: Weibao's play/visual judgment and P2/P4's fresh combined-input integration. Natural acquisition, broad authoring of arbitrary targets/conditions and full-world revision migration were outside this pilot. Synthetic probe means are documented; a dormant command can be valid under different means. No presentation source changed, so laptop/14/21px layout checks are not claimed; mobile remains deferred. Release means downstream paths are usable, not whole-game/human acceptance.
