# Story data, event selection and calendar

Evidence: **shown** in binary headers, passively decoded records and decompiled reader/logic. **Inferred** means a content reconstruction, not a launched game. Extract paths are relative to `~/.codex/research/academagia-decompile/extract/`.

## E1. Storage

`OfficialContent/header.bin` is a custom index across 112 object types. Each type has a 0/255 presence byte, a little-endian Int32 count and 16-byte GUIDs. `data.bin` holds records in the same type/GUID order, with inherited fields followed by each type's fields. Strings are UTF-8 with Int32 byte lengths; references are GUIDs, not SQL joins at runtime. `info.bin` is .NET NRBF metadata. External GUID-named Resources hold media.

`Mods/*.mdm` are ZIP files containing metadata, deletions, new and modified header/data pairs, and resources. The authoring storage code uses Firebird and NHibernate (`Storage.Publish/DBLoader.cs`); **the shipped runtime payload is custom binary, not a shipped Firebird database or XML adventure pack**. No mod editor was needed to decode it.

The passive Python reader consumed exactly 68,154,787 base data bytes and the full lengths of all four patch data streams. It read no user save. Raw records, code, scripts and hashes stay in the work area.

## E2. What counts as an adventure

| Profile | Adventure records | Roots after continuance links | Random-event records | Students | Locations | Spells |
|---|---:|---:|---:|---:|---:|---:|
| Base shipped data | 1,555 | 237 | 836 | 83 | 452 | 639 |
| Base + Content, deletion-list reconstruction | 3,018 | 383 | 1,316 | 87 | 545 | 679 |
| Base + Summer, deletion-list reconstruction | 3,026 | 384 | 1,317 | 87 | 545 | 679 |

These are records, not verified reachable player content. Roots include introduction, ending, court, discovery and other stories; some are only eligible after gates. The 258 wiki pages are a coverage count, not an engine count. No one-to-one mapping was established.

**Merge caveat:** `Storage.Publish/CustomSerializer.GetDeletedObjects` expects `string[]`, but the shipped deletion files are serialized `List<Guid>` (5,261 / 5,287 entries). `MemoryDB.Create` calls that merge route. Its apparent failure to apply the list is a source discrepancy, not a proven runtime bug. Without deleting listed records, the two unions have 3,022 / 3,030 Adventure records and 547 Locations; root counts remain 383 / 384. Keep both interpretations until runtime cache construction is checked. Mods are optional inputs through `RepositorySerializer._modInfos`; this lane did not select either or inspect saves to infer selection.

## E3. Graph and gates

`ContentModel/Adventure.cs` holds title, story type, investigations and exits. `Story` adds actors, links, location and prerequisite. Exits hold success/failure continuances, benefits, drawbacks, roll alternatives and complications. Continuance records point to another Adventure and carry start/duration/date context and variance. This is a graph of stages, not 258 flat scripts.

At `StorySystem.Initialize`, any Adventure referenced by a Continuance is marked as a continuation. Only remaining roots enter the general story list. `GetPossibleStoriesForCurrentDate` filters roots by prerequisite and adds pending continuances within their date windows. Expired pending entries are removed. Prerequisites include numeric, existence and date checks; selection paths bind the actor or other entities. Immediate continuances remain inside the current story; dated continuances can suspend it until a later day. Branch-specific prerequisites/effects, not a universal five-viewpoint engine enum, implement exclusions.

Story roll lists are **alternatives**: the first successful roll wins, rather than all checks being mandatory. Adventure and adventure-complication rolls use the highest player/familiar skill total among clique members. Ordinary events use player + familiar skill only. The initiator's attribute remains the roll attribute; this is not selecting another member's whole character sheet.

Investigations can apply information, actor/lore links and success/failure effects. There is no universal '+odds' property for an information choice. Rewards and stress/failure effects are authored content. Failed rolls inform skills. Successful investigations are remembered. A sacrifice route can turn an exit into success at relationship cost. Those source policies are **not** proposed universal limits for YAIRPG.

## E4. Daily event frequency and weight

`GameController.ResolveRandomEvents` skips ill players. Otherwise draw an integer 1–100. An event is attempted if the draw is **less than 49 + Luck + RandomEventChance**. Therefore its chance is clamp(48 + Luck + RandomEventChance, 0, 100)% for integer stats.

`StorySystem.GetStoryEvent` selects non-complication, non-familiar Complication records whose prerequisites pass and whose GUID is absent from played events. For the List passed here, `RootDB.GetRandomObject` selects a uniform index. No per-event weight field is used in this route. Played GUIDs persist. Increasing the daily frequency and weighting eligible content are different operations.

`GameController` runs morning, afternoon and evening before resolving the random event and calendar/everyday effects. Thus the event does not consume a planned slot. A previously selected event is not redrawn while its GUID stays in the played list. That is the source rule, not a required YAIRPG anti-repeat rule.

## E5. Calendar

There are **12 × 30 date records = 360**. Each month contains 28 numbered weekday/weekend dates plus two named Holyday dates. Date Order has fractional values for inserted holidays. There are four phases: morning, afternoon, evening and night. Only the first three are planned actions; night has three ticks for internal work. The three-slot wiki description is correct for planning, but incomplete for the clock.

Midterms are month 12; finals month 6. Class gain anchors occur only in months 9, 10, 11, 1, 2, 3, 4, 5. Year-end logic triggers on month 6 day 28. Investiture begins attempting from month 6 day 20 with a chance increasing 10 percentage points each day. The month 7–8 calendar exists, but this Year 1 ending does not prove a playable summer term.

The weekday scheduler pre-fills morning and afternoon with classes. Character course lists assign the three morning/three afternoon subjects; six classes is not six daily action slots. Examination mornings override attendance, and detention can fill weekday evening. Holidays/weekends and illness change defaults. [CLASS_TABLES.md](CLASS_TABLES.md) describes saved randomized gain dates.
