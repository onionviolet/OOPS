# Systems guide: progression, world loading, jobs, knowledge, saves

**Status: reference map, written 2026-10-25 (lane C2). Not accepted direction.**
Weibao: "we should write down our existing systems to help fit in better ... so
that there isnt so much hoops in the future". This file says which existing
system a new mechanic should use, how flexible it is, and how to plug in. It adds
no rules. Direction lives in [USER_VISION](../USER_VISION.md) and
[PROJECT](../../PROJECT.md); rule codes live in [RULES_INDEX](../RULES_INDEX.md).

Every `file:line` below was read from the working tree on 2026-10-25 (the
checkout is dirty, so lines may drift; re-grep before citing). Lines marked
**(inference)** are not directly verified in code.

Rule codes cited: AR1-AR16 ([architecture](../ARCHITECTURE_RULES.md)), GTR1-GTR30
([gate rules](../PROGRESSION_GATE_RULES.md)), ASC1-ASC6
([cultivation paths](../RESEARCH_CULTIVATION_PATHS.md)), AD5, AD22, AD36, AD38
([index](../RULES_INDEX.md)), WPR31 mechanism over item list, MR33 old saves
(currently deferred, see S12).

## How to read the maturity column

| Word | Meaning here |
|---|---|
| **Used in play** | A live module imports it and a player journey crosses it (AR10). |
| **Wired, thin** | Imported by live code, but by one or two consumers. |
| **Tested only** | Has tests and exports, no live importer found by grep. "Engine ready", not integrated (AR10). |
| **Proposal** | Header or doc says proposal; may still be wired. |

## Map of the systems

| # | System | Owner file(s) | Maturity |
|---|---|---|---|
| S1 | Fact rules (the one evaluator) | `src/rules.js` | Used in play |
| S2 | Progression gates | `src/progression_gates.js` | Wired, thin (4 gates) |
| S3 | Ascension paths (ladders, crossings) | `src/ascension_paths.js` | Wired, thin (2 worlds) |
| S4 | Skills, XP, overflow rows, rust | `src/skill_overflow_domain.js`, `src/skill_records.js` | Used in play |
| S5 | Titles and faction rank | `src/titles.js`, `src/faction_rank.js` | Used in play |
| S6 | Clearance (role and grade table) | `src/clearance.js` | Wired, thin (1 world) |
| S7 | Domain registry (lifecycle) | `src/domain_registry.js` | Used in play (54 calls) |
| S8 | World packs (data worlds) | `src/world_pack_*.js`, `src/world_packs/` | Partly wired (loader yes, save no) |
| S9 | Book-world hosts (Tingen, Cyoria, Paradise) | `src/book_world_*` | Used in play |
| S10 | Simulation commands, jobs, boundaries | `src/simulation*.js` | Used in play |
| S11 | Expansion engine (actions, worlds, schedules) | `src/expansion_engine.js` | Used in play |
| S12 | Save envelope, validators, migrations | `src/save_files.js`, `src/save_*.js` | Used in play |
| S13 | Knowledge, observation, sealed truth | simulation `knowledge` effect, `src/observation_channels.js`, pack `secrets` | Mixed |
| S14 | Body, lives, heirs, continuation | `src/continuation_*`, `src/heir_inheritance.js`, `src/lineage_domain.js` | Used in play |
| S15 | Seeded generation | `src/gen_kit.js`, `src/seeded_streams.js` | Used in play |
| S16 | Tags | `src/tag_store.js` | Wired, thin |
| S17 | UI ports and panels | `src/ui_ports.js`, `src/panel_kit.js` | Used in play |
| S18 | Debug, cheat and inspector views | `src/chain_inspector.js`, `src/cheat_cards.js`, `src/dev_console.js` | Used in play (dev) |
| S19 | Clocks and recurring windows | `src/world_rhythm.js`, `src/simulation_clock.js`, `src/owned_place_clock.js` | Mixed |

---

## S1. Fact rules (`evaluateRule`)

**Use it for.** Any "may this happen" test. Gates, commands, checks, paths and
clearance all reduce to it. Do not write a second evaluator (GTR9).

**Key API.** `evaluateRule(rule, facts)` at `src/rules.js:3`. Returns
`{met, known, reasons}`. Pure: no spend, no roll, no write.

**Data shape.** Leaf `{fact, op: 'eq'|'gte'|'lte', value, reason?}`; combinators
`{all: [...]}`, `{any: [...]}`, `{not: rule}` (`rules.js:3-31`). Numeric ops need a
finite value. Simulation commands add numeric expressions
`{fact, scale, add, min, max}` through `numeric()` at `src/simulation_contracts.js:40`.

**Degrees of flexibility.** Combine freely and nest. `known` separates "false"
from "unknown fact". A `not` over an unknown fact is *not met*
(`rules.js:15-18`), so authors must emit every flag explicitly (the Tingen kit says
so at `src/book_world_lotm_kit.js:8`). No arithmetic across two facts, no strings
beyond `eq`.

**Consumers today.** Gates, simulation `requires`/`visibleWhen`
(`simulation_contracts.js:38`), expansion actions, checks
(`src/check_contract.js:3`), path-adjacent views.

**Maturity.** Used in play.

**How to plug in.**
1. Pick fact keys the owning domain already publishes (the domain supplies `facts`).
2. Write the rule with the `eq/gte/all/not/any` helpers (Tingen has them in `book_world_lotm_kit.js:7-9`).
3. If a new fact is needed, add it to the owner's fact builder, not to the rule.
4. Add a `reason` per leaf only when the default "Requires X gte N" text would leak or confuse.

**Gotchas.** `all` plus `any` in one node throws. Facts are caller-owned; the
rule never reads state itself. Tests: `tests/progression_gates.test.js`, `tests/simulation.test.js`.

**Owner docs.** [PROGRESSION_GATE_RULES](../PROGRESSION_GATE_RULES.md) GTR9, GTR10.

---

## S2. Progression gates (`defineGate`)

**Use it for.** A named, authored point where progress waits and the world says
why, with at least one costed way around. Use it when the player-facing hint
precision, a tunable threshold, or a stated reason matters. For a plain
"requires" on one command, S1 inside S10 is enough.

**Key API.**

| Export | Where |
|---|---|
| `GATE_KINDS` (capacity, knowledge, credential, resource, maturation, world state, social, law, presentation) | `src/progression_gates.js:7` |
| `GATE_CLOSES` (`persist`, `revocable`) | `progression_gates.js:9` |
| `OVERFLOW_POLICIES` (lost, banked, converted, spill, pressure) | `progression_gates.js:10` |
| `VAGUE_HINT` | `progression_gates.js:11` |
| `defineGate(d)` | `progression_gates.js:34` |
| `evaluateGate(gate, facts, {dials, knows})` | `progression_gates.js:58` |

**Data shape.** `{id, kind, requires (rule), reason, routes:[{id, reason, cost}],
closes?, closeReason?, overflow?:{policy, reason}, dials?:{name:{default}}}`.
`defineGate` returns a frozen deep clone (`progression_gates.js:52`).

**Degrees of flexibility.**
- **Hint precision.** A leaf may carry `hint`. `evaluateGate` shows a leaf's hint
  only when the caller's `knows(fact)` returns true; otherwise it adds the single
  line `VAGUE_HINT` (`progression_gates.js:62-67`). So: exact, partial, or fully
  vague, per fact, decided by the caller (GTR10).
- **Dials.** A leaf `value` may be `{dial: 'name'}`; defaults come from `dials`,
  callers override per call (`progression_gates.js:25-31, 59`). Use this for
  per-world or per-tier thresholds (pledges does: `stageNeed(tier)`,
  `src/pledges.js:106`).
- **Several routes to one requirement.** Two ways: `any:[...]` inside `requires`
  (as `pledges.tempering` does with three skills, `src/pledges_content.js:28-35`),
  and `routes[]` for costed workarounds that are not facts (shown to author and
  inspector, not evaluated).
- **Closes.** `persist` or `revocable`; revocable needs `closeReason`
  (`progression_gates.js:41-42`). Revocation itself is not enforced by this file
  (inference: the caller must re-evaluate; GTR13).
- **Overflow.** `overflow` is validated only (`progression_gates.js:43-44`).
  **No existing gate sets it and nothing reads `gate.overflow`** (grep: no
  `.overflow` consumer outside this file). The live overflow behavior is in S4.

**Consumers today.** 4 gates, 4 importers of the module:
`book_world_primordial_credit.js:53,61` (CAP_GATE, FIRST_GATE),
`pledges_content.js:28`, `reveal_chain.js:7` (HERB_LESSON_GATE),
and the read-only view in `chain_inspector.js:86`. Test: `tests/progression_gates.test.js`.

**Maturity.** Wired, thin. Header says proposal (GTR1-GTR20, 2026-10-23).

**How to plug in.**
1. Read the [gate rules](../PROGRESSION_GATE_RULES.md) kinds and GTR2 (read the mechanism, not the label).
2. In the owning module, `export const X_GATE = defineGate({...})` with at least one route that has an id, reason and cost.
3. Build the fact map in the owner and call `evaluateGate(X_GATE, facts, {dials, knows})` at the commitment point (GTR11).
4. Show `result.shown` to the player; keep `result.authorReasons` for the author inspector only.
5. Open the gate through the owner's existing staged transaction (for unlocks, `src/native_unlock_transaction.js:3`), never from `evaluateGate`.
6. Add the gate to `projectChains` frame input if it should appear in the inspector (S18).

**Gotchas.** Every gate needs a reason and a costed route or `defineGate`
throws (`progression_gates.js:38-40`). Unknown dial names throw at define time.
`closes` defaults to `persist`. Gates are not saved; only owner state is.

**Owner docs.** [PROGRESSION_GATE_RULES](../PROGRESSION_GATE_RULES.md) (GTR1-GTR30),
[PROGRESSION_GATE_OVERFLOW_2026-10-23](../PROGRESSION_GATE_OVERFLOW_2026-10-23.md).

---

## S3. Ascension paths (`definePath`)

**Use it for.** Declaring a rank ladder, tree, web, wheel, stack or field as
data, with typed crossings between stages, then viewing "where am I, what is
next, what is missing" without owning state.

**Key API.** `pathShapes` (`src/ascension_paths.js:8`: ladder, tree, web, wheel,
stack, field), `crossingTypes` (`:11`: quota, structure, insight, trial, ingest,
digest, consume, recognition, bodyPoint), `definePath(desc)` (`:32`),
`pathView(path, position, facts, {known, ceiling})` (`:45`).

**Data shape.** `{id, world, label, shape, stages:[{id, label, crossings:[{id,
type, label, fact, need (true or natural number), irreversible?}], grants:[text],
failure?:{signs, outcome}}]}`. Stage 0 is the entry and has no crossings; every
later stage needs at least one (`ascension_paths.js:35`). Needs at least two stages.

**Degrees of flexibility.**
- **Several crossings per stage.** All must be met (`pathView` `ready`, `:128`). For "any one of several routes", publish one derived fact (an OR) from the owner; the descriptor has no `any` (inference from code: crossings combine with `every`).
- **Hidden later stages.** `known` limits how many stage labels show; the rest print `???` (`:119`). `ceiling` blocks a crossing even when facts are met and reports `capped` (`:124`). Use `ceiling` for a world cap or flame count.
- **Irreversible marker** is display only.
- **Failure text** shown for the next stage (`:129`).
- **Grants** are text; the descriptor grants nothing. Granting happens in the owner's effects.
- **Path crossings across worlds.** `world` is a label. The descriptor has no cross-world edge; a crossing between worlds is a world-pack `crossings` record (S8) or an owner rule (inference).
- **Shapes beyond ladder** are accepted by the validator but `pathView` only walks `position + 1` (`:47`); tree/web/wheel views would need a new reader (inference from `pathView` code).

**Consumers today.** 2 worlds: Tingen (`src/book_world_lotm_path.js:9`, rows via
`book_world_lotm_pathways.js:68`, 4 rows: Seer, Corpse Collector, Savant, Sailor,
`book_world_lotm_rows.js:82-83`) and Mistglass (`src/ascension_paths_mistglass.js:5-22`).
Test: `tests/ascension_paths.test.js`.

**Maturity.** Wired, thin. Used in play for ladders only.

**How to plug in.**
1. Decide where the position and facts come from (the owner's state; the leaf holds none, AR3).
2. `definePath({...})` once at module load; keep the frozen result.
3. In the owner's projection, call `pathView(path, position, facts, {known, ceiling})`.
4. Put the real work (consuming a dose, spending practice minutes) in S10 commands whose effects set the fact the crossing reads.
5. For a Tingen-style pathway, do not call `definePath` by hand: add a row (see S9).

**Gotchas.** `fact` keys must match `/^[a-zA-Z][a-zA-Z0-9_.]*$/`; ids `/^[a-z][a-z0-9_.-]*$/`
(`ascension_paths.js:5-6`). A `need` of `0` is allowed by `natural` but `true`
means boolean. Position beyond the stages throws.

**Owner docs.** [RESEARCH_CULTIVATION_PATHS](../RESEARCH_CULTIVATION_PATHS.md) ASC1-ASC6.

---

## S4. Skills, XP and overflow rows

**Use it for.** What happens to progress past a cap, per world, and optional
skill rust. This is where the five overflow policies actually run today.

**Key API.** `SKILL_GAIN_OVERFLOW` and `SKILL_EVENT_OVERFLOW` rows,
`skillOverflowRow(worldId)`, `settleCappedSkillGain({skillId, xp, cap, xpToNext, worldId})`
(`src/skill_overflow_domain.js:10,18,28,39`); `SKILL_DIALS`, `dialFor`
(`src/skill_records.js:12,16`).

**Data shape.** Row `{policy: 'lost'|'banked'|'converted', reason, ...dials}`.
Banked row: `{limitLevels, drainRatio}`. Converted row: `{sink, xpPerMinute}`.
Rows key on world id, optionally `world#eventId` (`skill_overflow_domain.js:21-24`).

**Degrees of flexibility.** Per world and per named event. Three of five policies
are implemented (lost, banked, converted). `spill` and `pressure` exist only as
gate vocabulary (`progression_gates.js:10`) and a pressure-style setback in
`breakthrough_trial.js` that its header says is not wired (inference from
[overflow doc](../PROGRESSION_GATE_OVERFLOW_2026-10-23.md) GTO9).

**Consumers today.** `src/components/levelable_component.js`,
`src/absorb_p23/host_joins/world_adaptation.js` (2 importers). Test: `tests/skill_overflow.test.js`.

**Maturity.** Used in play, proposal rows.

**How to plug in.** Add a row for your world id with policy, dial and an in-world
reason; add an event row only for a named gain that differs. Read
[SLR](../RULES_INDEX.md) rules before changing caps.

**Gotchas.** The bank is a module-level variable (`skill_overflow_domain.js:30`,
`let bank`), saved through the `skill_overflow` domain slice (`:62-71`); reuse that
slice before adding another bank. An unlisted world gets `lost` (`:12-15`).

**Owner docs.** [overflow doc](../PROGRESSION_GATE_OVERFLOW_2026-10-23.md), GTR16, GTR21, GTR29.

---

## S5. Titles and faction rank

**Use it for.** Display titles from lifetime counters; named rank bands over a
signed per-region reputation number. Both are derived on read and never stored
as rank, so no migration (`src/faction_rank.js:2-4`, `src/titles.js:2`).

**Key API.** `title_catalog`, `grantEarnedTitles(titles, counters, at)`
(`titles.js:8,87`); `DEFAULT_LADDER`, `REGION_LADDERS`, `rankOf(region, rep)`,
`rankAllows`, `rankFacts` (`faction_rank.js:5,15,30,51,39`).

**Degrees of flexibility.** Ladders are arrays per region; thresholds are
reversible dials. `rankFacts` produces facts a gate or rule can read. Title
bonuses are derived from `character.titles` (`{id: {at}}`).

**Consumers today.** faction_rank 3 importers, titles 5 (grep). Reputation owner
is `reputation.js` (1 importer).

**Maturity.** Used in play, proposal content.

**How to plug in.** Add a row to `REGION_LADDERS`, or a title row to
`title_catalog`; read rank through `rankFacts` into S1/S2.

**Gotchas.** Rank is not a credential record. If the institution should hold the
grade (GTR25), model it as owner facts plus S6, not as reputation.

---

## S6. Clearance

**Use it for.** "May this role, with these people present, handle a grade-N
thing?" A supervisor-and-group rule that answers with reasons.

**Key API.** `defineClearance(desc)` (`src/clearance.js:9`), `clearanceFor(table,
grade, {role, present, known})` (`:25`).

**Data shape.** `{id, roles:[ordered ids], grades:{N:{needs:{atLeast|anyOf|group:{min,atLeast}}, line, vague}}}`.

**Degrees of flexibility.** Ordered roles, "at least", "any of", or a group
quorum. `known:false` swaps reasons for the row's `vague` line.

**Consumers today.** 1 importer: `book_world_lotm_clearance.js:10` (church teams).
Header says tests prove the seam with a second world as fixture only (AR11).
Test: `tests/lotm_clearance.test.js`.

**Maturity.** Wired, thin.

**How to plug in.** Define a table in the world's file, publish `role` per actor
as owner facts, call `clearanceFor` in the owner's fact builder (see
`clearanceFacts`, `book_world_lotm_clearance.js:22`).

---

## S7. Domain registry

**Use it for.** Giving a feature its lifecycle: initial state, save slice,
validate, migrate, load, tick, refresh, projection, panels, item commands.
It is the AR2 seam. A static content table needs none of this.

**Key API.** `createDomainRegistry` (`src/domain_registry.js:3`),
`registerDomain(domain)` (`:17`), `domainRegistry` (`:41`). Facade methods
`list, initialize, save, validate, load, tick, refresh, mountPanels, useItem,
ownsItemKey, command, project` (`:23-37`).

**Data shape.** `{id (unique string), deps?:[ids], initialState?, save?, validate?,
migrate?, load?, tick?, refresh?, projection?, ownsItemKey?, panels?:[mountFn],
commands?:{name: fn or {accepts, quote, execute}}}`. Non-function hooks throw
(`:20`).

**Degrees of flexibility.** Declare only the hooks you need. Order is a topological
sort of `deps`; a missing dep or cycle throws (`:3-16`). `load` gets the slice,
or `initialState()` when absent (`:28`). `migrate` runs per slice before `load`.
`useItem` lets a domain own an item key through `commands.useItem` (`:34`).

**Consumers today.** 54 `registerDomain(` calls across 51 files (grep).
Test: `tests/domain_registry.test.js`.

**Maturity.** Used in play.

**How to plug in.**
1. Create `src/<feature>_domain.js` that calls `registerDomain({id, deps, ...})` at import.
2. Add the one registration line to `main.js` (AR1: pay for it by moving a line out; `npm run check:arch`).
3. Expose a `save` slice under your own key (the registry writes `envelope[d.id]`, `:22`).
4. Mount UI through `panels` and `definePanel` (S17).
5. Read other domains only through `domainRegistry.project(id, ...)` or injected ports (AR4).

**Gotchas.** The save key equals the domain id; two domains cannot share one.
`tick(minutes)` runs from the existing game clock (AR3): do not add a timer.
`validate` receives `(slice, envelope)` and runs in dependency order inside
`validateSaveEnvelope` (`src/save_files.js:75`). `refresh` is deferred through the
render batch (`domain_registry.js:29`).

**Owner docs.** [ARCHITECTURE_RULES](../ARCHITECTURE_RULES.md) AR1-AR5, AR14.

---

## S8. World packs

**Use it for.** A world delivered as validated data: areas, institutions,
cohorts, people, relationships, exceptions, slots, secrets, crossings, plus
composable "world axes" (law, time, progression, and so on). Use when the world is
mostly content over existing engine features. For a world with its own
commands, state and panels, use S9 and keep packs for its catalog.

**Key API.**

| Export | Where |
|---|---|
| `validateWorldPack(raw)` | `src/world_pack_manifest.js:136` |
| `FAMILIES`, `WORLD_AXES`, `PACK_ROLES`, `AUTHORITY_MODELS`, `COVERAGE` | `world_pack_manifest.js:31,16,12,18,22` |
| `loadWorldPacks(raw, {features, ruleAdapter})` | `src/world_pack_loader.js:200` |
| `authorReport`, `playerNotices` | `world_pack_loader.js:275,287` |
| `BUNDLED_WORLD_PACKS`, `installedWorldPack`, `packNative` | `src/world_pack_registry.js:10,15,23` |
| `createPopulation(loaded, {root, instanceId})` | `src/world_pack_population.js:31` |
| `reconcileWorldPackSaves`, `migrateSection`, `createMigrationRegistry`, `validateSection` | `src/world_pack_save.js:106,68,54,32` |
| `sealedTermsIn(texts, secrets)` | `world_pack_manifest.js:76` |

**Data shape.** A pack has `id`, `revision`, `saveSchema`, optional
`saveCompatibleFrom`, `role`, `requires:{features, packs, ruleProfile}`,
`memberships`, `axes`, `lock`, `budgets`, family records, `native` (read by
`packNative`). The loader returns a frozen registry
`{order, packs, dormantPacks, diagnostics}` (`world_pack_loader.js:262-264`).

**Degrees of flexibility.**
- **Failure is dormant, not fatal.** Missing features, dangling references, cycles, budget overruns and bad crossings mark records or whole packs dormant with a diagnostic (`world_pack_loader.js:200-260`). `installedWorldPack` turns a dormant bundled pack into a loud error (`world_pack_registry.js:15-19`).
- **Layering.** Parents (cosmology, multiverse, cluster, series, universe) compose axes outermost first; a locked parent axis cannot be overridden (`composeAxes`, `world_pack_loader.js:29-61`).
- **Coverage tiers.** background, inspectable, playable; a "playable" area without a verb and a person is downgraded (`:131-134`).
- **Crossings** between packs must name an authority model (place, traveler, raw, equalized, dominant) plus conversion or cause where required (`:243-255`).
- **Sealed secrets.** `secrets` records carry `sealed`, `route`, `status`, `sealedTerms`; player-facing text is linted against sealed terms (`world_pack_manifest.js:74-78, 92, 118`).

**Consumers today.** Registry importers: `book_world_mol_actions.js:5`,
`book_world_mol_content.js:2`, `hp_brewing_state.js:6`, `world_pack_population.js`
(grep). Bundled packs: `book_mol_pack.js`, `book_hp_pack.js` (2). The registry
registers a read-only domain `world_packs` with no save (`world_pack_registry.js:24`).
**`world_pack_save.js` has no importer outside `src/world_pack_*`** (grep), and its
header says "nothing writes yet".

**Maturity.** Loader and registry: used in play (2 packs feed Cyoria content and
brewing). Pack save sections and `createPopulation`: tested only.

**How to plug in.**
1. Write `src/world_packs/<id>_pack.js` under its own id namespace (ids must start with the pack id, `inNamespace`, `world_pack_manifest.js:46`).
2. Add it to `BUNDLED_WORLD_PACKS` (`world_pack_registry.js:10`); `npm test` lints every bundled pack.
3. Read its data with `packNative(id)` in the world's content module (S9).
4. Keep sealed text out of player-visible fields; list terms in `sealedTerms`.
5. Do not store per-life state in the pack; that is S12 (planned `world_packs` save key).

**Gotchas.** Raising a pack `revision` is a save event (`packRevision` must match
at `validateSection`, `world_pack_save.js:35`), but nothing saves it yet.
A changed `saveSchema` or axes fingerprint makes `migrateSection` return
`schema-mismatch` or `profile-changed` unless a migration step exists
(`:88-93`). Two packs with overlapping namespaces: the later one goes dormant
(`world_pack_loader.js:208`).

**Owner docs.** `docs/worlds/` (WAC, WP rules cited in file headers), [MULTIVERSE_STRUCTURES](../worlds/MULTIVERSE_STRUCTURES.md), [WORLD_SECRETS_AND_DISCOVERY](../worlds/WORLD_SECRETS_AND_DISCOVERY.md).

---

## S9. Book-world hosts (Tingen, Cyoria, Paradise, Primordial)

**Use it for.** A source world that needs its own commands, people, resources,
state and panel on top of the shared simulation. Pattern, not a framework: each
world has `*_ids`, `*_content`, `*_state`, `*_host`, `*_domain`, `*_ui`.

**Key API (Tingen as the reference).**
- Domain: `registerDomain({id:'lotm', ...})`, `configureLotm` (`src/book_world_lotm_domain.js:17-21`).
- Command builder `cmd(id,label,location,d)` (`book_world_lotm_kit.js:19`); rule helpers `eq/gte/all/not/any/has/no` (`:7-10`); effect helpers `af, item, transfer, attention, know, money` (`:11-18`).
- Pathway factory `pathwayCommands(row)` (`book_world_lotm_pathways.js:15`), rows `pathwayRows` (`book_world_lotm_rows.js:82`).
- State envelope `createLotmState`, `validateLotmState` (`book_world_lotm_state.js:17-18`).
- Shared native base for retained worlds `createBookWorldNative(config)` (`src/book_world_native_base.js:8`), used by Cyoria and Paradise (header, `:1-5`).
- One import point for simulation definitions: `src/book_world_definitions.js` re-exports `paradiseDefinitions`, `molDefinitions`, `lotmDefinitions`.

**Data shape.** Pathway row (`book_world_lotm_rows.js`): `{key, pid, slug,
church, prefix, potion, next, base, nextSource, holds:{base,next}, officerId,
place, digest, ids:{accept,ingest,assess,promote}, labels, ladder, acts:[{id,
once, minutes, label, know}], know, sources, exam?}`. The factory turns a row into
accept, ingest, acts, assess, optional exam, and promote commands with matching
flags, facts, validators and a `definePath` descriptor (`book_world_lotm_pathways.js:1-4, 15-34`).

**Degrees of flexibility.**
- **Add a pathway** = add a row and two dose keys in the ids file (header of `book_world_lotm_rows.js:4-5`). Seer stays hand-authored.
- **NPC supervisor attention limit.** A native resource `book.lotm.attention` on the officer actor (stock 6, `book_world_lotm_content.js:11`); commands cost it with `attention(-1, officer)` and require `gte(...Attention, 1)` (`book_world_lotm_pathways.js:20-21`). Refill is outside the files I read (inference: owned by the host's tick or controllers; not verified).
- **Optional ownership.** Each world's slice may be absent; state validators assert nothing of that world exists without its owner (`book_world_lotm_state.js:20-26`).

**Consumers today.** Tingen: 4 pathway rows, 20+ `book_world_lotm_*` files, tests
`tests/lotm_*.test.js`. Cyoria and Paradise use the native base.

**Maturity.** Used in play (Tingen early slice, Cyoria, Paradise). Proposal-level
numbers: header says every authored value is a proposal (WPR5).

**How to plug in.** For a new pathway in Tingen: add a row, ids, and use the factory.
For a new world, copy the file set and follow S7 and S10. Register definitions in
`book_world_definitions.js`, state validator in the world's envelope validator, and
one `configureX` call from `main.js` (AR1).

**Gotchas.**
- **Exact-field envelope.** `validateLotmState` demands exactly the keys in `lotmEnvelopeFields` and `schema===1 && definitionRevision===1 && sourceSnapshot===... && sourceHash===LOTM_SOURCE_HASH` (`book_world_lotm_state.js:16,28-29`). Mother of Learning does the same (`book_world_mol_state.js:23-24`). Change any of those and every older save of that world is refused ("Preserve this save for its matching reader").
- **Saved jobs must equal admitted definitions.** For every saved job the validator finds the command and asserts actor, revision, cancellation, `costs` and `effects` are identical (`book_world_lotm_state.js:35-38`; Mol `:41`). Editing a command's costs, effects or duration breaks saves that hold that job in flight, even if you did not bump anything.
- **Prefix ownership.** Anything with the world's prefix in facts, resources, sources or completed commands is rejected when the slice is absent (`:21-26`).
- A world's job cannot run while another world's visit is active (`:33`).

**Owner docs.** [LOTM_SEER_SLICE_LAWS](../worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md), [BOOK_WORLD_ENTRY_MATRIX](../worlds/BOOK_WORLD_ENTRY_MATRIX.md), [CAMPAIGN_FRAMEWORK](../worlds/CAMPAIGN_FRAMEWORK.md).

---

## S10. Simulation: commands, jobs, boundaries

**Use it for.** Anything an actor does that has requirements, costs, effects and
perhaps a duration: timed brewing, a ritual, a work shift, an NPC errand.
Families in the registry: people, commands, powers, advancements, sites, events,
controllers, transitions, origins, conditions, encounters, energies, pursuits,
situations, containers (`src/simulation_contracts.js:99`).

**Key API.** `createSimulationRegistry(defs)` (`simulation_contracts.js:105`),
`previewSimulationCommand` (`src/simulation.js:103`), `commitSimulationCommand`
(`:268`), `cancelSimulationJob` (`:329`), `setSimulationProgram` (`:351`),
`nextSimulationBoundary` (`:491`), `advanceSimulationBoundary` (`:525`),
`validateSimulationEffect` (`simulation_contracts.js:47`),
`validateSimulationState` (`:226`).

**Data shape (command).** `{id, revision (>0), label, requires?, visibleWhen?,
costs:[...], effects:[...], duration? (minutes), cancellation:'none'|'refund'|'forfeit',
siteId?, powerId?, participants?, targetDefinitionId?, outcomes?:[{id, weight,
effects}], claim?, completionRequires?, audience?, group?}`
(`simulation_contracts.js:105-142`). Saved job: `{id, sequence, commandId,
revision, actorId, targetId, due, effects, costs, cancellation, siteId, claim,
label, roll, outcomeId, context, participants}` (`simulation.js:236-238`).

**Effect types** (validated list, `simulation_contracts.js:43-70`): spawn, relocate,
fact, resource, vital, body, item, transfer, custody, xp, reputation, knowledge,
relationship, claim, condition, life, source, faculty, power, progress, energy and
others in the `operations` set.

**Degrees of flexibility.**
- **Costs reserve existing means.** Item, resource, vital must be negative or an expression; types allowed: item, resource, vital, transfer, custody, energy (`:112-120`). Outcome debits must be reserved as costs.
- **Timed jobs.** `duration` > 0 makes a job that completes at `due`; `cancellation` picks refund or forfeit of reserved costs. Paid-forfeit completion needs `completionFailure` plus group rules (`:131-137`).
- **Weighted outcomes** with distributions resolved at accept time and stored in the job (`outcomeId`, `roll`).
- **Sites** have capacity and per-job reservations (`:143-144`, validator `:300`).
- **Programs** repeat a command N times, pausing when support is lost (`simulation.js:351`, validator `:317`).
- **Boundaries.** The engine jumps to the earliest of job due, condition expiry/tick, controller due, event expiry, lifespan, constructs, storylets (`simulation.js:491-505`). A new timer-like thing must add its boundary here, not a `setTimeout` (AR3).

**Consumers today.** Registry built from ~15 world files' definitions; 54 domain
registrations feed contexts. `simulation.js` imports about 25 per-world runtime
hooks (`simulation.js:1-36`), so a new world's accepted-job stamping and completion
context is often an edit to this file (high-contention, one writer).

**Maturity.** Used in play.

**How to plug in.**
1. Write command definitions in the world's content file (use that world's `cmd` helper).
2. Export them into the registry through the single definitions file (S9) so `createSimulationRegistry` validates them.
3. Preview with `previewSimulationCommand` for the UI quote, commit with `commitSimulationCommand(state, registry, command, context, expectedSequence)` (AR7).
4. If completion needs extra world logic, add a hook like `stamp*Job` / `*CompletionContext` as the existing worlds do; prefer reusing effect types first.
5. Add focused tests in `tests/simulation*.test.js` style; run only that file (AD36).

**Gotchas.**
- `revision` must be a positive natural; the saved job stores it and world validators compare it (S9).
- Edit a command that has in-flight jobs and the saved job no longer equals its definition: loads refuse. Either bump the owner `definitionRevision` (which refuses older saves wholesale) or add a new command id and keep the old one for old jobs (inference; MR33 old-save compatibility is deferred, see S12).
- One job per actor at a time (`busy` set, `simulation_contracts.js:265`) and no overlap with practice or pending items.
- `expectedSequence` guards stale clicks.

**Owner docs.** [AR7, AR12](../ARCHITECTURE_RULES.md), [DOMAIN_RULES](../DOMAIN_RULES.md), MAKING_RULES for crafts.

---

## S11. Expansion engine (actions, opportunities, worlds, schedules)

**Use it for.** The older action layer: authored actions with `requires`, `costs`,
roll tables, `completionScope` (actor, scenario, world, journey, campaign),
recurring service windows, opportunities, scenario checkpoints and rewind.

**Key API.** `createContentRegistry({worlds, actions, opportunities, capabilities,
sources, rollTables, techniques, simulation})` (`src/expansion_engine.js:353`),
`evaluateAction` (`:470`), `commitAction` (`:584`), `advanceSimulation(state,
registry, minutes, external, gameplay, contexts)` (`:639`), `cancelAction` (`:699`),
`checkpointScenario`/`rewindScenario` (`:718,734`), engine schemas
`ENGINE_SCHEMA` 5, `FEATURE_ENGINE_SCHEMA` 6, `NESTED_ENGINE_SCHEMA` 7,
`CONTINUED_LIFE_ENGINE_SCHEMA` 8 (`:71-75`).

**Data shape (action).** `{id, worldId, revision>0, duration, repeatable,
completionScope, requires, visibleWhen, costs[], outcomes[], effects[], rolls[],
schedule?, cancellation?, durationModifiers?, modifiers?, opportunityId?}`
(`:376-405`). `schedule` is `{period, opens, closes}`, validated by
`validateSchedule` (`world_rhythm.js:15`).

**Degrees of flexibility.** Recurring availability from the saved calendar; a
repeatable action is required for a schedule (`:384`). Duration modifiers
operate set/add/subtract.

**Consumers today.** `advanceSimulation` is the entry that drives S10 boundaries
(it passes `simulationContexts`). Used by main, feature-expansion and
backlog-expansion modules (many files, grep: `expansion_engine` imported widely;
count not taken).

**Maturity.** Used in play. For new mechanics prefer S10 commands; the engine
also hosts the world and state tables S10 hangs off (inference from structure).

**Gotchas.** Costs are commitment costs; outcome debits are rejected
(`:386-388, 404`). A state change here changes `ENGINE_SCHEMA` family numbers;
check `validateExpansionState` (`:171`) before adding fields.

---

## S12. Persistence

**Use it for.** Making state survive reload, Export and Import.

**Key API.** `validateSaveEnvelope(original, currentVersion)` (`src/save_files.js:64`)
chains per-owner validators then `domainRegistry.validate` (`:75`); version check
rejects a save from a newer game (`:100-103`); `encodeSaveFile`, `importSaveFile`,
`checkSaveSize` (budget 4 MiB), `writeGuardedSave` (`:219,229,244,252`);
`prepareFoundationSave` (`src/save_compatibility.js:20`), `prepareV06Save`
(`src/save_migration.js:3`); pack sections `reconcileWorldPackSaves` (S8).

**Data shape.** One JSON envelope. Domains add `envelope[domainId]` (S7). Worlds
add their own key with schema, `definitionRevision`, `sourceSnapshot`, `sourceHash`
(S9). Pack sections (planned, unwired): `{packId, packRevision, schema, delta:{instances, retired}}`
(`world_pack_save.js:19`).

**Degrees of flexibility.**
- **Per-domain `migrate`** hook runs before `load` (`domain_registry.js:28`). Use it for compatible shape change.
- **Pack sections** have a real migration chain: one step per `(pack, from)`, `saveCompatibleFrom` lets cosmetic revisions pass, unknown ids retire into `retired` storage, unloadable packs are kept verbatim as dormant (`world_pack_save.js:54-130`). Tested only.
- **Current policy.** 2026-10-17: "old save compatibility is no worry for now"; work may reset or drop old state, but new state must round-trip Save, reload, Export and Import ([decision](../USER_VISION.md#old-save-compatibility-deferred-2026-10-17), recorded in PROJECT.md). This supersedes MR33 for now.

**Maturity.** Used in play. The envelope validator is a long hand-ordered chain
(`save_files.js:64-110+`), and AR1 limits new lines there (one registration line,
paid for by moving one out).

**How to plug in.**
1. Prefer a domain slice (S7): `initialState`, `save`, `validate`, `migrate`, `load`.
2. Validate shape strictly but derive allowed values from the definition, not a frozen whole-save schema (the pack validator's stance, `world_pack_save.js:31`).
3. If the slice references another owner's records, check them in `validate(slice, envelope)` (cross-owner checks keep validation order, AR6).
4. Prove save, reload, Export and literal Import in a rebuilt browser (AR9, AGENTS verification).
5. State in the task record that old state is reset or dropped, per the 2026-10-17 decision.

**Gotchas.**
- Exact-field validators (`Object.keys(d).length === fields.length`) refuse any save with an extra or missing key (`book_world_lotm_state.js:28`, `book_world_native_base.js` `shape()` at `:12`).
- `definitionRevision` or `sourceHash` mismatch refuses the save.
- Saved jobs must equal the admitted command definition (S9, S10).
- Do not write saves from a new module; one writer (AR3, `createDurableSaveWriter`, `save_files.js:281`).
- User saves stay private and untouched (AGENTS safety).

---

## S13. Knowledge, observation and sealed truth

**Use it for.** What a character knows versus what is true; hiding a fact until
it is appraised or discovered; observer-safe views.

**Mechanisms and where they live.**

| Mechanism | Where | Notes |
|---|---|---|
| Per-actor knowledge with stages `seen`, `interpreted`, `understood`, each with `value`, `at`, `cause` | simulation `knowledge` effect (`simulation_contracts.js:61`), saved at `s.knowledge` (`:255`) | The Tingen kit's `know()` builds it with a `basis:{kind, attributedTo, situationId}` (`book_world_lotm_kit.js:15`). |
| Hint precision of a missing requirement | `evaluateGate` `knows(fact)` (S2) | Per fact, caller decides. |
| Vague row for unknown rules | `clearanceFor(..., {known:false})` (S6) | |
| Observation channels with leases and receipts | `src/observation_channels.js:31-43` | 1 importer. |
| Discovery counts across lives | `src/discovery_codex.js:17` | Seen ids per kind: item, lesson, knowledge. |
| Known people view | `src/people_knowledge.js:12` | 4 importers. |
| Sealed secrets in packs | `secrets` family, `sealedTermsIn` (`world_pack_manifest.js:76`) | Lints player text. |
| Observer-safe projections | AR8 | Projections never grant authority or leak sealed truth. |

**Degrees of flexibility.** Knowledge is staged, attributable and per actor, so an
NPC can know what the player does not. Gate hints use the same idea per fact.
There is no single "reveal" API; reveal is an effect (`knowledge`) plus a
projection that reads it (inference from code).

**Maturity.** Mixed. The knowledge effect is used in play (Tingen, Mol).
`observation_channels.js` is wired thin. Pack `secrets` linting is in the loader
(used for 2 packs).

**How to plug in (hide a truth until appraised).**
1. Store the truth in owner state or a sealed pack secret (id, route, status only in docs and UI, per AGENTS "Sealed secrets").
2. Add an appraisal command whose effects include a `knowledge` effect at stage `interpreted` or `understood`.
3. Make the projection show the truth only when the actor's knowledge key exists at the needed stage (AR8).
4. For a gate hint, pass `knows: fact => hasKnowledge(fact)` into `evaluateGate`.

**Gotchas.** Never put a secret's truth in chat, summaries, indexes or UI text
outside its discovery route (AGENTS). A `not` over an unknown fact is not met
(S1), so "not yet known" must be an explicit flag.

---

## S14. Body, lives, heirs, continuation

**Use it for.** Death and succession, carrying things between lives, one native
body owned and controlled by an actor, body conditions.

**Key API.**
- Heir laws and inheritance: `HEIR_LAWS`, `heirLaw`, `resolveHeir(law, kin)`, `deriveHeirLeftovers`, `applyHeirLeftovers` (`src/heir_inheritance.js:28,37,44,80,163`). Law choice is a domain command `set` (`src/lives_carry_domain.js:39`).
- Family tree frozen references (`src/family_tree.js:17`).
- Continuing one self across journeys: `planContinuation`, `beginContinuation`, `continuationEligibility` (`src/continuation_state.js:118,72,27`); retention anchors (`continuation_retention.js:15`).
- Body sources, conditions, commands (`src/body_progression.js:16,25,37`).
- Lineage and cultivation root (`src/lineage_domain.js`, `src/cultivation_root.js`).
- Life record (lossy biography, not an authority) (`src/life_record.js:5`).
- Body ownership in the simulation: `body.id`, `ownerId`, `controllerId`, `form`, `hands`, `mobile` (checked in `book_world_effects.js:19-22` and `book_world_lotm_state.js:31`).

**Degrees of flexibility.** Heir law is a named row (default `single-successor`,
`heir_inheritance.js:36`) with dials in `HEIR_OBLIGATIONS`; resolution reads kin.
Continuation uses a native snapshot, never nested journeys
(`continuation_state.js:5`). A world's body policy is a string
(`bodyPolicy: 'same_native_body'` in Mol, `book_world_mol_state.js:24`).

**Consumers today.** body_progression 10 importers; heir_inheritance feeds
`lives_carry_domain.js`; continuation has its own validators in the save chain
(`save_files.js:66`).

**Maturity.** Used in play. Header notes call heir values reversible proposals.

**How to plug in.** For a new life law, add a row to `HEIR_LAWS`. For a new
carried asset class, add it to the continuation baggage rules and name what
carries per class (GTR28). For a world body, set owner and controller ids on the
simulation person's `body` and let `book_world_effects.js` pattern guard it.

**Gotchas.** Frozen lineage lines are copied at creation, never recomputed
(`family_tree.js` header). A person's `lifePolicy` sets lifespan and what happens
to their work (`refund`, `forfeit`, `finish`; `simulation_contracts.js:101`).

---

## S15. Seeded generation (`gen_kit`)

**Use it for.** Deterministic, address-keyed draws: generated people, rolls,
loot picks, shuffle bags, retry-with-fallback. Same address, same result,
regardless of call order.

**Key API.** `address(...parts)` (`src/gen_kit.js:44`), `hash64`, `drawU32`
(`:65`), `drawFraction`, `indexFromU32`, `pickWeighted`, `pickStratified`,
`shuffleBag`, `pity`, `sampleAndScore`, `withRetries` (`:169`), `peek`/`commit`
cursor helpers (`:185,191`). Stream roots live in `src/seeded_streams.js`
(`scopedStream(name, world)` `:37`; `createStreams`, `validateStreams`).

**Degrees of flexibility.** Include world, life and table revision in the
address so a content revision does not reshuffle earlier results (header,
`gen_kit.js:1-4`). Pass the existing stream root, not the legacy seed.

**Consumers today.** 23 importers (craft, mixture, check, world pack, rune
modules, peer standing, hp brewing). Test: `tests/gen_kit.test.js`.

**Maturity.** Header says proposal; wired through crafting and checks, so used in
play.

**How to plug in.** Take the stream root from the owner's saved streams, build an
`address(...)` from stable ids plus revision, draw, and record the receipt in
owner state if the outcome must replay.

**Gotchas.** Nothing here saves state; cursors are owned by the caller
(`gen_kit.js:1-3`). `compareCodePoints` is locale-free; use it for any sort that
feeds an address.

---

## S16. Tags

**Use it for.** Presence tags on items and entities, with observer-aware reads
that do not leak concealed tags.

**Key API.** `TagRegistry` (`src/tag_store.js:33`), `tagFacts(entity, observer,
options)` (`:100`), `TagStore` (`:136`). Header: "Standalone presence tags. No
gameplay state, clocks, strengths or effects."

**Degrees of flexibility.** Registries are immutable per content revision; item
boolean maps are accepted (`tagIds`, `:23-31`). No strengths, so a graded
property needs a different system (resource or condition).

**Consumers today.** 3 importers: `craft_materials.js`, `mixture_rules.js`,
`rule_modules.js` (grep). Test: `tests/tag_store.test.js`.

**Maturity.** Wired, thin.

**How to plug in.** Define a registry with your tag ids per revision; call
`tagFacts` to feed facts into S1.

---

## S17. UI ports and panels

**Use it for.** Adding a panel that reads live game state without importing
`main.js`.

**Key API.** `configureUiPorts(next)`, `ports()`, `whenPortsReady(fn)`,
`readPort(name, ...args)` (`src/ui_ports.js:15,19,21,24`); `definePanel({id, title,
role, node, home, discovered, eligible, unavailableReason, settings, emptyText,
after, defaultDock})` (`src/panel_kit.js:7`); `shownOrDeferred` (`src/panel_reveal.js:18`).

**Data shape.** Ports named in the header (`ui_ports.js:1-9`): `character`,
`counters`, `gameStats`, `expansion`, `records`, `presentation`, `equip`,
`unequip`. `role` must be one of `actions, character, records, log, optional`
(`panel_kit.js:4,10`; unknown role throws).

**Degrees of flexibility.** `discovered` and `eligible` control reveal; an
undiscovered panel keeps its content out of label scans. `readPort` swallows a
throwing port and returns `undefined`, so panels must treat missing as "nothing
yet" (`ui_ports.js:23-24`). Panels mount through a domain's `panels` array (S7).

**Consumers today.** `ui_ports` 18 importers; `panel_kit` 46 (grep).

**Maturity.** Used in play.

**How to plug in.**
1. Build the node in `<feature>_ui.js` with `read`/`act` injected (as Tingen's `createLotmPanel`, `book_world_lotm_domain.js:24`).
2. Wrap with `definePanel` and a role.
3. Mount from the domain's `panels: [() => ...]`.
4. Read live data with `readPort`; never import `main.js` (AR5).
5. UI work follows [UI_RULES](../UI_RULES.md) and the standing UI priority: desktop first, evidence at the target viewport (AGENTS).

**Gotchas.** Ports are frozen on configure; adding a new port means editing
`main.js` (one registration line, AR1).

---

## S18. Debug, cheat and inspector views

**Use it for.** Author-only inspection of chains and gates; cheat-library cards;
the dev console.

**Key API.** `projectChains(frame, {developer})` returns `[]` unless
`developer === true` (`src/chain_inspector.js:96-98`); it renders gate rows with
reason, dials and routes (`:86-87`). `validateCheatCard`, `grantCheat`
(`src/cheat_cards.js:32,69`), cards describe behavior and run no hooks.
`enableDevConsole` (`src/dev_console.js:13`) is gated by `config.enable_dev_mode`.
`readCheckInspector({author, ...})` (`src/check_inspector.js:7`).
Game MCP: `yairpg-game` (AGENTS "Game MCP").

**Degrees of flexibility.** Author reasons stay author-only (GTR10); inspector
rows are the place to show dials and routes.

**Maturity.** Used in play (dev). Cheat cards: data contract with a few live cards.

**How to plug in.** Give a new gate or chain a row in `projectChains` input; keep
player text separate from `authorReasons`.

---

## S19. Clocks and recurring windows

**Use it for.** Calendar-bound availability and "this place runs on its own
clock".

**Key API.** `calendarMinutes`, `validateSchedule`, `recurringWindow(schedule,
minute, lastClaim)` (`src/world_rhythm.js:5,15,20`): availability is derived from
the saved calendar and never creates occurrences or simulates missed rewards.
`engineNow`, `engineTimeout`, `engineInterval` for engine timers
(`src/simulation_clock.js:10,22,28`). Per-place ratios in
`src/owned_place_clock.js` (header: HTP45 pilot, proposal). Realm clock leases
in `src/realm_clock_leases.js` (pure proposals over the played clock).

**Degrees of flexibility.** Schedule `{period, opens, closes}` in game minutes
(30-day months, 12-month years, `world_rhythm.js:5-8`). Window answers open,
claimed, remaining, `nextIn`. No offline accrual exists yet
([overflow doc](../PROGRESSION_GATE_OVERFLOW_2026-10-23.md) intro).

**Consumers today.** `world_rhythm` is imported by 21 files (grep).

**Maturity.** world_rhythm used in play; owned-place and lease clocks are proposals.

**Gotchas.** An advancing activity names its clock owner (AR12). Do not add a
timer; add a boundary (S10).

---

## Common tasks, which system

| # | Task | System | Degree and how |
|---|---|---|---|
| 1 | Add a rank ladder for a new world | S3 (+ S10 for the acts) | `definePath` with stages; position and facts from your domain; crossings read facts your commands set |
| 2 | Add a Tingen pathway | S9 pathway row | Add a row plus two dose keys; factory builds commands and descriptor (`book_world_lotm_rows.js:4-5`) |
| 3 | Require a ritual before promotion | S10 command + S2/S3 | Ritual is a timed command with `cancellation`; it sets a flag fact; a crossing or gate reads the flag |
| 4 | A requirement met by several routes | S1 `any` inside S2 | `requires:{any:[...]}` (as `pledges.tempering`); add costly non-fact workarounds under `routes` |
| 5 | Show an exact hint only if the character knows | S2 `knows` | Per-fact `hint` plus `knows(fact)`; else `VAGUE_HINT` |
| 6 | Per-world or per-tier threshold | S2 dials | `{dial:'need'}` with default, override per call |
| 7 | Time-gated brewing or crafting | S10 `duration` + `cancellation` | Timed job, costs reserved; refund or forfeit on cancel |
| 8 | A daily or weekly window (market day, class) | S19 / S11 `schedule` | `{period, opens, closes}` in game minutes |
| 9 | Hide a truth until appraised | S13 | Appraisal command emits a `knowledge` effect; projection checks stage |
| 10 | An NPC supervisor's attention limit | S9 / S10 | Native resource on the NPC actor, commands cost it (`attention(-1, officer)`), require `>= 1` |
| 11 | Progress past a cap is banked, converted or lost | S4 overflow rows | Add world row (policy, reason, dials); gates cannot enforce overflow today |
| 12 | A credential another party can revoke | S2 `closes:'revocable'` + S6 | Gate states `closeReason`; the owner re-evaluates and holds the record (GTR25) |
| 13 | Role plus group needed for a dangerous item | S6 clearance | `group:{min, atLeast}` row with a vague line |
| 14 | Reputation-gated service | S5 + S1 | `rankFacts` into a rule; thresholds are dials |
| 15 | New world mostly as content | S8 pack | Pack under its own namespace; add to `BUNDLED_WORLD_PACKS`; read with `packNative` |
| 16 | New world with its own verbs and panel | S9 + S7 + S10 | Copy the file set; one `registerDomain`; definitions through `book_world_definitions.js` |
| 17 | Keep old saves loading after adding a command | S12 / S10 | Add a new command id, leave existing definitions byte-equal (jobs compare costs and effects); or use the 2026-10-17 reset decision and say so |
| 18 | Change a world's source text or hash | S9 | Refuses older saves of that world; treat as a save event |
| 19 | Deterministic generated people or loot | S15 | `address(world, life, table@rev, slot)` then draw |
| 20 | Tag items or materials with presence tags | S16 | `TagRegistry` per revision; `tagFacts` into rules |
| 21 | Choose the heir rule | S14 `HEIR_LAWS` | Add a row; law is a domain command `set` |
| 22 | A new panel that appears when discovered | S17 | `definePanel` with `discovered`/`eligible`; mount from domain `panels` |
| 23 | Show author-only gate reasons | S18 | `projectChains(..., {developer:true})` |
| 24 | Add a new timed thing (timer, decay, expiry) | S10 boundary | Add it to `nextSimulationBoundary`; never a new timer (AR3) |
| 25 | A hidden-until-reached UI element | S2 kind `presentation` + S17 | `reveal_chain.js` pattern; never hide what was reached (GTR18) |

---

## Gaps and duplicates

| Code | Finding | Evidence | Effect on a mechanic author |
|---|---|---|---|
| G1 | **Gate `overflow` is validated but never read.** No gate sets it; the working overflow lives in S4 rows keyed by world, not on the gate. | `progression_gates.js:43-44`; no `.overflow` consumer in `src` | An author who writes `overflow` on a gate gets no behavior. Use S4. |
| G2 | **Only 3 of 5 overflow policies run** (lost, banked, converted). Spill and pressure are vocabulary only. | `skill_overflow_domain.js:10-24`; [overflow doc](../PROGRESSION_GATE_OVERFLOW_2026-10-23.md) GTO9 | Spill and pressure need a consumer first. |
| G3 | **Gates are barely adopted** (4 gates, 4 importers) while hand-written "requires" fact rules exist in every command. | grep `defineGate(` | A new gate is still a pilot; consider S1 inside a command first. |
| G4 | **`definePath` has no OR crossing and `pathView` only walks forward one stage**, though shapes tree, web, wheel, stack and field validate. | `ascension_paths.js:8, 47, 128` | Non-ladder shapes have no reader. A branching path needs a new view or per-branch ladders (as Tingen does with one path per pathway). |
| G5 | **World pack saves are not wired.** Population, delta sections and migrations are tested only; nothing writes a `world_packs` save key. | `world_pack_save.js:1-2`; grep: no importer outside `world_pack_*` | Per-life state for a pack-based world has nowhere to persist yet. |
| G6 | **Save validation is split four ways**: domain slices, a hand-ordered chain in `save_files.js`, per-world exact-field validators, and pack sections. | `save_files.js:64-110`; `domain_registry.js:22-28` | Pick the domain slice (S7) for new state; do not extend the chain. |
| G7 | **Three definition-pinning styles** for worlds: Tingen and Mol use `definitionRevision` plus `sourceHash`, packs use `revision` plus `saveSchema` plus axes fingerprint, expansion uses `ENGINE_SCHEMA` numbers. | `book_world_lotm_state.js:16`, `world_pack_save.js:35`, `expansion_engine.js:71-75` | A cross-cutting "bump" means three different things. |
| G8 | **Saved jobs equal command definitions.** Any edit to costs, effects or cancellation of a command with a job in flight refuses the save. No registry-level "legacy command" mechanism. | `book_world_lotm_state.js:38`, `book_world_mol_state.js:41` | Safe edits are new command ids; or rely on the 2026-10-17 deferral. |
| G9 | **Simulation accept and complete hooks are a per-world edit to `simulation.js`** (about 25 imports at the top, string-group lists). | `simulation.js:1-36, 239` | High-contention file; one writer; a generic hook table would remove the edit. |
| G10 | **Two requirement vocabularies** for access: gates (`requires` + hints) and clearance (roles, grades, groups), plus faction rank bands; they do not share an interface. | S2, S5, S6 | Choose by shape; a fourth system is not needed. |
| G11 | **NPC attention refill not located.** The resource exists and is spent; where it refills was not found in the files read. | `book_world_lotm_content.js:11` | Verify before copying the pattern. |
| G12 | **Knowledge has no single reveal API**; reveal is `knowledge` effect plus a per-owner projection, so each world re-implements "show once known". | S13 table | Easy to leak sealed truth; follow AR8 and AGENTS sealed-secrets rule. |
| G13 | **Duplicated progress ledgers**: skill XP caps (S4), path ceilings (S3), breakthrough setback (`breakthrough_trial.js`, unwired), pledges stages (`pledges.js`) each model "progress with a cap" separately. | [overflow doc](../PROGRESSION_GATE_OVERFLOW_2026-10-23.md) GTO1-GTO10 | Consolidation would be a design decision for Weibao, not an agent default. |
| G14 | **Clearance and Tingen gating are one-world** (1 importer). The generic claim rests on a fixture (AR11). | `clearance.js` header | Treat as a pattern to copy, not proven reuse. |

## Update rule

When a system listed here changes shape, update its entry in the same change and
re-grep every `file:line`. This file orients; the code and the rulebooks win on any
disagreement.


## D4 native cheat consumers, 2026-10-25

The cheat domain (`src/cheat_host.js`) owns `cheats` and retained `cheats_quarantine` slices; `src/cheat_mechanisms.js` plans full-envelope actions and publishes through the injected native guarded writer. It reuses progression-gate evaluation for lived insight, `harvest.observeCarcass` for timed appraisal, the native finite harvest routine for habit, and `seeded_streams` for fate and paid loot calls. Pending calls and enduring keyed overrides live in the stream cell; observer logs are not their authority. The existing continuation restore and heir builder call the personal-faculty carrier; no second return system was introduced. These are bounded native consumers, not support for arbitrary reference cheats. [D4 exact state and remaining scope](../gm/dispatch/cheats-2026-10-25/CHECKPOINT.md).
## D7 HP application, 2026-10-25 branch candidate

`book.hp` now supplies original school/trade life data in
`src/world_packs/book_hp_life_data.js`, admitted by the bundled loader and adapted
by `src/book_world_hp_content.js` to the existing structured-pack compiler.
This adds a second world application of S8/S9/S10/S12 and the ability descriptors,
not another save owner or method interpreter. Native body, stock, custody, jobs,
XP, mastery and exact selection/content receipts retain their existing owners.
`src/book_world_hp_facts.js` projects the local lesson windows and read models;
`world_calendar.js` projects its elapsed header clock. Scope and proof:
[D7 checkpoint](../gm/dispatch/hp-world-2026-10-25/CHECKPOINT.md).

### E3 typed beginning presentation seam, 2026-10-25

`createStructuredBeginningChoices` in `src/structured_beginning_choice.js` accepts
presentation registrations referencing loader-owned typed starts. Both HP lives
consume it through `registerHpBeginnings`; the existing Beginning workspace previews,
confirms or cancels selection. Preview is transient and grants nothing. The durable
receipt and cargo grant remain in `planStructuredSelection`/`beginStructuredCampaign`;
there is no new save slice. Saved D7 definitions and commands remain exact. This is
a public entry presentation seam, not a world-law permission list or travel system.
Evidence: [E3 checkpoint](../gm/dispatch/hp-arrival-2026-10-25/CHECKPOINT.md).
