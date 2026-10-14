# BH: micro texture catalog shape

2026-10-14. **PROPOSAL ONLY.** Extends [root BH](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#bh-per-world-micro-texture). BH had no numbered entries; this packet introduces BH1–BH10 for its ten requested dimensions, and BH11–BH20 in [MORE](MORE.md). It does not replace BA–BG, P7's name grammar, P15's authoring pipeline or any world's laws.

## BH1–BH10: fields every catalog covers

| Code / dimension | Generator-readable fields | Selection rule |
|---|---|---|
| BH1 address | speaker/recipient roles, relationship direction, language/register, permitted title IDs, public/private identity | Read actual office and familiarity. Expertise, rank, kinship and affection are separate. Do not infer a title from power alone. |
| BH2 etiquette/taboo | jurisdiction/community, audience, gesture category, norm source, exception, enforcement owner or texture-only | A character's prejudice is an attributed belief. A norm does not cause punishment without a real law/actor consumer. |
| BH3 money/prices | currency ID, denomination, quote basis, quantity/unit, region/era, payer/payee, observed receipt or estimate | No generated exchange rate. Price talk reads an existing quote or a sourced scoped example; asking, promising and paying differ. |
| BH4 time/calendar | clock ID, date basis, certainty, appointment/repetition window, season/festival ID, layer conversion | Local lived, simulation, dream, system and outside clocks differ. Relative intervals can be used without inventing dates. |
| BH5 messaging/news | medium, issuer ID, recipient set, channel scope, sent/received times, latency basis, authentication, claim IDs, display grammar ID | Human rumor, official notice and system authority use different channels. Delivery is a receipt, not omniscience. |
| BH6 food/drink | species/body eligibility, named sourced or original dish ID, preparation/serving state, preference knowledge, texture/consumer distinction | Optional hospitality or benefit; comfortable unfed play and no hunger death. A sensory description cannot invent a buff, poison diagnosis or ingredient property. |
| BH7 routines by role | actor ID, actual role, place, activity phase, tools/stock, availability window, interrupt cause | Trainee, clerk, artisan, soldier, civilian and nonhuman routines differ. Planned work is not completed work. |
| BH8 superstition | believer/community, proposition/claim ID, basis, dissent, actual law if separately verified | Describe the belief category; never certify folklore or solve a sealed mystery. Ignoring belief stays reachable where actual consequences allow it. |
| BH9 slang | category, speaker/cohort/era, degree of formality, translation policy, original vocabulary bank ID | Categories only in these docs. Do not reproduce catchphrases, signature insults, sacred invocations or canon dialogue rhythms. |
| BH10 senses/props | sensory modality, observable subject/state, body access, prop instance ID, placement/history receipt | Keep scent, sound, light, texture and small objects grounded. A prop does not reveal hidden composition, identity or ownership. |

Each world/group file covers all ten. Bundled rows in smaller profiles explicitly identify the included codes. **UNKNOWN** is an evidence state, not a prohibition; the paired INFERRED suggestions remain available as labelled original/AU texture while source checks are pending.

## Proposed record and render contract

```text
textureCard {
  id: "BH.<world>.<dimension>.<variant>", revision,
  worldId, instanceId, continuity, edition, sourceCutoff,
  region, community, era, roleScope, language, register,
  dimension: BH1..BH10,
  evidence: {
    mode: shown | stated | inferred | unknown,
    route: primary | inherited-primary-analysis | secondary | project-original,
    sourceOwner, claimId, locator, attribution, speaker?,
    inspectedScope, conflicts[], reviewStatus
  },
  applicability: {requiredFacts[], excludedFacts[], clockId, audience, observer},
  semanticSlots: {actorRefs[], objectRefs[], claimRefs[], receiptRefs[]},
  phrasing: {originalBankId, reservedPatternIds[], translationPolicy},
  disclosure: {knowledgeBasis, visibility, sealedId?, discoveryRouteId?},
  effectOwner: null | existingOwnerRef,
  stability: {selectionScope, occurrenceId, retainedRevision},
  fallback: omission | neutralOriginal | attributedUncertainty
}
```

This is a proposed content record, not an allocated save schema or runtime API. Evidence belongs to the semantic proposition, not the whole paragraph. A SHOWN purchase can support a local price; a generated merchant's greeting is still INFERRED. `stated` requires narrator/system/person/wiki attribution. No fresh primary scene was read in P37: **SHOWN-reused** means a named analytical owner attributes a scene to its locator. Secondary digests never become SHOWN merely by naming a chapter.

Private indexes are locator sources only. Their prose is neither a vocabulary bank nor training examples. Paths and claim/member IDs may be retained; novel text and private notes may not be quoted. A canonical term can identify an attributed subject; its distinctive sentence, invocation, UI wrapper or recurring joke stays **canon-reserved phrasing**. Reserve names/unique identities separately through P7/P13. No close imitation by swapping names into a source sentence.

## BH text-layer switches

| Switch | Meaning and useful values |
|---|---|
| `evidencePolicy` | source-qualified canon; labelled original extension; explicit AU. Source gaps do not silently select AU. |
| `continuity` / `regionEra` | Pin work, edition/adaptation, source horizon, place and current historical state. Never merge TTKS books, Fate works, FMA continuities or LOTM/sequel eras. |
| `identityView` / `addressView` | Civilian, professional, alias or disclosed identity; actual familiarity and directional role. |
| `normView` | Public rule, custom, individual belief, disputed custom or unknown; enforcement reads its real owner. |
| `quoteView` | Actual current quote, dated local receipt, estimate, rumor or unknown. Hide prices that encode unobserved sealed truth. |
| `clockView` | Native/lived, system, dream, forecast, layer, relative-only or disputed calendar. |
| `channelView` | Spoken, written, courier/post, newspaper, forum, institutional feed, private system, public broadcast or unavailable. Include issuer/recipient/authentication. |
| `mealView` | Optional scene, known preference, supported benefit or no meal detail. Body/diet compatibility remains separate. |
| `routineView` | Actual free/busy/absent actor state; no arbitrary upkeep or unsupported absence simulation. |
| `beliefView` / `lexiconView` | Who believes it; formal/peer/trade/technical categories; original phrasing and reserved-pattern exclusions. |
| `senseView` / `propView` | Supported body channels and actual visible objects; known wear/history only. |
| `disclosureView` / `stabilityView` | Filter knowledge before choosing words; sealed ID/route only. Preview/load cannot consume a gameplay draw; retained callback selections survive reload. |

Filter by actual context, continuity and observer before choosing a card. Missing evidence uses omission, neutral original detail in an explicitly selected original mode, or attributed uncertainty. Render text from semantic slots; text never writes money, food, relationships, elapsed time, discovery or inventory. If a line offers an action, its target must already exist and be reachable. Keep multiple reasonable routes and per-world adjectives; no fixed global once policy.

Reuse [P11 CONTEXT](../p11/CONTEXT.md), [P7 shape](../p7/DATA_SHAPE.md), [P13 rules](../p13/RULES.md), [P15 report](../p15/REPORT.md) and [P36 checkpoint](../p36/CHECKPOINT.md). New evidence fields extend those joins rather than create a second person, clock, price, rumor or chemistry store.
