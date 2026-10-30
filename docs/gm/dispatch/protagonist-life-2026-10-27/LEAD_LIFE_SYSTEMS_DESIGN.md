# Lead-life systems: top-down design (2026-10-28)

Weibao: "what about top down design for actions, and subtle systems like fights and results, relationships
stuff and other stuff? alot more should be written somewhere". This is that place for the cast-lives work.

**Status: proposal, with section 12 from Weibao's direction of 2026-10-28.** Codes LSD1-LSD440 are this doc's (prefix checked unused). It applies
[WA45](../../../WORLD_ABSORPTION_RULES.md) (top-down calibrated choice systems, proposed) and AD44 (lead first) to
the life of a book's protagonist. It links the owners that already exist and does not restate them; where an
owner and this doc disagree, the owner wins and this doc is corrected. Every line is a default with a dial and
a reason (AD5, AD38). Owner map checked 2026-10-28 against `docs/RULES_INDEX.md` and `src/`.

**Accepted lines (2026-10-29):** [LEAD_LIFE_RULES](../../../LEAD_LIFE_RULES.md) now holds the lines Weibao has accepted, as LSD155 proposed. This doc stays the dated history and the home of proposals; when he accepts a line it moves to that file and this line stays as history.

**Reading guide (2026-10-29):** [LEAD_LIFE_GUIDE](../../../LEAD_LIFE_GUIDE.md) reconciles these lines with the vision, timeline and absorption owners, holds the field-to-system matrix (LSD255), an implementation order and the open contradictions. It is a reading aid, not the accepted-lines rulebook LSD155 proposes.

How it is used: each gap lane brief cites the LSD lines it builds; the be replay (CL269) scores against them;
B1 and D1 build the spine (section 1) first, and every later system plugs into it.

## 0. Design order: top down

| Code | Rule |
| --- | --- |
| LSD1 | **Start from the choices the book shows a person making**, not from meters. For each system, list the decisions the lead and his people make in the slice (go to work or not, pay or borrow, tell or hide, fight or flee), then the state that makes each choice natural, then the actions that change that state. Reason: WA45; bottom-up meters cannot reproduce the book's people |
| LSD2 | **One action loop for everything** (section 1). A new system adds nouns, costs and consequence rules to the loop; it never adds a second loop. Dial: a world mechanism may add a stage (a ritual's preparation) through the CL232 frame |
| LSD3 | **Same loop for the player, the lead as NPC, and the cast** (CLR8). On screen it runs step by step; off screen it settles by outcome (CL216) with the same rules and the same keyed draws |
| LSD4 | **Calibrate against the book** (WA45): in most seeded runs a person in the book's state picks the book's option, and flipping the input the text names flips the choice. The be replay and the null-player run are the calibration harness |
| LSD5 | **Subtle systems are consequence rules, not features.** A fight is mostly what happens after it; a relationship is mostly what it changes in later choices. Each system below lists its consequences first |

## 1. The action loop (the spine)

Every action by anyone passes these stages. Owner and gap per stage.

| Code | Stage | What it holds | Owner today | Gap |
| --- | --- | --- | --- | --- |
| LSD6 | **Situation** | Where, when, who is present, what each knows, what is carried | `cast_schedule.js`, `simulation.js` people and knowledge, presence rules PIR1-PIR25 | The lead's own timetable (duties, meals, shift) as data (LSD43) |
| LSD7 | **Options** | What this person can attempt here and now, with the reason when not (FLR3) | LOTM host command lists; `seat_profiles.js` filters by seat | Options come from hand-listed commands; a means-driven option list (LSD8) is missing |
| LSD8 | **Means** | What the attempt uses: body, skill, item, money, a relation, knowledge, a power | [MEANS_AND_APPRAISAL](../../../MEANS_AND_APPRAISAL.md) (principle accepted, palette proposed) | No runtime owner; means are scattered over `check_*`, `effect_dsl.js` and UI code. Build a small means reader before more verbs |
| LSD9 | **Quote** | Time, money, energy, risk, exposure (who could notice), shown before commit | `wait_until.js` quotes; UR70-UR75 shape | Risk and exposure are never quoted today |
| LSD10 | **Resolution** | Certain actions just happen. Contested or uncertain ones go through `check_resolver.js` with a keyed draw (LSD55) | `check_resolver.js`, `check_contract.js`, `check_odds.js` | Not used by any cast or lead action yet |
| LSD11 | **Outcome tier** | Success, partial, failure, and a twist where the world's mechanism allows; each tier names its consequences | CBR2-CBR3 for fights; nothing general | A general tier table per action kind |
| LSD12 | **Aftermath** | Body, possessions, purse, relations, knowledge for each witness, records and law, schedules, obligations | `simulation_effects.js`, `beat_knowledge.js` (G1), `economy_domain.js`, `story_aftermath.js` | Relations, records and obligations are not written by actions (sections 3, 6) |
| LSD13 | **Report** | What each person perceives, at their witness level (RPT1-RPT12) | Cast host report routes (present, affected) | The witness scale exists only in the cast path; generalize (LSD34) |
| LSD14 | **Follow-ons** | Reactions scheduled for others: a reply, a complaint, a visit, a rumour | Reaction classes (L7), plan section 10.2 | Nothing schedules a follow-on yet |

LSD15. **Build order inside the spine** (proposal): the means reader (LSD8) and the quote's risk and exposure
(LSD9) with D1 (determinism and the lead's resolver), then outcome tiers (LSD11) and follow-ons (LSD14) with
the first gap lane that needs them. Done check for the spine: one ordinary action (paying rent late) runs
all nine stages for the player and settles off screen for an NPC with identical state changes.

## 2. Actions a clerk-lead needs (top down from his week)

Grouped by the decision they serve. "Have" means a runtime path exists in the be or beside life.

| Code | Decision | Actions | Have | Owner or lane |
| --- | --- | --- | --- | --- |
| LSD16 | Where to be | Walk, wait until, stay home, run | Walk, wait (G1) | Cast host; run joins pursuit (`pursuit.js`) |
| LSD17 | Keep the body going | Eat (shared household food), sleep, wash, rest, treat a wound | Sleep (native) | BHR1-BHR30; hunger clock absent (LSD45) |
| LSD18 | Earn and spend | Work a shift, get paid, buy, sell, pay rent and meters, borrow, lend | Native trade | ECR1-ECR33, `economy_domain.js` (the one money seam); wage and rent model absent (LSD40) |
| LSD19 | Deal with people | Greet, ask, tell, lie, persuade, comfort, argue, promise, refuse, apologize, give a gift | Greet only | PIR1-PIR25; relationships (section 3) |
| LSD20 | Handle what others must not see | Hide, search, notice, destroy, clean a trace | None | G2 concealment brief (held), LSD36 |
| LSD21 | Learn | Read, study, ask an expert, write down, remember (flashback replay, CL253) | Partial (native reading) | SLR1-SLR43 |
| LSD22 | Face danger | Avoid, flee, hide, threaten, fight, surrender, call for help | Native combat | Section 4 |
| LSD23 | Seek institutions | Report to police, consult the church, register, appear when summoned | None | Section 6 |
| LSD24 | Use the world's power | The world's own ritual, dream and power verbs | None in the be seat | CL232 frames, ABR1-ABR22; LOTM power lane |

LSD25. **A verb enters only with its consequences.** Each action above is built with its LSD11 tiers and LSD12
writes, or it is not built. Reason: a verb without aftermath is the "renamed meter" FLR4 rejects.

## 3. Relationships

Owners: [WA42](../../../WORLD_ABSORPTION_RULES.md) (relationships from the choices the source shows, Weibao's
"top down" request of 2026-10-27; LSD26-LSD32 apply it), [relationships palette](../../../RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md) RLA-RLI (its F1
finds five separate relationship stores), PIR1-PIR25, `relationship_view.js` (read point),
`obligations_ledger.js` (record shape, not wired), `peer_standing.js`, `reputation.js`, `household_fortunes.js`.

| Code | Rule (default, dial, reason) |
| --- | --- |
| LSD26 | **One bond record per pair, directional**, read through `relationship_view.js`: familiarity, trust, warmth, respect, fear, and role (family, landlord, colleague, superior). Dial: a world adds a dimension (sect seniority, a debt of life). Reason: RL F1's five stores disagree; the lead's family needs one answer |
| LSD27 | **Bonds change only by events with a cause**: help, harm, a gift, a promise kept or broken, a secret shared or exposed, time together, time apart (familiarity fades slowly; trust does not fade by time alone). Each change is dated and points at its event, so the person view can say why |
| LSD28 | **Bonds act through choices, not numbers on a screen**: who greets first, who offers help unasked, who lends, who covers for you, who tells whom. The player reads them as behaviour and in the person view's history (UR70) |
| LSD29 | **Obligations are explicit records** (`obligations_ledger.js`): a promise, a loan, a favour owed, a duty (his brother's expectations). Each has a due time, a holder, and consequences when kept or broken. G4's lane wires them to actions (LSD18, LSD19) |
| LSD30 | **The household is a group with shared purse, food and duties.** Family members draw on and add to it; strain in it (rent due, a lost wage) shows as their choices (eating less, an argument). Owner: `household_fortunes.js` (rules only today) |
| LSD31 | **NPC to NPC bonds exist for the cast** (RLF), from the book's stated relations first, filled by role (CL5) |
| LSD32 | **Calibration** (LSD4): with the book's starting bonds, family members in seeded runs make the book's choices (the sister worries, the brother pays the rent); flip trust and the choice flips |

## 4. Fights and their results

Owners: CBR1-CBR30 in [DOMAIN_RULES](../../../DOMAIN_RULES.md#combat-rules), the
[combat palette](../../../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) CBC-A to CBC-H,
[encounters and pursuit](../../../ENCOUNTERS_AND_PURSUIT.md), BHR17 states; `combat_math.js` (damage order,
caller owns draws), `defeat_domain.js`, `pursuit.js`; L2c's conflict contracts and after-actions
(`scripts/lead_run/`) as book data.

| Code | Rule (default, dial, reason) |
| --- | --- |
| LSD33 | **A conflict is a ladder, not a mode**: avoid, talk down, threaten, scuffle, weapon, lethal. Each rung is a choice for every side with its own costs, and most of an ordinary life's conflicts stop on the first two rungs. Dial: a world's violence norm. Reason: a clerk's book life has few fights and many near-fights |
| LSD34 | **Results beyond health** (in this order of how often they matter): fear and shaken nerve, flight, injury with a place on the body and a recovery time (BHR), lost or broken possessions, capture, death. Then the social results: witnesses and what each saw (witness scale: present and saw, present and heard, affected, told later), noise that draws a crowd or police (LSD37), relation changes for everyone involved, and a record if an institution learns of it |
| LSD35 | **Fights off screen settle by contract outcome** (L2c contracts, CL216) with the same results table, so a cast member can come home injured and the household reacts |

## 5. Knowledge, perception and secrets

Owners: AD6-AD9, [world secrets](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md), `people_knowledge.js`,
`world_knowledge.js`, `beat_knowledge.js` (G1), `observation_channels.js`, `information_freshness.js`.

| Code | Rule |
| --- | --- |
| LSD36 | **Every knowledge entry has a source, a date and a confidence**; lies are entries with a false value and their teller as source. Concealment (G2) is an action against noticing; a find writes knowledge for the finder only |
| LSD37 | **Rumour travels along bonds** with delay and loss: each day a fact may pass to a person's close bonds, keyed draw per edge and day (LSD55), fidelity dropping per hop. Dial per world (village gossip fast, city slow). Gap: no propagation code exists (only E3 in [emergent systems](../../../EMERGENT_SYSTEMS.md)) |
| LSD38 | **The be seat names people from his knowledge** (CL238); things he does not know stay masked even when the book pack has them |

## 6. Law, institutions and records (largest gap)

Owners: ECR20-ECR23 (institutions and credit), ECC-F in the
[economy palette](../../../ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md). No runtime owner for police, crime
or records; `life_record.js` is a biography, not a legal record.

| Code | Rule |
| --- | --- |
| LSD39 | **An incident becomes a case only through someone telling an institution**: a witness reports, a victim complains, police notice noise (LSD34). The case holds what the institution knows (LSD36), not the truth. It can lead to questioning, a summons, a search, an arrest, or nothing. Dial: the world's policing density and corruption. The church and the city's watch are each a world's institution rows over one shared frame (CL232) |

## 7. Work, money and the household

| Code | Rule |
| --- | --- |
| LSD40 | **A wage, rent and price model for a person's week**: pay day and amount from the source, rent due date, the cost of bread and fuel, all through `economy_domain.js` (ECR16 one money seam). Missing a shift costs the wage; late rent strains the landlord bond (LSD27) and later the household (LSD30). Second case: any world's ordinary job |
| LSD41 | **Metered utilities and shared food** stay folded into routine (CL215) unless they change something: no gas means no light at night (reading stops), an empty larder means someone eats less |
| LSD42 | **NPC purses inside the player's footprint** move with their own trades (CL216) |

## 8. Body, time and routine

| Code | Rule |
| --- | --- |
| LSD43 | **Every person has a daily timetable** (shift, commute, meals, sleep) from the book or filled by role. The lead's is his duties list in the be seat and feeds "Wait until" (CO1). Owner: `cast_schedule.js` |
| LSD44 | **Waiting, sleeping and working jump time between events**, never minute by minute (G1's boundary walk; CO3 profiles the remaining cost) |
| LSD45 | **Hunger and fatigue are slow clocks that shape choices**, not death timers (BHR, no hunger death): tired lowers checks, hungry makes food choices urgent. Gap: no hunger or fatigue clock in `src/` |

## 9. Subtle interactions to model (chains the systems must allow)

Each chain is a test scenario for the spine; none needs a special case.

| Code | Chain |
| --- | --- |
| LSD46 | Injury in a street fight, then a missed shift, then a lost wage, then late rent, then the landlord's coldness, then the family economizing |
| LSD47 | A scuffle's noise, then a constable's notice, then a summons, then the employer hearing of it, then standing at work drops |
| LSD48 | A hidden item found by family, then trust falls, then questions at dinner, then a lie (a knowledge entry) that later must hold |
| LSD49 | A promise to a friend, then a scheduling conflict with a duty, then one broken obligation and its bond cost |
| LSD50 | Fatigue from night work, then a failed check at the day job, then a reprimand |
| LSD51 | A rumour about the lead reaching the market, then a vendor's price or manner changing (reputation through `reputation.js`) |
| LSD52 | A gift that costs a day's food money, then warmth up with the recipient and strain at home |
| LSD53 | A cast member's off-screen fight result (LSD35) changing what they say and do with the lead the next day |
| LSD54 | The lead diverging from the book at one step, then the cast's dependent beats resolving by motive (CL262, D1) |

## 10. Determinism (keys per system)

Owners: GR1-GR17 ([generation foundation](../../../GENERATION_FOUNDATION_RULES_2026-10-14.md); GR2 draw
identity), `hash_rng.js`, `seeded_streams.js`, `keyed_generation.js`, `check_resolver.js`.

| Code | Rule |
| --- | --- |
| LSD55 | **Every draw is keyed by the life's world seed, a stream name and its subject**, never by call order. Streams proposed: `check:<actor>:<action>:<target>:<minute>`, `fight:<encounter>:<round>:<actor>`, `notice:<container>:<person>:<day>`, `rumour:<fact>:<from>:<to>:<day>`, `choice:<person>:<decision>:<day>`. Reason: the same life with the same actions gives the same result (CL260); reload never rerolls |
| LSD56 | **The lead as NPC and every cast member choose by the same resolver** (CL262): the book's choice while their state matches the book's; otherwise utility over needs and motives plus a keyed roll for close calls, with the reasons stored |
| LSD57 | **Divergence is logged** (WA15, CL150): what happened that the book never showed, why, and which choice caused it. The log is the reading surface for "what did the world do on its own" |
| LSD58 | **Replay identity is a test**, not a hope: two runs of the same life with the same actions compare byte for byte (L5r already does this for its runs; B1 adds one for the be seat) |

## 11. Lanes this implies (proposals, ordered by the be replay)

Under CL268 the be replay decides when each runs; this list gives each a ready scope.

| Code | Lane | Model, effort | Done check |
| --- | --- | --- | --- |
| LSD59 | **D1 spine**: means reader (LSD8), quote risk and exposure (LSD9), keyed resolver for the lead and cast (LSD55, LSD56), divergence log (LSD57) | Sol, medium | Paying rent late runs all nine stages for the player and settles identically off screen; a one-step divergence resolves dependent beats by motive, identically in two runs |
| LSD60 | **Then, as the be replay reaches them**: R1 one bond record and cause-dated changes (LSD26-LSD29, absorbing the five stores); E1 wage, rent and household (LSD30, LSD40); K1 witness scale and rumour (LSD34, LSD37); LW1 incidents, cases and institutions (LSD39); N1 hunger and fatigue clocks (LSD45); F1 conflict ladder and results (LSD33-LSD35); G2 concealment | Sol for R1, K1, LW1, F1; Luna for E1, N1 | Each closes named be-replay steps (CL275) and passes its chain in section 9 |

## 12. Canon results in the lead's run, reconciled (Weibao, 2026-10-28)

Weibao: "For fights and results, we can implement the chain of events as it happens in the book, but adapt it to
our systems? ... the result should match cannon, but there is the possibility for it not to with external
interferecne ... Just implement accordingly to book for the main character run" (recorded in
[USER_VISION](../../../USER_VISION.md), "Cast lives: fights and results follow the book in the lead's run").
He then noted this was already designed. **Reconciled 2026-10-28 against the owners**: most of it is existing
direction, and this section now points at them. A first draft of this section (commit `bc9f2fba3`) proposed
disabling the book's untaken moves and forcing the canon tier as a new rule; both were wrong against accepted
owners and are corrected below.

Earlier words this rests on: "Canon should follow its natural course unless we change things?" (OD7,
2026-10-15); "Cannon might have a reason to fix itself, like heavenly will, fate" (OD8); "Can things be biased to
occur in certain ways and be harder to change, by virtue of fate?" (cast-lives round 3, CL21-CL23).

| Code | Line | Owner it applies | Status |
| --- | --- | --- | --- |
| LSD61 | **The lead's run pins the book's route.** A canon fight or result runs the book's chain of steps through our systems, step by step, with ordinary controls | [WA32](../../../WORLD_ABSORPTION_RULES.md)'s own dial ("a world may pin a route when the source makes the route itself the point"), set by the 10-28 direction for the be seat | Applies WA32; the step runner is new build (section 13) |
| LSD62 | **The canon result holds in three layers**: our bands are calibrated until they reproduce it (WA33); people steer toward what their plans depend on (CL21 causal mass); and in the lead's run, while the inputs the result depends on match the book, the run returns the canon tier as a play dial named **book fidelity**. It is not an in-world fate claim; a world's own fate mechanism stays CL22's job | WA33, CL21, CL22; resolution through `check_resolver.js`, settlement through `beat_records.js` (`carried` when needs match) | The book-fidelity dial is new |
| LSD63 | Variance only in what the book leaves open, bounded by forward anchors; add injuries and items to the anchor lint | WA24, WA37, CL9, GR2, CL49 | Same idea; lint extension new |
| LSD64 | **Fidelity strain**: for each pinned result, how often the unpinned model reaches the canon tier. High strain means the bands are wrong; fix them (WA33), never hide it | WA33, WA45 calibration (book's option wins k of N), CL7 | Same test; the logged table is new |
| LSD65 | *(Narrowed for the canon run by LSD103, Weibao 2026-10-28: locked there, playable in the open run.)* **Untaken options stay possible** (corrected): the moves the book did not take are offered at their WA28 rung (a stub with cost, requirement and a plain result, or a gap row). Choosing one changes the inputs, so the pin releases and our model resolves it, with CL21's causal mass still pulling the cast's plans; the run logs it as divergence (WA15, CL150). Reason: OD7, the player's own choice is "we change things", not outside interference | WA28, CL11, CBR30, CL263 | Same idea (replaces the first draft's "disabled") |
| LSD66 | The same pin covers every canon result: a questioning, an interview, an argument's outcome, a recorded purchase | WA32 (fights, chases, standoffs, questioning, contests), WA35, CL257 | Same idea |
| LSD67 | Off-screen canon fights settle by contract outcome on their days | CL6a, CL8, CL216, L2c data | Same idea; the settle step is new build |
| LSD68 | Results never leak sealed truths; each witness gets their level | AGENTS sealed secrets, RPT2, SUI3 | Same idea |
| LSD69 | **External interference is deferred.** Changes that reach the lead's run from outside it (another seat, a crossing) are logged as "divergence pending" with the differing inputs; a later D2 lane resolves them by mechanism (CL22, CL262) | WA15, CL150, CL262 | New log; the resolution is deferred by Weibao's words |
| LSD70 | The be replay asserts canon results in two identical runs and prints the strain table with the fidelity score | CL165, CL169, CL179, CL260 | Same idea plus the table |

## 13. Combat for book fights: what to improve, and what not to abstract

Today's combat core is the original idle auto-battler: `combat_math.js` (hit chance from attack against evasion,
damage rolls whose random source defaults to unseeded, attack timing), `combat_stances.js`, `defeat_domain.js`
(outcomes such as yielded, captured, escaped), `pursuit.js`. It has no moves, ranges, means or positions. The
book's data is outcome-level: L2c contracts hold sides, stakes, means, terrain and outcome facts (5 candidate
contracts in LOTM chapters 1-24 after P1's selector fix), and the steps live in the merged scenes.

| Code | Proposal (default, dial, reason) |
| --- | --- |
| LSD71 | *(Superseded by LSD81: adjust the saved-battle family instead.)* **Two engines, one damage core.** Keep the auto-battler for idle and grinding content; add a step-based conflict frame for life and book fights. Both call `combat_math.js` for damage and mitigation, so numbers agree. Reason: rewriting upstream combat risks every existing world; the life fights need steps the auto-battler cannot express |
| LSD72 | **Seed every draw in the frame** through `seeded_streams.js` keys (LSD55); `combat_math.js` already lets the caller pass the random source, so the frame passes a keyed one |
| LSD73 | **A small move vocabulary over means**: approach, keep distance, strike, shoot, block, dodge, grapple, disarm, use an item, use the surroundings, use a power (ABR seam), call out, threaten, yield, flee, hide, finish. Each move reads its means (LSD8) and writes the LSD34 results. Dial: a world adds moves through rows (CL232 frame) |
| LSD74 | **Range bands and position, not a grid**: touching, close, across the room, out of sight; cover and light as place facts. Reason: enough to express a revolver against a knife and a dark alley, cheap to show at 1920×1080 |
| LSD75 | **Morale and fear are the first results**, before health: a clerk's fights mostly end by fear, flight or yielding (CBR2 outcomes already list these) |
| LSD76 | **Three detail tiers; abstract only the first two.** Structural (who, means, order, outcome) is always modelled. Tactical (range, cover, surprise, wound location) is modelled where the move vocabulary reaches. Texture (exact words, sensations, the book's choreography beyond the moves) is not abstracted: it shows as the book pack's text for that step in the lead's Reports, private, never in public code |
| LSD77 | **A step the vocabulary cannot express is a narrated step**, played as the book's step with its effects and a "narrated" label, and run through the fold-loss test (CLR6): if it loses a choice, an input, a witness or an outcome, it is a gap row and becomes build work. Reason: Weibao's worry that much detail is hard to abstract; this keeps the book run playable now and turns each hard detail into a measured gap instead of a guess |
| LSD78 | **Time inside a fight is seconds**, outside it minutes: a fight runs as its own short sub-clock and charges the game clock once at the end (no second clock in the save, AR3) |
| LSD79 | **What the lead knows about the opponent** comes from appraisal levels (MEANS_AND_APPRAISAL); unknown powers show as effects, not names (sealed secrets) |
| LSD80 | **F1 lane scope** (Sol, medium, after D1): the conflict frame with LSD71-LSD79 for the first canon fight the be replay reaches, its narrated-step folds counted, two identical runs, strain logged. Done when that fight replays through ordinary controls to the canon result and every narrated step is in the gap ledger |

## 14. More to consider: adjust the combat we have, stay adaptable, an intuitive screen, tuning, readers (2026-10-28)

Weibao: "Consider considerations on how to adjust the combat system instead? There will be mroe gaps in the future
... we might need the system to be adaptable and changable for the future too? ... How to design an intuitive UI
for such possibilities ... it might be hard to tune, do we need to change the Dispatch script/readers or can we
work with what we have got". Evidence read: [C1 owners and engine](../combat-2026-10-18/C1_OWNERS_AND_ENGINE.md)
(seams C1-E1 to C1-E21), `src/native_battle.js`, `src/defeat_domain.js`, [schema card](SCHEMA_CARD_1_3.md).

### 14.1 Adjust, not add (supersedes LSD71's "two engines")

The game already has two combat paths. The real-time auto-battler (`models/combat.js`) has an exchange host
(`runP23CombatExchange`), a tactics hook (`combatOptions`) and a defeat hook (`encounterHooks.planDefeat`). Beside
it sits a family of **saved battles**: the road duel (`native_battle.js`), the party battle (`party_battle.js`) and
the sluice battle (`feature_expansion_battle.js`). These are turn-based, plan-based (pure plan, effects through
`simulation_effects.js`), seeded, validated by contracts, and end in won, lost, withdrew, yielded, escaped or
objective. `defeat_domain.js` is the shared outcome publisher the C1 audit proposed (C1-S1).

| Code | Consideration | Disposition |
| --- | --- | --- |
| LSD81 | **Grow the saved-battle family into the conflict frame**; do not write a second engine. The three hand-built battles become three data definitions over one runner (sides, objective, moves, stop rules, results), and canon fights are more definitions. The auto-battler stays for idle zones and later borrows moves through its existing tactics hook. Reason: everything the frame needs (plans, seeds, contracts, outcome publisher) exists in the saved battles; only their per-encounter code is the obstacle | ACCOUNT FOR NOW: F1's scope (LSD80) becomes "generalize the saved-battle runner, then port the road duel as its first definition with identical results" |
| LSD82 | **Port before extending.** The first F1 commit changes no behavior: the road duel, party battle and sluice battle replay to byte-identical results through the general runner. Only then do moves, ranges and morale arrive | ACCOUNT FOR NOW: F1 done check |
| LSD83 | **Keyed draws in the runner.** Saved battles seed one stream from the save's seed and sequence; the runner keys each draw by battle, round, actor and move (LSD55), so adding a move to a fight does not reshuffle every later roll in it | ACCOUNT FOR NOW |
| LSD84 | **Close the C1 audit's open steps through the runner** (C1-S3 to C1-S8: wear on swings and blocks, flee with a cost, pursuit after flight, a subdue option, opponent display by what you know). They were sized for this exact seam | LATER/DELEGATE: after LSD82, in ranked order S3, S2, S8, S4, S7, S5, S6 |

### 14.2 Built to change: future gaps should mostly be data

| Code | Consideration | Disposition |
| --- | --- | --- |
| LSD85 | **Moves are rows, not code**: id, means needed, range bands allowed, cost, check profile for `check_resolver.js`, effects as existing `simulation_effects.js` operations, results it can publish, and its perspective and audience tags (C1, S1). A new move from a new gap is a row when existing effect operations cover it; code only when it needs a new operation, and that operation enters only with a second consumer (FND5) | ACCOUNT FOR NOW: F1's move format |
| LSD86 | **Everything a fight reads is a named input**: bands, gear, wounds, morale, light, cover, appraisal level, relations (a friend pulls punches). The runner never reads a global, so a new system adds an input and a rule instead of patching the fight (AR3, AR14) | ACCOUNT FOR NOW |
| LSD87 | **Conflict, not combat**: the same runner serves a chase, a standoff, a questioning, a haggle or a contest of wills, which differ in moves and stop rules (WA32 already names them all). Reason: future gaps will mostly be non-violent conflicts in a clerk's life | ACCOUNT FOR NOW |
| LSD88 | **Gap rows point at the frame**: each new conflict gap in the ledger records whether it needs a move row, a new input, a new effect operation or a new stop rule, so its cost is known before a lane is briefed (CL273 stubs read it) | ACCOUNT FOR NOW: gap ledger field |
| LSD89 | **A frame registry entry in SYSTEMS_REGISTER** (CL235): the conflict frame, its fields, the worlds using it and its tags, so later worlds extend it instead of building their own | LATER/DELEGATE: with F1 |

### 14.3 An intuitive screen for many possibilities (target 1920×1080; UR1-UR75, SUI1-SUI19)

| Code | Consideration | Disposition |
| --- | --- | --- |
| LSD90 | **Turn-based by default in life fights**: the fight waits for the player between steps; the auto-battler's real-time loop stays for idle zones. Reason: a life fight is a few decisive choices, not a damage race, and a waiting fight is also trivially savable mid-step | ACCOUNT FOR NOW |
| LSD91 | **A situation card first**: where everyone is (range band), cover and light, what you can see of each opponent at your appraisal level (effects, not hidden names), your body and nerve, and what is at stake. Everything else is secondary | ACCOUNT FOR NOW: F1 UI |
| LSD92 | **Few choices up front, all choices one step away** (UR42): show the three to five moves that make sense now, grouped as Act, Move, Use, Talk, Leave; the rest sit in a "More" group and the command palette. Each shows its effect first, its cost and a risk band (likely, even, unlikely) rather than raw percentages; exact odds sit behind the appraisal level that would know them | ACCOUNT FOR NOW |
| LSD93 | **"As the lead would" is one button**: the lead-as-NPC policy (CL262) plays the next step or the whole fight. It serves players who do not want tactics, the idle game's away time, and the replay; in the be seat it plays the book's route. Dial: whether the book's next move is marked in the list, off by default because it spoils the book for anyone who has not read it | ACCOUNT FOR NOW; the marker dial is Weibao's later call |
| LSD94 | **A result screen that explains**: what happened, why (the inputs that decided it), what it cost, who saw it, and what follows (injury days, a summons, a relation change), with each line in the Reports at its witness level | ACCOUNT FOR NOW |
| LSD95 | **One screenshot per new panel or state** (CL228) and the populated fight screen in the real app before F1 is done (PRF7, AD34) | ACCOUNT FOR NOW |

### 14.4 Tuning without hand-tuning

| Code | Consideration | Disposition |
| --- | --- | --- |
| LSD96 | **Calibrate, do not tune by hand.** A calibration script runs each canon conflict N seeded times unpinned and searches the people's band offsets, within each band's allowed width (WA33), until the canon tier wins in k of N and flipping the input the text names flips it (WA45). It prints the offsets it chose and their evidence; a human only reviews outliers | LATER/DELEGATE: C2 lane (Luna medium) after F1; done when the road duel and the first canon fight calibrate inside their bands |
| LSD97 | **Relative bands, few stats**: fights compare bands between the people involved (trained against untrained, armed against unarmed), not absolute numbers, and read only the stats a move uses. Qualities no move reads stay words (WA33). Reason: fewer knobs, and a world's scale does not leak into another's (CX guardrails) | ACCOUNT FOR NOW |
| LSD98 | **The book-fidelity pin buys time.** While calibration is incomplete, the pinned canon result keeps the lead's run correct and the strain table (LSD64) shows which fights still need calibration, worst first | ACCOUNT FOR NOW |

### 14.5 Readers and the dispatch: keep them, add one narrow pass

| Code | Consideration | Disposition |
| --- | --- | --- |
| LSD99 | **Keep the batch readers and schema as they are.** Schema 1.4 already gives steps with verb, class, inputs and outputs, the conflict block (sides, stakes, means, terrain, outcome, unseen), and taken and untaken options with needs, which is what the frame consumes. Fights are rare in a clerk's chapters (5 candidate contracts in LOTM chapters 1-24), so widening every reader prompt would spend tokens on every chapter for a few scenes | ACCOUNT FOR NOW |
| LSD100 | **One targeted fight-detail pass** over conflict scenes only (Sonnet, a few scenes per book): per step, who acts on whom with what, range and cover cues, wound locations, morale cues, and each participant's stated strength or skill claims as evidence for bands. It reads paragraphs through `cite_paragraphs.mjs`, writes rows to the book pack, and passes CLR1 (implement from the paragraph). Reason: calibration (LSD96) needs claims the batch readers do not extract, and only for these scenes | LATER/DELEGATE: FD1 lane before F1's first canon fight; done when the first canon fight's steps each have a move-level row with a locator |
| LSD101 | **Stat claims across the whole slice** (not only fights: "a strong dock worker", "a trained officer") would help every system's calibration. Default: collect them in the same FD1 pass for the people who appear in conflict scenes; widen to everyone only if calibration shows the gap | LATER/DELEGATE |
| LSD102 | **No dispatch change for MoL or later books until FD1 proves the row shape on LOTM**; then the pass joins `world_lead_pipeline.mjs` as an optional stage | LATER/DELEGATE |

### 14.6 Lane changes

F1 becomes: generalize the saved-battle runner and port the three battles unchanged (LSD81-LSD83), then moves as
rows, range bands, morale and the situation card for the first canon fight the be replay reaches (LSD85-LSD95).
New: FD1 fight-detail pass (LSD100), C2 calibration script (LSD96). D1 keeps the book-fidelity pin and the
strain table. Order under CL268: B1, D1, FD1, F1, C2, as the be replay reaches each.

## 15. The canon run is forced; a representation for it (Weibao, 2026-10-28)

Weibao: "For the cannon run it should be forced to run the cannon way unless external factors influence it in some
way, thoughts? Should we implement a new way of representing stuff and more? ... we can finetune to text. but we
should condsider everything comprehensively". This sets the run's mode: in the canon run the lead's own choices are
the book's, and only factors from outside his canon life can bend it. It narrows LSD65 for the canon run; WA28's
untaken options stay recorded and become playable in a later open run (LSD104).

### 15.1 Run modes as one dial

| Code | Line | Disposition |
| --- | --- | --- |
| LSD103 | **Canon run (default for the be seat)**: the lead's decisions are the book's; canon results hold; the book's untaken options are shown locked with the reason "Not how it happened" (they exist as WA28 records, so the open run needs no new data). Only an external factor (LSD110) can change a canon fact | ACT NOW: direction recorded; B1, D1 and F1 briefs carry it |
| LSD104 | **Open run (later)**: the same records with the locks off; the book's pull becomes a weight (CL21 causal mass, CL22 where a world names fate) instead of a hard constraint. One representation, three settings: hard (canon run), weighted (fate), none (free) | LATER: after the canon run reaches chapter 24 |
| LSD105 | **The mode is a property of the life**, chosen at the start and shown in the life's header; switching starts a new life (CL227). Save: one additive field beside `entryProfile` | ACCOUNT FOR NOW: B1 |

### 15.2 A new representation: canon as constraints over the life, not a script

| Code | Line | Disposition |
| --- | --- | --- |
| LSD106 | **Each canon fact is a constraint**: who, what, when (a window, not an instant), where, and the state it needs and produces, with its locator. The engine runs freely and is conditioned on the constraints: where nothing is constrained, our systems decide; where a constraint applies, the outcome is the canon one. Reason: a script breaks on every unplanned minute; constraints let the world live between the book's moments | ACCOUNT FOR NOW: D1 builds the constraint store over existing beats, anchors and contracts (no second store, AR3) |
| LSD107 | **Conditioned draws, not forced results**: a constrained roll draws only from the outcomes consistent with canon (a keyed draw mapped into the canon range), so details still vary and every result is one our model could produce. The unconditioned chance of the canon outcome is the strain (LSD64). Deterministic by key, no retry loops | ACCOUNT FOR NOW: D1 |
| LSD108 | **Every fact carries its provenance**: `canon` (stated with a locator), `canon-derived` (follows by rule), `fill` (by role, with basis), `emergent` (the world did it), `divergent` (an external factor caused it). The person view, Reports and the inspector can show where anything came from, and fine-tuning to the text starts from the `fill` and high-strain rows | ACCOUNT FOR NOW: D1 field on knowledge, beat and fact writes |
| LSD109 | **Canon needs are reservations**: what a later constraint needs (the rent money on the day, the revolver in the drawer, being at the office by eight) is reserved, so a free action in between that would spend it is refused with the reason ("You need this for the rent on the 3rd" in his voice, or "Not how it happened"). Reason: free time between the book's moments is the player's, but cannot quietly break the book | ACCOUNT FOR NOW: D1, with the action loop's quote stage (LSD9) |

### 15.3 External factors

| Code | Line | Disposition |
| --- | --- | --- |
| LSD110 | **What counts as external**: an action by another seat's player or a traveller from a crossing, a world event or mechanism the book never shows (CL22 fate, a power), a cheat or debug write, and a world rule the engine models that the book contradicts (logged, not applied, in the canon run). Not external: our own dice (they are conditioned), the cast's off-book filler actions (they are constrained by the same reservations), the player's pace, attention and flavour choices | ACCOUNT FOR NOW |
| LSD111 | **An external change is a perturbation record** with its source, and it follows causal links: every constraint whose needs it touches becomes `contested`. A contested constraint resolves by mechanism (D2: the motive resolver, CL262, and the world's fate dial); the rest of canon holds. Reason: one outside push should bend what it reaches, not unpin the whole book | LATER/DELEGATE: D2 (deferred by Weibao) |

### 15.4 What the player does in a forced run

| Code | Line | Disposition |
| --- | --- | --- |
| LSD112 | **Pace and attention**: when to step, wait or skip to his next moment; which of the cast's days to follow in Reports | ACCOUNT FOR NOW |
| LSD113 | **Free time between constraints**: anything his day allows that keeps the reservations (eat, read, walk, talk, small purchases). This is where the life-sim lives in a canon run | ACCOUNT FOR NOW |
| LSD114 | **Flavour inside canon**: word choices, small courtesies, which canon-consistent way a step is done (two routes that both arrive on time). Recorded, never contradicting a canon fact | ACCOUNT FOR NOW |
| LSD115 | **Canon steps run by "as the lead would"** (LSD93) or one click per step, with the book's own text for the step in his Reports (local book pack, private) | ACCOUNT FOR NOW: F1 and the be replay |
| LSD116 | **His plans show as his intentions, not as the book's future**: he knows he plans to go to the market tomorrow; he does not know what happens there. Reason: the canon run should not read like a spoiler list, and his knowledge record is the limit (CL238) | ACCOUNT FOR NOW: B1 |

### 15.5 More subtleties

| Code | Line | Disposition |
| --- | --- | --- |
| LSD117 | **Windows, not instants**: the book rarely gives exact times; constraints hold a window and the engine picks the moment by keyed draw inside it, so two runs of the same life agree and two lives may differ in minutes (CL260, CL261) | ACCOUNT FOR NOW |
| LSD118 | **Inner life is canon too**: what he thinks, fears and decides (the book's inner monologue) becomes dated knowledge and intention entries, shown to the player as his thoughts; this is how the canon run feels like being him | ACCOUNT FOR NOW: B1 history and D1 |
| LSD119 | **Knowledge arrives on canon time**: what he learns, he learns when the book says, through the step that taught it; filler cannot teach him a canon fact early | ACCOUNT FOR NOW |
| LSD120 | **Off-screen canon holds for everyone**: the cast's book beats are constraints too; their filler lives fit around them under the same reservations (LSD109) | ACCOUNT FOR NOW |
| LSD121 | **Gaps between the book's facts are filled by mechanism and labelled `fill`** (CL5); a fill can never contradict a later constraint (the forward-anchor lint grows to cover reservations) | ACCOUNT FOR NOW |
| LSD122 | **Fine-tune to the text, in order of strain**: the strain table and the `fill` rows rank where text detail is missing; FD1-style narrow passes (LSD100) go there first. Reason: comprehensive without rereading everything | ACCOUNT FOR NOW |
| LSD123 | **The null-player canon run is the regression**: "as the lead would" for every step, no input, must reproduce every canon fact in two identical runs; a canon run with player input must agree on every canon fact and may differ only in `fill`, `emergent` and flavour | ACCOUNT FOR NOW: be replay receipt |
| LSD124 | **Contradictions inside the book** (a date that does not fit, an amount that changes) are recorded with both locators and one chosen reading; the canon run uses the chosen reading and logs it (the L5r replay already found one ordering conflict) | ACCOUNT FOR NOW |
| LSD125 | **Scale**: a volume holds hundreds of constraints; the store indexes them by actor, window and needed state so a free action checks only the reservations it touches | ACCOUNT FOR NOW: D1 |

### 15.6 Lane changes

D1 now builds: the constraint store over existing beats, anchors and contracts (LSD106), conditioned keyed draws and
the strain table (LSD107), provenance on writes (LSD108), reservations with refusal reasons (LSD109), and the
life's run mode field (LSD105). B1 gains the run-mode default and intentions as his plans (LSD103, LSD116). D2 holds
perturbations and contested constraints (LSD111), still deferred.

## 16. Everyone else: depth by tier, a path for everyone (Weibao asked 2026-10-28; proposal)

Weibao asked whether people other than the lead need full lives, given how little the book says about most of
them, and whether everyone should have a set path that opens up when someone plays them. Answer: everyone gets a
life, but "life" means two separate things, and only one of them is expensive. Tiers already exist (WA43, CL250);
this section says what each tier simulates and how a person moves between them.

| Code | Line | Disposition |
| --- | --- | --- |
| LSD126 | **Two layers of life.** The *mechanical* layer (where they are, what they need, their schedule, money, bonds) is cheap if it updates only at schedule boundaries (SZ6), so everyone at role tier and above has it. The *inner* layer (motives, plans, memories of events, opinions of the lead) is expensive to run and to fill without text, so it belongs to principal and recurring tiers and to anyone promoted | ACCOUNT FOR NOW: pack regeneration brief (SZ3) |
| LSD127 | **Everyone has a canon path, at whatever density the book gives.** A person's book facts are constraints exactly like the lead's (LSD106, LSD120); a minor person may have three. Between them, role fills from the world's hours table and archetypes (CL5, CL109). Same machinery, fewer pins | ACCOUNT FOR NOW: D1 builds one store for all actors |
| LSD128 | **Thin canon is open by itself.** Where the book pins little, most of a life is `fill`, and fills are free within reservations. Playing a minor character in the canon run therefore feels open with no new rule; playing the lead feels forced because the book pins him tightly. The dial stays the same; density decides the feel | ACCOUNT FOR NOW |
| LSD129 | **Playing someone makes them a seat's lead.** Taking a person's seat promotes them to principal for that life: their book facts lock in the canon run, their fills become the player's choices, and they gain the inner layer from their history rows. The original lead's canon stays a constraint on them (they are still where the book puts them when they meet him) | LATER: after MoL, a seat-any-person lane (Sol medium); done when a recurring person's be life starts with their own history and keeps every shared scene |
| LSD130 | **Attention promotes, absence compresses.** A person moves up a tier when the lead (or player) meets them repeatedly, owes or is owed, or shares a secret; long absence compresses them back to schedule-boundary updates, keeping what was already established. Thresholds are world dials (WA43 "by play") | ACCOUNT FOR NOW: D1 tier field; thresholds per world |
| LSD131 | **Generate on contact, then keep it.** Unobserved detail (what a neighbour did last Tuesday, a clerk's family) is not simulated ahead; when the lead first asks or sees, it is drawn by keyed draw (world, person, date, subject) so it is the same every run, then written once and kept. It may never contradict a later constraint (LSD121's lint) | ACCOUNT FOR NOW: D1 |
| LSD132 | **The crowd is not individuals until touched.** Street, market and church crowds are drawn per place and hour; a crowd member the lead talks to, trades with or hurts gets an id and becomes role tier, written once (SZ2 keeps them in the save as a delta) | ACCOUNT FOR NOW |
| LSD133 | **Fill quality comes from roles, not invention.** A role fill reads the hours table, the role's duties (a constable patrols, a landlord collects), the person's known bonds and the economy; when a role has no data the fill stays plain and labelled rather than inventing drama. Reason: invented drama for a thin person reads as noise and risks contradicting a later chapter | ACCOUNT FOR NOW |
| LSD134 | **Off-page canon is retroactive canon.** When a later chapter reveals what someone was doing earlier, that becomes a constraint with a past window; any fill already written that contradicts it is flagged in the strain table for the next pack build, not silently rewritten in a live save | ACCOUNT FOR NOW: pack regeneration and D1 |
| LSD135 | **Emergent stories come from the mechanical layer.** Cheap lives for many people make the town feel alive (who moved, who argued, who is short of money) without inner monologue for each; the journal and Reports surface only what the lead could perceive (CL31 rumor speed) | ACCOUNT FOR NOW |
| LSD136 | **Cost check per tier.** Budget: principal and recurring, full both layers (about 30-50 in LOTM volume 1); role, mechanical only (most of the 270); crowd, drawn per hour. Done check for the pack regeneration: a book week with all tiers loaded stays under today's per-minute cost after the CO3 fix, and the save grows only by deltas | ACCOUNT FOR NOW: SZ2, SZ6 |
| LSD137 | **Is everyone at full depth optimal?** No, by default. It costs time and save size, and with little text it mostly produces confident filler that later chapters contradict. Dial: a world with rich ensemble text (or a player who seats many people) can raise more people to full depth; the tier rules make that a per-world setting, not a rewrite | Default proposed |

## 17. Engine implications and the long term (Weibao asked 2026-10-28; proposal)

Grounded in the engine as it stands on 2026-10-28: the clock is `update_timer` inside the 10,085-line
`src/main.js`; native NPC bodies come from upstream `NPC`/`NPCRegistry`; the LOTM cast host is 287 lines in
`src/book_world_lotm_cast_host.js`, with a separate MoL host; draws go through `src/seeded_streams.js` (a frozen
`STREAMS` list, keyed `unitDecision`/`streamSeed`, and ordinal `nextOrdinal`); a LOTM save asserts `schema===1`,
the EPUB source hash and a fixed profile list (`src/book_world_lotm_state.js`). Direction check: AD44 asks that
everyone the lead touches lives their schedule and arc; AD33 deprioritizes NPC-heavy work. Section 16's tiers
satisfy both: everyone lives at the mechanical layer, and inner lives stay few.

### 17.1 Engine

| Code | Line | Disposition |
| --- | --- | --- |
| LSD138 | **One scheduler of wake times.** Replace "every system every minute" for cast people with a queue of next-wake times per actor (schedule boundary, beat window, need threshold, constraint window). G1's `nextBoundary` is the precursor; natural play, waiting and sleeping all advance to the next wake. This is the fix for CO3 and SZ6 and the precondition for 270 people | LATER/DELEGATE: Sol medium after B1, before the pack rebuild; done when a 349-minute wait runs under 3 s with the full volume 1 cast loaded and natural play keeps its rate |
| LSD139 | **Keyed draws only for cast and generated detail; never ordinal.** `nextOrdinal` depends on evaluation order, so with lazy generation (LSD131) and a wake queue, ordinal draws would change with play order. Every cast and on-contact draw uses `unitDecision`/`streamSeed` keyed by world, actor, date, subject and pack revision | ACCOUNT FOR NOW: B1 (in flight), D1 brief line; a review grep for `nextOrdinal` in cast code |
| LSD140 | **One body per person, materialized on promotion.** Cast people above crowd tier map to native `NPC` bodies only when they are where the lead can meet them; otherwise they are pack facts plus a save delta. Promotion builds the body from pack plus delta; demotion writes the delta back and drops the body. No second body store (B1's stop condition) | ACCOUNT FOR NOW: B1 one-body rule; D1 tier field |
| LSD141 | **A generic cast engine, extracted at the second consumer.** Today the cast host is LOTM-named and MoL has its own. When MoL becomes the second be-seat world (MW3), lift scheduler, constraint store, tiers and generation into world-neutral modules, with world packs and world mechanisms as inputs (AR rules: a seam once two consumers exist). Nothing new goes into `main.js` beyond the call site | LATER: with the MoL be lane |
| LSD142 | **Pack revisions are save-visible.** The LOTM save pins the EPUB hash and schema but not the pack revision, yet every rebuild changes ids, fills and constraints. Saves record the pack revision; a rebuild keeps ids stable (crosswalk ids, never row order) and ships an id map for renamed or merged people; on load, a save from an older pack keeps its deltas, and contradicted fills go to the strain report rather than being rewritten (LSD134). Old-save compatibility is otherwise deferred (Saves router row) | ACCOUNT FOR NOW: pack regeneration brief and D1; done check: a save from the current pack loads after the M1 rebuild with no lost deltas |
| LSD143 | **Canon is never stored in the save, only derived.** Constraints come from the pack; the save holds deltas, provenance codes for written facts, and the run mode. Provenance is a short code, not text, to keep saves small (SZ2) | ACCOUNT FOR NOW: D1 |
| LSD144 | **Knowledge stays sparse.** `people_knowledge.js` per person for 270 people grows fast if every rumour is copied; store who-knows-what as events with audiences (CL31) and derive per-person views on demand | ACCOUNT FOR NOW: K1 witness and rumour lane |
| LSD145 | **The inspector reads all of this** (CL19): for any person, their tier, next wake, the constraint that pins them, the provenance of each fact, and why a free action was refused. Inspection only, never in the save, never in Reports (RPT11) | LATER/DELEGATE: Luna medium after D1 |
| LSD146 | **Golden runs as the regression.** The null-player canon run (LSD123) per pack revision, headless through the lead-run driver and the game MCP, compared by state hash, becomes a required check for any lane that touches cast, clock or packs; a pack rebuild records its new golden hash | ACCOUNT FOR NOW: L5r driver is the base; D1 adds the hash |
| LSD147 | **Performance budgets are tests.** Per-minute cost, wait time, save size after one book week and pack load time get thresholds in a focused test or the floor script (CL278), so a growing cast cannot silently slow the game | ACCOUNT FOR NOW: CL278 floor lane |

### 17.2 Long term

| Code | Line | Disposition |
| --- | --- | --- |
| LSD148 | **The chain is the product: read, pipeline, pack, engine.** Each new book costs reading and a pipeline run; the engine stays. World-specific code is reserved for world mechanisms (fate, loops, powers, institutions), each a plug-in with a locator (CL22) | ACCOUNT FOR NOW |
| LSD149 | **Original worlds are canon density zero.** The same machinery with no constraints is a fully open world: fills by role, emergent stories, no reservations. Weibao's own worlds and the Village need no second engine | ACCOUNT FOR NOW |
| LSD150 | **Volumes chain.** A pack per volume (or arc window, SZ4) with carry-over facts at the boundary: who is alive, where, what they know. The lead's state at the end of volume 1 is checked against volume 2's opening constraints, and the strain report shows mismatches | LATER: when volume 2 is read |
| LSD151 | **Reader schemas will keep changing.** M1's union handles 1.3 and 1.4; future versions use the same rule (newest present field wins, older survives where newer is silent) with backup folders named by version, so readers can improve without rereading everything | ACCOUNT FOR NOW: keep `pre-sv<version>/` naming |
| LSD152 | **Editions and translations differ.** Locators are tied to one source snapshot (the EPUB hash); a second edition or translation is a new source with a locator map, never a silent swap | ACCOUNT FOR NOW |
| LSD153 | **The publication boundary scales with the packs.** As packs reach hundreds of people and thousands of facts, canon stays in local packs and private research only; public code, tests and docs stay name-free (CLR3, AD1). Review scripts keep scanning every lane | No change |
| LSD154 | **The open run reuses everything.** Untaken options, weights and the conditioned-draw strain table are recorded now, so the open run is a mode switch plus D2's perturbation handling, not a re-read | No change |
| LSD155 | **Design owner after acceptance.** This file is a dated dispatch proposal. When Weibao accepts a set of LSD lines, they move to a standing rulebook (proposed `docs/LEAD_LIFE_RULES.md`, keeping LSD codes) with a register row, and this file becomes history | ACCOUNT FOR NOW |

### 17.3 How future runs find this

The RULES_INDEX register row and the "new world or book adaptation" router row cite LSD1-LSD155; the NPCs and
Saves router rows now cite the tier and save lines; the lane brief template asks every cast, clock, save or pack
brief to cite its LSD lines; the coordinator handoff lists this file under "Read first".

## 18. Timing: order and windows, not hours (Weibao 2026-10-29; proposal)

Weibao: timings "dont have to be accurate to the hour, as long as all the features and events happens". The local
routine-time pilot agrees from the other side: most routines in the text never state an hour, and the model correctly
answered "none" (LOCAL_AGENT_CAPACITY_2026-10-28). D1 already stores windows (LSD117).

| Code | Line | Disposition |
| --- | --- | --- |
| LSD156 | **Fidelity is events, order and windows.** A canon run is faithful when every canon event and feature happens, in the book's order, inside its window (day and band). The exact minute inside the window is a keyed draw (LSD117) | ACCOUNT FOR NOW |
| LSD157 | **Precision only where things interact.** Hours matter when two people must meet (their windows must overlap), when a place is open or closed, when daylight or darkness changes what works, for deadlines, and for travel feasibility (cannot be in two places). The store tightens a window only when a lint finds two constraints that cannot both hold; otherwise it stays loose | ACCOUNT FOR NOW: forward-anchor lint grows a co-presence check |
| LSD158 | **Relative timing beats absolute.** "After lunch", "before the meeting", "the next morning" become order edges between constraints; the store keeps an order graph, and a reader records the relation instead of guessing an hour | ACCOUNT FOR NOW: pack rebuild |
| LSD159 | **Routine usability counts band, order or role hours.** The consumer-fitness metric counts a routine usable with a place plus any of: a band, an order edge, or the role's hours from the world hours table (CL109). Reader and local lanes stop chasing hours the text does not give | ACCOUNT FOR NOW: R1 lane changes the metric |
| LSD160 | **Coverage replaces clock accuracy as the measure.** Progress is how many canon steps the be replay reaches (CL269) and how few constraints needed forcing (strain), not how close each minute is | No change |
| LSD161 | **Show time the way he knows it.** The UI speaks in phrases ("this evening", "tomorrow morning", "the day of your interview"), with an hour only where he knows one (an appointment, a clock striking) | ACCOUNT FOR NOW |
| LSD162 | **Loose windows are cheaper to run.** Cast beats fire anywhere in their window, so the clock can wake at window edges instead of minutes (LSD138); idle cost falls with looser data | ACCOUNT FOR NOW: P5 |
| LSD163 | **Keep stated precision.** When the book gives an exact time (a clock strikes, a timetable, a midnight rite), it stays exact; those are often plot | No change |
| LSD164 | **Loop worlds need more precision (dial).** In a time loop (MoL), events recur at the same times each loop and the protagonist exploits exact timing, so loop worlds set a tighter default and record observed times per loop. Per-world dial, not a global rule | ACCOUNT FOR NOW: MoL lane (MW3) |

## 19. Everything the lead goes through: content scales, code does not (Weibao 2026-10-29; proposal)

Weibao: "it feels like we could have millions and millions of lines, but like, less than 100k lines of code" and
"How to implement everything it takes for the protagonist to go through their own life? more to consider?"

Measured 2026-10-29 (`src/**/*.js`, 991 files, string literals counted by a regex pass): 158,912 lines, of which
7,930 blank and 8,456 comment lines; 29% of bytes are string literals. 95 files are over half strings and hold
29,635 lines (largest: `src/world_packs/book_mol_pack.js` 13,150 lines, `src/feature_expansion_book_roster.js`
3,154, `src/feature_expansion_book_recognition.js` 3,022). So roughly 110-115k lines are logic and about 30k are
content kept in code. The 27 `src/book_world_lotm_*` files are 2,857 lines; the LOTM book itself lives in
`private_packs/lotm-cast/`. Replay evidence for the scaling claim: chapters 9-16 went from 0 of 54 steps to a row
(before H2) to 26 of 54 (RV7, after H2's place-act operations); one mechanism lane moved yield more than review.

| Code | Line | Disposition |
| --- | --- | --- |
| LSD165 | **Code grows with mechanisms, content grows with steps.** The 11,159 steps collapse into verb families, families into effect operations (`simulation_effects.js`) and frames (LSD85-LSD87). A step costs a row; only a new operation, input or stop rule costs code. Reason: LSD148 at the step level; the RV7 jump is the proof | ACCOUNT FOR NOW |
| LSD166 | **Per-step code is a smell, with a meter.** The gap census records, per covered step, which operation it uses; a report prints code lines added per newly covered step for each lane. The figure should fall lane over lane; a lane whose figure rises is building one-offs and gets reviewed before merge | LATER/DELEGATE: Luna low, a field in the X4 census output plus a printed ratio; done when two lanes' ratios are printed |
| LSD167 | **Two tiers of coverage: reachable, then playable.** A step with no mechanism still becomes reachable through a generic canon-event act: the book's action shown as a card with its recorded outcomes (WA28 facts, LSD103 canon results), applied through existing effect operations. A mechanism later upgrades the card to a playable action with choices and checks. Fidelity counts reachable; depth counts playable. Reason: the canon run is forced (section 15), so a faithful run needs every step to happen, not every step to be a system. Dial: per weight; plot steps get mechanisms first, routine steps can stay cards | ACCOUNT FOR NOW: decide with MF1's output; the replay driver scores both tiers |
| LSD168 | **Mechanisms before bulk review.** Review yield depends on how many operations exist, so bulk paragraph review waits until MF1's top families land; small RV sample shards (about 50 steps) run after each mechanism to measure the new yield. Reason: reviewing 10,000 steps against today's vocabulary would be redone after each mechanism | **Accepted by Weibao 2026-10-29** ("Sure" to mechanisms first with LSD179-LSD183); the coordinator was already running MF1, DV1 and MK1 in this order |
| LSD169 | **Expect a long tail; let cards hold it.** Family sizes are skewed (make or write 366, divination or ritual 232, ability 160, travel 1,272 steps). The top families earn mechanisms; one-off events (a single ceremony, a unique accident) stay LSD167 cards unless a later world reuses the shape. Reason: building a system for a step that occurs once is the per-step code LSD166 measures | ACCOUNT FOR NOW |
| LSD170 | **Plan by volume, not by the first week.** Sections 2-8 are drawn from a clerk's week in volume 1; later volumes change scale (wider travel, higher powers, organisations, other places). Before mechanism lanes are ranked, MF1 or a Luna census prints family counts per volume, so a mechanism designed for volume 1 has parameters for the later ones (sequence, reach, cost) instead of a rewrite | LATER/DELEGATE: Luna low over the existing census; done when a family-by-volume table is saved beside the X4 census |
| LSD171 | **Powers are a table over one mechanism.** "Use an ability" (160 steps) should be ability rows (id, pathway and sequence, means, cost, check profile, effects as operations, side effects such as loss of control) read by one use-a-power move (LSD73's ABR seam). Advancing a sequence adds rows; it never adds code unless an ability needs a new operation | ACCOUNT FOR NOW: brief line for the ability lane |
| LSD172 | **Inner steps are knowledge changes, not buttons.** Many steps are thinking: deducing, recalling, planning, reading notes, dreaming, deciding to hide something. They write facts and beliefs (section 5, `people_knowledge.js`) and journal lines, and unlock or lock later actions. Default: an inner step runs as part of the act that prompts it (reading the notes yields the deduction); a "think it over" act exists for deductions the book gives no trigger for | ACCOUNT FOR NOW: MF1 classifies inner steps as their own family |
| LSD173 | **Content out of `src/` over time.** About 30k lines of `src/` are content in code. New book and world content goes to data packs (public name-free data under `src/world_packs/` or `data/`, canon in `private_packs/`), so engine size tracks mechanisms. Existing files move only when a lane already touches them (AD45, no cleanup lane) | ACCOUNT FOR NOW |
| LSD174 | **Token cost follows the residue, not the book.** Reading the book once is a fixed cost already paid (volume 1 at 1.4, volumes 2-8 at 1.3). Mapping is deterministic local code. Model judgment is spent only on steps that no operation covers, so cost per remaining step falls as mechanisms land. Track Codex window points per new control for each lane type (review, mechanism, mapper); RV6 and RV7 give the first review figures | ACCOUNT FOR NOW: coordinator log line per lane |
| LSD175 | **A step inspector for whoever reviews.** For any step: its paragraph (through `cite_paragraphs.mjs`), family, mapped control or card, the operation it uses, and why it is a gap. Review lanes and Weibao read this instead of raw JSON; inspection only, never in saves (LSD145's sibling for steps) | LATER/DELEGATE: Luna medium after MF1; done when one gap step and one covered step render with all five fields |
| LSD176 | **Per-family golden slices.** Each mechanism lane ships with a short replay slice of the steps it claims (seeded, headless, state hash) added to the LSD146 golden runs, so a later lane cannot silently break an earlier family | ACCOUNT FOR NOW |
| LSD177 | **Reuse across worlds is the payoff test.** A mechanism counts as general when a second book's census (MoL or a later pack, `OTHER_BOOKS_READINESS.md`) maps steps to it with rows only. MF1's ranking prefers mechanisms whose families also appear in other books' readings | ACCOUNT FOR NOW: MF1 ranking factor |
| LSD178 | **Done is a fidelity curve, not a date.** Progress reports give reachable share, playable share and strain per volume (LSD160), not lines written or steps reviewed | No change |

Suggestions outside this round (not dispositions): a one-page family map showing family, step count, mechanism,
tier and owner lane would let Weibao see the whole life at a glance once MF1 reports.

## 20. Optimizations: tokens, wall time and the engine (Weibao 2026-10-29; proposal)

Weibao: "consider optimizations and more". Already recorded elsewhere and not repeated here: load by window (SZ4),
per-minute cost and wake queue (CO3, SZ6, P5, LSD138, LSD162), lazy generation (LSD131), local model limits (LA1-LA6).
Measured inputs: whole-book candidate pack 2.66 MB loads in 14.9 s at 2,164 ms per game minute (P8, 04:50 log);
review lanes RV6 14 of 52 and RV7 26 of 54 steps to rows.

| Code | Line | Disposition |
| --- | --- | --- |
| LSD179 | **Shard by family, not by chapter.** A review or mechanism lane takes one family's steps across the book, so one context (the family's operations, row shape and examples) serves the whole shard. Chapter shards make each lane load every system a chapter touches. Reason: smaller prompts, steadier rows, and yield is measured per family (LSD168) | ACCOUNT FOR NOW: next RV briefs |
| LSD180 | **Rerun the mapper before any review.** When a mechanism lands, the deterministic mapper runs over its family's steps first (zero model tokens); only steps it still cannot place go to a Sol shard | ACCOUNT FOR NOW: coordinator order after each mechanism |
| LSD181 | **Paragraph packets.** The shard file carries the cited paragraphs for its steps (pulled once by `cite_paragraphs.mjs`), so a review lane reads one file instead of opening the book through tool calls. Packets stay in private research paths (LSD153) | ACCOUNT FOR NOW: shard builder field |
| LSD182 | **Cards are built by script.** LSD167 canon-event cards come from fields the readings already hold (action, outcomes, place, people); a script builds them with no model call. Only steps whose reading lacks outcomes go to a reader | LATER/DELEGATE: Luna low after MF1; done when every gap step in chapters 1-24 is a card or listed as missing outcomes |
| LSD183 | **A stop rule per family.** If a sample shard turns under about 15% of steps into rows, bulk review for that family stops and its steps route to a mechanism (when MF1 ranks one) or stay cards. Dial: the threshold per family; plot-weight steps can still be reviewed singly | ACCOUNT FOR NOW |
| LSD184 | **Family tagging is a local-model job.** Classifying gap steps into families, inner steps (LSD172) and weight is row-level and checkable, so it joins the LA2 list for the local model, under LA6's memory limit (one model, no browser or build beside it) | LATER/DELEGATE: local lane; done when 500 tagged steps agree with a Sol spot check of 50 at or above 90% |
| LSD185 | **Score the replay headless; use the browser only for UI claims.** Fidelity counts (reachable, playable, order) come from the headless engine (the lead-run driver or the game MCP); the browser floor runs once per commit batch for UI and persistence. Reason: replay batches cost minutes of wall time each in Chrome | ACCOUNT FOR NOW: V2 driver mode |
| LSD186 | **Prebuilt pack indexes.** The pack build writes its lookup tables (steps by day, place and person; constraints by window) beside the pack, so load reads them instead of rebuilding maps. Measure against P8's 14.9 s before keeping it | LATER/DELEGATE: Sol low after P5 lands; done when load time is printed before and after on the same pack |
| LSD187 | **Affected-family tests.** Per-family golden slices (LSD176) run in a lane when its changed files touch that family's operations; the committer's full `npm test` still covers everything once (lean tests, 2026-10-22) | ACCOUNT FOR NOW |
| LSD188 | **Every optimization prints before and after.** A speed or cost change records the measured figure on the same input in the coordinator log, or it is labelled unmeasured. Reason: several earlier speed lanes found the cost elsewhere than expected (P4's batching stop) | ACCOUNT FOR NOW |
| LSD189 | **Decisions in one morning list.** Open questions for Weibao (LSD168's order, MF1's ranking, new systems) collect in the coordinator handoff's decision list and arrive together, so lanes keep running on defaults overnight instead of waiting | ACCOUNT FOR NOW |

## 21. Tags the first reading should have carried, on almost no paid budget (Weibao 2026-10-29; proposal)

Weibao: "consider other aspects that needs to be tagged too, that should have been tagged the first time around,
but consider the fact that we are almost out of credits this month, and Local ai's slowness? ... Is mechanism
first better?" He accepted mechanisms first (LSD168) in the same exchange.

Evidence. MF1's review table ([MF1_AUDIT.md](cast-lives-lanes/MF1_AUDIT.md), F2) has 155 gap verdicts over RV2-RV9
(file records, not deduplicated): 105 no mechanism (68%), 30 another actor acts (19%), 14 not an action (9%),
6 unresolved identity (4%). Review alone cannot close the 68%; the other 32% are tagging faults that neither review
nor a mechanism should pay for. MF1 also notes that every step actor in the X4 census is unknown. Schema 1.3
([card](SCHEMA_CARD_1_3.md)) puts place, present people, outcomes, choices and evidence kind on the scene, and only
verb, class, label, time, inputs, outputs, gains and requires on the step. Local capacity
([LOCAL_AGENT_CAPACITY](../../../research/LOCAL_AGENT_CAPACITY_2026-10-28.md)): about 30-60 s wall per chapter for a
row-level lane, tagging judged good for about 40-60% of such tasks (inferred, not run), 18-21 GB resident, one
model at a time and never beside a build or browser floor (LA6). Inferred: a whole-book local pass is one to two
nights of a free machine, so the limit is free machine time and memory, not speed.

### 21.1 Is mechanism first better?

Yes, and more so when credits are short. A mechanism lane turns a whole family's steps into rows for one paid
lane (RV7's 0 to 26 of 54 after H2); a review lane can only label what exists, and 68% of its gaps say "no
mechanism". The caveat is that mechanism lanes are the paid items: MF1 D3 estimates 9-9.5 weekly-window points for
its ranked program, possibly double on overrun. With little budget left, finish what is already paid for (DV1
landed in `3ece3baf2`; MK1's integration patch is prepared and costs only coordinator time), hold the remaining
Sol lanes until the window resets, and spend the gap on free work: tag derivation by script, cards by script
(LSD182), headless replay (LSD185).

### 21.2 Tags, ranked, with the cheapest route for each

| Code | Tag (step level) | Why it matters | Cheapest route | Disposition |
| --- | --- | --- | --- | --- |
| LSD190 | **Actor**: who does the step | 19% of review gaps; no step has one today; the cast runner, perception and the be seat all need it | Script: lead by default in `pov:'lead'` scenes; another person when the label's subject matches a census name or alias; else `unknown` for the local residue | ACCOUNT FOR NOW: first free lane |
| LSD191 | **Step kind**: act, perceive, think, speak, report, narration | 9% of gaps are "not an action"; inner steps (LSD172) need routing to knowledge, not buttons | Script from the scene's evidence kind (`thought:`, `dream:`, `dialogue:`, `narration`) plus a verb lexicon; local for mixed steps | ACCOUNT FOR NOW: with LSD190 |
| LSD192 | **Family**: the mechanism family (MF1's set) | Shards by family (LSD179), stop rules (LSD183), cost per control (LSD174) | Script: a verb-and-class table; local model only for `other` (LSD184) | ACCOUNT FOR NOW |
| LSD193 | **Step outcomes and costs** | Cards (LSD182) and rows need effects per step; outcomes and money anchors sit on the scene | Script: assign each scene outcome to the step whose outputs or gains name it; leftovers stay scene-level and go to the last step | ACCOUNT FOR NOW: card builder input |
| LSD194 | **Habit**: one-off, repeated, or routine ("every morning") | Routine steps become schedule rows, not acts; this also feeds the thinnest layer, routine times (LA2) | Script: a Chinese frequency lexicon (每天, 每次, 总是, 常常, 照例, 又) over the cited paragraph; local for the rest | ACCOUNT FOR NOW |
| LSD195 | **Target and instrument**: on whom, with what | Rows need a target id and an item; identity faults are 4% of gaps | Script: intersect the label with the scene's `present` and `touched` ids; local residue | LATER/DELEGATE: when a mechanism needs it |
| LSD196 | **Witnesses**: who saw or heard | Knowledge and rumour (LSD144, CL31) and the perspective tags | Script: the scene's `present` list, minus anyone the step marks as absent or hidden | LATER/DELEGATE: with the K1 witness lane |
| LSD197 | **Agency**: chosen, forced, reacting | The canon run shows locked options only at choice points (LSD103); forced steps are cards | Script: link to the scene's `choices` and `options` by locator; untagged defaults to forced | LATER/DELEGATE |
| LSD198 | **Secrecy and risk**: done in secret, dangerous, illegal | Law, witness and fight systems; a sealed id stays opaque (sealed-secrets rule) | Local model over the paragraph; sealed ids are copied as ids, never as text | LATER/DELEGATE |
| LSD199 | **What the lead knows then** versus what the narrator tells | Spoiler-safe UI (LSD161, LSD93) and the be seat's perception | Script from evidence kind; local for narration that reveals more than the lead knows | LATER/DELEGATE |

### 21.3 How to run it on almost no budget

| Code | Line | Disposition |
| --- | --- | --- |
| LSD200 | **Order of routes: script, then local, then paid.** Every tag above has a deterministic first pass that costs minutes and zero tokens. The local model takes only the `unknown` residue. A paid model only spot-checks 50 steps per tag (agreement at or above 90% to keep the local output) and handles plot-weight steps singly | ACCOUNT FOR NOW |
| LSD201 | **Tag on demand, by family.** Tag the families the next mechanism needs first (making and divination now), not the whole book at once. Mechanisms first makes tagging cheaper, because each mechanism says which tags it reads | ACCOUNT FOR NOW |
| LSD202 | **Tags are a sidecar, not a re-read.** Derived tags go in a per-step sidecar file keyed by step id with a `source` field (`script`, `local`, `reviewed`) and the schema union rule (LSD151): a later 1.4 re-read, when credits return, overwrites only fields it actually states. Nothing already read is discarded | ACCOUNT FOR NOW: sidecar beside the X4 census in private research |
| LSD203 | **Local runs as overnight queues, gated by memory.** One model, chapters in a queue that resumes after interruption, `sysctl vm.swapusage` checked before start, no build or browser beside it (LA6). Output passes the same lexicon and name gates as LA2 before it enters the sidecar | LATER/DELEGATE: the existing local overnight flow; done when one night's queue resumes cleanly and its output passes the gates |
| LSD204 | **Fix the reader schema for later books now.** The next schema card moves actor, kind, habit, step outcomes and witnesses to the step, so MoL, RI and later books get them on the first reading. A schema edit is a text change, not a credit cost | ACT NOW (done 2026-10-29): schema 1.5 opt-in, see LSD206 |
| LSD205 | **Measure the 32% claim.** After LSD190-LSD192 run, rerun the mapper and count how many earlier "another actor" and "not an action" gaps clear with no review. If they do not, the tags or the mapper join are wrong, and the review numbers above were misread | ACCOUNT FOR NOW: done check for the tag lane |

## 22. Schema 1.5, and how much detail the lead's life needs (Weibao 2026-10-29; proposal)

Weibao: "Adjust future schemas accordingly and more, consider implications of recreating the protaginist's life,
do we need so much fine detail? are we focusing too much on certain thngs?"

### 22.1 Schema 1.5 (done)

| Code | Line | Disposition |
| --- | --- | --- |
| LSD206 | **Schema 1.5 puts the missing tags on the step**, opt-in per plan (`make_book_plans.mjs --schema 1.5`): `locator`, `actor`, `kind` (act, perceive, think, speak, report, narration), `target`, `using`, `habit` (once, repeated, routine), `results` (fact keys from the scene's outcomes) and `witnesses`. All optional and omitted when the text is silent (CLR4). The scene `schema` value stays `lead-run/1.3` so lint, union and merge need no change; 1.5 includes 1.4's extra-pass fields. The prompt tells readers not to split steps more finely. Owner: `scripts/lead_run/batch_lib.mjs`; test in `tests/lead_run_batch.test.js` | ACT NOW (done); no batch sent |
| LSD207 | **Consumers read 1.5 before anyone pays for it.** The X4 census and mappers prefer a step's own `actor`, `kind` and `locator` over the LSD190-LSD192 script guesses; the LSD202 sidecar uses the same field names, so script tags and 1.5 readings merge by the union rule (LSD151). Until a mapper reads them, no reading should be bought at 1.5 (READINESS L10: a field needs a consumer) | LATER/DELEGATE: with the tag lane; done when the mapper test shows a 1.5 step's actor overriding the guess |
| LSD208 | **Agency and secrecy stay out of the schema for now; witnesses are in.** Witnesses are in 1.5 because they are cheap for a reader and costly to derive; agency comes from the scene's `choices`, and secrecy and risk (LSD198) wait for a consumer | ACCOUNT FOR NOW |

### 22.2 Do we need this much fine detail?

Mostly no. Evidence: after a day of pipeline work the deterministic replay reaches 2 of 150 steps in order (fidelity
0.013) and 7 of 175 on the reviewed pack (0.04); the live pack holds 1,500 people and 1,516 places; the be seat is
agent-verified, not human-played. The measure (steps reproduced in order) rewards per-step work, so the work has
drifted toward step accounting. A life sim needs the book's events, its choices, its people and its texture; it
does not need every paragraph's movement as a separate control.

| Code | Line | Disposition |
| --- | --- | --- |
| LSD209 | *(Qualified 2026-10-29, [guide](../../../LEAD_LIFE_GUIDE.md) section 7 item 1: the grains set depth, not the floor. Every canon step stays reachable as a step, a card or a montage day that passes CLR6's fold-loss test; decided by the advisor under Weibao's delegation.)* **Three grains for a book life.** *Beats* (weight `great`: an interview, a rite, a death, a promotion) are played step by step with real choices. *Days* (routine scenes) run as a montage: the day's schedule, costs and one or two choices, settled by outcome (CL216). *Narration* (thinking, reported events, description) becomes journal, knowledge and texture. Only beats need step-level controls. Dial: the player can zoom any day into steps when a mechanism exists | ACCOUNT FOR NOW: proposed default |
| LSD210 | *(Amended 2026-10-29, guide section 7 item 1: also report reachable share over all steps, playable share over great beats and the fold-loss count; step-order fidelity stays a diagnostic.)* **Measure beats and verbs, not steps.** Fidelity becomes: share of great beats reached in order, share of days whose outcomes hold, and the count of distinct verbs the player can actually use. Step counts stay as a diagnostic. Reason: the step metric drove the review and bulk-row work that MF1 then had to reclassify | ACCOUNT FOR NOW: replay driver reports both |
| LSD211 | **Detail follows attention.** Like people (LSD130), chapters get step detail when the player plays them closely; the rest stays at beat and day grain with cards (LSD167). Reading detail can stay where it is; spending on mapping and review should follow the chapters actually being played | ACCOUNT FOR NOW |
| LSD212 | **A human play check before the next pipeline wave.** Fifteen minutes of Weibao in the be seat, chapters 1-3, answers what no replay can: is it fun, legible, and does it feel like his life. Optional under AD42, but the cheapest evidence available while credits are low | Suggest; his call |

### 22.3 Where focus may be lopsided

| Code | Line | Disposition |
| --- | --- | --- |
| LSD213 | **Canon fidelity over own-style play.** Section 15 forces the canon run, and nearly all recent lanes serve it. The open run (playing the lead differently, READINESS "own style") is where the game differs from rereading the book; it needs consequences and options more than step fidelity. Default: each mechanism lane names one open-run choice it enables beyond the canon step | ACCOUNT FOR NOW: mechanism briefs |
| LSD214 | **One book's data over portable systems.** LOTM has a whole-book pack, census and replay; MoL, RI and the Village use none of the newest mechanisms yet. LSD177 asks for reuse; until a second world uses DV1 or MK1 unchanged, they are LOTM features. Default: after MK1 integrates, the next mechanism lane includes a second-world fixture | ACCOUNT FOR NOW |
| LSD215 | **Data breadth over performance.** The whole-book pack loads in about 15 s and runs at 1.5-3.2 s per game minute (P8, X4 logs); 1,500 people is far past what the player meets in volume 1. Load by window (SZ4) and tiers (LSD126-LSD137) matter more than more rows | ACCOUNT FOR NOW: SZ4 before the next pack growth |
| LSD216 | **Planning text over playable change.** This doc alone has grown from LSD1 to LSD216 in two days; most lines are proposals no lane consumes yet. Default: a new round adds lines only where a lane brief or check will read them, and folds the rest into a short suggestion list | ACCOUNT FOR NOW |
| LSD217 | **What stays fine-grained on purpose.** Money, prices and time windows where people meet (LSD157), rite and potion steps (they are mechanics), and the lead's knowledge (what he knows when). These drive consequences; keep them exact | No change |

Suggestions outside this round: a one-page "what you can play today" card for the be seat, regenerated after each
integration, would make LSD212's check quick.

## 23. Variance inside canon, the butterfly effect, and leaving the lead's seat (Weibao 2026-10-29; proposal)

Weibao: "consider stuff like future fine tuning in the future, iterating through combats with deterministic system
to allow for variance but still somehow following cannon unless external interference? Butterfly effect? ...
Efficientcy? modularity? what matters when transfering from no longer being the protaginsit, since the protag life
playthrough is for the sake of implementing all the features and stuff?"

Already settled and not repeated: conditioned keyed draws and strain (LSD107, LSD64), calibration by seed sweep
(LSD96), keyed fight draws (LSD83), perturbation records and contested constraints (LSD110, LSD111, D2 deferred),
seat promotion (LSD129) and tiers (LSD126-LSD137). Lines below are only the new angles, each with a reader.

### 23.1 Variance that keeps canon

| Code | Line | Disposition |
| --- | --- | --- |
| LSD218 | *(Narrowed by Weibao 2026-10-29, section 24: a default for the canon run and the lead as NPC, not a rule for every run; LSD233 sets it as a dial.)* **Canon fixes the outcome tier; play moves the cost.** In the canon run, how the player fights or argues changes what it costs (wounds, time, money, who saw, what broke) inside the band the book allows, not who wins. Clumsy play wins the book's fight at a higher price; careful play wins it cheaply. Reason: player skill matters in a forced run without breaking it | ACCOUNT FOR NOW: F1 result screen (LSD94) shows the cost, not a win/loss |
| LSD219 | **Each canon conflict lists its locked facts.** Winner, survival, items taken and anything a later constraint needs are locked; rounds, order of blows, wound places, words exchanged are free. The lock list comes from the forward-anchor lint (LSD63), not by hand | ACCOUNT FOR NOW: FD1 row field |
| LSD220 | **Iterate fights headless across seeds.** A development command runs one canon conflict over N seeds and prints the spread of free details, the cost band and the strain, so a combat change is judged on a distribution, not on one replay. Same runner and keys as play (LSD83) | LATER/DELEGATE: with C2 (LSD96); done when one fight prints a 100-seed spread in under a minute |

### 23.2 The butterfly effect

| Code | Line | Disposition |
| --- | --- | --- |
| LSD221 | **Two butterflies, treated oppositely.** A *technical* butterfly (one extra roll reshuffling every later roll) is a bug and is prevented by subject-keyed draws (LSD55, LSD139). A *story* butterfly (a saved stranger later matters) is the point and spreads only along causal links (LSD111). Test: add one unrelated action early; every draw not causally linked must match the base run | ACCOUNT FOR NOW: a golden-run variant in LSD146 |
| LSD222 | **Divergence damps unless a link carries it.** An external change reaches what its causal links reach and stops; constraints whose needs it does not touch still happen on time. Strong canon (CL21 causal mass, the world's fate dial) pulls back toward the book; weak canon drifts. Dial per world | ACCOUNT FOR NOW: D2 design input |
| LSD223 | **Show the divergence.** A divergence view lists facts that now differ from the book, their source and what they reach next, for the player at his knowledge level and in full in the inspector. Reason: a changed world should feel caused, not random | LATER: with D2 |

### 23.3 Efficiency and modularity

| Code | Line | Disposition |
| --- | --- | --- |
| LSD224 | **Checkpoints per beat.** The replay and golden runs save a state snapshot at each great beat, so work on chapter 40 starts from chapter 39's snapshot instead of replaying the book. A snapshot is valid for one pack revision and engine hash; a mismatch replays from the nearest valid one | LATER/DELEGATE: V2 driver, Luna medium; done when a ch20 replay starts from a snapshot and matches the full replay's hash |
| LSD225 | **Mechanisms are world modules with a pack adapter.** Each mechanism (DV1, MK1, the conflict frame) has a world-neutral core, a thin per-world adapter and its own tests; LOTM-named code holds only adapters. This is LSD141 applied per mechanism, not only to the cast engine | ACCOUNT FOR NOW: mechanism briefs |

### 23.4 Leaving the lead's seat

The lead's life is the harness that forces features into existence; what the game keeps is the features. What
must hold when someone else is played:

| Code | Line | Disposition |
| --- | --- | --- |
| LSD226 | **No feature may read "is the lead".** Actions read the actor's means, knowledge, relations and place; the seat only chooses who the player controls. Done check per mechanism: its tests run once with a non-lead actor fixture | ACCOUNT FOR NOW: mechanism done check |
| LSD227 | **The canon run only tests success paths.** The book's lead passes the interview, survives the fight, finds the clue. Other seats and the open run will fail, refuse, run out of money and be caught. Each mechanism ships one failure path and one refused path with a consequence, or it is incomplete for other seats | ACCOUNT FOR NOW: mechanism done check |
| LSD228 | **Plot armour is not a mechanic.** The lead survives because the book says so (a constraint), not because his numbers are special. A seat without his constraints faces the same systems at face value; his powers come from rows anyone with the same means could have (LSD171) | ACCOUNT FOR NOW |
| LSD229 | **Data is densest around the lead and thin elsewhere.** Other seats live mostly on fills (LSD127, LSD133), so role fills, the hours table and place affordances matter more for them than any extra lead detail. Default: once the lead's volume-1 beats play, new data spending goes to fills and places, not to more lead steps | ACCOUNT FOR NOW |
| LSD230 | **A harvest ledger.** One table of the features the lead's run produced, each with seat-neutral (LSD226), failure path (LSD227) and second-world (LSD214) marks. A feature with all three is part of the game; otherwise it is a LOTM feature still. This replaces step counts as the answer to "what did the protagonist run buy us" | LATER/DELEGATE: Luna low over existing checkpoints; done when DV1, MK1, H2 and the journey mechanism have rows |

### 23.5 Fine-tuning later

| Code | Line | Disposition |
| --- | --- | --- |
| LSD231 | **Two kinds of fine-tuning.** *Game tuning* (bands to the text) is calibration, already LSD96. *Model fine-tuning* trains a local reader on our reviewed rows so later books cost less. Only reviewed or golden rows (READINESS L2) with their paragraphs are training data; fills, script guesses and unreviewed rows are not. Inferred: a mid-size local model is more practical to tune on this machine than the 27B one (LA6 memory) | LATER: after enough reviewed rows exist; not a credit cost |
| LSD232 | **Keep the data tune-ready now.** Reviewed rows keep their paragraph locator, schema version and reviewer source (LSD202 `source`), so a training set can be cut later with no rework. Private like all canon (LSD153) | ACCOUNT FOR NOW |

## 24. Canon pull: from a recreated story to emergent play, and fate (Weibao 2026-10-29; proposal)

Weibao: LSD218 "isnt absolute, for protag playthough maybe, and for maybe default life as NPC, but how can we decide
varience, or going against cannon in the future? I just want that idea to help with implementing deterministic and
other systems while still recreating the story, and kind of basically turning the story into a playable, at least
for the main character? But then extending the possbility by extending the range of possbiltities, probablities,
and create emergent behavior from rules and more? ... we can use that to implement 'fate' and other stuff like that
in the future? but then consider butterfly affects".

Owners this builds on, not restated: [TIMELINES_AND_DIVERGENCE](../../TIMELINES_AND_DIVERGENCE.md) (natural course,
inertia and disturbance C2, lazy resolution C3, motives outlive scripts C6, per-world dials, OD7, OD8), CL21 causal
mass, CL22 world fate mechanisms, LSD104 (hard, weighted, none) and LSD107 conditioned draws.

### 24.1 One number per canon fact

| Code | Line | Disposition |
| --- | --- | --- |
| LSD233 | **Canon pull.** Every canon fact has a pull from 0 to 1 at the moment it resolves. A keyed draw for that fact gives the canon outcome with chance `pull + (1 - pull) × p`, where `p` is what our rules alone give; otherwise it draws from the rest of the rules' outcomes. Pull 1 is the canon run's pin (LSD107), pull 0 is free play, anything between is a weighted run. Deterministic by key, so the same life gives the same result | ACCOUNT FOR NOW: D1/D2 design input; one formula serves every mode |
| LSD234 | *(Clarified 2026-10-29, guide section 7 items 2-3: "the world's canon pressure dial" reads as CL21 redundancy plus CL22 where a world names a mechanism; a per-world curve maps disturbance to pull, step-shaped by default for book worlds as a proposal.)* **Pull comes from named inputs, not a hand setting.** Run mode sets the ceiling (canon run 1; the lead as NPC near 1 by default; open run lower); then plot weight, redundancy (how many `deps` routes lead to it, CL21), the world's canon pressure dial, a fixed-point flag, and the disturbance already applied (C2) set where it sits. LSD218's "play moves the cost" is what pull 1 looks like; at lower pull, play can move the outcome too | ACCOUNT FOR NOW |
| LSD235 | **Variance is decided per fact by what depends on it.** Facts nothing later needs get pull 0 even in the canon run (the order of blows, words said, which route home); facts later scenes need get the full ceiling. The forward-anchor lint already finds these dependencies (LSD63, LSD219), so variance is computed, not argued case by case | ACCOUNT FOR NOW |

### 24.2 The pin is scaffolding; the rules should earn the story

| Code | Line | Disposition |
| --- | --- | --- |
| LSD236 | **Emergent canon rate is the real target.** Run the canon life at pull 0 across seeds and count how many canon facts our rules reach on their own. Strain (LSD64) is the per-fact view of the same number. As rules improve, the rate rises and the pins matter less. A world whose rules reproduce most of its book at pull 0 is one where going off canon is believable, because the same rules then drive the new story | ACCOUNT FOR NOW: replay report field beside fidelity |
| LSD237 | **The book is a set of decision tests.** Every canon choice (take the job, hide the find, refuse the offer) is a test case for the people's motive model: given their state at that moment, would our resolver choose it? Agreement rate per person and per kind of choice ranks where the motive model is wrong, and fixing those makes the cast behave like themselves after a divergence | LATER/DELEGATE: after D2's motive resolver; done when 20 lead choices from volume 1 report agree or disagree with reasons |
| LSD238 | **Widening possibility is lowering pull, not new content.** The open run reuses the same records: untaken options (WA28) become available, mechanism lanes add verbs with their own failure paths (LSD227), and probability bands come from calibration (LSD96). Nothing is authored twice | ACCOUNT FOR NOW |

### 24.3 Fate as a mechanism

| Code | Line | Disposition |
| --- | --- | --- |
| LSD239 | **Fate is an actor that spends on pull.** Where a world names fate (CL22, OD8), it is an in-world agent with a budget: it raises pull on threatened facts it cares about, through in-world means (a coincidence draw, a substitute with motive, an omen, a delay), with reach, cost and traces. Without a named world mechanism, only causal mass applies (CL21), and the book-fidelity dial stays a play setting, not fate (LSD62) | LATER: with the world pass that names it |
| LSD240 | **Fate leaves readable traces.** Where fate or high pull acts, it shows as signs a perceptive or divining character can read: divination (DV1) can read the pull and strain field of the questions it asks, at its own accuracy, never the sealed truth beyond its means. This gives divination a mechanical job in every world that has it | ACCOUNT FOR NOW: DV1 follow-up design input |
| LSD241 | **Resisting fate costs and can win.** Disturbance above inertia (C2) beats a fact's pull; fate can spend more, and the player can spend more. Neither side is guaranteed (AD5). Done check later: a seeded scenario where one push fails and a larger push succeeds | LATER |

### 24.4 Butterfly effects under canon pull

| Code | Line | Disposition |
| --- | --- | --- |
| LSD242 | **Pull is recomputed lazily.** A fact's pull is computed when it is about to resolve or someone observes it (C3), from the disturbance that has reached it along causal links. A change upstream never recomputes the whole future at once. Reason: cost stays proportional to what the player touches | ACCOUNT FOR NOW |
| LSD243 | **Fragile and robust facts.** Redundancy decides how far a butterfly travels: a fact with one route (one person, one day) is fragile and moves with a small push; a fact many people steer toward is robust. The pull inputs (LSD234) carry this, and fate-sensitive characters can sense fragility (LSD240) | ACCOUNT FOR NOW |
| LSD244 | **Keep the technical butterfly out** (LSD221): a different pull changes only that fact's draw, never the key of any other draw, so divergence spreads by causes, not by random-number drift | No change |
| LSD245 | **Pull is derived, never saved.** The save holds disturbance and divergence records; pull is computed from the pack and those records (LSD143). Changing a world's canon pressure dial therefore changes future draws without migrating saves | ACCOUNT FOR NOW |

## 25. Systems that hang on canon pull and the readings (Weibao 2026-10-29; proposal)

Weibao: "Also stuff like relashionship stuff, crafting, time travel and more that all could depend on this and can be
implemented from the readings? More to consider?" Each row names what the reading already holds (schema 1.3/1.4/1.5
fields and passes 3-5), how canon pull (LSD233) applies, and the owner it plugs into. The reconciliation into one
guide book is a separate session's job; this table is its input.

| Code | System | From the readings | Under canon pull | Owner to extend |
| --- | --- | --- | --- | --- |
| LSD246 | **Relationships** | People pass: relations with attitude, basis and `since` (1.4), reacts by action class; scene `knowledge` and `present` | Canon bond changes are facts with pull; the cause between them is free, so who helped whom can vary while the book's turning points hold. LSD237's decision tests check attitudes too | R1 bond record (LSD26-LSD29); companions audit |
| LSD247 | **Crafting, brewing, making** | Rules pass: inputs with role, ordered steps, minutes, products, costs, `acquire` (1.4); steps with `using` (1.5) | The canon product and whether it worked hold; quality, waste and time are free within the band. A recipe is a row, so an off-canon brew uses the same rules | MK1, `book_world_lotm_brew.js`, MR1-MR36 |
| LSD248 | **Divination and ritual** | Rules pass `ritual` and conditions; ritual and divination step families (MF1) | Reads pull and strain (LSD240); a rite's success is a fact with pull, its preparation free | DV1, `book_world_lotm_ritual.js` |
| LSD249 | **Time travel, loops and restarts** | Scene `date`, `deps`, windows; reset rules (1.4 `reset`) | A return to the past restores a beat checkpoint (LSD224) with the traveller's knowledge kept: the natural course replays at its pulls, and the traveller's knowledge is disturbance (TIMELINES T1-T5). Loop worlds tighten timing (LSD164) and record what each loop changed | TIMELINES_AND_DIVERGENCE, WER1-WER17 for crossings |
| LSD250 | **Economy and work** | Price, wage, rent and service rows (1.4 typed prices), money anchors | Canon balances on canon days are reservations (LSD109); spending between them is free | E1 household lane (LSD30, LSD40) |
| LSD251 | **Knowledge, rumour and secrets** | Scene `knowledge`, evidence kinds, `witnesses` (1.5), sealed ids | Canon learning holds on canon time (LSD119); who else hears is free unless a later fact needs it | K1 witness lane (LSD144), sealed-secrets rule |
| LSD252 | **Law and institutions** | Rules pass law rows with `enforcement` (1.4) | A canon arrest or ruling holds; detection draws elsewhere are free and feed disturbance | LW1 lane (LSD39) |
| LSD253 | **Abilities and progression** | Rules pass abilities with `acquire`; ability family (MF1) | Advancement on canon days holds; how practice went is free; off-canon advancement uses the same rows (LSD171) | Pathways and abilities files, ABR seam |
| LSD254 | **Fights and conflicts** | Scene `conflict` block, conflict family; FD1 detail pass | LSD218-LSD220, LSD233-LSD235 | F1, C2 |

| Code | Line | Disposition |
| --- | --- | --- |
| LSD255 | **One field-to-system matrix.** Every reading field names the systems that read it, and every system names the fields it needs (READINESS L10). A field nothing reads is not collected; a system missing a field names the schema change. The guide book should carry this matrix as its spine | ACCOUNT FOR NOW: guide book input |
| LSD256 | **Shared order for these systems.** Each new system needs the same four joins before it is real: a pull-aware resolve (LSD233), a failure path (LSD227), a non-lead fixture (LSD226) and a beat checkpoint test (LSD224). Building those joins once in the constraint store and test kit makes every later system cheaper | ACCOUNT FOR NOW: D1/D2 and test kit |

## 26. Canon events are threads, not moments (Weibao 2026-10-29; proposal)

Weibao, while the card lane (guide section 6 step 3) was running: "Cannon events arent so short term are they? More
to consider? How would this interact with implementation?" Right: most canon events span days or weeks (an
investigation, a training period, a job, an illness, a courtship, a debt), and a scene is one sample of them. Cards
per step would reach each moment and lose what carries between them. Lines below are only those the card lane or the
next brief reads (Dr3).

| Code | Line | Disposition |
| --- | --- | --- |
| LSD257 | **A thread is the unit of a canon event.** A thread has an id, its beats in order, a window (first and last day), its participants, a goal or open question, and the state carried between beats (clues held, money owed, wound healing, skill progress). Scenes and their steps are samples; a card is a step inside a thread | ACCOUNT FOR NOW: card lane emits thread ids |
| LSD258 | **Threads come from data we have, by script.** Chain scenes by `deps` (`after`, `needs`), `continues`, shared touched ids (the same item, person or place recurring), and footprint windows; a cluster is a candidate thread. No reader field is bought for it; a `thread` field joins the schema only if clustering proves unreliable on the reviewed ground truth | ACCOUNT FOR NOW: card lane; schema change LATER |
| LSD259 | **Fold loss is checked per thread too.** A set of cards loses information if the state carried between two beats has no home (a clue found in one scene and used in the next). Such a thread stays a gap even when each card passes CLR6 alone | ACCOUNT FOR NOW: card lane report |
| LSD260 | **Between beats, threads progress as processes.** Healing, learning, saving, a rumour spreading and a search narrowing have rates in the mechanical layer (LSD126) and run on montage days (LSD209) and while idle. Canon gives checkpoints (healed by the book's day); pull applies to the checkpoint, and the rate is calibrated so the rules reach it on their own (LSD236) | LATER/DELEGATE: with the four joins (guide step 4) |
| LSD261 | **Threads interleave.** The lead runs several at once; the wake queue (LSD138) wakes at each thread's next deadline, and his free time (LSD113) is spent across them. Reservations (LSD109) are held by the thread that needs them, so the refusal reason names it ("you need this for the rent") | ACCOUNT FOR NOW |
| LSD262 | **Long threads are where butterflies live.** The longer a thread runs, the more disturbance can reach it, so a later beat's pull reads the thread's state, not only its own inputs (LSD234, LSD243). An item set up early and used much later is one thread with a long reservation, and the forward-anchor lint follows it across chapters and volumes (LSD150) | ACCOUNT FOR NOW |
| LSD263 | **Reachable is reported by thread as well as step.** Headline: threads whose every beat is reachable in order, and threads whose carried state survives (LSD259); step reachable share stays a diagnostic (LSD210) | ACCOUNT FOR NOW: card lane report |
| LSD264 | **The player sees threads as his open matters.** The journal lists open threads at his knowledge level ("looking into the notebook", "rent due on the 3rd") with what he knows, not what comes next (LSD116). Thread progress is a save delta; canon thread structure stays derived from the pack (LSD143) | LATER: runtime and UI after the card data lands |

## 27. The book-to-play pipeline: implementation, optimization, improvement (Weibao 2026-10-29; proposal)

Weibao: "Implementation stuff and more? More to consider? optimizations and more? Improvable stuff and more?" after
the workflow was summarized as read, merge, build the course, map, card or gap, mechanisms, rerun, runtime, measure.
Evidence checked 2026-10-29: `scripts/lead_run/world_lead_pipeline.mjs` (P1) runs six stages with a hash receipt
(schema_union, merge_shards, build_crosswalk, cast_worksheet, after_actions, conflict_contracts); the later stages
(`build_journeys`, `build_place_acts`, `build_topic_talks`, `build_cast_pack`, `build_replay_mapping`,
`merge_reviewed_rows`, `derive_step_tags`, `build_event_cards`, `build_event_threads`, `replay_metrics`) run by hand
outside it. Reviewed rows already merge by `stepId` (`merge_reviewed_rows.mjs`).

### 27.1 Implementation

| Code | Line | Disposition |
| --- | --- | --- |
| LSD265 | **One pipeline, every stage.** Extend P1 to the later stages in order, each with its input and output hashes and script version in the receipt, so a pack can be rebuilt exactly and a stale stage is visible. Today half the chain is hand-run, so "rerun after each mechanism" can mix old and new outputs | LATER/DELEGATE: Luna medium; done when one command rebuilds the chapters 1-24 pack, cards and metrics and a second run gives identical hashes |
| LSD266 | **Corrections are inputs, never edits.** Reviewed verdicts already key by `stepId`; extend the same rule to every hand or review fix (a thread split, an outcome assignment, an identity merge): one override file per kind, applied by its stage on every rerun, each line with its source and date. Generated files are never edited | ACCOUNT FOR NOW: card and thread builders read an override file |
| LSD267 | **One representation per step, fixed precedence.** Control, then card, then gap; ties by step id, never file or row order; thread order by a stable topological sort. A lint fails when a step has two representations | ACCOUNT FOR NOW: replay_metrics lint |
| LSD268 | **A card keeps its id when it becomes a control.** When a mechanism lands and a card's step maps to a control, the control takes the card's step id, so a save that recorded the card as done stays valid, and the run diff shows "upgraded" rather than removed and added | ACCOUNT FOR NOW: CR2 and mechanism briefs |
| LSD269 | **Card effects apply once.** A card's effects are keyed by life and card id and recorded as applied in the save delta, so reload, replay and offline settlement never apply them twice | ACCOUNT FOR NOW: CR2 persistence fixture |
| LSD270 | **A synthetic mini-book through the whole pipeline.** A public, name-free three-chapter book (a few scenes, a thread, a fight, a craft, a missing outcome) runs every stage in `npm test`, so the pipeline is regression-tested without canon. Private book runs stay private | LATER/DELEGATE: Luna medium; done when the mini-book produces controls, cards, a thread, a gap and metrics in one test |

### 27.2 Optimization

| Code | Line | Disposition |
| --- | --- | --- |
| LSD271 | **Incremental reruns by hash.** A stage reruns only when an input hash changed, and the mapper and card builder rerun only the families a new mechanism touches. Cost of a rerun then follows the change, not the book | LATER: after LSD265 |
| LSD272 | **The card reader indexes by window.** The runtime looks cards up by scene and day window, never by scanning all cards each game minute (the P5 lesson about per-minute cost); cards load with the pack window (SZ4) | ACCOUNT FOR NOW: CR2 |
| LSD273 | **A run diff after every pipeline run.** Per family: steps that moved control to card, card to gap, gap to card and card to control, with a sample of each. A mechanism that steals steps wrongly shows up as a drop elsewhere. The diff and the metrics are one report, the morning note's headline (Dr1) | LATER/DELEGATE: Luna low with LSD265 |

### 27.3 Improvable now

| Code | Line | Disposition |
| --- | --- | --- |
| LSD274 | **Missing outcomes from state differences.** For the 58 missing-outcome gaps, compare the scene's state with the next scene that touches the same ids (an item appears, money changes, a person now knows): a difference is a candidate outcome with label `I` and a `basis`, reviewed before use. Script only | LATER/DELEGATE: guide session; done when the share of the 58 that gain a candidate is printed and 10 are checked against paragraphs |
| LSD275 | **Card confidence.** Outcome-to-step assignment by shared words is weak; each card carries a confidence (words matched, outcome kind, distance from the step), and low-confidence cards go to the ranked review queue ahead of other gaps | ACCOUNT FOR NOW: card builder field |
| LSD276 | **Thread clusterer fixes from the spot-check.** Common items stop linking (weight by how rarely an id recurs across the book), clusters split where place and day both jump, and chains have a maximum span so links do not run transitively through long clusters. Rescore against the 14 verdicts | LATER/DELEGATE: guide session; done when the four "split" threads split and the eight "hold" threads still hold |
| LSD277 | **Prove the pipeline on a second book.** Run the cards and threads stages on a second read book (Mother of Learning, English locators) before any more LOTM-only stage is added; anything that breaks is LOTM-shaped (LSD214 for the pipeline, not only mechanisms) | LATER/DELEGATE: after LSD265 |

## 28. Abstraction: one resolution ladder, prose into bands, attacks and tempo (Weibao 2026-10-29; proposal)

Weibao: "What about abstracting things? attacks? Move intervals? Converting prose into Stats? Combat system?
relationships? Crafting? Divination and more?" Already settled and not repeated: moves as rows (LSD73, LSD85), named
inputs (LSD86), conflict frame for non-violent contests (LSD87), turn-based life fights (LSD90), relative bands and
few stats (LSD97), stat claims collected by FD1 (LSD100, LSD101), bonds (LSD26-LSD29), results beyond health
(LSD34), calibration (LSD96). Code checked 2026-10-29: the upstream auto-battler times attacks by cooldown from
`attack_speed` (`src/models/combat.js`, `attack_cooldowns = 1/attack_speed`, subtick planning); native and party
battles are ordered moves through the conflict frame (`src/native_battle.js`); checks are keyed dice
(`src/check_resolver.js`, address of world, life, game time and event).

### 28.1 One ladder for every system

| Code | Line | Disposition |
| --- | --- | --- |
| LSD278 | **Three resolutions of the same event.** *Outcome* (one draw settles it: a card, an off-screen fight, a montage evening), *exchange* (a few choices: moves, offers, ritual stages), *detail* (each blow, each ingredient, each word). Grain (LSD209) and attention pick the level; every system (conflict, talk, craft, rite, divination) offers the same three. Reason: one pattern to build and test, not one per system | ACCOUNT FOR NOW: mechanism briefs name which levels they build |
| LSD279 | **Levels must agree.** An event settled at outcome level gives the same distribution of results as playing it at exchange level with the "as the lead would" policy (LSD93). The outcome-level odds are calibrated from seeded exchange-level runs (LSD220), never set separately. Test: 1,000 keyed runs at each level, results within a stated tolerance | ACCOUNT FOR NOW: done check for any system with two levels |
| LSD280 | **Zooming in keeps the draws.** Draw keys name the event and the step inside it, so zooming from outcome into exchange mid-day does not reroll what was already settled, and zooming out settles only what remains (LSD55, LSD244) | ACCOUNT FOR NOW |

### 28.2 Attacks and move intervals

| Code | Line | Disposition |
| --- | --- | --- |
| LSD281 | **Tempo, one stat for both engines.** Each move has a time cost in tempo units; `attack_speed` sets the cost of a strike, so the auto-battler's cooldown and the turn-based runner read the same stat. Turn order is "whoever's accumulated time is lowest acts next" (a timeline), so a fast fighter acts more often in a life fight exactly as he attacks more often in an idle zone | LATER/DELEGATE: F1 runner; done when one fighter pair gives the same action ratio in both engines over 100 seeds |
| LSD282 | **An attack is a row with five parts**: means (fist, knife, revolver, a power), reach band, tempo cost, check profile, and harm as effects. Supernatural attacks are the same row with a power as means and side effects (loss of control, exposure); no separate attack system | ACCOUNT FOR NOW |
| LSD283 | **Harm as a ladder with an HP adapter.** Life fights read harm as rungs (shaken, bruised, wounded with a place and recovery time, maimed, dying) per LSD34; an adapter maps rungs to native HP and back, so idle-zone combat keeps HP and the two never contradict | ACCOUNT FOR NOW: F1 |

### 28.3 Prose into stats

| Code | Line | Disposition |
| --- | --- | --- |
| LSD284 | **Prose gives evidence, not numbers.** Each stat is a band with an evidence list: claims ("a trained officer"), feats (outran a carriage, lifted a crate), and contests (who beat whom). Numbers exist only where a move reads them, derived from the bands by calibration | ACCOUNT FOR NOW |
| LSD285 | **Fit bands from canon contests.** Who beat whom across the book is a set of pairwise results; a ranking fit (pairwise comparison, Elo-like) over them places people on each stat's scale, and claims and feats set the priors. People with no evidence take their role's prior (a constable's typical band), labelled `fill`. Local compute, no tokens | LATER/DELEGATE: C2 calibration lane; done when volume 1's contests give a ranking that reproduces each canon contest's winner at pull 0 in most seeds |
| LSD286 | **Bands carry dates.** A stat changes with training, injury and advancement, so a band is a history (value from a date), and a contest is fitted against the bands at its date. Advancement on canon days is a constraint (LSD253) | ACCOUNT FOR NOW |
| LSD287 | **The same fit serves skills, crafts and bonds.** Craft quality bands from recorded successes and failures, skill bands from what a person manages, bond strengths from what people do for each other (LSD28) all use the evidence-to-band fit. One tool, its own tests | ACCOUNT FOR NOW: build it once in the C2 lane |

### 28.4 Per system

| Code | Line | Disposition |
| --- | --- | --- |
| LSD288 | **Relationships on the ladder.** Outcome: a montage evening moves warmth by a small band. Exchange: a conversation through the conflict frame (persuade, haggle, confide, refuse) with moves read from bonds. Detail: the dialogue tree where one exists. Canon turning points are facts with pull; the evidence-to-band fit sets starting bonds from the book's behaviour | ACCOUNT FOR NOW: R1 brief |
| LSD289 | **Crafting on the ladder.** Outcome: the book says it worked. Exchange: stages with a check each (prepare, combine, wait, finish). Detail: every ingredient and quantity. Book recipes are often partial; missing quantities and times come from role and world priors labelled `fill`, never invented as canon | ACCOUNT FOR NOW: MK1 follow-up |
| LSD290 | **Divination on the ladder.** Outcome: an answer with an accuracy band. Exchange: choose method, phrase the question, pay the cost, interpret. Detail: the symbols. The answer is generated from true world state (including pull and strain, LSD240) through keyed noise at the method's accuracy, and writes knowledge with a basis and confidence; it can be wrong, vague or blocked by interference, and never shows a sealed truth beyond its means | ACCOUNT FOR NOW: DV1 follow-up |

## 29. Fight modes, policies, harm and healing, saves, and abilities that travel (Weibao 2026-10-29; proposal)

Weibao: "maybe we can set up a seperate combat system for 'non idle' fights? where idle attack on attack is used to
farm and stuff, but there is an option for a more indepth fighting system? should it be turn by turn instead? how
does other games handle it? Maybe we can choose to have an more active style fight or more iddle fight? be able to
setup fight stuff and more? like if x then y styles? ... With types of harm, then we would then need to consider
types of healing? Need to also leave things open in case implementations and gaps in future worlds can help fill or
expand on pror worlds too ... How will we save stuff like relationship systems and more? Can can stuff like that be
determinsitc but still conform to cannon/results? ... give each ability comprehensive implementations and more, and
of course, make things modular".

Owners that already decide much of this (accepted 2026-10-18 unless noted), linked, not restated:
[DOMAIN_RULES](../../../DOMAIN_RULES.md) combat CBR1-CBR30 (one outcome publisher CBR2, idle fights on a stated
policy paid from real stock CBR26, away combat stops at downed or new-enemy states CBR27, conflict wider than combat
CBR30) and body and health BHR1-BHR30 (harm on its carrier BHR2, repair kind per body BHR4, HP versus injury versus
illness BHR5, separate healing milestones BHR19, medicine is making BHR20, healing declares its cost and where harm
goes BHR22, one interaction authority BHR23); [ABILITY_RULES](../../../ABILITY_RULES.md) (ABR codes; saves hold
`powers[actor][id]` with revision, ABM7).

### 29.1 How other games split idle and active fights (recollection, not re-verified)

Text games: MUDs fight automatically each round, and players script triggers and aliases ("if hp < 30 then quaff");
Kingdom of Loathing is turn by turn with a combat macro language; Fallen London has no blow-by-blow at all, only
quality checks (an outcome-level design); roguelikes (Angband, Sil) are turn based with an energy or speed clock;
Dwarf Fortress resolves hits on body parts and tissue layers. Non-text games: Final Fantasy XII gambits and Dragon
Age tactics are ordered if-then rules the player edits; Pillars of Eternity is real time with pause; Darkest
Dungeon is turn based with stress as a second harm track; Battle Brothers has lasting injuries by hit location;
Slay the Spire and Into the Breach show enemy intent before the player acts; idle games such as Melvor Idle fight on
their own with thresholds (auto-eat below a health line). The common pattern: one rules engine, several ways to
drive it, and player-written policies for the automated mode.

### 29.2 One engine, three ways to drive it

| Code | Line | Disposition |
| --- | --- | --- |
| LSD291 | **Not a second combat system: one rules engine, three drives.** *Idle* (real-time cooldowns, a policy decides, for farming and away time, CBR26), *assisted* (the policy runs and pauses on stated triggers: low health, a new enemy, a lasting-harm risk, a canon beat), *active* (the tempo timeline of LSD281, the player picks each move). Same moves, inputs, draws and outcome publisher (CBR2); only who chooses differs. Reason: two engines would drift (LSD71's lesson) and the levels must agree (LSD279) | ACCOUNT FOR NOW: F1 brief |
| LSD292 | **The player chooses the drive per fight, with defaults by stakes.** Farming defaults to idle; a fight with a person, lasting-harm risk or a canon beat defaults to assisted; any fight can switch to active at the next move. Dial per world and per player setting; a forced-run canon fight may default to active so its choices are felt | ACCOUNT FOR NOW |
| LSD293 | **Active is turn-based on a tempo clock, by default.** Turn by turn suits a text game (time to read, savable mid-fight, LSD90) and a tempo clock keeps speed meaningful (fast fighters act more often, as in roguelike energy systems). Real time with pause is the dial for players who want it; it reads the same tempo costs | ACCOUNT FOR NOW |
| LSD294 | **Show intent where the fighter could read it.** A visible windup ("he draws back to swing") is shown at the player's perception and appraisal level (CBR13, CBR14), so active play has decisions rather than guesses | ACCOUNT FOR NOW |

### 29.3 If-then policies

| Code | Line | Disposition |
| --- | --- | --- |
| LSD295 | **A policy is an ordered list of if-then rules over named conditions** (own harm rung, stock of a remedy, enemy kind or intent, an ally down, enemy yielding or fleeing, a canon beat present) and actions (a move, a remedy, retreat, accept surrender, switch drive). First matching rule acts; a fallback rule always exists. Policies are data, saved per character, copyable between characters and worlds | LATER/DELEGATE: F1 step after the runner; done when one policy drives idle, assisted and NPC play in a test |
| LSD296 | **One policy format for the player, NPCs and the lead.** NPC fighting styles, the lead-as-NPC policy ("as the lead would", LSD93) and the player's automation are the same format. Fitting the lead's policy to his canon fights (LSD237) gives a playable default that fights like him | ACCOUNT FOR NOW |
| LSD297 | **Policies extend past fights.** The same if-then format serves routines (eat when hungry below a band), trade limits, and away play (BHR28 reroutes around injury through the chosen policy). Conditions and actions are registries, so a new system adds both | ACCOUNT FOR NOW |

### 29.4 Harm and healing types

| Code | Line | Disposition |
| --- | --- | --- |
| LSD298 | **Every harm row names its carrier, and healing reads the carrier.** An attack's harm (LSD282) declares flesh, mind, soul, channels, a power instance, a held item, or a social standing; healing options come from the carrier's repair kind (BHR2, BHR4). So adding a harm kind automatically asks "what heals it, at what cost, where does it go" (BHR22) | ACCOUNT FOR NOW |
| LSD299 | **Non-body harm counts.** Fear and shaken nerve (mind, LSD34), loss of control or corruption (a power carrier), reputation and trust (social carrier, healed by apology, restitution or time, LSD27). Darkest Dungeon's stress shows a second track works when its recovery is as visible as the harm | ACCOUNT FOR NOW |
| LSD300 | **Healing is a ladder too** (LSD278): outcome (rest a week), exchange (treatment stages with checks, BHR20 making rules), detail (each remedy and dose). Milestones stay separate (BHR19) | ACCOUNT FOR NOW |

### 29.5 Saving bonds and other life state, deterministically and true to canon

| Code | Line | Disposition |
| --- | --- | --- |
| LSD301 | **Save the events, derive the values.** A bond (and a skill, a reputation, craft quality) is saved as cause-dated deltas the player's life produced (LSD27); the current value is derived as the canon baseline at that date (from the pack, never saved, LSD143) plus those deltas. Canon conformance is then structural: a reload recomputes the same value, and a canon turning point is a constraint with pull (LSD233), recorded as strain if the deltas fight it | ACCOUNT FOR NOW: R1 brief |
| LSD302 | **Compaction keeps saves small.** Old deltas fold into a dated snapshot with its hash; the snapshot is a cache that can be rebuilt from the log while the log is kept, and becomes the record once the log is trimmed. Provenance codes survive compaction (SZ2) | LATER: when save size measures it |
| LSD303 | **Reactions are keyed draws on the bond's derived value**, keyed by person, other, situation and date, so the same history gives the same reaction and a changed history changes only what it reaches (LSD244) | ACCOUNT FOR NOW |

### 29.6 Abilities as complete modules that travel between worlds

| Code | Line | Disposition |
| --- | --- | --- |
| LSD304 | **A whole system per ability family is fine; each is a module with a full life.** Divination, crafting, a pathway's powers each get a world-neutral core and a thin world adapter (LSD225), and every ability in it covers: how it is learned and advanced (ABR acquire), the three resolution levels (LSD278), costs and side effects, counters and who can detect it, failure and refused paths (LSD227), interaction tags (BHR23), what it does when idle or away, how it is shown, its save fields with revision (ABM7), and its tests (non-lead fixture, failure, level agreement). An ability missing a part is listed as partial, not done | ACCOUNT FOR NOW: mechanism done check |
| LSD305 | **Registries open both ways.** Carriers, harm rungs, move rows, policy conditions, ability families and repair kinds are registries a world extends. A later world's addition (a cultivation world's meridian harm, a new repair kind) applies to earlier worlds where the mechanism exists there, and is absent, not "no", where it does not (CLR4). A world never forks a registry | ACCOUNT FOR NOW |
| LSD306 | **Back-porting follows AD38.** When a later world fills a gap an earlier world left (a better appraisal method, a healing kind, a policy condition), the earlier world gains it only where its own mechanisms support it, with a revision bump on affected rows and save fields defaulting to absent. Cross-world carried abilities work wherever their mechanism works (BHR30) | ACCOUNT FOR NOW |

## 30. Turn-based on a tempo clock: what stops, and how much to invest (Weibao 2026-10-29; proposal)

Weibao: "What is turned base with speec clock? so does all time stop? More to consider? SHould we put more effort
into turn based?" Code checked 2026-10-29: the game clock advances in game minutes through `update_timer` in
`src/clock_owner.js` and already pauses itself for named reasons (busy authority, a pending pack, a stopped plan);
the saved-battle and party runners already take ordered moves (`src/native_battle.js`).

| Code | Line | Disposition |
| --- | --- | --- |
| LSD307 | **What a tempo clock is.** Every action costs time units (a jab 3, a heavy swing 6, reloading 8, scaled by speed); each fighter has a "ready at" time; whoever is ready earliest acts next, and acting pushes their ready time forward by the cost. A fighter twice as fast acts twice as often. There are no rounds, so a quick fighter can act twice before a slow one acts once | ACCOUNT FOR NOW: F1 runner |
| LSD308 | **Time stops between decisions, not during actions.** While the game waits for the player's next move, the fight and the world hold still. When a move resolves, the world clock advances by the move's real duration (seconds), so a whole fight costs the world well under a game minute. Reason: reading and choosing take the player time the character does not have | ACCOUNT FOR NOW |
| LSD309 | **What else pauses is a dial.** Default for an active life fight: the whole game clock waits (idle production, crafting queues and the cast hold for the seconds the fight lasts, which is negligible in game time). Dial: other idle systems keep running on the real-time clock while the fight waits, for players who leave a fight open for a long time. Reason: a waiting fight must not let the world, or the opponent, act for free | ACCOUNT FOR NOW |
| LSD310 | **A waiting fight hands over after a while.** If the player leaves an active fight untouched past a setting, the fight switches to assisted (LSD291) and the policy plays it, stopping at its usual triggers (CBR27). Reason: an idle game should not freeze for hours on one prompt | Superseded by LSD315-LSD317 (2026-10-29): the hand-over could end the run |
| LSD311 | **Reactions and channelled actions on the same clock.** Block, dodge and parry are reactions that spend tempo when triggered; a spell or ritual with a cast time occupies the caster until it lands and can be interrupted by harm (a check against the channel). Durations (stunned, bleeding, a buff) are counted in tempo, not turns, so speed affects them consistently | LATER/DELEGATE: after the base runner |
| LSD312 | **Allies act by their policies on the same clock.** Party members and companions take their turns from their policies (LSD295) unless the player takes direct control of one; the player can lock a policy rule mid-fight ("focus this one") | Revised by LSD318-LSD321 (2026-10-29): control is optional, never needed |
| LSD313 | **How much effort turn-based deserves: moderate, focused.** Most hours are idle farming, so the idle drive stays the volume. The active drive is where book fights become playable and is the reference the outcome level is calibrated from (LSD279), so it earns a solid runner: tempo order, intent display (LSD294), harm rungs (LSD283), reactions, and the result screen (LSD94). It does not earn a tactical grid, initiative minigames or a second content set; positioning stays range bands (LSD73) | ACCOUNT FOR NOW: F1 scope line |
| LSD314 | **Text-first presentation.** Each tempo step prints one line in his voice ("You duck under the swing; he stumbles"), with the timeline shown as "who acts next" (two or three names in order), not a bar chart. Choices sit in the LSD92 groups. Reason: a text game's fight reads like prose with decisions, and the order strip makes speed legible | ACCOUNT FOR NOW: F1 UI at 1920x1080 |

## 31. A waiting fight waits; allies need no puppeteer (Weibao 2026-10-29; proposal)

Weibao on LSD310: "maybe pausing forever since the run could be ended from that." On LSD312: "altho direct control is
good, we shouldnt need to do that? more to consider?" Both agree with the stakes rules already in force: away combat
must not return the player to a dead or maimed character (CBR27, BHR18, AD16), and a fight the player chose to steer is
the highest-stakes case.

| Code | Line | Disposition |
| --- | --- | --- |
| LSD315 | **An active fight waits for the player indefinitely, by default.** Replaces LSD310's hand-over. The fight is saved mid-tempo (LSD90) and resumes exactly where it stopped, across reloads and days of real time. Reason: the player picked active because the stakes matter; a policy finishing it unseen could end the life, which is the outcome CBR27 exists to prevent | ACCOUNT FOR NOW: F1 runner |
| LSD316 | **Hand-over is an opt-in dial, and only toward safety.** A player can set "if I am gone past N, my policy takes over", but the takeover may only pick defend, withdraw, yield or a remedy (CBR27's safe set), never a new attack with lasting-harm risk, and it still stops at CBR27 triggers. Dial for a forewarned harsher setting: full policy takeover (AD16). Reason: a convenience must not carry a death the player never chose | ACCOUNT FOR NOW |
| LSD317 | **Away hours during an open fight are kept, not spent or lost.** With LSD309's default (the whole clock waits), real hours away are recorded and applied after the fight ends, from the fight's end time: crops grow, queues finish and the cast moves then, in order. Nothing acts during the fight and nothing is lost by leaving. A fight that a stop interrupts during away play becomes an active fight that waits (LSD315), with a notice. Reason: an idle game should not punish stepping away, and should not let the world move around a frozen fighter | ACCOUNT FOR NOW: check against the existing away/catch-up path before building |
| LSD318 | **Allies run their own policies, good enough not to need control.** Each companion fights by a policy fitted to who they are (LSD296: the same format as NPC styles), reads intent at their own perception (LSD294), and protects themselves and the player by their bond and temperament. Direct control stays available, not needed. Test: a fight that can only be won by controlling an ally points to a missing policy condition or action, logged as a registry gap (LSD305), not a reason to require control | ACCOUNT FOR NOW |
| LSD319 | **Orders are speech acts, not remote control.** "Cover me", "fall back", "take the archer" cost the speaker a little tempo, need the ally to hear (noise, distance band, LSD73), and are followed by discipline, trust and fear on the derived bond (LSD301, LSD303): a loyal friend obeys, a scared hireling may not. An order edits the ally's policy priorities for the fight. Reason: companions are people (CBR28's spirit), and an order that can fail is a decision | ACCOUNT FOR NOW |
| LSD320 | **Pre-fight setup beats mid-fight control.** Before or between fights the player can agree a plan with an ally (a shared rule set: "if I fall, drag me out"), shaped by the ally's willingness. Agreed plans are followed more reliably than shouted orders. Reason: this moves the work to the calm moment, which suits idle and assisted drives too | LATER: after LSD318 |
| LSD321 | **Full direct control exists where a mechanism grants it.** A puppet, summoned servant, bound spirit, trained animal or controlling power gives true control, with that mechanism's cost and range (AD38). A free-willed ally under player control is a setting, labelled as control, never the default. Reason: in-world control is a power with a price, and the same rows serve NPCs who control others | LATER: with ability modules (LSD304) |
| LSD322 | **One open active fight per character.** Other fights in the world (allies elsewhere, the cast) resolve at outcome or exchange level (LSD278) while the player's fight waits, and only advance with the clock. A second fight that would reach the player while one waits joins it as new combatants arriving on the tempo clock. Reason: one waiting decision is legible; several are a queue of prompts | ACCOUNT FOR NOW |
| LSD323 | **Headless and test drivers use an explicit policy, never the wait.** The game MCP, replay metrics and tests step an active fight with a named policy or scripted moves, so "waits forever" never hangs an automated run. Reason: the indefinite wait is a player rule, and automation must always name who decides | ACCOUNT FOR NOW: game MCP step path |

## 32. Allies with their own goals, and chance in orders and plans (Weibao 2026-10-29; proposal)

Weibao: "For LSD318, people should have their own goals and should do things within their means? LSD319 is great,
LSD320 is good too, but of corse everything depends on chance and more? ... what else do we need to consider?" This
applies AD6 (means decide, on both sides) to allies, and CBR4/CBR12 (winners and enemies act by means and motive)
already say the same for enemies, so one rule serves everyone in a fight.

| Code | Line | Disposition |
| --- | --- | --- |
| LSD324 | **Everyone in a fight acts from their own goals, within their means.** An ally's policy (LSD318) is derived from ranked goals (stay alive, protect someone they love, their own aim, pay, loot, revenge, duty), their temperament and what they actually hold and know (AD6). Goals can conflict with the player's: a hireling flees when the pay is not worth dying for, a friend with a grudge chases the enemy, someone grabs the loot. Enemies use the same rows (CBR4, CBR12). Revises LSD318: "good enough not to need control" means good for their own goals, not obedient | ACCOUNT FOR NOW |
| LSD325 | **Goals shift during the fight.** Fear rises with harm and with a friend down; resolve rises when someone they protect is threatened; greed rises when the enemy breaks. Each shift reorders the policy's rules. Reason: people change their minds mid-fight, and this is what makes a rout or a last stand happen without a script | ACCOUNT FOR NOW |
| LSD326 | **Allies know only what they perceive.** They can misread intent, miss a hidden enemy or hit the wrong target, at their own perception (LSD294). They can also see what the player does not and say so ("behind you!"), a speech act that costs them tempo. Reason: shared perception is a reason to fight beside people | ACCOUNT FOR NOW |
| LSD327 | **Orders and plans resolve by chance on real factors.** Whether an order is heard and followed, and whether an agreed plan holds, is a keyed check (LSD55, LSD303) on bond, discipline, fear, noise, distance and whether the plan fits what actually happens. A willing ally can still fail in the doing (knocked down, the exit blocked). Default shape: routine things a competent person does mostly succeed; chance decides at the margins. Reason: everything depends on chance, but chance should sit where real uncertainty is | ACCOUNT FOR NOW |
| LSD328 | **Chance is keyed, so it is consistent.** The same situation gives the same result on replay; acting differently changes only what that change reaches (LSD244). No reroll by reloading the same choice, and no anti-cheat beyond that (AD22). Reason: deterministic variance keeps fights fair and testable | ACCOUNT FOR NOW |
| LSD329 | **In canon beats, allies sit under canon pull.** A book companion's choices in a canon fight are drawn with the fact's pull (LSD233): at pull 1 they do what the book says, lower pull lets their own goals decide. The player's changes (a saved friend, a broken trust) move their goals and so their behaviour, which is how divergence spreads through people | ACCOUNT FOR NOW |
| LSD330 | **Talking is a fight action for everyone.** Threats, surrender offers, bargaining, calls for help and taunts are speech acts on the tempo clock (LSD319), judged by the listener's goals: an enemy losing badly may take a deal, a fanatic will not. Reason: many book fights end by words or flight, not by a last blow | ACCOUNT FOR NOW |
| LSD331 | **The fight writes the bond.** How the player treated an ally (saved them, used them as bait, abandoned them, shared or kept the loot) becomes dated bond deltas (LSD301), and the ally's later goals read them. Reason: what happens in a fight is what people remember | ACCOUNT FOR NOW |
| LSD332 | **Experience changes policies.** Veterans hold under fear longer and read intent better; a green recruit freezes or panics. Fights grow skills and steady nerve (LSD301 deltas), so allies improve by living. Reason: competence is earned and is part of who someone is | LATER |
| LSD333 | **Show why, at perception.** One line explains an ally's surprising act where the player could tell ("Neil hangs back, pale"), never a hidden number. Reason: goal-driven people must read as people, not as a bug | ACCOUNT FOR NOW: with LSD314 |
| LSD334 | **Keep it cheap.** First slice: a few goals with weights that reorder existing policy rules (LSD295), picked by a simple score; no planner and no search. The full goal set grows as registries (LSD305). Reason: this is the most expensive kind of NPC logic, and weights over rules give most of the feel | ACCOUNT FOR NOW: F1 scope |

## 33. Chance everywhere, and the subtle parts of a fight (Weibao 2026-10-29; proposal)

Weibao: "Consider more subtle stuff and more? Lots of stuff could be on chance too? more to consider?" Code checked
2026-10-29: `src/check_resolver.js` already has one keyed resolver (`resolveCheck`, `replayCheck`, `spendAfterCheck`)
that any system can call; "luck" appears only in crafting sources and two book expansions, not as a general stat.

**Chance across all systems**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD335 | **One chance shape for every system.** Fights, crafting, talk, divination, travel, weather, prices, gossip spreading and an NPC's mood all go through the one keyed resolver: competence sets a band, and chance lives at the margin of that band. Reason: one shape keeps odds comparable across systems and keeps one test harness | ACCOUNT FOR NOW: route new checks through `resolveCheck` |
| LSD336 | **Do not roll what is already fixed.** Three kinds of uncertainty: chance (the swing that has not happened), hidden state (whether a guard takes bribes is already true once he exists; finding out is a perception or talk check, not a roll on the fact) and misjudgment (the player or character reads it wrong). Hidden state is generated once on first need, keyed by subject (LSD131, LSD139), and stays. Reason: rolling a fixed fact twice makes the world forget itself | ACCOUNT FOR NOW |
| LSD337 | **Long chains of rolls collapse at coarser grains.** Ten checks in a row make results wildly swingy (the chances multiply). At outcome level a chain resolves as one draw with the same expected result (LSD278 level-agreement test). Reason: the same fight must feel equally likely at every zoom level | ACCOUNT FOR NOW: level-agreement test covers chains |
| LSD338 | **Repeated idle actions use smoothed draws; one-off moments use plain draws.** For batches (crafting runs, farming, practice), keyed draws are stratified over the stream so 30% comes out near 30% over a run; a single important check stays a plain draw. Dial per world and per system. Reason: idle play should not punish streaks, and big moments should still be uncertain | ACCOUNT FOR NOW |
| LSD339 | **Luck is a mechanism where a world has one, not a free stat.** A charm, fate's attention, a blessing or a divined omen shifts a draw's band or a fact's pull (LSD239) with its source and cost (AD38). Without a mechanism, there is no luck number. Reason: luck that does not come from somewhere cannot be read, resisted or traded | ACCOUNT FOR NOW |
| LSD340 | **Odds are shown as the character judges them.** "Likely", "a long shot", "no idea": words at the character's appraisal level (CBR13, CBR14), and a temperament can bias the judgment (the overconfident misread long shots as fair). Exact numbers only where the character could know them, plus the dev inspector (LSD349) | ACCOUNT FOR NOW: with LSD333 |

**Subtle parts of a fight**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD341 | **Who notices whom first sets the opening.** Perception against stealth decides surprise; a surprised side starts with its ready times pushed back on the tempo clock (LSD307), and a mutual surprise starts level. Reason: ambushes and being caught off guard are most of how book fights begin | ACCOUNT FOR NOW: F1 runner |
| LSD342 | **Intent can lie.** A feint or a bluff shows a false windup; whether the observer sees the true intent is their perception or appraisal check against the feinter's skill. Extends LSD294. Reason: if shown intent were always true, skilled fighters would lose their best tool | ACCOUNT FOR NOW |
| LSD343 | **Mishaps come from conditions, not a flat roll.** No fixed 5% fumble for an expert. Mishap chance rises with strain, fatigue, pain (harm rungs, LSD283), unfamiliar tools, bad footing, dark and rain; adrenaline briefly offsets pain. Reason: experts fail when conditions are bad, not at random | ACCOUNT FOR NOW |
| LSD344 | **The place takes part.** Footing, light, cover, crowds and weather modify checks, and bystanders act by their own goals (flee, scream, call the authorities, film or remember it). Witnesses write facts (the schema 1.5 `witnesses` field, LSD206), and those facts reach reputation and investigators later. Reason: a fight in a street is a public event | ACCOUNT FOR NOW |
| LSD345 | **Fights have goals other than winning.** Capture, theft, delay, escape, protecting a carrier, delivering a message, or killing one target and leaving. A side that meets its goal stops fighting (LSD324 applies to sides as well as people). Reason: many fights end when someone gets what they came for | Revised by LSD368 (2026-10-29): backing out is an attempt with costs, not a clean end |
| LSD346 | **Gear and supplies run out and fail.** Ammunition and remedies come from real stock (CBR26); weapons jam, dull or break with use and conditions (LSD343); a dropped item stays where it fell and someone may pick it up. Reason: attrition is where tension and later plot come from | ACCOUNT FOR NOW |
| LSD347 | **Aftermath runs on chance too.** A wound may get infected, a dropped item may be found, a witness may talk or keep quiet (by their goals, LSD324), and a rumour spreads by who heard it. All keyed by subject and date. Reason: a fight's consequences should keep unfolding after the last blow | ACCOUNT FOR NOW |
| LSD348 | **Pressure and panic.** Under fear or time pressure, the policy's later rules are tried less carefully: a panicked fighter takes the first rule that fits, not the best. Discipline and experience (LSD332) resist this. Reason: people make worse choices under pressure, and policies should too | LATER |

**Making it checkable**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD349 | **A dev inspector for every check.** For any resolved check: its key, factors, band, draw and result, plus why a policy chose what it chose. Read-only, behind the dev route, and it respects sealed secrets (shows IDs, not truths). Reason: with chance everywhere, every surprise needs to be explainable when debugging | ACCOUNT FOR NOW: with the F1 runner |
| LSD350 | **Calibrate odds against the book.** Run canon fights and canon days at pull 0 across many seeds and compare rates (the lead survives, an ally flees, a witness talks) with what the book shows (LSD236). Large gaps mean a factor or a goal weight is wrong, not that pull should hide it. Reason: chance that keeps contradicting the book means the mechanisms are off | LATER/DELEGATE: Luna lane after F1, script-run, done when a rate table exists for ch1-24 fights |

## 34. Character memory: how to build it and what it changes (Weibao 2026-10-29; proposal)

Weibao: "how to even implement memory for characters and more, and how that influences things?" Code checked
2026-10-29: relationships already keep capped per-pair memories by source (`relationshipView`, `relationshipFacts` in
`src/relationship_view.js`, with a household source); `src/people_knowledge.js` holds who knows what; the player's
remembered life is keyed memory messages (`src/memory_messages.js`). Rumour along bonds is LSD37, sparse knowledge is
LSD144, and the step `witnesses` field is LSD196. This round joins them; it does not start a new store.

| Code | Line | Disposition |
| --- | --- | --- |
| LSD351 | **A memory is a pointer plus the holder's version.** The world keeps one fact log; a person's memory is a small record pointing at a fact: what they think happened, when, how they know (saw, heard from someone, worked out), how sure, how they felt, and how vivid it is now. Witnessing a step writes these pointers for its `witnesses` (LSD196) at almost no cost. Reason: one truth plus many versions is what lets people disagree, lie and be wrong | ACCOUNT FOR NOW: extend `people_knowledge.js` and relationship memories, not a third store |
| LSD352 | **Three layers: episodes, beliefs, bonds.** Episodes are specific ("he pulled me out of the river"). Beliefs are derived from episodes ("he is reliable", "the inspector is dangerous"). Bond values are derived too (LSD301). Episodes explain beliefs and bonds, so a reaction can name its reason (LSD333). Reason: a number alone cannot say why someone trusts you | ACCOUNT FOR NOW |
| LSD353 | **Who gets detailed memory.** Named cast, bonded allies, surviving enemies and anyone the player has dealt with keep episodes. Background people keep group impressions ("the dockworkers think you are trouble"). Someone promoted to named keeps the impression as their first memory. Reason: persistence is selective (CHARACTERS_AND_WORLD_EVENTS), and this bounds save size | ACCOUNT FOR NOW |
| LSD354 | **Memory fades by rule, and recall is chance.** Vividness falls with time on a fixed curve, slower for strong feeling, repetition and harm; trauma barely fades. A faded memory is not deleted. When something cues it (the same face, place, smell or topic), a keyed recall check (LSD335) on vividness and how well the cue matches decides whether it comes back. Reason: forgetting is part of people, and a returning memory is a story beat | ACCOUNT FOR NOW |
| LSD355 | **Memory can be wrong.** Hearsay carries the teller's slant and lower certainty (LSD37 fidelity); stress at the time blurs detail; mind-affecting mechanisms (where a world has them) can plant, edit or erase a memory with their cost (AD38). The truth stays in the fact log, so an investigation can find the gap. Reason: wrong memories make testimony, alibis and deception mechanical | ACCOUNT FOR NOW |
| LSD356 | **Telling copies a memory.** Gossip, testimony and confession copy a memory to the listener with source = teller, certainty lowered, and possibly bent by the teller's goals (LSD324). It travels only where people actually meet (LSD37, the cast's schedule). Reason: rumour, reputation and being found out all come from this one move | ACCOUNT FOR NOW |
| LSD357 | **What memory changes.** Goals (gratitude, revenge, fear of a repeat, LSD324); reaction draws (LSD303 reads the bond plus the specific episodes the situation cues); topics people raise or avoid; recognition through a disguise (memory of a face or voice against the disguise, a perception check); testimony to investigators (LSD344); prices and manner (LSD51); and fights, since an enemy who saw your trick reads it better the second time (LSD342). Reason: memory is worth its cost only because it changes behaviour | ACCOUNT FOR NOW |
| LSD358 | **The character's memory is not the player's.** Checks ask what the character remembers, not what Weibao read in the log. Amnesia, possession, a borrowed body or a transmigrated soul split the two on purpose (AD11: memories and the base cheat carry). The chronicle (`memory_messages.js`) is the character's remembered life, so it can be missing or wrong when the mechanism says so. Reason: knowing more than your character is a mechanic in many book worlds, and it needs both sides recorded | ACCOUNT FOR NOW |
| LSD359 | **Canon people remember canon.** At canon start a book character holds the memories the book gives them by that date, as canon facts with pull (LSD233). The player's changes write new episodes on top, and their later choices read both. Reason: book people must behave like themselves before and after the player meets them | ACCOUNT FOR NOW: with the cast packs |
| LSD360 | **Saving and compaction.** Episodes are saved events with pointers; beliefs and vividness are derived from them and the date (LSD301, LSD245). Compaction (LSD302) folds old faint episodes into a belief or impression. That loss of detail is acceptable because it is forgetting, except where a later canon need reserves the memory (LSD109). Reason: saves stay small, and what is lost is what a person would lose | ACCOUNT FOR NOW |
| LSD361 | **First slice.** Five memory kinds (helped me, harmed me, betrayed me, saw them do X, was told Y) for bonded allies, named cast and surviving enemies, on the existing relationship memories; fade curve and recall check; gossip copying along bonds. Done when one ally's reaction changes because of a remembered episode, names that episode, and survives save and reload | ACCOUNT FOR NOW: F1 scope |
| LSD362 | **Inspect it.** The dev inspector (LSD349) answers "what does X remember about Y, how sure, and from whom", with sealed facts shown by ID. Reason: memory bugs look like random behaviour without this view | ACCOUNT FOR NOW: with LSD349 |

## 35. Rerolls, bystanders, backing out, and what memory costs to store (Weibao 2026-10-29; proposal)

Weibao: "reroll each time it makes sense for a re roll? ... how to even implement bystanders? LSD345 might not always
be true but they can try and back out with varying consequences ... More rolls? ... So will memories be lines of text
that has impacts on certain stat and stuff? Wont memory cause storage balooning?" Code checked 2026-10-29:
`src/life_events.js` already caps village memory (`MEMORY_CAP = 12` per person, `EVENT_CAP = 24`, `BROADCAST_CAP = 8`),
and `src/memory_messages.js` stores memories as a key plus a small payload, rendered to text on read.

**When to reroll**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD363 | **Reroll when something real changed.** A draw's key includes what the attempt depends on: the minute, the method, the tool, who helps and the state of the target. A retry after time passes, with another tool, another approach or a helper is a new draw. The same attempt at the same moment with nothing changed gives the same answer, so clicking again does nothing. Clarifies LSD336 and LSD328 | ACCOUNT FOR NOW: key helper in P1 |
| LSD364 | **Retries cost, and searches converge.** Each retry spends time and adds fatigue and strain (LSD343), and a noisy retry can be noticed. For searching, a hidden thing that is there is found with enough effort (the draw is against cumulative effort, not a fresh coin each time); for opposed acts (a lock, a person) the target can change too (the guard gets suspicious). Reason: trying again should be a choice with a price, not a slot machine | ACCOUNT FOR NOW |
| LSD365 | **Changing things reroll on their own clock.** Mood (daily), weather (hours), prices (weekly), a rumour's reach (daily, LSD37) each have a period; the key includes the period, so a new day can bring a new answer. Fixed facts (LSD336) have no clock. Reason: some things really are different tomorrow, and some never are | ACCOUNT FOR NOW |

**Bystanders**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD366 | **A crowd is one record, not many people.** When a fight starts in a place, a crowd record is generated from who is around at that hour (the place's schedule and any event on): size, role mix (vendors, workers, children, a constable), and mood. It acts as one agent on the tempo clock: each step, a draw splits it into fleeing, frozen, watching, helping and fetching the authorities, by role and how bad it looks. Reason: one record per crowd keeps a street fight cheap | ACCOUNT FOR NOW: P6 |
| LSD367 | **Individuals step out of the crowd only when they matter.** Someone who intervenes, gets hurt, picks up a dropped item or sees a face clearly is promoted to a person, keyed by place, time and slot so replay gives the same person (LSD139). The rest stay a count. Reason: lazy promotion is how a nameless witness can become a later plot without storing everyone | ACCOUNT FOR NOW |
| LSD368 | **Backing out is an attempt with consequences.** Revises LSD345. Any side can try to disengage, flee, yield or bargain to leave, and the other side may refuse by its own goals (revenge, silencing a witness, a bounty). Costs vary: a free hit as you turn, a pursuit check, dropped gear or loot, an ally left behind (LSD331), lost face (reputation), being followed home (tracking, CBR12), or a grudge that comes back later. Reason: leaving a fight is often the right choice, and its price is a story | ACCOUNT FOR NOW |
| LSD369 | **Bystanders raise the stakes.** Harm to a bystander writes facts (injury, law, reputation); bystanders can be shields or hostages; the authorities' arrival time is a draw on how close and how bothered they are. The crowd's memory is one group impression plus the promoted witnesses' episodes; when an investigator asks, a draw decides how many come forward and what they say (LSD355). Reason: a public fight has a public aftermath | ACCOUNT FOR NOW |

**More rolls, and a limit on rolls**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD370 | **Further places chance belongs.** Pursuit and losing a tail, tracking later, recognition, a morale break, where a wound lands and how bad, the state of loot (cracked, bloodied), a stray shot hitting something, an authority's response, a rumour's reach. Each uses the one resolver (LSD335) | ACCOUNT FOR NOW: as each system lands |
| LSD371 | **A roll must earn its place.** Roll only where the result is uncertain to the people in it, changes something visible, and comes from named factors. If none of those, decide it by rule. Reason: too many rolls make outcomes noise (LSD337) and cost time and checks | ACCOUNT FOR NOW |

**What a memory is in the save, and storage**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD372 | **Memories are small structured records, not lines of text.** One record: kind, about whom, the fact it points to, source (saw, told by whom, worked out), certainty, feeling, day. About 30 to 40 bytes as a compact tuple. Text is rendered from the kind and payload when shown, as `memory_messages.js` already does, so changing the wording or the language changes no save. Reason: text is the most expensive and least checkable way to store a memory | ACCOUNT FOR NOW: P2 schema |
| LSD373 | **Memories do not add to stats directly; derived values read them.** A bond axis is the canon baseline plus the sum over remembered episodes of kind weight × feeling × current vividness (LSD301, LSD352), computed when needed. Where a memory really changes someone lastingly (trauma lowers nerve, a lesson raises a skill), that change is its own saved delta and the memory explains it. Reason: one source of truth, and fading a memory then naturally softens its effect | ACCOUNT FOR NOW |
| LSD374 | **Storage stays bounded by five rules.** (1) Canon memories are not saved; they are derived from the pack and the date (LSD359, LSD245), and only the player's changes are saved. (2) Pointers, not copies: a gossip copy is one record pointing at the same fact. (3) Per-person caps by importance, like the existing `MEMORY_CAP = 12`: keep the strongest and most recent; push lesser ones into a belief or impression (LSD360). (4) Crowds and background people keep group impressions only (LSD353, LSD366). (5) Vividness and beliefs are derived from the day and feeling, never saved | ACCOUNT FOR NOW |
| LSD375 | **Size budget, estimated (not measured).** 300 named people × a cap of 40 episodes × about 35 bytes is about 420 KB before compression, and much less in practice because most cast members meet the player rarely. That fits inside browser storage with room to spare. P2 adds a test that builds a worst-case save at the caps and checks it stays under a stated budget. Reason: the risk is real only if caps are missing, so the test pins the caps | ACCOUNT FOR NOW: size test in P2 |

## 36. Implementation plan for sections 30-35 (Weibao 2026-10-29; proposal)

Weibao: "Save accordingly and plan implement." Order follows dependencies; each phase is one playable or testable
slice (AGENTS.md: finish one slice before the next). Lanes default to Codex Luna (ON14) with focused tests only; the
committer runs the full gates (AD36). Browser checks at 1920x1080 for anything visible (UR rules). Nothing here is
dispatched until Weibao says go.

| Code | Phase | Scope and files | Done check |
| --- | --- | --- | --- |
| LSD376 | **P1 Chance core** | Key helper that composes subject, period and changed factors (LSD363, LSD365); stratified streams for batches (LSD338); read-only check record for the inspector (LSD349). `src/check_resolver.js`, `src/seeded_streams.js`, their tests | Existing check golden fixture unchanged; a retry with a changed factor gives a new draw and an unchanged retry does not; a 100-run batch at 30% lands within 2 points |
| LSD377 | **P2 Memory records** then **P3 Memory effects** | P2: the compact record (LSD372), fade curve, recall check, caps and folding (LSD354, LSD374), save migration, on `src/people_knowledge.js` and the relationship memories. P3: bond axes derived from episodes (LSD373), a reaction that names its episode (LSD333, LSD352), gossip copies along bonds (LSD356) | Save, reload and import round trip; the worst-case size test passes its budget; one ally reacts differently because of a remembered episode and names it, in a browser at 1920x1080 |
| LSD378 | **P4-P8 Fights and the world around them** | P4 tempo runner on `src/native_battle.js` with waiting fights, surprise and mishap conditions (LSD307-LSD317, LSD341-LSD343). P5 allies by goals, orders and plans with chance (LSD319-LSD327). P6 crowd record and promotion (LSD366-LSD369). P7 backing out (LSD368). P8 calibration script against ch1-24 fights (LSD350) | P4: a fight saved mid-tempo resumes exactly after reload. P5: a hireling flees by goals in a replayable seed. P6: a witness promoted in a street fight is the same person on replay and remembers the player. P7: fleeing with each cost reachable. P8: a rate table exists |

## 37. Game-master craft and subtle systems, recorded while cheap (Weibao 2026-10-29; proposal)

Weibao: "MOre subtle systems and idea to record now while things are cheap? ideas from D&D game masters? Other
stuff?" Checked 2026-10-29: the [rulebooks and GM considerations](../../../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md)
already hold the rulebook-level ideas (tag decks, faction turns, downtime, oracles and "pay the price", rulings ledger,
storyteller styles, GM screen, session zero, clocks, three-clue rule, lazy-GM secrets). This round adds table craft
those rows do not cover and applies it to the lead's life. Technique names are common tabletop practice, from general
knowledge, not re-verified this pass.

**How a good GM handles chance and information**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD379 | **Passive values for background noticing.** Noticing things nobody is actively looking for uses a fixed passive value (the 5e passive-perception idea), not a roll each minute; a roll happens only when someone actively searches. Reason: idle and montage time would otherwise run thousands of meaningless rolls (LSD371), and passive values make the result stable and testable | ACCOUNT FOR NOW: P1 |
| LSD380 | **Secret rolls do not leak.** A failed search or read must look the same as there being nothing there: no "you notice nothing" only when something exists, no odds shown for a check the character does not know is happening. Reason: a leaky failure tells the player a secret exists, which breaks sealed secrets by the back door | ACCOUNT FOR NOW: UI and inspector rule |
| LSD381 | **Let it ride.** Once a check settles a question, it stands until the situation changes (the Burning Wheel rule); asking again is not a new chance. This is LSD363 said as a table habit, and it applies to talk and research as much as to locks | ACCOUNT FOR NOW |
| LSD382 | **First impressions are a reaction draw.** When two people meet, a keyed reaction (the old-school 2d6 reaction idea) sets the starting attitude from goals, appearance, reputation and mood, then stays as a fixed fact until events change it (LSD336). Reason: strangers should not all start neutral | ACCOUNT FOR NOW: with P3 |
| LSD383 | **Tells and reads in talk, not only fights.** A lie, a bluff or a hidden worry leaks tells at the liar's skill; reading them is the listener's check (LSD342 for conversation). Reason: social play needs the same feint-and-read depth as combat | ACCOUNT FOR NOW |

**How a good GM paces danger**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD384 | **Telegraph before lethal.** Serious danger shows signs first at the character's perception (a smell, a wrong silence, a warning from a neighbour), so death or maiming is rarely a surprise roll. Ties CBR27 and fate's traces (LSD240). Reason: a fair death is one the player could have seen coming | ACCOUNT FOR NOW |
| LSD385 | **Soft move, then hard move.** A threat first warns or worsens a position (soft); if ignored, it lands (hard), as Apocalypse World's moves run. Idle threats escalate the same way over days: a debt collector's note, then a visit, then a beating. Reason: escalation gives the player time to act and makes consequences readable | ACCOUNT FOR NOW: with EP6 clocks |
| LSD386 | **One time-pressure die per interval.** For dangerous stretches (a search in a ruin, a night watch, a long tail), one draw per interval picks from a few results: an encounter, a sign of one, a resource running down, fatigue, or a local change (the "overloaded encounter die" idea). Reason: one draw folds several pressures together, cheap for idle and lively for active play | LATER: with sites and exploration (SR rules) |
| LSD387 | **The world does not scale to you, but it warns.** Threats are what the place holds, not matched to the player's strength; LSD384 telegraphs the mismatch. Reason: balance is not forced (AGENTS.md design framing), and running away is a real choice (LSD368) | ACCOUNT FOR NOW |

**How a good GM keeps story moving**

*Deferred by Weibao 2026-10-29: "THe keeping story going might not be important to us right noe". LSD388-LSD392 stay as recorded ideas; none is a gate for P1-P8.*

| Code | Line | Disposition |
| --- | --- | --- |
| LSD388 | **Clues and canon beats relocate when skipped.** If the player bypasses the scene that carried a needed clue or meeting, the fact moves to another route (another person, place or day) when its mechanisms allow, like a lazy GM's location-free secrets. This is how a canon thread's redundancy works (LSD243), and robust facts find a new route while fragile ones just fail. Reason: the story should not dead-end on a missed door | DEFERRED (2026-10-29), was: ACCOUNT FOR NOW: with threads |
| LSD389 | **Flashback preparation.** The player can declare "I had bought a spare" or "I left a note" afterwards, if the log shows the character had the time, money and reason then; the cost is paid now, back-dated. As in Blades in the Dark flashbacks, with a check against the real log rather than a stress budget. Reason: it removes tedious pre-planning without breaking causality | DEFERRED (2026-10-29), was: LATER: needs P2 log reads |
| LSD390 | **Spotlight for companions.** The director gives each bonded ally a scene of their own now and then (their goal, worry or past comes up), using their goals and memories (LSD324, LSD351). Reason: allies feel like people when the story turns to them sometimes | DEFERRED (2026-10-29), was: LATER: with the director (EP7) |
| LSD391 | **Off-screen moves for survivors.** A named enemy who escaped does something between meetings (heals, gathers help, moves, plots), on the slow owner (RB2) with their goals and memories of the fight. Reason: a survivor who does nothing makes escape free | DEFERRED (2026-10-29), was: ACCOUNT FOR NOW: with P7 |
| LSD392 | **Acting in character pays a little.** Choices that follow the character's stated beliefs, or the lead's book behaviour in a canon run, earn a small spendable resource (Burning Wheel beliefs, D&D inspiration), spent on a reroll of a margin draw or a better read. Under AD38 it is a world dial with an in-world reason (resolve, conviction), not a meta currency everywhere. Reason: it rewards playing the person, and gives canon play a reason beyond pull | DEFERRED (2026-10-29), was: LATER: design note |

*Note 2026-10-29 (Weibao asked whether separate chats should study procedural systems in depth):* the generation
contract already exists ([GR1-GR17 and SB rows](../../../GENERATION_FOUNDATION_RULES_2026-10-14.md)) with live code in
`src/gen_kit.js`, `src/keyed_generation.js`, `src/generated_people.js`, `src/cast_schedule.js` and
`src/world_pack_population.js`. GR2 addressed draws, GR3 freeze on reveal and GR4 lazy addresses are the same ideas as
LSD336, LSD363 and LSD367. So no new procedural deep dive is proposed. P1 (LSD376) starts with a short fit map: each
of LSD335-LSD387 against its GR row and existing module, with gaps named, before any code.

## 38. Traits shape memory: grudges, gratitude, gossip, forgiveness (Weibao 2026-10-29; proposal)

Weibao: "what about traits and more? people who hold grudges holding grudges and more? future deepening of these and
more?" Code checked 2026-10-29: `src/generated_people.js` already gives people 2-3 traits (kind, curious, patient,
practical, sociable, reserved) that the player discovers (`knownTraits`); `src/lineage_traits.js` holds inherited
traits; `src/person_memory.js` (MR1) has fixed fade, telling-loss and cap constants that this round turns into dials.

| Code | Line | Disposition |
| --- | --- | --- |
| LSD393 | **Traits are dials on the memory functions, not new code paths.** Each trait maps to parameters: fade speed per kind, how readily a cue recalls a kind, how often they tell and to whom, how much they trust hearsay. MR1's constants become the defaults, and a per-holder temperament read (a port, derived from traits, never saved separately) overrides them. Trait words live in a registry a world extends (LSD305) | ACCOUNT FOR NOW: port in P3b |
| LSD394 | **Grudge holders hold grudges.** For them, harm and betrayal fade very slowly, harm cues recall easily, and an apology counts for little. Forgiving people let harm fade faster, and faster again after amends. Same history, different person, different behaviour, replayable | ACCOUNT FOR NOW |
| LSD395 | **Gratitude mirrors it.** Loyal people keep help vivid for years; the ungrateful forget it in days. A favour is worth what the person you did it for will remember | ACCOUNT FOR NOW |
| LSD396 | **Forgiveness is an event, not a deletion.** Apology, restitution, time, a shared hardship or a go-between writes an `amends` episode that lowers the harm episode's weight in derived reads (LSD373). The harm stays remembered. Each path has a cost, and how much it counts depends on the holder's traits. Default: most people forgive something with enough amends; dial: a world or a person where some things are never forgiven, with the reason stated | ACCOUNT FOR NOW |
| LSD397 | **Memory follows mood and temperament.** Pessimists recall harm more readily, the vain remember praise, the fearful believe rumours of threats faster. Current mood tilts recall toward memories of the same feeling. Reason: people do not remember evenly | LATER: needs a mood state |
| LSD398 | **Gossip has a temperament.** Sociable people tell more often and to more people; reserved ones rarely; liars bend the feeling as they tell; a teller known to be reliable is believed more; a gullible listener raises certainty, a sceptic lowers it (LSD356) | ACCOUNT FOR NOW |
| LSD399 | **Traits are discovered by seeing them work.** The existing `knownTraits` fills when the player sees a trait act ("she still brings up the well, a year on"), so a grudge holder reveals themselves by holding one (LSD333). Appraisal can guess early, and can be wrong | ACCOUNT FOR NOW |
| LSD400 | **Traits drift from what happens.** Repeated betrayal makes someone suspicious, being rescued many times makes them trusting, trauma can add a trait. Each drift is a dated delta with its cause (LSD301), slow, and inherited traits (`lineage_traits.js`) set the starting point. Reason: people are shaped by their lives | LATER |
| LSD401 | **A strong grudge becomes a goal.** In a grudge holder, a vivid harm memory turns into a revenge goal (LSD324) that waits for a chance rather than striking at once. Told to kin, it carries high certainty (kin trust kin), so a feud can outlive the first person who held it (with heirs, `heir_inheritance.js`) | ACCOUNT FOR NOW |
| LSD402 | **Grudges spread to groups.** For some traits, harm from one member of a group also writes an impression of the group (LSD353), which is how prejudice and loyalty to a side form, and how one fight can sour a street | LATER |
| LSD403 | **Your own character remembers by temperament too.** The player character's traits tune their own memory, and guilt is a harm episode about oneself. Character memory stays separate from what Weibao read (LSD358) | LATER |
| LSD404 | **Canon people keep canon temperaments.** A book character's traits come from the readings with canon pull (LSD233), so someone the book shows holding a grudge holds it in play unless something changes them | ACCOUNT FOR NOW: with the cast packs |
| LSD405 | **Keep it cheap and testable.** Traits are multipliers on functions that already exist; no per-trait branches. One test per trait: the same history with and without the trait gives different vividness or a different line, and replays the same | ACCOUNT FOR NOW |
| LSD406 | **Deeper later, ranked.** (1) Short-term emotions feeding recall and reactions. (2) More bond axes kept apart: affection, respect, fear, trust. (3) Secrets kept, traded and used for blackmail. (4) Shared memory of a place or group: a famine, a festival, a local legend. (5) Dreams and nightmares replaying vivid harm. Further: memory of places (homesickness), memory decline with age, false memories from mind powers (LSD355) | LATER |
| LSD407 | **Plan: P3b trait temperament.** After MR2 lands, a small lane adds the temperament port to `person_memory.js`, maps the six existing trait words and a `grudging`/`forgiving` pair, adds `amends`, and drives LSD394-LSD396, LSD398, LSD399 and LSD401 through the MR2 route. Done when two people with the same history and different traits show different lines in the browser at 1920x1080, through save and reload | ACCOUNT FOR NOW: after MR2 |

## 39. Loyalty that grows, severity, keeping quiet, and the deterministic shape of it (Weibao 2026-10-29; proposal)

Weibao: "loyalty can go up and more? other subtle interactions and more? Severity of events and more? warning people
not to say things and other stuff and more? Procedural and deterministic stuff?" Code checked 2026-10-29: a promise
situation already writes trust changes (`src/promise_content.js`); vows and pledges already trade a cost for a bond or
bonus and leave a scar when broken (`src/vow_rules.js`, `src/pledges.js`). These rows build on those and on the MR1
memory records.

**Loyalty**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD408 | **Loyalty is earned, with diminishing returns.** It is its own axis, apart from liking (you can like someone you would not risk anything for). Repeated small favours add less each time; risk taken for someone, shared hardship and kept promises add a lot; time together adds slowly. It is derived from episodes (LSD373), so it replays | ACCOUNT FOR NOW |
| LSD409 | **Loyalty is proven by tests.** A test is a situation where staying costs them: danger, a bribe, a rival's better offer, a secret worth selling. Passing writes an episode that raises loyalty on both sides; failing writes a betrayal. Untested loyalty is shown as a guess (LSD340) | ACCOUNT FOR NOW |
| LSD410 | **Favours create debts.** Help writes a felt obligation that fades; some traits feel debts strongly; repaying clears it; a debt left unpaid sours into resentment. Promises and pledges are the formal version (`promise_content.js`, `pledges.js`) | ACCOUNT FOR NOW |
| LSD411 | **Loyalty has objects, and they conflict.** To a person, a family, a group or a cause. When two pull opposite ways, the ranked goals (LSD324) decide, and the choice writes episodes for both sides | ACCOUNT FOR NOW |

**Severity**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD412 | **Events have severity rungs.** Trivial, minor, serious, grave, life-changing. The rung sets the feeling band, how slowly it fades, how far it travels as gossip (household, street, town), and whether it can become a goal. The rung comes from a table over the effect (harm rung LSD283, money as a share of the person's wealth, public or private), not from authoring each event | ACCOUNT FOR NOW: severity table in P3c |
| LSD413 | **Severity is relative to the person.** Ten coins is grave to a labourer and trivial to a merchant; an insult cuts the proud deeper; harm to a child is worse to its parent. Computed from the holder's state and traits | ACCOUNT FOR NOW |
| LSD414 | **Intent and context change it.** Accident or deliberate, public or private, provoked or not, by a friend or a stranger (a friend's harm counts as betrayal, scaled by the bond). The holder judges intent at their own perception and can misjudge it (LSD326) | ACCOUNT FOR NOW |
| LSD415 | **Responses scale with severity.** A minor slight gets a cold shoulder, a grave harm can start a revenge goal (LSD401). Over-reacting is a trait (hot-tempered), not the default | ACCOUNT FOR NOW |
| LSD416 | **Small things add up.** Many minor slights cross a threshold into serious: the last straw. The sum is over current weights, so time can also pull it back under | ACCOUNT FOR NOW |

**Keeping quiet, warnings and lies**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD417 | **Asking for silence marks the memory.** "Don't tell anyone" is a speech act that flags the listener's episode with who asked and whether they promised. When a chance to tell comes up, keeping quiet is weighed: bond to the asker against bond to the listener, traits (discreet, sociable), the severity, fear of the asker, any reward on offer | ACCOUNT FOR NOW: silence flag in P3c |
| LSD418 | **Ways to secure silence, each with its mechanism and price.** Ask (bond), promise (trust), bribe (greed; can be outbid), threaten (fear; writes harm and may start a grudge), an oath or binding where the world has one (AD38), keep witnesses from existing, or worse. Each leaves its own traces | ACCOUNT FOR NOW |
| LSD419 | **Pressure breaks silence.** Questioning, drink, a better offer, guilt, or the confidant's own confidant. The leak check is keyed by holder, secret, listener and situation, and leaks can be partial (bent, unsure) | ACCOUNT FOR NOW |
| LSD420 | **A broken confidence is a betrayal once found out,** and how it is found out is itself a trail: whoever repeats it names a source. Keeping a costly secret is a loyalty test passed (LSD409) | ACCOUNT FOR NOW |
| LSD421 | **Warnings go the other way too.** Someone tells the player "don't mention the inspector to her": the player learns another person's sore spot, and ignoring the warning has the predicted cost. Warnings are knowledge with a source like any other | ACCOUNT FOR NOW |
| LSD422 | **Lies are claims, not facts.** A cover story or a lie is a claim in the log that differs from the fact; the listener's memory points at the claim. Investigators, and the player, can compare claims with each other and with traces (LSD355). Reason: deception needs a place to live that is not the truth | ACCOUNT FOR NOW |

**Procedural and deterministic shape**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD423 | **Save little, derive the rest, key every draw.** Saved: episodes, the silence flag (asker and promised, a small addition to MR1's tuple as schema 2 with a migration), and claims. Derived on read: loyalty, debt, severity, judged intent, the running total of slights. Keyed draws via `checkKey`: holder, subject or secret, listener, situation and period. Severity and act-weight tables are world data with `id@rev` (GR10), so a world tunes them without code | ACCOUNT FOR NOW |
| LSD424 | **Test each rule by replay, and explain it.** Same history gives the same outcome; changing one factor changes only what it reaches (LSD244). The inspector (LSD349) answers "why did she tell" with the weighed factors. Plan: P3c lane after P3b adds the severity table, the loyalty and debt reads and the silence flag, through the promise route. Done when a person told to keep quiet keeps or breaks it for stated reasons that change with bond and bribe, through save and reload | ACCOUNT FOR NOW: after P3b |

## 40. Determinism, enemies, where numbers come from, and what deriving costs (Weibao 2026-10-29; proposal)

Weibao: "everything is deterministic and more? Someone who is against you, might not be loyal to you and might be very
ungrateful ... how should we determin numerical stuff and more? Would computed cost too much long term? The
computations would need the stuff leading up to those to be saved right?" Measured 2026-10-29 by MR1: the worst-case
memory slice at the caps (300 people x 40 episodes) is 499,711 bytes.

**Deterministic, not predictable**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD425 | **Deterministic means same seed and same history give the same result.** Each life gets its own seed at its start; every draw is keyed by what it is about (LSD55, LSD363). That gives replay, tests and fair saves. It is not predictability: the player does not see the seed or the draws, so outcomes still feel uncertain, and a new life is a new seed. Dial: a world or a player may choose a fresh seed per day for more surprise, recorded in the save so replay still works | ACCOUNT FOR NOW |
| LSD426 | **What is not deterministic stays outside the rules.** Real time between sessions only matters through the game clock; the order the player clicks things only matters through game time; nothing reads wall-clock time, frame timing or call order (LSD139). Reason: these are the usual ways determinism leaks | ACCOUNT FOR NOW: check in the inspector tests |

**People who are against you**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD427 | **Help from someone you oppose is read differently.** The holder judges the helper's intent (LSD414): from an enemy, help is suspected ("what is his angle?"), discounted, or even resented (owing an enemy is humiliating for the proud). The same act writes a smaller or a negative episode. Reason: gratitude depends on who gives | ACCOUNT FOR NOW |
| LSD428 | **Opposed goals cap loyalty.** While someone's goals run against yours (a rival for the same post, a side in a feud), loyalty to you stays low however you treat them, and an ungrateful temperament (LSD395) lowers it further. Kindness can still move liking and debt | ACCOUNT FOR NOW |
| LSD429 | **Turning an enemy is possible, and hard.** It takes repeated acts that cost you, grave enough to count (LSD412), seen by them as sincere, often with a change in the goal that set you apart (the rivalry ends, a shared threat appears). Some temperaments resist it. Reason: redemption arcs should be earned and readable | ACCOUNT FOR NOW |
| LSD430 | **Being against someone is derived too.** "Against you" is the sum of opposed goals and negative episodes, not a saved flag, so it can soften or harden as things happen. Factions and families can set a starting stance (LSD411) | ACCOUNT FOR NOW |

**Where numbers come from**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD431 | **Use human-readable units.** Fades as half-lives in days, chances as percent, feelings on -100 to 100 with named bands, weights as small integers. Each constant in a world table carries a one-line reason ("harm half-life 120 days: people remember being hurt for months"). Reason: a number a person can read is a number a person can tune | ACCOUNT FOR NOW |
| LSD432 | **Start from round defaults, then tune by targets.** Each rule gets a target behaviour stated in words and a replay test that measures it: "a grudge holder is still cold a year later", "a stranger's small favour is forgotten in a month", "a friend's betrayal ends the friendship unless amended". Tune constants until the targets hold, never until a single run looks right | ACCOUNT FOR NOW: target tests in P3b and P3c |
| LSD433 | **Calibrate against the book where it shows behaviour.** Where the readings show how long someone stayed angry, who forgave whom and how fast word travelled, those become targets too (LSD350). Book targets win over taste when they conflict, for that world | LATER: with the calibration script |
| LSD434 | **Avoid false precision.** Integers and bands, not long decimals; show the player words, not numbers (LSD340). A sensitivity check moves each constant up and down by a quarter and records which targets break, so the fragile constants are known | ACCOUNT FOR NOW: one sweep per table |
| LSD435 | **Numbers are per world, tables have revisions.** A world overlays the core table (GR8) and each table carries `id@rev` (GR10). Changing a weight changes every derived value in every save that reads that revision, so a save records the revisions it was made under, and moving to a new revision is a stated migration, not a silent shift | ACCOUNT FOR NOW |

**What deriving costs, and what must be saved**

| Code | Line | Disposition |
| --- | --- | --- |
| LSD436 | **Yes, the inputs must be saved; the caps keep them bounded.** Derived values need the episodes they come from, so episodes are saved. Caps (40 per person, 300 people) plus folding into impressions keep the inputs bounded for a whole lifetime and beyond: a decades-long life still has at most 40 records per person, with the old ones summarised. The measured worst case is just under 500 KB | ACCOUNT FOR NOW |
| LSD437 | **Reads are cheap; loops over everyone are not.** One bond read sums at most 40 terms. The risk is reading every pair every minute. So derive lazily, only when someone is observed, decides or is cued (LSD242), and cache per holder, subject and day, cleared when a new episode for that pair lands | ACCOUNT FOR NOW: cache in P3 or P3b if the route needs it |
| LSD438 | **Batch the background.** Gossip and other daily steps run once per game day per person with a daily budget (GR11), and offline catch-up runs them in day batches. A budget hit defers work to the next day rather than skipping it | ACCOUNT FOR NOW |
| LSD439 | **Measure it.** A benchmark test derives every bond for 300 people at the caps and asserts a time budget (start at 50 ms on the dev machine); a second asserts that a 30-day catch-up stays within its budget. Reason: cost claims should be numbers from this code, not estimates | ACCOUNT FOR NOW: add with P3b |
| LSD440 | **Deriving beats saving totals for this game.** Saved totals drift from their causes, need migrations whenever a formula changes, and cannot explain themselves. Derived values always match their history and can name why. The trade-off is LSD435: a formula change reaches old saves, so formulas are versioned. Snapshots (LSD302) remain the fallback if a measured cost ever gets too high | ACCOUNT FOR NOW |
