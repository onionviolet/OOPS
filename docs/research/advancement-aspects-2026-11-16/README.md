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

## Price (corrected the same day)

The first estimate budgeted output at five times the answer. The measured Haiku 5.5 batch receipts in the [batch reading workflow](../BATCH_READING_WORKFLOW.md) show reasoning output of 25,000 to 50,000 tokens a request at high effort, $0.008 to $0.014 a request. Short extraction at low effort should cost less, but nothing has measured it. Working estimate: $0.003 to $0.01 a request, so about 2,700 requests for every pass below come to roughly $10 to $30, not under $10. A 20-request pilot per pass settles the rate before the rest is sent.

| Pass | Requests |
| --- | ---: |
| RI move roles from claims (GKM427) | 534 |
| RI move roles from chapter text where claims leave roles open | up to 534 |
| Gu rank, path, food and effect from wiki pages (GKM444) | about 900 |
| LOTM potion aspect sheets, 22 pathways by 10 Sequences | 220 |
| Circle of Inevitability cross-check | 220 |
| Clever-uses first slice (GKM437) | about 100 |
| Cross-model check on a 10% sample | about 250 |

## Haiku or Luna

Same price: GPT-6 Luna batch is $0.05 in and $0.25 out per million tokens, equal to Haiku 5.5's batch rate (workflow doc, prices read 2026-11-08). The repo default for bounded extraction is Luna at low effort (AU5). Luna needs a strict `json_schema` (the first non-strict Circle census left out required fields); Haiku 5.5 takes structured outputs. Proposed use of both:

- **Split by credit.** Run one pass family per provider so both balances get used, one provider per book at a time (the driver refuses a mix in one run file).
- **The other model is the check.** Luna extracts and Haiku re-extracts a 10% sample, or the reverse. Two model families disagreeing is a better flag than a same-family Sonnet check, and costs the same as the extraction. Disagreements go to Sonnet or to source review.
- **Pilot decides the default.** `batch_compare.mjs` on the pilot rows, with separate private folders, picks whichever matches source locators better for that pass.

## Wikis

Already on disk, private (`~/.codex/research/wikis/`):

- **Lord of the Mysteries** (`lotm-wiki-current-pages-2026-11-03.jsonl.gz`, 1,833 pages): "potion formula" on 115 pages, "advancement ritual" on 98, "acting method" on 47, "loss of control" on 32, "main ingredient" on 44. Template fields can be parsed locally for free; free-text ritual and acting sections go to the extraction model. This tier is wiki, scored apart from book rows (GKM445), and Circle of Inevitability and the LOTM readings confirm it.
- Twenty other Fandom wikis (Bleach, JJK, One Piece, Naruto, Frieren and others) for later worlds.

Not on this machine: the Harry Potter Fandom dump (`harrypotter_pages_current.xml.7z`, 54,181,689 bytes) and the Reverend Insanity Fandom dump (`reverendinsanity_pages_current.xml.7z`, 2,062,702 bytes), both from Fandom's public S3 dump route used on 2026-10-10 (`docs/research/power-systems/wiki-digests/SOURCES.md`). Their indexes are tracked; the archives were read in another environment. Re-downloading them is one file each, not page scraping, and unblocks the Hogwarts potion labels (the live site refused automated reads) and the Gu wiki pass. sagaofgu.com pages (455 linked) would go through `lncrawl-polite`.

## Other aspects

Beyond the five on the potion page, each also generic across worlds:

| Aspect | LOTM example | Engine owner |
| --- | --- | --- |
| Who may | Sequence order, neighbouring pathways, switching | Standing and knowledge (STN, KNW) |
| Where it comes from | Ingredient sources, sellers, prices, Church control | Economy, items (ITM) |
| How long | Brewing, digestion time, waiting before the next Sequence | Time (TMR) |
| What others notice | Signs of a Beyonder, spirituality, being sensed | Knowledge, feedback |
| What is left behind | Beyonder characteristics after death; Gu outliving a master | Items, inheritance |
| Who controls the knowledge | Formulas held by Churches and families; penalties for leaking | Standing and law |
| How it changes the mind | Personality drift, madness, the role taking over | Mind (MND) |
| What can be false | An incomplete or forged formula (the GKM247 pattern) | Knowledge, GKM430 claim tier |
| How it combines | Pathway convergence, artifacts, counters | Cross-system rules |

The sheet grows to these fourteen fields, and each pass fills only the fields its source states.
