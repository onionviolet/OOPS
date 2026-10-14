# Agency, relationships and aftermath, 2026-10-13

Status: bounded source audit plus design extension. Proposals are not accepted
mechanics. No runtime edits, build, tests, browser journey or save access.
Scope: the user's requested differences among kinds, levels, actions, enthralling,
temporary effects and discovery, developed through NPC agency and social aftermath.

## Authority and existing direction

Read AGENTS.md, PROJECT.md's live standing priorities, relevant USER_VISION.md
sections, ABILITY_AUTHORING.md, deeper interactions DSI2/DSI3 and depth parts
19, 20, 23 and 28. The existing owners keep their authority. This extends their
joins, without resuming paused World1, activating another world or requiring a
universal social simulation. Desktop/laptop remains primary; mobile is deferred.
No interface behavior is implemented or verified here.

Depth 19 owns talk verbs and their audience; depth 20 owns relationships;
depth 23 connects directed regard, beliefs, obligations and NPC intent;
depth 28 distinguishes ordinary verbs from reach and cheats. This note adds
mechanism-specific consequences, without replacing those owners.

## F: Source findings in this checkout

| Code | Verified source fact | Limit or implication |
|---|---|---|
| F1 | `src/simulation_effects.js:285-292` writes actor-to-target axes and cause-stamped text memories; receipt keys include cause, actor, target and axis. Memory history is capped at 32. | Directed liking/trust/fear can differ, but an open axis name does not implement its behavior. Durable commitments must not depend only on a disposable display-memory tail. |
| F2 | `src/simulation_effects.js:281-284` stores actor-specific knowledge with stage, value, cause and optional basis. Equal-or-higher-stage writes replace a key. | This can hold an attributed belief. It is not a full disputed-belief model, automatic lie detection or a memory-alteration resolver. Stage describes the stored ladder, not guaranteed factual truth. |
| F3 | `src/simulation_effects.js:302-313` applies/removes conditions, with intensity, cause, expiry and optional ticks. `src/simulation.js:476` deletes an expired condition. | Removing a condition does not itself reverse items, learned facts, relationship deltas or actions previously performed. Conversely, these seams do not establish an implemented enthrallment condition. |
| F4 | `src/chronicle.js:62-69` has a separate relationship owner with clamped axes, ties and capped memories. `src/chronicle.js:216-219` closes the elder's grievance through declared restitution while remembering the attack. | Existing closure is a concrete local precedent. It does not create universal forgiveness, compensation or cross-store synchronization. |
| F5 | `src/chronicle.js:203` gates inheritance on kept duty and no grievance; `:213` gates a lesson on trust, evidence and no grievance. | A relationship already has a narrow useful consumer. A generic obedience meter is unnecessary for the first authored agency scene. |
| F6 | `src/promise_content.js:27-28` separates the visitor's recollection from inference; `:41` records refusal without a broken agreement; `:63` handles declined/unanswered follow-up without invented debt. | Knowledge, memory and obligations need not match. This precedent supports an NPC being mistaken or proceeding independently. Its private truth is intentionally not quoted here. |
| F7 | `src/people_knowledge.js:28-29` explicitly excludes one person's private axes, conditions, possessions, jobs and memories. `:52`, `:60`, `:63` read differently directed relationship memories for supported views. | A People card is an observer projection, not omniscient mind access. Showing a hidden enthrallment flag there would require a new discovery route. |
| F8 | `src/simulation.js:517-518` advances existing actor controllers on due times. | Scheduled NPC action has a seam. That does not prove general autonomous goals, covert investigation or an always-running anti-player response system. |

The source review is bounded to these owners and joins. Earlier depth audits
contain broader absence claims; this note does not repeat them as a fresh
whole-repository absence proof.

## P: Keep separate what an effect actually changes

P1: A relationship and an intervention are separate records. Track only the
dimensions used by the selected scene, rather than adding every possible axis
to every person. A person's affection need not determine every request.

| Domain | What it means here | Example of independent change |
|---|---|---|
| Liking | Enjoys your company | Likes you, declines your business proposal. |
| Trust | Expects a specified kind of reliable conduct | Trusts your medicine, doubts your financial advice. |
| Loyalty | Chooses support for a person, group or commitment | Supports your expedition, refuses to betray their household. |
| Desire/emotion | Currently wants or feels something | Feels unusually calm, remains opposed to entering the mine. |
| Belief | Holds a proposition with a basis | Thinks a gate is safe because of your false report. |
| Behavior/control | Can perform, choose or inhibit an action | Carries a crate while inwardly resisting an imposed command. |
| Memory | Retains an experienced or supplied account | Remembers carrying it, cannot recall who issued the command. |
| Identity/priorities | Longer-lived self-model and valued goals | An enduring devotion reorganizes priorities under a declared local rule. |

P2: A power's level should name changed functions as well as magnitude.
A stronger calming effect might tolerate danger, affect more people or last
longer. None of those upgrades alone grants belief editing, obedience,
amnesia or permanent affection. Those are separate capabilities.

P3: Temporary/permanent describes persistence, not mechanism. A permanent
motor restriction and a five-minute genuine emotion are different effects.
An enthrallment can be sustained by a source, autonomous until dispelled,
slowly fading or indefinitely retained. Authors must state which.

## M: Mechanisms with different subjective experiences

These are original authoring families, not claims about any franchise's rules.

| Code | Mechanism | While active | After removal or expiry |
|---|---|---|---|
| M1 | Persuasion or ordinary deception | Chooses on actual arguments or accepted misleading evidence. | A corrected belief can change plans; learning deception need not erase every earlier good interaction. |
| M2 | Temporary emotional influence | Feels calmer, frightened or warmer; choices retain declared limits. | Original emotion may return. A successful shared task can remain meaningful; an artificial feeling need not become lasting love. |
| M3 | Suggestion or narrowed salience | A particular idea seems plausible or urgent, with specified competing priorities. | Can reassess the idea, perhaps without identifying a power. The performed action remains a fact. |
| M4 | Imposed behavioral control | Acts within imposed constraints; can privately disagree, stall or interpret narrowly if the mechanism permits. | Freedom returns. Memory, distress, gratitude or indifference depend on experienced events and what is remembered. |
| M5 | Enthrallment through desire/devotion | Experiences devotion as sincerely felt while its cause is imposed; still has the capacities and exceptions defined by the ability. | May retain, reinterpret or reject those experiences. Removing the source does not prescribe one universal reaction. |
| M6 | Belief or memory alteration | Reasons from altered records; may sincerely defend them. | Restoring a record, learning a contradiction and reconstructing a missing interval are separate operations. |
| M7 | Binding pact or voluntarily scoped control | Freely chosen terms authorize particular constraints, if informed agreement actually exists. | Completion ends the declared constraint; fulfilled terms and resulting goods persist. Breach follows that pact's rule. |

P4: Sincere experience under M5 does not retroactively make its induction
voluntary. Nor must the NPC automatically label every experienced moment false.
They may distinguish the imposed desire from a real conversation, useful lesson
or act of care. Resolve particular experience and later interpretation separately.

P5: Consent attaches to a scope and an informed choice. Agreement to calm panic
for a rescue does not authorize obedience, later memory editing or unrelated
requests. Revocation may end future support without undoing completed rescue.
An effect that prevents refusal cannot use compliant behavior as proof of consent.

## K: Discovery is independent from application and removal

| Code | What this NPC has access to | Possible local outcome |
|---|---|---|
| K1 | No perceived change and no accessible clue | Continues ordinary life; no invented grievance or investigation. A later authored clue remains possible. |
| K2 | Notices unusual behavior but lacks cause | Reflects, asks a friend or simply moves on; suspicion need not identify the player. |
| K3 | Recognizes influence, lacks author identity | Seeks help or protection against that mechanism; may suspect an incorrect source. |
| K4 | Identifies caster but not purpose | Requests an explanation, accepts a rescue account, sets a boundary or ends cooperation. |
| K5 | Learns purpose and actual outcome | Reaction depends on prior agreement, interests, harm, benefit, alternatives and temperament. |
| K6 | Has strong private evidence, lacks public proof | Can personally refuse further dealings while institutions remain unconvinced. |
| K7 | Others know, target does not | A witness may warn them, withhold it or offer care; reception depends on credibility and actual contact. |

P6: Discovery can occur during influence, immediately after, much later or never.
It needs a supported cue, detector, testimony, record or confession. The caster's
hidden receipt is not an NPC clue. Detection does not necessarily break the effect;
recognizing a compulsion can coexist with being unable to disobey it.

P7: Neither dislike nor restitution is automatic. A harmful discovery can cause
wariness, negotiation, separation, forgiveness, a complaint or no further action.
A helpful discovery can bring gratitude and a stricter future boundary together.
Keep later escalation bounded by means, knowledge, goals and a closure condition.

## A: Aftermath has several independent endings

A1: Stop the source; clear the imposed state; restore altered records; repair
material harm; settle obligations; recover confidence; reconcile a relationship.
These are distinct actions. A dispel can accomplish only the first two. A sincere
apology can be welcomed while access to a workshop remains revoked.

A2: Expiry does not undo completed causation. A rescued person stays rescued;
crafted goods remain under their actual ownership; a learned lesson remains if
its retention rule permits; a completed examination has its actual result.
Institutions may separately reassess a credential or contract when relevant
evidence reaches them. Do not silently revoke all achievements or certify all
coerced agreements as valid. Use the specific institution's declared rules.

A3: Household changes and children are persons and histories, not reversible
condition bonuses. Ending influence can change living arrangements, support
agreements and relationships without erasing someone's existence. Keep those
consequences within an authored, non-graphic family/continuity scope.

A4: Memory can be asymmetric. The caster remembers an encounter the target
forgot; the target remembers distress the caster did not perceive; a witness
remembers what both parties missed. Private memories do not become shared facts
until an actual communication or supported detection occurs.

A5: Do not subtract a temporary buff from an accumulated regard total on expiry
and assume the baseline is restored. Genuine intervening events may have changed
it. If a later implementation needs base state plus imposed overlay, choose that
explicitly and preserve provenance; the present condition seam is not proof of
such composition or counterfactual restoration.

## S: Small original scenes with observable differences

| Code | Setup | Outcomes to compare |
|---|---|---|
| S1 | A trusted smith refuses to lend the only furnace key during an order. | Friendship remains; offers supervised evening use. Emotional warmth does not alter custody. Behavioral control may obtain the key without obtaining permission. |
| S2 | A volunteer requests five minutes of calming to cross a damaged bridge. | Agreed calming plus successful crossing can produce thanks. An unexpected obedience mode can prompt a boundary despite the rescue. No clue means no automatic discovery complaint. |
| S3 | A warehouse porter is compelled to carry a crate, remains aware and resists inwardly. | Goods change location; compulsion expires; the porter can refuse a later shift if the cause is identified. A masked caster may remain unidentified. |
| S4 | An enthralled apprentice eagerly helps build a useful pump. | On release they may keep the craft skill, value the pump, resent the induction, continue on new terms or leave. Different conclusions require authored reasons. |
| S5 | A friend hears an accusation from a doubtful witness after a consensual rescue. | They can investigate or accept the agreement's record. Mere accusation neither grants exact mechanism knowledge nor forces bond loss. |

## G: Candidate acceptance gates, none run

G1: Select one authored mechanism and two different uses; show the same request
with affection, independent refusal and imposed behavior producing different
results. Avoid a generic max-regard obedience gate.

G2: Compare declared expiry/removal with lasting goods and separate memory;
show one discovered and one undiscovered use without omniscient NPC reaction.

G3: Show one consensual helpful use, one boundary violation and two plausible
aftermaths. Include settled closure and no compulsory revenge scheduler.

G4: If implemented later, save/reload/import active state and aftermath under a
declared compatibility policy, then rebuild and exercise its actual desktop
route from a fresh test origin. Source checks alone cannot close this gate.

Open: choose a first scene, select mechanisms and retention policy, coordinate
owners and review its actual planner/observer/storage adapters. No runtime
enthrallment, NPC-autonomy or playable acceptance claim follows from this audit.
