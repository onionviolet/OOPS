# How much work local agents can take (2026-10-28)

Status: measured pilots plus inference; proposals only, nothing here changes a protocol. Starting proposal: codes LA1-LA8 in the [coordinator handoff](../gm/dispatch/protagonist-life-2026-10-27/COORDINATOR_HANDOFF_2026-10-28.md). Earlier evidence: [local reader test](LOCAL_AI_READER_TEST_2026-10-27.md) (guidelines L1-L10). Machine: Apple M5 Pro, 64 GB. Model for every run: `qwen3.8:27b` (NVFP4), `num_ctx` 16384, thinking off. Raw outputs stay in `/tmp/la2` and a private folder; no book text or canon names are in this file (AD1). Labels: **[M]** measured here, **[I]** inferred.

## Answer in six lines

1. **LA2 pilot (routine times, 3 MoL chapters): works as a cautious filler, not as a bulk fixer.** Usable slots (registry place plus time, proxy count) went from 3 to 10-12 of 80 [M]. Lint errors after repair: 0 [M]. The ceiling is the text, not the model: only 15-20 of 76 untimed slots have a time the chapter states, and the model answered "none" for the rest, which is correct behavior [M].
2. **Hand check: 15 distinct fills, 9 supported, 3 partial, 3 unsupported, 0 invented** [M]. All 3 unsupported fills came from the temperature-0 run; the two temperature-0.3 seeds produced none of them. The lint cannot see this error: the quote is real, but it times a different event than the slot.
3. **Code pilot (one pure module, existing contract test, 5 attempts): 3 of 5 passed** [M]. The two failures were caught by the test on the first run, so a test-gated loop turns 60% into a usable lane.
4. **Local models can take roughly 10-20% of lane count and under 10% of cloud-token spend** [I]. Mostly row-level reading sub-lanes, tagging and small tested modules. Design, integration, browser floors and review stay cloud or coordinator.
5. **Wall time is small** (about 30-60 s per chapter for LA2, about 30 s per module attempt) [M]; **memory is the cost**: 18-19 GB loaded, and swap grew by about 7.6 GB over this session [M].
6. **Gate breach to know about:** swap was 94% used when I started (14.4 of 15.4 GB). The guideline says do not start. Free memory was 76% with no model loaded, swap used had been static, so I ran with a monitor and logged the result. macOS grew the swap file to 22.5 GB and it ended 98% used. Treat swap-used as a poor gate (see LA11).

## Part 1: LA2 routine-time pilot

**Task.** Fill `time` on routine slots that have none, for chapters 1-3 of volume 1 of the MoL lead run. Source rows: `/tmp/m2-mol/merged/extras.jsonl` (private lead-run merge); chapter text from the private `shard_mol_b1_ch00N` files. Slice figure from the merged `consumer_fitness.json`: 15 of 96 slots usable in chapters 1-5 [M, from the pipeline]. The 3 chapters hold 80 slots, 4 already timed, 76 asked.

**Harness** (copy of the census-lane pattern; script kept in the shared notes folder, not in the repo): one chapter per call group; slots in batches of 10; the prompt carries only the paragraphs within -5/+3 of each slot's locator (script-chosen window), 8.7k-10.9k prompt tokens per chapter over 3 calls. The schema allows only six bands or `none`, a paragraph number and a quote of at most 12 words. The script owns the slot key, the output shape (`time.value`, `precision: band`, evidence locator and quote) and all repair:

- the quote must appear verbatim in the cited paragraph; otherwise the script moves the locator to the window paragraph that contains it, else drops the fill (6 moves on one chapter-1 call set, 0 drops);
- the quote must contain a time word that matches the band (lexicon gate); otherwise the fill is dropped (5-8 drops per seed, all on chapter 2). Example of what it catches: "the next day opened with ..." labelled morning.

**Results** (3 chapters, 80 slots) [M]:

| Seed / temp | Fills kept | Dropped by lexicon gate | Usable before | Usable after | Wall | Tok/s | Out tokens |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 42 / 0 | 20 | 8 | 3 | 12 | 162 s | 40-42 | 3,048 |
| 7 / 0.3 | 15 | 7 | 3 | 10 | 100 s | 38-39 | 2,976 |
| 99 / 0.3 | 15 | 5 | 3 | 10 | 81 s | 37-39 | 3,069 |

"Usable" here is a proxy: a registry place id on the slot plus a time that passes the pipeline's `hasTime` rule. The official fitness number resolves free-text places too, so use the proxy only for the delta. Lint errors after repair: 0 in every run (shape, locator-in-text, band-lexicon). Fills not usable stay as proposals with a place problem, not a time problem.

**Variance** [M]: across 3 seeds, 15 distinct slots were filled in at least one seed and 12 in all three, with the same band every time (12 of 12). Chapter 2 gave 9 fills in all three seeds, chapter 3 gave 4, chapter 1 gave 7 / 2 / 2. The temperature-0 chapter-1 run added 5 fills that the other seeds did not; those were the weak ones below.

**Hand check against cited paragraphs** [M]: there were only 15 distinct fills, so I read all 15, not a sample of 20.

| Verdict | Count | What they are |
| --- | --- | --- |
| Supported | 9 | Stated hour or band for that very activity (a stated lesson hour, "past noon" for a meal, a wake-up errand, a Friday evening visit, a greeting) |
| Partial | 3 | A class or lesson on a stated weekday morning; the quote times the day, and the slot's activity (attendance, a pet in class) is plausible but not stated |
| Unsupported | 3 | The quote times a different event than the slot (an early conversation at breakfast cited for a later trip and a later market visit). All from seed 42 |
| Invented | 0 | Every quote is verbatim by construction; no band contradicts its quote |

Two of seed 42's unsupported fills sit on slots with a registry place, so its corrected usable count is 10, not 12. After hand correction every seed gains about +7 (3 to 10), against the raw +7 to +9.

**Findings.**
- The lint passes everything real except one failure class: a true quote about the wrong event. A script check can catch most of it: require the cited paragraph to lie within 3 paragraphs of the slot's own locator (the three unsupported fills were 5 to 37 paragraphs away) [I, not yet run].
- Temperature 0.3 with a fixed seed was more conservative than temperature 0 here; two seeds are too few to call it a rule [M, n=2].
- Model paragraph numbers are unreliable (6 relocations on one call set); the script's repair is what keeps locators true.
- Most slots (about 75%) have no stated time. A local model cannot fix that; a script that derives a band from the lead scene's own `timeOfDay` and `place` for slots inside a scene would reach slots the chapter text never times [I, not measured].

## Part 2: code pilot

**Task.** Regenerate `src/wake_queue.js` (64 lines, an indexed heap with registration, cancel and due) from a requirements paragraph plus the unchanged `tests/wake_queue.test.js` (5 tests, including a 10,000-step model comparison and an ordering test). Scratch copies under `/tmp/la2/code/a1..a5`; the shared tree was untouched. Seeds 1-5, temperature 0.3, one call each, no retry.

| Attempt | Tests passed | Output tokens | Tok/s | Wall | Lines (original 64) | Failure |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 5 of 5 | 1,026 | 40.9 | 33 s | 150 | none |
| 2 | 5 of 5 | 1,294 | 40.3 | 32 s | 170 | none |
| 3 | 3 of 5 | 1,153 | 40.6 | 29 s | 164 | cancel of the last heap element reads an undefined entry (2 tests) |
| 4 | 5 of 5 | 1,050 | 35.3 | 30 s | 137 | none |
| 5 | 4 of 5 | 1,046 | 36.4 | 29 s | 146 | order differs from the sorted model (1 test) |

**Pass rate 3 of 5 (60%)** [M]. Failures are the classic indexed-heap bugs (last-element removal, stale positions); the contract test caught every one. Code is 2.1 to 2.7 times longer than the repo version, with plain loops and many small helpers, so it passes the test but would not read like the surrounding code without a style pass.

**Caveats** [M/I]. The requirements paragraph was written by me from the module's header comment and tests, so this is easier than a real lane (a lane brief states intent, not behavior). One module, one test file, 5 samples: the 60% has a wide interval. A retry that feeds the failing test output back was not run; I expect it to lift the rate [I]. The model did not touch `src/main.js`-scale code and could not (10,090 lines against a 16k context) [from LA3].

## Work types

Share = proportion of that work type a local model could take over given the gates, **[I]** unless noted. Time cost is per unit, wall.

| Work type | Fit | Evidence | Gates | Memory and time cost |
| --- | --- | --- | --- | --- |
| Reading lanes, row-level (census names, price/measure/time rows, routine times) | **Good for narrow lanes; about 30-50% of reading rows by count.** Not for scenes, options, fills | Census lane 87-93% recall, 0 lint errors [M, reader test]; LA2 3 to 10-12 usable of 80 with 0 lint errors, 9 of 15 fills supported [M] | Same as the reader test (L1-L8) plus quote-in-text, time-word gate, locator-distance check (proposed), 5-row hand read per shard, fallback to haiku when coverage is low | 18-19 GB; 1-4 min per shard or chapter group; zero cloud tokens |
| Pipeline rows by script, no model (S2-a, S2-b, scene-derived time bands, known-name rows) | **Best fit, and not a model job** | Part A script census: name accuracy 1.0, 0 tokens [M, reader test]; unmeasured scene-derived times [I] | Existing lint and `check` scripts | None; seconds |
| Tagging and classification (reaction classes, texture tags, provenance labels, panel perspective) | **Good, about 40-60% of such tasks** | Not run here; closest evidence is the schema-constrained census labelling (kind enum, 0 invalid) [M, reader test]. Known-answer samples exist (`reacts_classified.jsonl` has a keyword baseline) [I] | Enum schema, known-answer sample of 50 rows, agreement rate against the baseline, disagreements sent to a cloud model | Same model; small prompts (under 3k tokens), seconds per row |
| Small runtime modules with contract tests | **Partial, about 10-15% of runtime lanes** (pure helpers of 30-150 lines behind a port) | 3 of 5 on `wake_queue` with a spec in hand [M]; output 2x longer than repo style [M] | The module's existing test file run in a scratch copy; best-of-N or a test-feedback retry; style and `check:arch` pass by a cloud agent or the coordinator before merge; never commits (LA5) | 18-19 GB; about 30 s per attempt, so 2.5 min for pass@5 |
| Review and verification | **Mechanical checks yes, judgment no, about 5-10%** | The pipeline already uses scripts for lint, locators and zero-loss; local review of lane returns was not tested (LA4) | Script gates only; a local model may pre-flag locator mismatches, never approve | Scripts free; model review not recommended |
| Design (rules, palettes, accepted decisions, cross-world integration) | **No, about 0%** | Reader test: models import outside knowledge into notes and miss options and choices [M]; design needs the whole rule set in context [I] | Not applicable | Not applicable |
| Multi-file integration, `src/main.js` lanes, browser floors | **No** | Context is 16k tokens; `main.js` has 10,090 lines; memory forbids running beside a browser [from LA3, LA6] | Not applicable | Not applicable |

**Overall estimate [I]:** 10-20% of lane count could run local (mostly reading sub-lanes, tagging, small tested modules); under 10% of cloud-token spend, because the work that is local-friendly is the cheap, mechanical part, and the expensive part (scenes, design, integration, review) is not. The main gain is not tokens: it is that bulk row work across many books (LA8, MW1) stops being limited by the subscription window.

## Recommended routing

Extends LA1-LA8. New codes follow them.

| Code | Route | Checks | Level |
| --- | --- | --- | --- |
| LA9 | **Local, per chapter:** routine-time fill, price and measure confirmation, texture tags. Script-first: derive times from the lead scene's own `timeOfDay` and `place` before any model call; the model sees only slots the script cannot time. Use temperature 0.3 with a recorded seed | Quote verbatim in the cited paragraph; time word matches band; **cited paragraph within 3 of the slot's locator** (proposed, would have removed all 3 unsupported fills); 5 fills read against text per shard; fallback to no fill, never a guess | LATER/DELEGATE: add the locality check and the scene-derived step, rerun the 3 chapters; done when unsupported is 0 of 15 and usable gain at least +7 |
| LA10 | **Local, pure modules:** a lane brief for a helper of at most 150 lines names the port and the existing test file; the local model writes it in a scratch copy and a test-feedback loop (up to 3 rounds) reruns the test | Existing contract test passes unchanged; `check:arch`; line-count and style pass; a cloud agent or the coordinator reads the diff before merge; pass rate recorded per attempt | LATER/DELEGATE: run the loop on `facts_frame.js` (63 lines, 148-line test) and one untested helper; done when pass@3 over 5 tasks is recorded |
| LA11 | **Memory gate by free memory and swap growth, not swap used:** do not start below about 40% free memory; abort if swap grows more than 2 GB during a batch or free memory drops under 15%; run one model, never beside a build, browser floor or another lane's test; `ollama stop` after. Swap total grew from 15.4 to 22.5 GB in this session, so a fixed 80% rule fires on a stale number | Log free %, swap and loaded size every 15 s during a batch (done here) | ACCOUNT FOR NOW |
| LA12 | **Tagging with a known-answer sample first:** run one tag lane on 50 rows with a baseline; ship only when agreement meets a threshold the coordinator sets | Agreement rate; disagreements to a cloud model | LATER/DELEGATE |
| LA13 | **Review and design stay cloud.** A local model may produce a candidate list for a reviewer; it never signs off | Same as LA4 and LA5 | No change |

## What would raise the share

1. **A locality check and scene-derived bands** for routine times (LA9). Cheap, deterministic, and it addresses both the precision failure and the "text rarely states a time" ceiling.
2. **A test-feedback retry loop for code** (LA10). All five tests of the pilot fail fast with clear messages, which is the best-case input for a self-repair loop. Best-of-5 already reached a passing module in this pilot.
3. **More contract tests behind AD45 ports.** Local coding scales with the number of modules that have a test file and a 30-150 line body; `src/` has 887 files [M], so the limit is tested ports, not model strength.
4. **Briefs that state behavior, not intent.** The pilot's spec was written from the tests; a real lane brief has to be turned into that form first (by the coordinator or a cloud model), which costs some of the tokens saved.
5. **Free memory.** A second local model, a larger context, or running beside a test lane is not possible at 18-19 GB plus the other sessions' load. More memory, or a quiet window, would let a 32k context hold two chapters or a module plus two neighbors.
6. **Style tuning.** A system prompt or few-shot from repo modules (the local output was 2x longer and used generic names) would reduce the cloud style pass; untested.

## Gaps

LA2 used 3 chapters from the opening slice and 3 seeds; the 3 chapters were not tuned on, but the lane is new and the hand check covers only 15 fills. The "usable" figure is a proxy. The 20-fill hand check asked for was not possible (15 distinct fills). The code pilot has 5 samples, one module and a requirements text I wrote. Shares in the work-type table are judgment, not measurements of repo effort; no token ledger of past lanes was summed. The swap and free-memory readings were taken while other sessions were running tests, so not all growth is this model's. Mean tokens per second and wall times include only the model run, not the harness setup.
