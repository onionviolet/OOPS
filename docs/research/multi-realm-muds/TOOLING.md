# Tooling and reproducible route

2026-10-14. Public-pages-only pass. No installs, cloned repos, game binaries, decompilers, account logins, game launches or save access. No source/build writes, staging, commits or pushes. The source does not provide a server commit to pin. Page hashes pin the actual captures instead.

## Workspace and commands

Private work area: `/Users/weiwei/.codex/research/mw-muds/` with `tools/`, `extract/`, `notes/`. Repo output: `docs/research/multi-realm-muds/` only.

Python standard library handled HTTP, HTML parsing, JSON and SHA-256. Own helper `tools/fetch.py` fetches URL arguments of the form `capture-id=https://...`, stores raw bytes, a readable text projection and link lists, and appends URL/status/final-URL/hash/bytes to `extract/FETCH.jsonl`. It waits 1.2 seconds before every request, processes each batch sequentially and uses a 25-second timeout. No target-supplied code was executed. Website JS and tutorial code were read as text.

Worked example:

```sh
python3 -I /Users/weiwei/.codex/research/mw-muds/tools/fetch.py \
  'retro-newtransport=https://newbie.retromud.org/gameplay/world-transport' \
  '3k-room=https://3k.org/resources/primer/examples/room.html'
```

Use existing captures first. Do not blindly rerun failed original help routes. If refreshing, use the successful source URLs in SOURCE_LEDGER and retain new hashes separately rather than overwrite this evidence snapshot. Search used `rg` for owner/path discovery and endpoint identification. A small initial `urllib.request` capture saved `retro-home.html` and `3k-realms.html` before the scripted log; their hashes are included separately in the committed ledger. Public `web.run` opened the supplied pages and searched official help. Search-result text was a lead, not replacement runtime proof.

Output-generation helpers `tools/write_outputs.py` and `tools/write_details.py` generated the paraphrased reports and JSON from inspected findings. They write only this lane's output directory and private derived text. They are rerun scripts for this research snapshot, not YAIRPG tools or source code.

## Successful route discovery

| Code | Route | Why it matters |
|---|---|---|
| T1 | RetroMUD `/frames/left_planets.html` -> six `/frames/planet/*.html` profiles | Supplied frames page is a small introduction, not the whole corpus |
| T2 | Current RetroMUD `/` -> `https://newbie.retromud.org/` | Public current guide supplied progression, creation, equipment and travel |
| T3 | `/scripts/retromud.js` -> `/proxy/helpxml?=Category/topic` | Official public help mirror discovered from actual client code, no login |
| T4 | 3K footer -> `/resources/primer/index.html` | Public LPC examples, authoring workflow, scheduler guidance |
| T5 | 3K `/support/help/index.php` -> `/design/script/script_main.js` -> `/support/help/fetch-help.php?topic=...` | Actual public topic route returns JSON success/content; decoded private text preserves it |
| T6 | Archive.org resolved the old help pages to 2014-06-24 captures | Historical fallback only, date pinned in ledger |

## Dead ends and contradictions

| Code | Attempt | Result / disposition |
|---|---|---|
| D1 | Guessed 3K `/primer/` | HTTP 404 once. Followed the official footer's different resource path. No retries of the failed page |
| D2 | RetroMUD old HTML help for getting_started, interplanetary_transport and dues | HTTP 200 semantic failure, no such file. Switched to Archive.org; current site's XML mirror then supplied present public help |
| D3 | Requested archive year 2026 | Wayback resolved to 2014 captures. Never label these current 2026 rule evidence |
| D4 | Archive dues page | Only redirects the reader to guild-dues help; no dues formula inferred from that short alias page |
| D5 | RetroMUD statue locations, beginner transport threshold and broad reincarnation assets | Public texts differ. Conflicts remain in WORLDS_AND_TRAVEL and GUILDS_AND_CARRIERS; native resolution unread |
| D6 | 3K room tutorial search-message name | Prose/example spelling differs. Treat as a documentation mismatch; did not compile or repair the source |

## Private evidence and local checks

`extract/HASHES.txt` lists SHA-256 for every captured/derived extraction file except itself. `extract/FETCH.jsonl` and SOURCE_LEDGER retain received-source metadata. Batch output logs live in `notes/`. Initial main checkout state was heavily dirty from other work; no unrelated file was edited or restored.

Checks are documentation checks only: JSON parses, A01-A12 exact key set, unique finding/packet/touch IDs, evidence labels, linked local targets, expected output files and no em dashes in this lane's prose. `notes/VALIDATION.json` records actual results. There was no build, game test, browser acceptance or persistence roundtrip. No equivalent runtime suite was run for a documentation-only pass.

Final local validation: all 9 documentation checks passed. Private workspace used 2206478 bytes before writing the validation receipt (about 2.1 MiB). No runtime checks ran.
