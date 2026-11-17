# Wiki power census (PWC9, 2026-11-16, proposals)

A deterministic, no-model census of the power pages in the 18 local Fandom dumps under `~/.codex/research/wikis/*/dump/`, for [PWC9](README.md#round-1). Harry Potter, Reverend Insanity and Lord of the Mysteries are excluded (they have ledgers). Run it with `python3 -I scripts/wiki_power_census.py scan --cache DIR`, then `report --cache DIR --out FILE.json --md FILE.md`. The script streams each archive through `zstd`, `7zz` and `gzip` (nothing is unpacked to disk), keeps the newest revision per title, and caches titles, namespace, redirect target, categories and lead infobox template only, never page text. No downloads, no model calls.

## How the numbers were made

- **Page count** is distinct ns 0 pages after redirects: a redirect is not a page, and its count is shown as aliases of the denominator pages. Only one redirect hop is counted.
- **Power denominator** is the union of a hand-chosen set of categories and lead infobox templates per world (`SPEC` in the script, chosen from the candidate listings the script prints). The lead template matters. Narutopedia, My Hero Academia and One Piece add categories through infoboxes, which never appear as `[[Category:]]` in the wikitext, so a category-only count would have shown Naruto with a few dozen jutsu pages instead of 2,506.
- **Own classification** counts are mostly holder pages (users of an Emitter quirk, a Logia fruit). They are the PWC2 held-out label, shown for scale and not added to the denominator. Where a wiki keeps the type in an infobox field (MHA quirk type, Naruto jutsu classification), this census did not read the field. Reading it is the first step of that world's ledger.
- **Likely blocking capabilities are an inference** from category names and general knowledge of each series, not a measurement. The shared slugs follow PWC5 and the sibling notes: `mind-binding`, `time-loop`, `area-field`, `power-interaction`. This census proposes five more: `form-transformation`, `familiar-summon`, `power-transfer`, `vow-cost`, `item-bound-power`. The Worm and Re:Zero lists used in the ranking are guesses from PWC2 and the README, and Perfect Run's uses its four shared slugs only. Replace them when those ledgers land.
- **Library** is a dated grep of [LIBRARY_INDEX](../LIBRARY_INDEX.md), partial. "Wiki dump only" means no book or manga text for that world appears there.
- **Thin counts are not thin worlds.** Frieren's wiki is characters and chapters with no power pages, and Dresden's powers live in prose. Chainsaw Man's power pages are devil characters. A zero or a small number here means "no page-per-power denominator in the wiki", and the ledger for those worlds would take its names from the books or reads instead (PWC3).

## Census

| World | Dump (ns 0 canonical pages) | Power denominator (distinct pages) | Own classification (held-out label) | Likely blocking capabilities (inferred) | Books or reads in library |
| --- | ---: | --- | --- | --- | --- |
| naruto | 6902 | **2724** (4609 aliases). Jutsu 2506; Tools 188; Bloodlines 30 | five chakra natures, Yin/Yang, Kekkei Genkai; jutsu type (Ninjutsu, Genjutsu, Taijutsu). Counts: Chakra Natures 22; Jutsu Type 28; Kekkei Genkai 2; Ninja Ranks 26 | area-field, power-interaction, form-transformation, familiar-summon, mind-binding, power-transfer, vow-cost | manga queued (701 ch, ~36% in Nov 3); 5 novels; databook missing |
| myheroacademia | 2907 | **508** (5 aliases). Quirks 286; Moves 222 | Emitter, Transformation, Mutant (Quirk Infobox type field, not read here). Counts: Emitters 170; Mutants 98 | power-interaction, power-transfer, form-transformation, mind-binding, area-field | no; wiki dump only |
| onepiece | 8120 | **339** (752 aliases). Devil Fruits 205; Fighting Styles 32; Weapons 102 | Paramecia, Zoan (ancient, mythical), Logia; Haki three kinds. Counts: Paramecia 93; Zoan 25; Logia 16; Haki users (Armament, Observation, Supreme King) 151 | form-transformation, power-transfer, item-bound-power, power-interaction, mind-binding | no; wiki dump only |
| mistborn | 207 | **61** (26 aliases). Allomancy, metals, Feruchemy, Hemalurgy 61 | metals (16 base, allomantic, feruchemical, hemalurgic), Misting types. Counts: Misting types 11; Metals 20 | power-interaction, mind-binding, power-transfer | boxed set held (contents unchecked, MC13); wiki held, unread |
| blackclover | 1786 | **573** (202 aliases). Spells 454; Magic (attribute pages) 119 | Magic Attributes (94 pages), Spirit, Mana Zone, Mana Method. Counts: Magic Attributes 94; Spirit Magic 6; Mana Zone and Mana Method 25 | item-bound-power, familiar-summon, power-interaction, area-field, form-transformation, vow-cost | no; wiki dump only |
| bleach | 2800 | **411** (261 aliases). Techniques 411 | Kidō (Hadō, Bakudō), Zanpakutō release, Hollow, Quincy, Fullbring. Counts: Kidō 78; Zanpakutō Spirit 32; Fullbring 5; Quincy 50 | item-bound-power, area-field, power-interaction, form-transformation, mind-binding | manga queued and 214 ch OCR text; wiki dump |
| frieren | 331 | **0** (0 aliases). none found | none in categories; spells and classes live in prose. Counts: Classes 1 | area-field, mind-binding, power-interaction | volumes 1-13 and Prelude 1-2 held; unread |
| kimetsu-no-yaiba | 803 | **27** (19 aliases). Breathing Styles and Abilities 27 | Breathing Styles (15 pages), Blood Demon Art. Counts: Breathing Styles 15; Demon 42 | form-transformation, item-bound-power, power-interaction, mind-binding, power-transfer | manga queued; no novels |
| towerofgod | 2281 | **313** (94 aliases). Shinsu and weapon techniques 313 | Positions (Scout, Spear Bearer, Light Bearer, Wave Controller, Guide), Shinsu quality and technique types. Counts: Positions 147; Shinsu Quality 15 | item-bound-power, power-interaction, area-field, form-transformation, familiar-summon | no; wiki held, unread |
| chainsaw-man | 420 | **66** (29 aliases). Devils and Fiends (power pages are characters) 66 | devil, fiend, hybrid. Counts: Devils 49; Fiends 12; Hybrids 8 | vow-cost, familiar-summon, form-transformation, mind-binding | manga queued; Buddy Stories held |
| dresdenfiles | 659 | **14** (448 aliases). Curses and spell pages 14 | none in categories | area-field, mind-binding, vow-cost, familiar-summon, power-interaction, power-transfer | novels 16-18 held (others unchecked); wiki held, unread |
| hunterxhunter | 2619 | **175** (38 aliases). Greed Island cards and spells 175 | six Nen types (hexagon): Enhancer, Emitter, Conjurer, Manipulator, Transmuter, Specialist. Counts: Enhancers 21; Emitters 21; Conjurers 20; Manipulators 20; Transmuters 13; Specialists 15; Unknown Nen type with Nen abilities 54 | vow-cost, power-interaction, mind-binding, item-bound-power, area-field, power-transfer | manga queued; wiki dump |
| jujutsu-kaisen | 1052 | **147** (17 aliases). Techniques 147 | Innate, Extension, Inherited Techniques; grades. Counts: Innate Techniques 36; Extension Techniques 46 | area-field, vow-cost, item-bound-power, familiar-summon, power-transfer, mind-binding, power-interaction | 277 ch OCR text, 2 novels, Modulo 2-6 and 8; wiki dump |
| lazydungeonmaster | 288 | **18** (1 aliases). Skills 18 | skill kinds (active, passive, ultra, special), elements, ranks. Counts: Elements 7 | area-field, familiar-summon | LN 1-3 held; wiki held, unread |
| mtg | 6007 | **215** (58 aliases). Keyword abilities and ability words 215 | colours and card types (outside categories); keyword vs ability word. Counts: Classes 20 | power-interaction, familiar-summon | no books; wiki held, unread |
| mysranks | 126 | **15** (10 aliases). Skills 15 | skill kinds (active, passive, attack, defense, buff), ranks S to F. Counts: Ranks 16 | power-interaction, item-bound-power | no; wiki held, unread |
| typemoon | 6462 | **2340** (964 aliases). Noble Phantasms 754; Skills 1481; Magecraft and Reality Marbles 163 | NP type (anti-unit, anti-army, ...), NP rank E to EX, Servant class and attribute. Counts: NP type (anti-unit) 291; NP type (anti-army) 209; Servant classes 37 | item-bound-power, familiar-summon, area-field, mind-binding, vow-cost, power-transfer, power-interaction | Fate/Zero 2-4, Fake 1/4/5, Case Files 1-3 held; wiki dump |
| fma | 1015 | **19** (68 aliases). Alchemy 19 | none in categories | power-interaction, area-field, power-transfer, vow-cost | manga queued; wiki dump |
| mob-psycho-100 | none | none | n/a | n/a | no; no dump (archive not found) |
| worldtrigger | none | none | n/a | n/a | no; no dump (IA archive returned HTTP 500 twice) |

Two worlds have an empty dump folder: Mob Psycho 100 (no archive was found) and World Trigger (the Internet Archive item returned HTTP 500 twice, per the library index). Neither can be censused without a file, and getting one needs Weibao's yes per file (PWC10).

## Ranking (proposal)

Score = log10(power pages + 1) times the mean, over the world's inferred capabilities, of how many other worlds (dump worlds plus the three sibling ledgers) also need that capability. The log stops Naruto's 2,724 and Type-Moon's 2,340 from deciding alone, and the mean rewards worlds whose blockers are widely shared. The sharing term only ranges from about 10 to 15, so page count drives the order in practice.

| Rank | World | Power pages | Pages rank | Caps | Mean other worlds sharing each cap | Score |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1 | naruto | 2724 | 1 | 7 | 11.7 | 40.2 |
| 2 | typemoon | 2340 | 2 | 7 | 11.7 | 39.5 |
| 3 | myheroacademia | 508 | 4 | 5 | 12.8 | 34.6 |
| 4 | mtg | 215 | 8 | 2 | 14.0 | 32.7 |
| 5 | bleach | 411 | 5 | 5 | 12.4 | 32.4 |
| 6 | blackclover | 573 | 3 | 6 | 11.0 | 30.3 |
| 7 | onepiece | 339 | 6 | 5 | 11.6 | 29.4 |
| 8 | towerofgod | 313 | 7 | 5 | 11.6 | 29.0 |
| 9 | hunterxhunter | 175 | 9 | 6 | 12.0 | 26.9 |
| 10 | jujutsu-kaisen | 147 | 10 | 7 | 11.7 | 25.4 |
| 11 | mistborn | 61 | 12 | 3 | 14.0 | 25.1 |
| 12 | chainsaw-man | 66 | 11 | 4 | 10.0 | 18.3 |
| 13 | kimetsu-no-yaiba | 27 | 13 | 5 | 11.6 | 16.8 |
| 14 | fma | 19 | 14 | 4 | 12.5 | 16.3 |
| 15 | mysranks | 15 | 16 | 2 | 13.0 | 15.7 |
| 16 | lazydungeonmaster | 18 | 15 | 2 | 12.0 | 15.3 |
| 17 | dresdenfiles | 14 | 17 | 6 | 12.3 | 14.5 |
| 18 | frieren | 0 | 18 | 3 | 15.3 | 0.0 |

Reading the ranking:

- **Magic: The Gathering ranks fourth only because it lists two capabilities.** It is a card-rules system, not a set of powers a life-sim character holds, so the proposal skips it.
- **Proposed first wave, in order: Bleach, Black Clover, My Hero Academia, Jujutsu Kaisen, Naruto.** This is the score order with MTG dropped, adjusted for how cheap each is to label: each has a page-per-power template or category, its own classification as a free held-out label, and a clean mid-sized denominator (147 to 573 pages). Naruto leads the score but its 2,506 jutsu pages include many variants, so its first pass takes a sample by jutsu type. Type-Moon's 1,481 Skills pages are mostly passive Servant skills, so its first pass is Noble Phantasms (754) with their NP type and rank as the label.
- **The build order the census implies** comes from the table below: `power-interaction` (19 of 21 worlds) first, then `mind-binding` and `area-field` (15 each), then `familiar-summon` and `power-transfer` (11 each). These counts are inference, so treat them as a prompt for the real PWC5 histogram, not a replacement.
- The three book ledgers on sibling branches are not in the page ranking; their own denominators come from the reads (PWC3).

## Capabilities, summed (inferred)

| Capability | Worlds needing it (dump worlds plus the 3 sibling ledgers) |
| --- | ---: |
| power-interaction | 19 |
| mind-binding | 15 |
| area-field | 15 |
| familiar-summon | 11 |
| power-transfer | 11 |
| vow-cost | 9 |
| form-transformation | 9 |
| item-bound-power | 9 |
| time-loop | 2 |


## Reuse notes

- Lane W's [ALL_PAGE_INDEX files](../power-systems/wiki-digests/CHECKPOINT.md) cover only 7 of these wikis and not Naruto, Dresden, MTG, Mistborn, Tower of God, Lazy Dungeon Master, MySRanks or One Piece, and they omit lead templates, so this script rescans every archive itself. A full scan takes about five minutes with the archives split over a few processes.
- The cache lives outside the repo (`--cache DIR`). Delete it when done.
