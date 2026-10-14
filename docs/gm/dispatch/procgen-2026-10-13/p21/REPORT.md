# P21: conflict and economic stories

2026-10-14. **DOCS COMPLETE; ALL DESIGNS PROPOSAL.** Extends root I1–I4 and
J1–J3, with new proposed I5–I10/J4–J12 in [MORE](MORE.md). Nothing here selects
implementation, changes runtime, accepts fiction/balance or proves new gameplay.
Root owns integration and commits. [CHECKPOINT](CHECKPOINT.md) is the resume point.

## Result and important source findings

F1: battle detail is uneven. Live solo and party contests retain their latest
result and bounded directed relationship memories; the party stores guarded
attempt counts/helper status. Sessions are deleted at finish. A guarded attempt
may miss or be blocked, so it is not automatically a rescue. Causal-story strikes
already retain typed damage/protection/life/observer evidence inside their finite
authored proof ledger. [BATTLE_STORIES](BATTLE_STORIES.md#f1-what-live-battles-retain)
gives file:line receipts and proposes exact terminal/history adapters.

F2: a durable chronicle must read actual outcomes. Simulation event/log windows,
32 directed memories, eight news lines and the lossy life record cannot be old
battle/venture authority. [P14 CONTRACT](../p14/CONTRACT.md) owns typed history,
retention and observer-safe accounts; P21 adds producer payloads and consumers.
`src/world_visit_history.js:21–58` validates/reconciles and preserves live
references during compaction; that pattern does not implement a battle chronicle
or playable branch archive.

F3: investing/shipping are already finite live mechanics, not missing foundations.
`src/management/capital_rooms.js:10–36` and
`src/management/shipping_farming.js:5–18` were inspected. The older candidate
delivery status is superseded by the management checkpoint's R15 addendum and
[R15 G6 report](../../foundation-adoption-next-2026-10-13/rounds/r15/g6/REPORT.md).
That report states natural play and persistence checks after integration, with
human fiction/price/pacing and named cases still open. P21 did not rerun them.
[VENTURES](VENTURES.md) extends actual funded agreements into repeatable series,
supported variation and remembered returns, preserving existing settled claims.

F4: supply-driven stories need one stock/quote authority. Existing saturation and
merchant refresh are not a physical macroeconomy. [P8 trade supply](../p8/TRADE_SUPPLY.md)
and [P11 N1/N2](../p11/REQUESTS_AND_MARKETS.md) own lots, shipments, needs, funds
and quotes. [ECONOMY_STORIES](ECONOMY_STORIES.md) adds episodes and merchant
responses without another purse/refill/price state. [ECOLOGY_STORIES](ECOLOGY_STORIES.md)
reads P8 transitions; [WARS](WARS.md) connects goals/route operations to local life.

F5: per-world labels need provenance, not genre assumptions. [MORE](MORE.md)
retains reported source modes, locators, credits and contradictions for priority
book/anime worlds, all five TTKS continuities and broader options. P21 read local
analytical profiles; it did not independently authenticate novels, read all
primary scenes or fetch current web sources. No private novel note was quoted
or source library modified. Qualitative depth leads do not establish exact
combat, ecology, war, credit, food or reset laws.

Evidence vocabulary: **SHOWN/SOURCE** = directly inspected source code, no
execution; **STATED/report** = a dated owner's evidence claim; **SHOWN/STATED
as-reported canon** = that analytical owner's primary/secondary claim, with its
quality retained; **INFERRED/proposal** = every new design/use here. Unknown is
not forbidden and not a granted rule. Contradictions are carried, not averaged.

## Deliverables and joins

| File | Concrete extension / ownership boundary |
|---|---|
| [BATTLE_STORIES](BATTLE_STORIES.md) | I1.1–I1.8 typed turning points, participants versus chronicle; I2.1 returning survivors through paid/timed knowledge and preparation |
| [WARS](WARS.md) | I3.1–I3.5 faction goals, operations, siege logistics, displaced people, peace and local consequences; no replacement canon war |
| [ECOLOGY_STORIES](ECOLOGY_STORIES.md) | I4.1–I4.9 causal cohorts/sites, surveys, pressure, renewal, coexistence and source-specific ecology |
| [ECONOMY_STORIES](ECONOMY_STORIES.md) | J1.1–J1.7 counted shortage/boom/glut/bust and one quote owner; J2.1–J2.6 recurring competition/cooperation |
| [VENTURES](VENTURES.md) | J3.1–J3.10 financed work, variation, exact proceeds/knowledge and a real story return |
| [MORE](MORE.md) | Proposed new root codes, world-law/source boundaries, two connected hypothetical showcases and edge cases |

[Root palette](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md)
is the idea index, not edited by this lane.
[P3 report](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md)
and [P4 report](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md)
were read in their isolated worktrees, read-only. Their stated deck/people proof does not establish
merged casting or a shared source API. P5 D8/D9/extras, P6 creative works, P7
guidelines, P8 ecology/supply, P9 profile source/contradiction sections, P10 report
and source notes, and requested P11 domains inform these joins.

Sibling scope stays with [P12 quests/arcs](../P12.md),
[P13 canon/divergence](../P13.md), [P14 history/texts](../P14.md),
[P15 authoring/dialogue](../P15.md), [P16 crossovers/loops/endings](../P16.md),
[P17 story power](../P17.md), [P18 QA](../P18.md), [P19 social web](../P19.md),
[P20 places](../P20.md) and [P22 director tools](../P22.md).
Live partial files were treated as drafts; prompt links do not claim completed
reports. P21 uses their owners rather than duplicating the systems.

Additional SHOWN/SOURCE audit surfaces: `src/causal_story_actors.js:84–106`
binds current body/owner/revision facts; `src/causal_story_content.js:251–255`
derives this authored family's facts; `src/causal_story_ids.js:1–20` names its
fixed scope. `src/causal_story_native.js:386–447` stages owner revisions,
envelope writing and publication with rollback; that adapter is not generic
battle-history persistence. `src/causal_story_ui.js:160–191` revalidates shown
offers, and `src/causal_story_scenes.js:63–104` renders received accounts rather
than inferring delivery success from the deadline. `src/simulation_resolution.js:9–29`
freezes spawned identity/template per cause; `src/simulation_contracts.js:217–250`
declares/validates knowledge and directed relationship state.
`src/simulation_content.js:104–110` registers an authored shower, not generated
economic episodes. `src/simulation_ui.js:79–88` renders known open events;
`src/event_feed_ui.js:15–30` routes projected leads; `src/people_knowledge.js:6–15,59–60`
excludes hidden state and exposes received/helper memory. These interfaces need
explicit adapters, not prose-mining or assumed general-purpose casting.

| Conflict | Disposition within P21 |
|---|---|
| R1 COMMON prescribes worktree/build/commit | Later explicit P21 instruction controls: only this main-checkout directory; no builds/commits. |
| R2 E5 comfort/away formulas can use hunger or new offline event caps | D9's later reconciliation removes hunger pressure; P21 adds neither offline scheduling nor absence penalties. Intro OT remains a proposed clock policy. |
| R3 E6's stall chain burns a stall after walking past; E2/E6 contain fixed repeat fields | Do not inherit that punitive example or generic fixed limits. New physical causes, voluntary commitments and local frequency laws govern P21; receipts settle idempotently. |
| R4 Intro fixed points/substitution can force a lost canon cause | Reuse P13's reconciliation with T3: actual qualified actor/motive/means or an explicit sourced/AU enforcement mechanism; otherwise the event changes or fails. |
| R5 Older management delivery says unintegrated/unverified | Newer R15 addendum/report and inspected live modules supersede that status for the finite loops only; generated ventures and P21 acceptance remain open. |

## Five ranked playable slices, all proposals

Ranked by observable value and existing seams, not a required sequence or five
simultaneous assignments. Each can attach to a qualified selected canon-world
operation when ready. An original Village proof is optional, never a required
opening or gate before canon play. Finish one selected playable slice at a time;
broader options remain reachable. Ports are **future suggestions**, not listener
reservations or running servers. Builder/root must check current occupancy.

| Rank / ID | Natural route and visible result | Required joins / proposed writer area | Port from 21000 | Decisive gate beyond common gates |
|---|---|---|---|---|
| 1 / S1 Remembered contest | Acquire actual contest/helper means → agreed battle/guard or withdrawal → known participant recalls correct turning point → changed fitting interaction | Existing native/party battle producers, P14 typed history, directed knowledge. Proposed new battle-history adapter/content; root serializes battle/save/People joins. P4 casting optional. | 21000 | Missed intercepted attempt is not a rescue; no invented betrayal, costs, scar or death. Capture actual target/deltas before session deletion. One paid/timed returning-opponent change can follow. |
| 2 / S2 Repeat venture partnership | Ordinary income/stock → inspect new funded agreement → production/sale/delivery → exact proceeds/report → next agreement reflects prior result | Existing management/simulation owners, P11 terms, P14 history; P4/P19 optional. Extend management via assigned venture modules, preserve legacy agreement IDs and claims. | 21010 | A second genuinely funded venture is possible without resetting settled claims; all contribution/fee/return accounts reconcile; pass and alternate financing remain reachable. |
| 3 / S3 Supply episode | Actual deficit/delivery cause → dated funded buy order → supported resupply → changed next offer/clearance | P8 R5 supply, P11 N1/N2, existing trader/saturation; proposed episode consumer only. Root owns quote/refill reconciliation. | 21020 | Supply and demand explain price/availability; no hidden-potency leak, double scarcity, supply cloning or unfunded payment. |
| 4 / S4 Ecological callback | Actual gathering → observed pressure → rotate/tend or buy → renewed work/yield → known request/account references that cause | P8 R3 ecology, P11 request/observation and P14 history; small callback family. Predator movement is a later distinct consumer. | 21030 | Same producer/site/cohort and actual renewal; a survey changes knowledge without creating stock. Herbal renewal alone claims no full monster ecology. |
| 5 / S5 Campaign-supply episode | Known original faction goal → actual route restriction/held shipment → alternate delivery or negotiation → useful reopening/aftermath | B1 faction authority/means, authored route and P8 manifest, P11 requests, P13 event causes, P20 endpoint; proposed local operation module, no general war engine. | 21040 | Real cause reaches local need, changed route and actual delivered cargo; ordinary play continues; no forced canon substitution, absence destruction or starvation. |

## Shared future gates, all OPEN / NOT RUN

| Gate | Evidence needed from the selected builder |
|---|---|
| G1 Authority/source | Recover live writers and root-integrated interfaces; choose world/instance/era/source horizon and exact laws, supported consumer, canon reservations and any AU difference. Carry shown/stated/inferred and contradictions. No generic borrowed rank, ecological or contract law. |
| G2 Causal/source behavior | Appropriate tests/build for exact outcome deltas, identity, means, witness knowledge, actual funds/stock or declared magical sources, stale/duplicate operations, pure previews, saved named draws, meaningful boundary/chunk equivalence, failed publication and retained-reference compaction. Narrative cannot apply rewards twice. |
| G3 Rebuilt playable result | Fresh disposable origin, natural means/acquisition → real choice → changed next action/result. Exercise meaningful decline/cancel/quiet route. Label natural, seeded-native and source separately; evidence uses rebuilt served bytes, never inherited dist. |
| G4 Persistence/compatibility | Pending and completed Save/reload, Export and literal-file Import into another fresh origin; compare actor/object/cargo identity, terms, escrow, applied receipts, knowledge, clock/phase and next relevant draws. Legacy absent domain stays inert; unsupported active commitments reject before mutation or follow explicit supported preservation policy. No invented past. |
| G5 Disclosure/desktop/director | Only known evidence in text, prices, counts, filters, tooltips, news and errors; opaque secret IDs/routes in public proof. Rebuilt 1366x768 and 1600x1000 show terms, known cause and result in useful existing panels; mobile deferred. Human fiction/pacing/balance acceptance is separate. |

All proposed slices: no hunger death, comfortable unfed ordinary play, no
absence punishment, no silent offline advancement, no fixed once anti-abuse
rule. Idempotency belongs to one receipt, not a permanent gameplay restriction.
Per-world adjectives can be generous, hazardous, abundant, inexhaustible,
licensed, coercive or exceptional with their real causes and supported routes.
Strong/harsh worlds are not normalized into player-scaled fights. Branch/loop
retention and playable restoration stay under temporal owners, distinct from
history summaries. No mobile workstream or mandatory Frontier campaign is added.

## Checks and handback

Static documentation PASS: eight requested Markdown files present; 100 local
links resolve, all seven linked heading anchors match, and 42 cited source line
ranges exist and fit current files. Lane-local whitespace/final-newline and
proposal-label checks passed; `git diff --check -- docs/gm/dispatch/procgen-2026-10-13/p21`
returned no errors. Because the directory is untracked, the independent file
whitespace check supplies coverage that git diff alone does not.

Manual readback PASS for source/report/proposal separation, ranked five-slice
coverage, cross-world attribution/contradictions, reachable alternatives, no
hunger death/absence punishment/fixed once restrictions and IDs-only sealed
disclosure. One malformed anchor was corrected; party finish/action locators
were tightened to include session deletion and actual action boundaries.
These checks verify documentation structure and reviewed disclosure, not canon
truth, runtime behavior or all possible secret leaks. No tests, builds, browser sessions, ports,
private saves, runtime/shared-file writes or commits were performed by P21.

Task completion is this bounded proposal packet. Future implementation remains
unselected; root selection/ownership/source qualification precedes G1–G5.
