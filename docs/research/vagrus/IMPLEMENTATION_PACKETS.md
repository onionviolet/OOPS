# Vagrus implementation packets

Eight ranked **proposals, inferred** from the cited findings. Ranking is within this audit by fit and bounded integration cost, not a ranking of games. No packet authorizes implementation. Numbers, fiction, loss policies and offline behavior remain choices of the selected YAIR world. The installed-source pass qualifies the mechanisms below. Full reconstruction still needs runtime checks and the opaque limits in COVERAGE.

## P1. One colleague can object, negotiate or leave

**Basis:** F4, F12-F14, F30, F48-F49. **North star:** Followers and factions; heirs, People choose for themselves. **Disposition:** adapt first; medium cost.

Offer one optional shared freight job with an existing named helper. The helper states one relevant concern before commitment, responds to actual treatment, and can decline the next job. A disclosed notice period could permit negotiation, completion of the present contract, or immediate withdrawal if that world permits it. The reviewed Vagrus warning records end without negotiation, and eligible critical records remove the character with quest-specific cleanup. Negotiation and job settlement in this packet are original options, not attributed to Vagrus. Choose the local departure policy instead of importing its thresholds automatically.

**Incumbent:** `src/party_content.js` already gives Lio owned tools, effort and vitals; `src/simulation_effects.js:229-238` already records per-actor relationship axes with causal deduplication. `src/promise_content.js` demonstrates a separate NPC plan. Reuse these services, extending the existing people/center-menu view rather than inventing a second party roster. New authored state would be one concern, commitment and membership status, distinct from generic trust.

**Costs/effects:** a real agreed wage or relevant deed can change this relationship; gifts need not erase every objection. Departure withdraws future labor, not the player's unrelated skills. Owned equipment, outstanding wages and reserved work need explicit settlement. Neither departure confiscation nor automatic return is selected here.

**Proof for a later authorized slice:** demonstrate consent, a contrary choice, a warning and both negotiated continuation and departure branches. Repeat the same cause without duplicate loyalty gain. Save/reload/import before and after notice; helper-owned tools remain correctly owned, and reserved work settles once. Additive optional state for old saves, with no invented prior complaint. No offline departure until this world's timing rule is chosen.

## P2. A journey budget with an honest stop condition

**Basis:** F6-F10, F20, F25, F32-F35, F44-F46. **North star:** Work; followers running assigned routines. **Disposition:** adapt; medium cost.

Extend one existing Village to Town freight trip with a readable supply-and-time estimate. Player selects ordinary pace, a locally permitted hard march, or rest/resupply. Show known supplies, expected consumption and uncertainty separately. A companion's actual condition can alter this trip's duration without creating a universal hunger meter. The source has concrete staffing and beast trade-offs; its coercive crew economy is reported in F44, not silently recast as consensual employment.

**Incumbent:** `src/original_frontier_campaign_content.js` already reserves actual cargo and wages; `src/original_frontier_campaign_host.js:107-117` exposes journey progress. `src/expedition_content.js:133-149` already adjusts guide departure duration/reward. Native inventory owns supplies. New state, if needed, is a specific journey's remaining ration budget and stop reason.

**Costs/effects:** consume only reserved/owned provisions at the declared cadence. More cargo or passengers can change consumption when this route defines it. Local forage is an uncertain alternative, not assumed infinite food. Automatable repeat trips stop before an unmet supply/condition limit under a chosen local policy; harsh risk resolution is an available different policy, not imposed on vanilla.

**Proof:** compare two paces with equal starting cargo; exhaust provisions at the exact boundary; cancel without duplicate/refunded-consumed cargo; resupply and finish once. Save/reload/import during travel. Show estimates do not silently guarantee random harvests. Validate native travel and vanilla food/rest remain intact.

## P3. Completion stops the job clock; payment remains collectible

**Basis:** F19, F25, F39. **North star:** Work as careers and owned obligations. **Disposition:** adapt; low-to-medium cost.

For one timed receiver order, distinguish offered, accepted, physically completed and collected. Its deadline judges the completed work, while return to the employer collects already-earned pay when the local contract says so. A different world can explicitly require timely turn-in.

**Incumbent:** Original Frontier's phase transitions and reserved issuer/receiver coins, native cargo and completion requirements. Do not replace that economy with generated quest tokens. Additional state is a completion timestamp and payment receipt, only if existing phases cannot represent them.

**Costs/effects:** actual employer funds reserve once; actual goods change custody once; failure or cancellation follows the disclosed contract. Finishing grants a receipt, not a second batch of pay on every return.

**Proof:** complete just before the deadline and collect afterwards; miss the work deadline; save/reload/import after completion but before collection. Confirm exact once payment, returned/resolved reservations and no exploit from reopening dialogue. Optional migration starts existing old orders in their actual old phase, never inventing completion.

## P4. Show who supplied a check

**Basis:** F2, F11, F24, F36-F37. **North star:** Followers and factions; work uses real means; text UI. **Disposition:** adapt; low cost if current participants suffice.

For one existing freight or field check, show “you”, “Lio with you”, or “the local work crew” and the specific supported skill/tool contribution. Only committed participants contribute; a knowledgeable helper elsewhere is not automatically available. Compare negotiating, physical work and postponing as authored choices where possible.

**Incumbent:** `src/simulation_contracts.js:130` supports command participants; `src/party_content.js` provides Lio's real capability and resource costs; `src/promise_content.js` attributes knowledge to its observer. Existing command preview and center actions can show the contributing actor. Whether the current resolver supports this exact aggregation needs inspection before implementation.

**Proof:** same option with helper present, absent, exhausted and missing their tool; preview and actual resolution agree. Save/reload/import retained participants and costs without ghost contribution. Prefer derived display state; if recording a contribution, use existing causal receipt ownership. No inferred universal maximum/sum rule.

## P5. A deputy is a funded job, with duties and removable support

**Basis:** F1, F8, F15-F16, F30, F38, F44. **North star:** Followers and factions; owning the work. **Disposition:** trial later; medium cost.

Assign one willing quartermaster to one company task, rather than six copied deputy slots. Their real wage and local duty can improve one loading or provisioning operation. Removing them removes that support at the same commitment boundary; a newly invalid cargo/tool arrangement needs a disclosed local resolution.

**Incumbent:** actors, resources, owned inventory, timed commands and site capacity in `src/simulation_contracts.js`; financed tasks in `src/original_frontier_campaign_content.js`; solo routines in `src/village_career.js`. This adds an explicit role assignment and its obligation, not a parallel NPC clock.

**Proof:** accept assignment, pay from the employer's purse, execute supported work, dismiss and attempt the same operation. No lingering bonus, arbitrary confiscation, fabricated labor, double wages or capacity created by stale UI. Save/reload/import role/reservation state; absent optional field means no role. Authority growth, slot limits and company scale remain proposals.

## P6. Help a companion's project to unlock one new use

**Basis:** F4, F13, F16, F47, F50. **North star:** Followers grow; workplace people; meaningful progression. **Disposition:** adapt; medium content cost.

An existing colleague can request a local personal project and learn a specific new practice when they finish it. A quest can unlock that practice's training access; it need not gate their entire growth ladder. Current Vagrus story caps are 3/5/7/9, different from its old article; these caps are evidence, not selected YAIR tuning. Refusal leaves the person's own goal unresolved, with a locally authored next step. Personal rewards can differ between people.

**Incumbent:** Iona's known/practiced/solo progression in `src/village_career.js:135-194`, actor sources and attributed instruction, existing situation phases. Do not replace native skill XP with shared Insight just because Vagrus allocates it that way.

**Proof:** complete one project with actual tools, own time and teaching contribution; use its new function; choose a different project outcome. Repeated dialogue cannot regrant skills/items. Save/reload/import both branches and old empty state. Quest prerequisites, rewards and who remembers them should be inspectable, with no forced universal personal-quest gate.

## P7. Separate a faction's gift from its conditional service

**Basis:** F17-F18, F40-F41. **North star:** Followers and factions; each world makes its own rules. **Disposition:** park until a specific institution needs it; medium cost.

One existing employer/institution can grant a real owned reward and a separate continuing service tied to current standing. Losing standing may suspend the service while the object follows its own property rule. A regional nemesis lock could be another authored scenario, not a global hostility rule.

**Incumbent:** native reputation effects in `src/expedition_content.js`, simulation knowledge/facts and actual inventories. New state would be that institution's grant receipt and service entitlement. A generalized rival matrix is unnecessary for this one proof.

**Proof:** claim once, lose eligibility, retain or surrender the real object under disclosed terms, regain and reclaim service without duplication. Save/reload/import all entitlement stages. UI shows where the institution actually operates. No automatic world-spanning hostility, irreversible allegiance or inheritance of reputation selected.

## P8. The old leader's follower makes a new agreement with the heir

**Basis:** F14, F23, F26, F43, F49. **North star:** Heirs, People choose for themselves; accepted inheritance of what was left behind. **Disposition:** park behind the existing heir owner; high dependency cost.

When the actual heir slice is authorized, preserve a living follower's own memories and resources, then let that person assess the new leader. They may stay for pay, honor a promise, wait or leave. Their memories of the old person and their new relationship with the heir are separate. Vagrus supports an attitude/departure analogy only; this generational behavior is original YAIR design.

**Incumbent:** `src/simulation_effects.js:229-238` has directional actor relationships; current `src/chronicle_ui.js:56,121` still exposes the superseded one-lesson heir UI. Consult the owning heir implementation rather than modifying it in this audit. Heir inventory comes only from surviving estate/carrier records under accepted rules.

**Proof:** old leader leaves real wages/tools, successor receives only surviving assets, follower refuses or renegotiates. No memory overwrite, forged loyalty, duplicated property or unselected inheritance law. Save/reload/import before transition and after decision, including an estate with nothing left. Migration requires the heir owner's explicit compatibility design. This audit does not choose death, succession or offline policy.
