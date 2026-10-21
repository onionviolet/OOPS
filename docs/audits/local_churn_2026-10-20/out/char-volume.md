<!-- machine-drafted by qwen3.8:27b, 2026-10-20T05:01:24.847Z, 39s, 757 tokens; unreviewed brainstorm, not accepted direction -->
# char-volume: Characters: named cast, crowds, rivals, companions, their state over time / how much content must exist, who writes it, and what it costs per world

1. **Narrative Scalability Ceiling**
The current docs outline structure for companions but do not define a hard limit on how many unique named characters a single world can support before content creation becomes unmanageable.
A builder should run a stress test by attempting to script interactions for fifty unique NPCs in one world and measuring the time required.
Effort: M

2. **Crowd Behavior Definition**
The documents discuss individual rivals and companions but lack clear rules for how anonymous crowds react to player actions or environmental changes.
A builder should prototype a market scene where crowd density and noise levels shift based on the player's reputation to test readability.
Effort: M

3. **Rival Dynamic Scope**
It is unclear how deep rivalries can go before they require bespoke writing that exceeds the budget for standard content generation.
A builder should create a rivalry arc for three distinct enemies and review the word count against the standard character template.
Effort: S

4. **Companion State Decay**
The design mentions state over time but does not specify how companion health, morale, or trust degrade when the player is inactive or offline.
A builder should implement a decay function and observe if companions become unusable after a standard week of no play.
Effort: M

5. **World-Specific Character Limits**
There is no defined cost model that links the number of active characters to the computational or storage cost of a specific world.
A builder should map character data size against world save file size to find the breaking point for mobile or low-end devices.
Effort: L

6. **Dynamic Name Generation**
The system may struggle to generate unique and meaningful names for procedurally created crowds without resorting to generic placeholders.
A builder should audit the name generator output for ten different worlds to check for repetition or cultural mismatch.
Effort: S

7. **Rival Escalation Logic**
It is unclear how rivals adapt their behavior after repeated defeats without becoming either too easy or impossible to face.
A builder should simulate a series of losses against a single rival to verify that the threat level adjusts logically.
Effort: M

8. **Companion Inventory Sharing**
The docs propose an inventory interface but do not clarify if companions can use items independently or if all items must be managed by the player.
A builder should test a scenario where a companion needs a specific potion and check if the UI allows autonomous use.
Effort: S

9. **Cross-World Character Persistence**
There is no clear rule for whether a companion from one book world can travel to another world or remain locked to their origin.
A builder should draft a policy for character transfer and test it with a sample party moving between two distinct settings.
Effort: L

10. **Memory Compression for Old Cast**
As the player progresses, the game may accumulate too many old character records that slow down load times.
A builder should implement an archival system for inactive characters and measure the reduction in save file size.
Effort: M

11. **Legal Rights for Adapted Cast**
Using characters from existing games or books may create legal issues that are not addressed in the technical design.
A builder should consult a legal checklist to verify which source material characters are safe to include in a commercial release.
Effort: L

12. **Player-Driven Character Creation**
The docs focus on pre-made cast but do not offer a way for players to create their own named characters or companions.
A builder should prototype a simple character creator and test if players can make a companion that fits into existing world logic.
Effort: L
