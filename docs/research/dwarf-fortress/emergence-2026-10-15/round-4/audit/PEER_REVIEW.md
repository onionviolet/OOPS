# Independent output-path review

Read all three sibling native pseudocode bodies:0x1407df320 factory,0x14054bdc0 placement and0x1400fc5b0 quantity setter. Independently captured LLVM assembly from the pinned PE and checked factory allocation/vtable/return, placement reference/vector operations and wrapper-pointer return, plus the exact signed32 setter.

Confirmed: factory returns a new glob object; default150 is field+0xc8 rather than count+0x80. Setter assigns the new object's count and clamps negative values. Placement returns a wrapper pointer; the selected harvest caller proceeds without a shown Boolean success test. These close real object construction/ownership operations, while allocator/exception rollback remains unread. They do not show restoration of consumed stock.

Placement has split unwind intervals. The independent captured envelope0x14054bdc0..0x14054bef4 includes the continuation and final return0x14054bef3. The initial170-byte.pdata interval alone would not justify full-body claims. Exact virtual-table terminal boundaries are not inferred from a fixed number of pointer slots.

The sibling reviewed this auditor's earlier acquisition/count work and was sent the newly identified caller cleanup policy and owner-field distinction for cross-check. This report's independent reading is bounded to recorded files/windows; no complete binary or runtime certification is implied.
