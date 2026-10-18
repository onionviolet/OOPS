# Dwarf Fortress round4: output construction, ownership and rollback boundary

Research only,2026-10-15. Three connected native targets extend the selected material-harvesting path through output construction, quantity assignment and holder placement. No game/Windows executable/Lua generator ran, and no YAIRPG runtime or installed-game change occurred.

**DF-O1:** The output factory constructs a fresh `item_globst` object. A positive quantity assigned to this new object is output initialization, not a refund to the consumed source. The factory's separate `+0xc8=150` default is not the stack count at `+0x80`.

**DF-O2:** The holder-placement routine creates an ownership-like reference and a holder-side wrapper, updates coordinates, and returns the wrapper. The selected caller does not test that return before attaching a job reservation. There is no explicit recoverable placement-failure or input-restoration branch in these three inspected methods.

**DF-O3:** That result does not prove that every failure loses materials or that refunds never exist. Allocator exceptions, lower-level reference failure, the exact consumed case's dispatch return and wider rollback remain unresolved. The paired audit independently connects one false-result cancellation policy; the missing transaction join is stated explicitly.

[OUTPUT_DETAILS.md](OUTPUT_DETAILS.md) preserves exact code-level effects, field widths, ordering and limits. [CROSS_REVIEW.md](CROSS_REVIEW.md) records independent review of the paired cancellation/refund findings. [COVERAGE.json](COVERAGE.json) preserves this pass's full small-method read windows and cumulative prior unread complements; [UNREAD.md](UNREAD.md) names the remaining transaction questions.

The binary remains build24557528, SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`, image base `0x140000000`. Full pseudocode, independently decoded bytes, exact commands, selected caller window, RTTI proof and hashes are retained under [the private extraction archive](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-4/extraction/).

No atomic rollback, general refund policy, runtime output appearance, save durability or human acceptance is claimed. The selected static output path is documented; the unresolved restoration gate is narrower than “native code unread.”
