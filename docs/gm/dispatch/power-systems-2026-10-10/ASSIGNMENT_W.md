# Lane W: polite wiki crawl for power systems

Follow `ASSIGNMENT_COMMON.md` in this folder. Weibao: "send out the
crawlers? Consider going through the wikis and more?"

## Scope

Series: every series in `docs/research/power-systems/*/SERIES.json` (lanes
A, B, C) plus lane D's candidates once `broad-scout/CANDIDATES.json`
exists. Pages: each wiki's power-system, techniques, abilities, contracts
or vows, ranks or grades, items and artifacts, and major lore or world-rule
pages. Not character biographies beyond what explains a mechanic.

## How

- **Use each wiki's official API**, not HTML scraping: MediaWiki
  `api.php` (Fandom, Wikipedia and most fan wikis) with `action=parse` or
  `action=query&prop=revisions` and `format=json`. Check robots.txt and the
  API's own rate guidance first. Honest user agent naming this as a
  personal research client with no contact spoofing.
- Polite rules from `docs/research/novels/SUBAGENT_RUN_RULES.md`: serial
  per host, 4 to 8 s gaps, cache everything and never refetch, stop a host
  on the first 403/429/challenge, cap 400 pages per host per session.
  Reuse the network layer in `/Users/weiwei/code/lncrawl-polite` (branch
  `polite`) if it fits; don't modify that repo's committed code.
- Wiki text is CC BY-SA on most fan wikis. Store raw pages privately in
  `~/.codex/research/wikis/<wiki>/` with URLs, revision IDs and hashes.
  Tracked outputs paraphrase mechanics with source links; no copied prose.

## Output (`docs/research/power-systems/wiki-digests/`)

- One `DIGEST_<series>.md` per series: the mechanics, rules and costs as
  the wiki describes them, mapped to E8 axes, E8B families, E8C path parts
  and E8D vow slots, with revision-linked citations.
- `CORRECTIONS.md`: anything in `docs/emergent/E8*.md` or lane A to C
  rows that a wiki contradicts or refines, with evidence.
- `NEW_MECHANICS.md`: ranked mechanics not yet in E8 to E8D.
- `REPORT.md`, `SOURCES.md`, `CHECKPOINT.md`.
- Anything needing a login or blocked: add a row to
  `docs/research/SOURCE_REQUESTS.md` (next free S number).

## Addendum (2026-10-10): Fandom database dumps

Claude found that Fandom's public database dumps are served from Amazon S3
without the Cloudflare challenge: a HEAD request for
`https://s3.amazonaws.com/wikia_xml_dumps/j/ju/jujutsukaisen_pages_current.xml.7z`
returned 200 (Last-Modified 2026-02-20). These are the dumps Fandom itself
offers for download (linked from each wiki's Special:Statistics page);
content is CC BY-SA. A missing key returns 403 from S3, which is just
"wrong name", not a challenge.

1. URL pattern: `https://s3.amazonaws.com/wikia_xml_dumps/<c1>/<c1c2>/<dbname>_pages_current.xml.7z`,
   where `<dbname>` is usually the wiki subdomain with hyphens removed
   (jujutsu-kaisen -> jujutsukaisen). Try at most two name guesses per wiki
   with HEAD requests, 4 to 8 s apart; record misses.
2. Polite: one download at a time, 4 to 8 s between requests, cache and
   never refetch, skip any single dump over 1.5 GB compressed without
   asking (list it in REPORT), stop the S3 route on any 429 or throttling.
3. Extract with a local 7z tool or `py7zr` in a private venv; store under
   `~/.codex/research/wikis/<wiki>/dump/` with hash and Last-Modified.
   Read pages from the XML offline; record each page's revision id.
4. **Priority order** (our worlds and the law path first): Jujutsu Kaisen,
   Lord of Mysteries, Mother of Learning, Bleach, Naruto, Harry Potter,
   Elden Ring, Elder Scrolls (Skyrim pages only; large), Fallout (large;
   size rule applies), Reincarnation Paradise if a wiki exists, then
   Chainsaw Man, Hunter x Hunter, Undead Unluck, Fate, Stormlight,
   Cradle, Worm, Mistborn, Reverend Insanity, Omniscient Reader, and the
   rest of the blocked subjects.
5. For each, revise its `DIGEST_<series>.md` from blocked to
   revision-backed, update `CORRECTIONS.md` and `NEW_MECHANICS.md`, and for
   our worlds add a short **law-lore section**: what the source itself says
   about laws, oaths, vows, contracts, courts, authority and rule powers
   (for E9's per-world table; LOTM: the order and lawyer pathways; JJK:
   binding vows; MoL: institutions and the loop; Paradise: contracts).
6. Mark the matching `SOURCE_REQUESTS.md` wiki rows (S16 onward) as
   "covered by dump <date>" in their Status cell. Don't edit other cells.

## Addendum 2 (Weibao, 2026-10-10): full dumps

Weibao: "for the dumps we can consider full dumps accordingly?" Yes:
download the **full** `pages_current` dump for every subject's wiki, not
only priority ones, and use full coverage of each wiki when reading
(every power, ability, contract, law, organization and world-rule page,
not a sample).

Disk is tight (about 7 GB free on 2026-10-10). Sizes checked by HEAD:
elderscrolls 197 MB, fallout 154 MB, jujutsukaisen 2.7 MB compressed.
- Keep dumps **compressed** on disk. Read them by streaming
  (`7zz x -so <dump> | <iterative XML parser>`, or py7zr streaming); don't
  write a full extracted XML for any dump over 50 MB compressed.
- Save only page-level indexes, hashes, and the pages you cite.
- **Disk floor:** check free space before each download; stop downloading
  if free space would fall below 4 GB, and list what's left in REPORT.
- The 1.5 GB compressed cap still applies; all checked dumps are far
  below it.
- Installing 7-Zip (`brew install sevenzip`, provides `7zz`) is allowed.
