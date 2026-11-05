# Release reconciliation, 2026-11-04

Request: use reconcile-project and push. This pass selects the already committed local release plus bounded integration repairs, leaving other chats' unfinished work in place. AD32, AD36, AD41–AD43 apply. No new design direction, installed-app adoption or whole-collection completion is asserted.

## Boundary and selected discrepancies

Live origin/master was `aef3cb1f81008e1eb815e57a703974d2447079eb`; local master was `b6678ea9ba4a7cf0313ce83e0c0fc6b0e5c26d5b`, eight commits ahead. Initial working-tree discovery found 389 modified and 1,228 untracked status entries (directory entries are not file counts). The active loose-document reconciliation owns its ongoing B-batches. Its `docs/audits/LOOSE_DOCUMENT_RECONCILIATION_2026-11-04.md` and inventory remain local work under that writer, not artifacts selected by this release.

| ID | Claim and locator | Classification | Owner / consumer | Disposition and evidence limit |
|---|---|---|---|---|
| RP1 | PROJECT calls L2b below floor despite the November 4 closure | Stale summary | [L2b closure](../gm/dispatch/refinement-audits-2026-10-31/L2B_COMBAT_HEALTH_RECEIPT.md#closure-run-2026-11-04-supersedes-the-status-line-below) → PROJECT | Point summary at the health-publication fixture closure. Receipt read, not a fresh browser replay. Legacy first-move disagreement, other combat and L2c remain outside that closure. |
| RP2 | PROJECT names `5dcd2240c` as published and treats the historical installed-app receipt as current | Stale release summary | Live Git remote → PROJECT release paragraph; historical app adoption stays separate | Replace with this release record. Preserve prior wording in the project log. No installed app inspected or changed. |
| RP3 | Three native integration tests fail architecture after appending fixture exports | Incorrect check placement | cast ability/divination/inference test fixtures → architecture checker → actual native save journeys | Run unchanged architecture check before fixture injection, against production inputs. Retain native integration assertions and baseline limits. Initial export reproduced all three failures at 10,116 lines versus 10,115 allowed; production source had 10,111. |
| RP4 | Lead-run CLI rejection depends on a gitignored novels directory existing | Missing portable diagnostic | cast_worksheet/build_crosswalk CLI roots → existing private-root regression tests | An absent local novels root now produces an explicit private-directory diagnostic before canonical-path resolution; existing canonical containment checks remain. No corpus copied or published. |
| RP5 | Current LOTM consumers emit record/job families absent from committed perspective inventory | Incomplete integration | LOTM UI families → perspective_controls → existing inventory coverage test | Select the three existing public inventory rows for sealed-records, record-row and job. No editorial UI implementation or private pack is included. |
| RP6 | Committed HTML fingerprints do not match current stylesheet manifest | Stale generated artifact | stylesheet manifest and committed runtime → build → index/dist | Rebuild the selected committed runtime in the clean export and include its generated HTML, bundle, map and notices as changed. Shared checkout build outputs from other writers are retained. |

## Coverage and exclusions

Searches covered Git status and the eight-commit range, startup owners, shared-checkout procedure, native writeup/reconciliation entry points, selected release receipts and the failing checks' producers/consumers. This is release-boundary reconciliation. It does not rereview every document or source claim preserved by earlier commits. Existing commits retain their own source, fixture, browser and review labels.

Unselected dirty source, editorial UI, method-use work, ongoing reconciliation owner folds and inventories, private directories, lane builds, saved-game evidence, source corpora, bulk screenshots, prototypes and scratch files remain local. No branch pruning, deletion or new worker dispatch. Private book packs are not in the public export, so this release does not establish new campaign reachability on a fresh public installation.

## Verification and publication

Verification runs on a clean `git archive` export of the selected base, with shared dependencies symlinked and local Git metadata for repository-aware checks. Logs and input identity are outside the public checkout. The baseline build and production architecture passed. Its initial rules invocation needed Git metadata; the first export had none, so that invocation failed before direction checking. This setup error is separate from product defects.

The failed baseline suite was stopped after the three fixture-architecture failures were reproduced; it was not a complete run. The final full run below covers the repaired selected inputs.

| Check | Result | Limits |
|---|---|---|
| `node scripts/slot_run.mjs --kind build -- npm run build` | PASS; bundle SHA-256 `f2204a458c5f9b31e525c51ba1703bac3cec20097c8ce78c69f714f2ea39f817` | Rebuilt from the committed runtime plus the three perspective inventory rows. |
| `npm run check:arch` | PASS; main 10,111 / 10,115, display 6,763 / 6,767, save_files 310 / 310 | Existing import/cycle baseline retained. |
| `npm run check:rules` | PASS; 30 register rows, 51 AD codes, 998 relative links; 23 receipts, zero problems; direction sync PASS | Structural and receipt scope. |
| `npm test` | PASS; 5,155 tests, 5,138 passed, 17 skipped, zero failed/cancelled | One complete final run; 436.183 seconds. Private source corpora absent. |
| `node scripts/slot_run.mjs --kind browser -- node tests/lotm_records_browser.mjs <export> <private evidence>` | PASS; 14 checks, zero browser errors, fresh origin at 1920×1080 | Synthetic records fixture. Fetch, read, refusal, Save/reload/Export/literal Import; final screenshot inspected. Existing local private fonts supplied as an explicit unshipped test dependency. |
| `npm run check:docs`; `git diff --check` | PASS | Scope: final selected documentation and whitespace. |

The records browser initially raced import navigation. Its fixed wait uses the actual `domcontentloaded` event instead of a fixed delay. A diagnostic rerun completed the functional checks but failed the zero-console-error assertion on missing local font files; the final strict run supplied those fonts. No private font, pack, export or screenshot is published. Public installations without those fonts use CSS fallbacks; exact fallback typography was not certified by the final strict run.

[Verification identity](release-reconciliation-2026-11-04/verification.json) pins the source/test inputs and records command results. Full logs and synthetic saves remain in local private release evidence. This is agent-verified, not human-reviewed. The installed app, ordinary campaign entry and the ongoing loose-document collection remain outside this release gate. Publication targets `origin/master` with the exact commit containing this record; live remote Git is authoritative for its current published identity.
