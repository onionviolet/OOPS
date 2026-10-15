# Absorbed games uninstalled, 2026-10-15

Weibao, 2026-10-15: "absorbed stuff can be uninstalled accordingly". Steam's own
uninstall dialog was opened for each fully researched game with no running lane
(`steam://uninstall/<appid>`); Weibao confirms each in Steam. Steam Cloud saves
are not touched. Warsim's in-install `Saves` folder held shipped mod and world
files dated at install time, not player saves.

| App id | Game | Dossier | Removed by 02:40 |
|---|---|---|---|
| 2552430 | Kingdom Hearts HD 1.5+2.5 | `docs/research/kingdom-hearts/` | dialog open |
| 990080 | Hogwarts Legacy | `docs/research/hogwarts-legacy/` | yes |
| 838350 | The Scroll of Taiwu | `docs/research/scroll-of-taiwu/` | dialog open |
| 394360 | Hearts of Iron IV | `docs/research/hearts-of-iron-iv/` | dialog open |
| 108600 | Project Zomboid | `docs/research/project-zomboid/` | dialog open |
| 1702330 | Rune Factory 5 | `docs/research/rune-factory-5/` | yes |
| 1201230 | Immortal Life | `docs/research/immortal-life/` | yes |
| 909660 | Vagrus | `docs/research/vagrus/` | yes |
| 774201 | Heaven's Vault | `docs/research/heavens-vault/` | yes |
| 1874490 | Potionomics | `docs/research/potionomics/` | dialog open |
| 1289810 | Siralim Ultimate | `docs/research/siralim-ultimate/` | yes |
| 294100 | RimWorld | `docs/research/rimworld/` | yes |
| 1060230 | Sapiens | `docs/research/sapiens/` | yes |
| 1147690 | NGU IDLE | `docs/research/ngu-idle/` | yes |
| 1546320 | Your Chronicle | `docs/research/your-chronicle/` | yes |
| 413150 | Stardew Valley | `docs/research/stardew-valley/` | dialog open |
| 533480 | Academagia | `docs/research/academagia/` | yes |
| 659540 | Warsim | `docs/research/warsim/` | yes |
| 3779340 | Idle Reincarnator | `docs/research/idle-reincarnator/` | yes |
| 2776450 | 诸天刷宝录 | `docs/research/zhutian-shuabao-lu/` | yes |

Kept: Remnant II (deep lane running), Amazing Cultivation Simulator (installing
for its backfill lane), VTube Studio, Steamworks redistributables, 100 Space
Cats (never researched).

**Rerun:** reinstall from Steam, then follow the dossier's TOOLING.md. Private
extracts in `~/.codex/research/<lane>/` stay, so most reruns only need the
build id compared against the dossier's INTAKE or CHECKPOINT. The backfill
watcher (`runs/watch3.py`) still starts lanes for reinstalled older games.
