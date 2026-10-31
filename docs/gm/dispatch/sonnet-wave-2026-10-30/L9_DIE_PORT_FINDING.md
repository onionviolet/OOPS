# L9: why a 351-minute wait at power strain 9 never ended the life (agent-verified, not human-reviewed)

**Finding.** The tick path works. `tests/harm_host_die.test.js` builds the real LOTM host over fake ports, seeds `harm.backlash.power`, calls `host.tick(351)`: at 8 it requests nothing, at 9 it calls `ports.die('loss_of_control')` once. So the wait path reaches the host tick and `lostControlOutcome` fires. (Candidate 2 and 3 are ruled out: `update_timer` calls `domainRegistry.tick(consumed)`; peeks stopping at 6 only means a player cannot reach 9 by divination alone, a seeded 9 is still valid.)

**Cause (candidate 1).** The `die` port in `src/main.js` (configureLotm call, line ~1131) is
`die: cause => { const c = continuationState; if (!c || c.lives[c.active]?.ended) return Promise.resolve(); ... }`.
A life with no continuation returns silently: no death, no panel, no message. A seeded or `be`-route life has none, because `cross()` only enrolls through `ports.branch` for the returnable profiles; the restart panel and `die:` both need a continuation.

**Proposed fix (floor-wire owns main.js and the host).**
1. Do not return silently. If `!c`, enroll first, then die: `if(!continuationState)await commandContinuation('enroll');`, as the `branch` port already does, so a death always has a panel.
2. Enrol earlier so the anchor is the start, not the dying moment: call `commandContinuation('enroll')` when a Tingen life begins on every route (`startBe` and the seeded-save route too), not only in `cross()` for returnable starts. Otherwise `restart:initial` from an enrol-at-death returns to the strained state and the life ends again on the next tick.
3. Guard against the loop: after a restart the next `tick` sees strain from the anchor; if the anchor itself is at `lost`, the restart panel should still show first (the host only calls `die` when `lives[active].ended` is unset, which a fresh restart satisfies, so it dies again on the next tick). The seed in the floor test is therefore the only case; real play anchors before strain.

Nothing in `src/book_world_lotm_*` or `main.js` was edited by L9.
