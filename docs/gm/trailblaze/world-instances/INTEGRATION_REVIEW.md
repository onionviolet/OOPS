# Glasshouse integration source review

Reviewed 2026-10-04. This source-only review applies to the inspected hashes below. The Engine integration lane is active, so later edits may change the findings.

| File | Inspected SHA256 |
|---|---|
| `src/pocket_realm_host.js` | `06b31ac0ac0cd6c084bb8a3c9bf4add0e81d262652a97553836f86c7470d8ff9` |
| `src/realm_state.js` | `5a2eb8ff8a9343c8d9fd7f9c3fd754fad345504329280e12bce798b37c5aa364` |
| `src/realm_connections.js` | `32f964f8533735b58f16cb00c55f1c0d3acfbe01f21ca2fc77643328f19405de` |
| `src/native_realm_traveler.js` | `10211b786234115a35e78ebb67f0fa5cfde45d4ae95b1bd347a2c0feb4815300` |
| `src/world_instances.js` | `bd2528e30575f98700a061353652b5275435ea5d277aab74ff1de2fbf916bb4c` |
| `src/pocket_realm_content.js` | `38711055eac43d19905642ce1d2a45beff04740dffd66d72700c8f23b4580243` |

Concrete policy mismatch: the Glasshouse content contract says loans may cross with owner permission (`pocket_realm_content.js:205-210`), and the shared passage planner supports an authorized connection ID on borrowed cargo (`realm_connections.js:87-90`). The native host always supplies `authorizedConnectionIds: []` (`pocket_realm_host.js:49`), then `previewNativeRealmTraveler` throws for every cargo entry whose owner is not the player (`native_realm_traveler.js:10-13`). Thus even an owner-approved loan cannot use the declared route permission; the practical rule is “return all borrowed goods first.” Either bind a real custody permission into both adapters or narrow the user-facing/content contract to that rule. This review does not infer that permission support exists in a future adapter.

No other concrete mismatch found in the inspected boundary. The host reuses one fixed instance ID and appends visits to that instance; exit closes the visit without resetting local facts, stock or claims. `syncRealmClock` applies the visit ledger before native simulation boundaries, while absent time advances only `observedAt`. Realm facts and site openings route to instance-owned records, and template export settles the simulation command claim before adding the matching instance receipt. The host seeds a stable definition/endpoint and the actual human body; no additional body or inventory owner is created by the traveler adapter.

This review did not run tests, scenarios, browser, save/reload, build or regression checks. The native code is actively owned elsewhere, and this note is limited to the captured revisions. Any behavior beyond these source paths remains unverified.
