# ngu-idle: dialogue, architecture and save digest

The priority rows are [A01-A04 in ASPECTS](ASPECTS.md). [DEEPER_SYSTEMS](DEEPER_SYSTEMS.md) traces the three selected joins. This digest records the denominator and the retrieval boundary.

## A01 Dialogue and conversation

SHOWN: BossNameStory pairs a boss name with a Unity TextAsset; BossController.updateText selects bossProperties by bossID, with separate difficulty and terminal branches. Newly extracted assets contain 301 boss entries, of which 19 are zero bytes. This is indexed encounter prose, not evidence of a relationship dialogue graph. Dialogue-like combat barks are also embedded in EnemyAI. Portrait sprites live in separate player/boss arrays. Full scene references, all barks and any conversation system outside these readers remain unread.

Source locators: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossNameStory.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossController.cs:updateText`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/EnemyAI.cs`; `/Users/weiwei/.codex/research/asp-idle/extract/ngu-text/INDEX.json`.

## A02 Narrative delivery

SHOWN: Boss text is replayed by encounter selection; boss progress and rebirth provide the ordering. resources.assets supplies 27 other TextAssets including feature help, PatchNotes and SplashSubtitle. The 301-entry roster is an asset census, not 301 fully authored conversations; empty entries and the code fallback must stay visible in coverage. Selected early/middle/end entries were inspected privately; whole narrative continuity and scene-to-text mapping remain unread.

Source locators: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossController.cs:updateText`; `/Users/weiwei/.codex/research/asp-idle/extract/ngu-text/INDEX.json`.

## A03 Implementation architecture

SHOWN: Unity managed C# export contains 342 .cs files. Character is a central state/controller hub with many feature controllers and serializable model objects. Start schedules updateCharacter at 0.5 seconds and updateHP at 0.02 seconds; BossController schedules fight at 0.02 seconds; frame Update also handles controls and feature work. This is several cadences, not a universal one-second tick. Inspector references and scenes supply part of the configuration; no rebuilt-source or runtime equivalence is claimed.

Source locators: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/Character.cs:Start,Update`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossController.cs:Start`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/PlayerData.cs`.

## A04 Save and persistence

SHOWN: BinaryFormatterExtensions serializes PlayerData and the outer SaveData to base64 binary. SaveData contains playerData plus an MD5 checksum; ImportExport.loadData checks the inner text hash and rejects future build versions, then runs many version/null repair branches. PlayerData contains typed subsystem objects and lastTime, not just currencies. OpenFileDialog rejects very old/broken saves on selected routes, autosaves after a first 60-second interval then every 30 seconds, and has 1800-second standalone backup scheduling. Platform-specific local/cloud paths and exception handlers differ. All version branches, atomicity, recovery selection and Steam cloud execution are not fully traced. No personal save was read or deserialized.

Source locators: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BinaryFormatterExtensions.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/SaveData.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/PlayerData.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/ImportExport.cs:loadData`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/OpenFileDialog.cs:autoSaveTime,Update,backupSaveSteam`.

## A09 Time and scheduling

SHOWN: Character.addOfflineProgress fans elapsed seconds into named per-system offline methods and builds a results message. Some timers advance before challenge early returns, so no-offline-progress text does not mean every timer freezes. Training, adventure, inventory, fruit, NGU, beards, hacks, wishes, cards and cooking have separate handlers. Resource fill time affects later growth. Full elapsed-time acquisition, caps, all formulas and duplicate settlement handling remain unread.

Source locators: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/Character.cs:addOfflineProgress`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/OfflineProgressSplashScreen.cs`.

Raw prose, complete tables and code stay in the private work areas linked by TOOLING; no prose reconstruction or raw dump belongs in this public dossier. Dialogue actions and save fields require separate consumer traces.
