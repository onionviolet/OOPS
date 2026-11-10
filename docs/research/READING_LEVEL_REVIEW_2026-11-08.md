# Reading levels, existing evidence and schema repair

Status: original runs and source audit collected. The reviewed overlay and unresolved queue are saved. Direction: [reading levels and procedural system coverage](../USER_VISION.md#reading-levels-and-procedural-system-coverage-2026-11-08). Operational owner: [batch workflow](BATCH_READING_WORKFLOW.md#reading-levels-and-system-relevance-2026-11-08). AU2/AU7/AU11, AD32/AD36/AD44/AD51 apply.

## What was wrong

| Code | Finding | Consequence and disposition |
| --- | --- | --- |
| RF1 | The duplicate-spend guard knows whether output files exist, not whether a system has been synthesized or verified. | Keep that guard; add explicit L1 extraction, L2 system synthesis, L3 build qualification and L4 expanded-life products. Relevance is separate from depth. |
| RF2 | New plans silently inherited schema 1.3 despite existing 1.4/1.5 support. | Default new plans to 1.5; retain explicit legacy/unversioned semantics for old artifacts. Upgrade unsent active plans without rewriting submitted requests or changing their caps. |
| RF3 | Many existing Luna non-scene rows already contain acquisition, resets, enforcement and typed price information. | Reuse them. Missing optional fields alone do not prove the source had omitted facts or justify a whole-book reread. |
| RF4 | A seven-row contextual sample found three supported, three partial and one wrong extraction. | Private findings retain exact source locators. Problems include identity/rank conflation, generalizing a personal example, and confusing an actor's explanation with an observed operation. Target these areas rather than equating valid JSON with truth. |
| RF5 | Old Harry book 1 and LOTM volume 2 samples lack the richer structured fields; procedural details also live in generic rows. | Add selected isolated enrichment and system dossiers. L2 must join evidence across the known trajectory and name contradictions/unknowns; generic rows remain reusable reference evidence. |
| RF6 | Six LOTM census shard-passes are missing according to current partial/output markers. | Submit those exact missing passes through the existing guard and collector. This is a file-coverage finding, not a claim of six missing source chapters. |

## Inventory and source sample

The free local inventory covered all **152 registered books**, with prepared shards for each. At its snapshot, **22** had all five extraction passes present. It parsed **zero malformed JSON lines** in the selected canonical output files. Missing shard-passes: census 4,968; scenes 7,006; rules 4,933; people 4,966; texture 4,934. Some are in the already approved batches. Counts are a moving extraction snapshot, not a semantic completeness grade or another acquisition queue.

Shape inspection covered all registered outputs; semantic review was deliberately smaller: **seven candidate rows**, selected from Harry book 1, LOTM volume 2, Circle of Inevitability and the four Chinese titles below. Contextual retrieval exposed **3,662 source characters**, conservatively counted including repeated context, inside a 20,000-character local review ceiling. This biased sample is not a recall estimate. Three supported / three partial / one wrong describes those rows, not the books. Missed-fact recall was not measured. Sealed details, source excerpts, edition shard hashes and per-row judgments remain private.

The inventory also flags evidence-label and locator-shape gaps in some legacy Luna rows. For example, the four Chinese titles have 28/89/123/32 people rows whose top-level label is outside T/S/I/U. These counts nominate review; they do not independently identify false statements. The collector's lint/repair outputs retain their own scopes and should be assessed alongside the source.

Private artifacts: `docs/research/novels/_reading-level-review-2026-11-08/` contains `all-registered/inventory.json`, `inventory.json`, `source-sample.json`, partial `dossier-<book>.json` files and `input-identity.json`. The aggregate code/test input identity at verification was `06fb2d87d4a47b527a05ee00834fa8dea12da3d5f3eeb56cbd656dbe491f00e8`.

## What changed

- **RC1:** `reading_review.mjs` produces per-pass inventory, richer-field metrics and source-pointer candidates. `--topic` / `--level` can initialize a non-overwriting dossier. Review states stay explicit; existing external dossiers are not declared absent merely because this scanner cannot establish them.
- **RC2:** `make_book_plans.mjs` defaults new plans to 1.5 and records reading-level/relevance/review metadata. `batch_lib.mjs` adds source-led lenses for procedures, generative/causal mechanisms, progression, institutions, economy, knowledge, ecology and long play. Existing unversioned plans remain 1.3. Submitted request bytes are not regenerated for this migration.
- **RC3:** `reading_plan_maintenance.mjs` preflights unsent upgrades against existing caps, preserves sent/collected plans, rejects ambiguous request files and validates campaign reservations. New submission receipts record schema and reading metadata. Optional bounded focus stays limited to the supplied source.
- **RC4:** The overnight driver validates an extra run's campaign manifest and reservation before submitting. Pending runs remain reserved at their full caps; prior failures are included. This is a finite campaign allocation, not a live account balance or a global controller for unrelated API spending.

For procedural systems, dossiers distinguish ordered work/branches from world generation; record actual bindings, interruption, cancellation, partial settlement, recovery and delegation. For generation they ask what varies, persistent identity, dependencies, commitment time, resets and retention. They do not invent seeds, distributions, budgets or mechanics when the source is silent. L3 adds the actual supplier/state owner/consumer and success/failure scenarios for a selected slice. No extra universal story gate was introduced.

## Schema migration and dispatch

All five active local drivers were briefly paused by exact PID while receipts were checked, then stopped/replaced in their own process groups to load the updated code. Existing remote batches continued and were collected by receipt, without duplicate submission. Twelve unsent single-shard plans were upgraded to 1.5: rules/people/texture for Circle of Inevitability and the latter three Chinese titles. Their existing caps remained valid. The first Chinese title had already sent all five passes; all original scene batches were also already sent. Those plans retain 1.3 provenance. Another 150 unsubmitted OpenAI plans in the unapproved queue were upgraded to 1.5. Their two pending run files remain PENDING and outside this campaign: Reverend Insanity now has a deliberately conservative $139.65 envelope cap, and the superseded single-title run $2.94. Those pending-only bounds assume every request fills the configured prompt-tier envelope and output cap; they are not source-sized spend estimates or approval to launch. Source-sized request reconstruction was stopped before writes because of its unnecessary cost for this free migration. Current approved run caps were not raised.

| Source | Targeted supplement |
| --- | --- |
| Harry Potter book 1 | One selected shard: rules, people, texture and scenes at 1.5 |
| LOTM volume 2 | One selected shard: rules, people, texture and scenes at 1.5 |
| 巫师你好，我是伪人 | One selected shard: rules and scenes at 1.5 |
| 一年抽取一词条，模拟的也可以？ | One selected shard: rules at 1.5 |
| 咒回：特级的我去死灭打宿傩了！ | One selected shard: rules at 1.5 |
| 全人类的继承者 | One selected shard: rules at 1.5 |
| LOTM volumes 3–5 | The six missing census shard-passes |

The supplemental run has **19 requests across 16 labels**, all accepted by OpenAI. Enrichment writes to separate private folders and explicitly states its bounded purpose; original readings are preserved. Missing census passes use their existing primary folders and the duplicate-spend guard. API acceptance is not a completed or source-verified reading.

Combined campaign manifest: `docs/gm/dispatch/batch-reading-2026-10-27/plans/reading_budget_2026-11-08.json`. Reservations: CoI $3.96, the four approved books $23.72, prior failed CoI schema batch $0.0567 rounded up to $0.06, supplemental allowance $1.00. **Total reserved $28.74 of $33; $4.26 unallocated.** The actual supplemental run cap is **$0.73**, below its $1 reservation. Do not reuse that reservation for a second run. No automatic paid repair or stronger-model fallback was launched.

Supplement run: `plans/overnight_reading-level-supplement-2026-11-08.json`; launch PID/process group **32918**, private `supplement-launch.json` and `supplement.log`. Replaced driver PID/process groups: CoI **30347**, 巫师你好，我是伪人 **30350** (subsequently completed), 一年抽取一词条，模拟的也可以？ **30353**, 咒回：特级的我去死灭打宿傩了！ **30357**, 全人类的继承者 **30360**. Inspect actual processes and receipts before resuming; these are launch receipts, not permanent process-state claims.

## Checks and remaining work

| Check | Result and scope |
| --- | --- |
| `node --test tests/lead_run_reading_review.test.js tests/lead_run_batch.test.js tests/lead_run_overnight.test.js tests/openai_batch.test.js` | 41 passed. Includes legacy version preservation, partial/Luna coverage, field metrics, sent-plan preservation, cap preflight and refusal before submission when campaign/reservation is exceeded. |
| `reading_review.mjs --out .../all-registered` | Completed on all 152 registry entries; snapshot and field/candidate metadata saved privately. Source meaning was not graded by the scanner. |
| Contextual source check | Seven rows and 3,662 characters; private locators and shard hashes recorded. No full-book or missed-fact recall claim. |
| New-plan and upgraded-plan bounds | Twelve active pending plans retain their $0.04 caps; supplemental plans total $0.73; no request over the configured prompt tier. |
| `npm run check:rules` | Passed: index, receipts, direction sync, player text, names and continuity. |
| `npm run check:arch` | Passed. Game runtime owners unchanged by this task. |
| `node --check` on new helpers | Passed. Task-scoped whitespace check passed, and local Markdown link targets in this report/workflow exist. Whole-checkout `git diff --check` also sees pre-existing generated-bundle whitespace; unrelated bundle files were preserved. |
| Build/full game suite/browser | Not run: no game runtime or UI change and no commit. Focused tooling checks cover this change. |

At the dispatch checkpoint, the remaining steps were collection, source review and explicit overlays or consumer packets. Existing collector repair entries remain a named quality backlog, not automatically paid retries. A passing batch gate does not close them or make an L2/L3 dossier complete. Broader cross-arc synthesis and L3 consumer qualification happen per named system/slice through the updated workflow; this bounded review has not completed those products for all worlds.

## Collection and source audit, 2026-11-08

Weibao authorized collection, source checks and fixes inside the existing $33 campaign. All six original runs reached terminal state. Their receipts match **41 labels and 865 collected requests**, including all 19 supplemental requests and six missing LOTM census shard-passes. The supplemental quality gate flagged two scene labels after collection. Recorded spend was **$3.0490**, including the earlier failed CoI batch.

The first lint pass over the collected rows found 2,305 issues, including 1,655 malformed locator fields. Many packed paragraph ranges into a single locator. Direct source checks identified five amendments to procedural readings and seven opening scenes outside the Harry lead viewpoint. The private correction overlay preserves the original rows and records the source hash, exact pointers, reviewed fields and reason. Background viewpoints remain available as reference.

The source audit paired **7,966 rows across 865 requests** with their primary shards. The maximum reservation including the original spend and schema probe was **$20.04 of $33**. OpenAI returned 864 successful requests and rejected one prompt. The targeted recovery pass sent 253 requests covering 720 recoverable rows, including missing outputs and proposals with invalid citation or row shape. All 253 returned successfully. Its conservative combined campaign ceiling was **$22.41** including transport retries. It excluded the rejected shard. Six numeric anchors in that shard were checked locally and its nine complete scene rows are held. Source review follows WPR19–WPR21. Each original row and source shard was hashed and checked again before applying an overlay.

| Disposition | Rows | Evidence |
| --- | ---: | --- |
| Supported | 5,268 | Source audit and local locator and lint checks |
| Corrected | 1,819 | Source-backed replacements with preserved identity, including five direct edits |
| Held | 879 | 528 uncertain, 335 rejected by validation, nine from the rejected prompt and seven outside lead viewpoint |

Five selected automated corrections were checked directly against their cited passages. The verification also confirmed a unique disposition for all 7,966 rows and zero local flags on accepted rows. The direct checks qualify the named fields. The rest of the accepted overlay carries automated source review. Broader recall and cross-arc synthesis retain their separate review gates.

Recorded usage totals **$4.5561 of $33**, including $3.0490 for the original runs and earlier failure, $1.0335 for the full audit, $0.0007 for the schema probe and $0.4729 for targeted recovery. The receipt-based ledger leaves **$28.4439** of the campaign ceiling. Private artifacts live under `docs/research/novels/_reading-level-review-2026-11-08/closeout/`. Use `accepted.jsonl` for source-reviewed rows, `corrections.jsonl` for replacements and `held.jsonl` for the unresolved queue. The original outputs remain available for provenance. `direct-audit-spot-checks.json`, `rejected-shard-anchor-review.json`, `collection.json`, `retry-collection.json` and `overlay-summary.json` record the checks and terminal counts.

For future OpenAI schema 1.5 requests, `batch_lib.mjs` constrains citation shape, scene action classes and motives through the existing lint vocabularies. Local tests cover the stricter format and the legacy request shape. An invented fixture returned one valid scene through the live Responses route for $0.000697. Focused batch and review checks passed 42 tests. Rules, architecture and scoped whitespace checks passed.
