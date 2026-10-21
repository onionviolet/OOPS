<!-- machine-drafted by qwen3.8:27b, 2026-10-20T05:05:41.897Z, 42s, 746 tokens; unreviewed brainstorm, not accepted direction -->
# dlg-volume: Dialogue: voice, knowledge-aware lines, barks, rumor, reactions, refusal, return visits / how much content must exist, who writes it, and what it costs per world

1. **Voice Differentiation Budget**
The docs mention voices but do not specify how much unique text is required to make characters sound distinct across multiple worlds.
A builder should create a checklist that flags if two NPCs in the same world share more than fifty percent of their sentence structures or vocabulary.
Effort M

2. **Knowledge State Tracking**
The system needs to track what a character knows to generate context-aware lines, but the storage cost for this state is undefined.
A builder should prototype a database entry that records a character's known facts and measure the disk space and load time impact per world.
Effort L

3. **Bark Frequency Tuning**
Ambient sounds or short comments might play too often and become annoying or too rarely and feel dead.
A builder should set a default frequency dial and adjust it based on user feedback logs to find the sweet spot between presence and intrusion.
Effort S

4. **Rumor Propagation Logic**
Rumors travel through observers, but the rules for how fast and how far they spread are not detailed.
A builder should simulate a rumor spreading across a small map and verify if it reaches distant nodes within a reasonable time frame.
Effort M

5. **Reaction Variety Depth**
Reactions to player actions might feel repetitive if there are not enough unique responses per event type.
A builder should count the number of unique reaction lines for each major event category and ensure they exceed a minimum threshold to avoid fatigue.
Effort M

6. **Refusal Consequence Handling**
When a character refuses a request, the system must handle the outcome without breaking the flow, but this path is under-specified.
A builder should test a refusal scenario to ensure the game does not crash and the player receives a clear, non-punitive exit from the conversation.
Effort S

7. **Return Visit Memory**
Characters should remember past interactions during return visits, but the scope of this memory is not defined.
A builder should implement a basic memory tag system and verify that a character references a previous meeting when the player returns after a set time.
Effort M

8. **Writer Workload Distribution**
It is unclear how the writing burden is shared between core developers and community contributors for new worlds.
A builder should define a template for dialogue writing and estimate the hours needed to fill a standard world with baseline interactions.
Effort L

9. **Idle Dialogue Automation**
The idle aspect of the game might require automatic dialogue generation to keep the world feeling alive without player input.
A builder should create a script that triggers random low-stakes interactions and monitor if it distracts from the main gameplay loop.
Effort M

10. **Cultural Context Accuracy**
Dialogue must fit the specific setting of the book or game source, which requires careful curation to avoid anachronisms.
A builder should review a sample of dialogue against the source material's tone and era to check for consistency and respect for the original setting.
Effort L

11. **Language Barrier Handling**
If a world involves non-standard languages, the system needs a default way to handle understanding or lack thereof.
A builder should implement a translation toggle and test if the player can still progress when the language barrier is active.
Effort S

12. **Cost of Custom Scenarios**
Creating unique dialogue paths for specific player choices can become expensive in terms of content volume.
A builder should limit the number of branching dialogue options per scene and verify that the resulting content volume remains manageable for future updates.
Effort M
