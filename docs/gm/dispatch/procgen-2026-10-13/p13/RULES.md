# P13 canon coexistence contract

2026-10-14. **PROPOSAL ONLY.** No accepted specification, runtime implementation or canon-completeness claim. Root selects/integrates/commits. P13 writes only this directory. User's later P13 scope overrides COMMON's older worktree/build/commit directions.

## Authority and joins

Weibao requested content creation, book-world canon and further angles, not merely seeded selection. [USER_VISION](../../../../USER_VISION.md) and [PROJECT](../../../../../PROJECT.md) own priorities. Natural course unless sufficiently disturbed is accepted; the implementation details here are proposals. [Timelines T1–T5](../../../../TIMELINES_AND_DIVERGENCE.md) governs identity, causes, branches and time. [Intro rounds 9–12, TA/AH/TB/BR](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) proposes anchors, fresh canon, continued branches, revisions and lifecycle. Fresh canon per life is an intro proposal, not a newly accepted default. All reasonable modes stay reachable; local adjectives govern frequency, renewability, reach and resistance.

| Lane | Reuse; P13 adds only |
|---|---|
| [P3 returned storylets](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md), [E2](../../../../emergent/E2_STORYLETS.md) | Frozen occurrences, eligible casting and consequences; P13 adds canon-anchor admission/invalidation. P3 worktree proof is not main-checkout integration. |
| [P4 returned people](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md), [P7](../p7/GUIDELINES.md), [P9](../p9/PROFILE_RULES.md), [P10](../p10/REPORT.md) | Identity/name reservations, law/source profiles and actual means. P4's separate store needs an explicit actor bridge. No second population generator. |
| [P5 D8](../p5/D8_LORE_GRAMMAR.md), [D9](../p5/D9_STORYTELLER.md), [extras](../p5/EXTRA_IDEAS.md), [E5](../../../../emergent/E5_STORYTELLER_AND_FATE.md), [E6](../../../../emergent/E6_LORE_LAYER.md) | Fact/account/pacing owners; P13 supplies canon provenance and diverged applicability, never derives causes from prose. |
| [P11 context](../p11/CONTEXT.md), [requests N1](../p11/REQUESTS_AND_MARKETS.md), [dreams/occasions](../p11/DREAMS_AND_OCCASIONS.md), [information](../p11/INFORMATION_AND_LIBRARIES.md), [more](../p11/MORE.md) | Actual versus KnownContext, funded requests, channels and calendar; P13 supplies current anchor/canon horizon. |
| [P12](../P12.md) / [checkpoint](../p12/CHECKPOINT.md) | Owns quest/arc/plot assembly; P13 returns eligible anchors, invalidated prerequisites and surviving motives. |
| [P14](../P14.md) / [checkpoint](../p14/CHECKPOINT.md) | Owns history, chronicle and in-world accounts; P13 returns typed canon/earned/premise provenance. |
| [P15](../P15.md) / [checkpoint](../p15/CHECKPOINT.md) | Owns text/dialogue/authoring pipeline; render only admitted facts and known evidence. |
| [P16](../P16.md) / [checkpoint](../p16/CHECKPOINT.md) | Owns crossover, endings, loops and meta assembly; P13 supplies separate source/branch scopes and reservation rules. |

Sibling P12/P14/P15/P16 had checkpoints but no reports at initial read; the later P13 readback also examined P12 CONTRACT/REPORT, P14 CONTRACT/REPORT, P15 REPORT and P16 WORLD_DIALS/LOOPS/OTHER_LIVES. Their prompt/checkpoint links record the interface, not completed deliveries. [P6 creative works](../p6/CREATIVE_WORKS.md) supplies content/edition/copy identities; P13 does not create another book generator.

## C1: what fixed means

Separate **law**, **historical fact at entry**, **expected future event**, **reserved identity**, **actor belief**, **premise change**, and **unsupported model data**. A fixed past anchor cannot be edited by writing a new rumor. A future scene is expected only while its real causes hold. Identity reservation prevents accidental generation; it does not guarantee survival, possession, office, victory or moral correctness.

A physics-level or identity-level protection needs a source, supported mechanism, target/scope, active prerequisites and counter policy. The current original causal-story guarantee is not franchise plot armor. Protagonist resistance may be skill, allies, redundancy, contingency, prophecy enforcement, memory, institution or a genuine source law. Do not add adaptive invulnerability or an automatic replacement protagonist. Strong actual means remain strong; an opponent need not scale to the hero.

Older timeline C2 plot-weight inertia, C5 role substitution and intro TB10 pinned events conflict with T3 if interpreted as forcing a scene after its cause is gone. Proposed reconciliation: inertia describes surviving redundant routes or actors' effort; role substitution requires a real eligible actor with motive/means; a pin records a preferred event or an explicit AU enforcement mechanism. An impossible pin warns safely and remains unresolved, rather than resurrecting actors or minting an artifact. No numerical disturbance score overrides a hard missing prerequisite.

## C2: canon graph and anchors

Each pack authors a sparse event spine, with independent events left unordered. Record exact date only when supported; otherwise use intervals, local cycles, `after` edges or chapter windows. Publication dates and chapter order do not establish in-world dates. A flashback is not a new occurrence. Conflicting dates stay attributed alternatives pending review.

An anchor is a version-qualified entry snapshot: bodies/life state, locations, stock/custody, office holders, institution rules, actor knowledge and ongoing external plans. Derived anchors apply audited event deltas to a baseline; they never replay gameplay rewards or invent the player's earned biography. Before/during/after and distant-place starts are compatible options. A continued branch evaluates whether a named event anchor still exists; if not, offer its date/place context with known changed status, not its impossible original scene.

Generated content attaches through `gap`, `offscreen_place`, `ordinary_person`, `precanon`, `aftermath`, `surviving_plan`, or an explicitly authored `replacement_event`. A gap is a permitted scope, not proof that nothing occurred there. A generated quest requires P7/P9 eligibility, real needs/means, funded settlement and P12 structure. Background contacts may become important without being rewritten as canon relatives or owners of unique powers.

## C3: proposed logical data, not a save schema

Map these joins to existing owners after implementation inspection. Do not implement a second scheduler, inventory, knowledge store or universal canon owner merely from this table.

| Record | Minimum fields |
|---|---|
| Canon version | `id`, credited work/creator, edition/language/adaptation, capture/hash or revision, inclusion/exclusion list, research horizon, source quality, unresolved claims, graph/law revision |
| Anchor reference | `anchorId`, `canonVersionRef`, source claim/locator refs, evidence mode, occurrence order/window, snapshot ref/revision, region, compatible roles, pressure adjective, safe label/projection |
| Branch binding | `branchId`, world definition/continuity/instance IDs, canon-version ref, anchor ref, parent/fork receipt if any, premise overlay refs, source cutoff, lifecycle, clock/absence/reset policy, RNG owner refs, actor/counterpart mapping |
| Event definition | `eventId`, anchor refs, actor and artifact reservations, hard/alternative prerequisites, motives/plans, temporal window/order, expected effect refs, mutable facets, actual protection refs, information channels, generated attachment scopes |
| Event state | `eventId`, branch/instance, `expected|eligible|committed|occurred|changed|inapplicable|unresolved`, commitment revision, actual cast/means, completion/cancellation receipt refs, resolved deltas; no speculative payout |
| Generated story admission | content/grammar/template revision, branch/anchor context, original actor refs, source-law predicate refs, allowed attachment, dependency/watch keys, frozen cast/terms/draw ref, expiry/renewal policy |
| Divergence receipt | stable receipt ID, branch/instance, originating committed action/outcome, local clock, before/after prerequisite values with authoritative owner refs, affected event IDs, old/new status, surviving alternate causes, actor report arrivals, safe projection; premise receipts use `origin=premise`, never `earned` |
| Foreknowledge | forecast ID, knower/carrier, source edition/cutoff, basis, prerequisite refs, confidence and applicability; `invalidated` differs from proven false |

Synthetic example: `anchor A → letter dispatch E1 → appointment E2`. Player arranges a real closure of the only dispatch site. Durable action receipt changes `site.open`; E1 becomes inapplicable for that window, E2 loses its delivery prerequisite. An existing courier may arrange a different delivery only with actual access/time/stock and a new receipt. A generated neighbor can offer help or alternative work. No second letter/appointment materializes to preserve the outline. This demonstrates creation of a new plan and event content, beyond random card selection.

## C4: admission and disturbance pipeline

1. Resolve pinned source/anchor/overlays and the actual branch context. Check law, era, role occupancy, custody and disclosure. Freeze eligible original bindings and content revision at commitment; preview consumes no RNG.
2. Settle an action through its existing durable owner. Record changed prerequisites with a cause receipt. Failed publication produces no divergence, payment, knowledge or actor creation.
3. Reevaluate only watched dependent events, in causal order. Missing model data yields unresolved, not inapplicable. Missing in-world prerequisite can delay/change/cancel its specific scene; retain unaffected events and earlier actual history.
4. Ask surviving actors' plans for genuinely available responses. P12 assembles their new supported story; P3/D9 selects/paces optional eligible opportunities, without changing already committed outcomes.
5. Freeze resulting facts, cast, text, terms and draw state. P14/P15 project known outcomes with source/basis. Reports reach each actor through P11 channels, not through a global knowledge flag.

A scene can disappear while its larger pressure survives: a particular arrest fails, another investigation continues. Conversely, changing a meal, classmate or shop price usually does not disturb a remote war unless a declared dependency exists. No arbitrary butterfly roll declares that one chat destroys the universe. Depth-on-demand [E7](../../../../emergent/E7_OBSERVATION_AND_MYSTERY.md) can fill compatible background, but cannot decide already interacting K1 truth after observing it.

## C5: reservations, secrecy and attribution

Build a source-qualified reservation catalogue for named people/aliases, unique roles including unnamed plot-critical actors, event identities, singular artifacts/source seats, custody and genealogical edges. Ordinary instances of a reproducible canon object are permitted under sourced manufacture/acquisition. Unique identity transfer, destruction, theft, resurrection or AU counterpart remains possible when actually supported; never generate a fresh duplicate to fill an empty loot/cast slot.

Evidence mode and quality are separate: SHOWN supplied scene; STATED narrator/character/rule/official synopsis/secondary wiki with speaker; INFERRED analyst interpretation; UNKNOWN unresolved. Profiles reuse analytical locators and do not claim fresh whole-book reading. A synopsis establishes premise, not every later event's prerequisites. Contradictions persist in [SOURCE_NOTES](SOURCE_NOTES.md). Direct adaptation packs stay private per PROJECT; public tooling/tests use originals and preserve LICENSE/attribution. No raw prose or quotations from private notes.

Secrets appear only as owner-reserved IDs, discovery routes and status. Public fan-canon twists are distinct from changed/randomized truths. No new secret IDs reserved by P13; linked P7/P9 IDs are not asserted newly implemented. Reservation errors, event graphs, branch labels, generated NPC behavior, account titles and unavailable options must not leak sealed truths or their answer mapping.

## C6: continuity and future proof

Fresh start, continued branch, fork, temporal rewind, source reset and content update are distinct operations. Pin canon version and already committed original records; a seed alone cannot restore an arbitrary played branch. A fork remaps local mutable actors, stock, claims, knowledge and RNG, while transferred travelers/objects follow a selected crossing contract. No save duplication grants cross-branch custody without a carrier.

A newly read canon chapter is not a retroactive correction of earned history. Compatible opt-in migrations may add unreached causes; incompatible updates create a new branch or leave the old one pinned/dormant. Record-only archive cannot promise playable resume. Intro's cheap-delta archive estimates and offline-branch-time proposals do not establish either capability. Preserve references used by active commitments during compaction; refuse optional texture admission when safe storage is exhausted rather than impose a gameplay once cap.

Future selected slices need source review, deterministic admission/invalidation, unaffected-event control, real changed consumer, and full compatibility/failure proof. Rebuild then fresh browser at 1366×768 and 1600×1000; Save/reload/Export/literal-file Import before/after divergence must retain event applicability, identities/custody, known reports, committed text and next draws. Old saves must not receive fabricated past events or an implicit loop. No runtime or browser proof is performed by P13.

## C7: intro derived-snapshot qualification

Intro round12 DV1–DV12/OT1–OT10 remains proposal/dispatch context. An anchor cache should be keyed by source, base, event-list and overlay revisions; incremental derivation must equal full derivation for the supported scope. Ongoing jobs, escrow, knowledge, custody, generated records and RNG cannot be reconstructed from a generic override count. DV9 fixes source-decided fresh baseline outcomes, but does not reimpose them after their causes change. DV10 may materialize compatible unseen detail lazily; it may not choose already-interacting truth from observation time. Validate simultaneous fact writers and impossible prerequisite cycles. Structural graph inconsistency is not a fictional failed event. Offline active-branch accrual requires its selected clock consumer; P3 played-only behavior and resting-branch freeze are not proof of generic offline canon simulation.
