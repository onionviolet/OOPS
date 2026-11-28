# Batch reading workflow (long term, 2026-10-28)

YAIRPG uses Anthropic Message Batches and OpenAI Batch to build source indexes over declared book ranges. The implementer reads the cited paragraphs before building from them ([accepted method](../gm/dispatch/batch-reading-2026-10-27/READINESS_AND_SCOPE.md#12-round-8-implementers-read-the-source-through-the-index-2026-10-28-accepted-by-weibao)). [Reading status](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md#reader-reconciliation-2026-11-09) owns current coverage, qualification and recorded campaign usage. [NOV1_SCHEDULE](../gm/dispatch/batch-reading-2026-10-27/NOV1_SCHEDULE.md) is campaign history.

**Paid route.** Each live run needs Weibao's spending authorization and a recorded cap (AU7, [tool registry](../TOOL_REGISTRY.md)). Dry runs cost nothing. The key comes from Keychain into the driver's environment. Source text goes to the provider named in the run. Local shards and outputs stay in gitignored private folders.

## Hand a reading to a gameplay implementer

Start the local Atlas with `node prototypes/world-atlas/serve.mjs`. In Library → Reading outputs, choose the book, output and matched public record. Open the original paragraphs to verify the edition, chapter and mechanism. Keep private prose in the reading workspace. Record any edition or paragraph correction with the proposal so the implementer can recover the same passage.

Save the proposed change and its playable check from the record, or submit several selected records from a local JSON file:

```sh
node scripts/atlas/submit_reading_handoffs.mjs --batch proposals.json
```

Each array entry names `book`, `prefix`, `pass`, `kind`, and either the record `key` or its `route` and `fileLines`. Include `contentHash` from the exported reference page to pin the reviewed file, then supply `change` and `check`. The command returns a Workbench link or an error for each entry. Successful entries keep their IDs on retry.

For a local manual reading, save a receipt beside its outputs as `<prefix>_READING_RECEIPT.json`. This keeps books with the same chapter number distinct when they share a directory. Existing chapter and local receipt names remain readable. For a multi-chapter slice, record the paragraph count of each chapter in order. The Atlas checks the first and last locators, each intervening chapter's bounds and the output bytes. An examined empty output can carry the same source range.

When one existing world's reading outputs change, run `node prototypes/world-atlas/refresh-reading-world.mjs <world>` against the registered inputs. It prints a standalone candidate directory and the baseline and candidate hashes. Set `ATLAS_SNAPSHOT` to the candidate's `snapshot.json` to preview it in the normal Atlas. The candidate reuses the other worlds' digests and the existing native projections. Use the full Atlas build when changing those projections or the findings columns. Readiness reports bind to the entire snapshot hash, so after adoption rerun the offline readiness measurements for the worlds whose freshness you intend to claim.

In Workbench → Implementation handoffs, the implementer can attach the native consumer and implementation report, followed by a playtest receipt for the game build they exercised. **Compare playtests with this build** shows which receipts match the local bundle. Backlog ideas can enter the same queue through their exact owner entry. [Field coverage and worked examples](ATLAS_BATCH_FIELD_COVERAGE_2026-11-25.md)

## Budget

AU16 (2026-11-16): label and check passes outside the book reader use `scripts/label_runner.mjs`, which shares the OpenAI batch client below, sends by batch by default and puts the most shared text first.


The original Anthropic schedule used a $100 credit assumption ([PLAN](../gm/dispatch/batch-reading-2026-10-27/PLAN.md)). For a current run, distinguish provider balance and expiry from the campaign ceiling, recorded receipt usage and uncollected reservations. The pricing observations below are dated.

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
2. **Prepare and plan** (free, new plans default to schema 1.5): `node scripts/lead_run/make_book_plans.mjs --prepare --keys <keys>` writes size-grouped shards and one plan per pass per book. Shards already read for a pass are skipped, so rerunning it after any run plans exactly what is left.
3. **Check the split** before any spend: chapter counts and order per book against the edition, no empty chapters, no request over the prompt-price tier (`overPromptCap` 0). PDF omnibus files and EPUB tables of contents each have quirks (see the heading forms in `prepare_shard_en.mjs`).
4. **Write run files** (free): `--run <date> --ceiling world=usd,...` writes `overnight_<date>-<world>.json`: a one-shard pilot (census and scenes) for each new book, then one step per pass across the world's books. Caps are true bounds; set each ceiling to about 0.65-0.75 of its cap total so a step is blocked before measured spend could pass the ceiling.
5. **Ask for the go.** Quote the run files, cap totals, ceilings and what each covers. Record his exact words in each run file's `approval`.
6. **Launch** each world's driver detached: `ANTHROPIC_API_KEY="$(security find-generic-password -a "$USER" -s anthropic-api-yairpg -w)" nohup node scripts/lead_run/batch_overnight.mjs --run <run.json> > <scratch log> 2>&1 &` (no `setsid` on macOS). Drivers resume from receipts after a crash or a stop, so a fixed gate is resumed by relaunching the same file.
7. **Gates.** The driver collects, migrates, lints and grades each label, then stops the world when more than 20% of a label's shards fail or grade C, when name accuracy drops under 0.9, or when spend runs over twice the estimate. A C shard with exactly one lint row is repairable and does not count.
8. **Repair** (cents, its own go): each collect writes `<label>_repair_requests.jsonl` for its C shards; submit with `batch_submit.mjs --requests`. Truncated (`max_tokens`) shards are re-read smaller, never retried as they were.
9. **Merge and use**: `merge_shards.mjs <privateDir> --out <dir>` builds the registry, timeline, affordance matrix and proposed overlay; review the overlay before folding ids. Implementers then pull the source paragraphs behind any id or topic with `cite_paragraphs.mjs --id/--topic` and implement from the text. The implementation goal is [AD44](../RULES_INDEX.md): the protagonist's own playthrough from the book's opening is the main line, using the cast-lives pipeline ([card](../gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_CARD.md)).

Last safe submit before a credit lapse: noon on the last day of the month (batches can take hours, and a batch that outlives the credit may be billed).

## OpenAI backend (2026-11-08)

Weibao asked how to put his OpenAI API credits toward the unread books; this is the route. Implemented, unit-tested and in live use. Current bounded dispatch and qualification evidence: [reading-level review](READING_LEVEL_REVIEW_2026-11-08.md). Dated planning snapshots below are not current account or completion state.

- **What it is.** `scripts/lead_run/openai_batch.mjs` turns each reader request into a `/v1/responses` Batch line (same instructions, schema, effort and output cap) and gives submit and collect a client with the same batch surface, so the gates, repair files, usage ledger and overnight driver are unchanged. A plan picks it by `model` (any `gpt-*`).
- **What OpenAI keeps.** Responses are sent with `store: false`. The uploaded request file (full shard text) and the output file stay in the project's Files storage until collect, or the overnight driver, deletes them after the summary is written (`batch_collect.mjs --keep-files` keeps them). A plan shard that gets no result line counts as `missing` for the gates, whether or not the input file can be read back.
- **Strict schemas.** OpenAI requests send every pass's schema as a strict `json_schema` (all properties required, optional ones nullable, nulls dropped on return). The first CoI census used a non-strict schema and Luna left out required fields on most rows; the strict form was checked live for every pass and schema version on 2026-11-08.
- **Model and price.** Default `gpt-6-luna`: Batch $0.05 in, $0.005 cached, $0.25 out per 1M tokens, 128K max output, efforts `none` to `max` (OpenAI pricing and model pages, read 2026-11-08). That equals Haiku 5.5's batch rate in the table above, so the per-book estimates there carry over until a pilot measures it. Other priced models are in `OPENAI_PRICES`; an unpriced OpenAI model is refused. The model page lists cache writes at 1.25x input; batch usage reports only cached reads, so check the pilot's usage object and set `cacheWriteFactor` if writes appear.
- **Plans.** `node scripts/lead_run/make_book_plans.mjs --keys <keys> --model gpt-6-luna --tag oa --run <name>` writes `*_oa.json` plans and one run file per world. One provider per run file (the driver refuses a mix), and one provider per book at a time: the `_oa` plans share the Haiku plans' `privateDir`, so launching both for one book would pay twice and overwrite rows. Neither `coi` nor `ttks1` had a Haiku receipt on 2026-11-08.
- **Key.** `OPENAI_API_KEY="$(security find-generic-password -a "$USER" -s openai-api-yairpg -w)"` goes in the driver's environment rather than a file or log, where it would leak. Weibao added the Keychain entry on 2026-11-08 and it authenticates. Save a key with `security add-generic-password -U -a "$USER" -s openai-api-yairpg -w "$(pbpaste)"`: the interactive `-w` prompt cuts input at 128 characters, shorter than an OpenAI project key. A spend limit on the OpenAI project is his to set.
- **Quality check first.** The fresh-book pilot (census and scenes, one shard) gates the rest as with Haiku. Existing live Luna outputs retain their lint and source-review qualifications; API success alone is not semantic acceptance. For a side-by-side with Haiku on a book Haiku already read, copy a Haiku plan, set `model`, a new `label` and a **separate `privateDir`**: collect writes shard files by prefix, so a shared folder would overwrite Haiku's rows. Then compare with `batch_compare.mjs`.
- **No rereads.** Whether a shard's pass is read is decided from the private folder's files: batch reads (either provider) write `<prefix>m_*` and `<prefix>_<pass>` files, Codex Luna lanes write the same under `<prefix>L`, and any of them counts as read. (Before 2026-11-08 the planner missed the `L` files, so the first OpenAI CoI plan would have reread 279 Luna-read shards; it was regenerated: cap $48.76 to $3.96.) `make_book_plans.mjs` plans the unread shards and skips the rest, and `batch_submit.mjs` (so also the overnight driver) refuses a live submit when any plan shard is already read, or is in flight under another label in the same `batch/` folder (a receipt with no summary). A stale plan therefore stops instead of paying twice; regenerate it.
- **Rereads to fix are allowed.** Weibao, 2026-11-08: "reread allowed for goal of fixing?" Yes, by these routes: a cut-off (`.partial`) shard counts as unread, so the planner and `make_split_retry.mjs` plan it again; repair batches resend failing rows; and any other fix (a grade-C shard, a bad split, a reader change) sets `reread: "<what it fixes>"` in its plan, which the overnight driver carries and the receipt records with the shard count. `--reread` does the same from the command line. A shard in flight under another label stops the submit, fix or not, because two live batches would race to write its files. A comparison read uses its own `privateDir` instead.
- **Pending Haiku run files for the same books.** `overnight_2026-11-01-coi.json`, `-ttks1` to `-ttks5`, `-worm`, `-sup`, `-ri`, `-rtoc`, `-wus` and `-yas` are still `PENDING` and cover the same unread shards as any `_oa` plan for those books. Launch one provider per book; the guard stops the second if both are launched.
- **What is left (2026-11-08, from the private folders, Luna lane reads included).** Of 152 registered books, 21 are fully read. 21 have every pass but scenes from the Codex Luna queue (`luna_queue.mjs`, stopped 2026-11-04 at wus6; [reading status](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md)): Circle of Inevitability (100 scenes shards and 16 census left), TTKS books 1-4, Worm, Super Supportive, A Regressor's Tale of Cultivation, You Are Summoned 1-5 and Wish Upon the Stars 1-8, 2,149 scenes shard-passes in all. 14 are partly read (3,347 shard-passes; most are the rest of TTKS book 5 and Shadow Slave volumes 9 and 11). 96 are unread (21,394 shard-passes, from Reverend Insanity 5-24 through the wave 2 list). At the cap rate of about $0.033 per shard-pass, that is about $71, $110 and $706 at cap; measured Haiku spend ran near 55% of cap. Books that already have a deep-dive card were read by agents for that card; the batch index is a different product, so it reads them again by default.
- **dsh.** Weibao asked to embed the batch idea in DeepSeek Harness. It is a proposed Agent Note there, not built: `~/Documents/Dev/deepseek-harness/.agents/notes/proposed/feature/2026-11-08-provider-batch-jobs.md` (batch adapters per provider plus estimate, submit, status, collect and cleanup tools, with durable receipts and per-submit approval). Until it ships, this repo's scripts stay the route.
- **Dry run 2026-11-08** (nothing sent, regenerated after the Luna fix): Circle of Inevitability, 16 census and 100 scenes shards plus 1 shard each of rules, people and texture, cap total $3.96 (`overnight_oa-2026-11-08-coi.json`); *巫师你好，我是伪人* (Wizard, Hello, I'm an Imposter, key `ttks1`), 60 scenes shards plus 1 shard per other pass, cap total $2.11 (`overnight_oa-2026-11-08-ttks1.json`). Caps assume every request uses all 128K output tokens; measured Haiku spend ran at 50-60% of that bound. Both run files say `PENDING` until Weibao's go.

## Reading levels and system relevance, 2026-11-08

Weibao authorized building these levels into the workflow, checking existing readings, fixing unsent schemas and keeping additional reading within a combined $33 budget, including procedural systems and more. [Direction](../USER_VISION.md#reading-levels-and-procedural-system-coverage-2026-11-08). This replaces the earlier proposal section; its findings and execution are retained in the [review receipt](READING_LEVEL_REVIEW_2026-11-08.md). Existing full-trajectory, source and sealed-information rules still apply.

### Depth and relevance are separate

| Level | Product | Evidence required for that claim |
| --- | --- | --- |
| L1: broad reference index | The five existing passes over a declared edition/range, including unexpected details | Source identity, prepared-shard manifest, exact pass coverage and explicit gaps. File presence means extraction present; semantic sample results are recorded separately. |
| L2: system synthesis | How a named system works across its known early/later trajectory | Contextual evidence for acquisition, operation, resources, failure, recovery, development, exceptions and interactions; contradictions and unknowns; actual demands on shared/local engine contracts. Reuse extraction before targeted primary retrieval. |
| L3: build qualification | A source-grounded packet for a particular playable slice | Exact actors, means, quantities, timing, knowledge and consequences; supplier/state owner/consumer mapping, source facts versus proposed dials, success and failure scenarios. Runtime/UI/persistence proof remains a separate implementation state. |
| L4: expanded life and alternatives | Selected depth on other lives, institutions, regions, voice, long pursuits or unusual uses | A named question, source range and reusable source-backed result. This depth becomes necessary when the chosen life depends on it; it is not automatically another full-book read. |

Each topic independently takes one or more relevance tags: `lead-trajectory`, `next-slice`, `other-life`, `reference`. A later ability can inform an early engine contract; a meal, law or relationship can be essential now. Do not filter the source through only today's implemented systems. These levels describe products rather than four obligatory paid rereads or a global gate before story windows.

### System lenses

| Aspect | Source questions, where applicable |
| --- | --- |
| Procedures and repeated activity | Order, branches, prerequisites, actor/tool/material bindings, duration, recurring work, interruption, partial settlement, cancellation, recovery and delegation. |
| Generation, simulation and causal commitment | What varies versus stays fixed; identity, dependencies, observed distributions and bounds; when an outcome becomes fixed; reset/retention and who remembers. A fixed story event is not evidence of random generation. Seed/key design and performance budgets are implementation proposals unless the source states them. |
| Progression and powers | Acquisition, teaching, practice, development signs, costs, failure, ceilings, exceptions and interactions. |
| Institutions and social life | Actual authority, law, detection, enforcement, reputation audiences, obligations, relationships and alternative seats. |
| Economy, custody and making | Supplies, ownership, contracts, prices and units, production chains, outputs and downstream uses. |
| Body, conflict and hazards | Injury, health, healing, contested actions, environmental effects and consequences. |
| Knowledge and discovery | Truth versus belief; witnesses, perception, concealment, deception; occurrence versus revelation; later knowledge does not become earlier knowledge. |
| Places, ecology and long play | Access, travel, routines, seasons, households, living environments, long pursuits and meaningful compression. |

Lenses guide source discovery without inventing missing mechanisms. Preserve source facts that fit no current taxonomy in `other`; source labels and exact locators remain attached. L2 dossiers connect those facts rather than treating generic rows as ready-to-use engine contracts.

### Operational route

1. **Inventory first, free.** `node scripts/lead_run/reading_review.mjs --keys coi,ttks1 --out <private-dir>` writes `inventory.json`: per-shard pass presence, malformed JSON, field counts and candidate source pointers. Omit `--keys` for all registered books. It emits no raw source. Field absence and keyword candidates nominate review, not source omissions or semantic failures.
2. **Open a bounded dossier.** Add `--topic procedures --level L2` to create a non-overwriting `dossier-<world>.json` template. Record edition/hash, topic, relevance, exact spans, mechanism, procedural questions, contradictions, unknowns, proposals, consumers and review results. L3 adds the actual slice mapping. Existing independent dossiers need evidence links; this inventory cannot declare them absent.
3. **Check contextual source.** Sample or retrieve relevant paragraphs and later corrections under a finite source budget. Record supported/partial/wrong/missed findings and the sample limits. Source labels, locator validity, row counts and lint scores are different evidence. A sample is not a completeness/recall audit.
4. **Enrich diagnosed gaps.** New planner output defaults to schema 1.5 (including 1.4 extras); legacy readers without a version retain 1.3 semantics. `upgradeUnsubmitted` in `reading_plan_maintenance.mjs` preflights caps and refuses to alter sent/collected plans or ambiguous request files. Stop/reload local drivers around migration; keep remote batches and submitted request/plan identity intact. Targeted enrichment uses a separate private output folder, a `reread` reason and `reading` metadata with coverage/focus. Original artifacts remain available; supplements do not silently replace all earlier coverage.
5. **Budget the campaign.** Reserve pending runs at their full approved caps, include known earlier failures, and assign each additional run a finite reservation. `checkReadingBudget` rounds reservations upward to cents. An overnight run with `budgetFile` and `budgetReservation` checks the campaign and its own allocation before submission. Never reuse a reservation for another concurrent run. Use the [receipt-based reconciliation](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md#reader-reconciliation-2026-11-09) for the $33 campaign. The plan manifests record exposure at dispatch. Paid repairs and stronger-model fallback require their own authorization.

The inventory and dossier helpers implement status separation; they do not automatically synthesize a whole book or verify runtime. The 2026-11-08 source sample and supplement cover selected areas only. Later build packets still read their cited source with context.

## Locators

- Chinese volume 1: `zh 第N章 pM`; later volumes: `zh bV 第N章 pM` (LOTM numbers chapters per volume; shard headers carry `| book V`).
- English: `en bB cN pM`; one-numbering serials (Mother of Learning, Shadow Slave) are always book 1.

## Known gaps (2026-10-28)

Missing, unregistered or unverified sources are listed once, in the [library index](LIBRARY_INDEX.md#not-on-disk-or-unverified-the-one-pending-list); the 2026-10-28 gap closure is recorded in `READINESS_AND_SCOPE.md` round 9. Reader-side gaps:

- Census rows read before 2026-10-28 hold an evidence label in `label`; the merge treats that as no label and uses the id or printed name.


## Content reconciliation B318: actual records and scoped follow-through

The budget table, all nine procedure steps, locators and known-gap note were fully content-reviewed. This is an operational procedure with sensitive/paid commands in its examples, not authority to execute them during reconciliation. A prior campaign's approval does not authorize a different run, expanded source scope, higher ceiling or repair submission. Current explicit run authorization, caps and actual terminal/live process evidence govern a real launch or resume; a receipt/run file alone is not proof a driver is running or stopped. Do not restart on an observation timeout.

The stated monthly credit, expiry, model/pricing, measured request costs, output limits,50–60% ratio and last-day noon suggestion are dated planning assumptions, not verified account or service state. This review checks no balance, price, billing policy or batch SLA. Free preparation means the described local planning path, not a blanket promise about every command's effects. A later authorized launch must use its actual current registry/driver and secret-handling route without exposing a key; no command here was executed.

Shard counts, lint grades, name accuracy and spend checks do not establish semantic source completeness. Actual edition order, omissions, duplicated material, malformed headings and truncated context still need the selected source checks. Searching an index is navigation: an implementer must read the cited source with enough context and the relevant later correction, distinguish occurrence from reveal and witness from belief, then implement the selected actual mechanism. Merged registry, overlay or extracted count is not accepted canon or completed gameplay. Current AD44/AD51 preserve selected protagonist direction and first useful shared consumers without turning every pass into a new prerequisite. No book/PDF conversion, source transmission, paid request, approval request, driver launch or repair was performed by this document review.

### Round 4 tabletop rules

From the repo root after round 3, prepare the private inputs with the following command.
It writes rules plans and one pilot per book. The two world runs start with pending approval.

~~~sh
READING_PYTHON="$HOME/.local/share/pdf2md/.venv/bin/python" node scripts/lead_run/make_book_plans.mjs --keys cpred,cp2020,cpnight,cpchrome,cpv3,cpgen,cpview,cpfriday,cpwelcome,cpkit,sr5,srfaster,sr6,srwyrd,srfiring,srbody,srclutch --prepare --passes rules --pilot rules --tag r4 --run r4
~~~

The registry pins one SHA-256 per edition. RED uses the screened, repaired CR3001 PDF.
Chromebook 1 occupies physical pages 1 through 97 of its combined edition. The Mission Kit
Rule Book occupies pages 1 through 42. Each other entry spans its whole PDF. A locator such
as `en b3 pdf18 p2` identifies a paragraph on physical page 18 of book 3 in that world. Registry entries may set `pagesPerShard` (default four) and explicit
`sections` with inclusive `from` and `to` PDF pages from an outline. Pages between sections stay in the read.

Preparation reuses matching pdf-screen reports. The three 2013 booklets were first screened
for this round. On a machine missing a report, the preparer invokes the installed pdf-screen
script with the selected PyMuPDF interpreter. It uses readable text and attaches the original
page as an image when text is sparse, the page needs OCR or the screen raises findings.
The rendered-page paragraph provides a locator for visual evidence. All private inputs stay
beside the shards. On a second machine, `OOPS_READING_SOURCE_DIR` can point to a private folder
containing `<key>.pdf` and the matching `<key>.json` screen report. The planner checks the PDF
against its registered SHA-256 and matches that digest to the screen report.

### Character descriptions

Census indexes named people, including a person mentioned once. For private character notes, select
`--passes people --pilot people --schema 1.6`. A person row records appearance, dress, bearing or
voice in `looks`, a one-line `role` when supported, demonstrated `traits`, and `prominence` within
the shard (lead, recurring, minor or mention). Each observation carries its own paragraph and S
(stated or directly shown) or I (inferred). A name alone can have empty observations. Each new
descriptive field has a 25-word budget. Use paraphrases and the existing stricter English quote guard.

Version 1.6 people output uses a separate `v16` shard prefix so an older people read cannot suppress
the description pass or be overwritten by it. Existing 1.3 through 1.5 plans retain their schemas.
The [round 4 estimate](R4_PEOPLE_COSTS_2026-11-28.md) prices the full pass across the available books.
