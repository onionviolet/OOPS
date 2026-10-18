# Reincarnated in a Shounen Manga research

**Complete for the available public text, 2026-10-16:** 255 story chapters
and one announcement, approximately 434,016 words. Four consecutive full-body
readers cover all 256 entries; source hashes, order and coverage pass.
[YAIR considerations, RS11–RS26](YAIR_CONSIDERATIONS_2026-10-16.md) and the
[private full-read dossier](private/FULL_READ_DOSSIER_2026-10-16.md) hold results.

Requested full available-story read, 2026-10-16. Research proposals, not an
accepted world adaptation or gameplay implementation. Public palette owner:
[comic worlds RS1–RS10](../../COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md).

## Saved source and reusable analysis

[Private EPUB snapshot](private/epub/reincarnated-in-a-shounen-manga-royal-road-2026-10-16.epub)
contains chapters 1–255 and the announcement, author attribution, original URLs,
a table of contents and a snapshot-provenance page. Generated offline from the
existing captured text; no pages were fetched. It is a simplified reference
edition, not the author's published EPUB or a completed-novel claim.
[EPUB validation](private/epub/EPUB_VALIDATION.json) records its hash, 256 exact
text roundtrips, XML/ZIP integrity and manifest/spine/navigation checks. It has
not been visually checked in an external EPUB reader.

[Exact analysis prompts](private/ANALYSIS_PROMPTS_USED_2026-10-16.md) preserve
four original reader briefs plus their steering and coverage-repair instruction.
[Reusable consolidated prompt](FULL_STORY_ANALYSIS_PROMPT.md) describes the
method with current AU1–AU8 budgets. It is a template written after the run,
not a verbatim original master prompt. These files document the method; they
do not launch another reading pass.

For a future question, start with the private full-read dossier, the relevant
reader receipt and its chapter locator. The EPUB uses
`EPUB/entry-NNNN.xhtml#Lnnn`, matching catalogue entry and captured-text line.
The announcement remains entry181, so subsequent chapter and entry numbers
differ by one. The source bodies and original HTML stay authoritative for
this capture; EPUB presentation is simplified. A changed edition gets a new
snapshot/hash rather than silently replacing the one these notes cite.

The EPUB, original captures, detailed notes and exact prompts are gitignored
private files. Git alone does not preserve that directory when cloning the
repository; include it in the existing personal backup if needed.

## Acquisition route and tools

User explicitly authorized the one-book robots-policy exception and browser
route on 2026-10-16. Original scraper source remains unchanged. A task-local
Client subclass reused the existing transport/data and overrode only a robots
stop for the selected catalogue. The real catalogue request returned HTTP 403;
the transport saved that new refusal. It was not retried.

The user-authorized background browser displays the public catalogue and
chapters. Collection uses ordinary serial navigation with randomized 4–8-second
pauses initially, narrowed to 4–5 seconds after chapter 117, one saved rendered DOM/body per entry, and no login, proxy rotation,
challenge solver or parallel chapter requests. Browser capture is a separately
qualified route, not successful lncrawl-polite acquisition. Its HTML and text
hashes support integrity checks; rendered DOM is not raw HTTP response bytes.

| Route | Primary source / mechanism | Status for this task |
|---|---|---|
| Existing lncrawl-polite | /Users/weiwei/code/lncrawl-polite/README_POLITE.md; honest identity, durable stops, pacing/cache/receipts | Robots-only exception tested; catalogue returned 403; stopped |
| [WebToEpub](https://github.com/dteviot/WebToEpub) | Browser extension; explicitly lists Royal Road; [dedicated parser](https://github.com/dteviot/WebToEpub/blob/master/plugin/js/parsers/RoyalRoadParser.js) | Documented candidate, not installed or tested here |
| [FanFicFare](https://github.com/JimmXinu/FanFicFare) | [Dedicated Royal Road adapter](https://github.com/JimmXinu/FanFicFare/blob/main/fanficfare/adapters/adapter_royalroadcom.py); metadata/EPUB packaging | Existing local bridge discovered; not run for this book |
| [FanFicFare browser cache](https://github.com/JimmXinu/FanFicFare/wiki/BrowserCacheFeature) | Reuses exact cached URLs, but documentation lists Royal Road as not working due to cache-control headers | Not selected; generic browser-cache support does not prove RR compatibility |
| CUA background browser | Exact catalogue URLs, public rendered chapter DOM, local checkpoint | Complete, exercised capture route; full reading checked separately |

Tool recommendations are documentation-backed unless marked exercised. This
comparison does not claim all downloader defaults are gentle or that an
extension avoids rate limits. Single-book scope, serial requests, several-second
spacing, saved progress and no repeated fetching define this run's low-load
behavior. A browser also requests normal page assets, so chapter-navigation
spacing is not a claim about every underlying network request.

## Evidence and reading

Private [acquisition receipt](private/ACQUISITION_2026-10-16.json),
[full-read plan](private/FULL_READ_PLAN_2026-10-16.md), and
[browser progress](private/browser/PROGRESS.json) retain exact status.
Initial RS1–RS9 considered only chapters 1, 3 and 8. Do not treat catalogue
capture, file existence or keyword searching as full reading. Reader coverage
receipts identify actual consecutively read entries and source hashes.

Catalogue inspected in browser: 256 entries, comprising numbered chapters
1–255 and an announcement at entry 181. Inactive label is visible; the last
available chapter does not establish a completed narrative. Capture and full-body reading are complete through chapter 255; the available
ending itself remains unresolved. [Full reading validation](private/FULL_READ_VALIDATION.json)
records 256 matching source identities and no coverage gaps or overlaps.


Completion checks: `private/validate_capture.py` verified all rendered-page/text
hashes, 256 unique catalogue entries, ordered chapters 1–255, populated bodies,
no duplicate bodies and no title mismatches. The four reader manifests were
joined and checked against those exact source identities. Root directly
spot-checked key timer/command/identity rules and read the full late correction
chapters 251 and 255. New document links and diff whitespace were checked.
No gameplay test/build or save modification was needed for this research pass.

One capture batch exceeded the browser tool timeout after loading chapter 112;
recovery saved that existing page and skipped completed files. A later command
deadline after navigation likewise resumed from the already-loaded chapter126.
These were tool-control interruptions, not a successful HTTP retry or a new
site-access grant. Browser ownership stayed with the root session because
subagents could not access its IAB; readers worked only on saved local text.


## Preservation follow-through, 2026-10-16

Requested: save an EPUB for future reference and explain/preserve the analysis
prompt, using more-to-consider. Rules AD35–AD37 apply; this pass performed no
new reading, dispatch or acquisition.

**ACT NOW, done:** packaged and structurally verified the EPUB, including 256
exact source-text roundtrips; archived four literal reader briefs and four
steering/repair instructions from the session; wrote the clearly labeled reusable
prompt; linked all outputs from this existing research owner.

**ACCOUNT FOR NOW:** preserve edition/hash identity, catalogue-to-chapter mapping,
line anchors and unresolved source boundary. Reuse the existing full-read notes
for future questions. Exact historical prompts are receipts; the current
[agent usage rules](../../AGENT_USAGE_RULES.md) govern new executions. Private archives need the personal backup, not a
public Git commit. No backup/export to another service was performed here.

[Preservation checks](private/PRESERVATION_VALIDATION_2026-10-16.json) retain
artifact and prompt hashes. EPUB-reader visual acceptance remains untested;
ZIP/XML/navigation and all source-text roundtrips passed.


## Method folded into the playbook, 2026-10-16

The [source deep-dive playbook](../SOURCE_DEEP_DIVE_PLAYBOOK.md#saved-sources-first)
now owns saved-EPUB/notes-first routing, coverage reuse, connected P1–P5 analysis,
late-rule reconciliation and the reusable reader brief. The source-specific
[entry point](FULL_STORY_ANALYSIS_PROMPT.md) links that owner; exact historical
prompts and the pre-fold template remain private receipts. Current AU1–AU15
rules govern future work, including the source-sized full-book plan and bounded
fresh reader contexts. This fold performed no new reading or acquisition.
