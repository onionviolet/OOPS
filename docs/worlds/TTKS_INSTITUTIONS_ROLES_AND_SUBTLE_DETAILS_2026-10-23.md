# TTKS: institutions, roles and subtle details, plus floor card (pass, 2026-10-23)

Status: **proposal at pass level; highest review state reached is source-spot-checked (WPR21).** Findings are not accepted decisions and authorize no build, commit or push (WPR; AGENTS). Spoilers are tagged [S] and point to a locator only. No sealed designed truth of this repo was read or is repeated (WPR8); no TTKS sealed-secrets file exists under `docs/worlds`.

Codes touched (WPR22): WPR1-WPR32, AU1-AU15, AD36-AD38, WA3/WA4/WA6/WA8, K2/K3/K6/K7/K8/K11/K13 of the five kit cards `ttks-b1` to `ttks-b5`, W2/W3/W7/W8 TT rows of the kit lanes.

## 1. Pass record (WPR1)

| Field | Value |
|---|---|
| World, part | TTKS, institutions and places, person-to-person roles, money and information, time, power subtleties, starts, failure, surfaces (WPR9-WPR17), plus a WA6 floor card |
| What "TTKS" is | **A source site, not a series.** `ttks.tw` is the Taiwan web-novel reader from which Weibao supplied five unrelated Chinese web novels (B1-B5, five authors, five power systems; `TITLES.json`, kit card header). The brief's phrase "five-book series" is corrected here; the kit card W2 row already says "five worlds, not one power ladder". The floor card is therefore **per book: 25 records, not 5** (the brief allows per-book records) |
| Mode | Reuse the private deep dives, then four bounded haiku windows, then coordinator spot-checks |
| Output owner | this file. New file because no institutions/roles owner exists for TTKS (WPR3); link follow-ups in section 12 |
| Stop condition | four readers used, repair reserved and not needed, stop. Unread parts are named gaps (section 9) |

### Editions and hashes (WPR2, WPR23)

All text is the **Traditional Chinese ttks.tw edition**, fetched 2026-10-10 in Weibao's Chrome, saved as one JSON per book under `docs/research/novels/ttks-novels-2026-10-10/B*/sources/ttks-browser-2026-10-10/` (gitignored). Locator convention: `[member pN]`, member = four-digit key in the JSON, p = nonempty paragraph counted from 1 after stripping site-injected ad lines. Member numbers are not always printed chapter numbers (B3 restarts numbering in later segments; B5 has author notes among members).

| Book | Title (Chinese, gloss) | Author | Platform of record | Members, chars | SHA-256 of saved JSON (first 16) | Other text sources |
|---|---|---|---|---|---|---|
| B1 | 巫師你好，我是偽人 (Hello Wizard, I Am a Mimic) | 軟糖鳶尾藍 | Qidian (book ID unresolved) | 1-111, 311,960 | d11e473e1f44708e | none |
| B2 | 一年抽取一詞條，模擬的也可以？ (One Trait a Year, Simulated Ones Count Too?) | 六大六子 | Fanqie | 11-665, 1,473,037 | 7e5ee0d25036baf1 | chapters 1-10 from Fanqie free reader |
| B3 | 咒回：特級的我去死滅打宿儺了！ | 皮卡堂布拉特 | Fanqie | 11-429, 955,004 | 8bb799cbd54c137b | chapters 1-10 from Fanqie free reader |
| B4 | 全人類的繼承者 (Heir to All Humanity) | 萬里萬雪 | Qidian | 1-206, 591,864 | 6d7b5235262ec93b | none |
| B5 | 廢土邊境檢查官 (Wasteland Border Inspector) | 斤斤斤 | Qidian 1044920002 | 1-668 in six saved files, about 4.07M chars | aac185d1... (partial 1-105) plus five part files (receipts in `RECEIPT_parts.json`) | none |

Local library (WPR23): none of the five titles was found by name in `~/Calibre Library` (searched two levels deep, Chinese simplified and traditional title fragments). `LOCAL_LIBRARY.md` was not found at depth 2 of the repo; no stale path to confirm. The ttks.tw JSON is the only local text. All five books are **ongoing**; everything here is "as of 2026-10-10". Ad lines injected by the site ("read this book at ttks...") were stripped from windows and are not source content.

## 2. Manifest: reuse, windows, budget (WPR2, WPR7)

### Reused first (nothing re-read for these)

| Source (private store unless noted) | Used for | Status |
|---|---|---|
| `B1..B5/DEEP_DIVE_2026-10-10.md` (about 10,000 words in total) | Rules R/L tables, catalogs, gaps | full-text reads by Sonnet/Codex readers; core laws spot-checked in text by the earlier lane; I re-opened 11 locators (section 8) |
| `readers-2026-10-10/*` | Not reopened | reader notes, unverified |
| Kit cards `ttks-b1..b5`, W3-TT rows, W2 TT rows | What the repo already proposes | proposals, mostly original rosters and invented price anchors |
| FINDINGS.md Addendum 3 (P01-P32) | Proposal history | proposals |

### Windows (script-extracted; one reader at a time; haiku set in each first brief)

Word unit: **1 Chinese character = 1 word**. Counts are nonempty paragraph characters, locator markers excluded (`passes-2026-10-23/windows_manifest.json`).

| Window | Book | Label | Content | Chars | Gap it fills |
|---|---|---|---|---|---|
| W1 | B1 | mixed: 0017-0018 and 0021-0022 consecutive pairs, 0032 whole | wild-wizard gathering, Mind Quartz sale, parcel pickup, awakening rite, salon | 11,896 | B1 deep dive s9 (how the Association works, prices, rite materials); no price anywhere in repo docs for B1 |
| W2 | B4 | mixed: 0150, 0201-0202 consecutive, 0203 partial to p29 | penance nuns, Church envoys, dwarf Hammer Council | 11,986 | B4 deep dive covers purity/credentials but has no Church or dwarf-government institutions; W3-TT4 had no source |
| W3 | B5 | mixed: 0024, 0028, 0029 whole, 0057 to p118 of 133 | checkpoint layout, ranks, quarantine, unwritten rules, fees | 11,965 | kit card: "denomination unknown", "exact source ladder open" |
| W4 | B2 | mixed: 0017, 0020, 0376-0378 consecutive, 0379 to p64 of 85 | sect search, martial hall, 柴火門 sect economy | 11,989 | W3-TT2: "denomination unknown"; no sect institutions in deep dive |
| Total | | 4 windows, 19 chapter members (14 whole, 5 partial) | | **47,836** | |

Why not keyword density alone: a census scored purity and detector terms highest in B4, which the deep dive already checked (R1), so W2 was retargeted to the Church and dwarf-government chapters (WPR2, Lessons). B3 got no window (section 9); B2 and B3 compete for the fourth reader and B2 had a named kit gap.

### Invocations and usage (WPR7, AU2)

| Item | Count |
|---|---|
| Haiku readers (fresh Agent calls, model "haiku" set in each first brief, sequential) | 4 (W1, W2, W3, W4); about 106k, 107k, 112k, 110k subagent tokens, 2 tool uses each |
| Repair readers | 0 used of 1 reserved |
| Advisor consultations (coordinator) | 1 (pre-dispatch; led to per-book floor, B2 swap, number checks) |
| Coordinator | Sonnet; opened 40+ spans itself (section 8) |
| Interruption | one session rate-limit stop after W1; resumed from saved window and return files, no extra budget |
| Source words read | 47,836 (four windows) against a cap of about 48,000; none of it was keyword-excerpt reading except where labeled mixed |
| Saved | `passes-2026-10-23/` (windows, returns, scripts, hashes) in the gitignored private store; nothing else touched |

Return hashes (first 16): W1 b9e741f7c03ec0a6, W2 d525b51e04760216, W3 a5e7c9766bdadf2c, W4 eb6a3dcbfe0de07b.

## 3. Coverage of the WPR rows

| Row | Covered by | State |
|---|---|---|
| WPR9 places | W1 (gathering, Sanctuary, Abbey Wood post), W2 (nun church, Hammer Council hall, forge), W3 (checkpoint zones A-F, warehouses, garage), W4 (martial hall, 柴火門) | F1-F12 |
| WPR10 roles | all windows | F13-F22 |
| WPR11 institutions, law | W2 vote rules, W3 unwritten rules, W4 vassalage | F23-F30 |
| WPR12 money, information | W1 GBP trades, W3 happiness coins and contribution points, W4 tithe and 源石 | F31-F40 |
| WPR13 time | W1 gathering, W3 shifts and holds, W4 ages | F41-F44 |
| WPR14 power subtleties | reuse + W1/W3/W4 | F45-F50 |
| WPR15 starts | W1, W3, W4 | F51-F54 |
| WPR16 failure | W1, W3, W4 | F55-F57 |
| WPR17 surfaces | all | F58-F60 |
| Not covered | B3 institutions beyond the contract layer; B1 volume-2 Association; B4 purity-band institutions below 15%; B5 later Happiness City institutions (members 0100-0668); B2 beyond sect level | section 9 |

## 4. Findings (coded; evidence label and locator on each)

Labels: shown, stated(who), inferred(who), proposed. Check: **V** = I opened the locator in the source; **R** = reader-reported, locator not reopened; **W** = reused deep-dive claim, not reopened. Reader paraphrase of Chinese may mistranslate; numbers apply to their scene only (WPR4). Protagonist names vary by translation (B1 deep dive 羅根 Rogan, reader "Luo").

### B1: mimic and wizards, London

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F1 | Wild wizards trade at an ether-hall gathering ("the Sanctuary") run by a host with the handle 無冠者. Entry is by private-message invite and a circle ritual with an opening phrase; joining talk or trade binds you to a shared secrecy oath. | shown/stated(host) [0017 p33][0017 p48][0017 p23-p24] | R |
| F2 | The host witnesses and arbitrates trades only if both sides consent, and explicitly gives no quality guarantee, no outcome liability and no identity vouching. About 20 attend, faces misted or masked. | stated(host) [0017 p51-p52][0017 p37][0017 p28] | R |
| F3 | The host himself sells Mind Quartz (心靈石英) at 1,000 GBP with no bargaining, delivered by a suited courier against cash. | stated(host), shown [0018 p41][0018 p50] | V |
| F4 | The Association's internal budget for the same item is about 800 GBP but leaves a trace and draws Hunter review if the purpose looks wrong. | inferred(protagonist) [0018 p42] | V |
| F5 | A broker, "Grey Snake" (灰蛇), quotes 2,000 GBP with 1,000 GBP advance for 10 ml of Salamander blood against a buyer offer of 1,500; the protagonist privately thinks 1,200 is fair; the courier settles at the next gathering. | stated(broker) [0018 p11-p14] | V |
| F6 | Association structures seen: Mundane Liaison Department (凡世協調部) led by the London chief Oliver Thorne, whose signed and sealed letter overrides identity checks at the Abbey Wood transfer station; Materials Dispatch Department (物資調配部) mails approved ritual jars. A brass robot clerk checks letters. | shown/stated [0021 p20][0021 p26-p27][0021 p32-p34][0021 p18-p21] | R |
| F7 | Ranks seen: apprentice, formal, senior. Association control of ley-line marker materials makes them hard to get off the books. | shown [0022 p34-p35][0018 p43] | R |
| F8 | The awakening rite is done alone with bought materials (feather of a Silent Owl, cypress and bitter-orange oils, silver powder, quartz dish, candles, obsidian dagger); meditation about 50 minutes, enchanting about 10 more. A first attempt failed, suspected site. | shown [0022 p5-p7][0022 p20][0022 p32][0022 p55][0021 p36] | R |
| F9 | [S] The salon master on the gold chair and Thorne's "promotion rite" speech; the true allegiance of London's chief is a late reveal, tag only. | shown [0032 p14-p15][0032 p21] | R |
| F10 | The Association is described by the protagonist as infiltrated, so its routes are unusable for him. | inferred(protagonist) [0032 p41][0032 p54] | R |

### B2: trait simulator and sects

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F11 | Each pre-trait panel shows 7/7 equip slots and a probability list; odds shift with actual realm: 79/14/5/1.9/0.1 percent (common to mythic), then 69/20.8/8/2/0.2, then 50/28/17.6/4/0.4. | shown [0024 p26-p29][0045 p39][0102 p84] | V |
| F12 | A martial hall in a one-hall town accepts anyone who pays; students without root bone get health training only; promising ones are referred to a sect, making the hall a feeder. Its claim of sect partnership was a bluff sold by a companion. | shown/stated(Xu Linglong) [0020 p66-p78][0020 p69] | R |
| F13 | The nearest human sect, 柴火門, recruits daily, tests root grade with a black stone that reads grade only, and is a vassal of an ox-head-race sect (鐵血門). | stated(萬事通), shown [0376 p71-p77][0377 p31-p36] | R |
| F14 | A new member gets a wheat field and keeps what is left after a 70 percent tithe. | stated(elder) [0377 p47] | V |
| F15 | Third-generation disciples farm and work and pay part of earnings and grain as tuition (share not given); first and second generation are exempt in theory, work in bad years. A sect should give monthly cultivation resources; this one gives none. | shown [0378 p33-p36][0378 p45-p46] | V for p33-p34, p45 |
| F16 | Food chain stated: big sects eat small sects, small sects eat commoners; this sect takes only what it must. Human sects are mostly vassals; the goal is first-tier vassal status under 丘風宗. | stated(ancestor, 萬事通, sect head) [0378 p11-p14][0376 p19][0379 p25] | R |
| F17 | Outsiders need a residency permit with heavy protocols; nobody checks it in the home town. 源石 cannot be cultivated with but is hard currency. | stated(ancestor) [0378 p20-p27][0378 p59] | R |
| F18 | Seats follow cultivation; two readings of the protagonist's seat (senior offered, sixth recorded) are kept in section 6. | shown [0377 p68][0378 p29-p32] | R |

### B3: no new reading; reuse only

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F19 | Submitting a challenge result makes the virtual world real, locks it against further challenges and cannot be edited afterward; a previously archived result can still be submitted later if later attempts disappoint. | stated(system) [0128 p71-p87][0128 p78] | V |
| F20 | The Maki branch is an institutional contract: make Maki head of a clan and reform it, one life, no techniques. Only the contract line was reused. | stated [0237] (deep dive) | W |

### B4: purity society, Church, dwarves

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F21 | Social bands by detector reading: above 15 percent a legal citizen, above 20 a noble; the newest enforcement detector tops out at 30 percent; a reading over 30 prints an "over limit, stay humble" notice; being forced to test is an insult. | stated/shown [0003 p7][0003 p11][0003 p47][0018 p50][0018 p3] | V |
| F22 | Public resources serve any human unconditionally; private property obeys only its owner, so a household AI refuses a guest who tries to dispose of an estate. | stated(AI) [0129 p87][0129 p96] | V |
| F23 | The dwarf Hammer Council (鐵錘議會) has 11 members, 300 proposal seats (can propose, not members) and 5,000 gallery seats with no proposal right but final say on large proposals; members cast 100 votes each, proposal-seat holders 5; a tie passes the final decision to the council. | shown [0202 p7-p12][0202 p73][0202 p162-p163] | V for p7-p11, p73 |
| F24 | Other races may sit in the gallery but never hold proposal seats or council seats. A member can lose his seat when the gallery demands it, without a council vote; a member with a conflict of interest sits out and is represented by his son as seat-holder. | shown [0202 p60-p61][0202 p64-p75][0202 p1-p3] | R |
| F25 | The Church's price for sky data is destroying the dwarves' core forge (the only ancient forge that can make everything; dwarves hold use rights only, they did not build it). The Church supplies a storage plate as a goodwill proof first. | stated(cardinal), shown [0201 p137-p144][0202 p135-p139] | R |
| F26 | The Church has an inner branch of "sin-monks" (罪孽修士) whose purpose is to prevent humans from ruling again; a high cardinal's job is to argue against consensus and act as deputy pope. | stated(cardinal), stated(narration) [0201 p110][0201 p93-p94] | V for p110 |
| F27 | Dwarves and the Church fought six wars, each lasting years, the longest over a century; the last ended about 400 years ago and forced dwarves to accept human faith. | stated(narrator) [0201 p57-p60] | V for p57 |
| F28 | The penance nuns (贖罪修女會) are a small branch outside the three major orders, a dozen or so in a bare mountain church, kept supplied by one family of visitors; the family survives by selling church bricks to nobles. | shown [0150 p48-p58][0150 p72-p74][0150 p104-p106] | R |

### B5: border checkpoint

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F29 | The north station is the showpiece of a three-station network; walled interior has zones A to D screening (A vehicles, B scavengers and ID holders, C people from other shelter cities, D special staff), E office, F rest; each zone has a screening front and an observation rear with four warehouses. | shown [0024 p16-p29][0024 p34-p36][0028 p9-p12] | R |
| F30 | Rank order: station chief, deputy chief (mostly in the field), inspectors, then inspectors' children as trainees doing filing and entrant checks; zone assignment is random and reset weekly; shifts 8:00-16:00 and 16:00-24:00; eight inspectors rotate each week. | stated(guard) [0024 p87-p89][0024 p91] | V |
| F31 | Trainee wage is paid in happiness coins (幸福幣) and is not worth living on; skimming pays several times the wage; even an honest inspector clears over 1,000 coins a month (the guard's estimate). | stated/inferred(narration) [0024 p98-p100] | V |
| F32 | Unwritten rule: seized contraband sells through the exchange office at 100 percent, while a smuggler selling directly gets 70 percent; the 30 percent gap is the inspector's "contamination risk fee". | stated(observer) [0029 p15-p16] | V |
| F33 | Charging needs a Works Office (工務署) permit; fast charge costs 5 contribution points (貢獻點) per 100 kWh in the buffer zone and three times that (15) in the quarantine zone; slow charge for station vehicles is free. | stated(observer) [0029 p48][0029 p63][0029 p69] | V for p63, R others |
| F34 | Quarantine: inspector sets the hold, minimum 72 hours; a cell holds 4, zone A has 75 cells, so a cap of 300; overcrowded cells breach the manual and the cure is release; every day under the isolation-rate quota is logged against a trainee, whose record can delay confirmation. | stated(observer), shown [0028 p56][0057 p11-p13][0057 p41][0057 p76] | V for p56, p11-p12, p41 |
| F35 | Staff on the quick-check line serve fixed three-month terms with observers (code-named, inherited by replacements); only inspectors rotate daily; an inspector can order a guard removed with one sentence. | stated(observer, deputy's son) [0028 p36-p41][0028 p23] | R |
| F36 | A senior inspector offers a loan of 100 (unit not stated) and two tricks; the protagonist's loan limit is already at cap this month. | stated [0057 p65][0057 p67] | R |
| F37 | Chargeable electricity gates search frequency: the protagonist reasons that grid access is a power lever (one search per 3 days at home, about four per day on a fast charger) and that charge records could expose a user. | inferred(protagonist) [0028 p79][0029 p93-p96] | R |

### Cross-book: roles, time, failure, surfaces

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F38 | Broker and witness pattern: B1's host witnesses trades but guarantees nothing; B4's nuns and visitor family run a one-family courier line; B5's observers hold inherited code names. Each is a role with a duty, a limit and an inherited seat. | see F2, F28, F35 | R |
| F39 | Hours and rhythms: B1 gathering announced for 3 standard hours but ended about an hour in; B5 gate opens 8:00 and shifts run 8/16/24 with weekly zone swaps; B2 ages tick one draw per lived year (ages 33, 34, 41, 44, 63, 64 at the years read). | shown [0017 p55][0018 p54][0024 p45][0017 p6][0020 p73][0378 p72] | R |
| F40 | Failure: B5's trainee carries a dispute record that can slow confirmation; B1's first awakening fails and a manhunt follows an alarm; B2's hero has a nationwide warrant issued for a dead man. | inferred(protagonist), shown [0057 p41][0021 p36][0032 p44][0017 p22][0017 p39] | R |
| F41 | Surfaces: B1 private-message panel, brass plaque and letters; B2 trait panel with yes/no swap prompt; B5 badge/ID app (防務通), red-pen conflicts in quarantine files; B4 hammer on a central anvil to call order. | shown [0017 p4-p5][0021 p5-p6][0017 p10-p11][0024 p63][0057 p112-p116][0202 p47-p50] | R |

Rows are grouped, so the section 3 F-ranges are approximate; items not listed here stay in the private returns and carry R at best.

## 5. Engine facts (WPR5: default, dial, reason and cost, exceptions the text shows)

| Code | Default | Dial | In-world reason and cost | Exception the text itself shows |
|---|---|---|---|---|
| EF1 | A neutral broker/host witnesses a trade but guarantees nothing. | Witness fee, who may arbitrate, oath scope. | Host keeps order, not responsibility (F2). | The host also sells stock himself (F3). |
| EF2 | The same good has an official price and a grey price. | Premium or discount (here about 20 percent over the internal budget price; 30 percent gap for seizures). | The official route leaves a trace and a review (F4); contraband is discounted for contamination risk (F32). | A buyer may pay a stated rate to a broker with advance (F5). |
| EF3 | Rank is earned by cultivation, not paid for. | Seat ordering, vassal tier. | Cultivation sets seat order (F18); a sect gives no resources it does not have (F15). | A hero hides his true realm to avoid being tested (B2 [0377 p57]). |
| EF4 | Tithe on land worked: a fixed share to the sect. | 70 percent here; may differ per sect. | Sect's tuition substitute (F14-F15). | First and second generation exempt, but work in bad years. |
| EF5 | Voting weight differs by seat class, with a larger unweighted body holding the final say on big proposals. | Weights (100 vs 5); gallery weight (not stated, open). | Dwarf politics balances elites and crowd (F23). | A tie goes to the council. |
| EF6 | Credentials differ in kind (public use vs private ownership vs living-human status). | Which resources are public. | AI follows law and owner (F22). | A guest who accepts a family's duties can become owner (B4 deep dive R5, W). |
| EF7 | A detector reading above its cap prints "off the scale" and counts as information. | Detector model. | Newest model caps at 30 percent (F21). | None shown. |
| EF8 | A checkpoint's formal pay is token; the real income is a rake on seizures and charging. | Rake rate, who may charge. | Low wage, unwritten rules, a 30 percent "risk fee" (F31-F32). | A single honest inspector still clears over 1,000 coins (F31). |
| EF9 | Quarantine is the safe default and release the cure for overcrowding. | Hold minimum (72 h), cell size (4). | Liability favors holding (B5 deep dive); the manual forces release past capacity (F34). | Trainee quota logs punish early release when below rate (F34). |
| EF10 | Electricity is the currency of power in the checkpoint. | Rate per kWh in zone, permit. | Works Office controls batteries (F33, F37). | Slow chargers for station vehicles are free. |
| EF11 | An archived result is a free draft; a submitted one is permanent. | How many may be archived (open). | Lock stops further challenges (F19). | None shown. |

## 6. Contradictions and divergences kept (WPR20)

| Code | Side A | Side B | Treatment |
|---|---|---|---|
| C1 | Brief and kit root: "TTKS five-book series" | Five unrelated books from one site (TITLES.json, kit W2 row) | Floor is per book; reading corrected |
| C2 | Kit W3-TT5: B5 currency "denomination unknown", ladder "trainee, appointed inspector, shift lead (original floor)" | Source shows happiness coins and contribution points, and a ladder of station chief, deputy, inspector, observer, trainee/staff [0024 p87-p98][0029 p63] | Kit row stays a proposal; update from the source when absorbed. **Part 2 adds C11-C13 on the same topic** |
| C3 | Kit W3-TT2: B2 "denomination unknown", proposed copper | Source shows silver (銀錢) in the mainland and 源石 as hard currency on the sect planet; no amounts [0017 p73][0378 p59] | Both retained; no amounts exist to anchor |
| C4 | Kit W3-TT1: B1 prices proposed as £1 bread, £25 room, £15 coached session, £12 tool, "2010 setting from FINDINGS" | Source gives trade prices in GBP: 1,000 for Mind Quartz, 2,000 for 10 ml blood, 800 internal [0018] | Source gives occult-market scale, not mundane scale; mundane anchors remain proposals |
| C5 | B2 senior elder seat on arrival | Sixth elder seat recorded [0377 p68][0378 p29-p32] | Reader-reported; unresolved without a reread |
| C6 | B1 gathering announced 3 h | Ended in about 1 h [0017 p55][0018 p54] | The host may end early; no rule found |
| C7 | B4 gallery of 5,000 holds "final say" on big proposals (F23) | Members 100 votes, seat-holders 5 (2,600 combined) and gallery weight never stated | **Part 2: partly resolved.** [0202 p72-74] says members and seat-holders have more votes per person than the gallery and that all of them together still cannot outweigh the gallery, so the gallery is at least 1 vote each and 5,000 or more in total; one vote each is inferred(coordinator), not stated. Part 1's "never stated" was too strong |
| C8 | B5 W3: Ding (丁站長), Ha Lin (哈林) and Tangs all named as chiefs | Which station each runs is unclear in the window [0024 p52][0024 p87][0057 p33] | Open: read members 0001-0023 (part 2 did not touch it) |
| C9 | B5 deep-dive R3 says one search per 2-3 days from a home socket | Source figure: about 50 kWh per day from a socket, 100 kWh per level-1 charge (inferred by protagonist) [0010 p87][0010 p91] | Consistent in magnitude; keep as inference |
| C10 | B3 deep dive: excessive civilian deaths fail the One Piece challenge | A mass-death outcome is accepted after death (B3 deep dive s7 [0280][0344]) | Kept from the deep dive; not reopened |

## 7. Searches that found nothing (WPR23)

| Search | Where | Result |
|---|---|---|
| Runtime TTKS code | `grep -rli` for ttks, the five slugs, mimic, "border inspector", "annual draw", "challenge board", "archive.*submit" over `src data scripts tests` | zero hits for all TTKS terms; "purity" hits Worm, "cooperation" hits unrelated modules |
| Titles in Calibre | `~/Calibre Library`, depth 2, Chinese fragments | not found |
| Membership fee of the B1 Sanctuary | W1 | not in window |
| B2 sect pill and silver prices | W4 | not in window |
| B5 trainee wage amount | W3 | amount unstated ("a few happiness coins") |
| B4 monthly tax to the stronger sect (B2) | W4 | not in window |
| Hospitals or healers as institutions | all four windows | not seen; B5 clinic role is only in kit proposals |

## 8. Source spot-checks by the coordinator (WPR18-19)

I opened each locator in the saved JSON (via `scripts/para.py`) and read the paragraph.

| Claim | Locator | Result |
|---|---|---|
| B1 Mind Quartz 1,000 GBP, no bargaining; cash paid; internal ~800 | [B1 0018 p41][p50][p42] | confirmed |
| B1 blood: buyer 1,500; broker 2,000 + 1,000 advance; Luo thinks 1,200 | [0018 p12][p14][p13] | confirmed |
| B5 70 / 100 / 30 percent rule | [B5 0029 p15-p16] | confirmed (70 percent is for personal sales via exchange; seizure 100 percent) |
| B5 charge fees 5 and 15 points per 100 kWh | [0029 p63] | confirmed; "three times" in the same line |
| B5 min quarantine 72 h | [0028 p56] | confirmed |
| B5 zone/shift/rank facts | [0024 p87-p89][p91][p98-p100] | confirmed |
| B5 cell cap 4, 75 cells, 300 | [0057 p11-p12] | confirmed |
| B5 cooperation 10/30/50/100 and same-level 50 percent | [B5 0004 p49-p50] | confirmed |
| B5 100 kWh per level-1 charge | [0010 p87] | confirmed |
| B4 council 11/300/5,000; votes 100 and 5 | [B4 0202 p7-p8][p10-p11][p73] | confirmed |
| B4 purity cutoffs 15/20, detector cap 30, "over limit" notice | [B4 0003 p7][p11][p47][0018 p50] | confirmed |
| B4 public vs private property | [0129 p87][p96] | confirmed |
| B4 six wars, longest over a century; sin-monks | [0201 p57][p110] | confirmed |
| B2 odds 79/14/5/1.9/0.1, 69/20.8/8/2/0.2, 50/28/17.6/4/0.4; 7/7 slots | [B2 0024 p26][p29][0045 p39][0102 p84] | confirmed |
| B2 70 percent tithe; tuition for third generation; no resources | [0377 p47][0378 p33-p34][p45] | confirmed |
| B1 charges 3, +1/4 h, 6-month full slash, 36 h prep | [B1 0070 p42-p43] | confirmed |
| B1 melting if no identity taken | [B1 0002 p53][p69] | confirmed |
| B3 submit locks world, archive allowed | [B3 0128 p71-p87][p78] | confirmed |

**Not confirmed by me, so unverified:** every R and W row above; the B2 slot counts 9 and 14 and "settlement whitelist" text; the B5 degradation stars (one star drops a grade) at [0089][0133][0214][0305], where I found the star marker on talents [0089 p135-p138] but not the definition; the B4 "below 3 percent residue, below 5 percent waste" bands; B5 hydro refill in hours; the B1 cocoon 24 h and fluid 48 h states. No misreading by a reader was found in the numbers I reopened; the one adjustment is that the W3 reader's "Luo" is a translation variant of 羅根 (Rogan).

## 9. Open gaps with exact windows

| Gap | Why it matters | Exact window to read next | Est. size |
|---|---|---|---|
| B3 institutions: hub system, Maki-branch clan hierarchy and reform | no institutions reading for B3 at all | **PART 2 READ (2026-10-23): 0237, 0238, 0240, 0242, 0273 and 0274-0278; see section 14.** Still open: 0239, 0241, 0243-0272, 0279+ | about 23,000 chars (two windows), 22,180 read |
| B5 station chiefs and the transfer order (C8) | who runs which station | members 0001-0023 | about 60,000 chars (split in five) |
| B5 later promotion routes and checkpoint reform | deep-dive gap: routes 鋒探/銳探, 御聯, 衡御 | **PART 2: 0409 read whole.** Open: 0270 (稜鏡成立, 6,171 chars, no promotion term hit), and the 衡御/破勢/毀滅/鎖定 route texts beyond one-line summaries in the later chapters | about 6,200 |
| B5 trainee wage and confirmation ladder | wage amount | **PART 2: 0016 whole gives a 24-point credit and borrowing caps (F42-F44).** Open: wage period and the trainee-to-confirmed ladder, members 0100-0110 (0101 has 轉正) and 0017-0023 | about 12,000 |
| B1 Association functions and Hunters | how detection works; Wizards Association roles | members 0038-0039, 0081 | about 6,600 |
| B1 Sanctuary membership terms | fee or none | members 0033-0036 (NOT READ in part 2: reader budget used; 9,029 chars) | about 9,000 |
| B2 sect prices and silver | money gap C3 | members 0380-0384 (NOT READ in part 2; 10,829 chars; a 220k-char census was not run, so these members may not hold prices) | about 10,800 |
| B4 Church ladder, nobles' taxes and golden-line social bands | missing Church/nobility rules | **PART 2: 0184 and 0204 read whole, 0206 NOT read** (budget); noble taxes are not in 0184/0204/0206 (zero 稅 hits, section 14.4). Open: 0206 (4,485), 0022 and 0026 (tax collector scenes, 25 and 20 稅 hits), 0048 p72-92 | about 9,000 |
| B4 gallery weight in the Hammer Council | C7 | **PART 2: closed by the coordinator reopening 0202 p68-74 (F47); 0203-0204 were not needed.** Residual: the exact per-person gallery vote is inferred, not stated | none |
| B2 hall earnings figures | money | members 0020 p80+ and 0644 | about 4,000 |

## 10. Review state (WPR21)

Highest state reached: **source-spot-checked** for rows marked V. Everything else is **drafted**. Not reached: rules-reconciled with the engine, built, browser-verified, director-accepted. Reader rows were extracted by haiku in one pass each; I rejected none outright but did not use rows without locators or with ambiguous units (for example "100" in a loan). Limits: translation uncertainty on names and ranks; the editions are an unauthenticated fan-site compilation; window numbers apply to their scenes only and are not universal price tables.

## 11. More-to-consider round (WPR24)

**ACT NOW (done in this file):** series framing corrected; section 6 kept both sides; price/rate locators opened; fees tagged.

**ACCOUNT FOR NOW (constraints on current work):**

1. Any TTKS slice must name one book; no shared "TTKS economy" or ladder.
2. Currency in kit cards is a proposal; B5 has happiness coins and contribution points in source, B1 has GBP at occult scale.
3. Do not set a number for the B4 gallery weight.
4. Treat the B5 30 percent "risk fee" as an unwritten rule stated by an observer, never as the checkpoint's published fee.

**LATER/DELEGATE (level, effort, done check):**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Read the section 9 windows, B3 first | haiku readers + sonnet judge | M (four readers) | gaps marked read, new F rows with V |
| Data row for "official vs grey price with a risk fee" shared mechanism | sonnet | S | one trade resolved under both prices in a stepped test |
| Data row for weighted vote with tie-break | sonnet | S | one council vote from F23 weights |
| Update kit W3-TT rows from this file | sonnet | S | C2-C4 rows replaced or annotated |

**Separate short suggestions (not reasons to stop):** a "tithe on land" field for sect membership; a "token wage, rake income" job type; an "inherited seat" flag for observer roles.

## 12. Next-pass ranking (WPR25) and links needed

Ranked by readiness:

1. **B5 later checkpoint institutions** (source in hand, richest institutions; 3 readers).
2. **B3 institutions** (zero new reading yet; 2 readers).
3. **B4 Church ladder and noble society** (2 readers).

Files needing links (this pass touched nothing else, WPR3, WPR28):

- `docs/worlds/world-core-kit-2026-10-14/cards/ttks-b1.md` to `ttks-b5.md` (K7/K8/K13 pointer to this file's book section and floor records)
- `docs/worlds/world-core-kit-2026-10-14/W3_PEOPLE_INSTITUTIONS_LIFE.md` TT rows (C2-C4)
- `docs/research/novels/ttks-novels-2026-10-10/CHECKPOINT.md` (private, optional pointer)

## 13. Floor card (WA6)

Per book, because laws, power and loops differ (WPR5, kit W2 row). Fields: default, dial, in-world reason and cost, source locator and evidence label, current repo coverage, smallest playable slice. Repo coverage for all 25 records (WPR23, section 7): **no runtime code** for any TTKS book; documentation only (kit cards at W1 floor D partial, R missing; W2/W3/W7 TT rows; FINDINGS P01-P32; for B1 `RIVALS_IDENTITIES_AND_FATE` "Identity theft and replacement"; for B2 `SIMULATORS_AND_CHEAT_IMPLEMENTATION`; B3 `CHEAT_LIBRARY`). Evidence labels: V = I opened it; W = deep-dive claim not reopened; R = reader-reported. Nothing below is canon invention: where the source gives no value the cell says so.

### B1 (mimic and wizards)

| Part | Default | Dial | Reason and cost | Locator and label | Repo | Smallest slice |
|---|---|---|---|---|---|---|
| K2 laws | A mimic must take an identity and anchor to it or melt; anchor breaks, powers stop. | What counts as the anchor; melt window length (W: 24-48 h). | Existence cost: forced identity theft and routine. | shown [0002 p53][0002 p69] V; anchor fall-out [0008][0068] W | docs only | Anchor-hunt event: three NPCs, one mimic, break the anchor then kill |
| K3 power | Powers carry a charge/cooldown and a level gate: space slash 3 stored, +1 per 4 h; full slash once per 6 months, 36 h prep, target level not above own. | Charge count, refresh, prep time. | Prep and cooldown are the cost; level comparator blocks the strong. | stated(system) [0070 p42-p43] V; wizard ranks apprentice/formal/senior shown [0022 p34-p35] R | docs only | One power with charges and a level comparator against two targets |
| K6 cast | Contacts are known by handle and mask, not by vouched identity. | How much the host vouches (here none). | Secrecy oath, anonymity is the shield. | host 無冠者, broker 灰蛇, Thorne, presiders [0017 p4][0018 p11][0021 p26][0032 p8] R | kit rosters are original names | Gathering with host, broker, buyer |
| K8 daily life | Occult trade in GBP cash at evening gatherings; ordinary cover job and rent are ordinary life. | Prices vary by rarity and risk; gathering cadence unknown. | Association channel leaves a trace and review. | prices V [0018 p41][p50][p42][p14]; cover-job life is not in window (gap) | proposed mundane anchors in W3-TT1 conflict in scale (C4) | Weekly gathering plus cover-job day with one trade at 1,000 GBP scale |
| K13 loop | Suspect, observe with two methods, find anchor, break it, then kill; optional death rewind keeps notes. | Number of methods, false-positive rates, rewind allowance. | Death loop piles voices and sanity cost. | W deep dive s5, s8; rewind inference [0032 p72-p73] R | docs only | Deep dive s8 "anchor hunt" |

### B2 (annual traits and simulation)

| Part | Default | Dial | Reason and cost | Locator and label | Repo | Smallest slice |
|---|---|---|---|---|---|---|
| K2 laws | One trait per lived year; odds and equip slots rise with actual realm; a simulation settles back only memory, realm, traits and arts. | Realm odds table; cooldown ladder (1, 3, 10, 100 years, W); bypass quests. | Matter, feelings and relationships do not return; draws fail where time flows differently. | odds and 7/7 slots V [0024 p26][p29][0045 p39][0102 p84]; whitelist W [0024] | docs only (cheat doc) | Yearly draw with 3 grades and a 3-slot loadout |
| K3 power | Owned is not equipped; the loadout swaps at the yearly prompt inside a simulation; traits scope to their wording. | Slots by realm (7/9/14 V/W). | Choosing gives up something; scoped effects can conflict. | shown [0024 p26]; scope W [0383][0397] | docs only | Trait inventory plus 3-slot loadout |
| K6 cast | Companions and rivals meet the protagonist at the hall or sect; a bluff partnership is sold by a companion. | Whether a person is simulated or real. | Reputation. | 陳奕 [0024 p20]; 孫承恩 [0020 p72]; 老劉; 許玲瓏 [0020 p69]; 沈一峰, 馬邦 [0377 p63] R | original names in W3-TT2 | Hall with owner, bluff seller, one referral |
| K8 daily life | Pay-to-train martial hall income; sect members till land and pay a 70 percent tithe; 源石 is hard currency; silver on the mainland. | Tithe share, vassal tier. | Sect gives no monthly resources when poor. | tithe V [0377 p47]; tuition V [0378 p33-p34]; hall [0020 p75-p80] R | proposed copper anchors only | Month on a field: tithe, one lesson, one market trip |
| K13 loop | Draw, equip, simulate a life, settle, apply forecast with decay as the real world diverges. | Run length, forecast decay. | Run costs almost no real time; forecasts go stale. | W deep dive s5, s8 | docs only (cheat doc) | Deep dive s8 slice |

### B3 (challenge board)

| Part | Default | Dial | Reason and cost | Locator and label | Repo | Smallest slice |
|---|---|---|---|---|---|---|
| K2 laws | An attempt is a projection; submitting makes it a real, locked world; an archived result can be submitted later. | Contract per challenge: lives, allowed powers, win/fail. | Lock prevents more challenges. | V [0128 p71-p87] | docs only | One world, two-contract board, archive and submit. **Part 2 CHANGED:** contract card shape (title, blurb, requirement, limit, warning) and abort option now V [0237 p28-p30, p67-p68, p83-p87]; third same-world challenge raises difficulty V [0237 p47] (F42-F45) |
| K3 power | A defeated named opponent can drop at most one related technique, never a copy; no reroll, only deletion. | Drop odds, reward cap (unknown). | Prevents copies, gives each world loot identity. | W deep dive R5 [0018][0072][0129]; **Part 2:** this contract strips cursed energy, technique use and rewind, one life [0237 p86-p87] V | docs only | One drop table per named enemy |
| K6 cast | New attempt, new NPC instances without memory; protagonist keeps powers. | Whether a branch gives a local host the reset. | Attempt isolation. | W [0022][0073]; **Part 2 CHANGED:** clan roles V: head by will with a youth as witness, a keeper-elder who runs the succession booklet, elders who comply with a will, a removed rival and a resigning branch head [0273 p77-p79][0276 p52-p69][0277 p89-p110] (R for the last two) | original names in W3-TT3 | Dispatch coordinator, witness, trainee; or head, witness, rule-keeper elder |
| K8 daily life | Hub is the only irreversible layer; submitted worlds are visitable with no rewind; clocks between worlds unknown. | Visit frequency, grace period (7 days, W). | Visits cannot be reset. | W [0173][0373]; daily detail not in any window (gap); **Part 2:** hub is a prompt dialogue and no fee, price or wage appears in W5/W6 (F46); clan service costs lives (F53) | proposed yen anchors only | Visit a submitted district for one ordinary day |
| K13 loop | Attempt, die or win, hub reward, archive or submit. | Retries, evaluation after death. | Unlimited retries are safe only inside a challenge. | V for archive/submit [0128]; **Part 2:** offer, confirm, card, abort, one-life clear V [0237 p28-p87]; rest W | docs only | Deep dive s8 |

### B4 (heir to humanity)

| Part | Default | Dial | Reason and cost | Locator and label | Repo | Smallest slice |
|---|---|---|---|---|---|---|
| K2 laws | A living human outranks all; public resources serve any human unconditionally; private property obeys only its owner. | Which resources are public; purity bands (15 citizen, 20 noble). | AI law and owner; detector top out at 30. | V [0129 p87][p96][0003 p7][p11][p47]; **Part 2 CHANGED:** gallery weight inferred 1 per person V [0202 p72-p74] (F79); divine machine rules facts not motives V [0048 p23-p36] | docs only | One ruin with three legacies, each with a different gate |
| K3 power | Credentials of different kinds (use, own, know, command) and golden-line power that rises with age until it burns the body. | Credential type, delegation scope. | Grant kinds separate; burnout is the cost. | W deep dive s3, s4 [0060][0096][0067]; **Part 2:** the machine link needs a cardinal's authority, not the pope's V for p76 [0184 p76][0184 p91-p97] | docs only | Delegate one credential to a companion |
| K6 cast | Powers are held by AIs with purposes, a dwarf council, a Church with sin-monks and nuns. | Per-AI constraints; deception allowed. | Each has its own ethics. | R [0201 p110][0202 p7][0150 p48] and W; **Part 2 CHANGED:** Church ladder pope, great cardinal (3 gold lines, cannot be pope), cardinals V [0184 p91-p97]; Rose Nuns one of 3 orders V [0051 p52-p54]; devoted women under 3 vows V [0204 p53-p56] | docs only | Council seat, cardinal, great cardinal, one AI |
| K8 daily life | Purity as social band with blood as currency and marriage markets; nuns sustained by a courier family; nobles buy church bricks. | Band thresholds; detector model. | Insult to be tested; impurity cost. | V for bands; R [0150 p72-p106]; **Part 2 CHANGED:** a lord title at purity 29.3 under the 30 mark; nobles' officer passes settlement set-up, monthly tax and machine issue V [0031 p4-p8]; no tax rate stated (absence, 0184/0204/0206 have no 稅); debt paid with a third-class settlement's future taxes, 200-300 years V [0048 p52-p71]; gold: 817,200 vs 827,200 conflict (C16) | docs only | A near-human at 13 percent, one purity test, one patron; or one tax collector and one settlement ledger |
| K13 loop | Reach a ruin, present a credential, receive a grant kind, face consequences. | Gates per legacy. | Public vs private. | W s8; **Part 2:** machine rulings can bind a noble house V [0048 p23-p36] | docs only | Deep dive s8 |

### B5 (border inspector)

| Part | Default | Dial | Reason and cost | Locator and label | Repo | Smallest slice |
|---|---|---|---|---|---|---|
| K2 laws | A search needs cooperation: 10 percent opens information, 30 items, 50 level-1 skills, 100 level-2; same-level success 50 percent, halving per level above; a charge costs electricity. | Rank, thresholds, kWh per charge (100 at level 1). | Compliance meter; electricity infrastructure. | V [0004 p49-p50][0010 p87]; **Part 2:** 2 charge cycles = +1 percent cap, 200 energy per cap unit, 800 cap V [0409 p68, p82, p100] | docs only | One gate, five applicants a day, cooperation meter and a charge |
| K3 power | The collector copies information, items and skills from consenting people; 3 equipped skill slots at trainee rank; copies degrade without their substrate. | Slots, fusion; star marks (unverified). | Degraded copies; dependence on grid. | V slots [0028 p88]; stars W [0089][0133]; **Part 2 CHANGED:** one route choice per rank-up, lost if skipped; routes 鋒探, 御聯, 衡御, 破勢, 毀滅, 鎖定 V [0409 p109-p110, p194-p199]; 御聯 costs and unlock V [0409 p118, p147-p148] | docs only | Copy one level-1 skill at 50 percent |
| K6 cast | Chiefs, inspectors, inherited-code observers, trainees (inspectors' children) and guards. | Faction balance. | Unwritten rules; sealed promotions for guards. | V [0024 p87-p91]; observers R [0028 p36-p41]; senior inspector Li Mataj R [0057 p65]; **Part 2:** trainee prosecutor with a 100-point lending cap, ordinary residents 10 V [0016 p29-p30] (C12) | original names in W3-TT5 | Chief, two observers, one senior inspector |
| K8 daily life | Shifts 8-16 and 16-24, weekly zone swaps, 3-month staff terms; wage in happiness coins is token, income comes from the 30 percent risk fee and free slow charging; fast charge 5 coins/100 kWh. **Part 2 CHANGED:** the one wage figure is 24 contribution points per credit (period unknown), with happiness coins as the market currency; the earlier "wage in happiness coins" is contradicted (C11). | Rake rate, permit. | Works Office controls batteries. | V [0024 p88-p89][p98-p100][0029 p16][p63][0028 p56]; Part 2 V [0016 p6, p29-p30, p42] | proposed scrip anchors only (C2) | One shift: intake, one quarantine, one free slow charge |
| K13 loop | Interview and instruments, quarantine or release, then a search for the collector, repeated daily. | Channels per applicant, hold time. | Wrong admission spreads infection; wrong refusal costs reputation. | W deep dive s3, s8; hold V [0028 p56]; **Part 2:** rank-up route choice and cap-upgrade grind V (F63-F66) | docs only | Deep dive s8 (three tools, one hidden source) |

## 14. Part 2 (2026-10-23): B3 clan and challenge rules, B5 currencies and routes, B4 Church and settlements

Status: **proposal at pass level; highest review state reached is source-spot-checked (WPR21).** Findings are not accepted decisions and authorize no build, commit or push. Spoilers: none of the rows below needed an [S] tag beyond the few marked. No sealed designed truth was read (WPR8). Part 1 above is unchanged except for dated status notes in sections 6 and 9.

Codes touched (WPR22): WPR1-WPR32 (this section follows WPR9-WPR17 and the lessons in WORLD_PASS_RULES), AU1-AU15, AD36-AD38, WA3/WA4/WA6/WA8, K2/K3/K6/K8/K13 of `ttks-b3`, `ttks-b4`, `ttks-b5`.

### 14.1 Pass record, budget plan, windows (WPR1, WPR2, WPR7)

Declared plan (before reading): coordinator plus at most 4 haiku readers, each a fresh Agent call with `model: "haiku"` set in its first brief, one disjoint window of at most 12,000 Chinese characters (1 character = 1 word), about 48,000 in total, one reader at a time, one repair reserved. Unread parts become named gaps. Window selection began from the part 1 gaps; two windows were retargeted after a focus-term test (below).

| Window | Book | Label | Content | Chars | Reader tokens |
|---|---|---|---|---|---|
| W5 | B3 | mixed: 0237-0238 consecutive, 0240, 0242, 0273 whole; chosen by clan-term density | challenge offer and contract, Maki branch intro, Naobito's successor test, will recording | 11,071 | about 106k |
| W6 | B3 | consecutive 0274-0278, whole | succession steps, Hei and Kugutsu units, reform | 11,109 | about 102k |
| W7 | B5 | mixed: 0016 and 0409 whole, 0015 p1-62 | currencies, borrowing caps, promotion routes, charge-cap economics | 11,959 | about 106k |
| W8 | B4 | mixed: 0204, 0184, 0031, 0051 whole, 0048 p1-71 | Church ladder and robes, Deep Sea Institute, settlements, gold pounds | 11,947 | about 106k |
| Total | | 4 windows, 18 chapter members (16 whole, 2 partial) | | **46,086** | about 420k |

Invocations: 4 haiku readers, 0 repairs used of 1 reserved, 1 advisor consultation (pre-dispatch; it caught the W5 and W8 focus-term failures below). Coordinator opened 60+ locators with `scripts/para.py` (section 14.7). Verbatim returns: `passes-2026-10-23/returns/W5_B3_haiku_return.md`, `W6_B3_`, `W7_B5_`, `W8_B4_` (hashes first 16: W5 0434adbebefaf1b1, W6 6730a081741f0211, W7 571e1d90855a3619, W8 9075a09f29825cb0). Windows: `passes-2026-10-23/window_W5.txt` to `window_W8.txt`, manifest `windows_manifest_part2.json`, scripts `scripts/extract2.py`, `brief2_common.txt`. All in the gitignored private store.

Window changes after the focus-term test (WPR19 lessons): W5 first held 0237-0241 (combat-heavy 0239 and 0241 had zero 禪院家/家主 hits) and was rebuilt to take 0242 and 0273 (家主 8 and 19 hits). W8 first held 0203 tail, 0204, 0184 and 0206; a census over all 206 B4 members found zero 稅 in 0184, 0203, 0204 and 0206, so W8 swapped 0206 and 0203 for 0031, 0051 and 0048, where the tax collector, settlements and gold appear. The B5 wage window used 0016 (幸福幣 4, 貢獻點 12, 工資 1, 額度 2) rather than the unscored 0001-0023. Spelling check: the Hammer Council gallery is 旁聽席, not the zero-hit word 觀眾 or 投票席.

### 14.2 B3: the Maki-branch contract and the Zenin clan

Shared with JJK versus source-specific: the repo's JJK world owner (`docs/worlds/jujutsu/`, ledger entries Zenin Family r58668 and Sorcerer Clan/Zenin Clan r79324) already holds the Zenin clan, succession and key/access ideas as fan-wiki `W` material. I did not reread that wiki. A grep of `docs/worlds/jujutsu` finds no mention of Hei, Kugutsu, a 27th head or the 2018 date. So below: **clan names, the three great families and the idea of a head are franchise-shared names (not checked against the wiki); every row with a number, a date or a reform step is what this book's text shows and may be source-specific to B3's altered timeline.** Name key: 芥劍 (the protagonist, "Kaiken" in reader returns), 禪院真希 Maki, 直毘人 Naobito, 禪院直哉 Naoya, 禪院扇 Ogi, 伏黑惠 Megumi.

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F42 | The hub is a prompt dialogue with the challenge system: the host asks to open a new challenge, the system asks to confirm, offers a challenge it labels very hard, and shows a card with title, blurb, requirement, limit and a warning. | shown [0237 p28-p30][0237 p77-p87] | V |
| F43 | Contract card for this challenge: be Maki in the Zenin clan, help her become head and reform the clan; the host's soul shares her body, may use only her abilities, loses cursed energy and technique use, loses rewind, and a death fails the challenge automatically. | stated(system) [0237 p83-p87] | V |
| F44 | Difficulty of challenges in the same world rises noticeably after the third; this offer is the third challenge in the jujutsu world. | stated(system) [0237 p47][0237 p77] | V |
| F45 | Abort exists: if the host cannot pass, they may request abort and choose other challenge content. An earlier line says "no penalty" and the hard challenge says death auto-fails; both stay (C14). | stated(system) [0237 p64][0237 p67-p68][0237 p87] | V |
| F46 | Third challenge number, soul share and body takeover are described as ability limits, not money; the text names no fee, reward currency or timer for the board in this window. | NOT IN WINDOW [0237-0273] | R |
| F47 | Zenin head: the outgoing head (Naobito, 26th) records a will naming Maki, with Megumi as witness, on video; a backup copy goes to Principal Yaga and to a cloud; the will is said to take effect across the sorcerer world once Yaga is back at the school. | stated(Naobito), shown(narration) [0273 p77-p79][0273 p84][0274 p30-p31][0274 p129-p133] | V |
| F48 | Before the will, Maki must first complete the head's own challenge (fight a named spirit) to be given the post; she reasons that forcing the post would leave elders obedient in word only. | stated(Naobito), inferred(protagonist) [0242 p37-p45] | V |
| F49 | In a feudal clan the head's word is treated as absolute and most clan members will follow a will once the head agrees. (The reader had written that the will "may not bind elders"; the line says most people will follow it, so that reading is corrected.) | inferred(protagonist) [0273 p100-p101] | V |
| F50 | Succession steps from the elder who keeps the clan rule booklet (古館 Furuyakata): 1. will confirmed (done), 2. public notice to all branch heads within 3 days, 3. a ceremony within 1 month with representatives of the great families watching. Maki asks for 3 days, then agrees to 5 with notice and ceremony combined and short notice by message, "emergency, keep it simple"; later she tells him to finish within 3 days. | stated(Furuyakata), stated(Maki) [0276 p53-p69][0278 p52] | V |
| F51 | Installed as 27th head on 3 November 2018 (the book's own date line). | shown [0278 p65][0275 p14] | V |
| F52 | Hei (炳) is a Zenin direct unit of sorcerers; only Zenin sorcerers at quasi-grade 1 or higher can join, and membership is a precondition for clan management. Removing a power-hungry elder from it is treated as equal to death. Maki also says Zenin blood is enough, so Megumi, not named Zenin, could be taken in. Megumi's technique is called enough for head. | stated(Maki), shown [0276 p87-p90][0277 p70-p75] | V |
| F53 | Kugutsu Ritsu (軀俱留隊) is the direct sorcerer force: anyone in the clan with sorcerer talent is forced in, leaving is dangerous unless one has special-grade strength, and the narrator says members die within months, a few years or at most 10 to 20 years in a spirit incident, whatever their strength. Maki's first cut thinned its headcount, dropping the unwilling and the weak (counts not stated). | shown(narration) [0278 p68-p69][0278 p89-p96] | V |
| F54 | Her second cut: she dismissed most menial servants and replaced them with a paid cleaning company on call (amount not stated). | shown [0278 p70-p71] | V |
| F55 | Leaving the clan: Maki could only leave because she could speak to the head in person; for ordinary members leaving is dangerous. | shown(narration) [0278 p81-p84] | V |
| F56 | The great-families framing is used as a duty: Maki argues that, as one of three great families, Zenin should act against the culprit of the current crisis. | stated(Maki) [0276 p92-p93] | R |
| F57 | Naoya (heir expected before the will) is knocked out in a clan fight; the successor test is a fight; the clan elder Ogi is ordered into retirement and an old house; Toji's brother resigned from Hei after bargaining for Ogi's return failed; Maki's sister was given a Hei seat. | shown [0275 p2-p92][0276 p83-p84][0277 p41-p57][0277 p89-p110][0278 p26-p29] | R |

Corrections of reader output (kept visible): W6 row R17 labels Naoya as "Naobito (直哉)"; the person is 直哉 Naoya, whose fight is a different character from the late head 直毘人 Naobito. W5 row Z4 states that three people are acting as head: the line [0242 p16] is the protagonist's sarcastic complaint that people like Naoya, Ogi and Megumi are "heads" now; it is not a list of office holders (the reader's contradiction 3 is withdrawn). The W6 reader's contradiction 1 (will valid only after Yaga returns versus treated as in force) is kept as C15.

### 14.3 B5: two currencies, wage, borrowing caps and the promotion routes

Window W7 shows the **wage is paid in contribution points, not happiness coins**, contradicting part 1 F31 and the kit row. It comes with limits; amounts for the trainee ladder remain open.

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F58 | Happiness coin (幸福幣) is the everyday market currency; officials stabilize prices by ad hoc decisions (rainy-season electricity fee waived, nutrition paste 1 coin cheaper in harvest season); residents save for winter and spring shortages; it keeps some purchasing power in other cities. | stated(narration) [0016 p4-p6] | V |
| F59 | Contribution points (貢獻點) buy only strategic resources and controlled goods, cannot be traded freely, and individuals get them only through fixed posts (an inspector catching a disguised infected entrant, the Works Office for land-clearing efficiency) or real service. | stated(narration) [0016 p8][0016 p21-p23] | V |
| F60 | Lending contribution points is allowed, with a per-person limit per period: ordinary residents 10 points per half year; a trainee prosecutor gets ten times that, 100. The bypass shown is to have a friend buy a 20-point pistol and "give" it; a staff warning says surveillance exists, minor edge-cases are overlooked, but a report brings fines large enough to ruin a person. | stated(narration) [0016 p28-p32] | V |
| F61 | Wage line shown in the protagonist's account: "normal wage" credited as 24 contribution points at 07:00 on 26 June of year 35 of the new era, with a note on a verification rating; the balance before and after the credit is shown as 43 and the later balance as 143 after a 100-point transfer from a Works Office person; the wage period is not stated. | shown [0016 p38-p39][0016 p42-p44] | V |
| F62 | Trainee prosecutor is the protagonist's current post and it is paid in these points. (The part 1 window had called the posts "trainee" in the inspector ladder; this window names a different office, so the two ladders are not merged, C12.) | shown [0016 p19][0016 p30] | V |
| F63 | After a promotion in the middle ranks the collector gets exactly one route choice per rank-up; skipping it forfeits it (not saved). | stated(system panel) [0409 p109-p110] | V |
| F64 | Six options appear: 鋒探 (hidden-route advance on the 銳探 route, brings new search options), 御聯 (a gentler trade-and-aid route that brings a new collector function), 衡御 and 破勢 (only a one-line summary: a fusion function and a new panel function), 毀滅 (destruction route that changes the encyclopedia function) and 鎖定 (locked). The protagonist picks 御聯. | shown [0409 p194-p199][0409 p234] | V |
| F65 | The protagonist is a senior collector (資深收集員) at this point; his 銳探 route's extraction function runs at full charge only. | shown [0409 p240][0409 p112-p116] | R |
| F66 | Charge-cap economics: 2 charge cycles raise the cap by 1 percent permanently; 1 unit of cap needs 200 units of energy; a hydro plant's 7,000 units a day raises the cap by only 35 units, 1,050 units a month; current cap 800. Unlocking new functions needs 1,000,000 units banked. | shown [0409 p68][0409 p82-p83][0409 p100][0409 p16] | V |
| F67 | 御聯 information bestowal costs per skill level: 625, 1,250, 6,250 and 12,500 percent charge for levels 1 to 4, level 5 locked; unlock needs about 3,000,000 units and more than 200 high-value cooperation targets (he has 12). Search rates after the route: 100 percent for levels 1 to 3, 50 for 4, 25 for 5; level 5 search costs 250 percent. | shown [0409 p118][0409 p147-p148][0409 p245-p246] | V |
| F68 | A promotion side-quest counts direct cooperation relationships with native creatures; 10,000 needed, 10,271 done. | shown [0409 p5-p6] | V |

### 14.4 B4: Church ladder, Deep Sea Institute, settlements and gold

Honest absence (WPR23): a tax rate, a noble tax schedule and Church tithes are **not in 0184, 0204 or 0206**; the census over 206 members finds 稅 in the early arc (0015-0033). In W8, 0031 and 0048 give the settlement tax as an administrative flow and a price, not a rate.

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F69 | Church ladder as shown: pope; a "great cardinal" second in power who stands in for the pope and wears three gold lines on the cardinal crimson; cardinals; the pope is chosen from ordinary cardinals only, and the great cardinal does not take part. The stated reason is a deputy-president-like office must not seize the post. | shown(narration) [0184 p91-p97] | V |
| F70 | In a crisis the great cardinal used his own authority to open the machine's direct link to the sacred tree; the pope objected and had lost his only recorder; this tests whether the pope or the deputy controls the link. | shown [0184 p4][0184 p76-p84][0184 p101-p108] | V for p4, p76 |
| F71 | The Deep Sea Institute watch crew on the brain-to-machine link: about 100 watchers, an order to double the headcount, machine rage burning brains, a cable pulled by the head. | shown [0184 p57-p75] | R |
| F72 | A cardinal wears plain poverty robes as a display, rebuilt the sanctum arch with his office on it, and is flattered toward the papacy; a mansion in the city is priced as one sip of his wine. | shown [0204 p10-p16][0204 p28-p32] | V for p16 |
| F73 | Devoted women: a staff class under three vows of obedience, chastity and silence, white cord at the waist, who may speak in public only when addressed, and whose practical duty the text names as sacred prostitution. | shown(narration) [0204 p53-p56] | V |
| F74 | Rose Nuns are one of three major orders, a faith body separate from the Church, so an attack on a governor-level target would still be investigated by the Church. | stated(character) [0051 p52-p54][0051 p72] | V for p52-p54 |
| F75 | Nobles' affairs officer for the region (a lord with purity 29.3, under the 30 mark, holding the title by favour) passes every settlement decision, each month's tax and the issue and upkeep of divine machines. A tax collector reports to him by letter. Ranks named: duke, viscount, baron, lord; purity 30 is the mark he did not reach. | shown [0031 p4-p8][0031 p12][0048 p3][0051 p64] | V for 0031 and 0048 p3 |
| F76 | The divine machine is used as a judge: it can rule on coin weight and counterfeits even against a noble house; it rules facts, not motives. | shown [0048 p23-p36] | V for p23-p25, p36 |
| F77 | Compensation ledger: the paying house brings 817,200 gold pounds (stated), of which 690,000 are royal gold scrolls exchanged 1:1 for gold pounds and 137,200 are physical coins; 301 coins are under weight and 250 are counterfeits (face 2,500, real value under 300). The shortfall is covered by paying a third-class settlement's future taxes, taken at 200-300 years of that settlement's tax. The sum 690,000 plus 137,200 is 827,200, not 817,200 (C16). | stated(character), shown [0048 p13][0048 p23-p25][0048 p36][0048 p50][0048 p52-p54][0048 p69-p71][0051 p79] | V |
| F78 | The Winter Palace stone can be moved safely only 3 months of a year; the palace is closed to uninvited visitors. | shown [0184 p136-p138] | V for p136 |
| F79 | Gallery weight (C7): the gallery is the largest body; members and seat-holders have more votes each than a gallery person, and cannot outvote the gallery even together; per-person gallery weight is inferred to be 1. | stated(narration), inferred(coordinator) [0202 p72-p74] | V |

### 14.5 Engine facts, additions (WPR5)

| Code | Default | Dial | In-world reason and cost | Exception the text shows |
|---|---|---|---|---|
| EF12 | A challenge is a contract card: allowed powers, lives, win and fail, with a warning label. | Lives, allowed powers, rewind, difficulty label. | Hard challenges strip rewind (F43). | The same host may abort before death and pick other content (F45). |
| EF13 | Same-world repeats get harder after the third. | Threshold (3), size of rise (not stated). | System rule (F44). | None shown. |
| EF14 | A head is installed by will, then notice, then ceremony; time can be compressed in an emergency. | Notice days (3), ceremony days (30 default, 3-5 asked), witnesses (great families). | Elders' obedience needs a will that the head grants, not force (F48-F50). | The protagonist asks for 3 and gets 5, then orders 3 (C15). |
| EF15 | A clan unit has an entry grade; membership gates management. | Grade (quasi-grade 1), who qualifies by blood. | Hei gates the power class (F52). | A relative by blood who is not named Zenin may be taken in. |
| EF16 | Forced service in the clan unit has a life expectancy cost; leaving needs the head's consent or special-grade power. | Retention rule, headcount. | Narrator: death in a spirit incident within months to 20 years (F53). | Special-grade strength (F53). |
| EF17 | Two currencies split use: a market coin and a strategic point that is not freely tradable but can be lent up to a cap. | Cap per period, post multiplier (10x). | Staff warning and fines police the gift loophole (F60). | A friend can buy and gift (F60). |
| EF18 | Promotion gives exactly one route choice that expires if skipped. | Number of choices, route list, hidden routes. | Panel rule (F63). | Hidden routes need a prior route (F64). |
| EF19 | Capacity upgrades cost energy that grows with the cap, so infrastructure, not rank, limits growth. | Energy per cap unit (200), cycles per percent (2). | F66. | None shown. |
| EF20 | A compensation debt can be paid by assigning another party's future taxes. | Years of tax, who pays. | F77. | None shown. |
| EF21 | Offices that cannot be seized are made unable to hold the top job. | Which deputy post. | F69. | None shown. |

### 14.6 Contradictions and divergences kept (WPR20)

| Code | Side A | Side B | Treatment |
|---|---|---|---|
| C11 | Part 1 F31 and the kit row: B5 trainee wage in happiness coins | [0016 p42] normal wage credited as 24 contribution points; [0016 p6] happiness coin is the market currency | Both stay. The two windows may mean different offices (inspector trainee vs trainee prosecutor) or different payments; the wage period is open |
| C12 | Part 1 F30: inspectors' children are trainees in the inspector ladder | [0016 p19][0016 p30]: the protagonist is a trainee prosecutor | Not reconciled; titles may be translation or office differences |
| C13 | Part 1 F31: skimming pays several times the wage | The only wage figure now is 24 points per credit with unknown period | Cannot compare yet |
| C14 | "No penalty" for a challenge [0237 p64] | A death in the hard challenge fails it and removes rewind [0237 p87]; abort applies when unable to pass [0237 p67-p68] | Likely different questions (cost of choosing vs the contract); no rule found tying them |
| C15 | Will valid across the sorcerer world only when the backup holder returns [0274 p30-p31] | The will is treated as binding in clan proceedings already [0275 p14][0276 p54] | Clan and wider society treated separately: clan recognition happens first |
| C16 | Total compensation stated as 817,200 gold pounds [0048 p13] | Itemized 690,000 scrolls plus 137,200 physical coins = 827,200 [0048 p23] | Source disagreement (possible author slip or translation); both numbers kept, no resolution |
| C17 | Reader: the head of purity 29.3 is below the "30" mark yet holds a lord title [0031 p4-p6] | Part 1 F21: above 20 percent is a noble | Not a conflict in the text: 30 is a different mark; the lord title is explained as favour. The mark's meaning is open |
| C18 | Part 1 F31: B5 has one ladder of rank | [0409 p240] a collector rank (senior collector) with route choices per rank-up | Different ladders (collector ranks vs checkpoint staff) in different eras of the book |

### 14.7 Spot-checks by the coordinator (WPR18-19)

I opened with `scripts/para.py` each locator in the NUM-bearing rows of F43-F44, F47-F53, F58-F61, F63-F68, F69, F73-F77, F78. Confirmed in the source: B3 third-challenge notice (0237 p47, p77), contract card (p83-p87), 26th/27th head and date (0273 p77-p79; 0274 p129-p133; 0275 p14; 0278 p65), 3/1-month/5/3-day steps (0276 p53-p69; 0278 p52), Hei grade and Megumi (0276 p87-p90; 0277 p70-p75), Kugutsu forced service and 10-20 years (0278 p89-p96), cleaning company (0278 p70-p71); B5 10-point and 100-point caps (0016 p29-p30), 24 credit and 143 balance (p39, p42), cooperation 10,271/10,000 (0409 p6), route list (p194-p199), the choice rule (p109-p110), cap ratios (p68, p82-p83, p100), 御聯 costs (p118, p147-p148, p245-p246); B4 three gold lines (0184 p91-p97), 29.3/30 (0031 p4-p8), 817,200 and the 690,000/137,200 split (0048 p13, p23), 250 counterfeits (p25, p36, p50), the tax assignment (p52-p54, p69-p71, 0051 p79), three orders (0051 p52), vows (0204 p53-p56), the gallery clause (0202 p72-p74).
**Not checked by me, so unverified (R):** F46; F56; F57 (names and chain of events); F65's rank claim beyond p240; F71 headcounts; the W5/W6 hub-level claims about difficulty tags beyond 0237 p77-p87; every row derived from 0238, 0240 chapters (ability details such as "no cursed energy means domain sure-hit fails" at [0240 p33-p39], which I did not open).
Reader errors found: W5 Z4 and contradiction 3 (misread sarcasm as an office list); W5 "will may not bind elders" (reverse of the line); W6 R17 name swap (Naobito for Naoya); W7 R5/R6 are right; W8 "Lord Homan" and "Buckley" are the lord and his tax collector (the tax collector's full name 特魯曼·巴克利 appears at 0026 p29); nothing else found wrong.

### 14.8 More-to-consider (WPR24) and next passes (WPR25)

**ACT NOW (done in this file):** C7 resolved to an inference; B5 wage contradiction C11 logged; B4 absence of tax rates recorded in section 14.4; floor card updated.

**ACCOUNT FOR NOW:**

1. Do not build B5 wage as happiness coins; the only wage figure is points.
2. B3 clan-reform steps and numbers are one altered timeline; do not set them as JJK canon.
3. B4 has no tax rate: use the 200-300 years-of-tax debt device or a proposed rate with a label.
4. Keep C16 (827,200 vs 817,200) as a source discrepancy.

**LATER/DELEGATE:**

| Item | Level | Effort | Done check |
|---|---|---|---|
| B3 hub remainder 0239, 0241, 0243-0272, and 0279+ | haiku readers, sonnet judge | M (3 readers) | gaps marked read, new F rows with V |
| B5 wage period and trainee ladder, members 0100-0110, 0017-0023, 0270 | haiku readers | M (3 readers) | wage period and steps stated with V |
| B4 0206, 0022, 0026, 0048 p72-92 | haiku readers | S (2 readers) | tax arc shown or declared absent |
| B1 0033-0036, B2 0380-0384 (unread) | haiku readers | S (2 readers) | fee/price rows with V |
| Data row: weighted vote with tie-break; contract card; two-currency loan cap | sonnet | S each | one stepped example each |

**Separate short suggestions:** an "expiring choice" token for promotion routes; a "future taxes as payment" debt field; a "forced service life cost" field.

**Next-pass ranking:** 1. B5 wage and ladder (source in hand, 3 readers); 2. B3 hub remainder (3 readers); 3. B1 Sanctuary terms and B2 sect prices (2 readers). B4 Church ladder is now adequate for a floor card.

### 14.9 Review state

Highest state reached: **source-spot-checked** for rows marked V. Not reached: rules-reconciled with the engine, built, browser-verified, director-accepted. Limits: haiku paraphrase of Chinese; the editions are a fan-site compilation; numbers apply to their scene (WPR4).

## 15. Independent review and W2 addendum (2026-10-23, successor world-consolidation coordinator (Sonnet 5.5, a different reader than the pass author))

Review state: **source-reviewed** for rows listed; not rules-reconciled, built or accepted. The "LOCAL_LIBRARY.md not found at depth 2" note in section 1 was a repo-depth search; the file exists at `docs/research/novels/LOCAL_LIBRARY.md` (gitignored), so treat that "not found" as a missed route (WPR23).
Reopened by the second reader (all confirmed): B1 0018 p12-14, p41-42, p50; B1 0070 p42-43; B5 0029 p15-16, p63; B5 0028 p56; B5 0057 p11-12; B5 0004 p49-50; B5 0010 p87; B2 0024 p26, p29; B2 0377 p47; B4 0202 p7-8, p10-11, p73.
W2 (two Haiku readers), results in `passes-2026-10-23/w2/RETURNS_T1_T2.md`:
- B1 Sanctuary (聖所, called Sanctum in the reader's table): a pre-brief census found zero 聖所 hits in members 0033-0036, so the window was swapped to 0016, 0023, 0108. Terms: dark-web access, a referral code for a first visit, visitors cannot read threads, one offline gathering makes a full member, no fee or dues shown, extra invite slots need owner review, each account gets limited codes (0016 p39, p50, p61; 0023 p59; 0108 p104-105). That closes "Sanctuary membership terms" as: no fee found in these members.
- B2 sect terms: a recruit's field pays 70 percent of the autumn harvest to the sect (0377 p47); third-generation disciples hand part of earnings as tuition, share unstated (0378 p33); tax is due to a rival sect each month, amount unstated (0378 p40); after unification only the court may levy tax, with severe penalties (0520 p43, p58). No silver price found; the earlier "members 0380-0384" window was dropped because a 220-member term census found almost no price terms there.
Still open: B1 0033-0036 content, B2 0380-0384, B5 and B4 gaps in section 9.

## 16. W3 rules and runtime reconciliation (2026-10-24, world-readiness coordinator, Sonnet 5.5)

State reached: **rules-reconciled on the cited codes** (WPR21); drafted and source-reviewed rows keep their earlier states; not built, browser-verified or accepted. Proposals stay proposals (AD32). Packet: [FIRST_SLICE_PACKET_2026-10-23](../gm/dispatch/claude-coordinator-continuation-2026-10-23/FIRST_SLICE_PACKET_2026-10-23.md). Ranked dispositions: [GAP_AUDIT readiness round](../gm/dispatch/claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md).

**Disposition: NEEDS MECHANISM (rank 5), per book.** Codes: AD1, AD5, AD6, AD27, AD38, WA3, WA6, WA8, WA12, ECR (official versus grey price, rake), PIR for stations. No conflict with standing direction; the compilation is an unauthenticated fan-site edition, so every price is edition-labelled (WA10).
Per-book best-fit and missing class (smallest extraction): B5 checkpoint = a cooperation meter plus an electricity-priced action (venue with an access right and stock, implementation map C7, plus rake C12); B2 = yearly trait draw over checkpoint/rewind and a tithe row (C14); B3 = term contract with exit (C3, proposal); B1 = identity anchor (C18); B4 = status bundle with credential kinds (C2, C9). Runtime today: none for any TTKS book (docs only, kit cards).
Ranked inside TTKS: B5, B2, B3, B1, B4. Source gaps (exact, from section 9 plus part 2): B5 members 0100-0110 and 0017-0023 (wage period, ladder), 0270 and route texts; B1 0033-0036 content (swapped window found 0 Sanctuary hits there), 0038-0039, 0081; B2 0380-0384 (a census found almost no price terms), 0020 p80+, 0644; B4 0206, 0022, 0026, 0048 p72-92; B3 0239, 0241, 0243-0272, 0279+. Gold figure conflict C16 (817,200 versus 827,200) stays open.
