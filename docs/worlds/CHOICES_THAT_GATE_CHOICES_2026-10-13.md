# Choices that change later choices

Status: design consideration, 2026-10-13. Recommendations, not accepted defaults or implemented behavior.

Weibao asked: “Considering choices that gates other choices? Other stuff to consider and more?” Interpreted as game choices changing which later actions and paths are possible.

## Existing direction

[User vision](../USER_VISION.md#timeline-styles-different-endings-and-wider-functional-depth-2026-10-05) records cumulative choices and endings: competence, real means, prior agreements and independent actors change possible outcomes; a final menu cannot erase history. Earned options (local proposal draft: `world-depth-2026-10-13/13_EARNED_OPTIONS_AND_CHEATS.md`), access and starts (local proposal draft: `world-depth-2026-10-13/11_ACCESS_AND_STARTS.md`) and deeper synthesis (local proposal draft: `world-depth-2026-10-13/23_DEEPER_SYNTHESIS.md`) already discuss earning events, access routes, obligations, situations and profile records as proposals. This note adds a focused choice-dependency lens without selecting their defaults or changing paused implementation scope.

## Recommendations

- **C1: Distinguish kinds of gates.** A choice may open a route, close it, delay it, make it more expensive, or transform it. Separate missing knowledge, missing capability, lack of permission, lack of resources, conflicting commitments and actual physical impossibility. Losing an invitation is different from losing the ability to enter by another route. Reserve permanent exclusions for real incompatibilities or irreversible events.
- **C2: Let commitments have intermediate states.** Asking about a posting, applying, accepting, serving and deserting are different acts. Browsing an offer should not silently commit the character. Allow negotiation, preparation, refusal and withdrawal where plausible, with costs arising at the step that actually causes them. Temporarily incompatible schedules need not mean permanently incompatible careers.
- **C3: Let cumulative behavior and other actors matter.** Several kept promises can earn responsibility; several betrayals can lose it. Who knows, what they believe, whether they have authority and what they want affect the result. Reputation is not omniscient. A person's refusal can close their cooperation without erasing every possible substitute. Refusal and doing nothing have authored outcomes where the situation warrants them, without turning all ordinary inactivity into punishment.
- **C4: Make the stakes legible without spoiling discovery.** Show known costs, terms, deadlines and credible risks. Distinguish “you do not know how,” “you lack the means,” “they refuse,” “temporarily unavailable” and “this opportunity has ended.” Unknown consequences stay unknown; the UI need not list sealed branches. Notify the player of a newly understood route or material closure. Major known irreversible commitments deserve clear review; ordinary reversible choices do not need repeated confirmation.
- **C5: Preserve agency after setbacks and at greater capability.** A closed route can create an alternative life, a repair opportunity or an aftermath rather than terminate play. Alternatives need not be equal rewards. Wealth, skill, allies, disguise or unusual powers can overcome the constraints they actually affect; an old low-level permission gate should not universally bind a much stronger character. Breaking a constraint can still provoke a response. Reconverging routes retain their different costs, relationships and history.

## Further considerations

| ID | Question to author | Reason |
|---|---|---|
| G1 | Is this an in-world constraint, a player discovery unlock, or a technical content boundary? | A profile unlock does not automatically give the character a power, credential or memory. Missing content should not masquerade as a world law. |
| G2 | What is the exact scope and duration? | Person, institution, region, body, life, lineage, world instance and player profile can retain different consequences. A rejected application need not close every future life. |
| G3 | Which alternative prerequisites work? | Money, training, sponsorship and demonstrated competence can provide different routes where the world permits them. Avoid one arbitrary mandatory quest for every career. |
| G4 | What actually advances the deadline? | Played time, local world time and offline time differ. Honor the current absence policy; do not invent unattended progression or penalties. |
| G5 | What happens if prerequisites change while an action is pending? | A lost tool, withdrawn sponsor or expired offer needs a defined pause, cancellation or changed outcome. No double charge or invented completion. |
| G6 | Does an idle routine commit the player repeatedly? | Automation should follow its stated policy and stop or seek a decision when materially new terms exceed that policy. |
| G7 | Can the dependency chain strand a viable character? | Check cycles, mutually consumed prerequisites and routes that accidentally remove every useful action. Intentional tragedy is different from a design error. |
| G8 | Can the branch be authored without a separate campaign for every combination? | Reuse locations and scenes with meaningful state-dependent behavior. Reconvergence should retain consequences rather than reset them. |
| G9 | Is repeated participation meaningful? | Training and repeat work may stay useful; a particular invitation, payout or historical event retains its own identity. Save restoration should neither duplicate nor erase it. |

## Example, original and hypothetical

Accepting a two-week guard posting opens wages, training and introductions while occupying evenings needed by a workshop course. Negotiating a different shift may preserve both. Completing the posting may earn a reference; leaving early may lose that reference and change the captain's trust. It does not automatically remove all crafting careers. Later wealth could fund private instruction, while a later disagreement with the captain would still have its own consequences.

## Future implementation acceptance

For one selected connected slice, record the triggering choice, actual state changes, affected actions, scope, duration, known explanation, alternate routes and refusal/withdrawal outcomes. Verify both sides of each claimed gate on a rebuilt fresh origin and preserve the result through save/reload/import. Check pending actions, repeated actions and old-save compatibility where affected. This note makes no runtime, build, browser or save-behavior claim.

## Roguelike aspects, follow-up

Weibao asked: “Roguelike aspects and more?” The following extend this proposal. [Starts, endings and randomness](../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md) owns the broader axes and generation policy; fresh lives and optional succession (local proposal draft: `CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md`) proposes continuation choices. Neither proposal is promoted to an accepted default here.

- **R1: Different lives create different decision spaces.** Vary coherent starting circumstances, access, discoveries and opportunities. A scholar, debtor and veteran can inhabit the same world with different useful routes. Source rules and fixed canon facts remain fixed unless the chosen premise permits variation. Randomness should change how one plays, not only numerical strength.
- **R2: Build identity emerges through commitments.** Finite time, equipment capacity, training access and conflicting loyalties encourage specialization. Random offers can prompt improvisation, while several attainable routes support a desired pursuit. Permanent mutually exclusive powers require actual world rules. Cross-training and later switching remain possible where supported, with their real costs.
- **R3: Loss has explicit scope.** Injury, capture, expulsion, defeat, death, retirement and new-life closure are distinct. Permadeath or a harsher run profile can be selectable. Do not make every setback terminate a rich life, invent resurrection in worlds that lack it, or force death to collect progress. A selected strict death policy must state what is lost and what actually persists.
- **R4: Knowledge and new possibilities can be the main cross-run gains.** Player understanding, discovered start variants and a richer possibility pool support replay without compulsory permanent stat inflation. Character memories, property, powers and inheritances require real carriers. A future profile unlock is distinct from a character benefit; the profile store is still a proposal here. Unlocking more candidates also changes random distributions, so optional filters and stated selection policies matter.
- **R5: Runs can be expeditions, arcs or whole lives.** A dangerous trip can have roguelike stakes inside a continuing life. Safe livelihoods, long relationships and voluntary closure can coexist with risky expeditions. Repeated introductions should shorten where nothing meaningful changes. Do not impose one short run length on every world or erase a persistent world's aftermath to reset an encounter pool.

Further authoring questions: how much danger is foreseeable; whether escape, surrender or extraction work; whether unattended routines can expose the character to terminal danger; whether success supports continued play; which world facts persist between protagonists; whether challenges/seeds are optional and reproducible; and whether unlucky starts retain some meaningful agency. Bad luck need not guarantee compensation, but surprise should not hide known action costs or arbitrary unwarned terminal rules.

Recommended design exercise: compare three coherent starts in one represented world through opportunity, preparation, commitment, setback, recovery or closure, and exact persistence. This is a proposed exercise, not a new implementation assignment or a requirement to expand the initial milestone.

## Roguelike mechanics as cheats, base features and unlocks

Weibao asked: “Roguelike aspects as cheats and more? More to consider? Considifer if features should be base game or considered and unlocked,” then “examples like relationship stuff and more?” These requests authorize consideration; the recommendations below remain proposals.

Existing owners: features as cheats (local proposal draft: `world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md`) already separates base-start, base-play, world-cheat, sandbox and accessibility homes. Friends and relationships (local proposal draft: `world-depth-2026-10-13/20_FRIENDS_AND_RELATIONSHIPS.md`) owns social possibilities. [Cheat library](../CHEAT_LIBRARY.md) already contains Echo Anchor, Heirloom Compact, Rebirth Ledger, Instinct Inheritance and World Deeds. The examples below are original design possibilities, not new source-world facts or implementation claims.

### Proposed placement test

- **B1: Base controls and legibility.** Readability, accessibility, saving/export/backup, real-life pause, known action terms and a usable record of known people belong in the ordinary interface. A fictional device may deepen these features without withholding their useful baseline. Existing vanilla functionality keeps its existing access rules.
- **B2: Base systems discovered or earned through ordinary play.** Friendship, romance, rivalry, promises, introductions, apprenticeships, inheritance and social aftermath are world behavior. A particular invitation or relationship needs actual circumstances; having the whole relationship system is not a cheat. Reveal relevant panels as they become useful. Ordinary maps, research and trained routines can similarly grow through play.
- **B3: Exceptional in-world capability.** A character who can retry history, preserve memories through a reset, carry another person across death, reroll a future opportunity or inspect otherwise inaccessible feelings has an actual power. It can be innate, found, learned, given, contracted or unlocked, according to the premise. A power common to locals may be ordinary magic or technology instead of a cheat. It need not always be gated behind an earlier successful run.
- **B4: Player-layer choices.** Starting preferences, difficulty, spoiler controls, replaying an archived life and an optional sandbox belong outside character abilities. Choosing a relationship AU is a premise selection; causing that change within a lived world needs actual means. A profile unlock expands available premises without silently granting an in-world power.

Base versus unlocked are independent questions: a base system can reveal itself through play; a cheat can be present from birth. Decide separately what the character can do, what the player can see, how access is earned and what persists.

### Examples

| ID | Ordinary base-game version | Possible cheat or extraordinary version | Consequential choice |
|---|---|---|---|
| E1 | Friends remember shared events during their lives; the journal retains witnessed information. | **Bond Echo:** one or both people retain memories across a reset or rebirth. | One-sided memory can create familiarity without mutual trust. Shared memory means the other person also remembers disagreements and makes new choices. |
| E2 | Apologize, negotiate and rebuild trust after an argument. | **Conversation Anchor:** retry a bounded conversation through a real rewind. | Define who remembers, what outside events rewind, when the anchor expires and whether the conversation can still diverge. A local rewind does not automatically restore an entire world. |
| E3 | Friendship or romance develops through compatible interests, shared time and individual decisions. | **Affinity Sight:** perceive limited emotional tendencies or likely points of friction. | Understanding someone's present feelings does not guarantee agreement or future affection. Precision, uncertainty and change depend on the power. |
| E4 | A companion chooses to join a journey after discussing risks. | **Shared Checkpoint:** a supported bond carries a companion through a restart. | Who is included, what they retain, whether they can decline or leave, and whether ordinary third parties remain outside the reset. |
| E5 | A mentor teaches; their pupil retains learned skills and perhaps a notebook. | **Legacy Thread:** retain a supported teaching bond or transfer a fragment of skill to another life. | Skills, recognition, memories and institutional credentials are distinct. A new body may need practice even with retained understanding. |
| E6 | Friends introduce the character to their own contacts. | **Fate Meeting:** influence the chance of meeting a person or eligible counterpart in a later life. | A meeting is an opportunity, not guaranteed friendship. Identity, era, location and branch compatibility matter; a counterpart is not automatically the same person. |
| E7 | A will, household, workshop or shared project survives according to local custody and institutions. | **Soulbound Household:** a supported home or group crosses world or life boundaries. | Exactly which people, assets, obligations and memories travel; what stays behind; whether each member can act independently. |
| E8 | Failure recap explains known causes; player learning helps the next attempt. | **Death Insight:** receive otherwise inaccessible causal information from a failed life. | What the power can actually establish, what remains uncertain and whether the character retains it. Ordinary recap stays useful without it. |
| E9 | Future runs offer varied coherent circumstances under the selected starting policy. | **Second Draw:** reroll an eligible offer, loot outcome or start component. | Freeze the original result, define eligible changes and persist the chosen outcome. A stated reroll changes the result; reload does not accidentally do so. |
| E10 | Practice improves skill; ordinary inheritance passes real possessions and lessons. | **Instinct Carryover:** a soul or other supported carrier preserves part of an earlier build. | Which skills survive, how a different body uses them, and what still requires equipment or recognition. Permanent account stat growth is one option rather than a universal prerequisite. |

### More to consider

**M1: Power does not imply compulsory punishment.** Costs, caps, drawbacks, exposure and counters need a premise or useful design reason. Strong, comfortable or unusually lucky lives remain valid. Define the power's actual reach before inventing a balancing tax.

**M2: Relationships are directed and contextual.** Familiarity, trust, respect, affection, dependence and obligation need not move together. Repeated gifts or scripted conversations should not universally buy love. Friendship can be a complete outcome, and ordinary companionship does not need a power reward to matter.

**M3: Acquisition can itself be social.** A mentor teaches a memory technique; friends undertake a bond ritual; an institution grants an anchor; a family passes down a carrier. Ordinary relationship play exists before and after acquisition. Characters may refuse a shared power or disagree about when to use it.

**M4: Knowledge and continuity are separate.** Player recollection, character recollection, the other person's recollection and surviving world records can differ. Remembering a prior romance does not make the present person a partner. Choosing an AU that begins with an established relationship supplies a qualified starting history instead.

**M5: Unlocks should add interesting possibilities.** Avoid requiring romance, betrayal, death or repeated failure merely to obtain basic comfort features. Optional paths can award distinctive capabilities, but should not make one personal life choice mandatory for every build. A feature's ordinary tool/service route and exceptional power route can coexist.

**M6: Powers can change dependencies without erasing consequences universally.** A bond can substitute for a missing introduction; a rewind can revisit a failed conversation; a memory can reveal an earlier opportunity. Specify which barrier changes and which other people, clocks and commitments remain authoritative. If a power truly reverses a consequence, permit that within its declared reach rather than restoring the failure arbitrarily.

**M7: Reset scope must be explicit before implementation.** Distinguish retrying an action, rewinding a scene, returning to an anchor, beginning a new life and entering a parallel instance. Their treatment of bodies, actors, stock, debts and memories differs. Verification must cover each claimed carrier and both sides of relationship gates, including refusal, loss of the carrier and save/reload/import. These remain future acceptance requirements, not performed checks.

## Deeper considerations beyond relationships

Weibao asked: “Other stuff like this that we should consider? Deeper considerations and more?” This section expands the consideration, not the active implementation assignment. Foundational functions (local proposal draft: `world-depth-2026-10-13/28_FOUNDATIONAL_FUNCTIONS.md`) owns the related layer and placement analysis. All named powers below are hypothetical original examples.

### Additional feature families

| ID | Ordinary feature or earned world access | Exceptional version | Deeper question |
|---|---|---|---|
| F1 | Notebook, witnessed history and learned facts | A memory vault preserving inaccessible prior branches | Which recollections are facts, interpretations or memories from a different continuity? A true memory can still be irrelevant to this branch. |
| F2 | Known action costs and planning tools | Future simulation, prophetic preview or limited outcome selection | Does it predict, create a temporary simulation, reveal a fixed future or choose among possible futures? Those are different powers. Intervention can invalidate a prediction. |
| F3 | Practice, experimentation and accumulated skill | Retain training from an erased timeline | Does understanding survive while muscle, magical capacity and equipment reset? Define the retained substrate rather than transferring a universal XP number. |
| F4 | Storage, ownership records and normal inheritance | Inventory carried through death or a vault outside local time | Possession, title, access and control differ. A returned object may have a living claimant; an ordinary sale or lease does not erase that person's history. |
| F5 | Travel using known routes and available transport | A return anchor, cross-world passage or instantaneous extraction | What moves, where it arrives, what follows and whether a world changes during absence? A route menu and the character's transport ability differ. |
| F6 | Housing, gardens, workshops and hired helpers | A portable home or private time-dilated domain | Who can enter, who lives there, which clock they experience and how outputs reach the outside? A domain changes social and economic life, not merely storage size. |
| F7 | Credentials, reputation and institutional membership | A title recognized across lives, a supernatural seal or inherited authority | Recognition needs a reader or mechanism. Expertise, legal standing and obedience are separate; a title need not compel everyone's cooperation. |
| F8 | Language study and asking for translations | Universal comprehension or reading otherwise inaccessible signs | Understanding words differs from knowing cultural context, intent or truth. Ordinary readable UI remains available even when the character cannot decipher a document. |
| F9 | Equipment presets and ordinary preparation | Stored bodies, instant transformation or swapping parallel builds | Where do health, injuries, identity, carried items and learned skills reside? Changing a body need not erase commitments. |
| F10 | Queued work, practiced routines and delegation | Copies, parallel consciousness or work in suspended time | Are workers independent people, projections or one mind? Which skills and experiences return, and who supplies real materials? |
| F11 | Recovery, medicine and local resurrection where supported | A stored life, death substitution or anchored return | Does death reverse, move elsewhere or still happen while another body continues? The distinction changes witnesses, grief, ownership and pursuit. |
| F12 | A journal of discovered opportunities and optional start filters | A fate editor that selects a new origin, family or exceptional means | Selecting a premise outside the world differs from changing an existing world's people and history. The actual scope determines whose memories and records change. |

### D1: Specify what each feature actually changes

For any candidate, name the holder, operation, target, scope, carrier and persistence. Ask whether it changes information, physical capability, access permission, world state or the player's controls. Separately select initial availability, discovery, acquisition and loss. A readable map panel, a purchased map, an enchanted tracker and perfect spatial knowledge can share presentation while having different world effects.

The base fallback need not reproduce the cheat's benefit. An ordinary journal records known facts; it does not secretly reveal hidden thoughts to compensate for lacking telepathy. Likewise, a character can lack a language, a tool or permission while the player retains clear controls and known explanations.

### D2: Follow causal combinations, not just isolated abilities

Rewind plus memory permits learning through retries. Rewind plus retained inventory can permit duplication, depending on what actually returns. A parallel worker plus a time-dilated workshop can change output far more than either ability alone. Affinity sight plus a conversation anchor changes social experimentation. Test these combinations at their declared reach; do not silently narrow an earned power merely because it is effective.

Distinguish an accidental repeated payout caused by restore handling from deliberate repeatable acquisition enabled by the world's rules. If duplication is part of the power, its material result should be real. If it is not, persistence should not create it accidentally. Global prices or institutional reactions need actual consumers and witnesses; their mere plausibility is not a reason to invent a universal punitive response.

### D3: Keep actors and continuities distinct

Who else can use, learn, lend, transfer, inherit, confiscate or counter a power? Player exclusivity is a valid premise and does not require symmetric NPC access. Shared powers can create social structures: an anchor keeper, a cross-life mentor circle or families maintaining a transferable home. Their people still have motives and actual means.

Distinguish the same person returned, a new incarnation, a parallel counterpart and a constructed copy. A memory match alone does not settle identity. The player can encounter someone familiar who has lived a different history. Track only distinctions relevant to the selected slice; do not require exhaustive simulation of every branch or ordinary resident.

### D4: Make unlocks serve the desired experience

Separate encountering a possibility, learning its method, obtaining its carrier, using it reliably and mastering it. Not every power needs all five stages. Immediate powerful starts and comfortable ordinary lives remain valid alongside slow acquisition. Discovery can hide clutter without withholding controls or pretending authored content does not exist as a world law.

An unlock should add decisions, capability or a fitting experience. Avoid a permanent chore imposed solely so a later unlock can remove it. Carryover can preserve methods, contacts, alternate starts or remembered mysteries instead of mandatory stat inflation. Repeat introductions may shorten while consequential choices remain. Optional cozy, dangerous, mystery or power-fantasy profiles can select different experiences without one universal balance formula.

### D5: Preserve consequences at the scope the power leaves intact

If history truly rewinds, the ordinary local consequence may disappear. If only a body returns, outside history may remain. If the player leaves for another world, absence follows that world's selected clock policy. People should react through what they actually notice or learn, rather than knowing every player action or power automatically.

Power can remove the original obstacle and create a different kind of play: a private domain makes provisioning easier and supports hosting people; a retained education enables new research; resurrection permits dangerous exploration. Do not automatically restore the same difficulty with stronger enemies. Ordinary relationships, atmosphere, hobbies and unresolved background remain valuable without forced mechanical payoff.

### Bounded next design recommendation

Compare one ordinary base feature, one normally earned extension and one exceptional power in a connected hypothetical life. Trace its first use, repeated use, one useful combination, transfer or loss if applicable, and aftermath. Use the comparison to decide placement before selecting runtime work. The full inventory is a consideration palette, not a requirement to implement every feature or a new completion gate.
