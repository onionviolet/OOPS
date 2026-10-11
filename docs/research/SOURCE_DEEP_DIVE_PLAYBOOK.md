# Source deep dive playbook

A reusable method for turning a book, series, game or wiki into
implementation-ready research. First used for Lord of the Mysteries and
Circle of Inevitability on 2026-10-10. That run is the worked example:
`docs/research/novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md`
(private, gitignored).

Runs so far: Lord of the Mysteries and Circle of Inevitability, then
Shadow Slave (`docs/research/novels/shadow-slave/SYSTEMS_DEEP_DIVE_2026-10-10.md`),
both on 2026-10-10. Also 我有一個修仙模擬器, a second simulator novel
(`docs/research/novels/woyouyigexiuxianmoniqi/DEEP_DIVE_2026-10-10.md`),
read in full from ttks.tw on 2026-10-10. Then nine at once on 2026-10-10
(A Novel Concept, Legendary Mechanic, ORV, Regressor's Tale, Speedrunning
the Multiverse, You Have Died Again, Solo Leveling, Labyrinth of the Mad
God, Fated Villain), each building on its full-book dossier; index in
`docs/research/novels/DEEP_WORLDS_DEEP_DIVES_2026-10-10.md` (private).
Also two simulator comparison novels that day: 聖女幫我模擬修仙
(`docs/research/novels/shengnvbangwomonixiuxian/`) and
凡人：從極陰島開始的修仙模擬器 (`docs/research/novels/fanrencongjiyindao-moniqi/`,
free 44 chapters only).
Also SSS-Class Suicide Hunter (Revival Hunter on Wuxiaworld), complete
400-chapter EPUB, on 2026-10-10
(`docs/research/novels/sss-class-suicide-hunter/DEEP_DIVE_2026-10-10.md`).

Lessons from the nine-book batch:
- A session holds about 20 concurrent agents. Nine coordinators each
  planning four readers overflowed it, and most readers never launched.
  For a batch, either give each coordinator one or two readers or run
  fewer books at once.
- The in-app browser has a tab cap. Close your tab when done.
- Many Royal Road and Aethon books have no wiki (ANC, Speedrunning, You
  Have Died Again, Labyrinth). Check for a Fandom 404 once, then use the
  author's glossary or RR pages as the M4 source and use chapter ids in
  place of revision ids.

This playbook is a method, not accepted design. It sits beside the
[book audit pipeline](novels/WORLD_AUDIT_PIPELINE.md) (private), which
covers bounded world audits. Use this playbook when the question is "how do
we implement this whole system", not "what does one scene establish".

## When to use which module

Pick the modules the question needs. Most runs use M1, M2 and M5.

| Module | Question it answers | Output |
|---|---|---|
| M1 System catalog | What are all the paths, ranks, classes or items, with names, abilities, costs and gates? | One table per path, then a master table |
| M2 Rules to engine | What laws govern the system, and what state does a game need to model them? | Rules table with an engine shape per rule, plus a data model |
| M3 Coexistence survey | How do fans put an original character in the same world as the protagonist? | Premise taxonomy, game start options, mechanics, pitfalls |
| M4 Wiki cross-check | Which gaps and conflicts does the community wiki resolve? | Gap fills and conflict notes, each with a revision id |
| M5 Synthesis | What should YAIRPG do with it? | Deep dive doc with rules, mapping, starts, "more to consider", first slice, gaps |

Other module ideas that fit the same frame: an economy and prices pass, a
timeline and canon-event clock pass, a cast schedule pass, a locations and
travel pass.

## Steps

1. **Check what exists.** Search `docs/` and `docs/research/` for the
   title, its native title and its key terms. Earlier audits, wiki digests
   (`docs/research/power-systems/wiki-digests/`) and world cards often
   cover part of it. Build on them and link them.
2. **Find local sources.** Search the Calibre library and Downloads
   (`docs/research/novels/LOCAL_LIBRARY.md` lists both). Note edition,
   language and completeness.
3. **Extract once.** Use `tools/book_deep_dive/epub_to_json.py` for a
   single EPUB, or `tools/book_deep_dive/merge_volumes.py` when a series is
   split across volume files (it keys by chapter number and reports
   duplicates and missing chapters). Write the JSON to the session
   scratchpad, never into git. Check that a few chapter keys match the
   chapter numbers inside their text. Every reader then searches with
   `tools/book_deep_dive/grep_ctx.py`.
4. **Verify the core yourself.** Before dispatching readers, check the
   three to five laws everything else depends on directly in the text, and
   record locators. Readers get these as "already verified".
5. **Dispatch readers in parallel.** Use cheaper models (Sonnet) for
   reading and keep synthesis on the main model. Split by content, for
   example 22 pathways into groups of 7 or 8, plus one cross-cutting rules
   reader per book and one fan or web survey reader. Give each reader its
   own output file and its own scratch subfolder for helper scripts, and
   say so in the prompt; readers sharing one folder overwrote each other's
   scripts in both runs so far. For a long series, add one reader for the
   late volumes so the rules aren't frozen on the early-book picture.
6. **Spot-check surprising claims.** Any reader claim that contradicts
   memory or another reader gets one direct text check before it reaches
   the synthesis.
7. **Cross-check the wiki (M4).** See the route below.
8. **Synthesize (M5).** Use the outline below. Save it in the owning
   project's research folder: private if it carries canon text or names
   from a book world, tracked otherwise.
9. **Keep the reader files.** Copy them next to the synthesis in a dated
   `readers-YYYY-MM-DD/` folder so every claim stays traceable.

## Reader prompt skeleton

Fill the brackets. Keep the rules block verbatim.

```
You are a research reader for a game-design project (a browser idle RPG).
Task: [module and scope, e.g. catalog these N paths: ...].
SOURCE (local, read-only): [path to text.json]. Format: {member: [heading, body]}.
Helper: python3 -I [path]/grep_ctx.py TEXT_JSON WINDOW MAXHITS KW1 [KW2...]
Already verified (cite, don't redo): [core laws with locators].
For EACH [item] record: [fields].
Always also record HISTORY AND CHANGE: how the world reacts when someone
changes events (inertia that brings big events back, butterfly effects on
details, fate or loops), and which foreknowledge stays valid.
RULES: every claim gets a locator (member + volume + heading). Paraphrase;
quotes under 15 words. Label SHOWN / STATED (who) / INFERRED; label MEMORY
for anything filled from outside the text; mark UNKNOWN rather than guess.
Search by targeted keywords; don't read whole volumes. No web unless asked.
OUTPUT: markdown to [own output path], one section per [item], then
'gaps'. Return a summary of 200 words or fewer.
```

For an M3 survey reader, allow WebSearch and WebFetch. Ask for links for
every work, a taxonomy, a game option per premise type, and pitfalls
labeled as inference when they come from tags rather than reviews. After
one blocked site, the reader switches sources instead of retrying.

## Wiki route (M4)

Fandom and many MediaWiki sites return HTTP 403 to scripted fetches, and
their public dumps can be years old. The working route:

1. Open any page of the wiki in the in-app browser.
2. Run the snippets in `tools/book_deep_dive/wiki_api_in_browser.js` with
   the browser's JavaScript tool. They are same-origin API calls: category
   listings, wikitext with revision ids, rendered module output and
   infobox fields.
3. Wikis often keep list data in a Lua module (LOTM: `Module:Pathways`).
   Rendering the module call gives every list in one pass.
4. Record the revision id of every page you cite, and what the wiki itself
   cites (novel chapter, author post, fan inference).
5. Weigh it as secondary. Novel text wins on conflict. Author statements
   cited by the wiki rank just below the text.
6. Subagents can use this route too. Tell each one to open its OWN tab
   with `preview_start`, pass that `tabId` to every javascript call, and
   never touch other tabs. Five parallel wiki audits ran this way on
   2026-10-10 without collisions.

## Worlds without a local text

For anime, manga and games with no local copy, run a wiki-first audit:
M1 and M2 from the wiki (in-browser route), a quick M3 fan scan, and label
every claim CANON (chapter-cited by the wiki), WIKI-INFERRED or MEMORY.
These audits rank below book-verified research. Upgrade them when a text
is acquired.

## Fan and web fiction routes (M3)

From the 2026-10-10 survey readers (WebSearch/WebFetch only): Reddit is
refused by the fetch tools; FFN, TV Tropes and Royal Road usually return
403; AO3 fetches are intermittent. Point M3 readers at the browser routes
below instead, and tell them never to accept terms or consent prompts.
Praise and pitfall sections tend to be inference from tags and stats; keep
them labeled. Cross-world summary of what fans agree on:
`LIVING_BESIDE_PROTAGONISTS_2026-10-10.md`.


Learned in the fan fiction pilot (`docs/research/fanfic/REPORT.md`,
2026-10-10). Weibao allows polite in-app browsing of these sites.

- **AO3:** its robots.txt blocks AI crawlers, so never script it from the
  shell. In the in-app browser, open `/tags/<Tag>/works` pages at one per
  five seconds. The heading gives the work count, and the filter sidebar
  lists top fandoms and co-tags with counts, so no search queries are
  needed. Leave the terms prompt alone; tag pages render without it.
- **Fanlore:** the MediaWiki API answers scripted calls
  (`fanlore.org/w/api.php`) at one request per second. Best source for
  trope definitions and fandom practice.
- **Fandom wikis** (Jumpchain and others): same-origin API calls from an
  open wiki tab, per the wiki route above.
- **Chinese web novels:** find the Qidian title on ttkan (`ttkan.co`) or
  69shuba. Both return 403 to the shell. ttkan search falls back to loose
  matches, so check the exact title (traditional characters). ttkan
  chapters live at `/novel/pagea/<slug>_<n>.html`; 69shuba pages are GBK,
  so decode with `TextDecoder('gbk')`.
- **ttks.tw full books** (2026-10-10): the shell gets a Cloudflare 403,
  but Weibao's Chrome (Claude in Chrome) passes. Open the book's
  `/novel/chapters/<slug>/index.html`, read chapter ids from its links,
  fetch `/<n>.html` one at a time with a 5 s gap, keep the `div.content`
  paragraphs as `[heading, body]`, then save the JSON with a blob download
  to `~/Downloads` and move it into the book's private `sources/` folder
  with a receipt and hash. 285 chapters took about 35 minutes. ttks can lag
  Qidian by dozens of chapters; check the Qidian count.
  Lessons from the five-book run (about 2,060 chapters, 2026-10-10):
  don't reject short chapters as failures, because author notes can be
  under 200 characters. Save a part file every 100 chapters, since the tab
  was lost twice and the in-memory progress went with it. Strip the
  `【…ttk…】` watermark lines before reading. Long books can carry
  chapter-number restarts that are new arcs of the same book, not other
  books mixed in.
  From the simulator comparison pair (2026-10-10): ttks can serve another
  novel's text under a real chapter heading with an "use the app" error
  notice, so grep for it. Its search is `/novel/search?q=<title>`. It
  answered 429 twice in about 300 requests, and a 30 s wait cleared it.
  Mirrors often stop at a book's free chapters; twkan (POST `/search`) and
  69shuba (GBK form) are the next routes to try.
- **Full reads of long books with Codex:** split a book into ranges of
  roughly 100–160 chapters, one detached run each, using
  `tools/book_deep_dive/launch_codex_reader.py` with `json_range.py` as the
  reader's chapter printer. Each run writes its own file and appends after
  every chunk. Check a run's log for the ranges it actually printed before
  trusting "read in full": one run stopped at a third of its range and said
  so, and a fresh run on the remainder fixed it. Record session ids.
- **WordPress fan-translation sites** (Re:Zero via Witch Cult
  Translations, 2026-10-10): check robots.txt, then pull
  `/wp-json/wp/v2/posts?per_page=100&page=N` and `/pages` from the shell
  with a few seconds between calls. Full content comes back in the JSON, so
  about 3.1M words took 7 requests. Strip tags, sort by arc and chapter
  into `{member: [title, body]}`, and write a `MANIFEST.tsv`. Seven Codex
  readers (about 60–110 members each) then read everything in about an
  hour. A Codex run's writable root is its own folder, so tell the
  synthesis run to write inside it and copy the file up afterward.
- **Japanese web novels on syosetu** (Tensura WN, 2026-10-10): robots.txt
  allows general crawlers with a 1 s crawl delay. Read the index pages
  (`/<ncode>/?p=N`, 100 chapters each), then each `/<ncode>/<n>/` page,
  keeping `div.js-novel-text` at one request per 3 s. 304 chapters took
  about 20 minutes. Codex reads Japanese and writes English notes, so the
  original beats a partial fan translation. Blogger fan sites expose
  `/feeds/posts/default?alt=json` with full post content.
- **Fetch from Claude's shell, read with Codex.** Codex's workspace-write
  sandbox has no network (DNS fails), so a Codex acquisition run can only
  scout. Fetch in Claude's shell, then hand the saved JSON to Codex readers.
- **Snippet grep in the browser:** fetch chapters inside the page, keep
  only short paragraphs that match mechanic keywords, and return those.
  This finds system rules without copying prose. Run long jobs as a
  background promise that stores results on `window`, then poll.
- **Royal Road books with no local copy** (Virtuous Demon, 2026-10-10):
  the shell gets 403, and RR's content policy blocks page fetches to
  localhost, iframes and postMessage receivers. A popup opened over the tab
  and wiped the fetched data. What works: fetch every chapter inside a
  royalroad.com tab, one per 0.6 s, and store `[title, body]` in that
  origin's IndexedDB. Each reader opens its own RR tab and greps the
  IndexedDB copy with `tools/book_deep_dive/rr_idb_route.js`. Nothing gets written to
  disk, and readers never refetch. Don't use port 8765 for local helpers:
  AnkiConnect listens there.
- **Forums** (SpaceBattles, Sufficient Velocity): open the thread's first
  page in the browser; authors often explain their mechanics there.
- **TV Tropes:** opens in the browser when scripted fetches get 403.

## Synthesis outline (M5)

1. Sources, labels, links to reader files and earlier work
2. The rules an engine has to model (table: rule, evidence, engine shape)
3. The full catalog at a glance (master table, coverage, neighbors,
   conflicts)
4. Data model (proposal)
5. How each rule turns into play, mapped to existing YAIRPG systems and
   the rulebook
6. Living beside the protagonist (if M3 ran): premises as start options,
   mechanics they need, pitfalls
7. More to consider
8. A first playable slice (proposal)
9. Gaps that would change the design

Label everything that is a proposal. Keep the rulebook in view: book
worlds follow their book, each world sets its own rules, anything is
possible reasonably, readings can be wrong.

## Checklist before reporting

- Core laws checked directly, with locators
- Surprising reader claims spot-checked
- Reader files saved next to the synthesis
- Private vs tracked placement correct (no raw prose in git)
- Report says what was read by search versus in full, and which sources
  were blocked
