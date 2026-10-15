# Three previously undocumented deeper systems

These are selected by payoff to YAIRPG, not size alone. Previous lanes decoded their data but did not document these decision paths. **Shown** statements below cite inspected source; **inferred** gives design meaning; **PROPOSALS** are unaccepted. Data counts for each related table are in CENSUS and SYSTEM_INVENTORY. All formulas and cases are source-only, with no game execution.

## D1. NPC schedules, confidence and changing preferences

**Shown sources:** GameLogic.dll/Academagia.AI/{AISystem,AIStateBag,AIHelper,AITableEx,AIOptionState}.cs, Academagia.Scheduler/ActionScheduler.cs and GameSystems/GameController.cs. Students have personal, interests, studies, goals and vendetta table references plus magnitudes. AISystem initializes a state bag for each student and saves those bags.

The scheduling path first processes emotional states, gathers the actor's own available options and wraps them with the same prerequisite system used by gameplay actions. Options are limited to normal-use actions, and subsequent slots exclude already installed actions. Controlled slots and special court/exam/attend-duel actions resist replacement. SetAction distinguishes vendetta response, hostile-action response and ordinary activity, tries a route up to three times, and ordinary selection fills Rest slots rather than casually replacing every class.

Ordinary selection draws 1–100 and subtracts Interests, Studies and Personal magnitudes in that order; the remainder selects GoalAI. Within the chosen table another percentile chooses an effect/goal using adapted values, with end-of-list fallback. GoalAI can select the student's current GoalStep. Erraticity can select a random valid option. Otherwise candidates must match the sought effect and action-type restrictions, and receive a preference value beginning with confidence minus five. Personality preferences add values for matching unconditional and roll-conditioned effects; the highest sorted candidate wins.

Execution updates are consequential: success increases action confidence and selected effect/goal preference, while a failure reduces confidence and, once it reaches zero or less, reduces preference. Vendetta routes also change prosecution chance. AIStateBag saves option states and adapted effect/goal values. This is an authored adaptive selector, not a demonstrated general-purpose planner with long-horizon search. The source also contains a skill-step fallback assignment in GetAITableOption followed by a null return in that branch; merely finding the fallback helper does not prove it is used successfully.

**Inferred payoff:** people can learn that a method works and choose differently tomorrow using existing action rules. Counterexample: a fixed schedule or authored goal table does not establish an NPC economy, independent life simulation or unlimited strategic reasoning.

**PROPOSAL D1-P:** `docs/CHARACTERS_AND_WORLD_EVENTS.md` and ENGINE_EXPANSION: persist each recurring actor's current intent, method confidence and recent result; let a bounded candidate list use actual prerequisites and consequences. Acceptance: a failed method changes a later useful choice, a control/appointment is respected, and save/reload/import keeps the memory. Defer all-NPC planning and extensive combat AI.

## D2. Research reserves, thresholds and perk acquisition

**Shown sources:** GameSystems/ResearchSystem.cs, Effects/ResearchImpl.cs, Wrappers/ResearchEffectEx.cs, ContentModel/{Skill,Topic,SkillLevelThreshold,SkillPerk}.cs. Research accepts only a marked research skill, checks the actor's skill prerequisite and prevents player research into AI_-prefixed skills. It ensures an ActorSkill exists at level zero, then looks for the threshold for current level +1.

Let R be saved accumulated research points, P the current attempt power and T the next level's threshold. If P+R ≥T, set the next level, apply its skill perk and clear R. Otherwise add P to R and report necessary points T−R. The method advances at most one level per call and does not carry excess points into the next level. If there is no next-level threshold, it returns false without adding points. Its dictionary persists per ActorSkill, rather than reconstructing progress from narration.

ResearchImpl targets Topics, uses execution-context Power and reports failure when no level was gained. That failure can still have deposited progress. It is therefore wrong to infer “nothing happened” from the effect's failure status. Feedback can use IsGainedLevel/NecessaryPoints to explain the distinction. Perk application makes a threshold more than a display badge, but exact rewards remain topic-specific authored data.

**Inferred payoff:** uncertain active research can still produce steady cumulative progress, and earned research opens specific content. This is not a global RNG pity system; it is a resource accumulation rule. A public success status must be interpreted alongside changed state.

**PROPOSAL D2-P:** ENGINE_EXPANSION, ABILITY_AUTHORING and knowledge owner: separate attempt result, gained progress and breakthrough. Use stable research targets, visible remaining work where appropriate, and a real unlocked technique/job/knowledge consumer. Preserve YAIRPG's accepted idle routes through queued work or sustained conditions; do not transplant the source's one-level call or discarded excess as fixed design limits. Acceptance: several partial attempts produce persisted progress, then a native breakthrough opens a useful action.

## D3. Components, knowledge and spell interception

**Shown sources:** GameSystems/SpellSystem.cs, Wrappers/{SpellEx,PhemeEx}.cs, Academagia.Storage/SpellExecutionContext.cs, Effects delay/absorb/deflect implementations and ContentModel/{Spell,Pheme,PhemeEffect,PhemeSpellType}.cs. The prior lane counted the spell schema but did not trace these interactions.

Execution checks charge and requires Full information about each required pheme for a Character caster. Required components are a **multiset**: a repeated component requires matching multiplicity, not just membership in a set. Additional phemes increase each existing roll result's target power by the sum of their PhemeEffect thresholds. Opposing additional components remove matching non-opposing components by spell type and magnitude, after which required-component validity is checked again. Additional effects attach when a cast roll result succeeds.

Interception is a separate active-effect route. A matching inactive Delay effect targeting the initiator can put the cast context in Waiting, start the delaying condition and register a destruction callback. Saved condition GUIDs reattach those callbacks on load. Absorb checks effect power against cast power, positive capacity and target overlap, then consumes matching components; in combat it can add absorbed components to a character palette. Component removal can leave a cast missing required phemes. Execution also has deflection, charge spending, temporary duration conditions and a reprimand chance for character casts.

These findings explain source-specific counters and retained pending work. They do not establish every duel round, palette cost, targeting edge case, opposition formula, stacked delay or cancellation order. Full combat/range math remains unread. The invalid-wrapper guard's condition also deserves a future isolated edge-case check rather than being declared a proven runtime crash from source alone.

**PROPOSAL D3-P:** ABILITY_AUTHORING and ENGINE_EXPANSION: represent a composed power's required parts, knowledge, target scope, cost and pending state separately. Give a counter an explicit operation such as delaying execution or removing a required part, with observable changed aftermath. Acceptance: an original two-part ability works normally, loses a required part under a meaningful counter, and a delayed valid attempt survives reload/import with the right result. Defer a universal Academagia-style magic palette and any copied spells.
