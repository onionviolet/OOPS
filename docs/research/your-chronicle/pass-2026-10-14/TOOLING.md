# Tooling and reproduction

No repository clones, commits, global installs or game launches occurred. This
lane used an existing UnityPy environment and private scripts. Raw data stays in
`/Users/weiwei/.codex/research/your-chronicle-2/`; extract SHA256 values are in
`extract/HASHES.txt`. The main checkout was read-only outside this pass directory.
No git stage, commit or push.

## Reuse and missing input

Prior INTAKE identifies `/Users/weiwei/.codex/research/your-chronicle/25001959/`.
That directory is absent. The prior repo lane has no TOOLING.md; its reproduction
commands are in COVERAGE.recovery.commands and its tool pin in INTAKE. The prior
selected native findings were read from the repo dossier, not from missing raw
bodies. All four original input fingerprints and all 17 prior decoded selected
table fingerprints match current installed input.

Existing extractor reused after reading it:
`/Users/weiwei/.codex/research/heavens-vault/tools/extract_textassets.py`.
Copied into this lane's `tools/`; it reads Unity serialized asset TextAssets only.
Existing interpreter:
`/Users/weiwei/.codex/research/heavens-vault/tools/venv/bin/python`.
No new dependency installation. Commands ran with isolated Python `-I`.

## Commands that worked

Run from the YAIRPG repo, with absolute work paths:

```sh
/Users/weiwei/.codex/research/heavens-vault/tools/venv/bin/python -I /Users/weiwei/.codex/research/your-chronicle-2/tools/extract_textassets.py '/Users/weiwei/Library/Application Support/Steam/steamapps/common/YourChronicle/YourChronicle.app/Contents/Resources/Data' /Users/weiwei/.codex/research/your-chronicle-2/extract/textassets
/Users/weiwei/.codex/research/heavens-vault/tools/venv/bin/python -I /Users/weiwei/.codex/research/your-chronicle-2/tools/decode.py /Users/weiwei/.codex/research/your-chronicle-2/extract/textassets /Users/weiwei/.codex/research/your-chronicle-2/extract/decoded
python3 -I /Users/weiwei/.codex/research/your-chronicle-2/tools/ledger.py
python3 -I /Users/weiwei/.codex/research/your-chronicle-2/tools/findings.py
python3 -I /Users/weiwei/.codex/research/your-chronicle-2/tools/validate.py
```

Extraction inventories 122 TextAssets. Encoded settings/translations/replacement
assets and five config/debug/graph assets decode as base64 followed by repeating XOR. The local decoder asserts
byte-for-byte re-encoding equality. All 110 encoded assets pass. Unencoded Help
is UTF-8 with BOM. CSV is parsed with DictReader, preserving quoted fields.
`COVERAGE.json` uses CSV record numbers, header=1; physical text line numbers
can differ for multiline fields. Inventory counts are not semantic coverage.

`ledger.py` records 136 selected records from 12 sources, checks original input
hashes and compares old table pins. Its private `notes/selected-rows.json` contains
raw selected rows and stays out of git. The ledger replaces its generated hash manifest on rerun.

## Dead ends and route change

The two requested old TOOLING/COVERAGE.md names were unavailable; authoritative
COVERAGE.json and INTAKE.json were used instead. One guessed owner filename read
also failed; routing switched to actual LIFE_SIM_NORTH_STAR and RULES_FROM_SCRATCH.
No missing file was created outside this pass.

One pinned Cpp2IL download was attempted from:
https://github.com/SamboyCoding/Cpp2IL/releases/download/2022.1.0-pre-release.21/Cpp2IL-2022.1.0-pre-release.21-OSX-ARM64

`curl -L --fail --max-time 90` timed out with exit 28 after 5,832,131 of
15,719,263 bytes. The incomplete private `tools/Cpp2IL` was never executed or
signed. There was no retry of that endpoint. Source route switched to restored
installed TextAssets and the qualified prior native dossier. A future native
pass should use another trusted distribution route, validate the intake tool
hash, and recover only the remaining selected consumer questions.

## Scope of checks

Research only: JSON structure, selected record counts, input/table fingerprints,
encoded round trips, extract hashes, local Markdown links and output shape.
No unit/gameplay/browser/save/reload/import tests, no native runtime inspection,
no account or entitlement query, no save reads, no source copy into YAIRPG.
