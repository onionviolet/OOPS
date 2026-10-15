# Tooling and reproduction

No installs, clones, game launches or network fetches. Local payload reused read-only. No git add/commit/push. SHA-256 recalculated and receipt matched. Raw data stays private; public analysis is paraphrased. Upstream tag not cloned, so no source commit claimed. Release pin: TerraFirmaCraft 3.2.27, Forge 1.20.1, jar hash in REPORT.md.

Commands that worked: rg --files for classes/recipes, rg -n for specific predicates, sed -n for method ranges, cat for short JSON, python3 -I for JSON parsing/hash/inventory/output. Mechanical dossier generator: ~/.codex/research/fs-tfc-chains/notes/write_dossier.py. Hash manifest: ~/.codex/research/fs-tfc-chains/extract/HASHES.txt and private/HASHES.txt. Existing data/decompile roots listed in REPORT.md.

Dead ends: barrel/lye.json absent, switched to recipes/pot/lye.json; assets book.json absent, actual metadata is data/tfc/patchouli_books/field_guide/book.json; data/tfc/knapping_types/clay.json absent, actual directory is data/tfc/tfc/knapping_types. Broad mat filename search matched hematite, corrected by checking drying/kiln classes and recipe identifiers. No downloader or dependency required.

Verification is source/data only. JSON tables and outputs parse; required dossier and aspect files checked; private path gitignored. No native UI or persistence test because COMMON forbids launch/touch saves.
