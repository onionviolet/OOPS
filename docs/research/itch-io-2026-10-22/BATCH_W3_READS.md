# itch research: wave 3 reads of open gaps, 2026-10-23

Proposals only (AD32). Static reads of served or saved files; no game code run, no native downloads. Paraphrased; identifiers only. Covers gaps OG5, OG6, OG8, OG10, OG12 and IM26 from [OPEN_GAPS](OPEN_GAPS.md). Skipped: OG1 to OG3 (tool fixes, another lane) and everything closed-unreachable. Deep notes with line locators are in the gitignored folders `private/w3-og5/`, `private/w3-og6/`, `private/w3-og8/`, `private/w3-og12/` (each `NOTES.md`). Locators below are file:line in those saved builds.

Labels: `source` = found in code or data. `stated-not-found` = claimed or hinted, not found. YAIR grep means a search of `src/` on 2026-10-23.

Gap ledger first, then per-game entries, then the YAIR-mapping table.

## Gap ledger

| Code | Item | Result |
| --- | --- | --- |
| OG5 | Idle Xanxia combat formulas | Read. Full stat and mitigation model traced. |
| OG5 | Quest of Qinghe BattleEngine | Read. Round loop and damage model traced. |
| OG5 | Dao of the Endless Sky | Still unreachable (curl timed out). Closed-unreachable. |
| OG5 | Nivrael | Landing page only; game is a Telegram mini-app. Closed-unreachable. |
| OG5 | Text Cultivation | Native only. Closed. |
| OG5 | The Left Hand refers to the moon | Not cultivation. Closed. |
| OG6 | Incremortal routine unlock | Read. Traced in decoded GDScript. |
| OG6 | Lifeidle events | Read. Structure and roll model traced; story chains not implemented. |
| OG6 | Lowmoor sea nodes | Read. 26-node graph traced; travel event prose is in `lowmoor-boot.js`, unread. |
| OG6 | Town Tycoon fishing and ski | Read. |
| OG6 | God of Ashes events | Read. Single inline HTML, 27 events. |
| OG8 | Eigengrau factions | Partly read: faction creation and leader. 22 type files, allies, rivals, stability helpers unread. |
| OG8 | Eigengrau plot hooks | `stated-not-found`. Files named in the repo tree only. A fetch of extra GitHub files was refused by the permission classifier and not retried. |
| OG8 | Talk of the Town person.py and knowledge | Read. The public repo has no knowledge model; hooks only. `relationship.py` unread. |
| OG10 | Medieval Merchant Simulator spouse pay | Read. Source traced. Spouse pay opt-out not traced. |
| OG12 | Far Beyond The Mountain | Not located. Three searches found no page. Next step is to follow the credits link inside Path Past The Mountain by hand. |
| IM26 | Heirdeep | Read further (child roll, kin check, succession, paid stat research). |
| IM26 | Mos Maiorum | Read further (marriage offers, births, edge cases, drift). |
| IM26 | Labor Omnia Vincit | Page has no web player, only four downloadable single HTML files (178 to 221 kB, plain HTML per the page). Not downloaded. Needs Weibao's yes to download. |
| IM26 | Peak Cultivator, Beggar's Life code | Not attempted (obfuscated, or blocked by OG2). |

One correction to an earlier batch: [BATCH_LIFE_A](BATCH_LIFE_A.md) round 5 says YAIR has no completion-count routine unlock. `src/household_fortunes.js:53-69` now has `ROUTINES`, `recordCompletion`, `unlockedRoutines` and `routineMayRun` (tag OG16, guard AD16, small tables: cook 5, repair 3, dry 4; checked in this pass). Treat OG16 as built at that coarse level. Whether `src/home_staff.js` consumes it was not traced.

## Idle Xanxia: combat (second pass)

Build: React/Vite bundle, pretty-printed; the math functions are plain (pretty.js 7550-7660, 15990-16024). Licence: none stated, ideas only.

- **Systems (`source`):** five stats: force, dexterity, agility, vitality, endurance. HP is 100 plus 10 per vitality. Attack interval shrinks with agility on a log curve from 1800 ms. Hit chance is a dexterity-versus-agility ratio clamped 0.35 to 0.95, and dodge is its complement. Crit chance saturates in dexterity with a 0.5 ceiling (0.75 global cap); crit multiplier is 1.7 plus a small dexterity term. Mitigation is endurance/(endurance+500), capped 0.95, then flat armor minus armor penetration, with a minimum-damage floor. Order: hit, crit, endurance, flat armor. Debuffs: endurance reduction with a floor, armor reduction, endurance bypass at max stacks, plus healing, speed, damage, dodge and hit reductions (same kind takes the max). Damage reduction is capped at 60%. A body-harden rule shaves large hits. Double strike is a second hit at 65% after a landed hit. Aspects convert stats (crit chance to crit damage, HP to armor, dodge to damage). Enemy stats come from a floor budget table, a wave-size share, a 0.8 to 1.2 roll, and a species recipe over the five stats; bosses use a separate budget table. `stated-not-found`: an element triangle.
- **Representations:** floating numbers with crit and double-strike styles; expected-damage readouts.
- **Improvements:** none stated.
- **YAIR mapping:** `src/combat_readout.js:37` has hit chance from attack versus evasion points. No endurance-ratio mitigation, armor penetration or debuff table found by grep. Candidate for the combat owner.

## Quest of Qinghe: BattleEngine (second pass)

Build: Godot 4.5 PCK, decoded scripts (`CombatCalc`, `BattleEngine`), plain.

- **Systems (`source`):** player or auto strike each round; the faster side moves first, ties to the player. Damage is attack times an element-skill tier bonus times a "root overcome" factor (the root-grade gap over 100, applied both ways) times a low-HP berserk factor, 1.5x on crit, with a chance of a second hit scaled by battle wins. Enemy hits scale with level, grade (1 to 6x), berserk and overcome, and are blocked first by a shield (a percent of max HP), then reflect and monster life-steal apply. Challenge monsters have a 25% combo. Every third round brings an element rotation or a max-HP drain. An odds preview compares rounds to survive against rounds to kill. Guardian bosses use fixed per-realm base stats. `stated-not-found`: an element wheel, and status effects such as burn or stun.
- **Representations:** orb projectiles, floating skill names, an easy, even or hard odds label.
- **Improvements:** none stated.
- **YAIR mapping:** no root-gap overcome or odds preview found in `src/`. The overcome term is a cheap way to make world-specific affinity matter without a wheel (AD1 dials).

## Incremortal: routine unlock

Build: Godot, decoded GDScript, readable.

- **Systems (`source`):** each task has an optional auto-threshold (game_data.gd:239-644). Repeatable gathers need 200 to 400 completions; one-off story or craft tasks need 10. A per-task completion counter is credited at game_state.gd:3063 and the routine unlocks at the threshold. The prestige rank "practiced_hands" cuts the threshold to 75% or 50% (:255-265). Counters survive death and clear only on new-game-plus (:351); the unlocked count feeds a prestige currency. The picker (:1244-1313) takes only unlocked tasks with priority above 0; tasks that branch the story default to priority 0 and never automate. Order is player priority, then category (food, upgrade, practice, material), then lowest stock; missing inputs become gather plans. A lethal guard blocks an automatic task near its end if a safe alternative exists (:980-1012), and a food emergency switches to a food producer (:1506).
- **Representations:** a priority-grid automation menu (ui_automation_menu.gd) and a banner list of routines unlocked this life.
- **Improvements:** practiced-hands lowers thresholds.
- **YAIR mapping:** `src/household_fortunes.js` already has the idea (OG16, AD16). Not found in `src/`: a per-task priority grid, the category tiebreak, gather planning of missing inputs, a prestige discount on thresholds.

## Lifeidle: events

Build: plain JS. Licence: none checked.

- **Systems (`source`):** 152 events: child 41, teen 43, adult 40, elder 28. Each has an id, age band, weight, stat-range effects and optionally two choices. Adult events add a category, a requirements block of about 45 comparators (stats, money, debt, credit, housing, bond, drama, children, traits required or blocked), an optional chance, a once-per-year flag and a trait gain (adultEvents.js; adultEventSystem.js:188-240). A fire attempt walks categories in priority order (forced, relationship, health, career, financial, life, flavor); each category passes a roll from 1.0 (forced) down to 0.25 (flavor), and trait multipliers scale category weight. Events that grant a trait you do not yet hold are tried first (:95-130). Finishing an activity can fire an event with its own chance and a narrowed category order (:52-75). History is capped at 30. Elder events feed life satisfaction, life review and life points. `stated-not-found`: story chains (a story_chain priority and a null slot are declared at teenEvents.js:470 and teenEventSystem.js:26, with no implementation).
- **Representations:** emoji icon plus a log line prefixed with an event marker.
- **Improvements:** a once-per-year flag stops the debt-collector call from repeating.
- **YAIR mapping:** `src/storylet_deck.js` (intervals, quiet periods, pity) and `src/storylet_content.js` cover weighted conditional events. Not found: a trait-granting-events-first rule, per-activity event chances, category-priority rolls.

## Lowmoor: sea nodes

Build: plain, 2.8 MB bundle (lowmoor.pretty.js).

- **Systems (`source`):** the Sea has 26 nodes (:704). Each has a chapter (0 to 6), a work kind (physical or survey), a work amount, a requires field, a revealAfter field and a persistent flag. Four extra nodes (a lost cutter and its crew) grant a pet, a hireling and a named piece of armour. Prerequisites are an OR of ANDs (alternative lists of node ids). Visibility is separate from unlock: a node shows once its revealAfter nodes are done, and a seen list keeps it visible (:5190). There is no distance or travel cost; a node costs work (2.5k to 59k) times 3 times 72 (:3890, :5068). A completed survey is recorded in a cross-hero atlas (:5289). Chapter skill points pay 75% in proportion to work done along the objective's dependency path and the boss pays the rest; inherited surveys pay none (patch notes 39-43). Three ship refits give +5%, +10% survey and +10% physical work, capped at +15%, and auto re-buy at 3x cost. Patch notes mention a Footing check on journeys with a possible second event (line 49). `stated-not-found`: the travel event table (prose is localisation keys, text in `lowmoor-boot.js`, unread).
- **Representations:** a dependency "plan" walk to the current objective, an atlas of seen and surveyed nodes, a journal capped at 60 lines.
- **Improvements:** sea speed scaling at 100, 50 and 25% with soft thresholds.
- **YAIR mapping:** `src/known_routes.js`, `src/structured_expedition_runtime.js`, `src/authored_site.js` exist but were not read here, so not compared. Candidates under the SR rules: the OR-of-AND node graph, seen versus unlocked, and survey knowledge persisting across heroes. Grep for "atlas" and "surveyed" found only unrelated hits.

## Town Tycoon: fishing and ski

Build: plain JS (game.js).

- **Systems (`source`):** casting costs 15 stamina; a bite window leads to a reel mini-game whose struggle phases double the drain (:1019-1032). After 20 non-rare catches the next catch is forced rare (:1037). The first catch of each species pays 9x cash (1.5x for legendaries); three species give gems. Completing the five base species grants a Master Angler perk and unlocks the next district (:946, :461). A rare catch refunds 5 stamina. An almanac logs count and best weight per species. The ski mini-game costs 1,000,000 cash plus 20 stamina and pays nothing, with five score trophies (50k to 1M) giving gems on first earning, 5 lanes, hop and shield, and speed rising 230 to 880 (:1333-1391). The ice rink is a timed passive build, 3 minutes times the next level, offline included.
- **Representations:** a trophy shelf; an almanac "new" glow.
- **Improvements:** the pity counter and the stamina refund on a great catch.
- **YAIR mapping:** `src/activities.js:211` has a basic fishing gather; `src/gen_kit.js:152` has a pity function and `src/craft_sources.js` has rare finds with optional pity. Not found by grep: an angler almanac, species log, first-catch bonus or set-completion gate. Ski and rink are out of scope.

## God of Ashes: events

Build: single inline HTML, readable, 2,057 lines.

- **Systems (`source`):** 27 authored events: awakening 6, village 6, town 5, city 7, dominion 3; 14 are once-only. Shape: phase, weight, body, choices with a cost, a need for followers or a building, and per-choice outcomes (log, resource deltas, follower gain or loss, setFlag). The picker (index.html:1169-1186) applies a phase gate and the once flag, then a weighted draw. Weight 0 with a triggerFlag forces a story event (the final ritual, :698). Chains are flag-based (setFlag at :515, :517, :680, :682). One-time log lines (TRIGGERS, :959+) keyed to pulse or follower counts and phase form a six-step arc for the first follower, Maren (:998-1010). Follower loss never removes named ones.
- **Representations:** lowercase narrative voice; an opening memory list (:1389); a "divine vision" miracle that previews one unseen event title or hints at the next phase (:1510).
- **Improvements:** none stated.
- **YAIR mapping:** `src/storylet_content.js` (once, weights), `src/causal_story_scenes.js` and `agreed_duty_*` cover follow-ups. A purchasable foresight that previews the next event was not found (grep "omen" and "foresight" gave unrelated hits).

## Eigengrau: factions (partial)

Build: plain TypeScript, MIT. Read createFaction.ts and leader.ts only.

- **Systems (`source`):** a faction's type is a weighted draw from the town's rolls. Motivation, member trait and leadership form (individual or group) are weighted draws from that type's table. Nine 2d50 rolls (influence, reputation, age, size, stability, resources, joining fee, leader competence, bribe attitude) are clamped. A fixed pipeline fills each trait from its roll, with allies and rivals last, and ladders turn numbers into phrases. An individual leader is a real NPC with a reciprocal relationship ("head of faction" and "controlled faction") and becomes town leader if the faction holds political power; a group leader replaces any lone leader. The stated cause of stability is derived from the roll and the leadership form (L83-94).
- **Plot hooks:** `stated-not-found`. The tree shows a plot-hook folder with four mission files and an "inactive" generator and data file that look retired. Not fetched.
- **Representations:** faction profile pages, a livery, a derived one-line description.
- **Improvements:** none found.
- **YAIR mapping:** no reciprocal-label structure in `src/` (grep "reciprocal" hits only a continuation check and an XP credit). Closest owner is `src/generated_people.js`. A faction as a bundle of banded rolls with derived reasons fits AD1 world dials. `src/story_recognizer.js` already derives stories.

## Talk of the Town: person.py and knowledge

Build: plain Python, MIT.

- **Systems (`source`):** the public repo has no knowledge model. `mind.py` is 66 lines holding one inherited memory number. `person.py` keeps a set of belief facets "for batch decay" and tests whether a person models a relative before they count as known (L1340), but `mental_models`, `Facet` and `decay_strength` are defined nowhere in the repo tree. How a person acquires, distorts or forgets facts is `stated-not-found`; the earlier "partly wired" reading becomes "hooks only". Salience is seeded at birth for family and self, raised by interactions and relationship changes, and clamped at zero (a comment calls the clamp duct tape). A derived "who is X to me" list uses a hinge, the mutual relative; a TODO admits missing preconditions. Socializing is per location: housemates are forced into contact, and chance is extroversion plus openness (strangers) or friendship and best-friend bonuses, clamped. Like, dislike and hate are charge thresholds. `relationship.py` not read.
- **Representations:** none read.
- **Improvements:** only the TODOs above.
- **YAIR mapping:** no salience, mental-model or belief-decay code in `src/`. `src/action_legibility.js` and `src/backlog_expansion_replacement.js` already model scoped informed-observer belief, and `src/story_recognizer.js` has a salience table. Unmatched: per-person salience of other people as a talk and notice weight (cheap).

## Medieval Merchant Simulator: spouse pay

Build: plain JS, unminified (game.js 25,280 lines plus js/ domain files).

- **Systems (`source`):** the spouse stays in the hireling list, so is on payroll. Pay is 0 for a child or serf, otherwise a stats, mastery and age formula rounded to 5 with a floor of 18 (L22772). The shared player treasury funds it. Every 30 days, all or nothing: if gold covers the total for all paid people it is deducted and each person's earned-wage total is credited (L22781); otherwise nobody is paid and each gets +1 unpaid day. A short-funds spouse is handled separately (L22798): the unpaid count rises daily; at 3 days there is one serious talk (bond -4, trust -2, loyalty -2); ten days after that the marriage ends as separated, with a history entry and removal from the household. Quirk: when gold later covers one month's salary the spouse's arrears are cleared and the ultimatum resets without taking gold or crediting wages (L22802). Workers do pay arrears from gold and quit at 3 days. Not traced: any spouse pay opt-out.
- **Representations:** the salary line and monthly wage total are shown.
- **Improvements:** a v0.55 comment calls the spouse "family, not a worker".
- **YAIR mapping:** `src/home_staff.js` has funded-wage language but no unpaid-days ladder (grep "unpaid" and "arrears" outside content text: none). `src/npc_lives.js` holds spouse status. A grace ladder for family with a free recovery is unmatched.

## Heirdeep (IM26 deeper read)

Build: 1 MB Vue module, esbuild pretty-printed (`private/heirdeep/pretty.js`); the child-stat roll sits in a worker source string at line 16505. Earlier summary: [BATCH_SCOUT](BATCH_SCOUT.md) S5. No licence found.

- **Systems (`source`):** each child stat is the mean of the parents' born stats, plus up to 1 point of jitter either way, plus a 6% chance of +2; a "gifted" parent rolls the mutation twice. Perks can raise the mutation rate, add a point to the shared top stat, or floor the child at the lower parent. Grade letters come from the stat total (S at 34, A 28, B 22, C 17, D 12, E 8). The forecast uses 400 samples seeded from the parents' ids, so it is stable. Kin check blocks pairs sharing a parent, parent and child, and pairs two generations apart; with no clear couple the game says new blood arrives through the Gate. A miss adds 20% to the next try (cap 60%) and forces 12 hours of rest (4108, 5035). Succession (6643-6659): each child coming of age is compared with the current heir; better grade wins, ties go to the stronger birth, the loser ages in as plain blood. The Warden can name an heir (6661) and clear it (6667). A seat change gives a 3-day mood swing of 3 per grade of difference (6591-6600). A regent holds the seat until blood comes of age (6614-6627); step-down needs a grown heir (6678). New: "dubious research" (5164-5205) pays gold and a salve to a healer to raise one born stat by up to 1, with a 35% complication chance reduced by a wit term.
- **Representations:** forecast range bars with a mutation sliver; P(C/B/A or better); chips explaining why the conceive chance moved; a projected grade after schooling labelled "not blood".
- **Improvements:** pair suggestions rank by expected grade, then P(A), then conceive chance, and pick disjoint couples.
- **YAIR mapping:** not found in `src/`: child forecasts, kin-blood checks, born-versus-learned stats, regents, succession mood swings, paid stat research. `src/heir_inheritance.js` has laws and a spouse life estate (27-31, 54-58, 119-123) but no pairing; `src/npc_lives.js` has births and marriages as events with no choice.

## Mos Maiorum (IM26 deeper read)

Build: plain single HTML, one long line per function. Earlier summary: BATCH_SCOUT S6d.

- **Systems (`source`):** one pending marriage offer at a time (372-381). Accept gives +15 relation both ways and prestige +3 and +2. Generous terms cost house wealth 5 (the other house gets 4), add +8 to one side only, give prestige +5 and store no relationship reason. Decline adds a remembered grievance to the other house. Births come only from wives aged 18 to 40 at 20% a year, and the baby takes the husband's house (115). Edge cases: inheritance (107) handles sons only, so a daughter, spouse or sonless estate passes nothing; a widow keeps her dead husband's id, so remarriage filters exclude her. Living couples drift up to 4 points a year between 5 and 95 with estrangement and "close partnership" log lines (341-349). Education offers three choices with stat bumps (383-385). Estate has a once-a-year policy (296-302). An adviser dispute fires at 13% a year (326-335). Quarrels create house grievances (137, 113). The line ends when no member of the player house lives (358). `familyPolicy` is stored (101, 480) with no consumer found: `stated-not-found`.
- **Representations:** a "why" modal framed as the advisers' best guess rather than omniscient truth (354); a character dossier with personal memories (495).
- **Improvements:** none stated.
- **YAIR mapping:** `src/heir_inheritance.js` already covers what Mos Maiorum lacks (daughters, spouse life estate, laws). Not found: house-level grievance tables, marriage negotiation terms.

## Labor Omnia Vincit

Page has no embedded player and no HTML5 tag, only four downloadable single HTML files. Native-style download needs Weibao's yes (state: filename, itch source, 178 to 221 kB each). Not read.

## Far Beyond The Mountain

Not located (OG12). Three web searches found no page, listing or Famicase entry with that title; near hits are unrelated ("Far Above the Moon" on Famicase, "Beyond the Mountains"). Identity, premise and mechanisms are unknown beyond the credits asset in Path Past The Mountain ([BATCH_EXPLORE](BATCH_EXPLORE.md) lines 84 and 124). Next step: follow the credits link from that page by hand.

## YAIR-mapping table

Verdicts: **built** = already in `src/`; **partial** = the idea exists coarsely; **new gap** = grep found nothing. All are proposals (AD32); owners are suggestions.

| Finding | Source | Verdict | Owner or note |
| --- | --- | --- | --- |
| Completion-count standing routine | Incremortal | **built** (coarse) | `household_fortunes.js` ROUTINES, OG16, AD16. Corrects BATCH_LIFE_A. |
| Per-task priority grid, category tiebreak, gather planning of missing inputs | Incremortal | new gap | Household routines; low urgency under AD33. |
| Prestige rank that lowers routine thresholds | Incremortal | new gap | Extends ROUTINES; dial per AD1. |
| Story-branch tasks never auto-run | Incremortal | **partial** | `routineMayRun` stops at pending choices already. |
| Endurance-ratio mitigation plus flat armor, penetration, capped debuff table | Idle Xanxia | new gap | Combat owner, not `combat_readout.js` (readout only). |
| Root-gap "overcome" and odds preview (survive-rounds vs kill-rounds) | Quest of Qinghe | new gap | Cheap per-world affinity term; combat readout. |
| Category-priority event roll with pass chances; trait-granting events first | Lifeidle | new gap | `storylet_deck.js`. |
| Per-activity event chance with narrowed category order | Lifeidle | new gap | `storylet_deck.js` plus activities. |
| Weighted conditional events, once-flags, pity | Lifeidle, God of Ashes | **built** | `storylet_deck.js`, `storylet_content.js`. |
| Foresight miracle previewing the next event | God of Ashes | new gap | Low novelty; `storylet_deck.js`. |
| OR-of-AND node prerequisites; seen vs unlocked visibility | Lowmoor | new gap (unverified against route code) | SR rules; `known_routes.js` and `authored_site.js` not read. |
| Survey atlas persisting across heroes | Lowmoor | new gap (unverified) | Check against `known_routes.js`. |
| Species almanac, first-catch bonus, set-completion gate | Town Tycoon | new gap | `activities.js` fishing. |
| Pity counter on rare catches | Town Tycoon | **built** | `gen_kit.js:152`, `craft_sources.js`. |
| Faction as banded rolls with derived reasons | Eigengrau | **partial** | AD1 dials; `generated_people.js`. |
| Reciprocal relationship labels (leader and controlled faction) | Eigengrau | new gap | `generated_people.js`. |
| Per-person salience as talk and notice weight | Talk of the Town | new gap | Cheap; link `story_recognizer.js` salience table. |
| Scoped informed-observer belief | Talk of the Town hooks | **built** | `action_legibility.js`. |
| Unpaid-days ladder for family, with a free recovery | Medieval Merchant | new gap | `home_staff.js`, `npc_lives.js`; check AD19 (no lockouts). |
| Child stat forecast, kin-blood check, born vs learned | Heirdeep | new gap | `heir_inheritance.js` has laws only. |
| Regent and succession mood swing | Heirdeep | new gap | `heir_inheritance.js`; note AD16, AD19. |
| Paid stat research with complication risk | Heirdeep | new gap | Fits AD38 (works by mechanism); body or craft owner. |
| Marriage offer terms with remembered grievances | Mos Maiorum | new gap | `npc_lives.js`. |
| Daughters, spouse life estate, laws | Mos Maiorum lacks, YAIR has | **built** | `heir_inheritance.js`. |
| Advisers' "best guess" framing of causes | Mos Maiorum | **partial** | `action_legibility.js`; presentation only. |

## Top findings

1. **OG16 is closed at the coarse level.** YAIR already has completion-count routines; Incremortal's real extras are the priority and category scheduler and the threshold discount.
2. **Heirdeep is the richest unmatched family source.** A child forecast, kin-blood check, born-versus-learned split, regent and succession mood swing have no counterpart; `heir_inheritance.js` has laws but no pairing.
3. **Lifeidle's event roll** (category priority with pass chances, trait-granting events first) is the most developed event scheduler read so far and fits `storylet_deck.js`.
4. **Medieval Merchant's family pay ladder** (3 days to one talk, 10 more to separation, free arrears recovery) is a small, concrete pattern; AD19 says recovery should be possible, which the quirk already shows.
5. **Lowmoor's sea** is a prerequisite graph with OR-of-AND requirements and a persistent atlas; check it against route code before calling it a gap.

## Verification

Read: Idle Xanxia combat math, Qinghe BattleEngine and CombatCalc, Incremortal automation code, Lifeidle event data and systems, Lowmoor bundle and patch notes, Town Tycoon game.js, God of Ashes inline build, Eigengrau createFaction and leader, Talk of the Town person.py and mind.py, Medieval Merchant payroll code, Heirdeep and Mos Maiorum saved builds. Work was done by four sonnet readers and merged here; I spot-checked only the `household_fortunes.js` routine claim (confirmed), so other locators are unverified and come from the private notes. Not read: Eigengrau type, ally, rival, stability and plot-hook files (a fetch was refused by the permission classifier); `relationship.py`; Lowmoor `lowmoor-boot.js`; Labor Omnia Vincit (download-only); Far Beyond The Mountain (not located); Peak Cultivator; Beggar's Life. No game code was executed and nothing was downloaded. Nothing committed.
