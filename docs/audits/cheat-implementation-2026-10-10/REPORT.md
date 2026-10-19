# Cheat implementation audit

*2026-10-10, Claude Code, at Weibao's request ("Send out a comprehensive
Cheat implementation audit"). Four parallel auditors plus synthesis.
Findings and proposals are not accepted decisions and do not authorize
building anything. No source code was changed; auditor D ran scratch
tests outside the repo.*

| Reader | Scope | File |
|---|---|---|
| A | What exists in code, with file:line | [A_code_primitives.md](readers/A_code_primitives.md) |
| B | Every cheat idea across the docs, status, duplicates, contradictions | [B_doc_catalog.md](readers/B_doc_catalog.md) |
| C | Feasibility, effort and smallest slice for 22 families | [C_feasibility.md](readers/C_feasibility.md) |
| D | Purity and determinism tests, test baseline, risks | [D_risk_and_purity.md](readers/D_risk_and_purity.md) |

Labels follow the readers: shown means read in code, run, or cited with a
locator; inferred means interpretation.

## Bottom line

> **Update 2026-10-19 (historical report, wording below kept):** two findings
> are superseded. Cheat code now exists (`src/cheat_cards.js`, with
> `tests/cheat_cards.test.js`, `tests/cheat_awakening.test.js`,
> `tests/cheat_status_window.test.js`), and `buildLifeHeirSave` is imported at
> `src/main.js:457` and called at `src/main.js:2763`. The test baseline and
> source locators below are also out of date. Current cheat status lives in
> [CHEAT_LIBRARY](../../CHEAT_LIBRARY.md).

- **No cheat is implemented** (shown, B). Everything is Weibao's direction
  plus agent proposals; none is accepted in PROJECT.md.
- **The engine is a better base than the docs assume** (shown, A, C). The
  living-world layer returns new state on seeded streams, and already has
  pity counters on events, separate seeded event streams, an evolution
  graph, power copy, transfer, fragment and fusion effects, awakenable and
  suppressible faculties, claimable daily windows, a working local time
  loop (the bell yard) and a forward peek at the future on every commit.
- **The simulator foundation is proven pure where it could be tested**
  (shown, D). `advanceSimulation` did not change its inputs and gave
  identical results on repeat, across fresh, pending, enrolled and 64-helper
  saves, with inputs deep-frozen. Five owners that receive the original
  state could not be enrolled in Node, so their purity is still unproven.
- **True prediction is real** (shown, D). A fork that keeps the real seeds
  replays the real future exactly; reseeding only `state.rng` is not
  enough. That is the foresight Weibao asked for, and it means "guess"
  simulators must reseed every stream.
- **Simulation cost limits the horizon** (shown, D). One call stops at 512
  game minutes in an enrolled save (a controller fires every minute),
  costing about 0.8 s idle and 33 s with 64 helpers on the main thread. No
  web worker exists. Hours to days are cheap; years need a story model, a
  coarser clock, idle-controller skipping or a worker.
- **Test baseline:** `npm test` passes 279 of 279 (shown, D).

## Findings

**F1 Built but unreachable** (shown, A, D). The heir builder
(`buildLifeHeirSave`) and scenario rewind have no caller in `src/main.js`;
only tests use them. The heir button stays hidden, and the heir still
gets "fresh body, one lesson", while PROJECT.md's accepted direction is
"inherit what the previous life left behind" (code change pending).

**F2 Cheat-shaped pieces already in code** (shown, A, C).

| Piece | Where | Serves |
|---|---|---|
| Fork-and-discard future run on commit | `src/main.js:634` | Simulator, forecast |
| `advanceSimulation` with `stoppedAtChoice`, 512 cap | `src/expansion_engine.js:582-631` | Dream runs, decision cards |
| Scenario checkpoints and rewind with retained domains | `src/expansion_engine.js:661-675` | Loops, anchors |
| Bell-yard time loop, rewinds counted in save | `src/backlog_expansion_time.js:175` | Loop with carry dials |
| Wall-clock offline batch | `src/backlog_expansion_time.js:43-86` | Offline cheat |
| Pity on event checks (`guaranteeAfter`) | `src/simulation.js:492` | Draw wheels |
| Separate seeded streams per event check | `src/simulation.js:64` | Seeded sub-streams |
| Branching evolution graph | `src/simulation.js:330` | Trait evolution |
| Power copy, transfer, fusion effects | `src/simulation_effects.js:279` | Copy shelf, teach |
| Injectable random in combat math | `src/combat_math.js:34` | Rehearsals |
| Preview token on commit | `src/causal_story_host.js:293` | No stale simulator results |

**F3 Missing pieces** (shown, A, C, D). A cheat owner and save field; a
knowledge filter for any cheat text; offline catch-up in ordinary play;
negative grants (curses), since capability grants must be positive;
pity on roll tables (only on events); save and restore of random streams;
a full-state snapshot; death triggers; sign-in streaks; any status window
or quest owner; a cheat currency store; more than one controllable body;
web workers.

**F4 Save risk** (shown, D). The expansion validator silently accepts
unknown top-level fields, so an older build would load a cheat save and
drop or ignore its data. The project's own pattern for optional owners is
stricter (closed key set, refuse orphaned receipts). Migrations cover
schemas 1 to 4; later schemas are admitted by allow-list. An unenrolled
save must stay on schema 5; opening a cheat must be what bumps it.

**F5 Reload and determinism risks** (shown, D). 62 native `Math.random`
calls (18 in `main.js`) cannot be simulated or locked, so cheats over
combat, shops and crafting can only estimate. A loop that keeps the
stream replays the same dice; one that rerolls each loop becomes a reroll
exploit unless the world calls that a feature.

**F6 Sealed-secret leak paths** (shown, D). Simulator forks can reach a
discovery before the player does. Error and reason strings, 117
`console.*` calls in `main.js`, history labels, chronicle notes, the life
record and the event feed all surface text. No sealed files exist yet.

**F7 Doc duplicates and contradictions** (shown, B). Regression, simple
cheats, Celestial Forge, fate and abuse each appear in three to nine docs.
Ten contradictions; the main ones:
- Fixed "once" rules remain in LIFE_SIM_NORTH_STAR (first-clear rewards),
  RIVALS and the JJK brief, against the no-"once" direction; code has
  two (bell-yard "two rewinds maximum", a once-per-save origin claim).
- CHEAT_COSMOLOGY says knowledge "always travels" in one table and needs a
  carrier elsewhere; rule 5 says carrier.
- "Every power has a cost" checks versus Weibao's pure cheats with no
  price.
- Two raised against this session's own docs were fixed the same day:
  foresight grades no longer certify themselves (rule 6), and the
  chain-breaking power list is a review prompt, not a ban (rule 11).
- The cheat card has no sealed-truth field.

**F8 Three competing first slices** (shown, B). Death-menu regression
(cheat library), dream of the coming year (simulators), late-waking cheat
(fan fiction pilot). None is authorized.

## Shared foundations (proposal, from C)

| ID | Foundation | Unlocks |
|---|---|---|
| SF1 | Cheat card schema and owner (`state.cheats`), closed keys, absent on old saves, opt-in schema bump | All |
| SF2 | Seeded sub-streams per purpose, legacy stream kept | Simulators, draws, loaded dice, reach |
| SF3 | Knowledge filter: all cheat text rendered from knowledge stages; truths by ID only | Simulators, prophecy, appraisal, companion |
| SF4 | Fork-and-discard runner with reseed, policy, report and purity hash | All simulator modes, prophecy, fate change |
| SF5 | Decision cards on `stoppedAtChoice` | Dream runs, probes, loops |
| SF6 | Hook bus (start with the day boundary) | Sign-in, quests, reach, rebate, companion |
| SF7 | One restore-by-declared-domains routine | Loops, anchors, regression |
| SF8 | World dials table (charges, periods, caps, carry) | All; replaces fixed limits |

## Proposed build order (C, adjusted)

Each step ends with a fresh-origin browser check, plus save, reload and
import when state changes (AGENTS.md).

1. SF1 + SF8 + sign-in at the Village notice board (cheapest proof of the
   owner, dials, migration and panel).
2. Quest card with deadline and penalty; points ledger.
3. Foreknowledge that goes stale.
4. SF2 + SF4 + forecast "read the coming week".
5. Heir rework: inherit what was left (needs Weibao's go: gameplay change).
6. Earned habit, then offline return note.
7. Draw wheel with doubling cost and pity; loaded dice; reach accumulator.
8. SF3 + appraisal; companion spirit.
9. SF7 + echo anchor; then death-menu regression.
10. Dream of the coming year, then spread and probe.

Later: traits with curses, copy shelf, teach, rebate, prophecy, fate
change, hub store, shadow, character switching. None is dropped.

## Guardrail tests for any cheat slice (from D)

1. Fork purity with deep-frozen inputs, including the five unproven owners
   once a Node fixture can enroll them (building that fixture is a
   prerequisite).
2. Real save untouched: no writes; `rng`, `simulation.seed`,
   `checks[*].rng` and `sequence` unchanged.
3. Seed separation: forks with different nonces diverge; probing does not
   consume real draws.
4. Save compatibility: vanilla and schema-5 saves unchanged; cheat saves
   round-trip exactly; orphaned receipts rejected; older readers refuse or
   tolerate by explicit decision.
5. Sealed text: reports, labels, errors and panels show secret IDs, not
   truths, until discovery.

Next tier: time budget per simulator call (yield or worker), reload-reroll
tests for estimate cheats, heir and loop carry tests.

## Actions (proposals; none authorizes code)

- **A1 Docs fixes.** Recast fixed "once" rules as adjectives (north star,
  RIVALS, JJK canon defaults kept as book facts); fix the cosmology
  knowledge row to rule 5; add a sealed-truth field and accuracy dial to
  the cheat card; mark RUN_DEFINING_ADVANTAGES as superseded on
  acquisition by the cheat library.
- **A2 Owner consolidation.** Cheat library owns families and cards; move
  the north star's five cheat sections there as links.
- **A3 Node fixture** that can enroll every owner, so purity and carry
  tests cover all of them.
- **A4 Build slice 1** when Weibao picks a first slice.
- **A5 Heir rework** when Weibao gives the go (accepted direction, pending
  code).

## Keeping it open for improvement (proposal, 2026-10-10)

Weibao: "Keep things open for improvement in the future." Build every
slice so a later, better version can replace it without breaking saves or
rewriting neighbors. Design rules for the code:

- **O1 Versioned cards.** Each cheat card and its saved state carry a
  schema version and a migration, like the expansion owners. A card can
  gain stages, fields or hooks later; old saves upgrade additively.
- **O2 Data first, code second.** Families are engine primitives; a new
  cheat is data (grants, hooks, dials, text) wherever possible, so adding
  or tuning one never needs a new module.
- **O3 Swappable engines behind one interface.** Simulators call one
  runner with a request and get one report shape (SIMULATORS doc). Today
  it may use the story model for long horizons; later the forked engine
  can take over as it gets faster (worker, skipping idle controllers)
  without changing any cheat that uses it.
- **O4 Dials, not constants.** Every limit lives in the world dials table
  (SF8). Rebalancing or adding a world never edits cheat code.
- **O5 Seeds and receipts kept.** Saving the seed, state version and
  inputs with every report and commit means a later, better simulator can
  re-run or explain old results, and divergence tracking keeps working.
- **O6 Knowledge filter at one choke point.** All cheat text goes through
  SF3, so better discovery rules, translations or presentation upgrades
  touch one place.
- **O7 Reserved hooks, unused is fine.** The hook bus names hooks no card
  uses yet (death, observe, gift, travel, restart), so future families
  attach without engine changes.
- **O8 Upgrade, don't replace, in saves.** A better version of a cheat
  (higher grade, new stage) appears as an upgrade path for an existing
  card, not a second card, so players keep history.
- **O9 Feature switches.** Each family can be turned off per save or per
  build without breaking loading, so a weak first version can be pulled
  while a better one is built.
- **O10 Tests as the contract.** The guardrail tests (purity, save
  untouched, seed separation, compatibility, sealed text) define the
  behavior; any rewrite that passes them is safe to ship.
- **O11 Docs stay palettes.** Proposals remain options with dated
  sources; accepted decisions live only in PROJECT.md, so later
  improvements do not fight stale "rules".

In the game, cheats can improve too:

- **O12 Cheats that grow.** Stages, grades and evolution graphs (already
  in the engine) let a cheat start crude and sharpen: a guess simulator
  becomes a forecast, then a projection.
- **O13 Skill-backed improvement.** Ordinary skills raise a cheat's
  accuracy or reach (Literacy for prophecy reading, Meditation for
  dreams), so improvement is also a life-sim path.
- **O14 Research the cheat.** A lab action on your own cheat reveals its
  rules and unlocks better uses (rational-fiction F18 lesson).
- **O15 Trade, teach and inherit upgrades.** An heir, apprentice or rival
  can receive a better version than you had, so improvement spans lives.

## More to consider (expanded, 2026-10-10)

- **MC1 First versions are honest prototypes.** Ship a small, clearly
  labeled version; keep a per-family "known limits" note in the cheat
  library so the next pass knows what to improve.
- **MC2 Improvement backlog per family.** Each family's card lists its
  next upgrades (grade, horizon, keeps, UI) as a backlog rather than a
  spec.
- **MC3 Performance headroom.** Plan a worker or time-sliced runner before
  long simulations ship; measure with the audit D scripts so improvements
  are visible.
- **MC4 Native seeding later.** When native combat, shops and crafting
  move to seeded streams (RNG audit), simulators gain those systems
  automatically; design reports to show fog that can later turn clear.
- **MC5 Shared fixtures.** One Node fixture that enrolls every owner
  makes all future cheat tests cheaper (action A3).
- **MC6 Cheat interactions.** Two cheats on one life (a simulator plus a
  loop) need a stacking rule per pair; start with "the world decides" and
  record each pair as it comes up.
- **MC7 NPC cheats on the same engine.** Rivals use the same cards and
  runner, so every improvement to the player's cheat also improves
  enemies with cheats.
- **MC8 Accessibility of text-heavy cheats.** Reports, prophecies and
  status windows should stay readable on mobile and in plain text;
  presentation upgrades come later.
- **MC9 Sealed content growth.** As sealed files appear, a small check
  (a test that no truth string appears in UI text before discovery) keeps
  later content safe without manual review.
- **MC10 Export and share.** Reports, dreams and prophecies can be
  exported as text; a later version could import them as lore or as
  another run's foreknowledge.
- **MC11 Retire gracefully.** If a family is replaced, old saves keep a
  read-only record of what it did; nothing silently disappears.
- **MC12 Weibao's play as the gate.** Each improvement still ends at a
  playable checkpoint he can try; tests prove safety, play proves fun.

## Choices that need Weibao

Most open questions resolve under standing directions ("anything is
possible", per-world adjectives): loop triggers, whole-save versus
living-world loops, fate per world and offline baseline all become world
dials with the home world kept as it is today. Two things only he can do:

- **Which first slice to build.** The audit's cheapest proof is slice 1
  (sign-in). The other candidates are the dream run, the late-waking cheat
  and death-menu regression.
- **The heir rework.** It changes current gameplay ("inherit what was
  left"), which needs his go.
