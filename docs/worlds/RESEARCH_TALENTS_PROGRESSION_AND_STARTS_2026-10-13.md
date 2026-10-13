# Research, talents, progression and starting play

Status: design considerations, 2026-10-13. Recommendations, not accepted defaults or implemented behavior.

Weibao asked: “Researching and more? Talents? HOw do we decide progression and starting gameplay and more? more aspects?” Research is interpreted here as in-game character research. This continues [choices and roguelike features](CHOICES_THAT_GATE_CHOICES_2026-10-13.md) without selecting every proposed feature for implementation.

## Existing owners and boundaries

[User vision](../USER_VISION.md) and [PROJECT.md](../../PROJECT.md) own accepted direction. [Skills and talents](../SKILLS_AND_TALENTS.md) distinguishes aptitude, faculty, learned technique, trait and social title. Research, skills and scales (local proposal draft: `world-depth-2026-10-13/14_RESEARCH_SKILLS_SCALES.md`) proposes questions, evidence, experiments, source attribution and partial understanding. [Ability authoring](ABILITY_AUTHORING.md) describes growth through new verbs, perceived distinctions, triggers, rules and capacity. [World completion](../WORLD_COMPLETION_STANDARD.md#random-starting-points-without-spoiling-discovery) requires coherent qualified starts with usable initial interactions. [Starts palette](../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md) separates random axes and continuation policies.

Those are design owners and proposals, not blanket evidence of current runtime behavior. This note reads their direction, not source code or browser behavior. No research subsystem, talent generation, random start or progression runtime was implemented or tested here. Paused work remains paused; the initial one-realm/one-prestige milestone is not expanded by this palette.

## P1: Decide the intended life before its progression numbers

Choose a represented world/era/premise, a kind of lived experience and the actions it needs. Researcher, craftsperson, traveler, institutional member and household life are possible experiences rather than compulsory classes. A life can mix them. Begin with observable differences: what the character can attempt now, what can improve, what can become possible later and why it matters.

Growth can independently change knowledge, reliable execution, methods, capacity, control, social access, resources and scale. A stronger character need not gain all of these together. A skilled outsider can lack credentials; a wealthy novice can buy tools without knowing how to use them. Social recognition only matters where an actual actor or institution reads it.

For each selected path, trace a usable beginning, a meaningful development and a useful mature state, including continuation or changed goals. These are authoring comparisons, not a mandatory three-rank ladder. Source worlds retain their own mechanisms and supported exceptions. Reading, practice, examination and awakening can coincide or be skipped when an actual mechanism permits it. Author functions before tuning XP thresholds, prices, probabilities and durations.

## P2: Make research change understanding and available methods

Example, original and hypothetical: a novice notices metal warping during a heat cycle. They ask why, consult an available manual or worker, compare samples, test one explanation and develop a more reliable procedure. That can open a new craft or improve a real existing action. Further experimentation might widen usable materials, teach another person or support a shop's production.

Research activities can include observation, reading, interviewing, measurement, comparison, deduction, experimentation, replication, invention and collaboration. Ordinary study learns existing answers; original research establishes something not already known to the character or their community. They can overlap, but should not share one compulsory points bar.

Retain useful failed tests and distinguish missing evidence, false inference, flawed measurement and unsuccessful execution. An inconclusive test need not be proof against a hypothesis. A confidence label is not hidden omniscience. A perfect-information power can genuinely remove uncertainty if its rules support that; ordinary research remains useful for questions outside its reach or for applying what was learned.

Give the player meaningful decisions when choosing questions, methods, resources, collaborators or uses. Established safe routines can be delegated or repeated under their actual means and clock policy. A research action should not demand repetitive manual guessing for every minor fact. Typed questions, if offered, need a supported interpretation rather than a promise of arbitrary invention.

Separate knowing, executing, reproducing reliably, teaching and scaling. A borrowed paper can explain a method without supplying its tools. A recipe can be correct while production remains unreliable. Results can matter through safer practice, a new technique, collaboration, recognition or ordinary satisfaction; not every observation needs a quest or stat reward.

## P3: Talents are different kinds of advantage

| ID | Kind | Hypothetical example | Progression question |
|---|---|---|---|
| T1 | Aptitude | Learns precision work unusually quickly | What gets easier to learn? This does not automatically supply current skill. |
| T2 | Faculty | Can perceive otherwise invisible energy | What becomes detectable or attemptable? Interpretation and control may still develop. |
| T3 | Affinity | Responds readily to a particular material or element | Does it affect efficiency, control, acquisition or potential under this world's rules? |
| T4 | Body foundation | An unusual constitution supports a different energy process | What substrate is actually present, and how can it develop or change? |
| T5 | Trait or habit | Remembers faces, works patiently, prefers late hours | Is it a mechanical effect, life texture or both? Avoid turning every personality trait into a modifier. |
| T6 | Exceptional grant | A memory archive or copying power | What exactly is granted now, how is it used and what can still grow? |

Talent can be known, latent, suspected, misunderstood, awakened, trained or transformed. These are possibilities, not mandatory stages for all talents. Discovery can happen through ordinary use, tests, teachers or events; pain and near-death are not universal awakening requirements.

Do not silently make talent an absolute ceiling, make every untalented path useless or require an offsetting flaw for every advantage. Where a world genuinely requires a faculty, ordinary practice need not substitute; alternate pursuits or means depend on that world. Likewise, a supported power can grant immediate mastery rather than being forced into a training ladder. Keep inherited talent, learned expertise and the player's knowledge distinct across lives.

## P4: Construct a playable start from coherent circumstances

Author compatible snapshots before random selection. Join body, life stage, place, era, social position, prior history, means, knowledge, relationships and obligations. Do not roll each independently and repair contradictions after launch. Unequal, strong, comfortable and dangerous starts are all valid when qualified.

The first playable scene should establish what the character can observe, an understandable action, an immediate reason to care and feedback that explains what changed. Where circumstances allow, offer different intentions rather than several buttons with identical outcomes: earn, learn, explore, connect, prepare, rest or leave. Survival is appropriate for a survival start, not the universal introduction to every world.

A veteran can begin with competence and relationships; a researcher can begin with a question and equipment; a dependent child needs meaningful age-appropriate interactions rather than a long forced wait. Starting history is authored background, not invented player-earned credit. Suspense can hide context and discoveries while keeping controls and known costs clear.

Use only the relevant systems initially. A research view becomes useful when a question exists; household controls become useful when the character can actually affect a household. Reveal reflects discovery or practical relevance, not automatic acquisition of a power. Exact timing targets should be chosen for the experience and tested, not applied as one rigid tutorial duration.

## P5: Compare connected lives before selecting defaults

Original hypothetical example, one town with three starts:

| Start | First meaningful play | Development | Useful maturity |
|---|---|---|---|
| Novice apprentice with material sense | Notice a defect, ask the mentor or test a sample | Interpret the sense and learn an improved procedure | Make difficult goods, investigate new materials or teach |
| Experienced smith without that faculty | Complete a commission, inspect ordinary evidence or organize supplies | Improve technique and acquire tools or collaborators | Run a workshop, mentor others or specialize |
| Well-funded newcomer | Choose a teacher, obtain equipment or sponsor a project | Learn practice while managing actual resources and relationships | Become a practitioner, organizer or patron |

These paths need not have equal strength, identical pacing or a common endpoint. Each should support actual meaningful play and explain what its advantage does. They may converge while preserving different skills, history and relationships. No universal obligation to earn money through menial tasks precedes research.

## Further aspects to select per world

| ID | Consideration | Decision that changes play |
|---|---|---|
| A1 | Baseline body and senses | Which everyday actions are possible, difficult or supported through another means? |
| A2 | Knowledge versus player familiarity | What can the character act on, and what does the player learn through the interface? |
| A3 | Talent discovery | What is initially known, and what evidence reveals an unusual capability? |
| A4 | Teachers and access | Which lessons can be self-taught, purchased, witnessed or learned socially? |
| A5 | Time and automation | Which tasks use attention, played time, delegated work or supported offline policy? |
| A6 | Resources and custody | Who owns the tools, samples, workspace and result? Which uses need permission? |
| A7 | Experiment scope | Are there authored options, bounded combinations or a supported invention grammar? |
| A8 | Collaboration and credit | Who contributes, knows the result, can repeat it and receives recognition? |
| A9 | Failure and revision | Can progress redirect? Which losses or wrong beliefs are recoverable? |
| A10 | Progression shape | Are paths parallel, sequential, branching, cyclic or source-specific? |
| A11 | Midlife and late starts | What useful gameplay remains without restarting every character as a novice? |
| A12 | Mature play | What new goals remain after an original obstacle is solved, without compulsory enemy inflation? |
| A13 | Cross-life and world carriers | What survives, where it resides and who can access it? |
| A14 | Presentation | Which visible change makes a new ability, insight or opportunity understandable? |

## Recommended selection and acceptance

For a selected slice, choose the intended experience and source-qualified start, trace a few connected opportunities, identify what changes capability versus information or access, then decide base/earned/exceptional/player-layer placement. Tune pacing after observing those actions together. Compare at least one contrasting start or alternate route when making a general placement claim.

A mature design does not require simultaneous maximum depth in every row. Selected implemented claims require an actual consumer, rebuilt desktop/laptop behavior and applicable persistence/compatibility evidence. Questions that remain unsettled should stay named as proposals rather than becoming compulsory gameplay gates. No tests or browser checks were run for this document-only analysis.

## Player-directed ideas, character initiative and upkeep

Weibao asked: “stuff the in game character comes up with versus we can impose on them? like making them look into nuclear physics as a victorian child or something, thoughts and suggestions? Features like food and stuff might seem tedius, more to consider? Save accordingly?” This section records that question and recommendations. It does not adopt a new default or change hunger, automation, actor knowledge or research runtime.

### I1: Separate the player's intention from the character's knowledge

A player can choose a surprising ambition without the character already knowing its solution or specialist vocabulary. Selecting “investigate the structure of matter” sets a pursuit; it does not automatically grant modern theories, equipment or experimental competence. The interface can accept the player's modern description while presenting character-appropriate next steps. This is an interface translation, not proof that the character possesses all information in the input.

An instruction can contain both intention and supplied information. Decide explicitly whether a mode treats the information as outside guidance, a thought the character is attempting to develop, or only a player-side label. Directing an ordinary character to explore a question need not be an in-world cheat. Giving them accurate otherwise unavailable facts is a different capability and needs an authored knowledge source, selected premise or explicit player-to-character channel.

For the hypothetical Victorian child, start from the selected household, education, available tools and setting rules. Offer supported routes such as asking a knowledgeable adult, obtaining introductory material, learning measurement or making an appropriate observation. The exact historical feasibility is not researched here, and no specific experiment or historical invention timeline is asserted. A genius premise, reincarnated knowledge, exceptional tutor or supplied archive can change the route. Do not enforce a universal age or era ban, promise an unsupported research result, or pretend ambition alone supplies a missing method.

### I2: Choose how much initiative the player delegates

| Mode | Player role | Character behavior |
|---|---|---|
| Direct | Choose concrete actions and pursuits | Character executes supported choices; unusual interests need not be rejected merely for differing from a generated personality. |
| Goal-directed | Set an aim, budget and boundaries | Character selects known supported steps and returns when a material decision exceeds those boundaries. |
| Autonomous, optionally advised | Observe or suggest while the character has a selected degree of independence | Character pursues interests and obligations; acceptance, refusal or reinterpretation of advice depends on this explicitly selected mode. |

These are alternatives or per-activity controls, not mandatory modes to implement together. Recommendation: direct choice for consequential moments with optional goal-directed routines. Do not silently replace ordinary player control with an NPC-like agent that vetoes choices. If personality resistance is desired, expose the contract and its consequences beforehand.

Character-generated ideas can arise from encountered problems, interests, observations, relationships, mistakes or opportunities. They should be useful suggestions, not proof that only the suggested paths are legal. An autonomous character should act within their actual knowledge and means rather than receive the designer's entire hidden catalogue. A generated idea is not automatically a discovered scientific truth.

### I3: Support surprising ambitions through bounded playable paths

Distinguish proposing a goal, investigating feasibility, finding a method and carrying it out. A player can name an advanced or unfamiliar objective; the game should explain the next supported investigation or the current limitation rather than simply offer instant completion. Free-text ideas require a bounded interpreter or supported authoring process. They cannot honestly promise every invention or arbitrary simulation.

Prefer several routes when the world permits them: self-study, collaboration, hiring expertise, acquiring a tool, traveling, or using a power. Do not manufacture a long prerequisite tree when existing means genuinely bypass it. Partial outcomes can be useful: better measurements, a failed hypothesis, a new collaborator or a simpler practical invention. The character may also change goals without losing every earned competence.

### I4: Treat food as several possible experiences, not one compulsory chore

| Food role | Useful decisions | Handling routine |
|---|---|---|
| Life texture | Meals with friends, local dishes, hospitality | Optional interactions; no necessary meter or penalty. |
| Household logistics | Provisioning, cost, storage and who cooks | Set a policy or routine using actual stock, money and available help. |
| Adventure preparation | Pack duration, weight, reliability and unusual conditions | Decide before departure; consume supplies automatically under selected rules. |
| Craft or livelihood | Cooking, farming, preservation, trade and experimentation | Food is the chosen pursuit, with useful methods and outputs. |
| Survival challenge | Scarcity, finding safe supplies and allocating limited stock | More detailed management in a selected fitting experience. |

Recommendation: ordinary secure living should require little attention. Surface a decision when conditions materially change, such as supplies running out, a new journey, a guest, a changed budget or an unusual dietary need. Avoid making an eat button recur every few minutes just to keep a meter full. Keep existing meals meaningful without adding a universal hunger tax.

Automation should use the player's selected policy, real resources and actual available means. Family meals, paid board, a stocked pantry, bought meals or a cook can support different routines. Abstract uninteresting consumption when the world permits it; do not force detailed procurement chains for every mundane meal. Once a character solves provisioning, let that solution work. A strong power can genuinely remove food scarcity within its reach.

### I5: Apply an attention test to other upkeep

Food, sleep, hygiene, gear repair, travel, bills and inventory can each be texture, strategic preparation, a chosen craft or a survival constraint. Decide their role per experience rather than automatically giving each a depleting meter. Existing default-off pacing features are not promoted to compulsory mechanics by this consideration.

Ask whether a repeated action produces a meaningful decision or merely acknowledges time passing. If the player will choose the same known safe response repeatedly, consider automation, batching, delegation, summary or removing that interaction. Keep an easy pause and an explanation of what a routine consumes or stops for. Do not manufacture inconvenience solely to sell its eventual removal as a cheat.

Further questions: how often a routine interrupts; whether it prevents pursuing the intended life; whether prosperity genuinely reduces upkeep; whether a return report is enough; whether autonomous spending stays inside budget; whether a risky activity needs explicit boundaries; and whether a cozy or research-focused experience can leave survival detail low while an expedition makes it important. No extra offline progression or unattended consequences follow without a selected supported clock policy.

### Recommended playable comparison

Use one hypothetical character with a player-directed unusual question, one idea suggested by lived experience and one established food routine. Compare direct action with bounded goal-directed execution. Observe whether the player makes useful decisions, understands what the character knows and can concentrate on the chosen pursuit. This is a proposed future comparison, not a new implementation assignment or performed playtest.
