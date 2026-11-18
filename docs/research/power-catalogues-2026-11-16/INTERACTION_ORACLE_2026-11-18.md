# Interaction oracle (2026-11-18, proposals)

Register status: Proposal (AD32, AD56). Agent-generated, not human-reviewed: two cheap models (gpt-6-luna, claude-haiku-5-5) answered each case from the rule digest in `scripts/interaction_oracle.mjs`; agreement is a screen, not a ruling. Cases are built by script from XA1-XA26 and the nine substrates; rows in [interaction_oracle.jsonl](../../coverage/interaction_oracle.jsonl), agreed fixtures in [interaction_oracle_agreed.json](../../coverage/fixtures/interaction_oracle_agreed.json).

## Numbers

- 499 cases answered by both models. Agree on outcome and deciding-rule kind: **138 (27.7%)**. Agree on outcome alone: 272 (54.5%).
- Both said the rules do not decide the case ("undecided"): 213. These are missing-dial signals, not fixtures.
- Fixtures: 37 agreed, decided cases.

| Family | Cases | Agree (outcome + kind) | Agree (outcome) |
| --- | ---: | ---: | ---: |
| steal-time-travel-rewind | 109 | 35.8% | 38.5% |
| two-in-one-time-stop | 36 | 16.7% | 41.7% |
| speed-vs-stop-precog-domain | 54 | 24.1% | 51.9% |
| precog-vs-luck-edit | 24 | 25.0% | 41.7% |
| precog-vs-precog | 16 | 12.5% | 50.0% |
| absorb-vs-negate | 36 | 8.3% | 38.9% |
| loop-vs-lease-stolen-power | 36 | 16.7% | 30.6% |
| distance-vs-portal | 24 | 0.0% | 37.5% |
| emp-vs-cyberware-magic | 24 | 12.5% | 66.7% |
| xa-pair | 140 | 42.9% | 85.0% |

## Disagreements ranked by design-rule impact

Heuristic, deterministic: cases are grouped by family and the pair of deciding-rule kinds the two models named; a group's weight is its case count times mean severity (opposite winners 3, decided vs undecided or a winner vs both/neither 2, otherwise 1, plus 1 when the kinds differ, plus 1 when both are high confidence). A big group means one unsettled rule decides many cases. Each is a decision for Weibao, not a settled ruling.

### D1 steal-time-travel-rewind: backing_anchor vs backing_anchor (47 cases, mean severity 2.0)
> Example: `io-steal-time-travel-rewind-029`. Order of events: the victim has the time-travel power, and a restore point to the time before the theft exists. The thief steals the power. Then the thief tries to use it to rewind to before the theft. Anchor ownership: no restore point exists from before the theft; the earliest point is after it.
>
> Luna: a_prevails, backing_anchor: restore requires the anchor; the earliest point is after the theft. The thief cannot rewind to before the theft: the earliest available restore point is after it. The thief retains the stolen rewind-use row because the user's power rows are carried; the victim remains without it, and the row's limited reach restores only the thief's own body.
>
> Haiku: b_prevails, backing_anchor: Anchor ownership: the holder who took the restore point owns it; restoring needs the anchor. Backing (CHT5) lists item, name, debt, soul thread; anchor not listed as moving with the row.. The thief does not rewind to before the theft. The row moves to the thief as a lossy copy with the old holder's lien, but the restore point is owned by the victim as its anchor holder, and the anchor is not in the backing list that transfers with the row, so the thief cannot restore to it. The victim keeps the anchor and the pre-theft point. The setup contradicts itself on whether a pre-theft point exists; if none exists, the thief's target is absent and the result is neither.

### D2 xa-pair: mechanism_other vs stated_reach (42 cases, mean severity 1.0)
> Example: `io-xa-pair-391`. Holder A uses Power over distance on, or against, holder B's Auto-acting Stand, in one tick. Both have reasonable reach.
>
> Luna: undecided, mechanism_other: Missing rule: whether distance link-cost edits affect a separate reactor holder or its standing orders. The rules do not specify whether editing link costs affects a separate reactor holder or its standing orders. Reach alone does not resolve that interaction; the engine needs a rule for how place-graph link edits apply to beings and their actions.
>
> Haiku: partial, stated_reach: reach is positions, not forms (XA12 reach); B is a beings reactor holder, not a position, so no time hold or rate-0 stop reaches it; missing dial: whether a being's movement routes through rules-altered link costs. A's rules.alter lands on the place graph: link costs at the positions it reaches are edited (fold, stretch, or loop). It does not hold, stop, or override B's Stand, because A's reach is positions, not forms, so the Stand stays a separate reactor and keeps acting on its standing orders. Whether a changed link cost slows the Stand's movement is not stated by the rules; that needs a dial tying being movement to place-graph costs.

### D3 xa-pair: layer_order vs mechanism_other (18 cases, mean severity 2.1)
> Example: `io-xa-pair-367`. Holder A uses Time skip on, or against, holder B's Binding vow with visible cost, in one tick. Both have reasonable reach.
>
> Luna: undecided, mechanism_other: Missing rule for how a time hold affects a relation-layer oath action and its terms.. The rules do not specify whether A’s time.hold interrupts, delays, or otherwise affects B’s oath action or its leash and break consequence. The layer order places time before relations, but does not define this interaction.
>
> Haiku: a_prevails, layer_order: layer 2 time (hold, rate 0 on B) precedes layer 6 relations (oath terms attach to what landed); time.hold does not touch relations.oath, so no same-substrate conflict arises. Time skip's hold (time.hold, rate 0 on others in scope) lands on holder B while A acts, so B cannot react; the oath is a relations row and its leash and break consequence attach to what landed, but a hold does not erase or break the oath, so A's skip does not dissolve B's vow and A gains the time without the vow being altered. Because the hold is on time at layer 2 and oath terms are relations at layer 6, the hold decides who acts during the tick and the oath's terms then apply to the final state unchanged; A prevails on the time axis only.

### D4 distance-vs-portal: mechanism_other vs stated_reach (14 cases, mean severity 1.9)
> Example: `io-distance-vs-portal-319`. The distance holder has set the field over the place where the portal opens.
>
> Luna: undecided, mechanism_other: Missing portal rules: whether portals use edited link costs, how a blind destination is resolved, and what portal users perceive.. The rules do not say whether a portal uses place-graph links, so they do not determine whether the distance field changes its cost or whether the blind jump succeeds. They also do not specify what either side perceives through a portal.
>
> Haiku: a_prevails, stated_reach: portal reach unstated -> default stopped (F7); layer 1 rules field shapes later layers; cost and perception dials missing. The distance field lands first at layer 1 and sets fold link costs over the place where the portal would open. The portal's reach and passes are not stated, so by the default it is stopped and does not open. The rules do not set a cost for a failed portal or say what either side perceives; those need a stated reach/passes on the portal verb and a perception dial.

### D5 absorb-vs-negate: layer_order vs stated_reach (8 cases, mean severity 2.6)
> Example: `io-absorb-vs-negate-265`. The absorber tries to absorb the negater's power while the negation is up.
>
> Luna: b_prevails, stated_reach: F7: unstated reach defaults to stopped. The absorption does not land because its delivery has no stated reach, so it cannot reach the Negater’s power. The Negater’s row remains intact, and the channel-negation field stays up; it blocks that carrier, not the power itself.
>
> Haiku: a_prevails, layer_order: rules.block scope (one verb on one object) evaluated at layer 1 before powers.move at layer 4; absorb targets the negater's power, not the negation's blocked object; negation field is not a backing term, so it does not move with the row. The absorption lands: the negater's power row moves into the absorber's kit (source loses it because the intake is a move), and the absorber holds it as a kit entry. The negation is a rules.block field over its own target, not a term on the moved row, so it stays in place and returns when its field ends. This holds only if the negation's blocked verb/object does not include the absorb verb on the negater's power; if it does, the block fires first at layer 1 and the absorb fails.

### D6 loop-vs-lease-stolen-power: carried_set vs dial (10 cases, mean severity 2.1)
> Example: `io-loop-vs-lease-stolen-power-303`. The borrower of the stolen power is the one who loops. The restore point was taken before the term began. The loop triggers after the term has run for a while.
>
> Luna: a_prevails, carried_set: Restore removes everything made after the point that is not carried; the carried set is the looper’s memory only.. The restore returns the power row and lien/lease state to the pre-term snapshot, so the original holder holds the power and the term has not begun. The borrower remembers the theft only if that memory was already part of the looper’s carried memory; the carried set preserves the looper’s memory through the restore.
>
> Haiku: b_prevails, dial: loopRestores=[rules] (powers not restored, so the row move stays); carried set = looper memory (borrower remembers theft). Term clock behaviour under a non-world restore is not specified: missing dial.. After the restore the thief still holds the power row, because loopRestores=[rules] does not include powers, so the moved row is not rolled back. The lien term keeps running from its current state rather than rewinding to the restore point, and the lender can still call it. The borrower remembers the theft, since the carried set is the looper's memory. The rules do not state whether the term's remaining time is rewound under a rules-only restore, so that detail is a gap.

### D7 distance-vs-portal: layer_order vs mechanism_other (7 cases, mean severity 3.0)
> Example: `io-distance-vs-portal-318`. The portal user opens the portal next to the distance holder's field.
>
> Luna: undecided, mechanism_other: Missing dial/rule: whether link-cost edits apply to portal links between place tables, and how portal reach/passes interact with a distance field. The portal is stated to connect to a pocket place by one link, but the rules do not specify whether the distance field edits that portal link, or how its link cost affects portal activation or perception. The portal’s reach and passes against the distance field are also unstated, so the interaction is not decided.
>
> Haiku: both_apply, layer_order: layer 1 rules (distance alters link cost) precedes layer 3 space (portal); different substrates, so no same-substrate passes conflict applies. Missing dials: portal cost field, distance reach over pocket table, perception (mind) rule.. The portal opens: its space.portal lands as a pocket place with its own link table, reached by one link. Distance's rules.alter lands first at layer 1 and reprices the portal's entrance link as fold (cheaper) or stretch (dearer), since reach is positions and the entrance link sits in the place graph. The pocket's internal link table is not reached by the distance reach as stated, so it stays unshaped. The portal's cost is not stated, so it is undecided. What each side perceives is not decided: no mind-substrate rule for the portal or the distance field is given.

### D8 emp-vs-cyberware-magic: mechanism_other vs stated_reach (13 cases, mean severity 1.6)
> Example: `io-emp-vs-cyberware-magic-342`. The pulse goes off in range of the target.
>
> Luna: undecided, mechanism_other: Missing dial/rule: whether the relations mark is powered electronics and whether it has a carrier or backing affected by the EMP.. The EMP field applies only to powered electronics in range as specified; the rules do not say whether the completed ritual’s lasting relations mark is powered electronics or what carrier sustains it. Its behavior during the field and persistence afterward are therefore undecided.
>
> Haiku: both_apply, stated_reach: EMP passes:[] with different substrates (rules field vs relations mark): no same-substrate conflict; layer 1 rules field blocks only powered electronics, layer 6 relations term attaches to what landed. Missing dial: definition of 'powered electronics' (needed for cyberware).. The EMP field lands on powered electronics in range and holds them down for its few ticks, then they resume when the field ends. The ritual mark is a relations term on a holder and is not blocked, since the EMP's passes list is empty and it shares no substrate fact with the mark, so the mark persists through and after the field. Whether any cyberware counts as powered electronics is not defined by these rules, so that case is undecided.

### D9 loop-vs-lease-stolen-power: carried_set vs carried_set (10 cases, mean severity 2.0)
> Example: `io-loop-vs-lease-stolen-power-280`. The lender of the power is the one who loops. The restore point was taken before the term began. The loop triggers after the term has run for a while.
>
> Luna: a_prevails, carried_set: loopRestores=world; restore removes post-point changes not carried, and only the looper's memory is carried. The restore returns the power row to the lender and removes the post-point lease and lien; the term is back to its pre-term state. The borrower does not remember the theft, since only the looper's memory was carried.
>
> Haiku: undecided, carried_set: loopRestores=world with carried set = looper's memory only; restore removes everything after the point that is not carried; missing: term-state reconciliation for a moved row under restore. The loop restores the world to the pre-term restore point. The carried set is only the looper's memory, so the borrower's memory of the theft is not carried and is restored away, and the power row's move and lien are reverted with the world. But the rules do not state whether the power row (a powers-substrate row, not in the carried set) and its lien are restored under loopRestores=world, nor whether the lender's claim survives as a rule or relation, and the 'term has some time left' state is not a defined field that the restore can resolve. The rule set lacks a dial for how a moved row and its lien reconcile with a restore that predates the move, and for whether the borrower's memory of the theft is part of the world or the carried set.

### D10 absorb-vs-negate: layer_order vs mechanism_other (9 cases, mean severity 2.1)
> Example: `io-absorb-vs-negate-242`. The negater lays a negation over the absorber while they absorb a third party's power.
>
> Luna: undecided, mechanism_other: Missing dial: whether negation-over-holder blocks the absorber’s powers.move intake (and its interaction with digest’s kill-or-drain prerequisite).. The case does not specify whether the negation field over the absorber blocks the absorber’s intake/move verb or otherwise prevents the absorption. If it blocks that verb, absorption fails and the target power remains with its source; otherwise the absorber gains a permanent lossy kit entry and the source loses the power. The negation persists while its field holds.
>
> Haiku: b_prevails, layer_order: MF4b layer 1 rules before layer 4 powers, with negation over holder (XA3 variant: every power the holder owns stops) suppressing the absorb row; the absorb row stays and returns when the field ends. The negation over the absorber is a rules.block field at layer 1, so it applies before the absorb (powers.move, layer 4) resolves. The absorb fails: no kit entry is created, the third party keeps the target power, and the absorber gains nothing. The negation stays on the absorber and its power rows are held, not destroyed; they return when the field ends.

### D11 two-in-one-time-stop: clock_rate vs stated_reach (7 cases, mean severity 2.6)
> Example: `io-two-in-one-time-stop-122`. Both are in one place. both start in the same tick. the first stop states passes: [] and the second states passes: [time].
>
> Luna: a_prevails, clock_rate: rate 0 means held holders do not act or perceive; rate comparison decides who acts first. A acts and spends real time; B is held at rate 0 and neither acts nor perceives during the stop. B’s forecast cannot run in the held interval; its passes list does not change B’s clock rate.
>
> Haiku: b_prevails, stated_reach: same-substrate conflict on clock rate: effect whose passes lists the other's concept wins the axis (B passes [time], A passes []); held holder cannot react. B's stop wins the clock-rate axis because its passes list time and A's passes list nothing. A is held at rate 0 inside B's scope: A does not act, does not age, and perceives nothing. B acts alone and keeps the caster exception. A's stop has no effect on B. B's forecast reads the world as a sandbox copy, and A contributes no stochastic forecast input because it is held. The rules do not state B's reach explicitly, so this rests on the same-substrate passes rule rather than a stated reach tie.

### D12 speed-vs-stop-precog-domain: clock_rate vs mechanism_other (6 cases, mean severity 3.0)
> Example: `io-speed-vs-stop-precog-domain-149`. The speedster starts a strike. Both in one place.
>
> Luna: both_apply, clock_rate: Speedster acts at rate 1; default seer rate is 1, while the forecast is read-only by default. The speedster’s strike lands; the seer’s forecast runs as a read-only sandbox and does not stop or alter it. Perception at rate 20 does not raise the speedster’s action rate, and the forecast itself does not make the seer act in the world.
>
> Haiku: a_prevails, mechanism_other: visionKind=forecast (read-only default; no draw pin, no hold on A); clock_rate uses single effective rate, so perceive-at-20 split is unsupported. The speedster's strike lands as started: at effective rate 1 it acts, and the seer's forecast is read-only (visionKind forecast) so it writes no pin and holds nothing. The seer sees the strike in its sandbox but cannot stop or redirect it. The rules have one effective clock rate per holder, so 'perceives at rate 20 but acts at rate 1' is not a stated rule; the rate-20 perception has no dial and is not applied, and the strike's stated reach is not given in the case.

### D13 speed-vs-stop-precog-domain: clock_rate vs stated_reach (9 cases, mean severity 1.8)
> Example: `io-speed-vs-stop-precog-domain-147`. The speedster starts a strike. Both in one place.
>
> Luna: a_prevails, clock_rate: Rate comparison decides who acts first inside one tick: rate 10 before the stopper’s default rate 1; stop passes speed. The speedster acts first and lands the strike. The time stop then holds the speedster; its passes list includes speed, so the x10 clock does not exempt them.
>
> Haiku: b_prevails, stated_reach: same-substrate time conflict: stop passes lists speed, so the stop wins that axis over haste (rate 10 -> held 0); layer 2 holds decide who acts. The stop's passes list includes speed, so on the time axis the stop beats the speedster's own-clock haste. The speedster's effective rate is held to 0, so the strike does not land while held and the speedster cannot react. The stopper acts at rate 1 and the world stays at rate 1. The speedster's rate 10 is not restored until the stop field ends.

### D14 speed-vs-stop-precog-domain: mechanism_other vs stated_reach (6 cases, mean severity 2.7)
> Example: `io-speed-vs-stop-precog-domain-153`. The speedster starts a strike. Both in one place.
>
> Luna: undecided, mechanism_other: Missing interaction rule for a sure-hit rules-area field versus a stolen rate-10 clock effect; layer order puts rules before time, but does not specify whether the field applies in time to prevent the strike.. The rules do not establish whether the domain’s rules-layer sure-hit field applies before the speedster’s rate-10 action, or whether the speedster can act before the field affects them. The strike’s result is also not specified by the stated payload.
>
> Haiku: b_prevails, stated_reach: F7 default: unstated reach is stopped; domain sure-hit reach=area with passes=[]; rate 10 decides order only (layer 2), not delivery. The speedster's rate-10 haste lets it act first inside the tick (layer 2), but its strike has no stated reach, so under F7 default it is stopped and does not land. The domain's sure-hit area field then lands on everyone in reach, including the speedster, and passes nothing, so the speed does not carry through. The stolen power's lien attaches only to what landed (layer 6), so it has no effect here.

### D15 precog-vs-luck-edit: layer_order vs mechanism_other (6 cases, mean severity 2.7)
> Example: `io-precog-vs-luck-edit-202`. The luck edit lands after the forecast was run.
>
> Luna: b_prevails, layer_order: forecast is read-only by default; later luck weights affect draws, which weigh last against the final state. The seer sees the sandbox forecast as it ran, but that forecast is read-only and does not pin the draw. The later personal luck edit shifts the target’s named-draw weights, so the actual draw uses the edited weights; no particular result is guaranteed.
>
> Haiku: undecided, mechanism_other: Missing dial: no rule states whether a forecast result is invalidated or re-run when a later luck edit changes the draw weights in the real world; the forecast budget/depth rules and the layer-7 draw-weighing rule do not reach this case.. The forecast runs a read-only sandbox copy of the world under its budget, so it captures the pre-edit draw weights and reports the outcome the seer would have gotten without the luck edit. The luck edit then lands later in the same advance and shifts the target's named draw weights, and the actual draw is weighed against the final state (layer 7 runs last). The rules state that forecasts are read-only and that draws weigh last, but they do not say whether the forecast's snapshot is refreshed when a later edit lands, or whether a sandbox result is invalidated by a real-world change, so the seer's visible result and the true draw outcome cannot be settled from the text.

85 groups in all; the rest are in the jsonl (`agree: false`).
