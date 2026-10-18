# Native evidence review

Executable SHA256: `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`; Windows AMD64 PE32+, image base0x140000000, build24557528. Existing aspects output is read-only input to this pass. No game code was executed.

## Old native work is real but answers different questions

The aspects pass used REA/Ghidra, not managed decompilation. Its saved native outputs cover text loading, an unresolved text-set selector, save failure reporting and load-abort reporting. The earlier emergence report's statement that *that auditor* performed no native disassembly was accurate; it must not be read as saying no other lane recovered native evidence.

This independent audit reparsed the PE section table and .pdata, read the exact string bytes, decoded each seven-byte RIP-relative LEA candidate and recomputed its destination. All six stored references match their literals and enclosing unwind ranges. [NATIVE_CHECKS.json](NATIVE_CHECKS.json) retains instruction bytes, function-byte hashes, ranges and independent results; [verify_native.py](verify_native.py) reproduces them.

| Anchor | Native reference | Exact unwind range, exclusive end | What it establishes |
|---|---|---|---|
| TEXT_SET |0x140acca3d|0x140acc1b0..0x140accd36|A real instruction references the text token; this other function was not semantically read here|
| TEXT_SET |0x14131e0e3|0x14131de00..0x14131e4b4|Confirms the pinned loader address; aspects pseudocode shows bracket parsing/name record and append behavior|
| Family spec variants |0x14131e9ff,0x14131ea74|0x14131e4f0..0x14131eeaa|Confirms selector references, but its jump table remains unresolved|
| Failed active save diagnostic |0x14154925e|0x14154919c..0x141549395|Diagnostic construction and failure-context handling|
| Load-abort diagnostic |0x14157c89d|0x14157c890..0x14157c96e|Diagnostic construction and failure-context handling|

Both error-handler pseudocode files were read completely. Save handler initializes temporary objects, builds a message, calls unresolved helpers, writes0x33 to an owner reached through context+0x70 at owner+0x2b8, destroys temporary strings and calls `__std_exception_destroy`. Load abort handler builds prefix plus exception detail, calls unresolved helpers, writes0x33 to an owner reached through context+0x80 at owner+0x198 and destroys temporaries/exception. Helper identities and field meanings remain analyst unknowns.

This is native cleanup of temporary message/exception objects, not gameplay cleanup of an actor, syndrome, wound, material, reservation or job. Calling a destructor does not identify domain rollback. The common0x33 value does not prove shared status type or a recoverable transaction. Neither body demonstrates save-success synchronization, flush, atomic rename, ingredient refunds, effect expiration or body reconciliation.

## New RTTI evidence: effect identity without automatic method meaning

The sibling's round2 native map locates native MSVC RTTI names for stop-bleeding, cure-infection and heal-tissues effect classes. This auditor independently reads type-descriptor strings, decodes complete-object-locator headers, checks signature1 and self/type RVAs, follows the vtable[-1] backpointer and verifies the supplied24 pointers and any declared .pdata ranges. All three classes pass those address checks. [RTTI_CHECKS.json](RTTI_CHECKS.json) and [verify_rtti.py](verify_rtti.py) retain results.

| RTTI class suffix | Type descriptor | Complete-object locator | Vtable | Supplied slot3 address |
|---|---|---|---|---|
| stop_bleedingst |0x1418cfc90|0x1417add68|0x141716e88|0x140d7af40|
| cure_infectionst |0x1418cfed0|0x1417ae070|0x1417158a8|0x140d7a680|
| heal_tissuesst |0x1418cff20|0x1417ae540|0x141716dc0|0x140d7c330|

RTTI narrows class identity more reliably than nearby strings alone. It does not name slot3's operation or prove it is the per-actor application function. The exact end of each virtual table was not independently established; checking24 pointers from a seed is not an ABI boundary proof. Native methods must be read before labeling parsing, cloning, serialization, application, expiration or destruction.

Additional native results, once reviewed, belong in the supplement below. Unresolved virtual-slot meanings remain explicit until then. Raw LEA candidates to a syndrome token prove only references unless instruction alignment and subsequent logic are independently confirmed.

## DF-EMR2-05: actual native injury mutations are now recovered

The three RTTI-linked slot3 bodies are not merely raw loaders. Their supplied pseudocode was read completely, then the mutation core was independently disassembled with `/usr/bin/objdump` from the pinned PE. Instruction-level checks below narrow the earlier native gap. Exact actor entry point, tick dispatcher, probability/concentration inputs and anatomical index resolution remain unresolved.

**Cure infection,0x140d7a680.** The second argument supplies outer pointer range+0x5b0..+0x5b8; each outer record supplies inner range+8..+0x10. Core instructions0x140d7a6d8..0x140d7a710 compare16-bit selector values against entry+4/+6. First selector−1 skips the entire inner mutation; second selector−1 acts as wildcard. Matching entry with bit0x20 set at+0x64 has that bit cleared through a32-bit AND/store. No potency percentage is read by this mutation core. “Infection” is supported by RTTI class identity; the exact entry structure remains inferred from use, not recovered debug symbols. A change flag gates later feedback, not the earlier state mutation itself.

**Stop bleeding,0x140d7af40.** Instructions0x140d7af73..0x140d7af91 multiply two signed32-bit operands: a stack argument and effect-object+0x98. They use signed multiply by magic constant0x51eb851f, arithmetic shift5 and sign correction, equivalent to signed division by100 rounding toward zero, then+1. First multiplication retains the low32 bits; there is no arbitrary-precision or overflow guard in the shown core. For normal in-range operands the decrement is `trunc(input × effectField / 100) + 1`.

At0x140d7afb8..0x140d7affe the first16-bit selector must not be−1; the second can be−1. Entry+0x6c is read as signed32 and must be positive. The decrement is subtracted, stored as32 bits, and a signed-negative result is replaced with zero. This is not always an unconditional clear. Negative/overflowing inputs are not validated by this local body and must not be silently treated as positive healing potency. The field's bleeding-counter interpretation comes from RTTI and effect context; exact units are unknown.

**Heal tissues,0x140d7c330.** Instructions0x140d7c36c..0x140d7c38c calculate the same signed32 decrement/threshold. Unlike the two consumers above, both selectors accept−1:0x140d7c3e1..0x140d7c3fd. Outer record flagbit1 at+0x2c blocks this record before inner traversal. For selected entries, positive32-bit fields+0x10 and+0xa0 are cleared.

Three aligned two-byte-element collections are shortened together. Count comes from(+0x50−+0x48)/2; the corresponding signed16 element at array+0x18 is compared to threshold using signed comparison at0x140d7c454..0x140d7c45b. If ≤threshold, data after that index is shifted in collections+0x48/+0x18/+0x30 and their end pointers+0x50/+0x20/+0x38 each shrink by2. Iteration runs backwards. This supports synchronized removal of related injury entries, not a safe assumption that every short array means the same quantity.

Outer flagbit2 gates further work. Entry+0x98 is loaded signed16; unsigned16 test `(value−1)<99` limits the branch to1..99, then signed threshold comparison applies. A successful branch writes32-bit zero at+0x98 and32-bit−1 at+0x9c, so the store width is larger than the compared16-bit field. Entry+0x64 masks0x70 and0x380 are removed; when entry+0x10 is zero, mask0x9243000 is also removed. Further cleanup requires outerbit2 clear, entry+0x98 equal zero and the+0x18 vector empty by the masked-byte-distance check. Then positive+0x6c is cleared; masks0x2490003 and0x492000c, bits30,14,31 of+0x64 and bit0 of+0x68 are cleared. At0x140d7c614 a changed state invokes0x140d87830. No unverified clinical name is assigned to each bit.

**Combination consequence.** Heal-tissues includes overlapping work with the selected stop-bleeding and cure-infection masks under different gates. Cure-infection can clear0x20 directly on a selected matching entry; heal-tissues clears0x70, which includes0x20, without the exact same potency/tissue prerequisites. Stop-bleeding reduces a positive counter; heal-tissues may clear that counter only after its deeper conditions. Therefore effect ordering and admitted selectors can change the result. These are concrete native mutations. They still do not show the syndrome expiring, source ownership, restoring a removed body part or replacing gear.

**Decompiler limits.** The REA dossiers return pseudocode but an empty assembly array, empty call-reference arrays and a FunctionManager body range of one byte. API success is not a complete function/reference graph. This auditor consequently used independent .pdata ranges and LLVM instruction decode. Register/stack argument names and struct labels remain analyst assignments. The three cores match the pseudocode on widths, signed comparisons, masks and branches; the large feedback tails are not independently certified instruction by instruction.

## DF-EMR2-06: cancellation reaches real unlinking but not proven refunds

The0x141325080 body was selected through the cancellation-text route. Its final pseudocode window1969–2067 was reviewed, plus complete helpers0x140d02ea0,0x140d026a0,0x140d09950 and0x140a67820. Independent disassembly confirms branch/call destinations and owner-pointer clearing at0x141327dd0..0x141328008. The first requested disassembly window began inside an earlier instruction; no semantics are attributed to those initial misaligned bytes. The described branch starts at independently aligned0x141327dd0, also visible in the full-function sibling disassembly.

The owner field+0x4d8 is tested nonnull. A local full-removal flag derives from record flags0x20010, caller byte and a special record type0xee with flag0x40 or empty+0x80 vector. Helper0x140d02ea0 receives record, owner and that flag. Selected typed references0xe/0x1b are additionally removed for type0x6c/0xd4; typed reference0x13 removal is always attempted. Full-removal path conditionally calls0x140a67820, or retains/requeues through a reference branch, writes record+0x24=−1 and clears flag0x40. Finally owner+0x4d8 becomes zero, two globals become1, coordinate-like sentinel fields+0xc0/+0xc4 are assigned and three owner-vector end pointers reset to their beginnings. Not every cancellation destroys the record.

Helper0x140d02ea0 walks the record's item-association vector backwards. With full-removal true it removes all associations; otherwise it retains category values2..4. It clears flagmask0x2c on the record and clears bit0 on remaining association flags. Type-dispatched additional references invoke unresolved helpers and virtual destructors. No clinical/job-enum names are assigned to numeric kinds without RTTI or another exact consumer.

Helper0x140d026a0 removes the selected association. It searches the associated object's reference vector for kind2 pointing back to the original record, frees that small reference and erases its pointer. In one branch it clears bit1 on the associated object's+0x10 only if no kind0xc reference remains. It then frees the forward association and erases it from the original vector. That is a real bilateral-reference cleanup pattern. It is not proof that already-consumed material quantities are replenished.

Helper0x140d09950 walks another vector backwards, calls virtual type query at+0x10, invokes destructor-like slot+0x78 for matching kind and erases each pointer. Helper0x140a67820 first calls unresolved0x140d022c0 and the full association cleanup, unlinks a doubly-linked node, frees that node, destroys several record-owned containers/string and frees0x148 bytes. “Job”, “item reservation” and “destructor” remain domain interpretations supported by the cancellation route and object operations; exact source symbols were not recovered.

**Boundary.** This closes a selected detach/unlink/delete path beneath cancellation. It does not prove atomic reserve/commit/refund, interrupt behavior for every reaction, no material duplication, product insertion rollback, all virtual destructor effects, saved-state consistency or ownership after transformation. The beginning and most case-specific branches of the2067-line cancellation pseudocode remain unread in this independent audit.
