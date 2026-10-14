# Shared generation context

Status: PROPOSAL, 2026-10-14. Documentation only. This contract is a proposed adapter over existing owners, not implemented infrastructure or a new source of product authority. All examples are original fictional designs. No canon passage or private novel note is reproduced.

## C1: scope, authority and evidence lens

Read [COMMON](../COMMON.md), [PROJECT](../../../../../PROJECT.md#standing-priorities-and-document-authority) and [USER_VISION](../../../../USER_VISION.md) before selecting a slice. P11 adds context joins and new domain consumers; [P5](../p5/REPORT.md), [P6](../P6.md), [P7](../p7/DATA_SHAPE.md), [P8](../P8.md), [P9](../P9.md) and [P10](../P10.md) retain their generators and world rules. Main code and sibling worktrees were read separately on 2026-10-14. Root integration is not established by a branch report.

Evidence labels: **shown/SOURCE** means directly visible in the cited code, without execution; **stated** means the linked owner/report asserts it; **inferred** means a bounded interpretation or proposed extension. For future canon rows, shown and stated refer to the selected source's demonstrated behavior and explicit claims, respectively. Add edition/chapter/scene or digest claim locators, continuity and contradiction IDs. A wiki statement and a playtest weight cannot become demonstrated canon. This packet makes no new franchise claims. Source gaps below are bounded to inspected adapters, not a repository-wide proof of absence.

## C2: logical snapshot and declarations

Proposed `GenerationContext@1` is plain read-only data assembled for one operation:

```text
identity: worldId, instanceId, continuityId, sourceSnapshotRef?, overlayRef?,
          lawRevision, eraId?, regionId?, locationId, layerId?, actorId, observerId
anchor: commandSequence, expansionMinute?, calendarRef, calendarMinute,
        localDate, timeSlot, absencePolicy, ownerRevisions
environment: season, weatherEpisodeRef?, rain, temperature, light, shelter,
             activeOccasionRefs, accessibleSiteRefs
society: controlRefs, jurisdictionRefs, reputationRefs, relationshipRefs
actor: bodyRef, vitalRefs, skillRefs, capabilityRefs, possessionRefs,
       custodyRefs, knowledgeRefs, cheatRefs
causality: recentOutcomeRefs, historyFactRefs, accountRefs, pendingCauseRefs
pacing: storytellerRef?, knownImpactSummary?, styleRef?
availability: per-field present|unknown|unsupported|notApplicable
provenance: per-field ownerRef, revision, asOf, claimMode, sourceRef?, conflictRefs
```

Names are semantic proposal fields, not guessed exports. Refs resolve through current owners; the snapshot never enrolls people, creates weather, updates a clock or advances RNG. Native stock and simulation stock are not copied into another persistent inventory. Resolve native location to a world-qualified endpoint via a registered adapter; market region is not automatically geographical region. If the base world lacks an instance record, root must bind an explicit canonical endpoint rather than invent a new instance on each render.

Each generator declares `reads`, `required`, `optionalFallbacks`, `lawRef`, `outputOwner`, `commitBoundary`, `drawScope`, `projectionPolicy` and `absencePolicy`. An unsupported required world law rejects admission. An absent optional festival/pacing adapter has no influence, with its absence recorded. Unknown stock/health is not zero; unknown negated prerequisites do not pass. Explicit zeros are permitted only where the owning schema defines absence as zero. Pure adapters may cache by owner revisions; never cache only by location while skills or stock change.

Internal generation uses actual causes/means. A separate `KnownContext(observerId)` supplies safe text, previews and explanations. It resolves only known facts/accounts and public law. It must not include private seeds, hidden candidate counts, undiscovered actor aliases, secret candidate lists or sealed truths. A secret reference may appear by ID in internal receipts and public lane reports, never by truth. An NPC decision uses that NPC's beliefs and observed means where appropriate; execution still validates actual ownership, reach and world support. Neither actor learns the other's hidden build merely because a predicate can read it.

## C3: four modulation channels

E = eligibility, W = selection weight, Q = functional quality/condition, K = knowledge exposure. They are separate stages. Presentation polish is not functional quality. More skill can improve repeatability or interpretation without increasing rarity. The following are proposed uses, not implemented effects.

| Input | E: can this happen here? | W: among valid outputs | Q: what actually results? | K: what can this observer know? |
|---|---|---|---|---|
| Location / site / layer | Valid station, habitat, reachable target and local verb | Site specialisms / road traffic | Actual shelter, apparatus and contamination | Sightlines, access and local witnesses |
| Region | Local species, cultures, currencies, supply routes | Eligible local materials/roles | Local substrate and available workmanship | Languages, regional familiarity |
| Season | World-defined growth/migration windows | Seasonal abundance and occupations | Maturity / moisture of a newly collected batch | Learned seasonal calendar; observed condition |
| Weather | Actual episode and safe/available means | Exposed vs sheltered opportunities | New work/batch affected by exposure during declared interval | Local observation vs dated forecast |
| Time of day | Hours, nocturnal activity, lighting means | Shifts / traffic / calls | Measured light or temperature during work | Visibility, witness presence and sensor reach |
| Calendar / festivals | Local occurrence, organizer and venue exist | Visitors, demand, performances | Resources/tools devoted to this occurrence | Invitation, public notices, known rituals |
| World laws | Supported material/power/causality grammar | Weights only inside legal combinations | Conservation, scaling and effect resolver | Which law is public, studied or appraised |
| Era / story phase | Available people, tech, roles, unfinished causes | Local concerns and reachable scenes | Available methods, not retrospective item upgrades | No later biography or future knowledge leak |
| Faction control | Jurisdiction, permits, access, actual control | Patrols, sellers, requests | Available services/standards with cause | Public control vs secret allegiance |
| Player reputation | Actual issuer recognizes hero and has means | Trust, offers, merchant willingness | Negotiated terms, not raw ingredient potency | Reputation is audience-local and can be stale |
| Skills / capabilities | Qualified execution or assisted route | Competent task opportunities | Recovery, precision, repeatability, supported grades | Better observation/appraisal through real means |
| Knowledge | Known method for repeat; investigation still possible | Known leads and beliefs guide intentional choices | Correct chosen process, never knowledge rewriting matter | Basis, language, resolution, uncertainty |
| Body state | Species/form, mobile body, relevant senses/fuel | Fitting travel/work/encounter alternatives | Actual exertion and consumer compatibility | Sensory modality and embodied limits |
| Possessions / custody | Actual tools, fuel, money, held/reserved inputs | Funded purchases/services | Tool function and batch provenance | Recognized equipment or concealed stock |
| Relationships | Reachable willing participants / permissions | Shared-history invitations | Supported collaboration, consent and custody | What this person will tell this audience |
| Recent events / D8 history | Completed cause or live obligation exists | Relevant callbacks and local demand | Damage/repair/past learning where actually retained | Fact vs witness account vs rumor |
| D9 tension / pacing | Cannot override a hard E failure | Future local card mix / cadence | No direct item potency or rewards | Safe style explanation, no hidden threat catalogue |
| Cheats / exceptional means | Holder scope, world compatibility, source active | Declared luck/draw bias if this specific power permits | Actual authored exception resolver | Appraisal/foresight with declared fidelity and limits |

Do not require every generator to read every field. A music description might read location, language and occasion; a mixture resolver reads retained substance law and exact process, not storyteller tension. Keeping all reasonable routes reachable means assistance, substitution, study, purchase, travel, illicit approaches and exceptional means may coexist where the world supports them. It does not require every station to support every operation instantly. Adjective profiles such as scarce, permissive, ceremonial, costly, renewable or inexhaustible belong to world content, not universal once rules.

## C4: lifecycle without rerolling truth

1. **Resolve and preview.** Build the declared snapshot and candidate set in stable ID order. Apply hard E predicates before W. Preview reads no random draws and creates no occurrence. Display only KnownContext.
2. **Admit a cause.** Recheck owner revisions and real means. Resolve reservations, supported fallbacks and candidate eligibility. A future new domain gets a named draw scope registered by root with P1, not a new global Math.random or context-hash reroll.
3. **Freeze and commit.** Store result ID, definition/law/source revisions, relevant context inputs or durable refs, draw receipt, selected participants, resolved quality and cause ID with reserved inputs and RNG consumption in one validated durable transaction. Publish native changes only after saving. A rejected/stale admission consumes nothing.
4. **Advance causally.** Dynamic work uses an explicit policy: admission-only context, due-time sample, or exposure accumulated across scheduler boundaries. Store that policy and accumulated exposure. A weather change can wet an exposed batch through a supported effect; it cannot rewrite an already bottled product. Use existing clock/scheduler authority and its catch-up budget. Closing a browser is not permission to invent elapsed history.
5. **Settle or project.** Revalidate execution means required at settlement without selecting a replacement result. If a target moved or support vanished, follow the frozen cancel/refund/defer/failed-outcome policy. Retries continue the same commitment; a genuinely new cause can generate a new result. Newly gained knowledge can change a label with a new evidence receipt, while identity and intrinsic facts remain saved.

Store only the dependency subset for a decision. Ref-based receipts must pin referenced history/batch/person revisions; if an owner compacts them, retain the minimal authoritative values. A hash alone cannot restore a pruned fact. Context fingerprints are diagnostics, never seeds for replacing saved objects. Grammar updates preserve existing resolved accounts/names. Old saves lacking a new domain owner remain absent unless that domain declares an explicit compatible enrollment. Existing P1 migration policy remains P1's policy.

Two costs need separate treatment: a binding offer reserves real reward/stock until expiry; a nonbinding market preview can display current prices and must be requoted on revision change. Accepting an old quote never silently substitutes new terms. Idempotent settlement protects one receipt; it does not prohibit future requests, harvests, titles or opportunities.

## C5: live audit, main checkout

| ID / input | Shown/SOURCE locator | What is exposed | Inferred gap / proposed adapter |
|---|---|---|---|
| F1 Location | `src/main.js:754-766,784-803`; `src/simulation_effects.js:89,133-134` | Native location IDs and actor/target world/location facts | Qualify endpoint and distinguish physical presence from a remote contact |
| F2 Region | `src/models/location.js:171,206-208`; `src/world_instances.js:83-89` | Market region; structured world endpoint has region/layer | No universal geographic-region derivation shown in native context; bind explicitly |
| F3 Season | `src/game_time.js:63-75`; `src/main.js:656-658` | Seasonal calendar and a home pacing adapter | No shared per-world seasons contract; same month need not mean same season in another realm |
| F4 Weather | `src/weather.js:9-50,180-195`; `src/main.js:763,792` | Seasonal/day temperature, deterministic rain cycle and pacing rain fact | No episode owner in inspected baseline; P5 X2 owns seeded weather proposal. Scope remote actors correctly |
| F5 Time of day | `src/game_time.js:3-6,77-87`; `src/weather.js:198-219`; `src/main.js:791` | Hour, named slots and light calculation | Slot/light definitions differ at 20:00; name separate semantics rather than silently choose one |
| F6 Calendar / festivals | `src/game_time.js:35-41`; `src/world_rhythm.js:5-30`; `src/main.js:795` | 30-day/12-month native calendar, recurring windows and calendar minutes | Recurring service is not a general festival registry; use declared local calendar and occurrence refs |
| F7 World laws | `src/simulation.js:92,127`; `src/capabilities.js:22-35,39-48`; `src/realm_state.js:52-60` | World gates, capability sources and local realm facts | Generic generator lawRevision binding not shown; select actual supported resolver per world |
| F8 Era / story phase | `src/world_instances.js:97-110`; `src/simulation_effects.js:109,130` | Structured instance era/continuity and scoped facts/situation phases | Instance era isn't a universal story phase; source snapshot/phase adapter needs a defined writer |
| F9 Faction control | `src/simulation_effects.js:103-109`; `src/gameplay_publication.js:10` | Extensible actor/world facts and regional reputation snapshot | No typed universal control/jurisdiction owner shown here; faction reputation is not territorial control |
| F10 Reputation | `src/gameplay_publication.js:3-10`; `src/components/trader_component.js:141-145` | Regional reputation and actual haggling/margin consumer | Bind region and audience; execution snapshots do not mean every generator sees fame |
| F11 Skills | `src/main.js:769-774,795-803`; `src/gameplay_publication.js:6-9` | Native level map, selected total skill levels; saved XP/enabled/present | Distinguish effective level, raw progress and active capability; XP alone isn't a skill-level predicate |
| F12 Knowledge | `src/simulation_effects.js:110-113,152-158,281-284`; `src/world_knowledge.js:3-13` | Seen/understood/value/basis, person observations, known world identity | Requires safe per-observer projection; internal target facts must not render as knowledge |
| F13 Body | `src/native_gameplay_adapter.js:41-47`; `src/simulation_effects.js:106-107,135-149`; `src/main.js:514-538` | Vitals, native body/care frames, persistent person body/conditions | World-qualified form/senses/consumer compatibility; ordinary unfed status never creates death or D9 pressure |
| F14 Possessions | `src/gameplay_publication.js:5`; `src/simulation_effects.js:93-108`; `src/native_gameplay_adapter.js:70-75` | Exact native/simulation stock, custody and borrowed-item guard | Canonical counts vs reserved/usable quantity need one selected owner adapter, not another purse |
| F15 Relationships | `src/simulation_effects.js:156,285-291`; `src/simulation_contracts.js:218,230` | Per-target axes and saved memories | P4 generated people are separate; no cross-store identity join should be assumed |
| F16 Recent events/history | `src/simulation.js:398-410,423-438`; `src/simulation_resolution.js:9-29` | Frozen occurrence/responses, discovered events and cause-bound effects | Terminal instances prune after 100; D8 durable fact/account refs must survive independently |
| F17 Tension | `src/simulation_contracts.js:217-231`; [D9](../p5/D9_STORYTELLER.md) | Inspected base state lists no generic storyteller owner; D9 is a stated proposal | Optional local pacing adapter, pass-through when absent; do not infer pressure from log prose |
| F18 Cheats | `src/simulation_effects.js:115-120`; `src/simulation.js:121-127`; `src/capabilities.js:39-48` | Owned powers, active faculties, cooldown/world support and pure means queries | Cheathood needs world baseline and holder exception refs; ownership alone doesn't grant a generic luck override |
| F19 RNG / predicates | `src/simulation.js:36-38,49,67`; `src/simulation_resolution.js:4-6`; `src/rules.js:25`; `src/simulation_contracts.js:38` | Local saved checks, seed derivation and missing-aware rule evaluation | No all-generator context/RNG adapter shown; integrate P1 seam without migrating sibling truth by regeneration |

## C6: sibling evidence and concrete cross-domain examples

These are prospective context extensions, not tests run by P11. Local branch evidence is separate from main integration.

| Lane | Read-only evidence / ownership | Context example and frozen boundary |
|---|---|---|
| P2 mixing | [P2 prompt](../P2.md); worktree `proc-p2-mixing/src/mixture_state.js:15-28,47-62`; branch REPORT states native mixing/persistence checks | Collect a rain-exposed batch through P8, carrying saved moisture/contamination. Steep under a covered station with actual tools. P2 resolves retained substance law and exact inputs; weather can alter a new batch/process through a selected adapter, never reroll species properties or an existing vial. Skill/knowledge changes prediction fidelity, not old chemistry. Current first P2 law has no such weather adapter |
| P3 storylets | [P3 prompt](../P3.md); worktree `proc-p3-storylets/src/storylet_deck.js:24-41,48-69` | A damaged roof plus a present repairer and actual wood makes a repair request eligible. Rain may increase its weight; D9 can soften threatening cards while keeping hard failures zero. Once drawn, freeze cast/terms/expiry. Later clear weather changes a future deck, not this occurrence. Roof/history predicate and no arbitrary future fever truth |
| P4 people | [P4 prompt](../P4.md); worktree `proc-p4-people/src/generated_people.js:14-27,44-59,63-75` | A late-season road visitor comes from an eligible region/cohort, with one saved name/trait profile. Meeting reveals a funded supply need; reputation changes future willingness only if the person recognizes the hero. Rain changes a supported future routine, not personality. P4 currently uses local needs/culture and saved calendar, not full actor casting |
| P6 creation | [P6 LIVE_AUDIT](../p6/LIVE_AUDIT.md), [smithing](../p6/SMITHING.md), [creation report](../p6/REPORT.md) | A sheltered forge, held ore, working tools and qualified help determine supported work. Local law fixes metal behavior; heat/exposure policy determines batch outcome. A festival commission changes desired design, not metal quality. A learned method can improve repeatability while saved tool/product identity remains intact |
| P8 resources | [P8 report / RC1](../p8/REPORT.md), [ecology](../p8/ECOLOGY.md), [trade supply](../p8/TRADE_SUPPLY.md) | A reed patch has saved habitat/productive state. Season/time/actual tool tune new yields and condition; harvest receipts reduce stock and allow declared regrowth. Buying, borrowing equipment, asking a gatherer and using a fitting cheat remain possible routes. Reload, renamed weather or appraisal never restores a depleted patch or creates a fresh species |

## C7: contradictions and integration dispositions

| ID | Observed mismatch | Proposed disposition |
|---|---|---|
| R1 | Status map dated 10-13 says no generators; P1-P4 branch reports dated 10-14 state delivered generation. Main inspected source has none of their new module filenames. Dispatch STATUS still says P1-P3 running | Report dated baseline vs branch proof separately. Root must verify merge/served code before claiming main gameplay; P11 does not update sibling status |
| R2 | Native calendar drives P2/P4 branch work while expansion clock can remain zero before enrollment (P2 REPORT R2) | Use calendarRef and explicit mapping anchors. Do not turn calendar minute into expansion minute without an adapter; idle/absence rules remain owners' decisions |
| R3 | Current `src/simulation.js:108` and P3 branch `storylet_deck.js:33` enforce once metadata; user's direction rejects fixed once anti-abuse limits | Preserve source truth in the audit. Future new generated repetitions use per-world profiles and new cause IDs. Root reviews old authored unique events separately; don't silently remove a save claim or call fixed once a new requirement |
| R4 | `night_time.start` is 20 but named/simple Night begins at 21 | Preserve distinct light/slot interpretations and expose both with provenance; changing the base boundary needs its own authorized compatibility decision |
| R5 | Main supplies home pacing rain to all assembled simulation contexts at line 763 | Do not infer remote-world weather from that shared key. Proposed endpoint-bound environment adapter needs source/instance validation |
| R6 | P4 REPORT explicitly says generated store is separate from simulation actors; D8/P5 plans need stable cast | Root chooses reference-only lookup first or a deliberate actor promotion adapter. Never spawn a second person just to obtain a target ID |
| R7 | X2 weather, X4 obligations, X7 rumors and X1 loadouts already appear in P5 EXTRA_IDEAS | P11 extends context/transport/causality consumers and links those rows, retaining their original proposal status and ownership |

Final sibling refresh read P6 creative works/MORE/report excerpts, P8 RC1/ecology/trade supply, P9 PROFILE_RULES and P10 original factory/report. P8 RC1 already separates source truth, batches and context; P6 owns editions/performance/production; P10 owns world-family selection. P11 context refs join those contracts rather than supersede them. P9's source-qualified profile rows remain required before any canon extension; no new canon claim is inferred from a sibling proposal.

## C8: smallest slice and future gates

First slice: one context reader for a new ordinary need-based request, backed by integrated P3/P4 and a registered P1 stream. Read world-qualified location, saved calendar, actual need/stock/purse, observer knowledge and one typed recent outcome. Compare two eligible contexts with an identical controlled draw to prove changed eligibility/terms, then preserve a committed request while weather, skill or fame changes. Optional D8/D9 refs stay absent until integrated; they are not prerequisites for this minimal reader.

Future gates: dependency parity with owners; pure preview/projection; required-input rejection; no hidden counts/candidates in public output; stable candidate order and draw isolation; stale snapshot rejection; supported context change with causal receipts; unchanged saved truth under reload/content updates; failed write leaves draws/stock untouched; absent legacy owners preserve behavior. Then authorized tests/build, rebuilt fresh-origin natural and separately labelled seeded-native comparisons at 1366x768 and 1600x1000, Save/reload, Export/literal-file Import and human fiction/balance acceptance. P11 ran none of these runtime gates.
