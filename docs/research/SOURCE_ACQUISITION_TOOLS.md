# Existing source acquisition tools

Current routing guidance, refreshed 2026-10-21. Applies to selected novel/fanwork research
for this project. This is tool discovery and execution guidance, not permission
to acquire everything in a catalogue or to implement the resulting ideas.

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
