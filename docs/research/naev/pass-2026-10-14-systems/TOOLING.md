# Naev deep systems tooling

Lane `ds-naev`, 2026-10-14. No installs or network requests. No game, Windows executable, downloaded helper, build, test, save access, account operation, git add, commit or push. Earlier work area read-only; only own output directory and own work area written.

## Source and captures

Retained repository: `/Users/weiwei/.codex/research/lib-naev/repos/naev`, GitHub mirror of Naev. `git rev-parse HEAD` returned `f8982244800e86553217a2dba555a0f41c2b87ba`; `git status --short` was empty. No fetch or Codeberg-head comparison, so no latest-version claim. Assets submodule remains outside this pass. Prior corpus and licenses are recorded in [earlier TOOLING](../TOOLING.md).

Own area: `/Users/weiwei/.codex/research/ds-naev/`.

| Path | Retained material |
|---|---|
| `extract/source/` | 43 full selected source files including Lua dialogue/conditions, XML examples, native models and readers. Private, not copied to public repo. |
| `extract/source_hashes.json` | SHA-256 per selected source file, relative to retained repo. |
| `extract/prior_manifest.json` | Paths, hashes and sizes for every earlier Naev dossier artifact found, including ignored private pointer. Excludes this output directory. |
| `extract/HASHES.txt` | SHA-256 of all lane extracts, including selected source copies. |
| `extract/validation.json` | Artifact checks, separate from source/gameplay verification. |
| `tools/write_report.py` | Local standard-library writer for traces, private snapshots and census. |
| `tools/write_delivery.py` | Local writer for report, eight proposals, touches and checkpoint. |
| `tools/validate.py` | Local standard-library artifact validator. No source execution. |

For the full authored corpus, reuse the prior clone and its `extract/xml_tables.json` and `mission_event_index.json` read-only. These preserve full tables, original Lua text, conditions and label navigation. A regex index is not a complete dialogue graph. Public artifacts paraphrase and link stable source paths/functions; no raw dialogue tables or copied gameplay code.

## Commands that worked

From project root:

```sh
cat docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md
cat docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md
rg --files docs
rg -n '^## P' docs/research/cross-game-synthesis-2026-10-14/PACKETS.md
git status --short
```

Read pinned source with `rg -n`, `sed -n` and `cat`; resolve filenames with `rg --files` before following C/Rust/Lua callers. Useful exact anchors: `src/player.c:player_saveShip`, `src/player_fleet.c:pfleet_cargoRedistributeInternal`, `dat/board.lua:board_capture`, `dat/scripts/escort.lua:_escort_heartbeat`, `dat/scripts/equipopt/optimize.lua:optimize.goodness_default`, `dat/scripts/common/poi.lua:poi.generate`, `dat/missions/neutral/poi.lua:create`, `src/tech.c:tech_testCond`, `src/pilot_ew.c:pilot_ewScanStart`, `src/effect.c:effect_add`, `src/damagetype.rs:dtype_calcDamage`, `src/economy.c:economy_sysSave`.

Mechanical rerun, preserving the earlier repo:

```sh
python3 -I /Users/weiwei/.codex/research/ds-naev/tools/write_report.py
python3 -I /Users/weiwei/.codex/research/ds-naev/tools/write_delivery.py
python3 -I /Users/weiwei/.codex/research/ds-naev/tools/validate.py
```

The writers replace only this lane's artifacts and private snapshots. TOOLING is maintained separately. Recheck the retained pin before rerunning. No external packages or source-provided scripts are needed.

## Dead ends and corrections

| Item | Result / route |
|---|---|
| Broad prior-artifact concatenations | Display truncated. Followed with bounded REPORT/digest/packet/aspect reads and JSON field inspection; do not interpret initial output as full reading. |
| Memory keyword pass | No Naev or sweep hits; no memory-derived project claims used. |
| Guessed neutral escort mission paths | Files absent. Resolved actual `dat/scripts/escort.lua` and player escort interface. No generic wage/hire system inferred. |
| Guessed `src/damagetype.c`, XML kinetic file | Native implementation is Rust, definitions are TOML at this pin. Corrected paths and inspected formula. |
| Guessed board helper under scripts | Actual source is `dat/board.lua`; traced real capture quote. |
| Owner read from source-clone cwd, plus one stray nonexistent docs path | Read-only failures. Real project owner read from project root. No path created or mutated. |
| Initial inventory route heuristics | These provide proposed broad routing, not absence proof. Detailed DS rows and explicit specialist gaps qualify the automatic parent mappings. |

## Validation boundary

Validator checks fifteen distinct DS sections, all original 30 module and 21 semantic rows, 94 unique inventory IDs, valid K/P references, owner paths, 25 touches, eight proposal packets, primary source paths, relative Markdown links, no em dashes, source snapshot hashes and prior artifact hashes. Hash ledger covers private extracts. This is structural artifact validation, not formula execution, Lua reachability, rendered UI, save roundtrip, whole-game coverage or director acceptance.

Measured before final validation: own area 856 KiB; output 184 KiB. Final measurement and validation result follow below.

Final artifact validation: **PASS**. Fifteen traces, 94 inventory rows, 30 original module rows, all NV-I01..NV-I21, 28 explicit residuals, eight packets, 25 touches and 43 source captures verified. Relative links, source paths, proposed owner paths, original artifact hashes and private extract ledger pass. No source or runtime test executed.

Final measured disk use: lane work area 864 KiB; output directory 192 KiB.
