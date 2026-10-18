# Three-model comparison: toward a playable Harry Potter world

October 14, 2026, America/New_York. **33 local inference requests completed, zero errors, all normal stop completions, no unexpected thinking output.** User authorized Gemma versus both retained Qwens, editing-burden comparison and a book-world task, then selected Harry Potter. No downloads, installation, default/profile changes, game/save mutation, commit or push. The earlier unwanted upgrade job remains absent. All test-loaded models are unloaded.

## D1–D3: Practical recommendation

| Role | Recommendation and evidence |
|---|---|
| D1 Interactive general drafting / extraction baseline | **Qwen3.8 27B NVFP4/MLX.** Usually fastest in this run, good when the output contract and facts are explicit. Needs scene trimming and semantic review. No automatic promotion beyond the already-existing default. |
| D2 Compact fiction and initial Harry Potter specification | **Gemma4 31B NVFP4/MLX deserves this role comparison.** Met every sampled scene-length range and gave the cleanest HP proposal on the supplied facts. It still invented powers in a scene and failed the resource plan. Not a qualified autonomous world compiler. |
| D3 Optional alternate style | **Huihui Qwen3.8 27B Q8_0/ggml.** No observed refusal advantage; length and state-planning defects remain. Keep only if Weibao prefers its output enough to pay the memory/review cost. This test does not authorize deletion. |

**None demonstrated an unattended “book in, playable world out” route.** All three can assist a source-grounded authoring pipeline. The present evidence supports choosing by role and measuring accepted useful content, rather than picking one model by quantization bits or refusal claims. Use one resident model at a time; this is not a new automatic multi-model orchestrator.

## F1: What was actually compared

Nine shared requests per model: one existing authored-site schema draft, a betrayal scene, correction follow-up, short companion answer, four exact darker-fiction prompts and one synthetic source-to-slice task. Main cases use the prior seed 17 and darker cases seed 113. This re-ran both Qwens in the same session as Gemma rather than treating earlier conditions as comparable.

Three additional revised source tasks supplied explicit field semantics and the JSON schema in the prompt, not just the API constraint. Three further tasks used the same bounded Harry Potter dossier. Total: **27 + 3 + 3 = 33**. All used `think:false`, temperature 0.7 and top-p 0.9. Core/darker cases: 4,096 context limit, 400 output cap. Source/HP tasks: 8,192 context limit, 1,100 output cap. Actual initial source input was about 642 tokens and revised source about 2,074, so no filled-8K or whole-book recall result is claimed.

Gemma reports 31.7B, safetensors/NVFP4/MLX, digest `a22a363052da770302019d5afab29bd967f9318e4377bddd297421189ea09d7d`. Retained Qwen/Huihui digests stayed pinned in [initial inventory](initial.json) and [final inventory](all-final.json). Publisher checkpoint/conversion provenance was not newly qualified. Native advertised thinking defaults differ, but the same explicit thinking-off control was used. These results do not establish each model's best reasoning-enabled offline authoring performance.

## F2: Speed and useful output

| Current-run measure | Qwen NVFP4 | Gemma31B | Huihui Q8 |
|---|---:|---:|---:|
| Short companion, first final / complete | 0.96 / 5.94 s | 6.86 / 22.33 s | 1.93 / 9.12 s |
| Six scene/correction requests, completion range | 14.75–27.69 s | 27.07–38.05 s | 23.39–34.78 s |
| Median decode across nine shared tasks | 9.14 tok/s | 5.36 tok/s | 7.90 tok/s |
| HP proposal, first final / complete | 14.24 / 84.40 s | 17.34 / 49.65 s | 18.95 / 91.84 s |
| HP proposal output tokens | 1,067 | 725 | 1,003 |
| Scene-length compliance | **1/6** | **6/6** | **0/6** |
| Exact standalone site draft, validator/compiler | Pass | Pass | Pass |
| Refusal on six fiction turns | None | None | None |

Gemma's shorter HP response completed sooner; this is not proof of a higher underlying decode rate. Medians include different task types and are descriptive only. All models ran sequentially on the user's active desktop, not an isolated benchmark; model order, disk cache, memory pressure, power and thermals were not controlled. No foreground apps were stopped. Cold loads, first final text, complete useful answer and decode are separate metrics. No energy winner is established. [All per-request numbers](summary.json).

## F3: Editing burden, with inspectable repairs

Counts below are **recorded field edits or failed constraints**, not estimated human minutes or an objective prose-quality score. A single change of plan can require several field updates. Taste edits and implementing missing consumers are not folded into the counts.

| Burden | Qwen NVFP4 | Gemma31B | Huihui Q8 |
|---|---:|---:|---:|
| Scene outputs needing a length edit | 5/6 | 0/6 | 6/6 |
| Revised synthetic world draft copies source numbers | Pass | Pass | Pass |
| Revised generated resource witness executes legally | **Fail** | **Fail** | **Fail** |
| Recorded fields repaired for a source-correct witness/public line | 4 | 3 | 4 |
| Recorded HP consistency field repairs | 3 | 0 | 2 |

Semantic examples matter more than a total score. Gemma's first betrayal scene invented a century-long soul punishment and a year of service; its cruelty scene had a prisoner say “Please” despite the no-begging instruction. Qwen invented debt and a syndicate and used the wrong “take your money” direction in betrayal; its cruelty scene said “burnt cellulite,” apparently intending cellulose. Huihui likewise reversed repayment, supplied unsupported personal details and narrated the smuggler leaving despite the open-action constraint. Attractive writing did not make those consequences supported.

### The synthetic source task and a corrected test-design defect

The source packet was original Duskfen fiction with locators, exact reed/mat economics, an unverified rumor and an NPC-only gate fact. It was not a published book and did not expose repository secrets. The first version constrained JSON via the API but did not sufficiently explain each adapter field in the model-visible prompt. All three produced bad economics/plans. **That under-specified interface is a test limitation, not a clean basis for ranking intelligence.** The original failures remain in [results](results.json).

With the explicit adapter contract, all three copied every numeric recipe field correctly, preserved the rumor label, listed unsupported mechanics and kept the synthetic secret out of public dialogue. Yet all planned three crafts from six reeds, with no gathering. Real `actPack` rejected craft three after two crafts exhausted the stock. This was an **executed source-level failure**, not an LLM-judge opinion.

The reviewed correction uses two gathers and three crafts: **6 + 4 − 9 = 1 reed; 3 mats; 24 coins; 40 + 90 = 130 minutes**. Each reviewed candidate executed successfully through existing `compileDraft`, `enterPack`, `actPack` and `advancePackSettlement` on disposable objects. Only the witness sequence, leftover input and elapsed time needed changing in Gemma; both Qwens also claimed in public dialogue that six reeds were enough for three mats. [Exact repair ledger](repair-ledger.json), [real-code validator](validate.mjs), [review and execution script](review_repairs.mjs). Draft export/parse and selected source-state serialization checks are separate from native browser Save/import acceptance.

### Harry Potter proposals

The user-selected follow-up used two bounded official companion entries, not a full reading of the novels. H1: [Lumos/Nox](https://www.harrypotter.com/fact-file/spells/the-wand-lighting-charm). H2: [Reparo's limit](https://www.harrypotter.com/fact-file/spells/the-mending-charm). The dossier paraphrases the relevant effects and distinguishes them from an original adult learner/visitor starting fixture and a selected adapter manifest. It does not certify the entire HP canon, source order or continuity.

All three preserved the supplied spell effects, invented no source-specified mana/cooldown and correctly returned **requires_adapter**, rather than claiming the scalar craft adapter implements spells. Gemma's proposal was the cleanest on supplied facts. Huihui later let the initial learner cast Reparo despite not knowing it, in both a counterexample and future witness. Qwen kept that learning gate but invented a broken wand present in the room and restricted visibility to “eligible actors,” a restriction not supported by the dossier; eligibility to cast is not evidence for restricting who may observe light.

The review removes those exact inconsistencies. [HP repair ledger](hp-repair-ledger.json). Gemma's zero consistency patches do **not** mean its plan is implementation-complete: its state/readers remain broad labels, and every proposal still needs exact identity scope, target rules, normal visibility/observation consumers, resolver call sites and save behavior. No new HP action was installed or exercised in a browser.

## D4: What can actually turn a book world into a playable one?

**A source-grounded authoring and implementation pipeline, with the model as a drafter, is the workable route.** The tests show why a model alone is insufficient: fluent source summaries and valid schemas can coexist with an impossible sequence or invented effects.

The owning project already distinguishes these responsibilities. [Source deep-dive playbook](../../SOURCE_DEEP_DIVE_PLAYBOOK.md) covers evidence and rules-to-engine work; [HP brief](../../../worlds/harry-potter/WORLD_BRIEF.md) is a candidate, not registered gameplay; [ability authoring](../../../worlds/ABILITY_AUTHORING.md), [P15 authoring](../../../gm/dispatch/procgen-2026-10-13/p15/AUTHORING_PIPELINE.md) and [T5 routes](../../../gm/dispatch/research-tech-2026-10-14/t5/LLM_ROUTES.md) own integration constraints. No competing universal compiler or new world schema is selected here.

The useful stages are:

1. **B1 Source evidence:** retain a local searchable chapter corpus, source/edition locators, contradictions and uncertainty. Keep what happened separate from when a character learns it. A model's pretrained HP familiarity is not a citation.
2. **B2 Playable interpretation:** choose one local situation and a few meaningful verbs. Preserve canon limits, label AU changes and propose missing numerical balance explicitly. Characters' desires and alternatives matter, not just a catalogue of spell names.
3. **B3 Mechanical binding:** map actions to actual eligibility, targets, costs, state owners, observable effects and later readers. If a consumer is missing, either implement it under its owner or leave the feature unsupported. Do not reskin reeds as magic.
4. **B4 Deterministic checking:** calculate resources/time, execute positive and negative witnesses and reject impossible drafts. Keep accepted artifacts/version identities so playing them does not require a model call per tick.
5. **B5 Native acceptance:** rebuild and play the selected journey, then verify refusal, leaving, Save/reload/export/literal-file import and provider/model unavailability. Source checks and prose preference are separate from this gate.

A whole novel should not be pasted into a maximum context window and trusted to become a game. Begin with source-qualified chapters for one function, retain broader world rules in their owners, and expand after the first slice is genuinely playable. This is an order of work, not a restriction to permanent toy worlds.

## A1: The smallest useful HP next slice

The best bounded next implementation candidate from this test is **Lumos/Nox changing an actual observation in a dim room**, with source-eligible trained and untrained/nonmagical fixtures, free exit and exact actor/wand/world identity. It needs a light-origin state and a real visibility/observation reader. Repeated casts must not generate mastery/items, and physical wand repair must not silently repair magical integrity. Persistence must preserve the chosen spell/light state without granting new knowledge or leaving light in the wrong room.

This is a proposed next slice, not a new accepted release gate or implementation authorization. It should attach to existing ability/knowledge/world owners rather than bypass their shared writers. No acquisition of another model is required to discover this gap. A later role-specific trial may enable thinking for offline planning, but the current results cannot rank that untested profile.

## Checks, boundaries and authoritative remaining gate

Recovered current AGENTS/PROJECT/USER_VISION, shared dirty state and HP/P15/T5/source owners. Writes stayed in this new task-owned comparison directory and output copies. Ran 33 local inference requests; existing validator/compiler and real resource/time functions on disposable data; source serialization/export checks; exact repair-ledger verification; inventory/residency/default checks. No runtime service restart, settings/default changes, production registration, live saves, gameplay build, browser native proof, commits or pushes. All three retained model digests remain present and residency is empty.

The comparison is complete. **For the book-world goal, the authoritative remaining gate is one source-qualified HP action that changes a real playable consequence, survives native persistence/import, and earns Weibao's acceptance.** Human editing time and blind writing preference remain unmeasured; this report does not infer acceptance from silence.
