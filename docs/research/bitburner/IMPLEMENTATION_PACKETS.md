# Original implementation proposals

Source snapshot: `1da7316ffd9d281b45a86c4c54ec532276557892`. No packet is authorized for implementation by this audit. Preserve vanilla opening, center-menu play, one realm and one prestige layer. Any selected slice must rebuild and exercise a fresh-origin browser, then save/reload/import; unexercised behavior stays implemented-unverified.

## P1 Make the existing routine legible

**Source lens:** F1,F5. **Native mapping:** src/simulation.js:311-329; existing center actions.

Repeat one native gathering command a chosen number of times, pause it, and see why the next iteration cannot start.

**Boundary:** No new automation scheduler; care actions remain excluded.

**Acceptance gate:** From fresh origin, repeat one allowed command twice; insufficient input and busy-actor rejection spend nothing; pause/resume target survives save, reload and import.

Touch inventory:

| Code | Original touch | Native surface |
|---|---|---|
| T01 | Routine label uses the actual native action name | center action row |
| T02 | Show chosen target and remaining repetitions | existing single-command routine |
| T03 | Show reserved input versus inventory available | crafting/gathering commitment |
| T04 | Name the blocked input or actor state | native action availability |
| T05 | Pause button leaves target visible | routine controls |

## P2 Workshop discovery with one functional payoff

**Source lens:** F2. **Native mapping:** native gathering, crafting recipes, professions and equipment.

Gather one specimen, study one method at a local workshop, then craft one tool whose use changes an existing action.

**Boundary:** Reuse one realm and native panels; no generic research currency tree until selected.

**Acceptance gate:** Fresh-origin unlock has one prerequisite and one payment, repeated purchase costs nothing, new recipe/tool affects a native action and reload/import retains exactly that state.

Touch inventory:

| Code | Original touch | Native surface |
|---|---|---|
| T06 | A locked method names its known prerequisite | crafting panel |
| T07 | Show exact payment before study | native inventory |
| T08 | Completed method shows a simple learned mark | existing panel |
| T09 | Show which recipe became usable | recipe list |
| T10 | Tool description states the affected action | equipment tooltip |

## P3 Receipts for productive time

**Source lens:** F4,F5. **Native mapping:** existing simulation clock, routine status and activity logs.

Return from a short absence and see completed work, inputs spent and the precise reason work stopped.

**Boundary:** Use the existing clock policy; no forecast production until it is defined and verified.

**Acceptance gate:** Fresh-origin controlled elapsed time and a scarce input produce exact bounded totals, no replay on second reload/import and a clear unfinished state.

Touch inventory:

| Code | Original touch | Native surface |
|---|---|---|
| T11 | Receipt separates completed and unfinished work | native activity log |
| T12 | Receipt states elapsed simulated time | clock display |
| T13 | Display inputs spent beside outputs gained | inventory/log |
| T14 | Stop reason distinguishes missing input from full storage | routine status |

## P4 Review the life being loaded

**Source lens:** F6. **Native mapping:** src/save_files.js:166-190; native save/import flow.

Before replacing a life, compare location, played time and schema, with a useful storage failure message tied to the last successful save.

**Boundary:** Guarded storage already exists. This is an extension, not a replacement or a claim of absent safety.

**Acceptance gate:** Use synthetic saves only: valid legacy import, malformed candidate, oversize storage failure and cancel preserve last save; successful reload/import reports the correct life.

Touch inventory:

| Code | Original touch | Native surface |
|---|---|---|
| T15 | Show last successful save time, not last attempted time | save panel |
| T16 | Compare current and candidate location | import review |
| T17 | Compare played time and schema without exposing hidden lore | import review |
| T18 | Cancel resumes existing life and autosave policy | save controls |

## P5 Research sharing needs a place and a teacher

**Source lens:** F2. **Native mapping:** native Village NPCs, workshop inventory, quests and trade.

Teach the unlocked workshop method to one named craftsperson; a related facility changes only after the lesson or delivered copy.

**Boundary:** Original proposal; existing npc_lives.js:5-39 is a predetermined household, not evidence of autonomous teaching.

**Acceptance gate:** Two synthetic actors show unlock confined to learner; absent lesson conveys nothing; delivered knowledge and resulting action persist through save/reload/import.

Touch inventory:

| Code | Original touch | Native surface |
|---|---|---|
| T19 | Method panel names its local discoverer | workshop lore |
| T20 | Lesson preview names the specific recipient | NPC dialogue |
| T21 | Receipt records one conveyed method | existing compact biography/log |
| T22 | Unknown NPC does not display future family events | existing household view |

## P6 One prestige preview, separate from travel

**Source lens:** F3. **Native mapping:** PROJECT.md one prestige layer; native stats, items, life record.

Inspect a proposed rebirth charter showing the capability gained and which current possessions or work would end before accepting anything.

**Boundary:** Policy undecided. Start with preview only; no reset implementation, second layer or travel coupling authorized.

**Acceptance gate:** A preview performs no mutation; later selected reset needs legacy-save migration, explicit field retention tests and fresh-origin save/reload/import proof.

Touch inventory:

| Code | Original touch | Native surface |
|---|---|---|
| T23 | Preview divides retained and ended fields | one prestige review |
| T24 | Name the one new function gained instead of a vague multiplier | prestige preview |
| T25 | Travel action has no prestige wording or reset toggle | native travel menu |
| T26 | Pending projects are listed in preview before reset is considered | commitment summary |

## Integration constraints

P1 is the first suggested bounded slice and needs no new world, language interpreter or parallel jobs. P2 should use one local prerequisite and one tool instead of opening a broad research catalogue. P3 and P4 are clarity/verification extensions to existing timing and saves. P5 needs authored knowledge transfer; household history alone supplies no autonomous capability. P6 stops at review until retention is selected. None authorizes source changes, test execution, builds, commits, publishing or Steam actions in this source-audit lane.
