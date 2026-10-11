# Progress Knight source dossier, 2026-10-09

## REPORT

Progress Knight's useful pattern is specific practice across lives: train a job or skill now, then learn that same subject faster in the next life. The original gives the player one job and one skill at a time; its maintained Quest continuation trains every unlocked task at once. Those are materially different games. For YAIR's draft D2b, the original's chosen routine is the closer reference; Quest is useful for offline batching, compact completion flags and reset explanations.

The original does not simulate closed-tab offline time. Quest replays at most one real hour, advances age as part of that replay and stops when the character dies. Neither establishes a suitable default for YAIR's long-life direction. Adopt explicit clock and retention policies as proposals, preserving vanilla's opening and unconsciousness. Do not silently import Quest's five reset layers, universal task training or offline aging.

This is static source research, not a browser playtest or implementation. Three shallow clones total about 1.9 MiB including Git metadata. No third-party scripts were executed, and no YAIR source, build, tests or saves were changed.

## Identity, snapshot and licenses

| Repository | Role and primary identity evidence | Pinned commit, commit date | License found at snapshot | Reuse treatment |
|---|---|---|---|---|
| [ihtasham42/progress-knight](https://github.com/ihtasham42/progress-knight) | Original author's [README][O-readme] identifies Ihtasham42; original browser/itch release routes agree | `f6dd0c3c444d838f80325bbdca918160b99e89e5`, 2021-07-11 13:32:49 +01:00 | [Root LICENSE][O-license]: The Unlicense, public-domain dedication and warranty disclaimer | Source-level ideas are available for original reimplementation; preserve attribution in research |
| [Symb1/progress_knight_2](https://github.com/Symb1/progress_knight_2) | Intermediate Progress Knight 2.0; Quest's own [credits][Q-credits] name this mod as its base | `5b6b059b1f5ad645837e504bde1d455995d05514`, 2022-02-15 21:19:03 +01:00 | No root license file or explicit license grant found in tracked files/readme | Public source availability is not a grant for the fork's original additions. Research and paraphrase only |
| [indomit/progress_knight_2](https://github.com/indomit/progress_knight_2) | Progress Knight Quest, [README][Q-readme] calls itself a continuation with five prestige layers; latest pinned commit fixes save migration | `d03f8b65adddab4a089a2f95e3a4749770aa03cb`, 2026-09-25 20:10:46 +07:00 | No root license file or explicit license grant found in tracked files/readme; no license/copyright matches found in inspected bundled JS either | Do not assume the original's Unlicense grants rights to later authors' additions or bundled dependencies. Research and independent reimplementation only |

“Maintained continuation” here means recent source activity in the checked Quest branch, not an exclusive successor claim. Rewritten, Reborn and other fan branches exist but were not audited. 2.0 was cloned for provenance/license inspection, not a separate exhaustive mechanical audit. Clones live outside YAIR at `~/.codex/research/progress-knight/{original,two,quest}/`. No source prose, art or implementation is copied into this dossier.

## Findings against the six lenses

**PK-F1 Core loop.** Original defaults to age 14, 70-year base lifespan, 20 callbacks per real second and four in-game days per real second before time-warp modifiers. `update` advances days, promotes/chooses a skill if enabled, trains the selected job, trains the selected skill, applies upkeep and redraws. Job income and XP scale through named multipliers. Player decisions are career category, skill, housing, equipped services, optional automation and timing of rebirth. There is no combat simulation inside the military job descriptions. [Initial state][O-state], [tick][O-tick], [multipliers][O-mult], [selection][O-choice]. At base speed the 14-to-70 age budget is about 85.2 real minutes, a derived formula rather than a measured completion time.

**PK-F2 Offline distinction.** Original saves JSON every three seconds, reloads objects and resumes a fixed `setInterval`; it stores no last-save timestamp and performs no elapsed-time catch-up. `HackTimer.js` is loaded to support timers while the page remains open, which is different from offline replay. [Save/load][O-save], [startup][O-start]. Quest stores `save_date_time` and catches up on load or long timer gaps. It ignores elapsed time at or below 10,000 ms, clamps to 3,600,000 ms, divides by its 50 ms tick length and runs 200 ticks per batch with 2 ms yielding delays. It checks life before and after each replayed update and stops at death. Normal update increases days, so replay consumes lifespan. It shows a percentage and hides the main UI during processing. These are source paths, not a proof that overlapping normal/replay timers are flawless. [Quest startup][Q-main], [offline][Q-offline], [constants][Q-constants], [update][Q-tick], [age advance][Q-time].

**PK-F3 Life, death and carryover.** Original age is a day counter; lifespan is 70 years multiplied by Immortality and Super immortality effects. Death clamps the age to the current lifespan, reveals death text and makes game speed zero. It does not automatically create an heir or rebirth. The UI offers first rebirth at 65 and second at 200; the functions themselves rely on hidden UI rather than checking age. Aging otherwise unlocks features and constrains the run; no source-backed youth/middle-age/elder role changes or injuries were found. [Lifespan/death][O-death], [age requirements][O-unlocks], [rebirth UI][O-rebirth-ui].

| Operation | Reset | Retain or add | Exact source |
|---|---|---|---|
| Original first rebirth | Coins, age to 14, selected job to Beggar, selected skill to Concentration, housing to Homeless, services empty; all task levels and current XP; most completion flags | Per-task greatest level ever, updated with current level before zeroing; XP factor `1 + maxLevel / 10`; evil, both rebirth counters and completed Scheduling/Shop/Automation/Quick task display flags are not wiped | [Reset][O-reset], [factor][O-task], [permanent list][O-state] |
| Original second rebirth | Same common reset, then every task's max-level record becomes zero | Adds Evil control × Blood meditation effect as evil; evil and counters survive common reset; permanent UI completion flags survive | [Reset][O-reset], [evil gain][O-evil] |

The original has **two** layers, not Quest's five. The first reward is not additive per-life XP: it is a task-specific best-ever record. The second trades away those records for a new persistent currency that multiplies Dark magic learning. No world rewind, branch history, NPC restoration or universal knowledge retention is represented by this reset. [Multipliers][O-mult].

**PK-F4 Quest reset stack.** Shared reset returns coins, age, elapsed life time, housing and services to baseline; zeros current task levels/XP and hero flags; updates task best levels; retains explicitly permanent reveal flags. Layer operations then specialize it. Eligibility is checked in `allowRebirth`. [Common reset][Q-reset], [eligibility and first three][Q-r123], [fourth/fifth][Q-r45].

| Quest operation | Layer-specific result beyond common reset |
|---|---|
| Touch eye | Increments first counter; retains task best levels; resets first-layer timer and updates fastest record |
| Embrace evil | Adds evil; clears task best levels and active challenge; halves/reset-selected evil perk ranks via a conditional helper; resets first/second timers |
| Transcend | Adds essence with `1e308` clamp; replaces evil with `evilTranGain()` rather than always zero; resets evil perks conditionally; sets max levels from current levels × Cosmic Recollection before common reset (which can raise them back to at least current level); clears active challenge |
| Collapse | Adds dark matter; clears essence, evil, spendable evil-perk points and receive-essence rank; clears task best levels and active challenge; challenge records reset unless challenge altar or save-challenges perk protects them |
| Metaverse | Adds perk points; clears essence, evil, dark matter, dark orbs, hypercubes, boost state, many shop ranks and metaverse upgrade values; clears task best levels and active challenge; conditionally retains specified dark-matter skill upgrades and challenge records; persistent perk choices/points and historical counters/stat records are not universally wiped |

Evil-perk helpers have conditional preservation, including permanent `evil_perks_keep` and bought exemptions. A clean “everything below resets” slogan is inaccurate: [helpers][Q-evil-reset] and [metaverse branch][Q-r45] are the authoritative field list. After the first Metaverse reset, `getLifespan` returns Infinity; before that, specific challenges compress the lifespan formula. [Quest lifespan][Q-life]. This is lifespan extension/escalation, not age-specific life-sim depth.

**PK-F5 Pacing and agency.** Original unlocks automation/quick display at 20, amulet tab at 25, its hints at 45/65/200, and magic through ordinary Concentration and Meditation at 200 each. Income supports housing and training aids; those improve XP, which opens careers and lifespan skills. Exponential XP cost growth, best-ever learning multipliers and category promotion compress revisits. Auto-learning chooses the *lowest current level* among eligible non-skipped skills, despite its variable's name implying XP. No measured balance or anti-grind success is claimed. [Gates][O-unlocks], [automation][O-auto], [cost][O-task]. Quest removes the one-task choice: every completed/unlocked task trains each update. The steering moves to shop, perks, challenges and reset timing. Its gates include age 1,000/10,000, Cosmic Recollection, essence milestones and currencies; that vast scale is a fork design, not a default recommendation for one-realm YAIR. [Quest tick][Q-tick], [gates][Q-gates].

**PK-F6 Data and saves.** Original defines jobs, skills, items, categories and requirements in JavaScript dictionaries, then constructs class instances with a common Task base. Formulas and special effects are code, not a declarative mod schema. JSON stores the live object graph, including repeated base data; load reconstructs prototypes and relinks selected objects. Keys are reconciled against current dictionaries, without an explicit schema version. Quest splits data, tasks, rules, UI and save management. Its Task `toJSON` emits a finite subset including stringified Decimal XP instead of runtime caches; save strips full requirement objects and stores only completed requirement names, then recreates definitions on load. This saves definition-heavy state, but it still stores baseData per task. No compressed localStorage save, byte budget or full numbered migration pipeline was found in these paths. [Original load][O-save], [reconciliation][O-relink], [Quest task serialization][Q-task], [Quest save][Q-save].

**PK-F7 UI density.** Original uses job/skill/shop/amulet/settings tabs, category rows, XP fill bars, current-task highlighting, effective XP gain/remaining XP, short tooltips and one next unmet requirement row per category. Best-ever columns appear only after rebirth. Quick task display exposes the current job and skill without hunting their table rows. Progressive reveal is driven by the same requirement objects that gate content. These are inspected UI definitions/update paths, not observed rendering. [Rows/tooltips][O-rows], [next unmet requirements][O-next], [status columns][O-columns], [reveal][O-reveal]. Quest adds a viewport-bounded tooltip with delayed display, mobile defaults and separate simulation/save/render loops. [Tooltip][Q-tooltip], [mobile defaults][Q-mobile], [loops][Q-main].

**PK-F8 Missing life-sim systems.** Neither inspected original loop nor Quest's main growth/reset loop implements the north star's staged research understanding versus practice, followers with lives/loyalty, NPC succession, annual biography, or operation cards for a world-history rewind. “Personal squire,” Butler and Library are multiplier-bearing items, not evidence of an actor simulation. Quest's events include a real-date seeded temporary modifier schedule, gated by reset history. That is not a character life-event director, and historical offline replay does not visibly pass historical timestamps to that schedule. [Original multiplier items][O-mult], [Quest event schedule][Q-events]. Do not claim historical-event replay parity from this source inspection.

## Small touches mapped to vanilla YAIR

All entries are proposals, not decisions or gameplay changes. Vanilla anchors verified read-only: `src/activities.js:45-97` has jobs, training and gathering plus fieldwork/patrolling; `src/data/skills.js` owns native skills; native center-menu play is the accepted baseline in PROJECT.md. `src/chronicle.js:73-97` supplies optional life clock state; current mortal mode is not the vanilla default. `src/save_files.js:166-188` already guards a 4 MiB origin-wide UTF-16 storage budget, so the north star's older “no size guard” line is stale.

| Code | Source touch | Small YAIR adaptation | Source |
|---|---|---|---|
| PK-T1 | Next locked promotion shows only unmet prerequisites | Fieldwork/patrolling next-role card with exact missing native skill or reputation | [O-next] |
| PK-T2 | Current work highlighted inside its table | Highlight the active center activity inside its own location list | [O-columns] |
| PK-T3 | Quick selected job/skill summary | Keep ongoing activity, purpose and next stop visible above center actions | [O-rows] |
| PK-T4 | Effective XP gain and XP remaining | Native training tooltip shows current modifiers and progress to next useful breakpoint | [O-columns] |
| PK-T5 | Best-ever column appears after first reset | Optional legacy preview appears only after legacy is discovered | [O-columns] |
| PK-T6 | Per-subject learning memory | An optional heir learns a demonstrated ordinary skill faster, without receiving its usable level | [O-task], [O-reset] |
| PK-T7 | Automation stays in current career category | A routine continues the player's chosen work route rather than changing professions | [O-auto] |
| PK-T8 | Individual skills can be skipped by auto-learning | Saved routine exclusions for native tasks the player does not want repeated | [O-auto] |
| PK-T9 | Shop aids affect specific task families | Existing books/tools expose what they accelerate, keeping ordinary tools useful | [O-mult] |
| PK-T10 | Housing supports learning through happiness | A modest native rest/home comfort bonus whose cost and benefit are shown | [O-mult] |
| PK-T11 | Bankruptcy removes upkeep, keeps the life going | An optional service stops at a reserve floor; do not copy forced loss of native inventory | [O-upkeep] |
| PK-T12 | Rebirth UI states exactly what is lost and gained | A proposed heir/rebirth operation card lists coins, equipment, knowledge and world consequences before use | [O-rebirth-ui] |
| PK-T13 | Discovery unfolds over birthdays | Optional age milestones use existing chronicle/bio, with choices relevant to elder teaching rather than another flat multiplier | [O-unlocks] |
| PK-T14 | Offline batch yields and shows percentage | A bounded native routine settlement reports elapsed time, work completed and why it stopped | [Q-offline] |
| PK-T15 | Offline stops at death | Stop settlement at declared life/health boundaries, report unused elapsed time and never silently force rebirth | [Q-offline] |
| PK-T16 | Save only completed requirement names | Reconstruct immutable content definitions; save compact IDs and player deltas within current guard | [Q-save] |
| PK-T17 | Explicit task serializer omits runtime caches | Audit YAIR save projections for caches/derived fields rather than compressing everything blindly | [Q-task] |
| PK-T18 | Tooltip flips at viewport edges | Keep native crafting/equipment/research tooltip readable near right/bottom edges | [Q-tooltip] |
| PK-T19 | Manual property/service selection stops auto-buy | Manual center-action choice overrides a routine until the player resumes it | [Q-manual] |
| PK-T20 | Known reveal flags persist separately from present power | A previous life can remember a discovered route while still needing the next body's prerequisites | [O-reset] |

## Ranked proposals for the combined GM report

| Rank | Code | Proposal | Reviewable future gate |
|---|---|---|---|
| 1 | PK-P1 | Write a field-level carryover card for one optional heir operation; distinguish discovered knowledge, learning ease and current usable skills | Preview and resulting save agree on every retained/reset field; original unconsciousness unaffected |
| 2 | PK-P2 | Chosen ordinary work routine with explicit stop conditions and manual override | Native fieldwork/training runs to goal/reserve, stops and reports reason after reload |
| 3 | PK-P3 | Offline policy separates work settlement from lifespan/history advance | A known away duration cannot age/kill the player unless that card declares it; no unbounded tick replay |
| 4 | PK-P4 | Next useful prerequisite card in native activity UI | Player can identify exactly one reachable next career/training step without a new window |
| 5 | PK-P5 | Compact completion/knowledge ID state, reconstructed definitions | Save/reload/import preserve facts within the existing budget; migration is explicit |

These are ranked research proposals. Only PK-P1 involves a prestige layer, and it remains opt-in. Research's standard stage model, aging role changes and followers should be informed by other references because this code does not supply them.

## CHECKPOINT

- Completed: canonical original verification; primary-source 2.0 → Quest lineage; hashes/dates/license inspection for all three shallow clones; six lenses; exact original reset and bounded Quest reset/offline source trace; twenty source-linked small touches; five ranked proposals.
- Limits: no games executed or browser layouts inspected; no balance/play-duration measurements; forks other than 2.0 and Quest not audited; no claim that Quest's source paths are bug-free; license absence is snapshot evidence, not a legal determination about all authors/assets.
- Ownership: only this dossier written in YAIR. No changes to PROJECT.md or north star decisions. No source/build/test/save/commit writes.
- Next GM action: combine these findings with the Idle Loops/Evolve dossiers, preserving original-versus-fork distinctions, optional mortality and current storage guard. A future implementation would require the project's rebuild, fresh-origin browser and persistence gates.

[O-readme]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/README.md#L1-L19
[O-license]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/LICENSE#L1-L24
[O-state]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L1-L33
[O-tick]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L1013-L1021
[O-mult]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L216-L290
[O-choice]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L370-L395
[O-evil]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L318-L329
[O-save]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L980-L997
[O-start]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L1148-L1158
[O-reset]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L850-L890
[O-death]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L892-L909
[O-task]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/classes.js#L1-L74
[O-unlocks]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L1056-L1110
[O-auto]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L709-L763
[O-relink]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L912-L978
[O-rows]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L424-L481
[O-next]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L484-L548
[O-columns]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L550-L575
[O-reveal]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L647-L658
[O-upkeep]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/js/main.js#L332-L353
[O-rebirth-ui]: https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/index.html#L233-L261
[Q-readme]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/README.md#L1-L5
[Q-credits]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/index.html#L1519-L1541
[Q-main]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/main.js#L23-L134
[Q-offline]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/offline.js#L7-L122
[Q-constants]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/data.js#L316-L320
[Q-reset]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/game.js#L773-L830
[Q-r123]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/game.js#L832-L910
[Q-r45]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/game.js#L912-L1028
[Q-evil-reset]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/game.js#L731-L771
[Q-life]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/game.js#L1030-L1058
[Q-time]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/game.js#L696-L729
[Q-tick]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/game.js#L1250-L1286
[Q-gates]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/data.js#L578-L613
[Q-task]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/task.js#L40-L90
[Q-save]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/saveman.js#L113-L225
[Q-mobile]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/saveman.js#L1-L11
[Q-tooltip]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/ui_tooltip.js#L7-L90
[Q-events]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/events.js#L1-L84
[Q-manual]: https://github.com/indomit/progress_knight_2/blob/d03f8b65adddab4a089a2f95e3a4749770aa03cb/js/game.js#L526-L560
