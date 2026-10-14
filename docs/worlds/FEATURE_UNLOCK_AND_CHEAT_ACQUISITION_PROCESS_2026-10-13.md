# Feature unlocks and cheat acquisition process

2026-10-13. Response to Weibao: “Consider if features could be unlocked as cheats and more? whats the actual process to get cheats and other stuff and more? more to consider?”

Status: design proposal plus current source inspection. No runtime change, browser verification or accepted new policy. This note joins the existing proposals rather than replacing their owners: [earned options and acquisition routes](world-depth-2026-10-13/13_EARNED_OPTIONS_AND_CHEATS.md), [feature placement](world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md), [foundational functions](world-depth-2026-10-13/28_FOUNDATIONAL_FUNCTIONS.md), and [cheat progression](../CHEAT_LIBRARY.md#a-good-progression-loop-for-cheats). Standing direction remains in [USER_VISION](../USER_VISION.md).

## Findings from current source

F1. Panel visibility and mechanical ability are separate. `src/workspace_layout.js` derives discovery from `discovered()` or eligibility, retains it in the session, and derives it again on load. A panel reveal does not itself grant an ability.

F2. Sources can already be earned through content. `src/field_workshop.js` defines introduction and association entry through findings or a supplied brace, lessons, an imprint acquisition and a copying action. This establishes authored acquisition mechanisms, not a universal cheat catalogue or browser-proven journey in this pass.

F3. `src/expansion_engine.js` evaluates visibility, requirements, budgets and duration before commitment. Source effects record acquisition time, receipt, world, revision and origin. The engine returns planned state; its host must persist the whole envelope before publication. `src/capabilities.js` reads contributions and ignores expired or suppressed/inactive/dormant faculties. This can support acquisition, activation and loss without pretending all those authored routes already exist.

F4. Developer cheats are a separate facility: `src/config.js` currently sets `enable_dev_mode: false`; `src/main.js` invokes the developer console only when enabled. That is not an earned in-world acquisition route.

## Proposed placement

| Code | Layer | Example | Acquisition |
|---|---|---|---|
| P1 | Player controls | Save/export, readability, layout, input comfort | Available as controls; no power grind |
| P2 | Ordinary function | Talk, buy, practice, wait | Start circumstances and known opportunities |
| P3 | Useful discovery or earned reach | Crafting panel, known-route map, helpers, workshop batches | First relevant use, learning, property or membership |
| P4 | Exceptional extension | Hidden-property appraisal, remote scouting, instant skill copying, real rewind | World-specific spell, artifact, patron, trait or cheat |

The same feature can span layers. A relationship exists before its panel; conversation is ordinary; a secretary expands reach; reading another person's mind changes what information you can obtain. A feature can be ordinary magic in one world and exceptional in another. Ordinary access and stronger access should each have their own requirements.

## The actual player journey to author

| Code | Stage | What the player does and sees |
|---|---|---|
| J1 | Encounter | Hear a rumor, meet a teacher, find an object, receive an offer, or notice a dormant trait. Show only what this life could know. |
| J2 | Investigate | Examine, ask, experiment or research. Learn at least one actionable lead. Known requirements explain the next obstacle; unknown requirements remain discoveries. |
| J3 | Obtain access | Buy ingredients, earn admission, recover the object, negotiate terms, or satisfy an awakening condition. Access to the means is distinct from usable power. |
| J4 | Activate | Attune, learn and practice, perform the ritual, accept the contract or awaken. Preview known costs, duration, risks and cancellation terms. Resolve and save once. |
| J5 | First useful use | Reveal the relevant control beside an actual task. Give an immediately understandable benefit and show fuel, limits and any known upkeep. |
| J6 | Develop | Repeated use or queued training builds control; research exposes further uses; milestones expand scope or change the power. Mere clicking is not mastery. |
| J7 | Continue or lose | Decide transferability, expiry, confiscation, revocation and cross-world behavior from the source's backing. Preserve learned records separately from live access. |

Not every acquisition needs seven chores. A birth trait can begin active; an ordinary purchased tool may work immediately; a complex ritual warrants a longer route. Direct grants and sandbox selection remain possible forms. The stages identify distinct states, not mandatory padding.

Worked original example: a repair task introduces a workshop teacher. Instruction grants an ordinary movement method. A later opportunity offers an imprint trait; its known terms are shown before acquisition. Watching a demonstrated method allows copying that method, with authored limits. A relevant method control appears, followed by practice and useful work. The source already contains pieces of this example; a unified player journey and its pacing are still proposals needing rebuilt browser proof.

Alternative forms: artifact (find, identify, attune); patron (offer, negotiate, accept); research (question, evidence, experiment, reproducible method); latent trait (notice signs, encounter trigger, learn control). A refusal can open an ordinary alternative rather than strand the player.

## Further considerations

| Code | Consideration | Proposed treatment |
|---|---|---|
| C1 | Acquisition can itself be idle play | Queue study, search or training with a duration and a stopping condition. Distinguish played-time queues from offline progression, which requires separate clock support. |
| C2 | Luck should create opportunity rather than only reward a lucky roll | A rare find can coexist with a longer reliable route such as research, purchase or a negotiated service. Not every power needs every route. |
| C3 | Discover, use, possess, understand and command differ | Borrowing an artifact permits use; ownership controls transfer; knowledge may survive loss; command can unlock deeper functions. |
| C4 | Multiple sources can deliver the same function | A map, scout or divination can reveal routes with different range, accuracy, costs and observers. Show which source supplies the current result. |
| C5 | Partial acquisition and failure need content | Broken items, incomplete techniques and flawed contracts can be useful, repairable or teach something. Show known consequences rather than inventing consolation grants. |
| C6 | Stronger information changes decisions | Separate observation, estimate, prediction and direct revelation. Record confidence and age of information where relevant. |
| C7 | A new panel can overwhelm instead of reward | Reveal the relevant action first; expand details on demand. Desktop/laptop is primary. Mobile optimization is deferred. |
| C8 | Scope matters as much as strength | Mark character, body, object, lineage, world and player-profile scope independently. Do not promise carryover merely because a menu stays visible. |
| C9 | The source can become a goal | Repair, renegotiate, conceal, sell, teach, fuse or pass it on. Losing live power need not erase the story or force replay of prior discoveries. |
| C10 | Sandbox access should be honest | Record chosen access separately from earned history. Reveal no sealed truth outside its discovery route. The open-everything policy remains a proposal. |

## Smallest useful candidate and done check

Recommendation, not a new implementation assignment: finish one connected existing-method acquisition route before adding a global cheat shop or catalogue. Show a lead, costs and requirements, acquisition receipt, relevant control, useful first application and one growth step.

For any selected UI implementation, record the target desktop viewport and visible outcome in its task owner. Rebuild and exercise the route at a fresh origin; check premature access, refusal/cancellation and duplicate reward prevention; save/reload/export/import the acquired state and confirm its useful effect still works. New persisted fields need an explicit compatibility decision. Source inspection in this note proves none of those gameplay gates.
