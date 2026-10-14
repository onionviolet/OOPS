# Save fixtures (crafting-screen gate)

- Build: `dist/bundle.js` sha256 prefix `0219035cdbca2bee`, working tree of 2026-10-13, branch `codex/gameplay-foundations`. Rebuild fixtures with `../build_fixtures.cjs` if the bundle changes.
- Serve the repo root on `127.0.0.1:18291` (`python3 -m http.server 18291 --bind 127.0.0.1`); `../routes.cjs` defaults to that URL.
- Load: `R.loadSave(p, R.readFixture('craft_ready.save.txt'))` (seeds localStorage `save data`, opens the game, presses PLAY).
- Check: `node ../verify_fixtures.cjs` loads both fixtures in fresh contexts twice; all four runs passed with 0 page errors.

## Route (`../build_fixtures.cjs`)

1. Fresh game: `startFresh`, `unlockCombatRoute` (elder opening; no combat). Save.
2. **One save edit**, stand-in for clearing Infested field: `availabilities.textline["villageElder:cleared field"] = 1` (unlocked). Clearing the field's `repeatable_reward` unlocks exactly that line (`src/data/locations.js:482-487`). A fresh hero dies in about 30 s with 0 kills, so a live clear is not a practical fixture route. Everything after this edit is played through the UI.
3. `learnCrafting`: elder `cleared field` (unlocks the old craftsman), craftsman `hello`, `learn`. The `learn` reward sets `is_crafting_unlocked` and `is_gathering_unlocked` and gives Old pickaxe, axe, sickle and shovel (`src/data/dialogues.js:461-470`). Save as `craft_none`.
4. Equip Old axe, Gather resources > "Gather wood on the outskirts" until 2 Rough wood logs (61 s real time in the build run), Stop. Save as `craft_ready`.

## Contents

| File | Bytes | Place | Inventory | Crafting state |
|---|---|---|---|---|
| `craft_none.save.txt` | 65,282 | Village | Cheap leather pants, Stale bread x5, Old pickaxe/axe/sickle/shovel | Crafting known, all 7 stations visible, no recipe makeable (Makeable now shows the empty message) |
| `craft_ready.save.txt` | 65,928 | Village | same, Old axe equipped, Rough wood log x2 | Woodworking > Items: **Processed rough wood** makeable (needs 1 log, success 30%); **Processed wood** not makeable (needs "Unknown raw wood" x0/1, the Wood log is not yet known) and every other visible row unavailable |

Both: 0 kills, 0 deaths, Lv 0 hero named "Hero", Vivid scheme and Workspace layout by default.
