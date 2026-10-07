# Earned workshop choice delivery

Status: **implemented-unverified**, source ready for root integration. Parent `01a10fe7-c3cd-79a2-86d0-2eba1fcfcefd`; leaf `/root/earned_lesson`. Original reversible ToME P3 proposal, with names, costs and balance awaiting director acceptance.

`src/audited_workshop_lesson.js` exports five revision1 plain command definitions, pure current facts and a bounded validator. The player must complete their own `feature_objects.install_seal` and at least one actually funded `feature_objects.deliver_kits`, then explicitly ask present willing Eda. Asking and repeated deferral create no stock or benefit. Choice receipts are retained actor facts and paired attributed knowledge under existing typed owners.

The sleeve choice atomically transfers one actual remaining Eda-owned, unequipped, unencumbered native-key charged sleeve. The alternative reserves the player's existing charged sleeve, one salt, one native coin and one stamina from each participant for three played minutes. Successful settlement returns that same charged sleeve with `reservationReturn`, consumes salt, pays the coin into Eda's purse and teaches only controlled resin setting. Both branches explain their foregone alternative; only committed settlement writes `audit_lesson.choice` and `audit_lesson.redeemed`.

The new `audit_lesson.set_resin` recipe requires the completed focused lesson and current supported acquired cooling method. It takes two minutes and spends one charged sleeve, one sap and one stamina, returning the same empty sleeve and one Set repair resin. The original `reference_gameplay.set_resin` definition is untouched and stays three minutes; old frozen jobs retain their original timing. No source, power, mastery, stock refill, new native ID, currency, clock or save root is introduced.

## Exact parent bindings

1. Register `auditedLessonDefinitions.commands` in the common simulation content aggregate. Group is `audit_lesson`; command type is `audit_workshop`. `AUDITED_LESSON_IDS` supplies the five command IDs. Parent routes those commands through the existing `commitSimulationCommand` and publisher, with `actorId: 'player'` and the definition's actual target (`feature_objects.miri` for conversations/choices, null for resin).
2. Call `auditedLessonFacts(state, context, registry)` on admission, preview and completion. Its `context.facts['reference.workshop.supported']` and `['reference.workshop.handsUsable']` must be freshly recomputed by the existing Reference/body owner before this pure projection. Native `gameplay`, `vitals` and `equipment` remain actual live snapshots. Do not reuse an earlier eligibility quote.
3. Add `audit_lesson` to the existing `reservationReturns = 1` job admission list. During `completeJob` completion-support checks for this group, pass the exact popped job transiently as `context.auditWorkshopReservation`. Preserve the still-held bench reservation until support is checked. The module accepts only its exact revision1 costs/effects/participants/completion predicates and matching site reservation. Normal commitment has no transient completion job and requires the actual carried sleeve.
4. Invoke `validateAuditedLesson(state, registry)` from the canonical expansion validator after complete plan construction. Optional absent state stays inert; any new receipt/job requires existing expansion9/10, Reference workshop1 and simulation4. Root owns compatibility/UI/native dispatch/build, including visible learned-recipe action and retained attributed accounts.

## Checks and remaining gates

Owned checks passed: Node syntax, standalone module import, and common `createSimulationRegistry` construction with all five exact revision1 command links. Source inspection confirmed real-stock transfer, reserved tool conservation, current source/knowledge/teacher/willingness guards, mutually exclusive committed facts and unchanged original recipe. `CHECKS.json` stores commands and input/output hashes; `RELEASE.json` seals the released scope.

Gameplay, unit, browser, save/reload/import/failure, keyboard, regression and director acceptance remain deferred and unrun under live AGENTS. Later exercise: committed prerequisites versus previews/cancelled orders; exhausted/equipped/loaned sleeve stock; tool/source/body/teacher consent/contact loss before and during a lesson; exact sleeve/salt/coin/effort refunds; repeated choice/cancel/refusal; publisher/storage failure; learned two-minute output conservation; reload/import; and original three-minute pending-job compatibility.

The current `frontier.field_renewal` declares `reset: []`; its wrapper only reduces Load-bearing Step mastery and field focus/drive, so the new character facts, knowledge and belongings follow those existing retained owners. This is source inspection, not a renewal play/save check or a promise for unspecified future resets.

The ordinary second funded order may overwrite the latest delivery account after the earned offer. Validation permits that existing later order; the immutable first-offer start predicate requires a prior actual delivery. No old order payment or feature-object definition was changed.
