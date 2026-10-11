# Sheltered nursery leaf delivery

The new tray keeps one mark on the character's home: a player-owned working site beneath the existing Shack roof. Construction pays two Rough wood logs, two coins, one stamina and four played minutes. Each later explicit round spends both a Cooking herbs bundle and Tree sap, plus one stamina and five played minutes, then creates two ordinary native Cooking herbs bundles. The tray contains no free starter crop. No Eda meeting or Nell plot is required.

The source observation comes from ONI-F17/F18/F19. Six exact retained files, E28–E32 plus E06, were re-read and their hashes match the dossier. [Source selection](SOURCE_SELECTION.json) separates observed support/input/output semantics from original botanical fiction, costs and compressed timing. No recovered source code or prose is copied into the implementation.

## Integration contract

| Leaf | Root join |
| --- | --- |
| `steam_oni_content.js` | `steamONIDefinitions` includes three commands, one unprovisioned site and one player-only single-phase plan situation. Native item keys already exist; no item registration is needed. Group/type `steam_oni`, namespace `steam.oni.`. |
| `steam_oni_facts.js` | Merge `steamONIFacts(state, context, registry)` into the current facts; call `validateSteamONIState(state, registry)` through the optional envelope validator. |
| `steam_oni_host.js` | Join `steamONIContext`, `commitSteamONICommand` and `steamONIPresentation` into the Here host. The explicit `begin` stages `enrollSimulation` only when absent, then one ordinary command; the root publishes the returned staged plan once. |
| `steam_oni_runtime.js` | Call `guardSteamONIAdmission` before reservation; `stampSteamONIAcceptedJob` after the frozen support descriptor exists and before enqueue; compose `steamONICompletionContext` before completion support evaluation. Helpers no-op for unrelated definitions. |

Pending work freezes exact current costs, effects, participant `player`, location `Shack`, five/four-minute due time, refundable support and a schema1 tray-version stamp. Optional reads do not create a site, herb, plan, body, NPC or enrollment. The single idle plan situation exists only because the unchanged simulation schema3+ validator requires a caused situation for refundable schema4 jobs. It preserves Eda-independent cold access and adds no timer or top-level domain. Existing schema5 stays5.

## Checks and remaining gates

**V1 syntax:** `node --check` passed for all four leaves.

**V2 bounded qualification:** `node docs/gm/non-factorio-absorption-2026-10-07/oni/leaf_checks.mjs` passed 14 checks. It exercises the real enrollment and instant command host, plus real shared effect/refund reducers for scheduler-shaped work. Construction creates no site before completion; successive rounds pay both new inputs; wrong habitat/body, missing/encumbered inputs, canceled/lost-support work, pending/history tampering and orphan records are covered. JSON roundtrip and current schema5 are checked. Nell's finite plot and unrelated history remain untouched.

**V3 unverified root gates:** shared scheduled ticking and native publication, current matching rebuild, fresh-origin player controls, actual native cooking consumer, save/reload and native file import. These leaf checks are not browser or whole-game parity evidence. Root owns the playable result and creative-director review remains separate.

## Root browser gate

[BROWSER.json](BROWSER.json) records exit0 on rebuilt214103c6d0b1, fresh generated pre-Eda/Shack contexts. Eight criteria passed: explicit cold plan without Eda/site/herb gift; paid build and refund; pending build reload; tending paired-input refund; two explicit cycles with new native inputs; actual travel blocks unsheltered tending; existing Goat stew consumes produced herbs and actual meat into a native meal; actual earlier pending-cycle native file import restores one harvest at the owned tray. The cooking screenshot was visually inspected. No application exceptions; one ancillary local ko-fi icon request reset is preserved separately. Generated high Cooking XP/crafting access and unlocked house isolate the consumer, not natural acquisition or balance acceptance. In-flight hand/roof loss and malformed-import browser branches remain open with bounded reducer/validator coverage.
