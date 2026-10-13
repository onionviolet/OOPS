# Native craft atomic boundary

Owner: `/root/craft_atomic`. Reservation released after this return: new helper,
new test, and this `craft-atomic/` directory only. Incumbent source/build untouched.

F1: Native `use_recipe` changes material/output inventory, skill XP and milestone
bonuses, quest events/unlocks, item acquisition history, fort acquisition, crafting
stats and favourites before a durable craft receipt. The former receipt catch
leaves those changes live after rejected storage. Future ordinary saves can then
persist an output without its corresponding receipt/rule expenditure.

F2: `beginNativeCraftTransaction` captures live owners' own data descriptors and
restores them in place without invoking inventory, reward or unlock APIs. It keeps
prototypes, aliases, stack/item identity, cycles and existing private-container
references. Functions remain opaque; no UI or global save snapshots. Internal-slot
collections deliberately fail before mutation rather than silently claiming
restoration. Private containers must be supplied through existing owner getters.

F3: `markDurable` prevents every later rollback. It belongs immediately after
`writeGuardedSave` returns inside `lifeSaveStorage.setItem`, before migration,
refresh or presentation. `setItem` returning is too late: its later rendering can
throw after storage succeeded. `writeGuardedSave` itself has no post-write renderer.
`observeFortAcquisition` only replaces `fortSupply`; it performs no interim write.

## Exact root-owned integration hook

Import both exports from `src/native_craft_transaction.js`. Begin a transaction
per invocation of native `use_recipe`, immediately before mutable native work.
Keep the existing early guards and disposition checks. Supply these live roots:

```js
owners: [
  character, character.getItems(), character.getLevelableComponent(),
  item_log, game_stats, global_flags, availabilities,
  ...Object.values(skills).map(s => s.getAvailabilityComponent()),
  which_skills_affect_skill,
  favourite_consumables, favourite_items, favourite_locations, active_effects,
  ...nativeCraftQuestOwners(quests, active_quests)
]
bindings: [
  {get: () => fortSupply, set: v => {fortSupply = v;}},
  {get: () => workLedger, set: v => {workLedger = v;}},
  {get: () => pathfinder, set: v => {pathfinder = v;}},
  {get: () => travel_times, set: v => {travel_times = v;}},
  {get: () => current_location, set: v => {current_location = v;}}
]
```

`character` exposes money/reputation but does not expose private inventory/levelable
fields; those two getters are mandatory. `levelable` includes `skill_progress`,
`stats.full` vitals, milestone/effect/derived stats, `bonus_skill_levels` and
`xp_bonuses`. The private availability components supplied above include skill,
recipe/location/action/NPC/dialogue access through the actual availability registry.
`nativeCraftQuestOwners` also explicitly visits every existing active and template
quest/task private availability. This matters because active Quest construction
can overwrite registry bindings; graph traversal alone cannot see private fields.

Propagate the transaction to `settleWorkLedgerCraft` and `publishWorkLedger`. Change
the former to throw when saving is unavailable or saving fails. Do not catch and
continue the recipe. Pass a narrowly scoped optional durable callback argument to
`lifeSaveStorage.setItem`, only from this craft receipt write:

```js
lifeSaveStorage.setItem(key, serialized, () => craftTransaction.markDurable());
// Inside setItem, directly after writeGuardedSave(...): onDurable?.();
```

On pending failure, `rollback()` restores selected data, then refresh native
inventory/item-log/skills/stats/crafting and the affected quest/availability views.
`update_displayed_skill_bar` already removes bars whose restored discovery state
is false. Do not capture or restore DOM graphs. Queue recipe success/failure text
until durable publication where practical; a rejected craft must show failure,
not a surviving success notice. Rendering is not the save boundary.

Each recursive `use_recipe` call creates its own transaction. The first invocation
must mark durable before recursion. A rejected child stops that child and leaves
previous durable output/XP/material debit/receipt intact. The outer transaction's
rollback is inert once durable. For the quality-component path, intermediate XP
level batches occur within one final receipt, so one invocation rolls back all of
those unsaved sub-batches. Native equipment crafting currently lacks the selected
Work Ledger receipt consumer; do not mark it durable from an unrelated save or
infer atomic coverage from this helper alone.

On an error after durable storage, retain output and rule expenditure. Ensure
`lifeSaveStorage` publishes its already validated ledger/native owner assignments
before optional rendering; migration/render failure must not leave live rule state
behind a stored receipt and permit a duplicate benefit in a later save. This helper
intentionally cannot undo a durable write.

## Evidence and remaining gate

`node --test tests/native_craft_transaction.test.js` passed 6/6. Tests cover
rejected write rollback across all selected owner shapes; post-durable render
failure; recursive partial commit then rejected child and retry; aliases/cycles,
deleted array entries/symbols; unsupported owner fail-before-mutation; redraw error
after completed rollback. The final test evaluates the actual unchanged native
InventoryComponent and AvailabilityComponent classes with explicit dependencies,
exercises their actual mutation methods and proves rollback preserves the private
inventory map and reverses an additive unlock without replaying those methods.

Source helper/test verified. Root integration, rebuilt native failed-write/retry,
save/reload/import, current-source durable rule publication and no false success
feedback remain required. No browser/process was launched by this worker. No
commit, build, user-save, World1 or source-library change.
