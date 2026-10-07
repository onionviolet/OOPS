# Implementing narrative depth through connected consequences

2026-10-06. Direct followup: “more to consider? how to implement with the depth?” This operational blueprint explains the existing [P1–P5 packets](../IMPLEMENTATION_PACKETS.md); it does not dispatch gameplay, select a world, add accepted APIs or create a second specification. [CAUSAL_MODEL](../CAUSAL_MODEL.md) and [ENDING_MODEL](../ENDING_MODEL.md) remain the rule owners. All new example names, times, policies and IDs are **O proposals**.

Depth comes from the same action changing several meaningful later affordances: a defended attack can disclose a protection, injure an actor, interrupt a delivery, create a witnessed grievance, motivate investigation and change a local ending. It need not spawn an unrelated quest or require a separately written full story for every combination. Ordinary life and source texture can remain descriptive when no mechanical payoff is selected.

## 1. Give actors goals, commitments and knowledge they can use

Add finite authored goals to selected actual actors. A goal names a desired state, present means, decision opportunities, evidence requirements and possible abandonment/completion. Existing controllers already choose prioritized legal commands; use them as the executor. Do not turn an aspiration into an unearned outcome.

| Actor feature | Concrete proposed representation | Existing owner / demanded change |
|---|---|---|
| Present person | Actual actor/person/body/controller/instance/location, owned source/method/fuel/stock, commitments | Existing actor/simulation/native owners, not another character save |
| Goal | Immutable authored predicate and a few alternative legal plans; saved selected/status/cause only when needed | Existing controllers/commands/situations; optional explicit goal-policy extension if demanded |
| Belief | Actual received evidence/attributed inference; distinct from private world truth | `simulation.knowledge`, situation basis and retained consequential evidence |
| Relationship | Specific remembered deed/obligation and its audience, not just hostility points | Existing relationship axes plus caused memories/claim/obligation consumers |
| Adaptation | A candidate becomes legal after learned evidence, with its own preparation/access/resources | Existing controller legal previews/jobs; no free growth or omniscient target selection |

An NPC who witnesses an attack may learn the attacker's identity and a particular technique. A witness who sees a masked figure learns less. A corpse discovers no attacker identity by itself. An investigator can spend actual time/funds to question a witness or examine a trace; testimony can be false. The next plan can guard an exposed source, change departure route, seek treatment, bargain, train a supported counter or abandon a goal. Every step needs a legal consumer and funded/actually supported means.

Repeated attacks should not merely replay the same scene. Retain consequential evidence and let eligible actors react, but do not force adaptation after every attempt or manufacture knowledge from failure. An unobserved intervention may change only physical support; a known trick may be countered; a genuinely unlimited protection stays unlimited. Learned actor counters require the relevant ability or a paid acquisition/training route. Returning later reads those changes; unsupported absence keeps the world's current freeze policy.

## 2. Separate an accepted method from its later result

**Current source:** `simulation.startCommand` reserves costs, stores a draw/outcome and freezes prepared effects into the job. `completeJob` rechecks life/contact/requirements only when the job carries `completionSupport`; otherwise it applies those effects. This is useful for the current retained work contracts. It is insufficient to advertise a long attack or ritual whose target/fate/counter can materially change before completion.

For **new explicitly enrolled CSE actions only**, freeze the attempted method, target/body/instance, definition revision, held costs, disclosed cancellation policy and any reserved random draw. Resolve the result against current supported state at the meaningful resolution boundary. Do not repeatedly reroll. Existing jobs keep their frozen semantics and older definition readers.

Example: player starts severance while a covenant is intact. Before it resolves, its keeper legitimately releases the covenant. The player's operation must not sever or steal a nonexistent relation, nor refund completed preparation by inventing a new result. Its opted-in definition decides whether this is cancelled with actual unspent means returned, a paid no-op, or an alternative result already quoted. Similarly, a protection restored before an attack resolves must be checked before a terminal effect; a target that legitimately escaped cannot be killed at the former location.

**Proposed opt-in resolver contract**, not a current accepted job field: `{kind:'named_intervention', definitionRevision, targetBinding, methodId, draw, supportRefs, policyRevision}`. The existing staged job remains the sole reservation owner. Do not mirror bag contents, HP, gear, clock or a stale live context into this descriptor. Add validator/publication compatibility before exposing it.

```mermaid
flowchart LR
  A[Current legal action and contact] --> B[Reserve actual method costs]
  B --> C[At resolution, recheck target and support]
  C --> D[Resolve physical candidate and applicable fate]
  D --> E[Stage actual result and evidence]
  E --> F[Invalidate affected plans and evaluate closures]
  F --> G[One durable save, then publish]
  G --> H[Later informed NPC decision]
```

Keep the existing proposed entry points: `previewNamedIntervention`/`stageNamedIntervention`, `resolveInterventionProtections`, `collectAffectedCausalRules`/`stageSupportInvalidations`, `stageCausalClosures`. These remain proposed functions, not exports implemented by this analysis. Existing `main.persistExpansion` and `persistExpansionPlan` remain the only publisher. For native combat, resolve each actual action through its admitted named adapter; do not simulate an entire fight with one arbitrary scene flag.

Protection resolves **before terminal actor death is committed**. Distinguish intercepted lethal candidate, actual nonlethal victory, body death with pending return and truly terminal identity loss. A later actual restoration keeps its prior death/cost/history. Observe source-specific superiority and conditional guarantees; the player can succeed at an unprotected objective even if killing is impossible.

## 3. Author causal nodes with several means, then pay for consequences

For each turning point, specify the actual goal, causes, contact/evidence, methods, held means, support-loss policy, actual result, who learns it, affected future affordances, closure and useful continuation. This is the minimum authoring card. A declaration that a scene is “branching” is insufficient.

Author a few **materially different approaches** using shared effects: trade/permission, craft/preparation, research/warning, contest/coercion where admitted, and refusal/ordinary work. Select those the situation actually supports; do not require all five for every scene. More dialogue options with the same outcome provide voice, but do not supply additional causal depth by themselves.

Dependency edges name necessary support: a living teacher, source relation, particular evidence, consent, safe route, owned fuel or institution's authority. A changed fact marks only affected rules for re-evaluation. Losing a courier does not cancel a storm; losing all ignition fuel can avert that operation. Future-self protection reads an actual admitted anchor/relation, not the source author's prediction that the actor eventually becomes powerful.

Consequences are paid by their real owners. A ward may be unconditional under a law, while its human beneficiary still needs food/treatment/transport. A patron-based rescue requires the patron's actual availability unless the source law works independently. A settlement can retain a witness's copied instructions after the original is destroyed. Power, identity, office, recognition and physical belongings stay separate.

The author writes important reactions at the situation level, with observer-qualified variations. Reuse a scene's opening/voice with changed action eligibility and known aftermath, rather than maintaining separate scripts for every Boolean combination. Ink hosts receive only the observer's supported variables and call actual staged commands. If the actor is unavailable or hostile, begin/resume/respond gates change; a saved cursor cannot quietly complete an obsolete reward.

An unmodeled large intervention must have an honest scope disposition. If a supported action succeeds, retain it even if a later authored scene becomes unreachable. If its broader continuation is not represented, close the supported local arc or expose that limit; do not secretly revert the actor, recreate a boss or restore a lost unique object.

## 4. Make depth visible through evidence and changed endings

The player needs enough feedback to infer causes without receiving private cosmology. A failed killing attempt can reveal an observed distortion, relocation, wound pattern or patron mark; it need not reveal the exact secret anchor. Multiple independent channels can corroborate a hypothesis. Future memory can be wrong, and a knowledgeable NPC can lie or misunderstand.

A practical Notebook/People/action projection shows learned evidence and current contact/terms, plus known changed opportunities. Separate “I witnessed the covenant intercept” from “the keeper claims it protects every future.” A known contract can advertise its true terms; an unknown protection stays mysterious. Preview rejects stale or unavailable actions without disclosing hidden actor plans through its reason text.

Endings summarize separate actual accounts: encounter/protagonist fate, player contribution/obligations, local society, issuer/larger threat and further life. A final choice can select a legal unresolved arrangement. It cannot erase previous costs or turn a missed warning into a saved clinic. Ascension can retain its rank endpoint while changing ideology, companions, rights and relationship to the player.

For future anchors, explicitly choose fixed, branching or editable-with-anchors history before offering temporal action. “Acausal” needs attacked forms, reachable histories, identity relation and actual exceptions. A high-power actor may resist earlier erasure while locals still suffer the missed delivery. A player can win by isolating jurisdiction, denying an unprotected goal or securing another history. Costs/knowledge/cargo persist according to that selected rule; old historical losses are not automatically rewound.

## 5. Prove one dense arc, then reuse it

**O proposed first proof:** a new optional *Covenant Courier* scenario in one existing region. It does not retrofit Tarin's mortal profile or old Mara/elder fights. Three authored people: Asha the protected courier, Roe the recipient/witness and Nell the covenant keeper. One actual delivery/warning goal, a finite response window, ordinary stock/body/care, a survival-only covenant and useful local work afterward. Exact IDs/stats/items/times remain integrator choices; no new world or prestige is required.

The covenant prevents terminal death until its explicitly defined release/commission condition. It does **not** guarantee delivery, freedom, ally safety or approval. Its interception must produce an actual supported result. It can be unlimited while intact. The player can discover it without attacking, through a credible account or an observed hazard, and can cooperate, refuse, contest the goal, earn release/severance or oppose the courier if those actual commands are admitted.

| Finite trajectory | Real connected result | Independent response and closure |
|---|---|---|
| Cooperation | Spend actual supplies/time to support Asha; delivery completes if route/contact survive | Roe's recorded warning affects its own prepared response. Asha's goal completes, player contribution earns only its actual reward; local work remains |
| Attack while protection holds | Paid supported attack resolves physical/fate result; no falsely committed terminal death | Witness-specific grievance, treatment or a changed route consumes actual means. Courier can survive while delivery fails; protection is not a secret success guarantee |
| Objective contest without severance | Capture/obstruction only if its physical/authority consumer exists; otherwise use an admitted route/claim dispute | Protected Asha may remain alive and unable to deliver. Nell can seek terms or release only after actually learning relevant evidence; no forced rescue because canon expects delivery |
| Earned severance, living resolution | Acquire exact contract evidence/method/access and release or break that particular relation | Asha retains learned skills and can accept new terms, seek support or oppose the player. Severance itself grants no death, title or stolen source |
| Eligible terminal result after severance | A separately admitted lethal action actually overcomes current physical means and remaining protections | Personal arc ends. Existing copies/witness knowledge can still enable a funded alternative warning; otherwise the warning goal fails. Player/local endings differ and no replacement Asha appears |

This proof exercises P1 targeting/protection, P2 support/knowledge/plans, P3 closures/known UI, P4 finite authoring and P5 compatibility/publication. A later explicit future-anchor variant can protect Asha's history, require a different applicable counter and allow changed ascension. Do not add that variant's bootstrap/branch machinery merely to make the first protection feel sophisticated.

Depth acceptance asks whether the player can observe a changed later action and why: does a witnessed attacker face a different meeting? Does a late warning remain late despite survival? Does a severed source really stop intercepting? Can a living defeated protagonist continue a funded independent goal? Can a survivor deliver a genuinely retained copy after the courier dies? Do stay/return preserve costs, beliefs and closure? These are later observable gates, not gameplay proven by this document.

Implementation can scale through immutable authoring cards and sparse consequential state. Build a derived in-memory dependency index; re-evaluate affected goals at supported clock boundaries/material changes, not every possible story on every tick. Do not cache a player quote across revision/support changes. Keep active cast and represented institutions finite, compress offscreen work into actual supported commitments, retain significant receipts and avoid a raw source-prose corpus. No performance claim or benchmark is made here.

## Current engineering fit and evidence

Current source inspections: `simulation.previewSimulationCommand/startCommand/completeJob/advanceSimulationBoundary`; typed life/source/knowledge/relationship effects; explicit situation receipts; work-plan completion; scoped Ink host commit; single durable `persistExpansionPlan` then native publication. They support much of the everyday consequence substrate. Missing generic named intervention/protection, immediate dependency joins, contested retained evidence and common closure evaluation remain demanded P1–P5 work. A pure profile or current scenario checkpoint is not a whole-history simulator.

Live ownership changed since the original audit: Book-world GM `01a10dc5` completed/released its finite build; Audit implementation GM `01a10fe7-c3cd-79a2-86d0-2eba1fcfcefd` subsequently completed/released its first wave, according to its current checkpoint/RELEASE/BUILD owners. A next selected implementation must acquire the actual current writer scope; this analyst keeps only this directory. Do not infer a still-active predecessor or begin shared writes from stale references in historical snapshots.

Performed here: scoped source/document inspection and later JSON/link/hash/coverage checks. No gameplay/code/native/save/package/build/test files edited, no game/private saves exercised, no new browser/unit/save/failure/regression/build suite, no external messages or source-library changes. Fiction/balance and playable persistence/director acceptance remain later integration work. Proposed mechanisms can be implemented-unverified under current pace; this blueprint itself is design only.
