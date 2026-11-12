# Existing source acquisition tools

Current routing guidance, refreshed 2026-10-21. Applies to selected novel/fanwork research
for this project. This is tool discovery and execution guidance, not permission
to acquire everything in a catalogue or to implement the resulting ideas.

**What to fetch.** Anna's, Z-Library and Source Library runs take their titles from the
[download wishlist](DOWNLOAD_WISHLIST_2026-10-30.md) (`python3 -I scripts/wishlist_queue.py`
lists the open and partial DL rows) and write each fetched row's DL code back
there, following [its run procedure](DOWNLOAD_WISHLIST_2026-10-30.md#how-annas-and-z-library-runs-use-this-list-2026-11-04).

Start at the [shared tool registry](../TOOL_REGISTRY.md) for launch commands,
isolated environments and current readiness. It also routes Discord, REA,
engine-specific extraction and verification tooling; the transport contract
below remains the owner for this novel/fanwork acquisition route.

Source Library 0.6.0 embeds a reader inside the app, with Read and saved
positions, plus paged local/JNovel/Suwayomi browsing and source/series/chapter
selection. JNovel volume links stay explicit browser handoffs. As of 2026-10-22
Read opens Kavita's EPUB/PDF/CBZ reader; Komga's reader remains the fallback for
EPUBs Kavita cannot parse (about half of the current 130). Committed in
zlibrary-research, not yet live in the running app until its platform restarts.
[Kavita reader and evidence](/Users/weiwei/code/zlibrary-research/docs/KAVITA_READER_0_6_1.md),
[Komga integration](/Users/weiwei/code/zlibrary-research/docs/INTEGRATED_READER_0_6_0.md).

For the proposed combined book/comic/manga platform, see the
[source media comparison and integration plan](SOURCE_MEDIA_ACQUISITION_SCOUT_2026-10-21.md).
It distinguishes provider downloaders, collection managers and readers. The
selected existing-books/Suwayomi/Komga/CLU stack is now implemented in
[Source Library 0.5.0](/Users/weiwei/code/zlibrary-research/docs/SOURCE_LIBRARY_0_5_0.md),
with real provider/file tests and a shared platform download ledger. The
[0.5.2 light-novel expansion](/Users/weiwei/code/zlibrary-research/docs/LIGHT_NOVEL_SOURCES_0_5_2.md)
adds the nineteen user-supplied source/directory/crawler references, JNovel
catalogue search and local EPUB/PDF/CBZ imports. Elscione's automatic browser
route returned 403 and is persistently stopped; its download implementation has
not passed a live transfer. Browser handoff plus local intake works independently
of an automatic provider adapter. Other
scouted comic downloaders remain candidates; not every upstream client shares
that ledger or has been installed.

### Keiyoushi coverage scout (2026-11-08)

For broad coverage, start with the extensions already enabled in Suwayomi. In
the October 23 governor survey of 51 selected titles, Kagane had a qualifying
chapter list for 39 titles, AllManga 36, MangaKatana and Weeb Central 32 each,
Bbato 28, Atsumaru 26, MangaPill 23 and MangaFire 7. A qualifying list had a
title match score of at least 0.8, at most five numbering gaps and at most
two repeated chapter numbers. These are historical catalogue results for
our title mix. Confirm the edition, language and page access for any intake.
MangaPill currently [says it removed its manhwa](https://mangapill.com/).

| Route | What it adds |
|---|---|
| Already enabled: Kagane, AllManga, MangaKatana, Weeb Central | First checks for long runs. Current Weeb Central listings span the opening to chapter 263 of [World Trigger](https://weebcentral.com/series/01J76XY7YPC5SJGDE7JDBC4444), and list [Jujutsu Kaisen Modulo](https://weebcentral.com/series/01K4JBKB0VX8TCFSSF1MK2DTZZ) through chapter 25. MangaFire and AllManga each historically listed chapters 0–65 of the older LOTM comic. |
| Trial first: WEBTOON | Biggest new public catalogue opportunity among the reviewed extensions. The official English site lists [Omniscient Reader](https://www.webtoons.com/en/action/omniscient-reader/list?title_no=2154) through episode 308, [The World After the Fall](https://www.webtoons.com/en/action/the-world-after-the-fall/list?title_no=4011) through episode 245 and [Tower of God](https://www.webtoons.com/en/fantasy/tower-of-god/list?title_no=95) through entry 652. Align publisher episode IDs with existing CBZs, and verify public page access separately from app-only listings. |
| Targeted trials: WebNovel, Tapas, KadoComi | WebNovel for the [newer LOTM comic](https://www.webnovel.com/comic/32535186308512101/catalog), Tapas for the [official TBATE comic](https://tapas.io/series/tbate-comic/info), and KadoComi for Japanese originals such as [Dungeon Meshi](https://comic-walker.com/detail/KC_000393_S). These add edition references. Compare actual free page coverage with existing providers before selecting one for a run. |

The [Keiyoushi index](https://github.com/keiyoushi/extensions/blob/repo/index.json)
still supplies individual JARs. Reuse the
[existing Suwayomi install route](/Users/weiwei/code/zlibrary-research/docs/SUWAYOMI_EXTENSIONS_2026-10-22.md).
The next check for a new extension is one exact series match, its public episode
list and one readable CBZ import through Source Library. This scout verified
catalogue evidence. It did not install extensions, fetch pages or change the queue.

### Live Suwayomi reader checks (2026-11-08)

Queried enabled English sources, refreshed chapter lists, and decoded images
through the same Suwayomi page endpoint Source Library uses. The four first
choices below had no gaps in their integer chapter numbers. Each passed an
opening, middle and latest chapter sample, with the first, middle and last
images decoded in the latest chapter. Other chapters were checked by listing.

| Comic | First choice and chapter samples | Other findings |
|---|---|---|
| LOTM, older comic | [MangaFire](https://mangafire.to/title/5kx4m-lord-of-the-mysteriess), 0–65 listed. Opened 1, 33 and 65. | Atsumaru also opened 65. AllManga lists 0–65 but chapter reads failed because CEF is disabled. MangaKatana lists through 64. |
| LOTM, 2025 remake | [Bbato](https://bato1.com/read/lord-of-mysteries-2025/chapter-25), 0–25 listed. Opened 1, 13 and 25. [WebNovel lists 25](https://www.webnovel.com/comic/32535186308512101/catalog). | Atsumaru opened the same samples amid repeated releases. MangaFire opened 25. MangaKatana stopped at 15. |
| Omniscient Reader | [Weeb Central](https://weebcentral.com/series/01J76XYDMWWJX3T4BFWR84FQQK), 0–311 listed. Opened 0, 155, 253, 308 and 311. | MangaKatana, Flame Comics and Asura opened 311. MangaFire's 311.2 has one image and Atsumaru's 311.5 has two. Keep those separate from main chapters. Local integer CBZ labels are contiguous from 0 to 252. |
| The World After the Fall | [Weeb Central](https://weebcentral.com/series/01J76XYFA2SNRMQT60JEWDRZRW/The-World-After-the-Fall), 0–258 listed. Opened 0, 129, 245 and 258. [Naver also lists 258](https://m.comic.naver.com/webtoon/list?titleId=789979). | MangaKatana, MangaFire, Atsumaru and Asura opened 258. |

MangaDex returned a server error loading the older LOTM list, and Kagane timed
out on its search. No files were imported into Source Library and no extensions
or queues changed.

## Discover and reuse first

Check local source owners and already acquired files first. For a needed new
download, inspect the existing tools below before creating a task-local scraper.
User-authorized downloads can proceed within their selected scope without a
second permission question. Prefer an existing author/platform export when it
meets the request; preserve source/version, raw hashes and actual reading scope.

Current ranked-book harvest and reuse record (2026-10-25): start with the
[harvest receipt](SOURCE_HARVEST_2026-10-25.md) and its private
`docs/research/novels/source-harvest-2026-10-25/REUSE_INDEX.json` before another
download, extraction or full read. The index joins exact source hashes, aliases,
formats, preparations, reading owners and remaining chapter/volume gaps;
`FOLLOWUP_TRANSFERS.json` preserves issued/completed requests. Refresh it through
the recorded consolidation script after intake. Historical baselines remain
unchanged; unresolved edition bindings and interrupted jobs are explicit.

| Tool | Actual capability / entry point |
|---|---|
| Local library and prepared sources | Read-only Calibre/EPUB discovery first. Registry IDs `calibre`, `saved-sources` and `epub-prepare`; extraction and reading remain separate. |
| Source Library / Z-Library research fork | `/Users/weiwei/code/zlibrary-research`, [current profile](/Users/weiwei/code/zlibrary-research/docs/YAIRPG.md). Registry IDs `source-library`, `source-library-services`, `source-library-bootstrap`, `zlibrary`, `zlibrary-mcp`, `epub-prepare`. Twenty-six MCP tools include eight unified platform operations alongside eighteen compatibility research tools. Prefer `platform_download` for the shared ledger. Launch is not registration or authentication. |
| Personal fork | `/Users/weiwei/code/lncrawl-polite`; read its `AGENTS.md` and `README_POLITE.md`. |
| Isolated polite CLI | `.venv-polite/bin/python -m lncrawl polite` from that repository. Current CLI accepts a Fanqie book ID and matching local reference font; it is not a general URL downloader. Use `--help` for current arguments. |
| Reusable transport | `lncrawl.polite.transport.Client`; source at `/Users/weiwei/code/lncrawl-polite/lncrawl/polite/transport.py`. Existing HTML adapters can use this without importing the upstream scraper. |
| Project public-page bridge | [acquire_free_pages.py](power-systems/novel-crawl/acquire_free_pages.py), an existing task-specific example using `Client`. Its hardcoded book queue is historical; do not execute it as a generic new download command. |
| FanFicFare bridge | [fff_polite.py](power-systems/novel-crawl/fff_polite.py), using FanFicFare's installed environment with the same transport. Inspect the adapter's source support before use. FanFicFare adapter existence does not guarantee access. |
| Upstream source adapters | `sources/zh/69shuba.py` and `sources/en/r/royalroad.py` in the fork are upstream crawlers. Their presence does not make the ordinary upstream CLI/server polite mode. |

Keep one normal transport data directory for receipts/refusals. Inspect the
existing invocation/data owner before choosing it; do not create a fresh root to
evade a persisted closure. Private chapter bodies, caches and receipts belong
under an ignored research lane, outside the public bundle and source library.

## Use the actual transport contract

The fork's README and code own policy. Currently it supplies one process per OS
user, serial GETs, honest named identity, randomized 4–8-second spacing after
responses, longer robots delays when required, verified immutable cache and
per-request receipts. Its robots check and durable host/book refusal state are
part of this route. Respect its chapter cap and use its cache/checkpoint recovery.

If a source needs a new parser, keep the addition narrow: pass every network
request, including catalogue and auxiliary resources, through `Client`; use
`client.chapter(url)` for budgeted reader pages; derive URLs from the actual
catalogue; save exact locators and additive checkpoints. Read the fork's matching
source/output skill before changing its adapters. No separate urllib/requests
loop merely to reproduce a sleep interval or avoid a transport stop.

An access failure means record the stopped route and continue independent work:
already acquired/local sources, metadata discovery or another independently
accessible source. Do not answer a polite transport refusal with alternate
headers/domains, a fresh data directory, retries or a browser collection loop.
Ordinary user-authorized browser discovery has its own tool access checks; it
does not establish that bulk acquisition through that route is permitted or
that a blocked scraper run succeeded. A browser site-safety rejection must not
be routed through another surface or lookalike site.

Explicit human steering outranks local workflow preferences, but changing a
scraper's stop policy is a separate concrete tool change, not silently inferred
from a request to download. Distinguish that workflow policy from technical
access and actual platform content restrictions. Do not invent another approval
step for routine discovery, private preparation or an already authorized run.

## Authorized RR browser capture exception, 2026-10-31

Weibao explicitly authorized: “Yes, go ahead with the paced signed-in RR capture,
starting with Department of Otherworld Rescue and then the rest in ranked order.
Get complete available runs where possible.” This permits the bounded signed-in
browser DOM capture proposed in the [ranked scout](DOWNLOAD_SCOUT_NEXT_2026-10-31.md#r3-exact-blocker-and-bounded-route-proposal)
for S1–S8, in order. It supersedes the browser-collection prohibition above for
this selected run, not for arbitrary future books. Keep the old polite transport's
403/refusal state unchanged. Use background browser controls, sequential chapter
navigation with 4–8 seconds between responses and subsequent requests, immutable
raw capture, exact source URLs/TOC boundary, derived EPUBs and integrity checks.
Stop for manual verification, new access rejection or paid/locked content. No
purchase, subscription or security-setting changes are included.

### Extension to the two earlier gaps, 2026-11-01

Weibao explicitly requested Memories of the Fall and Immovable Mage “using the
same paced RR capture” and “complete available runs where possible.” The above
signed-in capture exception therefore also covers these two named works (S9/S10),
with the same pacing, raw/derivative separation and stop conditions. RTOC was initially
asked about as a holdings check. In the later Nov 1 instruction, Weibao explicitly
authorized numbering alignment and acquisition of its missing available chapters,
with deduplication against the held source. Use the existing polite transport for
the independently accessible translator pages, following actual navigation and
stopping at paid/non-public material. This does not reset any prior host closure.

## Authorized Archives of Nethys browser route, 2026-11-03

Weibao asked to collect “the two D&D wikis”. The polite transport closed
`2e.aonprd.com` on HTTP 403; that closure stays. He then said: “Archives of
Nethys, we can do the in browser version”. This permits, for that site and the
rules families in the [d20 collection receipt](d20/D20_RULES_COLLECTION_2026-11-03.md),
a background-tab browser capture paced 4-8 s per request. It is not a general
exception for other closed hosts. The pane cannot download, reach localhost or
write the clipboard while hidden; oversized tool results are saved to disk, which
is how the data left the page.

### d20pfsrd browser route, 2026-11-04

The polite transport closed `www.d20pfsrd.com` twice on HTTP 404s from dead
links. The site did not refuse anything. The first closure was cleared on
Weibao's "Yes, clear it"; the second stays. He then said: “try opening in
extension or something”. This permits, for d20pfsrd and the rules families in
the [d20 collection receipt](d20/D20_RULES_COLLECTION_2026-11-03.md), a
background built-in-browser tab that fetches same-origin pages in sequence,
4-8 s after each response. A 403, 429, challenge or network error stops the
whole run. A 404 skips only that page. It is not an exception for other closed
hosts.

## Prepare and report the actual result

Preserve unchanged raw capture and derive readable TXT/chapter JSON/search data
separately. Check chapter URLs/order, hashes, duplicates, text population and
source contamination. Keep author notes and numbering restarts distinct from
missing chapters. Compare mirror identity/counts against primary metadata;
record disagreements and damaged glyphs rather than guessing a repair.

Report tool and adapter identity, selected source/edition, saved versus listed
coverage, stop reason if any, preparation checks and actual read coverage.
Whole mirror-catalogue capture does not certify original completeness. A
five-second downloader is accurately called a paced task-local collector unless
it actually used the existing polite transport. Preparation is not full reading;
research and feature proposals are not gameplay implementation.

## Incident and limits behind this correction

The HP 2026-10-11/12 run wrote a new ttks collector before discovering the existing
fork and bridges. It captured 166 listed entries, but continued despite an
unavailable robots policy, unlike the existing transport. Its receipts and
sources remain qualified as that task-local capture; they are not reclassified
as lncrawl-polite output. [Correction and actual receipts](../gm/dispatch/harry-potter-world-2026-10-11/FAN_PLATFORM_EXPANSION_2026-10-11.md)
link to its private owner.

This routing was checked against current local code and offline CLI help.
No new site access, adapter implementation or behavior change is established by
this documentation update.

2026-10-21 refresh: registry wrappers passed offline help/import/version probes
for polite mode, book CLI, EPUB preparation, Calibre and PDF/media utilities.
The Z-Library profile records an earlier anonymous remote search trial; endpoint,
account and acquisition success were not reverified here. The October 12
transport correction and its historical receipts remain unchanged.

## Route check, 2026-10-30

Z-Library through Source Library works: 30 downloads on 2026-10-29, all hash and
zip checked. Its limit is 30 a day and did not reset by midnight EDT; the reset
time is not reported. `source-library status` now shows used, limit and remaining.
A refusal made before any request left (no quota) is now saved as `refused` and can
be retried, instead of blocking that title as `prior_job_requires_review`.

Other routes, checked with WARP on:

| Route | Result |
|---|---|
| Bookracy | `bookracy.com` and `api.bookracy.com` no longer resolve in DNS; the browser worker times out |
| JNovel Codex | HTTP 509 (site bandwidth limit) |
| Anna's Archive `.gl` | Live, but DDoS-Guard asks headless Chrome for a manual check. Agents do not complete or get around such checks, so no automatic provider |
| Anna's Archive `.li` | Parked "for sale" page, not the archive. `.se`, `.org`, `.in`, `.pm` did not connect |
| Gutenberg | Works; public-domain books only | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->

Anna's Archive through Weibao's Chrome (Claude in Chrome, one tab, closed after) works:
the browser check clears on its own there. Search pages list MD5s; the free "Slow
Partner Server #6" page shows a plain file URL after a 19-28 s wait, and `curl`
fetches it. 8 books on 2026-10-30, each MD5- and zip-checked and registered in
Source Library. Files under a few weeks old may have no partner-server copy yet
(Randidly 13, Tree of Aeons 8); those stay Z-Library only.

Merge path, proposed: Z-Library's `desktop-metadata` call (no quota) returns the
book's MD5, which matches Anna's record. A paid Anna's membership includes the JSON
API `/dyn/api/fast_download.json?md5=&key=`, which answers plain requests without the
browser check (checked: HTTP 400 JSON when called without a key). With a key, Source Library
could search Z-Library, then download through Anna's when Z-Library quota runs out,
fully in the background. The exercised free route used an existing Chrome session. For future authorized work prefer supported background controls; this historical observation does not authorize a visible window.

Anna's tiers, read from its donate page 2026-10-30 (one-time, no auto-renew,
stackable): $3-7/month 25 fast downloads a day plus JSON API; $4-10 50 a day and no
browser checks for normal browsing; $11-30 200 a day; $42-120 1000 a day.

### More to consider: Anna's route, 2026-10-30 (AR1-AR9)

Weibao: "Free for now, with room for member key in the future ... Can we absorb the
z-lib metadata call thing for long term free downloads ... More to consider? has
other people ... done something github wise to interface with anna". Findings are
proposals unless marked done.

| Code | Consideration | Disposition |
|---|---|---|
| AR1 | Z-Library's metadata call (no quota) returns the MD5, and it equals Anna's MD5 for that exact edition. Title search on Anna's is not needed | ACT NOW (done): `desktop-metadata` now passes `md5` through; `scripts/annas_route.py md5 --key zlibrary:…` returns it |
| AR2 | The free slow route still needs a real browser: `/slow_download` returns 403 to plain requests and DDoS-Guard checks headless Chrome. "Long-term free" works only with Weibao's Chrome in the loop | ACCOUNT FOR NOW: free route = Chrome page gives URL, `annas_route.py intake --md5 --url [--key]` fetches, MD5-checks, registers and links the Z-Library key | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR3 | Opening three download pages at once in parallel tabs made the check stop clearing, even on book pages | ACT NOW (done): back to one tab, one page at a time, honoring the countdown. Do not retry through the check; wait it out |
| AR4 | Files only weeks old (Randidly 13, Tree of Aeons 8) have no partner-server copy yet | ACCOUNT FOR NOW: spend the Z-Library 30 a day on the newest releases; take backlist titles from Anna's | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR5 | Member key slot: `annas_route.py member --key zlibrary:…` reads `ANNAS_SECRET_KEY` and uses `/dyn/api/fast_download.json`, which answers plain requests. Unit-tested with a mock; not run live (no key) | ACCOUNT FOR NOW: buying a key turns AR2 into a background route |
| AR6 | GitHub prior art (survey 2026-10-30): iosifache/annas-mcp (Go, about 1.1k stars, MCP and CLI, key download), yashimosh/biblio-mcp (TS, multi-source MCP with MD5 dedup), ratacat/annas-archive-ebooks (Python, stdlib, key download). stacks and bookdl use challenge solvers or headless bypass; RemiKalbe/annas-archive-mcp opens a visible Chrome window | LATER: when a key exists, compare annas-mcp with our `member_url` before adding an MCP; do not reuse solver or bypass parts. iosifache and ratacat show no license, so read rather than vendor |
| AR7 | Anna's publishes metadata dumps and torrents. Offline title-to-MD5 search would mean 100 GB+ data; AR1 makes it unnecessary | Not pursued |
| AR8 | Single files can come from Anna's bulk torrents (milahu/annas-archive-torrent-client) with no browser check, which could be a background free route | LATER/DELEGATE: sonnet, about 1 hour, read-only probe of whether one EPUB can be pulled from a zlib3 torrent without downloading the whole torrent; done when a yes/no with cost is recorded here |
| AR9 | When Anna's serves a different edition than the queued Z-Library one, the file is registered but the Z-Library key is not linked, so a later Z-Library run could fetch the other edition too | ACCOUNT FOR NOW: link only when the URL or record names the same Z-Library ID |

### More to consider: searching and gaps, 2026-10-30 (AR10-AR18)

Weibao: "other useful books or gaps that we do have? We might need better searches and
more? More to consider?" New angles beyond AR1-AR9; proposals unless marked done.

| Code | Consideration | Disposition |
|---|---|---|
| AR10 | A numbering scan of all held titles (Calibre plus the live Source Library database) found holes inside series: Tensura light novels 1-15; No Game No Life 1-3; Bookworm Official Fanbook 1; Lord El-Melloi II Case Files 1-3. Book 1 titles often carry no number, so "missing 1" is mostly noise. **Correction (same day):** it also reported Re:Zero 1, 2, 9 and Fate/Zero 2-4, which were held all along (Calibre titles "Volume 01" and "FateZero"); AR36 | ACT NOW (done): gaps listed in the [download wishlist](DOWNLOAD_WISHLIST_2026-10-30.md) W6 |
| AR11 | Z-Library search costs no quota, so "is there a next volume" can be checked for every held series in one pass | ACT NOW (done): scratch `next_volumes.py` run 2026-10-30; results in wishlist W6. LATER: keep it as a monthly watchlist script, haiku-level, done when it lives in the repo and writes one dated line per series |
| AR12 | Z-Library metadata has `series` and `volume` fields, but they came back empty for a 2026 LitRPG title | Not reliable; keep title parsing |
| AR13 | Same title, different author (two *Lesser Kindred* files by Kerner instead of Kirstein) cost two fast downloads | ACCOUNT FOR NOW: check author before downloading. Z-Library search and metadata carry the author; for Anna's-only finds, read the author from the record page first |
| AR14 | Anna's "upload" collection holds fan compilations of Royal Road serials (Chaotic Craftsman chapters 1-604, The Daily Grind) that no store edition has | ACCOUNT FOR NOW: for RR-only works, search Anna's before planning a paced RR capture |
| AR15 | Daily capacity is now about 80: Anna's 50 (any age that has a fast copy) plus Z-Library 30 (newest releases) | ACCOUNT FOR NOW: route by availability. Anna's first, Z-Library for what Anna's lacks |
| AR16 | The home disk is 95% full (50 GB free); the library is 5.5 GB, but rulebook PDFs run 70-120 MB each | ACCOUNT FOR NOW: check free space before a large rulebook batch |
| AR17 | New files are not registered in `books.json` and have no reading plan; the batch-reading credit ends Nov 1 | Weibao's call per book (same as BMC25) |
| AR18 | Calibre and Source Library list many of the same books twice; the generated catalogues double-count | LATER: dedupe by hash in `scripts/library_catalogue.py`, haiku, done when each book appears once with both locations |

### More to consider: fan translator sites, 2026-10-30 (AR19-AR27)

Weibao: "Consider if we can instead get them from like translators, like
witchculttranslations and more?" Probed with plain requests (no browser), one page
at a time.

| Code | Finding | Status |
|---|---|---|
| AR19 | [Witch Cult Translations](https://witchculttranslation.com/table-of-content/) hosts the Re:Zero web novel, arcs 1-10 (arc 10 still running), plus the IF side stories, about 490 linked posts. It is a WordPress site; robots.txt blocks only `/wp-admin/`. The web novel is not the light novel: the LN revises it, and from arc 8 on the web novel is the only English text. The approximate arc/LN mapping (arc1≈LN1, arc2≈LN2–3, arc3≈LN4–9) describes related story ranges, not interchangeable editions or proof of every later LN. AR36corrects the old supposed1/2/9holdings gaps | ACCOUNT FOR NOW: Re:Zero gaps go here, not to Anna's. LATER: capture arcs 1-3 first, then 8-10, through the polite transport, sonnet, done when each arc is one EPUB in Source Library with the text out of git | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR20 | [Baka-Tsuki](https://www.baka-tsuki.org/project/index.php?title=Fate/Zero) still has Fate/Zero volumes 1-4 as full text plus *Fate/Zero Another Story*. MediaWiki; robots.txt sets no content signals | ACCOUNT FOR NOW: Fate/Zero 2-4 (DL27) come from here at no quota cost. LATER: capture by `Fate/Zero:Act_N` pages, haiku, done when four volume EPUBs are in Source Library |
| AR21 | The Baka-Tsuki No Game No Life page notes the Yen Press license; chapter pages for volumes 1-3 are likely gone | Unverified. Check one chapter page; if gone, NGNL 1-3 stay on Anna's |
| AR22 | Tensura: no complete English fan translation of the web novel turned up; an r/TenseiSlime FAQ (possibly dated) mentions a fan translation of LN volumes 6-12. The web novel is a shorter, different story | Tensura LN 1-15 stay on Anna's/Z-Library. The web novel is a separate canon question (AR26) |
| AR23 | Lord El-Melloi II Case Files and Bookworm Official Fanbook 1: no fan translation found. Both have official English editions (from memory, not checked) | Anna's/Z-Library |
| AR24 | NovelUpdates is the index of which group translated what, but answers 403 to plain requests | ACCOUNT FOR NOW: look up groups there through Weibao's Chrome, one tab, paced, the same as Anna's |
| AR25 | Neither Witch Cult nor Baka-Tsuki has an adapter in `lncrawl-polite`; Travis Translations is on its rejected list. The fork does ship `wordpress`, `wpcategory` and `generic` templates | LATER: try the WordPress template on Witch Cult before writing anything new; a MediaWiki adapter for Baka-Tsuki only if the generic one fails. Sonnet, done when a test captures one chapter of each |
| AR26 | Web novel and light novel are different canons (events, order, sometimes outcomes). A canon-first world needs to know which one it reads | ACCOUNT FOR NOW: label each Re:Zero or Tensura file WN or LN in the library index; a world pass names its text |
| AR27 | Translator sites cost no Anna's or Z-Library quota and often run ahead of official releases. They live on ads and Patreon, and fan sites get taken down when a license lands | ACCOUNT FOR NOW: capture whole arcs while they are up; pace requests like Royal Road. Supporting the translators is Weibao's call |

### More to consider: reconciling records, 2026-10-30 (AR28-AR35)

| Code | Finding | Status |
|---|---|---|
| AR28 | `~/Downloads` is a scan root, but files that arrive after the last scan stay invisible: five EPUBs (Bookworm P5V2 copy, two Lord of the Mysteries, two Circle of Inevitability) were on disk and unregistered | ACT NOW (done): registered one by one, not by a full scan, so personal PDFs in Downloads are not swept in. LATER: a scan that skips non-book PDFs (resume, lecture notes), haiku, done when a dry run lists only books | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR29 | Four rulebook PDFs in Downloads are truncated or damaged (`pdfinfo` and `qpdf` fail): The Strange *In Translation*, WFRP 4e Core, 40k 9e Core, M&M 4e Playtest. They looked held but are unusable | ACCOUNT FOR NOW: listed as DL42-DL44 for re-download. Any "held" PDF should pass `pdfinfo` before a pass relies on it |
| AR29b | Generated catalogues lag the database: Super Minion and the day's Anna's downloads were in Source Library but not in `SOURCE_LIBRARY_CATALOGUE.md` | ACT NOW: regenerate with `python3 -I scripts/library_catalogue.py` after each download wave |
| AR30 | The member API reports `account_fast_download_info` (downloads left) on each call | ACT NOW (done): `annas_route.py member` now prints it as `fast_downloads`; the wave runner stops at zero |
| AR31 | Royal Road compilations on Z-Library run past published books (Godclads chapters 1-500 beside books 1-2; Azarinth RR chapters 1-936) | ACCOUNT FOR NOW: for an RR series whose next book is not out, check for a compilation before a paced RR capture |
| AR32 | Free author-hosted serials (Worth the Candle, Unsong, Ra, Worm, A Practical Guide to Evil) need no quota at all, like the translator sites | ACCOUNT FOR NOW: route them through the translator-capture path (AR25) |
| AR33 | Recorded RR interests (RR1-RR36) are scattered across the deep-dive queue; no single list says held or not | ACT NOW (done): wishlist W7 lists the unheld ones |
| AR34 | A download wave changes the holdings that three files describe (library index, wishlist, generated catalogues) | ACCOUNT FOR NOW: after each wave, update the library index line, mark wishlist rows, regenerate catalogues; one writer per file |
| AR35 | Recent volumes (2026 releases) often have an MD5 on Z-Library but no fast copy on Anna's yet | ACCOUNT FOR NOW: failed `not_found` rows go to the Z-Library queue for its reset, not retried on Anna's the same day |

### More to consider: held-but-missed books and Royal Road inspiration, 2026-10-30 (AR36-AR44)

Weibao: "I thought we had worm? Heretical fishing is cool, there might be something similar
with the farmer mage or something, lots of RR stuff can be inspiring, More to consider?"

| Code | Finding | Status |
|---|---|---|
| AR36 | Title parsing is the wrong test for "do we hold it": the gap scan missed Re:Zero 1, 2, 9 and Fate/Zero 2-4, and a check of the generated catalogue missed Worm, Worth the Candle, Heretical Fishing, Super Supportive and The Perfect Run. All were held | ACCOUNT FOR NOW: answer "held?" from the live database plus the `novels/*/private/source` folders, never from a generated catalogue or a title regex. The capture agent was redirected off Fate/Zero | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR36b | Recurrence 2026-11-03: a gap scan again used title parsing and recommended Shadow Slave volumes 2–8 although Calibre 16 (a web-novel compilation) holds chapters 1–1840 and volumes 9–11 hold 1841–3000. One volume was downloaded before the check. AR36 already forbade title regex as the test, but it did not say what "held" means for compilations, unnumbered first books or alternate editions, and the scan did not consult it | ACT NOW (done): `python3 -I scripts/library_coverage.py --series "<name>"` queries raw JSON metadata in the live database and, for matching EPUBs, counts HTMLmembers and reads numbered chapters in spine order from title tags, falling back to a short body heading (English or Chinese) and skipping contents pages; it reports `restarts` and at most8detected gaps per volume segment (2026-11-07, [book text tools](tools/BOOK_TEXT_TOOLS_2026-11-07.md)). It does not validate OPFspine completeness. `--compilations` heuristically lists EPUBs above3MB flagged by title, part count or chapter maximum (ledger: `novels/rr-gap-scan-2026-11-03/compilations.jsonl`). ACCOUNT FOR NOW, for every wave: (1) run the tool for each series before listing a gap; (2) a gap is an uncovered chapter range, not a missing volume number; a retail volume inside a held range is an alternate edition and is not downloaded unless Weibao asks for that edition; (3) an unnumbered title may be book 1; (4) a Z-Library or Anna's hit is a candidate only after the tool shows no overlap; (5) the wave runner's md5 held check catches identical files only, so it does not replace step 1; (6) query by author as well as series (`--author Dinniman`), since a series name is often absent from a title: *A Parade of Horribles* is Dungeon Crawler Carl 8 and was already held, which the first version of the tool missed and which cost a duplicate Anna's-slow download the same day (deleted). Container indicators only: edition equivalence stays unverified. A zero non-Latin title match can miss Unicode-escaped JSONmetadata; resolve exact keys/unique hash prefixes and decoded metadata before claiming absence (B626) | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR37 | About 125 held books sat only in `docs/research/novels/*/private/source/`, outside Source Library's scan roots (Worm, Godclads 1-2, Wandering Inn, Reverend Insanity 1-24, Mark of the Fool 1-7 and others) | ACT NOW (done): registered by path; catalogues regenerated. LATER: add `novels/` as a scan root with a book-only filter (AR28), haiku, done when a dry run lists no game or mod files | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR38 | The tabletop library's `private/existing/` copies of Into the Outside, WFRP 4e, 40k 9e and In Translation are the same damaged PDFs; only Calibre's Into the Outside opens | ACCOUNT FOR NOW: DL42-DL44 stay re-downloads | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR39 | Cozy life fiction is a real subgenre on RR and Z-Library (farming, fishing, homestead, waystation, crafting) and maps straight onto everyday-life lead lives | ACT NOW (done): DL53-DL57 in the wishlist; Battle Mage Farmer 1-2 and Heretical Fishing 2 downloaded |
| AR40 | For this proposed original mechanism-harvest pass, RR fiction offers: how a cozy job levels (fishing as a skill path), how a farm becomes a base, how a support power earns social reward | LATER: a short "RR mechanism harvest" pass over the cozy set, one row per mechanism with chapter evidence, sonnet, done when it lands in the making or lead-life palette |
| AR41 | RR's own lists (Best Rated, tags such as Slice of Life, Crafting, Kingdom Building, Non-Human Lead) are the best discovery feed, and they are public pages | LATER: a paced, headless read of a few tag pages per month into a candidates file, haiku, done when each new candidate row has its tags and a held check |
| AR42 | Weibao's RR follows and favorites would say what he already likes better than any list | Needs his signed-in RR session; ask before reading it through his Chrome |
| AR43 | Wildbow's other serials (*Ward*, *Pact*, *Twig*, *Pale*) are free and share Worm's power-with-cost design | ACCOUNT FOR NOW: DL48 lists them for the free-serial capture route (AR32) |
| AR44 | Anna's 50 a day goes fast when a wave mixes priorities | ACCOUNT FOR NOW: spend in usefulness order (wishlist), keep a few for same-day surprises |

### More to consider: tutorial and reset fiction, 2026-10-31 (AR45-AR51)

Weibao likes *A Gamer's Guide to Beating the Tutorial* and asked for its continuations, *Death After Death*, Gandara's *The Tutorial Is Too Hard*, and related ideas. These are acquisition observations and proposals, not decisions on gameplay.

| Code | Finding | Disposition |
|---|---|---|
| AR45 | Palt books 2-3 and Gandara's anthology are held and verified; the anthology TOC lists main 1-380 and side 1-53, while embedded author metadata is blank | ACT NOW (done): [library index](LIBRARY_INDEX.md#tutorial-and-reset-fiction-2026-10-31) records hashes, TOC coverage and translation caveats; catalogues refreshed |
| AR46 | *Death After Death* is an ongoing author-posted serial. Z-Library metadata search found no matching DWinchester ebook; later, Anna's signed-in Chrome search for title plus author returned no exact file and author-only returned *Tenebroum*. The shared polite transport closed Scribble Hub on 403; Royal Road was already closed | ACCOUNT FOR NOW: no downloaded edition claimed; searches do not rule out alternate metadata. Retain the author reading link in the index and preserve both stops |
| AR47 | Palt's author [Patreon post](https://www.patreon.com/AuthorPalt/posts/gamers-guide-4-5-134883260) names *Greed* and *Wrath* as steps 4-5. On 2026-10-31 Anna's signed-in Chrome searches for the series, Palt, Palt Greed, Palt Wrath, the old title and stylized spelling found only steps 1-3, including checked partial matches | ACCOUNT FOR NOW: these queries do not rule out alternate metadata. The held book 3 TOC ends at Floor 25; the [Royal Road TOC](https://www.royalroad.com/fiction/73205/a-gamers-guide-to-beat1ng-the-tut0rial) lists chapter 230 at Floor 26 and reaches 417 in the checked snapshot. A serial continuation, a member-only PDF and a published ebook are distinct coverage states; do not mark steps 4-5 held or claim exact edition continuity | <!-- slip-ok: Bounded source/tool observation or acquisition-integrity instruction; not a universal gameplay limit. -->
| AR48 | The anthology packages 12 parts, but metadata and TOC coverage do not establish translation quality, prose integrity, or equivalence to other translations | LATER: sonnet, small, compare a few non-spoiler chapter boundaries and attribution against translator sources; done when edition identity, sample method and any gaps are recorded without replacing the original |
| AR49 | Live Source Library has *The Stubborn Skill-Grinder in a Time Loop* 1-5, *The Game at Carousel* 1-3 and *The Menocht Loop* 1; *Mother of Learning* and *The Perfect Run* are held | ACT NOW (done): use these as reuse-first recommendations; don't repurchase or redownload them |
| AR50 | The harvest reuse index RH4 still reflects Palt book 1, although Source Library now has books 2-3; its existing consolidator consumes native-prepared receipt shapes and cannot safely infer these new Anna's transfers | LATER: sonnet, small, add a correctly sourced Anna's receipt input to that existing consolidation route; done when exact hashes for books 2-3 appear in RH4 without inventing preparation or reading status and the previous records validate unchanged |
| AR51 | [Player 0.4](https://www.royalroad.com/fiction/54840/player-04-you-have-died-reset-in-progress) offers resets, character growth and strategy; [Tenebroum](https://www.royalroad.com/fiction/58643/tenebroum-dark-dungeon-core) is another DWinchester story with a different dungeon perspective. Local search found neither as a registered ebook | LATER: haiku, small, check edition identity and current holdings again if Weibao wants them; done when a title/author/source/coverage row and any access stops are recorded. Suggestions, not downloads |
| AR52 | 2026-11-08: with Weibao's VPN down, a FortiGate firewall intercepted Anna's download host (`wtgadtq.org`, certificate issuer "FortiGate CA"). The member API on annas-archive.gl still answered and counted each request, so four fast uses were spent on transfers that failed TLS | ACT NOW (done): the reusable runner `docs/research/novels/wave-2026-11-08/runner.py` (gitignored, local) makes one verified TLS handshake to the download host before any request and refuses to start if it fails or the issuer is Fortinet; it stops at the first TLS error mid-run. Every Anna's run uses this runner or copies its `preflight()`. Never disable certificate verification to get past a filter |
| AR53 | 2026-11-08: when Anna's failed for a reason other than `not_found`, the runner fell back to Z-Library item by item and spent 26 Z-Library uses on books Anna's probably had | ACCOUNT FOR NOW: fall back to Z-Library only on `not_found`/`Record_not_found`. Any other Anna's error (TLS, HTTP, timeout) stops the run so it can be diagnosed; the AR15 order (Anna's first, Z-Library for what Anna's lacks) holds |
| AR54 | 2026-11-08: Z-Library `desktop-metadata` returned no `filesize` for many light novels, the runner fell back to a 10 MB cap, and image-heavy EPUBs (12-40 MB) were cut off with `download_size_limit` after Anna's had counted the use (five uses). Re-requesting the same md5 later that day did not count again (counter unchanged across five retries) | ACT NOW (done): an unknown size now means a 150 MB cap; a known size means size + 5 MB. A same-day retry of an md5 that failed mid-transfer is free, so retry it before the reset |
| AR55 | Z-Library files can be bad after the use is counted: `invalid_download` (Bookworm Fanbook 1, id 16730130) and `invalid_archive` (*Dungeon World*, id 2623177) on 2026-11-08. The same Fanbook 1 came clean from Anna's under another md5 | ACCOUNT FOR NOW: when both routes have a title, take it from Anna's (md5-checked on arrival); record a bad Z-Library id in the wishlist row so it is not requested again |


### Ahead sources per franchise, 2026-11-10 (AR56-AR59)

Weibao: "For behindness, we can find the source that is ahead, so for something like Re zero we can get the webnovel instead? and hold the original instead? Consider ease of prsing and more?", then "do consider cases where the webnovel might be better too, or we can cross check betwee nthe two?" He accepted the proposal below ("Yes, record and queue"). [Direction log](../gm/USER_VISION_LOG_2026-11.md#ahead-sources-and-cross-checking-versions-2026-11-10).

| Code | Rule | Disposition |
|---|---|---|
| AR56 | **Hold the ahead source.** Default: for each franchise, acquire the text source that runs furthest and fullest (often the web novel or the original medium), not only the adaptation that is behind it. Dial: a behind version is still worth holding when it adds side stories, illustrations, a better translation or revised content. Reason: the lead-life and lore runs need the whole known trajectory. Held behind copies are not deleted | ACCOUNT FOR NOW: a franchise gap check names which medium is ahead before a download wave picks volumes |
| AR57 | **Prefer the easier text to parse.** Default order: official EPUB, fan compilation EPUB, web capture through the polite transport (strip translator notes), PDF with a text layer, scanned PDF (OCR), comic images (OCR with no speaker labels). Comics are the main source only where the comic is the original (JJK, Naruto, Bleach, Frieren, Witch Hat Atelier, Chainsaw Man). Dial: an anime original can use subtitle files, which parse more easily than its manga or scanned novels | ACCOUNT FOR NOW: choose among same-coverage candidates by this order |
| AR58 | **No version wins by default.** A light-novel rewrite can be the better canon for what it covers (Re:Zero arcs 3-4, Overlord, Konosuba). The web novel can be better too: content the rewrite cut, compressed or changed, a complete fan translation where the official one stops, author notes, or a different plot the world might want. Where both exist and differ, hold both | ACCOUNT FOR NOW: record which version a doc or reading cites |
| AR59 | **Cross-check the two.** Where both versions are held, keep a chapter alignment map (as done for the RTOC alignment, 2026-11-01) and a divergence list (added, cut, changed). A world pass then picks per question or offers both by world dial (AD5), and cites the version it used | LATER: sonnet, small per franchise, first Re:Zero (web novel arcs 1-2 and 5-10 against light novels); done when the map and divergence list exist in the franchise's research folder |

## Content reconciliation B627: scope of tools and historical routes

The full321-line input and every localARrow were read. Keep these source-tool ARcodes distinct from the architecture rulebook. Route checks, quotas, member-key readiness, prices, disk use and app/version statements dated October21–31 are historical evidence. Later [library receipts](LIBRARY_INDEX.md#content-reconciliation-b626-current-routing-and-dated-holdings) supersede old partial holdings and mock-only route states within their actual scope. This review launches no transfer, tool, worker, browser or monthly watchlist.

AR36b’s command remains the required discovery step before a gap recommendation, but its result has narrower meaning than the old description. The current script scans HTMLmembers and their title tags rather than validating OPFspine completeness/order; it reports at most8detected integergaps. Its --compilations route filters EPUBmetadata above3MB and applies heuristics, so small or differently labeled compilations can be missed. A zero non-Latin title query can also be false when raw JSON stores Unicodeescapes. Exact source keys, unique hash-prefix matches and decoded metadata resolved the B626宿命之环case. Fuzzy matches can include unrelated series. Use the actual source/TOC/edition context before a missing-range conclusion; a title scan does not compare narrative text.

Preserve source/reader derivatives, exact edition and author identity, distinct LN/WN/retail/serial/media baselines, unnumbered first volumes, actual compilation overlap and paid-reading approval. WNarc coverage is not automatic possession of an LNedition. A same-hash duplicate is different from another edition or a reader repair intentionally kept with identical story text. AR40’s original mechanism-harvest suggestion does not limit current selected protagonist/canon work.

Existing explicit RR/d20browser grants and transport stops keep their precise source/scope/history. They do not become a new general download grant or a need for unnecessary confirmation within an already authorized run. Keep raw hashes, capture/edition boundaries and actual reading claims separate. For selected future work, current [tool registry](../TOOL_REGISTRY.md), [library](LIBRARY_INDEX.md), [wishlist](DOWNLOAD_WISHLIST_2026-10-30.md) and run owner govern. No current external availability, source fidelity, paid allowance, native tool behavior or installed version is re-certified here.
