# Potion pathways, higher Sequences: implementation design (lane L3)

**Status: proposal, design only.** Every shape, name, number and slice below is an agent proposal, not an accepted
decision. Nothing here edits `src/`, tests or other docs. Rules applied: WA1, AR1-AR16 (esp. AR3, AR6, AR11, AR12),
MR1, MR5, MR29, MR30, MR33, PZ1-PZ12, LC6, sealed secrets (no MYSTERIES file opened; no secret truth appears).
Canon facts are not asserted here: pathway names, formulas and swap tables come from lane L1's table and lane L2's
notes. Where this file names a pathway or a rung it is a placeholder for a row L1 owns.

Code cites are to master `8ac514f01` plus the dirty tree read on 2026-10-24. The LMC row line numbers in
`LORD_OF_THE_MYSTERIES.md` section 2 are stale (they cite an older `pathways.js`/`actions.js`/`path.js` layout); the cites
below replace them.

## 0. What the code does today (SHOWN)

| Code | Fact | Cite |
|---|---|---|
| F1 | Seer is hand-authored; every other pathway is a row run through one factory | `book_world_lotm_pathways.js:1-4`; `rows.js:9` (`seerRow`), `:11` (`ccRow`), `:36` (`savantRow`), `:61` (`sailorRow`), `:82-83` |
| F2 | A row holds exactly two rungs (`base`, `nextSource`) and two dose keys (`holds.base`, `holds.next`); Sequence 7 is a hardcoded stage with `fact:'never'` | `pathways.js:68-80` (`:79`) |
| F3 | A non-Seer dose is **minted by an effect** (`item('player',K[h.base],1)`), with no debit from a stock. Only the Seer moves a dose with `transfer(I.supervisor,'player',K.dose)` | `pathways.js:22`, `:29`, `:33` vs `actions.js:36` |
| F4 | So the envelope's "held exactly once" check is a custody check, not a conservation check | `envelope.js:24-29`, `pathways.js:62-67` |
| F5 | Frog, hairs and ink are only bought, bartered, held and shown. Facts read their counts; nothing consumes them | `broker.js:19-22`, `actions.js:133`, `envelope.js:34`, `ui.js:37` |
| F6 | Digestion is one counter resource per pathway; acts add 1; assessment and exam are flags; a post-exam wait is read from the `.at` of a knowledge note | `pathways.js:18`, `:27`, `:28-34`, `:44-46` |
| F7 | Stated causes of loss of control are a table with a pressure resource; 6 pressure is terminal and ends the branch | `causes.js:10-16`, `:48`; `host.js:59` |
| F8 | `state.lotm` is validated for exactly six fields, so a new field needs a version bump and migration | `state.js:16`, `:28` |
| F9 | A saved job must equal its current command definition (costs, effects, revision); changing a shipped command body breaks a save that holds that job | `state.js:35-38` |
| F10 | The player body must be `form:'human'` and `alive()` also requires human, two hands, mobile | `state.js:31`, `actions.js:93` |
| F11 | The branch is opt-in: `?lotm_probe=1` on localhost/127.0.0.1, enrollment only from Village on a disposable save | `domain.js:10`, `host.js:40` |
| F12 | LOTM is not a world pack. `BUNDLED_WORLD_PACKS` is `[molPack, hpPack]`; a pack's `native` block is a schema-2 structured blob keyed by pack id | `world_pack_registry.js:10`, `world_pack_manifest.js:196`, `hp_brewing_state.js:7-10` |
| F13 | The shared making envelope (ER15, CRAFTING_ENGINE L10) has **not landed**. There is no envelope module; `craft_resolver.js` is an axis and mass-conserving composition law (`defineCraftLaw`, `resolveBatch`, `:28`, `:34`) and `craft_product_registry.js` has two families (`:12-32`) | `docs/CRAFTING_ENGINE.md:318`, `:326` |
| F14 | HP Polyjuice is a separate pure model (lots, stew timer, loans, assay) reading `packNative('book.hp')` | `hp_brewing_state.js:7-48` |
| F15 | The gate engine's rule leaves are the same `{fact, op, value}` shape the LOTM commands use, so a gate's `requires` can be a command's `requires` | `progression_gates.js:34-53`, `kit.js:6-9`; `rules.js` via `:5` |

F3 is the main surprise for PZ5: conservation has to be built, not just asserted.

## 1. Data shape: one pathway row, Sequences 9 to 0 (proposal D1)

### 1.1 Shape

A row stays plain JSON-able data (no functions), so it can later move into a `book.lotm` pack `native` block (F12)
and be linted. The factory reads the row; no pathway has code.

```js
// proposal: book_world_lotm_rows*.js, one literal per pathway
{ key:'cc', pid:'corpse', slug:'corpse_collector', prefix:'cc', church:'evernight',
  group:'<L1 swap group id>',                 // neighbour table key (section 4.3)
  holders:[ {id:'hale', officerId:I.supervisor, place:L.workroom, church:'evernight',
             rungs:[9,8], stock:{9:1,8:1}} ],  // who issues, examines, stocks; replaces officerId/exam.examinerId
  pool:{9:1,8:1},                              // finite world units per rung (ledger, section 3)
  rungs:[ RUNG9, RUNG8 /* , RUNG7 ... added one at a time, each marked offered:true */ ] }

RUNG = { seq:9, name:'Corpse Collector', source:I.corpse,
  dose:{ item:'Tingen prepared Corpse Collector dose' },   // item key derived by doseKey(row,seq), same JSON.stringify({id}) form as ids.js:13
  legacy:{ ingested:'ingested', stabilized:'stabilized', assessed:'assessed', promoted:'promoted', allocated:'allocated' }, // flag-name aliases so shipped saves read unchanged
  abilities:[...], ladder:{ s:[...], failure:{...} },   // from today's ladder block
  principle:{ text:'acting principle (author-only)', hint:'what an assessor or the book says aloud' },
  digest:{ count:4, acts:[ ACT... ], counter:'book.lotm.cc.acting' },  // counter name legacy for rung 9, `...acting.s8` for new rungs
  assess:{ by:'hale', ... }, exam:{ examinerId, waitMinutes, ordinaryWaitMinutes, minutes },   // exactly today's shape, per rung
  formula:{ main:{item:K.frog, qty:1, kind:'material'},                 // 'material' (market good) or 'characteristic' (ledger unit)
            aux:[ {item:K.hairs, qty:1}, {item:K.ink, qty:1, role:'ritual'} ],
            minutes:1440, batchable:false, bench:'workroom',
            brewer:'supervised',                                        // dial, section 2.5: 'supervised'|'any'|'beyonder' (PZ12 open)
            gates:{ /* extra defineGate rows keyed by id, section 2.2 */ } },
  ritual:null,                          // Seq 5/3/2 promotion set piece (section 4.1)
  pressure:{ drink:0 },                 // extra stated-cause pressure on drinking this rung (section 4.4)
  swap:null,                            // Seq 4 neighbour rule (section 4.3)
  texts:{ accept, ingest, assess, exam, promote, brewStart, brewCollect, flawSigns } }
```

Per-rung command and flag names are generated: `ids.accept` becomes `accept_allocation_cc` for rung 9 (today's id) and
`accept_allocation_cc_s7` for new rungs. Flags follow `flagOf(row,name)` (`pathways.js:10`), with `rung.legacy` giving the old
name for rungs 9 and 8 and `s7.assessed` style names for new ones. That is the whole migration trick: legacy names live in data.

### 1.2 How the four shipped rows migrate

1. **Adapter first, literals later.** Slice S0 adds a pure `rowV2(legacyRow)` that folds today's fields into `rungs[0..1]`
   (`base`->rung 9, `nextSource`/`next`->rung 8, `acts`->`digest.acts`, `know`, `labels`, `ladder`, `sources`, `market`).
   Shipped row literals do not change. The factory switches to read `rowV2(...)`.
2. **Golden proof (AR9, F9).** Before any edit, snapshot `JSON.stringify` of every command, flag list, source list and
   descriptor the factory emits for `ccRow`, `savantRow`, `sailorRow` (the new ordinary-pathway rows) and compare after the
   refactor. Byte-identical or the slice fails. This protects saved jobs (F9) and every flag (F8 untouched).
3. **Corpse Collector** gains `formula` on rung 9 (frog main, hairs aux, ink ritual material) and `pool`. Its text blocks already exist.
4. **Savant and Sailor** gain `formula` rows only. They are the second and third cases that prove the seam (AR11): if
   either needs core edits, the seam is wrong.
5. **Seer** stays hand-authored (`actions.js:35-61`: lesson, spirituality, sample bench are Seer-only). Its row gets the same
   `formula`, `pool`, `holders` fields with `prefix:''`, and the shared `brewCommands(row,seq)` attaches to it without touching
   the hand-authored accept, ingest, assess and promote. Moving those four commands onto the generator is optional and last
   (the generator already has the shape; the Seer's acting spends spirituality via `use()`, so `digest.acts[].costs` must
   allow `{energy:true}` first).
6. **Last literal rewrite.** After S4 passes, rewrite the three ordinary literals in v2 shape and delete the adapter, keeping the
   golden snapshot as a permanent test.

### 1.3 How the other pathways become rows without new code (WA1, AR11)

Adding a pathway today touches four places: a row, two dose keys in `ids.js:14`, item specs in `content.js:24-46`, and stock
entries in `content.js:22`. Propose one generator so a pathway is one literal:

- `doseKey(row,seq)` and `rowItems(row)` derive item keys and `OtherItem` specs from the row (key form is only
  `JSON.stringify({id})`, `ids.js:13`, so there is no import cycle with `ids.js`).
- `registerLotmItems` (`content.js:47`) appends `rowItems` for all rows; its duplicate check stays.
- `LOTM_NATIVE_STOCK` (`content.js:22`) is built from `holders[].stock` and `market`, not hand-listed.
- `lotmFacts` already loops `pathwayRows` for holds (`actions.js:116`, `:132`); extend that loop to all offered rungs, not to hand names.
- Lint (PZ9, PZ-L3): every `formula` item key appears in a market row, a holder stock, or a loot table; every market item key
  appears in a formula or is labelled a trade good.
- The 22 rows are authored by L1's table, but **only rungs 9 and 8 per pathway are `offered:true`** in the first widening (LC6).
  A rung without `offered:true` is data only: no commands, no flags, no items registered. That is how a row can describe
  Sequence 0 without shipping it.

Gaps the row cannot yet say, each with its smallest addition: a pathway with no acting statement in the notes (Sailor's case,
`rows.js:57-59` comment) uses authored acts labelled proposal; a pathway whose Sequence 9 grants a spirituality pool uses
`digest.acts[].costs.energy`; a pathway whose holder is not in Tingen gets `holders[].place` plus a district row
(`districts.js` rows are data already) or stays unreachable with `offered:false`.

## 2. Brewing (proposal D2)

### 2.1 Where the verb lives: justify not waiting for the shared envelope

PZ and ER15 want the next potion domain on the shared envelope. F13 shows it does not exist: CRAFTING_ENGINE L10 is
undispatched, and `craft_resolver.js` is a composition law (axes, permille conversion, mass conservation). A LOTM formula is
**conserved-identity matching** (MR11 mode "formula", MR29: separate product logic over a shared envelope), not axis composition.
So two options:

- **O1 (recommended): LOTM brewing is a LOTM command family plus one pure logic leaf, `book_world_lotm_brew.js`, written to the
  envelope's interface from ER15** (maker snapshot, execution draw, stage timeline, outcome label, identity). When L10 lands,
  the leaf's `resolveBrew(formula, inputs, maker) -> {outcome, flaws, debits}` moves under the envelope without a rewrite.
  Reason: LOTM runs on the simulation command engine (`host.js:55-60`), which already gives costs, claims, jobs, validation of
  jobs against definitions (F9) and the save. Writing an envelope first would block PZ-L1 on an unscheduled refactor.
- **O2: build the L10 split first.** Correct by ER15 but it is the largest single item in the dispatch and delays the first play
  by a refactor Weibao has not asked for (LC6).

Identity (ER16, product registry): **do not register a generated product family for LOTM doses.** The simulation's commands are
static rows (F9); a generated per-brew key cannot be named in a `costs` item, so the ingest command could not consume it.
Instead a brewed dose is the **same ordinary item key as an issued dose** (PZ done check), and a flaw rides on facts (2.3). This holds
because of one rule: a player may hold at most one dose of a given (pathway, rung) at a time (envelope-asserted, as it is now for the
sealed item, `envelope.js:31`). The registry family `potion.dose@1` stays reserved for the later open-world and HP conversion
(PZ-L4), where doses can stack. This is a decision for an Opus look before PZ-L1 (D1 below).

### 2.2 Requirements are `defineGate` rows (PZ2, F15)

`brewGates(row,seq)` returns frozen `defineGate` rows. The command's `requires` is `all(...gates.map(g=>g.requires))`, so the
bench checklist (PZ8) is `evaluateGate(g, facts, {knows})` over the same rows: one source for refusal and for the hint.

| Gate id (proposal) | Kind | Requires (leaf rules) | Reason, routes (GTR1/GTR4 need both) |
|---|---|---|---|
| `brew.cc.s9.formula` | knowledge | `has('cc.formula.s9.main')` | Reason: formulas are rare (LMG1). Routes: church issue after the assessment; broker lot (forgeable); copy from a held notebook; later divination |
| `brew.cc.s9.aux` | knowledge | `has('cc.formula.s9.aux')` | Same routes; its absence enables the partial variant (2.3) rather than refusing, so the *start* gate accepts main only and the variant sets the flaw |
| `brew.cc.s9.materials` | resource | `gte('lotm.holds.frog',1)` plus aux counts | Reason: scarcity (LMG2). Routes: buy at broker, barter ink for frog (`broker.js:22`), church store, loot |
| `brew.cc.s9.bench` | capacity | `eq('lotm.at.workroom')` | Reason: a workroom with a rite space. Routes: another bench (district row) |
| `brew.cc.s9.credential` | credential | supervisor present and `gte('lotm.supervisorAttention',1)` when `brewer:'supervised'` | Reason: PZ12 is an open source check (not established in the reviewed notes); S1 default is supervised, labelled a proposal dial. Routes: pay a holder to brew (PZ4 commission), later |
| `brew.cc.s9.maturation` | maturation | `lotm.cc.s9.brewReady` (clock minus brew-start note `.at` >= `formula.minutes`) | Reason: time or moon; mirrors the exam wait read at `pathways.js:46` |

Hints use `VAGUE_HINT` until the character knows the missing fact (`progression_gates.js:11`, `:62-68`), via the `knows` callback
reading the same knowledge notes the UI already shows (`ui.js:34`).

### 2.3 Partial formula and hidden flaw (PZ3, MR1, MR7)

Formula knowledge is two booleans per rung, `formula.sN.main` and `formula.sN.aux`, plus a `claimed` variant for a bought formula
(`formula.sN.claimed`: the seller said it; unverified). Truth acts whether known or not (MR1):

- `brew_start_<k>_sN` (full): requires main and aux known, all materials; no flaw.
- `brew_start_<k>_sN_partial`: requires main known, aux missing or claimed-unverified; consumes only what the player has;
  effects set `flaw.sN.aux`.
- A forged broker formula (`lot` row with `genuine:false`, same machinery as `broker.js:20`) sets `formula.sN.claimed` and, on
  brewing, `flaw.sN.aux` as the hidden truth. The player sees "formula (claimed)" only.
- Flaws are booleans generated from `formula.flaws` (`aux`, `ritual`, `measure` as needed); no flaw name appears in any projection
  until an appraisal reveals it.
- **Appraisal consumer:** `appraise_dose_<k>` (broker appraiser, existing fee `BROKER_VERIFY_FEE`, `broker.js:11`) writes a
  `know()` note naming the flaw. Without it the dose looks like any dose. This also gives the appraiser a second job.
- **Drinking:** the existing ingest is untouched and requires `no(flaw.any)`. A generated sibling `ingest_<k>_flawed` requires
  `has(flaw.any)` and applies `press(row pressure for the flaw)` and a stated cause record (reuse `causes.js:26` `press`; add a
  cause row `impure` to `LOTM_CAUSES`, `causes.js:11`, table entry only). It is an irreversible step like any drink (PZ1: brewing
  and drinking stay separate gates).
- Salvage and abort (PZ7, WR4): `brew_salvage_<k>_sN` returns material mains and drops auxiliaries (share is a per-row dial),
  clears the stage flags. Allowed until collected.

### 2.4 Brew-in-progress state, with no new save owner (F8, AR6)

Stage lives in the places the save already validates:

| Datum | Where | Why this place |
|---|---|---|
| stage flags `brew.sN.started`, `.collected` | player facts via `af()` | like every flag in `LOTM_FLAGS` (`actions.js:90`) |
| start time | the `.at` of knowledge note `book.lotm.brew.<k>.sN.started` | the pattern at `pathways.js:46`; survives save, reload, import exactly |
| flaw truth | player facts `flaw.sN.*` | MR1: truth separate from knowledge note text |
| committed units | derived from flags in the ledger (section 3) | no counter to drift |
| doses made | resource `book.lotm.brewed.<k>.sN` on the player, +1 at collect | monotone counter for the ledger |

`brew_start` is immediate (no job), so a multi-day maturation does not lock the player. `brew_collect` requires
`brewReady`. If a stage needs hands-on presence (a ritual step), it is a normal act with `duration` and `cancellation:'forfeit'`
(`pathways.js:26`), already supported. `lotmFacts` gains `brewReady` and `brewing` from the note and flags, inside the existing
`pathwayFacts` loop (`pathways.js:40-48`).

`brew_collect` effects: `item(player, doseKey, +1)`, `af(allocated)` when no flaw (so today's `ingest_<k>` accepts it and
`pathChosen` closes the other offers, `actions.js:123`), a `brewed` counter +1, `know()` note. With `allocated` set and one dose
held, `pathwayDoses`' existing assertion (`pathways.js:65`) holds unchanged: "the same item as the issued dose" is literal.
A flawed dose sets `flaw.*` and not `allocated`, and is drunk through the flawed sibling only.

### 2.5 Frog, hairs and ink get consumers

Corpse Collector rung 9 (proposal, labelled ORIGINAL where the notes lack it; `rows.js:22` already says the formula includes a
dried black-spotted frog): frog is the main material, hairs an auxiliary, ink the ritual material. Hairs are `genuine:false` today
(`broker.js:20`): a forged lot becomes a real mechanism, a flawed auxiliary. Ink is bartered one-for-one with frog (`broker.js:22`),
so a player can trade a frog into ink only to need a frog again: the barter becomes a deliberate cost. PZ-L3's lint lists all
three until S1, zero after.

Who may brew (PZ12) is a dial `formula.brewer`, default `'supervised'` in S1, resolved by PZ-L2 before S1 ships. The generator
reads it; it does not decide it.

## 3. Characteristic ledger (proposal D3)

### 3.1 Conserved units and where they sit

Two classes, because the notes separate them (LMG2, LMG3):

- **Materials** (frog, hairs, ink, other auxiliaries, creature parts): ordinary goods. Rule: consumed into the potion or lost
  to spoilage; MR5 wants a declared exit, which is "potion". Assertion reuses `broker.js`-style "at most one holder per lot".
  Not on the characteristic ledger.
- **Characteristics and doses**: one unit per `(pathway, seq)`. A dose is a characteristic's worth without auxiliaries (LMG3).
  These are counted.

Unit locations for `(P,s)`: held by a holder inventory (church or broker stock), held by the player, committed in a brew
(`brew.sN.started` and not collected), drunk (the rung's source or any later source exists), or lost (a recorded flag or counter).

Ledger equation per `(P,s)`:

`heldHolders + heldBroker + heldPlayer + inBrew + drunk = pool(P,s) + brewedFromMaterial(P,s) - lost(P,s)`

where `pool` is authored in the row (`pool:{9:1,8:1}`), `brewedFromMaterial` is the monotone brew counter when the main is a material,
and a characteristic-main brew moves a unit from heldPlayer to inBrew to heldPlayer (as a dose) with no counter change. `drunk` for
rung `s` is true when the player's source for `s` exists (`pathways.js:43` already derives it), and 1 only.

### 3.2 Institutional finite stock (F3)

Make an issue draw from stock. Because old saves lack seeded stock, use **monotone counters with derived remaining stock**:

- `issued.<k>.sN` resource on the holder's actor, +1 at accept and at assess (the effect today is `item(...)+1`, `pathways.js:22`, `:29`).
- Fact `lotm.stock.<k>.sN = holder.stock[N] - issuedEffective`. The accept and assess commands add `gte('lotm.stock.<k>.sN',1)` to `requires`
  (and the UI line "the stock is empty; the wait list is N" falls out of the gate hint).
- `issuedEffective = max(issued, legacyImplied)`, where `legacyImplied` is 1 when a legacy save already holds the `allocated` flag
  (or `assessed` for rung 8). So a save made before this change reads as already issued, with no migration (MR33).

Brewing replenishes nothing in an institution: a brewed dose goes to the brewer. A holder may *sell* a brewed dose through a
broker lot (existing machinery, `broker.js:15-17`), which moves the unit from heldPlayer to heldBroker, still counted.

### 3.3 Characteristic as main ingredient

Item class `Tingen characteristic (<pathway>, Sequence n)`, derived by `rowItems`. Producers (proposal): a Beyonder death leaves one
(LMG3, `0221`); the existing hostiles in `abilities.js:50` (`LOTM_HOSTILES`) get a drop row so the route has a producer, not just
a consumer. Consumers: a brew whose `formula.main.kind==='characteristic'` (the same-pathway swap, LMG2, `0142`, `0214`), and a
mask or tool craft (deferred). A characteristic at Sequence `s` is the main for the rung `s` dose, never for another rung
(LMG6: no tier skipping).

### 3.4 How the save envelope asserts it

`envelope.js:14-37` is already a registered domain validator (`registerDomain`, `:57`), so no new `save_files.js` line (AR1):

- New leaf `book_world_lotm_ledger.js` exports `ledgerCounts(save,row,seq)` and `ledgerAssertions(row,{count,reserved,state,f,assert})`.
- `pathwayDoses` (`pathways.js:62-67`) is replaced by a call to `ledgerAssertions` for each offered rung; for legacy rungs it reduces to
  today's two asserts, so shipped saves validate identically.
- The ledger runs only when the save carries a ledger marker (`book.lotm.ledger` fact set by enrollment in new saves) **or** when any
  new counter is present; absent both, legacy assertions apply (MR33, F8). This is a compatibility decision, recorded in section 5.
- One extra assert: the player holds at most one dose per `(pathway, seq)` (2.1).

## 4. Higher Sequences: what each rung needs (proposal D4)

### 4.1 Piece inventory

| Piece | Rungs | Exists today | New | Smallest new seam |
|---|---|---|---|---|
| Acts, digestion count, assessment, exam, wait | 8-5 | Yes: `pathways.js:25-34`, `:44-46`, `:50-60` for one rung | Per-rung counter names, flags, ids | Generator loop over `rungs` (S5); counters `...acting.sN` |
| Dose per rung, item keys, sources | all | Two rungs by hand (`pathways.js:37`, `ids.js:14`) | `doseKey`, `rowItems` | pure functions over the row (1.3) |
| Brew | all | None (F5) | `brewCommands`, `brewGates` | `book_world_lotm_brew.js` (section 2) |
| Ledger and finite stock | all | Custody only (F3, F4) | counters, derived stock | `book_world_lotm_ledger.js` (section 3) |
| Higher cost aux materials, price bands | 7-0 | Broker lots are per-row data (`broker.js:15-17`) | formula costs; lots for them | row data only |
| Ritual as maturation gate | 5, 3, 2 | `maturation` gate kind exists (`progression_gates.js:7`); the exam wait note pattern (`pathways.js:46`) | A ritual command per rung and its world-state facts | `book_world_lotm_rites.js`: `ritualCommands(row,seq)` from `rung.ritual.gates` (4.2) |
| Demigod threshold and mythical form | 4-2 | Pathway `ceiling` and `capped` (`ascension_paths.js:45-59`) | form flag, hide-the-form pressure | overlay fact, not a body-form change (4.3) |
| Neighbour swap | 4 (3 for some) | Switching is a stated cause, blocked by default (`actions.js:122`, `causes.js:12-14`) | a swap table and a swap-aware block fact | `swap` in the row plus `swapAllowed` in rites.js (4.3) |
| Loss-of-control pressure scaling | all | pressure resource, presign 2, loss 6 (`causes.js:10`, `:26`, `:48`) | per-rung drink pressure, divinity accumulator | rung `pressure` plus one cause row (4.4) |
| Uniqueness and the seat | 1-0 | Nothing | one world fact per pathway | seat as ledger `pool:{0:1}` and a world fact (4.5) |

### 4.2 Rituals as maturation gates (Seq 5, 3, 2)

A ritual is an authored set piece (LMG13). Data: `rung.ritual = {gates:[...defineGate rows...], interrupt:{pressure, backlash}, scaledDown:{...}}`.
Each gate is one of the existing kinds: `world state` (sea, ice and darkness, a full moon, a place), `resource` (the blood, the item),
`capacity` (the Sequence, a companion), `maturation` (a night count). `ritualCommands` emits `perform_ritual_<k>_sN` with `requires` from
the gates, a `duration`, `cancellation:'forfeit'`, and effects `af(sN.ritualDone)`. Interrupting wrongly is a stated cost:
the forfeit path already exists, plus `press()`. The promotion command (existing `promote` shape) gains `has(sN.ritualDone)`.
World-state facts (a moon phase from the clock, a sea location) go in the row as `facts:[{id, read}]` where `read` is a named,
whitelisted reader (`clockPhase`, `placeIs`, `holds`), not free code (AR12).

New: one file, one command generator, a whitelist of readers. Reuse: gates, `know`, `press`, jobs.

### 4.3 Demigod rungs and the neighbour swap

- **Swap table.** `row.group` plus `swap:{atSeq:4, to:['<row key>',...]}` on the rung; a symmetric group table lives once in
  `rites.js` (author-only, from L1's table). `swapAllowed(from,to,seq)` feeds the existing block fact (`actions.js:122`): within
  the table and at or past `atSeq`, switching stops being a refused step and becomes a priced one (LMG15: half-mad outside the
  table). Outside the table the `switching` stated cause and its pressure of 3 (`causes.js:14`) apply as today. No new command shape.
- **Mythical form.** F10 says the player's body must be a human with two hands, and `alive()` encodes it (`actions.js:93`),
  so changing `body.form` would take down every LOTM fact. Proposal: the form is a **player fact overlay** `form.sN.shown` plus a
  `hideForm` upkeep (attention, pressure) until the Seq 2 true form; `body.form` stays `'human'`. The envelope assertion at
  `state.js:31` is relaxed only at the Seq 2 true-creature rung, by a row field `rung.bodyForm`, in its own slice with an Opus look.
- **Anchors and divinity** (LMG16): see 4.4.

### 4.4 Sanity and loss-of-control pressure

The stated causes are a table (`causes.js:11-16`); a cause is a row, not code. Smallest new seam: `rung.pressure.drink` (extra pressure
added by the drink effect, the way `drink_market_*` adds it at `causes.js:36`) and one new cause row `divinity` with an accumulator
resource `book.lotm.divinity` that converts to pressure at a dial rate and falls with anchors (a fact from a held habit or rite).
`LOTM_PRESSURE` thresholds (presign 2, loss 6) are global; keep them and scale the *sources*, not the thresholds. Loss is terminal
and ends the branch (`host.js:59`); for a demigod that may be wrong (LMG11 says a lost demigod leaves a monster or materials), so
the dial `loss.outcome:'branch_over'|'monster'` is a row field, with `branch_over` the only value implemented.

### 4.5 Uniqueness and the seat

Seq 0 per pathway is `pool:{0:1}` in the ledger: one unit, one holder. A world fact `seat.<pathway>.held` lives on the world actor
(`state.worlds[I.world]` already carries `facts`, `content.js:53`). While a god holds it, a Seq 1 of that pathway cannot be
*offered* (a gate on the rung 1 `accept`). The player reaching Seq 0 is not offered (LC6): rungs 3 and below stay `offered:false`
until play of the earlier rungs says otherwise.

## 5. Save compatibility (proposal D5)

| Concern | Decision (proposal) | Basis |
|---|---|---|
| Existing LOTM saves under `?lotm_probe=1` | Keep loading. No new field in `state.lotm` (F8). New state is facts, one resource counter set and notes. | `state.js:28`, MR33 |
| Existing commands | Byte-identical for rungs 9 and 8 of every shipped row (golden test, section 1.2) | F9, AR9 |
| Existing flags and counters | Stay; new names only for new rungs. `rung.legacy` maps old names | F6 |
| Stock | Derived from monotone `issued` counters with `legacyImplied` (3.2). No seeding needed for old saves | F3 |
| Ledger assertions | Active only when the ledger marker or a new counter exists; otherwise legacy asserts (3.4). This is the explicit compatibility decision AR6 asks for | AR6 |
| New items | Added to `registerLotmItems`; the duplicate check (`content.js:47`) stays. Unknown keys in old saves cannot occur | additive |
| Browser | `probe()` gate unchanged (`domain.js:10`). Disposable-save enrollment unchanged (`host.js:40`) | F11 |
| Version bump | None. If a later slice truly needs a `state.lotm` field, bump `schema` and add a migration at that slice, never silently | F8 |

Save checks per slice: save in each stage (brew started mid-wait, collected, flawed, drunk), reload, export, literal import;
the ledger validator must pass at each.

## 6. Slice order (proposal; LC6: widen only after play)

Legend: **S** = Sonnet build, **O** = Opus look before (not a build). Effort is session count for one agent. Every slice's browser
done check runs on a rebuilt bundle at 1920x1080 on a fresh localhost origin with `?lotm_probe=1` (AD34, AGENTS verification).
Focused test only per lane; the committer runs full `npm test` once (AD36).

| # | Slice | Level, effort | Owner files | Tests to add (focused) | Done check |
|---|---|---|---|---|---|
| S0 | Prep: PZ-L2 source check from existing notes (who brews, steps, time, failure), plus `rowV2` adapter and the golden snapshot, plus the PZ-L3 lint | Haiku extraction then Sonnet; 1 session | `book_world_lotm_rows.js` (adapter only), new `tests/lotm_row_golden.test.js`, lint in the pack lint script | golden equality for cc, sv, sa; lint lists frog, hairs, ink | Golden passes with zero diff; lint shows the three orphans; PZ12 answered with locators or "not shown" |
| O1 | Opus look at D1-D3: no registry family for doses, facts-carry-flaw, counters-derived stock | Opus, one short review, after a `vault-advisor` second opinion (rule) | none (comments on this file) | none | A recorded yes or a changed D1/D2/D3 |
| S1 | **PZ-L1**: one Corpse Collector rung-9 brew. Formula known (church issue at assess or bought), frog main plus hairs plus ink, supervised bench, `brew_start`, wait, `brew_collect`, dose is the same item, existing ingest takes it | Sonnet, 1 session | new `book_world_lotm_brew.js`; edits `actions.js` (spread `brewCommands`, flags, facts loop), `rows.js` (ccRow `formula`), `ui.js` (checklist from gates, one section), `content.js` (note texts only) | brew start/collect, gate refusal and hint, insufficient frog, salvage, frog consumed once, same item key as issued dose, ingest accepts it, legacy save loads | Fresh origin: buy frog, brew, wait, collect, drink; frog gone; envelope validates; save mid-brew, reload, export, import keeps the stage |
| S2 | Partial formula and hidden flaw, forged broker formula, appraiser reveal, flawed-drink sibling with pressure, hairs and ink as real consumers | Sonnet, 1 session | `brew.js`, `broker.js` (formula lot rows), `causes.js` (cause row `impure`, table only), `ui.js` | partial brew sets flaw, flaw hidden until appraisal, flawed drink adds pressure, forged formula flaw | Fresh origin: buy a claimed formula, brew, drink, feel pre-signs; appraise first and see the flaw; save, reload, import |
| S3 | Characteristic ledger, derived stock, envelope assertion, hostile drop, characteristic-main brew | Sonnet with Opus review of the equation; 1-2 sessions | new `book_world_lotm_ledger.js`; edits `envelope.js`, `pathways.js` (`pathwayDoses`), `content.js` (stock built from rows), `abilities.js` (drop row) | ledger balances across issue, brew, sell, drink; legacy save validates; a forged duplicate dose fails the validator | Fresh origin: issue until the stock is empty, see the wait-list hint; brew from a dropped characteristic; export and import balances |
| S4 | Second and third cases: Savant and Sailor brew as pure data; rewrite three literals in v2 shape, drop the adapter | Sonnet, 1 session | `rows.js` only (plus `broker.js` lot rows from rows) | the S1/S2 suite parametrised over three rows | Zero core-file edits beyond `rows.js` (AR11 check); golden still passes |
| S5 | Generator loops over `rungs`; offer rung 7 for one pathway (digestion, assess, exam, brew); `doseKey`/`rowItems`; pathway view stages generated | Sonnet, 1-2 sessions | `pathways.js`, `path.js`, `ascension_paths` usage (descriptor only), rows | rung-7 flow on cc, per-rung counters, descriptor `ceiling` lifted by data | Fresh origin: play 9 to 7 end to end for one pathway; old saves still read Seq 8 as the ceiling |
| S6 | First widening after play: add L1 rows for the remaining pathways at rungs 9 and 8 only, batched by holder institution | Sonnet per batch of 3-4 rows; Haiku for text shards | `rows_*.js` data, `districts.js` data if a holder needs a place | lint and golden only; no new code | Each batch: lint clean, one smoke brew per row in the browser |
| S7 | Ritual rung: one Seq 5 ritual end to end (`rites.js`, whitelisted readers, interrupt cost) | Sonnet build after an Opus look; 1-2 sessions | new `book_world_lotm_rites.js`, rows | ritual gates, interrupt backlash, forfeit | Fresh origin: perform and fail one ritual, then succeed |
| S8 | Seq 4 swap table and form overlay, divinity cause row | Opus design, Sonnet build; 2 sessions | `rites.js`, `causes.js` row, `actions.js:122` block fact | swap inside and outside the table, hide-form upkeep | Fresh origin: swap to a neighbour at Seq 4, see a priced step; a non-neighbour is half-mad |
| S9 | Move row data to a `book.lotm` pack `native` block and lint it with the pack registry | Sonnet; 1 session | `world_packs/book_lotm_pack.js`, `world_pack_registry.js` | pack lint | Only after S6 has stabilised the shape (AR11) |
| Later | Seq 3 to 0 set pieces, Uniqueness seat, heredity, club and orders | not scheduled | none | none | Needs Weibao's play verdict on S5 to S8 |

Sequencing notes: S1 can start before S0 finishes only if PZ12 is settled; S2 and S3 are independent after S1 and may run as two
lanes with one writer per file (`brew.js` vs `ledger.js`); S0 must precede any edit to `rows.js`.

## 7. Risks and what to defer

| Code | Risk | Mitigation or deferral |
|---|---|---|
| R1 | **Command and data explosion.** The factory emits about 15 commands per pathway today. 22 pathways by 8 rungs by a brew family is thousands of commands in the registry, and `ui.js` lists every action | `offered` flag per rung; commands exist only for offered rungs; UI shows the player's own pathway first; widen only after play (LC6). Measure registry size at S5 |
| R2 | **A third potion engine.** HP, craft composition and LOTM brewing diverge, against ER15 and ER16 | O1 keeps the brew leaf on the envelope's interface; the HP conversion (PZ-L4) and the L10 split remain scheduled, not forgotten. Do not register a registry family until a second consumer needs it |
| R3 | **Existing-assertion collisions.** F8 (six-field owner), F9 (jobs equal definitions), F10 (human body) each block a natural design | Facts, notes and counters instead of a new owner; golden test on shipped commands; form as an overlay until a gated Seq 2 slice |
| R4 | **Sealed and canon volume.** Authoring ten rungs of formulas and acting principles for 22 pathways invites invented canon and sealed-secret leaks | L1 owns the table; every number here is a labelled proposal; rungs 7 and below stay `offered:false` until the notes cover them; principles are author-only fields |
| R5 | **Hidden truth leaking.** Flaw flags, forged-formula state and principle text must not reach the UI | Flaws only in facts and notes the observer has; the checklist reads `evaluateGate().shown`; add a projection test that a flawed dose and a clean dose render identically before appraisal (MR31) |
| R6 | **Conservation equation drifting from play.** A ledger that disagrees with a legal player action makes valid saves fail to import | `ledgerCounts` is pure and tested against every command's effects; legacy-tolerant (3.2, 3.4); one validator, no second ledger |
| R7 | **PZ12 unresolved.** Building brew requirements on a guess about who may brew | Make it a dial and a labelled default; S0 resolves it from existing notes or records "not shown" |

**Defer, explicitly:** Seq 3 to 0 content, the seat and Uniqueness, heredity, club and order trade, mask and tool crafting from a
characteristic, batch brewing (`batchable` stays false), mobile layouts (AD34), moving HP onto the envelope, a `body.form` change,
moon and sea facts beyond one ritual, NPC brewers using the same resolver (MR23) until the player's brew is played.

## 8. Smallest set of new modules (proposal)

1. `book_world_lotm_brew.js`: gates, brew commands, flaw, appraisal, facts, assertions (S1, S2).
2. `book_world_lotm_ledger.js`: pure counts and envelope assertions (S3).
3. `book_world_lotm_rites.js`: ritual commands, swap table, form overlay, readers (S7, S8).

Everything else is data in `book_world_lotm_rows*.js` and small edits to `pathways.js`, `actions.js`, `envelope.js`, `broker.js`,
`causes.js` (table rows), `content.js` and `ui.js`. No `main.js`, `save_files.js` or `display.js` line is added (AR1), because
registration is through the existing `lotm` and `lotm_envelope` domains (`domain.js:21`, `envelope.js:57`).

## 9. Open questions

- Q1 (D1): is "same ordinary item key, flaw in facts" acceptable, given the one-dose-per-rung hold rule? If Weibao later wants stacks
  of doses, the registry family is the answer and S2 must be redone for it.
- Q2: does a bought, forged formula count as the player's knowledge for gate purposes (`claimed`), or only as a note? Proposed:
  note plus `claimed` flag, never `main`/`aux`, so verification stays a real step.
- Q3 (PZ12): who may brew, and with what supervision, is not shown in the notes this lane read. Resolved by S0.
- Q4: the 22-pathway row text volume (R4) needs an owner for authored acting acts for pathways whose notes lack one (the Sailor case).
