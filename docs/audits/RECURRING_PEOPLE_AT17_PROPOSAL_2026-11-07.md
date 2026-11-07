# Recurring people (AT17): wake a role at first durable reference

Status: proposal under AD32, not accepted. Design lane, 2026-11-07. Claims are tagged **read** (with locator) or **inferred**. Sealed secrets are not touched; B11 is the backlog row, no plot detail. Line numbers are the dirty primary tree at start of lane.

## 1. What exists

- **Persistent person = three records.** `simulation.people[id]` plus `state.actors[id]` plus a registry definition. Every knowledge, relationship, claim, custody, job and owner key must name one: `person()` asserts `stableId && s.people[id] && state.actors[id]`, "Unknown persistent actor" (`src/simulation_contracts.js:243`; knowledge loop at :260-261). read
- **What a save carries per person**: `{life, inventory, location, bornAt, definitionId, definitionRevision, vitals?, body?, lifePolicy?, createdBy?}` plus an `owners[id]` entry and an `actors[id]` shell (`src/simulation.js:76-81`, `src/simulation_effects.js:325-329`, `src/book_world_lotm_cast_host.js:150-158`). Roughly 300-450 bytes per person. inferred (size)
- **A world-neutral promoter already exists: the `spawn` effect.** It takes `personId` or `instanceKey`, a `definitionId`, and an optional frozen `template`; it writes actors, people, owners and controllers, stamps `createdBy`, uses `bornAt = state.clock`, and refuses a duplicate personId (`simulation_contracts.js:52-56`, `simulation_effects.js:320-330`). read
- **Registry-only definitions keep a life byte-identical.** `provision:false` definitions are skipped by `enrollSimulation` (`simulation.js:74`). The LOTM host registers household-act templates this way "for save validation" (`book_world_lotm_cast_host.js:182-185`, installed at :239). read
- **LOTM roles today.** Packs of at most `CAST_EAGER_PEOPLE_LIMIT=256` enroll everyone (the shipped byte contract); larger packs enroll non-roles plus `householdActs.requiredPeople`, and roles stay registry-only (`:148-149`). `enrollCastBody` writes the body with `bornAt = state.lotm.initializedAt` (`:150-158`). read
- **Promotion triggers in the host**: `syncLotmCast` enrolls a person when the wake projection places them (`projectedPlaces`) or `referencedCastPeople` finds them in a job, session, controller, program, workPlan cursor, pursuit or pending context (`:160-171`, `:301-308`). `createWakeQueue` is a derived, unsaved projection rebuilt after load (`src/wake_queue.js:1-3`; `:262-275`). `missingCastBodies` flags the sync as due (`:280`). read
- **Dormant restore.** With the pack absent, `restoreUnavailableCast` re-registers name-free definitions, but only for ids matching `lotm.person.cast-<20hex>` or `lotm.role.<slug>` (`:375-381`). read <!-- slip-ok: describes current code, not a design rule. -->
- **Constables.** Fighters in the door fight spec only (`src/book_world_lotm_constables.js:34,191`). Lane M works around persistence by keeping `door` in slice `constables@1` and a Tingen reader (`:62-81,134-140`); the checkpoint calls persistent constables "the proper fix" (CHECKPOINT, lane M receipt). W6-A's `recordFightSight` writes knowledge only if `simulation.people[id]` and `actors[id]` exist (`src/tempo_fight_domain.js:76-90`). read <!-- slip-ok: describes current code, not a design rule. -->
- **AT17 and B11** (`PROGRESS_ATLAS_2026-11-04.md:118`; `MECHANISM_BACKLOG.md:17`): Route A is `requiredPeople` (pack-wide, persistence change, needs export/import/reload asserts); Route B text roles, taken by the window that needed it. read

## 2. Failure modes

- **F1. "Unsupported persistent person."** Fires at `simulation_contracts.js:251` when a saved person's `definitionId || id` is not in `registry.simulation.people`. `validateSimulationState` is called with the registry on nearly every simulation commit and on enroll (`simulation.js:92,190,261,302,375-481,801-809`, plus structured, causal-story and expansion hosts). So it fires at load, import, and the first command after, as well as at promotion. read <!-- slip-ok: describes current validator behavior, not a design rule. -->
  Triggers: (a) a promoted role whose pack is not loaded yet, in an id shape the dormant regex does not match; (b) a pack re-extraction that renames a role id; (c) a spawned instance whose template was never registered; (d) an older build importing a newer save (forward only). B10-era page-load failure showed this symptom (`KJ3P_IMPLEMENTATION_RECEIPT.md:76`). (a)-(c) read; (d) inferred
- **F2. "Unknown persistent actor".** A durable write (knowledge, relationship, claim) names a person who was never promoted. This is the constables' failure. read <!-- slip-ok: describes the current save failure, not a design rule. -->
- **F3. Duplicate spawn.** `spawn` throws on an existing personId (`simulation_effects.js:321-322`), so a second fight or a replayed plan breaks unless promotion checks first. read
- **F4. Two clocks for `bornAt`.** `enrollCastBody` uses pack start, `spawn` uses the live clock; `lifePolicy` ageing counts from `bornAt` (`simulation.js:663`). Mixed paths age people differently. read
- **F5. Double witness rows.** Once constables are persistent, the knowledge reader and the `door` reader can both emit a row per constable. inferred
- **F6. Rewind.** The wake projection resets when `clock < projectedClock` (`:262-268`); a promoter keyed to the projection could re-promote. inferred

## 3. Recommended shape: promote at first durable reference, through `spawn`

**Trigger.** Default: a role is promoted when something durable would name them (knowledge, relationship, claim, job, or a fight that resolves with them on the field), not at first appearance in text. Dial: a per-role `recurs: true` flag for people who should be on stage from the first scene. Reason: the validator itself demands existence at that moment (F2), and "first reference" is what the LOTM host already computes (`referencedCastPeople`), so it generalizes instead of adding a second trigger. A text role that is never referenced costs zero bytes.

**Promotion call.** Default: one world-neutral `promoteRole(plan, registry, {definitionId, personId, cause})` in a leaf module, a thin wrapper that checks `simulation.people[personId]` first (idempotent, F3) and then applies the existing `spawn` effect. It runs inside the same plan, before any write that names the person. Dial: a `bornAt` choice, default live clock (`spawn`), with `bornAtAnchor` for packs that want `lotm.initializedAt` so ageing matches enrolled neighbours (F4). Reason: one path, one clock rule, and no new save key. Ordering matters: promotion lands before W6-A's sight write or the constable is skipped on fight one.

**What is stored.** Default: nothing new. A promoted person is an ordinary `people` entry (`definitionId`, `definitionRevision`, `createdBy` = promoting cause, `life`, `location`), plus `actors` and `owners` shells. The wake queue and projections stay unsaved. Dial: none to add. Reason: AR3 (one authority) and AR6; no slice means no migration and no exact-field validator risk (SAVES G3).

**Stable ids.** Default: a singleton role keeps its definition id as the person id (`lotm.role.x`); a templated multiple uses fixed slot ids authored with the definition (`book.lotm.constable.1`, `.2`), never a runtime counter. Dial: a saved counter only for a world that needs unbounded instances, then recorded as its own SAVES row. Reason: a fixed id survives export, import and rebuilds; counters drift across rewind.

**Registry.** Default: every promotable definition is registered at all times, with `provision:false`, from a code module that does not depend on a private pack (constables) or, for pack roles, registered by `installCast` (already true). Dial: a name-free dormant fallback (the `restoreUnavailableCast` pattern) for any pack-backed id shape beyond the two regexes. Reason: F1 fires on definition absence, so absence must be impossible after a promotion.

**Untouched life stays byte-identical.** Default: registry-only definitions plus `provision:false`; no promotion runs unless a reference occurs. Assert: encode an untouched life before and after the change and compare bytes. Reason: shipped saves must not gain bodies (`CAST_EAGER_PEOPLE_LIMIT` contract).

**Removal and ageing.** Default: end the life (`dead` or `departed`, via `lifePolicy` or a continuation) and keep the record, because inbound knowledge, relationship and claim rows would otherwise throw F2 (`simulation.js:663-669`). Dial: a later compaction that drops ended people with zero inbound references, and a per-save promoted-person ceiling (default 64 role bodies, then oldest ended, unreferenced ones compact first). Reason: a shop's constable who saw the player once should still be remembered after he leaves the beat; ~64 x 400 bytes is about 25 KB, small against a save.

**Forward-only compatibility line (SAVES section 5 step 2).** New optional records only; absent loads as today; older builds importing a save with a promoted constable can throw F1. Add a row to the SAVES section 3 ledger. Authority: A (agent record), not Weibao's decision.

## 4. Rejected alternatives

- **Eager enrollment of every role** (raise or drop `CAST_EAGER_PEOPLE_LIMIT`): breaks the shipped byte contract and bloats every save with people nobody has met.
- **A new `recurring_people` save slice with its own wake list:** a second authority for a fact `simulation.people` already owns (AR3), plus a migration for no gain.

## 5. First slice (one sonnet lane)

**First consumer: the Tingen constables.** Reason: the writer (W6-A) and the reader both exist and are waiting on persistence; a colleague also needs schedule and placement work.

**Files.**
- New leaf `src/recurring_people.js`: `promoteRole` and a registrar for `provision:false` role definitions (no world imports).
- `src/book_world_lotm_constables.js`: register two constable definitions with `CONSTABLE_IDS`; call `promoteRole` for both at fight open; make `simulation.knowledge` the authority for new fights; keep `door` read-only as a fallback for old saves; the Tingen reader emits one `witness:` row per constable, from knowledge first.
- `src/tempo_fight_domain.js`: no change expected; verify the ordering with promotion first.
- `docs/SAVES.md`: ledger row (forward-only line); `docs/RULES_INDEX.md` only if a code is added.
- New `tests/recurring_people.test.js`.

**Asserts (focused file only).**
1. Untouched life: save bytes equal the baseline.
2. After one constable fight: both people, both actors and a `person.player.fight_seen` knowledge entry exist, `createdBy` set.
3. Encode, import (literal) and reload validate against the full registry, and the entries round-trip equal.
4. A second fight does not double-spawn and keeps the first knowledge cause.
5. A clock rewind past the fight does not re-promote.
6. One witness row per constable after the fight; a second row for the same sight would double-count it (F5).
7. An old save carrying `door` and no people still renders its rows.

**Gates.** The committer's `npm run build`, `npm test`, `check:arch`, `check:rules`; the lane runs its focused file only. State until a browser walk (FLR5, desktop viewport) is "implemented, below floor".

**Second consumer (AR11 proof, later):** a LOTM colleague promoted on first job or session reference, reusing `promoteRole` instead of `enrollCastBody`.

## 6. Risks and open questions (defaults proposed)

- **R1. Old-build import (F1d).** Default: accept, state it in the ledger row; no backport.
- **R2. `bornAt` drift (F4).** Default: live clock for spawned roles, anchor flag for pack roles; recorded per definition.
- **Q1. Should a `door` entry migrate into knowledge?** Default: no; read-only fallback only, so no history is invented.
- **Q2. Which referencing events promote?** Default: the list `referencedCastPeople` already uses, plus "on the field in a resolved fight". New triggers get a row in the owner doc.
- **Q3. Pack re-extraction renaming ids (F1b).** Default: pack builder keeps stable role ids; a rename needs a dormant alias row. Not built in the first slice.
- **Q4. Where does `promoteRole` live under AR1?** Default: leaf module with one caller per consumer; no `main.js` line.
- **Not verified:** no browser walk, no build, no test run in this lane; sizes in section 1 are estimates.
