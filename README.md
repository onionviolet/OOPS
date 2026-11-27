# OOPS

**Optimistic Progression Simulator**. OOPS is the stylized name, with an extra O because we like it.

A text-based RPG by Weibao about exploring worlds with their own rules, economies and ways to progress. OOPS grew out of Miktaew's **Yet Another Idle RPG** and has its own design direction and release milestones.

See [PROJECT.md](PROJECT.md) for current work and [AGENTS.md](AGENTS.md) for agent instructions.

## AI use

Weibao directs the game. AI tools help write code, research and prototype mechanics, draft game text and create some visuals. Some changes have been tested by agents and are still awaiting human playtesting.

## Versions and changelog

Open the [changelog](changelog.html) from the version link in the game. It collects player-facing OOPS changes and preserves the upstream YAIR history.

Use `v0.1.0-dev.N` for development milestones. The retrospective entries use the dates their changes were verified. Keep a record of the evidence and, for an installed desktop snapshot, its exact build ID. Collect new player-facing changes and upgrade notes under **In development** until the next milestone.

Reserve `v0.1.0` (Git tag `oops-v0.1.0`) for the first genuinely playable release. Match or exceed the player-facing scope of a major YAIR update for `v0.1.0` and future major feature updates. Compare the new or substantially changed decisions, the content that puts them to work, and what they change later in play. Use the [YAIR release comparison](docs/reviews/YAIR_RELEASE_SCALE_2026-11-08.md) as the reference.

On the exact release candidate, start a fresh life through the normal menus, play the headline changes through to their consequences, and verify that the results survive save and reload. Use the assets included in the intended release. Subsequent feature releases get minor bumps and fixes get patch bumps. OOPS release labels, the YAIR save compatibility version and the Tauri package version serve separate purposes.

## Credits and upstream

- [OOPS repository](https://github.com/onionviolet/OOPS)
- [Yet Another Idle RPG by Miktaew](https://github.com/miktaew/yet-another-idle-rpg) · [original release](https://miktaew.github.io/yet-another-idle-rpg/)
- [Upstream development repository](https://github.com/miktaew/yet-another-idle-rpg-dev) · [development release](https://miktaew.github.io/yet-another-idle-rpg-dev/)

OOPS started from the YAIR v0.6 development source. YAIR was inspired by Proto23. See the [MIT license](LICENSE) for Miktaew's original copyright and license notice.

## Running

For browser play, run `npm install`, `npm run build` and `npm run serve`, then open `http://127.0.0.1:8123`. The local server requires Python 3.

On Windows installations that provide Python 3 as `python`, start the game server with `python -m http.server 8123 --bind 127.0.0.1`.

To open the development World Atlas alongside the game, run `node prototypes/world-atlas/serve.mjs` and open `http://127.0.0.1:4178/#workbench/handoffs`. In **Implementation handoffs**, compare playtests with the local game build and export the routes to try in game. **Ideas and backlogs** opens the source entries. **Library → Coverage by world** ranks the saved reading measurements and opens the file counts for each world. During play, **Your journal & atlas** shows the places and routes your character has discovered.

On macOS, run `npm install` and `npm run tauri:install` to build and install `Yet Another Idle RPG.app` in `~/Applications`. Run `npm run desktop` to build a snapshot of the current files and open it in the app. The desktop build requires Rust (`cargo`). See the [desktop setup guide](desktop-tauri/README.md).

Game balance is still in development. Use **Export** to back up your save. The browser and desktop app keep separate saves, so use **Export** and **Import** to transfer progress between them.

## Modding

Run `npm run build` after editing the source. The YAIR development repository linked above may have fixes or examples you can reuse. Its `master` development branch can differ from the hosted `gh-pages` build.

Run `Verify_Game_Objects()` in the browser console to check content values and references.

If you share a mod, credit and link to the project you based it on.
