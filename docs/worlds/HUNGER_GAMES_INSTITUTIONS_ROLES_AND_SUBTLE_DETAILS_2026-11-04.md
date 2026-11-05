# The Hunger Games: institutions, roles, subtle details, entry answers and one arena slice (pass, 2026-11-04)

Status: **proposal at pass level; highest review state reached is source-spot-checked (WPR21), partial.** Findings are not accepted decisions and authorize no build, commit to a runtime, or push. Nothing here was built or played. Paraphrase only; no source prose is reproduced. Public canon is not sealed. The slice in section 12 names its hidden facts by ID and route only (AGENTS sealed-secret rule, WPR8); no designed truth was authored or recorded in this document.

Order 6 of the round 12 addendum in the [master playability plan](../MASTER_PLAYABILITY_PLAN_2026-10-25.md): the first consumer of AD50 (a threat that can end a run is a mechanism with exits). Weibao’s sequencing approval is recorded in [USER_VISION](../USER_VISION.md#long-term-horizon-world-enablement-and-complexity-2026-11-04), after current LOTM-first work; it does not adopt every arena proposal. This document edits no AD50 text.

Codes touched (WPR22): WPR1-WPR32, AU1-AU15, WER1-WER17, SR1-SR24, AD5, AD6, AD11-AD13, AD19-AD22, AD32, AD36-AD38, AD43, AD50, AD51, RLEE1-RLEE13, BHR14-BHR17, ST4-ST11, UR/UIV rules not touched (no UI built).

Dependency note: AD50, the [lore sweep](../research/END_RUN_THREATS_LORE_SWEEP_2026-11-03.md) and library entry PH3 were uncommitted in the primary checkout when this was written. Their links resolve once that commit lands.

## 1. Pass record (WPR1)

| Field | Value |
| --- | --- |
| World, part | The Hunger Games (Panem): institutions and roles (WPR9-WPR17), WER1-WER17 per start, one arena slice plan, missing seams |
| Mode | Bounded read (12 windows), then coordinator spot-checks and a code search |
| Output owner | this file (new: no Hunger Games owner existed; a repo search for the title found just the library catalogue and the download wishlist) |
| Budget (declared, finite) | 12 Haiku readers, one fresh context each, at most two at a time, each on one pre-cut window of at most 12,000 source words; no repair readers; then stop. Everything unread is a named gap with its window (section 9) |
| Stop condition | twelve returns reviewed; coordinator opens at most 12 locators |
| Highest review state targeted | source-spot-checked (WPR21). Not built, not browser-verified, no director acceptance (AD32) |
| Sealed secrets | none touched |

## 2. Manifest: edition, windows, budget (WPR2, WPR7, WPR23)

### Edition

Five held EPUBs in the Source Library, found through the [Source Library catalogue](../research/SOURCE_LIBRARY_CATALOGUE.md) (the library index did not carry an entry for them in the branch this pass ran on; PH3 was not found there). Files were registered 2026-11-02 from Anna's Archive. Archive integrity (zip CRC) read clean for all five. Catalogue hash prefixes: *The Hunger Games* `78a74a7bbc`, *Catching Fire* `e6022ed26c` (catalogued as "Catching Fire 2"), *Mockingjay* `bd1a8ba231`, *The Ballad of Songbirds and Snakes* `301c3abdfd`, *Sunrise on the Reaping* `2b7e8b4db9`. Text was extracted in spine order (an earlier alphabetical pass scrambled chapter order and was discarded). Edition identity beyond the catalogue record is not verified. Spelling differs between files (the book 1 and book 2 reader notes use "Centre" and "Center" respectively), so quotes and spellings are not uniform; locators are line numbers in the extracted text, not page numbers.

| Book | Extracted words | Labelled here |
| --- | --- | --- |
| The Hunger Games (B1) | 101,039 | 74th Games, District 12 |
| Catching Fire (B2) | 101,953 | 75th Games (Quarter Quell) |
| Mockingjay (B3) | 100,971 | not read |
| The Ballad of Songbirds and Snakes (B4) | 157,252 | 10th Games |
| Sunrise on the Reaping (B5) | 119,601 | 50th Games (Quarter Quell) |
| Total | 580,816 | |

Private store (gitignored, shared with the primary checkout): `docs/research/novels/hunger-games/private/` holds the five text files, `windows/W1..W12` and `notes/W1..W12_notes.md` (full labelled extractions with locators), plus the extraction script.

### Windows

| Window | Content | Words | Serves |
| --- | --- | --- | --- |
| W1-W9 | B1 consecutively, whole book | about 11,200 each (101,039 total) | reaping, District 12 life, Capitol handling, training, whole arena, victor and aftermath |
| W10 | B2: the Quarter Quell card scene and reaction (L1030-1075) plus the 75th arena opening (L1598-1768), cut at 12,000 | 10,507 | Quell rule, victor draft, a second arena design |
| W11 | B4 opening, lines 1-258 | 11,993 | 10th Games: Academy, student mentors, early form of the Games |
| W12 | B5 opening, lines 1-348 | 11,928 | 50th Games: doubled reaping, District 12 life 24 years before book 1 |
| Total read | | **135,467 of 580,816 (about 23 percent)** | |

### Invocations and usage (AU2, AU4, AU12)

| Item | Count |
| --- | --- |
| Haiku readers (fresh Agent calls, model set to haiku, two at a time) | 12 of 12 declared; 0 repairs |
| Reader cost observed | about 96k to 108k subagent tokens each, 2 to 6 tool uses, 58 to 105 s; about 1.22M tokens total |
| Advisor consultations (coordinator) | 1, after the wave and before writing. The plan was announced in session before the first dispatch but was not saved as a checkpoint until this file (AU2 slip, recorded) |
| Coordinator source reading outside windows | 9 targeted locator opens (section 8) |
| Reader quality | one return mislabelled the span it covered, three returned "contradictions" that dissolved when the locator was opened (section 6). Readers are good at facts and weaker at counting |

## 3. Coverage of the WPR rows

| Row | Covered by | State |
| --- | --- | --- |
| WPR9 Places and facilities | District 12 (Seam, Hob, Meadow, Justice Building, fence), train, Remake Centre, Training Centre tower, City Circle, Launch Room, Cornucopia, two arena designs (B1 W3-W9, B2 W10), the 10th Games amphitheater (B4 W11) | covered for B1; Capitol and other districts mostly unread |
| WPR10 Person-to-person roles | mentor, escort, stylist and prep team, Avox, announcer, host, Gamemaker, Peacekeeper, Careers, ally and debt pairs, producer (B5) | covered for the 74th; mentor role differs by era (section 11) |
| WPR11 Institutions and law | Treaty of Treason, reaping law, travel ban, hunting and theft law versus practice, pre-arena fighting rule, arena rules and their revision, victor exemption | covered; appeals, courts, Capitol civil law not read |
| WPR12 Money, goods, information | tesserae, the Hob and barter, scrip (B5), sponsor gifts and their rising price, betting, broadcast control, record falsification | covered; no coin-to-ration conversion shown |
| WPR13 Time and rhythm | reaping day, train, three training days, interview eve, 10 a.m. start, cannon and sky recap, tesserae on the eighth, victory tour | covered for the 74th; tour and later years unread |
| WPR14 Power and growth | hunting and foraging as survival capital, body mass edge, camouflage, medicine, mutts, armour | partial; no supernatural rank ladder is established here; survival, biotech and institutional mechanisms still operate |
| WPR15 Starts and entry | reaping, volunteering, Capitol arrival, the Academy pairing (B4), victor draft (B2) | partial; section 11 |
| WPR16 Failure, recovery, aftermath | cannon and hovercraft retrieval, the victor's recovery in the Capitol, family punishment risk, Avoxes | partial; Mockingjay-era aftermath unread |
| WPR17 Surfaces | the sky recap, televised scores, the interview stage, the pre-arena reaping broadcast | source-side, no UI claim |

## 4. Findings (coded HG; label and locator on each)

Locators are `Bn:Lnnn` lines in the private extraction. S = shown, T = stated (character or narrator), I = inferred, P = proposed.

### Money and information (WPR12)

- HG1 Entry slips are cumulative and can be bought with hunger: one slip at twelve, rising by one a year to seven at eighteen; each tessera (a year of grain and oil for one person) adds a slip for the year. Examples with checked arithmetic: 20 slips at sixteen and 42 at eighteen fit the cumulative reading. T [B1:L113-114]; arithmetic by coordinator (section 8). The poorest carry the heaviest odds.
- HG2 Grain and oil are collected monthly on the eighth at the Justice Building. S [B1:L304]. A winning district receives food prizes for a year. T [B1:L141]. Winning also changes the winner's household (money and housing). S [B1:L1848, L1798].
- HG3 Barter and the Hob run beneath the law: officials, Peacekeepers, the butcher and the mayor are customers for off-ration game. S [B1:L102, L304, L1549]. The written rule is a death penalty for trespass, poaching and theft. T [B1:L72, L189]. Practice is tolerance. T [B1:L1169]. Both are kept (section 6).
- HG4 Deaths from hunger are recorded as flu, exposure or pneumonia, with starvation left off the record as a rule. T [B1:L185]. The record, not the body, is the Capitol's version.
- HG5 The Capitol edits what districts see: full kill coverage is withheld from home audiences during the Games and the sky shows the dead alone. T [B1:L955]; district-to-district talk may be blocked. I [B1:L1175]. Jabberjay bio-recorders were used in the war. T [B1:L261].
- HG6 Sponsor gifts exist as a priced channel: by parachute, signalled by timing, brokered by the mentor (a character says the escort cannot close a deal). S [B1:L1099]; T [B1:L433, L1025]. Prices rise the longer the Games run. T [B1:L1533]. Premium medicine is far above pooled donations. T [B1:L1533]. A district can pool coins for a gift. I [B1:L1378, Katniss's guess]. A gift can be redirected after its intended recipient dies. T [B1:L1378]. Gift timing is read as a message by the recipient. I [B1:L1808].
- HG7 Scores, kill counts and odds are public so the audience can bet. T [B1:L621, L1396]; the first-day betting peak. T [B1:L941].
- HG8 Scrip (B5): miners are paid in Capitol scrip good mainly at the company store. T [B5:L190]. Cash and bootleg liquor run through the Hob. S [B5:L86-87].
- HG9 In the 10th Games (B4) a Capitol family can be land-rich and cash-poor: sells furniture, borrows against the flat, depends on a tiny pension, and needs a school prize to pay university fees. S/T [B4:L79, L117, L155]. A new Capitol property tax funds rebuilding. S [B4:L153]. Food is rationed there. S [B4:L225].

### Places and institutions (WPR9)

- HG10 District 12: the Seam (mining quarter), the Meadow, the town square, the Justice Building (stage, custody, a velvet goodbye room), the mayor's house with a back door for trade, the Hob in a warehouse. S [B1:L69-71, L103, L136, L208]. The fence is meant to be electrified around the clock but power comes two or three hours an evening. S [B1:L70].
- HG11 Travel between districts is banned except official duties. T [B1:L255]. The fast train reaches the Capitol in under a day. T [B1:L255].
- HG12 Capitol handling is a chain of places, each with an owner: the Remake Centre (prep teams), the Training Centre tower (one floor per district, electric field on the roof), the City Circle (parade and interview stage), the Launch Room under the arena, the president's mansion for the banquet. S [B1:L353, L400, L466, L413, L904, L2170].
- HG13 The arena in B1: a golden horn Cornucopia on a plain, with supplies graded by distance from the centre, mines under the plates for sixty seconds, a lake, forest, a stream, a cave, a grass field. S [B1:L927-928, L1280, L1489, L1731]. B2's arena: a perfect circle of twelve spokes in water, supplies are weapons alone, a force field at the dome edge that hurts to touch and can be used to cook food. S [B2:L1602-1606, L1663, L1714]. B4's early arena: a dilapidated old amphitheater, not a built arena. S [B4:L118].
- HG14 Arenas are preserved and sold as tourist sites. T [B1:L905].
- HG15 Training is a three-day, below-ground gym run by a head trainer, with stations for snares, camouflage, weapons, plants, fire and shelter. Combat between tributes is barred. S [B1:L554, L562, L578]. Careers (Districts 1, 2, 4) train before arriving, which is illegal but common. T [B1:L564].
- HG16 The Capitol Academy (B4): tuition-free, over 400 per class, with a mentor programme where seniors are paired with tributes by the dean. S [B4:L116, L119, L164].

### Person-to-person roles (WPR10)

- HG17 Mentor (74th): a past victor; owns sponsor relations; presents the tribute to patrons; the escort can merely schedule and coach manners. T [B1:L278, L433]. A mentor may be absent, drunk or unpopular, which hurts the tribute. T [B1:L321, L837].
- HG18 Mentor (10th, B4): an Academy senior, one per tribute, five minutes on live TV to present, and may comment during the Games. T [B4:L119, L251]. No sponsor channel or betting was seen in this window. S (absence) [B4:L245-248].
- HG19 Stylist and prep team: the stylist designs the identity (the "girl on fire" tag); the prep team grooms; both are the tribute's first PR. S/T [B1:L350, L389]. Stylists have no say over arena gear and may not bet. T [B1:L907, L918].
- HG20 Escort draws the names, keeps the schedule, coaches manners. S [B1:L137, L427].
- HG21 Avox: a punished person, tongue removed, serving without speaking. T [B1:L446-449].
- HG22 Gamemakers: sit above the gym during private sessions, design traps and control weather, fire, mutts and sky projections, and revise rules in response to the show. S/I [B1:L579, L1047, L1280, L1401, L1757]. Their own security depends on delivering a victor. T [B1:L2070].
- HG23 Announcer and host: separate public voices for rules (announcer) and personality (host, forty years in post). S [B1:L757, L1401].
- HG24 Peacekeepers: escort, enforce, search, turn a blind eye to hunting, whip, shoot into crowds (B5). S/T reader labels [B1:L72, L131; B5:L226-230]; B5:L1168 is an unopened lead outside W12, not inspected evidence.
- HG25 Producer (B5): a Capitol broadcaster shapes the reaping footage, coaches reaction shots, and wants a tearful farewell for viewers. S/T [B5:L249-253, L306-318].
- HG26 Ally and debt pairs: Rue and the District 12 girl (shared knowledge, a gift redirected), Thresh clearing a debt by one act. S/T [B1:L1666, L1378].

### Law, enforcement, aftermath (WPR11, WPR16)

- HG27 Treaty of Treason reading: the Games are a yearly reminder of the failed uprising and the destroyed thirteenth district; the reading is mandatory. T [B1:L138-140].
- HG28 Reaping attendance is mandatory unless dying; absentees are imprisoned. T [B1:L131]. Reaping attendance doubles as a headcount with sign-in. S [B1:L133].
- HG29 Volunteering is allowed for an eligible person of the drawn child's sex. T [B1:L159]. District 12 has had almost none. T [B1:L159].
- HG30 Victors are exempt from the reaping for life (B2 narrates a first breach through the Quell). T [B2:L1058].
- HG31 Death confirmation: a cannon per death, a hovercraft retrieval, a sky recap at night. S [B1:L942, L1113-1115, L1301].
- HG32 The arena has no stated rules except what the Gamemakers announce; they revoke and revise (the two-victor rule appeared and was withdrawn). S [B1:L1401, L2058].
- HG33 Aftermath: a victor is healed and altered in the Capitol, interviewed, banqueted and toured; a displeased Capitol threatens the victor's family and district, the victor too. T [B1:L2086, L2147, L2202].
- HG34 Disorder is suppressed by the fence, the whip and the sniper position on the Justice Building roof (B5). S [B5:L226].

### Time and rhythm (WPR13)

- HG35 Reaping at two in the afternoon, attendance by one. S [B1:L131, L138]. Training days: three; private sessions the last afternoon; interview eve; arena start at ten in the morning because the Capitol sleeps late. S/T [B1:L521, L861]. Interviews run three minutes with a buzzer. S [B1:L760].
- HG36 The nightly rhythm: anthem, Capitol seal, faces of the day's dead, then a quiet. S [B1:L1096, L1301]. Feasts are announced by trumpet. T [B1:L1400].
- HG37 In the early Games (B4) tributes once went into the arena the morning after arrival; the timeline was extended with the mentor programme. T [B4:L251].

### Power and survival subtleties (WPR14)

- HG38 Survival capital from ordinary labour: hunting, snares, foraging, burn care learned in a coal town. S [B1:L1064, L299-302]. Body mass is a real edge. T [B1:L554, L565].
- HG39 Tracker jackers, mines, a drained stream, a fire wall, mutts with dead tributes' markings, armour issued to some: the Gamemakers carry a toolbox of escalations. S [B1:L1047, L1280, L1956, L1992; B1:L2011].
- HG40 Medicine arrives by gift; a sponsor-bought drug cleared a septic wound that leaves and ointment could not. S [B1:L1869].

### Starts and entry (WPR15), failure and surfaces (WPR16, WPR17)

- HG41 Entry is by reaping or by volunteering; the pre-arena sequence is itself the first day. See section 11.
- HG42 Failure routes shown: thirst, heat, wounds, mutts, the Gamemakers' staged pressure, a tribute killing another, and the audience's boredom. Exits shown in B1: death or victory, with one exception: when a rule revision allows two victors. T [B1:L1401].
- HG43 Surfaces in the source: the sky, the screens, the hovercraft, the parachute, the train window, the televised reaping, the live interview. All are shown as viewers' windows into the same spectacle the tribute lives in.

## 5. Engine facts (WPR5: default, dial, reason and cost, exceptions the text shows)

| Fact | Default | Dial | In-world reason and cost | Text exceptions |
| --- | --- | --- | --- | --- |
| Who is eligible | ages twelve to eighteen | age window, volunteer substitution, victor exemption | the Treaty's yearly reminder; the Capitol wants every district afraid | Quarter Quells change the pool (doubling, vote, victors) [B5:L79; B2:L1043-1049] |
| Slip weight | cumulative by year plus tesserae | grain price in slips | hunger turns into risk; the poorest carry it | none seen |
| Mentor | a past victor | an Academy senior (10th), none, or a drunk | sponsors judge the mentor's class | B4 and B1 differ by era |
| Sponsor gift | priced, mentor-brokered, signalled | price rise per day, pooled donors | the audience bets and rewards entertainment | district coin gift (B1:L1378) |
| Arena rules | few, announced by the Gamemakers | revised mid-run | spectacle must continue; the Gamemakers answer to the Capitol | two-victor rule offered then revoked |
| Exits | death or victory | disputed victory, a second victor | the Capitol cannot be seen to lose to the tributes | the berry standoff forced a second declaration of victory [B1:L2076-2080] |
| Hunger | a threat in the district, and an arena pressure | stated as a dial in the arena (water, food) | rationing is a weapon | BHR16 says no hunger death in ordinary play; see section 13 |

## 6. Contradictions and divergences kept (WPR20)

| Code | Divergence | Readings and sources | Status |
| --- | --- | --- | --- |
| C1 | Written law versus practice on poaching and theft | T death-penalty reading [B1:L72, L189] versus T officials buy the meat [B1:L1169, L1549]. Both kept | open, a world dial |
| C2 | Fence design versus practice | meant to carry current all day; two or three hours evenings [B1:L70] | S, kept |
| C3 | Quarter Quell tribute counts | reader flagged "47 against 23". Opening the locator: the narrator counts 47 opponents in the 50th (48 tributes minus Haymitch) against the normal 23 opponents [B2:L1046]. No contradiction | dissolved at locator |
| C4 | A District 4 boy in the sky and in the Career pack | reader flagged. At the locators the District 4 boy appears among the dead and the pack of five is one boy and one girl from Districts 1 and 2 plus one girl from 4 [B1:L956-958, L965]. No contradiction | dissolved at locator |
| C5 | Entry counts (twenty at sixteen, forty-two at eighteen) | reader flagged. Cumulative reading fits all stated figures (section 8) | dissolved by arithmetic |
| C6 | Mentor role, reaping official, tesserae meaning, arena type, sponsor channel in the 10th Games versus the 74th | era differences, not errors: students versus victors, mayor versus escort, a button cube versus a ration, an old stadium versus a built arena, no sponsors seen versus a priced channel [B4:L91, L118-119, L164, L245; B1:L278]. The B4 window alone was read | kept as WER6 era answers |
| C7 | Whether the Capitol planned the two-victor revision | the narrator infers it was bait from the start [B1:L2059]; the text does not confirm. The rule is an actor's claim, not a committed rule (SR5) | I, kept |
| C8 | Peacekeepers and children | a character says Peacekeepers would not murder a child [B1:L1185] right after another character tells of a boy killed for hiding night glasses [B1:L1183-1184] | speaker judgment versus account, kept |
| C9 | Claudius says each tribute has a numbered pack; the table shows four packs | [B1:L1590, L1636] | unverified reader flag, open |
| C10 | Peeta says he has no skill; shown skills | [B1:L529; L537, L539, L578] | self-report versus shown, kept |

## 7. Searches that found nothing (WPR23)

| Search (2026-11-04) | Route | Result |
| --- | --- | --- |
| `hunger games`, `panem` whole-word in `src/` | grep | 0 files |
| `reaping`, `tribute`, `lottery`, `conscript`, `gamemaker` whole-word in `src/` | grep | 0 files each |
| `sponsor` whole-word in `src/` | grep | 13 files; spot reading shows Gu-clan and apprenticeship sponsorship, not audience-funded aid. Not read file by file |
| `audience`, `spectator` whole-word in `src/` | grep | 68 and 6 files; spot reading shows unrelated uses. Not read file by file |
| `arena` whole-word in `src/` | grep | 6 files; combat and cohort battle contexts. Not read |
| `docs/` for a Hunger Games doc | grep | the library catalogue alone and the download wishlist ("held", 2026-10-30). No brief, kit card or subtle-gaps entry |
| Library index entry PH3 | grep in this branch | not found here; the index was being edited in the primary checkout |

"Absent in `src/`" means these terms do not occur, not that no equivalent mechanism exists under other names.

## 8. Source spot-checks by the coordinator (WPR18, WPR19)

| Check | Result |
| --- | --- |
| B1:L113-114 entry rule | confirmed cumulative; twelve gets one slip, tessera adds one per person per year. Arithmetic for the stated totals: five years of slips plus three tesserae a year gives 20 at sixteen; seven slips plus five tesserae over seven years gives 42 at eighteen |
| B1:L1533 gift prices | confirmed: the narrator states that gifts go up in price as the Games continue and doubts pooled donations could buy the drug. The reader's "full meal on day one, a cracker by day twelve" was not found at this locator and is dropped |
| B1:L1378 district gift | confirmed: the bread came from District 11; the coin collection is Katniss's guess; authorisation to redirect is stated |
| B2:L1046 / L1062 / L1603 | counts reconcile as opponents versus total (C3) |
| B1:L955-958, L965 | the Career pack count reconciles (C4) |
| B1:L1758 | confirmed: Haymitch's silence is read as cost or displeasure; the cost is called exorbitant |
| B1:L1166-1185 | HG24 and C8 confirmed as speaker accounts |
| B4:L118-119, L164, L251 | not reopened; taken from the window-11 reader |
| B5:L226-230 | not reopened; taken from the window-12 reader |

Everything else in section 4 stands at reader level (labelled with the reader's S/T/I label). Treat un-reopened B4 and B5 lines as unverified.

## 9. Open gaps with exact windows (WPR23)

| Gap | Window |
| --- | --- |
| Entire *Mockingjay* | B3, 100,971 words: rebellion, the other district, the Capitol, the later Games |
| *Catching Fire* outside W10 | B2 first third (victory tour, district conditions, the rumour of rebellion), the arena after L1768 (clock, fog, allies), and the aftermath |
| *The Ballad of Songbirds and Snakes* after line 258 | B4, about 145,000 words: Gamemaker role, Dr. Gaul's work, the arena, how sponsors and betting began, the end of the mentor programme |
| *Sunrise on the Reaping* after line 348 | B5, about 108,000 words: the 50th's training, mentors, arena, the origins of the gift channel |
| B1 `Hob` rules, black market ownership, Avox origin | not shown in B1 |
| Sponsor identity and prices in coin | not given in any window |
| Any district other than 12 | glimpses (11 orchards, 3 factories, 4 fishing, 1 luxury) |
| Capitol civil life outside the Academy | B4 later chapters |

## 10. Review state (WPR21)

drafted; source-spot-checked, partial (nine locators opened, section 8). Not rules-reconciled beyond the listed codes; not built; not browser-verified; no director acceptance (AD32).

## 11. Starts and the WER answers (WER14)

Era is part of the start (WER6). Canon state differs by era: the 10th Games has student mentors, an old stadium and no sponsor channel seen; the 50th and 74th have a doubled or ordinary reaping, victor mentors, a built arena and parachute gifts; the 75th draws from victors. None of the starts below exists in a pack; every cell is a proposal (AD32).

World-level answers:

- WER1 Panem is a separate world. No notice, ticket or road joins it to another world by implication. A hub premise (the Capitol as a waiting room between districts) is not proposed.
- WER13 The start list is one list; these are tagged new life or visit, none hub.
- WER15 Source and credit: Suzanne Collins, five books held through Anna's Archive on 2026-11-02. Held is not licensed. Take mechanics and shape; write original text and assets; credit the inspiration; licence status unknown (gap).
- WER16 No Hunger Games pack or saves exist, so no compatibility question yet. Gap until a start record is written.
- WER17 Not a hub. The Training Centre and the Capitol are staging places with their own clocks, not a world others are reached through.

| WER code | S1 Reaped or volunteering District 12 child, 74th era | S2 Reaped District 12 child, 50th era (second Quell) | S3 Academy senior paired with a tribute, 10th era | S4 Seam civilian in a year the player is not drawn |
| --- | --- | --- | --- | --- |
| WER2 method | XM8 native-born; crossing dials: XM1 or XM5 into a just-drawn child (P) | same | XM8 native-born Capitol student | XM8 native-born |
| WER3 nine questions | body: a twelve-to-eighteen-year-old, underfed (T B1:L321); memories: native; cheat: AD11 carries; items and money: nothing crosses, one token from home is allowed (T B1:L231); identity: reaping sign-in record (S B1:L133); language: same; who notices: cameras everywhere (S B1:L2217), the audience; former life: continues if a crossing (AD12); obligations: family, tesserae | same, plus doubling and Haymitch-era neighbours | body: well-fed Capitol teen with a debt-laden family (S B4:L79); notice: the dean, the school, a tribute; obligations: a school prize and family money | body: a fit or sick adult or child; obligations: household, mine, tesserae; reaping is an annual threat to the household |
| WER4 real mechanism | reaping is a televised lottery with a volunteer path (T B1:L159); late books add a victor draft (B2) and a doubled draw (B5) | doubled draw already in B5 | a dean pairs by slip (S B4:L164), strings may be pulled (I B4:L175) | the lottery as a yearly draw (T) |
| WER5 canon route | Katniss's route is a volunteer for a sibling, offered next to a neutral reaped start | Haymitch's route is reaped; offered next to a volunteer | Coriolanus's route: mentor a District 12 girl; offered next to neutral pairing | no canon route |
| WER6 era | 74th: mentor is a victor; priced sponsor channel; built arena | 50th: second Quell, doubled reaping, Capitol producer shaping the footage | 10th: student mentors; old stadium; no sponsor channel seen | any year; yearly threat |
| WER7 origin fits | native-born by default; a crossing from another world uses XM1 or XM5 and pays the former life's state (AD12) | same | native-born by default | native-born or XM8 |
| WER8 body and host | age, sex, family and tessera count decide slips; shown before confirming | same | Academy senior with family money pressure | declared |
| WER9 what carries | world crossing uses its declared method; arena intake separately restricts carried gear/token | same, with selected-era intake | declared crossing and Academy property, not automatic arena confiscation | declared crossing and household property, not automatic arena confiscation |
| WER10 age | default twelve to eighteen (dial: a Quell changes the pool); a young-body start (YS tiers) | same | senior student (about eighteen) | any age; children still face the lottery |
| WER11 beside protagonists | default: beside Katniss and Peeta; dial: replace a tribute or follow the 74th as lead (the be-seat default of WER11 and the private direct-adaptation pack apply) | beside Haymitch | beside Coriolanus and Lucy Gray | beside |
| WER12 how the world reads an outsider | audience/camera or other observers notice by their actual means; a quiet crossing is not guaranteed unnoticed | same | the dean and Gamemakers watch the school | quiet |
| WER14 | this table | this table | this table | this table |

S5 (victor drafted back for the 75th Quarter Quell) is a named gap: only the card reading and the arena opening were read. S6 (a Mockingjay-era life) is a gap (entire book unread).

## 12. Arena slice plan (SR1-SR24 and AD50)

Planning only. Nothing here is built, and no part of it is promoted to a required gate.

**Name:** the dry-season arena, one tribute, three played days.

**Target viewport and visible outcome (AGENTS standing UI priority):** desktop or laptop first (1440 by 900 target). The player sees a map region, their water and food state, a sky recap each night, a mentor message line, and a gift ledger. Mobile is deferred.

**World fit (SR1, SR2, SR3):** an original arena in an original region, because canon fill must stay within permitted places and the book 1 and book 2 arenas are canon geography. It borrows only the source's mechanism: the Gamemakers control the environment and revise it for spectacle (HG22, HG32, HG39). Its purpose, past and present condition fit: a decommissioned reservoir basin with a rim forest, a supply ring on a central plain, a visible lake and a seasonal creek. Unknown past may remain unknown (SR2).

**Owners and consumers (SR4, SR12, SR23):** water is a stock with a source, a purifier need and a drain clock; the creek, lake and sap-tap are three sources. The sponsor ledger reads from a new audience-attention number (seam M1). The Gamemaker clock reads from the same number. Others in the field are an aggregate pressure counter plus three authored named rivals; no per-contestant simulation (NPC-heavy simulation stays deferred, SR4).

**Run-ending threat (AD50), T-HG1: the water withdrawal.**

| AD50 field | Content |
| --- | --- |
| Actor or force | the Gamemakers (HG22), acting on a boredom trigger |
| Trigger (RLEE1) | after the second night, the creek is drained if the audience-attention number has stayed low for N ticks without a cannon (N is a dial). The world treats a dull day as a reason to apply pressure (S B1:L1047, L1956) |
| Warning by means (RLEE2) | day-two flow drop and mud cracking visible to anyone who looks; animals move toward the lake; a mentor message arrives by gift timing if the player has a mentor channel (I B1:L1808); knowing the Games' habits (training knowledge) reveals the pattern in plain words |
| Near-end default (RLEE6) | collapse from dehydration, extraction by hovercraft with a Capitol patch-up and a debt to the show (a sponsor ledger entry and a loss of position). Proposed, not canon: B1 shows death or victory only (HG42) |
| Full end | a high dial: death by thirst, announced beforehand, reload kept unless the player chose stricter (AD50, AD19, AD21). Needs Weibao's direction against BHR16 (section 13) |

**Authored exits, four on different means (AD50 floor is two):**

| Exit | Means | Reader and what it costs |
| --- | --- | --- |
| X1 Buy water | resource: gifts through the mentor, price rising with each day (HG6) | spectacle may attract donors, but actual available funds, mentor choice, priced stock and delivery determine the gift; attention alone is not payment (HG6, S B1:L1737) |
| X2 Find another source | knowledge: reading terrain, tracks and plants to locate a spring, or tap sap from a tree (a sap-tap gift is shown in B2 W10:L1747-1754) | the discovery follows SR6: a lead, a location, an entrance and a usable method are separate; the exact spring is sealed as **HG-S1**, route: tracking and foraging skill, discovery by scouting the rim |
| X3 Bind an ally | relationship: an authored local-wise rival trades knowledge or a purifier for protection; the debt is cleared by one act, as Thresh does in the book (T B1:L1666) | the ally is real to later days: a later actor may redirect a funded gift or form a grudge for a supported reason; neither follows automatically from death (HG26) |
| X4 Wait and thin | time: ration and shelter until pressure shifts the show to another event | the Gamemakers escalate instead (fire, storm, mutts, HG39); waiting works when the player can survive the escalation |

**A capable character can use the threat (AD50 lever):** a player with audience capital and nerve can force a public standoff that costs the Gamemakers a clean ending (the book's berry scene: both threats of ending the run publicly, T/S B1:L2076-2080), or divert the drain to starve the rival pack. Exploiting is priced: the Capitol anger reaches the tribute's household and district (HG33, S B1:L2147), and heat, adaptation and legend answer repeat use (ABUSE T4-T6, T11-T12). Hard termination stays a high dial. Other plans that reasonably work by the mechanisms in play also work (AD5, AD38).

**Sealed IDs (WPR8):** **HG-S1** alternate water route (discovery: scouting, tracking, foraging); **HG-S2** the Gamemakers' escalation trigger (discovery: observing patterns across days, the mentor's message, or the training Gamemaker's behaviour). The public trigger examples above are nonbinding proposals, not selected HG-S2 truth. The truth for each ID is to be authored in the gitignored private pack at build time and is not in this document, the commit message or the report.

**Rule coverage:** SR5 (announced rule changes are claims by an actor, not committed truth), SR6 (separate lead, location, extent and method), SR10 (the warning in T-HG1 is a reachable clue, not a packing list), SR11 (approaches follow means), SR13 (inspection costs no stock), SR14 (continuation, withdrawal and aftermath declared before start: extraction, debt, mark), SR20 (renewal and change have a declared cause and clock: the drain clock; reloading is not a cause), SR22 (commitments persist: gifts bought, water carried, debts), SR24 (documentation is not play).

**Deferred and dependent:** the forced-participation start (seam M2) can be stubbed by starting directly at the arena plate for the first slice; the audience seam M1 and the Gamemaker actor M3 cannot. Done checks, when built, in order: rebuilt at 1440 by 900 in a headless browser from a fresh origin; walk X1, X2, X3 and X4 once each on a seeded run; confirm the drain clock does not restart on reload; save, reload and import mid-drought; confirm the preview of the next day does not roll; confirm HG-S1 and HG-S2 do not leak into any tooltip, count or error text. Nothing here is implemented, so no floor label applies yet (AD43).

## 13. Missing seams (named, with the search that shows them)

| Seam | What the source needs | Present in repo by search (section 7) | State |
| --- | --- | --- | --- |
| M1 Audience or sponsor | an unseen audience whose attention funds help, priced rising by time, brokered by a mentor, read through gift timing (HG6, HG7, HG17, HG25) | no audience-funded aid; `sponsor` in `src/` is Gu-clan sponsorship, spot-read, not file by file | absent |
| M2 Forced-participation start | a lottery with weighted entries bought with hunger, a volunteer substitution, an age window, a travel ban, a headcount record (HG1, HG28, HG29, HG11) | `reaping`, `lottery`, `tribute`, `conscript` have zero hits in `src/`; ST4-ST11 cover inherited starts, not drawn ones | absent |
| M3 Environment-controlling actor | an agent with a clock that escalates pressure, revises announced rules, and answers to a higher power (HG22, HG32, HG39) | `gamemaker` has zero hits; SR5 and RLEE rules cover the claim and the threat shape, not the actor | absent |
| M4 Aggregate field | twenty-odd other contestants as an aggregate with a few named people, cannon and sky recap | NPC-heavy simulation is deferred (SR4); cohort battle code exists, not read | partial or absent, unread |
| M5 Victor aftermath | exemption, mentoring, the tour, being drafted back, family leverage (HG30, HG33) | persistence of obligations exists in other rule sets; none read for this | unknown |
| M6 Broadcast surface | the sky recap, televised scores, the interview stage as UI | no UI built; UI rules apply (WPR17) | absent |
| M7 Hunger and thirst as lethal pressure | BHR16 states no hunger death as the ordinary case under AD5; an exception needs Weibao's direction plus an in-world reason and forewarning | accepted rule exists; no Hunger Games exception recorded | **ACCOUNT FOR NOW:** default to the near-end of T-HG1; the full-end dial needs Weibao's yes before it is built |
| M8 Young-body starts | ages twelve to eighteen (WER10, YS tiers) | partial; not read for this world | partial |

## 14. Difficulty note (evidence-labelled; unknown stays unknown)

- **Rated before this pass:** unknown, because no design or institutions document existed (session brief).
- **Source readiness (shown):** the 74th Games and its aftermath are read in full (B1, 101,039 words). The 75th and the 10th and 50th Games are read at the opening alone (about 23 percent of the corpus overall). Mockingjay is unread.
- **Repo readiness (shown by search, section 7):** no reaping, tribute, lottery, conscription, Gamemaker or Panem term exists in `src/`; `sponsor` and `audience` exist under other meanings.
- **Seams (shown by search, inferred as work):** at least M1, M2 and M3 are absent; M4-M6 are unread or absent. The lexical search does not determine whether a seam needs new code, shared-seam adaptation or world data; inspect producer/state/consumer before selecting work. This points toward a medium-to-large cost, but no effort, token or hour figure was measured and none is claimed.
- **Playability risk (inferred, not tested):** the slice relies on an invented arena, not the canon one, to stay within SR1; whether it plays as "the Hunger Games" is a taste question for Weibao.
- **Overall difficulty: unknown.** The first measurable datum would be a built T-HG1 with M1 and M3 in minimal form; until then every difficulty figure is a guess.

## 15. More to consider (round 1, WPR24)

- **ACT NOW (done here):** the seam list, the dissolved reader flags, and the BHR16 conflict are saved in sections 6 and 13.
- **ACCOUNT FOR NOW:** the annual reaping is itself an AD50 candidate for a life (possible routes: qualified volunteering, a supported negotiated intervention, or costly escape; a tessera choice changes odds rather than securing an exit, and B5:L291 bribery remains reader-level evidence). It needs M2 and is a better second slice than a new arena.
- **ACCOUNT FOR NOW:** era is a first-class dial. Student mentors without a sponsor channel (10th) and victor mentors with one (74th) change the whole player role; a slice should name its era in its start record.
- **LATER / DELEGATE:** read the remaining windows in section 9 in this order: B4 after line 258 (how sponsors, the Gamemaker role and betting began), B2 first third and after L1768, B5 after L348, then B3. Suggested capability: Haiku readers on 12,000-word windows, Sonnet synthesis; small to medium effort; done when each window has a labelled note and the open items in section 9 are closed or restated.
- **LATER / DELEGATE:** a district survey (Districts 1-11) to give S4-style civilian starts a livelihood for each, from B1-B2 glimpses plus B3.


## Content reconciliation B607: approved sequencing and arena evidence

F1: Full actual review covers312lines, HG1–HG43, seven engine-fact rows, C1–C10, every source/search/review/gap table, WER1–WER17/S1–S6, T-HG1/X1–X4/HG-S1/HG-S2 and M1–M8. Book totals580816and selected135467words sum correctly: one whole first book plus three selected later-book windows, not23percent of every book. Source catalogue prefixes identify supplied editions; integrity/spine extraction, reader labels, coordinator source checks and adopted game rules remain distinct. Seven table groups are marked reopened and two explicitly not reopened; a headline nine opens is a historical invocation claim, not nine independently confirmed table rows. No raw book body or live holdings was newly checked here.

F2: USER_VISION's November4 horizon record explicitly preserves approval of five sequencing changes including this slice after current LOTM-first work. It does not approve the whole horizon, lift WR9, license a download, or accept every proposed arena/exception. Update the master's stale approval question and its obsolete Hunger Games lacks-institution-doc example; retain unproved foundations/current-runtime claims as dated snapshots. This is owner reconciliation, not new gameplay dispatch or commit authorization. The institution pass's own approval statement has a matching user-direction owner, rather than relying on an agent's assertion.

F3: The source's tessera entry weights, current count versus cumulative years, participants versus opponents, eligible volunteering and era-specific victors/student mentors remain separate. Law, tolerated poaching, official starvation records, body condition, private belief and propaganda differ. Exact B4/B5 openings do not establish absence of later sponsor systems or all-era entitlements. HG24's B5:L1168 is outside W12's1–348 coverage and stays an unreviewed locator lead. C9's pack discrepancy remains unopened; self-report versus shown skill and intended fence duty versus actual electricity are compatible observations. Claims about all of B1 lacking a rule need a source question, not a new verified absence.

F4: Audience attention, actual donor funds, mentor mediation, affordability, available stock, delivery, intended recipient, received item and inferred gift message are distinct. A public spectacle can motivate aid without directly paying a gift. Pooling coins in the cited district gift is Katniss's guess. Source quotes do not fund an authored sponsor ledger; sponsor and Gamemaker consumers can read related evidence without one magic number replacing their actors. A former ally's death does not automatically create a redirected gift or another actor's grudge. Reduction in lottery odds is risk mitigation, not a secured exit from a draw. Keep funding, custody and actor reasons explicit.

F5: Source reaping/arena carry restrictions are not universal world-crossing laws or automatic civilian/Academy currency wipes. Quiet arrival does not guarantee no observer notices. Pre-arena schedule, scenario context, ordinary civilian life, selected arena body/skill and later aftermath stay distinct. No supernatural rank ladder does not mean ordinary survival, biotech and institutional systems are absent. Exact-term code searches cannot prove missing equivalent seams; zero-hit names and unread analogous code establish current consumer/proof gaps rather than mandatory fresh modules. AD51 favors inspecting shared seams before selecting a mechanism.

F6: Preserve the proposed three-day1440x900arena, four different-means routes, nonlethal near-end, actual warning/stock/clock/aftercare, persistence checks and source/canon distinctions. BHR16 retains comfortable ordinary unfed play; hunger-lethal exception lacks specific recorded direction. BHR18 retains reviewable away boundaries; source deaths do not bypass that policy. AD50's open reasonable plans and capable counterplay remain distinct from a fixed answer list. Public trigger examples are nonbinding authoring candidates; HG-S1/HG-S2 remain ID/route/status only until actual private truth is authored, without claiming a playable secret or discovery path already exists. Original geography and abstract rivals are this proposal, not unavoidable source-derived implementation requirements. No native/browser/build/runtime/save/human proof, new source reading, worker, acquisition, delete/move, commit or push occurs.
