# LP2 assignment record proposal

The player completes one known hand-work timber job and watches the craftsman's lever demonstration, in either order. The task record shows both evidence receipts, teacher return, the checked pivot rule, paid practice and learned status separately. After both evidence steps, explicitly return the records, explain the displayed pivot rule and finish the existing three-minute supervised practice. Evidence and return grant no lever method. The hand-work job keeps its ordinary one-kit result.

2026-10-14. Authorized reversible **PROPOSAL** under the LP2 dispatch and [common rules](../../gm/dispatch/hogwarts-legacy-decompile-2026-10-14/LP_COMMON.md), extending [LP2](IMPLEMENTATION_PACKETS.md) and [P1](../hogwarts-games/IMPLEMENTATION_PACKETS.md#p1-a-lesson-changes-a-known-field-task). Original Village content in the current world, without a new world or prestige layer. Fiction and balance await Weibao's play.

## Try it

Meet the Village craftsman through the existing introduction and gather a carried Rough wood log. Open **Notes, practice & people → Here → Field association & workshop → Ask about a shared field workshop → Wedged timber & lever lesson · PROPOSAL**. Joining the association is not required.

Choose **Free wedged timber by hand** and **Ask the craftsman to demonstrate lever-setting** in either order. Hand work costs one actual log, three stamina and six played minutes, yielding its ordinary kit. Its pending or cancelled job is not evidence. The record names the missing step. Then choose **Return the hand-work and demonstration records to the craftsman**, **Explain the rule: brace near the pivot, lift the far end**, and **Practice lever-setting with the craftsman**. Practice keeps LP1's one coin, one stamina and three played minutes. Learning occurs only at its supported completion. Routine hand and lever jobs remain repeatable with actual inputs.

Target: **1366×768 desktop**. The task record sits above lesson controls in the existing scrollable notebook, beside stock, vitals and Local actions. Mobile optimization and other packets are deferred. Try the own-worktree rebuilt proposal at http://127.0.0.1:8195/.

## Files changed

| File | Change |
|---|---|
| `src/lever_lesson.js` | Revision-two lesson context, evidence join, explicit teacher-return receipt, practice/return guards, read-only task projection and missing-condition messages. |
| `src/field_ui.js` | Put the record first in the existing lever group and retain the old LP1 lesson route visibly for legacy profiles. |
| `tests/lever_assignment.test.js` | Both orders, pending/cancelled evidence, separate rewardless return, paid practice, refunds, current loader compatibility and teacher refusal. |
| `tests/lever_lesson.test.js`, `tests/fixtures/lp1-lesson-v1.json` | Exercise original LP1 definitions from `277c8ffd` against the current loader and scheduler. |
| `lp2-evidence/` | Reproducible isolated desktop harness, results and screenshots. Disposable exports remain private and ignored. |

No save-schema, scheduler, main shell, calendar, practice input/cost/output or application-stock changes. LP3 owns practice inputs. Existing completion receipts, attributed knowledge, saved situation revisions, power acquisition and frozen jobs remain the owners.

## Compatibility decision

D1. No migration and no new required top-level field. Existing optional `field.lp1.lesson` snapshots retain their saved revision. New demonstrations create revision two; their teacher return is optional attributed knowledge at `field.lp1.returned`. Hand evidence comes only from committed `field.lp1.hand` completions. Rendering and loading never create evidence, a return receipt, power, money or kits.

D2. An already-started revision-one LP1 lesson keeps its original terms. Its task record explicitly says “existing LP1 instruction retained.” Demonstrated and explained profiles can finish the original route without a retroactive hand assignment or invented return receipt. Paid revision-one practice retains its exact frozen costs, effects, support and duration. Learned profiles keep their method and cannot repeat the lesson reward. An old profile with no lesson receives nothing and starts revision two when it chooses the new demonstration.

D3. Revision-two practice requires returned evidence as well as the existing checked pivot rule, body, location and teacher support at start and completion. Save/reload/Import preserve the existing completion and provenance receipts rather than replaying settlement. Cancellation or lost support refunds the reserved tuition and stamina without learning. No offline policy changed.

D4. LP5 still owns the shared daily 08:00–18:00 teaching window. LP2 consumes its existing fact and checks the craftsman's actual `work.order` / `field.partsOrder`, as well as scheduler occupation. Evidence survives a closure or commission override; no missed-class penalty, backpay or term calendar is added. The reserved practice job does not mistake its own teacher reservation for an external commission.

## Checks

V1. `npm run build`: PASS, including the existing Ink check. HTTP 200 bundle bytes matched the local rebuilt bundle exactly. SHA-256: `f280e82fa2f3a5cfb0bf43739ff74fc02dac4fee21c47de192969dfff674694d`.

V2. `node --test tests/lever_lesson.test.js tests/lever_assignment.test.js tests/field_workshop.test.js tests/teacher_window.test.js`: **27/27 PASS**, including **5/5 LP2** and **5/5 original LP1** checks. Current-loader exact-state coverage includes absent lesson, old demonstrated/explained states, frozen revision-one paid practice and learned state. Both new evidence orders, actual spending, method refusal, no replay, pending/cancelled hand work, lost-contact refunds, teacher closure and commission refusal pass. Initial new-test assertions assumed the optional power-owner map existed before learning; changing those assertions to accept its absence fixed the test harness. No unrelated failure was repaired.

V3. `npm test`: **1,470 tests, 1,467 PASS, zero failures, zero skipped, three existing TODOs**, 134652.120416 ms. TODOs concern legacy native combat RNG, local-life search/contact RNG and encounter/loot/craft/market/gather RNG. No pre-existing failure occurred.

V4. `node docs/research/hogwarts-legacy/lp2-evidence/checks/browser.cjs`: **10/10 groups PASS**, zero page errors, ten screenshots on rebuilt fresh isolated origins at **1366×768**. Both complete evidence orders were played. Save/reload/Export/literal file Import passed at one-evidence and pending-practice checkpoints; returned and learned literal Imports preserved exact knowledge, power, situation, completion, inventory and money records. No method before paid practice completed, no duplicated hand kit, no repeated return, no tuition respend or method reward replay. [Results](lp2-evidence/results.json), [missing evidence](lp2-evidence/hand-02-one-evidence.png), [returned but unlearned](lp2-evidence/demonstrate-03-returned.png), [pending practice](lp2-evidence/demonstrate-04-practice.png), [learned](lp2-evidence/hand-05-learned.png). Assignment, missing-evidence, return, practice and learned desktop screenshots were visually inspected. Disposable exported profiles live in ignored `private/lp2-evidence/`.

V5. Source, tests, report and harness `git diff --check`: PASS. `node --check` on the browser harness: PASS. Source/tests commit: `430a8a4b`. No installs, pushes, merges, main-checkout writes or player-save edits.

## Limits and integration

R1. Browser proof uses the repository's disposable `craft_ready.save.txt`, which supplies craftsman access and two carried logs. LP2 evidence, return, explanation and paid practice are then earned through actual UI commands in fresh isolated browser contexts. It does not prove the full elder/combat/craftsman introduction or natural gathering journey.

R2. Legacy LP1 states, cancellation/lost-support refunds, teacher closure and bench-order refusal have focused source coverage. Native legacy LP1 import, teacher closure/commission refusal and cancellation/lost-contact refunds remain **implemented-unverified in this lane's browser**, with focused source coverage. LP5's report owns its earlier native window/commission proof. No additional LP2 acceptance-path behavior remains unexercised; the two permitted evidence orders and their persistence are verified above. Mobile is deferred.

M1. Reviewed `codex/gameplay-foundations` at `d40b80cb`. No changes to `src/lever_lesson.js` or `src/field_ui.js` occur in that branch since the merge base with `277c8ffd`. Live sibling review found LP3 source commit `404ebb05`, which adds a `LEVER_PRACTICE_BRACE` import and changes practice label, costs, learned account and description in `lever_lesson.js`, retaining revision one. Preserve those input/cost/text additions together with LP2's revision-two command and returned-evidence guards. Extend the task record's final practice requirement sentence to name the combined brace requirement. LP3 did not change `field_ui.js` in that commit. Combined-source and browser checks belong to integration; no merge was performed here. New lesson-context revision two identifies LP2's evidence policy independently of the practice command revision. Other lanes adding field groups or controls must retain these small UI changes.

M2. Generated `dist/bundle.js`, its map and `index.html` are local verification outputs, excluded from the lane commits as in LP1. Rebuild the combined source after integration. This lane does not merge, push or edit the main checkout.

The required technical gates passed. The one remaining authoritative acceptance gate is **Weibao's play and taste**.
