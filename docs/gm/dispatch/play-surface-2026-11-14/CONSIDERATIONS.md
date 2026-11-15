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

## Round 4, 2026-11-14: style, terms and stakes, and the original combat

Weibao: "choose before, it should be a fighting style or fighting stakes choice? Also for this, are there better way to show this in the combat system? How to make it work for like the original combat system and more?" He chose "choose before". Mock: [approach.html](../../../../prototypes/fight-intent-2026-11-14/approach.html), with `approach.png` beside it. All lines are proposals (AD32, AD56).

| Code | Default | Dial, reason |
| --- | --- | --- |
| PS34 | **Three layers, not one menu.** Stance is how you fight; the player sets it. If they go down is your terms; the player sets it. Stakes are what the fight is; the situation and the other side set them. | Reason: a style changes the numbers, terms change the outcome, and stakes describe the situation. Folded into one menu, the player could pick "duel" against a wolf. |
| PS35 | **Hold back becomes a stance, "Pulled Blows",** among YAIR's own stances in `src/combat_stances.js` (Crushing Force, Defensive Measures, Flowing Water and the rest). It has lower attack power, downs are knockouts, and a related skill makes slips (CBD213) rarer as it levels. | Reason: this is how the original already models how you fight: a stance with a trade-off, a stamina cost and a skill. The toggle on the card goes. |
| PS36 | **"If they go down" is a terms selector beside the stance selector:** Finish / Spare / Take alive / Ask me. The default comes from world and foe kind, and the player can set it once per kind of foe. Take alive appears only where the world has a means: a net, a capture Gu, a creature trainer. It ties into the creature foundation. | Dial: per foe kind and per world frame. Reason: setting it once keeps idle play idle. Take alive opens a path the original never had. |
| PS37 | **Stakes are shown, not picked.** A chip with its reasons on hover flips when a move changes it: a knife drawn, a plea. The player can still accept or refuse a duel's terms at the opener, set a wager, or escalate through a move. | Reason: the other side has a say in what a fight is (AD38). |
| PS38 | **The original auto-combat reads the same model.** A foe at zero is "down", the terms setting resolves it in one log line ("Starving wolf rat is down. You finish it. Rat tail ×1."), and the next foe steps up. With Finish set, play matches today's YAIR exactly, loot included. | Reason: "familiar" means the grind loop does not change unless the player changes a setting. |
| PS39 | **One model, two views.** The auto view (attack bars, log) is for routine fights. The card (moves, band) is for fights that matter. Both show the same approach strip, so moving from one view to the other changes nothing the player chose. | Reason: the tempo card and the original combat should not drift into two systems (PS2's lesson, applied to fights). |
| PS40 | **"Ask me" pauses the auto loop the way a low-health stop would.** A person, or stakes that shifted, also stops the loop, whatever the setting. | Reason: these are the surprises worth a stop (PS27). |

## Round 5, 2026-11-14: better types for each layer, and what else

Weibao: "more ot consider? better types and more? More to consider?". This round extends round 4's three layers.

Checked first, to avoid repeating what exists:
- YAIR's stances in `src/combat_stances.js` are Normal, Quick, Crushing Force, Defensive Measures, Broad Arc, Berserker's Stride and Flowing Water. Each changes numbers, stamina cost and target count.
- The live stakes presets in `src/tempo_kit.js` are drill, duel, brawl, hunt, robbery and skirmish.
- The fight-kind palette FK1–FK12 is in the carry-out: ambush, pursuit, capture, holding a place, battle, technique against technique, attrition, and contests that are not fights.

All lines are proposals (AD32, AD56).

### ACCOUNT FOR NOW: these change the model being built

| Code | Default | Dial, reason |
| --- | --- | --- |
| PS41 | **The other side has terms too, and the card shows what the character can tell of them.** On the foe card: "He wants your purse, not your life." "It fights to eat." "She wants you disarmed, not hurt." Hand over the purse, yield or back away become real answers. | Reason: AD38 says the other side has a say. Today the player meets a robbery's terms only in the stakes text. Seeing them turns a fight into a choice before it is a fight. What shows follows PRS1: a Seer or Spirit Vision reads more. |
| PS42 | **Your own terms when it goes badly.** One more setting on the strip: "If I'm losing: fight on / yield / break off at about a third of my health / use a last resort". The last resort is a named Gu, potion or item. | Reason: idle combat needs a stop rule the player trusts. YAIR players expect a retreat threshold. It also covers Harry yielding a duel and Klein running from a Beyonder he cannot beat. |
| PS43 | **Stakes can bind terms, and the strip says so.** An arrest needs the person taken alive. A duel's rules rule out Finish. A drill makes any kill a crime. When the player's terms clash with the stakes, the setting shows the clash and its cost ("A finish here is murder; the referee and the hall will see it") and does not silently override. | Dial: the player can still break the rules, at the cost the world charges (AD38, STN). Reason: a choice the game quietly overrides is not a choice. |
| PS44 | **Down is a state of the body, not a label.** Knocked out, wounded and helpless, yielding, bound, fled. Each state offers its own terms: take alive needs a bound or knocked-out body; a yielding foe can be questioned. | Reason: Take alive, interrogation and capture (FK7) need to know which state the body is in. It reuses the harm and body state (`harm_state.js`). |

### Better types (LATER, ranked)

| Code | Layer | Types to add | Why these | Level, done check |
| --- | --- | --- | --- | --- |
| PS45 | Stance | **Stances that change what you do beyond the numbers:**<br>• Guard someone: you take blows aimed at an ally.<br>• Go for the leader.<br>• Keep distance and kite.<br>• Grapple and pin.<br>• Disarm first.<br>• Hold the line: block a gap and keep your ground.<br>• Wear them down: a stamina war.<br>• Hit and run. | YAIR's stances change numbers and target counts. These change targeting and position, which the tempo fight already models. | Opus, M; each new stance plays differently in a seeded fight test. |
| PS46 | Stance | **Stances for each means:**<br>• a caster's stance (cast fast or with care);<br>• a Gu Master's stance (spend essence thriftily or in bursts);<br>• unarmed;<br>• shield;<br>• two weapons. | A spell or Gu fighter should not be stuck with sword stances. | Sonnet, S per stance; it shows in the strip only when its means is held. |
| PS47 | Stance | **World stances that do work beyond the fight:**<br>• Klein's Seer acting: fighting as a Seer digests his potion (acting principle).<br>• A Hogwarts duelling form: a bow, a formal guard, and points that count.<br>• A Gu formation with allies. | This is where "transfer across worlds" earns its keep: the same strip, a different world's meaning. | Opus, M per world. |
| PS48 | Terms | **More terms:**<br>• knock out and leave;<br>• disarm and let go;<br>• take their things (robbery from your side);<br>• accept a yield;<br>• question them;<br>• hand them to the authority (Nighthawks, a teacher, the clan);<br>• a mercy kill for a beast past saving;<br>• harvest (cut the Gu or the parts). | Each is a different outcome with its own consequences (STN, TIE, items). | Opus, M; each term writes its consequence and a result line. |
| PS49 | Stakes | **Stakes types FK lacks:**<br>• arrest: authority, take alive;<br>• tournament or arena: spectators, fame and yield rules;<br>• escort: keep someone alive;<br>• assassination: one blow, unseen;<br>• a riot or mob;<br>• trial by combat;<br>• a wager match. | FK1–FK12 cover how fights run. These are why a fight is held, which sets the terms (PS43). | Opus, S each as a preset row; M for arena and escort. |

### What a choice leaves behind (LATER)

| Code | Item |
| --- | --- |
| PS50 | **Your terms are remembered per foe kind in the bestiary.** YAIR already has one. The row reads "Wolf rat · your terms: Finish". |
| PS51 | **A choice has consequences beyond loot.** Kills and spares feed standing (a merciful or a ruthless name), ties (a spared man returns, grateful or vengeful), the mind (MND: Klein's acting, a first kill's weight), the world's own rules (in Harry's world killing costs more than standing) and populations (spared wolves grow wary). Each shows as one Reports line when it happens, not as a hidden meter. |
| PS52 | **A sparring partner learns your stance.** Repeated drills against the same person let them read your habit, and switching stance becomes a choice that matters. This is a small counter-play loop for training, and it uses ties. |

## Round 6, 2026-11-14: one flow, not separate panels

Weibao: "how can we make UI flow between each other rather than being its own thing? so its cohesive all together?". Mock: [flow.html](../../../../prototypes/fight-intent-2026-11-14/flow.html), with `flow.png` beside it. It shows Fang Yuan's evening after a wolf at the wall. All lines are proposals (AD32).

Why the panels feel separate today:
- Each feature is a destination with its own home.
- Its outputs stop at its own result line.
- An item says what it is, not where it can go.
- The ready actions of one feature cannot be seen from another, except the day actions on Here (a538b279e).

| Code | Default | Needs Weibao's pick? |
| --- | --- | --- |
| PS53 | **One spine in every view: where and when.** A status line holds place, time, weather, the reserve that matters in this world and the save state (direction B). Under it, the day strip shows what happened and what is due (direction F, mounted at bbab85a4a). | Yes: B and F are held directions |
| PS54 | **Nouns are links to one inspector.** An item, person, place or Gu opens the same inspector, which shows where it came from and where it can go. The where-to rows are other features' verbs, live with their gaps ("Moonglow's next step wants 3; you have 2"). | The inspector in the left column is direction A (held). The links and the where-to data can start now, opening today's detail views |
| PS55 | **Results name the next step.** A result line ends with links to the panels that use what was just gained: "Next: process at the carcass bench · hand the eye in". | No, frame-neutral |
| PS56 | **Back returns where you came from.** Navigation keeps a stack: from a fight result to the bench, then back to the fight result, not to the bench's home. | No (UR33 and the centre controller) |
| PS57 | **One hub: Here, ready now.** Each feature reports its ready and near rows through one interface, and Here lists them across features, ready first and near with the gap named. | Yes: this is direction D (held). The interface (a feature's `ready()` rows) can start now, as data |
| PS58 | **A loop map per life.** The chain (Feed → Patrol → Parts → Board → Stones → Feed) shows live counts, the node where the loop is waiting is marked, and each node opens its panel. | A new representation (UR89), so it is mocked first |
| PS59 | **A change shows wherever it matters.** Meat that is spoiling shows in Inventory, on Here and on the bench, as well as in the panel that made it. One state is read everywhere (CTR). | No |
| PS60 | **Reports lines link to their source.** Every noun and every "Next" in a Reports line is a link. | No |

Recommendation: the cohesion Weibao asks for is mostly directions A, B, D and F taken together, so this round puts them to him as one package. PS55, PS56, PS59, PS60, PS54's links and data, and PS57's interface fit today's frame and can start now.

## Round 7, 2026-11-15: the Village shell leaks into other worlds, and the lanes trip over each other

Weibao: "more to consider?". Evidence: the PS33 trace from daily-loops, and the opener and fight captures on Fang Yuan's life (`combat/approach-opener.jpg`, `combat/ri-fang-yuan-finish-or-spare-window.jpg`). The coordination record is in this folder's CHECKPOINT. All lines are proposals (AD32).

### ACCOUNT FOR NOW

| Code | Finding | Evidence | Default |
| --- | --- | --- | --- |
| PS61 | **The Village shell runs in every world.** Fang Yuan's capture shows Village systems running in his life: native Winter cold at the academy (PS33); "Calendar unknown here"; "Hero · Lv 0 · 0/10 xp", Village STR, AGL and Hero XP in the left column; "102 coins (denominations unfamiliar)"; every item at "0 coins". The leads' own progressions (Gu rank, aperture, essence; Klein's sequence; Harry's year) are not what the frame shows. | The two captures above; `main.js` adds the cold conditions from the native calendar. | One inventory, per world, of every native system the shell runs (weather, cold, calendar, hero level and XP, attributes, coins, hunger, Village quests, skills), each with its route: the world's own, shared, or hidden. Then the status line (B) and the left column (A) read the world's own progression and reserve. This is the "carry it across worlds" work for the frame itself. |
| PS62 | **One G-code, two fixers.** G18 got a dedicated session from the progress-atlas chat while feature-ui had already begun the bisect, and both prepared a fix to the same LOTM files. | Session transcripts, 2026-11-15. | Before a chat fixes a coded finding (G, PS, UIC), it reads that code's owner row in this CHECKPOINT and adds itself if the row is empty. Chats started outside this coordination register there too. |
| PS63 | **The machine-wide test slot is the real bottleneck.** Six suites queued, one hung for 1h34m, and lanes waited hours to commit. The coordinator stopped a hung run that belonged to another lane. | CHECKPOINT log, 00:15 UTC. | A per-file timeout on the suite command (proposal, held for the test-runner owner). Lanes run `test:changed` and their focused files and leave full suites to one merge gate per batch (AD36). A stop of someone else's run is logged with its PIDs. |
| PS64 | **The app lags the work.** The installed app was frozen at 817cff0eb (v0.6-63fd12a38b31). Since then: the approach strip, wolf parts, the decision band and the cold fix (in flight). | 51aa8a373, later commits. | Re-adopt the app once at the end of this push, after the full gate, so what Weibao opens matches what the reports say. |

### LATER

| Code | Item | Level, done check |
| --- | --- | --- |
| PS65 | **The left column per world.** Fang Yuan's left column shows his aperture, essence sea, Gu rank and his Gu, not Village STR and Hero XP; Klein's shows his sequence, digestion and spirituality; Harry's shows his year, house points and wand. The Village keeps its own. Built on A (the thing on the left) and PS61's routes. | Opus (ui-cohesion), M per world. Done: each lead's left column reads its world, seen in Chrome. |
| PS66 | **A coordinator handoff block.** This coordinating chat's context is filling. CHECKPOINT holds lanes, owners, delivered work, the log and what waits on Weibao, so a fresh coordinator resumes from it. | Done when a fresh chat can resume from CHECKPOINT alone. |

## Round 8, 2026-11-15: what the split duplicates

Weibao: "does the ui split duplicate anything? more to consider? it feels like the center bottom tile has room to condense one more tile there but there might be no need". Evidence: home baseline `tests/fixtures/visual/home.png` at 126de3278. Proposals (AD32), sent to ui-cohesion.

| Code | Duplicate | Default |
| --- | --- | --- |
| PS67 | Around you's ways out and people are repeated by the bottom list's "Move somewhere else" and "Talk to someone". | Retire the generic action list (UIC127 proper). |
| PS68 | One bench has three ways in: a station row, "Try to craft something" and the bottom tabs. | Keep one route, chosen with check:flow's `dupway` evidence. |
| PS69 | Place and time are said by the status line and again by the bottom panel's "Village" header and its daylight line. | Default: B carries them and the bottom header goes (dial: a world may keep a scene line there; reason: one place to read the time). |
| PS70 | The quest shows in the Journal box, the Journal tab and Reports' "Next step". | The Journal box is the quest view; "Next step" links into it. |
| PS71 | The empty bottom-left. | Not a new tile: "Ready now" (D) takes the space, led by the next step. Verbs with no other home (Find work, Train, Cross) join Around you or Ready now. |

## Round 9, 2026-11-15: representations, chosen by the question

Weibao: "more to consider? HOw to ficx? other aspects to consider? what representations can we use? we dont need to be limited by what we have right now, and then we can have better representation if we need it?". The rules already allow any form (UR89–UR99: canvas, graph, tree, map, timeline, forms that follow the mechanism, cheap SVG and glyph materials first). What is missing is the choice, made per question, and a shared set of forms. All lines are proposals (AD32, AD56).

### How to fix: one rule and two owners

- **PS72. Each panel answers one player question, and its form is picked for that question.** Rows stay the default for a list of choices. A different form earns its place when it answers its question faster than text. A prose-first reading (2026-11-04) still leads narration.
- **PS73. A shared form library (UR98, level 3), owned by ui-cohesion.** Feature lanes and worlds use the forms and dress them. Default: each form reads the owner's data rather than a hand-written copy (UR93; reason: a copy drifts). Each has a text fallback and a keyboard route. Each is cheap SVG within the 8 GB target.
- **PS74. A representation pass per feature,** with prototype-to-decision: mock two forms on the real save, keep the one that answers faster, and name the one rejected.

### Palette: question → form

| Code | Player's question | Form | First users |
| --- | --- | --- | --- |
| PS75 | When does it happen? | **Timelines:** the day strip (built); a week strip with recurring clocks (Gu meals, rent day, classes); countdown rings on items that spoil or work that is running | Fang Yuan's Gu meals, Klein's pay and rent, Harry's timetable, spoilage |
| PS76 | Where is it, and how far? | **Place map:** Around you as a small node map, with exits as edges labelled with travel time and danger; a schematic per site (the outer wall with its watch posts; Tingen's streets) | Around you, patrols, travel, Tingen |
| PS77 | How much is left, and how fast does it come back? | **Reserve gauges with rate and runway:** an essence sea with a refill tick; stones against daily upkeep ("runway: 4 days"); spirituality; stamina | Fang Yuan's left column (PS65), Klein, the status line (B) |
| PS78 | How does this work? | **Mechanism forms (UR93):** a refinement as a chain of steps with the will and imprints; a potion as stages; a craft as inputs flowing to outputs; a ritual as its parts | Gu refinement (b7c8a2836), mixing, crafting, Klein's rituals |
| PS79 | How far along am I? | **Ladders and trees (UR90):** Sequence 9 to 0 with digestion; Gu rank and aperture grade; Hogwarts years and exams; skill trees with the real gates drawn | Each lead's progression |
| PS80 | Who matters to me? | **A relationship web:** people as cards, ties drawn as lines with their kind and strength, and recent changes marked | Klein's Tarot Club and Nighthawks, Harry's friends, Fang Yuan's clan |
| PS81 | What happens next in this fight? | **A turn track:** an initiative bar of who acts next, as marks with beats instead of "Who acts next: You → wolf"; a range band (far, near, grappling); the stakes chip | The fight card |
| PS82 | What is going on, and what do I know? | **A case board:** clues as cards with their source and freshness (UR85), and links between them | Klein's investigations, inquiries |
| PS83 | What happened while I was away? | **A recap card:** one summary on return, saying what was eaten, earned, spoiled and missed, with links (UR91) | Offline catch-up, banked time |
| PS84 | Am I hurt, and where? | **A body chart:** wounds and conditions on a figure, with each remedy beside it | Condition, fights, Fang Yuan's wound |
| PS85 | Is it worth it? | **Price over days:** a small line of prices at the board or shop, and the regional price memory | The shop, the alliance board, wolf parts |

### Other aspects

- **PS86. Dress each world.** One grammar with different materials: Gu in jade, moonlight and ink; LOTM in brass, fog and paper; Hogwarts in parchment and house colours. A world changes the dress, not the controls (UR94, AD39 look).
- **PS87. A form is only as good as its data.** Before a form ships, the data it draws must have one owner (the lesson from PS2 and PS61). A pretty map over a duplicated count is worse than a list.
- **PS88. Order the work by question, not by feature.** The first forms are the ones the most screens need: the reserve gauge (PS77) for B and the per-world left column; the place map (PS76) for "This place"; the turn track (PS81) for the fight card. The rest follow per feature.

## Round 10, 2026-11-15: attention, first minutes, guards and the landing

Weibao: "more to consider?". These angles were not covered by rounds 1 to 9. Proposals (AD32).

### ACCOUNT FOR NOW

| Code | Finding | Default |
| --- | --- | --- |
| PS89 | **Attention is now spent in five places.** The status line, the day strip, Ready now, cues and Reports all ask for the eye, and the fight band and the "ask me" stops add more. Without tiers, everything shouts. | Adopt UR88's notice tiers, held for Weibao. Only a stop-list item interrupts: a choice that needs the player, a known event, a lethal edge, or an exhausted supply. Everything else is a log line, a dot on its home or a recap line, and repeats group with a count. The player can raise or lower any kind. This is the piece that keeps D and the stops calm. |
| PS90 | **The visual guards only cover the Village.** The five baselines (home, crafting, inventory, journal, stats) are all native, and the frame changes now land on the leads' screens too. | Add baselines for Fang Yuan's day and Klein's Tingen at 1920×1080 (owner: ui-cohesion), so a frame change cannot quietly break a lead's screen. |
| PS91 | **No full gate has run on the combined tree since the push began.** Lanes run `test:changed`. Two runs were killed or hung, and `main.js` was briefly emptied. | Before calling the push done: one full `npm test`, `check:flow`, `check:visual`, and the three lead journeys on their private saves (PS6). Then re-adopt the app (PS64). The coordinator runs it once the lanes go quiet. |
| PS92 | **The coordinator is near its context limit.** | Hand off to a fresh coordinator from CHECKPOINT and CONSIDERATIONS (PS66) before compaction, not after. |

### LATER

| Code | Item |
| --- | --- |
| PS93 | **Keys for an idle game.** Ready-now rows take 1 to 9, the fight's terms keep their keys, and focus order gets its own walk (round 51 could not establish it). |
| PS94 | **The first five minutes of each life.** `npm run check:openings` (OPN) runs on Fang Yuan's, Klein's and Harry's opening screens after the frame changes, and checks whether a new player can tell what to do. |
| PS95 | **Save growth over long play.** Wolf populations, kill records, fight records and aspect histories (UR92) all grow. Measure save size after 100 in-game days on one lead against the 8 GB target, and cap or compact histories before they bloat. |
| PS96 | **A density setting.** A compact or comfortable choice for the panels, once A, B, D and F settle, since the split adds frames. |

## Round 11, 2026-11-15: what stays on every page, and the empty half of Crafting

Weibao picked stacked panels and said two things after seeing the built Crafting page ([log](../../USER_VISION_LOG_2026-11.md#stacked-panels-picked-some-info-on-every-page-2026-11-15)): some information belongs on every page, and Crafting leaves too much empty space. Read from his capture of the Crafting tab at 1920×1080: Ready now (3 rows), the recipe list (16 rows), and This place folded at the bottom. The list ends about halfway down a panel that stretches to fill the column.

### ACT NOW

| Code | Finding | Proposal (default, dial, reason) |
| --- | --- | --- |
| PS97 | **Stacked panels are picked.** Ready now, Doing now, This place and Story, each with a header and its own bounded scroll. | ui-cohesion builds the rest of the split: Doing now, then Ready above This place. Feature panels keep their content owners. |
| PS98 | **A pinned band: what every page shows.** Today, the status line and day strip (B, F) persist, and This place persists as a folded bar. Ready now persists on some pages and hides on others. | Default: every page shows the status line (place, time, essence or vitals, saved), the day strip, a one-line Ready now (its count and the first item, expandable), Doing now when something is running, and This place folded. The feature panel gets the rest. Dial: the player pins or unpins any band. Reason: what the life needs next and what it is doing should not vanish when you open a tab. |
| PS99 | **Panels stretch to fill the column, so a short list leaves a large empty box.** Crafting's list ends about halfway down its frame. | Default: a panel sizes to its content, up to a cap. Leftover height goes to a detail pane or to the next panel, never to an empty frame. Reason: an empty bordered box reads as missing content. |
| PS100 | **Crafting uses its empty half for the selected recipe.** It has no detail view today: a row says "1 material short" but not which material. | Default: list on the left, the selected recipe on the right (or below on a narrow screen). The detail shows each input as have/need with where to get it (inspector links, A), the output, its time and use, then Make. The first row is selected on open. Reason: the question at a bench is "what can I make, and what am I missing", which the empty space can answer. |

### ACCOUNT FOR NOW

| Code | Finding | Proposal |
| --- | --- | --- |
| PS101 | **Short rows do not name the material.** "1 material short" and "2 of 2 materials short" make you open a recipe to learn anything. | Name it in the row when it is one item ("needs 1 sinew"). Rows that lack everything fold into "Far off (6)". Group the list as Ready, One short and Far off. |
| PS102 | **Ready now repeats Crafting's list on the Crafting page.** Make Bonemeal shows in both, with the same "needs 20 animal tooth". | On a feature page the pinned Ready band leaves out rows from that same feature, or marks them "here". This matches ui-cohesion's hiding rule, now kept as a one-line band. |
| PS103 | **The list rows have no state color.** Every row reads alike, and "needs 20" is gold only in Ready now. | Use one status vocabulary on every page: ready, one short, far off, blocked with a reason. Same color and words in Ready now, the lists and the inspector. |
| PS104 | **The Reports column on the right is cut off in this capture.** | Check that the right column keeps its width at 1920×1080 once the pinned band lands; the walk scripts cover it. |

### LATER

| Code | Item |
| --- | --- |
| PS105 | **The same list-plus-detail for Mixing, Skills and the Gu house.** Any list page whose rows hide their key fact gets the PS100 detail pane once Crafting proves it. |
| PS106 | **Pin from the inspector.** "Watch this" on an item or recipe puts it in the pinned band, for example "wolf eyes 2/3". |

## Round 12, 2026-11-15: the folded rows under Actions

Weibao, with a capture of the Village's Here: "Sbhould these alwyas be below the actions panel? should we adjust that? Move them else where? section off seperately?" ([log](../../USER_VISION_LOG_2026-11.md#the-folded-rows-under-actions-2026-11-15)). The capture shows seven folded rows under the action list, then empty frame:
- Cross to another world: Tingen
- Optional pacing
- Equipment condition and repair
- Iona's work ledger · systems and workshop (54 of 54 ready)
- Local life (0 of 6 ready)
- Village practice and familiar ground (0 of 2 ready)
- Furniture and home comforts (1 of 1 ready)

Each module appends its own `<details>` under Here (`src/main.js:1280`, `:1412`, `src/book_world_lotm_ui.js:128`, `src/home_furniture_panel.js`, `src/absorb_p23/host_joins/tranche_four_ui.js`, `src/systems_workshop_ui.js`). Nothing decides where a kind of thing lives, so they pile up at the bottom in load order.

### ACT NOW

| Code | Finding | Proposal (default, dial, reason) |
| --- | --- | --- |
| PS107 | **Seven different kinds of thing share one pile.** A crossing, a setting, a gear feature, a project ledger, two activity groups and a home feature. | Default: each row goes to the home of its kind. Things to do now stay in Actions as category chips at the top (like Crafting's skill row): Local life, Village practice. A way to another world joins This place's ways out. Settings (Optional pacing) go to Options. Features with their own screen (Equipment, Furniture and home, Iona's ledger) become a tab or a place station, and their ready rows feed Ready now. Dial: the player can pin any of them into the band (PS98). Reason: the question "what can I do here" should not end in a settings switch and a world door. |
| PS108 | **A registry, not appends.** Modules insert their own panels under Here. | Default: a panel declares its kind (act, place, setting, feature, project) and the frame places it (UR144, AR3). New modules cannot append under Here directly; the UI contract test catches it. |
| PS109 | **Counts that say nothing.** "54 of 54 ready" and "0 of 6 ready" both mean "nothing to decide". | Default: a ready count shows only when it asks something of the player. Ready rows go to Ready now under UR88's tiers. A group with nothing ready shows what opens it ("needs Bone tools") or folds. |

### ACCOUNT FOR NOW

| Code | Finding | Proposal |
| --- | --- | --- |
| PS110 | **Per world.** Fang Yuan and Klein get other rows (Cross to Tingen appears from the Village). | The kind registry is per world. A row with no meaning in a world hides there (PS61, PS65). |
| PS111 | **Iona's ledger is a development surface.** "Systems and workshop" with 54 entries reads like a tool. | Default: it moves to a Workshop tab or the Notebook, out of Here. Weibao names it if it should be in play. |

## Round 13, 2026-11-15: sectioning by question, read from the Village home at 4ba128ba3

Weibao: "how else can we section better? WHat would make most sense and be most optimal?" Read from `tests/fixtures/visual/home.png` (1920×1080, HEAD 4ba128ba3).

### What the screen does now

- **Seventeen top tabs in one flat bar** (Stats … Capability runs, plus All panels). Player pages, records and development tools sit side by side.
- **Three tab levels at once:** the top bar, the centre's Here / Crafting / Mixing / Keys, and the action panel's Actions / Home / Options. Keys is a setting at the same level as Crafting.
- **Actions repeats Around you.**
  - "Go to Wild willow stand" and "Enter the Infested field" repeat Ways out.
  - "Try to craft something" repeats Crafting stations and the Crafting tab.
  - "Talk to someone" repeats People here.
- **Goals are split.** Reports' "Right now" holds the next step, while the Journal's quests sit in the centre's bottom right, inside the action panel.
- **Condition shows twice:** the top tab and the left panel. The left panel's empty body takes about 200 px.

### ACT NOW (proposals)

| Code | Finding | Proposal (default, dial, reason) |
| --- | --- | --- |
| PS112 | **Section by the player's question, one region per question.** | Default regions: left "Who am I" (you, condition, gear, inventory); centre top "Now" (Ready now, Doing now); centre middle "Here" (people, stations, ways out, each a card that carries its own verbs); centre bottom the open workspace (Here's leftover verbs, Crafting, Mixing); right "Why and what happened" (goals, then Reports). Dial: the Pin menu (PS98) and panel kinds (PS108) place anything else. Reason: each region answers one question, so the eye knows where to look. |
| PS113 | **Verbs live on their nouns.** | Default: clicking Old Hesk offers Talk, a way out offers Go with its time and danger, and a station opens its workspace. The action list keeps only verbs with no noun on screen (Find work, Train) plus the activity chips. "Move somewhere else", "Try to craft something" and "Talk to someone" go. Reason: one route per thing (PS67–PS70). |
| PS114 | **One goals column.** | Default: the Journal's quests move to the right column above Reports, under one "Goals" header, so the next step and the quest list sit together. Reports keeps the log. |
| PS115 | **One tab level for play.** | Default: the centre's workspace tabs (Here, Crafting, Mixing, then each world's own) are the only play tabs. Keys and Options move to Menu. Actions / Home / Options inside the panel fold into the workspace. |
| PS116 | **Top bar grouped into five families with menus.** | Default: You (Stats, Condition, Knows, Beginning), Things (Inventory, Ledger, Projects), People (People, Travelers, Organizations), World (Worlds, Journal, Notebook), Tools (Data, Capability runs, All panels: development and records). Each family opens a menu; the five labels fit in one short bar. Dial: a player can pin a page as its own tab. |

### ACCOUNT FOR NOW

| Code | Finding | Proposal |
| --- | --- | --- |
| PS117 | **Empty bodies take space.** The Condition panel with no effects, the empty band above the action chips. | A panel with nothing in it folds to its header line (PS99). |
| PS118 | **Per world.** Fang Yuan's and Klein's lives keep the same regions with their own nouns (Gu house, the board, the Tingen streets). | The regions are fixed and the contents per world, so a player who learns one life can read the others (familiar, as Weibao asked for combat). |

## Round 14, 2026-11-15: back to YAIR's groupings, in depth

Weibao on the round 13 mock: "meh, look at how yair does it, and the groupings, consider in depth accordingly?" ([log](../../USER_VISION_LOG_2026-11.md#back-to-yairs-groupings-2026-11-15)). Sources:
- upstream `index.html` and `src/display.js` at `upstream/master` (v0.5.5.30);
- the native capture `docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r7/user-native-yair.png`;
- our own YAIR-faithful frame of 2026-10-14, `docs/gm/dispatch/absorb-all-2026-10-14/checks/upstream-dev-town.png`.

### How YAIR groups the screen

| Column | Question | Boxes, top to bottom | Switching |
| --- | --- | --- | --- |
| 1 | Who am I and what do I carry | Vitals (name, xp, stamina, mana, hp); character (Stats, Bio, Equipment, Tools); Inventory or Combat view | tabs inside each box |
| 2 | Where am I and what do I do | time and temperature strip; location (name, description, open or cleared); actions, or the combat box in a fight; crafting replaces the actions box | the box changes in place |
| 3 | What am I working toward and what do I know | Journal (Quests, Bestiary, Anthology, Data); Skills (Skills, Stances, Magic, with sorts) | tabs inside each box |
| 4 | What happened | message log, newest last, with filter tabs (Levels and unlocks, Events, Crafting, Combat, Loot) | tabs at the box's foot |

- **There is no top tab bar.** Everything sits in one fixed screen. Save, Export, Import and Options are a small footer.
- **Actions are grouped by verb, not by noun.** One box holds fixed, iconed verbs in a set order: Move somewhere else, Fast travel, Crafting, Sleep, Storage, Talk to someone, Visit a merchant, Find work, Train, Gather resources, Take an action, Take on a challenge. Each verb opens a dropdown of its targets (`display.js` 2058–2217). The location box holds the place's name and description and nothing else by default.
- **A mode replaces a box instead of adding a page.** A fight takes the location column's middle, and crafting takes the actions box. Back returns the box.

### Where we drifted, and why round 13 felt off

- **Round 13 moved verbs onto noun cards, which is the opposite of YAIR.** Its verb list is the familiar thing.
- **We grew a 17-tab top bar.** YAIR has none, so a page there is a tab inside one of four boxes.
- **Column 3 dissolved.** YAIR keeps quests and skills side by side in the third column. We moved skills to a centre tab and squeezed the Journal into the action panel.
- **Here grew a noun panel (Around you) beside the verb list.** That makes two routes to every person and way out (PS67–PS70).

### ACT NOW (proposals; supersede PS112, PS113 and PS116)

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS119 | **YAIR's four columns are the spine.** Default: 1 You (vitals, character tabs, Inventory or Combat), 2 Place and action (status strip, location, the actions box, which modes replace in place), 3 Progress and knowledge (Journal box and Skills box), 4 Reports. Every feature finds a box and becomes a tab inside it, never a new top tab. Dial: Layout keeps custom arrangements (it exists today). Reason: the original's shape is the familiar one Weibao asked for. |
| PS120 | **Actions by verb, in YAIR's order and icons.** New verbs join the list as verbs with their own icon, placed by kind: Feed (Gu), Patrol, Refine, Hand in (board), Study, Practise (jinx). Each verb opens its targets. "Around you" folds into the location box as one line ("2 people · 6 stations · 3 ways out", each a link that opens the matching verb). Ready now marks verbs instead of repeating them: "Talk to someone · 1 new", "Crafting · 2 close". |
| PS121 | **Modes replace boxes.** A fight takes column 2's middle (the fight card and the auto view, with the approach strip on top). Crafting, Mixing, Gu refining and a bench replace the actions box, with Back. Doing now is the actions box's head while work runs, as YAIR shows a running job. The Here, Crafting, Mixing and Keys tabs go. |
| PS122 | **Column 3 returns.** The Journal box gets the tabs Quests, Bestiary, Anthology, Data, then ours: Knows, Notebook, People (People, Travelers, Organizations), Worlds, Beginning. The Skills box gets Skills, Stances, Magic, plus each world's powers as a tab (Gu, Spells, Beyonder). |
| PS123 | **The top bar goes.** Save, Export, Import, Options and Menu return to the footer, as in YAIR. Development pages (Data, Capability runs, All panels, Projects, Ledger) go behind Menu → Tools. The status line merges into column 2's time strip, and the day strip sits under it. |
| PS124 | **Reports keeps YAIR's footer filters.** The next step ("Right now") stays at the head of Reports, and the filters add Ready and Story. |

### ACCOUNT FOR NOW

| Code | Proposal |
| --- | --- |
| PS125 | **Mapping table for the build.** Each of today's 17 top tabs and Here's panels names its box and tab, and Ledger, Projects and Capability runs go to Tools. A page with no box is a finding, not a new tab. |
| PS126 | **Keep what round 11 and 12 earned, inside the boxes.** Stacked headers become YAIR box headers. The pinned band becomes the column 2 strip. Panel kinds (PS108) now place a panel into a box and tab. Crafting's detail pane lives inside the replaced actions box. |
| PS127 | **Per world.** The same four columns everywhere. Fang Yuan's verbs (Feed, Patrol, Refine, Hand in) sit in the actions box, his Gu in the Skills box, and the board in the Journal's Data tab or as a verb target. |
| PS128 | **1920×1080 check.** YAIR's four columns sized for 1366 wide. At 1920 the extra width goes to columns 2 and 3, and nothing scrolls the page. |

## Round 15, 2026-11-15: fleshing round 14 out, subtle details, and what the YAIR Discord adds

Weibao on the round 14 mock: "I likethis, the mock will need more work to be as fleshed out as 'today', some design detils coule be, unknown numbers can be represented as question marks ⏎ Lots of other subtle UI considerations? ⏎ What about from the discord research that we can incorporate at the same time?" ([log](../../USER_VISION_LOG_2026-11.md#round-14-liked-flesh-it-out-2026-11-15)). The Discord source is [YAIR developer media research](../../../research/yair-upstream/DISCORD_RESEARCH_2026-10-20.md) (F5–F34, P5–P17, DC1–DC5); those codes are cited as they stand there.

### ACT NOW: the build carries everything today shows

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS129 | **Nothing is lost in the move.** Default: every row, count, tooltip, link and control that today's screens show lands in a round 14 box (PS125 table as the checklist). The walk scripts and `check:visual -- --lives` run before and after. A capability that the mock trimmed is a finding. Reason: Weibao noted the mock is thinner than today. |
| PS130 | **Unknown numbers read "?".** Default: a value the character does not know shows "?" ("Atk ? · Spd ? · ?/? hp"). A partly known value shows its range or estimate ("~12", "10–14") at the knowledge level the life has (KNW). A known value shows plain. One renderer handles all three, used by fighters, prices, chances and people. Dial: a cheat or skill raises the level. Reason: YAIR shows "???" for an unknown title; our fights and prices already carry knowledge levels. |

### ACCOUNT FOR NOW: subtle details

| Code | Detail | Default |
| --- | --- | --- |
| PS131 | Verbs keep their places | A verb with nothing to do stays in its slot, dimmed, with its reason. Rows do not jump when one opens, and each box remembers which verbs are open per place (F29, P16). |
| PS132 | Numbers line up | Tabular figures, right-aligned number columns, one unit style (the purse's C/W, the world's own coin), and "×3" counts, not "x3". |
| PS133 | Bars and coloured text stay legible | Text on bars and rarity colours gets a contrast outline (F11). By default, state is shown by word and colour together, so colour-blind reading works (PS103 tokens). |
| PS134 | Tooltips hold still | By default, tooltips size to their content up to a cap, sit clear of the pointer and the control, and stay put while their numbers tick, because a moving tooltip cannot be read (F12, F33). |
| PS135 | One sky signal | Day or night, weather and season read as one strip element: an icon, a word on hover and the temperature (F13). |
| PS136 | Controls only with behaviour | A button exists only when clicking it does something now, or it carries its reason (F14). |
| PS137 | Box tabs remember | Each box keeps its last tab per world and per life, so switching lives does not reset the Journal or the Skills box. |
| PS138 | Empty says what fills it | An empty box or tab names what would fill it ("No quests yet. Old Hesk may have one."). |
| PS139 | No layout shift | Live numbers and running jobs update in place. By default, a new row goes at the end or into a reserved slot, below the reader's eye, because a jump above it loses their place (UR144). |
| PS140 | Keys | Number keys for the verbs in order, with Escape as Back from a replaced box (PS93). |

### ACCOUNT FOR NOW: from the YAIR Discord (sources in the research doc)

| Code | Source | Default in round 14's boxes |
| --- | --- | --- |
| PS141 | F18, P5 | A long job states its interruption outcome before you start ("Stop keeps finished batches; the current one is lost"), in the actions box head and the verb's tooltip. |
| PS142 | F19, P6 | Gathering and other repeats give time, chance and yield separate jobs: "every 6 min · 40% · 1–2 herbs", with real time second and qualified. |
| PS143 | F20, P7 | The location box's description changes with what happened there (a cleared field, a wall after the wolf tide). |
| PS144 | F21, P8, P11 | Crafting shows how many of the output you own. A missing input opens its producer in the inspector, and Back returns you to the recipe. |
| PS145 | F25, P10 | A batch that will stop at a material boundary says so before you start ("makes 3, then runs out of sinew"). |
| PS146 | F29, P12, P13 | The Skills box gets a stable "Learning now" view beside the full list, and says why a chosen practice is not happening. |
| PS147 | F32, P16 | In a fight, the controls hold still while fighters join or fall; inspecting a fighter and leaving are separate controls. |
| PS148 | F7 | Gear shows deltas against what you wear, with multipliers as multipliers. |
| PS149 | F6 | Reports group repeated rewards into one summary line with a count, consistent with UR88, and keep their order. |
| PS150 | F31, P15 | A pursuit shows evidence that it is still promising (a lead, a rumour) without showing its payoff. |

### LATER

| Code | Item |
| --- | --- |
| PS151 | F17: a map travel selector, once places generate maps (SR rules); it is not a round 14 requirement. |
| PS152 | F27, P14: compare an assembled item by its useful results; it goes with making systems (MR). |

## Round 16, 2026-11-15: feel and finish, the Discord features, and UI for what has none

Weibao: "Consider the new features discussed in the Discourd findings too, consider details like glow on items and more? subtle aspects like that? MOre to consider? We can send something to work on the prior part, ant then also work on the subtle details? And another for Ui drafting and cohesion for future capabilities or existing capabiltieis lacking those and more?" ([log](../../USER_VISION_LOG_2026-11.md#feel-and-finish-discord-features-and-ui-drafting-lanes-2026-11-15))

### Feel and finish (proposals; polish lane)

YAIR's own options (`upstream/master:index.html`) show what its players tuned: bar outlines, tooltip outlines, uniform text size, background animations, a background colour that follows the time of day, enemy on-hit animations, a dynamic loot message, an exp-display threshold, a temperature scale, and favourite items (`character_item_faved`, `item_fav_div`).

| Code | Detail | Default (dial in Options) |
| --- | --- | --- |
| PS153 | **Item glow by meaning.** | Rarity or quality as a coloured name with a soft edge glow; a new item pulses once and keeps a dot until hovered; equipped and favourited items get a mark (☆ as in YAIR). A glow means one thing per world, with no decoration for its own sake. |
| PS154 | **Ready glow.** | A verb, station or row that is ready gets the gold edge (PS103 ready token) and a slow single pulse when it becomes ready; near gets a dashed edge. |
| PS155 | **Motion that explains.** | Bars ease to their new value. A gained number ticks up briefly. Damage and loot float off their source in a fight. An enemy hit flashes (YAIR's on-hit option). All of it is reducible: Options has "reduce motion", and the OS setting is honoured. |
| PS156 | **Time-of-day light.** | The page background follows the hour and weather (YAIR's light-based background), dimmed by an option. |
| PS157 | **Pressed, hover and focus states.** | Every control shows hover, pressed and keyboard focus the same way; disabled controls show their reason on hover. |
| PS158 | **Sound hooks.** | YAIR has BGM in Reports' filters. A quiet cue for ready, level-up and a fight's end is proposed, off by default. |
| PS159 | **Display options from YAIR.** | Text outlines, uniform text size, the temperature scale, an exp threshold and "don't auto-switch to combat" carry over into Options. |

### Discord features beyond the UI (proposals; Discord-features lane)

Sources are the [YAIR developer media research](../../../research/yair-upstream/DISCORD_RESEARCH_2026-10-20.md).

| Code | Source | Feature |
| --- | --- | --- |
| PS160 | F5 | Clear bonuses: clearing a place can roll a bonus reward, nested by chance and shown as such. |
| PS161 | F8 | Conditional trader stock: a cleared hideout or a world event changes what a trader sells. |
| PS162 | F15 | Inventory stacking by identity and quality, with redundant saved data dropped (save size, PS95). |
| PS163 | F16 | Equipment from components: the assembled item's results compared by its useful dimensions (P14). |
| PS164 | F17 | A travel map for places with known positions; generated maps later. |
| PS165 | F22, F9 | Substitutes by property: a recipe takes any input with the property it uses, and the item keeps its own identity and price. |
| PS166 | F23, F31 | Reward rates explained by their causes, without spoiling the payoff. |
| PS167 | F26, P11 | Ingredient chains navigable from the recipe: follow a missing input to its producer and back. |
| PS168 | F30, F34 | A fight setup good for winning but poor for practice says so, with the cause; a broad attack shows how it scales. |

### UI for capabilities that have none (proposals; UI-drafting lane)

| Code | Proposal |
| --- | --- |
| PS169 | **A coverage pass:** list each capability in the progress atlas and each runtime module with player-facing state but no surface, or a surface outside round 14's boxes. Rank them by what a lead's life touches first. |
| PS170 | **Draft each in round 14's grammar:** which box and tab, which verb, what the Ready mark says, which numbers are known, estimated or "?", and the empty state. Mock at 1920×1080 beside the closest existing screen; build only after Weibao looks, in batches. |
| PS171 | **A UI kit page:** one page that shows every shared form (box, tab, verb row, Ready mark, "?" number, state token, glow, tooltip, empty state), so new features draw from it and stay cohesive. |

## Round 17, 2026-11-15: areas inside a place, gates, movable boxes, and the effects no clip showed

Weibao, after round 14 slice 1 and the Discord top 10 ([log](../../USER_VISION_LOG_2026-11.md#areas-inside-places-and-movable-boxes-2026-11-15)), and his answers to four questions:
- **Grain:** areas per place, "and maybe it changes when I enter a certain place? How to decide what it shows once inside, and more? How to prevent needing to click too much? Would the chain of 'areas' Kind of create a map?"
- **Cost:** "Keep time as a future possibility considering how its currently implemented, but free with spots gated is good but needs deeper consideration for all the possibilities".
- **Showing it:** "verb list seems to be the best but the best way to represent there? would we put arrows on the sides?"
- **Columns:** "Drag any box, consider long term and modular archetecture and more?"

He also liked the Discord top 10, asked to consider the effects no clip showed, and asked for a deeper pass on the unsampled stills (running; it extends DU38 onward).

### Existing owners to build on (not new systems)

- **Foot legs between spots:** `src/travel_legs.js` (`defineRoute`, `quoteRoute`, `settleRoute`; legs carry `minutes`, `fare`, `restrictions`). Tingen's districts already use it (`src/book_world_lotm_districts.js`, `lotmWalkMinutes`).
- **Rooms inside a home:** `registerHomeWorld({rooms})` in `home_content.js`.
- **Sites and maps:** [SR rules](../../../SITE_AND_EXPLORATION_RULES.md). SR6 separates a lead from an entrance and a surveyed extent; SR7 treats maps as scoped knowledge.
- **Layout:** `src/layout_spec.js`, `src/shell_layout_edit.js`, `src/workspace_layout.js`, and the footer's existing Layout control.

### ACT NOW (proposals)

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS172 | **Areas per place, nested by entering.** Default: a place holds a few areas (the Village: square, market row, the elder's house, the field edge). Entering a building swaps the area set for its inside (the elder's house: front room, yard). The location box reads "Village · square", and Back or the exit returns you to the outer area. A small place stays one area. Dial: a world sets its grain, so Tingen keeps its districts and Hogwarts gets corridors and rooms. Reason: more things fit in a place without one screen holding everything. |
| PS173 | **What an area shows.** Default: the people there now (each person's day puts them somewhere), the stations and objects bound there, its exits, and the verbs those allow. Place-wide things (Ready now, the Journal, the day strip) stay on screen whatever the area. Reason: the area changes what you can touch, not what you are working toward. |
| PS174 | **Few clicks.** Defaults: (a) any verb target in a known area is listed with its area tag, and choosing it walks you there and acts ("Talk to Old Hesk · elder's house"); (b) Ready marks count across the whole place, tagged by area; (c) arriving puts you in the place's usual area, and returning puts you where you left; (d) neighbours sit one click away. Dial: "Walk there first" can be switched off for players who want to walk by hand. |
| PS175 | **Arrows on the location box's sides for neighbours, and the verb for everything else.** Default: the location box shows up to four neighbour arrows at its edges, labelled ("← market row", "elder's house →", "↓ field edge"); arrow keys move. The "Move around" verb lists every known area with its gate and, later, its time. A world without a compass (a dream, a Gu aperture) uses labelled tabs instead of directions. |
| PS176 | **The chain of areas is a map, held as knowledge.** Default: areas and their links form a graph. Once the character knows enough of it (SR6, SR7), the location box can open a small drawn map from that graph, with known areas named, rumoured ones as "?" and unvisited links dashed. Reason: the map grows out of play rather than being authored separately. |
| PS177 | **Free now, time-ready.** Default: moving between areas costs no time today. Each link is a `travel_legs` leg with `minutes: 0`, so a world or a later setting can give it walking time without a new model. |
| PS178 | **Gates by mechanism (AD38), each with alternatives.** These are the kinds of gate, with an example and the ways round each: <ul><li>Locked (door, chest): key, lockpicking, breaking it, a spell or Gu that opens it.</li><li>Permission (owner, rank, membership): ask, show a token, reputation, bribe, sneak.</li><li>Hours (shop closed, curfew): wait, or knock with a reason.</li><li>Danger (a fight beyond): prepare, fight, sneak, turn back.</li><li>Hidden (unknown door): find it by search, a clue or a sense.</li><li>Guarded (a watchman): talk, pay, distract, fight.</li><li>Body or means (a ledge, deep water, flight): a tool, a skill, a power.</li><li>World law (warded ground, a sealed aperture): its own key or rite.</li><li>Social cost (a private room): allowed but noticed, with consequences.</li></ul>A gated arrow shows its gate and the ways you have now; nothing hides that the character can see. Unknown gates read "?". |
| PS179 | **Drag any box: the layout model.** <ul><li>Default: the screen is slots (four columns, stacked) holding box ids. A box is a registered kind (PS108) with a minimum size, a fold state and the tabs it accepts.</li><li>Dragging a box by its header to another slot swaps or inserts it, and neighbours reflow. A keyboard move ("Move box…" in the box menu) does the same.</li><li>Layouts save per browser as a versioned spec (`layout_spec.js`). Named presets include YAIR default, Reports left and Wide journal, and each world can have its own default; Reset is always offered.</li><li>A box sizes to its content within its slot, so the Journal's empty height goes to the box under it.</li><li>Reason: one layout model serves every future box, so a new feature registers once and the player places it.</li></ul> |

### ACCOUNT FOR NOW

| Code | Consideration |
| --- | --- |
| PS180 | **Save shape.** The current area per place and known areas and links sit in a namespaced slice with a migration (old saves start in the place's usual area). Layout stays out of the save (per browser). |
| PS181 | **People move.** A person's schedule names an area and hour. Who you meet depends on where and when, and the Reports line says where someone went. |
| PS182 | **Area facts.** Indoors or outdoors (PS33's roof rule), light, noise and privacy are area facts that cold, stealth, conversation and crime read. |
| PS183 | **Events and fights have an area.** A fight takes the area's box, and leaving the area is a fight action (PS147). |
| PS184 | **Per world.** <ul><li>Village: a few areas.</li><li>Tingen: districts as areas, with buildings inside.</li><li>Fang Yuan's mountain village: the academy, the wall and the stalls.</li><li>Hogwarts: corridors and rooms, with the stairs changing as a world-law gate.</li></ul> |
| PS185 | **Performance and tests.** By default, render the current area alone, because other areas' rows cost time on every tick; keep walk scripts per area, and give each lead a baseline of one area in and out. |

### The effects no clip showed (proposals; Weibao asked to consider them: "we can also consider the not seen in any clip options")

| Code | Effect | Default |
| --- | --- | --- |
| PS186 | Hit flash | A brief tint on the struck row, off under reduce motion (PS155). |
| PS187 | Floating text | Damage, healing and loot rise from their source and fade within a second; repeats stack with a count. |
| PS188 | Rarity or quality glow | A soft edge in the rarity colour with its word in the tooltip (PS153). |
| PS189 | Sound | Cues for ready, level-up, a fight's end and a gate opening, each with its own volume; off by default. |

## Round 18, 2026-11-15: the strip's numbers, the world crossing, Around you in column 3, log filters, and actions without a surface

Weibao, looking at the Village home at 17916d6f9: "what do the numbers on top mean? Where else to put the cross to another world? HOw to put the around you part better? Using more of the space from the journal part? did we implement the D15? More to consider? Do we have ui for other actions too?" ([log](../../USER_VISION_LOG_2026-11.md#strip-numbers-world-crossing-and-around-you-2026-11-15))

What the capture shows:
- **Top strip:** the 6, 12 and 18 are the day strip's hour ticks (F). The gold line is now (08:12). Events and plans would sit on it as chips, but the Village has none yet, so it reads as a bare ruler.
- **Footer:** it still holds the 17 routes. Slice 1 moved the bar but has not yet grouped it (PS123).
- **Second-level tabs:** Here, Crafting, Mixing and Keys, and Actions, Home and Options, are still there until slice 3.
- **Journal:** one quest and an empty column. The Skills box lands under it in slice 4.

### ACT NOW (proposals)

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS190 | **The strip explains itself.** Default: the hour ticks get a label ("Today") and the current time sits on the now line. Events and plans show as chips (fed Moonglow, patrol, Moonglow due 23:00). With nothing on today's strip it folds into the status line as "Today: nothing planned · next: …", and its height goes to the boxes. Hover on any tick gives the time. Reason: a bare ruler of numbers reads as noise. |
| PS191 | **The world crossing lives with travel, not in the verb list.** Default: under **Move somewhere else**, a separate group "Another world" lists each known crossing (Tingen) with what it costs and what carries over (WER rules). The Journal box's **Worlds** tab is the overview of the lives you hold and the doors you know. The stray "Cross to another world" row goes. Dial: the Pin menu can pin a crossing to the strip. Reason: it is a way out, the biggest one, and belongs with the others. |
| PS192 | **Around you moves to column 3 as the Here box.** Default: column 3's head becomes **Here**, the full list of the current area (people, stations and ways out, each with its verbs, and the area arrows from round 17). Under it sits the **Journal** box, fitted to its content, and then **Skills**. Column 2 keeps a compact place head (name, area and one line of description, with "More about this place") and the actions box, which gains the height. Dial: drag layout (PS179) moves any of them, and a preset puts Here back in column 2. Reason: the people and things you can touch need room more than a one-quest Journal does. |
| PS193 | **YAIR's log filters (DU15) are not built yet.** Today Reports has a single filter dropdown. Default: the YAIR filter row at the foot of Reports (Levels and unlocks, Events, Crafting, Combat, Loot), plus Ready and Story (PS124). Each is a toggle, and the choice is kept per life. It is in the UI kit (cell 12) and not in the game. |

### ACCOUNT FOR NOW: actions without a proper surface

The [surface coverage audit](../../../audits/UI_SURFACE_COVERAGE_2026-11-15.md) (SFC1–SFC42) answers "do we have UI for other actions". Many actions have a surface, but often a poor one:
- **SFC2:** about 47 files append straight into the actions box, so the verbs land in load order.
- **SFC3:** about 45 registered centre panels have no route (Deeds, Companions, Study, Homes, Regard and more).
- **SFC1:** each lead lives in one catch-all panel (Klein's workroom has about 25 sections).
- **SFC4:** the Skills box has no world tabs (Beyonder, Spells, Gu).
- **SFC5:** several engines reach no player at all: creature populations, the potion and spell engines, and markets.

| Code | Proposal |
| --- | --- |
| PS194 | Batches 2 and 3 of the drafts take SFC12, SFC21–SFC27 and SFC30–SFC33. Each stray verb joins a verb with a target, and each unrouted panel gets a box and tab (PS125 extended). The catch-all lead panels split into their verbs and tabs after D1–D6 are built. |
| PS195 | A check in `check:flow` lists any panel or action outside the layout registry, so the count of strays goes down and stays down. |

## Round 19, 2026-11-15: the world crossing gated until it opens, and the day strip the same way

Weibao: "we should put the travel to other world buttom somehwere and gate it until Its unlocked or I die, or some sort of settings area? MOre to consider? COnsider tihs for the timer too" ([log](../../USER_VISION_LOG_2026-11.md#world-crossing-gated-and-the-day-strip-too-2026-11-15)). Today "Cross to another world: Tingen" sits in the Village's verb list from the first minute, and the day strip shows on every page from the start.

### ACT NOW (proposals)

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS196 | **The crossing has three ways to open, and is hidden until one does.** Default: no crossing control shows until one of these happens. (1) **In-world unlock:** the life finds a means to cross (a door, a rite, a cheat that wakes, a world power's release; WER1, WER2). The crossing then appears under Move somewhere else › Another world (PS191), naming its method and what carries (WER3, WER9). (2) **Death:** the death screen offers the crossings this soul can take (XM1 soul into the recently dead, XM4 rebirth and the rest), beside the life's own death outcome. A death is where a new life begins. (3) **A sandbox setting:** Menu › Worlds › "Cross freely" (off by default) shows every crossing at all times, for testing and for a player who wants it (AD22: Weibao is the player). Reason: an always-there door makes every life feel temporary. |
| PS197 | **Locked crossings are known only as far as the life knows them.** Default: the Journal's Worlds tab lists the lives you hold. A crossing you have heard of but cannot use shows as a pale row ("?", DU6) with what would open it if the life knows ("a rite the Seer may learn"); one it has never heard of does not show. |
| PS198 | **Crossing is a weighty act.** Default: a confirm step names what carries over and what is left (WER3: body, memories, cheat, items, identity, language, who notices, the old life's state, obligations), whether the old life keeps running or freezes (AD12), and the way back if there is one. A crossing after death has no way back to that body. |
| PS199 | **The day strip earns its place the same way.** Default: the strip is hidden until the life has something timed. That can be a schedule (Harry's timetable, Klein's office hours), a Gu's meal time, a patrol night or a planned event, or a calendar the character keeps. Until then, the status line shows the time alone. Once it appears, it labels itself (PS190) and shows the day's chips. Dial: the Pin menu shows or hides it at any time. Options › Display has "Day strip: when there is something timed / always / never". Reason: a ruler with nothing on it reads as noise in the first minutes. |
| PS200 | **Time known as the life knows it.** Default: the clock and date read as the character knows them. A lost-memory start may know the hour from the light but not the date ("? / 04 / 999"), and the strip fills in as the life learns its calendar (KNW, PS130). Dial: "Show the real clock" in Options for players who want it. |

### ACCOUNT FOR NOW

| Code | Consideration |
| --- | --- |
| PS201 | **Other unlockable surfaces follow the same rule.** The Skills box's world tabs (Gu, Spells, Beyonder), the Bestiary and the merit board appear when the life first meets them. The first time each appears it gets the "new" pulse (PS153), and a Reports line says what just opened. |
| PS202 | **Fixtures and tests.** Walk scripts and fixtures that use the crossing turn on "Cross freely" or start past the unlock, so tests do not depend on a hidden control. |

## Round 20, 2026-11-15: column 3 split, combat organized (Proto23 and YAIR), cold and XP, round 15's status, the crossing's home

Weibao: "we can probably split the journal tab with room to spare for something below it? Combat page could use some work, skills and practice have so much empty space, I might have been looking at the old versions, Consider how to organize combat better? consider the proto23 style vs yair style, Why would freezing reduce xp gain>? What about round 15? Cross freely should bprobably put elsewhere or unlocked or something in the future more to consider?" ([log](../../USER_VISION_LOG_2026-11.md#column-3-split-combat-and-cold-2026-11-15)).

Read from a fresh Village capture at 622f7e775, 1920×1080 (fresh-day3 fixture): column 3 is one Skills & practice box, full height, with four skills in two-line bordered rows over the top third and empty space below. Column 2's actions box is three verbs over a mostly empty box. The Journal pages (Beginning, Worlds and the rest) still sit in the bottom bar, so column 3 has no Journal box yet (slice 4 is open).

### ACCOUNT FOR NOW

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS203 | **Column 3 is two stacked boxes, each sized to its content.** Default: Journal on top (the quest in hand, then its tabs: Knows, Notebook, People, Worlds, Beginning, through `registerBoxTab`), Skills below. Each box takes the height its rows need, up to a cap (about half the column), and the column's leftover goes to the box with more rows. Dial: drag either box to another column (PS179). Swap their order per life. Reason: Weibao saw a tall box with a third used; YAIR stacks quests over skills the same way. |
| PS204 | **Something useful in the room below.** Default order for the space Journal and Skills leave: "Learning now" (PS146: what is practising, how fast, why a chosen practice is stalled), then the Here box (PS192), then a short combat log during a fight (PS206). Each shows only with something to say. Reason: a slot with no content shows nothing, not a blank frame (PS138). |
| PS205 | **Skill rows on one line.** Default: name · level · thin bar · % to next, on one line, as YAIR draws them, with the two-line bordered rows kept for a selected skill. Reason: four skills take four lines, not a third of the column. |
| PS206 | **Combat: YAIR's grid with Proto23's log beside it.** YAIR draws auto-combat in column 2 as foe cards with attack bars, with the fight's lines mixed into the Reports column. Proto23, the ancestor, keeps the fight next to a full-height log, and the [2026-10-13 comparison](../../../UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md) names "combat/log adjacency" as worth recovering. Default: the fight box in column 2 reads top to bottom: both sides (You and Beside you against Them, D6), the approach strip (stance, terms, stakes), then the auto bars or the move tiles, then the last six fight lines inside the box. Reports keeps the full log under its Combat filter. Dial: Display › Fight log: in the fight box (default), in Reports only, or both. Reason: the fight reads in one place without your eye crossing two columns; YAIR's grid stays familiar. |
| PS207 | **The fight card and auto-combat are one box with two densities.** Default: an ordinary foe plays the auto view, and a fight that matters (a person, a duel, stakes that change) opens the move tiles in the same box, the same strip on top. Moves fold to the five most used, with "More moves" for the rest. Reason: today's card shows fifteen tiles and repeats the strip's choices as tiles (finish/spare), which the approach strip already sets. |
| PS208 | **Cold slows by its mechanism, not a blanket XP cut.** Today: Freezing is ×0.6 to all XP and Hypothermia ×0.3, carried unchanged from upstream YAIR (`src/active_effects.js`). Under AD38 a flat cut has no reason a player can see. Default for our variant's worlds: cold numbs hands (fine work and DEX practice slow), shivering drains stamina, and study slows only when you cannot keep focus (no fire, no shelter). Cold resistance and endurance practice grow faster in the cold. The condition row names each effect and its cause. Dial: the YAIR Village keeps upstream's numbers, since it is the faithful port. Reason: Weibao asked why freezing would cut XP; the current answer is only "upstream said so". |
| PS209 | **Round 15's status.** PS129 (nothing lost) is the standing check, and PS130 ("?" numbers) has landed (`knownNumber`, fight card). PS131–PS150 are open, and none has a commit yet. Lanes: ui-cohesion takes PS131, PS136, PS139, PS147 and PS149. feel-finish takes PS132, PS133 and PS134. feature-ui takes PS141, PS142, PS144 and PS145. daily-loops takes PS143 and PS150. PS146 goes with PS204, and PS135 and PS140 go with the strip and keys. |
| PS210 | **The crossing opens in the world, and the setting moves to play rules.** Today: "Cross freely" is a toggle under Menu › Worlds (round 19). Default later: the life opens the crossing through an in-world route (a death, a ritual, an object, a cheat card; WER), and the door then sits under Move somewhere else › Another world. The "Cross freely" switch moves to Options › Your own rules, beside optional pacing, as a play rule, not a menu item. Reason: a menu switch reads as a debug control; a play rule says what it is. |

### More to consider

| Code | Consideration |
| --- | --- |
| PS211 | **A "no blank box" check.** `check:flow` flags any column box at 1920×1080 whose content fills under about 40% of its height on a fresh fixture, so empty space is caught before Weibao sees it. |
| PS212 | **One cold signal.** The top strip shows "Cold exposure" and Condition shows Wet and Cold. Default: the strip's chip opens the Condition rows, and the two use the same words (PS135). |
| PS213 | **The "???????" tab names what reveals it.** The third Skills tab reads "???????" (a world power not yet met). Keep the "?", and its hover says how it opens ("Something you have not met yet. A teacher or a book may open it."), per PS130 and PS138. |
| PS214 | **Captures carry their commit.** Default: a capture shown to Weibao is named with its HEAD hash (as in `9-village-head-622f7e775.png`), reason: an old picture can be mistaken for today's. |
| PS215 | **The actions box fits its verbs too.** Three verbs in a full-height box leave the same blank space. The box fits its verbs, and the leftover goes to Around you's list, so people and stations show without "Show all". |

## Round 21, 2026-11-15: challenging the earlier choices

Weibao: "we should challenge the ideas of the previous implementators and considwer if we can do better, specially in terms of design and more? not because they might be bad but simply because there could be better" ([log](../../USER_VISION_LOG_2026-11.md#challenge-the-earlier-choices-2026-11-15)).

Each row names a choice already built or proposed, the strongest alternative, and a cheap test that decides between them. Neither side is assumed better. The tests are prototypes or side-by-side captures at 1920×1080 (prototype-to-decision), judged against the same task.

| Code | Today | Challenge: a possibly better option | Deciding test |
| --- | --- | --- | --- |
| PS216 | Four fixed YAIR columns from the first minute (round 14). | **The layout grows with the life.** A new life starts in two columns (you and the place), and a column opens when its first content arrives (the first skill, the first quest, the first fight). YAIR's early game has little to show, and four half-empty columns are what Weibao keeps seeing. | The first ten minutes in both, captured each minute; count blank area and the clicks to the first three goals. |
| PS217 | Boxes inside bordered boxes: each skill row, verb and tile has its own border (the capture at 622f7e775). | **Hierarchy by spacing and type, not borders.** By default, a border on the box edge and none inside; rows separated by space and a hairline; state by colour and weight. | Same screen, two skins; a fresh reviewer agent ranks them blind for "where do I look first". |
| PS218 | A bottom bar of 12+ panel buttons and an "All panels…" select. | **Reach things where they matter, and a palette for the rest.** Each panel opens from the noun or verb it belongs to (inspector, verbs, box tabs); the bar shrinks to Save, Menu and a Find palette (Ctrl+K) that searches panels, items, people and actions. | Time and clicks to ten named panels in both; count which bar buttons a play session used. |
| PS219 | Unknown numbers read "?" (PS130), so a fresh foe reads "Atk ? · ?/? hp". | **Relative words before numbers.** By default, an unknown foe reads as a comparison ("looks stronger than you", "faster", "hurt") from what the life can see; numbers appear as knowledge grows. A row of "?" tells you nothing you can act on. | Three fights with each; does the player choose to fight or flee correctly more often? |
| PS220 | A Here · ready now hub gathers what every feature has ready (D). | **Readiness shows on the verb itself.** A count or dot on "Talk to someone (1)", "Find work (pay due)"; by default the hub becomes a Journal tab for the full list. One more list to read is the hub's cost. | A play hour logged: how often each surface was the one that led to the next action. |
| PS221 | Fight intent as three layers on a strip: stance, terms, stakes (rounds 4 and 5). | **The game learns your habit.** No terms control by default: the first time a kind of foe goes down, you are asked; the answer becomes that kind's habit, shown as a chip you can click to change. Stakes stay a chip. One select less on every fight. | Twenty fights over the three leads with each; count stops and setting changes. |
| PS222 | A six-line fight log inside the fight box (PS206). | **Each card tells its own last event.** Under each fighter, its latest line ("bit you, 4", "staggered"); the full log stays in Reports. Your eye stays on the card that matters. | A group fight of five in both: can a reader say who hurt them last, and from where? |
| PS223 | Areas inside a place joined by arrows into a map (round 17). | **Areas as tabs on Around you, free to switch, with travel only where a gate or distance is real.** Arrows and a map appear only where the area chain is long (a ruin, a city). Fewer clicks for a village. | The Village and one ruin in both; clicks to reach five things. |
| PS224 | A day strip of the day's events (F, PS199). | **The next due thing, in the status line.** "Moonglow hungry at 23:00" beside the clock, with the full day as a Journal tab. A strip draws a whole timeline to show one or two marks. | A Fang Yuan day in both: misses of due things, and screen space used. |
| PS225 | The day's loop drawn as a diagram (flow mock). | **The loop is felt through results.** Each result line ends with its "Next:" links (already proposed), and the diagram goes. A diagram is a thing to read; a link is a thing to do. | Same evening in both: does the player find the next step without the diagram? |
| PS226 | Feel and finish (glow, motion, light) running beside structure work. | **Structure first, then polish on what stays.** By default, glow and motion go on surfaces that survive PS216–PS225; work on surfaces that may move is held. | An order call, not a test: list feel-finish items whose surface is in question. |
| PS227 | Features designed one by one (farming first, then the next). | **Design by moment.** Storyboards for "the first ten minutes", "an evening", "a fight that matters" and "a week away", each crossing every feature it touches, then build what the moments need. Per-feature passes miss the seams between features. | One storyboard (Fang Yuan's evening) built as a clickable prototype and compared with today's per-feature screens. |
| PS228 | Agent-judged captures. | **A blind panel.** A fresh agent with no context compares our capture and YAIR's for the same task, unlabelled, against a short rubric (where to look, what to do next, what is noise). Agents that built a screen grade it too kindly. | Run on three screens; keep it if it finds something the builders missed. |

### How this runs

After the weekly reset, one prototype lane takes PS216, PS217 and PS219 first: those change what every later slice looks like. PS226 decides the order of feel-finish's open items, and PS228 is the judge for all of them. Each deciding test ends in a capture pair for Weibao. A challenge that loses is recorded with its test, so it is not reopened without new evidence.

## Round 22, 2026-11-15: better versus more, mocks that match the game, and the worth of not knowing

Weibao: "how to consider what is better than more? how to make mock more accurate to the real deal without costing tooo much? bringing mock into reaslity? other aspects? ?/? has benefits. sometimes not knowing is part of it, more to consider?" ([log](../../USER_VISION_LOG_2026-11.md#better-versus-more-and-the-worth-of-not-knowing-2026-11-15)).

### Better versus more

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS229 | **"Better" means the same play for less effort; "more" means more to read.** Default: a change counts as better when it moves at least one of these, measured on the same task at 1920×1080, without making another worse: clicks or keys to the goal; places the eye visits before acting; blank area inside boxes; things on screen that the task never used; wrong or missed actions (a due Gu unfed, a fight not fled). A change that adds a surface states which of these it improves; if none, it is "more". Reason: the earlier rounds each added a good idea, and the screen grew. |
| PS230 | **Every addition names what it replaces or hides.** Default: a new row, chip or panel either takes over an existing one's job or shows only when its condition holds (round 19's rule). Dial: Display › Show everything, for a player who wants the full board. Reason: the count of permanent controls rises only when the life truly has more to do. |
| PS231 | **Weibao's taste is the final judge, and the numbers pick what reaches him.** The PS229 numbers and the blind panel (PS228) sort candidates; Weibao sees the top two as a capture pair and picks. A low score does not overrule a choice he likes. |

### Mocks that match the game, cheaply

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS232 | **Mock inside the real game, behind a URL flag.** Default: a layout or look proposal is a stylesheet plus, when needed, a small layout-spec override in the real bundle, switched on by `?variant=ps217` on the test origin. It renders real saves, real words, real numbers and real edge cases, which hand-written HTML mocks invent and get wrong (round 15 found the round 14 mock thinner than today). Cost: about the same as a static mock for look and placement, since `layout_spec.js` columnSlots, box tabs and the shared tokens already exist. Static HTML stays for things the game cannot draw yet (a new screen with no engine). |
| PS233 | **Fixtures give the mock its state.** Default: each variant is captured on the same fixtures (fresh-day3, gu-fed-second, lotm-tingen-day3, hp-exam-week, a fight), with the same seed, before and after, and named with the commit hash (PS214). Reason: a mock that only shows a hand-picked moment hides the empty and the crowded cases. |
| PS234 | **The winning variant is already the build.** Default: when Weibao picks a variant, its flag becomes the default and the loser's stylesheet and override are deleted in the same change; nothing is rebuilt from a picture. Reason: the mock-to-build translation is where detail was lost before. |
| PS235 | **Variants stay display-only.** A flag variant changes layout and look, never save data, so switching cannot harm a save. A proposal that needs engine work is staged: the look as a variant on fake-but-typed facts through `withDisplayFactsFrame`, then the engine. Visual baselines and walk tests run with variants off, plus once with the candidate on before it becomes default. |

### Not knowing is part of play

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS236 | **"?" and relative words, both, chosen by what the life can perceive.** This amends PS219. Default: what the character can see is said in words ("bigger than you", "limping"); what the character cannot tell stays "?" (a hidden power, a stranger's strength, the odds of an untried recipe, a sealed truth). A world's tone sets the mix: a horror or mystery life shows more "?", a trained hunter fewer. Reason: Weibao, "sometimes not knowing is part of it". The "?" is a promise that something is there to learn; replacing it everywhere would remove that. |
| PS237 | **A "?" says how it could be learned.** Default: hovering a "?" names a route without its answer ("Watch it fight", "Ask a hunter", "Study one"), and learning it is a small moment (a Reports line, the number fading in). Reason: an unknown with a route is a goal; one without is noise (PS138, KNW). |
| PS238 | **Wrong knowledge is allowed.** Default: an estimate from rumour can be off and shows as an estimate ("~12, from a rumour"); when the truth arrives the number corrects, and the correction is shown. Reason: hidden properties act whether or not anyone knows them (USER_VISION one-record rule), so a believed number can be wrong. |
| PS239 | **Some things stay "?" on purpose.** Sealed secrets, another life's inner state and the far future keep "?" until their discovery route (sealed-secret rule); no skill or cheat reveals them by number alone. Dial: a cheat card that names a route, not the answer. |

### More to consider

| Code | Consideration |
| --- | --- |
| PS240 | **Cost guard for variants.** A variant lane works on stylesheet and spec overrides, with no new engine code. Its done check is the capture pair plus `check:visual` with the flag off. |
| PS241 | **Hold the comparisons still.** Fonts, window size, seed and the reduce-motion setting are pinned in capture runs, so a difference in a pair comes from the variant, not the run. |
| PS242 | **One question per capture pair.** Each pair answers one question ("borders or spacing?"), so Weibao's pick says which change he liked. A pair that differs in five ways cannot be read. |
