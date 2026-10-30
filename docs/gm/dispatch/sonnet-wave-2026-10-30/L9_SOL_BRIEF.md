# Lane sw-l9-slice1 brief (Sol medium)

Repo: /Users/weiwei/code/yet-another-idle-rpg (shared checkout; other sessions edit it). Read first: `docs/gm/dispatch/sonnet-wave-2026-10-30/L9_DEATH_RESTART_DESIGN.md` (the whole design; this brief only lists the work). Also read `src/defeat_domain.js` (the `registerDomain` slice pattern to copy: `migrate` null to fresh, `save` only when non-empty, `validate`, `load`, `projection`) and `src/continuation_state.js`.

## You own exactly these files (create or edit nothing else)

1. NEW `src/harm_state.js`
2. NEW `tests/harm_state.test.js`
3. EDIT `src/continuation_state.js`: hunks only (new commands, `validateContinuation` additions, `continuationView` additions).
4. EDIT `src/main.js`: add ONE import line next to the existing `defeat_domain` import so the domain registers. Touch nothing else in that file. Other sessions are editing the checkout; do not edit any other file, and never run `git stash`, `git checkout`, `git reset`. Do not commit. No web access.

## Build

### `src/harm_state.js` (world-neutral, no LOTM names, no book text)

- `export const HARM_RUNGS=['shaken','bruised','wounded','maimed','dying']`; `harmRung(fraction)` maps health fraction 0..1 (1 is unhurt) to a rung id or null, and `rungHealth(id)` returns a representative fraction, so the two never disagree (test: round trip is stable).
- World rows, frozen data: `HARM_WORLDS` keyed by world id. Each row: `{world, reason, carriers:{<carrierId>:{label, stages:[{id,label,at,blocks:[actionClass...],warn?}], floor, restPerHour, treatedPerHour, riseScale}}, death:{default, alternatives:[{kind,requires:[factKey],cost}]}}`. Provide rows for `book.lotm.tingen` and `base.frontier` and a generic fallback `default`. Action classes are the 15 ids: appraise care craft explore fight other practice research rest ritual socialize study trade travel work.
  - LOTM Tingen carrier `power`, stages `steady` at 0, `strained` at 3 (warning only), `slipping` at 6 (blocks `ritual`,`research`), `lost` at 9 (blocks every class except `rest`,`care`,`travel`). floor 0 for steady worlds; `restPerHour` small, `treatedPerHour` larger. death.default `final`; one alternative `{kind:'rescued',requires:['harm.rescuer.present'],cost:'a debt the rescuer names'}`. `reason` strings say these are proposed first-slice defaults.
  - Frontier: no carriers; death default `final` only for causes `age`,`illness`; everything else follows AD19 (native defeat is not death).
  - Every number is a default under a dial: the row's `reason` string states why.
- Domain slice id `harm`, state `{schema:1, backlash:{<carrier>:<number>}}`. Pattern from `defeat_domain.js`: `migrate` null to fresh; `save` returns undefined when no carrier has a nonzero count (so old and clean saves stay byte-identical); strict `validate` (finite non-negative numbers, ids safe, `__proto__`/`constructor`/`prototype` refused, caps); `load`; `projection`. Export `harmState()`, `setHarmState()`.
- Pure functions over a state value (no module global in the pure ones): `addBacklash(state,rules,carrier,{source,weight})` (weight scaled by `riseScale`, source is a short string kept only in a returned record, not saved), `restBacklash(state,rules,carrier,{minutes,treated})` (never below `floor`), `backlashStage(rules,carrier,count)`, `actionGate(stage,actionClass)` returning `{allowed:boolean, reason:string}` where reason is the stage label, `resolveDeath(rules,cause,ctx)` returning `{default, alternatives:[ {kind,cost} whose requires facts are all true in ctx.facts ], restartOffered:boolean(ctx.continuationEnrolled)}`, and `harmView(save)` returning the read model in the design note (`{carriers:[{id,label,count,stage,stageLabel,blocked,recovers}], rung:null, lastDeath:null}`; `lastDeath` read from `save.continuation.deaths` last entry if present).

### `src/continuation_state.js` hunks

- Add `'die:'` and `'restart:'` to the `travelOnly` list in `planContinuation` so they work in `TRAVEL_WORLDS`.
- `die:<cause>`: `cause` in `['age','illness','mishap','combat','harm','loss_of_control']`; the active life gets `ended:{cause,outcome:'final',at:nativeMoment(source)}` (outcome from `resolveDeath` default for the world, imported from harm_state.js; if the default is not `final`, throw a clear error that this world's outcome is not a death). Check no challenge is active and the life is not already ended. Append `{lifeId,cause,outcome,at}` to `c.deaths` (create it if absent, cap 64 newest).
- `restart:initial` and `restart:checkpoint`: require `life.ended`; target is `life.initial` or `life.checkpoint`; use the existing `restore(source,target,c)`; then `delete life.ended`, `c.loop.cycles` unchanged, `c.arrivalPaused=false`, and append `{lifeId, kind:'restart', anchor, at}` to the ledger. Same time check as `initial`.
- `validateContinuation`: optional `deaths` (array, each entry object with safe string ids, finite `at`) and optional `ended` on each life; additive, old JSON validates unchanged. No schema bump.
- `continuationView`: add `ended` (active life's or null) and `deaths` (copy, each with `lifeLabel`).

### `tests/harm_state.test.js` (node:test, focused, fast)

1. Backlash: accrual crosses stages `steady`→`strained`→`slipping`→`lost`; `actionGate` changes: `ritual` allowed at `strained`, blocked at `slipping`; at `lost` only rest/care/travel pass. Rest lowers it, treated rests faster, never below floor.
2. Death resolution: `resolveDeath` for Tingen `loss_of_control` gives default `final`; the rescuer alternative appears only when `harm.rescuer.present` is true; `restartOffered` follows enrollment. Frontier `combat` does not resolve to death.
3. Domain slice: a clean state is not saved; a nonzero state round-trips `save`→`validate`→`load`; an old save with no `harm` migrates to fresh; hostile keys refused.
4. Continuation: build a fixture like `tests/continuation_state.test.js` but with `expansion.actors.player.worldId='book.lotm.tingen'` and the harm slice present in `save`; `die:loss_of_control` ends the life; a second `die:` is refused; `restart:initial` restores the anchor. Assert the keep table against `restore`: kept (cheats, preferences, mastery of `COMPATIBLE_MASTERY` skills, retention anchors, memories, the deaths ledger entry), reset (money, quests, world state, date, backlash counter back to the anchor's). A pre-change continuation JSON (no `deaths`, no `ended`) still validates and round-trips through `JSON.parse(JSON.stringify())`. `restart:` before any death is refused. Replaying a used token is refused (existing behavior).

## Done check

`node --test tests/harm_state.test.js tests/continuation_state.test.js tests/anchor_snapshots.test.js` passes, and `node scripts/check_architecture.mjs` (or `npm run check:arch`) has no new violation. Report: files changed, exact test output counts, anything you could not do. Run only these focused tests (the machine is heavily loaded).
