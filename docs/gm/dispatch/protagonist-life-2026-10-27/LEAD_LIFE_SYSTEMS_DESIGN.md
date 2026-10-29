# Lead-life systems: top-down design (2026-10-28)

Weibao: "what about top down design for actions, and subtle systems like fights and results, relationships
stuff and other stuff? alot more should be written somewhere". This is that place for the cast-lives work.

**Status: proposal, with section 12 from Weibao's direction of 2026-10-28.** Codes LSD1-LSD264 are this doc's (prefix checked unused). It applies
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
