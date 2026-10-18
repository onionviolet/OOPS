# Local AI for YAIR and the desktop companion

2026-10-14, America/New_York. **Research and integration proposal, not accepted game direction.**

The highest-value next slice is an offline original-world author that produces one reviewable, supported authored-site draft plus a separately labelled scene proposal. It can save creative-director time without putting an unqualified model in charge of gameplay. Selection should depend on useful accepted outputs, correction burden and causal understanding. Fluent prose, fewer refusals and public scores answer different questions.

## Authority and scope

Read AGENTS.md, PROJECT.md's standing priorities, USER_VISION, P15 [authoring](../../gm/dispatch/procgen-2026-10-13/p15/AUTHORING_PIPELINE.md), [runtime text](../../gm/dispatch/procgen-2026-10-13/p15/RUNTIME_TEXT.md), [model routes](../../gm/dispatch/procgen-2026-10-13/p15/LLM_OPTIONS.md) and T5 [invention routes](../../gm/dispatch/research-tech-2026-10-14/t5/LLM_ROUTES.md). Those remain the integration owners. This report supplies evidence and recommendations beneath them; it creates no second gameplay specification.

Also read the planning owner, `/Users/weiwei/Documents/Claude/Projects/Weibao's Workspace/plans/06_Projects/Local_AI_Desktop/Local_AI_Research.md`, especially its latest “choose by YAIR outcomes” section. Its six-family packet remains proposed and unrun. Earlier shortlists and benchmark figures are dated evidence, not final selections.

Recovered branch `codex/gameplay-foundations`, HEAD `4f853c24d6b2d06cd5d3c3e145ca9f2db64ad694`, mixed staged/unstaged changes and many untracked receipts. Active Claude/Codex processes exist. P15's session table reserves p15/ to `01a138ac-dc92-7900-81e6-615e99546acb`; T5 reserves t5/ to `01a138c1-23f9-7900-bbc9-d9e23a9ef168`. Neither reservation was assumed released. This chat writes only the previously absent `docs/research/local-ai-2026-10-14/` audit area. Shared owners, gameplay, saves and unrelated edits are untouched. No commit, push, installation, power-policy change or inference run occurred.

Accepted desktop/laptop-first direction, canon-first world order and one playable slice at a time remain in force. This original synthetic evaluation does not promote an original-world release ahead of canon worlds. A future UI slice targets 1366×768 first, with rebuilt browser evidence; mobile optimization remains deferred. Findings and new mechanics below are proposals.

## F1: What the local evidence establishes

Read raw `results.json`, `story_results.json`, `story_context_results.json`, candidate metadata and the existing trial packet in the planning vault's `tmp/local-qwen-bench-2026-10-14/`. Live read-only checks this turn returned server version **0.40.3**, one registered **qwen3.8:27b**, safetensors/NVFP4/MLX, stored size **18,174,721,847 bytes**, digest `47951e4a666180bc2aedfc93c169472f2de783696fe196efbf063f5730ecf163`, and **no loaded models**. This identifies a local artifact, not exact upstream weights. Prior hardware evidence identifies M5 Pro/64 GB; hardware was not remeasured here.

| Observed slice | Saved result | Decision consequence |
|---|---|---|
| Seeded audit | Cold 91.6 s; warm thinking-off 53.8 s, both reached 800-token limit. Low-thinking 54.0 s completed | Can recognize explicit small contracts; truncation and conditional false positives matter |
| Document contradictions | 16.7 s, parseable JSON; four planted contradictions found, one extra weak finding | Useful bounded second reader; not general audit certification |
| Companion | 3.54 s, 36 generated tokens, corrected name supplied in context | Short replies feasible; personality and durable memory untested |
| Dark fiction | 22.4 s, 24.3 generated tokens/s | Benign betrayal was allowed already; output exceeded requested length and lacked requested dialogue |
| NPC voice | 4.33 s, 27.0 tokens/s | Distinct phrasing but invented legal exemption and permission |
| Council argument | 14.6 s, 22.3 tokens/s | Voices named their own blind spots mechanically; narrator simplified positions; length missed |
| Curated dialogue | 15.7 s; only **431 input tokens** | Invented three-day closure and implied wrong NPC authority; does not qualify filled 4K context |
| Contextual code audit | Prior low-thinking attempt used 1,800-token cap/156 s without final answer; thinking-off completed in about 26 s | Reasoning time is a cost, not evidence of better reasoning |

Prior process-footprint readings roughly 19–29 decimal GB include runtime/cache; low RSS missed Metal allocations. Whole-Mac battery readings around 44–52 W warm and near 80 W cold are affected by other work and sensor lag. Neither model-only watts nor long-session battery life is established. Do not repeat these same packets simply to accumulate runs.

## F2: Intelligence means handling the situation

| Capability | Meaningful YAIR check | What success establishes |
|---|---|---|
| Unfamiliar rules | Teach a new rune law in context; distinguish consuming, reusable and nonstacking components | Transfer from supplied rules on that case, rather than recalling franchise lore |
| Counterfactuals | Change a component from reusable to consumed; ask which earlier plans fail and why | Sensitivity to causal changes; holding everything else fixed |
| Dependency planning | Two paid jobs need the same artisan; one unlock supplies another's input | Resource conservation and executable ordering within a small graph |
| Knowledge vs inference | A missing shipment is observed; sabotage is only a rumor | Appropriate uncertainty and attribution; no invented culprit |
| Correction retention | Change a name, refuse a favor, correct a deadline, then distract with another subject | Multi-turn use of corrections, not durable memory unless restored from storage |
| Character/social reasoning | A worker protects a rival's reputation while negotiating a deadline | Coherent motives and plausible subtext without mind-reading or forced player decisions |
| Useful novelty | Ask for several different power-system premises and one concrete consequence each | Distinct, usable ideas after human review; not objective originality or absence of contamination |
| Structured output | Emit only the existing authored-site fields, then validate independently | Format/contract compliance for that adapter; not balance, economic grounding or good fiction |

Separate tasks with **closed facts and open invention**. A strict NPC turn may invent wording and gesture. An offline author can invent a society, mechanic or character motive, marked as proposed, then explain missing consumers. Imposing dialogue restrictions on the idea task would suppress the creativity being evaluated. Conversely, an attractive invention cannot silently revise settled events in a runtime scene.

## O1–O8: Role-to-model shortlist

The ranking is by next experimental value, not global intelligence. Hub revisions below were checked live October 14. No challenger was installed or measured on this Mac.

| Code / disposition | Candidate, pinned source | Best reason to trial | Qualification still needed |
|---|---|---|---|
| O1 Retain baseline | Installed Qwen3.8:27b, local digest above | Available now; bounded reasoning, summaries, authoring and short replies | Exact source identity, semantic discipline, multi-turn and real context load |
| O2 First dialogue challenger | [Altworld/Hemmingway-1](https://huggingface.co/Altworld/Hemmingway-1/tree/1a5f363a3dd2d1cc456c28b8abbb403b9555efaf) | Everyday dialogue/writing specialization and independent writing evidence in saved publisher snapshot | YAIR planning/knowledge tests; exact compatible quant/template; CC BY-NC 4.0 limits commercial weight use |
| O3 First breadth challenger | [Goetia v1.3 Absolute-Heretic-ARA](https://huggingface.co/Naphula/Goetia-26B-A4B-v1.3-Absolute-Heretic-ARA/tree/7ae646b5517bb7e65467e43815718637030a9823) | Different Gemma MoE family, fiction focus; identifiable scored prefill condition in saved UGI data | Exact GGUF/quant, Gemma template and prefill; semantic discipline, loaded headroom, license provenance through merge |
| O4 Planning challenger | [Muse-Glimmer-30B](https://huggingface.co/meta-models/Muse-Glimmer-30B/tree/a4e59da52a7bc87ae7251dd5545c0dd437c44b68), [official GGUF](https://huggingface.co/meta-models/Muse-Glimmer-30B-GGUF/tree/70bf1b61ac09f91b24d39038091b41c582bc5d7a) | Different family with agentic/tool/recovery emphasis; compare dependencies and rule learning | Publisher capability claims need YAIR tests. Current llama.cpp has architecture source; installed MLX endpoint support is unproven |
| O5 Conditional derivative control | [Hemmingway Heretic](https://huggingface.co/darrellbest/Hemmingway-1-Heretic/tree/84487de59996d26851c6cc7e29a15be07b1327e7) | Isolate refusal modification relative to O2 | Does not inherit writing score; publisher's 100-prompt refusal result and small reasoning tests are not broad intelligence proof; same NC issue |
| O6 Low-cost companion trial | [Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B/tree/c202236235762e1c871ad0ccb60c8ee5ba337b9a) | Smaller weight footprint may improve interactive availability | Earlier generation, unmeasured latency/quality/energy; do not invent Qwen3.8-9B/4B successors from naming patterns |
| O7 Specialist reserve | [Storymaxxed3 GGUF](https://huggingface.co/MRockatansky/Gemma-4-31B-Storymaxxed3-GGUF/tree/8ee99652d1d480bb0b485e9f982759512109c43f), [GemStrike](https://huggingface.co/UltimateIntent/GemStrike-31B-GGUF/tree/9897cb04204db5a9e47c19efd5d2b0b0cc262d21) | Story/roleplay challengers if O2/O3 miss voice or extended scenes | Comparative quality unknown; conversion identity, source lineage/template and actual artifact required |
| O8 Modification/new-version reserve | [uncensored Qwen MLX](https://huggingface.co/orcarouter/Qwen3.8-27B-Uncensored-MLX/tree/34c32b5b1b2c24181e121a5cba3df8924fa66bce), [Goetia v1.7](https://huggingface.co/Naphula/Goetia-26B-A4B-v1.7/tree/6c64da6e4c3da5df592e2fb6ac962ae1a9294468) | Existing-family modification control or a newer merge answering a specific gap | v1.7 card says it has not been ablated; it does not inherit v1.3 score. Compatibility and new quality remain untested |

Config files advertise 262,144 positions for Hemmingway/Goetia v1.3/Qwen3.5-9B and 131,072 for Muse. Those are architecture metadata, not usable memory budgets or qualified recall. Initially use 8K request context with actual measured input token counts and output reserve. Higher quant bits, MoE active-parameter counts and available RAM cannot independently predict useful speed. Keep one loaded model until contention measurements justify more.

Hemmingway's source and Heretic cards specify CC BY-NC 4.0. A conversion's Apache label does not supersede upstream terms. Private noncommercial trials, commercial use of weights and rights in generated text are separate questions; no blanket generated-output restriction or clearance is inferred. These license facts should be revisited for a paid runtime decision, not used to block this research.

## U1–U8: Concrete roles, examples and failure costs

| Role | Actual proposed input → useful output | Model route / inference cost | Seam and decisive failure |
|---|---|---|---|
| U1 Offline author | Existing site schema + original floodplain premise → valid gather/work draft, separate scene and unsupported-mechanic notes | O1 vs O2; one bounded draft and at most one repair, cost amortized over play | authored_site compiler; names must not promise native functions the scalar product lacks |
| U2 Idea explorer | Debt-powered magic; opposed premise that debt is communal rather than personal → different societies, exploits, institutions and player verbs | O1 vs O3; longer background output, review dominates | P15/P9 proposal envelope; agreement, cosmetic variants and gratuitous cruelty reduce value |
| U3 Plot/dependency planner | Event prerequisites, actor availability, owned stock and existing functions → DAG, alternatives, aftermath and unsupported leaves | O1 vs O4; 400–600 output tokens initially | T5/P12 plus native scheduler; cyclic bootstraps, doubled ingredients and one worker in two jobs invalidate plan |
| U4 NPC/relationship dialogue | One observed encounter, allowed speech act, speaker knowledge and motive → short utterance/gesture | O1 vs O2/O3; sampled short replies are 3–16 s, not guaranteed | P15/causal scene projection; invented authority, player action or reward makes otherwise good prose unusable |
| U5 Character goal proposer | A craftsman's public constraints plus privately authorized author dossier → goals, obstacles, a conditional plan | O1 vs O4/O3; background planning, not per tick | Existing people/controller owners; model proposes a goal, native actor controller admits supported actions and pays costs |
| U6 Lore assistant | Player-known records and source locators → answer with observed/claimed/inferred/unknown distinctions | O1 first; retrieval plus short explanation | people_knowledge/event_feed; raw global logs or private actor axes must not enter runtime context |
| U7 Desktop companion | Approved activity summary, chosen persona, corrected inspectable memory → optional response and proposed memory update | O1 then O2; O6 only if frequent-use cost is a demonstrated gap | Planning owner; embodiment invention, fabricated promises, unwanted interruptions and mistaken memory are primary costs |
| U8 Optional director | Admitted unresolved tensions + eligible actors/actions/budgets → candidate event or prioritization | O4/O1 reasoning challenger; scheduled background turns | E5/P3/P12/T5; no model tick loop. New events need admission/settlement path; changing past events or manufacturing resources is failure |

Specific extensions worth preserving: a rune designer that proposes mutually exclusive power laws with exploit tests; a relationship rehearsal tool that compares reactions to the same refusal; an alternate-history planner that marks the first causal divergence; a compiler-aware critic naming unsupported mechanics; and a two-premise debate that requires each side to explain what would change its mind. These are new creative proposals, not paraphrase services. Book-world versions must use qualified source cutoffs and original analysis, without raw-source redistribution or sealed-truth exposure.

## F3: What reduced-refusal perspectives can contribute

The incumbent already wrote benign betrayal and conflicting political positions. Refusal removal is therefore not the demonstrated bottleneck in those scenes. The potential benefit is preserving difficult motives: a regent who knowingly chooses exile to preserve office, a healer who rejects an institution's ethics, a village that benefits from an exploit, or a power system whose incentives conflict with compassion. Ask for their strongest reasoning, blind spots and believable consequences without demanding the narrator vindicate them.

Compare stock and modified models on the same legitimate prompts, then compare different families with genuinely opposed premises. Record unnecessary refusal, premature sanitizing, sycophancy, caricature, causal insight and usable ideas separately. More compliance may produce more confident fabrication or edgy clichés; a stock model may supply the stronger disagreement. Ablation cannot introduce knowledge or prove insight. Heretic's reported 0/100 refusals concerns its chosen harmful-prompt set, not YAIR fiction preference or multi-turn competence. [Derivative evidence](https://huggingface.co/darrellbest/Hemmingway-1-Heretic).

Do not optimize a harmful-prompt score to choose this game's creative partner. The useful breadth test uses adult fictional conflicts, opposed institutions and unconventional mechanics with human review. Player agency and character-known facts still bind runtime speech; offline invention has wider latitude.

## F4: Actual consumers and proposed integration

Read source, not just the proposal filenames:

| Existing source | Supported behavior | Integration implication |
|---|---|---|
| [authored_site.js](../../../src/authored_site.js), authored_site_ui.js, main.js | Fourteen allowlisted fields; validateDraft rejects unknown fields/control chars/ranges; compileDraft emits schema-1 optional gather/work pack; saved draft and import/export; registration rollback | Real smallest content route. One site, scalar input/output and coin pay. No NPC cast, arbitrary quest, novel ability or general economic feasibility check |
| [structured_pack_definitions.js](../../../src/structured_pack_definitions.js) | compileStructuredPack validates supported schema-2 definitions/capabilities and registry collisions; explicit native staging separate | There is a structured compiler, but not P15's universal arbitrary batch compiler. Definitions alone create no stock, timer, save or outcome |
| [simulation.js](../../../src/simulation.js), simulation_content.js/contracts.js | Registry contracts, frozen occurrence label/responses/expiry, native response settlement | A reviewed storylet needs valid actual effects and a host, not just an E2-shaped JSON card |
| [people_knowledge.js](../../../src/people_knowledge.js), [event_feed.js](../../../src/event_feed.js) | Player-observed people/accounts; global NPC log deliberately excluded | Reuse read-only player views for lore assistance. They are not a generic NPC self-knowledge projection; that needs the selected owner |
| [causal_story_scenes.js](../../../src/causal_story_scenes.js) | projectVillageScene accepts known accounts and supported scenes | Candidate bounded expression input; reviewed scenes remain authoritative |
| [ink_narrative.js](../../../src/ink_narrative.js) | Revisioned narrative state, request/preview/commit/view and validation | Reuse selected narrative owner's persistence semantics; don't bolt on a second chat-history save owner |

No live LLM adapter, generic pack lint CLI or completed AI-to-game pipeline is established by this inspection. Existing test files are source evidence, not passing gameplay evidence in this audit.

Proposed stages, finish each chosen slice before the next:

1. **A1 Offline draft:** a read-only CLI/service accepts a bounded packet and returns candidate JSON/text plus model/source hashes. Reviewer imports only selected valid authored-site fields through the existing editor on a disposable origin. Optional storylet/new mechanic remains a separate proposal. Gate: one useful accepted draft, unsupported-function rejection, rebuilt 1366×768 play and Save/reload/export/literal import with model offline.
2. **A2 Lore/companion context:** two separate applications share endpoint/queue only. YAIR receives known game records; companion receives approved personal summaries. Proposed memory rows have ID, basis, time, scope, certainty and supersedes reference. Human-inspectable correction/deletion and restart retrieval must work before claiming memory. Existing Phase-1 Ghost collector limits still govern; no new screen collector is authorized.
3. **A3 Optional runtime expression:** generate one selected utterance, complete authored fallback always usable. Freeze received text under occurrence/actor/world/revision/request identity; world/turn changes reject stale responses; timeout/cancel/duplicate response cannot grant effects. Restore exact received text with provider absent. A model cannot reliably validate its own semantic violations; critical commitments remain authored or typed.
4. **A4 Richer director/invention:** propose eligible events or new supported packs. Review/admit through selected native owner, with real costs, scheduler, witness and consequence. Runtime autonomous admission requires a separately verified contract. Save accepted artifacts, not a seed or model URL. Unavailable consumer remains dormant or follows a reviewed migration.

## X1–X6: Reference mechanisms to adapt or trial

| Reference / disposition | Useful mechanism | Cost and acceptance limit |
|---|---|---|
| [SillyTavern World Info](https://docs.sillytavern.app/usage/core-concepts/worldinfo/) / adapt idea | Scoped lorebooks, budgets and inspectable context insertion; useful rehearsal UI | Keyword/similarity activation is relevance, not knowledge permission. Filter audience first. No ST installation or game authority transfer |
| [Letta memory blocks](https://docs.letta.com/v1-sdk/memory/memory-blocks) / borrow pattern, park framework | Named bounded memory blocks distinct from archive; inspectable persona/preferences/current task | For initial companion, SQLite/JSON plus source-linked rows is cheaper than another agent framework. A memory engine does not prove accurate consolidation |
| [llama.cpp grammars](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md) / conditional trial | JSON-schema subset constrains token output | Runtime/build-specific support and performance; schema must also be described to model. Valid JSON does not establish true facts, feasible resources or safe publication |
| [llama.cpp Muse source](https://github.com/ggml-org/llama.cpp/blob/master/src/models/muse-glimmer.cpp) and [Gemma4 source](https://github.com/ggml-org/llama.cpp/blob/master/src/models/gemma4.cpp) / runtime fallback | Current source has both architectures | This improves documented feasibility relative to earlier uncertainty; it does not qualify the installed server or a quant/template on this Mac |
| [Open-LLM-VTuber](https://github.com/Open-LLM-VTuber/Open-LLM-VTuber) / speech-shell reference | Voice interruption, Live2D and macOS support advertised | README still says long-term memory temporarily removed and v2 in planning. Evaluate interruption/audio separately from reasoning and memory |
| [Miru](https://github.com/kiyotakali/Miru), [AIRI](https://github.com/moeru-ai/airi) / inspect selectively | Miru documents readable Markdown memory and separate chat/memory paths; AIRI offers visual/voice stage and local TTS options | README claims are not installed proof; AIRI memory remains WIP. Miru's screen-derived summaries/commitments exceed current Ghost scope and require separate selection |

Useful first-party extension is a **context inspector** showing permitted facts, uncertainty, retrieved IDs/revisions, excluded fields, actual tokens and fallback reason. Keep privileged/secret debug separate. Add queue priority for interactive replies over background drafts, cancel obsolete work, and release idle model memory. These are proposed requirements for a chosen shared service, not changes to global runtime settings.

## M1–M5: Next experiment and decision rule

[trial.py](trial.py) is a standard-library executable rehearsal harness, defaulting to no inference. It extends the existing six-family story packet rather than claiming it ran. New synthetic cases test rule transfer/counterfactual, dependency planning, motives/knowledge, opposed invention, companion corrections and existing authored-site structure. The packet and criteria are visible screening material, **not held-out final evaluation**.

First run one seed on O1 only: nine requests across six cases. Then, only after a candidate artifact/runtime is selected and separately installed, run the same protocol against O2 for dialogue or O3 for breadth, with two seeds each. O4 is the next planning comparison if O1's dependency failures matter. Do not install all candidates. The harness accepts only the installed baseline; another adapter is needed for challenger trials. No download code exists in it.

From the repository root, inspect the default packet without touching the service:

```sh
python3 docs/research/local-ai-2026-10-14/trial.py
```

For a selected baseline screen, use a new receipt directory; this command is prepared, **not run** in this audit:

```sh
python3 docs/research/local-ai-2026-10-14/trial.py --run --seeds 17 --out /tmp/yair-local-ai-screen-2026-10-14
```

If that directory exists, choose another new directory rather than delete old receipts. Generate a blinded review sheet after the screen: assign random sample labels, keep case/facts/criteria visible and hide model/settings in a separate key. Do not describe the raw model-named receipts as a blind comparison.

| Code | Record | Decision use |
|---|---|---|
| M1 Useful acceptance | Blind human preference, accept/reject and editing minutes, with rejected outputs retained | Prefer fewer fixes and usable content over fancy wording; generator is not sole judge |
| M2 Semantic reliability | Authority/knowledge/continuity errors, forced player actions, correction misses | Runtime candidate fails on a critical fabricated permission/effect; authoring invention judged under its wider allowed scope |
| M3 Causal usefulness | Prerequisites, conserved stock, scheduling, fallback/alternatives and actual consumer | Missing support clearly labelled earns proposal value; pretending support exists fails |
| M4 Breadth | Distinct motives/premises, productive disagreement, no unnecessary refusal or tidy moral | Count ideas accepted after review; measure refusal separately from insight |
| M5 Cost | Total time, actual input/output tokens, truncation/empty/error rate; later physical footprint and first audible reply | Accepted outputs/minute = accepted count / total inference-and-review minutes, including failures; reports model-only rate separately |

The runner records full request/response and service metrics, marks length/empty output incomplete, makes no repairs and restores unloaded state if it loaded the model. It records non-streaming total time, **not first-token latency, power or physical memory**. On timeout, it records failure and stops; unloading attempts and resulting residency are explicit. Loading an already-resident target is left resident, though cache allocations may change. Other resident models cause a stop to avoid interference. Seeds are requested, not assumed effective or bit-identical on MLX. Input token count validates actual usage, not a filled-window test.

After initial screening, a separate reviewer writes fresh held-out cases with renamed entities, changed rule polarity, different resource bottlenecks and corrected facts. Split tuning/final sets. Use two seeds and multi-turn histories; compare fact order and repeated distractors. Keep useful facts constant at 4K/8K/16K budgets, measure actual consumed input and truncation, then separately compare retrieval with irrelevant material. Pin source revision, quant hash, tokenizer/template, runtime, sampling, thinking and context settings; unverified provenance stays explicit. Same total-token budget compares cost; an additional matched-final-answer budget can reveal whether thinking helps. No contamination-free or “not benchmaxxed” certificate follows.

For memory, compare recent-turn context, lossy summary and source-linked retrieval, then restart the application and change/delete a memory. A conversation replay test cannot establish durable recall. For companion speech, test STT transcription, barge-in cancellation, first audible latency and simultaneous background drafting separately. This avoids attributing a pipeline fault to model intelligence.

Suggested screen acceptance: no critical closed-fact violations in selected output, valid supported draft, one useful idea/scene accepted with lower review effort than writing it unaided. This is a proposed admission criterion, not a statistical accuracy guarantee; small samples establish only their cases. Weibao's blind preference and editing burden are the authoritative taste gate. Native gameplay/persistence is a separate gate for any implemented integration.

## Verification and remaining gate

This audit performed live read-only API/model-source checks, source tracing and raw-result review. Harness syntax and no-inference dry-run were checked; the accompanying CHECKS.json records source/evidence hashes and actual outputs of those checks. No new model answer, gameplay, battery, persistence or human-preference result is claimed.

**Next slice:** O1 offline supported-site draft plus separately labelled creative scene proposal. **Remaining authoritative gate:** run the new outcome trial, inspect/review its outputs and obtain Weibao's preference on a useful candidate. An implementation decision then requires its own rebuilt desktop/native/persistence proof. The proposal is ready; model selection and gameplay integration remain open.

Benchmark interpretation source: [EQ-Bench methodology](https://eqbench.com/about.html) explicitly limits creative-writing evaluation and discusses judge/style biases. Saved EQ/UGI scores screen candidates; they are not general-intelligence or multi-turn-roleplay conclusions. No current leaderboard winner is asserted here.

## Follow-up correction: compare with Qwen3.8, 2026-10-14

Weibao requested the current Qwen3.8 comparison. The earlier chat recommendation to favor Muse for hard planning relied too heavily on its Qwen3.6 comparison. It is superseded: retain Qwen3.8 as the preferred reasoning/planning baseline; Muse remains a different-family challenger for creative output and efficiency, not a demonstrated reasoning upgrade. [Qwen's current comparison and methodology](https://huggingface.co/Qwen/Qwen3.8-27B#performance) report higher Qwen3.8 results on shared coding, instruction-following, science, multidisciplinary reasoning and computer-use tests. These are publisher results with harness/settings qualifications, not proof for the installed NVFP4 artifact or YAIR scenes.

An independent [small reproducible comparison](https://github.com/dakshjain-1616/qwen-3.8-27-B-vs-qwen-3.6-27-B-vs-meta-glimmer-30B) illustrates why one score is inadequate: Muse led deterministic checks numerically, but pairwise differences were not statistically significant; the model judge preferred Qwen. It used different FP8 recipes, selected the successful-generation intersection and observed substantially longer Qwen outputs. Time, failures and judge preference must be recorded separately. No new local model trial was run for this correction.

Live [Artificial Analysis comparison](https://artificialanalysis.ai/models/comparisons/qwen3-8-27b-vs-muse-glimmer), index v4.3.2, also favors Qwen3.8 on broad/agentic work, while long-context reasoning is near tied. Crucial condition: Qwen is tested at xhigh, Muse at high, with about 67K versus 14K output tokens per task. These are capability-at-selected-settings comparisons, not equal-compute trials or local Mac speed predictions. Muse remains worth testing when output efficiency, writing preference or latency changes the decision. Neither public score transfers automatically to fine-tunes or the installed NVFP4 conversion.
