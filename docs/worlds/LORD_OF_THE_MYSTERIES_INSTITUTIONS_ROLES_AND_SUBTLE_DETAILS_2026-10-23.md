# Lord of the Mysteries: institutions, roles and subtle details (pass, 2026-10-23)

Status: **proposal at pass level; highest review state reached is source-spot-checked (WPR21).** Findings are not accepted decisions and authorize no build, commit or push (WPR; AGENTS). Spoiler-light: a row tagged [S] points to a locator and leaves the truth to the private store. Sealed designed truths of this repo were not read for this pass and none appear here (WPR8).

Codes touched (WPR22): WPR1-WPR32, AU1-AU15, AD36-AD38, WA3/WA8, LTS1-LTS14, K6/K7/K8/K11 of the [kit card](world-core-kit-2026-10-14/cards/lord-of-mysteries.md), WG8 of the [subtle-gaps audit](../audits/WORLD_SUBTLE_GAPS_2026-10-20.md).

## 1. Pass record (WPR1)

| Field | Value |
|---|---|
| World, part | Lord of the Mysteries (first novel only; the sequel EPUB `Lord of Mysteries 2: Circle of Inevitability` is outside BRIEF's first-novel boundary and excluded) |
| Mode | Reuse and check, then four bounded reader windows, then source spot-checks by the coordinator |
| Coverage rows | WPR9 to WPR17, all nine named (section 3) |
| Output owner | this file (WPR3: new file because no institutions/roles owner exists for this world; link follow-ups in section 12) |
| Stop condition | four readers used, one repair reserved and not needed, then stop. Unread parts are named gaps (section 9) |

### Edition (WPR2, WPR23)

- Source used: Calibre Library copy at `Ai Qian Shui De Wu Zei/Gui Mi Zhi Zhu Zui (1)/Gui Mi Zhi Zhu Zui - Ai Qian Shui De Wu Zei.epub`. Its SHA-256 matches the repo's recorded `6126274478a95dbe03eb904bc35c409067c7022563e52997a46e98be07b2d70d`.
- It is the **Chinese** supplied compilation (title 诡秘之主最, author 爱潜水的乌贼, language zh, OPF modified 2021-01-17, publisher listed as StarPress). Identifies the compilation, not authentic publication provenance. 1,394 numbered story chapters in eight parts.
- Stale path: `LOCAL_LIBRARY.md` and `read_epub.py` still name `~/Sync/CalibreLibrary/...`; the Calibre Library path above is the working one on 2026-10-23. Only one other LOTM EPUB exists (the English sequel), excluded.
- Locator convention: `[serial pN]`, serial = EPUB member number `lotm_c_NNNN`, p = nonempty `<p>` counted from 1 (matches `full-book/lord-of-mysteries/EDITION.md`). Older reader notes use "member" for the same number. English glosses of 机械之心 vary in the repo (Machinery Hivemind, Mechanical Heart, Steam and Machinery church team); this file keeps the Chinese and treats the English as a translation-dependent gloss (WPR4).

## 2. Manifest: reuse, windows, budget (WPR2, WPR7)

### Reused first (nothing re-read for these)

| Source (private store unless noted) | Used for | Status |
|---|---|---|
| `full-book/lord-of-mysteries/WORLD.md` + workers r001-r038 | Institutions, money and custody for Part 1 and Part 2 serials 1-369 | reviewed and integrated by the earlier lane |
| `full-book/.../workers/r039-r145` NOTES | Leads only for serials 370 onward | **unreviewed worker notes, unverified** unless a row says I opened the locator |
| `lord-of-mysteries/readers-2026-10-10/LOTM_RULES.md` | Acting, loss of control, advancement, sealed items, society and prices | reader notes, five claims re-checked by the census; mine add more (section 8) |
| `census-2026-10-19/` (466 rows, conflicts C1-C12) | Conflict register | notes-level |
| kit card K6/K7/K8, W3-LM, W7-LOT; LOTM_SEER_SLICE_LAWS LTS1-LTS14; WORLD_SUBTLE_GAPS WG8 | What the repo already proposes | proposals |

### Windows (pre-extracted by script; one reader at a time; haiku set explicitly)

Word unit: **1 Chinese character counts as 1 word** (strict reading; declared because the budget is in words and Chinese text has no word breaks). Counts are nonempty paragraph characters, markers excluded. Paragraph counts were asserted equal to `chapter_manifest.json` before extraction.

| Window | Label | Content (serial, title gloss, paragraphs) | Characters |
|---|---|---|---|
| W1 | mixed (three whole chapters plus a partial; not consecutive) | 455 Machinery team's fighting style p1-86; 459 A Better Choice p1-97; 460 Splitting the Money p1-100; 456 The Portrait p1-56 of 81 | 11,995 |
| W2 | mixed (not consecutive) | 494 A New Identity p1-70; 498 The Growing Tarot Club p1-82; 499 Living Costs p1-77; 495 Asymmetry p1-35 of 65 | 11,983 |
| W3 | consecutive | 522 The Bishop Returns p1-83; 523 p1-98; 524 Is It Over p1-120; 525 Scaring p1-52 of 100 | 11,997 |
| W4 | consecutive, late book, [S]-heavy | 1355 Summary Report p1-76; 1356 Strange City p1-82; 1357 Pride p1-99; 1358 Seven Members p1-73 of 89 | 11,998 |
| Total | | 4 windows, 17 chapters (13 whole, 4 partial) | **47,973** |

Why these: keyword census over all 1,394 chapters (inst/money/power/info term counts, kept in the scratchpad) plus the named thin spots in LOTM_RULES "Gaps": Machinery Hivemind and Mandated Punishers internals, Psychology Alchemists terms, how a Beyonder joins, a non-first-arrival start, Tarot Club growth. All four sit outside serials 1-369 (already reviewed), so they add new coverage.

### Invocations and usage (WPR7, AU2)

| Item | Count |
|---|---|
| Haiku readers (fresh Agent calls, model set in each first brief) | 4 (W1, W2, W3, W4, sequential) |
| Repair readers | 0 used of 1 reserved |
| Advisor consultations (coordinator) | 1 (pre-dispatch) |
| Coordinator | Sonnet; opened source itself for 20+ spans (section 8) |
| Reader cost observed (AU4 pilot) | W1 about 101k subagent tokens, 4 tool uses, 62 s; later readers 100k to 106k. A 12,000-character window fits haiku comfortably in one pass |
| Reader output | each under 1,900 words, in the scratchpad (not committed) |

Semantic coverage claimed: those four windows only. Nothing else in the book was read by me; everything else in this file is reused (section 2) or labelled lead.

## 3. Coverage of the WPR rows

| Row | Covered by | State |
|---|---|---|
| WPR9 places and institutions | reuse (WORLD.md, LOTM_RULES s7) + W1/W3/W4 | F1-F6 |
| WPR10 person-to-person roles | reuse + W1/W2/W3/W4 | F7-F11 |
| WPR11 institutions and law | reuse + W3 | F2, F3, F12 |
| WPR12 money, goods, information | reuse + all windows | F13-F17 |
| WPR13 time and rhythm | reuse + W2/W3 | F18-F19 |
| WPR14 power subtleties | reuse (LOTM_RULES s1-s2, s4-s5) + W3/W4 | F20-F24 |
| WPR15 starts and entry | W2 + reuse | F25-F26 |
| WPR16 failure and aftermath | W3 + reuse | F27-F28 |
| WPR17 surfaces | derived from the above | F29 |
| Not covered here | hospitals as institutions, banks in depth, newspapers (only attributed public-report notes in WORLD.md), markets in the later parts | section 9 |

## 4. Findings (coded; evidence label and locator on each)

Labels: shown, stated(who), inferred(who), proposed. "V" = I opened the locator in the source. "R" = reader-reported, locator not reopened. "L" = unreviewed worker note lead. "W" = reviewed WORLD.md or LOTM_RULES claim reused.

### Places and institutions

| Code | Finding (paraphrase) | Label and locator | Check |
|---|---|---|---|
| F1 | In Tingen the church teams split the city by faith: Nighthawks hold the north, west and the Golden Plane area; the Mandated Punishers (代罚者, Storm Lord) are "group 6" with docks, east and south; the Machinery team (机械之心, "group 5") has the university area and outskirts. The captain says only six formal Nighthawk members exist in the whole city, counting himself, plus the new clerk. | stated(Dunn) [17 p79], [17 p83] | V |
| F2 | Jurisdiction in the kingdom follows worship affiliation first and territory second for mixed cases; a case can then pass up to the royal family. | stated(Mechanical Heart member) [446 p18-p57] | L |
| F3 | A local Storm cathedral hides an underground Mandated Punisher team (Klein reasons 6 to 8 Beyonders) and an unfixed number of sealed items; priests and bishops are not the main force for supernatural events. In the seaside case, the team took out three sealed items for the mountain-altar fight and asked the civilians involved to sign secrecy agreements. | inferred(Klein) team size [522 p35]; stated(captain) [524 p99], [524 p101] | V |
| F4 | Sealed-item grades carry access rules: grade 2 needs bishop or team-captain clearance and a central cathedral keeps three to five; grade 3 needs a group of three or more to request it and formal-member clearance. | stated(Dunn) [19 p51] | V |
| F5 | The Machinery team in W1 is a church dig crew clearing a Fourth-Epoch tomb under an archbishop (half-god) and a deacon, with about ten Beyonders in two clearing groups and church-issued protective amulets. Its Backlund front office is a windowless meeting room guarded by a sealed-device room. | shown [455 p13-p15], [455 p80], [459 p76-p83] | R |
| F6 | The Psychology Alchemists (心理炼金会) are described by a member as one of the youngest secret orders, weak in accumulated wonderful items, so they accept item barter. Late in the book they run a council of seven commissioners plus a chairman, each commissioner governing a city and region with a code-name mask. Membership shows no fee; members contribute and receive research material, and a formula can be advanced against future contribution. | stated(member) [459 p31]; shown/stated(chairman) [1357 p90], [1358 p45], [1358 p57-p60]. Council rows [S] | V for [459 p31], [1357 p90], [1358 p45] |

### Person-to-person roles

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F7 | Joining as civil staff is a contract: an offer with an answer window, a usual five-year term, lifetime secrecy, travel and registration limits, and a reveal of the address only after consent. It is not initiation or field membership. | stated(captain), reviewed [WORLD.md r002 C28-C30] | W |
| F8 | A new clerk recruit in the late book is hired one week after the first meeting, with pay said to match government posts; the captain pairs the job with protection and close watching because her own wishes are a risk. | shown/stated [1355 p40-p47] | R |
| F9 | A senior deacon (one of nine for the Nighthawks, Sequence 5 in the example) conducts the promotion examination, not the local captain. The captain tells the candidate to wait three years on the previous potion even when merit is enough. | stated(Dunn) [168 p8-p13], [18 p56], [106 p55] | V |
| F10 | Brokered sales run through a trusted middleman who holds both money and item until the buyer verifies; the seller's agent says it will carry the offer but cannot promise acceptance. The broker's reputation backs the deal. | shown [459 p32], [460 p76-p80] | V |
| F11 | A seller's agent pays a share to the informant who supplied the lead: 800 pounds cash plus two rare hairs (about 1,000 by the buyer's count) from a 2,000 sale, called an equal split. | shown/stated [460 p15], [460 p19] | V |

### Law, enforcement, aftermath

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F12 | After a priest's death and a bishop's fall, headquarters answers a telegram the same night and sends investigators later; the local team handles cleanup, claims the kill, asks witnesses and bereaved families to sign secrecy, and a passing outsider returns a dead Beyonder's characteristic through an intermediary to avoid becoming a suspect. | stated(captain) [524 p101]; R for the return of the characteristic [524 p70-p73] | V / R |

### Money and information

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F13 | Psychology Alchemists asked 2,500 pounds for a human-skin-shadow characteristic and 3,000 pounds for a Sequence 6 formula; the Hanged Man says a normal Sequence 6 formula costs under 2,000 and is hard to find or verify; the buyer's view is a markup above 50%. Equal-value wonderful items are accepted in barter. | stated [459 p26-p31] | V |
| F14 | Machinery team offer for a characteristic: 1,500 pounds, with a total of 2,000 if the seller chooses money (what the 1,500 option otherwise offers is unclear). | stated [459 p93-p94] | V |
| F15 | A sale agent's commission can be written as a percentage with a price floor: 15% on a floor of 3,500 pounds for a Sequence 6 characteristic. | stated [498 p75] | V |
| F16 | Cost of a fresh identity and passage in the new start: papers 8 pounds, clothes and goods about 12, cash left 5 pounds plus 5 gold coins, third-class passage 4 pounds per leg; an ocean ticket needs an official identity certificate. | stated(Klein) [494 p54], [494 p56], [494 p20]; 12-pound figure R [494 p53] | V |
| F17 | Civil staff pay is 2 pounds 10 soli weekly plus 10 soli secrecy and risk allowance (3 pounds); a formal member earns 4.5 pounds weekly (3 pounds first week back-pay) while a salary advance is repaid. A grateful family gave the outsider 50 pounds in cash, which he accepted so ordinary people would not stay uneasy. | stated [15 p57], [83 p61], [525 p35-p37] | V |

### Time, rhythm, power

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F18 | Church rule: promotion comes only after three years on the previous potion plus an examination, even for strong merit, and many still lose control each year. | stated(Dunn) [18 p56], [106 p55] | V |
| F19 | A Nighthawk-style night-door custom applies in a haunted harbour town: staff do not answer or open at night, streets are empty from dusk, locals go out at sunrise. | shown/stated [522 p12], [524 p39], [524 p103-p105] | R |
| F20 | A verbal oath given to the order becomes a net in the oath-taker's own subconscious; it triggers only toward non-members or members without enough clearance, she cannot perceive it, and even becoming an angel would not clear it. Widening one word closed a loophole. [S] | shown/stated(narrator) [1357 p82-p86], [1357 p80-p81] | V for p82-p86 |
| F21 | Masks magnify a cognition or emotion and can reshape personality; inner strength lowers the harm, and an earlier absence of a member is attributed to pride. [S] | stated(chairman/Audrey) [1358 p26-p32] | R |
| F22 | A cheap machine grants wishes for a one-penny coin with the first use free; wishes come true in twisted form and the third is the worst; the church advises that easy wishes bring great disaster. The captain's report judges it above a grade-2 sealed item. | stated(Jasmine/Grey) [1355 p14-p15], [1355 p69-p73], [1355 p36] | V for [1355 p14] |
| F23 | A corrupted bishop who lost control became a monster; the cult's rite involved human sacrifice and a buried head, and the weather was altered; the hunger glove must be held back to avoid the user's own loss of control. | shown/stated [522 p43], [522 p71-p73], [523 p50-p60] | R |
| F24 | Coin divination gives yes/no and was used to test hostility, a method reused as an anchor for tests on people. | shown [522 p78-p82] | R |

### Starts, failure, surfaces

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F25 | A non-first arrival start: the protagonist leaves a monitored address, buys a new identity at a price through an acquaintance's circle, entrusts a company share to a third party for custody, and keeps old ties known to the church teams. Assets and obligations carry; the name, papers and cash do not. | stated(Klein) [494 p53-p56]; shown [494 p21-p22] | V for p53-p56 |
| F26 | In the new start, the hidden club still trades by sacrifice rite and the leader blocks other members' perceptions for private talk; at least seven seats appear in this window. Seats and rite wording are reader-reported. | shown [498 p60-p61], [499 p66]; seats [498], [499] | R |
| F27 | Failure leaves a record trail: an ordinary family disclosed nothing to the outsider about a ritual, the church teams issue a request for silence, and headquarters later audits why the bishop fell (cause not given in window). | stated [524 p101] | V |
| F28 | Abuse limits the world states itself: a rule of three years, an examination for promotion, secrecy oath, jurisdiction by faith, sealed-item grades, and the same telegram going up to headquarters; nothing in these windows shows a rule written against an individual using their pathway power in a lawful way. | inferred from F4, F9, F18 | inference |
| F29 | Surfaces that an engine can show without text: "papers needed" at a port, the examination date at the senior deacon, the open request to sign secrecy, the broker holding money and item, a price floor displayed on a sale. None of these is an on-screen number in the source, so they are proposals. | proposed | proposal |

## 5. Engine facts (WPR5: default, dial, reason and cost, exceptions the text shows)

| Code | Default | Dial | In-world reason and cost | Exception the text itself shows |
|---|---|---|---|---|
| EF1 | Joining a church team is a signed contract, not a potion. | Term, pay, secrecy scope and travel limits vary per world and per rank. | Church wants control and secrecy; the recruit trades travel and privacy for pay (F7, F17). | Only the new clerk can be hired within a week (F8). |
| EF2 | Jurisdiction follows worship, then territory. | Strength of the territory fallback; whether a royal body takes a case over. | Churches avoid fights over a case; mixed cases escalate (F1, F2). | Mobile elite units cross jurisdictions (WORLD.md r023). |
| EF3 | A promotion needs digestion, examination by a senior deacon, and months or years of waiting. | Wait length and examiner rank vary by church and sequence. | Loss of control after hurried promotion (F9, F18). | A hidden method (acting) shortens it (LOTM_RULES s1). |
| EF4 | Secret trades hold money and item with a trusted broker until verified. | Verification method (divination, test) and the broker's cut. | Fraud and forged formulas; the broker stakes reputation (F10, F11, F15). | Barter at equal value replaces cash (F13). |
| EF5 | Prices have a market band plus a premium for rarity and verification risk. | Premium size (here over 50%) and the floor the agent protects. | Scarcity rises with sequence; the order's lack of stock (F13, F15). | A church team can offer a flat higher total for cash (F14). |
| EF6 | Sealed items are issued by grade, clearance and group size. | Number held per cathedral; whether a team may carry them. | Danger grades (F4); the team takes out three only for a large operation (F3). | Local teams carry them in a long chase. |
| EF7 | An oath can bind the mind, not just the person. [S] | Which targets trigger it; whether the maker can lift it. | The binding comes from the swearer's own spirituality (F20). | None shown; loophole closing is the swearer's choice. |
| EF8 | Masks and roles shape the wearer. [S] | How strong; what inner strength counters. | Role drift is a loss-of-control route (F21, LOTM_RULES s1). | A rested or resistant wearer withstands it. |
| EF9 | A cheap wonderful item with a trivial price is the dangerous one. | Price, wish count, the twist's strength. | Easy gains in this world draw large costs (F22). | The first use is free and not counted. |
| EF10 | A new identity costs money, papers and a custody arrangement, and old ties stay known to the teams. | Document price and who vouches. | The state controls passage (F16, F25). | None shown. |
| EF11 | After a rule is broken, the local team seals the matter first and headquarters audits later. | Speed of reply; what witnesses sign. | Containment before accountability (F12, F27). | An outsider can return evidence indirectly to avoid blame. |

## 6. Contradictions and divergences kept (WPR20)

| Code | Side A | Side B | Treatment |
|---|---|---|---|
| X1 | Kit card K8 inferred anchors: bread 2 pence, shared room 6 pence a night. | WORLD.md (Part 2, serials 111-120, Backlund poor district): room 3 soli 10 pence weekly, ground space 1 sol, day use 6 pence. | Different city and class. Keep both; the card's anchors are proposals (INFERRED) and the source ones are stated. Do not merge. |
| X2 | Kit card K7 working ladder: civilian source, provisional worker, field member, captain. | Source ladder seen in these windows: clerk by contract, formal member, captain, senior deacon (9), archbishop (13), pope. | The card lacks the church tiers above the captain and the contract terms. Add as a note; no conflict with the card's "formal joining optional". |
| X3 | LTS13: a local office releases the next dose after an assessment by a warden (authored NPC). | Source: a senior deacon examines (F9). | Authored divergence, not a source contradiction. Mark Warden Hale as authored, dial: the slice may let a local pre-screen run before the examiner. |
| X4 | LTS11: six completed acts digest a potion. | Source: up to half a year with acting at low sequence, three years without (LOTM_RULES s1; church rule verified [18 p56]). | Authored dial. Keep the slice number as a prototype, the source rate as the reference. |
| X5 | LOTM_RULES: archbishops "answerable to the pope"; headcount 13 and 9 with a Sequence 4 wording tension. | Source line [168 p10] gives 13 and 9 as the church's usual top tier, in Klein's thought with a hedge ("said to"). | Source gives the headcount as Klein's belief; "answerable to the pope" is not in that line. Unverified. Census C11 stays open. |
| X6 | Census C3/C9 gloss variants. | 机械之心 appears as Hivemind, Mechanical Heart, Steam and Machinery team in different repo files. | Translation-dependent gloss; keep the Chinese as key. |
| X7 | LOTM_RULES says Punishers used two grade-2 items on a pirate operation [538]. | W3 shows three sealed items for a mountain-altar fight [524 p99]. | Different operations. Not a contradiction; shows the count varies with the target. |
| X8 | My own reader brief claimed earlier notes put the Tarot Club at four members. | No repo note says that. | **My brief error, retracted.** W2's seat count is not a contradiction of any repo doc (the reader's "does not match" comment is void). |

## 7. Searches that found nothing (WPR23)

All on the Chinese text of 1,394 story chapters, searched 2026-10-23 by script:

| Term | Result |
|---|---|
| 索尼娅 and variants 索尼亚, 索妮娅, 索妮亚, 桑尼亚, 森尼亚 | 0. The sea region is written **苏尼亚** (Sunia / "Sonia" gloss): 232 hits, 115 of them "…尼亚海". Use that spelling. |
| 拍卖, 拍卖会, 竞拍 | 0. The edition does not use these for auctions. Trades appear as anonymous boards, private rooms and brokered sales (WORLD.md; LOTM_RULES s7). |
| 交易会 | 1 hit [815]; not checked. |
| 黑市 | 23 hits across 18 chapters; the largest clusters are in already-reviewed ranges (334, 282). Not re-read. |
| 经纪 | 1 hit; "broker" is expressed by role words, not this term. |

## 8. Source spot-checks by the coordinator (WPR18-19)

I opened every locator below and read only short spans. Result for each: confirmed.

| Claim | Locator | Result |
|---|---|---|
| Psychology Alchemists price 2,500 and 3,000; normal under 2,000; markup over 50% | [459 p26-p28] | confirmed |
| Barter for equal-value items; agent cannot promise acceptance; money and item held until verification | [459 p30-p32], [460 p76-p80] | confirmed |
| Machinery team offer 1,500, total 2,000 for money | [459 p93-p94] | confirmed |
| 800 cash plus two hairs from a 2,000 sale as "one half each" | [460 p15], [460 p19] | confirmed |
| Commission 15%, floor 3,500 | [498 p75] | confirmed |
| Identity papers 8 pounds; cash left 5 pounds + 5 gold; passage 4 pounds a leg; certificate needed | [494 p20], [494 p54-p56] | confirmed |
| Team split by faith; six formal members | [17 p79], [17 p83] | confirmed |
| Civil staff pay 2 pounds 10 soli + 10 soli; formal 4.5 weekly | [15 p57], [83 p61] | confirmed |
| 13 archbishops and 9 senior deacons; the examiner is a senior deacon at Sequence 5 | [168 p8-p13] | confirmed (headcount is a hedged thought) |
| Three years on the previous potion plus examination | [18 p56], [106 p55] | confirmed |
| Grade 2 and grade 3 access rules | [19 p51] | confirmed |
| Underground team size and three sealed items; secrecy agreements; headquarters reply | [522 p35], [524 p99], [524 p101] | confirmed |
| Thank-you gift 50 pounds | [525 p35-p37] | confirmed (the source prints the denominations oddly; total is 50) |
| Wish machine one penny; first use free | [1355 p14], [1355 p15] | confirmed |
| Oath net and commissioner appointment; chairman counts himself as the eighth | [1357 p82-p86], [1357 p90], [1358 p45] | confirmed |

Not opened by me, so unverified: all rows marked R or L in section 4, the reader tables' "roles" rows for W2 and W4, and the reader claim that Tarot Club information is free among members.

## 9. Open gaps with exact windows

| Gap | Why it matters | Exact window to read next | Est. size |
|---|---|---|---|
| Mandated Punishers operation and rewards, "Eternal Dream" sealed item, squad deployment | internals of a team in action | serials 536-540 (Part 3 ch42-46) | about 16,000 chars (over one window: split) |
| Nighthawk/Red Gloves mobility and Sanctuary training | rank and cross-jurisdiction rules | serials 370-372 (leads R039-C04); 416 | 9,500 |
| Machinery team politics, tomb jurisdiction | clear rules for takeovers | serials 445-446 (R046-C11) | 6,500 |
| Church messenger and mission (new task) | late institution, [S] | serials 1350-1351 | 6,400 |
| Psychology Alchemists terms before the council | access, contribution, formula advance | serials 427, 448, 582, 649 (leads R046-C17, R059-C19, R065-C34) | about 13,000 |
| Hospitals and charity medical foundations | missing from this pass | serial 635 (R064-C22), 486, 533 | about 10,000 |
| Banks, clearing and newspapers | only attributed notes in WORLD.md | serials 794-796 plus WORLD.md r027 locators | scope to be chosen |
| Black-market boards, hidden markets | hits in unreviewed ranges (813) | serial 813 (R081-C21), 282, 334 | about 9,500 |
| Seq9 formula and material prices | LOTM_RULES gap | no window found; search keyword "序列9" with price terms | unknown |
| Archbishop headcount wording | census C11 | serials 96 and 168 | 6,500 |
| Rest of unreviewed range | worker notes r039-r145 stay unreviewed | review pass over serials 370 to 1402, selected | not scoped |

## 10. Review state (WPR21)

Highest state reached: **source-spot-checked** for sections 4 and 8 rows marked V. Everything else is drafted. Not reached: rules-reconciled with the engine (only listed divergences), built, browser-verified, director-accepted. Reader outputs were extracted by haiku with one pass each; I rejected or corrected several reader cells (payer direction for one W1 trade; a "Klein pays" row; the "four members" comparison) and did not use rows without locators. No reader rerun on sonnet was needed (WPR6).

Limits: the Chinese edition's authenticity is unverified; reader paraphrases may have mistranslated names, ranks or numbers; money amounts apply to those scenes and are not a universal price table.

## 11. More-to-consider round (WPR24)

**ACT NOW (done in this file):** section 6 divergences recorded; the Sonia spelling gap (苏尼亚) resolved; zero-hit terms logged.

**ACCOUNT FOR NOW (constraints on current work):**
1. LTS13: mark Warden Hale as an authored stand-in for a senior-deacon examination and keep the dial "local pre-screen"; do not claim the source uses a warden.
2. Any LOTM price table must carry a source band and a premium, never a single price (F13, F14, F15).
3. K8 anchors in the card stay proposals; do not use them as stated prices for Tingen.
4. Jurisdiction by faith (F1, F2) should constrain any "which team answers" feature in the slice before it grows past the Seer start.

**LATER/DELEGATE (level, effort, done check):**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Review the unreviewed workers r039-r145 for institutions and roles only | haiku readers + sonnet judge | M (about 6 windows) | each leads row has V or stays L; doc table updated |
| Read the windows in section 9 | haiku | M | gaps marked read, new F rows with locators |
| Broker-escrow mechanism as a data row for the engine | sonnet | S | one escrowed trade, verified in a stepped test |
| Contract-join mechanism (offer, answer window, term, secrecy, pay) | sonnet | M | recruit scene walks offer, accept, first pay, repay |
| Jurisdiction table (faith, territory, escalation) | sonnet | S | three sample cases route to the right team |

**Separate short suggestions (not reasons to stop):** an "oath binds the mind" law for the later Tarot slice; a price-floor and commission field for sales; a "papers required" gate on travel.

## 12. Next-pass ranking (WPR25) and links needed

Ranked by readiness (source in hand, card gaps, existing notes):

1. **Lord of the Mysteries, part two of this pass**: the section 9 windows (Mandated Punishers, Psychology Alchemists terms, hospitals), budget 4 haiku readers, 48,000 characters. Source is local, notes exist.
2. **Reincarnation Paradise institutions and roles**, same method (WPR lessons from the 2026-10-23 facilities pass), only if Weibao's ordering keeps it first.
3. **Mother of Learning**: card gaps in K7/K8 and a local source; smaller budget (2 readers).

Files needing links (this pass touched nothing else, WPR3, WPR28):

- `docs/worlds/world-core-kit-2026-10-14/cards/lord-of-mysteries.md` (K7/K8 pointer to this file and X1-X3)
- `docs/worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md` (note X3, X4 under LTS11/LTS13)
- `docs/gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md` (church route D-rows)
- `docs/audits/WORLD_SUBTLE_GAPS_2026-10-20.md` (WG8 family: institutional additions)
- `docs/WORLD_PASS_RULES.md` "Lessons carried in" (see below)
- private store: a pointer in `docs/research/novels/lord-of-mysteries/` to the 苏尼亚 spelling, the Calibre path and the edition note

Lessons for the playbook (WPR26): a window's keyword census picks where terms are dense, not where existing notes are weak, so read the gap lines of the owner notes first; declare the word unit for non-space languages; never put an unsourced "earlier notes say" claim in a reader capsule (it produced a false contradiction, X8); check the real spelling of a name before logging a zero (苏尼亚 not 索尼娅).
