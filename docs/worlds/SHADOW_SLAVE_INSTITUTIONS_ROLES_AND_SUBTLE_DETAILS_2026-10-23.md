# Shadow Slave: institutions, roles and subtle details, plus floor card (2026-10-23)

Research and proposals, not accepted decisions and not implemented. Pass: WPR9-WPR17, mode reuse-and-check plus bounded read, with a WA6 floor card. Owner file: this one, created by instruction (WPR3). Links from the SS kit card, WORLD_CARDS and the novels folder are not made because the task said to touch nothing else (see section 14). Spoilers: rows marked [S] reveal or depend on late-story events; all of W4 is [S].

## 1. Source, edition, tier and budget

**Edition.** Held English EPUB "Shadow Slave - Guiltythree.epub", Calibre ID 16, live path `~/Calibre Library/Guiltythree/Shadow Slave (16)/`. sha256 2faa3640bfc84043d1821b935c42bd4d22a9c7af3b65a985b3595ed0b519c0b6 (matches the dossier's EDITION.md). 1,840 numbered chapters, about 2.24M whitespace words by the dossier manifest, 1,888 member files. This pass searched and read **EPUB chapters 1-1840 only**. Volumes 9-11 (chapters beyond 1840, supplied separately) were not searched, so every absence below means "not found in EPUB 1-1840". The stale Sync path in `docs/research/novels/LOCAL_LIBRARY.md` and in the dossier's `epub_access.py` is a follow-up, not fixed here. Fan-compiled edition: numbers are edition numbers, and the text carries site-insertion noise (a stray watermark string sits inside ch1805 p67).

**Tier of SS in the repo.** A kit card exists (`docs/worlds/world-core-kit-2026-10-14/cards/shadow-slave.md`, W1 floor rows K2, K3, K6, K7, K8, K13 all "partial", source "missing"). A "Dreaming" original world and a "memory of Shadow Slave" entry sit in WORLD_CARDS. The research folder holds BRIEF, INTAKE, WORLD_AUDIT, SYSTEMS_DEEP_DIVE, WIKI_CROSSCHECK, six 2026-10-10 reader files (ITEMS_SOCIETY, RANKS, SPELL_NIGHTMARES_WORLD, ASPECTS_FLAWS, LATE_VOLUMES, FANFIC) and a world-design packet. A full-book dossier (`docs/research/novels/full-book/shadow-slave/`, 3,000 chapters worker-read, 114k words of notes) exists. Source code: `src/feature_expansion_book_recognition.js` (book recognition and era hooks: `ss.sincerity`, `ss.name-condition`), `src/book_world_player_agency_contracts.js` (id list only) and `src/realm_traveler_profiles.js` (one SS source basis, observation OE15/OE16). No SS pack, no SS daily-life, institution or economy runtime. The pass found no other SS gameplay code (grep for `shadow[_ -]?slave`, `shadowSlave` over `src` and `scripts`).

**Reused first (WPR2).** ITEMS_SOCIETY section 4 (society, money, jobs, armies), RANKS, SPELL_NIGHTMARES_WORLD gaps, the kit card W3-SS rows (K6.W3-SS1-6, K7.W3-SS1-2, K8.W3-SS), the full-book detail notes for ch1-40 (induction and curriculum have locators there). Old reader locators are `text.json` keys that sometimes disagree with the EPUB; I confirmed the title before citing an old locator (ch1599, 1605, 817, 371 match).

**Named gap per window (WPR2).** The earlier notes give a scatter of numbers and relative statements and ITEMS_SOCIETY gap 1 says no credit price, wage, rent or food cost was found. A keyword census (all 1,840 chapters) located where the money, citizenship, points, clan-recruitment and army vocabulary is dense. The census is a locator, not reading: most hits for "credit", "wage", "salary" and "rent" are idioms ("give credit", "wage war", "pay attention"), which is why I chose windows by a snippet check on 25 candidate chapters, not by count alone.

| Window | Chapters | Source words | Form | Named gap |
| --- | --- | --- | --- | --- |
| W1 | ch19-20 consecutive, then ch24, 166, 375, 466, 753, 1805 | 10,708 | mixed | Academy induction rhythm, free board, ranking screen (procedure, not rereads of the curriculum); poverty money (166), research pay (375), shard scarcity (466), Academy staff (753), Valor stipend (1805) |
| W2 | ch362-368 consecutive, then ch371 | 10,948 | mixed | Citizenship, clan recruitment channels, the government's tracking duty, contribution points (ch371), library |
| W3 | ch386, 511, 512, 762, 797, 817, 818, 826, 827 | 10,326 | excerpts: nine non-adjacent whole chapters | Sanctuary market, Sleeper Compound intake, NQSC outskirts, Evacuation Army commission and cohort draft, contribution points spent, supply officers |
| W4 | ch1599-1606 consecutive, then ch1633 | 10,254 | mixed | Dream Realm coinage, Sunny's Memory boutique as a business, Saint tiers, Ravenheart market and healers [S] |

Total read by readers: 42,236 source words (paragraph words, locators excluded); the files with locators and chapter headings total 46,150 `wc` words. That is about 1.9% of the 2.24M words in EPUB 1-1840. All chapters were whole-chapter extraction (no keyword snippets as reading).

**Budget (declared plan, WPR7, AU2-AU6).** Coordinator (Sonnet) plus 4 readers, each a fresh Agent call with model "haiku" set in the first brief, one at a time, each on one pre-extracted window of at most 12,000 words by the source-word count, paragraph locators `[chNNNN pNN]`. One pilot (W1), the brief kept as is, the number-table form fixed in the W3 and W4 briefs. No repair run was needed: reader errors were corrected by the coordinator at the source. Advisor consulted once, before dispatch (it caught a broken census grep, the need to justify W1 against the existing notes, and the zero-hit checks). Scripts and returns: `docs/research/novels/shadow-slave/passes-2026-10-23/` (gitignored).

**Source spot checks by the coordinator (WPR18-19).** I opened the extracted source at each locator. "V" = verified, "U" = not opened by me.

| Claim | Locator | Result |
| --- | --- | --- |
| Inductions monthly at start of year, weekly as the winter solstice nears; waits of days | ch0020 p03-05 | V |
| Sleepers get a private underground room, free clothing sets and unlimited free meals; ranking screen lists the batch weakest to strongest, "most likely deduced" from interviews | ch0024 p01-03, p29, p54-55 | V (basis of ranking is the narrator's guess) |
| Four weeks at the Academy before the first Dream entry; a shard (maybe several) rewarded for sharing Nightmare and Appraisal detail | ch0019 p03, p19 | V (reward is Jet's statement) |
| Citizenship is issued after Awakening with communicator, memory chip, two-star iron badge; "seventh rank" | ch0363 p38-42 | V (scale of ranks not defined in text; reader's "top" reading is Sunny's guess) |
| Government and Legacy clans track every Awakened; duty to answer a Gate; survive by tethering to clan, government or cohort | ch0364 p04-08, p44-46 | V |
| Clan recruitment channels: patronage contracts, adoption, marriage; independents have freedom but no special support | ch0365 p23-27, p31 | V |
| Contribution points are paid for information on the Spell, Dream Realm and creatures, scale with rarity, exchange for goods or credits; reward might be enough to buy a house | ch0371 p52-56 | V (house is implied, not a figure) |
| About a thousand Sleepers prepare per average year at the one Awakened Academy; all willing Sleepers go there | ch0762 p41 | V (Cassie speaks) |
| Officer commission in under half an hour; captains pick 42 recruits, six per cohort, youngest first; contribution points do not govern the draft | ch0817 p13; ch0818 p02 | V |
| 60-70 million people in the outskirts, 20 percent of the city | ch0797 p28 | V (Jet's figure relayed by narrator; also in ITEMS_SOCIETY from ch00797) |
| About 200 Awakened live in the Sanctuary of Noctis; each gets a small assigned room; park market trades shards for Memories or credits | ch0386 p22-26 | V |
| Great Clans mint essence-bearing silver coins backed by shard treasuries; Awakened keep coins to absorb | ch1599 p06, p09-10 | V |
| The Emporium sold one Memory in two months; one a month would be a large profit | ch1605 p19 | V |
| Healers are rare and prohibitively expensive | ch1633 p05 | V |
| Saint count: more than a hundred; three highest-tier each for the government, Song (two for Valor) | ch1603 p04, p11-12 | V [S] |
| Teacher Julius gives one-on-one Wilderness Survival; Instructor Rock leads the introductory combat class | ch0025 p34-82; ch0022 p34; ch0026 p35 | V (outside the windows; coordinator-opened) |

Not opened by me (marked U below): cohort member roles (Belle, Dorn, Quentin, Kim, Samara, Luster), Telle/Roan/Tyris as clients, the Ravenheart bathhouse, the Eye Candy Cafe rumor, Ardent Wardens detail beyond the opened stipend lines, Gate Crisis duty penalties.

## 2. Places and institutions (WPR9, WPR11)

Labels: SHOWN (scene), STATED (character or narrator), INFERRED, PROPOSED. V/U as above. Cost column says "not found in window" when the text gives none, which is the usual case.

| Place or institution | Who runs it and where | Cost and units | Access | Tiers, limits, hazards | Locator, label, check |
| --- | --- | --- | --- | --- | --- |
| Awakened Academy (the only one) | Government; fortified walled city inside the city, moat, drawbridge, turrets | No fee, tuition or price found | Government brings all willing Sleepers, any Quadrant; red gate, bridge | About a thousand Sleepers per average year; private academies exist but are not the Awakened one | ch0019 p01-02; ch0762 p39-41. SHOWN/STATED. V (intake figure) |
| Sleeper Compound | Academy, mostly underground | Free board (below) | Sleepers only | Induction hall, dorms, cafeteria, interviews in one building | ch0020 p01-05; ch0024 p01. SHOWN. V |
| Induction ceremony | Academy | None found | Batch intake | Monthly early in the year, weekly near the solstice; some wait days, Sunny hours | ch0020 p03-05. STATED. V |
| Sleeper room, clothes, meals | Academy | Free room, free sets of clothing, unlimited meat, rice, fruit | Every Sleeper | Social shunning at tables (the blind girl sits alone) | ch0024 p01-03, p29, p49-52. SHOWN. V |
| Aspect interview and ranking screen | Academy admin worker | None; counseling offered and refusable | Scheduled appointment | Polite wording lets answers stay vague; the screen ranks the batch publicly weakest to strongest, "likely" from interviews | ch0024 p36-44, p54-60. SHOWN. V |
| Counseling plus shard reward | Academy / government | A shard, "maybe several", for sharing Nightmare and Appraisal details | Optional | Jet warns divulging an Aspect or Flaw lets humans target weaknesses | ch0019 p19-29. STATED. V (p19) |
| Wilderness Survival course | Teacher Julius, Academy | Not priced | Jet's pick for Sunny's four weeks | One-on-one, theory plus VR and field lessons, dead languages, runes; "cold nearly killed" the student | ch0019 p35-43; ch0025 p34-82. STATED/SHOWN. V (ch25) |
| Introductory combat class and dojo | Instructor Rock | Not priced | Sleepers | Sparring ring scoring (see EF) | ch0022 p34; ch0026 p35. SHOWN. V |
| Academy library | Staff (Ren, Nickel by name) | None found | Walk-in; remote access leaves a digital trail | Dream Realm History section is escorted | ch0366 p19-25, p50-58. STATED. U |
| Citizenship | Government | No fee found | Issued on Awakening: communicator, memory chip, iron badge | "Seventh rank" is stated, scale undefined | ch0363 p38-49. SHOWN. V |
| Government tracking and Gate duty | Government plus Legacy clans | Privileges in return | Every Awakened | Duty to answer a nearby Gate; the special communicator is the channel; no penalty shown | ch0364 p04-12. STATED. V |
| Great and Legacy clans (Valor, Song, one more) | Clans | Patronage, adoption or marriage terms not found | Recruitment channels as above; independents allowed | Independents have no support; Jet says "tough" | ch0365 p08, p23-31. STATED. V |
| Citadels | Great clans, lesser clans, independents | Not priced | One chosen after Awakening within days | Three human territories with dangerous regions between | ch0365 p06-14. STATED. U |
| Sanctuary of Noctis | White Feather built the walls; utility Aspects improve living conditions | Rooms assigned, no rent found | Anchored Awakened; about 200 live there | Creatures outside the walls | ch0386 p19-26. SHOWN. V |
| Sanctuary park market and kitchens | Residents | Shards for Memories or credits; rates not found | Open to residents | News and field information traded there | ch0386 p26. SHOWN. V |
| Sunny's Brilliant Emporium and Memory Boutique (Bastion) [S] | Sunny owns, Aiko runs the floor | Prices not found; one Memory per month would turn a large profit | Luxury and affluent customers | Aiko warns that growing too big invites Valor's grip | ch1599 p04-08; ch1605 p13-19. SHOWN. V (p19) |
| Great Clan coin and shard treasury [S] | Each Great Clan | Face values not found | Carried by Awakened | Coins hold a little essence, absorbable in an emergency | ch1599 p06-10. STATED. V |
| Ravenheart market and public baths [S] | Song Domain city | Not priced | Citizens; elite shops via the Bridge or retainers | Healers rare and "prohibitively expensive" | ch1633 p01-14. SHOWN. V (p01-03, p05) |
| NQSC outskirts | City, outside the barrier | Government synthpaste rations (price not found) | Residents | 60-70 million people, poor air, water and transit | ch0797 p09-32. SHOWN. V (p28) |
| First Evacuation Army, admin bunker, main armory | Military | Contribution points buy gear | Commission in under half an hour for a Master's recruit | Memories are transferred only in person, via supply officers who carry them | ch0817 p12-13; ch0827 p24-26. SHOWN. V |
| First Irregular Company | Army | None found | Seven cohorts of six; 42 recruits drawn from a port pool | Selection by captain priority, not by points | ch0818 p02-05. STATED. V |
| Valor Castle, Ardent Wardens [S?] | Clan Valor | Monthly stipend of soul shards, amount not found | Knighthood granted with no oath and no Memories issued | Knights and squires cold to the new Knight Commander | ch1805 p30-45, p67-69, p75-87. SHOWN. V (stipend lines), U (rest) |

Searched where and not found (WPR23), EPUB 1-1840 only: "quarantine" (0 hits, all chapters), "guild" as an institution (2 hits, a passing word in dialogue at ch0478 p53 (not opened beyond the line) and an author note about a Discord server at ch1000 p57, neither an institution), "Evernight" (0 hits, so the task's name is not in this edition; the House of Night and Stormsea are the closest clan institution), "Code Black" (2 hits, ch0001 only). The nearest to a Quarantine zone are the NQSC outskirts (190 "outskirts" hits, 132 chapters) and the barrier (161 hits). Searched in the four windows and not found: academy fees or tuition, rent, a posted price for any meal, shop, Memory or shard, a credit wage, a shard-to-credit rate, a named guild or market-fee table, discipline rules, class length.

## 3. Person-to-person roles (WPR10)

| Role | What it does and owes | Access and cost | Failure or hazard | Locator, label, check |
| --- | --- | --- | --- | --- |
| Government mentor-handler (Master Jet, also named "Soul Reaper") | Meets Sleepers, steers their choices, issues citizenship, warns about leaks; later hands out a command and recruits | Contact number given to Sunny; no fee | Her advice is also a form of control: "no one is free" | ch0019 p14-56; ch0363-365; ch0817-818. STATED/SHOWN. V (ch0364 p44-46, ch0818 p02) |
| Survival teacher (Julius) | Plans a punishing curriculum, one student, offers a research-assistant post later | Not priced | Student overwhelmed in an hour; teacher contemptuous of ignorance | ch0025 p34-82; ch0363 p22; ch0371. SHOWN. V (ch25) |
| Combat instructor (Rock) | Leads the introductory class; Sleepers score in a ring | None found | Public comparison | ch0022 p34; ch0026 p35. SHOWN. V |
| Academy admin interviewer | Asks Aspect questions politely, offers counseling | Part of intake | Pressure to disclose; answers feed the ranking | ch0024 p36-44. SHOWN. V |
| Cohort (a Sleeper team) | Shared Nightmare survivors; "tether" in the Spell world | Peers | Survive only if bound to allies | ch0364 p44-46. STATED. V |
| Cohort captain and company (First Irregular Company) | Picks six, youngest captain first; 42 recruits; Sunny commands a cohort | Officer privileges | The draft is not by points | ch0817-818. STATED. V |
| Cohort specialists (Belle, Dorn, Quentin: melee; Kim: technician; Samara: engineer; Luster: pilot) | Fixed roles in a vehicle cohort | Not priced | Not read | ch0826 p03-06. SHOWN. U |
| Clan patron or adopter | Offers patronage contracts, adoption, or marriage to a talent | Terms not found | Bloodline interest; Jet says marriage is the preferred method for gems | ch0365 p23-27. STATED. V |
| Rival (Caster) | Peers on the ranking screen; second place; spar rival | Not priced | Public rank comparison | ch0024 p60; ch0026. SHOWN. V (screen) |
| Clan steward and princess (Sebastian, Morgan) [S?] | Confer a Knighthood with no oath, no Memories, a monthly shard stipend | Stipend amount not found | Hostile Knights and Squires | ch1805 p19-69, p75-87. SHOWN. V (stipend) |
| Shopkeeper-employee (Aiko) [S] | Runs the floor, sells Memories, pushes for banking | Not priced | Valor tolerance for a growing business | ch1599 p04-08; ch1605 p16-19. SHOWN. V |
| Supply officer (army) | Carries a stock of Memories personally; hands over when requested | Contribution points elsewhere | Memories move only in person | ch0827 p24-26. STATED. V |
| Customers and clients as patrons (Telle) [S] | Commission special Memories | Amount not found | Not opened | ch1605-1606. SHOWN. U |

How a new Sleeper joins and rises (from this pass plus earlier notes): infection, Appraisal and Spell reward, police or government collects the Sleeper, a few weeks at the Academy (free board, interviews, ranking, one chosen course), a first Dream entry at the solstice-timed Nightmare, then citizenship, tracking, a Citadel choice within days and a clan, government or independent path. Rank and Nightmare structure are in RANKS and SPELL_NIGHTMARES_WORLD.

## 4. Money and information (WPR12)

| Item | Value or rule | Locator, label, check |
| --- | --- | --- |
| Credits | Digital currency in the waking world; used for terminals and city goods | ch1599 p06 (credits "purely digital"); ch0366 p19 (public terminals cost credits). STATED. V (p06), U (p19) |
| Soul shards | The Dream Realm unit; Awakened hold them for their cores, so they are scarce; the Sanctuary market trades them for Memories or credits | ch0386 p26; ch0466 p06-07. SHOWN/STATED. V (386), U (466) |
| Great Clan coins | Silver with a number on one face and a clan sigil; backed by clan shard treasuries; carries a little absorbable essence | ch1599 p06-10. STATED. V [S] |
| Contribution points | Paid by the government for Spell, Dream Realm and creature information, scale with rarity; exchange for goods or credits | ch0371 p52-56. STATED. V |
| Contribution points as equipment money | Sunny paid "a painful amount" for the most expensive Gate shielding for a vehicle; no number given | ch0826 p19-20. STATED. V |
| Research pay | "Rich now" from Dream Realm reports; Academy research-assistant salary expected, amount not stated | ch0375 p46. STATED (Sunny). V |
| Poverty benchmark | A street kid saved "four or five" years of "pathetic" credits to hire an investigator; city databases need citizenship at "considerable rank" | ch0166 p13-17. STATED (Sunny). V (p15) |
| Valor stipend | Monthly stipend in soul shards for a Knight Commander | ch1805 p45, p69. STATED. V [S?] |
| Memory sales rate | One Memory per two months in a slow period; one a month turns a large profit | ch1605 p19. STATED. V [S] |
| Healers | Rare and prohibitively expensive | ch1633 p05. STATED. V [S] |
| Information | Government rewards information; the library is in person to avoid a trail; the market is where news and island information trade | ch0371 p52; ch0366 p20; ch0386 p26. STATED/SHOWN. V (371, 386) |
| Rumor | "He's a Rumor" (ch1603) and the Lord of Shadows rumor circulate in the clans [S]; Valor and Song public sentiment shifts over four years | ch1603 p37-45; ch1633 p23-37. SHOWN. U |

No credit price, rent, wage, shard-to-credit rate or coin face value appears in the four windows. The gap ITEMS_SOCIETY recorded stands. Any numbers for K8 stay PROPOSED (section 12).

## 5. Time and rhythm (WPR13)

| Item | Default | Dial and reason | Locator, label |
| --- | --- | --- | --- |
| Academy stay | Four weeks before the first Dream entry in the shown case | Infection is "chaotic": some Sleepers have a year, some months, some days | ch0019 p03; ch0020 p04. STATED. V |
| Induction cadence | Monthly early in the year, weekly near the solstice | Dial: infection rate and the solstice | ch0020 p05. STATED. V |
| Citadel decision | A few days after Awakening | Jet's advice | ch0365 p06. STATED. U |
| Stimulant patch | Keeps a person lucid for about a week; one patch at a time | Crash and strain later (see D-list) | ch0365 p43; ch0375 p58-61. STATED. V (365) |
| Army commission | Under half an hour | Haste and a Master's presence | ch0817 p13. SHOWN. V |
| Cohort preparation | Three, maybe four weeks before landfall | Mission clock | ch0818 p36. STATED. U |
| Hunting day | Dream Realm days run on the Nightmare clock, covered in earlier notes | Not reread | SPELL_NIGHTMARES_WORLD |
| Memory purchase pace | A good Memory is a week or two of shard collecting for a rich hunter | Sunny's income | ch0512 p13. STATED. V |
| Domain-era routine | Breakfast rush, midday cooking, a shop day with avatars [S] | Late story | ch1599 p05; ch1604 p43. SHOWN. U |

## 6. Power subtleties and costs in the windows (WPR14)

- The Flaw is a compulsion, not a rule: an asked question forces a truthful answer, silence builds pressure then pain, and wording can bend only within limits (ch0020 p40-42, V). A Flaw can be gamed but not skipped.
- Memories are carried in the soul and cannot be taken, so they transfer only in person, and without the Spell's facilitation no one can issue one to a non-holder (ch0827 p25; ch1805 p68). Armies therefore hold Memories in people.
- Shards and coins carry essence; Awakened absorb them, which is why they are short (ch0466 p07; ch1599 p10).
- Technology and Gates: Gates disrupt electronics, so vehicles pay for shielding (ch0826 p19-20, V).
- A military stimulant trades a week of lucidity for a crash of equal size; repeat doses shorten the effect (ch0365 p43 V; ch0375 p58-61 U).
- Ranking by interview means disclosure has a cost in the waking world, not only in the Dream Realm (ch0019 p27-29; ch0024 p36-44, V).
- Not read: rank-gate costs, the "drawbacks of being a Master", Aspect limits (see ASPECTS_FLAWS, RANKS).

## 7. Starts, failure, aftermath, surfaces (WPR15-17)

- **Starts.** The shown start is a Sleeper after the first Nightmare, collected by government and walked through the Academy (ch0017-0025). The source gives three more entries the repo has not carded: an outskirts resident with no belongings (ch0020, ch0797), an officer drafted in the Evacuation Army with a Master's backing (ch0817-818), and a shopkeeper in a Citadel (W4 [S]). INFERRED sketches, not shown starts.
- **Failure and aftermath.** A low ranking is public (ch0024 p54-60). Refusing counseling is allowed, but the interview moves straight to Aspect questions. The tether rule means failure to join anyone is the real risk (ch0364 p44-46). Valor warns that growth invites its grip (ch1599 p08).
- **Surfaces.** Communicator and special communicator; the cafeteria ranking screen; the memory chip and badge; the Spell's status screens (shown earlier). A player UI would need the ranking, the tether choice and the points ledger as separate panels. PROPOSED only.

## 8. Findings (F-list)

| Code | Finding | Label and check |
| --- | --- | --- |
| F1 | The Academy is free board with a public ranking: private room, clothes and unlimited meals, plus a screen that ranks the batch from interviews. | SHOWN. V |
| F2 | Intake is chaotic: some Sleepers have a year, some days; inductions are monthly early in the year and weekly near the solstice; about a thousand per year. | STATED. V |
| F3 | The government and Legacy clans track every Awakened, and each Awakened owes a duty to answer a nearby Gate; survival is by tethering to clan, government or cohort. | STATED. V |
| F4 | Clans recruit by patronage contract, adoption or marriage; independents are free but unsupported. | STATED. V |
| F5 | Contribution points are a government store of value for information, spent on equipment, not on the Irregular draft. | STATED. V |
| F6 | The Evacuation Army is a fast institution: a commission in under half an hour; 42 recruits, six per cohort; Memories are carried by supply officers. | SHOWN. V |
| F7 | The outskirts hold 60-70 million, about a fifth of the city, on government rations. | STATED. V |
| F8 | The Sanctuary of Noctis is a small Dream Realm town (about 200 residents) with assigned rooms and a park market that trades shards for Memories or credits. | SHOWN. V |
| F9 | Late economy: Great Clan coins backed by shard treasuries; a single Memory shop lives on one sale a month. [S] | STATED. V |
| F10 | Medical help is scarce and expensive in the Song Domain. [S] | STATED. V |
| F11 | Poverty is real money: a street kid's years of savings bought one investigator. | STATED. V |

## 9. Engine facts (default, dial, reason; WPR5, WPR31)

| Fact | Default | Dial | In-world reason and cost | Exceptions the text shows |
| --- | --- | --- | --- | --- |
| EF1 Intake schedule | Induction batches monthly, weekly near the solstice | Infection rate, season | The Spell infects chaotically; cost is waiting days or being underprepared | Sunny arrived hours before the event (ch0020 p05) |
| EF2 Free board with disclosure | Room, clothes, meals free; counseling and interview offered | Wealth of the family, rank | The government wants data on Aspects; cost is leaked weakness | Refusal is allowed; Jet advises it |
| EF3 Public ranking | Batch ranked by interview results | Whether the Academy keeps it | The Academy wants selection; cost is envy and targets | The basis is the narrator's guess |
| EF4 Tracking and Gate duty | Every Awakened tracked; must answer Gates nearby | Rank, clan | Privileges are paid back by protection | No penalty shown |
| EF5 Tether | Survival needs a clan, a government post or a cohort | Dial from lone to heavily tied | Spell trials are too lethal alone | Independents exist |
| EF6 Three stores of value | Credits (digital), shards (physical essence), contribution points (government) | Local conversion | They do not freely convert; shards are absorbed | Sanctuary market and later coins convert at undisclosed rates |
| EF7 Memories move in person | Transfer needs both parties present and the Spell | Who holds them | Memories are soul-borne | A supply officer carries them for others |
| EF8 Gate interference | Electronics fail near Gates | Shielding spend | Gate energy disturbs tech | Expensive shielding works |
| EF9 Clan recruitment | Patronage, adoption, marriage | Value of the talent | Bloodline interest | Independence |
| EF10 Medical scarcity | Healers rare, costly | Dream Realm domain | Reason not stated in the window; only "rare" is stated [S] | Cultivation Aspects help (ch1599 p40) |

## 10. Contradictions and tensions (WPR20)

| Id | Claim A | Claim B | Chosen reading, owner, status |
| --- | --- | --- | --- |
| C1 | Kit card K8.W3-SS: "no shard-as-cash conversion inferred". | ch0386 p26 shows shards traded for Memories or credits; ch1599 p06 shows coins backed by shards. | Both stand: no universal rate, but conversion exists by market. The card's no-rate rule survives; its no-conversion wording needs a dial. Owner: kit card. Open. |
| C2 | Kit card K7.W3-SS1: Academy roles are "not Spell ranks". | ch0363 p42 gives citizenship a "seventh rank". | A civil rank scale exists beside Spell ranks. Owner: kit card. Open. |
| C3 | Kit card K8.W3-SS: shared room agreements vary; board is a separate entitlement. | ch0024 p01 gives each Sleeper a private room and free board. | Source wins for the opening Academy; card's proposal stands as a dial for other eras. Owner: kit card. Open. |
| C4 | Kit card K6.W3-SS lists Julius, Rock, Sunny, Cassie, Nephis and an original dorm keeper (Hana Ward). | The source's main institutional contact in the same window is Master Jet, and Caster is the visible ranking rival; neither is carded. Hana Ward is PROPOSED. | Add Jet and Caster to the cast or record a reason. Owner: kit card. Open. |
| C5 | ITEMS_SOCIETY 4.3: "Remembrance facility slots unaffordable" etc.; RANKS gaps: no credit price. | This pass found no price either. | Confirmed absence, EPUB 1-1840 only. Owner: ITEMS_SOCIETY. Resolved as "still absent". |
| C6 | Reader flagged five government Transcendents vs three. | ch1600 p05 five powerhouses; ch1603 p11 lists three of the highest tier; Effie (Raised by Wolves) is one of both. | Reader error, not a source conflict. Resolved. |
| C7 | Spelling: ch0024 p55 prints "Cassia"; elsewhere "Cassie". | n/a | Kept as printed; MT/edition noise. Open. |
| C8 | Card says the Dreaming original world is "inspired by" SS. | Source Flaw is a compulsion, not a trade-off cost curve. | Original premise differs; not a conflict. Noted. |

## 11. Gaps and unread windows (WPR7, WPR23)

Read: 42,236 of about 2.24M words in EPUB 1-1840. Unread, with exact windows and suggested reader (haiku, one at a time):

| Gap | Window | Notes |
| --- | --- | --- |
| Valor and Song clan internals, ranks, recruitment terms | ch367-369 (read ch367-368 partly), ch753-763 | ch753 Academy staff and clan tension |
| Government soldier pay, Evacuation Army ranks, stipend | ch815-816, ch820-825 | Irregular company routine |
| Tournaments, prizes, healing competitions | ch531-542 | Great Clan tournament |
| Market and shop prices where they exist | ch171-174 (Dark City market), ch189 | Dream Realm Memory prices from the Shore; already in ITEMS_SOCIETY, price lines unopened |
| NQSC city services, remembrance facility, citizenship benefits | ch3, ch481, ch559, ch797-811 | Waking-world daily life |
| Late economy and Domains | ch1685-1695, ch1706 | Memory purveyor, patronage [S] |
| Volumes 9-11 (past ch1840) | not searched | Absences are "not found in EPUB 1-1840" |

## 12. Floor card (WA6)

Five records for the bare-minimum floor. Each record: default, dial, in-world reason and cost, source locator and evidence label, current repo coverage, and the smallest playable slice. No canon invented; PROPOSED rows are marked.

**K2 World laws (5 to 10 engine facts).** Default: EF1-EF10 of section 9, trimmed to a playable seven: EF1 intake schedule, EF2 free board with disclosure, EF4 tracking and Gate duty, EF5 tether, EF6 three stores of value, EF7 Memories move in person, EF8 Gate interference. Dial: era (Academy-era versus later Domains), rank, clan. In-world reason and cost: the Spell, the government and the Dream Realm make each rule costly (leaked Aspect, owed duty, unconvertible money). Source and labels: sections 2 and 9, STATED/SHOWN, V. Repo coverage: kit card K2 "partial/missing"; no SS pack, so laws are prose only (WA4). Smallest playable slice: three laws as gates on one Academy day (intake wait, interview disclosure, tether choice), each naming the consumer that reads it.

**K3 Power core (resource, growth, one learn path, 3 to 6 techniques).** Default: soul essence in a soul core; growth by Spell-set Nightmare trials (rank gates in RANKS); learn path is the Academy: Julius's Wilderness Survival then Rock's combat class; techniques: summon or dismiss a Memory, absorb a shard or coin for essence (ch1599 p10; ch0466 p07), shadow-enhanced strike (the full-book detail notes for ch27-28, not reopened), feed an Echo to a shadow for fragments (ch0511 p49, ch1253 in earlier notes), weave transplant between items (ch0827 p21-34, U). Dial: Aspect, Flaw, rank. Reason and cost: essence is finite and scarce; Flaw is a compulsion (ch0020 p40-42). Labels: SHOWN/STATED, partly U. Repo coverage: kit card K3 "partial/missing" (core, utility Aspect and Flaw, not a 3-6 state set). Slice: Memory summon/dismiss plus shard absorption, a three-technique set, with the Flaw as a visible cost.

**K6 Cast (minimum named people with roles).** Default: Master Jet (government handler, ch0019, 0362-365, 0817-818), Teacher Julius (survival, ch0025), Instructor Rock (combat, ch0022, 0026), Nephis (peer and ring score, ch0024), Cassie/Cassia (peer, ch0024), Caster (ranking rival, ch0024 p60), the Academy interviewer (ch0024 p36), librarians Ren and Nickel (ch0366, U). Dial: era; later adds Aiko, Sebastian and Morgan [S]. Reason and cost: each is a person the Sleeper owes or borrows from. Labels: SHOWN, V except librarians. Repo coverage: kit card K6.W3-SS1-6 carries Julius, Sunny, Cassie, Nephis, Rock and an original dorm keeper (PROPOSED), but not Jet or Caster (C4). Slice: Jet, Julius, Rock, Nephis as four verbs (ask advice, request lesson, request combat check, ask ranking comparison).

**K8 Daily life (jobs, meals, prices, a day's rhythm).** Default: at the Academy, board is free (room, clothes, meals) with a shard for sharing experience; jobs in the source are research assistant (ch0375 p46), Academy instructor and staff (ch0753), soldier or officer (ch0817), supply officer (ch0827), shopkeeper and floor manager [S] (ch1605), hunter; price anchors are only relative (shard, points, house, a year of savings). Day: breakfast and supper in the cafeteria, a class day from morning to sunset (ch0025 p82), interview, sleep. Dial: wealth, citizenship, era. Reason and cost: the Academy buys data with board; outskirts residents live on rations. Repo coverage: K8.W3-SS (proposed credits: meal 5, guest bed 20 a night, coached session 30, kit 40; PROPOSED, not source). Slice: one funded day with free board, one paid job and a points ledger, no hunger death. The source gives no credit price in EPUB 1-1840 windows read, so the proposed numbers stay proposals.

**K13 Signature loop.** Default: sleep into a Nightmare or the Dream Realm, hunt or survive, carry back shards and Memories, trade them (Sanctuary market or clan), prepare, sleep again; the waking half is Academy study and disclosure choices. Dial: Academy-era (prep loop) versus Citadel-era (shop loop). Reason and cost: Spell trials set the clock; each trip risks death and essence. Labels: STATED/SHOWN (sections 2 and 4). Repo coverage: kit card K13 "partial": sleep, preparation and return described, no executable cards. Slice: one prep-day loop (Wilderness Survival lesson, Rock check, interview, ranking screen) ending in the tether choice (ch0365 p23-31) and a solstice-timed Dream entry.

## 13. More-to-consider round (WPR24)

| Class | Item | Done check |
| --- | --- | --- |
| ACT NOW (done) | Record the reader errors (C6, Caster clan, price/number table form) and the stale-path facts; the "Evernight" zero hit | Present here and in the private returns file |
| ACCOUNT FOR NOW | Treat Jet as the institutional spine of the opening; the card lists her nowhere (C4) | A K6 row or a reason |
| ACCOUNT FOR NOW | Keep tether as a dial, not a law; the source also shows lone hunters | Pack row cites EF5 and the independent exception |
| ACCOUNT FOR NOW | Do not import any number from section 4 as a fixed constant: all are edition numbers, and only four have prices at all (none in credits) | Pack rows cite locator and edition |
| ACCOUNT FOR NOW | Keep [S] rows out of the first slice's player-facing text (W4, Valor stipend) | Sealed-secrets check (WA11) |
| LATER/DELEGATE | Clan internals and recruitment terms. Level: haiku reader, ch753-763 plus ch367-369. Effort: 12k words. Done check: a clan-role table or a "not found, searched where" row | Table plus two spot checks |
| LATER/DELEGATE | Army routine and pay. Level: haiku, ch815-825. Effort: 12k. Done check: ranks, pay, drill rows | Same |
| LATER/DELEGATE | Waking city services and remembrance facility, ch3, 481, 559, 797-811. Level: haiku, 12k, a price or "none" per facility | Same |

Suggestions (separate, short): a "ranking screen" is a reusable public-comparison mechanism; "tether" and "points ledger" generalize to other worlds; compare with the Paradise hub's mission points before building.

## 14. Ranked next list (WPR25) and review state (WPR21)

1. Clan internals plus Academy staff politics (ch367-369, ch753-763): about 12k words, closes the K7 institution row that is still a stub.
2. Waking city services and the outskirts (ch3, 481, 559, 797-811): about 12k, closes K8 daily life prices if they exist.
3. Army routine and pay (ch815-825): about 12k, completes the Irregular company role set.
4. Dream Realm Memory market prices (ch171-174, ch189): about 10k, opens the Shore price lines for a K8 anchor.
5. Late economy and Domains (ch1685-1695, ch1706 [S]): defer behind the first milestone.

Highest state reached: drafted, with 16 claim groups source-spot-checked by the coordinator (not a separate reviewer; the readers' authors differ from the checker). Not rules-reconciled with AD, WA, PIR or ECR codes in detail; touched: WPR1-WPR32, AU2-AU6, AU13, AD38, AD5, WA3, WA4, WA6, WA8, WA11. Not built, not browser-verified, not director-accepted. No conflict with standing direction found; nothing here changes a priority or makes deferred work a gate.

Follow-ups, not done because the task said to touch nothing else (WPR3, WPR28):
- Link this file from the SS kit card (`docs/worlds/world-core-kit-2026-10-14/cards/shadow-slave.md`), from the Dreaming entry in `docs/WORLD_CARDS.md`, and from `docs/research/novels/shadow-slave/` (BRIEF or an index).
- Correct the stale Sync path in `docs/research/novels/LOCAL_LIBRARY.md` and `docs/research/novels/full-book/shadow-slave/epub_access.py`.
- Fold into WPR lessons: a keyword census on money vocabulary mostly finds idioms, so check ten snippets before choosing a window; a reader can invent a conflict (C6), so open both locators before logging one.
- Reconcile C1-C4 in the kit card.
