# Completed website response

Conversation: https://chatgpt.com/c/6acfe2b2-dffc-83ea-958b-033b09e2850f

Captured UTC: 2026-10-14T20:22:40.481Z

Mode: ordinary Chat; default High, 3 of 5; underlying model identity not established. Account confirmed by user. UI: Response complete; Worked for 4m 28s.

Full rendered-text capture follows. Original response HTML and exact hyperlinks are retained alongside this file.

YAIR local-model research and trial decision

Research cutoff: October 14, 2026 · Hardware: M5 Pro MacBook Pro, 64 GB unified memory · External discovery only

Executive decision

Retain Qwen3.8-27B as the reasoning baseline. Trial Hemmingway-1 and Goetia v1.3 as the next two distinct outcome challengers, subject to verified runnable artifacts. Keep Muse Glimmer as the first alternate if a challenger cannot be run reproducibly or if the immediate priority changes to compact, efficient creative generation.

This is a trial allocation, not a claim that either challenger is more intelligent.

The two challengers test different uncertainties:

Hemmingway-1: Can a writing-specific fine-tune of the incumbent produce more acceptable original-world scenes, believable dialogue and character motivations without losing causal coherence?

Goetia v1.3 Absolute-Heretic-ARA: Can a distinct Gemma-family roleplay/creative model produce genuinely different social, institutional and morally opposed possibilities, without sacrificing consistency, factual boundaries or playable usefulness?

Qwen remains the control for unfamiliar rule learning, dependency reasoning, factual discipline and structured proposals. Neither challenger replaces it based on writing rankings.

The ranking above is a proposed YAIR experiment, not an observed local result. Later sections distinguish validated source facts from hardware, format and task-performance uncertainties.

1. Corrections established by source verification

Issue

	

Revised conclusion




Incumbent generation

	

Qwen3.8-27B, not Qwen3.6-27B. Its publisher explicitly identifies a 27B dense model, native vision-language capability and configurable thinking.




Qwen versus Muse

	

Current evidence favors Qwen as the stronger general reasoning and agentic baseline. The older preference for Muse on hard planning is unsupported.




AI benchmark comparisons

	

The publisher's evaluation settings and Artificial Analysis's different reasoning efforts prevent treating score differences as equal-compute, equal-runtime comparisons.




Writing scores

	

Hemmingway's writing strength is a legitimate reason to evaluate it, not proof of better YAIR scenes, gameplay or multi-turn relationships.




Local feasibility

	

The installed Qwen performance observations belong to one local artifact and configuration, not every 27B model or quantization.




Implementation authority

	

Model-generated game content remains proposals. Existing editor, schema-2 staging and native simulation boundaries remain authoritative.

Verified publisher comparison

Qwen's 
official model card
 reports the following:

Benchmark

	

Qwen3.8-27B

	

Muse Glimmer-30B




Terminal-Bench 2.1

	

73.0

	

51.7




SWE-bench Pro

	

61.7

	

51.2




IFBench

	

79.5

	

77.0




GPQA Diamond

	

89.2

	

83.5




Humanity's Last Exam

	

30.8

	

22.0

The publisher specifies that its SWE-bench Pro comparison used the Claude Code harness, temperature 1.0, top-p 0.95 and 256K context, with problematic tasks corrected and baselines reevaluated. These are publisher-reported, harness-dependent results, not independently established YAIR performance. 
Hugging Face
+1

They support keeping Qwen as the planning baseline. They do not establish an equivalent advantage in narrative invention, character relationships or local efficiency.

Independent comparisons change the interpretation, not the baseline

Artificial Analysis reports the following for Qwen3.8-27B at xhigh reasoning versus Muse Glimmer at high:

Independent evaluation

	

Qwen

	

Muse




Intelligence Index v4.3.2

	

34

	

17




AutomationBench-AA

	

48%

	

7%




AA-LCR v1.1

	

82%

	

83%




Average output tokens per index task

	

~67,000

	

~14,000

Source: 
Artificial Analysis comparison and methodology
. 
Artificial Analysis
+1

Interpretation: Qwen shows a substantial measured advantage in that agentic evaluation, but consumes considerably more output tokens. The comparison does not mean twice the intelligence, equal compute, or five times the local inference time in every task. The near tie in long-context retrieval is also worth retaining rather than obscuring.

A smaller independently conducted, reproducible comparison of Qwen3.6, Qwen3.8 and Muse used 11 unique prompts across four categories, with 38 common successful evaluation instances.

Its deterministic checks favored Muse at 78.3%, against Qwen3.8's 69.6%. Its blind pairwise judge strongly favored Qwen3.8. The authors restricted scoring to successfully generated common instances, and the differing FP8 conversion recipes, small samples and output lengths constrain generalization. This is a useful warning about measurement disagreement, not a statistically established Muse advantage in YAIR rule following. 
GitHub
+1

Primary evidence: 
Reproducible local comparison, scripts and raw evidence
.

The current EQ-Bench Creative Writing v3 methodology evaluates 32 prompts over three iterations, using a rubric, pairwise model judgments and Glicko-style ratings. Its authors explicitly caution about subjective taste, length bias and the fact that this is not a multi-turn roleplay evaluation. 
eqbench.com
+1

Consequently, reported writing ratings of Hemmingway 1906.4, Muse 1798.3 and Qwen3.8 1671.3 are relevant screening signals, not probabilities of acceptance. The supplied values should be retained with the benchmark version and raw leaderboard snapshot; the publicly accessible GitHub file view did not expose its underlying rows for independent numeric verification in this research session.

2. Model shortlist: retain, trial, park or skip

The pinned revisions below are supplied research identifiers, not locally verified weight hashes. The repository identities and stated licenses were checked against their public model cards. Exact historical commits still need manifest-level verification before a future run.

Candidate

	

Decision

	

Evidence and tradeoff




Qwen3.8-27B

	

Retain

	

Strongest supported general planning control; existing local speed and thinking-budget failures remain relevant. Apache 2.0.




Hemmingway-1

	

Trial 1

	

Same Qwen family, writing-focused fine-tune. Promising for dialogue and original scenes; publisher acknowledges weaknesses in hostile storytelling and long turns. CC BY-NC 4.0.




Goetia-26B-A4B-v1.3-Absolute-Heretic-ARA

	

Trial 2

	

Distinct Gemma 4 MoE lineage, deliberate roleplay/creative adaptation and reduced-refusal training. Major uncertainties: causal discipline, prompt format and local runtime.




Muse Glimmer 30B

	

Park, first alternate

	

Official quantized local artifacts, credible general capabilities and independent comparison. Not currently the stronger hard-planning recommendation. Apache 2.0.




Goetia v1.7

	

Park

	

Newer creative merge, not an automatically better v1.3. Card confirms this variant was not Heretic-ablated.




Hemmingway-1-Heretic

	

Park

	

More refusal-oriented experiment. No evidence that it inherits the parent's writing results. Same non-commercial restriction.




Qwen3.8-27B-Humanlike-Chat 2.0

	

Park, companion challenger

	

Particularly interesting for short, conversational dialogue, with creator-reported multi-turn and instruction tests. Fine-tuned from an abliterated base, not a demonstrated upgrade of official Qwen reasoning.




Pantheon-Reasoning-26B-A4B-1.1-V2

	

Park

	

Tests reasoning-informed character writing, but the creator explicitly calls quality testing limited.




Qwen3.5-9B

	

Park for low-latency companion

	

Real, documented model; useful to test only when per-turn latency, concurrency or footprint is the bottleneck. Not a substitute for the 27B planner without evidence.




Storymaxxed3, GemStrike, other abliterated Qwen variants, Bonsai low-bit builds

	

Defer screening

	

Keep the search open, but require a specific version, license, runnable format and missing capability that the current shortlist does not cover.

Sources: official model cards for 
Hemmingway
, 
Goetia v1.3
, 
Muse
, 
Humanlike Chat
, 
Pantheon
. 
Hugging Face
+4

Important model-specific qualifications

Hemmingway. The creator's CommunicationBench, Human-Likeness and StoryBench comparisons are publisher experiments. Blind ordering is useful methodology, but the creator designed the tasks. Its own model card concedes problems with hostile storytelling and long story turns, making those mandatory trial cases rather than presumed strengths. A non-commercial research evaluation may be permitted under the published license, but subsequent commercial use of the weights requires separate consideration. Outputs and underlying licensed artifacts require separate rights review. 
Hugging Face
+1

Goetia. The exact v1.3 ARA card describes a Gemma 4-derived merge modified using Arbitrary-Rank Ablation. The creator reports 3 refusals in 100 tested prompts versus 100/100 for the pre-ablation model, with KL divergence 0.0309. This is a narrow refusal-related experiment, not a YAIR reasoning benchmark. The architecture remains a roughly 26B-total-parameter MoE class; approximately 4B active parameters do not mean 4B resident weights or 4B-model capability. 
Hugging Face
+1

The supplied UGI writing values, 47.87 under thought-prefill and 40.86 with the ordinary template, remain provisional external screening observations: I could not independently retrieve the underlying CSV rows. Even accepted as reported, those are specific filtered evaluation conditions, not a universal writing ranking. The newer 
v1.7
 is a different merge without demonstrated inherited scores. 
Hugging Face

Humanlike Chat. The current 2.0 card reports improvements in conversational naturalness and some instruction tests, but identifies its baseline as Huihui's abliterated Qwen. The card's reported MMLU-Pro sample also declines from 78.5 to 72.5 across that base-to-tune comparison. These aren't independently validated improvements over official Qwen3.8. Its 30-turn creator tests justify companion screening, not durable memory claims. 
Hugging Face

Exact revision targets

RESEARCH PINS · FULL WEIGHT-COMMIT IDENTITIES TO CONFIRM

Hemmingway-1

1a5f363a3dd2d1cc456c28b8abbb403b9555efaf

Copy

Hemmingway-1-Heretic

84487de59996d26851c6cc7e29a15be07b1327e7

Copy

Goetia v1.3 ARA

7ae646b5517bb7e65467e43815718637030a9823

Copy

Goetia v1.7

6c64da6e4c3da5df592e2fb6ac962ae1a9294468

Copy

Muse Glimmer BF16

a4e59da52a7bc87ae7251dd5545c0dd437c44b68

Copy

Muse Glimmer GGUF

70bf1b61ac09f91b24d39038091b41c582bc5d7a

Copy

Humanlike Chat GGUF

469ff8f61f6b27d00ec9c30e80dff5778a519672

Copy

Pantheon Reasoning V2

6af1278a92223c717ccea671e4571a5cc135f5d8

Copy

These pins alone are not sufficient: record the quantized artifact's own commit, filename, SHA-256, tokenizer, chat template and provenance to upstream weights. Do not assume a quantization or derivative inherits the source's benchmark score or license metadata correctly.

3. Which models fit the actual roles?

This table describes proposed input/output contracts. Costs and rejection thresholds are trial-design recommendations, not measured model performance.

Role

	

Candidate and concrete output

	

Cost and rejection rule




Original-world author and storylet designer

	

Hemmingway vs Goetia. Given a canon excerpt and an observed mine-stock shortage, propose two distinct incidents with causes, consequences and scene text.

	

600 output tokens; up to 3 review minutes. Reject invented game effects, contradictory history or generic scenes requiring wholesale rewriting.




Opposed-perspective idea explorer

	

Goetia vs Qwen. Given a debt-magic institution, argue both that debt is transferable property and that it cannot be owned, including uncomfortable consequences of each.

	

500 tokens; 2 review minutes. Reject caricature, automatic reconciliation, empty disagreement or unsupported moral conclusions.




Plot and dependency planner

	

Qwen control; Goetia challenger. Return a dependency sequence in which one worker, limited coal and competing construction tasks must be conserved.

	

768 tokens; 3 review minutes. Reject any unavailable resources, broken prerequisites or unearned effects.




NPC relationship dialogue

	

Hemmingway first, Goetia second. A resentful quartermaster needs medicine but refuses to forgive the player. Generate dialogue with a concrete demand and independently motivated refusal.

	

350 tokens; 2 review minutes. Reject sudden forgiveness, implausible agency or revealing unknown off-screen events.




Character goal proposer

	

Goetia first, Qwen verifier. Propose three distinct ambitions for a craftsperson facing loss of status, identifying what each wants, risks and can actually attempt.

	

450 tokens; 2 review minutes. Reject purely decorative motives, impossible actions or three synonyms for the same goal.




Contextual lore assistant

	

Qwen first. Given three source fragments and one rumor, explain known facts, deductions, speculation and unanswered questions separately.

	

350 tokens; 1 review minute. Reject invented source authority or presentation of rumor as confirmed history.




Inspectable-memory desktop companion

	

Qwen control; Humanlike Chat later. Given an explicitly approved memory entry and a subsequent correction, respond using the corrected preference without reviving superseded facts.

	

200 tokens/turn; 4-turn sequence. Reject unauthorized memory writes, false recall, correction reversal or ungrounded commitments.




Optional narrative director

	

Qwen planner with Hemmingway or Goetia as proposer. Given a valid event snapshot, suggest a scene beat and two materially different consequences for human approval.

	

Two bounded generation passes, up to 900 total output tokens. Reject if added orchestration and review cost produces no more accepted material than one model.

This mapping deliberately does not assign a model every possible task. A deterministic native simulator, existing validator, retrieval function or simple rule often provides a more reliable answer than another inference pass.

Novelty must be compatible with constraints, not suppressed by them. For instance, a character may propose a new communal debt-clearing ritual, an illicit guild arrangement, or a previously unimagined social obligation. These are valuable potential mechanics. They should survive in a proposal record even when the current game has no native consumer for them. They do not become actual currency transfers, magical effects or new relationship state merely because their narrative is plausible.

4. Reduced refusal: useful creative breadth or misleading advantage?

The strongest reason to evaluate a reduced-refusal model is not simply that it will generate darker prose. It is that it might explore institutionally coherent perspectives that an assistant trained to avoid conflict tends to flatten.

A good YAIR model should be able to portray a betrayer who has persuasive reasons, a villain who behaves rationally under unfamiliar incentives, incompatible religious or political institutions that cannot both be vindicated, and ethically uncomfortable systems of debt, labor, authority or exchange. It should not automatically sanitize the conflict, flatter the player or make every antagonist secretly sympathetic.

There are four different possible outcomes worth measuring:

Outcome

	

What it means




More content permitted

	

The model answers an otherwise refused fictional prompt.




More expressive breadth

	

It proposes genuinely different and defensible moral, social or institutional arrangements.




Better roleplay

	

It maintains independent character motives and behavior across changing circumstances.




Better game material

	

Its proposal is novel, coherent, causally playable and accepted with manageable editing.

Only the last is sufficient evidence to promote a YAIR game-authoring model.

The supplied stock-Qwen audit already establishes that benign adult betrayal and political disagreement were answered. Therefore refusal is not currently a proven bottleneck. Goetia's ablation provides a reason to investigate difficult fictional cases, not a reason to presume superior ethical reasoning or agency.

A useful challenge: present two mutually incompatible, equally elaborate premises in randomized order. Ask the model to develop the best argument for each, identify what would falsify its assumptions, and propose downstream consequences without resolving the conflict. Score unsupported assertions, sycophantic agreement, repeated clichés, refusal, and actual conceptual diversity separately.

This also prevents a fine-tune optimized for provocative material from winning merely because it sounds less restrained.

5. Existing mechanisms worth adapting

The strongest opportunities are retrieval, reviewability and explicit state ownership, not a wholesale companion framework.

Existing source mechanism

	

Documented evidence

	

YAIR or companion adaptation




SillyTavern World Info

	

Keyword/condition-triggered lore insertion, context scopes and budgets. Does not guarantee correct model use of injected lore. 
GitHub

	

Adapt soon: source-linked, token-budgeted retrieval from canon and player-known observations, with an inspector showing exactly what was included.




Letta memory blocks

	

Described mutable blocks and read-only blocks; agent write permission can be constrained. 
Letta Docs

	

Adapt selectively: immutable canon versus explicitly editable companion memory, visible provenance and correction operations.




Miru

	

Readable Markdown memory, journal, separate Vision/Chat/Memory tiers, and a model-provider abstraction are documented by its creator. 
GitHub

	

Study and selectively adapt: inspectable memory slots, retention and compaction records. Do not import automatic screen-derived promises into Ghost.




Open-LLM-VTuber

	

Voice interruption, chat persistence, desktop avatars and multiple inference backends are documented. 
GitHub

	

Park for companion UX: voice interruption and audiovisual separation are worthwhile, but not first-priority game architecture.




AIRI

	

Broad companion/voice architecture; Alaya memory remains labeled work-in-progress. 
GitHub

	

Park: useful design reference, not evidence of completed durable-memory behavior.




llama.cpp GBNF and JSON Schema

	

Constrained JSON generation with documented schema-subset limitations. 
GitHub

	

Adapt when runtime-qualified: improve syntax reliability for the existing site editor or proposal format; retain semantic validation.

A newly identified documentation conflict

The current Open-LLM-VTuber README still describes long-term memory as temporarily removed. However, its 
release history
 lists an August 2026 v1.2.0 release introducing Letta-based long-term memory, with a subsequent v1.2.1 fix release. 
GitHub

The correct October 14 assessment is therefore conflicting README and release documentation, not a categorical claim that no memory implementation exists. The release is source evidence for implementation; actual correction, deletion and restart guarantees remain untested here.

Similarly, Miru's readable memory and source-level slot operations are useful, but not proof that every inferred fact is correct, deleted facts disappear from all summaries, or memory compaction preserves the intended meaning. The supplied earlier inspection at cbea20b436a255e3cd26d952aaf952c003990b65 should be kept distinct from the current repository state. The curator's removal of the former atomic-fact pipeline must not be ignored in any future implementation comparison.

Priority among mechanisms

Now: source-ranked canon retrieval, an evidence inspector, bounded proposal generation, deterministic validation and human acceptance records.

Later if justified: source-linked correction and deletion, prioritized shared inference queues, task-specific effort routing and model tiers, speech interruption and transcript management.

Not established or authorized: autonomous scene publication, persistent screen-derived commitments, a general live LLM-to-game pipeline, or an agent that edits canon and simulation state without the existing approval and native admission process.

An inference queue would have a concrete purpose on a unified-memory laptop: prevent simultaneous 26–30B model loads from competing with the game, companion and normal desktop workload. It should eventually expose load time, queue delay, per-request cost and cancellation. That is a proposed scheduling mechanism, not something proven in the existing endpoint.

6. M5 Pro feasibility and runtime constraints

The 64 GB Mac is credible hardware for evaluating these models one at a time, but memory capacity alone cannot establish successful loading, performance or stability.

Configuration

	

Evidence

	

What remains unknown




Installed Qwen3.8-27B, NVFP4/MLX

	

Supplied measurements: 18.17 GB stored, 19–29 GB process footprint, 12–24 generated tokens/s

	

Exact upstream identity, reproducibility after reload, true 4K/8K behavior, thermal variation




Hemmingway-1

	

Its publisher distributes full 27B weights and documents Qwen-family ancestry

	

Exact suitable MLX or GGUF quantization, conversion quality, memory and working chat template




Goetia v1.3 ARA

	

Gemma 4 MoE lineage; llama.cpp contains a dedicated Gemma 4 implementation

	

Exact quantized artifact identity, useful Mac throughput, template/prefill compatibility, semantic impact of ablation




Muse Glimmer

	

Official GGUF 4-bit builds, including a documented 16.8 GB Q4_K_M variant, with llama.cpp support

	

Actual M5 performance, model-plus-cache footprint and whether its alternate runtime is worth maintaining

Official Muse sources specify llama.cpp build b10353 or newer for the GGUF architecture, and a dedicated MLX implementation also exists from PipeNetwork. These make Muse comparatively well documented for local runtime exploration, but they do not establish compatibility with the already installed MLX endpoint. 
meta-models/Muse-Glimmer-30B-GGUF at main
+3

Direct references: 
Official Muse GGUF
 · 
Dedicated Muse MLX runtime
 · 
Gemma 4 implementation
.

Three hardware conclusions matter:

Stored size is not resident size. KV cache, temporary allocations, runtime architecture, quantized tensors and other processes all affect the usable memory ceiling.

Do not assume 64 GB enables three concurrently loaded models. A shared inference queue is a better future hypothesis than permanent multi-model residency.

Reasoning mode materially affects usefulness. The incumbent's 156-second reasoning-only response is a failure for the measured interaction, even if a substantially larger thinking budget might solve a benchmark task.

The previously measured whole-Mac power figures must remain labeled as system power, not model-only wattage. Context also remains unqualified: 431 actual input tokens do not establish a 4K trial.

The Qwen publisher additionally reports OSWorld-Verified at 84.3 versus Muse's 65.9, corroborating its general agentic advantage in another publisher-reported, harness-dependent setting. This is not evidence that local screenshot processing is already available through the user's installed artifact. 
Hugging Face

7. Highest-value next YAIR slice

A canon-grounded, single-site causal incident with a reviewable storylet proposal offers the best near-term connection between this research and an existing consumer.

Consider a workshop in the first realm. One paid worker can either gather material for repairs or maintain the site's active production. A supplier demands immediate payment. An NPC believes the shortage is deliberate, but the player has only heard a rumor.

The offline authoring trial asks for a scene with one observed consequence and two meaningfully different choices. It must distinguish the verified stock shortage from the unverified accusation and preserve the actual resource rules.

The proposed path is:

Existing native state and player-known facts

Canon, observed stocks, legal actions, event evidence

Scoped, inspectable context packet

Source IDs, observed versus rumored, explicit constraints

Offline model proposals

Distinct causes, motives, scene text, possible mechanics

Semantic review and human selection

Reject unsupported effects; retain promising inventions as proposals

Existing admitted editor / scene / Ink consumer

Only supported fields and explicitly admitted native effects

Immutable accepted artifact and native verification

No model-generated state mutation

This is a proposed workflow, not a claim that all six stages are implemented.

The one-site editor's 14-field validator cannot accept arbitrary quests, NPC memories, magic rules or effects. Its site/material/product/work descriptions, stock scalars, durations and coin pay remain the actual contract. The separate schema-2 compiler admits only specific definitions through native staging. Frozen native occurrence terms and deterministic settlement retain authority over resource changes.

A failed model proposal can still be valuable as a new-mechanic idea, but that idea must not silently become a native rule.

This slice also protects the existing release priorities: canon first, desktop/laptop first, one realm, one prestige milestone. It creates no automatic reason to build a general P15 compiler, generic lint CLI or new live narrative engine.

8. Next meaningful-outcome trial protocol

Specified protocol for a future authorized local run. No testing, downloading or execution occurred in this research.

A. Before any model run

Record the actual model artifact's upstream revision, quantized revision, file hashes, architecture, tokenizer, chat template, relevant system prompt, think-prefix/prefill and endpoint build.

Use the existing Qwen artifact as the baseline only after its precise identity is confirmed. If a challenger needs an entirely different runtime, treat runtime qualification as a separate cost rather than attributing all performance differences to the weights.

For each model report cold load, warm response, generated and reasoning tokens, end-to-end time, peak physical footprint and run errors. Preserve crashes, empty results and budget exhaustion. No successful-generation-only filtering without also reporting the excluded failures.

B. Screening set

Use the two existing unrun screening packets rather than merely rewriting equivalent probes. Organize them into six outcome suites:

Suite

	

Required observable result




Unfamiliar rune law

	

Apply a newly supplied rule; then change one rule and identify all affected outcomes without carrying forward the old interpretation




Worker/resource dependencies

	

Allocate the same finite worker and supplies across two valid choices; avoid creating resources or work capacity




Rumor versus knowledge

	

Distinguish verified events, the player's knowledge, NPC beliefs, deductions and speculation




Opposed debt-magic institutions

	

Produce genuinely conflicting yet coherent ethics, incentives and power arrangements




Companion corrections

	

Retain a correction across multiple turns, then restart from explicitly persisted authorized memory




Existing site-schema output

	

Produce supported fields, parseable structure and a semantically valid site draft without invented keys

Each suite should include an objective pass/fail portion and a separately judged usefulness portion.

C. Proposed fixed budgets

Condition

	

Budget




Short task input

	

Maximum 1,024 actual tokenizer-counted input tokens




Context trials

	

Filled 4,096 and 8,192 actual input tokens, separately reported




Generation cap

	

768 total output tokens per response, counting exposed reasoning where the runtime reports it




Fast creative mode

	

Thinking disabled where supported




Reasoning comparison

	

One documented bounded-effort mode; target at most 384 reasoning tokens where independently configurable




Replication

	

Three fixed seeds: 11, 29, 47




Initial screening

	

Six suites × three models × three seeds: 54 task instances, with multi-turn sequences treated and costed as sequences




Human scoring

	

Blind model labels, randomized presentation order and explicitly recorded review time

These are proposed trial budgets, not a claim that current endpoint 0.40.3 supports every parameter identically.

Where the runtime cannot separate reasoning from answer caps, record the difference and do not silently grant extra generation. A response that spends its entire cap thinking and never provides an answer remains a failed outcome.

Do not repeatedly retry a stopped model until a desirable response appears. The first configured generation is the scored result; additional diagnostic runs are separate evidence.

The 4K/8K tests must count the actual rendered prompt after chat templating, not labels or a large advertised context setting. Include relevant but distracting source material so retrieval and instruction selection are truly stressed.

D. Fresh held-out changes

Lock the screening rubric before creating or revealing the final held-out variants. Reuse the evaluation structure, not the exact old facts.

Examples of changes that distinguish robust causal understanding from memorized wording:

Reverse which rune can transfer an obligation.

Change a resource from reusable to consumed.

Make the worker unavailable during one previously possible step.

Move an event from observed history into unconfirmed rumor.

Correct an NPC's motive after the first two dialogue turns.

Replace a debt system based on ownership with one based on witnessed obligation.

Ask for the consequence of the change, not a complete paraphrase of the entire scenario.

For order sensitivity, present constraints and source excerpts in reversed arrangements; counterbalance opposed premises and blind A/B model order. Keep the objective rules equivalent where appropriate.

A contamination-free certificate is impossible. Success on these fresh tasks would establish only bounded performance on this test distribution.

E. Correction and restart checks

The companion suite needs separate conditions:

Initial fact is supplied in context.

User explicitly corrects that fact.

A distracting topic intervenes.

A later answer requires the corrected fact.

The session restarts, receiving only the explicitly retained memory artifact.

The user deletes or revokes the fact; a new restart must not use the revoked entry from the authorized memory store.

Compare a full-transcript replay against a curated-memory replay so apparent retention is not misidentified as durable storage.

Model recall and memory-system correctness are separate variables. A model cannot guarantee deletion if the old information is still in retrieved summaries, caches, journals or the prompt. Inspect the sources included in each restarted context before assigning blame or success.

F. Scoring and rejection

Use three outcome classes:

Class

	

Scoring approach




Hard semantic correctness

	

Pass/fail for resource conservation, causality, knowledge boundaries, required fields and permitted effects




Human usefulness

	

Blind 0–3 ratings for character agency, conceptual diversity, authentic dialogue, narrative specificity and playable consequence




Operating burden

	

Actual inference time, loading/queue time, review and editing minutes, context/reasoning tokens, failure recovery

Primary metric:

Accepted yield
=
accepted, usable outputs
inference minutes + human review/edit minutes
Accepted yield=
inference minutes + human review/edit minutes
accepted, usable outputs
	​


Count outputs as accepted only when they meet all hard requirements and the reviewer would actually retain the result or a clearly identified substantial portion. An output with vivid prose and an illegal resource effect does not become accepted because the writing was good.

A proposed promotion threshold is at least 25% improvement in accepted yield for the target role, without an increase in serious semantic errors. Treat that as a practical decision rule, not a statistical significance threshold. For canon-critical, state-changing or persistent-memory roles, require successful held-out checks and explicit native validation before considering any promotion.

Record both total accepted outputs and edits required. A model producing one brilliant passage after many failed samples may still be worse for sustained authoring.

9. Unresolved gates and research boundaries

Gap

	

Why it matters

	

Required later evidence




Installed Qwen provenance

	

Cannot attribute observed performance to the claimed upstream revision with certainty

	

Exact model and quant manifest, hashes and tokenizer identity




Challengers' Mac runtimes

	

A public model card does not prove stable M5 inference

	

Successful exact-artifact load, native template, footprint and output inspection




Thinking fairness

	

Qwen and Muse can receive different reasoning effort

	

Separate equal-budget and recommended-effort comparisons




Long-context usefulness

	

Neither 4K nor 8K local performance is established

	

Actual filled contexts, retrieval probes and measured generation




Creative rankings

	

Writing judges have taste and length biases

	

Blind YAIR-specific acceptance and editing records




Goetia UGI CSV

	

Exact reported scores were not independently retrieved

	

Pinned CSV, filters, tested revision, template and prefills




Reduced-refusal benefit

	

Stock Qwen already complied with the relevant benign fictional prompts

	

Measured increase in accepted breadth, not only refusal reduction




Companion durability

	

Described memory features do not prove retention, correction or deletion

	

Multi-turn, restart, retrieval, revocation and compaction traces




Native gameplay impact

	

Synthetic rule success does not prove a valid playable consumer

	

Accepted draft, exact supported schema, admitted native effects and observed play outcome

Final disposition

Retain Qwen3.8-27B

For causal planning, unfamiliar rules, resource accounting, source discipline and structured candidate review. Reduce thinking overhead where the task does not justify it.

Trial Hemmingway-1 and Goetia v1.3 ARA

The first tests writing-focused specialization on Qwen; the second tests a distinct architecture, creative training and more difficult institutional perspectives.

Park Muse and companion-specific alternatives

Muse remains the preferred alternate where availability or lower-output-effort considerations justify it. Humanlike Chat and Qwen3.5-9B deserve separate companion-focused latency and conversation trials only after a concrete gap emerges.

Authoritative remaining gate: exact runnable artifact provenance and runtime qualification, followed by the first reproducible local, blind YAIR outcome trial. No benchmark, creator score, reduced-refusal label or synthetic sample authorizes gameplay integration. Any future accepted game content must still pass canon review, the actual supported editor/compiler contract, native deterministic verification and immutable artifact retention.

No models were installed or run, no local files were accessed or edited, and no tasks were created.

## Exact rendered hyperlinks

[official model card](https://huggingface.co/Qwen/Qwen3.8-27B)

[Artificial Analysis comparison and methodology](https://artificialanalysis.ai/models/comparisons/qwen3-8-27b-vs-muse-glimmer)

[Reproducible local comparison, scripts and raw evidence](https://github.com/dakshjain-1616/qwen-3.8-27-B-vs-qwen-3.6-27-B-vs-meta-glimmer-30B)

[Hemmingway](https://huggingface.co/Altworld/Hemmingway-1)

[Goetia v1.3](https://huggingface.co/Naphula/Goetia-26B-A4B-v1.3-Absolute-Heretic-ARA)

[Muse](https://huggingface.co/meta-models/Muse-Glimmer-30B)

[Humanlike Chat](https://huggingface.co/LessThanThreeAI/Qwen3.8-27B-Humanlike-Chat-GGUF)

[Pantheon](https://huggingface.co/Gryphe/Pantheon-Reasoning-26B-A4B-1.1-V2)

[v1.7](https://huggingface.co/Naphula/Goetia-26B-A4B-v1.7)

[SillyTavern World Info](https://docs.sillytavern.app/usage/core-concepts/worldinfo/)

[Letta memory blocks](https://docs.letta.com/v1-sdk/memory/memory-blocks)

[Miru](https://github.com/kiyotakali/Miru)

[Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber)

[AIRI](https://github.com/moeru-ai/airi)

[llama.cpp GBNF and JSON Schema](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)

[release history](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber/releases)

[Official Muse GGUF](https://huggingface.co/meta-models/Muse-Glimmer-30B-GGUF)

[Dedicated Muse MLX runtime](https://github.com/PipeNetwork/muse-glimmer-mlx)

[Gemma 4 implementation](https://github.com/ggml-org/llama.cpp/blob/master/src/models/gemma4.cpp)
