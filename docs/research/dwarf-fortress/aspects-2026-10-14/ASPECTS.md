# Dwarf Fortress aspect backfill, 2026-10-14

Research executed 2026-10-15. Status: PARTIAL, all twelve aspects assessed with named unread boundaries. No gameplay or whole-engine completion claim.

## Corrections and extensions to the prior dossier first

| Code | Disposition | Evidence and corrected scope |
|---|---|---|
| F1 | Build unchanged | Steam appmanifest_975370.acf reports build 24557528, StateFlags 4, staging 0 and complete download/stage counters. File census matches 2,749 files and 1,139,421,922 bytes. Executable SHA256 remains 205770918fd54c96cbbcf89223ebd449e2e113c7c873ed81177c4511a3450db7. All 29 prior semantic-review file hashes match. This is not a full hash comparison to the lost 2,749-file snapshot. |
| F2 | Retention pointer stale | Prior REPORT/INTAKE/CHECKPOINT describe an old-Mac private snapshot. Per this assignment it is gone. New selective extract is ~/.codex/research/bf-dwarf-fortress/extract/payload/, with HASHES.txt and receipts. Old private paths are historical evidence only. No old files were rewritten. |
| F3 | Native boundary extended | Prior statement that no native disassembly was done was true for that pass. This pass uses REA over Ghidra for four addresses: text loader, incomplete set-name switch, save-error and load-abort handlers. Three yield useful bodies; the switch has an unrecovered jump table. No original C++ source, full serializer or AI is recovered. |
| F4 | Text coverage extended | Prior language/text/art area was unread. All 64 vanilla_text object files are now read: 64 sets, 724 physical lines, 340 nonblank body lines including title patterns and fragments. No conversation-node count is implied. |
| F5 | Save documentation qualified | Default autosave prose and token spelling disagree (SEMIANNUALLY versus SEMIANNUAL); an AUTOBACKUP comment points to no default key in that file. Keep actual token, prose and effective user settings separate. Native error messages do not prove transactional rollback. |
| F6 | Missing prior outputs | There is no prior TOOLING.md, COVERAGE.md or INTAKE.md. Read COVERAGE.json and INTAKE.json instead; prior report/checkpoint supplied route provenance. This folder supplies a repeatable TOOLING.md. |

## Evidence conventions and scope

SHOWN means shipped data/code or static native output read here. STATED means bundled comments/descriptions/release notes. INFERRED means interpretation with its limit attached. Paths in aspect sources resolve beneath the selectively retained payload unless prefixed ../ for the prior dossier. Native addresses apply only to the pinned executable. Private census and extraction are retrievable through TOOLING.md. No raw dialogue, code, full prose or assets are redistributed here.

This is a source research pass. No game/Windows binary launch, install, save/prefs/log access, browser gameplay, screenshot, YAIRPG build, runtime edit, commit or push. YAIRPG takeaways are PROPOSALS; existing owners and first one-realm/one-prestige scope retain authority. Desktop first, mobile optimization deferred. No fixed once-only limit or offline policy is selected.

## A01: Dialogue and conversation

Status: partial.

SHOWN: 64 TEXT_SET declarations in 64 files, 724 physical lines and 340 nonblank body lines. These 340 include title patterns and word lists, so they are not 340 conversation nodes. Speaker/audience/context placeholders occur 22/7/70 times. A set supplies phrases or fragments; context can name kin, a historical figure, site, building, profession, elapsed years or a worship link. Living/dead kin, current/past profession, baby greeting, different-language reply and temple membership have distinct set IDs. No graph edges, line-level condition expressions, portrait bindings or state-change commands occur in the 64 supplied files.

SHOWN (static native): 0x14131de00 reads bracketed TEXT_SET headers, looks up or allocates a named record, and appends later nonempty input to the current record via helper 0x1400bb770. This is a loader, not a dialogue tree interpreter. 0x14131e4f0 references fixed set-name cases, but its jump table did not decompile. INFERRED: native code selects a context-specific set and expands the supplied phrases. Selection predicates, relationship thresholds, substitution implementation, promises, membership mutation and reward settlement remain unread. A sentence naming membership proves wording, not that rendering it grants membership.

Sources: `data/vanilla/vanilla_text/objects/text_greet.txt:3-7`; `data/vanilla/vanilla_text/objects/text_family_relationship_spec.txt:5-7`; `data/vanilla/vanilla_text/objects/text_family_relationship_spec_dead.txt:5-7`; `data/vanilla/vanilla_text/objects/text_task_recommendation.txt:5-7`; `data/vanilla/vanilla_text/objects/text_greet_reply_diff_language.txt:5-7`; `Dwarf Fortress.exe:0x14131de00, 0x14131e4f0`.

PROPOSALS: Dialogue owner: docs/worlds/DIALOGUE_AND_INTERACTIONS.md. Supply typed speaker/listener/context facts to short original variants; keep condition and consequence owners separate. People/knowledge owner: src/people_knowledge.js. Use known kin, site and profession records for speech; never resolve private world truth merely because a template requests it.

## A02: Narrative delivery

Status: partial.

SHOWN: book instruction and art sets provide 155 and 18 title-pattern body lines. Leads distinguish known person/site/building, same-site wording and an unknown location. These are different evidence states in the supplied wording, not proof of an omniscient quest journal. Announcement configuration maps event kinds to logs, alerts, unit reports, recentering and interruption. Role descriptions separately state that accounting, appraisal and health access depend on officers. INFERRED: historical state can be projected through several narrative surfaces. Native event-history storage, journal closure, rumor truth and scheduler are unread. Full book contents are not in these title templates.

Sources: `data/vanilla/vanilla_text/objects/text_book_instruction.txt:5-161`; `data/vanilla/vanilla_text/objects/text_book_art.txt:5-24`; `data/vanilla/vanilla_text/objects/text_same_site_ab_specific_hf_seeker.txt:5-7`; `data/vanilla/vanilla_text/objects/text_unknown_hf_seeker.txt:5-7`; `data/init/announcements.txt:1-17`; `data/vanilla/vanilla_entities/objects/entity_default.txt:636-689`.

PROPOSALS: Dialogue and continuity owners: use leads that preserve known location precision and uncertainty. Information/UI owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Project one event into a brief log and inspectable record without inventing a second history writer.

## A03: Implementation architecture

Status: partial.

SHOWN: executable is native Windows x86-64 PE32+, 26,507,264 bytes; export and CLR directories are zero. Managed ILSpy and IL2CPP routes do not match this artifact. The readable extension layer is 19 Lua files plus bracketed raw/data/config text. Lua generate() runs preprocess, flagged early/prehistory hooks, materials, items, conditional languages, creatures, interactions, entities and postprocess, calling native-facing raws registration APIs. Comments warn callers can invoke generation more than once. Native TEXT_SET loading is now partially decompiled through REA/Ghidra. No C++ source was recovered. STATED: shipped defaults enable multithreading with a small possible FPS benefit. INFERRED: a native simulation hosts a declarative content layer and worldgen Lua; Lua is not shown to be the per-tick engine. Native main loop, event bus, threading correctness, cache policy and simulation performance are unread.

Sources: `data/init/generators.lua:248-301`; `data/init/globals.lua:1-66`; `data/init/globals.lua:258-283`; `data/vanilla/vanilla_procedural/info.txt:1-8`; `Dwarf Fortress.exe:PE headers, 0x14131de00`; `data/init/d_init_default.txt:123-127`.

PROPOSALS: Engine/authoring owner: src/simulation.js and docs/worlds/ABILITY_AUTHORING.md. Keep definition generation separate from paid live actions and state mutation. Generation owner: record seed, stable candidate order and provenance; do not treat all hook invocations as first-run initialization.

## A04: Save and persistence

Status: partial.

STATED: defaults describe three rotating autosave slots, manual saves for longer retention, optional save at embark and pause on load. The comment lists SEMIANNUALLY while the actual default token is SEMIANNUAL. The initial-save comment mentions AUTOBACKUP although no such default key is present in this file. Compression defaults to YES; a comment suggests disabling it for corruption diagnosis. These are shipping defaults, not the user's effective prefs. Release notes state compatibility from 0.50.01+ and recommend copying into a fresh install with backup rather than overwriting old folders.

SHOWN (static native): 0x14154919c is an exception-style handler associated by RIP-relative reference with a failed-active-save/synchronization diagnostic, builds a message, calls diagnostic helpers and writes status value 0x33. 0x14157c890 builds a load-abort diagnostic from a fixed prefix plus exception detail, calls helpers and writes another status 0x33. The symbols and context layouts are unresolved. Native strings also name current world files and numbered autosave slots. INFERRED: save/load failure has explicit reporting paths. This does not establish the caller's synchronization gate, atomicity, rollback or what 0x33 means. No serializer/schema, migration dispatcher, byte-level compression format, checksum, saved-versus-derived map, offline timestamp policy, save fixture, save/reload/import or corruption test was inspected. User saves were not read.

Sources: `data/init/d_init_default.txt:4-17`; `data/init/init_default.txt:98-100`; `release notes.txt:6-23`; `Dwarf Fortress.exe:0x14154919c, 0x14157c890`; `Dwarf Fortress.exe:string VAs 0x141605dc0, 0x1416ac840`.

PROPOSALS: Persistence owner: src/expansion_persistence.js. Separate bounded recovery snapshots from a deliberately retained manual checkpoint and expose failure without publishing success. Save review owner: docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md. Preserve format/version and report migration acceptance explicitly; DF compatibility comments are not a YAIRPG migration design.

## A05: AI and NPC behavior

Status: partial.

SHOWN: species declarations include activity timing, personality ranges and life stages; entities declare ethics, values, jobs, reactions, offices and responsibilities. STATED in defaults: traffic costs feed pathfinding and very large values can cause lag; storage targeting discounts apparent distance for compatible filled containers. Visitors and accepted residents count differently toward the cap. These inputs constrain behavior without exposing a full planner. INFERRED: hauling can express stock grouping preference within travel cost rather than only choosing nearest empty capacity. Native target search, work reservations, cancellation, utility weights, faction decision-making and individual schedules remain unread.

Sources: `data/init/d_init_default.txt:49-77`; `data/vanilla/vanilla_creatures/objects/creature_standard.txt:260-301`; `data/vanilla/vanilla_entities/objects/entity_default.txt:369-462`; `data/vanilla/vanilla_entities/objects/entity_default.txt:636-689`.

PROPOSALS: Work/custody owner: src/simulation.js. Test grouped-storage preferences against actual travel, capacity and item compatibility. Social owner: docs/worlds/DIALOGUE_AND_INTERACTIONS.md. Keep culture policy, personal traits and current willingness separate.

## A06: UI and information design

Status: partial.

SHOWN: announcement flags separately control box/pause, recenter, adventure and fortress displays, unit reports and alert indication. Key declarations expose tab changes, zoom, pause and log-to-location navigation. Defaults allow fluid-depth numbers, ramp arrows, lower-elevation visibility and history visibility; officers describe qualified stock/value/health information. Interface graphics contain tile and rectangle declarations. STATED is stronger than observed here: no screen was rendered, so desktop composition, tooltip quality, number formatting, discoverability and keyboard usability remain unverified. No copied screenshot or inferred mockup is presented as reference evidence.

Sources: `data/init/announcements.txt:1-17`; `data/init/interface.txt:1-47`; `data/init/interface.txt:1379-1384`; `data/init/d_init_default.txt:79-109`; `data/vanilla/vanilla_entities/objects/entity_default.txt:636-689`; `data/vanilla/vanilla_interface/graphics/graphics_interface.txt`.

PROPOSALS: UI owner: docs/UI_RULES.md. Proposed surface is an inspectable event in the existing log home, at 1366x768; preserve the log and shared controller/Back/Esc. Mobile optimization stays deferred. Information owner: show sourced counts and estimates where a service actually supplies them; do not hide ordinary inventory for a universal new DF-style gate.

## A07: Content authoring and modding

Status: partial.

SHOWN: modules carry IDs, numeric/displayed versions and earliest-compatible versions; content uses typed bracket records with cross-record IDs, optional Lua generation and separate graphics declarations. Shipped examples cover instruments, reactions, gaits and interactions. Generated records retain GENERATED and source historical-figure/entity provenance. Native loader recognizes TEXT_SET identifiers and stores content beneath them. INFERRED: data and generator extensions can share a stable registry. Module dependency/load order, duplicate-ID resolution, Workshop install behavior and grammar validation are unread; an info file version is neither the engine version nor a guarantee a mod is active. No game scripts were executed.

Sources: `data/vanilla/vanilla_text/info.txt:1-8`; `data/vanilla/vanilla_procedural/info.txt:1-8`; `data/init/generators.lua:248-301`; `data/vanilla/examples and notes/item_instrument_example.txt`; `data/vanilla/interaction examples/`.

PROPOSALS: Authoring owner: docs/worlds/ABILITY_AUTHORING.md. Validate IDs, typed fields and reference targets before admission; keep origin IDs distinct from display names.

## A08: Balance and numbers

Status: partial.

SHOWN: candidate enumeration sorts keys for seed stability; generation invokes every candidate, discards nil and selects by weight through native trandom. The total uses a missing-weight fallback but selection later subtracts weight directly, so the warning path is not proven safe. The routine retries traversal up to ten times and falls back to the first result or nil. Materials declare value/density/thermal/mechanical properties independently from weapon dimensions, modes and recovery. STATED: grazing scales with a coefficient and metabolism with size to the 3/4 power. No native damage or metabolism formula was verified. No pity system or arbitrary-precision numeric implementation was found in inspected code; absence across the engine is not established.

Sources: `data/init/globals.lua:1-66`; `data/init/globals.lua:258-283`; `data/init/d_init_default.txt:49-70`; `data/init/d_init_default.txt:113-115`; `data/vanilla/vanilla_materials/objects/inorganic_metal.txt:8-127`; `data/vanilla/vanilla_items/objects/item_weapon.txt:16-59`.

PROPOSALS: Generation/balance owner: src/simulation.js. Stable iteration and explicit invalid-candidate handling are useful test requirements; do not copy the questionable missing-weight path.

## A09: Time and scheduling

Status: partial.

SHOWN: simulation FPS cap and graphics FPS cap are separate defaults (100 and 50); the former can be uncapped by zero according to comments. Autosaves use calendar intervals; species define lifespan, baby/child ages and activity phase. Plants declare seasonal growth inputs. STATED: at season changes a population threshold can trigger removal of unimportant dead units older than two years. This is a stated retention policy, not proof all history survives culling. Native ticks-per-day, queue order, calendar conversion, cooldown dispatch, catch-up and offline progression remain unread. Nothing in this pass supports adding offline aging to YAIRPG.

Sources: `data/init/d_init_default.txt:6-17`; `data/init/d_init_default.txt:119-127`; `data/init/init_default.txt:63-75`; `data/vanilla/vanilla_creatures/objects/creature_standard.txt:213-270`; `data/vanilla/vanilla_plants/objects/plant_standard.txt:5-102`.

PROPOSALS: Time owner: docs/TIME_KEEPERS_AND_VARIANTS.md. Keep simulation time, display cadence and maintenance schedules explicit; inherit the accepted absence policy.

## A10: Onboarding and reveal

Status: partial.

SHOWN: defaults declare embark-warning and remaining-points confirmation settings. STATED: patch notes report tutorial minimize/close behavior, a workshop-click step fix and invalid tiny-world tutorial suppression. Population and visitor comments describe availability and caps but do not establish a complete unlock sequence. Tutorial scripts, ordered lessons, adaptive hints and hidden-information reveal logic are unread in native code; installed graphics are not a played tutorial. No onboarding walkthrough was attempted.

Sources: `data/init/d_init_default.txt:19-27`; `data/init/d_init_default.txt:63-79`; `release notes.txt:734-741`; `release notes.txt:831-832`.

PROPOSALS: UI/first-slice owner: docs/UI_RULES.md. Teach a real available action and suppress impossible targets; keep long-term systems reachable rather than impose universal one-time access.

## A11: Little touches

Status: partial.

SHOWN: music definitions distinguish event triggers from persistent contexts, and some tracks have a shuffled deck of short cards. UNCOMMON frequency has a comment specifying half the other candidates' frequency. Sound definitions bind announcement IDs and savage-area contexts. Names, kin tense, age-aware greetings, dimensions while dragging, optional depth numbers and nickname presentation add specific feedback. Native audio mixing, exact deck exhaustion/reshuffle, accessibility effectiveness and rendered feedback remain unread. OGGs were inventoried but neither decoded nor played. SMALL_TOUCHES.md supplies 24 paraphrased observations and original optional applications.

Sources: `data/vanilla/vanilla_music/objects/music_standard.txt:5-102`; `data/vanilla/vanilla_music/objects/sound_standard.txt:5-81`; `data/init/d_init_default.txt:79-109`; `data/init/d_init_default.txt:137-145`; `data/vanilla/vanilla_text/objects/text_greet_reply_unusual_first.txt:5-11`; `data/vanilla/vanilla_text/objects/text_greet_baby.txt:5-9`.

PROPOSALS: UI/audio owner: docs/UI_RULES.md and docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Distinguish a state ambience from an event cue; visual information must remain sufficient.

## A12: Other systems

Status: partial.

SHOWN: the build also declares physical book media with writing/artifact transfer, reaction provenance and durable tools, institutional offices and succession, language lexemes and grammatical slots, anatomy/tissues/attacks, plants/ecology and generated powers. The prior dossier documented selected connected chains in these areas, not all entries. This pass counts 2,196 WORD declarations, 8,784 T_WORD entries and 3,198 S_WORD links in language-module text, without treating token counts as semantic coverage. Achievement unlock rules, economy-wide sinks, minigames, full history simulation and world-to-world continuity remain unread; no global absence is claimed.

Sources: `data/vanilla/vanilla_reactions/objects/reaction_other.txt:333-437`; `data/vanilla/vanilla_entities/objects/entity_default.txt:425-698`; `data/vanilla/vanilla_languages/objects/language_words.txt:5-55`; `data/vanilla/vanilla_procedural/scripts/generators/interactions/secret.lua:104-160`; `../REPORT.md:DF-C04 through DF-C17`.

PROPOSALS: Crafting/knowledge owner: docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md. Let a physical record keep content identity across binding or treatment. World authoring owner: docs/worlds/ABILITY_AUTHORING.md. Admit only a bounded useful chain; inventory breadth is not authorization for a new universal simulation.
