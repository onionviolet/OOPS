# Powers that act rules

Proposed 2026-11-10 (AD32). Requested by Weibao ("Draft FRC1–FRC3 rulebooks", [log](gm/USER_VISION_LOG_2026-11.md#three-more-rulebooks-and-making-rules-reach-implementation-2026-11-10)); the lines are agent proposals until he accepts them. Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers in-world agents with goals and reach: gods and spirits, faith, prayer and answers, divine and patron gifts, churches as faith (beside churches as institutions, STN6), fate actors such as Heaven's Will, cheat patrons, outside meddlers (system admins, audiences, summoners, the one who sent you), and authorities. They share one shape: something that wants, can detect and touch some facts, and sometimes spends a budget. A world may set any line differently with an in-world reason and cost (AD5, AD38); each row gives the default, the dial and the reason.

What Weibao has said: god-like is a threshold, not a species, and god-likes are scarce, with avatars and fragments giving presence without frequency (2026-10-10, [cosmic events](COSMIC_EVENTS.md#it-depends-on-the-character-weibao-2026-10-10)); prayer and summoning were raised as an idea (W3X17, idea only); no forced weakness (AD55). No standing faith system has been decided. Everything else here is proposal, including the [faith palette](gm/dispatch/procgen-2026-10-13/p31/FAITH.md) (AL1, AL2).

Owners and neighbours (linked, not restated): AD6, AD38, AD51, AD55; [STY24–STY32](STORY_RULES.md#levels-of-fate) (fate levels, reach, budget, conflicts) and the [fixture matrix](gm/causal-endings/FATE_FIXTURE_MATRIX_2026-11-10.md); [STN6, STN14](STANDING_RULES.md) (institutions; claim, knowledge, reach); [CHT5, CHT14](CHEAT_RULES.md) and the [patron-gift terms](CHEAT_COSMOLOGY.md#patron-gifts-what-can-and-cant-be-taken-back); RLEX1–RLEX10, RLFC1–RLFC10, RLEE1, RLAD5 in [relationships and canon](RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md); [KNW12](KNOWLEDGE_RULES.md) (effective means reveal); [coverage audit](audits/FOUNDATIONAL_RULES_COVERAGE_2026-11-10.md) FRC3, FRC16. Code: `src/authority.js` (place claims, knowledge, reach), `src/canon_pull.js` (agents with effects and a budget), `src/institution_store.js` (LOTM merit).

## The shape

An acting power, as a proposal (fields are optional unless the world uses them):

| Field | Means |
| --- | --- |
| kind | god, spirit, fate, patron, authority, admin, audience, regressor, institution, storyteller |
| status | exists, dormant, dead, unknown |
| goals | What it wants; world truths, sealed in play where changed or randomized |
| reach | A rule over world facts: who it can detect, which places, people and kinds of fact it can touch, and its channels (prayer, rite, divination, contract, clergy) |
| knowledge | What it can know about someone, through knownness readers (`authority.js`) |
| budget | Acts, power, favour, or unbudgeted; stated, not forced (AD55) |
| acts | The effect list it declares: restore, substitute, grant, demand, withhold, with the facts each touches |
| terms | For gifts: gift, digested, matured, lease, loan, lien, leash, burdened loan, bound item; who can revoke or sever; what happens if it falls |
| faith face | Optional: rites, doctrine, believers, how it receives (silent, reachable, contested) |
| institution | Optional link to a group record (STN6) |

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| AGT1 | **One shape for every power that acts.** Gods, fate actors, patrons, authorities and admins are acting powers; each keeps its own writer, and they share one record and readers. | Default: the record above, derived on read where possible; saved state is what was spent and what was committed. Dial: how much a world uses. Reason: FRC16; three seams today (`authority.js` place claims, `canon_pull.js` agents, patron terms in the cosmology) describe one thing three ways (AD51). | AD51, FRC16, RLAD5 |
| AGT2 | **A second world validates the shape.** The shared record is built when two worlds use it. | Default: LOTM's church and fate agent plus one other (Reverend Insanity's Heaven's Will, or a D&D cleric's god). Dial: none. Reason: AD51. | AD51 |
| AGT3 | **Reach is a rule over facts, not a number.** An act outside a power's reach is not drawn. | Default: reach names what it can detect and touch; a domain is a named set of facts or kinds inside that rule; "unknown reach" is a valid value the world holds. Dial: per power. Reason: STY26 (W4); fate in code has no reach today (fixture matrix G1). | STY26, STY25 |
| AGT4 | **A budget is stated where the mechanism has one** (AD55). | Default: a power declares its budget kind or "unbudgeted"; code's default of one act per agent (`canon_pull.js:81`) becomes "declared or unbudgeted". Dial: per power. Reason: AD55; a god forced to run out is a forced weakness. | AD55, STY26 |
| AGT5 | **What a power can do is the act list it declares.** It changes the facts its acts name, and nothing else. | Default: a restore fixes only listed facts and a missing route still fails (STY25); a grant writes a card or a fact; a demand creates an obligation through the duty ledger (STN15). Dial: per power. Reason: a power with no stated acts cannot be traced or opposed. | STY25, STN15 |
| AGT6 | **A power's motive is a world truth** (restates STY26). | Default: hidden until learned by means; a changed or randomized motive is sealed in play and goes by ID. Dial: fixed or seeded per instance. Reason: STY26; KNW1. | STY26, KNW1 |
| AGT7 | **Several powers can contest a fact** (restates STY31). | Default: a recorded conflict, resolved by custody, then order of action, then method still available; powers acting on separate facts coexist. Dial: per world. Reason: STY31. | STY31 |

## Faith

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| AGT8 | **Each world declares what prayer can do.** | Default: a prayer law per world: silent, reachable, contested, many patrons, or impersonal ritual. Dial: per world and power. Reason: the faith palette's evidence: D&D's Divine Intervention is a defined feature apart from ordinary prayer; Harry Potter has no general prayer-to-miracle law; LOTM rites do not certify a universal exchange (AL1.b). | AL1, AD46 |
| AGT9 | **Praying, being heard and being answered are three facts.** | Default: the prayer is a practice the character performs; reception is a world truth revealed only by a supported route; an answer is an act (AGT5); silence is a valid result. Dial: per world. Reason: addressing a name proves no receiver (AL1.a). | AL1.a, KNW9 |
| AGT10 | **Believers are people with real acts.** | Default: worship is what believers do (offerings, rites, service, pilgrimage); a belief currency exists only where a world says a power draws on it, then it is a ledger with earned and spent (`auditLedger`). Dial: whether power scales with count, attention or acts. Reason: no universal mechanic in the sources; a fake currency would fix every god's strength. | AL2, institution_store |
| AGT11 | **A church has two faces.** The institution face (posts, store, authority row, STN6) and an optional faith face (what it worships, the rites it runs, what it claims to deliver). | Default: either face can exist alone; a church may serve a god who never answers. Dial: per church. Reason: STN6 says absence is valid; LOTM's Nighthawks are an employer and a shop today, with no faith face in code. | STN6, AL2 |
| AGT12 | **Doctrine, heresy and pilgrimage are claims and journeys.** | Default: doctrine is a set of stated claims (KNW10 accounts); heresy is an allegation under a jurisdiction (STN19); pilgrimage is travel with a purpose (TMR14). Dial: per faith. Reason: reuse the knowledge, law and travel rules instead of a religion system. | AL2, KNW10, STN19 |
| AGT13 | **A divine gift is a gift with terms.** Spells, blessings and powers granted by a power carry terms like any patron gift. | Default: the gift's terms say who can revoke, sever or steal it and what happens if the giver falls (CHT14); granted abilities run on the power seam (CHT4, ABR16). Dial: per gift. Reason: a cleric's spells and a ring spirit's lessons differ in terms, not in kind. | CHT4, CHT14, ABR16 |

## Fate, patrons, meddlers and authorities

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| AGT14 | **A fate actor is an acting power** with a fate face (STY F3). | Default: STY24–STY32 decide its level, pull and reach. Dial: per world. Reason: one shape. | STY24–STY32 |
| AGT15 | **A cheat's patron is a power, dormant until a card names it.** | Default: the card states the patron's reach, budget and terms (CHT5); a system admin, an audience or "the one who sent you" (RLEX2, RLEX4, RLEX8) is the same. Dial: per cheat. Reason: CHT5 says the backing is a question each card answers. | CHT5, RLEX |
| AGT16 | **An authority is a power whose reach is a place** (restates STN14). | Default: `authorityOver` (claim, knowledge, reach) is the built seam; a god or church may register a claim reader (`registerClaimSource`) where a world wants its claim to count. Dial: per world. Reason: OB11 already allows other claims. | STN14, OB8, OB11 |
| AGT17 | **A regressor or transmigrator acts through knowledge.** | Default: their edge is what they know (KNW), read through `identityOf` and knownness; no new seam. Dial: per world. Reason: RLEX6; avoids a second knowledge store. | KNW, RLEX6 |
| AGT18 | **A storyteller is not an agent in the world.** It times what surfaces; it has no reach, no goals in the world, and shares no draw key with agents. | Default: STY30. Dial: none. Reason: STY10, STY11, LSD244. | STY10, STY30 |
| AGT19 | **God-like is a threshold, and god-likes are scarce** (restates his 2026-10-10 words). | Default: avatars and fragments give presence without frequency; a god looking at the screen is an event with a cause, not a random roll. Dial: per world. Reason: [cosmic events](COSMIC_EVENTS.md#it-depends-on-the-character-weibao-2026-10-10). | COSMIC_EVENTS |
| AGT20 | **Powers leave traces; means read them** (restates STY29). | Default: a power's acts leave signs that divination, deduction or an informed observer can read. Dial: trace visibility per power. Reason: makes powers discoverable. | STY29, KNW12 |

## Building a power slice

1. Name the power, its kind and the two worlds that will use the shape (AGT2).
2. Write its reach rule and act list (AGT3, AGT5); state its budget or "unbudgeted" (AGT4).
3. For faith, declare the world's prayer law and keep prayer, reception and answer separate (AGT8, AGT9).
4. Link a church's faith face to its institution record (AGT11).
5. Tests: `tests/authority*.test.js`, the canon pull tests; browser proof at the desktop viewport (AD43).

## Open details

- No shared record exists; `authority.js`, `canon_pull.js` and the cosmology's patron terms are separate (AGT1).
- The LOTM pull beat names a "church" agent as a bare id with no link to the Nighthawks store, `authority.js` or any church record (AGT11).
- No church registers an authority claim; Evernight, Storm and Mandated Punishers exist as district rows (AGT16).
- No module for prayer, deities or patrons; Heaven's Will has no module (AGT8, AGT14).
- Fate agents have no reach rule yet (AGT3; fixture matrix G1).
