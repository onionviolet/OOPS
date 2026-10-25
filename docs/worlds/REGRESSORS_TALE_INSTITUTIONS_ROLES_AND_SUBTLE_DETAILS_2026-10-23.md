# A Regressor's Tale of Cultivation: institutions, roles and subtle details (2026-10-23)

Research and proposals, not accepted decisions and not implemented. Pass: WPR9-WPR17 (places, roles, institutions and law, money and information, time, power subtleties, starts, failure, surfaces) plus a WA6 floor card, mode reuse-and-check plus bounded read. Owner file: this one, created by instruction (WPR3). Links from the world's research folder, the WORLD_CARDS list and the source profile are not made because the task said to touch nothing else; see Follow-ups. Review state reached: drafted, then source-spot-checked by the coordinator on 30+ locators (WPR21). Not rules-reconciled in detail, not built, not browser-verified, not director-accepted. Spoilers are tagged [S]; sealed-secret truths of any YAIRPG world are not touched here (WPR8, WA11). Prices are edition numbers from a fan translation, not constants.

## 1. Source, edition, tier and budget

**Edition.** `A Regressor's Tale of Cultivation - Tremendous.epub`, Calibre ID 17 (a second identical copy is ID 43, imported 2026-10-20), live path `~/Calibre Library/Tremendous/A Regressor's Tale of Cultivation (17)/`. sha256 `798bfee32222c8b67131266f43ea58a39875b110b06dd0810f0b35e162ad71e1` (both copies). 644 chapter members `chapterN.html`, 2,176,561 source words with locator tags stripped (2,524,725 with my `[mN pK]` tags, which is the gap versus any other count). `LOCAL_LIBRARY.md` gives the stale `~/Sync/CalibreLibrary/...` path and the 2026-10-03 BRIEF gives a Downloads path; both are stale (WPR23). Translation is an English fan compilation (translator credit lines appear inside chapters, for example a Discord line in m56 p1; the readers' files drop them). Authenticity of the original-language text and completeness are unverified. The local text stops mid-battle near in-text chapter 640.

**Locator convention.** `mN pK` = member `chapterN.html`, paragraph K counted over `p` elements in the extracted text (empty ones skipped in my files; the earlier dossier counts them, so its paragraph numbers can differ by a few). In-text chapter numbers can differ from member numbers by up to about 4 late in the book. The dossier's worker folders are ordinal-numbered: ordinal N+1 = member N, so `workers/0036-0041` holds members 35-40 (INTAKE says the same).

**Tier of ART in the repo.** No world-core-kit card exists and WORLD_CARDS has no ART entry. ART has: a private full-book dossier (`docs/research/novels/full-book/regressors-tale/`, about 70,000 words: REGRESSION, POWERS, POWER_SCALE, WORLD, PEOPLE, MYSTERIES, TIMELINE, plus per-block `workers/*/NOTES.md`); `SYSTEMS_DEEP_DIVE_2026-10-10.md` (rules R1-R15, ladders, a first slice); INTAKE and WORLD_AUDIT (2026-10-04, chapters 1-12); and an unactivated source profile `cultivation.regressors_tale.v1` in `src/feature_expansion_book_cultivation.js` (three era cutoffs, evidence rows, recognition tests; status "unactivated-source-profile", no actual branch). It is also in the agency-contract world list (`src/book_world_player_agency_contracts.js` line 33). So: research tier, rich on regression and power rules, thin on procedure and price. No WPR completion level C0-C5 is assigned here. No world pack, no runtime content.

**Reused first (WPR2).** SYSTEMS_DEEP_DIVE sections 1-2 and 8, WORLD.md and the workers 0036-0041, 0056-0062, 0180-0186, 0223-0230, 0455-0462 summaries, WORLD_AUDIT, the source profile. The dossier already records, as claims: the 10-stone ticket and forty-day conference (C10), 300-stone bracelet (C11), four missions a month (C12), nether-ship 60k/2k/58k, sect belts and ranks, Jo Clan pill use. The gap is procedure and form: who runs it, access, fee, tiers, breach cost, in tables with locators opened in this pass, and the sections the dossier does not have (rhythm, failure, surfaces, floor).

**Why these windows (gap named for each, WPR2).**

| Window | Members and paragraphs | Source words | Form | Named gap | Dossier has / missing |
| --- | --- | --- | --- | --- | --- |
| W1 (pilot) | m38 p95-end, m39, m40, m56 | 11,616 | excerpts: one partial chapter plus three whole, three consecutive then one non-adjacent | Conference fee/access, shop prices, clan intake, clan sparring contest and the wish rule | Has fees and intake as claims; missing contest placings, wish hours, root-timing table, rulebook shape |
| W2 | m45, m58, m42 | 10,904 | excerpts: three non-adjacent whole chapters (all early, first cycles) | Master-disciple duties, pill refusal, star durations, Shengzi clan split, lifespan reset | Has plot claims; missing duration table, pill access, disciple-duty rows |
| W3 | m223, m224, m225 p35-end | 10,549 | consecutive (m223-224) then m225 from p35 | Sect belt ladder, partner assignment rule, market and sect-sold beast methods | Has "belts/ranks" as a clause; missing the ladder, procedure, sale channel |
| W4 | m182, m455, m456 [S in m455-456] | 9,951 | excerpts: three non-adjacent whole chapters | The one auction scene, demon-race market, Jo Clan pill institution | Has pill exploitation as a clause; missing furnace access, marriage rules, auction detail |

Total read by readers: 43,020 words (about 2.0% of the book). The keyword census (per member counts of auction, market, pharmacy, pill, spirit stone, silver, guild, exam, sect, price, tribute, permit, mission) chose where terms are dense; it is not reading. Census warning: "silver" in m606-610 is hair and light colour, not currency, and "auction" appears in only four members (m182, m193 twice, m359), so ART has no auction culture to port (see zero hits).

**Budget (declared plan, WPR7, AU2-AU6).** Coordinator (Sonnet) plus at most 4 readers, each a fresh Agent call with model "haiku" set explicitly in the first brief, one at a time, each on one pre-extracted window of at most 12,000 source words with `[mN pK]` tags, fixed output form (item | cost and units | access | tiers | hazards | locator | uncertain terms), no unsourced prior claims in briefs. Repair reserve 1, used 0. Invocations used: 4 of 4 readers, 0 of 1 repair, 1 advisor call before windows. Rate-limit stop mid-run: windows and the census were rebuilt from the saved extraction; no window was read twice. Cumulative: 43,020 of 2,176,561 words (2.0%). Windows and return summaries saved in the gitignored store `docs/research/novels/regressors-tale/passes-2026-10-23/` (windows/W1-W4.txt, R1-R4 summaries, extract.py); full reader returns were delivered in chat and condensed there, so the verbatim returns are not stored (a WPR27 gap, noted in Follow-ups).

**Source spot checks by the coordinator (WPR18-19).** I opened the extracted text at each locator:

| Claim | Locator | Result |
| --- | --- | --- |
| Conference entry 10 spirit stones for a 10-day ticket; whole event 40 days; the narrator arrived on day 20 and bought a second 10-day ticket for 10 more | m38 p121, p246-252 | Confirmed. Invitation-only on paper, open to any payer. |
| Lowest storage artifact about one "stone" (180 liters) volume, 50 spirit stones; bracelet 300 stones, 27 beads of 3 "stones" volume each | m39 p30, p37, p43, p47 | Confirmed. "Stone" is a volume unit; do not conflate it with spirit stones. |
| Book set 49 spirit stones; a free obscuring brush if more than five books | m39 p98, p77 | Confirmed. |
| Conference rule: no attack spells above Qi Refining 2nd Star, no injuring | m39 p141 | Confirmed (STATED by a Cheongmun woman). |
| Clan monthly resources scale with missions and stage; at least 1 spirit stone a month from Qi Refining; at least 4 mandatory missions a month | m40 p21-22, p26, p29 | Confirmed. Basic resources amount not given. |
| Training conference: top three become external members, other finalists lower-ranking; anyone except Qi Building may enter; winner normally gets one hour with a main-house elder, three if external | m56 p8, p23, p58 | Confirmed. |
| Nether Crossing Ship: 10,000 launch, 10,000 jump, 20,000 return, 20,000 privilege, total 60,000; operator cut 2,000 for descent from the founder, net 58,000 | m99 p78-89 | Confirmed (STATED by the operator-ghost, p78-79, p89). The "58,000 net" is inferred arithmetic. |
| Qi Refining stars 1-4 took 10/12/6/5 years, 33 total | m45 p5-9 | Confirmed (SHOWN narration). |
| 6th star "7 years" versus "43 years" | m45 p62, p101 | Both lines exist; kept as a contradiction (section 10). |
| Blessing Pill: mortals +10 years, Qi Refining up to +8, 6 with resistance | m45 p108 | Confirmed (STATED by the master). |
| Qi Building Pills are made by sacrificing humans; mixed-root people do not reach Qi Building without them | m58 p253, p264 | Confirmed (STATED, narrator's survey and view). |
| Shengzi: Jinlu half the country, six smaller clans the other half | m58 p69-70 | Confirmed. |
| Ascension Gate opens only once every thousand years | m42 p159, p170 | Confirmed (STATED by the narrator). |
| Sect belt ladder Red/Vermilion/Yellow (Lower), Green, Blue, Indigo (Upper), Purple, Gold, white Heavenly Lightning | m224 p23-36 | Confirmed (STATED). Protagonist given Green "for now". |
| Dual-cultivation partner assigned only after basic techniques and Seven Stars Ritual | m223 p19 | Confirmed (STATED by an elder). |
| Sect-sold demon beast methods: merchants gather, sect discards hard/low/unstable, sells usable to high cultivators; Dragon methods held, Serpent methods sold quietly | m225 p57-73 | Confirmed (STATED by a Qi Building merchant, unverified). |
| Flying is prohibited in Shengzi; fine 100 spirit stones | m65 p184-186 | Confirmed (STATED by high Qi Refining cultivators). New to this pass. |
| One ancient stone trades at 100 spirit stones | m374 p59 | Confirmed (STATED in dialogue). New. |
| Meridian activation cost 100 spirit stones for the first of 72 | m41 p48-51 | Confirmed (SHOWN); efficiency judged "terrible" by the narrator. |
| Auction in the demon-race market is a single shout; the Immortal Demon Tower basement holds auctions; Sacred Orchid Island has one | m182 p10; m193 p270, p276; m359 p128 | Confirmed; no procedure shown anywhere in W4. |
| Emotion Advancement Pill: 300 pills from one pet; from mortals several years to refine, from cultivators instant [S] | m455 p336; m456 p138 | Confirmed (STATED by a Grand Elder; narration). |
| Cultivation resets each regression and the Seven Stars Ritual must be redone | m80 p111 | Confirmed (STATED by Seo). |
| Fox tribute buys seven nights; arm offered | m2 p37-38, p76 | Confirmed. |
| Lifespans 300/600/1,200/2,400 for Qi Building to Heavenly Being | m46 p22 | Confirmed (STATED). |

Not opened by me (unverified here): the 15 horse-shaped silver root sale, bribe and house price (taken from WORLD_AUDIT, reused, not rechecked), Makli elixir sourcing claims beyond reader return, Jin Hwi and Jin Byuk-ho's full roles beyond W3, the 20-year separation rule (opened p33 only), root recruitment purse (no amount found), the m137 Byeok Clan stone counts ("millions", opened p221-222 headline only).

## 2. Places and institutions (WPR9, WPR11)

Labels: SHOWN (scene), STATED (speaker named), INFERRED, PROPOSED. V = opened by me, U = unverified. Money is in spirit stones (SS) unless noted; silver and copper are separate (section 4).

| Place or institution | Who runs it and where | Cost and units | Access | Tiers, limits, hazards | Locator, label, check |
| --- | --- | --- | --- | --- | --- |
| Spirit Path Conference (Yanguo/Byeokra border) | Cultivator clans; organizer not named | 10 SS per 10-day ticket, extendable by another 10 | Invitation holders by rule, but any payer may buy a ticket (the invitation exists to keep mortals out) | 40-day event; attack spells above Qi Refining 2nd Star and injury barred inside; loophole: a healing technique beat a Jin member and the barrier did not trigger | m38 p121, p246-252; m39 p141-158, p231. STATED/SHOWN. V |
| Conference market stalls | Individual merchants | Storage pouch 50 SS; storage bracelet 300 SS; book set 49 SS | Open to ticket holders; cheap goods first-come ("move aside" if poor) | Mid-tier magic artifacts need considerable spiritual power to use; seven large storage artifacts left at the shop | m39 p22, p30, p37, p43-47, p52-55, p98. SHOWN. V (prices) |
| Cheong-nan Bookstore (owner Eom) | Eom | 49 SS for the bought set; free brush for more than five books | Open | The brush hides cultivation level; Eom's referrals look odd to the narrator | m39 p75-98, p108. SHOWN. V (49, brush) |
| Cheongmun Clan external membership | Cheongmun Clan, Qi Building elder Mok handles intake | No entry fee found; plaque or identity token issued | A recommendation from a main-house elder or public official; an elder's confirmation makes the person external | Tiers: external member, branch family, lower-ranking, lower echelon; heavenly roots go to the main house (marriage into the direct line mentioned); mixed roots start in the lower echelon | m39 p226-228; m40 p1-5, p128-136. STATED/SHOWN. V (m40 p1-5 partially) |
| Cheongmun monthly support and missions | Same | At least 1 SS a month from Qi Refining; basic resources unstated (a small ginseng box is shown) | External members and branch families | At least 4 mandatory missions a month; resources scale with missions and stage; a cave dwelling and rulebook are issued | m40 p21-29. STATED/SHOWN. V |
| Cheongmun training conference | Cheongmun Clan | Registration, then held about a month later | Anyone except Qi Building cultivators; Qi Refining 9th Star may skip it and apply by interview | Top three enter as external members; other finalists lower-ranking; lower-ranking are 2nd-3rd Star, external 4th-9th; a winner may forfeit the recommendation; held every few years (no fixed cadence stated) | m56 p7-8, p15-18, p23, p36-37, p47-61. STATED. V |
| Winner's wish and elder teaching | Main-house elder Ryeong | One hour by default, three hours if the winner becomes external | Contest winner | An elder can extend the meeting (about 10 hours total in the scene); formal teaching only for external members | m56 p58, p84-102. STATED/SHOWN. V (p58) |
| Shengzi flying ban | Shengzi clan territory | Fine 100 SS | Everyone | Aimed at preventing large-scale clan battles; enforced by high Qi Refining clan cultivators | m65 p184-186. STATED. V |
| Shengzi palace barrier and archives | Shengzi royal court (mortal royal line, by agreement of the clans) | None to enter | Cultivators suppressed inside; royal guards at high Qi Refining carry clan talismans | Archives effectively sealed to cultivators; contents are a rumor; the narrator entered by stealth | m58 p77-110. STATED/SHOWN. U (talisman issue not found) |
| Shengzi seven-clan split | Jinlu clan about half the country; Ha, Geo, Joon, Yeoljeon, Ori, Jeon the other half | n/a | n/a | Royal line mortal by clan agreement | m58 p69-70, p79-80. STATED. V (split) |
| Nether Crossing Ship | Black Ghost Valley (operator Song Jin) | Launch 10,000, jump 10,000, return 20,000, privilege 20,000 SS = 60,000; operator reduced 2,000 | Clan head arrives with 80,000 in a storage artifact | A discount for descendants of the founder; "bandit" demand earlier is contrasted | m99 p22-24, p77-89. STATED. V |
| Golden Divine Heavenly Thunder Sect (Bright Cold Realm) | Sect leader Supreme Sect Master Jin Byuk-ho; staff such as Jin Hwi | Belts awarded; no fee found | Ladder by stage and Seven Stars status (next row) | Lower Lightning disciples do menial tasks; only Qi Building and above are "true force"; Discipline Hall interrogates rule-breakers | m224 p23-34; m223 p116. STATED. V |
| Sect belt ladder | Same | n/a | Red (no Seven Stars yet), Vermilion (passed), Yellow (Qi Refining extreme), Green (Qi Building), Blue (Core Formation), Indigo (Core Formation with Nascent Soul potential), Purple (Nascent Soul, elders), Gold (Heavenly Being), white Heavenly Lightning (one or two grand elders) | The Azure Heaven Creation Sect uses a Cloud Disciple ladder (Fifth to First) instead | m224 p23-36. STATED. V |
| Dual-cultivation partner institution | Elders assign | None found | Only after basic techniques and the Seven Stars Ritual, to keep gender balance; exception offered for legendary constitutions | Partner chosen by bloodline and constitution; the narrator refused and the refusal was accepted; the other newcomer's consent is not asked in the scene | m223 p4, p16-21, p31-54. STATED/SHOWN. V (p4, p19) |
| Thunder Spirit Island cultivator market | Local; no operator | Fee not found | Open; the narrator entered hidden | Surveillance by a Heavenly Being caster is dodged inside crowds | m225 p35-45. SHOWN. U (details) |
| Sect-sold demon beast methods | Merchants buy from demon merchants; the Mystical Scaled Fish Commanding Sect filters and resells to high-level cultivators | Prices not stated | Open buyers on the island; Qi Building seller | Dragon and Bird methods are held back from the Heaven Tribe; Serpent methods are sold quietly; darker shed skin means higher grade (merchant's claim) | m225 p50-73, p111-119. STATED. V (channel), U (grades) |
| Demon-race market, True Dragon Alliance Serving Command Ark | Alliance; Seo Hweol works there | Spirit stones; horn price not stated | Open; humans without Earth Tribe vision hear only faint fluctuation | Methods are engraved on bone, skin and teeth and sold on a methods street; body parts regrow only at Core Formation or higher; the Heaven Tribe buys manuals in bulk "at regular intervals" | m182 p3-36, p59-83. SHOWN/STATED. V (p10, p32, p63, p65) |
| Immortal Demon Tower and Sacred Orchid Island auctions | Tower basement (compressed space for large guests); an island event | Not found | Not found | Existence only | m193 p270-276; m359 p128. STATED. V |
| Jo Clan (Dream-world memory section) [S] | Clan Head, Elder Council, Great Elder | Talent and pills; no stone price | Ladder: Qi Refining disciples, late-stage disciples, Core Formation Elders, Grand Elders, Nascent Soul Clan Head, Heavenly Being Supreme Grand Elders | Clan arranges political marriage with Black Ghost Valley; a pet's bond is used as leverage; pill room access controlled by the Great Elder, with an Earth Fire vent | m455 p9-11, p21-33, p87, p237, p277-282; m456 p10, p88. SHOWN/STATED. U for most rows |
| Jo Clan pill institution [S] | Jo Clan alchemists, top alchemist an uncle | Recipe held by a few; 300 pills from one bonded pet; mortals take several years to refine into a pill, cultivators instant | Made for Extraordinary Pattern Law Talent holders | Misuse caused regression; later the furnace consumed clan members | m455 p132-139, p336, p353-360; m456 p131-138. STATED/SHOWN. V (p336, p138) |

## 3. Person-to-person roles (WPR10)

| Role pair | What each owes or offers | How a mistake or refusal lands | Locator, label |
| --- | --- | --- | --- |
| Master and Seo (early cycle) | Master teaches stages, lends annotated books, builds the ritual altar with elder authority; Seo is expected to advance | Seo refused the Blessing Pill and buried it; the master was hurt and annoyed, kept teaching; master cannot touch the heavens | m45 p64, p68-69, p127-163, p177, p213. SHOWN/STATED. U for the master's name link to "Makli Hyun" (m45 p131) |
| Seo and Kim Young-hoon | Peer and later student; Kim's notes passed to Seo; Kim believes Seo invented the Severing Vein Saber, which Seo lets stand | Kim does not press about where Seo's knowledge comes from | m42 p95-97; m58 p37-38. SHOWN. V (partial) |
| Seo and his "disciples" in Jin Clan territory | Visits with Kim's permission; the narrator calls them "my disciples" then "not a master-disciple relationship" | The relation is a connection kept, not an office (contradiction section 10) | m58 p2, p24. V |
| Cheongmun elder Mok and a new external member | Mok assigns missions and issues manuals; the member owes four missions a month and must read the rulebook | Missions lead to support; talent decides promotion | m40 p21-29. STATED. V |
| Contest winner and elder Ryeong | Ryeong gives one hour (three if external) of instruction; can extend; offers to be master only to an external | A winner can forfeit a recommendation; the replacement route is unclear | m56 p58, p84-102. V (p58) |
| Brother elders Buk and Ryeong (cousins) | Buk handles registration and officer duty | Family rank gates contact | m56 p50. STATED. U |
| Sect staff Jin Hwi and a gifted newcomer | Assigns belt, cave and basic scripture; gave Core Formation scriptures early though he said they were not yet suitable | Contradiction in his own instructions; he is shocked when the sealed stage is revealed [S] | m224 p20-52; m225 p148-156. STATED/SHOWN. U for the scripture contradiction |
| Elder and partner candidate (dual cultivation) | Elder picks; newcomer may decline | Refusal accepted for Seo; the other newcomer is handed to an etiquette tutor first | m223 p31-54, p114-116. SHOWN. U |
| Merchant and buyer in sect-method trade | Seller explains channel and grades; buyer verifies himself | Claims are the seller's own; the narrator buys two skins, price unstated | m225 p50-119. STATED. U |
| Clan and a bonded pet (Jo Yeon and Ha-eun) [S] | Clan demands political marriage, threatens the pet, promises meeting after twenty years of separation | The pet's death turns the pill institution against the protagonist's loyalty | m455 p33, p87, p336. STATED. V |
| Regressor and everyone else | Seo hides regression; says his knowledge comes from monsters of the upper realm; reveals little to colleagues | People react to what they see, not what he remembers; an old friend is a new person each cycle | m58 p33; INTAKE RT17-01; SYSTEMS R13. STATED. V (m58 p33 via reader, not opened) |

Brokers, patrons and rivals proper: the conference bookstore owner, the sect-method merchant and the demon methods street are the only broker-like roles in the windows. No formal broker guild was found (section 11).

## 4. Money and information (WPR12)

| Item | Price or rate | Unit | Who sets it | Locator, label, check |
| --- | --- | --- | --- | --- |
| Spirit stone as currency | Cultivator-to-cultivator currency; Seo hid his ignorance of it so as not to look suspicious | SS | Cultivators | m38 p104-107. SHOWN. V |
| Conference ticket | 10 per 10 days | SS | Conference | V |
| Storage pouch / bracelet | 50 / 300 | SS | Shopkeeper | V |
| Book set | 49 | SS | Eom | V |
| Meridian activation | 100 for the first of 72, "terribly low" efficiency | SS | Self-cost | m41 p48-51. V |
| Flying fine | 100 | SS | Clan law | m65 p186. V |
| Clan monthly stone | at least 1 from Qi Refining | SS per month | Clan | m40 p26. V |
| Ship trip | 60,000 total; 58,000 net after discount | SS | Black Ghost Valley | m99 p78-89. V |
| Ancient stone | 1 ancient = 100 spirit | stones | Merchants | m374 p59. V |
| Looted stones | about 1,600 from Makli bodies; about 1,000 used up in cave absorption | SS | n/a | m38 p237; m40 p63. SHOWN. V (p237) |
| Clan hoard | millions of SS in a main house, about a tenth elsewhere | SS | Byeok Clan | m137 p221-222. STATED. U beyond p221 headline |
| Herb sale, root sale, bribe, house | 15 horse-shaped silver for a root, one left after purchases | silver | Merchants and officials | WORLD_AUDIT (reused). Not opened here. U |
| Mortal fines or wages | Not found in windows | n/a | n/a | n/a |
| Elixir price | Not found (Blessing Pill, Qi Building Pill) | n/a | Makli clan | m45 p108; m58 p253. NOT FOUND |

Currency separation: silver (mortal, early Head Realm) and spirit stones (cultivator) have no stable rate in the text (SYSTEMS gap confirmed). "Stone" as volume (180 L) is another unit. Ancient stone to spirit stone is stated once as 1:100.

Information as a good: conference books and the bookstore (49 SS for a set), sect-sold methods, engraved demon methods. Information leaks: the Dragon King controls Dragon methods; Serpent methods are sold quietly; a merchant's claim about grade or provenance is untested. Rumor spread and brokers: NOT FOUND in windows (section 11). What a regressor hides: he claims his knowledge comes from upper-realm monsters (m58 p33), reads the conference rules for loopholes, and conceals provenance from colleagues (INTAKE RT17-01).

## 5. Time and rhythm (WPR13)

| Cycle | Length | Locator, label |
| --- | --- | --- |
| Fox tribute | Seven nights per tribute; another tribute needed (per cycle, early beat) | m2 p37-38, p76-78. SHOWN. V |
| Conference | 40 days; 10-day tickets; narrator stayed 20 | m38 p246-252; m39 p231. V |
| Clan missions | At least 4 per month; monthly resources | m40 p29. V |
| Clan training conference | Every few years; registration then about a month; held on a date posted | m56 p7, p36-37. STATED. V |
| Qi Refining stars | 1st 10 years, 2nd 12, 3rd 6, 4th 5 = 33 in one life; 6th star 7 years or 43 years (conflict) | m45 p5-9, p62, p101. V |
| Higher stars (later life) | Stars 7-13: about 3 years (Five Elements), 18 months (Four Images), 3.5 years (Three Talents Unity), about 6 months (Yin-Yang Unification) | m58 p216-238. STATED by narrator, U |
| Lifespan | Mortal about 50 years; Qi Building 300, Core Formation 600, Nascent Soul 1,200, Heavenly Being 2,400 | m46 p22; m58 p273. V |
| Ascension Gate | Opens once per thousand years; the narrator has a month and a half left in one life | m42 p159; m58 p315. V (p159); U (p315) |
| Root talent to dantian | Heavenly: "a day or two" or "one day"; true: one month; mixed: 1 year fast, 3-5 years slow; triple: 1-3 months; 4-5 qualities: very hard; 80%+ of cultivators are poor-talent | m38 p208-209; m40 p42-48. STATED. U (conflict section 10) |
| Dual cultivation | After Seven Stars; ongoing | m223 p19. V |
| Bonded separation (Jo Clan) [S] | 20 years no meeting; 10 years to marry | m455 p33, p87. V |

Away time and seclusion: not found in windows beyond Seo's cave months; the dossier covers cave and time-pocket cases (section 11).

## 6. Power subtleties and costs in the windows (WPR14)

- **Reset versus understanding.** Each regression resets cultivation and the Seven Stars Ritual must be redone (m80 p111, STATED by Seo, V). Execution-level martial control survives (INTAKE RT17-04). Not re-derived here.
- **Slow cultivation is brutal.** 33 years for four stars, then 43 years for the 6th star in one telling; a master calls the student a dullard (m45 p5-9, p101, V). Resources and body remodeling are the regressor's way around it (dossier, not reread).
- **Heavenly Rejection.** The Seven Stars Ritual draws clouds that abort it; the master cannot touch the heavens; a Gang Sphere tears through them (m45 p197-256 SHOWN by reader; m58 p136-141 STATED). Mixed-root cultivators do not reach Qi Building without a pill made from sacrificed humans (m58 p264, V), which is why the narrator refuses Qi Building Pills.
- **Blessing Pill.** Lifespan up to +10 years for mortals, +8 for Qi Refining, +6 with resistance; the narrator refuses because he thinks it is made from humans (m45 p108, p131, V and STATED).
- **Meridian activation.** 100 SS for the first of 72; unsustainable at that rate (m41 p48-51, V).
- **Demon core route (Seo's own).** Repeated dantian explosions, bleeding from lower abdomen and mouth to pass stages; failure at Qi Building drops a beast back to ordinary; a seal (a curse banner plus hand seal) shows only Qi Refining 6th Star [S-ish, m224 p113-170, p199-225; m225 p130-138, reader SHOWN, U].
- **Concealment.** Cheap brushes hide cultivation level (m39 p75-77); a technique hides the user from a Heavenly Being's surveillance but needs crowds (m225 p37-44, U).
- **Gang Qi costs.** Bleeding hands, hoarse throat, spat blood after Sphere recoil (m45 p28; m42 p176-178, reader SHOWN).
- **Sect scripture early access.** Jin Hwi hands scriptures he said were for Core Formation to a newcomer (m224 p38, U).
- **Pill institution as extraction [S].** The Jo Clan Emotion Advancement Pill is made from the bonded pet (300 pills), later from clan cultivators, which is faster than mortal-derived pills (m455 p336; m456 p138, V).

## 7. Starts, failure, aftermath, surfaces (WPR15-17)

**Starts and entry.** The source gives one recurring start: Earth coworkers land in the forest cave, a fox demands tribute for seven nights, cultivators come for the talented (m2; SYSTEMS R14). Entry to the world's institutions needs a recommendation (Cheongmun), a ticket (conference, 10 SS), a plaque or token (clan, m40 p1) or winning a contest (m56). Each regression returns Seo young at the anchor with memory intact (SYSTEMS R1, dossier). What the start knows: Seo hides provenance; foreknowledge is valid only while the anchor and beats are unchanged (SYSTEMS R14).

**Failure and aftermath.** Penalties shown: a 100-SS flying fine (m65 p186); loss of a forfeited recommendation (m56 p47-61); expulsion removes the Jin surname [S] (m223 p164); arrest of Jin-surname holders [S] (m223 p274); a contest winner may refuse. Death returns Seo to the anchor; whole sects can be destroyed in a cycle (dossier). The world forgets: people re-roll in detail and do not remember loops (SYSTEMS R13). A bounty or ranking is not shown in the windows (m9 and m294 have bounty hits; unread).

**Surfaces.** The windows imply panels for: a conference timeline with 10-day tickets, a clan rulebook (missions and monthly resources), a belt rank, a stage with years spent, and a cultivation-seal indicator. Hidden until discovered: the sect-method channel, Heavenly Rejection, pill provenance. An idle player would miss the loophole tactics (healing under a no-injury rule), the recommendation forfeit, and the sect-method filter.

## 8. Findings (F-list)

| Code | Finding | Label and check |
| --- | --- | --- |
| F1 | The Spirit Path Conference is invitation-only on paper but sells a 10-SS ten-day ticket to anyone; its rule (no attack spells above Qi Refining 2nd Star, no injury) was beaten by a healing technique that the barrier did not stop. | STATED/SHOWN. V |
| F2 | Prices cluster as pouch 50, bracelet 300, book set 49, meridian activation 100, flying fine 100, ship total 60,000 SS; 1 ancient stone = 100 SS. Elixir prices are NOT FOUND. | STATED/SHOWN. V |
| F3 | The Cheongmun clan runs a three-route intake: recommendation, training conference (top three external, others lower-ranking), or interview for high Qi Refining; monthly resources start at 1 SS, 4 missions a month. | STATED. V |
| F4 | A contest winner's prize is time with an elder (one hour, three if external), and the winner may forfeit the recommendation. | STATED. V |
| F5 | The Golden Divine Heavenly Thunder Sect uses a nine-step belt ladder from Red to white Heavenly Lightning, with only Qi Building and above counted as "true force". | STATED. V |
| F6 | Qi Building Pills are made from sacrificed humans and mixed-root cultivators rarely advance without them (narrator's survey); this drives refusals and Seo's own demon-core route. | STATED. V |
| F7 | A regression-specific information rule: Seo gives upper-realm monsters as the source of his knowledge, hides his reset, and the people around him do not remember earlier cycles. | STATED. V (m80 p111), U (m58 p33) |
| F8 | Auctions are almost absent: one shouted auction in a market, one tower basement, one island event; no procedure. | SHOWN. V |
| F9 | Sects sell demon beast methods through merchants who filter by grade and race; Dragon and Bird methods are held back, Serpent methods sold quietly. | STATED. V (channel) |
| F10 | Pill refining in the Jo Clan is controlled by room access and a Great Elder, and the pill can be made from bonded pets or clan members [S]. | STATED/SHOWN. V |

## 9. Engine facts (default, dial, reason; WPR5, WPR31)

| Fact | Default | Dial | In-world reason and cost | Exceptions the text shows |
| --- | --- | --- | --- | --- |
| Event ticket | A paid 10-day ticket buys access to an event; invitations exist but any payer can buy | Price, window length, event length | Keeps mortals out of cultivator exchange; revenue and exposure | A recorded loophole under the no-injury rule |
| Clan intake by recommendation, contest or interview | Recommendation token issued by main-house elders; contest top three become external | Contest cadence, placings, minimum stage | The clan wants talent but ranks by stage | A winner may forfeit the token (m56 p47-61) |
| Monthly clan support | Mission count plus stage decide stones and resources, start at 1 SS | Mission quota, resource tiers | Clans buy service with small stipends | Basic resources unspecified |
| Prize as teaching time | An elder meeting is the prize (1 hour, 3 if external) | Hours, extension by the elder | Cheap for the clan, scarce for the winner | Elder Ryeong extended it three times to about ten hours total (reader return, m56 p84-91, U) |
| Rank by belt | Belt tier tracks stage and Seven Stars; lower belts do menial work | Tier cutoffs, credit for potential | Sects staff from the bottom | Newcomer given Green "for now" from expected stage |
| Stage-gated partner pairing | Partners only after basic techniques and Seven Stars | Exceptions for legendary constitutions | Keeps balance, protects the ritual | A refusal was accepted for one newcomer |
| Pill from humans | A pill's ingredient can be human lives; a refusal costs access | Whether a character knows, ethics, price | The clan's production line | A regressor refuses on knowledge the master lacks |
| Hidden stage | A stage can be hidden by artifact, technique or seal and shown as lower | Cost of the seal, observer power | Avoids attention | A Heavenly Being surveillance spell can still hunt; crowds help |
| Travel as a service | A ship trip is a priced service with quoted components | Operator, discounts | Operator cost and favor | A founder-descendant discount of 2,000 |
| Territorial fine | A clan can ban an action locally (flying) and fine it | Fine amount, boundary | Prevents battles between clans | Jurisdiction ends at borders (dossier) |

## 10. Contradictions and tensions (WPR20)

| Id | Claim A (source) | Claim B | Chosen reading, owner, status |
| --- | --- | --- | --- |
| C1 | m45 p62: 7 years to reach the 6th star | m45 p101: 43 years to complete the 6th star and enter the 7th | Both stay; maybe cumulative, maybe a different life. Owner: this file, open |
| C2 | m38 p208: heavenly root cycle "a day or two" | m40 p44: "one day" | Likely the same claim; keep as 1-2 days. Open |
| C3 | m58 p2: "my disciples" | m58 p24: "not a master-disciple relationship" | Connection kept without office. Open |
| C4 | m224 p38: Core Formation scriptures "not for you yet" | Given the same day | Instruction contradiction by Jin Hwi. Open |
| C5 | Repo SYSTEMS table: Core Formation sub-stages "Three Enclosures" vs wiki four | Not tested here | Left to the dossier |
| C6 | Repo WORLD_AUDIT: "Spiritual Path Conference has paid 10-day entries within 40-day event" | Confirmed here (m38 p246-252) | Agreement, not conflict |
| C7 | Repo dossier C12: monthly "small" support | Here: at least 1 SS per month from Qi Refining (m40 p26) | Refinement, not contradiction |
| C8 | Repo SYSTEMS R8: Qi Building 300 years | m46 p22 confirms | Agreement |
| C9 | m455 p103: Golden Core beyond 600 years (Jo Yeon's estimate) | m46 p22 lists Core Formation 600 | Estimate, not rule; terms Golden Core vs Core Formation differ by translation. Open |
| C10 | The seven-night fox tribute (m2) | Anchor-dependent per cycle (SYSTEMS R14) | Consistent |

No contradiction with repo docs was found on the price and ticket claims. Repo-doc wording to refine: SYSTEMS_DEEP_DIVE section 8 lists "Prices. Spirit stones and silver appear (m38, m39); no stable exchange rate"; this pass adds rows and the single 1:100 ancient-stone ratio.

## 11. Gaps and unread windows (WPR7, WPR23)

Read: 43,020 of 2,176,561 words (2.0%). The windows are early and mid-book; the rest is covered only as dossier claims (full-book workers read all 644 members with their own method).

Named zero hits and not-found rows, with where I searched:

- **Auction procedure.** Searched "auction" in all 644 members: 4 hits (m182 p10, m193 p270 and p276, m359 p128); a second search for "bid", "bidding", "appraisal", "pavilion" found members m138, m152, m183, m186, m191, m196, m197, m230, m300 with ordinary-language hits, not opened. Not found: any auction fee, deposit, seller cut or lot order. The search was a regex over the extracted text; spelling variants "auctions" and "auctioneer" are covered by the stem.
- **Guild, exchange house or permit office with fee.** Census hits "guild|merchant|pavilion" 319 across the book, densest in m152, m528, m515, m451, m32, m33 (unread). Not opened.
- **Pharmacy prices.** m4 (read in earlier audit) and m38 p13 mention a seven-month pharmacy job; wage not found.
- **Alchemy school or guild.** Only the Jo Clan pill room [S] and the Makli reputation (m45 p120); no neutral alchemists' hall found.
- **Taxes, tribute and bounty procedures.** "tribute|tax" census: m248 (21), m89 (21), m177 (12), m272, m546; "bount" in m9, m294, m284, m255; unread.
- **Information brokers, rumor networks.** None in the windows; the earlier dossier names Gwiyeonggak as Seo's concealed intelligence network (WORLD lines 29-30, not reopened).
- **Seclusion and retreat.** "seclusion|retreat" densest in m434, m259, m364, m358, m357; unread.
- **Mortal wages and rent.** "wage|salary|rent|debt|loan" densest in m642, m573, m427; unread.
- **Regressor-specific counters.** Other regressors: none found in the windows; the dossier says none in the local text.

Unread windows to name (exact members, with a suggested reader form):

| Gap | Window (member) | Why [S] marks apply |
| --- | --- | --- |
| Conference market breadth, pharmacy | m37 (the "Cultivator (1)" opening), m41-44 | Early, no [S] |
| Sect submission and mission procedure, Jin contests | m41-44 mission and contest sections, m158-159 | Early, no [S] |
| Merchant/guild hits | m32, m33, m152, m361 | Early-mid |
| Bounty and martial house | m5, m9, m16, m19 | Early |
| Retreat and time pockets | m259, m358, m364, m434 | Mid-late [S] |
| Late institutions (Sacred Vessel governance) | m511-526 | [S] |
| Tribute and tax | m89, m177, m248, m272 | Mid [S] |
| Cheongmun wider organization | m57-m60, m138-m141 | Early-mid |

## 12. More-to-consider round (WPR24)

| Class | Item | Done check |
| --- | --- | --- |
| ACT NOW (done) | Record that "stone" has a volume meaning (180 L) so a pack never treats the pouch size as a price. | Section 2 and F2. |
| ACT NOW (done) | Record the zero-hit auction result with its searches, so a pack does not copy the auction mechanism from another world. | Section 11. |
| ACT NOW (done) | Correct the reader's "tier" labels: the sect belt ladder was confirmed at m224 p23-36 and the 1:100 ancient-stone ratio was found by me, not the reader. | Section 1 spot checks. |
| ACCOUNT FOR NOW | Prices in sections 2 and 4 are edition numbers; pack rows cite locator and edition (WA10). | Pack row format. |
| ACCOUNT FOR NOW | Ticket, intake token, belt ladder and stage-years table are mechanisms with data rows (WPR31). | Slice names a gate, a clock, a role and a cost row. |
| ACCOUNT FOR NOW | m455-456 and parts of m223 are [S]; keep them out of any first-slice player text (WA11). | Sealed-secrets check. |
| ACCOUNT FOR NOW | Cultivation resets but understanding stays; any slice must keep that split (SYSTEMS R2). | The reset test in floor K3. |
| LATER/DELEGATE | Merchant/guild and bounty pass (m5, m9, m19, m32, m33, m152, m361). Level: haiku, 12k words. Done check: a fee, access and breach row each, or "not found, searched where". | Table plus two spot checks. |
| LATER/DELEGATE | Sect mission and contest procedure (m41-44, m158-159). Level: haiku, 12k. Done check: mission rows with reward and penalty. | Same. |
| LATER/DELEGATE | Retreat and time-pocket rhythm (m259, m358, m364, m434). Level: haiku, 12k [S]. | Same. |
| LATER/DELEGATE | Stage-duration table across lives (reconcile C1). Level: sonnet, no new reading beyond dossier, low effort. | One row per star with life and source. |

Suggestions (separate, short): a "recommendation token" is a reusable access mechanism that also appears as a purple thorn token elsewhere and as a Paradise mission pass; a "ticket by days" is a reusable event gate; check the Paradise hub doc for the same shapes before building.

## 13. Ranked next list (WPR25)

1. Merchant, guild and bounty hits (m5, m9, m19, m32, m33, m152, m361): about 12k words, closes WPR12 and the market row that this pass could only touch.
2. Sect mission and contest procedure (m41-44, m158-159): about 12k, completes the K7 institution row with rewards and penalties.
3. Retreat and time pockets (m259, m358, m364, m434) [S]: about 12k, closes K13 timing but defers behind the first slice.
4. Cheongmun wider organization (m57-60, m138-141): about 12k, only if a Cheongmun start is chosen.
5. Late governance (m511-526) [S]: defer; the first milestone is one realm.

Each needs one haiku reader and the same window form; a fresh pass is a separate decision (WPR1). The kit card for ART is the first missing base layer; a floor card with real kit registration should come before a fifth pass (WPR25).

## 14. Floor card (WA6)

Five records for the bare-minimum floor. Each record: default, dial, in-world reason and cost, source locator and evidence label, current repo coverage, and the smallest playable slice. No canon invented; PROPOSED rows are marked. Repo coverage for all five: no kit card, no world pack; research tier only (SYSTEMS_DEEP_DIVE R1-R15 and the full-book dossier), plus an unactivated source profile in `src/feature_expansion_book_cultivation.js` with three era cutoffs and recognition tests.

**K2 World laws (5 to 10 engine facts).** Default (seven): (1) death or old age returns the regressor young to an anchor with memory (m0, m80, SHOWN/STATED; dossier); (2) cultivation resets and must be redone, understanding stays (m80 p111, V); (3) a paid ticket or recommendation gates every institution (F1, F3, V); (4) lifespan is capped by realm: 300/600/1,200/2,400 for Qi Building to Heavenly Being, about 50 for mortals (m46 p22, m58 p273, V); (5) Heavenly Rejection can abort the Seven Stars Ritual (m58 p136-141, STATED); (6) clan territory can ban actions and fine them (m65 p186, V); (7) the world's other people do not remember earlier cycles (SYSTEMS R13). Dial: cycle, realm, anchor, region. In-world reason and cost: heaven records fate, clans keep order by stipend, ticket and fine, and the regressor pays years and secrecy. Source and labels: sections 2, 5, 9; STATED/SHOWN, V except Heavenly Rejection details. Repo coverage: none in kit; prose in SYSTEMS (R1-R15); the source profile covers recognition tests. Smallest playable slice: three laws as gates on one first-cycle day: the fox's seven-night tribute (m2), a 10-SS ticket (m38 p246), a 4-missions-a-month duty (m40 p29), each naming the consumer that reads it.

**K3 Power core (resource, growth, one learn path, 3 to 6 techniques).** Default: resource is spirit energy plus stones; growth by Qi Refining stars (14 stars) with the Seven Stars Ritual at the 7th (m41 p1-13, SYSTEMS 2a); learn path is the clan manual (Cheongmun Method of Qi Gathering, m40 p33) plus a purchased manual set (m39 p98); techniques: (1) meridian activation, 100 SS for the first of 72 (m41 p48-51, V); (2) Dragon Vein Qi Method, impure residue (m45 p95-97, reader); (3) Gang Qi and Gang Sphere to tear Heavenly Rejection clouds (m58 p140, STATED); (4) Accumulating Lightning Technique at a sect (m224 p38-48, STATED); (5) a concealment brush or seal (m39 p77; m225 p130-138); (6) Blessing Pill refusal/use (m45 p108). Dial: root grade, element, path (Heaven, Earth, Heart; SYSTEMS R10), regression count. Reason and cost: the body reaches fuel slowly (33 years for four stars) and fast routes cost humans or risk (Qi Building Pill). Labels: SHOWN/STATED, V for the numbers. Repo coverage: SYSTEMS R8-R12 and ladder 2a; the source profile marks recognition tests; no state set. Slice: one Qi Gathering to Qi Refining gate with a stone-funded meridian step and the Seven Stars Ritual at star 7 with a Heavenly Rejection roll, two techniques only.

**K6 Cast (minimum named people with roles).** Default: Seo Eun-hyun (regressor, protagonist, m0-m2), Kim Young-hoon (former Director Kim, peer and student, m42, m58), Jeon Myeong-hoon (hostile peer, INTAKE, m6, m12), the territorial fox (m2), Cheongmun Mok (intake elder, m40), Elder Ryeong and Buk (contest officers, m56), Eom the bookseller (m39), Jin Hwi (sect staff, m224) and, outside the first slice, Song Jin (ship operator, m99). Dial: cycle, region, whether the character is a returning counterpart. Reason and cost: each is a person Seo owes, borrows from or hides from. Labels: SHOWN, V except the Jeon and Chief Oh rows (INTAKE, reused). Repo coverage: PEOPLE.md in the dossier; WORLD_AUDIT lists Seo, Kim, Jeon, Chief Oh and the fox; the source profile has no cast. Slice: the fox, Kim, Mok and Eom as four verbs (bargain tribute, ask a lesson, ask for admission, buy a book set).

**K8 Daily life (jobs, meals, prices, a day's rhythm).** Default: jobs in the source are a pharmacy worker (seven months, m38 p13), herb gatherer and seller (m4), charcoal seller (m384), mission-doer for a clan (m40 p29), conference visitor (m38-39); price anchors are the SS table in section 4 and silver in WORLD_AUDIT (unopened here); food and meal prices are not found in the windows. A day: rise, practice (mantras and drills until the throat is hoarse, m45 p28), go to a market or mission, rest. Dial: wealth, clan membership, cycle. Reason and cost: stones are scarce (1 SS a month from a clan at Qi Refining) while rented space and tickets cost 10-50 SS. Labels: SHOWN/STATED, V for the SS rows; meal and rent prices U/NOT FOUND. Repo coverage: WORLD_AUDIT and the profile mention herbs, clothes, permit and house; no priced list. Slice: one funded day: sell herbs for silver (reused WORLD_AUDIT numbers, flagged U), pay a 10-SS ticket, take one mission, rest; no hunger death.

**K13 Signature loop.** Default: wake at the anchor, handle the fox beat, gather herbs and sell them, find a route into an institution (recommendation, contest, ticket), cultivate and do missions, face a gate (Seven Stars Ritual or Heavenly Rejection), die or age out, and return with understanding intact and cultivation reset. Dial: cycle count and anchor movement (SYSTEMS R5). Reason and cost: the world replays from the anchor; each cycle costs years and relationships. Labels: STATED/SHOWN (m0, m2, m40, m56, m80 p111), V. Repo coverage: SYSTEMS section 7 proposes the same first slice (B1 start, Head Realm life, one cultivation gate, regression as the prestige layer); no executable cards. Slice: one cycle of that loop (fox tribute, herb sale, clan admission, one gate, one return), with understanding persisting and the stone ledger resetting.

## 15. Review state (WPR21) and follow-ups

Highest state reached: drafted, with about 30 claim groups source-spot-checked by the coordinator (not by a separate reviewer; WPR18's other-reviewer rule is met only in that reader authors differ from the checker). Not rules-reconciled in detail; touched codes: WPR1-WPR32, AU1-AU6, AU13, AD5, AD38, WA3, WA6, WA8, WA11, WA12 (knowledge versus truth), WA14 (carry across edges). Not built, not browser-verified, not director-accepted. Reader quality notes (Lessons): the four haiku returns were reliable on structure and on the numbers I opened. Two reader details I did not check and mark U: the claim that Seo reached Nascent Soul on day one (W3 return, m224/m225) and the star durations for stars 7-13 (W2 return, m58 p216-238). The "2,000 years" Heavenly Being lifespan is the narrator's reasoning (m58 p123), not a stated rule, and is not used as one. No reader error was found in the opened price lines, and no contradiction forced a sonnet rerun.

Follow-ups, not done because the task said to touch nothing else (WPR3, WPR28):

- Link this file from `docs/research/novels/regressors-tale/INTAKE.md` or BRIEF and from the world card list in `docs/WORLD_CARDS.md`; add a pointer in the source profile owner (`src/feature_expansion_book_cultivation.js` evidence list only if the owner chooses).
- Move the verbatim reader returns to the private store; the saved files here are summaries only because the returns arrived in chat.
- Fix the stale path in `docs/research/novels/LOCAL_LIBRARY.md` (from `~/Sync/CalibreLibrary/` to `~/Calibre Library/`); record the second copy (ID 43).
- Fold lessons into WORLD_PASS_RULES "Lessons carried in": a profile with an unactivated source profile in `src` can still count as "no pack"; a rate-limit stop mid-run is cheap when windows are saved as files before dispatch; locator-tag words inflate word counts versus a stripped count.
- Register a kit card for ART before another reading pass (WPR25).

## 16. Independent review (2026-10-23, successor world-consolidation coordinator (Sonnet 5.5, a different reader than the pass author))

Review state: **source-reviewed** for the rows listed; not rules-reconciled, built or accepted. No W2 reading was run on this book.
Confirmed (about 30 locators, from the saved windows and the EPUB): m38 p121, p246, p252; m39 p30, p47, p77, p98, p141; m40 p21, p29; m45 p5-9, p108; m56 p58; m58 p69-70, p253; m223 p19; m224 p23; m99 p78-80, p89 (60,000 total as 10,000 launch, 10,000 jump, 20,000 return, 20,000 privilege, with a 2,000 reduction stated); m65 p184-186 (fine 100 stones); m374 p59 (one ancient stone to 100 spirit stones); m41 p48-51.
Correction: the m45 "contradiction" (7 years versus 43 years for the 6th star) is probably not one. p62 reads as the time to reach the 6th star and p101 as the time taken to complete it and enter the 7th. Stars 1-4 total 33 years (p5-9), so 33 plus 7 plus about 3 gives 43 if p101 is cumulative (inference). Keep both lines; downgrade from contradiction to unresolved reading. Not opened (still unverified): the horse-shaped silver root sale and bribe price (WORLD_AUDIT), Makli elixir claims, the Byeok Clan stone counts.

## 17. W3 rules and runtime reconciliation (2026-10-24, world-readiness coordinator, Sonnet 5.5)

State reached: **rules-reconciled on the cited codes** (WPR21); drafted and source-reviewed rows keep their earlier states; not built, browser-verified or accepted. Proposals stay proposals (AD32). Packet: [FIRST_SLICE_PACKET_2026-10-23](../gm/dispatch/claude-coordinator-continuation-2026-10-23/FIRST_SLICE_PACKET_2026-10-23.md). Ranked dispositions: [GAP_AUDIT readiness round](../gm/dispatch/claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md).

**Disposition: NEEDS MECHANISM (rank 4), plus specific source.** Codes: AD1, AD5, AD11, AD12, AD14, AD38, WA3, WA6, WA8, WA11, WA12, WA14, ECR, SR for clan territory. A minimal kit card now exists: [regressors-tale.md](world-core-kit-2026-10-14/cards/regressors-tale.md).
Missing classes: loop-restart boundary with an anchor (C17), paid ticket or recommendation access right (C7 venue), territory fine (C8). Runtime: only the unactivated source profile in `src/feature_expansion_book_cultivation.js`. The ticket and the recommendation token are a shared access shape that the Paradise pass also shows; check before building a second copy.
Exact remaining locators: star durations 7-13 (m58 p216-238, reader-only) and C1 reading; root-sale and bribe prices (WORLD_AUDIT, unopened); merchant/guild m5, m9, m19, m32, m33, m152, m361; mission and contest m41-44, m158-159; retreat m259, m358, m364, m434 [S]; tribute m89, m177, m248, m272 [S]; nothing read after m456 in passes.
