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

## Slice 2 (2026-10-30, implemented, below floor)

- **Scoped restart.** `restart:` now calls `scopedRestart` in `src/harm_restart_scope.js`: the dying life's world, seat actor, body, quests and `harm` slice come from the anchor; other worlds, the Village and other owner slices keep their source state. Rows per world with default, dial and reason; Frontier keeps whole-save. The expansion clock and shared simulation ledgers stay at the source's time so retained owners never sit in their own future; seat deadlines shift by the clock delta; a retained active visit refuses the restart. `initial`, `checkpoint` and `cycle` stay whole-save.
- **Parts and graded modifiers.** `harm.parts` (optional, additive), `injurePart`, `healPart` (treatment and training), `actionModifiers(save, actionClass)` => `{allowed, blockedBy:null|{part|carrier,reason}, modifiers:[{axis,mult?,add?,cause}]}` combining all parts and backlash stages per axis; hard block only at a part's extreme rung. `harmView(save).parts` => `[{id,label,rung,rungLabel,modifiers,recovers}]`.
- **Wiring (not applied):** `L9_WIRING_S2.patch` hooks `actionModifiers` into the one existing command-preview check in `src/simulation.js`, exposing `harm.<axis>.mult|add` facts to the existing expression resolver; commands opt in through their own formulas. Handed to `sw-absorb`.

## Volume walk: backlash and loss of control (2026-10-30, shapes and counts only)

Counts are COR-coded rule ids per LOTM volume from the whole-book family pass (`wb-families-lotm`, local): v1 7, v2 6, v3 7, v4 19, v5 19, v6 27, v7 12, v8 6. They match the gap map row and rise through volume 6. Rule kinds are mostly `other`, `law` and `ability`, so backlash is mostly a world law and a side effect of abilities, not its own item type.

| Volume band | New shapes seen (mechanism only) | Consequence for the seam |
| --- | --- | --- |
| v1 (7) | A loss-of-control law at the lead's own rung; residue left by deaths; belief that raises a rate; an institutional rule to stop a member before harm | One carrier, rate dial per belief or place; an institutional restraint row (who stops a carrier, at which stage) |
| v2-v3 (6, 7) | Contamination from a deep dive and from objects; a vehicle or tool going out of control; removing contamination from a material; a mutation from a place | `source` kinds `object` and `place`; cleansing as a craft row that lowers a carrier; objects carry their own counter |
| v4-v5 (19, 19) | Laws that scale with sequence ("higher raises danger"); a parasite or taint that cannot erase it; prophecy backlash that grows with severity; inheritable proneness | `riseScale` per rung; `severity` weight on divination acts; a per-line scale dial |
| v6 (27, peak) | Curses: cyclic (moon), inherited (family), act-triggered (a grave act), stolen or traded (curse theft, relief offered as a trade), a source that propagates, frenzy with a cult restraint | `source` kinds `cycle`, `line`, `act`; a curse is transferable and priceable, so the counter needs `transfer(from,to)` and a trade row; restraint stages |
| v7-v8 (12, 6) | Partial madness that persists at high rank; treatment by a peer; outer-entity reaction to forbidden acts | Floor under `restBacklash` (done); treatment rows with a rescuer fact (done as alternatives); entity reaction belongs to GM33/GM34 |

Next code step (a small Sol slice after the s3 audit): a `sources` registry in world rows (`act`, `cycle`, `line`, `object`, `place`, `residue`) with default weights, a `cycle` tick helper `cycleBacklash(state,rules,carrier,{kind,fromMinute,toMinute})`, and `transferBacklash(from,to,amount)` so curses can be passed or traded. Accrual wiring into LOTM casts stays with `sw-wire`.

## H2 rewind checkpoint: extend the continuation anchors, do not add a second one (proposal, AD32, 2026-11-03)

*Proposal, not an accepted decision. Source rows: [cross-world detail pass](../../../audits/CROSS_WORLD_DETAIL_PASS_2026-11-03.md) H2 and [gap audit](../../../audits/GAP_AUDIT_2026-10-30.md) G15. Defaults carry a dial and a reason (AD5); nothing here is a menu for Weibao.*

### F1. The audit row is stale: the primitive exists

H2 says "no code". Reading `src/` on 2026-11-03 found one, with player state:

- `life.initial` and `life.checkpoint` in `src/continuation_state.js` are `nativeSnapshot(save)` copies of the **whole native save**, so they already hold body, levels, inventory, money, quests and date. This is the player-state capture `anchor_snapshots.js` lacks.
- `set` replaces the single checkpoint; `checkpoint` and `initial` return to one; `loop`, `loop:initial|checkpoint` and `cycle` repeat on a timer (`loop.cycles`); `die:<cause>` and `restart:initial|checkpoint` (slice 1-2, above) restore through `restore()` and `scopedRestart`. The validator already requires `loop.target` to be `initial` or `checkpoint`.
- `anchor_snapshots.js` stays what it is: world facts at a time from an authored event graph. It is not a restore source. Its one honest role here is a later consumer (O2 below).
- What H2 still lacks is therefore narrower than the audit says: (a) **eligibility**: `continuationEligibility` returns the Frontier-only message for `set`, `checkpoint`, `initial`, `loop` and `cycle` in any other world, and the travel set `TRAVEL_WORLDS` holds only `base.frontier` and `book.lotm.tingen`; (b) **callers**: the only trigger is the player's own button (the Investigate-for-10-minutes route), and no world, host or timer can set an anchor; (c) **world binding**: no world says when its anchor is set, what replaces it or what it keeps; (d) **MoL has a table row but no scope row** (`book.mol.cyoria` falls to `RESTART_SCOPES.default`).
- Verification state: read, not run. I did not run the continuation tests.

### D1. One slice shape, three loop kinds by who owns the anchor (proposal)

Default: **one anchor pair per life** (`initial` + one replaceable `checkpoint`), exactly as built. A world's loop-table row adds a `loopKind` and an `anchorBy` field; the restore path is unchanged.

| loopKind | Who sets the checkpoint | Who triggers the rewind | Replaceable? | Worlds (proposal, unread rows flagged) |
| --- | --- | --- | --- | --- |
| `chosen` | The player, through a means the world gives (a connection, a save-point item, a power) | The player (`checkpoint`, `cycle`) or death | Yes, one at a time; replacing is the cost of the old one | Speedrunning the Multiverse and Regressor's Tale-style deliberate regression (rows unread: PG4/whole-book pass owed) |
| `entrapment` | The world, at a fixed moment (loop start, `initial` only; no `checkpoint`) | The world's clock or death, not the player | No: `set` is refused (`anchorBy: 'world'`) | Mother of Learning: the canonical loop is a fixed-length trap whose start and end the world owns; exact trigger and length are PG4-owed, so dial `lengthDays` is unknown, not zero |
| `duplicate` | Neither: the world makes a body or processing copy and keeps the origin running | The world's process | Not applicable: `branch:` (a paused parent plus a tethered life) already exists | You Have Died Again (row unread; its death-and-return may be `final` plus `revival`, then not this seam at all) |

Reason: the audit's hard feature is "who may move the pointer", not "what is saved". Default is safe because the three kinds share `restore()`. Dial: a world may use `chosen` with a cost row (time, a resource, a witness) or `entrapment` with a visible, advancing deadline. Exception with a reason: a world whose rewind is not a snapshot at all (a memory-only regression where the body keeps its state) does not use this seam; it uses `carries` in `loop_table.js` with an empty `resets`, which `defineLoopTable` currently refuses, so that row owes a one-line relaxation when such a world arrives.

### D2. Reachable callers (found in `src/`) and the ones to add

Found: (1) `src/continuation_ui.js` buttons for `study`, `set`, `checkpoint`, `initial`, `loop*`, `cycle`; (2) `src/continuation_host.js` calls `planContinuation` for every command; (3) the harm path (`harm_engine.js` gives `die:'loss_of_control'`, `harm_host_die` routes it to `die:` then `restart:`); (4) `loop.nextAt` is the five-minute repeat timer. Nothing in `book_world_*` calls an anchor.

Proposed new callers, each a command string through the same `planContinuation`, not a parallel function: (a) `anchor:<id>` from a world host at a world-owned moment (loop start, a save-point item use, a regression event); (b) `expire` from a world clock when an `entrapment` deadline passes, resolving to `restart:initial`; (c) the existing death route unchanged. Every caller carries a `token` (existing idempotence check) so a retried tick cannot restart twice.

### D3. Save slice and compatibility decision (AR6, VG3)

- **No schema bump.** `continuation` stays schema 1. New fields are optional and additive: `life.anchorLog` (last 8 entries: `{id, kind:'world'|'player', at, token}`), `loop.kind`, `loop.deadlineAt` (only in `entrapment`). Old saves have none and validate unchanged; a validator row accepts absence.
- **Snapshots stay whole-save**, so their size is unchanged. Default: the world's `scopedRestart` row decides what comes back from the snapshot, as in slice 2; **dial:** keep one checkpoint per life (storage cost is two whole saves per life; `anchorLog` stores no snapshots).
- **Explicit compatibility decision:** a save made before this slice that sits in a newly eligible world has `life.initial` only if a connection was begun there; one without a continuation is not migrated, because an initial taken now would be a future the lead did not live. Such a save simply shows the existing "needs its own temporal means" message until a world anchor is set forward from now. Reason: no fabricated past (AD38).
- Persistence check owed at the slice: save, reload, import, then restart, and assert the anchor pair and `anchorLog` survive (AGENTS.md persistence rule).

### D4. First implementation slice (one, proposal): Mother of Learning as an `entrapment` world

Scope: register `book.mol.cyoria` as an `entrapment` loop, with a world-called initial anchor and an `expire` restart. Not Regressor's Tale, not Speedrunning, not You Have Died Again (their rows are unread; the slice names them as consumers it does not build).

1. `src/continuation_state.js`: add the Cyoria world id to the travel set, add `anchor:<id>` (world caller; sets `life.initial` only when absent or `anchorBy:'world'`, refuses `set` when the loop row says `anchorBy:'world'`) and `expire`. Additive; old commands untouched.
2. `src/harm_restart_scope.js`: add a `book.mol.cyoria` row using the existing `motherOfLearning` owner (scoped default, with a reason string). Dial: what the lead keeps comes from the loop table's `carries` (aptitude, memories), still marked pending the PG4 text read.
3. `src/loop_table.js` and `src/book_world_mol_access.js`: extend the MoL row with `loopKind:'entrapment'`, `anchorBy:'world'`, `lengthDays:null` (flagged unknown). The readout shows the kind and "the world sets and ends this loop".
4. Design only until a Weibao yes on implementation: the slice touches `src/` (this task did not).

**AD43 floor (six lines, proposed per check):**

| Floor line | Check |
| --- | --- |
| Focused test | Extend `tests/continuation_state.test.js` and `tests/harm_restart_scope.test.js`: world anchor sets `initial`, `set` is refused, `expire` restores through `scopedRestart` with the other worlds retained, token replay is rejected |
| Failure scenario | A tick fires twice, or the lead is mid-visit in another owner when the loop expires: second call refused, active-visit restart refused with both inputs untouched (existing `scopedRestart` refusal) |
| Persistence | Save, reload and import with an anchor and `anchorLog` present; old continuation JSON validates unchanged |
| Browser proof | Rebuilt bundle, fresh origin, Cyoria at a desktop 1920x1080 and 1536x864 viewport: the readout shows "loop: world-owned", `Return to initial` works, `Replace checkpoint` is hidden. Mobile is deferred (standing UI priority) |
| Gates | `npm run build`, `npm test`, `npm run check:arch`, `npm run check:rules` at the committer stage (AD36) |
| Reachability | Checked from a real caller: the readout is read from the Cyoria panel and the restart through the continuation panel, not by a unit call alone |

### O1-O3. Later work (proposals, with level and done check)

- **O1 (L2, medium):** Regressor's Tale and Speedrunning the Multiverse as `chosen` rows once their readers confirm the trigger and the carries; done when each has a row with source locators and the same restart test.
- **O2 (L3, small):** use `anchor_snapshots.js` to author the world-fact side of a canon `initial` (what Cyoria's facts say on loop day one), so the world's anchor is calibrated to its source (AD49) instead of whatever the save held; done when a test checks the authored facts against the snapshot at the anchor time. It stays a consumer; it never restores player state.
- **O3 (L3, small):** a witness row (who remembers a rewind) per world; none in this slice, as slice 1 already said.
- **G15 note:** `anchor_snapshots.js` is still unimported by `src/`; wiring it is O2's job and stays a separate row.

### Sweep result

Swept the new section for never, always and only. The remaining hits are conditions ("only when", "only if"), the module description that `anchor_snapshots.js` does not restore player state, and a cited audit phrase. Each design line has a default, a dial and a reason; a world whose rewind is not a snapshot is named as an exception.
