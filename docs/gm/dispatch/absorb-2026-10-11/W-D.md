# W-D: original Fort supply loop

2026-10-11. Parent `/root`, worker `/root/fork_patterns`. Checkout
`/Users/weiwei/code/absorb-2026-10-11-workers/d`, base `c83bd819`, branch
`codex/absorb-2026-10-11-d`. Exclusive owned paths: `src/absorb_d/**`,
`tests/absorb_d.test.js`, this receipt. Root owns integration, build and browser.

## Delivered proposal

- FNA04: one pure clear-count projection advertises only thresholds supplied
  by actual read notes; it never infers disclosure from unlocked registries.
- FNA08: saved source edges arise only from observed acquisitions or explicit
  reports; the item source projection also requires the item to be known in
  native `item_log`. Reports stay distinguished from observations.
- FNA12: clerk buys two native rat tails for eight coins or two iron ore for
  twelve coins. Native player stock moves to the clerk's received-stock ledger.
  The clerk starts with 180 actual local coins, and every payment deducts from
  that purse. Buying the optional ten-coin notes adds those ten coins to the
  same purse. No timed job, rank, standing, XP, patrol or promotion is added.
- FNA05: four-minute native repair notes open a local post and yard. A native
  first-clear salvage heap and disclosed second-clear heap supply ore; repeated
  clears supply one ore and one coal, allowing recovery after failed native
  smelting or selling supplies. Native Village iron-ingot crafting remains the
  sole smelting executor. Handing over three ore and one ingot repairs the hatch
  and opens the cellar. A native two-task clear quest awards one ordinary
  storekeeper ledger on completion. All names, prose and balance are original
  prototype proposals.

Village overlap checked against current `PROJECT.md`, `village_career.js`,
`village_career_ui.js`, and main's `writeVillageCareer`: existing patrol/loan,
Watchcraft, Mentor, wages, recruitment and tuition remain distinct owners.
This board makes carried materials useful instead of duplicating those jobs.

## Exact parent integration

Import `FORT`, `createFortSupply`, `migrateFortSupply`, `stageFortAction`,
`observeFortSource`, `fortDisclosures`, `knownClearText` from `absorb_d/fort.js`,
`registerFortContent` from `absorb_d/register.js`, and `createFortControls`
from `absorb_d/ui.js`.

Call `registerFortContent({locations,item_templates,book_stats,quests,
availabilities,SafeLocation,CombatZone,Book,BookData,Quest,QuestTask})` exactly
once after native imports evaluate, before initial save load/path lookup.
Constructors come from `models/location.js`, `items.js` and `quests.js`.
Registration writes native availability bindings for added items, locations,
quest and quest tasks. It does not load state or execute a reward.

Keep a main-owned `fortSupply = createFortSupply()`. `create_save()` writes
`save_data.fort_supply = structuredClone(fortSupply)`. On load and in the
existing guarded save publication, assign `fortSupply=migrateFortSupply(save)`.
In the existing `nativePublication` stage, publish `plan.nativePatch.fort_supply`
only after the common durable transaction succeeds. No new storage writer.
The nativePatch already stages the entire optional ledger in the envelope.

Native action writer checks existing busy/read-only/alive/ownership guards,
then passes this exact input:

```js
const plan = stageFortAction({state:expansionState,gameplay:gameplaySnapshot(),
  money:character.money,itemLog:item_log.items,fort:fortSupply,action,
  context:{worldId:expansionState.actors.player.worldId,
    location:current_location.id,busy,readOnly,
    fieldClears:Math.floor(locations['Infested field'].enemy_groups_killed/locations['Infested field'].enemy_count),
    yardClears:Math.floor(locations[FORT.yard].enemy_groups_killed/locations[FORT.yard].enemy_count),
    notesRead:book_stats[FORT.notes].accumulated_time>=4,
    assertItemDisposition:key=>assertNativeItemDisposition(expansionState,key)},
  keyFor:id=>item_templates[id].getInventoryKey(),getItem:getItemFromKey});
persistExpansion(plan);
log_message(plan.message);
```

`plan.gameplay.player.inventory` uses native numeric snapshots. Item acquisition
logs are staged using native `recordAcquisitions`. The plan carries native
`unlocks` for cellar access; it never performs post-save reward mutation.
`plan.fort` is an optional convenience alias of the staged ledger, not a second
publisher. No seconds, elapsed time or NPC tick is created.

Mount `createFortControls({read,act})` after native DOM initialization. Read
returns `{fort,worldId,location,fieldClears,yardClears,notesRead,money,stock,
knownItems:item_log.items,disabled}`. `stock` holds native totals for `'Rat tail'`,
`'Iron ore'`, `'Iron ingot'`; controls need counts rather than raw item keys.
`act` is the durable writer above. Call `.render()` from existing location/UI
refresh and normal time update; `.destroy()` only for teardown. It does not
start a polling interval. The panel mounts in `location_actions_div` at Village
and Fort post, so it extends existing center actions.

Use `knownClearText(location, fortDisclosures(notesRead))` in both
`update_displayed_combat_location` and `update_location_kill_count`; no other
native clear milestones are disclosed by this proposal.

For the source journal, call `observeFortSource(fortSupply,{itemId,sourceId,
label,kind,count,at:expansionState.clock,certainty:'observed'})` only after an
actual positive native acquisition. Ignore load replay and `only_unlocks`.
Kinds: `clear`, `gather`, `craft`, `trade`, `drop`, `contact`. IDs and labels
come from the actual event's disclosed source, never scanning registries.
For authored NPC testimony use `certainty:'reported'`; projection will retain
that distinction until an observed acquisition from that same source.
The notes action already records its clerk source durably. Parent must stage
other event observations with the event's native save owner. Do not award or
record an acquisition while rendering the source journal.

## Compatibility and browser gate

Optional `fort_supply` schema 1 defaults only on absent state: no invented
notes, repairs, source edges, player inventory or wages. Unknown schema and
invalid nonnegative integer amounts reject instead of silently resetting a
funded ledger. Native book/quest/location fields use the existing native save
owners. Older builds retain `fort_supply` only if their existing unknown-domain
retention supports it; downgrade play is not verified. Player private saves
remain untouched.

Fresh-origin journey after parent integration and rebuild:

1. Village: show free notes disabled before one field clear and optional
   ten-coin copy available when funded; test a busy/read-only rejection. Take
   notes once, verify native inventory and source row. Read four native minutes.
2. Travel via native route to Fort post and yard. Before reading, no Fort
   milestone hint; after reading show two clears until earned, then remove it.
   Finish one clear, verify actual ore/coal; smelt an ingot in Village with the
   unlocked native recipe. Retry failed smelting through repeat salvage.
3. At post, hand in exact repair stock. Cellar opens durably. Complete native
   cellar clear and quest, verify one ledger. Another clear must not repeat the
   quest book. Return to post for two repeated stock hand-ins; purse, native
   inventory and money each move by the displayed exact amount.
4. Generated fixture: exhaust the purse below an order price; click rejects
   without taking stock. Native borrowed/custody materials also reject. Keep
   Village career counts/ranks unchanged. Check unknown item-source absence
   and observed/report distinction with a witnessed acquisition.
5. Save, reload and import generated fixtures at notes unread/read, one yard
   clear, repaired hatch, completed quest and exhausted purse. No duplicate
   book, salvage, wages or invented source rows. Test an absent-field old save.

## Evidence

Executed focused checks: `node --test tests/absorb_d.test.js`, 7/7 pass.
Tests cover old/malformed saves, earned/paid once-only notes, immutable staging,
finite funds and real stock conservation, custody/read/busy/location gates,
repair unlock staging, source privacy/report promotion, clear-hint disclosure,
original native registration and repeat-salvage recovery definition.

Full `npm test` finished: 286 tests, 285 pass, one existing
`alloy_equipment.test.js:118` equipped-clock harness timed out after 60 seconds
with SIGTERM; complete run 89.7 seconds. Log `/tmp/absorb-d-tests.log`.
Other worker suites were concurrent; parent identified host overload and ordered
serialized full-suite slots. The worker process already ended before the stop
request, so no process needed termination. No competing retry was started.
The first concurrent run was not a full-suite pass.

Parent granted the exclusive full-suite slot after C2 finished. Isolated D
`npm test` on source commit `7749e1f9755c62bfdabae49735d0937ee635f989` completed
successfully: **286/286 passed, zero failed**, duration 7.74 seconds, exit 0.
The formerly timed-out equipped-clock test passed in this run. Actual log:
`/tmp/absorb-d-isolated-tests.log`. This verifies the worker checkout's suite,
not the integrated wave or browser/persistence gate.
Build/browser/save/reload/import belong to root and are unrun here. Source is
implemented with focused automated evidence; gameplay remains unverified.

## Source attribution

Pattern references only, no copied prose/assets/code: FNA04 MrDrJames
`c0b8d1d06e96107eb1572f03ae3324e8133f1fe8`; FNA05 SchokoKaramel
`16c08d3f8b6a6318f8dc11fe27c390257b2c6b57` (connected Fort chain introduced
by `34df88733842b0f384a509f0aa15ec8b523f1081` and
`37c93d9fe0b7a37c5600ca117950318997926a4b`); FNA08/FNA12 Kuroiteiken
`9bebc9e49b0039a26044bcf6b03808826ceb692b`. Qualification and MIT provenance
are in the assigned `CANDIDATES.json` and `ADOPTION.md`; upstream license and
attribution remain unchanged. No source-world campaign, cultivation or prestige.

Resume: focused checks, syntax and isolated full suite pass. Parent owns
combined integration, rebuild and playable/save/import gates. Return the
receipt-only commit hash to parent.

Registration repair: parent found the actual native `Quest` constructor writes
`undefined` availability placeholders even when `quest_id` is provided.
`registerFortContent` now snapshots and restores prior placeholder values and
their presence in `finally`, then publishes only the named Fort bindings.
Focused regression imitates actual constructor writes and verifies all-present,
partly-present and absent placeholders, retaining object identity and both named
task bindings. Focused suite now **8/8 passed**; full suite was not repeated
for this repair, per parent scope. Combined browser/integration remains root's.
