# Reusable static extraction flow

This flow is saved for future research. It does not authorize a later install, launch, download or implementation. The root owns any wider cross-game workflow; this file records the concrete Dwarf Fortress route.

## Recover the evidence before choosing a decompiler

Read the prior dossier and its current checkpoint, inspect live writer/process ownership and verify installed Steam build without changing it. This lane reused the backfill's stable payload read-only and wrote its own independently hashed readable snapshot. Do not restart the active native import simply because a new lane exists.

The installed source was `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Dwarf Fortress/`; app manifest `975370`, build `24557528`. Retained source for this continuation is `/Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/readable/`. The public index avoids account fields from the Steam manifest.

PE headers, not filename extensions alone, determine the boundary. Read e_lfanew at offset0x3c, the PE machine and optional-header magic, then PE32+'s data-directory table. Here machine is0x8664, magic0x20b, export and CLR directories(0,0). The source is native Windows x64, not a managed assembly. No Windows executable ran. The extractor's own PE-header decoder is fully retained in its script.

## Preserve whole inputs, index small locators

All shipped `.txt` and `.lua` files from the prior captured payload were retained without rewriting. The source for the copy is `/Users/weiwei/.codex/research/bf-dwarf-fortress/extract/payload/`, which this lane never mutates. The extractor compares each retained hash with the current installed hash and checks source size/mtime before and after copying.

The bracket scanner runs only over `objects/*.txt`. It records file, line, column, token name and all colon-separated arguments. It observes each file's `OBJECT` family and makes definition candidates when a token matches that family, with ITEM/BUILDING variants treated explicitly. It does not parse Lua long strings as loaded definitions. It does not resolve inheritance, creature variation application, default values, syntax errors, mod ordering, engine references or reachability. Graphics/example/readme content stays in the full archive even if outside the lexical inventory.

A definition block ends immediately before the next candidate in the same file. The block table is a retrieval tool, not a grammar tree. Full untouched source remains authoritative when comments, context or nesting matter.

## Trace a concrete question through shared rules

Pick one causal path rather than an isolated ability label. This pass follows anatomy→function→clinical repair; plant material→containerized reaction→syndrome→actor dilution; recipe→material→weapon geometry; generated effect→admission/exclusion→duration→cleanup boundary; and candidate evaluation→registration→source provenance.

For every edge record the source file, exact span, input predicate, actual numeric fields, state/output, later consumer and cleanup. Mark matching-ID joins as inference when the native consumer is absent. A field called PROB100, a UI description or a comment cannot stand in for a full damage/dose formula. Follow negative and cancellation paths explicitly.

Do not infer an NPC policy from a generic actor capability. A permitted profession, AI hint, target constraint and autonomous choice are four distinct evidence layers. Do not infer whole lifecycle correctness from a finite duration field.

## Keep capture and unread coverage mechanical

The reader prints numbered windows and appends hash/spans to READS.jsonl. The coverage script merges distinct reviewed line ranges per file and subtracts them from each full file. A retained file without a selected window is `retained_unread`. A file with a window still lists its unread ranges. This is continuation-local coverage, not a union that silently absorbs another lane's claims.

The listed spans are evidence of what was presented for review, not a formal proof every semantic branch was understood. The prose names the reviewed claims and preserves unknown consumers. Whole raw capture, lexical indexing, semantic review, native code interpretation, native execution and human acceptance remain separate states.

## Escalate one missing consumer, then validate

Before more native decompilation, inspect the active backfill's native checkpoint and reuse its binary pin/address mapping. A useful request names one function question and expected cross-reference. For example: find syndrome removal and identify how tag/stat contributions from overlapping sources are restored. Broadly decompiling everything would produce a large unreviewed corpus without resolving that question.

Validate source hashes, installed-source parity, JSON parse, line bounds, full coverage partition, document links and output hashes. These checks validate the research archive and locators; they do not execute the game or establish engine behavior. Save a checkpoint with the finite pass result and exact unresolved consumers.

## Exact local commands and retained scripts

The scripts were created and executed with system `python3 -I`; only the Python standard library was used. No package/tool installation, network download, Lua execution, game execution or new Ghidra job was performed.

```sh
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/tools/capture_static.py
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/tools/read.py data/vanilla/vanilla_creatures/objects/creature_standard.txt 5-90 203-242 274-312
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/tools/index_coverage.py
python3 -I /Users/weiwei/.codex/research/dwarf-fortress-emergence-2026-10-15/tools/validate.py
```

`capture_static.py` is a repeatable local extraction, not a decompiler. It captures the current source state into this pass's raw area; preserve an old receipt before intentionally repinning a later build. `read.py` takes source-relative path plus one or more inclusive `START-END` windows. `index_coverage.py` regenerates SOURCE_INDEX.json and full definition blocks from existing receipts. `validate.py` checks the final archive and documents.

No retrying failed native fetches, guessed symbols or game launches was needed. The prior old-machine retained path was absent; the newly installed verified build and stable backfill copy supplied the replacement route.
