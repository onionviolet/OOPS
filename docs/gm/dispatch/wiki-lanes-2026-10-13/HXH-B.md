# Reader hxh-b

Follow `docs/gm/dispatch/wiki-lanes-2026-10-13/COMMON.md` exactly.

Lane: `workers/hxh-full/r2-2026-10-13/shard-b/` (Hunter x Hunter). Manifest `hunterxhunter_SOURCES.json`; your range is manifest indexes 842 to 1321 inclusive, rows with `read_file` only, skipping titles whose row in `workers/hxh-full/READ_LEDGER.jsonl` has `read_complete: true` (100 done before the machine move). `workers/hxh-full/` itself is read-only for you; its CHECKPOINT and first ledger/note rows are your format reference and carry Nen-specific cautions. Create your own `shard-b/CHECKPOINT.md` first. The 66 no-input candidates are out of your range.
