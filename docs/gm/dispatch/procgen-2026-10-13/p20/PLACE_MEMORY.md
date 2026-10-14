# H1 extended: places retain causes, people retain accounts

2026-10-14. **PROPOSAL ONLY.** Docs-only/source inspection. This extends [root H1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#h-places-that-remember), not a selected migration or runtime API. [D8](../p5/D8_LORE_GRAMMAR.md) and [P14 CONTRACT](../p14/CONTRACT.md) own historical receipts, claims and retention. P20 adds place binding, place queries and useful local consumers. [REPORT](REPORT.md) owns audit limits and future gates.

## H1.1: a place is an identity, not a name or a visit

Use a bound reference to world definition, continuity/instance, authored region/layer/location and optional authored site/object. A display name, market region, current owner or visit ID cannot substitute for that binding. Two branches can contain the same named bridge with different histories. A rebuilt shop on the same authored site may have a new fixture or proprietor while retaining the site's older history. A movable home has an object identity and a dated current endpoint; its own past does not become the past of every port.

Proposed relation, extending P14 rather than creating another event store:

```text
PlaceEpisodeLink
  historyReceiptRef, placeRef, role: occurredHere | affectedHere | departedFrom | arrivedAt,
  intervalRef, authoritativeProducerRef, actualConsequenceRefs,
  disclosurePolicyRef, retentionQueryRefs
PlaceQuery
  instanceRef, authoredPlaceRef, optionalSiteRef, interval,
  originFilter, outcomePredicate, observerRef?, requiredEvidenceClass
```

`originFilter` distinguishes sourced past, generated background, premise overlay and lived outcome. A claim about a place links to an Account/Claim; it is not a new PlaceEpisodeLink asserting the claim happened. An event affecting three places has one historical identity and three typed links. Counting a regional impact uses distinct outcome IDs, not the number of links.

## H1.2: what live source shows

| Code | SHOWN/SOURCE, inspected 2026-10-14 | Implication, INFERRED/proposal |
|---|---|---|
| F1 | `src/models/location.js:104-109,168-174,197-218`: IDs, descriptions, connections, NPCs, housing/crafting and market-region fields. `src/data/locations.js:330-339` already changes Village description with actual rat-clear counts. | There is reactive authored place text already. Add typed episodes and broader callbacks; do not claim places never react today. Market-region keys are saturation scopes, not a geographic hierarchy. |
| F2 | `src/simulation.js:399-411` freezes occurrences, applies effects and prunes terminal display records above 100; `:427-442` applies response costs/effects and records settlement cause. | Capture a producer's actual applied result before pruning. An open offer, intended effect or missed invitation is not proof of a completed repair. |
| F3 | `src/world_visit_history.js:21-58` validates/reconciles before pruning ended visits, retains referenced rows and selected arrival/return rows. | Reuse reference-aware retention discipline. Visits prove presence intervals, not every deed performed there; absence of a retained visit is not proof nobody visited. |
| F4 | `src/life_record.js:1,32-47,65-77` explicitly owns a lossy biography and creates no fabricated old past. | Never parse biography highlights to supply historical requirements, forgotten witnesses or rewards. State coverage since enrollment. |
| F5 | `src/causal_story_core.js:79-113,282-298,390-422` validates evidence, preserves bounded causal receipts and distinguishes closure outcomes. `src/causal_story_host.js:458-474` projects received knowledge. | Adapt retained outcomes read-only; its exact proof fields and reserved receipt capacity are not a general-purpose place-history ledger. |

These are source observations, not executed behavior. Narrative/supporting projections were also inspected: `src/causal_story_scenes.js:38-48,62-82` selects received accounts; `src/causal_story_ui.js:34-57,60-72` keeps quoted terms and text separate; `src/causal_story_native.js:27-28,47-52` binds the existing narrow location/domain; `src/causal_story_content.js:23-29,60-65` authors attributed knowledge and later talk. None of these observations establishes a generalized settlement simulator.

## H1.3: four readers with different rights

| Reader | Reads | Concrete generated content |
|---|---|---|
| Event admission | Actual place condition, typed qualifying outcome, participants and means through [P11 context](../p11/CONTEXT.md) | A repair anniversary, new inspection request or reopening job from that exact cause. P3 freezes the occurrence; P12 owns any multi-step arc. |
| NPC conversation | That speaker's witnessed or received evidence, own goal and relation to listener | A returning worker remembers joint work; a newcomer attributes a story to a notice. P15 owns topic/voice realization. Neither automatically knows the hero's role. |
| Place description/Notebook | Player-known changes and accounts, with observed/heard/as-of dates | An old support beam and a dated account can appear together without revealing a hidden cause. Current physical observation can correct a stale report. |
| D9 pacing | Supported measured impacts within that place and declared time window | A relief opportunity can gain weight. It cannot declare damage, ghost formation or a successful repair. |

Keep private causes out of speech topics, available-action counts, sorting, map badges and debug exports shown to the player. A callback may use hidden physical truth internally only when its publicly visible result follows an allowed route; an NPC's explanation uses their own evidence. Sealed references use IDs only, governed by [WORLD_SECRETS](../../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md). Background texture is allowed without a reward; label its consumer as descriptive.

## H1.4: one worked original thread

Illustrative fixture, **INFERRED/proposal**, not a current scene: an introduced worker and the hero repair an authored public workbench cover using actual timber/tools/work. Producer records their contributions and the cover's installed function. H1 links the receipt to that exact site. A later admitted inspection request reads the retained installation result and current wear policy. A witness's conversation mentions both contributors; a relayed account crediting only one remains an attributed claim until checked. The improved cover changes one supported wet-work interruption or batch exposure consumer, specified by the selected builder.

The site can be repaired again after a real new cause. A previous refusal allows later assistance, commission, another site or return. No lifetime once rule, forced virtue, invented automatic neglect or compulsory subscription to maintenance. Memory preserves damage and repair episodes even when current condition is sound. If the cover is removed, the account still exists but no longer grants shelter.

## H1.5: transaction, retention and future proof

Stage domain outcome, P14 receipt/place links, any earned knowledge and consumed integrated P1 stream in one detached save transaction before native publication. A place index is a derived lookup or one retained relationship to the history owner, never a duplicate purse, object condition or reward balance. New story selection depends on actual retained predicates; a grammar is a renderer, not a historical writer. Pure previews/visits/description refresh draw nothing.

Pin the minimal outcome and identity capsule needed by active callbacks. If an upstream event window expires, keep required actual values; an ID/hash alone is insufficient. Compact routine work only under P14's query contract. Preserve exact consequential records where promised; do not reuse D8's old proposed weight expiry to erase a live dependency. Mark legacy/pre-enrollment periods unknown rather than reconstructing deeds from description counts. Unknown is not zero or a negated satisfied prerequisite.

Future proof, all OPEN: natural paid repair → observed functional change → later place-specific talk/offer; alternate refusal/removal produces a fitting different consumer; pruning feed/events/visits does not change eligibility; Save/reload and Export/literal-file Import preserve links, witnesses, conditions, pending offers and next draws; identical names across instances do not join. Rebuilt 1366×768 and 1600×1000 show the current site, known past and native action together. Human fiction acceptance remains separate.
