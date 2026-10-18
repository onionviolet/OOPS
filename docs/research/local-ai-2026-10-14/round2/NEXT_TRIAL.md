# Small next-trial plan

**PROPOSED, NOT RUN.** Research-only preparation. Inference and any exact challenger artifact/runtime require the next task's authorization. No downloads, server/power settings, game writes or memory collection are authorized here.

## N1: Select the comparison and freeze conditions

Initial question: does writing specialization produce more useful, constraint-faithful content with less review than installed Qwen? Compare Qwen3.8 incumbent with **base Hemmingway-1**, private noncommercial evaluation. If breadth is the chosen question, replace Hemmingway with Goetia v1.3 ARA and preserve its scored thought-prefill as a separate condition. Muse answers a later efficiency/family question. Do not add every reserve candidate.

Before a challenger run, pin model source revision, conversion source revision, weight file SHA256, tokenizer/template/prefill, exact runtime build and architecture support. Metadata in artifact-metadata.json is a publisher claim until downloaded bytes are independently hashed in an authorized task. Current incumbent source identity stays UNVERIFIED. Never claim this is a clean weights-only causal comparison when runtime/quant differ. It can still be a useful deployed-system comparison.

Use one resident model and a serial queue. Stop if unrelated inference is running; do not evict another worker. Record before/after ps, active model digest, input/effective context counts, cache hits, requested/applied settings and failures. Avoid interpreting API request settings as proof the engine honored them. Preserve initial residency; no global parameter changes. Do not unload a preexisting model owned by someone else.

## N2: Executable incumbent screen

The existing six-case/nine-request runner is unrun and already addresses named local gaps. It supplies rune rule transfer/counterfactual, workshop dependencies, knowledge/social motives, opposed debt premises, three-turn corrections and supported JSON. It has **no game access or model-download route**. Reuse it, rather than repeat earlier audit/story prompts.

From the repo, the following **preparation command** makes zero inference calls:

```sh
python3 docs/research/local-ai-2026-10-14/trial.py --seeds 17 43
```

After explicit trial authorization, run each seed separately so each gets its own ten-minute ceiling and new never-overwritten output folder:

```sh
python3 docs/research/local-ai-2026-10-14/trial.py --run --seeds 17 --out docs/research/local-ai-2026-10-14/round2/trial-s17
python3 docs/research/local-ai-2026-10-14/trial.py --run --seeds 43 --out docs/research/local-ai-2026-10-14/round2/trial-s43
```

These commands are recorded, **not executed**. Runner conditions:8,192 requested context,600 maximum generated tokens/request, temperature0.7, thinking off, native endpoint template, two requested seeds. Nine requests per seed,18 total if complete. Seeds may not be effective or reproducible on this engine. Timeouts180s/request within600s whole-run budget; a timeout records failure and stops. This screen is not a live-chat latency acceptance test and not a filled8K qualification. Its total wall time does not measure first-token latency, physical memory or watts. Interrupted runs must retain every receipt, not restart until a good sample appears.

Validate T06 outputs independently using the current validateDraft and compileDraft, without applying them to gameplay. Record syntax/schema pass separately from unsupported-function prose, actual usefulness and human acceptance. No repairs during the first paired comparison; a separately reported one-repair workflow may follow.

The current runner is deliberately incumbent-only. Do not rename a challenger as qwen3.8 to make it run. Once a challenger and supported endpoint are authorized, give the same visible-case messages to a thin endpoint adapter using that model's native template. This is a small remaining trial setup dependency, not a completed comparison harness or permission to install another stack now.

## N3: Fresh comparison, context and order variants

Before tuning, the next evaluator writes a separate holdout packet and keeps expected checks out of the inference request. Generate from these constraints, not by asking the candidate to write its own answer key:

| Family | Fresh fact/rule variation | Expected property, reviewer only |
|---|---|---|
| Rule transfer | Change reed charge to7, start with3 reeds/2 loops, one reusable loop and one consumed loop; then reverse only the consumed rule | Feasible simultaneous and sequential plans follow the changed supply law; no invented recharge or stacking |
| Dependencies | Change bottleneck to two jobs sharing a unique tool, with prerequisite output from one job; vary initial coins so one otherwise valid plan becomes unfunded | Distinguish resource feasibility, ordering and earliest finish; alternative can be defer/decline |
| Social knowledge | Swap which adult observed absence and which heard a rumor; remove one speaker's jurisdiction and reverse who owes whom a favor | Facts/claims/motives remain separately attributed; no permission appears because the voice sounds confident |
| Opposed invention | Debt transfer is voluntary vs automatic; third premise forbids transfer and challenges both | Distinct lawful consequences, strong dissent, usable verbs and costs; labelled missing mechanics welcome |
| Corrections | Correct a name, duration and tonight-only quiet preference; later explicitly revoke one preference and ask what expired | Retains correction, honors scope/expiry and does not store the rejected earlier value as current |
| Draft | Different material/product premise with unsupported tempting function in the request | Emits supported14 fields or labels unsupported extension separately; does not promise absent healing/information mechanics |

Use two independently worded variants per family, seeds17/43, both models:48 case runs; with the same nine-request turn structure this is72 requests, not48. To keep the initial trial small, first run one fresh variant per family:24 case runs/36 requests. Expand only for close results or a named failure. Holdout variants exposed by this document are design templates, not contamination-free final prompts; write exact new instances later and lock their hashes before running.

For actual context tests, do not mistake num_ctx for input use. Start with an8K envelope: reserve1,024 tokens for output/template headroom, input<=7,168 tokenizer tokens. For a4K condition reserve768, input<=3,328. Keep relevant facts equal. Add a fixed hashed distractor corpus to reach targets within5%; verify actual endpoint prompt tokens and truncation. Stop/mark unqualified if native tokenizer accounting is unavailable. Place the same decisive fact near start versus end, counterbalance model/condition order, and record cache state. Test16K only if8K exposes a useful retrieval/context gap. Do not fill context merely to make a benchmark larger.

First compare thinking off under600 total generated tokens. If a reasoning task fails, add a separate thinking condition with the **same total budget** and record reasoning/final tokens. A matched-final-answer-budget follow-up can test whether extra compute buys useful correctness; report extra time. Use each model's native control syntax. A local endpoint ignoring an effort field is an unsupported condition, not a low-effort result.

## N4: Blind review and stop rules

Randomize candidate labels and left/right order; keep raw results plus a separate identity key. Weibao sees the complete original candidate before an edited version. A reviewer logs semantic defects before prose preference. Do not remove errors, empty results, refusals, truncations or queue failures from the denominator.

| Metric | Record |
|---|---|
| M1 Taste/effort | Blind preference, accepted/rejected, editing minutes and actual edits; one unaided draft estimates baseline effort |
| M2 Semantic integrity | Closed-fact violations, invented authority, missing uncertainty, failed corrections, player-action/knowledge leakage; any critical error blocks admission of that candidate |
| M3 Creative/playable value | Distinct accepted ideas, causal chain, usable alternative, real or explicitly missing consumer, preserved agency |
| M4 Breadth | Unnecessary refusal, sanitizing, sycophancy, cliché, strong opposing argument; do not collapse these into one refusal score |
| M5 Operational yield | Accepted outputs divided by all inference-plus-review minutes, including failed attempts; cold/warm latency, actual tokens, timeout/error counts separately |

Proposed screen gate: at least one useful site and one scene accepted with no critical semantic error, less editing burden than unaided drafting, no unexplained repeated correction failure. Small samples establish their cases only. If tied, retain incumbent and expand the fresh cases that could change the choice. Human preference is authoritative for taste; schema validation cannot supply it. Any new model acquisition remains a separate decision.

## N5: Memory and speech are separate acceptance tests

Use synthetic records only. Compare recent-turn replay, lossy summary and source-linked retrieval with equal relevant facts. Inspect a proposed memory before acceptance. Correct one fact, delete another, expire a tonight-only preference, restart the selected application with fresh chat context, then ask both directly and indirectly after distractors. Verify current retrieval excludes superseded/deleted facts in summary, journal, embedding/cache and generated reply. No memory implementation currently exists in this trial, so restart acceptance is **OPEN**, not something a prompt replay can pass.

Later voice trial: measure STT error, first audible latency, barge-in cancel, late-audio suppression and speech under a queued background draft separately. Keep a transcript, mute and complete offline fallback. No speech install/run is authorized here. Persistent personal memory or screen-derived commitments would require extending the planning owner's accepted narrow Ghost phase explicitly.

Technical integration, if later selected, ends only after rebuilt desktop gathering→work→use and Save/reload/export/literal-file import retain the exact chosen artifact with model unavailable. The present research ends with a reviewable plan, not gameplay.
