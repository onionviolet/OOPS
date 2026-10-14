# CR1 dose, tolerance and exposure

Status: PROPOSAL ONLY, 2026-10-14. Equations and sample numbers are original fictional game laws, INFERRED throughout. They are not real dosage instructions or certified canon formulas. [Kinds](CONSUMABLE_KINDS.md) binds each curve to a consumer; [body response](BODY_AND_SPECIES.md) determines who actually receives it. This extends root CO4, CO1, CO3, RS2 and XD2-XD4.

## CO4.c Curve palette

Dose is a vector of actual delivered active amounts with declared units, route and receiving compartment. Concentration is active amount per supported carrier quantity, not a synonym for total dose. Potency, peak response, total integrated benefit and effect lifetime need separate definitions. P2's saved revision 1 formula remains its own local reference-vial law, not silently corrected.

| Curve | Proposed function / required parameters | Good consumer and important distinction |
|---|---|---|
| C1 Linear accounted delivery | transferredActive = sourceActive × requestedFraction × transferEfficiency; efficiency in [0,1] for ordinary transfer; remainder has a destination | Coats, neutralizer supply, fumes deposition. Benefit can be linear over a declared useful range. Magical amplification needs an explicit source, not efficiency above 1 with no payer |
| C2 Saturating response | E(A) = Emax × A/(K + A), K > 0; A is chosen burden/concentration/exposure statistic, not arbitrary vial count | Recovery, focus, scent preference. Emax and K are local body/effect data. Linear or uncapped exceptional laws remain available |
| C3 Threshold and adverse response | H(A) = slope × max(0, A - threshold), or authored segmented curve; distinguish present burden from lifetime injury | Fictional poison/overdose, sensory overload or irritation. Susceptibility, threshold and slope body-local; threshold can be absent. No universal mandatory damage |
| C4 Diminishing permanent gain | choose cumulative potential G(S), then delta = G(S + assimilatedDose) - G(S); e.g. G(S)=g × log(1 + S/K) | Persistent elixir/pill gain. Later doses still give positive smaller increments under this example; no fixed once rule. Stage-specific/finite ceilings are separate local choices |
| C5 Specific neutralization | extent = min(eligibleActive, availableNeutralizer × bindingRatio); consumedNeutralizer = extent/bindingRatio | Only reachable matching active/phase/compartment. Preserve byproducts and injury. An expired capacity has no remaining neutralization entitlement |
| C6 Discrete charge/identity use | paidCount × supported output law; validate integral casts/unique identity custody separately from mass | Scrolls, talismans, charges. A partial carrier is not automatically a partial cast or duplicate conserved identity |
| C7 Staged integration/access | accumulated compatible input crosses authored transition boundary; next stage reads actual body/source/means and a saved receipt | Mutagen integration, bloodline awakening, dream access. Crossing a boundary grants only its named function; it does not invent the remaining body or mastery |

CO4.c1 Time kernel proposal: a delivery schedule stores onset delay, release segments, uptake/clearance and next boundary. For a direct temporary benefit, total benefit B(D) may be distributed as rate B(D) × w(t), with nonnegative w and integral w = 1 over its duration. Extending duration then spreads the same B rather than creating free total benefit. If the world's law instead supplies a constant regeneration rate for a purchased interval, name and budget that grant explicitly. P2 already uses rate-like stat bonuses for a fixed interval; do not reinterpret its saved payload as B.

Rapid/slow release can differ in peak, susceptibility, total uptake and clearance, with the released material accounted for. Delayed onset belongs to a pending ExposureState; do not apply a stat buff immediately and merely label it delayed. Instant bursts have event receipts, not a mandatory one-minute fake buff.

## CO4.e Proposed exposure, tolerance and gain ledgers

Use the [sidecar shapes](CONSUMABLE_KINDS.md#co4a-proposed-records-that-fit-p2-without-rewriting-saved-revision-1) against retained P2 product references. Only supported fields for a selected consumer need implementation.

~~~text
ResponseLaw {
  id, revision, scopeWorld, mechanismId, activeSelector,
  routeRules: [{route, compartment, uptakeLaw, releaseLaw, onset, clearanceLaw}],
  benefitCurve, adverseCurve, timeLaw, stackingRule,
  toleranceLaw: none | {family, risePerAbsorbedUnit, decayLaw, efficacyCoupling},
  burdenLaws: [{family, compartment, addedByActive, clearanceLaw, responseCurve}],
  interactionRules, permanentGainLaw?, observationProtocol
}
RecipientExposureLedger {
  targetRef, targetKind: body | mind | source | zone | surface,
  revision, clockRef, evaluatedThrough,
  exposuresByReceipt, reservoirsByActiveAndCompartment,
  toleranceByMechanism: {value, evaluatedThrough, lawRef},
  burdenByFamilyAndCompartment: {amount, injuryStateRef?, evaluatedThrough},
  gainByFamily: {assimilatedTotal, settledGain, receiptRefs, lawRef},
  retainedLawRefs, committedCauseReceipts
}
~~~

Rational stock/burden units persist without rounding traces away. Floating response values have explicit finite range/error tolerance; failure to represent extreme authored values is unsupported computation, not silent gameplay truncation. A body with no relevant budget has none, rather than an arbitrary zero capacity that rejects all potions.

CO4.e1 Tolerance: optional response adaptation keyed by mechanism and receiving target. Example T increases by alpha × absorbedDose and decays as T × exp(-lambda × elapsedEligibleTime). Efficacy multiplier 1/(1 + T) is one original choice. The law fixes whether efficacy samples pre-dose tolerance (the proposed first fixture) or explicitly modeled acute desensitization; splitting the same simultaneous input cannot gain extra efficacy through update order. Apply the same family to two chemically different products acting through the same mechanism if that world's law says so. Switching brands, renaming, splitting or replacing a buff cannot reset T. In contrast, an independent mechanism can reasonably have independent tolerance. Cross-tolerance is an explicit mapping, not universal.

CO4.e2 Burden: exposure adds actual absorbed load. With a selected linear-clearance law, L(after) = max(0, L(before) + incoming - clearanceOverInterval), resolved piecewise at dose/release/clearance boundaries. A threshold curve can affect work, recovery or safety. Beneficial adaptation does not automatically reduce injury. Acute load, slow residue and persistent injury can be separate when a consumer needs them; none is a compulsory panel.

CO4.e3 Gain: persistent improvement is distinct from both T and L. An original no-ceiling diminishing law can keep all reasonable repeat consumption reachable. A world may have a realm bottleneck, limited assimilation, refining skill, impurity purge, alternative ingredient, ritual or stronger constitution that changes future potential. The rule must state which gain total/target/stage carries forward. Clearing toxicity alone never resets lifetime gains.

CO4.e4 Dependence is an additional optional source-qualified rule, extending genetics SB3. If selected, retain exposure history, withdrawal onset, relief and recovery. It is not a default consequence of using a focus tonic. Similarly, immunity, sensitization and allergy are distinct optional responses; none is random punishment for an unknown product.

## CO4.f Stacking and interaction policy

Resolve each active/consumer family separately, then derive the projected native payload. Product identity is not the family key.

| Policy | How it works | Required saved detail |
|---|---|---|
| Latest replaces benefit | New temporary benefit replaces prior benefit in its family; old absorbed load/tolerance stays | Replaced benefit receipt, new receipt, remaining load and any still-releasing depot |
| Strongest envelope | Choose the strongest current contribution by explicit comparator; when it ends, an unexpired weaker contribution resumes if law says so | All unexpired source receipts and intervals. Never discard suppressed load or let strongest-only UI erase weak sources |
| Add with family saturation | Combine actual eligible exposure input, then evaluate one nonlinear family curve | Family total and each active contribution; don't sum independently saturated outputs to bypass the curve |
| Extend duration | Append purchased delivery/benefit budget through a declared expiry limit or no limit | Remaining budget and schedule; extension does not replenish spent matter or grant free magnitude |
| Independent coexistence | Separate consumers coexist; a named interaction rule may alter uptake, response or transformation | Exact participants, phases, amounts, interaction/law revision and cause |
| Stateful transformation | Antidote/reagent converts matching stock in a body/zone/source | Consumed amounts, byproducts, irreversible injury and remaining reservoirs |
| Permanent increment | Settle delta from cumulative gain law into supported body/source owner | Previous/next total, actual delta and idempotent settlement receipt |

CO4.f1 Resolve ordering: actual transfers/release → specified interactions/neutralization → compartment uptake/clearance under the declared ordering → tolerance/burden updates → effective family response → timed/permanent consumers → observations. The selected law must fix same-time ordering. If a poison and antidote are simultaneous, an authored before-uptake binding or after-uptake treatment can differ; neither is a universal default. Competing neutralizers bind allocated active only once.

Semantic new work is allowed indefinitely where world means permit it. Idempotent cause receipts prevent the same event settling twice, not a new paid event. Computation retention can compact settled receipts into sufficient cumulative statistics, retaining references needed by active effects/identity/provenance; compaction cannot forget tolerance or authorize another permanent gain.

## CO4.g Arithmetic probes, specified for future tests

Original fixture units A, N and native game minutes. These probes are specifications, not tests run here.

| Probe | Expected result |
|---|---|
| Same 8 active units, carrier 8 versus carrier 16 | Whole-batch active stays 8; concentration halves. A full-batch total-amount consumer sees equal active; concentration/rate consumers may differ by their explicit laws |
| Split 8 active + 1/100 trace into two equal homogeneous portions | Each contains 4 active + 1/200 trace; no safe zero-trace portion from display rounding |
| C4 with K=4 and g=1, assimilate total 8 | Delta is log(3). Two simultaneous 4-unit settlements telescope to log(3), not 2×log(2); receipt order does not create gain. Spaced doses can differ only where growth/assimilation law explicitly differs |
| C2, Emax=10, K=4, total current A=8 | Family response 20/3. Two independently capped outputs of A=4 would sum to 10 and are wrong for this family-add policy |
| Q-A=5 circulation, Q-B=3 skin, N-A=2, ratio=2 | Clear 4 Q-A; retain 1 Q-A and all 3 Q-B; consume 2 N-A, record bound material and preserve prior injury. No toxic-budget reset |
| New tonic replaces an active benefit | Benefit projection changes; old load, tolerance and delayed release remain. Replacing a product does not cleanse the body |
| One slow-release aliquot versus many immediate aliquots | Equal accounted total active, potentially different peak/duration/clearance and harm. Do not require physiologically different schedules to have identical outcomes |
| One work interval 20 versus twenty intervals 1 | Same ordered boundary events and final load/tolerance/benefit under the selected time law; pause contributes zero |
| Save during pending release; restore after source vial spent | Exact pending dose, body/law revisions and reservoir survive; no recreated vial, early onset or rerolled response |
| Supported cleanse followed by another exposure | Cleansing removes only its specified load; new actual exposure can create load again. Gain history and unrelated families remain |

## RS2.a Occupational exposure

Workshop exposure comes from actual emissions/contact and occupancy, not craft-button counts or a hidden accident roll. Proposed job emission record links cause/product active, release schedule, zone, phase, contact route and allocated amount. Ventilation moves material to a declared destination; gloves reduce admitted skin transfer; a mask reads an inhalation-interface law. Price or safety tag alone is not protection.

An original first fixture can emit 10 fictional units during a 10-minute process; 4 leave via declared vent/outlet, 2 settle into residue, 4 enter the remaining airborne pool. A recipient absorbs some of that pool under occupancy/uptake rules; other recipients share its remainder rather than each claiming all 4. A supplied ambient hazard can have a persistent external source if that source is explicitly funded by its law. Cleaning residue prevents later contact only where declared. [P6 BUILDINGS](../p6/BUILDINGS.md) owns installed space/capacity; [CR2](../CR2.md) owns emission/local hazard law; [CR3](../CR3.md) owns queues and stop policies.

RS2.b Idle exposure boundaries include start/stop emission, entering/leaving, protection change, ventilation change, uptake/release threshold, antidote, and body transition. One owner resolves a boundary once. A known safe-work threshold can pause an opted-in routine before further exposure; an enabled powerful constitution can permit continuous work instead. No mandatory daily chores, universal hazard roll or global poisoning meter. Cozy, sharp, immune and no-hazard laws remain reachable through appropriate world profiles.

## CO4.h Time and persistence contract above P2

SHOWN (source): P2 uses native calendar application/expiry at src/mixture_state.js:92-98, writes its effect at src/mixture_native.js:38-43 and directly publishes it at src/main.js:4668-4681. Native remaining duration is decremented at src/main.js:7225-7244; saved expiresAt is retained metadata, not the comparison used in that loop. Travel applicability and sleep/debuff handling already exist there. This audit did not reproduce any clock defect.

D2: Each new ResponseLaw names its clock basis, eligible work/sleep/travel intervals, pause behavior and optional offline policy. Proposed first implementations use supported played time, closed-browser pause and no world-away advancement. Preserve P2 revision 1 timing. Sleep speedup must be applied once through a supplied elapsed interval, not multiplied again inside the new ledger.

New schedules store evaluatedThrough and nextBoundary. Restore validates timestamps/duration/schedules against the selected law rather than awarding elapsed wall time on load. Save during delayed onset, active release, neutralization, tolerance recovery and permanent integration. All affected stock/target/body/zone/gain/knowledge/draw owners join one durable envelope before publication. A rejected write must change none; a committed write with later UI failure cannot refund consumed medicine.

[CONSUMABLE_KINDS](CONSUMABLE_KINDS.md) identifies the old effect/decoder validation seams. A new optional owner needs explicit compatibility and import preflight. Old saves without it remain absent and unchanged; retained old laws prevent new curve edits rewriting old doses. Unsupported required data is not an unknown-to-player property and must not default to harmless zero.

## XD2.c, XD3.b and XD4.b reachable alternatives

Medicinal meals can carry the same active as a tonic, with different release and taste; their shared mechanism prevents disguised stacking loopholes. Food's useful recovery/preparation benefit stands independently of optional nourishment/Famine. Auto-eat or auto-tonic uses a selected reserve/unknown-item policy and does not erase deliberate underfed training.

Purification, rest, antidotes, paid expert help, new constitution, compatible body change, alternate delivery and alternative active can each provide relief or different progress where local means support them. These coexist; this proposal does not force one choice or invent a drawback for an exceptional body. Breeding aids may improve a supported developmental/reproductive process, but do not grant a child a bloodline unless the separate inheritance law does so.

All source/native/persistence/balance gates are OPEN. These equations are enough to implement a narrow selected consumer without requiring a universal pharmacology simulator.
