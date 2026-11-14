# Play surface: more to consider

Round 1, 2026-11-14. Weibao asked "more to consider?" on the play-surface push and the resumed foundation run. Everything here is a proposal (AD32) except ACT NOW items that were done. Codes are PS1 onward; later rounds continue them.

Evidence was read from the tree at `601cf3f8b` plus uncommitted lane files: `src/ri_wolf_tide.js`, `src/book_world_lotm_wage.js` and others.

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: n/a
tests: considerations only; bundle freshness checked by git log (dist and src last changed together at 0e242f27e)
review: none
```

## ACT NOW (done this round)

- **PS1. The committed bundle matches the source.** `dist/bundle.js` and `src/` were both last changed at `0e242f27e`, so what Weibao loads from the repo is the committed source. This is a git check; the bundle was not rebuilt and hashed. The full merge gate (one `npm test` on the combined tree) is still to run after Klein's wage loop and the wolf-parts change land.

## ACCOUNT FOR NOW

Ranked by how much each could change the work in flight.

| Code | Finding | Evidence | Constraint for the lanes |
| --- | --- | --- | --- |
| PS2 | **Three wolf models in one world.** The patrol table pays flat merit by pack size (`ri_lead_day_facts.js`, `RI_PATROL_ENCOUNTERS`). The foundation run's `ri_wolf_tide.js` now holds a creature population, with large wolves hunted out. The combat hunt sizes its own wolf (`tempo_lead_fights.js`). The Gu-keeper life has its own wolf ridge (`gu_wolf_ridge.js`). | Read in the files named. `ri_wolf_tide.js` already imports the patrol rows, so reconciling has started. | One owner: `ri_wolf_tide.js` holds the population and the parts a wolf yields. The patrol draws from it, and so does the hunt (`riWolfFoe`). The board pays for parts. Default: no other module keeps a wolf count (dial: a life in another world may keep its own; reason: two counts drift). The keeper's ridge reads the same table when both lives share the world (CTR). |
| PS3 | **Merit is still paid in four places.** Patrol rows say "50 merit on the board", the hunt after-hook pays 75 or 25, the drive-off pays 25, and the eye hand-in pays 10. Weibao's wolf-parts direction moves pay to the board. | Patrol rows in `ri_lead_day_facts.js`; the combat lane's report. | After the wolf-parts change, the alliance board is the only writer of merit. Rows and the after-hook yield parts or a witnessed credit item. A test sums the merit writers and expects one. |
| PS4 | **The day loops are click-only in an idle game.** Fang Yuan's day has no routine: feeding, drawing and patrolling are each one press. YAIR's core is letting time run. | No routine, automation or auto in `book_gu_lead_day.js`. ACR8 says a routine summary does not enable offline play by itself. | Design each lead's loop so a later "keep my day" routine can run it. Every action has a policy-readable cost and gate, which they already do. Hunger and wounds stop a routine at a decision boundary (ACR8). The routine itself is LATER (PS9). |
| PS5 | **Every lead builds its own day.** Fang Yuan's day is a pack-specific command extension, and Klein's wage is a new LOTM module (`book_world_lotm_wage.js`). Without a common shape, Harry's will be a third. | Files named. | Before Harry's loop, daily-loops writes the shared shape the three use, citing ACR and LVR: day verbs, a longer loop, gates with reasons, a result line, a routine policy hook. Harry's is built on it, and so are other lives, which carries the day across worlds. |
| PS6 | **The proof saves are private.** The journey tests for Fang Yuan's day and the wolf fight skip without private earned saves (`ri-fang-yuan-*`). The fight fixtures `lotm-tingen-day3` and `hp-exam-week` are DEV fixtures. | `ri_lead_day_journey.test.js` "skips without the private checkpoint". | The merge gate passing does not prove these loops. Each lane's receipt names its private save, and the coordinator reruns one private journey per lead before calling the push done. A committed DEV fixture for each lead's day is LATER (PS10). |
| PS7 | **Tuning moves the content hash.** Daily-loops noted that changing a dial moves the extension's hash (89803de77). OR3's build, play, adjust cycle will tune often. | 89803de77 receipt. | Default: old saves stay disposable, as Weibao set. Each lane should still say in its commit when a tune changes a pinned hash, so a "save won't load" report is traceable. |
| PS8 | **The UI pass ran mostly on the Village.** UIC180–UIC200 were seen on `perf/mid` and the Gu keeper. The leads' own screens (Tingen, Hogwarts, Fang Yuan's Beginning panel) were only touched where a lane asked. | UI ledger batches 15–17. | The foundation run's OR2 panel step and the daily loops run their Chrome check on the lead's own screen, and log UI friction they see as UIC lines in the UI ledger rather than fixing other lanes' files. |

## LATER / DELEGATE (ranked)

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| PS9 | **A "keep my day" routine for the three leads.** It repeats the day's verbs on a stated policy (feed on time, draw when the sea is under a set level, patrol when fed and unwounded), stops at decisions, and uses the existing common-actions and automation direction (CA2–CA5, 2026-11-01). | Opus, M per lead after PS5 | Ten in-game days run unattended in Chrome; the routine stops on a wound and on a wolf at the wall; Reports names what it did. |
| PS10 | **Committed DEV fixtures for each lead's day**, so the journeys run in the normal suite (AD36 item 11). | Sonnet, S | `tests/ri_lead_day_journey.test.js` runs without the private save. |
| PS11 | **The leads' own screens get the feature-ui method.** Tingen workroom, Klein's wage panel, the Hogwarts timetable, Fang Yuan's Beginning panel. | Opus (feature-ui lane), M | One ledger batch per lead with before and after seen in Chrome. |
| PS12 | **Ordinary player starts get the loops.** The loops exist on the leads' developer routes. A low-spoiler start in the same world (WER) should reach the same day verbs. | Opus, M, after PS5 | A fresh start in Gu Yue village can feed a Gu and patrol. |
| PS13 | **Hints for what is new.** Hold back, the wolf at the wall, parts hand-in and natural sea recovery each get one in-world hint the first time, in the Mixing voice (PRS9, UIC173). Not a manual. | Sonnet, S | First encounter shows one line; later ones do not. |
| PS14 | **The next worlds' fights**, from the carry-out's next-worlds table, start once the lead loops and the wolf economy settle. | Opus (combat lane), M per world | One live fight per added world, seen in Chrome. |

## Round 2, 2026-11-14

Weibao asked which everyday gameplay is in work, whether the UI improvement has come on yet, and "more to consider". Read at `3e971853c` with the [November 14 atlas](../../../reports/PROGRESS_ATLAS_2026-11-14.md) (AT7, AT38, AT40). Proposals (AD32) except the ACT NOW line.

### ACT NOW (done this round)

- **PS15. G18 has one owner.** The coordinator gave the G18 bisect to feature-ui (`3e971853c`) in the same minute Weibao asked for a dedicated chat. The dedicated session "G18: Klein's late saves stall headless Chrome" (`local_a3b034e2`) now owns it; feature-ui and the coordinator were told to hand over what they have.

### ACCOUNT FOR NOW

| Code | Finding | Evidence | Constraint for the lanes |
| --- | --- | --- | --- |
| PS16 | **The UI improvements are in the source and the headless browser, not in the app Weibao opens.** The installed app's current build is `v0.6-39a72234ba67` (Nov 10); UIC180 to UIC200, the live fights and Fang Yuan's day are all later. A push does not change that: the app adopts frozen builds. | `~/Library/Application Support/local.yairpg.tauri/builds/current.json`; atlas AT7 | The play-surface push names a frozen build from clean HEAD and its adoption as a separate step, with one native smoke in the app. Report "in source", "in the app" and "pushed" as three states. |
| PS17 | **The day strip forgets the day on reload and leaves out fights.** Its marks live in the sitting only (`src/ui/day_strip.js` "This sitting only; nothing is saved"), it skips lines labelled Combat, and a long step stamps all its lines at the step's end. A fight is now part of the day (the wolf at the wall), and the moment a player returns to an idle game is the moment the strip is empty. | `src/ui/day_strip.js` lines near `noteLine`; M2 saved log tail | Default: the strip reads the saved log tail (M2) and the fight result kept with the life, not the DOM stream, so it survives reload. Dial: hide fights per world setting. Reason: the strip exists to say what happened today. |
| PS18 | **Away time stalls a lead's day rather than ending it.** Needs never kill by default (`src/needs.js` `kills = false`), which is right, but a hungry Moonglow refuses the patrol (`book_gu_lead_day.js` line 112) and the patrol pays merit. Offline catch-up equals played ticks (TMR4), so a night away returns every Gu hungry and the patrol blocked, with no line saying so. | Files named; G3 (skipping costs nothing in the keeper life) | Daily-loops tests one 8-hour jump on Fang Yuan's day: on return the state is readable and every block names its way out (feed, then patrol). PS9's routine is the long answer; this is the check that makes it measurable. |

### LATER / DELEGATE (ranked)

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| PS19 | **A "while you were away" line.** One Reports summary on return from a jump or offline catch-up: meals missed, sea refilled, patrol nights, fights, pay. Built on the saved log tail and the day strip's model, not a new store. | Sonnet, S-M, after PS17 | After an 8-hour jump on Fang Yuan's day, one line lists what changed, and the day strip shows the same marks after reload. |
| PS20 | **A week's ledger for each lead's day.** Run `npm run check:pacing` (or a game MCP loop) over seven in-game days of Fang Yuan's day to see whether stones and merit run out, balance or pile up, before PS9 automates it. | Sonnet, S | Receipt lists income and spending per day for the week and names any day the loop blocks. |

## Round 3, 2026-11-14: how the choice shows on screen

Weibao: "more to consider? How would the choiuce be shown in ui? More to consider?". The choice here is the kill-or-spare window and the lethality that shifts mid-fight, from 1c4684a24.

Evidence is the combat lane's capture `combat/ri-fang-yuan-finish-or-spare-window.jpg`, taken at 1920×1080 on Fang Yuan's wolf hunt, and `src/combat_situation_ui.js` lines 55–93. All lines in this round are proposals (AD32, AD56).

### What the screen does now

- "Finish the lightning wolf" and "Spare the lightning wolf" are the first two tiles in a grid of fifteen. The grid looks the same as Quick strike, Heavy swing and Moonblade, which are all still offered against a body that is down.
- The question "Finish or spare?" appears in two places. One is the last line of the "Fight on until something changes" tile's text. The other is the header's "1 down at your feet". It has no line of its own.
- Neither tile says what follows. Finish says "End it." and Spare says "Leave them alive." The parts a kill yields and what a spared wolf does next are not shown.
- "Ask them not to kill" is offered against a wolf.
- The stakes line still reads "the wolf's life, and battle merit". The wolf-parts direction moves merit to the board.
- The header names the place as "Clan academy" while the fight is "beyond the wall".
- Every RI inventory row reads "0 coins".

### ACCOUNT FOR NOW: the choice as its own moment

| Code | Default | Dial, reason |
| --- | --- | --- |
| PS21 | **A decision band.** When a body goes down in a fight that can kill, a band opens above the moves: "The lightning wolf is down." Two wide buttons follow, Finish and Spare, keyed 1 and 2. The ordinary moves fold under "Other moves (n)", still reachable. | Dial: a player setting can keep the flat grid. Reason: this is the one moment the fight asks a question, so it should look like one. YAIR keeps its attack rhythm everywhere else. |
| PS22 | **Each button says what follows, as the character would know it** (PRS1). Finish: "It dies. You can take the eye, pelt and meat; the board pays for the eye." Spare: "It limps back into the trees. The woods keep one more wolf." For a person, Spare adds "They will remember this." The exact yields sit on hover. | Reason: a choice with no named consequence is a coin flip. The numbers stay one step away (UR151). |
| PS23 | **A shift in stakes is a visible event, not only a log line.** When the knife comes out, a plea is heard or restraint slips, the stakes chip changes: "Brawl · not deadly" becomes "Brawl · now deadly". One cue line says why ("The knifeman draws a knife."). The change is announced once, without a flash loop. | Reason: Weibao asked that lethality be able to change mid-fight (2c95b5a01). A change the player cannot see is not a change they can play. |
| PS24 | **Hold back shows its risk.** The tooltip, and a small note when it applies, say when restraint may slip: "Your blows run heavy for this; holding back may slip." | Reason: CBD213 slips are otherwise invisible until they happen. |
| PS25 | **A choice that cannot work says why, by mechanism** (AD38, UIC166). Against a wolf, "Ask them not to kill" reads blocked with the reason "A wolf does not bargain." It does not vanish, so the player learns the rule. | Dial: hide it per world when the reason is obvious. |
| PS26 | **The result line names the fate and what you carry.** "You finished the lightning wolf. Eye, pelt and 3 jin of meat are in your pack; the meat keeps about three days." On Spare: "The wolf limped off. 1 watch tally." | Reason: this closes G16 for fights, and it fits the wolf-part split agreed between the combat and daily-loops lanes. |
| PS27 | **Fight on can carry a standing answer.** A policy row reads "When something is down: ask me / finish / spare". The default is "ask me". A set answer lets Fight on and a later "keep my day" routine (PS9) run patrols without stopping. Persons always ask. | Dial: per kind of foe. Reason: this is an idle game. A question asked forty times a night becomes a chore. |
| PS28 | **The answer is set per world, by its frame.** Harry's duel offers no Finish by default. A downed duellist ends the duel, and Finish appears only when the stakes are deadly and the character would. Killing a person in any world feeds standing, witnesses and ties (STN, TIE), and the band says who saw. | Reason: the usual frame per world from carry-out round 2. Killing is rare at Hogwarts. |

### Also seen on that screen

| Code | Item | Owner |
| --- | --- | --- |
| PS29 | Stakes line text: "battle merit" becomes "wolf parts for the board" after the wolf-parts change. | Combat lane |
| PS30 | The fight header names "Clan academy" for a fight beyond the wall. The fight's place should be the encounter's place. | Combat lane, with daily-loops |
| PS31 | RI inventory rows all read "0 coins". A thing with no known price in this world shows no price, and the purse line says what money is here: primeval stones. | feature-ui (PS11) |
| PS32 | Move costs read "2 time", a unit the player meets nowhere else. Say it in beats with a one-line hover, or in seconds of fight time (UIC130). | Combat lane |
| PS33 | Condition shows Hypothermia at stamina efficiency ×0.1 on a Clan academy night. This could be a real cold-night effect or a stray carryover from another life. Check it before tuning. | daily-loops (Fang Yuan's day) |
