# Lead-life systems: top-down design (2026-10-28)

Weibao: "what about top down design for actions, and subtle systems like fights and results, relationships
stuff and other stuff? alot more should be written somewhere". This is that place for the cast-lives work.

**Status: proposal, with section 12 from Weibao's direction of 2026-10-28.** Codes LSD1-LSD80 are this doc's (prefix checked unused). It applies
[WA45](../../../WORLD_ABSORPTION_RULES.md) (top-down calibrated choice systems, proposed) and AD44 (lead first) to
the life of a book's protagonist. It links the owners that already exist and does not restate them; where an
owner and this doc disagree, the owner wins and this doc is corrected. Every line is a default with a dial and
a reason (AD5, AD38). Owner map checked 2026-10-28 against `docs/RULES_INDEX.md` and `src/`.

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
| LSD65 | **Untaken options stay possible** (corrected): the moves the book did not take are offered at their WA28 rung (a stub with cost, requirement and a plain result, or a gap row). Choosing one changes the inputs, so the pin releases and our model resolves it, with CL21's causal mass still pulling the cast's plans; the run logs it as divergence (WA15, CL150). Reason: OD7, the player's own choice is "we change things", not outside interference | WA28, CL11, CBR30, CL263 | Same idea (replaces the first draft's "disabled") |
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
| LSD71 | **Two engines, one damage core.** Keep the auto-battler for idle and grinding content; add a step-based conflict frame for life and book fights. Both call `combat_math.js` for damage and mitigation, so numbers agree. Reason: rewriting upstream combat risks every existing world; the life fights need steps the auto-battler cannot express |
| LSD72 | **Seed every draw in the frame** through `seeded_streams.js` keys (LSD55); `combat_math.js` already lets the caller pass the random source, so the frame passes a keyed one |
| LSD73 | **A small move vocabulary over means**: approach, keep distance, strike, shoot, block, dodge, grapple, disarm, use an item, use the surroundings, use a power (ABR seam), call out, threaten, yield, flee, hide, finish. Each move reads its means (LSD8) and writes the LSD34 results. Dial: a world adds moves through rows (CL232 frame) |
| LSD74 | **Range bands and position, not a grid**: touching, close, across the room, out of sight; cover and light as place facts. Reason: enough to express a revolver against a knife and a dark alley, cheap to show at 1920×1080 |
| LSD75 | **Morale and fear are the first results**, before health: a clerk's fights mostly end by fear, flight or yielding (CBR2 outcomes already list these) |
| LSD76 | **Three detail tiers; abstract only the first two.** Structural (who, means, order, outcome) is always modelled. Tactical (range, cover, surprise, wound location) is modelled where the move vocabulary reaches. Texture (exact words, sensations, the book's choreography beyond the moves) is not abstracted: it shows as the book pack's text for that step in the lead's Reports, private, never in public code |
| LSD77 | **A step the vocabulary cannot express is a narrated step**, played as the book's step with its effects and a "narrated" label, and run through the fold-loss test (CLR6): if it loses a choice, an input, a witness or an outcome, it is a gap row and becomes build work. Reason: Weibao's worry that much detail is hard to abstract; this keeps the book run playable now and turns each hard detail into a measured gap instead of a guess |
| LSD78 | **Time inside a fight is seconds**, outside it minutes: a fight runs as its own short sub-clock and charges the game clock once at the end (no second clock in the save, AR3) |
| LSD79 | **What the lead knows about the opponent** comes from appraisal levels (MEANS_AND_APPRAISAL); unknown powers show as effects, not names (sealed secrets) |
| LSD80 | **F1 lane scope** (Sol, medium, after D1): the conflict frame with LSD71-LSD79 for the first canon fight the be replay reaches, its narrated-step folds counted, two identical runs, strain logged. Done when that fight replays through ordinary controls to the canon result and every narrated step is in the gap ledger |
