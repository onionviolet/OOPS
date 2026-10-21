<!-- machine-drafted by qwen3.8:27b, 2026-10-20T04:58:55.292Z, 25s, 612 tokens; unreviewed brainstorm, not accepted direction -->
# world-reuse: Implementing entire worlds end to end (everything between a source book and a playable, finished world) / what should be shared across worlds as a grammar or kit versus authored per world

1. **Shared Grammar Definition**
The docs mention structure but lack a concrete list of universal data fields that every world must use, such as item weight or time zones. A builder should create a minimal schema and test it against two very different sources to see if it breaks.
Effort: M

2. **Local Override Mechanism**
It is unclear how a specific world can ignore or modify a shared rule without breaking the engine. A builder should write a test case where one world uses days and another uses lunar cycles to check for conflict.
Effort: L

3. **Source Extraction Heuristics**
The workflow lists stages but does not define how to automatically identify key entities from raw text. A builder should run an extractor on a new book and measure how many important items are missed.
Effort: L

4. **Dialogue State Machine**
The docs mention dialogue but do not specify how shared conversation trees handle world-specific variables. A builder should prototype a simple chat system that pulls from a global template but uses local data.
Effort: M

5. **Visual Asset Mapping**
There is no standard for how generic world concepts map to actual art files or sound effects. A builder should create a mapping table and verify that missing assets do not crash the game.
Effort: M

6. **Balance Validation Kit**
The completion standard mentions gates but lacks automated checks for economic or combat balance across worlds. A builder should simulate a hundred turns in two worlds and compare resource growth rates.
Effort: L

7. **Cross World Progression**
It is under considered how progress in one world affects the player in another. A builder should design a save file structure that allows carrying items between worlds and test for corruption.
Effort: L

8. **Lore Conflict Resolution**
The docs discuss conflicts but not how to handle contradictory facts from different sources in a shared kit. A builder should create a rule engine that flags contradictions and lets the player choose a canon.
Effort: M

9. **Testing Harness for Idle Mechanics**
There is no standard way to verify that idle loops do not freeze the game or drain resources. A builder should run a stress test that simulates years of gameplay in one hour.
Effort: M

10. **Accessibility Layer**
The shared grammar likely lacks support for text-to-speech or color blindness modes. A builder should audit the UI templates to ensure they meet basic accessibility standards.
Effort: S

11. **Data Migration Path**
As the kit evolves, old worlds may break when the shared grammar changes. A builder should write a migration script and test it on a sample world from a previous version.
Effort: M

12. **Performance Budgets**
The docs do not define limits on how much data a world can load at once. A builder should profile a heavy world and set a threshold for acceptable load times.
Effort: M
