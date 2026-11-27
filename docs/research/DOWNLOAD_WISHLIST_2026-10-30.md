# Download wishlist, 2026-10-30

Proposal, not accepted direction. Weibao: "Make a list of the to be downloads, like the
D&D and similar rulebooks, RR books that would be useful, other stuff and more as well."
Holdings were checked against the Calibre and Source Library catalogues and the Source
Library database on 2026-10-30; the [library index](LIBRARY_INDEX.md) stays the live
holdings answer. "Why" names the consumer in PROJECT.md: the lead-life run, canon-first
worlds (Harry Potter, D&D, book worlds), making systems, crossings between worlds.
Earlier lists this builds on: [Oct 22 candidates](BOOK_CANDIDATES_2026-10-22.md),
[tabletop buying list](tabletop-library-2026-10-14/BUYING_LIST.md),
[deep-dive queue](SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md).

Routes: **A** Anna's member API (50 fast a day, background), **Z** Z-Library (30 a day,
background), **C** Anna's search in Weibao's Chrome then A, **RR** paced Royal Road capture
of free chapters, **PD** public domain (Gutenberg). Files under a few weeks old are often
Z-Library only.

## How Anna's and Z-Library runs use this list (2026-11-04)

Weibao: "make sure wishlist is known by anna and zlib runs". Every Anna's,
Z-Library or Source Library download run follows these steps:

1. **Pick from here.** Run `python3 -I scripts/wishlist_queue.py`, or
   `--grep <text>` or `--json`. Take `open` rows, and recheck `partial` rows
   against the holdings first, because some of their items are already held.
   Titles Weibao names in chat come first, with the current acquisition
   priority below them.
2. **Check holdings** with `scripts/library_coverage.py` and the catalogues
   before spending quota.
3. **Write back.** The receipt names each row's DL code. In the same change,
   update the row here: strike through what is now held (`~~title~~ held
   <date>`), and name what is still wanted with "Still wanted:" or "Next:".
   Then the queue shows the row as closed or partial instead of open.
4. **New wants** get a DL row here, not only a line in the library index.
5. **Before spending Anna's quota**, confirm the VPN is up with the runner's TLS preflight, stop on any non-`not_found` Anna's error instead of falling back to Z-Library, and cap unknown sizes at 150 MB ([AR52-AR55](SOURCE_ACQUISITION_TOOLS.md)).

The [Nov 13 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-13) adds the web-serial reader copy for *Memory’s Flame* and verified series continuations.

The [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11) records the new EPUBs, subtitle files, tabletop references and the account and disk stops. The private candidate list is for edition checks before a later transfer.

## Priority queue for the next resets, 2026-11-08

Weibao: "can we get the cyberpunk rulebooks and stuff? more to consider? We should sort these from low priority to high and more, other aspects and more? More books left on the wishlist?" The Nov 8 run budget was 50 Anna’s fast slots plus 30 Z-Library slots (AR15). On Nov 11 the signed-in Z-Library limit was 10 and all 10 were used. After WARP reconnected on Nov 11, Anna’s download host passed verified TLS preflight and the fast route resumed. The runner takes Anna’s first by MD5 and keeps Z-Library for editions Anna’s lacks (AR53). [WARP follow-up receipt](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11) Tiers run from P1 (next reset) down to P5 (only when a pass needs it). Queue files with ids and md5s are in the gitignored `novels/wave-2026-11-08/`.

| Tier | What | Count | Route | Row |
|---|---|---|---|---|
| P1 | *Cyberpunk RED* core, *CyberGeneration*, *Cyberpunk Version 3.0*, and the three booklets each for *Cyberpunk 2013* and the *Edgerunners Mission Kit* are held | 5 title groups | 2013 player aids extracted. Original Edgerunners maps, tokens, and seven pregens acquired. [Core intake](LIBRARY_INDEX.md#cyberpunk-core-editions-2026-11-09-dl106), [boxed aids](LIBRARY_INDEX.md#cyberpunk-boxed-set-aids-2026-11-09-dl106) | DL106 |
| P1 | English prose coverage beyond the held *Re:Monster* volume 7 compilation. *A Tale of the Secret Saint ZERO* 1-4, *Arifureta* 1-13 and *Arifureta Zero* 1-2 are held | Unknown | The old *Re:Monster* 8-11 candidates are Seven Seas manga. Keep an eye on the Hanashi light novel and track alternate prose compilations by chapter coverage | DL105 |
| P2 | Remaining serial leads: *Markets and Multiverses* (acaswell), *Mimic Me! Within the Eternal Forest* (Rutaria), *The Law of Averages* (mcswazey), *The Flower That Bloomed Nowhere* (Lurina). Continue the sampled light-novel series where a source pass needs more | Unknown | 30 EPUBs held from the latest wave. Checked Z-Library searches found no matching files for these four serials. Use the author pages or an authorized polite capture route | DL107 |
| P3 | Power-system books cited in 16-45 docs each: Mistborn, The Dresden Files, The Kingkiller Chronicle; monster and object starts So I'm a Spider, So What?, Reincarnated as a Sword, Reborn as a Vending Machine; Konosuba 1-17; translated web novels Coiling Dragon, Martial Peak, Release That Witch, Trash of the Count's Family, Return of the Mount Hua Sect, Overgeared (novel) | about 80 with full runs | Z-Library search, Anna's by md5; take first books plus one later book per series before full runs | DL108 |
| P4 | Rulebooks named in the tabletop sweeps: Legend of the Five Rings, Savage Worlds, Genesys, Fabula Ultima, Cortex Prime, Wrath & Glory, Rogue Trader and Stars of Inequity, Swords of the Serpentine, HârnManor; leftovers Dungeon World (retry, not Z-Library 2623177), Microscope, Ptolus 2006, PF1 Advanced Class Guide and Occult Adventures | about 15 | Browser search on Anna's by a haiku agent, then md5 | DL109 |
| P5 | Low: manga runs (One Piece, My Hero Academia, Hunter x Hunter, Kaiju No. 8, World Trigger, Mob Psycho 100, Undead Unluck, Kagurabachi). Weibao 2026-11-08: "if manga availible in big chunk form annas or zlib we can get too"; the 2026-11-08 search found no big chunks for these (MC10), so they go to the manga governor queue, not A/Z quota; very large PDFs (Wanderhome 178 MB, Guide to Glorantha 736/790 MB); Stars Without Number 2010 original; nonfiction (DL31, DL33); rows waiting on releases (DL5, DL6, Mark of the Fool 11, Butler to a Core Lord 2) recheck monthly | n/a | Governor queue; size budget; monthly recheck | DL110 |

Routes that spend no quota and can run while A/Z are at zero: free SRDs (DL72-DL74, DL94), RR captures through the polite transport, the Fanren Simulator capture (chapters 30-31 and 42-184 unheld; its pack stays thin until then, `audits/BOOK_WORLD_GAPS_2026-11-03.md`), and Re:Zero web-novel arc 7 chapter 63.

### Fiction gap and source check, 2026-11-11

Checked the live Source Library and both catalogues for selected fiction from
the queue, then compared EPUB headings or spine entries with the author,
translator or publisher listings where the boundary mattered (AR36b, AR56–AR59).
Provider records below are edition candidates. Searches used metadata only.

| Ref | Gap or candidate | Source and next check |
|---|---|---|
| F1 | **The Wandering Inn, book 20, *Memory’s Flame*.** Local record `00e31aa0d4de` is Tielle St. Clare’s same-title book, confirmed by its embedded EPUB package. The recorded pirateaba run reaches book 19. | The [author’s chapter map](https://wanderinginn.com/table-of-contents/) puts book 20 at 7.56–7.62, three interludes and Solstice parts 1–9 (19 entries). The uncollected web serial then starts at 8.00. The [author’s book page](https://wanderinginn.com/book/memorys-flame/) links the audiobook. No matching pirateaba EPUB surfaced in the scoped Z-Library search. **2026-11-13:** The matching 19 web chapters are held. No retail ebook was located. [Receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-13). |
| F2 | **Ghostsong.** The current retail ebook is still missing from checked holdings. | The [official store](https://store.wanderinginn.com/products/ghostsong) identifies the 2025 edition as ISBN 9781961108103 / ASIN B0FQB6S8D2. Z-Library `25947626:570ed9` is labeled a 2023 Patreon draft in its detailed metadata. The other matching hit is labeled a preview. **Nov. 21:** Exact ISBN and ASIN rechecks found no retail download. [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). |
| F3 | **Trash of the Count’s Family** (DL114). The Part I EPUB’s spine contains a cover and the 776 chapter entries, ending at Part I chapter 776. The held official *Lout* books use different chapter divisions. | Eat Apple Pies lists intervening side stories in its [index](https://eatapplepies.com/trash-of-the-counts-family/tcf-table-of-contents/), hosts [Part II chapter 1](https://eatapplepies.com/tcf2-1/), and shows Part II chapter 438 on its [latest posts](https://eatapplepies.com/). The formal index trails the posts. Confirm an ordered chapter manifest and count before any capture. |
| F4 | **Shadow Slave.** Four on-disk EPUBs cover chapters 1–3000 with contiguous detected headings. | [Webnovel’s catalogue](https://www.webnovel.com/book/22196546206090805/catalog) lists chapters 3001–3242 beyond that, with volume 13 starting at 3161. The scoped Z-Library volume 12 search returned earlier editions. Chapter access and a matching continuation EPUB are unverified. |
| F5 | **The Lost Steersman** by Rosemary Kirstein. Books 1, 2 and 4 are on disk under their individual titles. | The author confirms the [four-book sequence](https://www.rosemarykirstein.com/). [OverDrive lists the ebook](https://lapl.overdrive.com/search/publisherId?query=84952&sortBy=newlyadded). English EPUB candidate `zlibrary:18849127:7d17c8` lists Kirstein as publisher and MD5 `99b216c2f06872f0b138c18d994f25f5`. |
| F6 | **Re:Monster** (DL105). The held volume 7’s spine labels its coverage Days 286–330, with the last entry ending at Day 330. | Look for prose from Day 331 and match the story-day headings. The [Hanashi light-novel catalogue](https://beta.hanashi.media/store/series/remonster/) is an edition reference. English prose beyond the local endpoint remains unresolved. |
| F7 | **Reincarnated as a Sword** (DL115). The live catalogue returned five English light novels and no separate web novel under that title. | The [Japanese original](https://ncode.syosetu.com/novelview/infotop/ncode/n6006cw/) reaches the [main ending](https://ncode.syosetu.com/n6006cw/1310/). The [English translation index](https://www.novelupdates.com/series/i-was-a-sword-when-i-reincarnated/comment-page-5/?grp=3631%2C5608%2C6167%2C11305%2C13070%2C22714%2C22323%2C25323%2C27376%2C37602%2C38114%2C34609%2C56795%2C64031&pg=1) is a lead under *I Was a Sword When I Reincarnated*. Its chapter links and side-story coverage still need verification. The [Seven Seas light novels](https://sevenseasentertainment.com/series/reincarnated-as-a-sword-light-novel/) remain a separate edition for cross-checks. |
| F8 | **Chainsaw Man: Buddy Stories** (DL113). No exact local prose record surfaced. | `zlibrary:25485673:3323d6` matches [VIZ’s](https://www.viz.com/manga-books/novel/chainsaw-man-buddy-stories/product/7517) English 2023 edition by publisher, authors and 184-page metadata. MD5 `7f70db4d748199372516de4a3a4671e2`. |
| F9 | **Code Geass** (DL112, DL116). The current local manga check found chapters 1–26 plus 26.5. | The manga gap remains 27–38 per DL112. Crunchyroll lists English subtitles on both the [first-series opener](https://www.crunchyroll.com/watch/G4VUQ1G55/stage-01---the-day-a-new-demon-was-born) and the [R2 opener](https://www.crunchyroll.com/watch/GPWUK00J0/turn-01---the-day-a-demon-awakens). A standalone subtitle file route remains unverified. |

**DL107 reading sources.** The four titles returned zero exact Source Library
matches. Author-posted routes surfaced for [Markets and Multiverses](https://www.scribblehub.com/series/626709/markets-and-multiverses-a-serial-transmigration-litrpg/),
[The Flower That Bloomed Nowhere](https://www.royalroad.com/fiction/28806/the-flower-that-bloomed-nowhere),
[Mimic Me! Within the Eternal Forest](https://www.royalroad.com/fiction/140716/mimic-mewithin-the-eternal-forest)
and [The Law of Averages](https://www.royalroad.com/fiction/20101/the-law-of-averages).
These are reading links. Capture readiness depends on the existing transport
state and edition coverage. Markets and Flower are the first two I would sample
for cross-world transitions and magic research institutions, respectively.

**New suggestions.** Both returned zero exact Source Library matches.

| Ref | Source | Project use |
|---|---|---|
| O1 | Adrian Tchaikovsky’s [*City of Last Chances*](https://www.bloomsbury.com/ca/city-of-last-chances-9781801108447/). English Head of Zeus EPUB candidate `zlibrary:23687148:8434e3`, MD5 `ef91e70c36cd3d9856bb5f9c9b6d057e`. | City-scale faction play under occupation. The same setting’s [*House of Open Wounds*](https://adriantchaikovsky.com/tyrant-philosophers-series.html) is a follow-up lead for military medicine and institutions. |
| O2 | Hazel Young’s [*Katalepsis*, book one](https://katalepsis.net/table-of-contents/), complete on the author’s site. | A modern occult setting with small-group investigations and relationships. The [author marks book two on indefinite hiatus](https://katalepsis.net/2025/08/15/placid-island-black-infinity-2-1-18/). |

No downloads, purchases or queue changes were made. Local absence is scoped to
the catalogues, checked files and title/author lookups. None of the provider
EPUB candidates was transferred or compared text by text.

### More to consider, 2026-11-08 (MC1-MC10)

| Code | Finding | Disposition |
|---|---|---|
| MC1 | The queue overstated what was left: 26 partial rows were fully held, but only their notes said so, and the queue reads the item cell | ACT NOW (done): closed with "Closed by 2026-11-08 reconcile" after catalogue checks; queue went from 31 open and 59 partial to 19 and 46 |
| MC2 | Earlier scouts named about 70 books and rulebooks that no download wave picked up, because the wishlist only took rows written into it | ACT NOW (done): P2-P5 above and DL106-DL110. ACCOUNT FOR NOW: a scout that names an unheld source adds a DL row in the same change (run procedure step 4 already says so; the scouts skipped it) |
| MC3 | Cyberpunk RED core is on neither Anna's nor Z-Library (Anna's three query variants; one Z-Library EPUB titled "cpr corebook cyberpunk red" by an unknown uploader is queued and needs checking on arrival). The Jumpstart Kit has the core resolution rules; Black Chrome and Danger Gal cover gear and fixers | ACCOUNT FOR NOW: buying the core is Weibao's call; until then, the scout's Humanity and therapy questions use Shadowrun 6e plus the Jumpstart Kit |
| MC4 | Shadowrun is the deeper cyberpunk rules source on hand: the 6e core plus its four core supplements cover magic, combat, rigging and augmentation, and Essence loss is the scout's second hard-end precedent | ACCOUNT FOR NOW: a cyberpunk world pass reads SR6 for mechanisms and Cyberpunk 2020/RED for city, fixer and Humanity flavor |
| MC5 | About 40 PDFs from 2026-11-04 to 2026-11-08 have not been through `pdf-screen` | LATER/DELEGATE: haiku, one batch, run the screen over the new PDFs before any reader opens them; done when each has a screen result in its receipt |
| MC6 | Edition traps in P1: "Chromebook 1" is an Atlas Games listing whose catalogue code reads "Chromebook 1-2"; Ghost in the Shell is a 54 MB Internet Archive scan; Interface Zero 3.0 also exists as a Savage Worlds edition | ACCOUNT FOR NOW: record the edition that arrives; do not call a scan or combined volume the retail edition |
| MC7 | The sweep says Hunter x Hunter is queued in the library index but missing from the governor's `queue.json` | LATER: haiku, small, recheck the governor queue against the library index and fix whichever is stale |
| MC8 | Old backlist (Gibson, Morgan) has copies on both routes; Z-Library's 30 do more good on 2026 releases Anna's lacks (AR4, AR35) | ACCOUNT FOR NOW: the runner already tries Anna's first; put backlist in Anna's batches and newest releases in Z-Library batches |
| MC9 | P2 and P3 together run to about 110 books, roughly two resets with P1 | ACCOUNT FOR NOW: take first books plus one later book per new series before full runs, so a series that turns out thin does not take a whole day's quota |
| MC10 | Bulk manga on A/Z, searched 2026-11-08 (Z-Library free search; Anna's by a haiku browser agent): Ghost in the Shell is the only series with real chunks (a 148 MB "Complete" PDF, Man-Machine Interface 1-11 at 58.5 MB, 1.5 as one PDF). One Piece has two Internet Archive 3-in-1 omnibus PDFs (vols 10-12, 19-21) and otherwise single volumes of about 70 MB; My Hero Academia, Kaiju No. 8, Undead Unluck and Kagurabachi are single volumes; Mob Psycho 100 and World Trigger have only chapter scans or French singles. Hunter x Hunter has multi-chapter packs only as RAR, which Source Library does not take | ACT NOW (done): the three Ghost in the Shell files replace the single vol 1 in P1 (`list4_cyberpunk.json`). ACCOUNT FOR NOW: a single-volume manga run costs one quota use per volume (One Piece about 110), so these series go to the manga governor queue, which spends no A/Z quota; none of them is in `queue.json` yet. A/Z manga is taken only as packs of 3+ volumes, or as leftover end-of-day quota |

### More to consider, 2026-11-08 (MC11-MC13)

| Code | Finding | Disposition |
|---|---|---|
| MC11 | The *Dungeon Reset* file advertised as “Whole chapters” repeats the first spine file and lacks a distinct opener. The remaining chapter files run through 345 | ACT NOW: recorded the structural gap. ACCOUNT FOR NOW: use the [publisher's free episode 1](https://www.tappytoon.com/en/book/dungeon-reset-novel) when checking the opening setup |
| MC12 | *Mimic & Me* by Cassius Lange and Ryan Tang is a different work from [Rutaria's *Mimic Me!*](https://www.royalroad.com/fiction/140716/mimic-mewithin-the-eternal-forest). *The Law of Averages* also returns unrelated same-title hits | ACT NOW: added author names to the live queue and kept the lookalikes out of the download list |
| MC13 | The first *Mistborn* trilogy has a publisher-defined ebook bundle. It can cover three books with one file if the candidate matches the [Macmillan edition](https://us.macmillan.com/books/9781429989817/mistborntrilogy/) | LATER: small edition check. Match the bundle ISBN and verify all three titles in its EPUB contents before treating the trilogy as covered |

### More to consider, 2026-11-15 (MC14–MC16)

| Code | Finding and disposition |
|---|---|
| MC14 | **ACT NOW.** The live holdings ended at *Spider* 6 and *Sword* light novel 5. Exact-edition MD5 selection on Anna’s added *Spider* 7–11, 13, 15–16 and *Sword* 6–19 (DL108). The same pass added the three English EPUBs after *The Alloy of Law*, closing *Wax & Wayne*. See the [intake receipt](LIBRARY_INDEX.md#annas-light-novel-and-mistborn-intake-2026-11-15). |
| MC15 | **ACCOUNT FOR NOW.** The complete captured *Sword* web-novel snapshot under DL115 stays a distinct source. For the light-novel run, check EPUB spine paths as well as CRC. The first *Sword* 13 matched its expected hash but references a missing member. The alternate passed. Keep *Spider* 12 and 14 open after repeated HTTP 504s and retain the exact failed MD5s in the private receipts. |
| MC16 | **LATER / DELEGATE.** The only matching GAZ7 result in the scoped Z-Library search has the same MD5 as our damaged copy. Keep a clean GAZ7 and the missing GAZ9 open beside DL118 and DL119. Small, low-effort edition search. Done when a distinct English record matches the product code and a screened reader copy renders all pages. |

## Current acquisition priority, 2026-10-31

**Nov 13 update:** *Memory’s Flame* now has a web-serial reader copy covering all 19 entries mapped to book 20. The retail ebook and retail *Ghostsong* remain open. See the [intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-13).

**Current first priority: The Wandering Inn continuations, through all available published books.** **Main run acquired this session:** coverage through 19 plus the four newer split editions of 1-2. Books 18-19 use repaired web-text compilation reader copies; retail equivalence remains unverified. [Receipt and caveats](LIBRARY_INDEX.md#wandering-inn-published-run-acquisition-2026-10-31). Weibao clarified: "LOTM and RI as world depth and possibilities and more, but Wandering Inn should benext priority". Compare sources for world depth, breadth of possible lives and actions, interconnected systems, cultures and room for discovery. The earlier LOTM/mystery and RI/strategy split below was an agent interpretation, not his intended boundary.

Weibao: "Prioritize RR books and continueations/ full series/everything published first".
For the current download rounds, prioritize Royal Road books and continuations,
fill earlier holes, and acquire all available published volumes in a selected series
before opening more series or returning to rulebooks. This supersedes the earlier
2-3-at-a-time suggestion and rulebooks-first ordering below. Catalogue listings are
edition candidates, not proof of the latest publication boundary. Keep unavailable
volumes explicit rather than calling a series complete.

**Latest intake:** the later authorized continuation round added 30 EPUBs, including
Bog Standard 2–5, Mage Errant 2–7 plus anthology, Peculiar Soul, Reborn as a Demonic
Tree 4–9 and the recorded RR holes. Exact current coverage and dated new-RR
access gaps live in the [canonical receipt](LIBRARY_INDEX.md#rr-continuation-and-new-source-intake-2026-10-31).
Mark of the Fool 10 and Millennial Mage 11 (Flockbound) are released and held;
earlier “not released” lines below are superseded. The [scout report](DOWNLOAD_SCOUT_NEXT_2026-10-31.md#f2-live-royal-road-library-review)
also reviews all follows, favorites and Read Later pages. Those further recommendations
are not an instruction to download every shelf title. Older numbered tables retain
their dated discovery context; the library index determines current holdings.

**Ranked RR shelf capture completed:** S1–S8 are now held as eight signed-in browser
EPUB snapshots covering all 1,360 entries in their pinned public TOCs. Exact boundaries
are in [the library receipt](LIBRARY_INDEX.md#ranked-rr-signed-in-captures-2026-10-31).
Their earlier “not held” candidate states are superseded; don't redownload openers.

**Nov 1 follow-up:** Memories of the Fall is also held as a verified 210-entry
public snapshot. Immovable Mage has 263/323 entries saved; browser access is
disabled, leaving 60 to capture before packaging. RTOC now has two verified additions (248 new entries), with all 893 current TOC
identities mapped to held/new material; three images remain external references. See the
[RR receipt](LIBRARY_INDEX.md#two-further-rr-snapshots-2026-11-01) and
[RTOC receipt](LIBRARY_INDEX.md#rtoc-numbering-alignment-and-missing-material-2026-11-01).

**Nov 1 Anna’s gap round:** Arcane Ascension is now held through 6, Slumrat Rising
1–6 (including book 5, *The Dislocated Man*) is held, and Seven Seas’ Twelve Kingdoms
1–6 is held. These supersede the older pending/unheld rows below. Immovable Mage
remains with the earlier capture chat; Bioshifter search returned only held 1–3;
Huntsong/Ghostsong retail gaps remain unresolved. See the
[receipt](LIBRARY_INDEX.md#annas-gap-round-2026-11-01) for exact boundaries, routes,
source checks and six separate repaired reader copies.

**Nov 1 RR full-run round:** Weirkey 1–11, Battle Mage Farmer main novels 1–9,
This Used to Be About Dungeons 1–3, Blue Core 1–3, Sagewood 1–4 and Primal Hunter
1–16 are now held. Heretical Fishing 1–5 and Cinnamon Bun 1–7 were already present
at live preflight and were not reacquired. Older pending rows below are superseded
for these exact boundaries. [41-file receipt](LIBRARY_INDEX.md#rr-full-run-continuation-round-2026-11-01).
Anna’s remaining 36 slots were used; Z-Library supplied five final continuations.

**Nov 2 Z-Library remainder:** Defiance of the Fall is now held 1–16, Paranoid
Mage 1–5, and The Iron Teeth’s identified retail books 1–2. All 21 remaining desktop
downloads were used; quota is now 0. Defiance 17’s catalogue listing remains
unverified against its publisher’s future Dec 2 release date. Exact scope and the
one separate Defiance 8 reader repair are in the
[receipt](LIBRARY_INDEX.md#z-library-remainder-round-2026-11-02).

**Nov 2 Anna’s slow round:** Vainqueur 1–4 and Commerce Emperor 1–3 are now held.
Dragoneye is held 1–14 and 16; **book 15 remains unacquired** after a 429 and a
resetting independent waitlist. Twelve new EPUBs passed structural checks; held
openers were reused. [Receipt and exact gap](LIBRARY_INDEX.md#annas-slow-rr-round-2026-11-02).
The Gods Are Bastards and Forge version questions remain unresolved.

**Nov 2 slow follow-up:** Dragoneye 15 succeeded through another offered slow
partner, so **1–16 is now held**. Emberstone Farm 1–3, Meadowreach Homestead 1–4
and the current Podium Gods Are Bastards 1–2 were added. Meadowreach 5–9 and
current Gods 3 remain unavailable in the checked Anna’s records/searches; older
web-book numbering was not substituted. Ten new source EPUBs and two separate
Gods navigation-repair copies passed verification. These exact boundaries
supersede older pending rows below. [Receipt](LIBRARY_INDEX.md#annas-slow-follow-up-2026-11-02).

**Nov 3 fast + Z-Library round:** Ishura 1–10, Infinite Dendrogram 1–16, Overlord 1–16,
Re:Zero Short Story Collection 1–5 and Ex 1–6 are held, plus seven web-novel Re:Zero IF routes
(Wrath, Sloth with the Fortune extras, Pride PDF, Lust, Greed, Gluttony, Vollachia). These
supersede the "Unheld" status of DL67, DL68 and DL69 below. Still unheld: DL65 Forty
Millenniums (only partial files found), DL71 Irregular at Magic High School (editions exist,
lowest rank), Remonwater's Rem side-story pile (not requested). Six exact-text duplicates
were deleted; exact boundaries in [the receipt](LIBRARY_INDEX.md#re-zero-web-novel-if-routes-2026-11-03)
and the [dedupe manifest](novels/dedupe-2026-11-03/manifest_before_delete.json).

**Nov 3 browser and Z-Library round (supersedes the "Re:Zero WN gaps" and "Riordan" lines in the
2026-11-03 more-to-consider block below):** Re:Zero Arc 7 is 116 of 116, Arc 6 is complete at 91,
Arc 2 is held for chapters 1–49 (the live list's end; chapters 20–49 came from Pandemonium
Translations), and the Genderbent IF part I and Academy are held. Riordan's Trials of Apollo 1–5,
Kane Chronicles, Magnus Chase 1–3 and the companions are held, plus *Daughter of the Deep* and
*Camp Half-Blood Confidential*. Hunger Games 1–5 plus the two prequels are held. Both Jujutsu
Kaisen English novels are held. Anna's fast was exhausted (rolling 18 h); Z-Library supplied the
rest. Later the same day: the Wheel of Time omnibus, Earthsea, His Dark Materials and Ender's Game
came from Z-Library, and the five Ender sequels (*Speaker for the Dead*, *Xenocide*, *Children of the
Mind*, *Ender's Shadow*, *Ender in Exile*) came through Anna's free slow route in Chrome after
Z-Library's daily quota ran out; Bookracy's search failed on its own backend and Suwayomi returned
HTTP 500. Weibao deferred the rest. Still open (deferred unless he says otherwise): Meadowreach 5–8,
Discworld, Gods Are Bastards 3–4, Forty Millenniums, Irregular at Magic High School, Immovable
Mage's last 60 entries, a JJK fanbook copy and JJK Modulo (finished in Japan, English print vol 1
spring 2027, chapters free on Manga Plus and VIZ). Receipts:
[library index BC1–BC7](LIBRARY_INDEX.md#browser-captures-riordan-round-and-arc-cleanup-2026-11-03).

## W1. Finish series already held (do first)

| Code | Item | Route | Note |
|---|---|---|---|
| DL1 | Acquired: Tree of Aeons 8, Azarinth Healer 7, Threadbare 4–6 | Z | Closed by the 2026-10-31 continuation intake; use the library receipt |
| DL2 | Path of Ascension 9 already held | reuse | No new request; earlier pending row superseded Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL3 | *The Lost Steersman* (The Steerswoman 3, Rosemary Kirstein) | C | English EPUB candidate found. See [F5](#fiction-gap-and-source-check-2026-11-11). The previous query used Elizabeth Kerner’s title *The Lesser Kindred*. **Write-back 2026-11-11:** ~~*The Lost Steersman* (The Steerswoman 3, Rosemary Kirstein)~~ held 2026-11-11, English EPUB. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL4 | ~~Arcane Ascension 1–6~~ held. Still wanted: *Bioshifter* 4+ when available | A/Z | Recheck current holdings/boundaries before intake. Wandering Inn through 19, HWFWM through 13, Mage Errant main 1–7 plus anthology, Menocht Loop 1–6 are now held **Write-back 2026-11-11:** ~~*Arcane Ascension* 1–6~~ already held. Still wanted: *Bioshifter* 4+ if released. The Nov 11 search returned books 1–3. |
| DL5 | Life of a Dungeon Core 7, Beware of Chicken 6, Mana Mirror 6, 12 Miles Below 8 | recheck monthly | Not found or not yet published **Write-back 2026-11-06:** Searched 2026-11-06: nothing newer found for Life of a Dungeon Core 7, Beware of Chicken 6, Mana Mirror 6 or 12 Miles Below 8. |
| DL6 | Shadow Slave 3001+, A Soldier's Life 7+ | web serial / release check | **WARP follow-up 2026-11-11:** ~~*Shadow Slave* chapters 3001–3242~~ held (242 consecutive English chapters, [receipt](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11)). This reaches the checked Webnovel snapshot. Still wanted: released *A Soldier’s Life* books 7+. |
| DL7 | Circle of Inevitability in Chinese (宿命之环, 校对版全本) | Z or A | Cross-check for the English `coi` **Write-back 2026-11-11:** ~~Chinese *宿命之环*~~ already held (exact asset `f76f8c412e2f`). Check chapter coverage before using as a complete cross-reference. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |

## W2. D&D and other rulebooks

Held: D&D 2014 PHB, DMG, MM, Xanathar's, Tasha's, Planescape, Spelljammer, Fizban's, SRD
5.1 and 5.2.1; GURPS Basic (Characters, Campaigns), Powers, Thaumatology; M&M Hero's
Handbook; Blades in the Dark core; Spheres of Power; Soulbound; The Strange core set;
Numenera; Eclipse Phase; Ironsworn; Godbound free; Rifts Megaverse Builder.

| Code | Item | Why |
|---|---|---|
| DL8 | ~~D&D 2024 Player’s Handbook and Dungeon Master’s Guide~~ held. Still wanted: *Monster Manual* (2025) | The 2014 set is held. The file listed as a 2025/26 candidate proved to be the 2014 *Monster Manual*. **Write-back 2026-11-11:** The Nov 11 shared file advertised as the 2025 *Monster Manual* was the *Player’s Handbook*. Still wanted: the 2025 *Monster Manual*. **WARP follow-up 2026-11-11:** ~~*Monster Manual* (2025)~~ held, 388 PDF pages. Cover and PDF structure verified. Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). |
| DL9 | ~~Strixhaven: A Curriculum of Chaos~~ held 2026-11-04 (Z-Library, second pass; PDF not yet screened) | Magic-school life in D&D; direct comparison for the Harry Potter school year |
| DL10 | Eberron: Rising from the Last War (held since 2026-10-31, Source Library `9aa844f587`) | Magic as infrastructure and industry; making systems Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL11 | Guildmasters' Guide to Ravnica held 2026-11-04 (Z-Library). Still wanted: Acquisitions Incorporated | Guild membership and renown; running a business as a life **Write-back 2026-11-11:** ~~*Acquisitions Incorporated*~~ held 2026-11-11, English PDF, `a4b48edff70e`. Closed by the [intake receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL12 | ~~Mythic Odysseys of Theros~~ held 2026-11-04 (Z-Library) | Gods, piety and divine favor as a progression track |
| DL13 | ~~Sword Coast Adventurer's Guide; Explorer's Guide to Wildemount; Van Richten's Guide to Ravenloft; Monsters of the Multiverse~~ held (reconciled 2026-11-09) | Forgotten Realms base, a second setting, dread and curses, monster cultures |
| DL14 | ~~Pathfinder 2e Player Core, Player Core 2, GM Core, Monster Core and Kingmaker~~ held (reconciled 2026-11-09) | Second d20 frame; settlement and kingdom building |
| DL15 | ~~GURPS Infinite Worlds~~ held. Still wanted: GURPS Low-Tech Companion 3: Daily Life and Economics | Crossings between worlds; prices, wages and household economy **WARP follow-up 2026-11-11:** ~~*GURPS Low-Tech Companion 3: Daily Life and Economics*~~ held, fourth edition. Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). |
| DL16 | ~~Pendragon Core Rulebook; Burning Wheel Gold Revised~~ held (reconciled 2026-11-09) | Generational play and inheritance; skills that improve by use |
| DL17 | ~~*Traveller Core Rulebook Update 2022*~~ held. Still wanted: *Torg Eternity* core in English | Multi-reality rules, trade and careers. The earlier *Torg Eternity* search surfaced a French listing. |
| DL18 | WFRP 4e Winds of Magic; Exalted Essence; Spheres of Might | Magic as a society; mortal-to-exalted progression; martial counterpart to held Spheres of Power **Write-back 2026-11-17 (book lane, Weibao approved the pull):** held Winds of Magic (WFRP 4e, Cubicle 7) (40.1 MB, 42026831 bytes, SHA-256 `0b2b92d57540a3877b84ad43bc984717d4e5425267bfec2a4262092cdc8d6ca5`, MD5 `69529be4992c14483eb894d7337703d4`, Anna's fast, 2026-11-17). Still wanted: Spheres of Might. |
| DL19 | Starforged core; Mythic Game Master Emulator 2e; Ironsworn: Delve | Solo procedures for generated play **Write-back 2026-11-06:** Starforged Rulebook held 2026-11-05 (md5-checked); Mythic and the full Delve rulebook remain open. The Delve Site Worksheet and Site Cards are held. [Player aids receipt](LIBRARY_INDEX.md#world-play-aids-2026-11-09) **WARP follow-up 2026-11-11:** ~~*Mythic Game Master Emulator* 2e and full *Ironsworn: Delve* rulebook~~ held. Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). |
| DL20 | Kingdom (Ben Robbins); Forbidden Lands; RuneQuest core | Community decisions; survival and stronghold; cults and culture **Write-back 2026-11-06:** Kingdom 2nd Edition, Forbidden Lands Player's Handbook and RuneQuest: Roleplaying in Glorantha held 2026-11-05. **Write-back 2026-11-11:** ~~*Kingdom* 2e, *Forbidden Lands* Player’s Handbook and *RuneQuest: Roleplaying in Glorantha*~~ held 2026-11-05. These fulfill the listed editions. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL21 | The Strange: In Translation, Into the Outside; Invisible Sun | Traveler options and recursion building; occult society **Write-back 2026-11-06:** Invisible Sun (epub) held 2026-11-05; The Strange core not found (2026-11-05). **WARP follow-up 2026-11-11:** Calibre 189 holds *Into the Outside*. The Source Library EPUB named *Invisible Sun* is the Charles Stross novel. The intact *In Translation* PDF is now held under DL42. Still wanted: Monte Cook Games’ *Invisible Sun* RPG. |

## W3. Royal Road and progression fantasy (new)

RR origin below is from memory; tag a row RR only after its listing URL is checked.

| Code | Item | Why |
|---|---|---|
| DL22 | The Primal Hunter 1-2; Defiance of the Fall 1-2 | Profession paths (alchemy) and parallel Dao paths; openers only, both very long | <!-- slip-ok: Factual holdings, staging or title metadata at this snapshot; not a world design restriction. -->
| DL23 | Everybody Loves Large Chests; Vainqueur the Dragon; Salvos | Nonhuman lives beside Chrysalis and Tree of Aeons **Write-back 2026-11-06:** Large Chests 1-6 held 2026-11-06 (Neven Iliev); Vainqueur *The Last Adventure* returned Record_not_found; Salvos not found. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). **Nov. 21:** ~~*Everybody Loves Large Chests* 7–13~~ held, completing the main books. [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). |
| DL24 | There Is No Epic Loot Here, Only Puns | Cozy dungeon-core life, next to Dungeon Life | <!-- slip-ok: Factual holdings, staging or title metadata at this snapshot; not a world design restriction. -->
| DL152 | ~~*All the Skills* 2–6, Honour Rae~~ held | Continuation of the held opener and its deckbuilding progression. Closed by the [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). |
| DL25 | Delve (SenescentSoul); The Last Ship in Suzhou | Still not found as files; RR capture of free chapters **Write-back 2026-11-06:** Searched 2026-11-06: Delve still found only as a short "delve duet" file, not fetched; Last Ship in Suzhou not found. |
| DL26 | ~~Cinnamon Bun 1–7~~ held. Still wanted: volume 8 | Support and crafting life; book 1 now held **Write-back 2026-11-11:** ~~*Cinnamon Bun* 1–7~~ already held. Still wanted: *Cinnamon Bun* 8, listed by [Podium](https://podiumentertainment.com/titles/125544/cinnamon-bun-volume-8) and [ebook ISBN 9781039487369](https://www.storytel.com/tv/books/cinnamon-bun-volume-8-a-wholesome-litrpg-15311435). |

## W4. Canon-world companions and light novels

| Code | Item | Why |
|---|---|---|
| DL27 | Fate/strange Fake 1-5 | Grail-war rules from source text. Fate/Zero 1-4 are all held (Calibre 150, 160, 161) **Write-back 2026-11-11:** ~~*Fate/strange Fake* 1–5~~ held. On Nov 11 the English vol. 2 PDF matched an existing asset and vol. 3 was newly indexed. Closed by the [intake receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL28 | Re:Zero web novel arcs 5-10 (Witch Cult) | LN 1-10 and WN arc 4 are held; the web novel runs far past LN 10 **Write-back 2026-11-11:** Closed by the [Witch Cult captures](LIBRARY_INDEX.md#translator-site-captures-2026-10-30). Arcs 5–10 are held, including Arc 7 chapter 63. |
| DL29 | Delicious in Dungeon World Guide: The Adventurer's Bible | Dungeon ecology and cooking databook **Write-back 2026-11-11:** ~~*Delicious in Dungeon World Guide: The Adventurer’s Bible*~~ already held as CBZ. See the Nov 5 and Nov 6 intake receipts. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL30 | Romance of the Three Kingdoms (Brewitt-Taylor) volume 2 | Volume 1 held **Write-back 2026-11-11:** ~~Brewitt-Taylor volume 2~~ held as the original 1925 edition scan (DjVu, `916649910c11`). Closed by the [intake receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |

## W5. Everyday-life references

| Code | Item | Why |
|---|---|---|
| DL31 | Jacques Gernet, *Daily Life in China on the Eve of the Mongol Invasion* | Household, trades and city life for cultivation worlds (lead O6) **Priority 2026-11-10:** lowest. Weibao: "For the nonfiction they should be extremely low priority". Spend quota only on a day with uses left over after every other tier. |
| DL32 | Ryan North, *How to Invent Everything* | Rebuilding technology from scratch, for crafting and knowledge carry-over **Write-back 2026-11-06:** *How to Invent Everything* held 2026-11-05. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL33 | Ian Mortimer, *The Time Traveller's Guide to Elizabethan England* | Second period guide; the medieval one is held **Priority 2026-11-10:** lowest. Weibao: "For the nonfiction they should be extremely low priority". Spend quota only on a day with uses left over after every other tier. **Write-back 2026-11-13:** ~~English ebook~~ held. Closed by the [Nov 13 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-13). |

## W6. Gaps in held series

Found by a numbering scan of every held title ([AR10](SOURCE_ACQUISITION_TOOLS.md)).
Translator routes are in AR19-AR27; **T** = fan translator site, captured paced, no quota.

| Code | Gap | Route | Note |
|---|---|---|---|
| DL34 | ~~Re:Zero LN 1, 2, 9~~ held all along (scan missed "Volume 01" titles). New: WN arcs 5-10 | T: Witch Cult | DONE: arcs 5, 6 (complete, `bfc232bd8c65`), 8, 9, 10 registered; arc 7 115/116 (chapter 63 "Sparka" has no sitemap entry) **Write-back 2026-11-11:** Closed by [the Arc 7 repair](LIBRARY_INDEX.md#browser-captures-riordan-round-and-arc-cleanup-2026-11-03). The registered Arc 7 EPUB has all 116 entries. |
| DL35 | ~~Fate/Zero 2-4~~ held (Calibre 150, 160, 161; scan missed "FateZero") | none | DONE as alternate: Baka-Tsuki vols 2-4 and Another Story staged as EPUBs, not registered |
| DL36 | Tensura LN 1-15 (16 held) | A/Z | No fan web-novel translation found; 15 files, take a few at a time **WARP follow-up 2026-11-11:** ~~Tensura English light novels 1–15~~ already held, including the 104,437-word colored edition of volume 12 (`2fbf40f418f2`). Closed by the Nov 11 live holdings check. |
| DL37 | No Game No Life 1-3 | A, or T if Baka-Tsuki pages survive | AR21 **Write-back 2026-11-06:** Vols 1, 2 and 4 held (1-2 fetched 2026-11-05); vol 3 not confirmed. **Write-back 2026-11-11:** ~~*No Game No Life* 1–3~~ held as of 2026-11-11, with 3 newly acquired. Books 7 and 9 remain under DL40. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL38 | Lord El-Melloi II Case Files 1-3; Bookworm Official Fanbook 1 | A/Z | No fan translation found **Write-back 2026-11-06:** Case Files 1-4 held (1-3 fetched 2026-11-05); Bookworm fanbook not checked. **Write-back 2026-11-08:** Bookworm Fanbook 1 (Z-Library 16730130) came back `invalid_download`; one quota spent, not held. Fanbooks 2-7 were already held. Still wanted: Fanbook 1, another copy. Later 2026-11-08: ~~Fanbook 1~~ held via Anna's. Row complete. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL39 | Next volumes listed on Z-Library (scan of 41 series, 2026-10-30): Mark of the Fool 9-10; Randidly 14-15; Chrysalis 8-9; Millennial Mage 9-13; Labyrinth of the Mad God 3; You Are Summoned 6; Wish Upon the Stars 9; Bookworm Official Fanbook 8; El-Melloi II Case Files 6 | A/Z | Numbers read from titles; check each record before downloading **Write-back 2026-11-06:** Wish Upon the Stars 10 and Chrysalis 10 (PDF) held 2026-11-06; Chrysalis 8-9, Randidly 14-15, Millennial Mage 6, Labyrinth 3 and You Are Summoned 6 were already held. **WARP follow-up 2026-11-11:** Already held: *Millennial Mage* 9–13 and *Wish Upon the Stars* 9. The complete English fan edition of *Lord El-Melloi II Case Files* 6 is held. The Nov. 11 catalogue search found no match for *Ascendance of a Bookworm Official Fanbook* 8. [Receipt](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11) **Nov. 21:** ~~*Wish Upon the Stars* 11–13~~ held. Book 14 did not appear by title or ASIN. [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). **Nov. 23:** ~~*Ascendance of a Bookworm Official Fanbook 8*~~ held, ISBN 9781718344709. Official fanbooks 1–8 are held. [Nov. 23 intake](LIBRARY_INDEX.md#quota-intake-2026-11-23). |
| DL40 | Earlier gaps the scan found: Life of a Dungeon Core 1-2; Re:Zero LN 11-18, 23-24; Tensura LN 18-20; No Game No Life 7, 9 | A/Z (Re:Zero also T) | Dungeon Core 1-2 sit before the held 3-6 **Write-back 2026-11-08:** ~~Life of a Dungeon Core 1~~ held (Anna's); 2-6 were already held. **WARP follow-up 2026-11-11:** The specified *Re:Zero* and *Tensura* volumes were already held. Anna’s filled *No Game No Life* 7 and 9. Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). **Nov. 21:** ~~*No Game No Life* 5, 6, 8, 10–12~~ held. The English main books are now continuous through 12. [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). **Nov. 23:** ~~*No Game No Life Practical War Game*~~ held as the Yen On English side-story collection. [Nov. 23 intake](LIBRARY_INDEX.md#quota-intake-2026-11-23). |
| DL41 | Open series where only book 1 is held (DL4 plus Dungeon Crawler Carl, Cinnamon Bun): Z-Library lists up to Wandering Inn 18, He Who Fights 13, Mage Errant 8, Dungeon Crawler Carl 8, Cinnamon Bun 7, Arcane Ascension 6, Menocht Loop 6 | A/Z, 2-3 at a time | Long; pick by which world needs them | <!-- slip-ok: Factual holdings, staging or title metadata at this snapshot; not a world design restriction. -->

Godclads "20 and 28" was the Royal Road compilation *Godclads 1 to 28.20 [500 chs]*, which runs past book 2 (queued). Scan noise, not gaps: Cradle 13 and Threadbare 5, 6 and 9 come from other titles that match the name. Tree of Aeons 8, Azarinth 7, Path of Ascension 9 and Threadbare 4 are already DL1-DL2.

## Already on disk, not in either catalogue (checked 2026-10-30)

Hash check of `~/Downloads` against Source Library, then a title check against the Calibre
catalogue. Bookworm main series, Millennial Mage 1-2 and Menocht Loop 1 in Downloads are
already registered. The DL41 holes in series with "only book 1 held" are real: no later
volumes are on disk.

| Code | File in `~/Downloads` | Covers |
|---|---|---|
| DL42 | *The Strange: In Translation* (PDF; the tabletop-library copy is damaged too) | **Damaged** (qpdf: no trailer). Re-download; half of DL21. *Into the Outside* is already Calibre 189 **WARP follow-up 2026-11-11:** ~~*In Translation*~~ held in an intact 97-page PDF. Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). |
| DL43 | ~~*Warhammer Fantasy Roleplay* 4e English core rulebook (Cubicle 7)~~ held | Anna’s supplied the 352-page core (`eed184042862`) on Nov 16. The Nov 6 catalogue record (`5b9abafc84`) is *Deft Steps, Light Fingers*. Closed by the [Nov 16 intake](LIBRARY_INDEX.md#warhammer-and-cyberpunk-wishlist-follow-up-2026-11-16). **Write-back 2026-11-17 (PWC50):** still needs a replacement. The held 3 MB file is a truncated download: no page tree and no trailer, so `qpdf` and `gs` both fail and `pdftotext` yields 68 words. The Source Library entry labelled *WFRP 4e Core* (`5b9abafc84`) is a second *Up in Arms* volume (Rogues, Rascals, Rangers and Rovers), not the core. No readable WFRP 4e core is held; the Old World world row is read from *Up in Arms* only. (Coordinator note, wave 5 merge: the Nov 16 intake above holds the 352-page core as `eed184042862`; this lane read from an older catalogue and missed it, so the Old World row can now add the core.) |
| DL44 | *Warhammer 40,000 Core Book 9th Edition*; *Mutants & Masterminds Hero's Handbook 4th Edition Playtest* | **Both damaged.** Re-download if wanted. Z-Library search finds none of DL42-DL44; try Anna's search in Chrome **Write-back 2026-11-06:** WH40K Core Book 9th and M&M Hero's Handbook held 2026-11-05. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). **Write-back 2026-11-17 (PWC50):** the 40k core is fixed without a repair: the Source Library copy `f80e85b8d1` (383 pages, about 127,000 words, 167 MB) reads cleanly and replaces the truncated 20 MB copy in the setting pass. The Hero's Handbook half is not touched here. |
| DL45 | ~~*A Soldier's Life* Book 4, *The Hounds*~~ held | Managed EPUB `16576d1f36d2` covers chapters 182–243. Closed by 2026-11-11 live coverage check. |

Registered in Source Library on 2026-10-30: *Bookworm* Part 5 Volume 2 (second copy), the two
Lord of the Mysteries English EPUBs and the two Circle of Inevitability web-novel EPUBs. They
were in `~/Downloads`, a scan root, but no scan had run since they arrived.

## W7. Similar books and recorded Royal Road interests

Recorded interests not yet held (from the deep-dive queue RR1-RR36 and USER_VISION):
Delve (RR5), The Faraway Paladin (RR11), The Twelve Kingdoms (RR12), The Last Ship in Suzhou
(RR21), A Practical Guide to Sorcery (RR26), Foundryside sequels *Shorefall* and *Locklands*
(RR20), *A Death a Day* (USER_VISION 2026-10-08, concept tiers), The Primal Hunter and Defiance
of the Fall openers (DL22).

Similar books, from memory (check author and listing before downloading):

| Code | Item | Like | Why for us | Route |
|---|---|---|---|---|
| DL46 | ~~*Worth the Candle*~~ held (`novels/worth-the-candle`) | | | |
| DL47 | *Unsong*, Scott Alexander; *Ra*, qntm | Godclads | Kabbalah as industry; magic as engineering. Strong for making systems | Free author sites: capture **Write-back 2026-11-06:** *Unsong* held 2026-11-06; *Ra* not checked. **Write-back 2026-11-08:** ~~*Ra*~~ held 2026-11-08 (Z-Library). Row complete. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL48 | ~~*Worm*~~ held (Calibre 32, lead-run text). Next: *Ward* (sequel), *Pact*, *Twig* | Godclads | Same author's other power-with-cost worlds | Free web serials: capture **Write-back 2026-11-11:** Closed by the [Wildbow trio receipt](LIBRARY_INDEX.md#wildbow-trio-free-web-serials-2026-11-02). *Ward*, *Pact* and *Twig* are already held. |
| DL49 | ~~*Super Supportive*, *The Perfect Run*~~ both held (`novels/`) | Cinnamon Bun; Menocht Loop | Support-power career; time-loop superhero life | A/Z |
| DL50 | *Heretical Fishing* 1 held, 2 downloaded 2026-10-30, 3-5 next; *A Thousand Li* (Tao Wong) | Beware of Chicken | Cozy trade life in a cultivation world; ordinary sect life | A/Z **Write-back 2026-11-06:** A Thousand Li books 4-6 omnibus held 2026-11-06 (books 1-3 not checked). **Write-back 2026-11-08:** ~~*A Thousand Li* books 1-3 omnibus~~ held 2026-11-08 (Z-Library); books 1-6 now held. Next: the books after 6, once their numbering is checked. **WARP follow-up 2026-11-11:** *Heretical Fishing* 1–5 were already held. Tao Wong’s published main run ends at *A Thousand Li* 12. Anna’s added 7–10. Still wanted: *The Fourth Fall* (11) and *The Fourth Wall* (12). [Receipt](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11) **Write-back 2026-11-13:** ~~*The Fourth Fall* (11) and *The Fourth Wall* (12)~~ held. The main run is held through 12. Closed by the [Nov 13 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-13). |
| DL51 | *The Iron Teeth* (ClearMadness); *Blue Core* (InadvisablyCompelled) | Chrysalis; Dungeon Life | Nonhuman leader and tribe; dungeon-core life | A/Z **Write-back 2026-11-06:** *The Iron Teeth* and *Blue Core* 1 held 2026-11-06. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL52 | *This Used to Be About Dungeons*, Alexander Wales | Wandering Inn | Slice-of-life downtime between adventures | Free web serial or A/Z **Write-back 2026-11-06:** Held 2026-11-06. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |

Cozy farming and homestead, beside Heretical Fishing and Beware of Chicken (Z-Library search, authors checked):

| Code | Item | Why for us | State |
|---|---|---|---|
| DL53 | *[Farmer] Mage* (S.C. King), on Weibao's RR favorites: the one he meant. *Battle Mage Farmer* (Seth Ring), 9 books, downloaded in its place | A mage who farms; magic applied to crops and animals | [Farmer] Mage: check Z-Library, else RR capture. Battle Mage Farmer 1-2 downloaded Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL54 | *Sagewood* (Blake Arthur Peel), 4 books | Restore-the-farm progression | Next **Write-back 2026-11-06:** *Sagewood: Restore the Farm* held 2026-11-06; other three books not checked. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL55 | *Meadowreach Homestead* (G. A. Jensen), 8 books; *Emberstone Farm* (L. Meili) | Crafting homestead life | Later Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL56 | *Dungeon Farm* (Ringo Hunnigan); *That Time I Turned My Farm Into a Dungeon* (S. A. Archer) | Farm and dungeon as one place, beside Dungeon Life | Later **Write-back 2026-11-06:** *Dungeon Farm* held 2026-11-06; *That Time I Turned My Farm Into a Dungeon* not checked. **Write-back 2026-11-08:** ~~*Dungeon Farm* 2 and 3~~ and ~~*That Time I Turned My Farm Into a Dungeon* books 1-3 omnibus~~ held 2026-11-08 (Z-Library). Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL57 | *Rank Zero Waystation Mage* (John Croix); *The Hearthwood Alchemist* (Rowan Thorne) | Low-violence service and crafting jobs | Later **Write-back 2026-11-08:** ~~*Rank Zero Waystation Mage* 1-6~~ and ~~*The Hearthwood Alchemist*~~ held 2026-11-08 (Z-Library). Row complete. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |

## Downloaded 2026-10-30, wave 2 (Anna's member, 50 of 50 used)

Mark of the Fool 9; Randidly 14; Chrysalis 8, 9; Path of Ascension 9; Godclads Royal Road
compilation (chapters 1-500, past book 2); Millennial Mage 9, 10, 12; Life of a Dungeon Core 2;
You Are Summoned 6; Wish Upon the Stars 9; Primal Hunter 1, 2; Defiance of the Fall 1, 2;
Battle Mage Farmer 1, 2; Heretical Fishing 2.
No fast copy on Anna's yet, so Z-Library at its reset: Randidly 15, Tree of Aeons 8, Azarinth 7,
Threadbare 4-6, Labyrinth of the Mad God 3, Millennial Mage 13, Sagewood 1. Not released yet:
Mark of the Fool 10, Millennial Mage 11.

## W8. From Weibao's Royal Road follows and favorites

189 titles read 2026-10-30; 22 held. Clusters and UI ideas live in
[Royal Road shelf inspiration](../ROYAL_ROAD_SHELF_INSPIRATION_2026-10-30.md). First picks,
one per cluster, for the next Anna's or Z-Library day: [Farmer] Mage, Just Add Mana,
Blueprint for Immortality, Hocus, Pocus, Hypothesis, Death After Death, The Royal System,
The Lone Wanderer, Reborn as a Demonic Tree, A Gamer's Guide To Beating The Tutorial,
Non-Player Character, Harry Potter and the Surprisingly Competent History of Magic.

**Write-back 2026-11-06 (Anna's and Z-Library title searches):** held now from the shelf: Jackal Among Snakes 1-6, 8-12 (book 7 not found), Awaken Online Hellion/Catharsis/Armageddon/Dominion, Everybody Loves Large Chests 1-6, Unsong, The Iron Teeth, Blue Core 1, This Used to Be About Dungeons, Sagewood, Dungeon Farm, Cultist of Cerebon 1-2, The Dark Lord of Crafting 1-4, Corpo Age 1-2, Industrial Mage 1-2, Norman the Necromancer 1-3, Unwilling Eldritch Horror of Fortune 1-3, World Tree Apocalypse 1, Butler to a Core Lord 1, The First Law of Cultivation (PDF), The Sword of Kaigen, Legendary Shadow Blacksmith: The Bridge.
## Order by usefulness (proposal)

Sooner, because a live consumer reads them now:
1. Re:Zero web novel arcs 5-10 (DL34): 5-10 done (arc 7 missing chapter 63).
2. Current RR series that the lead-life run draws on: Mark of the Fool 9-10, Randidly 14-15,
   Chrysalis 8-9, Tree of Aeons 8, Azarinth 7, Path of Ascension 9 (DL1, DL2, DL39).
3. D&D 2024 core and Strixhaven (DL8, DL9): D&D is a canon-first world.
4. Register DL42-DL44 so searches find them; no download needed.
5. Life of a Dungeon Core 1-2 (DL40): the hole sits before held books.

Later, when a world or system pass needs them: Tensura LN 1-15, the long series in DL41,
No Game No Life, El-Melloi II, Bookworm Fanbooks, and the rest of W2.

## Today's state

2026-10-31 RR continuation round: **28 new EPUBs**. Now held: He Who Fights with Monsters 1-12; Dungeon Crawler Carl 1-7; The Menocht Loop 1-6; Cinnamon Bun 1-7. HWFWM 13 and DCC 8 returned Anna's record-not-found and remain the first continuation gaps. Exact checks and receipts: [library index](LIBRARY_INDEX.md#rr-continuation-round-2026-10-31). Approximately 9 fast requests remained after the final transfer. Earlier state paragraphs below are historical snapshots.

2026-10-31 follow-up: *A Gamer's Guide to Beating the Tutorial* 2-3 and an English *The Tutorial Is Too Hard* anthology are held, verified and indexed; contents and caveats are in [the library index](LIBRARY_INDEX.md#tutorial-and-reset-fiction-2026-10-31). Subsequent direct searches of Anna's in Weibao's Chrome for the series, Palt, Palt Greed and Palt Wrath found no steps 4-5; those queries do not rule out alternate metadata. *Death After Death* by DWinchester remains unacquired: no matching Z-Library or Anna's result for the title and author; the author-posted Scribble Hub polite route returned 403 and Royal Road was already closed on that transport. The last Anna's API response was 40 remaining before the third request in this follow-up.

2026-10-31: Anna's member route acquired *Heretical Fishing* 3–5, *Reborn as a Demonic Tree* 1–3, and *Blueprint for Immortality* 1. Each passed MD5 and EPUB archive checks and was registered. *A Gamer's Guide to Beating the Tutorial* 1 was already held under different metadata; the duplicate was detected after transfer and used a request. Local title and MD5 checks should both precede further requests. The last API response reported 43 remaining before the eighth request.

Anna's fast downloads: 50 of 50 used on 2026-10-30. Z-Library: 30 used yesterday; reset
time unverified. A suggested next run: DL1-DL3 and DL8-DL10 first, then DL22 and DL27.

## W9. LOTM / Reverend Insanity comparison round, 2026-10-31

Weibao: "Consider what else is worth downloading and more? Consider since we have no
blocks, we can also use the slow downlaods unlimitedly too, go ahead accordingly,
what other RR books or LNs or things with big worldviews and worth considering?
Use LOTM and Reverend insanity as comparison gates?"

Mode: acquisition scouting and verified intake, not a full-source read or gameplay
selection. WPR2/WPR4/WPR27/WPR28: reuse holdings, label inference, save here. No reader
agents, paid reading calls, purchases, commits or pushes. The table is an agent
recommendation under this request, not a newly accepted world-implementation order.
Local Source Library and Calibre inventories were checked. Existing sources outrank
new duplicate editions; title aliases and subtitles matter.

### Comparison gates (corrected to world depth and possibilities)

| Gate | Question | Benchmark lens |
|---|---|---|
| WG1 | Do institutions, professions, cultures and ordinary lives exist beyond the lead? | LOTM's lived world; prevents mistaking a long power ladder for a large world |
| WG2 | Are advancement, resources, information and costs connected in ways actors can use strategically? | RI's strategic progression; LOTM's dangerous knowledge |
| WG3 | Do factions have their own aims, material interests and room to act? | Both, without requiring either protagonist's morality or tone |
| WG4 | Can later revelations change one's understanding of existing rules, with evidence to inspect? | LOTM's discovery; compare without exposing plot truths |
| WG5 | Does it add an underrepresented kind of play, rather than repeat a held source? | Governance, service, research, trade, ecology, nonhuman life, rival mechanisms |

Weibao clarified that LOTM and RI are benchmarks for world depth and possibilities overall. The thematic associations in the last column are illustrative, not separate selection gates. These are comparison prompts, not numerical quality scores or a demand that every
book resemble both benchmarks. Synopsis and catalogue screening can justify acquiring
a source; only reading can verify its execution, consistency or quality. A work may
be especially useful on one axis while weaker on another. Prefer whole available
series or complete compilations, with exact translation/version coverage recorded.

### Ranked palette

Ranks are provisional acquisition usefulness for OOPS, not a literary ranking. Mechanic
fit below is inferred from linked publisher/author descriptions unless stated otherwise.

| Code | Source / rank | Why it earns a place beside the benchmarks | Acquisition disposition |
|---|---|---|---|
| DL58 | The Wandering Inn / RR 1 | Broad lives, species, communities and noncombat professions. Strong WG1/WG3/WG5 counterweight to combat-first progression | Expand the held first book through published continuations. [Author book list](https://wanderinginn.com/books-2/) and [TOC](https://wanderinginn.com/table-of-contents/). Published-book numbering and web-volume numbering differ; 2026 reissues split early books again. Queue by subtitle, not number alone **Write-back 2026-11-06:** A file titled *Memory's Flame* (about 101,700 words) was fetched 2026-11-06 and is likely a part or excerpt, not the full book 20. **Write-back 2026-11-13:** The 19 chapters that map to book 20 are now held as a web-serial EPUB. Still wanted: the retail ebook when available. [Receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-13). |
| DL59 | A Practical Guide to Sorcery / RR 2 | Magic as a learned discipline amid university, police, debt and criminal obligations; WG1-WG3 | Main books 2-6 acquired this round; book 1 already held under its subtitle. [Author premise](https://www.azaleaellis.com/a-practical-guide-to-sorcery/). Book 6's [author release notice](https://alcove.azaleaellis.com/t/a-practical-guide-to-sorcery-book-6-early-release-exclusive-now-live/843) establishes availability despite stale coming-soon text elsewhere; book 7 remains preorder on the checked store. Bonus stories are separate coverage |
| DL60 | Deep Sea Embers / translated CN 1 | City-states, fleets and anomalous seas; strongest new WG4 candidate for the LOTM side, with a different world topology | Acquired English compilation, 851 chapter entries. [Publisher record under Embers of the Deep](https://www.webnovel.com/book/24233205105935405); numbering caveat in library index. Author identity Yuan Tong, distinct from Cuttlefish |
| DL61 | Embers Ad Infinitum / translated CN 2 | Factions, ruin hunting and survival in a post-apocalyptic setting; a useful same-author contrast to LOTM | Acquired English compilation, numbered 1-953. [Publisher](https://www.webnovel.com/book/18555275806275805). Its promotional claim of surpassing LOTM is not an independent quality finding **Write-back 2026-11-11:** Closed by the [compilation receipt](LIBRARY_INDEX.md#worldview-acquisition-round-2026-10-31). English chapters 1–953 are held. |
| DL62 | Throne of Magical Arcana / translated CN 3 | Knowledge and advancement are connected; a research-life candidate rather than another generic combat ladder | Acquired English 1-910 compilation. [Publisher and TOC](https://www.webnovel.com/book/6838665602002005). Detailed scientific-mechanism quality remains unread **Write-back 2026-11-11:** Closed by the [compilation receipt](LIBRARY_INDEX.md#worldview-acquisition-round-2026-10-31). English chapters 1–910 are held by TOC. |
| DL63 | Twelve Kingdoms / LN 1 | Government, legitimacy, responsibility and the costs of rulership; strong WG1/WG3/WG5 | Unheld. Prefer full story coverage, tracking old fan/translated numbering separately from [Seven Seas' current edition](https://sevenseasentertainment.com/series/the-twelve-kingdoms-novel/): volumes 1-6 released by this date; 7 is dated Nov 24, 2026. Catalogue candidates for older stories 1-9 do not establish translation quality or equivalence **Write-back 2026-11-08:** Seven Seas books 1-6 (novels 1-4) were already held. ~~Fan-translation novels 5-9 and *Demon Child*~~ held 2026-11-08 (Z-Library); old fan numbering, kept apart from the Seven Seas edition. |
| DL64 | Slumrat Rising / RR 3 | Power access is controlled by a corporation; progression is tied to class and material dependence, useful WG2/WG3 | Unheld. Catalogue finds 1-4 and 6; resolve 5 before calling a collected run complete. [Publisher premise](https://podiumentertainment.com/series/971/slumrat-rising) Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL65 | *Forty Millenniums of Cultivation*, remaining English prose beyond the held compilation | Cultivation at a technological/civilizational scale; potentially useful against RI's resource and ideological lens | Unheld. Full-title English candidate was not acquired because the member API reported no downloads left; its mirror availability remains untested. Older explicitly partial 1-2711 files should not be substituted as complete. [Publisher](https://www.webnovel.com/book/6838665402001705) lists 3,523 entries, while main-story and extras numbering need reconciliation **Write-back 2026-11-11:** ~~English compilation~~ held 2026-11-11. Spine shows 1–3350 without detected gaps and extra headings. Still wanted: English prose beyond 3350. The catalogue offers no later EPUB. Novelzhen and SWDnovel list the continuation but challenged the project’s paced transport. The publisher and mirror label some final entries differently. |
| DL66 | Virtuous Sons / RR 4 | Greco-Roman cultivation offers a distinct cultural basis for progression; useful WG5 comparison | Book 2 acquired beside held book 1. No book 3 found in this catalogue search; no claim of current serial completeness. [Author RR listing](https://www.royalroad.com/fiction/41330/virtuous-sons) |
| DL67 | Overlord / LN 2 | Nonhuman institutions, asymmetric power and subordinate perspectives; useful faction/world reference, with a dominant lead that changes the progression comparison | Unheld. [Publisher's LN series](https://yenpress.com/series/overlord) lists through 16. Verify novel format and every volume before intake; manga numbering is separate **Write-back 2026-11-06:** Held in large part (vols 4, 8, 10-14 shown 2026-11-05; confirm range with library_coverage). **Write-back 2026-11-11:** ~~English light novels 1–16~~ already held on disk, verified against the named volume titles. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL68 | *Infinite Dendrogram*, English releases beyond held light novels 1–16 | A deliberately simulated world and individualized progression; candidate for distinct player lives and world inhabitants | Unheld. [Publisher](https://j-novel.club/series/infinite-dendrogram). Check full current English run before acquiring; publisher listing is not a proof that every ability is balanced or every inhabitant is fully modeled **Write-back 2026-11-06:** Held in large part (vols 1, 10-16 shown 2026-11-05, plus 1-5 earlier; confirm range). **Write-back 2026-11-11:** ~~English light novels 1–16~~ already held on disk. Still wanted: verify releases and coverage beyond 16. **WARP follow-up 2026-11-11:** ~~English light novels 17–23~~ acquired, covering 1–23 through the checked publisher listing. Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). |
| DL69 | Ishura / LN 4 | An unusual option: many powerful actors with different capabilities, useful to study competing mechanisms and faction perspectives | Unheld. [Publisher](https://yenpress.com/series/ishura) lists 10 novel volumes; exact released-vs-forthcoming boundary needs product dates before bulk intake. Not selected merely for high power levels **Write-back 2026-11-06:** Held in large part (vols 1, 4-10 shown 2026-11-05; confirm range). **Write-back 2026-11-11:** ~~English light novels 1–10~~ already held on disk, verified against the named volume titles. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL70 | The Gods Are Bastards / RR 5 | Religion, bureaucracy and industrial change coexist; useful WG1/WG3/WG5 | Unheld. [Author](https://www.patreon.com/ddwebb/posts/status-of-and-147474165) distinguishes edited book releases from older web books; do not mix their numbering. [RR premise](https://www.royalroad.com/fiction/72751/the-gods-are-bastards) **Write-back 2026-11-06:** Books 1-3 held (3 fetched 2026-11-06). **Write-back 2026-11-08:** books 1-3 already held; ~~*The Gods Are Bastards* Volume 4~~ held 2026-11-08 (Z-Library, D. D. Webb web-volume edition). |
| DL71 | *The Irregular at Magic High School*, English light novels 7+ | A candidate for technical magic embedded in school and political institutions | Unheld. [Publisher](https://yenpress.com/series/the-irregular-at-magic-high-school). Lower acquisition order than the stronger gaps above; technical consistency and full translated coverage remain to check **Write-back 2026-11-06:** Vols 1-6 held 2026-11-05; 7+ not fetched. **WARP follow-up 2026-11-11:** Anna’s added *The Irregular at Magic High School* 7–18 and 24–26, including fan editions of 24–26. Still wanted: 19–23 and 27. [Receipt](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11) **Write-back 2026-11-13:** ~~English light novels 19–23 and 27~~ held. English 1–27 are now held, with fan editions of 24–26. Closed by the [Nov 13 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-13). |

### More to consider: dispositions

**ACT NOW:** expand useful held series, acquire the bounded member batch, verify exact
hashes and EPUB integrity, inspect compilation TOCs, and refresh the catalogue. See
[library index](LIBRARY_INDEX.md#worldview-acquisition-round-2026-10-31) for actual results.

**ACCOUNT FOR NOW:** existing Ar'Kendrithyst, Pale Lights, A Practical Guide to Evil,
Godclads, Super Supportive, Mother of Learning and Bookworm belong in the comparison
pool before fetching duplicates. Presence is verified; complete/latest coverage is
not inferred. The source novelty question is what each adds beyond those holdings.
A big world need not be grim, infinite in scale or centered on a ruthless protagonist.

Free slow downloads remove the fast quota constraint when accessible; they do not
establish that a recent file is mirrored or eliminate queues, transfer time, integrity
checks or manual verification. On this run, an existing Chrome tab reached the slow
route, then DDoS-Guard demanded a manual check. User notified; no challenge solved or
bypassed, no automatic slow-download success claimed. Member API remained independently
usable. The account UI labels a last-18-hours usage window; historical "50 per day"
phrasing is not a verified reset schedule. No unattended indefinite downloader created.

**LATER / DELEGATE (not dispatched):** resolve continuation gaps and the top LN's
translation/edition map once the slow route is available. Suggested single-worker
level: Luna-low for metadata/coverage matching, Sol-low if editions disagree; bounded
one-series effort 15-30 minutes; done when each released volume has one verified local
asset or a named gap. A source-reading comparison of literary/system quality would
need a separate finite reading scope; downloads do not authorize a paid reading batch.

### W9 follow-up: member browser perk, 2026-10-31

Weibao's screenshot and the live donate page advertise "No browser checks" for Lucky
Librarian, qualified as normal browser use. The live signed-in account confirms the
membership is active and fast usage is 50/50. After visiting Account and following
Wandering Inn 2's slow link from its record in the same browser, DDoS-Guard initially
showed an automatic check, then the partner page supplied a file URL without manual
interaction. The exact cause of the previous manual-check failure is unresolved;
this does not prove that account-page navigation fixes it generally. No cookie or
security settings were changed. Use the existing signed-in browser, allow automatic
checks time to finish, and report a renewed manual challenge rather than treating
it as expired membership or a need to buy another tier. The [FAQ](https://annas-archive.gl/faq#donate) confirms a rolling last-18-hours fast-download limit, not midnight reset.

Wandering Inn remains the next acquisition priority. LOTM and RI are benchmarks for
world depth and possibilities overall; the earlier mystery/strategy split is not a
restriction on candidate worlds.

### W9 Wandering Inn acquisition result

2026-10-31: 21 retained source EPUBs acquired through slow partners: main books 3-19
and four newer split editions of 1-2. With earlier holdings, main-series coverage is
through 19. See the [library receipt](LIBRARY_INDEX.md#wandering-inn-published-run-acquisition-2026-10-31)
for the replaced malformed book 15, unchanged-payload reader repairs for web compilations
18-19, and the distinction from verified retail editions. All 21 reader editions passed
populated-spine and target checks. Source text was not full-read. Spinoffs were suggestions at this checkpoint; the later companion acquisition below records subsequent authorization and results. The original manual browser-check failure has no demonstrated root
cause; successful later session behavior should not be recorded as proof of a cookie fix.


### W9 companion acquisition result

2026-10-31: acquired Gravesong (Yonder compilation), Huntsong (Yonder version) and
The Last Tide: Book One through slow downloads. EPUB integrity and PDF hash,
structure and sampled rendering checks passed. Singer current retail completeness
remains unresolved: current Huntsong equivalence unverified, current Ghostsong not
found in checked sources; drafts/previews excluded. See the
[companion receipt](LIBRARY_INDEX.md#innverse-companion-acquisition-2026-10-31).
A new user-requested chat researches next acquisitions separately; no further
downloads or purchases were authorized there.

### More to consider: Re:Zero web novel, general RR and classics, 2026-11-03

Weibao: "Why not the Re:Zero webnovel? more to consider? ... general RR books and the classics
like Percy Jackson and Hunger Games". Proposals until he picks an order.

- **ACT NOW (correction):** the earlier ranking put Re:Zero LN 11–24 first; the web novel should
  lead (AR26: WN and LN are separate canons; LN 11–24 edit story we already hold as WN arcs 4–9).
- **ACCOUNT FOR NOW, WN gaps (corrected 2026-11-03 after reading the live table of contents):**
  Arc 10 held matches the site's 27 listed chapters, so no refresh is due; Arc 1 is now registered
  (24 chapters, about 69.9k words, `3ed1513eb266`); Arc 2 not held (Eminent
  is translating it; Eminent blocks the polite client, so Chrome with Weibao's OK, as for Lust);
  Arc 6 chapters 89–90 and Arc 7 chapter 63 missing; Eminent's Genderbent IF not captured. Witch Cult
  is open to the polite client (no closure on 2026-11-03). Cost: roughly 10–15 minutes of paced fetches.
- **LATER, general RR:** run a per-series gap scan (held volumes vs latest published) before buying
  quota; 2026 releases go through Z-Library (27 left), older ones through Anna's fast (1 left,
  rolling 18 hours). Title-level catalogue hits for Randidly, Tree of Aeons, Azarinth, Threadbare,
  Labyrinth of the Mad God and Millennial Mage do not show which volumes are missing.
- **LATER, classics:** Percy Jackson and Olympians 1–5, Heroes of Olympus 1–5 and Hunger Games 1–5
  are held. No catalogue hits for Trials of Apollo, Kane Chronicles, Magnus Chase, the Percy Jackson
  companions, Earthsea, His Dark Materials, Narnia, Ender's Game. Weibao's standing order puts RR and
  continuations before other series, so these follow.

Witch Cult closure, 2026-11-03: the table of contents links Arc 7 "Chapter 63: Sparka" to
`/2022/07/30/arc-7-chapter-62-sparka/`; fetching it returned a 301, which the polite transport
treats as a durable stop, so `witchculttranslation.com` is closed in
`staging/translator/_transport/state.json`. Reopening needs Weibao's yes (he approved four earlier
reopenings individually). The Arc 7 EPUB stays at 115 of 116 until then.

Ranking for extending OOPS game possibilities (proposal, 2026-11-03): 1 Re:Zero WN gaps and LN 11–24
(return-by-death loop, already a book world); 2 Riordan's remaining series (Trials of Apollo, Kane
Chronicles, Magnus Chase plus companions: three more myth systems that share one setting with held
PJO/HoO, which suits world-crossing rules); 3 Wheel of Time (large channeling system and cultures);
4 Discworld (guilds and city life for the life-sim line); 5 Earthsea (true-name magic, a school
life beside Harry Potter), His Dark Materials, Ender's Game.

### Royal Road gap scan, 2026-11-03

Weibao: "Go ahead" on the per-series gap scan. Method: 46 held series, title-parsed volume numbers
against Z-Library search metadata (no quota spent). The parse is noisy (unnumbered first books,
Roman numerals, subtitles), so only rows verified against the Source Library titles and Z-Library
records are listed. Runner and raw output: `novels/rr-gap-scan-2026-11-03/` (`scan.py`, `scan.json`).

| Code | Series | Missing (English EPUB exists on Z-Library) | Route |
|---|---|---|---|
| GS1 | Meadowreach Homestead 5, 6, 7, 8 | 2026 releases; Anna's records lacked them on 2026-11-02 | Z-Library, 4 downloads |
| GS2 | Dungeon Crawler Carl 8, *A Parade of Horribles* (2026) | Book 8 | Z-Library, 1 download |
| GS3 | Shadow Slave volumes 2–8 (held: 9–11 and an unnumbered volume) | 7 volumes, 2024–2025 | Anna's fast first |
| GS4 | Weirkey 8, *Deathseed* (2024) | Only hole in 1–11 | Anna's fast |
| GS5 | Battle Mage Farmer 10, *Tales of the Ecclesia* (2024; D&D 5e-compatible side book) | Held: main 1–9 | Anna's fast |
| GS6 | The Gods Are Bastards 3–4 | Only the 2019 web-edition volumes exist; current Podium book 3 is not out | Unresolved, not downloaded |

Checked and not gaps despite the scan's flags: Cradle (Foundation omnibus plus 4–11 and *Waybound*),
Azarinth Healer 1–7, Cinnamon Bun, Primal Hunter, Defiance of the Fall 1–17 (17 unreleased),
Mage Errant, Wandering Inn through 19. Series where Z-Library returned nothing usable and the scan
could not judge: Randidly, Millennial Mage, Wish Upon the Stars, Tree of Aeons, Sagewood, Slumrat Rising,
Chrysalis, Vainqueur. Quotas on 2026-11-03: Z-Library 8 left, Anna's fast 1.

Corrections to the gap scan (2026-11-03, same day): GS4 is not a gap, since *Deathseed* (Weirkey 8)
was already held. GS3 is mostly not a gap: Calibre 16 (*Shadow Slave*, Guiltythree) is a 1,600-chapter
web-novel compilation covering chapters 1–1600, and volumes 9, 10 and 11 are held separately, so the
retail volumes 2–8 are alternate editions of held text. One of them (volume 2, Eminent translation,
Anna's slow) was already downloaded before this was checked and is registered as an alternate edition.
GS5 (*Battle Mage Farmer 10: Tales of the Ecclesia*, a 5e adventure) was fetched through Anna's slow and
registered. Remaining real gaps: GS1 and GS2 (Z-Library only, 5 volumes).

GS3 closed (2026-11-03, after `scripts/library_coverage.py`): Shadow Slave chapters 1–3000 are held, with
only chapters 2888–2889 unaccounted for inside volume 11. Volumes 2–8 are not downloaded; see
[AR36b](SOURCE_ACQUISITION_TOOLS.md) and the coverage table in the library index.
GS2 closed (2026-11-03): Dungeon Crawler Carl 8 was already held as *A Parade of Horribles* (title lacks the series
name). Only GS1 remains, Meadowreach Homestead 5–8, which Anna's does not have (checked on its slow-download pages).

## W10. Rules sources for afflictions, weapon properties and disguise, 2026-11-04

Weibao, after a list of rulebooks that cover these topics: “We can add that to
shortlist to obtain too”. Recorded as his request to list them for acquisition;
buying anything still needs his yes. Holdings checked 2026-11-04 against the
Calibre and Source Library catalogues, the live Source Library database and the
tabletop library catalogue: none of DL72-DL81 is held. Consumers: the
[afflictions palette](../AFFLICTIONS_AND_WEAPON_PROPERTIES_CONSIDERATIONS_2026-11-03.md#round-4-books-or-wikis-and-more-to-consider-2026-11-03)
and the [Polyjuice identity palette](../worlds/HP_POLYJUICE_AND_PERCEIVED_IDENTITY_CONSIDERATIONS_2026-11-03.md).
Read the held Mutants & Masterminds, Eclipse Phase, Ars Magica and GURPS texts
first; they cover much of this at no cost.

| Code | Source | Why | Route |
|---|---|---|---|
| DL72 | Level Up: Advanced 5e system reference document | A strife track for mental strain beside fatigue; journey and supply rules; a richer condition ladder than base 5e | Free, open licence; official site **Write-back 2026-11-11:** ~~Publisher’s A5E SRD~~ held 2026-11-11. All 37 PDF links on the publisher index downloaded and registered. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL73 | Tales of the Valiant / Black Flag reference document (Kobold Press) | A 5e variant's afflictions and conditions under ORC | Free, ORC **Write-back 2026-11-11:** ~~Black Flag Roleplaying Reference Document v0.2~~ held 2026-11-11, publisher PDF. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL74 | Starfinder 2e records on Archives of Nethys | Sci-fi afflictions and disguise technology | Free; the authorized Archives of Nethys browser route ([receipt](d20/D20_RULES_COLLECTION_2026-11-03.md)) **Write-back 2026-11-11:** Online [Starfinder 2e reference](https://2e.aonsrd.com/) verified live. The linked project receipt defines the selected local records. No full site mirror. |
| DL75 | ~~*Warhammer Fantasy Roleplay* 4e *Up in Arms*~~ held | Weapon qualities, flaws and combat options | *Up in Arms* is held under `0671b27d0e94`. The English WFRP 4e core is tracked under DL43. Closed for this supplement. **Write-back 2026-11-17 (PWC51):** *Up in Arms* is held as two volumes (`0671b27d0e`, Knights and Warriors; `5b9abafc84`, labelled *WFRP 4e Core* in the catalogue but really the Rogues, Rascals, Rangers and Rovers volume) and both are read. The WFRP 4e core is still missing (DL43). *Winds of Magic* has not landed. (Coordinator note: the WFRP 4e core is held as `eed184042862` since Nov 16, DL43.) |
| DL76 | *Shadowrun* (current edition core) | Fake identities rated against scanner ratings: the credentials-versus-checker layer as numbers (PJI15-16) | A/Z, else buy **Write-back 2026-11-06:** Shadowrun Sixth World core held 2026-11-05. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL77 | *Night's Black Agents* (Gumshoe) | A cover identity as a resource spent down by use | A/Z, else buy **Write-back 2026-11-06:** Searched 2026-11-05: only the Redacted excerpt found, no core book. **Write-back 2026-11-08:** core not found again; only supplements on Anna's. **WARP follow-up 2026-11-11:** ~~*Night’s Black Agents* core~~ held in a 234-page English PDF. Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). |
| DL78 | *HârnMaster* (core and its injury rules) | Injury, bleeding and infection checked daily | A/Z, else buy **Write-back 2026-11-06:** Searched 2026-11-05: no HârnMaster core found. **Write-back 2026-11-08:** ~~*HârnMaster* 3e~~ held (Anna's, PDF, 7.6 MB, author not confirmed). **WARP follow-up 2026-11-11:** Verified the 160-page core PDF on disk and the title page identifies Columbia Games’ third edition. Closed by the WARP follow-up. |
| DL79 | *Call of Cthulhu* 7e Keeper Rulebook | Sanity as an affliction of the mind, with breaking points | A/Z, else buy **Write-back 2026-11-06:** Held 2026-11-05. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL80 | ~~*Mothership Player’s Survival Guide*~~ held 2026-11-05. Still wanted: *Warden’s Operations Manual* | Stress and panic, plus Warden procedures | The player guide is on disk. The Warden book was absent in the checked local catalogues on 2026-11-09. **WARP follow-up 2026-11-11:** ~~*Warden’s Operation Manual*~~ held. Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). |
| DL81 | *Mutants & Masterminds* 3e Gamemaster's Guide | Worked uses of the Affliction effect; the Hero's Handbook and Power Profiles are already held | A/Z, else buy **Write-back 2026-11-06:** Searched 2026-11-05: only 1-2 MB fragments of the GM's Guide. **WARP follow-up 2026-11-11:** ~~*Mutants & Masterminds Deluxe Gamemaster’s Guide*, third edition~~ held (298 pages). Closed by the [WARP follow-up](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11). |

Order (proposal): the free three (DL72-DL74) first, then DL75 and DL76, which fill
the largest gaps in the two palettes; the rest when a world or pass needs them.


### Done 2026-11-04

Solo Leveling novels 1-8 and web compilation, four Riordan companions, five Naruto novels, Mushoku Tensei 1-26, Meadowreach 5-8, SAO Progressive 1-9, and DL14 (Pathfinder 2e Player Core, Player Core 2, GM Core, Monster Core) plus Exalted, Pendragon, GURPS Infinite Worlds, Traveller and Burning Wheel from DL16-DL18 are held; the JJK Modulo and Delicious in Dungeon guide gaps are partly closed. Table and caveats: [library index](LIBRARY_INDEX.md#acquisition-round-2026-11-04-weibao-go-ahead-use-the-rest-of-todays-usage). Still open: DL8-DL13 (D&D 2024, Strixhaven, Ravnica, Theros, Wildemount, Van Richten as sourcebooks), Torg, Kingmaker, Naruto databooks, Modulo 2-6 and 8, Discworld.

## W11. Comprehensive settings and full PF1 rules data, 2026-11-04

Weibao: "send that into the to be obtained books, check reddit or other forms for comprehensive worlds like pathfinder and stuff?" Forum evidence is in the [settings survey](COMPREHENSIVE_SETTINGS_SURVEY_2026-11-04.md), and it is opinion, not counts. Holdings were checked 2026-11-04 against the Calibre and Source Library catalogues. Buying anything still needs his yes. Spells missing from 5e are covered by existing rows: the 2024 core books are DL8, Strixhaven is DL9, and the Sword Coast Adventurer's Guide and Explorer's Guide to Wildemount are DL13. The 2014 core, Xanathar's and Tasha's are held. Warhammer is DL75, HârnMaster is DL78, and the RuneQuest core is DL20.

| Code | Source | Why | Route |
|---|---|---|---|
| DL82 | Foundry VTT PF1 system packs and PCGen Pathfinder data | Every PF1 spell with class lists (3,028 records), plus feats, classes and items | **Done 2026-11-04** (Weibao: "clone"): see the [d20 receipt](d20/D20_RULES_COLLECTION_2026-11-03.md) |
| DL83 | *The Guide to Glorantha* (two volumes); *Cults of RuneQuest* | Called the best setting on the forums. Myth and cult magic would make a mechanically distinct world | A/Z, else buy **Write-back 2026-11-06:** *Cults of RuneQuest* held 2026-11-05; *Guide to Glorantha* skipped for size (736/790 MB). |
| DL84 | *HârnWorld* and the Hârn kingdom modules | Named again and again as the most granular setting: low magic, with social and economic detail | A/Z, else buy |
| DL85 | *Empire of the Petal Throne* (Tékumel) | Very old, very dense, and nothing like European fantasy | A/Z, else buy **Write-back 2026-11-06:** Searched 2026-11-05: no core book found. **WARP follow-up 2026-11-11:** The M. A. R. Barker EPUB carried the RPG title in the catalogue but contained the novel *Flamesong*. The 2005 Guardians of Order rules PDF (28032339:4f5818) is a distinct candidate. Still wanted: the [original 1975 TSR rules](https://www.tekumelfoundation.org/post/empire-of-the-petal-throne). **Write-back 2026-11-13:** ~~2005 Guardians of Order *Tékumel: Empire of the Petal Throne*~~ held. Still wanted: original 1975 TSR rules. [Receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-13). |
| DL86 | Mystara Gazetteers GAZ1-14 | Detailed nations, factions and common people; Immortals take the place of gods | A/Z, else buy **Write-back 2026-11-06:** Searched 2026-11-05: only the Northern Reaches PDF found. **Write-back 2026-11-13:** ~~GAZ1, GAZ4–6, GAZ8 and GAZ10–14~~ held and rendered without decoder warnings. GAZ2 and GAZ3 scans are held with JPEG decode warnings; GAZ7 has a damaged page tree. Still wanted: clean replacements for GAZ2, GAZ3 and GAZ7, plus GAZ9 (*The Minrothad Guilds*), which was not acquired. [Nov 13 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-13). **Write-back 2026-11-15:** ~~GAZ2, GAZ3, GAZ7 replacements and GAZ9~~ held. The numbered GAZ1–14 set now has readable copies. The new GAZ3 rendered all pages and carries a cover annotation warning. Closed by the [Nov 15 follow-up](LIBRARY_INDEX.md#spider-and-mystara-follow-up-2026-11-15). |
| DL87 | *Pathfinder Lost Omens World Guide*; PF1 *Inner Sea World Guide* | Golarion, the biggest setting by volume, as places and factions | A/Z, else buy **Write-back 2026-11-06:** Both held 2026-11-05. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL88 | *Forgotten Realms Campaign Setting* (3e); *Grand History of the Realms* | The setting with the most material in total, which D&D's canon-first world uses | A/Z, else buy **Write-back 2026-11-06:** Both held 2026-11-05. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL89 | *The Dark Eye* 5e core (Aventuria) | Perhaps the Realms' rival for word count; much of it is German-only | A/Z, else buy **Write-back 2026-11-06:** Core held 2026-11-05. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL90 | *Ptolus: City by the Spire* | One city and its dungeon in 672 pages, a model for depth at settlement scale | A/Z, else buy **Write-back 2026-11-06:** Searched 2026-11-05: only the player's guide found. **Write-back 2026-11-08:** ~~*Ptolus* (2021 5e edition)~~ held (Anna's). The 2006 original is still wanted. **Write-back 2026-11-10:** ~~2006 d20 original~~ held (Anna's, 84 MB PDF). Closed by 2026-11-10 write-back (all items held). |
| DL91 | PF1 Core Rulebook, Advanced Player's Guide, Ultimate Magic, Ultimate Combat, Advanced Class Guide, Occult Adventures | Optional: DL82 already covers the rules data | A/Z **Write-back 2026-11-08:** ~~Core Rulebook, Advanced Player's Guide, Ultimate Magic (pocket), Ultimate Combat~~ held (Anna's, PDF). Check the rest of the row's list against holdings before the next run. **Write-back 2026-11-10:** ~~Advanced Class Guide, Occult Adventures~~ held (Anna's). Row complete. Closed by 2026-11-10 write-back (all items held). |

Order (proposal): DL83 and DL84 first, because they add the most distinct kinds of world. Then DL87 and DL88 for volume. Run DL91 only if a reader needs book layout or rules text that DL82 lacks.

## W12. Procedures, everyday life and faction play, 2026-11-04

Weibao: "More stuff to put into wishlist?" Each row adds a mechanism the held
rulebooks lack, matched to a PROJECT.md consumer: daily life, the life-sim
north star, settlements, generated worlds, or memory. Holdings were checked
2026-11-04 against the Calibre and Source Library catalogues and the buying
list, and none is held. Mythras is already on the [buying list](tabletop-library-2026-10-14/BUYING_LIST.md),
so it is not repeated here. Free status and licences are from memory; open the
publisher page before fetching. Buying needs Weibao's yes.

| Code | Source | Why | Route |
|---|---|---|---|
| DL92 | *Worlds Without Number* (free edition) | Faction turns that move the world while the player is away; region and court generators | Free from the publisher (DriveThruRPG account, so Weibao's to grab), else A/Z **Write-back 2026-11-08:** not on Z-Library or Anna's (wrong-author epub only). **Write-back 2026-11-11:** ~~*Worlds Without Number*, free edition~~ already indexed by exact hash. The Nov 11 mirror copy matched it byte-for-byte. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL93 | *Stars Without Number* Revised (free edition) | The same faction-turn engine at sector scale; tags that generate a world in a few rolls | as DL92 **Write-back 2026-11-08:** Revised not found; only the 2010 original on Anna's (b9e7a17c6173b5115b29ec4eb9df5717), not fetched. **Write-back 2026-11-11:** ~~*Stars Without Number: Revised*, free edition~~ already indexed by exact hash. The Nov 11 mirror copy matched it byte-for-byte. The 2010 original is a separate optional edition. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL94 | *Old-School Essentials* SRD | Reaction rolls, retainer morale and loyalty, and wandering-encounter and hex procedures: compact rules for what the world does on its own | Free online SRD (check the licence page) **Write-back 2026-11-11:** Verified the current [publisher’s online rules reference](https://oldschoolessentials.necroticgnome.com/rules/doku.php?id=start). Online reference, no full site mirror. |
| DL95 | *Ryuutama* | Travel as a daily routine: weather, terrain, seasons, cooking and camp duties, each a check | A/Z, else buy **Write-back 2026-11-08:** ~~*Ryuutama*~~ held (Anna's, PDF). Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL96 | *Wanderhome* | A peaceful pastoral life: seasons, places and natures with no combat, close to the life-sim north star | A/Z, else buy **Write-back 2026-11-08:** 178 MB PDF candidate (MD5 `fbac35db40415e72320cbfcf613ed9af`). On 2026-11-09 Anna's fast quota was exhausted and its slow route stalled at the browser check. **Write-back 2026-11-10:** ~~*Wanderhome*~~ held (Anna's fast, same md5, cap raised to 185 MB for this one file). Closed by 2026-11-10 write-back (all items held). |
| DL97 | *Mouse Guard* 2e | A turn of the seasons with a town and recovery phase; weather as an opponent | A/Z, else buy **Write-back 2026-11-08:** ~~*Mouse Guard* 2e~~ held (Anna's, PDF). Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL98 | *Reign* (Greg Stolze) | Companies as characters: guilds, cities and cults with their own stats and actions; settlement and faction play | A/Z, else buy (an Enchiridion edition exists) **Write-back 2026-11-08:** not found on Z-Library or Anna's. **Write-back 2026-11-13:** ~~Greg Stolze’s 2007 corebook~~ held as an English PDF. Closed by the [Nov 13 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-13). |
| DL99 | *The Quiet Year*; *Microscope* | A community across one year, and history built in eras: procedures for generating a world's past | A/Z, else buy **Write-back 2026-11-08:** ~~*The Quiet Year*~~ held (Anna's). Still wanted: *Microscope* (only *Microscope Explorer* found). **Write-back 2026-11-10:** ~~*Microscope*~~ held (Anna's, md5 `2a9e1a79354d9c9b39cc01924465c45e`). Closed by 2026-11-10 write-back (all items held). |
| DL100 | *Thousand Year Old Vampire* | Memories as a capped list that must be lost as new ones arrive: a model for the person-memory seams | A/Z, else buy **Write-back 2026-11-08:** ~~held~~ (Anna's, PDF). Row complete. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL101 | *Apocalypse World* 2e; *Dungeon World* | Moves, and fronts as threat clocks that advance off-screen | A/Z, else buy (the Dungeon World text is CC-BY; verify) **Write-back 2026-11-08:** *Dungeon World* (Z-Library 2623177, Sage Kobold) came back `invalid_archive`; one quota spent, not held. Still wanted: *Dungeon World*, *Apocalypse World* 2e. Later 2026-11-08: ~~*Apocalypse World* core~~ held (Anna's). Still wanted: *Dungeon World*. **Write-back 2026-11-10:** Anna's EPUB md5 `48ce396716c50140105ba38cbc8e044e` (18.2 MB) arrived as a non-ZIP file; one fast use spent, not held. Do not request that md5 again; next try the PDF `30e4141aa50e261849464a3723ff771d` (54.8 MB). Later 2026-11-10: ~~*Dungeon World* PDF~~ held (that md5). Row complete. Closed by 2026-11-10 write-back (all items held). |
| DL102 | *Dungeon Crawl Classics* core | Patron bargains, spell corruption and misfire tables, and the zero-level funnel of many ordinary people | A/Z, else buy **Write-back 2026-11-08:** ~~held~~ (Anna's, PDF). Row complete. Closed by 2026-11-08 reconcile (holdings confirmed in the catalogue). |
| DL103 | ~~Pathfinder 2e *Kingmaker* (kingdom rules)~~ held | Live Source Library check on 2026-11-09 found the 642-page adventure path, asset `9f4dff305435` | Closed |
| DL104 | ~~*Vigor Mortis* 1-4~~ held 2026-11-08; ~~*Jackal Among Snakes* 7~~ held 2026-11-08 (series now 1-12); ~~*Cradle* 13 *Threshold*~~ held 2026-11-08; ~~*Iron Prince* (Warformed: Stormweaver 1)~~ held 2026-11-08; ~~*Salvos* 1-14 compilation~~ held 2026-11-08 | Series continuations and RR books found by the 2026-11-08 Z-Library search | All Z-Library, md5-matched; not screened or read |
| DL105 | *The Apothecary Diaries* LN ~~1–16~~, *A Tale of the Secret Saint* ~~1-10~~ and ~~ZERO 1-4~~, *Re:Monster* ~~prose files 1-7~~, ~~*Arifureta* 1-13 and Zero 1-2~~, and ~~*Warformed: Stormweaver* 2~~ held 2026-11-08. Still wanted: *Re:Monster* later prose coverage, *Warformed: Stormweaver* 3. **WARP follow-up 2026-11-11:** *Konosuba* 1–17 held (English, including fan editions). | Light novels and prose compilations | [Anna's receipt](LIBRARY_INDEX.md#annas-first-fiction-follow-up-2026-11-08-dl105-dl106). The *Re:Monster* 8-11 catalogue hits are manga. **Nov. 21:** ~~*The Apothecary Diaries* light novel 16~~ held. [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). **Nov. 21 continuation:** ~~*Arifureta Zero* 3–6, *A Tale of the Secret Saint* 11 and *ZERO* 5–6~~ held. [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). |
| DL106 | ~~RED Jumpstart Kit, Black Chrome, Danger Gal Dossier, Tales of the RED; 2020 core, Night City Guide, Chromebook 1, Listen Up You Primitive Screwheads; Shadowrun 6e Street Wyrd, Firing Squad, Body Shop, Double Clutch; Shadowrun 5e core and Run Faster; GURPS Cyberpunk; Interface Zero 3.0; The Sprawl; Ghost in the Shell (original, Man-Machine Interface, 1.5); Gibson's Sprawl trilogy and Burning Chrome; Morgan's Kovacs trilogy; Do Androids Dream of Electric Sheep?; Snow Crash; Hardwired~~ held 2026-11-08 via Anna's. ~~*Cyberpunk RED* full core, *Edgerunners Mission Kit* three booklets, *Cyberpunk 2013* three booklets, *CyberGeneration* (1993), and *Cyberpunk Version 3.0*~~ held 2026-11-09. *Cyberpunk 2013* Player Reference Sheets and combat aids extracted. ~~*Edgerunners Mission Kit* standalone maps, printable token and standee sheet, and seven pregens~~ held from the digital v1.0 ZIP. [Original files receipt](LIBRARY_INDEX.md#original-edgerunners-files-and-tabletop-player-aids-2026-11-09) | Cyberpunk rules and setting research | [Core edition receipt](LIBRARY_INDEX.md#cyberpunk-core-editions-2026-11-09-dl106), [earlier PDFs](LIBRARY_INDEX.md#cyberpunk-follow-up-2026-11-08-dl106), [fiction](LIBRARY_INDEX.md#annas-first-fiction-follow-up-2026-11-08-dl105-dl106). |
| DL107 | ~~*Super Powereds* Years 1-4 and *Corpies*, *Dungeon Reset* compilation, *Minute Mage* 1-3, *Making Magic* 1-3, *Double-Blind* 1-3, *All the Dust that Falls* 1-4, *Monster Tamer* 1-2, *Min-Maxing My TRPG Build* 1-2, *The Oracle Paths* compilation, *Fine Structure*, *D-Genesis* 1-2, *Lazy Dungeon Master* 1-3~~ held 2026-11-08. Still wanted: *Markets and Multiverses* (acaswell), *Mimic Me! Within the Eternal Forest* (Rutaria), *The Law of Averages* (mcswazey), *The Flower That Bloomed Nowhere* (Lurina), and later volumes where needed | Standing RR-first priority; named in broad-scout and source-request docs | [Acquisition receipt](LIBRARY_INDEX.md#wishlist-prose-wave-2026-11-08-dl107). *Dungeon Reset* has an opening gap. *The Oracle Paths* compilation contains numbered chapters 1-485 |
| DL108 | Power-system books (P3): Mistborn, The Dresden Files, The Kingkiller Chronicle, So I'm a Spider So What?, Reincarnated as a Sword, Reborn as a Vending Machine, Konosuba 1-17, Coiling Dragon, Martial Peak, Release That Witch, Trash of the Count's Family, Return of the Mount Hua Sect, Overgeared | Cited in 16-45 docs each; initial holdings consisted of wiki dumps | A/Z; first book plus one later book per series first **Write-back 2026-11-10:** ~~*Mistborn* trilogy boxed set (Macmillan 2009) and *The Alloy of Law*; *Dresden Files* Ultimate Omnibus 0-15 (fan compilation); *The Name of the Wind*, *The Wise Man's Fear*; *So I'm a Spider, So What?* 1-2; *Reincarnated as a Sword* 1-2; *Reborn as a Vending Machine* 1-3; *Konosuba* 1-2; compilations of *Coiling Dragon*, *Martial Peak*, *Release That Witch* (c1-1499), *Trash of the Count's Family* (Part I, 776 chapters), *Return of the Mount Hua Sect* (1-1636) and *Overgeared*~~ held (Anna's fast, md5-checked; compilation chapter ranges and the boxed set's three titles not yet checked, MC13). Later 2026-11-10: ~~*So I'm a Spider* 3-6, *Reincarnated as a Sword* 3-5, *Konosuba* 3-4, *Dresden Files* 16-18~~ held. Konosuba 3 md5 `8a4dc340a6ed869839412477483e3e78` was a corrupt EPUB (one use lost; do not request again). *Reborn as a Vending Machine* 4 not found on Anna's. **WARP follow-up 2026-11-11:** *Konosuba* 5–17 acquired, completing English 1–17. Several volumes are fan editions. [Receipt](LIBRARY_INDEX.md#annas-fast-follow-up-2026-11-11) **Write-back 2026-11-15:** ~~*Spider* 7–11, 13, 15–16, *Sword* light novels 6–19, and *Wax & Wayne* 2–4~~ held. [Anna’s receipt](LIBRARY_INDEX.md#annas-light-novel-and-mistborn-intake-2026-11-15). ~~*Spider* 12 and 14~~ held via Z-Library on Nov 15, completing 1–16. [Nov 15 follow-up](LIBRARY_INDEX.md#spider-and-mystara-follow-up-2026-11-15). **Nov. 23:** ~~Yen On English editions of *Konosuba* 16–17~~ held alongside the fan translations. A second Yen On package of volume 3 has essentially the same text as the held edition. [Nov. 23 intake](LIBRARY_INDEX.md#quota-intake-2026-11-23). |
| DL109 | Rulebooks (P4): Legend of the Five Rings, Savage Worlds, Genesys, Fabula Ultima, Cortex Prime, Wrath & Glory, Rogue Trader and Stars of Inequity, Swords of the Serpentine, HârnManor | Named in the 2026-10-14 tabletop sweeps | Anna's browser search, then md5 **Write-back 2026-11-10:** ~~*Legend of the Five Rings* core (FFG), *Savage Worlds Adventure Edition*, *Genesys* core, *Fabula Ultima* core, *Cortex Prime Game Handbook*, *Wrath & Glory* core, *Rogue Trader* core and *Stars of Inequity*, *Swords of the Serpentine*, *HârnManor*~~ held (Anna's fast PDFs, md5-checked, not yet through `pdf-screen`). **Write-back 2026-11-11:** Closed by the Nov 10 write-back above, which lists the acquired rulebooks. |
| DL110 | Low (P5): manga runs One Piece, My Hero Academia, Hunter x Hunter, Kaiju No. 8, World Trigger, Mob Psycho 100, Undead Unluck, Kagurabachi | Power-system scouts | Manga governor queue, not A/Z quota **Write-back 2026-11-08:** Weibao: "Yes, queue them". Hunter x Hunter was already queued (`hxh`). Queued at the end of the manga governor's `queue.json` after a scoped survey (`governor/survey-2026-11-08/`): One Piece (Bbato, 1,312 chapters), My Hero Academia (AllManga, 475), Kaiju No. 8 (AllManga, 153), World Trigger (Bbato, 276), Mob Psycho 100 (MangaPill, 148), Undead Unluck (MangaKatana, 242), Kagurabachi (Bbato, 187): 2,793 chapters, about 14 GB, about 9 nights of the run window. Queued, not downloaded; backup `queue.json.bak-2026-11-08-before-p5-manga`. |

| DL111 | *Lord of the Mysteries* original comic and 2025 remake, *Omniscient Reader*, *The World After the Fall* | Comic reference editions | Queued 2026-11-09 through the existing Source Library governor. MangaFire original 0–65 (66), Bbato remake 0–25 (26), Weeb Central *Omniscient Reader* 253–311 (59), Weeb Central *The World After the Fall* 0–258 (259). The two legacy Bbato *Omniscient Reader* batches were replaced. Live holdings accounted for all 256 existing *Omniscient Reader* CBZ chapter labels, including fractional entries. All three extensions were already enabled. Queue verified and reload requested. The governor was paused for battery and its last runner had stopped on an earlier *Naruto* edition review. [Reader checks](SOURCE_ACQUISITION_TOOLS.md#live-suwayomi-reader-checks-2026-11-08). **Nov 13 ledger check:** all four selected batches (410 chapters) are complete. Closed by the [Nov 13 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-13) for these ranges. |
| DL112 | *Code Geass: Lelouch of the Rebellion*, main manga by Majiko! and English novels by Mamoru Iwasa | ~~English Stage 0–4 novels~~ held as five Bandai print-edition PDF scans. Also held: an *R2 TURN 1* fan-translated opening excerpt | The governor is processing manga chapters 1–26 and bonus 26.5. Still wanted: manga chapters 27–38 (volumes 7–8). Complete English *R2* and *Red Tracks* editions were unverified in the checked routes. [Acquisition state](LIBRARY_INDEX.md#code-geass-2026-11-09-dl112) **Nov 13 ledger check:** all 27 jobs for chapters 1–26 and bonus 26.5 are complete. The remaining manga search failed with HTTP 500. |
| DL113 | *Chainsaw Man: Buddy Stories* (Sakaku Hishikawa, illustrated by Tatsuki Fujimoto; VIZ, 2023, ISBN 9781974738663) | The franchise's one prose novel: four side stories not in the manga (Power and Denji, Quanxi and Kishibe, Himeno and Aki's first assignment, the Enoshima trip). The manga itself is in the governor queue (`chainsaw-man`) | Anna's by md5 **Write-back 2026-11-11:** ~~*Chainsaw Man: Buddy Stories*~~ held 2026-11-11, English VIZ EPUB. Closed by the [Nov 11 wishlist intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL114 | *Trash of the Count's Family* web novel beyond chapter 776 (AR56) | Held: the Part I compilation (1-776) and the official *Lout of Count's Family* 1-9, which trail it. The full run's length is unverified | Anna's search by md5; else a polite capture of a fan translation **Write-back 2026-11-11:** ~~Part II chapters 1–439 and all 22 side-story entries between Parts I and II~~ held as six English EPUBs. Closed by the [intake receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-11) for the translator’s published snapshot. |
| DL115 | *Reincarnated as a Sword* web novel in English (AR56, AR58) | The web novel is the original and runs ahead of the held light novels 1-5; cross-check against them (AR59) | Check fan translation sites and Anna's; capture through the polite transport if found **Write-back 2026-11-11:** ~~English web-novel chapters 1–1364~~ held 2026-11-11. The community EPUB supplies 1–1064, and two EPUBs from Seeker’s public translation source supply 1065–1310 (main ending) and 1311–1364 (post-ending chapters). Closed by the [intake receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-11) for the published English snapshot. |
| DL116 | *Code Geass* anime subtitle files, English (AR57) | The anime is the original; held manga (1-26 of 38) and Stage 0-4 scans trail it, and subtitles parse more easily than either | Route not established; find a subtitle source before any download **Write-back 2026-11-11:** ~~English subtitles for R1 and R2, 25 episodes each~~ held 2026-11-11, community pack. All 50 files have timestamped cues. Closed by the [intake receipt](LIBRARY_INDEX.md#wishlist-intake-2026-11-11). |
| DL117 | ~~*The Gamer’s Brain*, *Game Balance*, *Game Design Workshop* fifth edition, *Writing Is Designing*, *Game Feel*, and *Writing for Games*~~ held 2026-11-11 | Game UI, progression, playtesting, feedback and choice prose | Six English EPUBs verified and registered via Z-Library. Closed by 2026-11-11 intake. [Receipt](LIBRARY_INDEX.md#game-design-and-writing-references-2026-11-11-dl117), [rules research](GAME_UX_GUIDES_2026-11.md#ui-progression-and-choice-research-2026-11-11) |
| DL122 | *A Regressor's Tale of Cultivation* chapter 808 and everything after chapter 874 (proposal, 2026-11-17, [ranked](power-catalogues-2026-11-16/README.md#missing-books-2026-11-17-proposals) M4) | The ledger holds 0-639 plus the continuation 641-874 with one coverage gap at 808; 83 blocked rows read from chapter text cannot move past what is held, and the novel runs on (upstream length unchecked) | Coverage line: `library_coverage.py --series Regressor`. Default: a polite capture of the translator's chapters for 808 and 875+ (one page per request), else Z-Library by md5; stop on any non-`not_found` Anna's error (AR52-AR55). Dial: skip 875+ if the next pass reads only the held range |
| DL123 | *Re:Zero* web novel beyond the held arcs: Arc 2 after chapter 49 (the live list stopped at 49), Arc 10 after chapter 26 (ongoing), later arcs, and a check that Arc 1 (22 chapters held, 24 listed) is whole (proposal, M1) | 106 blocked rows; the ledger reads web-novel arcs because the light novels run behind them. Arc 3 and Arc 4 are held; arcs 5-9 are complete | Witch Cult table of contents through the polite transport (robots checked, paced), as in the Nov 3 round. Arc 2 chapters 20-49 came from Pandemonium via Weibao's Chrome; read the same list again before asking for more. No quota spent |
| DL124 | *The Legendary Mechanic* chapter 811 and the tail after the held 1463 parts (proposal, M3) | 180 blocked rows; one chapter gap at 811 and a tail of unknown length. The coverage tool's chapter maximum (8111) is a title-number artifact, so the upstream total needs an author-page read before any capture | Check the author's table of contents by polite read (no download), then a capture of the gap and tail. Edition note: the held file is the author's English fan edition |
| DL125 | *I Am the Fated Villain*: the held file is a machine translation (Gemini 2.5 Flash, Calibre 14) with 128 parts under chapter headings that run to 1,924; look for a human-translated edition and confirm what each part holds (proposal, M2) | 226 blocked rows, the third-largest ledger; a machine-translated source is a weaker base for chapter-tier checks (R5) and for exact effect wording | First a reader pass on the held parts (no quota). Then a Z-Library or Anna's title search for a fan-translated edition; keep both editions apart and name the one each label read |
| DL126 | *Reincarnation Paradise* (machine translation, parts 4,620 with chapter gaps near 1396, 1698, 2191 and 2221) and *Second Life Ranker* (#1-#805 from a scraper, gaps near 99, 156, 272 and 368) (proposal, M11) | Both are worlds with no ledger yet; their first cells read chapter text, so gaps cap the power and artifact cells | Gap-fill captures by polite transport where an author or translator page exists; a human edition of either replaces the machine file |
| DL127 | *Hunter x Hunter* manga, chapters 1-400 (Yoshihiro Togashi), as CBZ for the governed manhwa/manga downloader (proposal, M5) | Nen is the cleanest vow-cost and power-interaction exemplar, census rank 9, and no chapters are held; vow-cost has 0 ledger rows and 8 inferred worlds | Governor queue (DL110 P5 moves up to P2 for this title); no A/Z quota. Text through the held Apple Vision OCR pipeline, as for Jujutsu Kaisen (277 chapters) and Bleach (214). Dial: the Bleach remainder after chapter 214 follows |
| DL128 | World of Darkness line: *Vampire: The Masquerade* V5 core, *Mage: The Ascension* 20th Anniversary, *Werewolf: The Apocalypse* 20th and *Wraith: The Oblivion* (proposal, M6) | Five new worlds for the setting-worlds lane (PWC37): soul-state (4 worlds, 82 rows), mind-binding (24 worlds), form-transformation (21) and power-interaction (32). Not held when ranked (`library_coverage.py`, 2026-11-17: zero Vampire, Mage, Werewolf, Changeling or Wraith title) | A/Z by md5, else buy; one core per line first. Check the setting-worlds and TTRPG palette lists at merge to avoid a second ask **Write-back 2026-11-17 (book lane, Weibao approved the pull):** held Vampire the Masquerade 5th Edition Core Rulebook (55.4 MB, 58091952 bytes, SHA-256 `6a5e4fa36fcb3499a546e53f509a12e4398ea2ce3eaaadf38612d6a4bd68aee4`, MD5 `b03f491c0812dd64116988b292f36afd`, Anna's fast, 2026-11-17); Wraith the Oblivion 20th Anniversary (102.9 MB, 107919119 bytes, SHA-256 `596bd29276093b312f6d4f6b9c31336b4e24e745f2c84d67a465b5c7f05b5b99`, MD5 `c6ae675c9c6de3a8b9323d062bfc3f5b`, Anna's fast, 2026-11-17). Still wanted: Mage 20th and Werewolf 20th (not found in Z-Library search 2026-11-17; the search surfaced Wraith and Vampire). |
| DL129 | The Cosmere beyond the held Mistborn: *The Stormlight Archive* 2-4 (*The Way of Kings* is the one held), *Warbreaker*, *Elantris*, *Arcanum Unbounded* and *Mistborn: The Secret History* (proposal, M7) | A new Stormlight world (surgebinding and spren bonds: familiar-summon, mind-binding) and a deeper Mistborn, census rank 11; Investiture links the worlds, which suits the crossing rules (WER) | A/Z by md5. First book plus one later book per series first, as DL108 did **Write-back 2026-11-17 (book lane, Weibao approved the pull):** held Words of Radiance (16.9 MB, 17727950 bytes, SHA-256 `0ede9183928d49afc9dbde87acae7a385495a67774d5e9d522529f521eae7ea2`, MD5 `6f0b4762ec07c27770e63862486df002`, Anna's fast, 2026-11-17); Elantris Tenth Anniversary (8.0 MB, 8402456 bytes, SHA-256 `534edd01e1313a0b93c97d0f802f635eb60c92bf678133bb9b265ce44e4f5b90`, MD5 `4e642307384efcd681e5516c4ff6845b`, Anna's fast, 2026-11-17); Warbreaker (9.2 MB, 9672486 bytes, SHA-256 `bbc028a5b9b6ccb11cef1946bfbe7c16aa2c90536344c873aad9d33bd24c72de`, MD5 `c1ba5f9612826f5351f27946830c2e5a`, Anna's fast, 2026-11-17); Arcanum Unbounded (31.1 MB, 32585335 bytes, SHA-256 `ce73ca13b1e0949e11d0281c21c2a59bbfdc3d4d63f0b0365638e2142aa421a0`, MD5 `c752596a340d44732e2f4e2bdf7234fc`, Anna's fast, 2026-11-17); Mistborn Secret History (4.2 MB, 4366411 bytes, SHA-256 `46fed712d82d57b55d00c7954781f7e99b4677d4847df3df8b4129c5b8ab8799`, MD5 `0ee8c757d107ed69ce187cdb0ddefb4e`, Anna's fast, 2026-11-17). **Write-back 2026-11-20:** ~~*Oathbringer* (3) and *Rhythm of War* (4)~~ held. [Nov. 20 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-20). **Nov. 21:** ~~*Wind and Truth* (5)~~ held. Closed by the [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). |
| DL130 | *Exalted* 3e Charms supplements (Solars, Lunars, Sidereals, Abyssals) and a check of which edition the held "Exalted Core Rulebook (Onyx Path)" is (proposal, M8) | Item-bound power (artifacts and hearthstones), fate manipulation (Sidereal Charms: divination-fate, 4 worlds) and shapeshifting (Lunars: form-transformation); a distinct world of mortals rising to Exalted | Edition check first (no quota), then A/Z by md5, else buy **Write-back 2026-11-17 (book lane, Weibao approved the pull):** held Exalted 3e Abyssals Sworn to the Grave (62.5 MB, 65553915 bytes, SHA-256 `bd4ddcfe548c6b747edbf2d3a28f5fcfb7fef607b6127de1993208d7236f20d6`, MD5 `8a0e2462616ce0cf6d37362a6fb06b15`, Z-Library, 2026-11-17); Exalted Essence (3e) (38.9 MB, 40840985 bytes, SHA-256 `16f40afa4dc8a6b98fb15a0ed736bebe0d95b895e7c3695cbf78dd6df27270d9`, MD5 `24bca8fcf4cabf25dfe3bf53c8fa36ce`, Anna's fast, 2026-11-17). Still wanted: Solars, Lunars, Sidereals 3e Charms books (not found by search, which returned 2e Manuals, a different edition). Core edition check still open. |
| DL131 | *Earthdawn* (Fourth Edition core and Player's Guide) (proposal, M9) | Thread magic ties a character's rank to named items, the clearest tabletop model for item-bound-power (187 rows, 20 worlds) | A/Z by md5, else buy **Write-back 2026-11-17 (book lane, Weibao approved the pull):** held Earthdawn Fourth Edition Player's Guide (49.8 MB, 52194462 bytes, SHA-256 `b2e7d061eef115889cf90cd1e56e5cd4cf0831de9f72fecadeb6e6a7615836ab`, MD5 `f3a7c95a2e2ea3106091aa8e7ea1c663`, Anna's fast, 2026-11-17). Still wanted: Gamemaster's Guide / Companion. |
| DL132 | *Lancer* core book (Massif Press) (proposal) | A mech-chassis world with licences, heat and structure; a distinct stat-and-loadout engine for the rules lane | A/Z, else buy; the publisher also posts a free starter. Dial: skip if the TTRPG lane already lists it |
| DL133 | *Dark Heresy* and *Black Crusade* (Fantasy Flight, 40k) (proposal) | Wrath and Glory, Rogue Trader and the 9th edition core are held; Corruption and the Warp as an area field (area-field: 26 worlds) come through these | A/Z by md5 **Write-back 2026-11-17 (book lane, Weibao approved the pull):** held Dark Heresy Core Rulebook 2nd Edition (63.2 MB, 66285906 bytes, SHA-256 `50ddb5f1095af3953a042226992d93534b95b807aa9ed1f27391e2ce8c4574c4`, MD5 `0bbda2616b4f8fe4161b451ab984862c`, Anna's fast, 2026-11-17); Black Crusade Core Rulebook (108.0 MB, 113296660 bytes, SHA-256 `dc93781dc4db857b2b86922128df44d17e31e65063f562ac401497e3077f4e00`, MD5 `c3882d5ac02abf1b0ced1eb882727ed4`, Anna's fast, 2026-11-17). |
| DL134 | *Hero System* 6th Edition and *Champions* (proposal) | Powers built from effects, advantages and limitations, so costs track mechanisms (AD38); a counterpart to the held Mutants & Masterminds | A/Z by md5, else buy |
| DL135 | *The Dresden Files RPG* (Evil Hat; Fate Core SRD is free) (proposal) | The Dresden Files wiki world is census rank 17 with vow-cost and mind-binding unfilled; the Laws, oaths and True Names are rules there; the 18 novels are held | Free SRD first (no quota); the two core books by A/Z |
| DL136 | D&D setting books that add worlds: *Dark Sun* (Athas), *Planescape* (the Great Wheel), *Spelljammer* (proposal) | Defiling as a terrain cost, planar travel as a world-crossing rule (WER), and ships between worlds; D&D has full weight in the TTRPG lanes (2026-11-17) | A/Z by md5; held: Eberron, Ravenloft, Mystara GAZ1-14, Forgotten Realms. Old editions first |
| DL137 | *Death After Death* (DWinchester), the roguelike isekai (proposal, M10) | The one ledgered world with no edition on disk (`none:` cells, 10 corpora). Anna's, Z-Library, Royal Road and Scribble Hub (HTTP 403 in the polite transport) are closed | Weibao decides whether to buy a retail copy if one exists; the 403 route stays closed (AGENTS.md: do not reroute a refusal) |
| DL138 | Register-only: the *我有一个修仙模拟器* capture (285 chapters on disk) and the Fanren Simulator capture, chapters 30-31 and 42-184 (proposal) | The two simulator-cultivation worlds read as `missing` in the worlds ledger although most text is on disk; the Fanren pack stays thin until the rest is captured | Register on request; the remaining chapters by polite capture, no quota |
| DL139 | Registry fixes, not downloads: worlds the ledger lists with no library entry although the text is held (Legendary Mechanic, Omniscient Reader novel in Calibre 18 and 44, Fated Villain Calibre 14, Solo Leveling, A Novel Concept, Labyrinth of the Mad God, Speedrunning the Multiverse, You Have Died Again, Hunger Games, Mistborn, Dresden Files, Fate/Zero volume 1 in Calibre 145) (proposal) | Their cells read `missing: <source>` as if a book were absent; the next-cells lane ranks by blocked slugs and would otherwise chase books already held | Edit the registry in `scripts/worlds_ledger.mjs` and rerun; the next-cells lane owns it. No acquisition |
| DL118 | Cyberpunk Wiki dump (`cyberpunk.fandom.com`; PWC38 proposal 2026-11-17) | The world's places, factions, ware and people as pages; the world row has no wiki tier until it exists | Route to check, nothing fetched: Fandom's own "current pages" dump on `Special:Statistics` if the wiki offers one, else the Archive Team WikiTeam3 dumper run politely. The main page's cached count is 12,568 pages (unverified); size unknown. Fandom answered the 2026-11-03 scouts with 403/402 on automated reads, so no bot check is bypassed. **Weibao's yes per file, with the size from the route, before any fetch.** |
| DL119 | Shadowrun wiki dump (host unchecked; search found none) and the free *Shadowrun, Sixth World* Quick Start Rules (Catalyst Game Labs; PWC38 proposal 2026-11-17) | Essence-budget ware, magic and the net in one world, the closest rival to cyberpunk's own mechanisms | Search found no Shadowrun wiki dump and no SRD. The Quick Start is free but its Roll20 listing says it is readable only inside Roll20; the publisher's own page (`shadowrunsixthworld.com`) is the route to check. Size unknown. Weibao's yes per file. The 5e core, *Run Faster* and four 6e books are already held (DL106). |
| DL120 | Free official R. Talsorian items: the 11-page *Cyberpunk RED* Jumpstart conversion guide and *Cyberpunk RED Easy Mode* (PWC38 proposal 2026-11-17) | Small free supplements the store lists at no price; the Jumpstart Kit and RED core are already held (DL106) | `talsorianstore.com`, free listings. Size unknown, expected small. Weibao's yes per file. |
| DL121 | Replacement copies of held PDFs that carry no usable text (PWC37 screening, 2026-11-17): *Cyberpunk RED* core (`c97bd6967f`, the screener stops on a broken cross-reference table), *Cyberpunk 2020* core 2e (`c1f21f1e9a`, 258 pages with about 10,000 words of text), *Warhammer 40,000* 9th edition core (truncated: 37 of 383 pages carry text and the rest render blank), *Warhammer Fantasy Roleplay* 4e core, *Numenera Into the Outside* and *The Strange In Translation* (each reports 0 pages, broken cross-reference table) | The settings on the PWC37 list whose books could not be read; the world rows say `none:` for them until a readable copy is held | Anna's by md5 (A/Z quota), else buy; each file's md5 and size to be named at fetch time. Weibao's yes per file. |
| DL140 | Re:Zero wiki (rezero.fandom.com), whole-wiki text dump (PWC39) | **Held 2026-11-17** (Weibao's yes, confirmed in chat): WikiTeam text-only history XML from the Internet Archive item `wiki-rezero.fandom.com-20231208` (no Fandom host contacted), 10,001,972 bytes compressed (548,602,378 decoded, 95,830 revisions), md5 `6a51b07819c2d4d962efbbd31ebb50cb` matches IA, SHA-256 `2f5d956a3c59b7742c3abb4eb2bf60ca3deaa96995a6c4a163d3272a48c4fa6d`; stored at `~/.codex/research/wikis/rezero.fandom.com/dump/`, decode with `zstd -dc --long=30`; registered in DUMPS.json. Not found on IA, so not held: worm.fandom.com (S3 dump archive-class, API 402), The Perfect Run wiki (host not identified). | Internet Archive, direct |
| DL141 | JoJo light novels and the Fandom JoJo wiki (jojo-collector, 2026-11-18) | Conceptual Stand abilities for the engine stress test | **Held 2026-11-18:** six novels (Jorge Joestar, Purple Haze Feedback, Purple Smoke Distortion, Over Heaven, The Book, Light Novel Collection) and the 2020 Fandom wiki dump ([report](research/power-systems/anime-manga/JOJO_AND_EXTREME_POWERS_COLLECTION_2026-11-18.md)). Still wanted: Rohan, Golden Heart Golden Ring and Crazy Diamond's Demonic Heartbreak (no English edition found); current jojowiki.com stats (Cloudflare closed the host) Route: Report ids |
| DL142 | *A Certain Magical Index* and Railgun light novels | Ability-by-law power system | **Held:** original Index 1–22, New Testament 1–15, Railgun novel and SS1–SS3. **Write-back 2026-11-20:** ~~New Testament 6, 9, 12–15~~ held as English EPUBs from Z-Library. [Nov. 20 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-20). **Nov. 21:** ~~*New Testament* 16–22 and *22 Reverse*~~ held as English EPUBs. ~~*Genesis Testament* 1–11~~ held. ~~*Genesis Testament* 12–15~~ held as English EPUBs. Still wanted: *Genesis Testament* 16 onward and the previously listed Railgun main volumes. [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). **Nov. 24:** ~~*Railgun: Cold Game* and *A Superfluous Story, or A Certain Incident’s End*~~ held as English EPUBs. *Genesis Testament* 16 has a complete web translation and remains wanted for offline intake. [Nov. 24 intake](LIBRARY_INDEX.md#quota-intake-2026-11-24). |
| DL143 | JoJo manga, game move lists and TTRPG rules | Stand and Hamon abilities as drawn, and as games coded them | Manga: all eight parts queued in the governor, moved up 2026-11-18, none downloaded. Games and TTRPG: no reachable published source found Route: Unhalt at the 18:00 window; game wikis need a decision on the Cloudflare route |

DL111 queue follow-up, 2026-11-09. The Naruto halt was a title and chapter
number collision between two MangaPill series called *Naruto Shinden Series*.
The held chapter belongs to source series 8133 and the pending chapter belongs
to the separately described 8134 collection. The four comic batches now follow
the books job and precede the older manga queue. The Naruto entries remain
pending, and the governor's halt was cleared. All 410 comic candidates passed
the local registration, prior-job and duplicate-title checks. The battery
pause was active when checked.

Order (proposal): the free ones first (DL94, then DL92 and DL93 once Weibao
grabs them). Then DL96 and DL95 for daily life, then DL98 and DL103 for
settlements. The rest go when a world or pass needs them.

## W13. Modern-day rulebooks, 2026-11-13

| Code | Item | Status |
|---|---|---|
| DL118 | *Modern AGE Basic Rulebook* (Green Ronin), English, GRR6301, ISBN 9781934547915 | Full [192-page rulebook](https://greenroninstore.com/products/modern-age-basic-rulebook-pdf) wanted. Exact-title and product-code catalogue searches yielded no match, and the indexed PDF returned HTTP 404. The flipbook route returned HTTP 403. A [Telegram archive listing](https://t.me/TheAmberRoom/1233) has unverified contents and no direct public download. **2026-11-15:** Exact title, product code and ISBN had no matching Anna’s listing. [Nov 15 follow-up](LIBRARY_INDEX.md#spider-and-mystara-follow-up-2026-11-15) **Nov. 20:** ISBN search found no Z-Library match and the indexed external PDF returned 404. Still wanted. [Nov. 20 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-20). **Nov. 21:** The indexed exact PDF returned 404 and the flipbook returned 403. The full PDF remains open. [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). |
| DL119 | *Unknown Armies* 3e English core set: *Book One: Play* (AG6031), *Book Two: Run* (AG6032), *Book Three: Reveal* (AG6033) | All three [Atlas Games core volumes](https://atlas-games.com/unknownarmies) wanted. Checked catalogues surfaced second edition, Spanish third edition, or supplements. Two file-host routes returned HTTP 403 and 404. A [Telegram post](https://t.me/s/TheAmberRoom?before=2192) lists all three PDFs, but its public page links to Telegram messages rather than file downloads. **2026-11-15:** Anna’s title, stock codes and single-volume and deluxe ISBN searches produced no matching English 3e core record. [Nov 15 follow-up](LIBRARY_INDEX.md#spider-and-mystara-follow-up-2026-11-15) **Nov. 20:** The alternate listing did not yield the core books. Still wanted: all three English volumes. [Nov. 20 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-20). **Nov. 21:** The alternate host’s third-edition directory returned 404. The English core set remains open. [Nov. 21 continuation receipt](LIBRARY_INDEX.md#wishlist-continuations-and-duplicate-audit-2026-11-21). |

## W14. Cyberpunk and Warhammer coverage, 2026-11-15

Scope is tabletop core coverage and selected adjacent books. On-disk Source
Library records, Calibre and the intake receipts were checked by title and
edition. The proposals below extend the wishlist where the missing products
serve a project use. They have no verified acquisition route yet.

| Code | Finding and disposition |
|---|---|
| MC17 | **ACT NOW.** Closed the two *Spider* gaps and completed the numbered Mystara set. Keep DL118 and DL119 open after the Anna’s title, code and ISBN searches. [Follow-up receipt](LIBRARY_INDEX.md#spider-and-mystara-follow-up-2026-11-15) |
| MC18 | **ACT NOW.** Reopened DL43. The apparent *Warhammer Fantasy Roleplay* 4e core is *Deft Steps, Light Fingers* (`5b9abafc84`), as the Nov 10 mislabel note already established. *Up in Arms* is held. The 40K RPG shelf has *Imperium Maledictum*, *Wrath & Glory* (`9a7f3a72e5d4`), *Rogue Trader* and *Stars of Inequity*. *Soulbound* core is also indexed. The separate 40K miniatures shelf has the ninth-edition book. [WFRP range](https://cubicle7games.com/en_US/our-games/warhammer-fantasy-roleplay) · [40K RPG ranges](https://cubicle7games.com/en_US/our-games/warhammer-40k-roleplay-imperium-maledictum) |
| MC19 | **ACCOUNT FOR NOW.** The major Cyberpunk tabletop editions sampled are covered: 2013’s three booklets, 2020 second edition, *CyberGeneration* first edition, v3.0, RED and the *Edgerunners Mission Kit*. RED holdings include *Black Chrome*, *Danger Gal Dossier* and *Street Stories*. Start any deeper pass from the publisher’s free DLC and target the missing commercial products in DL120. [Cyberpunk editions](https://rtalsoriangames.com/cyberpunk/) · [Official downloads](https://rtalsoriangames.com/downloadable-content/) |
| MC20 | **ACCOUNT FOR NOW.** D&D’s revised three-book core is held, including the verified 2025 *Monster Manual*. All four launch *Pathfinder* 2e Remaster core books are held. Also on disk: *Shadowrun* 6e core and four focus books, *Call of Cthulhu* 7e *Keeper Rulebook*, both *Delta Green* full core books, and *Traveller Core Rulebook Update 2022*. This check covers those core titles and the named supplements. [D&D revised core](https://www.dndbeyond.com/community-update/) · [Paizo Remaster](https://paizo.com/pathfinder/remaster/faq) · [Chaosium 7e range](https://www.chaosium.com/call-of-cthulhu-rules/) |
| MC21 | **LATER / DELEGATE.** Prioritize DL43, DL120’s *Single Player Mode*, then DL121. DL122 gives a free baseline for the miniatures rules. DL123 is an optional fiction sample. A bounded, low-effort exact-edition search can close each row once a matched file is registered and passes its reader checks. |

| Code | Proposed gap | Project use and route |
|---|---|---|
| DL120 | ~~*Interface RED* 1–5, *Tales of the RED: Hope Reborn*, and *Cyberpunk RED: Single Player Mode* (CR3121, AnyFlip reader PDF)~~ held. Still wanted: *Cyberpunk RED Data Pack* (CR3021), with the booklet welcome first. | Anna’s supplied six English PDFs on Nov 16. The browser export supplied all 106 *Single Player Mode* pages. Searches found no additional download of the 36-page *Data Pack* booklet. [Supplement intake](LIBRARY_INDEX.md#cyberpunk-red-supplements-intake-2026-11-16) · [Reader PDF receipt](LIBRARY_INDEX.md#single-player-mode-reader-pdf-2026-11-16) · [Other-source check](#dl120-other-source-check-2026-11-16) **Nov. 20:** Still wanted: full CR3021 and the separate 36-page booklet. The Scribd viewer listing remains the same and no complete file was obtained. [Nov. 20 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-20). |
| DL121 | ~~*Warhammer: The Old World Roleplaying Game* English *Player’s Guide* and *Gamemaster’s Guide*~~ held | Anna’s supplied both core books. All 191 and 192 PDF pages rendered, respectively. The *Player’s Guide* has an unsorted PDF metadata tree warning. Closed by the [Nov 16 intake](LIBRARY_INDEX.md#warhammer-and-cyberpunk-wishlist-follow-up-2026-11-16). |
| DL122 | *Warhammer 40,000* 11th-edition core rules | The publisher offers a free download. This is the current miniatures rules baseline. [Games Workshop](https://www.warhammer-community.com/en-gb/articles/nhqt9wx3/new40k-rules-download-the-free-core-rules-now/) |
| DL123 | ~~*Cyberpunk 2077: No Coincidence* and Dan Abnett’s 2022 *Eisenhorn: The Omnibus*~~ held 2026-11-20 | They cover Night City outside the RPG books and Imperial investigations in 40K. [Orbit](https://www.hachettebookgroup.com/hachette-book-group-news/orbit-and-cd-projekt-red-announce-novel-set-in-cyberpunk-2077-universe/) · [Black Library](https://www.blacklibrary.com/warhammer-40000/novels/ebook-eisenhorn-the-omnibus-eng-2022.html) [Nov. 20 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-20). |

### DL120 other-source check, 2026-11-16

- **CR3121.** AnyFlip displays 106 pages of the English v1.0 guide, ISBN 9781950911363. The viewer exposes reading controls and no PDF export. The matching 106-page Scribd listing redirects its Download control to sign-up. The ISBN lookup on Z-Library found no file. [AnyFlip edition](https://anyflip.com/imype/umyt/basic) · [Scribd listing](https://www.scribd.com/document/1011996997/Single-Player-Mode) · [Publisher release](https://rtalsoriangames.com/2025/09/16/cyberpunk-red-alert-single-player-mode-single-player-mode-now-released/)
- **CR3021.** The 36-page Scribd listing covers the original booklet. The full product includes the twelve maps and character sheets, as confirmed by the publisher. Bits and Mortar lists a digital copy for eligible print buyers. [Booklet listing](https://www.scribd.com/document/531770344/CP3021-Cyberpunk-RED-Data-Pack-Booklet-OEF-2021-10-01) · [Publisher PDF pack](https://talsorianstore.com/products/cyberpunk-red-data-pack-digital-pdf) · [Bits and Mortar](https://bits-and-mortar.com/publisher/r-talsorian-games)

The local coverage check found neither title. LibGen's connector failed to parse results. No files were acquired and both editions remain open. Any intake should compare title, product code and contents against existing records, then compare hashes before registering a copy.

**Reader-copy follow-up, Nov 16.** Weibao requested the AnyFlip reader copy and the standalone Data Pack booklet, with the full CR3021 pack kept open. The paced capture stopped on HTTP 403 at AnyFlip’s robots endpoint before retrieving pages. The Scribd booklet’s Download control opened a sign-up prompt. Searches for the booklet title and CP3021 on Anna’s and Z-Library found no matching file. [Library access note](LIBRARY_INDEX.md#cyberpunk-red-online-reader-access-2026-11-16)

**Browser-export follow-up, Nov 16.** Saved and registered one image-based CR3121 reader PDF, verified against all 106 browser page images. Further booklet searches by ISBN 9781950911141, filename, credits and alternate code found no downloadable 36-page match. The [publisher PDF pack](https://talsorianstore.com/products/cyberpunk-red-data-pack-digital-pdf) remains the full-pack listing. [Reader PDF receipt](LIBRARY_INDEX.md#single-player-mode-reader-pdf-2026-11-16)

**Scribd booklet export check, Nov 16.** The [36-page viewer](https://www.scribd.com/document/531770344/CP3021-Cyberpunk-RED-Data-Pack-Booklet-OEF-2021-10-01) reached the final page. Its Print control requires downloading first. The browser exported a test image from page 36, but could not export the complete rendered middle-page sample as a single image. Browser security rejected a local export probe. No 36-page PDF was verified or registered. The booklet and the full CR3021 pack remain open.

## W15. Sources for the next build questions, 2026-11-20

These are acquisition and reading candidates. The [Nov. 20 follow-up](LIBRARY_INDEX.md#next-wishlist-pulls-2026-11-20) records which editions are now held.

| Code | Candidate | What to inspect first |
|---|---|---|
| DL144 | ~~*My House of Horrors*, by I Fix Air-Conditioner~~ held 2026-11-20 | Two English EPUBs cover all 1,211 numbered chapters in the publisher’s catalogue. Use chapters 25–27 to study how a scenario reward changes what the protagonist can operate after returning. [Scenario lane](SCENARIO_SOURCE_SHELVES_AND_BATCHES_2026-11-19.md). |
| DL145 | ~~*Night City 2045* full sourcebook, R. Talsorian Games~~ held | Use one district to connect a job, a clinic, a service, and the faction with local authority. The publisher describes 24 districts and over 600 sites. Z-Library returned no exact match. [Publisher](https://rtalsoriangames.com/night-city-2045/). **Nov. 20:** Official *Night City Hook Book* held. Pair it with the already-held *Night City Atlas*. **Nov. 21:** Full sourcebook PDF held, 314 PDF pages including covers. Closed by the [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). |
| DL146 | ~~*Electric Bastionland* full core, Chris McDowall~~ held | Ten Failed Careers in the free edition give a compact comparison for starting situations with tangible consequences from a prior life. [Free edition](https://chrismcdee.itch.io/electric-bastionland-free-edition). **Nov. 20:** The watermarked 42-page DriveThru sample of the Free Edition is held. **Nov. 21:** Full 336-page core PDF held. Closed by the [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). |
| DL147 | ~~*Heart: The City Beneath* core~~ held. Still wanted: free quickstart | The free quickstart gives a bounded expedition to inspect how a calling and its story beats turn pressure into character advancement. [Publisher](https://rowanrookanddecard.com/heart-the-city-beneath-is-now-on-general-release/). **Nov. 20:** The free itch.io download returned HTTP 429 and a mirror returned 404. **Nov. 21:** Full 226-page core PDF held. [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). |

| DL148 | ~~*Mist [Unlimited]* (*薄雾［无限］*), Wei Feng Ji Xu~~ held | First mission for team memory and extraction. Seek the full English story. KK removed its 103-chapter plus three-extra translation. Hai Tang’s official edition spans three volumes, with volume 2 listed as coming soon and volume 3 in production in its October update. [Publisher preview](https://haitangbooks.org/mist/#preview) · [Publisher progress](https://haitangbooks.org/progess-updates/). **Nov. 21:** The English serial EPUB covers 103 chapters and three extras. Closed by the [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). |
| DL149 | ~~*Stonetop* Books I and II, Jeremy Strandberg~~ held | Use the Homefront and steading playbook to trace how seasonal work and shared assets change an inhabited village. Start with the free web reference and publisher play aids. [Publisher](https://www.lampblackandbrimstone.com/) · [Homefront](https://stonetop.cc/homefront.html). **Nov. 21:** Both full PDFs held. Closed by the [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). |
| DL150 | ~~*Mythic Bastionland* core, Chris McDowall~~ held | Trace a myth through its omens across several trips to see how a threat becomes legible during ordinary travel. Use the official quickstart first. [Publisher](https://chrismcdee.itch.io/mythic-bastionland). **Nov. 21:** Full 212-page core PDF held. Closed by the [Nov. 21 intake](LIBRARY_INDEX.md#wishlist-intake-2026-11-21). |
| DL151 | *The Between*, Jason Cordova | Compare one urban investigation at Hargrave House with Tingen. Track the evidence the investigators can get and when a local case exposes a larger threat. [Publisher and play aids](https://www.gauntlet-rpg.com/the-between.html). |
| DL153 | ~~*Hell Difficulty Tutorial* 1–8, Cerim (Aethon)~~ held 2026-11-22; books 7–8 added same day at Weibao's yes. No light novel edition found | Six retail EPUBs from Z-Library; each volume's chapter run is contiguous. No light-novel edition turned up in Z-Library. [Receipt](LIBRARY_INDEX.md#hell-difficulty-tutorial-and-dorothys-forbidden-grimoire-2026-11-22-dl153-dl154) |
| DL154 | ~~*Dorothy’s Forbidden Grimoire* (多萝西的禁密书典), 天使末日~~ held 2026-11-22 | English translation EPUB, 828 chapters, and the Chinese original EPUB (chapters through 828, 尾声). Names spot-checked across all four quarters. Two other English Z-Library candidates (ids 125739136, 124256467) were not downloaded. [Receipt](LIBRARY_INDEX.md#hell-difficulty-tutorial-and-dorothys-forbidden-grimoire-2026-11-22-dl153-dl154) |

**Full-edition search, Nov. 20.** The full *Night City 2045*, *Electric Bastionland*, *Heart*, and *Mist* remain open. Anna’s TLS preflight failed, Z-Library’s desktop route returned a network error, and LibGen’s search could not parse these results. A public listing for the original *Heart* core book and one for *Electric Bastionland* yielded no downloadable files. For *Heart*, prefer the Delve Edition second printing if available. The 106-entry alternate *Mist* catalogue is visible, but the chapter capture route was stopped by a challenge. A separate English mirror returned HTTP 522. No quota or payment was used.

For making, use the already identified open *Ars Magica* 5e text first.
*Covenants* and *Hermetic Projects* offer specific sources for laboratory
upkeep and projects that develop over time. [Atlas Games open corpus](https://www.atlas-games.com/arsmagica/openars).
