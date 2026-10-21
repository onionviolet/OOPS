<!-- machine-drafted by qwen3.8:27b, 2026-10-20T05:08:38.119Z, 66s, 617 tokens; unreviewed brainstorm, not accepted direction -->
# dlg-fidelity: Dialogue: voice, knowledge-aware lines, barks, rumor, reactions, refusal, return visits / source fidelity, original-content boundaries, sealed secrets and attribution

1. Source voice calibration
The docs lack a clear method for matching the tone of original characters without infringing on copyright or distorting the source material. A builder would test by comparing generated lines against approved style guides for three distinct source types. Effort M.

2. Knowledge boundary enforcement
There is no defined limit on what characters know based on their current story position or canon status. A builder would check by querying a character about future events and verifying the refusal mechanism triggers correctly. Effort S.

3. Rumor propagation rules
The system does not specify how rumors change as they pass through different NPCs or over time. A builder would trace a single rumor across five interactions to see if it degrades or mutates as intended. Effort L.

4. Refusal logic consistency
The design lacks a unified standard for when characters must refuse requests versus when they can negotiate or ignore. A builder would audit fifty refusal cases to ensure the logic matches the character's established personality. Effort M.

5. Attribution for original content
There is no tag or metadata to distinguish between adapted source lines and entirely original dialogue. A builder would filter the dialogue database to verify that all original lines are clearly marked for review. Effort S.

6. Sealed secret protection
The docs do not describe how to prevent NPCs from revealing plot twists or secrets before the player reaches the right point. A builder would simulate a sequence where the player tries to extract secret info early and confirm the NPC blocks it. Effort M.

7. Return visit memory
The system lacks a clear way to track how NPCs remember previous conversations to adjust their future lines. A builder would check by talking to an NPC, leaving, and returning to see if the dialogue reflects the prior interaction. Effort L.

8. Reaction variance control
There is no parameter to control how much an NPC's reaction changes based on player choices or mood. A builder would run a stress test to ensure reactions feel dynamic but not random or inconsistent. Effort M.

9. Bark frequency limits
The design does not define limits on how often ambient lines or barks can trigger to avoid spam. A builder would monitor a long idle session to ensure barks do not overwhelm the text log. Effort S.

10. Original character fidelity
There is no check for whether original characters feel consistent with the world they inhabit or the source material they are based on. A builder would use a blind test where users rate character consistency against source descriptions. Effort L.

11. Dialogue branching depth
The docs do not specify how deep dialogue trees can go before they become unmanageable or break immersion. A builder would map the deepest branch and verify it resolves cleanly without dead ends. Effort M.

12. Cultural context awareness
The system lacks a way to adjust dialogue for cultural or historical accuracy within the source world. A builder would audit a sample of lines for anachronisms or cultural mismatches relative to the source setting. Effort L.
