# L9: harm, backlash, death and restart (design note, proposal, 2026-10-30)

*Proposal for lane L9, not an accepted decision. Palettes, not specs: [death and reset dials](../../../research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md), [LSD33-LSD35, LSD283, LSD299](../protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md), [continuity outcomes](../../CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md#continuity-outcomes-do-not-collapse-them-into-one-death-menu-rule). Gaps: GM32 and GM11 in the [gap map](../../../research/READING_GAP_MAP_2026-10-28.md). Rules applied: AD5, AD38, AD19 (native defeat is not death), AD12 (intentional loops), BHR17, WA48, AR6. Spoilers: mechanisms only; any world revival route is a sealed id.*

## Shape sample (WA48)

Counts and mechanisms only, from the merged whole-book rows (local grep over `extras.jsonl`).

| Finding | Evidence | Design consequence |
| --- | --- | --- |
| Loss of control is a family across all 8 LOTM volumes, with 421 loss-of-control and madness-worded rows, and it appears in the other books too (COR 44 / 7 / 8 / 64 beyond LOTM) | gap map COR row | A world-neutral counter, not a LOTM-only flag |
| It accrues from several kinds of source, not one: using power at higher rank, peeking at what should not be seen (backlash "grows with severity"), a standing curse that ticks on a cycle, accumulated poison from the power source, an external taint | sampled rows | Accrual is an event with a `source` kind and a `weight`, per carrier |
| It is treatable and partial: a carrier can be treated by someone with means, can carry partial madness for long periods, and some lines grow less prone over generations | sampled rows | Recovery is a rate plus a treatment route; stages are adjectives, never "dead at N" |
| It ends two ways: death, or loss of control, which is a state with its own exits (rescue, treatment, being sealed or consumed) | sampled rows | Loss of control is a stage that changes who acts, separate from death |
| Loops (MoL, Perfect Run, COI): the restart resets body, items, date and world; keeps memory, skill and sometimes allies' knowledge; costs differ | GM11 row, six-dial palette | Restart is a dial set over the existing snapshot restore, not a new engine |

## Two seams, in order (P19: do not collapse into one death menu)

1. **The world's outcome** answers "what happens when this life ends or the carrier loses control". It is a per-world row set with default, dial and reason. It runs first.
2. **A restart** is the player's own deliberate connection (the continuation, AD12). It is offered after the world outcome only when a continuation is enrolled, and it is not a LOTM outcome kind. A world with no loop mechanism gives the player a restart through the connection, not through the story.

## Outcome kinds (what each keeps and loses)

| Kind | Meaning | Keeps | Loses | World binding |
| --- | --- | --- | --- | --- |
| `recovered` | Harm resolves without leaving the life (rest, treatment) | everything | time, a recovery period (BHR) | default for rungs below dying |
| `rescued` | Someone with means intervenes before the end | the life, possibly scarred | a debt or a cost the rescuer names; a standing mark | a row names the rescuer fact and cost |
| `lost_control` | The carrier no longer directs the body; the world's own handlers act | the body, the record | agency over the action classes the stage blocks | LOTM-style worlds; exits: treatment, being put down, being sealed |
| `final` | The life ends; no revival | the record, the world's memory, the continuation's retained aptitude | the life | LOTM default for death |
| `revival` | A world mechanism returns a living embodiment | per the mechanism's own row (sealed id) | per the mechanism | rows only where a world has one; never a menu |
| `restart` | The continuation restores an anchor | continuation memory (see keep table), cheats, preferences, retained aptitude, laws, anchored intents | body, items, money, world state and the date | offered by the connection, not by the world |

`resolveDeath` returns the world's default and, separately, lists `alternatives` whose `requires` facts hold (a rescuer present, a held means). The default is a dial per world, with a reason string.

## Backlash counter (GM32)

- **Carrier.** One counter per carrier id (the lead's power source is `power`; a world may add `curse`, `taint`, `poison`). Stored in the native save as a small domain slice `harm`, so a restart rolls it back with the body.
- **Accrual.** `addBacklash(state, rules, carrier, {source, weight})`. Weight scales with the act's tier (dial: rise per rung), never a flat step.
- **Recovery.** `restBacklash(state, rules, carrier, {minutes, treated})`: slow decay with rest, faster with a treatment route, never below a floor the world names (partial madness persists).
- **Stages (adjectives, per world rows):** `steady` → `strained` → `slipping` → `lost`. Each stage lists the action classes it blocks or changes. `actionGate(stage, class)` is the one place that decides, so the consumers call it and never read the number.
- **First-slice defaults for LOTM Tingen [proposed, labelled]:** stages at 3, 6, 9; `strained` adds a warning only; `slipping` blocks `ritual` and `research` classes and refuses acting beyond the current rung; `lost` blocks everything except `rest`, `care` and fleeing, and resolves death when it runs unattended. Reason: the family triples after volume 3, so the thresholds are meant to be retuned per rung.

## Harm ladder adapter (LSD283)

Pure function `harmRung(healthFraction)` mapping to `shaken, bruised, wounded, maimed, dying`, and back to a health value, so idle combat's HP and the rungs never disagree. Not wired to combat in this slice (AD19: native defeat is not death; 0 HP is `unconscious`, never `final`). Death triggers in this slice are backlash `lost` left unattended and an explicit cause.

## Restart binding to the existing seams

- **`continuation_state.js`**, two additive commands. `die:<cause>` records the world's outcome on the active life (`life.ended`, and a `deaths` ledger entry on the continuation: life id, cause, outcome, date). `restart:initial|checkpoint` restores the anchor through the existing `restore`, clears `life.ended`, increments the ledger. Both are travel commands (allowed in `TRAVEL_WORLDS`), because the lead run sits in Tingen.
- **Compatibility decision (AR6).** A whole-snapshot restore rewinds every world held in the save, including the Tingen state and any campaign slice. That is how `initial` and `cycle` already behave in the Frontier; this slice extends it to travel worlds. Old continuation JSON has no `deaths` or `ended` and validates unchanged. No schema bump.
- **Keep table is whatever `restore()` enforces**, asserted row by row in the test: kept: cheats, preferences, `COMPATIBLE_MASTERY` XP, aptitude and law anchors, anchored intents, memories, challenge history, the deaths ledger. Reset: character body, money, items, quests, world state, date, and the harm slice.
- **Reset dials (six-dial palette):** trigger = ended life or lost control; anchor = `initial` or `checkpoint`; carry = the table above; cost = the lost date and state (a world may add a named cost row later); witnesses = none in this slice (who remembers is a later row); exit = the player's choice.

## Where a body part lives (proposal, answers the UI coordinator; USER_VISION "Injuries: overall HP plus part damage where it matters", 2026-10-30)

- HP stays the overall pool; the rung ladder above is the overall harm word. A part is recorded only when some action, check or rule reads it.
- Home: the same `harm` domain slice, as an optional additive map `parts:{<partId>:{rung,cause?}}`, absent when empty (old saves unchanged, no schema bump; `save` still returns undefined for a clean state). A world row lists which `partIds` it tracks and which action classes each part gates (grip and hands gate `craft`, `fight`; voice gates `socialize`, `ritual`; eyes gate `study`, `research`; vital parts feed `resolveDeath`). `actionGate` takes the worst gating part into account, the same way it takes the backlash stage, so consumers still ask one function.
- Consumers: combat reads and writes parts (hit location, per-slot armour, aimed attacks) through `harmView(save).parts`; Body and conditions renders them; recovery follows BHR through `restBacklash`-style `healPart`, added in the slice that first has a combat consumer. A condition's optional `part` field should reference these ids, not a second store.
- **Graded, not gated (Weibao's clarification, same night).** Part damage mostly shifts odds and strength by degree: a hurt hand strikes less accurately and less hard, a hurt leg lowers speed and evasion, a hurt eye lowers precision and perception. Hard gates appear only at the extreme rung where the mechanism truly stops the action. So the planned read is `actionModifiers(save, actionClass)` returning per-axis multipliers or offsets, each with its cause (`[{axis,mult|add,cause}]`), combined per axis across all applying parts and backlash rather than the worst one winning. `actionGate` stays for the hard-stop case (backlash `lost`, an extreme part rung) and sits beside it. Treatment and training (off-hand technique) lower a part's modifier over time through the same recovery function. Row data: per part and rung, the axes it moves and by how much, each a default under a dial with its reason.
- Not in slice 1; slice 1 defines the key and the view shape only (`parts:[]` in `harmView`). Slice 1's backlash stages gate classes outright, as proposed defaults; slice 2 can grade the `strained` and `slipping` stages into modifiers once the part rows exist.

## Read model for the UI sessions (no UI here)

For "Body and conditions" and "Time and chronicle". Both read, never write.

- `harmView(save)` in `src/harm_state.js` returns `{carriers:[{id,label,count,stage,stageLabel,blocked:[actionClass],recovers:{rest,treated}}], rung:null|{id,label}, lastDeath:null|{cause,outcome}}`. Stage labels are words; the number is for tests and "Time and chronicle" tooltips only.
- `continuationView(save)` gains `ended:null|{cause,outcome,at}` and `deaths:[{lifeLabel,cause,outcome,date}]`, newest last. "Time and chronicle" renders the ledger as past lives.
- Gate: UI calls `actionGate(stage, class)` to grey an action and show the stage word as the reason.

## First slice (this lane) and what waits

Implemented: `src/harm_state.js` (domain slice, backlash accrual and recovery, stage gate, world rows, `resolveDeath`, `harmView`); the two continuation commands and ledger; focused test with save, reload and import round trip and each keep-table row asserted against `restore`.

Waits, with the owner: wiring accrual into LOTM casts and rites (`book_world_lotm_*`, `sw-rites`, `sw-adv`, `sw-absorb`: a patch file, `L9_WIRING.patch`); a tick that invokes `resolveDeath` when `lost` runs unattended (host); real revival rows (sealed ids, needs the reading); MoL and Perfect Run reset tables (GM11 text pass, PG4); rescue costs per world; witnesses and who remembers; UI for either seam.

Gap register status after this slice: GM32 partial (counter and gate exist, accrual not wired); GM11 partial (restart and ledger exist, per-world reset table not read).
