# A3 direct realm travel tests

2026-10-14. Scope: U12 travel/carriers and M9 shared-module test floor.
Tests-only proposal on `core/a3-travel-tests`, in
`/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/core-a3-travel-tests`.
Read COMMON.md first, then AGENTS.md, PROJECT.md priorities, user preferences,
USER_VISION.md travel direction and the six modules and their callers.
Initial worktree was clean. No runtime source, save shape or migration changed.

## Changes and evidence

All rows below are SHOWN by source reads and passing direct tests. Fixtures are
synthetic public data, independent of authored world-case generators and private
packs. Plans are checked as plans, never described as executed gameplay.

| Code | New test file | Tests | Caller contract covered |
|---|---|---:|---|
| T1 | `tests/realm_connections.test.js` | 34 | Eligibility and explicit refusals for stale/unknown routes, body, origin/destination, direction, chronology, lease cutoff and arrival position; complete cargo, lender authority, aggregate costs; physical versus view; manual/expiry/anchor closure; open/close/reopen and authored save bindings; witnessed-state view. `src/realm_connections.js:95`, `:119`, `:191`, `:215`, `:238`. |
| T2 | `tests/realm_cargo.test.js` | 30 | Exact bag/equipment quantity conservation, distinct stock IDs, zero stacks, owned/loaned slices, ambiguous allocations, split loans, snapshot tamper refusal, purpose/destination-scoped actual consent, revocation/revision/expiry, capacity/class/equipment rules and JSON round trips. `src/realm_cargo.js:59`, `:97`, `:111`, `:171`, `:187`. |
| T3 | `tests/native_realm_traveler.test.js` | 16 | Same existing body and stock on outward/return plans, owned learned method references, upstream refusal propagation, complete/stale native cargo, actual life/health/mobility/busy gates, missing owners and conventional no-borrowing rule. `src/native_realm_traveler.js:9`, `:15`, `:29`, `:35`, `:48`. |
| T4 | `tests/realm_traveler_profiles.test.js` | 25 | Physical/projection/shared/alternate body modes, one identity/mind, independent vital/pool owners, no held-stock duplication, setup/sustain costs against one pool, learned versus fragment methods, source availability, exact access/stock guards, retained obligations, companion consent and observer views. `src/realm_traveler_profiles.js:64`, `:245`, `:276`, `:333`, `:370`, `:396`, `:450`. |
| T5 | `tests/world_instances.test.js` | 8 | Definition/endpoint compatibility, singular visits, frozen absence and unioned occupied time, departure/revisit JSON records, current visit guards, nesting/cycle/history checks, once-only claims, bound facts and knowledge filtering. `src/world_instances.js:101`, `:215`, `:286`, `:310`, `:347`, `:365`, `:407`. |
| T6 | `tests/known_routes.test.js` | 11 | Only recipient-known rows at the current origin; exact native command, fingerprint, blockers/costs/eligibility; duplicate IDs fail closed; unknown text/commitments hidden; same-render stale quote check; detached commands and JSON projection round trip. `src/known_routes.js:11`, `:68`. |

F1 SHOWN: callers rely on separate cargo, route and native traveler gates.
Read `src/pocket_realm_host.js:58`, `:68`, `:90`,
`src/feature_expansion_destination_host.js:72`, `:85`,
`src/feature_expansion_nested_host.js:139`,
`src/book_world_mol_host.js:20`, `src/book_world_paradise_host.js:25` and
`src/proto23_world_host.js:28`. The tests keep these contracts separate rather
than treating an allowed route quote as complete native admission.

F2 SHOWN: durable world owners validate authored connections and local visit
records separately (`src/realm_state.js:18`, `:21`); route presentation composes
host-disclosed rows (`src/known_routes_host.js:191`), and activation compares the
fresh command/fingerprint (`src/known_routes_ui.js:46`). JSON tests cover these
module record shapes, not the complete exported game envelope.

F3 SHOWN: no confirmed production defect was exposed by these cases. No skipped
or todo regression was necessary. The first targeted run had one incorrect
test expectation: missing inventory fails at the JSON validator before the
later owner-binding validator. The assertion was corrected; source was untouched.
This is not a claim that every edge case is bug-free.

## Verification

V1 SHOWN: focused command in the worktree:

```sh
node --test tests/realm_connections.test.js tests/realm_cargo.test.js tests/native_realm_traveler.test.js tests/realm_traveler_profiles.test.js tests/world_instances.test.js tests/known_routes.test.js
```

124 tests, 124 pass, 0 fail, 0 cancelled, 0 skipped, 0 todo.
Node v22.23.3. Output: `/tmp/core-a3-targeted.log`.

V2 SHOWN: full `npm test` in the worktree exited 0:
758 tests, 758 pass, 0 fail, 0 cancelled, 0 skipped, 0 todo.
The 124 new tests are included in 758, not additional to that total.
Duration reported by Node: 9614.572042 ms.
Output: `/tmp/core-a3-full-suite.log`.

V3 SHOWN: `git diff --check` passed; worktree changes consist only of six new
test files. No dist rebuild, browser exercise, installation, merge or push.
Only this main-checkout lane's CHECKPOINT.md and REPORT.md were written; neither
is staged by this worker.

## Remaining gates and handoff

G1 UNKNOWN: actual rebuilt gameplay, complete native save/reload/export/import
and human acceptance were not exercised. Tests do not close those gates.
No UI behavior claim or viewport requirement is introduced by this lane.

G2 INFERRED: coordinator review and integration are next. This tests-only lane
does not change accepted direction or adopt a new carrier/save policy. Nonhuman
starts, procgen streams/mixing/people/storylets, derived snapshots/offline time
and world-core-kit W6 remain with their existing owners per COMMON.md.

Commit: `030c476b` (`Add direct realm travel contract tests`), six added test
files only, on `core/a3-travel-tests`. Parent: `30a2671e`.
Main-checkout lane docs remain unstaged. No merge or push.
