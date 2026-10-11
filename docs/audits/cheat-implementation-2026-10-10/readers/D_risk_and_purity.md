# Reader D: risk and purity audit for cheat implementation

*Auditor D, Claude Code, 2026-10-10. Findings, not accepted decisions.
Run against the working tree on branch `codex/gameplay-foundations`
(HEAD `64c3cec2` plus uncommitted edits under `src/`), Node v26.4.0. No
project file other than this one was edited. Scratch scripts live outside
the repo. Labels: **SHOWN** (file:line or command output) or **INFERRED**.*

Scratch directory (session scratchpad, not in git):
`/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/386897be-4772-47e7-93a9-3e5232147290/scratchpad/audit_d/`

| Script | Purpose |
|---|---|
| `purity.mjs` | Purity, determinism, frozen-input, preview, rewind and reseed probes (scenarios A to F) |
| `purity_full_stdout.txt` | Full output of the last `node purity.mjs` run |
| `timing.mjs` | Cost of one 512-boundary call on small enrolled states |
| `boundary.mjs` | Which boundary source fires every minute |
| `unknown_keys.mjs` | Whether the validator accepts new cheat-shaped save fields |
| `npm_test.log` | `npm test` baseline output |

## 1. Purity and determinism

### Method

For each scenario, `purity.mjs`:

1. Canonically hashes (sorted keys, SHA-256) the full input bundle:
   `state`, `external`, `gameplay`, `simulationContexts`.
2. Calls `advanceSimulation` on a `structuredClone` of the inputs, then
   rehashes the clone. A changed hash means the input was mutated.
3. Calls it again on a second clone. Equal output hashes mean the call is
   deterministic. The output hash covers `state`, `external`, `gameplay`,
   `acquisitions`, `unlocks`, `remaining`, `stoppedAtChoice` and
   `budgetExhausted`.
4. Calls it a third time on a **deep-frozen** clone. ES modules run in
   strict mode, so any write to the frozen input throws. That includes a
   write that puts back the same value, which a hash cannot see. The
   output must match step 2.

The setups come from the existing tests:

- `tests/simulation.test.js:18` (`begin`, `enrollSimulation` on `initializeExpedition(createExpansionState(17))`)
- `tests/simulation_extensions.test.js:97-98` (two `village.hire_helper` with workbench knowledge)
- `tests/expansion_engine.test.js:10-15,145-155` (fresh state, `frontier.inspect`, the scenario checkpoint fixture)
- `scripts/scheduler_profile.mjs` (64 helpers on the generated Codex proof save `~/.codex/visualizations/.../promise-delivery-proof/generated-help-save.json`; generated, not a private save)

Command: `node purity.mjs` (run from the scratch dir; imports are absolute).

### Results (SHOWN, `purity_full_stdout.txt`)

| Scenario | Durations (min) | Input mutated | Deterministic | Frozen run |
|---|---|---|---|---|
| A fresh, not enrolled | 0, 1, 60, 1440 | no | yes | ok, same output |
| A `frontier.inspect` pending | 1, 3, 60 | no | yes | ok, same output |
| B enrolled simulation, idle | 1, 60, 1440 | no | yes | ok, same output |
| B enrolled, 2 hired helpers | 1, 10, 60, 1440, 100000 | no | yes | ok, same output |
| C proof save, 64 helpers | 1, 12, 1440, 10000 | no | yes | ok, same output |

Sample line:
`B enrolled-helpers m=1440: inputHash=6f588f64f2185473 afterPlainCall=6f588f64f2185473 mutated=false | out1=cf5790b1741de41b out2=cf5790b1741de41b deterministic=true | frozenRun=ok ... budgetExhausted=true`

Other pure functions tested on deep-frozen state (SHOWN):

- `previewSimulationCommand(state, registry, "village.hire_helper", ctx)`: ok, hash unchanged.
- `previewScenarioRewind`: ok, unchanged, `lost.relic=1`, retained `campaign,journey,actors,worlds,random stream,receipts`.
- `rewindScenario` with frozen input: ok, input unchanged, `rng` kept, sequence 1 to 2.
- `evaluateAction`: ok, unchanged.

### Coverage gap (SHOWN plus INFERRED)

The helpers that receive the original `state` (`src/expansion_engine.js:608-616`) are:

- `advanceAuditRemainder` (`src/audit_remainder_runtime.js:21`)
- `reconcileLorePractice` (`src/lore_practice_runtime.js:194`)
- `reconcileCausalStoryPlan` (`src/causal_story_host.js:413`)
- `reconcileBookCareRuntime` (`src/book_care_runtime.js:30`)
- `reconcileParadiseCampaignDepthRuntime` (`src/book_world_paradise_campaign_runtime.js:27`)

Each one returns early unless its owner is enrolled (`auditRemainder`,
`causalStories`, book care, Paradise). None of scenarios A to C enrolls
those owners, so the frozen test **did not exercise the paths in
question**.

Scenario D tried to enroll causal stories through
`previewCausalStoryCommand(..., "causal.story.enroll")`. It came back
`eligible=false` with these reasons: "The current native body and owners
are unavailable.", "This work needs your current living mobile human body
and both hands.", "The current Village is unavailable." Those frames
(`causalStoryNative`, native body) are built only in `src/main.js:509-520`
from live DOM-era globals. `auditRemainder` needs `referenceGameplay`
enrollment first (`src/audit_remainder_state.js:43-47`). No test in
`tests/` enrolls any of these owners. A grep for causal, remainder, mol,
paradise and tidemark finds only incidental mentions in three test files.

A static read of the five helper bodies found reads of `before`
(`before.clock`, `before.sequence`, `before.actors...completed`,
`before.simulation?.jobs`, enrolled checks) and writes only to
`out.state` / `plan.state`. **INFERRED**: pure for those owners too, but
not proven. The nested calls (`advanceRemainderOffers(before, ...)`,
`advanceRemainderCombatObjectives(before, ...)`) were not traced in full.

Supporting evidence (SHOWN): the live game already treats
`advanceSimulation` as a discard-only preview. `src/main.js:634` runs
`future = advanceSimulation(plan.state, ...)` until the commitment is due,
only to validate the native publication, and then throws `future` away.

### Seeds for a forked simulator (SHOWN, scenario F)

- Changing only `state.rng` on an enrolled state and advancing 1440
  minutes gave an **identical** non-rng state. The living world draws
  from its own streams: `simulation.seed` and every
  `simulation.checks[id].rng`. Those are derived at enrollment as
  `hash(s.seed, d.id)` (`src/simulation.js:33,64,174-178`).
- After reseeding all three (`state.rng`, `simulation.seed` and each
  `checks[*].rng`), the outcomes diverged within 20x512 boundaries
  (`non-seed state equal=false`).
- So a "spread" or "dream" fork must reseed every stream. Otherwise each
  "different" run replays the real future exactly.

## 2. Test suite baseline (SHOWN)

`npm test` (= `node --test tests/*.test.js`), 2026-10-10, dirty working tree:

```
ℹ tests 279
ℹ pass 279
ℹ fail 0
ℹ duration_ms 5936.46
```

Nothing was fixed or changed.

## 3. Save and migration risks

| ID | Finding | Label |
|---|---|---|
| R1 | **The validator silently accepts unknown fields.** `loadExpansionState` accepted top-level `state.cheats`, `simulation.cheats`, the player fact `cheat.foo`, the campaign resource `cheat.points` and a new scenario `sim.fork`. It rejected an unregistered actor source (`Unsupported saved source: cheat.sim`) and schema 12. An older build would therefore load a cheat-bearing save, carry the field through `clone`, and enforce none of its rules. | SHOWN `unknown_keys.mjs` |
| R2 | The project's own pattern for optional owners is stricter than R1. An owner has a schema, a closed key set and a missing-reader guard. For example, `validateAuditRemainder` rejects extra keys and refuses saves whose receipt exists without the owner ("Preserve this save for its matching reader"), and engine schema 11 requires a real owner (`src/audit_remainder_state.js:53-70`, `src/expansion_engine.js:137`). A cheat owner should copy this pattern rather than rely on R1. | SHOWN |
| R3 | The migration path only covers schemas 1 to 4, through additive `??=` defaults (`src/expansion_engine.js:253-264`). Schemas 5 to 11 are admitted as-is by an allow-list (`:134`). Adding a cheat owner means a new admitted schema (or owner gate) **and** an explicit decision on whether older readers should refuse the save (AGENTS.md: "a migration or an explicit compatibility decision"). | SHOWN |
| R4 | `persistExpansionPlan` writes the whole envelope once, after `validateExpansionState` (`src/expansion_persistence.js:7-50`). A failed load sets `foundationSaveBlocked` (`src/main.js:6440-6443`), and only the tab holding the save lock writes (`:486-495`). Cheat state written through this path inherits atomicity. A simulator must **never** route its fork through `persistExpansion`. | SHOWN |
| R5 | Fork snapshots stored in the save would grow localStorage. A small enrolled state is about 5.5 to 10 KB (`timing.mjs` `saveBytes`). `state.history` is capped at 100 (`:206,525`), but `checkpoints` has no cap. Store loop checkpoints as scenario-domain snapshots (already validated, `:242-246`) or a capped ring. Never store whole forked states. | SHOWN sizes / INFERRED risk |
| R6 | `rewindScenario` restores only one `scenarios[id]` domain. It keeps campaign, journey, actors, worlds and `rng`, and bumps `sequence` (`src/expansion_engine.js:661-675`). A full-life loop cheat needs a new mechanism, and that mechanism touches every owner's validator (35+ validators in `validateExpansionState`, `:139-200`). | SHOWN |

## 4. Reload-exploit risks for cheats

Rule 9 (`docs/RULES_FROM_SCRATCH.md:195`): save integrity and reload
exploits get fixed.

| ID | Risk | Label |
|---|---|---|
| R7 | **Oracle by determinism.** Same input gives the same output (section 1). If a probe or forecast fork keeps the real seeds, it predicts the real future exactly, including `outcomes` draws in `commitSimulationCommand` (`src/simulation.js:174-178`). That turns a "lossy" simulator into perfect foresight, which conflicts with rule 6 ("readings can be wrong"). Fix: derive fork seeds from (real seed, fork nonce) and never write them back. | SHOWN determinism / INFERRED impact |
| R8 | **Native `Math.random` sites cannot be simulated or locked.** Counts under `src/`: main.js 18, models/location.js 13, particles.js 12, enemies.js 7, models/combat.js 4, components/trader_component.js 3, display.js 2, combat_math.js 2 (injectable default), misc.js 1 (`random_range`). Per `docs/RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md:24-29`, shop stock rerolls when trade opens, and gather, craft and combat roll natively. Autosave runs every `save_period=60` native ticks (`src/main.js:1318,7017`). A "rehearse the fight / preview the craft" cheat plus a reload lets the player reroll after seeing the estimate. | SHOWN counts / INFERRED exploit |
| R9 | `combat_math.js:34,44` accepts a `random` argument, so rehearsals can run on a seeded stream. The live fight still uses `Math.random`, so a rehearsal can only estimate. Keep rehearsal seeds separate from any persisted stream. | SHOWN |
| R10 | `rewindScenario` keeps the random stream on purpose ("Never restore the command sequence or random stream", `:673`). A loop cheat that restores `rng` replays the exact same dice, which fits a time-loop premise. One that does not restore it rerolls on every loop, which makes loop-and-reroll a reload exploit with extra steps. That choice is a per-cheat adjective and must be explicit. | SHOWN / INFERRED |
| R11 | Preview-then-commit token pattern: `commitCausalStoryCommand` checks `expectedSequence`, `command.sequence` and a preview `token` (`src/causal_story_host.js:293-297`). Cheat commits should reuse this so a stale simulator result cannot be committed after state changed. | SHOWN |

## 5. Sealed-secret leak paths

Rule: AGENTS.md "Sealed secrets"; engine proposals at
`docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md:128-134`. No `sealed` files or
directories exist yet under `docs/worlds` or `src` (SHOWN, `find`).

| ID | Path | Label |
|---|---|---|
| R12 | **Simulator output is a new discovery route.** A forked run can reach a discovery event, a knowledge stage (`simulation.knowledge[*].value` holds free text, for example `workbench.value`) or a history label before the real player does. A dream log or forecast that prints fork text reveals truths outside their route. Report fork results by ID and stage, filtered by the **real** state's knowledge, or render the truth only as a clue. | INFERRED |
| R13 | Error and reason strings reach the UI. `log_message(\`Progress paused: ${error.message}\`)` and `console.error` run in the clock path (`src/main.js:842`). There are 117 `console.*` calls in main.js. Preview `reasons` arrays are shown as text (for example the scenario D reasons). Validator and `check()` messages must name IDs, never truths. | SHOWN |
| R14 | Persisted text such as `history[].label`, chronicle notes (`src/chronicle.js:278`), `life_record` milestones and the event feed (`src/event_feed_ui.js:16`, rendered from live state) shows up in UI and exported saves. If a simulator ever writes a fork summary into real state, all of these surface it. | SHOWN paths / INFERRED risk |
| R15 | `dist/bundle.js` and the public repo contain all non-private content (stated as accepted in the secrets doc). Not a cheat-specific risk. | SHOWN (doc) |

## 6. Performance

| ID | Finding | Label |
|---|---|---|
| R16 | **The 512-boundary cap is about 512 game minutes in any enrolled state.** `village.craftsman_controller` has `interval: 1` (`src/simulation_content.js:101`), so `nextSimulationBoundary` fires every minute (`boundary.mjs`: clock 5, next 6). B with a 1440-minute request stopped at 512 with `remaining=928, budgetExhausted=true`. | SHOWN |
| R17 | Measured cost per capped call (512 minutes), main thread, Node, while another probe was running: enrolled idle **783 ms**, 2 helpers **2.17 s**, 64-helper proof save **33 s** (`C single 10000-minute call: 33065.2 ms`). `validateExpansionState` x1000 = 124 ms and `structuredClone(state)` x1000 = 62 ms on the small state, so per-boundary simulation work dominates. | SHOWN |
| R18 | Extrapolation: a one-year forecast is about 525,600 boundaries, roughly 13 minutes of CPU even for the idle enrolled state. A multi-run "spread" multiplies that. The S2 forked engine is usable only for hours-to-days horizons. Years need the S1 story model, a coarser clock or a skip-ahead for no-op controllers. | INFERRED |
| R19 | There is no Web Worker use in `src/` (grep `new Worker` finds nothing). The live game already drains `budgetExhausted` in a synchronous `while` on the main thread (`src/main.js:881-897`), and every commit with a pending commitment runs a forward `advanceSimulation` (`:634`). A simulator on the main thread would freeze the UI. The engine modules are DOM-free ES modules (they run under Node), which makes them **INFERRED** worker-portable. `registry` must be built inside the worker, because it holds `Map`s and functions. | SHOWN / INFERRED |

## 7. Vanilla preservation

| ID | Constraint | Label |
|---|---|---|
| R20 | Rule 8 and PROJECT.md "Vanilla stays intact": opening, quests, stats, professions and center-menu play keep working. New content is opt-in and extends existing panels, with no separate windows (`PROJECT.md:26-31`, `docs/RULES_FROM_SCRATCH.md:191-194`). Cheats must be opt-in, absent from a vanilla save, and rendered inside existing panels (for example the chronicle or notebook). | SHOWN |
| R21 | A cheat that changes native outcomes (combat, shop, craft) has to touch `Math.random` sites in upstream-derived files (`src/models/combat.js`, `src/components/trader_component.js`, `src/main.js`). Prefer adapters and injected randomness (the `combat_math.js` pattern) over edits to upstream logic, and keep upstream attribution and LICENSE (AGENTS.md "Safety"). | SHOWN / INFERRED |
| R22 | An unenrolled save must stay on schema 5 ("Unsupported saves keep5", `src/expansion_engine.js:56`). Opening a cheat must be the act that bumps schema, never loading or rendering. | SHOWN |

## 8. Heir pipeline as a base for loop and regression cheats

- **Pure (SHOWN).** `buildLifeHeirSave(previous, fresh)`
  (`src/life_experience_host.js:8-27`) requires an ended chronicle and
  validates it. It clones the fresh envelope and builds a **new** expansion
  state with `initializeExpedition(createExpansionState(previous.expansion.rng))`.
  It carries over `npc_lives`, `options` and `life_record`, and gives the
  heir a chronicle with one lesson (`src/chronicle.js:273-281`). The test
  asserts `previous` is unchanged (`tests/life_experience_b.test.js:38`).
- **Not wired (SHOWN).** It is not called anywhere in `src/main.js`, and
  `dist/bundle.js` has 0 matches. `createChroniclePanel` gets no
  `beginHeir` (`src/main.js:7629-7636`), so the heir button stays hidden
  (`src/chronicle_ui.js:120`). This matches PROJECT.md "Heirs inherit what
  the previous life left behind (code change pending)".
- **Carry is narrow (SHOWN).** Everything else in the expansion state
  resets to `simulation: null`, including people, knowledge, sources,
  techniques, worlds and every optional owner. A loop or regression cheat
  built on it needs explicit carry dials per owner. Each carried field
  must pass its owner's validator in a fresh state that has no matching
  enrollment receipt (see R2: some validators refuse orphaned receipts).
- **Seed continuity (SHOWN / INFERRED).** The heir's `rng` is the dead
  life's final `rng`, and `simulation` is re-enrolled with a fresh
  `seed`. A regression cheat that wants the same world dice must carry
  `simulation.seed` and the checks explicitly (see section 1, F).

## 9. Recommended guardrail tests for any cheat slice

Ranked by importance. Codes are reused from the sections above.

1. **Fork purity (R7, section 1).** For each enrolled owner the cheat
   touches, deep-freeze `state`, `external`, `gameplay` and the contexts,
   run the simulator, and assert no throw, equal input hashes, and output
   equal to an unfrozen run. Include causal stories, audit remainder, lore
   practice, book care and Paradise once a node fixture can enroll them.
   Building that fixture is a prerequisite: today no test can enroll them.
2. **Real save untouched.** Hash the persisted envelope (or a
   `persistExpansionPlan` spy with fake storage) before and after a full
   simulator session. Assert zero writes, and that `rng`,
   `simulation.seed`, `checks[*].rng` and `sequence` are unchanged.
3. **Seed separation.** Two forks with different nonces diverge. A fork
   with the real seeds does not reach the player unless the cheat's
   accuracy adjective allows it. Committing after a probe gives the same
   outcome as committing without one (no stream consumption).
4. **Save compatibility.** A vanilla or schema-5 save loads, saves and
   reloads byte-equivalent with the cheat code present. A cheat-enrolled
   save is refused, or explicitly tolerated, by the previous reader as
   decided. A save, reload and import round trip keeps cheat state exact.
   Orphaned cheat receipts are rejected.
5. **Sealed text.** Run a simulator into a fixture secret's discovery. Assert
   that the returned report, `history` labels, error messages and the
   rendered panel text contain the secret ID but not its truth string, until
   the real state reaches that stage.

Next tier: a budget test (one simulator call stays under N boundaries and
yields or moves to a worker, and the UI thread is never blocked over a
threshold), reload-reroll tests for any native-estimate cheat (open, see
the estimate, reload, and confirm the estimate is unchanged or the
exploit is accepted by name), and a heir/loop carry test (each carried
owner validates in the new life, and nothing uncarried leaks).
