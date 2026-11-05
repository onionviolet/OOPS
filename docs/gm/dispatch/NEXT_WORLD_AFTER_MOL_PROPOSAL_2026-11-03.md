# Which world after Mother of Learning (proposal, 2026-11-03)

**Proposal only.** Nothing here is accepted; only Weibao accepts an order (AD32, AD42). Read-only research: no src edits, no reader agents, no downloads. Counts are file or record counts, not verified coverage. Labels: **V** verified in this session from a file or command, **E** estimate, **I** inference.

## Recommendation

| Rank | World | One line |
|---|---|---|
| 1 | **Harry Potter** | Already the second depth world; all seven books held and census-read; school and trade slices built. Next work is deepening, not starting. |
| 2 | **Jujutsu Kaisen** (deviates from canon-first order) | Cheapest complete held text, seeds AB1-AB3, a sibling session is already closing its text gaps. |
| 3 | **Reincarnation Paradise** | In the canon-first book tier and already built (implemented-unverified); the text is the weak part. |
| 4 | Shadow Slave | Book world, 3,000 chapters held, little built; very long. |
| 5 | Bleach | Anime lead; 214 OCR chapters; reuses JJK seams. |
| 6 | Fate | Only the Zero novels and side works are held; core canon is not. |
| 7 | Reverend Insanity | Full text held, 405 shards (E); validates AB1 for cultivation but does not fit the order. |
| 8 | D&D | Rules source, not a narrative canon; use as a seam lane, not a reading world. |
| 9 | Fullmetal Alchemist | Wiki-based; held novels are side stories. |
| 10 | Hunter x Hunter | No held text. |
| 11 | Naruto | No held text. |

Sibling work stays untouched: mol-deepen owns MoL; jjk-gaps-rules owns the JJK gap register.

## Why Harry Potter is the top pick

- **Authority (V).** The canon-first order names Harry Potter first ([USER_VISION](../../USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13)). The 2026-10-26 book-worlds direction ([USER_VISION](../../USER_VISION.md#book-worlds-and-menus-first-frontier-and-mistglass-as-test-beds-2026-10-26)) and the master plan's LT2 limit depth to LOTM and HP.
- **Built (V).** The D7 checkpoint delivered four slices (school lessons, practice, assessment, adult trade) on a branch, with 1920x1080 and 1536x864 screenshots ([CHECKPOINT](hp-world-2026-10-25/CHECKPOINT.md)). `src` has 6 `hp_*` files plus 2 `book_world_hp*` files (brewing, preparation, substitution). The master plan's F4 says this is a base, not HP completion.
- **Read (V, files only).** `docs/research/novels/harry-potter/private/lead-run-2026-10-28` holds per-chapter census outputs for all seven books (hp1 18, hp2 34, hp3 38, hp4 64, hp5 76, hp6 60, hp7 68 files; some are `m` variants, so not chapter counts). A people-gate relaunch failed once (41 of 179 cut off, NOV1_SCHEDULE WR4); whether it was repaired is unchecked here.
- **Held (V).** One omnibus PDF of books 1-7, plus Cursed Child, A History of Magic (British Library, 392 parts) and Page to Screen. Rules text lives in the novels; no wiki is needed to start.
- **Stale doc (V).** `docs/worlds/harry-potter/WORLD_BRIEF.md` dates from 2026-10-03 and calls itself a "fan-continuity candidate"; it predates the slices. Treat the checkpoint, not the brief, as current.

**Before work starts:** no acquisition. Needs (1) a status check of the HP batch (which passes landed for which books, fixing the people gate), (2) a refreshed world brief that names built versus briefed, (3) a choice of the next HP horizon from the master plan (school pursuit with recurring people, or a second adult commission). **Seams reused:** school timetable and assessment, bonded companions (wand), org ranks (house and prefect), brewing. HP blood status is social, not a power source (AB1 note).

**Cost (E).** Roughly 1.08M words for seven books, about 90 shards at AU10 (12,000 words); the census pass already exists, so only scenes, people or rules passes for gaps are new.

**Risks.** Copyright: canon names stay in a private pack. Two worlds in depth at once is the stated LT2 limit, so HP deepening has to wait for or share the MoL slot. The prose-quality risk is a later local-AI job.

## Why Jujutsu Kaisen is the runner-up, and what decides it

**The deciding factor is AB10 seam leverage on complete, cheap text.** JJK is not in the canon-first book tier, so ranking it second is a deviation I am proposing with reasons, not the accepted order. The in-order runner-up is Reincarnation Paradise (below).

- **Held text (V).** 277 chapter records, chapters 1 to 271.5 (the brief's 279 is the older count), 5,479 pages. Dialogue, captions and detected sound effects only; no art, choreography or speakers. Two VIZ novels (Summer of Ashes, Autumn of Dust; Thorny Road at Dawn) are held.
- **Quality (V).** The gap register: 4,049 of 33,691 items low-confidence (12.0%); 351 of 5,479 pages have no read text (6.4%); 113 pages are probable real misses. No reader has read this layer; the world ledger rests on wiki snapshots.
- **Size (V, measured on OCR text).** About 178,000 words of non-sfx text, so about 15 shards (E from 12,000-word shards). Bleach is 214 chapters and about 140,000 words (about 12 shards).
- **Seams (V from ABILITY_RULES).** AB10 says JJK seeds AB1-AB3 (source and assignment, reserve and output, vows) and makes HxH, Naruto and Bleach cheaper. AB9 asks for a JJK paper test before any runtime slice.
- **Built (V).** No JJK `src` code. `docs/worlds/jujutsu` holds a brief, campaign, modules, an OCR gap register and 27,975 words of docs, all proposals.
- **Interactions (I).** JJK has no cheat-like reset loop; it gives cursed-technique, vow and domain mechanics that Fate, Bleach, Naruto and Fanren-style cultivation can borrow, and gives MoL and LOTM nothing directly.

**Needs before work starts:** jjk-gaps-rules finishes its register and the long-term gap rules (WA61-WA68, proposal); one reader pass over the OCR layer; the AB9 paper test. **Risks:** the sibling is mid-write on this world, so a second writer must wait for its register; OCR gaps mean a reader records "unread" rather than guessing; the order deviation needs Weibao's yes.

## The rest, in rank order

| World | Held source (V unless E) | Built vs briefed | Shards (E) | Seams and what it adds | Needs / risks |
|---|---|---|---|---|---|
| Reincarnation Paradise | One Gemini machine-translated EPUB, 4,143 chapters (not 4,657 parts), first gaps at chapters 1396, 1698, 2191 and more. | Built: 15 `book_world_paradise_*` files, "implemented-unverified" (see the paradise-hub brief); 45,666 words of paradise-hub docs. | About 300-400 (E; no word count taken) | Hub life, derived worlds and missions, cross-world benefits. Strongest for "interactions with other worlds". | Needs a verification pass of the built branch and a text-quality check (MT, gaps) before reading. |
| Shadow Slave | Chapters 1-3000 across Calibre 16, 35-37; 3001+ not on disk. | `ascension_paths_ss.js` only (a `book_world_shadow_company_domain.js` exists; whether it is Shadow Slave is unchecked); docs briefed. Partial reading outputs (ss 566, ss10 132, ss9 and ss11 2 files each). | About 330 (E) | Aspect, rank and tier ladders: reuses AB1 and org ranks. | Very long; volume 11 has a gap at 2888-2889. |
| Bleach | 214 chapters OCR (about 140k words), 3 "Can't Fear Your Own World" novels. | Docs only (23,418 words). | About 12 | Reiatsu, zanpakuto (bonded companion), ranks. Cheaper after JJK. | OCR quality like JJK (36,180 items; 5,151 low-confidence). Wait for the JJK seam. |
| Fate | FateZero volumes 2-4 (two editions), Apocrypha 1, Strange Fake 4-5, two Fate/Grand Order material PDFs. The "Fate" search also returned unrelated books (Chrysalis, Eclipse Phase). | Docs only (13,287 words). | About 60-100 (E) | Servant class and contract: the strongest test of AB1 provenance. | Core Fate/stay night text is not held; Zero is one war; wiki-based otherwise. |
| Reverend Insanity | 2,334 chapters, about 4.86M words (LIBRARY_INDEX). | Briefed; `ri` batch plans exist ($88 ceiling). | About 405 | Aperture grade, Gu: a second AB1 case. | Does not fit canon-first; huge. |
| D&D | SRD 5.2.1 and three official PDFs (rules only). | First slice designed (Phandalin), SRD521_START qualified; no code. | Not a reading job | Race, class, level: AB1 and proficiency. | No narrative canon; it feeds seams, not a reading queue. |
| Fullmetal Alchemist | Five Inoue side-story novels (no manga). | Docs only (11,243 words), wiki-sourced. | About 25 (E, for the novels) | Equivalent-exchange craft. | Held text is not the main story. |
| Hunter x Hunter | None (V: 0 records). | Docs plus a readers directory. | Unknown | Nen; AB10 calls it the best second validator of AB1. | Needs acquisition. |
| Naruto | None (V: 0 records). | Docs only (16,643 words). | Unknown | Clans, natures, chakra. | Needs acquisition and Weibao's yes with filename, source and size; I have asked for nothing. |

## Open decisions for Weibao

- **D1.** Accept Harry Potter as the next depth world after MoL, or name another.
- **D2.** Accept JJK ahead of the canon-first book worlds Reincarnation Paradise and Shadow Slave because it seeds the shared seams, or keep the canon-first order and make Reincarnation Paradise the runner-up.
- **D3.** Naruto and Hunter x Hunter need source text; I did not ask, and nothing was fetched. A yes would name the file, source and size.
- **D4.** D&D: treat it as a rules and seam lane running beside any reading world, since it has no narrative canon to read.

## Evidence and gaps

Commands run: `library_coverage.py --series` for ten names; `manga_text.py summary`; a `chapter.jsonl` word count for Jujutsu_Kaisen (277 chapters, 178,137 words) and Bleach (214, 139,609); directory listings of `src`, `docs/worlds` and the HP/SS/MoL batch folders. Not done: no word count of HP, Shadow Slave or Reincarnation Paradise (their shards are estimates), no check that HP batch outputs are complete, and no `npm test`. Shard figures divide estimated words by 12,000.


## Current-use reconciliation B103, 2026-11-04

The ranking is a historical proposal, not a priority change. Current PROJECT already directs LOTM mechanisms leading Klein’s full journey while HP has actual W1–W4 consumers, so the old wait-for-MoL-slot/choose-HP question is not current scheduling authority. Preserve canon-first/AB seam rationale as optional research reasoning. File counts, OCR text, estimated shards and held chapters are not semantic source coverage or complete action/choreography/speaker access; “cheapest complete text” cannot erase JJK’s explicitly unread/low-confidence/missing pages. D&D’s old no-code shorthand is superseded by later qualified local slice receipts, not a current absence finding. Library holdings, edition/cutoff/gaps and sibling worker state need current owners before any acquisition or dispatch; nothing is fetched or reprioritized here.
