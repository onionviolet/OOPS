# Save state relevant to these mechanics

SHOWN serializer adapter/callers and declared schema, not inspected personal save contents or a roundtrip. `SaveGame` composes player, locations, world/team inventories and wider world state. XML output is written without compression in the reviewed desktop path; `TryReadSaveFile` can also detect/decompress zlib input. The save pipeline writes temporary data and SaveGameInfo files, moves existing files to `_old`, then moves temporary files to final names. Separate moves do not establish an atomic multi-file transaction.

| State | Authoritative stored fields / declarations | Derived or separate |
|---|---|---|
| Ordinary machine | Location object item identity and placement; `heldObject`, `lastOutputRuleId`, `lastInputItem`, `minutesUntilReady`, `readyForHarvest`; output quality/stack/flavored origin on the held item. | Actual input was already consumed; snapshot is for rule/output context, not inventory. Some rule output can explicitly recalculate on collect. |
| Cask | Base object fields plus `agingRate`, `daysToMature`, held item current quality. | Next quality threshold follows code; no new owned stock is generated per intermediate quality. |
| Relationship | Farmer `friendshipData` maps NPC ID to `Friendship`: points, GiftsToday/GiftsThisWeek, LastGiftDate, TalkedToToday, ProposalRejected, WeddingDate, NextBirthingDate, Status, Proposer, RoommateMarriage. | Heart count is points/250; days married and birth countdown derive from dates. |
| Social knowledge | `giftedItems`, answered dialogue IDs, active dialogue-event counters, `eventsSeen`, mail received/queued and other flags. | Revealed gift preference and current line selection use knowledge plus rules. Full gift-knowledge provenance and event-resume policy not exhaustively traced. |
| Learning | Skill XP/levels, learned crafting/cooking dictionaries, recipesCooked and crafting counts. | Learned key, current ingredient availability and completed useful craft are different facts. |
| Compatibility | `gameVersion`, `gameVersionLabel`, `lastAppliedSaveFix`; `SaveMigrator.ApplySaveFixes` call and legacy fields. | The SaveSerializer adapter calls ordinary XML serializers; every migration and field-level roundtrip was not inspected. |

The physical clock/calendar is retained; no external timestamp-based machine catch-up was established. Do not infer realtime/offline progression from saved remaining minutes. Ordinary saves occur through game save flow, not every interactive choice. No claim that an arbitrary mid-event command cursor is serialized and resumed exactly.

YAIRPG uses an existing staged full-envelope commit in `mixture_native.js`; `commitInkNarrativeAction` likewise binds scoped host/cursor plans. Preserve that stronger publication boundary. Before adding any optional field, choose absent defaults and compatibility, then prove pending/ready/collected and paid/failed relationship states on disposable origins. Failed publication must keep prior stock/cursor, and import must not replay payments. User saves remain untouched.
