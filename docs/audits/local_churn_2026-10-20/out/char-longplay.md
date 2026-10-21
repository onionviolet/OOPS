<!-- machine-drafted by qwen3.8:27b, 2026-10-20T05:01:59.017Z, 34s, 624 tokens; unreviewed brainstorm, not accepted direction -->
# char-longplay: Characters: named cast, crowds, rivals, companions, their state over time / what breaks, repeats or goes stale after ten hours or ten idle in-game years

1. Companion attrition and grief mechanics
The docs outline party dynamics but lack a system for how players cope when a named companion dies or leaves permanently. A builder should check if the UI supports a memorial or tombstone view that persists after the character is gone. Effort: M

2. Crowd density scaling
Crowds are mentioned as a concept but not tied to a specific performance budget or visual fidelity level. A builder should verify that crowd density can be reduced on lower-end hardware without breaking narrative cues. Effort: S

3. Rival rivalry decay
Rivals are defined but there is no rule for how their hostility or relevance changes over long periods of inactivity. A builder should test if a rival forgotten for ten years retains their specific personality traits or resets to a generic state. Effort: M

4. Companion personality drift
Companions evolve through interactions, but there is no cap on how much their core traits can change over years of play. A builder should measure if a companion becomes unrecognizable after five in-game years of frequent interaction. Effort: L

5. Named NPC memory overload
The system tracks relationships but does not limit how many named NPCs can hold unique memory states. A builder should check if save file size grows unmanageably when hundreds of NPCs have detailed histories. Effort: M

6. Idle companion behavior
When the player is away, companions may idle in ways that conflict with their personality or role. A builder should observe if a cautious companion takes excessive risks while the player is offline. Effort: S

7. Rival reentry logic
It is unclear how a rival who has been defeated or ignored reappears in the story later. A builder should verify if defeated rivals return with new motivations or simply reset to their original state. Effort: M

8. Companion inventory sync
The docs discuss inventory surfaces but not how companion items sync with the main player's storage during long sessions. A builder should test if items disappear or duplicate when companions join and leave parties repeatedly. Effort: S

9. Crowd interaction depth
Crowds are likely static or simple agents, but they may need to react to major world events. A builder should check if crowd behavior changes when a rival or companion becomes famous or infamous. Effort: L

10. Character state inheritance
The chronicle section mentions inheritance but not how character states pass to new generations or successors. A builder should verify if a character's reputation or skills transfer correctly to their child or successor. Effort: M

11. Rival alliance shifts
Rivals may become allies or vice versa, but the trigger for this change is not defined. A builder should test if a rival can switch sides mid-combat or only during specific story beats. Effort: S

12. Companion morale decay
Companions may lose morale over time if their goals are not met, but there is no mechanic for this. A builder should check if companions leave or refuse quests if their personal goals are ignored for too long. Effort: M
