# Lane brief: P4, lift the clock out of `main.js` and advance idle spans in batches (RF3, MD2, LSD138, CO3)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside D1 (D1 owns the LOTM
`src/book_world_lotm_*` files and its new constraint modules). **AR15 writer reservation:** this lane owns
`src/main.js` until it reports; record the reservation in the checkpoint. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md);
evidence [P2](P2_CHECKPOINT.md) and [P3](P3_CHECKPOINT.md) checkpoints. Rules: `.claude/rules/runtime-code.md`
(AR1, AR3, AR9, AR15), AD36, AD43, AD45 (modular; past code earns no weight). CLR codes: CLR2, CLR10, CLR12.

## Why

After P2 and P3 (commits `edb88a929`, `457e4c98d`, `f9d05d38e`), the coordinator's browser floor on bundle `db9c7609`
measures 1,157 ms per game minute and a 349-minute wait in 34.8 s (target under 3 s). `update_timer` (in `main.js`)
still runs the full per-minute native work for every game minute of a wait or idle span: native contexts, facts
for each command preview, publications, persistence. P3 stopped at the clock owner: "introduce explicit dependency
versions at the actual native publication/clock owner".

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Per-minute systems inside `update_timer` (list each, whether it must run every minute or only at a boundary) | | | yes |
| Systems whose outcome over an idle span equals running them once at the span end (pure accumulators: needs, regeneration, timers) | | | yes |
| Callers of `update_timer` (natural tick, wait, sleep, reading, others) | | | yes |

## Scope and seam

- **Part A, extraction (AR9: no behavior change).** Move the clock advancement out of `main.js` into a module (for
  example `src/clock_owner.js`) built from grouped ports (MD2: clock, save, body, UI, world), with one registration
  line in `main.js`. Prove the same journey before and after: `scripts/floor/run_floor.cjs` receipt state, save bytes
  and the full suite. `main.js` drops by the moved lines.
- **Part B, batched spans.** For a span with no due wake (P2's `wake_queue`, the cast's next beat, an active job's
  completion, a native event, an interruption check), advance accumulators once over the span and run per-minute-only
  systems only where a boundary needs them; publication and persistence happen once at the span end. Every system
  must declare boundary or accumulator; undeclared systems keep per-minute stepping (safe default).
- **Side by side (MD6).** A test-only dial runs stepped and batched advancement; an equivalence test advances fixture
  lives (fresh life, LOTM beside with the pack, a crafting or reading job running) by 349 minutes both ways and compares
  state and `create_save()` bytes. Differences are listed per system; a system whose batched result differs stays stepped.
- **Files owned.** `src/main.js` (reserved), new `src/clock_owner.js` (or similar), new focused tests, checkpoint
  `cast-lives-lanes/P4_CHECKPOINT.md`. D1's files: `P4_INTEGRATION.patch` only. Name any other file before editing.
- **Known limits (AD45).** List systems left stepped and why.

## Work and done check

- Equivalence test passes for the three fixtures; focused tests of touched files pass; `npm run check:arch` shows
  `main.js` below its current 10,090 lines; `node scripts/lane_review.mjs` with grants and paths.
- Chrome cannot start in the Codex sandbox: report and stop; the coordinator runs the floor (`run_floor.cjs`) for the
  real timing. Target: 349-minute wait under 3 s with unchanged state.
- **Stop conditions.** A system cannot be classified without upstream behavior change: leave it stepped and record it.

Do not commit. Keep canon names out of tracked files.
