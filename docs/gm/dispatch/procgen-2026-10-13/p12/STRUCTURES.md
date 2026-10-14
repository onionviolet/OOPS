# P12 structures: caused stories, open futures

2026-10-14. **PROPOSAL ONLY.** Original examples, no implemented generator claim. Reference labels and locators are in [REFERENCES](REFERENCES.md). [E2](../../../../emergent/E2_STORYLETS.md) owns card/deck concepts, [N1](../p11/REQUESTS_AND_MARKETS.md#n1-generated-requests-and-quests-from-actual-needs) owns request terms, and [D8](../p5/D8_LORE_GRAMMAR.md) owns durable history. P12 adds larger structure over their same identities and receipts.

## S1: what is generated

Generate a new **instance of a structure**: cast, concrete goal, relevant causes, possible task dependencies, means, stakes, windows and next admissible beats. Author the operator vocabulary, law checks and grammar. Actual play can choose routes the original plan did not foresee, provided those routes execute through supported domain actions. Text is a projection after resolution. A fresh noun in an authored fetch quest is limited parameter variation; a different route, actor response or causal dependency is structural variation. Both are useful and should be reported separately.

Four cooperating modes remain available, rather than an either/or choice:

| Code / mode | Admission and progression | Authority / example |
|---|---|---|
| S1a Need-based quest | A real shortfall and willing issuer generate an N1 request; supported methods form a dependency graph | Repair supply → acquire or hire → restore the actual object → issuer settles terms |
| S1b Character/plan arc | An actor goal explains actions; observed outcomes change beliefs, means or goals | Apprentice seeks instruction, is refused, works for fees, finds another teacher, learns or changes career |
| S1c Grammar-guided incident chain | A supported cause makes a beat eligible; next beats read actual committed effects | Damaged roof → repair or loan → an actual remaining debt creates negotiation; no debt means no collector beat |
| S1d Retrospective story | A sifter finds a sequence in typed history, without having scheduled it | Two unrelated jobs become a remembered friendship because the same people helped each other |

These modes share [one instance contract](CONTRACT.md), with `originMode` and `controlMode` distinguishing behavior. A recognized story is read-only unless a later actual goal/request independently admits a callback.

## S2: grammar and action planning

An arc grammar compiles a concrete dependency graph, not a complete script. Proposed production:

```text
RepairArc(problem, owner, object)
  = establish(problem evidence)
    → agree(request terms OR mutual aid)
    → any supported route [supply AND qualified work]
    → verify(object changed)
    → settle(terms)
    → optional aftermath(actual remaining needs/relationships)

Supply = owned stock | buy | gather | borrow | accepted substitute | commission
Work   = self-qualified | willing qualified helper | paid service | supported exception
```

`OR` describes route alternatives for this step, not lifetime exclusivity. Several can coexist or contribute partial quantities. `AND` requires all actual conditions, possibly achieved in either order. A route unavailable now remains a future possibility if its source/means can later become available. No fabricated helper, infinite unbacked purse or vague “research” route is shown as usable.

Compile in this order: bind original cause → qualify world/era/operator set → choose compatible grammar and cast → resolve actual route DAG → validate means and known communication → commit instance. Persist admission choices. Later replan only unsatisfied nodes against changed causes. An NPC may plan from beliefs, but completion uses actual state. A new plan revision keeps the old intent and failed action receipt; it never edits history to look successful.

Prefer deterministic scoring of supported short recipes for a first slice: achievable goal, fitting means, fewer unavailable dependencies, actor-local preferences. Stable-ID tie order first; a saved named draw may vary equal valid plans where declared. General partial-order search remains reachable later [R19–R20](REFERENCES.md#r19r22-research-and-distinct-roles), with measured search budgets, continuation cursors and no synchronous unbounded search in an idle tick.

## S3: larger forms and actual state changes

| ID / form | Proposed causal grammar | Observable consequence / alternatives |
|---|---|---|
| S3a Multi-step commission | Existing damage/need → negotiated terms → procure → work → verify → handover | Object/need actually changes; deliver, hire, assist, revise, defer or decline. A receipt does not alone repair anything. |
| S3b Character growth | Desire → opportunity → supported attempt → feedback → changed competence/belief/goal | New learned method, confidence grounded in experience, different future choices. Refusal may lead to another teacher, self-study or another pursuit. |
| S3c Rivalry | Shared objective → conflicting claim → encounter → learned response/preparation → rematch/settlement | Real access, equipment or standing changes. Rival can acknowledge defeat, remain weak, negotiate or leave. No mandatory revenge or rubber-band growth. |
| S3d Villain scheme | Actor goal → recruit/fund → acquire access → prepare → attempt → response/aftermath | Requires actual contacts, custody, secrecy and execution verbs. Expose, obstruct, join, redirect, outbid or ignore remain possible. “Villain” is an interpretation of conduct, not a permission to bypass laws. |
| S3e Mystery | Actual incident → traces/accounts → hypotheses → evidence checks → supported explanation/action | Solution follows the fixed incident; a wrong theory can still motivate a real attempt. A quiet inconclusive ending is valid. Investigation, witness, records, experiment or qualified perception provide different routes. |
| S3f Romance | Recognized contact → reciprocal interest/consent → fitting shared acts → negotiated bond → continued life/changed bond | Directed interest, willingness and commitments differ from trust or paid gratitude. Decline, friendship, distance, repair and mutual separation are valid. Adult eligibility and world-local relationship arrangements are explicit; monogamy, multiple bonds or no romance can all fit different profiles. |
| S3g Feud | Known harm/dispute → attributed grievance → redress/retaliation plans → repair/escalation/settlement | Real disputed custody, boundary, reputation or access, with differing participant accounts. Apology, evidence, restitution, institutional appeal and conflict do different work. Future unrelated disputes remain possible after peace. |
| S3h Rise/fall/recovery | Actual accumulated achievements/support → earned position → pressures/loss of means → response | Rank, office, patronage, wealth and ability are separate. Lost office need not remove skills; recovery may restore a career, form a new institution or choose ordinary life. |
| S3i Investigation of a plan | Observe actual preparations → infer intent → test/revise → intervene | Knowledge of a threat is separate from its hidden objective. Countering one route leaves other real preparations intact without spawning replacement evidence. |
| S3j Communal arc | Several needs/projects compete for real shared capacity → contributions → threshold achieved or revised | A workshop repair fair or common store changes actual service availability. Completion can emerge from NPC contributions without assigning every player a quest. P11 owns occasion/institution records. |

These are forms to consider, not ten recommendations to implement at once. [RIVALS](../../../../RIVALS_IDENTITIES_AND_FATE.md#engine-contracts-and-difficult-edge-cases) retains identity, adaptation and durable-life requirements. P11 [dreams/occasions](../p11/DREAMS_AND_OCCASIONS.md) supplies delivery/context, not prophetic truth. P6 [creative works](../p6/CREATIVE_WORKS.md) supplies actual editions/performances; receiving a ballad is not an authoritative proof of its claims.

## S4: branching, convergence and crossing threads

Branch on outcomes and decisions, with the cause of the fork retained. A failed procurement can open a cheaper substitute or a later appointment where means exist; it must not award the original result or secretly restore spent funds. Routes can converge on the same goal predicate but preserve their different costs, witnesses, custody and promises. Convergence is a shared achieved state, not erasing the route history.

Partial-order beats let investigation and procurement happen in either order, while treatment or installation waits for real prerequisites. A shared helper can connect two arcs through an actual appointment; two requests can compete for one held supply. Root serializes simultaneous admissions by command sequence and validates owner revisions. An arc never reserves an actor's whole life just because they are cast; actual jobs/sites/appointments reserve time and means.

Cross-thread causation needs an explicit link: A's paid repair restores a station B can now use; B's use depletes fuel needed by C. Shared names or chronology alone are not causal links. Grammar checks inspect the read/write graph and report cycles, unsupported predicates and unreachable endpoints. A dependency cycle is sometimes intentional, such as two institutions requiring introductions; provide a genuine third route or show why admission is presently blocked. A generic “quest complete” flag must not short-circuit the domain dependency.

## S5: failure-forward, open endings and overwhelming success

Failure-forward preserves loss and creates a plausible next opportunity from the new state. Cancellation releases exactly held means under frozen terms; consumables already spent stay spent. A missed opportunity can close without punishing a player who never accepted it. Accepted liability differs from a request merely observed. Strong success may finish in one action; the generator does not invent another obstacle to fill a three-act outline.

Terminal labels are scoped: `fulfilled`, `failed`, `expired`, `withdrawn`, `superseded`. An open ending can be `dormant` with no due task or `resolved` with an unresolved social tension recorded as aftermath. It does not leave an immortal unpaid job or a global waiting decision. A character can finish one local arc while remaining alive and pursuing new goals. The quest outcome, person's condition, relationship and institution's outcome can disagree. This extends [Starts/Endings P2](../../../../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md#p2-ending-possibilities) and the already separate causal-case account fields.

## S6: NPCs pursue goals without player engagement

An eligible goal has a `goalOwnerRef`, motivation causes, actor-belief context, priority, completion predicate and real supported operators. On an existing played-time scheduler boundary, an NPC selects one currently admissible step, reserves its own means and starts a real job. They can gather where qualified, pay a service, request help, learn, wait for an appointment or abandon a failing plan. Their apparent urgency is local to their need and resources. Actor availability, beliefs, local calendar and world clock determine progress, not whether the player clicked Accept.

Example: a traveler needs a repair before departure. After a declined player offer they can approach a known local repairer if contact, fee, tools, schedule and consent exist. If the repairer lacks stock, a funded procurement request can follow. If no supported alternative exists, the traveler can defer or depart with the defect under disclosed local terms. The game must retain that honest no-plan state; “NPC autonomously solved it” cannot be a line that fabricates repair or money.

Independent goals can help or compete with each other; a villain and protector must not collude to deliver an author-selected finale. Relationship effects use witnessed conduct and actors' own responses. Further steps are caused by current needs, not the director's desire for conflict. Existing fixed controller infrastructure can serve the first short recipes; generated people require the P4 bridge first. No wall-clock/offline simulation is implied.

## S7: story sifting of actual history

Recognize typed receipt sequences, not phrases in the event feed or lossy biography. Example patterns:

```text
kept_promise:
  promise(A,B,goal,G) → performed(A,G) → received(B,G) → acknowledged(B,A)
  same instance and obligation; causally linked receipts, not merely same item name

repair_becomes_friendship:
  assisted(A,B,problem) → later assisted(B,A,other_problem)
  → mutually accepted bond or supported changed access
  no debt or friendship inferred merely from the two payments

rival_changes_approach:
  witnessed(B,encounter A) → prepared(B,counter_to_observed_tactic)
  → later encounter(B,A) with actual changed means
```

A match stores pattern/revision, bound participants, receipt refs, window, coverage and interpretation. Require causal edges for causal claims and same-world/instance identity; use event time for chronology, learned-at time for narration. A temporal sequence with no intention evidence can be labeled “linked events,” not “secret plan revealed.” Patterns for deception, betrayal or romance require their own supported facts. Negative matches need a closed window and coverage proof; absence from a pruned log is never proof that nobody helped.

Incremental matches retain cursors and pinned causes but express uncertainty. They may surface a known pending lead without scheduling the “expected next” betrayal or reconciliation. Completed matching is idempotent by pattern+bindings+receipt IDs. Group overlapping matches as views of one history rather than issuing repeated rewards. P14 can render the match as a chronicle and P15 can phrase it, using only observer-known evidence. A corrected interpretation adds a revision; the underlying deed is unchanged.

Start with two patterns and a bounded event-type index. Persist partial matches or enough pinned typed history to rebuild them deterministically with the saved pattern revision. Budget work per scheduler boundary and resume via cursor; if no history coverage exists, report insufficient coverage internally and show only safe known summaries. [Winnow R22](REFERENCES.md#r19r22-research-and-distinct-roles) supports incremental recognition as research, not a ready-made YAIRPG runtime port.

## S8: how to tell if this creates more than new words

Compare paired controlled trajectories: same admitted actors/cause/draw, change one real preparation or accepted action. Observe a different next eligible beat, real goal outcome or actor plan. Also compare different valid saved admission draws under identical context, showing structurally different routes without nonsensical laws. Natural play proves acquisition and usability; seeded traces isolate why behavior differs. Card count, prose length and a generated title are insufficient evidence of structural variety. All acceptance gates remain OPEN in this docs-only lane.
