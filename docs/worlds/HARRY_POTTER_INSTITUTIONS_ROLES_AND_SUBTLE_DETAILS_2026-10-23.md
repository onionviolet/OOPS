# Harry Potter: institutions, roles, subtle details and floor card (pass, 2026-10-23)

Status: **proposal at pass level; highest review state reached is source-spot-checked (WPR21), partial.** Findings are not accepted decisions and authorize no build, commit or push. Nothing here was built or played. Spoiler-light: late-story items are tagged [S] with a locator only. No sealed designed truth of this repo was read or recorded (WPR8). Paraphrase only; no source prose is reproduced.

Codes touched (WPR22): WPR1-WPR32, AU1-AU15, WA3, WA6, WA8, WA11, AD36-AD38, kit card K2/K3/K6/K7/K8/K13 and contradiction C2, W7 MC5, WG6 of the [subtle-gaps audit](../audits/WORLD_SUBTLE_GAPS_2026-10-20.md), ARCH/UI rules not touched (no code, no UI).

## 1. Pass record (WPR1)

| Field | Value |
|---|---|
| World, part | Harry Potter (HP); institutions, roles and subtle details across WPR9-WPR17, plus the WA6 floor card (K2, K3, K6, K8, K13) |
| Mode | Reuse and check, then four bounded Haiku reader windows, then coordinator source spot-checks and a coordinator price census |
| Output owner | this file (new file: no HP institutions/roles owner exists; link follow-ups in section 12) |
| Budget (declared, finite) | coordinator (Sonnet) plus at most 4 Haiku readers, one at a time, each on one disjoint pre-extracted window of at most 12,000 words (total about 48,000), 1 repair reserved, then stop. Unread parts become named gaps with exact windows |
| Stop condition | four readers returned and reviewed; one repair if a return is thin; no further raw reading by readers |
| Highest review state targeted | source-spot-checked (WPR21). Nothing here is built, browser-verified or director-accepted |
| Sealed secrets | none touched; late-story items are tagged [S] and give a locator only (WPR8) |

### Edition (WPR2, WPR23)

- Main text: the seven-novel compilation `The Complete Harry Potter` PDF (z-library copy, 4,361 PDF pages) in `~/Downloads/`. Its SHA-256 `9db33901...b7d4` matches `source-preparation-2026-10-11/manifest.json` today. Private extraction: `docs/research/novels/harry-potter/source-preparation-2026-10-11/book-01..07.txt` with page tags `[Bn:PDF-pNNN]` (absolute PDF page numbers, not book page numbers).
- Mixed editions inside one PDF (HYPOTHESIS from text; not verified against the PDF imprint for every book): B1 text reads as the US "Sorcerer's Stone" edition (US spellings, double quotes); B5 text reads as the UK Bloomsbury edition (single quotes, "Mum", "Hosptial" typo in a chapter heading, 2003 imprint line at B5:PDF-p1842). B6 is double-quoted (US style). Quotes and spellings therefore differ by book. Page tags are the locator, as the book.hp pack already does.
- Not in the Calibre Library: the seven novels. `docs/research/novels/LOCAL_LIBRARY.md` has no HP entry (grep for "potter" and "rowling" returned nothing on 2026-10-23). Calibre does hold seven companion EPUBs, none read this pass: `Cursed Child` (also extracted at `source-preparation-2026-10-11/cursed-child.txt`, 47,856 words), `Fantastic Beasts and Where to Find Them`, `Quidditch Through The Ages`, `The Tales of Beedle the Bard`, `Hogwarts: An Incomplete and Unreliable Guide`, `Short Stories from Hogwarts of Power, Politics and Pesky Poltergeists`, `Harry Potter: A History of Magic` (British Library). These are supplemental and not the default seven-novel snapshot (SOURCE_LEDGER).
- Extraction caveat: B1-B7 come from a PDF text conversion. Spelling drift, page-number artifacts inside sentences (for example a stray page number inside the Sickle conversion line at B1:PDF-p59/60) and chapter-heading typos occur. Names are checked by locator, not by edition authentication.

## 2. Manifest: reuse, windows, budget (WPR2, WPR7)

### Reused first (nothing re-read for these)

| Source | Used for | Status |
|---|---|---|
| `docs/worlds/harry-potter/WORLD_BRIEF.md`, `SOURCE_LEDGER.md` | Candidate scope: a life before the letter, six proposed contexts, original people Mara, Elias, Nessa | proposals; H1-H8 are companion-site evidence, not novel readings |
| `docs/worlds/world-core-kit-2026-10-14/cards/harry-potter.md` (K1-K18, contradictions C1-C12) | Floor ratings and gaps | proposals; W1 floor D partial, R partial/missing on K2/K3/K8/K13 |
| `docs/audits/WORLD_SUBTLE_GAPS_2026-10-20.md` WG6 | Term-and-holiday rhythm gap | proposal; HP "has not had this pass" |
| `docs/research/novels/harry-potter/census-2026-10-19/HP_CENSUS_REPORT.md` | 256 records (spells, subjects, school roles, textbooks); read windows B1 p52, p110, p137 | 32 read, 224 read-window |
| `src/world_packs/book_hp_pack.js`, `src/hp_brewing_*.js`, `tests/hp_brewing.test.js`, `tests/world_pack_hp.test.js` | The only HP runtime: one pinned Polyjuice slice | read only, nothing built or run |

### Windows (pre-extracted by script `build_windows.py`; one reader at a time; haiku set explicitly)

Word unit: whitespace-separated words, page-tag lines excluded. All files and the manifest (`windows_manifest.json`, with SHA-256) are in the gitignored store `docs/research/novels/harry-potter/passes-2026-10-23/`.

| Window | Label | Content | Words | Gap it serves |
|---|---|---|---|---|
| W1 | consecutive | B1 ch4 "The Keeper of the Keys" and ch5 "Diagon Alley" (B1:PDF-p35 to p69) | 10,425 | K8 prices and money units (no complete prices; contradiction C2 on coin conversion), Gringotts, wands (census gap B1 p65-67), how a muggle-raised entrant is told |
| W2 | consecutive, ch9 partial (cut at a paragraph under the cap) | B1 ch7 "The Sorting Hat", ch8 "The Potions Master", ch9 "The Midnight Duel" to B1:PDF-p129 | 12,000 | K6/K7 Head of House, houses, house points, timetable, meals, first-day rhythm (WG6 term rhythm) |
| W3 | consecutive | B5 ch7 "The Ministry of Magic" and ch8 "The Hearing" (B5:PDF-p1980 to p2015) | 9,022 | K2/K7 Ministry structure, magical law, underage magic, enforcement and trial |
| W4 | mixed (three excerpts, not consecutive) | B5 ch22 from the trip to St Mungo's to chapter end (B5:PDF-p2388 to p2400); B5 ch23 opening, partial (p2400 to p2403); B5 ch29 "Careers Advice" whole (p2581 to p2610) | 11,984 | St Mungo's layout and tiers; exams, careers, NEWT/OWL gating, Head of House role |
| Total | | 4 windows | **43,431** | |

Why these: the K8 floor says "no complete prices, bed, calendar"; K7 says "no joined remembered standing card"; census names wand wood/core as unread; WG6 says no term or rhythm rows. A keyword census over all seven books (galleon/sickle/knut, Ministry, Mungo, Gringotts, house points, OWL, NEWT, prefect, Wizengamot, Apparat) fixed where terms are dense. Chapter detection for B4 and B6 failed in `chapters.py` (different heading format); locators for those books come from the coordinator price census and spot-checks, not from windows.

### Invocations and usage (WPR7, AU2)

| Item | Count |
|---|---|
| Haiku readers (fresh Agent calls, `model: "haiku"` set in each call, one at a time) | 4 (W1, W2, W3, W4) |
| Repair readers | 0 used of 1 reserved (every return was usable; defects were fixed by coordinator spot-checks, section 8) |
| Advisor consultations (coordinator) | 1, before dispatch (it caught that the first W4 cut stopped before the hospital; W4 was rebuilt) |
| Reader cost observed (AU4 pilot) | W1 about 120k subagent tokens, 7 tool uses, 104 s; W2 about 126k, 6 uses, 118 s; W3 about 109k, 5 uses, 71 s; W4 about 114k, 4 uses, 65 s. Total about 469k reader tokens. A 12,000-word window fits Haiku in one Read |
| Reader output | one table of 28 to 52 rows each, saved in the private store as `haiku_return_W1..W4.md` (not committed) |
| Source words given to readers | 43,431 (label: W1 consecutive, W2 consecutive with a partial last chapter, W3 consecutive, W4 mixed excerpts) |
| Coordinator source reading outside windows | the full price census (120 hit rows over all seven books, `price_census.tsv`) and about 35 targeted opens of 1 to 5 lines each (section 8); under 2,500 words of source |
| Store | `docs/research/novels/harry-potter/passes-2026-10-23/`: `chapters.py`, `build_windows.py`, `ctx.py`, `price_census.py`, `price_census.tsv`, `windows_manifest.json` (SHA-256 per window), `window_W1..W4.txt`, `brief_*.txt`, `haiku_return_W1..W4.md` |

## 3. Coverage of the WPR rows

| Row | Covered by | State |
|---|---|---|
| WPR9 Places and facilities | Gringotts, Leaky Cauldron, Diagon Alley shops (W1); Hogwarts places, common room, Great Hall, trophy room, forest, third floor (W2); Ministry Atrium, lifts, levels, courtrooms (W3); St Mungo's floors and wards (W4) | covered; Hogsmeade, Borgin and Burkes, Weasleys' shop, Hogwarts library and classrooms not read (section 9) |
| WPR10 Person-to-person roles | Hagrid and the Dursleys as guardians, Ollivander, Griphook (W1); Heads of House, prefect, caretaker, ghosts, Quidditch captain (W2); Minister, department head, Senior Undersecretary, scribe, witness, clerk (W3); Healer, Head of House as careers adviser, Umbridge as inspector (W4) | covered for school and Ministry; Death Eaters, Order members, shopkeeper-customer debts not read (gap) |
| WPR11 Institutions and law | W3 hearing; Unforgivables (B4:PDF-p1323), Trace (B7:PDF-p3706), Hogsmeade form (B3:PDF-p643) opened by the coordinator | covered for underage magic, secrecy, trial procedure; bribery and appeal not found in W3 |
| WPR12 Money, goods, information | Coordinator price census (120 rows) plus W1 and W4; Daily Prophet by owl; letters and owl post (W1, W2) | covered for units and about 30 prices; rumor spread not read |
| WPR13 Time and rhythm | W1 (term date, reply date), W2 (partial timetable, trials, flying lesson), W4 (careers meeting, Easter, exams), coordinator opens on OWL timing | partial; full timetable by year and holiday dates open |
| WPR14 Power and growth | wand choice (W1), grade ladder (B6:PDF-p2964), Auror and NEWT gates (W4), Apparition course (B6:PDF-p3280), Unforgivables | partial; spell costs and magic limits not read this pass (census holds names only) |
| WPR15 Starts and entry | W1 (letter, muggle-born treated by a guide, Diagon Alley first visit, ticket) | partial; letter-less or adult-outsider starts have no source row, they stay proposals |
| WPR16 Failure and aftermath | expulsion precedent (Hagrid, snapped wand), hearing outcomes, lost points, hospital stays (W1 to W4) | partial |
| WPR17 Surfaces | owl post at breakfast (B1:PDF-p108), notices on a board (B5:PDF-p2587), floor sign at St Mungo's (B5:PDF-p2392), parchment results (B6:PDF-p2964) | covered as source-side surfaces only; no UI claim |

## 4. Findings (coded; label and locator on each)

Labels: SHOWN (a scene), STATED (speaker or narrator), INFERRED, PROPOSED. "Opened" means the coordinator read the cited lines in the private extraction after the reader returned. Locators are `[book:PDF-page]` tags in the extraction, not printed book pages.

### Money and information (WPR12)

- F1 (SHOWN/STATED, opened, B1:PDF-p59 to p60): a Galleon is gold; 17 silver Sickles make a Galleon and 29 bronze Knuts make a Sickle, so 493 Knuts per Galleon. The conversion line is split across the page tag in the extraction ("Seventeen silver Sickles to" then "a Galleon and twenty-nine Knuts to a Sickle"), which is the stray page-number artifact noted in section 1. This closes kit contradiction C2 from the novel itself (before this the repo held it only from a fan-wiki excerpt, W7 MC5).
- F2 (SHOWN, all opened): prices in the novels, as units written.

| Item | Price | Locator |
|---|---|---|
| Wand (Ollivanders, first wand) | 7 gold Galleons | B1:PDF-p68 |
| Unicorn horn, silver, Apothecary | 21 Galleons each | B1:PDF-p64 |
| Beetle eyes | 5 Knuts a scoop | B1:PDF-p64 |
| Dragon liver (a shopper's complaint) | 17 Sickles an ounce | B1:PDF-p56 |
| Newspaper by owl | 5 Knuts (Hagrid tells Harry what to pay) | B1:PDF-p48; Hermione pays a Knut in B5:PDF-p2095, p2165 (so the unit price differs by book) |
| Train trolley, "some of everything" | 11 Sickles and 7 Knuts for the whole armful | B1:PDF-p81 |
| Knight Bus to London | 11 Sickles; 15 includes hot chocolate, or a hot water bottle and toothbrush | B3:PDF-p666; 11 Sickles each in B5:PDF-p2438 |
| Apparition lessons (Ministry instructor) | 12 Galleons for a twelve-week course; open to those 17 by 31 August | B6:PDF-p3280 |
| Quidditch World Cup tickets (a father's remark) | "about a sackful of Galleons" (no number) | B4:PDF-p1179 |
| Omnioculars | 10 Galleons each | B4:PDF-p1200 |
| Triwizard prize | 1,000 Galleons | B4:PDF-p1294 |
| House-elf wage offered by Dumbledore | 1 Galleon a week and one day off a month (Dobby's account); 10 Galleons a week and weekends off (as offered) | B4:PDF-p1486 |
| Ministry fine on a Misuse of Muggle Artifacts head | 50 Galleons (a newspaper item) | B2:PDF-p493 |
| Reward for an escaped convict | 10,000 Galleons (Sirius's account); 1,000 Galleons posted for recapture of convicts | B5:PDF-p1951; B5:PDF-p2475 |
| Fountain of Magical Brethren | coins thrown in; proceeds to St Mungo's | B5:PDF-p1987 |
| Gift Christmas-pudding Sickle | a silver Sickle baked into a slice | B1:PDF-p163 |

- F3 (searched, section 7): no school fees or tuition appear in any of the seven books (zero hits for "tuition" and "school fees" in B1 to B7). Hogwarts costs the family only the equipment list, which carries no prices (B1:PDF-p52 to p53, W1 reader and census). Hospital and Leaky Cauldron prices are not stated either (section 7).
- F4 (STATED, W1, opened B1:PDF-p59, p60): Gringotts holds vaults by number, opened with a key plus a goblin escort in a rail cart; a high-security vault has no keyhole and a goblin's touch opens it; the goblin says it is checked roughly once a decade and that a non-goblin would be trapped. A Dumbledore letter lets Hagrid retrieve a package (the contents are a late-story item [S], B1:PDF-p114). Hagrid gives Harry Muggle bills for the trip (B1:PDF-p51; reader row, unopened). Coin currency is wizard-only: a boy needs wizard money for shops and Muggle money elsewhere (B2:PDF-p304 mention, opened in census).
- F5 (SHOWN/STATED, opened): information moves by owl. About a hundred owls arrive at breakfast (B1:PDF-p108); the Daily Prophet is delivered by owl for a coin (B1:PDF-p48); the Ministry used owls inside the building until paper aeroplane memos replaced them because of the mess (reader W3, B5:PDF-p1990, unopened). A hearing time change was sent by owl and missed (B5:PDF-p1994, opened for the time and venue; who sent which notice is contradicted inside the text, section 6).

### Places and institutions (WPR9)

| Place | What it offers, access and cost | Label and locator | Opened? |
|---|---|---|---|
| Leaky Cauldron and Diagon Alley | A pub (bartender Tom) hidden from most Muggles; the Alley opens by tapping bricks with a wand or umbrella; shops: Apothecary, Eeylops Owl Emporium, Madam Malkin's robes (a squat smiling witch in mauve), Flourish and Blotts, Ollivanders | SHOWN B1:PDF-p54 to p68 | pub, Eeylops, Malkin opened (p57, p61) |
| Gringotts | see F4; inscription on the inner doors warns thieves; goblins run it | SHOWN/STATED B1:PDF-p57 to p60 | yes |
| Hogwarts Express and entry | Ticket handed over by Hagrid for 1 September from King's Cross | STATED B1:PDF-p69 | yes |
| Hogwarts in term | Great Hall with four house tables and a staff table; feast, then bed; moving staircases (142 stated); doors that need coaxing; a trophy room reached by the third floor; a forbidden forest; a right-hand third-floor corridor placed out of bounds on pain of a "painful death" joke | SHOWN/STATED B1:PDF-p93 to p106 | counts opened at p106 |
| Gryffindor common room | Entered through the Fat Lady's portrait with a password that changes (shown changing in the window); dormitories off a tower stair | SHOWN B1:PDF-p105 | password opened |
| Ministry of Magic | Visitor entrance by telephone box, silver badge naming the hearing, a security desk that checks and records the wand, a golden fountain in the Atrium, at least twenty lifts; Level Seven Games and Sports, Six Magical Transportation (Floo, Portkey, Apparition Test Centre), Five International Cooperation, Four Regulation and Control of Magical Creatures (Goblin Liaison Office), Three Magical Accidents and Catastrophes (Obliviator HQ, Muggle-Worthy Excuse Committee), Two Magical Law Enforcement (Improper Use of Magic Office, Auror HQ, Wizengamot Administration); Department of Mysteries below; old courtrooms below that | SHOWN B5:PDF-p1985 to p1996 | levels, badge, wand check, lifts opened |
| Courtroom Ten | About fifty judges in plum robes marked with a W; interrogators Minister Fudge, Bones (Head of Law Enforcement) and Umbridge (Senior Undersecretary), Percy as scribe, an accused's chair with chains (recalled from a memory of a sentencing, not a present event) | SHOWN B5:PDF-p1998 to p2001 | W, officials, scribe opened |
| St Mungo's | Reached through a shop window with a talking dummy (Purge & Dowse Ltd); reception desk; guide: ground floor Artefact Accidents, first Creature-Induced Injuries (Dangerous Dai Llewellyn Ward, Serious Bites; Healer-in-Charge and a Trainee Healer named on a door card), second Magical Bugs, third Potion and Plant Poisoning, fourth Spell Damage, fifth tearoom and shop; Healers in lime-green robes with a crossed bone-and-wand badge | SHOWN B5:PDF-p2389 to p2394 | ground, fourth floor, first floor ward and Healer-in-Charge opened |

### Person-to-person roles (WPR10)

- F6 (STATED/SHOWN, opened B1:PDF-p91, p100, p104, p108, p111, p122): a house is a family unit. McGonagall (Transfiguration, Deputy Head, Head of Gryffindor) says triumphs earn house points and rule-breaking loses them, and the House Cup goes to the house with the most at year end. A ghost tells the new house that Slytherin had the cup six years in a row; the final banner scene shows a seventh (B1:PDF-p246). Snape docks a point for cheek; points are taken by named staff in scenes and awarded for answers.
- F7 (STATED, opened B1:PDF-p104): a prefect cannot control Peeves; only the Bloody Baron can. A prefect leads first years to the common room (B1:PDF-p98 to p105) and relays rules. Percy is the shown prefect; during the troll alarm a teacher orders prefects to lead their houses back (B1:PDF-p139, speaker not checked).
- F8 (SHOWN/STATED): Filch and Mrs Norris patrol and report; no magic in the corridors between classes (Dumbledore at the welcome feast, B1:PDF-p102). Hagrid is both the guide to the wizarding world for a Muggle-raised child and a person whose own record shows how the school punishes: expelled in his third year with the wand snapped, allowed to stay as gamekeeper (B1:PDF-p47, opened).
- F9 (STATED, opened B5:PDF-p2587, p2594 to p2597): the Head of House meets every fifth-year in the first week of the summer term about a career, from a timed list on a board; Heads of House are gatekeepers of their own NEWT classes (McGonagall: an "Exceeds Expectations" OWL, Snape: only "Outstanding"). A government inspector (Umbridge) may sit in and interrupt a career meeting, and a Ministry can screen mail and parcels (B5:PDF-p2585 reader row, unopened).
- F10 (STATED, W4 reader, opened for the requirement lines): Auror entry needs five NEWTs none below "Exceeds Expectations", then character and aptitude tests, then three more years of training; nobody was taken in the last three years (B5:PDF-p2594, p2597). Healing needs at least an E at NEWT in Potions, Herbology, Transfiguration, Charms and Defence Against the Dark Arts (leaflet, B5:PDF-p2587). Muggle Relations needs an OWL in Muggle Studies (B5:PDF-p2587).
- F11 (STATED, W3 reader; first two lines opened): Ministry staff are mostly invisible clerks and small offices: Weasley runs a two-desk Misuse of Muggle Artifacts office pushed to a dead end (B5:PDF-p1992); a patrol, not Aurors, handles minor pranks (B5:PDF-p1993; reader row unopened). A witness who is a Squib must leave details with an assistant (B5:PDF-p2005; unopened).

### Law, enforcement, aftermath (WPR11, WPR16)

- F12 (STATED, opened B5:PDF-p2001): the charge was read from the Decree for the Reasonable Restriction of Underage Sorcery, 1875, Paragraph C, and Section 13 of the International Confederation of Warlocks' Statute of Secrecy; the act was a Patronus in a Muggle-inhabited place before a Muggle. Underage means under seventeen.
- F13 (STATED, opened B5:PDF-p2010): Clause Seven of the Decree allows magic before Muggles in exceptional circumstances, and the defence argues a Dementor attack qualifies. Under the Wizengamot Charter of Rights an accused may bring witnesses (B5:PDF-p2004, opened). Verdict is by a show of hands (reader W3, B5:PDF-p2013, unopened).
- F14 (STATED, Dumbledore, W3 reader, B5:PDF-p2012 unopened): the Ministry cannot expel a Hogwarts student or confiscate a wand before the charge is proved. This is a speaker's claim; later book events in the same volume are not read (gap).
- F15 (STATED, opened B4:PDF-p1323): using any of the three Unforgivable Curses on a person earns a life sentence in Azkaban; this is the Defence teacher's lecture, not a law text.
- F16 (STATED, opened B7:PDF-p3706): under seventeen, a person carries the Trace, a charm by which the Ministry detects magic around under-seventeens. [S] for context: it breaks at seventeen. Hogsmeade visits need a signed permission form (B3:PDF-p643, opened).
- F17 (SHOWN/STATED, opened): expulsion is the school's top penalty; nothing is shown about a standing detention scale in W2 (detention not in the window). Lost points and loss of access (out-of-bounds, caught by Filch) fill the lower end (B1:PDF-p111, p126 to p127).

### Time and rhythm (WPR13)

- F18 (opened): term begins 1 September, reply owl due by 31 July (B1:PDF-p40); Hogwarts runs seven years (B1:PDF-p46); Quidditch trials in the second week of term, signed up with Madam Hooch (B1:PDF-p102); the first flying lesson is on a Thursday with Gryffindor and Slytherin together (B1:PDF-p114); Herbology three times a week, Astronomy at midnight on Wednesdays (B1:PDF-p107); Harry's Friday afternoons are free (B1:PDF-p109).
- F19 (opened B1:PDF-p156, B5:PDF-p2587, B5:PDF-p2647, B6:PDF-p2964): some students stay at school for Christmas; Easter break comes before the summer term; the OWLs run over two successive weeks, theory in the mornings, practicals in the afternoons, Astronomy at night; results arrive by owl in the summer as a parchment with pass grades Outstanding, Exceeds Expectations, Acceptable and fail grades Poor, Dreadful, Troll.

### Power and growth subtleties (WPR14)

- F20 (STATED/SHOWN): wand choice is the wand's (Ollivander, B1:PDF-p66; the W1 reader's locator p65 to p66 is one or two pages early for the payment at p68). A snapped wand ends a student's formal magic but not the person's presence (Hagrid). Standing rule for the first year: no personal broomsticks (B1:PDF-p53 reader row; a first-year Seeker is described as unheard of, B1:PDF-p122, opened).
- F21 (STATED, opened): lessons and gates, not a mana pool, limit growth: subject classes graded O/E/A/P/D/T, NEWT class entry set by the teacher, Apparition at 17 with a 12 Galleon course (B6:PDF-p3280), the Trace until 17, the Unforgivables lecture at B4:PDF-p1323.

### Starts and entry, failure, surfaces (WPR15 to WPR17)

- F22 (SHOWN, opened B1:PDF-p46, p48 to p51): a Muggle-raised child is told by a single adult guide (Hagrid) who also does the shopping for him; a guardian can refuse the letter and the guide overrides in person; the name has been "down" since birth (B1:PDF-p46 reader row says Hagrid states this; opened). This gives the repo's "letter or no letter" dial a source row for the letter route only. Adult outsider, reincarnated and letter-less starts have no source row in these windows; they stay proposals.
- F23 (SHOWN): results and instructions reach the player as paper: a boarded notice (B5:PDF-p2587), a parchment results sheet (B6:PDF-p2964), a floor sign (B5:PDF-p2392), a letter with a reply date (B1:PDF-p40).

## 5. Engine facts (WPR5: default, dial, in-world reason and cost, exceptions the text shows)

All PROPOSED as engine rows; the source side is labelled in section 4.

| ID | Fact | Default | Dial | In-world reason and cost | Exception shown |
|---|---|---|---|---|---|
| E1 | Underage magic gate | Under 17, magic outside school is an offence with a Ministry hearing | era, location (Muggle-inhabited or not), how detected (the Trace) | the Trace reports magic around minors (B7:PDF-p3706); cost is a hearing, a warning, and in the worst case loss of school place | Clause Seven, threat to life (B5:PDF-p2010) |
| E2 | Secrecy | Magic hidden from Muggles; clean-up by Obliviators and an excuse committee | strictness, who witnesses | Ministry departments exist for it (B5:PDF-p1990) | exceptional circumstances |
| E3 | Wand as tool | Wand chosen by the wand; registered when entering the Ministry | owner, bond, borrowed use | Ollivander (B1:PDF-p66); security desk records details (B5:PDF-p1988) | wandless or borrowed use not read |
| E4 | Unforgivable Curses | Life in Azkaban on use against a person | wartime suspension, official authorization | a teacher states the sentence (B4:PDF-p1323) | the Ministry once authorized their use against suspects (B4:PDF-p1630 line opened as a stated account, not a law) |
| E5 | Age and permission gates | Hogsmeade needs a signed form; Apparition needs 17 plus a 12 Galleon course; brooms barred for first years | guardian, year | the form (B3:PDF-p643), the notice (B6:PDF-p3280), the list (B1:PDF-p53) | a first-year Seeker (B1:PDF-p122) |
| E6 | House points | Staff award for triumphs and take for breaking rules; the House Cup is the year-end total | who may award, size of a point | McGonagall's rule (B1:PDF-p91) | none read |
| E7 | School-yard rules | No magic between classes in corridors; out-of-bounds floor and forest; caretaker enforces | which place is closed | Dumbledore's welcome (B1:PDF-p102) | none |
| E8 | Money | 17 Sickles to a Galleon, 29 Knuts to a Sickle; wizard coin is separate from Muggle money | city or shop | Gringotts (B1:PDF-p59, p60) | none |
| E9 | Grade ladder | Pass O, E, A; fail P, D, T; NEWT classes admit by teacher-set minimums | teacher | results sheet (B6:PDF-p2964), careers talk (B5:PDF-p2594) | none read |
| E10 | Ministry limits over the school | Ministry cannot expel a student or seize a wand before proof | political pressure | Dumbledore's claim (B5:PDF-p2012) | later events not read; see gap |

## 6. Contradictions and divergences kept (WPR20)

- X1 (inside the text, kept): house cup streak. The welcome-feast ghost says six years in a row (B1:PDF-p100) and the year-end feast shows a seventh (B1:PDF-p246). Not a conflict; it is a clock that advances. Pinned as "six at start, seven at the end" for a first-year window.
- X2 (kept): a Gryffindor password changes during the window (B1:PDF-p105 to p126). Passwords are a changing state, not a fixed name.
- X3 (kept): the hearing notice. The W3 reader recorded that the stated notice story and the clerk's account of a missed owl do not match (B5:PDF-p1994 to p1998). Only the time and venue change was opened (p1994). The conflict itself is unverified.
- X4 (kept): Harry's Defence record. Umbridge's note says poor results and McGonagall says high marks with a competent teacher (W4 reader, B5:PDF-p2595 to p2596, unopened for exact wording). Both sides are speakers' claims.
- X5 (repo, resolved by source): kit card C2 and K8.W3-HP treat the coin names and ratio as MEMORY or as a fan-wiki excerpt. The novel text shows 17 Sickles to a Galleon and 29 Knuts to a Sickle (B1:PDF-p59 to p60). W7 MC5 is confirmed; the claim can be upgraded from "fan excerpt" to "shown in the novel (B1)".
- X6 (repo divergence, intentional): the `book.hp` pack's purse is "whole slice coins", not Galleons, Sickles and Knuts, and says denominations are not canon prices (`src/world_packs/book_hp_pack.js`). Kept as a labelled divergence. A pack revision may bind the real units now that the ratio is shown.
- X7 (repo, authored anchors vs source): K8.W3-HP's four-price board (bread 2 Knuts, guest bed 8 Sickles per night, lesson 3 Sickles, kit 1 Galleon) is labelled INFERRED test anchors. The novels show different anchors (newspaper 5 Knuts, beetle eyes 5 Knuts a scoop, Knight Bus 11 Sickles, wand 7 Galleons) and no guest-bed rate was found (section 7). The authored board is not contradicted, but it also does not match any shown price; keep it labelled authored.
- X8 (repo, trolley): W7 HP-KM2 says the trolley costs "a Sickle or two" per snack from a companion page; the novel shows one armful of mixed sweets for 11 Sickles and 7 Knuts (B1:PDF-p81). Both can hold per item; the novel gives no per-item price.
- X9 (reader error, corrected): the W1 reader put Ollivander's payment at p65 to p66 and the W4 reader said the whipping form was "held by Filch"; Filch takes it from Umbridge's desk drawer (B5:PDF-p2606, opened). The W3 reader placed courtrooms "in the Department of Mysteries basement"; the text only says old Courtroom Ten is downstairs (B5:PDF-p1994, opened).
- X10 (edition): B1 reads as the US text and B5 as the UK text in one PDF. Two units appear with differing owl fares for a paper: five Knuts (B1:PDF-p48, as told by Hagrid) and a Knut (B5:PDF-p2095, p2165). Treat the newspaper fare as unit-dependent per edition, not as a conflict.

## 7. Searches that found nothing (WPR23)

Route: `grep -E` over the seven extracted books `book-01..07.txt` on 2026-10-23 (extraction can miss text on a failed page; it is not a PDF check).

| Search | Result |
|---|---|
| tuition, school fees | 0 hits in B1 to B7 |
| "fee" as a word | 1 hit each in B4 (typo), B5 (an unrelated negotiation), 2 in B7 (a Quidditch transfer, a typo); no school or hospital fee |
| Leaky Cauldron room price: "per night", "a night", "room and board" in B3 (the book with the pub chapter) | no price stated; the manager arranges a room (B3:PDF-p681 area) |
| Healer fee or cost, "visiting hours" | 0 hits |
| bribe, bail | 1 hit in B6, 2 in B7; not opened (late-story) |
| "house points" as a phrase | B1 3, B7 1; other books say "points" (so a regex on the phrase under-counts) |
| spell cost or mana | not searched this pass (census names only) |

## 8. Source spot-checks by the coordinator (WPR18, WPR19)

Every price, fee or rate in sections 4 to 6 was opened by `ctx.py` against the extraction (list under F2 and section 4). Beyond prices, these other high-consequence claims were opened and matched:

| # | Claim | Locator | Result |
|---|---|---|---|
| 1 | 17 Sickles to a Galleon, 29 Knuts to a Sickle | B1:PDF-p59 to p60 | matches (split by page tag) |
| 2 | Vault 713 and the roughly ten-year check interval | B1:PDF-p58, p60 | matches |
| 3 | Minister Fudge took the job when Dumbledore declined | B1:PDF-p50 to p51 | matches (Hagrid, STATED) |
| 4 | Hagrid expelled in third year, wand snapped, allowed to stay | B1:PDF-p47 | matches; the reader's "gamekeeper only in Harry's thought" is wrong, Hagrid says it |
| 5 | Term 1 September; reply by 31 July | B1:PDF-p40 | matches |
| 6 | House points rule and Cup | B1:PDF-p91 | matches |
| 7 | Slytherin six years, seventh at year end | B1:PDF-p100, p246 | matches both |
| 8 | Ministry levels 7 to 2, Mysteries after | B5:PDF-p1989 to p1996 | matches; reader's page numbers right |
| 9 | Charge text: Decree 1875 Paragraph C, Statute Section 13 | B5:PDF-p2001 | matches |
| 10 | Clause Seven; Charter of Rights | B5:PDF-p2010, p2004 | match |
| 11 | About fifty plum-robed judges with a W; scribe Percy | B5:PDF-p1998, p1999 | match |
| 12 | Wand security check: eleven inches, phoenix core, four years | B5:PDF-p1988 | matches |
| 13 | St Mungo's floors; Dai Llewellyn Ward; Healer-in-Charge | B5:PDF-p2392 to p2394 | match |
| 14 | Auror: five NEWTs, none under E; three years; none taken in three years | B5:PDF-p2594, p2597 | match |
| 15 | Snape takes only O in OWLs for NEWT; McGonagall E for hers | B5:PDF-p2594 to p2595 | match |
| 16 | Careers meeting first week of the summer term | B5:PDF-p2587 | matches |
| 17 | OWL grades O/E/A and P/D/T | B6:PDF-p2964 | matches |
| 18 | OWLs over two weeks, theory mornings, practical afternoons | B5:PDF-p2647 | matches |
| 19 | Apparition course 12 Galleons, 17 by 31 August | B6:PDF-p3280 | matches |
| 20 | Unforgivables carry a life sentence | B4:PDF-p1323 | matches |

Reader defect rate: Haiku misplaced one locator by one to three pages (W1), mis-assigned one object (W4), and added one unsupported place (W3). No price was misread this pass, unlike earlier passes; every price was still opened. Reader returns also repeatedly flagged ordinary words (a floor name, a day) as price lines; harmless, but the flag rate dilutes the flag.

Not opened and left "unverified" (reader-only): all of W2's secondary rows (ghost titles, Hagrid's tea hour of three, the password change page numbers), W3 rows on memos, weather staff, Perkins, patrol toilets, the Squib witness, the count of dissenting hands, W4's Ward 49, portrait labels, the leaflet on Curse-Breakers, Umbridge's mail screening note, Occlumency lines.

## 9. Open gaps with exact windows

| Gap | Window (extraction tag range; words) | Why |
|---|---|---|
| Train, platform, first-year arrival | B1:PDF-p69 to p91 (ch6, 6,369 words) | how a first-year gets from Diagon Alley to the Sorting; trolley shown |
| Halloween, Quidditch, first term events | B1:PDF-p131 to p155 (ch10 to ch11, 7,722) | Quidditch rules and flying cost; Christmas holiday stay |
| Book prices, Borgin and Burkes | B2:PDF-p299 to p323 (ch4, 5,894) | shop prices, book lists, Gringotts vault visit |
| Dueling Club | B2:PDF-p450 to p475 (ch11, 6,080) | extracurricular teaching institution |
| Leaky Cauldron lodging, Ministry minister, Fudge | B3:PDF-p681 to p703 (ch4, 5,163) | lodging, who pays, Ministry's role in the pub |
| Ministry in World Cup book | B4: chapters "Bagman and Crouch" and "Mayhem at the Ministry" (chapter headings in the extraction at lines 1863 and 390; page tags to be read by script) | Games and Sports department, Ministry staff roles; chapter detection failed for B4, so the window is not yet built |
| Umbridge decrees, Inquisitorial Squad, High Inquisitor | B5:PDF-p2091 to p2264 (ch12 to ch17, 46,000 words; split into four windows) | inspections, decrees, authority and its limits, how the Ministry overrides the school (tests E10) |
| OWL exam chapter | B5:PDF-p2641 to p2670 (ch31, 8,209) | exam procedure in full |
| Department of Mysteries [S] | B5:PDF-p2710 to p2760 (ch34 to ch35, 13,355) | late-story; read only if a Mysteries slice is chosen |
| Draco's Detour, Weasleys' shop, Borgin and Burkes | B6: "Chapter 6" at extraction line 3666 (page tags to be read by script) | shop prices for dark goods, 1,500 Galleon quote (B6:PDF-p2995) and 16 Galleons (opened as a hit only) |
| Apparition lessons | B6: chapters 17 to 18 near B6:PDF-p3280 | test procedure, instructor, failure |
| Ministry under occupation [S] | B7:PDF-p3849 to p3912 (ch11 to ch13, 17,604) | Registration Commission and pressure; late-story |
| Companion volumes (local, unread) | Calibre: `Hogwarts: An Incomplete and Unreliable Guide`, `Short Stories from Hogwarts of Power, Politics and Pesky Poltergeists`, `Fantastic Beasts and Where to Find Them`, `Quidditch Through The Ages`, `Tales of Beedle the Bard`, `History of Magic`; Cursed Child extraction `cursed-child.txt` (47,856) | supplementary school, Ministry and beast-classification detail; label C-X |
| Local Death Eater, Order, rival roles | not covered by any window; shown scenes exist in B6 and B7 | person-to-person rows for the political layer |

## 10. Review state (WPR21)

Highest state reached: **source-spot-checked** for the rows marked "opened" and for every price. Rules-reconciled only for the contradictions listed in section 6. Not built, not browser-verified, not director-accepted. A reviewer other than the author did not run (AU1: the coordinator opened sources; the Haiku readers are the first pass). Labels follow WPR4; unopened reader rows are marked unverified (section 8).

## 11. More to consider (round 1, WPR24)

ACT NOW (done here): F1 and X5 upgrade the coin conversion from a fan excerpt to a novel locator; X6 and X7 mark the pack and card divergences without editing them; section 7 records the zero-hit searches.

ACCOUNT FOR NOW:
- The two kit profiles (school-facing term slice, nursery/household) are still alternatives (contradiction C1 is OPEN). The floor card below picks the school-facing term slice only as the proposal that matches the windows read; it does not select the profile. The nursery profile can borrow K2, K3 (potions side), K8 prices and the Ministry laws unchanged.
- Hogwarts entry cost is the equipment list, not a fee. A "tuition" mechanic would be an invention (F3).
- A mixed-edition PDF means two units and spellings coexist. Pin one edition per fact (section 6, X10).

LATER/DELEGATE:
- Build the B4 and B6 chapter index (`chapters.py` returned 0 for both): a small script, haiku-level, done check: every chapter has a start and end page tag. Needed before the B4/B6 windows in section 9.
- Read B5 ch12 to ch17 (46,000 words, four windows) to test E10 and the "authority and its limits" question for the Inquisitor (sonnet-level synthesis after haiku readers). Done check: a table of each decree, who may enforce it, penalties, and which Hogwarts staff could refuse.
- Read the OWL chapter (B5 ch31) for exam procedure.

Suggestion list (not a reason to stop): a Hogwarts-year clock card (term dates, Christmas stay, Easter, exams); a Ministry staff ladder (Under-Secretary, Head, Minister, Auror ranks) from the first-hand Ministry chapters; a price ladder card built from `price_census.tsv`.

## 12. Next-pass ranking (WPR25) and links needed

Rank by readiness: (1) HP round 2 on the section 9 windows beginning with B5 ch12 to ch17 and B5 ch31 (largest effect on K2/K7 and K8 rhythm); (2) the nursery-profile pass (WG6 letters and post latency) using the owl-post rows here; (3) another world's institutions pass if Weibao orders it.

Links needed (this pass touched nothing else, WPR3, WPR28):
- `docs/worlds/harry-potter/WORLD_BRIEF.md` and `SOURCE_LEDGER.md`: link this file; add the novel-shown conversion beside H1.
- `docs/worlds/world-core-kit-2026-10-14/cards/harry-potter.md`: link this file under K2, K3, K6, K7, K8, K13; upgrade C2 and K8.W3-HP "coin names are MEMORY" to "shown in the novel, B1:PDF-p59 to p60".
- `docs/worlds/world-core-kit-2026-10-14/W7_MICRO_BY_WORLD.md`: MC5 and HP-KM4 can cite the novel locator.
- `docs/audits/WORLD_SUBTLE_GAPS_2026-10-20.md` (WG6, line 583 "Harry Potter ... have not had this pass"): note this pass.
- `docs/research/novels/LOCAL_LIBRARY.md`: add an HP entry (the seven novels are in `~/Downloads`, not Calibre; the companion EPUBs are in Calibre) because the file has none.
- `src/world_packs/book_hp_pack.js` unchanged; a follow-up could bind Galleons, Sickles and Knuts.

## 13. Floor card (WA6): five records

Floor tier means authoring readiness (WA6); none of these is a built or played claim. Profile used: the school-facing term slice, chosen because the windows read cover it; the nursery profile (C1) can reuse the same rows. Repo coverage was read from `src/world_packs/book_hp_pack.js`, `src/hp_brewing_*.js`, `tests/hp_brewing.test.js` (33 test cases) and `tests/world_pack_hp.test.js` (7 test cases) on 2026-10-23. The test counts were not run by this pass and prove only their own slice.

### K2 World laws (5 to 10 engine facts)

- Default: ten engine rows E1 to E10 in section 5 (underage gate, secrecy, wand as tool, Unforgivables, age and permission gates, house points, yard rules, money units, grade ladder, Ministry limits over the school).
- Dial: era (the Trace and Decree are 1875 and later), location (Muggle-inhabited or not), person (minor or adult), who enforces (staff, Ministry).
- In-world reason and cost: the Ministry detects minors' magic with the Trace (B7:PDF-p3706); costs are a hearing, a warning, school expulsion risk (B1:PDF-p47) and, for the worst curses, life in Azkaban (B4:PDF-p1323).
- Source locator and label: B5:PDF-p2001, p2010, p2004 (STATED, opened); B4:PDF-p1323, B7:PDF-p3706, B3:PDF-p643, B6:PDF-p3280, B1:PDF-p59 to p60, p91, p102 (STATED/SHOWN, opened).
- Current repo coverage: partial in spirit only. The pack has two access-law mechanics for a potion (student store versus private store, and a notice-and-standing penalty for unlicensed taking: `rules.noticeAfterMinutes`, `noticeStandingLoss`, `discoverStandingLoss`), labelled stated or original. No school, Ministry or age law exists as an engine fact. Kit card: K2 R missing.
- Smallest playable slice: five gate rows (E1 underage, E5 age and permission, E6 house points, E7 yard rules, E8 money) as pack facts with a consumer each: a spell attempt outside school by a minor opens a warning; a Hogsmeade trip checks a permission form; a class gives or takes a house point; coins convert at 17/29/493. Done check: one refusal and one allowed case per gate, and a save/reload that keeps the warning and the points.

### K3 Power core

- Default: the player's magic is a wand-mediated skill learned in classes and graded (Astronomy, Care of Magical Creatures, Charms, Defence Against the Dark Arts, Divination, Herbology, History of Magic, Potions, Transfiguration are the subjects on the results sheet, B6:PDF-p2964), with legality and tool as the limits, not a mana pool. Named techniques that the windows show: the Patronus Charm (charge text, B5:PDF-p2001), a Hover Charm (accusation, B5:PDF-p2011), the Full Body-Bind (B1:PDF-p219, seen in a classmate), a Switching Spell (B1:PDF-p125, stated by a classmate), and the Polyjuice Potion (already pinned in the pack). The census holds more (Riddikulus, Crucio, Engorgio, Reducio, Draught of Peace). Pick 3 to 6; no number is canon here.
- Dial: wand fit and owner, teacher, year, grade, legality (E1), setting.
- In-world reason and cost: the wand chooses its wizard (B1:PDF-p66); costs are lessons, practice time, a wand price (7 Galleons, B1:PDF-p68) and the legal risk. Misuse is policed (E1).
- Source locator and label: B1:PDF-p66, p68; B6:PDF-p2964; B5:PDF-p2001, p2011; B1:PDF-p219 (SHOWN or STATED as stated above; spell mechanics beyond naming are not read this pass, so they stay INFERRED/unverified).
- Current repo coverage: only the potion branch (Polyjuice formula, doses, degraded and failed outcomes, `rules.*`) is source-implemented and tested; no wand, class, grade or spell state. Kit card: K3 R missing. Built and browser state of the potion slice: unassessed here.
- Smallest playable slice: a first-year skill ladder of one subject (Charms or Potions) with a teacher, a wand and the O/E/A/P/D/T grade, three techniques taught in order, and one assessed lesson that sets the grade. Done check: learn, use, fail with a stated cause, grade written, saved.

### K6 Cast (minimum named people with roles)

- Default: twelve named people with roles from the windows: Dumbledore (Headmaster), McGonagall (Deputy Head, Transfiguration, Head of Gryffindor), Snape (Potions, Head of Slytherin), Hagrid (Keeper of Keys and Grounds, gamekeeper), Filch (caretaker), Percy Weasley (prefect, later Court Scribe), Madam Pomfrey (hospital wing), Griphook (Gringotts goblin who escorts), Ollivander (wandmaker), Cornelius Fudge (Minister), Amelia Bones (Head of Magical Law Enforcement), Dolores Umbridge (Senior Undersecretary, then inspector). Optional extras with located roles: Madam Malkin, Tom (the pub bartender), Madam Hooch, Flitwick, Sprout, Marchbanks (examiner, B5:PDF-p2645), Kingsley Shacklebolt (an Auror, B5:PDF-p1991).
- Dial: era (which staff exist), how often they appear, their attitude to a newcomer.
- In-world reason and cost: a newcomer meets a guide first (Hagrid), a Head of House next, the Ministry only through a hearing; costs are points, favours, trust.
- Source locator and label: B1:PDF-p40, p47, p57, p61, p68, p91, p102, p108, p111 (STATED/SHOWN, partly opened); B5:PDF-p1999, p2645 (opened); p1991 (Shacklebolt) from the W3 reader row, unopened.
- Current repo coverage: one unnamed role, "the Potions master", in the pack (`book.hp.cat.potions_master`, label "role, unnamed", B2:PDF-p454); three original household people (Mara Fen, Elias Brook, Nessa Vale) in `src/feature_expansion_book_roster.js` with no native binding. No canon cast, no schedules. Kit card: K6 R partial.
- Smallest playable slice: six canon people as schedule-bearing T2 records (Dumbledore, McGonagall, Snape, Hagrid, Filch, Percy) with role, place and one verb each (ask, report, dock a point, give tea, patrol, escort), reading and writing the K2 point and permission gates. Done check: each person appears at its place at its hour and a remembered act changes a reaction.

### K8 Daily life and economy (a school day, meals, prices, a term rhythm)

- Default: a first-year school day is a morning owl post at breakfast in the Great Hall (B1:PDF-p108), classes by subject (Herbology three times a week, Astronomy at midnight on Wednesdays, flying on Thursday, Harry's Friday afternoon free, B1:PDF-p107, p114, p109), a feast on arrival (B1:PDF-p98 to p100), dormitory with a password (B1:PDF-p105) and a midnight rule enforced by the caretaker (B1:PDF-p124). Prices from F2. Term rhythm: 1 September start, Christmas stay, Easter break, summer-term exams in two weeks, results by owl (B1:PDF-p40; B5:PDF-p2587, p2647; B6:PDF-p2964).
- Dial: year at school, house, whether the player boards or lives at home, region.
- In-world reason and cost: coin units 17/29; costs are the equipment list (no fees, F3), owl fares and train snacks, Apparition fee.
- Source locator and label: as above (SHOWN/STATED, opened).
- Current repo coverage: none for school life; a 60-coin slice purse and a 6-unit store stock in the pack (`startPurse: 60`, `storeStock: 6`) with prices "original". Kit card: K8 R missing; the card's authored price board (bread 2 Knuts, bed 8 Sickles, lesson 3 Sickles, kit 1 Galleon) is a labelled test anchor and is not in code.
- Smallest playable slice: one repeating school week (breakfast and post, three classes, a free afternoon, an evening rule) on a term clock with five priced goods (newspaper 5 Knuts, beetle eyes 5 Knuts per scoop, train armful, Knight Bus 11 Sickles, a wand 7 Galleons). Unfed play stays comfortable (accepted direction). Done check: a week passes with no menu skip; a purchase converts units correctly; reload keeps the week.

### K13 Signature loop

- Default: a term-week loop of learn, practise or brew, be assessed, earn or lose house points, and use the result in the next lesson. The one existing loop is the Polyjuice brew: gather inputs (student store, private store by loan, unlicensed take, harvest at the full moon), stew the lacewing flies 21 days, brew two days, split into three doses, risk notice and lost standing.
- Dial: potion chosen, teacher, assessment strictness, how closely the staff watch.
- In-world reason and cost: ingredients sit in two stores (student, private); stewing and moon timing cost days; misuse costs standing (pack `rules`); the brew is secret in a bathroom (B2:PDF-p427, p432).
- Source locator and label: B2:PDF-p432 to p433, p454, p486 to p488 (STATED/SHOWN per the pack's evidence list; not re-read this pass). Class assessment: B1:PDF-p110 to p112 (Snape quiz, a point lost, read in the census).
- Current repo coverage: the Polyjuice slice is source-implemented in `src/hp_brewing_state.js`, `hp_brewing_domain.js`, `hp_brewing_panel.js` and the pack, with `tests/hp_brewing.test.js` and `tests/world_pack_hp.test.js`. Build, browser and persistence states are unassessed by this pass. It is standalone: no school clock, house points or grades. Kit card: K13 R missing at the card's date; this slice postdates the card.
- Smallest playable slice that meets the floor: attach the existing brew to the term-week loop from K8: a Potions lesson assigns a brew, the existing cauldron and stores supply it, the teacher grades it on the O/E/A/P/D/T ladder, and house points change by the result (K2 E6). Done check: one rebuilt journey from fresh origin at the target desktop viewport through gather, brew, assess, points, save, reload, import (WPR32).
