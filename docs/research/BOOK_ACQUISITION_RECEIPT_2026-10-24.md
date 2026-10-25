# Book acquisition receipt, 2026-10-24

Type: ACQUISITION RECEIPT. Acquisition only; nothing here is read, absorbed or
implemented. Owner list: [book candidates](BOOK_CANDIDATES_2026-10-22.md).
Route: Source Library CLI (`source-library --key ... download`), Bookracy via its
headless browser transport, Gutenberg via its provider API. Pacing 6 to 8 s between
calls, one download at a time. Files sit in the Source Library
(`~/.local/share/source-platform/library/<sha256>/`) and were then added to
`/Users/weiwei/Calibre Library` (ids 193 to 217; library 192 to 217 records).
Verified = epub zip integrity and HTML part count, or PDF header and the
catalogue's page count. "Opens and looks complete" is a structure check, not a read.

## Already held before this run (skipped)

The doc's holdings list was stale: Calibre and the Source Library catalogue already
held these from the 2026-10-22/23 waves. Rows 1 to 3, 4 (PHB 2014), 5 (Naruto Hiden
plus Shikamaru, Konoha, Sakura, Sasuke), 6 and 8 (Fate/Zero 1 to 4, Apocrypha 1),
9 (Re:Zero Vols 1 to 10 plus WN arc 3/4 files; Re:Zero is held), 10 and 11 (Bookworm
Part 1 Vols 1 to 3, Part 2 Vol 1, Fanbooks 2 to 7 except 1), 12, 13 (Xanathar, Tasha),
17 (Thaumatology), 24 (four FMA novels).

## Acquired (24 titles)

| Title | Id (md5 prefix) | Size | Route | Verified |
|---|---|---|---|---|
| Cradle 4 Skysworn | 1375aced125c | 758 kB | Bookracy | epub ok |
| Cradle 5 Ghostwater | d43540a86a70 | 744 kB | Bookracy | epub ok, 30 parts |
| Cradle 6 Underlord | 142124ea5c9d | 687 kB | Bookracy | epub ok, 30 parts |
| Cradle 7 Uncrowned | fd151f490afc | 677 kB | Bookracy | epub ok, 28 parts |
| Cradle 8 Wintersteel | 4e4a0001f448 | 706 kB | Bookracy | epub ok, 37 parts |
| Cradle 9 Bloodline | 4d52e882cd24 | 584 kB | Bookracy | epub ok, 30 parts |
| Cradle 10 Reaper | a6f28b775415 | 527 kB | Bookracy | epub ok, 35 parts |
| GURPS Powers (4e) | e71311602dca | 6 MB | Bookracy | pdf, 242 pp |
| GURPS Infinite Worlds (4e) | d7f981251d86 | 5.8 MB | Bookracy | pdf, 242 pp |
| Blades in the Dark core (2017) | 2b18a2d97767 | 48 MB | Bookracy | pdf, 336 pp |
| M&M 3e Hero's Handbook | 277f28359d21 | 23 MB | Bookracy | pdf, 233 pp |
| Log Horizon Vol 1 (Yen On) | 727d4201f47f | 12 MB | Bookracy | epub ok, 38 parts |
| Log Horizon Vol 2 | 9d8c9ba3f443 | 15 MB | Bookracy | epub ok, 46 parts |
| Planescape: Adventures in the Multiverse | 2209e8cba9af | 11 MB | Bookracy | pdf, only 95 pp: likely one component, not the full set. Flagged partial |
| Strange Stories from a Chinese Studio (Giles, 2 vols) | PG 43629 | 649 kB | Gutenberg | epub ok |
| Younger (Prose) Edda | PG 18947 | 253 kB | Gutenberg | epub ok |
| Volsunga Saga | PG 1152 | 210 kB | Gutenberg | epub ok |
| Le Morte d'Arthur Vol 1, Vol 2 | PG 1251, 1252 | 591, 659 kB | Gutenberg | epub ok (243, 268 parts) |
| Romance of the Three Kingdoms vol 1 of 2 | PG 77416 | 815 kB | Gutenberg | epub ok; vol 2 not on Gutenberg search |
| Mabinogion; Kalevala; Beowulf; Nibelungenlied; Tao Teh King | PG 5160, 5186, 981, 7321, 216 | 98 to 426 kB | Gutenberg | epub ok |

Calibre titles for Blades, Reaper and Planescape were set by hand because the source
files carried the title "source" or "10. Reaper".

## Failures and gaps

- Bookracy browser TimeoutError after about 91 s (job interrupted, no replay, no
  alternate source): Fanbook 1 (two copies, 71 MB epub and 37 MB pdf), Log Horizon
  Vol 3 (two copies), Vol 4 (two copies), Vol 5 (two copies), Fate/strange Fake
  Vol 1 and 2 (pdf, unofficial naming), Van Richten's Guide to Ravenloft, Sword Coast
  Adventurer's Guide (two copies), Eberron: Rising from the Last War. Pattern: files
  that are not cached server side stall, small cached ones finish in 2 to 8 s. Retry
  later, not in a loop.
- PG 73533 (Poetic Edda): provider returns `select_a_chapter_or_file`; not fetched.
- D&D PHB: no new copy needed; the 2014 PHB is already in Calibre (id 164).
- Not attempted: Fanbook 3 (already held), Fate/strange Fake 3 to 5, Cradle omnibus,
  doc section 3 and Suwayomi/visual rows (29 to 30, section 4). Section 3 text rows
  remain open.
- Skipped on purpose: Naruto Hiden Vol 06 (954 kB, likely partial).

## Next

Retry the nine timed-out titles in a later session (one at a time, long gaps).
Absorption (reading, ledgers) is a separate state and has not started.

## Addendum: Re:Zero fan-translation route (Witch Cult Translations)

Request relayed from the worktree-reconciliation session: Re:Zero from Witch Cult
or a comparable fan translation, covering arcs beyond the Yen On volumes and arcs
1 to 4 if not held. Result: no new download was needed.

- Adapter check: `lncrawl-polite` has no witchculttranslation adapter (its CLI is
  Fanqie only; the fork's upstream loader is not polite mode). The existing route
  for this site is the polite `Client` transport, already used on 2026-10-22.
- Already held (found, not re-fetched): a 2026-10-10 WordPress JSON dump at
  `docs/research/novels/rezero/witchcult/` (`rezero_wct.json`, 504 numbered
  members, `MANIFEST.tsv` with titles and URLs, gitignored). By arc from the
  manifest titles: Arc 1 24, Arc 5 85, Arc 6 91, Arc 7 117, Arc 8 77, Arc 9 63,
  Arc 10 28, plus IFs, supplements and indexes. Arc 4 (unrevised phases 1 to 6 plus
  post-read) and the Arc 3 interludes are the eight PDFs fetched through the
  polite transport on 2026-10-22 and now Calibre ids 165 to 172. Yen On Vols 1 to
  10 are in Calibre (ids 140 to 163, 175).
- Freshness probe today, two polite GETs on the existing transport state (robots
  allowed, HTTP 200): the live `/table-of-content/` lists 478 distinct post links
  and `/arc-10/` lists 27 chapters. Every Arc 5 to 10 link matches the dump apart
  from 15 slug or redirect differences; no new chapters since the dump.
- Not obtainable there: Arcs 2 and 3 main chapters and the Arc 4 revised chapter
  posts are not on the live site (taken down, as `SOURCE_REQUESTS.md` S99 says).
  Arcs 1 to 3 are covered by Yen On Vols 1 to 9; Arc 4 by the unrevised PDFs plus
  Vol 10. Yen On Vols 11 and up were not searched.
- No other fan-translation source was tried. Verified here means counts from the
  manifest and the live TOC, not a reading of the chapters.

## Addendum 2026-10-24 (evening): Bookracy timeout diagnosis

Root cause (ours, not server-side proof): `scripts/bookracy_browser.py` in
`/Users/weiwei/code/zlibrary-research` waited for the download to start with a
hard `page.expect_download(timeout=90000)`. Every failed job in
`~/.local/share/source-platform/catalogue.sqlite` ends `bookracy_browser_TimeoutError`
with `request_issued` set after the click, matching the 91 s timing. A second cap,
`communicate(timeout=150)` in `Platform.browser` (`scripts/source_platform.py`), would
cut off anything slower. Whether uncached files start downloading within a few
minutes is not yet shown; that is what the retry tests.

Change (uncommitted, in the Source Library repo, nothing in YAIRPG code):
- `bookracy_browser.py`: new `download_wait_ms()`, reads
  `SOURCE_LIBRARY_BROWSER_DOWNLOAD_SECONDS` (default 90, clamped 10 to 900).
- `source_platform.py`: new `download_wait_seconds()`; the outer worker limit for
  `download` becomes 150 + (wait - 90). Default behavior is unchanged. This file also
  carries another session's uncommitted edits (webtoon page sizes, `chapter_deadline`);
  they were left alone.
- Syntax checked only; no test run, running servers still hold the old code.

Retry status: none downloaded. One CLI attempt (Log Horizon Vol 5, `bookracy:d05dde05...`,
wait 600) failed instantly with `download_busy` ("Another shared download is
running"). The governor's Suwayomi chapter loop (pid 45579, started 18:00, runs
`source-library ... suwayomi:chapter-N` back to back) holds the shared download
lease almost continuously. Bookracy has not been contacted this session, so the
wait fix is untested. Not bypassing the lease; a multi-minute Bookracy download would
make that loop's chapters fail with `download_busy`.

Next: pause the governor loop (or wait for its queue to end), then run one title at a
time with `SOURCE_LIBRARY_BROWSER_DOWNLOAD_SECONDS=600`, starting with a 12 to 20 MB
Log Horizon epub. If it still stalls past 10 minutes, the stall is server-side and the
next step is a different copy or source. PG 73533 file choice is not yet done.

### Update 2026-10-24 21:15: fix works, queue reprioritized

- Log Horizon Vol 5 (`bookracy:d05dde05...`, epub, 20,611,184 bytes, sha256 `dc36cadd...2367`)
  downloaded through `source-library` with a 600 s wait, about 6 minutes. Uncached
  Bookracy files take well over 90 s to start, so the 90 s wait was the cause, not a
  dead file. Prior interrupted jobs block a retry (`prior_job_requires_review`); they
  were archived by renaming the job's candidate to `<key>:reviewed-attempt:<job id>`,
  the same convention the governor scripts use.
- Weibao's priority call: Slime and No Game No Life ahead of Log Horizon. Neither is
  in Calibre (library holds Log Horizon Vols 1 and 2 only).
- Long-term backlog (do not run now): Log Horizon Vols 3 and 4 (Vol 3 was in flight
  when this was decided), Van Richten's Guide to Ravenloft, Sword Coast Adventurer's
  Guide, Eberron: Rising from the Last War, Fate/strange Fake Vols 1 and 2 (unofficial
  PDFs), Ascendance of a Bookworm Fanbook 1, Fate Zero Vol 4, The Strange character
  options. Keys are in the `jobs` table of the Source Library catalogue.


### Update 2026-10-25: priority titles and Z-Library route

- Downloaded, zip-verified, added to Calibre: Log Horizon Vol 5 (id 230, 55 parts),
  No Game No Life Vol 4 (id 231, 43 parts, 8.1 MB), That Time I Got Reincarnated as a
  Slime Vol 16 (added this update; id in Calibre list).
- Stalled with the 600 s wait, one attempt each, now backlog: Log Horizon Vol 3, No Game
  No Life Vol 5. Archived with the `:reviewed-attempt:` rename so a later retry is allowed.
- Not searchable on Bookracy (10-result cap, wrong hits): Slime Vol 1, No Game No Life
  Vol 1. Try desktop Z-Library search for those.
- Z-Library: CLI login needs an email/password account (no Google sign-in). Desktop route:
  `z-lib.do` added to `TRUSTED_HOSTS` in `zlibrary-research/scripts/desktop_client.py` with
  Weibao's approval; `desktop-status` then returns `desktop_route_blocked` (open a library
  tab in the Z-Library app to refresh the route). Quota still unknown.
- PG 73533 (Poetic Edda) file choice, Ravenloft/Sword Coast/Eberron and the rest of the
  backlog remain open.
