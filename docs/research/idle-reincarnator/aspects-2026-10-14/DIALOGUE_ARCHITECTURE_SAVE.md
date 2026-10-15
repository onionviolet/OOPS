# idle-reincarnator: dialogue, architecture and save digest

The priority rows are [A01-A04 in ASPECTS](ASPECTS.md). [DEEPER_SYSTEMS](DEEPER_SYSTEMS.md) traces the three selected joins. This digest records the denominator and the retrieval boundary.

## A01 Dialogue and conversation

SHOWN: 177 story rows across lore (117), job (48) and life (12), all with popup=true. The shared schema contains title/body, requirements, effects, rewards, popup/hidden/uncounted and optional achievement ID. Source-authored conversations are narrated inside bodies rather than a separate speaker/portrait/response graph in these tables. No relationship-gated line schema was found in these three sources. StoryPopupHandler has first-time, repeat and disabled policies. Full prose continuity is not claimed.

Source locators: `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/lore/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/job/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/life/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/story/story_popup_handler.gd`.

## A02 Narrative delivery

SHOWN: Story.check_unlocked evaluates requirements; on_unlocked logs, adds effects, gives Gold/Renown, emits action/story signals, queues the popup and notifies dependents. Story.rebirth removes current effects and clears unlocked, while was_unlocked is not reset there. Save includes both flags; loading restores effects without calling give_rewards. Job stories explain earned work access, life stories explain daily-life improvements, lore stories bridge resets and capability milestones. This is a causal event layer, not merely decorative prose.

Source locators: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/story/story.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/job/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/life/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/lore/content.json`.

## A03 Implementation architecture

SHOWN: embedded PCK identifies Godot 4.5.1; 234 decoded GDScript files and 75 JSON tables support data-defined Actions. AssetLoader.CONSTRUCTORS registers content families; Game.tempData holds instances. SignalBus and Requirement dependents coordinate updates. Game.run_game_loop uses frame delta for player updates, a one-second accumulator for some handlers, plus autosave and offline controllers. GameLoading stages base assets, enabled mods, saved state and derived handlers on a worker thread. Token renderings are not original or executable source.

Source locators: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/AssetLoader.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/game.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/game_loading_controller.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/signal_bus.gd`.

## A04 Save and persistence

SHOWN: Save.save writes version, player, content families, loadouts, statistics, automations, last_played and banked offline time. get_save_text is JSON to GZIP to base64. save_data writes a temp file, rotates the old main to .bak, then renames temp to main; failure returns false on several operations but backup-rename failure is logged and processing continues. Load rejects empty/non-dictionary JSON, tries legacy base64 JSON, backup and old save directory, with a special non-desktop version repair. Autosave interval is 10 seconds. threaded_save uses mutex/is_saving; nested locking needs a Godot Mutex semantics check before treating it as a defect. Full version migration and thread snapshot consistency remain partial. No save file opened.

Source locators: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/Save.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/auto_save_controller.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/player/player/player_serialization.gd`.

## A09 Time and scheduling

SHOWN: wall-clock load delta is clamped at zero and added to stored offline_buff_duration, not replayed through missed lives. OfflineTimeManager.tick consumes banked time during fast-forward using speed/2 per call without delta; Game calls it each in-game frame. This extends the prior offline-text/controller contradiction: expenditure appears frame-coupled. Effective rate requires runtime verification, which is prohibited here. Game-time age, speed and offline bank are distinct clocks.

Source locators: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/offline_time_manager.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/game.gd:run_game_loop`; `../OFFLINE_AND_CLOCKS.md`.

Raw prose, complete tables and code stay in the private work areas linked by TOOLING; no prose reconstruction or raw dump belongs in this public dossier. Dialogue actions and save fields require separate consumer traces.
