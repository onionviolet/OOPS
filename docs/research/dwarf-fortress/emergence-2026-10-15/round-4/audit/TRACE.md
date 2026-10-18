# Consumed resource identity and caller policy

Addresses apply only to native executable SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`. Source/assembly paths, hashes and exact reviewed windows are pinned in [READS.json](READS.json). This follows the selected round3 path; no entire-game absence claim follows.

## DF-JR06: the post-consumption return reaches cleanup

The selected dispatch0x140dac290 contains the already-verified stack branch: item virtual+0x478 gives signed32 count; count≥2 calls virtual+0x480 with−1, smaller count enters the removal-request helper. Corpse/corpse-piece types instead detach their association and run partial material extraction. These operations change the input or produced state before the following common path.

Native loop exit0x140dafbb0 directly jumps to0x140db2843. There it calls0x14136bae0, writes byte1 through its saved output pointer and prepares a report/event-like structure. The output pointer was captured from RDX at0x140dac2d0 and reloaded from the same local slot at0x140db284b. At0x140db2884 it jumps to0x140db6be8, which calls0x1413eff80;0x140db6bf0 explicitly zeroes AL before the security-cookie epilogue and return. Thus the decompiler's `void` signature omits a return register the native caller uses. These instruction joins are more precise than assuming the function name identifies success or cancellation.

An exact E8 byte search over the pinned text section found one candidate direct caller of0x140dac290, at0x14150614a. Independent LLVM decode confirms this instruction and the following policy. At0x141506130 the caller initializes byte[rsp+0x58]=0 and integer[rsp+0x60]=30. It passes their addresses as RDX and R8 respectively, with owner in RCX. After the call, a nonzero AL takes a separate branch. Otherwise it tests byte[rsp+0x58]; if nonzero it resets some owner action state through0x140073a60 and, after a type-specific reference lookup, calls0x141325080 at0x1415061ba with owner, flag1, the integer output and another zero argument.

Therefore the ordinary-return route from the inspected consumed-work loop sets the caller's cleanup flag and false return, selecting the known cleanup owner. This is an actual post-consumption cleanup connection. It is not evidence that a player canceled before work finished, that every job shares this route or that a refund is intended. Exception/nonreturn behavior and other dispatch branches remain separate.

After cleanup, this caller has special follow-up job construction for types0x87/0x88, empty owner work vector and several other gates. It can create another record type0x89/0x8a, fill coordinate-like fields, associate/register it and assign it to the actor. These are later work records, not a positive item-count delta in the displayed window. General follow-up helper internals remain unread.

## DF-JR07: the post-work positive write is a different account

The one new decompile target is0x14136bae0, full95-line pseudocode retained privately. It requires a nonnull current record; otherwise it sends a diagnostic and returns. It derives location from the actor or a referenced item and calls0x14137bbf0. A native mode flag gates additional owner-state work. An optional owner subobject/helper and record list can make it return early.

The remaining branch reads current record flagsbits11/12/13 into a small combined code, clears those bits and derives a factor from128,156,192,256,320or384. It reads a type-indexed integer table and adds `(factor × tableValue) >> 7` to32-bit owner+0x484, then calls0x14136b890. The actual write is independently confirmed at0x14136bcd9.

This is not the item count accessor/delta field+0x80 established through six item RTTI vtables. No object pointer from the consumed-material association is used as the destination of this addition in the shown body. The exact meaning of owner+0x484 remains unresolved; it is not labelled XP or currency without another authoritative consumer. Neither the positive sign nor temporal proximity to work completion makes it a material refund.

The first.pdata interval ends0x14136bb0f before most of this body. The independent disassembly explicitly spans the reached contiguous envelope0x14136bae0..0x14136bcea, crossing three unwind entries and ending at the observed return. This preserves the actual continuation instead of treating a47-byte unwind chunk as complete semantics.

## DF-JR08: output quantity belongs to a new object

Peer extraction resolves0x1407df320 as a new glob factory: allocate0xd0 bytes, call base constructor0x1400fc720, assign native glob vtable0x1416bdbc0, initialize material fields and set field+0xc8 to150. This150 is not the item stack-count field+0x80. Full87-byte independent factory disassembly matches the pseudocode and previously recovered glob RTTI pointer.

The harvest caller keeps the returned object pointer and invokes virtual+0x488 on it with extracted amount. Glob slot145 maps to0x1400fc5b0. That method clears flag0x20000000, assigns32-bit item+0x80 and floors negative input at0. It does not add the extracted amount to the old source. The caller then sets material identity, invokes virtual+0x328, calls placement0x14054bdc0 and acquires a job association. The placement result is not tested as a Boolean before the next stage.

Placement adds a type0x24 reference using holder identifier+0x50, creates a16-byte holder entry containing the product pointer, appends it at holder+0x128/+0x130/+0x138 and synchronizes item coordinates with holder coordinates. Several item flags trigger additional referenced-state updates. The final RAX receives the created wrapper pointer at0x14054bee8; this is not an explicit success/failure flag. Allocator exceptions and downstream helper ownership rules remain unread.

In the existing larger dispatch, two other virtual+0x488 source windows also use a pointer returned by0x140c9a510 before assignment. Those short windows were inspected as possible positive-write candidates, but the factory and surrounding branch policy were not reopened. They are product-initialization-shaped candidates, not certified refunds or proof of globally absent refunds. The selected preexisting−1 source remains a different object from these newly returned pointers.

## DF-JR09: refund search boundary

The study follows input association identity through selected count−1, body-material extraction, output creation/placement, work return flags, native caller cleanup and the previously decoded detach owner. It checks the obvious positive writes separately: owner+0x484, new glob count assignment and other new-pointer count assignments. None establishes a positive restoring delta to the consumed input.

This is a bounded negative result. Many indirect/virtual helpers and job cases remain unread. A caller can implement compensation outside a generic detach helper; a recipe can postpone consumption; a partially processed source can retain unused material without being refunded. These are distinct possibilities and are not resolved by absence of a local count increment.

| Edge | Current evidence | Remaining question |
|---|---|---|
| Reserve → consume | Actual bilateral links and count−1/body extraction | General recipe size and timing policy |
| Consume → return | Exact loop jump, output flag and false return | Exceptions and other dispatch cases |
| Return → cleanup | Native caller tests AL/output flag and invokes known owner | Full actor scheduler and all helper effects |
| Cleanup → resource | Previously verified detach/unlink/type cleanup | A specific compensating quantity delta, if any |
| Extract → new output | Actual new glob, assigned count/material, placement and association | Capacity/allocator failure and output rollback |
| Positive write candidate | Different actor field or newly allocated item | Actual caller policy proving a consumed source is restored |

No additional generic target is required to state the current result. A future pass should choose one exact refund/exception policy or concrete recipe execution owner. It should not reread every nearby function or relabel an association unlink as a refund.
