# Save boundaries and reconstruction

Pinned sources and exact spans are in [ASPECTS](ASPECTS.md#A04) and [SOURCE_INDEX](SOURCE_INDEX.json). These are source-read facts and named limits. No authored prose or source code is reproduced. All proposed adaptations remain unselected.

## Dungeon Crawl Stone Soup

Chunk package with tagged character/player/level/ghost records. Major 34 and minor tags describe compatibility at the inspected pin.

Notes and hint payloads have independent versions; PCG generator state is distinct from debugging draw counts. Tagged migrations can derive new actor fields from older enchantment state.

Incompatible/invalid save deletion requires a prompt with default no; declined load can abort without header rewriting. Package crash atomicity and every migration remain unread.

## Cataclysm: Dark Days Ahead

Several owners/files, not one atomic JSON blob. Version 40 player JSON has legacy header support and optional archive compression.

Saved player/game payload includes turn, player, trackers, active monsters, global variables/messages and queued global effects with time/ID/context. NPC/faction/mission, map, zones and UI state are coordinated separately.

Incremental load and sequential cross-file saves expose partial-failure edges. Quicksave counter reset does not check save result. No actual corruption or recovery experiment ran.

