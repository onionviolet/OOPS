# Codex sessions (2026-10-14, setsid detached)

| Lane | Output | Session id |
| --- | --- | --- |
| hoi4 | `docs/research/hearts-of-iron-iv/` | 01a13c3c-bcd7-7e21-bfb2-fbd314755c03 |
| idle-reincarnator | `docs/research/idle-reincarnator/` | 01a13c3c-bcf5-7600-8867-f1944eeec05b |
| path-idle-cultivator | `docs/research/cultivation-idlers/path-of-the-idle-cultivator/` | 01a13c3c-bd17-7902-88e5-ed20b6b41317 |
| discworld-2 | `docs/research/discworld-mud/pass-2026-10-14/` | 01a13c3c-bd67-7943-8c75-a62fb1a3e992 |
| kol-2 | `docs/research/kingdom-of-loathing/pass-2026-10-14/` | 01a13c3c-bda5-7fe2-b768-8813945a1789 |
| idle-depth | `docs/research/immortality-idle/pass-2026-10-14/` | 01a13c3c-bdbc-76a0-9783-5e4aa31ac1d5 |
| idleon | `docs/research/legends-of-idleon/` | 01a13c3c-be21-7e42-890d-26e9a2d30d96 |
| free-text-worlds | `docs/research/free-text-worlds-2026-10-14/` | 01a13c3c-be1c-7443-b779-071142336442 |
| prestige-community | `docs/research/modding-tree/pass-2026-10-14/` | 01a13c3c-be39-7710-8a13-9f119447d66b |
| coverage-refresh | `docs/research/coverage-refresh-2026-10-14/` | 01a13c3c-be81-7c90-94a6-582bfee0988d |
| adoption-reaudit | `docs/research/game-research-adoption-reaudit-2026-10-14/` | 01a13c3c-be89-7151-8113-ce75058d326d |

## Round 1 results (all eleven finished by 17:26, each PARTIAL with a named unread table)

Outputs committed in their output dirs. Coverage refresh proposes a queue rewrite (not applied: its install rows predate the payloads). Adoption re-audit: 597 rows, 20 unpark packets (U01-U20).

## Round 2 (2026-10-14 17:26 to 17:33)

| Lane | How started | Session id |
| --- | --- | --- |
| pw-intake | manual | 01a13c55-4055-7891-8437-30d4bfef6c55 |
| vagrus-2 | manual | 01a13c55-404f-7103-8084-c36362c12c07 |
| tale-of-immortal-2 | manual | 01a13c55-4079-7052-b421-e4587b6bd24c |
| your-chronicle-2 | manual | 01a13c55-4077-7642-b773-c79891f873d9 |
| academagia-decompile | watcher | 01a13c4f-0f18-7980-a7b1-ac7bd1625122 |
| heavens-vault | watcher | 01a13c4f-0f18-73f3-aef7-962f908f505d |
| warsim | watcher | 01a13c4f-0f44-7a11-9f1d-85a7868731da |
| ngu-idle | watcher | 01a13c4f-0f44-7301-bb38-edd02c4983e2 |

Weibao asked for Vagrus "and more": vagrus-2, tale-of-immortal-2 and your-chronicle-2 are depth passes on prior finite lanes' unread tables. pw-intake was started by hand because HoI4 ended PARTIAL (its gate looked for COMPLETE) with `PROVINCE_WAR_FIT.md` delivered. The watcher was restarted with that state; it still waits on taiwu and immortal-life.

## Gated (started by `runs/watch.py`, detached, 5-minute poll, 7-day limit)

| Lane | Gate |
| --- | --- |
| academagia-decompile, heavens-vault, immortal-life, taiwu, warsim, ngu-idle | Steam manifest fully installed and a Windows `.exe` present (install through Steam with the macSteam `notproton` compatibility tool) |
| pw-intake | runs in `/Users/weiwei/code/province-war` once `docs/research/hearts-of-iron-iv/CHECKPOINT.md` says COMPLETE |

Watcher log: `runs/watch.log`; launched gated lanes are listed in `runs/watch.state.json` and get their session id at the top of `runs/<lane>.log`.

Resume a lane: `LANE_CWD=<cwd> python3 runs/launch.py <lane> lanes/<lane>.prompt.md <session id>`.

## Not dispatched

- 100 Space Cats: casual hidden-object game, IL2CPP; no named mechanic question.
- Magical Diaries, Songs of Syx, Stoneshard, Starsector: not owned.
- P00 (`absorb-all/p23-host-joins`) merge: held. P00 is the live integrator with tranches 3 to 5, P16 and P15 open; its branch carries all sixteen wave-2 modules, so merging now would land unverified lanes. Air-wider was already merged in integration pass 2 (`2aaf07ad`).
- SteamCMD route: tried and removed. On macOS it shares the Steam client's folder, and `steam.cfg` inhibits its bootstrap; nothing changed in the client's files.

## Tool installs this wave

- `ilspycmd` 11.1.0.9782 as a dotnet global tool in `~/.dotnet/tools` (SDK 10.0.402 was already in `~/.dotnet`).
