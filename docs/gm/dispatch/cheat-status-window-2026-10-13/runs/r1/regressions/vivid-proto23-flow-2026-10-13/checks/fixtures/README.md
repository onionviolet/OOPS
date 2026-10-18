# Save fixtures (vivid-proto23 gate)

- Build: `dist/bundle.js` sha256 `2025657de8b67c59` (first 16 hex), working tree of 2026-10-13, branch `codex/gameplay-foundations`. Regenerate if the bundle changes.
- Route (`../routes.cjs`): `startFresh` (PLAY, confirm default hero) -> `unlockCombatRoute` (Talk to village elder: textlines `hello`, `what happened`, `ask to leave 1`, `need to`; the last unlocks Infested field travel; go back) -> `enterCombat` -> `leaveCombat`.
- `precombat.save.txt` (53,886 bytes): Village, Infested field travel unlocked, no combat ever entered (`last_combat_location` null, `total_hits_done` 0).
- `fought.save.txt` (53,933 bytes): same hero after about 6 s in Infested field (hits landed, Combat/Evasion/Pest killer XP), then travelled back to Village.
- Load: open `URL+'style.css'`, set localStorage `save data` to the file text, open `URL`, press PLAY (`startFresh` handles both fresh and loaded saves). Both load to the Village with no page errors.
