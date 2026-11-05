# B3 Spirit Vision exhaustion calibration, 2026-11-04

Atlas A1/F6 follow-through ([atlas refresh](../../../reports/PROGRESS_ATLAS_REFINED_2026-11-04.md#evening-refresh-2026-11-04-head-f15a37f90)). Proposal under AD49 (calibrate to the lore), AD38 and limits-as-adjectives. **Implemented, below floor (AD43):** no native browser route yet.

## What was wrong

`src/book_world_lotm_be_seer.js` let Spirit Vision switch on only at zero exhaustion, and every switch-off applied exhaustion until sleep. That is one cycle per sleep. It matches ch33's first use but not the later text: Klein switches it on and off several times a day (English v1 ch62, ch69 P007/P080, ch70, ch95; ch84 "diligently practiced"). KJ3AC and KJ3AE recorded those repeats as facts because the model refused them.

## Change

- Exhaustion stacks (`stacking: 'sum'`): each switch-off adds one notch, same 720-minute fallback expiry, sleep (`beSpiritRestEffects`) clears all notches.
- Switch-on requires exhaustion at most `BE_SPIRIT_EXHAUSTION_LIMIT - 1`. Dial `BE_SPIRIT_EXHAUSTION_LIMIT = 3`, set from the ch62 day's three switch-ons. Refusal reason: too worn, sleep first.
- B1 pool cost per use is unchanged and remains the real per-use barrier.
- Save compatibility: saved condition entries hold intensity, expiry and cause only; an existing intensity-1 exhaustion reads as one notch. No migration needed. <!-- slip-ok: Describes the recorded saved-condition fields for this receipt, not a universal design constraint. -->

Earlier receipts stay valid: KJ3AC's asserted states (exhaustion present after `paid` and `evening`, absent after `night`, pool spend) are unchanged. Their repeat-use facts could now go native in a later replay; not redone here.

## Checks

| Check | Result | Gap |
|---|---|---|
| `node --test tests/lotm_be_seat.test.js` | 19/19 pass; B3 test now covers repeat switch-on, refusal at the dial, JSON round trip, sleep clearing | Fixture, not a native journey |
| `node --test tests/lotm*.test.js` | 345/345 pass | |
| esbuild of `src/main.js` to scratch | Compiles | Shared `dist/` not rebuilt (other writers' dirty source) |
| `npm run check:arch` | Pass | |
| Native browser route, reload, import | Not run | Needed for floor: kjw22's ch69 P082 glance and any ch70 repeat use are the first consumers |
| Full `npm test`, `check:rules` | Not run | Pre-commit gate |

## Next

kjw22 can make its ch69 P082 glance and ch70 repeats native with the existing `beSpiritVisionOnEffects` / `beSeerUse` / `beSpiritVisionOffEffects` acts; that native run is this slice's floor evidence.
