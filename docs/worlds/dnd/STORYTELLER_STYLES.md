# D&D storyteller style menu

2026-10-14. `dnd.storytellers@1`, status **proposed**. GMA1 menu for [FIRST_SLICE](FIRST_SLICE.md); GM1–GM7 interfaces traced below. These are original director policies, not four alternate rules editions. Nothing here is implemented or selected for the player.

## What the menu changes

| ID / menu label | Feel and actual data changes | Same-situation example / boundary |
|---|---|---|
| DS01 / Module | Follow a qualified scenario graph. `selection=orderedEligible`, `beatGraph=dnd.repair@1`, `eventWeights={scenario:4,local:2,pressure:1}`, `quietGameMinutes=20`, `pressureBudgetPerGameDay=1`. Store beat prerequisites, optional branches, witnessed completion and blocked reasons. A beat never forces player consent. | After repair, offer the eligible departure beat before an unrelated local job. Declining leaves the beat declined and permits ordinary life. This graph is the original repair fixture; a canonical module needs its own inspected event graph and private setting data. No unseen published plot is invented |
| DS02 / Sandbox | Select among reachable local opportunities. `selection=weightedEligible`, `beatGraph=null`, `eventWeights={scenario:2,local:4,pressure:2}`, `quietGameMinutes=10`, `pressureBudgetPerGameDay=2`. Store original actor schedules, finite stock, places/tags, unresolved offers and faction-clock references when implemented. | Repair can lead to delivery, another local task or staying in town. A carrier cannot offer the same reserved coin to two jobs. Existing authored routines progress only on their enabled clock, not wall time. No infinite NPC buyer or full faction simulator is claimed |
| DS03 / Narrative | Prefer eligible consequences of the player's last consequential choice. `selection=weightedEligible`, `eventWeights={scenario:3,local:2,pressure:2}`, `quietGameMinutes=15`, `pressureBudgetPerGameDay=2`, `consequencePreference=causedAndUnresolved`. Store cause links, unresolved consequence tags and a bounded recent-pick history. | Turning back can foreground the carrier's witnessed response or an already available safer plan. A d20 check still succeeds/fails by its SRD total; a failed check cannot become a mixed success with a new cost unless a separate accepted action/ruling revision says so. The style supplies eligible aftermath, not Ironsworn rules under a D&D label |
| DS04 / Lethal | Foreground telegraphed risk and preparation. `selection=weightedEligible`, `eventWeights={scenario:2,local:1,pressure:4}`, `quietGameMinutes=10`, `pressureBudgetPerGameDay=3`, `telegraphPolicy=showKnownStakesBeforeCommit`, `rescuePolicy=onlyEstablishedMeans`. Store visible danger cues, actual escape/refuge routes, actor capacities and risk eligibility. | Show the stepping stones and detour clearly, then honor the chosen consequences. The first slice remains its shallow, non-damaging fixture. Actual lethal encounters require qualified SRD combat/zero-HP/recovery consumers and an eligible encounter; this label does not create them, sever fate or authorize unattended deaths. Later danger can be severe within its world and actor policies |

All four options remain reachable design directions. Recommend DS01 for the first technical proof because the ordered fixture makes missing prerequisites visible. That recommendation is not an accepted default or a change to the game's storyteller selection. Pressure means an authored decision or demand, not mandatory damage, cruelty or combat.

The integers above are proposed authoring values, not measured balance or live engine fields. Within `weightedEligible`, first pick an event family using its integer weight, then a valid event in that family. Empty families are excluded before drawing, so adding local entries does not dilute the other families. In `orderedEligible`, weights serve only as a tie-break when two nodes have equal authored priority. No style gets a free DC increase, hostile NPC stat bonus, changed slot recovery, cheaper component or concealed roll override.

## Minimal data contract

These names describe required information rather than existing exports or a second director implementation. Reuse shared rule modules/locks, reason receipts, addressed generators, tags and storylet ownership when an implementation lane receives it. This docs lane makes no claim about current APIs.

| Record | Required data and consumer |
|---|---|
| Style definition | `styleId@rev`, `rulesProfileId@rev`, license tier `yair-original-proposed`, selection policy, event-family weights with reasons, pacing window, pressure budget, eligibility predicates and source/ruling refs. Director reads these to decide which offers can appear |
| Instance/person composition | World-instance style baseline, life/person overlay refs, effective policy revision, actor-specific fate refs, explicit overrides and explanation. Accepted direction allows storytellers per world and per person; a lethal world can still contain a fate-protected person. Each field needs a merge rule, not arbitrary last-writer order |
| Pick receipt | World/life/actor IDs, decision cause, game-time key, candidate IDs and revisions, exclusions, effective style/ruling refs, integer weight contributors, addressed draw if used, chosen event ID, frozen projected facts and cooldown/pressure state. Receipt explains the pick and supplies reload/import |
| Event definition | Original or licensed content provenance, prerequisites, participating actors and actual means, location/time window, costs, refusal/cancellation branches, maximum effects and applicable ruling IDs. A style selects this data; narration cannot fabricate it |
| Knowledge/text projection | Fact IDs, actor knowledge and narrator voice selection. Default second-person, concrete observations and optional d20 receipt. Module is matter-of-fact; sandbox notices routines; narrative connects witnessed causes; lethal states known physical stakes. Never print another actor's thoughts or sealed truth to explain a selection |

Proposed composition order: establish source/rules lock and implemented action capability; read immutable world facts and accepted per-person fate policy; apply world style; apply only declared person/life overlay fields; validate compatibility and budgets; then select among eligible events. The fate protection described in [USER_VISION](../../USER_VISION.md) can be severed through its own supported cause, not by changing this menu. Unknown precedence between two overlays is a blocked authoring conflict, not a silent random choice.

## GM job bindings and determinism

| Root codes | Style responsibility / separate owner |
|---|---|
| GM1, RB12 | Reference [rulings](RULINGS_LEDGER.md); rules/check resolver owns the result. Style may pick a different eligible encounter but cannot rewrite its frozen check after commitment |
| GM2, GMA1 | Apply eligibility, cadence, weights, cooldown and pressure budget. PS01 inspection is not acceptance. A pending player choice stays pending across style selection or reload |
| GM3, RB9 | Use original actor/place fixtures or qualified SRD templates. `Commoner` supplies capabilities, not a canonical biography, job stock or friendship. Lazy generated actors need GR1–GR17 receipts and an actual reader |
| GM4 | Reference enabled actor/faction schedules. First slice supports only original carrier/provider windows; no active canon-faction or offscreen-war claim. Broader faction turns remain deferred |
| GM5 | Freeze revealed actor/object facts, offers, committed jobs, check outcomes, settlement and recent picks. Changing style only affects future eligible picks |
| GM6 | Render over fact IDs and observer knowledge. A different voice never reveals more truth, changes the damage result or upgrades a rumor to knowledge |
| GM7 | Map freeform intent to authored verbs and [RL25](RULINGS_LEDGER.md). Optional AI suggestions cannot spend, roll, mutate state or substitute for a missing resolver |

GR constraints: previews peek and cancellations consume no draw (GR2); freeze revealed picks/values (GR3); keep truth and knowledge separate (GR5); pin table/style revisions (GR10); cap first-slice generation at the one authored carrier, one original provider per offered alternative and one route obstacle, with no random actor generation in this fixture (GR11/GR12); same means/rules for NPCs and player (GR13); scope draws to world/life and game-time decision cause (GR14/GR17). Budgets above count eligible **new pressure offers**, not player actions or guaranteed events. Existing commitments keep running according to their own saved terms; pacing cooldown does not stop the world clock.

A first implementation may use deterministic ordered fixtures for DS01. Where a weighted choice is added, specify its address and draw slots before coding, with no global draw counter. For example: purpose `dnd.director.family`, subject `world/life/actor`, slot `committed-decision:<cause-id>`, attempt for bounded invalid-candidate retries only. Never use browser time, frame count or reopen count. A rejected preview cannot advance the decision cause.

## Revision, compatibility and proof still needed

Proposed persistence additions are style refs, effective overlay refs, revealed pick receipts and pacing/budget counters. No schema changed here. Old saves stay inert; an opted-in new D&D instance records its selected style. A later style change is an explicit transaction affecting future picks only, retaining prior receipts, current object truth, pending offers, escrow and jobs. Missing style data reports unavailable content without regenerating a substitute. Conflicting profile/fate overlays reject the change without spending or changing state.

Runtime acceptance remains OPEN. For the same starting state, demonstrate that each style changes at least one eligible offer or pacing outcome and records why, while SRD odds, costs and old receipts remain stable. Exercise refusal, all-empty eligibility, absent optional AI, protected-actor danger, generated NPC parity and preview/cancel without draws. Weighted implementations need GR16 seed sweep, three golden seeds and save/reload/import preserving the next choice; no such test was run in this docs lane. Future UI proof targets desktop/laptop first, with the actual viewport recorded by its implementation owner; mobile remains deferred.
