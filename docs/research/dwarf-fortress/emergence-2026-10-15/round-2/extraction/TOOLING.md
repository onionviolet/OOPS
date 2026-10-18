# Native extraction receipt and repeat flow

2026-10-15, research only. No installs, downloads, game execution, shipped Lua execution, saves, configuration changes or YAIRPG implementation.

## Existing route recovered

Inspected `docs/research/dwarf-fortress/aspects-2026-10-14/` and its actual CHECKPOINT/TOOLING plus private `bf-dwarf-fortress` notes. The old worker had closed normally; no persistent files remained in `notes/rea-temp`. Four prior native outputs covered save/load failures and text loading. The prior selector's jump table was still unresolved. None answers the selected healing/job lifecycle questions.

Reused existing REA source-built6.4.0 at `/Users/weiwei/.codex/research/hogwarts-legacy/repos/rea-pinned/`, archive commit `bb540826d65316c164d2de8ba4ef10f81a8ad073`. Existing Ghidra12.1.4 is `/opt/homebrew/opt/ghidra/libexec`; JDK21 is `/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`. The inherited compiled launcher is locally patched with `-noanalysis -max-cpu 2`; tool hashes are recorded in this round's receipt. The apparent default-analysis-complete wording in REA's envelope does not override that actual launcher configuration.

## Target selection

`tools/map_native.py` parses the pinned PE image/sections and `.pdata`. It scans selected literals and candidate RIP-relative LEA patterns, then independently maps three MSVC type descriptors through complete-object locators to consecutive virtual-method pointers. Every offset is computed from the section table, not assumed VA-minus-base file layout. RTTI class identity is structural evidence; virtual method purpose still requires reading its code.

`tools/rea_pass.py` opens the retained binary using the Ghidra provider, seeds10selected function entries and batch-decompiles them in one session. `tools/rea_more.py` batches12selected functions, including four repeats for a shared connected session and eight helper targets; it also captures four function dossiers. Both use the existing MCP protocol and environment, a private TMPDIR and normal child shutdown. No whole-image automatic analysis was performed. The ephemeral import exists only for the session; original executable bytes remain read-only.

The result is18unique function candidates. FunctionManager's body for the four dossier targets is only the entry byte, assembly lists are empty, and callers/callees are empty. The decompiler follows more code than those stored bodies. Therefore we do not use those empty relationship lists to assert absence or complete call coverage.

## Independent instructions and call edges

Existing `/usr/bin/objdump` is Apple LLVM21.0.0 and decodes the pinned PE as `coff-x86-64`. `tools/dump_assembly.py` issues exact start/stop-address commands for selected `.pdata` regions, or a clearly marked32byte window for leaf entries absent from `.pdata`. It caps each admitted region at15000bytes, retains full assembly/stderr and extracts actual direct E8 calls/jumps with source addresses and file line locators. It separately disassembles the six literal-reference addresses and confirms target VAs.

That produces18bounded instruction regions and400direct call/jump records. This count is decoded instruction breadth, not400semantically reviewed calls. It confirms the selected connected edges in NATIVE_CONSUMERS.md. `.pdata` describes unwind regions and can split or omit logical functions; leaf windows are not promoted to full-function bodies. Decompiler types, signatures and bit meanings stay qualified.

## Mechanical commands

All custom scripts are in `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/tools/`; all raw outputs are in that round's `extract/` and `notes/`.

```sh
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/tools/map_native.py
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/tools/rea_pass.py
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/tools/rea_more.py
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/tools/dump_assembly.py
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-2/tools/finish.py
```

The first exploratory native-string print used a one-line JSON file and produced excessive output; subsequent string queries filtered JSON before printing. An exploratory source glob did not exist and zsh rejected it; known source paths replaced it. Neither issue changed the binary or research results. System Python had no capstone module; existing LLVM supplied the independent route with no install.

For the next native question, begin with the current round's hashes and exact named gap. Reuse these outputs; do not repeat import/disassembly merely to recover the same selected methods. Query the slot3 caller/expiry dispatcher or one named job-role enum consumer, then append a new bounded read record. Current readable-source coverage remains the prior selected16files, with all unread ranges preserved.
