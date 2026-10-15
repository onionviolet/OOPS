# KeeperRL: deeper systems, 2026-10-14

The top three newly covered systems per game are ranked by practical payoff to existing YAIR owners. These are new depth beyond the supplied selected-mechanic dossiers, not new product requirements. Each source route is static evidence.

## KeeperRL

### D1: A small conversation still uses actor actions

Player selects a target, Creature::chatTo checks distance and speaker body, and the returned action owns the eventual reaction and time cost. CreatureAttributes chooses friendly/hostile text from enemy relation, then applies optional chatEffect at the recipient position with the reacting actor as source. Petting has separate friend/body/reaction eligibility. Small-talk text and consequential effects are therefore separate fields but meet at action execution. No full response graph is claimed absent globally.

Sources: [player.cpp:379-397](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/player.cpp#L379-L397), [creature.cpp:905-925](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature.cpp#L905-L925), [creature_attributes.cpp:244-260](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature_attributes.cpp#L244-L260), [creature_attributes.h:150-165](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/creature_attributes.h#L150-L165), [data_free/game_config/creatures.txt:330-350](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/data_free/game_config/creatures.txt#L330-L350).

PROPOSAL and later gate: src/models/dialogue_action.js can support a small original useful exchange without a giant conversation framework. Gate: out-of-range/refused exchange spends nothing; valid execution changes one real resource/service and consumes exactly its declared time; reopening cannot duplicate that settlement.

### D2: Save metadata, content snapshot and profile are separate

Compressed Cereal archives contain metadata and the serialized game graph, including ContentFactory definitions. Game derives sunlight after load; Model keeps time queue and local clock. Header compatibility is filtered at callers, while generic loadFromFile does not enforce it and exception handling depends on single-thread mode. saveGame copies a temporary file into place, not an atomic rename. Unlocks persist to another compressed file and are not just run fields.

Sources: [parse_game.h:1-59](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/parse_game.h#L1-L59), [serialization.h:15-45](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/serialization.h#L15-L45), [main_loop.cpp:96-147](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/main_loop.cpp#L96-L147), [main_loop.cpp:294-356](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/main_loop.cpp#L294-L356), [game.cpp:54-68](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/game.cpp#L54-L68), [model.cpp:65-75](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/model.cpp#L65-L75), [unlocks.cpp:10-46](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/unlocks.cpp#L10-L46).

PROPOSAL and later gate: src/save_compatibility.js should declare run, world-definition and profile versions separately, without assuming an embedded source definition is safe forever. Gate: load from every entry uses the same compatibility decision; a failed publication preserves old saves and profile state.

### D3: Onboarding checks what the player actually earned

Tutorial::canContinue checks completed furniture count, queued items, actual inventory, equipped weapons, teams/control, discovery and conquest. Highlights are a separate set of UI targets. Queueing and output steps intentionally use different predicates. Some summary/movement cards return true without checking a performed action, so tutorial advancement alone is not gameplay proof. Tutorial state is serialized with Player.

Sources: [tutorial.cpp:90-190](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/tutorial.cpp#L90-L190), [player.cpp:79-85](https://github.com/miki151/keeperrl/blob/95d2be4e97db2243210a71918e36a533ad94dcd1/player.cpp#L79-L85).

PROPOSAL and later gate: Existing YAIR first-slice content can teach planning, then actual funded output, then use. Gate: a queued job can satisfy a scheduling lesson but cannot satisfy a produced/equipped lesson; save/reload retains the step and the evidence that allows continuation.

