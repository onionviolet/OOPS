# C2 routine bindings receipt, 2026-10-30

Status: data candidates checked, not adopted into the pack or runtime. No commits.
Scope: C2_ROUTINE_BINDINGS, GM1/GM18; AD36, CLR2/CLR9, WPR2/WPR4/WPR8/WPR19/WPR21.
This follows the lead's-run priority in VISION_DIGEST and PROJECT. No gameplay or standing direction changed.

**F1. Card timing premise was wrong.** All 91 unbound ids belong to 34 later-volume scenes with unqualified locators. The builder interprets those locators as volume 1. Disposition: 91 decided gaps, zero new day bindings. All 91 ids occur once in [card-dispositions.tsv](card-dispositions.tsv). Correct source volumes: 3: 17, 5: 5, 6: 24, 7: 7, 8: 38. Their qualified locators and individual reasons stay private. Binding them to opening days would introduce foreign-volume content. The [proposed patch](build_event_cards_volume.patch) uses shard provenance; replay in memory keeps the 66 already-bound ids and their effects unchanged.

**F2. Slot counts drifted.** Live merged inputs contain 415 unique lead slots, with 93 covered by the ledger's paragraph proxy and 322 missing. The older private ledger has 324 missing, rather than 324 total. The brief's 276 is not reproducible on these inputs. This lane accounts for all 322 live missing slots, including the 17 early slots, without inventing a subset of 276. The proxy does not establish actual runtime consumption.

| Chapter band | Missing | Filled | From rows | Left |
| --- | ---: | ---: | ---: | ---: |
| 1-30 | 17 | 9 | 9 | 8 |
| 31-60 | 46 | 41 | 41 | 5 |
| 61-100 | 59 | 47 | 47 | 12 |
| 101-150 | 104 | 76 | 76 | 28 |
| 151-213 | 96 | 67 | 67 | 29 |
| All | 322 | 240 | 240 | 82 |
| After chapter 30 | 305 | 231 | 231 | 74 |

**F3. Fills are source candidates.** Existing `from`/`to` fields survive as textual bounds; activity timing and relative constraints remain source phrases. Four bounded source checks add timing fills. A 15-slot stratified spot-check exposed two source-row errors: one corrected timing candidate and one quarantined direction mismatch. Original variants remain intact. Inferred source labels remain explicit. Exact-locator scene and census joins are retained as candidates, not automatically promoted: scene timing can describe a different step or a retrospective passage. A source intention stays distinguishable from an executed occurrence.

Left reasons: 73 time unresolved, 8 source place unstated, 1 transit requiring a route binding. The exact 82 ids and locators are in private `remaining-slots.json`. Of the later 74, reasons are 65 / 8 / 1 respectively. All rows retain `runtimeReady: false` and no civil-day index. Filled means a place/activity/timing candidate, not an installed schedule. Source timing, actor-place resolution, civil-day binding, conditional/planned modality and runtime integration remain distinct.

Private output root: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/routine-r3/`.
Primary files: `card-bindings.jsonl`, `unbound-cards.jsonl`, `klein-slots.jsonl`, `remaining-slots.json`, `source-corrections.json`, `summary.json`. Provenance and replay: `live-ledger.json`, `preparation.json`, `prepare.mjs`, `finalize.py`. Source excerpts and spot-check inputs stay there too. `summary.json` records SHA256 input identities.

Reading: reused merged people, scene and census-derived registry rows; all cited card centers and bounded adjacent excerpts across the 34 scenes, plus 15 routine sample windows and targeted timing checks. The 472 captured card paragraphs were not all reread. This is not a new whole-book reading pass. No generated readers or paid source-reading batch. The remaining 82 slots are below the approximately 300-locator threshold, so no Luna briefs were created.

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node scripts/lead_run/coverage_ledger.mjs --out docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/routine-r3/live-ledger.json --summary` | PASS; live missing list captured | Paragraph proxy, not runtime coverage |
| `node docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/routine-r3/prepare.mjs` then `python3 docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/routine-r3/finalize.py` | PASS; candidate outputs produced | Run in this order; preparation alone predates source corrections |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c2/verify.mjs` | PASS; exact card/slot coverage, source bounds, inference labels, hashes, tracked counts, patch replay | Proposed patch exercised in memory; live builder unchanged |
| `node --test tests/lead_run_step_tags.test.js` | PASS 10/10 | Existing shared builder tests; proposed patch covered separately above |
| `git check-ignore` on the two primary private JSONL outputs | PASS; both ignored | Private pack remains local |
| `git diff --check -- docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c2` | PASS | Untracked artifacts also checked by `verify.mjs` prose guard |

Coordinator fold: [fold.md](fold.md). Pack adoption, builder integration, full integration gates and browser/persistence proof were not run by this data lane.
