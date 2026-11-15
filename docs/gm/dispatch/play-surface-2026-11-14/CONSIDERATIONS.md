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
