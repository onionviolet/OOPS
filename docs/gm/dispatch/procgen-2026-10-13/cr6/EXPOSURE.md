# CR6 dose, exposure and effect families

2026-10-14. PROPOSAL ONLY. Extends root **II3/AB2**, CR1's [dose/tolerance policies](../cr1/DOSE_AND_TOLERANCE.md) and [S1](../cr1/REPORT.md). Numbers are original fictional laws. [REGISTRY](REGISTRY.md) defines identity/save ownership; [SLICES](SLICES.md) defines the actual player journey.

## F5-F8: source evidence and clock constraint

| Code | Main-checkout file:line | Shown/SOURCE finding |
|---|---|---|
| F5 | `src/mixture_state.js:57-70,92-98` | Whole P2 vial gives reference-normalized health/stamina regeneration and agility reduction for 25/40 minutes. One effect records product/dose/application/expiry and `policy:'replace'`. Its validator checks remaining duration but not equality to current calendar minus expiresAt. |
| F6 | `src/active_effects.js:15-35,515-518`; `src/main.js:4711-4722,4844-4908` | Constructor omits arbitrary metadata; restore explicitly retains mixtureExposure. Ordinary effects need templates and use priority group_tags. This is not a stack/neutralize ledger. P2 use takes a special path. |
| F7 | `src/main.js:5195-5196,6787-6792,7264-7284` | Save writes active payloads and mixture owner; restore reconstructs P2 specially. Native duration loop handles travel/sleep; sleeping debuffs can change the local decrement variable. No new ledger can use that mutable loop variable as its elapsed-time input. |
| F8 | `src/main.js:956-961,1250-1271,7256,7331` | Joined chronicle transitions supply their own effect durations; ordinary paths call update_effect_durations only outside joined clock. Integrating only one path leaves a time hole; running both duplicates advancement. |

Inference: saved expiry metadata alone is not an authoritative P2 timer. Preserve old remaining-duration behavior; do not retrospectively expire an imported P2 effect from calendar arithmetic. No clock defect was reproduced here.

## AB2.a: modules and APIs

| Proposed module | Exports and responsibility |
|---|---|
| `src/exposure_state.js` | `createExposureLedger(bodyRef,clock)`, `migrateLegacyExposure(envelope,bodyRef,clock)`, `validateExposureLedger(ledger,envelope)`, `stageExposure(ledger,delivery,context)`, `advanceExposure(ledger,{from,to,transitionId})`, `resolveExposureEffects(ledger,context)`, `validateExposureProjection(envelope)`. Pure snapshots; stage returns `{ledger,effects,receipt,observation}`. No live stats, storage or UI access. |
| `src/exposure_laws.js` | `EXPOSURE_LAWS` immutable table with `village.mixture.legacy@1`, `village.response.oral@1`; `resolveResponseFamilies(ledger,law)`; `neutralizeActive(ledger,{selector,capacity,ratio,cause})`. Validators reject undefined consumers, unsupported units and conflicting allocation. No arbitrary imported formula evaluation. |

Delivery is `{id,sourceRef,route,count,bodyRef,bodyRevision,appliedAt,lawRef,actualActive}`. For this build `route:'oral'`, `count` positive whole vials, current hero body only. `actualActive` is recomputed from validated source truth and admitted count, not trusted from request. Same request receipt is idempotent; another new paid delivery is allowed. Unsupported routes/body revisions fail before debit. A knowledge gap does not block true response.

`bodyRef` is `{world:'base.frontier',instance:'native.frontier',actor:'player',revision:1}` for the sole original native body binding. Scope is local to the loaded save, never a cross-save global ID. Key it by canonical JSON or an internal safe handle, consistently across AB3. These are explicit adapter IDs for the current native hero, not claims that a generic world-instance/body-ID API exists. Loading another save clears bindings. Actual body replacement/death/prestige requires its owning transition to issue a new revision or explicit carryover; no such new transition is implemented here. Old P2 effects remain under their established life policy. Do not accept an arbitrary NPC name as a receiving body.

Proposed body ledger in `crafting.exposure.bodies`:

```js
{
  bodyRef, schema:1, sequence:0, clock:'native.calendar.played@1',
  evaluatedThrough:clock,
  deliveries:{ /* receipt id -> immutable source, count, active amounts, law, at */ },
  contributions:{ /* receipt id -> family/compartment, remainingActive, expiresAt, status */ },
  totals:{received:{},neutralized:{},expired:{},byproducts:{},discardedNeutralizer:{}},
  tolerance:{}, toxicity:{}, gains:{}, // absent laws are none, never zero-capacity gates
  legacy:null, // optional native-duration mirror of the existing P2 effect
  lastTransition:null
}
```

Only nonzero actual constituent amounts are stored; every component has its declared unit, `fictional-active@response1`. Non-integer fractions use reduced `{numerator,denominator}` with checked safe-integer arithmetic, never UI-rounded values. The first UI only spends whole vials, so no mutable partly emptied instance is needed. Later portions use a holder/instance adapter from P6 M2 and cannot store half a vial in a whole-count inventory.

## AB2.b: family policies and ordering

| Policy | Selected operation | Persistent history and interaction |
|---|---|---|
| Replace | P2's `village.mixture.legacy@1` retains the latest temporary benefit under existing `Village mixture exposure`. Adapter mirrors it for inspection. | Replacing clears only its previous temporary benefit; record replaced receipt, never erase received dose history. No new tolerance/toxicity is retrofitted to old P2 products. |
| Stack | Response **Q-A** and **Q-B** accumulate by active mechanism, route and receiving compartment, across differently named/ratio products. | Sum eligible remaining active amounts, then apply one declared family response. Count/rename/identity does not reset the total. Each contribution retains its expiry. This build uses linear penalties; later saturation is a family curve, not the sum of separately capped doses. |
| Neutralize | Response **N-A** binds only circulating Q-A at ratio **2 Q-A : 1 N-A**. | Consume the exact matched amount and neutralizer; create accounted inert bound material. Q-B, P2 benefit, prior injury and unrelated legacy venom stay unchanged. Unused N-A is discarded/inert under this law, not stored immunity. |

At an action time: advance NEW ledger to admitted calendar boundary → retain expired material as expired accounting → admit delivered actual constituents → allocate neutralization over all eligible Q-A (oldest appliedAt, then receipt ID) → record conversion/remainder destinations → derive response → write consumer/evidence changes together. Poison and antidote in one newly made vial follow the same order; simultaneous neutralizers have explicit deterministic allocation. No double consumption and no secret extra roll. Old P2 replacement is applied through its unchanged revision-1 consumer and then mirrored, never passed through Q-A/Q-B law.

For response revision 1: Q-A penalty is `agility.flat = -sum(Q-A)/100`; Q-B penalty is `strength.flat = -sum(Q-B)/100`. A delivered contribution lasts **20 played calendar minutes**, constant until its exclusive expiry `[at,at+20)`. No injury, tolerance, delayed onset, permanent gain or generic toxicity cap in this fixture. The native stat system may floor final stats; test raw penalty and final derived value separately, do not silently clamp dose. Ordinary recovery remains available by time and bought specific antidote. Large valid repeated amounts remain supported up to exact representation/save limits; no universal once restriction.

Arithmetic witness, specified not run: receive Q-A=500 and Q-B=300; N-A=200 neutralizes 400 Q-A, uses 200 N-A and records 600 bound units. Remaining Q-A=100/Q-B=300; native raw penalties change from agility -5/strength -3 to agility -1/strength -3. A new Q-A=200 then gives agility -3. Earlier neutralization does not cleanse the new delivery. Supportive P2 health regeneration remains unchanged throughout. Existing lost health, if present from another cause, is not restored by N-A.

Every received active closes into remaining, neutralized/bound, expired or discarded neutralizer. Normal carrier mass remains product truth/consumed-source record; do not confuse inert carrier with circulating active. Generic physiological conservation/clearance is not claimed by this original simplified law.

## AB2.c: native effect projection and clock ownership

Create at most one new hero native effect, ID **`Crafting body response`**, containing the sum of Q-A/Q-B penalties. Native tags `{effect:true,medicine:true}` and empty group_tags keep ordinary template-priority removal from deleting it. It has `craftingExposure:{revision:1,bodyRef,ledgerSequence,law:'village.response.oral@1'}`. Generated restore validates this marker and cross-checks stats against ledger truth; it does not call a missing effect template. Description/name use AB3. No raw source ref, constituent, unknown amount or secret truth in visible fields.

The new effect's duration is a derived UI cache until the next contribution expiry; it is not a second countdown owner. Omit/remove the effect when penalties are zero. Ledger remains for histories even after all vials and active effects disappear. P2 effect still retains its original id/name/payload and native duration.

Native clock plan, required for implementation:

1. At every admitted new craft/use/compare action, use `calendarMinutes(current_game_time)` and normalize the new ledger before staging. No wall-clock catch-up on load.
2. For ordinary elapsed-time paths at `main.js:7256,7264-7284,7331`, supply the immutable **actual calendar from/to** once to `advanceExposure`. Skip `Crafting body response` in legacy duration decrement; install the rederived payload. Sleep's actual calendar advance already includes speedup. Never multiply it again for this ledger.
3. For joined transitions, patch `advanceChroniclePlan` (`main.js:1250-1271`) to carry the advanced crafting owner and projected new effect in the same durable plan; publish alongside `plan.effectDurations` (`955-960`). Exclude this marker from that duration map. Sync time-only native transitions that bypass this planner through the same adapter before durable publication. Audit all clock writers before coding the hook; their ownership stays root's.
4. `evaluatedThrough` plus `{from,to,transitionId}` makes repeated delivery of one interval a no-op; out-of-order/overlapping incompatible intervals reject. Split a long interval at each new-response expiry when consumers read mid-interval stats. Closed-browser pause remains current policy. P2 job polling and old-effect timing are not changed.

This build's new penalty is a stat modifier, not a damage-rate simulation. A joined action's existing native consumer must see the applicable penalty at its actual start/boundaries. If that consumer snapshots stats for a long action, split/recompute only through its supported host; do not apply final-state stats to the entire earlier interval. Acceptance includes ordinary, sleep, travel and joined-clock branches. A hook covering only render polling is insufficient.

## AB2.d: old P2 exposure bridge

Validate `active_effects['Village mixture exposure']` against `mixtures.products` first (`mixture_state.js:84-98`). On notebook opt-in, create one legacy mirror with deterministic ID from product/appliedAt/expiry and a migration marker, observed count **unknown historical total**. Save its original dose and current remaining native duration; do not infer how many earlier uses occurred. It is not a new physical exposure or gained knowledge. If native expiry and original metadata differ, keep native remaining duration authoritative and mark the clock basis `legacy.native-duration@1`.

Each later P2 use records a new observed delivery count 1 while still using its unchanged native effect. Sync the legacy mirror from the staged/live P2 effect when saving/advancing; one side cannot extend the other. Recompute no P2 ingredient/profile/dose. An absent active P2 effect means no legacy active mirror, even if notebook observations exist. New ledger imports with a mismatched P2 mirror reject; old absent mirrors remain valid for old saves. `restoreActiveEffect` and import graph validation must preserve the exact consumed source after the vial is gone.

## T-E: meaningful future unit cases

Proposed `tests/exposure_state.test.js`, `tests/crafting_clock.test.js` and extensions to `tests/mixture_adapters.test.js`:

| ID | Required assertion |
|---|---|
| T-E1 | Replace P2 benefit twice while new Q-A/Q-B and received-history remain; latest exact P2 payload/duration is unchanged. |
| T-E2 | Same mechanism in two product keys sums once; two simultaneous 1-vial doses equal one admitted 2-vial dose, including neutralization accounting. |
| T-E3 | Arithmetic witness above; unmatched Q-B/legacy venom/injury unaffected; excess N-A gives no future immunity. |
| T-E4 | Every constituent accounting closes after use, bind, expiry and re-dose; exact rational trace is never zeroed. |
| T-E5 | Native effect restore has exact ledger sequence/payload; forged stats, wrong body, missing consumed product and changed law reject before write. |
| T-E6 | At expiry minus 1/at expiry, split versus lumped advancement agrees; sleep/travel/joined paths advance once; reload advances zero eligible minutes. |
| T-E7 | Old native remaining duration survives despite metadata disagreement; migration idempotent, no fabricated historic dose count. |
| T-E8 | Duplicate/stale delivery, target revision drift, failed write and unsupported route leave all owners, inventory, body and next draws untouched. |

Tolerance/toxicity, partial portions, permanent gains, delayed release, other bodies, gases/coatings and comic mutagens remain reachable extensions in CR1; their own response law and native acceptance must be selected before claiming them. AB2 does not require all of them to ship this slice.
