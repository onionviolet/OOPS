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
