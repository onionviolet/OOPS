# Tooling and reproducibility

2026-10-14. No install, clone, shared tool patch, game launch, Windows executable execution, injection, bottle change, personal save access, source/build edit, staging, commit or push. Prior work areas used read-only. All new scripts/data/project files live under `/Users/weiwei/.codex/research/ds-immortal-life/`; repo writes only this output folder. One temporary dot-free path symlink points into that private root for Ghidra's project-path restriction.

## Reused inputs

Read COMMON/ASPECTS, PROJECT top 80, relevant USER_VISION and all 30 earlier dossier files, including the inventory and all three checkpoints. `extract/PRIOR_READ_INDEX.json` records hashes, JSON keys and a gap index. Original raw TextAssets remain in `immortal-life/extract/text/`; Dumper metadata/type maps in `immortal-life/extract/types/`. Existing full dialogue graphs remain in the aspects work area; no duplicate graph extraction or prose export was needed.

Source-built Il2CppDumper revision `4741d46ba9cd6159c5d853eb9d6fc48b4bfa2b1a` and the prior completed Ghidra project were reused. Ghidra 12.1.4 and existing OpenJDK 21 are local analysis tools; target PE bytes are parsed, never run. Prior REA comparison remains in [REA_TRIAL](../pass-2026-10-14-deep/REA_TRIAL.md). This pass used direct incremental Ghidra reads, not a new benchmark or fresh REA install.

Current original hashes were recomputed before native work:

| Input | Bytes | SHA256 |
|---|---:|---|
| GameAssembly.dll | 43336704 | `82294aa03035a9d2179ee87a2d5cc96f3b9fb0ff2930a64efd7986161b457f4a` |
| global-metadata.dat | 12069104 | `14796dd88489966bd958bad12d22115470feb84941b7e62aaeae5283bfbc9e44` |

Both match the prior original receipt. Installed manifest/build 17861603 is inherited provenance, not a fresh claim about runtime behavior.

## Commands and retained artifacts

Run the saved scripts with `python3 -I` and explicit paths. Do not execute setup blindly on an already-used project or overwrite prior successful evidence. Review `CHECKPOINT` and selection first.

- `tools/setup.py`: copies only the prior Ghidra project to this lane, selects 83 unique named entries, reads all 291 parsed tables into a complete private reference archive and hashes originals. `notes/selection.json`, `seeds.tsv`, `extract/tables.json`, `table-inventory.json`, `INPUT_HASHES.json`.
- `tools/supplement.py`: selects 16 further unique consumers, including silk async state, trigger initialization, timer rebuild, pet presentation and buff expiry. `selection2.json`, `seeds2.tsv`.
- `tools/ghidra/SelectedChain.java`: inherited selected disassemble/decompile route, 45 seconds per method, no whole-image auto-analysis. Own project copy was the only Ghidra database written. `notes/native.txt`, `native2.txt`, `ghidra.log`, `ghidra2.log` retain raw outputs and command receipts.
- `tools/annotate.py`, `annotate2.py`: unique function-name substitution and explicit shared-alias/generic-token notes from Dumper `script.json`. `notes/functions/` has 100 entry records. A shared no-op has many managed names; it is not an independent system proof. Decompiler float/call arguments remain qualified.
- `tools/formats.py`: recognizes four plain-text formats and decodes only Decorate's first JSON value, preserving the suffix unresolved. `FORMAT_REVIEW.json`, `decorate-segments.json`. No raw input repair.
- `tools/catalogue.py`: generates FAMILY_MAP from the exact 296-asset manifest and 203-service Markdown census, retaining prior coverage and inferred owner mapping. Families are analytical grouping, not engine namespaces. Validate semantic routes before any future implementation.
- `tools/validate.py`: checks outputs, counts, native entry success markers, selected address citations, paths, links and private hashes. `extract/HASHES.txt` and repository VALIDATION.json carry final results.

Successful native command shape, with own paths:

```sh
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home /usr/bin/time -l /opt/homebrew/opt/ghidra/libexec/support/analyzeHeadless /tmp/ds-immortal-life-20261014/notes/ghidra-project ImmortalLife -process GameAssembly.dll -noanalysis -max-cpu 2 -scriptPath /tmp/ds-immortal-life-20261014/tools/ghidra -postScript SelectedChain.java /Users/weiwei/.codex/research/ds-immortal-life/notes/seeds.tsv /Users/weiwei/.codex/research/ds-immortal-life/notes/native.txt
```

The second command substitutes seeds2.tsv/native2.txt. A third one-entry read uses seeds3.tsv/native3.txt for WorkingState.RefreshRemainTime, closing the remaining-hours conversion. Its signature is in selection3.json; annotate3.py retains its mapped body. Logs retain both actual invocations. First incremental run: 7.15 seconds, maximum RSS 614465536 bytes. This reused a warm project; it is not comparable to prior cold imports and is not a claim of tool superiority.

`extract/application-schemas.json` preserves field offsets for application types; `schemas.json` retains selected full declarations. `constants.json` binds 1.0, 100.0, -1.0 and 3600.0 to raw PE virtual addresses. The read used the PE section table, not a guessed file offset. Full table records and code stay private. Archive paths are stable references, not an instruction to copy source content into gameplay.

## Limits and corrected working errors

No network fetch was needed, so no wiki retry or unverified web claim. No Cpp2IL rerun, Unity asset rescan, REA import retry or whole-image auto-analysis was warranted. Prior failed message extraction and REA import history remain prior facts, not new successes.

An initial broad shell inventory printed too much unrelated dirty state; subsequent reads were scoped. Early console table/class probes also exceeded output limits; the full bytes remained privately available and later targeted reads supplied the claims. Three draft function addresses were caught by selected-address validation and corrected before final publication. View scripts condense output for navigation only; raw annotated bodies remain the evidence. No unread floating-point argument was filled by guesswork.

The Decorate prefix is readable; its remaining 399 characters are not decoded. Class/type discovery, serialization calls and successful decompilation do not prove complete mechanics, save safety, external mod support, offline catch-up or played UI. No browser/build/gameplay test applies to this read-only source task.
