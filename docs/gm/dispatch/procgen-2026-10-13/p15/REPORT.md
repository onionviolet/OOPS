# P15 report: text, dialogue, voice and authoring

2026-10-14. **DOCS COMPLETE; ALL DESIGNS ARE PROPOSALS.** P15 created no runtime behavior, tool implementation, build, browser session, gameplay proof or commit. Root owns selection, integration and commits. [CHECKPOINT](CHECKPOINT.md) records scope/resume; [CHECKS.json](CHECKS.json) records documentation verification and audit hashes.

The proposed result has two sides: **runtime text expresses real, observer-known situations in fitting voices; dev-time agents create new reviewed content from qualified evidence**. This is broader than selecting a hand-authored outcome, but it does not mistake fluent language for simulated causes or usable gameplay. Canon worlds remain a first-class target; original fixtures are optional and never a required Frontier opening.

## F1: findings and evidence boundaries

| ID | Finding | Evidence and practical implication |
|---|---|---|
| F1 | Main has authored state-sensitive scenes and a real Ink authoring/runtime seam | RUNTIME_TEXT F1–F8; DIALOGUE F9–F16; AUTHORING_PIPELINE F17–F26 give file:line locators. Reuse those before adding another dialogue engine. No general runtime prose/personality synthesis is established by these files. |
| F2 | Main's inspected automatic-event loop differs from P3's delivered deck | src/simulation.js:497–510 checks events independently. P3's read-only report states fourteen Village cards, deck receipts and native/source checks in its worktree. P15 neither reran nor transferred those checks. Its fixed contact is not integrated P4 casting. |
| F3 | P4's generated people are a separate store | P4 report explicitly defers full simulation actor/controllers/relationships. A shared voice/person join must preserve one identity; merely importing its names is insufficient. |
| F4 | Existing validators cover important shapes and selected references, not an entire content pipeline | src/simulation_contracts.js:101–212, scripts/compile_feature_ink.mjs:100–174 and the bounded draft compilers provide reuse. Reachability, semantic text agreement, canon plausibility and subjective voice need additional evidence. |
| F5 | Legacy account/biography projections are too lossy or narrow to become universal conversational memory | src/simulation_effects.js:281–284 overwrites knowledge keys by stage; life_record.js:32–58 folds highlights; event_feed.js:102 caps news. Retain actionable claims/receipts in their actual owner. |

F1–F5 are SOURCE observations/inferences from the 2026-10-14 read window, not an accepted feature decision. Inspected branch was codex/gameplay-foundations at 6e03e972. The shared checkout was already dirty and had active sibling lanes. Source hashes in CHECKS pin the audited bytes; root must recheck before implementation. A current file can differ from a dated status map without making its earlier report dishonest.

The [2026-10-13 status map](../../../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md) is a dated baseline. P3/P4's later worktree delivery reports are a separate evidence layer, not main-checkout playable proof. P15 read code and reports; no natural, seeded-native, save/import or performance check was run. Technical success claims in sibling reports remain attributed to those reports.

## D1: deliverables and ownership

| File | Extension |
|---|---|
| [RUNTIME_TEXT](RUNTIME_TEXT.md) | Typed semantic frames, slot filling, replacement/feature grammar, descriptions, repetition, saved realization, world register and deliberately authored anchors. |
| [DIALOGUE](DIALOGUE.md) | Existing Ink/causal paths, personality versus current intent, topic/speech-act options, turn lifecycle, beliefs, memory, branch scope and idle/contact rules. |
| [LLM_OPTIONS](LLM_OPTIONS.md) | Offline baseline, dev-time/local/hosted options, measurable cost/latency, limited authority, secret/canon/data boundaries, async races and persistence. |
| [AUTHORING_PIPELINE](AUTHORING_PIPELINE.md) | Existing helpers, inert batch envelope, fourteen concrete proposed check modules, five-stage card-batch workflow, witness/UNKNOWN evidence and entry-level acceptance. |
| [MORE](MORE.md) | Twenty additional concrete angles, costs/dependencies/gates and useful combinations: translation, nonhuman channels, humor, accessibility, letters, audio, semantic diffs and writer sandbox. |

P15 writes only this directory. No shared file was edited by this lane. COMMON's older worktree/build/commit requirements are superseded for P15 by the user's explicit main-checkout, docs-only, p15-only instruction. No worktree or server was created. No private saves or novel prose were opened. Private analytical locators in siblings were treated as locators, never quoted. Memory registry lookup had no task-specific hits and supplied no factual authority.

## D2: cross-links and reading scope

| Owner group | Read / extended boundary |
|---|---|
| Direction | COMMON, PLAN, AGENTS, PROJECT standing/book-world/natural-course sections and USER_VISION desktop/anything-possible/adjective direction. User's 2026-10-14 P15 instruction supplies the explicit two-sided expansion and write authorization. |
| P3 / P4 | Read-only [P3 report](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md) and [P4 report](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md). Evidence is branch-local and attributed. |
| P5 / P6 / P7 | [D8](../p5/D8_LORE_GRAMMAR.md), [D9](../p5/D9_STORYTELLER.md), [extras](../p5/EXTRA_IDEAS.md), [creative works](../p6/CREATIVE_WORKS.md), [people/names guidelines](../p7/GUIDELINES.md). P15 consumes their people/fact/work identities and extends realization/production. |
| P9 / P10 | [Profile rules](../p9/PROFILE_RULES.md), per-world source/contradiction sections and relevant story/era rows, [TTKS index](../p9/TTKS.md), [P10 report](../p10/REPORT.md). This is reuse of qualified analytical owners, not whole-book primary reading or new canon certification. |
| P11 | [Context](../p11/CONTEXT.md), [requests N1](../p11/REQUESTS_AND_MARKETS.md), [dreams/occasions](../p11/DREAMS_AND_OCCASIONS.md), [information/libraries](../p11/INFORMATION_AND_LIBRARIES.md), [more](../p11/MORE.md). No duplicated need, library, rumor or language store. |
| Emergent owners | Relevant schema/casting/variants in [E2](../../../../emergent/E2_STORYLETS.md), pacing/idle boundaries in [E5](../../../../emergent/E5_STORYTELLER_AND_FATE.md), grammar/packs/LLM in [E6](../../../../emergent/E6_LORE_LAYER.md), unknowns/perception/lazy lore in [E7](../../../../emergent/E7_OBSERVATION_AND_MYSTERY.md). Their proposals are not existing runtime APIs. |
| Narrative owners | [Timelines T1–T4](../../../../TIMELINES_AND_DIVERGENCE.md), [rival continuity/contracts](../../../../RIVALS_IDENTITIES_AND_FATE.md), [cosmic expression](../../../../COSMIC_EVENTS.md), [starts/endings/randomness](../../../../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md), [intro timeline/branch rounds 10–12](../../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-10-story-world-timelines-and-branches-2026-10-14). Text consumes actual causes, branch/clock policies and knowledge carriers. |
| New story siblings | [P12 contract](../p12/CONTRACT.md), [P13 rules](../p13/RULES.md), [P14 contract](../p14/CONTRACT.md), [P16 authorship](../p16/PLAYER_AUTHORSHIP.md). At first refresh each had only its checkpoint; final interface refresh read these new drafts. Their lanes own structure, canon divergence, history/texts and other story forms respectively. P15 consumes P14's restricted claim/edition bindings and P16's attributed player text; no competing owners or runtime API names are introduced. |

## F2: compact source anchor index

These exact file:line anchors complement the detailed linked ranges in the five documents: src/causal_story_actors.js:25; src/causal_story_content.js:23; src/causal_story_core.js:390; src/causal_story_host.js:459; src/causal_story_ids.js:9; src/causal_story_native.js:120; src/causal_story_scenes.js:63; src/causal_story_ui.js:274; src/simulation.js:395; src/simulation_content.js:44; src/simulation_contracts.js:101; src/simulation_effects.js:281; src/simulation_resolution.js:11; src/simulation_ui.js:10; src/event_feed.js:37; src/event_feed_ui.js:3; src/world_visit_history.js:21; src/life_record.js:1; src/people_knowledge.js:12; src/ink_narrative.js:255; src/ink_scene_content.js:124; src/authored_site.js:60; src/site_projects.js:4; src/work_ledger_author_ui.js:7; src/work_ledger_system.js:25; scripts/compile_feature_ink.mjs:100; docs/worlds/ABILITY_AUTHORING.md:30. Full source-file fingerprints are in CHECKS.json; line numbers are snapshot locators, not permanent API contracts.

## R1: contradictions and proposed dispositions

| ID | Mismatch | Proposed disposition |
|---|---|---|
| R1 | Dated “only authored picks” can obscure current Ink/scenes and later unmerged procedural branches | Report all three separately: inspected main source, branch delivery report and future proposal. No gameplay promotion from reading a file. |
| R2 | E2/E6 slot syntax and universal short-line limits differ from longer current scenes | One parsed typed binding model with per-surface limits, retaining existing longer authored scenes. Reject broken actionable text rather than empty expansion/truncation. |
| R3 | E6's LLM word/name/number filters can miss changed negation, certainty or promises | Limit model authority, use known semantic frames and complete baseline text; critical/discovery content remains reviewed. Filters are a bounded check, not a semantic guarantee. |
| R4 | E6 fixed canon and E7 lazy seeded lore can conflict with causal divergence/content revision | P13/timeline owner governs causes and overlays; pin meaningful truth/creation revisions and saved speech. Grammar cannot force canon or create evidence on inspection. |
| R5 | E2/E5/P3/current content includes once/cap policies, while user rejects universal once anti-abuse limits | Preserve historical source evidence; new content uses per-world recurrence adjectives. Duplicate settlement protects the same occurrence, without forbidding new funded work or conversation. |
| R6 | Old timeline prose says exports carry IDs only; E6 and current Ink/account saves retain resolved text | Do not promise ID-only exports. The selected owner must specify private text/pack/export behavior and preserve actual paid commitments; P15 adds no archive or new export format. |
| R7 | Existing voice profiles are scene-gated, but gate failure alone cannot prove private data is absent from bundle inputs | ink_scene_content.js:7 imports a voice-cue JSON file; lines 124–137 control activation. Review content/bundle admission separately before any private canon pack; this audit makes no unexamined payload-leak claim. |

P9's own contradictions retain SHOWN/STATED/INFERRED and locator qualification, with examples in MORE M3. P15 did not smooth disagreements into new canon. No secret truth or candidate catalogue appears in these documents.

## S1: five ranked future slices

Ranking is a recommendation for selection, not implementation authorization or a required global roadmap. Suggested ports begin at **20400**. They are future isolated evidence origins, not running listeners or guaranteed reservations; root checks port/writer availability first. New names below are proposed modules, not existing APIs. Finish one playable integration slice before starting the next.

| Rank / ID | Outcome and scope | Dependencies / ownership | Suggested branch / port | Observable acceptance gate |
|---|---|---|---|---|
| 1 / S1 Batch lint and review corpus | A small source-qualified or original batch can be rejected for actual impossible requirements, bad refs, unsupported effects or misleading terms before registration; corrected entries have reproducible witnesses | QA1–QA7 and selected QA9–QA13, using current validators and one chosen world's supported adapters. New content_batch_* tooling/data area; root owns shared registration. P3/P4 actual API parity checked if used. | proc/p15-authoring-batch / 20400 | Reject deliberately malformed/orphan/self-locked/unfunded fixtures, report UNKNOWN honestly, then compile a valid mini-batch. For playable admission, follow one accepted request naturally to a real result, decline another and roundtrip pending/completed state. Gallery review records Weibao's entry-level choices separately. |
| 2 / S2 Typed grammar realization | Hear varied original descriptions of an actual admitted request/outcome with correct people, terms, basis and consistent reload | E6/D8 shared grammar seam, P11 safe context, selected text-stream integration; no new history store. Proposed runtime_text_* area with root-controlled host/save joins. Works with an authored supported actor; P4 is optional. | proc/p15-runtime-text / 20410 | Same frame under several seeds/variants preserves semantics; preview draws nothing; unknown/overlong slots get complete fallback; grammar update/reload/import retain exact saved speech and next draws. Natural acquisition/settlement and both desktop views prove the actual consumer. |
| 3 / S3 Ordinary conversation with coherent voices | Ask an introduced person about a real need, clarify, help/decline, leave and return to an evidence-backed acknowledgment | Reuse current Ink host for authored beats or a minimal topic adapter; identity join only if selecting P4. Proposed dialogue_topics_* area; shared Ink/host changes serialized by root. | proc/p15-voice-dialogue / 20420 | Two voice profiles keep identical terms; the right actor recalls only the actual shared receipt; pause/resume and literal-file Import preserve current choices. Hidden aliases and synthetic sealed IDs never leak. Repeat new meetings remain possible; human voice/feel acceptance is separate. |
| 4 / S4 Canon-first content batch | One selected priority world gets new fitting incidental storylets/dialogue/items attached to an authored era/anchor, with original wording and real actions | P7/P9 or P10 source profile, P13 reservations/divergence, P12 quest structure if used; P14 only for history/work consumers. S1 tooling reusable, not every earlier slice mandatory. Private-pack owner handles direct recreation data. | proc/p15-canon-batch / 20430 | Every essential canon claim has locator/mode and resolved or declared nonessential contradictions; no reserved-identity replacement, future knowledge or raw prose. Play one new supported local chain and an alternate route; exact source/era/identity/terms and knowledge survive import. Weibao accepts fit separately. |
| 5 / S5 Optional model expression trial | Compare baseline, local and/or hosted text on the same safe low-stakes frames; game remains complete offline | LLM_OPTIONS operating/data choice, selected adapter and exact live model/runtime documentation; S2 frame contract or equivalent existing safe adapter. Proposed optional_prose_* area; no general NPC planner required. | proc/p15-optional-prose / 20440 | Measured cost/device load, latency, semantic drift and rejection rate; offline/outage/budget fallback; no state/tool authority; no sealed input/output on sensitive routes; stale async results discarded; same received text after restore/import. Weibao chooses whether the benefit warrants the optional mode. |

S1's tooling stage can be assessed without a game server; its suggested port belongs only to a later authorized playable/gallery proof. Synthetic source fixtures never substitute for natural gameplay acquisition. S4 may be selected directly when a priority world's source/adapters are ready. Model text is optional; all reasonable paths stay reachable without it.

## G1: future common gates and current checks

| ID | Future builder must prove | P15 result |
|---|---|---|
| G1 Authority / source | Selected world/era, actual integrated owners/writers, authored anchors and local recurrence; source-qualified claims with contradiction ledger and private-pack boundary | Proposal reconciliation and source read only. No new decision accepted. |
| G2 Source / compilation | Required semantic contracts, pure preview, deterministic text/deck isolation, valid bindings, real consequences and failed-write behavior; appropriate tests and build | NOT RUN. No compiler, lint implementation or runtime suite executed. |
| G3 Rebuilt play / presentation | Natural changed behavior on a fresh rebuilt origin, separately labelled seeded cases; 1366x768 plus 1600x1000 with readable dialogue and stable visible terms/actions | NOT RUN. Mobile deferred. Existing bundle was not used as proof. |
| G4 Persistence / compatibility | Pending/completed Save/reload, Export and literal-file Import; exact cast/frames/choices/claims/RNG; absent old owner unchanged; pinned/missing revisions handled explicitly | NOT RUN. No saves accessed and no schema changed. |
| G5 Human / disclosure | ID-only sealed-route results, no public/private prose spill, source/attribution review, and Weibao's acceptance of fiction, voice and usefulness | Document disclosure review only. No human acceptance inferred. |

Actual checks here: required file inventory, relative-link targets, requested topic/traceability markers, code-locator bounds, forbidden em-dash/raw-private-path review and proposal/status consistency. CHECKS.json records counts/results and SHA-256 source fingerprints. These are documentation checks only, not canon authentication or a formal semantic/secrecy proof. No build/test/commit/native state was altered.

Open gate: root selects one bounded slice and resolves its current source/API dependencies, then the builder supplies the rebuilt playable and persistence evidence above. [BACKLOG](BACKLOG.md) retains the future evidence boundaries. All proposed tools, sentences and schemas remain proposals until separately implemented and reviewed. There is no P15 commit hash.
