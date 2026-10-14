# A4 report, 2026-10-14

**COMPLETE for the authorized source lane. All outputs remain proposals for root
and Weibao review. No gameplay acceptance is claimed.**

Code commit: `c6ea2cbc43c0c7d024f08c709c7d07d627b2b89a`
(`Add source-qualified relationship read view`), branch `core/a4-relationships`.
Only the two new code/test files are in the commit. No trailer, merge or push.
Main-checkout lane docs are left unstaged.

## Deliverables

| Code | What changed | Location |
|---|---|---|
| A4-F1 | Corrects U08/F4: chronicle gates and simulation memory consequences already consume relationships. Confirms 42 effect declaration lines across 32 files, inventories helper/direct writers, every direct reader and reputation APIs/total paths with file:line. General simulation social-axis rule predicates remain thin. | [AUDIT.md](AUDIT.md) |
| A4-D1 | Pure detached read shape with source-qualified axes/ties and ordered source-tagged memories. Simulation direction and chronicle life-counterpart semantics stay distinct. Facts preserve false/zero and keep missing dimensions unknown; no sum, precedence, reverse edge, disclosure or consent inference. | `src/relationship_view.js:11-17,64,97` in the A4 worktree |
| A4-D2 | Factions, audience standing and institutional membership palette, candidate data shape, five first reader seams, additive future save compatibility decision and 16 further angles. Extends existing owners and does not select a build. | [STANDING.md](STANDING.md) |

## Checks actually run

- **A4-T1:** `node --test tests/relationship_view.test.js`: **15/15 pass**.
  Direction, owner binding, missing facts, typed scalar facts through rules.js,
  source separation, duplicate memory causes, both 32-entry buffers, detached
  reads, JSON roundtrip, real chronicle writer clamp, invalid inputs and open axes.
- **A4-T2:** `node --test tests/relationship_view.test.js tests/chronicle.test.js tests/rules.test.js tests/reputation_state.test.js`:
  **34/34 pass**. This includes the same 15 new tests, plus 12 chronicle,
  four rules and three reputation-state checks. Counts overlap, not 49 unique tests.
- **A4-T3:** `git diff --cached --check` passed before commit. Only the named
  new module/test were staged. Post-commit worktree is clean. Local doc links,
  cited file existence/line ranges and punctuation checks pass. These doc checks
  do not independently prove every design claim.

No full npm suite, dist rebuild, browser exercise, native persistence/import,
private-pack read or save access was run. COMMON allows a targeted source slice
and forbids rebuilding dist for this lane.

## Remaining gates and limits

**A4-G1, OPEN:** root review and any integration decision. Code is committed on
its isolated branch; it is not merged or wired to gameplay. The root scorecard,
prerequisite audit, companion palette and live product owners were not edited.

**A4-G2, OPEN only for a later authorized playable slice:** choose a consumer and
explicit identity/direction/evidence policy, integrate it, rebuild, then exercise
changed behavior from a fresh test origin. Any UI behavior claim needs the target
desktop viewport (proposed 1366×768). If persistence changes, test old-save
migration and native save/reload/literal import. These are not missing tests of
this unwired pure reader.

**A4-R1:** the adapter validates memory payloads more strictly than the existing
simulation store validator, which checks array and retention length. Unsupported
payloads raise an explicit read error rather than inventing a fact or repairing
state. No existing loader or store validator was changed. Private/dynamic pack
behavior and rebuilt gameplay remain UNKNOWN.

[CHECKPOINT.md](CHECKPOINT.md) preserves completion and resume scope.
