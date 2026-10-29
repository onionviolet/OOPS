# Lane brief: P2, measure the per-minute cost and build the wake queue (CO3, SZ6, LSD138, LSD139, LSD147)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside B1 (B1 owns the LOTM
`src/book_world_lotm_*` files, `src/main.js`, `src/import_probe.js` and `tests/seat_profiles.test.js` this round)
and T1 (scripts only). Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); handoff CO3, SZ6; design
[LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) section 17. Rules: `.claude/rules/runtime-code.md`
(AR1-AR16, AR9 in particular), AD36, AD43, AD45. CLR codes applied: CLR2, CLR3, CLR10, CLR12.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Real time per game minute in a fresh LOTM beside life, natural play (G1 measured about 0.77 s) | ~0.7 s | | yes |
| Real time of a 349-minute "Wait until dawn" (G1 fix measured 13.4 s) | ~13 s | | yes |
| Systems run per `update_timer` minute (list them with their share of the time) | | | no |

## Scope and seam

- **Part A, measure (no behavior change).** Profile one game minute in headless Chrome at 1920×1080 on an isolated
  build (`BUILD_OUT=/tmp/yairpg-p2`, book pack linked). Record where the time goes per system (cast sync, panel
  render, native NPC ticks, save writes, journal, other domains) with `performance.now()` marks or a CPU profile.
  Write the table into the checkpoint. This decides Part B's order.
- **Part B, the wake queue.** New world-neutral module `src/wake_queue.js`: actors register a next-wake time (schedule
  boundary, beat window, need threshold); `nextWake(now)` and `due(now)` drive advancement, so waiting, sleeping and
  natural play jump to the next wake instead of paying per-minute work for idle actors. Keyed by actor id, no world
  names. Pure and deterministic: same registrations, same order of wakes; ties broken by actor id, never insertion
  order (LSD139). A focused `tests/wake_queue.test.js`.
- **Part C, use it where Part A shows the cost.** Wire the largest per-minute costs to skip work between wakes
  (for example: the cast sync recomputes only at a wake; the panel renders only when its view signature changes,
  which also closes CO2). Every change in files B1 owns goes in `cast-lives-lanes/P2_INTEGRATION.patch`; apply it in
  your isolated build to measure, and keep the patch minimal. Changes in files nobody else owns you may edit directly;
  list them.
- **Files owned.** New `src/wake_queue.js`, new `tests/wake_queue.test.js`, checkpoint `cast-lives-lanes/P2_CHECKPOINT.md`,
  `P2_INTEGRATION.patch`, and any non-LOTM, non-`main.js` file Part A identifies (name it before editing).
- **Save.** None: wake times are derived from state on load, never saved (LSD143).
- **Known limits (AD45).** Name what stays per-minute and the refactor expected (for example lifting the LOTM cast
  host onto the queue at the second world, LSD141).

## Work and done check

- **Done when.** Part A table recorded; `node --test tests/wake_queue.test.js` passes; with the integration patch in
  the isolated build, a 349-minute wait runs in under 3 s and natural play keeps its game-time rate, both measured in
  the browser; the existing focused tests for touched systems still pass; `npm run check:arch` shows no growth;
  `node scripts/lane_review.mjs` with grants and paths.
- **Determinism check.** Two identical runs of a synthetic actor set through the queue produce identical wake order
  and identical state.
- **Stop conditions.** The cost sits inside upstream native code that cannot skip work without a behavior change:
  record it with numbers, propose the change, and finish the parts that do not need it.

Do not commit. Keep canon names and source text out of tracked files.
