# P16 host join, original proposal

Status: module implemented; native loop implemented-unverified. P00 owns every
registration, combat hook, shared UI, clock, resource and save connection. P06
owns battle extension points. No implicit import-time registration exists.
Target: 1366×768 desktop; show one optional repeatable rung, level, named intent,
counter and actual native receipt. Mobile is deferred. Effects-off suppresses any
presentation cue; mechanics and ordinary readable messages remain available.

## H1 admission and factory

Import `profile.js` exports. Register this content only in the existing
`reference.proto23.village` visitor branch, after natural arrival at native
`Proto23 Dojo lobby`; add an explicit optional training travel choice. Preserve
travel's actual native clock/body admission and existing default campaign.
`createTrainingZone({CombatZone, parentLocation})` returns one native repeatable
CombatZone (one enemy, one group per clear, no challenge/once cap). Native parent
must be the live dojo object. Register base `enemySpecification(beginAttempt(...))`
through native Enemy/bestiary owners with the known original name, without
replacing any old template. Do not invoke ordinary random zone variation for
this opt-in profile. Override only this zone's group factory via P06/P00 hook:
`createTrainingEnemy(state, Enemy)` returns a fresh native Enemy; host sets
`is_alive = true`, calls `init()`, and supplies `[enemy]` to existing combat.
Return pending enemy rather than starting a new attempt on restoration.

Before `beginAttempt(raw, {seed, worldId, locationId, nativeEligible})`, the
host checks the actual selected branch, location, body, custody and native
combat eligibility. Input seed is one uint32 from the saved native RNG; advance
that owner atomically with publishing the pending attempt. Do not derive a new
seed from wall time, menus, reload or Math.random. Context values are authoritative
live reads, never imported claims. Output is a new optional state; input is never
mutated. No extra currency, synthetic clock, starter rewards or free skill grants.

## H2 exchange intent and target-local counter

Call `planExchange(raw, {worldId, locationId, nativeEligible, stanceId})` exactly
once before a real construct exchange using its existing cooldown/exchange
owner. Output `{state, move, countered, status, message}`. Publish state and show
known named intent before resolving the exchange, with normal native timing so
player can select native `defensive` stance (Defensive Measures). P06 must expose
that pause/intent seam and native target-local temporary stat modifier interface.

Use `previewExchange(raw, liveContext)` to show `{move, counterHint}` from the
same saved draw without advancing the cursor. At actual resolution call
`planExchange` with the live eligible stance, once, then publish its next state.
Repeated previews do not reroll. Persist seed/exchange while intent is pending.

On `status`, apply `attackPointsMultiplier: 0.8` to this player's attack points
against this construct for one exchange only. Clear it at the next construct
exchange, on death, escape, leave or settled kill. A player choosing eligible
Defensive Measures before resolution receives no off-balance status. Do not
mutate shared templates, character base stats or every combatant.
Native attacks, hit/crit, damage, costs and cooldowns stay in native combat.
Persist pending exchange/intent with native health and remaining cooldown if the
native owner supports resume. If unavailable, pending-resume acceptance is OPEN;
never silently reroll or claim resumed combat.

## H3 one settlement transaction

A real defeated construct yields event ID `p23.reed-circle:<attempt>:kill`.
Call `planSettlement(raw, {eventId, rank, defeated: true, worldId, locationId,
nativeEligible, dropChanceModifier})` inside the native kill preflight.
`rank` is the actual pending construct level; modifier comes from the existing
custody-filtered native accessory drop modifier and native group scaling, exactly
once. Output `{duplicate, eventId, chance?, loot, state}` uses one saved seed draw,
area eligibility, rank 1–3 and native luck multiplier; probability clamps at 1.
Loot is a native item-id/count array, currently existing Piece of willow wood.
No new item owner or currency is needed.

If duplicate, skip the entire occurrence's XP, loot, progress and receipt.
Otherwise merge this array with creature loot, validate native item IDs/custody,
and atomically publish native inventory, acquisition/discovery, XP, kill progress,
profile `state` and one native receipt for this kill. Call the existing loot
commit once, not a second `process_current_loot`/inventory insertion. Pure planning
alone does not grant items or ensure atomicity. Durable write failure must leave
all live owners and saved state unchanged; deterministic retry returns the same
plan. Serial/CAS check must ensure the planned input state is still current.

After success `finishAttempt(state, liveContext)` retires pending and increments
completed/attempt. Leaving alive uses `finishAttempt(state, {...liveContext,
abandon: true})`, with zero loot/XP/completion; execute before changing location.
Retired event IDs fail admission against the new pending attempt. Counters grow
per occurrence with safe-integer guards, no fixed lifetime once limit.

## H4 optional save envelope

Suggested field `p23EncounterProfile`, absent on old saves. Do not add it until
player explicitly selects this rung. `readProfileState(raw)` returns a cloned
schema-1 state or throws for unknown schema, unknown fields, invalid seed,
nonfinite/corrupt cursor, inconsistent authored level and malformed pending data.
Validate the entire native envelope including this field BEFORE any live mutation.
No source prototype/functions, DOM state or receipts are deserialized here.
Save both profile and native encounter health/cooldown/intent together. The module
contains identity/seed/level/exchange/offBalance/settled, not a separate health or
clock owner. Export/reload/literal-file import must use the normal native route.

## H5 integration acceptance

Play two legitimate rung attempts from natural branch entry, observe stats inside
bands, see Reed sweep, counter it, and show one receipt per real kill; repeat the
ladder. Verify old templates unchanged, failed publication/retry and duplicate
settlement. Save/reload/export/literal-file import pending profile plus native
health/intent/cooldown, and completed state. Test absence and malformed field
without mutation. Rebuild on the integrated candidate, record served hash and
1366×768 evidence. Module fixtures and baseline Village smoke cannot close this
gate. After these technical gates, Weibao's play/taste remains authoritative.

## H6 P06 report reconciliation, 2026-10-14

P06 source commit `a5f9d7a3` adds optional Combat
`encounterProfile: {id, dropChanceModifier}` and native duplicate-defeat guards.
For this rung pass `{id: PROFILE_ID, dropChanceModifier: 1}`. Our rank factor
already lives inside `planSettlement`; do not also multiply it through Combat.
P00 can bind this construct's native `get_loot` adapter to the planned area
array, feeding its one native accessory/group modifier into our planner, but
must stage/install returned state with the same kill publication. The P06
modifier alone does not add an area table or prove durable atomicity. P06
currently does not supply seeded move preview/target-local modifier or exact
fighter/HP/cooldown restore; H2/H4 remain explicit P00 extension requests.
