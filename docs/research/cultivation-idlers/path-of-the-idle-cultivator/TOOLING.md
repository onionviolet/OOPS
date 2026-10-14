# Tooling and reproducible source locators

2026-10-14. Work area: `~/.codex/research/path-idle-cultivator/`. Only prose/analysis JSON written to the assigned repo output directory. No game launch, accounts, Steam interactions, save access, native control, commits, source/build edits or raw-code import.

## Acquisition

Official HTML `https://cultivator-path.com/` points to `game.bundle.js?v=mukbw9m0` at HTML line 1958. One direct fetch of each succeeded. The developer itch page was also read through web tooling. No retries, mirrors or account route were needed. No backend endpoints were contacted.

Commands run (directory creation preceded the downloads):

```sh
mkdir -p ~/.codex/research/path-idle-cultivator/{repos/build,tools,extract,notes}
curl -L --fail --max-time 45 https://cultivator-path.com/ -o ~/.codex/research/path-idle-cultivator/repos/build/index.html
curl -L --fail --max-time 90 'https://cultivator-path.com/game.bundle.js?v=mukbw9m0' -o ~/.codex/research/path-idle-cultivator/repos/build/game.bundle.js
npm view webcrack version dist.tarball dependencies --json
npm install --prefix ~/.codex/research/path-idle-cultivator/tools --ignore-scripts --no-audit --no-fund js-beautify@1.15.4
node ~/.codex/research/path-idle-cultivator/tools/node_modules/js-beautify/js/bin/js-beautify.js -x -s 2 -f ~/.codex/research/path-idle-cultivator/repos/build/game.bundle.js -o ~/.codex/research/path-idle-cultivator/extract/readable.js
node --check ~/.codex/research/path-idle-cultivator/repos/build/game.bundle.js
node --check ~/.codex/research/path-idle-cultivator/extract/readable.js
```

The formatter CLI and its import path were inspected before use. Installation used `--ignore-scripts`. Game bytes were treated as text; no eval/VM/browser/game runtime was used. `node --check` parses syntax without executing the game. Both checks passed. This does not prove behavior or transformations equivalent in every semantic detail.

## Installs / commits

One lane-local npm install: js-beautify **1.15.4**, 52 packages; package-lock.json retained under `tools/`. npm warned about deprecated glob 10.5.0. No global install or game dependency install. Formatter is a published npm release, not a Git clone; there is no repository commit to report. No source repository was cloned. webcrack 2.16.0 was queried, not installed or run; its sandbox/native dependency was unnecessary once string/property readability was established. Synchrony was not installed.

## Snapshot

| Artifact | SHA-256 / size |
|---|---|
| game.bundle.js | `42029c9283d2cd43d20787b932027aea8344a8a2d108e545b97698db713ea404`, 18,891,219 bytes |
| index.html | `8b5c0b48db22700918fae8ffef8d3d1db7fb4cd49a28cebcb590fa83c038ff34` |
| readable.js | `8b4595d7939dbe44e6157fc77fc5c1842c6d3d1fcccd417a6c9e4bf727ef6afa`, 20,264,998 bytes, 339,253 lines |

Hashes are in local `extract/HASHES.txt`; derived inventory metadata is in `extract/inventory.json`. The downloaded game hash exactly matches the prior report. Source-map reference scan returned zero. No speculative map URL was fetched. Raw/deobfuscated game code stays in the work area, outside Git.

## Mechanical rerun / further work

Use the pinned formatter command above to reproduce every `L` locator. Use `rg -n` for field names, then `sed -n` on a bounded range. Realm counts were obtained by a Python `-I` literal-array regex, without evaluation, for the normal/demonic/astral name arrays. The local writing scripts and inventory live under `notes/` and `extract/`.

Useful search keys: `REALM_CATEGORIES`, `QI_PER_STAGE_TABLE`, `getNextStageRequirement`, `TOTAL_TURNS`, `tribulationHp`, `lastRealTimestamp`, `resetForRebirth`, `secondaryUnlockKey`, `generateManual`, `getAllRecipes`, `soul_weapon_first`, `hasMasteredOrigins`, `requires`, `bonusMode`.

Dead ends / limits: prior page-only conclusion was too restrictive; full variable-name recovery was unnecessary. No source-map reference; no full module/source recovery attempted. Several broad searches returned giant UI/preload lines, so follow-up reads used bounded ranges. Neither beautiful output nor matching identifiers proves played behavior. The checkpoint names remaining deep-read families.
