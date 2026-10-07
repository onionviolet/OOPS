# ACS discovery, automation and pacing

Selected source trace complete for Steam app955900, build17074448. This is semantic review of the finite paths below, not observed gameplay or whole-game coverage. No gameplay, profile, save or installed-source mutation ran.

The exact hashes and reviewed line spans live in [pacing.json](pacing.json). Every ACS locator below is relative to the pinned private root `/Users/weiwei/.codex/research/amazing-cultivation-simulator/17074448/`. The 35 selected source files include11readable inputs; those 11 copied inputs were rehashed against installed files and matched. The main assembly pin is `d225481851ee2c0111971eab98dadd00488aea4a2b0982226b38534cc3bb7902`. The parent intake owns the reproducible ILSpy export.

Read mod documentation, readable timing script, controls and handbook definitions first. Followed their managed consumers, then used queue/alert searches to locate exact production/notice definitions and reconciled them against the implementation. File names and table labels are not counted as semantic mechanic coverage.

## Actual produced item to global collection detail

The collection manager keeps a catalogue of definitions separately from the lit-state ledger. `ThingMgr` registers known item definitions. `GetThingHandLabel` classifies `WoodBlock` as material; `AddItemData` adds a named item to that category. A real found output calls `ItemThing.FoundMe`, sets `BeFound`, makes it actionable, enters the map warehouse once when needed, then calls `SetLighten`. The latter accepts only a registered key/label in allowed modes and sets its lit value and dirty flag. It charges no additional resource.

The selected preceding craft is concrete: `MaterialWorkPlace` lists `Item_RoughWoodBlock` with batch count 3. The item definition has 30 work and 1`Item_Wood` cost. Actual inventory is spent during the first work increment, not by the handbook. Successful production drops found output, linking a real material result to collection detail. This path does not grant character learning, mastery or execution rights.

The collection window lists names/counts from its global catalogue, greys unlit entries, disables their button and uses a generic category/kind unlock tip. Lit entries enable details. Its search examines catalogue labels, so this is not an actor-scoped or spoiler-free knowledge system. YAIRPG already deliberately hides unknown names before search/counts through `skill_discovery.js`; keep that stronger contract.

Collection state loads/saves a shared `IllHandData.info` path under the game's saves directory. An inspected dirty ledger flushes when its Step timer exceeds 300 dt, in a fight-map condition, or through explicit `SaveData`. We read source identifying that path, never the personal file. Mode exclusion and unregistered resolved labels produce no mark. Its load exception logs and initializes a missing lit dictionary; the inspected delete/write save path is not a transaction design to copy into YAIRPG.

Sources: `AllIllustratedHandMgr.cs:166–253,554–711,749–887`; `XiaWorld/ThingMgr.cs:376–409`; `XiaWorld/ItemThing.cs:968–979,1214–1237,1502–1513`; `Wnd_AllIllustratedHandWindow.cs:83–152,185–232,514–541`; `XiaWorld/Map.cs:2625–2650`; and the wood/station XML spans in JSON. These managed locators sit under `decompiled/Assembly-CSharp/`.

## A loop orders attempts with real spending

The loop menu offers 10 attempts, 50 attempts, infinite (`-1`) and cancel looping (`0`). `LoopTask` writes the count on the queued batch. The working building drives its production queue. Material requests obtain/lock actual item packages; once the head can work, a `MakeItem` command requires an available workspace/path and an active driver when that facility needs one. Its job locks workspace, moves the actual worker and enters `ToilMakeItem`.

Each toil increment contributes worker efficiency multiplied by the relevant skill speed and facility modifier, then by `dt`. For the selected ordinary material recipe, 30 is work effort, not 30 wall seconds. On the first `Making` progress, input locks are released and real package counts are subtracted once. After enough work, the batch leaves the queue and any next finite/infinite batch is inserted before the success roll. The remaining count therefore follows completed attempts, not guaranteed outputs.

A material shortage leaves the head batch waiting without a new `MakeItem` command and releases partial gathered locks. After 48 toil seconds, every 5 world seconds the worker may switch to a higher-priority job. Removing a task before work unlocks gathered items; the inspected removal path does not restore material already consumed by progressed work. Successful outputs and spent inputs retain their real effects. The queue/progress are serialized with the building. A generic failed roll returns `-1` after spending and requeueing; cooking and alchemy have meaningful bad-output/fire/failure-item consumers. The selected wood case uses success rate 1 in the inspected toil, so no random wood failure is claimed.

Sources: `input/Settings/ThingDef/Item/Item_Material_2_WoodBlock.xml:80–95`; `input/Settings/ThingDef/Building/Building_Production.xml:175–230`; `Panel_BuildingProduceList.cs:16–23,105–125,145–150`; `XiaWorld/BuildingProduce.cs:115–238,297–327,350–417,493–623`; `XiaWorld/CommandMakeItem.cs`; `XiaWorld/JobMakeItem.cs`; `XiaWorld/ToilMakeItem.cs:70–258`; `XiaWorld/ItemCostData.cs`; `XiaWorld/DifficultyMgr.cs:510–550`; `XiaWorld/BuildingThing.cs:1730–1745`.

## An actual notice can slow or hold the simulation

The current message table's `WorldSpeed` column is consumed by current `MessageMgr`, rather than the older `MsgMgr` path found during scouting. A table value 1 calls player pause;2/3/4request1/2/3speed. Enemy message 6 is a warning with value 2. An actual enemy spawn emits message 6, which lowers current speed to 1. In the enabled, selected15×mode, inserting a warning also pauses. The notice does not undo the enemy, elapsed time or already-spent production materials.

`GameMain.FixedUpdate` passes scaled `dt` into `MainManager.Step`. The main running flag gates manager stepping, while `PauseUpdate` modules may still step. `WorldMgr` uses the base false policy and delegates to `World.Step`, which advances saved elapsed time/day state and the map/weather/warehouse. A day spans 600 simulation seconds in this owner. Pause sets `Runing=false` but deliberately leaves Unity `timeScale=1`, preserving the UI/system update path.

Manual player pause and nested system pauses have different ownership. System pause increments `syspause`; system resume decrements its own hold and refuses to resume while another system hold or the player's pause remains. Ordinary player Play is also refused during a system hold. Alert removal does not automatically undo the player's pause in the inspected notice path.

The English help still describes fast2as 3×. The current button handler instead uses configured `MaxSpeed+3`, which is 5× at its default 2 unless a positive `ReplaceSpeed3` overrides it. A separately enabled top button requests 15×. We did not inspect stored player settings, so the user's actual selected speed is unknown. This disagreement is resolved as stale help versus current code, not silently flattened.

Sources: `input/Settings/Ui/NpcUIEvent/NewNpcUIEvent.txt:1–2,8,57,59`; `XiaWorld/Map.cs:2109–2147`; `XiaWorld/MessageMgr.cs:484–526,583–666,791–851,1107–1132,1395–1415`; `XiaWorld/MainManager.cs:353–448,855–964`; `Wnd_GameMain.cs:297–311,2257–2295`; `GameMain.cs:569–585`; `XiaWorld/World.cs:888–935`; `XiaWorld/WorldMgr.cs:148–151`; `IManagerModule.cs:4–20`; English Help controls73–85.

## Saved deadlines are tied to simulation time

`Scripts/Misc/timescript.lua` schedules waits using `GameMain.GetNow()+delay`, orders them and executes only once current time is strictly greater than the deadline. File scripts likewise compare world day/second, with a configured map-secret timing factor. The runner excludes selected construction/fight/RPG/editor/tutorial modes. Readable `main.lua` and `modbase.lua` connect the `LuaMgr.Step` bridge to `OnStep`, `OnSave` and `OnLoad`.

A due wait is removed before its callback. A due file script is removed and marked `alreadyRun` before its callback. The outer `Lib.Call` uses `xpcall` and logs errors; the inspected runner has no local rollback or retry of that removed/marked entry. The selected D270 definition triggers an event and chain notice; D277 triggers a story selection, chain notice and world flag. Their larger event contents were not read as part of this track. Stored markers/waits prevent replay through this runner, but do not prove closed-game catch-up.

Sources: `input/Scripts/Misc/timescript.lua:1–170`; `input/Scripts/main.lua:81–90,113–141,215–217`; `input/Scripts/modbase.lua:83–119`; `input/Scripts/lib.lua:366–383`; `XiaWorld/LuaMgr.cs:59–114,175–183`.

## Narrow original consumer for YAIRPG

Offer an opt-in manual review boundary after the actual accepted preparation job settles, before another batch or costly attempt is reserved. Its trigger must be the current accepted job/cause plus an actual player-known successful receipt. A historical completed count or unobserved global log cannot satisfy it. Keep a failed/no-result settlement separate through the existing accepted-job owner.

The player can continue after a fresh quote, change preparation, or cancel future steps. Already-created output, spent preparation and any ordinary currently accepted job retain their existing terms. Review itself charges no game minutes/materials and creates no mastery, output or restock. A demonstration could use the existing one-log/two-coin/three-minute `village.measured_pack` before an optional second batch; the root may instead bind its cultivation preparation packet. This is an unselected original candidate, not new gameplay. Pausing this cursor stops future reservations only and retains the current shared-clock, offer-deadline and accepted-job policies.

Current owners already deliver bounded routines, finite command/travel/wait cursors, goal stops, stock-reserve hysteresis, mandatory decision pauses and known-information UI. Wet-condition eligibility, stock and goal stops already exist, so this track need not force a fourth or fifth implementation packet. The exact missing consumer for this optional candidate is a retained cursor review/acknowledgement step and known receipt guard, with one-shot Continue that previews the next current command. Reuse `feature_expansion_work_plan.js` settlement/controls, `simulation.js` jobs, `expansion_engine.js` causal boundaries, `skill_discovery.js` qualified projection and the sole durable publisher. Do not add a clock, inventory, general alert engine or another prestige layer.

A new step/policy needs explicit admitted schema/revision fields; do not append it to frozen old cursors. Existing `workPlans1/2` and absent state stay supported. The later playable gate covers actual paid result -> manual stop before next debit, unknown/old receipt exclusion, changed-condition Continue/cancel, and save/reload/failure preserving the same owners. Unit/browser/gameplay/save-failure/regression/director suites remain deferred.

## Coverage and release

Reviewed 35 ACS source files at their listed spans,9 current YAIRPG source owners and 4 finite subtraces. This does not cover all assemblies, collection callers, facilities, scripted event bodies or the full scheduler. ACS closed/offline progression and engine background policy remain unestablished; inspected live tick/focus handlers are insufficient to infer them. `GameWatch.OnApplicationFocus:1725–1743` changes audio/mouse only. No running-game observation or balance validation occurred.

The final readback observed active shared-source edits in `simulation.js`, `expansion_engine.js` and `main.js`. Their relevant routine/knowledge/clock paths were reread and repinned; the same existing guards remain, with new causal-story hooks whose broader behavior is outside this trace. Earlier and refreshed hashes are retained in JSON. Recheck these live owners before implementation.

The trace pair is the worker's only repository output. Root owns integration and final packet design; current shared gameplay/canonical writers retain their reservations. This analytical scope is complete and released after JSON parsing, source/span/hash readback and internal claim-reference validation, with no pending child/process.
