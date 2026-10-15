# Tooling and rerun receipt

Lane: mw-hyperrogue, 2026-10-14. No packages installed. No foreign source or build script executed. GPL-2.0-or-later per hyper.cpp's copyright header; COPYing and author attribution remain in the private clone. Only original analysis/paraphrase and short identifiers were written to this repo. No code/assets copied into YAIRPG.

## Source pin

- Repository: https://github.com/zenorogue/hyperrogue
- Shallow clone path: `/Users/weiwei/.codex/research/mw-hyperrogue/repos/hyperrogue`
- Observed commit: `c7c9a2993b43ee2f4bbac422e565d18fdd98f886`. Clone status was clean after fetch. This is the inspected snapshot, not a claim it remains upstream HEAD.
- Work area: `/Users/weiwei/.codex/research/mw-hyperrogue/`
- Full content records: `extract/content-tables.json` and `extract/lands-full.json`. Latter preserves complete raw LAND blocks, native requirements and indexed consumer locators.
- All checkout file hashes: `extract/SOURCE_HASHES.txt`. Extraction hashes: `extract/HASHES.txt`. Source files in the clone retain full descriptions, text, conditions and data for later deep reference.

## Commands and routes that worked

```sh
git clone --depth 1 https://github.com/zenorogue/hyperrogue.git /Users/weiwei/.codex/research/mw-hyperrogue/repos/hyperrogue
git -C /Users/weiwei/.codex/research/mw-hyperrogue/repos/hyperrogue rev-parse HEAD
python3 -I /Users/weiwei/.codex/research/mw-hyperrogue/notes/extract.py
python3 -I /Users/weiwei/.codex/research/mw-hyperrogue/notes/write_dossier.py
python3 -I /Users/weiwei/.codex/research/mw-hyperrogue/notes/write_remaining.py
python3 -I /Users/weiwei/.codex/research/mw-hyperrogue/notes/finish.py
python3 -I /Users/weiwei/.codex/research/mw-hyperrogue/notes/validate.py
```

The clone took several minutes and finished normally. During transfer, raw GitHub previews of content and eleven requested modules were saved under extract; their bytes were later compared against the pinned checkout and matched. They are convenience duplicates, not a second authority. GitHub repository page also opened successfully through web. Reproduce source analysis from the pin rather than mutable master previews. For a future fresh clone, retain this pin before following any locators.

`extract.py` is our own static parser: it scans balanced X-macro arguments without importing the game; writes full records outside the repo; hashes source. `write_dossier.py` and `write_remaining.py` generate original prose/census outputs, `finish.py` repairs schematic requirement display, records boundaries and tooling, then `validate.py` verifies required files, JSON keys/counts, pin links and source locators. Authoring scripts assume the existing pin and output directory, and overwrite this lane's files on rerun.

## Dead ends and corrections

- Requested nested-world brief path under docs/ was absent. USER_VISION points to `docs/gm/dispatch/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md`, which was read instead.
- `save.cpp` raw URL returned 404 once. Switched to checkout discovery: saveStats/loadsave live in system.cpp, Safety in game.cpp, and distant-memory cleanup in savemem.cpp. No repeated URL guessing.
- An initial large owner/status read was truncated. Relevant owner sections were reread with bounded sed/rg; no reliance on truncated text for the named packet mappings.
- The observed main-checkout branch is `codex/gameplay-foundations`, despite the prompt's main-checkout label. No branch switch or source write occurred. Existing heavy dirty state belongs to concurrent work and was untouched.
- OSM apparent forbidden-history mismatch is source evidence, not an executed defect report. Full closure is deferred explicitly.

## Validation boundary

Only dossier structure, extracted counts, source pins/locators and local links were checked. No C++ build, network code, game launch, save access, YAIRPG build, behavioral suite, browser evidence or human acceptance. Source retrieval uses network; game networking does not run. Final check result is in CHECKPOINT and `notes/validation.json`.
