# Frozen world-instance prototype review

Reviewed 2026-10-04. Source hashes matched the dispatch packet: `world_instances.js` `880bd58e1fd3fce8f734e755f7e28562e4dcdfbcfb0d1aa57350ddf353dda180`; `pocket_realm_content.js` `bdcfb49baad1ee1fd3fb0bf8e363e2406c4c938ff3e3dc038008d6c04bfea191`.

No concrete source defect found in the reviewed contracts. `world_instances.js` validates JSON-shaped definitions, bindings and ownership nesting; visit records are distinct from instances; `planWorldClock` unions occupied visit intervals against the joined played-minute clock and reports absent time as frozen; updates retain facts/sites/claims and use an instance revision guard; the view exposes only discovered, explicitly known fields. The Glasshouse content models ordinary and practiced repairs with finite stock, the practiced route requires the existing `field.load_step` mastery and `field.drive` output, and its return/export routes refer to retained instance state and one unique claim.

This is source inspection only. I did not run syntax/import checks, tests, scenario smokes, browser, save/reload, build, or regression checks. The modules remain detached and do not establish native world isolation or playable travel. In particular, native visit/position, usable hands, caretaker willingness, owned template, bench-idle, and instance-fact/claim/job adapters remain integrator dependencies; persistence compatibility and actual finite-stock/claim behavior remain unverified. These match the packet's stated boundaries rather than a defect in the frozen source.

## Final-source delta review

Reviewed 2026-10-04. Final hashes: `world_instances.js` `607f7ab8f6052b45ab5eb9ec86a944a30f624a538067a51626a55b1a2ebbcf2e`; `pocket_realm_content.js` `65e9e34eb2a77931a58cbe3f05b5d34a2ceede1acb4022907b85abfc582849f2`.

One concrete validation gap remains in `world_instances.js:23-26`: non-enumerable fields are rejected only for non-array records. An array with a non-enumerable extra string property passes the dense/undecorated check because `Object.keys(array).length === array.length` ignores that property. Consider checking array own property names against `length` plus its indexed elements, or otherwise rejecting extra own names. The endpoint, visit-time and per-actor interval checks show no contradiction in source inspection; the content option shape and default connection ID changes also appear consistent.

No syntax/import checks or runtime scenarios were run. All prior integration, native binding, persistence compatibility, save/reload, browser, build and regression limits above still apply.

## Final follow-up delta review

Reviewed 2026-10-04. Final hashes: `world_instances.js` `bd2528e30575f98700a061353652b5275435ea5d277aab74ff1de2fbf916bb4c`; `pocket_realm_content.js` `875164f932f8000d791047faa1f903fd7803f9b0471e0ba0baea02f9e0ae9be9`.

The array-validation finding above is resolved: arrays now require the expected own-property count as well as dense indices and `Array.prototype`. Sorting actor visit histories by both entry and exit time correctly permits a zero-duration ended visit immediately before an active visit at the same played minute. The lead instruction now cites the existing `exchange.parcel` situation, satisfying the source's situation-attribution contract. No concrete contradiction found in these final deltas.

This was a source-only delta review. The parent reports a quick syntax/import and declarative registry check for 14 commands, one person, three sites and one controller; I did not independently rerun it. Behavioral scenarios, browser, save/reload, build and regression remain unverified.
