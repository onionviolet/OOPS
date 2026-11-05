# Cross-world detail pass, round 2: coverage matrix (2026-11-03, proposal)

Status: agent audit, generated from haiku reader returns; a proposal (AD32), nothing accepted, built or browser-verified. Owner: [CROSS_WORLD_DETAIL_PASS](CROSS_WORLD_DETAIL_PASS_2026-11-03.md), round 2. This file exists only because 16 worlds by 36 families is too large for the owner doc (WPR3); the owner holds the findings.

**How to read it.** C = covered, P = partial, N = not found, in that world's own docs as read. "Covered" means the world's docs or kit card contain authored or sourced wording for the family (mostly *proposed* text), not that the game does it. For anime and game worlds the payload was keyword-filtered excerpts, so N means "not found in the excerpts read", not "absent from the world" (WPR23). Locators are `path:line`, relative to `docs/worlds/`; I confirmed that all but a handful resolve to a non-empty line, and I opened about thirty (see the owner doc, Round 2 spot-checks). D&D combines two reads (the kit card and the dnd/ docs); its CW02 was set to N after checking that the card's only hit is an inn table with no fit rules.

## Grid

| Family | dnd | fma | sky | fo | elden | bleach | naruto | jjk | hxh | fate | op | mha | ds | bc | csm | frieren | C | P | N |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CW01 body affordances | P | C | C | C | C | C | C | C | C | P | C | C | C | P | C | C | 13 | 3 | 0 |
| CW02 fit and furnishings | N | P | P | P | C | P | P | P | N | N | P | P | P | N | N | N | 1 | 9 | 6 |
| CW03 food, power, upkeep | P | P | C | P | P | P | P | P | P | P | P | C | C | P | P | P | 3 | 13 | 0 |
| CW04 care and recovery | P | P | C | C | C | C | C | C | C | P | C | C | C | C | C | P | 12 | 4 | 0 |
| CW05 birth and development | P | P | P | P | P | P | P | C | P | N | P | P | P | P | P | P | 1 | 14 | 1 |
| CW06 home routines, hospitality | P | N | P | P | C | P | P | P | P | N | N | P | P | N | P | P | 1 | 11 | 4 |
| CW07 land, weather, habitat | P | P | C | P | P | P | P | P | C | P | C | P | C | P | P | C | 5 | 11 | 0 |
| CW08 kinship, starting ties | P | P | C | P | C | C | C | C | C | P | P | C | C | P | P | P | 8 | 8 | 0 |
| CW09 provenance, substitution | P | P | C | C | C | P | P | P | P | P | P | C | C | P | P | P | 5 | 11 | 0 |
| CW10 tools, custody, access | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | 16 | 0 | 0 |
| CW11 procedure, instruction | P | C | C | C | C | P | C | C | C | P | P | C | C | C | C | C | 12 | 4 | 0 |
| CW12 spells, controlled effects | C | C | C | P | C | P | P | C | C | C | C | C | C | C | C | C | 13 | 3 | 0 |
| CW13 testing, calibration | P | C | C | C | C | C | C | C | C | N | P | P | N | P | N | P | 8 | 5 | 3 |
| CW14 failure, interruption, residue | C | C | C | C | C | C | C | C | C | C | P | C | C | P | P | P | 12 | 4 | 0 |
| CW15 repair, cleaning, restoration | P | P | C | C | C | C | C | C | C | P | C | C | C | P | P | P | 10 | 6 | 0 |
| CW16 containers, labels, storage | P | P | C | P | P | C | P | P | P | N | P | N | P | P | N | P | 2 | 11 | 3 |
| CW17 enchantment, maintenance | P | P | C | P | P | P | P | P | N | P | P | P | P | P | N | P | 1 | 13 | 2 |
| CW18 workshop scale, waste | P | P | C | C | C | P | P | P | N | N | P | P | P | N | N | N | 3 | 8 | 5 |
| CW19 teachers, helpers | C | C | C | P | C | C | C | C | C | P | P | C | C | C | P | C | 12 | 4 | 0 |
| CW20 customers, commissions | C | C | C | C | C | C | C | C | C | P | C | P | P | C | C | C | 13 | 3 | 0 |
| CW21 credentials, access | P | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | 15 | 1 | 0 |
| CW22 promises, obligations | C | C | C | C | C | C | C | C | C | C | C | C | P | C | C | C | 15 | 1 | 0 |
| CW23 identity, disguise, recognition | P | P | P | C | P | P | P | P | P | P | P | P | P | P | P | P | 1 | 15 | 0 |
| CW24 memory, testimony, evidence | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | 16 | 0 | 0 |
| CW25 messages, maps, location | P | P | C | P | P | P | P | P | P | P | P | P | P | C | P | C | 3 | 13 | 0 |
| CW26 copies, portraits, agents | P | P | P | P | P | P | P | P | N | P | P | P | N | P | N | P | 0 | 13 | 3 |
| CW27 consent, control, motives | C | C | C | C | C | P | C | C | C | C | C | C | C | C | C | C | 15 | 1 | 0 |
| CW28 law, trade, diffusion | P | P | C | C | C | P | C | C | C | P | C | P | P | P | P | C | 8 | 8 | 0 |
| CW29 calendars, lived time, absence | P | P | C | P | C | C | C | C | C | P | P | P | C | P | C | C | 9 | 7 | 0 |
| CW30 history, starts, butterflies | P | C | C | C | C | C | C | C | C | C | C | C | C | C | C | C | 15 | 1 | 0 |
| CW31 loops and branches | P | P | P | P | P | P | P | P | P | C | P | P | P | P | P | P | 1 | 15 | 0 |
| CW32 luck, prophecy, outliers | P | P | C | P | P | N | N | C | P | N | N | N | N | P | P | P | 2 | 8 | 6 |
| CW33 endings, death, ongoing life | P | P | P | P | P | P | P | P | P | C | P | P | C | C | C | C | 5 | 11 | 0 |
| CW34 legacy, succession | P | P | P | P | P | P | P | C | P | N | N | N | N | C | N | P | 2 | 9 | 5 |
| CW35 crossing, retention | P | P | C | C | C | C | C | C | C | C | C | C | C | C | C | C | 14 | 2 | 0 |
| CW36 presentation, durable state | P | P | C | C | P | C | C | P | C | P | C | C | C | P | P | P | 8 | 8 | 0 |
| All |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 280 | 258 | 38 |

World totals (C/P/N): dnd 8/27/1; fma 13/22/1; sky 28/8/0; fo 19/17/0; elden 23/13/0; bleach 17/18/1; naruto 19/16/1; jjk 22/14/0; hxh 21/11/4; fate 11/17/8; op 15/18/3; mha 18/15/3; ds 20/12/4; bc 15/18/3; csm 14/15/7; frieren 17/17/2.

## dnd

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | P | world-core-kit-2026-10-14/cards/dnd.md:545 | proposed |
| CW02 | N | - | - |
| CW03 | P | world-core-kit-2026-10-14/cards/dnd.md:51 | stated |
| CW04 | P | world-core-kit-2026-10-14/cards/dnd.md:380 | stated |
| CW05 | P | world-core-kit-2026-10-14/cards/dnd.md:386 | proposed |
| CW06 | P | world-core-kit-2026-10-14/cards/dnd.md:445 | inferred |
| CW07 | P | world-core-kit-2026-10-14/cards/dnd.md:484 | proposed |
| CW08 | P | world-core-kit-2026-10-14/cards/dnd.md:443 | inferred |
| CW09 | P | world-core-kit-2026-10-14/cards/dnd.md:485 | proposed |
| CW10 | C | dnd/RULINGS_LEDGER.md:40 | proposed |
| CW11 | P | world-core-kit-2026-10-14/cards/dnd.md:382 | stated |
| CW12 | C | dnd/RULINGS_LEDGER.md:30 | proposed (fixture application; underlying rule has a separate source locator) |
| CW13 | P | world-core-kit-2026-10-14/cards/dnd.md:518 | proposed |
| CW14 | C | dnd/RULINGS_LEDGER.md:32 | proposed |
| CW15 | P | world-core-kit-2026-10-14/cards/dnd.md:710 | inferred |
| CW16 | P | world-core-kit-2026-10-14/cards/dnd.md:485 | proposed |
| CW17 | P | world-core-kit-2026-10-14/cards/dnd.md:546 | proposed |
| CW18 | P | world-core-kit-2026-10-14/cards/dnd.md:485 | proposed |
| CW19 | C | dnd/RULINGS_LEDGER.md:39 | proposed |
| CW20 | C | world-core-kit-2026-10-14/cards/dnd.md:444 | inferred |
| CW21 | P | world-core-kit-2026-10-14/cards/dnd.md:455 | proposed |
| CW22 | C | dnd/RULINGS_LEDGER.md:40 | proposed |
| CW23 | P | world-core-kit-2026-10-14/cards/dnd.md:771 | inferred |
| CW24 | C | dnd/RULINGS_LEDGER.md:49 | proposed |
| CW25 | P | world-core-kit-2026-10-14/cards/dnd.md:672 | inferred |
| CW26 | P | world-core-kit-2026-10-14/cards/dnd.md:239 | proposed |
| CW27 | C | dnd/RULINGS_LEDGER.md:34 | proposed |
| CW28 | P | world-core-kit-2026-10-14/cards/dnd.md:383 | inferred |
| CW29 | P | world-core-kit-2026-10-14/cards/dnd.md:457 | inferred |
| CW30 | P | world-core-kit-2026-10-14/cards/dnd.md:96 | shown |
| CW31 | P | dnd/FOUNDATION.md:9 | proposed |
| CW32 | P | world-core-kit-2026-10-14/cards/dnd.md:549 | proposed |
| CW33 | P | world-core-kit-2026-10-14/cards/dnd.md:553 | proposed |
| CW34 | P | world-core-kit-2026-10-14/cards/dnd.md:556 | proposed |
| CW35 | P | world-core-kit-2026-10-14/cards/dnd.md:719 | inferred |
| CW36 | P | world-core-kit-2026-10-14/cards/dnd.md:487 | proposed |

## fullmetal-alchemist

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | fullmetal-alchemist/INTERACTIONS.md:9 | proposed |
| CW02 | P | fullmetal-alchemist/INTERACTIONS.md:9 | proposed |
| CW03 | P | fullmetal-alchemist/MODULE_CATALOGUE.md:17 | stated |
| CW04 | P | fullmetal-alchemist/CAMPAIGN.md:23 | proposed |
| CW05 | P | fullmetal-alchemist/MODULE_CATALOGUE.md:20 | stated |
| CW06 | N | - | - |
| CW07 | P | fullmetal-alchemist/INTERACTIONS.md:9 | proposed |
| CW08 | P | fullmetal-alchemist/SYNTHESIS.md:86 | proposed |
| CW09 | P | fullmetal-alchemist/WORLD_BRIEF.md:15 | proposed |
| CW10 | C | fullmetal-alchemist/CAMPAIGN.md:11 | proposed |
| CW11 | C | fullmetal-alchemist/SYNTHESIS.md:60 | proposed |
| CW12 | C | fullmetal-alchemist/MODULE_CATALOGUE.md:8 | stated |
| CW13 | C | fullmetal-alchemist/INTERACTIONS.md:16 | proposed |
| CW14 | C | fullmetal-alchemist/INTERACTIONS.md:7 | proposed |
| CW15 | P | fullmetal-alchemist/INTERACTIONS.md:15 | proposed |
| CW16 | P | fullmetal-alchemist/MODULE_CATALOGUE.md:26 | stated |
| CW17 | P | fullmetal-alchemist/MODULE_CATALOGUE.md:8 | stated |
| CW18 | P | fullmetal-alchemist/CAMPAIGN.md:20 | proposed |
| CW19 | C | fullmetal-alchemist/INTERACTIONS.md:7 | proposed |
| CW20 | C | fullmetal-alchemist/CAMPAIGN.md:9 | proposed |
| CW21 | C | fullmetal-alchemist/INTERACTIONS.md:12 | proposed |
| CW22 | C | fullmetal-alchemist/CAMPAIGN.md:33 | proposed |
| CW23 | P | fullmetal-alchemist/SYNTHESIS.md:62 | proposed |
| CW24 | C | fullmetal-alchemist/CAMPAIGN.md:22 | proposed |
| CW25 | P | world-core-kit-2026-10-14/cards/fullmetal-alchemist.md:107 | shown |
| CW26 | P | world-core-kit-2026-10-14/cards/fullmetal-alchemist.md:239 | shown |
| CW27 | C | fullmetal-alchemist/INTERACTIONS.md:14 | proposed |
| CW28 | P | fullmetal-alchemist/MODULE_CATALOGUE.md:27 | stated |
| CW29 | P | fullmetal-alchemist/CAMPAIGN.md:33 | proposed |
| CW30 | C | fullmetal-alchemist/CAMPAIGN.md:43 | proposed |
| CW31 | P | fullmetal-alchemist/SYNTHESIS.md:33 | proposed |
| CW32 | P | fullmetal-alchemist/WORLD_BRIEF.md:38 | proposed |
| CW33 | P | fullmetal-alchemist/SYNTHESIS.md:80 | proposed |
| CW34 | P | world-core-kit-2026-10-14/cards/fullmetal-alchemist.md:228 | shown |
| CW35 | P | world-core-kit-2026-10-14/cards/fullmetal-alchemist.md:217 | shown |
| CW36 | P | fullmetal-alchemist/SYNTHESIS.md:114 | proposed |

## skyrim

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | skyrim/CAMPAIGN.md:58 | proposed |
| CW02 | P | skyrim/MODULE_CATALOGUE.md:35 | proposed |
| CW03 | C | skyrim/MODULE_CATALOGUE.md:141 | proposed |
| CW04 | C | skyrim/INTERACTIONS.md:30 | proposed |
| CW05 | P | skyrim/CAMPAIGN.md:134 | proposed |
| CW06 | P | skyrim/CAMPAIGN.md:40 | proposed |
| CW07 | C | skyrim/CAMPAIGN.md:38 | proposed |
| CW08 | C | skyrim/CAMPAIGN.md:150 | proposed |
| CW09 | C | skyrim/CAMPAIGN.md:39 | proposed |
| CW10 | C | skyrim/MODULE_CATALOGUE.md:78 | proposed |
| CW11 | C | skyrim/CAMPAIGN.md:139 | proposed |
| CW12 | C | skyrim/CAMPAIGN.md:11 | shown |
| CW13 | C | skyrim/MODULE_CATALOGUE.md:88 | proposed |
| CW14 | C | skyrim/MODULE_CATALOGUE.md:89 | proposed |
| CW15 | C | skyrim/CAMPAIGN.md:82 | proposed |
| CW16 | C | skyrim/MODULE_CATALOGUE.md:61 | proposed |
| CW17 | C | skyrim/MODULE_CATALOGUE.md:101 | proposed |
| CW18 | C | skyrim/MODULE_CATALOGUE.md:44 | proposed |
| CW19 | C | skyrim/CAMPAIGN.md:152 | proposed |
| CW20 | C | skyrim/CAMPAIGN.md:178 | proposed |
| CW21 | C | skyrim/MODULE_CATALOGUE.md:22 | proposed |
| CW22 | C | skyrim/CAMPAIGN.md:174 | proposed |
| CW23 | P | skyrim/INTERACTIONS.md:27 | proposed |
| CW24 | C | skyrim/CAMPAIGN.md:160 | proposed |
| CW25 | C | skyrim/CAMPAIGN.md:45 | proposed |
| CW26 | P | skyrim/CAMPAIGN.md:133 | proposed |
| CW27 | C | skyrim/INTERACTIONS.md:82 | proposed |
| CW28 | C | skyrim/CAMPAIGN.md:38 | proposed |
| CW29 | C | skyrim/MODULE_CATALOGUE.md:82 | proposed |
| CW30 | C | skyrim/CAMPAIGN.md:221 | proposed |
| CW31 | P | skyrim/CAMPAIGN.md:214 | proposed |
| CW32 | C | skyrim/CAMPAIGN.md:205 | proposed |
| CW33 | P | skyrim/WORLD_BRIEF.md:46 | proposed |
| CW34 | P | skyrim/CAMPAIGN.md:155 | proposed |
| CW35 | C | skyrim/CAMPAIGN.md:222 | proposed |
| CW36 | C | skyrim/WORLD_BRIEF.md:36 | proposed |

## fallout

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | fallout/CAMPAIGN.md:219 | proposed |
| CW02 | P | fallout/MODULE_CATALOGUE.md:51 | proposed |
| CW03 | P | fallout/WORLD_BRIEF.md:26 | proposed |
| CW04 | C | fallout/MODULE_CATALOGUE.md:99 | proposed |
| CW05 | P | fallout/CAMPAIGN.md:66 | proposed |
| CW06 | P | fallout/CAMPAIGN.md:63 | proposed |
| CW07 | P | fallout/CAMPAIGN.md:134 | proposed |
| CW08 | P | fallout/WORLD_BRIEF.md:30 | proposed |
| CW09 | C | fallout/MODULE_CATALOGUE.md:181 | proposed |
| CW10 | C | fallout/MODULE_CATALOGUE.md:26 | proposed |
| CW11 | C | fallout/MODULE_CATALOGUE.md:24 | proposed |
| CW12 | P | fallout/MODULE_CATALOGUE.md:190 | proposed |
| CW13 | C | fallout/CAMPAIGN.md:141 | proposed |
| CW14 | C | fallout/MODULE_CATALOGUE.md:90 | proposed |
| CW15 | C | fallout/CAMPAIGN.md:81 | proposed |
| CW16 | P | fallout/CAMPAIGN.md:78 | proposed |
| CW17 | P | fallout/CAMPAIGN.md:12 | shown |
| CW18 | C | fallout/MODULE_CATALOGUE.md:45 | proposed |
| CW19 | P | fallout/CAMPAIGN.md:195 | proposed |
| CW20 | C | fallout/CAMPAIGN.md:151 | proposed |
| CW21 | C | fallout/INTERACTIONS.md:21 | proposed |
| CW22 | C | fallout/INTERACTIONS.md:32 | proposed |
| CW23 | C | fallout/INTERACTIONS.md:27 | proposed |
| CW24 | C | fallout/INTERACTIONS.md:31 | proposed |
| CW25 | P | fallout/CAMPAIGN.md:33 | stated |
| CW26 | P | fallout/CAMPAIGN.md:225 | proposed |
| CW27 | C | fallout/WORLD_BRIEF.md:42 | proposed |
| CW28 | C | fallout/CAMPAIGN.md:214 | proposed |
| CW29 | P | fallout/CAMPAIGN.md:227 | proposed |
| CW30 | C | fallout/CAMPAIGN.md:212 | proposed |
| CW31 | P | fallout/CAMPAIGN.md:215 | proposed |
| CW32 | P | fallout/WORLD_BRIEF.md:50 | proposed |
| CW33 | P | fallout/WORLD_BRIEF.md:46 | stated |
| CW34 | P | fallout/CAMPAIGN.md:50 | proposed |
| CW35 | C | fallout/CAMPAIGN.md:84 | proposed |
| CW36 | C | fallout/WORLD_BRIEF.md:36 | proposed |

## elden-ring

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | elden-ring/CAMPAIGN.md:59 | proposed |
| CW02 | C | elden-ring/CAMPAIGN.md:63 | proposed |
| CW03 | P | elden-ring/MODULE_CATALOGUE.md:42 | proposed |
| CW04 | C | elden-ring/CAMPAIGN.md:155 | proposed |
| CW05 | P | elden-ring/CAMPAIGN.md:24 | proposed |
| CW06 | C | elden-ring/CAMPAIGN.md:155 | proposed |
| CW07 | P | elden-ring/CAMPAIGN.md:132 | proposed |
| CW08 | C | elden-ring/CAMPAIGN.md:153 | proposed |
| CW09 | C | elden-ring/CAMPAIGN.md:134 | proposed |
| CW10 | C | elden-ring/MODULE_CATALOGUE.md:78 | proposed |
| CW11 | C | elden-ring/INTERACTIONS.md:79 | proposed |
| CW12 | C | elden-ring/MODULE_CATALOGUE.md:60 | proposed |
| CW13 | C | elden-ring/INTERACTIONS.md:78 | proposed |
| CW14 | C | elden-ring/MODULE_CATALOGUE.md:93 | proposed |
| CW15 | C | elden-ring/CAMPAIGN.md:85 | proposed |
| CW16 | P | elden-ring/MODULE_CATALOGUE.md:81 | proposed |
| CW17 | P | elden-ring/CAMPAIGN.md:63 | proposed |
| CW18 | C | elden-ring/MODULE_CATALOGUE.md:68 | proposed |
| CW19 | C | elden-ring/INTERACTIONS.md:79 | proposed |
| CW20 | C | elden-ring/WORLD_BRIEF.md:28 | proposed |
| CW21 | C | elden-ring/MODULE_CATALOGUE.md:24 | proposed |
| CW22 | C | elden-ring/WORLD_BRIEF.md:34 | proposed |
| CW23 | P | elden-ring/WORLD_BRIEF.md:32 | proposed |
| CW24 | C | elden-ring/INTERACTIONS.md:109 | proposed |
| CW25 | P | elden-ring/CAMPAIGN.md:47 | proposed |
| CW26 | P | elden-ring/CAMPAIGN.md:134 | proposed |
| CW27 | C | elden-ring/INTERACTIONS.md:59 | proposed |
| CW28 | C | elden-ring/CAMPAIGN.md:163 | proposed |
| CW29 | C | elden-ring/CAMPAIGN.md:143 | proposed |
| CW30 | C | elden-ring/WORLD_BRIEF.md:32 | proposed |
| CW31 | P | elden-ring/WORLD_BRIEF.md:32 | proposed |
| CW32 | P | elden-ring/CAMPAIGN.md:70 | proposed |
| CW33 | P | elden-ring/WORLD_BRIEF.md:46 | proposed |
| CW34 | P | elden-ring/INTERACTIONS.md:64 | proposed |
| CW35 | C | elden-ring/WORLD_BRIEF.md:42 | proposed |
| CW36 | P | elden-ring/WORLD_BRIEF.md:45 | proposed |

## bleach

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | bleach/MODULE_CATALOGUE.md:23 | proposed |
| CW02 | P | bleach/CAMPAIGN.md:48 | proposed |
| CW03 | P | bleach/INTERACTIONS.md:16 | proposed |
| CW04 | C | bleach/CAMPAIGN.md:47 | proposed |
| CW05 | P | bleach/INTERACTIONS.md:22 | proposed |
| CW06 | P | bleach/CAMPAIGN.md:45 | proposed |
| CW07 | P | bleach/CAMPAIGN.md:49 | proposed |
| CW08 | C | bleach/WORLD_BRIEF.md:29 | proposed |
| CW09 | P | bleach/WORLD_BRIEF.md:40 | proposed |
| CW10 | C | bleach/MODULE_CATALOGUE.md:26 | proposed |
| CW11 | P | bleach/MODULE_CATALOGUE.md:34 | proposed |
| CW12 | P | bleach/CAMPAIGN.md:20 | stated |
| CW13 | C | bleach/MODULE_CATALOGUE.md:25 | proposed |
| CW14 | C | bleach/WORLD_BRIEF.md:43 | proposed |
| CW15 | C | bleach/MODULE_CATALOGUE.md:21 | proposed |
| CW16 | C | bleach/INTERACTIONS.md:43 | proposed |
| CW17 | P | bleach/MODULE_CATALOGUE.md:10 | proposed |
| CW18 | P | bleach/MODULE_CATALOGUE.md:21 | proposed |
| CW19 | C | bleach/CAMPAIGN.md:19 | proposed |
| CW20 | C | bleach/WORLD_BRIEF.md:35 | proposed |
| CW21 | C | bleach/INTERACTIONS.md:28 | proposed |
| CW22 | C | bleach/WORLD_BRIEF.md:33 | proposed |
| CW23 | P | bleach/INTERACTIONS.md:28 | proposed |
| CW24 | C | bleach/INTERACTIONS.md:32 | proposed |
| CW25 | P | bleach/INTERACTIONS.md:34 | proposed |
| CW26 | P | bleach/MODULE_CATALOGUE.md:39 | proposed |
| CW27 | P | bleach/WORLD_BRIEF.md:41 | proposed |
| CW28 | P | bleach/CAMPAIGN.md:44 | proposed |
| CW29 | C | bleach/WORLD_BRIEF.md:44 | proposed |
| CW30 | C | bleach/WORLD_BRIEF.md:31 | proposed |
| CW31 | P | bleach/WORLD_BRIEF.md:31 | proposed |
| CW32 | N | - | - |
| CW33 | P | bleach/WORLD_BRIEF.md:45 | proposed |
| CW34 | P | bleach/INTERACTIONS.md:37 | proposed |
| CW35 | C | bleach/WORLD_BRIEF.md:41 | proposed |
| CW36 | C | bleach/INTERACTIONS.md:54 | proposed |

## naruto

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | naruto/MODULE_CATALOGUE.md:24 | proposed |
| CW02 | P | naruto/INTERACTIONS.md:47 | proposed |
| CW03 | P | naruto/MODULE_CATALOGUE.md:22 | proposed |
| CW04 | C | naruto/MODULE_CATALOGUE.md:8 | stated |
| CW05 | P | naruto/INTERACTIONS.md:22 | proposed |
| CW06 | P | naruto/INTERACTIONS.md:16 | proposed |
| CW07 | P | naruto/CAMPAIGN.md:39 | proposed |
| CW08 | C | naruto/INTERACTIONS.md:13 | proposed |
| CW09 | P | naruto/MODULE_CATALOGUE.md:20 | stated |
| CW10 | C | naruto/INTERACTIONS.md:65 | proposed |
| CW11 | C | naruto/INTERACTIONS.md:17 | proposed |
| CW12 | P | naruto/MODULE_CATALOGUE.md:10 | stated |
| CW13 | C | naruto/INTERACTIONS.md:29 | proposed |
| CW14 | C | naruto/INTERACTIONS.md:68 | proposed |
| CW15 | C | naruto/INTERACTIONS.md:51 | proposed |
| CW16 | P | naruto/WORLD_BRIEF.md:27 | proposed |
| CW17 | P | naruto/MODULE_CATALOGUE.md:22 | proposed |
| CW18 | P | naruto/INTERACTIONS.md:34 | proposed |
| CW19 | C | naruto/INTERACTIONS.md:21 | proposed |
| CW20 | C | naruto/WORLD_BRIEF.md:26 | proposed |
| CW21 | C | naruto/INTERACTIONS.md:28 | proposed |
| CW22 | C | naruto/WORLD_BRIEF.md:32 | proposed |
| CW23 | P | naruto/INTERACTIONS.md:28 | proposed |
| CW24 | C | naruto/INTERACTIONS.md:32 | proposed |
| CW25 | P | naruto/INTERACTIONS.md:16 | proposed |
| CW26 | P | naruto/INTERACTIONS.md:36 | proposed |
| CW27 | C | naruto/INTERACTIONS.md:44 | proposed |
| CW28 | C | naruto/WORLD_BRIEF.md:39 | proposed |
| CW29 | C | naruto/WORLD_BRIEF.md:43 | proposed |
| CW30 | C | naruto/CAMPAIGN.md:30 | proposed |
| CW31 | P | naruto/WORLD_BRIEF.md:30 | proposed |
| CW32 | N | - | - |
| CW33 | P | naruto/WORLD_BRIEF.md:44 | proposed |
| CW34 | P | naruto/MODULE_CATALOGUE.md:27 | stated |
| CW35 | C | naruto/WORLD_BRIEF.md:40 | proposed |
| CW36 | C | naruto/INTERACTIONS.md:54 | proposed |

## jujutsu

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | jujutsu/MODULE_CATALOGUE.md:18 | stated |
| CW02 | P | jujutsu/CAMPAIGN.md:34 | proposed (my grep correction: tool fitting alone, no body-fit or furnishings) |
| CW03 | P | jujutsu/WORLD_BRIEF.md:79 | proposed |
| CW04 | C | jujutsu/CAMPAIGN.md:33 | proposed |
| CW05 | C | jujutsu/WORLD_BRIEF.md:80 | stated |
| CW06 | P | jujutsu/CAMPAIGN.md:39 | proposed |
| CW07 | P | jujutsu/CAMPAIGN.md:18 | proposed |
| CW08 | C | jujutsu/CAMPAIGN.md:11 | proposed |
| CW09 | P | jujutsu/INTERACTIONS.md:21 | proposed |
| CW10 | C | jujutsu/INTERACTIONS.md:13 | proposed |
| CW11 | C | jujutsu/MODULE_CATALOGUE.md:7 | proposed |
| CW12 | C | jujutsu/MODULE_CATALOGUE.md:20 | proposed |
| CW13 | C | jujutsu/INTERACTIONS.md:42 | proposed |
| CW14 | C | jujutsu/CAMPAIGN.md:39 | proposed |
| CW15 | C | jujutsu/CAMPAIGN.md:34 | proposed |
| CW16 | P | jujutsu/CAMPAIGN.md:19 | proposed |
| CW17 | P | jujutsu/MODULE_CATALOGUE.md:19 | proposed |
| CW18 | P | jujutsu/CAMPAIGN.md:34 | proposed |
| CW19 | C | jujutsu/INTERACTIONS.md:11 | proposed |
| CW20 | C | jujutsu/CAMPAIGN.md:39 | proposed |
| CW21 | C | jujutsu/CAMPAIGN.md:17 | proposed |
| CW22 | C | jujutsu/INTERACTIONS.md:24 | proposed |
| CW23 | P | jujutsu/CAMPAIGN.md:19 | proposed |
| CW24 | C | jujutsu/INTERACTIONS.md:36 | proposed |
| CW25 | P | jujutsu/CAMPAIGN.md:18 | proposed |
| CW26 | P | jujutsu/MODULE_CATALOGUE.md:23 | proposed |
| CW27 | C | jujutsu/INTERACTIONS.md:57 | stated |
| CW28 | C | jujutsu/INTERACTIONS.md:73 | stated |
| CW29 | C | jujutsu/MODULE_CATALOGUE.md:16 | proposed |
| CW30 | C | jujutsu/CAMPAIGN.md:7 | proposed |
| CW31 | P | jujutsu/CAMPAIGN.md:7 | proposed |
| CW32 | C | jujutsu/WORLD_BRIEF.md:68 | proposed |
| CW33 | P | jujutsu/CAMPAIGN.md:41 | proposed |
| CW34 | C | jujutsu/INTERACTIONS.md:65 | stated |
| CW35 | C | jujutsu/CAMPAIGN.md:22 | proposed |
| CW36 | P | jujutsu/WORLD_BRIEF.md:34 | proposed |

## hunter-x-hunter

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | hunter-x-hunter/MODULE_CATALOGUE.md:9 | stated |
| CW02 | N | - | - |
| CW03 | P | hunter-x-hunter/MODULE_CATALOGUE.md:28 | proposed |
| CW04 | C | hunter-x-hunter/MODULE_CATALOGUE.md:38 | stated |
| CW05 | P | hunter-x-hunter/INTERACTIONS.md:13 | proposed |
| CW06 | P | hunter-x-hunter/CAMPAIGN.md:11 | proposed |
| CW07 | C | hunter-x-hunter/MODULE_CATALOGUE.md:21 | stated |
| CW08 | C | hunter-x-hunter/CAMPAIGN.md:9 | proposed |
| CW09 | P | hunter-x-hunter/INTERACTIONS.md:15 | proposed |
| CW10 | C | hunter-x-hunter/WORLD_BRIEF.md:29 | stated |
| CW11 | C | hunter-x-hunter/MODULE_CATALOGUE.md:18 | stated |
| CW12 | C | hunter-x-hunter/MODULE_CATALOGUE.md:12 | proposed |
| CW13 | C | hunter-x-hunter/INTERACTIONS.md:10 | proposed |
| CW14 | C | hunter-x-hunter/INTERACTIONS.md:30 | stated |
| CW15 | C | hunter-x-hunter/MODULE_CATALOGUE.md:38 | proposed |
| CW16 | P | hunter-x-hunter/MODULE_CATALOGUE.md:28 | proposed |
| CW17 | N | - | - |
| CW18 | N | - | - |
| CW19 | C | hunter-x-hunter/INTERACTIONS.md:13 | proposed |
| CW20 | C | hunter-x-hunter/CAMPAIGN.md:10 | proposed |
| CW21 | C | hunter-x-hunter/INTERACTIONS.md:12 | stated |
| CW22 | C | hunter-x-hunter/MODULE_CATALOGUE.md:16 | proposed |
| CW23 | P | hunter-x-hunter/INTERACTIONS.md:17 | stated |
| CW24 | C | hunter-x-hunter/INTERACTIONS.md:22 | proposed |
| CW25 | P | hunter-x-hunter/MODULE_CATALOGUE.md:23 | stated |
| CW26 | N | - | - |
| CW27 | C | hunter-x-hunter/INTERACTIONS.md:18 | proposed |
| CW28 | C | hunter-x-hunter/INTERACTIONS.md:17 | stated |
| CW29 | C | hunter-x-hunter/INTERACTIONS.md:22 | proposed |
| CW30 | C | hunter-x-hunter/WORLD_BRIEF.md:46 | proposed |
| CW31 | P | hunter-x-hunter/WORLD_BRIEF.md:55 | proposed |
| CW32 | P | hunter-x-hunter/WORLD_BRIEF.md:51 | proposed |
| CW33 | P | hunter-x-hunter/MODULE_CATALOGUE.md:20 | stated |
| CW34 | P | hunter-x-hunter/MODULE_CATALOGUE.md:22 | proposed |
| CW35 | C | hunter-x-hunter/MODULE_CATALOGUE.md:20 | stated |
| CW36 | C | hunter-x-hunter/MODULE_CATALOGUE.md:30 | proposed |

## fate

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | P | fate/MODULE_CATALOGUE.md:10 | proposed |
| CW02 | N | - | - |
| CW03 | P | fate/INTERACTIONS.md:9 | proposed |
| CW04 | P | fate/MODULE_CATALOGUE.md:23 | proposed |
| CW05 | N | - | - |
| CW06 | N | - | - |
| CW07 | P | fate/MODULE_CATALOGUE.md:24 | proposed |
| CW08 | P | fate/CAMPAIGN.md:37 | proposed |
| CW09 | P | fate/MODULE_CATALOGUE.md:17 | proposed |
| CW10 | C | fate/INTERACTIONS.md:14 | proposed |
| CW11 | P | fate/MODULE_CATALOGUE.md:19 | proposed |
| CW12 | C | fate/MODULE_CATALOGUE.md:16 | proposed |
| CW13 | N | - | - |
| CW14 | C | fate/MODULE_CATALOGUE.md:25 | proposed |
| CW15 | P | fate/INTERACTIONS.md:17 | proposed |
| CW16 | N | - | - |
| CW17 | P | fate/MODULE_CATALOGUE.md:17 | proposed |
| CW18 | N | - | - |
| CW19 | P | fate/CAMPAIGN.md:35 | proposed |
| CW20 | P | fate/WORLD_BRIEF.md:26 | proposed |
| CW21 | C | fate/MODULE_CATALOGUE.md:21 | proposed |
| CW22 | C | fate/MODULE_CATALOGUE.md:13 | proposed |
| CW23 | P | fate/MODULE_CATALOGUE.md:10 | proposed |
| CW24 | C | fate/MODULE_CATALOGUE.md:22 | proposed |
| CW25 | P | fate/INTERACTIONS.md:13 | proposed |
| CW26 | P | fate/MODULE_CATALOGUE.md:18 | proposed |
| CW27 | C | fate/MODULE_CATALOGUE.md:13 | proposed |
| CW28 | P | fate/MODULE_CATALOGUE.md:24 | proposed |
| CW29 | P | fate/MODULE_CATALOGUE.md:19 | proposed |
| CW30 | C | fate/INTERACTIONS.md:20 | proposed |
| CW31 | C | fate/MODULE_CATALOGUE.md:26 | proposed |
| CW32 | N | - | - |
| CW33 | C | fate/INTERACTIONS.md:17 | proposed |
| CW34 | N | - | - |
| CW35 | C | fate/WORLD_BRIEF.md:36 | proposed |
| CW36 | P | fate/INTERACTIONS.md:32 | proposed |

## one-piece

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | one-piece/MODULE_CATALOGUE.md:14 | proposed |
| CW02 | P | one-piece/MODULE_CATALOGUE.md:23 | proposed |
| CW03 | P | one-piece/INTERACTIONS.md:12 | proposed |
| CW04 | C | one-piece/MODULE_CATALOGUE.md:25 | proposed |
| CW05 | P | one-piece/MODULE_CATALOGUE.md:48 | proposed |
| CW06 | N | - | - |
| CW07 | C | one-piece/CAMPAIGN.md:9 | proposed |
| CW08 | P | one-piece/CAMPAIGN.md:22 | proposed |
| CW09 | P | one-piece/MODULE_CATALOGUE.md:9 | proposed |
| CW10 | C | one-piece/MODULE_CATALOGUE.md:9 | proposed |
| CW11 | P | one-piece/MODULE_CATALOGUE.md:25 | proposed |
| CW12 | C | one-piece/MODULE_CATALOGUE.md:31 | proposed |
| CW13 | P | one-piece/MODULE_CATALOGUE.md:48 | proposed |
| CW14 | P | one-piece/INTERACTIONS.md:46 | proposed |
| CW15 | C | one-piece/MODULE_CATALOGUE.md:26 | proposed |
| CW16 | P | one-piece/INTERACTIONS.md:32 | proposed |
| CW17 | P | one-piece/MODULE_CATALOGUE.md:23 | proposed |
| CW18 | P | one-piece/INTERACTIONS.md:10 | proposed |
| CW19 | P | one-piece/INTERACTIONS.md:11 | proposed |
| CW20 | C | one-piece/INTERACTIONS.md:40 | proposed |
| CW21 | C | one-piece/INTERACTIONS.md:26 | proposed |
| CW22 | C | one-piece/INTERACTIONS.md:46 | proposed |
| CW23 | P | one-piece/INTERACTIONS.md:23 | proposed |
| CW24 | C | one-piece/MODULE_CATALOGUE.md:11 | proposed |
| CW25 | P | one-piece/MODULE_CATALOGUE.md:24 | proposed |
| CW26 | P | one-piece/INTERACTIONS.md:27 | proposed |
| CW27 | C | one-piece/MODULE_CATALOGUE.md:28 | proposed |
| CW28 | C | one-piece/CAMPAIGN.md:11 | proposed |
| CW29 | P | one-piece/WORLD_BRIEF.md:38 | proposed |
| CW30 | C | one-piece/CAMPAIGN.md:14 | proposed |
| CW31 | P | one-piece/CAMPAIGN.md:35 | proposed |
| CW32 | N | - | - |
| CW33 | P | one-piece/INTERACTIONS.md:46 | proposed |
| CW34 | N | - | - |
| CW35 | C | one-piece/WORLD_BRIEF.md:38 | proposed |
| CW36 | C | one-piece/CAMPAIGN.md:28 | proposed |

## mha

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | mha/MODULE_CATALOGUE.md:8 | proposed |
| CW02 | P | mha/INTERACTIONS.md:14 | proposed |
| CW03 | C | mha/MODULE_CATALOGUE.md:19 | proposed |
| CW04 | C | mha/INTERACTIONS.md:16 | proposed |
| CW05 | P | mha/MODULE_CATALOGUE.md:9 | proposed |
| CW06 | P | mha/MODULE_CATALOGUE.md:19 | proposed |
| CW07 | P | mha/WORLD_BRIEF.md:17 | proposed |
| CW08 | C | mha/MODULE_CATALOGUE.md:17 | proposed |
| CW09 | C | mha/INTERACTIONS.md:19 | proposed |
| CW10 | C | mha/INTERACTIONS.md:19 | proposed |
| CW11 | C | mha/CAMPAIGN.md:34 | proposed |
| CW12 | C | mha/SYNTHESIS.md:29 | proposed |
| CW13 | P | mha/INTERACTIONS.md:15 | proposed |
| CW14 | C | mha/SYNTHESIS.md:28 | stated |
| CW15 | C | mha/INTERACTIONS.md:19 | proposed |
| CW16 | N | - | - |
| CW17 | P | mha/MODULE_CATALOGUE.md:12 | proposed |
| CW18 | P | mha/MODULE_CATALOGUE.md:12 | proposed |
| CW19 | C | mha/CAMPAIGN.md:20 | proposed |
| CW20 | P | mha/CAMPAIGN.md:19 | proposed |
| CW21 | C | mha/MODULE_CATALOGUE.md:13 | proposed |
| CW22 | C | mha/INTERACTIONS.md:27 | proposed |
| CW23 | P | mha/MODULE_CATALOGUE.md:18 | proposed |
| CW24 | C | mha/INTERACTIONS.md:7 | proposed |
| CW25 | P | mha/MODULE_CATALOGUE.md:15 | proposed |
| CW26 | P | mha/MODULE_CATALOGUE.md:10 | proposed |
| CW27 | C | mha/MODULE_CATALOGUE.md:10 | proposed |
| CW28 | P | mha/MODULE_CATALOGUE.md:11 | proposed |
| CW29 | P | mha/MODULE_CATALOGUE.md:13 | proposed |
| CW30 | C | mha/CAMPAIGN.md:43 | proposed |
| CW31 | P | mha/CAMPAIGN.md:45 | proposed |
| CW32 | N | - | - |
| CW33 | P | mha/CAMPAIGN.md:51 | proposed |
| CW34 | N | - | - |
| CW35 | C | mha/CAMPAIGN.md:45 | proposed |
| CW36 | C | mha/CAMPAIGN.md:51 | proposed |

## demon-slayer

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | demon-slayer/MODULE_CATALOGUE.md:7 | proposed |
| CW02 | P | demon-slayer/MODULE_CATALOGUE.md:7 | proposed |
| CW03 | C | demon-slayer/MODULE_CATALOGUE.md:15 | proposed |
| CW04 | C | demon-slayer/MODULE_CATALOGUE.md:14 | proposed |
| CW05 | P | demon-slayer/MODULE_CATALOGUE.md:8 | proposed |
| CW06 | P | demon-slayer/CAMPAIGN.md:17 | proposed |
| CW07 | C | demon-slayer/CAMPAIGN.md:25 | proposed |
| CW08 | C | demon-slayer/WORLD_BRIEF.md:24 | proposed |
| CW09 | C | demon-slayer/MODULE_CATALOGUE.md:11 | proposed |
| CW10 | C | demon-slayer/INTERACTIONS.md:10 | proposed |
| CW11 | C | demon-slayer/MODULE_CATALOGUE.md:8 | proposed |
| CW12 | C | demon-slayer/MODULE_CATALOGUE.md:20 | proposed |
| CW13 | N | - | - |
| CW14 | C | demon-slayer/INTERACTIONS.md:19 | proposed |
| CW15 | C | demon-slayer/INTERACTIONS.md:10 | proposed |
| CW16 | P | demon-slayer/MODULE_CATALOGUE.md:15 | proposed |
| CW17 | P | demon-slayer/CAMPAIGN.md:48 | proposed |
| CW18 | P | demon-slayer/CAMPAIGN.md:28 | proposed |
| CW19 | C | demon-slayer/CAMPAIGN.md:36 | proposed |
| CW20 | P | demon-slayer/CAMPAIGN.md:16 | proposed |
| CW21 | C | demon-slayer/MODULE_CATALOGUE.md:13 | proposed |
| CW22 | P | demon-slayer/CAMPAIGN.md:62 | proposed |
| CW23 | P | demon-slayer/MODULE_CATALOGUE.md:13 | proposed |
| CW24 | C | demon-slayer/MODULE_CATALOGUE.md:16 | proposed |
| CW25 | P | demon-slayer/MODULE_CATALOGUE.md:13 | proposed |
| CW26 | N | - | - |
| CW27 | C | demon-slayer/INTERACTIONS.md:15 | proposed |
| CW28 | P | demon-slayer/CAMPAIGN.md:30 | proposed |
| CW29 | C | demon-slayer/CAMPAIGN.md:47 | proposed |
| CW30 | C | demon-slayer/CAMPAIGN.md:50 | proposed |
| CW31 | P | demon-slayer/CAMPAIGN.md:50 | proposed |
| CW32 | N | - | - |
| CW33 | C | demon-slayer/CAMPAIGN.md:49 | proposed |
| CW34 | N | - | - |
| CW35 | C | demon-slayer/CAMPAIGN.md:41 | proposed |
| CW36 | C | demon-slayer/WORLD_BRIEF.md:30 | proposed |

## black-clover

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | P | black-clover/MODULE_CATALOGUE.md:34 | proposed |
| CW02 | N | - | - |
| CW03 | P | black-clover/MODULE_CATALOGUE.md:34 | proposed |
| CW04 | C | black-clover/MODULE_CATALOGUE.md:20 | shown |
| CW05 | P | black-clover/CAMPAIGN.md:11 | shown |
| CW06 | N | - | - |
| CW07 | P | black-clover/CAMPAIGN.md:33 | shown |
| CW08 | P | black-clover/CAMPAIGN.md:23 | proposed |
| CW09 | P | black-clover/SYNTHESIS.md:23 | shown |
| CW10 | C | black-clover/MODULE_CATALOGUE.md:19 | shown |
| CW11 | C | black-clover/MODULE_CATALOGUE.md:12 | shown |
| CW12 | C | black-clover/MODULE_CATALOGUE.md:10 | shown |
| CW13 | P | black-clover/MODULE_CATALOGUE.md:28 | proposed |
| CW14 | P | black-clover/INTERACTIONS.md:8 | shown |
| CW15 | P | black-clover/CAMPAIGN.md:40 | proposed |
| CW16 | P | black-clover/MODULE_CATALOGUE.md:12 | shown |
| CW17 | P | black-clover/MODULE_CATALOGUE.md:12 | shown |
| CW18 | N | - | - |
| CW19 | C | black-clover/CAMPAIGN.md:13 | shown |
| CW20 | C | black-clover/CAMPAIGN.md:24 | proposed |
| CW21 | C | black-clover/MODULE_CATALOGUE.md:14 | shown |
| CW22 | C | black-clover/CAMPAIGN.md:69 | proposed |
| CW23 | P | black-clover/MODULE_CATALOGUE.md:16 | shown |
| CW24 | C | black-clover/INTERACTIONS.md:25 | proposed |
| CW25 | C | black-clover/INTERACTIONS.md:16 | shown |
| CW26 | P | black-clover/MODULE_CATALOGUE.md:40 | proposed |
| CW27 | C | black-clover/INTERACTIONS.md:20 | shown |
| CW28 | P | black-clover/CAMPAIGN.md:31 | shown |
| CW29 | P | black-clover/CAMPAIGN.md:11 | shown |
| CW30 | C | black-clover/INTERACTIONS.md:25 | proposed |
| CW31 | P | black-clover/CAMPAIGN.md:65 | proposed |
| CW32 | P | black-clover/WORLD_BRIEF.md:32 | proposed |
| CW33 | C | black-clover/CAMPAIGN.md:69 | proposed |
| CW34 | C | black-clover/MODULE_CATALOGUE.md:16 | shown |
| CW35 | C | black-clover/MODULE_CATALOGUE.md:40 | proposed |
| CW36 | P | black-clover/SYNTHESIS.md:56 | proposed |

## chainsaw-man

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | chainsaw-man/MODULE_CATALOGUE.md:11 | shown |
| CW02 | N | - | - |
| CW03 | P | chainsaw-man/MODULE_CATALOGUE.md:10 | shown |
| CW04 | C | chainsaw-man/MODULE_CATALOGUE.md:10 | shown |
| CW05 | P | chainsaw-man/MODULE_CATALOGUE.md:8 | shown |
| CW06 | P | chainsaw-man/CAMPAIGN.md:33 | proposed |
| CW07 | P | chainsaw-man/MODULE_CATALOGUE.md:16 | shown |
| CW08 | P | chainsaw-man/CAMPAIGN.md:10 | proposed |
| CW09 | P | chainsaw-man/MODULE_CATALOGUE.md:10 | shown |
| CW10 | C | chainsaw-man/MODULE_CATALOGUE.md:12 | shown |
| CW11 | C | chainsaw-man/MODULE_CATALOGUE.md:9 | shown |
| CW12 | C | chainsaw-man/MODULE_CATALOGUE.md:13 | shown |
| CW13 | N | - | - |
| CW14 | P | chainsaw-man/INTERACTIONS.md:25 | proposed |
| CW15 | P | chainsaw-man/MODULE_CATALOGUE.md:11 | shown |
| CW16 | N | - | - |
| CW17 | N | - | - |
| CW18 | N | - | - |
| CW19 | P | chainsaw-man/CAMPAIGN.md:10 | proposed |
| CW20 | C | chainsaw-man/CAMPAIGN.md:29 | stated |
| CW21 | C | chainsaw-man/CAMPAIGN.md:19 | shown |
| CW22 | C | chainsaw-man/CAMPAIGN.md:29 | stated |
| CW23 | P | chainsaw-man/MODULE_CATALOGUE.md:9 | proposed |
| CW24 | C | chainsaw-man/INTERACTIONS.md:13 | proposed |
| CW25 | P | chainsaw-man/MODULE_CATALOGUE.md:16 | shown |
| CW26 | N | - | - |
| CW27 | C | chainsaw-man/CAMPAIGN.md:29 | proposed |
| CW28 | P | chainsaw-man/CAMPAIGN.md:19 | shown |
| CW29 | C | chainsaw-man/CAMPAIGN.md:41 | proposed |
| CW30 | C | chainsaw-man/CAMPAIGN.md:41 | proposed |
| CW31 | P | chainsaw-man/CAMPAIGN.md:41 | proposed |
| CW32 | P | chainsaw-man/SYNTHESIS.md:25 | shown |
| CW33 | C | chainsaw-man/MODULE_CATALOGUE.md:8 | shown |
| CW34 | N | - | - |
| CW35 | C | chainsaw-man/INTERACTIONS.md:14 | proposed |
| CW36 | P | chainsaw-man/CAMPAIGN.md:41 | proposed |

## frieren

| Family | Status | Locator | Label |
|---|---|---|---|
| CW01 | C | frieren/MODULE_CATALOGUE.md:27 | shown |
| CW02 | N | - | - |
| CW03 | P | frieren/MODULE_CATALOGUE.md:9 | shown |
| CW04 | P | frieren/MODULE_CATALOGUE.md:24 | shown |
| CW05 | P | frieren/CAMPAIGN.md:39 | proposed |
| CW06 | P | frieren/INTERACTIONS.md:46 | proposed |
| CW07 | C | frieren/MODULE_CATALOGUE.md:29 | shown |
| CW08 | P | frieren/WORLD_BRIEF.md:28 | proposed |
| CW09 | P | frieren/SYNTHESIS.md:47 | proposed |
| CW10 | C | frieren/MODULE_CATALOGUE.md:14 | shown |
| CW11 | C | frieren/MODULE_CATALOGUE.md:15 | shown |
| CW12 | C | frieren/MODULE_CATALOGUE.md:9 | shown |
| CW13 | P | frieren/INTERACTIONS.md:7 | proposed |
| CW14 | P | frieren/MODULE_CATALOGUE.md:11 | shown |
| CW15 | P | frieren/MODULE_CATALOGUE.md:24 | shown |
| CW16 | P | frieren/MODULE_CATALOGUE.md:40 | proposed |
| CW17 | P | frieren/MODULE_CATALOGUE.md:16 | shown |
| CW18 | N | - | - |
| CW19 | C | frieren/INTERACTIONS.md:25 | proposed |
| CW20 | C | frieren/MODULE_CATALOGUE.md:17 | shown |
| CW21 | C | frieren/CAMPAIGN.md:39 | proposed |
| CW22 | C | frieren/MODULE_CATALOGUE.md:17 | shown |
| CW23 | P | frieren/MODULE_CATALOGUE.md:10 | shown |
| CW24 | C | frieren/MODULE_CATALOGUE.md:40 | proposed |
| CW25 | C | frieren/INTERACTIONS.md:50 | proposed |
| CW26 | P | frieren/MODULE_CATALOGUE.md:14 | shown |
| CW27 | C | frieren/MODULE_CATALOGUE.md:13 | shown |
| CW28 | C | frieren/MODULE_CATALOGUE.md:12 | shown |
| CW29 | C | frieren/CAMPAIGN.md:59 | proposed |
| CW30 | C | frieren/CAMPAIGN.md:55 | proposed |
| CW31 | P | frieren/CAMPAIGN.md:55 | proposed |
| CW32 | P | frieren/SYNTHESIS.md:27 | shown |
| CW33 | C | frieren/CAMPAIGN.md:59 | proposed |
| CW34 | P | frieren/INTERACTIONS.md:42 | proposed |
| CW35 | C | frieren/CAMPAIGN.md:59 | proposed |
| CW36 | P | frieren/MODULE_CATALOGUE.md:40 | proposed |


## Content reconciliation B148, 2026-11-04

The complete matrix and every per-world CW01-CW36 row were read. Independent structural recomputation found 16 worlds, 36 families, 576 cells and 280 C / 258 P / 38 N, with zero grid/body status mismatches. All 538 supplied locators currently reach a nonempty line. [The check record](reconciliation-2026-11-04/matrix-check-b148.json) retains the pre-correction input hash and original label counts. These checks establish arithmetic/routing, not the meaning or primary-source accuracy of 538 statements.

The full D&D ruling ledger explicitly makes every RL01-RL28 a proposed revision-1 application/policy. Its CW12 locator must not appear as an unqualified shown rule; that label is corrected to proposed, leaving its C status intact because this matrix measures documented coverage. Other shown/stated labels remain the inherited reader's labels and were not freshly verified. A local authored proposal, observed source effect, source explanation and actual native consumer remain separate evidence stages (AD32, AD36).

Do not turn N cells into blanket source/world absences or automatic new mechanics, and do not rank worlds by the amount of authored prose. CW02/CW06/CW18/CW26/CW32/CW34 identify possible questions; a single template line can route a question while failing to qualify a local contract. The November 3 owner retains all useful detail leads, affected gaps and source limits. This review did not read every linked world document, any primary game/book source, or any new runtime/secret state.
