# Persistence and architecture trace

Static source only. No save files, including shipped tutorial fixtures, were opened. Personal settings/mod order were not inspected.

## S1: Execution and snapshot boundary

`GameMain.FixedUpdate` calls `MainManager.Step` and event dispatch; `Update` renders. Manager modules own serializable domain data. `MainManager.Save` pauses, yields to a fixed update, gathers managers into `SL_GAME`, then serializes JSON. A different yield precedes writing. Named, autosave, hardcore, debug and transition paths differ. Do not infer a universal transaction from the existence of a pause.

`SL_GAME` includes current world, unfinished worker jobs, knowledge, events, UI message data, mods, formations, regions, pets, challenges and RPG state. `World` opts properties into serialization. `DlgDef` ignores node lookup maps/live UI nodes. `JobMgr.AfterLoad` reconnects loaded jobs; the interval base restores its partial elapsed interval. Thus authored definitions, derived caches and consequential state are distinct.

Sources: `managed/GameMain.cs:569-588`; `managed/XiaWorld/MainManager.cs:502-645`; `managed/XiaWorld.SaveLoad/SL_GAME.cs`; `managed/XiaWorld/World.cs:15-125`; `managed/XiaWorld/JobMgr.cs:80-108`; `managed/XiaWorld/DlgDef.cs`; `managed/IManagerModule_LoopInterval.cs`.

## S2: File envelope and publication

`SaveMgr.BuildSaveFile` serializes a metadata header, wraps it through AES and delegates to `SevenZipHelper`. The targeted firstpass helper pads a supplied header to normally 2,000 bytes, writes five LZMA properties bytes, eight bytes of original length and compressed data. That helper's method name Zip does not mean a ZIP container. Header length can exceed the padding target; that is why the reader also consults the detected header length. Body text remains JSON before compression. A separate text/debug format takes a different path.

The inspected string writer creates `.saveb`, deletes the existing `.save` and moves the staged file. The old destination survives compression failure, but delete-plus-move has an interruption window. The object writer invokes BuildSaveFile directly on the final path. Neither path proves backup retention, fsync, crash-safe replacement or error recovery. A background Thread is optional; synchronous save can abort an existing thread. The Saving flag is cleared after the try/catch, so a thrown exception can skip that cleanup. These are source concerns requiring a dedicated fault test, not witnessed loss in ACS.

Sources: `managed/XiaWorld/SaveMgr.cs:76-251`; `SevenZipHelper.cs:13-160`.

## S3: Loading, compatibility and failure

`SaveMgr.Load` chooses a save path, decompresses into `.osave`, parses JSON and normally removes the intermediate. It logs extraction/deserialization errors; `MainManager.Load` sets LoadFail if it gets null and stops loading. Tutorial and inter-map snapshots have special paths. Header fields include mode, version, mods and DLC IDs; CheckDLC reports activation. The exact complete UI refusal matrix was not read.

`VersionCorrect` discovers methods marked with maximum version attributes, invokes qualifying methods and contains repairs such as collection-ledger backfill. `World` and other modules also check old load versions. This is distributed migration, not evidence of a single ordered schema chain. All historical migration ordering, corrupted graph handling and adversarial data validation remain unread.

Sources: `managed/XiaWorld/SaveMgr.cs:266-446`; `managed/XiaWorld/MainManager.cs:645-732`; `managed/XiaWorld/VersionCorrect.cs:9-95`; `managed/XiaWorld/World.cs:440-477`.

## S4: Time and reproducibility

Autosave accumulates `dt / Time.timeScale` and compares configured minutes after the running check. The default getter is 15 in its ordinary branch. World stores double simulation time and day counters; 600 simulation seconds map to one day in the inspected conversion. Interval managers save remaining phase by type name, consume one interval per Step and do not drain all accumulated work in one call. World random helpers expose named streams, but dialogue text also uses Unity's random API. No blanket offline or deterministic replay guarantee follows.

Sources: `managed/XiaWorld/MainManager.cs:353-420`; `managed/GameWatch.cs:1013-1020`; `managed/IManagerModule_LoopInterval.cs`; `managed/XiaWorld/World.cs:70-125,817-900`; `managed/Wnd_Dlg.cs:177-245`.

## PROPOSAL: YAIRPG acceptance packet

Owner: existing persistence and clock owners, including `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`. Keep one authoritative publisher and the current one-realm/one-prestige scope. Inventory schema/content revisions, derived fields and scheduler phase. Then exercise synthetic full-storage, failed-write, corrupt-input, unsupported-version, reload/import and split-time cases. Passing a static audit is not this acceptance gate. No ACS codec, fixed key, prose, implementation or punitive save behavior is proposed for copying.
