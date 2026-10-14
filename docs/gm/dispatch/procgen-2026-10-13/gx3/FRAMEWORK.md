# GO1-GO5: one framework, locally different worlds

2026-10-14. **PROPOSAL ONLY.** [GX4](../gx4/) owns common generation APIs and migration/refactor recommendations; [P39 registry](../p39/REGISTRY.md) owns registration; [P38](../p38/) owns entity/receipt/owner placement. This paper specifies how GS/GO operations consume those contracts. Semantic field names and proposed files are not existing exports or reserved schemas.

## GO1: per-world switches over the same execution path

Use `read context → admit eligible operation → stage decisions + domain effects → validate whole envelope → durable write → publish → known projection`. Generators never write directly to native inventory, storage, DOM or another owner's truth. Refactor one existing operation only when it delivers a selected playable benefit. A seasonal reader can use a narrow adapter before a complete registry exists.

| Switch group | Proposed values / concrete purpose | Existing design owner |
|---|---|---|
| Identity/source | world definition, instance, continuity, era, source snapshot, explicit AU overlay and law/profile revisions | P9/P10; comic/GX1 profiles |
| Domain admission | enabled/disabled/dormant per generator; authored-only, authored-table selection, original constrained generation; supported consumer/handler requirements | GX4/P39; P7 reservations |
| Variation | uniform/precise/variable/volatile, original-only/qualified family, named distribution/tolerance, correlated axis groups | P2/P6/P8 local resolver; no universal rarity law |
| Population/detail | admitted background roles, canon reservation refs, LOD transition laws and promotion triggers | P7/P19/P20/P32 |
| Time/absence | clock mapping + supported policy; preserve existing freeze; continuous or bounded-moving only with selected time-owner extension | World clock/away owner |
| Story | local era context, arc admission/transitions, pacing/quiet/density, decision and expiry policy | P12/P13/D9/P26 |
| Travel | directional object/person/info compatibility, carriers, source-bound behavior, conversion payer and loss | Existing travel/cargo/body/knowledge owners |
| Content | table/prose/grammar revisions, reservations, authored/generated target mix, fallback/error policy and lint budget | P15/P39/GX4 |
| Presentation | off/quiet/rich, prose/panel/window skin, known-context projection, motion/sound and inspection | UI/kit/P25/comic owners |

Profiles declare only actual supported inputs. Unsupported is different from hidden, absent and inapplicable. A disabled generator cannot be used as a fallback for a missing canon rule. Switches stop new admissions without deleting resolved records or blocking recovery of pending work. Display-only texture can switch off immediately.

Per-world adjectives are first-class local parameters with a consumer: `renewable` supplies a supported regeneration law, `inexhaustible` declares a source, `precise` selects zero execution noise, `timeless` selects a clock law, `source-bound` selects compatibility behavior. They need no invented downside for uniform balance. Rule changes create prospective revisions; pending/resolved operations retain their admitted law. Reservations prevent accidental duplicate minting, not legitimate source-qualified acquisition, inheritance, transfer, AU counterpart or exception.

## GO2: one saved generation seed root per instance

Shown baseline: P1 stores `streams.root`; world instances store identity/clock but no generation root. P2/P4 derive enrollment seeds from P1 and save results; P3 saves local cursors. `gameStream` scopes most core streams to worldId, not instanceId, and craft intentionally remains unscoped. These are current compatibility facts, not evidence of the proposed instance scheme.

Proposed minimal binding, placed by GX4/P38 under the owning generation adapter:

```text
InstanceGenerationBinding
  instanceRef, bindingRevision, campaignLineageRef
  seedRoot, derivationRevision, profileRevision
  legacyBindings[]    # refs to existing owners/cursors, never copies
  generatorLocks[]    # table/law revisions required by retained records
```

The existing strict world-instance validator must not receive ad hoc extra fields. Root selects either a versioned world-instance extension or an explicitly owned reference binding after compatibility review. This binding owns seed policy only, not another instance, actor, inventory or history store.

| Case | Root and identity policy | Required compatibility behavior |
|---|---|---|
| Fresh instance | On creation, derive one root from saved campaign root and structured `(derivationRev, lineageRef, instanceRef)` via approved P1 evaluation; save it with admitted instance | Stable instance allocation, not a name, viewport, wall time or visit order. Derivation does not consume unrelated combat/craft draws. Seed collisions do not identify worlds; instance IDs remain authoritative |
| Legacy instance without new binding | Explicit prospective adoption. Bind current saved P1 root + stable instance ref; if P1 absent, establish root in the guarded adoption transaction under P1's legacy policy | No historical draws/absence credit. Preserve all P2 products, P4 names and P3 cursors. Absent GX3 consumers remain absent until selected |
| Revisit / Export / literal Import | Read same binding, resolved records and cursors | Never call a fresh-world constructor. No improved stock, renaming or fresh branch from loading a file |
| AU/fork/reboot | New instance identity and explicit fork law. Replay mode may copy decision roots; divergent mode derives a new root from persisted branch allocation | Copied past is mapped with provenance; future eligibility may differ. Reboot is a versioned causal operation owned by continuity lane, never implicit reroll. AU mode can preserve or vary roots as a declared option |
| Person/object travels | Origin assignment stays pinned to origin instance/entity identity; destination decisions use destination instance root | Moving does not re-admit a person or regenerate a lot. A person-scoped fate stream can travel under E1/GX2 semantics, distinct from local chatter/deck scopes |
| Detached simulator | Clone roots, locks, cursors and owners into isolated state; explicit replay/fork mode | Never publish imagined GS firsts, rumors, stock or knowledge into real state without a selected keep/transfer law |

New decision address: structured `(instanceRef, generatorId, subjectRef, purpose, localOccurrence, tableRev, slot)`. Map to approved P1 family names, e.g. `text:micro@<instanceRef>` or `world.people:<subjectRef>@<instanceRef>`; respect the current stream-name length check. No new PRNG. Root binding initialization occurs only in a staged transaction. Pure previews operate on an already validated root via `unitDecision` or GX4's wrapper, not mutating `ensureStreams`, `streamSeed` or receipt-appending `keyedUnit` on live state.

Persist resolved causal truth plus decision allocation. Root alone does not reconstruct a changed table, hidden consumed resource, old known utterance or exposure. New per-instance routing leaves legacy scopes in place until their owning migration is selected. Admission/write failure preserves seed bindings, IDs, cursors and all affected stock.

## GO3: generation at the needed level of detail

Reuse [P32's LOD tiers and capsules](../p32/LEVEL_OF_DETAIL.md). GX3 adds a generator admission/refinement interface, not a second capsule store. Distance is one relevance signal; unresolved obligations, a scheduled message, a lens observation or an actual query can require exact detail from afar.

| Tier | Generation behavior | Exact things retained / first reader |
|---|---|---|
| T0 identity/reservation | Cold addresses, authored population aggregates, no continuous individual micro draws. Named existing individuals retain refs | Canon reservations, known identity, current rights/custody/obligations and source revisions; profile lint/population owner |
| T1 supported coarse activity | Advance only authored aggregate transition laws over eligible local time; aggregate counts/rates without invented individual deeds | Conservation totals, actual deadlines, coverage interval, causal summaries and unresolved slots; settlement/supply reader |
| T2 relevant person/place | Admit needed mood, communication, scene or source-lot slots at sparse due boundaries | Actual contact/stock, receipt pins, known projections, pending terms; supported interaction or callback reader |
| T3 foreground | Resolve selected supported action and exact observed detail | Input/cost/result/draw/utterance frozen in the same transaction; native player journey |

Promotion algorithm: qualify identity/world/law → synchronize supported local coverage to interaction boundary → gather constraints and receipt pins → enumerate allowed unfilled slots → select/save only required detail → validate accounting/time/known projection → persist and publish existing identity. Demotion drops caches and unpinned routine detail; exact commitments remain. No person-per-tick timer, unbounded catch-up draw loop or all-pairs rumor scan.

Illustrative worked case, original: a distant mender has a retained promise due D+2, two coins reserved, and an arrival receipt. On visit, refine weather-appropriate clothing and a current greeting. Do not invent a journey that overlaps their known work, spend the reserved coins again or say the promise was delivered. If no detail fits, retain anchors and leave the optional slot unresolved with a neutral line. P32 owns any compatible latent-backstory selection law.

A coarse transition can be exact for its declared sufficient statistics while personal anecdotes remain unspecified. It must not present an estimated endpoint as exact hidden history. Eligibility checks needing missing exact data promote first or decline safely. Public summaries never reveal unobserved remote actor truth. Where absence is freeze, distant generation also freezes; LOD itself grants no wall-clock aging, production, hunger or story events.

Required future equality: stepped vs jumped vs yielded advancement produces the same committed aggregates/obligations and next decisions for declared exact domains; repeated promotion/demotion, panel order, Save/reload and literal Import preserve identity and already resolved slots. Adaptive rendering cost must not change who gets a scarce item or which rumor exists. P32 budgets and GX3 [budget separation](BUDGETS_AND_ABSENCE.md) share one scheduler allowance.

## GO4: era and arc above the storylet deck

Reuse P11 context, P12 arc plans, P13 canon/divergence, D9 pacing and P26 beat templates. **Era** is the world/continuity context; **arc** is a local supported causal thread. Several local arcs can coexist in an era. A chapter/issue title is a presentation choice, not an era transition or mandatory conflict.

Proposed era context: `instanceRef, eraRef, sourceSnapshotRef, phaseRev, effectiveLocalAt, lawProfileRef, publicContextRefs`. Proposed arc binding: `threadRef, instanceRef, templateRev, stage, participants, causeRefs, pendingInstanceRefs, transitionReceipt, nextBoundary, closurePolicy`. Store through owning arc/context records, with P38-qualified refs.

| Stage / operation | Required input / consequence |
|---|---|
| Arc admission | Real seed cause such as actual unpaid need or a qualified authored event; feasible participants, stock/counters and at least one supported progression/decline route. No director manufacture of debt just to hit a drama target |
| Candidate construction | Ordinary deck eligibility first; era reservations/source window veto impossible candidates. Arc stage adds fit/weights/cast constraints only to admitted cards; D9 can favor relief or quiet. Zero eligibility remains zero |
| Draw/freeze | Save chosen card instance, participant refs, stage/era/table revisions, costs and any grant authority. Candidate preview consumes nothing. Opening a later panel does not recast it |
| Transition | On an actual resolved outcome or scheduled supported cause, test transition guard against receipts; advance, branch, defer, fail-forward or close. Rewards belong to actual stock/payer owners; repeated transition receipt grants nothing twice |
| Era change | Explicit causal/source-qualified operation records old/new profile and effective point. Re-evaluate future admission. Pending cards keep old terms or follow their declared invalidation/cancel policy; no hidden overwrite or preemptive promise cancellation |
| End / continuation | Endings can resolve a local thread without ending world play. New requests, peaceful work, revived conflicts and loop/parallel possibilities remain eligible when their own causes exist |

Original first proof: a traveler's actual supply need yields an offer; provision or a supported alternative settles that need, then a later nonreward greeting references the same outcome. A changed local season can affect a future card's context but cannot rewrite the already accepted terms. This extends the P34/D8 spine if integrated; GX3 does not reimplement its request/history.

For comic packs, editorial-era tone and issue cadence read GX1/comic profiles. A change of art style is presentation; a revival/retcon is an explicit world law. Neither heals a saved injury nor resets an adversary without an actual operation. Canon-specific implementation waits for the owning source qualification, with shown/stated/inferred and contradictions preserved.

Future gate: native need→offer→choice→changed later card; choose an alternative and see different actual outcome; same pending card and causal stage after Save/reload and literal Import. Controlled seeded-native era boundary is labelled separately. Readable card, terms, next step and known recap at 1366x768 plus 1600x1000. No new mandatory overarching director.

## GO5: cross-world compatibility without regeneration

Existing travel/world/cargo/source/body/knowledge owners remain authoritative. A generator's output declares origin semantics and supported readers. A destination profile declares **directional** compatibility; A→B does not imply B→A. Travel and file Import are different operations: Import validates the retained envelope, never runs a destination conversion to repair it.

| Carrier | What stays retained | Destination law / permissible outcomes |
|---|---|---|
| Physical lot/item | Origin definition/lot/object ID, law revision, actual fractions/parts/charge, custody, observation refs and trace pins | Applicable unchanged; inert-but-owned; controlled containment; or explicit conversion with payer, loss/residue and new derivative ID/provenance. Unknown compatibility does not consume, sell as native stock or silently strip a property |
| Person/companion | Stable origin identity, body/source, possessions, known aliases, relationship and obligations | Actual entry/body/source/rights law plus explicit presence mapping. No duplicate P4/simulation person. An alias may sound different to local listeners without changing civil identity or memories |
| Information/document | Actual claim/method/scope, origin basis/time/units, recipient knowledge and frozen document wording | Translate/learn/verify under supported channel/language/method. A local analogy is an inference, never exact source capability. Relative time uses declared clock mapping, not home calendar subtraction |
| Ability/cheat/grant | Actual holder, source, charge/conditions, authority and admitted revision | Executable destination support or retained inactive state according to selected travel law. Powerful unrestricted multiversal variants remain possible when implemented; unsupported conversion is not a balancing nerf |
| Micro presentation | Known object/person refs and historical utterances | New local description reads actual destination context. Origin patina/first/nickname/history remains; no new first by moving an old product unless querying explicitly scoped `first arrived here` |

Travel plan order: validate endpoints and expected revisions → preflight every selected carrier's executable compatibility → pin needed origin definitions → stage custody/body/source/clock/knowledge transitions and conversion if selected → validate whole envelope → one durable write → publish arrival → admit new destination generations. A denied route preserves all carriers and roots. Compatible alternate route, storage, specialist conversion or later exceptional law remains reachable; no automatic item deletion is proposed.

A crossing notice names only observed incompatibility and known means. Hidden property names, destination prices, unexplained sort order and redacted-card counts must not reveal a sealed truth. Internal compatibility checks may read truth; public reasons project through actual knowledge or a neutral unsupported-action explanation. GX2 lenses use their own qualified reveal route.

First future proof: transfer an original known physical lot on an existing supported authored edge, observe a supported destination consumer or inert retained state, then return. Require exact stable origin identity and funds/stock/source accounting, Save/reload during transit and after arrival, Export/literal Import into a second origin, unchanged roots/next draws, refusal control and rebuilt 1366x768/1600x1000. No new multiverse, branch selector or prestige gate is required for a bounded carrier test.
