# Standing, institutions and law rules

Working defaults 2026-11-10 under AD56 (ideas that open possibilities are welcome), adjustable; the lines listed in the [limiting lines review](audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals until Weibao answers. Drafted as proposals the same day (AD32). Requested by Weibao ("Draft all four", [log](gm/USER_VISION_LOG_2026-11.md#four-more-rulebooks-and-cheats-brought-forward-2026-11-10)). Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers what audiences think of a person, groups and institutions (schools, churches, sects, guilds, governments, companies, gangs), membership, posts and ranks, admission, duties and dues, law, crime, cases and heat. A world may set any line differently with an in-world reason and cost (AD5, AD38, AD46); each row gives the default, the dial and the reason.

Scope, from his direction: "open world options like the option to choose to attack certain people... karma system? Reputation" (2026-10-02, recorded as no moral meter, no crime roster, no automatic global penalty); "consider stuff like reputation and wanted levels? like not paying tax... results in stuff like tax collectors", "I can choose to fight the 'government'", "I am not known so I wont need to pay tax" (2026-11-06); "Reputation system?" (2026-11-08, an idea, not a decision).

Owners and neighbours (linked, not restated): AD6–AD8, AD14 (duties carry by their own rules), AD19, AD30 (titles), AD46 (each world its own standing, law and UI), AD51 (organization ranks named as a shared mechanism); ECR17–ECR23 in [domain rules](DOMAIN_RULES.md#economy-rules) (wealth seen, theft, losses, institutions as data, credit, promises, fraud); GTR8, GTR11, GTR20, GTR25, GTR31–GTR33 in [progression gates](PROGRESSION_GATE_RULES.md) (proposed); SPR19 (audience is not a tie); [TIE22–TIE23](RELATIONSHIP_RULES.md); OB1–OB12, FD14, FD15 in [larger foundations](audits/LARGER_FOUNDATIONS_2026-11-06.md) (proposals, partly built); [groups lane](audits/cross-world-foundations-2026-11-06/LANE_F_GROUPS.md); WPR10–WPR11 (world passes cover roles and law). Code map: [area guide](AREA_GUIDE.md), "Standing and reputation", "Institutions, rank and law", "Work and duties"; it does not yet list `authority.js`, `positions.js`, `organizations.js` or `heat@1`, all of which have callers.

## Terms

| Term | Means | Not |
| --- | --- | --- |
| Audience | A group whose opinion of someone is read (a district, a church, the guild hall) | One person (that is a tie, TIE22) |
| Standing | What an audience thinks, read through `reputationView` | A stored global score |
| Heat | One authority's attention to someone, from acts it knows of | Fame, or a wanted level everyone shares |
| Group | Code word `organization`; player word "group" or the world's own noun | "Party", which means fight helpers |
| Post | A person's place in an institution: role, rank, term, how it ends (`positions.js`) | The group's roster |
| Authority | Whoever has claim, knowledge and reach over a place or person (`authorityOver`) | Whoever the map says rules there |

## Standing

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| STN1 | **Standing is read, not stored as one score.** Each source keeps its own writer; `reputationView` gathers what an audience could know. | Default: a new source registers with `registerReputationSource` under one of the `STANDING_OWNERS` keys and reports only observed acts with evidence. Dial: a world adds an owner key. Reason: seven writers already exist (region, economy, persona, peer, heat, ties, memory); a merged number would need every one to agree, and none of them can. | SPR19, AR3, ECR17 |
| STN2 | **No moral meter.** Acts change standing only with audiences that hear of them, by their own values. | Default: no karma score and no automatic global penalty (his 2026-10-02 reading). Dial: a world with a real cosmic ledger (a heaven that keeps accounts) adds it as an owner with an in-world reason. Reason: a thief admired in the slums and hunted in the church district is the interesting case. | AD6, ECR17 |
| STN3 | **Audiences learn by means.** Word spreads through witnesses, gossip, records and papers, with delay and distortion. | Default: an act reaches an audience through a witness or a record (`authority_witness.js`); unknown acts change nothing. Dial: spread speed and distortion per world and audience. Reason: "I am not known so I wont need to pay tax"; being unknown is a state (OB9). | OB9, KNW rules, AD7 |
| STN4 | **A persona has its own standing.** A mask, alias or second identity collects standing separately, with leak onto the real person when linked. | Default: `persona_standing.js` with its leak factor; a link is a known fact, not a timer. Dial: leak per world. Reason: LOTM's code names and HP's disguises are livelihoods. | AD7, persona_standing |
| STN5 | **Standing shows as words, not numbers.** The player sees how an audience treats them ("the guild clerks know your face"). | Default: a note per audience; numbers only through a means that measures them. Dial: a world with public ranks or scores shows them. Reason: AD8; a visible number turns people into a grind. | AD8, UR70 |

## Groups and posts

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| STN6 | **An institution is world data; absence is valid** (restates ECR20). | Default: a church, school or guild is a group record with a store, posts and an authority row, not a new system per kind (AD51). Dial: a world adds charter dials. Reason: LOTM's churches, Hogwarts' houses and a Gu clan share the shape. | ECR20, AD51 |
| STN7 | **Three records, three jobs.** A post (the person's side: role, rank, term, exit) lives in `positions@1`; the roster, dues and treasury in `organizations@1`; currency and store in `institution_store.js`. | Default: rank is held once, on the post; the roster refers to it. Dial: none proposed. Reason: membership already has three homes; this names what each owns so rank is not copied. | FD15, AR3 |
| STN8 | **Rank and real power can match or diverge.** A rank is a field on a post, issued and revocable by the institution; the holder's actual power is its own fact. | Default: issued by the institution's own route (exam, service, purchase, favour, birth); rank without the power (a noble heir, a figurehead, a bought title) and power without the rank (the hidden master, the outer disciple who outgrew the elders) are both allowed, and either gap is a story people can notice; `faction_rank.js` stays the original game's region band. Dial: a world may derive rank from power or standing (a cultivation realm as rank), keep both, or have no ladder. Reason: Weibao, 2026-11-10: "rank without the power or power without the rank is a trope"; GTR25 keeps an issued rank strippable and forgeable. | GTR25, AD46 |
| STN9 | **Admission is checked once; staying is settled by the owner.** After entry, dues, lapse, expulsion or promotion settle through the post or grant, not by re-reading the entry gate. | Default: GTR11's split; `institution_access.js` grants for scoped, expiring access. Dial: an institution with yearly re-examination adds a clock (GTR31). Reason: a student does not fail out because a stat dipped. | GTR11, GTR31 |
| STN10 | **Same gates for everyone.** NPCs are admitted, promoted and expelled by the same rules. | Default: GTR20. Dial: none. Reason: AD6; a rival's rise should be readable. | GTR20, AD6 |
| STN11 | **Foreign credentials are the receiving world's call.** | Default: not recognised unless an institution has a reason (GTR8). Dial: per institution. Reason: a wizard's certificate means nothing to a sect. | GTR8, WER |
| STN12 | **The player can found, lead and leave.** Founding, recruiting, dues and claiming ground run through `organizations.js`. | Default: founding routes in `organizations_domain.js`; leaving ends the post with an exit kind. Dial: who may found per world. Reason: "or choosing to start a society" (2026-11-06); you can become the authority (OB12). | OB12, Lane F |
| STN13 | **Seats are scarce where the world says so.** Limited places (a cardinal's chair, a prefect badge) live in a world ledger. | Default: GTR33. Dial: per institution. Reason: competition for a seat is a story; unlimited seats remove it. | GTR33 |

## Duties, authority and law

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| STN14 | **An obligation needs claim, knowledge and reach.** Tax, rent, dues and summons apply only where an authority has all three (`authorityOver`). | Default: no known authority, no dues. Dial: a world's surveillance and records raise knowledge. Reason: his 2026-11-06 words; OB8. | OB8, ECR20 |
| STN15 | **Duties are standing orders with choices.** Pay, pay late, skip, bribe where an official takes bribes, hide income where a world allows it. | Default: `recurring_duties.js` policies; idle play never springs a loss the player could not see coming (OB4). Dial: per duty. Reason: ACR, AD19; a choice with a cost beats an auto-deduction. | OB1, OB4, AD19 |
| STN16 | **Heat is per authority and comes from known acts.** A missed duty raises derived heat that falls when paid; a known crime raises stored heat that decays. | Default: `heat.js`; fame and heat stay separate. Dial: decay, informer density, audit rate per world (OB3). Reason: a wanted level in one district says nothing to another; "results in stuff like tax collectors". | OB3, heat.js |
| STN17 | **Escalation comes from people.** Collectors, constables and enforcers act as people with their own clocks; each step is announced and escapable. | Default: `collectorEvents` and `fineEvents` through `consequences.js`; ECR21's forgiving credit; an announced threat may be run-ending (AD50). Dial: harshness per world. Reason: OB2; a faceless penalty is a hidden game over. | OB2, ECR21, AD50 |
| STN18 | **One place-to-authority read feeds the law.** Who rules a place comes from `authority.js`; `law_case.js`'s jurisdiction chain reads it. | Default: wire the two when a lead world first loads a law book; until then `law_case.js` stays unused. Dial: overlapping jurisdictions per world. Reason: two answers to "who rules here" would disagree. | OB8, CX2 |
| STN19 | **Law is a world's rows, decided without dice.** A statute, a detection rule, a ruling and the responses come from the world's law book. | Default: `defineLawBook` rows; MR2 (no chance drawn in law), with evidence and witnesses deciding. Dial: strictness, evidence and enforcers per jurisdiction; a lawless world has none. Reason: a case should be explainable after the fact. | MR2, ECR20, AD46 |
| STN20 | **Strength can refuse authority.** A strong enough person or group can ignore, fight or replace an authority, and the world answers through its own forces. | Default: OB11; the answer grows by its own causes (AD25), not by matching the player. Dial: per world. Reason: "I can choose to fight the 'government'". | OB11, AD25 |
| STN21 | **A promise binds through its enforcer** (restates ECR22), and fraud writes wrong beliefs, not wrong truth (restates ECR23). | Default: contracts ride the duty or Owed ledger (TIE23). Dial: a world's oath magic is an enforcer. Reason: who can make you keep a promise decides what it is worth. | ECR22, ECR23, TIE23 |
| STN22 | **Titles recognise or supply** (restates AD30). | Default: a title says which; a supplied power follows the ability rules. Dial: per world. Reason: SLR40–SLR43. | AD30, SLR40–SLR43 |

## Building a standing slice

1. Name the audience or authority and the ordinary-day caller that reads it (SPR1).
2. Standing: register a reporter (STN1). Posts and groups: extend `positions.js` or `organizations.js` (STN7). Duties: `registerDutySet` (STN15). Heat: add an authority row (STN16).
3. Show the result as words in the right panel (STN5, FBK).
4. Tests: `tests/reputation_view.test.js`, `tests/heat.test.js`, `tests/authority*.test.js`, `tests/law_case.test.js`; browser proof at the desktop viewport (AD43).

## Open details

- Heat, persona and organizations register no standing reporter yet (STN1).
- The overlap owner for rank ladders (Organizations) is a proposal (STN8).
- `law_case.js` has no caller under `src/`, and the witness reader is not wired to `detect` (STN18, STN19).
- `duties_domain.js` and `livelihoods.js` already read `authorityOver`; rent and other per-world sources should be checked the same way (STN14).
- The founder's post has no dissolve exit kind (STN12).
- Faith has a currency (LOTM merit) but no record for protection or standing; the default is an institution, not a faith system (STN6).
- The area guide needs the four missing modules added.
