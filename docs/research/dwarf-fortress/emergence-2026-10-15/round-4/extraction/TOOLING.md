# Round4 extraction tooling

Own private root: `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-4/extraction/`. Prior rounds and paired audit are read-only. Live process check found no inherited Java/Ghidra session. Two focused REA sessions used separate round4 temp/seed paths and closed normally.

Reused pinned executable build24557528 and existing REA6.4.0/Ghidra12.1.4/JDK21 with the inherited `-noanalysis -max-cpu 2` patch. First batch targets only `0x1407df320` and `0x14054bdc0`; second batch only output count setter `0x1400fc5b0`. No broad native analysis, installs or downloads.

`tools/rea_pass.py` and `tools/rea_setter.py` retain exact MCP/open/batch commands, environments, seeds and stderr. `tools/dump_assembly.py` uses existing Apple LLVM21.0.0 `/usr/bin/objdump` to retain selected bytes and function mappings. Factory has an87byte `.pdata` region; setter has an exact28byte leaf body. Placement's first170byte unwind range is incomplete, so a separately labelled308byte reached-code envelope includes its final return and cross-chunk branches. No contiguous envelope is promoted to a single recovered C++ function declaration.

A narrow caller window `0x140cc9863–0x140cc9930` preserves source-accounting/output gating and exact factory→setter→lifecycle→placement→reservation calls. Glob RTTI and slot145 are reused from a stable prior map and independently checked against the pinned executable bytes. Base constructor, allocator, reference insertion and virtual slot101 semantics remain unread.

`tools/finish.py` writes exact command/byte/hash receipts, cumulative coverage, evidence ladder, output hashes and VALIDATION.json. Broad linear-disassembly branch counts remain candidates, not complete control-flow evidence. Only selected semantic edges are interpreted.

All orchestration used standard-library Python in isolated mode and existing Node/REA. No game, target Windows executable, shipped Lua, personal save or configuration was executed or changed. No runtime code, canonical design owner, commit or push was touched.
