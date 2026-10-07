# Combat objectives integration, profile combat_objectives.v1

All four assigned rows have authored source, content and validators. **Implemented-unverified; shared integration and root build are still required.** Only root may edit shared files. No new scheduler, inventory, native attack loop or publisher. Reserved worker files are `src/audit_remainder_combat_objectives_{content,state,battle,host}.js`.

## Definitions, current facts, native items and reader

| Shared owner | Exact binding |
|---|---|
| `src/expedition_content.js` current merged simulation definitions | Merge `remainderCombatObjectivesDefinitions`; ten uniquely prefixed commands use Eda's existing fitting site and actual existing people. No new people/site/controller. |
| Native item registration | Register all four `remainderCombatObjectivesItemSpecifications` using the existing `OtherItem` owner, expedition tag and canonical JSON item keys. |
| `src/simulation_effects.js:simulationFacts` and all action hosts | Merge `remainderCombatObjectivesFacts(state,context,registry)` after FRESH reference/object/body/native facts, including `reference.workshop.supported`, `reference.workshop.handsUsable`, `featureObjects.miriSupported`, actual location/Strength/hands/vitals/native bag. Never persist a copied context. |
| Current expansion/audit namespace validators | Add `validateRemainderCombatObjectives(state,registry)` and modules key `combat_objectives`. Optional module is created only by explicit attempt acceptance. Offer/craft actions can use typed existing facts/knowledge without a module. Only expansion11/auditRemainder1; old absence inert. |
| Native load/import/publication joins | `validateRemainderCombatObjectivesNative(state,gameplay)` validates fitting bag stock exactly equals its existing custody count, with the real owner. Root's existing native domain owns load/stage access. |
| `src/reference_gameplay_feats.js:allFeats` | Append IDs from `remainderCombatObjectivesFeatDefinitions`. `ordinary_supply` uses existing allowed provenance `root-conduct-receipt`, not a new feat schema/economy. The host projects its earned row; optionally include the static definition in normal feat UI. |
| `src/simulation.js:startCommand` | Add group `remainder_combat_objectives` to the exact new-job `reservationReturns=1` policy. At the successful accepted player start after real costs, call `recordRemainderSupplyCommandCommit(state,d.id,context.actorId,cause)`. This MUST also cover saved programs/controller starts through the same startCommand. Do not call from preview, candidate-output validation, load or render. It changes only staged state. |
| `src/main.js:persistExpansion` | Call `advanceRemainderCombatObjectives(expansionState,plan,registry,currentContext)` after reference advancement and BEFORE final validation/save/publication. It observes actual handoff and three-kit commission completion, adds one recognition without any money effect, and retains ordinary payment. The current envelope has exact `gameplayBefore` for the supply/handoff joins. |
| `src/main.js` action router / feature work groups / UI | Route definitions in group `remainder_combat_objectives` and explicit `withdraw_recovery`/`withdraw_supply` controls to `commitRemainderCombatObjectivesCommand`. Use `remainderCombatObjectivesPresentation` in the same feature page. Add the group to current job cancel controls. A forged generic command must not bypass the host's module acceptance bookkeeping. |

No popped-tool binder is needed: craft jobs consume raw material only, and the physical preparations/rope are reserved by the native battle admission, outside timed jobs. Supplied practice work uses the existing participant occupation, co-location, completion/refund policy and finite own watch rations. Cancellation returns actual reserved ration/stamina and grants no ready watch.

## Native admission and frozen old encounters

Extend `isFeatureBattleSchema` with 5. Only an explicit enrolled NEW sluice admission chooses 5, leaving existing schema3/4 sessions byte-semantically frozen. In `initializeFeatureBattle`, construct the existing reference opportunity fields for new schema5 as well, then call `initializeRemainderCombatObjectivesBattle(plan,command,context)` after its base battle record is initialized. Apply returned effects through `applySimulationEffects(plan,effects,{actorId:'player'},registry,session.id,{spending:true})`, then validate the combined battle/state. This reserves exact crafted preparation and optional real rope under one session identity. No preview spends stock.

`previewFeatureBattleAdmission` needs to preserve the complete actual admission command, or at least `physicalPreparation`; merge `remainderCombatObjectivesAdmissionReasons(state,context,command)`. The current function only destructures `withHelper`, so root must extend that signature/caller to include the chosen preparation. UI takes `remainderCombatObjectivesAdmissionChoices(state,context)`, merges each returned `command` with `{id:'feature_battle.start',withHelper:<actual choice>}`, and obtains the same admission preview. Always keep ordinary no-preparation admission available.

The learned recipe has a real later consumer after gate success. Existing route completion hides further sluice starts, so the new consent/readiness commands add **one supplied post-passage practice encounter per completed watch**, bounded by both tollkeepers' remaining original two watch rations. Root changes only NEW enrolled start visibility to `seen AND (not routeCleared OR remainder.combatObjectives.practiceWatchReady)`. Normal initial admission remains unchanged. `initializeRemainderCombatObjectivesBattle` requires ready permission for post-passage admission and consumes it. `feature_battle.start` remains the exact parent command/encounter; no second battle adapter. Existing success code already awards route XP only while routeCleared is false. The new practice never clears that flag or pays another reward.

## Quote, costs and actual action execution

| `feature_expansion_battle.js` point | Binding |
|---|---|
| `validateFeatureBattle` | Existing roster/nonce/objective/guard-target constraints stay. Allow guard modes `maintained`/`prepared_guard` only for schema5; call `validateRemainderCombatObjectivesBattle(b,session,state)`. Keep old mode whitelist for 3/4. Treat schema5 as reference-compatible for opportunity/nonce/outcomes validation (`schema>=4`), preserving old4 behavior. |
| `previewFeatureBattleAction` | Call `quoteRemainderCombatObjectivesBattleAction(state,c,context)`. For its `special:true` types (`maintain_brace`, `release_brace`, `recover_fitting`), skip only the old unsupported-type/specific-method dispatch, keeping exact session/sequence/action/RNG/fighter/vital checks. Merge reasons; use its exact cost/targets/stock. For `special:false` physical guard/escape, keep old type validation and use its cost plus extra reasons. Exclude these custom fields from grip/opportunity/maneuver stacking. |
| `commitFeatureBattleAction`, immediately after base payment/before old branches | Call `beforeRemainderCombatObjectivesBattleAction(plan,c,context)` to clear expired/unsupported/strike/helper-lost maintained protection without refund. Then call `applyRemainderCombatObjectivesBattleAction(plan,c,context)`. Apply returned effects via existing executor with cause **`feature-action:${state.sequence+1}`**. When `handled`, use its `text`, skip the corresponding old branch, and apply any returned `escapeGain` to the existing capped escape progress. Old branches remain for `handled:false`. |
| `commitFeatureBattleAction`, EACH incoming requested strike target before mitigation | Use the incoming guard algorithm below. This is an attempted strike, so call before `rollCombatStrike`, even if it ultimately misses. |
| `finish`, after real `actions`/sequence increment, before standard settlement effects/session deletion | Get `settleRemainderCombatObjectivesBattle(plan,session,result,context)` and apply returned effects through the same executor. It returns the SAME reserved rope for all results and unused preparation only when its charge was not spent. It archives the recovery attempt only if this exact new session completed the gate at3 with recovered owner fitting intact; failed passage returns that same fitting. No extra reward. |
| `featureNativeAction` | Call `remainderCombatObjectivesNativeAction(state,context,id)` before old player logic. A returned `handled:true` uses its `action`, including null. Holding maintained protection suppresses automatic player striking; accepted recovery uses ordinary automatic guards so deliberate gate/recovery controls remain usable. Keep one native cadence. The existing schema4 no-strike/opening policy also applies to schema5. |
| `featureBattleView` | Add each `remainderCombatObjectivesBattleActions(state)` row through the EXISTING `add(label,command)` helper, yielding current token/quote/eligibility. Include action suffixes for `physicalPreparation`/maneuver so custom guard/escape buttons have distinct IDs. Existing ordinary/shared-two-target guard alternatives remain visible. |
| Helper unsupported/yield/release removal | Existing guard-filter cleanup removes guards by/for that person. `before...Action` also records explicit helper release. Fit worker bindings retain their own gear/hook consequences. |

Incoming guard implementation (inside the existing requested-target loop):

```js
let targetId=requested, g=b.guards.find(g=>g.target===requested);
// Preserve existing unsupported-helper removal first.
const prepared=b.schema===5
  ? prepareRemainderCombatObjectivesIncomingGuard(plan,c,requested,context) : null;
if(prepared) g=prepared.guard; // null explicitly means no mitigation
if(g && b.fighters[g.by]?.status==='active' && hp(g.by).health>1) {
  targetId=g.by;
  if(!prepared) b.guards=b.guards.filter(x=>x!==g); // old one-blow semantics
  b.guardsTaken++;
}
const temporaryShield=prepared?.temporaryShield ?? (g?.mode==='lash'?4:0);
if(g) stats.defense += prepared?.defenseBonus ??
  (g.mode==='interpose'?3:g.mode==='redirect'?1:2);
```

Keep the existing temporary shield block chance, real native snapshots, normal strike roll, wounds, stamina, actual defended outcome and next-choice window. The maintained hook pays1 from actual staged player stamina before each attempted guarded blow, consumes capacity even on miss, retains the record after first attempt, and removes it after second. Insufficient upkeep returns `guard:null` before mitigation. Prepared guard consumes its one charge and yields defense4/block4, or earned wrap defense5/block5. Hooks do not grant evaded-outcome windows.

## Exact bounded fields and causal joins

`auditRemainder.modules.combat_objectives` is `{schema:1,recovery:{next,current,history},supply:{next,current,history}}`. Each counter is1–4; each history at most3; row IDs must exactly match their ordinal; current plus history count equals next−1. Current row is active/violated with no settlement; ended rows carry actual timestamps/sequences/result. Acceptance command completion counts must exactly equal next−1. Recovery requires prior one-time real owner offer; supply requires prior separately read published terms and still-uncompleted declared `field.supplies` commission.

Recovery rows have exact `sessionId,recoveryReceipt,handoff,completion`, with null fields until actual stages. Receipt is `{sessionId,sequence,action,at,owner,key,loanId,cause}`; actual custody joins the same `feature-action:<sequence>` cause. Completion is `{sessionId,sequence,at,key:'raise_gate',progress:3,required:3,fittingCause,actions}`. Handoff is `{sequence,at,commandId}` only after the real custody return to the consenting owner, completed count1 and recipe fact. While unhanded, successful fitting custody must still exist. One marked fitting remains with owner or recovery holder; old victories/bypass produce no such row/recipe.

Supply rows have exact `commissionId:'field.supplies',forbidden:[four published IDs],violation`. First accepted post-enrollment forbidden player start changes active→violated with `{commandId,actorId:'player',cause:'simulation:<sequence>',sequence,at}`. The forbidden set is `field.pack_focus`, `field.pack_drive`, `skills.timber.pack`, `skills.timber.precise_pack`. Legal ordinary/native crafting, buying, resin/sleeve physical craft and the installed clamping frame are untouched. Actual3-kit delivery archives completed or previously violated separately, with `{commandId:'field.deliver_kits',sequence,at,key,count:3,commissionCount:1}`. Rope delivery ends without feat; withdrawal has separate abandoned result; no deadline exists.

Schema5 field `b.combatObjectives` is exactly `{schema:1,profile:'combat_objectives.v1',physical,recoveryAttemptId,recoveryReceipt,maintainedReceipts}`. `physical` is null or `{kind,itemKey,remaining,admittedSequence,admittedAction:0,reservationId,ropeKey,consumedAction}`. Remaining1→0 once; choice is frozen, rope key is the SAME canonical Survey rope; unspent product returns with `reservationReturn:true`. `maintainedReceipts` at most16, each `{action,target,event,remaining,paid}`. Maintained guard is exact `{by:'player',target,mode:'maintained',remaining:1|2,activationAction,sourceAcquiredAt,expiresAt}`; only one. Prepared guard is exact `{by:'player',target:'player',mode:'prepared_guard',preparationKey}` and must join the spent physical charge. Guard support checks the actual acquired/trained source, current body/hands/Strength, Shared frame mastery6, and real helper gear/consent when covering Lio. Four played minutes is the original reversible expiry proposal; clock never belongs to this module.

## Fit coordination, retention and deferred gates

`b.combatFit` stays the other lane's exclusive namespace. Its balance/grip-rope maneuvers use `c.maneuver`; these physical actions use only `c.physicalPreparation:'guard'|'traversal'`. Both explicitly reject `c.maneuver`, `c.opportunity` and `c.useGripPreparation`. Choosing a maneuver leaves a separately admitted physical charge unspent. Root merges quoted exact costs once; neither consumer stacks on the same action.

The existing field renewal changes only Load-bearing Step mastery, one practice completion and field energy. It retains these attempt/recipe/feat records and existing actual item stock. Active encounter prevents renewal already. No additional prestige or source/library change.

Deferred later gate groups: actual playable branch/material/native outcome; generated old/new/pending/result save/reload/import retention; rejected/stale/shortage/cancel/support loss; injected failed durability/no partial publish/no replay; visible controls/keyboard/director usefulness. Root alone owns combined build. No behavior suite ran in this worker.
