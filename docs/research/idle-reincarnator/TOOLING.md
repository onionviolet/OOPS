# Tooling and rerun record

No tool was installed globally or user-locally. Python 3, git, curl and existing Homebrew `libzstd.dylib` sufficed. No game executable, game scripts, GDRE binary or reconstructed project was run.

## Routes and provenance

| Tool/source | Result | Pin or artifact |
|---|---|---|
| GDRETools/gdsdecomp source clone | Successful shallow clone; README/build route inspected | `e2780fcc73ab14083967d3945e513d1f6af1dbd0`, scratch `repos/gdsdecomp` |
| GDRE source build | Not attempted after checking requirements; it requires a Godot engine checkout/rebuild, not a small standalone compiler | README “Compiling from source”; no scons found on PATH |
| GDRE 2.7.4 macOS release | Download timed out after about 90 seconds, 7,616,057 of 71,380,501 bytes; incomplete ZIP retained, never unpacked/run | `repos/GDRE_tools-v2.7.4-macos.zip` |
| GitHub release metadata via web API page | Web route returned internal error; switched to release HTML asset listing | `notes/release-assets.html` |
| Original Python PCK reader | Successful extraction of 1,764 files; every entry MD5 checked | `tools/extract_pck.py`; `extract/manifest.json` |
| Original Python GDSC token decoder | All 234 buffers decoded, zero errors, exact buffer consumption | `tools/decode_gdc.py`; `extract/decoded/DECODE_STATUS.json` |
| ZSTD dependency | Existing `/opt/homebrew/lib/libzstd.dylib`, versioned library 1.5.7 | Called via ctypes solely to decompress data |
| Godot 4.5 format references | Downloaded and read, not executed | `file_access_pack.cpp` format checked on official raw page; local `gdscript_tokenizer_buffer.cpp`, `.h`, `gdscript_tokenizer.h`, `marshalls.cpp` |
| JSON inventory | 75 parsed tables, 651 content rows | `notes/content_inventory.json` |

Primary tool references: [GDRE source](https://github.com/GDRETools/gdsdecomp/tree/e2780fcc73ab14083967d3945e513d1f6af1dbd0), [Godot PCK reader](https://github.com/godotengine/godot/blob/4.5/core/io/file_access_pack.cpp), [token buffer format](https://github.com/godotengine/godot/blob/4.5/modules/gdscript/gdscript_tokenizer_buffer.cpp), [token enum](https://github.com/godotengine/godot/blob/4.5/modules/gdscript/gdscript_tokenizer.h), [Variant decoder](https://github.com/godotengine/godot/blob/4.5/core/io/marshalls.cpp). [Steam source identity](https://store.steampowered.com/app/3779340/Idle_Reincarnator/) was opened for provenance; gameplay conclusions come from the installed pack.

## Commands that worked

These commands run only data-inspection tools authored in the work area. No Windows executable is launched.

```sh
python3 -I /Users/weiwei/.codex/research/idle-reincarnator/tools/extract_pck.py   '/Users/weiwei/Library/Application Support/Steam/steamapps/common/Idle Reincarnator/Idle Reincarnator.exe'   /Users/weiwei/.codex/research/idle-reincarnator/extract
python3 -I /Users/weiwei/.codex/research/idle-reincarnator/tools/decode_gdc.py   /Users/weiwei/.codex/research/idle-reincarnator/extract/pack   /Users/weiwei/.codex/research/idle-reincarnator/extract/decoded
```

A report writer is retained at `tools/write_report.py`; review it before rerunning, since it replaces this lane's analysis files. It writes no other repository path. The validation recipe is in `tools/verify_outputs.py`.

Extraction does not trust arbitrary `GDPC` byte occurrences in executable instructions: it uses the footer length and validates the embedded pack header, offsets, path containment and MD5. GDSC decoder uses format v101, reads only supported Variant constants and rejects unexpected ones. Original source line numbers are preserved in token records and the text rendering; original comments/whitespace are not. Multiline strings can leave unusual line breaks in rendered text. The rendering was read, never treated as runnable code.

## Dead ends and fixes

- E1: initial exploratory magic scan tried to read a header at the trailing four-byte magic and failed. Corrected by using the footer boundary/length; all later extraction checks passed.
- E2: optional `zstandard` Python import was unavailable. Switched to the existing libzstd through ctypes; no pip install needed.
- E3: first token pass decoded 232 files. One addon NodePath constant and an empty old_player buffer were unsupported. Added these cases from the Godot format, reran, and decoded all 234.
- E4: the prebuilt release download was too slow for its timeout. Switched to the local PCK/token-decoder route; no download retry or prebuilt execution.
- E5: one exploratory shell glob hit an incomplete source clone before checkout, and two guessed UI filenames were absent. Switched to actual `rg --files` paths. These did not affect extraction or findings.

Source clone was read only. All raw game data/code, tool source and download bytes remain under the work area, outside git. `extract/HASHES.txt` contains SHA-256 records for the source executable, every pack extract and every decoded artifact. Source license/attribution was not modified; no source-game reuse permission is asserted.
