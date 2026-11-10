# Knowledge rules

Working defaults 2026-11-10 under AD56 (ideas that open possibilities are welcome), adjustable; the lines listed in the [limiting lines review](audits/LIMITING_LINES_REVIEW_2026-11-10.md) stay proposals until Weibao answers. Drafted as proposals the same day (AD32). Requested by Weibao ("Draft all four", [log](gm/USER_VISION_LOG_2026-11.md#four-more-rulebooks-and-cheats-brought-forward-2026-11-10)). Rows marked **(restates)** repeat a rule that already binds through its own code and add no authority.

Covers what characters know and how: truth versus what an observer knows versus what a screen shows, noticing, learning, guessing, accounts and rumours, appraisal and identification, research, teaching and texts, divination and other means, forgetting, spreading, and carrying knowledge across lives and worlds. A world may set any line differently with an in-world reason and cost (AD5, AD38); each row gives the default, the dial and the reason.

His words that set the shape: "not the world let you observe but rather the means you have on hand" and "everything needs to make sense in their respective worlds" (2026-10-10); "knowledge doesn't have to always cross unless something is done about it" (Rulebook 5); information appears when it comes up, hints disclose known clues and nothing more (2026-10-03, USER_VISION design principles). The sealed-secret gate is for play, not development (2026-11-09, [AGENTS](../AGENTS.md#sealed-secrets)); this book adds no copy of that rule.

Owners and neighbours (linked, not restated): Rulebook 5 and 6 in [RULES_FROM_SCRATCH](RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10); AD3, AD6–AD9, AD11, AD17 in the [rules index](RULES_INDEX.md#knowledge-and-means) and its shared principle "Truth and knowledge are separate"; MR1, MR3, MR10, MR22, MR31 in [making rules](MAKING_RULES.md); SR5, SR7–SR9, SR13, SR17, SR22 in [site rules](SITE_AND_EXPLORATION_RULES.md); GR5, GR15; AR3, AR8; CBR13–CBR16, BHR6–BHR9, SLR5–SLR6, SLR14–SLR25, SLR36–SLR39, PIR5, PIR9, PIR14–PIR16, PIR22 in [domain rules](DOMAIN_RULES.md); UR36, UR40, UR70–UR75, UR80, UIV6 in [UI rules](UI_RULES.md); PRS1–PRS2; GTR10, GTR15, GTR24, GTR35; [TIE5, TIE24, TIE25](RELATIONSHIP_RULES.md). Palettes: [means and appraisal](MEANS_AND_APPRAISAL.md) (MN, AP, LS, IMP, ML, AA proposal ids), [world secrets and discovery](worlds/WORLD_SECRETS_AND_DISCOVERY.md), LSD36–LSD37, LSD351–LSD362, LSD393–LSD405, LSD417–LSD424 in the [lead-life design](gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md#5-knowledge-perception-and-secrets), atlas LAYX184 and XC12–XC15, XM23.

## Terms

| Term | Means | Not |
| --- | --- | --- |
| Truth | What is so in the world's record | What anyone thinks |
| Entry | One observer's knowledge row: stage, value, when, cause, basis | A UI label |
| Stage | Seen, interpreted, understood (the stored ladder) | TK levels, secret stages or certainty words, which are displays of it |
| Certainty | Known, guessed, open (the shown words, UIV6) | A stored value |
| Account | What someone says is so, with a speaker and a day (`person_memory` claims) | An ownership claim (`claim` effect) or a legal claim (SR19) |
| Means | Whatever lets someone learn something: senses, skill, tools, books, people, magic, cheats | The world deciding to tell you |

## The record

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| KNW1 | **Truth, knowledge and display are three things** (restates AD7, Rulebook 6). Hidden properties act whether or not anyone knows them. | Default: generators write truth (GR5), the knowledge effect writes entries, projections write screens (AR8). Dial: none. Reason: knowing changes what you can predict, not what happens. | AD7, MR1, GR5 |
| KNW2 | **One store per observer, one writer.** The player's entries live in `simulation.knowledge[actor]`, written only by the `knowledge` effect; entries never move down a stage. | Default: a feature that teaches something emits a knowledge effect with a basis (recollection, observation, instruction, inference). Dial: a world's memory magic can remove entries through a named effect. Reason: AR3; four feature-local "known" flags would disagree. | AR3, causal_situations |
| KNW3 | **One stored ladder, many displays.** The store keeps three stages; TK levels, secret stages and known/guessed/open are a world's way of showing them. | Default: the three stages; a world maps its display onto them. Dial: how many display steps a world shows. Reason: four vocabularies exist today for one row. | AR3, UIV6 |
| KNW4 | **Every entry has a source.** What, from whom or what, when, and how sure. | Default: the basis field plus a day; an account keeps its speaker. Dial: none. Reason: SR5, LSD36; a belief without a source cannot be checked or doubted. | SR5, LSD36, BHR8 |
| KNW5 | **NPCs know through their own memories.** An NPC's knowledge is `person_memory` episodes and their presence at events; the player's Knows panel never reads either as truth. | Default: depth by tier (TIE16). Dial: a world with telepathy or shared minds links them by mechanism. Reason: the player knowing what an NPC knows is itself a fact to learn. | TIE5, LSD358 |

## Learning

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| KNW6 | **Means decide what can be learned** (restates AD6). No means, no information. | Default: each reading names its means and what that means can see (depth, precision, freshness, range, notice as separate dials, B298). Dial: per means and world. Reason: his 2026-10-10 words. | AD6, IMP9 |
| KNW7 | **Unnoticed things show as nothing; noticed unknowns show as unknown.** | Default: an unknown row stays hidden until something points at it, then it reads as `???` or an open question (XM23). Dial: a world whose lore names a mystery may list it. Reason: "information appears when it comes up"; an empty labelled slot is a spoiler. | AD3, AD8, XM23 |
| KNW8 | **Looking at what is known is free; examining costs.** Reading a stored projection costs nothing; a new examination is an action with time, risk and exposure. | Default: SR13 previews free; an examination runs through its action owner and may reveal the examiner (LS6). Dial: cost per means. Reason: the player should not pay to reread their own notes; looking closely at a dangerous thing should cost something. | SR13, CRL35, AA14 |
| KNW9 | **A seen thing is frozen** (restates MR3). A reading keeps its time and revision; a later change shows as a new reading. | Default: readings carry their day (`information_freshness.js`). Dial: none. Reason: a stale reading and a missing one are different (AA9). | MR3, AA9 |
| KNW10 | **A guess is not an account.** The player's own guess is an inference entry with its uncertainty; what someone else said is an account with a speaker. | Default: two records; an account becomes an entry only through a test or a trusted source. Dial: how much trust turns an account into belief, per world and person. Reason: LSD422 (lies are claims) and SR5. | LSD422, SR5 |
| KNW11 | **Deception writes wrong beliefs, never wrong truth** (restates CBR16, ECR23). | Default: a lie is an account with a false value. Dial: none. Reason: the lie must be discoverable. | CBR16, ECR23 |
| KNW12 | **Effective means reveal at once.** A divination, a mind read or an appraisal cheat that works gives the fact, with its method, status and source. | Default: AD38; the reveal states its layer and precision (BHR9). Dial: cost, ambiguity and which layer it reads, per world. Reason: things work by how they work; a means that never quite works is a fake. | AD38, BHR9, CHT19 |

## Research, teaching and texts

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| KNW13 | **Research produces knowledge.** Reading, observing, experimenting, asking, deriving, divining, translating and comparing are steps; the product is an entry. | Default: `inquiry.js` stores effort, not truth, and writes the answer once; deduction from trials goes through `craft_experiment_log.js`. Dial: a world may have no research at all. Reason: LAYX184; finding out a property is progress in every craft at once (XC14). | LAYX184, MR22 |
| KNW14 | **Failure teaches** (restates AD9). An experiment with no result narrows the options. | Default: an inconclusive test is recorded as such. Dial: none. Reason: AD9. | AD9, MR22 |
| KNW15 | **Teaching passes understanding, not fluency** (restates SLR14–SLR16). A teacher teaches only what they hold, imperfectly. | Default: SLR layers. Dial: per teacher and world. Reason: SLR. | SLR14–SLR16 |
| KNW16 | **A text is an item that makes an account.** Reading it writes an account with the text as source; possession, readability, comprehension and mastery are separate (SR17). | Default: note items (`inquiry_note_item.js`) write second-hand interpreted entries; a text can be wrong, partial or out of date. Dial: per text. Reason: SLR18, SR7; a document owner is still missing. | SLR18, SR7, SR17 |

## Spreading, forgetting, carrying

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| KNW17 | **Each kind of fact names how it spreads.** World events spread by routes and carriers (`learnedDay`); people's memories by bonds (`gossipStep`); standing by audiences (STN3). | Default: a new fact kind picks one of the three; no fourth spreader. Dial: speed and loss per world. Reason: three spread engines exist and each works; a fact that spreads by none is known only by witnesses. | LSD37, STN3 |
| KNW18 | **Telling loses detail.** Each retelling can drop or bend detail, by the teller's temperament. | Default: `tellMemory` loss and `person_temperament.js` dials. Dial: per world and person. Reason: rumour is the interesting case. | LSD37, LSD398 |
| KNW19 | **NPCs forget by rule; the player forgets only by mechanism.** | Default: NPC memory fades (`vividness`); the player's entries do not fade except through a named mechanism (a memory effect, stale carried foreknowledge), forewarned and recoverable (SLR39). Dial: per world. Reason: the player's notes are the player's tool; forgetting them by timer is a chore. | SLR36–SLR39, LSD354 |
| KNW20 | **Knowledge crosses only with a carrier** (restates Rulebook 5, AD11). Memory carries; other knowledge needs a soul, record, item, teacher, system or cheat. | Default: carried rows show reliable, fading or stale (`carriedKnowledgeView`). Dial: per crossing (WER). Reason: Rulebook 5. | Rulebook 5, AD11, WER9 |
| KNW21 | **Past-life knowledge is memory, not relationship** (restates PIR22). | Default: TIE25. Dial: a mechanism that carries a tie. Reason: PIR22. | PIR22, TIE25 |

## Showing

| Code | Rule | Default, dial, reason | Builds on |
| --- | --- | --- | --- |
| KNW22 | **Screens never leak truth** (restates MR31, SR9). Not through names, sort order, prices, counts, colours, tooltips or logs. | Default: projections are observer-safe (AR8); appearance derives from permitted facts (AA13). Dial: a labelled developer lens absent from play (UR80). Reason: one leaked sort order spoils a mystery. | MR31, SR9, AR8, UR80 |
| KNW23 | **Own numbers are exact; others' are learned** (restates AD8, BHR6, SLR24). | Default: first sight shows impressions and `???`. Dial: a world with public ranks. Reason: AD8. | AD8, BHR6 |
| KNW24 | **Words come from what the character knows** (restates PRS1). Choice text states costs, not reveals (PRS2). | Default: PRS. Dial: none. Reason: a choice that names the hidden outcome gives it away. | PRS1, PRS2, UR72 |
| KNW25 | **The return recap shows only what could be known** (restates AD17). | Default: TMR10. Dial: means or cheats widen it. Reason: AD17. | AD17, TMR10 |

## Building a knowledge slice

1. Name what is learned, by what means, and its basis (KNW4, KNW6).
2. Write through the `knowledge` effect; read through `observerView` and `knowledge_view.js`.
3. Pick the spreader if others can learn it (KNW17).
4. Check the screen for leaks: names, order, counts, colours (KNW22).
5. Tests: `npm run check:rule-behavior -- knowledge` (two files today), plus the `person_memory`, inquiry and carried-knowledge tests; browser proof at the desktop viewport (AD43).

## Open details

- Four display vocabularies for one stored ladder (KNW3).
- NPC knowledge has no view in Knows by design; a "who knows what" inspector for development is open (KNW5).
- No owner for the examination act outside features (KNW8).
- No document owner for texts (KNW16).
- The knowledge rule-behavior route covers two test files (Building step 5).
- Research has no lead-world caller for `invention_planner.js`; `inquiry_study.js` serves the Village alone (KNW13).
- "Claim" means three things in code; this book says "account" for the knowledge sense.
