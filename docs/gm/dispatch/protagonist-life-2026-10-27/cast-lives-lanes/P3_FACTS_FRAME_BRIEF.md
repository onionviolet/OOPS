# Lane brief: P3, compute facts and contexts once per unchanged input (CO3, LSD138, LSD147, MD3, MD6)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside B1 round 4 (B1 owns
`src/main.js`, the LOTM `src/book_world_lotm_*` files, `src/import_probe.js`, `src/fresh_life_start.js`). Card:
[CAST_LIVES_CARD](../CAST_LIVES_CARD.md); evidence [P2_CHECKPOINT](P2_CHECKPOINT.md) Part A. Rules:
`.claude/rules/runtime-code.md` (AR1-AR16; AR3, AR9, AR15), AD36, AD43, AD45 (modular, past code earns no weight).
CLR codes applied: CLR2, CLR10, CLR12.

## Why

P2 measured one game minute at about 1.8-2.2 s in the Node DOM harness. 46% is `simulationFacts`
(`src/simulation_effects.js:127`, 673 calls per minute), 37% is `simulationNativeContexts` (`src/main.js:1655`,
16-18 calls), 9% is `lotmFacts` (521-996 calls). The same inputs are recomputed hundreds of times inside one
synchronous minute. Cast schedules are not the cost.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| `simulationFacts` calls per diagnostic minute (P2 harness) | ~673 | | yes |
| Callers of `simulationFacts` and `simulationNativeContexts` (list each with what input it passes) | | | yes |
| Inputs that can change inside one synchronous minute between two calls (state writes, inventory, location, effects) | | | yes |

## Scope and seam

- **Outcome.** A per-call planning frame: within one synchronous step, a fact or context computed for the same input
  identity is reused; any write to an input invalidates exactly what depends on it. Results equal the old ones
  (same facts, same contexts, same save bytes); only the repeat work goes away.
- **Seam.** A new world-neutral module (for example `src/facts_frame.js`) that owns the frame lifetime and
  invalidation, used by `simulation_effects.js` and the context builder. Prefer explicit input versions (a counter
  bumped by the writers that already exist) over deep comparison. No cache survives the synchronous step; nothing is
  saved (LSD143).
- **Side by side (MD6).** A dial (`facts frame on/off`, test hook only) runs both paths; an equivalence test runs a
  fixture minute both ways and compares facts, contexts and `create_save()` output byte for byte.
- **Files owned.** New `src/facts_frame.js`, new `tests/facts_frame.test.js`, `src/simulation_effects.js`, checkpoint
  `cast-lives-lanes/P3_CHECKPOINT.md`. `src/main.js` and LOTM files: hunks in `cast-lives-lanes/P3_INTEGRATION.patch`
  only (B1 owns them now), kept minimal: a registration line and passing the frame. Name any other file before
  editing it.
- **Known limits (AD45).** Record what still recomputes and the next refactor (for example the clock extraction RF3,
  grouped ports MD2).

## Work and done check

- **Measure** with P2's Node DOM harness method (scripts in `/tmp/p2-*` if still present; otherwise rebuild them,
  diagnostic only). Report before and after per mark. Chrome cannot start in the Codex sandbox; the coordinator runs
  the browser floor (`scripts/floor/run_floor.cjs`) after you report.
- **Done when.** Equivalence test passes (frame on and off give byte-identical facts, contexts and save) over at least
  three fixture states (fresh life, mid-wait, LOTM beside life with the pack); `simulationFacts` calls per minute drop
  by at least half in the harness; `node --test tests/facts_frame.test.js` and the existing focused tests of every
  file you touch pass; `npm run check:arch` no growth; `node scripts/lane_review.mjs` with grants and paths.
- **Stop conditions.** An input changes through a path with no writer you can version: record it with the caller,
  leave that fact uncached, continue.

Do not commit. Keep canon names out of tracked files.
