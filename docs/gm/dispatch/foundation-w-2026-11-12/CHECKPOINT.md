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

## Phase 2b: live route, the Village shell chamber (2026-11-12)

The coordinator allowed W to edit `src/meadow_shell_state.js` for this route (L leaves it alone until this merges). Scope kept to the chamber's humidity, shell and inlet and their readers; the terrapin lifecycle reads are unchanged.

- **What moved.** The animal's `regulator`, `shell` and `mode` fields are gone. In their place `chamber` holds a substrate world (save shape `oops.world-substrate` revision 1): the place `village.shell_chamber` carrying `humidity`, the terrapin body and the inlet thing running pack `l.shell_regulator`. The chamber is a near place: it settles minute by minute inside the old 64-minute window, and care and work answer the air of each minute exactly as before. `meadowChamber(state)` is the one reading; the habitat panel and the projection read it. Player hands on the inlet are substrate ops with a cause.
- **Migration (MC4): migrated.** `upgradeMeadowShell` turns a pre-substrate animal into the chamber world at its regulator clock (humidity, shell, mode, inlet position and pending correction kept). It runs on every read, so an old save works at once and the next shell action stores the new shape. Tested: old and migrated saves project identically and the due correction lands.
- **Slice size.** Chamber dials `chainCap` 16 and `ledgerCap` 8 keep the slice under 4 KB (tested).

**Floor (AD43), for this route**

| Line | State |
| --- | --- |
| FLR1 Build | Bundle sha256 `10cbbe5002bc7c3b` (built from this branch's source; dist not committed) |
| FLR2 Route | Village meadow pen, from a fresh origin, with the named fixture of the existing `PROOF_SHELL` route (one Wool cloth, enrolled simulation); played by clicks: build, rescue, buy hay, feed, fit inlet, close inlet, link inlet |
| FLR3 Shown | The panel's terrapin line shows humidity, inlet and a correction due from the substrate, with the existing cannot-run messages |
| FLR4 Used | Existing consumers read it: care and healing gate on humidity, driftwood work on the shell, the sparring guard on the shell (6 closed, 1 open) |
| FLR5 Kept | Save, reload, Export and Import each restore the identical chamber, and time and inlet actions continue on the imported save |
| FLR6 Labelled | Agent-verified, not human-reviewed; route kind: headless browser with a named fixture |

Receipt: [proof/receipt.json](proof/receipt.json) (8 of 8 lines PASS), screenshots `proof/01-chamber-linked.png`, `02-reloaded.png`, `03-imported-continued.png`. Script: `scripts/world_substrate_shell_browser.cjs` (needs `npm run build` and a static server on `PROOF_URL`). Three 404s are ignored by name: private fonts that are gitignored and absent from worktrees.

**Status:** the W substrate reaches the floor on this route. The substrate as a whole stays partly below floor: the effect primitives, sky and properties have no live consumer yet.

**PFP2 counts, before and after 2b:** canon cases as data 0 and 0; bespoke scene modules 0 and 0. The chamber's private regulator loop moved onto the shared pack; `living_regulator.js` now has no runtime caller.

**Checks (2b)**

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/meadow_shell_state.test.js tests/world_substrate.test.js tests/world_effects.test.js` | 23 pass (meadow 5, including 2 new: migration and ledger) | |
| `node --test tests/authority.test.js tests/habitat_care.test.js tests/livelihoods.test.js tests/needs.test.js` | 31 pass | Neighbours that read the habitat |
| `npm run build` | exit 0 | |
| `node scripts/world_substrate_shell_browser.cjs` | 8 of 8 PASS at 1920x1080, headless | Fixture-seeded start (FLR2 allows a named fixture) |
| `npm run check:arch` | exit 0 | |
| `npm run check:rules` | PASS; the only new warning is the TMR1 line in `book_world_hp_exams.js` from master | |
| full `npm test` | not run | The integrator's, at merge (MC7) |

## Phase 2c: one verb list with P for MS2 (2026-11-12)

Merged master (2fff2285e, milestones MS1-MS7). P's effect grammar (`src/effect_grammar.js`) had twelve verbs; W had ten. W added `release` (undo `bind` or `conceal`) and `end` (stop a sustained effect early; a running working is K's), so both chats run one list of twelve (E9 checks the lists match). `W_OBJECT_OF` maps each of P's 18 objects to a W object or names the owner that answers it.

**Known break for the integrator:** `tests/effect_grammar.test.js` line 23 (P's file) expects `light` to be missing from W and lowered as a published effect. Vocabulary v1 declares `light` as a keyed family (asked by L, G, C and S), so that one assertion fails on this branch; P's other tests pass. Fix is P's (request below). W did not edit P's file.

| Command | Result |
| --- | --- |
| `node --test tests/world_effects.test.js tests/world_substrate.test.js tests/meadow_shell_state.test.js` | 24 pass (E1-E9, W1-W10, meadow 5) |
| `node --test tests/effect_grammar.test.js` | 1 fail (line 23, above), rest pass |

## Phase 3: calendar sky and effect kinds (2026-11-12)

Backlog rows W-B4 and W-B8, in W's own files.

- **W-B4 done.** `world_sky.js` reads day, minute of day and season from the world calendar profile through `projectCalendar` (the reader `dayIndex` uses), defaulting to the home frontier calendar with its anchor at root minute 0. Rain follows the native rain calendar on the native weather minute, so the sky agrees with the existing weather. New shared quantity `season` (0 spring to 3 winter) where the calendar has seasons; Cyoria's calendar has none, so its sky carries none. W8 checks `day` against `dayIndex`, rain against `isRainingAtMinute(weatherClockMinute(view))`, daylight, moon and season.
- **W-B8 done.** Effect kinds are vocabulary (WSC21): `WORLD_EFFECT_KINDS` lists ten shared kinds with the chats that asked, packs declare `publishes` and `hears`, a reactor on an unknown kind is refused at composition and an undeclared publish fails. The check found one real gap at once: the shell answers `smoke`, which only the brew publishes, so the live chamber (shell pack alone) now declares it hears smoke from the shared list.

**PFP2 counts, before and after:** 0 and 0.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/world_substrate.test.js tests/world_effects.test.js tests/meadow_shell_state.test.js` | 25 pass (W1-W11, E1-E9, meadow 5) | |
| `node --test tests/effect_grammar.test.js` | 5 pass, 1 fail (the known line-23 assertion awaiting P) | |
| `npm run check:arch` | exit 0 | |
| `npm run check:rules` | PASS; only the TMR1 line in `book_world_hp_exams.js` from master | |

Compatibility (MC4): unchanged. The live chamber save shape is the same; the sky is not in any save.

## Requests (phase 2, for the coordinator to relay)

- **K (SC7, SB1):** the plan makes K the owner of identity. W offers its half: holders carry `as` (kinds a binding may name) and `refs` (records other owners keep), `resolveRef(world, {kind, id})` and `substratePort(world)` as a `ports.read` (WSC18). Please confirm or replace the id scheme so there is one identity authority, not two. Answers to K's backlog: **KB5** reservations stay with the custody owners; W only reads. **KB6** rates inside a step: run the step's progress as a closed-form substrate law (`horizon` plus `advance`, WSC4), which settles the same near and far.
- **P (SB3, MS2), urgent for the merge:** (a) update `tests/effect_grammar.test.js` line 23: `light` is now W vocabulary, a keyed family, so it is no longer a need; (b) in `lowerEffect`, map objects through `W_OBJECT_OF` from `src/world_effects.js` (heat to temperature, sound to noise, essence to energy) and add the world's key for keyed families (`light:moon`, `energy:primeval.rank1`); a bare family name is refused by W; (c) better still, lower to W acts and let `applyEffect` run them, so the verbs have one executor. The verb lists already match (E9).
- **P (SB3):** the boundary table in the contract ("Effect primitives and the boundary with P") is W's proposal: W runs verb, object and resolved targets at one minute, with `until` for sustained effects and block, conceal and bounds as limits; P owns shape, time, carrier, cost and the other limits. Please agree or amend; E8 lowers four plan sentences to acts as the worked example.
- **L:** (0) `src/meadow_shell_state.js` is handed back after this commit merges; the chamber now lives on the substrate and `src/living_regulator.js` has no runtime caller (L decides whether to retire it or keep it as the parity reference W1 uses). (1) Answered by the coordinator: may W make the meadow shell chamber's humidity, shell and inlet live on the substrate (your checkpoint: "Move ownership of ambient humidity to W; device keeps its inlet")? That is W's live route for phase 2b and touches `src/meadow_shell_state.js`. If you would rather own the call-site swap, W builds the slice and migration and asks you for the one line. (2) Handover of `src/world_substrate_packs/shell_regulator.js` to L at your embed.
- **B:** handover of `src/world_substrate_packs/brew_steam.js` at your embed; BRQ4 ambient temperature can now be read from the place's `temperature`.
- **E:** CC1 "Steam and the shell" and the W4 departure case are unchanged under revision 1: same names, fixtures (`workshop()` in `tests/world_substrate.test.js`) and assertions.
- **All domain chats:** vocabulary v1 is in `src/world_quantities.js` (17 quantities, 10 properties). A name only your chat uses stays in your pack; one two chats share is a request to W.


## Next phase

**Next for W:** W-B1 partitioned detail and W-B2 diffusion when E's cost numbers or a domain's embed asks for them; K's identity answer and P's boundary answer as they arrive. W's plan done check is met; further rows are backlog, not this goal (PFP6).

**Phase 2b is done (above).** The earlier plan for it, kept for the record: If allowed: the meadow shell chamber runs on the substrate (pack `l.shell_regulator`), one namespaced save slice with a migration from the current regulator fields, save, reload and import exercised, and one headless browser check at 1920x1080 with the receipt in this folder. If not: W builds the slice, migration and focused tests and asks L for the call-site line; or rescopes with the reason that no route outside other chats' files holds substrate state the clock cannot rebuild, so W stays "implemented, below floor" until L embeds. Not chosen: wiring rain through the substrate for the drying rack or home building, which would only rename a clock reading (FLR4) and store a derivable value (SPR23).

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
