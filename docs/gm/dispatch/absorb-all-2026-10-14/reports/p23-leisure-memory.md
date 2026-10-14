# P10 leisure memory lane, 2026-10-14

Status: **implemented-unverified; P00 native integration required; NOT final-merge ready**.
Source/contracts complete on `absorb-all/p23-leisure-memory`, prepared base
`0216ccdefcfce79877378f8cb0ee41129fe11c5d`. Source commits `bf8c19de` and
`9785c96c`. No push/merge; no shared-file writes or source/assets copied.

## Authority and ownership

F1: Coordinator assignment explicitly reserves this worktree, lane paths and
18829 and authorizes wave 2 without waiting for wave 1. Clean initial tree,
correct HEAD/branch verified; node_modules symlink left intact. Live
`runs/SESSIONS.md` lists session `01a138b8-ea30-7531-a7bb-fa681823c4b1`
and P00 pending after wave 1. Port had no listener before the own server started.
AGENTS, PROJECT, USER_VISION, LIFE_SIM_NORTH_STAR and N16/N22/N23 owners read.
Current direction permits original reversible proposals, not accepted balance.
Desktop 1366×768 primary, mobile deferred. Native action/custody/clock/discovery,
RNG/resource/memory publication remain P00 joins.

F2: Minigames checkpoint includes superseding R15 integration. MG08 already
has Sela's loans/gifts and MG09 gatherings. This module uses a separate original
chance-leisure activity and Eda's small cup-money request. Shared relationship,
actor and publication overlap belongs to P00; no management files edited.
Wave-1 p23-ui-polish and upstream-dev reports read as available. life-loops and
reveal-chain reports were not present at latest inspection. No wave-1 features
or d49cb911/379007d7 UI features redone.

F3: Native `kill_player` increments `game_stats.total_deaths`, logs lost
consciousness, relocates and applies Recovering. It lacks a persistent biography
cause. `update_health` selects is_combat from location shape, not damage origin.
The original optional memento is therefore a factual recovery memory with
unknown cause by default, combat/opponent only from verified known native data.
Chronicle's explicitly enrolled old-age ending and existing heir legacy stay
separate. No death item, new death policy or universal moral score.

## Per-row disposition

| Row | Disposition | Landing / remaining gate |
| --- | --- | --- |
| N16 kindness, relationships/place | Original adapted module, implemented-unverified | Known Eda help/refusal and later paid-by-Eda practice; actual coin transfer, private relationship and biography output requests. P00 actor/conversation/publication join and native return/control needed. |
| N22 leisure dice/pinecones | Original target-dice module, implemented-unverified | Repeatable two-minute paid round; one native saved RNG draw, hidden pending face, exact settlement, matching stamina refund. Pinecone items/assets/stat luck not copied. P00 native action/clock/save required. |
| N23 permanent death/cause token | Existing death/recovery distinction retained; missing recovery-cause biography adapted, implemented-unverified | Actual native defeat count baseline and monotonic settlement watermark; optional known cause only. Existing mortal/legacy owners retained. P00 native defeat callback required. |

## Concrete P00 request

Full signatures, inputs, output mapping, preflight and native acceptance live in
[`HOST_CONTRACT.md`](../../../../../src/absorb_p23/leisure_memory/HOST_CONTRACT.md).
P00 alone registers Eda, known-person dialogue and target-dice actions. Import
`createLeisureMemory`, `validateLeisureMemory`, `startLeisureRound`,
`settleLeisureRound`, `respondToEda`, `revisitEda`, `rememberNativeDefeat`,
`leisureMemoryView`, `LEISURE_PERSON`, `LEISURE_SAVE_KEY` from the feature module.

A1: Preflight optional top-level `p23_leisure_memory` before any native load/import
mutation. Absent/null stays absent; initialize only on actual enrollment with
`createLeisureMemory(save.total_deaths ?? 0)`. Family schema 1 is strict and
unsupported/unknown fields reject. Host context comes from native clock, saved
RNG, actor/body/custody/readiness, native purse/stamina and known co-located actor.
No wall-clock/offline policy. Capture expected revision per action and preserve
it on retries. Freeze the one draw and charge at start; pending due is clock+2.

A2: Stage `{state,rng,effects,minutes}` in the existing durable native transaction,
including actual costs, donor coins, result state, RNG, private relationship and
biography. Validate all families/resources before publication; write failure
must leave all owners unchanged. `nativeMoney`/`nativeStamina`/`personMoney`
are explicit adapter requests, not already registered effect types.
`biography` maps to appendLifeMilestone with actual calendar year and
lifeCalendarMinute, never the expansion's relative clock. `relationshipMemory`
maps to the existing private relationship owner with stable ID/text. No global
score. Host supplies native reservation and restores/settles due pending rounds.

A3: Register adult Village cup maker Eda (`p23.leisure.eda`) with zero coins;
introduce her through actual discovery. Help moves one player coin into her
purse; a known return after two played minutes offers one practice fee from her
actual coin. If absent/no coin, ordinary paid play stays available and credit
stays ready. After consumption help can recur. Native actual combat defeat
callback uses total_deaths as occurrence watermark and unknown cause unless
verified. Never infer an attacker from location shape or a sealed registry.
Render safe view fields with escaped text, never raw pending face; no VFX output,
so Effects-off remains the master switch.

## Compatibility and settlement

Optional family absent from old saves remains absent without retroactive
rounds/help/defeat memories. No native persistence version bump or required
migration. Saved native expansion.rng is the sole RNG stream; module has no
independent seed owner. Pending seed-before/after/face/due are schema-validated.
Settled round IDs and actual native defeat occurrence watermark make timer
replays idempotent. Captured revision rejects stale helping/publication retry.
No fixed lifetime once limit; counters stop only at safe numeric exhaustion.
Biography is lossy presentation, never reward authority. Host write-failure,
full-envelope compatibility and literal-file import remain OPEN.

## Verification

C1: `npm run build` passed, no installs. Rebuilt served bundle SHA-256
`598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`,
5,100,591 bytes. Module is intentionally not in bundle before P00 imports it.
Build success is baseline compiler evidence, not native changed behavior.
Generated dist source map remains unstaged; no dist commit.

C2: Focused `node --test tests/p23-leisure-memory.test.js`: **17/17 passed**,
0 failed/skipped/cancelled. Controlled module persistence round trips use JSON
serialization, not native save/literal-file import. Existing chronicle and
life-record validators accept emitted known factual memory in focused tests.

C3: Initial unbounded `npm test`: **634/635 passed, 1 failed** (445463.246666 ms).
Existing `alloy_equipment.test.js:118`, “equipped native brace with an open road
offer keeps ticking, travelling and reloading,” child fixture command exceeded
its native 60-second timeout under concurrent lane load. This is an observed
unrelated failure, not labelled proven pre-existing. Bounded retry
`npm test -- --test-concurrency=1 --test-timeout=30000`: **635/635 passed**,
0 failures/skips/cancellations (53860.801667 ms). Expanded 16-test source full run: **637/637 passed**, 0 failures/skips/cancellations (76571.617042 ms). Final cause-neutral 17-test source full run: **638/638 passed**, 0 failures/skips/cancellations (58250.704125 ms). Exact final command: `npm test -- --test-concurrency=1 --test-timeout=30000`.

C4: Fresh-origin desktop Playwright baseline smoke passed using installed
headless Google Chrome after default Playwright executable was missing. Actual
served bytes equal rebuilt local bundle, viewport 1366×768, no page errors.
Screenshot visually checked; P10 hook absent. This is baseline smoke only, not
two-round/help/refusal or persistence gameplay acceptance. Evidence includes
browser-evidence.json, native-baseline.png and reproducible browser.cjs.

C5: Source whitespace check passed. Check logs and hashes:
[`checks/p23-leisure-memory`](../checks/p23-leisure-memory/).

## Open acceptance and merge risks

R1: P00 native integrated candidate required. Two leisure rounds; exact pending
and settled Save/reload/export/literal-file import; help and later changed
response/sponsored round; refusal/absent/no-coin controls; repeat helping;
known-only biography; native unconsciousness distinct from ended mortal life;
unsupported schema rejected before mutation; durable publication failure all
remain OPEN. A fixture or uncoupled module is not native gameplay.

R2: No source path overlap with wave-1 or other wave-2 modules. P00 must reconcile
shared actor IDs, optional save preflight, native action reservation and actual
coin/stamina/clock owner joins on its stacked candidate. Do not final-merge this
lane as completed gameplay before the native gates. Wave-1 pending reports must
be checked when P00 integrates. No user saves or raw sources touched.

After native technical gates, Weibao's play/taste is authoritative acceptance.
