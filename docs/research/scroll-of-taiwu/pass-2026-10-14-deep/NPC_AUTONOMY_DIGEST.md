# NPC decisions, bonds and institutions

Evidence: shown static managed bodies unless explicitly marked inferred. New extract root is `/Users/weiwei/.codex/research/taiwu-2/extract/`; `prior:` means the reused read-only `/Users/weiwei/.codex/research/taiwu/extract/`. These locators are private evidence, not files shipped in the dossier. No NPC behavior was observed in a running game.

## N1: Goal choice and action choice are different

`CharacterActionPlanner.Initialize` loads 276 PlanningGoal and 389 PlanningAction definitions, reflects concrete implementations from GameData.ActionPlanning.ActionImpl, builds condition/effect links and checks reachability. Sensor registrations cover character, skills, attributes, profession, resources, organization, target, goal arguments and triggers. Counts are all-row structural checks; they do not prove every definition is implemented or reachable. Missing implementations are filtered from Build.

`CharacterGoalData.GetPriority` adds BasePriority, per-instance PriorityDelta, the character's morality/behavior priority and settings adjustment. `ActionPlanningData.UpdateCurrentGoalsByPriority` selects primary and secondary goals, gives prioritized goals special treatment, excludes achieved/unreachable goals and records replaced goals. This is an explicit ranked selector, not a single undifferentiated utility score for every action.

The actual `CharacterPlanningAgent` constructs `WeightBasedPathfinder`, even though an AStarPathfinder also ships. `ActionPlanner.Build` indexes actions by effects and nodes by required conditions. Its neighbors are candidate actions that can satisfy unmet states. The weighted search recursively regresses requirements, simulates effects in copied state memory, samples positive-weight candidates, removes failed candidates and stops at the configured depth. Action weight uses the chosen personality dimension, behavior weights and settings. It is neither proven minimum-cost A* nor an LLM agent. Its pathfinder owns a separate random source; deterministic replay is not established.

`prior:Character.OfflineUpdatePrioritizedGoals` classifies related targets and creates or recreates prioritized goals according to row flags. Invalid location, restricted relation state and infancy suppress this path. `OfflineUpdateCurrentGoal` removes timed-out/invalid goals, resets unreachable markers and chooses current goals again. In `OfflineUpdateCurrentGoalActions`, existing valid actions can persist; old plans are reassessed before replanning. Failed planning marks the goal unreachable for the current selection. It is not permanent life failure.

## N2: Actions do real work

`prior:Character.ExecuteAction` checks validity and cooldown, starts an action only with the available action points, calls implementation OnStart, then progresses the action. Complement methods perform mutations and interruption cleanup. ActionPlanningData serializes goals, interrupted actions, both point pools and cooldown dates. Travel and death invoke implementation hooks. No save compatibility or scheduler performance proof follows from serialization code alone.

`GameData.ActionPlanning.ActionImpl.dll.cs:StudyDemandReadCombatSkillAction` finds a page the learner has not read and a target who knows its exact internal page variant. It retains BookItemKey, InternalIndex and AgreeToRequest. Help acceptance depends on directed favor and behavior. CheckValid rechecks ownership in inventory or village treasury and whether the page remains unread. A player-target request produces a monthly event rather than silently deciding the player's answer.

`StudyDemandRequestCombatSkillAction` separates consent from comprehension. Acceptance uses GetAskToTeachSkillRespondChance; success then uses qualification, attainment, personality and grade. Successful player learning can create a demanded manual; the NPC path sets reading/learning state and records the result. `TeachCombatSkillAction` and `StudyDemandBreakingAction` are separate concrete actions. Request, deception and theft implementations also exist, but their complete balancing/target policies were not all read.

`IdentityActionTeachSectMembers`, `IdentityActionSelfSectSkillsImprove`, `IdentityActionLooping`, protection, rescue, revenge and return-home bodies provide distinct duties and goals. Their existence does not mean every NPC performs them every month. Full selectors and row reachability are still needed for an exhaustive action atlas.

## N3: Social life has its own monthly pass

`prior:Character.PeriAdvanceMonth_RelationsUpdate` works with potential nearby related characters, newly met people and separate start/end candidate lists. `GetStartOrEndRelationTarget` first checks a personality-based change chance, chooses a candidate, then checks a relation-specific chance using existing relation and inter-sect favor. Mutual feeling is checked separately for adoration. The pass can form/end enemies, adoration, dating, marriage and adoption ties. It collects modifications; complement code applies them and routes player-involved cases into events.

`ApplyBecomeHusbandOrWife` validates relation legality again. Success creates spouse relations, adds directed favor, happiness, a life record and a knowledge record, updates institutional membership and adds goal272. Failure changes favor/happiness and may prompt another love goal or hostility. Thus NPC marriage has an executable transaction, which the Tale and Immortal Life dossiers did not recover for their games.

`prior:CharacterDomain.UpdateDistantMarriages` is an additional demographic path. It iterates actors and uses marriage-age-group probability, then seeks same-area, same-state and neighboring-state candidates in that order. CanStartDistantMarriage excludes the village/unaffiliated/sect cases, nonprincipal office holders, unavailable actors, monks, existing live spouses, bisexual characters, party members and temporary actors; it also requires a settlement role with ChildGrade entries and a regular map area. These are source-specific restrictions, not proposals for YAIRPG.

CanBeDistantMarriageTarget adds opposite-gender, institution, rank/age, relation-legality and family-enmity checks. Comparison uses candidate interaction grade, younger age, a calculated relation success score and ID tie break. A sufficiently favorable relation toward Taiwu pauses into an advice event. ProcessDistantMarriage adds reciprocal goal272, spouse relations and institutional changes. This path does not replace ordinary nearby relationship formation.

## N4: Sect politics is more than support

`prior:OrganizationDomain.UpdateFactions` checks existing allegiance against directed favor thresholds, finds influential potential leaders, attempts faction formation and recruits others. TryCreateFaction uses behavior-specific chance, writes leader membership and records the event. OfflineJoinFaction and OfflineExpandFaction use relation-type priority, behavior and favor. Factions are local member coalitions, not proof of an autonomous grand-strategy war planner.

`OnSectMemberCrimeMadePublic` checks that the accused still belongs to the institution where the act occurred, resolves jurisdiction, uses severity/behavior escape chance and either punishes, relocates/arrests, expels or adds a bounty. Prison and punishment routines are separate. Office succession, every school tradition and all punishment rows remain incomplete. `OnCharacterDead` delegates to ClearOrganizationStatus, which removes membership, bounty/prison state and feast participation.

## N5: Age, birth and death

`prior:Character.OfflineIncreaseAge` runs on birth month, always increments actual age and increments current age unless stopped. A special effect can add a second current-age increment. Age change can reveal potential features and replace clothing, while preserving the deficit in current attributes relative to changed maximums. A birthday can also change an expired hobby and related favor.

`OfflineUpdatePregnantState` skips a pregnancy update during cross-area movement, calls CharacterDomain.ParallelUpdatePregnantState, dispatches newborn creation, handles child loss and can set the mother's health to zero. The latter handler checks expected birth date, health ratio below 0.3, infection and random outcomes; health needs can produce goal227. Child identity and social parent links are resolved separately in ParallelCreateNewbornChildren, including institution/monk/spouse checks. Full genetics and population replenishment are still unread.

`prior:Character.GenerateBequest` is separate from Taiwu succession. Nonboss death can generate manuals from sufficiently read knowledge, with page condition influenced by attainment. DivideBequest unequips eligible gear, collects transferable inventory, takes behavior-specific private/public shares and chooses institutional potential successors plus qualifying living relations. The first institutional candidate is entered twice. Items use grade-based probability; Taiwu receives a deferred bequest record, others receive inventory and life records. Unallocated generated manuals are removed; some remaining items enter treasury. This is not automatic wholesale transfer to a biological heir.

Inference: a bounded cast can feel alive through three coordinated mechanisms, planned needs, local social rolls and institutional/demographic phases. Implementing every world citizen is not required to adopt one useful loop.

## N6: Two traced goal creators

`PrioritizedGoalCreation.ProtectFriendOrFamily` checks that a target is under vengeance, alive, not captive, not in the same party, not fully infected, and reachable within90 travel-time units across areas. An actor whose role forbids strolling needs favor type5; its final roll uses favor×20-40 before adding goal262. `GetRevenge` excludes village actors, uses behavior and role/special-effect chances, finds a living noninfant uncaptured enemy below its favor threshold within the same travel bound and adds goal274. These examples close the decision-to-goal link for protection and revenge; they do not establish a universal90-day world travel rule.
