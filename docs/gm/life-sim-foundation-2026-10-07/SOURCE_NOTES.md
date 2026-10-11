# Long-save source notes

Read 2026-10-07 for foundation pass E. Read-only local research inspection;
no source library, engine code, build, browser or player save was changed by
this source-reading worker. Proposals below are synthesis, not accepted rules.

## Evidence roots and boundaries

- **RW:** `/Users/weiwei/.codex/research/rimworld/1.6.4871/decompiled/`.
  C# decompilation is inspectable code, not runtime validation.
- **DF:** `/Users/weiwei/.codex/research/dwarf-fortress/24557528/`.
  `NATIVE_BOUNDARY.json:2,16-18` explicitly records no recovered native source
  or disassembly, and says native save implementation remains unrecovered.
  Shipped configuration and historical release notes support narrower facts.
  They do not prove a current internal history-compaction algorithm.

## RimWorld: selective retention and compact numeric storage

| Finding | Exact local evidence under RW | Limit of claim |
|---|---|---|
| F1. Tale objects are saved deeply, with missing/null definitions removed after loading. | `RimWorld/TaleManager.cs:17-30` | This is not a year-summary format. |
| F2. At insertion, unused volatile tales are capped at 350; excess entries with the lowest interest are removed. | `RimWorld/TaleManager.cs:38-42,62-86` | The cap excludes used and nonvolatile tales. It is not a total history cap. |
| F3. A definition can limit unused tales for one dominant pawn; oldest matches are removed first. | `RimWorld/TaleManager.cs:89-117`; default `maxPerPawn = -1` in `RimWorld/TaleDef.cs:21` | Definition/pawn limits are opt-in. |
| F4. Used tales cannot expire; unused expirable tales expire after their definition's duration. Removal refuses used tales. | `RimWorld/Tale.cs:25-29,62-75`; `RimWorld/TaleManager.cs:44-53,120-129` | Permanent history is not automatically a bounded list. |
| F5. Interest falls with use count and age, with a floor of 0.01. | `RimWorld/Tale.cs:33-59` | This is relevance weighting, not faithful reconstruction of discarded events. |
| F6. The archive sorts by creation time and caps only unpinned, currently cullable entries at 200. | `RimWorld/Archive.cs:27-40,76-103` | Pinned and temporarily noncullable entries can exceed that number. |
| F7. History graph samples are floats serialized as four bytes each, then compressed only when the compressed byte array is shorter; otherwise bytes are Base64 encoded directly. Loading accepts either form. | `RimWorld/HistoryAutoRecorder.cs:28-65`; `Verse/DataExposeUtility.cs:11-46` | Serialization compression does not bound the sample count. |
| F8. Graph sampling occurs at a definition cadence (default 60000 ticks) and appends samples. | `RimWorld/HistoryAutoRecorder.cs:14-25`; `RimWorld/HistoryAutoRecorderDef.cs:11` | No annual downsampling or sample-count cull appears in this recorder. |
| F9. Faction event history is pruned every 10000 game ticks: preserve at least five, cap to twenty highest scores, then discard scores below 0.5 while more than five remain. Score combines age and goodwill impact. | `RimWorld/HistoryEventsManager.cs:30-51,110-179` | This pruning applies to faction event maps. It is not the tale or archive policy. |

`HistoryEventsManager.cs:78-84,100-106` also attempts a per-definition
`maxRemembered` limit. The shown code trims the timestamp list before
recomputing the parallel goodwill removal count, making that second count
zero. Treat this as a decompiled-code anomaly requiring verification, not a
safe paired-array implementation to copy.

## Dwarf Fortress: what the local material actually supports

| Finding | Exact local evidence under DF | Limit of claim |
|---|---|---|
| F10. Shipped configuration documents save compression and defaults it to YES. | `retained/data/init/init_default.txt:98-100` | No codec, ratio, migration or storage limit is established. |
| F11. Historical release notes describe entity populations containing thousands of creatures tracked with less information than historical figures. | `retained/release notes.txt:3270` | A historical design explanation supports different detail levels; it supplies no yearly update/compaction algorithm. |
| F12. Historical release notes mention dead-unit culling, a historical-figure cull bug, and text for culled historical parents. | `retained/release notes.txt:950,2801,3849` | Culling exists in those historical changes; predicates, schedules, bounds and effect on legends remain unknown. |

There is no source-backed basis here to say Dwarf Fortress summarizes all
history by year, bounds all historical figures, or keeps every decade small.

## Proposed absorption for pass E

**D1. Separate durable milestones, a recent detailed tail, and compact annual
aggregates.** RimWorld supports separate retention policies by purpose;
annual aggregation itself is our design. Keep stable event/world identifiers
and dates for milestones, counts and bounded representative facts for older
years. Do not store repeated rendered prose as the only canonical fact.

**D2. Bound every growing collection explicitly.** A protected milestone or
pinned entry can defeat a nominal list cap. Annual summaries also grow with
lifespan, world count and event categories, so limit their shape and measure
actual serialized growth over long simulated spans. Never silently remove
state needed for quests, relationships, ownership or migration.

**D3. Treat compression and semantic retention as separate tools.** Numeric
packing and optional compression lower byte cost; they do not stop linear
history growth. A save guard must use the final stored representation and
handle storage failure while preserving the previous save. The browser's
actual quota is not a source-backed fixed 5 MB guarantee.

## Pass F leads, for the owning NPC worker

**F13. Active emotional memory is distinct from durable historical record.**
`RW/RimWorld/MemoryThoughtHandler.cs:76-98` updates memories and discards those
whose `ShouldDiscard` predicate fires, optionally gaining a successor thought.
`RW/RimWorld/Thought_Memory.cs:39-62` expires nonpermanent memories after their
duration; `127-146` renews the oldest grouped memory when its stack limit is
reached. This supports bounded repeated memories, not proof of yearly NPC
simulation. DF's low-detail entity populations are a useful design precedent
for distant people; the yearly aging/family/death rules must still be our
explicit proposal and tested implementation.

## Pass F follow-through: distant lives

Additional read-only inspection, 2026-10-07. **EL** denotes
`/Users/weiwei/.codex/research/elin/Elin-Decompiled/Elin/`; **KR** denotes
`/Users/weiwei/.codex/research/keeperrl/source/`. These findings are code
evidence, not executed game behavior.

| Finding | Exact local evidence | Limit of claim |
|---|---|---|
| F14. RimWorld advances mothballed pawns on a 15000-tick interval; eligible pawns move from the ordinary alive set to the mothballed set. | `RW/RimWorld.Planet/WorldPawns.cs:104-108,435-459` | This is coarse ticking, not yearly demography. |
| F15. Mothball eligibility excludes caravans and traveling pods; some nonpermanent health conditions prevent mothballing. | `RW/RimWorld.Planet/WorldPawns.cs:365-385` | Relevant urgent states keep their detailed path. Distance alone does not establish safe eligibility. |
| F16. The mothballed pawn path advances age and records only when not suspended. Its age tracker applies an interval and processes every crossed biological birthday. | `RW/Verse/Pawn.cs:1743-1749`; `RW/Verse/Pawn_AgeTracker.cs:486-495` | This path does not tick mood, reproduction or all health behavior. It does not establish inevitable offscreen death. |
| F17. Destroyed world pawns leave alive/mothballed sets and enter a dead set. | `RW/RimWorld.Planet/WorldPawns.cs:355-362` | State transition evidence, not a cause of death or a complete retention policy. |
| F18. Elin derives ordinary age from current world year minus birth year; locked age, unique-character data and a no-aging option can override that. | `EL/Biography.cs:276-294,318-320` | Constant-cost displayed aging does not imply mortality or family events. |
| F19. Elin catches up zones using elapsed plus pending hours, configuration caps and a sleep-processing cap. It reports skipped hours, leaves pending hours and advances a virtual date hour by hour. Some NPC sleep recovery is aggregated by elapsed days. | `EL/Zone.cs:1347-1407` | It caps detailed catch-up; it does not claim every skipped hour was fully simulated. |
| F20. Elin's virtual calendar dispatches hour, day and month zone hooks; the virtual year hook only increments its year. Home branches separately simulate daily research, resources, happiness and eligible NPC prayer. | `EL/VirtualDate.cs:66-102`; `EL/FactionBranch.cs:598-615` | Do not infer a yearly NPC family/death scheduler from the calendar labels. |
| F21. Elin records a marriage's date and zone identity/name. | `EL/Chara.cs:8612-8622` | This is an explicit character marriage action; it does not prove autonomous distant marriages or a family tree. |
| F22. KeeperRL updates active villain collectives with a boolean indicating whether their model is current. Global time changes also update each creature's stored global time across models. | `KR/game.cpp:378-385,462-484` | Passing an offscreen flag and clock propagation do not establish yearly aging or autonomous families. |
| F23. KeeperRL's pregnancy immigration requirement checks for an affected creature, can spawn near that creature and consumes its pregnancy effect when the requirement cost is applied. | `KR/immigration.cpp:175-179,262-267,386-391` | This supports a pregnancy-gated recruitment mechanic, not verified parent/child genealogy. |
| F24. KeeperRL records named deaths/slayings as event sentences; its recorded-event sets deduplicate identical sentences. | `KR/collective.cpp:847-851,1716-1724` | Deduplication is not a size bound or structured causal history. Different names can keep growing the set. |

### Proposed transfer into the bounded yearly NPC slice

**D4. Use an explicit distant-state contract.** A birth year and last processed
year make aging cheap and resumable. A deterministic yearly step should
process each crossed year once and keep named relationships/deaths as stable
facts. RimWorld's crossed-birthday loop is the source-backed pattern; our
calendar, mortality and family policies remain proposed game rules.

**D5. Distinguish fact, awareness and summary.** Keep a named NPC's living/dead
state and parent/partner identifiers separately from a small history summary.
A rumor should reveal only what its authored observation supports. Neither
these code excerpts nor DF's reduced-detail populations establish a ready-made
rumor truth/knowledge system to copy.

**D6. Bound catch-up and reports without silently skipping lives.** Process
years rather than minute ticks, track the processed boundary durably, and
aggregate reports before feeding the player's life record. If work is capped,
preserve the unfinished boundary and continue later. Elin demonstrates explicit
pending work and skipped detail; a whole-life foundation needs its own precise
policy for those states, tested across save/reload and one long advance versus
many short advances.

DF contributes the already noted low-detail population precedent (F11). Its
unrecovered native boundary still prevents claims about actual offscreen age,
family generation, death scheduling or historical-figure retention predicates.
