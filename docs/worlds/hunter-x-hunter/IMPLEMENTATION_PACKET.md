# Hunter × Hunter implementation packet proposal

Status: design-only staged packet r1, 2026-10-14. No code authorization, runtime edits or gameplay evidence are included. The first realm/one prestige boundary remains in force.

## P1. Proposed bounded slice

Build one independently authored applicant's ordinary preparation and one variable Hunter Exam scenario, with an optional post-pass credential path. Any two authored opening phases are a preview of the longer exam and cannot award a license unless primary review supports an explicitly exceptional complete exam. Show that useful work, travel, records and recovery function without Nen. If and only if a later authored state has a qualified willing teacher, add a small gradual Nen-training lesson. This slice does not include Greed Island, Succession Contest, canon protagonist replacement, random canon changes, death/rebirth or a second prestige.

Target form: desktop/laptop browser as required by standing UI direction. Visible outcome: an applicant can earn fare through a real local job, choose whether to register, face an authored uncertain test, and see the persistent result and actual evidence. Mobile optimization is deferred.

## First-slice prerequisites and later depth

Before implementation, pin a primary manga cutoff and verify the source claims used by the chosen exam, credential and any selected Nen lesson. Local jobs/fares remain explicitly authored unless a particular source claim is selected. Keep the two opening phases as a preview unless the source supports an explicitly exceptional complete exam; do not award a license for the preview. Inspect current owners for applicant identity, work/funds/time, credential custody, evidence and knowledge, scenario clock and persistence; assign one writer to each changed fact. Select a compatible existing save shape and exercise save, reload, export and import for any newly selected state. An old-save migration decision is needed only if schema/compatibility is actually changed.

Done check: chosen source locators establish the scenario's actual participation terms and outcome; two routes resolve their costs and information; an incomplete preview cannot grant a license; persisted state round-trips without duplicated work, funds or credential. WG12's per-observer visibility of a Nen construct is a constraint only if the chosen first slice actually uses such a construct. Construct catalogues, broad arc coverage, power progression, Greed Island and other WG extensions remain later proposals unless a chosen route requires them.

## P2. Staged dependencies and gates

| Stage | Proposed owner area | Deliverable | Observable gate |
|---|---|---|---|
| IP1 Source freeze | Lore/source owner | Primary chapter/volume locators for the source-facing claims actually used by this exam/credential slice; Nen details only if selected | Each selected claim has bounded evidence and continuity/exception labels; unused Nen catalogues do not block the ordinary applicant loop. |
| IP2 Scenario authoring | World GM | One local place, original supporting cast, one exam preview or explicitly complete exceptional exam, ordinary work route and exact participation terms | Two materially different routes resolve actual funds/time/knowledge; no license for a partial preview; no claim the exam is universal. Record any third-phase pass's next-year access separately. |
| IP3 Capability/state model | Existing system owners | Proposed integration map for identity, skills, aura, abilities, custody and actor knowledge | No duplicate state owner; write authority and compatibility decision approved before code. |
| IP4 Source implementation | Runtime owner | Actual job and exam interactions using existing lawful command/effect/save path | Focused source checks; no invented free outcome; fixed threat/cost remains fixed. |
| IP5 Rebuild and browser proof | Integrator | Own rebuilt bytes on fresh test origin at desktop target viewport | Exercise ordinary job, departure/decline, exam alternative, changed positive result and failure; source/evidence match served bytes. |
| IP6 Persistence proof | Integrator | Save/reload/export/import for changed state | Funds, date, commitment, custody, evidence and observer knowledge match exactly; failed write does not partially publish. |
| IP7 Separate director acceptance | Weibao | Review playable slice | Fiction, risk visibility, choices and pacing accepted or revised. This gate is not claimed by documentation. |

## P3. Completion-template coverage map (proposal)

All S00–S14 categories remain open for full-world completion; this map routes the present authoring scope without claiming detail-complete status.

| Section | Owner | Applicability and current coverage | Remaining gate |
|---|---|---|---|
| S00 Scope, sources, reconciliation | [Source ledger](SOURCE_LEDGER.md) | Applicable; dated secondary snapshot and limits recorded. | Pin primary manga cutoff and resolve core conflicts. |
| S01 Identity, laws, history | [Brief](WORLD_BRIEF.md), [ledger](SOURCE_LEDGER.md) | Applicable; Nen and institutional rules proposed. | Direct source audit, era/cosmology details. |
| S02 Starts, bodies, arrival | [Campaign](CAMPAIGN.md) | Applicable; four start candidates, not runtime starts. | Qualify compatible snapshots and selection/persistence policy. |
| S03 Places, environment, exploration | [Campaign](CAMPAIGN.md), [catalogue](MODULE_CATALOGUE.md) | Applicable; eight candidate contexts. | Location routes, hazards, materials, access and source review. |
| S04 People, relationships, organizations | [Campaign](CAMPAIGN.md), [interactions](INTERACTIONS.md) | Applicable; role proposals and knowledge rules. | Cast/means/availability and relationship detail per era. |
| S05 Everyday life, work, economy | [Campaign](CAMPAIGN.md), [interactions](INTERACTIONS.md) | Applicable; jobs, fare, trade and recovery proposed. | Actual prices, stock, services and recurring livelihoods. |
| S06 Items, materials, craft, technology | [Catalogue](MODULE_CATALOGUE.md), [interactions](INTERACTIONS.md) | Applicable; credentials, cards, tools and custody are scoped. | Item family detail, recipes, provenance and consumers. |
| S07 Skills, bodies, powers, development | [Catalogue](MODULE_CATALOGUE.md), [ability variants](ABILITY_VARIANTS.md) | Applicable; Nen family and personal ability contract. | Primary source, state owner, prerequisites and actual progression. |
| S08 Combat, danger, recovery | [Campaign](CAMPAIGN.md), [interactions](INTERACTIONS.md) | Applicable; fixed threat and failure proposals. | Threat profiles, targeting, loss/recovery contract and native proof. |
| S09 Knowledge, discovery, secrets | [Interactions](INTERACTIONS.md), [variants](ABILITY_VARIANTS.md) | Applicable; observer knowledge and opaque slot IDs. | Private sealed records, clue/payoff review and actor-level tests. |
| S10 Situations, dialogue, narrative | [Campaign](CAMPAIGN.md), [interactions](INTERACTIONS.md) | Applicable; exam, route and contract cases. | Character voice, full timing and refusal/aftermath details. |
| S11 Timelines, endings, continuing life | [Brief](WORLD_BRIEF.md), [campaign](CAMPAIGN.md) | Applicable; source snapshot remains unpinned. | Pin timeline, divergence, endings and continuation policy. |
| S12 Travel, worlds, other lives | [Campaign](CAMPAIGN.md), [packet](IMPLEMENTATION_PACKET.md) | Applicable; entry/return and Greed Island are proposals. | Instance/cargo/body adapter and exact exit rules. |
| S13 Presentation, usability | [Packet](IMPLEMENTATION_PACKET.md), [GM prompt](GM_PROMPT.md) | Applicable; desktop/laptop target and visible slice named. | Rebuilt target-viewport browser proof and accessibility review. |
| S14 Persistence, integration, acceptance | [Packet](IMPLEMENTATION_PACKET.md) | Applicable; required round-trip gate is proposed only. | Sole writers, compatibility decision, save/reload/import and director review. |

## P4. Known engine questions

These require current source inspection at implementation time: whether independent starts and continuity IDs have an existing owner; how actor-specific knowledge is represented; whether a training/project can own gradual aura change without a duplicate progression writer; whether local scenario clocks and exam expiry are persisted; whether a license can be modeled without adding a second credential owner; how high-risk failure policy interacts with existing nonlethal gameplay; and what migration/compatibility decision is needed.

## P5. Exclusions and open gates

No browser/viewport claim, migration, save edit, runtime source change, unit test or build was performed for this design-only packet. The first missing authoritative gate is primary manga verification for core laws and exact exam/licensing rules. Then scenario and data ownership must be reconciled before implementation. All generated prose and values remain proposal until Weibao reviews play.
