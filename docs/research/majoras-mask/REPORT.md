# Majora’s Mask: clock, notebook and reset model

2026-10-13. **Answer first:** use a shared local clock, conditional NPC routines and a notebook that separates remembered events from current appointments. That is the strongest transferable model for a future eligible Mother of Learning loop. Keep MoL’s canon retention rules separate from Zelda’s durable equipment carry. The current Cyoria visitor campaign explicitly has no confirmed loop.

Findings and packets are PROPOSALS, not accepted decisions or implemented gameplay. Desktop/laptop first. All reference source was read statically; no game was run.

## Source table

| Source | Edition / capture | Strength and limit |
|---|---|---|
| [zeldaret/mm](https://github.com/zeldaret/mm) | N64 US decomp at `bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22`, shallow clone on 2026-10-13 | Primary code and authored schedule data. WIP reconstruction; no ROM, extracted assets, build or runtime proof. [README](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/README.md#L26-L36) explicitly excludes MM3D. |
| [Notebook](https://zeldawiki.wiki/wiki/Bombers%27_Notebook) | Zelda Wiki, live page read 2026-10-13 | Secondary description of UI, matched to N64 flag/table code. No revision permalink recovered. |
| [Song of Time](https://zeldawiki.wiki/wiki/Song_of_Time), [Inverted Time](https://zeldawiki.wiki/wiki/Inverted_Song_of_Time), [Time](https://zeldawiki.wiki/wiki/Time) | Live wiki pages, same date | Carry and version/rate cross-check. Time page carries a quality warning; avoid treating rounded real-time durations as engine constants. |
| [Majora’s Mask 3D](https://zeldawiki.wiki/wiki/The_Legend_of_Zelda:_Majora%27s_Mask_3D) | Live wiki page, same date | Remake changes are verified (wiki), not verified code or fresh play. |

## Covered versus new

The [far-field genre survey](../far-field-tropes-2026-10-08/PART_1_GENRES.md) already links a repeating disaster to knowledge of visit windows. [Timelines and divergence](../../TIMELINES_AND_DIVERGENCE.md) already names Majora’s Mask as a world on a schedule. [Groundhog Life](../groundhog-life/REPORT.md) covers daily time budgets, skill carry and life reset; [Elin](../elin/REPORT.md) covers resident work timetables; [Academagia](../academagia/REPORT.md) covers dated school events. Those broad ideas are covered, not claimed new here.

New here: pinned N64 conditional schedules, a shared ten-minute encounter across two NPCs, branch-changing promises, the notebook’s two flag meanings, selective reset code, failed-loop recovery, and version-specific 3DS planning changes. The [candidate list](../AUDIT_CANDIDATES_2026-10-10.md) says “masks and relationships carry over.” This lane corrects that wording only here: masks and records can persist; current NPC commitments and quest state need renewed actions. No other owner was edited.

Existing [MoL design return](../../gm/dispatch/parallel-book-design-2026-10-11/mother-of-learning/REPORT.md) and its linked private source/design owners remain the authority for canon detail and eligible starts. This lane does not reread the novel, credit new MoL source coverage or expose sealed truths.

## Ranked findings

### F1: A clock chooses conditional routines, not a daily reward roll.

**verified (code).** The schedule interpreter branches on day, time interval, scene, cycle flags and selected items/masks; its output includes a behavior result and interval. Anju consumes that result to choose presence, talk, work, doors or walking. This is a compact authored state machine, not evidence of a full off-screen social simulation. [S1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_schedule.c#L3-L180), [S2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/scheduleScripts.schl), [code](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/z_en_an.c#L3264-L3294).

### F2: Two routines meet at an exact shared window.

**verified (code).** On day 1, both Anju and the Postman schedule the inn exchange at 14:08–14:18. Anju’s message script changes speaker focus, records both people in the notebook, then marks the conversation heard. Following the carrier can reveal a social event without a quest marker. The last sentence is the design inference from this authored encounter. [S2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/scheduleScripts.schl), [S3](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_Pm/scheduleScripts.schl#L101-L126), [S4](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/z_en_an.c#L231-L266).

### F3: A promise changes later behavior.

**verified (code).** Anju’s midnight route requires the current promise flag; completing that meeting selects a different day-2 routine. On day 3, delivery of the pendant makes her wait at the inn; otherwise her night location is the ranch. Time alone is insufficient: prior action selects which timetable is true. [S2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/scheduleScripts.schl).

### F4: Reset uses explicit carry rules.

**verified (code).** Sram_SaveEndOfCycle filters scene and week flags through persistence tables. It clears transient event flags, ammo, carried rupees, bottle contents in the checked range, trade slots, dungeon keys and stray fairies; resets the slowdown; downgrades the Razor Sword. It preserves other inventory/quest state unless explicitly handled. This supports an allowlisted retention policy, not “keep all progress.” [S5](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L425-L653), [S6](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L168-L220).

### F5: Remembering completion is separate from completing it now.

**verified (code).** Notebook meeting and event-history flags are persistent, while the corresponding current-cycle promise/delivery flags are distinct. The table separately names the flag that colors an icon and the flag that records completion. The event queue writes recorded history and only presents its text when the notebook is owned. [S6](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L168-L220), [S7](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/include/tables/notebook_table.h), [S8](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c#L3489-L3514).

### F6: The notebook shows people against time.

**verified (wiki).** The N64 notebook has twenty person entries, schedule bars, promise marks and reward marks. After rewind, promise marks gray until the action is repeated. This is a remembered plan with a current-cycle status, not persistent NPC trust. [W1](https://zeldawiki.wiki/wiki/Bombers%27_Notebook).

### F7: Deadline failure differs from deliberate rewind.

**verified (code).** The time actor starts the moon crash when the final night crosses 06:00. Moon-crash recovery reads the stored save instead of treating all unsaved gains as a successful Song of Time carry. A loop game must distinguish restart, failure rollback and loading a saved state. [S10](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_Test4/z_en_test4.c#L405-L470), [S11](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L1168-L1205).

### F8: Forward time skips to a boundary; slowdown changes the clock.

**verified (code).** N64 Double Time assigns 06:00 at night or 18:00 by day, with a separate apply mode; its song gate rejects the final night. Inverted Time toggles offset between 0 and -2. The environment updater gates clock advance during pause, game over, most dialogue, transitions and cutscenes. These are simulation controls with exceptions, not unconditional wall-clock advance. [S9](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c#L5680-L5720), [S12](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_kankyo.c#L1200-L1220), [code](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c#L5908-L5928).

### F9: The remake makes waiting more precise.

**verified (wiki).** 3DS Double Time chooses a later hour in the current day; Inverted Time runs at 50% rather than the wiki’s roughly 30% N64 rate. These are version-specific rules, not one shared balance setting. [W3](https://zeldawiki.wiki/wiki/Inverted_Song_of_Time), [W4](https://zeldawiki.wiki/wiki/The_Legend_of_Zelda:_Majora%27s_Mask_3D).

### F10: The remake improves planning and separates saving.

**verified (wiki).** The 3DS notebook adds rumored, ongoing and completed event notes plus alarms. Owl and Quill statues make permanent saves; Song of Time no longer saves. Its clock shows the whole cycle and minutes. These changes reduce waiting and recovery friction without eliminating the deadline. [W4](https://zeldawiki.wiki/wiki/The_Legend_of_Zelda:_Majora%27s_Mask_3D).

### F11: Durable tools open shorter later attempts.

**verified (wiki).** Songs, masks and ordinary durable equipment survive Song of Time; consumables and event items do not, with the Razor Sword an equipment exception. The learned Scarecrow spawn tune is another exception: the reset code clears its set flag. Keeping a tool is different from keeping a quest’s active delivery item. [W2](https://zeldawiki.wiki/wiki/Song_of_Time), [S5](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L425-L653).

### F12: Transfer the schedule model, not Zelda’s retention fiction.

**inferred.** For a source-qualified Mother of Learning loop, use remembered observations to plan new visits, but recheck the present route after intervention. Zelda’s physical mask/item carry and bank exception cannot justify carrying local goods, notes, NPC relationships or magical sources in MoL. Existing YAIRPG’s visitor branch supplies none of that loop eligibility. [S2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/scheduleScripts.schl), [S5](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L425-L653).

### F13: A jump must resolve crossed events in order.

**inferred.** A safe idle adaptation should process due NPC actions and closing windows before arriving at the chosen time, stop at player decisions, and produce a compact receipt. A remembered meeting should support planning, not auto-grant co-location or rewards. This is a YAIRPG proposal, not a claim that the N64 engine simulates every off-screen action. [S1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_schedule.c#L3-L180), [S9](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c#L5680-L5720).

## Reset ledger

| State | N64 deliberate Song of Time | Meaning for a proposed loop model |
|---|---|---|
| Cycle clock and slowdown | Dawn baseline; slowdown off | Local phase resets; experienced time needs a separate owner |
| Learned standard songs, masks, durable equipment | Generally retained; equipment and tune exceptions above | Capability carry must be source-qualified per world |
| Notebook people and event history | Remembered flags retained | History is evidence of a prior attempt |
| Current promises, deliveries, local scene changes | Selectively cleared by persistence tables | Remembered completion is not current fulfillment |
| Carried rupees, ammo, bottle contents | Cleared; empty bottles remain | Containers and their contents are separate owners |
| Bank account | Bank field is not cleared by this reset routine | A Zelda-specific exception, not MoL permission |
| Trade items, dungeon small/boss keys, stray fairy counts | Cleared | Avoid blanket “all items carry” wording |
| Maps/compasses and standard quest progress | Reset clears boss-key bit and key/fairy counts, not the whole dungeon/quest record | Declare each field’s policy explicitly |
| Moon crash | Reads stored save | Failure recovery differs from successful rewind |

Ledger evidence: [reset routine](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L425-L653), [notebook allowlist](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L168-L220), [bank consumer](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_Ginko_Man/z_en_ginko_man.c#L150-L184), [failure recovery](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L1168-L1205). This is a checked core ledger, not every inventory or regional flag.

## How YAIRPG compares

| Actually read source | Current behavior | Useful next seam, still proposed |
|---|---|---|
| `src/world_rhythm.js`, full file | Derives recurring availability from saved calendar; validates period/open/close; suppresses repeat claim in that period. Rendering grants nothing. | Reuse half-open window semantics; local loop epoch must distinguish the same phase in different attempts. Current single service window is not a cross-NPC timetable. |
| `src/npc_lives.js`, full file | Seeded yearly birth, marriage, death and bounded news; rejects backward years. | Keep long-life history separate from hour-level schedules and loop-local resets. Rewinding this owner directly violates its clock contract. |
| `src/chronicle.js`, validation, event creation/advance, commands and heir creation | Scheduled/open/resolved/missed windows; later hearsay about missed events; knowledge changes action cost; selected heir knowledge carry. | Reuse evidence distinctions and deadline outcomes, not the frontier lifespan/heir policy as a MoL reset rule. |
| `src/book_world_mol_state.js`, full file | Same native body, independent nonmage visitor, one retained instance, freeze during absence; local offer becomes late after its authored 90-minute span; no automatic campaign programs. | A loop route needs an explicit eligible entry and distinct schema/retention policy. Do not silently reset this saved campaign. |
| `src/book_world_mol_host.js`, entry/commit/context/presentation | Actual permissions, finite means, current co-location and observed information. Presentation states no loop or protagonist replacement. | Appointment plans must still pass those live checks. |
| `src/book_world_mol_actions.js`, commands and NPC actions | Finite jobs, reservations, delivered knowledge and a study command distinguishing a temporal note from an observed temporal mechanism. | Retain attribution and current evidence; a notebook observation cannot create time magic or imported protagonist knowledge. |

A useful original fixture would involve **Mira** the archivist, **Tovin** the courier and **Sela** the apprentice. A morning parcel changes the archivist’s evening destination. First observe the courier’s route, then catch the shared exchange, then use that memory to prepare a later eligible attempt. These names, route and timing are original proposals, not MoL canon.

## Model to transfer

Store `localPhase`, `attemptId`, monotonic experienced time, current event facts, per-actor route state, and observer-qualified records separately. Authored routine rows select behavior from phase plus current facts. A notebook record says what was seen, when and in which attempt; current fulfillment belongs to the attempt state. Known schedules become expectations after intervention, not omniscient promises.

Per-world adjectives own loop span, restart trigger, retained capabilities, material carry, slowdown, skip granularity, absence/offline policy and capacity limits. Do not introduce a global fixed “once” rule. An idle queue can wait for an observed appointment and stop at a choice; it should not replay a solved social route for free goods.

[Ranked packets](IMPLEMENTATION_PACKETS.md), [small touches](SMALL_TOUCHES.md), [coverage and safety](CHECKPOINT.md), [machine-readable findings](FINDINGS.json).

## Sources and unresolved precision

- S1: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_schedule.c#L3-L180
- S2: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/scheduleScripts.schl
- S3: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_Pm/scheduleScripts.schl#L101-L126
- S4: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/z_en_an.c#L231-L266
- S5: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L425-L653
- S6: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L168-L220
- S7: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/include/tables/notebook_table.h
- S8: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c#L3489-L3514
- S9: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c#L5680-L5720
- S10: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_Test4/z_en_test4.c#L405-L470
- S11: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L1168-L1205
- S12: https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_kankyo.c#L1200-L1220
- W1: https://zeldawiki.wiki/wiki/Bombers%27_Notebook
- W2: https://zeldawiki.wiki/wiki/Song_of_Time
- W3: https://zeldawiki.wiki/wiki/Inverted_Song_of_Time
- W4: https://zeldawiki.wiki/wiki/The_Legend_of_Zelda:_Majora%27s_Mask_3D
- W5: https://zeldawiki.wiki/wiki/Time

The direct Song of Double Time wiki fetch returned an internal error. Switched to the already-readable remake page and pinned N64 message code, without retrying that URL. Wiki pages are dated live snapshots, not immutable revisions. Exact N64 slowdown fractions differ in rounded wiki descriptions; checked code toggles an offset and scene speed can vary. No universal real-time duration is proposed. Full MM3D schedule differences remain unread.
