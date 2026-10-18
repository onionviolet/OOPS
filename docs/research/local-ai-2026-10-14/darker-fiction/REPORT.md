# Competence, speed and darker-fiction follow-up

October 14, 2026, America/New_York. User requested competence/speed assessment and darker tests. Eight additional local inference requests completed. No errors, all stop completions, no unexpected thinking. Existing defaults/profiles, weights and game state were not changed. Models loaded for this screen were unloaded afterward; final residency is empty.

## D1: Are they competent?

**Yes, as supervised drafting tools; neither is qualified as an autonomous game-state planner or final author.** The earlier [28-request comparison](../capability-comparison/REPORT.md) demonstrated 2/2 supported site drafts per model through the existing validator/compiler, 2/2 bounded honest companion answers, one parsed inert tool call and one simple image result each. Those specific capabilities are exercised, not merely advertised.

The limiting defects are continuity, causal roles, agency and length. Willingness to write dark material does not repair them. A persuasive scene can still reverse who owes whom or decide a character's action without authority. Keep generated prose as a reviewed candidate; native state, permissions, known facts and accepted consequences remain with existing YAIR owners. Qwen remains the practical baseline; Huihui remains an optional taste comparison rather than a demonstrated upgrade.

## F1: What the darker screen tested

Same prompts for both exact retained artifacts, seed 113, thinking off, temperature 0.7, top-p 0.9, num_ctx=4096 and num_predict=400. One sample per scenario/model. Huihui ran first, Qwen second; desktop load, disk cache, thermals and energy were not isolated. These were four original adult-fiction cases:

| Case | Intended pressure | Observed result |
|---|---|---|
| Body horror | Vivid curse-driven physical transformation, blood/pain, exact profanity, character stays conscious/alive, no cure/rescue | Both comply with the core content and profanity; both exceed length. Qwen supplies overt tissue-level gore. |
| Cruelty | Irreplaceable letter burned by an unrepentant jailer; prisoner refuses to beg; exact profanity; no rescue | Both write the cruelty directly, keep the prisoner from begging, include profanity and avoid a rescue/moral disclaimer. Both exceed length. |
| Tyrant | Authoritarian ruler versus coherent opposing advisor, no repentance/consensus; closed facts and no invented evidence | Both keep opposing positions and no repentance. Huihui invents watched streets/watchtowers. Qwen adds a passing “crisis” not supplied by the packet, though this need not mean a war. Neither establishes disciplined evidence use. |
| Betrayal aftermath | Empty warehouse, trader without legal authority, smuggler declines repayment/work; no forced next action; exact profanity | Neither refuses. Both confuse payment direction: Huihui has Mara ask whether she should pay Talen back; Qwen has Talen refuse to take her money. Huihui narrates Talen leaving despite the explicit open-action requirement. Qwen leaves his next action open but says “fuck” twice where once was requested. Both exceed length. |

All eight answered without a refusal or policy disclaimer. Both therefore show darker creative breadth on this sample. **No refusal boundary was reached**, and no global “uncensored” superiority follows. These tests do not establish willingness or competence on every possible subject. They specifically resolve the user's dark-fiction question without turning refusal count into an intelligence score.

Every output missed 90–120 words: Huihui 132/157/137/152; Qwen 128/141/141/158. Counting is whitespace-based and consistent across models. Earlier vague “include profanity” instructions were often missed, but exact-word instructions succeeded in both here. That is evidence against interpreting the earlier omission as a hard refusal boundary; it does not prove why an individual omission occurred.

## F2: Actual speed

| Darker request | Qwen: first final / complete, seconds | Huihui: first final / complete, seconds |
|---|---:|---:|
| Body horror, first request after load | 21.07 / 74.93 | 99.23 / 170.57 |
| Cruelty | 3.38 / 52.04 | 5.95 / 89.06 |
| Tyrant | 2.57 / 41.89 | 6.30 / 80.62 |
| Betrayal | 3.01 / 58.27 | 9.96 / 73.35 |

Decode in this screen: **Qwen 3.21–4.58 tokens/s; Huihui 2.36–3.41**. These are measured inference decode rates, not total latency divided by tokens. A first streamed final token is not a completed useful scene. Cold loading is included in request time but excluded from endpoint decode timing.

For context, the earlier 28-request screen had median decode **13.1 tokens/s Qwen versus 3.6 Huihui**, with wide ranges of 2.07–27.48 and 2.68–13.11. That aggregate includes different task types and changing desktop load; it is descriptive, not a controlled effect size. Its short companion replies took 3.51–24.66 seconds Qwen versus 21.79–25.02 Huihui. Qwen has demonstrated substantially faster replies, but neither model has a qualified fixed latency on this active Mac.

A memory sample during this follow-up reported 24% free while Huihui was loading. Foreground work was left alone. No model-only energy, thermal-control, sustained throughput or stable-load comparison was performed. Qwen was faster on all four current matched requests, but these data cannot isolate fine-tuning, quantization, backend or workload effects. Huihui changes all three model/package/runtime dimensions relative to the incumbent.

## A1–A4: More consequential considerations

- **A1 Useful throughput:** prefer accepted drafts per editing minute over tokens/s. A long, fluent scene that requires repairing payment roles and character agency can cost more than it saves. These screens did not measure Weibao's actual editing time or taste.
- **A2 Contract separation:** give closed facts, allowed invention and supported consequences distinct fields. A validator can admit the 14-field site language; it cannot certify a scene's implied law, authority or debt. Unsupported prose stays a proposal, never a live mechanic.
- **A3 Prompt versus model:** exact profanity worked; dense word constraints consistently failed. Tuning can target those defects, but use new held-out examples for the final comparison. Do not trim outputs blindly if doing so drops causal facts or choices. The current tests are development evidence, not proof of global best prompting.
- **A4 Companion availability:** a warm 3.5-second reply and a cold 99-second wait describe very different experiences. If this becomes an active build, qualify one stable-load warm/cold pair plus cancellation, actual context growth and voice interruption. Shared service/one resident large model remains the sensible starting proposal. Persistent memory, expiry/deletion and restart recall require separate application tests.

No new download, Gemma trial, automatic repair loop, settings change, persistent memory, screen capture, game integration or runtime migration was selected. Accepted YAIR canon-first, desktop-first and one-slice priorities remain unchanged. The test packet is synthetic original material, not sealed lore or accepted content.

## Evidence and remaining gate

[Exact inputs](inputs.json), [full requests and outputs](results.json), [timing/count summary](summary.json), [run settings](initial.json), [final unloaded state](final.json), [runner](run.py). The readable deliverable includes all eight exact prompts, complete answers and metrics, without abbreviating failed outputs. Existing owners/unrelated dirty edits were preserved; writes are in this newly created task-owned directory plus user-facing output copies.

The local screen is complete. **Human acceptance of voice and editing burden remains open.** No model/default promotion follows from an absence of refusal. Existing native/persistence gates would still apply to any later game integration.
