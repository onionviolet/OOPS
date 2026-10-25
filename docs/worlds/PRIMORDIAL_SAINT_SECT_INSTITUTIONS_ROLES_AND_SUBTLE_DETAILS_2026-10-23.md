# Primordial Saint Sect: institutions, roles, talents, subtle details and floor card (2026-10-23)

Research and proposals, not accepted decisions and not implemented. Pass: WPR9-WPR17 (places, roles, institutions and law, money and information, time, power subtleties, starts, failure, surfaces) plus a WA6 floor card (K2, K3, K6, K8, K13), with extra weight on talents. Mode: reuse-and-check plus bounded read (WPR1). Owner file: this one, created by instruction (WPR3). It is not yet linked from any brief, card or index because the task said to touch nothing else (section 15). Review state reached: drafted, with 27 claim groups source-spot-checked by the coordinator (WPR21). Nothing here is built, browser-verified or director-accepted.

Spoiler tags: [S] marks late-story twists and anything past roughly Ch 300 that is not needed for the early sect. The sealed-secret rule (WPR8) is not triggered: the book has no repo pack or sealed truth, and the [S] items are public book plot, not player-facing secrets.

Locator scheme: `cNNNN pN` means chapter number and paragraph in my extraction of `sources/book.txt` (headings deduplicated, translator noise lines dropped). It is not the audits' scheme (they cite "Ch N" only), so audit claims below cite chapter only.

## 1. Source, edition, tier and budget

**What the repo holds (tier).** Tier: research only. No kit card, no world pack, no WORLD_BRIEF, no `src/` code names the book. Held: the gitignored store `docs/research/novels/primordial-saint-sect-2026-10-10/` (SCOUT.md 2026-10-10, AUDIT_1-3.md covering about 120 chapters by keyword-guided ranges, `sources/book.txt`); tracked mentions in `docs/CHEAT_LIBRARY.md` (the book is the named source of the "Death-menu regression", "Harvest and absorb" and "Pocket world" cards, lines 9, 43, 48, 172), `docs/LIFE_SIM_NORTH_STAR.md` (scout and audit findings, from line 4273), `docs/research/AUDIT_CANDIDATES_2026-10-10.md` and `docs/research/CHEAT_ENGINE_CAPABILITY_MATRIX_2026-10-14.md`. Generic cheat plumbing exists (`src/cheat_cards.js` lists a `death-menu` and an `anchor-list` panel id; `src/anchor_snapshots.js` snapshots world time; `src/heir_inheritance.js`, `src/life_experience.js`), none is Book-specific.

**Edition (WPR2, record).** `sources/book.txt`: gemini-3-flash-preview machine translation compiled for ranobes.top, unverified edition. 14,077,465 bytes, 120,725 lines, sha256 `3c9263d447569a7422b05847b57d572b942bf40ebe3cd59117b11149ce743437`. `wc -w` reads 2,380,191 words; after deduplicating chapters and dropping separator and placeholder lines my extraction holds 2,365,988 words in 1,437 distinct chapters. The file has 1,931 chapter heading lines (doubled), chapter numbers run 1 to 1441, and **Ch 295, 506, 751 and 1096 have no chapter**: their headings appear only inside the translator's leaked working notes at the end of the previous file chapter (c0294 p83 onward, c0505 p97, c0750 p91, c1095 p87). So those four chapters are missing from this edition, and Ch 294, 505, 750 and 1095 carry about 90 paragraphs of non-story text. SCOUT's "1,441 distinct chapters" is therefore 1,437 present. Cyrillic placeholder blocks and author notes sit between chapters (Ch 118, 128, 352, 408-409 per audits).

**Name and spelling drift (translation).** Book of a Hundred Lifetimes = Hundred Lives Book (c0415 p5). Primordial Saint Sect = Sacred Sect = Saint Sect. The purple talent is "A Bit of Skill" (c0032 p21), "Capable" (c0033 p63), "Has Two Moves" (c0052 p73) and "Have Two Tricks" in AUDIT_3. Skeleton item: Death-Substituting Yin Skeleton = Death-Substitute (Yin) Puppet = Substitute Shadow Puppet = scapegoat puppet. Merit mission: Accumulating = Gathering Merit. Mass Grave = Ten Thousand People Pit. Taiwei = Taixiao Mirror. Lifespan panel field reads Longevity, Age or Lifespan (c0001 p18, c0002 p51, c0004 p58). Qi Destiny = Qi Number in one place (c0417 p84). Innate (Primordial) True Qi = Innate Qi. Qi Refining and Spirit Refining name one realm.

**Reused first (WPR2).** SCOUT, AUDIT_1 (Ch 100-135, 154-166, 226-232), AUDIT_2 (Ch 348-352, 405-410, 573-580, 660-700), AUDIT_3 (Ch 981-993, 1138-1148, 1183-1190, 1230-1237, 1303-1306, 1334-1343, 1415-1441), the Mother of Learning, Reverend Insanity and TTKS reference passes (structure only), WORLD_PASS_RULES lessons.

**Windows and gaps they close (WPR2).** The audits read Ch 1-15 only by scout (Ch 6-15 line-cut at about 420 characters), and read nothing between Ch 16-99, 136-153, 167-225, 233-347, 353-404. Windows chosen by per-chapter counts of panel-form talent, Golden Nature, price and loan terms, then checked for the focus term (advisor check: the word "talent" mostly means aptitude in Ch 3, 21, 27, 38, so I recounted panel forms and read lines in Ch 240-259 before locking W4).

| Window | Chapters | Words (script, excl. locators) | Form | Named gap |
| --- | --- | --- | --- | --- |
| W1 (pilot) | Ch 1-7 | 11,182 | consecutive | Entry, intake, scouting and pricing of people, halls, ranks, loans, panel, first deaths (scout's Ch 6-7 were truncated) |
| W2 | Ch 8, 9, 11, 12, 15, 16, 17 | 11,698 | excerpts: whole non-adjacent chapters | Loan trap, Immortal Bloom seeds, Dao Book trap, merit gambling, rigged pool, skeleton price bubble and crash |
| W3 | Ch 34, 36, 43, 44, 48, 52, 58 | 11,921 | excerpts: whole non-adjacent chapters | Three Rivers Society, Skeleton Mountain market, Blood Garment Tower, Yinshan, human material, the 140 million realm first seen |
| W4 | Ch 247, 285, 288, 289, 293, 415, 417 | 11,511 | excerpts: whole non-adjacent chapters | Golden Nature ownership and death, settlement steps, restart menu with Celestial Spirit, rival-power claims, String Puppet and Dragon Dismemberment talents |

Total read by readers: 46,312 words (about 1.96% of 2.37M by my extraction). `wc` on the window files reads about 50,345 because locator tokens add words. Chapters read by Haiku: 28. Not read: 1,409 chapters; of these the audits read about 120 by keyword ranges, so the book is mostly unread.

**Budget (declared finite plan; WPR7, AU2-AU6).** Coordinator (Sonnet 5.5) plus 4 readers, each a fresh Agent call with model "haiku" set in the first brief, one at a time, each on one pre-extracted window of at most 12,000 words, locators in every paragraph, each brief carrying a capsule of located known claims so rows were labelled NEW, CORROBORATED or CONTRADICTED. W1 was the pilot; its row form was reused unchanged. **Invocations: 4 readers, 0 repairs, 1 advisor call, 0 reader reruns.** Reader returns are saved (condensed transcriptions, not raw copies, because pasting each return in full cost too much) in the gitignored `docs/research/novels/primordial-saint-sect-2026-10-10/passes-2026-10-23/` as `W1_return.md` to `W4_return.md`, with `extract.py`, `windows.py` and the four window files. One mid-write interruption truncated the first save of `W3_return.md`; I appended the missing tail from the reader's table.

**Source spot checks by the coordinator (WPR18-19).** Every price, fee, rate and number in the tables below was opened by me at its locator unless marked U.

| # | Claim | Locator | Result |
| --- | --- | --- | --- |
| 1 | Gifted recruit killed on the register and routed to three halls; mediocre ones kept for more value alive | c0001 p42-53 | Confirmed (shown, one recruit named; scale unstated) |
| 2 | Promotion grant 50 CP; cave rent 30 CP a month; 20% down-payment discount within ten years | c0003 p24-25 | Confirmed |
| 3 | Price floor 100 CP; missions mostly single digits; free kit "at least 400" (narrator estimate) | c0003 p32-34 | Confirmed |
| 4 | First-exchange zero-down loan 36% a year over ten years; formula costs 1,000 CP; 460 a year and 4,600 over ten years | c0006 p32-35 | Confirmed. The 460 and 4,600 follow from simple interest (1,000 plus 36% of 1,000 for ten years); the text gives only the totals, so the simple-interest reading is my inference |
| 5 | Credit never exceeds a disciple's "total value"; every new disciple is secretly priced; flesh, organs and soul cover debts | c0009 p65-66 | Confirmed (Zhao Xuhe speaking). Wording is "total value", not "salvage value" (C1) |
| 6 | Killing tolerated if undiscovered | c0009 p72; c0011 p4 | Confirmed (Zhao; Lu's inference) |
| 7 | Immortal Bloom bought at 150 CP a flower, no cap on number | c0008 p43-44 | Confirmed (Zhao relays a Peak Master mission) |
| 8 | 500 CP buys ten seeds, 1,500 CP a year, 180 CP interest, 460 loan payment | c0008 p63-67 | Confirmed as Lu's own estimates (inferred), not offered terms |
| 9 | Sword Pill kit: flat 100 CP per 50 g, divine water 500 per gourd, true fire 500 per wisp, total 2,000 CP; Killing Life Curse 300 CP; three dead men's tokens 400 CP | c0011 p10, p28-29, p46 | Confirmed |
| 10 | Merit pool: one pick a month, 10 CP, pool about one billion, nearly a century old, winner announced as Xiao Shiye with one billion | c0012 p8-12; c0011 p71-72 | Confirmed |
| 11 | Lu concludes the draw was rigged | c0015 p49-50 | Confirmed as Lu's conclusion; no evidence shown. Later Yinshan says Xiao died as a made child of destiny used as bait (W3 reader, c0048 p48-50, U) |
| 12 | Skeleton price 200, 300, 500, 1,000 (five times), 2,000 sale; peak 7,000, crash through 5,000, 3,000, 1,000, 200, floor 100 then 50 | c0016 p20, p24, p39, p58; c0017 p52-53, p62, p65 | Confirmed. The 3,000, 4,000, 5,000 climb and the 15-minute crash time are reader rows, U |
| 13 | Book restart menu has four slots; page counter 100, 99, 98, 97 | c0001 p32-34; c0002 p32, p37; c0005 p45; c0015 p8; c0289 p60-64 | Confirmed |
| 14 | No spiritual roots; anyone with will can start | c0004 p30 | Confirmed (Lu's reflection; "spiritual root" occurs 31 times in the book, so the later text may differ, U) |
| 15 | Carry-over loops from the previous life (Innate Qi persisted) | c0015 p24-25 | Confirmed |
| 16 | Zhao's pitch: Three Rivers 30-day interest-free credit; Lu assumes 36% | c0008 p54, p63 | Confirmed as two lines that disagree (C2) |
| 17 | Three Rivers loan carried 36% a year in earlier lives (Lu) | c0034 p43 | Confirmed |
| 18 | Skeleton Mountain zombie tide every 30 years; market core at about 30% of sect cave spirit density; four formation cores | c0036 p24, p26, p48 | Confirmed |
| 19 | External assignments go to those aiming for Foundation or to poor talent, old age or little wealth | c0036 p69 | Confirmed |
| 20 | Loot estimate at least 30,000 CP | c0043 p72 | Confirmed (Lu's estimate) |
| 21 | Every disciple is Human Material; past life and merit irrelevant | c0058 p19 | Confirmed (narration) |
| 22 | Realm of Law Refinement: 140 million beings, each worth more than a dozen outside mortals | c0058 p43 | Confirmed (Luo Wuya speaking) |
| 23 | Purple talent Has Two Moves, text | c0052 p73-74 | Confirmed |
| 24 | Golden Nature: True Lord's fused with soul; FE Consummation's external and stripped at reincarnation; five lifetimes at the peak of FE; 147 animal lifetimes (Chongguang's estimate) | c0247 p24, p28-29, p31 | Confirmed |
| 25 | Suo Huan's pre-arranged split: Blessed Land to Pure Land, Golden Nature to Dao Court, Fruit Position to Sacred Sect; death by Primordial Slaughter severs causality and makes them ownerless | c0285 p16-21; c0288 p2-8 | Confirmed |
| 26 | Settlement: trace merges in the palm, longer standby than usual, Gold talent String Puppet; earlier-settled Celestial Spirit then takes effect with a five-region birth menu; 91 pages | c0289 p8-9, p25-26, p39-41, p59 | Confirmed |
| 27 | Page counter at each life start (table in section 5) | c0001, c0002, c0005, c0015, c0028, c0032, c0074, c0100, c0179, c0289, c0456 | Confirmed by regex over the whole book |

Not opened by me (U): most W3 chapter rows outside the list above (Yinshan's bait plan, Witch Ghost history, Taiyi, Ouyang loot detail), W4 Dragon Dismemberment rows, the Netherworld rows, Bai Chi chain rows, and every audit claim unless re-listed above.

## 2. Places and institutions (WPR9, WPR11)

Labels: SHOWN, STATED (claim by NAME), INFERRED. V = opened by me, U = unverified. Money is contribution points (CP) in the early book (section 4).

| Place or institution | Who runs it | Cost and units | Access | Tiers, limits, hazards | Locator, label, check |
| --- | --- | --- | --- | --- | --- |
| Primordial Saint Sect (Kingdom of Chen intake) | Sect; the kingdom sends commoner "blood offerings" every three years in exchange for weather and a stable throne | Thousands per batch, no exact count | Registered disciples only, nobles never volunteer | Recruits vanish; official numbers barely grow | c0001 p6-10. STATED. V (p6-9 via reader, p42-53 opened) |
| Registration and life lamp | Black-robed taoist (later Liu Xin) at intake | Blood into a lamp | All recruits | Formations, plants and beasts recognise the token, not the person; losing it risks death | c0001 p39, p62. SHOWN/STATED. U |
| Intake sorting (the talent cull) | Black-robed taoist with the register | The person's body | Whole batch present | Gifted and robust recruit struck dead; blood and flesh to Pill Hall, bones and soul to Treasure Hall, organs to Beast Taming Hall; mediocre kept alive for labour value | c0001 p42-53. SHOWN. V |
| Four outer halls (Treasure Refinement, Pill Refinement, Beast Taming, Pleasure) | Halls | Trials lead to the inner gate | Registered disciples | Pleasure Hall trial is dual cultivation, read by Lu as mutual harvest, survivor promoted | c0001 p71-75; c0002 p18. STATED/INFERRED. U |
| Official (inner gate) disciple status | Sect through the disciple token | 50 CP grant; free kit of one tool, pill, beast, cauldron once each, Qi pill and messaging owl | Pass a hall trial; jump from registered to official stopped many for "countless years" (vague) | Cave rent 30 CP a month; cave purchase down payment, 20% off within ten years; 100 CP price floor for anything bought | c0003 p24-34; c0002 p86. STATED. V (p24-34) |
| Four inner peaks and Sacred Fire Cliff | Peak Masters; Sect Master on the Cliff | none stated | Official disciples belong to a peak | Four peaks mirror four halls; Pleasure Hall graduates fall under Mending Heaven Peak (Liu Xin's); Mending Heaven Peak nearly empty with vacant caves | c0003 p11-13; c0004 p19-21. STATED. U |
| Library Pavilion | Elder in his sixties in a rocking chair | Methods priced in CP; first exchange by loan only | Official disciples, one zero-down loan eligibility per new disciple | Only the first half of a manual is issued; the second half is bought (Innate Dao Book second half, Dragon-Tiger Ode) | c0005 p87-89; c0006 p1-13, p27-33; c0004 p11. SHOWN. V (p27-35) |
| Loan system | Sect through the Library system | 36% a year, ten years, zero down for the first exchange; cap equals disciple's total value | Official disciples | A loan delivers a technique plus a captive cauldron (a bound enemy-sect disciple arrives by crate in 3 days) to be harvested | c0006 p27-35, p44-64; c0009 p65-66. SHOWN/STATED. V |
| Dao Book (Innate Dao Book) | Liu Xin, Mending Heaven Peak, guides promoted disciples | First half free | New official disciples | First half is a trap; the second half turns the disciple into a harvest (Lu's reading of Liu Xin) | c0004 p3-11; c0005 p13-17, p33-36. INFERRED. U |
| Treasure Hall | Chen Hao, steward on a fixed post | Fixed posts pay steadily, few, need connections | Via connections | Best tools are the cultivators themselves: a cultivator explodes at claimed success and becomes a bone sword | c0003 p36-57. SHOWN. U |
| Cave dwellings in the Sea of Clouds | Sect formation spirit | Rent 30 CP a month | Inner disciples | Dead members' caves float on as bait for scavenging; revert to the sect on death except the four peaks | c0009 p41-52; AUDIT_1 findings 19 (Ch 155). STATED. U |
| Three Rivers Society | Three true-transmission senior brothers (eldest an FE True Person on a Sea of Clouds peak; Yinshan leads it ten years after FE); deacon Feixia | Standby credit 500 CP; 30 days interest free (Zhao) or 36% a year (Lu); member gets a stipend (no number), ability or technique, buying authority | Recruits promising late Qi Refining in about ten years; essence-blood contract | Offered as charity to ordinary disciples, but Lu saw its 36% rate in earlier lives | c0008 p51-54; c0034 p5-56. STATED/SHOWN. V (c0034 p13, p43, p50) |
| Merit mission (Accumulating Merit) | Sect officials; pool account | 10 CP a pick, one pick a month | Any disciple | Pool of about one billion CP goes to whoever draws the single rainbow fish; nearly a century unwon; winner a new disciple, probably a plant | c0012 p3-20; c0015 p49-50. STATED/INFERRED. V |
| Skeleton Mountain and its market | Sect; assigned "market" disciples under a Tower Master; Foundation-bound disciples take external assignments | Core pavilion at about 30% of sect cave spirit density; four formation cores | Foundation seekers and the poor, old or untalented | Zombie tide every 30 years; zombies are refining material | c0036 p17-69. STATED/SHOWN. V |
| Blood Garment Tower (Lu's) | Lu Yang as Tower Master | one formation core, a dozen early-to-mid Qi Refining disciples | Assigned by the sect | Sword formation with a hidden second formation | c0036 p49, p59-73. SHOWN. U |
| Secret Realm of Law Refinement (Yinshan) | Made by a Dao Lord; Luo Wuya shows it | 140 million beings, each worth more than a dozen outside mortals as materials | Sect true disciples and above | The sect's livestock realm; lent to Lu later (AUDIT_1, Ch 134) | c0058 p38-43. STATED. V |
| Witch Ghost Path realm | Dead path; its secret realm built to plant causality seeds for revival | Dozens of FE True Persons at its height, a Grade Four formation | Via Yinshan's bait plan | Gates sunk by one strike of a Jade Pivot Golden Core True Monarch | c0048 p42-60. STATED. U |
| Pure Land, Dao Court, Sword Pavilion (Jade Pivot), Dragon Palace | Rival powers of the four-way world | Golden Nature and Blessed Land are shared out by pre-agreement; see 6 | | Dao Court keeps Official Position with its own Golden Nature (AUDIT_2 Ch 580); Sword Pavilion takes background and potential into account (Lu's reading, c0289 p52-54) | c0285 p16-21; c0288 p2-8. STATED. V |

Searched where and not found (WPR23): a sect-wide "talent test" or aptitude exam for entrants (regex `talent test|appraisal` gives only the word "assess" noise; the only sorting seen is the taoist's register in c0001), spiritual-root grading in the opening (c0004 p30 denies it; 31 later lines use "spiritual root", not opened), any pawn or bank in the sect (129 hits for `bank|pawn` are mostly "banner" and similar, not opened). A Pleasure Hall rank structure or its elders: not found in W1.

## 3. Person-to-person roles (WPR10)

| Role | What it does and owes | Access and cost | Failure or hazard | Locator, label, check |
| --- | --- | --- | --- | --- |
| Intake taoist / register keeper (later Liu Xin) | Sorts recruits by value: kills the gifted, spares the mediocre; as Liu Xin, guides promoted disciples and runs the Dao Book | Holds the register | Flatters Lu as "a real talent" in Ch 3 then tries to harvest him; Lu's reading is that friendly seniors are predators | c0001 p42-53; c0003 p2-13, p68; c0005 p13-22. SHOWN. V (c0001) |
| Predatory senior (Liu Xin, Yu Suzhen, Zhao Xuhe, Qing Chen) | Offers kindness, caves, loans or dual cultivation | The junior's trust | Murder or harvest if undiscovered; Zhao also profits from his own advice | c0002 p3-31; c0005 p44; c0009 p41-72. SHOWN/STATED. V (c0009 p65-72) |
| Pleasure Hall partner | Dual cultivation as mutual harvest | Own body | The partner can kill; survivor promoted | c0001 p71-75; c0002 p3-31. SHOWN. U |
| Library elder | Hands out the loan and hints at a perk; says he is only a slightly older disciple | Spend CP | Part of the loan trap | c0006 p1, p51-58. SHOWN. U |
| Three Rivers deacon (Feixia) | Recruits by file, offers true-transmission ability and stipend | Contract and a drop of blood | Charity framing against a 36% rate; she cuts ties with Zhao when he asks for CP | c0034 p5-56; c0044 p59-68. SHOWN. V (c0034 p13, 43, 50) |
| Creditor-friend (Zhao Xuhe) | Credit broker and market adviser, later Lu's contact; low-to-middle Society member | Lu lends and borrows | Pitches marriage into the Peak Master's family; borrows to the hilt before the crash | c0008 p21-67; c0016-17; c0034 p35. SHOWN. V (c0008 p54, p63) |
| Market official / Tower Master | Runs a formation core and assigns disciples | Sect appointment | Staff are workhorses; no standout talent | c0036 p49-73. SHOWN. V (p61, p69) |
| True Person patron / Peak Master / Yinshan | Grants status, daoist names, protects or uses disciples | Service and results; lineage set up with Sect Master's permission | Uses a person as causality bait (Xiao Shiye, planned for Lu) | c0048 p36-64; AUDIT_1 findings 20-24. STATED. U |
| Banner-spirit companion | A killed person bound into the banner, serves as technician or fighter | Needs a cultivation-base carry-over to return after a restart (AUDIT_3 Ch 984, 1343) | Memory kept, self-perception altered (AUDIT_1 Ch 100); treated as tools by Lu | AUDIT_1-3. STATED. U (not reread) |
| Rival power agent (Ang Xiao, True Lords of the four powers) | Contest Golden Nature and Blessed Land; sell a sliver for a price | Pre-agreed shares | Ownerless remains cause a scramble | c0285 p16-21; c0288 p4-72. STATED/SHOWN. V |
| Celestial Spirit | A born-at-FE being favoured by heaven and earth; killing one brings retribution | Chosen via the talent (c0289 p39-41) | In the demon sect a Celestial Spirit risks being treated as Human Material; the Sword Pavilion should accept one (Lu's reading) | c0289 p52-54. STATED/INFERRED. V (p53) |

How the Book changes what each knows (WA12): every person resets at restart, only Lu and certain banner-bound spirits remember; late story this changes [S] (Dao Masters and the First Saint may sense it, AUDIT_3).

## 4. Money and information (WPR12)

Currency check (advisor item): `contribution point` appears in 96 lines, almost all in Ch 3-47 (only about 10 later, e.g. c0268, c0293, c0353, c0356, c0459, c0520), `spirit stone` in 7 lines (c0003, c0037, c0043, c1152, c1239), `spirit jade` zero, `salvage` 8 lines, none about sect credit. So **CP is an early-book unit and is stated to be meaningless to Foundation True Persons and True Lords** (c0293 p43, Lu speaking). Later wealth is Golden Nature, Blessed Lands, Fruit Positions, merit and incense (AUDIT_2).

| Item | Value or rule | Locator, label, check |
| --- | --- | --- |
| Promotion grant | 50 CP | c0003 p24. SHOWN. V |
| Cave rent | 30 CP a month; purchase needs a down payment, 20% off within ten years of promotion | c0003 p25. STATED. V |
| Cheapest method, tool, pill, beast or cauldron | At least 100 CP | c0003 p32. STATED. V |
| Sect missions | Mostly single digits of CP | c0003 p33. STATED. V |
| Free kit value | At least 400 CP (narrator estimate) | c0003 p34. INFERRED. V |
| First-exchange loan | Zero down, 36% a year, ten years | c0006 p27, p33. SHOWN. V |
| Divine Firmament Sword Control True Formula | 1,000 CP; a complete version guessed at 10,000 | c0006 p32; c0007 p17. SHOWN/INFERRED. V |
| Loan total | 460 CP a year, 4,600 over ten years (consistent with simple interest, my inference) | c0006 p35. STATED. V |
| Credit cap | Total value of the disciple; flesh, organs, soul cover debt; every new disciple secretly priced | c0009 p65-66. STATED (Zhao). V |
| Immortal Bloom | 150 CP per flower, unlimited number, bought by Mending Heaven Peak | c0008 p43-44. STATED. V |
| Seed loan | 500 CP buys ten seeds, 36% interest (180 CP a year), expected yield 1,500 CP a year; Lu's own numbers | c0008 p63-67. INFERRED. V |
| Three Rivers credit | 500 CP standby credit; 30 days interest free per Zhao | c0008 p51-54. STATED. V |
| Sword Pill ingredients | 100 CP per 50 g of solids, 500 per gourd of divine water, 500 per wisp of true fire, about 2,000 CP; Lu says out of reach (about twenty years of labour) | c0011 p28-32. STATED/INFERRED. V (p28-29), U (twenty years) |
| Killing Life Curse | 300 CP at the Library Pavilion | c0011 p46. SHOWN. V |
| Dead men's tokens | 400 CP together | c0011 p10. SHOWN. V |
| Merit mission fee | 10 CP a pick, one pick a month; pool about 1,000,000,000 CP | c0012 p8-12. STATED. V |
| Death-Substituting skeleton price | 200 start, 300, 500 (Zhao sells), 1,000, 2,000 (Lu sells ten, 20,000 gross), peak 7,000, crash to 200, then 100 and 50 | c0016 p20-58; c0017 p52-65. SHOWN. V (selected), U (3,000-5,000 steps) |
| Faction recruiting offers | Tens of thousands of CP | c0034 p23. STATED. V |
| Ouyang loot | At least 30,000 CP if sold to the sect | c0043 p72. INFERRED. V |

**Information.** The disciple token shows news and is the official channel: the Mass Grave announcement that popped the bubble was "official" (c0017 p50-51, V). Foreknowledge is the main wealth: Lu buys puppets at 200, knowing from earlier lives that the war news comes (c0016 p58-59, U on the foreknowledge link, bubble prices V). A pool winner may be staged (c0015 p49-50). Causality can be read by seniors; Book-returned items are clean (AUDIT_1-3).

## 5. Time and rhythm (WPR13)

- **Intake clock.** A batch arrives every 3 years (c0001 p6-9). Rent monthly, one merit pick monthly (c0003 p25, c0012 p8). Zombie tide every 30 years on Skeleton Mountain (c0036 p24). A loan runs 10 years (c0006 p33). Technique delivery takes 3 days (c0006 p44, U).
- **Realm lifespans (stated).** Foundation about 300 years (c0004 p49, U via reader); Qi Refining about 150 (AUDIT_1 Ch 129); Golden Core about 1,000 (AUDIT_2). At the peak of Foundation a person is limited to five lifetimes, and a Foundation Consummation Golden Nature is stripped each rebirth (c0247 p29, V).
- **Life table from the page counter (WPR13, advisor item).** The panel counter prints at the start of each life. Opened by regex over the whole book:

| Life (by counter, 101 minus pages) | Starts | Pages shown | Notes |
| --- | --- | --- | --- |
| 1 | Ch 1 | 100 | First death in Ch 2 by Yu Suzhen |
| 2 | Ch 2 | 99 | White Dual Cultivation Prodigy by forfeit (c0002 p47-48) |
| 3 | Ch 5 | 98 | Liu Xin refined Lu in life 2; Lu keeps Innate Qi (c0005 p44, p61-67) |
| 4 | Ch 15 | 97 | Restart loops from the previous life (c0015 p24-25) |
| 5 | Ch 28 | 96 | |
| 6 | Ch 32 | 95 | Purple talent by forfeit (c0032 p17-21) |
| 7 | Ch 74 | 94 | Chapter title says "The Sixth Life" (C4) |
| 8 | Ch 100 | 93 | AUDIT_1 matches (Ch 100-135) |
| 9 | Ch 179 | 92 | |
| 10 | Ch 289 | 91 | Title agrees: "The 10th Life" |
| 11 | Ch 456 | 90 | AUDIT_2 calls the life of Ch 573-668 the tenth (C4) |

Later counts from the audits: 89 after Ch 668, 87 at Ch 984, 86 at Ch 986, 85 at Ch 1140, 83 at Ch 1343 [S].
- **Timelines in shown play.** Lu sells puppets at 2,000 after a rise "over one month" (reader, U); the crash is fast (reader "about 15 minutes", U). Closed cultivation spans a decade in the early arc (c0043 p81, reader U).
- **Away-time.** Not stated in the windows (WPR13); the book has no idle clock.

## 6. Power and growth subtleties (WPR14), with the talent system

Three things share the word "talent". Keep them apart (advisor item).

**6A. Talent as a person's aptitude (sense A).** The sect sorts recruits by value to the sect, not by a root test: no spiritual roots (c0004 p30). Gifted and robust recruits are worth most as materials, so they die at intake; mediocre ones are worth more alive as labour (c0001 p53). Foundation seekers and the poor, old or untalented take external posts (c0036 p69). A later statement says every disciple is Human Material and past lives or merit do not matter (c0058 p19). The word "talent" is also flattery: Liu Xin calls Lu a "real talent" just before betraying him (c0003 p4, p68; c0005 p22). The sect farms people at scale in the Secret Realm of Law Refinement (140 million beings, c0058 p43). Qi Harvesting is a different thing, a Sword Pavilion second-grade method that strips essence from other realms (c0246 p7-22, opened lines only).

**6B. The Book's recorded talent (sense B).** A talent is a panel entry with a name, a colour tier and a short effect text. Shown tiers: White, Purple, Gold, and the "iridescent/colored" tier (AUDIT_2-3; the name "Colored Talent" appears in 66 lines). Sources, with their checks:

| Source | Rule | Locator, check |
| --- | --- | --- |
| Forfeit-all slot at a restart | Give up the treasure, cultivation, lifespan reward to awaken a random talent derived from the previous life's experiences | c0002 p37, p47-53; c0032 p17-23; c0289 p60-64. SHOWN. V |
| Settlement of a Golden Nature | Take a Golden Nature into the Book, the Book writes a life summary and issues a Gold talent; the restart standby lengthens | c0289 p8-26; c0415 p6-7. SHOWN. V |
| Talent Integration page | Up to nine talents in, highest grade sets output tier (AUDIT_2 Ch 575) | Only 4 lines in the book (c0575 x3, c0827 x1); not reread. U |
| Deferred settlement | A Golden Nature can be settled lives later (AUDIT_3 Ch 984-988) and the Ch 228 talent took effect on the Ch 289 restart | c0289 p39-41 V; AUDIT_3 U |

Observed output forms: White Dual Cultivation Prodigy (c0002 p48); Purple "Has Two Moves", handles an attack within the user's potential limit in two moves (c0052 p73-74); Gold String Puppet from Suo Huan's Golden Nature, controls only lower cultivation, victims notice nothing (c0289 p26; c0293 p66, p53-62 U); Gold Celestial Spirit from Chongguang, a restart-time origin switch with a five-region birth menu Jiangdong, Jiangxi, Jiangnan, Jiangbei, Overseas (c0289 p39-41); Gold Dragon Dismemberment from Bai Chi (c0415, c0417, reader rows U); earlier Luck Observing Lot Drawing and True Dragon Descendant (AUDIT_2). Tier colour is not power rank (AUDIT_3 Ch 988). So a talent in this book is a **record that rewrites a rule for the holder**, not a stat.

**6C. Golden Nature (the harvest item).** Defined by what the text says it does:
- A True Lord's Golden Nature is fused with the soul and protects against the womb trap (c0247 p28). A Foundation Consummation's is external and stripped at each reincarnation (c0247 p29).
- It is owned by rank and position: the Dao Court's Official Position holds its own (AUDIT_2 Ch 580); a backer such as the Dao Court or Pure Land has a pre-agreed share in a protege's Golden Nature and Blessed Land (c0285 p21; c0288 p4-6).
- On death it normally goes to the agreed owner. A death by Primordial Slaughter severs causality and leaves the pieces ownerless, so every True Lord scrambles (c0288 p2, p8, p14-17). Lu bought a sliver from Ang Xiao's share in one deal (c0288 p68-72, the price itself was not stated, "it doesn't matter how much") and stowed it before dying (c0288 p82), then died and the Book settled it (c0289 p8-9).
- Cost to Lu: the settlement used his death (the standby lengthened) and pages; the counter reads 91 after (c0289 p59).
- Hazards stated elsewhere: eating a True Lord's Golden Nature raw would assimilate the eater, the Book can digest it (AUDIT_2 Ch 350); a soul without Golden Nature cannot be processed (AUDIT_2 Ch 660).

**6D. How the sect scouts, ranks, prices, farms and harvests talents (the user's question).** Shown in the windows:
1. **Scouting.** The register is the whole scouting step: a taoist picks recruits out by sight and name (c0001 p42-53). No test, root reading or tournament in Ch 1-7 (searched).
2. **Ranking and pricing.** "Worth" is the sect's unit; each new disciple has a secret price (c0009 p65), and credit may not exceed it (c0009 p66). Rank within the sect is status plus CP (c0003). The price is not shown as a number anywhere in the opened text (not found).
3. **Farming.** Mediocre recruits are kept for labour and for dual-cultivation harvest by the seniors (c0001 p53; c0002; c0036 p68, p69). The Secret Realm of Law Refinement farms 140 million as materials (c0058 p43).
4. **Harvesting.** Gifted recruits at intake (c0001 p42-51). Dead disciples' caves are bait to lure scavengers (c0009 p46). A cultivator who fails to break through is forged into a weapon (c0003 p43-57). Loans end in the borrower's body if unpaid (c0009 p66).
5. **Was Lu Yang "a talent in the demon sect"?** Not as the sect judged him. At intake he was judged useless beyond looks and sent to the Pleasure Hall (c0001 p57-58, reader row). He tells people his own talent is mediocre (c0021 p5, c0026 p43, claims; U). Flattering seniors call him a talent as bait (c0003 p4). The strongest "talent" reading is the Book's: he accumulates White, Purple and Gold talents and by Ch 575 holds thirteen (AUDIT_2 finding 32), and a Celestial Spirit talent lets him be born outside the sect (c0289 p39-53). The user's memory is plausibly compressed from those.

**6E. Settling other people's lives for talents.** What the text shows across the windows and audits:
- The trigger is a Golden Nature strand, not a defeat. It can be a gift from a living person (Chongguang, AUDIT_1 Ch 226-228), taken from a dead one (Suo Huan, c0289; Tian Shi, AUDIT_2 Ch 408), or drunk raw from a vial (Bai Chi, c0415 p6-7).
- The output is one talent plus a life summary that ends at the extraction time (AUDIT_1 finding 53); it cannot give items or cultivation (AUDIT_1 finding 52).
- Harvest beats rerolling by death, in Lu's judgement: each Consummation cultivator holds one Golden Nature and the Book turns it into one Gold talent (AUDIT_2 findings 18-19).
- Timing and cost are flexible: settlement can wait lives (AUDIT_3 finding 11) and uses the standby period (c0289 p8-9).
- A harvested life can be worn as a disguise (AUDIT_2 finding 9); the restart wipes it (AUDIT_3).

**Other power subtleties.**
- Restart menu: four slots, one reward, pages fall by 1 per death (c0001 p32-34; c0015 p8; c0289 p59-64). Carry-over loops from the previous life, not a fixed start (c0015 p24-25). Cultivation does not carry unless chosen (c0289 p48).
- Karma-clean returns and traceable in-life gains: AUDIT_1 findings 6-10 (unchecked here).
- Debt: the restart erases the borrower's debt (Lu's plan, c0006 p38-41, inferred). Counter-measure: the sect caps credit at body value (c0009 p66).
- Dual cultivation is both a build (White talent) and a harvest (Ode text, c0006 p18-20).

## 7. Starts, failure, aftermath and surfaces (WPR15-17)

**Starts.** The registered-disciple start is a line-up at a plateau of Chen kingdom's blood offerings (c0001 p1-10). The panel starts: Longevity 18, no cultivation, talent, method, ability or treasure (c0001 p17-23). Other starts: a life lasts until death; later starts can use anchors (first at Foundation, AUDIT_1 Ch 131) or a Celestial Spirit birth menu (c0289 p39-41); the Sword Pavilion (Ch 289 title) and overseas are other entry places [S for later].
**Failure.** Death spends one page; debt is erased; the chosen reward is the only carry. Plain examples: killed by a Pleasure Hall partner (c0002 p29-31), refined into Innate Qi by Liu Xin (c0005 p44), self-detonated to escape a loose-end killing (c0015 p3-6, reader).
**Aftermath.** The world resets; the sect remembers nothing of the old life. The Book's own marks (karma wipe) are covered in AUDIT_1.
**Surfaces.** The disciple token is the surface (CP, news, rent, loans, missions); the Book panel lists name, longevity, cultivation, talents, methods, abilities, treasures, pages. An idle player misses nothing in the source (no away-time clock found).

## 8. Findings (F-list)

| ID | Finding | Label, check |
| --- | --- | --- |
| F1 | The sect's only observed scouting is the intake register: gifted recruits are killed for materials, mediocre ones kept for labour; no aptitude test or root reading is in Ch 1-7. | SHOWN. c0001 p42-53. V |
| F2 | Cultivation depends on talent but has no spiritual roots; anyone with will can start. | STATED. c0004 p30. V. Later use of "spiritual root" (31 lines) unchecked |
| F3 | Every disciple has a secret price and credit is capped at that total value, so debt can always be collected from the body. | STATED by Zhao. c0009 p65-66. V |
| F4 | Loan pricing: zero-down first loan, 36% a year, ten years; the quoted 460 a year fits simple interest; the Three Rivers Society charges the same rate despite its charity framing. | c0006 p33-35; c0034 p43. V |
| F5 | The skeleton bubble: 200 to a 7,000 peak, crash to 200 then 50 after an official sect announcement, with Lu making 20,000 gross on ten units; the pool winner is probably a plant. | c0016-17; c0015 p49-50. V/inferred |
| F6 | A talent in the Book is a panel record with a tier, a name and a rule-rewriting text, not a stat; sources are forfeit-all rolls, Golden Nature settlement and integration. | SHOWN. c0002, c0052, c0289. V |
| F7 | Golden Nature is a rank-bound ownable item; a pre-arranged split decides who gets it, and causality-severing death makes it ownerless and starts a scramble. | STATED. c0285 p21; c0288 p2-8, p14-17. V |
| F8 | Settlement lengthens the restart standby and its output is one Gold talent; an earlier-settled talent (Celestial Spirit) can take effect at a later restart as a birth-location menu. | SHOWN. c0289 p8-9, p39-41. V |
| F9 | CP is an early-game currency and is stated to be worthless to True Persons and True Lords. | STATED. c0293 p43. V; census of 96 lines |
| F10 | The sect treats everyone as Human Material regardless of past life or merit; a Celestial Spirit risks the same treatment inside the demon sect. | STATED. c0058 p19; c0289 p53. V |
| F11 | The page counter and the life count agree through Ch 289 (10th life, 91 pages); Ch 74's title and AUDIT_2's 10th life are one off against the counter. | Counter regex. V; C4 |
| F12 | Four chapters (295, 506, 751, 1096) are absent from this edition, replaced by leaked translator notes inside the preceding chapter. | c0294 p83-171; c0505 p97; c0750 p91; c1095 p87. V |
| F13 | Lu cannot trust friendly seniors: Liu Xin, Yu Suzhen, Zhao Xuhe and Qing Chen are all predatory in life 1-4. | SHOWN/STATED. c0002, c0005, c0009. V (c0009) |
| F14 | Dead members' caves are left as bait; failed cultivators are forged into weapons. | c0009 p46; c0003 p43-57. STATED/SHOWN. U |
| F15 | Hidden killing among disciples is tolerated. | STATED. c0009 p72; c0011 p4. V |
| F16 | The Society's core members: three senior brothers, one FE True Person; they recruit someone who reaches late Qi Refining in about ten years. | STATED. c0034 p13, p37-39. V (p13) |
| F17 | Skeleton Mountain: zombie tide every 30 years, sect disciples run the market under Tower Masters, core at 30% of sect cave density. | c0036 p24, p48, p61. V |
| F18 | Seekers of Foundation or the poor, old and untalented take external posts. | c0036 p69. V |

## 9. Engine facts (default, dial, reason; WPR5, WPR31)

| ID | Default | Dial | In-world reason and cost | Evidence |
| --- | --- | --- | --- | --- |
| EF1 | Everyone has a sect price; credit cannot exceed it | How the price is computed, who sees it | Lets the sect never lose money; cost is that talent rises to be killed | c0009 p66, V |
| EF2 | Talent (aptitude) is valued by usefulness; gifted are harvested, mediocre kept | Sect, world and rank | Worth in materials versus labour | c0001 p53, V |
| EF3 | First loan is zero down at 36% a year over ten years | Rate, length, collateral, borrower rank | Debt is a leash; restart erases it | c0006 p33, V |
| EF4 | Currency is contribution points for early-rank disciples | Currency by rank (CP then merit then incense) | Higher ranks have other value | c0293 p43, V; later currency U |
| EF5 | A restart menu offers four slots and spends a page | Slot set, page total, refunds | Finite lives; only one reward carries | c0001, c0289, V |
| EF6 | Restart loops from the previous life, not from a fixed start | Anchors and overwrite | Memory is the wealth | c0015 p24-25, V |
| EF7 | A talent is a named, tiered record with a rule-rewriting text | Source, tier, effect, uses per life | Distilled life experience | c0052, c0289, V |
| EF8 | A Golden Nature, once held by a rank, is settled into one Gold talent | Settlement time, owner, destroy or keep | Needs the dead or willing; the Book can digest what a body cannot | c0289, V; AUDIT_2 |
| EF9 | Ownership of rank-bound goods is pre-agreed, severed causality makes it ownerless | Patrons and shares | Patrons fund the protege and expect a return | c0285 p21; c0288 p8, V |
| EF10 | Official news arrives by token and moves prices | Latency, who can fake | A bubble bursts on an official line | c0017 p50-52, V |
| EF11 | Reputation as "Master of a tower" lifts Lu's authority | Title, post | A post is a fixed income | c0036 p63-65, c0043 p82, U |

## 10. Contradictions and tensions (WPR20)

| Id | Claim A | Claim B | Chosen reading, owner, status |
| --- | --- | --- | --- |
| C1 | SCOUT and AUDIT lines: loans cannot exceed "total salvage value" | c0009 p66: credit never exceeds a disciple's "total value" (Zhao). "Salvage value" appears in no sect context (zero hits for the phrase; 8 hits for "salvage" are shipwrecks and recovery) | Source wins; paraphrase drifted. Owner: SCOUT. Open for one-word correction |
| C2 | Zhao: new disciples get 30 days interest-free at the Society (c0008 p54) | Lu assumes 36% a year on the same 500 CP and the Society's 36% rate (c0008 p63; c0034 p43) | Both stand: 30 days free then 36%, a reading no line states. Open |
| C3 | W2 reader: the 460 per year has no shown derivation (W1) | 1,000 CP at 36% simple interest over ten years totals 4,600 (c0006 p35) | Both stand as consistent: my inference only. Low |
| C4 | Ch 74 title "The Sixth Life"; AUDIT_2 calls the life of Ch 573-668 the tenth | Page counter: 94 at Ch 74 equals the seventh life; 90 at Ch 456 equals the eleventh life, and Ch 289 (title tenth, 91) agrees with the counter | Counter formula (101 minus pages) fits Ch 289; Ch 74's title and AUDIT_2's numbering are one off. Possibly the file counts lives differently or a death was skipped in the title. Open |
| C5 | AUDIT_1 C11 and Ch 228 narration: Lu had not yet spent a restart on a talent roll | Talent rolls shown in Ch 2 (c0002 p47-48) and Ch 32 (c0032 p17-21) | Both stand; Ch 228's line is loose or means recently. Open |
| C6 | SCOUT: the Book consumes the Golden Nature of a dead person | Chongguang's was a living gift (AUDIT_1 C1); Suo Huan's, Tian Shi's and Hong Yun's were taken after death (c0289, AUDIT_2); Bai Chi's was drunk from a vial (c0415 p6-7) | All three entry forms exist. Resolved |
| C7 | SCOUT: "Excellent talents are killed immediately" as a general sect rule | Shown once, one named recruit, with the taoist's statement of policy (c0001 p42-53) | The policy is stated; the scale is unseen. Both stand |
| C8 | W3 reader W17: Zhao and Feixia are only old acquaintances after Zhao's master chose him as son-in-law (c0044 p57) | W3 reader W18: the engagement to a junior sister was canceled (c0036 p4); W2: Zhao's marriage pitch to the Peak Master's daughter (c0008 p21) | Timing unclear; locators not opened by me. U |
| C9 | Purple talent called "Have Two Tricks" in AUDIT_3 | "A Bit of Skill", "Capable", "Has Two Moves" in the text | Same item; translation drift (section 1) |

## 11. Zero-hit and not-found searches (WPR23)

Searched over my full extraction (all 1,437 chapters), case-insensitive. Zero hits: `spirit jade`, `root bone`, `salvage value` in any sect-credit sentence. Few hits: `spirit root` 1, `contribution point` 96 (nearly all Ch 3-47), `spirit stone` 7, `Talent Integration` 4 (c0575 x3, c0827), `trade in` 2, `recycle` 2. Not found in the windows read: a sect aptitude test for entrants, a numeric price of a disciple, a Pleasure Hall rank list, a bank. The whole-book `bank|pawn` result (129) is dominated by unrelated words and was not opened. Spelling check: the Talent Integration page is "Talent Integration Page" in 3 lines, so the zero-hit variants were repaired. The four missing chapters (295, 506, 751, 1096) are a not-found in the source itself (F12).

## 12. Gaps and unread windows (WPR7, WPR23)

Read by readers: 46,312 of 2,365,988 words (1.96%), consecutive for W1 and whole non-adjacent chapters for W2-W4, plus audits (about 120 chapters by keyword-guided ranges). Named gaps with windows:

| Gap | Window | Notes |
| --- | --- | --- |
| Rest of Ch 8-15 not in W2 | Ch 10, 13, 14 | Murder attempt chain, the "fishing" ambush follow-ups; scout read Ch 1-15 with truncation |
| Ch 18-33 | Ch 18-33 | Rigged-pool consequence, Xiao Shiye, Hong Yun's terror, divine light |
| Ch 35-60 remaining | Ch 35, 37-42, 45-47, 49-51, 53-57, 59-60 | Skeleton Mountain war, Yinshan, Taiyi |
| Ch 61-99 | Whole range | Reincarnating FE seniors, Witch Ghost, Pure Land, Dao Court first appearances |
| Ch 136-153, 167-225 | Whole range | Biyang, Chongguang's ascent |
| Ch 233-247, 248-284, 286-287, 290-292, 294-347 | Whole range | Qi Harvesting, Sword Pavilion entry, Dang Mo |
| Ch 353-404, 411-414, 416, 418-572 | Whole range | Tian Shi harvest context, Dragon Palace politics, Golden Core attempt |
| Ch 575 page and Ch 827 | Talent Integration | Only the audit read it |
| Ch 700-980 | Whole range | Great Calamity, Light Sea |
| Ch 1000-1137, 1149-1182 etc. | Whole range | Per scout and audits |
| Four missing chapters | Ch 295, 506, 751, 1096 | Not in this edition; need a second translation |

## 13. More-to-consider round (WPR24)

| Class | Item | Done check |
| --- | --- | --- |
| ACT NOW (done) | Record that the sect's observed talent handling is "kill gifted, keep mediocre", priced by worth, with no root test in the first chapters, and separate the three senses of talent (6A-6C). | Present here |
| ACT NOW (done) | Record the missing-chapter defect and the page-counter life table, and the salvage-value wording slip (F11, F12, C1). | Present here |
| ACCOUNT FOR NOW | Any Primordial pack must label CP prices as source (early book only) and later wealth as authored until a currency pass is done. | Pack rows cite status |
| ACCOUNT FOR NOW | Do not copy the audits' life numbering into a pack; use the counter table (C4). | Pack checks against the table |
| ACCOUNT FOR NOW | Keep the three talent senses separate in any design doc, and keep the user's "a talent in the demon sect" reading as a pointer to the Book's talents (6D5). | Note in the next doc that touches it |
| LATER/DELEGATE | Ch 61-99 institution pass: reincarnating FE seniors, Pure Land, Dao Court first contact. Level: haiku reader plus sonnet synthesis. Effort: about 12k words in two windows. Done check: a rival-power table with located claims. | Table plus spot checks |
| LATER/DELEGATE | Ch 18-33 and 35-60 consequence pass (Xiao Shiye reveal, Skeleton Mountain war, Yinshan). Haiku. 12k. Done check: located rows for the rigged pool and the war that Lu foresees. | Table |
| LATER/DELEGATE | Talent Integration and talent tier census (Ch 575, 827, panel forms everywhere). Haiku. 12k. Done check: a list of every named talent with tier and locator. | Census table |
| LATER/DELEGATE | Currency after Ch 47: merit, incense, fruit positions. Haiku. 12k. Done check: located price or "no price". | Table |
| LATER/DELEGATE | Second translation check for the four missing chapters. Sonnet or manual. Done check: a located summary of Ch 295 etc. | Summary |

Suggestions (separate, short): treat "worth to the sect" as a reusable pricing mechanism (a person value that sets credit, per AD38), and treat the Golden Nature owner/co-owner split as a reusable "pre-agreed share" role.

## 14. Ranked next list (WPR25)

1. Ch 61-99 rival powers and the Witch Ghost arc: about 12k words, closes the rival-power rows.
2. Ch 18-33 plus Ch 35-60 consequence passes: about 12k each, closes the foreknowledge payoff rows.
3. Talent census (Ch 575, 827 and all panel forms): about 12k.
4. Post-Ch-47 currency and price pass: about 12k.
5. Ch 233-347 Sword Pavilion and Dang Mo: about 12k, defer behind the first milestone.

## 15. Review state (WPR21) and follow-ups

Highest state reached: drafted, with 27 claim groups source-spot-checked by the coordinator (readers authored the rows, a different checker opened the locators). Not rules-reconciled in detail. Touched codes: WPR1-WPR32, AU2-AU6, WA3, WA4, WA6, WA8, WA12, WA14, AD38. Not built, not browser-verified, not director-accepted. No conflict with standing direction found: the floor card proposes slices, selects no world and opens no deferred gate.

Follow-ups, not done because the task said to touch nothing else (WPR3, WPR28):
- Create a world brief or kit card entry and link this file (no brief exists).
- Link this file from `docs/CHEAT_LIBRARY.md` (Death-menu regression and Harvest and absorb rows) and from `docs/LIFE_SIM_NORTH_STAR.md` near line 4273.
- Add the store folder `docs/research/novels/primordial-saint-sect-2026-10-10/passes-2026-10-23/` to the research index.
- Correct "total salvage value" to "total value" in SCOUT.md (C1) and note the missing chapters (F12) in SCOUT.md.
- Fold lessons into WORLD_PASS_RULES "Lessons carried in": (a) a keyword census of a common word ("talent") mixes senses; recount panel forms first; (b) a missing chapter can hide as translator noise in the previous file chapter, so test chapter numbering for gaps; (c) a page-counter regex gives a life table for free and exposes title and audit numbering slips; (d) a reader row that says "no derivation shown" may have a simple arithmetic derivation, so recompute; (e) a safety stop mid-save can truncate a saved return, so re-open saved files before relying on them.

## 16. Floor card (WA6)

Five records. Each lists default, dial, in-world reason and cost, locator, evidence label, current repo coverage and the smallest playable slice. Repo coverage was read from the grep of `docs/` and `src/` (section 1), not tested by play (WPR21: source edit only). Nothing here is canon beyond the labelled evidence, and WA8 applies to unknowns.

### K2 World laws (5 to 10 engine facts)

- **Default.** EF1 to EF8 above: everyone has a price and credit is capped by it (c0009 p66, V); aptitude is valued by usefulness (c0001 p53, V); loans are 36% a year over ten years (c0006 p33, V); currency is contribution points at low rank (c0003, c0293 p43, V); a restart menu has four slots and costs a page (c0001, c0289, V); restart loops from the previous life (c0015 p24-25, V); a talent is a tiered record (c0052, c0289, V); Golden Nature is rank-bound and settles into one Gold talent (c0289, V; AUDIT_2).
- **Dial.** Rate and term of credit, price formula, how many slots, page total, who owns a Golden Nature.
- **Reason and cost.** The sect wants materials and labour; debt is a leash; each restart costs a page and a life.
- **Source and label.** SHOWN/STATED, V for EF1 to EF7; EF8 V only in part.
- **Repo coverage.** None for these laws. `src/cheat_cards.js` names panel ids `death-menu` and `anchor-list` as slots a cheat card may use; there is no Primordial rule module.
- **Smallest playable slice.** Encode EF1, EF3 and EF5 as data rows over existing verbs: a priced-credit check that refuses a loan above a body price, a ten-year loan with 36% simple interest, and a four-slot death choice using the existing `death-menu` panel id and heir flow (`src/heir_inheritance.js`). Needs a lint so each law names a rule module (WA4). Proof by play is a separate step (WPR32).

### K3 Power core (one resource, growth, one learn path, 3 to 6 techniques)

- **Default.** Resource: the Book's page counter plus cultivation base. Growth: a realm ladder Qi Refining, Foundation, Golden Core, with a first manual half-free and the second half bought (c0004 p11; c0006 p12-13, V). Learn path: buy methods in CP through the Library Pavilion, usually by loan (c0006 p27-35, V). Techniques: Divine Firmament Sword Control True Formula at 1,000 CP (c0006 p32); Killing Life Curse at 300 CP (c0011 p46); Innate Dao Book first half (c0004 p3-4); Dragon-Tiger Ode (c0006 p12-20); a Sword Pill sword art (c0007 p45-48). The Book talent White Dual Cultivation Prodigy (c0002 p48).
- **Dial.** Which reward slot, talent roll odds, realm, loan size.
- **Reason and cost.** The sect sells the first half and keeps the second as a trap; a death costs a page.
- **Source and label.** SHOWN/STATED. V for the techniques above; U for effect numbers.
- **Repo coverage.** None specific to this book; `src/cheat_cards.js` is generic.
- **Smallest playable slice.** One resource (pages), one learn path (buy a first-half manual by 36% loan), three techniques (Innate Dao Book first half, Sword Control formula, Killing Life Curse as a controlled-death action that costs a page), plus the death menu choosing one carry. Needs a decision on how to show the second-half trap.

### K6 Cast (minimum named people with roles)

- **Default.** Lu Yang, transmigrant; Liu Xin, intake and Dao Book predator (c0003, c0005); Yu Suzhen, Pleasure Hall senior (c0001 p71; c0002); Zhao Xuhe, credit broker (c0008, c0009); Qing Chen, bait-cave seducer (c0009 p41-52); Feixia, Three Rivers deacon (c0034); Yinshan, Society head and True Person (c0048 p36); Luo Wuya, Second Senior Brother and Society member (c0048 p32-33); Xiao Shiye, merit pool winner and plant (c0011, c0015); the Library elder (c0006 p1). Later: Ang Xiao, Suo Huan, Chongguang, Tian Shi, Bai Chi [S].
- **Dial.** Who is predatory, how much each remembers, rank.
- **Reason and cost.** The sect rewards harvest; each friendly senior is a lure.
- **Source and label.** SHOWN/STATED, V for Liu Xin, Zhao, Feixia, Yinshan (partly), the Library elder.
- **Repo coverage.** None.
- **Smallest playable slice.** Six contacts with one verb each: Liu Xin (offers a Dao Book that costs a page later), Yu Suzhen (Pleasure Hall trial), Zhao (credit broker, can overlend), Qing Chen (cave bait), Feixia (Society offer), the Library elder (loan). Memory stays with the player only.

### K8 Daily life and economy (jobs, meals, prices, a day's rhythm)

- **Default.** CP income by missions at single digits (c0003 p33), posts (c0007 p67), selling items, bounties, merit pick of 10 CP a month, Immortal Bloom at 150 CP a flower (c0008 p43); rent 30 CP a month (c0003 p25); methods at 100 CP and up; Sword Pill kit 2,000 CP; day rhythm: monthly rent and merit pick, 3-year intake, 30-year zombie tide. No meals or daily routine found in the windows.
- **Dial.** Currency scale, rent, mission pay, season.
- **Reason and cost.** Costs outrun pay (Lu's budget in c0008 p63-68), so credit is needed and credit is a trap.
- **Source and label.** STATED/SHOWN, V for the prices above; meals and jobs-by-hour not found.
- **Repo coverage.** None.
- **Smallest playable slice.** A token panel with CP, a monthly rent, a mission list with single-digit pay, one monthly merit pick, and a Library with one zero-down loan; label every number source (V rows) or authored.

### K13 Signature verb loop

- **Default (source).** Live, hide, borrow against the next life, die on purpose, pick one carry, restart with memory: seen in the first 15 chapters (c0006 p38-41; c0015 p3-27; c0289 p60-64). Late Book mechanics (anchors, integration, interface control) are [S] or not reread.
- **Dial.** Slot set, anchors, page total, who remembers.
- **Reason and cost.** Pages are finite; each death costs a life.
- **Source and label.** SHOWN. V for the early loop.
- **Repo coverage.** Missing for the Book loop. The generic death-menu card is proposed in `docs/CHEAT_LIBRARY.md` (C2 heir pipeline) and listed in the engine capability matrix; no code runs it. `src/anchor_snapshots.js` is world-time snapshots, not Book anchors.
- **Smallest playable slice.** One life, one loan, one deliberate death, one four-slot menu, one carry. Reuse the heir flow and the `death-menu` panel id. Proposal only; it gives a playable loop without anchors or integration.

## 17. Independent review and W2 addendum (2026-10-23, successor world-consolidation coordinator (Sonnet 5.5, a different reader than the pass author))

The pass doc is complete through section 16 (drafted and fully written), so the handoff's "partial or unknown" is superseded. Review state: **source-reviewed** for the rows listed; not rules-reconciled, built or accepted.
Confirmed (about 35 locators opened in a fresh extraction of book.txt): c0003 p24-25, p32-34; c0006 p32-35; c0008 p43-44, p54, p63-68; c0009 p65-66, p72; c0011 p10, p28-29, p46; c0012 p8-12; c0015 p49-50; c0016 p20, p24, p39, p58; c0017 p52-53, p62, p65; c0058 p19, p43; c0036 p24, p26, p69; c0247 p24, p28-29, p31; c0289 p8-9, p59; c0004 p30.
Corrections: row 4 wording. c0006 p35 states both the 460 a year and the 4,600 over ten years (Lu's own reckoning); only the split into principal and interest is inference. Row 12: the 3,000, 4,000 and 5,000 climb is not text; c0017 p53 lists 5,000, 3,000, 1,000, 200 on the way down.
W2 (one Haiku reader): c0026-0028, c0033, c0046, c0065, about 10,800 words, results in the private store `docs/research/novels/primordial-saint-sect-2026-10-10/passes-2026-10-23/W2_P1_return.md`. New verified rows: Zhao owes 1,000 CP and promises principal and interest (c0026 p37); he sells the Coiling Dragon method for 1,500 CP (c0027 p1); in a later life Lu sells new-disciple goods, holds 20 puppets and exits at 3,000 for 60,000 CP (c0028 p25-30); Zhao offers a technique as collateral for 30,000 CP over three months and Lu proposes a seal of at least 80 years (c0046 p22-46); talents show only colour tiers (c0033 p63). Zero hits: entry fees, rank ladder, mission pay, loan rate. Still open: Ch 1-99 beyond the windows read (about 25 chapters of 99 now read) and Ch 100+.

## 18. W3 rules and runtime reconciliation (2026-10-24, world-readiness coordinator, Sonnet 5.5)

State reached: **rules-reconciled on the cited codes** (WPR21); drafted and source-reviewed rows keep their earlier states; not built, browser-verified or accepted. Proposals stay proposals (AD32). Packet: [FIRST_SLICE_PACKET_2026-10-23](../gm/dispatch/claude-coordinator-continuation-2026-10-23/FIRST_SLICE_PACKET_2026-10-23.md). Ranked dispositions: [GAP_AUDIT readiness round](../gm/dispatch/claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md).

**Disposition: READY (rank 1) for the packet thread**, NEEDS MECHANISM for the same-body restart loop. Codes: AD1, AD6, AD11, AD12, AD14, AD19, AD33 (cast kept to one clerk), AD38, WA1, WA3-WA6, WA8, WA11, WA19, ECR credit and dated terms, GTR1-GTR4, GTR9, AR12. No conflict found.
Runtime owners reused: `economy_standing.js` loans (rate per term via `owedNow`; limit from standing tier, so a body-value limit and a fixed rate need two additive optional fields), `progression_gates.js` for the refusal, `obligations_ledger.js` for the coin row, `carry_ledger.js` rebirth boundary. Not hosted: same-person restart with an anchor (implementation map C17 gap) and the death-menu picker (`cheat_cards.js` C0 contract only).
Correction found (keep both): the debt erasing on restart is a character's belief (c0006 p40) and the sect's answer is the price cap (c0009 p64-66); it is not a source rule, so the packet makes it a dial. Section 8's EF3 reason text "restart erases it" should be read that way.
W4 window (Haiku, c0075, c0076, c0080, c0088, c0089, c0090, 10,821 words, return in `passes-2026-10-23/W4_P2_return.md`): the Merit Pool is a prize draw staked with a year's contribution points, prize colours gold and purple with a seven-colored jackpot (c0089 p61-64, five locators reopened); "merit" elsewhere is a moral ledger and fuel (c0075 p21-22, c0080 p62-64). Not found: entry rule, fee, winner count, monthly schedule, debt, loan, tribute, rent, stipend. A Ch 66-99 census found 0 CP hits and 1 "contribution", so the rest of Ch 66-99 is combat and arc text with no price rows.
Exact unread remainder: Ch 66-74, 77-79, 81-87, 91-99 (not read), Ch 1-25, 29-32, 34-45, 47-64 as listed in section 12, Ch 100+; second-half manual price; game-year length for the rate conversion.

## 19. W5 packet-blocker closure (2026-10-24, source-gap coordinator, Sonnet 5.5)

State reached: source-spot-checked by the coordinator on every row below (locators opened in the full-book extraction, locator scheme `cNNNN pNN` as in the private store). Not rules-reconciled beyond the packet's codes, not built, browser-verified or accepted. Method (WPR23): a whole-book keyword census over 1,437 extracted chapters (2,365,988 words), then targeted opens of the dense hits in Ch 4-15, 22, 28, 34 and 89. No reader was needed; no new window was read in full. The earlier claim that the entry rule was "not in Ch 75, 76, 80, 88, 89, 90" was a window limit: the rule sits in Ch 12.

| Blocker | Result | Locator and label |
|---|---|---|
| Merit Pool entry rule | Found. A standing mission ("Accumulating Merit"): one pick per person per month, blind-pick a number, pay 10 CP, receive the Merit Fish matching it. The 10 CP is not taken by the sect but credited to the pool's account. Fish come in five colors (white, blue, purple, gold, rainbow); exactly one rainbow fish exists, and whoever draws it takes the whole account (about one billion CP after nearly a century without a winner). Eating a fish raises true qi quality and can break a bottleneck. | c0012 p3-11, STATED (narrator, rumor-level); the purple draw and the pick of a number shown in c0015 p34-45, SHOWN |
| Merit Pool tension (keep both) | "Once a month" (c0012 p8, STATED) against Xiao Shiye staking "all my contribution points from this year" (c0089 p61, SHOWN thought) and Lu's belief that the grand prize allows "one draw per year" and that he had used his chance (c0022 p7, STATED as his recollection). Candidate reading, INFERRED: a monthly pick, with a year's picks adding up to the year's stake. Not resolved by the text. | c0012 p8; c0089 p61; c0022 p7 |
| Merit Pool honesty | Lu concludes in life 2 that the lucky winner was a plant to drum up business ("It's rigged"). A character's conclusion, INFERRED; the later Xiao Shiye chapters (c0020 p69; c0025 p62; c0026 p15-16) give a different cause (a fate-lure by Hong Yun), so treat the odds as authored. | c0015 p49-50; c0025 p62 |
| Second-half manual price | Still not stated. Facts: the first half is issued free to an official disciple and the second half (Foundation Establishment secrets) must be bought with CP, no price (c0004 p11, STATED by Liu Xin); the Dragon-Tiger Ode arrives as the Spirit Refining chapter only (c0006 p12-13). The only number is Lu's guess that a complete Sword Control formula would cost "far more" than 1,000 CP, "ten thousand" likelier (c0007 p17, STATED as a character's conjecture). A Zhao Xuhe sale of the full two-volume Coiling Dragon method is "a pittance" at 1,500 CP (c0027 p1, STATED). Also note: the 1,000 CP Sword Control purchase itself arrived only after a dispatch notice of three days (c0006 p44-45) and is a partial version (c0007 p15-17). | c0004 p11; c0006 p12-13, p44-45; c0007 p15-17; c0027 p1 |
| Length of a game year | Day count not stated. Shown: a year is twelve monthly cycles; rent is 30 CP a month, and Lu's one-year budget subtracts 360 for rent (1,500 minus 360 equals 1,140). A lunar calendar appears (second day of the second lunar month) and twenty-four solar terms are named for another school. Default for the conversion: 12 monthly cycles; days per month authored (proposal 30, so 360). | c0008 p63-65, SHOWN arithmetic; c0067 p1; c0588 p44 |
| Loan arithmetic | Simple interest on the original principal, repaid as a flat yearly installment: 1,000 CP at 36 percent a year over ten years is 460 a year (100 principal plus 360 interest) and 4,600 in all (c0006 p35); a 500 CP standby loan owes 180 interest after one year (c0008 p63-67). The Three Rivers Society lends at the same 36 percent, with 30 interest-free days for new disciples (c0008 p54; c0034 p43). The sect's first-exchange loan is zero down, once per newly initiated official disciple (c0006 p27, p33). | SHOWN/STATED, opened |
| Does the sect recover a restarted borrower's debt | In the loop as shown, no recovery occurs: Lu self-detonates with an unpaid loan (c0015 p6), and the restart returns him to the intake stage (c0015 p9-15), where his first-exchange technique loan is again unused (c0015 p86, "I haven't used my technique loan yet"). The loop keeps his chosen reward from the prior life but the sect's books show a new intake. Whether the sect would chase a restart that is not an intake reset (a later Book mechanism) is not shown. Zhao's line (c0009 p66) that credit never exceeds a disciple's total value is a stated sect principle, not an observed recovery. | c0015 p6-15, p25, p86, SHOWN; c0009 p66, STATED |

**Corrections to earlier notes.** (1) The packet's "merit pick of 10 CP a month, locator not separately reopened" now has a locator (c0012 p8). (2) W4's "staking a year's CP" is a thought in c0089 p61 and does not fix the entry rule. (3) The packet's test idea "1,360 after one year" is a lump-sum reading; the source schedule is a flat 460 a year (100 principal plus 360 interest); assert the formula, not the narration. (4) The packet's "restart makes the debt moot" dial now has a SHOWN basis for the loop (intake reset), so `drops` is better supported than before; the reason text should say the restart returns to intake, not that the sect forgives.

**Still open.** The second-half price (authored), days per month (authored), Merit Pool odds and the monthly versus yearly limit. Ch 1-3, 16-21, 23-27, 29-33 and 35-65 were only touched by keyword; unread remainder otherwise as in section 18.
