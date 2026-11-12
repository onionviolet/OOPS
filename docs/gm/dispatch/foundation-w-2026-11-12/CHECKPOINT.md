# Foundation W checkpoint: world substrate v0

*Chat W of the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md#two-more-chats), 2026-11-12. Branch `claude/fdn-w-substrate-ee40b6`, started from 9bbc51363. Agent-verified, not human-reviewed. Route kind: focused node tests; no player route, since nothing in play calls the substrate yet.*

## Done check

"Two domains exchange a quantity and an effect with no direct import between them, with the same result after one jump, many steps or a reload": **met in the substrate's own suite**.

- Quantity: the brew's steam (`b.brew_steam`, wrapping `craft_process_thermal.js`) raises workshop humidity; the living regulator (`l.shell_regulator`, the `living_regulator.js` law with `SHELL_LAW`) reads it and answers with its inlet (W2).
- Effect: the brew publishes `smoke` when its burner goes out; the shell answers, its pull closes the linked inlet (W2, W5).
- Neither pack imports the other; W2 reads their import lines.
- One jump, minute steps, mixed cuts, near and far detail, and reloads mid-segment and at the publishing minute all give the same world, with smoke published once (W3).
- The regulator pack matches `advanceLivingRegulator` minute by minute in open, closed and linked modes from five starting humidities (W1).

## Owner docs and code

- Contract: [WORLD_SUBSTRATE_CONTRACT.md](../../../WORLD_SUBSTRATE_CONTRACT.md) v0, WSC1-WSC14, with the OS8 save shape.
- Code: `src/world_substrate.js`, `src/world_quantities.js`, `src/world_sky.js`, `src/world_substrate_packs/shell_regulator.js`, `src/world_substrate_packs/brew_steam.js`.
- Tests: `tests/world_substrate.test.js` (W1-W10).
- Area guide: new "World substrate" entry.
- Not touched: `simulation_effects.js`, `active_effects.js`, `living_regulator.js`, `craft_process_thermal.js`, `main.js`.

## PFP2 counts

| Count | Value | Note |
| --- | --- | --- |
| Canon cases running as data | 0 | W carries no canon. CC1 runs ORIGINAL rows (the Village shell law and the thermal fixture) |
| Bespoke scene modules | 0 new, 0 retired | The two reference packs are adapters over existing leaves, handed to L and B at embed |

## Checks (command, result, gaps)

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/world_substrate.test.js` | 10 pass, 0 fail | Substrate only; no live play |
| `node --test tests/meadow_shell_state.test.js tests/craft_process_thermal.test.js` | pass (2 + 8) | Leaves unchanged; run to confirm the adapters' sources still hold |
| `npm run check:arch` | exit 0, no new cycles, main.js not grown | |
| `npm run check:rules` | PASS; 1 TMR1 warning in `src/book_world_hp_exams.js` from the base commit, not this branch | |
| `npm run build`, `npm test`, browser | not run | No module here is imported by the bundle; the integrator runs the full suite at merge (MC7) |

Compatibility line (MC4): game saves unchanged. The substrate has its own versioned shape (`oops.world-substrate` revision 0) and no live slice yet.

## What the rules could not express (backlog)

- **W-B1 · Partitioned detail.** One near place steps the whole world by minutes. Split settlement by places that share no holder once E reports cost (MC16).
- **W-B2 · Diffusion.** No built-in flow between neighbouring places or between a thing and its place by contact. First requested by B when heat moves through batch and room.
- **W-B3 · Sub-minute effects.** All decisions and effects are on whole-minute boundaries.
- **W-B4 · Calendar profiles in the sky.** `world_sky.js` computes its own day and minute of day from root minutes and an epoch. Move to `dayIndex` and the world calendar profile, with seasons (TMR1, TMR2).
- **W-B5 · Unit conversion.** Units are labels that must match.
- **W-B6 · Live wiring and SPR28.** Wire the substrate into `state` as one namespaced slice through the domain registry, give `applySimulationEffects` a substrate op bridge, and register the away-time harness case in `tests/headless/away_bank_equivalence.test.js`.
- **W-B7 · Weaker batch after the keeper leaves.** PFP7's chain ends "the batch finishes weaker". In CC1 the batch's thermal history does not depend on humidity, so the departure changes the room but not the brew. B decides whether humidity or draft reaches the batch's law.

## Next phase

- **E (emergence harness) can start now.** First contact case: **CC1 · Steam and the shell** (contract doc section "The first contact case"), fixtures in `tests/world_substrate.test.js`. The departure variant is W4.
- Domain chats embed on v0 after this branch merges: L takes `shell_regulator.js`, B takes `brew_steam.js`, and the others declare packs against `world_quantities.js`.
- W's own next phase: W-B6 (live wiring), then W-B4 and W-B1 as E's numbers ask.

Rule codes applied: PFP10-PFP15, OS6, OS8, MC4, MC7, TMR1 (gap named), TMR4, TMR7, TMR8, SPR25, SPR28 (gap named), SPR30, CX5, AD56.
