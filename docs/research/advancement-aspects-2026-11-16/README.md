# Advancement aspects across novels, and what the label passes cost (2026-11-16, proposal)

Weibao (2026-11-16), with a screenshot of an LOTM potion page tabbed Overview, Formula, Ritual, Backlash and Acting Method: "Consider aspects like this too, we can work on multiple novels at once? Price it".

## The aspect sheet

`lotm_potions` blocks 174 of its 226 rows on one aspect, the formula. A Beyonder potion has five, and every novel's way of advancing has the same five under other names. Proposed shared sheet, one row per advancement step in any world:

| Aspect | LOTM | Reverend Insanity | Other worlds (examples) |
| --- | --- | --- | --- |
| What you take | Formula: main and supplementary ingredients | Gu and primeval stones for a rank-up; refinement recipe | Hogwarts recipe; Shadow Slave soul shards |
| What you must do | Advancement ritual | Breaking the aperture rank; tribulation | A trial, a quest, a nightmare |
| How it settles | Acting method (digestion) | Aperture wall growth; dao marks | Practice, mastery |
| What goes wrong | Backlash, loss of control | Backlash, aperture damage | Side effects, corruption |
| What it changes | Sequence abilities | Rank, realm, attainment | New abilities, body changes |

Each field keeps a locator and who said it (a character's claim, a demonstration or the narrator; GKM430), and a tier (book, wiki, authored).

**Rituals are conditions on world state, not item lists.** The screenshot's ritual asks the character to gather everything about themselves left in the world and hide it without a trace. In the engine that is a check over what other people and records know about the character (the knowledge ledger, KNW) and over traces in places, satisfied by play rather than by a crafted item. Rituals written this way become quests the engine can judge by its own state.

**Acting is Klein's next consumer.** His digestion slice (foundation resume block) needs the Seer line's acting principle. Label the Fool pathway first, then the other 21.

## What is already paid for

Local counts of mentions in the existing full-book readings (`docs/research/novels/full-book/`):

| Novel | "ritual" | acting | loss of control | "formula" |
| --- | ---: | ---: | ---: | ---: |
| Lord of the Mysteries | 2,838 | 613 | 159 | 1,132 |
| Circle of Inevitability | 2,223 | 346 | 64 | 337 |

Reverend Insanity has 7,196 reader claims (164 files). Mother of Learning, Shadow Slave, Solo Leveling, Omniscient Reader, Regressor's Tale, Legendary Mechanic and others have finished readings in their own formats. So every pass starts local: build per-row packets from existing readings, and only send packets to a model.

## Several novels at once

Yes. One aspect schema, one Haiku prompt, one batch with a `custom_id` per novel and row; each novel needs only a small local adapter that turns its reading format into packets. Novels run independently, so a bad adapter fails one novel's rows, not the batch. Order by consumer: LOTM Fool line (Klein), Reverend Insanity moves and diets (Fang Yuan), then Circle of Inevitability (same system, second book, a free cross-check on LOTM rows), then the rest.

## Price

Rates from the bundled Claude API reference (cached 2026-11-03): Claude Haiku 5.5 $0.10 in and $0.50 out per million tokens (prompts up to 100K), Claude Sonnet 5.5 $2 and $10; Message Batches are half price. Outputs are budgeted at five times the visible answer to cover thinking.

| Pass | Requests | Input tokens (est.) | Haiku 5.5 batch | Sonnet 5.5 batch |
| --- | ---: | ---: | ---: | ---: |
| RI move roles from claims (GKM427) | 534 | 0.75M | about $0.30 | about $6 |
| RI move roles from chapter text, for moves the claims leave open | up to 534 | about 2M | about $0.50 | about $10 |
| Gu rank, path, food and effect from wiki pages (GKM444) | about 900 | about 2.5M | about $0.70 | about $14 |
| LOTM potion aspect sheets, 22 pathways by 10 Sequences | 220 | about 1.1M | about $0.30 | about $6 |
| Circle of Inevitability cross-check of the same sheets | 220 | about 1M | about $0.30 | about $6 |
| Clever-uses first slice (GKM437) | about 100 | about 0.5M | about $0.10 | about $2 |
| Sonnet check of a 10% sample of every Haiku pass | about 250 | about 1M | | about $5 |

All of it on Haiku with the Sonnet sample check comes to under $10. The cost that matters is review time: every row a model fills still needs its locator checked before it becomes a rule (AU13).

Not verified: provider balance, credit expiry, and live prices (fetch before dispatch). Token counts are estimates from character counts; `count_tokens` on a sample would settle them.
