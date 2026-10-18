# My Hero Academia world pack synthesis

Status: M5 research synthesis proposal r1, 2026-10-14. This is not accepted design, implementation or canon verification against the primary manga. Every YAIRPG mechanic, scenario, start, data model and slice below is proposal `O`.

## 1. Sources and method

This pack follows [Source Deep Dive Playbook M5](../../research/SOURCE_DEEP_DIVE_PLAYBOOK.md) and the repo [source-deep-dive skill](../../../.claude/skills/source-deep-dive/SKILL.md). Full synthesis outline: sources; engine rules; catalogue; data model; play mapping; starts/AUs; more to consider; first slice; design-changing gaps.

Read in full selected form:

- Shard A: 689/689 retained inputs, 4,849,153 selected characters in 1,466 bounded chunks.
- Shard B: 945/945 retained inputs, 4,832,109 selected characters in 1,661 bounded chunks; plus 23 named audit payloads, 50,214 characters in 24 bounded chunks. Apply `NOTE_CORRECTIONS.jsonl` and shard A `ERRATA.jsonl`.
- The shard reader files are selected wiki input spans; full reading means every retained selected input, not every page or every biography in full. Images and expanded templates were not read. Paraphrased notes, summaries and correction/audit companions are retained in [readers-2026-10-14](readers-2026-10-14/README.md).
- Direct spot-check by search in private payloads: `Quirk` rev. 409871, `One For All` rev. 409338, `Copy` rev. 407112, `New Order` rev. 409119, `Brainwashing` rev. 399826, `All For One (Quirk)` rev. 409862 and `Trigger` rev. 402966. These are wiki payload text checks, not primary source checks.

Searched/consulted: the blocked no-revision `DIGEST_my-hero-academia.md`; MHA references in world-depth files; campaign framework, world completion template, secret policy, Bleach eight-owner layout, project summary and user vision authority. The MHA passages in world-depth had no dedicated MHA entry; starts and AU mechanics below are fresh local proposals, not claims extracted from a fan survey. No M3 fan premise survey ran. No whole primary manga, anime season or film was read. No web source was used. Sources and revision-bound claims live in [ledger](SOURCE_LEDGER.md).

The digest says `blocked_no_revision` and its older mappings are unverified. The WikiTeam snapshot is dated 2023-11-28 and secondary. Manga ending in 2024 and later source material are explicitly gaps. Shard A/B receipt integrity establishes that selected text was read, not that wiki interpretations are right. Paraphrased reader outputs and correction/audit companions were copied from the git-ignored lane into the dated reader folder per the playbook. The [ledger](SOURCE_LEDGER.md) preserves exact original paths and evidence limits. No raw wiki prose was added.

## 2. Rules an engine needs to model

| Evidence boundary | Snapshot assertion and source | Proposed engine shape |
|---|---|---|
| Quirk is bodily and individual | `Quirk` rev. 409871 describes training, exhaustion, bodily drawbacks and mismatched adaptation | `O`: `QuirkProfile(owner, factor, function, bodyInterface, trigger, targets, envelope, costs, condition, provenance)`; no global mana pool |
| Access and resource are different | `One For All` rev. 409338 and `Copy` rev. 407112 distinguish a copied factor from accumulated power | `O`: `CapabilityAccess` and `StoredResource` have separate owners; copy never clones stock by default. Model an effect created by copied access as an independently owned `EffectState` with its own target and end condition, since some non-body-restructuring effects outlast access |
| Body and source can limit use | `One For All` rev. 409338; `All For One (Quirk)` rev. 409862 describes compatibility, overload and proficiency limits | `O`: `BodyState`, `FactorState`, learned control and current condition resolve together; preserve exact ability-specific costs |
| Suppression, damage and cure differ | `Quirk` rev. 409871; `Quirk-Destroying Drug` rev. 409738; `Erasure` rev. 389772 | `O`: distinct effect targets and durations; no generic disable/heal toggle. For mutant-type bodies, retain the cited distinction between persistent appendages and potentially impaired factor-dependent function, alongside the same page’s conflicting claim that such fighters are immune; do not choose a universal result |
| Transfer routes differ | `One For All` rev. 409338; `All For One (Quirk)` rev. 409862; `Copy` rev. 407112 | `O`: each route names actor intent, contact/procedure, donor retention/loss, recipient, resource and residue |
| Conditional effects keep trigger and target | `New Order` rev. 409119; `Brainwashing` rev. 399826; `Danger Sense` rev. 405555 | `O`: store activation predicate, target identity/domain, range, rule budget, duration and counter evidence |
| External alteration is formulation-specific | `Trigger` rev. 402966; `Quirk-Destroying Drug` rev. 409738 | `O`: substance, source, dose, route, duration, cognition, permanence confidence and care are separate |
| Quirk growth has attributed theories | `Quirk` rev. 409871 | `O`: biology, verified event, public theory and actor belief are separate facts; don't universalize Quirk Singularity |
| Role is not power | `Heroes` rev. 407817; `U.A. High School` rev. 401755 | `O`: license, course, agency duty, jurisdiction and public reputation are independent records; civilian Quirk use requires a license or specifically evidenced exception, while an inferred supervisor privilege stays uncertain |
| Registration is not licensing | `Quirk` rev. 409871 | `O`: keep government Quirk registration and hero-use authorization as separate records; registration details may be updated as knowledge changes, with major or frequent revisions constrained |
| Admissions and work routes have eligibility | `U.A. High School` rev. 401755; `Heroes` rev. 407817 | `O`: applicant starts track written/practical admission and rescue credit; trainee work-study checks provisional-license eligibility; observation internships remain a distinct route |
| Perception is bounded | `Danger Sense` rev. 405555 and character/scene pages | `O`: observation records who sensed what, when, through which supported channel, with uncertainty and recipients |
| Continuity is source-specific | shard notes repeatedly label manga, anime, films, Vigilantes, novels and games separately | `O`: every claim carries selected version/medium; no blanket union |

### Evidence tensions to preserve

`One For All` rev. 409338 calls the power unstealable while also describing vestige resistance and an inferred/theoretical override. `Quirk` rev. 409871 changes framing around Quirk Singularity from popular theory to fringe explanation and later a claimed proof. `New Order` rev. 409119 describes an identity-based failure with differing citation strength across paragraphs. `Trigger` rev. 402966 crosses multiple media and leaves one exposure's permanence uncertain. Keep each statement and source attribution visible; do not settle contradictions with outside memory.

## 3. Full catalogue at a glance

The module owner has twelve proposal families. Main coverage: Quirk and body, development, transfer/alteration, support, license, rescue, information, institutions, relationships, reputation and ordinary life. Neighbor distinctions: factor vs stored stock; source vs practiced skill; gear vs body; temporary suppression vs factor damage; hero license vs capability; observed fact vs rumor; manga vs adaptation. There is no shared numeric rank ladder.

| Family | Coverage proposal | Main conflict/open gap |
|---|---|---|
| Quirk/body/development | Owner, function, trigger, compatible body, envelope, control and cost | Specific primary-source procedures and values |
| Transfer and alteration | Inheritance, copy, theft, duplication, drugs, suppression and healing | Donor/recipient edge cases and post-snapshot outcome |
| Support and rescue | Gear, custody, route, responder, people and evidence | Instance-local consumers and native durability |
| Institution and public life | School, agency, police, medicine, work, media, relationship and status | Selected era roster, law source and ordinary-life scope |

## 4. Proposed data model

```text
WorldSelection(family, continuity, era, region, entry, scenario, seed)
Actor(identity, body, household, knowledge, relationships, obligations)
QuirkFactor(id, owner, source, functionSet, integrity, provenance)
CapabilityAccess(actor, factor, route, trigger, expiresAt, restrictions)
EffectState(id, sourceAccess, target, effect, createdAt, endCondition, persistenceEvidence)
QuirkRegistration(actor, jurisdiction, registeredProfile, revisionHistory, confidence)
StoredResource(owner, resourceType, amount, replenishment, persistence)
BodyState(actor, adaptation, condition, injury, accommodation, fatigue)
LearnedControl(actor, function, practiceEvidence, proficiency, coach)
SupportItem(id, owner, holder, fit, function, stock, condition, approval)
Permission(actor, issuer, jurisdiction, role, duty, validity)
SchoolEligibility(actor, institution, writtenAssessment, practicalAssessment, rescueCredit, course)
Observation(observer, signal, channel, time, confidence, source, recipients)
EventClaim(subject, proposition, continuity, occurrence, revelation, source)
Consequence(cause, target, cost, acceptedDuty, aftermath, discovery)
```

`O`: freeze selected definitions, version and seed at Begin. Do not put factor ownership inside equipment bonuses, convert a copied capability into stored resources, or treat a public report as universal perception. Any persistence changes need an explicit compatibility decision or migration. This model is conceptual, not current schema.

## 5. How rules could become play

| Proposed play loop | YAIRPG seam to inspect | Missing binding |
|---|---|---|
| Train one actual function under body-safe constraints | Existing jobs, skills, energy and effects | Quirk-specific body/factor/cost and coach feedback |
| Rescue one person through different compatible means | Paid commands, participants, custody, claims and world effects | Independent instance, route model, responder capacity and legal permission |
| Diagnose/suppress or treat an altered Quirk | Medical/support actors, items, knowledge and contracts | Source-specific interaction and permanence; no generic cure |
| Build/repair support gear that changes output | Workshop, materials, item ownership and jobs | Fit, function, stock and repair state without granting source access |
| Handle public accusation from incomplete evidence | Observation, knowledge, relationship and reputation | Audience projection, legal review, source confidence and correction |
| Enter an AU or relationship start | Start composition and save slots | Immutable committed copy, provenance and compatibility rules |

The [implementation packet](IMPLEMENTATION_PACKET.md) names live code owners to inspect before any future authorization. It does not claim those seams already implement MHA.

## 6. Living beside the protagonist: starts and variants

No M3 survey ran. The six start proposals in [campaign](CAMPAIGN.md) cover civilian, applicant, support, supervised trainee, heteromorph and Quirkless entry points. Each needs actual era, household, means, authority, access and knowledge. Track government Quirk registration separately from license status; uncertain or newly developed profiles need a registration record and sourced revision history. Applicant eligibility should check the selected institution’s written and practical assessments and any rescue credit. A work-study trainee needs the required provisional license; an observation internship is a separate, narrower route. Verify all criteria for the selected era before treating these as canon gates. Do not cast a named protagonist or assume they owe the player an interaction. Relationship AU changes relationship state only unless a separate cause changes other facts. Public-divergence truth stays sealed by slot ID and discovery route.

## 7. More to consider

1. `O`: show three separate indicators for what this actor can perceive, what a device measures and what another person reported.
2. `O`: build challenge from actual mechanism and environment. Let an effective compatible ability win cleanly rather than adding a puzzle weakness.
3. `O`: represent body accommodation as ordinary life support, not a compulsory injury meter for every mutant-type character.
4. `O`: let license and reputation change access and accountability without becoming combat stats.
5. `O`: give each AU one declared divergence; preserve all unaffected source state and retain its own causality.
6. `O`: keep broad political/biological claims as character beliefs until a cited event supports them.
7. `O`: media, school and hero-work arcs need cast schedules and actual attention, not omnipresent canon cameos.

## 8. First playable slice proposal

`O` **Route and roll call:** a local district evacuation has a blocked route and incomplete roll call. One eligible licensed/supervised response or compatible support-gear path lets the player improve the route and reach people, with actual time, stock, responder availability, access and witness reports. A civilian helper may assist under responder instruction through actions that do not use a Quirk publicly; the helper label alone grants no Quirk-use permission. A Quirk-using response requires an actual provisional license or a separately evidenced exception applicable to the actor, action, jurisdiction and time. Do not treat a Pro Hero’s inferred temporary privilege as established law. Declining the optional duty creates no hidden debt. Do not require canon protagonist access, Quirk combat, prestige or an AU picker.

Desktop/laptop visible result: incident panel with route condition, actual responder availability, known people versus unknown identities, player's authority and means, costs, current deadline and sourced after-action report. Mobile optimization is deferred. Acceptance later requires a rebuilt fresh-origin browser journey across routes and refusal, plus save/reload/import and failed-publication checks. The slice remains a proposal; all runtime and human gates are open.

## 9. Gaps that would change the design

| Gap | Why it changes the design | Next useful check |
|---|---|---|
| 2024 manga ending and post-snapshot source | May change institutional status, Quirk outcomes, cast availability and the legal start/ending boundary | Acquire an explicitly selected complete post-snapshot primary source and repeat targeted source review; do not use memory |
| Primary-scene verification of transfer/copy laws | Could change who can inherit/copy/steal a factor, conditions, cost and donor persistence | Read cited manga chapters directly for One For All, Copy, All For One and New Order |
| Source of broad Quirk biology claims | Could change eligibility, inheritance and bodily adaptation assumptions | Compare `Quirk` rev. 409871's chapter locators against primary scenes; retain uncertainty meanwhile |
| Trigger formulations and permanence | Could change drug/exposure consequences, care and legal systems | Inspect selected manga, Vigilantes and film sources separately; resolve only chosen continuity |
| Hero law and licensing by era | Could change whether a civilian response is legal and which starts are eligible | Verify primary manga scenes and cited law/extras for selected jurisdiction and date |
| Local roster, schedule and first city | Changes playable relationships, travel and route consequences | Author a bounded region/era roster and test availability against selected source window |
| Save-instance and offline clock support | Changes whether the slice can persist independently without corrupting native progress | Integrator inspects live expansion/persistence owners and makes explicit compatibility decision |
| Fan premise usefulness | Could reorder starts or establish a better relationship/AU route | Run bounded M3 survey only if a later director decision needs it |
| Native execution and UI | Could change slice size and route count | Future authorized rebuilt desktop browser and persistence gate in implementation packet |

No design-changing gap is silently filled from memory. Research synthesis is complete within the stated snapshot; canon verification, implementation, gameplay and director acceptance remain open.
