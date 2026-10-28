# Batched reading: schedule to Nov 1 (2026-10-28)

Proposal from the Opus reviewer. Weibao corrected the promo credit expiry to **Nov 1**, not Nov 10, and asked for the credit to go to the most useful reading before then. This file overrides the order in [OPUS_REVIEW](OPUS_REVIEW.md) section 4. Merge-first and probe-first gave way to the deadline. The reason: outputs are disposable, the merge is now a script, and re-reading after a schema change costs cents on the monthly credit. **Nothing has been submitted and no key has been read.** Every label below needs Weibao's go with its cap. Labels: [S] seen in files or dry runs, [I] inference.

## 1. What is ready (built today, free)

- **Merge** `scripts/lead_run/merge_shards.mjs` with 9 tests in `tests/lead_run_merge.test.js`. It was run on the 41 agent-read shards of chapters 1-120 [S]. Results:
  - 3,539 census rows in, 1,614 registry ids out, one label per id. A glossary spelling wins; titles and kin words are dropped from aliases.
  - 88 Chinese names sit under two or more ids. A proposed overlay folds 39 of them automatically (same proper kind, proper name; mostly spelling variants such as two spellings of one person). The other 56 are listed for review (common nouns, or a place under two kinds). **One id per entity holds only after that overlay is reviewed and applied with `--overlay`.** With the overlay applied, the registry has 1,552 ids.
  - 316 scenes and 0 duplicate beats. 148 scenes chain to an anchor scene. **Only 7 reach a stated calendar date** (168 separate roots). The global timeline is the weakest output, and the people and texture passes are the main hope for it.
  - `deps` stitched across shards: 260 of 270 resolve.
  - Affordance matrix (F1): 97 places by 14 action classes, 378 of 1,358 cells filled from steps and options. Texture `affordances` add to it when they exist.
  - Resolve rate 0.996 on `needs`. Scenes cite ids that the same reader minted, so the rate is near 1 by construction. It is a defect detector, not a quality score.
  - From scenes: 884 ids touched by the lead, 127 ids (94 of 212 people) with time-of-day whereabouts, and evidence-kind claimants on 561 ids.
  - `--match` takes a prefix regex, so the volume 1 batch waves (`b4s42m`…) merge while the `w3s33` A/B variants stay out. Extra-pass rows (`<raw>_rules/_people/_places/_services/_news/_customs.jsonl`) load and are redirected too. Late identity relabel uses people-pass `reveals` (F3).
- **Plans** from `scripts/lead_run/make_wave_plans.mjs`: 39 plan files, all dry-run [S]. Settings are census at medium and strict; scenes, rules, people and texture at high in prompt mode. The volume 1 remainder runs in 3 waves of 9 to 11 shards. Passes 3-5 cover all 72 volume 1 shards in 8 waves of 9.

**Precondition met 2026-10-28** ([READINESS_AND_SCOPE](READINESS_AND_SCOPE.md) sections 9 and 11): passes 3-5 now record everything and invent nothing, rules rows follow the shared process envelope, routines carry times, and collect reports candidate coverage. K3 moved to gap work afterwards. Plans re-dry-run; every cap below still bounds its batch. Go 1 stands as one phrase.

## 2. What "most useful" means here

A batch earns its place if its rows answer an own-style question (OPUS_REVIEW section 6, Q1-Q20) that the current rows cannot. That decides the order:

| Rank | Batch | Feeds | Why now |
| --- | --- | --- | --- |
| 1 | **Rules over all volume 1** (Haiku, Sonnet if it wins) | Q2, Q10, Q13, Q16: how rites, potions, abilities and laws work and what failure costs | Mechanics are the biggest gap (C1): the batch census note is 15 words and procedure was dropped |
| 2 | **People over all volume 1** | Q1, Q6, Q7, Q18: routines by hour, attitudes, who knows what, identity reveals | Only 94 of 212 people have any time-of-day whereabouts [S]; `reveals` drives the late relabel |
| 3 | **Texture over all volume 1** | Q3, Q5, Q8, Q9, Q11, Q15, Q17 and the affordance matrix | 980 of 1,358 place-by-class cells are empty; hours, routes and prices are thin |
| 4 | **Volume 1 remainder census and scenes** (ch 121-213) | L0 lead line for the last third of volume 1; M1, M2 | Completes the book the game already uses |
| 5 | **Sonnet options and needs** over merged scenes | Q4, Q12: real alternatives per choice with resolved needs | Haiku gives one untaken option and few needs [S, PLAN section 8] |
| 6 | **10% fact check** (Sonnet) | Trust in every other row (C7) | No factual ground truth exists today |
| 7 | **Gap probe** (script, then Sonnet on gaps) | Decides schema 1.4 (G3, G4) | Runs on rows from ranks 1-4 |
| 8 | Other text, only if a code lane lands by Oct 30 noon: LOTM volume 2 (Chinese, needs the part-aware locator check), Harry Potter year 1 and Mother of Learning (need the English adapter) | Breadth | Lower value than depth on the book in play; it is the credit sink only after ranks 1-7 |

Not scheduled: Haiku census re-reads of chapters 1-120 (the agent rows exist and merge), and any pass on the `w3s33` variants.

## 3. Stages, go phrases and what must be collected first

Turnaround: most batches finish within an hour, and the limit is 24 hours [S, docs]. **Assumption: the last submit is Oct 31 at 12:00 local time**, so a 24-hour batch still ends before expiry. Expiry time and timezone are unknown. Spend after expiry may bill the paid balance. Every cap below is a **true bound**: requests × (input + `maxTokens` × output price) at batch price, so a batch cannot exceed it. Estimates use measured output (about 40,000 to 45,000 tokens a request).

Who runs it: the reviewer session (this one) or the batch-reading coordinator submits and collects. The first Keychain read can show a macOS prompt, so Weibao may need to be at the machine for the first submit.

### Stage A: now (Oct 28). Haiku arms plus the Sonnet A/B. Estimate $4.25, bound $5.86

| Label | Requests | Estimate | Cap (bound) | Purpose |
| --- | --- | --- | --- | --- |
| pilot-3-census | 3 | $0.036 | $0.04 | Pilot pass rule (G1) |
| pilot-3-census-b | 3 | $0.036 | $0.04 | Second medium run, union test (F5) |
| pilot-3-census-high | 3 | $0.040 | $0.06 | One high run against the union (F5) |
| v1-rules-w1 … w4 | 9 each | $0.108 each | $0.16 each | Ranks 1; agent shards ch 1-~105, Haiku arm for the A/B |
| v1-people-w1 … w4 | 9 each | $0.108 each | $0.16 each | Rank 2 |
| v1-texture-w1 … w4 | 9 each | $0.108 each | $0.16 each | Rank 3 |
| sab-census | 3 Sonnet | $0.675 | $0.77 | Sonnet census medium on `w2s25`, `w3s33`, `w3s36` |
| sab-scenes | 3 Sonnet | $0.725 | $1.01 | Sonnet scenes high, same shards |
| sab-rules | 3 Sonnet | $0.721 | $1.01 | Sonnet rules high, same shards |
| sab-people | 3 Sonnet | $0.722 | $1.01 | Sonnet people high, same shards |

Waves 1-4 of passes 3-5 cover agent-read shards only (chapters 1 to about 105), so they need no new census. They include the three A/B shards, which makes them the Haiku arms. Sonnet prefixes start with `z`, so no Haiku file is overwritten.

**Go 1:** "Go on batches pilot-3-census, pilot-3-census-b and pilot-3-census-high, cap $0.04, $0.04 and $0.06; v1-rules-w1, v1-rules-w2, v1-rules-w3, v1-rules-w4, v1-people-w1, v1-people-w2, v1-people-w3, v1-people-w4, v1-texture-w1, v1-texture-w2, v1-texture-w3 and v1-texture-w4, cap $0.16 each; sab-census, cap $0.77; sab-scenes, sab-rules and sab-people, cap $1.01 each."

Collect all 19 before Stage B. Run the merge with the new rows, then the pilot report: per-shard grade, new-entity denominator and recall, `great` share, and cost against 2x.

### Stage B: after Stage A's collect and a passing pilot (Oct 28-29). Haiku volume 1. Estimate $2.05, bound $2.92 (union $0.35 more)

Order inside the stage, one batch at a time with a collect between:

1. pilot-3-scenes. Before it, re-run the dry run: the pilot census now exists, so the hit lists change.
2. v1-census-w1, then w2, then w3, each after the previous collect, so each carries the grown glossary.
3. v1-scenes-w1 to w3, each after its census wave is collected and graded.
4. v1-rules, v1-people and v1-texture waves 5-8 (these include chapters 121-213), after v1-census-w3 is collected.
5. Only if rule T1 passes: v1-census-b-w1 to w3 (the union's second census).

If any one turnaround exceeds about 6 hours, submit the rest of that step in parallel and let the overlay fold the duplicate ids. Stop rules stand at every collect (PLAN section 4): more than 2 of 10 shards grade C, name accuracy under 0.9, the same failure on three shards, or measured cost over 2x the estimate. A stop ends the stage and comes back to Weibao.

**Go 2:** "Go on stage B in order: pilot-3-scenes, cap $0.06; v1-census-w1, v1-census-w2 and v1-census-w3, cap $0.14, $0.14 and $0.12; v1-scenes-w1, v1-scenes-w2 and v1-scenes-w3, cap $0.19, $0.19 and $0.16; v1-rules-w5, v1-rules-w6, v1-rules-w7, v1-rules-w8, v1-people-w5, v1-people-w6, v1-people-w7, v1-people-w8, v1-texture-w5, v1-texture-w6, v1-texture-w7 and v1-texture-w8, cap $0.16 each; and, only if the union rule passes, v1-census-b-w1, v1-census-b-w2 and v1-census-b-w3, cap $0.14, $0.14 and $0.12."

### Stage C: Sonnet scale-up, by Oct 29 evening. Each line needs its own go after the A/B report

The thresholds are fixed now, before any result arrives (T-codes). "Haiku arm" means the same shards read by Haiku: the pilot census for `w2s25` and `w3s36`, the medium census `w3s33w`, and the wave rows for passes 3-5.

| Code | Scale-up | Adopt if (pooled over the 3 shards) | Estimate | Bound |
| --- | --- | --- | --- | --- |
| T1 | Union census for the volume 1 waves (Haiku, in Go 2) | union new-entity recall at least 0.08 above a single medium run, and the high run does not match the union | $0.35 | $0.40 |
| T2 | Sonnet rules, all 72 shards (sv1-rules-w1 to w8) | Sonnet rules with filled inputs or costs **and** results at least 1.5x Haiku's; lint issues no more than Haiku's; on a 10-rule read by the reviewer, Sonnet right at least as often | $17.3 | $24.3 |
| T3 | Sonnet people, all 72 shards (sv1-people-w1 to w8) | routine slots with place and time at least 1.5x Haiku's; relations at least 1.3x; `reveals` no fewer | $17.3 | $24.3 |
| T4 | Sonnet scenes, the 31 remainder shards | on 2 of 3 shards: options with non-empty `needs` at least 20 points above Haiku, grade no worse, `great` share at most 40% | $7.5 | $10.5 |
| T5 | Sonnet census, the 31 remainder shards | new-entity recall at least 0.10 above Haiku medium | $7.0 | $8.0 |

Plan files for T2 and T3 are written on demand (`make_wave_plans.mjs --sonnet=rules,people`), so unused Sonnet plans do not clutter the folder. If a threshold fails, the Haiku rows stand and the money moves down the rank list.

**Go 3** (example if T2 and T3 pass): "Go on sv1-rules-w1 through sv1-rules-w8 and sv1-people-w1 through sv1-people-w8, cap $3.04 each." Each wave is 9 Sonnet requests at $0.337 bound. I will name each label in the request.

### Stage D: Sonnet judgment lanes and breadth, Oct 30 to Oct 31 noon. Only if their code lands by Oct 30 noon

| Lane (code first, sonnet level) | Batch | Estimate [I] | Dropped if late? |
| --- | --- | --- | --- |
| Options and needs pass in the runner: input is one merged scene with its cited paragraphs, grouped per shard; output is 2 or more alternatives per choice with `needs` resolved to registry ids | about 72 Sonnet requests | $5 to $8 | Yes; Haiku options stand |
| Fact-check pass: 10% of rows per shard with their cited paragraph; output supported, partly or not | about 72 Sonnet requests | $3 to $5 | Yes; the C7 gap stays open |
| Gap probe: scripted answerer over the merged rows (Q1-Q20), then Sonnet on the unanswerable rows only | 1 to 3 requests | under $1 | The script part runs free regardless |
| LOTM volume 2 locator check, then Haiku census and scenes | about 90 shards | $2 to $4 | Yes |
| English adapter, then Harry Potter year 1 and Mother of Learning, Haiku, all passes | 10 + 106 shards | $3 to $6 | Yes |

**Go 4** names those labels and caps once the plans exist.

## 4. Budget

| Stage | Estimate | Bound |
| --- | --- | --- |
| A | $4.25 | $5.86 |
| B (with union) | $2.40 | $3.32 |
| C (all of T2-T5 pass) | $49.1 | $67.1 |
| D (all lanes land) | $13 to $24 | $30 |
| **Total** | **about $69 to $80** | **$106 (above the credit)** |

Bounds can pass $100 only if every Sonnet scale-up both wins and runs at maximum output. The rule: before each Stage C or D go, I report the measured spend so far, and the next go is sized so measured spend plus that go's bound stays under $95. If the A/B shows Sonnet does not earn its 20x price, the total drops to about $10 to $20. The remainder then stays unspent rather than buying rows nobody reads. Breadth (rank 8) is the only honest sink, and it needs a code lane first.

## 5. Risks

- Sonnet prices and `max_tokens` 64,000 at high effort come from the runner's price table and docs, not a live Sonnet high-effort run [I]. sab-* measures them.
- The Sonnet census arm's glossary leaves out only the three shards' own answers and includes later chapters, like the pilot (OPUS_REVIEW C1). The `w3s33` Haiku arm used an earlier-only glossary. Compare the pooled numbers and report denominators.
- The proposed overlay is unreviewed. A few folds look doubtful (a street folded into a named street, a person into a family). Review it before any consumer reads the registry as one world. The review is free in session.
- Prompt-mode JSON on long output can fail to parse. A truncated result needs a split shard or lower effort, not a repair.
- Source text goes to the API under Weibao's standing choice. Outputs and request files stay private and gitignored.

## 6. First go phrase

> Go on batches pilot-3-census, pilot-3-census-b and pilot-3-census-high, cap $0.04, $0.04 and $0.06; v1-rules-w1, v1-rules-w2, v1-rules-w3, v1-rules-w4, v1-people-w1, v1-people-w2, v1-people-w3, v1-people-w4, v1-texture-w1, v1-texture-w2, v1-texture-w3 and v1-texture-w4, cap $0.16 each; sab-census, cap $0.77; sab-scenes, sab-rules and sab-people, cap $1.01 each.

## 7. Overnight run (2026-10-28)

Weibao, 01:0x EDT: "Sounds good, save idea accordingly, Build it, and then send out the batched requests overnight accordingly for all of my prime books." Taken as the go for **Go 1 and Go 2 at the caps written above**: 38 labels, caps totalling $8.78, run ceiling $12 measured. Excluded, each needs its own go: the union census (T1), Sonnet scale-ups (T2-T5), repair batches, and every book other than LOTM. LOTM volume 1 is the only prime book the runner can read tonight; Harry Potter, Mother of Learning and A Soldier's Life wait for the world profile lane (section 10 of READINESS_AND_SCOPE).

Driver: `scripts/lead_run/batch_overnight.mjs --run plans/overnight_2026-10-28.json`. It submits each step, collects, applies the pilot gate after step A (experiment arms recorded, not gating) and the stop rules after B1-B4, and stops at a failed gate or the ceiling. It is resumable (receipts are collected, not resubmitted). Log: `<private batch dir>/overnight_2026-10-28.jsonl` (labels, batch ids, counts, dollars). Results are reported the next day from that log and the `<label>_summary.json` files.

## 8. Stage A results and the morning decisions (2026-10-28, 02:xx EDT)

The overnight run submitted all 19 Stage A labels at 01:12 EDT; all ended by 01:22. **The pilot gate failed and the driver stopped by design**: measured spend **$2.06** (Sonnet A/B $0.74, pilot census arms $0.09, rules/people/texture waves 1-4 $1.22); nothing after Stage A was sent. Counts only; rows stay private.

| Code | Finding | Evidence | Consequence |
| --- | --- | --- | --- |
| SA1 | Grade C came from one or two rows per shard, not from wrong names: name accuracy 1.0 on every pilot shard; the codes were `price-amount` (a price row without a parsed amount) and `id-namespace` (id kind segment differs from the row's kind) | lint on `p15m`, `p25m`, `u15m`, `zw3s36cm` | **Fixed for free in `migrate_shard`** (id follows the kind, old id kept in `idWas`; amounts parsed from printed names, nothing guessed). Offline regrade: 6 of 9 C shards become B; each remaining C has one unparsable row (a repair batch fixes it for cents). Pilot headers `p15m`-`p36m` regraded on disk (B, C, B) |
| SA2 | New-entity recall is noisy on small denominators: medium 21/40 (0.53), second medium run 14/23 (0.61), **high 17/23 (0.74)**, union of two medium runs 28/40 (0.70); the same settings gave 3/12 and 8/12 on one shard | `batch_compare` per arm | **Census moves to high effort, 64,000 tokens** (plans regenerated). The pilot's glossary includes later chapters (OPUS_REVIEW C1), so its fresh entities are one-off names; 0.75 was set on a different basis |
| SA3 | Dense shards truncate: census at medium and high hit `max_tokens` on `w2s25` (13 scenes); people pass truncated 2 of 36 shards at 64,000 and failed to parse 1 | collect summaries | Split dense shards (K5) before re-reading them; people waves keep 64,000 and their truncated shards get a split re-read |
| SA4 | **Sonnet fails every pre-set threshold**: census new-entity recall 10/23 (0.43) against Haiku 0.53-0.74 (T5); rules with inputs or costs and results 8 against Haiku 7 (T2 needs 1.5x); timed routine slots 20 against 48, relations 79 against 89 (T3) | `sab-*` against wave rows on `w2s25`, `w3s33`, `w3s36` | **No Sonnet scale-up.** Haiku stays the reader; the implementer reads cited paragraphs (section 12 of READINESS_AND_SCOPE) |
| SA5 | Two people-pass shards had 53 and 57 locator lint hits (locators in a non-standard form) | `w1s10`, `w2s22` people | Rows kept; locator normalization is a merge step |

**World profile lane (built the same night, no spend):** `world_profiles.mjs` (locators `en bB cN pM`, English headers, name matching, titles, quote guard by shared word runs, appendix per world), `prepare_shard_en.mjs` (EPUB and PDF), world appendices for Harry Potter and Mother of Learning, lint/migrate/candidates/glossary/merge/cite made language-aware with LOTM output byte-identical (system prompts compared). Shards prepared privately: Harry Potter year 1, 9 shards (17 chapters); Mother of Learning, 106 shards. Plans: 64 files (`hp1_*`, `mol_*`), pilots dry-run at about $0.012 a pass. Known gap: Harry Potter books 2-7 split imperfectly from the combined PDF (book 3 onward); year 1 is clean.

**Decisions for Weibao (each a go phrase; caps are true bounds):**
- D1 LOTM volume 1 continues with census at high effort and the stop rules as they are: "Go on run 2026-10-28b: pilot-3-scenes $0.06; v1-census-w1 $0.19, v1-census-w2 $0.19, v1-census-w3 $0.16; v1-scenes-w1 $0.19, v1-scenes-w2 $0.19, v1-scenes-w3 $0.16; v1-rules-w5 to w8, v1-people-w5 to w8, v1-texture-w5 to w8 $0.16 each; ceiling $6." (19 labels, caps $3.06.)
- D2 English pilots: "Go on run 2026-10-28en: hp1-pilot-census, mol-pilot-census, hp1-pilot-scenes, mol-pilot-scenes, $0.02 each." Full Harry Potter year 1 and Mother of Learning waves follow on a third go after the pilots are read (about $7 for both books, all passes).
- D3 Optional, cents: submit the pilot census repair batch (`pilot-3-census_repair_requests.jsonl`).

## 9. D1 and D2 approved and launched (2026-10-28, 08:11 EDT)

Weibao: "Go ahead, consider if there is any prompt improvements accordingly" (recorded in both run files' `approval`). D3 not taken.

Prompt changes before launch (`batch_lib.mjs`), each tied to a Stage A finding:

| Code | Change | From |
| --- | --- | --- |
| PI1 | Census: an id's kind segment equals the row's `kind`; a price row exists only when the text prints an amount and carries it in `amount`; a vague amount takes its lowest reading with "approx" in the note; a cost with no number goes in the item's note; notes at most 15 words. (Revised after launch: the first wording said to omit `amount`, which lint fails; it went out with run `b` wave 1 and the English census pilots.) | SA1 (`id-namespace`, `price-amount`) |
| PI2 | Census: the known-names table is incomplete; reread each chapter for unlisted names, one-line mentions included | SA2 (new-entity recall) |
| PI3 | Passes 3-5: one paragraph per locator, never a range or list | SA5 (53 and 57 locator lint hits) |
| PI4 | Passes 3-5: a few words per field, each fact once, so the reply closes as valid JSON | SA3 (people truncation and one parse failure) |

Checks: lead_run tests 63 pass; dry-run estimates for all 23 labels sit under their caps (largest $0.145 against $0.19); English prompts keep the `en bB cN pM` rule. Not measured yet: whether PI1-PI4 change grades or recall. Compare the resumed waves with Stage A at collect.

Launch: both drivers run detached under `nohup` (PIDs 94485 for `b`, 94486 for `en`; the first attempt with `setsid` failed on macOS and sent nothing). Logs: `<outDir>/overnight_2026-10-28b.jsonl` and `overnight_2026-10-28en.jsonl`.

### Outcome: both runs stopped at their first gate (spent $0.21)

| Code | Finding | Evidence | Disposition |
| --- | --- | --- | --- |
| R1 | `b` B1 stopped: `v1-census-w1` lost 4 of 11 shards at `max_tokens` (high effort used 42,000-64,000 output tokens on 3-chapter shards; the Stage A high arm already hit 64,000 on `h25`, so this is the effort level, not PI1-PI4) and 3 shards graded C on one lint row each (`price-amount` twice, `note-length` once). `pilot-3-scenes`: 2 B, 1 C. Spent $0.19 | `v1-census-w1_usage.csv`, overnight log | Remaining census moves to **medium** (Stage A medium used 20,000-32,000), two runs for the union; the four truncated shards get a medium retry. Run `c` below replaces the unsent part of `b` |
| R2 | `en` E1 stopped: Harry Potter census pilot **B, candidate coverage 1.0**; Mother of Learning census pilot C on one row (`price-amount`), coverage 1.0. Both used about 26,000 output tokens on one-chapter shards, so English stays at high. Spent $0.015 | overnight log | Scenes pilots (E2) not sent yet |
| R3 | The stop rule counted any lint row as a C toward the 20% share, so one row in 100+ stopped a wave | `stopCheck` | **Proposed stop rule:** a C shard with exactly one lint row and name accuracy 1 is "repairable" (gets a repair request, does not count); `max_tokens`, parse failures and multi-row C still count. Coded and tested; applies only after Weibao's go |
| R4 | One `npm test` failure on the first full run did not recur (3,610 pass on rerun, lead_run files untouched by it) | two full runs | Recorded as transient or another session's |

### Decisions

- E1 English scenes pilots under the revised stop rule (the driver collects E1 from its receipts and continues at E2; labels and caps already approved): "Go on resuming run 2026-10-28en with the repairable-C stop rule."
- E2 LOTM run `c` (census w1 retry, census w2-w3, second census w1-w3, scenes w1-w3, rules, people and texture w5-w8; caps total $3.42; ceiling $5): "Go on run 2026-10-28c: v1-census-w1-retry $0.07; v1-census-w2 $0.19, v1-census-w3 $0.16; v1-census-b-w1 $0.19, v1-census-b-w2 $0.19, v1-census-b-w3 $0.16; v1-scenes-w1 $0.19, v1-scenes-w2 $0.19, v1-scenes-w3 $0.16; v1-rules-w5 to w8, v1-people-w5 to w8, v1-texture-w5 to w8 $0.16 each; ceiling $5; repairable-C stop rule."
- Repairs for the one-row C shards stay with D3 (cents, separate go).
