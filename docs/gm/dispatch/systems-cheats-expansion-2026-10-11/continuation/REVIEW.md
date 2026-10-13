# Systems workshop bounded source review

2026-10-11. Reviewer `/root/candidate_review`. Candidate inspected:
`/Users/weiwei/.codex/worktrees/systems-cheats-completion/yet-another-idle-rpg`.
Review owns this report only. No candidate edits, builds, tests, browsers or saves
were run. Findings describe the inspected source, not a verified runtime failure.
Root owns repair and all acceptance proof. Shared integration and C5 remain separate.

## Actionable findings

**F1 [P1] SYS-R02 has no actual preservation behavior.**
`src/systems_workshop_content.js:50–54` produces sealed ration/parcel item counts
and trades them for payment; `src/items.js:4547` registers both as ordinary
`OtherItem` templates. There is no specimen condition, age, deterioration,
carrier contents, supported waiting interval or ordinary counterpart that
changes while the sealed version remains stable. The same actual inventory
transfers are sound, but the claimed arrested deterioration exists only in
descriptions and knowledge. Frozen predecessor `DESIGN.md:75–103` explicitly
requires preserved versus ordinary samples, two consumers, contents removed
once and preserved condition across persistence. Consequently the finite
preservation gate cannot close from the present renamed crafting/trade loop.
Implement one bounded condition/clock comparison and have the two declared
consumers actually adjudicate that condition. Keep the revision fixed.

**F2 [P2] Native actions omit the disclosures they promise, including a consumed input.**
`src/systems_workshop_ui.js:6–9,20–27` renders an introduction and a compact
status, and every successful command reports only “Progress saved.” It never
renders `simulation.knowledge.player` entries written by meet, accept, appraisal,
lease, upgrade or settlement. Thus “Meet Iona to hear exact grant and work terms”
does not show the terms, and the appraisal action shows no appraisal result.
Stored knowledge is insufficient native feedback for these decisions. Also,
`src/systems_workshop_content.js:51` labels the ration preparation as phial to
ration while reserving both a phial and meat; its eligible button tooltip is
empty (`systems_workshop_ui.js:37`). Show actor-known terms and the resulting
receipt, and disclose every reserved input before action. Keep the committed
wager result hidden until settlement when adding these displays.

**F3 [P2] Malformed imports can bypass the authority and model promises.**
`src/systems_workshop_validation.js:17` accepts any safe point balance from zero
to ten even when no reward has been claimed. Starting from a valid joined state,
setting only `actors.player.resources['systems_workshop.points']=10` satisfies
this validator and enables purchases although no funded quest exists. Line 18
also validates only model enums: changing a valid inlet-1 experiment's
`modelBest` to the other layout, or changing `modelHarvest`, is accepted. The
derived `sw.modelRecommended` (`src/simulation_effects.js:72`) then uses the false
recommendation to select the higher native fitting yield. Bind points to the
settled reward and completed point purchases; reconstruct model output and
recommendation with `runIrrigationModel` and require the completed experiment
cause. Add representative malformed-state checks at the import boundary. The
review did not execute these examples; the control-flow gaps are explicit in
the inspected source.

## Inspected sound boundaries and remaining proof

The commission consumes an actual post-acceptance log, advances its situation,
and funds ten points from Iona's finite point resource. Claim uniqueness belongs
to the simulation claim owner. Learned and leased sources use distinct carriers;
disconnect removes only assistance. Cache opening consumes native custody and
draws from the existing saved simulation seed. Wager funding debits both purses,
escrow holds four coins, and settlement/fold spends that escrow once. The custom
UI excludes outcome-specific settlement buttons and presents one continue action.

The represented irrigation function exports only model output and knowledge;
real fitting jobs consume real logs. Ren's job uses his own simulation stock,
learned source and played-time controller, with private job audience. Main's
workshop host delegates through the simulation owner, then `persistExpansion`;
the inspected persistence path writes storage before publishing expansion,
money and native gameplay. None of these source observations replaces root's
fresh-origin/native behavior, absent-teacher, save/reload/import, failed-write or
both-outcome proof. Tests were read only.

P06's public qualification identifies a compatible original Frontier procedure
and a precise private pack/adapter owner gate. Existing qualified dossier/report
behavior was not exercised or re-audited here. Root must record the actual
selected native consumer before closing that requirement.

## Narrow repair recheck

2026-10-11. Root requested a read-only recheck of F1–F3. Only this report was
edited; no tests, build, browser or save operations were run by the reviewer.

**F1 disposition: repaired in source for the selected finite comparison scope.**
`systems_workshop_content.js:53–58` now provides one ordinary ration and one
ordinary parcel with the same actual preparation inputs as their sealed versions
and useful early handoffs. `systems_workshop_runtime.js:6–23` derives a four-minute
expiry from the ordinary preparation knowledge receipt's actual completion clock
and converts fresh stock to spoiled/drifted stock in player, provider and chest
custody. Sealed stock remains unaffected. `main.js:792–793` stages reconciliation
and chest ownership before native publication; `main.js:918` prevents general
sale from bypassing the declared comparison handoff. This supplies actual
preservation behavior rather than descriptions alone. Root still owns elapsed
comparison, both sealed consumers, relevant custody, disconnect/carrier policy
and persistence proof. F4 below concerns the new expiry import invariant.

**F2 disposition: repaired in source.**
`systems_workshop_ui.js:6,21` now renders player-known workshop terms and receipts
in an expandable records section. The hidden committed wager fact is not rendered
there; knowledge records carry settlement information only after settlement.
`systems_workshop_content.js:51` now discloses both phial and meat in the ration
button. Native visibility and usability remain root's browser acceptance gate.

**F3 disposition: the named examples are repaired in source.**
`systems_workshop_validation.js:18` now requires the exact earned-minus-purchased
point equation alongside the settled-claim/cause constraints. Lines 19–21
reconstruct the selected represented experiment and require its completed cause,
exact recommendation and exact harvest. The read tests include the original
unfunded-point and false-recommendation import examples. No test result is claimed
by this reviewer.

**F4 [P2] New expiry facts lack their own import invariant.**
`systems_workshop_runtime.js:7–12` initializes `rationDue`/`parcelDue` only when the
ordinary preparation completion count increased from the prior state, then skips
expiry when the due fact is absent or the spoiled flag is true.
`systems_workshop_validation.js` does not validate those facts. Starting from a
valid completed ordinary comparison save, deleting its due fact or moving it
forward remains structurally accepted; because an imported completed count did
not just increase, reconciliation never restores its true preparation deadline.
The ordinary item can remain fresh indefinitely. Similarly, a forged spoiled
flag can suppress transformation while fresh stock remains. Derive/check the
deadline against the cause-bound preparation knowledge receipt and completion,
validate spoil-state consistency at the available envelope/custody boundary, and
repair or reject malformed imported timing. This is a new material persistence
gate, not a request for a general anti-tamper system. Source-derived scenario
only; root owns reproduction and repair.

The item registration also now precedes `setup_ids()` (`items.js:4543–4544`),
which gives these templates their ordinary native IDs before inventory use.

## Final requested expiry and installation readback

2026-10-11. Read-only requested recheck; reviewer ran no tests or native journeys.

**F4 disposition: repaired in source.** The validation now requires each
manufactured comparison's deadline to equal its actual knowledge receipt clock
plus four, rejects a deadline without manufacture, and requires deterioration
exactly when overdue. Its envelope check rejects expired fresh goods in saved
native and simulation custody. The reconciler no longer trusts an already-set
spoiled flag to skip actual transformation. `expansion_engine.js:630` invokes
reconciliation before state validation; native publication additionally supplies
chest custody. The source tests include deleted and moved deadline rejection.
The exact earlier malformed cases are closed by these source predicates. Root's
reported passing checks remain root-owned evidence; reviewer has not rerun them.

**Installation readback:** `systems_workshop_content.js:70` now consumes the
actual transferred fitting from Iona's custody, records installation, and pays
from her purse. Line 71 supplies a consequential actual-input job enabled by
that installation. This closes the earlier read-only-description concern for
the selected model application in source, subject to root's native proof.

**F5 [P2] Installed irrigation currently supplies preservation without its carrier.**
`systems_workshop_content.js:71` requires only an installed irrigation fact and
produces two `SWK.food` items, which are permanently stable Sealed trail rations.
Unlike the preservation preparation at line 51, it does not require a carried
Stillglass seal. Therefore a player can rehearse, make/install fittings and
obtain the fixed cheat's stable output without acquiring its carrier. The
installation can improve ordinary preparation yield, but cannot silently
replace the selected preservation mechanism. If sealed output is intended,
require the actual seal alongside installed irrigation. Otherwise use an
ordinary output with a declared expiry policy. This is a new local source
finding; it was not exercised by the reviewer.

## Root final disposition

F4 is repaired by exact manufacture-receipt deadline validation, clock-bound spoil flags, engine reconciliation, idempotent carried/provider/chest transformation and saved-envelope custody rejection. Focused source and native malformed-expiry import proof passed. F5 is repaired: installed irrigation requires the player's actual Stillglass seal before it can produce preserved portions. The focused absent/present carrier test, rebuilt natural repaired-process use and native removed-carrier rejection passed. All five review findings are closed for this selected candidate. Review observations remain source-only; root's executed proofs are linked separately in REPORT.md.

Root final review F6–F8: F6 corrected the title’s default self-issuer to the actual provider, displayed recognition and bound upgrade eligibility to it. F7 bound inspection to an actual carried kit and made refit consume that frame and a pin, yielding a native aligned kit with a funded dispatch consumer. F8 replaced renewal’s missing-faculty negative predicate with an explicit actual-held-source predicate; paid renewal and its useful output passed natively. These exact final changes are included in the passing rebuild identity and both final native scripts. No review finding remains open inside the frozen local edition.
