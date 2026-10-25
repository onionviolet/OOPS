# A Soldier's Life: institutions, roles, subtle details and floor card (2026-10-23)

Research and proposals, not accepted decisions and not implemented. Pass: WPR9-WPR17 (military institutions and law, roles, money, time, power, starts, failure, surfaces) plus a WA6 floor card, mode reuse-and-check plus bounded read. Owner file: this one, created by instruction (WPR3). Links from the kit card and WORLD_CARDS are not made because the task said to touch nothing else; see section 15. Review state reached: drafted, then source-spot-checked by the coordinator on 21 claim groups (WPR21). Not rules-reconciled in detail, not built, not browser-verified, not director-accepted. Sealed secrets: none touched; late-plot material is tagged [S] and left in the private store (WPR8). Runtime for this world stays paused (PROJECT.md "Soldier runtime stays paused"); nothing here reopens it.

## 1. Source, edition, tier and budget

**Editions held (WPR23, WA10).** Calibre EPUBs under `~/Calibre Library/`: Book 1 (ID 55), Book 2 Sobral City (56), Book 3 The Shimmering Labyrinth (57), Book 5 The Boutan Caliphate (58), Book 6 Adventures in Godok (112). sha256 of Books 1, 2, 3 and 5 equal the hashes in `novel-wave-2026-10-09/soldier/SOURCE_MANIFEST.json` (checked today). Book 4 The Hounds exists only as the MOBI `~/Downloads/A Soldiers Life Book 4 The Hounds (...).mobi`, sha256 d5260ef9... equal to the prior manifest; `ebook-convert` is not on PATH (calibre.app is installed), so no Book 4 text was extracted. Book 6 (sha256 d696f804d9940bb3033aca245103a97e44b703b55320412945f5652a746f7605, added to Calibre 2026-10-22, 65 chapters numbered 320-384) is not in the prior manifest and was never read by the 2026-10-09 reader, which covered Books 1-5. The LOCAL_LIBRARY.md has no entry for this series (grepped for Soldier, RollsAOne, Thiemke, Sobral, Boutan, Godok, Hounds: no hits). My extraction (`passes-2026-10-23/extract_all.py`, run with `python3 -I`) gave: Book 1 58 chapters 130,968 words; Book 2 63 / 154,796; Book 3 60 / 161,467; Book 5 76 / 219,154; Book 6 65 / 171,963; total about 838,000 words in five held texts plus an unextracted Book 4. Translator or editor: none (English original; edition credit "Always RollsAOne" / "Erick Thiemke" varies by file).

**Locator schemes (declare both).** This pass uses `[bNcNN pNN]` (book, chapter, paragraph) where p00 is the chapter heading line and paragraphs count non-empty text blocks. The 2026-10-09 reader used `ChN PNN` from `extract_locators.py`, whose P-numbers differ (for example its Book 1 Ch5 P179). A new-scheme locator and an old-scheme one are never combined in one cell without saying which; where this doc cites the old notes it names the file.

**Tier in the repo.** The kit card (`cards/soldiers-life.md`) says K1-K8 "not assessed" and rows are INFERRED anonymous proposals; runtime paused. There is a historical private first slice (`private_packs/a-soldiers-life/pack.json`, 2026-10-09, DESIGN.md and REPORT.md in `soldiers-life-world-2026-10-09/`), dated evidence only, not current runtime. A five-volume source dossier exists (`novel-wave-2026-10-09/soldier/SERIES_DOSSIER.md`, `INDEXES.md`, `VOLUME1-3_RECONCILIATION.md`, `chunks/`, `volume-04-reader/`). WPR completion level C0-C5 is not graded here.

**Reused first (WPR2).** SERIES_DOSSIER (military work, institutions), INDEXES (institutions, powers), VOLUME1_RECONCILIATION (25 small touches, progression), chunks BOOK1_CH45-58 and BOOK2_CH59-70, the kit card W2/W3/W4 Soldier lanes, and DESIGN.md of the 2026-10-09 slice. These supply themes, not procedure: no prior note gives the soldier pay scale, the coin ladder, tablet costs, free legion healing, the quartermaster debt rule or the cut schedule. That procedural gap chose every window.

**Windows (WPR7, form labelled).**

| Window | Content | Source words | Form | Named gap it fills |
| --- | --- | --- | --- | --- |
| W1 | Book 1 ch1, ch2, ch3 whole, then ch4 p00-p108 | 11,993 | consecutive (ch4 cut at p108) | Recruit entry, sentence-or-army choice, pay, term, training, cut schedule; no chunk file covers B1 ch1-5 and the old notes give themes only |
| W2 | Book 1 ch22-23, then ch52-54 (ends at ch54 p73) | 11,685 | mixed: two consecutive runs | Wall duty, patrol, rest, baths, hauling pay, retreat, capture policy; older notes carry no coin or shift rows for ch22-23 |
| W3 | Book 2 ch60, ch64, ch65, ch69, ch70 | 11,862 | excerpts: five whole non-adjacent chapters | Free legion healing, flags and command, tribunal, reserve accounts and debt, bounty split, Guild fees and shop prices |
| W4 | Book 6 ch350, ch359, ch361, ch363 | 10,634 | excerpts: four whole chapters | Book 6 was never read; discipline, prices, Hound entry, pensions. All [S] |

Total read by readers: 46,174 words of about 838,000 (5.5% of the five held texts; Book 4 and the unread remainder are gaps, section 12). The census (keyword counts per chapter, `census.json`) only picked windows; a census is not reading (WPR7). Windows and the cut files are `W1.txt` to `W4.txt` in the private store.

**Budget (declared finite plan, AU2, AU13).** Coordinator (Sonnet) plus 4 readers, each a fresh Agent call with model "haiku" set in the first brief, one at a time, one window each of at most 12,000 words, repair reserve 1 (used 0). Invocations: 4 of 4 readers, 0 of 1 repair, 1 advisor call before windows and 1 before closing. AU12/AU14 disclosure: the readers made 8, 9, 9 and 5 tool calls and used about 131k, 125k, 124k and 109k subagent tokens. The brief did not state the six-response cap, so R1 to R3 very likely exceeded it; exact response counts and peak context are not visible to me. The budget limits on windows and invocations held; the per-reader response and 60k-context targets are not shown to have held. W1 served as the pilot (AU4). An earlier attempt stopped on a session rate limit before any reader ran; the resumed run reused the saved windows and spent no extra budget. The original W4 (Book 5 guild chapters) was replaced by a Book 6 window on advisor advice, because Book 6 was wholly unread. Reader returns are saved in the private store: `passes-2026-10-23/R1.md` to `R4.md`, with `BRIEF.md`. Reader tier: haiku throughout; no rerun on a stronger tier was needed, but two reader quirks are logged in section 10.

**Coordinator spot checks (WPR18-19).** I opened the extracted source text at each locator and compared. The reviewer differs from the reader author; I am the coordinator, not a separate agent.

| Claim | Locator | Result |
| --- | --- | --- |
| Four charges, ten silver each; court pays victim, debtor owes the court; labor-out two years | b1c1 p22, p24, p27 | Confirmed |
| Soldier pay "one silver and eight copper per week" after seven-week training | b1c1 p28 | Confirmed |
| Coin ladder 100 copper = 1 silver, 100 silver = 1 gold | b1c1 p32 | Confirmed. The "large coin worth ten coins" is cut off in my excerpt; the Guild change in b2c70 p18 is consistent with a large silver = 10 silver |
| Legion gate: 40 potential in all physical stats, 60 in Strength and Power; only about one in three finish | b1c1 p87, p94 | Confirmed |
| Legion pay "five silver and forty copper per week", "Five times a soldier"; term "Just five years"; failure means the regular army | b1c1 p94 | Confirmed (540 / 108 = 5) |
| Recruiter bonus one silver per soldier, a quarter gold per legionnaire | b1c1 p98 | Confirmed; narrator says he found out later |
| Escape before day one means trial and execution; mages track in minutes | b1c2 p15 | Confirmed |
| Minor essence one to twenty gold, major roughly ten times as potent, apex "a few hundred gold" at least | b1c2 p113-116 | Confirmed (Damian's account; major price 50-500 gold not rechecked) |
| Translation amulet cost 20 gold | b1c3 p94 | Confirmed (narrator found out) |
| Centurion cuts by tablet and sometimes "lowest summed physical attributes, but not always"; also removes men he judges unfit | b1c3 p199 | Confirmed |
| Barrack count 58 filled beds at the fourth cut | b1c3 p183 | Confirmed (inference of the count drop only) |
| Skin haul pay 55 silver each; upper-city bath one silver coin called outrageous | b1c23 p32-33 | Confirmed |
| Capture policy: regulars to work camps, city guards repair work for a few years, legion and legion mages executed publicly | b1c54 p27-28 | Confirmed (Castile, stating Bartiradian policy) |
| Free legion healing in any large city; regular army only maybe an infirmary | b2c60 p13 | Confirmed (Brutus's claim, not a checked rule) |
| Duke's legion company tax to the Emperor; flag stripe rule | b2c60 p03 | Confirmed |
| Reserve accounts seized; no reinforcements for ten years unless below twelve; old gear free, new gear to legionnaire debt | b2c69 p18, p20 | Confirmed |
| Bounty total 1705 gold 88 silver 14 copper; each legionnaire paid "seven large gold, five small gold, and sixty-eight silver" | b2c69 p31, p34-35 | Confirmed; large/small gold conversion not written |
| Guild registration 25 silver, both tablets 11 more, one gold paid, change "sixty-four coins"; attribute tablet 1 silver, affinity tablet 10 silver | b2c70 p03, p15, p17-18 | Confirmed. 1 gold - 36 silver = 64 silver, consistent with the text's six large and four small coins |
| Shop prices: cure disease 10 gold (Imperial 25), lesser healing 4 gold (Guild "one gold less than the Imperials"), oblivion pills a silver each, identification a gold; Eryk's 21 gold total | b2c70 p136-153 | Confirmed (2 + 3 + 16 = 21 with the six ointments at 50 silver) |
| Menagerie ticket a large copper; siren show a large silver each; earplugs a large copper; Hound entry requires artifact use | b6c361 p20, p30, p35; b6c363 p08 | Confirmed |
| Quartermaster charges new linens and sandals to debt at about twice their worth | b2c62 p46 | Confirmed by my own search (this was not in any reader return) |

Not opened by me (marked U below): the 25 prior-note claims, the full cut timeline rows other than the 58-bed row, wall shift sizes (seven men, 21 total, b1c22 p14, p21), Linus's role as medic, the siege roster, Menagerie-side crowd claims, and all Book 6 Hound-pack discipline scenes.

## 2. Places, camps and institutions (WPR9, WPR11)

Labels: SHOWN (scene), STATED (character or narrator says it), INFERRED, PROPOSED. V = coordinator-opened, U = not opened. Locators use `[bNcNN pNN]`.

| Place or institution | Who runs it | Cost and units | Access | Tiers, limits, hazards | Locator, label, check |
| --- | --- | --- | --- | --- | --- |
| Court and magistrate (entry by sentence) | Magistrate Advocate, a visiting Truthseeker confirms charges | Fine 10 silver per crime; 4 crimes; pay back to the court or labor two years | Convicted foreigner or local | Choice between labor, army, Legion; recruiter gets a bonus | b1c1 p20-31, p98. SHOWN/STATED. V |
| Regular army | Army | Pay 1 silver 8 copper per week after 7 weeks training | Potential 40 in Strength and Endurance; foreigners welcome | Fodder at the front (instructors' claim) | b1c1 p28, p87; b1c2 p27. STATED. V (pay, gate), U (fodder) |
| Legion of the Lion | Centurion Silas runs the camp | 5 silver 40 copper per week; "Empire pays all expenses"; term five years (STATED) | Potential 40 in all physical, 60 in Strength and Power; outlanders accepted | One in three finish; failure goes to regular army; training seven months | b1c1 p87, p94, p96; b1c2 p14. STATED/SHOWN. V |
| Legion training camp (manor) | Centurion, seven wardens per barrack, about seven mages | Training costs ten times the regular army (STATED) | Barracks of 100 bunks, started when full | Escape means execution; teeth and bones broken then healed | b1c2 p14-17, p36. SHOWN/STATED. V (escape), U (rest) |
| Tablet cut cycle | Centurion, mage testers | About every three weeks | All trainees | Tablet and weapon ranking cut the barrack from 100 to 56 beds; bottom three of each combat go to the army | b1c2 p36, p112, p185, p196; b1c3 p94, p183, p195. SHOWN. V (58 beds, centurion rule), U (rest) |
| Legion company (field unit) | Mage commander (Castile), lieutenant, scouts, cooks, medic, archers | Pay as above, plus loot shares | Assigned from camp; porter role by order | Only Legion officers command the mages | b1c6 p11; b1c23 p14. SHOWN/STATED. U |
| Legion flags and command lines | Camp custom | Duke's company without a mage pays the Emperor a tax per legionnaire | Mage company has a solid flag, duke's non-mage company a horizontal stripe, no flag means neither | Dukes cannot command mages | b2c60 p03. STATED. V |
| Legion Hall and quartermaster | Legion Hall in a city | Fresh linens and sandals added to the legionnaire's debt at about twice worth | Legionnaires | New gear charged to debt; old gear swapped free | b2c62 p46; b2c69 p20. STATED/SHOWN. V |
| Free legion healing | Mage healers in large cities | No coin (STATED) | Legionnaires in any large city | Regular army maybe an infirmary; potions close wounds too fast and leave debris | b2c60 p13, p21-22. STATED. V |
| Company wall duty and patrols | Lieutenant, scouts | Shifts sunrise to sunset on the wall, seven men per shift, 21 total (U) | Company | Swamp patrol the day after; wall attacks; griffin watch by the enemy | b1c22 p14-21; b1c54 p01. SHOWN. U |
| Macha baths | City | Upper city one silver coin (called outrageous); lower city dirtier, price not written | Anyone with coin | Clean water costs | b1c23 p33. SHOWN. V |
| Tannery haul | City trade | 55 silver each for hauling 40 pounds of skin 7 miles | Legionnaires on the crew | A noble pays 20+ gold for a saddle; a strip fetches 2-3 gold | b1c23 p26, p32. SHOWN/STATED. V |
| Ducal Tribunal | Three dukes, Truthseeker, Advocate | Statements taken the night before; vote per charge | Accused and witnesses | Missing evidence can produce an undeserved verdict | b2c65 p24-35. STATED. U |
| Adventurers' Guild hall | Clerk, Guildmaster with a truth spell | Register 25 silver; tablets 1 silver (attributes), 10 silver (affinities), 11 silver for both | Members only for tablets and warehouse | Hall pays dungeon bounty; essences and artifacts sold only there | b2c69 p22-35; b2c70 p03-18. SHOWN/STATED. V |
| Guild warehouse shop | Halfling Tarvon, Telha | Oblivion pill a silver; cure disease 10 gold; lesser healing 4 gold; greater 40 gold; identification a gold; near-expiry stock half off | Members | Cure disease fails on magical disease; expiry in days; Imperial Alchemists charge more | b2c70 p127-153. SHOWN/STATED. V |
| Bartiradian capture policy | Enemy kingdom | none | Prisoners | Regulars to work camps; city guards repair work for a few years and earn freedom; legion and mages executed publicly | b1c54 p27-28. STATED. V |
| Menagerie of Beasts, Godok | Private show in a former garrison | Entry a large copper coin; siren show a large silver each; earplugs a large copper | Anyone with coin | Half of unplugged patrons fell to the song even with plugs | b6c361 p20-48. SHOWN/STATED. V (prices), U (rest). [S] |
| Hound pack (Book 6 era) | Pack leader Firth | Pay scale not in window | Hound training requires artifact use (rushed in the war) | Leniency undermined discipline; Firth beat a pack member twice | b6c363 p08-25. STATED/SHOWN. V (gate), U (rest). [S] |

## 3. Person-to-person roles (WPR10)

| Role | What it does and owes | Access and cost | Failure or hazard | Locator, label, check |
| --- | --- | --- | --- | --- |
| Magistrate recruiter | Offers labor-out, army or Legion; paid per recruit | Meets convicts in the cell | Steers toward higher bonus (narrator suspects) | b1c1 p20-31, p98. SHOWN. V |
| Centurion (camp commander) | Cuts trainees by tablet plus discretion; hands out essence awards; orders executions | Rank and office | Fear of being cut makes trainees compete | b1c2 p15; b1c3 p199. SHOWN/STATED. V |
| Mage healer-friend (Damian) | Heals the trainee, explains tests and essences, gives language help | Friendship, preferential healing | Secrets kept by the friend | b1c2 p04; b1c3 p02-27. SHOWN. U |
| Legion healer (Larita) | Examines a body, extracts debris, advises against potions | Requested through the company | None shown | b2c60 p06-25. SHOWN/STATED. V (p21-22) |
| Company commander mage (Castile) | Commands the company, pays gear from dungeon gold, gives extra pay | Rank | Reserve accounts seized by the Empire; no reinforcements for ten years | b2c69 p18-20, p42. STATED. V |
| Veteran scout (Konstantin) | Wakes men, trains, explains Guild and pay rules | Veteran standing | Says desertion is executed | b1c22 p20; b2c60 p50. SHOWN/STATED. V (p50) |
| Lieutenant (Adrian) | Takes wall shifts, sets bonus deadlines, sets surrender timing | Rank | None | b1c23 p24; b1c54 p43. SHOWN. U |
| Company medic (Linus) | Holds company potions, sells a hangover flower, owes the Baron ten years | Former animal doctor | A ten-year debt service | b1c22 p02, p19, p30. SHOWN/STATED. V (p30) |
| Bunkmate and comrades | Share watches and loot; one pays a small bet | Same unit | Teasing, debt, fights | b2c69 p03, p07. SHOWN. U |
| Cooks | Lirkin cooks, Lysander backup | Company slots | Food theft from the regular army cart | b1c52 p02, p40; b2c60 p31-36. SHOWN. U |
| Guild clerk and Guildmaster | Register members, pay out bounties by voucher or coin | Desk | Unfriendly clerk gave awkward change | b2c69 p31-35; b2c70 p08-25. SHOWN. V |
| Guild warehouse keeper (Tarvon) | Sells stock, discounts expiring stock, identifies artifacts | Members | Halflings tolerated, dwarves not | b2c70 p130-153. SHOWN/STATED. V |
| Civilians: tanner, farmers, innkeeper | Buy hauled goods, accept a few coins for food or pasture | Coin | Enemy-sieged city | b1c23 p31; b2c60 p38. SHOWN. U |
| Enemy general and sky riders | Besiege, mourn, make execution a public show | None | The sister link [S] | b1c53 p01-33; b1c54 p28. SHOWN/STATED. V (p27-28). [S] |
| Hound pack leader (Firth) and pack | Lead by leniency; fight mutiny with beatings; kill a mage deserter's party | Hound rank | Loss of respect | b6c363 p11-39. STATED/SHOWN. U. [S] |

Missing in the windows: formal sergeant-like rank (zero hits for "sergeant" in the five held texts), camp followers (one hit, b5c254 p24, not read), sutlers, and any promotion ladder with named steps (searched; see section 12).

## 4. Money, goods and information (WPR12)

All numbers are edition numbers from the held English text (WPR19). Coin ladder (STATED b1c1 p32): 100 copper = 1 silver, 100 silver = 1 gold; a "large" coin appears (large silver, large copper, large gold) with the ratio to the plain coin unwritten in my excerpt and apparently ten (b2c70 p18 inference).

| Item | Value | Locator, label, check |
| --- | --- | --- |
| Soldier pay | 108 copper per week after 7-week training | b1c1 p28. STATED. V |
| Legionnaire pay | 540 copper per week; "Five times a soldier" | b1c1 p94; b2c69 p42. STATED. V |
| Crime fine | 10 silver per crime (4 crimes = 40 silver) | b1c1 p22. STATED. V |
| Labor-out | 2 years to repay | b1c1 p27. STATED. V |
| Recruiter bonus | 1 silver per soldier, a quarter gold per legionnaire | b1c1 p98. STATED. V |
| Translation amulet | 20 gold (loan) | b1c3 p94. STATED. V |
| Minor essence | 1 to 20 gold by stat; physical cheapest, magical dearest | b1c2 p113. STATED. V |
| Major essence | 50 to 500 gold (reader), about 10x minor | b1c2 p115. STATED. U (range) |
| Apex essence | at least a few hundred gold, magical stats a thousand or more | b1c2 p116. STATED. V |
| Haul pay | 55 silver each for the skin crew | b1c23 p32. SHOWN. V |
| Upper-city bath | one silver coin | b1c23 p33. SHOWN. V |
| Morning-glory flower | six large silver per stem | b1c23 p06. SHOWN. U |
| Dungeon bounty | 1705 gold 88 silver 14 copper total; per legionnaire seven large gold, five small gold, 68 silver | b2c69 p31-35. SHOWN. V |
| Guild fees | Register 25 silver; attribute tablet 1; affinity tablet 10 | b2c70 p03, p15. STATED. V |
| Healing potion tier prices | Lesser 4 gold, greater 40 gold (Guild); Imperial 5 and 50 | b2c70 p147. STATED. V (lesser) |
| Cure disease | 10 gold (Imperial 25); near expiry 1 gold | b2c70 p144. STATED. V |
| Pills, ointment, ID | Pill a silver; ointment 50 silver near expiry, fresh vial 1 gold; artifact ID a gold | b2c70 p136-153. SHOWN. V |
| Menagerie | Ticket a large copper; siren show a large silver; earplugs a large copper | b6c361 p20-37. SHOWN. V. [S] |
| Day hire (halfling guide) | two gold for the day | b6c361 p01. STATED. U. [S] |
| Pension | After twenty years (a veteran says) | b1c33 p59. STATED. V |

Information. Tablets reveal stats and affinity at a price (Guild) or by a Legion tester (free in camp); the Magistrate recruits by reading a tablet (b1c1 p83-87); Truthseekers verify testimony and are too slow for mass checks (b1c53 p01, U). The Guild monitors dungeons and can identify dungeon objects (b2c70 p153, V). Temporary secrets: the narrator hides the permanent storage space from most (INDEXES.md knowledge table).

## 5. Time and rhythm (WPR13)

| Item | Default | Dial and reason | Locator, label, check |
| --- | --- | --- | --- |
| Legion training length | Seven months, versus seven weeks for the regular army | Barrack starts when full, normally the first of a month | b1c1 p96; b1c2 p14. STATED. V |
| Tablet cycle | About every three weeks | Followed by cuts and awards | b1c2 p36, p118. SHOWN. U |
| Training day | Weighted run before breakfast, lecture, hand-to-hand, sword, fitness until sunset | Two free hours before dark; first free day after six weeks | b1c2 p18-26, p197. SHOWN. U |
| Night watch | Four hours in the field squad | Trainee patrol | b1c4 p02. SHOWN. U |
| Wall shifts | Seven men per shift, 21 total, sunrise to sunset | Rotation with swamp patrol and rest | b1c22 p14-21. SHOWN. U |
| Pay rhythm | Weekly legion pay; a bi-monthly wage after the debt is paid (unit unclear) | Debt first, wage after | b1c1 p29; b2c69 p42. STATED. V |
| Reinforcement lockout | Ten years unless below twelve | Punishment for an early retreat | b2c69 p18. STATED. V |
| Term | "Just five years"; a veteran says pension at twenty years | Different speakers | b1c1 p94; b1c33 p59. STATED. V |
| Hound war timeline | Rowboat landing, then four days, one week, two days of pack travel | Compressed Hound training | b6c363 p01-28. SHOWN. U. [S] |

Not found: seasonal campaign calendar, festival dates (kit card says open), leave beyond a single free day, a posted payday (the word occurs three times, never as a pay day for soldiers; see section 12).

## 6. Power and growth subtleties (WPR14)

- The tablet shows current and potential per stat on a 0-100 human scale; the first reading and five later readings of seven physical stats are in R1 section 3 (V for the first reading, U for the rest). Early gains are large (Strength +10 on the first re-read, Endurance +11) and shrink to +1 to +5 later (b1c2 p43-p99; b1c3 p35-p179; b1c4 p45-p103; U). The reader flagged one reading where potential rose (Dexterity 55 to 56, Coordination 60 to 61) and one label inconsistency (Fortitude, b1c3 p178).
- Essences: minor, major, apex, with the rule of thumb that about 30 minor essences raise a stat by one point below half potential, and apex essences are the only kind that raise potential (b1c2 p115-116, V). A top-three combat placing earns a minor essence of strength or power (b1c2 p112, U). Scale check (inferred arithmetic): 540 copper a week is about 2.8 gold a year, so an apex essence at a few hundred gold is about a century of legion pay, a lesser healing potion (4 gold) about 1.4 years, the translation amulet (20 gold) about 7 years, and the 55-silver skin haul about 10 weeks of pay in one day.
- Essences from living beings are outlawed and used only for executions (b1c4 p27, U). [S]
- Mages heal injuries daily but regrowth is not wasted aether; Larita says potions seal wounds too fast, which leaves fragments (b2c60 p22, V). Mages are limited by daily aether (b1c54 p15, U).
- Rank and magic are separate: Legion officers command mages; dukes cannot (b2c60 p03, V).
- The permanent dimensional space, the temporary cast-space and the Titans' override live in the private dossier (INDEXES.md), not repeated here (WPR8).

## 7. Starts and entry (WPR15)

| Start | What the source shows | Locator, label, check |
| --- | --- | --- |
| Convicted foreigner | Court gives a fine/labor/army/Legion choice; the stranger learns the language through a loaned amulet | b1c1 p20-32. SHOWN. V |
| Volunteer | A legionnaire says he joined for better pay and pension; legion volunteers train at a named camp | b1c33 p59; b2c60 p32-33. STATED. V (p59), U (p32-33) |
| Debt-bonded | A medic owes ten years to a baron for a killed bull | b1c22 p30. STATED. V |
| Hound (Book 6 era) | War compresses training; artifact use is the entry bar | b6c363 p08-09. STATED. V. [S] |
| Not read | A conscript levy law, an officer commission route, civilian trade entry other than the Guild | Regex across the five held texts (section 12): "levy" 0 hits; "conscript" 36 hits (b1c2 p186, b1c6 p3, b1c18 p25 first); "commission" 2 hits (b1c30 p1, b5c265 p57); none opened, so these are unread rather than absent |

## 8. Failure, recovery and aftermath (WPR16)

| Event | Cost | Locator, label, check |
| --- | --- | --- |
| Escape before day one | Trial then execution; mages track in minutes | b1c2 p15. SHOWN/STATED. V |
| Desertion in the field | "executed for desertion" (a veteran's statement about a duke) | b2c60 p50. STATED. V |
| Failing training | Sent to the regular army; the regular army is the front-line fodder pool (hearsay) | b1c1 p94; b1c2 p27. STATED. V (first), U (second) |
| Being captured | Regulars to work camps; city guard work-for-freedom; legion and mages publicly executed | b1c54 p27-28. STATED. V |
| Early retreat | Reserve accounts seized, ten years without reinforcements | b2c69 p18. STATED. V |
| Wounds | Free healing in large cities; potions can leave debris; aether is the limit | b2c60 p13-25. STATED. V |
| Debt | New gear charged to legionnaire debt; the quartermaster over-charges | b2c62 p46; b2c69 p20. STATED. V |
| Pack discipline breaking down | Respect lost when a leader lets abuse slide, then beats the offender | b6c363 p11-25. STATED. U. [S] |

## 9. Findings (F-list)

| Code | Finding | Label and check |
| --- | --- | --- |
| F1 | A convicted foreigner picks labor, regular army or Legion at the cell; fines are 10 silver per crime, repaid to the court. | STATED. V |
| F2 | The money ladder is 100 copper, 100 silver, and soldier pay is 108 copper per week, legion pay 540 copper per week (five times). | STATED. V |
| F3 | Legion entry is a tablet test (40 potential in all physical stats, 60 in Strength and Power), training lasts seven months, about one in three finish, and a barrack of 100 shrinks to 56 across cuts. | STATED/SHOWN. V (gate), U (counts) |
| F4 | Cuts mix tablet, weapon ranking and centurion discretion; the lowest summed physical pool is a usual but not fixed basis. | STATED. V |
| F5 | A legionnaire gets free magical healing in any large city; the regular army maybe an infirmary. | STATED (Brutus). V |
| F6 | The quartermaster adds new gear to a legionnaire debt at about twice worth, while old gear swaps free. | STATED/SHOWN. V |
| F7 | Early retreat can cost a commander reserve accounts and ten years of reinforcements. | STATED. V |
| F8 | Capture treats regulars, city guards and legion differently (work camp, repair work, public execution). | STATED. V |
| F9 | A Guild gives a second path: registration 25 silver, tablet reads 1 or 10 silver, a shop at half Imperial prices, and a bounty split paid by voucher or coin. | STATED/SHOWN. V |
| F10 | Wages are a floor and windfalls drive the economy: 540 copper a week is about 2.8 gold a year, against a bath of one silver coin, a skin-haul day of 55 silver, a lesser healing potion of 4 gold, an apex essence of hundreds of gold and a dungeon bounty of 1705 gold. Pay could never cover healing or gear, which fits free legion healing and debt-charged issue. If a large gold is 10 gold (INFERRED; two checks agree: the 64-coin change, and 1705 gold divided by a 75.68-gold share gives about 22 shares, near a company of 20 to 26), each bounty share is about 27 years of legion pay. | SHOWN/STATED. V (prices), INFERRED (arithmetic) |
| F11 | Book 6 era shows Hound entry by artifact use, a Menagerie priced in large copper and silver, and a pack that breaks by lenient leadership. | STATED/SHOWN. V (gate, prices), U (rest). [S] |
| F12 | The word "sergeant" never appears in the five held texts, and "court-martial" never appears; punishment is by centurion, duke or tribunal. | Zero-hit search. V (regex run across extracts) |

## 10. Engine facts (default, dial, reason; WPR5, WPR31)

| Fact | Default | Dial | In-world reason and cost | Exceptions the text shows |
| --- | --- | --- | --- | --- |
| Entry as a choice | Sentence or enlistment offers labor, regular army or Legion | Debt size, term, recruiter bonus | State wants soldiers and pays a recruiter; the cost is a debt repaid in service | A medic's ten-year baron debt; a volunteer for pay |
| Tablet gate and cut | Potential thresholds at entry; cycle of tests and rankings thereafter | Cycle length, cohort size, centurion discretion | The Legion spends ten times the regular army's training budget and cuts weaker cadets | Gains are huge early and small later |
| Weekly pay ladder | Soldier 108, legion 540 copper per week; debt first, wage later | Local pay, bonuses, dungeon bounty | The empire pays expenses; gear and quartermaster add to the debt | Hauling pays 55 silver in a day; Castile adds coin from her own purse |
| Free healing for legion | Large cities heal legionnaires without coin | City size, aether stock, healer skill | Healers are legion assets; daily aether is the limit | Potions seal wounds too fast and leave debris |
| Debt-charged issue | New gear charged to debt, old gear swapped free | Quartermaster margin | The Legion holds the supply monopoly in the hall | A commander can pay from dungeon gold |
| Command separation | Mages answer only to Legion officers; dukes command non-mage companies and pay a tax | Flag type, duke or mage | Politics separates noble levy from mage corps | Dukes can still threaten a company with desertion charges |
| Discipline by office | Centurion cuts and executes; duke threatens; tribunal judges political cases | Escape vs desertion vs treason | Mages track escapees in minutes, so flight is impractical | Hound packs are disciplined by their leader's fists |
| Capture by class | Regulars labor, city guards repair, legion executed | Enemy kingdom's policy | The enemy wants an example from the empire's elite | Policy is Castile's statement of habit |
| Guild as a parallel institution | Members rent tablets, shop at about half Imperial prices, sell dungeon goods | Registration fee, local branch | Guild monitors dungeons and holds exclusive sale rights | A clerk or warehouse keeper can make friction |

Reader quirks recorded (WPR19): R3 inferred "64 silver" as a stack of silver when the text says "sixty-four coins" of six large and four small (resolved by arithmetic, V); R1 wrote "bi-monthly" as ambiguous and I left it so; R2 filled many rows with "unit not written" and tagged some [S] by judgment, so its rows were not trusted for price; R4's price rows were opened and confirmed.

## 11. Contradictions and tensions (WPR20)

| Id | Claim A (source) | Claim B | Chosen reading, owner, status |
| --- | --- | --- | --- |
| C1 | Legion term "Just five years" (b1c1 p94, the recruiting magistrate) | A medic pays "ten years in the Legion" for a killed bull (b1c22 p30); a veteran counts pension at twenty years (b1c33 p59) | Both stand: a recruiter's pitch versus debt service versus career. The recruiter's pitch is the weakest witness. Owner: this doc. Open. |
| C2 | Kit card W3-SL inferred copper ledger: meal 2, town bed 6/night, lesson 10, repair kit 15 | Source anchors only: a bath is one silver coin (100 copper, called outrageous), tablet read 1 or 10 silver, soldier pay 108 copper per week | Unsourced, not contradicted: against 108 copper a week (about 15 a day) a 2-copper meal and 6-copper bed look plausible, and the bath and tablet prices are the only anchors; no meal or inn price was found. Keep PROPOSED until one is read. Owner: kit card. Open. |
| C3 | 2026-10-09 private slice: local wage about ten silver (REPORT.md) | Source: 108 copper (soldier) or 540 copper (legion) per week | An adaptation figure disclosed as a proposal; not canon. Owner: private pack. Open. |
| C4 | Kit card W3 uses anonymous original role IDs to avoid naming canon | Source has named cast with locators (Silas, Damian, Castile, Konstantin, Larita, Tarvon) | Both stand for different uses; a pack can use source names with locators or keep original roles. Owner: kit card, K6. Open. |
| C5 | Kit card K7: "punishments need source-qualified law" and "exact source rank names open" | Source: escape and desertion are executed, centurion decides cuts, no sergeant rank, no court-martial in the five held texts | Partly resolved by F12 and section 8; rank ladder still open. Owner: kit card. Open. |
| C6 | Kit card K6.W3-SL6 medic: "request supported treatment" with care stock | Source: legion healing is free in large cities (b2c60 p13), but potions leave debris (p22) | Compatible; adds a free-treatment rule. Open. |
| C7 | Dossier's draft ladder Recruit, Legionnaire, Specialist, Hound/Officer (SERIES_DOSSIER "Growth") | Windows show promotion by assignment (b1c6 p11: promoted to Legion seven weeks early), no rank ladder rules | Dossier ladder stays PROPOSED. Owner: dossier. Open. |
| C8 | Affinity read price: gold in Varvao (b2c70 p03, narrator) | Guild affinity tablet 10 silver | Both stand: city rates versus Guild rates. Open. |
| C9 | Spelling Telhian / Talhian (b1c53 p02, p05; b1c54 p28) | The same people | A spelling variant, not a contradiction: keep both; do not log a zero hit on one spelling. |

## 12. Gaps and unread windows (WPR7, WPR23)

Read: 46,174 of about 838,000 extracted words (5.5%). Zero-hit and low-hit searches run across all five held texts (`chapters.json`, regex, spellings checked): "sergeant" 0, "court-martial" 0, "quartermaster" 1 hit (b2c62 p46, opened), "pay day / payday / paymaster" 3 hits (none about soldier pay, opened), "sutler / camp follower" 1 hit (b5c254 p24, unopened), "infirmary" 2 hits (b1c44 p30 a joke, b2c60 p13), "pension" 5 hits (b1c33 p59 opened), "promotion" 6 hits (b1c5 p180, b1c6 p11, p21 opened). Book 4 text was not searched.

Extraction artifacts to check before the next window: (a) Book 1 chapter keys run 1-6 then 8 and later, with `7` ('Chapter 7: Welcome to the Legion', 56 paragraphs) inserted out of order in my dictionary, so confirm the b1c6/b1c7 boundary before the ranked-next b1c6-c12 window; (b) Book 3 ch181 (12.5k words) merges the epilogue with the separately labelled fan-fiction contest piece, so ch181 locators can point at non-canon text (WA18).

| Gap | Exact window | Why |
| --- | --- | --- |
| Book 4 The Hounds (military entry, Hound training, courts) | Convert `~/Downloads/...Hounds...mobi` with calibre.app's ebook-convert, then ch182-243 | Not extracted; prior notes exist (volume-04-reader/) |
| Recruit life Book 1 ch5-21, ch24-51 | b1c6-c12 (march, rations, riding), b1c13-21, b1c24-29 | Watches, rations, requisition, patrol routines |
| Book 2 city life | b2c71-c101 | Survey mission; lodging; guild jobs |
| Book 3 campaign | b3c123-c125, b3c132, b3c148 | Medical triage, snowshoes, rations |
| Book 5 Adventurers Guild, towns, caravan | b5c247, c265, c268-c270, c279 | Taxes, queues, mounts; census shows coin density |
| Book 6 rest | b6c320-c349, c351-c358, c360, c362, c364-c384 | Training montage (c364), confinement (c372), betrayal (c373), epilogue |
| Camp followers and sutlers | b5c254 p24 | One hit, unread |
| Leave beyond one free day | b1c54 (rest of chapter), b5c270 | Census shows leave-term density |

## 13. More-to-consider round (WPR24)

| Class | Item | Done check |
| --- | --- | --- |
| ACT NOW (done) | Log the C1 term/debt/pension conflict and the C2/C3 price conflicts rather than smoothing them. | Section 11 |
| ACT NOW (done) | Correct R3's silver-versus-coin ambiguity by arithmetic (V). | Section 1 |
| ACCOUNT FOR NOW | Any Soldier slice must use source prices or label its own ledger PROPOSED. | A slice names its price table and cites the locator. |
| ACCOUNT FOR NOW | Book 6 is new; mark everything in W4 as [S] until Weibao says otherwise. | Rows tagged. |
| ACCOUNT FOR NOW | Quartermaster-as-debt, free healing and flag/command tax are mechanisms (a gate, a clock, a role, a cost) not scripts (WPR31, AD38). | Pack rows are data, not scenes. |
| LATER/DELEGATE | Book 4 conversion and a haiku pass on ch206-231 (Hounds). Level haiku, about 12k words. Done check: entry, pay and punishment rows or "not found". | Table plus spot checks |
| LATER/DELEGATE | Book 5 guild pass (ch265, 268-270, 279). Level haiku, about 12k. Done check: taxes, queues, fees. | Table |
| LATER/DELEGATE | Book 1 ch6-12 and ch24-29 for rations, riding, requisition. Level haiku, 12k. | Table |

Suggestions (separate, short): treat quartermaster debt and the tablet cycle as general mechanisms for other military worlds; check whether the Paradise doc already models cut-based training.

## 14. Ranked next list (WPR25)

1. Book 1 ch6-12, ch24-29 (about 12k): ration, requisition and march routine.
2. Book 5 guild and town chapters (about 12k): civilian trades near the army.
3. Book 4 Hound chapters after conversion (about 12k): the only unread military institution.
4. Book 6 ch364, ch372, ch373 (about 11k): training montage and confinement [S].
5. Book 3 campaign logistics (about 10k).

## 15. Review state (WPR21) and follow-ups

Highest state reached: drafted, with 21 claim groups source-spot-checked by the coordinator. Not rules-reconciled in detail. Touched codes: WPR1-WPR32, AU1-AU6, AU13, AU15, WA6, WA8, WA10, WA12, AD38, AD5, PIR for presence (not applied). No conflict with standing direction found; the world stays paused. Nothing here opens a deferred gate.

Follow-ups, not done because the task said to touch nothing else (WPR3, WPR28):
- Link this file from `docs/worlds/world-core-kit-2026-10-14/cards/soldiers-life.md`, `docs/WORLD_CARDS.md` and `docs/research/novels/novel-wave-2026-10-09/soldier/CHECKPOINT.md`.
- Add a Soldier's Life entry to `docs/research/novels/LOCAL_LIBRARY.md` (none exists), including Book 6 and the Book 4 MOBI path.
- Add Book 6 to the prior SOURCE_MANIFEST or a new manifest.
- Put the six-response reader cap and the 60k-context target in the brief itself; R1 to R3 likely exceeded six responses.
- Add a WPR lessons line: a raw-text census chooses windows, but price rows still need coordinator opening; pick one reader tier in the first brief.

## 16. Floor card (WA6)

WA6 says K2, K3, K6, K8 and K13 reach floor before any other part goes past T2. Five records. Evidence labels: SHOWN, STATED, INFERRED, PROPOSED. Current repo coverage is honest: the kit card has INFERRED proposals, the private slice is a dated 2026-10-09 prototype, and nothing is registered in `world_packs` for this world.

### K2: World laws

| Field | Record |
| --- | --- |
| Default | Law is a set of institutional rules, not nature: entry by tablet potential (b1c1 p87), cuts by centurion discretion (b1c3 p199), execution for escape or desertion (b1c2 p15; b2c60 p50), free legion healing (b2c60 p13), debt-charged issue (b2c62 p46; b2c69 p20), mage-command separation (b2c60 p03), capture policy by class (b1c54 p27-28). |
| Dial | Which rules apply by unit, rank, era (peace, siege) and kingdom; centurion discretion; duke tax; debt rate. |
| In-world reason and cost | Mages can track a runner in minutes, so flight is not an option; a centurion trims cadets to lower the cost of ten-times-regular training; a debt keeps soldiers bound; the empire pays expenses. Cost: a cadet cut to the regular army, a commander's reserve seized, a prisoner executed. |
| Source locator and label | b1c1 p87, p94; b1c2 p15, p36; b1c3 p199; b2c60 p03, p13, p50; b2c62 p46; b2c69 p18-20; b1c54 p27-28. STATED/SHOWN, V. |
| Current repo coverage | Kit card K2 lists SL-L1 to SL-L5 as INFERRED engine facts (body, material provenance, faculty, military orders, patrol risk); none cite these locators. DESIGN.md 2026-10-09 sets a local enlistment with deductions declared before consent and an exit; canon obligation has no exit there. |
| Smallest playable slice | One enlistment screen: choose sentence-offered paths (labor, army, Legion) with a pay and term shown, a tablet gate that accepts or rejects, and an execution-for-escape refusal text; data rows for six laws with a locator each. |

### K3: Power core

| Field | Record |
| --- | --- |
| Default | There is a power core: physical stats on a 0-100 human scale with current and potential per stat (tablet); essences in three grades; affinity and spell-forms with a daily aether pool; healing magic. Not an honest absence. |
| Dial | Stat gain per cycle, essence supply and price, aether per day, affinity visibility. |
| In-world reason and cost | A tablet reveals stats and affinity but costs money outside the Legion (b2c70 p03, 1 or 10 silver); essences are sold in gold (1 to hundreds); minor essences need about 30 per stat point below half potential (b1c2 p115); live-target harvest is outlawed (b1c4 p27). Cost: gold, aether, and legal risk. |
| Source locator and label | b1c1 p83-87; b1c2 p113-116; b1c3 p35-91, p178; b1c4 p27; b1c54 p15; b2c60 p22; b2c70 p03. STATED/SHOWN, V (prices), U (tablet series). |
| Current repo coverage | Kit card K3: INFERRED body/skill/essence carriers, no locator-bound numbers; the older dossier carries affinity, potential, tattoo, space rules (INDEXES.md). No runtime. |
| Smallest playable slice | A three-reading tablet: show current/potential for four physical stats, one training cycle raises current, a minor essence purchase raises one stat at a stated cost; no spells. |

### K6: Cast

| Field | Record |
| --- | --- |
| Default | A small named company and a camp staff: commander mage, lieutenant, scouts, medic, healer, cooks, comrades, centurion, magistrate, Guild clerk and shopkeeper, with distinct verbs (command, cut, heal, vouch, sell, pay). |
| Dial | Which unit and period; named source cast versus original role IDs; rank changes friendship terms. |
| In-world reason and cost | Orders flow through officers; mages answer to Legion officers only; the Guild is a parallel patron; a healer's aether is limited. Cost: a cut in favor, debt, a reputation hit. |
| Source locator and label | b1c1 p20-31 (magistrate); b1c2 p15, p36 (centurion); b2c60 p06-25 (healer); b2c69 p18-42 (commander, scout); b2c70 p08-153 (clerk, shopkeeper). SHOWN/STATED, V for roles, U for persons. |
| Current repo coverage | Kit card K6.W3-SL1 to SL6 are anonymous original roles (steward, bunkmate, letterwriter, armorer, keeper, medic) INFERRED; the private slice uses Castile, Delmar and Damian with witnessed memory. Source cast has no repo row. |
| Smallest playable slice | Six people at T2 (centurion, mage commander, healer, scout, Guild clerk, shopkeeper) each with one verb and one price or refusal from section 3; no schedules. |

### K8: Daily life

| Field | Record |
| --- | --- |
| Default | A weekly-paid soldier whose day is set by roll call and drill, with one free day in six weeks; pay 108 or 540 copper a week; baths a silver; shop potions tens of gold; debt first. |
| Dial | Training stage, field versus city, cohort size, local price level, Guild membership. |
| In-world reason and cost | The state pays expenses and holds a supply monopoly; coins separate soldier life from market life. Cost: debt, fatigue, bruising, aether. |
| Source locator and label | b1c1 p28, p94; b1c2 p18-26, p197; b1c23 p32-33; b2c62 p46; b2c69 p42; b2c70 p136-153. SHOWN/STATED, V (money), U (day). |
| Current repo coverage | Kit card K8.W3-SL: proposed copper ledger (meal 2, bed 6, lesson 10, repair kit 15), INFERRED, conflicts with source (C2); private slice ten-silver local wage (C3). No pack rows. |
| Smallest playable slice | A day table for the camp (run, lecture, drill, two free hours), a pay ledger with the 100/100 coin ladder, a bath at one silver and a debt line for gear; no town market beyond one shop. |

### K13: Signature verb loop

| Field | Record |
| --- | --- |
| Default | Train, test, be cut or rewarded, then use the gain on duty: weighted run and drill, a tablet reading every three weeks, combat ranking, essence award, then wall duty or a hauling job for pay. |
| Dial | Cycle length, cohort cut rate, award tiers, duty type (wall, patrol, haul), era (peace or siege). |
| In-world reason and cost | The Legion wants one in three; cuts save money; essences speed growth at a price; duty pays and wears kit. Cost: injury, the cut, debt. |
| Source locator and label | b1c2 p18-36, p112, p185, p196; b1c3 p94-115, p183, p195; b1c22-b1c23 (duty); b1c23 p32 (pay). SHOWN, V (cut rules), U (cycle). |
| Current repo coverage | Kit card K13.W4.SL SL1 loop: roll call, duty and kit, outcome, reconcile, rest, INFERRED and role-anonymous. The source cut-cycle is not represented. |
| Smallest playable slice | One cohort: 100 beds, three tablet cycles with a rank list, a cut and an essence award each cycle, then one duty day with a pay line; a playable loop under WPR30, with a rebuild-and-play check later (WPR32). |

## 17. Independent review and W2 addendum (2026-10-23, successor world-consolidation coordinator (Sonnet 5.5, a different reader than the pass author))

Review state: **source-reviewed** for the rows listed; not rules-reconciled, built or accepted.
Confirmed in a fresh load of the chapter store: b1c1 p22, p24, p27, p28, p32, p87, p94, p98; b1c3 p94, p199; b2c62 p46 (the "twice their worth" phrase is in the text); b2c69 p18, p20, p31, p34-35; b2c70 p03, p15, p17-18, p136-151 (new arithmetic check: 2 expiring cure disease at one gold, 6 ointments at 50 silver, 4 lesser healing at 4 gold, total 21 gold, matches p150); b6c361 p20, p30. No correction needed to the spot-check table.
W2 (one Haiku reader): Book 1 ch24-28, about 10,900 words, results in `passes-2026-10-23/w2/RETURN_S2.md`. New rows: the dungeon share is 75 gold 68 silver each (b1c27 p30), the same amount as b2c69 p34-35 if one large gold is ten gold and one small gold is one gold (inference, not stated); healing book 10 gold normally, 5 offered, protection book 11, both bought for 16 (b1c24 p29-35); tavern meal 14 copper; night patrol rotation 4 stay and 16 go (b1c27 p32); minimum affinity 20 for the self-heal form and 35 for cleanse (b1c25 p52, p55); an archery contest format (b1c25 p61). Zero hits: pay schedule, tablet testing, debt rules, formal punishments, a written cut process in these chapters. Still open: Book 1 ch6-12 (not read; the window had a low pay-term density), ch29 onward.

## 18. W3 rules and runtime reconciliation (2026-10-24, world-readiness coordinator, Sonnet 5.5)

State reached: **rules-reconciled on the cited codes** (WPR21); drafted and source-reviewed rows keep their earlier states; not built, browser-verified or accepted. Proposals stay proposals (AD32). Packet: [FIRST_SLICE_PACKET_2026-10-23](../gm/dispatch/claude-coordinator-continuation-2026-10-23/FIRST_SLICE_PACKET_2026-10-23.md). Ranked dispositions: [GAP_AUDIT readiness round](../gm/dispatch/claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md).

**Disposition: NEEDS SPECIFIC SOURCE (rank 2)**, then mostly READY on existing seams. Codes: AD1, AD5, AD19, AD33, AD38, WA3, WA6, WA8, WA10, WA12, ECR (pay, credit), PIR (not applied). The world stays paused per its kit card; this reopens no gate.
Runtime owners: `obligations_ledger.js` (debt-first pay and kit debt), `economy_standing.js` (loans), `carry_ledger.js`; missing: a term contract with expiry (C3, proposal) for the enlistment choice and a cohort cut cycle. Why not READY now: the floor K13 cut cycle (three tablet readings, one in three kept) is labelled U, there is no meal, inn or rank-ladder price (C2, C7), and pay is two anchors (108 and 540 copper a week).
Exact remaining locators: Book 1 ch6-12 (confirm the b1c6/b1c7 key order first), ch13-21, ch29+; Book 5 b5c247, c254 p24, c265, c268-270, c279; Book 3 b3c123-125, c132, c148; Book 6 c364, c372, c373; Book 4 needs conversion (not acquired here). Default if Weibao wants Soldier first: build the debt-and-pay ladder slice with the cut cycle labelled authored.
