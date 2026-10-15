# KeeperRL: aspect backfill, 2026-10-14

## Corrections

C7: Fresh upstream HEAD equals the prior pin, 95d2be4e97db2243210a71918e36a533ad94dcd1. No reviewed prior actor/material/training/base/world conclusion was contradicted. There is no new source-version or commercial-build parity claim.

C8: INTAKE.json retains an in-progress status, while the prior CHECKPOINT describes the finite five-path review as complete. Treat the latter as its completion record. New save/dialogue/tutorial scope here is separate. The known macOS FindOGG/FindOgg collision reappeared; Git blobs remain authoritative.

## Evidence and scope

Shown means directly read source/control flow. Stated means repository documentation. Inferred means an interpretation, and every YAIRPG transfer is a PROPOSAL. Covered means a representative implementation route is traced for the aspect, not every record or branch. Partial rows name what remains unread. No games were installed, built or launched, no saves were opened, and no runtime behavior, feel, performance or installed-build parity is claimed.

- KeeperRL: [95d2be4e97db2243210a71918e36a533ad94dcd1](https://github.com/miki151/keeperrl/tree/95d2be4e97db2243210a71918e36a533ad94dcd1), tree `7a7578b9c7ecd7bce7e292cc7d4a23b38d8cb538`, 939 tracked paths.

[System inventory](SYSTEM_INVENTORY.md), [three deeper systems per game](DEEPER_SYSTEMS.md), [reproducible tooling](TOOLING.md), [source evidence](SOURCE_INDEX.json), and [implementation proposals](IMPLEMENTATION_PACKETS.md) preserve the different evidence layers. The shared lane checkpoint is [here](../../nethack/aspects-2026-10-14/CHECKPOINT.md).

<a id="A01"></a>

## A01: Dialogue and conversation

### KeeperRL | covered

Shown: Player::chatAction selects an adjacent actor and calls Creature::chatTo. chatTo requires a humanoid speaker within distance one, returns a CreatureAction, and only its execution invokes chatReaction and spends time. Attributes select friendly or hostile text by actual enemy relation, then optionally apply chatEffect at the other actor's position with the reacting actor as source. The attribute schema has friendly/hostile lines, pet reaction and chatEffect fields; the free creature data sample uses localized reaction IDs. No populated chatEffect occurrence was found in the scanned free configuration, so the runtime hook is present but a shipped free-data chat-effect route is not established. This route is not a full reply graph; no relationship-level dialogue tree or portrait binding was found in it.

Sources: [player.cpp:379-397](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/player.cpp#L379-L397), [creature.cpp:905-925](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature.cpp#L905-L925), [creature_attributes.cpp:244-260](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature_attributes.cpp#L244-L260), [creature_attributes.h:150-165](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature_attributes.h#L150-L165), [data_free/game_config/creatures.txt:330-350](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/data_free/game_config/creatures.txt#L330-L350).

PROPOSAL: Keep preview and execution distinct in src/models/dialogue_action.js. A refusal or bark may be small, but a chat effect must still use actual actor eligibility and one committed time cost.

<a id="A02"></a>

## A02: Narrative delivery

### KeeperRL | partial

Shown: localized intro/help content is loaded through GameConfig and ContentFactory. Player serialization keeps message buffer, tutorial and map/visibility memory. Game::achieve records an unlock and can emit a popup when not handled through Steam. Tutorial progression gives a guided sequence through actual workshop, equipment, team and conquest states. The full story/quest catalogue, retirement message boards and external text were not read.

Sources: [game_config.cpp:1-89](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game_config.cpp#L1-L89), [content_factory.cpp:30-45](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/content_factory.cpp#L30-L45), [player.cpp:79-85](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/player.cpp#L79-L85), [game.cpp:839-855](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game.cpp#L839-L855), [tutorial.cpp:90-155](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/tutorial.cpp#L90-L155).

PROPOSAL: Existing society/world event owners should deliver short contextual aftermath and a retained history entry; a popup is feedback, not the only record of a consequential event.

<a id="A03"></a>

## A03: Implementation architecture

### KeeperRL | covered

Shown: C++ modules separate MainLoop, Game, Model, actors/controllers, collectives/tasks, data factories and GUI. MainLoop distinguishes turn-based from clock-speed updates and calls Game::update under a real-time budget. Model takes the next actor from a time queue, advances periodic ticks and executes a move. ContentFactory reads typed configuration through PrettyPrinting; Cereal archives serialize state and registered controller types. No binary build, dependency resolution or performance benchmark ran.

Sources: [main_loop.cpp:273-356](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/main_loop.cpp#L273-L356), [model.cpp:116-166](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/model.cpp#L116-L166), [content_factory.cpp:30-90](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/content_factory.cpp#L30-L90), [serialization.cpp:35-42](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/serialization.cpp#L35-L42), [game_config.h:50-69](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game_config.h#L50-L69).

PROPOSAL: Keep src/simulation.js authoritative for game time and allow presentation pacing to vary independently. A real-time frame budget must not silently skip economic work.

<a id="A04"></a>

## A04: Save and persistence

### KeeperRL | covered

Shown: CompressedInput/Output combine gzip streams with binary Cereal archives. saveGame writes version, display name, SavedGameInfo and game to a .tmp path, copies to destination and erases the temporary file. This is a copy, not a proven atomic rename. Compatibility requires a version above two, no newer than this build, and the same version/100 band. loadFromFile itself reads but does not enforce compatibility and catches all failures only outside single-thread mode. Game/Model serialize actors, content, clocks and turn events; sunlight is recalculated. Autosaves use elapsed global game time. Profile unlocks use a separate file.

Sources: [parse_game.h:1-59](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/parse_game.h#L1-L59), [serialization.h:15-45](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/serialization.h#L15-L45), [main_loop.cpp:96-147](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/main_loop.cpp#L96-L147), [main_loop.cpp:294-356](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/main_loop.cpp#L294-L356), [game.cpp:54-68](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game.cpp#L54-L68), [model.cpp:65-75](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/model.cpp#L65-L75), [unlocks.cpp:10-46](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/unlocks.cpp#L10-L46).

PROPOSAL: Preserve candidate-before-publish behavior in src/native_storage_transaction.js, state compatibility at every load entry, and separate run saves from profile receipts. Do not label copy-based publication atomic without a failure test.

<a id="A05"></a>

## A05: AI and NPC behavior

### KeeperRL | covered

Shown: MonsterAI collects behaviour moves with a value clamped to zero-to-one times a weight, can stop evaluating once later weights cannot win, includes eligible item pickups, chooses the highest-valued candidate and performs the actual CreatureAction. Model scheduling uses a shared creature time queue. Earlier dossier traces collective task ownership and funded work; it is retained as prior selected evidence, not newly rerun coverage.

Sources: [monster_ai.cpp:1210-1268](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/monster_ai.cpp#L1210-L1268), [model.cpp:116-166](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/model.cpp#L116-L166).

PROPOSAL: Existing actor controllers in src/simulation_resolution.js can expose why a job lost priority, while executing only an eligible funded action. No new generic utility framework is selected.

<a id="A06"></a>

## A06: UI and information design

### KeeperRL | partial

Shown: GuiBuilder has resource strip, minion tabs, immigrant overlays, item hints and delayed tooltips; Player has contextual map actions. Tutorial highlights point at real build, equipment and team controls. This supports a multi-surface base-management interface. Screen layout, text scaling, controller ergonomics and graphics/music are not runtime-verified by a source clone.

Sources: [gui_builder.cpp:512-575](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/gui_builder.cpp#L512-L575), [gui_builder.cpp:1188-1205](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/gui_builder.cpp#L1188-L1205), [gui_builder.cpp:1373-1400](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/gui_builder.cpp#L1373-L1400), [tutorial.cpp:157-190](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/tutorial.cpp#L157-L190).

PROPOSAL: Put useful actor, resource and work panels alongside the main action surface on desktop in src/display.js; do not collapse them to a mobile-first stack.

<a id="A07"></a>

## A07: Content authoring and modding

### KeeperRL | covered

Shown: GameConfig enumerates typed text families and collects an ordered vector of matching files from mod directories, then passes them to PrettyPrinting. ContentFactory loads creature/spell/furniture maps, sets IDs and returns errors for missing or invalid groups. KeyVerifier participates in reference checking. PrettyInputArchive has typed, named variant and map/vector parsers. This is structured data authoring; all mod conflict precedence and parser recovery branches remain unread.

Sources: [game_config.h:1-69](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game_config.h#L1-L69), [game_config.cpp:1-89](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game_config.cpp#L1-L89), [content_factory.cpp:59-140](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/content_factory.cpp#L59-L140), [pretty_archive.h:30-105](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/pretty_archive.h#L30-L105).

PROPOSAL: In world content owners, use stable typed IDs and cross-reference validation. Text configuration should expose authored rules without pretending new runtime effects can be added without implementation.

<a id="A08"></a>

## A08: Balance and numbers

### KeeperRL | partial

Shown: takeDamage computes defense from attributes, attacker-specific bonuses, flanking, lasting effects and buffs, then passes an attack/defense ratio into getDamage. Capture or lethal body results can return before later effects. MonsterAI compares clamped weighted values rather than treating each weight as a random chance. The exact getDamage curve and the full content balance catalogue were not reread, so no numeric equivalence or broad balance recommendation is claimed.

Sources: [creature.cpp:1750-1818](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature.cpp#L1750-L1818), [monster_ai.cpp:1220-1268](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/monster_ai.cpp#L1220-L1268).

PROPOSAL: Combat owner src/feature_expansion_battle.js should expose useful preparation effects and preserve result ordering. Adding an on-hit effect requires checking capture/death early exits.

<a id="A09"></a>

## A09: Time and scheduling

### KeeperRL | covered

Shown: the main loop uses presentation speed and wall-clock intervalometers in non-turn mode but advances the game through bounded steps. A pause can finish a fractional animation interval. Model ticks creatures, levels, collectives and external enemies when local time crosses tick boundaries; actor actions come from a time queue. Global time schedules autosave. No closed-app offline growth was established.

Sources: [main_loop.cpp:294-356](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/main_loop.cpp#L294-L356), [model.cpp:116-166](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/model.cpp#L116-L166).

PROPOSAL: In src/simulation.js distinguish game-time work, actor action time, UI animation and autosave cadence. Passive eligible YAIR progression must remain possible without active clicks.

<a id="A10"></a>

## A10: Onboarding and reveal

### KeeperRL | covered

Shown: Tutorial::canContinue checks concrete game state such as completed workshop pieces, queued/output weapons, actual equipment, team existence/control and discovered or conquered targets. Highlights identify the relevant control separately from the completion predicate. Some movement/summary steps permit immediate continuation, so not every tutorial card proves a performed action. Tutorial state is serialized with Player.

Sources: [tutorial.cpp:90-190](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/tutorial.cpp#L90-L190), [player.cpp:79-85](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/player.cpp#L79-L85).

PROPOSAL: In existing first-slice content, separate explanation viewed, action queued and result earned. A queue is a valid tutorial goal only when the text says so; useful output should require settlement.

<a id="A11"></a>

## A11: Little touches

### KeeperRL | covered

Shown: petting is a separate friend/body/reaction-qualified action; chat takes time only when performed; delayed item hints reduce accidental popups; tutorial highlights and predicates are distinct; saved metadata supports load-menu summaries; derived sunlight refreshes after load; profile unlocks survive separately from a run. These source observations do not prove UI feel. Twenty per-game details are recorded in SMALL_TOUCHES.md.

Sources: [creature.cpp:905-925](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature.cpp#L905-L925), [gui_builder.cpp:1373-1400](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/gui_builder.cpp#L1373-L1400), [game.cpp:54-68](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game.cpp#L54-L68), [parse_game.h:15-59](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/parse_game.h#L15-L59), [unlocks.cpp:10-46](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/unlocks.cpp#L10-L46).

PROPOSAL: Use small contextual feedback and persistent outcome receipts in src/simulation_ui.js; keep player-friendly optional care consistent with the food owner.

<a id="A12"></a>

## A12: Other systems

### KeeperRL | partial

Shown: achievements write separate unlock IDs; Game checks whether the profile already achieved an ID and optionally shows a local notification. Source also includes retirement/campaign site reuse and online message-board/file-sharing paths. Those network and retired-site lifecycle joins are inventory-only here. The prior five-path report remains the owner for materials, facilities, invitations and faction consequences.

Sources: [unlocks.cpp:10-46](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/unlocks.cpp#L10-L46), [game.cpp:839-858](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game.cpp#L839-L858), [main_loop.cpp:1300-1345](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/main_loop.cpp#L1300-L1345).

PROPOSAL: In src/frontier_campaign.js retain explicit lifetime for a run receipt versus a profile unlock. No network sharing or extra prestige is requested by this comparison.

