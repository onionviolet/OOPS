# Tooling and reproduction

No installs, new clones, launches, injectors, console commands, native computer control, personal save reads, builds, game tests, staging, commits or pushes. Main checkout branch observed: `codex/gameplay-foundations`, despite the prompt's main shorthand. Existing mixed dirty state belongs to other lanes and was preserved. Only `docs/research/hearts-of-iron-iv/aspects-2026-10-14/` was written inside this repo.

## Pins and private artifacts

| Item | Evidence / location |
| --- | --- |
| Install | `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Hearts of Iron IV` |
| Fresh manifest fields | app 394360; build 25205862; exact install directory. No private manifest/account fields retained. |
| Native file | x86_64 Mach-O; 70,995,992 bytes; SHA-256 `09419b087f8b4656c00df337bf838ff34c9b1d816b76cef5383ae6a4ac15b1fb` |
| HoI4/Clausewitz rev markers | both `c01a3d507f10bd8c713e88234de69ca110618138`; branch marker is literal None. This is not source-code access. |
| Prior work, read-only | `/Users/weiwei/.codex/research/hoi4/`; census/tokenizer, declaration counts and parser source reused without writes. |
| Parser | https://github.com/rakaly/hoi4save ; exact locally verified commit `a3f1e65ec2da113652152a00aa32631182bbc03f`. No build/run/fixture in this pass. |
| This work | `/Users/weiwei/.codex/research/asp-hoi4/`; tools, notes, extract, empty repos directory. |
| Raw capture | `extract/raw/`; 5,644 selected text files, 122,176,518 bytes; nested original source paths. All English localization, common rules, events, history, interface, tutorial, script and documentation text captured; selected map/sound/tests text too. |
| Parsed text | `extract/english_localisation.jsonl`; 129,197 rows and unique parsed keys, preserving full text/source/line. Regex covers ordinary quoted YAML entries; no claim to be a full YAML parser. |
| Event bodies | `extract/events-index.jsonl`; 6,974 declaration bodies, conditions/options/effects preserved as repeated-key arrays. Raw source is authority for parser ambiguities. |
| Census | `extract/inventory.json`, `top_definitions.json`, `structural_counts.json`, `scripted-gui-definitions.json`, `capture_summary.json`. |
| Native evidence | `extract/binary-selected-strings.txt`; 134 matches from read-only strings. These are type/diagnostic/token evidence, never recovered function bodies. |
| Hash records | `extract/SOURCE_HASHES.txt` binds original installed text; `source_manifest.json` includes sizes; `HASHES.txt` binds lane extracts including full raw captures. `source_verification.json` records original and copy comparison. |

## Commands that worked

```sh
python3 -I /Users/weiwei/.codex/research/asp-hoi4/tools/capture.py
python3 -I /Users/weiwei/.codex/research/asp-hoi4/tools/index_events.py
python3 -I /Users/weiwei/.codex/research/asp-hoi4/tools/write_reports.py
python3 -I /Users/weiwei/.codex/research/asp-hoi4/tools/validate.py
```

`capture.py` copies only selected read-only source text into this lane, hashes it, builds localization rows and scans rules. It reads the definition-only prefix of the earlier tokenizer, stopping before its census side effects; no prior script was executed wholesale. Scanner discards comments, retains repeated keys/lists and walks braces. It is a structural scanner, not native syntax validation. `index_events.py` restricts event bodies to top-level definitions and checks actual panel definitions. The full raw capture supports revisiting any scanner result.

`write_reports.py` generates the main analyses and inventory; TOOLING/CHECKPOINT are maintained separately. Do not rerun blindly after coordinator integration or after source/build changes. `validate.py` checks deliverables, JSON shape, prose, local report links, current hashes and writes its receipt outside git. A changed installed source file requires reassessment, not silently rebasing old findings.

Other read-only commands: `rg --files`, bounded `rg -n` and `sed`, Python pathlib, `file` on native executable, `strings -a` captured and filtered in Python, `git status --short`, `git branch --show-current`, parser `git rev-parse HEAD`, `du -sk`. No repository test suite is meaningful for these documentation-only findings, and none was run.

## Failed routes and corrections

F1: prior guessed `tests/utils/mod.rs` was absent; exact file inventory found `tests/utils.rs`. A guessed special-project constants filename and GER UI filename were absent; switched to discovered files/current docs and a minimal shipped scripted-panel sample. No absent path was treated as absent gameplay.

F2: some exploratory tool output was truncated. Specific current project/reward docs, operation phase docs, scripted GUI docs and traced examples were reread with bounded commands. Full private capture preserves the entire docs; this pass does not claim a complete semantic read of every country or page.

F3: browser open of the pinned GitHub page failed with restricted-fetch error. Switched to the existing exact-commit local clone. A single public fixture download, using the URL encoded in that clone's test helper, returned HTTP 403. Switched to installed version declarations and local parser/diagnostic evidence; no variants/retries or user-save fallback. Failure receipt is `extract/public_fixture_fetch.json`. No online page supplied technical claims here.

F4: prior SAVE_SHAPE described only 1.10 fixture coverage. The same pinned tests also contain a 1.17 fixture and token-absent early returns. The correction is recorded in REPORT/SAVE_AND_ARCHITECTURE; prior files remain untouched.

## Limits

No current-build fixture parsed; no migration, full schema, mod load-order or restore-removal guarantee. No full native decompile, live UI, audio playback, save/reload/import or performance test. Exact semantic limits are in CHECKPOINT. All future YAIRPG/Province War adoption stays with its owner and native acceptance gate.
