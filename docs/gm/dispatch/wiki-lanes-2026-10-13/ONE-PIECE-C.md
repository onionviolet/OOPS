# Reader one-piece-c

Follow `docs/gm/dispatch/wiki-lanes-2026-10-13/COMMON.md` exactly, including its Note accuracy section.

Lane: `workers/one-piece-full/shard-c/` (One Piece). Manifest `onepiece_SOURCES.json`; your range is retained inputs (rows with `read_file`) ordinal 2873 to 5096 in manifest order (5096 retained in total). Source: Fandom S3 dump refetched with matching SHA-256; frozen manifest from 2026-10-10. Create your own `CHECKPOINT.md` first with source, range, counts, last completed and next pending; keep it current after every input.

After your range, adjudicate and read the scope gates in `onepiece_SCOPE_AUDIT.json`, `onepiece_NONCHARACTER_AUDIT.json` and `onepiece_EMPTY_INPUT_AUDIT.json` (written 2026-10-10), using the private files those audits name; if a named private file is missing, rebuild its text read-only from the archive with `full_dump_reader.stream` and verify the recorded hash.
