# Z-Library research tooling improvement review

Implemented under subsequent user authorization as local research fork 0.3.0;
see [current toolkit status](ZLIBRARY_RESEARCH_TOOLKIT.md#current-local-upgrade-030).
The proposal and inspection evidence below describe the pre-upgrade state.

Proposal only, 2026-10-11. No API code, configuration, accounts or library files
were changed. Reviewed local fork `d4957c7a137490830499415a3b5117811faad48a` at
`/Users/weiwei/code/zlibrary-research`; its working tree was clean.

## Ranked improvements

| ID | Proposal | Current evidence and benefit | Acceptance gate |
|---|---|---|---|
| O1 | Finish live connectivity verification and preserve structured diagnostics | A fresh TCP probe found no listener at `127.0.0.1:9050`. This only proves the default proxy is unavailable, not that the remote service is down. `research_mcp.run_cli` turns CLI failures into a reason-only exception, losing the CLI's `stage`. Return allowlisted reason/stage and a safe recovery hint; expose deadline failures explicitly. | Offline MCP error cases distinguish proxy, API, session and deadline failures. Then a configured endpoint passes live search/metadata; a separately user-selected acquisition passes download and cache retry. |
| O2 | Add local chapter search and bounded chapter reads | The six MCP tools have remote metadata search and EPUB preparation but no prepared-text search/read tool. Receipts already retain SHA-256, full member paths and spine order. Add literal/context search first, with bounded results and citation locators. | Invented fixtures demonstrate accurate matches, limits and hash/member citations; unknown editions and modified prepared text fail predictably. Keep source truth and sealed findings out of public reports. |
| O3 | Compare editions and check local ownership before acquisition | Search exposes title/author/year/language/format/size; metadata adds publisher/edition/ISBN/pages. There is no explicit comparison tool or read-only local-library lookup. A private index can reduce wrong-language, partial-volume and duplicate acquisitions, but uncertain matches must stay uncertain. | Fixtures cover ambiguous titles, translations, volumes and duplicate hashes; a library lookup changes no source files and returns no public library inventory. |
| O4 | Improve EPUB extraction fidelity | `prepare_epub` assumes strict UTF-8 and strips markup with regular expressions, inserting line breaks around every tag. Inline formatting can fragment sentences. Missing manifest references raise raw lookup errors; non-text spine items are silently skipped. Use a parser that preserves paragraph structure, respect supported declared encodings, and record skipped/empty members and extraction warnings. | Invented fixtures cover inline emphasis, CJK text, alternate encoding, missing members, image-only content and empty chapters. Warnings never establish completeness or translation fidelity. |
| O5 | Make preparation repeatable and verifiable | Preparation refuses every existing destination, including a retry after successful extraction. Receipts hash the source but do not hash `text.json` or record extractor version. Return an existing verified result for matching source/version/output hashes; preserve conflicts and incomplete output for explicit review. | Matching retries succeed without rewriting; different sources, corrupted output and partial directories produce distinct conflicts. Sources stay unchanged. |

Recommended first implementation slice: O1 diagnostics plus O2 local retrieval.
Connectivity is the operational gate; local retrieval provides value even while
the remote route is unavailable. O3 follows when acquisition becomes routine.

## External comparison

Fresh primary-source documentation checks:

- [sl251/zlibrary-tor](https://github.com/sl251/zlibrary-tor) documents the Tor
  listener prerequisite and separate search/login/download flow. It remains the
  incumbent foundation. No fresh upstream commit diff was inspected.
- [rookslog/zlibrary-mcp](https://github.com/rookslog/zlibrary-mcp) documents
  multi-source search/downloads and optional processing tiers. This makes it a
  useful comparison for later document processing. Its current implementation
  was not audited or executed here; replacing our fork is not recommended by
  this review.

## Verification limits

Source review, clean fork status, revision lookup, primary documentation and a
local TCP probe were performed. No test suite was rerun because this review
changes documentation only. Prior 256-test/packaging evidence belongs to the
setup run documented in `ZLIBRARY_RESEARCH_TOOLKIT.md`, not this review. Live API,
session validity, current app registration and authenticated downloads were not
verified. No book was acquired. Existing game work was preserved.
