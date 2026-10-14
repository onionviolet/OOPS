# Tooling and reproduction

Read-only payload: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/NGU IDLE/`. Steam app 1147690, build 6938742. Gate inspected executable and appmanifest StateFlags 4, staging 0 and matching downloaded/staged totals. Private account identifiers from the manifest were not copied to the report. No executable, injector, game, save or bottle was opened.

Work area: `/Users/weiwei/.codex/research/ngu-idle/`. No clones, external repositories or tool installs. Reused .NET SDK 10.0.402 / ILSpy tool as supplied by COMMON; actual version checks are retained in private notes/tool-versions.txt. No recovered project compilation or execution.

Commands that worked:

```sh
DOTNET_ROOT=/Users/weiwei/.dotnet /Users/weiwei/.dotnet/tools/ilspycmd -p -o /Users/weiwei/.codex/research/ngu-idle/extract/assembly '/Users/weiwei/Library/Application Support/Steam/steamapps/common/NGU IDLE/NGUIdle_Data/Managed/Assembly-CSharp.dll'
rg --files /Users/weiwei/.codex/research/ngu-idle/extract/assembly
python3 -I /Users/weiwei/.codex/research/ngu-idle/notes/write_report.py
python3 -I /Users/weiwei/.codex/research/ngu-idle/notes/finish_report.py
```

Use a fresh empty extraction directory on rerun and update evidence paths/hashes. Export command exited 0 with empty diagnostic output. Private `extract/HASHES.txt` records the original assembly and every exported file hash. FINDINGS.json pins the selected readers and screenshot. A decompiler's success does not prove the recovered source compiles or exactly reproduces Unity behavior.

Public route: web tool opened the official Steam page. Python standard-library urllib fetched `https://store.steampowered.com/api/appdetails?appids=1147690`, saved notes/store-appdetails.json and downloaded only screenshot 0 from its returned official URL. The screenshot was visually inspected with view_image. No third-party downloaded code was run. Steam screenshot is historical build 0.427-2.

Dead ends and route changes: Fandom Rebirths and Challenges fetches returned 402; switched to game-vault mirror. Rebirths mirror was inaccessible and Challenges mirror 404; switched to installed primary source. Search snippets and a 2019 Steam discussion were leads only, not foundations for technical claims. No repeat fetch variants or logins. No wiki dump collected. One search assumed class names AllBeards/AllDiggers that do not exist; actual export inventory corrected readers to AllBeardsController and active Character reset fan-out. A shell glob for field_renewal found no file; source inventory located structured_renewal.js. No retries or installs needed.

Local artifact checks: JSON parse, evidence paths and hashes, required filenames, at least 20 small touches, report/checkpoint status and no decompiler diagnostic markers. Validation is recorded in VALIDATION.json. These are research checks; no YAIRPG tests/build/browser gameplay ran.
