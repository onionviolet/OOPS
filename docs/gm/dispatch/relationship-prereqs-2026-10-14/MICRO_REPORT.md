# Micro texture lane report, 2026-10-14

Documentation-only lane complete. [Part 37](../../../worlds/world-depth-2026-10-13/37_MICRO_TEXTURE_BY_WORLD.md) grounds part 36 in code and bounded source records. These are considerations, not accepted specifications or implemented gameplay. No other lane was launched: this bounded read/write lane did not need delegation.

## Files and row inventory

| File | New content / codes |
|---|---|
| `docs/worlds/world-depth-2026-10-13/37_MICRO_TEXTURE_BY_WORLD.md` | **150 new MTX rows:** 11 machinery rows `MTX-C01–C11`; 121 world rows; 13 rule-signal rows `MTX-R01–R13`; five ranked slices `MTX-S01–S05`. Also 48 feasibility mappings, exactly one for each existing MC1–MC48, plus a source-key reference table. |
| `docs/gm/dispatch/relationship-prereqs-2026-10-14/MICRO_REPORT.md` | This report: five findings/contradiction rows `MTX-F01–F05`, four verification rows `MTX-V01–V04`, and the proposed index row below. |

World row counts: HP16, Forgotten Realms12, TTKS15 across five separate books, MoL16, Soldier12, Village14; LOTM6, Shadow Slave6, Frieren6, Naruto6, cultivation6, Fallout6. World prefixes are `MTX-HP`, `MTX-DD`, `MTX-TT`, `MTX-ML`, `MTX-SL`, `MTX-VG`, `MTX-LM`, `MTX-SS`, `MTX-FR`, `MTX-NR`, `MTX-CU`, `MTX-FO`. `MTX` was checked unused across non-sealed Markdown under `docs/` before creation. Existing MC identifiers are references, not new competing definitions. The tables are illustrative and open-ended.

## Findings and contradictions, both sides retained

| Code | Existing side / evidence | Audited side and disposition |
|---|---|---|
| MTX-F01 | Part 36 MC48 calls name/nickname, remembered inn order and time/season/log variants text over existing state, with no save change except an optional nickname. Part 20 UF4 calls the signals cheap to author. | Text is cheap to author; truth prerequisites differ. `src/display.js:863` substitutes a hero name, but no general inn-order/nickname-origin reader was found. A real usual, gift in use or durable shared nickname needs custody/history. Part 37 marks full MC1/2 M and gift-use H, while deriving cheaper home descriptions and factual variants. No edit to part 36 or 20. |
| MTX-F02 | Generic MC47 suggests one signal registry with cooldowns, and MC31 suggests ambient identity. | Existing `src/data/locations.js:346` and `src/main.js:7632` already provide conditioned sound pools and random draws; `src/display.js:990` has a background group. They have no per-signal cooldown. Power `readyAt` (`src/simulation.js:202`) and phase events are distinct mechanisms. Use a small presentation adapter if selected, not a claim that a general signal engine exists or a requirement to build all histories first. |
| MTX-F03 | Part 20 RWML1 says the code already behaves like source loop-reset relationships. Part 36 suggests that a ward hum can identify a world. | `src/book_world_mol_ids.js:13` explicitly declares one retained played-clock instance and excludes loop/reset behavior; `docs/worlds/mother-of-learning/WORLD_BRIEF.md` separates original manual lamp from personal mana. Source loop rules are future possibilities, not current behavior. ML dossier supports passenger wards, but not an audible Cyoria ward hum. Part 37 separates source premise, current adaptation and original sound. No reset or hum is implemented. |
| MTX-F04 | Earlier TTKS B1 `NOTES.md` is metadata-only; older Frieren digest says blocked/no revision. Harry Potter candidate ledger is a bounded older review. | Later TTKS `B1/DEEP_DIVE_2026-10-10.md` records a read range; `docs/worlds/frieren/SOURCE_LEDGER.md` records a recovered revision-qualified secondary snapshot; HP craft research has targeted novel locators. Preserve each coverage/date boundary. Naruto and LOTM blocked digests alone establish no fresh daily-life fact; official Naruto ledger and partial LOTM dossier are separate evidence. Neither later record certifies a whole franchise audit. |
| MTX-F05 | Part 20 UF3 suggests warmth/wariness from relationship axes; MC5/6 suggest mood and lie tells. | Part 29 DV24/RUI2–3 and `src/people_knowledge.js:27` require witnessed/disclosed projection, excluding private state. Part 37 permits observable gestures with uncertainty, not a rendered private axis or pathway diagnosis. LOTM symptom/madness support is expensive until a specific observable cause exists. The exact proposed tic is UNKNOWN. |

The report preserves the adult body/appearance floor, beneficial food without hunger death, passive play, information on encounter and desktop priority. It does not turn part 31's proposed moods into an accepted global safety rule or a new idle upkeep requirement. Fallout remains deprioritized/inactive per its live brief; including a paused palette does not authorize runtime work there.

## Checks and remaining gates

| Code | Verification and limit |
|---|---|
| MTX-V01 | Read COMMON first, project/portable instructions, current priorities, the four requested task memory notes, named design owners, relevant world briefs/source contracts and focused private dossiers/digests. Inspected code for ambient pools, log/display, greeting/voice binding, descriptions, time/weather, person disclosure, condition/event timing and memory retention. Dossier inspection is not a fresh full-book reread. No sealed file opened. |
| MTX-V02 | Dirty tree inspected before writing. Only the two assigned repository paths were created by this lane. Other writers were active; source line locators were refreshed after observed `main.js` movement. Locators identify this inspected snapshot and may move again; function names accompany important claims. |
| MTX-V03 | Structural checks cover 48 unique MC mappings, 150 unique part-37 MTX rows, per-world counts, existing explicit file references/local links, table column shape and style. A final all-file search under non-sealed `docs/`, excluding these two owned files, found no other `MTX-` prefix use. No raw prose, song lyrics or changed/randomized secret truth added. UNKNOWN and original fill-ins remain explicit. These are document checks, not gameplay tests. |
| MTX-V04 | No build, runtime/source edit, browser journey, private pack, save mutation, commit or push. Later UI target: 1366×768 desktop, existing readable log/description/card, mobile deferred. Later gameplay completion needs rebuild and fresh-origin observed behavior; persistent additions also need old/changed save, reload and literal-file import. Human taste remains a separate acceptance gate. |

Cheapest recommendation is `MTX-S01`, one sentence derived from an existing Village bridge change, followed by `S02` home time/weather, `S03` item description, `S04` three common-event variants and `S05` known work-preference greeting. Their bounded versions need no new character field. Remembered orders, personalized items, durable nicknames and cross-reload delivery suppression are explicitly outside those estimates.

Open decisions for Weibao: **none needed for this documentation delivery**. Implementation selection remains with the coordinator and existing ownership process; this report does not reserve source files or create a new acceptance gate for other lanes.

## Proposed index row, not applied

For the coordinator to place in the existing world-depth index using its local link style:

| Part | File | Contents |
|---|---|---|
| 37 | [Micro texture by world](../../../worlds/world-depth-2026-10-13/37_MICRO_TEXTURE_BY_WORLD.md) | MC1–MC48 code/save feasibility; 121 lore/original texture rows across 12 world groups, including five TTKS books; 13 rule-specific signals; five cheap Village slices; source/disclosure/copyright limits. Proposal only. |

If inserted into `docs/worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md`, use `world-depth-2026-10-13/37_MICRO_TEXTURE_BY_WORLD.md` as the link target. Index unchanged by this lane.
