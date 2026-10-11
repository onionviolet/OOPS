# Reader A: code primitives cheats can build on

Auditor A, 2026-10-10. Read-only pass over `src/` on branch `codex/gameplay-foundations` (working tree, uncommitted edits included). The game was not run.

Labels: **SHOWN** means I read the cited code. **INFERRED** means reasoning from the cited code that I did not exercise. "Cheat families" use these short names: Simulator, Loop (time loop / rewind), Regression (rewind on death), Sign-in, Gacha, Pity, Copy (copy/plunder/absorb), Trait (trait/talent entries), Status (status window / appraisal), Hub store, Quest (System tasks), Foreknowledge, Heir, Grinder (idle/auto practice), Carryover (cross-world or cross-life retention).

## 1. Summary table

| # | Primitive | Where | Pure? | RNG | Persisted in | UI today | Cheat families |
|---|---|---|---|---|---|---|---|
| P1 | Content registry (actions, rollTables, sources, capabilities, techniques, simulation) | `src/expansion_engine.js:297-356` | Yes, deep-frozen copies | n/a | Not saved (content) | n/a | All (definition layer) |
| P2 | `evaluateAction` preview | `src/expansion_engine.js:414-480` | Yes | none (odds only) | n/a | Expedition/field panels | Status, Simulator, Foreknowledge |
| P3 | `commitAction` with frozen outcome and roll tables | `src/expansion_engine.js:530-580` | Yes (clones) | engine `state.rng` | `expansion.pending`, `history` | Expedition panels | Gacha, Sign-in, Quest |
| P4 | Odds modifiers (probability transfers) | `src/expansion_engine.js:375-385`, `:472-478` | Yes | n/a | n/a | `contributors` in preview | Luck, Pity (partial), Gacha |
| P5 | `advanceSimulation` common clock, `stoppedAtChoice`, 512-boundary cap | `src/expansion_engine.js:582-631` | Yes on its inputs (clones) | consumes seeded streams | returns next state | Clock tick | Simulator, Foreknowledge, Grinder |
| P6 | Scenario checkpoints and rewind | `src/expansion_engine.js:652-675` | Yes | stream retained | `expansion.checkpoints` | **None** (no src caller) | Loop, Regression |
| P7 | Capability sources + `queryCapabilities` | `src/capabilities.js:41-69`, engine `:495-502` | Yes | none | `actors.*.sources` | Character bio | Trait, Status, Carryover |
| P8 | Techniques observe/understand/own/practice | `src/techniques.js:99-179`, `src/technique_content.js:7-63` | Mutates the passed actor; engine passes clones | practice draw stored | `actors.*.techniques` | Technique panel | Copy, Grinder, Trait |
| P9 | Simulation commands, controllers, programs | `src/simulation.js:144-230`, `:505-537`, `:311-329` | Plan copies | `simulation.seed` | `expansion.simulation` (schema 1-5) | Simulation panel | Quest, Grinder, Hub store |
| P10 | Event checks with chance, `guaranteeAfter`, `maxOccurrences` | `src/simulation.js:484-498` | Plan copies | per-check rng stream | `simulation.checks` | Event feed | Pity, Gacha, Sign-in, Luck |
| P11 | Simulation effect vocabulary (power copy/transfer/fragment, faculty, knowledge, life, title, progress, claim, spawn) | `src/simulation_contracts.js:42-86`, `src/simulation_effects.js:125-330` | Mutates plan (a copy) | n/a | `simulation.*` | Various | Copy, Trait, Status, Quest, Heir |
| P12 | Power models and formulas | `src/power_models.js:5-55` | Yes | none | `simulation.powers` | Indirect | Copy, Trait, Grinder |
| P13 | Campaign transitions (travel/return/ascend/rebirth/replay) with `reset` policy | `src/simulation.js:542-596`, `src/simulation_contracts.js:179-182` | Plan copies | streams retained | `simulation.transitions` | Frontier renewal | Regression, Heir, Carryover |
| P14 | Chronicle: mortal life, last-year warning, grave, heir chronicle | `src/chronicle.js:73-123`, `:273-281` | Yes (clones) | none | `expansion.chronicle` (schema 1) | Chronicle panel; heir button hidden | Heir, Foreknowledge |
| P15 | `buildLifeHeirSave` | `src/life_experience_host.js:8-25` | Yes (clones `fresh`) | carries `previous.expansion.rng` | whole envelope | **Not wired** | Heir, Carryover |
| P16 | Bell-yard sealed loop (3 attempts, 2 rewinds) | `src/backlog_expansion_time.js:34-41`, `:105-130`, `:152-240` | Mutates plan | none | `expansion.backlog.loop` | Backlog panel | Loop, Regression |
| P17 | Offline packing with reviewed wall time | `src/backlog_expansion_time.js:42-51`, `:197-217` | Mutates plan | none | `expansion.backlog.offline` | Backlog panel | Grinder, Sign-in (offline reward) |
| P18 | Recurring windows (`schedule`, `cycle.*` claims) | `src/world_rhythm.js:20-31`, engine `:465-467`, `:540` | Yes | none | `cycle.<actionId>` fact | Village gathering | Sign-in |
| P19 | Carrier transit (13 carrier kinds incl. memory, method, source, curse) | `src/backlog_expansion_transit.js:19-21`, `:145-160`, `:256-333` | Preview pure (try/catch) | none | Not saved itself | Paradise/nested carriers | Carryover |
| P20 | Pursuit with declared locator faculty | `src/pursuit.js:11-27`, `:120-137` | Mutates plan | none | `simulation.pursuits` (schema 2+) | Pursuit panel | Status (tracking), Foreknowledge |
| P21 | Causal strike with caller-owned draw | `src/causal_story_core.js:318-337`, `src/causal_story_host.js:221-240` | Pure on inputs | `simulation.seed` | `expansion.causalStories` | Causal story UI | Regression (seeded fights) |
| P22 | `combat_math.js` injectable random | `src/combat_math.js:34-59` | Pure | injectable, defaults to `Math.random` | n/a | Combat | Luck, Simulator |
| P23 | World instance clocks (freeze on absence) | `src/world_instances.js:271-346` | Yes | none | per-world owners | Travel | Simulator (time rooms), Loop |
| P24 | NPC lives with precomputed future deaths/births | `src/npc_lives.js:4-22` | Yes (clones) | FNV hash of seed | envelope `npc_lives` | NPC lives panel | Foreknowledge, Heir |
| P25 | Titles with counters and bonuses | `src/titles.js:8-106` | Yes | none | `character.titles` | Titles panel | Quest (achievements), Trait |
| P26 | Actor proposals from an external planner | `src/simulation.js:606-620` | Plan copies | n/a | n/a | none | Quest (System suggests), Simulator |
| P27 | Dev console | `src/config.js:5`, `src/main.js:7762-7764` | n/a | n/a | n/a | Browser console only | Out-of-fiction only |

## 2. Details per primitive

### P1. Content registry
- SHOWN: `createContentRegistry` registers `worlds, actions, opportunities, capabilities, sources, rollTables, techniques, simulation`, deep-freezes clones and validates cross-references (`src/expansion_engine.js:297-356`). Registry maps are never saved (`:354` comment; `:54` "Definitions are immutable content").
- SHOWN: Roll tables need integer `revision`, `label`, positive total weight, non-negative reward effects, optional `modifiers` with `when` rules (`:309-317`, `:365-373`).
- SHOWN: Actions carry `requires`, `visibleWhen`, `schedule`, `costs`, `cancellation` (`none|refund|forfeit`), `rolls`, `outcomes`, `durationModifiers` (`set|add|subtract`), odds `modifiers`, `opportunityId` (`:318-351`).
- SHOWN: Effect types accepted by the engine: `resource, fact, opportunity, chronicle(archive-duty), item, xp, reputation, technique, source` (`:97-119`).
- Families: every cheat ultimately ships as content in this registry or the simulation registry (P9, P11).

### P2. `evaluateAction`
- SHOWN: Builds facts from all scopes plus technique facts and `capability.<id>` values (`:421-424`), evaluates visibility, requirements, schedule, completion, busy states, blocking opportunities, ended life (`:425-450`), costs (`:451-459`), duration modifiers (`:463-467`), odds (`:472`) and roll-table odds (`:473-477`). Returns `{eligible, reasons, costs, duration, outcomes (with chance), contributors, capabilities, rolls, schedule}` (`:478-479`).
- SHOWN pure: clones outcomes (`:461`); `rules.js:1-2` states evaluation never spends or rolls.
- Families: Status (show exact odds and contributors), Simulator (preview without commitment), Foreknowledge (reveal the chance table).

### P3. `commitAction`
- SHOWN: Stale guard by `expectedSequence` (`:531`), clones state/external/gameplay (`:535`), reserves the recurring cycle at commit (`:540`), forbids checkpoint scenarios from exporting non-scenario rewards (`:541-545`, `:565-568`), draws the main outcome from `state.rng` (`:551`), dry-runs every possible outcome before committing (`:559-562`), draws each roll table (`:571-573`), freezes chosen effects into the job (`:553-556`), settles instantly when duration is 0 (`:576`), validates (`:578`).
- SHOWN: History receipts keep `draw`, `outcome`, `rolls`, capped at 100 (`:518-526`).
- Families: Gacha (repeatable action + roll table + resource cost is already a pull loop), Sign-in (with `schedule`), Quest (completion scopes and counts).

### P4. Odds modifiers
- SHOWN: Each modifier whose `when` holds moves up to `amount` probability from one outcome to another and records its label (`:375-385`). Validation `:358-363`.
- INFERRED: A luck or fate cheat can be a source granting a capability, and modifiers can test `capability.<id>` facts (facts include capabilities at `:424`). No numeric scaling by capability value: transfers are fixed amounts.
- Families: Luck, Gacha rate-up, partial Pity.

### P5. `advanceSimulation`
- SHOWN: Clones inputs (`:586`), loops boundary to boundary up to `target` (`:592-620`). Stops early with `stoppedAtChoice = true` when a blocking opportunity is available, a player decision is waiting, or a player encounter session is open (`:597`). Stops for ended chronicle life or dead/departed player (`:595-596`). Finishes due jobs, opens/expires opportunities, advances chronicle, runs `advanceSimulationBoundary` (`:607-616`). Breaks after 512 boundaries: `if(++boundaries >= 512) break; // Return unspent time; never skip causal work.` (`:619`). Returns `remaining` and `budgetExhausted` (`:630`).
- SHOWN: Several reconcilers receive the original `state` as `before` (`:617-625`); `advanceAuditRemainder(before, out, ...)` only reads `before` and writes `out.state` (`src/audit_remainder_runtime.js:21-31`).
- INFERRED: Because it returns a new state and never mutates its argument, a Simulator cheat can call it on the live state, inspect the result and discard it. Because all expansion randomness is seeded and saved (section 3), the dry run predicts the exact outcome of the same inputs. Native `Math.random` systems (combat, loot, crafting) are outside it.
- Families: Simulator, Foreknowledge, Grinder.

### P6. Scenario checkpoints and rewind
- SHOWN: `checkpointScenario` needs an idle, isolated scenario and snapshots only `state.scenarios[id]` (`:652-659`). `previewScenarioRewind` reports `lost`, `restored`, and `retained: ["campaign","journey","actors","worlds","random stream","receipts"]` (`:661-666`). `rewindScenario` restores the scenario domain, drops its pending jobs, increments sequence and never restores RNG (`:668-675`).
- SHOWN: Checkpoints persist and validate (`:243-247`).
- SHOWN: No `src/` caller outside the engine; only `tests/expansion_engine.test.js` uses them.
- SHOWN: `rewindScenario` validates with no registry argument (`:674`), so registry-dependent checks are skipped there.
- Families: Loop, Regression. Limited to a scenario domain; actors, worlds and simulation are not snapshotted.

### P7. Capability sources
- SHOWN: Source kinds `skill, equipment, knowledge, trait, bloodline, technique, condition, world, support`; origins `unknown, inherited, trained, acquired` (`src/capabilities.js:4-5`). Stacking `max|sum` (`:11`, `:62-63`). Sources may expire (`:52`), and simulation faculties can gate them as dormant, inactive or suppressed (`:53-54`). Providers cannot depend on capabilities (`:19`, `:33`).
- SHOWN: Engine `source` effect grants with `duration`, `origin`, receipt and revision (`src/expansion_engine.js:495-502`).
- SHOWN: Example trait sources: Natural balance (inherited), Conditioned grip (trained), Palm mark (acquired) (`src/body_progression.js:16-18`). The character bio lists knowledge/trait/bloodline sources with origin text (`src/character_bio.js:18-23`).
- Families: Trait (talent entries), Status (provenance per contribution), Carryover (sources are a carrier kind in P19).

### P8. Techniques
- SHOWN: Record shape `{observed, understood, owned, proficiency, executions, practice, lastPractice}` (`src/techniques.js:8`). Gates: understand needs observe (`:107`), own needs understood plus proficiency 2 (`:109`), execution needs owned plus `readyAt` (`:121`). Validation enforces the chain (`:57-60`).
- SHOWN: Observation routes are only `field-observation` and `native-victory` (`:36-37`); `observeNativeTechnique` grants observation after a native win without weakening the enemy (`:166-179`).
- SHOWN: Active practice freezes 3 cues and rewards `[1,1,2,3]` per score and saves each answer (`:115-119`, `:128-152`).
- SHOWN purity: `applyTechniqueEffect` mutates the actor it receives (`:102`); the engine only calls it on cloned state (`expansion_engine.js:493-494`). `answerTechniquePractice`, `cancelTechniquePractice`, `observeNativeTechnique` clone (`:131`, `:156`, `:172`).
- SHOWN content: one technique, Rat-step, with observe/study/internalize/idle/active actions (`src/technique_content.js:7-47`).
- Families: Copy (observe an enemy to learn), Grinder (idle practice), Trait.

### P9. Simulation commands, controllers, programs
- SHOWN: `enrollSimulation` derives `simulation.seed` from `hash(state.rng, "world.services")`, provisions people, sites, automatic event checks and controllers (`src/simulation.js:43-69`).
- SHOWN: `startCommand` reserves costs, acquires claims, draws a weighted outcome from `s.seed`, validates every positive-weight outcome, and handles `powerId` executions/cooldown (`:144-230`, roll at `:173-178`, powers at `:191-193`).
- SHOWN: Controllers pick the highest-priority eligible command/event/encounter for NPCs each interval (`:505-527`). Programs repeat an `automatable` command up to 10000 times and pause with a reason when inputs run out (`:311-329`, `:528-537`; cap at `src/simulation_contracts.js:295`).
- Families: Quest (commands with requires and rewards), Grinder (programs), Hub store (commands with item/resource costs; `src/exchange.js:12-18` already uses commands for an exchange).

### P10. Event checks with pity
- SHOWN: Per-check stream `rng: hash(s.seed, d.id)` (`src/simulation.js:64`). Each due check rolls `chance` (may be a fact formula), applies `guaranteeAfter` after consecutive misses, tracks `attempts`, `misses`, `occurrences`, honors `maxOccurrences` (`:484-498`). Facts `event.misses`, `event.attempts`, `event.occurrences` are exposed to `requires` (`:488`).
- SHOWN content use: `guaranteeAfter: 3` with chance from `resource.care` (`src/helper_content.js:35-36`).
- Families: Pity (the only pity counter in code), Gacha (timed draws), Sign-in (interval checks), Luck (fact-driven chance).

### P11. Simulation effect vocabulary
- SHOWN list of operations (`src/simulation_contracts.js:42`) and per-type validation (`:45-86`).
- SHOWN power ops `learn, copy, transfer, remove, fragment, refine` (`src/simulation_contracts.js:70`). `copy` requires an owning donor and optionally copies mastery; `transfer` also strips the donor; `learn` checks constituents and supports `fusion`; `fragment` collects unique fragments (`src/simulation_effects.js:279-298`). No content uses `copy` or `transfer` on powers (grep of `operation:'copy'|'transfer'` outside contracts/effects finds only claim transfers).
- SHOWN faculties: `grant, remove, awaken, activate, suppress, develop` (`src/simulation_effects.js:265-278`).
- SHOWN knowledge stages `seen < interpreted < understood`, never downgraded, with optional `basis` attribution (`:225-228`); facts expose `knowledge.<id>.*` (`:85-89`). Target facts expose only observed knowledge of another person, not their hidden build (`:105-106`).
- SHOWN life: `alive, incapacitated, dead, departed`; death needs `lethal: true`; leaving death needs `resurrection: true` (`:260-264`).
- SHOWN titles grant/remove with issuer (`:302-303`); progress tracks (`:299-301`); unique claims acquire/transfer/settle/release, release only when `renewable` (`:238-246`); relationship deltas deduped per cause (`:229-237`).
- SHOWN activation budget 256 expanded effects (`:140`).
- Families: Copy (power copy/transfer/fragment), Trait (faculty awaken/develop), Status (knowledge stages), Quest (claims, titles, progress), Regression (life + resurrection flag), Heir (spawn with template).

### P12. Power models
- SHOWN: `previewPowerModel` supports `practice` (mastery bands), `design` (function slots and capacity), `investment` (progress track points), `authority` (custody/jurisdiction/termination), `hybrid` (constituent lineage) (`src/power_models.js:5-44`). `resolveEffectAmount` evaluates JSON formulas `{fact, scale, add, min, max}` and `power.capacity`/`power.costScale` (`:48-55`).
- SHOWN content uses only `model: "practice"` (grep: `audit_remainder_home_content.js:84`, `reference_gameplay_content.js:43`, `skill_expansion_content.js:143`, others).
- Families: Copy (hybrid/fusion), Trait, Grinder (investment).

### P13. Campaign transitions
- SHOWN kinds `travel, return, ascend, rebirth, replay`; reset keys `journey, world, actorFacts, completions, sources, techniques, body, resources, knowledge, powers, progression, relationships, conditions, equipment, native` (`src/simulation_contracts.js:180-182`).
- SHOWN: `previewCampaignTransition` requires a safe boundary (no jobs, sessions, decisions, chronicle session, active pursuits) and lists `lost`/`retained` (`src/simulation.js:542-553`). `commitCampaignTransition` applies resets (`:558-567`); `rebirth` sets life alive, resets `bornAt`, and ends the chronicle only if `chroniclePolicy === "end"` (`:568-571`); comment: claims, RNG streams, causes and receipts stay (`:579-580`); `nativePatch` rewrites native envelope paths and requests a reload (`:581-593`; persisted by `src/expansion_persistence.js:36-45`).
- SHOWN content: one `replay` transition, `frontier.field_renewal`, `reset: []`, grants source `frontier.field_legacy` (`src/frontier_campaign.js:62-67`). No `rebirth` content.
- SHOWN: `retain` is descriptive text only (`frontier_campaign.js:64`); retention is whatever `reset` does not list.
- Families: Regression (rebirth with selective reset), Heir, Carryover.

### P14. Chronicle
- SHOWN: `createChronicle` with `mode: open|mortal`, age 18, lifespan 80, elder profile, two timed events (`src/chronicle.js:73-85`). `advanceChronicle` opens/misses events, sets `lastYear` warning one game year before death, ends life at the deadline and writes a grave (`:104-122`). `nextChronicleBoundary` feeds the common clock (`:98-102`).
- SHOWN: `createHeirChronicle` carries one bequest lesson, generation count and the predecessor's grave (`:273-281`).
- SHOWN: Chronicle panel has a "Begin an heir" button (`src/chronicle_ui.js:56-59`) hidden when `beginHeir` is absent (`:120`). `main.js:7628-7635` passes no `beginHeir`.
- Families: Heir, Foreknowledge (the last-year notice is an authored premonition).

### P15. `buildLifeHeirSave`
- SHOWN: Requires an ended life, takes a fresh new-game envelope, keeps calendar, `npc_lives`, `options`, `life_record`; starts a new expansion seeded with the previous `rng`; names the character "The heir"; appends a legacy milestone (`src/life_experience_host.js:8-25`).
- SHOWN: only `tests/life_experience_b.test.js:5,38-39` call it.
- Families: Heir, Carryover. Implemented, unwired.

### P16. Bell-yard loop
- SHOWN: Commands `open, practice, rewind, finish` (`src/backlog_expansion_time.js:34-41`). `armLoop` debits one log, creates the keeper, seals bag/equipment/money, anchors both people and the site (`:152-182`). `restoreLoop` restores declared domains (life, location, body, vitals capped at current max, local focus/pattern, keeper inventory, site) and keeps knowledge, claims and the spent minute (`:105-130`). Rewind needs one completed local minute and an unused rewind, max 2 (`:231-234`). Seal check rejects any bag/equipment/money change (`:137-150`).
- SHOWN: Single trial per save via claim `backlog.bell_trial` (`:155`).
- Families: Loop (keep knowledge, reset body and place), Regression prototype. This is the closest existing "restore selected domains, keep memory" pattern.

### P17. Offline packing
- SHOWN: Prepaid batch, explicit review of elapsed wall time, 2 minutes per kit, unreviewed or paused time discarded (`src/backlog_expansion_time.js:42-51`, `:197-217`).
- Families: Grinder, offline Sign-in reward.

### P18. Recurring windows
- SHOWN: `recurringWindow(schedule, minute, lastClaim)` derives cycle and open state from the saved calendar; already-claimed cycles are closed (`src/world_rhythm.js:20-31`). The engine reserves `cycle.<actionId>` at commit (`src/expansion_engine.js:540`) and validates the claim is an integer (`:82`).
- SHOWN content: daily gathering `{period: 1440, opens: 480, closes: 600}` (`src/village_content.js:77`).
- Families: Sign-in. No streak counter (section 5).

### P19. Carrier transit
- SHOWN: Carrier kinds `body, cargo, memory, method, source, fuel, office, credential, duty, debt, curse, observer, ally`; lane kinds include `subjective` (`src/backlog_expansion_transit.js:19-21`). `carrierTransitContext` builds automatic owners for memory (knowledge), method (techniques + powers), source (sources + faculties), fuel, office, credential, duty, debt, observer (`:145-160`). `carrierRules` decides retain/block and usable/blocked per kind, with jurisdiction rules for office/credential (`:256-284`). `previewCarrierTransit` is wrapped in try/catch and returns reasons (`:285-332`); it requires zero-cost instant passage (`:327`).
- Families: Carryover (which cheat parts survive a world change), Trait.

### P20. Pursuit
- SHOWN: NPC pursues the player by evidence; optional declared locator `signature|authority` gated by an active faculty and costs (`src/pursuit.js:11-27`, `:120-137`). Authority mode moves the pursuer to the target location (`:135`).
- Families: Status/tracking powers, enemy cheat holders (pursuer uses a faculty).

### P21. Causal strike
- SHOWN: `resolveCausalStrike` refuses without a caller-owned `random` (`src/causal_story_core.js:318-332`); the host supplies a xorshift draw on `simulation.seed` (`src/causal_story_host.js:221-240`).
- Families: Regression (deterministic replays of fights), Simulator.

### P22. `combat_math.js`
- SHOWN: `rollBaseCombatDamage` and `rollCombatStrike` accept `random`, default `Math.random` (`src/combat_math.js:34-45`). Native combat calls `rollBaseCombatDamage` without a random (`src/models/combat.js:316`) and uses inline `Math.random` for block, evasion, crit (`:320`, `:348`, `:370`). Saved battles pass seeded draws (`src/native_battle.js:47-53`, `src/party_battle.js:87-88`, `src/feature_expansion_battle.js:279-323`).
- Families: Luck, Simulator (only for saved battles).

### P23. World instance clocks
- SHOWN: Each world instance has `clock {elapsed, observedAt, unit: "played_minutes", absence: "freeze"}` (`src/world_instances.js:278`); `freeze` is the only accepted absence policy (`:108-111`). `planWorldClock` advances only during active visits, 1:1 (`:310-346`). Realm clock leases exist for observation/work (`src/realm_clock_leases.js:122-214`).
- Families: Simulator or time-room cheats would need a rate field (section 5).

### P24. NPC lives
- SHOWN: `createVillageLives(year, seed)` precomputes death years with an FNV hash of `seed:id` and pushes future birth/death events (`src/npc_lives.js:4-22`). Seeded from `expansionState.rng` (`src/main.js:1853`, `:7659`); saved as envelope `npc_lives` (`:4621`).
- INFERRED: Future village events already exist in save data, so a Foreknowledge cheat could read them without new simulation.
- Families: Foreknowledge, Heir (family lines with parents/spouses).

### P25. Titles
- SHOWN: Title catalog, `newlyEarnedTitles`, `grantEarnedTitles`, `titleBonuses` (`src/titles.js:8-106`); saved on `character.titles` (`src/main.js:4397`); panel at `:7662`.
- Families: Quest/achievement rewards, Trait.

### P26. External planner hook
- SHOWN: `inspectActorChoices` lists legal commands for an actor (`src/simulation.js:606-614`). `acceptActorProposal` accepts only a registered command id and refuses effects/costs/source code (`:616-620`).
- Families: Quest (System suggests a task), Simulator (advisor). SHOWN: grep finds no caller of either function in `src/` outside `simulation.js`.

### P27. Dev console
- SHOWN: `enable_dev_mode: false` with comment about "cheat-y" console functions (`src/config.js:5`), wired at `src/main.js:7762-7764`. Out-of-fiction; not a cheat primitive.

### Identifier grep (SHOWN, `src/**/*.js`, case-insensitive)
| Pattern | Files | Hits | Main locations |
|---|---|---|---|
| `\bcheat` | 1 | 1 | `config.js:5` (dev mode) |
| `\bsystem\b` | 5 | 18 | Source-recognition data in `feature_expansion_book_cultivation.js` (e.g. `:80`, `:140-141`, `:165`); no System mechanic |
| `talent` | 9 | 13 | MOL/Paradise content text |
| `\btraits?\b` | 13 | 18 | `character_bio.js`, `body_progression.js` |
| `\bluck` | 3 | 4 | book data, `data/locations.js` |
| `\bfate` | 9 | 155 | `backlog_expansion_opportunities.js` (58: finite transferable "fate" slot, `:18`, `:40-46`, `:123-127`) |
| `\bloop` | 14 | 160 | `backlog_expansion_time.js` (75) |
| `rewind` | 7 | 38 | `backlog_expansion_time.js` (17), engine (3) |
| `simulat` | 242 | 3196 | everywhere |
| `gacha`, `pity`, `lottery` | 0 | 0 | none |
| `sign-in/check-in` | 1 | 1 | unrelated comment `main.js:3504` |
| `foreknow` | 6 | 9 | text forbidding author foreknowledge (e.g. `book_world_paradise_content.js:36`) |
| `regress` | 4 | 40 | book recognition data |
| `reincarn` | 5 | 20 | book roster data |
| `\bheirs?\b` | 4 | 9 | `chronicle_ui.js`, `life_experience_host.js`, `backlog_expansion_body.js:85` |
| `guaranteeAfter` | 3 | 6 | P10 |

## 3. RNG and determinism map

| Stream | Seed origin | Generator | Consumers | Saved |
|---|---|---|---|---|
| Engine `state.rng` | `crypto.getRandomValues` at new game (`src/main.js:350`); reload keeps saved value (`:4725`); heir reuses previous (`life_experience_host.js:16`) | xorshift32 (`expansion_engine.js:511-516`) | `commitAction` outcome and roll tables (`:551`, `:571`) | Yes, `expansion.rng`, validated `:135-136` |
| `simulation.seed` | `hash(state.rng, "world.services")` at enroll (`simulation.js:46`) | xorshift32 (`simulation.js:34`) | Command weighted outcomes (`:173-178`), causal strikes (`causal_story_host.js:221-222`) | Yes, `simulation.seed` |
| Event check streams | `hash(s.seed, eventId)` (`simulation.js:64`); scheduled events via `deriveSimulationSeed` (`simulation_effects.js:322`) | xorshift32 per check | Event occurrence rolls (`simulation.js:492`) | Yes, `simulation.checks.*.rng` |
| Battle seeds | `simulation.seed ^ sequence` (`native_battle.js:13`, `party_battle.js:37`); feature battles similar (`feature_expansion_battle.js:99`, `:279`) | xorshift32 inline | `rollCombatStrike` | Yes, `session.nativeBattle.seed` |
| Offer seeds | `deriveSimulationSeed(simulation.seed, cause)` (`audit_remainder_offers_state.js:52`) | hash | Remainder offers | Yes |
| NPC lives | `expansionState.rng` passed in (`main.js:1853`, `:7659`) | FNV hash (`npc_lives.js:4`, `:9`) | Death years | Yes, envelope `npc_lives` |
| Technique practice draw | Receipt draw passed through `applyTechniqueEffect` (`techniques.js:99`, `:117`) | from engine stream | Practice record | Yes |
| Native `Math.random` | none | browser | 62 calls (below) | No |

Native `Math.random` call sites by file (SHOWN, 62 total): `main.js` 18 (crafting `:3677-3726`, gathering `:6889`, action success `:2106`, rewards `:2446`, flavor text), `models/location.js` 13 (enemy groups and stat variation `:344-381`), `particles.js` 12 (visual), `enemies.js` 7 (loot and statuses `:170-515`), `models/combat.js` 4 (`:157`, `:320`, `:348`, `:370`), `components/trader_component.js` 3 (`:116-122`), `display.js` 2, `combat_math.js` 2 (default parameters `:34`, `:44`), `misc.js` 1 (`:69`).

Determinism notes:
- SHOWN: Rewind and transitions never restore RNG (`expansion_engine.js:673`; `simulation.js:579`). A loop cheat built on them will see different rolls after rewind unless it adds its own snapshot of streams.
- SHOWN: Draw helpers are module-private (`expansion_engine.js:511`, `simulation.js:34`); no exported "peek next roll".
- INFERRED: Expansion-side outcomes are fully reproducible from a saved state plus the same commands. Native loot, crafting and live combat are not.

## 4. Persistence and schema map

- SHOWN: Save envelope key `expansion` holds the engine state (`expansion_persistence.js:15`); written via `storage.setItem` after `validateEnvelope` (`:47-49`). Money, calendar, effect durations, native vitals, gameplay, ownership, market, item log, unlocks, equipment and `nativePatch` are written in the same envelope (`:16-46`).
- SHOWN engine schemas accepted: 5, 6, 7, 8, 9 (`REFERENCE_ENGINE_SCHEMA`, `reference_gameplay_state.js:9`), 10 (`BOOK_WORLD_ENGINE_SCHEMA`, `book_world_paradise_state.js:7`), 11 (`AUDIT_REMAINDER_ENGINE_SCHEMA`, `audit_remainder_state.js:8`; also `CAUSAL_STORY_ENGINE_SCHEMA`, `causal_story_ids.js:3`) (`expansion_engine.js:55-59`, `:134`). Schemas 1-4 migrate additively to 5 (`:253-264`). Schema 11 requires at least one of `auditRemainder`, `causalStories`, `motherOfLearning`, `proto23Village` (`:137`).
- SHOWN engine fields: `schema, sequence, clock, rng, campaign, journey, worlds, actors{facts,resources,completed,worldId,sources,techniques}, scenarios, pending, opportunities, history(≤100), checkpoints, chronicle, simulation` (`:69-76`), plus optional owners validated at `:139-183` (backlog, nestedCampaign, bookWorldCampaign, motherOfLearning, proto23Village, referenceGameplay, causalStories, and others).
- SHOWN simulation schema 1-5 (`simulation_contracts.js:211`); fields `people, owners, equipment, custody, knowledge, relationships, claims, faculties, powers, progression, titles, conditions, sites, jobs, events, checks, controllers, programs, sessions, party, causes, transitions, log` (`:206`, `:214-215`); pursuits need schema 2 (`:213`); schema 3+ needs a situation (`:212`); schema 4 for reservation returns and frontier contributions (`:248`, `:266`). Logs ≤100, transitions ≤32, relationship memories ≤32 (`:305`, `:238`).
- SHOWN chronicle schema 1 (`chronicle.js:14`), experience fields `reflected, taught, bequest, lastYear, generation, grave, inheritedFrom` (`:18-25`).
- SHOWN backlog loop and offline records under `expansion.backlog.loop` / `.offline` (`backlog_expansion_time.js:25-26`, `:173-180`), validated by `validateTimeRecord` (`:355+`).
- SHOWN envelope siblings: `npc_lives` (`main.js:4621`), `life_record` (`:4620`), `character.titles` (`:4397`), `options` (copied by heir, `life_experience_host.js:20`), `retired_content` (`save_compatibility.js:9-58`). Native v0.6 migration in `save_migration.js:3-26`.
- INFERRED: A new cheat owner would follow the existing optional-owner pattern (absent means not enrolled; validator in `validateExpansionState`; possibly a schema bump). There is no generic `cheats` namespace today.

## 5. Absences

| ID | Missing piece | Evidence |
|---|---|---|
| X1 | No gacha/pull pool with pity across pulls. Roll tables have no miss counter; pity exists only on timed event checks. | `expansion_engine.js:365-385` vs `simulation.js:492` |
| X2 | No full-state snapshot/restore. Rewind covers one scenario domain; the bell-yard restores a fixed list of domains for two people. | `expansion_engine.js:652-675`; `backlog_expansion_time.js:105-130` |
| X3 | No death trigger. `life: dead` changes status only; `advanceSimulation` stops on player death; nothing rewinds or spawns a successor on death. Native defeat stays unconsciousness (PROJECT.md decision). | `simulation_effects.js:260-264`; `expansion_engine.js:596` |
| X4 | No RNG snapshot or peek API; rewind and transitions deliberately keep streams. | `expansion_engine.js:511`, `:673`; `simulation.js:579` |
| X5 | No time-rate multiplier for world instances; only `absence: "freeze"` at 1:1. | `world_instances.js:108-111`, `:310-346` |
| X6 | No sign-in streak or missed-day accounting; `recurringWindow` stores only the last claimed cycle. | `world_rhythm.js:20-31` |
| X7 | No generic expansion quest/task owner; quest views are per-feature fact projections (`exchangeQuestView`, `fieldSupplyQuestView`); native `Quest` class is separate. | `exchange.js:20`; `frontier_campaign.js:73`; `quests.js:14-595` |
| X8 | No cheat currency or hub store owner; stores are native traders or simulation commands. | `trade.js`; `exchange.js:12-18` |
| X9 | Heir flow unwired: no `beginHeir` passed to the chronicle panel; `buildLifeHeirSave` has no src caller. | `main.js:7628-7635`; `chronicle_ui.js:120` |
| X10 | Scenario rewind has no src caller or UI. | grep, section 2 P6 |
| X11 | Power `copy`/`transfer`, `design`/`investment`/`authority`/`hybrid` models, and `rebirth` transitions have no content. | grep, P11-P13 |
| X12 | Native `Math.random` systems (live combat, loot, crafting, enemy groups) cannot be simulated or foreseen deterministically. | section 3 |
| X13 | No "System" UI surface or owner (status window, notifications, task board); only research data uses the word. | grep table |
| X14 | Bell-yard and many offers are single-claim finite trials, which conflicts with the "no fixed once limits" preference if reused as-is. | `backlog_expansion_time.js:155`; memory note `solo-player-no-once-limits` |
| X15 | Simulation dry-run returns `budgetExhausted` after 512 boundaries; long-horizon simulators need chunking. | `expansion_engine.js:619`, `:630` |

## 6. Open questions

| ID | Question |
|---|---|
| Q1 | Should a Simulator dry-run reuse `advanceSimulation` on a clone (exact seeded future) or use a separate preview stream so seeing the future does not equal knowing it exactly? |
| Q2 | Should rewind or regression restore RNG streams? Current code says never (`expansion_engine.js:673`). Restoring makes loops replay identical outcomes. |
| Q3 | Is the bell-yard restore list (P16) the intended template for loops, or should loops snapshot whole owners (actors, simulation, world) like a checkpoint? |
| Q4 | Should cheats live as capability `sources` with faculties (awaken/suppress), as simulation `powers`, or as a new owner? Sources already carry origin and expiry; powers carry mastery and lineage. |
| Q5 | Should native combat and loot move to seeded draws so luck and foreknowledge cheats can affect them? `combat_math.js` already accepts injected random. |
| Q6 | Wire the heir path (`buildLifeHeirSave`, `beginHeir`) first, or extend it to carry more than one lesson before wiring? |
| Q7 | `rewindScenario` validates without the registry (`expansion_engine.js:674`). Intentional or a gap? |
