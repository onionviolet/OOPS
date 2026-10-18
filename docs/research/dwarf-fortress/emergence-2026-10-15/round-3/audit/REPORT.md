# Dwarf Fortress round3: reservation, consumption and refund boundary

Status: PARTIAL, bounded research delivered. Research only,2026-10-15. Pinned executable build24557528, SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`.

The acquisition counterpart to cancellation is now recovered: native code installs two references linking a job-like record and an item. A selected action-dispatch branch then either reduces an item's count, requests removal of a small stack, or processes corpse material into an output item. Cancellation unlinks reservations, but no selected path restores previously consumed quantities. That last observation is a bounded gap, not a claim that Dwarf Fortress never refunds anything.

| Code | Finding | Evidence layer |
|---|---|---|
| DF-JR01 | Native acquisition installs bilateral24-byte association records and marks the item, after which duplicate tagging can produce diagnostics. | Pseudocode and independently decoded instructions |
| DF-JR02 | Selected dispatch consumes one count from stacks of at least2; small stacks use a removal-request helper. | Native virtual-slot/RTTI join, exact signed32 accessor/delta instructions and dispatch calls |
| DF-JR03 | Corpse/corpse-piece path allocates partial material-extraction records and can create, place and reserve an output item. | Native body/material loops, RTTI type IDs and output calls; helper meanings qualified |
| DF-JR04 | Acquisition, detachment, count reduction and output placement are different stages; full cancel/refund transaction remains unread. | Connected bounded native path plus explicit missing consumers |
| DF-JR05 | Independent sibling checks confirm timing-field parsing, conditional source-owned cleanup and a real Boolean return obscured by decompiler `void`. | Selected source windows and independent return-instruction decode |

[TRANSACTION_DETAILS.md](TRANSACTION_DETAILS.md) contains exact functions, offsets, signed/count rules, branch differences, partial extraction and open transaction stages. [SIBLING_REVIEW.md](SIBLING_REVIEW.md) records precisely what was independently checked in the parallel syndrome-expiry lane. Full proprietary pseudocode, LLVM disassembly, REA envelopes, byte maps, candidate call lists and rerun tools are retained under `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-3/audit/`.

[READS.json](READS.json) distinguishes complete small-body reads, selected windows in the8022-line dispatch, captured-but-unread formatter output and assembly windows. [UNREAD.json](UNREAD.json) preserves exact native unread partitions and names the missing refund/output/atomicity consumers. The cumulative393-file readable-source ledger from round2 remains linked and unchanged; this round adds native evidence, not invented raw-file reading credit.

Validation checks pinned PE bytes,17 captured native regions, selected direct-call instruction destinations, six item RTTI chains, read/unread partitions, source hashes and report links. Decompiler success is not a complete CFG or original source. .pdata ranges are unwind regions; two explicit contiguous envelopes span multiple chunks and are labelled as such. No game/Windows executable, shipped Lua, world/save/config, install/download, runtime implementation, commit or push was performed. Exact gameplay, native scheduler behavior, transaction safety and human acceptance remain untested.
