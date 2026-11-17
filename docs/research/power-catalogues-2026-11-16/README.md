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
| LATER / DELEGATE | PWC9 | **The 13 dump worlds as one census.** A deterministic, no-API census counts each world's power categories and page counts from the local dumps. It ranks worlds by power-row count and by how many of their likely blocking rules are already blocking other worlds, so the first dump worlds labelled are the ones that share the most engine work. Level: Sonnet script, no model calls. Done when `docs/coverage/README.md` lists a proposed ledger per world with its denominator source and count. |
| LATER / DELEGATE | PWC10 | **Wiki dumps for the three book worlds need Weibao's yes per file.** The Worm, Re:Zero and Perfect Run wikis are not on disk, and Worm's host refused automated reads in October. Each session names the file, source and size and waits for his yes. Bot checks are never bypassed; without a dump, the reader claims and people indexes are the source. |

## Order (working default, AD56)

1. Worm, Re:Zero and The Perfect Run, one session each, from the claims and reads already held. PWC1-PWC7 are applied. The world's own classification is scored where it has one, and the ledgers are `docs/coverage/worm_powers.jsonl`, `rezero_powers.jsonl` and `perfect_run_powers.jsonl`.
2. The PWC9 census over the 13 dump worlds, then label passes for the top ones in census order.
3. The cross-world blocking-rule histogram (PWC5) in the coverage README, once two or more power ledgers exist.

## Budget

At the measured rate, about $0.0002 per Luna row and $0.0006 per Haiku row, a few thousand power rows cost a few dollars. The sessions keep each world under $5 without asking.

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
