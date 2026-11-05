# YAIR source-gap acquisition: Bookworm

Type: CURRENT-STATE. Audience: developer reference. 2026-10-21, America/New_York.

## Scope and selection

G1: Weibao asked to use the new desktop-session book tools for something YAIR is
missing. This selects one source acquisition, not bulk series capture, whole-book
reading, a Calibre import or gameplay implementation. Applicable rules: AD32
(resolve routine choices), AD35 (private detailed source preservation), and
AGENTS/research-and-agents source qualification and acquisition routing.

The live [household source owner](HOUSEHOLD_STAFF_AND_SUCCESSION_SOURCES_2026-10-21.md)
HS4 records only publisher metadata/synopses for *Ascendance of a Bookworm*, with
Parts 3–4 as candidates for noble education, attendants and duties. Its detailed
mechanisms were not verified. A fresh read-only SQLite title search of both
`/Users/weiwei/Calibre Library` and `/Users/weiwei/Sync/CalibreLibrary` found no
Bookworm/Household/Paston title matches. A filename search of Downloads found no
Bookworm/Honzuki title aliases. These are scoped checks, not an inventory of all
possible translations or storage locations. No library was modified.

G2: Selected *Ascendance of a Bookworm: Part 3 Adopted Daughter of an Archduke,
Volume 1*, Miya Kazuki, English EPUB. Its
[official series page](https://j-novel.club/series/ascendance-of-a-bookworm) and
[publisher/distributor edition page](https://yenpress.com/titles/9781718356078-ascendance-of-a-bookworm-part-3-volume-1-light-novel)
identify quof as translator and describe etiquette/magic training and noble duties.
This is a concrete match to the named household gap. It is one volume, not a
complete series or all five Part 3 volumes. The catalogue search was bounded to
20 results, so it does not prove no larger compilation exists. The selected
volume was chosen for scope and publisher/translation identity, not file size.

## Live MCP evidence

V1: The project Z-Library launcher passed its scoped offline readiness probe.
A real stdio client initialized the editable MCP server, read desktop status,
resolved metadata, acquired ID 11787166/hash 77f82c via `download_desktop_book`,
retried through the same tool for a verified cached result, prepared the EPUB,
and rechecked account quota. One download was used. The cache retry returned
`request_issued:false`; no link was issued for that retry. No account identifiers,
session keys or signed file URLs are stored in this report.

V2: The saved file is 33,668,966 bytes; SHA-256
`dbfd6196a9570251f3b063d5b750b2f51e13aa3c68461a5a4236e6fa6a650a74`.
ZIP CRC verification passed. OPF title, language, publisher and creator metadata
match the selected volume, including Miya Kazuki and quof. All 57 spine entries
were prepared in order; 22 image assets remain in the unchanged EPUB. The
extractor reports 21 empty-text members and 22 image-transcription warnings,
covering image-only front matter, inserts, map, character/bonus/manga/poll pages
and signup artwork. These warnings are preserved, not treated as missing prose
or silently discarded pages. Structural checks and metadata cannot independently
certify that every publisher page or textual variant is present.

V3: Private artifacts are under
`docs/research/novels/zlibrary/bookworm-part3-vol1-en-11787166/`:
`sources/` contains the unchanged EPUB, verified cache manifest and issuance
receipt; `prepared/` contains text.json and SOURCE_RECEIPT.json;
ACQUISITION_CHECK.json and STRUCTURE_CHECK.json hold this run's machine evidence.
Git confirmed the acquisition evidence is ignored. No book prose is included in
this report. Acquisition and preparation are complete; semantic reading coverage
is `extracted-not-read`. No world-law claim or gameplay change follows from them.

## Remaining research boundary

The desktop tool's first live acquisition/cache gate now passes for this exact
edition and session. Other editions, long-transfer recovery and series completeness
remain outside this evidence. The next research task can inspect the selected
volume's actual household/education passages and save source-qualified notes in
its private owner. That is separate from acquiring the source; no whole-book
reader run was launched here. Stock desktop app, Calibre libraries and user game
saves were unchanged. No commit or push was performed.


## Content reconciliation B491: source status and actual consumer limits

Historical exact-source acquisition, not live library completeness, under AD32/AD35 and source qualification. G1/G2 select one English Part3 volume1 for a named household/education gap, not bulk capture, whole-book reading or a Calibre import. Scoped negative title/filename searches do not establish absence under all translations/locations, and the20-result catalogue bound does not rule out a compilation. Publisher metadata provides selection context rather than verified household mechanics.

V1's acquisition and cache retry consume different operations: one download, then request_issued:false from the verified cache. Offline launcher readiness is separate from the live session's exact successful tool gate. Quota/session state is dated and no account secrets/URLs are retained. V2's bytes/hash/ZIP CRC/OPF metadata and57 prepared spine entries establish that artifact's structure, not authenticated complete publisher variants. Preserve21 empty-text members and22 image warnings alongside22 retained image assets; they may concern image-only material rather than missing prose and have not been visually/semantically read here.

V3 remains extracted-not-read. Ignored artifacts and prepared hashes do not supply source-law qualification or implementation. The CURRENT-STATE label is historical2026-10-21 scope, not today's source-library membership, quota, tool state or newest edition. The next actual household passage review remains a separate source task under current direction; this content reconciliation performs no acquisition, source prose/image read, Calibre write, app/status query or save access. Keep the exact private artifact route and useful selection rationale without treating the old download brief as present permission to fetch another volume.
