# Club paths, all club-named stages

**Shown:** 24 Bookworms stages, 78 exits and 18 investigations; 20 Rimbal Supporters stages, 71 exits and 9 investigations in the Summer union. All choice gates, skill checks, immediate/pending links, success effects and failure effects are enumerated below and in CLUB_PATHS.json. **Inferred:** short scene paraphrases. Neither live reachability nor a full census of organizations with other names is claimed.

The Bookworms entry reads the **Library Knowledge child skill under Research**, not the Research parent skill: level ≥2. Accepting grants the sorting job and one step each in Library Knowledge and Filing. Declining reduces Stress by one and stops that route. This is an action unlock, not a Club registry object.

Rimbal entry is a date-range predicate; the exact dates appear below. Its later consent choices can stop the story. There is no global club membership level in this map. Failure often changes gains or penalties while continuing the same stage sequence.

Bookworms 03 and 11 contain return loops; 08 can skip 09–10; failure on three checks at 11 skips to 16, while Patrol failure goes to 12. At 17 a paid route has no roll, but its own gate and cost are still relevant. At 19 a special non-roll option is separately gated. Read each choice rather than treating absence of a roll as free success.

Bookworms final lesson choices grant Charm/Leadership, Strength/Strategy or Insight/Character Study respectively, plus three relationship gains. Rimbal final aftermath expands a set of relationships, including NPC-to-NPC pairs; it is not solely player reputation. Exact magnitudes and targets remain attached to their choice IDs.

`reward > N` means maximum roll power must strictly exceed N; threshold 0 applies unconditionally. Choice roll thresholds are a different field. Effects marked Expand are permanent changes in the source; do not rename every Expand to a skill level gain. The path distinguishes Skill Step, attributes, money and relationship. Conditions and full entity selection are retained in JSON.

## Stage index

| Stage | Paraphrased scene | Investigations | Exit choices |
|---|---|---:|---:|
| Bookworms Club 01 | Volunteer intake | 0 | 2 |
| Bookworms Club 02 | Book repair and sorting practice | 5 | 1 |
| Bookworms Club 03 | Notice an intruder after hours | 1 | 3 |
| Bookworms Club 04 | Pursue the intruder | 0 | 3 |
| Bookworms Club 05 | Bring an instructor into the pursuit | 0 | 2 |
| Bookworms Club 06 | Prepare lecture handouts | 7 | 2 |
| Bookworms Club 07 | Repair and clean the library | 1 | 8 |
| Bookworms Club 08 | Translate a note found in a returned book | 0 | 3 |
| Bookworms Club 09 | Read a concealed message | 1 | 4 |
| Bookworms Club 10 | Choose how to handle the note | 0 | 3 |
| Bookworms Club 11 | Investigate a library after curfew | 0 | 5 |
| Bookworms Club 12 | Approach an animated book | 1 | 4 |
| Bookworms Club 13 | Handle a magical creature | 0 | 4 |
| Bookworms Club 14 | Follow the books’ dispute | 0 | 1 |
| Bookworms Club 15 | Calm or contain hostile books | 0 | 3 |
| Bookworms Club 16 | Reach the city district for recovery | 1 | 3 |
| Bookworms Club 17 | Enter the thieves’ house | 1 | 4 |
| Bookworms Club 18 | Assess attic wards | 0 | 5 |
| Bookworms Club 19 | Recover books under pressure | 0 | 4 |
| Bookworms Club 20 | Compare the recovered books | 0 | 1 |
| Bookworms Club 21 | Enter the restricted library | 0 | 3 |
| Bookworms Club 22 | Find the right shelves | 0 | 4 |
| Bookworms Club 23 | Answer a librarian’s challenge | 0 | 3 |
| Bookworms Club 24 | Choose a lesson from the adventure | 0 | 3 |
| Rimbal Supporters' Club 01 | Learn about a new sports group | 0 | 2 |
| Rimbal Supporters' Club 02 | Meet and talk with supporters | 0 | 3 |
| Rimbal Supporters' Club 03 | Choose whether to stay involved | 0 | 2 |
| Rimbal Supporters' Club 04 | Prepare equipment | 1 | 4 |
| Rimbal Supporters' Club 05 | Practice game roles | 0 | 4 |
| Rimbal Supporters' Club 06 | Track a missing mascot | 1 | 4 |
| Rimbal Supporters' Club 07 | Recover it and choose a response | 0 | 4 |
| Rimbal Supporters' Club 08 | Clean a borrowed sports ground | 1 | 5 |
| Rimbal Supporters' Club 09 | Choose a practice partner | 0 | 4 |
| Rimbal Supporters' Club 10 | Play the opening half | 1 | 4 |
| Rimbal Supporters' Club 11 | Choose who to support in closing plays | 0 | 8 |
| Rimbal Supporters' Club 12 | Play with a changed roster | 1 | 4 |
| Rimbal Supporters' Club 13 | Adapt through the next half | 1 | 4 |
| Rimbal Supporters' Club 14 | Respond to a prank barrage | 0 | 3 |
| Rimbal Supporters' Club 15 | Accept or decline a revenge match | 0 | 2 |
| Rimbal Supporters' Club 16 | Face older rivals | 1 | 4 |
| Rimbal Supporters' Club 17 | Take the opening plays | 1 | 3 |
| Rimbal Supporters' Club 18 | Build the lead | 1 | 3 |
| Rimbal Supporters' Club 19 | Choose a closing style | 0 | 3 |
| Rimbal Supporters' Club 20 | Receive the aftermath | 0 | 1 |

## Bookworms Club 01

ID `63a4c388f3d1284b969e9ea0e36816d8`. Entry: AND Numeric/Prerequisites, Numeric/Skill Level [Research; Library Knowledge] GreaterThanOrEqualTo 2.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 8aae7bd69ebf444faa733a166873ccbb / Exit | open | no roll | Expand -1 Expand/Expand Subject/Stress -> Character/Character/Self (reward > 0) | none | stop | stop |
| ba085eb15ea9014da367ab26bd31e9cd / Exit | open | no roll | Add 1 Add/Add Subject/Action [Job; Sort the Bottomless Bookpile] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Research; Library Knowledge] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Research; Filing] -> Character/Character/Self (reward > 0) | none | Bookworms Club 02 (pending, gate open) | stop |

## Bookworms Club 02

ID `582c7b159286fd409334d3891e807618`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| b33f4123b4676643a35e8adf5693eff4 / Investigation | open | Bookbinding / Finesse > 4 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Calligraphy; Bookbinding] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | stop | stop |
| d05ba6c17841da4e9ea90e2c11fa2ca4 / Investigation | open | Study Habits / Finesse > 4 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Revision; Revision Methods] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Revision; Revision Methods] -> Character/Character/Self | stop | stop |
| 06d4f0de3235714aa5e19d569a591098 / Investigation | open | Forgery / Intelligence > 4 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Calligraphy; Forms] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Calligraphy; Forgery] -> Character/Character/Self | stop | stop |
| 42441c041128624a955d24827cceeb66 / Investigation | open | Filing / Intelligence > 4 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Plot; Dedication] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | stop | stop |
| b9fb5ce236e5a94cbcb31ee4fb76bcc4 / Investigation | open | Conversation / Charm > 4 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Befriend; Listen] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Beguile; Character Study] -> Character/Character/Self | stop | stop |
| 2cd0c9286b628049b3625267e8621fff / Exit | open | no roll | Expand 5 Expand/Expand Subject/Money -> Character/Character/Self (reward > 0) | none | Bookworms Club 03 (pending, gate open) | stop |

## Bookworms Club 03

ID `1f46dee10f89f346956e48b7436d0d0e`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 3ea135bec0c82646a402a6fb195b05d2 / Investigation | open | Listen / Luck > 6 (Type4) | Increase 33 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| 6d0c52028d9f154f8033b31d17710dd6 / Exit | open | Command / Fitness > 15 (Type4) | Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Rhetoric; Passion] -> Character/Character/Self (reward > 0) | Expand -3 Expand/Expand Subject/Vitality -> Character/Character/Self | Bookworms Club 04 (immediate-if-gate-passes, gate open) | Bookworms Club 04 (immediate-if-gate-passes, gate open) |
| 34b089f4fc425846805d50553aefb89f / Exit | open | Move Silently / Finesse > 6 (Type4) | Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Spy; Hide] -> Character/Character/Self (reward > 0) | Expand -3 Expand/Expand Subject/Vitality -> Character/Character/Self | Bookworms Club 04 (immediate-if-gate-passes, gate open) | Bookworms Club 04 (immediate-if-gate-passes, gate open) |
| b042fc4dbadcad4e9714ec07ffd43a01 / Exit | open | no roll | Expand -1 Expand/Expand Subject/Skill Step [School Survival; Curiosity] -> Character/Character/Self (reward > 0) | none | Bookworms Club 03 (pending, gate open) | stop |

## Bookworms Club 04

ID `e3b3db8ab4940a48a80461f8fcb4c4ae`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 5fdb897a991ddd45881867c4534e94fe / Exit | open | Running / Fitness > 4 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Athletics; Running] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self | Bookworms Club 05 (immediate-if-gate-passes, gate open) | Bookworms Club 05 (immediate-if-gate-passes, gate open) |
| 91961b7798337e4ba0e698ffd7f787ac / Exit | open | Planning / Insight > 6 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Beguile; Character Study] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self | Bookworms Club 05 (immediate-if-gate-passes, gate open) | Bookworms Club 05 (immediate-if-gate-passes, gate open) |
| 95093cffbb944b4788aec03c1b2a6819 / Exit | open | Incantation Spells / Finesse > 4 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Enspell; Concentration] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Incantation; Theory of Incantation] -> Character/Character/Self | Bookworms Club 05 (immediate-if-gate-passes, gate open) | Bookworms Club 05 (immediate-if-gate-passes, gate open) |

## Bookworms Club 05

ID `0b27120ae96f534fa57e0e491000e860`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| e941b0adc76c58418765c123c393697b / Exit | open | Tactics / Finesse > 5 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Negation; Negation Spells] -> Character/Character/Self (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Character & Instructor Relationship/Character/Self [Polisena Briardi] (reward > 0) | Expand -2 Expand/Expand Subject/Vitality -> Character/Character/Self; Expand 2 Expand/Expand Subject/Relationship -> Character & Instructor Relationship/Character/Self [Polisena Briardi] | Bookworms Club 06 (pending, gate open) | Bookworms Club 06 (pending, gate open) |
| 3b900852c526e541b2c55d273e1ad664 / Exit | open | Voice / Luck > 7 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Music; Voice] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Character & Instructor Relationship/Character/Self [Polisena Briardi] (reward > 0) | Expand -2 Expand/Expand Subject/Vitality -> Character/Character/Self; Expand 1 Expand/Expand Subject/Relationship -> Character & Instructor Relationship/Character/Self [Polisena Briardi] | Bookworms Club 06 (pending, gate open) | Bookworms Club 06 (pending, gate open) |

## Bookworms Club 06

ID `b25b24788ea08040aa901f5dd0b3888f`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| ba67542b4cbc6f4993976b1548e8f5ea / Investigation | open | Ink Compounds / Intelligence > 6 (Type4) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Brew; Alchemical Tools] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Synchronicity; Empathy] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self | stop | stop |
| 73b078508494174c9390c8bdba0e61d8 / Investigation | open | Bookbinding / Finesse > 5 (Type4) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Art; Creativity] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] (reward > 0) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self; Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] | stop | stop |
| 6d271c88544eb94aad161ff376315f07 / Investigation | AND Existence/Prerequisite, Existence/Rivalry NotEqual Existence/Prerequisite, Existence/Relationship [Hedi; Ausdauer Mollers]; Numeric/Prerequisites, Numeric/Relationship [Hedi; Ausdauer Mollers] GreaterThanOrEqualTo 0 | Creativity / Intelligence > 5 (Type4) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Calligraphy; Illustration] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Ausdauer Mollers] (reward > 0) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self; Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | stop | stop |
| c8e619cac799044a84c3e580caa91a04 / Investigation | open | Carpentry / Finesse > 5 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Art; Creativity] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self (reward > 0) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self; Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Engineering; Architecture] -> Character/Character/Self | stop | stop |
| e636582b5ad8b345abd77dcfb8a02c44 / Investigation | AND Numeric/Prerequisites, Numeric/Relationship [Aranaz; Basia Rydz] GreaterThanOrEqualTo 0; Existence/Prerequisite, Existence/Rivalry NotEqual Existence/Prerequisite, Existence/Relationship [Aranaz; Basia Rydz] | Illustration / Finesse > 5 (Type4) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Basia Rydz] (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self; Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Basia Rydz]; Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | stop | stop |
| 45223abbaa614940b4387e386587eabc / Investigation | AND Existence/Prerequisite, Existence/Rivalry NotEqual Existence/Prerequisite, Existence/Relationship [Aranaz; Milena di Montors]; Numeric/Prerequisites, Numeric/Relationship [Aranaz; Milena di Montors] GreaterThanOrEqualTo 0 | Calligraphy / Finesse > 4 (Type4) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors] (reward > 0) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self; Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | stop | stop |
| 4bd74dbe8fdcd2478425dcb64058d2af / Investigation | AND Existence/Prerequisite, Existence/Rivalry NotEqual Existence/Prerequisite, Existence/Relationship [Hedi; Zoe Melis]; Numeric/Prerequisites, Numeric/Relationship [Hedi; Zoe Melis] GreaterThanOrEqualTo 0 | Phemes / Finesse > 5 (Type4) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Plot; Dedication] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Zoe Melis] (reward > 0) | Add 1 Add/Add Subject/Memory [You've helped at Aventyrare's event.] -> Character/Character/Self; Expand -1 Expand/Expand Subject/Skill Step [Blackmail; Observation] -> Character/Character/Self | stop | stop |
| d869c6efb33e544d949ddce51fb789fb / Exit | AND Existence/Prerequisite, Existence/Memory [You've helped at Aventyrare's event.] NotEqual Existence/Prerequisite, Existence/Character | no roll | Expand 1 Expand/Expand Subject/Skill Step [Ambush; Danger Sense] -> Character/Character/Self (reward > 0); Expand -1 Expand/Expand Subject/Skill Step [Plot; Dedication] -> Character/Character/Self (reward > 0) | none | Bookworms Club 07 (pending, gate open) | stop |
| 8cb03d457f218047a1f6f7a87da8cedc / Exit | AND Existence/Prerequisite, Existence/Memory [You've helped at Aventyrare's event.] Equals Existence/Prerequisite, Existence/Character | no roll | Expand 3 Expand/Expand Subject/Merit -> College/College/Character (reward > 0); Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Aranaz; Basia Rydz; Hedi; Zoe Melis] (reward > 0) | none | Bookworms Club 07 (pending, gate open) | stop |

## Bookworms Club 07

ID `6e67009d749b0b4ca26d923dd091c50e`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 1dcb0cf4862d4c49b2ad64c21521fb13 / Investigation | open | Patrol / Insight > 7 (Type4) | Add 1 Add/Add Subject/Memory [Emergency carpentry is required!] -> Character/Character/Self (reward > 0); Increase 2 Increase/Increase Subject/Skill Level [Blackmail; Observation] -> Character/Character/Self (reward > 0) | none | stop | stop |
| f7b8a8fbfda9fb4c9eaf8a62f67d743f / Exit | open | Dedication / Fitness > 7 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Plot; Dedication] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Research; Library Knowledge] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Action [Job; Filing Fugue] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Ausdauer Mollers] | Bookworms Club 08 (pending, gate open) | Bookworms Club 08 (pending, gate open) |
| 2f14fa1c69eb99419958fdecbe123cec / Exit | open | Filing / Luck > 6 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Research; Library Knowledge] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Synchronicity; Serenity] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Action [Job; Filing Fugue] -> Character/Character/Self (reward > 0) | Expand -2 Expand/Expand Subject/Vitality -> Character/Character/Self | Bookworms Club 08 (pending, gate open) | Bookworms Club 08 (pending, gate open) |
| 6523b095d1dfaa439b93ade9dc3492df / Exit | open | Willpower / Luck > 8 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Ausdauer Mollers] (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Forge; Courage] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Action [Job; Filing Fugue] -> Character/Character/Self (reward > 0) | Add 1 Add/Add Subject/Ability [Affliction; Stenchtastic] -> Character/Character/Self | Bookworms Club 08 (pending, gate open) | Bookworms Club 08 (pending, gate open) |
| be5fcd3215701c4b8a35ebd20d72f7bc / Exit | open | Diplomacy / Charm > 7 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Befriend; Conversation] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Befriend; Listen] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Action [Job; Filing Fugue] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Basia Rydz] | Bookworms Club 08 (pending, gate open) | Bookworms Club 08 (pending, gate open) |
| 3c8967466dac8b41a221c2ab6f209e95 / Exit | open | Research / Intelligence > 7 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Research; Library Knowledge] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Research; Filing] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Action [Job; Filing Fugue] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 08 (pending, gate open) | Bookworms Club 08 (pending, gate open) |
| 1c70bcaf4e3fea45a6189ad47fa2ef07 / Exit | open | Calligraphy / Intelligence > 7 (Type4) | Expand 2 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Action [Job; Filing Fugue] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 08 (pending, gate open) | Bookworms Club 08 (pending, gate open) |
| d431ab4945c3b349b5e2bae87fbdf90a / Exit | AND Existence/Prerequisite, Existence/Memory [Emergency carpentry is required!] Equals Existence/Prerequisite, Existence/Character | Observation / Luck > 6 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Engineering; Carpentry] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Action [Job; Filing Fugue] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Skill Step [Engineering; Carpentry] -> Character/Character/Self; Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self | Bookworms Club 08 (pending, gate open) | Bookworms Club 08 (pending, gate open) |
| 62aaf3e57edb2d47875eaf12debf6251 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self (reward > 0) | none | Bookworms Club 08 (pending, gate open) | stop |

## Bookworms Club 08

ID `af46574f94a42040a10d2fcf9b031a43`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 11dab99465a6f845b95a070fa04b8f79 / Exit | open | Oncestrian / Intelligence > 5 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Language; Oncestrian] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 09 (immediate-if-gate-passes, gate open) | Bookworms Club 09 (immediate-if-gate-passes, gate open) |
| 18e6beb3f28c5e4e9996a6d01f9291dd / Exit | AND Existence/Prerequisite, Existence/Rivalry NotEqual Existence/Prerequisite, Existence/Relationship [Aranaz; Milena di Montors] | Social Skills / Charm > 7 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors] (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self | Bookworms Club 09 (immediate-if-gate-passes, gate open) | Bookworms Club 09 (immediate-if-gate-passes, gate open) |
| 9a6e0e3ea7b9694c941ad9d39d03f780 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Skill Step [Malice; Dispassion] -> Character/Character/Self (reward > 0); Expand -1 Expand/Expand Subject/Skill Step [School Survival; Curiosity] -> Character/Character/Self (reward > 0) | none | Bookworms Club 11 (pending, gate open) | stop |

## Bookworms Club 09

ID `8a5943710692854ebe976d53ecb20c91`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 3c24512308b2b543a0d1c8871e38d979 / Investigation | open | Ink Compounds / Intelligence > 7 (Type4) | Increase 33 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| 027fd7d76febd149995ad700c12e3f08 / Exit | open | Magical Appraisal / Intelligence > 6 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Enspell; Concentration] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Negation; Negation Methods] -> Character/Character/Self | Bookworms Club 10 (immediate-if-gate-passes, gate open) | Bookworms Club 10 (immediate-if-gate-passes, gate open) |
| c26b8ee9360f224989d2d2e7ea92c4f7 / Exit | open | Negation Methods / Intelligence > 4 (Type4) | Expand 2 Expand/Expand Subject/Skill Step [Enspell; Concentration] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Negation; Negation Methods] -> Character/Character/Self | Bookworms Club 10 (immediate-if-gate-passes, gate open) | Bookworms Club 10 (immediate-if-gate-passes, gate open) |
| 7229713ba7f7174196ca466e1b78a716 / Exit | open | Decipher Handwriting / Intelligence > 7 (Type4) | Expand 2 Expand/Expand Subject/Skill Step [Enspell; Concentration] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Enspell; Concentration] -> Character/Character/Self | Bookworms Club 10 (immediate-if-gate-passes, gate open) | Bookworms Club 10 (immediate-if-gate-passes, gate open) |
| 54c0ece756c53f48989c12ac14f71b45 / Exit | open | Orthography / Intelligence > 7 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Blackmail; Observation] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Dialectic; Sleuthing] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Dialectic; Sleuthing] -> Character/Character/Self | Bookworms Club 10 (immediate-if-gate-passes, gate open) | Bookworms Club 10 (immediate-if-gate-passes, gate open) |

## Bookworms Club 10

ID `e946552b565897489fc19cc51f1e78ff`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 33cbfcb689049a43bb224c38c87c92fb / Exit | open | no roll | Expand 1 Expand/Expand Subject/Skill Step [School Survival; Study Habits] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [School Survival; Test-Taking] -> Character/Character/Self (reward > 0) | none | Bookworms Club 11 (pending, gate open) | stop |
| 0dee6a559e16d747b784714f36b922a8 / Exit | open | no roll | Add 1 Add/Add Subject/ItemTemplate [Food; Box of Chocolates] -> Character/Character/Self (reward > 0); Inform 1 Information/Information/Item [Food; Box of Chocolates] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Heraldry; Romance] -> Character/Character/Self (reward > 0) | none | Bookworms Club 11 (pending, gate open) | stop |
| c6f979579f783546a5e3f8df69ca6d28 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Skill Step [Heraldry; Intrigue] -> Character/Character/Self (reward > 0); Expand 25 Expand/Expand Subject/Money -> Character/Character/Self (reward > 0) | none | Bookworms Club 11 (pending, gate open) | stop |

## Bookworms Club 11

ID `21831279079a5f4f8da670ff3ab3349f`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| f4c3f1f188e25e4481134c3fa6bb3941 / Exit | open | Observation / Luck > 8 (Type4) | none | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Beguile; Storytelling] -> Character/Character/Self | Bookworms Club 12 (immediate-if-gate-passes, gate open) | Bookworms Club 16 (pending, gate open) |
| 75dd80271db918448db783cf6521ccd4 / Exit | open | Listen / Luck > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Patrol; Scouting] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Sabotage; Perception] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Beguile; Storytelling] -> Character/Character/Self | Bookworms Club 12 (immediate-if-gate-passes, gate open) | Bookworms Club 16 (pending, gate open) |
| 0538c2378f12144f934adcb226304115 / Exit | open | Astrology / Luck > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Enspell; Phemes] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [School Survival; Curiosity] -> Character/Character/Self (reward > 0) | Expand 3 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Beguile; Storytelling] -> Character/Character/Self | Bookworms Club 12 (immediate-if-gate-passes, gate open) | Bookworms Club 16 (pending, gate open) |
| 6385968abafebc469ca2e550da096c87 / Exit | open | Patrol / Luck > 8 (Type4) | none | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors] | Bookworms Club 12 (immediate-if-gate-passes, gate open) | Bookworms Club 12 (immediate-if-gate-passes, gate open) |
| b69503da4754fc46b95a1e80253971eb / Exit | AND Numeric/Prerequisites, Numeric/Relationship [Aranaz; Aymeri Couer; Durand; Lambert Cobo] GreaterThanOrEqualTo 99 | no roll | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self (reward > 0) | none | Bookworms Club 11 (pending, gate open) | stop |

## Bookworms Club 12

ID `478af4709edad7449e7158b3be8cbc27`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| afa1bca8dd752340be05a825af528408 / Investigation | open | Magical Appraisal / Intelligence > 8 (Type4) | Increase 25 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| fb9b38a2e0dffe4bba3ea4ff1f1cab9f / Exit | open | Command / Charm > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Bully; Interrogation] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 13 (immediate-if-gate-passes, gate open) | Bookworms Club 13 (immediate-if-gate-passes, gate open) |
| 227240691f76774ebbc8a4935788bba5 / Exit | open | Courage / Insight > 9 (Type4) | Expand 2 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 13 (immediate-if-gate-passes, gate open) | Bookworms Club 13 (immediate-if-gate-passes, gate open) |
| bf58df9ee727c94aa6007a9f04c75dcb / Exit | open | Danger Sense / Insight > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Negation; Theory of Negation] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Avila; Aaran Ledale] (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Zoe Melis] | Bookworms Club 13 (immediate-if-gate-passes, gate open) | Bookworms Club 13 (immediate-if-gate-passes, gate open) |
| 73c8ce9ce338e348b2dbc13b048f8461 / Exit | open | Conversation / Charm > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Befriend; Listen] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Malice; Patience] -> Character/Character/Self; Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 13 (immediate-if-gate-passes, gate open) | Bookworms Club 13 (immediate-if-gate-passes, gate open) |

## Bookworms Club 13

ID `3480a7a00811d4488784c8fd9a0bf9c0`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 91acc67b9759314fb524d4ef88c88f2e / Exit | open | Incantation Spells / Finesse > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Forge; Courage] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors]; Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Aranaz; Milena di Montors; Hedi; Zoe Melis] | Bookworms Club 14 (immediate-if-gate-passes, gate open) | Bookworms Club 14 (immediate-if-gate-passes, gate open) |
| bde6cdbcbfa88f48a458ef5c774bad10 / Exit | open | Schoolyard Education / Fitness > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Avila; Aaran Ledale] (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 14 (immediate-if-gate-passes, gate open) | Bookworms Club 14 (immediate-if-gate-passes, gate open) |
| f31cb39f55571241a43cf9002f6e8094 / Exit | open | Negation Methods / Finesse > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Negation; Negation Phemes] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Avila; Aaran Ledale] | Bookworms Club 14 (immediate-if-gate-passes, gate open) | Bookworms Club 14 (immediate-if-gate-passes, gate open) |
| 4d364afed25a604e9b32877cd8d656dd / Exit | open | Danger Sense / Insight > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Forge; Courage] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [War; Leadership] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 14 (immediate-if-gate-passes, gate open) | Bookworms Club 14 (immediate-if-gate-passes, gate open) |

## Bookworms Club 14

ID `b7973dab53d20d459ddae3ce24a9b114`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| e81f7fd7a24ddf4b903eae4178277ad6 / Exit | open | no roll | none | none | Bookworms Club 15 (immediate-if-gate-passes, gate open) | stop |

## Bookworms Club 15

ID `71299d70e98be747a6079ff92d209cf5`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| ad0a56397e411f42be8d15e413e9f036 / Exit | open | Wrestling / Strength > 8 (Type4) | Expand 2 Expand/Expand Subject/Skill Step [Bully; Brute Strength] -> Character/Character/Self (reward > 0) | Expand -2 Expand/Expand Subject/Vitality -> Character/Character/Self | Bookworms Club 16 (pending, gate open) | Bookworms Club 16 (pending, gate open) |
| da1cd9c79a27b74bb30b37f9c23f3cbe / Exit | open | Harpsichord / Intelligence > 8 (Type4) | Expand 2 Expand/Expand Subject/Skill Step [Music; Famous Songs] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors] | Bookworms Club 16 (pending, gate open) | Bookworms Club 16 (pending, gate open) |
| 74817e1b8a3a16469fad90865ad09978 / Exit | open | Diplomacy / Charm > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Society; Persuasion] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self | Bookworms Club 16 (pending, gate open) | Bookworms Club 16 (pending, gate open) |

## Bookworms Club 16

ID `a4e3fea8f2bb674197cd361e18220c80`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| e477bc2fdaf08046ab01bd2deb44c143 / Investigation | open | Ambush / Intelligence > 10 (Type4) | Increase 33 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| 17e71d538fddaf4aa141c11db0e2c6de / Exit | open | Move Silently / Finesse > 10 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Malice; Patience] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Spy; Hide] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 17 (immediate-if-gate-passes, gate open) | Bookworms Club 17 (immediate-if-gate-passes, gate open) |
| f19f0ee61051b2488464fba19ce14ebe / Exit | open | Glamour Spells / Insight > 9 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Ausdauer Mollers] (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Espionage; Infiltration] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 17 (immediate-if-gate-passes, gate open) | Bookworms Club 17 (immediate-if-gate-passes, gate open) |
| fed2b292729bbd4eb634180497be0a0a / Exit | open | Coordination / Insight > 10 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Revision; Revision Spells] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Espionage; Infiltration] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 17 (immediate-if-gate-passes, gate open) | Bookworms Club 17 (immediate-if-gate-passes, gate open) |

## Bookworms Club 17

ID `600923ae2a72e746a4ca8249c6d026db`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 56bb54c442d49e4096884799e75e192e / Investigation | open | Character Study / Insight > 9 (Type4) | Increase 25 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| 2022fc54d92bbc4c9e78127163d6bb91 / Exit | open | Lockpick / Finesse > 13 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Plot; Flawless Timing] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Revision; Revision Phemes] -> Character/Character/Self | Bookworms Club 18 (immediate-if-gate-passes, gate open) | Bookworms Club 18 (immediate-if-gate-passes, gate open) |
| fb1d27912d922a42b54fce5ce0c8e1cc / Exit | open | Deceit / Charm > 13 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Gossip; Bluff] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Espionage; Infiltration] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 18 (immediate-if-gate-passes, gate open) | Bookworms Club 18 (immediate-if-gate-passes, gate open) |
| 7e9bd0c80de6644d824b9a63bc304aad / Exit | AND Numeric/Prerequisites, Numeric/Money GreaterThanOrEqualTo 50 | no roll | Expand -50 Expand/Expand Subject/Money -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Spy; Lie] -> Character/Character/Self (reward > 0) | none | Bookworms Club 18 (immediate-if-gate-passes, gate open) | stop |
| 90821d0a2d50d84481810566906c75b0 / Exit | open | Minetan Swagger / Luck > 13 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Espionage; Acting] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Basia Rydz] | Bookworms Club 18 (immediate-if-gate-passes, gate open) | Bookworms Club 18 (immediate-if-gate-passes, gate open) |

## Bookworms Club 18

ID `8a89ddcaa3ffdf4eb27f4c79b24e209c`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 8c4dbc6a44ce2640a89d71b1f3b13f09 / Exit | open | Theory of Enchantment / Intelligence > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Forge; Courage] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 19 (immediate-if-gate-passes, gate open) | Bookworms Club 19 (immediate-if-gate-passes, gate open) |
| 473c17595cca834baa7d91a0da6b74f6 / Exit | open | Observation / Intelligence > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Dialectic; Sleuthing] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self | Bookworms Club 19 (immediate-if-gate-passes, gate open) | Bookworms Club 19 (immediate-if-gate-passes, gate open) |
| 70dc0b7df45c334dbeff496f4aab968c / Exit | open | Orthography / Intelligence > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Enchant; Magical Appraisal] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 19 (immediate-if-gate-passes, gate open) | Bookworms Club 19 (immediate-if-gate-passes, gate open) |
| 8ad79a3c0447c34787f0956641a4328c / Exit | open | Theory of Negation / Intelligence > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Blackmail; Observation] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 19 (immediate-if-gate-passes, gate open) | Bookworms Club 19 (immediate-if-gate-passes, gate open) |
| f80b236ad9de2945b49efa5f863ef828 / Exit | open | Magical Appraisal / Intelligence > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Blackmail; Observation] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Ausdauer Mollers] (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 19 (immediate-if-gate-passes, gate open) | Bookworms Club 19 (immediate-if-gate-passes, gate open) |

## Bookworms Club 19

ID `48092ab4f5fb29449d531708f05c5a66`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| f0389d1325792646974b9882e0059fcb / Exit | open | Running / Luck > 9 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Ausdauer Mollers] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Basia Rydz] (reward > 0) | Expand -2 Expand/Expand Subject/Vitality -> Character/Character/Self | Bookworms Club 20 (immediate-if-gate-passes, gate open) | Bookworms Club 20 (immediate-if-gate-passes, gate open) |
| 2e30a3c951c47e418f492cd4bb6f4aad / Exit | OR Existence/Prerequisite, Existence/Ability [Background; Heritage: Staadan] Equals Existence/Prerequisite, Existence/Character; Numeric/Prerequisites, Numeric/Skill Level [Language; Vilocian] GreaterThanOrEqualTo 3 | no roll | Expand 1 Expand/Expand Subject/Skill Step [War; Command] -> Character/Character/Self (reward > 0) | none | Bookworms Club 20 (immediate-if-gate-passes, gate open) | stop |
| 59098a172e5d9345a32a54fd2dbc42dc / Exit | OR Existence/Prerequisite, Existence/Ability [Background; Heritage: Staadan] Equals Existence/Prerequisite, Existence/Character; Numeric/Prerequisites, Numeric/Skill Level [Language; Vilocian] GreaterThanOrEqualTo 3 | Incantation Methods / Finesse > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Enspell; Concentration] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 2 Expand/Expand Subject/Stress -> Character/Character/Selection [Aranaz; Courtenay de Surval] | Bookworms Club 20 (immediate-if-gate-passes, gate open) | Bookworms Club 20 (immediate-if-gate-passes, gate open) |
| 0eaa437666409346b5e4ee0a0d6b8f7e / Exit | open | Duel Conduct / Fitness > 13 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Forge; Courage] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Duel; Duelling Forms] -> Character/Character/Self (reward > 0); Expand 2 Expand/Expand Subject/Stress -> Character/Character/Selection [Aranaz; Courtenay de Surval] (reward > 0) | Expand -2 Expand/Expand Subject/Vitality -> Character/Character/Self; Expand 1 Expand/Expand Subject/Stress -> Character/Character/Selection [Aranaz; Courtenay de Surval] | Bookworms Club 20 (immediate-if-gate-passes, gate open) | Bookworms Club 20 (immediate-if-gate-passes, gate open) |

## Bookworms Club 20

ID `c7b683557b499246ae939c7d5d24a275`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| f09d55519ee7e64d9739e34a7aa12ca3 / Exit | open | no roll | Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Ausdauer Mollers] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Basia Rydz] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] (reward > 0) | none | Bookworms Club 21 (pending, gate open) | stop |

## Bookworms Club 21

ID `efd86fb382f93d4587c041f9cf180dac`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| cb023fb580e34d4e96e589a26c4b2abd / Exit | open | Forgery / Intelligence > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Research; Library Knowledge] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 22 (immediate-if-gate-passes, gate open) | Bookworms Club 22 (immediate-if-gate-passes, gate open) |
| d2340af9977b1c46a94334913f3506fb / Exit | open | Move Silently / Insight > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Plot; Flawless Timing] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] | Bookworms Club 22 (pending, gate open) | Bookworms Club 22 (pending, gate open) |
| 12fdb4fac0d6dd49875c4c464bd9d1b3 / Exit | open | Traps / Intelligence > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Revision; Revision Spells] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Engineering; Clockwork] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Aranaz; Milena di Montors; Hedi; Zoe Melis] | Bookworms Club 22 (immediate-if-gate-passes, gate open) | Bookworms Club 22 (immediate-if-gate-passes, gate open) |

## Bookworms Club 22

ID `e6f75f65abeb3b469500b4611434bc34`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| c0e2ac5d4170d34cb49b603d18eacb2b / Exit | open | Move Silently / Luck > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Patrol; Scouting] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 23 (immediate-if-gate-passes, gate open) | Bookworms Club 23 (immediate-if-gate-passes, gate open) |
| 32a55426639310478fc3d719eae184a6 / Exit | open | Confidence / Insight > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Ambush; Danger Sense] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors] | Bookworms Club 23 (immediate-if-gate-passes, gate open) | Bookworms Club 23 (immediate-if-gate-passes, gate open) |
| 1a99950e64a0c84bba8ab587e6dde308 / Exit | open | Filing / Intelligence > 12 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Plot; Reason] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Research; Cryptology] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Zoe Melis] | Bookworms Club 23 (immediate-if-gate-passes, gate open) | Bookworms Club 23 (immediate-if-gate-passes, gate open) |
| 21855340591f904c9b3d9fb7ca15aa28 / Exit | open | Library Knowledge / Intelligence > 13 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Blackmail; Memorization] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Research; Filing] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 23 (immediate-if-gate-passes, gate open) | Bookworms Club 23 (immediate-if-gate-passes, gate open) |

## Bookworms Club 23

ID `b0281851d1ffe942a6c438aa4007a1c5`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| b21f4919a88d164d8d92dcd115b0f0b8 / Exit | open | Character / Charm > 10 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Sleight-of-Hand; Composure] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self | Bookworms Club 24 (immediate-if-gate-passes, gate open) | Bookworms Club 24 (immediate-if-gate-passes, gate open) |
| a444cf9fe424ee4aa8bf6d4553fba92a / Exit | open | Lie / Charm > 10 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Society; Persuasion] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Society; Persuasion] -> Character/Character/Self | Bookworms Club 24 (immediate-if-gate-passes, gate open) | Bookworms Club 24 (immediate-if-gate-passes, gate open) |
| 75df37daa2a3f44f8c834860dc8d4e99 / Exit | open | Library Knowledge / Charm > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rhetoric; Character] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] | Bookworms Club 24 (immediate-if-gate-passes, gate open) | Bookworms Club 24 (immediate-if-gate-passes, gate open) |

## Bookworms Club 24

ID `fc315c30825fc64a9c88b6a8be92770d`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 9a7b9b65fe8d7842a2bc165748eb073f / Exit | open | no roll | Expand 1 Expand/Expand Subject/Attribute -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [War; Leadership] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Zoe Melis] (reward > 0) | none | stop | stop |
| 7de7da3a7eed0948b5390c179cfb3c5f / Exit | open | no roll | Expand 1 Expand/Expand Subject/Attribute -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [War; Strategy] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Zoe Melis] (reward > 0) | none | stop | stop |
| 3ae9867d9412da4fbc11cddb92f96c9f / Exit | open | no roll | Expand 1 Expand/Expand Subject/Attribute -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Beguile; Character Study] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Courtenay de Surval] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Aranaz; Milena di Montors] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Hedi; Zoe Melis] (reward > 0) | none | stop | stop |

## Rimbal Supporters' Club 01

ID `07972fa26eb401429f719c5870d8fb17`. Entry: AND date window ['month9/day7 7', 'month10/day7 7'].

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 0b650e4a7398df49b9dac4d6f3ee379a / Exit | open | Character Study / Insight > 3 (Type4) | Inform 1 Information/Information/Character [Godina; Zorzi Galea] -> Character/Character/Self (reward > 0) | none | Rimbal Supporters' Club 02 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 02 (immediate-if-gate-passes, gate open) |
| f3b471ea0681d144965da06eaaf10dff / Exit | open | Awareness / Insight > 3 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [School Survival; Curiosity] -> Character/Character/Self (reward > 0) | none | Rimbal Supporters' Club 02 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 02 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 02

ID `e652efcc9adfe44481e2fc1470c9934b`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 1dd6e6039c02c64ead5e09f78a3d6a60 / Exit | open | Patience / Insight > 3 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Beguile; Character Study] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 03 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 03 (immediate-if-gate-passes, gate open) |
| a01230fddc5ee84488875977b9255e62 / Exit | open | Conversation / Charm > 4 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 03 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 03 (immediate-if-gate-passes, gate open) |
| 24a081833f12f14d9df9375dad78b933 / Exit | open | Social Skills / Charm > 3 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Espionage; Acting] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 03 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 03 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 03

ID `4c9f1a1b7ea1d545a804dd41aab284e4`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| d178fad03f27bf4b9db949de6ca7c1f1 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] (reward > 0) | none | Rimbal Supporters' Club 04 (pending, gate open) | stop |
| 7a61ad23b46cfb4894e2a11d8f050c0e / Exit | open | no roll | Expand 1 Expand/Expand Subject/Skill Step [Society; Willpower] -> Character/Character/Self (reward > 0); Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] (reward > 0) | none | stop | stop |

## Rimbal Supporters' Club 04

ID `3632f83e8789174fbbc50a8394915604`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| e55ce1907713fb42907b92ed716459ee / Investigation | open | Awareness / Insight > 4 (Type4) | Increase 25 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| d4fe2ae024d19748acd91a8da40d0e02 / Exit | open | Knots / Finesse > 5 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Magalda Quaranta] (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Magalda Quaranta] | Rimbal Supporters' Club 05 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 05 (immediate-if-gate-passes, gate open) |
| 697a888e2a705c46ab6f3ab6b24bc14f / Exit | open | Carpentry / Finesse > 5 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] (reward > 0) | Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self; Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] | Rimbal Supporters' Club 05 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 05 (immediate-if-gate-passes, gate open) |
| 4d9b8e90f765bc47bac2c16b48f7fa12 / Exit | open | Metallurgy / Strength > 5 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Magsa Nembo] (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self; Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Magsa Nembo] | Rimbal Supporters' Club 05 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 05 (immediate-if-gate-passes, gate open) |
| f3014da28ce25343841a1b694524c5ca / Exit | open | Brute Strength / Strength > 5 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Vincent Eins] (reward > 0) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Vincent Eins]; Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 05 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 05 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 05

ID `da0ce8e0a5076f4692fba50f355d3cca`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 1680e4fe78c17f4b8cb0e7191276fb33 / Exit | open | Rimbal Plays / Fitness > 5 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Magalda Quaranta] (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self | Rimbal Supporters' Club 06 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 06 (immediate-if-gate-passes, gate open) |
| 287803bd9b67c44a96b427586f95fae9 / Exit | open | Rimbal Positions / Fitness > 5 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self | Rimbal Supporters' Club 06 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 06 (immediate-if-gate-passes, gate open) |
| 92f2be0c94498946be944961690cf8bf / Exit | open | Leadership / Fitness > 5 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Vincent Eins] (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 06 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 06 (immediate-if-gate-passes, gate open) |
| df9788de80aa23409bee6670bd08f506 / Exit | open | Rimbal Tactics / Fitness > 5 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Magsa Nembo] (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self | Rimbal Supporters' Club 06 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 06 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 06

ID `b917bc255d0e8f4ea1a01296b64b6895`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| f8332ca05ed8d240bf1f03daf214b433 / Investigation | open | Observation / Intelligence > 6 (Type4) | Increase 33 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| 84ba86a5ca545945af0954fab36b11c1 / Exit | open | Scouting / Insight > 6 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Patrol; Hunting] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 07 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 07 (immediate-if-gate-passes, gate open) |
| 50433ff262cc624ba3c2b60f44690da9 / Exit | open | Familiar Kinship / Luck > 6 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Patrol; Hunting] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 07 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 07 (immediate-if-gate-passes, gate open) |
| 401b7e56d4dcf64aa12c4b3f1f8c4883 / Exit | open | Pure Luck / Insight > 6 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self | Rimbal Supporters' Club 07 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 07 (immediate-if-gate-passes, gate open) |
| 240486e9a97e76448b7962bd4d49cd8f / Exit | open | Hunting / Intelligence > 6 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Blackmail; Observation] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self | Rimbal Supporters' Club 07 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 07 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 07

ID `563ec75fff8b914e960c63aca7954edd`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 6adf23e7b1980345a2fef24ad16785db / Exit | open | Wrestling / Luck > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Bully; Brute Strength] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 08 (pending, gate open) | Rimbal Supporters' Club 08 (pending, gate open) |
| 8f687e100fe2e94990f70e6b040af715 / Exit | open | Schoolyard Education / Strength > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Bully; Brute Strength] -> Character/Character/Self (reward > 0) | Expand -2 Expand/Expand Subject/Vitality -> Character/Character/Self | Rimbal Supporters' Club 08 (pending, gate open) | Rimbal Supporters' Club 08 (pending, gate open) |
| 49385059de38d14d9a3693890e06e43d / Exit | open | Practical Jokes / Intelligence > 7 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Sabotage; Playfulness] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 08 (pending, gate open) | Rimbal Supporters' Club 08 (pending, gate open) |
| a99ba1e021fd2f48831bac912e019822 / Exit | open | Planning / Luck > 7 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [War; Leadership] -> Character/Character/Self (reward > 0) | Expand 2 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 08 (pending, gate open) | Rimbal Supporters' Club 08 (pending, gate open) |

## Rimbal Supporters' Club 08

ID `a68e4a4da5d3914fb46582463030f65c`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| b8be4ca78599d8439cda07ad98800908 / Investigation | open | Observation / Insight > 8 (Type4) | Add 1 Add/Add Subject/Memory [The source of all twigs is known!] -> Character/Character/Self (reward > 0) | none | stop | stop |
| a9be15614514694cba1c1970b0d6759a / Exit | open | Endurance / Fitness > 9 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Plot; Dedication] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) |
| 27d154f14cf9de48a7f089e70467202f / Exit | open | Veneration of the Saints / Intelligence > 9 (Type4) | Expand 10 Expand/Expand Subject/Money -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Step [Religion; Piety] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) |
| bfa587bbfa9b7f42a3f690df5ab37f3a / Exit | open | Revision Spells / Intelligence > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Revision; Theory of Revision] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) |
| 0bfe5ebb55e9eb4d8f64c86a38db302a / Exit | open | Incantation Spells / Intelligence > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Incantation; Incantation Phemes] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) |
| ecf5eec03dd93c41b42c11e6f19d906a / Exit | AND Existence/Prerequisite, Existence/Memory [The source of all twigs is known!] Equals Existence/Prerequisite, Existence/Character | Voice / Charm > 8 (Type4) | Expand 1 Expand/Expand Subject/Skill Step [Raid; Pure Luck] -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/ItemTemplate [Ring; Ring of Keen Eyes] -> Character/Character/Self (reward > 0); Inform 1 Information/Information/Item [Ring; Ring of Keen Eyes] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 09 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 09

ID `5aa1a46547ae14499128d7dec02b12d9`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 429386f8a1e3d342b0619481ff047368 / Exit | AND Existence/Prerequisite, Existence/Rivalry NotEqual Existence/Prerequisite, Existence/Relationship [Godina; Zorzi Galea] | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] (reward > 0) | none | Rimbal Supporters' Club 10 (immediate-if-gate-passes, gate open) | stop |
| 470a9aea3c512d4ea12d1bcf71fff442 / Exit | AND Existence/Prerequisite, Existence/Rivalry NotEqual Existence/Prerequisite, Existence/Relationship [Vernin; Magalda Quaranta] | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Magalda Quaranta] (reward > 0) | none | Rimbal Supporters' Club 10 (immediate-if-gate-passes, gate open) | stop |
| 19e02f97c089eb4680e6c76abaf99c52 / Exit | AND Existence/Prerequisite, Existence/Rivalry NotEqual Existence/Prerequisite, Existence/Relationship [Durand; Magsa Nembo] | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Magsa Nembo] (reward > 0) | none | Rimbal Supporters' Club 10 (immediate-if-gate-passes, gate open) | stop |
| 5790e300717353478c72dbd7fd879717 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Vincent Eins] (reward > 0) | none | Rimbal Supporters' Club 10 (immediate-if-gate-passes, gate open) | stop |

## Rimbal Supporters' Club 10

ID `18de2d8ab94efa4d801b7a792a55f6f7`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| bfb27f774a3ea64abc14d45c908e7e5e / Investigation | open | Awareness / Insight > 6 (Type4) | Increase 33 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| e34a34d45b53904b8a6ffa3716d87d92 / Exit | open | Rimbal Plays / Fitness > 10 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Tactics] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Tactics] -> Character/Character/Self | Rimbal Supporters' Club 11 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 11 (immediate-if-gate-passes, gate open) |
| 69681fbdf65a394c87a290bd3a4e3099 / Exit | open | Rimbal Tactics / Insight > 10 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Positions] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Blackmail; Observation] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Tactics] -> Character/Character/Self | Rimbal Supporters' Club 11 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 11 (immediate-if-gate-passes, gate open) |
| fd18574e39657b4f89bebfcdbde9df93 / Exit | open | Endurance / Fitness > 10 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Malice; Patience] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Tactics] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 11 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 11 (immediate-if-gate-passes, gate open) |
| 47fce83db14b8f40855da71632c00865 / Exit | open | Running / Fitness > 11 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Endurance] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Plays] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Tactics] -> Character/Character/Self; Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self | Rimbal Supporters' Club 11 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 11 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 11

ID `30abfcda852642428f85095fc2d6e5e2`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 64aa7c188f7fdc479a4fab5f9a794516 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] (reward > 0) | none | Rimbal Supporters' Club 12 (pending, gate open) | stop |
| d27d0b8dc387154abd295a577b19e12e / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Luti Jaconelli] (reward > 0) | none | Rimbal Supporters' Club 12 (pending, gate open) | stop |
| d62e566d236f4e43a57f49ee005a651c / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Magsa Nembo] (reward > 0) | none | Rimbal Supporters' Club 12 (pending, gate open) | stop |
| 41910078d080db44bab1e50e2a202dd8 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Magalda Quaranta] (reward > 0) | none | Rimbal Supporters' Club 12 (pending, gate open) | stop |
| c2fb1c2775f36f4686b895d1e352ff4c / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Morvidus; Joana Lio y Rossollo] (reward > 0) | none | Rimbal Supporters' Club 12 (pending, gate open) | stop |
| ca42dc9f5218564a86545fee80df6405 / Exit | AND Numeric/Prerequisites, Numeric/Skill Level [Beguile; Character Study] GreaterThanOrEqualTo 4 | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Morvidus; Philippe Marchant] (reward > 0) | none | Rimbal Supporters' Club 12 (immediate-if-gate-passes, gate open) | stop |
| 760158c98140f74faa94fd60b9215854 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Vincent Eins] (reward > 0) | none | Rimbal Supporters' Club 12 (pending, gate open) | stop |
| cbbe95a4a91c0c44a70c7beb35b4d885 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Kurt Henning] (reward > 0) | none | Rimbal Supporters' Club 12 (pending, gate open) | stop |

## Rimbal Supporters' Club 12

ID `f932627a5b1f564398c4c740c797d87d`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| b0d67bc5592cd84898e06c0467a8dec2 / Investigation | open | Awareness / Insight > 9 (Type4) | Increase 25 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| 6334ee670aa460469f7587bc5c734e21 / Exit | open | Rimbal Tactics / Insight > 12 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Plays] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 13 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 13 (immediate-if-gate-passes, gate open) |
| ad006d7f66c549428d7a15851779d5fb / Exit | open | Schoolyard Education / Fitness > 12 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Athletics; Competition] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 13 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 13 (immediate-if-gate-passes, gate open) |
| 1e00358c7011dd4fb330df862626bf92 / Exit | open | Rimbal Plays / Fitness > 12 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Compete; Planning] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Sabotage; Playfulness] -> Character/Character/Self | Rimbal Supporters' Club 13 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 13 (immediate-if-gate-passes, gate open) |
| 26a293a0687bef48b35e88a995bbd7c0 / Exit | open | Rimbal Positions / Intelligence > 12 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Tactics] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Vernin; Vincent Eins] (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 13 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 13 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 13

ID `7f186a9adcf17b4597eacb26458f22ef`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| d1c20b54d3e11c48b0b4c285b19a52d9 / Investigation | open | Character Study / Insight > 9 (Type4) | Increase 25 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| e4e9ab7e759752459897efab310030a2 / Exit | open | Rimbal Plays / Fitness > 12 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Tulia Faspalla] (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Tulia Faspalla] | Rimbal Supporters' Club 14 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 14 (immediate-if-gate-passes, gate open) |
| 04d4376c75d10f41a54627fff434899c / Exit | open | Negation Methods / Intelligence > 12 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Enchant; Palettes] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Luti Jaconelli] (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 14 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 14 (immediate-if-gate-passes, gate open) |
| c5c9073447e3dc41ba73d2c4dd7f25e4 / Exit | open | Voice / Luck > 13 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Plot; Reason] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 14 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 14 (immediate-if-gate-passes, gate open) |
| 423f5a8282d8594a9e3aef0e476c2391 / Exit | open | Endurance / Fitness > 12 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Compete; Planning] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Tactics] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 14 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 14 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 14

ID `95654f1c819023449477267ae6a604a0`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| fc340d2d3b21614c863dcbbd3c8d2500 / Exit | open | Negation Spells / Finesse > 12 (Type4) | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Magsa Nembo] (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Negation; Negation Phemes] -> Character/Character/Self (reward > 0) | Add 1 Add/Add Subject/Ability [Affliction; Stenchtastic] -> Character/Character/Self | Rimbal Supporters' Club 15 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 15 (immediate-if-gate-passes, gate open) |
| 969a9ec6cf54da4d9750d6210a157a45 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Luti Jaconelli] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Tulia Faspalla] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Random (Default) [Vernin; Vincent Eins] (reward > 0); Expand 1 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Magsa Nembo] (reward > 0); Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self (reward > 0); Add 1 Add/Add Subject/Ability [Affliction; Stenchtastic] -> Character/Character/Self (reward > 0) | none | Rimbal Supporters' Club 15 (immediate-if-gate-passes, gate open) | stop |
| ae3aef71b4fd354db74bf947a37d42bd / Exit | open | Acrobatics / Luck > 14 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Plot; Flawless Timing] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Athletics; Competition] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self; Add 1 Add/Add Subject/Ability [Affliction; Stenchtastic] -> Character/Character/Self | Rimbal Supporters' Club 15 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 15 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 15

ID `e06c1ef262cec148a7400fdc69ea9aee`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| ac79ee0afb8f6848a5512aa52808a411 / Exit | open | no roll | Expand 1 Expand/Expand Subject/Skill Level [Rhetoric; Passion] -> Character/Character/Self (reward > 0) | none | Rimbal Supporters' Club 16 (pending, gate open) | stop |
| dc8da34d796575499344bfcde44a8aa4 / Exit | open | no roll | Expand -1 Expand/Expand Subject/Skill Level [Athletics; Competition] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Attribute -> Character/Character/Self (reward > 0) | none | stop | stop |

## Rimbal Supporters' Club 16

ID `2e2106d75919b64b8908515531a51ed8`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 45f293282603434694c7a89c8571b705 / Investigation | open | Planning / Insight > 12 (Type4) | Increase 25 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| 752ed8affdeb4c418058d563e4547bf2 / Exit | open | Intimidation / Charm > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Beguile; Character Study] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Espionage; Acting] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Bully; Intimidation] -> Character/Character/Self | Rimbal Supporters' Club 17 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 17 (immediate-if-gate-passes, gate open) |
| f2d41080a67f9047bfb4d5930022c65c / Exit | open | Minetan Swagger / Charm > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Bully; Intimidation] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Rhetoric; Confidence] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Society; Minetan Swagger] -> Character/Character/Self | Rimbal Supporters' Club 17 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 17 (immediate-if-gate-passes, gate open) |
| 3e3bcb18641a504e972fd6fdb65caf13 / Exit | open | Manner of a Champion / Charm > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Sleight-of-Hand; Composure] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Bully; Intimidation] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 17 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 17 (immediate-if-gate-passes, gate open) |
| d00d5457041a5f4bb3abb070ea3feaaa / Exit | open | Character Study / Insight > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Blackmail; Observation] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [War; Leadership] -> Character/Character/Self (reward > 0) | Expand -1 Expand/Expand Subject/Skill Step [Rhetoric; Confidence] -> Character/Character/Self | Rimbal Supporters' Club 17 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 17 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 17

ID `5d5172334384234aab3d31b352bbbaed`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| bdee5aa47d9f2542aa67ea7441b61838 / Investigation | open | Concentration / Insight > 12 (Type4) | Increase 25 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| 294ef6e7686c904180aa03ac5445c586 / Exit | open | Rimbal Positions / Intelligence > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Plot; Coordination] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Malice; Dispassion] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 18 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 18 (immediate-if-gate-passes, gate open) |
| 82f603eaca83f143ba8f902534d5c012 / Exit | open | Rimbal Plays / Luck > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rhetoric; Passion] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Athletics; Competition] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 18 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 18 (immediate-if-gate-passes, gate open) |
| 2929b050e181ad47b09af6b39dcef7fe / Exit | open | Dispassion / Charm > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Sleight-of-Hand; Composure] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Plot; Coordination] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 18 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 18 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 18

ID `c7a510eb60122440a0e911ef471c8c12`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| dda3110965f55e48a84721cb6c9a6f37 / Investigation | open | Observation / Insight > 12 (Type4) | Increase 25 Increase/Increase Subject/Chance of Success -> Character/Character/Self (reward > 0) | none | stop | stop |
| d98a8bd371f7fa41ac5a851ba265cebd / Exit | open | Endurance / Fitness > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Society; Willpower] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Tactics] -> Character/Character/Self (reward > 0); Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self (reward > 0) | Expand -2 Expand/Expand Subject/Vitality -> Character/Character/Self | Rimbal Supporters' Club 19 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 19 (immediate-if-gate-passes, gate open) |
| 5c433dbe299485448a44094cc1df78ac / Exit | open | Strategy / Fitness > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Plays] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Society; Awareness] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Plays] -> Character/Character/Self; Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self | Rimbal Supporters' Club 19 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 19 (immediate-if-gate-passes, gate open) |
| 01d9a02d8d9af946b68787635b97ce5e / Exit | OR Existence/Prerequisite, Existence/Ability [Background; Heritage: Merilien] Equals Existence/Prerequisite, Existence/Character; Numeric/Prerequisites, Numeric/Skill Level [Language; Merilien] GreaterThanOrEqualTo 3 | no roll | Expand 1 Expand/Expand Subject/Skill Level [Befriend; Listen] -> Character/Character/Self (reward > 0) | none | Rimbal Supporters' Club 19 (immediate-if-gate-passes, gate open) | stop |

## Rimbal Supporters' Club 19

ID `b63f3d52a4795941a6d7fca1c2a4cf0c`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 505351a2ba1d0d498c58cc250b30c3a6 / Exit | open | Minetan Swagger / Fitness > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Bully; Rallying] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Plays] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Plays] -> Character/Character/Self; Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self | Rimbal Supporters' Club 20 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 20 (immediate-if-gate-passes, gate open) |
| 7f50f500a9d32b49909019f77d20ed9d / Exit | open | Brute Strength / Fitness > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Endurance] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Positions] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Endurance] -> Character/Character/Self; Expand -1 Expand/Expand Subject/Vitality -> Character/Character/Self | Rimbal Supporters' Club 20 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 20 (immediate-if-gate-passes, gate open) |
| ab500d38afbab140b776d6659195a40d / Exit | open | Incantation Spells / Fitness > 15 (Type4) | Expand 1 Expand/Expand Subject/Skill Level [Enspell; Concentration] -> Character/Character/Self (reward > 0); Expand 1 Expand/Expand Subject/Skill Level [Rimbal; Rimbal Plays] -> Character/Character/Self (reward > 0) | Expand 1 Expand/Expand Subject/Stress -> Character/Character/Self; Expand 1 Expand/Expand Subject/Skill Step [Raid; Pure Luck] -> Character/Character/Self | Rimbal Supporters' Club 20 (immediate-if-gate-passes, gate open) | Rimbal Supporters' Club 20 (immediate-if-gate-passes, gate open) |

## Rimbal Supporters' Club 20

ID `d72b22be1fe05b48a68e64232a78064f`. Entry: open.

| Choice ID / kind | Gate | Check | Success effects | Failure effects | Success next | Failure next |
|---|---|---|---|---|---|---|
| 7468a0847e0b0542b9ad56dbfccd356e / Exit | open | no roll | Expand 1 Expand/Expand Subject/Attribute -> Character/Character/Self (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Zorzi Galea] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Magsa Nembo] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Godina; Luti Jaconelli] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Self [Durand; Tulia Faspalla] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Durand; Magsa Nembo; Godina; Luti Jaconelli] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Durand; Magsa Nembo; Durand; Tulia Faspalla] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Durand; Magsa Nembo; Godina; Zorzi Galea] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Durand; Tulia Faspalla; Godina; Luti Jaconelli] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Durand; Tulia Faspalla; Godina; Zorzi Galea] (reward > 0); Expand 2 Expand/Expand Subject/Relationship -> Relationship/Character/Selection [Godina; Luti Jaconelli; Godina; Zorzi Galea] (reward > 0) | none | stop | stop |

## Evidence

Prior extract: `ContentModel/SelectionItem.cs`, `Storage.SelectionTree.Xml.Skill.tree.xml` nodes 250004–250006, `Academagia.Resolving/SelectionItemHelper.cs`, `PrerequisiteNumericChecker.GetSkillValue`, `PrerequisiteDateChecker.Check`, `StorySystem.ApplyBenefits`, `GetImmediateStories`, `FillContinuance`; Summer modified/new Adventure, Exit, Investigation, Benefit, Effect, Prerequisite, SelectionItem records. Parent and child selections consume the GUIDs in path order. Club narrative was read locally and is not copied here.
