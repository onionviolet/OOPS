# Start records: first layered slice (until-done goal, 2026-10-13)

Authority: Weibao, 2026-10-13: "more to consider for layered records and start
sources? Send codex to try and work accordingly?" Design owner:
[intro flow considerations](../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md)
rounds 2-5 (RX1, UI3, UI4, WC1-WC9, WL7, SR1, SR2, SR5, SR6, LY1, LY2, LY5,
LY6, LY7, LY8, LY9). Proposals; this lane is a reversible prototype.

Worker: one Codex CLI run (`runs/`) in its own worktree
`/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg`, branch
`codex/start-records`. Claude verifies and reports; integration into
`codex/gameplay-foundations` is a later, separate decision.

Target viewport: desktop 1366x768, 1440x900, 1920x1080. Mobile deferred.
Visible outcome: on a localhost fresh origin with `?start_probe=1`, the
creation panel shows a roll panel; the player can lock, roll or hide each
axis, see a start card, and begin with that composed start. Without the probe
flag, nothing changes. Deferred: random world pool, other worlds, links,
non-dev exposure, save schema.

## Objective

A pure layered start resolver plus the vanilla Village start wrapped as data,
and a dev-probe roll panel that can begin a life from a composed start.

## Items

| ID | What |
| --- | --- |
| SR-A | `src/start_records.js` (pure, no DOM): `resolveStart(world, choices, seed)` where `choices[axis]` is `{mode:'lock'|'roll'|'unknown', layerId?}`. Fixed axis order per world (LY1). Layers patch a snapshot (`money`, `items[]`, `location`, `quest`, `skills{}`, `knowledge[]`, `text[]`) with declared merge rules (LY2). Layers carry `tags`, `needs`, `excludes` (LY3) and `weight`. Seeded deterministic RNG (same world+choices+seed gives same result). Returns `{snapshot, provenance:{worldId, revision, seed, layers:[{axis,id,revision}]}, hidden:[axes]}` (LY8, LY5). Every axis may resolve to an empty layer (LY6) |
| SR-B | Validator `validateStart(result)` (SR6, LY9): has location, a first lead (quest or lead text), no layer conflict; if a rolled axis breaks it, reroll that axis inside the seed, not the whole start |
| SR-C | `src/data/start_layers_frontier.js`: world `base.frontier` with axes `entry`, `background`, `possessions`. `vanilla` layers reproduce today's new game exactly: 102 coins, Cheap leather pants q40, Stale bread x5, Village, quest "Lost memory", entry text of the amnesia wake-up (WL7). At least 3 background layers (e.g. farmhand, runaway, scholar's child; CR10) and 2 possession layers, each a small patch plus one text fragment (LY7); at least one `excludes` pair |
| SR-D | Unit tests `tests/start_records.test.js`: determinism; lock respected; unknown axis resolved but listed hidden; excludes never co-occur over 200 seeds; vanilla parity equals the values in SR-C; validator reroll; provenance complete |
| SR-E | Dev probe UI: only when `location.hostname` is localhost/127.0.0.1 and `?start_probe=1`. Inside `#hero_creation_panel`: `[data-start-roll]` section with one row `[data-start-axis="<axis>"]` per axis holding a `select[data-start-mode]` (lock/roll/unknown) and a `select[data-start-layer]`; `input[data-start-seed]`; `button[data-start-roll-button]`; result card `[data-start-card]` with the composed text, seed, and hidden axes shown as "not yet known" (UI4, UI10); attribute `data-start-resolved` holding JSON `{money, items, location, quest, provenance}`; `input[type=checkbox][data-start-use]` "Begin with this start" (default unchecked). Laid out wide (not collapsed) at 1366x768 per the standing UI priority |
| SR-F | Begin: when `[data-start-use]` is checked at Confirm, the new game uses the resolved snapshot through existing fields only (inventory, money, location, quest) instead of the vanilla block in `src/main.js` (~8122-8143), and appends one life-record milestone (existing `appendLifeMilestone`) whose text includes the start's layer ids and seed. Unchecked or no probe: vanilla path untouched |
| SR-G | Save, reload and export/import keep the composed money, items and milestone; no new save field, no migration |

## Done check

`check.sh` exits 0: gate integrity, build, `npm test` with zero failures
(baseline 621 pass / 0 fail), and `checks/gate.cjs` G1-G7 against the
worktree served on port 18341.

## Constraints

- Edit only inside the worktree. May create `src/start_records.js`,
  `src/start_probe_ui.js`, `src/data/start_layers_frontier.js`,
  `tests/start_records.test.js`, a stylesheet under `styles/`; may edit
  `index.html` (stylesheet link only) and `src/main.js` (probe wiring and the
  SR-F branch only, minimal lines); rebuild `dist/`.
- Do not touch `checks/`, `check.sh`, `GATE.sha256` in this folder (read-only).
- No save schema change, no change to the default new-game path, no edits to
  other tests, no commit, push or publish.
- Sealed secrets: none involved; do not import world secret files.
- Match surrounding code style (dense ES modules, no framework).

## Stop and ask

A check that is wrong about the game; any need for a new save field; a new
failure in an untouched test; two rounds without progress.

## Next round

Codex code worker launched 2026-10-13 23:58 (runs/SESSIONS.md).


2026-10-13: STOPPED before implementation under the explicit wrong-check stop rule.
G6 checks `#import_save_input, input[type=file][id*=import]`, but the game's input is `#saved_file_input` (`index.html:703`), wired through `loadProgress` to `load_progress` / `load_from_file`.
Even if the selector matched, G6 only calls export; it never uploads a file, and PASS ignores `importOk` (`checks/gate.cjs:111-118`). It cannot establish SR-G export/import persistence and does not compare composed inventory.
Coordinator must repair and refreeze G6 to export, import through the actual file input on a fresh origin, and compare money, items and the start milestone. Worker must not edit the frozen gate.
No source edits, build, tests or gate runs; progress passes remain empty. Existing `dist/bundle.js.map` modification preserved; no server started.

2026-10-14 worker round 2: SR-A/C/B/D/E/F implemented; native G1/G2/G3/G5/G6/G7 PASS, 628 tests PASS. G4 selector ordering failure repaired; next run verifies G4 then full frozen check. Desktop 1366x768 screenshot reviewed; no mobile scope or save schema changes.

2026-10-14 FINAL worker checkpoint: SR-A, SR-C, SR-B, SR-D, SR-E, SR-F and SR-G PASS. Final frozen `check.sh` exit 0: gate_integrity/build/unit_file PASS, npm_test 628 pass / 0 fail, G1-G7 all PASS.
G6 verifies actual Export and fresh-origin file Import; supplementary G5 save inspection confirms Village, active Lost memory, pants quality 40 x1, bread x5, and exactly one start-layer milestone naming vanilla/farmhand/empty with seed g5a.
1366x768 rebuilt screenshot inspected; all three desktop sizes pass. No remaining implemented-unverified scoped gate; director taste acceptance and coordinator integration remain separate. No commit/push/publication or save schema change.
Original dirty map is preserved at worktree `dist/.start-records-original-bundle.js.map`. All worker servers stopped; final check.sh server exited via its trap. Coordinator can review and integrate this isolated branch separately.

## Dead ends

2026-10-14 coordinator: G6 repaired and refrozen (GATE.sha256 updated). It now
loads the G5 save, checks reload, exports via `#save_to_file_button` download,
imports via `#saved_file_input` on a fresh origin, and compares money, every
expected item count and the seed in the save. Proven on a vanilla fixture
(PASS). Worker resumed.

2026-10-14 worker: disabling the layer selector in roll mode prevented choosing a layer before locking (G4). Keep the choice usable; it is applied only in lock mode.
2026-10-14 coordinator verification: reran `check.sh` independently, exit 0
(G1-G7 PASS, npm 628 pass / 0 fail). Reviewed the main.js diff (import line
296, probe creation 8168, apply branch 8172-8182; quest restart is guarded at
`src/quests.js:105`). Screenshot at 1366x768 shows the roll panel beside the
creation form without scrolling. Open: Weibao's taste review; worktree has a
stray `dist/.start-records-original-bundle.js.map` to drop before any
integration; integration into codex/gameplay-foundations not started.
