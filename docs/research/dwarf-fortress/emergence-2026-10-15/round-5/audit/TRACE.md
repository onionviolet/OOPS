# Native cancellation, identity and cleanup trace

## F1. Render to input to teardown

Pinned imagebase0x140000000. Public locators below refer to original PE virtual addresses, not recovered source symbols. Raw full assembly, byte captures, commands and failure envelopes live under `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-5/audit/`.

| Edge | Native locator | Evidence and limit |
|---|---|---|
|Selection render owner|0x14014ef90..0x1401a01c4|332340-byte unwind region retained, mostly unread. Never requested a full decompile.|
|Selected object stage|0x140181b5e..0x140181b7b|Loads selected object from stack+0xd0, calls virtual+0x118, tests EAX.|
|Label zero/nonzero|0x140181b7d /0x140181bbd|Literal0x141600eb8 Cancel construction versus0x141600ea8 Remove building; both feed renderer0x140ad9960. This is UI evidence, not itself a consumer.|
|Input route|0x1403369da..0x140336a30|Global0x1418a4330 active and other local/global gates permit call0x1401aa060 with that same global as RCX.|
|Input stage policy|0x1401ac685..0x1401ac6a9|Selected object RSI virtual+0x118; zero passes RCX=RSI, EDX/R8/R9=0 to0x140587d80; nonzero jumps0x1401b0234. A second coordinate-gated action at0x1401b01ef..0x1401b023d additionally excludes virtual type0x1d, uses the same stage test, and invokes virtual+0x168 for nonzero.|
|Teardown reentrancy|0x140587d90..0x140587db6|Object+0x24 bit0x10 already set jumps to return; otherwise sets it and calls0x140586ac0(object,true).|
|Type override|0x140587dc2..0x140587de2|Virtual type+0xd0 equal4 forces first virtual+0x230 argument1; otherwise uses original first input flag. Second argument retains original R8 flag. Input flags zero must not be described as all internal calls receiving zero.|
|Final gate|0x14058898b..0x1405889bf|If object+0x24 bit0x20 is clear, calls0x1405a78e0. Bit set skips this deletion owner.|
|Selected global membership|0x1405a78e6..0x1405a795f|Searches global vector0x1423edf10..18 for exact object pointer. On match sets bit0x10, invokes virtual+0x210, reloads pointer then virtual+0x2c0 with EDX1. No match skips these calls.|

`building_actualst` type descriptor name is at0x1418bd630, descriptor base0x1418bd620, COL0x141793130, vtable0x141620860. Its slot35(+0x118) points0x14028ba00, which sign-extends16-bit object+0x120. Slot66(+0x210) points0x140580150, a registration unlink wrapper. Slot70(+0x230) points0x1405879e0, an optional notification routine; it is not the material refund implementation. Slot88(+0x2c0) points0x14028ba50. The base `buildingst` descriptor/vtable are distinct,0x1418b01c0 /0x14165c4c8. Actual dynamic selected subtype can override these entries; the audit establishes the pinned actual-base path, not every derived building's behavior.

## F2. Existing item identity survives wrapper release

The actual deleting destructor0x14028ba50 calls0x140583390, then conditionally frees the building allocation0x148 when EDX flag1 is set. It does not pass that building allocation to item handling.

At0x1405833b0..0x1405833e9 the actual destructor reverse-iterates building+0x128..0x130, loads each wrapper pointer, then loads the first pointer from that wrapper and calls0x140c634f0 with that exact item and DL2. This is the same wrapper/vector layout established by round4 placement0x14054bdc0. After the loop it frees optional building+0x140 metadata and invokes vector-storage cleanup, then tails to base destructor0x140583430. The full base destructor was captured but is not claimed fully read.

The item helper0x140c634f0 has a4164-byte unwind interval including out-of-line case bodies and jump data. Its return at0x140c63f2d precedes some of those case bodies; stopping at that first return would omit the building case.

* At0x140c63514..0x140c63518, mode2 clears item+0x10 bit0x20 and item+0x14 bit0x8. If item+0x10 mask0x1 is set it invokes0x140c911d0 with a nonzero boolean and R8=0. That helper remains unread; the audit does not claim floor re-registration from this call.
* General references are item+0x38..0x40. The first scan identifies kind0x24 and asks virtual+0x60 for the holder ID. The dispatch uses kind−1, a byte-index table at0x140c644f0 and a dword-target table at0x140c644a4. Kind0x24 maps byte12 to0x140c64230, independently decoded from original bytes.
* At0x140c64230..0x140c64257 the reference virtual+0x30 resolves holder RBX; a non-null holder with virtual+0xe8 true permits its+0x128 vector scan. Other cases use common reference cleanup. This gate is preserved rather than called unconditional.
* At0x140c64290..0x140c6429e the wrapper first pointer is compared to the same item R15. Only matching entries are removed. Wrapper role+8 equal2 can call holder virtual+0x2c8; a true result sets a recursion request.
* At0x140c642bd..0x140c642ef the matching wrapper is passed to free with size16, the vector is compacted and end−=8. The item object itself is not the freed argument. If requested,0x140c64312..0x140c6431d recursively tears down the holder with zero flags; the reentrancy bit above matters here.
* Common0x140c63d87..0x140c63db8 destroys the general-reference object via its virtual+0x78 and erases its pointer. It does not call an item count delta or setter. Later common flag cleanup at0x140c63efb..0x140c63f18 may clear item+0x10 bit2 under the retained-reference condition.

This proves bilateral containment detachment of a stored existing item, with precise identity and wrapper lifetime. It does not prove a ground tile placement, hauling, availability to another job, the amount consumed before storage, output rollback, durability restoration, or returning a wholly consumed original allocation.

## F3. Positive-count candidate classification

At0x1409f5521 the actual instruction includes REX prefix41; the raw bytepattern candidate began one byte later. SourceR14 gets virtual+0x480(delta1) after virtual+0x388(1,true) returns newR12. New+0xe8 is assigned2000 and source+0xe8 subtracts2000, then the new pointer is passed to0x1413289b0. At0x1409f73c5 the parallel path uses sourceR13, newR12, field+0x148 and dimension15. This supports a split/count compensation interpretation. The virtual+0x388 implementation is unread, so its exact count decrement is not established here.

In0x141345c40 the positive count candidates0x141346181,0x141346951,0x141347991 operate on matching objects in an initially empty local output accumulator. Type/subtype/material pair match is required; otherwise0x140c9a510 creates a fresh output, initializes it and appends it. Source world material quantity cells and output count are different storage. The selected source has1329 pseudocode lines and a bad-instruction-data warning, so there is no full CFG or cancellation semantic claim. Sibling independently checked all three pointer histories.

Candidate collection retained38 syntactic virtual-offset patterns, with12 offset0x480 patterns. Those are a search inventory, not38 confirmed instructions/consumers. Raw string collection found one Cancel construction literal. The large0x1409eb8a0 decompile failed because response buffer size exceeded, with retryable=false. Exact failure/logs remain in `extract/rea-native.json`; no unchanged retry was made. Bounded native slices supplied the successful input-handler route instead.

## F4. Cross-system consequence and next concrete sources

A reservation can be released, a stored physical object can lose its holder association, a product stack can gain quantity, and a consumed ingredient can be recreated. These are four distinct operations with different pointer histories. A cancellation system can expose all of them through similar UI words. The recovered rule chain is stage→action choice→conditional teardown→stored-item ref detachment→building destruction; feedback into world accessibility remains unread.

The next exact source for physical availability is0x140c911d0 and its caller mode2, followed only if needed by the item flag consumers. The next exact source for completed-building recovery is the selected derived building's virtual+0x168 implementation. The original consumed-source rollback question still requires a matching source pointer or corpse extraction record+0xa0 restoration and a cancellation/exception caller. Output coalescing or allocation free cannot substitute for that evidence.
