<!-- machine-drafted by qwen3.8:27b, 2026-10-20T05:06:52.787Z, 33s, 637 tokens; unreviewed brainstorm, not accepted direction -->
# dlg-reuse: Dialogue: voice, knowledge-aware lines, barks, rumor, reactions, refusal, return visits / what should be shared across worlds as a grammar or kit versus authored per world

1. Shared grammar for refusal logic
The current docs describe local ownership of consequences but do not define a universal structure for why an NPC refuses a request across different worlds. A builder should test if a refusal in one world uses the same underlying tags as a refusal in another to ensure consistency. M

2. Knowledge decay and rumor spreading
The evidence travels section mentions observers but lacks a model for how rumors degrade or change over time between worlds. A builder would verify that a rumor heard in one setting does not persist unchanged in a world with strict factual consistency. L

3. Cross-world voice consistency
Voices are described as local to scenes, but there is no rule for maintaining a character's tone if they appear in multiple worlds. A builder should check if a character's speech patterns remain coherent when their knowledge state changes across different settings. M

4. Barks in idle states
The idle aspects section mentions style but does not specify how barks behave when the player is not actively engaging in a scene. A builder would audit idle time to ensure barks do not fire too frequently or contradict active dialogue. S

5. Refusal memory persistence
The lifecycle section covers consequences but not how a refused request affects future interactions with the same NPC. A builder should simulate a long-term save to see if a past refusal influences the NPC's willingness to talk later. M

6. Return visit context awareness
The availability section handles return visits but does not detail how the NPC recalls the specific context of the previous meeting. A builder would test returning to a scene to confirm the NPC references the correct past event rather than a generic greeting. L

7. Shared reaction grammar
Reactions are local to scenes, but there is no shared kit for standard emotional responses like shock or joy. A builder should compare reaction triggers across two worlds to see if they use different, incompatible systems. M

8. Knowledge-aware line filtering
The docs mention knowledge-aware lines but not how the system filters out lines the NPC should not know. A builder would inject false knowledge into a save file to see if the NPC incorrectly references it. S

9. Rumor accuracy verification
Rumors are mentioned as evidence but there is no mechanism for the player or system to verify if a rumor is true. A builder should create a scenario where a rumor is proven false and check if the system updates the NPC's belief. L

10. Interruption recovery flow
The interruption section exists but lacks a clear path for resuming a dialogue after an interruption. A builder would interrupt a conversation and verify that the dialogue state is correctly restored upon return. M

11. Refusal alternatives
The refusal logic is mentioned but there is no requirement for NPCs to offer alternatives when they refuse. A builder should check if a refusal in one world offers a different path, and if that path is reusable in other worlds. S

12. Cross-world identity mapping
The lifecycle section mentions alternative bodies but not how a character's identity is mapped across different worlds. A builder would load a save from World A into World B to see if the character is recognized as the same entity. L
