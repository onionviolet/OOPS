# Naev tooling and reproducibility

Date: 2026-10-14. Lane `lib-naev`. No installs. No game execution, build, submodule fetch, Steam interaction, account login, save access or git staging/commit/push.

## Captured repository

- Requested repository: https://github.com/naev/naev
- Commit: `f8982244800e86553217a2dba555a0f41c2b87ba`.
- Route: successful shallow clone to `/Users/weiwei/.codex/research/lib-naev/repos/naev/`, then `git rev-parse HEAD`.
- The repository page identifies GitHub as a mirror and points to https://codeberg.org/naev/naev. Codeberg head was not compared. This pin is the captured mirror snapshot.
- Assets submodule was not initialized. Source corpus: 5,539 non-git files, 93,344,977 bytes, captured-file hashes in `extract/source_manifest.json`. This is not an installed-build inventory.
- License inspected: programming-language code generally GPLv3 with contributor/date qualifications for later versions; XML and other non-code generally CC BY-SA 4.0 or later; assets have individual license inventories. No source code, raw dialogue or assets were copied into committed analysis.

## Commands that worked

Run from the project only for read-only inspection and own-directory checks:

```sh
git status --short
head -80 PROJECT.md
rg --files docs
cat docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md
cat docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md
```

Acquisition, from an empty assigned work-area destination:

```sh
mkdir -p /Users/weiwei/.codex/research/lib-naev/repos /Users/weiwei/.codex/research/lib-naev/extract /Users/weiwei/.codex/research/lib-naev/notes
git clone --depth 1 https://github.com/naev/naev.git /Users/weiwei/.codex/research/lib-naev/repos/naev
git -C /Users/weiwei/.codex/research/lib-naev/repos/naev rev-parse HEAD
```

Rerun on the retained pin, without fetching or changing its checkout:

```sh
python3 -I /Users/weiwei/.codex/research/lib-naev/tools_extract.py
python3 -I /Users/weiwei/.codex/research/lib-naev/write_remaining.py
python3 -I /Users/weiwei/.codex/research/lib-naev/validate.py
```

`tools_extract.py` uses Python standard-library XML parsing, regular expressions, SHA-256 and a file census. It never runs downloaded source. It emits full XML tables, complete embedded mission/event headers, names, functions, labels, hook types and referenced mem fields. It is a navigation index, not a Lua parser or reachability checker. All 352 headers and 2,889 XML documents parsed with zero errors. Full original dialogue and its conditions remain in the pinned Lua files, not regex-generated fictional line IDs.

`write_remaining.py` calls the retained dossier/aspect writers, recreating the prose artifacts and private flow notes. These author scripts are task-local tools, not project runtime code. TOOLING/CHECKPOINT and validation are maintained separately. Use `rg -n` on the indexed file and `sed -n` to inspect a specific function. Native source symbols and pinned GitHub links in each finding make the audit repeatable.

Validation parses the two public JSON artifacts, checks all twelve aspect keys and valid statuses, unique finding/proposal codes and ranks, all cited source paths, every relative Markdown target, 30 small-touch rows, no em dashes and private gitignore status. SHA-256 checks verify extracts against `extract/HASHES.txt`. It does not execute Naev or YAIRPG.

## Dead ends and route changes

| Item | Result and resolution |
|---|---|
| Lightweight memory keyword search | No relevant hits; no memory-derived project claim was used. |
| Requested nested-world owner root path | Missing. `rg --files docs` located `docs/gm/dispatch/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`; that copy was read. |
| Initial broad concatenation of live owners/status | Output exceeded the display budget. Focused head/sed/rg reads recovered the relevant top summary, K topic rows and P10/current packet headings. No full-reading claim for all owner history. |
| Initial guessed Chakra path | `dat/outfits/psychic/seeking_chakra.lua` did not exist. File search resolved `dat/outfits/flow/abilities/seeking_chakra.lua`. |
| Initial dossier writer | Tuple index error before writing the report. Corrected to the findings' actual source-list index, reran successfully, then checked every emitted path. |
| Initial link check | TOOLING.md was not written yet. Created it and reran the final validator. |

No failed network fetch. Clone succeeded on its first route. No wiki requests or extra dependency installs were needed. Upstream `mission_map.py`, optimization code and Lua checker were read but not run; the graph helper requires additional packages and no package was installed merely to reproduce a figure.
