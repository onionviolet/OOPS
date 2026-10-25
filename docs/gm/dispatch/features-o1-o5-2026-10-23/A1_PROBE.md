# A1 gap probe: four contrasting abilities through the ability descriptor

2026-10-23. Read-only probe for queue row A1 ([QUEUE](QUEUE.md) Round 2; the queue file lives in the primary checkout). Status: findings, not accepted decisions. Rules: AD5, AD38, AR1-AR16, W15 S1-S12.

Placement note: this file sits in the worktree `ability-engine-4c5ccb`; the QUEUE file it cites lives only in the primary checkout, so the link may not resolve until the lane merges.

Method: each ability was written as a `compileStructuredAbilities` descriptor plus a native command/power/energy, compiled, registered and previewed or run through `previewSimulationCommand` / `commitSimulationCommand` with a scratch script (not committed; abilities are original, on the shared engine, so no canon claim). Everything below marked **ran** was executed; **read** came from source only.

## The four abilities

| # | Ability (original) | Style | Descriptor (`structured_ability_runtime.js`) | W15 fields | Result |
|---|---|---|---|---|---|
| 1 | Hearth palms: warms a cold body or stone | body-faculty gift, innate | `acquisition:'innate'`, `executionKind:'body-faculty'`, `function:'support'`, `sourceId` kind `trait`, no `powerId`, `control:` calm | S2 access (trait source), S5 expression (condition apply), S3 `none`, S12 none | **ran**: eligible, no power record needed |
| 2 | Lantern-eyes: a fae loan of night sight | borrowed / contract | `acquisition:'borrowed'`, `executionKind:'temporary-construct'`, `function:'perception'`, `conditions:[charges 3 + recharge when empty, lifespan price, agent enforcer, ends on true name, breach consequence]`, `subject:'author'` | S2 contract access, S6 bargain limit, S11 shortcut | **ran**: compiles to use + `.enforce` + `.recharge` commands; condition record kept |
| 3 | Cinder spark: a spent-focus technique | resource-metered | `acquisition:'learned'`, `executionKind:'ordinary-technique'`, `powerId` (practice model, `capacityPerMastery`), native cost `{type:'energy', operation:'use', output, control}` | S3 energy, S4 growth (mastery), S6 limit (reserve, strain) | **ran**: refuses at 0 reserve, works after recover, reserve 6 to 2 and strain 2 after two uses, then refuses again at the strain limit |
| 4 | Own form: a power whose function set the holder designs | personal-form | `acquisition:'innate'`, `executionKind:'permanent-imprint'`, `function:'craft'`, `powerId` with `model:'design'`, `slots`, `functions:{id:{capacity}}` | S10 personalForm, S14 | **ran, gap**: compiles and previews eligible, but the chosen functions live in the authored command (`parameters.functions`) and the owned power stores no design (see G1) |

Also **ran**: mastery growth works (`power` effect `refine` amount 1 moved mastery 0 to 1, and the practice model feeds it into capacity). Cooldown already exists as `cooldown` on the power definition (`readyAt`, **read** `simulation.js:226`).

## What the descriptor cannot say, ranked

| Code | Missing | Evidence | Existing owner that could carry it | Closes |
|---|---|---|---|---|
| G1 | **A holder's own designed form.** The design model validates `command.parameters.functions` that the author wrote on the command. Effects are the command's fixed list. The owned power record (`owned, mastery, fragments, executions, cause, lineage`) stores no chosen design, so two holders cannot differ and a reload cannot reproduce a choice (W15.S10, M4). | ability 4, ran; `power_models.js` design branch, `simulation_effects.js` power learn branch | `power_models.js` (design) plus the owned-power record in `simulation_effects.js` and its state validator in `simulation_contracts.js`. Not the descriptor itself. | A2 |
| G2 | **Who can see it.** No field says self-known, witnessable or sealed. `character_bio.js` lists any awakened `trait`/`bloodline`/`knowledge` source regardless, so a hidden gift would show. | read: `character_bio.js` source filter; descriptor `fields` set | Source record (`bioDetail`-style) or a descriptor `visibility` field read by the bio. Bio file is read-only for this lane. | A4 |
| G3 | **Energy growth.** `energy learn` refuses a second learn ("already learned") and policy is frozen. Capacity, output and control cannot rise with mastery; only the power's own capacity does. | read: `energy_resources.js applyEnergyEffect`; W15.M5 names the missing upgrade | `energy_resources.js` (a bounded `upgrade` operation that preserves reserve and strain) | later |
| G4 | **Growth and away-time as one statement.** Growth route (command with `refine`) and away rule (a repeating program or job) both work as separate data, but nothing ties them to the ability, so an ability can ship without either (W15.S4/S12). | ran for growth; read `simulation.js` programs (closed-browser time does not advance, by current owners) | Ordinary commands, advancements and `programs`; a start profile (A3) names them | A3 as data |
| G5 | **Enemy holders.** Commands refuse another actor ("belongs to another actor"). The descriptor itself is not holder-specific, and `actorDefinitionId` role-binds a command (read: `simulation.js:112`, test `structured_pack_runtime`). | ran (refusal), read (role route) | `actorDefinitionId` on the command plus a person definition holding the same source | verify in A5 |
| G6 | **Public text separate from sealed truth.** One `label` per source and ability. | read | source `bioDetail` vs sealed knowledge records | with A4 |

Not gaps (already covered, do not rebuild): typed charges with recharge, drawback or bargain as a first-class limit, author-bound loophole, vow/breach/enforcer, strengthen-by-restriction (all `conditions`, tested in `tests/ability_conditions.test.js`); cooldown (`power.cooldown`); fuel, output, control and strain (`energy_resources.js`).

## Decision for A2

Close **G1** first: it is the only one of the four abilities that failed to hold its own meaning. Smallest change: the design model reads the holder's chosen functions from a saved design on the owned power (set once by a `power` effect at acquisition, validated against the definition's slots and capacity), falls back to `command.parameters` so every existing design-model consumer is unchanged, and the command resolves its effects from the chosen functions. G2 is A4's request; G3 and G5 are noted for A5.

## Outcomes (same day)

| Row | Result |
|---|---|
| A2 (G1) | Closed. A `power` `learn` effect may carry `functions`; it freezes `design.functions` on the owned power after checking the definition's functions, `slots` and `capacity` (a bad design refuses and leaves no half-owned power). The design model refuses a command function outside the holder's design and falls back to `command.parameters` when no design is saved. Files: `simulation_contracts.js`, `simulation_effects.js`, `power_models.js`. Compatibility decision: additive optional field on the power record, absent on every existing save, so no migration (old-save compatibility is deferred 2026-10-17). Test: `tests/structured_ability_runtime.test.js` (player and NPC holder, different designs, reload). The test also showed G5 resolved: a command with no `actorId` serves any holder, so an enemy holds the same ability record. |
| A3 | `src/warm_hand_start_content.js`: innate body-faculty gift (origin `inherited`), small (warm a loaf), limited (own stamina, 20-minute power cooldown), growth through a queueable practice command (mastery 2 unlocks a three-loaf batch, 3 halves the stamina price). Away-time rule: practice is an ordinary timed command, so the existing "Repeat 3 times" routine runs it on played time; closed-browser time stays paused by current owners. |
| A4 | Not built; requests for `character_bio.js` below. |
| A5 | `src/lantern_loan_start_content.js`: borrowed acquisition, two-measure charges, lasting oil price, refit only while oil is held. Only data rows on the existing descriptor; no core file touched. |

### A4 request for `character_bio.js` (not edited by this lane)

1. Filter sources by who could see them. Today `character_bio.js` lists every awakened `trait`/`bloodline`/`knowledge` source with no visibility test, so a hidden gift would show in the self-description. Needs a source or ability field such as `visibility: 'self' | 'witnessable' | 'sealed'`, read here. Default `witnessable` for a body-faculty gift that has a visible expression, `self` for a borrowed or hidden one.
2. `technique`- and `condition`-kind sources never appear in the bio at all, so abilities 2 and 3 of this probe (borrowed loan, learned technique) would stay invisible even when witnessable. Decide whether the filter widens to those kinds.
3. Keep public text (`bioDetail`) separate from sealed truth (G6); the descriptor adds no sealed text.
4. The Warm hands and Lantern loan sources carry `bioDetail` already, so the bio line appears the moment the filter allows it.

## O1 chain (same day): reagent, reaction, energy, effect

`src/slake_bench_start_content.js` (opt-in start `slakebench`, no gift). Quicklime plus clean water react under a mass-conserving `craft_resolver` law (`defineCraftLaw`/`resolveBatch`, the gear-depth chemistry owner); the law's heat output (2 units for one measure each, read at definition time so the pack stays data) is banked through an `energy` `recover` effect into the `slakebench.heat` policy (`energy_resources.js`); the learned `hot_press` power (`power_models.js` practice model, A2's ability descriptor, `device-construct`) spends that reserve to bake dough into flatbread. Limits are dials with an in-world reason: reserve capacity 6 (the pit holds little), strain limit 2 (the plate), a rest command clears strain, reagent stock is finite (three lumps). Not covered: reactors with exposure or conduction, lazy corrosion, converters (GX8 later rows); the resolver's richer ops and stations are unused here.
