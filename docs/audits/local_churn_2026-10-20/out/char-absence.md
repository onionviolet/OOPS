<!-- machine-drafted by qwen3.8:27b, 2026-10-20T05:04:59.761Z, 37s, 579 tokens; unreviewed brainstorm, not accepted direction -->
# char-absence: Characters: named cast, crowds, rivals, companions, their state over time / what Weibao would notice missing after a long session, from a creative director's view

1. Long-term memory decay
The docs mention persistence but lack a mechanism for characters to forget trivial details after long idle periods. A builder should test if an NPC still references a minor quest completed three months ago. Effort M.

2. Companion emotional drift
Companions may maintain static attitudes even when the player’s actions contradict their values over time. A builder should simulate a long session where the player consistently ignores a companion’s moral stance. Effort L.

3. Rival growth asymmetry
Rivals might remain static in power while the player grows, breaking the tension of a long campaign. A builder should check if rival stats scale relative to player progress or world time. Effort M.

4. Crowd anonymity loss
Crowds may start to feel like unique individuals if they retain too much state, causing performance or narrative issues. A builder should monitor memory usage and narrative coherence when interacting with the same crowd for hours. Effort S.

5. Companion independence gaps
Companions might not take meaningful actions when the player is idle, reducing the life-sim feel. A builder should pause the game for a day and review the companion’s log for autonomous decisions. Effort M.

6. Reputation lag
Reputation changes might not reflect recent actions quickly enough, causing confusing NPC reactions. A builder should perform a high-impact action and wait for the next NPC interaction to verify consistency. Effort S.

7. Relationship stagnation
Companion bonds might fail to deepen after initial milestones, leading to flat long-term engagement. A builder should track relationship values over a simulated year of play for plateauing trends. Effort M.

8. World event impact on cast
Global events might not ripple down to individual character states, making the world feel disconnected. A builder should trigger a major world event and check if minor NPCs update their dialogue or behavior. Effort L.

9. Inventory sync errors
Companion inventories might desync with the shared party bag, causing item duplication or loss. A builder should transfer items between companions and the player during save and load cycles. Effort M.

10. Narrative context loss
Characters might lose track of the plot thread they are on after long idle periods, breaking immersion. A builder should resume a saved game after weeks and check if characters reference the current quest chain. Effort M.

11. Rival narrative relevance
Rivals might become irrelevant if their storylines do not adapt to the player’s changing priorities. A builder should switch player goals and see if rival interactions remain meaningful or become forced. Effort L.

12. Companion burnout
Companions might not reflect stress or fatigue from long expeditions, reducing realism. A builder should run a multi-day expedition and check if companion stats or dialogue reflect exhaustion. Effort M.
