# Ending and continuing-life contract, proposed CSE revision 1

An ending closes a defined undertaking. It need not end the player, every resident or the world. Current Frontier closure commands and nested mission outcomes already demonstrate this principle; this proposal supplies the missing common contract for selected disruptive interventions. No new save reader or ending evaluator is implemented here.

Revision2 includes the user's strong world-specific fate/temporal direction. The evaluator runs **after** applicable survival/anchor resolution. A guaranteed survival or ascension predicate can coexist with changed companions, goals, ideology, institution, route and costs. Fate severance is a separate materially qualified outcome; it is not automatically death or loot. [CAUSAL_MODEL](CAUSAL_MODEL.md) owns CSE-16–20 and the world/temporal contracts; [trope audit](evidence/TROPE_THEORYCRAFT_AUDIT.md) keeps community theory and O invention explicit.

## Four accounts plus known outcome

| Account | Examples of authoritative inputs | Possible closure and continuation |
|---|---|---|
| Protagonist/person | Life/body/soul/controller, captivity, goal, commitments, acquired means, personal relationships; fate/anchor support and actual protected finality scope | Alive goal accomplished; alive goal abandoned; escaped/missing; captured; personal arc averted; protected survival; body loss with supported pending return; genuinely terminal death; source-specific return. Other arcs continue through their actual support. |
| Player | Selected goal, accepted/refused obligations, actual conduct, location/return, learned/owned progress, debts, body/life | Independent practice; cooperation; opposition; withdrawal; settled mission; unmet return; detained; faint/recovery; selected true-life ending. Death of another actor does not assign the player their role. |
| Local society/institution | Living knowledgeable workers, leadership/authority, custody, stock, viability/threat, access and lawful succession | Limited viable service; evacuated subset; private agreement; disrupted service; destroyed unrecoverable archive; averted conflict; unresolved threat. No global approval score. |
| Larger world/issuer | Defined threat, operation prerequisites, actual mission terms, issuer funds and receipt, broader dependencies actually represented | Issuer success can coexist with local harm; local success can yield partial/zero issuer payout; threat may remain beyond selected scope. |
| Observer's account | Attributed observation/testimony/inference, who learned it and when | Confirmed, reported, suspected, contradicted, unknown. UI never infers the true ending from private evaluator facts. |

Do not use “good ending” as the schema. Save separate dimensions and the concrete qualifying evidence. Killing a conspirator can avert that conspiracy while creating grief, lost expertise and retaliation among informed survivors. Killing an indispensable rescuer can leave a failed rescue; it need not create a new villain or destroy the universe.

## Proposed closure record and evaluator

```json
{
  "id": "cse.mortal.courier_arc.closure:simulation:42",
  "definitionId": "cse.mortal.courier_arc",
  "definitionRevision": 1,
  "context": {"worldId":"base.frontier","instanceId":"frontier.main","eraId":"cse.proposed"},
  "cause": "simulation:42",
  "sequence": 42,
  "at": 17,
  "predicateId": "tarin_dead_document_delivered",
  "accounts": {"protagonist":"dead","player":"delivered_elsewhere","society":"limited_warning","world":"storm_unaltered"},
  "evidenceRefs": ["tarin.death:simulation:40","document.handover:simulation:42"],
  "rewardSettlementId": null,
  "continuationIds": ["local_paid_repair", "known_witness_inquiry"]
}
```

Illustrative proposed data only. Record actual finite IDs, current supported clock and safe typed evidence. A closure receipt may refer to a prior separately settled mission reward; it never duplicates a payout. Durable evaluator inputs are actual state plus retained receipts, not Ink prose, author forecasts, claimed skill descriptions or pruned UI logs.

Proposed pure API: `previewCausalClosures(state, registry, affectedArcIds, context)` and `stageCausalClosures(plan, registry, cause, affectedArcIds)`. Implement under current simulation/situation/selected campaign owner or one demanded pure adapter. No autonomous new publisher. Registry definitions carry predicate priority, exclusive account-group, prerequisite/source revision, closure effects, once key and continuation policy. `main.persistExpansion` performs the one durable publication.

## Frozen priority and once-only semantics

Within **each account**, use the following precedence for newly enrolled CSE revision 1. Do not choose one winner across all accounts:

| Priority | Predicate class | Rule |
|---|---|---|
| 100 | Confirmed terminal life/form/world loss for this scope | Exact actual life or viability policy dominates a simultaneously offered success label. Resolve all applicable selected fate/anchor protections first. Body death alone does not prove soul/whole-identity destruction, irreversible future loss or world loss. |
| 80 | Resolved custody/exit/mandate termination | Captured, escaped, actually returned, expired contract; actor may still be alive and other goals may be complete. |
| 60 | Goal resolved by material evidence | Accomplished, averted, failed, abandoned; inspect deliveries/sites/participants, not only a final choice. |
| 40 | Settled local arrangement/career | Consented public/private service, proven specialization, willing succession. These can compose with a goal closure. |
| 20 | Explicit withdrawal/abstention | Only closes an accepted arc or selected voluntary involvement; refusing an unsigned offer creates no secret debt or failed mission. |
| 0 | Open/unresolved | No closure if prerequisites, evidence or represented outcome are absent. Show a known limitation. |

Tie-break exclusive predicates by declared priority then stable predicate ID; authoring validation rejects overlapping terminal predicates without an intentional exclusivity/tie policy. Composable facets persist together, e.g. `protagonist=dead`, `goal=delivered_by_other_actor`, `player=withdrawn_from_management`. This avoids picking a cheerful delivery summary that conceals an actor's death.

Settling uses `(context instance, arc ID, definition revision, closure epoch)` once key with the qualifying cause/evidence. Repeated UI rendering, same command, reload, return, field renewal or counterpart contact cannot resettle it. Reward eligibility remains owned by the accepted objective/issuer and costs reserved there. A new authored project may introduce a new epoch only through a legal command with new permission/means; it references the old closure instead of deleting it.

Source-supported resurrection can open a new personal continuation while retaining the death and loss interval. Loop reset creates/reuses the selected iteration with declared retention, not an arbitrary arc epoch increment. Replacing a ruler requires the actual succession institution/authority consumer. An unrepresented successor is recorded as unresolved authority, not invented.

## Continuing life and reopening

Ordinary work, training, trade, treatment, relationships, return and residence remain available if their present causes survive. Each closure lists actual continuation definitions and known access/recovery terms. Missing supplies/funds/consent can pause those choices; no infinite refills are inferred. The same instance retains its actors, remaining stock, losses and commitments on revisit.

Reopening is explicit and narrow: new funded service after a closed agreement; supported rescue of a captured actor; actual repair of a damaged route; source-qualified restoration method. A destroyed unique record or final person death may remain irreversible. An actor who yields can later oppose the player if informed motives and means justify it; a deceased actor's original goal does not continue through its controller.

The player may choose to leave after a partial closure, or live locally after refusing the central plot. Leaving still needs legal body/cargo/travel consumers. An author's ending title is not a teleport, resurrection, reward or plot-completion command. A later report can update the known account without rewriting the settled physical history.

## Architectural choice

| Approach | Strength | Cost/limit | Fit here |
|---|---|---|---|
| Fully authored branching graph | Clear voice, source-sensitive set pieces and deterministic finite endings | Branch combinations grow rapidly; dead required cast requires explicit alternatives; menu-only flags can ignore real state | Use for selected turning points and source exceptions, with material prerequisites |
| Rule-driven actor/world simulation | Reusable work, scarcity, knowledge, interference and independent decisions | Requires actual contact/combat/plan/dependency consumers; cannot synthesize all politics or satisfying prose from flags | Extend the existing bounded simulation, not a full society rewrite |
| Hybrid authored causal situations plus reusable effects | Strong source bounds and distinct outcomes with conserved means and durable histories | Each selected arc still needs prerequisites, closures, recovery and authored reactions | Recommended. Existing `causal_situations`, commands/controllers, shared publisher and Ink host are a close fit |
| Optional generated narration/planning | Can vary texture or suggest a legal supported action | Nondeterminism, source errors, false knowledge and unsupported plans; no authoritative state ownership | Optional later. No provider, dependency or packet is required now |

The hybrid does not mean authoring every path separately. Generic life/support/knowledge/stock effects can invalidate a finite authored event and qualify an existing closure. Source-specific defense, loop survival, fortune suppression, succession or exceptional extraction still needs source-specific rules/content.

If a generator is later selected, feed observer-qualified facts and offered legal action IDs. Treat its plan as a proposal for the host to preview and commit. Host owns state, costs, RNG, target legality, effects, once receipts and durable publication. Generated prose cannot declare death, give an item, reveal a private secret or reschedule a source event. Invalid proposals leave no authoritative effect.

## Fate and temporal closure facets

Proposed additional facets: `physicalEncounter`, `protectionDisposition`, `anchorDisposition`, `futureGoal`, `historyScope`, `identityFinality` and observer-qualified `knownAccount`. Keep precise source/original policies rather than a universal karma score. Example O records:

| Actual caused outcome | Legitimate closure | Claim the evaluator must avoid |
|---|---|---|
| Player wins a nonlethal encounter, mandate preserves life | Encounter won; protagonist yielded/alive; current objective may change | “Unbeatable” merely because the actor cannot die |
| A scripted covenant interception prevents lethal result | Attempt defeated/protected; actual injury/displacement/costs retained | Record real death then silently clear it to preserve chapter order |
| Body dies, supported future anchor retains identity | Body loss and pending/actual restoration under its policy; ordinary local obligations may fail | Actor erased from every time/branch or instantly restored at full stock |
| Fate relation is legitimately severed, person survives | Unbound/mortal or changed protected scope; existing skill/goal retained | Fate-break grants all power to the severer or itself kills the holder |
| Actual ascent endpoint survives but motive/companions change | Ascended into a different role/ideology/relationships and paid different costs | Same ending because numerical rank is unchanged |
| Player changes a distinct branch while original anchor survives | Branch-local success and original-history survival, with separate identities | Erased/duplicated another instance's items, people or known past |
| An overriding temporal action truly removes the anchor and eligible identity | Selected terminal finality and dependent loss; survivors keep their actual evidence/support | Automatically restore every affected event or remove everyone's memories |

For mystery, show only actual learned evidence. A person rumored dead may have a pending return; a fortune source believed severed may still have an unobserved applicable anchor. The engine's exact rule and the character's uncertainty are different owners. Do not use hidden unknowns as an excuse to reverse a previously guaranteed player-facing outcome. If the game claims finality, bind and validate its actual scope before offering it.

When a source selects editable history, retain an intervention receipt and the declared old/new history projection with explicit observer memory/stock/relationship treatment. A changed history can revise which future is reachable without deleting the cause/cost of the intervention. When it selects a fixed history, earlier attempts already belong to it. Neither model automatically rewinds the user's save or authorizes general dependent rollback.
