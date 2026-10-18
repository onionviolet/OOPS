# Dwarf Fortress round4: after consumption, what does cleanup restore?

Status: PARTIAL, bounded research delivered. Research only,2026-10-15. No consumed-material refund consumer was established in this selected path. The new result is a concrete link from consumption to the same native cleanup owner previously called cancellation.

| Code | Finding | Meaning |
|---|---|---|
| DF-JR06 | After the selected count-consumption loop, the dispatch sets an output flag and returns false; its native caller then invokes0x141325080. | The cleanup owner is used after this completed work path as well as failures. Its presence does not identify a refund. |
| DF-JR07 | A positive addition in the post-work helper changes actor/owner field+0x484, not item count+0x80. | A positive integer write is not enough to prove restored materials. |
| DF-JR08 | The harvest output factory creates a new glob, and virtual+0x488 assigns its count before placement/reservation. | New product initialization differs from restoring the consumed source. |
| DF-JR09 | The inspected source/count/output/unlink edges show no restoring delta to the consumed item. | General refunds, rollback and indirect helpers remain unresolved, rather than globally absent. |

[TRACE.md](TRACE.md) preserves exact native addresses, branch conditions, argument/data flow, counted resource identities and open edges. [PEER_REVIEW.md](PEER_REVIEW.md) records independent factory/placement/quantity checks against the sibling extraction. Full new pseudocode, disassembly, call-candidate receipts and private tooling live under `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-4/audit/`; earlier pinned source archives are reused read-only.

[READS.json](READS.json) and [UNREAD.json](UNREAD.json) retain cumulative source/native coverage and exact complements. .pdata chunks are not equated with logical function bodies; explicit envelopes include reached continuations. Static validation checks hashes, native bytes, selected call/jump destinations, pointer identity and read/unread partitions. This proves no gameplay or runtime transaction safety.

Executable pin remains build24557528, SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`. Only one new decompile target was selected from the known post-consumption path. No broad neighboring sweep, game/Windows executable/shipped Lua execution, world/save/config access, install/download, runtime/shared owner edit, commit or push occurred.
