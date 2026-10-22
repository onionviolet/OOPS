# YAIR book acquisition and chapter-gap pass

Type: CURRENT-STATE. Audience: developer reference. 2026-10-21, America/New_York.

## Authorized scope and outcome

Weibao requested useful additions across topics, avoiding duplicates and
considering the current books, missing chapters and Reddit recommendations.
This pass selects a finite set of 27 acquisitions from inspected catalogue
results. It does not claim every useful book in existence or all live serial
updates have been captured. No whole-book reading, Calibre import, gameplay
implementation, subscription, purchase, scheduled continuation, commit or push
was performed. Applicable rules: AD32 (resolve routine choices), AD35 (private
source detail), and the research/source-acquisition qualification rules.

F7: All 27 selected EPUBs downloaded and are prepared for local research. The
four omnibus files represent 3 Cradle, 5 Craft Sequence, 17 Spice & Wolf and 10
Malazan books respectively. Together with 23 other files, that is 58 named
volumes represented by 27 downloads. Navigation checks find all named omnibus
volume markers; that is structural coverage, not independent textual authenticity
or completeness. No selected acquisition duplicates a normalized title in the
fresh local EPUB inventory; no new file is byte-identical to an inventoried
existing EPUB. The stock app, existing book files and Calibre libraries were
not modified. Raw and prepared files remain Git-ignored.

F8: Actual local boundaries and numbering anomalies were checked separately.
A Soldier's Life Book 4 already exists outside Calibre, so it was skipped. New
Book 6 has numbered navigation 320–384, following existing Book 5's 244–319.
Bookworm Part 3 now has volumes 1–5, reusing the prior Volume 1, plus Part 4
Volume 1 for academy research. This is not the complete Bookworm series.

F9: Runtime account status after this wave reported 28 used of 30, leaving 2;
one of the 28 was the previous Bookworm acquisition. This is a time-specific
server snapshot, not a reset schedule or a promise about other clients. The
27 new files total 244,240,045 bytes. Each archive passed CRC checking and its
prepared output carries hashes and source locators. Extraction is not reading;
all new reading coverage is `extracted-not-read`.

## Existing-source and duplicate checks

Read-only Calibre metadata queries covered the configured current library and
the older Sync path. An EPUB scan additionally covered Downloads, the current
Calibre folder, and saved project research. It parsed 195 EPUB files with 118
distinct embedded title strings, including an empty-title case; four files
could not be parsed and remain qualified. This inventory is not an exhaustive
search of every storage location or format. Known catalogue titles, aliases,
series volumes and loose sources were considered before selection. Existing
duplicate library entries were preserved, not deleted. Relevant raw inventory
and exceptions remain private.

The shared Z-Library launcher passed a scoped readiness probe. Acquisitions used
the existing desktop companion, serially, with fresh quota checks and one file
link per selected book. Search/metadata are separate from acquisition. The
local research lookup now finds the new Spice & Wolf and Malazan collections,
Dungeon Crawler Carl and all six selected Bookworm volumes with no lookup
warnings in these checks. No library database import was needed.

## Acquired inventory

| Code | Selected catalogue edition | Named volumes | Research reason, not accepted canon | Preparation state |
|---|---|---:|---|---|
| B01 | Cradle: Foundation (Cradle Collection Book 1-3) | 3 | foundation/body training; collected books 1-3 | Prepared unchanged EPUB |
| B02 | Into the Labyrinth: Mage Errant (Book 1) | 1 | affinities, teaching and apprenticeship | Prepared unchanged EPUB |
| B03 | Sufficiently Advanced Magic (Arcane Ascension Book 1) | 1 | attunements, enchanting and trained magic | Prepared unchanged EPUB |
| B04 | Children of Time (Children of Time, Book 1) | 1 | nonhuman embodiment, ecology and inherited knowledge | Prepared unchanged EPUB |
| B05 | The Craft Sequence: (Three Parts Dead, Two Serpents Rise, Full Fathom Five, Last First Snow, Four Roads Cross) | 5 | contracts, divine institutions and magical infrastructure; five-book bundle | Prepared unchanged EPUB |
| B06 | Spice & Wolf Volume 1-17 Omnibus (light novel) | 17 | trade, credit and institutions; 17-volume omnibus | Prepared unchanged EPUB |
| B07 | The Goblin Emperor | 1 | court institutions, etiquette and ordinary governance | Prepared unchanged EPUB |
| B08 | The Curse of Chalion | 1 | faith, obligations and costly divine intervention | Prepared unchanged EPUB |
| B09 | The Traitor Baru Cormorant | 1 | economic and institutional power | Prepared unchanged EPUB |
| B10 | Dungeon Born (The Divine Dungeon Book 1) | 1 | dungeon ecology, creation and visitor incentives | Prepared unchanged EPUB |
| B11 | Soulhome (The Weirkey Chronicles Book 1) | 1 | material-dependent soul architecture | Prepared unchanged EPUB |
| B12 | Knightmare Arcanist | 1 | creature bonds, partner agency and training | Prepared unchanged EPUB |
| B13 | On Lavender Tides (Jekua Book 1) | 1 | summoning, imprinting and travel | Prepared unchanged EPUB |
| B14 | Dungeon Crawler Carl | 1 | class choices, rewards and floor transitions | Prepared from reviewed derivative; original retained |
| B15 | All the Skills A Deck-Building LitRPG | 1 | card combinations and acquisition | Prepared unchanged EPUB |
| B16 | Life in a Medieval Village | 1 | historically qualified agriculture, work and village institutions | Prepared unchanged EPUB |
| B17 | The Knowledge: How to Rebuild Our World From Scratch | 1 | craft/production prerequisites and knowledge chains | Prepared unchanged EPUB |
| B18 | The Time Traveller's Guide to Medieval England: A Handbook for Visitors to the Fourteenth Century | 1 | era-specific daily life and travel | Prepared unchanged EPUB |
| B19 | Cathedral, Forge, and Waterwheel: Technology and Invention in the Middle Ages | 1 | mechanical technology and production systems | Prepared unchanged EPUB |
| B20 | Ascendance of a Bookworm: Part 3 Volume 2 | 1 | complete the selected household/education arc | Prepared unchanged EPUB |
| B21 | Ascendance of a Bookworm: Part 3 Adopted Daughter of an Archduke Volume 3 | 1 | complete the selected household/education arc | Prepared unchanged EPUB |
| B22 | Ascendance of a Bookworm: Part 3 Adopted Daughter of an Archduke Volume 4 | 1 | complete the selected household/education arc | Prepared unchanged EPUB |
| B23 | Ascendance of a Bookworm: Part 3 Adopted Daughter of an Archduke Volume 5 | 1 | complete the selected household/education arc | Prepared unchanged EPUB |
| B24 | Ascendance of a Bookworm: Part 4 Founder of the Royal Academy’s So-Called Library Committee Volume 1 | 1 | academy education and institutional duties | Prepared unchanged EPUB |
| B25 | The Complete Malazan Book of the Fallen | 10 | contrasting large-world institutions, cultures and magic; ten-book bundle | Prepared unchanged EPUB |
| B26 | The Way of Kings (The Stormlight Archive, Book 1) | 1 | weather, ecology, oaths and material cultures | Prepared unchanged EPUB |
| B27 | A Soldier's Life Book 6: Adventures in Godok | 1 | extend existing books 1-5 without replacing them | Prepared unchanged EPUB |

## Completeness findings and unresolved source gaps

G1: Existing Shadow Slave EPUBs provide numbered headings 1–1840, 1841–2260,
2261–2720 and 2721–3000, a contiguous union. The
[primary Webnovel page](https://www.webnovel.com/book/shadow-slave_22196546206090805)
showed 3,223 chapters when checked. The later 3001–3223 range is not captured
here. The bounded desktop catalogue searches found many older/overlapping
compilations, plus an unspecified newer edition with no declared chapter cutoff.
It was not acquired on year or file size alone. No alternate mirror or scraper
was launched to fill that range, and the work is not labelled current-complete.

G2: Circle of Inevitability's existing source owner already records its missing
printed 1026 label and an unresolved possible transition. The
[official catalogue](https://www.webnovel.com/book/25759730405792805)
independently lists 1026 and ends at 1181. Opening the actual
[1026 page](https://www.webnovel.com/book/25759730405792805/82810174317844482)
and [1181 page](https://www.webnovel.com/book/25759730405792805/80839082694991680)
returned only initial previews with an app-continuation notice. No full bodies
were captured, no app-only or paid access was inferred, and no source text was
invented. Current previews are locators, not repaired chapters. The prior
private `full-book/circle-of-inevitability/SOURCE_LIMITS.md` remains unchanged.

G3: Regressor's Tale's apparent 143/211 gaps are heading-format anomalies:
both corresponding HTML members exist, with substantial text. Its local
numbered headings reach 640; current translation coverage was not independently
established. Unspecified larger catalogue entries were not labelled upgrades.
Legendary Mechanic has an intervening header mistyped 8111 between 810 and 812;
no missing body is established. Soldier's Life 1, Second Life Ranker and Genetic
Ascension have other candidate heading gaps, recorded privately. These need
source-qualified inspection before declaring missing prose or requesting another
book. Archive-member counts do not substitute for chapter numbers.

G4: Dungeon Crawler Carl's original EPUB passed ZIP checks but repeats the same
first spine idref consecutively. The strict preparer correctly refused it.
A separately labelled derived EPUB removes only the second reference. All
archive entries remain, and every member except the OPF is byte-identical to the
original. Original download, original hash, changed member, derived hash and
review receipt are retained. The reviewed derivative prepared 63 spine entries
and is discoverable through normal local lookup. This is explicit packaging
repair, not a second download or a silent source overwrite.

## Reddit and publisher evidence

R1: Reddit was used as reader opinion about promising source contrasts, not as
an objective definition of peak, a completeness catalogue, or canonical evidence.
[ProgressionFantasy's magic-system discussion](https://www.reddit.com/r/ProgressionFantasy/comments/1lb9fca/which_magic_system_is_your_favorite_why/)
and [worldbuilding thread](https://www.reddit.com/r/ProgressionFantasy/comments/13kcwnf/which_series_has_your_favorite_worldbuilding/)
include Mage Errant, Weirkey, Arcane Ascension and Cradle, with differing views
about their strengths. Mother of Learning is also recommended there but already
exists locally and was not downloaded again.

R2: [Fantasy's broad worldbuilding discussion](https://www.reddit.com/r/Fantasy/comments/1surlu7/best_worldbuilding_you_have_ever_seen_that/)
provides the Malazan/Stormlight contrast. The
[economics thread](https://www.reddit.com/r/Fantasy/comments/1sz3jy7/economy_in_fantasy/)
and [merchant-economy discussion](https://www.reddit.com/r/Fantasy/comments/eq8elt)
provide reader leads for Spice & Wolf. Recommendations establish interest,
not historically valid economic rules or a universal YAIR template.

R3: Source identities and coverage were cross-checked against
[John Bierce's books](https://johnbierce.com/books/),
[Will Wight's Cradle page](https://www.willwight.com/cradle.html),
[Spice & Wolf's 17-volume anniversary edition](https://yenpress.com/titles/9780316469920-spice-and-wolf-anniversary-collector-s-edition),
[Macmillan's Malazan series catalogue](https://us.macmillan.com/series/malazanbookofthefallen),
[Craft Sequence's publisher bundle](https://us.macmillan.com/books/9781250361042/thecraftsequence/),
[Children of Time's publisher](https://www.panmacmillan.com/authors/adrian-tchaikovsky/children-of-time/9781447273301),
[The Knowledge's publisher](https://www.penguinrandomhouse.com/books/312366/the-knowledge-by-lewis-dartnell/)
and [Bookworm's publisher](https://j-novel.club/series/ascendance-of-a-bookworm).
The current Craft publisher page includes six books; our acquired 2017 bundle
contains five, so it is not called the complete current Craft Sequence.
Spice & Wolf covers original volumes 1–17, not all later Spring Log material.
Malazan's ten-book bundle does not include all books in the wider franchise.
Novel-specific detailed mechanisms in the reasons column remain reading targets.
Nonfiction is era/scope-qualified reference, not universal historical law or
real-world safety/medical guidance.

## Saved evidence and next boundary

ACT NOW, completed: inspect existing sources, avoid redundant selected editions,
acquire the reviewed set, verify CRC/cache/metadata, prepare private output,
check omnibus volume markers, and investigate candidate chapter gaps.

ACCOUNT FOR NOW: preserve original sources and unknown reading/translation
coverage; distinguish image-only pages, collected-volume structure, heading
mistakes, semantic continuity and current publication status. The 27 new books
are source availability, not new source-backed game design.

LATER: full bodies for the open Shadow Slave/COI ranges require a verified
accessible source with the actual cutoff/edition. A bounded semantic inspection
can resolve the remaining suspected gaps. Whole-book readers and gameplay
changes need their own finite scope; none ran here. No automatic later download
or notification was scheduled.

The authoritative private run evidence is in
`docs/research/novels/zlibrary/acquisition-wave-2026-10-21/`: LOCAL_EPUB_INVENTORY,
ACQUISITION_PLAN, SEARCH_RESULTS, LOCAL_CHAPTER_CHECK, CHAPTER_STATUS,
OMNIBUS_VOLUME_CHECK, PROGRESS, DCC_SPINE_REVIEW and FINAL_CHECK JSON files.
Per-edition sources, acquisition records, derived-review receipts and prepared
chapter/hash receipts are in adjacent private edition directories. Personal
catalogue rows, book prose and session information are excluded from this report.

## More-to-consider round 2: missing books, 2026-10-21

Weibao asked whether books remain missing and for further considerations. This
round checks the saved baseline inventory plus all 27 acquired metadata records;
it is prioritization, not another acquisition or an accepted gameplay roster.
The `more-to-consider` skill was applied to coverage, source dependencies and
contrasting systems. No additional quota was consumed in this round.

### ACT NOW, completed

F10: Correct the distinction between a useful sample and a complete reference.
The five-book Craft bundle lacks *The Ruin of Angels*, which
[Macmillan identifies as the sixth Craft Sequence novel](https://us.macmillan.com/books/9780765395894/theruinofangels/).
The Malazan bundle covers the ten Book of the Fallen novels, not the wider
franchise. Spice & Wolf 1–17 is its original run rather than all later books.
Bookworm coverage remains Part 3 volumes 1–5 and Part 4 volume 1. Weirkey,
Mage Errant, Arcane Ascension, Dungeon Crawler Carl and other first-volume
acquisitions are entry-point coverage, not whole-series sources. Cradle covers
books 1–3, not 4–12. Later mechanics need their own actual source passages.
Do not present whole-series acquisition as necessary for a narrowly selected
first-volume question.

F11: These five candidates have no matching titles in the inspected baseline
EPUB metadata or the new acquisitions. This establishes scoped absence, not
absence from every possible device, PDF archive or differently named compilation.

| Priority/code | Missing candidate | Specific new coverage and limit | Evidence |
|---|---|---|---|
| O6 | *Daily Life in China: On the Eve of the Mongol Invasion, 1250–1276*, Jacques Gernet | Southern Song city life, work, households, food and institutions. Corrects the new nonfiction batch's English/European emphasis. Historical reference for a stated period, not generic cultivation canon. | [Bibliographic/publisher metadata](https://books.google.com/books/about/Daily_Life_in_China.html?id=-ivoynsRDswC) identifies Stanford University Press and describes the contents. |
| O7 | *The Ruin of Angels*, Max Gladstone | Completes the original six-book Craft Sequence alongside our five-book bundle. The detailed relevance of its later mechanisms remains a reading question. | [Publisher edition](https://us.macmillan.com/books/9780765395894/theruinofangels/). |
| O8 | *The Long Price Quartet*, Daniel Abraham, preferably a verified four-book collection | A contrasting candidate for magical institutions, economic dependence and consequences across generations. Reader praise is a selection lead, not audited mechanisms or proof of objective superiority. | [Publisher-supplied complete quartet listing](https://www.netgalley.com/catalog/book/142821), [publisher book 1](https://us.macmillan.com/books/9781429910156/ashadowinsummer/), and [Reddit economic-magic discussion](https://www.reddit.com/r/Fantasy/comments/cs8o1f). |
| O9 | *Street Cultivation*, Sarah Lin | Modern cultivation tied to economic constraints, providing a different comparison from the acquired Soulhome. Same author does not make the works duplicates. Edition and collected-volume coverage still need verification. | [Author-posted series](https://www.royalroad.com/fiction/23220/street-cultivation?reviews=1&sorting=top), [author release notice](https://www.royalroad.com/fiction/23220/street-cultivation-a-modern-wuxialitrpg-hybrid/chapter/393511/street-cultivation-on-amazon?comment=2474911&comments=3), and [Reddit sustainability discussion](https://www.reddit.com/r/ProgressionFantasy/comments/xld3l1). |
| O10 | *The Cloud Roads* / Books of the Raksura, Martha Wells | Nonhuman society, belonging and ecology as a contrast to Children of Time's evolutionary framing. Start with the actual first novel; book-specific social/physiological rules remain unverified here. | [Official publisher edition](https://www.simonandschuster.com/books/The-Cloud-Roads/Martha-Wells/The-Books-of-the-Raksura/9781597803038), [Reddit ecology discussion](https://www.reddit.com/r/Fantasy/comments/1ahcl0p). |

### ACCOUNT FOR NOW

F12: Acquisition priority and research priority are different. Gernet and Ruin
of Angels are the two leading next candidates by complementary historical scope
and a concrete collection gap. A semantic comparison can already begin using
the acquired sources, without claiming they have been read. Preserve edition,
translator, volume boundary and whether a rule is shown, stated or inferred.
Optional appendices, art/bonus pages and later volumes need explicit coverage
checks rather than a filename containing complete or premium. The last live
quota snapshot in FINAL_CHECK remains the prior wave's snapshot; this round did
not refresh it or promise a reset time.

### LATER

F13: Source gaps remain Shadow Slave after chapter 3000, the checked COI
1026/1181 full bodies, current Regressor's Tale translation coverage, and other
unresolved heading anomalies. More generic full compilations do not establish
that those gaps are repaired. Verify accessible chapter bodies and actual
cutoffs before spending quota on an upgrade. Community opinion about peak is
useful for discovering contrasting works; it does not replace direct source
inspection, completeness checks, or YAIR's accepted mechanisms. This queue
adds no scheduled continuation, purchase, reading run or gameplay work.

## Follow-up: rulebooks, source media and combined platform

The [source media scout and integration proposal](SOURCE_MEDIA_ACQUISITION_SCOUT_2026-10-21.md)
records the requested comic/manga tools, their overlap, independent provider
limits, a unified platform design, current tabletop holdings and targeted
LN/fanbook/guidebook candidates. It adds no acquisitions to the verified wave
above and does not refresh the Z-Library quota snapshot.
