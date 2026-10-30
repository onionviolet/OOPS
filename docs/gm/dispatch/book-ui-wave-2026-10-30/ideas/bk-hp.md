# bk-hp lane notes (2026-10-30, proposals per AD32)

## Slice
HP school life charms status (GM20/GM21 day-one life): `src/read_models/hp_charm_bridge.js` replaces the "N practice steps · N executions" row in the
"Your beginning" status with one row per charm: where it came from (taught by Mara, lesson window), practice against what the cast needs (0 of 1 drills),
next step with its cost, cast costs and result, and the fizzle dial. Test: `tests/hp_charm_bridge.test.js`. Browser: `scripts/hp_charm_browser.cjs`.

## Floor status (AD43)
- Learn, practise, cast, cost, result consumed by `retrieve_feather` and the assessment: already in the native school life (host-registered).
- **Failure/fizzle: implemented, below floor.** The GM40 seam draw (`settleSpellCast`) needs a command-level seeded chance, which `src/simulation.js`
  does not have (only world events carry `chance`). Patch proposal for `sw-wire`: add optional `failure:{chance,perMastery,needed}` to a simulation command;
  at completion draw `spellRoll(simulation.seed, commandId, executions)`, on a miss refund nothing, skip `effects`, write a knowledge note "it fizzled".
  Changing `book_hp_life_data.js` re-hashes the school pack and orphans `book_hp_school_extension.js` base hash and saved records, so the failure
  data should arrive as a new pack revision with a renewal decision, not a silent edit. The view already says "does not fizzle yet" so nothing is claimed.
- Seam registration of the other GM40 parts (prepare, origin gates) is not needed by this slice.

## Ideas (palette, not spec)
- Mara's corrections as a visible hint after a drill ("your wrist was late"), once failure exists.
- Text origin: a library primer as a second teacher kind, same bridge row ("Learned from a book").
- A fizzle would use the same row: "Last cast: fizzled (about 4 in 10 at your practice)".
