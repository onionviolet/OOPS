# P06 combat options, 2026-10-14

Status: SOURCE IMPLEMENTED; native tactical gameplay **implemented-unverified**.
Do not final-merge as gameplay-complete. P00 integration is required.

F1: Original throwing, paid noncombat training, smoke escape, lure opportunity and
exchange/encounter break contracts are implemented at base `0216ccde` on assigned
branch `absorb-all/p23-combat-options`. Source commit:
`a5f9d7a3f90b09c78de2189e6ff3e5b400611760`. No push or merge.
No foreign Proto23/mod code or assets were copied. Main-checkout game files,
audit/original ledgers and private user saves were untouched.

F2: Live branch/HEAD and initially clean tree matched assignment. Coordinator's
2026-10-14 launch instruction reserved this lane/file area and port18825;
no listener existed before own server launch. Wave1 sessions remain independent.
Read p23-ui-polish's landed `fd737f8a` report before source edits; its grammar
is an integration dependency, not copied into this base. Existing d49cb911/379007d7
features were not rewritten. Prototype north star remains proposal; live
PROJECT/USER_VISION and current battle/item/effect/stance/math owners govern.
Pinned HTML hash matched the audit ledger. R1–R5 relevant reader coverage and
supplemental Xeus mod audit were read as inspiration, not gameplay proof.

## Row dispositions

| Row | Decision | Landing and open gate |
| --- | --- | --- |
| R23 | representative pair source implemented-unverified | `runtime.js`: smoke pays one item and escapes without calling strike/kill/clear rewards; lure pays one item and publishes one authored opportunity. Native registration/custody/clock/transition/publication remain P00 OPEN. Other food/alcohol/medicine tail outside this representative packet. |
| R50 | throwing/training source implemented-unverified | queued throw replaces one cooldown swing, one projectile, same native hit/shield/crit/armor/defeat path. Training pays an ammo item then native host XP. Paid acquisition/native skill/UI/transaction remain P00 OPEN. |
| R51 | adopted native SOURCE equivalent, browser old-loop regression observed | native independent cooldowns preserve4:1 speed ratio, no foreign round/burst engine. Existing fight ticks on rebuilt desktop origin; no changed-native fast-actor content journey claimed. |
| N14 | source implemented-unverified | request pauses after next hero exchange; winning exchange holds next group until explicit Resume. Current targets/timers stop. Native save reconstruction/UI remain P00 OPEN. |

## P00/P16 join request

A1: Exact signatures, input/output, preflight, transaction and restore requirements:
[src/absorb_p23/combat_options/HOST_CONTRACT.md](../../../../../src/absorb_p23/combat_options/HOST_CONTRACT.md).
P00 must register original proposal IDs `P23 throwing stone` (power5),
`P23 smoke pellet`, `P23 scent pouch`, paid public acquisition and native Throwing
training. Call `createCombatOptions({state,host})` and pass runtime plus saved
`nextCombatEvent` into ordinary `new Combat`. Bind known controls for select,
lure, trainThrow, requestBreak and `combat.resumeCombatOptions()`.
Host callbacks synchronously preflight save lock, usable custody, known route,
native clock, living target and supported destination/opportunity before debit;
consumption, publication, post-call snapshot and save must be one native host
transaction. No callback may throw after payment. No alternative save/resource engine.

A2: P16 gets optional validated `encounterProfile: {id,dropChanceModifier}`.
Native `target.get_loot` still governs and its modifier multiplies accessory/group
chance. P16 owns profiles/templates/moves; P00 supplies zone/rank/luck context
binding and uses existing native loot receipt/inventory path. No new enemy template
or P16 file was written. Do not publish a second loot receipt.

A3: Optional schema1 state is absent on old saves. Unsupported schemas, unexpected
fields, invalid selection/cursor/phase/profile reject before mutation.
Selected tactic, break request, phase and last paid real-event cursor serialize
exactly. Duplicate/stale paid-event calls do not consume again; new events repeat.
Defeated native target objects are guarded against reentrant/duplicate rewards.
Escape is terminal for current Combat; next legitimate encounter resets phase
through P00 while retaining paid-event cursor. No lifetime once limit.

Native ordinary enemies/cooldown subticks are NOT currently saved. P00 must
restore actual zone/profile/fighter identity+HP and pending group settlement to
support exchange-break/encounter-break import. Restoring only the tactic JSON
cannot reconstruct a pending native fight. Resume restarts native cooldowns;
exact subtick position is not serialized. Winning break defers group clear reward
until Resume; per-kill rewards already settled. Never restore a phantom win into
a newly rolled group. These native restore paths stay OPEN until proved.

## Checks

- Focused source:15/15 pass,0fail/skip (`checks/p23-combat-options/focused.txt`).
  Includes actual Combat methods with isolated host/display bindings: hit, miss,
  armor, single projectile, native defeat/reward idempotence, paid cooldown throw,
  smoke no rewards, break and one Resume,4:1 timing. This is SOURCE coverage.
- `npm run build`: PASS, including Ink parity (`build.txt`).
- Full suite gate NOT PASSING: `npm test` and `npm test -- --test-concurrency=1`
  were stopped after stalling (partial logs retained). The same complete suite
  ran as `node --test --test-concurrency=1 --test-timeout=30000 tests/*.test.js`:
  618 reported tests,616pass,0fail,2cancelled,0skip,206420.400042ms,exit1.
  File-level timeouts: `tests/cheat_cards.test.js` and
  `tests/cooling_refinement.test.js`. Both were unchanged; baseline cause is
  unconfirmed, so these are not labelled proven pre-existing failures. The lane
  imposed a30s per-file bound after the concurrent runners stalled. This is
  not a passing npm/full-suite result; coordinator must resolve/rerun the gate.
- Fresh-origin Chrome/Playwright at1366×768: old ordinary fight visibly ticks,
  leave/Save/reload returns Village, zero page errors. Screenshot and JSON in
  `checks/p23-combat-options/`. Tested served bundle SHA256:
  `78d00845dc8af88f5714310a0ccbfd221430bbccbade2ba9fab1492a500e128e`.
- New native tactic journey, pending/settled Save/reload/export/literal-file import:
  **OPEN**, host joins absent. JSON roundtrip tests do not substitute. Old-save
  behavior exercised only through existing fresh/save/reload route.
- Task-only `git diff --check`: PASS. Generated build/index cache stamps restored to original base bytes after proof
  and excluded from commits; server stopped. Rebuild before reviewing candidate. Read-only private sources and user saves untouched.

## Merge/acceptance limits

1366×768 desktop primary, mobile deferred. No new UI exists until P00 bindings;
requested visible controls are specified in contract. Known-only disclosure,
sealed secret rules and Effects-off master switch remain host requirements.

`src/models/combat.js` conflicts with p23-ui-polish physical log metadata and may
meet upstream combat changes. Preserve their grammar; adapt these narrow hooks
onto the wave1 integrated source. P00 alone edits registrations/main/display/save/
workspace/skill/clock owners. `native_battle_contracts.js`, math and stances were
read and left unchanged because existing normal settlement is reused.

Remaining technical gate is a P00 integrated candidate passing full build/tests
and genuine native paid tactics/persistence journeys. After technical gates,
Weibao's play/taste is the remaining authoritative human acceptance. Lane is
source-ready for candidate stacking, not gameplay-complete or merge-approved.
