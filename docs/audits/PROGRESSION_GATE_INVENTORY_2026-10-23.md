# Progression gate inventory, 2026-10-23

Read-only sweep of `src/` against [PROGRESSION_GATE_RULES.md](../PROGRESSION_GATE_RULES.md) (GTR3 kinds, GTR9 to GTR12). No source edited. Line numbers were checked with grep and short `sed` reads on 2026-10-23, so they can drift if other sessions edit `src/` today.

## 1. Method

I grepped `src/` (excluding `dist/`, `node_modules`, and `src/data/srd*` JSON) for the terms `evaluateRule`, `check_contract`, `native_unlock`, `is_unlocked`, `isUnlocked`, `unlock`, `requires`, `prereq`, `gate`, `blocked`, `canBeStarted`, `canBeDisplayed`, `canGainXP`, `max_level`, `xp_gains_cap`, `process_conditions`, and `Requires `. Files hit per term: `evaluateRule` 10 (30 hits), `check_contract` 4 (4), `native_unlock` 1 (1), `is_unlocked` 33 (529), `isUnlocked` 14 (78), `prereq` 19 (66), `requires` 252 (1799, mostly data descriptions and noise, not a usable count). I read about 10 lines around each candidate, mainly the evaluators (`rules.js`, `conditions.js`, `availability_component.js`, `native_unlock_transaction.js`, `check_contract.js`, `capabilities.js`, `expansion_engine.js`, `skill_discovery.js`), the `main.js` gate sites, and sampled data files (`data/locations.js`, `data/dialogues.js`, `quests.js`, `feature_expansion_*`, `book_world_*`). Not covered: a full read of the 40-plus `feature_expansion_*` and `book_world_*` gate bodies, `src/data/srd*`, `world_packs/`, `absorb_d/`, the `dialogues.js` and `locations.js` gate bodies beyond the samples, and the UI rendering of each reason string. Rows marked "inferred" come from naming or from one sampled instance, not from reading the full path.

## 2. Evaluator summary

| Evaluator | Gates (approx, sampled) | Example file:line |
|---|---|---|
| `evaluateRule` (`src/rules.js`) | ~12 call sites, 30 hits | `src/expansion_engine.js:480-481`, `src/capabilities.js:47`, `src/field_works_projection.js:14`, `src/simulation_contracts.js:36` |
| `check_contract` `requires` | 1 evaluator, consumed by check resolver and odds | `src/check_contract.js:91` |
| `native_unlock_transaction` | 1 (opening transaction, GTR12) | `src/main.js:1834`, `src/native_unlock_transaction.js:38` |
| Ad hoc boolean or availability check | ~25 sites: `process_conditions` via `canBeStarted`/`canBeDisplayed`, `is_unlocked===true` reads, `canGainXP`, `isUnlocked()` | `src/components/availability_component.js:54,62`, `src/main.js:835,1315,1616,1726`, `src/main.js:670` |
| Other: caps, reason strings, silent filters | ~15 sites | `src/models/skill.js:192`, `src/main.js:843`, `src/skill_discovery.js:64`, `src/crafting_frontier_runtime.js:80` |

Two evaluators run in parallel for the same kind of question: `conditions.js` `process_conditions` (legacy availability conditions, returns a number, no reason text) and `rules.js` `evaluateRule` (new content, reasons). GTR9 says the old one stays until touched, so this is expected, not a bug.

## 3. Main table

Persistence: "flag" means a saved availability or global flag written by a transaction. "recomputed" means evaluated each time from current state. "unknown" means not traced.

| file:line | what waits | GTR3 kind | evaluator | persistence | shows reason? | notes |
|---|---|---|---|---|---|---|
| `src/components/availability_component.js:62` | start of any location, activity, skill XP gain or item (`canBeStarted`) | mixed (capacity, maturation, resource) | `process_conditions` (`conditions.js:83`) | recomputed; `is_unlocked` is flag | no | returns boolean only. `display.js:2366,2379,2516,2733,2870,2894` filter silently, so a blocked place just disappears |
| `src/components/availability_component.js:54` | display of a dialogue option or action (`canBeDisplayed`) | mixed | `process_conditions` | recomputed | no | display vs start split; a row can show but not start |
| `src/models/skill.js:100` | XP gain (`canGainXP`) | capacity / knowledge | `canBeStarted` via availability | recomputed | no (callers decide) | `src/main.js:670` throws "Learn native Meditation before purification." when blocked |
| `src/main.js:670` | purification action needs Meditation | knowledge | ad hoc `canGainXP` | recomputed | yes (thrown text) | text names the skill; no check at settlement visible |
| `src/models/skill.js:153` | skill name shown or hidden (`visibility_treshold`, `isUnlocked`) | presentation | ad hoc threshold | recomputed from `total_xp` and flag | no (returns `unknown_skill_name`) | reveal at first level-up, comment at `skill.js:56` |
| `src/models/skill.js:192` | levelling stops at `max_level` (default 60, `skill.js:22`) | maturation | ad hoc cap | saved (`current_level`) | yes ("Already reached max lvl", `skill.js:236`) | overflow XP past max is dropped after the milestone check |
| `src/models/skill.js:198-213` | milestone unlocks of skills, recipes, quests on level-up | maturation | ad hoc milestone lookup | saved via reward | no | unlocks grant on crossing; reload behaviour inferred to rely on the reward path |
| `src/main.js:843` | XP per gain capped at `toNext * skill_xp_gains_cap` (`config.js:29`, 0.1) | maturation (rate limit) | ad hoc `Math.min` | recomputed per gain | no | silent loss of XP above the cap |
| `src/components/levelable_component.js:137` | same XP cap in the component path | maturation | ad hoc `Math.min` | recomputed | no | same silent loss; a second copy of the cap |
| `src/main.js:5415`, `5564` | crafting XP per craft capped by `crafting_skill_xp_gains_cap` (0.25) | maturation | ad hoc `Math.min` | recomputed | no | silent loss; crafting cap differs from skill cap |
| `src/data/locations.js:2613` | start a location needs strength 20 and max stamina 80 | capacity (body) | `process_conditions` | recomputed | no (no text) | start conditions carry no reason string |
| `src/data/locations.js:2704` | display of a location gated on Weightlifting 20 | capacity, presentation | `process_conditions` | recomputed | no | display only, per the file's own comment pattern |
| `src/data/locations.js:2744` | digging start needs a shovel in the tool slot | resource (tool) | `process_conditions` | recomputed (inventory) | no | reward unlocks an elder textline |
| `src/data/locations.js:1313` | location display gated on flag `is_mofu_mofu_enabled` | world state | `process_conditions` (flags) | flag (`main.js:3085` sets it) | no | flag set by a feature toggle, not by play |
| `src/data/dialogues.js:194` | dialogue textline shown at Farming 9 | capacity | `process_conditions` | recomputed | no | 10 `display_conditions` blocks in this file (inferred from count) |
| `src/main.js:1482` | `p23 moon bed` textline unlocked when `metVillageElder()` | social | ad hoc `setStatus` | flag (saved `is_unlocked`) | no | one-way write, reversal not handled (inferred) |
| `src/main.js:1315` | Shack housing accessible: `is_unlocked===true && housing.isUnlocked()` | world state | ad hoc boolean | recomputed | no | duplicated shape with `main.js:835` and `1616` |
| `src/main.js:835` | `housingAccessible` input to the furniture panel | presentation | ad hoc boolean | recomputed | no | same `is_unlocked===true` read |
| `src/main.js:1616` | `millUnlocked` fact for a panel or rule | world state | ad hoc boolean | recomputed | no | same shape |
| `src/main.js:1726` | `village.shackUnlocked` fact exposed to rules | presentation | ad hoc boolean | recomputed | no | feeds the rules context, so the same gate is a rule fact |
| `src/main.js:1456` | `marketKnown` (trader is unlocked and tradable) | social | ad hoc boolean | recomputed | no | "known" and "unlocked" mixed in one flag name |
| `src/main.js:962` | native stance needs the stance unlocked, in a training fight | knowledge | ad hoc `isUnlocked()` | recomputed | yes (thrown text) | text: "Choose an available native stance in the actual training fight." |
| `src/main.js:1004`, `1007` | Defensive Measures disabled and locked text | knowledge | ad hoc `isUnlocked()` | recomputed | yes (line text) | line 1007 names "your existing native route", so the route name is shown (GTR10 check: the route's existence is a fact the player may not know, inferred) |
| `src/main.js:1834` | opens planned unlocks (`plan.unlocks`, town access) through the staged transaction | world state, knowledge | `prepareNativeUnlocks` | flag, saved via envelope write | n/a | GTR12 path; the one live `native_unlock` user |
| `src/native_unlock_transaction.js:17` | an unsupported unlock throws at staging, before save | n/a | `prepareNativeUnlocks` | not saved (fails first) | no | guard, not a player gate |
| `src/native_unlock_transaction.js:38` | `is_unlocked: true` published after save | knowledge | `setStatus` | flag (`envelope.availabilities`, line 30) | no | publish runs after save, matching GTR12 |
| `src/main.js:1142`, `805` | Proto23 growth counter stays locked until the enroll action | social (permission) | ad hoc `is_unlocked` set | flag | no | enroll is the only opener in this file (inferred from grep) |
| `src/activities.js:129` | an activity starts locked (`is_unlocked: false`) | knowledge / world state | `process_conditions` on unlock | flag | unknown | the opener is not traced here (inferred: quests or milestones) |
| `src/crafting_recipes.js:1014` | recipe starts locked (ten such recipes, lines 1014 to 1237) | knowledge | `is_unlocked` plus milestones | flag | unknown | recipe unlocks come from milestones (`skill.js:198-213`), inferred |
| `src/items.js:228` | item trade or availability with `start_conditions` | resource / capacity | `process_conditions` | recomputed | no | item availability condition |
| `src/quests.js:428` | "Ploughs to swords" text states the strength requirement | capacity | authored text | authored | yes (authored text) | text names the requirement; the block is not a check, so it is a presentation rule |
| `src/quests.js:25`, `451` | hidden quests used as an unlock mechanism ("Swimming/climbing unlock") | world state | quest completion | saved quest state | no | `is_hidden` comment says these exist as unlock hooks |
| `src/rules.js:29` | any failed fact rule returns `Requires ${fact} ${op} ${value}.` | evaluator default | `evaluateRule` | caller facts | yes (generated text) | if an authored `reason` is missing, the fact key and threshold reach the player; GTR10 leak risk |
| `src/rules.js:25` | `known` flag: a missing fact is unknown, not false | evaluator | `evaluateRule` | caller facts | n/a | GTR10 rule is coded here (unknown vs unmet) |
| `src/rules.js:18` | `not` gate, default reason "This condition must not hold." | evaluator | `evaluateRule` | caller facts | yes (generic) | generic text names no fact, which is safe |
| `src/simulation_contracts.js:36` | `meets(rule, facts)` returns `evaluateRule(...).met` | evaluator | `evaluateRule` | caller facts | n/a | collapses unknown into unmet; a GTR10 concern when a caller then shows a reason |
| `src/simulation.js:43` | `ruleReason`: authored reason, else generic fallback | evaluator | `meets` | caller facts | yes | fallback text is safe |
| `src/simulation.js:107` | Proto23 command group visible only to the Proto23 host | presentation | ad hoc | context flag | yes ("Use the current Proto23 visitor controls.") | group gate, not a world rule |
| `src/simulation.js:110` | original frontier work needs a supported clock or contact | world state | ad hoc fact | caller facts | yes | text names "another realm", which tells the player where they are not |
| `src/field_works_projection.js:14-15` | field works gate: `Requires ...` rewritten to "Restore the required workshop, learned method or worker assignment." | knowledge, resource | `evaluateRule` | caller facts | yes (rewritten) | only rewrites when the reason starts with `Requires `; authored reasons pass through |
| `src/skill_expansion_host.js:24` | failed reasons shown only if they match an authored set | social | `evaluateRule` | caller facts | yes, filtered | good GTR10 shape: reasons pass a whitelist, otherwise `safeReasons` |
| `src/skill_discovery.js:64` | reasons shown only when not (eligible and unlocked) | presentation | ad hoc | caller input | yes | GTR10 handled here |
| `src/skill_discovery.js:7`, `65` | fallback "The required preparation or access is unavailable." when unlocked but blocked with no reason | presentation | ad hoc | caller input | yes (generic) | safe generic text |
| `src/crafting_frontier_runtime.js:80` | crafting needs `Village` and not `blocked` | world state (location) | ad hoc | recomputed (context) | yes ("Return to Village to experiment.") | |
| `src/crafting_frontier_runtime.js:102` | any thrown error becomes the reason (`reason=e.message`) | n/a | exception text | not saved | yes (raw error text) | raw `e.message` can name internals or hidden facts (inferred from pattern) |
| `src/crafting_frontier_runtime.js:103`, `108` | quote token includes context; commit re-checks fresh eligibility | n/a | recheck | recomputed | yes ("This quote changed.") | GTR11 pattern: check at commitment |
| `src/crafting_home.js:20` | `harvest.title = gather.reason` (tooltip) | presentation | reads quote reason | recomputed | yes (tooltip) | reason text reaches the player |
| `src/home_workers.js:28` | worker cannot start: "Assigned room rights, occupancy or structure no longer supports rest." | social / capacity | ad hoc | recomputed | yes | reason explains a changed room |
| `src/feature_expansion_destination_native.js:93` | destination allowed when `location.canBeStarted(context)` | world state | `canBeStarted` | recomputed | no | returns boolean |
| `src/expansion_engine.js:480` | action visibility (`visibleWhen`) | presentation | `evaluateRule` | caller facts | no (hidden) | GTR10: hidden action, no reason |
| `src/expansion_engine.js:481` | action requirements (`requires`), reasons carried to commit | mixed | `evaluateRule` | caller facts | yes | the commit path reads these |
| `src/expansion_engine.js:491` | non-repeatable action already done or queued | maturation (one-time) | ad hoc, reads `state.pending` | saved (`owner.completed`, `state.pending`) | yes ("Already committed or completed.") | GTR11: checks queued jobs at commitment |
| `src/expansion_engine.js:492` | one active technique drill at a time | capacity | ad hoc | saved (`activePractice`) | yes ("Finish or cancel your active technique drill first.") | single-slot cap |
| `src/feature_expansion_society.js:84` | local households need `village.elderMet` | social | `evaluateRule` (`eq`) | flag | yes (authored: "Meet the Village elder before asking about local households.") | authored text names an NPC the player has met (inferred: safe) |
| `src/feature_expansion_society.js:33` | default `requires: all(introduced, local)` for society actions | social | `evaluateRule` | caller facts | depends on `visibleWhen` | template default |
| `src/feature_expansion_society.js:98`, `104` | `requires` with `not(w('closed'))` and `w('supplied')` | world state | `evaluateRule` | caller facts | depends on authored reason | `closed` and `supplied` are world facts |
| `src/check_contract.js:91` | check `requires` gate; result passed to resolver as `gate` | capacity / world state | `evaluateRule` | caller facts | not traced (inferred: caller shows gate) | gate is returned, not thrown |
| `src/capabilities.js:47-49` | provider `when` rules; missing reasons collected | capacity | `evaluateRule` | recomputed | yes (collected reasons) | missing reasons flow to the capability panel (inferred) |
| `src/capabilities.js:52` | expired grant skipped silently | maturation (time) | ad hoc `expiresAt` | saved (`instance.expiresAt`) | no | silent expiry |
| `src/capabilities.js:53-55` | faculty not awakened, inactive or suppressed: source skipped | capacity | ad hoc | saved (`faculties`) | no | silent skip |
| `src/capabilities.js:58` | grant applies only if `grant.when` met | capacity | `evaluateRule` | recomputed | no | `.met` only, reasons dropped |
| `src/action_legibility.js:54` | any throw in `evaluateRule` returns `met:false, complete:false` | presentation | `evaluateRule` in try/catch | n/a | no | silent catch hides a broken rule as "not met" |
| `src/rule_modules.js:62` | selector `requires` gates a rule module | presentation | `evaluateRule` | caller facts | not traced | |
| `src/structured_pack_runtime.js:107` | stale belief: stale when no verdict and `rule` met | world state | `evaluateRule` | saved (`actor.belief.*`) | not traced | belief reset is an implicit gate |
| `src/book_world_paradise_actions.js:103` | `guard_access` needs `hankMet`, `warningLearned` and an admission cost | social / credential | `evaluateRule` (`all`, `has`) | saved facts | unknown (not traced) | `169` says admission facts are private, so presentation must not reveal them |
| `src/frontier_campaign.js:27` | `rival.begin` once; `visibleWhen` and `requires` both `member` | social | `evaluateRule` | saved | unknown | single `once` flag |
| `src/frontier_campaign.js:32`, `34`, `38` | pursuit actions need `pursuit.<id>.contact` or `.active` | world state | `evaluateRule` (`eq`) | saved (`pursuit`) | unknown | visibility and requires use the same fact |
| `src/display.js:2733` | connected location skipped when not `canBeStarted` | presentation | `canBeStarted` | recomputed | no | silent filter |
| `src/original_frontier_campaign_ui.js:176` | routine `canStart` from `action.eligible` and program state | resource | ad hoc | recomputed | yes (button disabled, title unknown) | UI gate |

## 4. Patterns

- **The `is_unlocked===true` read repeats.** `src/main.js:835`, `1315`, `1456`, `1616`, `1726` each read `getAvailabilityComponent().getStatus().is_unlocked===true`, sometimes with `housing.isUnlocked()`. One descriptor (for example `availabilityOpen(id)`) would cover all five and keep the fact name in one place.
- **Caps drop XP silently.** `src/main.js:843`, `src/components/levelable_component.js:137`, and `src/main.js:5415`, `5564` clamp XP to a fraction of the next level, and `skill.js:192-236` stops at `max_level`. None shows a message. Players see XP not arrive. A shared "capped, lost N" receipt would make the loss visible. Two copies of the same 0.1 cap also exist (skill and levelable).
- **Reasons can leak hidden facts.** `src/rules.js:29` builds `Requires <fact> <op> <value>.` when an authored reason is missing, so a hidden fact key reaches the UI. `src/crafting_frontier_runtime.js:102` copies raw `e.message` into the player-facing reason. `src/rules.js:25` and `src/simulation_contracts.js:36` collapse unknown into unmet, so a caller that shows "missing" can state a fact the player cannot know. The fix is the GTR10 whitelist already used in `src/skill_expansion_host.js:24`, applied in one shared helper.
- **Two evaluators, one question.** `conditions.js` `process_conditions` (no reasons, returns 0 or 1 or a fuzzy number) and `rules.js` `evaluateRule` (reasons, known) answer the same "can I start" question. New content uses `evaluateRule` (GTR9). The old one keeps display and start on different paths (`availability_component.js:54` and `:62`), so a row can show and still not start, and nothing tells the player why.
- **Silent filters hide blocked content.** `src/display.js:2366`, `2379`, `2516`, `2733`, `2870`, `2894` filter with `canBeStarted` and show nothing. Players see missing places, not a reason. Where GTR10 allows it, a "locked: needs X" row would tell them. Where it does not, the filter is correct, and the rule should say so per world.
- **Commitment checks exist in some places and not others.** `src/expansion_engine.js:481-492` and `src/crafting_frontier_runtime.js:108` re-check at commitment (GTR11). The `main.js` panel gates (`835`, `1315`, `1616`) are read at render time, so a stale view can show a gate that already changed. Old queued work keeps its admission only where the engine stores it (`state.pending`); the simple `canBeStarted` path does not store admission (inferred).
- **One-way unlocks with no reversal path.** `src/main.js:1482` and `src/native_unlock_transaction.js:38` set `is_unlocked:true` with no matching clear. That is fine for opening (GTR12), but any future "closed again" world event has no owner. `src/expansion_engine.js` and `src/feature_expansion_society.js:98` (`not(w('closed'))`) show the other path, which is a world fact, not a flag.
