# idle-reincarnator: aspect pass, 2026-10-14

Status: PARTIAL. Lane `asp-idle`. This is a static source/data extension of the prior dossier, not gameplay, a full semantic read or implementation. SHOWN means inspected source/data, STATED means authored Help/text, INFERRED means analysis; prior native evidence is explicitly labelled. Raw source/text stays in the private work areas linked in TOOLING.

## A01 Dialogue and conversation

Status: partial. SHOWN: 177 story rows across lore (117), job (48) and life (12), all with popup=true. The shared schema contains title/body, requirements, effects, rewards, popup/hidden/uncounted and optional achievement ID. Source-authored conversations are narrated inside bodies rather than a separate speaker/portrait/response graph in these tables. No relationship-gated line schema was found in these three sources. StoryPopupHandler has first-time, repeat and disabled policies. Full prose continuity is not claimed.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/lore/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/job/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/life/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/story/story_popup_handler.gd`.

PROPOSAL: Store seen history separately from current eligibility, and let players suppress repeat popups without deleting history. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A02 Narrative delivery

Status: covered. SHOWN: Story.check_unlocked evaluates requirements; on_unlocked logs, adds effects, gives Gold/Renown, emits action/story signals, queues the popup and notifies dependents. Story.rebirth removes current effects and clears unlocked, while was_unlocked is not reset there. Save includes both flags; loading restores effects without calling give_rewards. Job stories explain earned work access, life stories explain daily-life improvements, lore stories bridge resets and capability milestones. This is a causal event layer, not merely decorative prose.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/story/story.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/job/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/life/content.json`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/lore/content.json`.

PROPOSAL: Separate first acquisition, reactivation, effect restoration and reward payment so replay does not duplicate grants. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A03 Implementation architecture

Status: covered. SHOWN: embedded PCK identifies Godot 4.5.1; 234 decoded GDScript files and 75 JSON tables support data-defined Actions. AssetLoader.CONSTRUCTORS registers content families; Game.tempData holds instances. SignalBus and Requirement dependents coordinate updates. Game.run_game_loop uses frame delta for player updates, a one-second accumulator for some handlers, plus autosave and offline controllers. GameLoading stages base assets, enabled mods, saved state and derived handlers on a worker thread. Token renderings are not original or executable source.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/AssetLoader.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/game.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/game_loading_controller.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/signal_bus.gd`.

PROPOSAL: Keep authored definitions, mutable state and derived effect caches separate. Owner: `docs/ENGINE_AUTHORING.md`.

## A04 Save and persistence

Status: partial. SHOWN: Save.save writes version, player, content families, loadouts, statistics, automations, last_played and banked offline time. get_save_text is JSON to GZIP to base64. save_data writes a temp file, rotates the old main to .bak, then renames temp to main; failure returns false on several operations but backup-rename failure is logged and processing continues. Load rejects empty/non-dictionary JSON, tries legacy base64 JSON, backup and old save directory, with a special non-desktop version repair. Autosave interval is 10 seconds. threaded_save uses mutex/is_saving; nested locking needs a Godot Mutex semantics check before treating it as a defect. Full version migration and thread snapshot consistency remain partial. No save file opened.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/Save.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/auto_save_controller.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/player/player/player_serialization.gd`.

PROPOSAL: Test each save interruption boundary and import schema; do not mistake successful JSON parsing for complete validation. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

## A05 AI and NPC behavior

Status: partial. SHOWN: no autonomous resident scheduler was established. Exploration Danger derives mortality from authored danger, reductions, lifetime boss completions and speed compensation; player actions/automation choose work rather than NPC planners. Story NPCs mainly appear as narrated teachers/employers. This is not evidence of factions or independent actor lives. All encounter-specific policies remain partial.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/exploration/danger.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/player/player/player_actions.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/pack/assets/stories/job/content.json`.

PROPOSAL: Use retained encounter knowledge as an input to preparation, with the actual current body and means checked. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A06 UI and information design

Status: partial. SHOWN: separate Godot Scenes scripts expose player information, activity cards, tabs, details, regression/rebirth controls, save/import and popup settings. Source supports current/best progress, requirement text and unlock notifications. The 96 binary .scn and 55 .res entries were not parsed; this pass makes no pixel-layout or runtime legibility claim.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/Scenes/player_information/RegressButton.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/tab_manager.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/requirement.gd`; `../SYSTEMS_AND_UNLOCKS.md`.

PROPOSAL: Keep independent work/training/exploration lanes visible with pause and funding reasons on desktop. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A07 Content authoring and modding

Status: covered. SHOWN: local mod folders use mod.json metadata and content subdirectories; subscribed Workshop items and local mods enter enabled_mods. GameLoading initializes base definitions, then enabled mod assets, then loads saved content. Mod.init_mod enumerates content directories through AssetLoader.initialize_modded_asset_type. Enabled selection is saved separately. This is an actual authoring/mod seam. Deterministic dependency order, collision diagnostics and compatibility policy were not established.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/steam/mod_manager.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/steam/mod.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/AssetLoader.gd:initialize_modded_asset_type`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/game_loading_controller.gd`.

PROPOSAL: Require stable IDs, deterministic conflict handling and save compatibility before admitting content packs. Owner: `docs/ENGINE_AUTHORING.md`.

## A08 Balance and numbers

Status: partial. SHOWN: Big wraps large-value arithmetic; Level precomputes 1001 successive powers of 1.1 and caches action XP requirements by reduction factor. EffectHandler caches modifiers and signals invalidate derived values. Ordinary past best levels improve later action learning, with skill exceptions in prior traces. Danger transforms yearly mortality to daily probability then speed compensation. Zero-danger division, full ranges and numerical stability are not runtime-tested.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/big.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/level.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/exploration/danger.gd`; `../RESET_AND_LIFE.md`.

PROPOSAL: Cache repeated curves, invalidate from real dependencies and check zero/extreme cases separately. Owner: `docs/ENGINE_EXPANSION.md`.

## A09 Time and scheduling

Status: partial. SHOWN: wall-clock load delta is clamped at zero and added to stored offline_buff_duration, not replayed through missed lives. OfflineTimeManager.tick consumes banked time during fast-forward using speed/2 per call without delta; Game calls it each in-game frame. This extends the prior offline-text/controller contradiction: expenditure appears frame-coupled. Effective rate requires runtime verification, which is prohibited here. Game-time age, speed and offline bank are distinct clocks.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/offline_time_manager.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/game.gd:run_game_loop`; `../OFFLINE_AND_CLOCKS.md`.

PROPOSAL: Express time budgets in seconds and integrate with elapsed time; expose banked time separately from calendar age. Owner: `docs/ENGINE_EXPANSION.md`.

## A10 Onboarding and reveal

Status: covered. SHOWN: starts and unlocks combine job, training, age, story, technology and reset records. Story popup defaults avoid repeating seen events. Statistics/loadout/automation reveal at different lifetime milestones in prior source trace. Requirement has OR groups with conjunctions inside a group and tracks dependents. No claim of a universally linear tutorial ladder.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/requirement.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/story/story_popup_handler.gd`; `../SYSTEMS_AND_UNLOCKS.md`.

PROPOSAL: Reveal a capability through an earned event, then explain its current cost and alternatives. Owner: `docs/TECHNOLOGY_AND_PROGRESSION.md`.

## A11 Little touches

Status: partial. SHOWN: selectable popup repetition, pause/reset-speed settings, configurable number notation/FPS, requirements text, story completion counts and queued popups support repeated lives. Some stories are uncounted, so row totals and completion totals differ. Accessibility and scene scaling remain unread. Twenty-four small transfer ideas are listed separately.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/story/story.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/game/Save.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/action/types/story/story_popup_handler.gd`.

PROPOSAL: Offer repeat-story controls and an archive while keeping state-changing results visible. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A12 Other systems

Status: partial. SHOWN/PRIOR: twelve exploration groups, jobs/training/skills, lifestyles, spells, technologies, temporals, civilization stages, statistics, redeems, loadouts and automation coexist in one setting. Rebirth and regression have different retained carriers. Mod support does not establish several simulated realms; unused reset-category descriptors do not prove an implemented third reset.

Sources: `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/AssetLoader.gd`; `/Users/weiwei/.codex/research/idle-reincarnator/extract/decoded/models/player/player/player_lifecycle.gd`; `../REPORT.md`; `SYSTEM_INVENTORY.md`.

PROPOSAL: Let civic output outlive its worker using a separate durable carrier, within the current realm. Owner: `docs/STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md`.

The existing one-realm/one-prestige milestone, familiar opening, comfortable unfed play, desktop-first direction and reasonable future reachability remain authoritative. These observations impose no fixed once-ever solo limit, source reset cadence or new mandatory release gate.
