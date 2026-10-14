# U6: big lists and long records

## CHECKPOINT

- Lane U6, 2026-10-14. Owns this file and [U6_REPORT.md](U6_REPORT.md) only. Status: research and documentation complete; proposals unselected.
- Read COMMON.md first, then AGENTS.md, PROJECT.md, user preferences, root codes, panel kit and public discovery owner. Both owned outputs were absent at start. Live branch/dirty state and many workers observed; unrelated work preserved.
- Scope: five list-heavy surfaces. Desktop/laptop targets: **1366x768 and 1920x1080**. Intended visible outcome: find, inspect and revisit long records without losing context or shrinking prose to fit. Mobile, runtime, builds, browser sessions, saves, tests, commits and root edits excluded.
- Resume: coordinator can reconcile LS1-LS15 with the root palette. Sources and limits below are the evidence owner. No implementation or playable acceptance claimed. Never open SECRETS* files.

## Scope, authority and evidence

This lane extends [the root palette](../../../UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md), not U1's general UI survey. [COMMON.md](COMMON.md) limits writes to the two U6 files. Accepted desktop direction remains in [USER_VISION.md](../../../USER_VISION.md#standing-ui-priority-2026-10-13) and PROJECT.md. First milestone scope and paused world work remain unchanged: using Skyrim as a UI reference does not reactivate its world implementation.

**SHOWN** means a linked page was actually loaded and its relevant text inspected. It proves that the page presents the claim, not that the game/mod was run. **STATED** means a developer, tool author or wiki describes the behavior. A claim can be SHOWN/STATED. Player posts are SHOWN player testimony, with dates and limited reach, not verified current bugs. **INFERRED** marks YAIRPG proposals. **MEMORY** is unchecked recall; none of the game findings below depend on it. No screenshots or game sessions were taken.

F1. A large list needs several ways to return to it: query, saved view, pin and Back. A category tab alone cannot express overlapping purposes. RuneLite tags and PoE affinities address different parts of this problem (S3-S4).

F2. Long records need both a summary and an inspectable source. Path of Building's breakdowns, Outer Wilds Fact Log and Melvor's offline receipt support three distinct needs: explain a number, recover sequence and reconcile gains with costs (S7-S9, S17).

F3. More information can create false certainty. Scouting freshness, calculation assumptions and journal evidence belong beside results. A mod supplying a missing view is evidence of demand, not proof that every player wants that default (S6-S12).

## 1. Inventory at thousands of items

### Sourced patterns and gaps

| Code | Evidence | Pattern or gap | Transfer and limit |
| --- | --- | --- | --- |
| I1 | SHOWN/STATED, [SkyUI](https://www.nexusmods.com/skyrimspecialedition/mods/12604), S1 | Text search, sortable columns, status markers, configurable column visibility and categorized favorites. Container/barter views reuse the list. | Same retrieval verbs across owned stock and a known container. No thousand-row performance benchmark was run. |
| I2 | SHOWN/STATED, [SkyUI Recent Sort](https://www.nexusmods.com/skyrimspecialedition/mods/176212?tab=description), S2 | Adds acquisition-order sorting. | A later mod extends an already rich list: recent loot is a different question from highest value. Not proof current SkyUI always lacks it. |
| I3 | SHOWN/STATED, [RuneLite Bank Tags](https://github.com/runelite/runelite/wiki/Bank-Tags), S3 | Multiple tags per item, tag-only search, variant tagging and quick-access tag tabs. | One tool can appear under several activities without duplicate ownership. Client plugin, not a claim about every RuneScape bank. |
| I4 | SHOWN/STATED, [PoE stash folders and affinities](https://www.pathofexile.com/forum/view-thread/2986656), S4 | Folders group tabs; affinity sends eligible deposits to a chosen tab independent of the open tab, with an indicator and master switch. | Separate where stock is stored from the view used to find it. This is a 2020 announcement, not an exhaustive current stash spec. |
| I5 | STATED, Melvor v0.17/v0.21 indexed notes, S5/S17; SHOWN/STATED developer release post, S20 | Search lights matching bank tabs; bank item locks introduced separately from sorting; offline receipts include consumption. | Tabs, protection and receipt serve different needs. Wiki load failed; indexed historical notes do not establish current UI. |
| I6 | SHOWN player testimony, [Melvor search thread](https://www.reddit.com/r/MelvorIdle/comments/1bl1hwh/), S18 | A 2024 player reported partial terms missing expected items across tabs; a reply describes highlighted tabs that must be opened. | Search scope must be legible. Complaint and alternate explanation both recorded; current defect not established. |

The useful distinction is **stored location**, **category**, **player purpose** and **protection**. A bag is a location; weapon is a category; “winter trip” is a tag; protected is an action guard. Conflating them makes players reorganize physical stock just to answer a question. INFERRED for YAIRPG.

### Retrieval and record operations, all YAIRPG proposals (INFERRED)

| Operation | Default | Dial and source connection |
| --- | --- | --- |
| Search | Search owned/accessible stock by visible name and known description; show scope and location on each hit. | Current bag, all accessible containers, or all recorded stock including inaccessible locations. Distinguish “remembered” from “available now”; I1/I5/I6. |
| Filter | Chips for known type, usable now, equipped and protected, with Clear filters. | Combine known traits, material, source and quantity; reveal advanced query syntax on request. I1/I3. |
| Sort | Known type then name, with a fixed tie-breaker. | Acquisition time, quantity, known price, weight or selected visible stat; retain manual order as a separate option. I1/I2. |
| Group | Current container and known category. | Saved overlapping activity tags; subgroup by world or condition. Grouping must not move items. I3/I4. |
| Tag | Optional personal tags; one item can have many. | Tag a visible selection or known variants; preview scope before changing all variants. I3. |
| Pin | Pin an item or saved query by stable identity. | Pin a reserve target or loadout. Watchlist appearance does not protect the stock from sale. NV5. |
| Compare | Selected item versus equipped item, known fields and delta. | Two or three selected alternatives with use conditions; no single “best” score required. IN5. |
| Archive | Sold/lost history stays in Records, separate from usable stock. | Show historical holdings or collapse old acquisitions; view hiding never sells or destroys. MO7. |
| Summary | Capacity, usable quantities and known value, labeled by scope. | Activity readiness such as visible ingredients held/needed; unknown requirements stay unknown. IN3/MO7. |

**Knowledge/sealed boundary:** unidentified objects keep their observed label and appearance. Hidden effects cannot participate in search, tag suggestions, “upgrade” rankings, exact value totals or compare deltas. A poison filter cannot reveal an unappraised poison. “All recorded stock” cannot reveal an unopened container's contents. Capacity known from an ordinary bag can be shown; a secret object's existence cannot change a visible result count. See LS1/LS9.

## 2. Quest, journal and notebook at hundreds of entries

### Sourced patterns and gaps

| Code | Evidence | Pattern or gap | Transfer and limit |
| --- | --- | --- | --- |
| J1 | SHOWN/STATED, [Witcher 3 All Quest Objectives On Map](https://www.nexusmods.com/witcher3/mods/943), S6 | Shows objectives from active journal quests, supports choosing tracked objectives from the map and optional discovered merchant caching. | A mod removes repeated map-to-journal switching. It explicitly excludes quests absent from the journal. More markers may still need filtering. |
| J2 | SHOWN/STATED, [Morrowind Journal Search and Edit](https://www.nexusmods.com/morrowind/mods/46756?tab=description), S7 | Search across pages, next/previous match, personal edits/pages, hyperlinked topics and return to main journal. | A chronological book can gain retrieval without losing its form. Author warns manual formatting may overflow. |
| J3 | SHOWN/STATED, [Outer Wilds Custom Ship Log Modes](https://outerwildsmods.com/mods/customshiplogmodes/), S8 | Documents vanilla Map/Rumor modes and carrying the focused entry between them. | Preserve selection when switching list/location/link views. This page does not prove every vanilla graph or search affordance. |
| J4 | SHOWN/STATED, [Outer Wilds Fact Log](https://outerwildsmods.com/mods/factlog/), S9 | Encounter-order log of discovered facts and rumors, with offline HTML export. Older facts can have unreliable timestamps. | A summary organized by topic does not replace “what did I learn last time?” Exact dates require provenance. |
| J5 | SHOWN player testimony, [Morrowind journal redesign thread](https://www.reddit.com/r/Morrowind/comments/pjyir3/), S19 | Players ask for an alternative journal; another names mods, and a respondent says both failed their needs. | Mod availability does not settle navigation taste or show universal satisfaction. 2021 discussion, not current compatibility evidence. |

Quest tracking, personal annotation and evidence gathering are distinct. A useful notebook can retain a rumor that never becomes a quest, or several conflicting readings that should not become a completion checklist. INFERRED for YAIRPG.

### Operations (INFERRED)

| Operation | Default | Dial and source connection |
| --- | --- | --- |
| Search | Titles and already learned text, with matching excerpt, date and source. | Search my notes, testimony, completed entries or current leads separately. J2/J4. |
| Filter | Active commitments, leads, resolved and personal notes are distinct. | Known region, giver, topic, freshness and evidence state; combining filters cannot invent a lead. |
| Sort | Recently updated active entries; chronology inside each record. | Name, known deadline, place or encounter order. Distinguish learned-at from event-at. J4. |
| Group | Topic/quest with linked people and places. | Chronological book, location view or evidence map over the same visible records. J2/J3. |
| Tag | Personal tags recorded as my labels. | Several tags, saved topic searches; never label my “probably false” tag as game truth. |
| Pin | One focused objective plus optional lead watchlist. | Several tracked known objectives with per-view marker limits. J1/NV5. |
| Compare | Side-by-side statements with speaker, time and knowledge state. | Compare two revisions or several accounts; annotate contradiction without deciding hidden truth. IN5. |
| Archive | Resolved commitments leave the active view and stay searchable. | Show completed, failed, abandoned or all; archive a lead manually without deleting it. |
| Summary | Last known objective, last evidence and an actionable known link. | Recap since last visit or longer prose; source links always reachable. J4/IN3/NV3. |

**Knowledge/sealed boundary:** a rumor is searchable as attributed testimony, never as verified truth. A suspected unnamed entry stays unnamed in headings, links, autocomplete and map nodes. Known-but-unavailable objectives may show a known reason; unknown prerequisites do not become a checklist. Personal guesses do not unlock content or promote knowledge. A completion percentage may count only a disclosed finite set, never the author's secret quest count.

## 3. Character sheet at hundreds of stats

### Sourced patterns and gaps

| Code | Evidence | Pattern or gap | Transfer and limit |
| --- | --- | --- | --- |
| C1 | SHOWN/STATED, [Path of Building Community](https://pathofbuilding.community/), S10 | Gear sets, comparisons, ranked node reports, detailed derived-stat breakdowns, search and sorting. | Put result, inputs and conditional model together. External planner, not proof that the native PoE sheet has these controls. |
| C2 | SHOWN/STATED, [Path of Building repository](https://github.com/PathOfBuildingCommunity/PathOfBuilding), S11 | Offline planner calculating offense/defense and offering build planning. | Planning is a scenario, not current character state. No clone, benchmark or calculations run here. |
| C3 | SHOWN player testimony, [PoE DPS thread](https://www.pathofexile.com/forum/view-thread/2239569), S12 | A player reports sheet ranking unlike observed performance; replies distinguish secondary damage and recommend PoB estimates. | Record complaint and explanation: a displayed metric may be narrower than players assume, not simply wrong. 2018 example. |
| C4 | SHOWN player testimony, [Fallen London forum](https://community.failbettergames.com/t/invisible-qualities/14744), S13 | A player expands Myself categories and uses page search. | Grouping alone still leaves a retrieval task. Historical behavior, not current layout inspection. |
| C5 | SHOWN/STATED, [Sheetifier and Questspector author post](https://community.failbettergames.com/t/new-extension-sheetifier-questspector/25209), S14 | Exports observed qualities to CSV to avoid prolonged searching; a second tool infers story progress, with bugs acknowledged. | An extension is evidence of demand for analysis. Inferred story state can be wrong or spoil hidden meaning. |

### Operations (INFERRED)

| Operation | Default | Dial and source connection |
| --- | --- | --- |
| Search | Known stat names, visible descriptions and known aliases. | Search source modifiers or visible equations; no search over author-only qualities. C4/C5. |
| Filter | Current body, active modifiers and relevant known systems. | Nonzero, changed since checkpoint, inactive but known, or full known sheet. Zero can remain useful. |
| Sort | Domain order then stable name. | Magnitude within compatible units, recent change or impact within a stated scenario. Never sort health, money and percentage as one scale. |
| Group | Body, offense, defense, skills, social and known progression domains. | Group by source, body or world; only discovered groups exist. |
| Tag | Optional personal stat sets such as “before travel.” | Saved queries and named dashboards; no mandatory taxonomy work. |
| Pin | Useful summary stats, units and current conditions. | Pin any known value or a delta from a chosen snapshot. NV5. |
| Compare | Current versus selected gear/body/build, with affected known stats. | Show all rows or only changes; disclose assumptions and unavailable inputs. C1/IN5. |
| Archive | Explicitly named past snapshots, kept apart from live sheet. | History of values and modifiers; a stale snapshot cannot look live. |
| Summary | A few current outcomes with “why” links to modifiers. | Full equations or category summary. Estimated outcomes remain labeled estimates. C1/C3. |

**Knowledge/sealed boundary:** self-knowledge is not automatic omniscience. An undiscovered trait may affect play without adding a sheet row or helping a filter match. Appraisal supplies bands, uncertainty or named readings at its own grade. A breakdown can honestly say an observed result is not fully explained without listing a hidden modifier, its size or count. Planning comparisons cannot reveal a sealed ability's future effect. Historical observations retain their original state; later learning may add a clearly dated interpretation.

## 4. People at hundreds of NPCs

### Sourced patterns and gaps

| Code | Evidence | Pattern or gap | Transfer and limit |
| --- | --- | --- | --- |
| P1 | SHOWN/STATED, [Football Manager Recruitment Revamp](https://www.footballmanager.com/features/recruitment-revamp), S15 | Named recruitment focuses, near matches, summaries; report completeness and “Needs Updating” status distinguish scope and freshness. | A people list should describe why someone matches and how well you know them. Article body is about FM23 despite current site header. |
| P2 | SHOWN player testimony, [FM squad comparison thread](https://www.reddit.com/r/footballmanagergames/comments/wltv6z/), S16 | Player cannot find side-by-side attributes; another explains custom columns and the player reports finding them. | Both sides: feature discoverability failed; this thread does not prove feature absence. 2022 discussion. |
| P3 | SHOWN/STATED, [Dwarf Therapist manual](https://github.com/Dwarf-Therapist/Manual/blob/master/Dwarf%20Therapist.tex), S21 | Name filter; grouping by profession, squad, happiness and migration wave; separate sorting and preference filtering. | Separate cohort discovery from rank within a cohort. Historical tool manual, not an installation or compatibility check. |
| P4 | SHOWN/STATED, [RelationsTab repository](https://github.com/fluffy-mods/RelationsTab), S22 | A colony/faction relationship overview exists as a RimWorld mod. | Evidence of demand for an overview beyond inspecting one pawn. Loaded README did not establish specific search/tag/compare controls. |

### Operations (INFERRED)

| Operation | Default | Dial and source connection |
| --- | --- | --- |
| Search | Known names, observed aliases and player notes. | Known role, faction or place; “all known people” separate from “present now.” |
| Filter | Available contacts, known relationship/role and report freshness. | Candidate queries such as “known craft skill, contactable here”; unknown skill is neither zero nor a confirmed negative. P1. |
| Sort | Name in a roster; recent contact in the relationship view. | Visible aptitude, known deadline or report date; uncertain bands tie rather than secretly rank by true value. |
| Group | Household, known faction, party or location. | Arrival cohort, task and personal tags; a person can belong to several groups. P3. |
| Tag | Optional personal labels kept distinct from observed traits. | Shared role sets and saved recruiting queries; my suspicion is not a game-confirmed trait. |
| Pin | Small personal watchlist linked to the full directory. | Named lists, reminders and status changes; no hidden event alerts. NV5. |
| Compare | Two or three candidates with role-relevant known fields and freshness. | Custom columns, qualitative notes or bounds; explain missing data rather than compute a false perfect rank. P1/P2. |
| Archive | Known departed, dead or unreachable people leave present roster, remain in history. | Include former contacts; show only the last known status, never reveal an unobserved death. |
| Summary | Role, last contact, outstanding known commitment and source date. | Relationship map or recruiting digest with links to evidence. P1/P4. |

**Knowledge/sealed boundary:** display a rumor of a person only if that rumor was learned, with an attributed name/description. Private allegiance, intent, identities and true affinities cannot determine filter results, rank or network edges before discovery. “Friendly” based on observed behavior should not imply access to exact disposition. A watchlist cannot report remote changes without a means of learning them. Appraisal and last-seen date remain attached to each visible field, not just the person card.

## 5. Event log at thousands of lines

### Sourced patterns and gaps

| Code | Evidence | Pattern or gap | Transfer and limit |
| --- | --- | --- | --- |
| E1 | SHOWN/STATED, [DF announcement options](https://dwarffortresswiki.org/index.php/Announcements.txt), S23 | Display, popup, pause, recenter and report routing are separate controls. | Recording and interruption are different choices; do not turn every line into a popup. Wiki, not current settings exercised. |
| E2 | SHOWN player testimony, [DF UI requests](https://www.reddit.com/r/dwarffortress/comments/zh162n/), S24 | Players ask for announcement history and completed work history. | “I cannot retrieve it” is its own gap, separate from whether an alert originally appeared. 2022 release-era discussion. |
| E3 | SHOWN/STATED, [Mudlet Trigger Engine](https://wiki.mudlet.org/w/Manual:Trigger_Engine), S25 | Match conditions, capture groups and filter chains classify incoming text. | Capture fields can route events to useful views. This is authoring power, not evidence ordinary users want regex as default. |
| E4 | SHOWN/STATED, [Mudlet UI Functions](https://wiki.mudlet.org/w/Manual:UI_Functions), S26 | Gagging with deleteLine affects rendering; triggers still run. Console tools support separate output views. | Suppressed display is not erased meaning. YAIRPG mute should not cancel mechanics or lose the inspectable receipt. |
| E6 | SHOWN/STATED, [RimWorld Block Unwanted Minutiae](https://github.com/MrChimick/BlockUnwantedMinutiae/blob/master/README.md), S27 | Mod author describes configurable suppression of messages, alerts and letters. | Direct mod evidence of demand for choosing what interrupts. Does not prove hidden messages remain in vanilla history. |
| E7 | SHOWN player testimony, [RimWorld cold-plant notification thread](https://www.reddit.com/r/RimWorld/comments/1dzhyga/), S28 | A player reports repeated routine notifications distracting from play; replies recommend the suppression mod. | A game rule can be expected and still create unwanted repeated alerts. A reply also suggests changing the growing-zone intent. Current mod compatibility untested. |
| E5 | STATED, [Melvor v0.21 notes](https://wiki.melvoridle.com/w/V0.21), S17 | Offline receipt includes XP/kills and food, prayer, ammunition and other consumption. | Net gains alone hide resource costs. Indexed historical notes only; no current offline session run. |

### Operations (INFERRED)

| Operation | Default | Dial and source connection |
| --- | --- | --- |
| Search | Visible rendered event text plus learned entity names; exact timestamp/link. | Time interval, session, body or source category; “around this event” restores neighboring context. |
| Filter | All relevant categories visible; repeats grouped; critical known outcomes easy to find. | Per-category mute, focus on an entity, or capture into a separate view; muting display differs from deleting records. E3/E4. |
| Sort | Chronological within a trace, newest-return digest above it. | Oldest first, date ranges, or severity for digest only. Do not reorder a causal trace by severity. |
| Group | Identical routine outcomes with count and interval; separate distinct decisions. | Group by job/session/entity; expand original retained events. E5/IN3. |
| Tag | System categories from visible meaning; optional bookmarks/notes. | Personal capture rules previewing visible matches, with undo and disable. E3. |
| Pin | A receipt or important event can be bookmarked. | Watch known event types or entities; tie alerts to the attention queue, not a new popup channel. |
| Compare | Two session receipts: gains, costs, duration and known conditions. | Trace excerpts alongside totals; normalized rate only where times/units are comparable. IN5. |
| Archive | Bounded live buffer plus retrievable session digests and important receipts. | Choose raw-history retention and export visible history; clearly state oldest retained date and any missing span. |
| Summary | On return, important known changes then gains/costs with drilldown. | Short digest, detailed receipt or full retained trace. Repeated failure remains visible even with zero net gain. E5/IN3. |

**Knowledge/sealed boundary:** the log records what this viewpoint observed or legitimately learned, not every simulation event. A summary cannot name a hidden cause that individual lines redact. Repeat counts, captured fields, bookmarks and exports use that same projected data. Future-looking or cross-body views require actual authorized knowledge; hidden events do not generate unread badges. A player's suppress rule cannot alter discovery or the save, and unmuting must not reveal previously inaccessible facts.

## Root mappings and qualifications

| Root code | U6 addition | Important qualification |
| --- | --- | --- |
| IN3 | LS10-LS12: causal repeat groups, costs in offline receipts, retained-session retrieval. | Summary and raw retention are distinct. No evidence here proves indefinite logs are cheap or desirable. |
| IN5 | LS7-LS8: align units, observation grades and scenario assumptions; compare testimony without resolving truth. | Table comparison is not guaranteed prediction; unknown inputs remain unknown. |
| IN6 | LS2-LS5 and LS15: visible scope, saved views, separate group/sort, readable detail and stable identity. | Root's “cards stop around 30” is an unmeasured heuristic. Shape and reading task matter; no threshold confirmed. Virtualization is a candidate, not browser-proven in this lane. |
| NV3 | LS6: Back restores query, selection and reading position. | Links only to learned entities; mode changes should preserve the focused record where possible (S8). |
| NV5 | LS4/LS9: pin entity, query or receipt; distinguish pinning from protecting. | Pinning does not grant remote knowledge or freeze gameplay state. |
| MO7 | LS13: known collection scope with explicit denominator provenance. | Knowing a category exists does not mean knowing its total. A global total can reveal hidden entries even if every category heading is known. |

INFERRED qualification to MO7: prefer **“23 recorded discoveries”** unless a public, learned source establishes a finite denominator. If a disclosed catalogue lists 40 entries, “23/40 in this catalogue” is honest. Do not infer an author's total from content-pack size. Similarly, a player can count known people without being shown the world's total population.

## LS palette: default plus dial (all INFERRED)

These codes are lane proposals for coordinator consideration, not selected implementation. Dials change presentation over eligible knowledge; none bypass discovery or sealed rules.

| Code | Consideration | Proposed default | Reachable dial | Root |
| --- | --- | --- | --- | --- |
| LS1 | Project knowledge before retrieval | Create the allowed names, fields and links first; queries, sorting, counts and summaries use that projection. | Include learned rumors/outdated records with labels, or narrow to verified/current; no “show sealed” display toggle. | IN6, MO7 |
| LS2 | Explain search scope | Visible scope chip, matched excerpt and result location; distinguish empty scope from no matches. | Current container/view, all accessible, all recorded, archive; plain text first, advanced syntax optional. | IN6 |
| LS3 | Saved task views | Useful domain views and a clear Reset; grouping and sorting are separate. | Save queries, columns, sort and groups with names; manual order survives as its own view. | IN6 |
| LS4 | Overlapping tags | Player labels allow many purposes without moving the underlying record. | Tag selections/known variants; preview bulk scope and undo. | IN6, NV5 |
| LS5 | Readable row and record | Compact readable rows plus selected detail in the same work area. Long prose gets a reading region. | Grid, table, book, map or graph where suitable; choose columns/density without forcing smaller text. | IN6 |
| LS6 | Return to where I was | Back restores query, filters, selected ID and scroll anchor; cross-view navigation retains identity. | Open detail beside list, pin it or use a larger reading view; invalid anchors fall back to nearest visible record. | NV3 |
| LS7 | Compare like with like | Aligned fields, units, knowledge grades and explicit missing values. | Two/three entries, changed-only/all-known fields, selected domain columns. | IN5 |
| LS8 | Explain calculated results | Show scenario/observation date and reachable known inputs for each estimate or delta. | Current conditions, named planning scenarios and past snapshots; never mix simulated and live results silently. | IN5 |
| LS9 | Distinct pin, protect and hide | Pin watches; protect guards a named action; hide changes a view only. | Scope protection to sale/consumption/manual order if meaningful; a hidden row is still held and can be restored. | NV5, IN6 |
| LS10 | Preserve causal boundaries | Group identical routine outcomes within a stable interval; expose count and time span. | Expand retained occurrences or disable grouping; changing item, outcome, condition or commitment breaks a group. | IN3 |
| LS11 | Return digest with costs | Important learned changes, gains, consumed stock and failed/blocked work, each linked to a receipt. | Compact or detailed digest; trace if retained. No surprise jump to live tail while reading. | IN3 |
| LS12 | Honest archive and retention | Active view stays short; old records remain retrievable within explicit retention. Important records survive routine trace trimming. | Archive filters, date ranges, personal bookmarks and projected export; show any omitted-history interval. | IN3, NV3 |
| LS13 | Disclosed collection scope | Count recorded discoveries; percentage only for a learned finite catalogue. | Per-world/body/life catalogue views with explicit source and denominator. | MO7 |
| LS14 | Keep freshness and attribution | Rumor, observation, inference and outdated reading remain distinguishable at field level. | Filter by source, confidence/state or last contact; comparing claims never silently verifies them. | IN5, IN6 |
| LS15 | Stable reading under growth | Keep selected identity/focus and reading anchor when live data changes. Announce new visible rows quietly. | Manual refresh for sorted live tables; Follow latest for logs; paging or virtualization chosen after measuring. | IN3, IN6 |

## Desktop outcomes and deferred acceptance

INFERRED review targets, not tests run or new release gates:

| Code | Target and task | Observable proposed outcome | Dial or limit |
| --- | --- | --- | --- |
| V1 | 1366x768 inventory/people lookup | Search, scope, active filters and selection remain visible; inspect a full description beside results or in an expandable reading area. | Collapse optional columns; do not make tiny text the only fit option. |
| V2 | 1920x1080 journal/stat inspection | Use extra width for source/derived explanation or two comparable records while retaining the result list. | Reader can expand prose; summaries do not replace original text. |
| V3 | Both sizes, cross-links | Person to journal to place and Back returns to the same visible record/query/anchor. | Larger detail page remains reachable; no new window requirement. |
| V4 | Both sizes, idle return | Digest shows costs and failures; reading an older trace stays in place while visible new-event count grows. | Follow latest is explicit; unread count ignores sealed events. |
| V5 | Large fixture proposals | Try 5,000 inventory rows, 500 journal entries/stats/people and 10,000 event lines, with mixed knowledge states. | Sizes are stress scenarios, not measured player thresholds. Later implementation owner measures rendering, query delay, keyboard use and focus across paging/virtualization. |

A later runtime slice would need rebuilt fresh-origin desktop evidence under AGENTS.md, plus restoration/import evidence if it changes persisted notes, tags, pins or history. Display-only column/sort choices can follow the panel kit's browser settings owner. Personal notes and annotations that are part of a life need an explicit persistence/compatibility decision; this document does not make one. LS1 safety review should include zero results, autocomplete, filter counts, tie ordering, exports, accessibility labels and summaries for each surface.

## Source ledger and route limits

All accessed 2026-10-14. Line references describe retrieved page text, not a checked-out revision. Linked author/tool claims are paraphrased. No mod installed; no performance, compatibility or prevalence claims. Failure handling: Melvor wiki body load failed once, so historical indexed STATED notes and an independently loaded developer/community route were used. Steam Relations Tab body load failed once, so switched to its author repository. Did not retry either through URL variants or open a browser.

| ID | Source and evidence inspected | Status / limitation |
| --- | --- | --- |
| S1 | [SkyUI mod description](https://www.nexusmods.com/skyrimspecialedition/mods/12604), relevant text L522-L566 | SHOWN/STATED mod author; search, columns, status and container reuse. |
| S2 | [SkyUI Recent Sort](https://www.nexusmods.com/skyrimspecialedition/mods/176212?tab=description), L359-L361 | SHOWN/STATED author; acquisition column. |
| S3 | [RuneLite Bank Tags](https://github.com/runelite/runelite/wiki/Bank-Tags), L138-L188 | SHOWN/STATED project wiki; multiple tags, search, variants and quick tabs. |
| S4 | [PoE folders/affinities announcement](https://www.pathofexile.com/forum/view-thread/2986656), L58-L71 and folder section | SHOWN/STATED developer, 2020; routing options, not current exhaustive mechanics. |
| S5 | [Melvor v0.17 notes](https://wiki.melvoridle.com/w/V0.17), indexed search text | STATED historical notes; bank search highlights tabs. Full body fetch failed. |
| S6 | [Witcher 3 objective-map mod](https://www.nexusmods.com/witcher3/mods/943), L363-L365, L479-L502 and description restriction | SHOWN/STATED author; active known quests, selection from map. |
| S7 | [Morrowind Journal Search and Edit](https://www.nexusmods.com/morrowind/mods/46756?tab=description), L442-L495 | SHOWN/STATED author; search/pages/topic hyperlinks and formatting limits. |
| S8 | [Outer Wilds Custom Ship Log Modes](https://outerwildsmods.com/mods/customshiplogmodes/), L27, L50-L64 | SHOWN/STATED mod author; vanilla modes and carried selection. |
| S9 | [Outer Wilds Fact Log](https://outerwildsmods.com/mods/factlog/), L8-L24 | SHOWN/STATED author; encountered chronology/export; timestamps/controller limitations. |
| S10 | [Path of Building Community](https://pathofbuilding.community/), L19-L55 | SHOWN/STATED project; gear comparison, reports, breakdowns, search/sort. |
| S11 | [Path of Building repository](https://github.com/PathOfBuildingCommunity/PathOfBuilding), About and README | SHOWN/STATED project; offline planner. No runtime used. |
| S12 | [PoE DPS question and replies](https://www.pathofexile.com/forum/view-thread/2239569), L57-L113 | SHOWN player testimony, 2018; observed ranking and limited metric explanation. |
| S13 | [Fallen London invisible qualities discussion](https://community.failbettergames.com/t/invisible-qualities/14744), L31-L33 | SHOWN player testimony, 2015; expand categories and page search. No hidden quality specifics reproduced. |
| S14 | [Sheetifier/Questspector author post](https://community.failbettergames.com/t/new-extension-sheetifier-questspector/25209), L12-L14 | SHOWN/STATED tool author, 2026; observed-data export, inferred progress and admitted bugs. |
| S15 | [Football Manager Recruitment Revamp](https://www.footballmanager.com/features/recruitment-revamp), L151-L164 | SHOWN/STATED developer; article body explicitly FM23, current site header differs. |
| S16 | [FM side-by-side squad attributes thread](https://www.reddit.com/r/footballmanagergames/comments/wltv6z/), L89-L97 and original question | SHOWN player testimony, 2022; custom-view discovery solved in replies. |
| S17 | [Melvor v0.21 notes](https://wiki.melvoridle.com/w/V0.21), indexed search text | STATED historical notes; consumption alongside gains. Not a current session. |
| S18 | [Melvor bank search complaint](https://www.reddit.com/r/MelvorIdle/comments/1bl1hwh/), L24-L26 and tab-highlight reply | SHOWN player testimony, 2024; partial-term mismatch and scope explanation. |
| S19 | [Morrowind journal redesign discussion](https://www.reddit.com/r/Morrowind/comments/pjyir3/), L50-L60 and original request | SHOWN player testimony, 2021; demand and dissatisfaction despite available mods. |
| S20 | [Melvor alpha v0.15 developer release post](https://www.reddit.com/r/MelvorIdle/comments/gkrcco/), indexed developer post | SHOWN/STATED developer post, 2020, retrieved L198-L200; locking removes sale option, distinct from ordering. |
| S21 | [Dwarf Therapist manual](https://github.com/Dwarf-Therapist/Manual/blob/master/Dwarf%20Therapist.tex), retrieved L2854-L2860, L3118-L3124 and Group By/Sorts sections | SHOWN/STATED tool manual; filtering, cohorts, sorting. Historical manual, no current compatibility claim. |
| S22 | [RelationsTab author repository](https://github.com/fluffy-mods/RelationsTab), About L140-L142 | SHOWN/STATED author; colony/faction overview only. Steam route failed; detailed affordances unverified. |
| S23 | [DF announcements configuration wiki](https://dwarffortresswiki.org/index.php/Announcements.txt), L31-L35 and report options | SHOWN/STATED community wiki; display, pause, popup, recenter and report flags. |
| S24 | [DF interface requests](https://www.reddit.com/r/dwarffortress/comments/zh162n/), L783, L921 | SHOWN player testimony, 2022; completion and announcement history requests. |
| S25 | [Mudlet Trigger Engine manual](https://wiki.mudlet.org/w/Manual:Trigger_Engine), L254-L298 | SHOWN/STATED project docs; chains, filters and captures. |
| S26 | [Mudlet UI Functions manual](https://wiki.mudlet.org/w/Manual:UI_Functions), L1470-L1491 and console functions | SHOWN/STATED project docs; rendering gag retains trigger behavior. |
| S27 | [Block Unwanted Minutiae README](https://github.com/MrChimick/BlockUnwantedMinutiae/blob/master/README.md), short author description | SHOWN/STATED mod author; configurable notification suppression. No history-retention claim. |
| S28 | [RimWorld cold-plant notification discussion](https://www.reddit.com/r/RimWorld/comments/1dzhyga/), original request and replies | SHOWN player testimony, 2024; repeated routine pings and suggested mod. |

## Open research limits, no questions for the director

| Code | Unsettled point | Default while unsettled / later dial |
| --- | --- | --- |
| O1 | Current compatibility and exact versions of referenced mods were not checked. | Use the sourced mechanism as a design reference; install or version-pin only in a separately authorized implementation study. |
| O2 | Retention costs and search/render behavior at stress sizes were not measured. | Keep records retrievable and disclose retention; choose paging/virtualization after actual desktop measurement. |
| O3 | Suggested games not needed for this lane were not fully surveyed. | Evidence centers on SkyUI, PoE, RuneLite, Melvor, Morrowind, Witcher 3, Outer Wilds, PoB, Fallen London, FM, DF and Mudlet. Diablo 4, Stardew, Qud, Cogmind, JEI/REI, Cyberpunk, BG3, Disco, Obra Dinn, Elden Ring, Grim Dawn, CK3 and Persona remain unsourced here, not negative findings. |
| O4 | Root merging and implementation priority remain coordinator/director work. | Keep LS codes as considerations linked to existing root owners; none is a new milestone gate. |
