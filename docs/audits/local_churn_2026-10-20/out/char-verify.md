<!-- machine-drafted by qwen3.8:27b, 2026-10-20T05:03:48.355Z, 32s, 579 tokens; unreviewed brainstorm, not accepted direction -->
# char-verify: Characters: named cast, crowds, rivals, companions, their state over time / linters, soak tests, fixtures and scenarios that would catch defects early

1. State Transition Linter
A static analyzer to flag illegal character state changes is missing, which could let companions enter invalid states like being both dead and active. A builder would write a test suite that forces these transitions and verifies the linter blocks them. M

2. Soak Test for NPC Drift
Long running simulations to check for memory leaks or logic errors in autonomous NPCs are absent, risking slow performance degradation over weeks. A builder would run a 72 hour simulation and compare memory usage against a baseline. L

3. Fixture Library for Rivalries
Standardized data sets for rival character interactions are missing, making it hard to test edge cases in competition logic. A builder would create JSON files that define specific rivalry scenarios and load them in unit tests. M

4. Companion Inventory Desync Check
A check for mismatches between saved companion inventories and game state is missing, potentially causing item duplication or loss. A builder would write a script that loads a save and validates all inventory counts against the source of truth. M

5. Crowd Density Stress Test
Performance metrics for high NPC density areas are under considered, which may cause frame drops in busy towns. A builder would spawn maximum allowed NPCs and measure frame time stability. L

6. Relationship Decay Validator
A tool to verify that relationship scores decay correctly over time is missing, which could break long term narrative arcs. A builder would advance the game clock by in game years and assert expected score changes. S

7. Cross World Companion Isolation
Tests to ensure companion states do not bleed across different worlds are missing, which could confuse players. A builder would switch worlds and verify that companion statuses reset or persist as intended. M

8. Save Schema Migration Test
Automated tests for save file version upgrades are missing, which could corrupt old saves when new features are added. A builder would load legacy save files and run the migration script before validating data. M

9. AI Decision Audit Log
A logging mechanism to capture why an NPC made a specific choice is missing, making debugging difficult. A builder would implement a debug flag that records decision tree paths for inspection. S

10. Title and Trait Conflict Checker
A linter for conflicting character titles or traits is missing, which could result in contradictory character behavior. A builder would define a set of mutually exclusive traits and test the validation logic. S

11. Offline Time Jump Integration
Scenarios for processing large time jumps while offline are under tested, which could skip important event triggers. A builder would simulate a 30 day offline period and verify all pending events fire correctly. M

12. Named Cast Uniqueness Check
A database constraint to prevent duplicate character IDs is missing, which could cause entity overwriting. A builder would attempt to create two characters with the same ID and expect an error. S
