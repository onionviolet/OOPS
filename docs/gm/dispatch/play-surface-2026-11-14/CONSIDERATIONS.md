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

## Round 23, 2026-11-15: cohesion by construction, enchanting and reforging on screen, and what the Minecraft mods teach

Weibao: "how can we have the UI inherently cohesive and good looking? consider enchanting too? reforging? other aspects? absorbing all those mincraft mods?" ([log](../../USER_VISION_LOG_2026-11.md#cohesive-by-construction-enchanting-reforging-and-the-mods-2026-11-15)).

Existing owners this builds on, not restarts: the [gear depth considerations](../../../GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md) (GDP1–GDP46: Silent Gear, Tetra and Tinkers' structure; part swaps, salvage, heat grades), [CRAFTING_ENGINE](../../../CRAFTING_ENGINE.md) XD7 (enchanting as runes with charge), `src/gear_affixes.js` (affix records on Apotheosis's structure, native names and numbers), `src/rune_grammar.js` (rune pairs, talisman order), the [modpack scout](../../../research/MINECRAFT_MODPACK_SCOUT_2026-10-14-report.md) and the round 14 [UI kit](../../../../prototypes/ui-kit-2026-11-15/). Mechanics stay with those owners; this round is how they look and feel, and how the screen stays one piece.

### Cohesive by construction

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS243 | **Features declare content; one renderer draws it.** Default: a feature hands the shell rows, verbs, numbers, chips and a tooltip record (the kit's twelve forms), and the shared renderer draws them. A feature writes its own DOM only for a view the kit cannot express, and that view becomes a new kit form when a second feature needs it. Reason: Minecraft mods look like one game mostly because every mod draws into the same slot grid and tooltip; our features look apart because each drew its own panel. |
| PS244 | **A small, fixed vocabulary.** Default: one spacing scale (4, 8, 12, 16, 24), one type scale (four sizes), one border weight, a short colour list from `ui_tokens.css` (text, dim, accent, the PS103 state tokens and rarity), and two densities. Reason: cohesion comes from the few values everything shares, more than from any single screen's polish. |
| PS245 | **A lint keeps it.** Default: a check flags a raw colour, pixel size, border or `toFixed` in UI modules outside the tokens and number_format (the number ratchet already works this way), with a ratchet that only goes down. Reason: the gate found three new inline number formats in one day; style drifts the same way. |
| PS246 | **A kit page per feature.** Default: each feature has a row on the live kit page showing its forms in their states (empty, near, ready, running, unknown, crowded), so a drift shows beside its neighbours before it reaches a screen. |
| PS247 | **Good-looking means calm first.** Default: one accent per box, motion only for change (PS153's pulses), glow only for rarity and readiness, and the rest quiet. Reason: what makes YAIR read well is how little competes for the eye; the borderless variant (PS217) tests the same idea. |

### Enchanting and reforging on screen

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS248 | **One item, one sheet.** Default: an item's inspector shows its parts (Tetra and Silent Gear's structure in GDP), its affixes or enchantments with their ranges as the life knows them (PS236 rules: "+3–5 edge" known, "? something in the steel" not), its condition and history, and its "where it can go" verbs: wear, repair, reforge, enchant, salvage, sell. Every making system adds verbs to this sheet, not its own item view. |
| PS249 | **Reforging shows the gamble before you pay.** Default: the reforge view shows what stays (the item, its history, its part bond), what is rerolled, the range each roll can land in as far as the smith can tell, the cost, and what the smith's skill and the metal's fatigue change. After the work, the old and new values sit side by side, with Keep and, where the world allows it, Revert at a cost. Mechanism first (AD38): reforging is reworking metal, so fatigue, heat and skill set the odds, not a slot-machine label. |
| PS250 | **Enchanting is per world, one form.** Default: the bench differs by world (a Gu refinement in Fang Yuan's world, a charm in Harry's, a ritual or characteristic in Klein's, runes in the Village per XD7), but each shows the same form: inputs, a capacity bar (rune capacity from alloy and medium, XI2), interference with what is already on the item (SX4), the chance and range as known, and a preview of the item after. Reason: one form is learnt once and reads everywhere. |
| PS251 | **Capacity and interference are visible.** Default: an item shows how much more it can hold and what clashes, as a bar and a short reason ("the iron fights the frost rune"), in the same place on every bench. Apotheosis and Tinkers both make the limit visible; a hidden limit reads as a bug. |
| PS252 | **Unknown effects stay unknown until tried.** Default: a first-time enchantment or reforge result can carry "?" (PS239) until worn, tested or appraised, with a route on hover ("Wear it in a fight", "Show it to an appraiser"). Reason: discovery is part of making (rune_grammar's learning by contrast). |

### What the mods teach, by question (patterns, not copies)

| Code | Mod pattern | Default in our screens |
| --- | --- | --- |
| PS253 | JEI and REI: any item shows its recipes and its uses on a key. | The inspector's "From" and "Where it can go" (flow mock A) answer both for every item, on one key (R for recipes, U for uses) and by click. |
| PS254 | Jade and WTHIT: look at a thing to learn what it is and its state. | Hovering anything in Around you shows a compact state card (a station's job and time, a person's mood as known), in the kit's tooltip form. |
| PS255 | AppleSkin: show what eating will do before you eat. | Every use or consume verb previews its effect on the bars (a ghost segment on hunger, health or essence) before the click, per PS141's "say the outcome first". |
| PS256 | FTB Quests and Patchouli: a quest tree and an in-game book. | The Journal's tabs hold a goal tree for long arcs and a notebook the life writes into as it learns (KNW), not a wiki. |
| PS257 | Create: you see the machine work. | A long job shows its stages moving (the kiln's heat rising, the Gu eating), within the reduced-motion setting. |
| PS258 | Applied Energistics and Sophisticated Storage: one searchable store. | Storage and inventory share one search and filter row, and a station can pull from storage when the life has the means. |
| PS259 | Tough As Nails and Serene Seasons: temperature, thirst and seasons as mechanisms. | Supports PS208: cold and season act by mechanism, and the Condition rows say why. |
| PS260 | Tinkers and Tetra: tools grow by use (modifiers earned, honing). | An item's sheet shows wear-in and earned traits as a history line ("held the wall for 3 nights: +grip"), from GDP. |

### More to consider

| Code | Consideration |
| --- | --- |
| PS261 | **"All the mods" means a pattern list, not a port list.** Default: a mod enters through the question it answers (where does this come from, what will this do, what is this thing), one pattern per question. The modpack scout's catalogue is the palette; the existing private decompiles are structure evidence only. |
| PS262 | **Order.** PS243–PS246 come before any new bench screen, since every bench after them is drawn by the renderer and lint. PS248 (the item sheet) is the first consumer; reforging and enchanting follow on it. |
| PS263 | **A deciding test for cohesion.** The blind panel (PS228) gets three screens from different features with labels removed, and is asked whether they look like one game. A "no" names the form that broke. |

## Round 24, 2026-11-15: looks as player choices, and what comes next

Weibao on the ps217 pair: "Implement both and have the player choose, can leave border as default, lots of features can be like that ⏎ whats next to consider?" ([log](../../USER_VISION_LOG_2026-11.md#looks-as-player-choices-2026-11-15)).

### Looks as player choices

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS264 | **A tested look becomes a choice, not a replacement.** Default: when a variant pair has no clear loser, both ship. Display › Row style is Bordered (default) or Spacing. A look option registers its id, label, choices, default and one stylesheet per choice in a small registry, and the Display options list them. This amends PS234: the losing variant is deleted only when Weibao picks one over the other. Reason: Weibao, "lots of features can be like that". |
| PS265 | **Look choices live with the player, not the save.** Default: they persist like the other Display and Feel settings, carry across lives and worlds, and never enter a save file, so a shared or imported save does not change how the screen looks. |
| PS266 | **Presets bundle choices.** Default: Classic (YAIR's look, the defaults), Calm (spacing, quiet motion) and Dense (compact rows, small type), plus "Custom" once any single choice changes. Reason: a list of ten switches is work, and a named preset is one click. |
| PS267 | **Test the defaults and each choice alone.** Default: visual baselines run on the defaults; each non-default choice gets one capture set by itself, and combinations are not baselined. Reason: choices multiply, and testing every combination costs more than it finds. |
| PS268 | **What qualifies as a look choice.** Default: a look choice changes appearance or density, and nothing the game does. A choice that changes what you learn or what the game does (the "?" rules, the day strip's timing, the crossing) is a play rule under Your own rules (PS210), with its own default and reason. |

### What comes next (after the 2026-11-16 reset, in order)

| Code | Item | Why this order |
| --- | --- | --- |
| PS269 | PS243–PS246: one renderer, the fixed vocabulary, the style lint and the per-feature kit rows. | Every later screen is drawn through them, so it comes out cohesive with no extra pass. |
| PS270 | PS204: "Learning now" and the Here box in the room below Skills. | The empty space under Skills is the most visible gap left in today's captures. |
| PS271 | The areas build (round 17, "Build both") on travel_legs, tested against PS223's tab alternative as a look/play pair. | It is Weibao's oldest open "build" and needs its own lane. |
| PS272 | PS248: the item sheet, then reforging (PS249) and one enchanting bench (PS250) on it. | The first consumer of the renderer; it carries GDP's mechanics to the screen. |
| PS273 | PS206–PS207: the fight box as YAIR's grid with the adjacent fight log, and the card folded to five moves. | Combat's remaining layout work; PS238 (wrong estimates) after it. |
| PS274 | Round 15's open details by lane (PS209), and drafts D2–D6. | Already assigned; they run alongside. |
| PS275 | PS216 (the layout grows with the life) and PS219/PS236's world mix as a second variant pair. | The next "borders or spacing" style question for Weibao. |

### More to consider

| Code | Consideration |
| --- | --- |
| PS276 | **A first-run look picker.** The first time a player opens the game, one screen offers the presets beside a live preview. It is skipped by default for Weibao's existing setup. |
| PS277 | **Choices are named in reports.** Default: a capture or bug note records the look choices in force; reason: a difference between two screenshots can otherwise be mistaken for a regression. |
| PS278 | **Accessibility rides the same registry.** Text size, contrast outline (PS133) and reduced motion register as look options, so one Display page holds them all. |

## Round 25, 2026-11-16: the Skills box up close

Weibao, with a capture of the Skills box: "To next level is wrapping in a bad way and moving the bar, how does the original handle that? HOw to make ui look better and more?"

ACT NOW, done in 6895cf083 with bundle 6b330ab8c. Upstream YAIR prints only "49%" in a 20%-wide slot beside the name, and keeps "current / needed" in the tooltip. UIC200 had lengthened the label to "% to next level" in the same slot, so a narrow column wrapped it to three lines and pushed the bar down. The fix:
- the label is upstream's short percent, at its own width, with tabular figures;
- the name ellipsizes before anything wraps;
- the tooltip line now reads "a / b XP to the next level";
- Learning now's rate and source read as quiet text instead of boxed chips.

| Code | Proposal (default, dial, reason) |
| --- | --- |
| PS279 | **One set of fold controls per group.** Default: each skill group header has one chevron that folds the group; "fold all" and "open all" move into the Sort / filter menu. Reason: today each header shows two pairs of arrows, which read as noise on every group. |
| PS280 | **Weight by what is moving.** Default: a skill practising now gets the accent on its bar and name, while idle skills sit dimmer. Learning now then confirms the rate rather than being the only place you see it. Reason: all rows weigh the same today, so the one you are training does not stand out. |
| PS281 | **The bar carries the number when there is room.** Default: in a wide column, the percent sits inside the bar's end like YAIR's health bars; in a narrow one, beside the name (today's fix). Reason: one fewer text element per row, with no wrap. |
| PS282 | **Max-level and long names.** Default: "Max" in place of the percent, as upstream does, with a capped bar colour. A long name ellipsizes and shows in full on hover. |
| PS283 | **The look follows Row style.** Under Spacing, the green box around each skill goes and the bar becomes the row's only colour. Under Bordered, the border drops to the hairline weight from PS244, because the 2px bright border is the loudest thing on the screen. Dial: Classic keeps upstream's 2px green. |
| PS284 | **A narrow-column check.** check:flow measures text wrapping inside fixed-height rows at the narrowest column width the layout allows, so a label that wraps is caught before a capture shows it. |

## Round 26, 2026-11-16: the missing font, coherence, and the old combat screen

Weibao: "What happend to the usual font? have we imlmented everything we wanted to? Why is not everything coherent? I feel like the old combat UI was better and more coherentthen the On each card? more to consider? other aspects?" ([log](../../USER_VISION_LOG_2026-11.md#old-combat-screen-and-coherence-2026-11-16)).

### Findings

| Code | Finding | Evidence |
| --- | --- | --- |
| PS285 | **The font did not change in the game; the captures lost it.** The game's bitmap Gothic faces load from `resources/fonts/private/`, which git ignores. Lanes capture from clean `git archive` trees, which have no private fonts, so those pictures fall back to a system font. The reforge, kit-page and draft captures show it; the game MCP's captures (which link private files) keep the real font. | `styles/ui_tokens.css` @font-face rules; ui-cohesion's note "private fonts 404 in the scratch tree"; `--ui-font` unchanged in recent history. |
| PS286 | **Not everything wanted is built.** Built and pushed or landed: the four-column frame, box tabs, the fight box, Learning now, Row style and presets, knownNumber with words and rumours, the item sheet, the shared renderer. Open: areas (waiting on its session card), reforging and enchanting (in progress), drafts D1–D12 as builds, slice 4's Journal tabs and Here box, PS216, Harry's daily loop, and most of round 15's details. | CHECKPOINT resume-wave table; commits since adbcc4ff0. |
| PS287 | **Why it is not coherent yet.** Eight lanes add surfaces in parallel, and the shared renderer (1120c44cd) exists but draws two boxes so far, so the other boxes still have its own markup and spacing. Look choices multiply the variations. Captures without the font make it look worse than it is. | Kit migration list; PS243 note. |
| PS288 | **The fight card has become a control panel.** Klein's knifeman card shows the stakes, a stance select, two rows of terms, a sentence about losing, an aim row, six move tiles with two-line descriptions, a "Who acts next" line, and the same hit line printed twice (under the card and under a tile). YAIR's fight is cards with bars, a short row of actions, and the lines in Reports. | Capture `ps222-cards-16eee20f1-knifeman.png`. |

### Proposals (default, dial, reason)

| Code | Proposal |
| --- | --- |
| PS289 | **The original combat screen is the default.** Default: every fight opens as YAIR draws it. Foe cards show name, bars and the attack timer, a short row of actions follows, and the fight's lines go to Reports under its Combat filter. This needs tempo lines routed to Reports, which they are not today. The fight card's extras become choices under Display › Look › Fight: "In the fight box" and "On each card". Reason: Weibao finds the old screen better and more coherent; PS264 keeps today's look as the default when it is a choice. |
| PS290 | **The approach is set before the fight and folded during it.** Default: stakes, stance, terms, losing and aim are set on the opener and saved per kind of foe (PS221's habit). During the fight they show as one summary line ("Robbery · not deadly · Normal stance · Finish · Fight on"), and clicking it opens the controls. Reason: five control rows on every card are the main source of clutter. |
| PS291 | **Moves are buttons, and their words go in tooltips.** Default: a move is a short button with its beats ("Quick strike · 3"), and its description, odds and cost sit in the kit tooltip, as YAIR's actions do. A line is printed once. |
| PS292 | **One coherence pass before more surfaces.** Default: for the rest of this wave, a new or changed box draws through the kit renderer (`src/ui/kit.js`), and the ratchet counts boxes on their own markup down, never up. ui-cohesion migrates the most-seen boxes first: the fight box, Skills, the inventory and the item sheet. |
| PS293 | **Captures carry the real font.** Default: every capture tree links `resources/fonts/private` (and the other private packs) from the primary checkout, the way the game MCP does. A capture without the font is redone before it is shown. |
| PS294 | **A coherence review per slice.** Default: before a slice is reported, its capture sits beside a neighbouring box's capture, both at 1920×1080 with the font. A different spacing, border, type size or colour from the kit is fixed or named. The blind panel (PS228) runs once per wave across all features. |
| PS295 | **Fewer choices on screen, more in presets.** Default: Display › Look shows the presets (Classic, Calm, Dense), and the single choices sit under "Customize". Classic is the original's look everywhere, the fight included. Reason: choices are welcome, but a page of switches is itself incoherent. |

## Round 27, 2026-11-16: the fight drawn twice, empty space, and closing the wave

Weibao: "make it a choice and then I can try both in the fuutre ⏎ I meant wasted space for the combat one, and the yellow bar combat with differing sizes? what happened to the original? also whats. with all the empty space? other aspects to consider? ⏎ Might be worth finishing everything here, commit push an merge, and then we can start ideaboarding after handing off all the rest ideas" ([log](../../USER_VISION_LOG_2026-11.md#finish-the-wave-then-ideaboard-2026-11-16)).

| Code | Finding or proposal |
| --- | --- |
| PS296 | **The fight is drawn twice.** In the Infested field capture at bcc8a92f7, YAIR's own Opponent box sits at the top of column 2. Below it, our fight card draws "You" against "Wolf rat" again, with yellow bars of different widths, and the Opponent box has a blank band under its stats. The original is still there; our card was added beside it instead of replacing or folding into it. |
| PS297 | **One fight view, YAIR's.** Default: in a native fight, the Opponent box is the fight, and our card keeps only the folded approach line and Withdraw. A tempo fight draws its fighters in the same Opponent-box form, with YAIR's hp bar (no words on a foe's bar, UR166), the attack bar beneath, equal widths and YAIR's colours. Combat's last slice of the wave. |
| PS298 | **Boxes stop at their content in fights too.** The Opponent box and the actions box size to their rows, and by default the room left goes to Reports and the fight log rather than a blank band; reason: blank bands are what Weibao keeps noticing (PS203, PS211). |
| PS299 | **The growing layout is a choice.** Display › Look › Customize › Layout: "Full" (default) or "Grows with the life" (PS216), so Weibao can try both later (PS264). |
| PS300 | **One fight bar style.** Default: every fighter bar in the game, native or tempo, uses YAIR's bar: the same height, track, colour per meaning. Your own bars carry the number inside; a foe's bar carries no words, and a pack draws one segment per member (UR166, 2026-11-22). A new bar style needs a reason and a kit entry (PS244). |
| PS301 | **A "drawn twice" check.** check:flow flags a screen where the same fighter, item or person appears in two boxes at once with the same facts, so a duplicate view is caught before a capture. |
| PS302 | **Close a wave on purpose.** Default: a wave ends with every lane committing, writing its handover and stopping, then one gate and push, then the open ideas gathered into one handoff list before new ideas start. This is the round 27 close. |

### Delivery note, 2026-11-16: PS155 Effects follows the OS (311e609d1)

PS155 (round 16) is built as a working default under AD56. New saves store Effects as "auto", which plays full motion unless the OS asks for reduced motion. An explicit Off, Reduced or Full setting wins, and old saves keep their stored value. check:visual and check:flow pin Reduced. Owner: feel-finish (src/customization_profiles.js).

## Round 28, 2026-11-16: ideaboard on three live screens

Weibao: "ideaboarding, show me the UI too". Captures at 1920×1080 in headless Chrome from the committed bundle (e53dbd33c): a village life a week in (fresh-week, with its Effects value patched for the capture, see PS303), Klein at Neil's house on day 64 (lotm-kjw49) and Harry in the Great Hall on day 42 (hp-w7-flying). The look is each save's own; the Calm preset did not take in the capture, so no look comparison is claimed. The captures stay out of git because the two lead lives show private-pack text. Every line below is a proposal.

| Code | Finding or proposal |
| --- | --- |
| PS303 | **A save from today's source does not load in the committed bundle.** 311e609d1 (PS155) writes Effects as "auto", and the bundle built at 503908933 rejects it ("Presentation profile: invalid effects"). The page then shows the bare original screen on day 1 with an empty pack, and says nothing. One rebuild clears it. Default: a failed load says so on screen and keeps the save untouched, so a player never reads a load failure as a lost life. Done check: a fixture saved by source loads in a rebuilt bundle, and a broken save shows the message. |
| PS304 | **Harry's centre is a list of what he cannot do yet.** "Your beginning" shows 3 ready and a column of yellow "needs" rows, and "Simmer the nettles, fangs and slugs" and "Hand in your flask" are each drawn twice. Default: rows that are not ready fold into one "Not yet (n)" line with each reason on hover, so the centre leads with what he can do now; the fold is a dial (open, folded, hidden). Grounds PS220 and PS301. |
| PS305 | **Klein's room is empty.** Around you at Neil's house reads "A place in Tingen. Nothing here to pick out just now", with one Nearby row. Default: a place a life spends time in names two or three things a person there would notice (the table, the cards, the lamp), each a noun you can act on when the life has a reason. Dial: per place, from the world's own texture records. |
| PS306 | **The Journal carries the old life first.** Klein's Journal opens on the village's "Lost memory" ("You woke up in some village…"), because this life crossed from there. Default: the Journal groups by life and world, the current one first, and earlier lives' quests sit under one fold. Reason: what the life is about now should be the first thing the Journal says. |
| PS307 | **Harry's sheet speaks for the wrong body.** The You header reads "Hero · Lv 0" with "Your body here is not the Village hero's sheet", while Skills lists the village hero's Cold resistance and Night vision. Default: the header uses the life's own name, and skills carried across a crossing show as "carried" under their own fold, with what the body here can use from them. Ties to WER answers for the HP start. |
| PS308 | **Storyboard one moment before more features (PS227, first run).** Default: "an evening as Klein" drawn box by box, from the shift's end through dinner, the Seer reading and sleep, marking what each box says at each step. Gaps it finds become the next slice; it costs one doc, no code. |
| PS309 | **The centre column as a scene, not a menu.** Unusual option: the middle box reads as a short room description whose nouns are the actions ("the [table] by the window; [Neil] is reading"), the way a text adventure does, with the verb list one click away. Default stays the verb list; the scene would be a Look choice (PS264) to try on one lead. |
| PS310 | **Plan a day, then let it run.** An idle game's strength is the run you set up and leave. Default proposal: a life can queue its day (Klein: office shift, a reading, the club) and the clock plays it, stopping on anything that needs a choice; Reports then tells the day as one paragraph. Builds on Repeat ×n and the work queue. |
| PS311 | **"While you were away" as a diary.** Klein's Reports opens with "about 9 weeks" and a bullet tree. Default: the summary of time away is a few sentences in the life's voice, with the tree under a fold. Dial: diary, tree, or both. |
| PS312 | **A look per world.** Default stays one look for the game. Option: a world can carry its own look (Tingen in a newsprint face, Hogwarts on parchment), applied while a life is in that world and set in Display › Look by world. Pairs with feel-finish's per-world rarity glow. |

## Round 29, 2026-11-18: prototypes on the live shell

Weibao asked for Stats and Inventory to look distinct, for the layout to use spare room better, and for prototypes to build directly on the game so their changes can move into production. The [live layout preview](../../../../prototypes/live-layout/README.md) starts from a known local revision, links the native fonts if present and compares variants on the same running game and fixture. The [YAIR reference captures](../../../../prototypes/yair-columns-2026-11-15/README.md) remain the reference for grouping and familiar behavior.

| Code | Finding or proposal |
| --- | --- |
| PS313 | **Act now.** The preview renders the real game and switches only an opt-in CSS overlay. Use the native controls to judge the design. Keep the HTML mocks for ideas whose interaction model has yet to exist. Use the same revision, fixture, font, viewport and task when comparing a layout that can run. |
| PS314 | **Account for now.** Stats and Inventory answer different questions. Keep vitals and stat values as a dashboard with clear numeric alignment. Keep stock as a ledger, with filter, name, count, value and item details in their existing homes. Try the content-fit variant first on desktop and laptop. It puts the view tabs after Actions at idle. Preserve native focus and scroll. |
| PS315 | **Later.** Start with room the current task can use. With an item selected, compare its existing detail with an in-place dock that borrows spare room for the same detail. Compare Journal above Reports separately. Evidence is the same task and visible stock and stats, with stable navigation and fewer empty framed pixels. |

### Round 29 follow-through

Weibao found Content-fit a regression from the current style. This supersedes the Content-fit suggestion in PS314. Use the current rail, frames, type, and density as the visual control. The preview now tests the PS315 item placement by moving the existing detail below Actions in the idle context. That tests whether the extra width helps a task without redrawing the rest of the screen.

## Round 30, 2026-11-18: give spare space a job

Weibao asked to reconsider the empty space against our UI rules and look beyond the panel split. Replayed the same disposable Village save and item on local `b862a6dc4` in Chromium with the shipped Luminous Gothic default. Compared Current and Item details below Actions at 1920×1080, 1800×1040, and 1536×864, with actual 14px and 21px inventory text at each. The earlier 1366×768 capture was a stress case. UR25 and UR33's current viewport note owns the matrix. No production layout change in this round.

**ACT NOW.** The 1536×864 / 21px comparison exposes a real choice. Current squeezes Actions to about 182px and clips the comparison across the narrow item card. The alternate gives each a 476px-wide row, but most of the comparison falls below the visible card body. Equip, Full item and Close item stay visible on both. A measured outer pane with zero overflow did not catch the inner clipping. Make the first view of a selected item answer one decision: what is worn, the most relevant gains or losses, and what pressing Equip will do. Use the real comparison model and a Full item path for the complete breakdown. Rerun the same read, equip and return task before favoring either position (UR24, UR25, UR33, UR43, UR60, UR96).

| Code | Proposed treatment | Observable check |
| --- | --- | --- |
| PS316 | **Keep the default frame and distinguish the reading jobs.** Use You for current pools and paired readings, Inventory for a stock ledger with aligned names, quantities and prices, Journal for what is known or pursued, and Reports for what just happened. Use the current bitmap strikes, panel headers, tokens and solid focus. Distinguish through alignment, grouping and control placement before changing color or adding borders (UR30, UR46, UR60, UR68, UR93–UR94). | In a side-by-side live capture with headings covered, a reader can locate a stat and a stack by form. With headings visible, compare the same keyboard and pointer journeys at both text sizes. |
| PS317 | **Give the active task first claim.** Under Actions, use the native item comparison when an item is deliberately selected; while a recipe is open, use the recipe's input, output, time and commit controls; during a scene, keep the question and current choices together. On idle screens with no task, let the actions end at their content and leave the remaining background quiet. Avoid a second copy of nearby people, the current quest or stock (UR32, UR69, UR93, UR145, UR147). | Compare the same task with wide and narrow content. Record which needed facts are visible and which require scroll or one disclosure. The same native quote and action settle either way. |
| PS318 | **Use the Journal area's spare room for one useful companion.** First test a compact Skills or Learning now row when practice is active. An alternate is a selected person's known notes when the player opens People. Keep the active tab and the usual full-view path. For an explicit placement trial, Journal above Reports can be compared as a separate preset; the default has full-height Reports under UR11. | Start and stop practice, change place, inspect a person, open a full view and return. The companion has one owner, the visible tab and focus stay put, and it leaves no blank card when it has nothing to say (UR21–UR27, UR52). |
| PS319 | **Let the page show different levels of urgency.** A local consequence belongs beside its action, an ongoing effect belongs in Condition with its remaining time, and history belongs in Reports with a link back to its source. A routine repeat can fold by source and outcome. A choice that needs you, an expiring protection, and a plain gain retain distinct cues and meaningful wording (UR29, UR56, UR64, UR88, UR95). | Compare a successful action, a blocked one, and an expiry. Confirm their reason, timing and next step through keyboard and pointer, including reduced motion. |
| PS320 | **Test movement and actual visibility as well as occupied area.** Choose the layout at a stable moment such as explicit selection, a view change or viewport change. Update amounts and reports in place. Reveal an overflowed control through the correct scroller; a popup must not obscure a focused routine control. Preserve selected subject, return scroll and layout preferences. | On a short and crowded save, record the visible action and comparison bounds, keyboard order, one-scroll-owner behavior, and recovery after close. Compare an eight-second idle/active-tick sample. Use the same source, profile, viewport and task for both variants (UR25, UR52–UR53, UR69, UR144–UR146). |

**LATER.** Try a quiet place illustration or a small map only where it explains the place or route, using known rooms and connections and respecting the user's prose-first direction (DSG5, UR93). Keep environment accents separate from commitments, focus, and warning colors. This is a distinct trial from moving panels.

## Round 31, 2026-11-18: item details and Village actions

Review of Weibao's two crops against the existing renderers. The crops are evidence of the selected equipment and Village states. Proposals build on the native components and retain the current Gothic font, palette and section frames.

| Code | Section | Proposed change and check |
| --- | --- | --- |
| PS321 | **Item identity and comparison** | The dock draws its header, an Equipment line, the item name, a carried-count line, a slot chip and a comparison sentence before the first stat. Give the name one strong line. Put slot, known quality and a meaningful stack count on one quieter line. Show the comparison target in plain language, such as “Legs empty” or “Replacing [item]”. Lead with known changes. Group unchanged results in the full breakdown, keeping an explicit no-benefit result when nothing changes. Keep the empty-slot baseline distinct from an unknown facet. The screenshot's `×0.99` and `−0.01 lost` are values on a multiplier scale; the dock can say “Agility multiplier −1%” against an empty slot and leave the exact factor in the full breakdown (UR46, UR61, UR96, UR147). Check empty slot, actual replacement, unknown facet and no change. |
| PS322 | **Item actions and details** | The selected-item title and relevant effects should remain readable before the sticky buttons. Keep Equip or Use prominent, keep Full item as navigation and Close as dismissal, and give secondary commands their own disclosure. The shell already derives granted actions from the native inventory row. Use the native item model and distinguish item contribution from predicted final character values. Verify that Equip shows the newly worn state, closing returns to the same inventory row, and opening or dismissing a preview commits nothing (UR23, UR43, UR52–UR55, UR95). |
| PS323 | **Place header and sections** | The Village crop places right-aligned Actions, Home and Options above a band with no useful content. Keep the place title, short description and More together, and try fitting the tabs directly against the content they switch. Clarify Home by destination, such as “Homes” if the route is housing. Reserve the interstitial space for the actual current-work line when present. Keep the separate Crafting and Mixing workspace routes and their native return. Check which tabs and work lines actually own the gap before removing CSS or nodes (UR10, UR22, UR46, UR69, UR108). |
| PS324 | **Village activity groups and exits** | “Village practice and familiar ground” and “Local life · 3 of 6 ready” look like two peer banners. Treat each as a meaningful disclosure and put its own count, if any, in its label. Keep the native verb order. Put destination and time in consistent positions, with “dangerous” conveyed in text as well as the warning mark. Use the existing Ways out owner for world crossings, with a local shortcut only where it serves the active task. The crop alone cannot establish whether both routes are visible in the same state. Check native eligibility, travel quote, active selection and keyboard order (UR26, UR51–UR52, UR61, UR147). |

**Next sections.** Continue with You and Inventory together for resource readability and selection, Here and Journal for what is present versus remembered, then Reports and the footer for consequence versus navigation. Use a small real screenshot and a representative action for each review. At integration, confirm that Equip, travel, opening a service and returning leave neighboring panels and saved layout preferences predictable.

## Round 32, 2026-11-18: refined yet cohesive

Weibao asked which stacking and design choices would improve the whole interface and how far the detail pass can go. This round extends the [large-text evidence in round 30](#round-30-2026-11-18-give-spare-space-a-job) and the two crop reviews in round 31. The positions below are proposals. The current look, in-game controls and owning data remain the comparison baseline.

### PS325 · Compose pairs by how the player uses them

| Approach | Best use | Cost and check |
| --- | --- | --- |
| Stack short sections inside a stable column | Vitals over Condition, place description over Actions, short records over active practice when both are useful. The first section sizes to its content and the larger list has the scrolling space. | A stack can run out of height at 21px. Verify the last routine action, its quote and the return control in the real scroller. |
| Put two related lists or views side by side | Both sides matter at once, such as choosing a recipe while reading its requirements. Give each side room for realistic names, costs and actions. | The current gear pair hit 182px for Actions at the floor. Select this layout only when both tasks fit their available widths with long input and large text. |
| Replace the centre on deliberate expansion | Full item, long comparison, a deep Journal entry, long work setup and a crowded craft bench. Keep You, Inventory and Reports as landmarks. Retain the selected subject and the return route. | One more navigation step, repaid by a real reading area. Verify the same item or recipe and the previous list position on Back or Escape. |
| Let the player keep a reference beside their work | An explicit pin for a known quest, selected comparison or work plan that stays relevant across several decisions. Use the registered panel and existing placement model; begin with one companion. | A stale or wrong-context reference can mislead. Keep source and close visible, and let the context tell the player when the reference no longer applies. Prototype only after the first three patterns work. |

Recommended default: short support stacks in stable columns, simultaneous list and detail where they fit, and explicit expansion for long work. During gear inspection, try the compact task summary first. Choose between beside, below, and expanded using what fits at the actual panel width and text size. Latch that placement until selection, deliberate navigation, or viewport/text size changes. Time, discoveries, and counts update in place (UR22–UR27, UR52, UR69, UR144–UR146).

### PS326 · Finish each section's everyday task

| Section | Hierarchy and fine detail | A real check |
| --- | --- | --- |
| You and Condition | Name and current body lead. Current/max pools have different shapes or labels from XP and rates. Align value gutters and preserve plus/minus and units. Keep recovery or imminent depletion near the affected pool. Condition shows a label, what it does and time remaining, with source and exact rate one step away. Vitality, readiness and warnings keep their own meanings across worlds. | Deplete and recover a pool, gain and lose a timed effect, inspect its source and change lives. Check that only the affected number or row changes and that the character sees no inherited facts their new body lacks. |
| Inventory and item | Keep selected row visible when its count, wear, or filter changes. Use order and alignment to separate name, quality, quantity and value. Reserve a separate appearance for focused, selected and equipped. Hover is a short peek, clicking pins, and Full item opens the full sheet. Keep condition, quality and gear comparison semantically distinct. When an item is spent or equipped, say what happened where the player acted and choose a clear focus fallback. | Filter a crowded inventory, inspect and equip against a worn item, and return to the same row. Separately consume the last of a stack. Try a long name, high quantity, physically inapplicable equipment and an unknown stat. |
| Place and Actions | Fit place identity and prose as one section. Put location tabs against the content they switch, and set apart global task tabs by placement. Align one-line action labels and time/cost; keep quiet chevrons for disclosure, selected tabs attached to their content, and commitment controls visibly actionable. Put blockers in the action row. As work begins, use the same area for doing, interrupting and the result. | Talk, start and cancel work, travel, then return to a bench. Verify which action follows Enter, that the quote matches settlement, and that the route and local tab return together. Compare adjacent action groups with a fold open. |
| Here, Journal and Skills | Here answers who and what is reachable now. Journal distinguishes active obligation, evidence and remembered history; show freshness or source when it affects a decision. Skills gives active practice and its stall reason priority when there is one. A map can replace an overlong list when actual known connections inform the choice. Preserve different information shapes and a clear jump between Here and a stored note. | Inspect a person, leave and return, and compare present versus remembered information. Start practice, trigger a legitimate stall, and open its rule or source from the status row. |
| Reports | Keep the purple full-height default and a stable reading column. Pin a decision when it requires the player; otherwise keep new history legible and preserve reading position when scrolled back. Fold only equivalent repeats, retain a count and differing causes/outcomes, and let recent important lines link to their actual home. Use successive time groups or a recap when time has genuinely passed. | Receive a warning, ordinary gain and repeated event while reading older lines. Follow one source, return without losing place, and verify new lines arrive without shifting the line you were reading. |
| Status line and footer | Status is current facts: place, time, current work and save state. Footer gives routes and save controls. Preserve the labels and consequences of Save, Export and Import. Put low-frequency tools in the existing menu, with direct paths for daily tasks. Match font strike and line height, affordance layers and keyboard cues to the same shared scheme. | Use an overflowed shortcut at 21px, dismiss the menu, and verify focus and return. Test read-only and save error presentation. Check which important labels clip at the smallest supported width before making any control smaller. |
| Crafting, combat and world-specific views | Crafting is an input/quote/output sequence, a fight shows the situation and intent before moves, and a magical preparation can show its actual stages and prerequisites. Use the same controls, cost wording and feedback rules across these shapes. Apply world dressing through existing Appearance precedence, materials, glyphs and prose. Keep the native state and quote underneath each. | Run a ready/blocked craft and a live fight with a stance change, then open one world-specific task. Shared control meanings are recognizable and its form makes the world or mechanism legible (DSG12–DSG19, UR93–UR98). |

### PS327 · Refine across seams, then inside the pieces

- **Typography and rhythm.** Check actual Gothic glyphs, integer strikes, regular weight, clear fallback for glyphs outside the bitmap alphabet, and the same numeric and prose roles across neighbors. The round 29 verification checks rendered fonts. Extend its coverage per touched section, including a review of existing small text that inherits a larger bitmap strike. Use the small spacing token inside a group, a visibly larger one between groups, one header baseline, and a hairline only where the next thing changes role.
- **Meaning of marks.** A frame encloses a section, a chevron opens a disclosure, an active tab marks its content, a pressed chip filters, and a status chip reads as information. Keep these distinguishable without color. Keep a separate focus ring from selection, urgent color from rarity, and unknown from zero or unavailable.
- **What changes on input.** Pressed feedback acknowledges the input; current progress answers while work is pending; settlement shows what happened and the next action. Give reduced motion the same static information. Settle a layout once at the interaction boundary, and leave the rest of the board quiet. Use the native outcome and message identities to keep reload from replaying transient feedback.
- **Data and performance.** Prefer existing kit parts and the owning model/selector. Keep identity and controls stable through repeated updates; update a changed value locally. Limit expensive detail work to visible, active surfaces and remeasure geometry at stable moments. Verify large lists and sustained ticks with browser geometry, focus, and representative input responsiveness rather than a pristine still only.
- **What earns readiness.** Inspect neighboring sections together at the supported viewport and type matrix. Check normal, focused, selected, blocked, pending, settled, empty and crowded states as applicable. Run the actual before/after route. Record raw and large-text screenshots, keyboard and pointer paths, clipping inside the real scroll owner, movement of unrelated controls, and the chosen candidate. The look check complements the existing flow and runtime gates (UR97, UR100–UR101, UR138, AD43).

### PS328 · Build order for a cohesive pass

1. **First proof:** Inventory → compare two items → equip → return to the same row. Prototype the compact comparison with the real renderer. Compare the three placements at 14px and 21px. Read both the item's contribution and the resulting worn change without confusing them.
2. **Second proof:** Village → choose work or travel → see cost, current work and outcome → return. Refine the place header, local group and immediate feedback together. Compare compact grouping while also checking Reports and status.
3. **Broader pass:** Revisit the same patterns through one crowded inventory, one full craft task, one encounter and one non-Village life. Review the nearby section pairs and normal menu/shortcut paths to catch seams. Promote common fixes into shared owners and keep task-specific composition with its feature.

Success can include intentional breathing room. Keep an empty area when the player has no current task to fill it and when it helps the next thing stand out. Offer spare space to a real current decision when a neighbor is clipped. Avoid permanent new surfaces based simply on a sparse opening capture.

## Round 33, 2026-11-18: compare, equip and return

Weibao authorized the first PS328 live prototype and a 14px/21px comparison of beside, below and expanded. The [live layout preview](../../../../prototypes/live-layout/README.md) builds local `b862a6dc4` plus a temporary item-card patch. It uses the Gothic default, native item model, equipment commands and center view. A disposable fixture adds Wolf leather armored pants alongside the starter pair so the player is trading off real effects. The compact card displays the current replacement target and three changed contributions, with any additional changes reachable in Full item. It shows both ends of a multiplier change, preserving the model's units and direction.

| Placement | Browser result | Recommendation |
| --- | --- | --- |
| Beside | All three compact rows and Equip fit at 14px and 21px across 1920×1080, 1800×1040 and 1536×864. At the floor with 21px, Actions shrinks to 182px and travel labels wrap heavily. | Useful when monitoring gear is the primary task and Actions has spare width. |
| Below | At 14px and at both larger viewports at 21px, all three compact rows and Equip fit. Actions kept 638px at desktop and 597px at the MacBook target. At 1536×864 with 21px, nothing in the comparison was fully unobscured before scrolling, though Equip remained visible. | Recommended quick comparison at 14px and at the two wider viewports in the tested 21px case. |
| Expanded | Full item gives its description one scroller with Equip and Close above the native Back row. All five changes fit at 14px and at the two larger 21px viewports. Three of five initially fit at 1536×864 / 21px, with the rest available by scrolling. | Recommended at the high-text floor and for a detailed comparison. |

**Browser proof.** The runner verified the rendered Gothic bitmap strike and clipping against the actual ancestors and hit targets across all 18 combinations. In six complete journeys at the 1536×864 floor it equipped the 40% starter pair, opened the 65% candidate with the keyboard, equipped it through the real game command, and closed the item with focus on the same native item key in the equipped area. The old pair moved back to carried inventory. Page errors zero. The preview patch addresses the expanded-view issue found on the first pass, where Equip fell after the full scrolled body. The product placement is still open. This fixture covers a single worn-gear comparison on the Village's idle screen.

### PS329 · Use the room below Journal

Weibao asked about reducing scroll and using the area below Journal. Added an idle preview placement that routes the actual item panel through the shell's existing Journal region. The first run at 1536×864 and 21px showed two of the three compact changes and 94px of detail overflow. The Journal itself still included a 263px fixed Quests body, even with one short quest. The revised preview lets Quests fit its content, with the existing 263px as the scroll cap. It pins the item controls and lets only the item description scroll if needed.

On the same Village gear fixture, the revised placement kept the replacement target, all three compact changes, and Equip visible without scrolling at 1920×1080, 1800×1040 and 1536×864 at both 14px and 21px. At the floor it kept Actions 476px wide. Equip and Close returned focus to the same equipped item. The Journal bounds before and after the journey matched. Rendered Gothic strike checks passed and no page errors were recorded. This check uses one short Journal and one worn gear comparison. It does not establish the result when Here, Skills or a long Journal fills the column.

Recommendation: favor this placement for the tested spare-space case. Keep Full item as the deliberate route to all effects and provenance. Before adoption, check a populated third column and a non-Village life. Choose placement only when inspection opens or the player deliberately changes view, so a quest update does not send the item card across the page (UR52, UR69). The next scroll improvements to try are station/route actions with visible costs and one clear scroll owner per working section. Keep an empty companion slot quiet between tasks.

## Round 34, 2026-11-18: viewport and input scaling

Weibao asked whether the large-text capture was zoomed and asked to consider his screen, Chromebook and phone play. The earlier capture was the 1536×864 floor at 21px game text. Fresh Chromium captures held the visual viewport scale at 1.0 and used the same Gothic gear fixture at both 14px and 21px. The Mac reports a 3024×1964 physical panel, 1800×1169 logical desktop, and an 1800×1071 visible work area. The last is a window-size proxy. The established 1800×1040 browser target was also checked.

| Probe | Result | Proposal |
| --- | --- | --- |
| 1920×1080 and both Mac targets | Three comparison changes and Equip visible at both sizes in the short-Journal preview, without page scrolling. | Keep 1920×1080 at 14px as the default review capture. Show 21px as a separate comparison and use the actual available CSS space for Mac checks. |
| 1366×768 Chromebook-size and 1024×768 small window | Three changes visible at 14px in both. At 21px, two fit at 1366 and none fit on first view at 1024, with Equip still visible. These are Chromium size probes, separate from ChromeOS hardware and performance. | Use two useful panes when four cells become too narrow. Keep Actions primary and let Inventory, Journal or the selected comparison share one deliberate companion slot. At narrower or larger-text settings, use the full item task and retain direct keyboard routes. Trigger layout on room to read and use the controls, not the device name. |
| 390×844 touch emulation | Current document has no viewport meta. Chromium laid it out at 980 CSS px and scaled it down to about 0.40. Adding device-width metadata to a diagnostic response brought the scale to 1.0. There was no sideways page overflow, but the narrow shell stacked ten panels into about 2864px of vertical content. | Start with one active view on phones, plus small persistent status and navigation. Use the existing owners for the place, Bag, Journal and Reports. Put item reading and Equip in one touch-friendly item view, no required hover. Test 360px and 390px portrait, short landscape, browser controls, safe areas and typing before a mobile delivery claim. Keep pinch zoom available. |

Treat font size, density and layout as three different choices (UR33, UR60, UR65–UR69). Keep crisp Gothic at its matching strike, with a plain large-text choice. A density choice changes spacing and controls. A narrower layout shows fewer parallel panes while preserving routes, selected subject and return. Touch keeps room between actionable targets; keyboard and trackpad retain focus and scroll behavior. The smallest useful prototype is narrow-laptop compare/equip at 21px, then a phone Home → Bag → inspect → equip → return journey on an actual phone. These probes change no product defaults.

## Round 35, 2026-11-19: split by task and show what powers change

Weibao asked about his Mac's More Space setting, which Chromebook widths deserve attention, where to split or stack the desktop, and what gameplay merits new UI. Phone work is low priority.

### PS330 · Layout targets are usable CSS space

- Apple's [14-inch MacBook Pro specs](https://www.apple.com/macbook-pro/specs/) list a 3024×1964 native panel. The screenshot shows More Space selected, which [Apple describes as display scaling](https://support.apple.com/en-gb/guide/mac-help/mchl86d72b76/27/mac/27). This Mac currently reports 1800×1169 logical points and about 1800×1072 available on the visible desktop. Browser chrome and page zoom can change the viewport again. Keep 1800×1040 as the existing browser proxy and 1920×1080 as the standard capture. Test shipped 14px and actual 21px text independently of OS display scale. Keep 1536×864 as the large-text floor.
- Google's [current Chromebook store](https://www.google.com/chromebook/shop-chromebooks/) lists Full HD models, and its [Chromebook Plus hardware standard](https://blog.google/products-and-platforms/devices/chromebooks/chromebook-plus/) specifies Full HD IPS or better. The [Acer Chromebook 311](https://www.acer.com/us-en/chromebooks/acer-chromebook-311-cb311-11h-cb311-11ht/pdp/NX.AAYAA.004) documents a 1366×768 SKU, and [Lenovo's Chromebook Plus Gen 10](https://www.lenovo.com/us/en/p/laptops/lenovo/lenovo-edu-chromebooks/chromebook-plus-gen-10-14-inch-mediatek/83my000vus) documents 1920×1200. These are products and a category minimum, without a measured share of Chromebooks in use. Use 1920×1080 as the primary laptop capture and 1366×768 for a compact-window check. [ChromeOS display scale and page zoom](https://support.google.com/chromebook/answer/6320705?hl=en-GB) can shrink the usable CSS area even on a Full HD panel. A 1920×1200 check can test whether extra height accommodates useful content without opening extra panes. Browser geometry and actual Chromebook responsiveness need distinct evidence.

### PS331 · Lend a row or a span where it keeps a task together

| Region | Proposed arrangement | What wins or loses the space |
| --- | --- | --- |
| You and Inventory | Short vitals and Condition above Inventory. Keep the inventory list as the tall scroller and pin filter/selected item affordances where needed. | A new passive adds a row to its existing condition or stat source, with detail available by inspection. A crowded inventory keeps its usable list height. |
| Place and Actions | Place header, groups and current work form a short stack. Existing native actions stay full width. | Keep the lower area as a companion only when a task needs it, such as the cost and method of active work. When inactive, keep a quiet area without a second action or Journal list. |
| Here, Journal and a companion | Preserve Here or Journal where currently placed. Let a short Quests tab fit to its rows. One deliberately selected companion can borrow the spare height. | Gear comparison, an active practice readout, or an ability's context can use the same slot. A populated Journal or useful Here view keeps its space; the companion can expand deliberately instead. Latch the placement through inspection. |
| Wide comparison | Prototype a lower workbench spanning the two middle columns after the player opens a long comparison; keep Journal or Here above it and Reports right. | Worth trying when the item picker, quote and effects benefit from width simultaneously. Compare with the existing Full item route before adding this layout. |
| Compact window | Keep an active pane and one switchable companion when the four-column widths fail. Put full tasks and independent lists behind existing direct routes. | Test on width available after font scale. Never move a pending action because a new event or count appeared. Phone work stays behind desktop and compact laptop. |

The current gear fixture favors below Journal, and the column has not been justified for a busy lead life. For the next prototype compare a short and busy Journal at 1920×1080, Mac proxy and 1536×864/21. Check reading, equip, return and whether an important nearby section is displaced. Reuse the existing layout owner and account for explicit player placement (UR52, UR58, UR69, UR144–UR146).

### PS332 · Show action, perception and ability state in their owning views

| Situation | Player-facing detail | State change that proves the UI |
| --- | --- | --- |
| An ability changes what you can perceive | Appraisal reveals a row on that item. Foresight adds a known prediction next to the affected action with a horizon and confidence. Fresh, remembered and uncertain evidence look different. | Inspect the same subject before, during and after the means. An old observation can remain in the Journal with time and source. Live readings go away when the power leaves or is suppressed. |
| An ability changes what you can do | Show a new eligible verb where you would act, with real cost, target, range and blocker. A charge or cooldown belongs beside the verb that uses it. | Spend the last use, or leave the scope. Confirm the button and its reason reflect the actual rule while the report names what happened once. |
| An ability changes what a place or clock does | Put the rule and its scope on Here, or put whose clock is running in the status line. A chosen rewind gets a timeline and previews what returns, carries and ends. | Compare one affected subject and one outside the scope. After expiry or a change of place, the rule leaves the live display and remains in its history. |
| A passive changes a result, quietly | Put the contribution in the owning comparison or consequence. A ward that held, protected condition or shortened task should identify the effect and its source when the actor can know them. | Play without the passive, with it and after expiry. The UI explains the actual difference without adding a new notice on every tick. |
| A conditional, loaned or world-limited ability changes status | Distinguish ready, missing prerequisite, exhausted, suppressed, expired and out of scope. Compare known origin, remaining use, and the hand-off or recall terms where relevant. | Two powers can show the same unavailable icon with different reasons. Reload or cross a boundary and confirm the panel agrees with the gameplay owners. |

Readout controls as proposals under UR85 and UR151: **Automatic**, **On demand**, and **Hidden** for optional readouts, with a per-ability pin if useful. Automatic makes the earned affordance appear in place when relevant. On demand puts it behind one obvious control. Hidden folds optional chrome while required cost, blocker, danger and return remain where they are needed. Separately offer **Plain / In-world** for presentation. Effects and reduced motion continue to own the animation. A real activation, maintenance cost, knowledge grant and duration stay with the gameplay ability. A readout preference changes where granted information is drawn, and never grants facts the character lacks. Keep critical information in words, with both keyboard and pointer routes. Apply the [effect UI proposals](../../../ui/EFFECT_UI_STANDARDS_2026-11-18.md) for source, notice and persistence.

First ability proof: use the existing Return to the mark panel on a safe, earned or clearly fixture-granted route. Preview what comes back, what carries and who may remember within character knowledge. Put the optional memory detail under Journal or on demand; keep the active choice beside Return. Verify before/after, expiry, readout modes, reduced motion, reload and a single settled report. Use the same source and compare against a short quest and a busy Journal. Broader abilities can follow the same eligibility and display distinction.

## Round 36, 2026-11-19: busy Journal memory detail and combat

### PS333 · Move the earned readout without moving the ability

Built on local `33e84f692` in the live-layout preview. The disposable fixture activates six real quests and supplies two memories through the registry after Set the mark. Return uses the native button. **Below Journal** docks the existing list under Here and Journal and leaves the main terms, result and cooldown local. **On demand** puts exactly that list behind a keyboard-operable disclosure on Return and removes the dock. The Journal dock is conditional on the Return view and a memory entry.

Both placements passed at 1920×1080 and the measured 1800×1072 Mac work-area proxy, with an additional check at the established 1800×1040 browser proxy. The six quest entries remained, the docked memory row was unobscured, and Rowan's familiarity persisted across reload. The toggle changed neither the rewind save nor actor memory. This proof uses one familiarity entry from a seeded return. The native current-result line and optional long-lived history both mention Rowan on that return. Before adopting the UI, separate the at-a-glance result from repeated historical detail when both are visible.

Default recommendation: **On demand** for one short memory, since it sits at the point of use, opens by keyboard and keeps the Journal slot free. Below Journal remains useful as an explicit companion for reviewing several entries while leaving Return controls open. Next test a multi-entry history and longer Journal at 21px before choosing a default or persisting the preference.

### PS334 · Preserve YAIR auto-combat and make the stakes of a manual fight clear

Fresh 1920×1080 and 1800×1072 captures came from the same rebuilt candidate. Native combat was reached by entering the Infested field and stepping its ordinary clock on the mid fixture. The move-by-move road contest used the existing seeded field route and real Start and Quick strike controls. The initial tactical attempt kept asking a decision-paused clock to advance; the replay started and acted without bulk stepping. The replay produced a visible Quick strike result and zero page errors. The [original YAIR capture](../../../../prototypes/yair-columns-2026-11-15/native-yair.jpg) is the archived baseline. Upstream `e3356432a` starts player and enemy attack loops on the encounter, with each enemy's health and attack bars.

| Layer | Do first | Add after the basics hold |
| --- | --- | --- |
| Standard YAIR loop | Keep automatic attacks, enemy HP/attack cadence, a readable stance and one retreat control. Move the current-fight headline above unrelated quest advice. In the OOPS Infested field capture, the same exit appears as Go back and Withdraw, while Reports gives the old Village instruction. Use the actual retreat destination and time. | Show one concise wave result with enemies cleared, loot and important changes. Keep individual details reachable in Reports. Keep the same automatic flow when the player wants to let a familiar encounter run. |
| OOPS move-by-move | Give the active contest the centre until it settles or the player deliberately opens another view. The capture keeps the Notebook open beneath the fight and shows an Open waiting response control while the response is already visible. Keep turn order, real move cost and a visible yield/retreat. Preserve unknown intent and unopened foe facts. | Reveal the extra information only when a capability supports it. A learned read can add known intent or a tell next to the affected opponent, a ward can show the changed outcome, and a loaned move can show remaining uses beside the cost. Let optional readouts fold and use a plain-text effect option. |
| Shared test | Native field: change stance, follow a wave, retreat. Seeded contest: choose a move, read the outcome, then leave. On both paths check title, HP/cadence, target and escape with keyboard, 14px/21px, reduced motion and a populated Journal. | Add one real power to the contest, show its changed decision and expiry, and verify that two visible panes agree and Reports records the outcome once. |

No combat layout change in this round. The first next patch is the single retreat action and combat-aware headline on the native path. Then test Notebook yielding to the active contest while the player's normal return remains predictable.

### PS335 · Give each combat mode its own job

Weibao asked to keep YAIR's auto-fighting, show one Withdraw action and fight-aware Reports, and give the move-by-move fight the center. This pass uses the Gothic desktop shell at 1920×1080 and the measured 1800×1072 Mac work area. The player sees “Withdraw to Village · 15m” in the field. The route still runs through native travel and uses its existing guards. A missing route keeps Withdraw disabled with a reason. The field fight keeps its original opponent, HP and attack cadence. Reports gives Combat the briefing slot while the fight is live and folds navigation chatter behind a toggle. Fight, loot and other gameplay reports still use their existing categories. The previous briefing returns after combat.

A move-by-move encounter opens in the existing center stack. The card shows turn order, what the character can read of each fighter and the cost of moves. Back and Escape leave the fight running or waiting on the existing combat rules. Return to fight reopens it from Local actions. Settlement returns the previous center view, reports the result and announces it to screen readers. The UI keeps transient state. The existing encounter, timing, knowledge, travel and save owners still decide what happens. Rules used include UR34, UR36, UR44, UR52, UR89, UR93, SUI2 and RPT8. The main risks are a second visible native exit, Notebook stealing focus and the escape row clipping at large text. The browser replay checks against the actual controls.

**Special encounters.** Keep one combat card and let the actual decision set the visual priority. A duel gives its terms and what yielding means a place near the moves. In the road contest replay, offering to yield could be refused. Back away was a separate attempt. A hunt should put quarry, trail progress and the decision to continue or break off together. A warded fight should name the known ward and what will break or outlast it beside the opponent it protects. Group fights should show companions' current commitments and the known target or “target unread.” Avoid filling an empty panel with duplicate combat facts. In an extended fight with several actors or hazards, the best use of that space may be a conditional turn-order track or objective list from actual fight data.

A learned ability can change what the character sees or can act on. Show an earned tell by the opponent, a remaining use beside its move or a standing effect in Condition. A display dial should control optional cues and motion while preserving words for price, danger and consequence. The next useful special-fight proof is one real ward or learned tell that changes a choice mid-fight and clears at the right time. See the [combat representation](../../../representations/COMBAT.md) and [effect UI proposals](../../../ui/EFFECT_UI_STANDARDS_2026-11-18.md).

**Receipt.** The fresh local build used working-tree inputs at `dc4e5ba49` and bundle `v0.6-b0877a98d613`. The mid fixture reached the Wolf rat through normal travel. The field-route fixture reached the road contest through the native Start control. The browser replay watched automatic hits, withdrew to Village, restored the briefing, started the duel, made a Quick strike, returned to Notebook, reopened the same contest, and used the actual yield and retreat controls through settlement. Browser errors were zero. Both Gothic bitmap strikes loaded at both sizes. At 14px and 21px the first strike, Yield and Back away were hit-testable without scrolling. The 21px replay also used Enter and Escape with reduced motion. Thirty focused tests, architecture and rules checks passed. Rules reported non-blocking working-tree warnings. No save-schema or engine change. Browser-verified locally with pre-existing working-tree edits, pending human acceptance.

### PS336 · Compare the combat composition against both originals

Reviewed the local combat build from PS335 against [Proto23's native training-dummy capture](../../../../prototypes/workbench/evidence/character-2026-10-26/native/proto23-combat-1920-14.png) and [upstream YAIR's Wolf rat fight](../../../../prototypes/yair-columns-2026-11-15/native-yair.jpg), with YAIR's pinned source at `e3356432a`. This is a comparison of hierarchy and visible controls across three encounters, with a fresh browser replay of OOPS at 1920×1080 and 14px. The reference images show different encounter states.

| Finding | Evidence | Candidate correction |
| --- | --- | --- |
| F1 · Auto-combat hides its pace | YAIR gives the hero a Combat pane with stance and attack progress. The enemy's HP and attack progress are distinct, and group counts and retreat stay attached to the board. In OOPS the native hero bar was hidden and the live opponent cycle was 2.23 CSS px tall. A field description separates the opponent from Withdraw. | Give the existing auto-fight one compact region for both cycles, stance, wave counts and the single native exit. Fold field description to the place header. Use the actual attack progression and give HP and cadence distinct tracks. |
| F2 · The fight and its consequences are too far apart | Proto23 aligns You and enemy across the top and puts the full-height log on the enemy's right. OOPS inserts about 500 CSS px of Journal or Here between the fight and Reports. In the duel, approximately 400 CSS px of blank center separates the card from Back to Notebook. | Put the full-height Reports next to the active fight and keep the normal dock layout for the return. Consider putting Journal in the spare column or a tab while fighting. Test the paired layout and return at both text sizes. |
| F3 · The duel centers the card but retains the idle screen's hierarchy | The left column still shows hero vitals and inventory, while the card repeats hero vitals. The Here rail gives routine services and routes more visual space than the contest decisions. Its Go button for Wild willow stand looked enabled, but clicking it kept the player in Village and logged a refusal. Yield and Back away look like ordinary moves and their consequences are carried by tooltip text. | Give each vital one home in the fight layout. Put whose move it is, what is at stake, and the latest decisive change next to the moves. Separate fight actions from control over automation and from scene back navigation. Keep the key consequences of Yield and Back away in the visible card. |
| F4 · Exact-looking meter beside unknown health | The duel's opponent bar showed `?/? hp` with a measured 97% fill after Quick strike. The observer-facing health phrase was “Fresh.” | If a capability reveals relative health, label the granted band or ratio. With qualitative condition alone, show the condition and a neutral treatment without a precise fill. |

Use Proto23's alignment and adjacency and YAIR's readable automatic controls. A single-column fight card inside the idle grid does not deliver that composition. Start by changing the shell for the active fight, then refine control and meter hierarchy. The next browser comparison should keep one opponent and include a multi-opponent encounter so the proposed board can demonstrate both cases.

### PS337 · Replay both fights with Reports beside the fight

The default Gothic desktop view uses three columns during combat: You, the fight, and full-height Reports. The auto-fight groups its opponents and native Withdraw in the center. The duel gives the same column to turn order, the opponent, and moves. Here and Journal yield space during the fight, and the normal layout returns with the reference or local view. Explicit box placements remain available through the existing layout controls. The original actions, routes, timers and save owners are still in use (UR23, UR34, UR36, UR44, UR52, UR89, UR93, RPT8).

The previous visual cycle adapter read width, which was always 100% after the native renderer changed to an animated transform. Both visual representations now sample the same published attack timing, including when the old combat pane is hidden. The hero and each visible opponent get an independent native cycle, distinct from HP. The Cave room's sole button reads “Withdraw to entrance · 5m” and delegates to the original exit. The duel shows qualitative opponent health and puts the consequences of yielding and backing away beside those controls. Unknown HP supplies no fill.

Browser route: unlock the ordinary Nearby cave route in a disposable mid-life fixture, travel to Cave room, and play two Wolf rats in the live native loop. Sample all three moving cycle bars and return to the entrance with Withdraw. For the special route, use the existing field fixture to open Mara's road contest, take a Quick strike, read it in Reports and leave through the existing encounter controls. The build comes from the working tree at `dc4e5ba49`, bundle `v0.6-1ac160bc6910`. The 1920×1080 and 1800×1072 captures are browser evidence. No save-format change.

The browser measured a 10px gap between the fight region and Reports at both sizes. All three native attack bars changed in consecutive samples. The duel had no numeric enemy health meter, and the footer Journal opened during the bout and returned to the same fight with Escape. Both routes passed at 14px and 21px with zero page errors. All 109 focused tests, architecture and rule checks passed. The rules check reported non-blocking working-tree warnings. Local browser verification is complete for these fixtures. The default Gothic layout was exercised, with custom placements left intact.

### PS338 · Use the lower fight space for the decision at hand

Design review based on Weibao's upstream YAIR field and Proto23 training-dummy screenshots, the PS337 native replays, and the current combat owners. The two reference screens show different encounters. YAIR separates HP from attack fill and gives wave progress and the exit a fixed home. Proto23 makes player and opponent totals comparable at a glance and holds place and encounter state beside a full-height log.

- **D1 · Align the combat readouts.** Put the hero attack cycle at the same height as the first active opponent's cycle where space allows. Keep one labeled health band and one distinct attack track per actor. Enemy rows stay stable across inspection. When names repeat, give the opponents stable, linkable identifiers in the roster and Reports. Keep the native Withdraw immediately under the compact roster and wave status. Leave the rest quiet on a routine wave. Under You, use the existing Inventory and Condition routes for usable items, effects and combat modifiers. Let the lower center handle real wave transitions, reinforcements or an exceptional decision as needed.
- **D2 · Move the duel's second You into the existing You.** Keep vitals, readiness, strike type, your actual capabilities, injuries and available resources in one home. Place the enemy condition, stakes and initiative in the center. Keep the two sides aligned where the screen supports it. A companion commitment can occupy an extra row when it matters. Park inactive references and keep Reports next to the fight.
- **D3 · Extend the duel by explaining the chosen move.** Compare a compact move grid with a lower inspector that opens for the selected move. Expose beat cost, target, known risk, resource use and the reason a move is blocked. Keep visible escape consequences near Yield and Back away. Use extra room for target, aid or ward decisions only when present. A safe focus or preview must never commit a move. Test keyboard, 14px and 21px with zero and several contextual moves. A short queued-action view is worth trying only if the model can quote real scheduled actions.
- **D4 · Make automatic control a policy on the same move model where it works.** The existing Fight on command runs a capped steady policy and already handles stops for certain stakes, injuries and health. It is a starting point for a reversible cave trial, with auto by default and Take over only at a settled decision boundary. Choose what requires an ask and make the resume reason visible. Verify saved pending actions, away progress, native stamina and skill gains, multi-foe cadence, loot and wave counters, failure and retreat, and one report per settled move. Compare current and candidate results from the same starting state. Call out deliberate balance changes before replacing normal fights. Both systems can use the same presentation during the trial.

This is a proposed next slice following PS337. No runtime changes or migration were made in this design review.

### PS339 · Stage the move before committing it

Scope authorized by Weibao: align the wolf attack tracks, return the duel's player-specific information to You, use the lower center to preview existing moves, and consider styles, weaponry, powers and techniques across worlds.

The desktop fight aligns the hero track with the first live enemy track on the adjacent board. It reads existing cadence. The rest of the enemies keep their own tracks and the native Withdraw remains the exit. In the centered duel, the existing left vitals now host readiness, attack mix, resources and ally details when available. Center shows the opponent and decision. Focusing or pointing to a move puts the move's known type, beat or resource cost, applicable aim or odds, effect and blocker in a lower panel using the current contest projection. The same button still executes when pressed. Other layouts retain the inline player readout. Rules: UR34, UR36, UR38, UR43, UR52, UR93 and SUI5–SUI6. Fixtures: Cave room with two Wolf rats and Mara's road contest. Failure checks cover meter alignment, a second player card, preview dispatching an action and losing the previous view.

| Proposal | UI home | What governs it |
| --- | --- | --- |
| Styles, intent and type | Put your style and stance under You, the fight's aim and terms above the moves, and a known opponent tell on that opponent. In a move preview distinguish its delivery method, the source doing it, its damage mix, and any other effect. Say plainly when a move binds, moves, or disarms without dealing damage. | Use the existing stance and stakes readers, type vocabulary and observer-qualified knowledge. A wind-up can be seen without revealing exactly what it will do. Do not imply a percentage for a type that was not calculated by the move. |
| Means across worlds | A mundane weapon can show grip or reach when relevant. The example retractable blade needs deployed state and reach during its move. The example powered fists need the actual charge and effect of a hit, if those mechanics exist. A manifested power can show presence, perceivability and the reach of its ability. | Give a separate actor row only to something that independently acts or can be targeted under the encounter rules. Use the world's names and restrained styling over the same left, center and Reports composition. Preserve words when effects are off. |
| Techniques | A known technique can unlock an active move, modify a move under a stated condition, confer a passive effect, or combine those where they describe the same learned practice. Under You, surface the modifier only where it applies. In the move preview, name the technique as the source and quote its requirements, effect and timing. In practice, show what proficiency changes. | Start with the existing technique knowledge and proficiency record, shared combat move and kit contracts, and the existing owner for supported stats or effects. Resolve a move and any granted modifier through those owners so an effect applies once. Make automatic use a policy choice, especially for scarce resources or consequential moves. |

Proposed first technique proof: reuse Rat-step's existing ownership and proficiency gates in a combat drill. Try a footwork response to a readable opening and a benefit that applies while already repositioning. Both use the earned footwork, so the UI can explain why a particular action improves. Check learned versus executable, a failed setup, passive stacking, and auto use before extending it to other worlds. The current Rat-step record already supports observation, understanding, practice and internalization and can be executed at the crossing. Combat use is proposed.

Browser receipt: local working-tree bundle `v0.6-dc8f420e3499` at `96b0b8d04`. At 1920×1080 and 1800×1072, both Gothic text sizes (14px and 21px) produced a first-rat versus hero track difference that rounded to 0 CSS px. The duel kept only the left player readout. Pointer and keyboard focus switched Quick strike and Heavy swing previews without adding a Combat report. The separate real strike still landed and was reported. Journal and Escape returned to the same bout, and native Withdraw returned to the cave entrance. Both browser routes passed without page errors. All 49 focused tests and rules checks passed. The checkout-wide architecture check reported the existing `src/main.js` line count above its baseline (10117 versus 10115). This slice does not edit that file or change the save format.

### PS340 · Rat-step counter and recovery in the road contest

Weibao asked to build the active move and passive recovery bonus in live Gothic combat, show the quote for both, replay automation, and consider fight prose, color and HP. This is the PS339 technique proof. Rat-step uses the existing technique owner and its Frontier requirement of ownership, 6 proficiency and Agility 8. At fight entry it grants a counter on the move-by-move engine. When a foe's ordinary strike goes wide, that foe is the counter's target until your next action. Use the shared strike resolver, spend the ordinary strike's stamina, and record one exercise of the technique after the step takes place. The move normally costs 4 beats at standard speed. At 12 proficiency, its recovery and Back away each cost one beat less, with a one-beat minimum. The actual clock and the preview use the same recovery rule. A failed retreat still has the existing penalty. This is a combat technique and a recovery bonus for two specific moves.

The steady policy prioritizes a ready counter after urgent tending. The careful hand-over does not attack. There is no new power or stamina source. The fight stores only the optional mastery flag and the current opening's target. Existing fights that lack the record behave as before. New fights read current eligibility at entry. The technique record and optional fight record use the existing save owners.

The earlier duel line assigned a private motive from generic stakes. Removed that fallback and kept the specific authored lines where supplied. Use witnessed action, spoken terms or earned reads. A direct example from the settlement now reads “You slip inside Mara's reach and answer with Rat-step.” The button, timing and damage quote stay terse. If a detailed account is wanted, the Reports result can combine the visible action and one meaningful consequence. The same Gothic opponent background and attack-track colors now apply to a duel and the native roster. Color does not identify species. Use labels, positions and the visible action for that.

Next comparison for wolves: Keep the existing attack cadence and single Withdraw, give repeated opponents stable labels in the roster and Reports, and show only observed changes that affect danger or timing. Exact personal HP belongs under You. Keep the established numerical readout where an encounter genuinely supplies it, as in the native wolf fight, and use health words without a precise fill when a character sees only condition. Wounds, ward strength and a fight's loss condition are separate readings. This round uses the existing native field fight and the tempo Fight on policy, with no migration of ordinary wolf fights.

Receipt: rebuilt Gothic bundle `v0.6-988019bb07e4` from the local working tree at `96b0b8d04`. The disposable fixture seeds the existing technique record and road-contest prerequisites. It omits two unrelated workshop items that the import probe cannot resolve from the old performance fixture. Real Start and a missed strike opened the counter. The 14px and 21px replays covered 1920×1080, 1800×1072 and 1536×864. The counter control was hit-testable before scrolling in all six cases. Both previews showed the 3-beat quote and mastery reduction. A manual counter and Fight on each committed an execution. Native Save, reload, Export and literal-file Import preserved the mastery and pending opening. No page errors; the preview reported missing asset requests during the import journey. Both focused suites passed (84 tests total), including eligibility, real timing, policy and old battle round-trip regressions. Rules checks passed with existing non-blocking warnings. The architecture check still flags the shared checkout's existing `src/main.js` count (10117 versus 10115). No product save was used. Browser verification is local and the proposed tuning is open to human review.

### PS341 · Duplicate enemies, move labels and health detail

Weibao asked whether repeated foes can keep the same name, what the numbers on move tiles mean, how other games present choices, and what HP should show. This round records design proposals.

- **D1 · One name per instance.** Keep two rows named Wolf rat, with their own HP, attack cycle, inspection state and stable slot. The native board already tracks combat subjects by ID and links the relevant row to Reports on hover or focus. Letters remain an opt-in aid. Distinguish targets by stable placement and accessible ordinal in lists. A move should highlight the particular target it will actually affect when the target is determined. Keep inspecting, targeting and being attacked visually distinct. A name match never changes the chosen target.
- **D2 · Put the unit on the tile.** Brace 2, Quick strike 3 and Heavy swing 6 quote beats of fight time in the reference fight. The move resolves and normally pushes the acting fighter's next ready time by the quoted cost. Speed, injury, and applicable mastery affect the quote; some maneuvers and setbacks add time during resolution. Use “3 beats” on the button, and reserve keycap styling for actual shortcuts. If scheduling can quote the next actor safely, preview the known effect on initiative. Show wind-up, stamina, charges and a skill's own cooldown with separate labels when that encounter uses them.
- **D3 · Preview before decisions that need it.** Into the Breach makes telegraphed attacks the focus of the turn. Guild Wars 2 shows activation, recharge and effects as different fields and names which traits changed the quote. For OOPS, use the lower preview for target, cost, consequences and the known next threat. Keep a direct press for a clear move and require selection or confirmation when a target or exceptional consequence truly needs a decision. Hover and focus remain free to explore.
- **D4 · Health shows damage already taken.** Keep exact personal HP, and exact foe HP where the encounter exposes it. With qualitative knowledge, show stable condition words without a percent-filled bar. In both forms, retain the same location and role in the card. Show what changed on a hit, separate wounds and guard or wards when they alter choices, and avoid predicted damage expressed as a guarantee. Give low HP meaning with a known threat or a real loss condition when the engine can support it. Test two identical foes, one defeated foe, one unread opponent and an appraisal that grants deeper knowledge.

References: [Into the Breach](https://subsetgames.com/itb.html) and [Guild Wars 2 skill tooltip and targeting](https://wiki.guildwars2.com/wiki/Skill). The local UI and timing rules were inspected. No runtime edits were made in this review.

### PS342 · Next on the action bars and Rat-step opening

The native attack bars fill from the live combat clock. The actor with the unique earliest scheduled swing gets **Next** on their bar. An exact tie leaves the badge off. Both opponents keep the name **Wolf rat** and their own HP and attack tracks. Mara gets **Opening** when she can be countered, and the available Rat-step button gets **Ready**. The preview shows the 3-beat quote and the recovery bonus from mastery.

Let the rising bar show routine wind-up on its own. Reserve a written cue for a distinct move the player can read and act on. In a turn-based fight, keep the tracks still while the game is waiting for input. Update them by elapsed beats when a move commits, and show **Your move** at the point of decision. A preview could show who would act next after a move when the rules provide a reliable answer. Pausing or enabling reduced motion should leave the timing cues readable.

Local receipt from rebuilt Gothic bundle `v0.6-242e51cb0953`, working tree at `96b0b8d04`. Native cave auto-fighting advanced both live wolf-rat bars, showed one Next badge at a time, and the single Withdraw returned to Nearby cave. A missed strike in the road contest opened a usable Rat-step counter, which the browser executed. Both flows ran at 1920×1080 and 1800×1072 at 14px and 21px. The 53 focused tests and rules check passed. The architecture check still flags the shared checkout's `src/main.js` at 10117 lines against the 10115 baseline. The UI cues add no save fields.

### PS343 · A shared opponent section for the cave and the road contest

Proposed next live comparison. Use one center-column Opponents section with stable, compact rows. Put name and current condition together at the top. Keep health and action timing in consistent positions. Give a deliberate selection a persistent marker tied to its fighter ID, separate from the moving Next cue. Show one selected opponent's details below the rows. Two cave opponents keep the name Wolf rat. The duel uses the same layout with Mara's row selected and her Opening visible beside her name. Keep Reports beside combat.

Mara's fight already tracks HP but its UI publishes qualitative condition. Give that condition a labeled position with the same prominence as wolf-rat HP. Let visible states such as Fresh, Hurt and Barely standing change after damage. Render the exact bar only for encounters or players whose knowledge rules grant it. Put the encounter's outcome condition in the header when the player knows it. Keep stamina secondary so its exact meter cannot be read as Mara's health.

Ordinary fights already resolve each swing. Keep their continuous cadence and individual resolved moves in Reports. The road contest already has Fight on and One careful turn. Show the current control state and explain when automation hands back a decision. Share the layout and vocabulary first. Revisit common engine timing only if play exposes a concrete gameplay need.

Compare two live wolf-rat rows through a defeat and Mara from Fresh through visible hurt and an opening. At 1920×1080 and 1800×1072, including 21px Gothic, verify that the player can identify their current opponent, read condition and timing, distinguish an Opening from a health change, and reach Withdraw or a duel move without scrolling.

Implementation receipt. Both Gothic combat layouts use the shared opponent row and inspection styling. The native board retains the defeated row in its slot while the survivor keeps an attack cycle. The duel puts visible condition in the health position and shows stamina and readouts below the selected row. Yield and Back away carry their descriptions in the move preview and tooltip. Inspection is UI state scoped to the fight; both combat clocks and the saved schema are unchanged.

Rebuilt working tree at `96b0b8d04`, bundle `v0.6-392f9ab2b6b6`, stylesheet `v0.6-393a7e8a82c7`. Played on a disposable local origin at 21px Gothic at 1920×1080 and 1800×1072. The cave fixture equipped an existing Iron sword through the normal equip command. Auto-fighting defeated one Wolf rat, kept both names and slot IDs, and continued the survivor's attack cycle. The single Withdraw returned to Nearby cave. Mara went from Fresh to Hurt through actual moves and missed to open Rat-step. The full preview and counter were visible before scrolling at both sizes, and the counter executed. Focused tests passed (54). The rules check passed with existing warnings. The architecture check reports the existing `src/main.js` baseline overage of two lines.

### Promoted to UI rules, 2026-11-19

The cohesion rows of rounds 23 to 36 are now UR163–UR176 in the [UI rules](../../../UI_RULES.md#cohesive-by-construction-2026-11-19): PS243/PS292 → UR163; PS244/PS245 → UR164; PS247 → UR165; PS246/PS248/PS250/PS251/PS300 → UR166; PS289–PS291/PS297 → UR167; PS296/PS301 → UR168; PS264/PS266/PS295/PS299 → UR169; PS265/PS268/PS278 → UR170; PS267/PS277 → UR171; PS325/PS331 → UR172; PS327 → UR173; PS298/PS316–PS318/PS328 → UR174; PS332 → UR175; PS263/PS285/PS293/PS294 → UR176. The rows here keep the evidence and detail.

## Round 37, 2026-11-23: move the useful parts of the screen closer together

Weibao asked why the current UI leaves so much empty space, what belongs elsewhere, and whether Reports could be more colourful. This is a design pass using the [November 23 browser review](../../../audits/UI_PLAY_REVIEW_2026-11-23.md), current source and the local Reports candidate's 1280 and 1920 crops. The earlier [scroll census](PROTAGONIST_WALKTHROUGH_UI_ELEMENTS_2026-11-20.md#one-page-without-scrolling-op1-to-op8-2026-11-21) found Here and the pack roster scrolling beside open space. PS317 and PS320 already establish task-first content and stable controls. This pass assigns the available space and identifies what to measure.

**ACT NOW (review done).** In the current tempo renderer, `rosterRows` returns a minimum of six for ordinary individual opponents. `sizeRoster` uses the larger of that floor and the fitted opponent count, which guarantees at least six row heights even for one opponent and can exceed the available room. The empty slate in the [Mara capture](../../../representations/evidence/ui-review-2026-11-23/road-fight-1920.png) sits inside the fight between the target and moves. The open space in the [Village capture](../../../representations/evidence/ui-review-2026-11-23/village-1280.png) comes from the column boundaries, which separate a few verbs from the nearby people, stations and exits competing for width in the next column. These call for different changes. [Roster sizing](../../../../src/combat_situation_ui.js#L425) · [Shell tracks](../../../../styles/shell_layout.css#L12)

**ACCOUNT FOR NOW.**

| Code | Placement to compare | What would make it better |
| --- | --- | --- |
| PS344 | **Make Here the center of an idle place.** Put a compact place header, current activity or actionable hint, and local rows on the same surface. Put a verb on its person, station or exit when it has a target. Entering a conversation or bench replaces the local view in the same slot, with Back restoring the selected row and focus. Keep Journal/Skills in the adjacent reference column and Reports full-height under UR11. | The Village can show Hesk and a way out without a second menu. Hogwarts can show an actual workroom entry where the life exposes it. The active bench gets the same central width when opened. Reuse existing route IDs and reject any link the active life cannot take. |
| PS345 | **Size fights for the encounter at entry.** A duel uses a compact target and puts the move strip directly underneath. A pack uses the available height for actual targets before it scrolls, reserving room only for known roster changes. The target and controls hold their positions during exchanges. At narrow widths or large type, fit a readable roster within the space left after moves and use a single roster scroller if needed. | On Mara, the path from target to move shrinks. In a crowded pack, more live subjects stay readable without pushing Withdraw or a pending decision off-screen. Count inner clipping as well as page overflow. |
| PS346 | **Give each kind of information a home.** Use the top strip for place, time, and what is running. Put costs and blockers on the relevant controls, the immediate result beside the action, persistent effects in Condition and the searchable history in Reports. If equipped gear or a recipe is deliberately selected, show its comparison in the central work area. When idle, Journal can give a small active-learning row room below the selected tab. | Each role should be recognisable with panels open together at 14px and 21px. Avoid competing primary routes for the same verb. A long list can scroll. A current choice stays reachable. |
| PS347 | **Give Reports colour and hierarchy together.** Use the existing RC1–RC10 work and semantic tokens. Match the filter underline or outline with the category edge. Let the important fragment carry the punch: gold for coin or the loot marker, the item's own rarity on its name, green for growth, red for damage taken, cool blue for your hit, and muted grey for routine misses and clock lines. Keep names legible even where a highlight overrides the normal hue. | The existing candidate crops show distinctly coloured hits, a Moonblade highlight and gold loot markers. At 1280 the filter chips span three rows, and several tall loot follow-ups plus a stray punctuation row break the cadence. Try compact filters next to the header (labelled menu at narrow widths), a quieter time divider, and one short labelled action beside or below the loot, with disclosure for further routes. A pressed filter has a non-colour cue. |
| PS348 | **Try one quieter alternate using the same content.** Keep the four columns in the default. In an explicit focus layout, let Journal and Here trade their space when the player opens a substantial bench or story scene, keeping a single current objective or selected reference nearby. Keep Reports visible. | An alternate earns its slot if it helps a player recover context after a long task without hiding a routine action or moving controls while the clock ticks. |

**LATER.** Compare PS344 and PS345 against the current layout before changing the shell globally. Moderate frontend effort with the existing native renderers. At 1280×800 and 1920×1080, compare fresh Village, a more crowded Village, Hogwarts arrival to brew, Mara and a pack. Use default type and 21px where it fits the test matrix. Record whether the normal route reaches the next verb, whether target and action fit together, and whether focus and scroll return after Back. For PS347, moderate effort in the Reports candidate after its existing integration gate. Compare a mixed idle-and-combat feed and a loot outcome at both widths. A reader should distinguish damage taken, loot, growth and routine history, and reach a loot follow-up without losing the exchange that produced it. The [publication notes](../../../audits/CLAUDE_FOLLOWUP_2026-11-23.md#publication-follow-up) own the local candidate and its unresolved gates.
