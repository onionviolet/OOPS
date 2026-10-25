# Mother of Learning: institutions, roles, subtle details and floor card (2026-10-23)

Research and proposals, not accepted decisions and not implemented. Pass: WPR9-WPR17 (places, roles, institutions and law, money and information, time, power subtleties, starts, failure, surfaces) plus a WA6 floor card (K2, K3, K6, K8, K13). Mode: reuse-and-check plus bounded read (WPR1). Owner file: this one, created by instruction (WPR3). It is not yet linked from the MoL WORLD_BRIEF or the kit card because the task said to touch nothing else (see section 15). Review state reached: drafted, then source-spot-checked by the coordinator on 28 claim groups (WPR21). Not rules-reconciled, built, browser-verified or director-accepted. Sealed secrets: none touched; mid and late story material is tagged [S] and stays in the private store (WPR8, WA11).

Spoiler tags: [S] marks the loop's cause, the antagonists, the aranea massacre, simulacrums and anything later than the first third of the book. Everything else is early-book ordinary-life material.

## 1. Source, edition, tier and budget

**Edition.** Held English EPUB "Mother of Learning - nobody103.epub", Calibre ID 21, live path `~/Calibre Library/nobody103/Mother of Learning (21)/`. sha256 e53f95695730fd58b70c9676f03cd2ee457521c60210515cea38c1a514aa2fcf (recomputed today; matches the repo pack's source hash and the full-book dossier). Supplied WebToEpub compilation with Royal Road source URLs and metadata date 2022-04-29: qualified provenance, not an authenticity certificate. 106 chapters plus Epilogue; my extraction counts 805,509 words including chapter labels, the dossier counts 804,945 story words. Two path sources are stale and both point at `~/Sync/CalibreLibrary/`: `docs/research/novels/LOCAL_LIBRARY.md` and the full-book dossier script `read_source.py` (WPR23). The Information page is paratext, not story.

**Name check (WPR23).** The academy is "Cyoria's Royal Academy of Magical Arts" (c001 p68, c005 p35, c014 p28). The brief's wording "Cyoria Imperial Academy" is not in the text; "imperial" in the book belongs to the old Ikosian empire and its artifacts. Use Royal Academy.

**Tier of MoL in the repo.** A kit card exists (consolidated W1-W20 proposals; floors mostly "partial" at D and R, none certified). A completed 107-item full-book dossier exists in the gitignored store (`docs/research/novels/full-book/mother-of-learning/`: PEOPLE, POWERS, WORLD, TIMELINE, claim index, reader notes by range) and a 2026-10-10 reader set (`mother-of-learning/readers-2026-10-10/` MAGIC_SYSTEM, LOOP_INERTIA). Code: six `src/book_world_mol_*` leaves and `src/world_packs/book_mol_pack.js` implement an original independent-visitor campaign in Cyoria (nine people incl. one original adversary, seven locations, a keyed-lamp craft loop, a sewer-hatch retrieval). This pass did not rerun any of that. No WPR completion level C0-C5 is assigned here.

**Reused first (WPR2).** WORLD_BRIEF, the kit card (K1-K18 floor rows, W3/W4/W14 rows, contradiction register), the dossier's WORLD.md and PEOPLE.md and the reader notes for chapters 1-5, 6-20, 21-35 (claim ledgers with `MOL-Cnnn-nn` IDs), MAGIC_SYSTEM sections 1, 4 and 6, and the reference passes for LOTM and Reverend Insanity (structure).

**Why these windows (WPR2, gap named for each).** Census first, then the gap test against the dossier ledgers, because a census finds where words are dense, not where notes are weak. The dossier already covers these chapters at claim level (MOL-C001-05, C002-04, C002-13, C006-03, C014-02, C015-04, C027-03/04 and others), so a reread was justified only by procedure and numbers the claims omit: who sets a rule, the unit of every cost, the exact schedule, what a mistake costs and what repeats.

| Window | Source span | Words | Form | Named gap |
| --- | --- | --- | --- | --- |
| W1 (pilot) | c001 p75-end, c002 p1-180 | 11,978 | consecutive | Academy intake procedure: badge, housing key, mentor quota, electives, job board and points, classes, cafeteria, staff |
| W2 | c006 whole, c010 p1-108 | 11,624 | excerpts: two whole non-adjacent chapters | Library employment and divination training, second-restart changes, shaping-book pace, what repeats |
| W3 | c014, c015 whole, c016 p1-37 | 11,999 | consecutive | Lodging and rent, household roles, station prices, police outreach quota, detective-tutor, Guild and police jurisdiction |
| W4 | c026 p234-248, c027 whole, c032 p1-108 | 11,983 | mixed: one short slice, one whole chapter, one partial chapter | Spell-rod trade, Guild badge and permits, rural job board, priest-tutor terms, Guild and soldiers arriving |

Total read by readers: 47,584 words by script (about 5.9% of the story), all whole-paragraph extraction with `[cNNN pNN]` locators, no keyword excerpts. Script counts exclude locator tokens; `wc -w` on the window files reads about 49,700 because of them.

**Budget (declared finite plan; WPR7, AU2-AU6, AU10).** Coordinator (Sonnet 5.5) plus 4 readers, each a fresh Agent call with model "haiku" set in the first brief, one at a time, each on one disjoint window of at most 12,000 words, locators in every paragraph, each brief carrying a capsule of located known claims (under 300 tokens) so rows were labelled NEW, CORROBORATED or CONTRADICTED. W1 was the pilot (AU4); its form was reused unchanged. Reader output form: institution or role, cost and units, access, tiers, hazards, locator, label, uncertain terms (fixed). Repair reserve 1; used 0. Invocations: 4 of 4 readers, 0 of 1 repair, 1 advisor call before windows, 1 advisor call before closing. Each reader made 3 to 7 tool calls and returned a file plus a short digest; none needed a rerun on a stronger tier. Reader returns R1-R4 and the extraction scripts are kept in the gitignored store `docs/research/novels/mother-of-learning/passes-2026-10-23/` (not the scratchpad): `extract.py`, `build_windows.py`, `chapters/` (per-chapter locator text), `census.json`, `window_W1..W4.txt`, `R1.md..R4.md`.

**Coverage statement (WPR7).** Read by Haiku readers: chapters 6, 10 (p1-108), 14, 15 whole; c001 p75-end; c002 p1-180; c016 p1-37; c026 p234-248; c027 whole; c032 p1-108. Opened by me: the locators in the section 1 spot-check table, plus searches run over all 107 chapters (census and zero-hit checks). Everything else rests on the dossier and is cited as such. Unread truncated tails, named as gaps: c001 p1-74, c002 p181-197, c016 p38-end, c032 p109-end.

**Source spot checks by the coordinator (WPR18-19).** I opened each locator in the extracted source and compared it with the reader row or the repo claim. Every price, fee and rate in the tables below was opened by me or is marked U.

| # | Claim | Locator | Result |
| --- | --- | --- | --- |
| 1 | Guild badge at the Teshingrad office costs half of Zorian's savings; ready in two days; clerk will not lower the price; Ilsa's earlier description "so expensive" | c027 p29, p41, p43 | Confirmed. No currency or sum written. Three days of odd jobs on the board filled the wait (p42). |
| 2 | Badge needed only to sell magical services; academy will vouch otherwise | c001 p81 | Confirmed (claim by Ilsa). |
| 3 | Student jobs are posted by mages, payout "generally miserable", students must collect points, most start in fourth year | c002 p80 | Confirmed (narration). Points quota and what one point is: not found. |
| 4 | Mentor quota full except Xvim; no transfer; weekly meetings | c001 p88, p90, p95, p96 | Confirmed. Reader and dossier agree. |
| 5 | Electives: at least three, at most five; switch allowed in the first month | c001 p99 | Confirmed (claim by Ilsa). |
| 6 | No academy housing with a younger sibling; Ilsa offers a friend's house; rates "reasonable" but "a tad expensive" | c014 p19-21, p31 | Confirmed. The money word is "piece", unit unnamed. |
| 7 | Savings refill when the month restarts | c014 p117 | Confirmed (narration, Zorian's private thought). |
| 8 | Police outreach: "extra pay" is "a pittance"; the speaker is the detective, not a patrol officer | c015 p69, p71 | Confirmed; reader correct. |
| 9 | Detective Haslush "poses as an unkempt civilian tutor" (dossier C015-04) | c015 p46, p51; c016 p39 | **Half right.** He introduces himself as a police detective sent by Ilsa as divination instructor (c015 p46), so "civilian tutor" is wrong. The deliberate scruffy look is right: he says he cultivates an unflattering front to put people at ease (c016 p39, claim by Haslush, V). See C1. |
| 10 | Spell-rod shop in Cyoria: legal rods limited without permits; Guild watches rod sales; lethal rods refused | c026 p241, p243 | Confirmed. No prices written. |
| 11 | "500 silver coins" for a teleport to Zixia | c064 p173, p176 | Confirmed as a price from a broker to a simulacrum on a foreign trip [S, mid story]; "broker" is my inference, the text only shows a tattooed man selling the teleport. Also: every country has its own currency and Eldemar paper bills do not travel (p176). |
| 12 | Rod missile shots: Zorian empties after eight shots; Zach used three or four times Zorian's maximum | c002 p172-173 | Confirmed (narration). |
| 13 | Average mage 8 to 12 missiles, gifted 20 to 30, ceiling about 4 times the start | c008 p46 | Confirmed (booklet, via narration). The 232 figure is at c008 p48. |
| 14 | Magnitude 20 as the guessed point where fine control suffers; Zach "low 60s" | c022 p57, p59 | Confirmed as Taiven's guess and narration; MAGIC_SYSTEM's "magnitude 50" for Zach is a different line (not opened). |
| 15 | Shaping book pace "6 per year" for most students | c010 p56 | Confirmed (claim by Ilsa, narration). |
| 16 | Loop ends at 2 past midnight on festival night; consistent across 4 restarts | c006 p158, p161 | Confirmed (narration). |
| 17 | Storm hits Cyoria on the first day of every restart | c027 p40 | Confirmed (narration). |
| 18 | Library staff must be first-circle mages; pay low; budget cut | c006 p53, p56, p57 | Confirmed (claim by Kirithishli). |
| 19 | Housing door key opens only with the owner's mana | c001 p84-85 | Confirmed (Ilsa explains, narration shows the glow). |
| 20 | Class rep demands arrival 15 minutes early | c002 p105-108 | Confirmed (claim by Akoja; not shown as academy rule). |
| 21 | Priest tutor: protective rituals up to 2 hours to cast, last weeks; evening attendance and free courier errands | c032 p58, p74, p76 | Confirmed (claim by Alanic). |
| 22 | Alanic's vouching stops Guild battlemages taking Zorian in for questioning | c032 p107 | Confirmed (narration plus Zorian's inference of "pull"). |
| 23 | Shield held by spending half his reserve against the ambush | c032 p95 | Confirmed (narration). |
| 24 | Eldemar paper bills hold no value abroad; web treasury holds paper notes and metals | c064 p176, c043 p113 | Confirmed. |
| 25 | Expelled student fights a tuition claim after a hearing | c095 p15-17, p27 | Confirmed that "tuition" exists as a paid sum; amount not written [S, late]. |
| 26 | Currency names | whole book | `krona`, `florin`, `ducat`, `shilling`, `stipend`, `curfew`, `postbox`: zero hits. The plural "crowns" occurs once in the whole book, as crystallized-mana headwear in a children's game (c043 p128); the other 115 "crown" tokens are the royal Crown or regalia (sample of 8 opened, not all 116). Currency words that exist: "silver coins", "gold coins" (c083 p111, a treasury image), "pieces" (c014 p31), "paper notes" (c043 p113, c064 p176), "bronze"/"silver" as metal colours elsewhere. |
| 27 | Station shops "massively overpriced" because of location | c014 p85 | Confirmed (narration). |
| 28 | Home repo currency "crown" | `src/world_packs/book_mol_pack.js` lines 102-304, 1148, 1522, 1868, 2534, 4763 | Confirmed: crowns are an authored unit in the repo (see C2, C3). |

Not opened by me (marked U below): the stairwell rats (c001 p140), Akoja and Briam familiar rules (c002 p115-119), Essential Invocations schedule wording (c002 p104 versus p161), the 60-question formula test (c002 p176), the Cyoria teleport beacon (c026 p239), rural mana "couple of hours" (c027 p68), Rank 2 well (c027 p79), Haslush's tavern spell and compulsion test (c015 p61, c016 p8-20), mentor drill details (c015 p2-19), and all Black Room, simulacrum and marker material.

## 2. Places and institutions (WPR9, WPR11)

Labels: SHOWN (scene), STATED (narration or character says it; "claim by NAME" when a character), INFERRED, PROPOSED. V = opened by me, U = unverified. Reader row IDs in brackets.

| Place or institution | Who runs it and where | Cost and units | Access | Tiers, limits, hazards | Locator, label, check |
| --- | --- | --- | --- | --- | --- |
| Royal Academy of Magical Arts (Cyoria) | Academy staff; Ilsa Zileti acts as representative and teaches Essential Invocations; a headmaster exists | Tuition is a paid sum (c095 p16 [S]); no figure. Third-year housing "free" per narration (R1, U) | Certified first-circle students; year 3 adds mentor, electives, more library | Year 3: 3 to 5 electives, switch in the first month; mentor weekly; school-wide refit before the festival | c001 p75-99; c002 p5. STATED. V (electives, mentor); U (housing free) |
| Certification and badge (Mage Guild) | Guild issues the physical badge; academy proves status on request | Badge "pretty expensive" (Ilsa); at the Teshingrad Guild office half of Zorian's savings, 2 days to make, price not negotiable; unit and sum not written | Anyone certified; any Guild office, larger cities and regional centres have one | Needed to sell magical services; carries an embedded formula; skipping it means the academy vouches | c001 p81; c027 p29-31, p41, p43. STATED/SHOWN. V |
| Certification pass rate | Academy exam; about a quarter of a year group did not return, civilian-born more often (Benisek's report) | No fee given | Year 2 students | Failure ends the path | c001 p80, c002 p64 (R1). STATED. U |
| Third-year housing | Academy | "free"; outside flats "severely overpriced" (R1) | Third-years; door key reacts only to the owner's mana | Records show two prior years; no sibling allowed | c001 p83-85, p167; c014 p19-21 V. STATED. V (key, sibling) |
| Mentor system | Academy; mentors full except Xvim Chao | No fee | One mentor per third-year, weekly meeting; choice by turn order, no transfer | A late visit cost Zorian his choice; Xvim called harshest by gossip, "least burdened" by Ilsa | c001 p88-96. STATED. V |
| Job board and points | Academy administrative building; posted by city mages | Payout "generally miserable"; number of points required not stated | Any student; most start in year 4 | Cheap jobs the city mages avoid; sewer retrieval jobs need a team of four | c002 p77-88. SHOWN/STATED. V (p80) |
| Class day | Teachers: Ilsa (Essential Invocations), Kyron (Combat Magic, ex-battlemage), Nora Boole (Spell Formulas, Advanced Mathematics), Zenomir Olgai (history and law), Nirthak (nonmagical combat) | No fee | Year-3 students | Weekday rhythm; class rep Akoja Stroze keeps the roll; rod practice drains a student in 8 shots; reading and test loads per teacher (R1) | c002 p104-180. SHOWN. V (p108, p172-173), U (test sizes) |
| Student cafeteria | Academy | "cheap yet surprisingly edible"; no price | Students; richer students eat at restaurants nearby | Meat portions grow before the festival | c002 p5-6. STATED. U |
| Academy library | Librarian Kirithishli Korisova, assistant Ibery Ambercomb | Employee pay low, no number | Staff must be first-circle mages; flexible student hours; deeper levels for Guild mages and restricted spells | Divination book-finding is taught to long-term staff over "at least a couple of months" (R2, U); donated collections are triaged because shelf space is finite (dossier C015-02) | c006 p53-57 V; c006 p80-87 U |
| Cyoria city police (department) | Police; a commander sets outreach quotas; detective Haslush Ikzeteri | "Extra pay" for outreach called "a pittance" | Mage police recruit students | Quota backlog is why Haslush takes the tutoring case; Guild and police jurisdiction overlaps (Guild leader wanted to take Zorian in for questioning, Alanic stopped it) | c015 p46, p69-71 V; c032 p105-107 V. STATED/SHOWN |
| Mage Guild | Regional offices; battlemage squads; permit and category rules | Badge as above | Certified mages; Guild "keeps a close eye" on spell-rod sales | Rods, unlocking, golem size, blood magic, transformation potions are controlled (dossier WORLD; MAGIC_SYSTEM 4.3, locators there are offset, see C5) | c026 p241-243 V; other rows U |
| Cyoria magic shop | A merchant; shop in the city | Prices not written | Legal rods only for his standing; lethal rods "get into trouble" | Offers an unorthodox sale under the counter; Guild watches | c026 p241-248. SHOWN. V |
| Cyoria train station and city transport | Mana-crystal trains; passenger ward blocks shaping inside the cars (dossier) | Fare not stated; station shops "massively overpriced" | Public | A rain shield costs a lot of mana for luggage and three people | c014 p85-95 V (p85), others U |
| Rural job board (Teshingrad Guild wall) | Guild office clerk | Pay in goods, e.g. 2 chickens and a bag of flour for a wall repair; some postings give no pay | Anyone; mage badge widens the jobs available | Cheaper than Cyoria's board; thin supply of mages means demand | c027 p41-43, p47. SHOWN. V (p41-43) |
| Priest-tutor (Alanic Zosk) at his temple | Alanic; Lukav relays messages | No fee; evening attendance with "diligence and enthusiasm"; unpaid courier errands; instruction can end at once | By his invitation | Beginner protective rituals now, soul-awareness training over months, one track at a time | c032 p58-76. STATED. V (p58, p74, p76) [S: soul material] |
| Imaya Kuroshka's household | Imaya (landlady, mage-schooled), Kael (morlock healer-alchemist) with daughter Kana, Zorian and Kirielle | Rent "reasonable rates"; unit and sum not written; Zorian stocks Kael's lab with ingredients | Referral by Ilsa, "strictly between the two of us" (R3) | A basement lab on loaned academy equipment; morlock stigma; second room negotiable | c014 p28-31, p106-118. SHOWN/STATED. V (p31, p117) |

Searched where and not found (WPR23): tuition amounts, a wage number for any job, a meal price, the points quota, term dates, a curfew, a bank procedure, exam grading rules, library fees. Within W1-W4 the text gives no number for any of them. Elsewhere in the book "tuition" appears twice (c095 [S]), "scholarship" twice (c011 p69 is one), "bribe" 9 times in 7 chapters, "bank" 22 times in 14 chapters, "black market" 6 times in 4 chapters; none of those windows was read.

## 3. Person-to-person roles (WPR10)

| Role | What it does and owes | Access and cost | Failure or hazard | Locator, label, check |
| --- | --- | --- | --- | --- |
| Academy representative (Ilsa Zileti) | Explains certification, housing, mentor and electives; assigns the rest; teaches Essential Invocations; recommends housing and a tutor; her record is hurt by absences at the dance (dossier C003-07) | Student asks; she runs late visits | Late visit lost Zorian his mentor choice | c001 p75-99; c014 p19-31; c015 p46. SHOWN. V |
| Mentor (Xvim Chao) | One weekly meeting; drills (marble dodging in c015 p2-19); demands start-up delay, focus, patience | Assigned by quota | Gossip says he is the worst; Ilsa says students refuse the hard work | c001 p93-96; c015 p2-19 U. STATED. V (p96) |
| Combat teacher (Kyron) | Rod practice; warns that misuse draws him personally | In class | Threat is his claim, no stated rule | c002 p165-174 R1; V (p172-173) |
| Formula teacher (Nora Boole) | Spell Formulas, Advanced Mathematics; recommends books and cubes | In class; Sunday sessions per MAGIC_SYSTEM (U) | Test-based | c002 p176-179 R1. U |
| Librarian and assistant | Hire students on the spot; train on library protocols; Ibery trains on divinations later | Zorian asked about work | Pay low; restricted access only Zorian's guess | c006 p51-87. STATED. V (p53-57) |
| Detective-tutor (Haslush) | Divination instruction as a favour to Ilsa and to clear a quota backlog; tests Zorian with a compulsion spell; teaches a sugar-ring trick | Tavern meetings, Monday per R3 | Tutor is a police detective, so asking restricted questions is risky | c015 p46-71; c016 p6-20 R3. V (p46, p69-71), U (rest) |
| Older friend and field worker (Taiven) | Recruits a fourth for a posted sewer job; later tutors combat | Asks as a friend; pressure by teasing | Zorian refuses; the job teams need exactly four | c002 p65-91; c019 p67-75 dossier. SHOWN. V (p77-85) |
| Landlady and household (Imaya, Kael, Kana, Kirielle) | Imaya takes in strangers before checking identity; Kael runs a basement lab; Kirielle befriends Kana | Rent, ingredients for lab time | Morlock stigma; Kael declines unfair deals (c014 p116) | c014 p106-118. SHOWN. V |
| Priest-tutor (Alanic) | Teaches protective rituals, then soul-awareness meditation with weekly hallucinogenic potions | Attendance and errands | Can end lessons; weekly potion hits normal function (R4, U) | c032 p58-83. STATED. V (p58, p76) |
| Rural mage | Shares step-by-step shaping routines unlike Xvim's end-result teaching | Friendly meetings, odd jobs | None shown | c027 p57-72 R4. U |
| Classmates | Akoja (class rep), Benisek (gossip, family business), Briam (familiar owner), Neolu | None | Akoja's 15-minute rule is hers alone as far as shown | c002 p8-59, p105-119 R1. V (p108), U (rest) |
| Class-skipping strategy | Zorian chooses electives whose teachers do not check attendance; skips "almost a quarter" of classes | Own choice | Total skipping would draw attention | c014 p32; c015 p19 R3. U |

How the loop changes what each knows (WPR10, WA12): a returning character learns each person's routine and can skip lines already learned, but the person does not remember. Evidence in the windows: Zorian knows the curriculum and the paperwork and avoids a quarrel with Xvim on the repeat (dossier C005-03); the library job is not retaken in a later restart (R2, U, c010 p11); Haslush, the library staff and the mentor treat him as new each time. Whether anyone else remembers is the loop's [S] core and is not read here.

## 4. Money and information (WPR12)

| Item | Value or rule | Locator, label, check |
| --- | --- | --- |
| Currency name | None in the supplied edition by my searches. Metals and paper appear: "silver coins" (c064 p173), "gold coins" (c083 p111, treasury image), "pieces" (c014 p31), paper notes (c043 p113). Every country has its own currency; Eldemar bills do not travel (c064 p176) | SHOWN/STATED. V |
| Badge | Half of Zorian's savings; 2 days to make; no negotiation | c027 p41. SHOWN. V |
| Teleport fare abroad | 500 silver coins for a teleport to Zixia, from a broker to a simulacrum [S, mid] | c064 p173. SHOWN. V |
| Rural job pay | 2 chickens and a bag of flour for a wall repair; some postings have no payment | c027 p42. SHOWN. V |
| Cyoria job pay | "generally miserable" | c002 p80. STATED. V |
| Rent | "reasonable rates", "a tad expensive", unit "piece" unspecified | c014 p31. STATED. V |
| Station shops | "massively overpriced" | c014 p85. STATED. V |
| Library and police pay | Low; "a pittance" for police outreach extra pay | c006 p53; c015 p71. STATED. V |
| Price and cost vocabulary | "expensive" is used for the badge, the ingredients for serious alchemy (c007 p123 dossier), land in Cyoria (c008 p6), station shops. No itemised price list exists in the windows | STATED. V (selected) |
| Information | Rumor and gossip (Benisek) mislead as often as help (dossier C002, C005-07); public postal boxes are used for anonymous letters (c005 p155); newspapers appear in 15 chapters; police and Guild jurisdictions overlap; a tutor can be a police detective | c005 p155 V; others U |

Information subtlety kept from the windows: Haslush's own words say his tutoring is a way to pass a quota-driven case to someone else (c015 p69), so an offered service can carry the giver's incentive. That is a role mechanism, not a rule.

## 5. Time and rhythm (WPR13)

| Item | Default | Dial and reason | Locator, label |
| --- | --- | --- | --- |
| The month | The story's "month" ends on festival night at 2 past midnight; consistent in 4 restarts | The loop's owner and cause are [S]; length in days is not opened here | c006 p158-161. SHOWN. V |
| Day rhythm | Classes on weekdays; schedules finalized over the weekend before term; first class is Essential Invocations; mentor meets weekly (first meeting on a Friday); library work normally not Fridays | Zorian's choice of electives and skipping | c001 p99; c002 p104, p179 (R1 U); c015 p20 V |
| Term gates | Electives switchable in the first month; academy letters to parents are the only response to absence | Academy | c001 p99; c027 p33 V |
| First-day weather | A storm hits Cyoria on the first day of every restart | Fixed | c027 p40. SHOWN. V |
| Festival run-up | Refit, repaint, improved food, refurbishment, mandatory dance | Fixed to the year | c001 p161-162; c002 p5, p24-30 R1. U |
| Shaping practice | Most students finish about 6 shaping exercises per year; a focused repeater does more | Focus, restarts | c010 p56. STATED. V |
| Mana recovery | Teleport needs about half an hour to recover (R4, U); shaping in low-mana towns tires one in "a couple of hours" (R4, U) | Well rank | c026 p240; c027 p68. U |
| Lesson cost | Protective soul rituals up to 2 hours to cast, last weeks; awareness training takes months | Alanic's statements | c032 p58, p62 V (p58) |
| Away behaviour | Not stated in the source windows; repo default is a frozen visitor clock | Repo owner | WORLD_BRIEF |

Not found: a numbered calendar with month names; a term-start date; opening hours of any shop or office.

## 6. Power and growth subtleties (WPR14)

- **Reserve numbers use missile counts.** Average 8 to 12 rod shots, gifted 20 to 30, ceiling about 4 times the start, from the rod teacher's booklet (c008 p46, STATED, V). Zorian empties in 8 shots (c002 p172, SHOWN, V). These are not a universal unit; the booklet uses one spell as its yardstick.
- **Magnitude is a second yardstick** that appears in Taiven's talk: most spells are designed for ordinary reserves, fine control suffers near magnitude 20 by her guess, a person with Zach's reserve would need years longer to reach certification level (c022 p57-61, claim by Taiven, V).
- **Formula rods make fast casting easy but burn mana.** The rod does nearly all shaping (c002 p172); the cost is fuel, not skill. Mastery of the rod is not shaping mastery (dossier C002-08).
- **Access is keyed to the person.** The housing key reacts only to the owner's mana (c001 p84-85, V); the badge embeds a formula (c027 p43, V).
- **Licence and sale are separate from skill.** A mage may practise without a badge; selling services needs one (c001 p81, V); the Guild watches rod sales (c026 p243, V).
- **Mind and soul magic carry social costs.** Soul rituals need time and a willing teacher; the weekly potion destroys normal function for a time (R4 c032 p82-83, U). Telepathic attacks are very cheap and stun about a third of an ambush group (R4 c032 p101-103, U). [S for soul-marker material].
- **Repeating the month lets knowledge pay but not fuel.** The charge of a spent reserve returns each restart (the body resets; dossier). Savings refill (c014 p117, V).
- **A hard limit shown:** half the reserve to hold a shield against a gun-and-beam ambush (c032 p95, V).

## 7. Starts, failure, aftermath and surfaces (WPR15-17)

- **Starts.** The repo's visitor start arrives with no personal mana, no memory transfer and a frozen clock (WORLD_BRIEF). The source's own start is a third-year student, first-circle certified, with a family-driven care duty, a mentor and electives to choose, and (in the loop) repeated memory. Entry points the windows support as non-first starts: a transfer lodger (Kael's family in Imaya's house, c014 p106-118), a rural wanderer who skipped school (c027 p27-43), a helper hired by the library (c006 p53-57), a tutor's evening student (c032 p71-76). All INFERRED start sketches, not shown starts, none proposed for build.
- **Failure and aftermath.** Missed classes: a letter to parents (c027 p33, V). Expulsion after a disciplinary hearing, with a tuition dispute afterwards (c002 p162 R1; c095 p15-27 V, [S]). Certification failure: a quarter of a year group (R1 U). Mentor lost by lateness (c001 p90, V). Rural jobs paid in goods instead of money (c027 p42, V). Guild and police questioning avoided by a patron's word (c032 p107, V).
- **Surfaces.** A job board with posted offers (c002 p79), a sealed certification scroll that opens with mana (c001 p77-80 R1), a mana-glowing key (c001 p84), public postal boxes (c005 p155), newspapers, class roll and clipboard (c002 p105). Desktop panels could show: board, schedule, permits and tiers. PROPOSED only; not tied to UI rules.

## 8. Findings (F-list)

| Code | Finding | Label and check |
| --- | --- | --- |
| F1 | The supplied edition names no currency. The repo's "crown" is authored; the source has silver coins, paper notes and "pieces", and says every country has its own currency. | SHOWN. V (searches over all 107 chapters; c064 p173, p176; c014 p31) |
| F2 | The book gives almost no itemised prices. The only numbers are: badge at half of savings (c027 p41), 500 silver coins for a foreign teleport (c064 p173), 2 chickens and a bag of flour for a repair (c027 p42). | SHOWN. V |
| F3 | The academy runs on small procedural gates that matter more than money: mana-keyed housing, a turn-based mentor quota, 3 to 5 electives with a one-month switch, a points requirement on a job board. | STATED. V |
| F4 | Certification, badge and licence are three separate things. A mage can practise without the badge; selling needs it; the Guild also watches rod sales. | STATED. V |
| F5 | Police and Guild authority overlap and are bridged by personal pull and favours (a detective tutoring a student as a favour; a priest vouching for a student against Guild battlemages). | SHOWN. V |
| F6 | A restart keeps knowledge and skill and drops money and body. Savings refill each month; an earlier restart's spells carry. | SHOWN. V (c014 p117, c010 p16 R2 U, c006 p161) |
| F7 | Rural mana is scarce and rural teaching is step-by-step, unlike Xvim's end-result teaching; rural work pays in goods. | SHOWN. V (c027 p42), U (c027 p57-72) |
| F8 | A reserve is measured in rod-shot counts (8 to 12 average, 20 to 30 gifted, 4x ceiling) and in Taiven's "magnitude"; the two scales are not converted in the text. | STATED. V |
| F9 | A friend's job board team needs exactly four, so an invitation is a request to fill a slot (c002 p85) and the refusal is part of the loop's change. | SHOWN. V |
| F10 | Offers carry the giver's incentive: Haslush tutors to pass a quota-driven case; Taiven invites to fill a team. | SHOWN. V |

## 9. Engine facts (default, dial, reason; WPR5, WPR31)

| Fact | Default | Dial | In-world reason and cost | Exceptions the text shows |
| --- | --- | --- | --- | --- |
| Local access by personal mana key | A door or object opens only when the owner channels mana | Sensitivity of the lock, who can pre-key | The academy secures sensitive material for third-years | Hidden unlock tricks exist (dossier C009-03, U) |
| Licence separate from skill | Practising needs no licence; selling services does; selling restricted goods needs a permit | Guild vigilance, region | Guild enforcement is local and uneven | Famous teachers get away with illegal teaching (MAGIC_SYSTEM 4.3, U) |
| Mentor quota | One mentor per year-3 student; full mentors close | Quota size, academy year | Overbooked staff, pass-rate pressure | Late visit lost choice (c001 p90, V) |
| Points on a job board | Students collect points through cheap city jobs; most start later | Points required, pay | Mages use students for cheap errands | Money need moves it earlier (c002 p80, V) |
| Offers carry incentives | Invitations and tutoring have a giver's motive | How much the giver depends on the answer | Quota pressure, team slots, favours | A refusal changes the next repeat (c005 dossier, U) |
| Reserve as spendable fuel | Spells and rods drain a personal reserve; recovery by rest or ambient mana | Well rank, practice, efficiency | Rods are easy but fuel-hungry | Hold a shield for half the reserve (c032 p95, V) |
| Slow growth and control tradeoff | Reserve grows about 4x over a life at most; very large reserves harm finesse | Gift, practice, age | The soul protects control | Overdrive possible but costly (MAGIC_SYSTEM 1.2, U) |
| Month restart | Day ends at 2 past midnight on festival night; knowledge and skill kept, money refills | Which assets carry, who remembers | The loop's cause is [S] | Non-restarter characters reset fully (R2 loop table, U) |
| Goods as pay | In low-supply towns work is paid in goods or barter | Supply of mages | Few mages, few coins | Guild board also posts coin jobs (c027 p47, U) |

## 10. Contradictions and tensions (WPR20)

| Id | Claim A | Claim B | Chosen reading, owner, status |
| --- | --- | --- | --- |
| C1 | Dossier MOL-C015-04: Haslush poses as an unkempt civilian tutor | c015 p46: he introduces himself as a Cyoria police detective sent by Ilsa; c016 p39: he says he cultivates an unflattering front on purpose | Both partly stand: the cultivated scruffy front is source (his own claim); "civilian" is not, he is openly a detective. Owner: full-book PEOPLE and reader notes 006-020. Open for a one-word correction. |
| C2 | Kit card W3 K8: bread or meal parcel 2 crowns, guest bed 4 per night, trial 6, lamp kit 8 | `src/world_packs/book_mol_pack.js`: bread parcel 1 crown (line 4763), eat bread 1 crown (line 1868), kitchen sorting 8 crowns plus bread (1522), catalogue repair 12 crowns plus paper (2534) | Repo-internal mismatch between a proposal doc and shipped data; neither is source. Owner: kit card W3 rows and MoL actions. Open. |
| C3 | Kit card: "Source money nomenclature remains a reconciliation gap"; repo uses crowns | Source: no named currency; silver coins, paper notes, pieces; each country its own money | Settled by my searches (plural "crowns" once, c043 p128, headwear): crowns are authored only. Label them authored in any pack row; do not claim source support. Owner: kit card K8 and pack. Resolved for this edition. |
| C4 | Brief or request wording "Cyoria Imperial Academy" | Text: Royal Academy of Magical Arts (c001 p68) | Source wins. Owner: any doc using the wrong name. |
| C5 | MAGIC_SYSTEM locators (for example "Ch 8 ¶55" booklet, "Ch 27 ¶58" badge, "Ch 26 ¶292" rods) | This extraction: booklet c008 p46, badge c027 p41, rods c026 p243; c026 has only 289 lines here, so ¶292 cannot exist | That file uses a different paragraph segmentation, not a fixed offset. Its content is verified at the lines above. The full-book dossier's `N:pM` locators do match this extraction (MOL-C001-05 `1:p81`, MOL-C027-03 `27:p27-43`). Trust the dossier and this doc for locators; do not copy MAGIC_SYSTEM ¶ numbers into a pack. Owner: readers-2026-10-10. Open. |
| C6 | Kit card C1: kit proposes opt-in forward canon (restart, ward service) | Repo and brief: independent non-loop visitor with a frozen absence clock | Both stay. The source's loop is [S] core; the repo's branch is authored and declared. Owner: kit card, WORLD_BRIEF. Open (not decided here). |
| C7 | R1: Essential Invocations meets "every day of the week" (c002 p104) and "five times a week" (c002 p161) | Same | Probably the same fact; p161 not reopened by me. U. |
| C8 | Dossier WORLD.md "weekly mentor quotas" | c001 p88, p90: weekly meetings and a headcount quota | Two separate facts; wording merged. Low. |

## 11. Zero-hit and not-found searches (WPR23)

Searched all 107 chapter files of the supplied edition, case-insensitively, with spelling variants. Zero hits: `krona(s)`, `florin`, `ducat`, `shilling`, `pence`, `stipend`, `curfew`, `postbox` (the book writes "postal boxes", c005 p155, so my first search was a spelling miss and was repaired), `Cyoria Imperial`. Few hits: `currency` 3 (c043, c064 and one not opened), `tuition` 2 (c095), `taxes` 2, `black market` 6 in 4 chapters, `pawn` 3 in 3 chapters, `uniform` 6. Not searched: fees under other words (cost, price) beyond the sampled lines. A "not found" here means not found in the regex plus W1-W4 read, not absent from the book.

## 12. Gaps and unread windows (WPR7, WPR23)

Read 47,584 of about 804,945 words (5.9%) by readers, plus targeted opens. Unread parts, named with exact windows:

| Gap | Window | Notes |
| --- | --- | --- |
| Opening before Ilsa's visit | c001 p1-74 (about 2,400 words) | Household, train, first-day setup; dossier covers C001-01 to 04 |
| Academy tail of c002 | c002 p181-197 | End of first meeting with Xvim; final bits of the week |
| Second tavern and the compulsion test | c016 p38-end | Rest of Haslush's tutoring, aranea first contact [S] |
| Alanic tail | c032 p109-end | Aftermath of the ambush; marker test [S] |
| Mind magic and the aranean gift | c017, c036-c042 | Mind-sense, privacy norms, exclusive tutors [S] |
| Calendar and festival pin | c029 (not the wilderness lines), c104, c106 | Dates, term, the festival day; where "summer" and "weeks" are dense |
| Money and trade (more prices) | c062 (23 hits), c064 (14), c091 (28), c085 (18) | Guild or travel prices, treasury, forged authority; mid and late story [S] |
| Gate travel and customs | c064-c065 | Teleport chain, ship times (dossier WORLD) |
| Guild authority and cult | c061, c044, c031, c034 | Restricted robes, geasa, Guild leader [S] |
| Tuition dispute | c095 whole | Expulsion refund argument; only the two lines opened [S] |
| Mana mechanics and costs | c008, c022, c062, c103 | Dense in mana terms; only the numbers listed in section 6 opened |
| Aftermath society | c097-c107 | Epilogue school reopening, fees, homeless students |

## 13. More-to-consider round (WPR24)

| Class | Item | Done check |
| --- | --- | --- |
| ACT NOW (done) | Record that the source names no currency and quotes almost no prices, so every price in the repo is authored (F1, F2, C3). | Present here. |
| ACT NOW (done) | Record the dossier's "civilian tutor" wording slip for Haslush (C1) and the MAGIC_SYSTEM locator mismatch (C5). | Present here. |
| ACCOUNT FOR NOW | Any MoL K8 pack row must label crowns and prices authored; use source forms (board, points, goods, "pieces") as flavour. | Pack rows cite status "authored". |
| ACCOUNT FOR NOW | Do not copy MAGIC_SYSTEM paragraph numbers into packs (C5). | Pack locator checked against `chapters/`. |
| ACCOUNT FOR NOW | The kit's K13 ward loop and the source's restart loop are different loops; keep both sides (C6). | Floor card section 16. |
| LATER/DELEGATE | Calendar and festival pin pass (c104, c106, c029 selected lines plus dossier TIMELINE). Level: haiku reader plus short sonnet synthesis. Effort: about 12k words. Done check: a dated month table, or a "not found, searched where" line. | Table. |
| LATER/DELEGATE | Mana cost and regeneration pass over c008, c022, c062, c103. Level: haiku. Effort: 12k. Done check: located numbers for cast cost and recovery, or "not stated". | Table plus 3 spot checks. |
| LATER/DELEGATE | Money and trade pass over c062, c064, c091. Level: haiku. Effort: 12k. Done check: every price opened by the coordinator before use. | Table plus spot checks. |
| LATER/DELEGATE | Guild authority pass over c061, c031, c034, c044. Level: haiku. Effort: 12k. Done check: a permit and penalty row per control, or not found. | Table. |

Suggestions (separate, short): treat "points on a board" and "offers carry incentives" as reusable mechanisms (AD38); check the Paradise facilities doc for a similar quota-backed task board; consider a small `unit label` field so a pack can show "piece" or "coin" while the engine keeps one authored number.

## 14. Ranked next list (WPR25)

1. Calendar and festival pin plus mana costs (c104, c106, c008, c022, c029): about 12k words, closes K2 and K8 rhythm rows the card lists as missing.
2. Money and trade (c062, c064, c091): about 12k, closes whatever price numbers the book really has.
3. Guild authority and permits (c061, c031, c034, c044): about 12k, completes K7 and the licence row.
4. Mind magic and the aranean society (c017, c036-c042) [S]: about 12k, defer behind the first milestone.
5. Aftermath society (c097-c107) [S]: about 12k, defer.

## 15. Review state (WPR21) and follow-ups

Highest state reached: drafted, with 28 claim groups source-spot-checked by the coordinator (readers authored the rows; the coordinator opened the locators, so WPR18's separate-reviewer rule is met in that the checker differs from the reader authors). Not rules-reconciled in detail. Touched codes: WPR1-WPR32, AU1-AU6, AU10, AU13, AU15, WA3, WA4, WA6, WA8, WA11, WA12, WA14, AD38. Not built, not browser-verified, not director-accepted. No conflict with standing direction found: the floor card proposes slices, selects no world and opens no deferred gate.

Follow-ups, not done because the task said to touch nothing else (WPR3, WPR28):
- Link this file from `docs/worlds/mother-of-learning/WORLD_BRIEF.md` and from the kit card `docs/worlds/world-core-kit-2026-10-14/cards/mother-of-learning.md` (K6, K7, K8 rows).
- Link the private store `docs/research/novels/mother-of-learning/passes-2026-10-23/` from the MoL research index.
- Fix the stale `~/Sync/CalibreLibrary/` path in `docs/research/novels/LOCAL_LIBRARY.md` and in the full-book `read_source.py`.
- Correct "civilian tutor" in the dossier's Haslush entry (C1).
- Fold lessons into WORLD_PASS_RULES "Lessons carried in": (a) a book can honestly have no price list; a K8 floor then needs authored prices labelled as such; (b) the four readers returned 31, 31, 19 and 31 rows and I found no price misread, but the windows held almost no prices, so the check was thin; (c) an older reader file can use a different paragraph numbering, so check locators before copying them; (d) the requested academy name was wrong, check names against the text.

## 16. Floor card (WA6)

Five records. Each lists the default, the dial, the in-world reason and cost, source locator and label, current repo coverage, and the smallest playable slice. The repo coverage was read from the kit card (K2-K13 rows), `src/world_pack_mol.js` (six authored laws, nine people, a daily list) and `src/world_packs/book_mol_pack.js`, not re-verified by play (WPR21: source edit only). "Authored" means original to the repo. Nothing here is canon beyond the labelled evidence, and WA8 applies to unknowns.

### K2 World laws (5 to 10 engine facts)

- **Default.** EF1 personal reserve is spent by casting and rod use and refills slowly (c002 p172, c008 p46, SHOWN/STATED, V). EF2 reserve grows slowly to about 4 times the start and very large reserves hurt finesse (c008 p46, c022 p57-61, STATED, V). EF3 access is keyed to the person's mana (c001 p84-85, V). EF4 licence is separate from skill; the Guild watches rod sales (c001 p81, c026 p241-243, V). EF5 a learned spell carries across restarts (c010 p16, V); money refills (c014 p117, V). EF6 restart point is 2 past midnight on festival night (c006 p161, V). EF7 teleport needs a known destination and warded places block it (c026 p236-240, R4, U). INFERRED design mechanism, not a world law: offers carry the giver's incentive (c015 p69, c002 p85, V as scenes).
- **Classification and import (kit K2 checklist).** EF1 hard; EF2 hard (Taiven's finesse threshold is a believed estimate); EF3 hard for the lock, social for who is issued a key; EF4 social and legal (Guild enforcement, uneven); EF5 hard for the restart holder, absent for a visitor; EF6 hard; EF7 hard, unverified; the incentive mechanism is social. Import behaviour: a visitor without personal mana gets no EF1 or EF3 benefit and no EF5 carry (repo rule: no talent transfer, WORLD_BRIEF); EF4 binds a visitor who sells services or buys rods; EF6 binds only a restart holder. Seven laws EF1-EF7 meet the 5 to 10 floor without the inferred item.
- **Dial.** Well rank (Cyoria's Hole against a Rank 2 town, R4 c027 p79 U), reserve size, guild vigilance by region, restart ownership [S].
- **Reason and cost.** Mana is personal and finite; the academy and Guild police access to dangerous goods; the loop is a fixed cycle.
- **Source and label.** As cited. Evidence: SHOWN/STATED, V for EF1 to EF6, EF8; U for EF7.
- **Repo coverage.** Partial and misaligned: `world_pack_mol.js` holds six authored laws, all about the visitor campaign (Nora anchors the formula, trained operator, retrieval window, hatch threat, burn impairs work, hatch return needs a calm outcome). None of EF1 to EF8 is an engine fact or rule module; the kit card says there is no unified 5-10-fact card.
- **Smallest playable slice.** Encode EF1, EF3 and EF4 plus the inferred offer mechanism as data rows over existing verbs: reserve spent by an existing action, a key that opens a room only with a qualified holder, a permit check at the rod shop, and an offer that shows its giver's reason. About four pack rows plus one lint check (WA4: each law names a rule module). Proof by play is a separate step (WPR32).

### K3 Power core (one resource, growth, one learn path, 3 to 6 techniques)

- **Default.** Resource: personal mana reserve. Growth: slow with age and practice (ceiling about 4x), plus efficiency by repetition (spells get cheaper; MAGIC_SYSTEM 1.2, U). Learn path: books and teachers inside the academy, library access by clearance, lessons as contracts; shaping exercises through a book at about 6 per year (c010 p56, V). Techniques (source, opened or cited): T1 shaping exercise drills (c010 p56, V); T2 magic missile by rod or cast (c002 p172, V); T3 rain shield (found in the previous restart, c010 p16, V; its mana cost "draining", c014 p90 R3, U); T4 formula light cube made from a Nora-recommended design (c015 p90, V); T5 library book-finding divination (c006 p80-87 R2, U).
- **Dial.** Gift (reserve size), a rod to bypass skill, mentor quality, restarts of practice.
- **Reason and cost.** Mana is soul-bound and finite; rods trade fuel for speed; gifted reserves cost control.
- **Rank.** Visible rank is the circle: Zorian is a "certified first circle mage" (c001 p85, V); higher circles exist but only a few are named (MAGIC_SYSTEM gaps, U). **Source and label.** SHOWN/STATED. V for T1-T4; U for T5.
- **Repo coverage.** Partial and different in kind: the repo's power is "formula operator" mastery of a keyed lamp for a guest with no personal mana (MOL_IDS operator, nora_formula), one device mastery route and one local combat ally (Taiven). The kit card rates K3 partial and says it is not 3 to 6 personal techniques. Source techniques T1 to T5 are not in the pack.
- **Smallest playable slice.** Offer a "mage-qualified" start dial (separate from the guest): one mana bar, three actions (shaping drill that raises efficiency, rod missile that spends 1/8 of a starting reserve in the source's units, library divination that needs a job). Keep the guest start as it is. Floor needs 3 techniques minimum; use T1, T2, T4 (all opened). Needs the standing reserve decision (not mine).

### K6 Cast (minimum named people with roles)

- **Default.** Minimum roster with roles (source people, all in the windows): Ilsa Zileti, academy representative (c001 p75); Xvim Chao, mentor (c001 p90); Nora Boole, formula teacher; Kyron, combat teacher; Kirithishli and Ibery, librarian and assistant (c006 p53); Taiven, field worker (c002 p77); Kael and Imaya with Kana, household (c014 p106); Haslush Ikzeteri, police detective-tutor (c015 p46); Alanic, priest-tutor (c032 p58); Zorian Kazinski, classmate and loop holder [S in part]. Also Akoja, Benisek, Briam as classmates.
- **Dial.** How much each remembers (loop holders only [S]), role stage (student or visitor), era.
- **Reason and cost.** People have their own incentives (F10); teachers are overbooked (c001 p90).
- **Source and label.** SHOWN/STATED, V for Ilsa, Xvim, Kirithishli, Haslush, Taiven, Imaya, Alanic.
- **Repo coverage.** Partial: the pack has nine people (Imaya, Ilsa, Ibery, Nora, Xvim, Taiven, Kael, Zorian, plus the original hatch scavenger). Missing from the floor: Kyron, Kirithishli, Haslush, Alanic, Kirielle, Akoja, Benisek. The kit rates K6 partial: means and memory exist, scheduled T3 and a full T5 arc do not.
- **Smallest playable slice.** Add Kyron, Kirithishli and Haslush as three T2 contacts, each with one verb that matches the opened rows: Kyron (rod practice, restraint warning), Kirithishli (hire on the spot, first-circle rule), Haslush (tutoring with his own incentive). That reaches 12 named people against the kit's 6 to 12. The kit's W3 rows already propose Imaya as the T5 household arc and Kael and Nora as T3 people with schedule anchors (bench 10-14, workshop 14-17); those are repo proposals, not source, and the repo does not yet run those schedules. Memory per person stays as the kit proposes.

### K8 Daily life and economy (jobs, meals, prices, a day's rhythm)

- **Default.** Jobs from the source: library assistant (c006 p53-57, V), student job board with points (c002 p80, V), rural board paid in goods (c027 p42, V), household chores for board (authored). Meals: cheap cafeteria (c002 p5, R1 U), richer students eat at restaurants (U), inn food poor (c027 p40, V). Prices: no source numbers except the three in F2; rent "a tad expensive" with "piece" as the money word (c014 p31, V). Day rhythm: weekday classes, first class Essential Invocations, mentor weekly (Friday in week 1), library shifts not Fridays (c015 p20, V), weekend scheduling. Calendar: month ends 2 past midnight on festival night (c006 p161, V); festival run-up refit (c001 p161).
- **Dial.** Money unit and scale (authored), supply of mages, season, family support (parents pay rent money, c014 p16-17).
- **Reason and cost.** Cheap jobs fund points and cash; meals are cheap enough to be comfortable (accepted direction: comfortable unfed play).
- **Source and label.** SHOWN/STATED. V for the entries above, U for cafeteria and housing "free".
- **Repo coverage.** Partial and authored: the pack has a `daily` list from commands (bread parcel 1 crown, eat 1 crown and 2 min, kitchen sorting 8 crowns plus bread, catalogue repair 12 crowns plus paper, quiet meal 1 crown plus bread), a household stock and a shop. Currency "crown" is authored (C3). The kit card says jobs, food and rest exist but the Cyorian calendar is missing, and its proposed anchors differ from the pack by one price (C2).
- **Smallest playable slice.** Label the unit "local coin" authored, add a points counter fed by the board job, and add a weekday schedule that gates classes and library shifts (Friday off for the library), plus the three-line meal ladder cafeteria, bread, restaurant. Needs a source-vs-authored label on every row (WA3).

### K13 Signature verb loop

- **Default (source).** The restart loop: gather information in a month, act, reach 2 past midnight on festival night, restart with memory and skill kept and money refilled (c006 p158-161, c014 p117, V). Foreknowledge has a limited shelf life once the month diverges (dossier LOOP_INERTIA; U here). Mentor, library and board offers repeat; a repeater can skip them or take them faster (dossier C005-03; c010 p11 R2, U). The cause and any special tools are [S].
- **Default (repo).** The authored guest loop: study, assemble, charge and test a keyed lamp, calibrate, do paid research and keep a notebook; no restart, no foreknowledge (WORLD_BRIEF; kit C1). The kit's K13 proposal MOL1 is a recurring ward service (inspect, diagnose, quote, repair, test) that does not exist yet.
- **Dial.** Whether the loop is present at all (visitor yes or no), which assets carry, who remembers, absence policy (frozen by default in the repo).
- **Reason and cost.** The loop's carry set is the source's most important design variable (WA14); a visitor without a loop keeps the accepted AD16 frozen-clock policy.
- **Source and label.** SHOWN, V for the reset time, savings refill, first-day storm; the rest of the loop is dossier-sourced and [S].
- **Repo coverage.** Missing for the source loop (no restart code); partial for the authored lamp loop. The kit card rates K13 floor partial with the ward loop proposed only. Both sides are kept (C6); no choice is made here.
- **Smallest playable slice.** Two options in the doc order of cheapness. First, use the existing lamp loop as the floor and add one repeated, reusable cycle: a weekly board job and a mentor meeting that feed the lamp (no restart). Second, as an opt-in canon profile and only if Weibao asks: a single "month ledger" with a reset that keeps a declared carry list (notes and skill) and refills money, built on the kit's IO3 clock adapter. The second slice reopens the kit's C1 and needs a director decision; the first needs none. This is a proposal.

## 17. W5 money and trade census (2026-10-24, source-gap coordinator, Sonnet 5.5)

State: coordinator-only census and locator opens in the 107-chapter private extraction (`passes-2026-10-23/chapters/`, locator scheme `cNNN pNN`); no reader spawned because the named chapters are nearly empty of trade terms (WPR23: searched c062, c064, c091 line by line for price, cost, fee, pay, buy, sell, coin, gold, silver, merchant, trade; and the whole book for numeric money units). Source-spot-checked by me on every row.

| Chapter | Result |
|---|---|
| c062 | No trade terms. "Price" is the mana cost of enhancement rituals (p47-54). One trade line: merchant ship companies staff cargo ships thinly, which skeleton pirates exploit and then sell loot (p124-125, STATED). |
| c091 | Nothing economic by census. |
| c064 | Sea route Eldemar to Koth: cheaper, one month, 20 days on a pricier vessel; teleport platform network pricier but about 15 days, on a fixed schedule with border checks at each platform (p3-4, STATED). A broker teleport to Zixia asks 500 silver coins (p173, SHOWN). Every country has its own currency and Eldemar bills lose value abroad, so a traveler carries gold, silver and gems (p176-177, STATED). Long-range teleporters are rare and illegal border-dodging makes them charge steep prices (p179, STATED). |
| Others | The only numeric money in the book: an exam budget "25.000 pieces" (c003 p5, a test question); half of savings for a badge (c027, earlier note); and, new here, savings that refill when the loop restarts, so money matters little to a time traveler (c014 p117, STATED, a thought). "Gold coins" in the treasury image (c083 p111). |

Findings (labels): no currency name, no price list, no trade house or tariff in this edition; the only exchange rates are "own currency per country". Authored for any pack: every price (WA8). New engine fact, default and dial: a loop that refills the player's savings makes money a within-loop tool; the dial is whether savings carry (the book says they reset, c014 p117). Contradiction kept: none found.

Budget used: 0 readers, 0 reader words. Unread: c085 (18 hits by census, not opened here), c095 tuition dispute and c097-c107 aftermath fees remain as in section 12.
