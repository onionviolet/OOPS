# F1 battle runner, 2026-10-29

Status: **implemented, below AD43 floor**. Focused agent verification passes; rebuilt desktop browser and literal native `create_save()`/Export/Import equivalence remain with the coordinator under the brief. Not human-reviewed. No commit, staging or publication.

## Scope and reservation

Writer reservation now released to the coordinator for the following owned paths. No shared owner, main.js, host adapter, cohort or field-care source was edited.

| Files | Change |
| --- | --- |
| `src/conflict_frame.js` | World-neutral staged runner, definition-selected ordered move rows, result-publisher table, optional random port, native plan clone, ordered result selection and explicit legacy ordinal RNG adapter. |
| `src/native_battle.js` | Road schema-1 definition, strike/withdraw rows, result publishers. Existing quote/admission, combat math, effects and transaction owners retained. |
| `src/party_battle.js` | Schema-2 definition, ordered withdraw/release/helper-guard/strike rows. Guard interception, helper departure and finish-before-counter order retained. |
| `src/feature_expansion_battle.js` | Sluice schemas 3/4/5 definition, action rows, objective/escape/win stop-rule rows and result publishers. Reference/remainder/field-care hook order retained. Schema-6 delegation retained. |
| `tests/conflict_frame.test.js` | Test-only `paths.old`/`paths.runner` dial, 126 replay/regression cases across five seeds, full-plan and ordered JSON comparisons, actual native transaction bytes, reload continuation, stale/invalid rejection and zero/last-stamina cases. |
| `tests/fixtures/conflict_frame/{native_battle,party_battle,feature_expansion_battle}.txt` | Frozen pre-port implementations, imported only by the test dial. Relative domain dependencies resolve to current sources; road-to-party delegation resolves to frozen party. No production legacy dial. |
| `F1_INTEGRATION.patch` | Proposed SYSTEMS_REGISTER hunk for the coordinator; shared register untouched. |
| `F1_CHECKPOINT.md` | This receipt and evidence. |

Authority: [brief](F1_BATTLE_RUNNER_BRIEF.md), [design](../LEAD_LIFE_SYSTEMS_DESIGN.md) LSD81/LSD82/LSD85/LSD89; [runtime rules](../../../../../.claude/rules/runtime-code.md) AR3/AR5/AR7/AR9/AR14/AR15; AD36/AD43/AD45, MD3/MD6, CLR2/CLR10/CLR12. Structural port only; accepted book-fidelity direction and later step-2 scope stay unchanged.

## CLR2 data probe, observed

| Input | Expected | Observed | Gate |
| --- | --- | --- | --- |
| Saved hand-built battle families | 3+ | Road schema 1, party schema 2, sluice schemas 3/4/5; cohort schema 6 also inspected | yes, met |
| Existing result/replay tests | 1+ each | frontier_campaign (road), party_battle, combat_effect_semantics/cooling_refinement (sluice); cohort_battle for preserved delegation | yes, met by focused run below |
| Shared shape | list | `simulation.sessions.player.nativeBattle`; side membership (implicit road, saved fighters elsewhere), objective/yield/escape, move/action packet, stop rules, result effects/logs, saved seed/actions and staged vitals/native deltas | yes, met |

`cohort_battle.js` has its own admission, binding and finish contracts behind schema 6. It remains on the existing path because this brief selects the three earlier battles for the first port. `field_care_battle.js` is a sluice admission/strike/finish observer, not another independent encounter; its call positions are unchanged. No battle was abandoned as inexpressible.

Failure scenarios chosen before edits: changed draw count, action/sequence ordering, property order in serialized saves, guard redirection, paid effort, settlement/report ordering and reload continuation. Frozen snapshots were captured before source edits. Old production control flow was removed after equivalent tests passed; snapshots remain test-only.

## Checks

- `npm run check:arch` before edits: PASS, main -59, display -37, save_files 0 against baseline; 205 cyclic edges.
- `node --test tests/conflict_frame.test.js tests/frontier_campaign.test.js tests/party_battle.test.js tests/combat_effect_semantics.test.js tests/cooling_refinement.test.js tests/cohort_battle.test.js`: PASS, **181/181**, including **126** equivalence/regression cases. Gap: controlled named fixtures, not a browser journey or exhaustive action/source combination matrix. Earlier fixture failures were rejected by the frozen old code too: unlearned tracking, missing Combat XP adapter and incomplete optional fitting enrollment. Corrected the fixtures through existing admission and skill adapters; no runtime change was made for those failures.
- `BUILD_OUT=/tmp/yairpg-f1-battle-runner npm run build`: PASS. Bundle SHA-256 `29ca949b350bb813d9f13358d1e8c66ebf04ba55f7722f14b48c19da0c979fbc`. Isolated output; shared index/dist untouched. Gap: no browser exercised this bundle.
- `npm run check:arch` after final edits: PASS, same counts as baseline, no new cycle edges, no core-owner registration lines.
- `node scripts/lane_review.mjs --grant src/conflict_frame.js --grant src/native_battle.js --grant src/party_battle.js --grant src/feature_expansion_battle.js --grant tests/conflict_frame.test.js --grant tests/fixtures/conflict_frame/feature_expansion_battle.txt --grant tests/fixtures/conflict_frame/native_battle.txt --grant tests/fixtures/conflict_frame/party_battle.txt --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/F1_INTEGRATION.patch --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/F1_CHECKPOINT.md src/conflict_frame.js src/native_battle.js src/party_battle.js src/feature_expansion_battle.js tests/conflict_frame.test.js tests/fixtures/conflict_frame/feature_expansion_battle.txt tests/fixtures/conflict_frame/native_battle.txt tests/fixtures/conflict_frame/party_battle.txt docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/F1_INTEGRATION.patch docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/F1_CHECKPOINT.md`: PASS, tracked=8, private-names=118, name-hit-files=0, top-level-await-files=0, outside-grant=0. Tool calls its candidate count "tracked" even though these lane additions are untracked.
- `git diff --check -- src/native_battle.js src/party_battle.js src/feature_expansion_battle.js`: PASS.
- `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/F1_INTEGRATION.patch`: PASS; hunk is proposed, not applied.
- Full `npm test` and final combined `check:rules`: not run by this lane; committer/coordinator owns the combined gate. No registered rule code changed.

## Exact equivalence boundary and remaining floor

Five seeds: 1, 17, 71, 305419896, 4294967295. Road and party reach won/lost/withdrawn; sluice schemas 3/4/5 reach objective/escaped/won/lost/withdrawn. Each replay compares admission and every staged plan, including logs/knowledge/relationship text and action receipts, their JSON property order, bytes emitted by `persistExpansionPlan` into a controlled native save envelope, and continuation after JSON serialization plus `loadExpansionState`. Party replays include held guard, actual redirection and separate helper release. Extra road/party cases begin with zero or one stamina. Input plans remain unchanged; stale and invalid commands reject.

**No literal `main.js:create_save()` equality is claimed.** The unit fixture supplies `createSave` with a controlled native envelope to the real persistence writer. The coordinator must run the brief's old/new journeys in rebuilt desktop browser evidence, compare actual `create_save()` bytes and Reports, then save/reload/Export/literal Import for each battle. The frozen implementations allow the old test path to be reconstructed. These are remaining agent-side gates, not a mandatory human acceptance gate. Build identity is above; route kind is DEV SEEDED field-workshop fixture, not a naturally earned whole-life playthrough.

## Known limits and expected next refactor (AD45)

The three legacy definitions opt into ordinal xorshift draws to preserve their exact saved cursor and draw ordering. This is the permitted LSD139 compatibility exception. New definitions can provide a keyed random port; this lane adds no keyed-addressing scheme.

Step 2 still owns range bands, morale, situation card, move grouping/choice UI, lead policy and canon fights. LSD85 is represented here by ordered move rows selecting existing operation ports. Means, costs, check math and concrete effect operations remain their current domain code; there is no new serializable move DSL or check_resolver conversion. Extending that format must retain existing quote/effect owners and use demonstrated consumers rather than duplicating them. Side/objective fields describe definitions; saved state retains its original schemas. Cohort unification, deeper shared strike-operation extraction and fully declarative move rows are future refactors, with the same replay suite as the structural guard. No new clock, publisher, persistence namespace or schema migration.

## Input identity for coordinator reuse

Shared HEAD at receipt: `a6a040829081a4cc67e3c4dfd44abc1bc60925ec`. A shared HEAD alone is insufficient; check the hashes and relevant dependencies before reusing this evidence. Concurrent P5 dependencies below were read-only in this lane. The isolated build included the shared checkout at build time and is not an isolated feature-only release candidate.

| File | SHA-256 |
| --- | --- |
| `src/conflict_frame.js` | `562167b8944f1f8aec82fbda9579d7f6b1d31e188d3c5a16388b1d35aa3a5288` |
| `src/native_battle.js` | `2f1cb1cc89ad1b43341cda842ba0a863d71bdf0af4a511fc819f05afc39ef26b` |
| `src/party_battle.js` | `0e532fc39afa0beac94eb587019dcdfb047253206ac2f34390a968a68720f57f` |
| `src/feature_expansion_battle.js` | `babcad96e0b77cfc32d045f6203d5889bd4f45b12f7e2e38e78b8fc1f1f1130a` |
| `tests/conflict_frame.test.js` | `efee7b1dff361c648b983c18d22634a272b7bb4b81b3f4c322347517c480eba7` |
| `tests/fixtures/conflict_frame/feature_expansion_battle.txt` | `9cced9fe3c8ca66c14452dd547314ec053a9e405600bdd8384d48a196bc4e7e5` |
| `tests/fixtures/conflict_frame/native_battle.txt` | `f147a0644f8d17a606436ebe3bbe5694b7ffa9ee83759dc5e0854ddfdc03c3bf` |
| `tests/fixtures/conflict_frame/party_battle.txt` | `7d63d7a0ba26785d883ddecc4b59992b2f9dd9bad03eed69abcea69552dbc3ba` |
| `src/expansion_engine.js` | `4ba8695bbc0185f6e4c357f7b91da5ee9deef6b614f22df9b71d817223367804` |
| `src/simulation.js` | `d463acc5104b53e2407771fd578838495db7b727b13ed49332cf09b33244af99` |
| `src/constraint_store.js` | `698a7c43bd458c75f456cf05accfb50af01942185cb0585f4ed10c48c6e44e9b` |
| `src/constraint_pack.js` | `d3ddfd1827d09eafa926e0a239ec23e6358eb9b30d8870aa2ce1aee3f6aa4a53` |
