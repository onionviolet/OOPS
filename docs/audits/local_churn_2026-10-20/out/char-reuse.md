<!-- machine-drafted by qwen3.8:27b, 2026-10-20T05:02:39.513Z, 40s, 730 tokens; unreviewed brainstorm, not accepted direction -->
# char-reuse: Characters: named cast, crowds, rivals, companions, their state over time / what should be shared across worlds as a grammar or kit versus authored per world

1. **Shared State Schema**
The current documents list character traits and conditions but do not define a strict data structure for how a character's state migrates between different world types. A builder should create a minimal JSON schema that tests saving a character from a high fantasy setting and loading them into a sci-fi setting without data loss. Effort M

2. **Universal Identity Tags**
There is no clear definition of which character attributes remain constant across all worlds versus which ones reset or adapt to the new setting. A builder should draft a list of core identity tags and verify that they persist through a world switch event in a prototype. Effort S

3. **Crowd Density Standards**
The docs discuss named cast and rivals but lack rules for how many generic NPCs populate a scene in different world genres. A builder should measure performance and readability by varying crowd size in a test scene to find the optimal default number. Effort M

4. **Rival Progression Logic**
Rivals are mentioned but there is no defined mechanism for how their power or relevance scales as the player moves between worlds of different difficulty. A builder should simulate a rival encounter across three distinct world types to check if the threat level feels balanced. Effort M

5. **Companion Memory Limits**
Companions have shared adventures but it is unclear how much history they remember when traveling to a new world that contradicts previous experiences. A builder should write a test case where a companion reacts to a new world using memory from a previous conflicting world. Effort L

6. **Time Dilation Effects**
The documents cover time passing but do not explain how character aging or state changes handle different time scales in various worlds. A builder should verify that a character does not age incorrectly when moving from a slow-time world to a fast-time world. Effort M

7. **Language and Communication**
There is no mention of how characters handle language barriers or cultural misunderstandings when entering a foreign world setting. A builder should implement a simple dialogue check that flags when a character does not understand the local language. Effort S

8. **Visual Consistency Rules**
Character models or avatars may clash with the art style of new worlds but there are no guidelines for visual adaptation. A builder should create a checklist for adjusting character visuals to match the aesthetic of at least two different world types. Effort M

9. **Emotional State Decay**
Character moods and relationships are tracked but it is unclear how these states degrade or reset over long periods of inactivity or travel. A builder should run a long-duration test to see if companion relationships decay too fast or too slowly. Effort S

10. **Legal Status Transfer**
Reputation and karma are discussed but it is not clear how a character's legal standing transfers when entering a world with different laws. A builder should test entering a lawless world after a high-reputation world to see if the status persists or resets. Effort M

11. **Inventory Compatibility**
Item types may be incompatible with new worlds but there is no rule for how a character handles items that do not exist in the new setting. A builder should verify that the inventory system flags or converts items that are not valid in the destination world. Effort L

12. **Narrative Agency Conflict**
When a companion has a strong independent goal that conflicts with the player's goal in a new world, the system may stall. A builder should simulate a conflict where the companion refuses to follow the player and check if the game can resolve it. Effort M
