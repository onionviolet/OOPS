# Independent Qud alternate-reference audit

2026-10-15. Research only. This continues depth5's vortex queue audit through serialization identity, real damage-history holders, restoration, activity and cleanup. No native/game/save execution.

**A6-1:** Physics damage-history fields can preserve a queued creature's full body through another saved object. Their validity filter does not require a cell or an active zone. **A6-2:** Restoring that body does not rebuild the vortex queue, give the creature a cell, or add it to the action queue through the inspected core consumers. **A6-3:** Deferred reference wrappers can point to that restored body if another route enrolled it first; a reference-only wrapper does not independently enroll the body. **A6-4:** Scheduler validation rejects a contextless NPC, with a player-only spawn-cell repair exception.

[Full code-level details](FINDINGS.md) explain exact field assignments, validation predicates, overwrite/suspension cleanup, object-table and callback order, NPC behavior and combinations. [Unread scope](UNREAD.md) separates these closures from uninspected object-specific callbacks and the whole game save graph, which the primary depth6 lane owns.

Nine complete class captures are retained privately, including one fresh 24-line validity helper and eight reused source bodies. The [source ledger](private/SOURCE_LEDGER.json), [exact source windows](private/READ_WINDOWS.txt), [reviewed/unread partitions](private/READ_WINDOWS.json), [conditional fate graph](private/SURVIVOR_PATHS.json) and per-type receipts preserve evidence. [Validation](VALIDATION.json) checks artifacts only. This establishes conditional body persistence, not recovery to playable world context or universal loss/recovery behavior.
