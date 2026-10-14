# CX cheat cards: proposal notes, 2026-10-14

Status: design data only, not accepted decisions or implemented gameplay. Twelve cards extend CH1-CH10. Costs, grades, backing and standing examples are proposed defaults with per-world dials. System and cultivation examples are invented premises, not source claims or claims about a shipped world. No sealed files were read or world truths stated.

## Authority and evidence

- STATED (Weibao/task): deliver CX1-CX12 cards and notes under this lane only. [Dispatch rules](../COMMON.md) and [writing rules](../../start-sources-2026-10-14/COMMON.md) govern scope.
- SHOWN (design owner): [intro rounds 13-15, 19 and 21](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md), especially CX rules, MT10, SP8, LD7 and round 19 C8-C9. Fixed points require supported means; world pressure never chooses for the player.
- SHOWN (contracts): [panel kit](../../../../PANEL_KIT.md), [CH cards](../../panel-kit-2026-10-13/CHEAT_PANEL_CARDS.json), and [cheat library WR/LB/CT](../../../../CHEAT_LIBRARY.md#more-to-consider-what-counts-as-a-cheat-the-library-tab-and-more-types-2026-10-13).
- SHOWN (source inspection, not execution): `/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg/src/start_records.js`, `compose` pocket records and resolver provenance; `src/anchor_snapshots.js`, `applyEffects`, `advance`, `deriveSnapshot` and `explainFact`. These are worktree prototype APIs, not proof of live-game integration. No runtime or module gates were run by this lane.

## N1: cheapest lenses and missing work

“No new data” below means no new domain truth records for the bounded reading. All cards still need Foundation-owned entitlement/grade persistence, safe disclosure, resource policy, knowledge writes and presentation integration. Every `needsFoundation` is true.

| Card | Existing read | New domain data or hooks | Cheapest useful boundary |
| --- | --- | --- | --- |
| CX12 | `explainFact(result,key)` and per-fact `provenance` | Safe known labels/cause projection and query hook; no new truth record | One known local fact's last writer. Not a full causal graph. |
| CX8 | Composed `snapshot.pockets`: `{axis,layerId,itemId,line}` | Touch hook and instance mapping; universal history needs authored entries and transfer/acquisition hooks | One existing start-pocket line. This slice needs no new history data. |
| CX6 | Start-resolution `provenance.seed`, revision and layers | Own-start entitlement and hidden-layer redaction | Own seed and authorized layer labels need no new domain data. Do not confuse start provenance with fact provenance. |
| CX1 | Event windows, `resolvedAt`, `knowledge`; `revealed` for past display | Forecast permission, horizon/confidence and drift attenuation | Broad authorized timing only. `revealed` cannot select the next future event: it lists already-applied events at their reveal time. |
| CX2 | Timed `branch.changes`, canonical/branch outcomes, `knowledge` | A defined, permission-filtered divergence metric and recompute hook | Feeling over observed differences. No existing divergence-count field was found in the inspected API. Raw diagnostic counts leak unseen differences. |
| CX3 | `substituted` records `{id,alt}`, authorized events, `knowledge` | Persistent role/actor bindings, ladder and observation time; recruitment/delay/quality hooks | Known local holder, possibly stale by a day. An alternative ID alone does not identify a substitute actor. |
| CX4 | `knowledge` and observed NPC actions | MT want/reason/means records, conflicting motives, contact/resistance/disguise hooks | Fallible NPC tags, never player motives. |
| CX5 | Authorized failure context, `knowledge` | OL outlets, requirements/costs, personality/patience, satisfaction cancellation, bounded scheduler and probability model | Qualitative guesses until a model supports probability bands. Canon outlet first in fresh canon. |
| CX7 | Own start provenance and `knowledge` | Own body/soul linkage, authorized former-occupant memories and identity-law gates | A sensation, not an invented former life from a layer ID. |
| CX9 | Authored anchors, `knowledge`, `resolvedAt`, `localAt`, v2 reset | Personal mark storage, charges, mark/return hooks, retained knowledge policy and fresh-start/loop distinction | One mark. v2 reset targets a canon anchor, not an arbitrary player snapshot. |
| CX10 | Event `fixed`, `resisted`, `revealed`, `knowledge` | Authored supported means, safe sensation text and observation hook | Local constraint impression. `resisted.reason` is diagnostic, possibly sealed; never render it directly. |
| CX11 | Authorized retained branch provenance/knowledge | Cross-branch linkage, identity-law permission and safe contrast selection | One permitted echo. v2 loop knowledge retention alone grants no cross-branch awareness. |

INFERRED priority: CX12 and bounded CX8 first, as round 21 suggests; bounded CX6 is also data-cheap but needs a world premise that fits meta access (CT2). No richer grade invents missing data. Empty authorized results mean unknown, not confirmation of a secret.

## N2: shared disclosure and integration rules

Default: one authoritative data spine with grade/range projections. Dial: world-specific scope, costs, lag and standing. Reasonably: no parallel truth database, universal rank or free access beyond the world's baseline (WR1-WR8).

A successful disclosure records only the approved output as `snapshot.knowledge[holder][fact] = {value, channel:'cheat', at}` through the owning effect/change path, such as `tell: {to, facts, channel:'cheat'}`. For a shared world-law lens, this channel still identifies this CX reading route; standing separately says it is ordinary here. Neither `revealed` nor player foreknowledge substitutes for holder knowledge. Source evidence labels remain SHOWN/STATED/INFERRED; rumor and model uncertainty stay explicit. Presentation inspection itself must not silently change facts or write knowledge. Future NPC action based on learned information may cause a separate timed `branch.changes` entry.

CX9 is the action exception: sensing or listing an anchor is a knowledge disclosure; explicitly marking/returning may change branch state through Foundation-owned runtime. Present the known destination, costs and keep policy before spending. Browser settings only change reading detail and cannot authorize marking, resets or purchases. Loop resets use v2 `reset.to`, `keepKnowledge` and `localAt`; fresh starts require their own start policy. Preserve pinned revisions and seeds, and never silently rewrite a save.

Low grades are original log lines. Mid/high use the proposed panel identifier, with `overlay` reserved for CX4/CX8 as in CH7. CX7/CX10/CX11 can remain log channels housed in a log-role panel at higher grades. Overlay is a card surface type, not a valid `definePanel` workspace role; do not register it as a region. Runtime module IDs use the lowercase `panel` value, not uppercase CX IDs.

Persist both knowledge/discovery and grade in Foundation-owned save state; `discoveredBy` is prose proposing an entitlement, not an existing field path. World-law entitlement may reveal the same lens without a held cheat. Once known but ineligible, keep a concrete reason, such as “Touch a recorded item to read its history” or “This world's identity law blocks cross-branch recall.” No unknown entry, count, silhouette, settings name or accessible label appears before discovery. Low-grade library entries disclose only what that grade actually knows.

Filter before aggregation and rendering. Until a sealed route permits even a reference, omit the entry. When a reference is authorized but its truth remains sealed, show only ID and status. Timing, motive tags, role labels, alternative IDs, layer IDs, causes, odds and counts can themselves leak truth. The twelve static log examples contain no actual world facts and must not be substituted for authored, permission-checked readings.

## N3: overlaps and conflicts with CH1-CH10

| Existing card | CX overlap or conflict | Proposed resolution |
| --- | --- | --- |
| CH1 status window | System-world CX2/CX6/CX12 may duplicate ordinary interface; CX4 must not make other people's windows freely visible | World-law entitlement for baseline lenses; held-card access for extras (WR3/WR6). Reuse a known window section where it fits rather than auto-opening duplicate panels. |
| CH2 death menu | CX9 can offer a return at death and conflict with carry terms | One Foundation-owned return transaction and keep policy, displayed through the death menu only when eligible. A mark never grants free carries. |
| CH3 anchor list | CX9's personal marks duplicate anchor rows | Reuse CH3 for known marks. Distinguish authored canon anchors from paid personal marks and display eligibility/cost. No two independent anchor stores. |
| CH4 system shop | CX9 charges or lens upgrades may appear as offers | Shop controls acquisition only; a reading is not a purchase. No CX card assumes shop stock, pricing or unseen upgrade stages. |
| CH5 companion voice | CX7/CX10/CX11 impressions could be mistaken for a companion's message | Label the known channel/backing. Companion interpretation can remain fallible; do not grant the companion knowledge it was never told. |
| CH6 simulator foresight | CX1/CX5 forecasts risk being presented as completed simulation outcomes | Share uncertainty presentation where useful; distinguish a sensed forecast from a paid completed run. No invented simulation or exact odds. |
| CH7 appraisal lens | CX4/CX8 overlap directly; CX3 may annotate known actors | Reuse hover and keyboard-focus overlay plumbing, with separate entitlement/grade/range/cost. A generic appraisal grade does not unlock motive or history reading. |
| CH8 harvest ledger | CX12 cause records could duplicate gains and expose hidden sources | Gains remain CH8; authorized last-writer explanation may link from a known row. No hidden observer or full causal chain. |
| CH9 cheat library | All CX cards need known relation/standing/terms entries; CH9 currently names only met/held/rumored and its filters omit researched/lost | Extend through the library owner before runtime: LB1 relations held/met/rumored/researched/lost and evidence labels; LB2 recalculated local standing; LB3 unknown terms blank; LB6 hypotheses distinct; LB10 lawful knowledge carry. World-law lenses belong in world-interface records rather than the optional true-cheat start catalogue. |
| CH10 cheat settings | CX card detail preferences could duplicate controls or enable unauthorized auto-spend | Embed lens display preferences under its known surface; reuse gameplay controls only with Foundation-owned authorization. Hidden functions have no disabled hints or defaults. |

WR standing examples are recalculated on travel, based on the destination's authored baseline. The cultivation `forbidden` example for CX9 is a proposed local ban, not a universal claim. CT11 informs CX1/CX5 uncertainty, CT18 informs CX7 fragments, and CT2 informs CX6's meta fit without granting editing powers. Library rumors never activate a lens or confirm sealed truth.

## N4: verification and remaining gates

This lane checks JSON parse, exactly CX1-CX12, required fields, low/mid/high grades, valid surface roles, namespaced settings, three standing examples, unique original low-grade lines and linked note owners. These are documentation checks only.

Future presentation target: 1366x768, 1440x900 and 1920x1080 desktop/laptop, using independent readable workspace regions and F6/Shift+F6 where panels apply. Visible outcome: only acquired lenses and authorized readings appear; low-grade impressions remain quiet. Mobile optimization is deferred. Runtime, resource balance, sealed-output adversarial checks, rebuilt fresh-origin browser evidence, save/reload/literal-file import, migration and director taste acceptance remain OPEN. This lane makes no gameplay or integration claim.
