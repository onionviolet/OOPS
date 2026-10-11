# Reader C: cheat implementation feasibility on the current engine

*Auditor C, 2026-10-10. Read-only on `src/`; no build, test or browser run.
Working tree on `codex/gameplay-foundations` (uncommitted src edits present,
read as-is). Everything here is a proposal (rule 10). Labels: **SHOWN**
(file:line I read today), **INFERRED** (my reading, not proven by a run).
Effort scale: **S** content or a small handler on existing contracts;
**M** new optional save owner with validator, panel extension and browser
check; **L** a new engine service (runner, stream, hook bus) or a change to
an accepted flow; **XL** native-layer refactor (native combat, multiple
controlled bodies).*

Inputs read: `PROJECT.md`, `AGENTS.md`, `docs/RULES_FROM_SCRATCH.md`
(rulebook), `docs/CHEAT_LIBRARY.md` (cards, implementation, idea cards),
`docs/SIMULATORS_AND_CHEAT_IMPLEMENTATION.md`,
`docs/RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md`,
`docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` (sealing), and the source files
cited below.

## Engine inventory used in this audit (all SHOWN)

| Ref | Piece | Where |
|---|---|---|
| E1 | Expansion state: one xorshift stream `rng`, `sequence`, `history` capped at 100 | `src/expansion_engine.js:69-76`, `:511-516`, `:525` |
| E2 | `commitAction` plans on a clone, draws even for a certain action, freezes outcome and roll receipts | `src/expansion_engine.js:530-580` (draw at `:551`) |
| E3 | `advanceSimulation` clones, steps boundaries, stops at a blocking choice, caps at 512 boundaries | `src/expansion_engine.js:582-631` (`:597`, `:619`) |
| E4 | Five reconcilers receive the *original* `state` as `before` inside E3 | `src/expansion_engine.js:617-618`, `:621-625`; grep of those 5 files found no writes to `before` (INFERRED pure) |
| E5 | Scenario checkpoint and rewind; rewind never restores sequence or rng; checkpointed scenarios cannot export resources | `src/expansion_engine.js:652-675` (`:673`), `:541-545` (check at `:544`) |
| E6 | Roll tables with fact-gated probability transfers | `src/expansion_engine.js:317-321`, `:365-385` |
| E7 | Recurring scheduled actions reserve their cycle at commit | `src/expansion_engine.js:540`, `src/world_rhythm.js:15-20` |
| E8 | Capabilities: pure query, providers plus sources; faculty gate (awakened/active/suppressed); grants must be positive | `src/capabilities.js:4`, `:24-32`, `:39-66` (`:53-54`) |
| E9 | Saved sources: shape checked, extra fields tolerated | `src/expansion_engine.js:190-200` |
| E10 | Living world: seed hashed from `rng` at enrollment; per-event-check streams `hash(seed, id)` | `src/simulation.js:33-34`, `:46`, `:64` |
| E11 | Event checks with pity (`guaranteeAfter`, `misses`) and `maxOccurrences` | `src/simulation.js:484-498` (`:492`) |
| E12 | Conditions with `onTick` intervals | `src/simulation.js:463-468` |
| E13 | NPC old-age `lifePolicy` endings | `src/simulation.js:470-479` (no home-world content uses it; grep) |
| E14 | Controllers (NPC policies) and programs (automation routines, `automatable`, count up to 10000) | `src/simulation.js:505-536`, `:311-329` |
| E15 | Advancement graph: parents, branches, `exclusiveGroup`, receipts | `src/simulation.js:330-343` |
| E16 | Origins: one `origin.selected` claim per save | `src/simulation.js:597-604` |
| E17 | Knowledge records with stages seen/interpreted/understood and `basis.attributedTo` | `src/simulation_effects.js:225-229`, facts `:83-86` |
| E18 | Relationship gains keyed by cause receipt (no farming) | `src/simulation_effects.js:230-236` |
| E19 | Life status changes need `lethal: true` | `src/simulation_effects.js:261-264` |
| E20 | Faculties: grant, awaken, activate, suppress, develop | `src/simulation_effects.js:265-277` |
| E21 | Powers: learn, copy, transfer, fusion, fragments, mastery | `src/simulation_effects.js:279-298` |
| E22 | Techniques: observed, understood, owned, proficiency; observe routes closed to `field-observation`/`native-victory`; executable only in the definition's world | `src/techniques.js:8`, `:36`, `:52`, `:85-97`, `:99-126` |
| E23 | Chronicle: scheduled events (cartographer, inheritance) open and go missed; mortal lifespan end; last-year notice | `src/chronicle.js:68-86`, `:98-122` |
| E24 | Heir: new save from a fresh envelope, reuses previous `rng`, carries `npc_lives`, `options`, `life_record`, one lesson | `src/life_experience_host.js:8-24` (`:16`, `:19`), `src/chronicle.js:273-280` |
| E25 | Heir UI: "Begin an heir · fresh body, one lesson" | `src/chronicle_ui.js:56-60`, `:120-121` |
| E26 | Existing sealed time-loop prototype (bell yard: open, practice, rewind, finish; declared local domains restore; `maxRewinds` stored in state) | `src/backlog_expansion_time.js:35-42`, `:126-128`, `:175-179`, `:232-233` |
| E27 | Existing offline prototype (prepaid packing batch; trusted wall timestamp; backwards clock refused; paused time discarded) | `src/backlog_expansion_time.js:43-50`, `:81-86`, `:200-215`, `:323-331` |
| E28 | Pursuit with faculty and locator gates | `src/pursuit.js:120-136` |
| E29 | Carrier kinds include memory, method, source, debt, curse, observer, ally | `src/feature_expansion_nested_carriers.js:9`; transit preview `src/backlog_expansion_transit.js:285` |
| E30 | Nested hub with stock, shop and quest ledger per world | `src/feature_expansion_nested_content.js:6-11`, `:67` |
| E31 | People view projects witnessed knowledge only | `src/people_knowledge.js:6-7`, `:12` |
| E32 | Titles from lifetime counters, bonuses derived on read | `src/titles.js:1-2`, `:8-37` |
| E33 | Panels hosted in Here / Practice / People views | `src/adventure_notebook.js:6-14` |
| E34 | Persistence writes one envelope before publication | `src/expansion_persistence.js:7-50` |
| E35 | Fork-and-discard already used: commit runs E3 on the plan to vet future rewards, then drops it | `src/main.js:628-636` |
| E36 | Seed from `crypto.getRandomValues`; load keeps saved rng | `src/main.js:350`, `:4725` |
| E37 | Native combat damage accepts an injected random | `src/combat_math.js:34-36` |
| E38 | Linear effect formulas (`fact * scale + add`, clamped) | `src/power_models.js:48-55` |
| E39 | Save budget 4 MiB | `src/save_files.js:180` |
| E40 | One controlled native body across retained-world visits | `src/expansion_engine.js:139-140` |
| E41 | Optional owner pattern: each new top-level owner gets its own validator inside `validateExpansionState` | `src/expansion_engine.js:132-160` |

No engine code filters sealed text (grep for `sealed|secret` hits only content
files). The sealing rules exist as proposals in
`docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` (INFERRED from grep).

No offline catch-up exists for ordinary play: game time advances only in the
`update()` tick (`src/main.js:6616-6640`); E27 is the only wall-time path
(INFERRED from grep).

## 1. Summary matrix

| # | Family | Maps to | Missing | Save | Risk (RNG audit) | Effort | Smallest slice |
|---|---|---|---|---|---|---|---|
| 1 | Simulator: forecast | E3, E4, E35 | Purity proof, report builder, knowledge filter | Charges + trimmed report | Low if fork re-seeded | M | "Read the coming week": passive fork, show events/deadlines that fire |
| 1b | Simulator: probe | E2, E3 | Two forks from one choice, side-by-side view | Same | Low | M (after 1) | Compare two answers to an open decision |
| 1c | Simulator: dream run (S1 story model) | Chronicle, village content, E6 | Whole beat model, decision cards, keeps | Charges, report, keep | Low (model only) | L | "Dream of the coming year", 3 cards, keep 1 observation |
| 1d | Simulator: headless | 1c + standing intent | Policy object | Same | Low | S (after 1c) | Same dream with no stops |
| 1e | Simulator: spread | 1c or 1 run N times | Cost cap, slicing | Same | CPU only | S-M (after 1/1c) | "4 of 10 dreams" odds line |
| 1f | Simulator: rehearsal | E37, native stats snapshot | Seeded combat loop outside native timers | Charges + win rate | Low (never touches live combat) | M | Rehearse one Village enemy 20 times |
| 1g | Simulator: shadow | 1c + selves | Self generator | Report | Low | L | Watch a "self who took the mine job" |
| 2 | Prophecy / true future | E10 streams, E23 events, E3 | Seed lock, divergence tracking, sealed truth model | Lock record, divergence marks | High if lock leaks real streams | L | Prophesy the cartographer and inheritance events; mark broken on deviation |
| 3 | Time loop / regression with carry dials | E5, E24, E26 | Death trigger policy, carry dial schema, whole-life anchor | Anchor snapshot (size!) | Medium: rng restore vs fresh is a dial | L (XL whole-save) | Generalize bell-yard loop dials (domains kept, rewinds per world) |
| 4 | Save-anchor (Echo) | E5, E26 | Anchor on actor and area, not only scenario | Anchor + charges | Medium: no merge of old costs and new rewards | M-L | Set a stone in the Village yard; return restores that area only |
| 5 | Heir and legacy | E24, E25, E29 | "Inherit what was left" (things, records, people, standing) | New-save build, no new field for v1 | Low (rng carried) | M-L | Heir receives home stock, written notes, taught apprentice |
| 6 | Foreknowledge stock that goes stale | E17, E23 | `basis.kind: foreknowledge`, accuracy and decay on divergence | Knowledge records | Low | M | Know the cartographer briefing time; stale after you delay it |
| 7 | Quest / status window with stakes | E7, E14 jobs, agreed duty | Contract card, deadlines, penalty ledger | Contracts + points | Low | M | Accept "deliver 3 logs by day 3"; claim points or pay the penalty |
| 8 | Sign-in | E7, people, locations | Streak counter, place list | Claimed cycles, streak | Low (cycle reserved at commit) | S | Daily sign-in at the Village notice board |
| 9 | Draw wheel, doubling cost, pity | E6, E11, E38 | Exponential cost, pity on roll tables, own stream | Draw count, pity per table | Medium: single stream shifts by unrelated actions | M | Spend coins on a shrine wheel; cost doubles, pity at N |
| 10 | Reach accumulator (Celestial Forge) | E12 onTick, E6 | Offer queue, bank, take rule | Reach, bank, offer receipts | Low | M | Reach grows each day; a seeded offer appears; take if covered |
| 11 | Copy / template shelf | E21, E22 | Copy route enum, shelf slots, tier fusion | Shelf records | Low | M-L | Store a lower-tier copy of the Rat-step after observation |
| 12 | Graded trait entries, evolution, curses | E8, E15, E20 | Grades, negative grants (curses), luck spend | Trait records | Low | M | One trait upgrades into a named successor; a locked curse shows |
| 13 | Appraisal (traits, fates) | E8, E17, E31 | Appraise action with confidence and error, fate fields | Knowledge records | Low (pure read) | M (traits), L (fates) | Appraise the craftsman: partly right reading in People |
| 14 | Fate-change reward | E13, E19, causal stories, E23 | A scripted home-world fate, payout on averting | Watched fates, payout receipts | Low | M-L | Avert a scheduled loss in Village; mint fate coin once per fate |
| 15 | Hub store, tolls, world grades | E29, E30 | Points per world deed, toll per trip, grade unlocks | Points, grades | Low | L | Home-world deeds earn points; hub shop lists two tiers |
| 16 | Rebate multiplier per person | E18, relationships | Per-target multiplier, payout on gift/teach | Multipliers per person | Low (receipts exist) | M | Gift to Neri returns 2x a known item |
| 17 | Teach / deliver powers | E21 copy/transfer, E22, village mentor | Gate by affection or contract, copies back | Power records | Low | M | Teach the guard lesson to Jun; receive a fragment back |
| 18 | Companion spirit | E14 controller, E17, event feed | Advice from known facts only, feeding, growth | Spirit person + resources | Low | M | A voice in the log that advises, asks to be fed, grows a stage |
| 19 | Offline progress as in-world cheat | E27, E3 | General catch-up on load, cap, return note | Last-seen wall time, bank | Medium: wall clock trust | M-L | Patient Furnace: assign one automatable job; return note says what stopped it |
| 20 | Automation as earned habit | E14 programs, E32 | Unlock by repetition count, bad habits | Habit counters | Low | S-M | After N manual runs, the job becomes `automatable` for you |
| 21 | Loaded dice / roll override | E2 receipts, E6 | Override command keeping original receipt | Charges, override receipts | Medium: must commit before display | M | Call the outcome of one discovery roll for a rising cost |
| 22 | Character switching | E14, E40 | Multiple controlled bodies | Large | High (native state) | XL (L for living-world-only switch) | Switch command target to a second self in the living world only |

## 2. Per-family detail

Format: (a) maps to, (b) missing, (c) save, (d) determinism and reload risk,
(e) UI in existing panels, (f) sealed secrets, (g) effort, (h) smallest
home-world slice a fresh-origin browser test can verify, (i) dependencies.

### 1. Simulator family

Shared for all modes (SHOWN unless marked):
- (a) E3 is a ready fast-forward on a clone with decision stops and a work
  cap; E35 proves the host already runs it on a plan and discards the
  result. E10 gives per-check streams, so a fork can be re-seeded by
  replacing `state.rng`, `simulation.seed` and each `checks[*].rng` with
  `hash(root, "dream:" + chargeNo)` (INFERRED design).
- (b) A purity test (state hash before and after) because E4 passes the
  original state to five reconcilers; a report builder over `history`,
  `simulation.log`, `simulation.events`, chronicle events; a knowledge
  filter for report text (see section 3); a charge model.
- (c) New optional owner `state.cheats` (section 3): charges, last trimmed
  report (keep small, E39), keep receipt. Old saves: absent means no
  simulator.
- (d) Risk: a fork that keeps the real rng shows the real future of the
  deterministic layer, which is an unintended prophecy. Re-seed by default;
  locking is a separate, deliberate grade (family 2). Native systems use
  `Math.random` (RNG audit), so the fork cannot include native combat,
  crafting, shop or gathering; estimates only.
- (e) A "Dream" section inside `simulation_panel` (People view, E33) or
  `chronicle_panel`; report lines in the event feed.
- (f) Default knowledge = what you know; modeled unknowns render as blank
  spots ("something unexplained here"), never the truth string.
- (i) Section 3 foundations F1, F2, F3, F4.

**1a Forecast** (passive fork). (g) **M**: the runner is E3; work is the
re-seed, purity test and report. (h) "Read the coming week" in the
Village: fork, advance 7 days with no player commands, list which
chronicle events open or are missed, which jobs finish, which offers
expire. Browser: report shows; real clock, money and rng unchanged after;
charge spent persists across reload and import.

**1b Probe** (fork at one decision, both branches). (a) E3 stops at
`waitingSimulationChoice`; `respondSimulationEvent` per branch on two
clones. (g) **M** after 1a. (h) An open decision event in the People
panel gets "Probe both answers": two short reports side by side. (i) 1a.

**1c Dream run** (S1 story model). (a) Village career, patrol, study and
household content as beat sources; E6 tables for outcome bands driven by
real facts. (b) The whole beat model, decision selection ("stop only
where outcomes differ most"), keeps (observation needs a new technique
observe route `dream`, E22 `:36` is a closed enum). (g) **L**: a new
model, not a wrapper. (h) The doc's own slice: "Dream of the coming year",
three decision cards, result band and confidence, keep one observation
step. Charge refills per home-world season (a world adjective). (i) F1,
F3, F5, family 11 (observation keep) optional.

**1d Headless.** Same as 1c with a standing-intent policy instead of stops.
(g) **S** after 1c. Idle fit: run on return from absence (family 19).

**1e Spread.** N re-seeded runs of 1a or 1c; show odds. (g) **S-M** after
1a/1c; needs a per-run boundary cap and slicing across ticks (no Web
Worker exists; grep found none). (h) "Dead or ruined in 3 of 10 dreams".

**1f Rehearsal.** (a) E37 accepts an injected random; native stats can be
snapshotted like `simulationNativeContexts` in `main.js`. (b) A pure
fight loop that does not use native timers or mutate enemies. (d) Never
touches live combat, so no exploit. (g) **M**. (h) Rehearse a Village
enemy 20 times on a seeded stream: win rate and one log.

**1g Shadow.** Needs a self generator (`docs/SELVES_AND_ECHOES.md`).
(g) **L**. (i) 1c, family 22 for the self record.

### 2. Prophecy and true-future prediction

- (a) Seed-locked: E10 per-check streams and E1 are saved, so a lock can
  copy them and compare later draws. Truth-modeled: E23 scheduled events
  and causal-story deadlines are authored facts that can be "foreseen".
- (b) A lock record (stream states at lock time, horizon), divergence
  detection (any player commit inside the horizon marks the lock broken
  from that boundary), and a prophecy text generator through the knowledge
  filter.
- (c) Lock record and divergence marks in `state.cheats`; old saves none.
- (d) **High** unless scoped: a lock that reveals the next N draws of the
  single E1 stream lets the player order actions to fish results (the RNG
  audit already flags that unrelated certain actions shift the next draw,
  E2 `:551`). Mitigation: prophecy reads separate streams (F2), and the
  lock covers only deterministic-layer events, never native rolls.
- (e) Prophecy lines in `chronicle_panel` beside its events; broken lines
  greyed with "you changed this".
- (f) A prophecy is a reading (rule 6). A sealed truth appears only as
  imagery or a blank, and the reading may be wrong by grade.
- (g) **L** (seed-locked); **M** for truth-modeled over authored events.
- (h) "The elder's archive succession will happen in Village at hour X."
  Browser: line shows; act to attend, line resolves "fulfilled"; skip it,
  line resolves "missed as foretold"; reload keeps state.
- (i) F2 streams, F3 filter, family 6 (prophecy becomes foreknowledge).

### 3. Time loop / regression on death with carry dials

- (a) E26 is a working local loop: declared domains restore on the same
  people, common time and knowledge stay, rewinds counted in state. E5
  rewinds a scenario and keeps rng. E24 builds a new life from an ended
  one.
- (b) Trigger policy: home-world native defeat is unconsciousness
  (PROJECT accepted decision), and the chronicle's only life end is
  lifespan (E23 `:113-118`). A loop "on death" therefore needs Weibao's
  go on which deaths count, or uses lifespan end, a lethal event (E19),
  or a voluntary trigger. Carry dial schema: mind, body, items, people,
  world dice (same or fresh), anchor time. A whole-life anchor needs a
  full envelope snapshot, not only expansion state.
- (c) Local loop: small. Whole-life regression: an anchor envelope copy
  could be large (E39 budget 4 MiB); store diffs or only expansion plus
  key native fields. Needs a migration entry for `state.cheats.loop`.
- (d) Restoring rng replays the same deterministic future (a prophecy for
  free); keeping it gives fresh dice. Make it a per-world dial ("world
  dice"). Must not merge old costs with new rewards (RNG audit).
- (e) Death menu inside the existing end-of-life block in `chronicle_ui`
  (E25), which already appends to the page; extend it, no new window.
- (f) Carried knowledge enters as foreknowledge (family 6), so sealed
  truths stay sealed until rediscovered.
- (g) **L** for a home-world regression on the heir pipeline; **XL** for
  whole-save rollback including native inventory and skills.
- (h) Generalize the bell-yard loop: `maxRewinds` and kept domains read
  from a world dial instead of the fixed text "Two rewinds maximum"
  (`:36`, `:40`, `:175`). Then a death-menu slice: end a mortal life,
  choose one carry slot, wake at the anchor with it.
- (i) F1, F6 hooks (onDeath, onRestart), family 5 for the life pipeline,
  family 6 for carried memory. CHEAT_LIBRARY's C2 gate: changing the heir
  flow needs Weibao's go.

### 4. Save-anchor (Echo Anchor)

- (a) E5 checkpoint/rewind (scenario scope), E26 declared-area restore.
- (b) Anchor on an area or body outside a scenario; charges per return;
  "only the declared area resets" means the restore must name domains
  (E26 already does: player body, keeper, site, inventory).
- (c) Anchor snapshot per area; small for an area, large for a body.
- (d) Rewind must keep spent charges and receipts (E5 `:673` already never
  restores sequence or rng). A return cannot restore spent inputs while
  keeping rewards gained after the anchor.
- (e) Anchor list in `simulation_panel` or the Here view's Village panel.
- (f) None special.
- (g) **M-L** (M if built by generalizing E26).
- (h) Set a stone in the Village yard, do one practice that costs stamina,
  return: yard and body restore, time and knowledge do not, charge spent.
  Browser: save, reload, import at each step.
- (i) F1, family 3 shares the restore code.

### 5. Heir and legacy inheritance

- (a) E24 builds the new envelope and already carries `npc_lives`,
  `options`, `life_record` and the rng; E29 lists carrier kinds.
- (b) The accepted direction ("inherit what was left behind") is not
  built: E24 creates a fresh body with one lesson (E25 text). Missing:
  copying home stock and stored goods, written records (notes the life
  made), taught apprentices and family, standing (reputation, debts), and
  unfinished projects. Each needs a native-field copy policy in the new
  envelope.
- (c) The heir save is a new envelope; v1 needs no new field. A legacy
  ledger (what passed, by which carrier) is an optional field.
- (d) Low: rng is carried (`:16`), so no reroll farming via repeated heirs
  beyond what the player can already do by importing an old save.
- (e) Same end-of-life block (E25): replace the button text with a list of
  what survives and why.
- (f) A sealed secret discovered by the old life passes only if written
  down or carried (rule 5).
- (g) **M-L**: the native copy policy touches inventory, home and skills.
- (h) Mortal life ends; the heir starts with the home stock, a note the
  old life wrote, and Jun as a known person. Browser from fresh origin
  with a test-origin fast-age switch.
- (i) None hard; it is the base for family 3 and family 7's stakes.

### 6. Foreknowledge stock that goes stale

- (a) E17 knowledge records with stages and a `basis` already; E23 events
  have exact open and close times.
- (b) `basis.kind: "foreknowledge"` (validator at
  `src/simulation_contracts.js:83` checks basis), an accuracy field, and a
  staleness rule: when the linked event's state changes in a way the
  record did not predict, the record degrades to "uncertain".
- (c) Knowledge records already persist inside `simulation`; adding a
  basis kind needs a validator change and old saves are unaffected.
- (d) Low.
- (e) Notebook lines in `chronicle_panel` or People; stale ones marked.
- (f) Foreknowledge of a sealed secret is stored as an ID and a vague
  cue, not the truth text.
- (g) **M**.
- (h) Start with "you remember the cartographer will brief at hour X".
  Delay an action that shifts it (or skip): the line shows stale.
- (i) Families 2, 3 and 1 produce foreknowledge.

### 7. Quest / status window with stakes

- (a) E14 jobs with due times, agreed-duty completion, cancellation,
  stopped and refusal effects (`src/agreed_duty_host.js:93-120`), E7
  schedules.
- (b) A contract card (accept, deadline, reward points, penalty such as
  lost money or a debt), a points ledger and a spend list.
- (c) Contracts and points in `state.cheats`.
- (d) Low: acceptance and settlement are commits; reload cannot claim
  twice if the receipt is stored.
- (e) Status window as a section of the Practice view (`skills_panel` or
  `body_panel`).
- (f) None.
- (g) **M**.
- (h) Accept "deliver 3 logs to the craftsman by day 3": deliver, claim
  points, spend on a small item; or miss it and see the penalty.
- (i) F1, F6 deadline hook.

### 8. Sign-in

- (a) E7: a repeatable scheduled action already reserves its cycle at
  commit, so a second claim in the same window is refused.
- (b) Streak counter and a place list; rewards may be a roll table.
- (c) Streak in a world or actor fact (E41 domains accept facts); no new
  owner strictly needed for v1.
- (d) Low. If the reward rolls, use a dedicated stream (F2) so sign-in
  does not shift discovery draws.
- (e) A row in `village_panel`.
- (f) None.
- (g) **S**.
- (h) Sign in at the Village notice board once per home-world day window
  (adjective). Browser: claim, refused again same window, reload keeps it,
  next window opens, streak 2.
- (i) None. Good first card for F1.

### 9. Draw wheel with doubling cost and pity

- (a) E6 roll tables with fact-gated transfers (stepwise pity is
  expressible as `when: draws.sincePity gte N`); E11 shows pity counters
  on event checks.
- (b) Exponential cost (E38 formulas are linear; add a `pow` or table op,
  or store the next cost as a fact updated per draw); pity counter keyed
  by table and revision; the wheel's own stream.
- (c) Draw count and pity per wheel in `state.cheats`.
- (d) **Medium**: on the shared E1 stream, a player can shift results by
  doing cheap certain actions first (E2 draws even for certain actions).
  Use F2. Reload does not reroll committed results.
- (e) Row in the Village panel or the hub shop (family 15).
- (f) A prize that is a sealed item shows its public name only.
- (g) **M**.
- (h) A shrine wheel: draw 1 costs 1 coin, then 2, 4; pity guarantees the
  rare outcome at draw N (adjective). Browser: costs climb, pity fires,
  reload keeps counters.
- (i) F1, F2.

### 10. Reach accumulator (Celestial Forge)

- (a) E12 condition `onTick` can add reach on an interval; deeds can add
  reach as effects; E6 tables pick offers.
- (b) Offer queue (seeded), take rule (reach covers cost), bank of
  remainder, offer expiry.
- (c) Reach, bank and offer receipts in `state.cheats`.
- (d) Low with F2; offers are drawn on boundaries, not on UI open.
- (e) Practice view, beside techniques (`technique_panel`).
- (f) An offer can be a sealed power by ID with a public label.
- (g) **M**.
- (h) Reach +1 per home-world day; on day 3 an offer appears; take it if
  reach covers it; the power is a source granting a capability.
- (i) F1, F2, F6 boundary hook.

### 11. Copy / template shelf

- (a) E21 copy and transfer on powers (donor must own it); E22 technique
  observe, understand, own; fusion via `combination: "fusion"`.
- (b) A copy route for techniques (E22 `:36` and `:52` accept only two
  routes; add `copy` and `dream` with migration-safe validation), shelf
  slots and tiers, a "lower tier" copy (mastery cap).
- (c) Shelf records; technique records gain a new route value (old saves
  still valid).
- (d) Low.
- (e) `technique_panel`.
- (f) None.
- (g) **M-L** (M for techniques, L if enemies need power records).
- (h) After observing the Rat-step via native victory, store a lower-tier
  copy on the shelf; use it; it does not grant the enemy's body.
- (i) Families 1c and 17 feed it.

### 12. Graded trait entries with evolution and curses

- (a) E8 sources and capability grants; E20 faculties (dormant, awakened,
  suppressed, development); E15 advancement graph with parents and
  exclusive branches is a ready evolution graph.
- (b) Grade field; luck spend to upgrade; curses: E8 rejects non-positive
  grants (`src/capabilities.js:28-29`), so a curse must be a condition
  (E12), a positive "burden" capability read as a penalty, or a schema
  change. Locked curse = a source that cannot be removed without a
  route.
- (c) Grade per trait; old saves have none.
- (d) Low.
- (e) `body_panel` (Practice view).
- (f) A cursed trait's true effect can be sealed: show "something weighs
  on you" until appraised.
- (g) **M**.
- (h) A home trait "Keen eye (C)" upgrades to "Pathfinder's eye (B)" via
  the advancement graph; a curse shows locked.
- (i) Family 13 to see grades; F1.

### 13. Appraisal: seeing others' traits or fates

- (a) E8 capability for appraisal strength; E17 writes a knowledge record
  with stage and attribution; E31 already shows only witnessed knowledge.
- (b) Appraise action whose reading depends on observer skill versus
  target concealment (rule 6), with a confidence and possible error.
  Fates: no fate field exists on people (INFERRED: none found in
  `simulation_contracts.js` person shape), so fate appraisal needs a
  per-world fate mechanism first.
- (c) Knowledge records only.
- (d) Low; the reading roll is committed once per target per period.
- (e) People view rows (E31).
- (f) Core risk: appraisal is a discovery route. It writes the stage text
  only, never the truth; a wrong reading is allowed.
- (g) **M** for traits; **L** for fates.
- (h) Appraise the craftsman: People shows "steady hands, maybe a hidden
  injury (low confidence)".
- (i) F3 filter; family 14 for fates.

### 14. Fate-change reward

- (a) E13 NPC life endings, E19 lethal guard, causal stories with
  deadline and `protection` intact/severed
  (`src/causal_story_core.js:138`), E23 missed events.
- (b) A home-world scripted fate (no home content uses `lifePolicy`;
  grep), a watched-fate list, a payout once per fate receipt (E18-style).
- (c) Watched fates and payout receipts.
- (d) Low if payout keyed by fate ID.
- (e) `chronicle_panel` line per watched fate.
- (f) Which fates exist can be sealed; show "an ill omen over X".
- (g) **M-L** (content plus a fate model).
- (h) An authored Village fate (an NPC's shop burns on day 5); prevent it,
  receive fate currency once.
- (i) Per-world fate mechanism (open question Q3); family 13 to see fates.

### 15. Hub store with tolls and world grades

- (a) E30 nested hub already has stock, shop and a quest ledger; E29
  carrier transit preview; nested worlds have clocks.
- (b) Points per world deed, toll per trip, grade per world, unlock list.
- (c) Points, grades, purchases.
- (d) Low with committed stock (the RNG audit's shop epoch issue applies
  if stock rolls).
- (e) Existing nested hub panels.
- (f) None.
- (g) **L** (cross-world, depends on nested campaign).
- (h) Home deeds earn 5 points; the hub lists two goods at grade 1;
  travel costs a toll.
- (i) Family 7 (points), E30 world.

### 16. Rebate multiplier per person

- (a) E18 relationships with receipts; gift and teach actions in Village.
- (b) Per-target multiplier that grows with care, payout on gift.
- (c) Multipliers per person.
- (d) Low: E18 already blocks repeated receipts.
- (e) People rows.
- (f) None.
- (g) **M**.
- (h) Gift a log to Neri; receive two back once the multiplier is 2.
- (i) F6 onGift hook.

### 17. Teach / deliver powers

- (a) E21 copy (donor keeps) and transfer (donor loses); E22 records;
  village mentor and successor content (Jun).
- (b) Gate by affection or contract, copies back to the giver as a
  fragment.
- (c) Power records on the target.
- (d) Low.
- (e) People rows and `technique_panel`.
- (f) None.
- (g) **M**.
- (h) Teach the guard lesson to Jun; Jun gains it; you get a fragment.
- (i) Family 16 shares the people hook.

### 18. Companion spirit

- (a) A simulation person with `provision: false` and a controller (E14);
  knowledge notices; event feed.
- (b) Advice built only from player-known facts (F3), a feed resource,
  growth stages.
- (c) Spirit person, stage and fuel.
- (d) Low.
- (e) Lines in the event feed; a row in People.
- (f) The spirit knows only what you know unless its card says otherwise;
  even then, hints not truths.
- (g) **M**.
- (h) The spirit says "the cartographer leaves soon", asks for a log,
  grows a stage after three feedings.
- (i) F1, F3, F6.

### 19. Offline progress as an in-world cheat

- (a) E27 works for one prepaid batch with trusted wall time and
  discarded pause time; E3 can drain minutes.
- (b) A general catch-up on load (last-seen wall time, cap, which
  routines run, return note), applied as one advance through the same
  host path as `advanceChroniclePlan` (`src/main.js:879-897`).
- (c) Last-seen wall time and an optional bank of stored hours.
- (d) **Medium**: wall clock is player-controlled. Per memory, anti-abuse
  beyond save safety is low priority; still reject a backwards clock
  (E27 `:82`).
- (e) Return note in the event feed.
- (f) None.
- (g) **M-L**. The rulebook's idle section proposes offline catch-up as a
  baseline, so this is both a baseline and a cheat variant (bank, no
  cap).
- (h) Patient Furnace: assign one `automatable` Village routine, close the
  tab, reopen: note says "packed 4 kits; logs ran out".
- (i) Family 20.

### 20. Automation as earned habit

- (a) E14 programs require `automatable` on the command; E32 counters.
- (b) Per-actor unlock after N manual completions (count from
  `completed`, E41 domains), bad habits, revoke.
- (c) Habit counters (can be derived from existing `completed` counts).
- (d) Low.
- (e) The routine control already in `simulation_panel`.
- (f) None.
- (g) **S-M**.
- (h) After 5 manual deliveries, "Make it a habit" appears.
- (i) None.

### 21. Loaded dice / roll override

- (a) E2 roll receipts (`rolls` with draw and outcome) and E6 tables.
- (b) Override command: names one unclaimed roll, pays a rising cost,
  keeps the original receipt, commits the replacement before display
  (RNG audit rule).
- (c) Charges and override receipts.
- (d) **Medium**: must not allow preview-then-call loops; override applies
  to a committed result, not to a preview.
- (e) A button beside the result line where the roll is shown.
- (f) None.
- (g) **M**.
- (h) A Village discovery roll comes up common; call "rare" for 3 coins;
  next call costs 6.
- (i) F1, F2.

### 22. Character switching (Hall of Selves)

- (a) E14 controllers and programs run other people; simulation commands
  take `context.actorId`.
- (b) E40 allows one controlled native body; native skills, inventory and
  stats belong to the single hero. A real switch needs a native body
  store per self.
- (c) Large: per-self native snapshots.
- (d) High: native state cannot be replayed (RNG audit).
- (e) People view.
- (f) Selves can hold different knowledge (F3 per actor).
- (g) **XL**; **L** for a living-world-only switch (commands, programs and
  knowledge of a second self, native body stays with the hero).
- (h) Living-world switch: issue simulation commands as a second self,
  see its own log; native panels stay the hero's.
- (i) Families 1g, 3.

## 3. Shared foundations that unlock many families

| ID | Foundation | Unlocks | Effort | Notes |
|---|---|---|---|---|
| F1 | **Cheat card schema and owner**: `state.cheats = {schema, cards: {id: {state, stage, receipts}}}`, validated inside E41, absent on old saves; card definitions in the registry with `family`, `grants`, `hooks`, `dials` (per-world adjectives), `ui` | All | M | Card grants ride E8 sources (provenance, faculty gate). Keep card state out of `actor.sources` (E9 tolerates extra fields but they are unvalidated). Add `cheat` to `SOURCE_KINDS` (E8 `:4`). |
| F2 | **Seeded sub-streams**: `stream(root, purpose)` derived once from a saved root, stored per purpose | 1, 2, 8, 9, 10, 21 | S-M | E10 already does this for event checks. Retain legacy `rng` for old commitments (RNG audit). |
| F3 | **Knowledge filter**: one function that renders any cheat text (reports, prophecy, advice, appraisal) from the actor's knowledge stages; truth strings only by ID | 1, 2, 6, 13, 18 | M | Pairs with the sealing proposals; tests assert no truth text pre-route. |
| F4 | **Fork-and-discard runner**: re-seed, run E3 under a policy, build a report, prove purity by state hash | 1a-1e, 2, 14 | M | E35 is the precedent; E4 needs the hash test. |
| F5 | **Decision cards**: stop at choice, show 2-4 options with costs, policy answers the rest | 1b, 1c, 3 | M | E3 already stops at choices. |
| F6 | **Hook bus**: onBoundary, onDeath (lifespan, lethal), onObserve, onGift, onCommit, onRestart dispatching card data effects | 3, 7, 8, 10, 16, 18 | L | CHEAT_LIBRARY C5. Start with onBoundary only. |
| F7 | **Restore by declared domains**: generalize E26 so loop, anchor and regression share one restore with carry dials | 3, 4 | M | E26 already names domains and counts rewinds. |
| F8 | **World dials table**: per-world adjectives for charges, periods, caps, carry | All | S | Replaces fixed limits such as E26 "Two rewinds maximum" and E16's single `origin.selected` claim. |

## 4. Proposed slice order (dependency-aware)

Value/effort ranking (value = new verb felt in play and reuse for later
families):

| Rank | Family | Value | Effort | Why here |
|---|---|---|---|---|
| 1 | F1 + F8 + Sign-in (8) | Medium | S on M | Proves the card owner, dials, migration and panel with the cheapest loop |
| 2 | Quest / status window (7) | High | M | First points economy; feeds hub (15) and stakes |
| 3 | Foreknowledge (6) | High | M | Needed by loop, prophecy and dreams |
| 4 | F2 + F4 + Forecast (1a) | High | M | First simulator; builds the runner every dream mode reuses |
| 5 | Heir rework (5) | High | M-L | Accepted direction, code pending; base for loop |
| 6 | Earned habit (20) then Patient Furnace (19) | High (idle core) | S-M then M-L | Idle loop promise |
| 7 | Draw wheel (9), Loaded dice (21), Reach (10) | Medium | M each | All ride F2 |
| 8 | F3 + Appraisal (13), Companion (18) | Medium | M each | F3 is required before any text-heavy cheat |
| 9 | F7 + Echo anchor (4), then loop (3) | High | M-L, L | Needs death policy answer (Q1) |
| 10 | Dream run (1c) then headless, spread, probe, rehearsal | High | L, then S-M | Biggest model; after F3-F5 |
| 11 | Traits (12), Copy shelf (11), Teach (17), Rebate (16) | Medium | M each | People and technique extensions |
| 12 | Prophecy (2), Fate change (14) | High | L, M-L | Need a per-world fate mechanism (Q3) |
| 13 | Hub store (15) | Medium | L | Cross-world; after points and nested hub |
| 14 | Shadow (1g), Character switching (22) | Medium | L, XL | Need selves; native multi-body |

Slice sequence (each ends at a fresh-origin browser check with save, reload
and import when state changes, per AGENTS.md):

1. **P1** F1 + F8 + sign-in at the Village notice board.
2. **P2** Quest card with deadline and penalty; points ledger.
3. **P3** Foreknowledge basis kind; cartographer line goes stale.
4. **P4** F2 + F4 + forecast "read the coming week".
5. **P5** Heir inherits stock, notes and people (needs Weibao's go per C2).
6. **P6** Earned habit; then offline return note.
7. **P7** Wheel with doubling cost and pity; loaded dice on a discovery roll.
8. **P8** F3 + appraisal of the craftsman; companion spirit voice.
9. **P9** F7 + echo anchor in the yard; then death-menu regression.
10. **P10** Dream of the coming year (F5), then spread and probe.

Later slices (traits, copy shelf, teach, rebate, prophecy, fate change, hub,
shadow, switching) stay reachable and follow when their inputs exist. None
is dropped.

## 5. Open questions

- **Q1** Which deaths can trigger a loop or regression in the home world?
  PROJECT keeps native defeat as unconsciousness; true death and rewind are
  proposals. Options: lifespan end only, authored lethal events (E19), a
  voluntary trigger, or a per-world dial covering all three.
- **Q2** Whole-save regression versus expansion-only: is native inventory
  and skill rollback wanted (XL), or does the loop restore the
  living-world layer and carry native state by dials?
- **Q3** The per-world fate mechanism for the home world (rulebook "Fate"
  section): what does it protect and how is it read? Prophecy, fate
  appraisal and fate-change rewards depend on it.
- **Q4** Does the first-milestone "one prestige layer" mean heir, loop or
  rebirth ledger? It decides whether P5 or P9 is the milestone's prestige
  slice.
- **Q5** Offline catch-up as baseline (rulebook idle table) versus only as a
  cheat: build the baseline first, with the cheat changing cap and bank?
- **Q6** Should the existing `origin.selected` single claim (E16) become a
  per-world dial, since origin cheats and repeated rebirth conflict with a
  once-per-save claim?
