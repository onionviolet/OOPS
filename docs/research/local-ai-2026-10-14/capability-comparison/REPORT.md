# Qwen NVFP4 versus Huihui Q8: local comparison

October 14, 2026. User authorized comparing the two and testing uncensored capabilities, then requested exact inputs/results, the synthetic image and more consequential considerations. **28 local inference requests completed; zero request errors, all stopped normally, zero unexpected thinking output.** This is a bounded capability screen, not statistical proof of superiority. No profiles/defaults, installed binaries, gameplay, saves, commits or pushes changed.

## R1: Why MXFP8 downloaded again, and the correction

The earlier cleanup terminated PID 75330 but left its **launchd KeepAlive job** submitted. `launchctl print gui/501/com.weibao.local-ai-upgrade-20261014` showed `runs = 2`, `last terminating signal = 15`, `properties = keepalive`, and replacement PID 43987. It automatically restarted at 5:30:38 p.m., immediately after the earlier termination. This establishes the cause; it was not a new recommendation or a decision made by this audit.

The earlier statement that the workflow was stopped missed its supervisor. Under Weibao's already-given exact MXFP8 removal authorization, this task **booted out that exact upgrade job**, then verified the job and PID were absent. It did not restart Ollama, delete newly downloaded partial weights, change defaults or cancel Gemma. [Before](worker-before.txt), [stop receipt](worker-stop.json), [operational evidence](operational.json).

Gemma4 31B MLX is now registered, digest `a22a363052da770302019d5afab29bd967f9318e4377bddd297421189ea09d7d`, 19,424,434,885 stored bytes. Its download completed at 6:01 p.m.; no Gemma inference was run here. The worker's status JSON remains historical/stale after bootout, rather than being rewritten to simulate completion. The separate speed-cleanup job was observed waiting for upgrade checks; it was not changed and cannot reach its cleanup branch from the still-downloading status inspected here. No future automatic cleanup acceptance is implied.

The existing finisher had completed only Qwen's tiny arithmetic, schema and fiction checks. Huihui and Gemma were downloaded but its loop waited on MXFP8 before their profile/check stages. Prior speed-worker Qwen scene samples were 27.47 s cold versus 8.40 s warm, with a weak minimum-word checker. Those are separate historical samples, not results from this comparison.

## F1: How the two did

| Test, directly observed | Qwen NVFP4/MLX | Huihui Q8/ggml |
|---|---|---|
| Exact site schema, numbers/materials, existing validator and compiler | **2/2 pass** | **2/2 pass** |
| Scene and correction word ranges | **0/4 pass**: 130,108,133,102 words | **2/4 pass**: 160,96,119,86 words |
| Corrected character name | **2/2 used Talen** | **2/2 used Talen** |
| Respect explicit refusal in correction | Seed 43 reimposed a choice despite the character declining both offers | Both acknowledge refusal, but invent further circumstances |
| Short companion: ≤45 words, admit unknown deadline, no fabricated access/reminder | **2/2 pass** | **2/2 pass** |
| Refusal on eight sampled fiction turns, including corrections | **0/8 refusals observed** | **0/8 refusals observed** |
| Four broader fiction word ranges, 80–110 words | **0/4 pass**: 147,117,134,114 | **0/4 pass**: 138,111,122,117 |
| Requested profanity in two betrayal scenes and religious satire | **0/3 clearly provided** | **0/3 clearly provided** |
| Inert tool call: lookup_item(item_id=reed_mat) | **Pass**, parsed arguments, no invented price | **Pass**, parsed arguments, no invented price |
| Synthetic image: red square left, blue circle right, CODE 731 | **Pass**, code returned without spacing | **Pass**, code and placement correct |

Counts for word ranges use whitespace splitting, the same method across outputs. Refusal and semantic observations were inspected in the full text; no model judged itself. “No refusal” does not mean full instruction compliance. These were legitimate fiction tests: betrayal/threat, opposed political views, invented religious satire, adult non-graphic romance and an unrepentant villain. No universal harmful-prompt score or graphic-content qualification was tested or inferred.

Both invented facts in closed-fact scenes. Qwen seed 17 referred to lost goods despite the warehouse being empty and replaced trust repair with punishments. Seed 43 invented city guards, a ledger and a debt, then reasserted “Choose your consequence, or I choose it for you” after the explicit decline. Huihui invented keys/stolen goods/unpaid dock work, then added a failing-lungs diagnosis and a shipment that night. Its political dialogue opened with the monarchist accusing the opposing speaker of clinging to the Crown. These are grounding/coherence failures, not refusal failures.

Huihui's length advantage in one seed is real for this sample, but does not establish better overall storytelling. Both used familiar melodramatic imagery. The romance outputs leaned on nonverbal consent and “didn't pull away” framing; if clear consent expression is important for a selected scene, ask for an explicit mutual exchange and judge it separately. Prose taste remains Weibao's decision, not a numeric score supplied by this report.

## F2: Actual latency, with consequential limits

| Case: first final text / complete answer, seconds | Qwen seed 17; seed 43 | Huihui seed 17; seed 43 |
|---|---|---|
| Site, first request after each load | 46.16 / 79.55; 19.00 / 31.41 | 139.30 / 187.39; 43.77 / 72.62 |
| Scene | 3.89 / 59.21; 1.19 / 13.72 | 9.39 / 92.64; 2.85 / 53.25 |
| Correction, history reused | 2.53 / 75.84; 0.86 / 12.81 | 2.13 / 53.36; 3.84 / 40.94 |
| Companion | 4.58 / 24.66; 0.78 / 3.51 | 7.21 / 21.79; 8.39 / 25.02 |

The Mac was actively used: several Chrome renderers consumed about one CPU core each, and one memory sample while Huihui was loaded reported 19% free. No foreground applications were stopped, and no thermal/power controls changed. Order was reversed for seed 43, but **this did not isolate time-varying desktop load, disk cache, temperature or memory pressure**. Requests after runner unload are cold runner loads, not necessarily cold disk-cache loads. The larger package is a plausible loading cost, but exact causal attribution was not measured.

The very large improvement in Qwen's second block prevents a clean headline speed ranking. It supports keeping a light, available baseline and measuring under the user's actual load. First-final time, completed-answer time and decode rate remain separate; tool-only requests correctly have no final prose token. All failures would have remained in the denominator; none occurred. No filled-4K recall was tested merely by setting num_ctx=4096. No model-only or whole-Mac energy measurement was made.

## F3: Capability evidence upgraded by these tests

Streaming worked for both. `think:false` produced no thinking in these 28 requests. Both exact artifacts produced accepted site JSON, native parsed tool calls and the simple vision result. Existing source-level claims are now exercised for these specific cases, not universally qualified. Tool calls were **never executed**; no file writes, web requests or game mutations were delegated to the models.

Telemetry also establishes active speculation for both: MLX speculative-decode events for Qwen, and Huihui ggml `draft-mtp` generated/accepted statistics. For example, the Huihui vision event reports 18/40 accepted, while its final runner aggregate reports 357 accepted tokens of 1,392 generated speculative tokens. Those scopes are different; neither proves net speed benefit or justifies changing depth. [Mechanism log excerpts](runtime-mechanism-log.txt). Cancellation, malformed schema recovery, harder OCR, long context and durable memory remain untested.

The **synthetic image** is an original 384×256 test card drawn for this run: red square left, blue circle right, “CODE 731” at the bottom. It contains no screenshot, personal document or source-book material. [Fixture](vision-fixture.png). It tests simple shape/color/position recognition and short text reading. It does not test small text, diagrams, clutter, obscured content, screen understanding or calibrated uncertainty when an image is unreadable.

## D1: Role recommendation

**Keep Qwen NVFP4 as the general baseline. Retain Huihui as an alternate, not a promoted replacement.** Both can draft the supported one-site structure, give a short honest companion reply, call a simulated read-only tool and interpret the basic image. Both need review on closed facts and agency. Huihui showed somewhat better sampled length compliance, but no refusal advantage, clean speed win or consistent semantic improvement that pays for its larger stored footprint.

Use offline authoring with existing validators and human review. Neither fluency nor well-formed JSON authorizes a general live AI-to-game pipeline. [P15 authoring](../../../gm/dispatch/procgen-2026-10-13/p15/AUTHORING_PIPELINE.md), [dialogue](../../../gm/dispatch/procgen-2026-10-13/p15/DIALOGUE.md), [T5 routes](../../../gm/dispatch/research-tech-2026-10-14/t5/LLM_ROUTES.md) and the earlier [capability audit](../capability-audit/REPORT.md) remain the integration references. Canon-first, desktop-first and one playable slice remain accepted direction.

## A1–A4: More to consider, ranked by decision value

- **A1 Grounding and agency:** tune a fact/proposal envelope and explicit agency rules on development examples, then use a fresh held-out scene. Do not tune on these final examples and claim an independent improvement. Closed facts and open invention need different prompts. This is more useful than seeking a nominally more uncensored quant.
- **A2 Human taste:** read the paired output packet before the model-labelled transcript if possible. Judge editing effort and preference separately from factual errors. Having read labelled outputs may bias the same-packet blind vote; use fresh held-out pairs if a strict blind comparison is needed.
- **A3 Responsiveness:** only if companion availability matters, measure one stable-load warm/cold pair, interruption/cancellation and one equal-fact actual 4K/8K history. Keep personal and game contexts separate; prompt cache is not durable memory. No further inference was silently added here.
- **A4 Maintenance:** newly re-created MXFP8 partial blobs remain preserved; the exact upgrade job is unloaded. The waiting speed-cleanup watcher remains separate and unchanged. Reconcile these before any future upgrade workflow. Gemma31B is available for a named different-family quality question, but is not the Gemma26B MoE speed challenger and was not tested here.

No new downloads, runtime migration, screen collection, persistent memory or model-per-tick orchestration is selected. A paid/runtime deployment also needs its own artifact lineage/licence, privacy and native/persistence qualification.

## Evidence, scope and remaining gate

New task-owned comparison directory was absent before creation. Live AGENTS, PROJECT priorities, USER_VISION and shared dirty state were recovered. All source/game owners and unrelated edits were preserved. Existing validateDraft/compileDraft was called against generated data without registering packs or changing game state. Metadata confirms the baseline/retained digests and local launcher default are unchanged; all three installed models remain and `/api/ps` is empty after unloading only the models this test loaded.

[Run settings and starting inventory](initial.json), [all exact requests/responses](results.json), [numeric summary](summary.json), [validator results](validator-results.json), [final inventory/residency](final.json), [runner](run.py). The readable deliverable contains prompts, schemas, conversation histories, full outputs, tool arguments and timing metrics. Generated text is synthetic evaluation material, not canon or playable content.

The selected local screen is complete. **The authoritative selection gate still open is Weibao's blind acceptance of useful writing and editing burden.** No default or deployment change follows automatically from these results.
