# Keeper guard crossings, MS3

Worker base `e68a175d3` plus the coordinator-reviewed first and second Keeper changes. Rules applied: AR3/7/9/11, AD36/38/43, KW4/10/11/18–21 and MC4. This is a structural extraction for the existing routes. Gameplay expansion remains deferred.

## Source and consumers

- `src/gu_guard_working_host.js` runs the hazard packet and guard-layer rows through `resolveGuDefense`. Both existing native paths in `src/gu_hosted_wolf.js` reach it via `src/gu_keeper_defense.js`: the four layered demonstrations call ordered `demonstrate`, and the blast-lane actions use `search` and `cross` via the existing Gu goal search and procedure runner.
- `src/gu_keeper_defense.js` supplies the existing typed packet dials, ordered guard roles, layer bindings and damage threshold as data. Ability effects and funding still come from the catalogue and existing activation resolver. The adapter owns readiness, operation IDs, costs quoted from reserve deltas, and the recovery note. The hosted wolf and pack still publish native dose, essence, damage and relocation effects. The separate Scale Armor stone-run guard retains its own mechanism.
- Module count for this lane: zero Keeper modules deleted and one shared host added. The adapter went from 180 to 167 lines, and the host is 36 lines. Keep the adapter for Keeper-specific custody, receipt validation, and projection to the existing command pack. Count no deletion credit toward MS3 for this slice.
- MC4: the defense note key and its `{operation, at, shieldAt}` JSON, completion IDs, readiness keys and location IDs are unchanged. Historical results still reconstruct after a guard is lost. Current options and execution use current custody and reserves.

## Checks

- `node --test tests/gu_upkeep.test.js` passed 54/54. Added tests for a bare demonstration, exact quote and crossing receipt, shot and shield recovery, an admitted route losing its armor, reserve loss, and serialized fact, completion and view parity after armor loss.
- `node --test tests/gu_workshop.test.js` passed 40/40. Existing typed damage test and new test for stale crossing bindings, synchronized beat rollback and the direct activation's prior paid stage.
- Inline `node --input-type=module` comparison against the reviewed pre-edit adapter passed 200 fixtures and 4,400 paired attempts. Compared exported operation maps, readiness, quotes, views, return values or errors and complete fixture mutations across armor/Jade availability, reserves, clock boundaries, prior shield receipts, all 11 operations and power 1 or 2.
- `git diff --check` passed. Prior return matched the coordinator's archived `keeper-trials-return.md` byte for byte before replacement.

## Coordinator follow-through

Implemented, below the AD43 floor. Coordinator owns the rebuilt browser routes `--layered-defense-only` and `--defense-research-only`, including save, reload, Export and literal Import, and the integration gates. The Gu procedure keeps the existing synchronized beat semantics called out by KW20. Moving the goal runner onto kernel composition and removing the remaining native Keeper adapter are outside this extraction. No new working records or save migrations were needed.
