# Book discovery, 2026-10-26

Status: metadata-verified discovery, not acquisition or reading. Task owner: this
report. Private search/edition evidence: `novels/book-discovery-2026-10-26/EVIDENCE.json`
(gitignored). No source prose, credentials or private catalogue export is included here.

## Source Library search refresh, 2026-10-26

Weibao then requested “search accordingly in source library”. Searched all fifteen
shortlisted works through Source Library's background `platform_search`, explicitly
using local and Z-Library providers, up to ten results each. All fifteen queries
succeeded; each had an English EPUB candidate by the intended author and zero
indexed local matches. Filter out unrelated books and other languages in these
fuzzy search results. No downloads or native app control occurred.

Private evidence: `novels/book-discovery-2026-10-26/SOURCE_LIBRARY_REFRESH.json`.
This refresh supersedes the narrower coverage observations in the initial tables
below; those tables preserve the initial pass and its other qualifications.

| Code | Current observed catalogue coverage / correction |
|---|---|
| C1 | Mana Mirror includes First, Second and Third Gate, Twin Trials, and a listing explicitly labeled *The Third Portal (Book 5)*. Volume mapping beyond that explicit label remains metadata-only. |
| C2 | Budding Scientist returned Book 1 and Book 2, mixed with unrelated science books. Further volumes remain unverified. |
| C3 | **12 Miles Below now has separately labeled English EPUB candidates for every volume 1–7.** Additional metadata lookup confirms III (*Grand Design*, Aethon, 2024, 3.50 MB) and VI (*The Icon of Stars*, Aethon, 2025, 1.91 MB). The earlier apparent 3/6 gaps were the result cap, not provider absence. |
| C4 | Elydes retains English candidates for Books 1–3. |
| C5 | **Forge of Destiny's 2026 editions were found.** Successful metadata lookup identifies definitive Book 1 (AETHON, 2026, 3.87 MB), Book 2 (AETHON, 2026, 1.07 MB) and Book 3 (Aethon, 2026, edition 1, 949 KB). The newer Book 1 resolves the old-listing concern for candidate selection; file contents and revision identity still require post-download verification. |
| C6 | Stubborn Skill-Grinder retains separately labeled Books 1–5. |
| C7 | Street Cultivation retains separately labeled Books 1–3. |
| C8 | Long Price retains all four individual titles and adds explicitly labeled two-book omnibus candidates *Shadow and Betrayal* (1+2) and *Seasons of War* (3+4). Contents remain unverified. |
| C9–C15 | Opening-title candidates reconfirmed for Cloud Roads, Steerswoman, Vita Nostra, House of Open Wounds, Dragon's Egg, March North and Tainted Cup. Steerswoman also has an explicit 1+2 omnibus label. No whole-franchise completeness inferred. |

Checks: fifteen fresh searches and five additional edition metadata lookups
succeeded. Private JSON, local report links and whitespace checked. Catalogue
`downloadable:true` does not establish available quota or successful delivery.
No shared acquisition receipts, interrupted jobs or persisted refusals changed.

## Scope and reuse

Weibao requested new books and series for his source collection through Source
Library and existing routes, then emphasized “consider RR books and more! dont
forget the lists we make nefore”. This is a collection-discovery pass, not a
gameplay ranking, implementation wave or full-source audit. One coordinator,
zero reader agents, zero source chapters read. Stop: a bounded shortlist with
edition candidates and access qualifications. Rules: AD32/35/37, WPR1–4/7–8;
source acquisition guidance owns transport and receipt behavior.

Read the live [source tools](SOURCE_ACQUISITION_TOOLS.md),
[harvest](SOURCE_HARVEST_2026-10-25.md), private harvest `REUSE_INDEX.json`,
[ranked queue](SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md),
[October 22 candidates](BOOK_CANDIDATES_2026-10-22.md),
[October 24 receipt](BOOK_ACQUISITION_RECEIPT_2026-10-24.md), and
[October 21 wave and open leads](ZLIBRARY_YAIR_ACQUISITION_WAVE_2026-10-21.md).
Also consulted the [broad scout](power-systems/broad-scout/REPORT.md) and existing
Stubborn Skill-Grinder research pointers. The reuse index at inspection contained
87 work records and 133 source hashes. It is a harvest index, not the whole library.
The queue's current Status table supersedes its historical hero-work holdings rows.

Interest inference, not a new favorite declaration: the recorded favorites and
collection point toward progression with unusual rules, retained knowledge,
living skills, institutions and ordinary lives, crafting, support work and large
worlds. The shortlist balances those with nonhuman societies and other unusual
settings. Order below is a proposed collection choice, not source-quality scoring.

Duplicate checks: each candidate's title search in Source Library returned zero
local results and remote rows marked `owned:false`, with no exact or possible
matches. Read-only inspection of all 232 Calibre book titles found no matching
title among these candidates. A bounded filename scan of Downloads and the
private novels tree found no matching EPUB/MOBI/AZW3/PDF/TXT/JSON filenames under
the selected title/alias substrings. This is strong discovery evidence, not proof
against an obscure alias or unindexed raw capture. Stubborn has known saved
chapter samples despite no full-edition match. Recheck holdings immediately before
any later acquisition because the sibling acquisition chat is active.

## Shortlist: Royal Road and published serials

All candidates in this table are English EPUB listings. The exact opening edition
received a successful `platform_metadata` response, backed by the existing desktop
companion's authenticated metadata API. No native window was controlled.
Coverage means catalogue titles observed in a limited search, not verified files
or a complete publication inventory. Source premises are STATED by the linked
author/publisher; the collection rationale is INFERRED.

| Code | Work and author | Why add it / previous-list connection | Concrete opening edition | Observed coverage and uncertainty |
|---|---|---|---|---|
| C1 | **Mana Mirror**, Tobias Begley | RR7 retained. Apprenticeship, teacher obligations and alternative paths add a different institutional angle to held Millennial Mage and Sorcery. [Author listing](https://www.royalroad.com/fiction/62788/mana-mirror) | *The First Gate*, 2024, 2.73 MB | Search returned First, Second and Third Gate plus *The Twin Trials*. Those titles do not establish a complete numbered run. RR is stubbed; the beginning EPUB is the useful acquisition unit. Publisher and edition fields absent in candidate metadata. |
| C2 | **A Budding Scientist in a Fantasy World**, Acaswell | Beyond the current ranked queue. Investigating why a System exists is a distinct addition to simply progressing within it. [Author premise](https://www.royalroad.com/fiction/41521/a-budding-scientist-in-a-fantasy-world-completed), [publisher series](https://podiumentertainment.com/series/734/a-budding-scientist-in-a-fantasy-world) | *A Small Town in Southern Illvaria*, Book 1, Podium, 2023, 1.36 MB | Search also returned *The Society of Starry Eyes*, Book 2. Indexed author page says completed and STUB, so completed story does not mean complete free opening access. Further published volumes were not exhaustively searched. |
| C3 | **12 Miles Below**, Mark Arrows | RR18 retained. Lethal environment, inherited/recovered technology and underground exploration contrast with the collection's sect-heavy progression. [Author listing](https://www.royalroad.com/fiction/42367/12-miles-below) | *The Frozen Realm*, Volume 1, Aethon, 2023, 1.39 MB | Search returned Vols 1, 2, 4, 5 and 7. Missing 3/6 in this capped result is not proof of provider absence. Author listing is titled complete, with a stubbed published opening in prior queue evidence. |
| C4 | **Elydes**, Drew Wells / Drewells | Beyond current ranked queue. A low starting position, tropical setting and slowly developed life give another angle on growth and access. Author alias and Book 1 identity agree across [RR](https://www.royalroad.com/fiction/67742/elydes) and [Aethon](https://aethonbooks.com/book/a-new-dawn/). | *A New Dawn*, Book 1, Aethon, 2024, 2.93 MB | Provider and publisher both list Books 1–3: *A New Dawn*, *Tides of Change*, *Whispers of the Isles*. No complete-series claim. Publisher lists 580 pages; candidate says 581, a small metadata discrepancy. |
| C5 | **Forge of Destiny**, Yrsillar | RR24 retained. Sect education, unequal preparation, teachers and allies fit the recorded interest in lives inside institutions. [Publisher](https://aethonbooks.com/book/forge-of-destiny/) | Volume 1, catalogue year 2020, 544 KB | Provider search returned old Vols 1–2. Publisher now identifies a revised definitive Book 1 dated January 20, 2026, ASIN B0FQWDXD65. **Edition decision remains open:** the located 2020 listing is not verified as that revision. RR page timed out; switched to publisher rather than retrying it. |
| C6 | **The Stubborn Skill-Grinder in a Time Loop**, X-RHODEN-X | Existing broad-scout D041 and saved progression-gate research, not a new discovery. A full opening edition could complement the bounded chapter samples. [Author premise and stub notice](https://www.royalroad.com/fiction/83294/the-stubborn-skill-grinder-in-a-time-loop) | Book 1, Aethon, 2025, 1.23 MB | Search returned separately numbered Books 1–5. RR is titled Book 5 Stubbed. Reuse existing samples/research; do not call this wholly unread or queue a duplicate full read without edition binding. No mapping of sample chapters to book cutoffs verified here. |

## Earlier-list leads carried forward

These were not discarded in favor of fresh titles. All four have successful
English EPUB metadata and negative local title checks at this inspection.

| Code | Work and author | Distinct contribution / prior ID | Opening candidate | Coverage and edition qualification |
|---|---|---|---|---|
| C7 | **Street Cultivation**, Sarah Lin | October 21 O9. Modern, commercialized cultivation rather than another Soulhome edition. [Author identifies the premise and completed trilogy](https://sarahlinauthor.blogspot.com/p/my-work.html?m=1). | Book 1, 2019, 427 KB | Search returned Books 1–3. Candidate page count is implausibly `1`; do not use it as completeness evidence. Publisher field empty. |
| C8 | **The Long Price Quartet**, Daniel Abraham | October 21 O8. Captive magical beings and poet-sorcerers tied to city economies; useful institutional and generational contrast. [Publisher Book 1](https://us.macmillan.com/books/9781429910156/ashadowinsummer/) | *A Shadow in Summer*, Tor, 2006, 352 KB | Search returned all four separately named books. The old preference was a verified four-book collection; none was verified here. [*Shadow and Betrayal*](https://us.macmillan.com/books/9780765331649/shadowandbetrayal/) contains the first **two**, not the whole quartet. |
| C9 | **The Cloud Roads / Books of the Raksura**, Martha Wells | October 21 O10. Nonhuman embodiment, community and belonging add a social angle beside held Children of Time. [Publisher synopsis](https://www.simonandschuster.com/books/The-Cloud-Roads/Martha-Wells/The-Books-of-the-Raksura/9781597803038) | *The Cloud Roads*, Night Shade, 2011, 1.78 MB | One exact-author opening candidate selected for metadata review. Other search rows misspell the author as “Marsha”; a three-title omnibus also has that error. Prefer the correct-author candidate pending embedded metadata verification. No whole-series coverage claim. |
| C10 | **The Steerswoman**, Rosemary Kirstein | RR19/TR7 are aliases for one work in the ranked queue. Inquiry, travel and understanding unfamiliar cultures offer a different route to useful knowledge. [Author's four-book series page](https://www.rosemarykirstein.com/the-books/) | *The Steerswoman, no. 1*, author-published listing, 511 KB, year unspecified | Search also returned *The Outskirter's Secret* (#2) and *The Steerswoman's Road*. Treat the latter as an omnibus candidate until contents are checked, not an additional numbered book. Four novels on author page does not mean four provider files verified. |

O6 (*Daily Life in China*, Jacques Gernet) remains a nonfiction lead in the old
wave. O7 (*The Ruin of Angels*) is a continuation of the held Craft Sequence and
belongs with the sibling's existing-series gap work. Neither was silently closed
or promoted as a new work here. The earlier light-novel, companion and tabletop
lists remain available in October 22's owner; this bounded novel pass does not
replace them or infer that their historical availability is current.

## Further leads beyond the ranked queue

These widen the collection rather than repeating its strongest existing lanes.
All five have successful English EPUB opening-edition metadata and negative local
title checks. “Beyond queue” does not assert nobody ever mentioned them elsewhere.

| Code | Work / author | Source-backed premise and proposed collection value | Candidate / boundary |
|---|---|---|---|
| C11 | **Vita Nostra**, Marina and Sergey Dyachenko | Coercive entry to a strange institute and dark psychological education. A useful contrast to conventional magic-school progression. [Publisher and translator credit](https://harpervoyagerbooks.co.uk/products/vita-nostra-marina-dyachenkosergey-dyachenko-9780008272876/) | *Metamorphosis Book 1*, Harper Voyager, 2018, 1.97 MB. Publisher credits Julia Meitov Hersey's English translation; provider does not expose translator, so bind it after selection rather than assume. One novel, not its sequels. |
| C12 | **House of Open Wounds**, Adrian Tchaikovsky | A field hospital uses varied magical and practical means under institutional pressure. Strong support-career and cooperation lead. [Publisher](https://www.bloomsbury.com/uk/house-of-open-wounds-9781035901418/) | Head of Zeus, 2023, 5.58 MB. A companion to *City of Last Chances* within Tyrant Philosophers, not series Book 1. Can be chosen specifically for hospital focus; the opening-world novel and series coverage were not searched. Reject Portuguese result. |
| C13 | **Dragon's Egg**, Robert L. Forward | Contact with life on a neutron star at radically different timescales. Different biology and historical tempo beside held Children of Time. [Publisher](https://www.penguinrandomhouse.com/books/54809/dragons-egg-by-robert-l-forward/9780345435293/) | Del Rey candidate dated 2010, 295 KB; publisher ebook date 2011. Edition/date discrepancy unresolved. Do not confuse same-title Kingsolver or Wells books. Sequel not searched. |
| C14 | **The March North / Commonweal**, Graydon Saunders | A contrasting egalitarian heroic-fantasy society and collective military life is a plausible collection question. Store synopsis is brief, so detailed magical engineering claims are **not** verified here. [Direct EPUB listing](https://www.kobo.com/us/en/ebook/the-march-north) | Provider opening candidate 606 KB, year/publisher missing. Kobo independently identifies Commonweal Book 1, Tall Woods Books, 2014, English, DRM-free EPUB 3, ID 9780993712609. It is a paid/subscription route, not an owned entitlement. No purchase or trial started. |
| C15 | **The Tainted Cup**, Robert Jackson Bennett | New work by the author of held Foundryside. A fantasy investigation is a promising contrast; specific biological/power mechanics were not established by the accessible publisher extraction in this run. [Publisher edition](https://www.penguinrandomhouse.com/books/648051/the-tainted-cup-by-robert-jackson-bennett/paperback/) | *Shadow of the Leviathan Book 1*, Del Rey, 2024, 4.45 MB. English chosen over Chinese translation result. Opening title only; no sequel coverage verified. Lower-confidence mechanism fit than C1–C12. |

## Routes, limits and exact candidate keys

R1: Source Library `platform_search` with explicit `local,zlibrary` providers
successfully found the candidates; `platform_metadata` succeeded for all fifteen.
The live API route worked despite the harvest's historical failures. Each listing
is marked `downloadable:true`, `premium:true`, `owned:false`, `coverage:unverified`.
These are catalogue capabilities, not proof of current allowance, issuance or file
delivery. No quota-consuming download command was called. The historical daily
limit remains historical; current quota was deliberately not probed here.

Exact keys remain in the private EVIDENCE.json so they can be reviewed and passed
to the shared `platform_download` route after selection. They are **candidates,
not selected downloads**. No signed links or files were acquired. After selection,
the acquisition owner must recheck local matches and existing jobs before issuing
anything, then verify file metadata, archive integrity and actual volume coverage.

R2: Live platform status still marked Elscione blocked by prior 403, LibGen blocked
by a prior browser safety rejection, Gutendex blocked by timeout, and Bookracy's
direct API blocked while its separate browser route was configured. No blocked
route was retried. Bookracy was not opened, avoiding competition with foreground
work. JNovel remains a handoff source, not a verified transfer route here. The
registry also retains the existing lncrawl-polite fork and project bridges; no
crawler, new transport root or replacement downloader was started.

R3: Royal Road metadata is unevenly accessible. Initial indexed opens exposed
author/title/status, but later page-detail opens for Elydes, Mana Mirror and
12 Miles Below returned Anubis access denial. Those attempts stopped; no challenge
was automated and no bulk collection followed. Forge timed out and its publisher
provided an independent description and edition correction. Published EPUB
searches are independent catalogue discovery, not evidence that RR capture works.

R4: The platform status showed 66 interrupted acquisition jobs at inspection.
This chat did not retry, cancel, clear or claim any of them, change provider budgets,
refresh the inventory or write shared harvest receipts. Candidate metadata may
populate the tools' ordinary search cache; this is separate from acquisition jobs.

## Verification and disposition

V1: 16 remote work queries plus one extra local-only Vita Nostra query were run;
15 works retained, with *The Crafting of Chess* screened but not promoted because
its collection rationale and primary description were not checked. Sixteen exact
opening-edition metadata lookups succeeded, including that screened title.

V2: Reuse index, current queue, earlier lists, Calibre title check and bounded
local filename checks completed. Private evidence JSON parses and is gitignored;
tracked report links and whitespace checked. Runtime tests do not apply.

V3: Highest state: metadata-verified shortlist, agent-checked, not human-reviewed.
Zero downloads, transfers, extractions or source chapters read; zero gameplay,
save, shared acquisition-receipt or provider-refusal edits. No purchase, commit,
push or publication. Next acquisition depends on selected work/edition and live
route/quota, not on a claim that this discovery already obtained it.
