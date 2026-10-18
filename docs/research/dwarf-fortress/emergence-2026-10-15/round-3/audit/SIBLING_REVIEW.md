# Independent review of the syndrome-expiry lane

This review is bounded to listed parser, updater, cleanup and instruction windows. It does not certify the sibling's entire native graph.

**DF-JR05.** Reviewed parser0x140d78c30 selected clamps: START writes signed32+0x10, PEAK+0x14, END+0x18, each numeric input clamped0..1000000. PEAK raises a finite smaller END; END lowers a larger PEAK. END=-1 behavior belongs to initialization/runtime rather than a negative numeric token passing these shown clamps. The first interim message had confused START and PEAK; the sibling corrected it before final publication, and this review uses the corrected mapping.

Reviewed0x1413dcd00 selected windows show active-instance counter+0xc incrementing, source-owned contribution lookup/reset and effect eligibility/timing work. The selected end test admits END=-1 or elapsed less than(END−START)×stretch. These words describe native counters, not wall-clock seconds. The body has many unreviewed physiology/type cases.

The decompiler declares this function `void`, while callers test its return. Independent `/usr/bin/objdump` decode at0x1413ddcf3..0x1413ddd1f confirms `testb %sil,%sil`, then `sete %al`, security-cookie helper and return. Thus there is a Boolean register result despite the reconstructed signature. The raw output is retained as `audit/extract/assembly-expiry-return.txt`. Signature text must not override instructions.

Reviewed admission/refresh function0x1413c5ef0 source windows292–343 and540–628: a gated true updater result triggers cleanup of contribution records whose+0x30 matches the active-instance identifier, frees/nulls payload suballocations+0x90 and+0x98, resets source identifier to−1, and destroys/removes the active instance. The contribution vector+0x5b0 and active-instance vector+0xca0 are different structures. This is source-specific removal, not blanket erasure of all wounds or every actor capability.

The sibling additionally supplied native owner-loop slice0x141355916..0x141355aae. Read and independently decoded the focused slice0x141355916..0x141355a87: it calls0x1413dcd00, tests AL, then ontrue matches source IDs, frees/nulls both suballocations, resets sourceID, calls0x141345b70 and0x1400b99a0 against the active vector. This closes a real native owner cleanup path beyond an admission-only observation. Further derived-state helpers are called afterward, but their semantics were not independently read.

This review leaves transformed anatomy/equipment restoration, downstream virtual effects, all overlapping source contributions, save/reload/offscreen behavior and actual played expiry open. Removing effect support is different from healing damage that already occurred. Full sibling findings and exact broader read partitions remain owned by the parallel extraction report.

The sibling independently checked this auditor's acquisition writes, selected dispatch count branch and count accessor/delta assembly. Both reports distinguish the item removal-request helper from immediate object deletion. No consumed-material refund is certified.
