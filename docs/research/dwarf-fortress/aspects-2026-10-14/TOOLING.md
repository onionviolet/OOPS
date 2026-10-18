# Tooling and repeat receipt

Executed 2026-10-15. No new tools installed; no game install or launch. No fetch/clone performed. All raw inputs, native pseudocode and full text remain private. The prior dossier had no TOOLING.md; prior INTAKE.json/COVERAGE.json and REPORT/CHECKPOINT supplied its method. Prior old-Mac extracts are reported lost and are not treated as current retained evidence.

## Source and new retention

Steam appmanifest whose name matches Dwarf Fortress: `~/Library/Application Support/Steam/steamapps/appmanifest_975370.acf`. Source root: `~/Library/Application Support/Steam/steamapps/common/Dwarf Fortress/`. Only metadata counters relevant to installation are retained in the new intake; no owner/account field is reproduced. Build 24557528, StateFlags 4, staging 0; download/stage totals complete. Census 2,749 files / 1,139,421,922 bytes agrees with the old intake. This is one current census plus matching content pins, not a new two-pass full-payload stability proof.

Workspace: `~/.codex/research/bf-dwarf-fortress/`.

- `extract/payload/`: identity copies of 374 TXT files, 19 Lua files and Dwarf Fortress.exe. No full media copy, DLL copy, save/prefs/log copy or Windows execution.
- `extract/HASHES.txt`: SHA256 for every retained extract except itself, including native outputs. `notes/intake.json`, `inventory.json`, `text-census.json`, `text-sets.json`, `raw-object-token-counts.json` and `prior-hash-comparison.json` retain pins, counts and comparisons.
- `notes/native-targets.json`: PE section mapping, RIP-relative candidate references and enclosing .pdata ranges. Candidate byte matching locates targets; REA output supplies the bounded semantic read.
- `extract/rea-native.json`, `native-0x*.c` and `native-strings.json`: complete private evidence and pseudocode; not redistributable game source in repo.
- `notes/rea-open.json`, `rea.stderr`, `native-seeds.tsv`: MCP target/progress and four function seeds. `notes/review-ledger.json`: exact new readable spans and native limits.

`tools/capture.py` walks only permitted install paths, excludes save/saves/savebackups/prefs/logs and crash/error/game/stdout/stderr logs, copies TXT/Lua/exe and computes hashes/census/PE boundary. It does not enter excluded directories. `tools/native_targets.py` locates strings and candidate RIP-relative LEA references, maps addresses through PE sections and uses .pdata for enclosing function ranges. `tools/rea_pass.py` seeds four chosen entries and requests a batch decompile. `tools/write_reports.py` generates this lane's docs; final checkpoint/validation/hashes are completed afterward. These scripts run under Python isolated mode.

## Native tool route

Read the prior `docs/research/hogwarts-legacy/REA_TRIAL.md` first. Reused its existing source-built REA 6.4.0 tree read-only at `~/.codex/research/hogwarts-legacy/repos/rea-pinned/`, archive commit `bb540826d65316c164d2de8ba4ef10f81a8ad073`. No new checkout or source change. The existing compiled launcher was checked to retain `-noanalysis -max-cpu 2`; the analysis profile's ghidra-default label alone does not encode that local patch. Tool-file hashes are in notes/tool-hashes.json. Ghidra: `/opt/homebrew/opt/ghidra/libexec`, 12.1.4. Existing OpenJDK 21 and Node runtime. ilspycmd was not used because the pinned PE has no CLR directory; IL2CPP tooling likewise does not fit the observed artifact.

The MCP client launches Node REA, initializes protocol 2025-03-26, calls open_binary with provider_id ghidra, then batch_decompile for 0x14154919c, 0x14157c890, 0x14131de00 and 0x14131e4f0. Seed labels DF_candidate_* are analyst names, not symbols. TMPDIR is the lane's notes/rea-temp, so temporary files stay in this work area. No dot-free symlink or global setup was needed on this reused REA route. Batch request took about 11.7 seconds in server logging; no benchmark inference. The child session closed normally.

## Commands that worked

Run from the repo root, with scripts already present:

```sh
python3 -I /Users/weiwei/.codex/research/bf-dwarf-fortress/tools/capture.py
python3 -I /Users/weiwei/.codex/research/bf-dwarf-fortress/tools/native_targets.py
python3 -I /Users/weiwei/.codex/research/bf-dwarf-fortress/tools/rea_pass.py
python3 -I /Users/weiwei/.codex/research/bf-dwarf-fortress/tools/write_reports.py
python3 -I /Users/weiwei/.codex/research/bf-dwarf-fortress/tools/validate.py
```

Do not rerun capture blindly against an updated install. Re-pin the manifest/build/executable first; current addresses apply only to this SHA. native_targets.py's initial seeds are a discovery intermediate; rea_pass.py replaces them with the final four-target list. Final evidence should be rehashed after any rerun.

## Dead ends and limits

COVERAGE.md, INTAKE.md and TOOLING.md do not exist in the prior folder. Read the corresponding JSON files and existing report/checkpoint instead. One exploratory rg command used a nonexistent unquoted glob and zsh rejected it before execution; subsequent reads used known exact paths. No fetch failed.

REA returned four status-ok items, but 0x14131e4f0 has a failed jump-table recovery. Preserve it as unread native selection, not a finished dialogue trace. The save targets are error handlers; success-path serialization/sync and rollback remain unread. Native diagnostic helper names/status fields remain unresolved. An empty native string or unlocated table would not establish absence.

For a later deeper pass, keep REA over the same Ghidra route and add a named selector/substitution or save-success question. Reading another broad catalog, installing another game distribution or launching a Windows executable is unnecessary for the present deliverables.
