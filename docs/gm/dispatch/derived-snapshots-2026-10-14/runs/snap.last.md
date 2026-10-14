Created only `src/anchor_snapshots.js` and `tests/anchor_snapshots.test.js`. Focused tests: 12 pass. Full suite: 640 pass, 0 fail. `check.sh` exited 0:

```text
PASS gate_integrity
PASS npm_test # pass 640 # fail 0
PASS unit_file
PASS G1_fresh_canon {"facts":{"miller_alive":true,"mill_standing":true,"flour":15,"festival_held":true,"mill_upgraded":true,"bread":true},"applied":["e1","e2","e3","e4","e5"]}
PASS G2_incremental_equals_full {"inc":{"miller_alive":true,"mill_standing":true,"flour":15,"festival_held":true,"mill_upgraded":true,"bread":true},"full":{"miller_alive":true,"mill_standing":true,"flour":15,"festival_held":true,"mill_upgraded":true,"bread":true}}
PASS G3_branch_skips_and_cascades {"facts":{"miller_alive":true,"mill_standing":false,"flour":5,"festival_held":true,"bread":true},"skipped":[{"id":"e2","reason":"Unmet requirement: mill_standing."},{"id":"e3","reason":"Unmet requirement: mill_upgraded."}],"applied":["e1","e4","e5"]}
PASS G4_evidence_for_applied_only [{"id":"e1","label":"SHOWN","locator":"fixture:1"},{"id":"e4","label":"INFERRED","locator":"fixture:4"}]
PASS G5_diff [{"key":"flour","from":15,"to":5},{"key":"mill_standing","from":true,"to":false},{"key":"mill_upgraded","from":true}]
PASS G6_pure world unchanged
PASS G7_lint [{"kind":"never-fires","ids":["e6"]},{"kind":"same-time-conflict","ids":["e4","e7"]}]
PASS G8_anchor_and_revision {"at":35,"revision":3}
PASS G9_deterministic_and_order {"orderFromReversed":["e1","e2","e3","e5","e4"]}
PASS pure_imports
```

A1 `deriveSnapshot(world, at, {branch} = {})`: derives facts, applied/skipped history, evidence and revision metadata.
A2 `deriveIncremental(world, previousResult, at)`: continues derivation, invalidates changed author data and rejects world/revision mismatches.
A3 `diffSnapshots(a, b)`: returns changed facts sorted by key.
A4 `lintWorld(world)`: flags missing fact producers and conflicting same-time writes.

Unverified: gameplay integration and browser acceptance. No staging, commit or push.