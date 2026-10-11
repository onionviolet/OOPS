# Noita audit tooling and source binding

2026-10-09. Install read-only; private workspace
`~/.codex/research/noita/`. [Intake](INTAKE.json), [coverage](COVERAGE.json).

| Tool | Use | Private artifact |
|---|---|---|
| Python 3 standard library | Custom archive reader, paths/bounds checks, SHA-256, XML reaction parse, derived examples and report manifests | `tools/extract_wak.py`, `tools/material_digest.py`, `tools/write_examples.py`, `tools/finalize_outputs.py` |
| Comment-aware Python Lua lexer | Exclude comments while preserving strings; count action/perk ID/type/stack declarations with uniqueness assertions | `tools/count_composition.py`, `COMPOSITION_COUNTS.json` |
| XML parser and CSV reader | Body status declaration and directed herd-matrix counts | Reviewed source/counts in BODY_WORLD_FINDINGS and final validation |
| Git shallow clone | Read community alchemy reconstruction only | `community/narg`, revision `fa614b2eb44c1469053a0306b48f09af0a171d90` |
| `rg`, bounded source reads | Locate and review specific scripts, material blocks and official docs | Review depths and hashes in COVERAGE |

No external archive extractor, game executable, game Lua interpreter or engine
binary decompiler was used. The custom extractor reads the archive as bytes.
The format was inferred from this archive's header and verified by walking
its complete table. It is not a claimed general-purpose WAK specification.

Header: four little-endian 32-bit integers. Here they are 0, 14,745, 797,859,
0. Each member has offset, byte size and UTF-8 path length as three uint32s,
followed by its path. Payloads follow the file table. The extractor verifies
all paths are relative and safe, names unique, payloads in bounds and the
walk ends exactly at the advertised table end. It extracts only readable
Lua/XML/CSV/TXT/JSON members, and records hashes for every archive member.

Archive `data/data.wak`: 42,467,033 bytes, SHA-256
`c95a0c01a55ec29267afef6bbec8a0cae0ba2b350638e2203674ed4dfb9227c3`.
5,566 readable members are hash-matched to their payloads; 454 loose files
are copied and hash-matched to the install. The install also contains audio,
fonts, schema XML, translations, mod examples, modding documentation and
engine DLL/EXE files. Large audio/assets and executable binaries were not
copied because the source pass did not need them.

Loose mod folders: `example`, `daily_practice`, `nightmare`,
`starting_loadouts`, `translation_fi`. The example's metadata and first 65
init lines show optional lifecycle hooks, script append and text overrides
(`external/mods/example/mod.xml`, `external/mods/example/init.lua:1-65`).
These are examples, not a claim that mods were enabled. Official component
field docs outside the archive were important for inventories, ingestion,
polymorph and friendly-fire contracts. All loose Lua/XML locations are
listed privately in EXTRACTION, grouped in INTAKE. Source or tool updates
must not silently be substituted for this build's evidence.

The web wiki route returned an error, so the alchemy gap was researched via
the public tool author's GitHub source. Only that reconstruction is used for
the algorithm. It was not run against a Noita seed or proven equivalent to
this binary. No secret recipe or original source text is copied wholesale
into the repo. Tiny identifiers, field lists and paraphrased examples are
retained to make the analysis reviewable.

## Reproduce private counts

```sh
python3 ~/.codex/research/noita/tools/material_digest.py
python3 ~/.codex/research/noita/tools/count_composition.py
python3 ~/.codex/research/noita/tools/validate_audit.py
```

Extraction is already complete. Do not rerun extraction to “resume” a report
unless the source archive is missing or a verified extraction defect requires
it. The final validator checks hashes and derived output, without launching
Noita, changing its install or reading saves.
