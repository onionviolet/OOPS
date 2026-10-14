# Hearts of Iron IV: twelve aspects

2026-10-14. Lane `asp-hoi4`. Source research only. SHOWN means inspected bytes or measured declarations; STATED means shipped documentation/comments; INFERRED means interpretation. Every YAIRPG takeaway is a PROPOSAL. No native game, UI, save restoration or YAIRPG implementation was exercised.

Installed root: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Hearts of Iron IV`. Source paths below are relative to it. Prior dossier reports Steam build 25205862; this pass separately checks manifest/build and hashes in TOOLING. Definitions include inactive, debug and DLC-gated content, not proof of ownership or reachability.

Full raw reference: `/Users/weiwei/.codex/research/asp-hoi4/extract/`. `raw/` retains 5,644 selected text files, including all captured English text, conditions, events, GUI definitions, rules and author docs. `english_localisation.jsonl` retains 129,197 unique parsed keys with full text and source lines; `events-index.jsonl` retains 6,974 event bodies, repeated options and conditions. This directory is outside git. No source prose is copied into these public reports.

## A01: Dialogue and conversation

Status: covered.

SHOWN: event IDs join title/description/option localization keys to triggers and effects. The pact offer germany.11 has acceptance/refusal options and dispatches distinct responses germany.12/germany.13 to the initiating actor. A reply changes relations, flags, ideas or political power; the text itself is presentation. The narrator is often the state or a report, rather than a named person speaking in alternating lines. EventWindow_Operative has leader image, full name and codename fields; the general event window has title, description, picture and options grid. Character portrait assets are separate from line conditions. There is no generic relationship-gated small-talk or conversation-graph subsystem established by these samples; country opinion, government and flags can gate authored responses.

SHOWN: 6,974 event definitions and 11,547 direct options confirm the prior declaration census. 1,537 defined_text blocks contain 30,401 text branches. These are localization branches, not 30,401 conversations. Several old selectors are explicitly commented unused. The private English index has 129,197 parsed rows, including UI and rules prose, not just dialogue. STATED: scripted localization predicates run in the caller's scope; country and character localization objects supply names. INFERRED: event exchange is a graph of scoped messages and effects, not proof of an NPC's independent daily life. No live speech, voice-bark or personal relationship coverage claim.

Sources: `events/Germany.txt:234-510`; `localisation/english/events_l_english.yml:14-24`; `interface/eventwindow.gui`; `common/scripted_localisation/00_scripted_localisation.txt`; `documentation/loc_objects_documentation.md`.

PROPOSAL: Keep speaker/source, recipient, observation time and committed response separate from displayed text. Owner: docs/CHARACTERS_AND_WORLD_EVENTS.md; existing storylet/simulation consumers.

PROPOSAL: Choose context-sensitive flavor from known facts, with a safe fallback. Never expose hidden world truth through names or tooltips. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md and world knowledge owners.

## A02: Narrative delivery

Status: covered.

SHOWN: national-focus rewards dispatch events; explicit delayed messages, news events, decisions/missions and lifecycle hooks deliver different story scales. The prior traced pact path is confirmed against the installed event and localization bytes. Options retain aftermath in flags, opinions and ideas. Operation phases carry name, description and outcome keys, so a final report can compose a route and result. STATED: operation phase outcome_extra may be used for all phases after a risky result, with normal outcome fallback. INFERRED: a story can be told through an altered service or institution as well as a modal window. A complete chronological journal or durable archive of every dismissed event was not established.

Sources: `events/Germany.txt`; `common/national_focus/germany.txt`; `common/decisions/GER.txt`; `common/on_actions/00_on_actions.txt`; `common/operation_phases/lar_infiltration.txt`.

PROPOSAL: Retain causal aftermath and known reports so a closed popup is not the only evidence. Owner: docs/CHARACTERS_AND_WORLD_EVENTS.md.

## A03: Implementation architecture

Status: partial.

SHOWN: the installed native executable is x86_64 Mach-O. Clausewitz branch/revision marker files, nested text rule families, Lua scripts, GUI layouts, localization and generated scripting reference docs coexist. It is not a Lua-only game. autoexec.lua loads defines, tweaks and diplomacy modules after native exports, according to its comment; ai_diplomacy.lua exposes an example native-action callback. This is evidence of a binding surface, not that that example drives every diplomatic decision.

SHOWN: static binary strings retain CGameState, CGameStateLoadThreaded/CGameStateSaveThreaded, DoCountryHourlyUpdates and TBB parallel-work type names. These establish names and compiled artifacts, not function bodies, ordering, thread safety or performance. Native serializer, interpreter, event evaluator and combat internals remain unread. STATED: decision prefilter/update cadence and scripted GUI dirty variables reduce needless scans. Tests define calendar-bounded trigger success/failure and acceptable failure rates. None were executed.

Sources: `hoi4.app/Contents/MacOS/hoi4`; `script/autoexec.lua`; `script/ai_diplomacy.lua`; `common/defines/00_defines.lua`; `common/scripted_guis/_documentation.md`; `tests/_documentation.info`.

PROPOSAL: Separate authored rules, legal commands, state transitions and pure projections; reuse existing owners instead of adding a universal scripting VM. Owner: docs/ENGINE_EXPANSION.md.

PROPOSAL: Cache UI projections by real dependency revision; recheck legality on commit. Owner: docs/ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md.

## A04: Save and persistence

Status: partial.

SHOWN: NGame declares SAVE_VERSION=33 and MINOR_SAVE_VERSION=0; the comment associates major version with 1.17.0 and minor versions with backward compatibility. This is a declared policy, not a demonstrated migration. Settings layout includes autosave interval and cloud controls. Binary strings include save_version, minor_save_version, save_as_binary, autosave rotation names and specific invalid-reference diagnostics. Strings do not prove all fields are serialized, that backups are atomic, or which corruption is fatal versus skipped.

SHOWN in the read-only pinned third-party parser: HOI4txt/HOI4bin are distinct seven-byte headers; unknown header is an error; binary parsing requires a token resolver. Models deserialize only player/date/countries and country stability/war_support/variables. tests/parse.rs has both 1.10 samples and a 1.17-new-ironman-format fixture test. This corrects the older dossier's fixture-coverage description. Binary tests return success without parsing when tokens are absent, so an aggregate green test run could overstate binary proof. No parser build/test was run. The parser's public text-fixture CDN returned 403; route switched to shipped version declarations and local parser/source diagnostics, without retries or personal-save access. Exact current pending-event, queue, design, RNG, migration, autosave/failure and missing-mod restore behavior stays unread. Offline progress is not established.

Sources: `common/defines/00_defines.lua:3-8`; `interface/settings.gui:1059-1115`; `documentation/console_commands_documentation.md`; `hoi4.app/Contents/MacOS/hoi4`; `https://github.com/rakaly/hoi4save/tree/a3f1e65ec2da113652152a00aa32631182bbc03f`.

PROPOSAL: Save active commitments, chosen outcomes, reservations and content/schema identity as one durable transition; distinguish unsupported content from corrupt bytes. Owner: docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md and src/save_files.js.

PROPOSAL: Tests that skip missing token/fixture cases must report that gap explicitly. Owner: existing save compatibility and persistence tests.

## A05: AI and NPC behavior

Status: partial.

SHOWN: country plans have admission, enable and abort conditions; actions carry ai_will_do or ai_chance preferences. STATED: an operation planning weight below OPERATION_AI_MINIMUM_SCORE cancels planning. Scripted GUIs expose AI eligibility, interval/variance, target narrowing and button-action budgets. Naval docs distinguish goals and concrete objectives. This is richer than a single priority list. INFERRED: plans sit above actions. Exact native tactical search, fairness of hidden knowledge and equality of player/AI legality are unverified. Country agents are not personal NPC schedules.

Sources: `common/ai_strategy_plans/GER_historical_strategy_plan.txt`; `common/ai_strategy/GER_operation_strats.txt`; `common/operations/_documentation.md`; `common/scripted_guis/_documentation.md`; `common/ai_navy/_documentation.md`.

PROPOSAL: Abort stale plans and choose another legal action against actual target IDs. Keep knowledge-qualified inputs and finite means. Owner: docs/CHARACTERS_AND_WORLD_EVENTS.md; Province War AI01 via ../PROVINCE_WAR_FIT.md.

## A06: UI and information design

Status: partial.

SHOWN layouts define specialized production, logistics, research, politics, intelligence and map interfaces. National-focus layout has search, RETURN, PAGE_UP/PAGE_DOWN zoom shortcuts, drag scrolling, ESCAPE close, tooltips and shortcuts grid. Event windows separate description, picture, minimize and options. GUI definitions encode size and position, but static files alone cannot establish simultaneous readable screen density, actual accessibility or clipping. STATED: scripted panels attach to existing screen contexts and may populate dynamic arrays. No game launch, screenshot or native interaction. Desktop adaptation proposal targets 1366x768, with current job, cost and result visible beside action. Mobile optimization deferred.

Sources: `interface/nationalfocusview.gui`; `interface/eventwindow.gui`; `interface/countryproductionlineview.gui`; `interface/topbar.gui`; `common/scripted_guis/_documentation.md`.

PROPOSAL: Use side-by-side known state and action context in the existing desktop workspace, with search for large collections. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07: Content authoring and modding

Status: covered.

SHOWN: text databases split effects/triggers, events, conditions, AI preferences, layout and localization, joined by IDs and scope rules. Repeated keys and bare lists mean a JSON dictionary conversion would lose meaning. Shipped author docs describe scripted GUI extension, dynamic lists and button effects. Country test bundles specify last date, success/fail predicates, run counts, failure saves and loggers. STATED: project complexity=0 logs an error and uses a default. Current mod load precedence, override merging and launcher dependency handling were not verified; this aspect covers authoring and exposed extension surfaces, not a complete mod-loader contract.

Sources: `common/decisions/_documentation.md`; `common/scripted_guis/_documentation.md`; `common/special_projects/projects/documentation.md`; `documentation/effects_documentation.md`; `tests/_documentation.info`.

PROPOSAL: Validate IDs, scoped references and effect/text agreement during content authoring, then test a real connected route. Owner: docs/GENERATION_FOUNDATION_RULES_2026-10-14.md and existing pack validation.

## A08: Balance and numbers

Status: partial.

SHOWN: constants, resource requirements, project complexity, weighted options, ai weights and time costs live in data. Generic land prototype rewards apply a 0.25 weight factor to a theme already marked by a project flag. This is repeat-theme suppression, not a guaranteed pity threshold. Reward options can change progress and scientist learning. STATED: script math docs warn some approximations need rounding. The prototype-reward doc contradicts its interval notation: its written example includes min and excludes max, while the displayed mathematical notation suggests the reverse. Boundary semantics need native evidence. Operation documentation and content also use differing apparent probability scales; do not normalize every chance field by assumption. Exact RNG seed persistence, MTTH hazard, aggregation and native production curves remain unverified.

Sources: `common/defines/00_defines.lua`; `common/special_projects/prototype_rewards/generic_land_prototype_rewards.txt`; `common/special_projects/prototype_rewards/documentation.md`; `documentation/script_math_functions.md`; `common/operations/00_operations.txt`.

PROPOSAL: Prevent repeated flavor themes from drowning out alternatives without guaranteeing a reward or imposing a solo lifetime limit. Owner: docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md.

PROPOSAL: Give each chance field units and boundary semantics; test min/max instead of trusting comments. Owner: rule and generation validation owners.

## A09: Time and scheduling

Status: partial.

SHOWN: campaign start/end timestamps and five speed values are declared. Native binary names include country-hourly updates. Events dispatch after days; timed missions use deadlines; hooks include time pulses. STATED: EVENT_PROCESS_OFFSET=20 spreads event checks by country/state, operation phase validity is checked weekly before reseeding invalid planned phases, and special-project cancellation retains initial/prototype progress differently from establishment. These clocks should not be collapsed into one UI tick. Offline wall-clock catch-up, exact tick order, multiplayer determinism and scheduler implementation remain unread.

Sources: `common/defines/00_defines.lua:3-30`; `common/on_actions/_documentation.md`; `common/decisions/_documentation.md`; `common/operation_phases/_documentation.md`; `common/special_projects/projects/documentation.md`.

PROPOSAL: Declare a clock and restart/cancel policy per work phase, preserving learned progress separately from setup. Owner: docs/TIME_KEEPERS_AND_VARIANTS.md and docs/ENGINE_EXPANSION.md.

## A10: Onboarding and reveal

Status: covered.

SHOWN: tutorial.txt has 15 tutorial blocks and 30 hint blocks. Objectives map UI textboxes to actual actions such as assigning production, focus, divisions and research, then camera/unit/frontline/air/peace steps. Hints bind to windows, visible objects, alerts and XP conditions, with links to related hints. A source comment explicitly says the annex objective actually tests no longer being at war; labels can diverge from predicates. SHOWN author docs distinguish admission, visible and available gates; a hidden project differs from a disabled one. Tutorial declarations are not proof that the sequence works on this installed build.

Sources: `tutorial/tutorial.txt`; `interface/tutorialscreen.gui`; `common/special_projects/projects/documentation.md`; `common/decisions/_documentation.md`.

PROPOSAL: Teach a useful existing action where it occurs, then show its observed consequence. Test the predicate rather than the objective label. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md and current world opening owners.

## A11: Little touches

Status: covered.

SHOWN: minimize for event windows, search/zoom/drag navigation for large trees, distinct operative identity presentation, contextual hint links, shared formatted effect text and country-specific naming hooks. STATED: alert sounds have a 14-day cooldown; the music player retains ten recently played tracks to reduce repeats; ordinary versus informational messages have different timeouts. These are source settings, not listened-to audio or accessibility acceptance. Twenty-eight transferable details and their owners are recorded in SMALL_TOUCHES.md.

Sources: `interface/nationalfocusview.gui`; `interface/eventwindow.gui`; `common/defines/00_defines.lua:16-30`; `tutorial/tutorial.txt`; `documentation/loc_formatter_documentation.md`.

PROPOSAL: Preserve actionable notices while suppressing repeated noise, and reuse effect projections in summaries and tooltips. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A12: Other systems

Status: partial.

SHOWN: the installed corpus includes special projects, operations/phases, industrial organizations, faction goals/upgrades, raids, peace-conference rules, occupation/resistance/compliance, medals, ribbons, achievements, profile cosmetics and collections in addition to prior focus/production/research/doctrine findings. SYSTEM_INVENTORY.md inventories every common rule folder/file family and nested authored category, with size signals and prior coverage labels. DEEPER_SYSTEMS.md reads special projects, operations and scripted UI/text in detail. Remaining families are inventoried, not exhaustively semantically decoded. Collections and profile files do not prove account persistence or cross-run gameplay progression.

Sources: `common/special_projects`; `common/operations`; `common/military_industrial_organization`; `common/factions`; `common/peace_conference`; `common/raids`; `common/occupation_laws`; `common/achievements.txt`; `common/collections`.

PROPOSAL: Prefer local institutions, concrete work and retained consequences over importing a whole state-war simulation. Owners: docs/CHARACTERS_AND_WORLD_EVENTS.md, docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md; Province War packet fit remains a separate consumer.
