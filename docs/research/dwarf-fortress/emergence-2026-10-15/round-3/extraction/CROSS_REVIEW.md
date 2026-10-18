# Independent cross-review of the job/refund lane

The paired auditor owns [its report](../audit/REPORT.md) and all primary job conclusions. This extraction independently read selected stable raw outputs under `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-3/audit/extract/`.

**DF-X1, acquisition:** `native-0x140d028e0.c` entry through the insertion/diagnostic branch, plus its final flag write, shows two0x18byte allocations, an item-side reverse reference to the job and a job-side entry to the item. The diagnostic for an already flagged item follows insertion and does not reject it in the reviewed path. Role6 bypasses the final flag2 update. This confirms ordering, not race safety or atomic acquisition.

**DF-X2, actual count arithmetic:** LLVM `assembly-0x1400fc190.txt` shows a32bit load at item `+0x80` and return. `assembly-0x1400fc590.txt` shows32bit signed addition of EDX into that field, a sign-flag branch, zeroing a negative result, clearing flag `0x20000000` and return. Neighboring padding/next-method bytes in these windows are not part of the getter. Valid operand/overflow ranges are not proven by those instructions.

**DF-X3, selected consumption branch:** `native-0x140dac290.c:1930–1996` obtains the virtual count at offset `0x478`, requests removal when the count is below2, and otherwise calls virtual offset `0x480` with `0xffffffff`. Another branch detaches a job-item reference before calling the specialized material/tissue helper. This confirms selected decrement/removal ordering, not all recipe consumption or refunds.

The auditor subsequently resolved the specialized helper as tissue/material harvesting rather than a generic partial-stack routine, and qualified `0x1402567f0` as a removal request rather than proven immediate destruction. This extraction retains those narrower conclusions and makes no independent whole-helper certification for either path.

**Open:** Reservation cleanup, physical quantity decrement, queued removal, product creation, rollback/refund and save durability are different operations. The paired evidence establishes selected operations and ordering. It does not establish a general refund policy, every job branch or atomic cancellation.
