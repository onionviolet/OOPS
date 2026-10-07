# Original YAIR implementation packets

Ranked proposals only, 2026-10-06. No gameplay was changed. All names, rates, costs and exact content choices below are reversible. Read [live owner audit](YAIR_AUDIT.json), [source findings](FINDINGS.json) and [structured packet fields](PACKETS.json) before implementation. Refresh affected hashes because other gameplay chats are active.

## 1. Let Lio choose one funded work shift or a contest

After meeting Lio, offer one bounded Village packing shift, or keep him free for the existing party contest. He can decline; the player can use ordinary personal packing instead. Lio independently turns two supplied logs into two real survey kits, receives the offered wage, and keeps his own spent stamina. While his job is active, existing party admission refuses him.

**Prerequisites and costs:** Current field membership, live willing Lio in Village, owned unencumbered harness/kit, usable body and sufficient stamina. Proposal: player transfers two logs and offers two coins; Lio reserves two logs, four played minutes and two of his own stamina. His reusable harness is retained. These numbers and names are reversible.

**Reuse and actual addition:** One authored offer/own decision and independent Lio packing job/controller plus a visible status. Generic workforce counters, another queue and multi-actor player work-plan schema are unnecessary. Instant offer is distinct from the later independent worker job, so it does not occupy the player for the entire shift. Reuse `src/party_content.js`, `src/party_battle.js`, `src/feature_expansion_society.js`, `src/simulation.js`, `src/main.js`.

**Aftermath and retention:** Actual kits enter the agreed owner inventory once, wage enters Lio purse at successful settlement, and job ends occupation. On lost support/cancellation return reserved materials under disclosed terms; no phantom pay/output. Recovery stays the existing paid rest route. New opt-in command/actor fact IDs and optional controller state require an explicit supported-version decision. Old absent state stays inert. Existing frozen jobs keep their revision. Work facts, wages and output stay with their owners through the existing field renewal unless its owner explicitly specifies otherwise. No second prestige.

**Later playable gate:** Offer and accept the shift; player starts personal practice while Lio actually works. During the job, party admission explains his real occupation; refusal/pause does not award kits or pay. Complete once, inspect owned kits and wage, then generate-save/reload without replay; cancel or lose support and inspect exact refunds. Build changed source and later verify visible controls, keyboard use and director acceptance under the current deferred-check policy.

Estimated implementation cost: Low to medium: content, one independent controller and existing party consumer join. No new scheduler.. Source inspiration: ITR-01, ITR-04.

## 2. Build a clamping frame that opens an ordinary resin route

At the earned field workshop, spend actual wood, a rope and coins to construct a clamping frame, then bind kits through a slower ordinary route. Keep the existing cooling sleeve route as the faster portable alternative. The fixture enables a concrete sap-setting and kit recipe without consuming a sleeve charge. It changes production eligibility and material use instead of adding a global stat multiplier.

**Prerequisites and costs:** Earned workshop, known ordinary joining and usable hands at Shack. Proposal: two logs, one actual survey rope, three coins and five played minutes build one frame. Its repeatable ordinary job consumes one sap, two sound staves, two stamina and six played minutes to produce two existing survey kits. Validate access to sap/staves against live material owners before choosing these exact IDs; replace with obtainable native equivalents if needed.

**Reuse and actual addition:** One optional fixture fact used by an actual alternate kit-production command. Facility infrastructure and material transformations already exist; no generic monument tree or global production multiplier is missing. Reuse `src/site_projects.js`, `src/field_workshop.js`, `src/reference_gameplay_content.js`, `src/simulation.js`, `src/main.js`.

**Aftermath and retention:** Built frame remains in the earned workshop. New job spends agreed raw stock and produces existing useful kits; recipes and stock are not duplicated. Cancellation refunds paid unfinished work under the existing job contract. Neither inspecting nor revisiting builds the frame or replenishes supplies. Add inert optional fixture state/content revision only on explicit start; declare minimum supported reader and preserve earlier jobs. Frame, known recipe and real stock survive field renewal by the same existing retained-workshop rule. No forced reset, realm or prestige change.

**Later playable gate:** Build once using obtainable inputs and verify the new command appears only after actual completion. Use ordinary fixture route and cooling route, compare real materials/time, and use the resulting native kits in the existing supply or field consumer. Generated-save/reload while construction/production is pending and after completion; shortage, cancellation and failed durable save must grant no duplicate frame/output. Rebuild and later verify UI choices and director acceptance; those checks are currently deferred.

Estimated implementation cost: Low to medium: two content jobs and one actual eligibility consumer; costs/access need director review.. Source inspiration: ITR-02.

## 3. Offer one ordinary-craft supply attempt

Explicitly enroll before a single association supply attempt and deliver three actual kits without executing the declared powered packing commands during that attempt. Ordinary personal crafting, buying and the proposed fixture remain legal. One retained recognition receipt for an actual completed supply commission, with completed/violated/withdrawn statuses. Native adventure and previously learned powers remain intact.

**Prerequisites and costs:** Known still-uncompleted field supply commission. Explicit bounded attempt after hearing terms; normal kit costs, stamina, money and job times apply. Proposal allows at most three attempts and one recognition, with no extra currency reward. Terms prohibit only a published finite set of relevant powered packing command IDs committed after enrollment; no retroactive judgment or hidden global pacifism.

**Reuse and actual addition:** A scoped supply attempt and violation hook over a finite command set, not another general challenge/achievement engine. Existing attempt schema is hardcoded for passage kinds, so extending it requires a versioned optional record and exact new-kind validator, not silent reuse of incompatible fields. Reuse `src/reference_gameplay_state.js`, `src/reference_gameplay_feats.js`, `src/frontier_campaign.js`, `src/field_workshop.js`, `src/main.js`.

**Aftermath and retention:** Only actual supply delivery after valid enrollment records completion once. A forbidden committed command violates; a preview, unavailable command or failed save does not. Withdrawal and ordinary paid commission results remain separate. Recognition survives the existing renewal, with no new multiplier economy. New optional attempt record/version stays absent for old characters and requires explicit enrollment. Existing conduct/prepared histories stay readable. No reconstruction of old powered actions, no reset of skills or items, no additional prestige.

**Later playable gate:** Read terms and enroll; preview forbidden work without violation, then commit it and observe violation. On a fresh generated attempt, deliver legal actual kits and see one recognition alongside the existing ordinary payment. Withdraw/reload/retry and verify no replayed award; preserve older passage-attempt records and field-renewal retention. Later failure/keyboard/browser/director checks remain deferred; source/build checks cannot establish conduct correctness.

Estimated implementation cost: Medium: new local attempt scope, finite attribution set, version compatibility and clear terms. Rank lower until P1/P2 supply meaningful additional routes.. Source inspiration: ITR-03, ITR-05.

## Covered patterns and exclusions

Current code already has feats, finite local challenge attempts, funded teacher/resident jobs, functional method targets, independent actor occupation, material transformations, known-event reports and one field renewal. Qud and DCSS/DDA returns informed the last delivered reference wave; this pass does not rename those as gaps. The selected staffing consumer, fixture recipe and local supply conduct add distinct player choices over those owners.

Retain the common played clock and current freeze policy. A global wall-time catch-up implementation requires a separate explicit scope, supported time source, resource bounds and save/reload/failure proof. This research proposes no such change. Do not import ITRTG content, money systems, raw code/assets, exponential scales or repeated reset ladder.

Current later gate backlog: generated saves only, old/new/pending/result reload, unavailable support/shortage/cancel, failed persistence and no replay, visible controls/keyboard/director acceptance. None ran here. Build/syntax/import/link checks are permitted for a future implementing owner.
