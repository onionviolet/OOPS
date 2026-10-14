# BI3: one writer per authoritative store

2026-10-14. **PROPOSAL ONLY.** Module names in this document are suggested integration areas. They confer no runtime reservation or dispatch. Existing executable owners remain authoritative during migration. A façade can normalize queries before a store is physically unified.

## BI3.1: ownership map

An owner is the reducer/validator permitted to change a record. The host publisher coordinates one transaction across those reducers; it does not become an alternate domain writer. Read adapters return immutable snapshots with revision and availability. Root still serializes shared registration, `main.js`, save envelope and publisher changes.

| Store | Proposed sole logical owner / backing | Authorized write inputs | Readers |
|---|---|---|---|
| Entity directory / tombstones | `story_entity_refs` adapter/registry | Explicit admissions, supported legacy binding, fork/crossing/promotion/retirement | Every lane via BI1, never names |
| Settled outcomes / operation directory / coverage | Successor of P34 `lore_history_state` | Validated actual transitions from registered producers in the detached transaction | Every lane via BI2, restricted lenses |
| Requests | `request_state`, consolidating P11 N1 and P34 S-3 | Need owner revisions, issuer terms, reservations, admission/settlement/cancel/amend reducers | P3/P12/P21/CR4/P27/P31/P33, intent UI |
| Relationships | `relationship_state` façade, initial partitioned legacy backing | Explicit directed act/response, bond admission, owner-approved decay policy | P19/P23/P27/CR4/P36; safe People projection |
| Promises / favors / oaths | `promise_state`, P31 semantics | Explicit accepted terms; typed progress, amendment, waiver, transfer, dispute, enforcement | Requests, P12/P19/P21/P24/P27/P33 and power adapters |
| Knowledge / belief episodes / observations | `knowledge_state` façade | Actual witness/protocol, delivered message/claim, corrected belief, qualified learning | P11 KnownContext, P15/P17/P23/P24/P25/P35/P36/P37 |
| Threads / arc recognition | `story_thread_state`, P12 | Cause-backed admission, beat changes, closure and evidence-supported recognition | P3/P14/P17/P19/P23/P25/P26/P27 |
| Places / site narrative bindings | `place_story_state`, P20 | Actual site/occupancy/control/residue transition references | P11/P12/P20/P24/P25/P35/P36 |
| Ventures / crew-stage binding | `venture_state`, P21 atop selected management/expedition owner | Funded agreement/stage/result/custody refs, accepted standing policies | P8/P11/CR4/P21/P27/P33 |
| Content packs / locks / activation | Existing `content_packs` and structured-pack owners through `pack_contracts` | Validated definition lock, selected activation/migration/dormancy transaction | Every generator, P7/P9/P10/P13/P15/P22/P37 |
| Storyteller / taste inputs | `storyteller_state`, D9 with one P28 taste reducer | Explicit style/policy changes, actual impact refs, approved feedback epoch | P3 selection, P22 tools, P18 metrics |
| Claims / accounts / frozen editions | History owner's distinct account tables, P14 | Authored assertion, real composition/publication, attributed correction | Knowledge/message owner, P15/P17/P24/P25/P33/P37 |
| Information transport / circulation | `message_state`, P11 N5/N6 | Real channel dispatch/arrival/correction; library/copy custody refs | Knowledge, social, media, crossovers and books |
| Intent / ambition / inner-life bindings | P23 goal/interpretation owner; P28 saves a reference | Explicit confirmed goal/endorsement; supported actor-local intention and consequence | P12 planner, P15 topics, P28 parser, P25 view |
| Feedback / help / presentation | P22 feedback, P28 help, P25 view preferences, separate record kinds | Explicit mark/help action or lens/reading cursor change | Taste reducer, renderer and optional local telemetry |
| Confidential circumstance / evidence access | `confidential_state`, P31, with references to existing sealed owner | Actual cause or coherent admitted original circumstance; supported access/disclosure changes | Knowledge, transport, promise/deal owner and actor-local planner; safe views never expose raw truth |
| Challenge / practice assessment | P23 goal owner with P35 typed evaluator; P31 rite references | Explicit accepted challenge, actual qualifying outcome/coverage, actual practice/offer/reception | Threads, history/knowledge and separately qualified power/recognition handlers |

The required first ten stores each have one logical owner. Additional rows keep similarly named records from leaking into another store. `request` means an in-world funded/need-based request; a P22 director request is an editorial artifact under content tools, not a payer or NPC commitment.

## BI3.2: preserve existing partitions until a compatible migration

Relationship façade bindings select exactly one backing writer per edge/axis semantics. Current simulation axes are directed finite values with 32 memories; chronicle axes have separate bounds/ties. Keep those distinctions and pin their old semantics. P19's SocialEdge joins them; it does not normalize values or combine opposite directions. A future common axis representation needs an explicit migration. P4 does not acquire a duplicate simulation purse just to become queryable.

Knowledge bindings likewise preserve current simulation stage/value/basis, P2 exact-product observations, P4 discovered traits, chronicle knowledge and sealed route stages. One logical gateway delegates to the sole existing writer for each owned dimension. General claims/belief histories can be additive: the legacy key becomes a current projection of explicitly received evidence. A same-rank overwrite is not a historical correction record unless a producer emits one. `people_knowledge.js` is a projection, not a store. See [SOURCE_AUDIT F3/F4](SOURCE_AUDIT.md).

Places owns narrative joins and supported new site metadata, not another native location graph, title ledger, inventory or prosperity balance. Ventures owns agreement/stage references, not another management treasury. Pack contracts owns lock/compatibility metadata, not book prose. Storyteller owns future weights/cadence, not physical mixture potency, response consent or a second event timer.

## BI3.3: requests and promises cooperate without duplicated obligations

```text
need owner -> request owner offers current terms
explicit acceptance -> request admission + promise instance + real reservations
work owner settles actual progress -> one Receipt
promise owner evaluates obligation -> typed state / settlement ref
request owner projects fulfillment from that obligation and need result
thread owner advances only supported dependencies
```

A request may have zero accepted promises, several partial contributors, or an explicitly joint obligation. Every accepted commitment points to one promise instance or a deliberately retained legacy obligation binding. Do not keep independent `paid` booleans capable of awarding the same fee in both stores. Money stays with native/actor/management funds; custody stays with inventory/loan owners. A promise is not automatically a magical oath. P31's enforcement adapter and P17's power grant are separate actual outcomes with their own source law.

A partial supplier can fulfill their admitted contribution without closing the entire need. Concurrent fulfillment reads current need revision and reserved allocation. Amendment appends terms/acceptance evidence; it cannot silently rewrite the quote already accepted. Unaccepted invitation expiry is not broken promise or debt. New requests remain possible under local adjectives.

## BI3.4: read/write contracts and conflicts

Commands carry expected sequence, participating owner revisions, scope, operation key and known offered terms. Pure previews allocate no IDs, entities, history, resources or draws. Each owner validates its detached delta; cross-owner validation checks binding, custody, deadlines, evidence, replay protection and retention closure. Publisher writes the complete compatible save before publishing any participating result. Callback failure cannot leave paid stock without its promised settlement record.

Consumers declare query dimensions and pins. They cannot silently expand from `latest contact` to `all witnessed crimes` after compaction. Mutable caches label input revisions and can be rebuilt; authoritative state is never reconstructed by parsing recap prose. Missing required semantics block that reader only. Missing optional semantics yield no influence with declared availability.

Content, semantic and runtime writers are separate. P15/26/37 can author definitions and safe text; they cannot mutate people, promise terms or physical state. P22 director sessions can invoke explicitly isolated test adapters; their interventions stay test-origin and do not grant real-player achievements. P18/P32 QA and local play logs are separate diagnostic outputs, not a second history database.

Late P31 contracts distinguish `ConfidentialRecord`, `EvidenceRecord`, observer `ConfidentialHolding`, `DisclosureEpisode` and funded `InformationDeal`. Bind truth to its actual owner, holding to knowledge, delivery to message, evidence to retained receipt/object/protocol, and deal terms to requests/promises. A disclosed claim is not proved truth. Faith practice, physical offering, claimed supernatural receiver, actual reception and source grant remain separate transitions. P35's `Suggestion`, `AcceptedChallenge` and `ChallengeEdition` specialize a goal/evaluation contract; a negative predicate requires complete declared coverage, never an empty feed.

## BI3.5: crafting code extensions through these owners

| Existing palette codes | Consolidation extension |
|---|---|
| MK2/MK6, EC1-5, SO1-4, NP | Maker, commission, buyer and recipient bind stable refs; request and venture owners settle actual goods/funds; directed social response reads its own received evidence |
| IT1-5, RX4, RS3, PR | Manufacture truth, per-copy lifecycle and site contamination stay separate; changes emit receipt refs; inheritance retains definition/holder closure |
| KN1-4, CL, PG | Work/edition/method claims share provenance; sample scope and actual learner evidence belong to knowledge; copied testimony is not independent corroboration |
| AU/SC, FE6-7, TL | One job/scheduler route and actor-aware stock host; pure planner/sandbox over the same resolver; diagnostics do not settle production |
| CO/RS2/XD, WL/CT/RX | Body/route response and explicit world law own effects; exposure references consumed products; powerful exceptions emit their actual source receipt |

Link the [crafting drafts](../crafting-lanes/) and current [CR1](../cr1/REPORT.md), [CR2](../cr2/REPORT.md), [CR3](../cr3/REPORT.md), [CR4](../cr4/REPORT.md). These connections add interface requirements, not duplicate feature specifications or new runtime gates for every proposal.
