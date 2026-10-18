# Missing coverage and connected opportunities

2026-10-15. Follow-up to the [demo trial](REPORT.md), requested by Weibao.
Bounded source/document audit plus an existing test slice. Findings and proposed
audits are not accepted product decisions or an implementation dispatch.

## Result

No new runtime defect was established. Several apparent feature gaps already
have implementations and evidence. The main unresolved question is how these
pieces feel together in ordinary play. Reference coverage also stops before
several mechanics that could change our conclusions.

Latest [direction](../../DIRECTION_SUMMARY.md) now explicitly includes adjustable
return recaps (OD15), continuing-journey banked time (TBANK), and stronger
important-choice pause semantics (OD4). These are accepted direction; exact
rules remain open. Goals/guidance OD24 is still a discussion topic. Do not let
MR2's ordered hint list silently settle that question.

## Corrections and confirmed existing support

| ID | Checked evidence | What this changes |
| --- | --- | --- |
| E1 | `src/native_discovery_policy.js` deduplicates settled, known discoveries and coalesces a synchronous batch. `src/native_discovery_feedback.js` cancels hidden-tab effects and leaves the native log as the readable record. Four current policy tests pass. | “Add better notifications” is too broad. Audit recovery, source links, milestone visibility and screen composition before adding another notification mechanism. This does not prove every announcement is correctly wired. |
| E2 | The final **Browser acceptance run, observed by Claude Code (2026-10-08)** section of [D1 checkpoint](../../gm/d1-alloy-equipment-2026-10-07/CHECKPOINT.md) records crafting, live equip/unequip, functional production changes, ticking, reload and same-origin wipe/import. Its opening status and earlier remaining-gate sections predate that appended result. | D1 is not merely a proposal. Recorded historical browser evidence is stronger than the stale opening summary. Current source checks pass; present-build browser behavior was not rerun. Natural pacing, a separate-profile check and human balance acceptance remain distinct. This audit does not edit the other lane's checkpoint. |
| E3 | `tests/fa09_routines.test.js` exercises actual existing program/work-plan paths for supply depletion, explicit resume, stock bands, cancellation/refund, reload, support failure and publication rejection. | Do not propose a second generic automation engine. Inspect its player-facing explanation and missing boundary cases instead. Controlled SOURCE fixtures are not natural acquisition or elapsed offline proof. |
| E4 | `src/skill_discovery.js` separates known/discovered, acquired/unlocked and currently eligible states. `src/techniques.js` and `src/energy_resources.js` already separate technique knowledge, practice and execution means. | Diagnose a missing explanation or adapter before calling for a new knowledge/fuel architecture. Existing code presence does not establish every consumer or UI route. |

## Ranked audit gaps

The table is an inventory of useful audits, not a requirement to run all of them.

| ID | Gap and current evidence | Smallest useful audit and done check | Disposition |
| --- | --- | --- | --- |
| G1 | **Complete player journey.** The Climb trial earned wood and started a diagram but did not craft/use its output. MR2 reached Transmutation but did not transmute/use an item. YAIR D1 has historical fixture proof, not natural opening pacing. | Trace one YAIR route from an ordinary start through clue, preparation, cost, acquisition, use and feedback. Record where a player must guess, hunt or wait without understanding. At 1366×768, the player can name what improved and where to go next. Report observations before proposing a fix. | **Highest-value next audit; proposed.** No new system needed to begin it. |
| G2 | **Return and interruption semantics.** Routine tests cover selected source boundaries. Neither demo trial exercised a long offline session, and the new OD4/OD15 direction is broader than those tests. | One known routine: compare continuous play with interrupted/reloaded play, then separately exhaust supplies and reach an important choice. Check stop instant, costs/refunds, paused deadlines/production unless supported means allow them, summary and prior intent. Resume is explicit where required; no invisible work continues across a forbidden boundary. | **ACCOUNT FOR NOW:** accepted behavior to verify. No whole-engine review or runtime change dispatched. |
| G3 | **Recovery and save fidelity.** MR2 restored buildings/research assignment but first displayed older counters; export was not captured and import was not tested. D1's historical import used the same origin after wiping it. | For a later authorized YAIR trial, record exact gameplay state before save and after reload/literal import into a separate disposable origin. Include equipment, current commitment, pause reason and one-time rewards. Distinguish a save-age window from an actual lost award. | **Evidence gap.** MR2 export remains unverified; do not resume the browser action blocked in the prior turn. |
| G4 | **Equipment identity beyond a stat total.** The Climb bundle exposes awakening, enchant capacity and heirloom retention; these were not played. YAIR has a functional material-derived item loop. | Source-trace one item across acquire → improve → equip → relevant action → unequip → retain/lose, with slot competition and pending-work behavior. Determine whether a real choice survives or every bonus simply stacks. Check save identity, modifier scope and world/means-dependent carryover. | **LATER:** compare a mechanism before proposing living-gear or retention expansion. No extra prestige layer selected. |
| G5 | **Achievement meaning and unintended incentives.** The Climb granted a combat award from a training dummy. YAIR's title/rule reward mechanisms remain world-dependent proposals. | Trace reward eligibility, exactly-once grant, consumer and reload/reset handling. Compare a harmless repeatable target with an authored meaningful achievement. Include NPC/item/place holders only where the selected world's rules support them. | **ACCOUNT FOR NOW** as a design question; broad title-system implementation is not selected. |
| G6 | **Combat, automation and recovery interact.** MR2's older source audit covers ordinary autocast versus sustained drain, but we did not play wizard priorities, a boss, starvation or strategy restoration. | Audit one rule order with insufficient mana, a disabling status, a failed condition, recovery and loading a saved strategy. Trace charge, spend and effect separately; inspect whether a later rule starves. Then identify the equivalent existing YAIR routine/consumer rather than importing autocast semantics wholesale. | **LATER:** a focused reference-source lane, not a blanket combat audit. |
| G7 | **Source coverage and reachable content.** The recovered main map contains systems beyond the opening. Demo registration includes autocast, combat classes, enhancements, exploration and synchro; this is not proof every module or full-game state is reachable. | For any selected feature, follow demo loader → registration → gate → paid action → useful consumer → persistence. Classify source-only, demo-reachable-unplayed, played and retail-unknown separately. Never turn extracted-file counts into a completion percentage. | **ACT NOW:** qualify claims in this audit. Bulk reading or retail decompilation is unnecessary until a named question requires it. |

## New source finding: banked time is more than a performance setting

**F8, SOURCE:** MR2 `src/backend/timetick/TimePieces.tsx` defines paid 2×/5×
acceleration, transforms its price and gains, stops acceleration after the balance
is depleted, and records/restores the Time Piece balance across retirement
(lines 225–238). `src/backend/DemoLoader.tsx` registers this module.
`src/components/main/GameTickProcessor.tsx:111-128` selects the offline-processing
route for sufficiently long gaps or the corresponding option, with a 48-hour
processing-input cap. These are source observations, not a played test of offline
accuracy, fairness, every event boundary or retail parity.

**YAIR implication:** the accepted continuing-journey time bank has a concrete
comparison for both identity and resource accounting. A useful future check is
that the same eligible interval cannot pay out twice through catch-up and a bank,
and that bank use respects important choices, current-world history and actual
means. Track real elapsed time, simulated world time and bank balance separately.
Do not copy MR2's rates, cap, slowdown or retirement semantics as YAIR defaults.
Capacity and efficiency improvements are already part of TBANK direction; exact
mechanics are open, not newly accepted by this source finding.

## Other things worth retaining

| ID | Opportunity | Boundary |
| --- | --- | --- |
| O1 | Explain an upgrade's changed batch size, resource demand and refill time together. Capacity growth can improve throughput per click without improving sustained income. | Use actual current quotes; never invent a universal score or hide changed costs. |
| O2 | Let NPC dialogue reveal an actionable chain, while preserving independent routes through buying, crafting or finding where existing rules support them. | A useful clue should not force every playthrough into one global curriculum. Recovery alternatives need actual content. |
| O3 | Compare the time to the first meaningful decision, not just time to the first unlock. MR2's early resource steps and The Climb's long tree action offer different pacing references. | A single run cannot establish population-level pacing or prove that waiting is undesirable. Measure the selected YAIR loop before tuning. |
| O4 | Maintain an evidence ledger that separates captured source, read traces, accessible mechanics, played routes and accepted lessons. | The old MR2 audit stays a dated static audit; this report supplies later play without rewriting its history or claiming full coverage. |

## Checks in this follow-up

Ran once against the current working tree:

```sh
node --test tests/native_discovery_policy.test.js tests/alloy_equipment.test.js tests/fa09_routines.test.js tests/structured_renewal.test.js
```

**31 pass, 0 fail.** [Private log](private/GAP_AUDIT_TESTS.log).
This is a source/domain test slice, including the native Node harness used by an
alloy test. No new browser run, YAIR build, full suite, natural pacing test or
human acceptance is claimed. Reviewed the current direction summary, final D1
checkpoint evidence, prior MR2 audit/proposal review, selected YAIR owners and
the newly cited MR2 time/demo registration paths. No runtime edit, commit,
worker dispatch or modification of personal saves.

**Recommended next scope:** G1, one existing Village improvement journey, with
G2/G3 interruption and recovery checks applied to that same journey where
practical. The remaining rows stay ranked research options. This recommendation
does not start those trials or broaden the active UI lane.
