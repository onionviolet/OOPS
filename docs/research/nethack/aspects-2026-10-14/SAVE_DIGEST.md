# Save boundaries and reconstruction

Pinned sources and exact spans are in [ASPECTS](ASPECTS.md#A04) and [SOURCE_INDEX](SOURCE_INDEX.json). These are source-read facts and named limits. No authored prose or source code is reproduced. All proposed adaptations remain unselected.

## NetHack

Version/configuration header; identity; current level; global state; other levels. NHFILE helpers choose the underlying representation, followed by configured conversion/compression.

Durable: turns, character, quest status, object chains, knowledge and timers. Rebuilt: equipped-object bindings, class probabilities, hero_seq and timer pointers.

Version/configuration rejection is explicit, but a later restgamestate failure can delete the save. Checkpoint/crash recovery and cross-format compatibility remain unplayed.

