# Dwarf Fortress round 3: active effect expiry and source removal

Research only, 2026-10-15. This pass traces actual native active-effect updates into source cleanup and active-instance removal. It separates that lifecycle from freeing a raw effect definition. No game, Lua generator or Windows executable ran.

**DF-L1:** Native parsing maps START to `+0x10`, PEAK to `+0x14`, END to `+0x18`, and DWF_STRETCH to `+0x1c`. The earlier interim progress note conflated START and PEAK. The final mapping is backed by literal comparisons and field writes. Timings are bounded integer inputs, not directly seconds.

**DF-L2:** Native updater `0x1413dcd00` advances an active-instance counter, resets the instance's source contribution payload and reapplies eligible effects through the same virtual slot that round2 identified for healing. It handles start, finite end, scaling/ramp and localized target arrays. The instruction epilogue returns an all-inactive result despite the decompiler incorrectly displaying a void signature.

**DF-L3:** A native owner tests that result and removes the actual active instance: it matches source IDs, frees selected contribution subblocks, clears source IDs, destroys the active instance and erases its actor vector entry. This is source-associated cleanup, not a claim that every permanent injury or transformation is undone.

[Full lifecycle details](EFFECT_LIFECYCLE.md) preserve native addresses, field widths, comparisons, callback arguments, source ownership and limits. [Cross-review](CROSS_REVIEW.md) records the independent checks of the paired job/refund audit. [Coverage](COVERAGE.json) preserves reviewed and unread complements across this pass, round2 native work and the original393file readable corpus. [Unread](UNREAD.md) names the remaining gaps.

The pinned binary is unchanged: Steam build24557528, SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`, image base `0x140000000`. Full native pseudocode, disassembly, literal/RTTI mappings and receipts are retained in [the private round3 archive](/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-3/).

The paired [refund/cancellation audit](../audit/REPORT.md) owns job findings. Selected consumption paths now distinguish count decrement, tissue/material harvesting and removal requests; no general refund or transaction rollback guarantee is established. This extraction independently checked acquisition ordering, count width/sign, selected dispatch calls and that limit.

This closes the selected native expiry-to-removal path. Exact scheduler frequency, suspended/offscreen clocks, all stat/tag overlap, physical reversion, resource refunds and save transactions remain unresolved. No YAIRPG implementation or gameplay acceptance is claimed.
