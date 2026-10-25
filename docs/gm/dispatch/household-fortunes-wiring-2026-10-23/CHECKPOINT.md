# Household fortunes and obligations wiring (2026-10-23)

Codes: AR1-AR3, AR6, AR8, AR10 (seam: domain registry + the root time-staging boundary `stageResidenceClock`), AD16, AD19, AD33, AD38, UR (desktop 1536/1920; mobile deferred). Targets: IM9, IM10, OG16, IM32.

## Wiring
- `src/household_fortunes_domain.js` (new): domain `household_fortunes` (deps `homes`), slice `household_fortunes@1` with migrate/validate/load, projection, `setRoutinePaused` command, panel mount.
- `src/household_fortunes_panel.js` (new): "Household" desktop records panel (watch list, parts by parts with dial reasons, household record, routines with Stop/Resume, obligations).
- `src/home_domain.js`: import, `configureFortunes({root})`, one staging call after the pantry office. `src/main.js`: `villageCareer` added to the existing ui-ports object (no new line).
- One authority: life = `simulation.people[id].life` (death is a `life` effect); completions = `actors[id].completed['home.staff.*']`; obligations ledger derived at read time (household + village career), no stored copy; hidden talent derived from a hash, never saved or projected.

## Checks (one line each)
- `node --test tests/household_fortunes_domain.test.js`: 4 pass (rolls staged via plan only, neglect death + old age, routine gates incl. stop, slice validate/migrate).
- Neighbours `household_fortunes`, `obligations_ledger`, `home_domain`, `home_household`: 26 pass with the above.
- `npm run build`: ok. `check:arch`: main/display/save_files growth 0; new cycle edges listed belong to `lives_carry_domain`/`ui_extras` (other lanes). `check:rules`: pass.
- Browser (headless, fresh origin 127.0.0.1:8391, `browser.cjs`, evidence in `fortunes-80qa8t/`): PASS A-H: join manor, 2 played days stage the slice; panel at 1920 and 1536 (screenshots), no talent/chance text; save, reload, Export, literal Import keep the slice; save without the slice loads and starts observing; cook routine at 5 completions ordered a cook job unasked (cook completed 6); Stop routine writes the stop; primed neglect (lack 39, empty purse and larder) killed all four staff in 2 days, standing -8, resentment 12, grievance row shown in Obligations; post-death save/reload/Export/Import.

## Gaps (implemented-unverified or not done)
- Crafting has no live debt state (gear workshop fee is paid at once); no crafting writer invented. Lead agreed.
- Old-age death and awakening-over-weeks are unit-tested only; the browser neglect case used a fixture primed to 39 lack days (a 54-day starvation takes about 35 real minutes at 27 ms/tick).
- Routine "choice pending" = the player has their own running job; no other choice signal exists. Routines run only while the player is at the manor (reuses `planHomeStaff` eligibility).
- Completion counts live in the simulation per life; they do not carry across lives yet.
- Standing/resentment are recorded and shown, and resentment is in the ledger, but no staff behaviour reads them yet.
- Heir obligations are not in the live ledger (they exist only after death). Mobile layout not checked (deferred).

## Trust tiers, gift gating and peer ranking (G52/G53, 2026-10-23)
- `src/peer_standing_domain.js` + `src/peer_standing_panel.js` (new): domain `social_trust` (slice `social.trust@1`, migrate/validate, omitted when empty), gift quote/execute, "Regard" panel. `src/home_staff.js`: new `gift_staff` request (coins from your purse to a staff member's own purse, one transaction path). `src/layout_spec.js`: `social-trust` surface entry (and `household-fortunes`).
- Gifts above the tier ceiling are accepted and cost trust with the in-world reason; ranking is rankPeers over purses at the manor, observable only.
- Check: `node --test tests/peer_standing_domain.test.js tests/progression_pledges.test.js` + home tests: 23 pass.
- Check: `tests/ui_contract.test.js` surface test no longer names household-fortunes or social-trust; it still fails on `styles/material_icons.css` token drift (other lane).
- Check: headless browser `trust-browser.cjs` (evidence `trust-MhCtMC/`), PASS: 10-coin gift +1 trust and 10 coins in Iven's purse; 30-coin gift accepted, trust back to 0, reason shown; panel at 1920 and 1536; save, reload, Export, literal Import keep the slice; a save without the slice loads.
- Gaps: only four manor staff (AD33); ranking is by coins held (a proxy; no other peer score exists); trust affects nothing else yet; tier-up behaviour (reaching 3+ trust) is covered by the pure tests, not the browser; trust is saved at the next save, not inside the gift's own commit.
