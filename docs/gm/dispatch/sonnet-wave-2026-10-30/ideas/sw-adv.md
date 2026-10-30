# Idea intake: sw-adv

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

## Slices 1-4 (ability records, Seq 7 rung, costBasis, learnables), 2026-10-30

**ACT NOW (done)**
- Unstated costs, limits, teachers and practice are listed per record (`unstated`), never filled silently.
- Cost ordering is cited (`costBasis.rank`) and tested, so authored amounts cannot flip the source's ordering.
- Backlash stays a hook (`failure.hook`); learnables reuse the engine power and practice model.

**ACCOUNT FOR NOW**
- Ability cast conditions read facts such as `actor.lotm.fire_at_hand`; every world host must supply them or the row quotes ineligible (safe, but silent). Integrator wiring note sent.
- A prerequisite spell is a power-owned fact, which is unknown until first touched; gates use positive tests (a negation of an unknown fact fails closed).

**LATER**
| Idea | Level | Effort | Done check |
| --- | --- | --- | --- |
| Counter-conditions: an ability cancelled by a named state (heavy rain, a blocked mind, a stated aura) as a typed `blockedBy` list, separate from conditions, shown in the view as "blocked by X" | mechanism | small | An ability with a blocker refuses while it holds and the view names it |
| Scale by rung: same ability stronger later (a second record at the higher rung, or WA33 band) | mechanism | medium | One ability has two rung records and the sheet shows the stronger one |
| Ability used by a non-player (hostile or ally) from the same record, with their own held source | seam | small | A hostile quote uses the same card and cost |
| Shared practice: learning faster with a teacher present or a rod (HP wand, MoL spell rod) as a mastery multiplier fact | mechanism | small | Practice with a focus adds more mastery than without |
| Reflexive casting stage (MoL: casting until it needs no chant, gesture or formula) as a third learn stage after castable | mechanism | small | A `reflexive` sign removes the formula condition |
| Failure chance dial per world, drawn through the seeded streams, never a hidden roll | dial | medium | Same seed gives same outcome; dial zero is the current behaviour |
| Ability discovery by watching someone cast (copy after one cast, MoL c8) as a learn route without a teacher | mechanism | medium | Observing a cast makes the learn gate pass with a stated reason |

## Slice 5: Sequence 6 rung and typed blockers (volumes 2-4), 2026-10-30

**ACT NOW (done):** `blockedBy` on ability records (a named state that cancels the cast, shown as "blocked by X", seeded false so the negated test does not fail closed); `advanceLadders` walks every rung in the pack and appends stages; Seq 6 (digest by disguises that pass close kin, ingest, one face-copy ability with two blockers) in the private pack, each blocker cited.

**ACCOUNT FOR NOW:** the face-copy ability is surface only (height within 10 cm, no memories gained, clothing not changed): those are limits the engine cannot simulate here, so they are carried as `notes` and must come from the identity owner (`sw-road` GM24 personas) when a disguise grants a persona.

**LATER**
| Idea | Level | Effort | Done check |
| --- | --- | --- | --- |
| Disguise digestion by acts "held undetected long enough": a crossing fact fed by the persona owner (days a persona went unchallenged) | seam | small | The digest crossing reads the persona owner's counter |
| Revert in a second or two as a free cost-0 record paired with face-copy | data | tiny | A `revert` record clears the condition |
| Observer kinds as a typed list (Spectator-type, a half-god, close kin) so one blocker row covers a class | mechanism | small | One blocker row refuses for any observer of a kind |
| Walk the next rung (Seq 5) and Seq 6 abilities from volumes 5-8 once the lead nears Seq 6 | data | medium | Seq 5 stage and abilities in the pack with cited blockers |

## Improvement pass on slices 1-5, 2026-10-30

Read `ability_records.js` and `lotm_advancement.js` whole; checked consumers (`read_models/ability_ladder_bridge.js`, `combat_situation_bridge.js`, `sheet_joins.mjs`) and the 23 tests that touch them.
- **Fixed:** ability keys repeated across rungs would collide on ids; `advanceLadders` now throws. Private-pack test pinned exact counts (2 crossings, 3 abilities, 2 blockers); now checks properties. Unstated lists now name the paper-substitute charge count and the flame-jump duration (supply and duration stated as limited or short, no number).
- **Checked, no change:** unread pack fields (`notes`, per-condition `locator`) are citations for audit and tests, deliberately not in player-facing cards (spoilers). Other lanes: `sw-chars` joins by ability record id only; `sw-death` has not consumed the `lotm.backlash` hook yet, so nothing duplicates it.
- **Authored costs:** all remaining amounts (spirituality 1-4, cooldown 10, charges 3, durations) have no stated number in the rows; only orderings are cited, so they stay proposals and are listed under `unstated`. A number would need a stated amount or a balance decision.
