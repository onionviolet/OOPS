# Sessions (launched 2026-10-13 22:06 EDT, detached with setsid, gpt-6-luna medium)

Logs (private, contain raw wiki text): `~/.codex/research/wiki-lanes-2026-10-13/<lane>.log`. Resume: `python3 launch.py --resume <lane> <session id>`. Check liveness with `ps`, not file mtimes.

| Lane | Session id | Writes to (full-dumps/workers/) |
|---|---|---|
| csm | 01a13827-f9a3-7373-b4fa-b8470b1b34fb | csm-full/ |
| jjk | 01a13828-0178-7ce3-9033-f63b68f97303 | jjk-full/ |
| bleach-a | 01a13828-0945-7a13-82db-707fadf9ff31 | bleach-full/shard-a/ |
| bleach-b | 01a13828-1121-7893-a217-7c6147f37c9b | bleach-full/shard-b/ |
| bleach-c | 01a13828-18ff-7e60-94fe-032f319c7355 | bleach-full/shard-c/ |
| fate-a | 01a13834-bff2-7b50-900e-250c7337bfa1 | fate-full/r2-2026-10-13/shard-a/ (manifest idx 31–1035) |
| fate-b | 01a13834-c7fd-7341-b5bf-74ae2f14b068 | fate-full/r2-2026-10-13/shard-b/ (idx 1036–2517) |
| fate-c | 01a13834-cfa9-7a01-ab1a-17ffd9b20194 | fate-full/r2-2026-10-13/shard-c/ (idx 2518–6391, then 21 zero-input records) |

Fate (`typemoon`) cache was restored the same day (archive hash matched; 6,371/6,371 inputs rebuilt). Fate readers launched later the same evening in a new `r2-2026-10-13/` subfolder, because `fate-full/` itself is in the Air archive; its 33 earlier rows stay frozen.

## Sync caution

`~/Private Mac Transfer/yair-private-work-20261013.tar.zst` (from the Air) contains the git-ignored research tree as of 2026-10-10/11. Extracting it over this repo would revert these 2026-10-13 edits: `wiki-digests/SOURCES.md`, `DUMPS.json`, `CHECKPOINT.md`, `full_dump_reader.py`, and the pause notes in `workers/{fallout,skyrim,elden}-full/CHECKPOINT.md`. The new lane folders (`jjk-full`, `bleach-full`, `csm-full`) are not in it. Extract to a separate folder and merge, or skip `docs/research/power-systems/wiki-digests/`. The second archive (other-private-work) was still syncing at launch; if it holds `~/.codex/research/wikis`, the refetched JJK and Fate archives are byte-identical by SHA-256, while Bleach and Chainsaw Man are new paths.

## Watchdog and later lanes (2026-10-13 22:30)

`watchdog.py` runs every 5 minutes under launchd (`~/Library/LaunchAgents/com.weibao.yair-lane-watchdog.plist`). It reads `lanes.json` (22 lanes: 11 readers/reviewers, 6 world-pack syntheses gated on their readers' `SUMMARY.md`, 5 Air-absorb lanes from `../air-absorb-2026-10-13/`), resumes any stopped unfinished lane by session id (Codex tends to end a turn after a few pages), backs off exponentially when a lane's ledger stops growing, caps concurrency at 16, writes live state to `STATUS.md`, and unloads itself when every lane is done. Stop it early: `launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.weibao.yair-lane-watchdog.plist`.

HxH and FMA caches were restored the same evening (hash-matched archives; 1,256/1,256 and 581/581 inputs). HxH resumes as two shards in `hxh-full/r2-2026-10-13/`; FMA gets a parent-review lane in `fma-full/r2-2026-10-13/review/`. Session ids for lanes started by the watchdog are in `STATUS.md`.
