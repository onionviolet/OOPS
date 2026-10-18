# Exact exception and pointer evidence

Pinned binary `/Users/weiwei/.codex/research/bf-dwarf-fortress/extract/payload/Dwarf Fortress.exe`, SHA256 `205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7`, imagebase0x140000000. Native PE x64, not managed. Static extraction only.

## F1. Unwind ranges

| Root/continuation | End exclusive | UNWIND_INFO RVA | Flags | Resolution |
|---|---|---|---|---|
|0x140cc9230|0x140cc930d|0x182d838|0|root, no handler|
|0x140cc930d|0x140cc99c7|0x182d848|4|chains to first row|
|0x140cc99c7|0x140cc99f5|0x182d868|4|chains to first row|
|0x14054bdc0|0x14054be6a|0x17e6028|0|root, no handler|
|0x14054be6a|0x14054becc|0x17e6bd4|4|chains to preceding root|
|0x14054becc|0x14054bef4|0x17e6bec|4|chains to preceding root|
|0x1407df320|0x1407df377|0x17e68d8|2|handler0x14153aa60|

Private `notes/unwind-map.json` retains every record's file offset, raw header/code/tail bytes and resolved chains. Flags4 denotes a chained runtime-function record, not itself a language handler. Handler tail follows 4-byte header and even-padded2-byte unwind slots. All selected chunks were enumerated from .pdata, not guessed from neighboring metadata.

## F2. Factory and cleanup

Factory UNWIND_INFO offset25058008. Handler data contains FuncInfo RVA0x17e68e8 at offset25058020; the referenced metadata begins at offset25058024: `28 09 e5 7b 01 df df 7b 01`. Candidate relative map address0x17be509 (offset24893193) starts `02 0e 80 ea 53 01`; candidate IP/state address0x17bdfdf (offset24891871) starts `04 16 00 24 02`. The four-byte candidate actionRVA0x153ea80 maps to an actual executable funclet. These precise joins are retained, while complete compressed FH4 map/state decoding remains unverified. No runtime throw was induced.

Factory call0x1407df32b allocates0xd0 via0x141539690. ReturnRAX moves toRBX at0x1407df330 and `[rsp+0x30]` at0x1407df333. Base constructor call0x1407df33d uses the same pointer. Construction then installs glob vtable0x1416bdbc0 and initializes material fields. Native instruction widths and exact stores were reread from the87-byte factory.

The complete funclet `0x14153ea80–0x14153ea9d` (29bytes) receives the parent frame inRDX, copies it toRBP, readsRCX from`[RBP+0x30]`, setsEDX=0xd0, calls0x141539680 and returns. Bounded pseudocode agrees: `func_0x141539680(*(parent_frame+0x30),0xd0)`.

Three exact tail jumps complete the pointer-preserving route: `0x141539680–0x141539685 → 0x1415399dc–0x1415399e1 → 0x14153aaa8–0x14153aaae → IAT0x1415e59a8`. Import descriptor identifies `api-ms-win-crt-heap-l1-1-0.dll!free`. The size argument is ignored by this final import route. The handler thunk separately maps through IAT0x1415e5900 to `VCRUNTIME140_1.dll!__CxxFrameHandler4`. None of these code windows adjusts item+0x80 or source accounting.

## F3. Reproduction and boundaries

Raw commands are in `tools/inspect_unwind.py`, `tools/capture.py` and `tools/rea_pass.py`. Run those with existing Python3, AppleLLVM `/usr/bin/objdump`, existing source-builtREA/Ghidra12.1.4/JDK21. REA uses -noanalysis, max2CPU, privateTMPDIR and one function seed0x14153ea80; no full native analysis. Full JSON and .c retained. Seed-only function metadata does not give complete xrefs; no absence-of-caller claim is made.

Each raw code interval and file offset plus exact objdump argv is saved in `notes/instruction-receipts.json`; each interval also has standalone .bin and .txt. Metadata .bin captures retain48/64/64bytes respectively. Bytes beyond the interpreted prefix remain retained-unread. Neither absent local language handlers nor fresh allocation free proves global nonrefund, exception recoverability, completion atomicity, game execution or gameplay outcomes.
