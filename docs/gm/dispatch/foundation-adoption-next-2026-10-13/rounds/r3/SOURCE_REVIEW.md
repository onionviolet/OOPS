# R3 FA08 bounded source review

2026-10-13. Specialist ownership: NEW `tests/cooling_refinement.test.js`, this report and `SOURCE_TESTS.txt` only. Production writes belong to the actual-ID transferred integrator. Specialist releases these three paths after the final recorded check. No build, browser, private save, pack, source library, commit or native resource mutation was performed by this specialist.

## Findings and corrections

F1: Fresh workshop learning was hidden. The paid lesson's negated `power.reference_gameplay.cooling.owned` predicate had an unknown input for a player with no power record. `rules.js` correctly refuses to negate an unknown value; `referenceGameplayFacts` did not project the absent capability as false. Controlled reproduction opened the workshop through actual commands and bought a sleeve, then the ordinary lesson preview returned hidden. Integrator repaired the feature-specific explicit boolean projection. Test 1 now expects visible and eligible without any supplied power facts. All downstream fixtures now use the ordinary lesson.

F2: Either paid refinement outcome failed at completion with `Knowledge needs its actual situation context.` The cooling result descriptor and validator used `feature_objects.joint`; the existing real situation is `FEATURE_OBJECT_IDS.situation`, currently `feature_objects.sluice`. Integrator changed content/validator to the existing ID and added a narrowly scoped cloned-load migration for already-frozen typo descriptors. Tests exercise successful and failed completion and the old pending typo restoration, preserve the original caller's object and all frozen paid terms, and reject a simultaneous altered cost.

F3: Source matches the existing cost and consumer contract. Workshop opening stocks Eda with two charged sleeves and eight salt packets, separately from player ownership and learned method. Paid stock transfer does not grant capability. One lesson and three paid supervised trials reach mastery three, leaving five salts if all eight were bought and no other salt consumer was used. Cancellation does not restore the RNG draw: the accepted draw remains consumed, while reserved salt/stamina return and no result is installed. Source/power/body/Village support loss refunds without completed-result history. A completed failure spends reserved costs, increases the completed retry count, uses the capped +15-point probability projection, and adds the existing five-minute max soreness condition. Success grants one application; application consumes charged sleeve and two stamina, returns one empty sleeve, and installs the existing five-minute hook field. Old direct four-minute hook work validates and expires normally.

F4: Integrator reported and repaired a native startup ordering failure in `feature_expansion_battle_host.resume`: a display refresh ran before `Combat.start()` initialized healthbars. The host now registers combat, synchronizes fighters without display refresh, starts combat, then synchronizes with refresh and renders. Test 18 calls the actual `createFeatureBattleHost` with a legitimate controlled earned-application stage and mock Combat/Enemy; refresh refuses until start has created its mock bars. It checks pre-start NPC stamina/alive synchronization, exact set/start/refresh/render order, no persistence or spend during resume, unchanged caller state and a running host. This models the observed ordering boundary; the integrator separately owns the final-byte native rerun.

## Current controlled evidence

`node --test tests/cooling_refinement.test.js`: **18/18 PASS**, raw TAP in `SOURCE_TESTS.txt`. Groups cover ordinary lesson visibility, finite owner stock/capability separation, paid pending quote and one RNG draw, calendar/focus and capped retry projection, cancellation and duplicate/stale rejection, support refunds, success/application/expiry, failure costs/soreness/retry, legacy direct compatibility, missing/custody/equipment/body/source/calendar/contact/bench constraints, pending tampering and duplication, forged result attribution, durable-write failure and retry at six materially distinct boundaries, legacy descriptor migration, actual boundary stamina refund, and actual hook candidate suppression with guard/jab fallback, and combat startup ordering.

The publication group stages purchase, refinement reservation, cancellation, success settlement, failure settlement and application. Forced `storage.setItem` quota failure leaves caller-owned prior plan/state/gameplay, prior serialized bytes and the live inventory bag unchanged. A successful durable retry serializes exactly the new expansion state and publishes exact stock once; repeated publication preserves the same counts. This is a controlled source publisher test, not evidence that the browser's real failure seam or player UI was exercised.

The joined source helper retains fixture vitals because `advanceSimulation` normally returns its staged vitals only for causal-story saves. The direct shared simulation boundary independently checks the support-loss stamina refund. No claim is made that fixture helper vitals retention proves native stamina recovery.

## Binding and limitations

Hashes at the final focused run:

| File | SHA-256 |
| --- | --- |
| tests/cooling_refinement.test.js | 8bd00e9154ff1120dda56863a4874655bc9954ef93f6bb392845610b58c4cfa4 |
| src/cooling_refinement_content.js | 7592e7eab9d2a98c6d7c3d6873f8bab8004bccaaed6b1a9aee3f70ea554de38d |
| src/cooling_refinement_facts.js | 06f38550687744ee52c22e61f0ab32d1a56b48fc1dc302cae66333bf5f82070f |
| src/reference_gameplay_host.js | 4be727ee6c811c2e5a56d8a06ffbec20c22f0ebb745dd000ee70c1c646cd777a |
| src/reference_gameplay_content.js | 3fa019466bb366e34e9c56a7973664c1c76cc6caa058bb2492b1406575efd61f |
| src/expansion_engine.js | 530eecd10b634f31e41679bbd983d9ebb73bc56ca8c48eff7d1c11da7e4a99bb |
| src/feature_expansion_battle_host.js | 6942643d331d9bd3297607d21a5e392cc03c9963f24b2559b13eac5031137b00 |

All stock/funding/body/calendar fixtures and bounded deterministic seeds are explicitly controlled SOURCE evidence. Selecting a deterministic test seed to cover an opposite outcome does not authorize or describe a native replay. Source JSON restoration and publisher envelope reloading are not literal-file import proof. Native finite-budget outcomes, desktop controls at 1600x1100, storage-failure UI, real Save/reload, literal Export/Import and final served-byte/build binding remain the integrator's separate gates. Mobile and broad UI changes remain deferred. No taste acceptance, whole-chain completion or commit is inferred.
