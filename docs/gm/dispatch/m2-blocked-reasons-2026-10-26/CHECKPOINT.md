# M2 slice 1: blocked reasons say where, 2026-10-26

Label: agent-verified, not human-reviewed (AD42). Step M2 of docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md. Rules applied: GTR10/GTR2, UR (player-ui), AR (runtime-code), AD3/ABR19 (reasons use only what the character can know).

## Causes
- Mistglass "Choose Follow local people and work first" was a hardcoded string in `src/main.js` (actMistglass and the Enter action) with no location.
- Tingen begin buttons: `startable()` in `src/book_world_lotm_host.js` requires `startEnabled`, which is true only on localhost with `?lotm_probe=1` (`src/book_world_lotm_domain.js`). "Nothing else under way" was never the failing condition. The check is intended (dev probe), so the reason was fixed, not the check.

## Change
Seam: reason-builder helpers in `src/progression_gates.js` (`stepFirstReason`, `followLocalPeopleFirst`, `TINGEN_START_CLOSED`). Consumers: `main.js` (2 Mistglass strings), `skill_expansion_host.js` and `gear_workshop_domain.js` (same missing step, now with place), `book_world_lotm_ui.js` (reason chosen by `view.startEnabled`). New text: `Choose "Follow local people and work" in the Craftsman & workshop panel first.` The place matches the Notebook > People > Craftsman & workshop path already used in `village_ui.js`. No other text reworded.

## Checks (one line each)
- `node --test tests/progression_gates.test.js`: 6 pass (new reason-builder regression).
- `npm run build`: ok. `npm test`: 3215 pass, 0 fail. `npm run check:arch`: ok. `npm run check:rules`: PASS, 0 warnings.
- Browser (rebuilt bundle, fresh origin 127.0.0.1:18477, no probe): Enter Mistglass button title shows the new reason; Tingen workroom 4 begin buttons disabled with the disposable-test text. With `?lotm_probe=1` the Nighthawk button is enabled, confirming the cause. Viewport not set to 1920x1080 or 1536x864; reasons are tooltip (title) text, so layout is unverified.
- No state or persistence change, so no Save/reload/Import run.

## Recorded, not fixed
- Tingen is reachable only through All panels and is titled "A disposable test start". Per code it is a dev entry (probe-gated, disposable test save), not intended player-facing. The in-world entrance is M2 candidate 2.
- Reasons live in `title` tooltips; a player may not see them without hovering. Candidate for a visible-reason pass.
