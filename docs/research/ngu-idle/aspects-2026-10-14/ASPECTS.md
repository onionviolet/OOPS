# ngu-idle: aspect pass, 2026-10-14

Status: PARTIAL. Lane `asp-idle`. This is a static source/data extension of the prior dossier, not gameplay, a full semantic read or implementation. SHOWN means inspected source/data, STATED means authored Help/text, INFERRED means analysis; prior native evidence is explicitly labelled. Raw source/text stays in the private work areas linked in TOOLING.

## A01 Dialogue and conversation

Status: partial. SHOWN: BossNameStory pairs a boss name with a Unity TextAsset; BossController.updateText selects bossProperties by bossID, with separate difficulty and terminal branches. Newly extracted assets contain 301 boss entries, of which 19 are zero bytes. This is indexed encounter prose, not evidence of a relationship dialogue graph. Dialogue-like combat barks are also embedded in EnemyAI. Portrait sprites live in separate player/boss arrays. Full scene references, all barks and any conversation system outside these readers remain unread.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossNameStory.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossController.cs:updateText`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/EnemyAI.cs`; `/Users/weiwei/.codex/research/asp-idle/extract/ngu-text/INDEX.json`.

PROPOSAL: Attach encounter prose to stable encounter IDs and state; do not infer choices from a text panel. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A02 Narrative delivery

Status: partial. SHOWN: Boss text is replayed by encounter selection; boss progress and rebirth provide the ordering. resources.assets supplies 27 other TextAssets including feature help, PatchNotes and SplashSubtitle. The 301-entry roster is an asset census, not 301 fully authored conversations; empty entries and the code fallback must stay visible in coverage. Selected early/middle/end entries were inspected privately; whole narrative continuity and scene-to-text mapping remain unread.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossController.cs:updateText`; `/Users/weiwei/.codex/research/asp-idle/extract/ngu-text/INDEX.json`.

PROPOSAL: Keep a readable encounter history separate from discovery state and current access. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A03 Implementation architecture

Status: covered. SHOWN: Unity managed C# export contains 342 .cs files. Character is a central state/controller hub with many feature controllers and serializable model objects. Start schedules updateCharacter at 0.5 seconds and updateHP at 0.02 seconds; BossController schedules fight at 0.02 seconds; frame Update also handles controls and feature work. This is several cadences, not a universal one-second tick. Inspector references and scenes supply part of the configuration; no rebuilt-source or runtime equivalence is claimed.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/Character.cs:Start,Update`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossController.cs:Start`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/PlayerData.cs`.

PROPOSAL: Use explicit activity clock semantics and one authoritative projection per feature. Owner: `docs/ENGINE_EXPANSION.md`.

## A04 Save and persistence

Status: partial. SHOWN: BinaryFormatterExtensions serializes PlayerData and the outer SaveData to base64 binary. SaveData contains playerData plus an MD5 checksum; ImportExport.loadData checks the inner text hash and rejects future build versions, then runs many version/null repair branches. PlayerData contains typed subsystem objects and lastTime, not just currencies. OpenFileDialog rejects very old/broken saves on selected routes, autosaves after a first 60-second interval then every 30 seconds, and has 1800-second standalone backup scheduling. Platform-specific local/cloud paths and exception handlers differ. All version branches, atomicity, recovery selection and Steam cloud execution are not fully traced. No personal save was read or deserialized.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BinaryFormatterExtensions.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/SaveData.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/PlayerData.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/ImportExport.cs:loadData`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/OpenFileDialog.cs:autoSaveTime,Update,backupSaveSteam`.

PROPOSAL: Use a versioned data-only envelope, explicit migrations and independently checked backup recovery; a checksum does not establish schema validity. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

## A05 AI and NPC behavior

Status: partial. SHOWN: EnemyAI.doAction dispatches seven named AI enum modes: normal, poison, charger, exploder, paralyze, rapid and grower, with default regular attack. Timers, enemy stats and status state govern attacks; special enemies add separate branches. This is combat behavior, not evidence of autonomous resident lives, factions or utility planning. Special encounter consumers and full move sets remain unread.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/EnemyAI.cs:doAction,resetAI`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/AI.cs`.

PROPOSAL: Give an opponent a visible action pattern and real counter before adding a resident planner. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A06 UI and information design

Status: partial. SHOWN/SOURCE: feature controller pages, tooltips, progress bars, number formatting and keyboard conditions. PRIOR IMAGE: the earlier dossier inspected a historical 1680x1050 official screenshot with stats and feature rails and one main page. No new visual claim is made; Unity scene layout/scaling is unread. Source page swapping should not be generalized into a claim that many systems are visible together.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/Character.cs:Update`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/NumberOutput.cs`; `../UI_DIGEST.md`.

PROPOSAL: Trial independent routine panels at 1366x768 and 1920x1080, with useful actions visible; mobile deferred. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A07 Content authoring and modding

Status: partial. SHOWN: content is mixed C# logic, serializable models, inspector lists and TextAssets. BossNameStory is a simple authoring seam, while feature balance and unlock conditions often sit directly in controllers. No supported public mod API was established by this pass; absence of a selected mod reader does not prove no mod tooling exists. Scene authoring and validation are unread.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossNameStory.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/BossController.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/ButtonShower.cs`; `/Users/weiwei/.codex/research/asp-idle/extract/ngu-text/INDEX.json`.

PROPOSAL: Validate ID references and fallback text separately from balancing code. Owner: `docs/ENGINE_AUTHORING.md`.

## A08 Balance and numbers

Status: partial. SHOWN: PlayerData mixes float, double, int and long. UnityEngine.Random is seeded from DateTime ticks in Character; selected combat damage uses a 0.8 to 1.2 random factor. Inventory has saved RNG-state fields and migration repair, so a single global-seed claim would be wrong. NumberOutput handles display, not arbitrary-precision simulation. Whole formula order, overflow behavior and pity protection remain unread.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/PlayerData.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/Character.cs:Start`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/EnemyAI.cs:baseDamage`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/ImportExport.cs:loadData`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/NumberOutput.cs`.

PROPOSAL: Keep exact quantities and display rounding distinct, and save RNG streams where replay requires them. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

## A09 Time and scheduling

Status: partial. SHOWN: Character.addOfflineProgress fans elapsed seconds into named per-system offline methods and builds a results message. Some timers advance before challenge early returns, so no-offline-progress text does not mean every timer freezes. Training, adventure, inventory, fruit, NGU, beards, hacks, wishes, cards and cooking have separate handlers. Resource fill time affects later growth. Full elapsed-time acquisition, caps, all formulas and duplicate settlement handling remain unread.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/Character.cs:addOfflineProgress`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/OfflineProgressSplashScreen.cs`.

PROPOSAL: Preview and settle eligible activities separately; show timers that advance even when production does not. Owner: `docs/ENGINE_EXPANSION.md`.

## A10 Onboarding and reveal

Status: covered. SHOWN: prior unlock source trace distinguishes current-run boss gates from permanent item-use flags; some pages appear before operational unlock. TutorialPanel and per-feature help provide guidance. Readiness and access are different predicates; rebirth can remove current access without erasing a learned system. Full first-run user experience is untested.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/ButtonShower.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/TutorialPanel.cs`; `../UNLOCKS_DIGEST.md`.

PROPOSAL: Distinguish known, available and funded in unlock explanations, without revealing sealed destinations. Owner: `docs/TECHNOLOGY_AND_PROGRESSION.md`.

## A11 Little touches

Status: partial. SHOWN: offline receipt narration, boss portraits, readiness colors, target completion, custom number display and named backup files give feedback around large numbers. These are source observations, not accessibility or usability acceptance. See SMALL_TOUCHES for 24 bounded candidates. Full font scaling, assistive technology and reduced motion behavior remain unread.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/OfflineProgressSplashScreen.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/NumberOutput.cs`; `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/OpenFileDialog.cs`; `../SMALL_TOUCHES.md`.

PROPOSAL: Show a useful receipt and a concrete next action when routine work completes. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A12 Other systems

Status: partial. SHOWN/PRIOR: achievements, bestiary/portraits, item sets, ITOPOD perks, quests, diggers, fruit, beards, hacks, wishes, cards, cooking, daily rewards and arbitrary purchases are distinct model/controller families. SYSTEM_INVENTORY lists every recovered C# source unit so undocumented families remain findable. The selected prior pass covered unlock/reset/UI, not all collection and economy consumers.

Sources: `/Users/weiwei/.codex/research/ngu-idle/extract/assembly/PlayerData.cs`; `../REPORT.md`; `SYSTEM_INVENTORY.md`.

PROPOSAL: Give a surplus output a useful competing destination before adding another currency. Owner: `docs/ENGINE_AUTHORING.md`.

The existing one-realm/one-prestige milestone, familiar opening, comfortable unfed play, desktop-first direction and reasonable future reachability remain authoritative. These observations impose no fixed once-ever solo limit, source reset cadence or new mandatory release gate.
