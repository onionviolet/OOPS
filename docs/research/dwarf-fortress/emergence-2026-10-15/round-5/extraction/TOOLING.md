# Tool receipt

Read-only input: pinned PE and prior round1–4 reports/extracts. Own writes restricted to round5/extraction and private matching root `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-5/extraction`. No shared tool/runtime modification. No inherited Java/Ghidra worker was found before startup; own REA process completed normally in7.76s. Existing tools only.

Exact repeat commands:

```sh
python3 /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-5/extraction/tools/inspect_unwind.py
python3 /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-5/extraction/tools/rea_pass.py
python3 /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/round-5/extraction/tools/capture.py
```

`inspect_unwind.py` checks the binary hash, enumerates selected .pdata intersections, followsCHAININFO, parses PE imports without loading them, retains metadata, and captures handler-thunk disassembly. `capture.py` records precise raw bytes/offsets/commands and extracts full one-function pseudocode. `publish.py` writes paraphrased public findings. `validate.py` will verify pinned data, imports, chain roots and exact instruction bytes, plus source/private receipt integrity.
