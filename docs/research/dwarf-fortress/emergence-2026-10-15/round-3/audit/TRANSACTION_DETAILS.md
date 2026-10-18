# Native transaction path and exact limits

All addresses apply only to executable SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`. [READS.json](READS.json) pins full private source/assembly files with hashes and reviewed ranges. Analyst names below are interpretations; actual native RTTI class names and exact offsets are identified separately.

## DF-JR01: acquisition is the inverse of a selected detach path

`0x140d028e0` receives a job-like record, item-like object, category, metadata and insertion index. Its mutation core independently decoded at0x140d0291c..0x140d02a19 performs these operations:

1. Allocate24 bytes, set32-bit kind2 at+0, pointer back to the record at+8, zero trailing8 bytes; append pointer to the object's+0x20/+0x28/+0x30 vector.
2. Allocate another24 bytes; set object pointer at+0,32-bit category at+8 and32-bit metadata at+0x10. Insert at a valid nonnegative index in the record's+0x80 vector or append when out of range; vector allocation helpers are called if capacity is full.
3. For category other than6, test object flagbit2. In the selected mode, an already-set flag produces a duplicate-tag diagnostic, but only after both associations were appended. The final operation setsbit2. The diagnostic is not a local admission rejection or rollback.

This is concrete bidirectional association acquisition, not merely a message string. It connects to round2's0x140d026a0, which frees/erases the selected forward record and searches the object for kind2 pointing back to the same record. `0x140d02ea0` selectively removes associations; full-removal flag changes which categories survive. Round2 owns complete selected cancellation details; no previous directory was changed.

**Selection caller.** `0x140a35890` checks whether the current record's association vector is empty, builds a search descriptor and calls0x140a26990. A nonnull result enters0x140d028e0 with category1 and metadata−1. Failure clears record flagbit1 and calls the known cancellation owner0x141325080 with a diagnostic descriptor. Thus resource search, successful association and explicit failure cancellation are linked in actual code. Search/path/ownership predicates inside0x140a26990 remain unread. `0x140a35aa0` has a related indexed acquisition path; no result means no association, without the same shown cancellation call. Do not unify their failure behavior.

`0x14036b0c0` supplies another job construction consumer: it allocates0x148 bytes, initializes through0x140d020c0, writes record type0xf, associates an object with category2, adds a typed reference and appends the record to another owner's vector. Later removal of a matching record calls0x140a67820. These native job-like records can belong to NPC and world controllers rather than only a player UI. Neither this function nor generic owner-field access establishes an autonomous planner's priorities.

## DF-JR02: count mutation differs from unlinking and removal

Selected dispatch body `0x140dac290`, reviewed source windows315–405 and1890–2045, operates through owner+0x4d8. It has many unread cases. One selected branch tests item virtual+0x528. If false and item type is neither0x17 nor0x2e, it queries virtual+0x478. A signed result<2 calls0x1402567f0; otherwise virtual+0x480 receives−1.

The call core is independently visible at0x140dafaf9..0x140dafb3a. This is actual consumption of one count in the selected admitted branch, not a generalized recipe-size formula.

**RTTI/ABI join.** Six actual MSVC RTTI chains were mapped: item_actualst, item_barst, item_globst, item_threadst, item_corpsest and item_corpsepiecest. Their supplied vtables resolve virtual+0x478 to0x1400fc190, virtual+0x480 to0x1400fc590 and virtual+0x488 to0x1400fc5b0. Exact type descriptor/COL/vtable addresses are retained privately in `notes/item-native-map.json`. Only the selected pointer slots receive semantic claims; scanning180 code pointers does not prove a complete ABI table boundary.

`0x1400fc190` reads32-bit object+0x80 and returns it. `0x1400fc590` adds signed32-bit delta to object+0x80, uses the sign of the resulting32 bits to clamp negative values to0, then clears object flag0x20000000. It contains no positive upper-bound clamp or overflow guard. `0x1400fc5b0` clears the same flag, assigns32-bit value to+0x80 and clamps negative input to0. Full instruction bodies are retained separately, with return/padding boundary visible. These observations make the field's count interpretation much stronger than a function-name guess.

**Removal request is not immediate free.** Full25-line pseudocode at0x1402567f0 checks a flag0x100000, may detach through0x140c634f0, optionally processes another reference and clears high flag0x80000000, calls virtual+0x330, inserts into a manager structure at+0xcf0 and calls0x140c67590. There is no direct free of the item allocation in that body. The right phrase is removal request/registration, pending those downstream consumers. Earlier exploratory messages called it deletion shorthand; the saved finding uses the narrower evidence.

**Local cancellation implication.** The acquired association records store object/category/metadata, not a captured full copy of object+0x80. The selected detach helper's known inverse work removes those links. No corresponding positive item-count addition is shown in that detach path. This does not prove that another caller never restores stock or that all work consumes materials before cancellation.

## DF-JR03: partial body material extraction and produced objects

The dispatch makes a separate branch for types0x17 and0x2e. These identifiers are independently linked to item_corpsest and item_corpsepiecest: RTTI vtable slot0 points to leaf bodies0x140079eb0 returning0x17 and0x14028c660 returning0x2e. After detaching the selected association via0x140d026a0, the code calls0x140cc9230; a true result leads to0x1402567f0 for the original corpse item. This is a body/material processing path, not a generic arbitrary partial-stack splitter.

`0x140cc9230` full270-line pseudocode was reviewed. It checks a subtype/state byte, race-like and caste-like indices against native vectors, then loops body-material/tissue definitions and item-held bit/quantity arrays. Eligible material fields are resolved through0x1414add70 and0x140709800. Already-marked records are skipped. Numeric amount calculations use native structure fields, body/material ratios and existing extracted quantities. The exact clinical/material meaning of every field remains unresolved; raw arithmetic is retained privately without inventing named quantities.

A count is derived by signed64 division by2500 and raised to at least1. Existing matching extraction records' positive amounts reduce that count, clamping the remainder at0. A flags argument selects material/definition conditions. When remaining requested amount is positive, the processed amount is the smaller of remaining request and computed available count; it decreases remaining request and increments an output accumulator.

If the entire computed available count is taken, the definition's consumed bit is set. Otherwise a new0xa8-byte per-body record is allocated, initialized with field sentinels, source material/body indices and the partial extracted amount at+0xa0, then appended through0x1400ba380 to a body record obtained by0x140cb4050. This is explicit retained partial-extraction state, not deletion of the entire source by definition.

When a caller flag and nonnull job/placement owner permit output, it obtains a new item via0x1407df320, sets its count through virtual+0x488, writes source material identifiers, invokes virtual+0x328 with1, calls0x14054bdc0 with the destination owner, then associates the produced item with the job via0x140d028e0. These are actual native creation/configuration/placement/association calls. The exact factory type, ownership transfer internals and placement failure/refund policy remain unread; no claim is made that the output was visibly delivered.

If any eligible material remains unprocessed, an item virtual+0x188 is invoked and the function returns false. Otherwise it returns true after relevant loops. This flag controls whether the caller requests removal of the original corpse. New output can coexist with retained source/body state when only part was extracted. The caller does not use the general stack count−1 branch for these types.

## DF-JR04: complete boundary map, incomplete transaction proof

| Stage | Proven selected native operations | Still unread |
|---|---|---|
| Find material/item | Two acquisition callers build descriptors and call0x140a26990; one failure reaches cancellation. | Search admission, owner rights, path feasibility, lock conflicts and selection priorities. |
| Reserve/link | Bilateral records inserted and item flag set; diagnostic can follow duplicate state. | Atomicity if allocation/insertion fails, exclusivity across simultaneous actors, persistence. |
| Begin/use | Main dispatch gates several branches through record fields and virtual predicates. | Exact job enum and complete cost/interrupt boundaries. |
| Consume partial stack | Count≥2 is reduced by1 through a verified item method; small count requests removal. | Full recipe quantity scaling, semantic purpose of the selected task branch, later removal completion. |
| Consume body material | Partial extraction amount record/consumed-bit paths and native corpse-type dispatch. | Every material predicate, ratio field name and downstream corpse/world state. |
| Produce/place | New item count/material initialized, placement/helper called, output associated with job. | Output capacity/ownership and failure path, guarantee of valid receipt. |
| Cancel/unlink | Selected known cancellation branch and inverse association helper remove references; record can be retained or freed. | Every job-type branch, post-consumption cancellation behavior and virtual cleanup effects. |
| Refund/rollback | No restoring quantity delta found in the selected acquisition→consume→detach paths. | Actual consumed-material refund consumer; whether specific jobs refund; atomic restore of output/input when placement fails. |

The whole native call-candidate inventory and retained dispatch let a later pass choose the missing consumer. The study did not search the entire binary for all count additions, execute recipes, test a cancellation or inspect any save. Therefore the safe conclusion is selected consumption and selected cleanup recovered; general refund behavior unresolved.

## Scope of deeper decompilation

Nine initial helper/caller targets were chosen from direct known association-helper references and adjacent native operations, then three further targets closed the selected removal/body-material branch. Five tiny leaf windows establish count/type behavior. One3204-line captured function is a description formatter, not transaction evidence, and remains unread. The8022-line action dispatch has a few declared read windows; capture is not semantic completion. [UNREAD.json](UNREAD.json) gives exact complements. Rerun tools and all source bytes stay private; public docs paraphrase the logic.
