# Abstraction when implementing worlds

**Scope correction, 2026-11-04:** Weibao clarified that he meant compressing activities such as investigation into progress-based play, rather than primarily sharing code. The [activity compression audit](../SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md#activity-compression-audit-choices-and-interactions-2026-11-04) now owns that answer: AC1–AC18 cover compressed units and interesting choices, SI1–SI12 cover interacting consequences, and R1–R5 record reconciliation. This technical review remains historical and does not establish those proposed activities as implemented (AD32).

**F1 source-state correction, 2026-11-04:** targeted reinspection found concurrent uncommitted changes in [ability compilation](../../src/structured_ability_runtime.js), [place acts](../../src/place_acts.js) and [simulation validation](../../src/simulation_contracts.js): timed commands now permit matching refund/forfeit policies, place acts read row cancellation, and the old group-specific completion restriction has been removed. F1's description below records the earlier inspected inputs, not current source behavior. This source inspection does not establish focused-test, browser or persistence proof of the other writer's changes. A choice between refund and forfeit also does not by itself establish staged partial consumption. Original F2–F5 and the original 35-test evidence retain their bounded historical scope; no fresh runtime test result is claimed here.

2026-11-04. Request: “Audit areas of abstraction when implementing the worlds”.

Status: source-level audit, with focused executable checks. Recommendations are proposals under AD32. No runtime behavior, world priority or accepted rule changes. Inspected dirty primary checkout at HEAD `aef3cb1f81008e1eb815e57a703974d2447079eb`; HEAD alone does not identify the uncommitted inputs. Existing unrelated edits were preserved.

## Scope and authority

This is a cross-world implementation review, not another route/rule census. The [route audit](../audits/WORLD_IMPLEMENTATION_ROUTES_AUDIT_2026-11-04.md) owns routing. The [activity/effort review](WORLD_SLICE_EFFORT_AND_ABSTRACTION_2026-11-01.md) and [scope ladders](../SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md#routine-abstraction-and-effort-reconciliation-2026-11-04) own routine depth. This file adds code-level boundary findings and a domain comparison; no existing single-world owner covers that combination.

Applied: AD6–8 (means, truth and knowledge), AD32 (authority), AD38 (mechanisms), AD44–46 (lead build-through, replaceability, world variety), AD49 (source-number calibration), AD51 (reasonable shared abstractions), AR3/7/8/10–13, WA5/19/20/54–57/59. WPR1–5/21/22/27–28 are workflow prompts with their existing proposed status. Source edition: current repository owners and runtime, not a new book reading. One primary agent; no readers or delegation, no book acquisition or external research. Stop condition: map useful abstraction areas, verify concrete limits, save recommendations and their evidence.

Two independent decisions matter:

| Decision | What it buys | What it must retain |
|---|---|---|
| Share a mechanism across worlds | One owner and reusable execution, validation and UI plumbing | Each world's laws, carriers, units, costs, knowledge and aftermath |
| Summarize repetitive play | Fewer authored steps and repeated clicks | Decisions about method, budget, risk, stopping and intervention; actual consequences |

A fully summarized action can still have rich local rules. A shared engine can still support detailed play. Neither decision determines the other. AD51 permits designing a shared seam before a second world ships; AR11/WA20 ask the second different use to validate or revise it. Proposed FND5 is not a veto on that direction.

## Findings, ranked

### F1. Shared interruption handling contains a refund law

**Verified implementation restriction; highest priority when a paid or destructive activity is selected.** [Ability compilation](../../src/structured_ability_runtime.js) requires timed abilities to use `cancellation: 'refund'` and forces completion failure to refund. [Place acts](../../src/place_acts.js) similarly hard-code refund for cancellation and failed completion. This is appropriate for untouched reservations, but cannot express fuel already burned, a spoiled ingredient, completed partial work or a lasting consequence.

The restriction also exists below those adapters: [command validation](../../src/simulation_contracts.js) permits supported-completion forfeiture through a `remainder_` group special case, with corresponding saved-job validation. Changing an adapter alone would not fix the boundary. Existing ability tests explicitly reject `forfeit`; their passing result confirms this constraint rather than disproving it.

**Proposal:** when an actual consumer needs it, extend the incumbent transaction/job contract to distinguish reservation return, committed spend and completed output. Keep settlement policies with the activity/world. Preserve current refund defaults and define in-flight compatibility. Compare interruption before consumption with interruption after consumption, then save/reload each. Do not build a second scheduler or globally replace refunds with forfeiture.

### F2. The shared sequence view contains a LOTM clock dependency

**Verified coupling; bounded UI portability gap.** [placeActSequenceView](../../src/place_act_sequence.js) calculates `readyAt` from `state.lotm.initializedAt`. [HP's lead projection](../../src/book_world_hp_lead_domain.js) calls the same helper. A fixture with `readyOffset: 20` returns `readyAt: null` without LOTM state and `100` with `lotm.initializedAt: 80`.

This does not demonstrate a present HP scheduling failure: no HP timed-stage consumer was established here, and command eligibility is a separate owner. It does show that the helper's timing interface is not world-neutral.

**Proposal:** take an explicit sequence anchor or resolved world-clock coordinate from the host when the next timed consumer needs it. The shared helper projects time and does not own another clock. Compare identical offsets in two hosts with different anchors, including a state that retains another world's data.

### F3. Scripted sequencing is reusable, but does not establish an open world

**Verified helper semantics; misuse risk rather than a demonstrated shipped defect.** [sequencePrerequisites](../../src/place_act_sequence.js) requires preceding stages, and [sequenceOffers](../../src/place_act_sequence.js) filters a supplied command list to the next stage and pending work whenever a sequence exists. A fixture containing one next-stage command and one ordinary command exposes the stage alone. Completion can be inferred from a matching knowledge receipt or the completed-command ledger.

That is useful for a developer canon route. Broadening the command list to ordinary study, employment or alternative problem solving would suppress unrelated actions. Treating any acquired knowledge as equivalent to having performed a physical step would also need an explicit stage contract. The current tests correctly preserve completed physical work after recalled evidence is erased; that property should remain.

**Proposal:** keep campaign presentation and canon-order policy scoped to their selected command family. Ordinary action eligibility stays with actual means and local circumstances. If alternative routes enter a selected slice, make stage completion depend on the relevant outcome or receipt rather than assuming every stage is interchangeable with knowledge. Check “knows the method but has not made the object” and an ordinary action offered alongside a campaign stage. No claim that ordinary HP or LOTM lives already failed this test.

### F4. The energy seam is useful arithmetic with a bounded model

**Verified scope, not a request to rewrite it.** [energy_resources](../../src/energy_resources.js) owns integer capacity, reserve, output, control, rational efficiency and strain. Its charge is output divided by efficiency, rounded up; recovery uses supplied amounts, and each use adds fixed policy strain. [Gu keeper projection](../../src/book_world_gu_keeper_domain.js) reuses it while retaining living-carrier diet, ownership and food costs separately.

This is a good shared mechanism where those equations fit. It does not establish that every world's ability has a rechargeable pool, linear conversion, identical units or per-use strain. A carrier, learned technique, permission from an agent and available energy are different conditions even when one UI shows them together.

**Proposal:** keep source-qualified calibration per world under AD49. Extend or compose the model when a selected source requires a distinct equation or side effect; avoid disguising it with arbitrary capacity multipliers. Portability proof should include a case where increasing reserves cannot overcome missing control or a missing carrier. No new claim about a franchise's exact power law is made here.

### F5. Routine compression has a sound design owner, but narrower implementation evidence

**Verified evidence boundary.** The [routine owner](../SUBSYSTEM_SCOPE_LADDERS_2026-10-16.md#routine-abstraction-and-effort-reconciliation-2026-11-04) already preserves method, source, worker, access, costs and attributed knowledge while summarizing repeated work. [Place acts](../../src/place_acts.js) provide timed commands, support checks and knowledge receipts. This audit did not establish a general investigation resolver, policy-based worker delegation or complete offline catch-up through every world domain.

**Proposal:** reuse those command/job owners for the next selected repeated activity, supplying its actual resolver and consumer. A study bar should finish with retained learning or a qualified failure; a work bar with paid output or actual earnings; an investigation bar with evidence supported by the chosen access and method. Summarize repetitions while exposing meaningful changes and intervention points. Keep investigation low priority as already directed. A timer and report text alone do not demonstrate those consumers.

## Areas to abstract, and the differences to preserve

These are candidate boundaries and counterexamples, not twelve new implementation tasks. “Inspected” identifies source read in this pass; “design trace” points to existing owners without claiming a runtime audit of that domain.

| Area | Reasonable shared mechanism / compressed play | What stays local | Evidence and distinguishing check |
|---|---|---|---|
| Identity, bodies and custody | Stable actor/item/carrier identity, transfers, ownership and control | Who can command a body, what counts as possession, authority to transfer | Inspected Gu keeper envelope and ability carriers. Transfer a carrier without granting its technique or the previous holder's knowledge. |
| Costs, jobs and interruption | Quote, revalidate, reserve, consume, settle and resume; routine batches | Consumption stages, refund, spoilage, interruption consequences | Inspected simulation contracts, place acts and native craft rollback. F1 applies. |
| Powers and progression | Acquisition/source records, target/support checks, persistent improvements | Rank structure, vows, side effects, output equations, local limits | Inspected structured abilities and energy. F4 applies; a larger pool cannot replace a missing method. |
| Crafting, brewing and research | Inputs, process steps, tools, time, output handoff; summarize stable repeats | Chemistry, recipe law, quality, mishaps and discoveries | Inspected native craft transaction; [making rules](../MAKING_RULES.md) design trace. A rollback before durable save differs from an in-world failed brew after consumption. |
| Learning and investigation | Timed effort, evidence attribution, method/access checks; summarize repetition | What is discoverable, evidence reliability, supernatural bypasses, actual skill gains | Place-act receipt path inspected; routine resolver coverage remains qualified by F5. Exhausting the same source does not manufacture a new true clue. |
| Economy, holdings and institutions | Integer accounting, exact coin display, actual payer/recipient, obligations | Currency ladders, prices, credit terms, hiring, law and enforcement | Inspected [coin ladder](../../src/coin_ladder.js), Gu keeper and HP holdings. A display conversion is not an exchange market or a grant of spending authority. |
| People, companions and upkeep | Relationship/obligation records, role/support presence, meal scheduling where suitable | Agency, motives, diet, hunger outcomes, employment and refusal | Inspected [living upkeep](../../src/living_upkeep.js) and Gu consumer; social breadth is a [PIR](../PRESENCE_AND_INTERACTION_RULES.md) design trace. A meal schedule does not make a companion an obedient item. |
| Combat, harm and care | Target identity, effects, aftermath, treatment jobs; summarize encounters when decisions permit | Defense law, injuries, tactics, recovery and irreversible costs | [Domain rules](../DOMAIN_RULES.md) design trace, not combat-runtime proof. Equal labels or numeric damage do not establish equivalent injuries. |
| Travel, clocks and routines | One elapsed-time authority, explicit coordinates, route costs, summarized uneventful stretches | Local calendars, body/world rates, access, deadlines and exposure | Inspected [calendar](../../src/world_calendar.js) and sequences. Fixed-month calendar support is explicitly bounded; F2 applies. Travel compression must still settle relevant scheduled consequences. |
| Generation and parallel worlds | Stable addressed draws, revisioned rules, deferred detail | Source-fixed facts, permitted variation, correlation and consequences | Inspected [generation address helpers](../../src/gen_kit.js); no generator audit. Under Nov 3 direction, variance fills unstated facts; replaying an inspection should not reroll the world. |
| UI, knowledge and detail | Observer-safe projections, command feedback, reusable components and summaries | World vocabulary, units, known precision, controls and panel emphasis | Inspected world identity view and HP/Gu projections; WA54/AD46 design trace. An unknown exact value must not appear merely because a shared gauge needs a number. |
| Packs, saves and campaign policy | Namespaces, dependencies, revisions, deterministic loading and persisted receipts | Local modules, compatibility choice, entry profile, developer canon policy | Inspected pack loader and LOTM envelope. Valid pack format is not playable coverage; F3 applies. Test a changed law against in-flight work and its saved revision when implemented. |

## Recommended use in the current build order

**A1. On the next selected LOTM/HP mechanism, name its shared semantics and local exceptions in the existing task contract.** Use the matrix above to find the relevant boundary; do not fill every row per scene. Compare a second different case when useful, without starting another whole world.

**A2. Address F1 when the selected loop needs spent-on-failure work; address F2 when the shared view gains a non-LOTM timed stage.** These are concrete extension triggers, not new prerequisites for continuing all campaign scenes. Scope F3 whenever ordinary or alternative actions share that offer list.

**A3. Compress repeated play around its actual consequence.** Use existing means, costs, clock and result owners. Keep important choices visible and source-fixed quantities intact; demonstrate where the output is used. A bespoke local mechanism remains reasonable when shared semantics do not fit.

Under AD32, LOTM-first, the selected HP developer route, ordinary-start coverage boundaries and the runtime delivery floor remain with their existing owners. No world was selected, no new foundation wave was dispatched, and no source reading or runtime implementation is implied by this audit.

## Verification

- `node --test tests/structured_ability_runtime.test.js tests/place_act_sequence.test.js tests/world_calendar.test.js tests/world_knowledge.test.js tests/native_craft_transaction.test.js`: **35 passed, 0 failed**, on the inspected working tree. Output: `/tmp/oops-world-abstraction-tests-2026-11-04.txt`. This covers those bounded routes, not universal portability or gameplay completion.
- Read-only fixture importing `place_act_sequence.js`: reproduced F2 (`null` without LOTM state, `100` with anchor 80 and offset 20) and F3 (ordinary command filtered out). No files or saves mutated.
- Document checks: 31 local file targets exist across this report and its linked activity owner; whitespace clean; anchors not mechanically checked. `npm run check:docs` remains blocked by diagnostics outside these two paths, with zero diagnostics on these paths. Output: `/tmp/oops-world-abstraction-doc-check-2026-11-04.txt`. No game build, full suite, browser, packaging or save/import exercise was run because runtime was unchanged. No UI behavior or FLR1–FLR6 completion claim.
- Source-level findings and proposals saved under AD32; no standing rule changes, staging, commit or push. No sealed truths included. Human review remains optional.
