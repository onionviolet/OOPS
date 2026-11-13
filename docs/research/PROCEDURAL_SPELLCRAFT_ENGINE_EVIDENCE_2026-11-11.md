# Procedural spellcraft engine evidence

Candidate in the isolated spellcraft worktree. AD38 and AD51 govern mechanisms and sharing. AR3, AR7 and AR11 govern ownership, commit checks and reuse. The school and Phandalin inputs are authored proposals where their sources leave room.

## Compare the implementations

| Operation | Hogwarts | D&D fifth edition, 2024 | Mother of Learning |
|---|---|---|---|
| Learn and ready | The first Charms lesson supplies the power. The bench binds a held wand. Draft choices and learned power remain separate. | The fixture supplies a spellbook entry and components. Preparation selects the entry before the encounter. | Study the Torch invocation or transfer control from Xvim's shaping drill. Knowledge unlocks methods. |
| Attempt and payment | A native command commits stamina on the attempt. Practice changes the fizzle chance. Delivery, stroke and intent bind the chosen draft. | A Magic action opens the reaction window. The mage must see the caster. The screen can interrupt that sightline while preserving the caster’s line to the crate. An interrupted cast retains its slot. A continued cast pays the slot and binds concentration. | The native energy owner pays the actual draws. Structured formulas check their own boundary, and direct shaping has its own timing. |
| Result and interruption | The board's world facts gate access underneath and to its angled edge. Release clears both. | Target-bound timed support gates access underneath. A Magic action can adjust altitude. Lowering to ground blocks retrieval while concentration continues. Ending concentration or expiration yields gentle descent. | Timed light conditions expose either the broad heading or shallow cuts. An overloaded trial produces no new light. |
| Records | The same knowledge owner keeps a worked and failed observation per draft combination. The original technique stays callable. | The check receipt replays the Constitution save. Readiness, action use, slot, and recovery are separate fields in the Phandalin save. | The knowledge owner keeps tested methods, the formula revision and the observed markings. The existing restart scope distinguishes memory from physical state. |

Hogwarts anchors pronunciation and motion to the first Charms lesson and mental delivery to later nonverbal instruction. A guiding turn and a tilted board are original implementations. D&D anchors the component, slot, reaction and concentration rules to the revised spell texts. Cyoria anchors Torch, shaping, and boundaries to the author's chapters, with local draw sizes and the experimental light angle authored for play. [First-year Charms](https://www.harrypotter.com/features/spells-and-potions-a-first-year-learns-at-hogwarts) · [D&D Levitate](https://www.dndbeyond.com/spells/2618994-levitate) · [D&D Counterspell](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Counterspell) · [Torch and shaping](https://www.fictionpress.com/s/2961893/2/Mother-of-Learning) · [Boundaries](https://www.fictionpress.com/s/2961893/11/Mother-of-Learning) · [Overload](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/313133/46-the-other-side)

## Architecture decision

- **O1 Universal resolver.** A one-stage resolver cannot faithfully settle the Hogwarts fizzle and D&D's interrupted cast with the same payment point. A mandatory invocation has no role in direct shaping. A universal resolver with arbitrary local callbacks would duplicate the typed command boundary and still delegate the decisions that matter.
- **O2 Shared commands and records with local rules.** Use this. Hogwarts and Cyoria actually use the same command/effect and knowledge owners. D&D reuses the existing check resolver and domain save lifecycle. Two worlds exercise opening a space beneath an object, but their support lifecycles differ. The useful candidate for later sharing is a target effect with a reader and an end consequence. An object position fact and a concentration record are two proofs of the requirement, with no new generalized effect type promoted in this slice.
- **O3 Independent engines.** Useful for world-specific sequencing. The Phandalin encounter can own reaction and slot settlement without a world branch in the common simulator. Separate inventory, learned knowledge or clocks for every ruleset would make persistence and consequences harder to verify and would give up reuse already exercised in Cyoria and Hogwarts.

The comparison is grounded in [native effects](../../src/simulation_effects.js), [Hogwarts spell commands](../../src/hp_lead_spells.js), [Phandalin trial](../../src/dnd_levitate.js), and [Cyoria formula rows](../../src/mol_light_research.js).

## Neighboring systems

- [Gu activation](../../src/book_world_gu_keeper_domain.js) has actual held creatures, feed, and upkeep. Reuse actor and target bindings and staged payment where the selected move calls for them. Refining Gu consumes instances and yields an owned creature. The effect of a move leaves the participants and upkeep to their existing owners.
- [Crafting](../../src/craft_resolver.js) and [craft trials](../../src/craft_experiment_log.js) already own batch state and material/process evidence. A spell observation can identify a material fact that a batch uses. A spell formula revision can share a comparison pattern while the craft ledger retains its batch provenance.
- [Creature layers](../../src/creature_layers.js) and [habitat care](../../src/habitat_care.js) own target anatomy, layering and husbandry. A power that changes one of those should apply its concrete consequence there. Eligibility to handle a creature and the creature's ongoing needs remain separate checks.
- [Ritual conditions](../../src/ritual_conditions.js) grade alternative ways to meet workspace requirements. A spell can provide a compatible barrier without taking over the addressee, offerings or petition.

## Delivery boundaries

Hogwarts currently edits three bounded technique axes. Cyoria compares two methods, drafts a source-inspired revision, then lets the player edit the direction, boundary and draw of a new formula. A timed transcription consumes sustained light. D&D currently exercises one prepared spell and one reaction on an authored encounter target with two caster positions and adjustable altitude. General method authoring and provenance, broader target laws, and ordinary D&D life beyond the existing named start still need evidence. A persistent result must survive import and have a concrete reader. Additional source anchors are required before treating local tuning values as canonical.

| Gate | Current evidence |
|---|---|
| Known spells, variants, new results | Levitation and Levitate have playable target consequences. Hogwarts draft choices and the Cyoria oblique formula have tested success and failure. Cyoria also compiles bounded player-authored drafts. Open-ended formula authoring remains unverified. |
| Preparation, progression and payment | D&D separates knowledge, preparation, action and slots. Hogwarts practice changes delivery reliability. Cyoria spends attuned mana through the energy owner. Advancement beyond these local routes is open. |
| Counterplay and persistent effects | Phandalin has a replayable Counterspell save and persisted concentration. Hogwarts has release and Cyoria has timed light expiry. Wider countermeasures and arbitrary target interaction are open. |
| Research and records | Separate records survive for tested Hogwarts combinations and the original/revised Cyoria methods. Provenance through teaching or transfer and comparative support for player-authored methods are open. |
| Browser and save | Fresh Phandalin named test start and earned Cyoria route passed the desktop and save/import checks. Hogwarts has the same checks from a school fixture. The fresh Hogwarts route is being exercised separately. |

## Shared trial evidence

[Spell trial evidence](../../src/spell_trial_evidence.js) supplies a small contract over the existing knowledge owner. A method and an observed result identify the record. A failed and a successful test of the same method can coexist, with the native action and clock recorded by the store. The evidence is about a particular attempt at a particular method. It does not award knowledge of a different method or prove the theory behind the result.

Hogwarts uses a successful trial to permit writing up a draft. The written method can be recalled after changing the current draft or reloading. Cyoria uses two successful trials from different techniques to authorize a new formula. A failed overload remains visible evidence and cannot satisfy either successful comparison requirement. These two consumers justify reusing the observation key, predicate and reader. The rules for writing a recipe and deriving a formula stay with their worlds.

The same contract now admits a written revision after a successful trial in both research routes. Hogwarts records delivery, stroke and aim. Cyoria records direction, boundary and draw. The shared helper supplies the observed-success requirement and the written record. Each world determines which fields the revision restores. A scoped Zorian restart test confirms the distinction between remembered formula and transient world state: the recipe and prior failure persist, the active light and current draft are cleared, mana resets, and recalling the formula makes it available to cast again.

The Hogwarts bench also tests spell interaction. Levitation changes physical access for a separately learned Summoning Charm. An obstructed attempt records the collision and spends stamina. A successful attempt after the lift takes the same single inventory object that hand retrieval could take at the desk. The shared consumer is target access and custody; each cast retains its own mechanism. The study timing and bench obstacle are original. [Official Summoning Charm](https://www.harrypotter.com/fact-file/spells/the-summoning-charm)

## Combined checkout verification

An isolated snapshot of current shared changes plus the candidate built successfully and passed architecture and rules checks. Desktop checks on the combined bundle passed in all three worlds with the known route labels: Phandalin from a fresh named start, Cyoria from an earned Zorian start, and Hogwarts from the rebound school fixture. Focused combined tests passed 69 of 70. The single failing frozen Hogwarts pack fingerprint reproduced with the identical actual value on the shared checkout before adding the candidate.

The independent fresh Hogwarts run earned its first Charms lesson after 79 ordinary UI actions and entered the bench. Its first reload stopped at startup. The exact earned draft was saved separately on the second walk, which reproduced the failure and identified the compressed-backup reader. The fixed continuation proof is recorded below.

Starting Mending also ends an existing Levitate effect in Phandalin. The long cast takes concentration as soon as it begins, and breaking off Mending leaves the crate on the ground. A spent Magic action blocks that switch until the next turn. This connects the existing repair and lifting actions using the edition's rule for overlapping concentration. [2024 Concentration](https://www.dndbeyond.com/sources/dnd/br-2024/rules-glossary#Concentration) · [Longer casting times](https://www.dndbeyond.com/sources/dnd/br-2024/spells#LongerCastingTimes)

Phandalin also lets a wizard hold the bench focus in place of Levitate's metal spring, or set both aside. A cast binds the actual chosen aid across its reaction window and reload. Both routes retain the verbal and somatic requirements. This is a local application of the 2024 material-component rule for this nonconsumed, unpriced component. [2024 components](https://www.dndbeyond.com/sources/dnd/br-2024/spells#Components)

## Shared working tree integration

Applied the verified candidate as a scoped patch to the shared working tree. The existing Gu registration hunks and staged diff were preserved. The rebuild used external output, with bundle SHA-256 74aa3735ab8fa78925487236fa49599d12e741c786c3316bb12819c39217452e. The current focused suite passed 70 of 71, with the same independently reproduced baseline fingerprint mismatch. Architecture and rules checks passed with incumbent warnings. The patch remains uncommitted.

The primary bundle passed fresh Phandalin, earned Cyoria, and rebound-fixture Hogwarts browser walks at 1920×1080. The subsequent full-suite and earned Hogwarts results are recorded below.

## Delivery audit

| Requirement | Owning evidence and remaining verification |
|---|---|
| Words, gestures, intent and formula | Hogwarts draft commands bind spoken or mental delivery, standard or guiding stroke, and raise or tilt intent. Cyoria derives output from direction, boundary and draw and keeps direct shaping a separate route. D&D checks verbal and somatic means independently of the held material or focus. |
| Learning, practice, preparation and progression | Earned first Charms supplies the power and casting practice changes the fizzle dial. Cyoria requires the shaping drill and witnessed results. The D&D trial begins with a known spell and requires explicit preparation. General class advancement and a full spell catalogue are outside the present proof. |
| Fuel, components and targets | Hogwarts charges stamina against an actual held wand and one real weight. Cyoria spends native energy against a timed practice-slate effect. D&D checks the loose crate and held aid, and pays the slot only if the cast continues. These are concrete world targets with tested consumers. |
| Sustained use and counterplay | Hogwarts support affects access and Summoning. Cyoria's short and sustained light have distinct observation and copying outcomes. D&D preserves the reaction after screened casting, lowers the crate on concentration loss, and ends Levitate when Mending starts. |
| Invention and records | Hogwarts and Cyoria let players derive and test variants by editing bounded parts. Both use the same success requirement to write and recall revisions, and retain failed evidence separately. The Cyoria restart retains the recipe while resetting mana, draft and active light. |
| Ordinary play and persistent consequences | Fresh Phandalin and earned Cyoria passed desktop Save/reload/Export/Import on the primary bundle. Hogwarts earned its lesson and draft through 79 ordinary actions, then verified persistence on the rebuilt code from that exact earned checkpoint. The compressed backup crash discovered between those steps is fixed. Existing saves exported from a pre-spellcraft build passed import into the earlier combined bundle in all three worlds. |
| Architecture and integration | The three alternatives and neighboring owners are compared above. Hogwarts and Cyoria independently consume shared trial evidence. The scoped changes are in the shared working tree. Build, architecture and rules passed. The full shared suite finished with two independently reproduced baseline failures. Later targeted slices have their own tests and browser proof. |

A second Phandalin entry starts before Levitate is learned. The Wizard copies it from a borrowed spellbook, spending four hours and 100 GP in local copying supplies, then takes a long rest before adding it to the prepared list. The existing entry retains its known spell. Fresh browser evidence includes reload after transcription, preparation, focus casting, import while concentrating, and tool recovery. [2024 Wizard transcription and preparation](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes#Wizard)

The integrated suite finished before the borrowed-book addition with 6,013 passed, two skipped, and two failed. Both failures independently reproduced on a snapshot without spellcraft: the frozen book.hp fingerprint and the stale D2_LOAD_INTEGRATION.patch in the LOTM topic test. The follow-up D&D slice passed 13 focused tests and its rebuilt desktop journey.

## Earned Hogwarts persistence and compressed backup

The current browser route reached the school hall, earned the lesson, bound the bench, tried a failed tilt and changed the wand stroke. It used 79 ordinary UI actions and saved the exact draft. Reload threw when startup parsed the prefixed backup string directly. The source map resolves the error to the backup-menu timestamp read. Startup now reads the same slots through the installed codec and tolerates a damaged metadata value. The build retains the existing save representation.

The rebuilt desktop browser resumed from that exact earned draft, with the real compressed backup explicitly restored. Save and reload restored the draft. Casting the revision and performing Export and Import while the board was tilted preserved the angle. The player read the mark and released the board, with the taught cast available. This joins the fresh earned route to the verified persistence path without seeding any lesson or spell outcome.

Current rebuilt bundle SHA-256 990d78aaec5fe69e4117fc53297b58222eb3d99733fe9f5efd47fdb54858cddd. The source map matches the current seven runtime owners checked, including the startup fix. Save codec, Hogwarts and Phandalin focused tests passed 22. Build, architecture, rules and scoped diff checks passed. The prior full suite and its two baseline failures are documented above.

The same rebuilt bundle also passed fresh Phandalin's borrowed-book path and earned Cyoria at 1920×1080, including persistent target effects. Review state: agent browser-verified. The changes are uncommitted in the shared working tree. The goal's spellcraft coverage is demonstrated by the three world routes and source-grounded mechanics described here. Recipe invention uses editable world-specific parts with physical tests and written records. Content breadth is limited to these spell families and the existing connected spells.

| Delivery check | Evidence |
|---|---|
| Build and route | Hash above. Earned Hogwarts route joined to its exact earned checkpoint. Fresh Phandalin named start and earned Cyoria route on the same rebuilt bundle. |
| Shown and used | Controls quote costs and eligibility. Board angle exposes a mark and lift opens a Summoning path. Levitate opens access to a tool. Sustained angled light enables a completed copy. |
| Kept | Native Save, reload, Export and Import verified in all three routes. The restart test verifies memory and transient effect ownership separately. |
| Review and reserve | Agent browser-verified. Last checked 66,090.24 credits, above the 64,500 reserve. |

## Foundational engine proposal

The delivered routes prove that local casting and shared research records work. The wider engine still needs an extensible representation for what a working does. The Hogwarts and Cyoria editors generate combinations from their own fixed lists. A spellsmith cannot yet connect a newly introduced operation to a different target or use the resulting effect in a new working without a new authored route.

### Proposed vocabulary

| Concept | What it needs to express |
|---|---|
| Method and access | A learned technique, inherited faculty, borrowed power, item, ritual, agreement, or discovered rule. Record how the character knows it, whether it is ready, and what can be taught or recovered. |
| Expression and means | Bind purpose, words, gesture, formula, focus, participants, materials, places, and actual available resources. A world can treat the same word as a mnemonic, a necessary key, or an invocation of an agent. |
| Operations and targets | Read, reveal, move, sustain, transform, transfer, bind, suppress, or grant. Operations read and change actual targets such as an object, creature, region, relation, active effect, or process. Each operation declares what it needs and what it produces. |
| Execution and consequences | Bind, attempt, resolve, maintain, interrupt, and end where those stages apply. Preserve payment timing, partial effects, resistance, ongoing obligations, and what survives release, travel, or restart. |
| Research and invention | Edit or compose known operations and techniques, predict what can follow from the character's evidence, run a trial, record the result, and save a reproducible revision. Keep the parent, rules used, known limits of the observation, and any unresolved assumptions. |

Use typed operations with world-owned rules and native consequences. A world supplies how its magic works and can introduce a new operation, target, resource, or execution rule. An operation that already has an owner calls that owner: item transfer uses custody, material changes use crafting, creature changes use their body or layer owners, and Gu activations use the existing instance bindings and upkeep. This follows AD38 and AD51. No common mana pool, universal words, or shared list of allowed spells is implied.

- O1. Expand each existing editor. Fast for the next authored spell, but every new family needs a new combination list.
- O2. Extend the existing power authoring vocabulary with typed inputs, outputs, and ordered local operations. Keep the native transaction and knowledge owners. Preferred because it lets the next compatible working be expressed with existing parts and gives unfamiliar laws an extension point.
- O3. Let each world run a fully programmable magic language. Expressive, including for unfamiliar mechanics, but previews, save validation, and explanations would depend on a separate interpreter. Use an isolated local evaluator where a source genuinely needs one.

### First test of the broader foundation

Express Hogwarts Lift and Accio as separate reusable operations. Let the player build a sequence that lifts an obstruction, summons the exposed object, and lowers the obstruction. Compare it against the existing authored route and a failed binding where the target remains obstructed. Then use the same input/output representation in Cyoria to shape light, maintain its angle, and let an existing timed task consume the live light. Cyoria still pays through its mana and formula rules. The test succeeds when a new valid arrangement needs data and existing operations, when an incompatible arrangement yields a useful explanation before or during the appropriate stage, and when both observations and working revisions survive Save, reload, Export, and Import. If Cyoria needs Hogwarts-specific fields or the compiler needs a special case for each arrangement, revise the representation before extending it.

### First dictionary and compiler slice

The broader engine goal starts with four versioned entries in [spell_dictionary.js](../../src/spell_dictionary.js). Existing Hogwarts vocabulary source windows and Mother of Learning chapters 2 and 11 anchor the entries. Attested usage, linguistic inference and original playable rules have distinct evidence kinds. Wingardium has no established standalone effect. Accio Firebolt suggests an optional target-reference form without proving a general grammar. Structured and direct light share an effect verb and keep their separate means.

[spell_working.js](../../src/spell_working.js) resolves a player-orderable list of versioned methods to bound operations. The compiler checks world membership, typed targets and supported operation names. The focused test proves composition and rejection in two world rule fixtures. This is compiler evidence. The next slice must bind the planned operations to native transactions and actual world rules, then expose draft editing and persistence through ordinary play. No spellbook UI or native cast uses this compiler yet.

### Expression binding and native command selection

The compiler now binds fixed expression parts and optional target references. An Accio entry keeps Firebolt as a source example, while a working aimed at the practice weight binds that weight to the target slot. [World rules](../../src/spell_world_rules.js) map each operation to its existing local command. Hogwarts lift and support share one transaction. Cyoria's structured, direct and low-angle light choose their respective native casts, and repeating a method in separate steps preserves both casts. No registered combination row is needed.

`node --test tests/spell_working.test.js` passed three tests covering expression slots, ordered bindings, registered command definitions, a same-type unreachable target and repeated casts. The tests check command selection. The player editor, persisted workings and rebuilt native runs are pending.

### Spellbook play surface and persistence

The Spellbook appears at the adopted Hogwarts bench and for Zorian at the practice court. It presents learned methods and their expression evidence. The player binds a target, adds or moves steps, tests the first step, and chooses when to cast the next. A successful trial can be written and recalled after further edits. Each record keeps its tested date and exact method revisions. [Draft and trial owner](../../src/spellbook_workings.js) stores the working as a string in the existing actor facts envelope. [Host](../../src/spellbook_host.js) uses the admitted Hogwarts extension or the Cyoria command host for each cast. The normal save transaction persists the draft and the matching native cast together. A timed step keeps its own job cause and waits for settlement.

- Focused compiler and lifecycle checks passed (4 tests). They cover ordered binding, actual registered command IDs, typed target rejection, repeat casts, timed trial state, failure blocking a record and recall after a JSON round trip.
- The isolated build and architecture check passed. The build reported the existing duplicate `dial` key in `travel_legs.js`. Player-text lint passed. The full rules command stopped on a missing receipt in the separate open-craft invention checkpoint, with an earlier warning from the Hogwarts exams day counter.
- Headless Hogwarts at 1920×1080 passed on an earned practice-bench save. The player tried Accio against the lowered board, revised the draft to lift, summon and release, reloaded mid-working, wrote it, exported and imported, then recovered all three steps after editing. The native Accio observation recorded success and the board was lowered.
- Headless Cyoria at 1920×1080 started an earned Zorian life. The player assembled direct shaping followed by low-angle light, advanced after the timed cast, illuminated the slate and read its cuts with the local action. The recorded working survived Save, reload, Export and Import and was recalled after a step was removed.
- Both complete walks passed on bundle `fa9c14b3abd4360ff7d7020aa6ad50d0695fa5ef97d357ffe2b1e495e4a0bd5b` (SHA-256), before the latest quote and linguistic presentation changes. Both walks subsequently passed on bundle `b4455a7d8d3635edcaf82d91520109956b5fa24ee7117d51bd9e8601e579189c` with the quote and linguistic presentation. The focused runtime slice passed 39 tests.

### Subword and pronunciation analysis

Hogwarts is the first detailed expression model. A single spell word can have a versioned linguistic analysis beside the exact attested form. Wingardium has a possible written split Wing · ard · ium. Leviosa has a possible written split Levi · osa. The English association with flight, Latin comparisons and ending boundaries are hypotheses. The independent casting behavior of these fragments is unknown. The official Charms entry supports the pronunciation observations and full-spell behavior, while the dictionary and grammar sources support the Latin comparisons. They do not attest a canonical derivation.

The dictionary keeps pronunciation cues independent of written segments, since a spoken beat can cross a proposed morpheme boundary. A later expression model can add phonemes, timing, or contrast pairs as the evidence supports them. A local rule can give a speech cue a mechanical role. A provenance annotation alone does not introduce a new casting operation. Cyoria uses the same expression container for learned formula structure and direct shaping.

References: [Official Levitation Charm entry](https://www.harrypotter.com/fact-file/spells/the-levitation-charm), [Logeion levis](https://logeion.uchicago.edu/levis), [Logeion levō](https://logeion.uchicago.edu/morpho/levabas), [Logeion arduus](https://logeion.uchicago.edu/morpho/arduo), [Allen and Greenough on adjective derivation](https://dcc.dickinson.edu/grammar/latin/derivation-adjectives).

### Saved spellbook format

Schema 1 retains exact method revisions, bindings, tested records and any pending native receipt. Existing saves without the actor fact start with an empty book. An unreadable spellbook value leaves its raw data intact and shows a local error. Native save transactions can continue. The focused lifecycle test verifies this case alongside a pending cast, rejected record and recall.

Bundle `7195e4e5602a4458306697a5bf5d2b79f84443c3c6fb2b308331cac8e9b398a5` includes the schema change. The rebuilt Hogwarts walk verified the visible stamina quote, the native failure before editing, exactly one weight in carried inventory, release, and the persistence round trip. Earned Hogwarts fixture SHA-256 `f33f0e7eccb6c95d374f7a098c292b74ca9d8d8093c7bcf8db37b07dc842c34a`. The rebuilt Cyoria walk passed on the same bundle, including the one-minute direct-shaping quote, actual timed settlement, the local cut-reading action, Save, reload, Export, Import and recall. Both runs used the ordinary controls in a headless 1920×1080 viewport. Browser-verified, with focused tests (39 passed), architecture and player-text checks passed. The repository-wide rules command still exits at the separate open-craft invention checkpoint’s missing receipt. No commit, installation or director review was part of this verification.

## FG6 · Learning, preparation and interrupted repetition

This paper pass applies LT29–LT30 from [Cross-world systems transfer, Round 6](../CROSS_WORLD_SYSTEMS_TRANSFER.md#round-6-foundations-goals-by-existing-chat). Hogwarts draws on V1 and the held-out families in the [vocabulary proposal](HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md). D&D uses the 2024 Wizard and spell rules. Cyoria uses the author's early shaping lesson and later boundary experiment. The paper checks below describe proposed behavior, with earlier native evidence recorded above.

| Case | Proposed rule and owner | Counterexample | Paper check and expected state |
|---|---|---|---|
| **FG6.1 · Copy a witnessed cast.** Flitwick's class supplies pronunciation and wand motion. Hermione's feather rises and other pupils get different results. Cyoria's chapter 2 compares Torch and direct shaping. | Observation records what the observer could perceive. A lesson or readable source can supply missing technique. Hogwarts' power and practice owners retain learned execution. Cyoria's knowledge owner keeps the formula and shaping instruction as distinct discoveries, while actor control governs execution. | Someone sees a feather rise and hears the words but misses the wrist motion. A Cyoria pupil can write the Torch invocation and still lack the control to produce light directly. | Give the observer a witnessed result and partial expression. Quote the missing technique from the local law. Complete the lesson or control drill and retry. The witness remains historical and the learned method changes through the teaching route. |
| **FG6.2 · Copy, prepare, then repeat.** A 2024 Wizard finds a written level-2 Levitate spell. | The Wizard's spellbook owns eligible transcription and the actor owns preparation. Copying this newly found eligible entry takes four hours and 100 GP. The actor's class and rest rules govern preparation and slot recovery. The encounter owns available actions. | Watching a creature rise provides an observation rather than a written source. A Ritual Adept may use a qualifying spell from the book without preparation. Levitate has no Ritual tag. | Start with an eligible written source, the fee and an unprepared Wizard. Copy, check the book entry and the original unprepared state, then prepare through the local rest rule. Cast twice with two available slots and check that both casts debit their own slots while the preparation entry persists. |
| **FG6.3 · Rebind the operator or target.** Hogwarts uses the same charm on the lesson feather and the sidecar. The sidecar rises with limited control. | Save method revision and typed roles. Each repeat binds actual participants and targets and reads current means. Hogwarts checks caster skill, wand and reachable path. D&D checks the spell's own target text, sight, range and components. Cyoria checks operator control, reserve and the local fixture or area. | A working that lifted one object may still fail to steer another. A D&D object above the spell's 500-pound object limit fails a target condition. A Cyoria visitor with a written formula may lack a compatible personal reserve. | Keep the recipe fixed. Change one binding at a time, first target and then caster. Quote again from native owners. Check that the saved record keeps the old trial's evidence and that its new binding gets no inherited success, payment or authority. |
| **FG6.4 · Invent through a controlled variation.** In chapter 46 Zorian reduces Magic Missile output, observes flaws in the boundary and improves his normal cast's efficiency. | Draft a versioned change and log what it actually did. Cyoria's formula owner supplies boundary and energy settlement. Hogwarts can isolate a word, delivery cue, gesture or aim where the local teaching evidence supports the trial. D&D Wizard level progression represents research within the class rules. A novel spell would need an explicit local adjudication. | A plausible root does not demonstrate a new casting operation. A larger mana draw can destabilize a boundary. A successful weaker variant proves its observed effect within the tested conditions. | Hold operator, target and other settings fixed. Compare baseline, reduced draw and overload. Record paid amounts, effect and stability separately. Repeat the baseline after boundary correction and check that any efficiency gain appears on a fresh receipt. Keep the original draft available. |
| **FG6.5 · Interrupt at two settlement points.** D&D 2024 Counterspell can stop an in-flight cast. Damage can break concentration after Levitate resolves. Cyoria's overload destabilizes the cast structure. | The local action owner records its committed action. The slot or energy owner decides when a debit becomes final. The active effect owner handles ending and physical aftermath. A counter reads the current stage, actor and support. Hogwarts' current bench assigns a stamina cost to its Accio attempt, an original local rule. | Failed save against 2024 Counterspell wastes the original casting action and retains its slot. Failed concentration after a resolved Levitate leaves the slot spent and the still-aloft target descends gently. Cyoria's practice overload spends mana and provides no new light. A failed Accio at the board is obstruction, with no defender reaction implied. | Trace the D&D reaction window and an independent post-payment concentration loss. Record action, slot, effect, and target position before and after. Run Cyoria's overload with an existing light to check that the failed attempt spends its own draw and leaves the existing condition intact. Compare Hogwarts obstruction and keep only the witnessed cause in the observation. |

**Cross-owner integration check.** Carry the same recorded Hogwarts lift–summon working into two repeat attempts from equivalent bench snapshots, each with the weight still under the board. In the first, the lift settles and support is still active when the summon starts. In the second, the local effect ends after the lift settles and before the summon commits. The spellbook owns the method order and attempt receipts. The Hogwarts command reads the live board support fact, the caster's position and stamina, then the custody owner publishes any actual weight transfer. The second attempt still uses the same recorded method. Its summon spends the native attempt cost, hits the obstruction, and publishes no item. Neither spellbook nor custody needs a second board flag. If recall keeps the old support alive or repeats the prior acquisition, the proposed boundary fails.

**Open gaps.** Hogwarts still needs a second-operator teaching test and evidence that any subword or pronunciation variation affects execution independently. D&D's prior bounded proof exercises the cast and concentration lifecycle. Transcription and repeat preparation still need native proof, and bespoke invention needs an edition-pinned adjudication policy. Cyoria needs a recorded structure rebound to a different qualified operator and a measured efficiency revision. The mana amount retained or lost in an arbitrary interruption needs its own evidence. FG6 adds paper checks only.

Sources spot-checked for this pass: [2024 Wizard](https://www.dndbeyond.com/sources/dnd/br-2024/character-classes), [2024 spellcasting](https://www.dndbeyond.com/sources/dnd/br-2024/spells), [2024 Levitate](https://www.dndbeyond.com/spells/2618994-levitate), [2024 Counterspell](https://www.dndbeyond.com/sources/dnd/br-2024/spell-descriptions#Counterspell), [Cyoria chapter 2](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/301781/2-lifes-little-problems) and [chapter 46](https://www.royalroad.com/fiction/21220/mother-of-learning/chapter/313133/46-the-other-side). The chapter 2 public excerpt was available and the full page returned 403. The existing source pass and native evidence above supply the direct-shaping detail.

## Spell contact and combat, 2026-11-12

**F1 · Canon and vocabulary.** The [first spellbook edition](HOGWARTS_SPELLBOOK_2026-11-11.md)
accounts for 124 earlier concordance labels in 117 research records, cross-references
41 captured official spell entries, and carries 777 pinned wiki titles as discovery
metadata. These counts include aliases, attempts, phenomena and other leads.
The [grammar](../../src/spell_grammar.js) rebuilds 80 typed Hogwarts rows from parts
such as intent, roots, gesture, delivery, target, carrier and cost. The
[coverage ledger](../coverage/hp_spells.jsonl) computes 75 with a world effect
case. Five have a typed working and still need a world consequence case:
Oppugno, Patronus, revival, weather unjinxing and historical release.
The other 37 research records contain missing mechanisms or evidence, or are
classified as something other than a spell. The engine vocabulary exists.
Scene-level source review and combat coverage remain partial. Roots and
gestures have different evidence, and intent supplied by an authored row is
distinct from intent inferred from a form.

**F2 · Combat today.** The [Duelling Club pack](../../src/contest_packs/hogwarts.js)
is an engine fixture with its own small move list. [Contest](../../src/contest.js)
selects a move and opponent, stages it on a tick clock, rereads the entrants at
release, rolls its local resolver against guard and resistance, then applies
body-quantity changes. Its generic cost hook charges at start when a move has
a price. These Hogwarts rows carry the stamina word with zero configured
debit. The rows require focus to choose a wand cast. Expelliarmus drains focus
and can reduce footing. Rictusempra and Tarantallegra reduce composure and footing
respectively. The fixture has no actual wand object, cast path or projectile.
The ch11 pack and [spell effect law](../../src/spell_law.js) are unreachable
from the game entry point. The existing playable
[Spellbook host](../../src/spellbook_host.js) drives admitted local practice
commands. Harry's [midnight appointment](../../src/book_world_hp_lead_duel.js)
is a sequence of story actions in the first-year route, separate from ch11.

**F3 · ACT NOW.** The [headless contact fixture](../../tests/spell_contact.test.js)
uses the typed Expelliarmus and Wingardium Leviosa rows. The kernel checks a
bound implement's current grip and co-location before release. The cost owner
debits effort when a release proceeds. The effect host resolves the named
duellist's current place over the existing graph and selects the thing that
actually carries their grip. The substrate checks a position ward and settles
grip removal and movement atomically. The next scheduled Levitation Charm reads
the same implement through the spell law. It interrupts with zero debit when
the wand has left the caster's hand. With a closed path or an intercepting ward,
the released Disarm costs three, the wand stays held, and the reply pays two
and lifts the feather. When the duellist moves and changes wands after the
forecast, the new wand is displaced and the bystander's wand is untouched.
JSON restoration before release, before the follow-up, and after interruption
agrees with uninterrupted settlement and does not replay effects or costs.

The canon anchor is the [Hogwarts spellbook's Disarm entry](HOGWARTS_SPELLBOOK_2026-11-11.md#defend-interrupt-and-end)
(B2 p459, B7 p3987) and the [official Disarming Charm entry](https://www.harrypotter.com/fact-file/spells/the-disarming-charm).
Wingardium Leviosa uses the B1 pp137–138 and B7 p3716 row, with the held wand
selected for this casting form. Timing, reach, effort, ward placement,
drop position and the reply itself are authored fixture choices. Grip is
an opt-in requirement on a particular cast. Other forms can use other means.

| Reference at pinned revision | Disposition |
| --- | --- |
| Pokémon Showdown, `965a535ef892d13cd68cf75c076db26f9f32842a`. MIT, copyright 2011–2026 Guangcong Luo and other contributors. [Target resolution](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/sim/battle.ts#L2316-L2362) · [Contact predicate](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/sim/battle.ts#L1240-L1248) · [After-hit phases](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/sim/battle-actions.ts#L1088-L1137) · [License](https://github.com/smogon/pokemon-showdown/blob/965a535ef892d13cd68cf75c076db26f9f32842a/LICENSE) | Adapt the phase distinction. A move can retain the chosen individual or use a slot, and a damaging hit and contact have separate checks. This cast binds the person and resolves their actual held object at release. A lost target has no random replacement in this trial. |
| Ars Nouveau, `fa9fd3ea2bd30572294a6fe9c8fa2dd051865dbf`. GNU Lesser General Public License version 3 for code. The README reserves models and textures unless permission is given. [Resolver](https://github.com/baileyholl/Ars-Nouveau/blob/fa9fd3ea2bd30572294a6fe9c8fa2dd051865dbf/src/main/java/com/hollingsworth/arsnouveau/api/spell/SpellResolver.java#L164-L243) · [License declaration](https://github.com/baileyholl/Ars-Nouveau/blob/fa9fd3ea2bd30572294a6fe9c8fa2dd051865dbf/README.md#L9-L12) | Adapt the impact-first sequence. Ars passes a block or entity hit to ordered effects, with a chance for the hit object to stop resolution. OOPS keeps the ward and custody owners for the same check. |

Both are behavior references. The implementation uses original code and OOPS's
existing owners, with no third-party excerpts, assets or dependencies.

**F4 · ACCOUNT FOR NOW.** The proposed duel sequence is choose a learned form
and aim, wind up, check available means at release, pay at the phase the world
specifies, meet cover or a defense, settle into the actual holder or working,
then let the consequence affect both sides' next choices. A targeted charm can
track an individual. A ward or an area effect can bind a place and read who is
there at contact. Keep spoken, nonverbal and other means tied to what the chosen
form actually needs. Disarm changes custody, a stun changes the ability to act,
and a counter addresses a pending or active working. HP matters when the effect
causes bodily harm. Keep contest initiative and decisions while sourcing the
effect from the spell law. Near and far settlement should agree on whether the
wand moved, what each actor paid and which pending cast survived. Receipts
should distinguish an interrupted wind-up, a released miss and a landed effect.

**F5 · LATER / DELEGATE.** Small, Sol. Join the existing contest meeting to the
engine spell release and verify the Chapter 11 duel through the canon rows.
The concrete dependency is a contest adapter that forwards the aimed holder,
live path, relevant impact and working identity to the engine host. The present
bridge runs an isolated working and converts its outputs to quantity deltas.
The join also needs a shared ordering for same-time release and reactions
(contest ticks versus engine minutes), a single debit owner, and a way to
preserve landed custody or an active working in far detail. Done check: in
one duel compare an open cast, a timely shield and a cast whose wand is lost
before release, and retain the same receipts after restore. Keep these three
cases explicit in the adapter trial before adding trajectory and other spatial
details. Game tie-in follows PC95.

**Receipt.** PC95, AD36, AD38, AD51, AR3/AR6/AR11, KW3/KW11/KW15 and
WPR30–WPR32. Primary base `4d4505223bae7c097a3a1c833f195ea53f8d0e26`,
with unrelated dirty work in the checkout. Changed the spell effect law and
effect host. One import to an existing world effects module, zero new cycles,
registrations or save keys. Grip variants add operations to the existing law.
Previously saved operations keep their bindings and effects. The engine
configuration supplies the same law on restore. This is a headless engine
fixture and is agent-verified, below the gameplay floor.

- Focused Node run: 70/70 across spell contact, contest consumers, spell grammar,
  spellbook workings, engine host, effect host, world effects, place graph and
  Hogwarts effect cases.
- `npm run check:arch`, `npm run check:rules` and `npm run check:coverage`
  exited 0. Rules reported existing warnings. `npm run check:docs` stopped
  on the unrelated shared [W18 note](../gm/dispatch/foundation-run-2026-11-12/W18_GAME_SEAM.md#L29).
  Scoped diff check passed.
- Isolated build passed with the existing duplicate-key warning in
  `src/travel_legs.js`. Bundle SHA-256
  `e4745d4757d4bb1a4ad0e9f5993cbea35b1263e7ed395d2aebff1190c081bef3`.
  The build includes the live checkout's unrelated edits. The contact fixture
  exercises engine JSON saves. Full suite and live game tie-in remain open.

## Chapter 11 demonstration duel and spell choices, 2026-11-12

**ACT NOW.** The [Chapter 11 demonstration](../../src/world_packs/hp_duelling_club.js)
runs Snape and Lockhart on one engine clock. Expelliarmus takes Lockhart's wand
through the existing reach, grip, effect and cost owners. The scene borrows the
book's observed disarm. Protego, Rictusempra, cover and their relative timings
are authored alternative exchanges. Rictusempra is also sourced separately
from Harry and Draco's bout later in the chapter. The official references
describe [the demonstration](https://www.harrypotter.com/features/ranked-most-significant-wizarding-world-duels)
and [Protego's varying results](https://www.harrypotter.com/fact-file/spells/the-shield-charm).
The fixture uses an authored protection window for aimed contact, with expiry
before impacts on its ending minute. It demonstrates interception. Reflection
and strength-dependent leakage need their own tests.

[Six duel checks](../../tests/hp_duelling_club.test.js) compare an unopposed
Disarm, a timely Shield Charm followed by a reply, a late shield and later
reply that both fail, an expired shield, a fast reply that interrupts the
other duellist, and an obstructed release. The scene allows one unfinished
wand movement per actor. Costs debit once on release, including an intercepted
or obstructed release. A lost wand or disrupted speech interrupts before
payment. A successful Tickling Charm temporarily changes a property the next
spoken cast reads. JSON restoration before and between releases, including
with a shield already active, matches uninterrupted settlement. The Chapter
11 fixture covers Snape and Lockhart. Harry and Draco's exchange still has
its earlier contest proof, with Tarantallegra awaiting compelled-leg motion.

**Vocabulary.** 117 research records, 81 typed, 77 with computed world cases.
Rictusempra adds a typed effect and executable case. Rennervate now ends the
named stun lease while preserving a second independently applied stun, including
after restore. The B6 potion-exposure case still needs its own impairment
source and partial recovery. Four typed rows need a world case. Oppugno needs
a directed creature attack on a separate victim. Patronus needs a guardian
that affects an attack. Meteolojinx Recanto needs a magical weather driver.
Deletrius needs a visible replay whose end preserves wand history. A further
31 records are blocked and five are classified as other than spells. Close
the vocabulary against the declared books and captured sources by giving each
record an attested effect, an explicitly uncertain mechanic, or a supported
classification. A named effect with sufficient evidence can still need a
runtime owner. Grouped wards and unsuccessful attempts may keep unknown effects
until a usable source resolves them.

**ACCOUNT FOR NOW.** Proposed gameplay choices for active and idle duels.

| Choice | Proposed default and reason |
| --- | --- |
| Pick a spell | Start from your intent and current opening. The shortlist shows familiar forms that can do it, the actual target, time to release, effort and useful prerequisites. A larger spellbook stays available for creative options. Holding ground, moving, guarding, withdrawing and recovering a wand all compete for time. |
| Resolve a hit | Read the actual path and defense at release, then land the physical or magical consequence on the right holder. Familiarity can affect release speed or execution when the technique is difficult. Use a seeded check for real uncertainty such as aiming under pressure. Show interrupted, obstructed, intercepted and landed as separate results, with the cost paid. Keep reflections and travel time available when they change a meaningful choice. |
| Idle or offline | Give a stance a short conditional policy using the same actions and clock. For example, raise a shield if it can finish before the threat, otherwise move to cover, then disarm on an opening. Allow fallback spells, effort reserves and stop conditions such as a lost wand, injury or opportunity to yield. A summary should preserve who paid, what hit, which equipment moved and why the tactic stopped. Compare a clock jump with minute-by-minute execution. |
| Use a school charm in a fight | Accio can bring a loose wand within reach. Colloportus can delay pursuit through a door and a compatible Alohomora can reopen it. A levitated object can provide cover if its actual size and position intercept the line. These use the same object, custody and movement effects as ordinary casting. The setting supplies collateral risk, visibility and the rules of a formal duel. |

**LATER / DELEGATE.** Medium, Sol. Give Tarantallegra a body-motion effect
that another action reads, then run Harry and Draco's exchange with Finite
ending the two eligible effects. Show that the movement changes a step or
stance and that countering it restores the option. For the first idle
consumer, run the same opponent, field and learned forms from a manual and
conditional policy and compare world and receipt invariants. The current
demonstration is a named scene using engine actions. The generic contest
chooser and live game routes still need their PC95 integration.

**Receipt.** PC95, AD36/38/51, AR3/6/11, KW3/11/15, WPR30–32. Base
`4d4505223`, with parallel changes present in the shared checkout.
97 focused tests passed. Architecture, coverage and rules passed with
existing warnings. The isolated build passed with the existing duplicate
`dial` warning and bundle SHA-256
`781135c8170415f0e86d995eb47d1d0a502f92803bfd594b95545cadd8f04995`.
The docs scan reports the existing W18 seam note. No new cycle, root registration
or save schema version. Older awareness leases without a working reference
retain their original timed expiration. Agent-verified headless fixture.

## Harry and Draco's exchange and nonlethal endings, 2026-11-12

**ACT NOW.** The [student exchange](../../src/world_packs/hp_duelling_club.js)
starts at Rictusempra, continues with Draco's Tarantallegra and ends with Snape's
Finite. In B2 pp460–461, Draco gets his spell out while laughing, so the scene
uses the laughter effect without the modeled speech disruption of the earlier
Lockhart counterfactual. The [official Tarantallegra excerpt](https://www.harrypotter.com/features/strange-spells-you-may-have-forgotten)
identifies Harry as the target. The [General Counter-Spell entry](https://www.harrypotter.com/fact-file/spells/the-general-counter-spell)
supports a counter with a bounded set of eligible effects. This proof begins
after Draco's unnamed opening spell and ends before the snake exchange.

Tarantallegra has a typed compelled-steps effect. The mind owner leases
control of the target's legs. The directed-motion reader and casts requiring
planted footing read that state. In the reversed-target test, a dancing Draco
cannot finish the planted Shield Charm and pays nothing for it. He can still
aim and release Rictusempra. When the effect lapses, he can plant his feet and
shield again. The footing requirement is a choice for this local Shield
Charm form. Durations and effort are authored.

One Finite releases two applications at the same engine minute and charges
once. The scene gives the counter both subject and working IDs. The mind
owner removes those exact leases, and a third unrelated lease remains in
force. The proctor's completed intervention closes the exchange to new
duelling actions. The bounded idle policy chooses the same reply and
intervention from the previous landed receipts. It uses ordinary casts and
the engine clock. An idle jump, manual choices and an idle run restored at
each decision boundary end with the same world, costs and receipts.
This proof covers the named exchange. The general contest chooser and live
game integration remain open.

**Vocabulary.** The ledger now holds 82 typed rows with 78 world cases across
117 records. The four remaining typed world cases are Oppugno, Patronus,
Meteolojinx Recanto and Deletrius. Thirty further records have evidence or
mechanism gaps, and five are classified outside spell execution.

**ACCOUNT FOR NOW.** Treat disarm as a real change of custody. Who chooses
to stop is a separate consequence of the encounter and what the participants
want. [Official duelling reference](https://www.harrypotter.com/fact-file/magical-miscellany/duelling).

| Situation | Proposed response |
| --- | --- |
| Supervised practice | A proctor can call the bout when a qualifying disarm or surrender settles. Record the win, draw or stoppage and secure the wand. The proctor can counter active jinxes separately. |
| Agreed duel without a proctor | A dropped wand can satisfy the agreed win condition. A participant can accept the result or break the agreement, with consequences from the other participant and any witnesses. |
| Escape, rescue or hostile encounter | Continue while the objective or threat persists. A disarmed actor can flee, surrender, reach for the wand, seek help, grapple or use a form they actually know that needs no wand. A fallen wand's location decides what recovery costs. |
| Idle conduct | Let the player set an objective and limits. A sparring policy can lower the wand after a decisive disarm. An escape policy can run once the path opens. A protection policy can keep cover until the protected person is safe. |
| Aftermath | Distinguish an offer to surrender, the opponent taking the surrender, retreat, capture, incapacitation, and harm. Custody, injury and witness reactions persist into play. An ended bout can leave active effects that need treatment or a counter. |

The [disarm drill comparison](#one-disarm-two-encounter-outcomes) now
checks the supervised stop and the escape attempt headlessly.

**Receipt.** PC95, AD36/38/51, AR3/6/11 and KW3/11/15. Primary base
`4d4505223` with shared edits present. 100 focused tests passed.
Architecture, coverage and rules passed with existing warnings. Isolated
build passed with the existing duplicate-key warning and bundle SHA-256
`f9e1851ffe17f749c5963edaf27faef640da7d1a55e9fc798547064e7041654f`.
No save schema or root registration change. The headless run verified the
named exchange and its own idle policy.

## Spellcraft capability checklist, 2026-11-12

This run uses [FG6](#fg6--learning-preparation-and-interrupted-repetition),
[SG1–SG9 and SB1–SB9](../gm/dispatch/foundation-s-2026-11-12/CHECKPOINT.md#5-what-the-rules-could-not-express-backlog),
and the [computed Hogwarts ledger](../coverage/hp_spells.jsonl). PC95,
AD36/38/51, AR3/6/11 and KW3/11/15 apply. Primary base `4d4505223`
with parallel edits. The lane can write spell rows, spell fixtures and
this owner. Shared engine records, effect settlement and contest changes
need the relevant owner's coordination. The work below uses their current
interfaces.

| Capability | Current evidence and remaining case |
| --- | --- |
| Aim, reach and actual contact | [Contact](../../tests/spell_contact.test.js) covers a named actor moving, a replacement held implement, blocked reach, wards and the next cast reading custody. An aimed release that can travel after launch or reflect needs a shared impact record and an owner for its clock. Reopen with an intercepted or redirected hit where the next target differs. |
| Cast conditions, price and timing | [Duel](../../tests/hp_duelling_club.test.js) covers grip, awareness, speech, footing, shield timing and debit on release. [Depth](../../tests/spell_depth.test.js) covers skill and fizzle, partial, misfire and backfire outputs. A generic paid attempt with live failure consequences still needs a case, along with a comparison of local payment phases from FG6.5. |
| Interruption, counter and cancellation | The duel distinguishes lost means from an intercepted release, and Finite ends named leases. [Kernel meeting](../../tests/kernel_meet.test.js) proves an opposing working can interrupt before release. The player cancellation case still needs an engine entry point that owns the running record. Reopen on agreement with the engine-records owner and test a canceled second step with the first effect and debit retained. |
| Held and stored spell | [Stored-world proof](../../tests/stored_working_engine.test.js) covers once, repeating and held patterns, charge, pulse, reactions, dormancy and restore. The Caterwauling Charm now adds a Hogwarts arrival reader through the generic runner. Carrying, charges and enchantment maintenance also have separate fabrication evidence. |
| Ordinary effect families | [Hogwarts effect cases](../../tests/hp_effect_pack.test.js) cover body, world, object, sense, wards and working changes. Relashio now uses the existing release primitive to remove a named fastening while preserving unrelated marks. The separate authored [grip case](../../tests/spell_contact.test.js) proves a pending cast reads that loss after restore, without moving the object or charging the interrupted caster. |
| Combat and idle | The named duel and its idle choices agree after JSON restore. Shared contest integration still needs the owner to choose how its tick readiness, the minute clock, and debit ownership meet. The next independent comparison is a proctor ending supervised sparring versus a disarmed actor still acting in an escape. |
| Knowledge, preparation and invention | The existing practice receipt and [grammar tests](../../tests/spell_grammar.test.js) cover learned methods, novel variants, local cost sources and rebinding. FG6 still calls for a second operator using a recorded form, a changed live condition on repetition, and publication of paid failure evidence. |
| Remaining vocabulary | 117 records, 85 typed and 81 world cases. The four already-typed case gaps remain Oppugno, Patronus, Meteolojinx Recanto and Deletrius. Twenty-seven more records have a source or mechanism gap and five are classifications outside spell execution. Continue with source-checked cases where an existing reader suffices. Preserve uncertain grouped effects and failed attempts with a source condition for reopening. |

This table preserves the initial checklist. The [current coverage
comparison](#headless-capability-checkpoint) supersedes its status column.

Relashio is anchored in B7 p4165. Caterwauling Charm is anchored in B7
pp4180–4182. Both locators are in the
[checked omnibus record](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl)
with SHA-256 prefix `9db33901964c`. The alarm uses a saved arrival event
qualified by place. The generic runner verifies an outside event stays quiet,
restores the pending inside event, observes noise rise once, and sees no
repeat increase. The pulse, charge, intensity and one-shot mode are authored.
A real holder move supplies the arrival event. A player travel route and an
observer responding to the noise remain open. The pinned
Showdown and Ars Nouveau entries in [the contact round](#spell-contact-and-combat-2026-11-12)
remain the behavior references for contact. This pass reused local owners and
introduced no external code. Point Me uses the checked B4 pp1715 and 1736
reading. The wand's bearing changes through a physical property effect. An
authored maze reader chooses the north route from that saved bearing after
a paid cast. The comparison without casting takes the west loop.

**Receipt.** 105 focused tests passed across spell and effect cases, kernel
working and meeting, stored workings and the duel. Coverage and architecture
passed. The isolated shared-checkout build passed with the existing
duplicate-key warning in `travel_legs.js` and SHA-256
`13da908ccc5f580ee2daa80d8f2f94fde6c5ed44d27ec7e1d2c1927b7ba56e42`.
No new root registration, import edge or save schema version. PC95 headless
fixtures with restored state. The native goal remains active.

### Paid failure, stopping mid-working, and ending a light

- **Paid fizzle.** The spell law can opt into the kernel's saved permille draw.
  If the caster can release, the kernel receives the attempt cost once on
  either branch and only the success branch publishes the effect. The same
  address and saved root give the same draw after restoring in flight.
  The authored comparison spends two effort on both attempts. A success
  lifts the feather and a fizzle leaves it where it was. Quote reports the
  odds without drawing. This uses E11's saved draw and the E9 cost owner.
  The earlier pinned [contact references](#spell-contact-and-combat-2026-11-12)
  separate attempt and impact. No external code was copied.
- **Cancellation.** A disposable caller uses the existing KW8 interruption
  on a saved, two-step Levitation working. It cancels the second lift while
  retaining the first lift and its debit. Restoring the terminal record and
  advancing produces no later effect or charge. The comparison without
  cancellation moves both objects. A public engine action still needs the
  records owner to expose actor-authorized cancellation on that same record.
- **Nox.** The ordinary-use case pays for Lumos, reads the resulting wandlight
  at a reading threshold, then pays for Nox after a restore. The second spell
  extinguishes the selected wand and closes the reading opportunity. Another
  wand retains its own light. The source basis is B5 p1862 and B3 p995 in the
  [spellbook](HOGWARTS_SPELLBOOK_2026-11-11.md#make-change-and-repair).
  The local threshold and efforts are authored. The case uses the existing
  keyed light account and a bounded amount. It does not model a general
  counter for multiple sustained contributions on one carrier.

The [contact tests](../../tests/spell_contact.test.js) hold all three receipts.
The spell-law change adds one dependency on the existing sentence-cost helper,
with zero root registrations and no save schema change. Existing spell rows
without odds use their previous payment path. The backfire case below now exercises a redirected impact. Partial effects
and misfires toward another holder still need an execution case that selects
what survives a failed cast.

**Receipt.** 97 focused tests passed, including spell contact, both duel
exchanges, engine costs, kernel working and meeting, and the stored-world
fixtures. Architecture, coverage and rules passed with existing warnings.
The docs check still flags the unrelated W18 seam note. The live ledger
remains at 85 typed and 81 executable cases. Primary base `4d4505223` with
parallel edits present. No commit or push.

### Backfire and the next memory read

A direct body or creature cast can opt into a backfire on its failed kernel
draw. The caster becomes the impact target. The existing host still checks
contact and interception, and the cost owner debits the released attempt once.
With otherwise identical Obliviate inputs, the success removes the intended
subject's selected memory and the backfire removes the caster's. Legilimens
then reads that same memory owner and can retrieve the intended subject's
memory after the backfire. A ward at the actual recipient stops the
backfire after the attempt is paid. The deterministic outcomes in this
test use 0 and 1000 permille on the same draw address. Save and restore in
flight keep the resolved target, cost and receipt.

Source basis: the [Hogwarts vocabulary comparison](HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md)
uses the held omnibus (SHA-256 prefix `9db33901964c`), B2 pp584 and 607 and
B4 p1184. The broken-wand scene supports the direction of the rebound.
The memory selected, price, forced odds and recipient ward are authored.
This is an opt-in cast rule. Reading wand damage to choose the odds or
backfire mode, settling the wand explosion, and redirecting to another
eligible recipient remain open. Reopen those with a qualified equipment
condition, its authored failure policy, and a second recipient who can
be reached or intercepted at impact. The [pinned contact references](#spell-contact-and-combat-2026-11-12)
remain applicable to separate aim and impact. No external code was copied.

**Receipt.** 98 focused tests passed. Architecture, coverage and rules
passed on `4d4505223` with parallel edits present. One spell-law option
and its focused case, zero new import edges, registrations or save keys.
PC95 headless fixture. The native goal remains active.

### Partial duration and live implement condition

The saved spell method can supply a shorter positive duration for the failed
draw of a timed or sustained spell. It uses the same effect and target. The
ordinary impact host checks the cast, and the attempt price is independent of
the duration. In the authored Duelling Club comparison, Lockhart pays two
effort either way. Both protections appear at minute one. The brief version
expires before Expelliarmus at minute two. Lockhart loses the wand, then his
reply fails without spending effort. The full version protects him and his
reply lands. Minute-by-minute advancement with restore matches the jump.
The spellbook's B6 pp3058–3059 and B7 p4018 ground the shield itself.
The partial duration and its interaction with the demonstration duel are
authored. [Duel tests](../../tests/hp_duelling_club.test.js).

The backfire case now uses the same Obliviate working on an intact and
a damaged implement. A split-core mark applied during wind-up lowers the
odds when the cast rereads the held wand. The intact wand reaches the
intended subject. The damaged wand produces the rebound, and Legilimens
reads the resulting difference after restore. A ward still intercepts at
the caster. The tested damage mark and forced odds are authored. The wand
explosion remains open. Reopen it with a material consequence and a
qualified secondary effect on the scene. The actual stray-recipient
case still needs a policy for choosing an eligible alternative and a
failure receipt when there is none. No shared settlement owner changed.

### Wand evidence and its dismissal

Prior Incantato now has a typed replay intent that creates a temporary
visible field for a selected prior spell. Deletrius ends the named held
replay through the existing working-end owner. The generic coverage runner
executes both rows. The [focused case](../../tests/hp_working_info_case_scenes.test.js)
observes the replay after restore, verifies that the wrong working ID leaves
it in view, then pays to dismiss the correct one while preserving its source.
It also settles a Dark Mark cast on the same wand, restores the engine,
reads the named landed effect from its receipt and feeds it to Prior
Incantato. The replay reader sees that actual spell after another restore.

Both effects are shown in B4 p1243 of the checked omnibus, SHA-256 prefix
`9db33901964c`. The [source review](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl)
distinguishes the visible echo from sensing a mark. The chosen field,
duration and effort are authored. The Deletrius case starts with an
authored held projection. The separate replay case creates its projection
from a selected receipt. A general reader that finds the relevant release
for a wand and carries the same projection identity into dismissal remains
open. Reopen it with the records owner once chronological wand attribution,
retention and wand-tip contact have a shared consumer. This pass reuses the
field and end owners without editing either one, adding a dependency or
changing a save schema.

The ledger now has 86 typed rows, 83 executable world cases and 117 research
records. Oppugno, Patronus and Meteolojinx Recanto are the three remaining
typed rows without a world case. The goal remains active.

### Local rain and Meteolojinx Recanto

The weather counter now has a generic runner case. The existing
working-end owner removes the exact saved rain field. A local rain reader
combines an active rain field with the ordinary rain account. In the
[focused test](../../tests/hp_working_info_case_scenes.test.js), the clerk
cannot copy dry papers under the office jinx. A paid counter with the wrong
working ID leaves the room wet. The correct cast survives restore during
its wind-up, reopens the work, and spends the same two effort. The courtyard
still changes from dry to wet at the sky calendar boundary. A separate
courtyard jinx also survives the office counter.

B7 pp3889 and 3899 of the held omnibus (SHA-256 prefix `9db33901964c`)
support the reported prior success and Ron's uncast repetition. The
[source review](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl)
distinguishes that report from a witnessed cast. The indoor field is
authored and starts already active. The cast and paperwork costs and
choices are fixture settings. The reader currently serves this Hogwarts
case. Reopen shared weather integration when a world needs a spell to
create a jinx in play and additional work or travel readers need to
observe the same local weather. No shared sky, records or working-end
file was edited. No external code was copied.

**Receipt.** Base `4d4505223` with parallel edits present. 62 focused tests
passed across the effect runner, working-end and weather cases, engine
world and spell tests. Ledger coverage is 84 executable cases among
86 typed rows and 117 research records. Oppugno and Patronus still lack
world cases. The goal remains active.

### Oppugno, travel and evasion

Oppugno now runs through the generic coverage runner. A paid cast gives
an existing bird a directed-motion order. The cast is instant at release
and the order lasts for its own specified term. The mind owner applies
that term to its existing will lease. The bird follows the open path,
publishes its own arrival, and its stored attack checks the separately
selected victim's actual reach. The normal case restores after the paid
release and before contact. The bird then strikes Ron once and leaves a
nearby bystander alone. If Ron retreats after restore, the same order
still sends the bird to the doorway but its attack leaves both people
unhurt. The cast costs one effort in either case.

B6 p3213 in the held omnibus (SHA-256 prefix `9db33901964c`) shows
Hermione directing existing birds at Ron. See the
[source review](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl).
The path, term, effort and damage are authored. The fixture selects the
bird's destination and attack target as distinct bindings. Pursuit of a
moving victim beyond the first contact, coordinated flock behavior and
a general contest attack consumer remain open. Reopen with a movement
policy that rereads the victim's position, along with a creature or
contest owner that can accept the resulting attack. This case uses the
existing spell, mind, world and stored-working owners. The change to
`a.mind` extends its existing lease for instantaneous commands with an
explicit positive term. No shared clock or save schema changed.

### Patronus and protection at contact

The shared coverage runner now settles a paid Patronus cast, restores
the formed guardian before contact, and advances the existing mind
motion and stored-workings owners on the same clock. The guardian's
arrival drives the Dementor out of reach before its scheduled attack.
A wisp does not take that route in this comparison. Ending the formed
guardian through the existing holder lifecycle before it arrives also
leaves the attack open. The attack then lands in both comparison runs,
and the caster's effort stays spent.

B3 pp884–887 of the checked omnibus (SHA-256 prefix `9db33901964c`)
give the teaching example and partial result. The [official Patronus
entry](https://www.harrypotter.com/fact-file/spells/the-patronus-charm)
supplies the formed guardian's defensive role and distinguishes it from
weaker forms. The target, paths, deadlines, charge and modeled harm
are authored. The fixture supplies the manifestation form and makes
loss of concentration an explicit removal. Reopen a generic sustain
policy when a live focus change can end a created guardian automatically.
Reusable Dementor threat rules, movement beyond the first encounter
and messaging need their own consumers. Existing engine owners and
save schemas serve this case without a shared runtime edit.

**Receipt.** Base `4d4505223`, with parallel edits present. 118 focused
tests passed, as did architecture, coverage and rules. The live ledger
has 86 typed spells with 86 executable cases across 117 records. Twenty-six
records still have source or mechanism gaps, and five are classifications
outside spell execution. Typed coverage closes that portion of the goal.
The broader capability checklist and remaining source records stay open.

### Stray impact on a separate recipient

The saved spell method can name a separate recipient for a failed
direct contact draw. It publishes that aim through the existing effect
host, which checks the recipient's live position and ward. This uses the
distinction between selection and contact from the pinned Showdown and
Ars Nouveau sources in the [contact round](#spell-contact-and-combat-2026-11-12).
No source code was ported. The cutting spell comes from the Sectumsempra
row (B6 pp3494–3495). The stray cast, recipient, damage and forced odds
are authored, rather than a replay of that scene.

The [focused comparison](../../tests/spell_contact.test.js) restores
during wind-up and verifies a normal hit on the intended duellist,
a stray hit on the bystander, and a stray shot that meets a new ward
or loses reach when the bystander moves. A vanished recipient leaves
the same paid failure. The engine debits the attempt once in each case.
The unchanged intended aim receives no harm on any failed draw.
The selected alternate is caller-supplied. Reopen automatic selection
when a scene can provide an ordered set of eligible bodies along the
actual path. Travel time and reflection need a separate impact boundary.
No shared clock, effect host or save schema changed.

**Receipt.** Base `4d4505223`, parallel edits present. 80 focused tests
passed. The spell ledger remains at 86 executable typed rows of 117
research records. This adds an execution branch to the capability
checklist. The native goal remains active.

### Release and impact on separate minutes

A direct contact spell can now specify a positive flight duration. Its
release step checks the caster and wand, takes the attempt price and
saves the selected payload at the launch place. A second step publishes
the payload through the ordinary contact host at its deadline. The
impact reads current reach and defenses from that launch place. The
caster can move or lose the wand after release without taking the
released effect along. A failed draw with no payload leaves no impact.
The two steps use the kernel's existing facts and deadlines.

The [headless comparison](../../tests/spell_contact.test.js) charges
once at release, restores mid-flight and checks a normal impact, a
Protego raised while the spell travels, a link closed after release and
a fizzle. Advancing across the flight in one jump agrees with restoring
and advancing in parts. The route and flight duration are authored.
The [pinned references](#spell-contact-and-combat-2026-11-12) distinguish
aim and impact. No external code was ported.

This uses a saved launch place and one contact check at impact.
Reopen geometric interception and reflection when a world needs an
intermediate contact to choose a new path and impact time. The record
still belongs to the casting working until impact. A future public
cancel action needs to distinguish the paid flight from the wind-up.
The implementation adds one spell-law operation and no import edge,
registration or save schema change.

**Receipt.** Base `f0430dde2`, with parallel edits present. 81 focused
tests passed. Architecture, coverage, rules and docs checks passed.
All 86 typed Hogwarts rows still have executable cases. The spellcraft
goal remains active.

### Caster cancellation before release

The spell lane now exposes `cancelSpellCast` for a headless caller with
an authenticated caster ID. It reads the pending step's existing caster
binding and records the stop with the kernel's KW8 interrupt. A released
spell with a saved payload continues to impact. Previously settled
steps retain their effects and effort. A different actor and a repeat
request on a terminal working leave the record unchanged.

The [contact tests](../../tests/spell_contact.test.js) exercise a
restored wind-up that cancels before any payment, a restored paid
flight that refuses cancellation, and a two-step cast whose first
lift remains. The [duel test](../../tests/hp_duelling_club.test.js)
changes the next action: Lockhart abandons his reply and can raise
Protego while he still has his wand. The comparison that keeps the
reply loses the wand. The canceled reply spends nothing, and the
shield pays its usual effort after the restored stop.

This is an authored timing rule based on the kernel's settled-step
semantics. It uses the existing engine record shape without editing
the shared records or clock owners. Actor authentication remains
with the caller. Reopen general cancellation and live player
routing when a non-spell working needs the same command, or when
the game exposes its actor's active spell record. The
[pinned contact references](#spell-contact-and-combat-2026-11-12)
remain relevant to release and impact. No third-party code was copied.

**Receipt.** Base `f0430dde2` with parallel edits present. 97 focused
tests passed. No new import edge, root registration or save schema
version. The 86 typed rows retain their executable coverage. The
spellcraft goal remains active.

### One disarm, two encounter outcomes

The authored [Duelling Club drills](../../src/world_packs/hp_duelling_club.js)
use the same paid Expelliarmus working against Draco's held wand. In practice,
Snape can call the drill once the wand is loose and within reach. The stop and
his grip on Draco's wand survive restore, and the drill refuses new casts and
withdrawals. The escape variant leaves the same wand on the floor. The failed
wand cast spends no effort. A withdrawal queues a destination for the existing
mind pack, which moves Draco once the route is open and his legs are free.
Tarantallegra can hold him at an open exit until the lease expires. The
[comparison tests](../../tests/hp_duelling_club.test.js) save and restore the
drop, stoppage, pending withdrawal and arrival. The escape costs elapsed time,
and neither drill needs to deduct vitality.

This is scene-level proof under CBR12, CBR18, CBR25 and PC95. The earlier
[source evidence](#harry-and-dracos-exchange-and-nonlethal-endings-2026-11-12)
supports the spells. The practice and escape variants are authored. The
shared CBR2 outcome publisher, pursuit and surrender settlement remain open.
Reopen that boundary with the contest owner when the live contest can submit
and observe a PC95 spell without a second clock or duplicate debit. The
[referee comparison below](#referee-stop-at-the-release-boundary) exercises
wind-up and flight within the drill.

**Receipt.** Base `f0430dde2` with parallel edits present. `node --test`
passed 51 focused spell, ledger and mind tests. `npm run check:arch` and
`npm run check:rules` passed with preexisting shared-tree warnings. No engine
schema change. Agent-verified headlessly.

### Referee stop at the release boundary

In the supervised variant, Harry and Draco obey Snape's call. The drill uses
the caster's cancellation command for their pending spells. Harry's prepared
Rictusempra would have landed with his wand still in hand. The call stops it
before release and costs him no extra effort. Draco released Tarantallegra
before losing his wand. It still reaches Harry after the call. Its effort
stays paid once. Snape's separately queued Protego completes and pays its
ordinary cost. The idle policy stops queuing duelling actions while the
engine continues to settle work already underway. The
[test](../../tests/hp_duelling_club.test.js) restores immediately before the
call and compares idle and direct advance through impact after restore.

This is an authored compliance policy for the supervised drill, using the
[existing contact and release evidence](#spell-contact-and-combat-2026-11-12)
and CBR4/CBR18, PC95 and KW8. Reopen with the contest owner when a participant
can disregard the call, or when the proctor has a working that can intercept
the released spell. [Casting during flight](#casting-during-flight) now has
its own headless comparison.

**Receipt.** Base `f0430dde2` with parallel edits present. 52 focused spell,
ledger and mind tests and `npm run check:arch` passed. No save schema change.

### Casting during flight

A released single cast frees its caster's wand for another spell. A composed
form can reserve it through later steps that still bind the same caster.
The Duelling Club reads this from the saved working cursor and bindings.

In the [duel comparison](../../tests/hp_duelling_club.test.js), Draco cannot
begin Protego during Tarantallegra's wind-up. After release and restore, he
can raise it while his charm travels. Harry's Rictusempra hits if Draco does
nothing, and Protego intercepts it if he shields. Draco pays twice for two
casts, and his original charm still lands. The [contact comparison](../../tests/spell_contact.test.js)
checks that a restored composed cast reserves the wand through a pending
release while a single in-flight cast frees it.

PC95, AD38 and KW3 apply. This is an authored action policy using the same
[release evidence](#spell-contact-and-combat-2026-11-12). Reopen with the
contest owner when the combat readiness clock can read a casting slot from
the same working that owns costs and impact. That consumer must exercise
mid-flight defense and a still-committed composed cast.

**Receipt.** Base `f0430dde2` with parallel edits present. 77 focused tests,
architecture and rules passed with existing shared-tree warnings. No save
schema change.

### Anapneo and spoken casting after airway clearance

Anapneo now has a typed `release airway` intent. The spell lowers to the
existing release of a relation. It drops the physical obstruction mark
and leaves other marks and vitality alone. Spoken cast settlement reads
the same mark. In the [headless case](../../src/world_packs/hp_effect_pack.js),
the healer pays at release after restore. The patient then casts Lumos.
The [comparisons](../../tests/hp_effect_pack.test.js) show a restored spoken
cast failing while the obstruction remains and a paid Anapneo failing to
clear a patient who moves out of reach before release.

The [pinned source review](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl)
records the shown use at B6 p3018 of the English omnibus, SHA-256 prefix
`9db33901964c`. The exact mark, time, effort and Lumos follow-up are authored.
PC95, AD38 and KW3 apply. Reopen continuous choking, oxygen and Bubble-Head
with the body owner when breath has a shared duration, environment and harm
reader. This case uses the existing effect host and save shapes.

**Receipt.** Base `f0430dde2` with parallel edits. 60 focused tests and
architecture passed. Coverage computed 87 executable Hogwarts cases across
117 research records. Twenty-five gaps and five classifications outside spell
execution remain.

### Portus and travel on grasp

Portus now binds a destination to an inanimate carrier in a paid spell
working. The [Hogwarts touch action](../../src/world_packs/hp_effect_pack.js)
reads that binding, uses the existing touch-triggered stored working and
resolves its travel target from the triggering actor. The runner verifies
the cast and its payment after restore. The
[separate activation test](../../tests/hp_effect_pack.test.js) verifies that
an unenchanted kettle stays inert, a distant attempt cannot use the armed
kettle, and a person grasping it after it was moved travels while the
bystander stays behind. A spent carrier stays spent across restore. A cast
that misses a kettle moved during wind-up spends effort and leaves it inert.

The [pinned source review](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl)
locates the cast at B5 p2773 of the checked omnibus (SHA-256 prefix
`9db33901964c`). [Rowling's Portkeys entry](https://www.harrypotter.com/writing-by-jk-rowling/portkeys)
establishes travel on grasp and the timed variant. The destination, effort,
single traveler and single-use policy are authored for the immediate variant.
The touch command takes a scene-supplied grasp and materializes its stored
record on first attempt. The timed variant binds a departure minute in the
cast and uses the existing time trigger. The stored move reads the current
carrier place and the bodies still marked as grasping it. The tests restore
before release and again before departure. Two people leave together, a
bystander and a person who lets go stay behind, and a person elsewhere cannot
travel. With no graspers the stored working records `target-unavailable` and
the elapsed departure cannot be used. The cast pays once in either branch.

Reopen with the storage and travel owners when an empty departure needs a
terminal storage receipt, when travel needs to carry the object itself, or
when re-enchantment needs a new configuration for the same carrier. The
Hogwarts headless scene loads a grip pack that consumes substrate departure
and arrival events. Moving the carrier or walking away clears the corresponding grips,
even if the move and return happen in the same batch. After restore a person
who returned has to grasp again to travel. The departure itself clears the
travelers' grips. Reopen when an inventory host moves a carrier together with
people who keep hold of it, or when a live scene needs to supply these grasp
and release commands. PC95, AD38 and KW3 apply. No engine schema or shared
record changes.

**Receipt.** Base `f0430dde2` with parallel edits. 83 focused tests and
architecture passed. Coverage computed 88 executable Hogwarts cases across
117 research records. Twenty-four gaps and five classifications outside spell
execution remain.

### Impervius and water on lenses

The typed `block water` spell installs the existing substrate block on
moisture gain. The paid cast applies to the chosen lenses. After restoring
the active field, the same splash wets the spare lenses and leaves the
treated pair dry. After the field expires and the engine restores again,
the next splash wets both pairs. The existing effect host reads the field
when the splash lands. The [headless case and expiry comparison](../../tests/hp_effect_pack.test.js)
use authored timing and effort. PC95, AD38 and KW3 apply.

B3 p820 of the checked English omnibus (SHA-256 prefix `9db33901964c`) and
the [official Impervius description](https://www.harrypotter.com/features/useful-spells-for-winter)
support rain repulsion on glasses. Reopen with the environment or combat
owner when continuous weather deposits water on items through a shared
receiver, or when a sight-dependent action can consume the resulting lens
condition. The model here covers discrete moisture deposits. Other
materials and the B7 treasure use need separate source and contact cases.

**Receipt.** Base `f0430dde2` with parallel edits present. 84 focused tests,
architecture and coverage passed. The ledger now computes 89 executable
cases across 117 records, with 23 gaps and five records classified outside
spell execution. No shared host or save schema change.

### Obliteration and a tracker's next step

The Obliteration Charm now expresses release of a named snow trail on one
place. The shared host removes that mark. The headless tracker reads the
local marks and open path links, then asks the existing directed movement
owner to cross. After a paid cast and restore, the tracker cannot take the
erased lead and can still follow an unrelated trail. If the caster retreats
out of reach during wind-up, the cast spends effort and the tracker can
still follow the original lead. Reading the trail before release can get
the tracker moving in time. The [tests](../../tests/hp_effect_pack.test.js)
also compare a saved queued crossing with uninterrupted advance.

The [spellbook locator](HOGWARTS_SPELLBOOK_2026-11-11.md) is B5 p2341 of
the checked English omnibus, SHA-256 prefix `9db33901964c`. The named
trail marks, one-place targeting, effort and tracker behavior are authored.
The Hogwarts headless pack also generates the lead when a body departs from
trackable snow along an open path. A blocked crossing leaves no footprints.
The restored tracker loses the erased lead and can follow the same route
again after a later crossing leaves fresh footprints. The scene uses one
mark per route and reads ordinary substrate departure events. Reopen with the
pursuit owner when a live encounter needs to distinguish walking from other
ways of moving along the same path, tell whose tracks they are, age them, or
keep evidence from other channels. PC95, AD38, CBR12 and KW3 apply. No shared
pursuit, world or save change.

**Receipt.** Base `f0430dde2` with parallel edits. 67 focused tests,
architecture, coverage and documentation checks passed. Coverage computes
90 executable cases across 117 records, with 22 gaps and five records
classified outside spell execution.

### Erecto and a usable tent

Erecto expresses assembly as a lasting change to the canvas's form.
The paid working uses the same object transformation as other reshaping
spells and leaves the canvas at the campsite. The headless shelter action
reads the pitched form and the open entry link belonging to that canvas.
The [comparison](../../tests/hp_effect_pack.test.js) checks that a traveler
can enter after save and restore. Folded canvas and a closed entrance both
prevent entry. If the canvas leaves reach before release, the caster pays
the effort and the canvas stays folded.

The [pinned source review](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl)
locates the assembly at B7 p3917 of the English omnibus, SHA-256 prefix
`9db33901964c`. The site, entry link, timing and effort are authored.
This is a pre-authored tent interior whose entry reads the canvas state.
Reopen with the site and fabrication owners when assembly needs to build
a shelter from separately carried components, place an interior at a new
site, or expose a weather or rest benefit to its occupants. PC95, AD38
and KW3 apply. No shared runtime or save schema change.

**Receipt.** Base `f0430dde2` with parallel edits. 68 focused tests,
architecture and coverage passed. The ledger computes 91 executable cases
across 117 records, with 21 gaps and five records classified outside spell
execution.

### Specialis Revelio and private ingredient evidence

The typed composition inspection publishes a fact to the existing knowledge
owner. The mind owner holds its record for the caster. In the
[headless comparison](../../tests/hp_effect_pack.test.js), the caster uses
the restored ingredient observation to pick a matching candidate antidote.
A bystander lacks that evidence. Concealed composition returns an empty
reading and still costs effort. Moving the sample beyond the local inspection
site interrupts before payment. The cast leaves the sample's contents alone.

The [pinned review](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl)
and [potion evidence](HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md)
locate the ingredient assay at B6 pp3307–3309 of the checked English
omnibus, SHA-256 prefix `9db33901964c`. The authored sample declares a set
of ingredient identities. A second inspection form reads actual flask stock
through the brewing stock reader. Its knowledge records point at the sampled
quantities and retain the observation minute. The [flask comparison](../../tests/hp_effect_pack.test.js)
changes the contents during wind-up, restores, and checks that the cast reads
the new contents without drawing them down. A later successful reading changes
the candidate choice. The observer keeps the earlier observation until then.
Candidate selection checks one ingredient and does not establish that an
antidote cures the whole blend. A successful inspection of an empty flask
now saves an explicit observation. Both the headless chooser and the brewing
delivery selector reject older positive findings after restore. A concealed
sample leaves the earlier observation in use. At equal minutes an empty
observation takes precedence. The [potion runner comparison](../../tests/hp_potion_case_scenes.test.js)
drains the same flask, re-inspects and restores before attempting treatment.
An inspection explicitly bound to a flask now reads its existing storage
profile and uses the same aging calculation as brewing delivery. In the
restored comparison, active material spoils during wind-up and the reading
reports its spent constituent without changing bottled stock. The brewing
delivery selector also refuses to bind a remedy based on the spent material.
Previously saved object-bound forms retain their raw-stock reading.
The registered blended-antidote case now reads the caster's saved assay to
select a known recipe by its complete ingredient signature. The selected
working spends the physical remedy lots. Delivery clears the separate
burdens and reduces the combined burden when the binder formed the joint
remedy. Without the binder, the separate burdens clear and the combined
burden persists. A witness with no assay and a sample with an extra
ingredient both fail to select a recipe. The [comparison](../../tests/hp_potion_case_scenes.test.js)
restores before inspection settles, before brewing, and before delivery.
The signatures and recipes are authored. Reopen with the brewing owner when
the planner can derive a route from the assay and known reactions without
starting from a recipe for the blend. The local inspection currently reads
co-location and the sample's concealment channel. Reopen ranged assays
and field interception when they need the shared contact reader. PC95,
AD38 and KW3 apply. The brewing delivery consumer reads the spell receipt
through its exported reader. No shared engine, knowledge or save shape changed.

**Receipt.** Base `f0430dde2` with parallel edits. 56 focused tests,
architecture, coverage and documentation checks passed. Coverage computes
92 executable cases across 117 records, with 20 gaps and five records
classified outside spell execution.

### Incendio and a stored heat receiver

The [official winter spell reference](https://www.harrypotter.com/features/useful-spells-for-winter)
identifies Incendio as a fire-making spell. The [pinned book review](../gm/dispatch/foundation-s-2026-11-12/source_check_hp_spells.jsonl)
locates a separate failed visibility attempt at B6 p3615 of the checked
English omnibus, SHA-256 prefix `9db33901964c`. That report leaves fire
emission unresolved in that scene.

The existing fire intent adds heat to the selected hearth. The case
pays for a cast, restores before release, and restores again before an
independent stored working reads the new temperature. The heat signal
sounds when its threshold is reached. In the [failure comparison](../../tests/hp_effect_pack.test.js),
the caster moves out of reach during wind-up, pays for release, and the
hearth stays cold and quiet. Effort, heat and signal values are authored.

This heat-only representation covers a consumer of the fire's warmth.
Reopen flame lifetime, combustion, useful light in enchanted darkness,
and propagation when those behaviors have a world owner and a consumer.
PC95, AD38 and KW3 apply. No shared clock, host or save changes.

**Receipt.** Base `f0430dde2` with parallel edits. 91 focused tests,
architecture, coverage and documentation checks passed. Coverage computes
93 executable cases across 117 records, with 19 gaps and five records
classified outside spell execution.

### Flame-Freezing and continuing fire exposure

The Flame-Freezing Charm now has a typed fire block. The authored effect
uses the existing holder-scoped block to prevent burn gain. The paid cast
restores before the caster and companion enter the same hot place. A
stored exposure working reads the fire temperature and applies its
ordinary burn effect each minute. While the lease holds, the companion
accumulates burns and the caster stays unharmed. The
[expiry comparison](../../tests/hp_effect_pack.test.js) restores again
inside the fire and checks that the same exposure starts affecting the
caster as the lease expires. The fire's temperature stays unchanged.

B3 p630 of the checked English omnibus (SHA-256 prefix `9db33901964c`)
and the [official textbook excerpt](https://www.harrypotter.com/features/the-best-and-worst-wizarding-world-writers-ranked)
describe protection for a witch or wizard in flames. The case uses an
authored personal binding, burn account, cost and duration. Reopen with
the environment and body owners when fire needs combustion, smoke,
spread, or a persistent injury reader. The spell uses the existing field
and stored-working owners. PC95, AD38 and KW3 apply.

**Receipt.** Base `f0430dde2` with parallel edits. 92 focused tests,
architecture, coverage and rules passed. The docs check reported one finding
in the concurrent Gu considerations edit and none in this section. Coverage
computes 94 executable cases across 117 records, with 18 gaps and five
records classified outside spell execution.

### Arresto Momentum and landing speed

The Braking Charm now installs a temporary descent-rate field. The
Hogwarts descent case reads the field on the shared clock and settles
landing harm from the rate used in the segment that reached the ground.
A lease expiring exactly at impact still protects the rider. A lease
expiring earlier allows the fall to speed up before impact.

The [headless comparison](../../tests/hp_effect_pack.test.js) restores
during wind-up and during descent. A timely paid cast produces a slow,
safe landing. A cast reaching the target at the impact boundary, or a
cast with an obstructed route, spends effort and leaves the ordinary
landing harm. The fall uses the existing substrate rates, watches,
and closed-form settlement. The shared coverage runner loads the
Hogwarts descent pack for this case.

The checked omnibus gives the fall at B3 p825 (SHA-256 prefix
`9db33901964c`). The [official Braking Charm entry](https://www.harrypotter.com/fact-file/spells/the-braking-charm)
supplies the formula and describes reduced momentum. The scene's height,
rates, duration, effort and damage are authored. Reopen with the movement
and combat owners when a shared trajectory can supply horizontal motion,
mass, intermediate interception or impact with a moving object. This
case handles a falling body on a local route. PC95, AD38 and KW3 apply.

**Receipt.** Base `f0430dde2` with parallel edits. 93 focused tests,
architecture and coverage passed. Coverage computes 95 executable cases
across 117 records, with 17 gaps and five records classified outside spell
execution.

### Extension Charm and usable cargo space

Capacious extremis uses the existing object transformation to increase
interior capacity. The headless container action reads that value and
the bulk of items already in the interior. In the
[comparison](../../tests/hp_effect_pack.test.js), the bag refuses the
books before release, admits them after the paid cast and restore, and
refuses the blanket after restoring the partially filled bag. The
exterior bulk stays unchanged. If the bag moves out of reach before
release, the attempt spends effort and leaves its capacity unchanged.

The checked omnibus shows the bag at B7 p3813 (SHA-256 prefix
`9db33901964c`). The [official entry](https://www.harrypotter.com/fact-file/spells/the-undetectable-extention-charm)
supplies the incantation and distinguishes interior space from exterior
dimensions. Capacity and effort are authored. The bag now holds a reference
to its interior. Moving it changes where a person can reach the opening,
while the cargo keeps its existing interior location. The comparison
restores after moving the bag and verifies that the original site loses
access, a closed opening prevents retrieval, and retrieving the books at
the new site makes room for the blanket. Existing headless fixtures can
still resolve their interior from the earlier entry link.

Reopen with the inventory and site owners for nested capacity and settlement
when capacity shrinks while occupied, or when a live inventory needs the
same entry actions. PC95, AD38 and KW3 apply. No shared inventory, host or
save schema change.

**Receipt.** Base `f0430dde2` with parallel edits. 94 focused tests,
architecture and coverage passed. The docs check flags a concurrent Gu edit.
Coverage computes 96 executable cases
across 117 records, with 16 gaps and five records classified outside spell
execution.

### Fidelius and keeper disclosure

The paid spell places a keeper-backed field on the refuge. The headless
approach checks the person's held knowledge and its provenance. The keeper
can disclose in person through the existing knowledge owner, which records
the lesson and adds it to the recipient's memory. The
[comparison](../../tests/hp_effect_pack.test.js) restores before the cast,
after the cast, and after disclosure. A direct recipient enters. A stranger
and someone taught by that recipient cannot enter. When the caster moves
out of reach before release, the cast pays and the approach stays open.

The checked English omnibus, SHA-256 prefix `9db33901964c`, locates the
keeper explanation at B3 pp880–881. The
[official Fidelius entry](https://www.harrypotter.com/fact-file/spells/the-fidelius-charm)
corroborates the keeper's role and gives no incantation. The refuge, effort,
and in-person route are authored. The case uses a headless approach command
as its consumer. Reopen with the travel and knowledge owners when a live
map needs the same visibility rule, or when written disclosure, keeper
succession, or prior conflicting beliefs need settlement. PC95, AD38 and
KW3 apply. The engine and knowledge owners retain their current save shapes.

**Receipt.** Base `f0430dde2` with parallel edits. 83 focused tests,
architecture and coverage passed. Coverage computes 97 executable cases
across 117 records, with 15 gaps and five records classified outside spell
execution.

### Protean inscriptions and meeting signals

The paid charm installs a field binding the replica to a source coin.
The headless coin pack uses substrate clock decisions to copy the
source inscription. A distant replica follows the master after restore,
and a local member can use the new meeting code to follow an open
route. The ordinary coin stays unchanged. The
[headless test](../../tests/hp_effect_pack.test.js) also shows a second
update, a severed link that retains its last inscription, and a cast
that spends effort and misses a coin moved out of reach during wind-up.
No separate clock or stored charge is needed for this form.

B5 p2292 of the checked English omnibus (SHA-256 prefix `9db33901964c`)
supplies the coin relationship. The [official coins article](https://www.harrypotter.com/features/7-of-hermiones-magical-tricks-that-would-be-really-handy-in-real-life)
corroborates the communication use. A changed replica now records a
warmth deadline. Its holder can feel the alert after restore, and a
person who drops the coin loses tactile contact. The inscription
remains readable once the coin cools. An ordinary coin stays cold,
and severing the link lets existing warmth expire without refreshing
it. The two-minute window, the single-source relationship, meeting route
and effort are authored. Reopen with the artifact and communication
owners for chain relays and persistent recipient knowledge after the
coin is put away. PC95, AD38 and KW3 apply. The runner loads the local
pack without registering it in the shared engine.

**Receipt.** Base `f0430dde2` with parallel edits. 96 focused tests,
architecture and coverage passed. Coverage computes 98 executable cases
across 117 records, with 14 gaps and five records classified outside spell
execution.

### Page reveal and an empty result

The [headless comparison](../../tests/spell_contact.test.js) restores
during a paid page-reveal working, then checks a blank page, a warded
page with writing, and a page with a removable ink concealment. The
blank page produces no change. The ward intercepts the release. The
authored control reveals the ink channel and preserves another
concealment. A page reader can read the control's writing after the
cast, while both other pages yield no writing. All three attempts
pay the same effort. The restored and direct runs agree.

B2 p506 of the checked English omnibus (SHA-256 prefix `9db33901964c`)
and the [official diary reference](https://www.harrypotter.com/features/magical-properties-and-defences-of-voldemorts-horcruxes)
support the resisted Aparecium attempt. The control exercises the
existing channel release and establishes an engine capability.
This records the initial source decision. The [named Aparecium case](#aparecium-and-the-resisted-diary)
now carries the authored comparison and preserves the source limit on
a successful reveal. PC95, AD38 and KW3 apply.

**Receipt.** Base `f0430dde2` with parallel edits. 97 focused tests,
architecture and coverage passed. Coverage remains at 98 executable
Hogwarts cases across 117 records.

### Taboo and a spoken location report

The paid cast installs a name-triggered field. The Hogwarts headless
speech action publishes the name and actual place. A matching utterance
breaks the selected concealment field and gives the watcher a location
record through the existing knowledge owner. The watcher can follow
that report along an open path. An unrelated screen survives. An alias
or a speaker unable to speak gives the watcher no lead. The
[comparison](../../tests/hp_effect_pack.test.js) restores before release,
before speech and after the report, and checks closed-route failure.

B7 p4077 of the checked English omnibus (SHA-256 prefix `9db33901964c`)
and the [official account of the names](https://www.harrypotter.com/features/the-different-meanings-behind-lord-voldemorts-many-names)
support the detection of a spoken name. Installation, local scope, effort
and the choice of protection are authored. The headless pack listens to a
substrate event and records knowledge with the existing owner. Reopen
with the speech, pursuit and ward owners for live dialogue, distributed
coverage, remote pursuit, and ward behavior beyond the selected field.
PC95, AD38 and KW3 apply. No shared engine registration or save schema change.

**Receipt.** 110 focused tests passed. Architecture and coverage passed.
Coverage computes 99 executable cases across 117 records, with 13 gaps
and five records classified outside spell execution.

### Parseltongue as a passage key

A local receiver listens for the language, phrase and clarity of a
spoken request. It opens an existing substrate link when the request
matches. The [headless case](../../tests/hp_effect_pack.test.js) restores
between attempts. Wrong language, wrong phrase, an unclear imitation,
a muted speaker and an absent speaker all fail. A sufficiently clear
imitation opens the link, and a companion can cross it after restore.
There is no spell debit for speaking. The authored clarity threshold
represents the receiver's tolerance. The caller supplies the actual
utterance, so this does not model a character learning the language.

The checked omnibus locates the scenes at B2 p580 and B7 p4240
(SHA-256 prefix `9db33901964c`). The [official account of Parseltongue](https://www.harrypotter.com/features/everything-you-didnt-know-about-parseltongue)
supports imitation as a route. The ledger classifies this operation
as an artifact command with headless proof. Reopen with the speech and
knowledge owners when an ordinary language action needs to derive the
utterance from fluency, practice or heard examples, or when a native
scene needs this link. PC95 and AD38 apply. No shared engine registration
or save schema change.

**Receipt.** 111 focused tests passed. Coverage remains at 99 executable
spell cases across 117 records, with 12 gaps and six records classified
outside spell execution.

### The Trace and attribution

The headless Trace installs a temporary detection field on a pupil. Its
receiver reads a settled working's positional effect at the pupil's
location. The official learns where magic happened through the existing
knowledge owner, and can follow the report to investigate. The report
contains a location observation and no claim about who cast. In the
[comparison](../../tests/hp_effect_pack.test.js), a visitor levitates the
dish. Moving it by hand, moving the pupil away, or letting the field
expire yields no report. The cast and the report survive save and restore.

The checked English omnibus gives the attribution distinction at B6 p3297
(SHA-256 prefix `9db33901964c`). The
[official Ministry account](https://www.harrypotter.com/features/into-the-pensieve-mafalda-hopkirk)
corroborates the B2 ch2 warning after Dobby's cast. Installation, effort,
lifetime and the investigative response are authored. This receiver
currently listens to positional effects from engine workings. Reopen
with the settlement and institution owners for other spell families,
attempts with no landed effect, age-based expiration and enforcement
that weighs independent evidence. PC95, AD38 and KW3 apply. No shared
engine registration or save schema change.

**Receipt.** 112 focused tests passed. Architecture and coverage passed.
Coverage computes 100 executable cases across 117 records, with 11 gaps
and six records classified outside spell execution.

### Silencio, spoken magic and spoken requests

A block on adding noise to the speaker now suppresses both spoken spell
release and the headless speech actions. The engine supplies the current
voice block to the spell law from the same field reader that resolves
noise effects. The shared speech check also reads laughter, airway
obstruction and awareness. The [headless comparisons](../../tests/hp_effect_pack.test.js)
restore the silenced speaker before a spoken attempt. A spoken Lumos
interrupts before payment, an authored silent Lumos still lands and pays,
the Taboo name produces no report until the field lapses, and a silenced
request leaves the Chamber closed.

B5 pp2742 and 2805 of the checked English omnibus (SHA-256 prefix
`9db33901964c`) support the distinction between an audible voice and
continued casting. The existing Silencio row supplies the voice block.
The duration, effort and test spells are authored. PC95, AD38 and KW3
apply. The shared engine reader supplies a derived value without a save
field. Reopen with the speech owner when sound needs listener-specific
delivery, or when learned nonverbal forms need a live ability reader.

**Receipt.** 113 focused tests, architecture and coverage passed. Coverage
remains at 100 executable Hogwarts cases across 117 records.

### Chapter 11 replay and an interrupted Shield Charm

**ACT NOW.** The [headless replay](../../tests/hp_duelling_club.test.js)
again matches the serialized world and working records for manual play, an
idle advance and idle play restored at each decision boundary. Draco's
Rictusempra laughter and Harry's compelled steps both end at minute 3 under
Snape's single Finite release. An unrelated compelled-steps working survives.
The source boundary remains B2 pp460–461, from Harry's Rictusempra through the
teacher's counter, before the snake exchange.

The added comparison saves with Harry's Tarantallegra in flight and Draco's
planted Protego still in preparation. On the open platform the dance lands
at minute 2, then Protego interrupts at minute 3 without charging Draco.
Closing the sightline after restore makes the same incoming cast miss.
Draco keeps his footing, finishes Protego and pays two effort. Both branches
match their partitioned restore replay. The prior reversed-target case also
checks that Draco can still aim and release Rictusempra while dancing. Spell
timings, costs and the planted Protego form are local authored choices.

**Receipt.** PC95, AD36/38, AR3/6 and CBR4/18/25. Base `f0430dde2` with
shared edits present. Focused `node --test` for the Duelling Club, spell
contact, Hogwarts effect pack and mind passed 61 tests. `npm run check:arch`
and `node scripts/coverage_report.mjs --check` passed. The current ledger has
100 authored executable cases, 11 gaps and six other classifications among
117 audited records. Engine fixture verified, with no runtime or save format
change. The [combat palette](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#round-5-when-a-wand-falls)
holds the gameplay proposals for nonlethal endings.

### Unbreakable Vow and clause settlement

The [Hogwarts ritual](../../src/world_packs/hp_unbreakable_vow.js) takes
an exact clause and its spoken assent. The proposer, vower and Bonder
must be present and distinct. The Bonder needs a held wand and pays
two effort for each seal. Refusal, a changed deadline, and a Bonder
who is absent or has lost the wand leave the proposed duty unbound.
The caller supplies the participants' decisions. The existing engine
binding owns each sealed duty, its price and its breach.

The [headless comparison](../../tests/hp_unbreakable_vow.test.js) saves
between clauses. A declined duty's deadline passes harmlessly. A real
Lumos working satisfies the first accepted clause. The second accepted
clause kills the vower when its deadline passes without its matching
working. After restoring the settled breach, a new cast fails before
payment. In the comparison branch a matching working at the deadline
satisfies the second clause and the vower survives.

The checked English omnibus (SHA-256 prefix `9db33901964c`, B6
pp2879–2881) establishes the clause-by-clause replies and distinct
Bonder. The [official account of the ritual](https://www.harrypotter.com/features/in-defence-of-narcissa-malfoy)
corroborates Bellatrix's role. [Ron states the lethal consequence](https://www.harrypotter.com/features/6-times-fred-and-georges-pranks-went-too-far)
in B6. KW36–KW39 supply the deadline and settlement semantics.
The two-effort price, precise duties and
deadlines are authored. This PC95 case matches settled working receipts.
Reopen with K and the dialogue owner when assent must be recorded across
separate actions, an obligation reads a landed outcome, or conditional
terms such as failing to protect someone need authored evidence. Reopen
with the harm and story owners for death aftermath outside the fixture.
The shared engine and save schema are unchanged (AR3/6/12).

**Receipt.** Base `f0430dde2` with shared edits present. 90 focused tests,
`npm run check:arch` and `npm run check:rules` passed, with existing
shared-tree warnings. `node scripts/coverage_report.mjs --check` computes
101 executable cases across 117 records, with ten gaps and six other
classifications. The generator's full-ledger comparison already
reported drift before this work. Only the Vow row was updated to preserve
the other ledger edits. Engine fixture verified headlessly.

### Bubble-Head and underwater breathing

The [breathing pack](../../src/world_substrate_packs/breathing.js)
consumes a body's reserve while submerged and spends vitality once the
reserve runs out. A body-scoped air supply preserves the reserve, and
surfacing lets it recover. Bubble-Head is a paid spell working that
installs that supply as a timed substrate field. The diver enters and
leaves through the existing directed-motion reader on a world link.

The [headless comparison](../../tests/hp_effect_pack.test.js) restores
before release, during the dive and after the reserve empties. An
unheld wand interrupts release before effort is spent. The unprotected
diver starts losing vitality earlier. Surfacing during the charm
preserves vitality and the full reserve. A long advance and a
minute-by-minute restored dive agree through expiry, including their
saved world and working records.

B4 p1611 of the checked English omnibus (SHA-256 prefix
`9db33901964c`) locates the effect. The [official Bubble-Head entry](https://www.harrypotter.com/fact-file/spells/the-bubble-head-charm)
identifies the bubble as an air supply and leaves the incantation
unknown. Duration, effort, reserve capacity and injury rate are local
authored dials. The pack is opt-in through the PC95 coverage host.
Reopen with the body owner when another consumer needs shared air
quality, a different respiratory medium, or scaling by exertion.
Reopen with the harm owner when drowning needs the shared defeat and
recovery lifecycle. No change to the engine or save schema (AR3/6/12).

**Receipt.** Base `f0430dde2` with shared edits present. 80 focused tests,
`npm run check:arch` and `node scripts/coverage_report.mjs --check` passed.
The runner computes 102 executable cases across 117 records, with nine
gaps and six other classifications. Engine fixture verified headlessly.

### Aunt Marge and involuntary magic

The [incident](../../src/world_packs/hp_accidental_magic.js) uses the
existing stored-working host to watch a body-carried distress threshold.
The outburst needs local reach and a reserve, and changes the target's
form without a prepared cast, incantation or implement. The lift reader
uses that form to move the target. A responder's paid working reverses
the form and the same reader returns the target to the floor. The
[comparison](../../tests/hp_accidental_magic.test.js) restores before
the outburst and while the target is aloft. It covers sustained distress
without a repeat debit, separation before release, a drained reserve,
and a responder who loses their wand grip.

The checked English omnibus (SHA-256 prefix `9db33901964c`, B3 pp659
and 672) locates the incident and its reversal. [Rowling's Marge
Dursley account](https://www.harrypotter.com/writing-by-jk-rowling/marge-dursley)
supports anger, loss of control, and Ministry intervention. The distress
threshold, reserve debit, target binding and reversal technique are
authored. The timeline supplies the change in distress. Reopen with
agency and dialogue when the game can derive that change from a
witnessed event and choose the expression from live circumstances.
Reopen with the institution and knowledge owners for the dispatch and
memory consequences. The ledger keeps this incident outside the
single-cast grammar, with executable proof through stored workings.

### Headless capability checkpoint

| Capability | Current executable evidence | Reopen condition |
| --- | --- | --- |
| Aim, casting conditions and impact | [Contact](../../tests/spell_contact.test.js) and [Chapter 11](../../tests/hp_duelling_club.test.js) read grip, speech, footing, reach and shields. A released cast keeps its origin, reads defenses at impact and can hit a stray recipient or [reflect back to the caster](#protego-and-reflected-impact). Paid failure covers fizzle, partial duration and backfire. | Reopen staged return flight, deflection geometry and weakening when those change an actual encounter. |
| Sustained, stored and interrupted workings | [Stored working engine](../../tests/stored_working_engine.test.js), [Hogwarts effect cases](../../tests/hp_effect_pack.test.js) and [contact](../../tests/spell_contact.test.js) cover timed effects, paid stored reactions, targeted endings, and cancellation that preserves a settled step or in-flight spell. [Patronus focus loss](#patronus-focus-after-release) now ends a live manifestation. | Reopen for graded focus, upkeep on a non-manifested effect, or an active effect that can be handed to another caster. |
| Combat and ordinary uses | [Duel](../../tests/hp_duelling_club.test.js) compares manual, idle and restored play. [Contest settlement](#disarm-surrender-and-escape-on-the-engine-clock) publishes an accepted surrender or a physical escape after disarm. [Pursuit](#pursuing-a-witnessed-escape) follows an observed departure through live routes. [Idle contest choice](#idle-contest-spell-choice) selects a cast on the engine clock. [Effect cases](../../tests/hp_effect_pack.test.js) cover travel, shelter, fire, breathing, knowledge and artifact responses. | Reopen tactical choice when an encounter needs reaction ranking or repeated casts, and pursuit when searching, fresh sightings or renewed contact have a downstream consumer. |
| Learning, preparation and invention | [Practice evidence](#fg6--learning-preparation-and-interrupted-repetition) and [grammar tests](../../tests/spell_grammar.test.js) cover learned forms, novel variants and local costs. [Saved Accio instruction](#teaching-and-repeating-a-recorded-accio-form) covers a second operator, changed conditions and retry from paid failure evidence. | Reopen graded technique and controlled revisions when the learned expression changes execution, and shared multi-step teaching when a second form needs it. |
| Ledger source limits | 111 executable cases across 117 records. The remaining six classify phenomena, artifact commands, unsuccessful or fake attempts, and a legal category. [The two camp wards](#chapter-11-and-camp-wards-recheck) execute as authored interpretations. | Reopen on qualified evidence for the isolated effects of Salvio Hexia and Cave Inimicum, or for an ordinary-ink success of Aparecium. The count covers the audited spellbook. |

### Fiendfyre, fuel contact and escape

The [Fiendfyre pack](../../src/world_substrate_packs/fiendfyre.js)
reads a front seeded by a paid cast. After release, it advances on the
world clock across open fuel contacts, wears down flammable holders and
hurts exposed bodies. A newly reached pile can spread the fire on a later
minute. The front closes an exposed wooden crossing when it reaches its
support. A traveller with that destination stays on the landing and can
still take the balcony path using the existing movement owner.

The [headless comparisons](../../tests/hp_effect_pack.test.js) restore the
active front before spread and again before the crossing attempt. Losing
the wand after release leaves the fire active. A paid Aguamenti raises
moisture, and the fire still spreads. Cutting the fuel contact before
spread preserves the crossing and the traveller reaches the aisle.
Successive contacts take separate clock steps. The initial caster is
exposed to their own fire.

B7 pp4246–4251 of the checked English omnibus (SHA-256 prefix
`9db33901964c`) locates the escape and destruction. The [official
Fiendfyre entry](https://www.harrypotter.com/fact-file/spells/fiendfyre)
corroborates propagation and resistance to water. The clock rate,
condition and vitality losses, effort, fuel exhaustion and crossing
geometry are authored. This case has no pursuit by flame shapes,
controlled redirection or Horcrux settlement. Reopen with W and the
agency owner when a moving front needs to pick among actual prey,
with the spell owner when an evidenced control method can steer it,
and with the identity owner when destruction must reach a bound soul.
The pack uses existing fields, links and world save data (PC95, AR3/6/12).

**Receipt.** Base `f0430dde2` with shared edits present. 77 focused tests,
`npm run check:arch` and `node scripts/coverage_report.mjs --check` passed.
The runner computes 103 executable cases across 117 records, with eight
gaps and six other classifications. Engine fixture verified headlessly.

### Occlumency and a paid Legilimens attempt

The [Occlumency working](../../src/world_packs/hp_occlumency.js)
settles supervised practice against current tutor presence. After two
completed exercises the student can spend effort to focus. The existing
concealment reader screens the mind channel, so the shared Legilimens
cast pays its ordinary effort while exposing no memory. An unguarded
cast and a cast after expiry both expose the original memory. The
[comparisons](../../tests/hp_occlumency.test.js) restore training,
the active screen and the pending disrupted lesson. Confusion before
focus settles prevents the screen and preserves the student's effort.
A tutor who leaves before completion grants no exercise credit.

The checked English omnibus (SHA-256 prefix `9db33901964c`, B5
pp2448–2449 for the Legilimens lesson) and the [official Occlumency
entry](https://www.harrypotter.com/fact-file/magical-miscellany/occlumency)
support coached mental defense. The exercise count, effort, focus
duration and confusion threshold are authored. The ledger classifies the
discipline outside the single-cast vocabulary. Reopen with the
progression and mind owners when another lesson or opposition needs to
derive graded resistance, selective disclosure or recovery of focus
after the screen is active. No shared engine or save schema change
(PC95, AR3/6/12, KW11/15).

**Receipt.** Base `f0430dde2` with shared edits present. 96 focused
tests, architecture and executable coverage passed. The coverage runner
computes 105 executable cases across 117 records.

### Protego and reflected impact

The shared contact resolver reads the matching barrier at impact.
A flight explicitly marked reflectable retains the releasing holder
in its existing saved impact data. A reflecting shield redirects the
effect from its location to that holder's current location. The
return checks the open path and the recipient's shield. This case
settles the return at the same impact boundary, and a second shield
intercepts it. Ordinary interception remains available on either leg.

The [headless comparison](../../tests/spell_contact.test.js) raises
Protego during flight and restores before contact. One branch sends the
paid hit back to the caster. Moving behind cover prevents the return
hit. Raising a second shield intercepts it. The attack pays once in
all branches, with each shield paying its own cost. A flight without
the reflection option is intercepted at the first shield. The
uninterrupted and restored reflected hits leave identical saves.

The checked English omnibus (SHA-256 prefix `9db33901964c`,
B6 pp3058–3059 and B7 p4018) establishes interposition and repelling a
jinx. The [official Shield Charm entry](https://www.harrypotter.com/fact-file/spells/the-shield-charm)
explicitly supports sending a spell back or weakening a stronger one.
The flight's eligibility, shield durations, return timing and cost
are authored. The existing [pinned contact
references](#spell-contact-and-combat-2026-11-12) support the distinction
between release, target and impact, with no third-party code imported.
Reopen with the impact owner when a delayed return, a deflection into
another route, or a weakened hit changes a downstream choice. Existing
in-flight records without a reflection marker keep their former
interception behavior (PC95, AR3/6/12, KW11/15).

**Receipt.** Base `f0430dde2` with shared edits present. 104 focused tests,
architecture and executable coverage checks passed. The host's lowering
census now includes the two previously added rows for Bubble-Head and
Fiendfyre. The ledger remains at 105 executable cases across 117 records.

### Patronus focus after release

The [focus pack](../../src/world_substrate_packs/spell_sustain.js)
reads the manifestation's sustaining holder and the mind owner's current
awareness and confusion. At the next decision boundary it ends the
manifestation through the existing holder lifecycle when support fails.
The protective reaction is carried by the guardian, so it needs a live
guardian when it settles. The relation, effects and timing use the
existing world and engine save.

In the [restored comparison](../../tests/hp_effect_pack.test.js), Harry
pays for and forms the guardian. An opponent then pays for Confundus,
which changes Harry's live mental state. After restore, the guardian
ends before its protection settles and the Dementor's scheduled attack
lands. Harry's original effort remains spent. The intact run still
drives the Dementor out of reach, and the wisp comparison leaves the
approach open.

B3 pp884–887 (checked English omnibus, SHA-256 prefix `9db33901964c`)
and the [official Patronus reference](https://www.harrypotter.com/fact-file/spells/the-patronus-charm)
anchor the protective form and its mental input. Ongoing focus, the
confusion threshold and the encounter timing are authored for this
fixture. Reopen with the mind and lifecycle owners for graded focus
or an effect that can outlive or change its sustaining holder. The pack
opts in per manifestation (PC95, AR3/6/12, KW11/15).

**Receipt.** Base `f0430dde2` with shared edits present. 102 focused
tests, architecture and executable coverage passed. The ledger remains
at 105 executable cases across 117 records.

### Teaching and repeating a recorded Accio form

The [instruction case](../../src/world_packs/hp_spell_instruction.js)
records a successful demonstration through the existing knowledge owner.
A second actor acquires the versioned form through teaching. The form
binds a fresh caster, wand and target when used. Accio reads the caster's
current place at release when the authored form leaves the destination
implicit. Explicit destinations retain their existing behavior.

The [headless comparison](../../tests/hp_spell_instruction.test.js)
restores the written form and the student's cast. The student moves
before release and successfully summons the cup to their new bench.
A later shutter closure leaves a different target on the shelf even
though the student pays for the release. The student records the failed
attempt, restores, and uses that report to recover the target for a
fresh paid retry. Reopening the shutter lets the retry land. The
demonstrator's receipt, taught form, failed trial and successful retry
all remain independently readable after restore.

The checked English omnibus (SHA-256 prefix `9db33901964c`,
B4 p1461 and B7 p4162) anchors summoning and a failed protected target.
The [official account of Hermione's help](https://www.harrypotter.com/features/why-harry-and-ron-would-never-have-got-so-far-without-hermione)
supports instruction and practice. The written version, local shutter
reach, timing and costs are authored. The case supports one versioned
form and its evidence. Reopen with the spellbook and knowledge owners
when another form needs composed instruction, an incomplete lesson,
or a technique revision with a distinct effect on execution. PC95,
FG6.3, AR3/6 and KW3/11/15 apply.

**Receipt.** Base `f0430dde2` with shared edits present. 92 focused tests,
architecture and executable coverage passed. The ledger remains at
105 executable cases across 117 records.

### Disarm, surrender and escape on the engine clock

The [headless adapter](../../src/world_packs/hp_duel_outcomes.js) uses the
Duelling Club's paid Expelliarmus and physical withdrawal. Contest owns
the outcome and publishes `contest.settled`. Its exit entry point takes
an already-resolved engine minute expressed in contest ticks. The spell
kernel still owns the cast and cost. The fixture never steps the contest
readiness clock.

The [restored comparison](../../tests/hp_duel_outcomes.test.js) starts from
the same dropped wand. An accepted surrender interrupts the unlaunched
cast. A paid spell already in flight still lands. A refused surrender
leaves the encounter open. A shut exit prevents settlement until Draco
actually crosses. The crossing publishes escape and a pursuit intent.
Both branches publish once and preserve the dropped wand's location
across restore.

B2 pp459–461 of the checked English omnibus (SHA-256 prefix
`9db33901964c`) anchors the club and disarm. The [official duelling
reference](https://www.harrypotter.com/fact-file/magical-miscellany/duelling)
distinguishes practice from lethal encounters. The surrender and escape
branches, timing and effort are authored. Reopen with the contest and
pursuit owners when a pursuing actor can take a route action, or when
the contest chooser can directly select a spell and wait on its engine
receipt. The fixture saves the existing engine and contest records side
by side. Neither save schema changed (PC95, CFC10/11/16, CBR2/3/25,
AR3/6 and KW8/15).

**Receipt.** Base `f0430dde2` with shared edits present. 77 focused tests,
architecture and executable coverage passed. The ledger remains at
105 executable cases across 117 records.

### Pursuing a witnessed escape

The [duel adapter](../../src/world_packs/hp_duel_outcomes.js) reads the
saved contest pursuit intent and the substrate departure. An awake
pursuer with an open sightline to the departure can retain the
witnessed destination. The follow action uses the existing path
reader and queues one leg through the mind pack. Movement checks
that leg again when it settles, so a route closed after the action
was queued stops the crossing. The follow action uses the last
sighting and reads no later destination from the target.

The [tests](../../tests/hp_duel_outcomes.test.js) restore the witnessed
lead, the queued movement and the final leg. Opening the path lets
Harry reach the doorway, with elapsed time and the original disarm
cost retained. Concealing the departure behind a closed sightline
leaves pursuit intent without a destination to follow. The escape
outcome publishes once. This is an authored extension to the disarm
fixture with the same B2 pp459–461 source boundary. It uses existing
world and contest records. Reopen with the pursuit owner for searching,
lead expiry, fresh sightings, and a new encounter at regained contact
(PC95, CFC11, CBR25, AR3/6).

**Receipt.** 91 focused tests, architecture and executable coverage passed.
The ledger remains at 105 executable cases across 117 records.

### Idle contest spell choice

The [duel adapter](../../src/world_packs/hp_duel_outcomes.js) asks the
existing contest chooser to select from the entrant's ordered forms.
The optional eligibility callback reads live wand custody, speech,
footing where applicable, effort and the spell casting slot. The
chosen action uses the same engine command as manual play. Spell
release still checks its own conditions and owns payment. The authored
drill attempts each form once, with existing working IDs retaining that
choice across restores. The manual entry remains available for retries.

In the [comparison](../../tests/hp_duel_outcomes.test.js), Draco starts
a reply while he still has a wand. Expelliarmus lands before the
reply releases, so it interrupts without charging him. Starting idle
after disarm queues no wand cast. The idle jump, restored idle run and
manual replay leave identical saves and working receipts. B2 pp459–461
of the checked omnibus (SHA-256 prefix `9db33901964c`) supplies the
duelling forms. The order, timings and idle policy are authored.
Reopen with C when tactical ranking needs incoming-impact reads or
when a repeatable policy needs to choose among spells, movement and
yield. No additional readiness clock, debit or save schema (PC95,
CFC15/16, AR3/6, KW3/15).

**Receipt.** 92 focused tests, architecture and executable coverage passed.
The ledger remains at 105 executable cases across 117 records.

### Idle Protego against repeated incoming spells

The contest chooser can now rank a guard against an incoming spell
reported by the engine. The Duelling Club reads a released projectile's
saved aim and impact deadline. It checks live reach, current protection
and the local Protego wind-up and expiry. This policy wants the shield
in place before the impact minute, avoiding a same-minute ordering
assumption. It can choose Protego again for a later threat.

The [headless comparison](../../tests/hp_duel_outcomes.test.js)
restores during both flights. Draco waits until Protego will still be
active at contact, then intercepts each cast and pays for each shield.
The first defense matches manual input and both runs match their
uninterrupted saves. With the sightline shut he spends nothing and the
spell misses. Starting idle too late leaves the spell free to land.

Shield behavior uses the [existing Protego source boundary](#protego-and-reflected-impact).
The timing window and the one-attempt opening attack policy are authored.
Reopen with C for judging threat severity, reacting during wind-up,
and repeatable offensive choices. PC95, CFC15/16, KW3/15, AR3/6.

**Receipt.** 93 focused tests, architecture and executable coverage passed.
The ledger remains at 105 executable cases across 117 records.

### Idle interruption to raise Protego

An aimed Duelling Club wind-up across an open sightline now supplies
an authored telegraph to the idle chooser. The policy projects contact
from the currently bound aim and the saved release or impact deadline.
It can abandon its own unreleased attack through the existing cancel
command when a paid Protego will finish in time. The cancellation is
committed with the selected guard. A failed guard eligibility check
leaves the earlier cast in progress. A released projectile retains its
existing impact behavior.

The [restored comparison](../../tests/hp_duel_outcomes.test.js) puts
Draco in the middle of an unpaid reply while Harry prepares
Expelliarmus. Draco drops the reply, pays for Protego, and keeps his
wand. The result matches the same manual cancellation and cast.
Starting the policy one minute later or with too little effort
preserves the reply until the disarm interrupts it. The book source
boundary remains [Protego](#protego-and-reflected-impact) and B2
pp459–461 for Expelliarmus. The exact aim cue, reaction window and
priority are authored. Reopen with C and the observation owner for
uncertain aim, threat severity and competing reactions. No save
schema change (PC95, CFC15/16, KW3/8/15, AR3/6).

**Receipt.** 94 focused tests, architecture and executable coverage passed.
The ledger remains at 105 executable cases across 117 records.

### Source qualification for area protection and Jelly-Legs

The checked English omnibus (SHA-256 prefix `9db33901964c`) shows
Protego Totalum among grouped wards at B7 pp3916 and 4058. The [official
Shield Charm entry](https://www.harrypotter.com/fact-file/spells/the-shield-charm)
independently identifies protection of an area and its occupants.
The headless case uses the existing place-scoped contact barrier.
After restore, the guest who entered the camp is protected, the
caster who left is exposed, and the guest can be hit once it expires.
The ward and each released attack pay separately. The size, duration
and interception rule are authored. Reopen boundary shape and group
composition when a second ward changes the same incoming cast.

The B6 p3058 Jelly-Legs cast is repelled. The [official guide to
spells](https://www.harrypotter.com/features/your-guide-to-the-best-spells-in-harry-potter)
supplies the effect of unsteady legs and lists Locomotor Wibbly.
The headless case gives unsteady footing its own lease in the existing
mind owner. After restore, a planted Shield Charm interrupts before
payment, Lumos still works, and the Shield Charm can release after
expiry. The local costs, duration and planted stance are authored.
Reopen movement consequences when a route needs balance or speed
instead of ordinary directed movement.

Both cases run through the [Hogwarts effect pack](../../src/world_packs/hp_effect_pack.js)
and the same coverage runner. The ledger names which evidence supplies
the effect. No new save schema (PC95, AR3/6, KW3/15).

**Receipt.** 96 focused tests, architecture and executable coverage passed.
The ledger computes 107 cases, four source gaps and six other
classifications across 117 records.

### Aparecium and the resisted diary

B2 p506 of the checked English omnibus (SHA-256 prefix `9db33901964c`)
shows the failed attempt. The [official Horcrux defences account](https://www.harrypotter.com/features/magical-properties-and-defences-of-voldemorts-horcruxes)
attributes the resistance to the diary. The previous page comparison
now uses the named spell. It applies the same shared release operation
to ordinary hidden ink under an authored interpretation. The sentence
selects the ink channel, so another concealment stays in place even
when the caller supplies a different channel.

The [ledger case](../../src/world_packs/hp_effect_pack.js) restores
each pending cast and checks both debits. The diary keeps its
concealment and the ordinary note loses only its hidden-ink channel.
The [page reader comparison](../../tests/spell_contact.test.js) also
checks that a blank page yields no text and the ordinary note becomes
readable. The diary's barrier, effort and timing are authored. Reopen
on a qualified successful use, or when an artifact needs to explain its
own resistance through a distinct consumer. PC95, AR3/6, KW3/15.

### Bedazzling a travelling cloak

B7 p4046 of the checked English omnibus (SHA-256 prefix `9db33901964c`)
reports Bedazzling as a treatment for ordinary travelling cloaks. The
[official cloak reference](https://www.harrypotter.com/fact-file/objects/the-invisibility-cloak)
corroborates that lesser cloaks can fade. The treatment is reported
in dialogue. The cast, duration, equipment binding and cost are authored.

The paid working leaves a timed field on the cloak. The existing sense
operation checks the currently worn, co-located cloak before reporting
visual contact. The [headless case](../../src/world_packs/hp_effect_pack.js)
restores after the cast. Sight yields no contact while the wearer is
covered, and a separate presence reading still works. Removing the
cloak or letting the field fade restores sight. The [failed
comparison](../../tests/hp_effect_pack.test.js) restores after the
enchanter walks out of reach and verifies the paid release yields no
cloak field or concealment.

The fixture writes the wearing relation directly. Reopen with the
equipment owner when wearing, carrying, and sharing a cloak require
their own actions. Reopen with presence when equipping or removing
the garment must invalidate a prior contact immediately. This case
reads the current relation on a fresh sense attempt (PC95, AR3/6,
KW3/15).

**Receipt.** 106 focused tests, architecture and executable coverage
passed. The ledger computes 109 cases, two source gaps and six other
classifications across 117 records.

### Chapter 11 and camp wards recheck

The [student exchange](../../tests/hp_duelling_club.test.js) produces the same serialized world and working records by manual actions, idle policy, and idle with JSON restores at minutes 0, 1, 2, 3 and 8. Draco casts Tarantallegra through the laughter. Snape ends the laughter and Harry's dancing with one Finite at minute 3 and pays two effort once. A separate dancing lease survives the counter. In the reversed-target test, Draco can aim Rictusempra while dancing. His planted Protego fails before payment if the jinx lands during the wind-up. Closing the sightline makes the jinx miss and his shield completes. Cast timing and footing requirements are authored. The [outcome fixtures](../../tests/hp_duel_outcomes.test.js) recheck saved surrender, escape, pursuit and live shield choice after disarm. The [combat palette](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#round-6-what-the-winner-does-next) holds the proposed gameplay follow-ups.

The checked English omnibus (SHA-256 prefix `9db33901964c`, B7 pp3916 and 4058) shows grouped camp wards. Salvio Hexia now uses the contact barrier with an authored filter for mind-binding effects. Cave Inimicum uses a place-scoped field and an arrival reactor that adds noise for an uninvited body. The [joint case](../../src/world_packs/hp_effect_pack.js) restores with both fields live. A guest passes quietly, the intruder raises a warning, a paid Jelly-Legs Jinx is stopped and a cutting curse still lands. After expiry and restore, the return is quiet and the same jinx changes the keeper's footing. The regression varies the contact filter and invitation independently. Both change the respective observation. The cast cost, lifetime, selectivity, warning and access facts are authored.

**Receipt.** PC95, AD36/38/51, AR3/6/11, CBR2/18/25, KW3/15 and WPR30–32. Base `f0430dde2` with shared edits present. Eleven focused test files passed 125 checks, including the duel, contact, cancellation, kernel interruption, stored workings, and instruction. `npm run check:arch`, `npm run check:coverage` and `npm run check:rules` passed, with unrelated rule warnings. The isolated game build passed with bundle SHA-256 prefix `583eb412c0dc`. The generator output still differs on unrelated pre-existing ledger metadata, which was preserved. The executable ledger reports 111 authored cases and zero production-reachable case modules. The duel and camp are headless engine fixtures. Native game route and browser save/export/import of these encounters remain open. No save schema change.
