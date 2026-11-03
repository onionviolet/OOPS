# KJ3P implementation receipt: the Seer drink (kjw6) is built and blocked by B10

2026-11-03. Window kjw6 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43). Not playable: the native run was refused at pack load, so nothing from this window is in the repo pack.** Content-only: no `src/`, `dist/` or test edits. Proof target was the B9 bundle `private/proof-bundles/b9-bundle-2f659cc7/` (bundle.js sha256 `2f659cc73c6c19b592cf6e5571a7e6f70f35d3dcbf3c9f760b9867165f2e1431`, built from `3447f0a31`, includes B1 and B9; scratch copy with its own `lotm-cast/cast.json`). Private files: `docs/research/novels/lord-of-mysteries/private/kj3p-ch32-2026-11-03/` (`build-episode.py`, `b1-effects.json`, `reviewed-episode.json`, `play-episode.mjs`, `run1.log`, `browser-result-run1-refused.json`). Predecessor: [KJ3O receipt](KJ3O_IMPLEMENTATION_RECEIPT.md).

## Result

B1's first native proof **failed before any act ran**. The page throws at boot with `Error: Unknown authored energy.` (`src/simulation_contracts.js:210`), the workspace never renders, and the runner timed out after 300 s waiting for `#workspace_navigation select`. The console also shows `Unsupported persistent person.`, a consequence of the failed boot. Per the brief, the lane stopped here: no workaround, no runtime code.

Cause, by reading source: `installCast` (`src/book_world_lotm_cast_host.js:221`) validates the cast commands (place acts included) in an isolated `createSimulationRegistry({people, commands, situations})`. That registry has no `energies`, so any place-act effect `{type:'energy', energyId:'book.lotm.be_spirituality', ...}` fails the check at `simulation_contracts.js:210`. The real registry does hold the energy (`lotmEnergies` includes `BE_SEER_ENERGY`; the bundle carries it). Recorded as backlog row **B10** in [MECHANISM_BACKLOG](MECHANISM_BACKLOG.md) with the proposed fix (feed the lotm energies, and containers, sites, events and pursuits, into that registry, or validate after the merge) and a test to add. Containers, sites, events and pursuits share the same line-210 pattern, so they are likely blocked the same way (not tested).

Not tested because the run never started: the `source` grant alone (it has no such check in that path, but a source without the pool would fail `beSeerAssertions`), the state-validator checks at `src/book_world_lotm_state.js` lines 68/91, export/import and reload of the B1 state, and `beSeerCogitateEffects` / `beSeerUse`. The pre-drink and post-drink B1 assertions are written into the runner and wait for B10.

## What was built (kept, not installed)

English v1 ch32 P001 - ch33 P050. Seventeen acts in three scenes (`drink`, `lesson`, `home`), prefix `book.lotm.kj3p.`: `prep`, `drink`, `saturation`, `steady`, `plate`, `cogitation`, `dim`, `lecture`, `eyes`, `chest`, `figure`, `switch`, `exhaust`, `climb`, `warn`, `reception`, `sleep`. Next boundary: ch33 P051. Revision on the built pack `cast-reviewed-kj3p-6972903dbafc6d8e`. **The repo pack was restored to the KJ3O revision (`cast-reviewed-kj3o-324ba6e710d5bcbd`, sha256 `3a38e155…`)** because the kj3p rows break the page load for everyone using the private pack. To resume: `python3 .../kj3p-ch32-2026-11-03/build-episode.py` after B10 merges, then the existing `play-episode.mjs` (re-run `gen-runner.mjs` only if the acts change).

| Beat | Act | Fixed by | Fact keys (`book.lotm.kj3p.`) |
| --- | --- | --- | --- |
| Ask about preparation | `prep` | ch32 P001-P009 | `prep.asked` |
| Drink (B1 `source`, `energy learn`, `energy recover`, ingestion fact) | `drink` | ch32 P010-P011 | `potion.drunk` + B1 `book.lotm.be.seer.ingested` |
| Saturation, murmurs | `saturation` | ch32 P012-P022 | `vision.first`, `murmurs.heard` |
| Steady on the hat (B1 stabilize) | `steady` | ch32 P023-P034 | `hat.focus` + B1 `book.lotm.be.seer.stabilized` |
| Mercury plate, dark eyes | `plate` | ch32 P035-P042 | `eyes.dark` |
| First Cogitation | `cogitation` | ch32 P043-P054 | `cogitation.first` |
| Dim room, first aura | `dim` | ch32 P055-P064 | `aura.first` |
| Layers and colours | `lecture` | ch32 P065-P082 | `lecture.layers`, `lecture.colors` |
| Neil's aura, the eyes behind him | `eyes` | ch32 P083-P092 | `neil.aura.seen`, `watcher.eyes.seen` |
| Silver chest, remnants | `chest` | ch33 P001-P017 | `remnant.spirituality` |
| Figure at the door, side effects | `figure` | ch33 P018-P027 | `figure.door.seen`, `sideeffects.told` |
| Set the switch | `switch` | ch33 P028-P036 | `switch.set` |
| Exhaustion, Neil's orders | `exhaust` | ch33 P037-P039 | `exhausted.first`, `neil.orders.afternoon` |
| Stairs, Dunn's warning | `climb`, `warn` | ch33 P040-P045 | `dunn.warned.curiosity` |
| Rozanne, the ride, home | `reception` | ch33 P046-P048 | `commute.home` |
| Sleep | `sleep` | ch33 P048-P050 | `home.asleep` |

kjw7 requires `home.asleep`, `switch.set`, `neil.orders.afternoon`, `cogitation.first`, `eyes.dark` (kept exact).

## GATED beats (fallbacks, to be replaced when the mechanism lands)

| Gate | Beat | Fallback built | Replace with |
| --- | --- | --- | --- |
| B2 | Darkened eyes seen by cast observers (ch32 P041) | `plate`: Neil comments, fact `eyes.dark`, no observer; Q4 (eyes return) left unstated, no eyes-normal fact | an observer-visible eye state |
| B3 | Spirit Vision switch and exhaustion (ch33 P034, P037) | `dim`, `switch`, `exhaust`: fixed outcomes, no switch state, exhaustion a fact; `switch` carries the B1 `energy use` effect | switch on/off and exhaustion condition |

## Money

No price, fee or coin is stated in the window. Native money 802 (a ceiling, from KJ3O) is unchanged at every act (asserted in the runner; not reached).

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Ask, drink, hold the hat, learn Cogitation, set the switch | the lead as player | place-act effects `beSeerDrinkEffects` / `beSeerSteadyEffects` / `beSeerCogitateEffects` / `beSeerUse` (`src/book_world_lotm_be_seer.js`); no BE Seer commands |
| Teach, show the plate, lecture, explain side effects, order rest | Old Neil on screen, moved by arrival acts, then back to the armory | authored acts and notes; Neil keys checked against private text |
| Warn about curiosity | Dunn on screen | authored act |
| Greet | Rozanne | authored act |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `prep`, `cogitation` | The urge to draw the gun and the missile from television (Earth) | none |
| `steady` | The urge to smash things (Neil is told only sight and hearing) | none |
| `eyes` | none: Klein blurts out the eyes | Neil dismisses it with a forced smile (ch32 P092) |
| `figure` | The door figure (Neil is told only the spasm) | later chapters |
| `climb` to `sleep` | Eyes, figure and missile from Dunn and Rozanne; all of it from Benson and Melissa (never placed; no new keys) | none in window |

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Text-length pre-scan (`prescan.mjs`) on the `.py` | 25 offenders over 200 listed at once, trimmed in one pass; final clean | |
| Pre-scan on the built `reviewed-episode.json` and on `cast.json` | clean on both | |
| Presence preflight, prefix `kj3p.` | 0 blockers after adding a Rozanne visit (arrival `warn`, departure `reception`); first run had Rozanne `AMBIGUOUS` at `reception` | static check only |
| Native route, headless Chrome, B9 bundle (T4 runner) | **FAILED at boot**: `Unknown authored energy.` (`simulation_contracts.js:210`), 300 s timeout in `route.load`; 0 acts ran | B10 |
| Diagnostic page load (same pack, 20 s) | same pageerror, plus `Unsupported persistent person.` | |
| Pack restore | `private_packs/lotm-cast/cast.json` back to sha256 `3a38e155…` (KJ3O) | |
| B1 assertions, export/import, reload, leak asserts | written into `play-episode.mjs`, not run | B10 |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## Timing and corrections

- Source and brief read (estimates): about 25 minutes. Authoring: about 30 minutes (17 acts; one trim pass for 25 offenders). Proof: one failed boot (about 5 minutes of timeout) and one 20 s diagnostic.
- Late corrections (2): (1) the 25 over-length strings; (2) the missing Rozanne visit caught by the preflight. No native rerun was possible.
- Process note: the first run waited the full 300 s `opTimeout` on a boot that had already failed. A future runner could read `session.errors` before the first panel call; not changed.

## Next

A mechanism session takes B10 (small: one registry call in `installCast`, plus the test). Then re-run `build-episode.py` and `play-episode.mjs` on a fresh bundle that includes the fix; the B1 assertions in the runner are the first native proof. kjw7 (ch33 P051 on) waits on kjw6.

## Addendum: B10 fixed, native proof passed (2026-11-03)

`installCast` now passes `energies:[LOTM_ENERGY,BE_SEER_ENERGY]` into the isolated registry (`src/book_world_lotm_cast_host.js`). Bundle `private/proof-bundles/b10-bundle-45c086a7` (bundle sha256 `45c086a7…`, built from the shared dirty tree plus this fix). Pack `cast-reviewed-kj3p-6972903dbafc6d8e` (sha256 `f4beb179…`) is now installed in `private_packs/lotm-cast/`.

| Check | Result | Gap |
| --- | --- | --- |
| Focused tests (`book_world_lotm_cast`, `lotm_cast_tier`, `lotm_seer_slice`, `cast_whole_book_scale`) | 19 pass | no dedicated regression for an energy place-act row |
| Native route, headless Chrome, B10 bundle, `play-episode.mjs` | 17 acts, 0 page errors, 268 s; ingestion fact, `be_seer` source and spirituality pool asserted after `drink`, not stabilized before `steady`, stabilized after; export/import preserves position, money 802 and facts; Rozanne and siblings hold no Seer text | no 14/21 px captures; full `npm test` and `build` of the repo not run |

B1's first native proof passes. kjw7 starts at ch33 P051 from `completed-checkpoint.json` here. B2 and B3 fallbacks remain in `plate`, `dim`, `switch`, `exhaust`.
