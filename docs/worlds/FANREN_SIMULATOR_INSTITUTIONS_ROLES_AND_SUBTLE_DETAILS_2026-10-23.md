# Fanren simulator novel: institutions, roles, subtle details and floor card (2026-10-23)

Research and proposals, not accepted decisions and not implemented. Pass: WPR9-WPR17 (places, roles, institutions and law, money and information, time, power subtleties, starts, failure, surfaces) plus a WA6 floor card (K2, K3, K6, K8, K13). Mode: reuse-and-check plus bounded read (WPR1). Owner file: this one, created by instruction (WPR3). It is not yet linked from any brief, card or research index (follow-ups in section 15).

Slug note: the requested slug FANREN_SIMULATOR is kept. The real title is 《凡人：從極陰島開始的修仙模擬器》 ("Mortal: a cultivation simulator starting from Jiyin Island"), a fan novel set in the Fanren Xiuxian Zhuan (Mortal Cultivation) world, so the slug is a fair short form and no rename was needed.

Spoiler and scope tags: [S] marks the body-snatching reveal (ch20-22) and run content that depends on later canon events. Coverage is chapters 1-44 of 184 (about the first quarter by chapter count); everything later is unread and is never guessed. Labels: SHOWN (scene), STATED (narration or a named speaker), INFERRED, PROPOSED. WORLD column: REAL (outside the simulator's bracketed narration) or SIM (inside a run). A price or sect rule seen only inside a run is a simulated future, not necessarily the real economy.

## 1. Source, edition, tier and budget

**Edition.** Private copy in the gitignored store: `docs/research/novels/fanrencongjiyindao-moniqi/sources/ttks-browser-2026-10-10/ttks_FRJY_fanrencongjiyindaokaishidexiuxianmoniqi.json`. Receipt: ttks.tw mirror (index URL in `RECEIPT.json`), fetched 2026-10-10 through Weibao's Chrome, members 0001-0044 only, 96,784 characters by the receipt's count, sha256 d522bf1595ac71b3843f9a41a9b96a26d8b47e55ac22ecafe949b4ceec2c2a31, `partial: true`. Traditional-script mirror text with embedded site advertisements and some typos (a name or two vary, see section 10).

**Title, author, platform, size.** Title read from the text's own chapter headings and the receipt. Author 奶油黑咖, Qidian book 1047858716, finished at 184 chapters and about 39.14万 characters: these come from the receipt and the 2026-10-10 deep dive, which took them from a web reader, not from the held text, which carries no byline. So author, platform and full size are STATED by secondary sources and not verified here. The held portion is about 25% of chapters. ttks.tw, twkan and 69shuba all stop at or lack chapter 44 (receipt), so the later 140 chapters are not available locally. If a later pass needs them, the route is not on the mirrors tried.

**Premise (from the text).** 孫桓, 16, a 偽靈根 (pseudo-root) outer disciple on 極陰島 (a demonic sect island in 亂星海), finds a bound copper coin that runs a "cultivation simulator". Lines in 【】 are the simulator's narration. The story is a fan novel inside the Fanren Xiuxian Zhuan world, and the simulator treats that book's events as a fixed future (see EF10).

**Tier in the repo.** Research only. There is no kit card (the card set holds ttks-b1 to b5, which are different books), no world pack in `src/world_packs/` (only book_hp_pack.js and book_mol_pack.js), and no brief. The deep dive `docs/research/novels/fanrencongjiyindao-moniqi/DEEP_DIVE_2026-10-10.md` (private, F1-F10 simulator rules) and the reader notes `readers-2026-10-10/f1.md` (private, all 44 chapters at chapter-level locators) exist, and the book is cited in `docs/SIMULATORS_AND_CHEAT_IMPLEMENTATION.md` (FR column, around line 684), `docs/USER_VISION.md` (G1 line) and `docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md`. In code, `src/cheat_cards.js` only lists `simulator` and `simulator-foresight` as allowed panel ids in a data contract ("cards describe future behavior; granting one runs no hooks"); no simulator behavior exists. No hit in `src/` mentions this book.

**Reused first (WPR2).** The deep dive and f1.md already cover the simulator mechanic in detail (F1-F10, run table R1-R13, talent catalog, price table). This pass therefore spent its windows on what they cover thinly: sect and market institutions, person roles, rules and enforcement, information, rhythm in real life. The census of every spirit-stone figure in all 44 chapters was run by script over the whole text before choosing windows (price locators then opened by me).

**Windows (word unit: one non-whitespace character counts as one word, including fullwidth punctuation; locators `[CCCC pN]` are chapter number plus paragraph number inside the window file, which differs from f1.md's chapter-only `[CCCC]`; f1 and the deep dive use the chapter-only scheme).**

| Window | Chapters | Words | Form | Named gap (from f1.md and the deep dive) | Focus-term test before briefing |
| --- | --- | --- | --- | --- | --- |
| W1 | 15-19 | 10,401 | consecutive | Sect recruitment, outer-disciple entry, the 極陰島 market (坊市), first real-life roles | 靈石 13, 坊市 6, 弟子 19, 師兄 22 |
| W2 | 20-24 | 10,830 | consecutive | The beast-hunt gang, no-investigation rule, loot, the 御荒門 run | 靈石 12, 弟子 6, 長老 4 |
| W3 | 32-36 | 10,826 | consecutive | Mission hall, 陸清風's binding technique, the staged ambush, the 丹星閣 run | 靈石 6, 弟子 36, 宗 17, 任務 11 |
| W4 | 6-10 | 10,312 | consecutive | The price step and the gathering (集會), the robbery, the first lifespan-cap pick | 靈石 36, 弟子 8 |

Total 42,369 words read by Haiku readers, as four whole consecutive blocks (no keyword excerpts). Chapters read by readers: 6-10, 15-24, 32-36 (20 of the 44 held; about 10.8% of the full book by character estimate). Plus a whole-book script census of spirit-stone figures and the paragraphs I opened myself (section 2). Not read in this pass but covered by f1.md at chapter level: 1-5, 11-14, 25-31, 37-44.

**Budget (declared finite plan; WPR7, AU2-AU6, AU10, AU13).** Coordinator (Sonnet 5.5) plus 4 readers, each a fresh Agent call with model "haiku" set explicitly in the call, one at a time, each on one disjoint window of at most 12,000 words, total about 48,000 allowed (42,369 used). Reader invocations used: 4. Repair invocations used: 0 of 1 (not needed). Advisor consultations by the coordinator: 1 before briefing. Every brief carried a capsule of located f1.md claims so rows came back NEW, CORROBORATED or CONTRADICTED, and a REAL or SIM tag requirement. Saved verbatim-style returns and scripts: `docs/research/novels/fanrencongjiyindao-moniqi/passes-2026-10-23/` (`return_W1_haiku.md` to `return_W4_haiku.md`, `brief_W1-4.md`, `extract.py`, the four window files). The saved returns drop the readers' closing MEMORY lines and a few site-advertisement remarks and fix nothing else; the readers' slips are listed in the review table.

## 2. Source spot checks by the coordinator (WPR18-19)

I opened each locator below in the window files or the source JSON. Every price, fee and rate in the tables of this doc is in rows 1-14 or marked U.

| # | Claim | Locator | Result |
| --- | --- | --- | --- |
| 1 | Teleport from 極陰島 to the outer sea cost 2000 stones; he had a little over 2000 left | 0006 p25-26 | Confirmed (narration). |
| 2 | Simulator start cost rose from 200 to 2000 and the cooldown became one year, after an upgrade notice | 0006 p77-79 | Confirmed. The earlier 3-month cooldown is in 0003 p1 (not in a window, opened in f1 only). |
| 3 | A 5th-grade monster core "can be exchanged for 20,000" | 0006 p82 | Confirmed (narration, his belief). |
| 4 | 賀 claims a 鷹鯉獸 core is worth 30,000 stones; he asks for 10% | 0007 p29, p34 | Confirmed; the 30,000 is 賀's claim. |
| 5 | Robbery bags: 賀 30,000 stones and four 4th-grade cores; the woman 500 and an upper artifact; 秦 10,000, a pill bottle, the 5th-grade core, three top artifacts, a basic formation text, one 浩然正氣訣 book | 0009 p23, p24, p27 | Confirmed. |
| 6 | He keeps the loot out of the real market because it leaves traces and sells it in a run instead (50,000 stones) | 0009 p36, p54 | Confirmed. |
| 7 | Run reward is pick-one; first run took everything; the 500-year cap pays 10 years for an extra pick; a 1000-stone claim line follows the list | 0002 p62-64; 0001 p79; 0010 p20-22 | Confirmed. The 1000-stone line (0010 p21) sits at the end of the list with no object: it may be the fee for the extra pick or for the bag item. UNSURE; see C5. |
| 8 | First run listed 2000 stones and an upper artifact, but the real bag held "over a thousand" | 0001 p79, p83 | Confirmed: listed 2000 versus received roughly 1000+. Ordering shown, cause unstated. |
| 9 | Three 4th-grade monsters hunted over three months, cores sold for 6000 stones | 0005 p9-13 | Confirmed; the per-core 2000 in f1 is arithmetic, not text. |
| 10 | Market stalls: blood-sha pill 10 stones each, fire-thunder jujube 100 each, a stolen water-evading formation 300 | 0018 p3-5 | Confirmed (shouts). |
| 11 | He tips 張昆 two stones for information; 張昆 carries 30 stones; new outer disciples are issued a robe, bag, cave, sword, talisman and manual | 0016 p23-24; 0017 p21, p24 | Confirmed. |
| 12 | Wu's bag: 500 stones, three mid artifacts, three books | 0022 p45 | Confirmed. |
| 13 | Puppet cost "at least 5000" stones of material, "nearly 10,000" with the master crafter (SIM); a 金絲蠶 to 幻焰蛾 upgrade needs "at least a million" and 趙天龍 gave none (SIM) | 0023 p58; 0024 p28 | Confirmed. |
| 14 | Auction (SIM): total raised 700,000; 30,000 formation, 80,000 fruit, top lot 700,000 by a sect head, another 600,000 by a 元嬰, moth start 150,000 and final 850,000; 5th-grade core 5000 "at best" | 0038 p13-51 | Confirmed. In the later run: 5th/6th/7th-grade cores 5000/30,000/80,000, total 2,040,000, a lot 900,000 (0044 p9-10, p22). |
| 15 | Outer-sect entry rule: Qi6 is enough, no test (張昆's claim for a tip); issue goods on joining | 0016 p24; 0017 p23-24 | Confirmed. Reader W1 called the capsule "joins at Qi6" partly contradicted: both cousins join one month after the cousin reaches Qi6 (0017 p23), but the rule is a Qi6 threshold. The capsule is right about the rule. |
| 16 | "Killings outside the island are not investigated, only crimes on the island" | 0022 p38 | Confirmed (protagonist's reassurance to his cousin). |
| 17 | Island dead are not avenged: elders themselves strike disciples, so avenging every death would hurt the sect | 0033 p6 | Confirmed, with a reader error: W3 wrote that deaths inside the island go unavenged. The text says: as long as you do not die on the island nobody cares. See C6. |
| 18 | Wage is small, barely daily living; the mission hall is where stones are earned in teams with inner disciples; small disciple brawls draw no attention unless casualties are large | 0033 p13-15 | Confirmed. |
| 19 | Sect did not avenge the ambush dead and did not even bother with show | 0034 p62-64 | Confirmed. |
| 20 | The realm rewards are raw: a 煞氣-dependent art gave him bloodlust in reality that the run (in a 煞氣-rich sea) did not show; a calming charm needs a 5th-grade core per month | 0027 p30-41 | Confirmed (narration, protagonist's thoughts). |
| 21 | Contradiction: run R11's menu offered 結丹中期 and he picked the talent and bag, yet two chapters later he says he truly reached 結丹中期 | 0031 p49-50 versus 0032 p2 | Confirmed both lines, see C1. |
| 22 | Mortal-life sub-run in 黑石城 lasts 5 + 10 + 10 years in the smithy; age 21 at start, 66 at the revenge | 0023 p14, p25, p27, p30, p51 | Confirmed, about 25 years, not the "about 40" in f1 for this run (f1's 40 is the repeated 紅塵劫 in later runs; not opened by me). |
| 23 | Library: three floors, one-eyed late-Foundation elder at the entrance, a nod lets him in after he hides to early Foundation | 0006 p16-21 | Confirmed. |
| 24 | In the 御荒門 run: joined as a 21-year-old mid-Foundation rogue, apprenticed to the sect's primal elder, shows late-Foundation power to earn a no-war exemption | 0024 p5, p13, p40 | Confirmed (SIM). |

Not opened by me (marked U where used): 0017 p27/0018 p46 kill count of the blood-corpse blast (7 versus 7 or 8; both sides read in the window), 0021 snake mechanics, the 0035-0036 alchemy details, the 0034 ambush scene beyond p62-64.

## 3. Places and institutions (WPR9, WPR11)

| Place or institution | Who runs it | Cost and units | Access | Tiers, limits, hazards | Locator, label, WORLD |
| --- | --- | --- | --- | --- | --- |
| 極陰島 (demonic sect island, 亂星海) | 極陰老祖, an early 元嬰; a "young island lord" 烏丑 is the enforcer figure; unnamed 結丹 elders | Disciples are paid a small stipend, barely daily living | Recruited fisherman children with roots go through a hidden screen: finish 引氣入體 on the crude manual, then go in; later Qi6 on the island is enough for outer status | Quality is low because the sect "lacks cannon fodder"; no 妖獸 or 元嬰 inside the island | 0006 p74-75; 0015 p26; 0016 p24; 0020 p5; 0033 p13. STATED. REAL. V (p24, p13) |
| Outer sect (外門) | Sect | Issue on joining: black robe, storage bag, a plain cave, low flying sword, one talisman, one manual (煞妖訣) | Reach Qi6, no exam; the claim is 張昆's, who took two stones to say it | 以戰養戰: strong and ruthless is the only test | 0016 p24-26; 0017 p23-24. STATED (張昆); SHOWN (issue). REAL. V |
| 極陰島 market (坊市) | Not stated; stalls by goods, shops for buying goods, pills, formations, top artifacts and talismans | Blood-sha pill 10 stones each; fire-thunder jujube 100 each ("ignores shield light", record checkable); a stolen water-evading formation 300; other lots unpriced | Open; no fee or check shown | Stolen goods sold openly; shouts are the only price signal | 0018 p1-10. SHOWN. REAL. V |
| Library (藏書閣) | Sect; a one-eyed late-Foundation elder guards the door | No fee | Nod-through; he hid his aura to early Foundation; blood-sha manual on floor 2 | A reward-run library shows no 結丹-and-above books (SIM); real tiers not stated | 0006 p16-21; 0009 p53 (SIM). SHOWN. REAL. V |
| Mission hall (任務大殿) | Sect | Stipend small; stones come from team missions with inner disciples | Daily crowd of disciples; information hub (a month of watching profiled one senior) | Missions include ambushing a rival sect's ships; small brawls ignored unless casualties are large | 0033 p13-17, p35-38. SHOWN/STATED. REAL. V (p13-15) |
| Annual routine mission | Sect | None | Every disciple must take one outside each year; both cousins had finished the year's | No penalty stated | 0035 p11-12. STATED. REAL. U |
| Hunt gathering (獵妖集會, 南陽島; once 南明島, see C7) | Open gathering, no host named | Stalls for pills, weapons, formations, talismans; prices not shown | Attendees all late-Foundation or above; a hunter finds a leader, bows, states name and level, no check shown | Teams are formed on the spot; the group leaves when told the target is 5th grade | 0007 p12-23, p44-46. SHOWN. REAL. U beyond p16-23 |
| Teleport array 極陰島 to outer sea | Sect | 2000 stones one way | Pay; no pass shown | Cost is "bleeding" even to a wealthy rogue | 0006 p25. SHOWN. REAL. V |
| Beast-hunt gang's formation (血煞煉妖陣) | Wu and four Qi10 men | Needs living sacrifice, red flags and two more operators | Used on a 2nd-grade python on an islet | Drains heavy qi; operators cut supply when drained | 0018 p30; 0020 p18-36. STATED/SHOWN. REAL. U |
| 萬法門 (orthodox sect) | Has a late 元嬰 elder; its 正氣 art counters demonic qi | Issues a gold anti-evil talisman | A marked ship is a target of 極陰島 ambush | Called the leading orthodox sect | 0009 p5-7, p29-30; 0035 p3. STATED. REAL. V(partial) |
| 星宮 (ruler of the sea) | Not shown; its 大長老 金魁 warns 極陰島 | None | None | A warning made the island quiet for a time; sects fear offending it | 0009 p38-40; 0035 p7. STATED. REAL. U |
| SIM institutions: 御荒門 (demonic beast-control sect, Foundation rogue accepted as a 21-year-old, a 元嬰 patron, no-war exemption for high-performing returners); 丹星閣 (top alchemy sect with a 元嬰 behind it, inner disciple on arrival, personal master after five years); 天煞宗 (3 routine tasks a year, converts qi to 煞氣); 黑石城 (outer-sea mortal town with a dock gang that kills one to warn a hundred); 血涯海 auction (every 10 years) | See rows | Blood puppet 5000-10,000; moth upgrade over 1,000,000; auction lots 30,000 to 900,000; entry ticket to a ghost valley 50,000 (f1, not opened) | Simulated futures keyed to canon events | A run's sects are forecasts, not the real economy | 0023-0024, 0031, 0035-0044. STATED/SHOWN. SIM. V (prices) |

Searched where and not found (WPR23): see section 12.

## 4. Person-to-person roles (WPR10)

| Role | What it does and owes | Access and cost | Failure or hazard | Locator, label, WORLD |
| --- | --- | --- | --- | --- |
| Recruiter (王齊) | Collects root-bearing island children, gives them a crude manual so their bodies grow a 煞丹 he will harvest | Takes the children away as mortals | Recruits are fuel; he dies to a rogue's protective charm and then to the cousins | 0015 p17-34; 0016 p4. SHOWN/STATED. REAL. V(partial) |
| Senior with a puppet (張昆) | Outer disciple who wrote the manual for 王齊, takes tips for information, treats newcomers as prey | A two-stone tip bought a true answer | Killed by sneak attack by a same-realm newcomer | 0016 p18-24; 0017 p2-10. SHOWN. REAL. V |
| Kin (孫峰) | Cousin and only emotional anchor; takes the sect work (annual missions, five years on a ruined teleport island) so 孫桓 can hide; asks a senior for help against his judgment | Owes loyalty and takes gifts; is kept ignorant of the cheat | Binds himself to a puppet-making senior; 孫桓 plans to kill the senior | 0017 p13-26; 0032 p11-40. SHOWN/STATED. REAL. U(partial) |
| Puppet-making senior (陸清風) | 45-year-old mid-Foundation inner disciple; helps no-background outer disciples in return for a binding technique, speeds them with his own qi, keeps the method quiet until the bind is complete | Disciples pay with obedience | A follower cannot act against him; about half a year until full control; he is killed in an ambush staged against a rival | 0032 p28-29; 0033 p18-34. STATED/SHOWN. REAL. V (p28-29) |
| Hunt leader and team (賀) | Late-grade 結丹 recruiter at the gathering; the team splits the core; he makes junior Foundation members take the first blow | The newcomer asked for 10% | His top artifact shatters; he dies to an orthodox talisman fired by his own teammate | 0007 p19-35; 0008 p29-47; 0009 p12-13. SHOWN. REAL. V(partial) |
| Rival pair (秦龍, 王鳳兒) | Orthodox late-Foundation couple who join the hunt and later call 賀 "a demonic target" to cover profit | Own bags | Both are killed by 孫桓 for their loot | 0009 p5-27. SHOWN. REAL. V |
| Hunt-gang leader (武微雪 [S]) | Presents as a full Qi cultivator with four Qi10 men; promises a benefit; recruits cousins as sacrifice; is a body-snatching mid-Foundation soul | Offers a share of the beast's core | Her men plan to rape, sell or kill; she is killed with the three one-use talismans | 0018 p15-32; 0020 p20-41; 0022 p16 [S]. SHOWN/INFERRED. REAL. V(partial) |
| Rogue (散修) who saved 孫峰 | Refused apprentices, left a one-use protective charm | None | The charm killed 王齊 | 0015 p14, p44-47. SHOWN. REAL. U |
| Master of a rogue-sect (SIM: 趙天龍 of 御荒門) | Teaches, gives pills, 6 pairs of larvae, then refuses to fund a million-stone upgrade; can refuse; grants war exemption for strength | Obedience | Soul-extraction risk when a disciple is too strong too fast | 0024 p13-41. STATED. SIM. V(partial) |
| Master of 丹星閣 (SIM) | Takes an inner disciple on arrival, personal disciple after five years of unquestioning work | Five years of service | None shown | 0035 p36-43. STATED. SIM. V (p36, p39) |
| Dock gang (SIM) | Retaliates for unpaid work; kills one to deter a hundred | Fee unpaid by the sons | The protagonist later kills the whole gang | 0023 p33-50. STATED. SIM. U |

How a newcomer is treated against a high-ranked one: a lone newcomer is prey (張昆, Wu's men); a late-Foundation or higher face gets a bow and an equal split (the gathering); a person who looks harmless (Qi-only) is a target; a face that shows great strength earns exemptions only in a run (御荒門). Low-rank disciples are patrol labor, unable to cultivate that year (0010 p32-34, STATED, REAL).

## 5. Money, goods and information (WPR12)

All figures opened by me (section 2 rows 1-14, 22). Unit is the lower-grade spirit stone unless noted.

| Item | Value | WORLD | Locator, label |
| --- | --- | --- | --- |
| Teleport 極陰島 to outer sea | 2000 | REAL | 0006 p25. SHOWN |
| 5th-grade core, as he believes | 20,000 | REAL | 0006 p82. STATED |
| 鷹鯉獸 5th-grade core, as 賀 claims | 30,000 | REAL | 0007 p29. STATED (claim) |
| Three 4th-grade cores sold | 6000 total | REAL | 0005 p13. STATED |
| Bags looted from 賀, a woman, 秦 | 30,000 + 500 + 10,000 stones, plus cores and artifacts | REAL | 0009 p23-27. SHOWN |
| Wu's bag | 500 stones, 3 mid artifacts, 3 books | REAL | 0022 p45. SHOWN |
| Tip to a senior for one true answer | 2 | REAL | 0016 p23. SHOWN |
| 張昆's bag | 30 stones + low sword + 5 fire talismans + toxin + corpse manual | REAL | 0017 p21. SHOWN |
| Market lots: blood-sha pill, fire-thunder jujube, stolen water-evading formation | 10, 100, 300 | REAL | 0018 p3-5. SHOWN (shout) |
| Disciple issue on joining | No price; robe, bag, cave, sword, talisman, manual | REAL | 0017 p24. SHOWN |
| Simulator: start, draw, claim | 200 start, 100/1000 draw, 200 claim, rising to 2000 start with 1000/10,000 draws and a 2000 claim after the 結丹 breakthrough; extra pick costs 10 years of a 500-year cap; a 1000 line follows (fee object UNSURE) | REAL cost for SIM content | 0002 p17-18, p61; 0006 p77-79; 0009 p45-46; 0010 p19-21. SHOWN |
| Simulator first-run listing versus real receipt | 2000 listed, about 1000+ received | REAL | 0001 p79, p83. SHOWN |
| 5th-, 6th-, 7th-grade cores in a flooded market (SIM) | 5000, 30,000, 80,000 | SIM | 0044 p9. STATED |
| Auction lots (SIM, 血涯海): trap formation / fruit / top lots / moth | 30,000 / 80,000 / 700,000 and 600,000 / start 150,000, final 850,000 | SIM | 0038 p24-51. STATED |
| Run proceeds (SIM) | 700,000 (R12), 2,040,000 (R13) | SIM | 0038 p19; 0044 p10. STATED |
| Blood puppet (SIM) | 5000 materials, nearly 10,000 total | SIM | 0023 p58. STATED |
| 金絲蠶 to 幻焰蛾 (SIM) | over 1,000,000 | SIM | 0024 p28. STATED |
| Mortal apprentice fee (SIM) | 1 | SIM | 0023 p23. SHOWN |
| 降塵丹 given by 星宮 (recalled) | "worth over a thousand" | REAL (hearsay) | 0003 p32. STATED |

No currency other than the lower-grade stone appears in the windows (higher grades are mentioned in canon, not priced here). No wage number: the stipend is "small" (0033 p13). Information: a mission hall and island gossip are the channels (0033 p13-17; 0035 p5); a lie that a passing 結丹 stranger killed the ambush party was told to the cousin and the island's story came out the same way (0034 p62, 0035 p4). Sect rumor that the sect will not avenge its dead is treated as the way things are (0034 p64). Market rumor of "records" is an advertising claim (0018 p4). Disguise is routine: masks, alias 歷桓, faked realm, shape-changing arts (0007 p12-22; 0034 p45).

## 6. Time and rhythm (WPR13)

| Item | Value | Locator, label, WORLD |
| --- | --- | --- |
| Simulator cooldown | 3 months, then 1 year after the upgrade | 0003 p1 (f1); 0006 p78, 0007 p7. STATED. REAL |
| A run's years pass in zero real time | Runs of 36 to 531 years in one sitting (f1 table) | f1; 0002 p59-60 for the 36-year one. SHOWN |
| Closed cultivation to stabilize raw rewards | 3 months (early); one year training an art | f1 [0002][0005][0009] |
| Hunt trip | Half a day to the nest; two hours at the gathering | 0007 p44-48. STATED. REAL |
| Ambush plan | One week notice; he arrives three days early | 0033 p35, p41. SHOWN. REAL |
| Time to bind a follower | About half a year | 0032 p29. STATED (his estimate) |
| Annual routine mission | Once a year | 0035 p11. STATED. REAL |
| Patrol duty | One year with no cultivation | 0010 p32-35. STATED. REAL |
| Age and growth | 16 to 19 by ch14; Qi4 to Qi6 in about two months; 結丹 by 17 | 0017 p36; 0006 p39-62 |
| Cousin's island posting | Five years | 0017 p26. SHOWN |
| Mortal sub-run (SIM) | 25 years in town, then 40 years of cultivation to level 5 | 0023 p25-54. STATED |

What continues while he is away: nothing is shown. Runs do not advance the real clock, and the real clock keeps the cooldown, so an event on cooldown day blocks the run (0003, f1).

## 7. Power and growth subtleties (WPR14)

| Subtlety | Detail | Locator, label, WORLD |
| --- | --- | --- |
| Raw reward cultivation | Realm without technique; a loud thunder-and-vortex event; do it on a remote island | 0006 p39-62. SHOWN. REAL |
| Hidden-cost art | A 煞氣-based body art caused real bloodlust that a 煞氣-rich sea hid in the run; a calming charm costs a 5th-grade core a month and he cannot also cultivate the counter art | 0027 p30-49. SHOWN. REAL |
| One-use talismans from artifacts | Spend a tenth of an artifact's power per talisman; safe only with the refill flame; hidden by infusing spirit qi | 0019 p17-25. STATED. REAL |
| Blood-evil binding art (煞妖訣) | Fast Foundation without breakthrough, the master supplies qi and gradually owns the user | 0032 p28. STATED. REAL |
| Raw power shakes the mind | He admits fear and unsteady mood after fast gains | 0017 p36. STATED. REAL |
| Same-realm reading | Sense reading is limited by realm gaps (a whole realm); a disguise talent hides realm, not technique | 0024 p33 (SIM) |
| Beast control needs strong 神識 | A beast bag without that goes wild | 0027 p3. STATED. REAL |
| Pill resistance | Same-pill resistance blocks an alchemy path (f1 [0037]) | not opened by me, U |
| Lifespan as a currency | Cap 500, pay 10 years per extra pick; a +300 talent refills; burning life in a fight is allowed in a run | 0010 p20-22; f1 [0028][0039] |
| Core-grade and market | A flooded market crashes price (f1 7折) | 0044 p9 SIM |

## 8. Starts, failure, aftermath and surfaces (WPR15-17)

- **Starts and entry.** The story starts at 16 with a free first run and a roster of ten rules (deep dive F1-F10). Sect entry for ordinary people is the recruiter route (0015 p17-26); for a rogue in a run it is a talent test and bargaining (0024 p5-13); the gathering needs only a bow and a stated level (0007 p21-23). The simulated self starts at the real age and carries knowledge of earlier runs (f1, 0003).
- **Failure.** A caught soul-sacrificer in a run suicides to avoid the island's punishment (0002 p59-60). Real killers hide the dead at sea, never loot on the sect's doorstep, and keep loot out of the market (0022 p36-38; 0009 p36). Real fights hold the consequence of a rival sect's elder searching the island, which he thinks cannot trace him (0009 p30-33).
- **Aftermath.** The sect does not avenge, does not stage a show, and treats the dead as cannon fodder (0033 p6; 0034 p64). A killed mid-Foundation soul is a body-snatcher found only through the protagonist's scan [S] (0022 p16).
- **Surfaces.** Simulator panels list start cost, three talent tiers with prices, a reward menu with a pick count, a lifespan cap and a bag line (0002 p17-18; 0010 p20-21; 0035 p21-28). The market is shouts (0018 p3-7). The mission hall is an unlabeled bulletin crowd (0033 p13). Typos and advertisements in the mirror text are artifacts, not surfaces.

## 9. Findings (F-list)

F1. The simulator is an economy, not a free rewind: start, draw and claim costs, tier choice, an extra-pick cost in lifespan, and a price step at the 結丹 breakthrough (0002 p17-18; 0006 p77-79; 0010 p20-21). V.
F2. The first run is free and gives everything; later runs give a pick-one menu, and the real bag can be smaller than the listed bag (2000 listed, over 1000 received) (0001 p79, p83; 0002 p64). V.
F3. Real sect life is predatory and cheap to enter: the 極陰島 entry bar is low, outer status needs only Qi6, recruits are fuel for their recruiter, and newcomers are prey for anyone at the same level (0016 p23-26; 0020 p5). V.
F4. The sect does not investigate or avenge; the only crime that matters is crime on the island, so a fighter's safe zone is the open sea (0022 p38; 0033 p6; 0034 p64). V.
F5. A binding technique runs through the mission hall and the inner disciples: help for obedience, with a half-year clock (0032 p28-29; 0033 p18-34). V(partial).
F6. Prices are rough and local: one value for a 5th-grade core is 20,000 in his head, 30,000 in a recruiter's pitch, and 5000 in a flooded run market (0006 p82; 0007 p29; 0044 p9). V.
F7. The market sells stolen goods openly with no fee, check or clerk, so reputation is a shout (0018 p3-5). V.
F8. Loot taken in a robbery has to leave the real market because it leaves a trace; the simulator is the laundering route (0009 p36, p54). V.
F9. Hidden costs cross the boundary: a 煞氣 art that was safe in the run's 煞氣-rich sea makes real bloodlust (0027 p30-41). V.
F10. Foresight treats canon events as a fixed schedule; he adjusts his timing only at the edges (deep dive F10; f1 [0003][0011]). U in this pass.
F11. Disguise is the common defense: alias, fake realm, shape-changing, a faked 結丹 aura used as a decoy in an ambush (0007 p12-22; 0034 p45-57). U(partial).
F12. A realm's stated lifespan is a currency and a plot clock: 500 years of cap, 10 years per extra pick, a +300 talent, and burning life in a run (0010 p20-22; f1). V(partial).

## 10. Engine facts (default, dial, reason; WPR5, WPR31)

| Code | Fact | Default | Dial | In-world reason and cost | Exceptions seen | Locator |
| --- | --- | --- | --- | --- | --- | --- |
| EF1 | Run cost | Start + tier draw + claim in stones, rising at the 結丹 breakthrough | Tier, realm, per-world coin | The coin is the cost; stones are the cheat's fuel | First run free | 0002 p17-18; 0006 p77-79 |
| EF2 | Reward carry | Pick-one menu; extra pick costs lifespan cap | Pick count, cap size | Cap is a lifespan currency | First run takes everything | 0002 p62; 0010 p20-22 |
| EF3 | Hidden-cost misfire | A reward can carry its run's context that is absent in reality | Per reward | The context, not the item, is the cost | A calming charm exists | 0027 p30-49 |
| EF4 | Sect entry | Threshold realm, no test | Per sect | Cannon-fodder demand | Rogues get a test and bargaining (SIM) | 0016 p24; 0024 p5-13 |
| EF5 | No-investigation rule | Off-island deaths go uninvestigated | Per sect; the island is the exception | Sect needs its dead for upper-tier deaths | A rival sect's elder may search (feared) | 0022 p38; 0009 p30 |
| EF6 | Market | Open stalls, shouted prices, no check | Per island | Reputation is the shout; stolen goods allowed | None shown | 0018 p3-5 |
| EF7 | Binding follower | Help for obedience, half-year clock | Method, speed | The helper owns the follower's qi | A bystander can stop it by killing the helper | 0032 p28-29 |
| EF8 | Loot laundering | Real loot that leaves a trace is sold inside a run | Run price, tax | Real market leaves a trace | None | 0009 p36, p54 |
| EF9 | Price scatter | Prices vary by speaker and market | World, glut | Local glut, boast, and belief | None | 0006 p82; 0007 p29; 0044 p9 |
| EF10 | Canon as schedule | The run follows source events as fixed; the user's timing drifts | Drift edges | Source events are the world's clock | Not tested beyond ch44 | f1 [0003][0029] |

## 11. Contradictions and tensions (WPR20)

- C1. Realm after run R11: the menu offered 結丹中期 and he took the talent and bag (0031 p49-50), yet he says he really reached 結丹中期 (0032 p2). Both kept; f1 had the same. Chosen reading: UNKNOWN. Owner: this doc. Status: open.
- C2. Which bag the fee is for: 0010 p21 ends the reward list with a 1000 fee that attaches to the bag, the extra pick, or the whole list. Reader W4 attached it to the bag by word order. Both kept. Status: open.
- C3. Mortal-life length: f1 gives about 40 years for the 紅塵劫 in R10; the window shows 5 + 10 + 10 = about 25 years in town (0023 p25-30) and 40 years of cultivation after (0023 p54). Different spans. Status: resolved to "25 in town" for R10; the repeated runs' 40-year figure is U.
- C4. Whether the sect avenges: reader W3 wrote that island deaths are unavenged; the text says nobody cares for deaths off the island and elders themselves strike disciples (0033 p6). Resolved by reopening. Status: resolved.
- C5. 5th-grade core price: 20,000 (0006 p82), 30,000 (0007 p29, a boast), 5000 (0038 p15, 0044 p9, a glut run). Both and all three kept; no price authority.
- C6. W1 capsule "joins at Qi6": the rule is a threshold (0016 p24) but the actual joining happens one month later with the cousin (0017 p23). Kept both.
- C7. Name variants in the mirror text: 南明島 and 南陽島 (0007 p12 versus p23); 嬰鯉獸 versus 鷹鯉獸 (0007 p37); 孫歡 versus 孫桓 (0008 p40); 御荒宗 versus 御荒門 (0022 p45 versus 0024 p4); 陰煞訣 versus 煞妖訣 (0015 p26 versus 0017 p24, probably two manuals); 火彈符 versus 火丹符. Probably mirror typos; U.
- C8. Plan versus action: poison and a hiding talisman were planned for 陸清風, a head-on fire strike from the sky was used (0032 p31 versus 0034 p47); not a source contradiction, a dropped plan.
- C9. Thin qi versus a breakthrough vortex: the islet has thin qi, yet the breakthrough pulls qi from tens of li (0006 p28 versus p59-60). Kept as a mechanism: breakthrough pulls qi in.
- C10. Kill count: seven or seven-to-eight cultivators for the same blast (0017 p27 versus 0018 p46, the second his own claim to his cousin). Kept.

## 12. Zero-hit and not-found searches (WPR23)

Searched by script and by readers across the four windows (42,369 characters) and, for the whole 44-chapter text, by the stone-figure census. Spelling variants tried for each: 執事/執法/刑堂, 門規/規矩, 傳言/傳聞/消息/風聲, 長老/太上長老.

| Term | Result |
| --- | --- |
| 執事, 執法, 刑堂, 門規, 貢獻, 月例, 稅, 通緝, 賞金, 任務堂, 洞府租 | Not found in any window. |
| 俸祿 | Found once: 0033 p13 (small stipend); not in the other windows. |
| 傳言 | Not found; 傳聞 at 0008 p13 and 0016 p25; 傳出 at 0034 p62; 島里傳 at 0035 p5. |
| 風聲 | Not found. |
| 任務大殿 | Found 0033 p13 (the mission hall). |
| Currency other than 下品靈石 | Not found in windows. Higher grades are not priced. |
| A rank list, a bounty office, a tax office, a rent | Not found; "none in this edition's windows", not "none in the book". |

The unread chapters 1-5, 11-14, 25-31, 37-44 and everything after 44 may hold these, so every "not found" above is bounded to the windows named.

## 13. Gaps and unread windows (WPR7, WPR23)

- Chapters 45-184 (about 76% of the book) not held and not read. This includes any later upgrades, the origin of the coin, the other runners the premise promises (the "someone else lives the run" dial), a third price tier, and the ending.
- Real-life institutions after ch44 (the next rank, the inner sect, a faction war) are unknown.
- Chapters 11-14 and 25-31, 37-44 were read only at f1's chapter-level; I did not open their institutions rows (the 御荒門 and 天煞宗 runs, the 星劍門 infiltration, the 墜魔谷 ticket price, the 血涯海 auction run R13). Their prices were censused but only some opened (section 2 rows 14, 22).
- No separate reviewer other than me opened the locators; WPR18 is met only in that I differ from the reader authors.
- Claim fee for runs and the 1000-stone line remain inferred (C2).
- No per-stall rent, no wage number, no tax: absent from windows, not from the book.

## 14. More-to-consider round (WPR24)

| Class | Angle | Where |
| --- | --- | --- |
| ACT NOW (done) | Separated REAL and SIM for every price (the book's institutions mostly live inside runs) | Sections 3-5 |
| ACT NOW (done) | Reopened the one price/fee ambiguity (the 1000 line) and the one reader reversal (sect avenging) | C2, C4 |
| ACCOUNT FOR NOW | A pack for this book must carry two economies: the real 極陰島 economy (tens to a few thousand stones) and the simulated economy (hundreds of thousands to millions). Treat them as one currency at different scales, not two currencies | EF1, EF9, K8 below |
| ACCOUNT FOR NOW | The simulator's cheapest reading is "a cost and a menu"; the world's strangeness is the sect (cannon-fodder demand, binding recruiters), which the floor card puts in K2 and K6 | Floor card |
| LATER/DELEGATE | Buy the later chapters: find a source for ch45-184, then a whole-book plan (AU13: about 28 shards of 12,000 words for 391k characters, reserve 3 repairs). Level haiku readers plus sonnet synthesis. Done check: the "someone else runs it" dial and the coin's origin are located or marked absent | AU13 |
| LATER/DELEGATE | Chapters 25-31 and 37-44 institutions pass: 御荒門, 天煞宗, 墜魔谷, 血涯海 auction. About 24,000 words, 2 readers. Done check: every price opened | Section 13 |
| LATER/DELEGATE | Cross-read the three simulator books' price systems (this book, 聖女幫我模擬修仙, XX) into one price-axis note. Level sonnet. About 6k words. Done check: one table with locators from each | SIMULATORS_AND_CHEAT_IMPLEMENTATION |

Suggestions (separate, short): treat "a threshold realm and no test" and "prey at equal level" as reusable sect-entry and newcomer mechanisms (AD38); a "listed versus received" bag gap is a candidate cheat-cost mechanism; a small `scale` field would let one price table serve real and run economies.

## 15. Ranked next list (WPR25) and review state (WPR21)

1. Obtain chapters 45-184 (not on the mirrors tried; a purchase or another route is Weibao's call) because the "someone else lives the run" dial and the coin's origin are the book's biggest unknowns.
2. Institutions pass over ch25-31 and 37-44, about 24,000 words, since both hold the largest price sets (ghost-valley ticket, auctions).
3. A short real-life census over ch1-5 and 11-14 for the opening sect days, about 10,000 words.

Highest review state reached: drafted, with 24 claim groups source-spot-checked by the coordinator (readers authored rows; I opened locators, so WPR18's separate-reviewer rule is met only in that the checker differs from the authors). Reader slips found: W3 reversed an avenging rule (C4) and mis-cited a locator for the 宗主 line (the text is 0032 p28, not p3); W2 and W1 capsule tags were right on checked rows. Not rules-reconciled in detail. Touched codes: WPR1-WPR32, AU1-AU6, AU10, AU13, WA3, WA4, WA6, WA8, WA11, WA14, AD38, and SIMULATORS_AND_CHEAT_IMPLEMENTATION's SA axes (SA6 carry, SA8/SA9 refill and price, SA13 failure). Not built, not browser-verified, not director-accepted. No conflict with standing direction found: the floor card proposes slices, selects no world and opens no deferred gate. Sealed secrets: none are in play; the body-snatching reveal in ch22 is a public plot reveal in a fan novel, tagged [S].

Follow-ups, not done because the task said to touch nothing else (WPR3, WPR28):
- Link this file from `docs/SIMULATORS_AND_CHEAT_IMPLEMENTATION.md` (FR line near 684), from `docs/USER_VISION.md` G1, and from `docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md` (line near 67). A kit card, if one is made, links it too.
- Link the private store `docs/research/novels/fanrencongjiyindao-moniqi/passes-2026-10-23/` from the research index and `DEEP_DIVE_2026-10-10.md`.
- Fold lessons into WORLD_PASS_RULES "Lessons carried in": (a) when the cheat's own surfaces carry the economy, every row needs a REAL or SIM tag and the readers must be told in the brief; (b) a whole-book price census is cheap at this size (about 96,000 characters) and should precede window choice; (c) a Haiku reader reversed a sentence about who avenges whom, so an inversion check on rules claims belongs next to the price check.
- The deep dive's "claim fee inferred" and "~40-year mortal life" lines could take the C2 and C3 notes.

## 16. Floor card (WA6)

Five records. Each lists the default, the dial, the in-world reason and cost, locator and label, current repo coverage (none of the book is in the repo beyond private research and a data-contract panel id; checked in `src/cheat_cards.js` and `src/world_packs/`, not re-verified by play: WPR21 source edit only) and the smallest playable slice. Evidence covers chapters 1-44 only. Nothing here is canon beyond the labelled evidence, and WA8 applies to unknowns.

| Record | Default | Dial | In-world reason and cost | Locator, label | Current repo coverage | Smallest playable slice |
| --- | --- | --- | --- | --- | --- | --- |
| K2 World laws | In a demonic island sect the strong and ruthless advance; deaths away from the island are not investigated, deaths on it are the sect's own business; the sect does not avenge | Per sect, per island, per rank | The sect needs cannon fodder and its elders prey on their own disciples; avenging each death would cost them (stated) | 0016 p24-26; 0022 p38; 0033 p6; 0034 p64. STATED/SHOWN. | None. No pack, card or brief. | One island with a hidden "off-island, nobody asks" rule and a consequence shown when the player breaks it on the island |
| K3 Power core | Realms from pseudo-root Qi layers to 結丹 and beyond; raw rewards arrive unstable; a loud breakthrough needs a remote place; lifespan is a currency (cap 500) | Cap size, extra-pick price, raw-reward fraction | The simulator turns time into stones and lifespan; a reward without understanding is a liability (shown) | 0006 p39-62; 0010 p20-22; 0027 p30-49. SHOWN. | Nothing for this book; `cheat_cards.js` has only a C0 data contract with a `simulator` panel id | A rehearse-once run: start cost, tier draw, pick-one reward that arrives raw and needs a quiet place and time to settle |
| K6 Cast | Cousin (kin anchor), recruiter-as-fuel, puppet-making senior, hunt-gang leader, island enforcer, a rogue rescuer; plus the canon figures the runs name (see MEMORY, unverified here) | Roster per start | Each role takes something: obedience, a share, a body | 0015-0022; 0032-0035. SHOWN/STATED. | None. | Three real people: the cousin, the senior who binds, the gang leader; each with a price in obedience or stones |
| K8 Daily life | Stipend small; team missions at the hall earn stones; an annual routine mission; stalls shout prices; low-rank disciples do patrol; prices are local and noisy (20,000, 30,000, 5000 for one grade) | Local glut, boast, stipend | Stones are scarce in life and huge in runs; the same coin buys rehearsals | 0033 p13-15; 0035 p11; 0018 p3-5; 0006 p82; 0007 p29; 0044 p9. SHOWN/STATED. | None. | A week with the stipend, a mission board, a 5-line market, and a cooldown that blocks a rehearsal on the mission day |
| K13 Signature loop | Save stones, start a run, choose the tier, live a rehearsed life, claim one reward at a cost, bring it home raw, settle it, launder loot through the run, repeat; every pick carries a hidden cost | Run cost, pick count, tier, cooldown | The coin is a bound item with a stone and lifespan price; the sim shows a future but hides the context cost | 0001 p79-83; 0002 p17-18, p61-64; 0006 p77-79; 0009 p36, p54; 0010 p20-22; 0027 p30-41. SHOWN. | Only a C0 data contract (`src/cheat_cards.js`) that allows a `simulator` panel; no behavior | One rehearsal with a three-line menu (talent, realm, bag), a lifespan-cap meter and one misfiring reward |

Floor state: all five records are drafted, evidence-labelled, and carry no pack or card. None is certified.

## 17. Independent review and W2 addendum (2026-10-23, successor world-consolidation coordinator (Sonnet 5.5, a different reader than the pass author))

Review state: **source-reviewed** for the rows listed (second reader opened the locator in the saved JSON). Not rules-reconciled, built, browser-verified or accepted. Drafted state of the rest is unchanged.

Confirmed again (about 25 locators, none new to the author's table except where marked): 0006 p25-26, p77-79, p82; 0007 p29, p34; 0009 p23-27, p36, p54; 0010 p19-22; 0001 p79, p83; 0005 p9, p13; 0018 p3-5; 0002 p17-18, p61-64; 0023 p58; 0024 p28; 0038 p13-51 (new check: the 700,000 is the player's own pre-auction sales total, 0038 p19, not an auction figure); 0044 p9-10, p22; 0016 p24; 0017 p23; 0031 p49-50; 0032 p2; 0003 p1.
Corrections:
- C4 is not resolved. 0022 p38 says only offences on the island are managed, 0033 p6 can be read either way (nobody manages a death off the island, or elders themselves strike disciples so avenging an island death would hurt the sect) and 0034 p64 shows no avenging of the ambush dead. Kept as an open tension: stated rule against shown practice.
- C3: 0040 p51 shows a 40-year 紅塵劫 run (Dayan layer 4, age 63). The 25-year town span at 0023 is a different run, so both numbers stand.
- Lifespan cap is 500 at 0010 p20, 470 at 0026 p57 and 750 at 0040 p2 (inference: the +300 talent and extra picks move it).
- C2 stays open: 0010 p19 states a 2,000 reward fee and p21 a separate 1,000 line after the last list item.
W2 (Haiku readers, two windows, REAL/SIM column): ch25-29 and ch37-41, about 21,400 characters. Results are in the private store (`docs/research/novels/fanrencongjiyindao-moniqi/passes-2026-10-23/w2/RETURNS_W2.md`). New rows: calm-mind chant costs one 5th-grade-or-higher core per month (REAL, 0027 p40-41, p48); extra pick costs 10 years of cap; talent draws 1,000 and 10,000; core price 5,000 with pills over 10,000 and a 70 percent quick-sale rate (0038 p15-17); lifespan burns 10 years per defence boost and 200 for the final burst (0039). Reader slip: F2 row for 0040 p15 tagged REAL without basis. Still unread: ch30-31 and ch42-44, and everything after ch44.

## 18. W3 rules and runtime reconciliation (2026-10-24, world-readiness coordinator, Sonnet 5.5)

State reached: **rules-reconciled on the cited codes** (WPR21); drafted and source-reviewed rows keep their earlier states; not built, browser-verified or accepted. Proposals stay proposals (AD32). Packet: [FIRST_SLICE_PACKET_2026-10-23](../gm/dispatch/claude-coordinator-continuation-2026-10-23/FIRST_SLICE_PACKET_2026-10-23.md). Ranked dispositions: [GAP_AUDIT readiness round](../gm/dispatch/claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md).

**Disposition: NEEDS MECHANISM (rank 3), plus specific source.** Codes: AD1, AD6, AD9 (forecasts follow knowledge), AD11, AD12 (loops are a player option), AD38, WA3, WA4, WA6, WA8, ECR (price scatter, EF9), SIMULATORS_AND_CHEAT_IMPLEMENTATION SA6/SA8/SA9/SA13. No conflict with standing direction; the one-realm milestone is untouched.
Runtime owners: `expansion_engine.js` has scenario checkpoint and rewind (the rehearsal host), `carry_ledger.js` has a boundary table, `cheat_cards.js` has a `simulator` panel id (C0 contract, runs nothing). Missing class: a priced run with a tier draw, a pick-one carry and a hidden-cost misfire (implementation map C4, proposal only) plus a lifespan-cap currency. Smallest extraction: a run record `{cost, tier, pick, capCost, contextCost}` over the existing checkpoint/rewind, with the misfire as a data row.
Source gaps (exact): ch30-31, ch42-44, ch45+ (not held); C2 fee attachment (0010 p19 versus p21); lifespan cap 500/470/750 across runs (0010 p20, 0026 p57, 0040 p2) needs a per-run label; C4 avenging rule stays open. Any pack that uses the cap or the core price must cite the run (5,000, 20,000, 30,000 are three readings).
