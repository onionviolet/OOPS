<!-- machine-drafted by qwen3.8:27b, 2026-10-20T04:57:33.964Z, 38s, 639 tokens; unreviewed brainstorm, not accepted direction -->
# dlg-verify: Dialogue: voice, knowledge-aware lines, barks, rumor, reactions, refusal, return visits / linters, soak tests, fixtures and scenarios that would catch defects early

1. Knowledge-aware line validation
   The system lacks a check to ensure characters only speak about events they have witnessed or been told about.
   A builder should write a test that hides a secret event from NPC A and verifies they do not reference it in dialogue.
   Effort: M

2. Rumor propagation linter
   There is no tool to detect when rumors spread faster than the in-game travel speed allows.
   A builder should create a fixture where a rumor appears in two distant towns simultaneously and flag it as an error.
   Effort: M

3. Refusal state machine coverage
   The refusal logic may allow players to bypass consequences by repeatedly trying to persuade a character.
   A builder should run a soak test that attempts ten consecutive refusal overrides and checks for state corruption.
   Effort: S

4. Return visit memory integrity
   Characters might forget previous interactions when a player returns after a long time gap.
   A builder should save a game, load it after a simulated week, and verify the NPC remembers the last topic.
   Effort: S

5. Bark timing conflicts
   Random barks might overlap with important quest dialogue or cutscenes.
   A builder should inject a high-priority event during a low-priority bark and check if the bark is cancelled.
   Effort: S

6. Voice variant consistency
   Characters may switch between different voice tones within a single scene without cause.
   A builder should log all voice tags for a scene and ensure they match the character's current emotional state.
   Effort: M

7. Knowledge gap fixtures
   Tests may miss cases where an NPC knows too much about the player's internal stats.
   A builder should create a scenario where the player hides their level and check if the NPC reacts to it.
   Effort: S

8. Reaction latency benchmarks
   System reactions might feel instant, breaking the illusion of a living world.
   A builder should measure the time between an action and a reaction and enforce a minimum delay.
   Effort: L

9. Rumor decay validation
   Old rumors might persist indefinitely, cluttering the dialogue pool.
   A builder should write a test that checks if a rumor disappears after a set number of days without reinforcement.
   Effort: S

10. Dialogue tree cycle detection
    Branching dialogue might create infinite loops that prevent scene resolution.
    A builder should run a graph analysis on all dialogue trees to ensure every path ends in a terminal node.
    Effort: M

11. Interruption recovery tests
    Scenes might fail to resume correctly if the player interrupts an NPC mid-sentence.
    A builder should simulate an interruption at various points and verify the scene state is restored properly.
    Effort: L

12. Authoritative consequence checks
    Multiple systems might try to apply the same consequence for a single dialogue choice.
    A builder should audit the code to ensure only one system writes to the consequence log for each event.
    Effort: M
