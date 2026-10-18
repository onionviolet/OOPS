# Round3 static native route

Recovered round2 pins, live worker state and separate auditor ownership before writing. No prior REA session/project remained. Used separate round3 TMPDIR/seed files and the same existing patched REA6.4.0/Ghidra12.1.4/JDK21 route with `-noanalysis -max-cpu 2`. No installs, downloads, game or Lua execution.

Private root: `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-3/`. Binary reused read-only from `bf-dwarf-fortress/extract/payload/Dwarf Fortress.exe`; current install and retained binary share pinned SHA256. All custom scripts run under system `python3 -I` with standard-library-only capture/orchestration.

`tools/map_native.py` reuses the PE/.pdata/RTTI mapping method with syndrome/simple-flag/transformation/attribute targets. `rea_pass.py`, `rea_more.py`, `rea_life.py`, `rea_tick.py` and `rea_final.py` issue focused batches and close their own MCP sessions normally. Their exact seed files and REA envelopes are retained. Native labels are analyst names, not original symbols. The intermediate adjacent injury candidates were captured but did not identify the expiry scheduler; their unread ranges are explicit.

Actual successful route: interaction apply `0x140c52cf0` → syndrome admission `0x1413c5ef0` → updater `0x1413dcd00` → all-inactive AL result → source-matching cleanup/active-vector erase in bounded native owner window `0x141355916–0x141355c16`. No whole analysis of its40,600byte enclosing region was needed.

`tools/dump_assembly.py` uses existing `/usr/bin/objdump`, Apple LLVM21.0.0, to decode selected `.pdata` regions or marked32byte leaf windows. It records exact commands, raw-byte hashes, address/file-offset maps and direct-branch candidates. Three further manual LLVM windows start at known call instructions `0x1404dd644`, `0x1404ddb94` and `0x141355916`, with512/512/768bytes respectively. Their exact arguments are recorded by the final receipt. These are call contexts, not whole enclosing functions.

Important representation limits: Ghidra seed/noanalysis FunctionManager extents can remain one byte while the decompiler follows additional code. LLVM's linear decoding can interpret embedded jump-table data as instructions. The updater's `.pdata` tail contains such data after its `ret`; it is not promoted to executable code. Selected semantic call edges are supported by actual caller/callee reads and decoded instruction bytes; broad call counts remain candidates. The void decompiler signature for the updater is corrected by its `test %sil; sete %al` epilogue and callers testing AL.

`tools/finish.py` regenerates cumulative coverage, exact unread complements, public evidence map, source/tool hashes and validation. It checks source pins, selected region bytes, branch displacement arithmetic, field-write/return instruction anchors, source links and all JSON. Those are archive/static checks, not runtime verification.
