# Remainder non-battle source review

**Source-only: no open actionable non-battle findings.** One P1 enrollment defect was repaired during review; final source/syntax/import checks cover that repair. Gameplay stays **implemented-unverified** and every behavioral/save/director gate remains deferred.

Scope: all19 assigned candidate rows across20 lane source files and five shared remainder modules, plus their specified current non-battle joins. Native battle5 integration is still root-authored and excluded. Pure battle hook files were read for their content/state contracts; this report establishes no native combat integration result. Separate pending causal/artifact/provenance work and packaging are outside this review.

## Resolved source defect

**R1, P1: staged root enrollment became hidden.** The root host stages the optional schema11 owner before committing `audit_remainder.enroll`. The old offers projection inferred `auditRemainder.enrolled` from owner presence and overwrote the canonical false receipt fact, causing the root command's `not(enrolled)` visibility guard to fail. Root repaired `audit_remainder_facts.js:14–18` to protect the root-owned fact and `audit_remainder_offers_state.js:18` to derive it from the exact root receipt. Final source inspection, syntax checks and cold registry import confirm these authored repairs; no action was exercised.

The initial home-situation concern was reconciled against live source: `audit_remainder_home_content.js:95` already begins its actual situation before the attributed terms. It is not an open finding or a claimed new repair.

## Source observations

- **Compatibility/enrollment:** `audit_remainder_state.js:9–64` defines deliberate expansion11/auditRemainder1 terms and exact receipt validation; the aggregate protects that receipt. Old5–10 lists/setters retain their earlier domains. `simulation.js:23–41` and `simulation_effects.js:128` skip unadmitted new controllers; newly offered people are provision-false and created by actual commands.
- **Current support/policy:** `main.js:379–426`, `audit_remainder_runtime.js:14–20`, `audit_remainder_livelihood_facts.js:27–119` and `audit_remainder_home_facts.js:27–129` join current calendar/rain/NPC/rights/source/body/stock and exact popped held tools. Shared `simulation.js:192–224` and `simulation_contracts.js:115–119,254–260` distinguish disclosed forfeit practice from existing refundable work. The home context helper preserves the whole map.
- **Conservation/receipt order:** `simulation.js:130,217–224,386–389`, `audit_remainder_runtime.js:21–32`, `expansion_engine.js:557–575` and `main.js:429–445` join actual start/completion/roster/grip/collector/supply receipts before validation. The exact funded purses, stock, once choices, held objects and fitting custody stay with the declared owners; repeated receipt joins are idempotent. Native fitting cross-domain validation is explicit.
- **Actual UI/item/source aggregates:** all six lane definition families, one learned source and ten distinct item specifications enter current aggregates. `data/expedition_items.js:1,38` calls native registration. The root router retains lane payloads/causes/attempt IDs and exposes proper sections; `adventure_notebook.js:32` points actual retained player jobs to Here. Private NPC work records are not copied into player knowledge; local witness/report controls supply their stated observations.
- **Narrow consequence:** `audit_remainder_consequences_facts.js:120–166`, `simulation.js:82–83` and `feature_expansion_nested_host.js:160,211–215` join the actual future-trade gate into simulation and native nested eligibility/commit. Authored departure, settlement and material restitution remain available; actual restitution can reopen that same retained account without another payout or stock provision.

## Checks and moving inputs

[CHECKS.json](CHECKS.json):49 captured source syntax checks pass, plus the two changed repair files pass again. Final cold registry:853commands,36controllers,eight worlds,four plans. All six lane aggregate definitions match exactly; all ten item specification IDs are distinct. Native item registration was inspected statically; no fake DOM or item-module execution was used. No build ran here.

[INPUTS.json](INPUTS.json) captures start and final SHA-256/byte inputs. Only `src/audit_remainder_facts.js` and `src/audit_remainder_offers_state.js` changed during this review. Final versions were reinspected; no captured file moved during final sealing checks at **2026-10-06T19:58:50.651376+00:00**. Later root battle/shared edits require their own evidence and are not covered implicitly.

No unit, gameplay, browser, save/reload/import, failure, regression, keyboard or director gate ran. No runtime/source/canonical/private-save/library files were edited. This review is complete; `review-core/` write ownership is released to root.
