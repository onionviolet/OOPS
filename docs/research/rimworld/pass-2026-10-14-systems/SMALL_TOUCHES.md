# Small touches

SHOWN column cites source intent. Suggested affordances are INFERRED PROPOSALS; appearance/readability were not observed. YAIRPG use stays desktop first, 1366x768, with mobile deferred.

| Code | Area | Proposed useful touch | Route | SHOWN source |
|---|---|---|---|---|
| T01 | Body function | Explain a blocked hand task through the named injured part and dependent capacity. | S01 | `PawnCapacityUtility.CalculateCapacityLevel` |
| T02 | Anatomy | Keep a graft’s identity separate from its current effective function. | S01 | `PawnCapacityUtility.CalculatePartEfficiency` |
| T03 | Modifier order | Show base, offset, factor and cap without converting them to an unexplained rank. | S01 | `PawnCapacityUtility.CalculateCapacityLevel` |
| T04 | Treatment | Preview doctor, medicine, bed and self-care contributions before spending. | S02 | `TendUtility.CalculateBaseTendQuality` |
| T05 | Two clocks | Show treatment expiry next to recovery/immunity, because one does not replace the other. | S02 | `HediffComp_TendDuration.CompTended / ImmunityRecord.ImmunityTickInterval` |
| T06 | Stable case | Retain a case’s random factor over reload instead of rolling a new prognosis. | S02 | `HediffComp_Immunizable.CompExposeData` |
| T07 | Substances | Present immediate benefit and accumulated tolerance separately. | S03 | `CompDrug.PrePostIngested` |
| T08 | Use policy | Show intended repeat policy apart from the last actual use receipt. | S03 | `Pawn_DrugPolicyTracker.ExposeData` |
| T09 | Body scale | Use the actual body when a substance route explicitly scales by body size. | S03 | `IngestionOutcomeDoer_GiveHediff.DoIngestionOutcomeSpecial` |
| T10 | Directed feeling | Keep who feels what toward whom visible without forcing symmetry. | S04 | `InteractionWorker_RomanceAttempt.SuccessChance` |
| T11 | Social continuity | Keep direct ties and episodic memories as separate records. | S04 | `Pawn_RelationsTracker.AddDirectRelation` |
| T12 | Repeat route | Use a retained cooldown anchor rather than a permanent done flag for repeatable actions. | S04 | `InteractionWorker_RomanceAttempt.Interacted` |
| T13 | Stress | Distinguish approaching exposure, chance of response and an active response. | S05 | `MentalBreaker.MentalBreakerTickInterval` |
| T14 | Attribution | Treat a displayed final straw as an explanation sample, not a uniquely proven cause. | S05 | `MentalBreaker.RandomFinalStraw` |
| T15 | Training | Display wanted, partial practice and learned as separate values. | S06 | `Pawn_TrainingTracker.Train` |
| T16 | Prerequisites | Selecting a training goal can queue its genuine prerequisites. | S06 | `Pawn_TrainingTracker.SetWantedRecursive` |
| T17 | Command means | Show missing handler, different place and command range as specific reasons. | S06 | `Pawn_TrainingTracker.CanDoAttackTarget / GetGizmos` |
| T18 | Service | Display a free cooldown route and an optional paid early route together. | S07 | `RoyalTitlePermitWorker.FillAidOption` |
| T19 | Delivery | Keep requested aid distinct from delivered aid and consumed entitlement. | S07 | `RoyalTitlePermitWorker_CallAid.CallAid` |
| T20 | Jurisdiction | A credential can remain owned while a destination cannot supply its service. | S07 | `RoyalTitlePermitWorker.AidDisabled_NewTemp` |
| T21 | Resources | Place focus reserve, load and recovery next to the next useful cast. | S08 | `Pawn_PsychicEntropyTracker` |
| T22 | Queue quote | Include already queued commitments in the visible cost where the host does so. | S08 | `Psycast.GizmoDisabled` |
| T23 | Applicability | Explain a target immunity separately from lack of knowledge or payment. | S08 | `Psycast.CanApplyPsycastTo` |
| T24 | Trade | Expose named price modifiers and the actual rounding route. | S09 | `TradeUtility.GetPricePlayerBuy / GetPricePlayerSell` |
| T25 | Stock | Label generated restock honestly instead of implying unseen manufacturing. | S09 | `Settlement_TraderTracker.RegenerateStock` |
| T26 | Passive work | A travel contribution panel can name each capable contributing actor. | S10 | `ForagedFoodPerDayCalculator.GetForagedFoodCountPerInterval` |
| T27 | Capacity | Show when cargo space clips output even though the timer still advances. | S10 | `Caravan_ForageTracker.Forage` |
| T28 | Standing | Separate effective goodwill, retained kind and situation caps. | S11 | `FactionRelation.CheckKindThresholds / GoodwillSituationManager` |
| T29 | Growth | Show paused growth separately from deteriorating plant health. | S12 | `Plant.GrowthPerTick / CurrentDyingDamagePerTick` |
| T30 | Durable choices | Retain selected quest actors and deadlines so reopening cannot reselect them. | S15 | `QuestGen.Generate / QuestNode_Delay.RunInt` |
