# P04 living gear joins for P00

Proposal, 2026-10-14. Target 1366×768 desktop; mobile deferred. This lane does
not modify any shared host file. Native integrated acceptance is OPEN.

1. **Registration/acquisition:** import `registerLivingGearItems` and call once
   after ordinary templates exist with `{item_templates, Amulet, getItem,
   WeaponComponent, Weapon}`. `Ring` is intentionally created through the native
   `getItem` factory because it is not exported. Register three ordinary paid,
   known-discovery shop offers in an existing reachable home-world shop: Wayfarer
   dial (30 coins), Cinder keeper ring (40), Road memory knife (native calculated
   value). No new crafting transaction or recipe is required. The knife's native
   head component is Tempered memory blade and handle Simple short wooden hilt.
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
