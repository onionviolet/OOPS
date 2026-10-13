# Existing source acquisition tools

Current routing guidance, 2026-10-12. Applies to selected novel/fanwork research
for this project. This is tool discovery and execution guidance, not permission
to acquire everything in a catalogue or to implement the resulting ideas.

## Discover and reuse first

Check local source owners and already acquired files first. For a needed new
download, inspect the existing tools below before creating a task-local scraper.
User-authorized downloads can proceed within their selected scope without a
second permission question. Prefer an existing author/platform export when it
meets the request; preserve source/version, raw hashes and actual reading scope.

| Tool | Actual capability / entry point |
|---|---|
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
