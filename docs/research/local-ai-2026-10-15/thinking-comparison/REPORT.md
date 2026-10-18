# Thinking on versus off: Harry Potter authoring and planning

October 15, 2026, America/New_York. **12 local requests: 11 complete normal-stop answers, one controlled four-minute timeout.** All six explicit state plans passed the declared evaluator. User authorized thinking-on tests for all three retained models and comparison of planning accuracy, speed, editing burden and the book-to-playable-world pipeline. No downloads, installation, runtime restart, default/profile change, production registration, game/save mutation, commit or push.

## D1: Recommendation

**Keep thinking off for routine interactive drafting and explicit small plans. Use thinking selectively for an offline design draft when its observed consistency improvement pays for the wait, then validate independently.** In this pair, Qwen NVFP4's on proposal avoided its off sample's casting-versus-visibility error. Gemma was source-consistent in both modes. Huihui's on proposal did not complete within the tested budget. This is a role recommendation from a small screen, not a global capability ranking or an automatic profile change.

More thinking did not improve the scored seven-operation plans: every off and on plan succeeded. It did produce extra reasoning and latency. The test cannot establish that thinking is useless on harder planning, that Huihui cannot finish with a larger allowance, or that any model can convert a whole novel into a game.

## F1: Paired results

| Current-run result | Gemma4 31B MLX | Qwen3.8 27B NVFP4/MLX | Huihui Qwen3.8 27B Q8/ggml |
|---|---:|---:|---:|
| HP proposal, off completion | 40.6 s | 50.6 s | 102.1 s |
| HP proposal, on completion | 87.4 s | 151.2 s | **Incomplete at 240 s** |
| HP proposal, on first final text | 49.4 s | 78.9 s | 227.5 s, partial only |
| Source/capability consistency field edits, off → on | 0 → 0 | 2 → 0 | 2 → unscorable |
| Explicit state plan, off completion | 19.0 s | 13.8 s | 10.1 s |
| Explicit state plan, on completion | 84.2 s | 68.7 s | 74.8 s |
| Plan slowdown, on/off | 4.4× | 5.0× | 7.4× |
| Plan legality, claimed state and goal | Pass in both modes | Pass in both modes | Pass in both modes |

First final text excludes streamed thinking. A first thinking token is not a usable answer. Huihui returned 706 characters of incomplete JSON before its request hit the deadline; it is retained as a failed-to-complete artifact, not scored as an accurate proposal or silently omitted. All six on requests emitted thinking-channel content; all six off requests emitted none. No rationale text was needed to judge correctness, and none was retained; only timing/size counters were recorded.

### Editing burden

Counts are **performed field edits for specific consistency defects**, not human editing minutes, complete implementation effort or an overall quality score. Reviews were unblinded and used the supplied dossier/contract. One conceptual correction can affect several fields.

- **Gemma off/on:** no must-fix source/capability contradiction identified. Both proposals still require implementation decisions, exact actor/wand/world identity scope, target validation and a working observation consumer. Its on sample added explicit types/eligibility but did not demonstrate a scored accuracy improvement.
- **Qwen off:** visibility was explicitly gated on magical eligibility and learned spells, conflating who can cast with who can observe emitted light. Corrected the visibility reader and Lumos effect, two fields. **Qwen on:** omitted that restriction and added useful separate physical/magical integrity and identity fields. It still typed `worldScope` as `RoomId`, so world-instance and room/location identity need clarification. Its claim that a consumer's code does not exist should be scoped to the selected adapter rather than assumed across the repository. Those are engineering follow-ups, not proof the on proposal is ready to install.
- **Huihui off:** acknowledged that the starting learner lacks Reparo, then had that learner successfully use it in a counterexample and future witness. Corrected both fields. **Huihui on:** incomplete; there is no honest numeric consistency-edit comparison until a complete artifact exists. Completing it would require another authorized run or a human-authored replacement, not merely scoring the visible fragment.

All six plan sequences and final states needed zero semantic edits under the test contract. Qwen's off and on explanations were cut mid-sentence at the schema's 400-character string bound; each received one editorial field repair. This illustrates that schema-valid text can still need presentation editing. [Proposal repair ledger](repair-ledger.json), [plan editorial ledger](planning-edit-ledger.json), and reviewed copies preserve before/after values.

## F2: Tasks, controls and limits

**T1: Exact prior Harry Potter proposal.** Reused the earlier prompt, dossier and JSON schema byte-for-byte: bounded official companion evidence for Lumos/Nox and Reparo, plus explicitly original adult learner/nonmagical visitor premises and the selected adapter's limits. Sources are the [Wand-lighting Charm](https://www.harrypotter.com/fact-file/spells/the-wand-lighting-charm) and [Mending Charm](https://www.harrypotter.com/fact-file/spells/the-mending-charm), as captured in the October 14 dossier. This is not a full reading or verification of the seven novels. All five complete proposals correctly declared `requires_adapter`; none established native HP gameplay.

**T2: New explicit HP state-planning diagnostic.** A shortest legal sequence must perform exactly seven specified operations: two rejected casts, Lumos, save/reload while lit, observation while present and lit, Nox, and free exit. It must end outside, light off, observation retained, two rejections, zero XP/coins. Rejected attempts are inert except their test audit count. A reference checker executes the declared transitions, validates exact operation cardinality and compares actual versus claimed final state. It passed one known-valid and four invalid fixtures. [Evaluator](evaluate.py), [checker checks](oracle-checks.json), [all six execution traces](evaluation.json).

The checker is an **original test-contract interpreter**, not the YAIR runtime. Its JSON serialize/restore step is not browser Save/reload or literal-file Import proof. Passing this easy, fully specified plan does not demonstrate arbitrary quest planning or full-book adaptation. It also does not show that thinking fixes the prior Duskfen resource-conservation failure; that source-to-resource task was not re-run here.

All calls used seed 113, temperature 0.7, top-p 0.9 and an 8,192-token context setting. The actual prompts are bounded dossiers, not filled 8K contexts. Thinking-on used each installed model's advertised enabled control: Gemma `true`, both Qwens `medium`; off used `false`. Native effort scales and tokenizers are not equivalent between models. Other native defaults were retained, with metadata saved. No claim about maximum reasoning or an optimized thinking profile is made.

Off output caps: proposal 1,100 tokens, plan 800. On caps: proposal 3,072, plan 2,048, allowing additional reasoning plus final text. This is **not equal compute**. Eleven completed responses ended normally, not at the token cap. Every call had a 240-second wall limit; the Huihui proposal exhausted that time allowance. A larger budget could change its completion result. Combined endpoint generation counts include the work of both channels; exact per-channel token counts were not available, so character counts are not mislabeled as reasoning tokens.

Thinking off/on order was reversed by model and task to reduce simple order bias. Models ran sequentially, one resident at a time; no empty warmup, no foreground apps stopped. Load, prefix reuse, desktop contention, temperature and energy were not experimentally controlled. Complete and first-final times include their effects; cached/uncached prefill and loading fields remain in the metrics. One sample per model/mode/task is not a confidence interval or a stable hardware benchmark. Same prompts/seeds do not establish equivalent sampling across backends.

## F3: What the book-to-playable-world pipeline still needs

The strongest result is not that one thinking setting replaces the pipeline. Explicit rules were sufficient for all models to plan this small case off; open authoring still produced contradictions, and an enabled thinker could fail to finish. Generation, validation, compilation and actual play must stay separate.

**B1 Source and evidence.** Retain a local, searchable chapter/edition corpus and claim locators. Separate narrated events, spoken claims, rumor, inference and AU/design changes. A learned spell, magical source, owned wand and observed fact are different records. Two official spell entries do not establish whole-book coverage. Thinking cannot supply missing source evidence.

**B2 Typed authoring boundary.** Draft against the actual supported grammar, with field semantics visible in the prompt and validated outside it. Bind source claims to candidate costs/effects and label numerical balance as a proposal where the source is silent. Retain exact candidate versions and a correction/rejection ledger. A generated `LightState` string is not a registered effect.

**B3 Independent planning and admission.** Deterministic code should calculate resource/time conservation and exercise positive, negative, duplicate and stale-state witnesses. A model's claimed final state must agree with execution. Keep invalid/partial/late outputs quarantined and retain the previous accepted pack; do not let an authoring timeout consume player stock or overwrite a world. No unbounded automatic retry loop is selected here.

**B4 Real consumers and disclosure.** For the HP lighting candidate, identify the actual faculty/source, learned-method, wand identity/integrity, world-instance, room/position and observation readers. Emitted light and caster eligibility are separate; visibility must not quietly grant forbidden knowledge. Privileged authoring may use source truth, but actor-facing generation should receive an allowed knowledge projection. Add exact resolver and consumer call sites under their existing owners, rather than inventing another state silo.

**B5 Native play and persistence.** The proposed authoritative journey is still: a qualified learner turns on light, a real observation changes, an unqualified attempt causes no mutation, Nox reverses illumination without erasing learned observations, leaving follows the selected light-origin rule, and the same state/identities survive native Save/reload/export/literal-file Import while a model is unavailable. Reparo's physical-versus-magical limit and learning gate need their own selected consumer case. Human acceptance of the resulting play remains distinct from source tests and fluent text.

These extend the existing [P15 authoring owner](../../../gm/dispatch/procgen-2026-10-13/p15/AUTHORING_PIPELINE.md), [T5 routes](../../../gm/dispatch/research-tech-2026-10-14/t5/LLM_ROUTES.md), [HP candidate brief](../../../worlds/harry-potter/WORLD_BRIEF.md), [ability owner](../../../worlds/ABILITY_AUTHORING.md) and [prior three-model assessment](../../local-ai-2026-10-14/gemma-world-comparison/REPORT.md). They are recommendations, not new product authority or an instruction to bypass current shared writers, UI priorities or one-slice sequencing. No production pipeline, HP adapter or game UI was implemented by this comparison.

## Scope, checks and remaining gate

Recovered live AGENTS/PROJECT/USER_VISION, shared dirty state, current endpoint inventory, native thinking metadata, defaults and task owners. Only the absent-before-task `thinking-comparison/` directory and user-facing output copies were written. Initial source hashes and prompt identities are retained. Final checks confirm unchanged three-model digests, unchanged launcher config, no resident model and the exact unwanted upgrade job still absent. The separate waiting speed-cleanup watcher was not changed.

[Exact inputs](inputs.json), [all final/partial outputs and request metrics](results.json), [paired summary](summary.json), [initial metadata](initial.json), [final state](final.json), [checks](CHECKS.json). The readable deliverable includes both exact prompts and every completed or failed final artifact; failures remain in the denominator.

The authorized comparison is complete. **The book-world gate remains a source-qualified native HP action with a real consequence, persistence/import proof and Weibao's acceptance.** No profile, default, deployment or gameplay promotion follows automatically from these results.
