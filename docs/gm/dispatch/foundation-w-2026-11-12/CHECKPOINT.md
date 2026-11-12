# Foundation W checkpoint: world substrate v0

*Chat W of the [procedural foundation plan](../../../PROCEDURAL_FOUNDATION_PLAN.md#two-more-chats), 2026-11-12. Branch `claude/fdn-w-substrate-ee40b6`, started from 9bbc51363. Status: **implemented, below floor** (AD43: no live consumer and no player route yet, so FLR2 and FLR4 are not met); agent-verified, not human-reviewed. Route kind: focused node tests; no player route, since nothing in play calls the substrate yet.*

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
- **W-B8 · Effect kind vocabulary.** Effect kinds are free strings; a misspelling reaches no reactor silently. Add a kind list once two packs share kinds.
- **W-B9 · Contested law fields.** Add and remove only; contests between fields wait for G or S to name a rule.

## Phase 2a: properties, primitives, identity (2026-11-12)

Merged master (ea6a170dd, fast-forward) first. Contract now **v1**, save revision 1 (revision 0 migrates, E7).

- **SB2 quantities and properties.** Vocabulary v1 in `world_quantities.js`: 17 shared quantities (keyed families for energy, stock, want, light, scent and residue) and 10 properties, each with the chats that asked for it. Requests answered: L (vitality, humidity, temperature, light, residue, noise and scent), G (energy by kind and rank as `energy:<kind>` keys, light by kind, noise, cover, concealment), B (temperature, residue, condition, moon phase, day), F (temperature, condition, humidity; provenance stays the ledger plus a lineage key in `refs`), S (energy accounts, light), C (light, noise, cover, energy accounts for stamina, essence and focus), M and A (`stock:<good>`, `want:<good>`, derived `readScarcity`), R (energy, day). Laws read properties (WSC15, E2).
- **SB3 effect primitives.** `world_effects.js`: ten verbs on quantities, properties, positions and law fields, with block, conceal and alter as counterplay and `until` for sustained effects (WSC19, WSC20, E3, E4). The boundary with P is the table in the contract's "Effect primitives and the boundary with P".
- **SC7 identity.** Holders carry `as` and `refs`; `resolveRef` and `substratePort` give K a `ports.read` (WSC18, E5).

Not done in 2a: the live route (phase 2b below).

**PFP2 counts, before and after 2a:** canon cases running as data 0 and 0; bespoke scene modules 0 and 0 (W carries no canon; E8's four canon sentences are illustrative acts, not catalogue rows).

**Checks (2a)**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/world_substrate.test.js tests/world_effects.test.js` | 18 pass, 0 fail (W1-W10, E1-E8) | Substrate only; no live play |
| `npm run check:arch` | exit 0 | |
| `npm run check:rules` | PASS; the one TMR1 warning is `src/book_world_hp_exams.js:14` from master, none in W files | |
| build, full suite, browser | not run | No bundle module imports W yet |

Compatibility line (MC4): game saves unchanged; substrate save revision 0 migrates to 1.

## Requests (phase 2, for the coordinator to relay)

- **K (SC7, SB1):** the plan makes K the owner of identity. W offers its half: holders carry `as` (kinds a binding may name) and `refs` (records other owners keep), `resolveRef(world, {kind, id})` and `substratePort(world)` as a `ports.read` (WSC18). Please confirm or replace the id scheme so there is one identity authority, not two. Answers to K's backlog: **KB5** reservations stay with the custody owners; W only reads. **KB6** rates inside a step: run the step's progress as a closed-form substrate law (`horizon` plus `advance`, WSC4), which settles the same near and far.
- **P (SB3):** the boundary table in the contract ("Effect primitives and the boundary with P") is W's proposal: W runs verb, object and resolved targets at one minute, with `until` for sustained effects and block, conceal and bounds as limits; P owns shape, time, carrier, cost and the other limits. Please agree or amend; E8 lowers four plan sentences to acts as the worked example.
- **L:** (1) may W make the meadow shell chamber's humidity, shell and inlet live on the substrate (your checkpoint: "Move ownership of ambient humidity to W; device keeps its inlet")? That is W's live route for phase 2b and touches `src/meadow_shell_state.js`. If you would rather own the call-site swap, W builds the slice and migration and asks you for the one line. (2) Handover of `src/world_substrate_packs/shell_regulator.js` to L at your embed.
- **B:** handover of `src/world_substrate_packs/brew_steam.js` at your embed; BRQ4 ambient temperature can now be read from the place's `temperature`.
- **E:** CC1 "Steam and the shell" and the W4 departure case are unchanged under revision 1: same names, fixtures (`workshop()` in `tests/world_substrate.test.js`) and assertions.
- **All domain chats:** vocabulary v1 is in `src/world_quantities.js` (17 quantities, 10 properties). A name only your chat uses stays in your pack; one two chats share is a request to W.


## Next phase

**Phase 2b, live route (waiting on the coordinator's answer to the L request above).** If allowed: the meadow shell chamber runs on the substrate (pack `l.shell_regulator`), one namespaced save slice with a migration from the current regulator fields, save, reload and import exercised, and one headless browser check at 1920x1080 with the receipt in this folder. If not: W builds the slice, migration and focused tests and asks L for the call-site line; or rescopes with the reason that no route outside other chats' files holds substrate state the clock cannot rebuild, so W stays "implemented, below floor" until L embeds. Not chosen: wiring rain through the substrate for the drying rack or home building, which would only rename a clock reading (FLR4) and store a derivable value (SPR23).

Earlier next-phase notes (phase 1):


- **E (emergence harness) can start now.** First contact case: **CC1 · Steam and the shell** (contract doc section "The first contact case"), fixtures in `tests/world_substrate.test.js`. The departure variant is W4 (keeper leaves at minute 109 with a correction due at 110; `onLeave` drop by default, finish as the dial).
- Domain chats embed on v0 after this branch merges: L takes `shell_regulator.js`, B takes `brew_steam.js`, and the others declare packs against `world_quantities.js`.
- W's own next phase: W-B6 (live wiring), then W-B4 and W-B1 as E's numbers ask.

Rule codes applied: PFP10-PFP15, OS6, OS8, MC4, MC7, TMR1 (gap named), TMR4, TMR7, TMR8, SPR25, SPR28 (gap named), SPR30, CX5, AD56.

```receipt
build: n/a
route: n/a
state: built
viewport: n/a
persistence: unchanged
tests: focused world substrate contract tests (per chat W)
review: diff-scoped
surface: new leaves world_substrate.js, world_quantities.js, world_sky.js and two substrate packs; not wired into live play
```
