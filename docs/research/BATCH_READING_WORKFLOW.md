# Batch reading workflow (long term, 2026-10-28)

How YAIRPG reads whole books through the Anthropic Message Batches API: Haiku records an index of everything a book states or shows, and the implementer reads the cited source paragraphs and implements from the text ([accepted method](../gm/dispatch/batch-reading-2026-10-27/READINESS_AND_SCOPE.md#12-round-8-implementers-read-the-source-through-the-index-2026-10-28-accepted-by-weibao)). The campaign history and evidence stay in [NOV1_SCHEDULE](../gm/dispatch/batch-reading-2026-10-27/NOV1_SCHEDULE.md); this file is the repeatable procedure.

**Paid route.** Every live run needs Weibao's explicit go phrase for that run file, with its caps and ceiling (AU7, [tool registry](../TOOL_REGISTRY.md) `anthropic-batch`). Dry runs and every step before "go" cost nothing. The key comes only from the Keychain into the driver's environment; never print or commit it. Source text is sent to Anthropic; shards and outputs stay in gitignored private folders.

## Budget

The account gets **$100 of API credit per month** ([PLAN](../gm/dispatch/batch-reading-2026-10-27/PLAN.md)); unused credit lapses at month end, so a month's reading is sized to it. Batch requests cost half the standard price.

Measured per request (Haiku 5.5, batch, 2026-10-28; usage files under each book's private `batch/` folder):

| Pass | Effort | Typical output tokens | Measured $ per request |
| --- | --- | --- | --- |
| census (English, 1-2 chapters) | high | 25,000-28,000 | 0.0074-0.0082 |
| census (Chinese, 3 chapters) | medium | 20,000-32,000 | 0.007-0.010 |
| census (Chinese, 3 chapters) | high | 40,000-64,000 (truncates) | 0.011-0.017 |
| scenes | high | 28,000-38,000 | 0.008-0.010 |
| rules | high | 29,000-39,000 | 0.008-0.011 |
| people | high | 48,000-53,000 | 0.013-0.014 |
| texture | high | 40,000-43,000 | 0.011-0.012 |

Cost is mostly the reader's reasoning output, so it scales with **shards × passes**, not with how eventful a chapter is. Rules of thumb for all five passes: about **$5-6 per million English words** (8,000-word shards) and about **$7 per million Chinese characters** (2-chapter shards). The true bound used for caps is every request at 64,000 output tokens, about $0.0168 per request; measured spend has run at 50-60% of it.

Where each book is: [library index](LIBRARY_INDEX.md).

## Procedure

1. **Register the book** in [`plans/books.json`](../gm/dispatch/batch-reading-2026-10-27/plans/books.json): key, world, language, source type (`pdf`, `epub`, `ncx`, `html`, `json`, `zh-nav`; `convertFrom` converts a .mobi once with Calibre), source path, book or volume number, private dir and shard size (`group.target` words or characters, `group.max` chapters). A new world also needs a profile in `scripts/lead_run/world_profiles.mjs` and an appendix in `world_appendix/<world>.md` (units, kinds, calendar, lead, locator form).
2. **Prepare and plan** (free): `node scripts/lead_run/make_book_plans.mjs --prepare --keys <keys>` writes size-grouped shards and one plan per pass per book. Shards already read for a pass are skipped, so rerunning it after any run plans exactly what is left.
3. **Check the split** before any spend: chapter counts and order per book against the edition, no empty chapters, no request over the prompt-price tier (`overPromptCap` 0). PDF omnibus files and EPUB tables of contents each have quirks (see the heading forms in `prepare_shard_en.mjs`).
4. **Write run files** (free): `--run <date> --ceiling world=usd,...` writes `overnight_<date>-<world>.json`: a one-shard pilot (census and scenes) for each new book, then one step per pass across the world's books. Caps are true bounds; set each ceiling to about 0.65-0.75 of its cap total so a step is blocked before measured spend could pass the ceiling.
5. **Ask for the go.** Quote the run files, cap totals, ceilings and what each covers. Record his exact words in each run file's `approval`.
6. **Launch** each world's driver detached: `ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" nohup node scripts/lead_run/batch_overnight.mjs --run <run.json> > <scratch log> 2>&1 &` (no `setsid` on macOS). Drivers resume from receipts after a crash or a stop, so a fixed gate is resumed by relaunching the same file.
7. **Gates.** The driver collects, migrates, lints and grades each label, then stops the world when more than 20% of a label's shards fail or grade C, when name accuracy drops under 0.9, or when spend runs over twice the estimate. A C shard with exactly one lint row is repairable and does not count.
8. **Repair** (cents, its own go): each collect writes `<label>_repair_requests.jsonl` for its C shards; submit with `batch_submit.mjs --requests`. Truncated (`max_tokens`) shards are re-read smaller, never retried as they were.
9. **Merge and use**: `merge_shards.mjs <privateDir> --out <dir>` builds the registry, timeline, affordance matrix and proposed overlay; review the overlay before folding ids. Implementers then pull the source paragraphs behind any id or topic with `cite_paragraphs.mjs --id/--topic` and implement from the text. The implementation goal is [AD44](../RULES_INDEX.md): the protagonist's own playthrough from the book's opening is the main line, using the cast-lives pipeline ([card](../gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_CARD.md)).

Last safe submit before a credit lapse: noon on the last day of the month (batches can take hours, and a batch that outlives the credit may be billed).

## Locators

- Chinese volume 1: `zh 第N章 pM`; later volumes: `zh bV 第N章 pM` (LOTM numbers chapters per volume; shard headers carry `| book V`).
- English: `en bB cN pM`; one-numbering serials (Mother of Learning, Shadow Slave) are always book 1.

## Known gaps (2026-10-28)

Missing, unregistered or unverified sources are listed once, in the [library index](LIBRARY_INDEX.md#not-on-disk-or-unverified-the-one-pending-list); the 2026-10-28 gap closure is recorded in `READINESS_AND_SCOPE.md` round 9. Reader-side gaps:

- Census rows read before 2026-10-28 hold an evidence label in `label`; the merge treats that as no label and uses the id or printed name.
