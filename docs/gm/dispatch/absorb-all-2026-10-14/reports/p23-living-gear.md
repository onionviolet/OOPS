# P04 living gear, 2026-10-14

Status: **implemented-unverified, P00 host joins required; NOT final-merge ready**.

## Authority and scope

Clean prepared worktree at `0216ccdefcfce79877378f8cb0ee41129fe11c5d`, branch
`absorb-all/p23-living-gear`; node_modules symlink retained. Coordinator's current
assignment reserves port 18823 and authorizes wave 2 before wave 1 completion.
Live SESSIONS records lane session `01a138b8-8a3c-7aa3-867f-80a46dba1d7e` and
P00 pending after wave 1 merges. No waiting on or edits to wave-1/shared owners.
AGENTS, PROJECT, USER_VISION, LIFE_SIM_NORTH_STAR, current C1/E2/native equipment
and energy owners reconciled. These three original mechanics remain proposals.
Desktop 1366×768 primary; mobile deferred. No foreign code or assets copied.
Pinned HTML and R1–R5 notes provide inspiration; supplemental mod audit reviewed.

## Row dispositions

| Row | Decision | Implementation / open gate |
| --- | --- | --- |
| R12 portable aura | Adapted original Wayfarer dial | Derived day ×1.05 attack, native night +25 light; host modifier/light/time joins OPEN. Home fuel belongs to P03. |
| R33 owned kill-growth weapon | Adapted original Road memory knife | E2 stable copy keys, `1+log1p(kills)*0.01` derived attack; native kill/acquisition joins OPEN. Duplicate-count discovery remains wave-1 reveal-chain. |
| N10 equipped collector | Adapted original Cinder keeper ring | Beast/monster kills store up to30 real per-copy cinders; repeat spend3→up to5 native stamina; native action/publication OPEN. |
| d49cb911 / 379007d7 | Already adopted at base | Vivid, dots, coin floats, combat reveal, crafting, settings and panel kit are not reimplemented. |

## Compatibility and transactions

Optional root `p23_living_gear` schema1. Missing field loads empty without minting
items; explicit null, unsupported schema, malformed copy/resource/cursor or
repeated identity rejects before owner mutation. Growth/reserve belong to stable
native E2 keys, including two otherwise identical copies. E2 `prepareEquip` gains
only an opt-in `{requireIdentity:true}` parameter; ordinary callers and disabled
wear remain unchanged. Living gear needs identity even with wear disabled.

No item callbacks, global callback bags, timers or equip subscriptions. Ordered
real-death cursor suppresses replay; no fixed lifetime once cap. Staged plans
leave live growth/reserve/native stamina untouched on save failure. Host serializes
plans and persists native death/reward/vitals and cursor atomically, then publishes.
Cross-owner imported-copy/custody preflight remains P00 responsibility.

## Evidence and remaining gates

- Focused final SOURCE checks: 11 tests, 11 pass, 0 fail. Combined living-gear/E2
  slice: 17 tests, 17 pass, 0 fail. Native constructor/decoder bundling with only
  main/display stubs confirms actual template creation, native dagger attack and
  independent E2 copies. Other10checks are isolated contracts, not native gameplay.
  Initial import errors (unexported Ring, browser-only document) were corrected.
  Added native-constructor check caught a legacy/commented handle reference;
  fixed to the live Simple wooden short handle and verified successfully.
- `npm run build`: PASS. Built baseline imports the E2 signature change; the new
  isolated module is not joined into dist by the shared host yet.
- Full `npm test`: initial run stopped exit130 after55 passes and no final
  aggregate. An after-file concurrency option was misplaced and its npm rerun
  was stopped exit130; correctly ordered serial run was also stopped at a hanging
  unrelated file. Completed equivalent full suite:
  `node --test --test-concurrency=1 --test-timeout=30000 tests/*.test.js`:
  **603 tests, 601 pass, 0 fail, 2 cancelled**, duration172103.9705ms.
  Cancellations: `tests/agreed_duty_continuation.test.js` and
  `tests/cooling_refinement.test.js`, each timed out after30000ms. Those files and
  their owners are unchanged by this lane. Baseline cause is not established.
  This is a failing/incomplete full-suite gate, not a passing npm-test claim.
- Browser: PASS recorded baseline compatibility smoke at1366×768, zero page
  errors and exact Save/reload bytes. Loaded/disk/fetched bundle SHA256
  `97aa627cd0bf15a81b63713e4cf08caab551831ff7874a795635b30d5766296b`.
  Initial harness path error and missing Chromium corrected via installed headless
  Chrome; first compatibility Save/reload mismatch remains a failed attempt,
  second fresh-context run passed. Feature native gameplay/export/import stay OPEN.
- SOURCE JSON roundtrip covers independent old/new copies, absent-state reset,
  schema rejection and failed-stage controls. Native changed-loop Save/reload,
  Export/literal-file Import, old save/copy import controls and Effects-off
  presentation remain OPEN pending P00 candidate. No personal saves touched.

Local checks: `docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-living-gear/`.
Shared source/save/UI joins stay read-only. Wave-1 ui-polish report read as landed;
no overlap needed. P08 may read E2 APIs but must not edit them. P00 must reconcile
wave-1 item/save/modifier owners on integration, not cherry-pick this module as
completed gameplay. No dist commit, push or merge by lane.

Remaining technical gate: P00 native integrated candidate with the exact controls
below. After technical gates, Weibao's play/taste is authoritative acceptance.

## Exact P00 requests

Proposal, 2026-10-14. Target 1366×768 desktop; mobile deferred. This lane does
not modify any shared host file. Native integrated acceptance is OPEN.

1. **Registration/acquisition:** import `registerLivingGearItems` and call once
   after ordinary templates exist with `{item_templates, Amulet, getItem,
   WeaponComponent, Weapon}`. `Ring` is intentionally created through the native
   `getItem` factory because it is not exported. Register three ordinary paid,
   known-discovery shop offers in an existing reachable home-world shop: Wayfarer
   dial (30 coins), Cinder keeper ring (40), Road memory knife (native calculated
   value). No new crafting transaction or recipe is required. The knife's native
   head component is Tempered memory blade and handle Simple wooden short handle.
   Native decoder/quality/value/custody remain authoritative. Review numbers as
   reversible proposals. Do not mint equipment during load or import.
2. **Identity/equipment:** create one `createLivingGear(saved.p23_living_gear)`
   owner. Before native equipment publication, call
   `gear.prepareEquip(item, stagedDurability, getItemFromKey)`. This uses E2's
   existing ID allocator with `{requireIdentity:true}`, even with condition off.
   Stage E2 `equipment_durability` and returned native equipment key together.
   Do not call on inventory previews; do not mutate live E2 while staging.
   Native custody preflight must check both the full key and
   `canonicalDurabilityKey(key)`, on owner/custody-filtered equipment only.
3. **Kill settlement:** invoke `stageKill({sequence,killerId,defeated:{tags},
   equipment,assertDisposition})` once per settled real enemy death (not hit,
   group clear, preview, restore or callback replay). `sequence` is the ordered
   durable living-gear kill cursor, starting at `serialize().lastKill + 1`.
   Attach that same sequence to retries of the same death. Atomically save its
   `nativePatch.p23_living_gear` with native death/reward/encounter settlement,
   then call `publish`. Even ineligible or unequipped deaths advance the cursor.
   Lower/equal sequence returns `{duplicate:true}`; a gap rejects. Host must not
   derive a new sequence for a replayed death. Player kills grow only equipped
   weapon; beast/monster kills collect only equipped ring. Mark practice units
   `training:true` and summoned units `summoned:true` in this event projection.
4. **Modifiers/action:** `project({equipment,time:current_game_time,
   assertDisposition}) -> {attackMultiplier,lightBonus}`. Apply once as a derived
   source in native attack-power recomputation, not in item methods. Day aura
   ×1.05 attack; native `is_night` (20:00–04:00) gives +25 native light points
   instead. Add light before native light-dependent penalties; clamp the final
   native light to [0,100]. Refresh on equipped-copy or played-hour changes.
   Weapon multiplier is `1 + log1p(copyKills)*0.01`, without a lifetime cap.
   `stageSpend({actor,key,assertDisposition})` requires selected equipped ring,
   ≥3 real per-copy cinders and missing native stamina. Returns
   `{spent:3,recovered,native:{staminaToFull},nativePatch,preflight,publish}`.
   Persist through `persistExpansionPlan` with native stamina patch, then publish
   and refresh vitals. No effect or debit on failed save. Serialize all host
   transactions; call plan.preflight immediately before persistence. Re-read
   custody/equipment/vitals at execution, never reuse a displayed quote.
5. **Save/disclosure:** optional root field `p23_living_gear` schema 1.
   Preflight `createLivingGear(incoming.p23_living_gear)` before any native
   mutation, then cross-check keys against E2 identity and imported native
   equipment/inventory/storage owners. Reject duplicate instance IDs across
   owners, incompatible item/slot, or same instance with differing canonical
   keys. Absent field gives empty copies/cursor; explicit null or other schema
   rejects. Existing ordinary gear and saves remain unchanged. Retain E2 IDs
   after unequip, trade, storage and import; do not transfer growth to a stack.
   `rows({equipment,isKnown,assertDisposition})` provides known equipped rows
   only. Use ordinary native discovery for names/availability. Effects-off is
   the master switch for any optional cues; this module emits no visual effects.

Staged plans keep live reserve/growth untouched until successful publication.
P00 owns cross-owner stale quote/custody checks and atomic kill/native save
publication. No external bag of closures or per-equip subscriptions exists.

Required integrated candidate gates: actual paid acquisition; two identical
copies; equip/kill/spend/unequip/re-equip; native 19:59→20:00 and 03:59→04:00;
useful attack/light/stamina controls; rejected save/custody controls; native
Save/reload/export/literal-file Import of old and new copies; unsupported schema
rejection before mutation; known-only disclosure and Effects-off at 1366×768.

## Commit evidence

`0e31f053`: staged per-copy module, exact host contract, opt-in E2 identity
argument and initial10focused contracts. No shared host edits, push or merge.

`8424e51a`: native item registration/decoder SOURCE check and verified live-handle
correction. Final build hash equals the browser-tested hash above. Build-generated
dist/index changes are excluded and restored after evidence capture. Own server
and disposable browser are closed. No native P00 candidate exists in this lane.

All R12/R33/N10 native joins and changed-loop/persistence acceptance remain OPEN.
Coordinator must not final-merge this lane until integrated gates pass. Exact
P00 requests above are ready for the host-join worker; no shared cross-edits made.

Final evidence commits: `7a3263cc` (report/browser evidence) and `7a739fc7`
(exact build, focused, affected, full-suite and browser logs). Branch HEAD
`7a739fc79acf800094f739c2d5bcbf176e23c3b6`; working tree clean, no push/merge.
Checks live in worktree `/Users/weiwei/code/yair-absorb-all-20261014/p23-living-gear/docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-living-gear/`.
