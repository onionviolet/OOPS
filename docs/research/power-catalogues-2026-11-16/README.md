# Power catalogues across worlds (2026-11-16, proposals)

Weibao, after the RI, Hogwarts and LOTM label passes were merged: "catalogue everything accordingly? document all the super powers in perfect run? worm? Re:zero? other implementable worlds?"

This is the owner palette for one coverage ledger of powers per world, built the way the Gu and potion ledgers were ([advancement aspects](../advancement-aspects-2026-11-16/README.md), [coverage plan CV1-CV4](../../PROCEDURAL_FOUNDATION_PLAN.md#making-all-achievable-ledgers-grammar-layers-procedural-rules-milestones-2026-11-12)). Codes PWC1 onward. Everything here is a proposal (AD32) unless a line says it is a working default (AD56).

## What exists, and what is missing

| World | Read | Powers listed so far | Wiki dump on disk | Missing |
| --- | --- | --- | --- | --- |
| Worm | Full book (304 units), round 2 deep dive (`docs/research/novels/worm/DEEP_DIVE_2026-10-24.md`, local only), paid reader claims (`2026-11-01-worm`) | 85-row cape table (POWERS_SHARDS (`docs/research/novels/worm/readers-2026-10-10/POWERS_SHARDS.md`, local only)) | No. `worm.fandom.com` returned 403 on 2026-10-10 | A row per named cape and power, and one per named Tinker device |
| Re:Zero | LN 1-10, WN arcs 1-10 and IFs, round 2 deep dive (`docs/research/novels/rezero/DEEP_DIVE_2026-10-24.md`, local only) | Axes and rules R1-R34, no per-power rows | No | A row per Authority, Divine Protection, named spell, Witch Factor, Return by Death and curse |
| The Perfect Run | Full (130 chapters, 3 Bad Runs), deep dive (`docs/research/novels/perfect-run/DEEP_DIVE_2026-10-25.md`, local only), paid claims (`2026-11-01-pr`) | Stocks and PR1-PR10, no per-power rows | No | A row per Genome, Elixir colour, Psycho and named device |
| 13 fandom worlds with local dumps (Naruto, My Hero Academia, One Piece, Mistborn, Black Clover, Bleach, Frieren, Demon Slayer, Tower of God, Chainsaw Man, Dresden Files, Hunter x Hunter, Jujutsu Kaisen and others) | Lane W indexed the dumps in October; its semantic reading stalled (111,652 pending, [checkpoint](../power-systems/wiki-digests/CHECKPOINT.md)) | 152 [wiki digests](../power-systems/wiki-digests/), system-level only | Yes, under `~/.codex/research/wikis/` | Per-power rows and denominators |

## Round 1

| Disposition | Code | Finding |
| --- | --- | --- |
| ACCOUNT FOR NOW | PWC1 | **One power sheet for every world.** A power row records the shared effect grammar (verb, object, target, time; `src/effect_grammar.js`), plus the aspect fields that matter for powers: `who_may` (who can hold it), `where_from` (how it is acquired), `go_wrong` (cost, backlash or drift), `mind` (effect on the holder's mind), `left_behind` (what happens on death or transfer), `combines` (interactions) and counters. Every field carries a locator and a speaker (GKM430). The 14-field advancement sheet stays the superset; a world uses the fields it has. One sheet lets one label script, one normaliser and one scorer serve every world. |
| ACCOUNT FOR NOW | PWC2 | **A world's own classification is a free held-out label.** Worm's PRT ratings (Mover, Shaker, Brute, Breaker, Master, Tinker, Blaster, Thinker, Striker, Changer, Trump, Stranger) each imply a grammar verb or target (Mover: move self; Shaker: area; Master: bind other minds or bodies; Thinker: sense information; Stranger: conceal; Changer: transform form; Trump: alter workings). The same goes for Re:Zero's six attributes and for Naruto's chakra natures. Hide the rating from the grammar pass and score the grammar against it, as the Gu family pass was scored against kind words (27 of 32). This is the cheapest honest score each world has. |
| ACCOUNT FOR NOW | PWC3 | **Denominators come from data first.** A world's power list comes from wiki categories (`Category:Capes`, `Category:Quirks`, `Category:Devil Fruits`, `Category:Authorities`) in the local dumps, deterministically and for free, and Lane W's category and redirect queues already exist. Books without a wiki dump take names from the paid reader claims and the people indexes. Each row records the denominator's source, so later "missing" means an uncovered name, not an unread volume. |
| ACCOUNT FOR NOW | PWC4 | **How the player gets a power is its own field.** Worm triggers on a traumatic event (or a Cauldron vial, at a price). Re:Zero's Divine Protections come at birth, by chance, and a Witch Factor passes when its holder dies. Perfect Run Elixirs are bought, and the colour risks a Psycho. The `route_to_player` field ties each power to the world entry rules (WER), so a start can offer what the world would plausibly give, with its cost. |
| ACCOUNT FOR NOW | PWC5 | **The blocking rule is what the ledger is for.** As with Gu (`blocked:effect-unknown`), each power that cannot run names the missing engine capability as a slug (`blocked:mind-binding`, `blocked:time-loop`, `blocked:area-field`, `blocked:power-interaction`). Summed across every world, these counts are a build order: the capability that unblocks the most powers in the most worlds comes first. |
| ACCOUNT FOR NOW | PWC6 | **Mind cost and drift are first-class.** Worm's shard-driven conflict drive and personality drift, Re:Zero's Authorities warping their holders, and Perfect Run's Psychos are mechanisms, not flavour. They belong in `mind` with a speaker, because a character's claim about their own power is often wrong (Worm's Tinkers misdescribe their specialities; Re:Zero's Archbishops lie). |
| ACCOUNT FOR NOW | PWC7 | **Knowledge state per power.** In play, what a character knows about a power follows what that character could know (sealed-secret rule: the gate is for play, not development). A row records who in-world knows how it works (public, the holder, an institution such as the PRT, or no one). Re:Zero's Return by Death and Worm's shard origin are the clearest cases, and both are public franchise twists, so they are not sealed in development. |
| LATER / DELEGATE | PWC8 | **A clever-uses ledger extends across worlds.** GKM437's uses ledger (the "Eight Times Eight" kind of clever use) has its richest source in Worm, where the story is built on uses of weak powers (bugs as sensors and relays, frozen objects as unbreakable blades). Re:Zero loops and Perfect Run's save abuse are the other two. Level: Haiku to collect from the paid claims, Sonnet to check each row's setup and locator. Done when 30 rows per world exist with the GKM437 tuned and held-out counts. |
| LATER / DELEGATE | PWC9 | **The 13 dump worlds as one census.** A deterministic, no-API census counts each world's power categories and page counts from the local dumps. It ranks worlds by power-row count and by how many of their likely blocking rules are already blocking other worlds, so the first dump worlds labelled are the ones that share the most engine work. Level: Sonnet script, no model calls. Done when `docs/coverage/README.md` lists a proposed ledger per world with its denominator source and count. **Census done 2026-11-16 (proposals): [CENSUS.md](CENSUS.md), `scripts/wiki_power_census.py`, and the proposed-ledgers table in `docs/coverage/README.md` (from `docs/coverage/proposed_ledgers.json`).** 18 worlds have dumps with 14 to 2,536 power pages each (Frieren has none in the wiki); Mob Psycho 100 and World Trigger have none on disk. |
| LATER / DELEGATE | PWC10 | **Wiki dumps for the three book worlds need Weibao's yes per file.** The Worm, Re:Zero and Perfect Run wikis are not on disk, and Worm's host refused automated reads in October. Each session names the file, source and size and waits for his yes. Bot checks are never bypassed; without a dump, the reader claims and people indexes are the source. |

## Order (working default, AD56)

1. Worm, Re:Zero and The Perfect Run, one session each, from the claims and reads already held. PWC1-PWC7 are applied. The world's own classification is scored where it has one, and the ledgers are `docs/coverage/worm_powers.jsonl`, `rezero_powers.jsonl` and `perfect_run_powers.jsonl`.
2. The PWC9 census over the 13 dump worlds, then label passes for the top ones in census order.
3. The cross-world blocking-rule histogram (PWC5) in the coverage README, once two or more power ledgers exist.

## Budget

At the measured rate, about $0.0002 per Luna row and $0.0006 per Haiku row, a few thousand power rows cost a few dollars. The sessions keep each world under $5 without asking.

## Round 2: coverage and API use (2026-11-16)

Weibao: "more to consider? Do we cover everything? are we using APi efficiently?"

**Spend so far, measured.** The usage recorded in the private reply files shows 5,211 calls, 5.8M input tokens and 1.3M output tokens, $1.23 at standard rates. That covers every pass since the pilot, the three merged lanes and the first calls of the Worm, Re:Zero and Perfect Run lanes. Against a budget of about $200, that is 0.6%.

| Disposition | Code | Finding |
| --- | --- | --- |
| ACCOUNT FOR NOW | PWC11 | **API money is not the constraint; session time is.** Each label pass costs cents. The Claude sessions that write the scripts, check samples and merge branches cost far more of Weibao's usage. Default: spend API money wherever it saves session work or buys evidence quality. Saving API cents that costs session time is the wrong trade. |
| ACCOUNT FOR NOW | PWC12 | **Superseded by AU16 (Weibao, 2026-11-16: "every cent is a cent"): batch is the default for every pass.** Former text: batch only above about $10 a run. The batch rate halves cost but can take hours, and at these sizes it would save under a dollar in total. Synchronous calls stay the default for passes under $10; batch is for chapter-scale reads. |
| ACCOUNT FOR NOW | PWC13 | **Put the fixed text first so the prompt cache can work.** OpenAI caches a shared prefix of 1,024 tokens or more automatically. Today's prompts open with the item's name ("Describe the Gu X..."), so no two calls share a prefix, and input is 82% of tokens. Default for new passes: instructions, examples and vocabulary first, the item and its evidence last, and record `cached_tokens` beside `usage`. This matters at chapter scale, not at today's few dollars. |
| ACCOUNT FOR NOW | PWC14 | **The labels mostly move rows between blocked states; they do not make rows run.** Runs share after this wave: Gu kinds about 35%, killer moves 10 of 778, Hogwarts potions 1 of 284, LOTM potions 0 of 226 (46 expressed as engine cases), ingredients 20 of 400. More labelling has diminishing returns. The next gain is engine capability chosen by the blocking-rule histogram (PWC5), which needs session work, not API spend. |
| ACCOUNT FOR NOW | PWC15 | **The wiki tier is not the chapter tier.** Almost every label from this wave is wiki tier, unchecked against chapters (GKM445). The cheapest place for real API money to buy quality is chapter-backed checks: rank for the 569 rank-blocked Gu, the 162 LOTM Sequences without formulas, and the 280 ingredients with no stated property. Run them as batch reads over the private chapter text, with the same hash split and the existing labels as the prediction to score. |
| LATER / DELEGATE | PWC16 | **"Everything" is more than powers.** CV3 covers powers, potions, ingredients, spells and Gu creatures. Each world also has items and artifacts (LOTM Sealed Artifacts, Worm Tinker tech, HP magical objects), places, institutions, people, creatures and jobs. Proposal: the same ledger shape per corpus, starting with artifacts, since the effect grammar and the power sheet already fit them. Level: Sonnet per world, Luna labels. Done when CV3 names a denominator per corpus per world. |
| LATER / DELEGATE | PWC17 | **Books on disk with no ledger and no wiki dump.** The full-book reads include Shadow Slave, Solo Leveling, Mother of Learning, Omniscient Reader, Circle of Inevitability, The Legendary Mechanic, Regressor's Tale, Fated Villain, A Novel Concept, Labyrinth of the Mad God, Speedrunning the Multiverse and You Have Died Again. The PWC9 census covers only wiki dumps, so these need names from their reader indexes and paid claims, as the Worm lane does. Level: Sonnet, one lane per three books. Done when each has a power ledger or a stated reason it has none. |
| LATER / DELEGATE | PWC18 | **One pass runner, not one script per lane.** This wave has seven label scripts, and each new lane writes its own builder and normaliser. A shared runner that takes a pass config (packet source, schema, prompt, scorer, fold rule) would cut each lane to a config file plus its scorer: less session time, and fewer merge conflicts in shared scripts. Level: Sonnet. Done when two existing passes run from configs with byte-identical outputs. |
| LATER / DELEGATE | PWC19 | **Spend a little more for second opinions where scores were weak.** Diet defaults matched 12 of 44, and sentence verbs 10 of 17. Rerunning those fields at medium effort, or with a stronger model on the disagreements only, costs cents and says whether the weakness is the model or the evidence. Done when each weak field has a second score. |

## Worm power ledger (2026-11-16)

Proposals (AD32), agent-verified, not human-reviewed. Ledger [`worm_powers.jsonl`](../../coverage/worm_powers.jsonl), sheet and score in [`worm_power_labels.json`](../../coverage/worm_power_labels.json), test `tests/worm_power_ledger.test.js`. Private inputs and replies stay under `private/worm_*` (gitignored); only normalised values, locators and speakers are committed. Builders: `scripts/worm_power_labels.mjs` (private half, phases `candidates resolve merge mergecheck freeze packets label second score sidecar`) and `scripts/worm_power_ledger.mjs` (reads the sidecar alone).

**Denominator (PWC3): 279 rows, 264 capes, Endbringers and Entities, 15 named Tinker devices.** Names come from data: every subject in the 2,112 paid reader claims (`2026-11-01-worm`, full-book `INDEX.json`), the 85-row cape table and the 35-profile people index (1,179 candidates after splitting on slashes). Luna sorted them into kinds and proposed alias groups, Haiku checked the groups, and the corrections made by hand are listed in the sidecar (`meta.mergeFixes`): Defiant's spear and knife are separate devices, Alexandria's Pretender copy and the Damsel of Distress clone are separate rows, Flechette and Wanton stay apart from Foil and Annex, William Manton is not the Siberian. 93 names went to `excluded` (groups, places, powerless civilians, generic "unknown cape" entries; reasons in the sidecar). All 85 cape-table rows match a row. Four rows have no claim and rest on the table or people index alone. Each row lists up to six claim IDs, its table row and its people heading under `source`.

**Frozen before any grammar call (advisor note).** Ids first, then the split (`sha1(id)[0] < 0x33`, GKM429): 46 rows held out. The score constants (`CLASS_PREDICTS`, `FOLD_RULE`) sit in the script as code, written before any result. Match means the labelled verb is in the class's verb set; object and target agreement are secondary lines. Brute, Tinker and Breaker predict nothing clean and are unscored. Only page-stated ratings count (table basis S or T, or a "Class N" line in a claim naming one cape); reader-inferred ratings are dropped. Class words, "Shifter", "Shaper", "Rogue", "Class N" and "protocols" were stripped from every cape packet (zero class words left).

**Score (PWC2), honest and thin.** 33 capes have a page-stated rating; 21 are scoreable (Master 6, Stranger 5, Shaker 3, Striker 3, Thinker 2, Blaster 1, Changer 1) and 12 are not (Tinker 7, Brute 3, Breaker 2).

| Set | n | Verb match | Majority-verb baseline | Object match | Target match |
| --- | ---: | ---: | ---: | ---: | ---: |
| Held out | 4 | 1 | 2 | 1 | 1 |
| All rated, unscored by the prompt | 21 | 10 | 7 | 11 | 5 |

**The grammar does not fold.** On the 4 held-out rows it ties or loses to always guessing "add" (1 of 4 against 2 of 4); on all 21 it leads by 3 (10 against 7), which meets the 10-point margin, but the pre-registered rule needs the held-out rows to hold too. So `grammar.checked` is false for every row and the ledger says "unchecked". By class: Shaker 3 of 3 and Thinker 2 of 2 match; Striker 0 of 3 (Luna reads touch powers as `add` or `move` with another target); Master 2 of 6 (Luna labels mind and swarm control `bind thing`, not `bind mind`); Stranger 2 of 5. 18 sentences break the verb-object fit table. The mapping was not retuned after seeing this.

**Second reader (Haiku, 112 rows: held-out, rated and a fixed 25% hash sample).** Agreement with Luna: mind 103 of 112, left_behind 106, route_to_player 93, where_from 94, who_may 92, knowledge 90, target 83, verb 78, go_wrong 80, blocked 72. A row's field shows "(readers differ)" in its note when they split, and only fields both read count as firm. Hand check: eight rows (Skitter, Imp, Lung, Contessa, Clockblocker, Siberian, Dragon suit, Containment foam) against their claims and table rows read true except Skitter's `one-person-only` for who_may, which is weak, and Clockblocker's `bind time` (invalid fit).

**Blocking rules (PWC5), 207 blocked, 72 catalogued with a runnable grammar sentence and no case yet, 0 unclassified.** `effect-unknown` 68, `tinker-device` 33, `power-interaction` 15, `body-form` 13, `mind-binding` 12, `area-field` 11, `protection-field` 10, `mind-state` 7, `projection-body` 7, `portal-space` 7, `conceal-or-sense` 6, `creature-control` 5, `time-manipulation` 5, `precognition` 3, `power-granting` 3, `timeline-split` 2. Slugs shared with the Hogwarts ledgers: `effect-unknown`, `body-form`, `mind-state`, `conceal-or-sense`, `protection-field`. The Worm-only ones are candidates for the cross-world histogram.

**Gaps named, not filled.**
- `where_from` is unknown on 232 of 275 rows and `mind` is none-stated on 257, `knowledge` unknown on 254. The 14 claims per packet rarely state a trigger. A follow-up pass over the table's trigger-story section (POWERS_SHARDS 1) and the people and knowledge facets would fill PWC4, PWC6 and PWC7; Luna low effort, about $0.10.
- 68 `effect-unknown` rows are mostly thin-claim names; the table-only and claim-light rows need the chapter text, not more labels.
- `route_to_player` is the model's view of plausible routes, not a WER answer; the WER17 pass per start is not run.
- No Worm wiki dump (PWC10); `worm.fandom.com` was not asked.

**Cost.** Luna 0.55M in and 0.16M out across resolve, merge and labels (about $0.13); Haiku 0.44M in and 0.12M out (about $1, assuming $1 and $5 per million). Under $2 in all, inside the $5 budget.

## Re:Zero ledger (2026-11-16, agent-verified, not human-reviewed)

`docs/coverage/rezero_powers.jsonl` has 204 rows: 178 powers and 26 names that are not powers (generic words, tier prefixes, attribute words, a non-canon and a fan-invented name). Zero are unclassified. Sidecar: `docs/coverage/rezero_power_labels.json` (normalised values, locators and speakers; paraphrases stay in the gitignored `private/rezero_*` files). Builder: `scripts/rezero_power_ledger.mjs` with `rezero_power_names.mjs`, `rezero_power_canon.mjs`, `rezero_power_wn_scan.py`, `rezero_power_frozen.mjs` and `rezero_power_build.mjs`; shape test `tests/rezero_power_ledger.test.js`.

**Denominator (PWC3, SKR1).** Luna read 31 chunks of the round 1 and round 2 deep dives and the four reader digests and listed 288 named powers; a free regex scan of the 504 Witch Cult chapters and the six web-novel IF epubs added names the notes never list (Arc 9 chapter 14 alone names about 30 Divine Protections). A hand-checked merge table joins translation variants into one row with both editions, for example Fiend Manipulation with Demon Manipulation, Earthsoul with Earth Spirits, Windbreaker with Wind Evasion and Xenoglossy with Soul of Language. Every row keeps its name sources and an edition tag (LN, WN or LN+WN). The light-novel text itself was not scanned; LN names come only from the digests.

| Class | Rows |
| --- | ---: |
| Divine Protection | 64 |
| Spell, root or tiered | 51 |
| Other named art | 20 |
| Authority (named working) | 16 |
| Spirit contract kind | 11 |
| Witch Factor (one per sin) | 9 |
| Curse | 5 |
| Return by Death and its telling penalty | 2 |

**Split and tables frozen first (GKM429, PWC2).** The hash rule (sha1 of the id, first byte below 0x33) gives 38 held-out powers. The attribute and sin prediction tables, the capability order and the fold rule were committed in `rezero_power_frozen.mjs` before any grammar pass ran. The grammar prompt saw each spell, Factor and Authority under a neutral token with its own names and the attribute or sin words masked. Holder names stayed, so a model's memory of who held what can still leak.

**Labels.** Luna at low effort filled the grammar parts and nine PWC1 fields per power ($0.07), Haiku 5.5 re-read the grammar on every row ($0.27) and Luna read the unmasked evidence for the stated attribute and sin ($0.01). The name pass cost $0.02, so the whole ledger cost about $0.4. Speaker comes from the digest's own SHOWN, STATED, WIKI or INFERRED tag when the cited line has exactly one, otherwise from Luna. Nine of 443 filled fields cited a locator outside the packet and are flagged `locatorMissing`. Free-text fields are committed only as keyword tags.

**Scores (held-out, small n).**

| Label | Held out | Rest | Baseline on held-out | Beats |
| --- | --- | --- | --- | --- |
| Attribute from grammar | 0 of 1 | 1 of 15 | 1 (yin) | No |
| Sin from grammar | 1 of 4 | 6 of 16 | 0 (greed) | Yes, by one row |

The first held-out pass stated 23 spell attributes and 13 Authority sins; a hand check found it took a scene's incidental word ("water" in a library, "wind" beside a mist) for a label. A stated label now counts only when the cited or another evidence line puts the label word beside the power's name (60 characters for spells, 90 for sins, or a catalogue row that leads with the label). That dropped Huma's labels (the digest says Ice, which is not one of the six) and left 16 attributes and 11 Authority sins (plus the 9 Factors, which state their own). The frozen attribute table does not beat its baseline, so spell grammar stays `grammarGuess`. The sin table beats it by one row of four, which is too thin to trust; the fold rule applies as written and the numbers are here so nobody reads that as a result. Luna and Haiku agree on verb for 52 of the 91 rows where both gave one, and on verb and object for 30, so only 22 rows fold as `grammar`.

**What the ledger shows.**

- 81 of 178 powers have no stated effect in the sources read (39 of 64 Divine Protections, 28 of 51 spells). The deep dives list names, not effects; this is a source gap, not a labelling failure. The route to close it is the light-novel text for spells and a wiki cross-check for blessings (round 2 L2); no wiki dump is on disk and PWC10 asks Weibao's yes per file.
- Where a power comes from is unstated for 147 rows. Contract is the one clear route (15), then Witch Factor transfer (6) and birth (3).
- Blocking capabilities (PWC5), counted over every row they touch, not just the first: `effect-unknown` 81, `spirit-contract-judgement` 11, `power-transfer` 7, `memory-erasure` 5, `mind-binding` 2, `death-checkpoint-rewind` 1, `speech-penalty` 1. 72 rows are `catalogued` (grammar and source, no executed effect), 106 blocked.
- **Return by Death is not `blocked:time-loop`.** The engine already has fixed-start month loops (`src/mol_zorian_loop.js`, `src/harm_loops.js`) and a player-marked return point that restores world and body with memory carried (`src/continuation_state.js`, TT1 in the time-travel doc). The missing piece is a rewind the holder's death triggers to a hidden checkpoint that moves on events (R1, R2), so it is `blocked:death-checkpoint-rewind`, with the telling penalty (R25) as `blocked:speech-penalty`.
- `holder-mind-drift` (PWC6) fires on no row: the sources read state almost no mind effect for Authorities, so the Archbishops' lying about their powers shows up only as speaker tags, not as a drift field.

**Hand corrections.** Return by Death's in-world knowledge is set by hand (the holder; a bystander learns only foresight, round 2 section 3.2), because Luna had no line. Name Eating carries a review flag: the lines found for it name Star Eating, so its effect read is Star Eating's. Little King is Regulus's Greed Authority with its substitute-heart wives and Cor Leonis is Subaru's use of it, checked in WN Arc 5 chapters 52 and 56 and Arc 6 chapter 87; Regulus's time stop keeps its own row from the round 1 catalogue.

**Gaps.** Light-novel volumes 11 to 29 are held but unread; the IF epubs were scanned for names only. `route_to_player` is an authored proposal from the round 2 start kit, not a source fact. Rows with one evidence line (many Arc 9 blessings) are thin by construction.
