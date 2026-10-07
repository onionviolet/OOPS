# Bounded battle5 source review

**Source-only: no open actionable battle findings.** Three P2 source defects were repaired by root and their affected final source was reinspected. New gameplay remains **implemented-unverified**; no behavioral or save gate passed or ran.

## Repaired findings

1. **B1, P2: schema5 defense openings rejected.** `feature_expansion_battle.js:178–184` initially admitted only schema4 in `opportunityReasons`, while5 could earn and display the same retreat/counter opening. Line182 now rejects only schemas below4. Exact attacker, current player move and action/target checks remain;3 stays excluded and4 retains its prior meaning.
2. **B2, P2: physical brace/recovery missed actual hand capacity.** New maintained-brace and recover-fitting predicates checked tenderness but omitted explicit hands<2. `audit_remainder_combat_objectives_content.js:1,40` and `audit_remainder_combat_objectives_battle.js:1,80` now use the existing actual hand-capacity/life/soreness helper. The ordinary native paths were not changed by this repair.

3. **B3, P2: new enrollment could alter frozen helper support.** `helperReasons` selected fit support merely from the root owner and was reused by saved3/4 helper/signal previews and native helper cadence. `feature_expansion_battle.js:71–72` now selects it only for a current5 session or a new admission with no current battle. Frozen3/4 always use their earlier `skills.lioSupported` predicate. Normal enrollment reachability does not replace the explicit compatibility contract.

These failure consequences were inferred directly from source. No encounter/action was executed to reproduce or validate them.

## Source observations

- **Admission and old readers:** `feature_expansion_battle.js:76–108,141–142` selects5 only for a new opted-in admission and installs both namespaces with reference opportunity fields. Saved3/4 select their existing paths; `audit_remainder_combat_fit_hooks.js:84–89` returns null for their native stats. The three shared module copies in the previous source map match the first-wave baseline hashes.
- **Paid native actions:** `feature_expansion_battle.js:216–293,315–321,347–349,406–425` derives one base cost, applies the exact quote, pays once and uses the same final cost for Lio cadence. Native Combat remains the action scheduler. `feature_expansion_battle_host.js:28–30,65–77` binds current token/ownership/native stats and delegates to the same planner/publisher.
- **Maintained guard:** `audit_remainder_combat_objectives_battle.js:90–130` clears unsupported/expired protection and charges each incoming attempt before its roll, including misses. Insufficient upkeep drops mitigation first. `feature_expansion_battle.js:350–380` uses staged post-upkeep stamina and native defense/shield/roll/mitigation without a second random draw.
- **Gear and settlement:** current admitted actual fits are native stats owners at `feature_expansion_battle_host.js:19–22,59–63`; `feature_expansion_battle.js:363–387` quotes hook resistance before HP loss and retains normal hit damage/disruption. Its finish299–313 invokes both settlement owners before deletion. Exact unspent prep, same reusable rope, fitting custody and reserved/spent grip use existing effects/receipts; recovery success requires this gate3/custody result. Route-cleared practice adds no second passage XP/payment.
- **Receipts and visible controls:** `feature_expansion_battle.js:384–398,451–472` advances one action/sequence, stores parent nonce plus optional receipts, and gives grip/maneuver/physical rows distinct IDs through the actual quote. `feature_expansion_powers_host.js:38–54,78–81` routes preparation/helper admission through the same preview and initializer. Current registered battle/fit/objective command definitions equal source exactly.

## Checks, hashes and limits

[CHECKS.json](CHECKS.json) records16 source syntax checks with no failures and a successful cold registry import. Cold import totals are recorded per check; unrelated root causal/artifact additions affect those totals and were not reviewed here. Exact battle/fit/objective definition equality passes. Baseline source-map comparison supports source/path inspection only, never changed-gameplay proof.

[INPUTS.json](INPUTS.json) records initial and final SHA-256/bytes. Battle, objectives content and objectives hooks moved for the named repairs and were reinspected. `audit_remainder_state.js` also moved for independent root work; only its continuing schema11/enrollment predicate was refreshed. The added B3 source repair was reinspected, syntax-checked and cold-imported again. No captured input moved during final resealing checks at **2026-10-06T20:19:28.592139+00:00**. Later source changes are not covered implicitly.

Independent causal/artifact/main consumers, current packaging, unit/gameplay/browser/save/reload/import/failure/regression/keyboard/director acceptance are excluded or deferred. No runtime/code/canonical/private-save/library files were changed by this reviewer. Review is complete and `review-battle/` ownership is released to root.
