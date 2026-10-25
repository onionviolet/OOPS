# Omniscient Reader's Viewpoint: institutions, roles and subtle details (2026-10-23)

Research and proposals, not accepted decisions and not implemented. Pass: WPR9 (places and institutions), WPR10 (roles), WPR11 (institutions and law), WPR12 (money and information), WPR13 (time), WPR14 (power subtleties), WPR15 (starts), WPR16 (failure), WPR17 (surfaces). Mode: reuse and check, then bounded read of four named windows (WPR1, WPR2). Owner file: this one. It was created as a new file because ORV has no kit card and no world folder under `docs/worlds/`; the follow-up links it needs are in section 12 (WPR3, WPR28). Review state: drafted, source-spot-checked (12 claims opened by the coordinator, section 9). Not rules-reconciled with a build, not built, not browser-verified, not director-accepted (WPR21).

Sealed secrets: ORV is a public franchise, so none of this is sealed. Late-story material is tagged [S] (WPR8 does not require it; this is the requested spoiler-light convention).

## 1. What the repo already has, and ORV's tier

ORV is not on the world core kit card list (`docs/worlds/WORLD_CORE_KIT_2026-10-14.md` has no ORV card; no ORV file exists in `docs/worlds/`). Tier by evidence: research-heavy, design-light, no world pack.

| Owner (all private under `docs/research/novels/`, gitignored, except where noted) | What it holds | Use here |
|---|---|---|
| `full-book/omniscient-reader/` (WORLD_AND_DAILY_LIFE, POWER_RULES, POWER_DETAIL_LEDGER, PEOPLE_AND_ALIASES, TIMELINE, SOURCE_BOUNDARIES) | Whole-supplied-edition read (551 chapters, 28 packets); region and institution table through ch551 | Backbone. Reused, not re-read (WPR2) |
| `omniscient-reader/SYSTEMS_DEEP_DIVE_2026-10-10.md` plus `readers-2026-10-10/` (SCENARIOS, CONSTELLATIONS_NEBULAS_STIGMAS, ECONOMY_STORIES_PROBABILITY, LATE_VOLUMES, WIKI_CROSSCHECK, FANFIC_SURVEY) | Engine rules O1-O13, scenario cards, constellation/nebula/stigma tables, stat price curve, start list S1-S7, gaps G1-G6 | Read in full (deep dive, economy, late volumes, constellations table); SCENARIOS and WIKI files only skimmed |
| `omniscient-reader/INTAKE.md`, `WORLD_AUDIT.md`, `REFINEMENT_CASES.md`, `BRIEF.md` | Opening-slice audit (first 12 chapters), earlier cases | Pointers only |
| Tracked: `docs/worlds/BOOK_WORLD_ENTRY_MATRIX.md` (row ORV), `docs/worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md` (BF45), `docs/CHEATS_BY_WORLD.md`, `docs/CHEAT_COSMOLOGY.md`, `docs/TIMELINES_AND_DIVERGENCE.md` | Entry row, feature gap BF45, cheat rows | Cited by name; not re-read this pass |

Named gaps this pass targeted (from the deep dive's G4 and from the request): the Dokkaebi Bag catalog and membership, the stream-contract bargain, sponsor contract terms, the Bureau and its penalties, Seoul station kingdoms, flags, prophets and rumors, post-scenario patronage and Bureau stress. Not targeted because already well covered: stat price curve, scenario cards 1-99, constellation and nebula tables, regression world lines.

## 2. Manifest, edition and budget (WPR1, WPR7, AU1-AU15)

Edition: English illustrated compilation by singNsong (Calibre IDs 18 and 44; both EPUBs have the same MD5 `90019830e04c7d05ae5ca74cbd4a471a`, so they are one file). Read path: `/Users/weiwei/Calibre Library/singNsong/Omniscient Reader's Viewpoint (44)/Omniscient Reader's Viewpoint - singNsong.epub` (the path in `LOCAL_LIBRARY.md` points at `/Users/weiwei/Sync/CalibreLibrary/...`, which does not exist on this machine; WPR2 stale-path lesson repeated). Caveat carried from SOURCE_BOUNDARIES: user-supplied compilation, provenance and translation fidelity unverified, mtl flag false. Two translation styles meet around ch370. Side stories after ch551 are not in the file.

Extraction: a deterministic script (zip read only, `python3 -I`) pulled `chap_NNNNN.xhtml` members to non-empty text blocks. Locators below are `chN:bM`, where `bM` counts non-empty text blocks in chapter N including the title line as b1. They are not the same numbering as the dossier's `ORV-NNN-NN` claim IDs or its `b` blocks, so do not mix them.

| Window | Chapters | Words (whitespace count) | Label | Why chosen | Reader | Output |
|---|---|---|---|---|---|---|
| W1 | ch14, ch15, ch36, ch75, ch318 | 11,356 | Mixed: whole chapters, not consecutive | Highest census hits for Bag, shop, trade, contract; fills G4 | haiku, 1 call | 42 rows |
| W2 | ch44, ch45, ch47, ch51, ch52 | 10,853 | Mixed: whole chapters, not consecutive | Station kings, flags, rumors, prophets census | haiku, 1 call | 46 rows |
| W3 | ch91, ch98, ch100, ch109, ch110 | 10,170 | Mixed: whole chapters, not consecutive | Bureau penalties, sponsor contract, sponsor selection, store membership | haiku, 1 call | 38 rows |
| W4 | ch259, ch402, ch495, ch523 | 11,346 | Mixed: whole chapters, not consecutive | Clock census (ch259), late penalties and Bureau stress, epilogue patronage | haiku, 1 call | 38 rows |
| Total | 20 chapters of 551 | 43,725 | | | 4 readers | |

Census: a keyword census (Bag, shop, trade, rumor, group/station, sponsor/contract, penalty, clock) ran over all 551 chapters (about 1.27M whitespace words; average chapter about 2,300). The census only picked windows. It is not reading, and the 531 unwindowed chapters count as unread by this pass (they were read by the earlier dossier, which is reused).

Budget: coordinator plus 4 haiku readers, one at a time, 0 repairs; 4 of the 4-reader allowance, 43,725 of about 48,000 words, each window at most 12,000 words. Each reader wrote one file and returned a short note, 6 or fewer tool uses. Reader tier was set to haiku in the first brief (WPR6). Claims the coordinator did not open are tagged "reader-only" in the tables below. Reader output files are scratch (session scratchpad), not saved in the repo; the tables below are the durable record.

## 3. Places and institutions (WPR9, WPR11)

Labels: SHOWN (scene or system message), STATED (a named speaker), INFERRED, PROPOSED. "Verified" means the coordinator opened the locator (section 9).

| Institution | What it is and does | Cost and units | Access and gate | Tiers or variants | Hazards, limits, loopholes | Locator, label |
|---|---|---|---|---|---|---|
| Dokkaebi Bag (the shop) | In-world storefront run through a dokkaebi's channel; catalog, search, cart, item sheets | Free search 5 per day, then 100 C per extra search; item prices from 800 C (a bundle of two field supplies, 4+4 units) to 1,500,000 C (SS-rated heart), 1,000,000 C (rare eyes); starter pack 2,500 C | Usable while the dokkaebi's channel is open; Bihyung claimed only sponsored incarnations may buy, Dokja replied no rule says so and Bihyung then allowed it | Gold member 5,000 C; platinum member 100,000 C (platinum is not normally open to incarnations, executives checked it) | No refunds after purchase (STATED); stock shown as a count or "?"; rare items sell out in minutes; dokkaebi steers buyers to items it likes (a sword technique listed at 8,000 C offered at 4,000 C) | ch14:b17-b22, b46-b48, b60-b73, b82-b94, SHOWN/STATED, verified for access, search quota, no refund; ch36:b35-b41, ch109:b98-b105 verified for gold/platinum |
| Gold-tier listings | Extra listings appear after the gold upgrade | Behind the Scenes Contract 10,000 C list price; 10 intermediate Magic Power Recovery potions 5,000 C; Recluse's Cloak 3,000 C (5 uses, 20 minutes absolute stealth) | Gold members | Cloak fails against Absolute Senses Lv.6 or higher | Coins are spent on the upgrade itself | ch36:b39-b49 and ch51:b96-b98 SHOWN, verified |
| General Exchange | Player-to-player sales listing with sales history | Items sold in C (a dragon's scales 8,000 C; bones 5,000 C then 22,222 C) | Anyone with a listed item | | Underpriced sales happen; Dokja says 99,999 C would have been better | ch75:b71-b86, SHOWN, reader-only |
| Auction house (Context of the Constellations, city of constellations) | Auction for items hard to find in the Bag or Exchange | Opening bid 500,000 C; bids reached 3,000,000 C | Open to attendees; protected by a constellation's legal authority | Rare-material and special-item lots | Contributors may not bid on their own lots; no refund on sold lots; dokkaebi loans exist for big bids (terms not in window) | ch318:b2-b4, b35-b84, b90, b108, b113-b114, SHOWN/STATED, reader-only |
| Temporary Pledge (item) | Short contract, nine clauses, no sponsor effect, ends with the sub scenario | Item cost not in window | Any two parties using the item | | Breach destroys the body; information swaps can be checked with a lie-detecting skill | ch75:b95-b123, STATED, reader-only |
| Stream contract (channel) | Incarnation streams on one dokkaebi's channel and splits donations | Default 5:5 split, channel fee dropped; Dokja forced 10:0 (he keeps the donations; Bihyung gets only the commission); Bihyung offered 7:3 then 8:2 first; 5,000 C down payment to Dokja | Dokkaebi and a sponsorless incarnation | | No sponsor until all scenarios end or death; active only on that channel; breach means destruction under Star Stream law | ch15:b92-b132, SHOWN, verified |
| Bureau of dokkaebis (Star Stream law enforcement) | Receives dokkaebi reports, discusses, can arrest dokkaebi | Probability debt owed by a punished dokkaebi | Executives act on a severe probability breach | Punishments in three steps (first/second not distinguished in window); third is described as worse than destruction | Probability conformity complaint fails without a regulation breach; no precedent for an incarnation signing a stream contract or using the Bag; dokkaebi cannot kill an incarnation and the reverse, per one dokkaebi's claim | ch91:b6-b23, b113-b118; ch109:b2-b6, b24-b33, b58-b60, reader-only (b-ranges) |
| Dokkaebi Solo Meeting (platinum privilege) | Private 20-minute meeting with one dokkaebi in a dome | Free of fee; 500 C per injury inflicted | Platinum members, executives approve | | Injury fee exposes the dokkaebi's "no one can hurt anyone" claim (see C3); 124 hits cost 62,000 C | ch109:b108-b119; ch110:b6-b47, b117-b118, SHOWN, verified for 500 C and 124 hits |
| Seoul station kingdoms (Scenario 4 area) | A station is held by planting a flag in a flagpole; the representative carries the flag | White flag: control after 5 minutes without a snatch; king title needs reputation, not just the flag; 12 days to take the target station or the group dies | Representative only may carry the flag | White, red, navy, brown flags | Capture absorbs the loser, who may die depending on the capturer; death of representative passes the flag to first holder; scenario start drops station safe borders | ch44:b2-b7, b80-b82 verified; ch44:b97-b109, ch47:b14-b20, STATED/SHOWN reader-only |
| King's Road (hidden scenario, Dokja's path) | Take 10 stations in 10 days, at least one per day, for the king attribute | Reward: attribute of a king | Offered to the holder who qualifies | Difficulty A | Miss a day and the group dies | ch47:b25-b32 SHOWN, verified |
| Prophet circle (neutral meeting station) | Partial readers of the in-world novel meet at an unoccupied station under a truce | none | Readers who stopped at different points (48 knew the future, 12 apostles, 53 prophets at one time, 36 in the chat, by reader report) | Apostles vs ordinary prophets | Infighting; a tip from an early-stop reader looked like bait (INFERRED by Dokja) | ch51:b19-b24, b58; ch52:b81-b85, b115-b116, b188-b195, STATED/INFERRED, reader-only |
| Context of the Constellations (transit city), Eden, Olympus markets | Portal city, auctions, recruitment, training | | | | Covered by the dossier (WORLD_AND_DAILY_LIFE); only the auction was re-read | see dossier |

Not re-read but already in the dossier: Chungmuro Landlord Alliance, Geumho Station, Theatre Dungeon, Paradise and Dark Castle refuge, Syswitz Factory, First Murim, Salvation Church, Peace Land, Oz, Next City.

Not found in the windows (WPR23): a general guild registry, a public ranking board, and a tax authority other than station levies. Searched where: W1-W4 plus the census; a ranking "board" is not a keyword hit in the 20 chapters, though nebula votes and candidate selection are in the dossier. The census did not search for these as terms. They are unverified absences, not confirmed ones.

## 4. Person-to-person roles (WPR10)

| Role pair | What each side gives and owes | Terms and costs | How they meet | What a mistake or breach does | Locator, label |
|---|---|---|---|---|---|
| Dokkaebi and unsponsored incarnation (Bihyung and Dokja) | Dokkaebi gives channel, Bag access, rule guidance, protection from other dokkaebi; incarnation gives audience, content, donations | Stream contract (Section 3), 5,000 C down payment | The dokkaebi is assigned to the incarnation's area and opens the channel | Breach destroys both parties; Bihyung's channel lost nearly a third of subscribers on drama and he was nearly destroyed in the Bureau | ch15; ch109:b43-b46, b58-b60, verified (ch15) |
| Constellation and incarnation (sponsor bond) | Constellation gives stigmas, coins, attention; incarnation gives performance, loyalty | Offers arrive under modifiers (existing O3); coins from sponsors observed here: 100 to 200 C gifts, 5,000 C and 30,000 C during a selection | Sponsor Selection: unsigned incarnations get stars above their heads per interested constellation and pick one | Sponsor coins can carry penalties: speed, attack and defense penalties each came with a 500 C sponsorship | ch100:b5-b12, b43-b71, b129-b141, verified (penalty lines) |
| Mortal "sponsor" of a ward (Dokja and Yoosung) | Mortal can sponsor and encourage only; most constellation functions are blocked | Price not stated in window | Contract bought from the dokkaebi | Signing blocks a contract with another constellation (STATED) | ch98:b56-b76 SHOWN, verified |
| Co-sponsor and property holder (Dokja and Gong Pildu, via Defense Master) | Dokja gains command authority over the named incarnation, up to 10 times a day, duration 5 years, no auto-renewal; constellation requires the incarnation survives and grows | Behind the Scenes Contract 10,000 C list price | Contract bought in the Bag, then the constellation adds a condition and the buyer accepts | | ch36:b108-b123 SHOWN, verified |
| Station king and member | King promises outside protection, not inner disputes; brown flag lets the representative restrict a member under pain of death | | By conquest, recruitment or defection | Defectors become wanderers; the Landlord Alliance's taxes caused defections | ch44:b44-b60, ch52:b20-b31, reader-only |
| Deputy | Representative hands part of the authority, including punishment, to a member | | | Deputy punishments can be harsh | ch47:b73-b89, reader-only |
| Prophet and informant | Information exchange and bait | | A prophet chat or a meeting station | A tip may be a trap | ch51, ch52 reader-only |
| Informal patron | A constellation pays a dokkaebi's channel monthly; Dokja the constellation pays Bihyung's channel by monthly patronage [S epilogue] | Amount not in window | Standing arrangement | Patronage ends if the patron stops | ch523:b69-b71 SHOWN, verified |
| Dokkaebi as broker | Bihyung sells Dokja the sponsor contract, steers him to profitable items, and in the epilogue presents a "special sponsorship opportunity" that hides a 3,500 C deduction in small print [S] | 3,500 C per sponsored item | Message window | Fine print makes the deduction easy to miss | ch14:b89-b90; ch523:b33-b37, verified (ch523) |

Companion party roles in the flag period (sentry, operations, area-denial turrets, shields) are reader-only in W2 and match the dossier's people table; I did not re-read them for role structure beyond section 3.

## 5. Money and information (WPR12)

| Item | Finding | Locator, label |
|---|---|---|
| Single currency, many sinks | Coins buy stats, shop items, memberships, contracts, search queries, penalty fees | ch14, ch36, ch110, SHOWN |
| Memberships | Gold 5,000 C; platinum 100,000 C; platinum unlocks a meeting right | ch36:b35-b38; ch109:b103-b105, verified |
| Search is metered | 5 free per day, then 100 C | ch14:b47-b48, verified |
| Prices span five orders | 100 C search to 1,500,000 C heart; auction 500,000 to 3,000,000 C | ch14:b60-b73, ch318, SHOWN |
| Donations flow through the dokkaebi | Channel splits donations; a sponsorless incarnation costs the constellation a heavy fee, which is Dokja's bargaining basis | ch15:b107-b111, verified |
| Sponsor coins are not free gifts | They can come bundled with penalties on the receiver | ch100:b129-b141, verified |
| Fame pays | 5,000 C came from a song spreading the protagonist's fame [S epilogue] | ch523:b65-b67, SHOWN |
| Information as a currency | Rumors spread regardless of truth (a rumors-expert attribute); information swaps for protection under a pledge; a station alliance offer promised hidden secrets with no proof | ch45:b26-b30, b74-b84; ch75:b114-b123, STATED, reader-only |
| Knowledge is perishable and costs probability [S] | In the epilogue, spoiling or leaking predictions burns probability and breaks rules | ch523:b55-b60, b128-b130, STATED, reader-only |
| Coins become probability [S] | Coin donations feed dokkaebi's probability; suspending donations to a channel strained its operator and harmed kings whose probability ran out | ch495:b62-b63, b66-b72, b89-b92, SHOWN/STATED, reader-only |
| Coin-farm exploitation, food prices | In the dossier and wiki; not re-read | dossier |

## 6. Time and rhythm (WPR13)

| Clock | What it does | Locator, label |
|---|---|---|
| Scenario timer with death clause | 30 minutes (scenario 1), 20 minutes (sub), 10 days (King's Road), 12 days (target station) | ch44:b97-b109, ch47:b30, reader-only except ch47 |
| White flag timer | 5 minutes, resets on snatch | ch44:b5-b6, verified |
| Sponsor Selection countdown | About 3 minutes in the reader's count; window ends with a subscriber threshold of 10,000 that Dokja promised to meet | ch100:b40, b43, b76, verified (threshold) |
| Dokkaebi store only while channel is open | The shop is gated by streaming | ch14:b20-b22, verified |
| Search quota | Resets daily | ch14:b47, verified |
| Contract durations | Co-sponsor contract 5 years with no renewal; stream contract until all scenarios end | ch36:b123; ch15:b92, verified |
| Settlement delay | A scenario error delays compensation a day or two | ch110:b122-b123, verified |
| Helper recruitment | 10 minutes to recruit up to six helpers for the Demon King Selection; roles are tank, two melee, two ranged, supporter, all-rounder | ch259:b100-b102, b140-b141, verified |
| Message rate | One use per midday for a linked message (reader-only) | ch259:b119-b138 |
| Skipping scenarios | Skipping main scenarios loses probability and damages party status (stated by a character; size unknown) | ch259:b68-b70, reader-only |
| Chaos Points [S] | Late-story counter that rises with same-camp killings; a threshold of 10 more wakes the calamity | ch402, reader-only |

## 7. Power and growth subtleties (WPR14)

| Finding | Locator, label |
|---|---|
| Sponsor coin penalties: each 500 C sponsorship accompanied a speed, attack (halved), or defense penalty | ch100:b129-b141, verified |
| Command authority over a ward is capped at 10 uses a day and 5 years | ch36:b116, b123, verified |
| Signing a stream contract bars choosing a sponsor; signing a mortal sponsor contract bars other constellations | ch15:b92; ch98:b66-b67, verified |
| Non-constellation sponsors keep only two functions (sponsor, encourage) | ch98:b72-b76, verified |
| Overwrite beyond mastery loses part of the Story [S] | ch523:b160-b162, reader-only |
| Information-reading skills block on non-characters or those who read too far | ch45, ch47, ch52, reader-only |
| Probability storm erases a dokkaebi that defies the flow | ch109:b30-b33, reader-only |
| A flag-holder's punishment power and a brown flag's life-linked restriction are the strongest social tools, and Dokja avoids using them | ch44:b83-b87; ch52:b20-b31, reader-only |
| Same-camp killing boosts the corrupted angel, and the final-calamity trigger [S] | ch402:b109-b112, reader-only |

## 8. Starts, failure and surfaces (WPR15-WPR17)

Starts: the windows add to start S1-S7 (existing) that a sponsorless, subscribed start is a distinct start. The Dokja entry is "sponsorless streamer with a dokkaebi contract" and not "sponsored incarnation". A player in the Seoul flag period meets stations, representatives and prophets with partial, stale or planted knowledge (ch45, ch51, ch52). Entry of a non-reader has no new evidence in the windows.

Failure: station failure kills the whole group (ch44:b97-b109 reader-only); missing a daily station in King's Road kills the group (ch47:b32 verified); breaking a stream contract destroys both parties (ch15:b99 verified); an injury in a solo meeting costs coins, not life (ch110:b25-b26 verified); a dokkaebi in breach faces Bureau steps up to a third punishment worse than destruction (ch109 reader-only); a bounty failure outcome was not in the window.

Surfaces: system messages in square brackets announce flag status, coins consumed, member upgrades, contract completion and coin sponsorship; the Bag shows stock counts, item sheets and a cart; the channel shows a subscriber count (9,999 at the cap); the Character List skill shows sponsor, attributes and evaluation, and blocks on non-characters (ch45, ch52 reader-only). A fine-print line hid a 3,500 C deduction in a "special sponsorship" window (ch523:b37, verified). An idle player misses the unread-message pile (47 hours of unread messages in ch259, reader-only) and the day-bound quotas.

## 9. Source spot-check (WPR18, WPR19)

The coordinator opened the locator text in the extracted windows (not a reader summary) for these 12 claims. "Confirmed" means the text says it; "corrected" means the reader or repo needed a fix.

| # | Claim | Result |
|---|---|---|
| 1 | Bag access: Bihyung says only sponsored users may use it; Dokja says no rule bars sponsorless users; use only while the channel is open | Confirmed, ch14:b17-b22 |
| 2 | Free search 5 per day, 100 C each after; no refunds | Confirmed, ch14:b47-b48, b94 |
| 3 | Stream contract: no sponsor until scenarios end or death; only on this channel; destruction on breach; 5:5 default; Dokja insists on 10:0; 5,000 C down payment | Confirmed, ch15:b92-b132. Reader flagged the 10:0 direction as ambiguous: the text shows Dokja refuses to pay Bihyung "a single penny", so Dokja keeps the donations and Bihyung gets commission only |
| 4 | Gold membership 5,000 C | Confirmed, ch36:b35-b38 |
| 5 | Behind the Scenes Contract price | Corrected. List price is 10,000 C (ch36:b40); the "15,000 coins consumed" line (b47) is contract plus potions (5,000). The repo's ECONOMY reader says 15,000 for the contract |
| 6 | Co-sponsor terms: command 10 times a day, 5 years, no auto-renewal | Confirmed, ch36:b116, b123 |
| 7 | Sponsor Selection subscriber threshold 10,000, channel stuck at 9,999 and capped at 9,999 viewers | Confirmed, ch100:b40, b76, b122-b123 |
| 8 | Sponsor penalty lines carry a 500 C sponsorship each | Confirmed, ch100:b131-b141 |
| 9 | Platinum membership 100,000 C | Confirmed, ch109:b103-b105 (repo had this as WIKI only) |
| 10 | Solo meeting injury fee 500 C, 124 hits | Confirmed, ch110:b25-b26, b117-b118 (coins fell 205,902 to 143,902, which is 62,000) |
| 11 | White flag 5-minute timer; reputation too low for king title; King's Road 10 stations in 10 days | Confirmed, ch44:b4-b6, b81; ch47:b25-b32 |
| 12 | Demon King Selection: team of seven, roles, 10 minutes to recruit six helpers; epilogue 3,500 C item deduction and 5,000 C fame income | Confirmed, ch259:b100-b102, b140-b141; ch523:b33-b37, b65-b67 |

Also corrected: the W3 reader said a sponsor adds 5,000 C "at signing" in ch98. The text shows the system message "5,000 coins have been sponsored" right after two constellation reactions, with no named giver (ch98:b77-b79). I report it as an unattributed sponsorship, not a contract term. The W4 reader said Yoo Joonghyuk paid for a secret line in ch523:b125; I did not open that locator, so it stays reader-only and is not used above.

Unchecked, reader-only: the rows citing ch45 Rumours Expert, ch51 prophet counts, ch52 brown flag restriction, ch75 Temporary Pledge and Exchange, ch91 Bureau lines, ch109 Executive Branch and Redemption Code, ch259 time limits and messaging, ch318 auction, ch402 and ch495 [S]. They are marked reader-only wherever used and should be treated as unverified until opened.

## 10. Engine facts (WPR5): default, dial, reason, exceptions

| Id | Default | Dial | In-world reason and cost | Exceptions the text shows |
|---|---|---|---|---|
| EF1 | A shop exists only while its operator is broadcasting | Operator availability, region, channel health | The Bag runs through a dokkaebi's channel; a channel cut or error shuts the shop (ch14:b20-b22, b35) | Auction house and Exchange run separately (ch75, ch318) |
| EF2 | Information search costs a small metered amount | Daily free quota, coin price per search | 5 free, 100 C each after (ch14:b47) | Skills like future sight cost the body (ch318, reader-only) |
| EF3 | Memberships unlock listings and rights | Tier price, who may buy | Gold 5,000 C, platinum 100,000 C (ch36, ch109) | Incarnations are not normally eligible for platinum; executives checked it (ch109:b105 context) |
| EF4 | Who may buy is set by custom, not a written rule | Operator's goodwill, bargaining | Bihyung's claim failed when Dokja called out the lack of a rule (ch14:b17-b22) | Regulation gaps close over time (ch91, reader-only) |
| EF5 | A contract names parties, scope, duration, exit and penalty | Split ratio, duration, exclusivity, command rights | Stream contract (ch15), co-sponsor contract (ch36), sponsor contract (ch98) | Contracts can be bought rather than offered; the buyer can add conditions through a constellation (ch36:b108) |
| EF6 | Sponsorship has side effects | Penalty type tied to coins sent | Coins arrived with speed, attack and defense penalties (ch100) | Sponsors who bear the incarnation goodwill send plain coins (ch14:b118, ch15:b4) |
| EF7 | Rule-breaking meets a coin or probability bill before a body bill | Severity, who reports | Solo-meeting injury fee in coins (ch110), Bureau probability debt (ch109) | Breach of a stream contract destroys both parties (ch15:b99) |
| EF8 | A territory is held by a flag, on a timer | Flag colour, representative reputation, scenario | 5-minute white flag (ch44); a king needs reputation as well (ch44:b81) | Empty flagpole can be filled by anyone with a flag (ch47, reader-only) |
| EF9 | A group promises protection, not harmony | Leader style, taxes, deputy powers | Chungmuro's no-tax rule (ch44, reader-only) vs a landlord alliance that taxed (ch44) | Brown-flag restriction is life-linked (ch52, reader-only) |
| EF10 | Fame converts to coins, and patronage pays channels | Audience, patron | 5,000 C from a song; monthly patronage [S] (ch523) | A suspended-donation Bureau action starves channels [S] (ch495, reader-only) |
| EF11 | Foreknowledge is dated, partial and re-priced | Reader depth, divergence, probability cost | Prophets know different amounts (ch51-52); leaks cost probability [S] (ch523) | Rumour attributes spread falsehood regardless of truth (ch45) |

## 11. Contradictions (WPR20), both sides kept

| Id | Reading A | Reading B | Status and chosen reading |
|---|---|---|---|
| C1 | Repo ECONOMY reader: Behind the Scenes Contract 15,000 C (ch36) | Text: list price 10,000 C; 15,000 C consumed is contract plus potions (ch36:b40-b47) | Source supersedes. Mark the repo line stale in the private reader file; pack should use 10,000 |
| C2 | Repo ECONOMY reader: Platinum membership "WIKI" 100,000 C | Text shows 100,000 C consumed for platinum (ch109:b103-b105) | Upgrade WIKI to SHOWN |
| C3 | A dokkaebi says no one can hurt anyone in a solo meeting (ch109 reader-only) | Text shows an injury penalty in coins per hit (ch110:b25-b26) | Both readings kept. The claim is a protection promise; the fee is how it is enforced. Both cited |
| C4 | Bihyung: only sponsored incarnations may use the Bag (ch14:b17) | Dokja: no rule says so; Bihyung agrees to open it (ch14:b18-b22) | Kept as custom plus a bargaining loophole, EF4 |
| C5 | Deep dive O2 says coins are the single currency | Auction lots and the Temporary Pledge barter listing take items, not coins (ch15:b65-b70, ch75) | Coins are the default; barter listings exist (reader-only for ch15) |
| C6 | Deep dive: scenario 1 sponsorship is "contract screen" with refusal | Text: refusing a sponsor draws a Sponsor Selection, a subscriber threshold and a dispute about penalties when no sponsor is chosen (ch100) | Refusal has a later cost beyond attention. Not a conflict, an extension |

## 12. Gaps, follow-ups and files needing links

Open gaps with exact windows (unread by this pass; the dossier read them but not for these questions):

| Id | Gap | Exact window to read next |
|---|---|---|
| G1 | Bag growth and attribute-reset box prices, loan terms, Dokkaebi Bag catalog beyond ch14 | ch14 (second half), ch16-17, ch24, ch50, ch195-ch198 (Syswitz Factory markets, shop census hits) |
| G2 | Context of the Constellations transit city: auction rules, nebula recruitment | ch314-ch319 consecutive (about 11,000 words) |
| G3 | Sponsor contract price and what "encourage" does | ch98 b1-b80 reread for the price, plus ch43 |
| G4 | Bureau punishment steps first and second, redemption code lifting | ch109 and ch110 reread with the Bureau only; plus ch486 (scenario rewrite) |
| G5 | Rankings, guilds and nebula vote procedure (searched, not found in W1-W4) | ch151 (nebula founding), ch224-ch225, ch328 (Olympus vote) |
| G6 | Non-reader entry and coin-farm economy in the early subway | ch17-ch19, ch24 |
| G7 | Demon King Selection time limit and probability loss from skipping | ch259 and ch221 |
| G8 | Side stories after ch551 and the wiki's claims | Not in the supplied edition |

Files needing links (this run touched nothing else, WPR3 and WPR28):

- `docs/worlds/BOOK_WORLD_ENTRY_MATRIX.md` (ORV row) and `docs/worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md` (BF45): link this file as the institutions and roles owner.
- `docs/worlds/WORLD_CORE_KIT_2026-10-14.md`: note that ORV has no card and point here if a card is created.
- `docs/CHEATS_BY_WORLD.md#omniscient-reader` and `docs/CHEAT_COSMOLOGY.md`: patron rows can cite EF5-EF6.
- `docs/research/novels/omniscient-reader/SYSTEMS_DEEP_DIVE_2026-10-10.md` and `readers-2026-10-10/ECONOMY_STORIES_PROBABILITY.md` (private): correct the 15,000 C line (C1) and upgrade platinum to SHOWN (C2).
- `docs/research/novels/full-book/omniscient-reader/WORLD_AND_DAILY_LIFE.md` (private): link here for Bag, stream contract and station-flag details.
- `docs/RULES_INDEX.md`, `docs/WORLD_PASS_RULES.md` lessons section: add the lessons in section 14.

## 13. More-to-consider round (WPR24)

Findings in codes: `F` findings, `A` actions.

| Code | Angle | Class | Detail |
|---|---|---|---|
| F1 | The shop is a channel, so the Bag's hours and stock follow the dokkaebi's broadcast state | ACT NOW | Recorded in EF1. A pack should tie shop access to a channel object, not to a town |
| F2 | The streamer contract is the real entry gate for a sponsorless start, with its own bargaining minigame | ACT NOW | Recorded in sections 3, 4 and EF5. Dials: split, down payment, exclusivity |
| F3 | Sponsor coins can be hostile, so the receive screen needs a "penalty attached" field | ACT NOW | EF6. A coin gift is not always good news |
| F4 | A fine-print line hides a 3,500 C deduction (ch523) | ACCOUNT FOR NOW | Any surface for sponsor or shop offers should show the total cost; a hidden-cost offer is a feature the world can use, not the UI (UI rules UR1-UR49 are not re-read here) |
| F5 | Memberships gate rights, not just items (gold unlocks listings, platinum unlocks a meeting right) | ACCOUNT FOR NOW | Model a membership as a rights bundle (WPR31), with the price as data |
| F6 | The 10,000-subscriber promise in ch100 shows a contract made by a promise to an audience | LATER/DELEGATE | Level C2 (single-world loop); effort: one reader on ch98-ch101 plus design note; done check: a cited audience-promise mechanism with penalty |
| F7 | Station kingdoms are a territory, tax and defection system in miniature | LATER/DELEGATE | Level C2; effort: one sonnet synthesis from W2 plus dossier; done check: a flag, a representative role, a defection path, each with default, dial and reason |
| F8 | Knowledge as perishable value: prophets hold different amounts and a leak costs probability [S] | LATER/DELEGATE | Level C2; effort: one reader on ch51-ch53 consecutively plus ch523; done check: a dated-knowledge rule consistent with TIMELINES_AND_DIVERGENCE |
| F9 | The Bureau is an enforcer with its own debt and fall | LATER/DELEGATE | Level C3; effort: one reader on ch109-ch110 and ch486; done check: a three-step punishment ladder with source for each step |
| F10 | Run the same pass for the transit city (G2) and the Syswitz markets (G1) | LATER/DELEGATE | Level C2; effort: two readers, about 11,000 words each; done check: the Section 3 and 5 tables extended with rows from ch195-ch198 and ch314-ch319 |

Suggestions (short, separate; not reasons to stop): a repo-wide check that private reader notes carry the corrected figures; a check whether the entry matrix should split "reader route" into depth tiers.

## 14. Ranked next list (WPR25) and lessons (WPR26)

Ranked by readiness (source in hand, existing owners, size of the named gap), proposals only; Weibao's ordering overrides:

1. ORV part 2: G2 transit city and auction (ch314-ch319) plus G1 markets (ch195-ch198), budget 2 haiku readers, about 22,000 words. Source is local and the dossier gives an index.
2. ORV part 3: G4 and G5, Bureau steps and nebula vote procedure, budget 2 haiku readers, about 20,000 words.
3. One other world with a deep dive but no institutions-and-roles file (candidates by existing material: Lord of the Mysteries, Shadow Slave), 4 readers, 48,000 words. Choice rests on Weibao's canon-first order in PROJECT.md, not on this pass.

Lessons to fold into `docs/WORLD_PASS_RULES.md` (not edited here, WPR26):

- Verify cost figures by reading the consumed-coin line and its neighbors, because a bundled purchase can make a single total look like the item price (ch36: 15,000 C was contract plus potions).
- A haiku reader can flag its own ambiguity (the 10:0 split) and gets the direction right only if the coordinator reads the adjacent lines; keep the coordinator spot-check on any "ambiguous" flag.
- A reader may attribute a gift to the wrong cause (ch98 sponsor coins); spot-check money rows first.
- A census by keyword picks windows efficiently but 20 of 551 chapters is a sample; say so in the manifest.
- Two Calibre IDs can hold the identical file; hash before counting them as separate editions.

## 15. Review state (WPR21)

Highest state reached: source-spot-checked (12 claims plus two reader errors corrected). Reader-only rows are unverified. Not rules-reconciled with a build; codes touched: WPR1-WPR32, AU1-AU15, AD36 (lean verification, no tests run), AD38 and WPR5 (defaults, dials, reasons), AGENTS sealed secrets (none applicable). No conflict with standing UI direction found, and no UI work was done. Nothing was committed, no npm command was run, and no file outside this one was changed.
