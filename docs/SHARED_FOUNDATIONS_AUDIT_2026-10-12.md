# Shared foundations across worlds

Connected next-action plan: [micro/meso/macro, dialogue, cross-world reference,
game-research absorption and authoring-tool audit](reviews/FOUNDATIONS_DIALOGUE_AND_ABSORPTION_PLAN_2026-10-12.md).

2026-10-12. Bounded source audit and implementation proposals responding to
Weibao's questions about gender, starting conditions, randomization and other
systems needed across basically all worlds. This is a shared capability map,
not a new global fiction rulebook or an implementation dispatch.

## Existing authority and evidence

Read PROJECT.md, RULES_FROM_SCRATCH.md, STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md,
GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md and the starts/talents/continuity
checkpoint. Existing world and feature owners retain their scope. The working
tree has substantial unrelated edits and active integration areas; no runtime
files, existing plans or private saves were changed by this audit.

F1 Shared machinery must support local rules. The accepted rulebook makes
bodies consequential, allows world-specific sex/gender effects, excludes
real-world ethnicity from stats, and requires actual carriers for continuity.
Reusable records and transitions do not imply identical species, aging, magic,
economies, society or death rules across worlds.

F2 There is useful existing code. src/components/bio_component.js persists a
gender field; src/models/person.js shares inventory, equipment, progression and
biography between hero and NPC. src/simulation_contracts.js defines body,
knowledge, relationship, ownership, life and other operations. A gender field
alone does not establish pronoun handling, bodily effects or social reactions.
This inspection does not establish that those consumers are absent everywhere.

F3 src/structured_pack_runtime.js validates typed starts and commits a durable
selection before initialization. It currently selects an equal-width index
within one pack from state.rng and admits starts through a living native body
at base.frontier. This is a foundation, not evidence of a global weighted
world selector, arbitrary playable bodies or birth-to-death simulation.
tests/structured_origins.test.js contains receipt, retry, compatibility and
tampering cases. Tests and browsers were not run in this audit.

F4 The starts/talents/continuity checkpoint reports a separately verified
isolated connected slice and an open shared integration gate. Reuse its owner
and evidence rather than interpreting this audit as permission to overwrite
shared code or repeat completed work.

## Capability inventory

These are proposed audit sections. A field counts as gameplay support only
when a real action, calculation, response or continuity transition consumes it.

| Code | Foundation | Questions to settle and implement | Local variation |
|---|---|---|---|
| U01 | Person, life, body and controller | Stable separate identities; names, pronouns, gender, bodily sex traits; body replacement, possession, clones and multiple controlled bodies | Which forms exist; who can control what; actual bodily and social effects |
| U02 | Anatomy and bodily processes | Size, organs, senses, movement, equipment fit, needs, injury, adaptation, genetics and constitution; real execution requirements | Species, diets, physiology, supernatural organs, repair rather than healing |
| U03 | Coherent beginnings | World, era, location, age, family, livelihood, education, possessions, access and obligations generated together; opening actions | Eligible histories, source premises, dependent/nonhuman starts |
| U04 | Randomness | Separate creation, event and action draws; distributions, correlated traits, rerolls, anti-repeat preferences, seed/content versions and durable outcomes | What may vary without breaking source rules; whether luck/fate is an actual mechanism |
| U05 | Time and scheduling | Played/local/elapsed clocks; queues, interruption, deadlines, aging, travel, offline and absent-world policy | Ratios, danger, aging, expiry and simulation scope |
| U06 | Knowledge and perception | Truth versus each actor's evidence, belief and memory; languages, literacy, concealment and uncertain appraisal | Detection channels, memory loss, translation, information powers |
| U07 | Learning and capability | Aptitude, acquired faculty, learned procedure, practice, fuel and execution distinguished; teaching and forgetting | Rank systems, affinities, prerequisites and alternative routes |
| U08 | Relationships and social standing | Directed ties, family, trust, reputation, promises, debts, authority and institutional membership | Kinship, gender expectations, succession, law, class and customs |
| U09 | Ownership and economy | Owner versus holder versus access; theft, loans, wages, currencies, storage, property and actual transfer | Markets, communal goods, titles, land rights and resource units |
| U10 | NPC agency | Same relevant person/body/knowledge/action rules as player; goals, routines, commitments and remembered consequences | Which actors advance when; level of simulation detail |
| U11 | Actions and consequences | Eligibility, contact/reach, quoted cost/time, cancellation, contested outcomes and causal aftermath; ordinary work as well as combat | Different means of acting, negotiating, building or investigating |
| U12 | Travel and compatibility | Explicit carriers for body, items, knowledge, powers and companions; conversion and suppression; actual arrival conditions | Rules per edge and destination, including permitted exceptions |
| U13 | Loss and continuation | Incapacity versus death; recovery, resurrection, succession, rebirth and rewind; inheritance from actual leftovers | What ends, survives, changes owner, resets or continues |
| U14 | Durable state and content lifecycle | Atomic publication, migration, missing packs, frozen revisions, import, replay protection and old-save compatibility | Explicit compatibility decisions for each content/schema change |
| U15 | Presentation and player controls | Relevant details in existing panels; explanation of known effects, random/custom choices, log summaries, accessibility and spoiler-safe filters | Available choices and what the actor can legitimately see |

Gender, genetics, aptitude, ancestry, identity and social role should be
connected where a world supplies a mechanism, but should not be collapsed into
one stat label. A changed body can alter equipment fit or execution without
automatically changing the person's memories, relationships or identity.

## Proposed implementation sequence

P1 First audit the shared person/life/body identities and actual native
consumers, together with durable state. Trace existing gender and body fields
to display, calculations, eligibility and save paths. Determine authoritative
owners rather than adding a parallel character database.

P2 Join coherent origins to durable random selection and player controls.
Compare a small set of distinct eligible starts in one qualified world. Include
both bodily and social differences, usable first actions and ordinary livelihood.
Decide world-versus-start weighting and what is chosen, random or initially
unknown. Do not expose sealed candidate truths in setup.

P3 Exercise time, knowledge, ownership and relationships through those starts.
An advantage must change actual access or action; an obligation must have an
actual counterparty and consequence. Apply the same relevant rule to an NPC.

P4 Add one supported body-change or continuation route. Show precisely what
changes and what survives, with no duplicated possessions or invented memories.
Broader lineage and multibody play can follow once that join works.

P5 Reuse the shared contracts in a second qualified world with different local
rules. That is the strongest check that the foundation is reusable rather than
one world's assumptions disguised as a universal model.

## Acceptance examples, specified not run

| Code | Observable gate |
|---|---|
| V01 | Two beginnings produce different usable actions, access or bodily execution, with a coherent history and no invented player-earned deeds. |
| V02 | Name/pronoun/gender/body traits display and affect exactly the supported consumers; irrelevant traits do not accidentally change unrelated calculations. |
| V03 | UI refresh, preview, reload, import and failed saving preserve committed origin facts; intentional reroll follows the selected policy. |
| V04 | A world-local clock and offline/absence policy produce the declared deadlines and aging without secretly advancing another world. |
| V05 | A player and NPC encounter the same applicable bodily/access rule; each sees only their own legitimate evidence. |
| V06 | A body change or succession preserves the exact declared carriers and updates actual equipment/action eligibility without duplication. |
| V07 | Two worlds use the shared machinery with distinct rules; absent or incompatible content preserves recoverable progress and native compatibility. |

Runtime completion requires rebuild, fresh disposable browser origins and
actual save/reload/import for these changed persistent behaviors, plus old-save
compatibility. Human acceptance of fiction, choices and pacing remains separate.
This audit saved proposals only; it ran no tests, build or gameplay journey.

## Expansion: gaps between the foundations

Follow-up, 2026-10-12. These are under-specified in the U01–U15 map, not
claims that nobody has mentioned them before. The north star already discusses
cover identities, ecology, support credit, promises, world-law changes and
ordinary-life details. This expansion identifies the shared behavior those
ideas would need. All remain proposals; no runtime verification was performed.

| Code | Gap or expansion | Concrete play and design question | Connects to |
|---|---|---|---|
| X01 | Recognition and identity claims | Your name, disguise, title, public reputation and actual person can differ. Who recognizes you after a body change, and what evidence establishes an identity? | U01, U06, U08 |
| X02 | Communication and coordination | Speech, signs, writing, scent, telepathy or intermediaries; message travel, interception, translation and misunderstood orders. Can a remote ally actually receive an instruction? | U02, U06, U10 |
| X03 | Attention and simultaneous activity | Hands, attention, equipment and location constrain concurrency. Can someone study while traveling, sustain a spell while crafting, or control several bodies? Automate supported routines rather than requiring a new meter everywhere. | U02, U05, U11 |
| X04 | Access and dependency | Ownership, permission and physical reach differ. A child, prisoner, dependent, injured person or immobile organism may act through care, requests, delegation or local senses. Every offered start needs meaningful agency. | U03, U08, U09 |
| X05 | Motivations and personal preferences | NPC goals, loyalties, tastes and memories affect decisions. Player personality can be expressed through choices; decide where involuntary fear, compulsion or physiology genuinely constrain execution. | U01, U08, U10 |
| X06 | Care and reproduction | Gestation, eggs, cloning, budding, constructed successors, adoption and upbringing; separate biological parentage, caregiver, legal heir and controller. A dependent's needs and caregivers' time have actual owners. | U02, U05, U08, U13 |
| X07 | Maintenance and quality of life | Cleanliness, illness, sleep, comfort, fit, repairs and treatment; decide which change choices and which belong in descriptive summaries. Strong bodies can bypass ordinary chores when their actual capabilities allow it. | U02, U09, U15 |
| X08 | Institutions and adjudication | A promise is not automatically enforceable. Who witnessed it, who has authority, what evidence exists, and what can courts, guilds, schools or families actually do? Rank, reputation and legal entitlement differ. | U06, U08, U09 |
| X09 | Spatial and environmental affordances | Distance, routes, barriers, carrying capacity, visibility and habitat affect movement and action. Flight, swimming, teleportation and enormous size should change usable routes, homes and tools. | U02, U11, U12 |
| X10 | Ecology and renewal | Harvesting, waste, populations, replacement stock and regeneration connect local activity to future availability. Some resources replenish; some are finite; abundance and world-specific exceptions are valid. | U05, U09, U10 |
| X11 | Provenance and joint work | An item records relevant maker, materials, repairs and custody. A rescue or invention can credit scouts, teachers, healers, builders and funders instead of only the final actor. Decide how credit spreads through observers. | U06, U07, U09, U11 |
| X12 | Development and historical change | Education, practice, maturation, acquired traits and institutional change alter future opportunities. Do new starts and generated NPCs reflect an industry's arrival or an established new school? | U03, U05, U07, U10 |
| X13 | Exceptions and changing rules | A broken seal, new law, cheat, blessing or imported mechanism can change eligibility. Track source, scope, duration and actual precedence when two effects conflict; no universal hierarchy is implied. | U07, U11, U12 |
| X14 | Start viability and recovery | A random start needs at least one useful supported route. Unequal starts can remain unequal; a blocked route needs deliberate terminality or a real alternative, not an accidental dead end. Decide reroll versus abandonment and what either preserves. | U03, U04, U13 |
| X15 | Scale and simulation detail | Individuals, households, armies, cities and distributed minds need controllable scopes. Summarizing distant activity must preserve relevant obligations, ownership and outcomes without fully ticking every actor. | U05, U10, U14, U15 |
| X16 | Notification and explanation | Summarize repetition, highlight consequential changes and show known reasons an action became unavailable. Keep author truth out of explanations; provide controls for detail and interruption. | U06, U11, U15 |
| X17 | Cumulative randomness | Separate uncertain world facts from action-resolution odds. Repeated attempts, streaks, anti-repeat selection, visible estimates and actual luck powers need explicit policies; unrelated UI actions must not consume consequential draws. | U04, U06, U14 |
| X18 | Experimentation and discovery | Players can test an unfamiliar tool or practice before understanding it. Preserve attempted conditions, observed results and uncertainty so discovery changes available methods rather than only filling a lore entry. | U06, U07, U11 |

### Expand the original examples

Gender and body: trace presentation, self-identification, anatomy, reproduction,
equipment fit, social recognition and permitted transformations separately.
Local effects can be absent, minor or substantial. Do not infer one layer from
another when the world's mechanism does not justify it. Physiology and social
expectations may change independently over a life.

Beginnings: distinguish innate capacity, prior training, actual access,
current predicament and pending opportunities. A wealthy person may not have
liquid funds or permission to use family property; a talented person may lack
instruction; a dependent can have powerful allies. Starting relationships need
both participants' circumstances, not just entries on the player sheet.

Randomness: generate causes together. Family, education and contacts can arise
from one history, while exceptional traits can remain true outliers. Decide when
facts become fixed and when they are discovered. Filtering the offered player
experience need not reveal the world's hidden truth. Seeds require generator
and content versions for reproducibility; changing content should not silently
rewrite an existing person's past.

### Recommended checks before adding more isolated systems

P6 Trace a single identity/body change through recognition, communication,
equipment, permissions, knowledge and saved history. This exposes contradictory
owners and fields that have no consumer.

P7 Trace one dependent or unusual-body start through a meaningful first action,
ordinary upkeep, relationship, interruption and recovery. This exposes implicit
adult-human assumptions without requiring every possible species at once.

P8 Trace one cooperative project through messages, commitment, resource custody,
completion, credit and aftermath. This joins NPC agency to player gameplay.

P9 Compare the same supported action at individual and group scale, including
an offline/absence interval. Aggregate representation must not duplicate
workers, spend unavailable resources or erase persistent obligations.

P10 Test a learned method under an explicit changed local rule. Existing history
stays intact while current execution follows the actual rule and the actor's
known explanation. All cases are specified, not implemented or run here.

## Adversarial, unusual and subtle interactions

Further expansion, 2026-10-12. Original hypothetical examples, not source-world
claims, accepted mechanics or disclosed secrets. Existing CHEAT_COSMOLOGY.md
already considers ignore/override/cancel/counter/translate meetings and scoped
carriers. Thematic UI proposals live in
THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. This section connects those
ideas to shared interaction questions. An enemy counter needs actual means,
knowledge, opportunity and local permission; no automatic punishment for a
strong player build or retroactively invented immunity is proposed.

### Interaction checklist

For each selected interaction, specify the affected object or channel, source,
reach, activation condition, timing, duration, costs, ownership and controller,
who can observe it, and what survives removal. Determine separately whether it
prevents initiation, interrupts execution, redirects delivery, changes a result
or repairs aftermath. A negator of casting need not erase a previously created
physical object. Resistance, immunity, suppression, removal, reflection,
conversion and evasion are different operations.

| Code | Edge case | What must be decided |
|---|---|---|
| E01 | Negating the negator | Removing a suppressor can restore a blessing, curse or hazardous transformation. Restoration depends on whether the underlying source survived. |
| E02 | Protection blocks help | A shield against foreign influence could also block a healer using that channel. Self-generated healing or an explicitly admitted ally may differ. |
| E03 | Indirect effects survive | An anti-magic area can stop a new magical push while a falling physical stone continues. Whether the stone itself is sustained magic matters. |
| E04 | Protection is routed around | A strong barrier may stop impacts but not sound, inhaled material, a contract or a threat to its power supply. No bypass works without its actual channel. |
| E05 | Healing used offensively | A locally supported restoration mechanism might restore an unwanted prior form or sustain an enemy. Healing is not automatically harmful to undead or universally beneficial. |
| E06 | Stolen or reflected benefits | Can an enemy steal a buff, redirect a rescue, copy a technique or move a curse to its original source? Copying procedure does not necessarily supply organs, fuel or authority. |
| E07 | Competing absolutes | An unavoidable attack and inviolable protection require a qualified local resolver, specific exception or explicit unresolved authoring state. Adjective strength is not a resolution rule. |
| E08 | Reflection chains | Two reflectors need defined eligibility, remaining energy, costs and termination. Reject unresolved cycles or resolve a declared terminal state; never silently loop forever. |
| E09 | Immunity to one stage | Immune to infection does not imply immune to every toxin, symptom, carrier or physical attack; track what the protection actually prevents. |
| E10 | Wrong body or identity | An attack bound to a name, body, soul, shadow, location or legal identity can acquire different targets after possession, disguise, cloning or renaming. |
| E11 | Equipment changes mid-action | A borrowed focus is recalled, fuel stolen or a required limb disabled before completion. Decide when each prerequisite and payment is checked. |
| E12 | Counter with persistent aftermath | Removing a control effect need not erase orders already carried out, spent money, injuries or observers' memories. |
| E13 | Enemy changes the objective | An opponent escapes, negotiates, evacuates stock, denies a bridge or targets a ritual deadline instead of trading damage. Actual commitments make these consequential. |
| E14 | Enemy exploits information | A rival learns from witnessed techniques, false reports or captured tools and prepares accordingly. Concealed player abilities remain concealed unless there is a real detection route. |
| E15 | Enemy consumes a defense | A disposable decoy can spend an eligible once-only ward; a feint that never reaches its activation condition should not consume it. |
| E16 | Environmental combinations | Invisibility may hide light while leaving tracks, odor, noise or displaced rain; transformations can change those channels. Specific effects decide what remains detectable. |
| E17 | Aid becomes a liability | A rescue rope can reveal a route; a beacon can guide friend and enemy; a loud celebration can interrupt stealth. Observers still need reach and opportunity. |
| E18 | Local victory, larger loss | Winning a duel can cost a deadline or expose an ally, but only through already supported causes. Previously beaten obstacles stay beaten when nothing relevant changes. |
| E19 | Trigger at an awkward boundary | Death, resurrection, end-of-job, equipment breakage and world crossing occur together. Define event order, once-only receipts and what can still act at each point. |
| E20 | History changes but a carrier remains | A rewind can restore a location while an explicitly retained observer remembers it. Its next actions should use that memory without inventing memory for everyone. |

### Future sight, prediction and counter-prediction

| Code | Question | Possible supported interaction |
|---|---|---|
| T01 | What is being read? | Fixed future, conditional branch, likely outcome, intent, external model or past-loop memory have different failure modes. |
| T02 | What is the scope? | Horizon, location, subjects, resolution, cost and reading frequency limit usable information only where the chosen mechanism specifies them. |
| T03 | Does reading change the outcome? | Warning an ally or acting on a vision can alter a conditional forecast; a fixed prophecy needs its own local treatment. |
| T04 | What does concealment conceal? | Hiding intent need not hide future effects. Mindlessness or random action does not automatically defeat future sight. |
| T05 | Can the reader be deceived? | Forged visions, withheld observations or poisoned models are distinct mechanisms. They require an actual interference route. |
| T06 | Can knowledge be exploited? | An opponent who predicts a dodge can aim at its destination. A broader reader may foresee that response; horizon and local rules decide. |
| T07 | Do two readers interact? | A selected scenario may reach a stable outcome, branch, create blind spots or require a local adjudication rule. Recursive previews must terminate without mutating the live world. |
| T08 | Is the forecast still current? | A forecast records its observer, basis, time and relevant conditions. Changed circumstances can invalidate a conditional forecast without falsifying its historical record. |
| T09 | Can the viewer actually intervene? | Seeing danger does not imply speed, access, communication or resources to prevent it. A player can prepare through legitimate routes. |
| T10 | How is uncertainty presented? | Show exact odds only when the actor has a means to obtain them. A vision, estimate or remembered sequence is labeled by its actual source, with earned limitations. |

### Small details with real effects

| Code | Detail | Consequence to qualify |
|---|---|---|
| L01 | Clothing, fit and carried weight | A borrowed uniform supplies a social cue, not necessarily credentials; a transformed hand may no longer use its glove or key. |
| L02 | Traces and residue | Mud, scent, heat, signatures or a maker's mark can connect an action to an observer's investigation. |
| L03 | Records and witnesses | Destroying a document does not erase a witness or duplicate; public credit can differ from actual contribution. |
| L04 | Containers and preparation | A medicine is owned but inaccessible in distant storage; a tool is present but uncharged, contaminated or loaned. |
| L05 | Arrival and timing | A warning arrives after the event, a shop closes during travel, or two actors claim the same finite stock. |
| L06 | Attribution after redirection | Responsibility for a reflected strike, coerced act or delegated task can differ between causal history and institutional judgment. |

### UI and execution boundaries

| Code | UI requirement | Edge case to exercise |
|---|---|---|
| I01 | Explain known applicability | A buff is present but suppressed, incompatible or out of reach; show the known current effect without leaking an undiscovered cause. |
| I02 | Compare conditional effects | A protection helps against one known channel, blocks an allied treatment or changes in another location; avoid a single misleading green upgrade number. |
| I03 | Preserve quote versus result | A prediction or cost quote is not an outcome. Revalidate commitments when the world changes; distinguish expected, attempted, observed and durably saved results. |
| I04 | Separate preview from action | Inspection, tooltips, sorting and hypothetical forecasts do not spend fuel, advance time, reroll outcomes or teach enemies the player's plan. |
| I05 | Bind clicks to stable identities | A refresh must not change which identical item, enemy, recipient or action a pending click targets. Prevent duplicate commitment from double-clicks. |
| I06 | Handle changed context | Target leaves, item is stolen, actor changes body or a quote expires while a menu is open; preserve context and show a safe current resolution. |
| I07 | Show useful event order | Summarize an observed counter chain, with expandable known causes; distinguish original caster, controller and redirected recipient. |
| I08 | Keep uncertainty honest | “No observed effect” differs from “immune.” Hidden effects do not appear in tooltips, sorting, filters, disabled-reason strings or asset names. |
| I09 | Protect ordinary controls | Fiction may distort an in-world status reading; save failures, actual button costs and accessibility controls remain reliable. |
| I10 | Keep reactions usable | Paused, waiting, interrupted and failed are distinct. Relevant alerts can interrupt supported automation without losing focus, scroll or queued choices. |

### Proposed adversarial acceptance slice

Select two qualified mechanisms and an opponent who can actually use a counter.
Exercise direct success, the counter, a valid workaround and one persistent
aftermath. Add a conditional forecast only if the chosen world supports it.
Verify both actors' legitimate information and UI explanation, then reload and
import during the committed sequence. Invalid interactions must leave state
unchanged. Preview recursion, trigger cycles, stale targets and duplicate clicks
need explicit boundary checks. These are future acceptance cases; this document
does not claim implementation, gameplay verification or a new runtime assignment.

## Building shared mechanics before world content

Implementation proposal, 2026-10-12, responding to how these foundations can
be built without working on specific worlds yet. Inspect existing contracts,
simulation command preview, effect application and persistence owners first.
src/simulation.js already stages copied plans and exposes command previews;
src/simulation_effects.js already applies effects and projects body/knowledge/
custody into action facts. These are integration seams, not a reason to create
a second simulation or save format. This follow-up changed documentation only.

### Bounded mechanical test environment

Use disposable synthetic definitions under a test/development-only entry point:
two actors, two bodies, two locations, a finite resource, a tool, a projectile,
a barrier, a suppressor and a conditional predictor. No source-world names,
lore, campaign, rewards or player-save access are required. These fixtures
prove selected mechanisms, not full world readiness. An explicit player/NPC
swap and a second conflicting policy fixture test reuse.

| Code | Buildable core | Supplied by synthetic definitions now and world content later |
|---|---|---|
| K01 | Identity references and capability queries | Which body/controller acts; organs, required means, supported identity traits and their actual consumers |
| K02 | Scoped interaction resolution | What can contact what; which stage is blocked, suppressed, redirected, transformed or reversed; authored precedence for relevant collisions |
| K03 | Transaction and event boundaries | Stable action IDs, quoted version/sequence, prerequisite rechecks, copied planned state, costs, event order, durable publication and replay prevention |
| K04 | Observation and forecasts | Observer-visible evidence and cause summaries; pure hypothetical execution against a snapshot; declared forecast method, horizon and knowledge scope |
| K05 | Origins, clocks and continuity | Qualified starts and commitment receipts; random stream/version policy; explicit time/absence rules and declared retained carriers |

Keep effect instances distinct from their sources and derived applicability.
Where suppression is appropriate, an effect remains present while inapplicable;
removal actually ends it. Losing a source only ends dependent effects where the
definition requires ongoing support. Prefer explicit qualified interaction
rules to a giant universal power-ranking formula. Unknown required resolutions
fail authoring validation; undiscovered player knowledge remains a separate issue.

An illustrative contract can describe a block on incoming external magical
delivery, rather than a vague "immune" flag. Healing and attacks using that
channel both match; a physical projectile does not unless its definition says
its existence depends on ongoing magic. The fixture chooses these rules; the
engine does not impose them on every world.

### First connected proof

1. An actor activates a barrier that blocks the fixture's incoming magical
   channel. An enemy spell and allied healing are both blocked.
2. The enemy uses its supported suppressor. The barrier instance remains but
   loses applicability; eligible delivery can proceed while suppression holds.
3. The player removes the suppressor. The existing barrier resumes exactly
   once, without resetting duration or duplicating costs.
4. A launched physical projectile follows the fixture's declared persistence
   rule. Preview and conditional forecasts use isolated copies and cannot
   change live RNG, actor knowledge or event history.
5. Both actors exchange roles. Save failure, reload/import mid-suppression,
   stale target, duplicate commitment and declared reflection-cycle handling
   preserve the expected state and observable explanation.

Build a minimal development UI with act/step/reset, actor selection, ordinary
observer view and a separately labeled developer trace. Player explanation
consumes observer projection, never the full trace. Compare predicted and
observed results; preserve target identity, focus and scroll through refreshes.
The development entry must not expose fixtures or author truth in normal play.

After focused unit/integration tests, rebuild and exercise the same sequence
through a fresh disposable browser origin, including persistence. Add a second
fixture policy in which the barrier admits healing or the projectile requires
ongoing magic. Different results through the same core establish policy reuse.

Begin with K02/K03 and this proof, extending K01/K04 only to its actual needs.
Origins and broader continuity can follow as separate connected proofs. Do not
implement every speculative mechanic, a complete strategic enemy AI or a true
omniscient future simulator before a qualified consumer exists. The framework
can support future-sight adapters without claiming to predict unimplemented
world behavior. No runtime work or acceptance case was run in this proposal.


2026-10-13 pointer: a source-read foundations check for abilities, automation, progression and cheats, with a shared rule kernel proposal, lives in [ability authoring](worlds/ABILITY_AUTHORING.md#foundations-check-and-other-systems-that-share-the-pattern-2026-10-13).

2026-10-14 pointer: a code-grounded scorecard of U01-U15 and the kernel pieces, with more angles (M1-M12) and queued Codex lanes, lives in [core foundations scorecard](CORE_FOUNDATIONS_SCORECARD_2026-10-14.md).
