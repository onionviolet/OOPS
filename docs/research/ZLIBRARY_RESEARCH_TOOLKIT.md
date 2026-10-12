# Z-Library research toolkit

User requested candidate comparison and a project research fork, 2026-10-11.
This is tooling setup, not an accepted world design or implemented gameplay.

**Fork:** [onionviolet/zlibrary-research](https://github.com/onionviolet/zlibrary-research).
**Local checkout:** `/Users/weiwei/code/zlibrary-research`.
**Profile and comparison:** `/Users/weiwei/code/zlibrary-research/docs/YAIRPG.md`.
**Prepared MCP example:** `/Users/weiwei/code/zlibrary-research/examples/yairpg.mcp.json`.

## Current local upgrade: 0.3.0

Weibao authorized implementation and selective external absorption on 2026-10-11.
Implemented and installed locally in the fork's isolated environment:

- O1: structured MCP reason/stage/recovery hints and explicit deadline failures.
- O2: literal local book search and bounded chapter reads with hash/member citations.
- O3: conservative edition comparison and read-only EPUB library lookup.
- O4: paragraph-preserving parsing, declared encodings and extraction warnings.
- O5: output hashes/versioned receipts and verified, non-overwriting retries.

There are now ten MCP tools. Original chapter JSON remains compatible; version-1
receipts stay untouched and require a new edition destination for version-2
verification. Local lookup covers EPUB files, not Calibre's database or PDFs.

Fresh upstream fetches found no new delta to merge. Adapted Rookslog's block/inline
parsing approach into the standard-library extractor, with retained MIT notice;
no verbatim converter or RAG pipeline was imported and no runtime dependency was
added. [Upgrade evidence](https://github.com/onionviolet/zlibrary-research/blob/3a19de35b1c76480d43498eb654699e1bdf1b77e/docs/UPGRADE_0_3_0.md)
and [attribution](https://github.com/onionviolet/zlibrary-research/blob/3a19de35b1c76480d43498eb654699e1bdf1b77e/THIRD_PARTY_NOTICES.md)
record the exact revisions and scope.

276 offline tests passed, including real MCP stdio local workflows. Lint/format,
wheel/source build and package content checks passed. The installed MCP
entrypoint separately passed initialize/list/prepare/retry/search/read/lookup/
compare with invented fixture prose.

The already installed Tor Browser binary bootstrapped in an isolated headless
test process on port 19050. Live doctor, anonymous search (three candidates) and
metadata lookup (12 allowlisted fields) passed, with search/metadata exercised
through MCP stdio. The temporary process was stopped; ordinary remote use still
needs the intended proxy listener. No credentials or books were acquired.

Remaining live gate: authenticated quota, a user-selected acquisition and cache
retry. App MCP registration remains prepared, not changed or verified. The
research upgrade was committed and pushed as
[`3a19de3`](https://github.com/onionviolet/zlibrary-research/commit/3a19de35b1c76480d43498eb654699e1bdf1b77e)
on `codex/yairpg-research`, with the remote ref confirmed. This game handoff is
delivered separately on `codex/gameplay-foundations`. Game code, user saves and
source libraries were untouched.

## Initial setup evidence (before 0.3.0)

F1: sertraline/zlibrary is a useful original async API client but still uses
HTML parsing and a fixed domain in the inspected revision. tw3kirk adds an MCP
façade to that client. Rookslog's separate MCP has JSON EAPI search/downloads and
more extensive processing, but its full-text search routes to ordinary search.
The profile contains five ranked candidates, inspected revisions and limits.

D1: fork sl251/zlibrary-tor `89af34ac0b121415554da6059a3e7a5052777482` for a
small Python research companion. It supplies origin-bound sessions, quota
checks, bounded JSON requests and hash-verified caching. Added six MCP tools,
metadata lookup and private EPUB intake. Preserve its MIT license and upstream
attribution. No code was absorbed from the other candidates.

F2: the project extractor at `docs/research/tools/book_deep_dive/epub_to_json.py`
sorts archive filenames and drops directory prefixes. The fork follows the
declared EPUB spine and retains full paths, avoiding chapter-order errors and
collisions between equal basenames. It uses the same `{member: [heading, body]}`
JSON shape for existing reader helpers. No existing script was replaced.

Outputs go under gitignored `docs/research/novels/zlibrary/<edition>/`.
Receipts retain embedded edition metadata, source SHA-256 and chapter locators;
they explicitly distinguish extraction from reading, completeness and fidelity.
Source files remain read-only. Follow [the deep dive playbook](SOURCE_DEEP_DIVE_PLAYBOOK.md)
for qualification, reader scope, sealed discoveries and research synthesis.
The playbook's `tools/book_deep_dive/` shorthand currently resolves here to
`docs/research/tools/book_deep_dive/`.

F3: 256 offline tests passed, including real MCP stdio initialization and local
EPUB intake using invented fixture prose. Lint/format checks and wheel/source
build passed. CLI and MCP are installed only in the fork's isolated `.venv`.
The MCP example is prepared, not registered in an app. Existing game edits,
Calibre library and user saves were untouched.

R1: live default doctor returned `proxy_unreachable`, because localhost:9050
has no Tor listener. Live endpoint search, login and download remain unverified.
No Tor software was installed or started, and no user book was acquired.
Direct HTTPS is also supported after the upstream domain-verification setup.
The remaining gate is a reachable endpoint, live search/metadata lookup and a
user-selected authorized acquisition with a verified cache retry.
