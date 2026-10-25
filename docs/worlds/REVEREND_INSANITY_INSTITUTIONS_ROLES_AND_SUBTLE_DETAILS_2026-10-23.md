# Reverend Insanity: institutions, roles and subtle details (2026-10-23)

Research and proposals, not accepted decisions and not implemented. Pass: WPR9-WPR17 (places, roles, institutions and law, money and information, time, power subtleties, starts, failure, surfaces), mode reuse-and-check plus bounded read. Owner file: this one, created by instruction (WPR3). Links from the RI dossier and the Gu Wilds card are not made because the task said to touch nothing else; see Follow-ups. Review state reached: drafted, then source-spot-checked on 11 claim groups by the coordinator (WPR21). Nothing here is rules-reconciled, built, browser-verified or director-accepted. Sealed secrets: none touched; late-story material is tagged [S] and left to the private store (WPR8).

## 1. Source, edition, tier and budget

**Edition.** Held English EPUB, "Reverend Insanity - Gu Zhen Ren, Gu Zhen Ren.epub", Calibre ID 15, live path `~/Calibre Library/Gu Zhen Ren, Gu Zhen Ren/Reverend Insanity (15)/`. sha256 981c313a5f122272c0f6656df0071bfb43d37715e6ca20c10813a6341833e562. 2,363 spine members, 2,334 chapters keyed `chapter_N.xhtml`, about 4.90M words by my extraction. LOCAL_LIBRARY.md lists the entry as a user-supplied English compilation with qualified provenance and gives the path `~/Sync/CalibreLibrary/...`, which is stale (WPR23: the live file is under `~/Calibre Library/`). Translator and fidelity are unknown. Visible oddities that touch this pass: weight units "jin" and "jun" for strength Gu, "taels of primeval stone", "primeval elder Gu" (a stone-store Gu), "esteemed guest" as a courtesy title. Every number below is a translation-edition number. Chapter numbers match earlier RI notes (`chNNNN`).

**Tier of RI in the repo.** No world-core-kit card exists. RI has: a memory-tier "Gu Wilds" card (WORLD_CARDS.md section 3 and a later "memory of Reverend Insanity" entry); a five-file reader dossier from 2026-10-10 (ranks/economy, paths/dao, Gu refining, world/fate, fanfic) plus SYSTEMS_DEEP_DIVE and WIKI_CROSSCHECK; a 2026-10-11 world-design packet (DESIGN.md, a Qing Mao Mountain academy-youth opening); and a 2026-10-14 public-store playtest note. So RI sits above a bare kit-absent world on power, rank and economy, but no WPR completion level is assigned here (C0-C5 not graded); it had no facility table or role table for places and person-to-person roles before this pass. Dead reference: DESIGN.md D1 links `research/full-book/reverend-insanity/` (checkpoint, synthesis, claims.jsonl); that directory does not exist in this checkout. Treated as unavailable, not reused.

**Reused first (WPR2).** RANKS_ECONOMY (prices, stipends, merit, lifespan; its chapter list was used to avoid rereading price facts), WORLD_FATE_PROTAGONIST sections 2-3 (regions, clan law, raising a young Gu Master), DESIGN.md D1-D6, the Gu-refining and paths gaps lists, REPORT.md of the playtest note. Grep of the earlier notes for each chosen chapter (52, 172, 234, 277, 280, 296, 305-308, 325-327, 335-336, 359, 419, 441, 442) found the gap: they are mostly uncited, or cited for one price only.

**Why these windows (gap named for each, WPR2).** Earlier notes give prices and rank facts but not procedure: who runs a place, access, fees, guarantees, breach costs. A reread of a price-cited chapter (305, 307, 234, 326) is justified only because the gap is procedural.

| Window | Chapters | Words | Form | Named gap |
| --- | --- | --- | --- | --- |
| W1 (pilot) | ch296, ch305-308 | 10,602 | mixed: ch296 alone, then 305-308 consecutive | Shang auction house procedure, access, increments, leaks, lending |
| W2 | ch52, ch172, ch359, ch441, ch442 | 11,273 | excerpts: five non-adjacent whole chapters | Clan justice and punishment, Tie prison, northern-plains market and shops |
| W3 | ch234, ch277, ch280, ch327 | 11,157 | excerpts: four non-adjacent whole chapters | Warrants and bounty carriers, Gu rock-gambling den, battle stage, rumor and broker plan |
| W4 | ch325, ch326, ch335, ch336, ch419 | 10,494 | mixed: 325-326 and 335-336 consecutive pairs, 419 alone | Sect ladder and exams, master-disciple, information sale, inheritance contest |

Total read by readers: 43,526 words (about 0.9% of the book), all by whole-chapter extraction, no keyword excerpts. The census (keyword counts per chapter, all 2,334 chapters) was used only to choose windows, and a keyword-in-context check on 12 hits showed several regex hits are ordinary narration (ch325 "information" is dialogue about a tip, not a broker); for ch296 and ch234 the check was inconclusive (the two-hit cap was used by repeated title lines), though the readers later found a full auction and a warrant scene there. Census is not reading.

**Budget (declared plan, WPR7, AU2-AU6).** Coordinator (Sonnet) plus 4 readers, each a fresh Agent call with model "haiku" set in the first brief, one at a time, each on one pre-extracted window of at most 12,000 words, windows carry `[chNNNN pNN]` paragraph locators, each brief carried a short list of already-known claims so readers labelled new, corroborated or contradicted. W1 served as the pilot (AU4); its form worked unchanged for the rest. Repair reserve: 1, counted outside the 4 readers; used 0. Invocations used: 4 of 4 readers, 0 of 1 repair, plus 1 advisor call before windows and 1 before closing. Reader outputs live in the session scratchpad (`.../scratchpad/ri/R1.md` to `R4.md`), not in the repo; moving them to the gitignored private store is a follow-up. Reader tier: haiku throughout; no rerun on a stronger tier was needed. Readers returned a short digest and a file; the coordinator read each file.

**Source spot checks by the coordinator (WPR18-19).** Opened the extracted source text at the locator for each of these and compared:

| Claim | Locator | Result |
| --- | --- | --- |
| Super-sized auction every two years; large auctions rank 3+; fixed intervals | ch296 p93, p76, p70 | Confirmed. The biennial line is Fang Yuan's own inner saving plan, not a house announcement. |
| Auction sequence and guest identities are meant to be secret, yet Wei Yang's intelligence agency Feng Yu Manor supplies both | ch306 p06-07 | Confirmed (narrator: "should not be revealed"). |
| Bid steps 5,000 early, 3,000 near 90,000; outcry may start before the base bid | ch306 p82; ch307 p47 | Confirmed. |
| Rock dissection fee | ch277 p12-13 | **Reader error corrected.** Token holders have dissection free; the 650 stones is the price of the chosen rocks after discounts, paid first. R3's "650 dissection fee" entry is wrong; its "translation conflict" flag was a misread. |
| Sect exams 3-year small (inner), 8-year middle (elite), 15-year large (legacy); elders at least rank 4, leader rank 5, supreme elders rank 6, some 7 | ch335 p07, p09 | Confirmed. |
| Strength Gu ladder 220 / 690 / 4,550 stones for rank 1-3 | ch442 p10-12 | Confirmed (rank 4 36,000 not rechecked). |
| Betting house closed fast; young master demoted and exiled; battle stage a forbidden zone for that purpose | ch327 p58-59, p69 | Confirmed. |
| Clan inheritance favors males; clan jail is the default for defying teachers | ch172 p75; ch52 p64 | Confirmed. The jail line is Fang Yuan's thought about what would have happened. |
| Information-based warrants: 1,000 stone price is normally for named demonic cultivators, the Bai poster breaks the norm | ch234 p42-43 | Confirmed. |
| Fang Yuan's 400,000 tip sale to Wei Yang | ch325 p63-64 | Confirmed, unit not written on the line (inferred stones). |
| Slave prices by tier; five slaves for half a stone | ch441 p14, p33 | Confirmed. |

Not opened by me (marked unverified below): lending between allies, pawn and loan sharks (ch296 p33-42; ch306 p19-31), poison vow Gu settlement (ch296 p14), alias use, Shi Zi restaurant debt labor, Shang Bu Li's slave-trade control, Tie strike group composition, assassination bounty 10,000 plus a token (ch335 p57-60), Lord Sky Crane master-disciple details, most W3 battle-stage rules.

## 2. Places and institutions (WPR9, WPR11)

Labels: SHOWN (scene), STATED (character or narrator says it), INFERRED, PROPOSED. "R" = reader return; V = spot-checked, U = unverified.

| Place or institution | Who runs it and where | Cost and units | Access | Tiers, limits, hazards | Locator, label, check |
| --- | --- | --- | --- | --- | --- |
| Shang clan city large-scale auction house | Shang clan, Shang clan city (Southern Border) | No bidder fee, deposit or seller cut stated (not found) | Open to any Gu Master; large sales at fixed intervals; a super-sized one every two years | Large-scale lots rank 3+; set sales; late bids reopen the hammer; the house does not stop bluff bidding; unsold lots not shown | ch296 p70, p76, p93; ch307 p66-69. SHOWN/STATED. V |
| Same: bidding | Same | Open ascending outcry with a base bid; steps shrink with price (5,000 early, 3,000 near 90,000, 1,000 past 100,000) | Hall or silent private room; a room bid is announced by number | Host uses a sound-amplifying Gu; bids can precede the base bid | ch306 p82-85; ch307 p47. SHOWN. V (steps), U (room-number rule) |
| Same: purple thorn token | Shang clan issue | Token cost not stated | Esteemed-guest status: private room; advance buying at small sales; free rock dissection at the gambling zone; staff who offend a holder are reprimanded | R3 says a few hundred issued in thousands of years, UNVERIFIED (R3 cites ch277 p03-76; ch277 p03 opened and does not state it, so UNVERIFIED) | ch296 p59-60; ch277 p03-27. SHOWN. V (dissection free), U (rest, incl. issue count) |
| Same: lots and listing | Same | Lots in a known numbered sequence | Categories: rare Gu, Gu food, refinement materials, recipes, "inheritance information", gambling rocks, slaves, captured beast kings, sold in sets too | Recipes may skip appraisal because appraising risks leaking the recipe; authenticity unverified at sale | ch296 p77; ch308 p68, p77-79, p101. SHOWN/STATED. V (p79) |
| Same: leak risk | Wei Yang's Feng Yu Manor, Shang intelligence arm | Not priced | Clan-internal, secret | The text calls leaking sequence and guest identity against the usual rule; no penalty shown | ch306 p06-07; ch327 p73-74. STATED. V |
| Gu rock-gambling den (Shang city) | A shopkeeper, dissection counter, 5 senior masters (one rank 3, four rank 2 peak) and junior dissectors | Pay for the chosen rocks first; token holders dissect free (corrected, section 1); rock grades scrap to stellar; long-run loss example over 100,000 in under a month | Anyone | Interrupting a dissection can ruin the rock; refund shown when interrupted but the shopkeeper uses the threat of withholding it | ch277 p08-16, p50; ch280 p110-130. SHOWN. V (fee), U (rest) |
| Battle stage (Shang city) | A host Gu Master who edits a win-record vine information Gu | No fee shown; victor takes the loser's possessions | Challenge, surrender allowed; killing not forbidden by rule | Betting on it is banned (see below); clan guards the stage closely because demonic fighters can be recruited as external elders | ch280 p44-63, p100; ch327 p53-59. SHOWN/STATED. V (ban), U (rest) |
| Betting house (banned) | A Shang young master tried it | 500,000 stones in two days | Closed on day three | Young master demoted and exiled; Shang Xin Ci's ranking/forecast broker plan sits close to this line | ch327 p55-69. STATED. V |
| Northern-plains tribal market (Man tribe area, ch441-442) | Tribe-held; no named owner | Strength Gu: rank 1 jin 220, rank 2 ten-jin 690, rank 3 jun 4,550, rank 4 ten-jun 36,000 (on order); rank 3 wolf soul Gu 7,700 each; five mortal slaves for half a stone | Gu Masters in the central zone, mortals as carriers only; no guards, strength is the barrier | Demonic Gu Masters come to sell loot "whenever the market opens"; rank 4 Gu held by one shop; a bulk buyer (500,000-600,000 stones in five days) was known to every shop within three days | ch441 p14-33, p64-84; ch442 p10-75. SHOWN/STATED. V (prices, slaves), U (rest) |
| Tribal slave sale | Same market | Priced mortal < variant human < Gu Master | Open square, Gu-Master guards | No authority shown | ch441 p14, p33. SHOWN. V |
| Immortal Crane Sect (Central Continent) | Sect leader (rank 5) and elders (rank 4+), supreme elders rank 6-7 | No fee or stipend shown (not found) | Recruited by talent and character; no regional priority; no C-aptitude disciples shown | Ladder: outer, inner, elite, legacy, elder, leader, supreme elder. Exams: 3-year small to inner, 8-year middle to elite, 15-year large to legacy. Loyalty must be proved by missions before elder status | ch335 p04-26; ch419 p41-44. SHOWN/STATED. V (ladder numbers) |
| Sect inheritance contest (Bai Hu) | Ten top sects' lords agree not to strike | None | Each sends elite disciples to compete "fairly" | Truce among lords; no breach penalty shown | ch335 p34-38; ch336 p40. STATED. U |
| Hu Immortal blessed land (held by Fang Yuan) | Owner | Land in square kilometers; discarding land hurts the land | Gu worms can pass a loophole, Gu Masters cannot; a loophole can widen to a tunnel | Degrades over time | ch419 p70-80. SHOWN. U |
| Tie clan "holy land" and Demon Suppression Tower | Tie clan | None | Clan offers "guest" protection and a "fair trial" to a killer of one of its Gu Masters, or redemption by service | A rank 5 outsider entered and left the tower at will and the clan hides it from Wu and Shang | ch359 p56-66. STATED. V (p56 opened, rest U) |
| Gu Yue clan: academy discipline and jail | Academy elder (rank 3 in the text), hired outsider guards | None | Elder checks a student's aperture by touch; hidden Gu can evade it | Default sanction for defying teachers: clan jail, no term given; outsider guards are not protected by the clan | ch52 p17-70. SHOWN/STATED. V (p64), U (rest) |
| Gu Yue clan: post-wolf-tide redistribution | Remaining elders (fewer than ten) | "Interest cake" shares | Elders | Plotting and trapping among elders; punishment of a needed elder is softened | ch172 p14-29. SHOWN/INFERRED. U |
| Caravan | Vice leader (a Gu Master) and servants | No admission fee; the favor of vouching is "sold" later | Mortal hamlets can join only if a route Gu Master vouches | Whipping for dropped goods, hazing of newcomers who bring goods; warrants arrive by shouting messenger | ch234 p17-96. SHOWN. U |
| Shang pawn and loan sharks | Not named | Bai Feng: 300,000 borrowed on elder status, 200,000 raised by pawning Gu; interest not stated | Elders borrow more | Core Gu may be pawned under pressure | ch296 p33-42. SHOWN. U |

Searched where and not found (WPR23): auction fees, escrow, guarantors, after-auction safety (W1, ch296 and ch305-308 only); a written clan code, an appeal route, prison terms, black-market fees or vendor vetting (W2); how a warrant is issued, cancelled or paid, a bounty board, shop licensing, divination (W3); disciple stipends, tuition, mission pay, leaving a sect (W4). These are absent from the 43.5k words read, not from the book. Hidden shops, Gu worm refineries as businesses and resource caves for rent were not in any window; the earlier dossier covers Treasure Yellow Heaven ([S] immortal tier).

## 3. Person-to-person roles (WPR10)

| Role | What it does and owes | Access and cost | Failure or hazard | Locator, label, check |
| --- | --- | --- | --- | --- |
| Auction host | Calls bids, reads identity, withholds recipe detail; female host is experienced | Staff of the house | Wrong appraisal risk; host cannot stop a bluff | ch308 p81-95; ch296 p53. SHOWN. U |
| Intelligence head (Wei Yang, Feng Yu Manor) | Buys and sells tips, leaks auction order to allies, lends | Patron of Fang Yuan's cover; paid 400,000 up front for a tip | Buyer's evaluation unresolved; Wu clan spy also buys | ch325 p63-72; ch306 p06. SHOWN. V |
| Ally lender | Lends primeval stones via a stone-store Gu with no date (about 1,000,000 and 100,000-300,000) | Personal relationship | Repayment informal | ch306 p19-31. SHOWN. U |
| Patron who staffs a client | Sends a rank 3 manager or servants; real aim may be control; the client declined | Offer made by a young master | Staff can take over the business | ch327 p82-92; ch325 p23-30. SHOWN/INFERRED. U |
| Caravan vice leader / vouching sponsor | Vouches mortals into the caravan, delays for leverage | Favor owed later | Ignored warrant if no link made | ch234 p20-58. SHOWN. U |
| Sect leader / elder | Picks elders by exam, tests loyalty with missions, can order a disciple to negotiate or be sacrificed | Rank floor 4 for elders, 5 for the leader | A disciple's grudge yields to the sect | ch335 p14-25; ch419 p56-65. SHOWN/STATED. U |
| Master-disciple (Lord Sky Crane and Fang Zheng) | [S, mid-story] Soul-in-aperture guide, secret experience, sometimes body control, plus a loyalty-to-sect line | A rare, supernatural arrangement | Master fears the disciple losing drive | ch336 p44-53; ch419 p49-55. SHOWN. U. Relationship is not a generic mentor model. |
| Manager recruit (Zhou Quan) | Needs rank 3, trade experience, standing; refused a junior and a reprimanded recruiter lost face | Reputation barrier | Loyalty to a former boss does not transfer | ch325 p30; ch327 p27, p88-91. STATED. U |
| Rival steward | Spreads slander and rumors about a young master's recruit | Secret mobilised people | Target lost a recruit and prestige | ch327 p27-29. STATED. U |
| Warrant poster (Bai clan) | Pays 1,000 for information, 5,000-8,000 for a kill, by notoriety norm | Open to anyone who reports | Poster set by hatred, not rank; unchecked distance assumption | ch234 p34-58. SHOWN. V (p42) |
| Assassin team | Takes an assassination bounty of 10,000 plus a token against rank 4 targets with rank 3 peak killers | Hired | Fears the target's Gu Immortal kin | ch335 p57-60. STATED. U |
| Clan elder / family head | Judges clan juniors with discretion; punishment scaled to usefulness; inheritance goes to a male heir, a married-in son-in-law is an accepted route | Clan seat | Daughter's assets pass to her husband | ch172 p20-82. STATED. V (p75) |
| Tie clan investigator and young masters | A group is led by a junior young master over seniors by exception; a "Divine Investigator" title exists | Eight young masters may contend for leader | None shown | ch359 p11-26. STATED. U |

Rivalry and betrayal norms seen: a Shang young master's bid-up war is allowed by the house (house profits either way, ch308 p12-13, a bystander's thought, not a rule). Fang Yuan's earlier-noted rules for people who know secrets live in WORLD_FATE_PROTAGONIST section 5.2. Mentor, academy teacher, merchant and master-disciple beyond the cases above were not read in windows; the Gu Yue academy materials are in the earlier dossier.

How a young Gu Master joins and rises (from earlier notes, not reread): Awakening at 15, academy year, graduation at 16 into five-person clan groups, stipend ladder 3 stones/week student to 100/week elder (WORLD_FATE section 3.3, RANKS_ECONOMY section 4). This pass adds the sect branch (recruit by talent; exams 3/8/15 years; loyalty missions) and the independent branch (caravan vouching, tribal market, battle stage) as cross-cuts.

## 4. Money and information (WPR12)

| Item | Value or rule | Locator, label, check |
| --- | --- | --- |
| Rank 3 Gu at Shang auction | Frost breath base 23,000, sold 38,000; flame heart base 30,000, sold 42,000 | ch306 p77-93 (R1). SHOWN. U |
| Rank 4 Gu at Shang auction | Frost arrow base 70,000 sold 150,000; chasing wind base 180,000 sold 440,000; atmosphere base 260,000 sold 500,000; bitter strength (market near 380,000) sold 810,000 after a bid war. Thousand-year wind willow (a rank 5 use material, per R1) base 50,000, sold near 100,000 | ch306-307 p05-103 (R1). SHOWN. V for atmosphere (ch308 p47, p57), bitter strength (ch307 p57, p103; ch308 p23); U for the rest |
| Recipe lot | Lotus recipe base 500,000, sold near 670,000; recipes generally cost more than the Gu they make | ch308 p88-107. SHOWN. U |
| Strength Gu retail | 220 / 690 / 4,550 / 36,000 stones, ranks 1-4; ratios about 3.1x, 6.6x, 7.9x per rank | ch442 p10-19. SHOWN. V (ranks 1-3) |
| Rank 3 soul Gu retail | 7,700 each | ch442 p56-58. STATED. U |
| Warrant prices | 1,000 information, 5,000-8,000 kill | ch234. SHOWN. V |
| Information sale | 400,000 up front for a rank-significant tip about a three-kings inheritance (unit inferred) | ch325 p63-64. SHOWN. V |
| Mortal labor | Five male slaves for half a stone | ch441 p14. SHOWN. V |
| Bluff premium | Frenzied bidding about 2x market on one lot | ch307 p103. SHOWN. U |

Information. Tips are traded for large sums (400,000 for one), the holder of a city's intelligence arm sells and withholds, the auction order and guest list are officially secret and unofficially for sale to allies. A broker's rankings business is proposed (Shang Xin Ci, ch327 p43-76), not running, and sits near the banned betting line. Rumor failures are shown (a detailed rumor about a legendary Gu proved wrong, ch280 p134-160, INFERRED). Divination Gu and brokers on the black market: not found in any window (W3 NOT FOUND); the census flags ch838 (information 23 hits), ch1700, ch1818 as places to read [S].

Tension to keep (WPR20): RANKS_ECONOMY lists a rank 3 Gu at about 800 and silver relic Gu at 30,000-50,000. The source itself says an ordinary rank 4 Gu costs up to 100,000 (ch296 p81, opened), yet auction lots went 150,000-810,000, and the 810,000 buy is called almost twice market (ch307 p103, ch308 p23, opened). Retail versus auction and rare lots; both stand.

## 5. Time and rhythm (WPR13)

| Item | Default | Dial and reason | Locator, label |
| --- | --- | --- | --- |
| Large-scale auctions | At fixed intervals; a super-sized one every two years | Interval is Fang Yuan's own understanding, not a posted schedule | ch296 p70, p93. SHOWN/STATED. V |
| Shang Auspicious Festival | Young masters send invitation cards to a leading candidate, who must choose one | Choosing rules out the others | ch325 p04-05; ch326 p67-73. SHOWN. U |
| Sect exam cadence | 3, 8 and 15 years | Elimination at each step | ch335 p07. STATED. V |
| Market run | A market opens for a stretch (thirteen days in the shown run), demonic sellers appear when it opens | Not a posted calendar | ch441 p70; ch442. SHOWN. U |
| Wolf tide, stipends, aperture opening, rank windows, lifespan | See earlier notes | Not reread | WORLD_FATE section 3.2-3.4; RANKS_ECONOMY sections 1, 4, 5 |

Not found: lunar or seasonal cycles tied to any institution in the windows. Awakening and rank-up rhythm are covered by the earlier dossier.

## 6. Power subtleties and costs in the windows (WPR14)

- Pre-refined Gu transfer control to the buyer at sale, wild Gu resist refinement (ch442 p56-58, STATED/SHOWN, U). Feeds the "Gu custody versus refinement" split in the 2026-10-14 proposals (RI-P1).
- Aperture inspection by an academy elder cannot detect a hidden high-rank Gu (ch52 p21-70, SHOWN, U).
- Rank floors for roles: a manager needs rank 3; sect elders rank 4+; leader rank 5; supreme elders rank 6-7 (ch325, ch335).
- Aptitude: this sect shows no C-grade disciples, B most common, A common (ch335 p11-12, SHOWN). Clans rely on blood and nurture clansmen; sects test loyalty and clans do not (ch335 p14-16).
- Ruthlessness: sects will sacrifice an elite disciple; a Gu-Immortal-linked victim brings retaliation risk for killers (ch419 p56-65; ch335 p57-60, U). The world rewards a bluff at the auction where the house takes the profit and punishes a betting house with exile. Both show institutions policing business that threatens their order, not violence itself.
- Dissection masters spend primeval essence heavily for small success gains (ch277 p50, SHOWN, U).
- Not read: Gu worm failure and backlash, path mastery, what each Gu cannot do (see GU_REFINING_KILLER_MOVES, PATHS_DAO_VENERABLES).

## 7. Starts, failure, aftermath, surfaces (WPR15-17)

- **Starts.** This pass proposes three non-standard entries for DESIGN.md D2 (DESIGN.md was not edited): a caravan mortal recruited by vouching (ch234), a tribal-market trader, and a sect recruit (outsider with talent, ch335). All are INFERRED start sketches, not shown starts; none is a proposal to build.
- **Failure and aftermath.** Fleeing battle costs elder status, penalty softened by need (ch172); defying teachers means clan jail (ch52); banned betting house means demotion and exile (ch327); a sect may sacrifice a disciple (ch419); a debtor labors at the door (ch296, U); a refunded dissection can be threatened (ch280, U). The Tie clan hides a prison breach rather than punish it (ch359).
- **Surfaces.** A numbered lot list, room numbers, win records on a vine Gu, and a notice shouted by a messenger are the in-world surfaces. For a player UI: lot order, a quiet-room bid, a posted warrant and a sect ladder are natural panels. Not tied to UI rules; PROPOSED only.

## 8. Findings (F-list)

| Code | Finding | Label and check |
| --- | --- | --- |
| F1 | The Shang auction is open outcry with a base bid, shrinking steps, silent numbered private rooms, no stated fees and a secret lot order that an intelligence head leaks to allies. | SHOWN/STATED. V (steps, leak) |
| F2 | Rank 4 Gu sell for 150,000-810,000 at auction while the source calls ordinary rank 4 up to 100,000; bluff bidding is allowed. | SHOWN. V for 500,000 and 810,000 lots and the 100,000 line; U for 150,000 and 440,000 |
| F3 | Clan justice is elder discretion, not statute: jail default, penalty softened by usefulness, male-heir inheritance, interest redistribution after losses. | STATED/INFERRED. V (jail, heir) |
| F4 | Sects run a ladder with 3-, 8- and 15-year exams, loyalty missions before elder status, and willingness to sacrifice a disciple; the 15-year large exam is new to the repo. | STATED. V |
| F5 | Information is a priced good (a tip sold for 400,000), an intelligence arm is secret by policy, and the clan bans betting while a forecast broker sits next to it. | SHOWN/STATED. V |
| F6 | A bounty is priced by notoriety norm and carried by shouting messenger; no cancellation or payout procedure was found. | SHOWN. V (norm) |
| F7 | A tribal market zones by strength (Gu Masters center, mortals carry), sells strength Gu on a clean rank ladder, and a buyer's spree is known to every shop in three days. | SHOWN. V (prices) |
| F8 | A purple thorn token gives room, advance buying and free dissection; the dissection fee reader claim was wrong (650 is the rock price). | SHOWN. V |
| F9 | Caravan admission runs on a vouching favor that the sponsor sells later; hazing targets newcomers carrying goods. | SHOWN. U |
| F10 | Allies lend stones from a stone-store Gu informally; elders can also pawn Gu. | SHOWN. U |

## 9. Engine facts (default, dial, reason; WPR5, WPR31)

| Fact | Default | Dial | In-world reason and cost | Exceptions the text shows |
| --- | --- | --- | --- | --- |
| Auction as a shared mechanism | Ascending outcry, base bid, shrinking steps, numbered private rooms | Fee, deposit, lot order secrecy | The clan wants volume and prestige; a leak costs nothing visible | A leaked order helps the clan's own generals (ch306) |
| Venue access by token | A purple thorn style token buys rooms, advance buying and free service | Number issued | Reward for a patron's favor; staff discipline for slights | A few hundred ever issued (stated by a clerk) |
| Clan sanction | Elder discretion, scaled to usefulness | Elder power, clan need, tribe custom | Needed fighters are softened; jail is the default for defiance | Fleeing in battle still costs the seat |
| Business bans | Forecast or betting business forbidden near a battle stage | Clan policy, patron | The clan fears distortion and demonic hostility | Secret investigation instead of open policing |
| Sect progression | Exam cadence + loyalty mission | Cadence length, exam strictness | Sects choose by talent, so the top tiers are thin | Elders outfight same-rank disciples |
| Information price | Priced by buyer need and the seller's story | Seller's trust and risk | Half-truth about the source holds until the buyer verifies | The buyer may learn facts within days anyway |
| Warrants | Priced by notoriety; carried by the nearest group that moves | Poster's hatred, medium | Distance protects the wanted; nobody checks | A striking face can attract a full bounty |
| Market rank ladder | Per-rank retail grows about 3x then 7x | Local stock, reputation | A buyer's visible spending moves prices and attention | Stock cornering by an external elder |

## 10. Contradictions and tensions (WPR20)

| Id | Claim A (source) | Claim B | Chosen reading, owner, status |
| --- | --- | --- | --- |
| C1 | RANKS_ECONOMY: rank 3 spiral bone spear Gu about 800 (ch262); silver relic Gu 30,000-50,000 (ch111). | Auction: rank 3 frost breath sold 38,000 and rank 4 Gu sold 150,000-810,000 (ch306-308). | Weak tension, no direct repo-doc contradiction: retail versus auction and rare lots. RANKS_ECONOMY has no rank 4 price line. Internal to the source: ch296 p81 says an ordinary rank 4 Gu could cost up to 100,000 (opened), while lots sold above it; ch307 p57 gives a 380,000 market price and ch307 p103 calls 810,000 almost twice that (opened). Open. |
| C2 | WORLD_FATE section 2.2: Shang clan city is a free market for demonic goods. | ch327: battle stage tightly guarded, betting banned, secret investigation to avoid demonic hostility. | Both stand: open trade with managed edges. Owner: WORLD_FATE. Open. |
| C3 | WORLD_FATE: sect exams every 3 and 8 years (ch334). | ch335 p07 adds a 15-year large exam for legacy status. | Extension, not contradiction. Owner: WORLD_FATE. Reconciled by this doc. |
| C4 | R4: sect leader rank 5 (ch335 p09). | R4: leader at least rank 5 middle stage (ch419 p42). | Chapter-level refinement; not resolved, ch419 not opened by me. Open. |
| C5 | R3: dissection costs 650 stones; shopkeeper also says it is free for token holders. | Source text: 650 is the rock price after discount, dissection free (ch277 p12). | Source wins; reader error. Resolved. |
| C6 | DESIGN.md D1 relies on a full-book claims set under `research/full-book/reverend-insanity/`. | That directory is absent. | Treated as unavailable. Owner: DESIGN.md. Open. |
| C7 | DESIGN.md D2 RIE: caravan outsider needs papers or a guarantor. | ch234: mortals join by a route Gu Master's vouching; no papers shown. | Corroborated in spirit; the fee-free favor economy is new. Owner: DESIGN.md. Open. |
| C8 | RANKS_ECONOMY: the Jia family treehouse trade house keeps prices confidential and uses sealed bids (ch111). | Shang auction: open outcry with announced prices (ch306). | Different houses with different procedure. Both stand. Open. |

## 11. Gaps and unread windows (WPR7, WPR23)

Read: 43,526 of about 4,904,500 words (0.9%). Unread parts, named with exact windows and a suggested reader:

| Gap | Window | Why [S] marks apply |
| --- | --- | --- |
| Shang city services, courtesan trade, Shi Zi restaurant | ch259-265, ch282 | Early; no [S] |
| Jia trade house sealed-bid procedure | ch111 | Early; procedural reread |
| Gu Yue storeroom, medicine hall, wolf-tide merit board, mission rules | ch62, ch89, ch127-133 | Early |
| Elder stipends, marriage rights, loans | ch148, ch155 | Early |
| Demonic path alliance army, Tie clan holy land | ch391, ch359-360 | Mid |
| Immortal-tier auction and Treasure Yellow Heaven fees | ch747-752, ch466-469 | [S] mid-late |
| Information brokers and divination | ch838, ch983 | [S] |
| Merit obelisk missions, negative merit | ch1658, ch1911 | [S] |
| Justice at immortal scale | ch884-885, ch1820, ch2145 | [S] |
| Master-disciple at immortal scale | ch2008, ch1870, ch1877, ch828-829 | [S] |
| Sect-to-sect alliance and diplomacy | ch696-705, ch839, ch1008 | [S] |
| Late-book markets | ch1456, ch1896, ch2122 | [S] |

Also unread in any window: Gu refineries as businesses, resource-cave leasing, hidden shops beyond the tribal market, black-market brokers proper, lunar or seasonal cycles, funerary or inheritance law at village level.

## 12. More-to-consider round (WPR24)

| Class | Item | Done check |
| --- | --- | --- |
| ACT NOW (done) | Record the reader error on the dissection fee (C5) and the speaker of the biennial-auction line. | Present here. |
| ACT NOW (done) | Keep the 15-year large exam as a new fact rather than overwriting WORLD_FATE. | C3 above. |
| ACCOUNT FOR NOW | Any RI start or store slice should model auctions, sects and clan sanctions as mechanisms with data rows, not as scripts (WPR31, AD38). | A slice names a gate, a clock, a role and a cost row. |
| ACCOUNT FOR NOW | Mark the numbers in sections 2-4 as translation-edition numbers; do not import them as fixed constants. | Pack rows cite locator and edition. |
| ACCOUNT FOR NOW | Prices from R1 other than the opened lots (frost breath, flame heart, frost arrow, chasing wind, recipe) and W3-W4 details marked U are not yet source-opened; open the locators before using them in a pack. | Spot check of those ch306-308 price lines. |
| LATER/DELEGATE | Black-market and broker pass, with divination. Level: haiku reader on ch838, ch983 plus a short sonnet synthesis. Effort: about 12k words. Done check: a fee, access and breach row each, or a "not found, searched where" line. | A filled broker table. |
| LATER/DELEGATE | Shang city services pass (ch259-265, ch282) to turn price anchors into a facility table. Level: haiku. Effort: about 11k words. Done check: five rows with who runs, cost and access. | Table plus two spot checks. |
| LATER/DELEGATE | Clan code and wolf-tide merit procedure (ch62, ch89, ch127-133). Level: haiku. Effort: 12k words. Done check: sanction table with a locator per row. | Table plus spot checks. |
| LATER/DELEGATE | Gu failure, backlash and "cannot do" list reconcile with GU_REFINING_KILLER_MOVES. Level: sonnet, no new reading. Effort: low. Done check: one row per Gu family. | Table. |

Suggestions (separate, short): treat a "token" as a general venue-access mechanism, and a "vouching favor" as a general debt mechanism, both reusable across worlds; check the Paradise facilities doc for the same mechanisms.

## 13. Ranked next list (WPR25)

1. Shang city services plus Jia trade house (ch111, ch259-265, ch282): about 11-12k words, closes the facility table that the economy notes imply but never state.
2. Clan code and wolf-tide merit (ch62, ch89, ch127-133): about 12k, completes WPR11 for the starting clan.
3. Black market, brokers and divination (ch838, ch983 [S]): about 12k, closes the information row.
4. Merit obelisk and Gu Immortal daily schedule (ch1658, ch1911 [S]): defers behind the first milestone's mortal scope, per AD direction (one realm first).
5. Immortal-tier auction and Treasure Yellow Heaven fees (ch466-469, ch747-752 [S]): defer.

Rank 1-3 each need one haiku reader with the same window form; a fresh pass is a separate decision (WPR1).

## 14. Review state (WPR21) and follow-ups

Highest state reached: drafted, with 11 claim groups source-spot-checked by the coordinator (not by a separate reviewer; WPR18's other-reviewer rule is met only in that the reader authors differ from the coordinator checker). Not rules-reconciled with AD, WA, PIR or ECR codes in detail; touched codes: WPR1-WPR32, AU1-AU6, AU13, AD38, AD5, WA3, WA8, WA11 (sealed secrets). Not built, not browser-verified, not director-accepted. No conflict with standing direction found; nothing here changes a priority or opens a deferred gate.

Follow-ups, not done because the task said to touch nothing else (WPR3, WPR28):
- Link this file from `docs/research/novels/reverend-insanity/` (a README or the dossier index) and from the Gu Wilds entry in `docs/WORLD_CARDS.md`.
- Move the reader returns R1-R4 and the extraction scripts from the session scratchpad to the gitignored RI private store.
- Register the pass in the WPR "lessons carried in": haiku readers return reliable structure but can misread a pricing line (C5), so each price or fee claim should be opened at its locator before it enters a pack.
- Fix the stale path in `docs/research/novels/LOCAL_LIBRARY.md` (from `~/Sync/CalibreLibrary/` to `~/Calibre Library/`).
- Decide whether `docs/research/novels/reverend-insanity/world-design-2026-10-11/DESIGN.md` D1 should drop or restore the dead `full-book` links.

## 15. W5 Shang city services and the Jia trade house (2026-10-24, source-gap coordinator, Sonnet 5.5)

State reached: drafted from two Haiku reader returns, then source-spot-checked by the coordinator on 19 locators opened in the held EPUB extraction (not a separate reviewer, WPR18 note as in section 14). Not rules-reconciled, built or accepted. Edition and unit: same English edition as section 1; every money figure is in primeval stones as written. Windows: ch111 and ch259-262 (10,511 text words, consecutive within 259-262), ch263-265 and ch282 (8,310 text words). Private returns: `docs/research/novels/reverend-insanity/passes-2026-10-24/RA_return.md`, `RB_return.md` (gitignored).

| Institution or service | Rule, price or access | Locator, label, check |
|---|---|---|
| Shang outer gate | Toll 10 per person; misuse of Gu inside the city draws at least 7 days in prison | ch259 p58, p64 (Fang paid 20 for two). STATED/SHOWN. V |
| Four Seasons restaurant | Five floors by rank: mortals, rank one, rank two (20 percent off), rank three (50 percent off), rank four (free per reader, floor four text not reopened). Fang paid 15 after the 50 percent discount; list price INFERRED 30 | ch259 p98; ch260 p45. V for the 15 |
| Inner city entry | 100 per person from the outer city; fifth to fourth inner city sentry without a token 200 per person; third inner city without a token 600 for the pair (the text says both would pay six hundred); higher districts need a token of the right authority | ch260 p88; ch261 p02, p06, p23, p48. V |
| Lodging | Outer-city broker pitch of half a stone a night (a sales pitch, not a posted rate); no inns in the third inner city, only gardens at 30 a day (300 for ten, near 1,000 a month), large gardens 100 a day, special gardens need the Shang clan token with no price | ch259 p76; ch263 p66-69. V |
| Gu caretaking zone | Ordinarily 80 a month for a rank one Gu, "price determined by situations" | ch265 p13. V |
| Gu dealer (Tong Ou shop) | Dealer table: ordinary rank one about 250, rare rank one 580-600, one-time Gu 50; Fang sold bone spear Gu at 320 (56 for 17,920), spiral bone spear at 800, a rank three bone spike quoted at 7,000 and sold at 6,700 (total 40,620 stated); a recipe bid ran 200,000, 300,000, 500,000 (the elder's authority limit) against Fang's ask of 680,000 | ch262 p04-06, p17, p21-22, p25, p29, p40-52. V for those opened |
| Dealer price suppression | Against the rules; severe punishment if found | ch264 p03. STATED, no scale. V |
| Gated sales | A shop sold a flash of inspiration Gu at 29,000 but only to a purple thorn token holder; Fang lacked the token | ch282 p34, p40. V. Whether the purple thorn and Shang clan tokens are one item is not shown |
| Restaurant seat and brothel | A window seat reserved for half a stone (a shop assistant's claim); a top courtesan rumored near 10,000 for a night | ch282 p62, p65. STATED rumor. V |
| Jia treehouse (trade house) | Bids are secret and final prices are not disclosed to losing bidders; display time after a bid: rank one half a day, rank two one day, rank three two days; unwanted Gu stay displayed until someone bids; a supervisor may transfer a spare from the warehouse to a favored buyer at about 20 stones above the winning price. Prices seen: silver Relic Gu 30,000 listed (a character expects at least 50,000), red steel Relic Gu marked 3,000 (Fang expects 5,000 to 8,000) | ch111 p09-15, p23-30, p41-47, p84, p88. V |

Not in these windows (searched, WPR23): Gu fighting zones, battle stages, the auction schedule beyond the Jia display times, the red-light zone's access rule, a courtesan fee schedule, gambling, Early Spring menu prices. Readers reported them absent or unpriced; those absences are window absences.

Corrections and tensions. (1) Bone spike: no error. Fang quoted 7,000 and settled at 6,700 (ch0262 p25-27); 17,920 + 16,000 + 6,700 equals the stated 40,620 (ch0262 p29). Keep quote and sale separate. (2) The third-gate "six hundred" is one total for two people, not per person. (3) Section 4's note that a rank one Gu retails near 220 (strength Gu, ch442) sits beside ordinary rank one at about 250 (ch262 p05); both stand as retail anchors. (4) The recipe offers of 500,000 and 680,000 carry no unit on the line; stones inferred.

Budget used: two Haiku readers (agents `a0b057b5d7dbc7b60`, `abc12854568296ff3`), 7 of 12 allowed responses, 19,000 text words (limit 36,000 total). Still unread: ch259-265 show the outer city and inner districts only to the third inner city; second inner city, courtesan houses proper and Shi Zi's restaurant debt labor are not read.
