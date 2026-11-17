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

## Pilot result (2026-11-16, agent-verified, not human-reviewed)

Weibao: "Yes to both" (download the two wiki dumps, run a 20-request pilot).

**Downloads.** `harrypotter_pages_current.xml.7z` (54,181,689 bytes) and `reverendinsanity_pages_current.xml.7z` (2,062,702 bytes) from Fandom's public S3 dump route, saved under `~/.codex/research/wikis/<wiki>/dump/`. Both SHA-256 hashes match the 2026-10-10 records in `docs/research/power-systems/wiki-digests/SOURCES.md`. Not yet unpacked or read.

**LOTM wiki module blocked.** The local LOTM snapshot holds namespace-0 pages only. The per-Sequence formula, ritual and acting tabs live in `Module:Sequence/standard`, and the one GET for it returned 403 behind a Cloudflare bot check. Not retried and not worked around. Routes left: a copy Weibao exports from his browser, or the private chapter text at the book locators.

**Pilot.** `node scripts/aspect_pilot.mjs` sent the same 20 packets (10 LOTM Sequences from paid book claims plus local wiki pages; 10 mortal Reverend Insanity moves from paid reader claims) to GPT-6 Luna and Claude Haiku 5.5, low effort, one strict schema, synchronous calls. Packets and replies are in the gitignored `private/` folder.

| Measure | Luna | Haiku |
| --- | ---: | ---: |
| Replies parsed | 20 of 20 | 20 of 20 |
| Input tokens | 31,820 | 79,794 |
| Output tokens | 10,038 | 32,544 |
| Batch cost per request (half the measured standard cost) | $0.0002 | $0.0006 |
| Fields filled | 43 | 69 |
| Filled fields whose locator is not in the packet | 0 | 7 |
| Fields filled for the Sequence with no evidence | 0 | 0 |

The two agree on filled versus empty for 142 of 180 fields; Haiku alone fills 32, Luna alone 6. A spot check of the Fool Sequence 8 and 9 rows: both read digestion and the month of daily acting correctly from the same claim; Haiku's extra fills there put a Sefirah Castle return rite under "advancement ritual" and an unrelated attack under "backlash", so its extra recall is mostly overreach. Component extraction is noisy in both (a place, a person and "more than ten Gu" listed as components), so component rows need a name check against the Gu catalogue before use.

**What it settles.**

- **Luna extracts, Haiku is the second opinion.** Luna is more precise and costs a third as much here, because Haiku's structured outputs add the schema to every prompt. Haiku runs only on fields Luna left empty, and anything it adds goes to review.
- **Evidence is the limit, not the model.** The paid LOTM claims are summaries and almost never carry a formula, so neither model could fill "take" for Sequence 9. LOTM formulas need the chapter text or the wiki module.
- **Cost is far below the earlier estimate.** At these rates every pass in the table (about 2,700 requests) is about $0.60 on Luna plus about $1.60 if Haiku ran everything. The $10 to $30 estimate was based on long reading passes at high effort and does not apply to short extraction at low effort.
- **Two schema limits found.** Haiku's structured outputs allow at most 16 nullable parameters per schema (the script uses empty strings), and its SDK refuses a 32,000-token cap without streaming (the script uses 16,000).

Pilot spend on both providers, including the two failed Haiku attempts: about $0.05.

## Full Luna passes (2026-11-16, agent-verified, not human-reviewed)

Weibao: "Run them". `python3 -I scripts/label_pass_packets.py` built private packets from the local wiki dumps and the paid reader claims; `node scripts/label_pass.mjs hp_potions gu_kinds ri_moves` ran GPT-6 Luna at low effort, synchronous, eight at a time; `python3 -I scripts/label_pass_check.py` checks them. Rows are in the gitignored `private/` folder and are not yet in any ledger.

| Pass | Rows | Errors | Cost | Fields filled | Locator not in packet |
| --- | ---: | ---: | ---: | ---: | ---: |
| Hogwarts preparations (every non-topic potion row) | 284 | 0 | $0.074 | 1,324 | 10 (0.8%) |
| Gu kinds blocked on rank or effect, with a Fandom page (787 of 1,065) | 787 | 0 | $0.146 | 2,304 | 41 (1.8%) |
| Reverend Insanity move leads with claims or a Fandom page | 590 | 0 | $0.135 | 1,592 | 59 (3.7%) |

Total $0.36 at standard rates; the batch route would have been half.

**What it unblocks, before review.**

- **Gu effects.** 270 of the 344 effect-blocked kinds now have a stated effect. They already have a rank, so mapping each effect onto a function family is the one step left before they can run.
- **Gu ranks.** Only 28 of the 443 rank-blocked kinds got a single rank; 66 rows give a range and 29 write "unknown" into the value (a prompt miss to normalise). The wiki pages mostly lack ranks too, so rank needs the chapter route or an authored dial.
- **Gu diets.** Food is stated for 44 of 787 kinds and a feeding interval for 4. The wiki is not where diets live, which supports the mechanism default (GKM440).
- **Move components.** 167 moves list components; 312 of the 361 component names match a catalogue Gu, and 150 moves have at least one. Roles need a filter: some rows list Gu that the move refines rather than uses.
- **Hogwarts routes.** Route is stated for 152 of 284 rows. Against the 17 held-out evidence labels, 14 could be compared and 11 agree. Of the three misses, one (Skele-Gro read as eaten) is the checker's keyword map, not Luna; one (Sleeping Draught) is a scene where it was put in food, so both readings are true; one (Shrinking Solution as topical) needs a source look.

**Checker fix found on the way.** The first check reported 1,281 bad move locators; claim locators carry their own brackets (`b[63, 85]`) and Luna wraps locators in brackets, so the pattern cut them short. Matching a locator against the start of each evidence line gives the counts above.

**Folded into the ledgers (2026-11-16, agent-verified, not human-reviewed).** `node scripts/wiki_tier_labels.mjs` normalises the private rows into `docs/coverage/wiki_tier_labels.json`: normalised values with their locator and speaker, no paraphrases. The held-out split is fixed by hash (GKM429): a row whose sha1(id) starts below 0x33 is held out, 329 of 1,661. The ledgers fold every row, because no table was fitted to these labels; a later rule fitted to them (effect families, diet defaults, route words) fits on the rest and reports the held-out rows apart. Every folded field is marked as the wiki tier (GKM445).

- **Gu kinds.** Ranks are normalised to the lowest stated rank, the ledger's existing meaning. "At least N" counts as a lower bound, and a value with "?" or "unknown" gives no rank: 351 kinds get one. A wiki-tier rank fills a wiki row only where the wiki has no rank category, and it replaces the Immortal-name lower bound. A function comes only from a type word in the kind field (158 kinds). Effect keywords agree with the kind word on only 32 of 58 kinds where both fire, so for 115 kinds the keyword is kept as a guess and never runs. Chapter rows keep their state. Result: runs-authored 381 to 423, rank-unknown 598 to 569, effect-unknown 467 to 454. Effect-blocked rows with a stated effect now name its locator.
- **Killer moves.** Component names are mapped to kind-index ids. Refined products are dropped, and the rest are tagged core, support or other. 129 leads name every component as a known kind and move to `blocked:roles-unchecked`: their roles and order need a chapter check. Wiki kinds are not runnable catalogue entries, so no lead runs from wiki text. 624 stay `roles-unknown`, and the ones with a partial component list name it in their note.
- **Hogwarts potions.** Every labelled row gets a route note (drunk, eaten, topical, inhaled, sprayed or object; 130 rows). 14 rows that were `effect-sentence` get a family from the stated target or effect words. A hand check found one wrong (Mundungus Fletcher's potion, a belief change read as body-form), corrected in `b_overrides.json` as a reviewed override. The title family rule, its overrides and the 17-row potion held-out split are unchanged.
- **Checks.** The focused ledger tests pass (134). `test:changed` passes (4,835 pass, 2 skipped). `b_coverage_ledgers.mjs --check`, `coverage_report.mjs --check` and `check:rules` pass.

**Follow-up passes (2026-11-16, agent-verified, not human-reviewed).** `node scripts/label_followups.mjs` ran four passes at once over the private rows for $0.21: 1,809 calls with no errors. `node scripts/label_followups_check.mjs` scores them, and `wiki_tier_labels.mjs` folds them in.

| Pass | Model | Rows | Score | Folded |
| --- | --- | ---: | --- | --- |
| Gu effect family. The kind field is hidden, and the examples come only from non-held-out rows. | Luna | 569 | 27 of 32 held-out kinds agree with the kind word (3 answer "none"); 84 of 113 non-held-out agree | Yes. A wiki row whose type, name and kind word give no function runs on this family. Gu runs-authored 423 to 513, effect-unknown 454 to 364; a hand check of 16 found about 3 doubtful. |
| Gu diet default (GKM440). The stated food is hidden. | Luna | 787 | 12 of 44 stated foods share its category (5 of 11 held out) | As `dietDefault` in the sidecar, labelled authored. Stated canon diets are idiosyncratic, so the default is a mechanism guess, not a prediction. |
| Move role check | Haiku | 129 | 255 components core or support, 12 not part, 5 unclear | Yes. Not-part components are dropped. 122 leads where both readers agree stay `roles-unchecked`; the rest go back to `roles-unknown`. 5 leads state an order. |
| Potion effect sentence. The four tuned rows are the examples. | Luna | 280 | Held out: object 16 of 17, verb 10, all five parts 4 | As `sentence` and `sentenceFamily` in the sidecar only. A hand check of the five rows only the sentence would move found three wrong, so no ledger row changes. |

**Next, not started.** Do a chapter check of the 122 agreed leads and give their kinds catalogue entries, Fang Yuan's carried Gu first (GKM446). Rewrite the potion-sentence verb prompt and rescore it on the same 17.


## Lord of the Mysteries potions (2026-11-16, agent-verified, not human-reviewed)

Weibao: "continue for LOTM and the other ones too". Wiki-tier pass for the 220 pathway Sequences in `lotm_potions`, 174 of them `blocked:formula-in-notes`.

**Evidence.** `python3 -I scripts/label_pass_packets.py lotm_potions` builds one private packet per Sequence from the local wiki snapshot (ns 0, 2026-11-03): the Sequence's section of `<Pathway> Pathway/Abilities`, character `/Progress` entries for that Sequence, and up to 30 paragraphs on any page that tag the Sequence with `{{seq|...}}` and mention a potion, formula, ingredient, ritual, acting or loss of control. Ingredient templates keep the wiki's canonical name (`[ingr:Name]`), and book citations become `(B1 chNNN)` (B2 is Circle of Inevitability), so a later chapter check can find them. Adaptation and game pages are left out. 102 packets name an ingredient or formula. Two gaps:

- **Module still blocked.** The per-Sequence formula, ritual and acting tabs live in `Module:Sequence/standard`. The `module/sequence_standard.lua` file on disk is the Cloudflare challenge page, not the module, and every `/Advancement` subpage is only module calls. Not retried. Most formulas reach this pass only through ingredient prose on `Creatures and Plants`.
- **Reader claims left out.** The pilot found the paid LOTM claims are summaries that almost never carry a formula, so this pass is wiki tier only.

**Split.** Frozen before any call (GKM429): `sha1(id)[0] < 0x33`, 46 of 220 held out, 7 of them among the 46 brew-pack rows. The list is in `private/lotm_potions_split.json`. Prompts are zero-shot, so nothing was fitted on any row.

**Passes.**

| Pass | Model | Rows | Cost |
| --- | --- | ---: | ---: |
| Aspect sheet: mains and supplementary ingredients as lists, plus the other 13 aspects (`label_pass.mjs lotm_potions`) | Luna, low | 220 | $0.086 |
| Ingredient check: main, supplementary, role unstated, not formula or unclear for each Luna ingredient, plus misses (`label_followups.mjs lotm_check`) | Haiku, low | 102 | $0.049 |

Total $0.135 at standard rates. Every committed ingredient locator starts a line of its packet. Of 618 committed locators, 13 cite several lines whose parts all check out; 2 aspect locators (one empty, one cut short at a `[[...]]` heading) are dropped by the normaliser.

**Score.** Bar written down before scoring: mains precision of at least 80% overall and on held-out rows, judged by hand against the brew pack's mains (`src/world_packs/lotm_brew_pack.js`, 68 mains over 46 rows), counting translation variants as matches (Lavos Squid against Lavatan octopus, Illusory Chime Tree against wind-bell tree). A wiki main also counts when the pack leaves that main unnamed (Scribe's second main).

| Rule | Mains right | Held out | Recall of pack mains |
| --- | --- | --- | --- |
| Luna's main list alone | 15 of 22 (68%) | 4 of 5 | 15 of 68 |
| Luna lists it and Haiku calls it main | 11 of 13 (85%) | 3 of 3, not independent | 11 of 68 |

The Luna-alone line is clean: zero-shot, judged against the frozen split. The Haiku rule was fixed before Haiku ran, but its verdict categories (role unstated, substitute, ritual material) were shaped after the Luna score had seen every comparison row, held-out ones included (GKM429), so its held-out cell is not a held-out result and three rows would be thin anyway. The fold rests on the hand check of all 12 folded rows below. Luna's misses are aux listed as mains where the wiki line says only "ingredients" (5), a Beyonder characteristic used as a substitute (2) and a ritual material, the mermaid's song (1). Haiku's check removes the five aux and one substitute; the other substitute and the mermaid remain. Recall is low because the evidence is thin, not the readers: most pack mains come from chapter notes the wiki snapshot does not repeat.

**Folded (GKM445, every field marked wiki tier).** `node scripts/wiki_tier_labels.mjs` writes a `lotm_potions` section of `docs/coverage/wiki_tier_labels.json`: short ingredient names, each with its locator, speaker, book cite when the line has one, and `canonical` when it equals the line's `[ingr:]` name. The other 13 aspects keep only a locator and speaker (`<aspect>At`), unscored, so they move nothing. The Gu, move and Hogwarts sections are byte-identical to before.

- **12 rows move from `formula-in-notes` to `blocked:formula-wiki-unchecked`.** These are White Tower 3 to 9, Red Priest 2, 6 and 7, Twilight Giant 5 and Error 2. The ledger note names each main and its locator. A hand check of all 12 against their evidence lines found every one stated as a main of that Sequence's potion. Most White Tower lines carry no chapter cite. The lists may be partial, and supplementary ingredients and amounts are open, so a row runs only once a brew row and a chapter check confirm it.
- **Role unstated, noted only.** Red Priest 5 and Wheel of Fortune 1 get their wiki ingredients in the note. The state stays.
- **Authored default (GKM433), noted only.** The other 162 blocked rows get the mechanism default "a Sequence N <name> Beyonder characteristic stands in for the mains". It is labelled authored, not canon. It comes from the table rule that a same-Sequence characteristic replaces the mains (T 0214), and its cost is a dead Beyonder of that Sequence with residue if polluted. Supplementary ingredients stay open. It is not scored, since it predicts nothing.
- **For review, not folded.** Haiku's missed mains on 8 rows (`reviewMains`) are a mix: Sun 4's god blood and Door 9's characteristic match the pack, but Tyrant 3 names the Sea God Scepter, an artifact, and the rest need a source look.

**Checks.** `node scripts/b_coverage_ledgers.mjs --check` and `coverage_report.mjs --check` pass. `tests/b_coverage_ledgers.test.js`, `tests/brew_heldout.test.js` and `tests/hp_potion_case_scenes.test.js` pass (115). `npm run test:changed` passes (4,532, 17 skipped). `npm run check:rules` passes; its one stale-glob warning was there before. `lotm_potions` is now 162 `formula-in-notes`, 12 `formula-wiki-unchecked`, 46 `expressed-authored` and 6 `body-door`. Running from a worktree: `LABEL_PRIVATE` (packets, Luna, follow-ups) and `LABEL_SOURCE_ROOT` (normaliser) point at the primary checkout's private folders.

**Next, not started.** Chapter-check the 12 wiki rows at their cites and write brew rows for them. Get the module through a browser export by Weibao, which would fill formulas, rituals and acting for every Sequence at once.

## Hogwarts ingredients (2026-11-16, agent-verified, not human-reviewed)

`hp_ingredients` had 376 of 409 rows at `blocked:ingredient-properties`: each needs its property axes as a material row in one world property set (BRG1, MR37). The making seam has no such set yet. The HP material rows in `src/` still use per-recipe axes (`cure` and `sting` in `hp_lead_making.js`, `fixative`, `thickener` and `treacle` in `potion_working_rules.js`, `work` in `hp_ingredient_substitution.js`), which is the problem MR37 names.

**Vocabulary (proposal, AD32).** Twelve effect axes: the book-one sheet's mend, calm, bite, venom and ward ([world potion axes](../../audits/WORLD_POTION_AXES_2026-11-09.md) 1.2), plus form, mind, memory, luck, heat, conceal-or-sense and vigour, keyed to the potion ledger's families. Six roles the owner code already authors: carrier, thickener, fixative, identity, abrasive and heat-reactive. Each axis has a level word (trace, some, strong), as in the book-one sheet. They are defined in `scripts/label_pass.mjs` beside the pass.

**Run.** `python3 -I scripts/label_pass_packets.py hp_ingredients` (with `HP_DUMP_XML` pointing at the dump, unpacked into its own scratch directory and deleted afterwards) built 400 packets, one for every row that is a thing, the 20 runs-authored rows included. All 400 found a page. `node scripts/label_pass.mjs hp_ingredients` ran GPT-6 Luna at low effort: 400 of 400 parsed, $0.098. `node scripts/hp_ingredient_haiku.mjs` ran Haiku 5.5 as second reader on the 81 held-out rows and the 20 comparison rows (96 distinct): 96 of 96, $0.067. Total $0.17. Luna was asked only for what the page states. Axes implied by the potions an ingredient goes into are computed locally, not asked for.

**Frozen before the first call.** The split is the wiki-tier hash (GKM429): 81 of 400 rows held out. The comparison sets are in `scripts/hp_ingredient_labels_check.mjs`:

- **Authored.** The 20 runs-authored rows mapped from owner code onto the vocabulary: 9 axes, 8 roles, 12 forms and 17 potion memberships, each with its code locator.
- **Novel.** The catalogue's linked observations, joined through `observation_ids`. Membership and use rows that name a potion-ledger potion score potions (32 rows). Preparation rows score form (13). Exposure and outcome rows score hazards (17).

No comparison row is a prompt example.

**Scores** (`node scripts/hp_ingredient_labels_check.mjs`):

| Field | Luna, all | Luna, held out | Haiku, its 96 rows |
| --- | --- | --- | --- |
| Potions, authored rows | 16 of 17 | 4 of 5 | 16 of 17 |
| Potions, novel links | 28 of 32 | 7 of 7 | 12 of 12 |
| Forms, authored rows | 8 of 12 | 3 of 3 | 9 of 12 |
| Forms, novel links | 12 of 13 | 4 of 4 | 7 of 7 |
| Hazard stated where the novel shows harm | 14 of 17 | 3 of 4 | 3 of 4 |
| Stated axes, authored rows | 1 of 9 | 0 of 4 | 4 of 9 |
| Roles, authored rows | 3 of 8 | 0 of 2 | 3 of 8 |

The first potion score was 29 of 54, and that was the scorer, not the labels. Observation subjects that are not potions (an unnamed family, a harvest, a divination scene) were dropped from the key. Names now resolve through the wiki's own redirects (`private/hp_redirects.json`, titles only, from the same dump), so Boil-Cure Potion is Cure for Boils. No label was changed to reach that number.

**What the axis scores mean.** The authored axes come from recipe membership: nettles carry `cure` because they are in the Cure for Boils, which is the sheet's (R) basis. The wiki rarely says what a nettle itself does, and Luna correctly declines to invent it. So the authored set cannot score stated axes. Precision is scored instead:

- **Second reader.** On the 81 held-out rows, Haiku confirms 25 of Luna's 26 axes and adds 17 of its own. That is the pilot's pattern: Haiku has more recall and more overreach.
- **Hand check.** A seeded random sample of 16 rows with stated axes found 18 of 19 right against the packet text. The miss, Chinese Chomping Cabbage read as `bite` because the plant bites, is dropped in `wiki_tier_labels.mjs` and recorded as `axisDropped`.
- **Infobox field.** The wiki's ingredient infobox has its own `properties` field, filled on 81 pages (Poisonous, Highly acidic, Antidote to most poisons). 59 of the 121 stated axes cite the intro section of a page where that field is filled.

The axes implied by potion families hit 6 of the 9 authored axes, with 9 extra axes: the quill gets mend, mind and form, never bite. They are kept as `axisCandidates` and do not move a row.

**Folded** (`node scripts/wiki_tier_labels.mjs`, then `node scripts/b_coverage_ledgers.mjs`):

- **Sidecar.** `docs/coverage/wiki_tier_labels.json` gains an `hp_ingredients` section for 400 rows. Each holds the kind, stated axes and roles (with locator and speaker), potions resolved to potion-ledger ids (365 pairs on 216 rows; 49 names unresolved), forms in a closed word set (89 rows), axis candidates, and where the source, hazards and direct effect are stated. The other three sections are byte-identical.
- **State change.** The ledger fold runs after the reviewed overrides, which replace notes. A row still at `blocked:ingredient-properties` whose page states an axis, and whose kind is a material, moves to `blocked:material-row`: 96 rows (21 held out). Its note names the axes and locator, and says the levels and amounts would be authored. Its basis keeps the earlier text and adds the wiki-tier source and speaker. By axis: venom 34, mend 27, mind 10, bite 8, ward 8, form 7, vigour 5, conceal-or-sense 4, heat 3, memory 3, calm 2. 280 rows stay `ingredient-properties`.
- **Notes only.** Every labelled row, the 20 runs-authored and the 4 engine-case rows included, gains a short wiki-tier note: kind, up to four potions, forms, and a hazard locator. Their states are unchanged.
- **Aliases.** No two rows share a page through a redirect, so no alias candidates.

**Checks.**

- `tests/b_coverage_ledgers.test.js` and `tests/brew_heldout.test.js`: 8 pass.
- Pass: `node scripts/b_coverage_ledgers.mjs --check`, `node scripts/coverage_report.mjs --check` and `npm run check:rules` (one pre-existing stale-glob warning).
- `npm run test:changed`: 618 of 1,074 files, 4,532 pass, 0 fail, 17 skipped.
- Not run: the full suite.

**Next, not started.**

- **A world property set in `src/`.** Turn the vocabulary into one HP catalogue (`defineCatalogue` axes) and move the per-recipe axes of the 20 runs-authored rows onto it, so a canon recipe is one point in the space (MR37). The 96 `material-row` rows then need only authored levels.
- **The 280 that stay.** Most have potions and forms but no stated property. The chapter route, or the candidate rule scored per family instead of as a union, is what would move them.
