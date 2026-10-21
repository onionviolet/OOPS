# Native feedback and summaries lane

Owner: `src/palette_feedback.js`, `src/palette_feedback_domain.js`, `src/settled_text_effects.js`, `styles/palette_feedback.css`, `tests/palette_feedback.test.js`.

Scope: LD1/LD3/LD4/LD8/LD10/LD11/LD12, MC3/MC4, UF7/UF8/RUC4. Rules: AR1–AR8, AR10, UR35/UR37/UR38/UR47/UR52/UR56/UR58, AD6–AD8/AD15–AD17/AD34/AD40. Palette remains proposal vocabulary; these are bounded native adaptations, not acceptance of each reference example.

## Implementation

`createPaletteFeedbackLedger` is presentation-only session memory. It requires a prior observation for tools and competencies, a distinct subject identity, a real activity boundary, and a real place-return baseline. It does not write saves, run a clock, draw randomness or infer undiscovered facts. `createReceiptGate` consumes hidden-tab receipts so returning to a visible tab cannot replay them. Existing settled effects continue to own sound, reduced motion and static presentation; the new domain reads location presentation settings through `readPort('presentation', 'location')`.

`palette_feedback_domain.js` registers one observer domain over existing Tools, Harvest and Lamplight projections, `character`, `records`, `expansion`, and `current_location`. Its `around-place` panel provides session-only return comparisons for carried inventory, individual tool conditions and known positive-level skills. It summarizes the committed carcass-processing result and its actual carried destination. Local rain/snow and lamp-lighting cues attach to existing `quiet_place_detail` or `weather_div`; the current local-scene text remains owned there. First mount and every save load seed baselines without a cue. The implementation does not add a return archive or persistence.

## Palette mapping and limits

| Entry | Delivered native behavior | Remaining boundary |
|---|---|---|
| LD1 | Per-instance tool condition change; same-name spare starts a separate baseline | Other tool/material patina needs native condition facts |
| LD3 | Condition recovery uses a guidance motif; wear uses a closing motif | Body recovery/posture cues need a selected body event consumer |
| LD4 | Harvest outputs report `carried`, matching `grantHarvest` custody | Other transfer/overflow destinations need their own committed receipts |
| LD8 | Known exposed rain/snow transition and actual lamp ignition use existing local scene anchors | No creature/object following or broader weather transition history |
| LD10 | Reuses settled-effects sound toggle and effect cap; defaults stay quiet | Actual profile callback requires root's `presentation` port integration |
| LD11 | Return digest compares current observer-safe snapshots to the last observed departure snapshot | Session-only; no durable or encounter digest |
| LD12 | A real known skill level increase gets a short competence cue | No authored action pose or humor without an action-specific consumer |
| MC3 | One committed carcass-processing boundary summarizes exact outputs | Not a general multi-activity batch/archive |
| MC4 | Place return digest preserves changed/new/missing snapshot rows | Encounter digest remains open |
| UF7/UF8 | Small local weather/light response and bounded summary surface, with static text and existing scene layout | No physical layout/physics scene or local actor simulator |
| RUC4 | Text-first cues use only known local weather; no hidden-property tint | Broader world palettes remain with their local observer projections |

## Checks and gates

`node --test tests/palette_feedback.test.js`: 5 passed. `node --check` passed for all three new/changed runtime modules. Regressions cover first observation, separate tool identity, known return deltas, committed-boundary dedupe, skill-level increase, and hidden-tab no-replay.

No build, full suite, architecture check or rebuilt-browser exercise was run in this lane. Root owns importing the domain through `ui_extras.js`, CSS import, shared-port integration and combined verification. Until that integration and a fresh desktop browser journey at 1920×1080, the consumers are source-implemented but runtime-unverified. Human visual/play acceptance remains open.
