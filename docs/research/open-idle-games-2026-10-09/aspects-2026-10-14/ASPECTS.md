# open-idle-games-2026-10-09: aspect backfill, 2026-10-14

## Corrections

Original Idle Loops repository HEAD is now 3e004b993e8d82d718945a2a4b5a17de8c0fabff, replacing the prior d41bf197 pin for this fresh pass. Repository drift alone does not show that the active idleLoops game changed. Other six heads match. No inspected behavior contradicted the prior bounded career/reset/offline comparison. Extend dialogue coverage: Idle Loops action stories use condition/number records, not a conversation tree. Quest ui_dialogs is a general UI helper, not NPC dialogue.

Static reads only. **Shown** means inspected executable code/data; **stated** means page or declaration; **inferred** means the proposed YAIR interpretation. Covered means the bounded aspect question has source support, not that every record was read. Partial/unread limits stay explicit. Sources are pinned in [TOOLING](TOOLING.md); complete acquired files and raw text remain under `/Users/weiwei/.codex/research/bf-idle-src`. No code/assets/text are copied into YAIR.

## A01 Dialogue and conversation

Status: partial.

Shown: dmchurch Action.getStoryTexts parses numbered XML stories with condition text into structured records. Original Progress Knight uses task descriptions and notifications; no NPC reply graph found in inspected files. Evolve uses event/message flavor. Whole XML corpus, every fork and late event choice remains partial.

Sources: [actionList.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/actionList.js); [lang](https://github.com/dmchurch/omsi-loops/tree/fe4a349efb799a56ab548018caca1a1a1aea0c8f/lang); [main.js](https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js); [events.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/events.js)

PROPOSAL: Store narrative availability and reading separately from completed work. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A02 Narrative delivery

Status: covered.

Shown: Idle Loops story flags/vars survive through save initialization; action story text is localized rather than embedded in its save. Evolve has retained message queues and triggered events. Progress Knight presents career/age milestones. No personal companion life graph established.

Sources: [actionList.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/actionList.js); [saving.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/saving.js); [events.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/events.js); [functions.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js)

PROPOSAL: Retain compact story IDs and facts, with known text reconstructed from its versioned source. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A03 Implementation architecture

Status: covered.

Shown: original PK is class/registry logic in a monolithic JS update loop; Quest splits main/UI/save modules. Idle Loops separates actions, driver, saving, localization and views; dmchurch adds predictor/editor/worker modules. Evolve is ES modules plus browser UI and worker handling. Seven repositories are separate snapshots, not one merged engine.

Sources: [main.js](https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js); [main.js](https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/main.js); [driver.js](https://github.com/StopSign/stopsign.github.io/blob/3e004b993e8d82d718945a2a4b5a17de8c0fabff/idleLoops/driver.js); [driver.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/driver.js); [index.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/index.js)

PROPOSAL: Use the incumbent finite work-plan interface rather than importing a fork architecture. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A04 Save and persistence

Status: covered.

Shown: PK original saves JSON gameData to localStorage and exports base64; storage writes/import are lightly guarded. Quest omits requirement definitions, saves completed IDs and timestamp, reconstructs definitions/prototypes and catches corrupt load. Its legacy requirement migration has shape-dependent branches, not a proven universal migration. Loops saves learned/story/plan state then rebuilds a run. Evolve uses UTF16 LZ local data/base64 exports and version/shape repairs. All roundtrips unrun.

Sources: [main.js](https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js); [main.js](https://github.com/Symb1/progress_knight_2/blob/5b6b059b1f5ad645837e504bde1d455995d05514/js/main.js); [saveman.js](https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/saveman.js); [saving.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/saving.js); [vars.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/vars.js); [functions.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js)

PROPOSAL: Save stable completion IDs and rejoin current definitions without copying authored content. Owner: src/save_files.js; src/save_compatibility.js.

## A05 AI and NPC behavior

Status: partial.

Shown: chosen/concurrent task controllers, action plans and population job counters. These are not individual daily lives or utility-planning NPCs. Evolve late faction/government policies and all social actions remain unread.

Sources: [main.js](https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js); [actionList.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/actionList.js); [jobs.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/jobs.js)

PROPOSAL: Keep worker quantities distinct from the state of named people. Owner: src/npc_lives.js; world CAMPAIGN.md.

## A06 UI and information design

Status: covered.

Shown: task progress tables; editable current/next plans; hotkey/predictor surfaces; dense civilization tabs. Prediction is a display/controller surface and is not authoritative earned output. Layout/accessibility unrun.

Sources: [ui.js](https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/ui.js); [hotkeys.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/hotkeys.js); [predictor.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/predictor.js); [index.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/index.js)

PROPOSAL: At 1440x900, display current execution beside the next editable plan and mark projections. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07 Content authoring and modding

Status: partial.

Shown: code-defined actions and localized story XML; dmchurch has an editor/schema surface. Evolve tech/action registries mix costs/predicates/effects; PK uses Task/Item definitions and reconstructed requirements. No universal cross-fork mod API or load order established.

Sources: [actionList.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/actionList.js); [lang](https://github.com/dmchurch/omsi-loops/tree/fe4a349efb799a56ab548018caca1a1a1aea0c8f/lang); [schema.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/schema.js); [actions.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/actions.js); [saveman.js](https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/saveman.js)

PROPOSAL: Validate action IDs, localized text keys and prerequisites before content enters a campaign. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A08 Balance and numbers

Status: partial.

Shown: PK max-level carry changes training; Loops distinguishes temporary raw stats from talents/skills; Evolve traits modify an economy. All endgame curves, RNG and challenge combinations are not read.

Sources: [main.js](https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js); [stats.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/stats.js); [vars.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/vars.js); [races.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/races.js)

PROPOSAL: Expose which retained skill changes a work rate without collapsing all advancement into one tier. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A09 Time and scheduling

Status: covered.

Shown: original PK only advances its running timer; Quest replays elapsed ticks with a cap and age/death boundaries as prior dossier describes. Original Loops banks elapsed time at an offlineRatio of .8; other forks and Evolve have separate acceleration policies. No common offline-aging policy follows.

Sources: [main.js](https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/main.js); [saving.js](https://github.com/StopSign/stopsign.github.io/blob/3e004b993e8d82d718945a2a4b5a17de8c0fabff/idleLoops/saving.js); [saving.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/saving.js); [main.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/main.js)

PROPOSAL: Declare action time, lifespan time and banked acceleration separately. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A10 Onboarding and reveal

Status: covered.

Shown: task requirements, action visible/unlocked predicates and tech prereqs stage complexity. Named information may become visible before execution is affordable. Every fork reveal predicate remains partial.

Sources: [main.js](https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js); [actionList.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/actionList.js); [actions.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/actions.js)

PROPOSAL: Separate seen, learned, equipped and affordable states in a local work row. Owner: src/native_discovery_policy.js; src/observation_channels.js.

## A11 Little touches

Status: covered.

Shown: keyboard plan controls, predicted results, task bars, save export and message queues. Actual focus behavior, cancellation and predictor accuracy are unrun.

Sources: [hotkeys.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/hotkeys.js); [predictor.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/predictor.js); [ui.js](https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/ui.js); [functions.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/functions.js)

PROPOSAL: Make planned versus actual results explicit and retain a keyboard route to routine controls. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A12 Other systems

Status: partial.

Shown inventory: careers/rebirth, housing/items, loop challenges, dungeons/town reputation, Evolve species/traits/space/interstellar/portal/eden economies and reset routes. Their extra layers remain references, not selected YAIR milestone gates. Most full catalogues unread.

Sources: [resets.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/resets.js); [achieve.js](https://github.com/pmotschmann/Evolve/blob/3436358dcd03d9f9e071d51ea071e0a78c0322e4/src/achieve.js); [prestige.js](https://github.com/dmchurch/omsi-loops/blob/fe4a349efb799a56ab548018caca1a1a1aea0c8f/prestige.js); [js](https://github.com/indomit/progress_knight_2/tree/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js)

PROPOSAL: Keep optional mature paths reachable while selecting only one playable local slice. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## Remaining scope

All seven acquired repository families are represented, but complete story XML/late traits/challenges/ending combinations, predictor correctness and legacy migration joins remain unread. Other unrelated games in StopSign monorepo are outside the prior grouped roster. No install needed.

All proposals use the existing actor/stock/job/clock/knowledge/save owners. Preserve reasonable alternative paths, repeatable solo play, one realm/one prestige first milestone and canon-specific rules. UI target for future packets is 1440x900 laptop; mobile optimization deferred. No source/build/runtime/save/human acceptance gate is claimed passed.
