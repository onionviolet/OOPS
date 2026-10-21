<!-- machine-drafted by qwen3.8:27b, 2026-10-20T04:59:45.756Z, 31s, 750 tokens; unreviewed brainstorm, not accepted direction -->
# world-verify: Implementing entire worlds end to end (everything between a source book and a playable, finished world) / linters, soak tests, fixtures and scenarios that would catch defects early

1. **Linting World Data Schema**
   Missing: A strict JSON or YAML schema validator that runs on every world data file to catch missing fields or incorrect data types before build.
   Check: Run a schema validation script against the latest world data commit and verify it flags intentional errors in a test fixture.
   Effort: M

2. **Soak Test for Idle Loops**
   Missing: An automated long-running test that simulates thousands of ticks to ensure resource counters do not overflow or cause performance degradation.
   Check: Execute a headless simulation for 10,000 turns and monitor memory usage and CPU load for anomalies.
   Effort: M

3. **Fixture for Random Start States**
   Missing: Deterministic random seed fixtures that allow developers to reproduce specific rare starting scenarios during debugging.
   Check: Create a test case using a fixed seed and verify the generated world state matches a saved snapshot exactly.
   Effort: S

4. **Dialogue Branch Coverage Linter**
   Missing: A tool that analyzes dialogue trees to flag dead ends or options that lead to no further state changes.
   Check: Parse the dialogue graph and assert that every leaf node connects to a valid game state or exit condition.
   Effort: M

5. **Lore Consistency Scenarios**
   Missing: Automated checks that compare in-game item names and descriptions against the source text to detect typos or misinterpretations.
   Check: Run a diff tool between the game string table and the extracted source data to highlight discrepancies.
   Effort: L

6. **Gate Logic Integration Tests**
   Missing: Tests that verify world completion gates only trigger when all prerequisite systems are fully implemented and stable.
   Check: Simulate a world with one missing system and confirm the gate blocks progression as expected.
   Effort: M

7. **Performance Budget Monitor**
   Missing: A continuous integration check that fails builds if the load time for a world exceeds a defined threshold.
   Check: Measure the time to load a large world asset and compare it against the performance budget limit.
   Effort: S

8. **Data Integrity Checksums**
   Missing: Hash verification for world assets to ensure no corrupted files are shipped in the final build.
   Check: Generate checksums for all world files and verify them against a manifest before packaging.
   Effort: S

9. **Interaction Coverage Matrix**
   Missing: A report that lists all possible player actions against all world objects to identify unhandled interactions.
   Check: Generate a coverage report from test runs and review gaps in the matrix for untested combinations.
   Effort: L

10. **Regression Test Suite**
    Missing: A saved set of known good world states that can be loaded and verified to prevent new bugs from breaking old features.
    Check: Load a historical snapshot and run a standard playthrough to ensure no regressions occur.
    Effort: M

11. **Error Boundary Testing**
    Missing: Tests that feed invalid or extreme data into world systems to ensure they fail gracefully without crashing.
    Check: Inject null values or negative numbers into critical systems and verify the game handles the error safely.
    Effort: M

12. **Local Churn Validation**
    Missing: A mechanism to detect when local modifications to a world break compatibility with the central world definition.
    Check: Apply a local patch and run a validation script to ensure the local changes do not violate global rules.
    Effort: L
