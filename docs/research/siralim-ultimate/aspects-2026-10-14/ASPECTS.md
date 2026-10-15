# Aspect pass: Siralim Ultimate

2026-10-14. Installed build 20548371; static only. No source game launch or personal saves. All YAIRPG takeaways are PROPOSALS. Source locators are relative to the installed Resources directory unless they name a private extract or dossier file. Full tables and text live privately under `~/.codex/research/mw-siralim/extract/`.

## A01: Dialogue and conversation

Status: partial. SHOWN: tagged localized cells, speaker/scene ID families, substitution tokens and separate choice/result lines. STATED: god menus offer donation, shop and blessings; local clocks offer several actions. No evidence of one universal graph format. Native dialogue flag tests, speaker portraits and relationship-gated dispatch are unread.

Sources: `localization/dialog.csv:269 records`; `localization/dialog_story.csv:892 records`; `localization/overworld.csv:122-185,364-371`.

PROPOSAL: K6/K7/K20/K31; extend P19 using existing Ink host and native typed responses. Preserve full lines privately with IDs; text alone never grants standing.

## A02: Narrative delivery

Status: partial. SHOWN: story dialogue, lore and quest name/description families are separate authoring channels. Quests include 121 empty English cells, so raw row count overstates written narrative. STATED: a random realm quest gates the next expedition; lore and codex explain systems. Full schedule, closure and journal consumers unread.

Sources: `localization/dialog_story.csv`; `localization/lore.csv:1376 records`; `localization/quests.csv:1062 records`; `game.ios ROOM prelude/ending/boss templates`.

PROPOSAL: K11/K12/K16/K23; extend P10/P12/P20 with distinct occurrence, reveal, record and reward state. No canon event graph is inferred from text IDs.

## A03: Implementation architecture

Status: covered. SHOWN: GameMaker FORM archive with no VM CODE chunk and a dual-architecture Mach-O executable retaining compiled GML names. 5785 SCPT records coexist with native bodies. GMLive, Scribble/text and other library names are present; shipping a development helper is not proof of supported player modding. Named database, battle, inventory and serializer families separate concerns. Fifteen selected bodies returned pseudocode across two bounded batches; the save Step target timed out. NATIVE_TRACE records type/boundary limits.

Sources: `game.ios chunk directory`; `extract/nm-arm64.txt`; `extract/function-index.json`; `NATIVE_TRACE.md`.

PROPOSAL: K18/K33/K34; extend P16. Keep definitions, instances, localization and execution evidence distinct; no engine port.

## A04: Save and persistence

Status: partial. SHOWN: save-related string keys include format/version labels, realm properties, hidden properties, fusion, castle, gods, projects, wardrobe and macros. Named serializers exist for creatures, items, quests, projects, decorations and stats. NATIVE_TRACE gives the bounded decoded method evidence. These alone do not prove atomic writes, migration, backup restore, rejection or successful roundtrip. No personal save was read. SHOWN follow-up: save Create conditionally copies files and prepares stepped/asynchronous state; save Step timed out. Crash-safe replacement and recovery remain unproved.

Sources: `game.ios STRG:31617-31754`; `native scr_SaveGame/scr_LoadGame and save_*/load_* names`; `NATIVE_TRACE.md`.

PROPOSAL: K15/K18/K33; extend P05/P16/P24. Persist authored identity and actual carriers; exact old-save compatibility and failed-write recovery need native proof.

## A05: AI and NPC behavior

Status: partial. STATED: optional player-assigned macros evaluate up to 20 ordered condition/action lines and stop on an accepted line. A chosen spell still needs its equipped gem. SHOWN: legality and process methods are separate names. Enemy target weights, lawful player/NPC parity and autonomous local lives are unread. Compiler/text-engine macros are not battle AI and are counted separately in the inventory.

Sources: `localization/codex.csv:155-159`; `native scr_MacroProcess/scr_MacroIsLegal/scr_HandleMacro names`; `native bc_* names`.

PROPOSAL: K6/K10/K26; extend P08 with one bounded supported routine and lawful refusal. Do not infer an idle or offline planner.

## A06: UI and information design

Status: partial. SHOWN/STATED: inspect source labels, filters, comparison identifiers, battle history and travel previews support a huge build space. Conditional detail shares the battle information area. Native draw bodies and a real desktop screenshot were not inspected; no claim about screen density, mouse tooltips or live readability.

Sources: `localization/ui.csv:35-85,422-423,476,606-632,827-841`; `localization/codex.csv:186,189,192`.

PROPOSAL: K11/K14/K30/K34; extend P04/P11. Proposed target 1366x768, adjacent summary/detail/actions, desktop first; mobile deferred.

## A07: Content authoring and modding

Status: partial. SHOWN: stable text tags, notes and language columns in 24 CSVs; compiled Database families for creatures, perks, traits/passives, gems, materials and props. Three shipping Python helpers were detected and not executed. Localization has schema differences such as a misspelled language header in lore. Public mod API, load order and mechanics editor are unread, not established by GMLive presence.

Sources: `Contents/Resources/localization/*.csv`; `native scr_Database* families`; `localization/localization_combiner.py/chunks.py/translated_remover.py file presence`.

PROPOSAL: K1/K20/K33/K34; extend P16/P22 with validation of referenced IDs and text keys before activating content.

## A08: Balance and numbers

Status: partial. STATED: separate depth/instability, source-specific trait stacking, stat floor/diminishing growth and explicit combat action ceilings. Fusion help averages base stats. Startup ordering prose has a numbering conflict. The selected enemy-level body now yields a qualified inferred nonlinear depth curve with difficulty/mode terms (N12). Fusion body preserves specific identity fields (N11). Exact derived stats, rounding helper semantics, event thresholds and economy RNG remain incomplete. Do not substitute community formulas for this installed build.

Sources: `localization/codex.csv:145-147,190-193,205-214`; `native scr_GetEnemyLevelByRealmLevel name`; `NATIVE_TRACE.md`.

PROPOSAL: K2/K3/K9/K10/K34; SU-P04 is a new local extension to P14/P16, with explicit stop policy and retained causal history.

## A09: Time and scheduling

Status: partial. STATED: battle timeline orders turns; event limits are per turn/battle, while effects can be presented sequentially. SHOWN: Step/Alarm-style object events and battle speed/playtime names. Wall-time catch-up, away settlement, calendar and aging were not traced. Decorative clocks are not evidence of a time engine.

Sources: `localization/codex.csv:181,190-193`; `game.ios STRG playtime/settings fields`; `localization/ui.csv battle speed identifiers`.

PROPOSAL: K12/K26/K32; P13 stays separate. Retain YAIRPG explicit frozen-absence policy unless a supported routine is selected; no browser-closed harm.

## A10: Onboarding and reveal

Status: partial. STATED: basic/advanced specialization views, warning text, projects, depth frontier and later systems stage complexity. The installed Otherworld help names depth 30. Tutorial gates and exact progression predicates remain native gaps. Opening role is described as later changeable.

Sources: `localization/ui.csv:836-841,979-1016`; `localization/codex.csv:145,150,195,226-235`; `localization/projects.csv`.

PROPOSAL: K3/K4/K11/K13; extend P03/P04. Reveal when a real function is reachable, keep acquired later alternatives reachable and distinguish disclosure from permission.

## A11: Little touches

Status: covered. 24 individually sourced touches cover truthful blockers, uncertainty, source badges, context-preserving queries, local collecting, home projects and reversible previews. This is bounded coverage of observed text, not live animation or accessibility testing.

Sources: `SMALL_TOUCHES.md:ST01-ST24`; `localization/overworld.csv:364-405`; `localization/ui.csv:35-85,606-632`.

PROPOSAL: K9/K11/K14/K19/K25/K27; route small touches to existing consumers and prove their useful effects separately.

## A12: Other systems

Status: partial. SHOWN/STATED: castle decoration, utility NPCs, crafting, collections, relics, guilds, bounties, ascension, projects, side-room minigames and multiple currencies. Localization counts are size signals only. Full minigame rules, money flows, collection bonuses and mastery retention are unread.

Sources: `localization/codex.csv:168-171,197-198,220-235`; `localization/cards.csv/projects.csv/achievements.csv`; `game.ios ROOM Nether templates`.

PROPOSAL: K7/K8/K9/K13/K16/K25; extend P02/P07/P12/P18 with one useful home or institution loop, not the entire source economy.
