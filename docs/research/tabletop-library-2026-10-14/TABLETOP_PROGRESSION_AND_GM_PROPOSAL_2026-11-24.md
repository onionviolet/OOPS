# Tabletop progression, player choice and the game master

2026-11-24. Proposal (AD32), from a chat with Weibao about TTRPG-style progression (D&D, Cyberpunk and others) in OOPS. His answers to Q1, Q2 and Q4 are recorded in the [direction log](../../gm/USER_VISION_LOG_2026-11.md#tabletop-progression-fidelity-dice-views-and-carried-methods-2026-11-24) and [USER_VISION](../../USER_VISION.md#tabletop-progression-fidelity-dice-views-and-carried-methods-2026-11-24). Everything else here is an agent proposal. No runtime code, save or acceptance changed.

Evidence read this pass: file headers and docs only, not module tests. "Built" below means the module and its contract exist, not that it was verified in play.

## F. What already fits

| Code | Finding | Owner |
|---|---|---|
| F1 | A tabletop class or role is one more progression pack. A holder stands on a path, tracks accrue toward steps, gates open them and crossing publishes effects. LOTM sequences and Gu ranks already plug in this way. | [progression_path.js](../../../src/progression_path.js), [PROGRESSION_PATH_CONTRACT](../../PROGRESSION_PATH_CONTRACT.md), `src/progression_packs/` |
| F2 | PRG4 `table` thresholds match the D&D XP table. Multiclassing is one holder on several class paths; character level is their sum; the ability-score prerequisite is an ordinary gate. | [progression_gates.js](../../../src/progression_gates.js) |
| F3 | SRD 5.2.1 spells, monsters and conditions are already data (CC-BY-4.0), mapped onto the shared effect grammar. A Phandalin first-slice consumer exists. | `src/data/srd521/`, [spell_pack_dnd.js](../../../src/spell_pack_dnd.js), `src/dnd_phandalin.js` |
| F4 | Cyberpunk RED's skill-by-Improvement-Point growth sits close to YAIR's own skill leveling. Role rank is a path; cyberware goes through active effects; Humanity is a track that goes down. | `src/active_effects.js`, skill ladders |

## R. Gaps and risks

| Code | Gap |
|---|---|
| R1 | No class, level, proficiency-bonus or multiclass data or code; the srd521 folder has no classes file. |
| R2 | D&D level-ups are choices (subclass, ASI or feat, spell picks). Whether `crossStep` can take a player choice at a crossing is unchecked; a spike tests it first. |
| R3 | Scope: the SRD has 12 classes over 20 levels. Prove one class to level 5 headless first (combat default Q10, PC95). |
| R4 | No Cyberpunk source is in this library, and RED is not under an open license like the SRD as far as known. Paraphrase mechanics; ship no text. |
| R5 | "Knowing where to act" is the top UI weakness ([UI play review](../../audits/UI_PLAY_REVIEW_2026-11-23.md)). Level-up and reaction prompts must land in Focus, not Reports. A character sheet should be a registered `progression_forms` kind, not another one-off panel ([UI grammar inventory](../../audits/UI_GRAMMAR_INVENTORY_2026-11-24.md)). |

## P. Player choice

Built on the [combat working defaults](../../audits/COMBAT_DEFAULTS_FOR_DECISION_2026-11-13.md) Q1, Q4, Q6 and Q7.

| Code | Proposal |
|---|---|
| P1 | Sort every borrowed procedure into one bucket: engine-resolved, authored, bounded generation, or player-decided ([conversion audit N4](conversion-landscape/REPORT.md#useful-negative-findings-and-interactions)). By default only the last needs new UI. |
| P2 | A level-up is a "something new" pause in Focus. A build plan written once makes routine picks; the ask-first list still stops for chosen picks. |
| P3 | Combat turns: action, bonus action and reaction become Q6 intents; routine fights stay at zero clicks. |
| P4 | Skill checks and roleplay use authored alternatives over free adjudication (Torment lesson, conversion audit F2). |
| P5 | Rests and spell slots use activity time and ACR compression, not a new system. |

## Q. Quick-time events

A quick-time event (QTE) is an on-screen timed prompt ("press X now") where missing the timing changes the outcome. The repo has no QTE design. The presentation rules separate simulation time, a supported reaction window, a cosmetic clock and real time, and a replay cannot change a settled result ([PRESENTATION_AND_FOURTH_WALL](../../PRESENTATION_AND_FOURTH_WALL.md)).

| Code | Option | Disposition |
|---|---|---|
| QT1 | Reaction windows in game time: the world pauses and asks (Shield, Counterspell, opportunity attacks, initiative). | Recommended |
| QT2 | The character's speed sizes the window in game time, not the player's hand speed; reflex cyberware visibly widens it. | Recommended with QT1 |
| QT3 | Real-time QTEs as an opt-in dial for warned, weighty fights only. | Not recommended: idle play, a sole player, stable-target and plain-access rules |

## G. The game master

The [October GM analysis](../../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md#part-2-do-we-need-a-game-master) splits a tabletop GM into seven jobs. Current owners:

| Code | Job | Owner | State seen this pass |
|---|---|---|---|
| GM1 | Adjudicate rules | Resolvers, rulings ledger | Per-domain resolvers; D&D rulings provisional |
| GM2 | Pacing | [story_director.js](../../../src/story_director.js) | Built: surfaces events something else caused; invents no cause |
| GM3 | Improvise people and places | Generators, tag decks, `premise_generator.js` | Partly built |
| GM4 | Play the world offscreen | `agency.js`, `world_events.js` | Built v0: actors act from wants; dated events run without the lead |
| GM5 | Continuity | Saves, histories, `story_recognizer.js` | Built in part; stories are found in what happened |
| GM6 | Narrate | `fight_text.js`, text grammar | Terse register built; authored lines need voice samples |
| GM7 | Interpret freeform intent | None complete | The open constraint |

**The constraint.** Two things stay hard: GM7, and the amount of content. Events come from three sources, cheapest first:

1. **Systems cause events.** Actors with wants, faction turns and the calendar produce events from rules written once.
2. **Generators with tag decks** fill what the source leaves unstated.
3. **Authored content** covers canon beats. Claude and Codex already act as the authoring GM at development time through the GM prompts in `docs/gm/`.

For GM7 the options on file stay compatible: authored verbs per place, Ironsworn-style generic moves with a "pay the price" table, and local AI only as a suggester that maps typed intent to a move. The engine resolves and saves, and play works with the model absent.

## Next step, if picked

A headless spike: one D&D class to level 5 as a `progression_path` pack, testing a level-up choice at a crossing (R2), with save and reload of the position record.
