# Original Dwarf Fortress-inspired YAIR implementation packets

Five selected proposals from the wider dossier. No copied code, art, lore or DF numeric balance; no runtime implementation. Existing base world and one prestige remain. Recheck current source fingerprints and reserve shared writers with the integrator before implementation.

## 1. DF-P01: A material treatment keeps the exact repaired object

At the existing Village workshop, inspect one actually owned measured strip or repair component. Choose a coating or reinforcement using actual eligible input, tool/right and willing worker. The retained object gains one purpose-specific quality and is later used on the same drainage/cover project.

**Means and costs:** Proposed original fees, material, effort and played duration are chosen by integrator; source DF balance is not copied. Preserve reusable tool/container.

**State and useful result:** One native item identity carries bounded treatment provenance; existing drainage/cover reader consumes its property. No duplicate item or mirrored inventory.

**Failure:** Unsupported body/right/material pauses or rejects before new spending; interrupted job follows its frozen reservation policy. Treatment cannot be farmed through split/merge or reapply.

**Current owner/gap:** Current measured-strip identity exists, but a general bounded purpose-specific item treatment descriptor/consumer needs the integrator.

Reuse: `src/world_completion_strip.js:1-18`; `src/world_completion_materials_facts.js:44-87`; `src/site_projects.js:4-26`.

**Later acceptance:** Later permitted playable check must show exact object before/after, useful alternate untreated route, real costs, cancellation, transfer and reload retaining one identity.

## 2. DF-P02: A small functional injury has specific care and useful work consequences

After an explicitly accepted local challenge, receive at most one supported hand wound or exposure with observed cause. Choose supplied dressing, safer rest or paid willing care; a precision task remains blocked or reduced only while the actual condition persists.

**Means and costs:** Actual care stock, consenting actor effort and shared played time; reversible original intensity/duration.

**State and useful result:** Existing condition/cause owner feeds native dexterity/work eligibility. Distinguish cleaned exposure, closed wound and recovered hand use; do not add a second HP drain.

**Failure:** Unsupported/nonliving/alternate bodies do not inherit human treatment. No occult cure of unobserved venom, permanent marks or another actor.

**Current owner/gap:** Current cut/listed-venom care exists; the meaningful extension is one explicitly differentiated tissue/faculty recovery state, not another renamed cut action.

Reuse: `src/status_care_facts.js:24-74`; `src/field_care_facts.js:1-24`; `src/simulation.js:424-446`.

**Later acceptance:** Later allowed gameplay proof must show cause, observed symptom, a practical alternate task, stock use, treatment-specific partial recovery, expiry and supported-body behavior.

## 3. DF-P03: A physical workshop record can be copied, entrusted and taught

The existing archive/workshop produces one owned field-method record from actual material. Keep it for study, pay a willing reader to make an attributed copy, or entrust the exact record to an eligible apprentice. Later useful work requires learned method and actual body/tool support.

**Means and costs:** Actual writing material, copy labor/funding, ordinary study time; copying does not itself grant comprehension.

**State and useful result:** One native record item retains author/sample/copy provenance. Existing knowledge owner records receipt, study and capable execution separately.

**Failure:** Withheld/lost/loaned original affects access; a received account is not direct witnessing. Unsupported language/body/method leaves knowledge retained and execution unavailable.

**Current owner/gap:** Current knowledge/custody/jobs support bounded authored steps; native physical record-copy/writing provenance and instructional completion need a scoped integrator binding.

Reuse: `src/people_knowledge.js:4-34`; `src/site_projects.js:4-26`; `src/simulation.js:472-501`.

**Later acceptance:** Later playable gate follows one original/copy through custody, actual material expenditure, study, independent learner choice, useful production and reload.

## 4. DF-P04: Pay for a qualified inventory report that can become stale

Ask an existing willing Village worker to count one workshop stock or appraise one sample at an actual desk. A quick estimate and a funded full count differ in precision and time; a later delivery/withdrawal leaves the prior report visibly dated.

**Means and costs:** Actual worker attention, site access and funds; voluntary refusal/other committed work remain valid.

**State and useful result:** Observer-scoped knowledge receipt includes count basis/time/precision and source cause. Planning UI labels the report while durable executor still checks authoritative stock.

**Failure:** A stale estimate never authorizes nonexistent stock; private possessions never appear merely because an NPC is registered. Update requires another real observation.

**Current owner/gap:** Existing sample provenance and witnessed views can be reused. A bounded estimate/exact-report definition and stale-report UI need authored content; no second accounting state.

Reuse: `src/people_knowledge.js:4-34`; `src/simulation.js:472-501`; `src/world_completion_materials_facts.js:44-87`.

**Later acceptance:** Later gate demonstrates estimate, full count, real worker costs/refusal, stock change, stale display and executor refusal on unsupported stock.

## 5. DF-P05: One settlement change attracts a specific informed danger

One completed frontier extraction/storage project changes the local situation. A visible report reveals a finite attracted animal or rival response. Choose quieter production, practical shelter/guard or a negotiated claim, then revisit the changed site.

**Means and costs:** Actual worker/tool/material/effort or finite trade cost; no daily mandatory upkeep and no automatic refill.

**State and useful result:** Existing situation and event/controller owners retain cause, target, observation and aftermath. Habitat/body/exposure facts determine the response.

**Failure:** Retaliation targets an actual informed actor/cause; unknown private work cannot create omniscient hostility. Withdrawal can leave a changed site while preserving separately owned body/stock time policies.

**Current owner/gap:** Current finite events/controllers and crop clock exist. One authored ecology/attention threshold with original danger/recovery outcomes needs integrator content, not a universal ecology simulator.

Reuse: `src/simulation.js:350-392`; `src/simulation.js:448-501`; `src/world_completion_crop_clock.js:1-12`.

**Later acceptance:** Later gate follows real development through known warning, chosen preparation/negotiation, actual costs, failure/withdrawal and a visibly changed return.

All packets require a compatible admission/migration decision for their exact new IDs or metadata. Source/build checks can support implementation, while gameplay/save/failure checks remain unrun until the deferred phase is authorized. Source-inspired proposals are distinct from verified DF runtime behavior.
