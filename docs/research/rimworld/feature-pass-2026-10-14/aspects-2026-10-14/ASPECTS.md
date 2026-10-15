# Scoped aspect pass

Status: PARTIAL. “Covered” means covered in the explicitly described feature scope, not exhaustive game coverage. All shown claims are source/XML evidence; none is native UI or save verification. Sources are relative to the reusable private decompile, or extract for Data paths. No absence is inferred just from an unread system.

## A01: COVERED

Scoped social conversation is event/grammar driven: an InteractionDef selects a worker and thoughts/XP, admission checks run, thoughts are inserted, a fight can replace worker aftermath, and an attributed play-log entry and bubble are emitted. This is not proof of an exhaustive player dialogue tree audit. Full supplied English text and raw RulePack definitions are indexed privately; conditions require matching caller reads.

Evidence: `RimWorld/Pawn_InteractionsTracker.cs`, `RimWorld/InteractionWorker.cs`, `RimWorld/Thought_MemorySocial.cs`, `Data/Core/Defs/InteractionDefs`, `Data/Core/Defs/RulePackDefs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: P19 dialogue owner: commit host effects before presenting attributed aftermath; P01 receipts: log rendering must not pay again.

## A02: PARTIAL

Research letters describe applied evidence/progress; interaction logs retain participants; storyteller chooses eligible incident categories and rechecks execution. Full quest generation, narrative grammar and closure are unread.

Evidence: `RimWorld/Storyteller.cs`, `RimWorld/StorytellerComp_RandomMain.cs`, `RimWorld/ResearchManager.cs`, `RimWorld/Pawn_InteractionsTracker.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: Characters/world-events owner: retain occurrence and participant evidence; no universal storyteller needed.

## A03: COVERED

Scoped architecture: Unity gameplay assembly, Verse definitions/serialization/rendering and AI toils, RimWorld domain workers and data-driven XML. Loader stages include XML inheritance reset, content/XML load and patches; tick manager separates normal/rare/long tick lists. Exporting source does not recreate a compiling project or effective mod load.

Evidence: `extract/Managed/Assembly-CSharp.dll`, `Verse/LoadedModManager.cs`, `Verse/TickManager.cs`, `Verse/GeneDef.cs`, `Verse/ResearchProjectDef.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: Engine authoring: stable content IDs and domain workers; modular chains: share predicates only where actual consumers need them.

## A04: COVERED

Scoped save route uses XML Scribe values/defs/deep/reference collections; metadata stores version and running mod identities. Existing saves write to .new, move current to .old and promote new with rollback attempt on failure. First save writes directly. Selected bills, skills, genes and learning fields are serialized; caches are derived. Whole migration/back-compat, autosave and corruption recovery remain unread and untested.

Evidence: `Verse/GameDataSaveLoader.cs`, `Verse/ScribeSaver.cs`, `Verse/SafeSaver.cs`, `Verse/ScribeMetaHeaderUtility.cs`, `RimWorld/Bill_Production.cs`, `RimWorld/SkillRecord.cs`, `RimWorld/Pawn_GeneTracker.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: Persistence owner: preserve saved versus derived distinctions and failure boundaries; source order is not demonstrated crash safety.

## A05: PARTIAL

Work givers build jobs after actual eligibility, drivers coordinate reservations/toils and fail on lost state. Teacher and student use paired targets and actual active jobs. Think-tree composition, pathfinder and full faction autonomous lives are unread.

Evidence: `RimWorld/WorkGiver_DoBill.cs`, `RimWorld/WorkGiver_Researcher.cs`, `RimWorld/JobDriver_Lessongiving.cs`, `RimWorld/JobDriver_Workwatching.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: NPC work owner: use the same predicates and current stock; skill means owner: reserve real participant time.

## A06: PARTIAL

Source shows disabled work choices, per-bill filters/counts, multiple research locked reasons, skill saturation text and desire icons. Work nulls can be omitted, while research reasons accumulate. No layout/keyboard or actual desktop screenshot was captured.

Evidence: `RimWorld/FloatMenuOptionProvider_WorkGivers.cs`, `RimWorld/Dialog_BillConfig.cs`, `RimWorld/MainTabWindow_Research.cs`, `RimWorld/SkillUI.cs`, `RimWorld/Need_Learning.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: UI scale/theme owners: parallel useful panels at 1366x768, truthful unavailable labels, text plus status color.

## A07: PARTIAL

Definitions declare workers, prerequisites and component fields; mods load content and XML patches, with validation in definition classes. Inventory includes abstract templates and raw nodes. Full inheritance resolution, mod APIs and load-order conflicts are unread.

Evidence: `Verse/LoadedModManager.cs`, `Verse/ResearchProjectDef.cs`, `Verse/GeneDef.cs`, `Data/*/Defs`, `Data/*/Patches`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: Engine authoring: validate content and stable references; avoid treating a declared field as a working consumer.

## A08: PARTIAL

Selected passion, saturation, level XP, research tech penalty, blackboard bonus and book ceiling formulas are shown. Their constants belong to this game. Full quality probability, economic balance and RNG seeding/pity audit is unread.

Evidence: `RimWorld/SkillRecord.cs`, `Verse/ResearchProjectDef.cs`, `RimWorld/LearningUtility.cs`, `RimWorld/BookOutcomeDoerGainSkillExp.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: Skills/technology owners: quote actor-specific rates and route ceilings only if authored; do not copy donor balance.

## A09: PARTIAL

Ticks drive work and desires; selected XP reset is checked at local midnight with a minimum elapsed interval; lessons and techprints have distinct timing. No full offline catch-up path or all queue policy audit performed.

Evidence: `Verse/TickManager.cs`, `RimWorld/Pawn_SkillTracker.cs`, `RimWorld/Pawn_LearningTracker.cs`, `RimWorld/JobDriver_ApplyTechprint.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: Clock and chain owners: name causal boundaries; source tick counts do not authorize closed-browser progress.

## A10: PARTIAL

Concept opportunities and demonstrated knowledge participate in contextual lessons; research visibility includes hidden project rules. Full tutorial campaign/reveal-order audit is unread.

Evidence: `RimWorld/LessonAutoActivator.cs`, `Verse/ResearchProjectDef.cs`, `RimWorld/MainTabWindow_Research.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: Onboarding and means owners: reveal a known actionable next step without leaking hidden alternatives.

## A11: PARTIAL

Ingredient radius overlay, current/target line, applied-item sound/progress bar, teacher/skill report and reader-specific book benefits are shown in source. Accessibility and visual feedback behavior untested.

Evidence: `RimWorld/Dialog_BillConfig.cs`, `RimWorld/JobDriver_ApplyTechprint.cs`, `RimWorld/JobDriver_Lessontaking.cs`, `RimWorld/BookOutcomeDoerGainSkillExp.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: See SMALL_TOUCHES: extend existing work and lesson controls only where missing.

## A12: PARTIAL

Raw definition census exposes many additional systems. Gene resources and health-part readers were sampled; ideology, anomaly containment, royalty status/psycasts, Odyssey travel, trade and combat breadth remain unread.

Evidence: `Data/Biotech/Defs/GeneDefs`, `Data/*/Defs`, `RimWorld/Gene_Hemogen.cs`, `Verse/HediffSet.cs`. Shown: named source structure. Inferred: YAIRPG transfer suitability.

PROPOSAL: Body/genetics owners: one source-qualified usable trait reader first; wider systems remain options, not first-slice gates.
