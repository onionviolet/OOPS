# Steam installs audit, 2026-10-09

Dispatched 2026-10-09 by Claude Code at Weibao's request ("delete tested
games and then try to install games using app ids accordingly").

## State at dispatch

- Tale of Immortal (1468810) uninstalled 2026-10-09 after its audit. Mod,
  MelonLoader setup and the full Wine prefix are backed up at
  `~/Documents/Backups/tale-of-immortal-2026-10-09/`. Free disk ~34 GB.
- All six targets are Windows-only on the store. Claude added each to
  Steam's `CompatToolMapping` with the `notproton` (CrossOver) tool, the
  same setup Tale of Immortal used (config backup:
  `~/Documents/Backups/steam-config.vdf.2026-10-09.bak`), restarted Steam and
  sent `steam://install/<appid>` for each. Steam logged the URLs but created
  no manifests: the install dialogs likely wait for Weibao's click.
- Keep installed: Your Chronicle, VTube Studio, 100 Space Cats.

| AppID | Game | Store price |
|---|---|---|
| 3848900 | Sucker for Love: Crush Landing | paid; ownership unconfirmed |
| 4522510 | Kill the Lich Idle | free |
| 3795920 | Ani Idle | free |
| 2847400 | Endless Ascent | free |
| 3606890 | Upload Labs | free |
| 1740540 | The Lands of Eldyn | free; has a macOS depot |

## Task

1. Poll `~/Library/Application Support/Steam/steamapps/appmanifest_<id>.acf`
   and `logs/content_log.txt` (every few minutes, up to two hours). Never
   click Steam dialogs, never log in, never accept terms or purchase.
2. For each game that reaches Fully Installed: follow the method in
   [library-games ASSIGNMENT](../library-games-2026-10-09/ASSIGNMENT.md)
   (read-only on installs, never launch, never touch saves, copies under
   `~/.codex/research/<game>/` with hashes, audit in `docs/research/<game>/`,
   update the existing REPORT there from storefront-only to source audit).
   One game at a time; then `open steam://uninstall/<appid>` and record it.
3. Record each game that never installed and the observed reason (no
   manifest, not owned, platform, dialog unconfirmed) in STATUS.json here.
4. Fold findings into docs/LIFE_SIM_NORTH_STAR.md as a dated "findings"
   subsection, marked proposals.

No YAIR src, builds, saves or commits.

## Output

STATUS.json (per-app result), CHECKPOINT.md, and per-game reports.
