# RimWorld deep aspects, 2026-10-14

Delta to [prior 1.7 aspects](../../aspects-2026-10-14/ASPECTS.md). All evidence below is **SHOWN static source/data** unless explicitly prior/STATED or INFERRED. Covered means the bounded named route, not exhaustive whole-game coverage. Native launch is forbidden. Full sources reside in `~/.codex/research/lib-rimworld-deep/extract/`; raw dialogue/notes stay private.

## A01: Dialogue and conversation

**Status: partial. SHOWN:** Prior 1.7 aspect pass traces social grammar and faction choices. This deep pass adds study-note participant attribution and ritual participant memories, not a new conversation tree. Full builders/portraits remain unread.

Implementation: `RimWorld.CompStudyUnlocks`, `RimWorld.RitualOutcomeEffectWorker_FromQuality`.

**INFERRED takeaways:** K6/K11/K20/K23; P19/P20/P21; keep events separate from wording.

## A02: Narrative delivery

**Status: covered. SHOWN:** Study thresholds create dated retained notes; ritual outcomes send sourced reports; successful incidents update history. Prior quest lifecycle is reused as prior evidence, not retraced for every script.

Implementation: `RimWorld.CompStudyUnlocks`, `RimWorld.RitualOutcomeEffectWorker_FromQuality`, `RimWorld.StoryState`.

**INFERRED takeaways:** K11/K12/K21/K23; P11/P12/P20; reading does not repeat the consequence.

## A03: Implementation architecture

**Status: covered. SHOWN:** Current managed domain classes use Defs, worker/components, object trackers, staged toils and one tick manager. Independent XML census covers 14,084 raw Def children/254 families. Prior aspect host/.NET 10 Waylith finding is inherited; the gameplay decompile route succeeds here.

Implementation: `Verse.TickManager`, `RimWorld.StudyManager`, `Verse.GenRecipe`.

**INFERRED takeaways:** K1/K18/K33/K34; P16/P22; definitions, instances and projections differ.

## A04: Save and persistence

**Status: partial. SHOWN:** Deep bodies retain separate gene channels; ship serializes objects and coordinates; study saves thresholds/notes; bills save intent; StoryState saves successful history. Framework recovery is prior evidence. No roundtrip or migration execution.

Implementation: `RimWorld.Pawn_GeneTracker`, `RimWorld.Planet.Gravship`, `RimWorld.CompStudyUnlocks`, `RimWorld.Bill_Production`, `RimWorld.StoryState`.

**INFERRED takeaways:** K18/K33; P05/P23/P24; existing native envelope remains authoritative.

## A05: AI and NPC behavior

**Status: covered. SHOWN:** Work selector consumes priorities, targets and reservations; study jobs reserve subject/platform; workwatching and lessons require actual means. Full faction/group AI, pathfinding and all escape behavior remain unread.

Implementation: `RimWorld.JobGiver_Work`, `RimWorld.WorkGiver_DoBill`, `RimWorld.JobDriver_StudyInteract`, `RimWorld.LearningGiver_Workwatching`.

**INFERRED takeaways:** K6/K8/K13; P01/P06/P25; share lawful action predicates.

## A06: UI and information design

**Status: partial. SHOWN:** Source has stock/repeat controls, forced-menu fail reasons, learning need/desire icons, growth choices, retained study letters and ritual reports. Several automatic job failures have no detailed reason. Native appearance and accessibility unrun.

Implementation: `RimWorld.Bill_Production`, `RimWorld.WorkGiver_DoBill`, `RimWorld.Need_Learning`, `RimWorld.ChoiceLetter_GrowthMoment`.

**INFERRED takeaways:** K14/K30/K34; P01/P04; 1366x768 useful context/action/reason view, mobile deferred.

## A07: Content authoring and modding

**Status: covered. SHOWN:** Gene/xenotype, precept/meme, knowledge/research, recipes, layer and storyteller records configure consumers. Raw census includes abstract/inherited rows; drug recipeMaker adds generated recipes beyond explicit RecipeDef rows. Effective mod activation/patch resolution unrun.

Implementation: `Verse.GeneDef`, `RimWorld.MemeDef`, `RimWorld.PreceptDef`, `RimWorld.PlanetLayerDef`, `Verse.ResearchProjectDef`.

**INFERRED takeaways:** K1/K2/K33/K34; P16/P22; count authoring declarations separately from resolved content.

## A08: Balance and numbers

**Status: covered. SHOWN:** Inheritance chances and bounded metabolic retries, tier thresholds, containment margin curves, stock hysteresis, population intent, threat budget and final event weight are distinct numeric models. None is a universal YAIRPG budget.

Implementation: `RimWorld.PregnancyUtility`, `RimWorld.GrowthUtility`, `Verse.ContainmentUtility`, `RimWorld.StorytellerUtilityPopulation`, `RimWorld.StorytellerComp`.

**INFERRED takeaways:** K3/K10/K22/K32; P08/P10/P17; label units, relative weights and intervals.

## A09: Time and scheduling

**Status: covered. SHOWN:** Loaded maps share game ticks; gravship travel consumes tick intervals; study has completion/cooldown; growth uses biological age; incidents use MTB or seeded cycles. Browser-closed catch-up and independent universe clocks are not shown.

Implementation: `Verse.TickManager`, `RimWorld.Planet.Gravship`, `RimWorld.CompStudiable`, `Verse.Pawn_AgeTracker`, `RimWorld.IncidentCycleUtility`.

**INFERRED takeaways:** K5/K18/K26/K32; P13; declare consumed and inactive-clock policy.

## A10: Onboarding and reveal

**Status: partial. SHOWN:** Study admission and resolved note thresholds reveal subject information; monolith level can gate study; childhood milestones broaden options; orbit selection requires a world object. Full tutorial progression and every DLC introduction unread.

Implementation: `RimWorld.CompStudiable`, `RimWorld.CompStudyUnlocks`, `RimWorld.ChoiceLetter_GrowthMoment`, `RimWorld.OrbitLayer`.

**INFERRED takeaways:** K4/K11/K14/K30; P03/P04; reveal by actual route, no hidden alternative leak.

## A11: Little touches

**Status: covered. SHOWN:** Thirty-six sourced proposal rows in SMALL_TOUCHES distinguish pauses, counts, known blockers, role grants, note retention, departure disposition and successful occurrence. Intended affordances are source evidence only.

Implementation: `RimWorld.Bill_Production`, `RimWorld.Precept_Role`, `RimWorld.CompStudyUnlocks`, `RimWorld.Storyteller`.

**INFERRED takeaways:** K14/K21/K25/K26; source whole-game presentation remains unrun.

## A12: Other systems

**Status: partial. SHOWN:** This delta covers mobile spatial homes, genetics, childhood development, institution rules, containment and study. Royalty, combat/body/medicine breadth, detailed economy, all world generation and mod internals remain inventoried or prior evidence.

Implementation: `RimWorld.Planet.Gravship`, `RimWorld.Pawn_GeneTracker`, `RimWorld.Ideo`, `RimWorld.CompHoldingPlatformTarget`.

**INFERRED takeaways:** K2/K3/K7/K9/K15/K22/K25; NEW RW-D2/RW-D3/RW-D4 subcases, broader options stay reachable.
