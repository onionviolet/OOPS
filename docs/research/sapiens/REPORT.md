# Sapiens feature scout, 2026-10-14

## Feature answers

“Shown” below means shown in installed source, not observed in a running game. Source paths are relative to `GameResources/`; frozen copies and hashes are in [TOOLING.md](TOOLING.md).

| Code / question | Answer | Evidence | Basis | Packet and YAIRPG takeaway |
|---|---|---|---|---|
| F1 / RT: object investigation | A research plan maps branch to fire, hay to thatch and rock variants to knapping. Eligible action time adds tribe progress until complete; dependencies, tools, materials and sometimes a finished constructable are needed. Tribe knowledge is saved independently of the investigator. This is cumulative practical discovery, not uncertainty/revision. | `common/research.lua:130–180`, `common/planHelper.lua:339`, `server/serverSapienSkills.lua:getIncrement`, `server/serverWorld.lua:1344,1534,1651`, `server/sapienAI/activeOrderAI.lua:1295` | Shown | RT: require a real experiment/result; do not invent a hypothesis ledger from this donor. |
| F2 / P03: learning and roles | Doing work gains the actor's skill; finishing research grants skill and other active discoverers get randomized partial/full skill. Tribe `discoveries`, personal `skillState` and role `skillPriorities` stay separate. No teacher-to-learner route was found; `taughtSkillTypeIndex` is action learning. | `common/skillLearning.lua`, `common/skill.lua:278–371`, `server/serverSapienSkills.lua:addToSkill`, `server/serverWorld.lua:1556`, whole-Lua teaching search | Shown for work; inferred negative for teaching | P03: use it for practice, not as evidence for manuals or teachers. Preserve YAIRPG's existing instruction routes. |
| F3 / P04: know / allowed / equipped / now | Discovered skills/recipes gate plans; role priority and body ability permit workers; storage owner/alliance/local overrides permit stock use; required resources/tools/facility and live distance, light, path and order capacity determine feasibility. A valid plan still needs a worker to take it. | `common/planHelper.lua:339,2094`, `common/skill.lua:355`, `server/serverSapienSkills.lua:updateTribeAllowedTaskLists`, `server/planManager.lua:182,746`, `server/serverResourceManager.lua` | Shown; whole-now distinction inferred from consumers | P04: project independent known, permitted, held and ready states from current admission. |
| F4 / CH: processing stages | Drying evolves item type on world-time callbacks: grass 120, flax/wet vessels 240 base units, covered duration x4. Stored items keep degradation fraction/reference time. Firing/cooking/threshing run active worker sequences with inputs, role, skill and facility, not passive drying timers. Wheat plus urn becomes a filled urn; grinding and dough preserve/return the container type. | `common/evolvingObject.lua:64`, `server/serverEvolvingObject.lua:27,169`, `common/craftable.lua:50,135,2470,2751,2973,3088,3154`, `server/sapienAI/activeOrderAI.lua:642,743,781` | Shown | CH: distinguish passive item change from staffed work and keep intermediates usable. |
| F5 / P01: why nobody works | Plans retain typed missing tools/resources/storage/craft area/role and light/path/distance flags. UI formats concrete input counts, tool examples, kiln/campfire and task-assignment reasons. `missingSkill` means no allowed worker, not necessarily no skilled worker. Actor status alone reports idle/resting/action; universal “why nobody” and last-output receipt are not proved. | `server/planManager.lua:182,746,1135`, `mainThread/ui/hubUIUtilities.lua:202–325`, `mainThread/orderStatus.lua:getStatusText` | Shown; coverage limit stated | P01: make blocker projection share the evaluator; keep truthful receipt work as a separate requirement. |

Sapiens is installed as a macOS app, Steam build **19991669**, with **481 plain Lua files** totaling 8,066,276 bytes. The earlier Windows-only and not-installed guesses were wrong. This pass reads source only: no launch, injector, save inspection or native engine work. All five assigned questions have source answers. Broad aspects remain PARTIAL with named gaps.

[Private deep reference](private/fs-sapiens/README.md) holds full selected modules, English text and vocal IDs/conditions, 35 research and 77 craft registration bodies with line anchors, hashes and decoded flows. These counts are source registration calls, including deprecated registrations, not executed content counts. All Lua remains in the lane work area's hashed extract. Public analysis paraphrases the donor.

## Ranked PROPOSALS

### S-P1: Project typed blockers beside current work

**PROPOSAL, adapt.** Informs P01; evidence F5. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`. Current seam: `src/feature_expansion_work_plan.js:workPlanView; src/action_legibility.js:projectKnownActionRequirements`. Cost: Low, if projection only.

### S-P2: Show knowledge, permission, held means and present use separately

**PROPOSAL, adapt.** Informs P04 / P03; evidence F2/F3. Owner: `docs/TECHNOLOGY_AND_PROGRESSION.md`. Current seam: `src/techniques.js:techniqueFacts; src/simulation.js:previewSimulationCommand`. Cost: Low to medium, retain current actor owners.

### S-P3: One dry-to-kit lot preserves progress across storage changes

**PROPOSAL, trial.** Informs CH; evidence F4. Owner: `docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`. Current seam: `Existing T4 dry-to-kit proposal and job/stock owners`. Cost: Medium, interruption and persistence proof required.

### S-P4: One investigation must reach a useful product before confirming knowledge

**PROPOSAL, trial.** Informs RT; evidence F1. Owner: `docs/RESEARCH_CULTIVATION_PATHS.md`. Current seam: `Existing technique observation/understanding/practice and paid trial records`. Cost: Medium, evidence provenance and a native useful application.

### S-P5: Support paid practice without equating assigned role to mastery

**PROPOSAL, adapt.** Informs P03; evidence F2/F3. Owner: `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md`. Current seam: `src/audited_workshop_lesson.js; src/techniques.js`. Cost: Medium, teacher and self-study routes retain different costs.

### S-P6: Return and reuse the same empty container through processing

**PROPOSAL, park.** Informs CH / P02; evidence F4. Owner: `docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`. Current seam: `Current held input, stock and custody receipts`. Cost: Medium, container identity/conservation before more recipes.

S-P1 comes first because the existing work-plan and disclosed-requirement projections already carry useful reasons. S-P2 makes those states readable without another skill engine. S-P3 follows the live chain owner's narrowed dry-to-kit direction; matching, a second procedural law, offline catch-up and broader production remain reachable later. Do not import Sapiens's six-role cap, compulsory food pressure, fixed research phase rates or injury tuning into YAIRPG.

These are proposals for their live owners, not accepted decisions or implementation authorization. At 1366x768 show the current job, learned state, held means, blocker and supported next control together; mobile optimization remains deferred. No owner outside this folder was edited.

## Prior findings: confirm, correct, extend

| Code | Prior claim | Result | Evidence |
|---|---|---|---|
| C1 | Feature scout row 6 guessed Windows only, requiring notproton. | Correct: installed macOS `.app` with Lua payload; no compatibility tool needed for this read. | Installed bundle path and app manifest build ID. |
| C2 | Feature scout said none of its candidates installed. | Correct for this later snapshot: Sapiens now has 481 Lua payload files. | Hashed payload inventory; not merely StateFlags. |
| C3 | Object investigation and assigned-work learning. | Confirm and extend: tribe research, individual learning and allowed roles have separate fields/consumers; concurrent investigators can gain skill. | F1–F3. |
| C4 | P03 teacher/manual routes. | No donor confirmation: action learning found; interpersonal teaching/manual-loss semantics not shown. Existing YAIRPG lesson is incumbent. | `skillLearning`, `social`, AI consumers and teaching search. |
| C5 | Round 5 narrowed T4 to dry-to-kit. | Preserve: donor supports distinct intermediates and passive/active stages, not a reason to require matching or full distillation. | F4 and chain round 5 FC3/FC4/FC6. |

## Limits and useful next evidence

The donor has a binary completed discovery, not an evidence confidence model. Some research needs a final product, which is the useful RT pattern here. Plan permission does not prove mastery; the UI's assignment wording is more accurate than its internal `missingSkill` name. Multi-worker availability does not explain every individual need/path decision, and the source does not prove a work receipt.

Source quirks to keep out of an adaptation: duplicate shallow-water blocker text; creation of a discovery progress record lacks the existing-record threshold check; elapsed cover change and overshoot treatment differ between loose and stored evolution. These are candidate boundary checks, not observed game bugs. Full decoded caveats are private.

Native save byte format/atomicity, offline time, interruption/reload behavior, and actual UI/readability remain unverified. No runtime acceptance is requested by this research lane. [CHECKPOINT.md](CHECKPOINT.md) and [aspect gaps](aspects-2026-10-14/ASPECTS.md) name unread areas.
