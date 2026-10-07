# RimWorld local decompilation and source review

Completed 2026-10-06 for the dedicated source-research assignment. The supplied Mac package's main gameplay assembly was privately exported with ILSpy into **9,213 C# files**. **Five mechanic paths were semantically reviewed across 54 source/definition files and 3,697 unique listed lines.** This completes the finite research scope, not a full codebase review or runtime verification. [Coverage](COVERAGE.json) gives the exact intervals and readers.

## Provenance and reproduction

The targeted search found no RimWorld app in `/Applications` or `~/Applications`, no app 294100 manifest/game directory in the sole declared Steam library, and one supplied download: `/Users/weiwei/Downloads/rimworld_enUS_1_6_4871_rev588_.dmg`. No saves, profiles or credentials were inspected. The authorized public reference fallback was not cloned or used.

The DMG was mounted read-only and only its base installer was expanded with `pkgutil --expand-full`. Installer scripts were not executed. The game's Managed references and Core definitions were copied into `/Users/weiwei/.codex/research/rimworld/1.6.4871/input/`. The supplied Anomaly, Biotech, Ideology, Odyssey and Royalty installers were not expanded or activated. The DMG was detached after extraction. No game installation or launch occurred.

| Identity | Exact value |
| --- | --- |
| DMG SHA-256 | `c261ffc4d3c963c1d47157943deab6a9f4378aacbe24b4caac6aace38affd529` |
| Main assembly SHA-256 | `3e6dff19784a4c6e8e8d03e28e415ab6f39a583546c54c3584858854d681d050` |
| Payload Version.txt | `1.6.4871 rev573` |
| Filename revision | `rev588` |
| .NET AssemblyVersion | `1.6.9676.17433` |
| App bundle short version | `1.6` |
| Tool/runtime | ILSpy `9.1.0.7988`; .NET `8.0.31`, osx-arm64 |
| Export result | Exit 0; empty stderr; 9,214 generated files including project |
| Copied inputs | 653 files: 103 managed DLLs and 550 Core definition XML files |

The filename and payload revisions disagree. AssemblyVersion and bundle version are separate labeling schemes; none establishes an installed/current edition. [Intake](INTAKE.json) records exact preparation/decompile commands, tool hashes, paths and qualifications. [Private input manifest](/Users/weiwei/.codex/research/rimworld/1.6.4871/INPUT_MANIFEST.json) fingerprints copied inputs; [private export manifest](/Users/weiwei/.codex/research/rimworld/1.6.4871/DECOMPILATION_MANIFEST.json) fingerprints every generated file. Raw code, definitions, package contents and binaries remain outside the Git tree.

No recognized decompiler diagnostic comments were found. An initial broad scan matched ordinary XML validation log messages; those were excluded after checking actual comments. Successful export does not prove the recovered project compiles or every method is valid. Dependency DLLs remain references, not separately decompiled projects. Ludeon's [EULA learning/modding provision](https://store.steampowered.com/eula/294100_eula_1) permits code inspection and limits independent redistribution; checked 2026-10-06. This lane saves analytical paraphrases and original proposals only.

## The five paths

### 1. Jobs, reservations and production

`JobGiver_Work -> WorkGiver_DoBill -> Bill_Production/ingredient helpers -> JobDriver_DoBill -> Toils_Recipe -> RecipeWorker/Pawn_JobTracker`.

The scheduler filters work type, role, capacity and current task eligibility before asking for an actual job. Bills check worker/skill, usable table, fuel, reservation and material availability. Missing inputs can return no job, report the shortage, and back off further autonomous searches. A stock-target bill counts eligible current products rather than completed-job history; it can pause at a high stock level and resume at a lower one. Quality, HP, allowed material and equipped-stock filters can change what counts. [RW-JOB-01–02](FINDINGS.json).

Reservations do not consume goods. The driver first reserves and gathers supplies; unfinished work stores actual ingredients, creator and remaining work. That path resumes for the creator. Work decrements through actor/table speed; disappearance, fire, unavailable table, deleted bill or destroyed unfinished object can interrupt it. Completion creates products, consumes ingredients, records completion, then stores/hauls/drops output. Cleanup releases reservations and can drop carried goods. There is no source basis for treating reservation cleanup as a material refund or this sequence as atomic durable saving. [RW-JOB-03](FINDINGS.json).

### 2. Need and health state changes action eligibility

`Pawn_NeedsTracker -> Need_Food -> JobGiver_GetFood -> JobDriver_Ingest/Toils_Ingest -> Need_Food`; related branch `Need_Mood -> MentalBreaker`.

Food intervals drain nutrition, increase malnutrition while starving and reduce it otherwise. Existing malnutrition also modifies hunger drain. The food jobgiver reads thresholds and need state, then seeks a legal recovery source. Severe malnutrition changes corpse-food permission; no source returns no food job. The feeder-priority suppression only applies below starvation. Successful ingestion adds the actual returned nutrition to food need and records it. Mood-break eligibility has separate duration, probability and downed/asleep/blocked-state exceptions. This is a bounded food/mood trace, not an audit of all medical/body systems. [body-01](FINDINGS.json).

### 3. Attributed social memory and feedback

`Insult definition -> Pawn_InteractionsTracker -> MemoryThoughtHandler -> Thought_MemorySocial -> ThoughtHandler -> Pawn_RelationsTracker -> NegativeInteractionUtility/InteractionWorker_Insult`.

The recipient receives a memory attributed to the other pawn after admission checks. The reviewed Insulted definition lasts 20 days, has a separate two-day mood thought and per-person stack limits. Its directed opinion contribution fades over the final fraction of duration before expiry. That contribution enters opinion and can affect later negative interaction selection toward the same actor. Missing social target rejects the memory; self/availability/cooldown failures stop an exchange before mutation. A successful social-fight branch can skip the ordinary worker aftermath after the initial memory was already added. This does not prove every memory, relationship or fight behaves the same. [social-01](FINDINGS.json).

### 4. Storyteller eligibility becomes a concrete environmental consequence

`Storyteller/Randy RandomMain -> eligible category/incident -> IncidentWorker_ColdSnap -> GameConditionManager -> outdoor/cell temperature -> Plant.GrowthRate/GrowthPerTick/TickLong`.

Randy's reviewed component uses stochastic intervals and weighted eligible candidates; choosing a category does not promise a particular incident. Execution rechecks eligibility. ColdSnap requires seasonal temperature strictly between 0 and 15 degrees C, compatible active conditions and a condition manager. A seasonal temperature of zero or less rejects that candidate; it is not silently queued until spring. An eligible occurrence registers a timed condition with a ramped -20-degree offset. Actual plant growth consumes cell temperature with species, growth stage, light, fertility, season and other gates; a long tick changes growth state. This supports a growth consequence, not universal crop death or a fixed harvest loss. [RW-STORY-01–05](FINDINGS.json).

### 5. Definitions, components, material and quality have actual consumers

`ThingDef recipeMaker -> RecipeDefGenerator -> DoBill/GenRecipe -> ThingWithComps/CompQuality -> StatWorker/Tool -> Verb_MeleeAttackDamage`.

The longsword example declares its work, material, skill and research requirements; its parent declares smithy users, unfinished work and optional quality. Generated recipes carry those requirements into production. Finished material/quality are product state, including save, stack and split rules. A failed component initialization is logged and removes that component. A quality-bearing result without a work skill logs an error; merely declaring traits does not establish valid production. [RW-MATERIAL-01](FINDINGS.json).

Attacks consume these traits specifically. Quality changes the weapon damage multiplier; a tool's damage category chooses sharp or blunt material multipliers; cooldown has its own multiplier. Plasteel's reviewed parameters favor sharp damage and speed while lowering blunt damage relative to steel. Live damage carries tool/weapon/quality attribution into target damage application. Armor/body damage and full attack selection remain outside this trace. These parameters describe RimWorld source and are not proposed YAIR constants. [RW-MATERIAL-02](FINDINGS.json).

## YAIR disposition

Current source already has site/participant reservations, completion-support refund policy, directed caused relationship notes, timed conditions, discovered event responses, native stock transfers and durable publication. Native crafting already validates actual material, produces quality-bearing components, includes component/quality identity in item keys, and consumes those values in weapon attack. The moving Reference gameplay wave also has cooling/material outputs, body/tool/custody predicates and finite practice with a goal. The source fingerprint matters: none of those source observations is a fresh playable claim.

The [three ranked original packets](IMPLEMENTATION_PACKETS.md) extend a missing consumer or policy: a finite kit-stock buffer, temporary pair-specific social friction with permanent promises, and one frost-sensitive cultivated plot with actual herb output. Basic irritation and functional material use already exist, so they are explicitly reused. The packet list selects no new world, copied setting, colony simulator, generic engine replacement or additional prestige layer.

## Review and limits

Two disjoint GPT-6 Luna medium readers covered body/social and storyteller source. Their [body/social notes](BODY_SOCIAL_FINDINGS.json) and [storyteller notes](STORYTELLER_FINDINGS.json) were integrated and checked against representative caller, predicate, mutation, expiry and failure spans. Parent review added actual nutrition/opinion/growth consumers, corrected one copied hash, and qualified the starvation feeder exception. Final integrity readback checks JSON, source/input/export hashes, evidence spans, local links, current YAIR fingerprints and write-scope boundaries. [Validation](VALIDATION.json) owns those results; [checkpoint](CHECKPOINT.md) records completion and remaining gates.

Local decompilation was performed, so the fallback/unperformed-local-source gate is resolved. Most exported methods, DLC definitions, full health/combat/pathfinding/quality distributions and other incidents remain unreviewed. Recovered-source compilation and RimWorld runtime were not run. YAIR runtime, build, browser, save/reload, failure, regression and director review were not run by this lane. All three gameplay packets retain those later acceptance gates. No runtime/canonical edits, personal-save access, commits, pushes, publishing or automation were performed.
