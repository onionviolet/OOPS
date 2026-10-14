# P06 native join request, 2026-10-14

Proposal/source implementation, native integration OPEN. Target 1366×768 desktop;
visible outcome is known Throw, Smoke escape, Lure, Break after exchange and Resume
controls alongside the unchanged native fight/stance controls. Mobile deferred.
No foreign code/assets, enemy templates or shared registrations are authored here.

## P00 signatures and preflight

Import `TACTICS`, `validateCombatOptions`, `createCombatOptions` and
`validateEncounterCombatProfile` from `runtime.js`.

Optional root family `combatOptions` has schema 1. On load/import, call
`validateCombatOptions(candidate.combatOptions)` before ANY game mutation. Missing
family preserves old-save behavior. Runtime constructor clones its input.
`snapshot()` returns a detached serializable state with selected tactic,
break request, phase and last paid event. Unknown schemas/extra fields reject.

`createCombatOptions({state: candidate.combatOptions, host})` requires:

* `preflight({tactic,eventId,itemId,count:1,context}) -> boolean`: check save-owner
  lock, known item/route, actual usable player custody, active zone/actor,
  available inventory, native played clock, current combat/action eligibility.
  Throw/smoke require a living native target; smoke requires a valid safe return
  route; lure requires an authored opportunity publisher/profile; training requires
  a legitimate noncombat action and native Throwing skill. Reject before payment.
* `consumeItem(request) -> boolean`: atomically debit ONE actual inventory key
  from the request's registered item ID; never debit singleton template data.
  Validate count/custody first. On refusal preserve inventory and return false.
* `escape({eventId,context,awardKill:false})`: end current Combat, clear timers,
  move through native safe return/travel owner. Never call kill_target,
  finish_combat_round, XP, loot or clear progress for the escaped enemies.
* `offerEncounter({eventId,context})`: publish one repeatable, authored P16/native
  encounter opportunity through its saved real-event receipt. No direct enemies,
  kills, XP or loot. A failed/unavailable publication must fail preflight.
* Optional `trainThrow({eventId,xp:1,context})`: native skill XP after a paid
  noncombat throw; normal played clock/action/custody rules apply.

All callbacks are synchronous. P00 must wrap consumption, state snapshot,
transition/publication and save in its native transaction. They must not throw
AFTER consumption; do not use an asynchronous resource write here. This module
is not a replacement transaction/save owner. Snapshot/persist the post-call state.
The host's real event cursor must survive save/reload/import and increase safely;
no wall-clock ID, render counter, duplicate callback or lifetime once limit.
Repeated new events can pay/use again. The last paid cursor rejects stale events.

Register original stackable proposal IDs in `TACTICS`: P23 throwing stone
(physical attack power 5), P23 smoke pellet, P23 scent pouch. Provide a public
paid acquisition/training route in the existing native world. Do not silently add
them to user saves. Numbers/acquisition are proposals for director taste.

## Combat construction and controls

`new Combat({attackers,defenders,combatOptions:runtime,
nextCombatEvent:()=>host.nextSavedRealEvent(),encounterProfile})`.
Normal native combat only; special/actionAdapter battles reject tactics.
`runtime.select('throw'|'smoke'|null)` queues one use at the next hero cooldown
completion. Actual debit occurs then. Missing/denied items leave selection pending
and preserve the ordinary swing. Throw replaces the swing, is one projectile,
and uses native accuracy/shields/crit/armor/hit/defeat/XP/loot. Native weapon wear
remains in that path. No foreign throw formula or extra attack timer is introduced.
`runtime.lure(eventId, context) -> boolean` is a host action, only opportunity.
`runtime.trainThrow(eventId, context) -> boolean` is paid native noncombat training.

`runtime.requestBreak(boolean)` requests a pause AFTER the next hero exchange.
It clears all timers, preserves surviving fighter objects and sets exchange-break.
If that exchange wins, native per-kill rewards have already settled, but group
clear rewards/next spawn are held as encounter-break until Resume.
`combat.resumeCombatOptions() -> boolean` resumes once. Exchange-break restarts
cooldowns through native start(); encounter-break calls native finish_combat_round
once. No new enemy is rolled while inspecting. Escaped is terminal for that
Combat; P00 resets the family's phase for the next legitimate new encounter while
preserving selected choice and lastEvent (validate the resulting state).

Native saves do NOT currently persist exact ordinary enemy/cooldown state.
P00 must persist/restore surviving fighter HP/identity, zone/profile and the
pending group completion if it supports restoring these phases. Restore paused
without calling start/finish. Do not import encounter-break into a newly rolled
fight and award phantom group credit. If unavailable, leave those persistence
paths OPEN rather than claiming state JSON tests prove full native restoration.
Subtick timer position is not serialized; explicit resume restarts cooldowns.

## P16 narrow input

`encounterProfile` is optional `{id:string,dropChanceModifier:finite[0,100]}`.
Validate before encounter creation/import. Omitted profile leaves vanilla unchanged.
Its modifier multiplies native accessory/group drop modifier at target.get_loot;
loot still passes native process_current_loot then actual inventory publication.
P16 owns authored band/template/move/drop rules; P00 can bind an authored
get_loot context using native zone/rank/luck at encounter creation. Profile ID
alone reveals no hidden templates/drop truths. No second loot publisher here.

## Acceptance

P00 must exercise fresh-origin rebuilt UI/acquisition/throw hit+miss+armored defeat,
two paid uses, reward-free smoke, repeat lure opportunity, break/Resume, and
pending/settled Save/reload/Export/literal-file Import plus invalid-schema controls.
Known-only display and Effects-off master switch are inherited requirements.
Module/isolated Combat tests are source coverage. Integration candidate and native
acceptance remain OPEN. After technical gates, Weibao's play/taste remains human.
