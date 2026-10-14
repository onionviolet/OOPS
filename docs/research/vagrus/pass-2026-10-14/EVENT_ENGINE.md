# Event engine grammar and selection

Evidence label: **SHOWN in installed code/data**, build 25598304. Private locators below are relative to `~/.codex/research/vagrus-2/extract/`. This is static reconstruction, with source-derived arithmetic probes. No game execution.

## Corpus and grammar

Reproduced `events.json` has 1,178 events, 17,223 steps and 34,323 choices, exactly matching the prior pass. Frequencies: HighPriority 823, Priority 43, Preferred 13, Common 169, Rare 102, VeryRare 28. Readiness: Ready 1,124, Final 4, Progress 17, Idea 33. Many high-priority records are direct chain parts, so 823 is not the size of a random ambient pool. Newer `build.json` graphs are a separate engine, not extra rows in this table. [Structural index](STRUCTURAL_INDEX.json).

The following is a paraphrased grammar, not copied source. Capitals in angle brackets denote classes, not literal game IDs. It summarizes the reviewed command families, not every custom command.

```text
Event  := uid title readiness frequency occurrence[] settings Step[]
Step   := uid title description Choice[]
Choice := id order description script
Script := Command* [comment]
Command := '[' Verb Argument* ']'
Reference := '{' UID '}'
Verb(event) := dependency | step | title | description | background | port
               | ambush | crewcombat | task | ...
Verb(choice) := dependency | hidden | htest | rtest | vtest | combat
                | crewcombat | exploration | next | success | fail
                | end | auto | script | heroselect | herodeselect
Predicate := [not] [or] [qualifier*] [value-or-range] Reference
             | variable-comparison | date-condition | build-or-DLC
Qualifier := visit | news | enter | leave | startcamp | endcamp
             | assign | complete | fail | deployable | on | ...
Action := destination* [action mutation*]
Mutation := add/remove/reset-character | resource-delta | status-change
            | journal-state | faction-change | variable-assignment
            | afterdays-scheduled-action | ...
Destination := step-number | event-reference [entry-step]
```

`SplitScriptToCommands` scans bracket blocks, rejects nested/opening conflicts and unmatched closing brackets, ignores text outside brackets, and stops scanning at `//`. It does not implement a general programming language. The word splitter preserves particular rich-text spans. Do not treat a regex index as parser validation. `code/Vagrus.Data/EventScriptParser.cs:312-450`.

Each dependency command gets a block index. Ordinary predicates in a block are conjunctive; OR-marked predicates require at least one success within that block. Blocks themselves must all pass. Negation flips a predicate before combination. Runtime visits block indices **0 through 32 inclusive**; the `MAX_DEPENDENCY_BLOCKS=32` name is not a reliable statement of a 32-block iteration count. Special trigger predicates are evaluated before those typed blocks and have their own OR override behavior. Reimplementing all of this as one flat AND, or assuming special OR cannot override a trigger failure, changes behavior. `GameEvent.cs:2331-2875,3256-3301`; `EventScriptParser.cs:587+`.

## Selection contract

| Stage | Exact recovered rule | Locator |
|---|---|---|
| Static index | Exclude unsatisfied non-OR static build dependencies, direct records and Test occurrence; bucket by category and occurrence, optionally by positive node/region | GameEvent.BuildCategoryTrees, lines 143-366 |
| Mixed location OR | If a positional OR group also contains another predicate type, leave it in the unrestricted bucket so location indexing cannot hide a valid non-location route | HasCrossTypeOrGroup, lines 254-306 |
| Runtime eligibility | Non-null, readiness, occurrence, category, region exclusions, trigger logic, typed dependency blocks, build mode, task gates | IsEventAllowed, lines 2060-2134; AllDependencyLogic |
| Normal roll | Test pickChance on a 1..100 roll; if it fails only HighPriority/Priority are collected | PickEvent, lines 2238-2264 |
| First picks | Uniform entry within first allowed nonempty group: HighPriority, then Priority. They bypass ordinary pickChance failure | same |
| Next pick | On a successful ordinary roll, tutorial may suppress ambient play, then Preferred wins | same, lines 2261-2269 |
| Rarity | Zero-based 0..99 roll: <=5 VeryRare, 6..30 Rare, 31..99 Common. This yields **6/25/69**, before empty-pool fallback | lines 2270-2283; Game.GetRandom/Test |
| Fallback | If rolled pool empty or filtered, try Common then Rare then VeryRare | lines 2284-2297 |
| Category competition | Priority task > priority normal > priority combat; then preferred task > preferred combat > preferred normal; then task; if normal and combat both remain, random 50/50 | Caravan.ChooseEvent, lines 7183-7240 |
| Restrictions | Story-enabled/dayeventsDisabled nodes suppress random normal events. Disabled crew combat removes combat candidate. Task/combat picks reject POI nodes | Caravan.ChooseEvent; GameEvent.PickEvent |
| Scouting | An explored cached event can be returned; only-explore cached content does not fire from ordinary entry. An explored empty result suppresses a new ordinary random pick, but permits a fresh priority pick | Caravan.PickEvent, lines 7160-7181 |

Cross-category selection checks `IsAnyPriority`, so a priority task can beat a high-priority normal event. There is no single global weighted bag over all 1,178 rows.

## Cadence and cooldown

Let `D=node event density`, `n=daysWithoutEvent`, `t=TurnNumber`. The reviewed ordinary chance range is:

```text
a = t < 300 ? clamp(t/200, 0.5, 1) : 1
min = trunc(clamp(a*D*n/10, 0, 100))
max = trunc(clamp(a*((D+n)/3)^(D/10), max(1,min), 100))
pickChance = uniform_integer_inclusive(min,max)
```

Test-scout mode overrides both to 49. Combat uses a separate density/drought formula with difficulty and learning-curve factors. Task chance includes active prepared mercenary tasks, capped at 25 percentage points, plus normal/combat ranges. `EventTweak.cs:28-119`.

Movement checks on subsequent nodes, not the initial node placement, can queue and stop for an event. Non-priority ordinary/task travel events reset the ordinary drought; non-priority combat resets combat drought. Camping uses category competition again and resets the corresponding counter for any picked event, including priority. Day advance increments drought counters. Entering a settlement performs a City/Enter pick; city story listing obtains all allowed City entries instead of picking one. These are distinct cadence paths. `Caravan.cs:7309-7332,10812+,10962-11040`.

At event, step and choice scopes separately:

```text
if maxTrigger > 0 and count >= maxTrigger: block
if dayFreq > 0 and priorTriggerExists and elapsedDays < dayFreq: block
elapsedDays == dayFreq: pass this cooldown
maxTrigger <= 0: no count ceiling from this gate
```

Ranges sample inclusive min..max. Cached nonzero values persist in the DependencyBlock object until explicitly resampled; zero is also its unsampled sentinel. Event start resamples its prefab day frequency, step entry resamples step frequency, choice execution resamples choice frequency. This is not evidence of a universal once-only system. Histories store day stamps and separate event/step/choice counts. `DependencyBlock.cs:254-271`; `GameEvent.cs:649-848,1200,1591,2331-2535`; `EventStep.cs:1660-1666`.

## State gates and closure

| Gate | Meaning actually consumed |
|---|---|
| Location | Current node/region; alternatively visited node/region, news, unrest or node condition; enter/leave/start/end-camp qualifiers are checked |
| Faction | Tier >= threshold, faction presence at current/specified/outpost node, or active task faction/opponent |
| Crew | Aggregate property thresholds and statuses; companions have roster/deployability, health and loyalty checks. `on` targets a named actor |
| Flags | Local/global variables, prior event counts, journals and objectives, tasks, achievements, codex, calling/race/ambition/background |
| Material means | Goods, equipment, gear, items, passengers and perks, with pool/stash/selected-hero variants |
| Build | Base/prologue, DLC and tester readiness can change eligibility independently of data presence |

`GameEvent.cs:2929-3040,3318-3376,3523-3600,3651+`; `DependencyBlock.cs`.

Choice execution rechecks eligibility, optionally selects heroes, registers the choice, resolves eligible step/event destinations, evaluates checks or starts combat/exploration, executes `auto` plus the chosen action, records a local step-choice counter, then transitions. Combat/exploration continue through success/fail callbacks. An `end` may start another event instead of closing the chain; an end without a destination ends immediately or waits for the action presentation to finish. Quest completion and event closure are separate authored writes. Starting a new event normally ends the current instance; calls can explicitly preserve it. `EventStep.cs:1631-1939`; `GameEvent.cs:1531-1572,1663-1794,1795-1944`.

**PROPOSAL:** YAIR should adopt the separation of eligibility, scheduling, cost and closure, with explicit receipts and saved deadlines. Do not inherit fixed first-recruitment locks, this parser's OR edge cases or Vagrus's turn clock as universal policy. Full authored stories and newer graph execution internals remain outside this digest.
