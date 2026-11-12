# Hogwarts spell vocabulary and technique

**2026-11-11 · Research proposal · Source-spot-checked.** Scope is Hogwarts spell technique and composition, following [HD1–HD5, DR1–DR5 and DT1](GU_AND_HOGWARTS_RULE_DERIVATION_2026-11-11.md#hogwarts-spell-rules). This is a bounded source pass and paper design under AD38, AD49, AD51 and AD56, with WPR1–WPR2, WPR21, WPR27 and WPR31. The Harry lead-life plan and current sequencing supply the game context. [Harry whole-world plan](../gm/dispatch/refinement-audits-2026-10-31/HP_WHOLE_WORLD_PLAN_2026-11-03.md)

Hogwarts can let players discover useful word patterns, practise alternate techniques and invent spells. Give roots the weight of clues to a spell's function. Give the resolver concrete operations, bound targets and a technique that can carry those operations. The same evaluator can then explain a familiar cast, change one input or test an unlisted combination. It can also show where the player has an idea and still needs to discover a workable technique.

## V1. What the books let us encode

**Evidence key.** **B** = shown or stated in the book, **I** = inference from those observations, **G** = original game rule, **?** = unresolved. B1–B7 and page numbers refer to the held English omnibus identified by SHA-256 prefix `9db33901964c`. The prepared FTS5 index separates the seven novels from the rehearsal script. Search hits led to bounded local scene checks. The [revision inventory](power-systems/wiki-digests/full-dumps/harrypotter_SOURCES.json) pins secondary leads, including [Levitation Charm r2024410](https://harrypotter.fandom.com/wiki/Levitation_Charm?oldid=2024410), [Dangling Jinx r1987360](https://harrypotter.fandom.com/wiki/Dangling_Jinx?oldid=1987360), [Liberacorpus r1996188](https://harrypotter.fandom.com/wiki/Liberacorpus?oldid=1996188) and [Mobilicorpus r2023275](https://harrypotter.fandom.com/wiki/Mobilicorpus?oldid=2023275). The local inventory marks these pages unread. The existing [revision digest](power-systems/wiki-digests/DIGEST_harry-potter.md) was checked for prior semantic work. Neither wiki metadata nor adaptation gestures supply book facts here. The sample used held materials throughout.

| Book case | Words and modifiers | Speech, gesture and focus | Target, operation and ending |
| --- | --- | --- | --- |
| B1 pp137–138, first Charms lesson | **B** Wingardium Leviosa. Flitwick teaches accurate pronunciation. **I** The lev-like part is a lift clue. | **B** Spoken with a taught swish and flick. **?** Independent weights for speech and motion, and any separate mental focus. | **B** Hermione's feather rises and hovers. Harry's stays down and Seamus's catches fire after he prods it. **?** Cause of the fire beyond the narrated sequence, exact hover duration and release trigger. |
| B1 p142, troll. B7 p3716, sidecar | **B** Same phrase for both. | **B** Ron cries it. Harry points at the sidecar and shouts. **?** Complete wrist motions and mental instructions. | **B** The club rises, turns and drops. The sidecar rises, remains unsteerable and starts sinking. **I** Bind lift, continued support and steering separately. **?** What ended either lift. |
| B6 pp3131–3132 and B7 p4163, dangling | **B** Levicorpus, annotated for nonverbal use in the book Harry reads. **I** `lev-` suggests lift and `-corpus` suggests a body argument. | **B** Harry thinks it and flicks upward while pointing at nothing in particular. Hermione later whispers and points at Harry. **?** How the first cast selected Ron, and whether Hermione used a flick. | **B** Both people are hoisted by an ankle. **I** The ankle and orientation come from the jinx's operation. **?** Safe height, range and typical duration. |
| B6 p3132, release. B3 p1039, transport | **B** Liberacorpus and Mobilicorpus. **I** The first parts suggest release and movement respectively. | **B** Harry thinks the release with effort. Lupin mutters the transport spell. **?** Complete motions and prescribed focus. | **B** Ron falls onto his mattress after the release. Snape is raised by several points into a nearly upright position, just above the ground, for transport. **I** A body role carries across the words, with different anchor arrangements and operations. |
| B3 pp885–887, Patronus lesson | **B** Expecto Patronum, including Harry's self-correction. **?** Which word carries any reusable magical function. | **B** Spoken in this lesson. Lupin explicitly calls for concentration on a very happy memory. | **B** Harry gets a silver wisp during practice. **I** A valid attempt can produce a partial manifestation. **?** The isolated contribution of memory quality, pronunciation and practice. |
| B4 p1461, first task | **B** Accio Firebolt. **I** The second term binds a referent in this form. | **B** Harry shouts. He waits, hoping for it to come. **?** Any exact gesture or prescribed thought. | **B** The Firebolt arrives from out of sight and stops in midair beside Harry, who mounts it. **I** Summoning includes approach to the caster in this example. **?** Whether the terminal hover comes from the cast, the flying broom or both. |
| B7 pp4018, 3916 and 4058, protection | **B** Protego and Protego Totalum. **I** Totalum could qualify the coverage of protection or identify a distinct perimeter method. | **B** Spoken. At p4058 Hermione moves around the site with her wand while casting more than one charm. | **B** Standalone Protego interposes a shield between people and knocks Hermione back. Protego Totalum occurs in a group of camp wards. **?** What Totalum changes in isolation. Keep the caster's route and the other wards as potential contributors. |

The leading reading of **lev-** is a cue for upward displacement or support. A strict reading as upward displacement captures the rising moment and leaves out the documented hovering. A reading as general control of an airborne object overpredicts steering for the sidecar. Use upward lift as the first operation and make support and steering separate fields. The repeated **-corpus** predicts a body target better than an ankle anchor. The transport scene uses several points, and the release reads an existing suspension. The similarities justify a candidate family and argument type. They leave the productivity of either root and any segment boundaries open. In particular, these scenes supply no usable separate function for **Wingardium**. The spell can be learned as a whole while the player investigates the parts.

## V2. Reserved family check · Wand-light

Keep lighting and extinguishing out of the derivation above. Apply the rules as written to that family and compare against a literal word-to-effect alternative. This is a qualitative check with a reserved family of scenes, with familiar spell names and a small sample. It gives no corpus accuracy estimate. Secondary discovery leads are [Wand-Lighting Charm r2026766](https://harrypotter.fandom.com/wiki/Wand-Lighting_Charm?oldid=2026766) and [Wand-Extinguishing Charm r2018999](https://harrypotter.fandom.com/wiki/Wand-Extinguishing_Charm?oldid=2018999). The results below come from the novel passages.

| Rule under challenge | Reserved observations and result |
| --- | --- |
| A termination method can bind an active effect without sharing the initiating spell's word stem. The literal alternative looks for shared roots to identify the counterpart. | **Supports explicit termination.** Whispered Lumos produces wandlight in B3 p992. At B3 p995 both speakers say Nox and both wandlights go out. B7 p4265 shows Harry extinguish his wandlight alone. Nox has a different stem. These examples leave somebody else's light, mundane flames and empty targets open. |
| Bind a spell's actual means and target separately. A uniform held-wand gesture rule predicts failure when the wand is out of hand. | **Rejects the uniform rule.** In B5 p1862 Harry says Lumos while searching the ground with his hands. His nearby wand tip lights before he picks the wand up. This supports a nearby, unheld wand in that scene, with distance and selection rules open. |
| Operation strength and its observed use can depend on world state. A bare word-to-success map predicts useful light from the same word. | **Rejects uniform success.** At B7 p3987 Harry's damaged and briefly rejoined wand sparks feebly, then goes dark. In B6 p3615 Ginny reports that Lumos and Incendio failed to penetrate the darkness. The latter is a visibility outcome, with emission itself unresolved. |

The reserved family supports a typed target, an effect to terminate and a way for conditions to change the result. It offers no new evidence that a stem can be combined freely or that a single motion has a fixed effect across spells. One future lexical trial could score effect family, target role and scope separately on whole withheld families, against the most frequent family and whole-incantation lookup. Count unsupported predictions and abstentions independently. Film, game and script forms need their own evidence labels.

## V3. Casting and composition proposal

Keep each learned form's words, optional target terms, speech mode, gesture, focus and implement together as a technique. The technique points to operations. Operations declare what they read, what they change, which effects they start and how those effects end. An unknown entry in a scene is an evidence gap. In an experiment, report the unsupported binding or technique to the player as an unresolved forecast.

**G** For an ordinary working lift, bind a real target, apply upward motion and keep a support effect when the technique supplies one. Give active effects stable identities tied to their target and operation. A paired release can then resolve the relevant support, and ordinary physics resumes with the target's position and surroundings. Use a duration or sustaining condition that the method supplies. Record termination causes separately so a deliberate release, fading support and a blocked cast can produce different observations. The book does not give a duration table or settle whether every simultaneous lift needs concentration.

**G** For invention, first assemble compatible operations, then test a proposed way of executing them as one technique. A useful compound needs a handoff condition, a shared target and a means of sustaining whatever stays active. The generator can suggest forms using plausible roots or a practiced gesture, with compatibility reported separately from evidence for that exact expression. Treat invented words, motion transitions, stamina, difficulty and duration as game choices and let practice or direct experimentation establish the character's knowledge.

| Trial | Paper trace and observable check |
| --- | --- |
| **T1. Known replay · The troll's club** | Bind Ron, his wand and the club the troll is holding. Use the learned spoken lift, lift the club out of the troll's grasp. End support while the club is above the troll, then let the falling club collide. **B** The book shows the rise, turn, drop and hit. **G** For the replay fixture, start with the club in a raised grip above the troll, then terminate support on cue. The book leaves the lateral path, exact motion and release cause open. Move the troll out of the falling path in a control and expect no hit. A typed impact consumer, with consequences decided by the world, distinguishes this from a cast that merely displays success text. |
| **T2. Variation · Whispered Levicorpus** | Bind the same person and ankle suspension in two paper attempts, with target selection, lift strength and wand motion held constant for the comparison. Change the mode from mental to whispered. **G prediction** Both techniques can produce the same ankle suspension where the caster has the execution skill for that mode. Their audibility can differ. **B check** B6 p3132 and B7 p4163 show the same ankle outcome across the two modes, with different casters and circumstances. Gesture equivalence, comparative difficulty and detection distance remain open. Follow either attempt with Liberacorpus and check that ending the suspension yields a fall to the actual surface. |
| **T3. Unlisted single cast · Fetch and hold a jar** | Bind an ordinary jar and a reachable spot within arm's reach in a clear practice lane. First try learned Accio and observe its arrival and support, then try the two-cast sequence: Accio gets the jar to reach and a separately initiated levitation cast supports it, if the same jar is still available. For a single experimental cast, propose one practiced contour with an approach phase followed by a hold phase triggered when that same jar reaches the spot. **G prediction** One activation creates one cast record, makes one approach-to-hold transition and suspends the same jar until release or expiry. An obstacle that prevents arrival leaves the hold phase unstarted. Releasing the held jar drops it onto the surface below. If Accio alone already provides the same controllable support for the ordinary jar, this candidate needs to show an added capability before it earns its own form. |

T3 has an operation-level prediction and an open linguistic question. A player can attempt a learned fetch followed by a learned lift without solving either spell's etymology. A single cast needs a technique that carries both phases in one activation. A proposal that simply speaks two familiar incantations in order gives evidence for a sequence. The Firebolt's midair stop makes its case unsuitable as the sole control for the jar's hold behavior.

## V4. Fit to YAIR's current owners

[The area guide](../AREA_GUIDE.md#powers-and-abilities) routes HP spell definitions through `power_grammar.js`, `spell_seam.js`, `ability_records.js` and `spell_cast_lowering.js`. [The Hogwarts spell module](../../src/hp_lead_spells.js) uses one existing learned `HP_LEVITATION` power for both the feather cast and the pass to Ron. The basic cast settles a knowledge note. Passing also settles a fixed inventory transfer to Ron, using the lesson's issued feather. These are live consumers of the same learned power. The school predicate, assumed stamina and failure values, and seeded practice behavior belong to the current game model. The lesson text mentions words and wrist motion while the cast has no executable speech or wand checks. The pass has an authored destination and supplies no general steering law. [Lesson owner](../../src/world_packs/book_hp_lead_life_data.js) · [Local power dials](../../src/power_grammar_worlds.js)

Keep the source annotations and interpretation in Hogwarts data. Lower justified preconditions through the existing typed formula predicates. Resolve live technique, target and instrument bindings before command settlement, and recheck them when executing a forecast. Reuse the native power, costs, failure and practice path and its save identity for the learned charm. Use the existing knowledge or observation owner for what a character learns from an attempt. `composePower` prices numeric axes and concatenates typed effects from distinct functions. It has no arrival transition, target-motion simulation or support lifecycle. The first physical slice needs a position and effect lifetime that the scene can actually consume. Check the existing situation and custody owners for that representation. An inventory transfer belongs at handoff to a holder and a knowledge note can describe what happened. Both leave physical support to the world state that applies it. Keep the Hogwarts-specific technique and lifetime rules in the world adapter. Reuse the shared binding and settlement mechanisms where they fit, and revisit the boundary when a different world needs the same behavior. [Power composition](../../src/power_grammar.js) · [Spell seam](../../src/spell_seam.js) · [Cast lowering](../../src/spell_cast_lowering.js) · [Typed effects](../../src/simulation_contracts.js)

## V5. Next implementation check

Use a named school practice fixture with the learned charm, a tagged ordinary jar, a bench and a catcher. Exercise the existing Hogwarts cast entry point with a deterministic successful roll, then with a fizzle. On success, check that the same jar leaves the bench and has an active support that a release or expiration can end. Check that the catcher receives it if positioned under the drop and that missing or stale target bindings leave the scene consistent. Compare the simple lift, the two-command fetch and lift, and the single experimental cast against the same Accio control before giving the compound a learned entry. If a hold spans a save, verify the same identity, remaining lifetime and release after save, reload and Export/Import. Rebuild and use a fresh desktop browser origin to observe target, spend, result and release. Extend the existing cast test for the first stateful invariant. [Cast test](../../tests/spell_cast_lowering.test.js) · [Delivery floor](../RULES_INDEX.md#definition-of-done-the-floor-ad43)

**Checks run.** Bounded read-only FTS5 and locator queries against the held seven-novel index. Exact novel windows were checked for training and reserved cases. Revision identities were checked against the local Fandom metadata. `node --test tests/spell_cast_lowering.test.js tests/hp_charm_bridge.test.js` passed 11 tests on the shared checkout at HEAD `b92e1e87f`. That run covers the current cast and bridge behavior. T1–T3 are paper traces and predictions, with no new runtime, browser or persistence evidence.

## V6. Proficiency, compression and personal spellcraft

Second design round, 2026-11-11. **Source-spot-checked with a whole-index concordance.** The aim is to derive rules that explain familiar spells together, including cases where one person's version differs from another's.

### ACT NOW

**V6a. Check the full held candidate sets.** Queried the seven novels' 4,353 indexed pages for every spell label in the October census, every spell-infobox title in the pinned Fandom inventory, and every normalized candidate in the held quote extraction. Used tokenized, case-insensitive phrase searches with the rehearsal script excluded. This is candidate-level coverage of the available lists. A hit can be a cast, failed attempt, lesson, mention, duplicate alias or incidental dialogue. It earns a source locator before it earns a rule.

| Held input | Result | What it can support |
| --- | --- | --- |
| 100 October census spell rows | 98 labels matched as written. The remaining two are compound or formatting cases. `Apparition / Apparate` needs two searches, and `Muggle-Repelling Charm` is rendered as `MuggleRepelling` before “and Disillusionment Charms” at B7 p3936. Both have book leads. | Searchable census with aliases and labels still overlapping. Patronus Charm and Expecto Patronum, for example, are two labels for one spell. |
| 777 spell-infobox pages in the revision inventory | 137 titles matched literally, 640 had no literal title hit. Templates were normalized for case and spaces versus underscores. Among the hits are extra useful leads such as Anapneo, Erecto and Evanesce, and common words such as “time”. | Discovery across media. An unseen title can still name magic that the novels narrate under another name or with no words reported. The snapshot provides revision IDs but its referenced private full-text cache was unavailable. [Pinned inventory](power-systems/wiki-digests/full-dumps/harrypotter_SOURCES.json) |
| 513 raw quote candidates, 509 distinct after Unicode normalization, case-folding and stripping punctuation | All 509 distinct candidates hit. This is expected because the candidates came from the held text. Context separates a spell form from dialogue, map commands, false starts and failed attempts. | A second discovery route for variants and forms omitted by the title search. Useful misses in the old census include Dissendium (B3 p840), Evanesce (B5 pp1934 and 2106), Locomotor with a target (B5 pp1903 and 2519), and Langlock (B6 p3367). |

**Correction to the old census.** `Evanesco` misses the held edition's `Evanesce`, which is shown making scrolls and cauldron contents disappear. Record `Liberacorpus` (B6 p3132) and the extracted `Liberatocorpus` (B7 p4163) as two source forms associated with releasing a dangling person. Do the same with the extracted `Winguardium Leviosa` (B7 p4265) and the usual form. Spelling, edition and extraction differences need adjudication before any of these become evidence for pronunciation tolerance or a player's invention. In contrast, Cho's stumbles during Disarming practice (B5 p2287) occur in the scene. Lockhart's Peskipiksi Pesternomi does nothing on the page (B2 p364), and Ron's rhyme fails on Scabbers (B1 p84). These are failed attempts in those circumstances. An ordinary utterance such as the extracted `Elax` (B7 p3930) reads as advice through a mouthful, with no cast demonstrated. [Secondary discovery index](https://www.hp-lexicon.org/spells-and-potions/) · [Incantation index](https://www.hp-lexicon.org/magiccategory/incantations/)

**V6b. Compare families by what the shared words actually predict.** Score operation, target, scope and ending separately. A form can give a clue at one level and leave the others open. English-like phrases, Latin-like compounds and opaque forms can all carry methods. The official etymologies explain some authorial choices. The books provide the observations used to derive in-world behavior. [Official etymology examples](https://www.harrypotter.com/features/the-etymology-of-harry-potter-spells)

| Comparison | Supported reading and limit |
| --- | --- |
| **Movement and roles.** Mobilicorpus (B3 p1039), Mobiliarbus (B3 p847), Accio Firebolt (B4 p1461), Locomotor trunk and trunks (B5 pp1903 and 2519), Locomotor Mortis (B1 pp175 and 178). | **B** The first pair transports a body and a tree. Locomotor takes cargo names in the two scenes. The Leg-Locker joins legs. **I** `mobili-` suggests movement with a target class in the paired compounds. Accio and ordinary cargo Locomotor show an explicit target word. Locomotor Mortis challenges a rule that treats everything following Locomotor as cargo or predicts movement from the root alone. |
| **Revealing and specifying.** Homenum Revelio (B7 pp3822 and 4056), Specialis Revelio (B6 pp3075 and 3307–3309), Aparecium (B2 p506), Prior Incantato (B4 p1243). | **B** Homenum can disclose someone's presence. Specialis is tried on the annotated book and used in the antidote exercise. Aparecium yields nothing on the diary in that scene. Prior Incantato exposes a previous wand effect. **I** `revelio` is an information-operation clue. The named subject and method determine whether the query concerns people, properties or a wand's history, and what an empty result can establish. |
| **Scope, stages and release.** Petrificus Totalus (B1 p219), Protego Totalum (B7 pp3916 and 4058), Rictusempra and Finite Incantatem (B2 pp460–461), Sectumsempra (B6 pp3494–3495), Nox (B3 p995), Relashio (B7 p4165). | **I** Totalus and Totalum both suggest breadth. One binds a whole body and the other is observed in a perimeter routine whose component contributions remain open. Shared `-sempra` supplies no reliable rule for effect lifetime. Distinguish an active tickle, material injury left by a cut, a wand's emitted light and a cuff opened by applied force. Ending active magic and undoing its consequences are different operations. |
| **Different means to the same goal.** Alohomora works at B1 p128 and the door resists it at B1 p225. Dissendium opens a particular statue passage at B3 p840. Colloportus seals a door at B5 p2737. Portus makes a transport object at B5 p2773. | **I** Reason from the actual obstruction, keyed object or transport carrier. Sound resemblance and the player's goal of “get through” are too coarse to infer an operation. A successful alternate method may damage, move, open or bypass entirely different state. |
| **Use, interaction and output.** Stupefy against a dragon with several keepers (B4 p1433), Riddikulus followed by laughter (B3 pp772–778), Protean Charm linked coins (B5 p2292), and the Unbreakable Vow (B6 pp2879–2881). | **B** The examples show coordinated impacts, a follow-up act that disposes of the transformed Boggart, ongoing propagation from a master coin, and multiple parties with clause-by-clause participation. **I** Model the respective causal structures. A quick gesture can initiate a long-lived operation. Compression can shorten a repeated motion but changing the clause, affected link or laughter changes what actually happens. |

**Reserved comparisons for this round.** Mobilicorpus suggested mobility on a body. Mobiliarbus supports a mobility operation on a different target. Locomotor Mortis breaks the broader “movement words always move the target” prediction. Protego Totalum suggested scope might be modified by a near-identical qualifier. Petrificus Totalus supports breadth as a clue but does not supply a common geometry. Revealing spells support a common query role with distinct subjects, including an explicit no-observation case. This is a qualitative comparison across held families, without a blinded accuracy estimate.

### ACCOUNT FOR NOW

| Proposed rule | Book support and game implication |
| --- | --- |
| **V6c. Proficiency can internalize delivery.** | **B** In B6 pp3057–3059 Snape teaches nonverbal casting for surprise, Hermione silently repels Neville's jinx, and Harry produces a strong spoken Shield Charm in the same lesson. Harry's earlier mental Accio attempt fails while he is bound and separated from his wand (B6 p3032), so the cause is confounded. He succeeds at a mentally executed Levicorpus learned from a note (B6 p3132). **G** Make mental delivery a practisable technique. Familiarity can help, and general silent-casting practice can transfer where the technique shares demands. Allow a silent-first technique where it fits. Keep each character's spoken, whispered and mental reliability distinct where the difference affects choices. Silence removes a warning channel while a visible gesture, moving target or light may still give the cast away. |
| **V6d. Shorten effort by preserving what the step does.** | **B** Twycross teaches Apparition with destination, determination and deliberation, including a turn (B6 pp3321–3324). Apparition is depicted with very little outward preparation in other scenes (B6 p2858). That narration leaves the internal steps open. **G** Model rehearsed combinations of thought, words and motion as faster execution where each role still resolves. Make a shortened stroke, mentally supplied wording, or a prepared target distinct substitutions that can be tested. Preserve an action's genuinely separate commitments. A Vow's second party still answers each clause. A paired jinx still has something to suspend before a counter can release it. Out-of-hand light and Rowling's hand-gesture tradition make wand contact, wand possession, spoken words and body motion separate variables. [Rowling's Uagadou account](https://www.harrypotter.com/writing-by-jk-rowling/uagadou) |
| **V6e. Let understanding improve particular outputs.** | **B** Harry gets a wisp during Patronus training and builds up through practice (B3 pp885–887 and 894). Lupin teaches a specific focus. Vanishing instruction treats a mouse as harder than a snail even when students know the words (B5 p2203). Harry produces a powerful Sectumsempra while ignorant of its effect (B6 p3494). Crucio changes with intent in the scenes and their stated explanation (B5 p2764, B7 p4212). The same broken wand takes different repair attempts with different means (B7 pp3987 and 4354). **G** Understanding can improve prediction, precise targeting, transfer to more complex targets, and the ability to reshape a method. Give force, precision, duration, reliability and reach their own outcomes. A method can read intent, memory, wand condition, environment, resistance or coordination where the scene supports it. Understanding can matter a great deal on one axis and little on another. |
| **V6f. Make the player's modifications teachable and testable.** | **B** Snape claims his inventions (B6 p3599), and Harry learns some from the annotated book (B6 pp3077 and 3131–3132). Hermione has practised the talking Patronus application (B7 p3815). The novel shows invention, transfer through writing, and a new application of familiar magic. It leaves Snape's actual design method open. **G** Let a player keep a preferred pronunciation or stroke, change a binding such as anchor or target, alter one operation's parameters, add a companion effect, or propose a new multi-phase cast. Save a personal revision and its observed behavior alongside the learned parent. A successful new version can be taught, shared as notes or refined by another caster. Moving the target role or changing the effect requires evidence from an attempt, demonstration or explanation the character can use. Recording a variant preserves the earlier recipe for comparison and fallback. [Official summary of Snape's inventions](https://www.harrypotter.com/features/the-shrewd-skills-of-severus-snape) |

A caster can also work on themselves. Treat “self” as a target relation when the operation supports it, and distinguish modifying one's cast from having a different source of ability. Tonks changes her appearance at B5 pp1901–1902 and explains that she was born a Metamorphmagus. Animagus transformation has a separate source and form (B4 p1832). These cases keep transformation, self-targeting and innate faculties available without attributing every expert's change to spell fluency. The same distinction applies to a wand condition or another object that actually carries the magic.

**Fit to current owners.** The HP charm's existing practice record is the place to start with spell familiarity. The seeded fizzle roll can read the selected form's relevant competence and present conditions. The existing `fluencyDuration` can price elapsed time on timed work where it fits. Shortening elapsed time, substituting a mental action and omitting a physical requirement still need distinct traces. Represent a tried form as a small world-owned revision linked to the learned power, with the character's evidence in existing knowledge. Keep the selected form and its resolved means on any cast that persists across time. Keep established learned IDs and known recipes usable when adding revision records to old saves. This is a proposal for the current ability path under ABR10–ABR11. [Ability rules](../ABILITY_RULES.md) · [Power models](../../src/power_models.js)

### LATER / DELEGATE

| Check | Effort and observable result |
| --- | --- |
| **T4. Change delivery while holding the effect constant.** | Runtime designer, medium. Use the same caster, Shield technique, wand, jinx and scene. Compare familiar speech, an early mental attempt, and mental execution after specific practice. Verify whether the shield intercepts the same jinx, whether an observer hears advance warning, and how much execution time passed. Repeat under interruption. A fizzle identifies the missing execution condition without changing the learned spell. |
| **T5. Modify a learned technique and keep both forms.** | Runtime designer, medium. Starting with the jar fixture, practise a smaller lift stroke with the original target role, then separately change the hold height. Check that the shorter stroke can preserve the trajectory and that the height change affects where the jar can be caught. Compare both with the standard form under distraction. Save and reload the forms and the observed outcomes, then teach the shortened version and check transfer to a second caster. |
| **T6. Separate understanding from force.** | Runtime designer, medium. Start two casters with the same verbal lift practice and wand. Give one an explanation of how support ends and let both try the same raised jar and an unfamiliar target. Compare aim, timing, what each predicts, and peak height separately. Then change the instrument for both casters. A better release forecast or catch rate can coexist with identical peak height. This isolates what the teaching improved before giving it any effect on magnitude. |
| **T7. Extend concordance into a spellbook.** | Source and runtime designer, medium to large. Give every candidate a disposition and every verified novel form a stable method, first scene, any variants and field-level evidence. Resolve duplicate aliases, edition spellings, omitted dialogue, broader categories, adaptation forms and unexplained effects. Retain first evidence for each family and test later or different-family scenes before treating a root as productive. The October records and pinned titles are the starting coverage denominator, with new candidates added as found. |

**Coverage boundary.** The full searches establish how the held candidate lists match the corpus. Selected contexts across schoolwork, duelling, healing, travel, wards, ritual, communication and tool use supply the rule comparisons. Field-by-field reading of every cast, unnamed act and adaptation entry remains open. The proposed mechanics have paper predictions and no new gameplay verification.

## Appendix · Novel concordance

<details>
<summary>100 census labels and 24 additional vocabulary leads</summary>

Counts below are distinct indexed pages matching the phrase. Locators prefer a saved census scene when it also matches the current query, otherwise the first literal hit. Some initial hits are mentions, headings or an ordinary meaning of the word. A lead can belong to an existing spell, an artefact command, a failed attempt or a spelling variant. The expanded rows are leads for field review. Use V1, V2 and V6 for the claims checked in context.

To reproduce the search, bind each literal label as a quoted phrase in `SELECT locator FROM passages WHERE source LIKE 'HP-%' AND passages MATCH ? ORDER BY rowid`. Substitute the two search forms noted below for the compound or formatted labels. For the wiki pass, use the exact title from every row where a template normalizes to `spell infobox`. This keeps title match counts reproducible as the lexical interpretations change.

| Label or form | Matching pages | Locator or search note |
| --- | ---: | --- |
| Accio | 28 | B4:PDF-p1175 |
| Aguamenti | 4 | B6:PDF-p3107 |
| Alohomora | 7 | B1:PDF-p128 |
| Anapneo | 1 | B6:PDF-p3018 |
| Anti-Disapparation Jinx | 1 | B5:PDF-p2772 |
| Aparecium | 1 | B2:PDF-p506 |
| Apparition / Apparate | 34 | B3:PDF-p805 (searched as `Apparate`) |
| Avada Kedavra | 18 | B4:PDF-p1321 |
| Banishing Charm | 1 | B4:PDF-p1584 |
| Bat-Bogey Hex | 3 | B5:PDF-p2705 |
| Bubble-Head Charm | 1 | B4:PDF-p1611 |
| Cave Inimicum | 2 | B7:PDF-p3917 |
| Cheering Charm | 1 | B3:PDF-p949 |
| Colloportus | 2 | B5:PDF-p2737 |
| Confringo | 2 | B7:PDF-p3717 |
| Confundo | 1 | B7:PDF-p4153 |
| Confundus Charm | 3 | B3:PDF-p1050 |
| Cruciatus Curse | 20 | B4:PDF-p1319 |
| Crucio | 14 | B4:PDF-p1320 |
| Dark Mark | 48 | B4:PDF-p1236 |
| Defodio | 1 | B7:PDF-p4166 |
| Deletrius | 1 | B4:PDF-p1243 |
| Densaugeo | 1 | B4:PDF-p1404 |
| Deprimo | 1 | B7:PDF-p4057 |
| Descendo | 2 | B7:PDF-p3752 |
| Diffindo | 5 | B4:PDF-p1447 |
| Disarming Charm | 3 | B2:PDF-p459 |
| Disillusionment Charm | 6 | B5:PDF-p1904 |
| Dissendium | 4 | B3:PDF-p839 |
| Duro | 1 | B7:PDF-p4258 |
| Engorgement Charm | 3 | B2:PDF-p381 |
| Engorgio | 2 | B4:PDF-p1320 |
| Ennervate | 3 | B4:PDF-p1240 |
| Episkey | 2 | B6:PDF-p3034 |
| Erecto | 1 | B7:PDF-p3917 |
| Evanesce | 2 | B5:PDF-p1934 |
| Expecto Patronum | 19 | B3:PDF-p885 |
| Expelliarmus | 23 | B2:PDF-p459 |
| Expulso | 1 | B7:PDF-p3816 |
| Ferula | 1 | B3:PDF-p1039 |
| Fidelius Charm | 8 | B3:PDF-p851 |
| Fiendfyre | 1 | B7:PDF-p4251 |
| Finite | 4 | B2:PDF-p461 |
| Finite Incantatem | 2 | B2:PDF-p461 |
| Flagrate | 1 | B5:PDF-p2719 |
| Full Body-Bind | 3 | B1:PDF-p220 |
| Funnunculus | 1 | B4:PDF-p1404 |
| Furnunculus | 1 | B4:PDF-p1835 |
| Furnunculus Curse | 1 | B4:PDF-p1835 |
| Geminio | 1 | B7:PDF-p3907 |
| Glisseo | 1 | B7:PDF-p4258 |
| Homenum Revelio | 2 | B7:PDF-p3822 |
| Hover Charm | 6 | B2:PDF-p275 |
| Impedimenta | 12 | B4:PDF-p1731 |
| Imperio | 6 | B4:PDF-p1318 |
| Imperius Curse | 36 | B4:PDF-p1318 |
| Impervius | 4 | B3:PDF-p820 |
| Incarcerous | 2 | B5:PDF-p2699 |
| Incendio | 3 | B4:PDF-p1154 |
| Jelly-Legs Jinx | 2 | B4:PDF-p1715 |
| Killing Curse | 14 | B4:PDF-p1321 |
| Langlock | 1 | B6:PDF-p3367 |
| Leg-Locker Curse | 3 | B1:PDF-p175 |
| Legilimency | 12 | B5:PDF-p2444 |
| Legilimens | 6 | B5:PDF-p2448 |
| Levicorpus | 5 | B6:PDF-p3131 |
| Liberacorpus | 1 | B6:PDF-p3132 |
| Liberatocorpus | 1 | B7:PDF-p4163 |
| Locomotor | 3 | B1:PDF-p178 |
| Locomotor Mortis | 1 | B1:PDF-p178 |
| Lumos | 22 | B2:PDF-p548 |
| Memory Charm | 9 | B2:PDF-p577 |
| Meteolojinx Recanto | 1 | B7:PDF-p3899 |
| Mischief managed | 3 | B3:PDF-p838 |
| Mobiliarbus | 1 | B3:PDF-p847 |
| Mobilicorpus | 1 | B3:PDF-p1039 |
| Morsmordre | 1 | B4:PDF-p1235 |
| Muffliato | 9 | B6:PDF-p3131 |
| Muggle-Repelling Charm | 1 | B7:PDF-p3936 (searched as `MuggleRepelling`) |
| Nox | 2 | B3:PDF-p995 |
| Obliviate | 4 | B2:PDF-p584 |
| Obscura | 1 | B7:PDF-p3943 |
| Occlumency | 40 | B5:PDF-p2428 |
| Oppugno | 1 | B6:PDF-p3213 |
| Orchideous | 1 | B4:PDF-p1415 |
| Patronus Charm | 5 | B3:PDF-p884 |
| Peskipiksi Pesternomi | 1 | B2:PDF-p364 |
| Petrificus Totalus | 9 | B1:PDF-p219 |
| Point Me | 2 | B4:PDF-p1728 |
| Portus | 2 | B5:PDF-p2376 |
| Prior Incantato | 1 | B4:PDF-p1243 |
| Protean Charm | 1 | B5:PDF-p2292 |
| Protego | 11 | B5:PDF-p2513 |
| Protego Totalum | 2 | B7:PDF-p3916 |
| Quietus | 1 | B4:PDF-p1223 |
| Reducio | 3 | B4:PDF-p1320 |
| Reducto | 2 | B5:PDF-p2736 |
| Reductor Curse | 4 | B4:PDF-p1715 |
| Relashio | 4 | B4:PDF-p1600 |
| Rennervate | 2 | B6:PDF-p3560 |
| Reparo | 11 | B4:PDF-p1276 |
| Repello Muggletum | 1 | B7:PDF-p3916 |
| Rictusempra | 1 | B2:PDF-p460 |
| Riddikulus | 10 | B3:PDF-p772 |
| Salvio Hexia | 2 | B7:PDF-p3916 |
| Scourgify | 3 | B5:PDF-p1903 |
| Sectumsempra | 8 | B6:PDF-p3494 |
| Serpensortia | 1 | B2:PDF-p462 |
| Shield Charm | 15 | B4:PDF-p1715 |
| Silencio | 3 | B5:PDF-p2265 |
| Sonorus | 3 | B4:PDF-p1209 |
| Specialis Revelio | 2 | B6:PDF-p3075 |
| Stunning Spell | 15 | B4:PDF-p1441 |
| Stupefy | 21 | B4:PDF-p1237 |
| Summoning Charm | 15 | B4:PDF-p1175 |
| Tarantallegra | 2 | B2:PDF-p461 |
| Tergeo | 3 | B6:PDF-p3039 |
| Tickling Charm | 1 | B2:PDF-p460 |
| Unbreakable Vow | 6 | B6:PDF-p2879 |
| Undetectable Extension Charm | 1 | B7:PDF-p3813 |
| Unforgivable Curses | 7 | B4:PDF-p1323 |
| Waddiwasi | 1 | B3:PDF-p769 |
| Wingardium Leviosa | 4 | B1:PDF-p137 |
| Winguardium Leviosa | 1 | B7:PDF-p4265 |

</details>

## V7. Scene checks, lorecrafting and a working dictionary

Third design round, 2026-11-11. **Source-spot-checked.** This pass sampled actual casts and aftermath across the held novels, including places the prose gives an effect or a description with no quoted formula. It follows V6's candidate sweep with checks on execution, failure, and how people describe magic. Lorecrafting here means both designing a plausible new piece of magic and giving it a history people in the world can encounter.

### ACT NOW

**V7a. Check the rules on casts, including cases a word search misses.** The table describes book observations and the smallest inference they support. Record whether speech is explicitly absent, inaudible to an observer, reported without words, or simply unreported. A failed result has a place in the causal sequence, with an unknown cause where the scene leaves it open.

| Family and scene | What happens in the book | Rule tested |
| --- | --- | --- |
| **Silent attack, unnamed curse.** B5 pp2742 and 2805. | Silencio takes Dolohov's voice. He then makes a slashing wand movement and an unnamed curse injures Hermione. The later account explicitly says speaking the incantation would have made it more effective. | Silence can preserve an operation with lower effect in a particular form. It neither makes every form weaker nor guarantees a clean failure. No spell name or exact damage ratio is needed to use this evidence. |
| **Silent restraint, name uncertain in the scene.** B6 p3573. | Harry initially mistakes his sudden immobility for an effect of Draco's Expelliarmus. He realizes Dumbledore immobilized him wordlessly, and that the time Dumbledore took to do so cost him the chance to defend himself. | Silent casting still takes an action. Store attribution separately from what a witness first concludes. Preserve the time it takes to act when the timing changes who can respond. |
| **Named mental jinx against opposition.** B6 pp3131–3132 and 3494. | Harry thinks Levicorpus and suspends Ron. Later he thinks it with a flick during the duel, and Draco blocks the jinx. | Distinguish delivering a form from reaching and affecting the target. A blocked jinx supplies different practice evidence from an inability to produce it. |
| **Silent schoolwork, words unreported.** B6 pp3307–3309. | Harry and Ron cannot copy what Hermione is doing by listening. They copy the audible Specialis Revelio from Ernie. The lesson is on identifying a blend's ingredients and developing an antidote. | Silence changes what a bystander can learn. Hermione's exact incantation stays unknown in this passage. Ernie's words are a learnable clue and do not by themselves finish the assignment. |
| **Healing, unnamed spoken countercurse.** B6 pp3494–3495. | Snape traces his wand over Draco's wounds and murmurs an incantation that sounds like song. After the first pass the bleeding eases. After another the wounds seem to knit. He performs it a third time before moving Draco. | Represent the observed treatment sequence and intermediate changes. The prose leaves open whether the passes are distinct operations or cumulative doses of one operation. An expert's fluent performance still has meaningful stages. |
| **Apparition, failure after partial completion.** B6 pp3321–3324. | Twycross teaches three steps. Susan Bones reaches the hoop with one leg left behind. An intervention restores her. | A method can partly change the world before it fails. Retain the two actual positions and the need for rescue. The text does not isolate which part of Susan's technique failed. |
| **Summoning, blocked use.** B7 p4162 against B4 p1461. | Accio brings Harry his broom. Hermione calls for the cup, which does not come, and Griphook reminds her the attempt is useless in this situation. | A named target and a correctly delivered phrase can coexist with an ineffective means. Bind the scene's obstruction and keep the exact defense open here. Harry also tries Accio on Hagrid at B7 p3719, but the falling bike and rescue obscure the result. Record an attempt with uncertain attribution and leave the living-target rule open. |
| **Memory, failed instrument.** B2 pp584 and 607 against B4 p1184. | Lockhart uses Obliviate with Ron's damaged wand. It explodes and the Memory Charm hits Lockhart. An official casts Obliviate on Mr. Roberts with the expected immediate change in demeanor. | Separate an instrument backfire from an ordinary fizzle. Retain the instrument's damage and the actual affected person. A successfully delivered effect may have landed on the wrong recipient. |
| **Elf magic, unnamed action and mistaken blame.** B2 p274 and B6 p3297. B7 p4103 provides a different elf action. | Dobby makes the pudding hover and drop. Dumbledore later identifies the act as the Hover Charm for which the Ministry blamed Harry. At Malfoy Manor, Dobby points and Narcissa's wand is sent flying during the exchange. | Record a world operation even when the caster's tradition or execution differs. A later institutional label can link an event to a family without settling its technique. Nearby magic, caster identity and legal attribution stay separate. |
| **Unintended magic, outcome without an intended formula.** B3 pp659 and 672. | Aunt Marge inflates during the confrontation. Harry later thinks of it as inflating his aunt and worries about punishment. | An unintended magical event can create real consequences and vernacular without first becoming a learned cast. The observer's “blew up” describes the result and supplies no reproducible incantation. |
| **Fire, goal failure after a successful cast.** B7 pp4246–4251. | Crabbe starts a fire Hermione later identifies as Fiendfyre. It escapes his control. Harry casts Aguamenti, producing a jet of water that evaporates before it can put out the fire. | Record production, interaction, control and termination separately. Harry's water spell produces water even though it fails his goal. Starting dangerous magic need not demonstrate that the caster can stop it. |
| **Same known form, altered application and observer response.** B3 p820 and B5 p2270, B7 pp3889 and 4163. B7 p3728 provides the recognition contrast. | Impervius first repels water on glasses. A team tries it against rain, Hermione suggests it as interim protection from office rain, and she attempts it against hot treasure. Those contexts differ in how clearly they show success. Lupin says enemies take Expelliarmus as Harry's signature move. | Changing the use, target or threat can be worth playing while keeping the same spell. Test whether the existing mechanism works in the new context before giving it a new effect. Repeated tactical choices can teach observers what to expect even when the player never edits a formula. |
| **Spoken words as a key.** B2 p580 and B7 pp4012–4013, 4067 and 4240. | Harry's first request to the Chamber entrance comes out in English. The Parseltongue request opens it. Ron later imitates what he heard Harry use on the locket and opens the Chamber after several tries. Harry tries Parseltongue on the Snitch without opening it. | The same intended meaning can travel through different speech, and an imitated phrase can be sufficient for a particular receiver. The receiver must recognize and act on it. The scene supplies no general language fluency or universal opening power to Ron. [Official comparison](https://www.harrypotter.com/features/everything-you-didnt-know-about-parseltongue) |

**V7b. Keep or revise the three proposed rules.**

- **Mental casting holds as a learned or available delivery, with spell-specific outcomes.** V6's school Shield cases survive the check. Dolohov adds a case where removing voice reduces effect and Dumbledore adds one where casting silently still consumes a response window. A silent observer may see a wand movement or feel the effect. Treat “heard no words” as the observer's evidence, and record an actually mental or wordless cast when the source supports it.
- **Shortening holds as a way of carrying out a function with less overhead.** Ron's imitation separates a small executable phrase from knowing a whole language. The Apparition accident and Draco's treatment show why a compressed action needs a trace of the operations and partial outcomes the player can change. A narrated shortcut gives a hypothesis about efficiency, with no automatic duration reduction for every quiet cast. A physical commitment, response or applied treatment remains consequential when a scene needs it.
- **Modification holds at several scales.** Target and application changes are directly comparable with Impervius. The Prince's spells establish invention and transmission. The evidence for a player deliberately rewriting a learned incantation to add a function is thinner. Model that as original research with a testable prediction. Keep a form variant, a parameter or target variant, a newly composed cast, and two separately initiated spells distinguishable by what the cast actually does.

### ACCOUNT FOR NOW

**V7c. Choose the smallest representation that preserves decisions.**

| Abstraction | What needs a durable representation and when to add detail |
| --- | --- |
| **Cast, effect and consequence** | A cast binds a caster, means, target and technique. An effect can then travel, persist, end or be countered. Consequences such as a wound or dropped item may outlive it. A preview can say which link is uncertain. Promote effect identity and lifetime when two spells can target the same ongoing magic, when an interruption matters or when it survives a save. A one-shot action can settle directly through its existing consumer. |
| **Causal phase rather than body choreography** | Keep the phases whose order, overlap or interruption changes the result. Gesture quality can be an input and time an aggregate in a routine cast. A branch such as “water evaporated before contact,” “cuffs opened” or “the second pass eased the wound” merits a phase or outcome the scene can read. Use a fixture dial when the source leaves the exact timing unstated. |
| **Unnamed methods and confidence** | An unnamed successful cast can be authored with a stable reference, effect and the known conditions, leaving words and exact motion open. This is enough for a witnessed event and its consequences. Promote it to a repeatable learnable method when the world has a teacher, usable notes, or a successful reconstruction. Keep competing identities as claims. Colour, apparent motion and similar names can be clues without becoming merge keys. |
| **Failure and feedback** | Use a short chain of questions for settlement: did the technique engage, did the target receive it, what changed, and did that serve the goal? This covers fizzle, block, backfire, partial settlement, propagation and failed control. Give the player evidence they could observe, for example a working water jet that never reaches the fire. Reuse existing harm, custody, situation and knowledge writes for those changes. |
| **Routine and deliberate casting** | A familiar use can resolve as one action or as part of a routine. The player can open the method to choose a form, inspect a witness account, repeat a trial or intervene. Keep actual target availability, commitments, timing and consequences during a repeated activity. Let established skill remove repetitive input when the player can reliably carry out the same work. [Activity abstraction](../ACTIVITY_ABSTRACTION_RULES.md) |

**V7d. Give inventions a place in the world.** Start with a purpose, an available teacher, tool or text, and a scene where changing the technique matters. A player who wants both hands free can practise a low jar hold. An instructor might identify it as an application of the Levitation Charm, while a classmate remembers it as “the one that kept the jar off the bench.” Both descriptions lead to the same technique if they have that evidence. If the player later makes it fetch the jar first, the new behavior earns a linked revision and its own trial. If a peer copies just the words, they may still lack the motion or timing that was written on the next line. A second caster demonstrating the same behavior establishes teachability in that setting. An accidental success can give someone a credible lead before they know how to reproduce it.

This is lorecrafting with provenance. Track who coined, demonstrated, revised or heard a form where that history changes access or interpretation. The Prince's notes, a classroom exercise, an office workaround and an institutional warning can describe the same operation at different resolutions. Invention can emerge from a practical need, an accident, a combined known effect or a borrowed tradition. Different names can persist in different circles. For generated content, select a known local operation and target before proposing vocabulary, then attach a usable scene and a reportable result. New lore should leave the player somewhere to learn, ask, test or act. The operating law stays with the world. The account and its confidence stay with whoever learned or wrote it.

**V7e. Build the dictionary around senses, uses and speakers.** Give each entry a stable link to the thing it describes where known. Store attested spellings or sounds, language, register, who used it, locator, and the relationship of that form to the referent. A term may be a spoken form, taught name, shorthand, institution's classification, place-specific command, colloquial description or disputed interpretation. Index all those forms for lookup. Retain original spelling in evidence, with normalized search keys alongside it. Display attested pronunciation or stress where available. Unknown motion, sound, author and equivalence stay open. Keep linguistic etymology, textual spelling and executable technique separate.

| Example lookup | What the dictionary should return |
| --- | --- |
| **Freezing Charm** | Contextual uses at B2 p364 (pixies) and B6 p2919 (burglar alarms), with an unresolved relationship between the methods. Cross-reference **Flame-Freezing Charm** (B3 p630), which changes the experience of fire, and Harry's initial description of being frozen (B6 p3573), which is an observed effect and a guess about its cause. A shared everyday word does not settle shared machinery. |
| **counter-jinx** | The classroom or practical sense of an answer to a jinx, such as the one Hermione looks up at B4 p1715. Also record Slinkhard's claim that the name is a way to make jinxes sound acceptable, and Hermione's disagreement (B5 p2198). Preserve who is making which claim. |
| **nvbl**, **for enemies**, **wandwork** | A private instruction about casting mode (B6 p3131), a marginal note about intended use that does not identify the effect (B6 pp3401 and 3489), and a broad term for practical skill used in the Kwikspell advert and by Bill (B2 p391, B7 p3767). All three are useful search terms with different authority and purpose. |
| **open up**, **Mischief managed**, **ehwaz**, **Mermish** | The first is a translated intent for a Parseltongue exchange with a receiver (B2 p580). The second is an artefact command used on the map (B6 p3330). The runes exercise reports a confusion between two readings (B5 p2655). Dumbledore uses Mermish to communicate with the merpeople (B4 p1610). A language entry can support communication, reading or a keyed response where the scene supplies one. |
| **blew up**, **hocus-pocus**, **the purple streak** | A colloquial description of inflation (B3 p672), mock magic used to frighten Dudley (B2 p264), and a witness's description of an unnamed attack (B5 p2742). All can be searched or asked about. Their entries describe what was said or seen and how far that gets the character toward a known method. |

Build the first glossary as a searchable view of authored terms and existing character knowledge. `inquiry.js` can let a character investigate what they saw, existing notes can carry a method between characters, and the result writes to `simulation.knowledge[actor]`. The dictionary can display the observations a character has, the terms they recognize and any known relationship. Keep author-facing source locators and unresolved merges available for research without exposing facts the character has not learned. The cross-life discovery codex tracks seen IDs and serves a different purpose. [Knowledge rules](../KNOWLEDGE_RULES.md) · [Study and inquiry owners](../AREA_GUIDE.md#lessons-study-and-research) · [Discovery codex](../../src/discovery_codex.js)

### LATER / DELEGATE

| Trial | Effort and observable result |
| --- | --- |
| **T8. Silence, timing and effect.** | Runtime designer, medium. Reuse T4's protected training fixture. Add a target that can block a successfully delivered spell, an opposing action during a wordless cast and an audible version with the same operation. Verify differences in warning, time, delivery and effect. A world form with reduced output under silence should be able to show it as a distinct result. |
| **T9. A working cast that fails its purpose.** | Runtime designer, medium. Send one water jet toward ordinary heat and one toward a fixture where the heat evaporates it before contact. Check water production, observed interaction and any continuing fire independently. Use the same settlement vocabulary to distinguish failed targeting and a successful effect on a wrong target. |
| **T10. Dictionary to trial to shared lore.** | World and runtime designer, medium. Hear a classmate describe the jar hold, look it up by the description, identify the uncertain link to a named charm, practise a revised stroke and lend notes to a second learner. Check that the learner can repeat the demonstrated effect, while a character who only watched still lacks the missing words or motion. Verify notes, knowledge and revised forms survive reload. |
| **T11. Continue the scene ledger.** | Source designer, medium to large. Scan from outcome, observer and aftermath cues in addition to incantations. Give unnamed and failed acts provisional identities, keep separate accounts of the same event linked, and add verified terms by register. Keep wider coverage counts tied to a declared source set. |

**Checks run.** Read-only FTS5 cue searches and bounded passage reads, including follow-up scenes, against the same held omnibus. The table tests the rules on selected scenes across families and preserves unreported fields. This round adds no runtime behavior and establishes no exhaustive coverage of unnamed or failed magic.

## V8. Spellbook and language layers

The [first Hogwarts spellbook catalogue](HOGWARTS_SPELLBOOK_2026-11-11.md) now owns family rows, official cross-references, the pinned wiki candidate queue, and the next morphology and pronunciation trials. It extends the scene evidence above and uses the existing spell dictionary and working compiler as its runtime reference.

## V9. FG5 recombination checks

**2026-11-11 · Docs-only foundation phase · Source-spot-checked and paper-tested.** [Round 6, FG5](../CROSS_WORLD_SYSTEMS_TRANSFER.md#round-6-foundations-goals-by-existing-chat) asks which parts can travel between witnessed casts. Use the movement cases to propose the rules, then challenge them with voice and hearing. The sound cases were known as catalogue leads and reserved from fitting these rules. This is a separate-family check, with no blind accuracy claim. The shared balance was 64,960.62 credits at preflight against a 64,500 reserve. The pass used bounded queries in the held seven-novel index and a handful of exact scene windows.

### Case, rule, counterexample and paper check

| Case | Proposed rule and what it changes | Counterexample or uncertainty | Paper check and disposition |
| --- | --- | --- | --- |
| **FG5a · Fit from movement.** Tonks uses Locomotor on one trunk and guides it with her wand. Flitwick calls for the trunks and they follow up the staircase (B5 pp1903 and 2519). Locomotor Mortis binds legs (B1 pp175 and 178). | **I** The cargo construction has a replaceable target reference. Bind the thing or group and its route. The gesture evidence is a held or directing wand during the movement. The exact shared initiation motion is open. | Reusing the string *Locomotor* does not justify a cargo slot in Locomotor Mortis. That phrase belongs to a separate attested method. The sidecar rises without becoming steerable (B7 p3716), which rules out deriving route control from lift alone. | Hold the caster, learned form and route fixed, and change the cargo reference. **G prediction:** the referenced cargo moves, other luggage stays put, and an obstructed route can halt the moved cargo. Extending the named slot to a new target class still needs its own binding evidence. |
| **FG5b · Reproduced cast on paper.** Bagman points his wand at his own throat and says Sonorus before announcing the match (B4 p1209). He repeats the method at B4 pp1598 and 1726. | **B/I** Bind speaker, wand, throat and a subsequent voiced utterance. The first act enables amplification, and the later voice supplies the content heard by the audience. Ordinary speech can continue afterward. | At B5 pp2265–2266 Hermione uses a sharp jab for Silencio and the raven moves its beak without sounding. Aim at a throat and a sharp jab are different technique observations. Similar subject matter and an intention to change audibility do not establish interchangeable motions. | Start with Bagman's natural voice. Bind Sonorus to him, apply amplification and then make the same announcement. **Paper result:** the voice carries into the stands, matching B4 p1209. **G control:** keep the effect active and omit the announcement. No announcement is supplied by the amplifier. The book does not give an exact reach, timing or gain. |
| **FG5c · Variation.** Bagman uses the familiar throat aim with a muttered Sonorus at B4 p1726. Compare a proposed mental delivery with the same caster, wand, aim and later announcement. | **B** Ordinary speech and a mutter both have successful instances. **G** A mental form can be researched independently. Separate the sound of the activation, the time it takes and the amplified speech that follows. | At B7 p3904 Harry worries even murmuring Muffliato would alert Hermione and chooses a different action. At B6 p3573 Dumbledore's wordless immobilization still takes a consequential moment. Neither case establishes mental Sonorus or makes a quiet activation instantaneous. | **Supported variation:** muttered Sonorus still enables the later announcement in the source. **Unresolved variation:** mental Sonorus. If a trained mental form engages, predict that nearby witnesses hear no incantation, the later announcement can still carry, and any ward or interruption can still prevent the actual effect. If it fails to engage, the same later speech retains its ordinary volume. |
| **FG5d · Failed recombination on paper.** Quietus follows Bagman's amplification (B4 p1223). Muffliato masks what nearby listeners can hear with buzzing (B6 p3131). Silencio removes sound from the raven and later from Dolohov's speech (B5 pp2265–2266 and 2742). | **G** Give Quietus a binding to the active Sonorus amplification on the selected speaker. A speaker's sound production, their amplification and a listener's masking can coexist as distinct conditions. Quietus in the witnessed context is consistent with ending amplification. The source leaves its wider coverage open. | Reject the proposed rule that substitutes Quietus for Silencio or for a Muffliato counter on the strength of a “quiet” intention and a familiar wand aim. That would conflate removing a source's amplification, suppressing its voice and removing the listener's buzzing. There is no such failed Quietus attempt in these scenes. | **Paper result under the proposed rule:** a correctly delivered Quietus on an ordinary talking person finds no matching amplification, leaving their voice ordinary. With both Sonorus on the speaker and Muffliato on the listener, the same cast removes the extra reach and leaves the listener's buzzing. **Falsifier:** a controlled source scene or play experiment in which the same technique removes the buzzing without a matching amplification would require broadening the rule. |

### What recombines

Reuse a target slot when the construction demonstrates one. Rebind the same operation to new instances that satisfy its actual conditions. Vary the delivery of a learned technique where a different mode or motion can do the same work. Combine operations only where each one has its required input, including any support, active effect or listener it reads. Timing matters at the handoff. Sonorus sets up a later voice, and Quietus can end the modeled support without doing anything to a speech that already happened. Intent can propose what the caster is trying to do and guide the search for a technique. A compatible operation and a means of delivery still explain the result.

Record exact incantation, taught label, target words, candidate root and operation independently. *Silencing Charm* and *Silencio* name the same method in the lesson. *Quietus*, *Silencio* and *Muffliato* are sound-family neighbors with different witnessed uses. No shared substring is needed for Sonorus and Quietus to be modeled as a pair. Repeated word material earns only the role that survives comparisons. Repeated physical motion can be evidence for a way to aim, with further work needed to show whether the motion itself sets a shared operation.

**Round 6 integration check.** Let the proposed spell operation remove the active amplification on the selected speaker, then let the existing observation and knowledge owner record what each listener could hear. Change the selected speaker between forecast and attempt. If the replacement speaker has no amplification, recheck the binding and leave the first speaker's effect in place. A listener with independent Muffliato remains masked in either branch. This uses the cast's world state and an observer's resulting knowledge as two separate owners. The proposed trial needs no duplicated spell state in the witness record. [Cast and research owners](../AREA_GUIDE.md#powers-and-abilities) · [Knowledge rules](../KNOWLEDGE_RULES.md)

**Open gaps.** The books leave the exact activation motion and duration for several sound spells, the geometry of Muffliato, the usable delivery modes for Sonorus and Quietus, and the generality of Quietus unresolved. The proposed target and counter relations can be revised on stronger evidence. Source replay, supported spoken variation and failed substitution were checked on paper. Playable slices follow the foundation phase.
