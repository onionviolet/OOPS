# Reproduction and source retention

Lane `ds-hyperrogue`, 2026-10-14. No installs, fetches, builds or executables. Analysis used existing python3, rg, standard read commands and read-only Git metadata.

## Source and boundaries

- Repository: [zenorogue/hyperrogue](https://github.com/zenorogue/hyperrogue/tree/c7c9a2993b43ee2f4bbac422e565d18fdd98f886), pinned `c7c9a2993b43ee2f4bbac422e565d18fdd98f886`.
- Reused clone read-only: `/Users/weiwei/.codex/research/mw-hyperrogue/repos/hyperrogue`. Earlier extraction/scripts/outputs were not overwritten or executed.
- This lane work area: `/Users/weiwei/.codex/research/ds-hyperrogue/`. Own scripts live in notes/. They read the source, write this lane's private extracts and generate only the assigned repo output folder.
- Source license remains in the original repository, GPL-2.0-or-later per its header as recorded by the prior pass. No code or assets were copied into YAIRPG. Committed analysis uses small identifiers, formulas, paraphrase and pinned locators.
- Main checkout had extensive concurrent dirty state; no branch switch, staging, commit, push, source edit or save access. This lane's only repo write path is `docs/research/hyperrogue/pass-2026-10-14-systems/`.

## Private reference detail

`extract/source/` captures 27 full selected files, including original text and language tables. This preserves default speech, conditions, five full die adjacency tables, content declarations, rule consumers, map fields and version gates without publishing raw prose. Copying a file for retention is not claiming all its bodies were read. `extract/slices/DS01..DS15/` preserves the cited source windows with original line numbers. `extract/prior_manifest.json` hashes all 14 prior dossier files recovered before this pass. `extract/HASHES.txt` hashes retained extracts. Full earlier land/item/monster/wall census and complete clone remain in mw-hyperrogue read-only.

No gitignored private path outside the assigned repo output folder was written. Raw reference is in the authorized external work area instead. No game, Windows executable, source helper, game network code or save was run.

## Commands that worked

```sh
git -C /Users/weiwei/.codex/research/mw-hyperrogue/repos/hyperrogue rev-parse HEAD
rg -n 'namespace princess|struct info' /Users/weiwei/.codex/research/mw-hyperrogue/repos/hyperrogue/complex.cpp
python3 -I /Users/weiwei/.codex/research/ds-hyperrogue/notes/write_systems.py
python3 -I /Users/weiwei/.codex/research/ds-hyperrogue/notes/write_inventory.py
python3 -I /Users/weiwei/.codex/research/ds-hyperrogue/notes/write_reports.py
python3 -I /Users/weiwei/.codex/research/ds-hyperrogue/notes/validate.py
```

The three write scripts regenerate this lane's outputs and overwrite those files; use them only for this pass. validate.py reads static source and dossiers, writes only private validation/source slices and checks hashes. It does not compile, import or execute game code. The arithmetic tide check is a separate Python model of the inspected loop, not a behavioral source test.

## Dead ends and adjustments

An initial combined dossier/status read exceeded output limits. Switched to bounded module excerpts and compact JSON field reads. Nothing was inferred from a truncated command tail. A memory registry search for HyperRogue/deep systems returned no hits; no memory facts informed the findings. No network fetch failed or retry route was needed. No install was needed.

## Validation boundary

The final private `notes/validation.json` records JSON parsing, complete prior module/land inclusion, fifteen deep-section dimensions, valid file/line bounds, owner/packet/link existence, proposal and touch counts, unchanged prior output hashes, tide-array arithmetic, source pin and clone cleanliness. Existence checks validate routing, not owner implementation. Source bounds do not prove semantic completeness. No native roundtrip, balance, benchmark, screenshot or human acceptance is claimed.
