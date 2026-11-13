# Law by observation: browser evidence (FRC45; STN18, STN19, KNW5, KNW6, KNW11)

Run: `node scripts/law_by_observation_browser.mjs <pre-fight-save.txt> docs/gm/dispatch/law_by_observation_2026-11-10`
(headless Chromium, 1920x1080, fresh origin per step, bundle built from this checkout, hash in `journey.json`).
Pre-fight save: scenario `lotm-klein-wanted`, seed 7, exported before the fight. `run.log` and `journey.json` hold each step's watch block and the saved `lotm_law` slice.

| Step | Result |
| --- | --- |
| A fight | Constables at the door, yield until the fight ends; the watch block opens with Talk / Pay / Show papers / Walk away (`01_case_open`) |
| B changed outfit | DEV SEEDED: the constables' remembered look in the save is swapped (the Klein life has nothing wearable). No watch block (`02_changed_outfit_unproven`) |
| C talk | Case survives import; Talk closes it; slice `closed:[talked]`; same after save + reload and after export + fresh-origin import (`03_after_talk`) |
| D walk away | Same case from the import; Walk away closes it (`fled`); same after save + reload (`04_after_walk_away`) |

Not played here: Pay (the Klein life holds 1 penny, so the button is correctly blocked) and Show papers (no held post). Both are covered by `tests/lotm_law_host.test.js`.
