# CR1 consumable kinds

Status: PROPOSAL ONLY, 2026-10-14. All schemas, original examples, parameters and consumer choices are INFERRED proposals. No new runtime, accepted law, canon certification or gameplay proof. This extends [root CO1-CO10, RS2 and XD2-XD4](../../../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md), rather than replacing them.

[Dose and tolerance](DOSE_AND_TOLERANCE.md) defines the curves and ledgers used below. [Body and species](BODY_AND_SPECIES.md) defines recipient response. [P6 cooking](../p6/COOKING.md), [coatings](../p6/COATINGS.md), [patterns](../p6/PATTERNS.md), [pill invention](../p6/TECHNIQUE_INVENTION.md) and [container/fuel families M1-M2](../p6/MORE.md) continue to own creation. CR1 owns the proposed delivery and response join, not another chemistry, recipe, container, companion or social store.

## CO4.a Proposed records that fit P2 without rewriting saved revision 1

P2 locators here and in the other CR1 files are relative to the read-only worktree at /Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/proc-p2-mixing/. [REPORT](REPORT.md#p2-source-audit) records the inspected commit and limits.

SHOWN (source): P2 Product is {id, revision, unit, process, inputs, fractions, mass, dose, consumer} at src/mixture_state.js:47-71; dose has health, stamina, sedation and duration. Key is {id: MIXTURE_ID, mixture: product.id} at :73-74. Its use consumes one whole vial at src/mixture_native.js:16-19. Exposure at src/mixture_state.js:92-98 carries the exact stat payload, product reference, cloned dose, application/expiry times and replacement policy. These are narrow contracts, not generic schema extension points.

D1: Keep saved P2 revision 1 records and their interpretation unchanged. New consumers use a validated optional sidecar linking to retained product truth, or a separately versioned typed product envelope when new fractions/representations are needed. Root selects the actual schema number and writer after integration. Do not attach new consumer values to old P2 products and expect its validator to accept them: src/mixture_state.js:65 and :89 expressly restrict consumer/effect ID and compare dose equality.

Proposed semantic shapes, not exported JS APIs:

~~~text
ConsumableDefinition {
  id, revision, productRef: {id, revision, owner},
  lawRef: {worldId, id, revision}, kindCode,
  basis: {unit, contentsAmount, homogeneous, indivisibleIdentityRefs},
  constituents: [retained fraction refs], representations: [pattern/identity refs],
  deliveries: [{
    route, receiverType, requiredFunctions, interfaceRef,
    transferLawRef, doseCurveRefs, timeLawRef, stackingFamilyRefs,
    toleranceFamilyRefs, toxicityBudgetRefs, responseRuleRefs,
    consumerRef, observationProtocolRef
  }],
  permanence: {mode, gainFamilyRef?, transitionLawRef?},
  evidenceRefs: [{source, continuity, locator, label}],
  projectionPolicyRef
}
ConsumableInstance {
  id, definitionRef, holderRef, remaining: {amount, unit},
  relevantCondition, installedSurfaceRef?, chargeLedgerRef?, revision
}
UseIntent {
  causeId, actorRef, sourceInstanceRef, selectedRoute,
  requestedAmount: {amount, unit}, targetRefs,
  actualContactOrAreaRef?, expectedOwnerRevisions, observationProtocolRef?
}
DoseReceipt {
  id, definitionRef, productRef, sourceInstanceRef, lawRef,
  actorRef, targetBodyRef, targetBodyRevision, targetMindOrActorRef?,
  route, appliedAt, clockRef, transferredAmounts, rejectedAmounts,
  depositionOrWasteRefs, committedDrawRefs, responseSnapshot,
  scheduledExposureRefs, permanentChangeReceiptRefs, observationRefs
}
ExposureState {
  id, doseReceiptRef, targetRef, familyRef, consumerRef,
  state: pending | active | cleared | expired,
  amountByActive, absorbedByActive, reservoirs, budgetDebits,
  onsetAt, nextBoundary, remainingDelivery, remainingDuration,
  stackingDecision, lawRevision
}
~~~

Each ref includes retained revision. Typed quantities are exact normalized integer/rational values for stock; derived stat outputs may be finite floats with a declared precision policy. Owner references are stable identities, not display names. Retain source product after its last vial is spent, as P2 already does for its exposure graph. Sealed identities are referenced by ID only in reports.

CO4.b Native-effect adapter: finite active stat exposures may project to P2's existing ActiveEffect fields (name/id/duration/effects/tags/potency/group_tags/affected_by_travel/base_xp_value). The proposed extra receipt reference must be explicitly restored: src/active_effects.js:15-35 drops fields not in its constructor; :515-518 restores mixtureExposure specially. Pending exposures, cumulative burden, permanent gains, area residue and behavioral effects belong to their authoritative ledgers. They do not become fictional stat fields or infinite-duration buffs.

## CO1.a through CO10.a: delivery, curve and timing

All times and quantities below are ORIGINAL fictional test profiles in native game minutes, not real medication or franchise numbers. Body/route overrides can alter them. C1-C7 refer to [dose curves](DOSE_AND_TOLERANCE.md#co4c-curve-palette). A world may select none, generous, exact-ritual or different laws. Food is optional and never causes hunger death.

| Extension | Kind, route and typed dose basis | Curve / onset / duration proposal | Stacking family and actual consumer |
|---|---|---|---|
| CO1.a | Poison via swallowed fraction, wound transfer, skin contact or inhaled deposited amount; choose supported route per constituent | C3 threshold or C2 saturating harm; oral onset 2, wound 0, skin 2, inhaled 1; active harm 12 plus retained reservoir if authored | poison:<active>:<compartment>; additive absorbed burden, not latest-product replacement. A supported target health/recovery/status consumer reads burden |
| CO1.b | Antidote by oral/topical/fictional injected route, as admitted; neutralizer units are separate from poison units | C5 stoichiometric capacity; oral onset 1, local contact 0; binding takes one boundary, residual capacity lasts 6 if authored | neutralizer:<specific-target>:<compartment>; paid capacity accumulates or expires by law. Actual toxin reduction and accounted bound byproduct; no generic debuff deletion |
| CO2.a | Thrown/burst contents onto zone, target surface or airborne field; impulse energy/flash and material payload use distinct units | C1 deposited amount for oil; C2 intensity for smoke/flash response; burst onset 0, flash 1, smoke/oil zone 8 | field:<active>:<zone> plus recipient exposure families. Ground visibility/ignition/slip or actual target consumer. The throw is not itself a body dose |
| CO3.a | Permanent elixir/pill swallowed or supported energy-channel intake; active amount plus exact identity where required | C4 diminishing marginal gain; onset 5, integration job 30; persistent gain after settlement, residue clears under its own law | gain:<faculty>:<body-or-source>; cumulative entitlement; no timed replacement. Supported stat/faculty/body owner changes once per new paid receipt |
| CO4.a | Ordinary tonic or workshop contact: oral, skin, inhaled; distinct uptake by same active | C2 benefit with C1 burden; oral onset 1/duration 20, topical 0/10, fumes uptake throughout eligible interval | benefit:<active> may replace/strongest/accumulate; tolerance:<mechanism> and load:<compartment> persist independently. Real recovery and adverse-response consumer |
| CO5.a | Mutagen/body draught via oral, graft contact, bathing or source interface; template/integration units plus sample identity | C7 threshold and staged transition, optionally C4 incremental expression; onset 3, transformation 15, stabilization 20; reversible duration or persistent change explicitly selected | transform:<target-layer>; coexist, mosaic, ordered replacement or source-specific conflict. Body transition consumer updates actual functions/fit |
| CO6.a | Perfume emitted to observers, calming tea swallowed, truth serum/love/luck draught through supported body/mind/source route | C2 cue/mood intensity; perfume onset 0/10, tea 2/15; compulsions/luck use separately authored rules and durations | cue:<scent>, mood:<mechanism>, compulsion:<law> or luck:<source>; behavior/check consumer distinct from durable relationship facts |
| CO7.a | Bait/lure/repellent deployed as sensed field; pet feed or tonic voluntarily ingested/engulfed/absorbed; ration and active amounts separate | C2 attraction/repulsion with a supported preference; field onset 0/10; feed onset 3, useful benefit 20 or growth job 30 | lure:<cue>:<creature>, feed:<nutrient>, pet-tonic:<active>; real approach/avoid choice, recovery or growth job, not automatic taming |
| CO8.a | Read/burn/tear/activate scroll, talisman or charged carrier; dose is cast count/charge, not vial mass | C6 discrete dispatch; onset 0 or authored cast time 1; output duration belongs to the spell (e.g. light 10) | cast:<pattern>:<target>; copies can share definition but charges/custody stay separate. Actual pattern execution uses operator, carrier and fuel |
| CO9.a | Coated arrow/bullet/dart: installed surface → released projectile → actual target contact; dose by coat amount and transfer efficiency | C1 per-hit transferred active, then the target's CO1/C2 curve; onset contact 0, poison duration 12; coating persists until shot/weather/wash boundary | surface:<active>:<ammo-sublot>, target poison family shared with other routes; actual combat hit/wound consumer, spent projectile/residue ledger |
| CO10.a | Dream tea, meditation incense, insight draught: oral, inhaled or explicit mind/soul interface | C2 attention/practice modifier or C7 access trigger; onset 2, duration 20; dream trigger only during supported sleep interval | focus:<mechanism>, dream:<access>, memory:<transition>; real queued training/dream/evidence consumer. Does not grant arbitrary true memories or techniques |
| XD2.a | Medicinal meal, tonic soup, pill-bearing bun; edible serving amount and contained active amounts separately typed | C2 meal benefit, bounded at supported serving; onset 3/duration 30; embedded pill keeps CO3 law unless cooking transforms it | food:<benefit> plus shared active/burden families. Real stamina/recovery preparation; existing optional fullness mapped explicitly, never inferred from buff duration |

CO4 is intentionally a cross-kind contract and also supplies the ordinary-tonic example. It is not eleven independent subsystems. Profiles can support faster/slower delivery, no toxicity, no tolerance or powerful results when the world's adjectives say so.

## CO6.e and CO10.g proposed subprofiles

These ORIGINAL law IDs make the social/mind examples concrete. They are semantic data, not registered runtime laws. Each uses the definition/receipt/ledger shapes above. Quantities are fictional normalized units; these values are tuning proposals, not medical or canon numbers.

| Proposed law ID / root extension | Route, curve and onset/duration | Family, tolerance/burden and receiving-body data |
|---|---|---|
| calm-tea@proposal / CO6 | Oral active; C2 with Emax=1 and K=4; onset2, duration15; changes only a supported composure/dialogue modifier | mood:calm; strongest-envelope benefit, mechanism tolerance optional, burden none in this original mild law. Requires a receiving mood interface; does not erase anger/history |
| truth-draught@proposal / CO6 | Oral or explicit mind interface; C2 contest strength Emax=1/K=4; onset2, duration5; separately authored speech-compulsion consumer | compulsion:speech; strongest envelope, optional mind-load 1 per absorbed unit with recovery1 per eligible minute. Requires target speech/mind and local contest; reported statements retain believed/known basis |
| affection-draught@proposal / CO6 | Oral/mind interface; C2 attraction-cue strength Emax=1/K=4; onset2, duration10 | mood:attraction; family saturation, optional adaptation keyed to same mechanism, no toxicity in original fixture. A supported target preference/compulsion law reads it; durable affection or trust is not fabricated |
| luck-draught@proposal / CO6 | Explicit body-to-luck-source interface; C6 one paid activation charge, onset0, expires15 or spends on next eligible action | luck:local-source; multiple doses bank only actual paid charges if law permits; no biological burden in original source law. Requires real source coupling and committed saved draw/condition modifier; previews/load consume none |
| dream-tea@proposal / CO10 | Oral active into supported dream interface; C7 one eligible sleep-trigger access, onset2, expires20 if no sleep, or ends with that supported dream | dream:access; paid access receipts may queue under local law; tolerance/load none in original gentle law. No-sleep body needs another admitted access route, not an invented hunger/sleep need |
| focus-incense@proposal / CO10 | Inhaled uptake over actual occupancy; C2 Emax=1/K=4; onset1, effect while supplied plus tail3 | focus:attention; shared mechanism with any oral focus tonic if authored; optional respiratory residue, distinct from focus tolerance. No lungs means no inhalation unless another interface is admitted |
| insight-draught@proposal / CO10 | Oral or explicit mind interface; C2 eligible learning-rate modifier Emax=1/K=4; onset2, duration20 | focus:learning; family saturation, tolerance optional, toxicity none in original mild law. Requires a supported learned method and actual eligible practice; no free full comprehension or false historical facts |

For profiles with optional tolerance/load, the selected law must declare none or explicit parameters before admission. A proposed cross-kind test law can use tolerance rise1/10 per absorbed unit, exponential decay half-life60 eligible minutes, and efficacy computed from pre-dose tolerance; residue load can add1 per absorbed unit with clearance1/10 per eligible minute and an adverse threshold8. Those numbers belong only to an explicitly selected fictional test law. They are not universal body budgets. World/body overrides can supply uncapped, immune, sensitizing, absent or differently timed laws.

## CO1.c through XD4.a: tolerance, burden and recipient response

Use target-local response at committed delivery, not the maker's species. Budgets below are separate family/compartment ledgers from [DOSE_AND_TOLERANCE](DOSE_AND_TOLERANCE.md); shared mechanism IDs prevent source switching from resetting tolerance.

| Extension | Tolerance and toxicity data | Per-body/species response and exception |
|---|---|---|
| CO1.c | Poison tolerance family may lower susceptibility; organ/energy injury budget may still accumulate. Immune and clearance are separate fields | Require a susceptible receiving tissue/source and admitted route. Mechanical body can resist biological venom yet suffer authored corrosive coating; no universal poison-tag immunity |
| CO1.d | Antidote tolerance normally none in original fixture; neutralizer burden/clearance and capacity are explicit; antagonism rules can consume another medicine | Binding must match active ID/family, reachable compartment and phase. Species changes distribution, not the neutralizer's ability to cure everything. Unsupported match has its actual inert/side effect, rather than deleting poison |
| CO2.b | Atmospheric concentration reservoir belongs to zone; each body adds actual deposited amount to its own relevant budget | Lungs, eyes, surface or source interface read different channels. No lungs can exempt inhalation without exempting eye/skin/force effects. Targets outside actual coverage receive none |
| CO3.b | gain family tracks total assimilated units and lifetime gain; impurity/residue budget distinct; efficacy tolerance optional | Body stage/source eligibility and gain target explicit. A pill can refine circulation without supplying a missing magical faculty. Lawful alternate source or new realm may extend the curve, never reset it by renaming pills |
| CO4.d | mechanism tolerance and compartment load; immune trait, cleansing capability and protective equipment are read consumers | Response combines actual body functions, supported constitution and individual variation; a safety cap is optional per world. No surprise universal meter |
| CO5.b | integration/rejection budget only when authored; no required flaw or incompatibility score; exposure tolerance optional | Somatic, germline, soul, template archive and temporary expression changes stay distinct. New anatomy changes future uptake without rerolling old dose receipts. Compatible mixed traits can coexist |
| CO6.b | perfume sensory habituation, mood/drug tolerance and mind-load are different, optional families | Observer needs a detection channel; relationship/history/values remain. Truth serum may reduce inhibition, compel speech, fail or permit lies by its explicit rule, and never makes uncertain beliefs true. Control contested through actual means |
| CO7.b / XD4.a | feed satiety optional, nutrient benefit bounded, tonic budget body-local; repellent habituation local to actual encounters | Diet/source compatibility, life stage and individual preference. A spirit may accept ritual charge, a construct fuel, a beast edible feed; no forced human-food mapping. Bond ledger changes only from supported received care/history |
| CO8.b | no biological burden merely from activation; operator strain or recipient side effect only if authored; charge budget always real | Required speech/reading/gesture/source functions checked on operator; recipient response checked separately. Nonreader can use an admitted tear/trigger mechanism without gaining literacy |
| CO9.b | target burden shared with other delivery of the same active; shooter handling exposure only from real contact | Coating delivery reads penetration/armor/surface and projectile contact; missing hit does not give target poison. Scent/skin irritation to shooter is independently supported, never universal |
| CO10.b | focus/dream tolerance or mental residue optional; training progress distinct from temporarily improved rate | Actual attention, sleep/dream or soul interface. A no-sleep body can use a fitting meditation route. Memory of a dream is attributed evidence, not world truth or NPC omniscience |
| XD2.b / XD3.a | meal nutrients, embedded active tolerance and genetic-integration budget remain distinct; fermentation/digestion transforms only declared compounds | Edibility and absorption checked on each recipient. Bloodline awakening targets supported dormant expression or installation, not automatic inheritance or a universal stage reward |

## CO1.e Specific neutralization, not a universal cure

Original fictional example: active Q-A is in circulation, Q-B remains in skin, and damaging Q-A residue already produced injury. A neutralizer N-A can bind Q-A in circulation at two active units per neutralizer unit. One paid unit clears at most two units of Q-A; Q-B stays; injury stays. Save unbound remainder, bound byproduct, consumed N-A and any future release from a depot. A later dose of Q-A is new content, not prohibited because treatment occurred before.

Pre-contact detox is a product transformation with real reactants. Post-contact therapy is a body/compartment transition. Supportive medicine can restore recovery without removing poison. A universal magical cure can exist when explicitly authored with matching scope/source; it is not inferred from an antidote category. Existing native duration-halving venom care is a different treatment contract and remains unchanged.

## CO2.c Area delivery and CO9.c ammunition

A burst allocates payload once among ground deposit, airborne reservoir, direct contacts, retained fragments and sinks. All target receipts derive from that allocation. Flash/heat/light may follow an explicit energy/source law instead of conserving one bodily-dose pool. Do not give every occupant the whole flask, or conserve brightness as if it were venom mass. A basic zone/time/range model can precede geometry simulation; [CR2 world laws](../CR2.md) chooses original versus canon area rules.

Coated ammo uses heterogeneous sublots: base ammo ref/count, coating product ref, coat amount per member, cure/condition and remaining charges. Spreading one coat over five arrows does not make five full coats. Miss, block, penetration, recovery and washing account for actual transferred/remaining material. A multi-target projectile has a remaining coat budget after each contact. Stack only sublots with equivalent gameplay state; preserve distinct coatings after trade, chest transfer and import.

## CO3.c, CO5.c and CO8.c persistent changes and exact identities

Permanent elixir gains settle into the body/source owner with cumulative gain-family receipts. Timed integration can have a finite active status; the final permanent function cannot rely on an immortal ActiveEffect. Restoring a save never pays the gain twice. New paid doses remain valid, with reduced or alternate benefit under the selected curve; purification/new stage can change future conditions where supported.

Mutagens freeze selected target layer, original body revision, planned changes, reversibility and retention rules. Temporary disguise, inherited change and true species change are separate. Cancellation after irreversible integration accounts for partial change; it cannot recreate consumed medicine or erase a new organ by deleting a buff.

Scrolls/charges preserve pattern definition, consumed carrier and fuel separately. Copying a scroll's information does not clone its charge. Exact/conserved identities are non-fungible domains; dividing a carrier cannot multiply them. [Deep N7-N8](../../../../research/procedural-materials-2026-10-13/deep/REPORT.md) owns this distinction.

## Attribution and contradictions

A1: SHOWN/STATED are reused source labels, not fresh novel verification. [P6 canon locators K1/K3/K4](../p6/CANON_LOCATORS.md) cite HP Philosopher's Stone ch8, Goblet of Fire ch13 and Half-Blood Prince ch9 for ordered preparation, route/condition differences and revised technique. These support narrow process/route distinctions; no canon dose arithmetic is supplied here.

A2: STATED via existing research [B4](../../../../research/procedural-materials-2026-10-13/REPORT.md) and [deep N7](../../../../research/procedural-materials-2026-10-13/deep/REPORT.md): LOTM/COI characteristic conservation. Recipe-specific direct adaptation and continuity remain [CR2](../CR2.md), not a shared elixir default.

A3: K12 in the P6 ledger cites qualified cultivation mirror members0158/0209, with glyph/version limitations, for stage/source and processing distinctions. These do not certify a universal cultivation toxicity law. Root's Witcher-like CO4 reference is memory-derived; this lane uses original budgets and does not certify a current game formula.

F1 contradiction: root says the composition/process/route/dose contract supports every kind with its own consumer. That is a design-level statement. P2 source accepts one oral consumer, four fractions and one whole-vial use; some kinds need new typed representation/ledger/decoder, not only a consumer function. Preserve root options while making implementation cost explicit.

F2 contradiction: inherited status/audit absence claims predate P2; P6's in-progress checkpoint/no-report snapshot predates P2's final report. [CR1 REPORT](REPORT.md#contradictions-and-qualification) preserves both dates without editing sibling owners.

All cases above are specified, not executed. [REPORT gates](REPORT.md#future-gates-all-open) apply to any later selected slice.
