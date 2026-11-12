# Progression path contract

*Version 0.1 (v0), 2026-11-12. Owner: chat R in the [procedural foundation plan](PROCEDURAL_FOUNDATION_PLAN.md) (OS3, MC13, PG8). Module: [`src/progression_path.js`](../src/progression_path.js). Tests: [`tests/progression_path.test.js`](../tests/progression_path.test.js). A proposal under AD56: it widens what every world can do and every number is a pack dial. Changes are requests to chat R. Inventory and reasons: [R checkpoint](gm/dispatch/foundation-r-2026-11-12/CHECKPOINT.md).*

## What a path is

A holder (a body, an actor, a thing, an institution's record) stands at a position on a path. Tracks accrue toward the next step. A step opens when its crossings and gate are met, either by itself or as a K working that can fail by the rules. Crossing changes the holder through published effects. The module adds no evaluator: crossings are the existing [ascension path](../src/ascension_paths.js) descriptor (ASC), gates are [GTR descriptors](PROGRESSION_GATE_RULES.md) and workings are the [kernel](KERNEL_WORKING_CONTRACT.md) (KW).

```
row      = definePathRow({path: <definePath descriptor>, tracks, dials, steps, ceiling?, revision?})
record   = createPosition(row, {position?, tracks?, since?})          // the holder's owner stores it
record   = accrue(row, record, track, gain)                            // pure
quote    = stepQuote(row, record, facts, {dials, knows})               // pure read of the next step
result   = crossStep(row, record, facts, {dials, holder, at})          // {ok, record, effects, observed} or a refusal
opened   = openAutoSteps(row, record, facts)                           // every auto step that is met, in order
law      = progressionLaw({kind, rows, dials})                         // K law `r.progression.<kind>`, op `cross`
method   = crossingMethod(law, row, {kind, to, minutes})
```

## Rules (PRG)

| Code | Default | Dial and reason |
| --- | --- | --- |
| PRG1 | **A path is a row.** Stages, crossings, grants and failure signs stay in the ASC descriptor; the row adds tracks, dials and steps. A new canon step costs a row (PFP1). Sub-stages are stages, not strings. | Shapes per ASC (ladder, tree, web, wheel, stack, field), per world (AD46). |
| PRG2 | **World numbers are dials with reasons.** Every number a step reads (a wall's strength, a step's minutes) is a named dial with a default and an in-world reason; packs set them, hosts may pass per-holder values. | Canon numbers are fixed points (AD49); a derived value says what range fits the source. |
| PRG3 | **The position record belongs to the holder's owner.** `progression.position@1` is `{path, revision, position, since, tracks}`. A body's path lives with L's body, an actor's in its facts, a Gu's rank with G, a credential with the issuing institution (GTR25). R registers no slice. | One record per held path. |
| PRG4 | **Tracks and thresholds.** A track is an amount with a threshold kind: `count` (one level at a need: digestion acts), `table` (ascending values) or `geometric` (cumulative `base·(1−s^n)/(1−s)` rounded to cents: the upstream skill curve). `<track>.level` and, for counts, `<track>.met` become facts the crossings read. | New kinds need a second consumer (PFP5); expressions over facts (GTR30) are the next candidate. |
| PRG5 | **Accrual does not read time.** `accrue` adds whole units exactly and fractional ones to the cent, so any split of the same gains gives the same total and level. Rates over time are the host's or W's to integrate (KB6); a per-gain cap is the host's policy, with overflow through `skill_overflow_domain` (GTR16). | Tested for the skill curve. |
| PRG6 | **A quote is a pure read.** `stepQuote` reports crossings, the gate (with GTR10's knowledge filter), any supply and the ceiling, and never spends. Admission is crossings plus gate (GTR11). | `ceiling` per row or per life, as ASC. |
| PRG7 | **Supply attempts.** A step with `supply` needs the named fact to reach a dial. Admitted but short, the attempt happens: what was pressed is spent and the position holds, with the step's authored failure. Refused admission spends nothing. | Deterministic by the quantities in play (AD38). Rolled risk is PRB1. |
| PRG8 | **A working crosses.** One K law per holder kind, because K fixes a kind per role. `settle` rereads the holder at the step's time (KW3): `{kind, id, positions, facts}`. A method is begun for a named next step; if the holder has moved on by then, the step stops with a reason. Interruption crosses and spends nothing (KW8). | Step minutes are a dial. |
| PRG9 | **Effects, not writes.** Crossing publishes `progression.crossed` (with grants and the new record for the owner to store) and `progression.spent` (fact and amount). Kinds are exported constants. L applies body changes, G Gu changes, the holder's owner moves the position (PFP10). | Backlash effects for L land with PRB2. |
| PRG10 | **Felt, not read.** A track may carry three felt words (none, some, reached). Views show those where the holder could only feel progress, and the count where they could measure it (GTR15). | Per track. |
| PRG11 | **Paths can be held by things.** A Gu's rank or a creature's rank is a path with a thing as holder; the thing's owner keeps the row and record. | Per world. |
| PRG12 | **NPCs walk the same rows.** An NPC's step uses the same row, quote and working (GTR20, PFP11). | Far from the player a host may settle a path as a rate to the same expected position (PFP12). |

## First consumers (in the test file)

| Consumer | Row | Proof |
| --- | --- | --- |
| Upstream skill level | A `geometric` track per skill; one auto step per level | Level equals the `models/skill.js` loop at every total for four base and scale pairs; any split of the same gains opens the same level |
| Lord of the Mysteries Seq 9 to 8 | The existing `seerPathway` and Corpse Collector descriptors wrapped with one `count` digestion track (6 and 4 acts) | Both advance through the same step; undigested is refused; felt words move unsettled, settling, settled; the Seq 8 ceiling holds |
| Reverend Insanity Rank One peak to Rank Two | [`src/progression_packs/ri_gu_master.js`](../src/progression_packs/ri_gu_master.js), a supply step over a K working | 38 parts fail; a full 44 sea and six stones pass with 20 left; a 12-part sea fails with six stones and passes with seven; quote equals settlement; any partition and a reload give the same record; interruption crosses nothing |

## What v0 cannot express yet (PRB)

| Code | Gap | Default proposal | Owner |
| --- | --- | --- | --- |
| PRB1 | Rolled risk (Frontier tempering, a heart demon, an exam) | Fold `breakthrough_trial` in as a step `attempt` drawing from the K step address when tempering moves; a K quote then shows the outcome, so odds on the quote need KB9 | R, K for KB9 |
| PRB2 | Backlash on bodies (cracked aperture, loss of control from an undigested drink) | A `progression.backlash` effect L applies | R with L |
| PRB3 | Digestion by acting quality: an act counts if it fits the potion's principle | A principle match supplied by S or N; R counts what is supplied | S, N |
| PRB4 | Threshold expressions over facts (GTR30) | A fourth kind once a second consumer needs it | R |
| PRB5 | Rank One sub-stages from essence purity rather than recognition | G supplies purity as a track or W quantity; the row's crossings change to quotas | G |
| PRB6 | Transitions between paths (swap, branch, demote, wrong order) | `ladder_holdings` transitions settled as R workings | R |
| PRB7 | Conserved seats and characteristics (GTR33) | A world ledger read as a gate fact | M or W |
| PRB8 | Live wiring | Each consumer's owner stores the record and reads it in its scenes (G for Gu, the LOTM owner for sequences, the skill host for levels) | R with each owner |

## Save shape

```json
{"schema": "progression.position@1", "path": "ri.gu_master", "revision": 1, "position": 4, "since": 4320,
 "tracks": {}}
```

Compatibility line (MC4): unchanged. No live save key changes in v0; the records live only in tests until an owner wires them (PRB8).
