# CR1 consumables, dose and body response

Status: DOCS PROPOSAL COMPLETE, 2026-10-14. Everything CR1 authored is a proposal. No runtime changes or new gameplay proof. User scope: main checkout, write only this cr1/ folder; no runtime edits, builds or commits. Root owns integration/commits. [CHECKPOINT](CHECKPOINT.md) is the resume surface.

D1: Recommend an additive recipient-exposure ledger above retained P2 product truth, with route-specific consumers. Track delivered amount, temporary benefit, tolerance, toxicity and permanent gain separately. This preserves reachable repeat use while preventing replacement, split doses or changed names from erasing history. It does not impose universal toxicity, hunger or once limits.

D2: The first proposed playable addition is a small original poison/antidote experiment: make a paid fictional hazard/neutralizer, choose dose, observe a specific body response, neutralize only the matched active and retain unrelated load. Root must select/integrate the P2 seam before implementation. Nothing is newly playable from this lane.

## Deliverables and boundaries

| File | Extension of existing codes / outcome |
|---|---|
| [CONSUMABLE_KINDS](CONSUMABLE_KINDS.md) | CO1-CO10 plus XD2-XD4; proposed immutable definition, mutable instance, delivery receipt and exposure records; kind-by-kind routes, dose curves, onset/duration, stacking, tolerance/toxicity and body response |
| [DOSE_AND_TOLERANCE](DOSE_AND_TOLERANCE.md) | CO4 and RS2; seven curve forms, separate recipient/tolerance/burden/gain ledgers, stacking/interaction rules, ten specified arithmetic/boundary probes and occupational exposure |
| [BODY_AND_SPECIES](BODY_AND_SPECIES.md) | XD2-XD4 and CO5-CO7/CO10; body/interface response shape, eight original coverage fixtures, meals, permanent/mutagen/inheritance, companion and mind/social joins |
| [MORE](MORE.md) | Eighteen additional coded angles with concrete first consumers, sibling interfaces and a worked medicinal-meal/companion combination |
| [DOC_CHECKS](DOC_CHECKS.json) | Static link, coverage, P2 snapshot and scope evidence. Document checks only, no gameplay acceptance |

Relevant accepted direction was reconciled against [PROJECT standing priorities](../../../../../PROJECT.md#standing-priorities-and-document-authority), [USER_VISION](../../../../USER_VISION.md), [food/Famine owner](../../../../HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md) and the root crafting palette. Food stays optional with useful benefits, comfortable unfed ordinary play and no hunger death. Body/source exemptions remain real. World adjectives choose budgets, danger, repeat laws, exemptions and compatibility. Reasonable manual, queued, paid, researched, alternate-body, alternate-delivery and exceptional routes remain selectable. First milestone stays one realm/one prestige layer.

Future UI target: 1366x768 laptop plus 1600x1000 desktop. Visible outcome: selected exact product/portion, admitted route and recipient, known timing/response, remaining contents, exposure/queue state and observed result in useful existing panels. Knowledge governs forecasts, not true response. Mobile optimization, universal offline advancement and every-body pharmacology are deferred implementation scope, not erased options.

The later CR1 instruction overrides COMMON.md's older worktree/build/test/commit directions for this docs-only lane. No extra worker, worktree or server was created. The p26/ story lane was not read or written. No raw novel prose was copied, no source library modified and no user save accessed. No sealed-truth file was needed; generated secret truth is excluded from these reports.

## P2 source audit

SHOWN means directly inspected source. STATED means an attributed source/report statement. INFERRED means a proposed consequence, schema or slice. None of these labels implies a CR1 native journey.

Read-only path: /Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-p2-mixing/. Branch HEAD f8fe6994 (full hash captured in DOC_CHECKS); source diff against that commit is empty. That worktree has modified dist/bundle.js, dist/bundle.js.map and index.html, which were not edited or used as CR1 proof. Main branch was codex/gameplay-foundations at cc5fa55614985127a28058368f5722ef9a1848e5 during the ancestry check; git merge-base --is-ancestor f8fe6994 HEAD returned 1. P2 is not an ancestor of this sampled main HEAD. Root should refresh this before dispatch/integration because other workers are active.

All locators below are relative to the P2 worktree, not the main checkout. Snapshot hashes in DOC_CHECKS let root detect drift.

| Code / source locator | SHOWN contract | CR1 proposal / boundary |
|---|---|---|
| F1 / src/mixture_state.js:15-45 | Optional schema/revision1 owner retains generated ingredient truth, canonical products, observations/methods, hidden-method witness, job and sequence; validation recomputes expected product from retained truth | Keep existing interpretation. New active kinds/fractions require a selected versioned definition/response adapter; appending poison fields to this fixed catalogue is not sufficient. Hidden witness details omitted |
| F2 / src/mixture_state.js:47-71 | One deterministic original law, whole packs, retained four-fraction fictional mass, oral availability, reference-vial-normalized dose and strict product validation | Actual-amount/route/recipient laws are additive. Duplicating all pack counts yields a distinct larger identity but same normalized dose at unchanged ratio/process; do not silently reinterpret old full-vial consumption |
| F3 / src/mixture_state.js:73-83; src/items.js:1218-1226 | Canonical selected key/reference, dynamic observer-filtered name/description; exact rational split and dilute helpers; no exposed partial-dose action | Retain product/key equality. New mutable remaining-portion/charge/surface state needs holder identity and a complete decoder. Knowledge is not part of physical stacking identity |
| F4 / src/components/inventory_component.js:21-46 | Generated references checked before insertion and counts restricted to whole positive vials | Partial vial, heterogeneous coated ammo, inserted pill and charge state need an explicit instance/sublot adapter, not fractional vial counts hidden in legacy inventory |
| F5 / src/mixture_native.js:5-22 | Pure staged owner/stock/money plan; use subtracts one vial, returns one fixed exposure and observes the exact product before method learning | Body target, route, amount and observation scope are new admission inputs. One oral trial cannot certify another species, ingredient fraction, every dose or another route |
| F6 / src/mixture_state.js:84-98 | All-envelope holder traversal and consumed-product reference validation; one retained stat payload/dose/application/expiry, positive remaining duration, replacement policy | Extend import graph explicitly for sidecar definitions, pending release, body/zone/surface targets, budgets and gain receipts. Existing effect ID/consumer restrictions cannot validate arbitrary new families |
| F7 / src/mixture_native.js:38-43; src/main.js:4668-4689 | Complete save validated/written before live publication; effect keyed to Village mixture exposure; native main-character instance use while free, base.frontier, with activity/combat/dialogue/sleep/trade guards | Preserve atomicity; new hosts must stage all affected owners. Combat throw/ammo use, NPC delivery and other-world use need their own legitimate host, not calling the guarded self-drink handler |
| F8 / src/active_effects.js:15-35,515-518 | Constructor retains its declared fields; mixtureExposure restored explicitly, while ordinary effects reconstruct template plus duration | Extra receipt metadata needs explicit restoration. Permanent body gain, source charge, area matter and behavior are different owners/consumers, not arbitrary stats or infinite-duration effects |
| F9 / src/main.js:4816-4852,7225-7244 | Legacy add_active_effect still requires an effect template and uses group priorities; duration loop decrements remaining duration with travel/sleep handling | Existing priority tags are not a generic tolerance/poison scheduler. New onset/release/decay uses a single specified clock/ordering; this audit reproduced no defect and authorizes no repair |
| F10 / src/mixture_native.js:23-35; src/mixture_ui.js:21,29-37 | Learned whole-batch repeat holds exact stock, advances one due batch and stops on shortage; polling drives settlement; preview/UI has whole-vial self-drink controls | CR3 owns broader UI/queues/catch-up. CR1 supplies valid delivery/regimen/occupational exposure receipts. Current repeat proof does not establish offline exposure or arbitrary target delivery |

A1 source limitation: the current dose is concentration/reference based even though a whole vial is consumed, as P2's comment says. That is an authored local formula, not a real pharmacology claim or a reproduced conservation bug: composition mass is retained. New rules should distinguish total active, carrier concentration, absorbed dose, rate and duration, while old saves retain their original behavior.

A2 branch proof: [P2 REPORT](../../../../../.claude/worktrees/proc-p2-mixing/docs/gm/dispatch/procgen-2026-10-13/p2/REPORT.md) states 16 focused/637 full SOURCE tests, a build, 11 natural journey groups, two seeded-native holder groups and three natural exposure groups passed. CR1 read this report and source; it did not rerun those checks or independently validate its browser evidence. Counts overlap and are not CR1 test counts. P2 balance/taste and root integration remain open per that owner.

## Contradictions and qualification

| Code | Conflicting or overbroad account | Disposition in CR1 |
|---|---|---|
| CF1 | COMMON says main writes only P5, worktree builds/tests/commit; later user CR1 says main cr1/ only, docs only/no commits | Later explicit task scope governs; no worktree/build/commit workflow applied |
| CF2 | Status map's broad no-generated-material/code-none wording and 2026-10-13 audit F3/F4 reflect pre-P2 source; status end note and current branch report acknowledge P2 | Historical main snapshot and unmerged branch now differ. Record both; do not call new main integration complete or edit those owners from this lane |
| CF3 | P6 REPORT describes a dirty in-progress P2 worktree without final report | Older snapshot. Inspected branch now has f8fe6994 and final REPORT; source is unchanged from its commit, build outputs still dirty. P6 contracts remain useful, not current acceptance evidence |
| CF4 | Root says each consumable needs only its own consumer over P2 | Design aspiration. Source restrictions F1-F8 require additional validated amount/target/charge/surface/gain records for some kinds. Preserve all kinds, specify joins rather than silently claiming support |
| CF5 | Earlier food framing included active-exertion Famine gating; owner follow-up rejected it; nonhuman sources contain narrower or incompatible feeding/sleep generalizations | Accepted passive underfed progression and no hunger death govern. Keep source/era labels, body exemptions and unverified wiki/memory formulas separate from selected game law |

Source attribution is inherited and bounded. [P6 CANON_LOCATORS](../p6/CANON_LOCATORS.md), [joined research](../../../../research/procedural-materials-2026-10-13/REPORT.md), [deep research](../../../../research/procedural-materials-2026-10-13/deep/REPORT.md) and the body owner provide selected SHOWN/STATED/INFERRED locators. CR1 read these owners, not whole source novels anew. Public canon names in attributed summaries are not new raw-prose imports. Root's Witcher-like mechanics remain a memory-derived comparison, not a certified formula. Finer source/continuity questions belong to CR2 or a later selected source slice.

## Five ranked additions above P2

All are unselected proposals with OPEN gates. Ports from 21200 are suggestions only; no reservation, launch, listener scan or source write is implied. Root checks ports and actual file ownership before dispatch. Each ends in a rebuilt useful journey before another slice starts. P1 integration is required only for new saved draws; deterministic dose laws do not need fresh random rolls.

| Rank / code | Playable result and additive scope | Dependencies / proposed exclusive ownership | Port | Specific gate beyond common G1-G5 |
|---|---|---|---|---|
| 1 / CR1-S1 | Paid original poison/antidote with selected dose; two active families distinguish matching neutralization from supportive relief. Small nonlethal fixture keeps ordinary native defeat/recovery behavior | Integrated P2 product/key/publication API; selected versioned hazard/neutralizer law; existing main-character body/stat consumer. Builder new consumable_response/state/host modules + meaningful tests; root/P2 writer owns item/effect/main/save joins | 21200 | Actual acquire/mix/use → dose-dependent effect → matching neutralizer leaves unmatched active and injury → new exposure; save pending/active/treated with vial gone, literal-file import and failed-write no-op |
| 2 / CR1-S2 | Medicinal soup and tonic from a shared active, exact servings and shared mechanism/budget; ordinary unfed work remains comfortable | S1 response subset plus P6 cooking/serving adapter or selected joint implementation, optional-fullness compatibility decision. Food owner owns creation, CR1 builder response; CR3 UI/auto-eat optional, no duplicate cooking queue | 21210 | Paid prep/eat selected serving → useful actual recovery; soup+tonic respects one family, remaining servings retain active; unfed control and Famine policy preserved, exact settings/burden import |
| 3 / CR1-S3 | One original smoke/oil burst and a controlled workshop emission use actual zone/contact/uptake; ventilation/protection changes exposure | S1 body-exposure subset; P6 fuel/container/surface context, actual simple zone consumer and supported throw host. New delivery/zone adapter with one assigned zone owner; root clock/combat only where selected; CR2 law and CR3 work-stop joins | 21220 | Paid throw/emission → coverage/deposited stock and actual visibility/work response → protected/unprotected target difference; no whole flask per target, occupancy interval equivalence and pending field/exposure import |
| 4 / CR1-S4 | Compatible feed/pet tonic benefits one actual companion/body; lure attracts through sensed preference; other body remains an independent control | S1 target extension, actual companion/nonhuman body E1/E2/E5/E14 subset and supported task. Companion owner creates actor/bond; CR1 response builder consumes received-dose refs; P8 acquisition optional, P4 generated person not required | 21230 | Paid eligible feed → received medicine → useful pet task/recovery; refusal/inapplicable route and player body control; independent load/bond/remaining feed and future dose import, no absence hunger death |
| 5 / CR1-S5 | Permanent original pill has positive diminishing gains and separately clearable residue; an optional supported temporary expression shows actual body function and retention | S1 ledgers, selected body/source gain and transition consumer, P6 pill preparation; genetics/nonhuman writer owns permanent/body delta. New gain/integration adapter; root save/identity joins serialized. No full inheritance population required | 21240 | Multiple paid pills → decreasing positive marginal gain → actual supported function → named residue cleanse without gain reset; mid-integration/final import and duplicate receipt rejection, new paid repeats remain admitted |

CO9 ammo and CO8 scroll/charges remain independently reachable candidates once their actual combat/surface or pattern/charge consumer is selected. CO5 mutagen and CO6/CO10 social/mind variants remain separately selectable through their body/behavior/source interfaces. They are fully described in the family papers, not accepted by S1-S5 demonstrations. No sixth ranked slice is dispatched here.

## Sibling and owner joins

| Owner | CR1 reads / passes |
|---|---|
| [CR2 world crafting laws](../CR2.md) | Selected route/canon/identity/conservation/exception law with revisions and evidence; CR1 passes receiving body, dose and result receipts. No competing per-world law catalogue |
| [CR3 play, automation and tools](../CR3.md) | Delivery options, observer-filtered forecast, known budget/stop reason and receipts; CR3 owns property-map/UI, standing orders, queue planner and director presentation |
| [CR4 makers, economy, social](../CR4.md) | Maker/product/recipient and actual observed response/permanent/social consequence; CR4 owns marks, teaching, reputation, demand, fraud and carryover consequences |
| [P6 REPORT/MORE/families](../p6/REPORT.md) | Creation, structure, surfaces, edible servings, pattern/fuel/charge and installed capacity; CR1 adds actual delivery/response, not alternate product truth |
| [P8 REPORT](../p8/REPORT.md), [P11 MORE](../p11/MORE.md), [P5 extras](../p5/EXTRA_IDEAS.md) | Actual acquisition/condition/context, experiments/services and genotype/affix owner seams; no resource/NPC/context clone, no forced dependence on all proposed systems |
| [Genetics](../../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md), [nonhuman](../../../../worlds/NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md), [companions](../../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) | Actual receiving functions, source/layer/carrier, transition retention and companion agency. These documents are proposals, not live generic APIs |

All shared runtime changes would need root's later writer assignment. This report reserves no shared file and authorizes no implementation.

## Future gates, all OPEN

| Gate | Required evidence for a later selected implementation |
|---|---|
| G1 SOURCE / accounting | Meaningful selected consumer tests for exact quantities/traces, route/recipient, dose curve, delayed onset/release, shared tolerance/load, specific neutralization/byproducts, diminishing-gain split invariance and receipt replay. Preview/import checks consume no draws or resources. Undefined model rejects, unknown-to-player truth acts. Failed durable write/stale target leaves every owner unchanged |
| G2 REBUILT / native | Builder's required tests/build and served-byte binding on fresh disposable origins; actually pay/acquire → prepare → select exact route/portion/target → observe useful changed consumer → repeat → relevant negative/control. Label natural versus seeded-native separately. Native self-use, throw/combat, NPC/companion and dream routes each need their own positive host evidence |
| G3 PERSISTENCE / compatibility | Save/reload plus UI Export and literal-file Import at pending onset, partial release/burden, used-source/treated and permanent/integration checkpoints. Compare products/holders/remaining portions, recipient identity/revision, payload/timing, tolerance/load/gain totals, reservoirs/byproducts, knowledge, pending jobs and next draws. Old absent owner remains absent/unchanged; unsupported revisions/dangling refs reject before overwrite |
| G4 DESKTOP / projection | Rebuilt 1366x768 and 1600x1000 behavior shows actual selected product, route/amount/target, known timing/budget, effect and queue result with useful independent panels. Unknown/secret values do not leak through names, predictions, prices, sort/recommendations or reason text. Mobile deferred |
| G5 AUTHORITY / human | Reconcile accepted direction and deferred scope again: no compulsory feeding/hunger death, no global once gate or forced either/or, actual body exemptions/idle progress retained. Source fidelity, fiction/balance/feel and Weibao's playable acceptance remain separate from technical tests |

For S3, boundary equivalence covers simultaneous dose/antidote, sleep/travel, occupancy and protection changes on the specified clock; no offline support is inferred. For S4/S5, body transition must preserve declared carriers and update actual functions/fit/jobs without duplication. A per-kind implementation not exercised gets IMPLEMENTED_UNVERIFIED only after actual code exists. CR1 proposals are simply PROPOSED / NOT RUN.

## Checks performed and remaining work

V1: Read-only live-authority/document audit, including root's two-round palette, status/material audits, joined/deep reports, PLAN/COMMON, P6 REPORT/MORE/family papers, P8 REPORT, P11 MORE, P5 EXTRA_IDEAS and the requested food/genetics/nonhuman/companion owners. Relevant body/substance/agency sections were inspected; no fresh full-novel reading claimed.

V2: Read-only P2 source/branch audit with file:line locators, committed-source comparison and hashes. No tests, builds, server/browser launches, save operations, runtime edits, commits, merges or pushes. Existing dirty state belongs to its owners and was preserved.

V3: Static document checks passed for 78 local links/anchors, 25 P2 source locators, requested root-code coverage and exactly five ranked slices. Results are captured in DOC_CHECKS.json and summarized by CHECKPOINT. They establish artifact/link/coverage integrity only. All playable, native persistence, source-adapter, balance and human gates remain OPEN. Root integration and later implementation selection remain with root; this lane's documentation assignment is complete.
