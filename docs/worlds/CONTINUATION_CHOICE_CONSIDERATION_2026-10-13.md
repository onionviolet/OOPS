# Fresh lives and optional succession

Status: design consideration, 2026-10-13. Proposed recommendation, not an accepted default or runtime change.

Weibao asked: "consider if heir shoudnt be the main continueation, but instead maybe another random start?"

## Current authority and implementation

[PROJECT.md](../../PROJECT.md) records suspenseful random entry, optional Frontier, and heir-only carryover as implementation state rather than a design limit. [User vision](../USER_VISION.md) records that an heir is optional and a life can end without one. [Origin composition](ORIGINS_AND_WORLD_TIMELINES.md) already supports fresh lives, generated families and source-qualified reincarnation. [The heir rule](../RULES_FROM_SCRATCH.md#the-heir) specifies what an heir receives when succession happens; it does not require every next life to be an heir.

Source inspection: `src/chronicle_ui.js` presents the begin-heir action; `src/main.js` handles its saved request; `src/life_experience_host.js` builds a fresh envelope with inherited leftovers and a heir chronicle. This establishes the current code route, not browser verification of continuation or random entry.

## Recommendation

- **P1: Fresh random life as the usual next run.** Select a coherent authored world/era/body/household/situation from eligible starts. Randomness introduces new opportunities and circumstances, rather than merely resetting equipment. The first meaningful actions must support the selected start; infancy or unusual bodies require actual play, not a long forced wait. No promised equal difficulty or safe outcome.
- **P2: Succession as a meaningful available alternative.** Offer an actual child, apprentice or other supported successor when that relationship and access exist. Retain established inheritance semantics and local claims. Family play should be valuable when desired, without making family creation a compulsory preparation for every next run.
- **P3: Separate the next protagonist from what persists.** A fresh protagonist need not reset an enduring world, and need not receive the prior protagonist's property, skills or memories. Same-world aftermath persists only to the extent represented and supported; another era or continuity is explicit. Cross-life gains require their actual carriers. An old life can leave people, records or projects behind that a later stranger might encounter without owning them automatically.

This fits variety across the intended worlds better than mandatory dynasty play. Its main cost is a weaker immediate attachment to one household and the risk of repetitive early chores. Distinct opening situations, shorter repeated introductions and a reachable succession option address that cost. Do not substitute automatic account-wide stat inflation for meaningful differences between lives.

## Implementation boundary

Do not force an ending to create variety: retirement, ordinary survival, recovery, same-life travel, true death and rebirth are separate outcomes. Rebirth or retained memory requires a supported premise. Random entry by itself is not proof of reincarnation.

Before a future implementation: select the eligible start pool and timeline policy; specify probabilities, reroll/fallback and exact retention; preserve the ended life and private saves; freeze selection across save/reload/import; qualify functioning initial interactions. Follow [random-start requirements](../WORLD_COMPLETION_STANDARD.md#random-starting-points-without-spoiling-discovery). Existing heir saves keep their meaning. No runtime edits, build, tests or browser acceptance were performed for this consideration.

## Same-world, timeline and enemy starts: follow-up consideration

Weibao asked about same-world options, time-travel gates, another person in the same timeline, and reincarnating or starting as an enemy. These are requested considerations, not an accepted selection policy. [Origin/timeline owner](ORIGINS_AND_WORLD_TIMELINES.md), [continuity owner](LORE_AND_CONTINUITY.md), [identity catalogue](../RIVALS_IDENTITIES_AND_FATE.md) and [enemy protagonists](../ENEMY_PROTAGONISTS.md) supply existing related design.

**P4: Choosing a perspective does not require an in-world time-travel power.** Selecting an earlier-era campaign or playing another existing person is an author/player start choice. A character moving their body, memories, cargo or effects into the past does need a real world-supported route, system or explicit branch premise. The same distinction applies to another world: a fresh campaign can start there without portal ownership; an existing character carrying themselves there needs a passage. A deliberately available meta mode can supply an outside cause rather than masquerading as ordinary local physics.

| Code | Start/continuation | History and identity consequence |
|---|---|---|
| C1 | Another person, same world and present moment | Shared established consequences stay. The previous character may be alive and independently pursuing supported activities. This is a perspective handoff, not death, inheritance or soul transfer. Switching cannot double-book bodies, duplicate stock or arbitrarily change allegiance. |
| C2 | Another person later in the same history | Prior consequences remain to the supported extent. Time passed must have a declared represented outcome; it is not permission for invented offline growth or loss. Earlier commitments, ages and ownership need reconciliation. |
| C3 | Another person at an earlier checkpoint | Offer a separate branch/replay, preserving the existing history, unless an actual regression/time-travel mechanism changes that history. Decide whether any prior perspective's memories cross. |
| C4 | Similar world, different continuity | A counterpart has its own actual history and holdings. Same face/name does not establish shared experiences, remembered friendship, earned power or ownership. |
| C5 | Soul reborn after death | Actual retained soul/memory faculties and new body are specified. Being born as a baby occurs at a coherent birth date. Becoming an already living adult needs possession/replacement/merger or another supported explanation. |

**P5: Enemy origins should be several mechanically different scenarios.** A hostile actor is a person with their own relationships, knowledge and aims; hostility is not their entire identity.

| Code | Enemy-related option | Subtle consequences |
|---|---|---|
| E1 | Play the existing enemy as themselves | Their own mind, body, trained methods and history remain. The player can choose new behavior, but the character does not automatically learn the former character's secrets. Their family and allies have concrete expectations. |
| E2 | Your soul enters the enemy's body | Determine whether the original occupant survives, resists, shares control or is absent. Body functions, host memories, soul-bound sources and actual control are separate. Contacts may recognize the body while noticing changed habits. Equipment, pacts and offices need actual access/recognition, not a universal transfer. |
| E3 | Reborn as the enemy's child or descendant | A new person can inherit a family feud, stigma, support or expectations without sharing the parent's guilt or skills. The former life's allies may distrust this household without recognizing the reincarnated soul. |
| E4 | Start as the enemy before the feud | Branch from a supported earlier state. Neither enmity nor future crimes are inevitable. Remembered future events are leads conditional on the retained-memory premise; changed causes can invalidate them. |
| E5 | Enemy counterpart in a parallel branch | Similar potential can produce another person with different loyalties. Prior-run recognition is a player observation unless the character has a means to establish it. |

### Small details that make these starts convincing

- **S1: Preserve causality across perspectives.** Starting as an enemy in the same present inherits actual injuries, expenditures and losses from the prior encounter. Do not respawn their unique weapon, erase a defeated condition, or overwrite inconvenient history to make the origin stronger. A dead enemy needs an earlier branch or an actual supported return route.
- **S2: Keep knowledge and recognition specific.** Remembered enemy rumors can be false; host memories can be incomplete; observed habits can expose an impostor without giving witnesses supernatural certainty. Learning the enemy's perspective can reveal new information through actual records, conversations or memories, without presenting all secrets at origin selection.
- **S3: Keep both sides alive as people.** The former character does not automatically become hostile, omniscient or a scripted boss when control moves. Relationships, willingness and objectives follow actual history. A perspective change is not universal authority over all actors or a shortcut around their refusal.
- **S4: Distinguish expertise from execution.** Playing the enemy themselves can retain their real acquired mastery; possessing their body need not transfer it. Bodily capacities may remain, while soul sources, equipment cooperation, fuel and ability to perform a method each have their own rules. Avoid automatic full-power transfer and arbitrary full-power erasure.
- **S5: Make discovery earned.** Recognizing one's old home, finding a prior journal, meeting a former ally or realizing whose body this is can become playable discoveries. A mysterious origin should reveal usable sensations and actions, not spoil the identity or sealed truths in its selection label.

Recommended first authored comparison: a single local incident offers a fresh stranger and an existing rival as two distinct starts in an isolated branch. Compare initial access, goals, known facts and reactions without claiming a general autonomous multi-character simulation. Later runtime work needs exact world-instance/time identity, actor/controller/body/memory ownership, selection stability and compatibility; this document implements none of them.
