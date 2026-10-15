# Small touches

Each row is an **INFERRED YAIRPG proposal** from the named **SHOWN static source detail**. No native UI feel, accessibility or gameplay verification is claimed. Sources use private extract/source unless an XML definition is named. Use existing panels at laptop size; mobile is deferred.

| Code | Small touch | Source symbol / limit | Route |
|---|---|---|---|
| ST01 | Count intent separately from the finished result | Bill_Production.ShouldDoNow | P01; K14 |
| ST02 | Show player pause differently from missing means | Bill_Production.ShouldDoNow | P01/P08; K26 |
| ST03 | Show target stock and lower resume threshold together | Bill_Production fields | P08; K9 |
| ST04 | Name the counting scope beside a stock target | RecipeWorkerCounter.CountProducts | P08; K9 |
| ST05 | Define whether stock counts stacks, objects or units | RecipeWorkerCounter.CountValidThings overloads | P08; K34 |
| ST06 | Show a known missing skill without disclosing hidden recipes | WorkGiver_DoBill.StartOrResumeBillJob | P01/P04; K14 |
| ST07 | Keep unavailable-reason as a truthful state | WorkGiver_DoBill.JobOnThing early exits | P01; K14 |
| ST08 | Avoid hammering an expensive failed ingredient search each tick | WorkGiver_DoBill failed-search delay | P08; K34 |
| ST09 | Do not let inspecting a job change its pause state | Bill_Production.ShouldDoNow writes paused | P01; K34 |
| ST10 | Resume actual unfinished work rather than charging full inputs again | WorkGiver_DoBill unfinished branch | P08; K9 |
| ST11 | Explain a competing reservation when it is known | WorkGiver_DoBill medical reservation branch | P01/P06; K8 |
| ST12 | Preserve ingredient provenance in a produced item | GenRecipe.MakeRecipeProducts | P02; K9 |
| ST13 | Separate produced, stored and delivered results | Toils_Recipe.FinishRecipeAndStartStoringProduct | P18; K9 |
| ST14 | Use a proper ingredient-value unit in recipe text | Recipes_Meals IngredientValueGetter_Nutrition | P02; K14 |
| ST15 | Warn before an allowed salvage action yields no material | Recipes_Production SmeltOrDestroyThing | P18; K9 |
| ST16 | Keep a faculty present while explaining why it is inactive | Gene.Active | P04; K22 |
| ST17 | Tag inherited versus installed source explicitly | Pawn_GeneTracker endogenes/xenogenes | P05; K22 |
| ST18 | Keep xenotype name distinct from the underlying body build | SetXenotype versus SetXenotypeDirect | P16; K22 |
| ST19 | Show future activation through a known age rule only | GeneDef.minAgeActive | P04; K22 |
| ST20 | Save a pending developmental choice instead of rerolling it | ChoiceLetter_GrowthMoment.ExposeData | P03; K18 |
| ST21 | Make work observation depend on a real nearby activity | LearningGiver_Workwatching.AdultToWorkwatch | P03/P09; K26 |
| ST22 | Make lesson availability depend on actual people and space | LearningGiver_Lessontaking.CanDo | P03/P06; K8 |
| ST23 | Mark temporary role abilities with their granting source | Precept_Role.FillOrUpdateAbilityList | P07; K7 |
| ST24 | Retire role-derived work/ability caches on role loss | Precept_Role notifications | P07; K7 |
| ST25 | Keep ritual outcome and participant memory linked | RitualOutcomeEffectWorker_FromQuality.Apply | P12; K21 |
| ST26 | Distinguish a date ritual from an anytime ritual | Precept_Ritual.TipLabel | P13; K21 |
| ST27 | Keep the original observation and its delivered note separate | CompStudyUnlocks.RegisterStudyLevel | P11/P20; K11 |
| ST28 | Retain rolled study thresholds across reload | CompStudyUnlocks.PostExposeData | P03; K18 |
| ST29 | Show subject cooldown separately from permanent study completion | CompStudiable fields | P03; K11 |
| ST30 | Explain a containment margin as risk/yield, not a hard certainty | ContainmentUtility curves | P17; K10 |
| ST31 | Name what stays behind before a crossing commits | TakeoffEnded/AbandonMap | P05; K15 |
| ST32 | Carry recent pacing history with the actual traveler carrier | Gravship constructor StoryState copy | P10; K32 |
| ST33 | Let destination environment read the retained body protection | VacuumUtility.PawnVacuumTickInterval | P14; K2/K22 |
| ST34 | Store event attempt separately from successful history | Storyteller.TryFire | P10; K12 |
| ST35 | Treat repeated-event weight and refire cooldown as distinct | StorytellerComp.IncidentChanceFinal/IncidentWorker | P10; K32 |
| ST36 | Use target-scoped eligibility cache keys | IncidentWorker same-tick subclass cache limitation | P10/P25; K34 |
