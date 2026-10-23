# What the manga text index can audit (pilots), 2026-10-23

Findings and proposals, not accepted decisions. All source text and panel clips stay in the git-ignored
`docs/research/manga-text/private/`; this file paraphrases and gives locators only (series, chapter, page or strip). The helper is
`scripts/manga_text/audit.py` (see its [README](../../../scripts/manga_text/README.md)); working outputs are in `private/audits/`.
The checker for every judgement below is a vision-capable model reading short OCR contexts, not a human.

**Coverage at the time of the pilots.** Index: 536 chapters in four series. JJK 277 chapters (1 to 271.5, main story plus the
bonus art chapter). Bleach 214 chapters (1 to 208, so up to the start of the Hueco Mundo arc, not the whole manga). Omniscient Reader
44 chapters (0 to 42). Naruto, Boruto, Hunter x Hunter, Fullmetal Alchemist, Lout of the Count's Family, Eternally Regressing Knight and
SSS-Class Suicide Hunter were not in the catalogue yet, so their ledgers cannot be audited.

## Pilot 1: claim auditing against the world ledgers

Method: I took 9 bounded claims from the JJK ledger's core-law table and 9 from the Bleach ledger's inspected-claims table, wrote the
literal terms each claim implies, ran them over the index with locators, and read two short contexts per term. Verdicts:
**supported** (the text states it), **partial**, **unresolved** (terms hit but the claim's specific point not seen in the contexts I read),
**term absent** (the literal term never appears, which is not evidence the idea is absent), **outside coverage** (the arc is not
downloaded yet).

| Claim (paraphrase) | Verdict | Locators and note |
|---|---|---|
| J1 Cursed energy comes from negative emotion; it leaks out | supported | JJK ch12 p17; ch200 p10 (stress leaks and builds into spirits); ch1 p27, ch7 p16 use "negative energy" |
| J2 Reverse technique turns the energy positive and heals | supported | ch12 p20 (the reversal explained as a sign flip), ch9 p3 (healing used) |
| J3 Domains are sure-hit unless countered; incomplete forms may lack it | partial | "guaranteed hit" ch109 p5; "victory almost guaranteed" ch30 p15; simple domain as a defence ch40 p4-5; "incomplete domain" appears once, ch171 p17; the claim that incomplete forms lack sure-hit was not seen |
| J4 Heavenly restriction: imposed at birth, trades body for energy | partial | ch77 p7-8 (rare, can cut energy to normal or to nothing), ch71 p15 (zero energy, pure physical strength); "at birth" and "exchange" not seen in what I read |
| J5 Binding vow: self-breach costs; no general penalty schedule | partial | ch11 p10-11 (mutual interest), ch79 p17-18 (breaking a vow with oneself, retribution unknown to the speaker), ch255 p16, ch267 p5 (vows on conditions and counts); consistent with the ledger leaving the schedule open |
| J6 Culling Game: rules can be added; killing the organiser alone does not end it | partial | ch143 p24 (written rules, a 100-point rule addition the game master must accept), later chapters repeat it; the organiser point was not seen in sampled hits |
| J7 Deadly Sentencing separates judge knowledge from the caster's | partial | ch164 p3-4 (the judge knows everything inside, the caster does not); "suspends violence" unresolved because "violence" hits are mostly the publisher's parental notice |
| J8 A finger bearer can form an incomplete domain without an innate technique | term absent | "finger bearer" has 0 hits; the term is a wiki label, not this translation's wording |
| J9 Barriers conceal, contain or deny entry | supported (concealing) | ch6 p5-6 (the curtain acts as a barrier hiding fights from outside); this translation calls them curtains |
| B1 Bankai follows Shikai | supported | Bleach ch120 p9 (two release stages, a captain must manage both), ch132 p16 (Bankai training) |
| B2 Rukia's power transfer to Ichigo during a Hollow attack | partial | ch1 p47 (she offers half her Soul Reaper power over his heart); the Hollow-attack setting was not checked |
| B3 Uryu's Quincy approach differs from purification | unresolved | Quincy first named ch26; "purif" has no hits, so wording differs; contexts not read far enough |
| B4 A destroyed Bankai normally does not return | outside coverage | no Bankai-destruction scene in chapters 1 to 208 found by the listed terms |
| B5 Nimaiya created Zanpakuto; Asauchi are blanks | partial | "Asauchi" once (ch110 p14, a blank sword); "Nimaiya" absent and outside coverage |
| B6 Urahara and Mayuri have supply and research roles; Nemu is artificial | partial | Urahara from ch8 p6; Mayuri and Nemu together ch93 p10; "research and development" teased ch9 p2; artificiality not seen |
| B7 Ginjo directs Fullbring training | outside coverage | "Fullbring" and "Ginjo" have 0 hits (arc after chapter 208) |
| B8 Las Noches and Ulquiorra's Resurreccion are a distinct release route | outside coverage | Hueco Mundo mentioned ch54 p14; Ulquiorra named ch188; Las Noches and Resurreccion absent |
| B9 Soul Reapers train sword, unarmed, movement and Kido | supported | ch175 p9 lists the four disciplines and says each needs a level of power; Kido ch1 p21; Shunpo ch117 p13 |

What the pilot shows: literal-term audits work well for "does the manga state this, and where". They are weak for negative claims and
for claims phrased in the wiki's vocabulary. The index must handle: (1) translation vocabulary versus wiki names ("curtain" for barrier,
"spiritual pressure" 77 hits against "reiatsu" 0, "guaranteed hit" for sure-hit); (2) words split by line-break hyphens ("zanpaku- to":
literal search found 0, loose search found 128, now the default for audits); (3) non-story pages that match terms (volume contents
pages, author commentary and quiz pages, the parental notice); (4) series coverage ranges, which a ledger row needs so an unreached arc
reads "outside coverage" instead of "never mentioned".

## Pilot 2: glossaries and first-appearance indexes

Loose term search gives first appearance, spread and hit counts in seconds. Examples (chapter, page): JJK domain expansion ch8 p19,
reverse cursed technique ch9 p3, binding vow ch11 p10, black flash ch44 p4, heavenly restriction ch77 p7, culling game first story use
ch143 p22 (its first hit is a contents page), deadly sentencing ch164 p2; Bleach zanpakuto ch1 p47, shikai and bankai ch120 p9, kido
ch1 p21, shunpo ch117 p13, Arrancar ch188 p5; ORV main scenario ch1 (a system notice at strip 77), coins ch2, constellation ch7,
dokkaebi ch15, stigma ch16, fourth wall ch11. Character introductions can be indexed from name captions: 113 caption-like JJK rows gave
46 distinct introduction captions (first: first-year student ch1 p26, principal ch3 p6, second-years ch10 p10, Kyoto students ch32 p13).
Limits: names inside captions carry OCR errors, spellings vary by line break and by translation ("Yoo Jong-hyuk" and "Yoo Joong-hyuk"),
and some first hits are title or contents pages. A page-type tag (story, contents, commentary, quiz, credits) would remove most false
first appearances. This is the cheapest, highest-value use.

## Pilot 3: status-window and rule-panel tables (ORV)

44 chapters yielded 801 panels (305 system windows, 252 hexagon messages, 106 captions, 89 scenario cards, 31 skill cards, 11 timers).
93 panels carry key-value rows with 154 distinct keys (103 and 165 at the 47-chapter refresh), in two families. **Scenario cards:** type or category, difficulty, time limit,
reward or compensation, penalty on failure, clear conditions (difficulty 20 cards, time limit 14, compensation 7; the first main card
repeats the same values at chapters 2, 3 and 4). **Character status sheets:** name, age, constellation sponsor, private attribute,
exclusive skills, stigma, overall stats as levels per stat, overall evaluation (6 sheets seen between chapters 16 and 19, with the
same fields each time). These two shapes are what a quest-card and a character-sheet UI idea would be built from; the layouts and
fields can be restated in original form without copying the art. Limits: key text is garbled in about a fifth of rows
(for example "Offficulty", "neward"), so the key set needs fuzzy grouping, and 148 of 801 regions carry the `oversized_region` flag
(blue-tinted art that may not be a window).

## Pilot 4: numeric consistency

Pattern search over the 47 ORV chapters indexed at the refresh (the other counts in this file are from the 44-chapter snapshot) found
130 coin mentions in 38 chapters (rewards of 100, 200, 300, 500, 1,000 and larger totals) and 186 level notations in 26 chapters. Repeated cards agree (the 300-coin reward appears with the same card at chapters 2 to 5). OCR also
produced impossible values (a level read as 121, a reward read as 5100 or 000), so cross-chapter arithmetic (coins earned minus spent,
level progressions) is unsafe on text alone. A usable version needs per-number confidence, the panel crop re-read by a vision model
for numbers that enter an audit, and a rule that discards values outside the plausible range.

## Pilot 5: ledger gaps

The JJK ledger's open question on binding-vow consent, mutual sanction and release: of 70 vow items, 7 mention breaking, penalty,
conditions or similar words (ch11, ch79, ch255, ch267, ch269). Chapter 79 p17-18 discusses breaking a vow with oneself and fear of unknown
retribution; chapter 255 and 267 show vows placed on activation conditions and counts. These are candidate additions to the ledger's
open row, not resolutions. This is the cheapest gap-finder: take each `U` or "open" row, build 3 to 5 terms, list the hits.

## Other uses I would try next (ranked by value over cost)

1. Page-type tagging (contents, commentary, quiz, credits, story) and a vocabulary alias table (translation versus wiki terms),
   since both fix most pilot errors. Cheap, deterministic.
2. A first-appearance index per ledger term with the ledger row id, regenerated when chapters arrive.
3. Coverage line on every ledger row ("downloaded to chapter N of M") so "outside coverage" is explicit.
4. Introduction-caption index for characters, with a spell-check pass.
5. Speaker attribution (stage 2) on chosen chapters, to answer who said a rule and what they believed (the ledger's speaker-slip risk).
6. Cross-chapter numeric tables for ORV with crop re-reads.

## Other image-only sources

The seven tabletop PDFs flagged as failed in the tabletop catalogue are not all image-only. PDFKit opens three of them and reads text
layers on nearly every page: Imperium Maledictum (368 pages), Soulbound (352) and Path of the Planebreaker (242), each with roughly 0.9
to 1.2 million characters; only 1 to 10 pages per book have under 40 characters. The earlier failure was in the previous extractor,
not the file. The other four (WFRP 4e core, 40K 9th edition core, Numenera Into the Outside, The Strange character options) are
truncated: broken cross-reference tables, a missing trailer, and neither PDFKit nor poppler can render a page. OCR cannot fix them; they
need a fresh download. Pilot on Soulbound: five pages with little text layer were rendered at 1.5x and read with Apple Vision in 0.04 to
0.19 s each; three returned text (82, 485 and 766 characters, a title, an index-like page and a sidebar page), two were blank art.
Recommendation: yes, point the same engine at image-only PDF pages (text layer first, render and read only pages under about 40
characters), at image-only EPUB pages and at fanbook scans, since the cost is tenths of a second per page. It is not built yet; a PDF
front end would be a small module reusing `common.ocr_images`.

## Gaps

Verdicts rest on two short contexts per term; none was a full read. The ledgers record wiki claims and the manga is another source,
so "supported" means the manga says the same thing, not that the wiki is right. Series outside the current index (Naruto, Hunter x
Hunter, Fullmetal Alchemist, Boruto, the newer manhwa) are unaudited. The pilots are proposals until Weibao picks which become
standing tools.

## More to consider (added 2026-10-23, with effort and a done check each)

| Item | What and why | Effort | Done check |
|---|---|---|---|
| M1 Backup of `private/` | Size now: about 430 MB (ORV panel clips 334 MB, JJK 24 MB, Bleach 26 MB, index 19 MB, caches a few MB and growing). Reproducible from the CBZs: everything under `<series>/`, the index, `CATALOG.json`, `INDEX.md` and the OCR cache (about 1 hour of niced compute for the current library). Not reproducible: `gold/` (hand transcriptions and orders, 36 KB), `audits/` (judgements, 124 KB), `cache/llm.sqlite` (costly local reads), run logs. A small backup of those four (under 5 MB) plus a weekly whole-folder copy covers it. | 1 hour: a `backup` subcommand that copies the non-reproducible set and checksums it | Restore into an empty temp folder, run `verify` and `reindex`, counts match `CATALOG.json` |
| M2 Reading front end | Komga (already running locally) shows pages but does not search the OCR text. A tiny read-only page on `127.0.0.1` that calls `summary`, `query` and `slice` would let Weibao search and jump to a locator without the terminal. No write endpoints, no page images. | half a day | `curl` from loopback returns hits; a request from another address is refused; no route changes any file |
| M3 Raw Japanese | Apple Vision supports `ja-JP` (vertical text only partly); manga-ocr on detector crops is the stronger route and was measured on English as useless, so it needs its own gold set. Needs a language field per series and a second tools block. | 1 day plus 10 hand-checked raw pages | Recall and precision on the 10 pages reported next to the English figures; watcher routes by series language |
| M4 Watcher across OS or tool changes | A macOS build change alone no longer invalidates chapters (done-check ignores the build number, unit-tested); the build is still recorded in each header. A new tool version, detector revision, helper source or profile hash does re-queue the affected chapters, and cached OCR keeps that cheap. Proposal: on a build change, OCR a fixed synthetic page set, compare to a stored result and log drift; re-run only if the text differs. | 2 hours | A simulated build change produces a drift log line and no re-run; a changed helper hash re-queues and finishes with no repeated OCR |
| M5 Reboot survival | A user LaunchAgent would restart the watcher at login and could run `watch` with the same flags. It is a persistent background service, so it is **not installed**; say yes if you want it (the plist is about 15 lines, reversible with `launchctl bootout`). | 20 minutes | After a reboot `watch_progress.json` shows a new PID with state idle |
| M6 Page-type tags | Contents, commentary, quiz, credits and parental-notice pages cause false first appearances and noise hits (found in the pilots). A rule tagger (page text patterns plus position) would remove them from audits. | 3 hours | Hand-checked on 40 pages: tag precision reported; the claim and glossary pilots re-run with the tags and the noise hits drop |
| M7 Vision pass for numbers | For ORV, re-read panel crops with the cached local reader only where a number enters an audit. | 2 hours plus local GPU time on selected panels | A cross-chapter coin ledger with every number verified on its crop |
