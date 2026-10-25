# Lord of Mysteries 2: Circle of Inevitability, institutions, roles and subtle details, with a floor card (pass, 2026-10-23)

Status: **proposal at pass level; highest review state reached is source-spot-checked (WPR21).** Findings are not accepted decisions and authorize no build, commit or push (WPR; AGENTS). Spoilers are tagged [S] and point to a locator; sealed designed truths of this repo were not read and none appear here (WPR8). This is the sequel. The first-novel Tingen pass is a separate file: [LOTM pass](LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md).

Codes touched (WPR22): WPR1-WPR32, AU1-AU15, WA3/WA6/WA8, AD36-AD38, K2/K3/K6/K7/K8/K11/K13 of the [kit card](world-core-kit-2026-10-14/cards/circle-of-inevitability.md), contradiction rows W19-circle-of-inevitability-C1 to C2.

## 1. Pass record (WPR1) and edition (WPR2, WPR23)

| Field | Value |
|---|---|
| World, part | Circle of Inevitability (COI), the sequel. Institutions, roles, money and information, time, power subtleties, starts, failure, surfaces (WPR9-WPR17), plus the WA6 floor card (section 10) |
| Mode | Reuse and check, four bounded haiku reader windows, coordinator source spot-checks |
| Output owner | this file (WPR3: new file because no COI institutions owner exists; links needed, section 12) |
| Stop condition | four readers, zero repairs used (one reserved, not needed), then stop; unread parts are named gaps (section 9) |

Edition (verified this pass):

- Calibre library ID 34, `~/Calibre Library/_unknown_/Lord of Mysteries 2_ Circle of Inevitability Novel Chapters _ Light Novel World (34)/Lord of Mysteries 2_ Circle of Inevitabili - _unknown_.epub`.
- SHA-256 `e7d156a15f97b207c141a347a4e048e0db176a7ee3cd9bd3be49d5963621805f`. It equals the hash in the full-book lane's SOURCE_RECEIPT and the hash pinned in `src/feature_expansion_book_recognition.js`. All 1,180 member hashes matched `CHAPTER_MANIFEST.json`.
- English, OPF date 2025-04-16, identifier URL on lightnovelworld.co, creator unknown. Embedded title says "Lord of Mysteries 2". Official WebNovel metadata (checked by the earlier lane, 2026-10-04, not re-fetched) credits Cuttlefish That Loves Diving for the sequel. **It is the sequel's text** (Lumian Lee, Cordu, Trier, Intis; the opening chapters name the Eternal Blazing Sun and Steam and Machinery as Intis's churches, s4:p32), but a compilation of unknown translator, suspected machine translation, with a missing printed label 1026 and an exact duplicate pair (spines 1050 and 1051), per the earlier lane's SOURCE_LIMITS. Authenticity and publication completeness stay unverified.
- Whole book: 1,180 spine members, about 2.03 million whitespace words.
- **Stale path found:** the full-book lane's `SOURCE_RECEIPT.json` still names `~/Downloads/Circle Of Inevitability (... z-library ...).epub`, which no longer exists. The Calibre copy above is the working path with the same hash.
- Locator convention: `sN:pM`, N = zero-based EPUB spine index, M = nonempty `<p>` counted from 1 (matches the earlier lane). Printed chapter number equals spine index through s1025 and is spine + 1 from s1026 on (checked across all 1,179 headings this pass).

## 2. Manifest: reuse, windows, budget (WPR2, WPR7, AU2)

### Reused first (nothing re-read for these)

| Source (private store unless noted) | Used for | State |
|---|---|---|
| `full-book/circle-of-inevitability/` WORLD, POWERS, PEOPLE, SYNTHESIS, WORLD_BRIEF, SOURCE_LIMITS, 3,161 claims in `claims.json` | Institutions, roles, prices, source limits | whole book read and reviewed by the earlier lane; claim IDs, not chapter locators, so any price here was reopened |
| `lord-of-mysteries/readers-2026-10-10/COI_RULES.md` | Rules, Tarot Club, prices, numbers | 2026-10-10 reader notes, sampled in the middle of the book, **unreviewed**; I reopened what enters a table |
| Kit card (K1-K16 floor snapshots, W19 contradictions), [world brief](../research/novels/full-book/circle-of-inevitability/WORLD_BRIEF.md) | Current proposals and entry shapes | proposals |
| [LOTM pass](LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) | Method, pathway and church findings for the first novel | reused for method only; the sequel's cities and institutions differ (section 7) |

### Windows (pre-extracted by script, one reader at a time, `model: "haiku"` set in each first brief)

Word unit: **whitespace-separated English words in paragraph text, markers excluded** (the text is English). Counts are exact from the script.

| Window | Label | Content (spine, title gloss) | Words | Why chosen |
|---|---|---|---|---|
| W1 | consecutive | s457-s462: Unexpected Target, Same Direction, Price of Bestowment, Chain Reaction, Strange World, Critical Interference | 11,013 | Machinery Hivemind internals: only 13 claims in the whole claim ledger mention Hivemind, none from a team scene; also the title "Price of Bestowment" |
| W2 | consecutive | s622-s628: Smell of Death through Hanth Island chapters (Church of Earth Mother, Port Hanth) | 11,713 | Densest church-operations stretch in a census (79 church hits per 7 chapters); treatment, graves, clergy, a region outside Trier |
| W3 | consecutive | s79-s85: Sufferer, Joint Investigation Team, Key, Dream Divination, A Sudden Encounter, Dirk, Appropriating | 11,659 | Bureau 8 plus Hivemind plus Church joint team assembly; replaced an earlier choice (s174-s179) after the advisor showed it re-read ground already reviewed |
| W4 | consecutive | s375-s380: Gathering Venue, Different Teams, An Earlier Transmigrator, Investigation, Bold Speculation, Bell Chimes | 10,933 | Gatherings, teams and information trade; the "earlier transmigrator" topic |
| Total | | 4 windows, 25 chapters, all whole chapters | **45,318** | within the 48,000 plan |

Reader tool use (observed): 6 / 8 / 7 / 5 tool calls; 117,793 / 117,291 / 124,615 / 111,084 subagent tokens (about 111k to 125k each, AU4 pilot figure). Each reader wrote its table to the private store and returned under 200 words.

### Invocations (WPR7)

| Item | Count |
|---|---|
| Haiku readers (fresh Agent calls, model set explicitly in each first brief), sequential | 4 (W1, W2, W3, W4) |
| Repair readers | 0 of 1 reserved |
| Advisor consultations by the coordinator | 2 (before dispatch; before the final report, which fixed truncated checks and the cast-presence finding) |
| Coordinator | Sonnet; opened the source myself for the spot-checks in section 8 |

Semantic coverage claimed by me: those four windows only (45,318 of about 2.03M words, 2.2%). Everything else here is reused and labeled.

### Reader quality note (WPR19)

Haiku returns were padded: many rows said "none stated" in every cost, access, tier and hazard cell, and two readers self-corrected invented lines in their own report. W1 called "coppet" a typo (wrong, section 6). W4 listed the Tarot Club in its brief focus but the window shows a different society. I used readers for locators and candidate rows, then opened each locator that enters a table.

## 3. Coverage of the WPR rows

| Row | Covered by | Findings |
|---|---|---|
| WPR9 places and institutions | reuse + W1 W2 W3 W4 | F1-F5 |
| WPR10 roles | W1 W3 W4 + reuse | F6-F10 |
| WPR11 institutions and law | W2 W3 + reuse | F2, F3, F11 |
| WPR12 money, goods, information | W4 W1 W2 + reuse | F12-F14 |
| WPR13 time and rhythm | W4 W3 + reuse | F15-F16 |
| WPR14 power subtleties | W3 W2 + reuse | F17-F19 |
| WPR15 starts and entry | reuse + W4 W3 | F20-F21 |
| WPR16 failure and aftermath | W2 W3 | F22-F23 |
| WPR17 surfaces | derived | F24 |
| Not covered | academies as schools, Steam-side technology and markets, Feysac as a place, banks, newspapers, the dream-city institutions | section 9 |

## 4. Findings

Labels: shown, stated(who), inferred(who), proposed. Check column: **V** = I opened the locator, **R** = reader-reported and not reopened, **W** = reused reviewed or notes-level claim.

### Places and institutions

| Code | Finding (paraphrase) | Label and locator | Check |
|---|---|---|---|
| F1 | In the Intis Republic only two orthodox churches have the faith of almost everyone: the Eternal Blazing Sun and the God of Steam and Machinery. The Evernight, Storms (Loen), Earth Mother (Feynapotter Kingdom), Knowledge and Wisdom (Lenburg) and Combat (Feysac Empire) churches are not allowed to come in and preach. The Sun church's Inquisition is feared and has imprisoned many heretics. | stated(narration through Lumian) [s4:p31-s4:p33] | V |
| F2 | Bureau 8 is the republic's most official Beyonder body, under the Intelligence and Homeland Security Committee. The Machinery Hivemind is the Steam and Machinery church's branch for matters from beyond, on a par with the Sun church's Inquisition. A joint investigation team mixed Bureau 8 (Leah), the Hivemind (Ryan) and a Sun church member (Valentine), assembled by higher-ups after Cordu's call for help. | stated(Lumian recalling his sister) [s80:p23-24]; shown [s80], [s79] | V (s80:p23-24) |
| F3 | Routine rule of thumb for a first round: one Mid-Sequence and two Low-Sequence Beyonders, then stronger forces by situation. Cordu got three Mid-Sequence from the Intis officials. The source is Baboons members who infiltrated official bodies, so it is a relayed account, not a statute. | stated(narration relaying the Baboons) [s82:p46] | V (full paragraph) |
| F4 | After the Steam and Machinery church lost all its dioceses in the Loen kingdom, the former Archbishop of Backlund and Divine Council member returned to Intis headquarters and handled serious Beyonder incidents "like a firefighter". He led two squads in a purification sweep, using steam-style firearms, charms and scrolls. | shown/stated(narration) [s460:p3], [s460:p7-16] | V (p3) |
| F5 | The Church of Earth Mother on Hanth Island (a Berserk Sea island city, stated to be far from the Feynapotter Kingdom, s627:p67) holds a sealed valley with a Demon it will not simply kill. Lumian reads the restraint as capability held back: the Church could wipe the island as the Church of Storms did to Bansy Harbor, but the Demon cannot be slain normally, only sealed and watched. Clergy in the cloister are born there; Lumian notes other churches treat a child in a cloister as a grave breach. [S] | stated/inferred(Lumian) [s623:p55-57], [s624:p52], [s626:p70-72], [s627:p67] | V |

### Roles

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F6 | Churches keep a common rule: survivors of a mysticism incident are drawn in as civilian staff with long-term protection so they do not die suddenly. The people who saw the Hanth Demon did not get that and received only a few months of protection before departing. One witness took five months of cathedral and cloister shelter, then signed on as crew for three years, and was found dead on his second voyage. | stated(Lumian) rule [s625:p43-45]; shown/stated witness [s623:p24] | V |
| F7 | A Baboons Research Society gathering has team sub-groups with code names (Academy team, Purgatory team, April Fool's team). Members can sell texts or information in the gathering. Franca's outside patron duty applies: she may sell her convergence details there only with Madam Judgment's approval, an obligation she carries from her own card group, not a rule of the society. Entry is by incantation with a vice president's letter; exit is by changing the last line. | shown [s375:p29-30], [s378:p40]; stated [s378:p24] | V (full paragraph reopened) |
| F8 | Psychiatrists in the society are said to "make a killing" treating companions who are losing control; the cost is not stated. | stated(narration) [s377:p15] | R |
| F9 | A Beyonder patron relationship is thin on the page: the Magician card (Fors, s1178:p45-49) answers by letter through a messenger doll and sends coordinates for treatment; the Hanged Man pays gold per question set to an intermediary, amount unstated. | shown [s458:p55-59] (R), [s627] (R), [s380:p31-32] (R) | R |
| F10 | Anthony (a Spectator who is a Psychiatrist) runs a children-and-neighbors informant net in Trier paid in sweets or coppet. | stated(Anthony) [s459:p31] | V |

### Law, enforcement, aftermath

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F11 | The Sun church's Inquisition, Purifiers and Bureau 8 are separate hands. Purifiers reached a Deep Valley target after it had already shifted, so informant timing matters more than rank. | stated(Franca via 007) [s458:p37] | R |

### Money and information

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F12 | Currency: 1 verl d'or = 100 coppet; copper coins 1, 5, 10 coppet, silver 20 and 50 coppet; verl d'or in silver (1, 5, 10), gold (5 to 50) and banknotes up to 1,000. | stated(narration) [s10:p16-19] | V |
| F13 | A "lick" is a small coin worth 5 coppet: a lamp deposit of 35 coppets is "seven licks". So an iced gin at the Alone Bar is 8 licks (40 coppet) and typewriter use is 2 licks and 1 coppet per sheet (11 coppet). | shown [s112:p12], [s380:p62], [s380:p64] | V |
| F14 | Ranges from the early book: bed shares 1 to 1.5 verl d'or per week, rooms 3 to 5 per week, 15 for a month; an attendant 65 per month, a foreman 150; a doctor, lawyer or mid-level civil servant about 500 per month; a dance-hall dancer base of 1 verl d'or per day with a 30% house cut on a guest deal; a minister about 100,000 per year, a laborer about 700, a skilled worker 2,500; a Warrior-pathway Sequence 8 Pugilist characteristic listed at 15,000 verl d'or, negotiable. A rare text copy costs 100 grams of gold or equivalent (Loki's claim, "very reasonable"). Card games on Hanth swung under 1 gold risot over an afternoon; risot is Feynapotter's currency, 1.5 gold risot = 3 verl d'or for a motel suite per day (s534:p31-33). | shown [s111:p22-25], [s113:p14-15], [s134:p3], [s139:p59], [s176:p16, p25, p29], [s377:p33], [s627:p68], [s534:p31-33] | V all |

### Time, rhythm, power

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F15 | Gatherings have a strict two-hour limit, but anyone may leave at once by changing the closing line. A pocket watch slips about a minute every few days and a phantom bell with no hour struck causes a fugue. | shown [s378:p40], [s380:p47-80] | V (p40), R |
| F16 | Lumian's daily reset: his body returns at 6 a.m. to the twelfth-night baseline of the Cordu loop; only changes from Beyonder characteristics and boons are retained. | stated(Madam Magician) [s109:p84] | V |
| F17 | Sealed items have four grades, 3 to 0, smaller means more dangerous; mystical items fuse a characteristic with strong negative side effects. | stated(Madam Magician) [s30:p3-4] | V |
| F18 | Characteristic convergence: a Beyonder meets same and neighboring pathway Beyonders more often, and more strongly at higher Sequence. Gandalf's rough counts: about 1 Beyonder encounter per season at Sequence 9, 2 at Sequence 8, 5 to 6 at Sequence 7. | stated(Madam Magician) [s29:p16-22]; stated(Gandalf) [s378:p8] | V |
| F19 | Circle Inhabitant: nine uses per charge, each Circle lasting 3 to 9 resets, one Circle at a time, 3-minute cooldown, up to a year if never triggered. A Fate Appropriator dirk takes the victim's fate on a kill and its life drops from two years to half a year when damaged. Demons above Sequence 6 lose control "once every few years" (one Demon's boast). [S] | stated(Lumian/Madam Magician) [s886:p14-18]; shown [s85:p78-96]; stated [s626:p67] | V on s886, s85:p95, s626:p67 |

### Starts, failure, surfaces

| Code | Finding | Label and locator | Check |
|---|---|---|---|
| F20 | Non-first-arrival: the protagonists start inside a loop in Cordu, with a joint team arriving from outside; the player route "an ordinary newcomer in the Trier market district" is a repo proposal, not a book start. | shown [s79-s85]; proposed (repo recognition adapter) | V as shown |
| F21 | Living beside the original cast: the first-novel cast is present as remote patrons, not physical neighbors. Madam Magician (Fors) answers by letter through a messenger doll and enters dreams; Mr. Hanged Man pays an intermediary; the late Tarot gathering names Justice, Hanged Man (Alger), Magician (Fors), Sun, Judgment, Star, Hermit, Moon and Franca as the Empress. [S] Nighthawk team names reappear only inside a dream-city reflection of the first novel. [S] | shown [s458:p51-59] (R), [s380:p31-32] (R), [s1178:p40-51] (V), [s936:p64] (V) | V on s1178, s936 |
| F22 | Failure on the investigation side: the Cordu loop cannot be ended by the loop's inside; a forced end by an outside force kills everyone in the area (Pualis's statement as relayed). The official answer when outsiders cannot solve a case is destruction, as with Bansy Harbor (F5). | stated(Aurore relaying Pualis) [s81:p17] (R); stated(Lumian) [s623:p55] | V (p55) |
| F23 | A sealed Demon continues to kill a few people while the Church seals and monitors rather than ends it; the Church's own protection for witnesses is the failure that shows. [S] | stated/shown [s623], [s625:p43] | V (p43) |
| F24 | Surfaces: a bounty board and cathedral sermon are everyday signals; a Beyonder gathering (a venue reached by incantation) is the visible market; the player-visible clocks are the 6 a.m. reset, the two-hour gathering cap, a watch drift and a bell. A passive idle player would miss the invitation chain (letter then incantation then team). | inferred(coordinator) from F7, F15, F16 | n/a |

## 5. Engine facts (WPR5: default, dial, in-world reason and cost, exceptions the text shows)

| Code | Fact | Default | Dial | Reason and cost | Exceptions shown |
|---|---|---|---|---|---|
| E1 | Church monopoly | Intis lets only the Sun and Steam and Machinery churches preach | Covert worship by other faiths; the Fool's church | State settlement; heresy risk under the Inquisition (F1) | Other churches do operate from abroad and hidden (reuse, unverified: Fool cathedral) |
| E2 | Joint first-response | One mid plus two low Beyonders, then escalate | Cordu: three mid | Cost of a first round; relayed rule of thumb (F3) | Not a statute |
| E3 | Currency | 1 verl d'or = 100 coppet; lick = 5 coppet | Prices range from coppet to 15,000 verl d'or for a Sequence 8 characteristic | Small coins for the street, notes for formulas (F12-F14) | Foreign units (risot, setta, degan) in Feynapotter and on Hanth |
| E4 | Sealed items | Grades 3 to 0, lower is more dangerous | Churches share serials (reuse) | Strong negative effects (F17) | Grade 0 artifacts (reuse) |
| E5 | Convergence | Same and neighboring pathways cross more as Sequence rises | Higher Sequence dampens it (reuse) | Fate pulls Beyonders together; more incidents (F18) | A Beyonder can be fated to cross paths early (reuse, unverified) |
| E6 | Daily reset | 6 a.m. body baseline | Boon and characteristic changes persist | Sealed corruption (F16) | Not cured by it: an aura of a stronger being (reuse, unverified) |
| E7 | Gatherings | Two-hour cap, incantation in, changed line out | A member's outside patron may limit what she sells (Franca, s378:p24) | Safety against accidents (F15) | A Sealed Artifact of uncertain control is the key (W4) |
| E8 | Boon items | Fate-linked effects with a charge count and cooldown | Seq 4 boon holders | Bad luck after use (reuse) | Dream city cap at Sequence 7 (reuse, unverified) |

## 6. Contradictions and divergences kept (WPR20)

| Code | Side A | Side B | Treatment |
|---|---|---|---|
| C1 | `COI_RULES.md` (2026-10-10 notes): printed chapter is "usually member + 1" | This pass: heading number equals spine index for s1 to s1025 and spine + 1 from s1026 (1,025 and 154 headings) | Keep the pass reading; the notes statement is wrong for the first 1,025 members |
| C2 | W1 haiku reader: "coppet" probably a typo for "copper" | `s10:p16-19`: coppet is the legal sub-unit; `s112:p12`, `s459:p31` use it | Reader error, rejected |
| C3 | W4 haiku reader: Madame Hela may be "Madam Judgment" or "Madam Justice" | `s378:p24` names Madam Judgment as a separate approver; `s375:p38` gives Hela as a Sequence 4 Nightwatcher of Evernight | Reader guess, kept as unverified; no merge |
| C4 | Pualis is "on the threshold of godhood, yet not quite" (Ryan) | Lumian thinks she "alternated between a demigod and a Sequence 5" | Both kept [s80:p49], [s461:p77]; rank unresolved |
| C5 | Lord of Mysteries 1 pass: Nighthawks, Mandated Punishers, a 6-member Tingen team | COI: no Mandated Punishers; Nighthawk 11 hits, all from s936; Nightwatcher is an Evernight Sequence 4 title; Punisher is an Arbiter-domain Beyonder in Trier police | Different book, different cities; no carry-over (section 7) |
| C6 | Kit card C1: Trier work-week and Cordu household are separate candidate hubs | W3 shows Cordu is a loop that an outside joint team enters; W2 shows a third region, Hanth | Both retained; this pass adds Hanth as a possible third candidate hub, not a decision |
| C7 | Source limits (earlier lane): March vs April date mismatch in the opening | Not re-opened | Kept as an open source qualification |

## 7. Searches that found nothing or little (WPR23)

Searched the full 1,180-member extraction by regex on 2026-10-23.

| Term and spellings tried | Hits | Reading |
|---|---|---|
| "Mandated Punisher(s)", "Mandate*" | 0 | The Tingen team name does not exist in this book |
| "Punisher" | 10 hits, first s729:p26 | An Arbiter-domain Beyonder under Trier police, not a church team |
| "Nighthawk" / "Nightwatcher" | 11 / 1 (s936 / s392:p38) | Nightwatcher = Sequence 4 title [s392:p38]; Nighthawks only inside a dream-city reflection [s936:p64] |
| "Cult", "cult" | 1 / 22 | Cult is used for specific sects, not a standing rival to a church; "heretic" 147 and "evil god" 413 hits |
| "Steam and Machinery" / "Machinery Hivemind" | 134 / 31 | Present from s4, strongest in s457-s460 and s1050+; one team scene in W1, one in W3 |
| "Feysac" / "Feynapotter" | 118 / 159 | Feysac is an empire (its Combat church is barred in Intis, s4:p32), not a city; Feynapotter is the Earth Mother country; a Feysac market was not read |
| "Mystical Market" | 0 | No such market name; trade is by gathering and bar |
| "Beyonder Association" | 0 | None |

## 8. Source spot-checks by the coordinator (WPR18-19)

I opened these locators in the source: s4:p31-34 (full paragraph s4:p32), s10:p16-19, s29:p16-22, s30:p3-4, s60:p77, s79-s85 (s80:p23-24, s80:p49, s82:p46, s85:p95), s109:p84, s111:p22-25, s112:p12, s113:p14-17, s134:p3, s139:p59, s375:p29-30, s377:p33, s377:p42, s378:p8, s378:p24, s378:p40, s378:p48-49, s380:p62, s380:p64, s392:p38, s459:p31, s459:p81, s460:p3, s460:p22, s461:p77, s623:p42, s623:p55-57, s624:p52, s625:p43, s626:p62, s626:p67, s626:p70-72, s627:p24, s627:p68, s886:p14-18, s936:p64. All price, fee and rate rows in F12-F14 were opened. Results:

- Confirmed: F1, F2, F3, F4 (p3), F5, F6 (rule), F7 (entry/exit), F10, F12 to F14, F15 (p40), F16, F17, F18, F19.
- Reader claim confirmed after reopening the full paragraph: Hanth witnesses got only a few months of protection and not the civilian-staff route (s625:p43). Reader overstatement corrected: W4 said the society allows selling information as a custom; the text only has Loki saying his price is reasonable and Franca needing her own patron Madam Judgment's approval (s377:p33, s378:p24).
- Not reopened (R): F8, F9, F11, parts of F15 (watch, bell), F22 (Pualis forced-end statement). An earlier draft of this check opened paragraphs truncated at 420 characters; F1, F3, F6, F7 were reopened in full after review.

## 9. Open gaps with exact windows

| Gap | Why | Window |
|---|---|---|
| Hivemind ranks, pay, discipline | W1 and W3 show only deacon, archbishop and members | s1050-s1056 and s1071-s1072 (spoiler-heavy, late) and s284-s290 (claim r019-c07 neighbors) |
| Academy as a school | 33 academy claims, none a school scene read here | s810-s816 and s1062-s1068 |
| Tarot Club operation in COI | Not in W4 (the window shows Baboons gathering instead) | s264-s268 (Franca's explanation), s495-s498 |
| Feysac or Feynapotter markets and law | Hanth read only for churches | s509-s514 and s538-s543 (sea voyage and Port Santa) |
| Purifier informant terms | Reader rows empty of cost | s297-s301 |
| Bureau 7 and 8 pay and clearance | Not in any window | s252-s258 |
| Seq 4+ item prices | Reused notes only | s780, s1126 neighborhoods |
| Dream-city institutions | Out of the play layer per brief | s926-s935 |

## 10. Floor card (WA6)

Floor-first per WA6 and the user's explicit focus. Each record: default, dial, in-world reason and cost, source locator and label, current repo coverage, smallest playable slice. The repo's LOTM Tingen branch is a separate first-novel slice and is not counted here.

**Repo coverage method (WPR23):** grepped `src/`, `tests/`, `index.html`, `scripts/` for `circle.of.inevitability`, `coi`, `lumian`, `cordu`, `verl d`, `coppet`. Found: `src/feature_expansion_book_recognition.js` (an unactivated source-qualified recognition adapter, `nativeBound: false`, era "Trier market district, asylum identity check and Research Society gathering", three rules coi.sincerity, coi.office, coi.appearance; one-line recognition entry in `src/book_world_player_agency_contracts.js`). Not found: any COI pack in `src/world_packs/` (only `book_hp_pack.js`, `book_mol_pack.js`), any test, any COI currency, job, power or loop. Searched where: those four directories; did not search the minified `dist/bundle.js`.

### K2 World laws (5 to 10 engine facts)

- **Default:** E1-E4 and E6 (section 5): two preaching churches in Intis; joint first-response team rule; verl d'or and coppet with lick = 5 coppet; sealed items by grade 3 to 0; 6 a.m. reset for a seal-bearing protagonist; two-hour gathering cap.
- **Dial:** covert worship, escalation size, which prices apply, boon items.
- **Reason and cost:** state-church settlement with Inquisition risk (F1); escalation costs staff (F3); small coins for the street (F12-F13).
- **Locator and label:** [s4:p31-33] stated; [s82:p46] stated (relayed); [s10:p16-19] stated; [s112:p12] shown; [s30:p4] stated; [s109:p84] stated; [s378:p40] shown.
- **Coverage:** partial documents (kit card K2 D partial), R missing: three adapter rules about identity and registry, none of the laws above.
- **Smallest slice:** six law rows with hard, social or believed class, cost and one refusal each; a Trier newcomer is blocked from preaching a barred faith, pays in coppet, and is told the gathering ends at two hours.

### K3 Power core

- **Default:** one resource, Beyonder potion digested by acting (principles), 22 pathways, Sequence 9 to 0, boons separate from potions and held while the bestower allows (reuse, COI_RULES s1.1-1.2, notes-level); local pathway: the Inevitability boon chain (Dancer 9, Alms Monk 8, Contractee 7, Circle Inhabitant 4, stated in reuse, unreopened; Alms Monk and Contractee confirmed at [s60:p77]).
- **Dial:** how strict acting is, how many contracts (3 at start per reuse), dream-city cap.
- **Reason and cost:** loss of control, bestower burden; bad luck after Circle use [s886:p14-18]; Fate Appropriator dirk cost [s85:p95].
- **Locator and label:** [s29:p16-22], [s30:p3-4], [s60:p77], [s886:p14-18] stated; [s85:p78-96] shown.
- **Coverage:** none in code (K3 R missing). The adapter has no power.
- **Smallest slice:** three techniques (Sacrificial Dance, a contract, one Circle) with a use count, a cooldown and a bad-luck debt, plus a visible Sequence and an advancement gate.

### K6 Cast (6 to 12 T2+, 2 to 3 T3, one T5 arc)

- **Default:** named, reviewed people from the windows and the adapter: Lumian, Aurore, Franca, Anthony, Jenna, Leah (Bureau 8), Ryan (Hivemind), Valentine, Madame Hela, Loki, Gandalf, Pettigrew. T3 candidates with a schedule and need: Leah (works the Alone Bar), Anthony (informants and tomorrow's train), Franca (Gardner schedule). T5 arc candidate: the Cordu joint-team investigation.
- **Dial:** a fixed canon cast versus original newcomers (the world brief says no fixed Lumian route).
- **Reason and cost:** each person has a team, a card or an agency with obligations (F2, F7, F9, F10).
- **Locator and label:** [s80:p23-24] stated; [s459:p31] stated; [s375:p29-30] shown; [s380:p57] shown (R).
- **Patron tier (F21):** Madam Magician (Fors), Madam Justice (Audrey), Mr. Hanged Man (Alger), Madam Judgment, Mr. Sun, Mr. Star, Hermit and Mr. Moon act as remote Major Arcana patrons by letter, dream and payment; they are not neighbors (late roster is [S], s1178:p40).
- **Coverage:** adapter lists coi.lumian-lee, coi.aurore-roche, coi.franca, coi.hela, coi.professor (no schedule, need or memory); R missing.
- **Smallest slice:** six people with one verb each and one remembered fact, three with a day schedule, and one arc with intervene, refuse and abstain branches.

### K8 Daily life (local money, 2 to 3 jobs, food/bed anchors, calendar, unfed comfortable)

- **Default:** verl d'or and coppet (E3); jobs: motel attendant 65 per month, foreman 150 (s113:p14-15), dance-hall dancer base 1 per day with a 30% house cut (s176:p16), waiter 70 per month (s176:p45); all opened; beds 1 to 1.5 per week shared, rooms 3 to 5 per week; local calendar: a 6 a.m. day, gathering hours, a weekly cleaner. Ordinary unfed play stays comfortable (AGENTS).
- **Dial:** season, peak-season tips (7 verl d'or in a peak day, stated), Beyonder trade at 15,000 verl d'or per characteristic.
- **Reason and cost:** wages versus rent set what is affordable; formulas and characteristics dwarf wages by two to three orders of magnitude.
- **Locator and label:** [s10:p16-19], [s111:p22-25], [s113:p14-17], [s134:p3], [s139:p59] stated; [s112:p12] shown.
- **Coverage:** none (K8 R missing); no ledger, no job, no clock.
- **Smallest slice:** a funded job-to-rent loop in coppet and verl d'or, one bed anchor, one meal anchor and a 6 a.m. day clock.

### K13 Signature loop

- **Default:** a Trier gathering-and-team loop in the Baboons Research Society, with an optional outside-patron duty (Franca's approval for sales, s378:p24) that joins two groups when a player holds a card: get a letter and incantation, attend a two-hour gathering, trade a text or information at a stated price, report to a patron, leave by changed line; or the Cordu 12-day cycle as a different profile (reuse: reset at day 12; items and memory reset, characteristic-backed progress persists).
- **Dial:** gathering versus loop; attendance frequency; patron approval.
- **Reason and cost:** safety cap and patron approval (F7, F15); gold or time per copy (F14).
- **Locator and label:** [s375:p29-30], [s378:p24], [s378:p40], [s377:p33] shown/stated; Cordu cycle length is notes-level (reuse, COI_RULES s2.1, unreopened).
- **Coverage:** none (kit card: "no T4 action cards"); the adapter has only an identity-check scene.
- **Smallest slice:** one loop: invitation, gathering with a two-hour clock and one trade, patron report, leave, then a remembered result that opens the next gathering.

**WA6 floor state:** all five parts partial in documents, missing in code. None is claimed built, tested or director-accepted (WPR21).

## 11. More-to-consider round (WPR24)

**ACT NOW (done in this file):** F1-F24, E1-E8, C1-C7 with corrections; the stale-path and printed-label findings; the floor card.

**ACCOUNT FOR NOW:**
- C1: any COI locator work must use spine = printed through s1025 only.
- The reused COI_RULES numbers (Seq 5 characteristic about 200,000, Seq 7 formula 16,000 to 40,000, wages by month) are unreviewed notes; a table must reopen them before use.
- "Licks" must be priced as 5 coppet if used as a money unit.
- W4's gathering is the Baboons Research Society; the Tarot Club operation is not read here.

**LATER/DELEGATE** (level, effort, done check):

| Item | Level | Effort | Done check |
|---|---|---|---|
| Read s264-s268 and s495-s498 for Tarot Club in COI | haiku, 1 window | about 12k words | table with locators and prices |
| Read s810-s816 for academy and Warlock context | haiku | about 10k words | table |
| Read s1050-s1056 for late Hivemind | haiku | about 12k words | table |
| Purifier informant terms s297-s301 | haiku | about 12k words | table |

Suggestions (not gates): reopen COI_RULES price rows and move them into a reviewed table; add a COI line to the LOTM pass's next-pass list.

## 12. Review state (WPR21) and links needed (WPR25, WPR28)

Highest review state reached: **source-spot-checked**. Not rules-reconciled with all codes, not built, not browser-verified, not director-accepted. One advisor consultation preceded dispatch and shaped the window choice and storage rule; a second review before reporting is described in the final report, not in this doc.

Next pass ranking: COI Tarot Club window (s264-s268), then late Hivemind (s1050-s1056); both depend on the kit card's K7 and K13 gaps.

Files needing links (this pass touched nothing else):
- `docs/worlds/world-core-kit-2026-10-14/cards/circle-of-inevitability.md` (add a pointer under K2/K3/K6/K8/K13 floor and in the contradiction register as C1 to C7 here).
- `docs/research/novels/full-book/circle-of-inevitability/README.md` (stale `SOURCE_RECEIPT.json` path and the printed-label note).
- `docs/research/novels/lord-of-mysteries/readers-2026-10-10/COI_RULES.md` (printed-chapter statement is wrong for s1-s1025).
- `docs/RULES_INDEX.md` router row for world passes.
- `docs/WORLD_PASS_RULES.md` Lessons (see below).

Lesson candidates for WPR26: (1) a sequel's institutions differ from the first novel's, so zero-hit and spelling checks must list the old names (Mandated Punishers, Nighthawk); (2) a recorded `source_path` in a receipt goes stale, confirm by hash; (3) a lane that already read a book fully makes "window by keyword density" wasteful: choose windows where the claim ledger is thinnest in the needed category; (4) a reader brief that names a focus the window does not contain yields invented rows, so check the census for the exact term first.

Private store: `docs/research/novels/lord-of-mysteries/passes-2026-10-23-coi/` holds the four reader returns (W1 to W4), `extract.py`, `census.py`, `loc.py` and `headings.json`. The 2M-word extraction and the window texts were kept in a scratchpad, not the repo, per the earlier lane's no-stored-prose rule.
