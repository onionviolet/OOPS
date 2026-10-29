# AD3 checkpoint: exchange, body and ability reviewed rows

Status: bounded ingest and replay-mapping tooling implemented; synthetic tests
pass, agent-verified, not human-reviewed. No private rows or live pack were
changed. No `src/` files, commit, staging or push.

Authority and fit: [AD3 brief](AD3_MERGE_KINDS_BRIEF.md), RV5's reviewed-row
replacement, idempotency and mapping pattern, and the three private adapter
contracts in [MF_EXCHANGE_CHECKPOINT](MF_EXCHANGE_CHECKPOINT.md),
[MF_BODY_CHECKPOINT](MF_BODY_CHECKPOINT.md), and
[MF_ABILITY_CHECKPOINT](MF_ABILITY_CHECKPOINT.md). Applies CLR1–CLR13, AD36,
AD44. The merger stores rows in `exchanges.rows`, `bodyCare.acts`, and
`abilityConflicts.encounters`; it validates them through their real adapters,
JSON safety/predicate checks and the native simulation registry. Existing IDs
with different content stop; identical repeats are skipped. Reviewed rows
replace older rows for the same source step across all supported kinds.

The mapper routes exchange/body rows by adapter command ID and ability moves as
`<encounter>.<move>`. Missing places or command lists remain typed mapping gaps.
Synthetic test IDs avoid canon data. Exchange fixture uses a complete native
inventory key; unknown fields retain adapter-defined `null` behavior.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/merge_reviewed_rows.test.js tests/build_replay_mapping.test.js tests/lead_replay_score.test.js` | PASS, 36 tests | Synthetic adapter/registry and mapper fixtures; no private pack ingest, browser replay or gameplay settlement |

No build, browser, persistence, `check:rules`, commit or push was run; this lane
changes only the two scripts, their tests and this checkpoint. Coordinator owns
combined gates and integration.
