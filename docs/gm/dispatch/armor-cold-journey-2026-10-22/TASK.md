# Armor cold-need journey (S2), 2026-10-22

Status: implemented; native gates and a 1920x1080 headless journey pass. Human acceptance open.
Rules: AR1 (main.js untouched), AR3/AR12 (armor logic stays in the gear workshop domain, not the herbal law),
AR6 (no new save slice; consequence is the existing `equipment_durability` condition), MR (mechanism, default/dial/reason),
AD38, UR (desktop first). Not touched: `story_requests.js`, `REQUEST_CONTRACT`, `craft_content_frontier.js`, `crafting_frontier_runtime.js`.

## The authored need
Cold-brittle metal armor. Default: metal worn against the body conducts cold, so in air at or below 8 degrees
unlined metal armor wears 2x faster per landed hit. Dial: `GEAR_WORK_LAWS['base.frontier'].coldSoak`
(`below`, `extraWear`, `insulationPerWarmth`), a base-world proposal. Reason and cost: a lining of warm material
(Wool shirt, warmth 140) insulates by grade x warmth x 0.7, capped at full; it adds the existing lining mass cost.

## Loop
need (workshop row shows "Cold need ...") -> work (existing `attach` lining process, same quote/execute/rollback)
-> wear (equip) -> combat (`landedHit` wear reads the hazard) -> lasting saved consequence (condition, uses, history).

## Changes
- `src/gear_work.js`: `coldSoak` law dial, pure `coldSoakNeed`.
- `src/absorb_e2/durability.js`: optional `setWearHazard(read)` multiplier inside `wearItem`; no new state.
- `src/gear_workshop_domain.js`: registers the hazard reader, adds `need` to the projection.
- `src/gear_workshop_panel.js`: one need line on the inspected item.
- `src/native_tool_domains.js`: passes `get_current_temperature_smoothed` (no main.js edit).
- `tests/gear_workshop.test.js`: cold-need regression (2x unlined, lining resolves, warm air none, condition round trip).
- `scripts/armor_cold_browser.cjs`: journey script.

## Verification (AD36)
- `npm run build && npm test`: 2517/2517. `npm run check:arch`, `check:rules`, `check:rule-behavior` pass.
- Browser: 1920x1080, fresh `http://127.0.0.1:18731/?test_hooks=1`, headless, generated save only
  ([receipt](receipt.json), screenshots here). Need line, attach lining through the panel, equip, hits in Infested field,
  per-hit wear ~0.080 unlined vs ~0.041 lined, reload, `save_to_file` Export, literal Import via `#saved_file_input`.
- 404s in the receipt are the absent private fonts/pack manifest in this worktree.

## Implemented-unverified / gaps
- 1366 width not exercised; mobile deferred.
- Hazard uses the weather module's smoothed temperature; the displayed value also adds the pacing offset, so they can differ slightly.
- Fixture seeded winter time and stock; natural pacing, discovery of the need and balance are unaccepted proposals.
- Export used `window.save_to_file`, not the Export button click.
- Chosen hits are randomized; the script loops fights until 3+ hits.
