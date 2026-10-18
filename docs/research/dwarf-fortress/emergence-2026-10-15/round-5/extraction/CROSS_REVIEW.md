# Independent sibling review

Reviewed auditor-owned retained pseudocode `round-5/audit/extract/native-0x141345c40.c` lines215–305,599–662,1170–1238. These three positive virtual+0x480 calls pass1 to an entry drawn from the local puStack_d8..puVar32 accumulator after matching four item type/subtype/material getters. Fallback creates an item via0x140c9a510 and registers/places it before adding to that accumulator. This supports coalescing recovered/output material; it does not yet establish identity of the original consumed source item.

The pseudocode carries a bad-instruction warning and is a selected review, not whole-function certification. Concrete Cancel anchor and exact native branch/context proof remain auditor-owned. No sibling lines are added to extraction source coverage. Full audit conclusions are tracked in the sibling audit report when released.

## Actual construction cancellation route

Fresh independent binary disassembly and literal decoding confirm selected native UI distinction, rather than relying on a string alone. UI stage virtual+0x118 zero chooses literal `Cancel construction` at0x141600eb8; nonzero chooses `Remove building` at0x141600ea8. The selected input-handler branch at0x1401b0211 tests the same virtual slot result, calls0x140587d80 at0x1401b0226 withEDX/R8D/R9Dzero for stagezero, and calls virtual+0x168 at0x1401b0237 otherwise. This establishes a concrete selected branch, not every input dispatch link.

Read/reproduced teardown first0x70bytes only,0x140587d80–0x140587df0. It marks object+0x24 bit0x10, calls0x140586ac0, queries virtual+0xd0, then calls virtual+0x230 at0x140587de2. Crucial policy caveat: even though inputflagszero, EBP initialized1 and CMOVNEfromEBX means type4 forcesEDX1 for this virtualcall; other types inheritzero. R8 retains the inputzero. Therefore an unconditional release-all/materialrefund description would be premature. Actual virtualtarget/contained-item behavior remain auditor-owned pending exact trace.

Private `notes/sibling-checks.json` retains exact offsets, literal bytes,3fresh LLVM argv,raw windows and hashes. `tools/review_sibling.py` reproduces them. No additional whole native body was decompiled or counted.

## Confirmed contained-item identity slice

Independently reproduced7additional exact LLVM windows and decoded selected jump-table bytes. Teardown tail0x14058898b–0x1405889c0 calls0x1405a78e0 at0x1405889af unless building+0x24 bit0x20. Selected global-vector match is a gate in5a78e0; its window0x1405a7916–0x1405a7965 calls buildingvirtual+0x210, thennonnull buildingvirtual+0x2c0 withEDX1. Actualst vtable0x141620860 slot88 pointer independently reads0x14028ba50; full RTTI identity was supplied by sibling, not rederived here. Stub call0x14028ba5f reaches0x140583390; optionalbuildingfree afterwards concerns the building allocation, not an item.

Destructor window0x140583390–0x140583424 reverse-iterates building+0x128/+0x130 wrappers, loads each wrapper's first pointer, and calls0x140c634f0(item,mode2). This exactly matches round4placement's holder-wrapper layout. Initial itemrelease window0x140c634f0–0x140c6352f preserves the passed item inR15, clearsitem+0x10 bit0x20 anditem+0x14 bit0x8, and conditionally calls0x140c911d0. These are flag/reference operations, not stack-count restoration.

The typed reference casekind0x24 resolves from tablebyte35(index12) to0x140c64230. Selected range0x140c64230–0x140c64335 gets its referenced holder, checksvirtual+0xe8, reverse-scans holder+0x128 wrappers and compares wrapper->item against the **same R15 item pointer** at0x140c6429b. The freeat0x140c642cd receives a16-byte **wrapper**, followed by vectorerase; it does not receiveR15item. A subtype2 wrapper may trigger virtual+0x2c8 and recursivebuildingteardown, so not every branch is a simple return. Common0x140c63d87–0x140c63dcc destroys the general-reference object via+0x78 and erases it from the item's reference vector.

This validates an identity-preserving contained-item unlink/release slice for the selected construction path. It does not prove a positive countdelta, recreation of already consumed materials, terrain/floor delivery, every virtualimplementation or complete later itemlifetime. Floor/world availability still depends on the remainder of itemrelease and helpers, which this cross-review did not read. All exact branch/state gates remain required. No full large-function decompile or whole-function absence claim was added.
