# Save boundaries and reconstruction

Pinned sources and exact spans are in [ASPECTS](ASPECTS.md#A04) and [SOURCE_INDEX](SOURCE_INDEX.json). These are source-read facts and named limits. No authored prose or source code is reproduced. All proposed adaptations remain unselected.

## KeeperRL

gzip stream plus binary Cereal archives. Header metadata precedes the serialized Game and ContentFactory graph; profile unlocks are separate.

Durable game/model clocks, actors/controllers, time queue and content definitions are distinct from reconstructed sunlight information. Tutorial/map memory/message buffer belong to Player.

Compatibility is a caller-level version band filter. Generic loadFromFile does not itself enforce it and single-thread exception behavior differs. Temporary-file copy publication is not proven atomic.

