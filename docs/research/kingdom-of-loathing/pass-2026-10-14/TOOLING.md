# Acquisition and reproducible data pass

No tools were installed. No game, KoLmafia program, upstream script, build, test suite, account or save was run. Only agent-authored Python scripts read text or fetch public archives. Python was invoked with `-I`. Git cloned source without running its hooks or builds.

Work area: `/Users/weiwei/.codex/research/kol-2/`. Raw snapshots, extracted page text, source clone, fetch logs and scripts remain there. The repo contains analysis and short identifiers only.

## Source revisions

- Fresh read-only clone: `https://github.com/kolmafia/kolmafia.git`, commit `d6747f7af98605b14eaeb2c63e11daa9532e1152`, BSD-3-Clause. Clone took several minutes, then completed normally.
- Prior read-only checkout inspected for exact comparison: `/private/tmp/claude-501/kol-src/kolmafia`, `b11fc583b6872f1d56f5936803de2359cc962328`. No writes there. Its path-enum SHA-256 equals the fresh clone's: `151a00f8505ea377117f848cbe31a3b40a636cde2373ac0ddd7a7cc756063294`.
- Raw wiki captures are third-party community documentation of Asymmetric's game. No game assets or full page prose are copied into YAIRPG. Capture timestamps are in SOURCE_LEDGER.

## Commands that worked

Run from the main checkout, while preserving this lane's exclusive output scope:

```sh
git clone --depth 1 https://github.com/kolmafia/kolmafia.git /Users/weiwei/.codex/research/kol-2/repos/kolmafia
python3 -I /Users/weiwei/.codex/research/kol-2/tools/extract_paths.py /Users/weiwei/.codex/research/kol-2/repos/kolmafia /Users/weiwei/.codex/research/kol-2/extract
python3 -I /Users/weiwei/.codex/research/kol-2/tools/audit_data.py /Users/weiwei/.codex/research/kol-2/repos/kolmafia /Users/weiwei/.codex/research/kol-2/extract
python3 -I /Users/weiwei/.codex/research/kol-2/tools/fetch_archives.py /Users/weiwei/.codex/research/kol-2
python3 -I /Users/weiwei/.codex/research/kol-2/tools/fetch_coldfront.py /Users/weiwei/.codex/research/kol-2
python3 -I /Users/weiwei/.codex/research/kol-2/tools/fetch_replay.py /Users/weiwei/.codex/research/kol-2
python3 -I /Users/weiwei/.codex/research/kol-2/tools/read_archives.py /Users/weiwei/.codex/research/kol-2
python3 -I /Users/weiwei/.codex/research/kol-2/tools/write_tables.py /Users/weiwei/.codex/research/kol-2 docs/research/kingdom-of-loathing/pass-2026-10-14
```

The fetch batches run serial requests with a 1.1-second start interval or slower. Every endpoint gets one attempt. Archive availability is a discovery route; replay is a separate capture route, not a retry of the live wiki. Inspect logs before reusing any acquisition command, so a restart does not repeat failed endpoints.

Index acquisition used archive.org's Wayback availability API to find the nearest capture, then fetched its `web.archive.org/web/<timestamp>id_/...` URL. Old index captures used `20180618055003` and `20231030182411`; new index `20260822021427`. `read_archives.py` extracts the first challenge-index table and produces local page text. The output generator combines paraphrased analysis with metadata and source locators. It does not execute fetched Java or wiki JavaScript.

## Dead ends and fixes

- Web tool could not open the CDX query. Switched to shell HTTP, which returned a real 200 JSON index for the old Challenge_path alias.
- Latest CDX requests for both hosts returned Internet Archive Temporarily Offline HTML. HTTP 200 alone was insufficient. Switched to Wayback availability, then direct capture replay.
- Several availability lookups returned no snapshot, 503 or timeout. Logs distinguish these from a wiki page. Direct replay of the HTTP Coldfront URL found a Bees capture that availability had missed. Thus “no snapshot” from that API does not establish absence from the archive.
- Some raw `id_` responses were gzip-compressed even without a convenient decoded body. The parser initially rejected those as UTF-8. Detected gzip magic and decompressed before reading; later fetch scripts do this automatically.
- Teetotaler and Oxygenarian title captures are tattoo pages. They were not counted as detailed dietary-rule pages.
- The prior report abbreviated source layout inaccurately. The checked clone uses `src/main/java/net/sourceforge/kolmafia/` and `src/main/resources/data/`. Pinned links and locators in this pass use those paths.

## Reproduce measurements without game execution

The path script parses enum constructor literals, applying default arguments without running Java. The data script excludes comments/version-only lines and requires each table's documented field count. Modifier splitting respects quotes and bracket depth. Counts are lexical data measurements, not an exhaustive evaluation of expressions or live game eligibility.

The same measurement script was run against both commits, producing matching summaries. `extract/data-audit.json`, `extract/prior-counts/data-audit.json`, `extract/path-metadata.json` and fetch logs are the raw evidence. Hashes of extracts and selected source files are in `extract/HASHES.txt`. CHECKPOINT gives final disk use and exact unread rows.
