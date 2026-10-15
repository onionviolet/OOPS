# Tooling and rerun ledger

2026-10-14, lane ds-hearts-of-iron-iv. No installs, clones, downloads, native decompile, game launches, Windows executables, personal saves, UI automation, runtime tests or repo builds. No staging/commit/push. Branch observed `codex/gameplay-foundations`, not a branch named main. The prompt's main-checkout path was used; no checkout or worktree change. Existing mixed dirty state belongs to other lanes and was preserved. Repo writes confined to this output directory.

## Sources and retained detail

| Item | Exact location / pin |
| --- | --- |
| Install | `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Hearts of Iron IV` |
| Manifest checked | app 394360, build 25205862, install directory Hearts of Iron IV. Only these fields printed; no account fields retained. |
| Prior work, read-only | `/Users/weiwei/.codex/research/hoi4/` and `/Users/weiwei/.codex/research/asp-hoi4/` |
| Prior parser | Existing rakaly/hoi4save source pin is recorded by prior TOOLING, `a3f1e65ec2da113652152a00aa32631182bbc03f`. No new parser build/run or network fetch. |
| New work | `/Users/weiwei/.codex/research/ds-hearts-of-iron-iv/`, tools/extract/notes/repos; no downloaded repository. |
| Raw capture | `extract/raw/`: 286 selected installed text/doc files, 5,472,798 bytes; every copy matches prior asp-hoi4 bytes. |
| Source manifest | `extract/source_manifest.json`, `SOURCE_HASHES.txt`: exact paths, sizes, SHA-256 and prior-byte comparison. |
| Structural scan | `extract/declarations.json`: repeated-key lists and per-file top blocks; counts include docs/debug/inactive alternatives where selected. Not engine validation. |
| Prior reference inventory | `extract/prior_read_manifest.json`: 32 prior Markdown/JSON dossier/index files, including private README/manifest; raw prior tables not redundantly reread. No prior pass-2026-10-14 folder existed at start. |
| Full earlier text/event references | Read-only asp-hoi4 `extract/raw/`, `english_localisation.jsonl`, `events-index.jsonl`. No duplicate event/localization extraction. |
| New extract hashes | `extract/HASHES.txt`; output and validation receipts also under extract. |

## Mechanical commands

```sh
python3 -I /Users/weiwei/.codex/research/ds-hearts-of-iron-iv/tools/capture.py
python3 -I /Users/weiwei/.codex/research/ds-hearts-of-iron-iv/tools/measure.py
python3 -I /Users/weiwei/.codex/research/ds-hearts-of-iron-iv/tools/write_reports.py
python3 -I /Users/weiwei/.codex/research/ds-hearts-of-iron-iv/tools/finalize.py
python3 -I /Users/weiwei/.codex/research/ds-hearts-of-iron-iv/tools/validate.py
```

Do not rerun generators over later human/coordinator edits without checking them. The first capture rerun could change the pinned snapshot if the install has updated. Preserve old hashes first. `measure.py` reads and executes only the tokenizer/parse function prefix of the old census script, splitting before its top-level census mutations. It never runs the earlier whole script or writes an earlier work area. The tokenizer preserves repeated keys and bare-list entries and discards comments; it is not a complete Clausewitz parser. Counts are navigation signals, not game reachability or independent-system totals.

Read-only navigation used rg/rg --files, bounded sed/head, Python pathlib/JSON/SHA-256, git branch/status and disk measurement. Live docs read: COMMON, ASPECTS, PROJECT first 80, USER_VISION UI/options/deep-reference directions, world core K1-K34 tables, cross-game PACKETS P01-P25, starts/endings/randomness, means, modular-chain and life-sim palettes. No game acquisition was necessary.

## Dead ends and corrections

F1: guessed lower-case `00_operation_tokens.txt` did not exist. Directory inventory found `00_OperationTokens.txt`. Guessed resistance filenames with `00_` prefixes were absent; exact directory inventory found `resistance_activity.txt`, `resistance_modifiers.txt`, `compliance_modifiers.txt`.

F2: guessed continuous-focus `00_continuous_focus.txt`, short-term goal filename and equipment-group filename were absent. Exact inventory supplied `generic.txt`, `faction_goals_short_term.txt` and `mio_equipment_groups.txt`. Member group is `member_upgrade_groups.txt`; timed activity is `00_stage_coup.txt`. No missing guessed path was used to assert absence.

F3: broad batched output sometimes truncated. Relevant contracts, formulas and examples were reread in bounded slices. Structural indexes and complete new/prior raw captures remain available; no full semantic claim for every source or country.

F4: a git status issued from the raw capture directory returned not-a-repository. Corrected to the YAIRPG checkout for scoped final status. It had no side effects. Memory keyword search had no relevant hit; no memory facts supplied this research.

No HTTP requests failed because none were attempted. Prior failed public fixture routes were not retried. Exact native serializer/evaluator, DLC/mod restore and live UI remain unread; doc/JSON/hash validation cannot close them.
