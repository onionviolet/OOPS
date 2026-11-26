# Atlas people detail

| Preflight | Scope |
| --- | --- |
| Reading and authority | Extend the existing source-linked Atlas people records with the reader's wants, reactions, routine end and relationship basis. This is evidence display, not a new gameplay decision. |
| Fit | The PEOPLE and PERSON_14 schemas in `scripts/lead_run/batch_lib.mjs`; the existing per-person digest fold and `inspectReaderPerson` record. |
| Player sentence and voice | Existing voice sample: "No relationships linked yet." New empty state: "No wants recorded in the collected people rows." |
| Mechanism and ring | Project bounded whitelisted summaries from collected rows, preserve evidence labels/locators and render them in the existing person record. No saved state, gameplay commands, raw source or knowledge prose added. |
| Screen | Developer Atlas at 1920x1080. Wants and aims and Reactions follow Ties. Routine end and tie basis stay beside their existing facts. The inspector scrolls through the same person record. Mobile outside scope. |
| Rules | AD34, AD36; AR3, AR8; UR70-UR75, UR100-UR127, UR158; PRS4, PRS9. [UI rules](../UI_RULES.md), [architecture](../ARCHITECTURE_RULES.md). |
| Failure and checks | A sealed reaction or a private row must not expose details. Unmatched IDs stay plain and labelled. Older digests show missing-data text, not invented goals or reaction outcomes. Preserve distinct inference/source evidence. |
| Files | New people projection/DOM modules and focused test; named people-loop, person-record, static route and person-fixture/assertion hunks. Preserve concurrent scene/range/reading work. |

## Receipt

| Check | Result |
| --- | --- |
| Schema fit | `wants[]`, `reacts.to/response/class/by/responseClass`, `routine.until`, and `relations.basis` supported by the existing schema. No separate person `needs` field exists; none invented. |
| Focused | `node --test tests/atlas_people_details.test.js tests/atlas_reader_findings.test.js`: 21 passed. Checks deduplication, separate evidence, new fields, sealed/private omissions, matched/unmatched references and absent older fields. |
| Build | The ordinary Atlas build passed over synthetic canonical batch files. No new reading or private source availability claimed. |
| Desktop | `node prototypes/world-atlas/prove-records.mjs` includes person-only fixture/assertion additions. The lane build passed; its parallel browser run stalled and was stopped with its descendants. The coordinator owns the combined desktop proof. UI acceptance remains open until that proof passes. |
| Change surface | Two new Atlas modules and one focused test. No runtime owners or game saves changed. |
| Not covered | Private collected reader files are absent in this checkout. The synthetic file route proves display and evidence handling, not new source coverage. |

Scratch: `C:/Users/wayba/AppData/Local/Temp/atlas-records-Mpc8Mx` retained. Automatic approval review rejected its exact-path cleanup command with "blocked by policy". No alternate deletion route attempted.
